package pe.edu.utp.chifawok.ai;

import java.util.List;

/** Contrato con el microservicio de IA (Python / FastAPI). */
public final class AiDtos {
    private AiDtos() {}

    public record MenuItem(String codigo, String nombre, double precio, String categoria) {}

    public record InterpretRequest(String texto, String sesionUuid, List<MenuItem> menu) {}

    public record ItemBorrador(String codigoPlato, String nombrePlato, int cantidad,
                               String presentacion, String notas) {}

    public record InterpretResponse(
            String intencion,
            double confianza,
            List<ItemBorrador> items,
            String tipoEntrega,
            String respuestaAsistente,
            boolean requiereConfirmacion,
            String modeloLlm) {}
}
