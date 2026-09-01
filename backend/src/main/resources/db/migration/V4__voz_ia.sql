-- ============================================================================
-- V4  Sesiones de voz y conversacion con el asistente de IA
-- ============================================================================

CREATE TABLE sesiones_voz (
    id                   BIGSERIAL PRIMARY KEY,
    uuid                 UUID          NOT NULL DEFAULT gen_random_uuid(),
    cliente_id           BIGINT REFERENCES clientes (id),
    canal_origen         VARCHAR(40)   NOT NULL DEFAULT 'widget-web',
    transcripcion_usuario TEXT,
    respuesta_asistente  TEXT,
    intencion            VARCHAR(24),
    entidades            JSONB,
    confianza            NUMERIC(4,3),
    exito                BOOLEAN       NOT NULL DEFAULT FALSE,
    error_detalle        VARCHAR(400),
    latencia_ms          INT,
    modelo_llm           VARCHAR(60),
    creado_en            TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT uq_sesiones_voz_uuid UNIQUE (uuid),
    CONSTRAINT ck_sesiones_intencion CHECK (intencion IS NULL OR intencion IN
        ('CREAR_PEDIDO','CONSULTAR_MENU','MODIFICAR_PEDIDO','CONFIRMAR','CANCELAR','SALUDO','OTRO'))
);
CREATE INDEX ix_sesiones_voz_cliente ON sesiones_voz (cliente_id);
CREATE INDEX ix_sesiones_voz_creado  ON sesiones_voz (creado_en);

-- Turnos de la conversacion (multi-turno)
CREATE TABLE sesion_voz_turnos (
    id            BIGSERIAL PRIMARY KEY,
    sesion_voz_id BIGINT      NOT NULL REFERENCES sesiones_voz (id) ON DELETE CASCADE,
    rol           VARCHAR(10) NOT NULL,
    contenido     TEXT        NOT NULL,
    orden         INT         NOT NULL DEFAULT 0,
    creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_turno_rol CHECK (rol IN ('USUARIO','ASISTENTE','SISTEMA'))
);
CREATE INDEX ix_turnos_sesion ON sesion_voz_turnos (sesion_voz_id);

-- Cerramos la FK diferida de pedidos -> sesiones_voz
ALTER TABLE pedidos
    ADD CONSTRAINT fk_pedidos_sesion_voz
    FOREIGN KEY (sesion_voz_id) REFERENCES sesiones_voz (id) ON DELETE SET NULL;
