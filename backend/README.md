# backend/ — Orquestador REST (Spring Boot 3.3 · Java 17)

API REST que centraliza la lógica de negocio del Chifa Wok: autenticación (JWT),
catálogo, clientes, pedidos, orquestación del asistente de voz y métricas del dashboard.

## Módulos (`src/main/java/pe/edu/utp/chifawok/`)

| Paquete | Responsabilidad |
|---------|-----------------|
| `config/`    | `SecurityConfig`, CORS, OpenAPI, `WebClient` hacia el microservicio de IA, `AppProperties`. |
| `security/`  | `JwtService`, `JwtAuthenticationFilter`, `AppUserDetailsService`. |
| `common/`    | Excepciones de negocio y `GlobalExceptionHandler` (respuestas `ApiError`). |
| `auth/`      | Login y registro de usuarios del panel. |
| `user/`      | Entidad `Usuario` + roles (ADMIN / OPERADOR / COCINA). |
| `catalog/`   | `Categoria`, `Plato`, `PlatoPresentacion` — la carta. GET público. |
| `customer/`  | CRUD de `Cliente` + `obtenerOCrearPorTelefono` para el flujo de voz. |
| `order/`     | `Pedido` + `PedidoItem`, máquina de estados, recálculo de totales. |
| `voice/`     | `VozService` orquesta: transcripción → IA → validación de carta → sesión persistida. |
| `ai/`        | `AiClient` — contrato HTTP con `ai-service/`. |
| `dashboard/` | Lee las vistas `vw_*` de PostgreSQL. |

## Base de datos — Flyway

Migraciones en `src/main/resources/db/migration/`:

| Versión | Contenido |
|---------|-----------|
| `V1` | Auditoría (`fn_set_actualizado_en`), `usuarios`, `clientes`, `direcciones_cliente`. |
| `V2` | `categorias`, `platos`, `plato_presentaciones`, `grupos_opcion`, `opciones`, `insumos`, recetas. |
| `V3` | `pedidos`, `pedido_items`, `pedido_item_opciones`, `pedido_estados_historial`. |
| `V4` | `sesiones_voz`, `sesion_voz_turnos` + FK diferida `pedidos → sesiones_voz`. |
| `V5` | Vistas: `vw_ventas_diarias`, `vw_platos_mas_vendidos`, `vw_metricas_voz`, `vw_insumos_stock_bajo`. |
| `V6` | Semilla: usuarios `admin@chifawok.pe` / `operador@chifawok.pe` (clave `admin123`) + carta inicial. |

## Ejecutar

```bash
# Requiere PostgreSQL en localhost:5432 (o usa: docker compose up -d db)
mvn spring-boot:run                 # perfil por defecto
mvn spring-boot:run -Dspring-boot.run.profiles=dev
mvn test                            # pruebas (H2 en memoria, sin Flyway)
```

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/chifawok` | Cadena JDBC |
| `SPRING_DATASOURCE_USERNAME` / `_PASSWORD` | `chifawok` / `chifawok` | Credenciales |
| `APP_JWT_SECRET` | *(dev)* | Clave HS256 (≥ 32 chars) |
| `APP_JWT_EXPIRATION_MINUTES` | `120` | Vigencia del token |
| `APP_AI_BASE_URL` | `http://localhost:8001` | URL del microservicio de IA |
| `APP_CORS_ORIGINS` | `http://localhost:4200` | Orígenes permitidos |
