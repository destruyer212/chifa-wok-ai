package pe.edu.utp.chifawok.catalog;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.math.BigDecimal;

@Entity @Table(name = "plato_presentaciones") @Getter @Setter
public class PlatoPresentacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plato_id", nullable = false)
    private Plato plato;
    @Column(nullable = false) private String nombre;
    @Column(nullable = false) private BigDecimal precio;
    @Column(nullable = false) private boolean predeterminada = false;
}
