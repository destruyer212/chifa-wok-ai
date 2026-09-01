from app.chains.interpreter import interpretar
from app.schemas.voice import InterpretRequest, Intencion, MenuItem

MENU = [
    MenuItem(codigo="CHF-001", nombre="Arroz Chaufa Especial", precio=32.0, categoria="Chaufas"),
    MenuItem(codigo="CMB-001", nombre="Aeropuerto Familiar", precio=55.0, categoria="Combinados"),
    MenuItem(codigo="BEB-001", nombre="Inka Kola 1.5 L", precio=9.0, categoria="Bebidas"),
]


def _req(texto: str) -> InterpretRequest:
    return InterpretRequest(texto=texto, menu=MENU)


def test_crear_pedido_detecta_plato_y_cantidad():
    r = interpretar(_req("Quiero dos arroz chaufa especial y una Inka Kola"))
    assert r.intencion == Intencion.CREAR_PEDIDO
    codigos = {i.codigo_plato: i.cantidad for i in r.items}
    assert codigos.get("CHF-001") == 2
    assert codigos.get("BEB-001") == 1
    assert "confirm" in r.respuesta_asistente.lower()


def test_consulta_menu():
    r = interpretar(_req("Que tienen en la carta?"))
    assert r.intencion == Intencion.CONSULTAR_MENU


def test_saludo():
    r = interpretar(_req("Hola buenas tardes"))
    assert r.intencion == Intencion.SALUDO


def test_cancelar():
    r = interpretar(_req("Mejor cancela todo"))
    assert r.intencion == Intencion.CANCELAR
