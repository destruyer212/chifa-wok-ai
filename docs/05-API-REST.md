# 05 · API REST del backend

Base: `http://localhost:8080/api` · Swagger UI: `/swagger-ui.html` · OpenAPI: `/v3/api-docs`

## Autenticación

`POST /api/auth/login`
```json
{ "email": "admin@chifawok.pe", "password": "admin123" }
```
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9…", "tipo": "Bearer", "expiraEnMinutos": 120,
  "nombre": "Administrador Chifa Wok", "rol": "ADMIN" }
```
Enviar en las rutas protegidas: `Authorization: Bearer <token>`.

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Inicia sesión, devuelve JWT |
| POST | `/api/auth/registro` | — | Registra un operador |
| GET | `/api/catalogo/carta` | — | Carta completa por categorías |
| GET | `/api/catalogo/destacados` | — | Platos destacados (landing) |
| GET | `/api/catalogo/platos/{codigo}` | — | Detalle de un plato |
| POST | `/api/voz/interpretar` | — | **Widget**: transcripción → respuesta del asistente |
| POST | `/api/voz/confirmar` | — | **Widget**: el cliente confirma → crea cliente (por teléfono) + pedido canal VOZ |
| GET | `/api/voz/sesiones` | JWT | Historial de sesiones de voz (paginado) |
| POST | `/api/pedidos` | — | Crea un pedido (desde el widget o la web) |
| GET | `/api/pedidos` | JWT | Lista de pedidos (filtro `?estado=`) |
| GET | `/api/pedidos/tablero` | JWT | Pedidos activos (cocina) |
| GET | `/api/pedidos/cliente/{clienteId}` | — | **"Mis Pedidos"**: pedidos de un cliente (activo + historial) |
| POST | `/api/pedidos/{id}/repetir` | — | Repite un pedido anterior (mismos platos y cantidades) |
| GET | `/api/pedidos/{id}` | — | Detalle |
| PATCH | `/api/pedidos/{id}/estado` | JWT | Cambia el estado (valida transición) |
| GET | `/api/clientes` | JWT | Lista/búsqueda (`?q=`) paginada |
| POST/PUT | `/api/clientes` · `/api/clientes/{id}` | JWT | Alta / edición |
| DELETE | `/api/clientes/{id}` | JWT + ROLE_ADMIN | Baja |
| GET | `/api/dashboard/resumen` | JWT | KPIs + ventas 7 días + top platos |

## Ejemplo — crear pedido

`POST /api/pedidos`
```json
{
  "clienteId": 1,
  "canal": "VOZ",
  "tipoEntrega": "DELIVERY",
  "direccionEntrega": "Av. Los Alisos 123, Los Olivos",
  "metodoPago": "YAPE",
  "sesionVozId": 42,
  "items": [
    { "codigoPlato": "CMB-001", "cantidad": 1 },
    { "codigoPlato": "BEB-001", "cantidad": 2 }
  ]
}
```
El backend valida disponibilidad, resuelve precios (incl. presentación) y calcula
`subtotal`, `costoEnvio`, `descuento`, `total`.

## Errores

Formato uniforme (`GlobalExceptionHandler`):
```json
{ "timestamp": "2026-08-31T18:40:00Z", "status": 422, "error": "Unprocessable Entity",
  "message": "El plato 'Sopa Wantan' no esta disponible", "path": "/api/pedidos" }
```
| HTTP | Cuándo |
|------|--------|
| 400 | Validación de payload (`fieldErrors` incluido) |
| 401/403 | Sin token / sin rol |
| 404 | `NotFoundException` |
| 422 | `BusinessException` (regla de negocio) |
