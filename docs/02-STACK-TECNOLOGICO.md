# 02 · Stack tecnológico

## Lo que dice el Word (prosa de Introducción + Software + Hardware)

| Capa | Tecnología |
|------|-----------|
| Frontend + captura de voz | **Angular**, **Web Speech API** (STT/TTS) |
| Backend / orquestación | **Java + Spring Boot**, **API REST**, **Spring Security + JWT** |
| Motor de IA | **Python + FastAPI**, **LangChain**, modelos **LLM** |
| Base de datos | **PostgreSQL** |
| Infraestructura | VPS / Cloud (2 vCPU, 4 GB RAM, SSD 20–40 GB), contenedores |
| Herramientas | IntelliJ IDEA, VS Code, **Git + GitHub** |

## Versiones y decisiones tomadas (el Word no las precisa)

| Componente | Elegido | Motivo |
|-----------|---------|--------|
| Java | **17 LTS** | Es la JDK instalada en el equipo; soportada por Spring Boot 3.3. |
| Spring Boot | **3.3.5** | Última estable de la línea 3.3; Jakarta EE 10. |
| Build backend | **Maven** | Continuidad con el ecosistema del curso. |
| Persistencia | **Spring Data JPA + Hibernate 6** | Repositorios declarativos; `@JdbcTypeCode(JSON)` para `jsonb`. |
| Migraciones | **Flyway** | Versionado del esquema reproducible (`db/migration/V1..V6`). |
| JWT | **jjwt 0.12** | Emisión/validación HS256. |
| Doc API | **springdoc-openapi 2.6** | Swagger UI en `/swagger-ui.html`. |
| Frontend | **Angular 18** (standalone components + signals) | Sin NgModules; estado con `signal()`. |
| Estilos | **Tailwind 3.4** con tokens Material 3 | El equipo entregó la paleta "Andean Dragon". |
| Python | **3.12** | Requerido por las versiones de LangChain usadas. |
| API IA | **FastAPI 0.115** + **Uvicorn** | ASGI, validación con Pydantic v2. |
| Orquestación LLM | **LangChain 0.3** (`langchain-openai`, `langchain-anthropic`) | Proveedor intercambiable por env var. |
| Proveedor LLM | **configurable**: `openai` \| `anthropic` \| `fake` | `fake` = extracción por reglas, sin API key, para desarrollo. |
| Contenedores | **Docker + docker-compose** | 4 servicios: db, ai-service, backend, frontend. |
| Pruebas | JUnit 5 (backend), pytest (ai-service) | — |

## Puertos

| Servicio | Puerto |
|----------|--------|
| frontend (nginx) | 4200 → 80 |
| backend | 8080 |
| ai-service | 8001 |
| PostgreSQL | 5432 |
