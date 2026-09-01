-- ============================================================================
-- V5  Vistas de reporte para el dashboard administrativo
-- ============================================================================

-- Ventas por dia (solo pedidos que llegaron a ENTREGADO)
CREATE VIEW vw_ventas_diarias AS
SELECT date_trunc('day', p.creado_en)::date       AS fecha,
       count(*)                                   AS num_pedidos,
       coalesce(sum(p.total), 0)                  AS total_vendido,
       coalesce(round(avg(p.total), 2), 0)        AS ticket_promedio
FROM pedidos p
WHERE p.estado = 'ENTREGADO'
GROUP BY 1
ORDER BY 1;

-- Platos mas vendidos
CREATE VIEW vw_platos_mas_vendidos AS
SELECT pi.plato_id,
       pi.nombre_plato,
       sum(pi.cantidad)                           AS unidades,
       sum(pi.subtotal)                           AS ingresos
FROM pedido_items pi
JOIN pedidos p ON p.id = pi.pedido_id
WHERE p.estado <> 'CANCELADO'
GROUP BY pi.plato_id, pi.nombre_plato
ORDER BY unidades DESC;

-- Metricas del asistente de voz (tasa de conversion sesion -> pedido)
CREATE VIEW vw_metricas_voz AS
SELECT date_trunc('day', s.creado_en)::date       AS fecha,
       count(*)                                   AS sesiones,
       count(*) FILTER (WHERE s.exito)            AS sesiones_exito,
       count(DISTINCT p.id)                       AS pedidos_generados,
       round(
           count(DISTINCT p.id)::numeric
           / nullif(count(*), 0) * 100, 1)        AS tasa_conversion_pct,
       round(avg(s.latencia_ms))                  AS latencia_promedio_ms
FROM sesiones_voz s
LEFT JOIN pedidos p ON p.sesion_voz_id = s.id
GROUP BY 1
ORDER BY 1;

-- Insumos por debajo del stock minimo
CREATE VIEW vw_insumos_stock_bajo AS
SELECT id, nombre, unidad, stock_actual, stock_minimo
FROM insumos
WHERE activo AND stock_actual <= stock_minimo;
