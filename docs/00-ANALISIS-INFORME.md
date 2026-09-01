# 00 · Análisis del informe (`Desarrollo Web Proyecto.docx`)

## Identificación

| Campo | Valor |
|-------|-------|
| Título | Sistema web de gestión de pedidos con asistente conversacional de IA para el Chifa Wok |
| Nombre interno del producto | *Voice AI Business Assistant* (plataforma SaaS) |
| Casa de estudios | UTP — Facultad de Ingeniería, E.P. de Ingeniería de Sistemas e Informática |
| Ciudad / año | Lima – Perú, 2026 |
| Asesor | Ing. Anselmo Aniceto Valenzuela Zegarra |

### Equipo (5 integrantes)

| Integrante | Rol en el proyecto |
|-----------|--------------------|
| Luis Anibal Sarmiento Zapata | Dirección de Proyecto |
| Casey Araceli Rojas Surco | Estrategia y Arquitectura de Software (Angular + Spring Boot) |
| Elmer Junior Zuluaga Isuiza | Análisis Organizacional y Requerimientos |
| Gabriel Dario Rodriguez Pizarro | Operaciones e Integración (motor de IA en Python) |
| Carlos Jesús Ascarate Riega | Infraestructura y Base de Datos (PostgreSQL, despliegue) |

## El negocio

Chifa Wok: cadena emergente de comida fusión peruano-china en Lima (opera desde 2023).
Crecimiento acelerado → **líneas telefónicas colapsadas** en hora pico y **alta tasa de
abandono de carrito** en su web estática. La gerencia contrató al equipo para construir un
asistente de voz embebido en su web que automatice la toma de pedidos.

## Qué está completo en el Word

| Sección | Estado |
|---------|--------|
| Portada, autores, asesor | ✅ |
| Introducción (problema + solución + arquitectura) | ✅ Completo |
| Cap. I — Visión, Misión, Reseña histórica | ✅ |
| Cap. I — Organigrama, Ámbito, Recursos Humanos | ✅ |
| Cap. I — **Software** (stack) y **Hardware** (infra) | ✅ Detallado en prosa |
| Cap. I — Cronograma (18 semanas, 10 etapas) | ✅ Tabla completa |
| Cap. I — Descripción de funciones y procesos del negocio | ✅ 4 procesos descritos |
| Cap. II — Análisis situacional, Problema, Objetivos | ❌ **Solo el título** |
| Cap. II — Fundamentación teórica | ❌ **Solo subtítulos** (y desactualizados, ver abajo) |
| RF / RNF | ❌ No existen |
| Modelo entidad-relación | ❌ No existe |
| Casos de prueba | ❌ No existen |
| Cap. III / IV / V / VI, Referencias, Anexos | ❌ No existen |

## Los 4 procesos del negocio (según el Word)

1. **Interacción inicial y captura de voz** — el cliente ve un widget en la web,
   presiona *"Hablar con el Asistente"* y dicta su pedido. El navegador (Web Speech API)
   transcribe a texto y lo envía al backend.
2. **Procesamiento y toma de decisiones** — el texto va al microservicio de IA, que
   interpreta la intención, estructura el pedido (cantidades, productos, horarios) y
   ejecuta validaciones de negocio; devuelve una respuesta escrita.
3. **Confirmación auditiva** — la respuesta vuelve al navegador, que la lee en voz alta
   (Text-to-Speech). Cierra el ciclo como si fuera un dependiente humano.
4. **Gestión y monitoreo administrativo** — todo queda en el panel: pedidos en curso,
   historial de clientes, métricas de conversión y transcripciones de las sesiones de voz.

## ⚠️ Contradicción a corregir en el Word

Los **subtítulos** de *"Fundamentación Teórica"* siguen nombrando el stack de la plantilla
anterior (un sistema Java-web monolítico de veterinaria):

> ~~Java, Jakarta Servlet y Apache Tomcat~~ · ~~JSP, JSTL y Expression Language~~ ·
> ~~JSF, CDI y Managed Beans~~ · ~~JDBC, MySQL y patrones DAO/DTO~~

Pero la Introducción y la sección Software describen una **arquitectura de microservicios
moderna**. Los subtítulos deberían reescribirse así:

| Subtítulo actual (incorrecto) | Debe decir |
|-------------------------------|------------|
| Java, Jakarta Servlet y Apache Tomcat | **Java, Spring Boot y API REST** |
| JSP, JSTL y Expression Language | **Angular y componentes standalone** |
| JSF, CDI y Managed Beans | **Web Speech API (Speech-to-Text / Text-to-Speech)** |
| JDBC, MySQL y patrones DAO/DTO | **Spring Data JPA, Hibernate y PostgreSQL** |
| Capa Service y validaciones de negocio | *(se mantiene)* |
| Sesiones, filtros y BCrypt | **Spring Security, filtros JWT y BCrypt** |
| Maven, Git y GitHub | *(se mantiene)* — añadir **Python, FastAPI y LangChain** y **Docker** |

> Nota: **BCrypt sí se mantiene** — es el algoritmo de hash de las contraseñas de los
> usuarios del panel administrativo (`usuarios.password_hash`).

Ver plantillas para redactar lo que falta en [08-PENDIENTES-INFORME.md](08-PENDIENTES-INFORME.md).
