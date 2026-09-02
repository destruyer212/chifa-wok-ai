# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
El proyecto aún no tiene versiones publicadas (pre-1.0).

## [Sin publicar]

### Añadido
- **Monorepo** con 3 servicios: `frontend/` (Angular 18), `backend/` (Spring Boot 3.3 /
  Java 17), `ai-service/` (FastAPI + LangChain) + `db/` (PostgreSQL 16) + `docs/` +
  `docker-compose.yml`.
- **Base de datos**: migraciones Flyway `V1..V6` (usuarios, clientes, direcciones,
  catálogo con presentaciones/opciones/insumos, pedidos + detalle + historial de
  estados, sesiones de voz + turnos, 4 vistas de métricas, datos semilla).
- **Backend**: autenticación JWT (Spring Security + BCrypt), módulos catálogo /
  clientes / pedidos (máquina de estados) / voz (orquestación) / dashboard;
  cliente HTTP al microservicio de IA; OpenAPI/Swagger; `spring-boot-starter-actuator`.
- **ai-service**: interpretación de la transcripción (intención + extracción de platos
  contra la carta) con proveedor LLM configurable `openai | anthropic | fake`
  (modo `fake` = extracción por reglas, sin API key).
- **Frontend – cliente**: landing, carta completa (`/carta`), "Mis Pedidos"
  (`/mis-pedidos`) con *status tracker* e historial + "Repetir Pedido", y el
  **asistente de voz** como modal (Web Speech API STT/TTS) con paso de confirmación
  que registra el pedido (`POST /api/voz/confirmar`).
- **Frontend – staff**: login con mostrar/ocultar contraseña y "Volver al inicio";
  panel admin con dashboard (KPIs + ventas 7 días + top platos), tablero de pedidos
  por columnas y listado de sesiones de voz.
- **Sistema de diseño** Material 3 "Andean Dragon" en `frontend/tailwind.config.js`
  (Montserrat + Inter, tokens de color/espaciado/tipografía).
- **Documentación** `docs/00..10` (análisis del informe, arquitectura, stack, estructura,
  base de datos, API, flujo de voz, sistema de diseño, pendientes del informe, puesta
  en marcha, pantallas).

### Cambiado
- El contenedor de PostgreSQL publica en el host en **5434** (antes 5432) para evitar
  choques con un PostgreSQL local u otros contenedores; `application.yml` y `.env`
  actualizados en consecuencia.
- Landing y asistente de voz rediseñados para coincidir con los mockups de Google Stitch.

## Historial de commits

| Commit | Descripción |
|--------|-------------|
| `Scaffold inicial` | Estructura del monorepo, backend + ai-service + frontend + docs |
| `Landing fiel a Stitch` | Hero, tarjeta glass, platos estrella, "Nosotros" |
| `Pantallas de cliente` | Carta completa, Mis Pedidos, cierre del ciclo de voz (confirmar) |
| `Asistente de voz modal` | Diálogo centrado con backdrop (fiel a Stitch) |
| `DB en puerto 5434` | Evita conflictos de puerto en local |
| `Rediseño UI` | Login, panel admin, dashboard, pedidos, sesiones de voz |
| `docs: …` | README con rutas, guía de pantallas (docs/10), patrones de diseño |
