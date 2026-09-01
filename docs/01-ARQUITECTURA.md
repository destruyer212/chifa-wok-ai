# 01 · Arquitectura

Arquitectura **orientada a microservicios** con tres servicios desplegables de forma
independiente y una base de datos compartida por el orquestador.

```
   ┌──────────────────────── Cliente (navegador) ────────────────────────┐
   │                                                                     │
   │   Micrófono ──▶ Web Speech API (STT) ──▶  Angular  ──▶ HTTP/REST     │
   │   Altavoz  ◀── Web Speech API (TTS) ◀──  (widget)                    │
   └───────────────────────────────┬─────────────────────────────────────┘
                                   │  JSON + JWT (panel)  /  anónimo (widget)
                     ┌─────────────▼──────────────┐
                     │   backend/  Spring Boot     │
                     │   ───────────────────────   │
                     │   Controllers (REST)        │
                     │   Services (reglas negocio) │
                     │   Repositories (Spring Data)│
                     └───────┬───────────────┬─────┘
                    JDBC/JPA │               │ REST (WebClient)
                 ┌───────────▼────┐   ┌──────▼───────────────────────┐
                 │  PostgreSQL 16 │   │  ai-service/  FastAPI         │
                 │  (Flyway)      │   │  ──────────────────────────   │
                 │  db/           │   │  chains/ (LangChain)          │
                 └────────────────┘   │  → intención + items + texto  │
                                      │  LLM: openai | anthropic | fake│
                                      └──────────────────────────────┘
```

## Responsabilidades

| Servicio | Hace | NO hace |
|----------|------|---------|
| **frontend** | Captura de voz (STT), síntesis (TTS), UI de la carta, panel admin. | Lógica de negocio, persistencia. |
| **backend** | Autenticación, catálogo, clientes, **cálculo de totales y estados de pedido**, orquestación de la sesión de voz, métricas. | Procesamiento de lenguaje natural. |
| **ai-service** | Interpretar la transcripción: intención + extracción de platos (contra la carta que le pasa el backend) + redacción de la confirmación. | Guardar datos, conocer precios reales (los recibe en cada request). |

## Decisiones clave

- **El navegador hace STT y TTS**, no el servidor → cero costo de telefonía (Web Speech API nativa).
- **El `ai-service` es *stateless***: no tiene base de datos. Recibe el menú en cada
  llamada y devuelve códigos de plato; el backend valida y calcula. Así el LLM nunca
  inventa precios ni platos.
- **El widget es anónimo** (`/api/voz/**` y `GET /api/catalogo/**` son públicos). El
  panel admin exige **JWT** (`/api/dashboard`, `/api/pedidos`, `/api/clientes`, `/api/voz/sesiones`).
- **Flyway** gobierna el esquema; JPA está en `ddl-auto: none` (usar `validate` para verificar el mapeo).
