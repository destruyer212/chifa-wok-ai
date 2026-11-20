# Pruebas funcionales y evidencia

Este documento consolida la verificacion del sistema Chifa Wok. Los datos con
prefijo `TEST-` y los clientes `*.demo@chifawok.pe` son datos de prueba.

## Requerimientos funcionales implementados

| Codigo | Funcion | Evidencia en el sistema |
|---|---|---|
| RF-01 | Inicio y cierre de sesion administrativa | `AuthController`, JWT, `/ingresar` |
| RF-02/RF-03 | Captura y transcripcion de voz | Widget de voz y Web Speech API |
| RF-04/RF-05 | Interpretacion y extraccion de platos | `ai-service`, reglas y carta vigente |
| RF-06 | Confirmacion hablada | Speech Synthesis del navegador |
| RF-07 | Calculo de totales | `PedidoService.recalcularTotales()` |
| RF-08/RF-09 | Registro y flujo de estados | Monitor `/admin/pedidos` |
| RF-10 | Registro de sesiones de voz | `/admin/sesiones-voz` |
| RF-11 | Dashboard de metricas | `/admin/dashboard` |
| RF-12 | Catalogo y disponibilidad | `/admin/productos`, persistencia local y API |
| RF-13 | Directorio de clientes | `/admin/clientes` |
| RF-14 | Mensajes de validacion | Handler global y formularios Angular |

## Casos de prueba

| Codigo | Prueba | Resultado esperado | Estado |
|---|---|---|---|
| CP-01 | Login valido | JWT y acceso al admin | Implementado |
| CP-02 | Credenciales incorrectas | HTTP 401 y mensaje visible | Implementado |
| CP-03 | Dashboard sin token | Acceso rechazado | Implementado |
| CP-04 | Dos chaufa y una Inka Kola | CHF-001 x2, BEB-001 x1 y S/ 73.00 | Implementado |
| CP-05 | Consulta de carta | `CONSULTAR_MENU` sin items | Implementado |
| CP-06 | Cancelacion por voz | `CANCELAR` | Implementado |
| CP-07 | Plato inexistente | HTTP 404 | Implementado |
| CP-08 | Delivery sin direccion | HTTP 422 | Implementado |
| CP-09 | Cantidad cero | HTTP 400/validacion de negocio | Implementado |
| CP-10 | Estado sobre pedido finalizado | HTTP 422 | Implementado |
| CP-11 | Pruebas unitarias | `mvn test` y `pytest` en verde | Pendiente de entorno Python limpio |
| CP-12 | Docker Compose | DB, IA, backend y frontend activos | Verificado |
| CP-13 | Registrar cliente y direccion | Cliente disponible para asociar pedidos y delivery | Implementado |
| CP-14 | Operacion invalida | Mensaje claro y rechazo sin guardar datos incompletos | Implementado |

## Datos de demostracion

La base contiene 15 pedidos `TEST-0001` a `TEST-0015`, distribuidos entre
pendientes, confirmados, preparacion, listos, camino y entregados. Tambien
contiene sesiones de voz de crear, modificar, consultar, confirmar, cancelar
y error de reconocimiento.

## Comandos de verificacion

```powershell
docker compose up -d
cd backend
mvn test
cd ..\ai-service
python -m pytest -q
cd ..\frontend
npm run build
```

## Observacion

La prueba de IA debe ejecutarse en un entorno virtual creado con las versiones
de `requirements.txt`. Si el Python global tiene versiones mezcladas de
`pydantic` y `pydantic-core`, pytest puede fallar durante la importacion antes
de ejecutar los casos; esto no representa un fallo del interprete del sistema.
