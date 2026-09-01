package pe.edu.utp.chifawok.catalog;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.chifawok.catalog.CatalogoDtos.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogo")
@RequiredArgsConstructor
@Tag(name = "Catalogo")
public class CatalogoController {

    private final CatalogoService service;

    @GetMapping("/carta")
    public List<CategoriaConPlatosDTO> carta() { return service.cartaCompleta(); }

    @GetMapping("/destacados")
    public List<PlatoDTO> destacados() { return service.destacados(); }

    @GetMapping("/platos/{codigo}")
    public PlatoDTO plato(@PathVariable String codigo) { return service.porCodigo(codigo); }
}
