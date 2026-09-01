package pe.edu.utp.chifawok.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.chifawok.auth.AuthDtos.*;
import pe.edu.utp.chifawok.common.exception.BusinessException;
import pe.edu.utp.chifawok.security.AppUserDetails;
import pe.edu.utp.chifawok.security.JwtService;
import pe.edu.utp.chifawok.user.Rol;
import pe.edu.utp.chifawok.user.Usuario;
import pe.edu.utp.chifawok.user.UsuarioRepository;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    public AuthResponse login(LoginRequest req) {
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        var user = (AppUserDetails) auth.getPrincipal();
        return tokenPara(user.getUsuario());
    }

    @Transactional
    public AuthResponse registrar(RegisterRequest req) {
        if (usuarios.existsByEmailIgnoreCase(req.email())) {
            throw new BusinessException("El email ya esta registrado");
        }
        var u = new Usuario();
        u.setNombre(req.nombre());
        u.setEmail(req.email());
        u.setPasswordHash(encoder.encode(req.password()));
        u.setRol(Rol.OPERADOR);
        usuarios.save(u);
        return tokenPara(u);
    }

    private AuthResponse tokenPara(Usuario u) {
        String token = jwtService.generar(u.getEmail(),
                Map.of("rol", u.getRol().name(), "nombre", u.getNombre()));
        return new AuthResponse(token, "Bearer", jwtService.getExpirationMinutes(),
                u.getNombre(), u.getRol().name());
    }
}
