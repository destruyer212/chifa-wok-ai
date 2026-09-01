-- ============================================================================
-- V3  Pedidos: cabecera, detalle, opciones elegidas e historial de estados
-- ============================================================================

CREATE TABLE pedidos (
    id                    BIGSERIAL PRIMARY KEY,
    codigo                VARCHAR(24)  NOT NULL,
    cliente_id            BIGINT       NOT NULL REFERENCES clientes (id),
    sesion_voz_id         BIGINT,                       -- FK agregada en V4
    canal                 VARCHAR(12)  NOT NULL DEFAULT 'WEB',
    estado                VARCHAR(16)  NOT NULL DEFAULT 'BORRADOR',
    tipo_entrega          VARCHAR(10)  NOT NULL DEFAULT 'RECOJO',
    direccion_entrega_id  BIGINT REFERENCES direcciones_cliente (id),
    direccion_entrega     VARCHAR(240),
    metodo_pago           VARCHAR(14)  NOT NULL DEFAULT 'POR_DEFINIR',
    subtotal              NUMERIC(10,2) NOT NULL DEFAULT 0,
    costo_envio           NUMERIC(10,2) NOT NULL DEFAULT 0,
    descuento             NUMERIC(10,2) NOT NULL DEFAULT 0,
    total                 NUMERIC(10,2) NOT NULL DEFAULT 0,
    notas                 VARCHAR(400),
    programado_para       TIMESTAMPTZ,
    creado_en             TIMESTAMPTZ  NOT NULL DEFAULT now(),
    actualizado_en        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_pedidos_codigo UNIQUE (codigo),
    CONSTRAINT ck_pedidos_canal  CHECK (canal IN ('VOZ', 'WEB', 'TELEFONO')),
    CONSTRAINT ck_pedidos_estado CHECK (estado IN
        ('BORRADOR','PENDIENTE','CONFIRMADO','EN_PREPARACION','LISTO','EN_CAMINO','ENTREGADO','CANCELADO')),
    CONSTRAINT ck_pedidos_entrega CHECK (tipo_entrega IN ('RECOJO','DELIVERY')),
    CONSTRAINT ck_pedidos_pago    CHECK (metodo_pago IN ('EFECTIVO','YAPE','PLIN','TARJETA','POR_DEFINIR')),
    CONSTRAINT ck_pedidos_montos  CHECK (subtotal >= 0 AND total >= 0 AND costo_envio >= 0 AND descuento >= 0)
);
CREATE INDEX ix_pedidos_cliente ON pedidos (cliente_id);
CREATE INDEX ix_pedidos_estado  ON pedidos (estado);
CREATE INDEX ix_pedidos_creado  ON pedidos (creado_en);
CREATE TRIGGER tg_pedidos_upd BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION fn_set_actualizado_en();

CREATE TABLE pedido_items (
    id                    BIGSERIAL PRIMARY KEY,
    pedido_id             BIGINT        NOT NULL REFERENCES pedidos (id) ON DELETE CASCADE,
    plato_id              BIGINT        NOT NULL REFERENCES platos (id),
    plato_presentacion_id BIGINT REFERENCES plato_presentaciones (id),
    nombre_plato          VARCHAR(160)  NOT NULL,          -- snapshot
    cantidad              INT           NOT NULL,
    precio_unitario       NUMERIC(10,2) NOT NULL,
    subtotal              NUMERIC(10,2) NOT NULL,
    notas                 VARCHAR(240),
    CONSTRAINT ck_item_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_item_montos   CHECK (precio_unitario >= 0 AND subtotal >= 0)
);
CREATE INDEX ix_pedido_items_pedido ON pedido_items (pedido_id);

CREATE TABLE pedido_item_opciones (
    id             BIGSERIAL PRIMARY KEY,
    pedido_item_id BIGINT        NOT NULL REFERENCES pedido_items (id) ON DELETE CASCADE,
    opcion_id      BIGINT        REFERENCES opciones (id),
    nombre_opcion  VARCHAR(80)   NOT NULL,                 -- snapshot
    precio_extra   NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE pedido_estados_historial (
    id          BIGSERIAL PRIMARY KEY,
    pedido_id   BIGINT      NOT NULL REFERENCES pedidos (id) ON DELETE CASCADE,
    estado      VARCHAR(16) NOT NULL,
    comentario  VARCHAR(240),
    usuario_id  BIGINT REFERENCES usuarios (id),
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_hist_pedido ON pedido_estados_historial (pedido_id);
