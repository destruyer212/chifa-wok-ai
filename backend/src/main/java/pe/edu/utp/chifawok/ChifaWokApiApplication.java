package pe.edu.utp.chifawok;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Orquestador REST del "Voice AI Business Assistant" del Chifa Wok.
 * Centraliza la logica de ventas, el catalogo, los pedidos y la comunicacion
 * con el microservicio de IA (Python / FastAPI).
 */
@SpringBootApplication
public class ChifaWokApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChifaWokApiApplication.class, args);
    }
}
