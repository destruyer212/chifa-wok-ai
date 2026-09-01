package pe.edu.utp.chifawok.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI chifaWokOpenAPI() {
        final String scheme = "bearerAuth";
        return new OpenAPI()
            .info(new Info()
                .title("Chifa Wok - API del asistente de voz")
                .version("0.1.0")
                .description("Orquestador REST: autenticacion, catalogo, clientes, pedidos, voz y dashboard."))
            .addSecurityItem(new SecurityRequirement().addList(scheme))
            .components(new Components().addSecuritySchemes(scheme,
                new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
