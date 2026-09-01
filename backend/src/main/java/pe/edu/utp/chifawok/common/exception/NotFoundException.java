package pe.edu.utp.chifawok.common.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String recurso, Object id) {
        super("%s no encontrado: %s".formatted(recurso, id));
    }
    public NotFoundException(String mensaje) { super(mensaje); }
}
