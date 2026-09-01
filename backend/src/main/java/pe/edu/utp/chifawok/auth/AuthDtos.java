package pe.edu.utp.chifawok.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password) {}

    public record RegisterRequest(
            @NotBlank String nombre,
            @Email @NotBlank String email,
            @NotBlank @Size(min = 6, message = "minimo 6 caracteres") String password) {}

    public record AuthResponse(
            String token,
            String tipo,
            long expiraEnMinutos,
            String nombre,
            String rol) {}
}
