# ai-service/ — Microservicio de IA (Python 3.12 · FastAPI · LangChain)

Interpreta la **transcripción de voz** del cliente y devuelve:
la **intención**, los **platos del pedido** (validados contra la carta que envía el
backend) y el **texto de confirmación** que el navegador lee en voz alta (TTS).

## Estructura

```
app/
├── main.py                 FastAPI + CORS + routers
├── config.py               Settings (LLM_PROVIDER, modelo, API keys)
├── api/routes/
│   ├── health.py           GET /health
│   └── interpret.py        POST /interpretar
├── schemas/voice.py        InterpretRequest / InterpretResponse / ItemBorrador
├── core/llm.py             Fábrica de LLM: openai | anthropic | fake
├── chains/
│   ├── prompts.py          System prompt del asistente del Chifa Wok
│   └── interpreter.py      Cadena LangChain (o respaldo por reglas)
└── services/
    ├── rule_extractor.py   Extracción por reglas (modo fake, sin API key)
    └── confirmation.py     Generación del texto para Text-to-Speech
```

## Proveedores LLM

| `LLM_PROVIDER` | Requiere | Comportamiento |
|----------------|----------|----------------|
| `fake` (default) | nada | Extrae platos por coincidencia difusa con la carta. Ideal para desarrollo/demos. |
| `openai` | `OPENAI_API_KEY` | `ChatOpenAI` vía `langchain-openai`. |
| `anthropic` | `ANTHROPIC_API_KEY` | `ChatAnthropic` vía `langchain-anthropic`. |

## Ejecutar

```bash
python -m venv .venv && source .venv/Scripts/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8001
pytest                       # pruebas del extractor (modo fake, sin red)
```

- Docs interactivas: http://localhost:8001/docs

## Contrato con el backend

`POST /interpretar`

```jsonc
// request
{ "texto": "quiero un aeropuerto familiar y dos inka kola",
  "sesionUuid": "…", "menu": [{ "codigo": "CMB-001", "nombre": "Aeropuerto Familiar", "precio": 55.0 }] }

// response
{ "intencion": "CREAR_PEDIDO", "confianza": 0.55,
  "items": [{ "codigoPlato": "CMB-001", "nombrePlato": "Aeropuerto Familiar", "cantidad": 1 }],
  "respuestaAsistente": "Anote 1 Aeropuerto Familiar… Confirmas el pedido?",
  "requiereConfirmacion": true, "modeloLlm": "fake-rules" }
```
