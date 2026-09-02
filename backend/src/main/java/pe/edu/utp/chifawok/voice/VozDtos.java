package pe.edu.utp.chifawok.voice;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import pe.edu.utp.chifawok.order.TipoEntrega;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public final class VozDtos {
    private VozDtos() {}

    /** Lo que envia el widget del navegador tras el Speech-to-Text. */
    public record VozRequest(
            @NotBlank String transcripcion,
            UUID sesionUuid,
            Long clienteId,
            String canalOrigen) {}

    public record ItemSugerido(String codigoPlato, String nombre, int cantidad,
                               String presentacion, double precioUnitario, double subtotal) {}

    /** Lo que el widget debe mostrar y leer en voz alta (Text-to-Speech). */
    public record VozResponse(
            UUID sesionUuid,
            String intencion,
            String respuestaAsistente,      // texto para TTS
            boolean requiereConfirmacion,
            List<ItemSugerido> items,
            double total,
            int latenciaMs) {}

    // ---- confirmacion del pedido ----
    public record ItemConfirmar(@NotBlank String codigoPlato, int cantidad, String presentacion) {}

    public record ConfirmarRequest(
            @NotNull UUID sesionUuid,
            @NotBlank String telefono,
            String nombre,
            TipoEntrega tipoEntrega,
            String direccion,
            @NotEmpty List<ItemConfirmar> items) {}

    public record ConfirmarResponse(String pedidoCodigo, Long clienteId, BigDecimal total) {}
}
