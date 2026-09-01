package pe.edu.utp.chifawok.catalog;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.chifawok.catalog.CatalogoDtos.*;
import pe.edu.utp.chifawok.common.exception.NotFoundException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogoService {

    private final CategoriaRepository categorias;
    private final PlatoRepository platos;

    /** Carta completa agrupada por categoria (para el widget y la landing). */
    public List<CategoriaConPlatosDTO> cartaCompleta() {
        Map<String, List<PlatoDTO>> porCategoria = platos.findByDisponibleTrueOrderByNombreAsc().stream()
                .map(PlatoDTO::from)
                .collect(Collectors.groupingBy(PlatoDTO::categoria));

        return categorias.findByActivoTrueOrderByOrdenAsc().stream()
                .map(c -> new CategoriaConPlatosDTO(c.getId(), c.getNombre(), c.getDescripcion(),
                        c.getIcono(), porCategoria.getOrDefault(c.getNombre(), List.of())))
                .toList();
    }

    public List<PlatoDTO> destacados() {
        return platos.findByDestacadoTrueAndDisponibleTrue().stream().map(PlatoDTO::from).toList();
    }

    public PlatoDTO porCodigo(String codigo) {
        return platos.findByCodigoIgnoreCase(codigo).map(PlatoDTO::from)
                .orElseThrow(() -> new NotFoundException("Plato", codigo));
    }
}
