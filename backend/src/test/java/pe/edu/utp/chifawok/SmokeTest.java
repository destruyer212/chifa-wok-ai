package pe.edu.utp.chifawok;

import org.junit.jupiter.api.Test;
import pe.edu.utp.chifawok.order.EstadoPedido;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Prueba unitaria ligera. Para pruebas de integracion contra PostgreSQL real
 * se recomienda anadir Testcontainers (ver backend/README.md).
 */
class SmokeTest {

    @Test
    void hayOchoEstadosDePedido() {
        assertEquals(8, EstadoPedido.values().length);
    }

    @Test
    void borradorEsElEstadoInicial() {
        assertTrue(EstadoPedido.BORRADOR.ordinal() < EstadoPedido.ENTREGADO.ordinal());
    }
}
