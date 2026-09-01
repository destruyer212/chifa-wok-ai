"""Construye el texto que el navegador leera en voz alta (Text-to-Speech)."""
from __future__ import annotations

from app.schemas.voice import Intencion, ItemBorrador, MenuItem

_PRECIOS: dict[str, float] = {}


def construir_confirmacion(intencion: Intencion, items: list[ItemBorrador],
                           menu: list[MenuItem]) -> str:
    precios = {m.codigo: m.precio for m in menu}
    nombres = {m.codigo: m.nombre for m in menu}

    if intencion == Intencion.SALUDO:
        return "Hola, bienvenido al Chifa Wok. Dime que te gustaria pedir."
    if intencion == Intencion.CONSULTAR_MENU:
        destacados = ", ".join(m.nombre for m in menu[:4])
        return f"Tenemos {destacados}, entre otros. Que deseas ordenar?"
    if intencion == Intencion.CANCELAR:
        return "Listo, cancele tu pedido. Quieres empezar de nuevo?"
    if intencion == Intencion.CONFIRMAR:
        return "Perfecto, tu pedido queda confirmado. Gracias por preferir al Chifa Wok."
    if intencion == Intencion.CREAR_PEDIDO and items:
        partes, total = [], 0.0
        for it in items:
            p = precios.get(it.codigo_plato, 0.0) * it.cantidad
            total += p
            partes.append(f"{it.cantidad} {nombres.get(it.codigo_plato, it.nombre_plato)}")
        detalle = ", ".join(partes)
        return (f"Anote {detalle}. El total es {total:.2f} soles. "
                f"Confirmas el pedido?")
    return "Disculpa, no logre identificar tu pedido. Puedes decirmelo de nuevo?"
