# 10 · Pantallas y navegación

Todas las vistas viven en `frontend/src/app/features/`. El enrutado está en
[`app.routes.ts`](../frontend/src/app/app.routes.ts) (componentes *standalone*, carga
diferida por ruta).

## Mapa de rutas

```
/                         LandingComponent            público
/carta                    MenuComponent               público   ┐ dentro de
/mis-pedidos              MisPedidosComponent          cliente   ┘ AccountShellComponent (sidebar)
/ingresar                 LoginComponent              público
/admin                    AdminLayoutComponent         JWT      ┐
  /admin/dashboard        DashboardComponent           JWT      │ hijos con
  /admin/pedidos          OrdersComponent              JWT      │ <router-outlet>
  /admin/sesiones-voz     VoiceSessionsComponent       JWT      ┘
(*)  <cw-voice-widget>    VoiceWidgetComponent        siempre montado en AppComponent
```

`authGuard` protege `/admin/**`; si no hay token redirige a `/ingresar`.

## Cliente

### `/` — Landing (`features/landing/`)
Fiel al diseño de Google Stitch. Hero con imagen de fondo + tarjeta de conversación
"glass", sección **Platos Estrella** (`GET /api/catalogo/destacados`), sección
"Nosotros", footer. Todos los CTA abren el asistente de voz.

### `/carta` — Carta completa (`features/account/menu.component.ts`)
Sidebar de cliente + selector de categorías (pills) + grid de tarjetas
(`GET /api/catalogo/carta`, agrupado por categoría). "Agregar al Pedido" abre el widget.

### `/mis-pedidos` — Mis Pedidos (`features/account/mis-pedidos.component.ts`)
- **Pedido activo**: cabecera + *status tracker* de 4 pasos
  (Recibido → Preparando → En camino → Entregado) + ítems + **Resumen del Pedido**.
- **Historial**: pedidos `ENTREGADO` / `CANCELADO` con botón **Repetir Pedido**
  (`POST /api/pedidos/{id}/repetir`).
- Se apoya en `ClienteLocalService` (guarda el `clienteId` en `localStorage` tras el
  primer pedido por voz). Sin cliente → estado vacío con CTA.

### Widget de voz (`features/voice-widget/`)
Modal centrado con *backdrop*. `speech.service.ts` envuelve la **Web Speech API**
(STT `es-PE` + TTS). Flujo: micrófono → `POST /api/voz/interpretar` → burbujas
Tú / Asistente Wok → resumen del carrito → campo de celular → **Confirmar Pedido**
(`POST /api/voz/confirmar`, crea cliente + pedido) → "Ver el seguimiento".

## Staff

### `/ingresar` — Login (`features/auth/login.component.ts`)
Panel de marca + formulario reactivo. Email y contraseña con iconos, **botón
mostrar/ocultar contraseña**, validación con mensajes, spinner al enviar, enlace
**"Volver al inicio"**. `AuthService` guarda el JWT en `localStorage` (signals).

### `/admin` — Layout (`features/admin/admin-layout.component.ts`)
Sidebar fija (ícono relleno en la sección activa, avatar + rol + logout), *topbar*
con título dinámico según la ruta y la fecha, tabs horizontales en móvil.

### `/admin/dashboard` (`dashboard.component.ts`)
`GET /api/dashboard/resumen`. 4 KPIs (pedidos hoy, en preparación, ventas hoy,
conversión de voz), barras de **ventas de 7 días**, ranking de **platos más vendidos**,
*skeletons* mientras carga.

### `/admin/pedidos` (`orders.component.ts`)
`GET /api/pedidos/tablero`. **Tablero por columnas**: Pendientes · En preparación ·
Listos · En camino. Cada tarjeta avanza de estado (`PATCH /api/pedidos/{id}/estado`,
valida la transición) o se cancela.

### `/admin/sesiones-voz` (`voice-sessions.component.ts`)
`GET /api/voz/sesiones`. Tarjetas con burbuja del cliente y del asistente, intención
(chip verde/rojo según éxito), latencia y modelo LLM usado.
