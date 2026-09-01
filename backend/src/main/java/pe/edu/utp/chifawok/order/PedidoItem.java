package pe.edu.utp.chifawok.order;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import pe.edu.utp.chifawok.catalog.Plato;

import java.math.BigDecimal;

@Entity @Table(name = "pedido_items") @Getter @Setter
public class PedidoItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plato_id")
    private Plato plato;

    @Column(name = "plato_presentacion_id")
    private Long platoPresentacionId;

    @Column(name = "nombre_plato", nullable = false)
    private String nombrePlato;

    @Column(nullable = false) private int cantidad;
    @Column(name = "precio_unitario", nullable = false) private BigDecimal precioUnitario;
    @Column(nullable = false) private BigDecimal subtotal;
    private String notas;

    public void calcularSubtotal() {
        this.subtotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
    }
}
