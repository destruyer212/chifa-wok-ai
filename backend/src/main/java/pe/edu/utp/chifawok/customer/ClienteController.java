package pe.edu.utp.chifawok.customer;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.chifawok.customer.ClienteDtos.*;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes")
@PreAuthorize("isAuthenticated()")
public class ClienteController {

    private final ClienteService service;

    @GetMapping
    public Page<ClienteDTO> listar(@RequestParam(required = false) String q, Pageable pageable) {
        return service.listar(q, pageable);
    }

    @GetMapping("/{id}")
    public ClienteDTO obtener(@PathVariable Long id) { return service.obtener(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteDTO crear(@Valid @RequestBody ClienteRequest req) { return service.crear(req); }

    @PutMapping("/{id}")
    public ClienteDTO actualizar(@PathVariable Long id, @Valid @RequestBody ClienteRequest req) {
        return service.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}
