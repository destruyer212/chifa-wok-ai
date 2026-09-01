package pe.edu.utp.chifawok.order;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.chifawok.order.PedidoDtos.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Tag(name = "Pedidos")
public class PedidoController {

    private final PedidoService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoDTO crear(@Valid @RequestBody CrearPedidoRequest req) { return service.crear(req); }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public Page<PedidoDTO> listar(@RequestParam(required = false) EstadoPedido estado, Pageable pageable) {
        return service.listar(estado, pageable);
    }

    @GetMapping("/tablero")
    @PreAuthorize("isAuthenticated()")
    public List<PedidoDTO> tablero() { return service.tablero(); }

    @GetMapping("/{id}")
    public PedidoDTO obtener(@PathVariable Long id) { return service.obtener(id); }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("isAuthenticated()")
    public PedidoDTO cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequest req) {
        return service.cambiarEstado(id, req);
    }
}
