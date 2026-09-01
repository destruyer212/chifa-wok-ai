package pe.edu.utp.chifawok.catalog;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlatoRepository extends JpaRepository<Plato, Long> {

    @EntityGraph(attributePaths = {"categoria", "presentaciones"})
    List<Plato> findByDisponibleTrueOrderByNombreAsc();

    @EntityGraph(attributePaths = {"categoria", "presentaciones"})
    List<Plato> findByDestacadoTrueAndDisponibleTrue();

    Optional<Plato> findByCodigoIgnoreCase(String codigo);
}
