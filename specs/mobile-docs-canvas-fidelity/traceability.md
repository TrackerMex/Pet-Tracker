---
feature: "mobile-docs-canvas-fidelity"
status: draft
tags: [mobile, ui, spec]
---

# #175 mobile-docs-canvas-fidelity — Trazabilidad

| R | Requisito | Test (fichero › describe) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | Tokens del artboard en `@theme` | `src/theme/__tests__/global-css.test.ts` › `#175 R1: tokens de Documentos` | — | — | pendiente |
| R2 | Enmienda de fidelidad al canvas en la carta | `src/__tests__/design-drift.test.ts` › `#175 R2: enmienda de fidelidad al canvas` | — | — | pendiente |
| R3 | Copy nuevo de Documentos | `src/providers/__tests__/language-provider.test.tsx` › `#175 R3: claves de Documentos del canvas` | — | — | pendiente |
| R4 | Marco y esqueleto de la lista | `src/screens/docs/index.test.tsx` › `#175 R4: esqueleto del tamaño de la fila` + `#95 R6` (Δ4) | — | — | pendiente |
| R5 | Cabecera en contenido | `src/screens/docs/index.test.tsx` › `#175 R5: cabecera del artboard` | — | — | pendiente |
| R6 | Fila de documento | `src/screens/docs/index.test.tsx` › `#175 R6: fila del artboard` + Δ1–Δ3, Δ10 | — | — | pendiente |
| R7 | Zona de subida y orden de bloques | `src/screens/docs/index.test.tsx` › `#175 R7: zona de subida del artboard` + Δ5–Δ9; `consistency-classnames` Δ11–Δ13; `ui-language` Δ15 | — | — | pendiente |
| R8 | Chips de filtro: composición | `src/screens/docs/index.test.tsx` › `#175 R8: chips de filtro`; `ui-language` Δ15 | — | — | pendiente |
| R9 | Chips de filtro: comportamiento | `src/screens/docs/index.test.tsx` › `#175 R9: filtrar por categoría` | — | — | pendiente |
| R10 | Candados de deriva e imports | `src/__tests__/design-drift.test.ts` › `#175 R10: Documentos sin deriva` + sondas S1–S5 | — | — | pendiente |
| R11 | Prueba de humo humana (dev build de Android) | §Prueba de humo R11 | n/a | n/a | pendiente |

## Firma de la enmienda R2

La casilla vive en `docs/ui-guidelines.md`, al final de
`## Enmienda de fidelidad al canvas (2026-10-13)`:
`- [ ] Enmienda de fidelidad al canvas aprobada por humano (fecha: ____)`.
El test de R2 la acepta vacía o firmada (`[ xX]`).

## Prueba de humo R11

Se hace en el **dev build de Android**, en claro y en oscuro, con una mascota
propia que tenga documentos de al menos tres categorías. Es la lista de R11
en `requirements.md`.

| Punto | Resultado |
|---|---|
| Margen 20, gap 14, eyebrow con tracking, título 26/900 | |
| Chips de 34 px; «Todos» invertido; pastel por categoría | |
| Fila: mosaico 48×56 con icono, nombre con elipsis, fecha «d mmm aaaa», chevron | |
| Zona de subida discontinua de radio 24, al final | |
| Filtrar por un chip deja solo sus filas; «Todos» las devuelve | |
| Tocar la zona abre el selector; el formulario aparece bajo la lista | |
| «Reducir movimiento»: las filas entran sin desplazamiento | |

- [ ] Prueba de humo R11 superada por humano (fecha: ____)
