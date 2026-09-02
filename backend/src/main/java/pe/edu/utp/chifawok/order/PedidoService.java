package pe.edu.utp.chifawok.order;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.chifawok.catalog.Plato;
import pe.edu.utp.chifawok.catalog.PlatoRepository;
import pe.edu.utp.chifawok.common.exception.BusinessException;
import pe.edu.utp.chifawok.common.exception.NotFoundException;
import pe.edu.utp.chifawok.customer.Cliente;
import pe.edu.utp.chifawok.customer.ClienteRepository;
import pe.edu.utp.chifawok.order.PedidoDtos.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoService {

    private static final Set<EstadoPedido> ACTIVOS = Set.of(
            EstadoPedido.PENDIENTE, EstadoPedido.CONFIRMADO,
            EstadoPedido.EN_PREPARACION, EstadoPedido.LISTO, EstadoPedido.EN_CAMINO);

    private final PedidoRepository pedidos;
    private final PlatoRepository platos;
    private final ClienteRepository clientes;

    public PedidoDTO crear(CrearPedidoRequest req) {
        Cliente cliente = clientes.findById(req.clienteId())
                .orElseThrow(() -> new NotFoundException("Cliente", req.clienteId()));

        Pedido pedido = new Pedido();
        pedido.setCodigo(generarCodigo());
        pedido.setCliente(cliente);
        pedido.setCanal(req.canal());
        pedido.setTipoEntrega(req.tipoEntrega());
        pedido.setDireccionEntrega(req.direccionEntrega());
        pedido.setMetodoPago(req.metodoPago() != null ? req.metodoPago() : MetodoPago.POR_DEFINIR);
        pedido.setSesionVozId(req.sesionVozId());
        pedido.setNotas(req.notas());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        if (req.tipoEntrega() == TipoEntrega.DELIVERY
                && (req.direccionEntrega() == null || req.direccionEntrega().isBlank())) {
            throw new BusinessException("El delivery requiere una direccion de entrega");
        }

        for (ItemRequest it : req.items()) {
            Plato plato = platos.findByCodigoIgnoreCase(it.codigoPlato())
                    .orElseThrow(() -> new NotFoundException("Plato", it.codigoPlato()));
            if (!plato.isDisponible()) {
                throw new BusinessException("El plato '%s' no esta disponible".formatted(plato.getNombre()));
            }
            if (it.cantidad() <= 0) {
                throw new BusinessException("La cantidad debe ser mayor que cero");
            }

            BigDecimal precio = precioSegunPresentacion(plato, it.presentacion());
            PedidoItem item = new PedidoItem();
            item.setPlato(plato);
            item.setNombrePlato(plato.getNombre()
                    + (it.presentacion() != null ? " (" + it.presentacion() + ")" : ""));
            item.setCantidad(it.cantidad());
            item.setPrecioUnitario(precio);
            item.setNotas(it.notas());
            item.calcularSubtotal();
            pedido.agregarItem(item);
        }

        pedido.recalcularTotales();
        return PedidoDTO.from(pedidos.save(pedido));
    }

    @Transactional(readOnly = true)
    public Page<PedidoDTO> listar(EstadoPedido estado, Pageable pageable) {
        Page<Pedido> page = (estado == null)
                ? pedidos.findAll(pageable)
                : pedidos.findByEstadoOrderByCreadoEnDesc(estado, pageable);
        return page.map(PedidoDTO::from);
    }

    @Transactional(readOnly = true)
    public PedidoDTO obtener(Long id) {
        return pedidos.findWithItemsById(id).map(PedidoDTO::from)
                .orElseThrow(() -> new NotFoundException("Pedido", id));
    }

    public PedidoDTO cambiarEstado(Long id, CambiarEstadoRequest req) {
        Pedido pedido = pedidos.findWithItemsById(id)
                .orElseThrow(() -> new NotFoundException("Pedido", id));
        validarTransicion(pedido.getEstado(), req.estado());
        pedido.setEstado(req.estado());
        return PedidoDTO.from(pedidos.save(pedido));
    }

    public List<PedidoDTO> tablero() {
        return pedidos.findByEstadoIn(List.copyOf(ACTIVOS)).stream().map(PedidoDTO::from).toList();
    }

    /** Pedidos de un cliente (para la pantalla "Mis Pedidos"). */
    @Transactional(readOnly = true)
    public List<PedidoDTO> porCliente(Long clienteId) {
        return pedidos.findByClienteIdOrderByCreadoEnDesc(clienteId).stream().map(PedidoDTO::from).toList();
    }

    /** Repite un pedido anterior: crea uno nuevo con los mismos platos y cantidades. */
    public PedidoDTO repetir(Long pedidoId) {
        Pedido base = pedidos.findWithItemsById(pedidoId)
                .orElseThrow(() -> new NotFoundException("Pedido", pedidoId));
        List<ItemRequest> items = base.getItems().stream()
                .map(i -> new ItemRequest(i.getPlato().getCodigo(), i.getCantidad(), null, i.getNotas()))
                .toList();
        return crear(new CrearPedidoRequest(
                base.getCliente().getId(), base.getCanal(), base.getTipoEntrega(),
                base.getDireccionEntrega(), base.getMetodoPago(), null, base.getNotas(), items));
    }

    // ---- helpers ----
    private BigDecimal precioSegunPresentacion(Plato plato, String presentacion) {
        if (presentacion == null || presentacion.isBlank()) return plato.getPrecio();
        return plato.getPresentaciones().stream()
                .filter(p -> p.getNombre().equalsIgnoreCase(presentacion))
                .findFirst()
                .map(pr -> pr.getPrecio())
                .orElseThrow(() -> new BusinessException(
                        "Presentacion '%s' no valida para %s".formatted(presentacion, plato.getNombre())));
    }

    private void validarTransicion(EstadoPedido actual, EstadoPedido nuevo) {
        if (actual == EstadoPedido.ENTREGADO || actual == EstadoPedido.CANCELADO) {
            throw new BusinessException("El pedido ya esta finalizado (" + actual + ")");
        }
    }

    private String generarCodigo() {
        String fecha = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        return "P-%s-%04d".formatted(fecha, ThreadLocalRandom.current().nextInt(1, 10000));
    }
}
