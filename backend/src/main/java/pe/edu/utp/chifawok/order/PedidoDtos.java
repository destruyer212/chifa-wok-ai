package pe.edu.utp.chifawok.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public final class PedidoDtos {
    private PedidoDtos() {}

    public record ItemRequest(
            @NotBlank String codigoPlato,
            @Positive int cantidad,
            String presentacion,
            String notas) {}

    public record CrearPedidoRequest(
            @NotNull Long clienteId,
            @NotNull Canal canal,
            @NotNull TipoEntrega tipoEntrega,
            String direccionEntrega,
            MetodoPago metodoPago,
            Long sesionVozId,
            String notas,
            @NotEmpty @Valid List<ItemRequest> items) {}

    public record CambiarEstadoRequest(@NotNull EstadoPedido estado, String comentario) {}

    public record ItemDTO(Long id, String codigoPlato, String nombrePlato, int cantidad,
                          BigDecimal precioUnitario, BigDecimal subtotal, String notas) {}

    public record PedidoDTO(Long id, String codigo, String clienteNombre, String canal,
                            String estado, String tipoEntrega, String metodoPago,
                            BigDecimal subtotal, BigDecimal costoEnvio, BigDecimal descuento,
                            BigDecimal total, String notas, OffsetDateTime creadoEn,
                            List<ItemDTO> items) {

        public static PedidoDTO from(Pedido p) {
            return new PedidoDTO(p.getId(), p.getCodigo(),
                    p.getCliente() != null ? p.getCliente().getNombre() : null,
                    p.getCanal().name(), p.getEstado().name(), p.getTipoEntrega().name(),
                    p.getMetodoPago().name(), p.getSubtotal(), p.getCostoEnvio(),
                    p.getDescuento(), p.getTotal(), p.getNotas(), p.getCreadoEn(),
                    p.getItems().stream().map(i -> new ItemDTO(i.getId(),
                            i.getPlato() != null ? i.getPlato().getCodigo() : null,
                            i.getNombrePlato(), i.getCantidad(), i.getPrecioUnitario(),
                            i.getSubtotal(), i.getNotas())).toList());
        }
    }
}
