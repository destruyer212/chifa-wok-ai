package pe.edu.utp.chifawok.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public final class DashboardDtos {
    private DashboardDtos() {}

    public record Resumen(long pedidosHoy, long pedidosEnPreparacion,
                          BigDecimal ventasHoy, long sesionesVozHoy,
                          double tasaConversionVozPct) {}

    public record VentaDia(LocalDate fecha, long numPedidos, BigDecimal totalVendido) {}

    public record PlatoTop(String nombre, long unidades, BigDecimal ingresos) {}

    public record DashboardDTO(Resumen resumen, List<VentaDia> ventas7dias, List<PlatoTop> topPlatos) {}
}
