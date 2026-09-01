# Chifa Wok — Sistema web de gestión de pedidos con asistente conversacional de IA

> *Voice AI Business Assistant* — Plataforma web que permite al cliente del **Chifa Wok**
> hacer su pedido **hablando por el micrófono** desde la página del restaurante.
> El navegador transcribe la voz (Web Speech API), un microservicio de IA interpreta la
> intención y arma el pedido, y el sistema responde con una **confirmación hablada**.
>
> UTP — Facultad de Ingeniería, Ing. de Sistemas e Informática — Lima, 2026.

## Arquitectura (orientada a microservicios)

```
                 ┌───────────────────────────┐
   Micrófono ───▶│  frontend/  (Angular 18)   │  Web Speech API: STT + TTS
   Altavoz  ◀────│  · widget de voz          │
                 │  · panel administrativo   │
                 └────────────┬──────────────┘
                              │  HTTPS / REST + JWT
                 ┌────────────▼──────────────┐
                 │  backend/  (Spring Boot)   │  Orquestador — API REST
                 │  Spring Security + JWT     │  Reglas de negocio, pedidos,
                 │  Spring Data JPA + Flyway  │  catálogo, clientes, dashboard
                 └───────┬───────────┬────────┘
                         │           │  REST
              ┌──────────▼──┐   ┌────▼─────────────────────┐
              │ PostgreSQL  │   │ ai-service/ (FastAPI)     │
              │  db/        │   │ LangChain + LLM           │
              └─────────────┘   │ intención + entidades del │
                                │ pedido → borrador + texto │
                                └──────────────────────────┘
```

| Carpeta        | Servicio | Stack | Puerto |
|----------------|----------|-------|--------|
| `frontend/`    | Cliente web + panel admin | Angular 18, TypeScript, Web Speech API | 4200 |
| `backend/`     | Orquestador / API REST | Java 17, Spring Boot 3.3, Spring Security (JWT), JPA, Flyway | 8080 |
| `ai-service/`  | Motor de lenguaje natural | Python 3.12, FastAPI, LangChain | 8001 |
| `db/`          | Modelo de datos | PostgreSQL 16 (migraciones Flyway) | 5432 |

## Puesta en marcha rápida

```bash
cp .env.example .env
docker compose up --build
```

- Frontend:  http://localhost:4200
- API + Swagger: http://localhost:8080/swagger-ui.html
- IA (docs):  http://localhost:8001/docs

Usuario admin inicial: **admin@chifawok.pe / admin123**

## Desarrollo por servicio

Cada carpeta tiene su propio `README.md` con instrucciones. Resumen:

```bash
make db         # solo PostgreSQL en Docker
make backend    # mvn spring-boot:run   (perfil dev)
make ai         # uvicorn app.main:app --reload
make frontend   # npm start
```

## Estado del proyecto vs. el informe

El Word `docs/Desarrollo Web Proyecto.docx` tiene el **Capítulo I completo**; del
Capítulo II en adelante solo hay títulos. Ver [`docs/00-ANALISIS-INFORME.md`](docs/00-ANALISIS-INFORME.md)
para el detalle de lo que falta redactar (RF, RNF, modelo ER, casos de prueba) y la
corrección de los subtítulos de *Fundamentación Teórica* (aún nombran el stack antiguo
Servlet/JSP/JSF/Tomcat/MySQL en vez de Angular/Spring Boot/PostgreSQL).
