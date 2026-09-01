"""Cadena LangChain que interpreta la transcripcion y devuelve un InterpretResponse."""
from __future__ import annotations
import json

from app.chains.prompts import SYSTEM_PROMPT, USER_PROMPT
from app.core.llm import build_llm, nombre_modelo
from app.schemas.voice import InterpretRequest, InterpretResponse, Intencion
from app.services.rule_extractor import extraer_por_reglas
from app.services.confirmation import construir_confirmacion


def _menu_texto(req: InterpretRequest) -> str:
    return "\n".join(
        f"- {m.codigo} | {m.nombre} | S/ {m.precio:.2f}"
        + (f" | {m.categoria}" if m.categoria else "")
        for m in req.menu
    ) or "(sin carta cargada)"


def interpretar(req: InterpretRequest) -> InterpretResponse:
    llm = build_llm()

    if llm is None:
        # ---- modo fake: extraccion por reglas sobre la carta ----
        intencion, items = extraer_por_reglas(req.texto, req.menu)
        respuesta = construir_confirmacion(intencion, items, req.menu)
        return InterpretResponse(
            intencion=intencion,
            confianza=0.55 if items else 0.4,
            items=items,
            respuesta_asistente=respuesta,
            requiere_confirmacion=intencion == Intencion.CREAR_PEDIDO,
            modelo_llm=nombre_modelo(),
        )

    # ---- modo LLM ----
    from langchain_core.messages import SystemMessage, HumanMessage

    messages = [
        SystemMessage(content=SYSTEM_PROMPT.format(menu=_menu_texto(req))),
        HumanMessage(content=USER_PROMPT.format(texto=req.texto)),
    ]
    raw = llm.invoke(messages).content
    data = _parse_json(raw)

    return InterpretResponse.model_validate(
        {**data, "modeloLlm": nombre_modelo()}
    )


def _parse_json(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1].removeprefix("json").strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {
            "intencion": "OTRO",
            "confianza": 0.0,
            "items": [],
            "respuestaAsistente": "Disculpa, no te entendi bien. Puedes repetir tu pedido?",
            "requiereConfirmacion": False,
        }
