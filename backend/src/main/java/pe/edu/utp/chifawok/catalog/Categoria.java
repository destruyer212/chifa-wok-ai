package pe.edu.utp.chifawok.catalog;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;

@Entity @Table(name = "categorias") @Getter @Setter
public class Categoria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String nombre;
    private String descripcion;
    private String icono;
    @Column(nullable = false) private int orden;
    @Column(nullable = false) private boolean activo = true;
}
