package pe.edu.utp.chifawok.voice;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.chifawok.voice.VozDtos.*;

@RestController
@RequestMapping("/api/voz")
@RequiredArgsConstructor
@Tag(name = "Asistente de voz")
public class VozController {

    private final VozService service;
    private final SesionVozRepository sesiones;

    @PostMapping("/interpretar")
    @Operation(summary = "Recibe la transcripcion del widget y devuelve la respuesta del asistente")
    public VozResponse interpretar(@Valid @RequestBody VozRequest req) {
        return service.interpretar(req);
    }

    @GetMapping("/sesiones")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Historial de sesiones de voz para el panel administrativo")
    public Page<SesionVoz> sesiones(Pageable pageable) {
        return sesiones.findAllByOrderByCreadoEnDesc(pageable);
    }
}
