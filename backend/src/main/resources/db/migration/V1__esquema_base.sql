-- ============================================================================
-- V1  Esquema base: auditoria, usuarios del panel, clientes y direcciones
-- ============================================================================

-- Mantiene la columna actualizado_en en cada UPDATE
CREATE OR REPLACE FUNCTION fn_set_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------- usuarios
CREATE TABLE usuarios (
    id             BIGSERIAL PRIMARY KEY,
    nombre         VARCHAR(120)  NOT NULL,
    email          VARCHAR(160)  NOT NULL,
    password_hash  VARCHAR(100)  NOT NULL,           -- BCrypt
    rol            VARCHAR(20)   NOT NULL DEFAULT 'OPERADOR',
    activo         BOOLEAN       NOT NULL DEFAULT TRUE,
    ultimo_acceso  TIMESTAMPTZ,
    creado_en      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    actualizado_en TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT uq_usuarios_email  UNIQUE (email),
    CONSTRAINT ck_usuarios_rol    CHECK (rol IN ('ADMIN', 'OPERADOR', 'COCINA'))
);
CREATE TRIGGER tg_usuarios_upd BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION fn_set_actualizado_en();

-- ---------------------------------------------------------------- clientes
CREATE TABLE clientes (
    id             BIGSERIAL PRIMARY KEY,
    nombre         VARCHAR(140)  NOT NULL,
    telefono       VARCHAR(20),
    email          VARCHAR(160),
    documento      VARCHAR(20),
    notas          VARCHAR(400),
    creado_en      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    actualizado_en TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX ix_clientes_telefono ON clientes (telefono);
CREATE TRIGGER tg_clientes_upd BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION fn_set_actualizado_en();

-- ---------------------------------------------------------- direcciones_cliente
CREATE TABLE direcciones_cliente (
    id             BIGSERIAL PRIMARY KEY,
    cliente_id     BIGINT        NOT NULL REFERENCES clientes (id) ON DELETE CASCADE,
    etiqueta       VARCHAR(40)   NOT NULL DEFAULT 'Casa',
    direccion      VARCHAR(240)  NOT NULL,
    referencia     VARCHAR(240),
    distrito       VARCHAR(80),
    latitud        NUMERIC(10,7),
    longitud       NUMERIC(10,7),
    predeterminada BOOLEAN       NOT NULL DEFAULT FALSE,
    creado_en      TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX ix_direcciones_cliente ON direcciones_cliente (cliente_id);
