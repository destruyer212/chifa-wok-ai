package pe.edu.utp.chifawok.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/** WebClient dedicado al microservicio de IA. */
@Configuration
public class AiClientConfig {

    @Bean
    WebClient aiWebClient(AppProperties props) {
        return WebClient.builder()
            .baseUrl(props.ai().baseUrl())
            .build();
    }
}
