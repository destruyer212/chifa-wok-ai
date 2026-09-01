package pe.edu.utp.chifawok.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.chifawok.auth.AuthDtos.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacion")
public class AuthController {

    private final AuthService service;

    @PostMapping("/login")
    @Operation(summary = "Inicia sesion y devuelve un JWT")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return service.login(req);
    }

    @PostMapping("/registro")
    @Operation(summary = "Registra un usuario operador del panel")
    public AuthResponse registro(@Valid @RequestBody RegisterRequest req) {
        return service.registrar(req);
    }
}
