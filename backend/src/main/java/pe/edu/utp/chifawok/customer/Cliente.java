package pe.edu.utp.chifawok.customer;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.time.OffsetDateTime;

@Entity @Table(name = "clientes") @Getter @Setter
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String nombre;
    private String telefono;
    private String email;
    private String documento;
    private String notas;
    @Column(name = "creado_en", updatable = false) private OffsetDateTime creadoEn = OffsetDateTime.now();
    @Column(name = "actualizado_en") private OffsetDateTime actualizadoEn = OffsetDateTime.now();
}
