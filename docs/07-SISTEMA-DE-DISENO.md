# 07 · Sistema de diseño — "Andean Dragon" (Material Design 3)

Definido en [`frontend/tailwind.config.js`](../frontend/tailwind.config.js) y cargado por
[`frontend/src/styles.css`](../frontend/src/styles.css).

## Paleta

| Rol | Hex | Uso |
|-----|-----|-----|
| **primary** | `#af101a` | Marca, botones principales, totales |
| primary-container | `#d32f2f` | Fondos de acento, badges |
| on-primary | `#ffffff` | Texto sobre primary |
| primary-fixed / primary-fixed-dim | `#ffdad6` / `#ffb3ac` | Burbujas del asistente |
| **secondary** | `#795900` | Dorado chifa (texto) |
| secondary-container | `#fec330` | Etiquetas "Popular", chips de estado |
| **tertiary** | `#0058a2` | Azul del asistente de voz |
| tertiary-container | `#0770cc` | Botón/FAB del micrófono |
| **background / surface** | `#fcf9f8` | Fondo general |
| on-background / on-surface | `#1b1c1c` | Texto principal |
| surface-container-* | `#f6f3f2` … `#e5e2e1` | Tarjetas, barras, elevaciones |
| outline / outline-variant | `#8f6f6c` / `#e4beba` | Bordes |
| error / error-container | `#ba1a1a` / `#ffdad6` | Validaciones, estado escuchando |

## Tipografía

| Familia | Uso | Clases Tailwind |
|---------|-----|-----------------|
| **Montserrat** (600/700) | Titulares | `font-display-lg` `font-headline-lg` `font-headline-md` |
| **Inter** (400/500/600) | Cuerpo y etiquetas | `font-body-lg` `font-body-md` `font-label-md` `font-label-sm` |

Escala: `display-lg` 48/56 · `headline-lg` 32/40 · `headline-md` 24/32 ·
`body-lg` 18/28 · `body-md` 16/24 · `label-md` 14/20 · `label-sm` 12/16.

## Espaciado (tokens)

`xs 4` · `sm 12` · `base 8` · `md 24` · `gutter 24` · `lg 48` · `xl 80` ·
`margin-mobile 16` · `margin-desktop 40`

## Radios

`DEFAULT 4px` · `lg 8px` · `xl 12px` · `full 9999px`

## Iconografía

**Material Symbols Outlined** (Google Fonts, importado en `styles.css`).
Uso: `<span class="material-symbols-outlined">mic</span>`.

## Utilidades propias

- `.glass-effect` — panel translúcido con `backdrop-filter: blur(12px)`.
- `.pulse-animation` — halo pulsante (FAB del micrófono, estado "escuchando").

## Modo oscuro

`darkMode: "class"` — añadir la clase `dark` en `<html>` activa las variantes `dark:` ya
presentes en la landing. Falta definir el mapa de tokens oscuros (pendiente).
