package pe.edu.utp.chifawok.catalog;

import java.math.BigDecimal;
import java.util.List;

public final class CatalogoDtos {
    private CatalogoDtos() {}

    public record PresentacionDTO(Long id, String nombre, BigDecimal precio, boolean predeterminada) {}

    public record PlatoDTO(Long id, String codigo, String nombre, String descripcion,
                           BigDecimal precio, boolean disponible, boolean destacado,
                           String imagenUrl, Integer tiempoPreparacionMin,
                           String categoria, List<PresentacionDTO> presentaciones) {
        public static PlatoDTO from(Plato p) {
            return new PlatoDTO(p.getId(), p.getCodigo(), p.getNombre(), p.getDescripcion(),
                p.getPrecio(), p.isDisponible(), p.isDestacado(), p.getImagenUrl(),
                p.getTiempoPreparacionMin(),
                p.getCategoria() != null ? p.getCategoria().getNombre() : null,
                p.getPresentaciones().stream()
                    .map(pr -> new PresentacionDTO(pr.getId(), pr.getNombre(), pr.getPrecio(), pr.isPredeterminada()))
                    .toList());
        }
    }

    public record CategoriaConPlatosDTO(Long id, String nombre, String descripcion,
                                        String icono, List<PlatoDTO> platos) {}
}
