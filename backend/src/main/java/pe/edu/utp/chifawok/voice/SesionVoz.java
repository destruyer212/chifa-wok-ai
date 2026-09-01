package pe.edu.utp.chifawok.voice;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity @Table(name = "sesiones_voz") @Getter @Setter
public class SesionVoz {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private UUID uuid = UUID.randomUUID();

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "canal_origen", nullable = false)
    private String canalOrigen = "widget-web";

    @Column(name = "transcripcion_usuario", columnDefinition = "text")
    private String transcripcionUsuario;

    @Column(name = "respuesta_asistente", columnDefinition = "text")
    private String respuestaAsistente;

    private String intencion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String entidades;

    private Double confianza;

    @Column(nullable = false)
    private boolean exito = false;

    @Column(name = "error_detalle")
    private String errorDetalle;

    @Column(name = "latencia_ms")
    private Integer latenciaMs;

    @Column(name = "modelo_llm")
    private String modeloLlm;

    @Column(name = "creado_en", updatable = false)
    private OffsetDateTime creadoEn = OffsetDateTime.now();
}
