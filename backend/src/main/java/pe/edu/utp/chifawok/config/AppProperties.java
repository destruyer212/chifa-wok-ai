package pe.edu.utp.chifawok.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Enlaza el bloque `app:` de application.yml. */
@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Cors cors, Ai ai) {
    public record Jwt(String secret, long expirationMinutes) {}
    public record Cors(String allowedOrigins) {}
    public record Ai(String baseUrl, int timeoutSeconds) {}
}
