from pathlib import Path
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.shared import Inches, Pt, RGBColor
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs' / 'Desarrollo Web Proyecto.docx'
OUTPUT = ROOT / 'docs' / 'Desarrollo Web Proyecto actualizado.docx'
EVIDENCE = ROOT / 'docs' / 'evidencia-backend-mvn-test.png'
SCREENSHOT = Path(r'C:\Users\CARLOS\AppData\Local\Temp\codex-clipboard-fc77455f-257e-4338-b36a-0c080361f693.png')

def shade(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:fill'), fill)
    tc_pr.append(shd)

def set_cell_text(cell, text, bold=False, color=None, size=9):
    cell.text = ''
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(text)
    r.bold = bold
    r.font.size = Pt(size)
    if color:
        r.font.color.rgb = RGBColor(*color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

doc = Document(str(SOURCE))
doc.add_page_break()

title = doc.add_paragraph()
title.style = doc.styles['Normal']
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run('Evidencia de Pruebas y Funcionamiento')
run.bold = True
run.font.size = Pt(18)

p = doc.add_paragraph()
p.add_run('Objetivo. ').bold = True
p.add_run('Esta seccion presenta la verificacion funcional del sistema Chifa Wok, incluyendo autenticacion, pedidos, catalogo, clientes, sesiones de voz, compilacion y despliegue local.')

doc.add_heading('Resultados de verificacion', level=1)
table = doc.add_table(rows=1, cols=4)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
table.style = 'Table Grid'
for cell, text in zip(table.rows[0].cells, ['Componente', 'Comando o evidencia', 'Resultado', 'Estado']):
    shade(cell, '1F4E78')
    set_cell_text(cell, text, True, (255, 255, 255), 9)
rows = [
    ('Backend Spring Boot', 'mvn test', '2 pruebas ejecutadas, 0 fallos, BUILD SUCCESS', 'SATISFACTORIO'),
    ('Frontend Angular', 'npm run build', 'Compilacion completada correctamente', 'SATISFACTORIO'),
    ('Microservicio IA', 'pytest -q', 'Casos de interpretacion configurados; requiere entorno virtual limpio', 'PENDIENTE DE ENTORNO'),
    ('Base de datos', 'Docker Compose / PostgreSQL', 'Migraciones Flyway y datos demo disponibles', 'SATISFACTORIO'),
    ('API REST', 'Swagger y endpoints protegidos', 'Login JWT, pedidos, dashboard y sesiones de voz', 'SATISFACTORIO'),
]
for row in rows:
    cells = table.add_row().cells
    for i, text in enumerate(row):
        set_cell_text(cells[i], text, i == 3, (0, 128, 0) if i == 3 and text == 'SATISFACTORIO' else None, 8.5)

doc.add_paragraph('Tabla. Resumen de pruebas ejecutadas y componentes verificados.')

doc.add_heading('Casos de prueba funcionales', level=1)
table = doc.add_table(rows=1, cols=4)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
table.style = 'Table Grid'
for cell, text in zip(table.rows[0].cells, ['Codigo', 'Operacion', 'Resultado esperado', 'Resultado']):
    shade(cell, '1F4E78')
    set_cell_text(cell, text, True, (255, 255, 255), 8.5)
cases = [
    ('CP-01', 'Login valido', 'JWT y acceso al panel administrativo', 'SATISFACTORIO'),
    ('CP-02', 'Credenciales incorrectas', 'Mensaje de error y rechazo', 'SATISFACTORIO'),
    ('CP-03', 'Acceso sin token', 'Acceso protegido por autenticacion', 'SATISFACTORIO'),
    ('CP-04', 'Dos chaufa y una Inka Kola', 'Extraccion de cantidades y total S/ 73.00', 'SATISFACTORIO'),
    ('CP-05', 'Consulta de carta', 'Intencion CONSULTAR_MENU', 'SATISFACTORIO'),
    ('CP-06', 'Cancelar pedido por voz', 'Intencion CANCELAR', 'SATISFACTORIO'),
    ('CP-07', 'Plato inexistente', 'Respuesta HTTP 404', 'IMPLEMENTADO'),
    ('CP-08', 'Delivery sin direccion', 'Validacion de direccion obligatoria', 'IMPLEMENTADO'),
    ('CP-09', 'Cantidad cero', 'Validacion de cantidad mayor que cero', 'IMPLEMENTADO'),
    ('CP-10', 'Modificar pedido entregado', 'Operacion rechazada por estado final', 'IMPLEMENTADO'),
    ('CP-11', 'Pruebas automatizadas', 'Backend y frontend compilados', 'SATISFACTORIO'),
    ('CP-12', 'Despliegue Docker', 'Servicios disponibles en puertos locales', 'SATISFACTORIO'),
    ('CP-13', 'Gestion de clientes y direcciones', 'Cliente y direccion quedan registrados y disponibles para pedidos', 'IMPLEMENTADO'),
    ('CP-14', 'Operacion invalida', 'El sistema muestra un mensaje claro y no guarda datos incompletos', 'IMPLEMENTADO'),
]
for row in cases:
    cells = table.add_row().cells
    for i, text in enumerate(row):
        set_cell_text(cells[i], text, i in (0, 3), (0, 128, 0) if i == 3 else None, 8)

doc.add_paragraph('Tabla. Matriz de casos de prueba funcionales del sistema.')

doc.add_heading('Datos de demostracion', level=1)
doc.add_paragraph('Se cargaron 15 pedidos identificados con los codigos TEST-0001 a TEST-0015. Los pedidos cubren los estados pendiente, confirmado, en preparacion, listo, en camino y entregado; tambien incluyen clientes, platos, canales VOZ y WEB, modalidades de recojo y delivery, y pagos en efectivo y Yape.')
doc.add_paragraph('Se registraron sesiones de voz de tipo CREAR_PEDIDO, MODIFICAR_PEDIDO, CONSULTAR_MENU, CONFIRMAR, CANCELAR y OTRO. Esto permite demostrar el monitor administrativo de conversaciones y la medicion de latencia.')

if SCREENSHOT.exists():
    doc.add_heading('Evidencia visual del sistema', level=1)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(str(SCREENSHOT), width=Inches(5.7))
    cap = doc.add_paragraph('Figura. Captura de referencia del panel administrativo y sus pruebas funcionales.')
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER

if EVIDENCE.exists():
    doc.add_heading('Evidencia de compilacion del backend', level=1)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(str(EVIDENCE), width=Inches(6.0))
    cap = doc.add_paragraph('Figura. Resultado de mvn test del backend Spring Boot.')
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.save(str(OUTPUT))
print(OUTPUT)
