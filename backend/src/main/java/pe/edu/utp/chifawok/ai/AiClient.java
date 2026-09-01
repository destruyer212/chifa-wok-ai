package pe.edu.utp.chifawok.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import pe.edu.utp.chifawok.ai.AiDtos.*;
import pe.edu.utp.chifawok.common.exception.BusinessException;
import pe.edu.utp.chifawok.config.AppProperties;
import reactor.core.publisher.Mono;

import java.time.Duration;

/** Llama al endpoint /interpretar del microservicio de IA. */
@Component
@Slf4j
@RequiredArgsConstructor
public class AiClient {

    private final WebClient aiWebClient;
    private final AppProperties props;

    public InterpretResponse interpretar(InterpretRequest request) {
        try {
            return aiWebClient.post()
                    .uri("/interpretar")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(InterpretResponse.class)
                    .timeout(Duration.ofSeconds(props.ai().timeoutSeconds()))
                    .onErrorResume(ex -> {
                        log.error("Fallo el microservicio de IA: {}", ex.getMessage());
                        return Mono.error(new BusinessException(
                                "El asistente no esta disponible en este momento"));
                    })
                    .block();
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("No se pudo procesar la solicitud de voz");
        }
    }
}
