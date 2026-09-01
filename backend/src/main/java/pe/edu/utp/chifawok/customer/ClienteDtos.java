package pe.edu.utp.chifawok.customer;

import jakarta.validation.constraints.NotBlank;

public final class ClienteDtos {
    private ClienteDtos() {}

    public record ClienteRequest(
            @NotBlank String nombre,
            String telefono,
            String email,
            String documento,
            String notas) {}

    public record ClienteDTO(Long id, String nombre, String telefono, String email,
                             String documento, String notas) {
        public static ClienteDTO from(Cliente c) {
            return new ClienteDTO(c.getId(), c.getNombre(), c.getTelefono(), c.getEmail(),
                    c.getDocumento(), c.getNotas());
        }
    }
}
