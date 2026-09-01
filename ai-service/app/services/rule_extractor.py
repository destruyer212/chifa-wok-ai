"""Extractor por reglas (modo fake / respaldo sin LLM).

Hace coincidencia difusa del texto del cliente contra los nombres de la carta y
detecta cantidades escritas con numeros o palabras.
"""
from __future__ import annotations
import re
import unicodedata

from app.schemas.voice import Intencion, ItemBorrador, MenuItem

_NUM_PALABRA = {
    "un": 1, "una": 1, "uno": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5,
    "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10, "media": 1,
}

_SALUDOS = ("hola", "buenas", "buenos dias", "buenas tardes", "buenas noches")
_CANCELA = ("cancela", "cancelar", "anula", "olvida", "ya no")
_CONFIRMA = ("confirmo", "confirmar", "si esta bien", "correcto", "asi es", "dale", "listo")
_MENU_Q = ("que tienen", "carta", "menu", "que hay", "opciones", "recomiendas")


def _norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9 ]", " ", s)


def _cantidad_antes(texto_norm: str, pos: int) -> int:
    prefijo = texto_norm[:pos].strip().split()
    if not prefijo:
        return 1
    ult = prefijo[-1]
    if ult.isdigit():
        return int(ult)
    return _NUM_PALABRA.get(ult, 1)


def extraer_por_reglas(texto: str, menu: list[MenuItem]) -> tuple[Intencion, list[ItemBorrador]]:
    t = _norm(texto)

    if any(k in t for k in _CANCELA):
        return Intencion.CANCELAR, []
    if any(k in t for k in _CONFIRMA):
        return Intencion.CONFIRMAR, []
    if any(k in t for k in _MENU_Q):
        return Intencion.CONSULTAR_MENU, []

    items: list[ItemBorrador] = []
    for m in menu:
        nombre_norm = _norm(m.nombre)
        # palabras significativas del nombre del plato (>3 letras)
        claves = [w for w in nombre_norm.split() if len(w) > 3]
        idx = -1
        if nombre_norm in t:
            idx = t.index(nombre_norm)
        elif claves and all(c in t for c in claves):
            idx = min(t.index(c) for c in claves)
        if idx >= 0:
            items.append(ItemBorrador(
                codigo_plato=m.codigo, nombre_plato=m.nombre,
                cantidad=_cantidad_antes(t, idx),
            ))

    if items:
        return Intencion.CREAR_PEDIDO, items
    if any(k in t for k in _SALUDOS):
        return Intencion.SALUDO, []
    return Intencion.OTRO, []
