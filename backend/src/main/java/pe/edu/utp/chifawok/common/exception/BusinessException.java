package pe.edu.utp.chifawok.common.exception;

/** Viola una regla de negocio (precio <= 0, mascota ajena al cliente, etc.). */
public class BusinessException extends RuntimeException {
    public BusinessException(String mensaje) { super(mensaje); }
}
