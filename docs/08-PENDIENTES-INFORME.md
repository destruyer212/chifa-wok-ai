# 08 · Pendientes del informe — plantillas para completar el Word

Todo lo de abajo **falta redactar** en `Desarrollo Web Proyecto.docx`. Aquí van
borradores coherentes con el sistema ya construido, listos para pegar y ajustar.

## Cap. II — Formulación del problema

**Problema general**
> ¿De qué manera un sistema web con un asistente conversacional de Inteligencia
> Artificial mejora la gestión de pedidos del restaurante Chifa Wok, reduciendo la
> saturación de sus canales telefónicos y la fricción del proceso de compra?

**Problemas específicos**
1. ¿Cómo permitir que el cliente registre su pedido por voz, en lenguaje natural, sin
   formularios ni llamadas telefónicas?
2. ¿Cómo interpretar la intención y extraer los platos y cantidades de una frase hablada
   con precisión, usando únicamente la carta vigente?
3. ¿Cómo garantizar la integridad de los datos del pedido (precios, disponibilidad,
   totales) cuando el origen es una transcripción de voz?
4. ¿Cómo dar seguimiento administrativo a los pedidos y medir la efectividad del
   asistente (tasa de conversión, latencia)?
5. ¿Cómo restringir el acceso al panel administrativo a personal autorizado?

## Cap. II — Objetivos

**General**
> Desarrollar un sistema web con asistente conversacional de IA que automatice la toma de
> pedidos del Chifa Wok mediante comandos de voz, integrando un frontend Angular, una API
> REST en Spring Boot y un microservicio de procesamiento de lenguaje en Python.

**Específicos**
1. Implementar la captura y síntesis de voz en el navegador con la Web Speech API.
2. Construir el microservicio de IA (FastAPI + LangChain) que interprete la transcripción
   y devuelva un borrador de pedido estructurado.
3. Implementar en el backend la validación de negocio (carta, precios, totales, estados).
4. Desarrollar el panel administrativo con dashboard de métricas y gestión de pedidos.
5. Incorporar autenticación con Spring Security + JWT y hash de contraseñas con BCrypt.
6. Modelar y versionar la base de datos PostgreSQL con Flyway.

## Cap. III — Requerimientos funcionales

| Código | Requerimiento funcional |
|--------|--------------------------|
| RF-01 | El sistema debe permitir el inicio y cierre de sesión de usuarios administradores mediante JWT. |
| RF-02 | El cliente debe poder dictar su pedido por voz desde un widget en la web del restaurante. |
| RF-03 | El sistema debe transcribir la voz a texto en el navegador (Speech-to-Text). |
| RF-04 | El sistema debe interpretar la intención del cliente (crear/modificar/confirmar/cancelar pedido, consultar carta). |
| RF-05 | El sistema debe extraer los platos y cantidades del pedido usando exclusivamente la carta vigente. |
| RF-06 | El sistema debe responder al cliente con una confirmación hablada (Text-to-Speech). |
| RF-07 | El sistema debe calcular el subtotal y total del pedido con los precios reales del catálogo. |
| RF-08 | El sistema debe registrar cada pedido con su canal (VOZ/WEB/TELÉFONO) y estado. |
| RF-09 | El sistema debe permitir al administrador cambiar el estado de un pedido siguiendo un flujo válido. |
| RF-10 | El sistema debe registrar cada sesión de voz (transcripción, respuesta, intención, latencia). |
| RF-11 | El sistema debe mostrar un dashboard con pedidos del día, ventas, platos más vendidos y tasa de conversión del asistente. |
| RF-12 | El sistema debe administrar el catálogo (categorías, platos, presentaciones, disponibilidad). |
| RF-13 | El sistema debe administrar clientes y sus direcciones de entrega. |
| RF-14 | El sistema debe mostrar mensajes claros cuando una operación no pueda completarse. |

## Cap. III — Requerimientos no funcionales

| Código | Requerimiento no funcional |
|--------|-----------------------------|
| RNF-01 | El acceso a los módulos administrativos requiere una sesión autenticada (JWT). |
| RNF-02 | Las contraseñas se almacenan con hashing BCrypt, nunca en texto plano. |
| RNF-03 | Las validaciones de negocio se ejecutan en el servidor (backend), no solo en el cliente. |
| RNF-04 | La captura y síntesis de voz no debe generar costos de telefonía (Web Speech API nativa). |
| RNF-05 | El microservicio de IA es *stateless* y el proveedor de LLM es intercambiable por configuración. |
| RNF-06 | El esquema de base de datos se versiona con Flyway y es reproducible en cualquier entorno. |
| RNF-07 | La arquitectura se organiza en microservicios desplegables de forma independiente. |
| RNF-08 | La latencia de respuesta del asistente debe registrarse y monitorearse (`sesiones_voz.latencia_ms`). |
| RNF-09 | El sistema debe poder desplegarse con Docker / docker-compose. |
| RNF-10 | La API expone documentación OpenAPI/Swagger. |

## Cap. III — Modelo entidad-relación

Usar el diagrama de [`db/er/modelo-er.md`](../db/er/modelo-er.md). Entidades:
`usuarios`, `clientes`, `direcciones_cliente`, `categorias`, `platos`,
`plato_presentaciones`, `pedidos`, `pedido_items`, `sesiones_voz`.
Relaciones núcleo: `clientes 1─N pedidos`, `pedidos 1─N pedido_items`,
`platos 1─N pedido_items`, `sesiones_voz 1─0..1 pedidos`, `categorias 1─N platos`.

## Cap. III — Casos de prueba

| Código | Prueba | Resultado esperado |
|--------|--------|--------------------|
| CP-01 | Login con credenciales válidas | Devuelve JWT y accede al dashboard |
| CP-02 | Login con credenciales incorrectas | HTTP 401, mensaje de error |
| CP-03 | Acceso a `/api/dashboard/resumen` sin token | HTTP 403 |
| CP-04 | Dictar "dos chaufa especial y una Inka Kola" | Detecta CHF-001 ×2 y BEB-001 ×1, total S/ 73.00 |
| CP-05 | Dictar "¿qué tienen en la carta?" | Intención CONSULTAR_MENU, sin ítems |
| CP-06 | Dictar "mejor cancela todo" | Intención CANCELAR |
| CP-07 | Crear pedido con plato inexistente | HTTP 404 |
| CP-08 | Crear pedido DELIVERY sin dirección | HTTP 422 "requiere una direccion de entrega" |
| CP-09 | Crear pedido con cantidad 0 | HTTP 400 (validación) |
| CP-10 | Cambiar estado de pedido ENTREGADO | HTTP 422 "ya esta finalizado" |
| CP-11 | `mvn test` (backend) y `pytest` (ai-service) | Todas las pruebas en verde |
| CP-12 | `docker compose up` | Los 4 servicios levantan y responden a `/health` |
