package pe.edu.utp.chifawok.catalog;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "platos") @Getter @Setter
public class Plato {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false, unique = true) private String codigo;
    @Column(nullable = false) private String nombre;
    private String descripcion;
    @Column(nullable = false) private BigDecimal precio;
    @Column(nullable = false) private boolean disponible = true;
    @Column(nullable = false) private boolean destacado = false;
    @Column(name = "imagen_url") private String imagenUrl;
    private Integer calorias;
    @Column(name = "tiempo_preparacion_min") private Integer tiempoPreparacionMin;

    @Column(name = "creado_en", updatable = false) private OffsetDateTime creadoEn = OffsetDateTime.now();
    @Column(name = "actualizado_en") private OffsetDateTime actualizadoEn = OffsetDateTime.now();

    @OneToMany(mappedBy = "plato", fetch = FetchType.LAZY)
    private List<PlatoPresentacion> presentaciones = new ArrayList<>();
}
