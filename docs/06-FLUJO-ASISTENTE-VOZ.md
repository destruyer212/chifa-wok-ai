# 06 · Flujo del asistente de voz

```
Cliente          Frontend (Angular)         Backend (Spring)          ai-service (FastAPI)
  │                     │                          │                          │
  │  toca 🎤            │                          │                          │
  │────────────────────▶│ SpeechService.escuchar() │                          │
  │  habla              │ Web Speech API → texto    │                          │
  │                     │                          │                          │
  │                     │ POST /api/voz/interpretar │                          │
  │                     │─────────────────────────▶│                          │
  │                     │  { transcripcion,        │ arma menú (catálogo)     │
  │                     │    sesionUuid }          │ POST /interpretar        │
  │                     │                          │─────────────────────────▶│
  │                     │                          │  { texto, menu[] }       │ LangChain / LLM
  │                     │                          │                          │ (o reglas si fake)
  │                     │                          │◀─────────────────────────│
  │                     │                          │  { intencion, items[],   │
  │                     │                          │    respuestaAsistente }  │
  │                     │                          │ valida items vs carta    │
  │                     │                          │ calcula total            │
  │                     │                          │ guarda sesiones_voz      │
  │                     │◀─────────────────────────│                          │
  │                     │  VozResponse             │                          │
  │  escucha 🔊         │ SpeechService.hablar()   │                          │
  │◀────────────────────│ Web Speech API (TTS)     │                          │
```

## Paso a paso

1. **STT (navegador)** — `SpeechService.escuchar('es-PE')` usa `SpeechRecognition`.
   Emite la transcripción final por un `Observable<string>`.
2. **Envío** — `VoiceApiService.interpretar(texto, sesionUuid)` → `POST /api/voz/interpretar`
   (ruta pública, sin JWT).
3. **Orquestación** (`VozService`):
   - recupera/crea la `SesionVoz` por `uuid`;
   - construye el contexto de menú (`codigo`, `nombre`, `precio`) desde `CatalogoService`;
   - llama a `AiClient.interpretar(...)` → `ai-service`.
4. **Interpretación** (`ai-service/chains/interpreter.py`):
   - si `LLM_PROVIDER != fake`: prompt con la carta → LLM → JSON estructurado;
   - si `fake`: `rule_extractor.py` hace *fuzzy match* del texto contra los nombres de
     la carta y detecta cantidades ("dos", "3", "un"…);
   - `confirmation.py` redacta el texto para el TTS.
5. **Validación y cálculo** (backend) — descarta ítems cuyo `codigoPlato` no esté en la
   carta, calcula `subtotal` y `total` con precios reales, persiste la sesión
   (`intencion`, `entidades` JSONB, `latencia_ms`, `modelo_llm`, `exito`).
6. **TTS (navegador)** — `SpeechService.hablar(respuestaAsistente)` usa `speechSynthesis`.
7. **Confirmación** — si `requiereConfirmacion`, el cliente dice "sí"/"confirmo" y el
   frontend hace `POST /api/pedidos` con los `items` sugeridos.

## Métricas registradas

Cada llamada deja una fila en `sesiones_voz`. El dashboard lee `vw_metricas_voz`:
sesiones/día, tasa de conversión (sesiones que terminaron en pedido) y latencia media.
