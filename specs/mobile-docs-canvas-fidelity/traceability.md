---
feature: "mobile-docs-canvas-fidelity"
status: approved
tags: [mobile, ui, spec]
---

# #175 mobile-docs-canvas-fidelity — Trazabilidad

| R | Requisito | Test (fichero › describe) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | Tokens del artboard en `@theme` | `src/theme/__tests__/global-css.test.ts` › `#175 R1: tokens de Documentos` | `68e595da` — `test(theme): tokens del artboard de Documentos (#175 R1)` | `6d6078a3` — `feat(theme): tokens del artboard de Documentos (#175 R1)` | hecho |
| R2 | Enmienda de fidelidad al canvas en la carta | `src/__tests__/design-drift.test.ts` › `#175 R2: enmienda de fidelidad al canvas` | `38660a0b` — `test(docs-charter): enmienda de fidelidad al canvas (#175 R2)` | `b443e578` — `docs(ui-guidelines): enmienda de fidelidad al canvas (#175 R2)` | hecho |
| R3 | Copy nuevo de Documentos | `src/providers/__tests__/language-provider.test.tsx` › `#175 R3: claves de Documentos del canvas` | `e02c9421` — `test(i18n): claves de Documentos del canvas (#175 R3)` | `3a1851e7` — `feat(i18n): claves de Documentos del canvas (#175 R3)` | hecho |
| R4 | Marco y esqueleto de la lista | `src/screens/docs/index.test.tsx` › `#175 R4: esqueleto del tamaño de la fila` + `#95 R6` (Δ4) | `d49bf51a` — `test(docs): marco y esqueleto del artboard (#175 R4)` | `82cb980d` — `feat(docs): marco y esqueleto del artboard (#175 R4)` | hecho |
| R5 | Cabecera en contenido | `src/screens/docs/index.test.tsx` › `#175 R5: cabecera del artboard`; `profile-canvas-fidelity` › `#173 R2.4` (Δ18, E2.1) | `0e71b8a4` — `test(docs): cabecera del artboard (#175 R5)`<br>`4963cea6` — `test(profile): inventario de text-26 con Documentos (#175 R5)` | `a2f2ee27` — `feat(docs): cabecera del artboard (#175 R5)` | hecho |
| R6 | Fila de documento | `src/screens/docs/index.test.tsx` › `#175 R6: fila del artboard` + Δ1–Δ3, Δ10 | `681ce277` — `test(docs): fila del artboard (#175 R6)` | `2dd9e208` — `test(docs): dobles de entrada, iconos y colores (#175 R6)` (dobles, nace verde)<br>`15470665` — `feat(docs): fila del artboard (#175 R6)` | hecho |
| R7 | Zona de subida y orden de bloques | `src/screens/docs/index.test.tsx` › `#175 R7: zona de subida del artboard` + Δ5–Δ9; `consistency-classnames` Δ11–Δ13; `ui-language` Δ15 | `e23e66aa` — `test(docs): zona de subida y orden del artboard (#175 R7)` | `8e75f554` — `feat(docs): zona de subida y orden del artboard (#175 R7)` | hecho |
| R8 | Chips de filtro: composición | `src/screens/docs/index.test.tsx` › `#175 R8: chips de filtro`; `ui-language` Δ15; `profile-canvas-fidelity` › `#173 R2.4` (Δ19, E2.2) | `c40f0b9b` — `test(docs): chips de filtro (#175 R8)` | `a5a8cfa0` — `feat(docs): chips de filtro (#175 R8)` | hecho |
| R9 | Chips de filtro: comportamiento | `src/screens/docs/index.test.tsx` › `#175 R9: filtrar por categoría` | `90295de8` — `test(docs): filtrar por categoría (#175 R9)` | `88bdf16f` — `feat(docs): filtrar por categoría (#175 R9)` | hecho |
| R10 | Candados de deriva e imports | `src/__tests__/design-drift.test.ts` › `#175 R10: Documentos sin deriva` + sondas S1–S5 | n/a (nace verde; rojo demostrado con S1–S5) | `12ca9dbe` — `test(design-drift): Documentos sin deriva (#175 R10)` | hecho |
| R11 | Prueba de humo humana (dev build de Android) | §Prueba de humo R11 | n/a | n/a | superada (firma del humano) |

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

- [X] Prueba de humo R11 superada por humano (fecha: 2026-10-11)
