package pe.edu.utp.chifawok.voice;

import jakarta.validation.constraints.NotBlank;

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
}
