# frontend/ — Cliente web + panel admin (Angular 18)

Contiene **dos experiencias** en una sola SPA:

1. **Landing + widget de voz** (público) — el cliente del Chifa Wok pide hablando.
2. **Panel administrativo** (`/admin`, protegido con JWT) — dashboard, pedidos, sesiones de voz.

## Estructura (`src/app/`)

| Carpeta | Contenido |
|---------|-----------|
| `core/models.ts` | Tipos compartidos (Plato, Pedido, VozResponse, DashboardDTO…). |
| `core/*.service.ts` | `AuthService` (signals + localStorage), `CatalogService`, `OrderService`, `VoiceApiService`, `DashboardService`. |
| `core/interceptors/auth.interceptor.ts` | Inyecta el `Authorization: Bearer`. |
| `core/guards/auth.guard.ts` | Protege `/admin`. |
| `features/landing/` | Página pública con la carta destacada. |
| `features/voice-widget/` | **`speech.service.ts`** (Web Speech API: STT + TTS) + `voice-widget.component.ts` (botón flotante, chat, confirmación hablada). |
| `features/auth/` | `login.component.ts`. |
| `features/admin/` | `admin-layout`, `dashboard`, `orders` (tablero con cambio de estado), `voice-sessions`. |

## Sistema de diseño

`tailwind.config.js` implementa el esquema Material Design 3 **"Andean Dragon"**:

| Rol | Color |
|-----|-------|
| Primary (rojo chifa) | `#af101a` / container `#d32f2f` |
| Secondary (dorado) | `#795900` / `#fbc02d` |
| Tertiary (azul asistente de voz) | `#0058a2` / `#0770cc` |
| Background | `#fcf9f8` · On-background `#1b1c1c` |

Tipografía: **Montserrat** (`font-headline-*`, `font-display-lg`) + **Inter** (`font-body-*`, `font-label-*`).
Íconos: **Material Symbols Outlined** (cargados en `styles.css`).

## Ejecutar

```bash
npm install
npm start                     # http://localhost:4200  (proxy API -> :8080 via environment)
npm run build                 # dist/chifawok-frontend/browser
```

> El widget de voz requiere un navegador con **Web Speech API** (Chrome / Edge) y permiso de micrófono.
