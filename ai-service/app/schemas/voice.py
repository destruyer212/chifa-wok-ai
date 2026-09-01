from __future__ import annotations
from enum import Enum
from pydantic import BaseModel, Field


class Intencion(str, Enum):
    CREAR_PEDIDO = "CREAR_PEDIDO"
    CONSULTAR_MENU = "CONSULTAR_MENU"
    MODIFICAR_PEDIDO = "MODIFICAR_PEDIDO"
    CONFIRMAR = "CONFIRMAR"
    CANCELAR = "CANCELAR"
    SALUDO = "SALUDO"
    OTRO = "OTRO"


class MenuItem(BaseModel):
    codigo: str
    nombre: str
    precio: float
    categoria: str | None = None


class InterpretRequest(BaseModel):
    texto: str = Field(..., description="Transcripcion del Speech-to-Text del navegador")
    sesion_uuid: str | None = Field(None, alias="sesionUuid")
    menu: list[MenuItem] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class ItemBorrador(BaseModel):
    codigo_plato: str = Field(..., alias="codigoPlato")
    nombre_plato: str = Field(..., alias="nombrePlato")
    cantidad: int = 1
    presentacion: str | None = None
    notas: str | None = None

    model_config = {"populate_by_name": True}


class InterpretResponse(BaseModel):
    intencion: Intencion
    confianza: float = 0.0
    items: list[ItemBorrador] = Field(default_factory=list)
    tipo_entrega: str | None = Field(None, alias="tipoEntrega")
    respuesta_asistente: str = Field(..., alias="respuestaAsistente")
    requiere_confirmacion: bool = Field(True, alias="requiereConfirmacion")
    modelo_llm: str = Field("fake", alias="modeloLlm")

    model_config = {"populate_by_name": True}
