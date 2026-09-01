-- ============================================================================
-- V2  Catalogo de la carta: categorias, platos, presentaciones, opciones,
--     e inventario de insumos.
-- ============================================================================

CREATE TABLE categorias (
    id          BIGSERIAL PRIMARY KEY,
    nombre      VARCHAR(80)  NOT NULL,
    descripcion VARCHAR(240),
    icono       VARCHAR(40),
    orden       INT          NOT NULL DEFAULT 0,
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_categorias_nombre UNIQUE (nombre)
);

CREATE TABLE platos (
    id                     BIGSERIAL PRIMARY KEY,
    categoria_id           BIGINT       NOT NULL REFERENCES categorias (id),
    codigo                 VARCHAR(20)  NOT NULL,
    nombre                 VARCHAR(140) NOT NULL,
    descripcion            VARCHAR(400),
    precio                 NUMERIC(10,2) NOT NULL,
    disponible             BOOLEAN      NOT NULL DEFAULT TRUE,
    destacado              BOOLEAN      NOT NULL DEFAULT FALSE,
    imagen_url             VARCHAR(400),
    calorias               INT,
    tiempo_preparacion_min INT,
    creado_en              TIMESTAMPTZ  NOT NULL DEFAULT now(),
    actualizado_en         TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_platos_codigo UNIQUE (codigo),
    CONSTRAINT ck_platos_precio CHECK (precio > 0)
);
CREATE INDEX ix_platos_categoria ON platos (categoria_id);
CREATE INDEX ix_platos_disponible ON platos (disponible);
CREATE TRIGGER tg_platos_upd BEFORE UPDATE ON platos
    FOR EACH ROW EXECUTE FUNCTION fn_set_actualizado_en();

-- Presentaciones / tamanios de un plato (Personal, Mediano, Familiar)
CREATE TABLE plato_presentaciones (
    id             BIGSERIAL PRIMARY KEY,
    plato_id       BIGINT        NOT NULL REFERENCES platos (id) ON DELETE CASCADE,
    nombre         VARCHAR(40)   NOT NULL,
    precio         NUMERIC(10,2) NOT NULL,
    predeterminada BOOLEAN       NOT NULL DEFAULT FALSE,
    CONSTRAINT ck_presentacion_precio CHECK (precio > 0),
    CONSTRAINT uq_presentacion UNIQUE (plato_id, nombre)
);

-- Grupos de opciones / modificadores (Terminos de coccion, Agregados, ...)
CREATE TABLE grupos_opcion (
    id            BIGSERIAL PRIMARY KEY,
    nombre        VARCHAR(80) NOT NULL,
    seleccion_min INT         NOT NULL DEFAULT 0,
    seleccion_max INT         NOT NULL DEFAULT 1,
    CONSTRAINT ck_grupo_seleccion CHECK (seleccion_min >= 0 AND seleccion_max >= seleccion_min)
);

CREATE TABLE opciones (
    id           BIGSERIAL PRIMARY KEY,
    grupo_id     BIGINT        NOT NULL REFERENCES grupos_opcion (id) ON DELETE CASCADE,
    nombre       VARCHAR(80)   NOT NULL,
    precio_extra NUMERIC(10,2) NOT NULL DEFAULT 0,
    CONSTRAINT ck_opcion_precio CHECK (precio_extra >= 0)
);

CREATE TABLE plato_grupo_opcion (
    plato_id BIGINT NOT NULL REFERENCES platos (id) ON DELETE CASCADE,
    grupo_id BIGINT NOT NULL REFERENCES grupos_opcion (id) ON DELETE CASCADE,
    PRIMARY KEY (plato_id, grupo_id)
);

-- ---- Inventario de insumos (materia prima del restaurante) ----
CREATE TABLE insumos (
    id            BIGSERIAL PRIMARY KEY,
    nombre        VARCHAR(120)  NOT NULL,
    unidad        VARCHAR(12)   NOT NULL DEFAULT 'unidad',   -- kg, l, unidad
    stock_actual  NUMERIC(12,3) NOT NULL DEFAULT 0,
    stock_minimo  NUMERIC(12,3) NOT NULL DEFAULT 0,
    activo        BOOLEAN       NOT NULL DEFAULT TRUE,
    CONSTRAINT ck_insumo_stock CHECK (stock_actual >= 0 AND stock_minimo >= 0)
);

-- Receta: insumos que consume cada plato
CREATE TABLE plato_insumo (
    plato_id  BIGINT        NOT NULL REFERENCES platos (id) ON DELETE CASCADE,
    insumo_id BIGINT        NOT NULL REFERENCES insumos (id) ON DELETE CASCADE,
    cantidad  NUMERIC(12,3) NOT NULL,
    PRIMARY KEY (plato_id, insumo_id),
    CONSTRAINT ck_plato_insumo_cant CHECK (cantidad > 0)
);
