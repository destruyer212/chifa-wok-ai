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
import pe.edu.utp.chifawok.common.exception.NotFoundException;
import pe.edu.utp.chifawok.customer.Cliente;
import pe.edu.utp.chifawok.customer.ClienteService;
import pe.edu.utp.chifawok.order.Canal;
import pe.edu.utp.chifawok.order.MetodoPago;
import pe.edu.utp.chifawok.order.PedidoDtos;
import pe.edu.utp.chifawok.order.PedidoService;
import pe.edu.utp.chifawok.order.TipoEntrega;
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
 * Y al confirmar, crea el cliente (por telefono) y el pedido.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class VozService {

    private final AiClient aiClient;
    private final CatalogoService catalogo;
    private final SesionVozRepository sesiones;
    private final ClienteService clienteService;
    private final PedidoService pedidoService;
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

    /** El cliente confirma: se crea/encuentra por telefono y se registra el pedido por canal VOZ. */
    @Transactional
    public ConfirmarResponse confirmar(ConfirmarRequest req) {
        SesionVoz sesion = sesiones.findByUuid(req.sesionUuid())
                .orElseThrow(() -> new NotFoundException("Sesion de voz", req.sesionUuid()));

        Cliente cliente = clienteService.obtenerOCrearPorTelefono(req.telefono(), req.nombre());

        List<PedidoDtos.ItemRequest> items = req.items().stream()
                .map(i -> new PedidoDtos.ItemRequest(i.codigoPlato(), i.cantidad(), i.presentacion(), null))
                .toList();

        var pedido = pedidoService.crear(new PedidoDtos.CrearPedidoRequest(
                cliente.getId(), Canal.VOZ,
                req.tipoEntrega() != null ? req.tipoEntrega() : TipoEntrega.RECOJO,
                req.direccion(), MetodoPago.POR_DEFINIR, sesion.getId(), null, items));

        sesion.setClienteId(cliente.getId());
        sesion.setIntencion("CONFIRMAR");
        sesion.setExito(true);
        sesiones.save(sesion);

        return new ConfirmarResponse(pedido.codigo(), cliente.getId(), pedido.total());
    }

    private String serializar(Object o) {
        try { return objectMapper.writeValueAsString(o); }
        catch (Exception e) { return "[]"; }
    }
}
