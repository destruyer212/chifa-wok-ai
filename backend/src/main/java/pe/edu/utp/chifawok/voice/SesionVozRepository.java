package pe.edu.utp.chifawok.voice;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SesionVozRepository extends JpaRepository<SesionVoz, Long> {
    Optional<SesionVoz> findByUuid(UUID uuid);
    Page<SesionVoz> findAllByOrderByCreadoEnDesc(Pageable pageable);
}
