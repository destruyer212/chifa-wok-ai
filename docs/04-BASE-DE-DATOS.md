# 04 · Base de datos (PostgreSQL 16 · Flyway)

Migraciones en `backend/src/main/resources/db/migration/`. Se aplican automáticamente
al arrancar el backend.

| Versión | Objetos creados |
|---------|-----------------|
| **V1** `esquema_base` | `fn_set_actualizado_en()` (trigger de auditoría), `usuarios`, `clientes`, `direcciones_cliente` |
| **V2** `catalogo` | `categorias`, `platos`, `plato_presentaciones`, `grupos_opcion`, `opciones`, `plato_grupo_opcion`, `insumos`, `plato_insumo` |
| **V3** `pedidos` | `pedidos`, `pedido_items`, `pedido_item_opciones`, `pedido_estados_historial` |
| **V4** `voz_ia` | `sesiones_voz`, `sesion_voz_turnos`, FK `pedidos.sesion_voz_id → sesiones_voz` |
| **V5** `vistas_metricas` | `vw_ventas_diarias`, `vw_platos_mas_vendidos`, `vw_metricas_voz`, `vw_insumos_stock_bajo` |
| **V6** `datos_semilla` | 2 usuarios, 5 categorías, 9 platos, presentaciones, opciones, insumos |

## Tablas principales

### `usuarios` — acceso al panel
`id · nombre · email (UK) · password_hash (BCrypt) · rol {ADMIN,OPERADOR,COCINA} · activo · ultimo_acceso · creado_en · actualizado_en`

### `clientes` + `direcciones_cliente`
Un cliente puede tener varias direcciones de entrega (`predeterminada`, lat/lng, distrito).

### `categorias` → `platos` → `plato_presentaciones`
- `platos.precio > 0` (CHECK), `codigo` único (`CHF-001`…), `destacado` para la landing.
- Un plato puede tener presentaciones (Personal / Mediano / Familiar) con precio propio.
- Modificadores opcionales vía `grupos_opcion` + `opciones` (N:M con `plato_grupo_opcion`).

### `pedidos` + `pedido_items` + `pedido_item_opciones`
- `pedidos`: `codigo` (`P-AAAAMMDD-NNNN`), `canal {VOZ,WEB,TELEFONO}`,
  `estado {BORRADOR,PENDIENTE,CONFIRMADO,EN_PREPARACION,LISTO,EN_CAMINO,ENTREGADO,CANCELADO}`,
  `tipo_entrega {RECOJO,DELIVERY}`, `metodo_pago`, montos con CHECK ≥ 0.
- `pedido_items`: `cantidad > 0`, `nombre_plato` guardado como *snapshot* (histórico inmutable).
- `pedido_estados_historial`: traza de cada cambio de estado (quién y cuándo).
- FK `pedidos.sesion_voz_id` → enlaza el pedido con la conversación que lo originó.

### `sesiones_voz` + `sesion_voz_turnos`
- `transcripcion_usuario`, `respuesta_asistente`, `intencion` (CHECK con 7 valores),
  `entidades JSONB`, `confianza`, `exito`, `latencia_ms`, `modelo_llm`.
- `sesion_voz_turnos`: conversación multi-turno (`USUARIO` / `ASISTENTE` / `SISTEMA`).

## Reglas de integridad (a nivel BD)

| Regla | Dónde |
|-------|-------|
| Precio de plato/presentación/opción no negativo | CHECK `ck_platos_precio`, `ck_presentacion_precio`, `ck_opcion_precio` |
| Cantidad de ítem > 0 | CHECK `ck_item_cantidad` |
| Montos de pedido ≥ 0 | CHECK `ck_pedidos_montos`, `ck_item_montos` |
| Enums cerrados (estado, canal, rol, intención…) | CHECK con lista de valores |
| Stock de insumo ≥ 0 | CHECK `ck_insumo_stock` |
| `actualizado_en` siempre fresco | Trigger `fn_set_actualizado_en()` |

## Vistas de reporte (consumidas por el dashboard)

| Vista | Devuelve |
|-------|----------|
| `vw_ventas_diarias` | fecha · nº pedidos · total vendido · ticket promedio (pedidos ENTREGADO) |
| `vw_platos_mas_vendidos` | plato · unidades · ingresos |
| `vw_metricas_voz` | fecha · sesiones · sesiones con éxito · pedidos generados · **% conversión** · latencia media |
| `vw_insumos_stock_bajo` | insumos con `stock_actual ≤ stock_minimo` |

## Diagrama ER

Ver [`db/er/modelo-er.md`](../db/er/modelo-er.md) (Mermaid). Sirve de base para la
*Figura del Modelo Entidad-Relación* que falta en el Word.
