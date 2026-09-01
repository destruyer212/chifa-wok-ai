package pe.edu.utp.chifawok.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.chifawok.common.exception.NotFoundException;
import pe.edu.utp.chifawok.customer.ClienteDtos.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private final ClienteRepository repo;

    @Transactional(readOnly = true)
    public Page<ClienteDTO> listar(String q, Pageable pageable) {
        Page<Cliente> page = (q == null || q.isBlank())
                ? repo.findAll(pageable)
                : repo.findByNombreContainingIgnoreCase(q, pageable);
        return page.map(ClienteDTO::from);
    }

    @Transactional(readOnly = true)
    public ClienteDTO obtener(Long id) {
        return repo.findById(id).map(ClienteDTO::from)
                .orElseThrow(() -> new NotFoundException("Cliente", id));
    }

    public ClienteDTO crear(ClienteRequest req) {
        return ClienteDTO.from(repo.save(aplicar(new Cliente(), req)));
    }

    public ClienteDTO actualizar(Long id, ClienteRequest req) {
        Cliente c = repo.findById(id).orElseThrow(() -> new NotFoundException("Cliente", id));
        return ClienteDTO.from(repo.save(aplicar(c, req)));
    }

    public void eliminar(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Cliente", id);
        repo.deleteById(id);
    }

    /** Busca por telefono o crea un cliente minimo (usado por el flujo de voz). */
    public Cliente obtenerOCrearPorTelefono(String telefono, String nombreSugerido) {
        return repo.findByTelefono(telefono).orElseGet(() -> {
            Cliente c = new Cliente();
            c.setNombre(nombreSugerido != null ? nombreSugerido : "Cliente por voz");
            c.setTelefono(telefono);
            return repo.save(c);
        });
    }

    private Cliente aplicar(Cliente c, ClienteRequest req) {
        c.setNombre(req.nombre());
        c.setTelefono(req.telefono());
        c.setEmail(req.email());
        c.setDocumento(req.documento());
        c.setNotas(req.notas());
        return c;
    }
}
