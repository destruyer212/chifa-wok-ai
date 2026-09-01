# 09 · Puesta en marcha

## Opción A — Docker (todo junto)

```bash
cp .env.example .env
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| Backend + Swagger | http://localhost:8080/swagger-ui.html |
| ai-service (docs) | http://localhost:8001/docs |
| PostgreSQL | localhost:5432 (`chifawok` / `chifawok`) |

Usuario del panel: **admin@chifawok.pe / admin123**

## Opción B — Local, servicio por servicio

Requisitos: JDK 17, Maven 3.9+, Node 20+, Python 3.12, PostgreSQL 16 (o `make db`).

```bash
# 1) Base de datos
docker compose up -d db            # o un PostgreSQL propio en localhost:5432

# 2) Backend  (aplica las migraciones Flyway al arrancar)
cd backend && mvn spring-boot:run
#    -> http://localhost:8080

# 3) Microservicio de IA
cd ai-service
python -m venv .venv && source .venv/Scripts/activate   # Windows
pip install -r requirements.txt
cp .env.example .env                # LLM_PROVIDER=fake por defecto (sin API key)
uvicorn app.main:app --reload --port 8001

# 4) Frontend
cd frontend && npm install && npm start
#    -> http://localhost:4200
```

## Activar un LLM real (opcional)

En `ai-service/.env`:
```
LLM_PROVIDER=openai        # o anthropic
LLM_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-...
```

## Pruebas

```bash
cd backend && mvn test
cd ai-service && pytest
```

## Variables de entorno

Todas están documentadas con sus valores por defecto en [`.env.example`](../.env.example)
y en el README de cada servicio.
