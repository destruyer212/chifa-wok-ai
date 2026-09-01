package pe.edu.utp.chifawok.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @EntityGraph(attributePaths = {"cliente", "items", "items.plato"})
    Optional<Pedido> findWithItemsById(Long id);

    Page<Pedido> findByEstadoOrderByCreadoEnDesc(EstadoPedido estado, Pageable pageable);

    List<Pedido> findByEstadoIn(List<EstadoPedido> estados);

    long countByEstado(EstadoPedido estado);
}
