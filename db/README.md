# Base de datos — PostgreSQL 16

Las migraciones **canónicas** viven en
[`../backend/src/main/resources/db/migration/`](../backend/src/main/resources/db/migration/)
y las aplica **Flyway** al arrancar el backend. Esta carpeta contiene el modelo
entidad-relación y notas de diseño.

## Tablas

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Cuentas del panel administrativo (ADMIN / OPERADOR). Password con BCrypt. |
| `clientes` | Clientes finales que hacen pedidos por voz o web. |
| `categorias` | Categorías de la carta (Chaufas, Tallarines, Sopas, Bebidas, …). |
| `platos` | Ítems de la carta del chifa: nombre, precio, tamaño, disponibilidad. |
| `pedidos` | Cabecera del pedido: canal (VOZ/WEB), estado, tipo de entrega, total. |
| `pedido_items` | Detalle: plato, cantidad, precio unitario, subtotal. |
| `sesiones_voz` | Transcripción del cliente, respuesta del asistente, intención, latencia. |

## Reglas de integridad

- `platos.precio > 0`, `platos` pertenece a una `categoria`.
- `pedido_items.cantidad > 0`; `subtotal = cantidad * precio_unitario`.
- Cada `pedido` referencia a un `cliente`; puede referenciar la `sesion_voz` que lo originó.
- `pedidos.total` = suma de subtotales de sus ítems (recalculado por la capa Service).

Ver el diagrama en [`er/modelo-er.md`](er/modelo-er.md).
