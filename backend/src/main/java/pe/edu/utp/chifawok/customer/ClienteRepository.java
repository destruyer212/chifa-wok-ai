package pe.edu.utp.chifawok.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByTelefono(String telefono);
    Page<Cliente> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
}
