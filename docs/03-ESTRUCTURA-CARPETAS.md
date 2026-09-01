# 03 · Estructura de carpetas

```
chifa-wok-ai/
├── README.md                  Visión general + arranque rápido
├── docker-compose.yml         db + ai-service + backend + frontend
├── .env.example               Todas las variables de entorno
├── Makefile                   make up / db / backend / ai / frontend
│
├── docs/                      ◀── ESTA documentación (00..09 + README)
│
├── db/
│   ├── README.md              Descripción de tablas y reglas de integridad
│   └── er/modelo-er.md        Diagrama ER (Mermaid)
│
├── backend/                   ◀── Orquestador REST — Spring Boot 3.3 / Java 17
│   ├── pom.xml
│   ├── Dockerfile
│   ├── src/main/resources/
│   │   ├── application.yml           perfiles: (default) / dev / docker
│   │   └── db/migration/V1..V6.sql   ◀── MIGRACIONES FLYWAY (esquema completo)
│   └── src/main/java/pe/edu/utp/chifawok/
│       ├── config/            SecurityConfig, OpenApiConfig, AiClientConfig, AppProperties
│       ├── security/          JwtService, JwtAuthenticationFilter, AppUserDetailsService
│       ├── common/            exception/  +  web/ (ApiError, GlobalExceptionHandler)
│       ├── auth/              AuthController, AuthService, AuthDtos
│       ├── user/              Usuario (entity), Rol, UsuarioRepository
│       ├── catalog/           Categoria, Plato, PlatoPresentacion + Service + Controller
│       ├── customer/          Cliente + CRUD + obtenerOCrearPorTelefono
│       ├── order/             Pedido, PedidoItem, EstadoPedido… + máquina de estados
│       ├── voice/             SesionVoz + VozService (orquestación) + VozController
│       ├── ai/                AiClient + AiDtos (contrato con ai-service)
│       └── dashboard/         DashboardService (lee las vistas vw_*)
│
├── ai-service/                ◀── Microservicio de IA — Python 3.12 / FastAPI / LangChain
│   ├── requirements.txt
│   ├── Dockerfile
│   └── app/
│       ├── main.py            FastAPI + routers
│       ├── config.py          Settings (LLM_PROVIDER…)
│       ├── api/routes/        health.py, interpret.py
│       ├── schemas/voice.py   InterpretRequest / InterpretResponse
│       ├── core/llm.py        Fábrica LLM (openai / anthropic / fake)
│       ├── chains/            prompts.py, interpreter.py (cadena LangChain)
│       └── services/          rule_extractor.py, confirmation.py
│
└── frontend/                  ◀── Cliente web + panel admin — Angular 18
    ├── package.json
    ├── tailwind.config.js     ◀── SISTEMA DE DISEÑO (paleta "Andean Dragon")
    ├── Dockerfile / nginx.conf
    └── src/app/
        ├── core/              models.ts, *.service.ts, interceptors/, guards/
        └── features/
            ├── landing/       Página pública (carta destacada)
            ├── voice-widget/  speech.service.ts (Web Speech API) + voice-widget.component.ts
            ├── auth/          login.component.ts
            └── admin/         admin-layout, dashboard, orders, voice-sessions
```

## Convención de módulos del backend

Cada módulo de dominio (`catalog`, `customer`, `order`, `voice`) sigue el mismo patrón
de capas exigido por el informe:

```
Controller  →  Service            →  Repository        →  PostgreSQL
(REST/HTTP)    (reglas de negocio,    (Spring Data JPA)
               validaciones)
   ▲
   │ DTOs (records anidados en  XxxDtos.java)  —  nunca se exponen entidades JPA
```
