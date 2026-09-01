package pe.edu.utp.chifawok.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import pe.edu.utp.chifawok.dashboard.DashboardDtos.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/** Lee las vistas de reporte (vw_*) creadas por Flyway. */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JdbcTemplate jdbc;

    public DashboardDTO resumen() {
        long pedidosHoy = uno("SELECT count(*) FROM pedidos WHERE creado_en::date = current_date");
        long enPrep = uno("SELECT count(*) FROM pedidos WHERE estado = 'EN_PREPARACION'");
        BigDecimal ventasHoy = jdbc.queryForObject(
                "SELECT coalesce(sum(total),0) FROM pedidos WHERE estado='ENTREGADO' AND creado_en::date = current_date",
                BigDecimal.class);
        long sesionesHoy = uno("SELECT count(*) FROM sesiones_voz WHERE creado_en::date = current_date");
        Double conv = jdbc.query(
                "SELECT tasa_conversion_pct FROM vw_metricas_voz WHERE fecha = current_date",
                rs -> rs.next() ? rs.getDouble(1) : 0.0);

        Resumen resumen = new Resumen(pedidosHoy, enPrep,
                ventasHoy == null ? BigDecimal.ZERO : ventasHoy, sesionesHoy,
                conv == null ? 0.0 : conv);

        List<VentaDia> ventas = jdbc.query(
                "SELECT fecha, num_pedidos, total_vendido FROM vw_ventas_diarias "
                        + "WHERE fecha >= current_date - INTERVAL '7 day' ORDER BY fecha",
                (rs, i) -> new VentaDia(rs.getObject("fecha", LocalDate.class),
                        rs.getLong("num_pedidos"), rs.getBigDecimal("total_vendido")));

        List<PlatoTop> top = jdbc.query(
                "SELECT nombre_plato, unidades, ingresos FROM vw_platos_mas_vendidos LIMIT 5",
                (rs, i) -> new PlatoTop(rs.getString("nombre_plato"),
                        rs.getLong("unidades"), rs.getBigDecimal("ingresos")));

        return new DashboardDTO(resumen, ventas, top);
    }

    private long uno(String sql) {
        Long v = jdbc.queryForObject(sql, Long.class);
        return v == null ? 0L : v;
    }
}
