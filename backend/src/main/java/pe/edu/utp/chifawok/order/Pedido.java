package pe.edu.utp.chifawok.order;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import pe.edu.utp.chifawok.customer.Cliente;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "pedidos") @Getter @Setter
public class Pedido {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Column(name = "sesion_voz_id")
    private Long sesionVozId;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Canal canal = Canal.WEB;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private EstadoPedido estado = EstadoPedido.BORRADOR;

    @Enumerated(EnumType.STRING) @Column(name = "tipo_entrega", nullable = false)
    private TipoEntrega tipoEntrega = TipoEntrega.RECOJO;

    @Column(name = "direccion_entrega")
    private String direccionEntrega;

    @Enumerated(EnumType.STRING) @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago = MetodoPago.POR_DEFINIR;

    @Column(nullable = false) private BigDecimal subtotal = BigDecimal.ZERO;
    @Column(name = "costo_envio", nullable = false) private BigDecimal costoEnvio = BigDecimal.ZERO;
    @Column(nullable = false) private BigDecimal descuento = BigDecimal.ZERO;
    @Column(nullable = false) private BigDecimal total = BigDecimal.ZERO;

    private String notas;

    @Column(name = "programado_para")
    private OffsetDateTime programadoPara;

    @Column(name = "creado_en", updatable = false)
    private OffsetDateTime creadoEn = OffsetDateTime.now();
    @Column(name = "actualizado_en")
    private OffsetDateTime actualizadoEn = OffsetDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> items = new ArrayList<>();

    public void agregarItem(PedidoItem item) {
        item.setPedido(this);
        items.add(item);
    }

    /** Recalcula subtotal y total a partir de los items. */
    public void recalcularTotales() {
        this.subtotal = items.stream()
                .map(PedidoItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.total = subtotal.add(costoEnvio).subtract(descuento).max(BigDecimal.ZERO);
    }
}
