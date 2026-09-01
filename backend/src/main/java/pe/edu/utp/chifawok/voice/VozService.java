package pe.edu.utp.chifawok.voice;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.chifawok.ai.AiClient;
import pe.edu.utp.chifawok.ai.AiDtos;
import pe.edu.utp.chifawok.ai.AiDtos.*;
import pe.edu.utp.chifawok.catalog.CatalogoDtos.PlatoDTO;
import pe.edu.utp.chifawok.catalog.CatalogoService;
import pe.edu.utp.chifawok.voice.VozDtos.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Orquesta el flujo de voz:
 *   1. recibe la transcripcion del navegador,
 *   2. arma el contexto del menu y consulta al microservicio de IA,
 *   3. valida los platos contra el catalogo y calcula totales,
 *   4. persiste la sesion de voz y devuelve el texto para el Text-to-Speech.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class VozService {

    private final AiClient aiClient;
    private final CatalogoService catalogo;
    private final SesionVozRepository sesiones;
    private final ObjectMapper objectMapper;

    @Transactional
    public VozResponse interpretar(VozRequest req) {
        long inicio = System.currentTimeMillis();

        SesionVoz sesion = req.sesionUuid() != null
                ? sesiones.findByUuid(req.sesionUuid()).orElseGet(SesionVoz::new)
                : new SesionVoz();
        if (sesion.getUuid() == null) sesion.setUuid(UUID.randomUUID());
        sesion.setClienteId(req.clienteId());
        if (req.canalOrigen() != null) sesion.setCanalOrigen(req.canalOrigen());
        sesion.setTranscripcionUsuario(req.transcripcion());

        List<PlatoDTO> carta = catalogo.cartaCompleta().stream()
                .flatMap(c -> c.platos().stream()).toList();
        List<MenuItem> menu = carta.stream()
                .map(p -> new MenuItem(p.codigo(), p.nombre(), p.precio().doubleValue(), p.categoria()))
                .toList();

        InterpretResponse ia;
        try {
            ia = aiClient.interpretar(new InterpretRequest(
                    req.transcripcion(), sesion.getUuid().toString(), menu));
        } catch (RuntimeException e) {
            sesion.setExito(false);
            sesion.setErrorDetalle(e.getMessage());
            sesion.setLatenciaMs((int) (System.currentTimeMillis() - inicio));
            sesiones.save(sesion);
            throw e;
        }

        List<ItemSugerido> items = new ArrayList<>();
        double total = 0;
        for (AiDtos.ItemBorrador b : ia.items()) {
            PlatoDTO plato = carta.stream()
                    .filter(p -> p.codigo().equalsIgnoreCase(b.codigoPlato()))
                    .findFirst().orElse(null);
            if (plato == null) continue;
            double precio = plato.precio().doubleValue();
            double subtotal = precio * b.cantidad();
            total += subtotal;
            items.add(new ItemSugerido(plato.codigo(), plato.nombre(), b.cantidad(),
                    b.presentacion(), precio, subtotal));
        }

        int latencia = (int) (System.currentTimeMillis() - inicio);
        sesion.setRespuestaAsistente(ia.respuestaAsistente());
        sesion.setIntencion(ia.intencion());
        sesion.setConfianza(ia.confianza());
        sesion.setModeloLlm(ia.modeloLlm());
        sesion.setLatenciaMs(latencia);
        sesion.setExito(true);
        sesion.setEntidades(serializar(items));
        sesiones.save(sesion);

        return new VozResponse(sesion.getUuid(), ia.intencion(), ia.respuestaAsistente(),
                ia.requiereConfirmacion(), items, total, latencia);
    }

    private String serializar(Object o) {
        try { return objectMapper.writeValueAsString(o); }
        catch (Exception e) { return "[]"; }
    }
}
