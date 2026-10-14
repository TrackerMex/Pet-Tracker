---
feature: "mobile-meal-schedule-canvas-fidelity"
status: draft
tags: [mobile, ui, spec]
---

# #179 mobile-meal-schedule-canvas-fidelity — Trazabilidad

> Base congelada `fb5b209f`. Commits rojo y verde los rellena quien
> implementa, con hashes de su branch (no rebasear después: invalida los
> hashes).

| R | Requisito | Test (fichero › describe) | Commit rojo | Commit verde | Estado |
|---|---|---|---|---|---|
| R1 | Tokens del artboard en `@theme` | `src/theme/__tests__/global-css.test.ts` › `#179 R1: tokens de Horario e Historial` | — | — | pendiente |
| R2 | Enmienda de la carta | `src/__tests__/design-drift.test.ts` › `#179 R2: enmienda de fidelidad al canvas en Horario e Historial` | — | — | pendiente |
| R3 | Copy nuevo | `src/providers/__tests__/language-provider.test.tsx` › `#179 R3: claves de Horario e Historial del canvas` + Δ18 | — | — | pendiente |
| R4 | Horario: marco y título en contenido | MST › `#179 R4: marco y título en contenido` + Δ1, Δ2; LYT Δ15; UC Δ17 | — | — | pendiente |
| R5 | Horario: resumen | MST › `#179 R5: resumen del artboard` + Δ3; UC Δ17; Δ18; LG Δ20; CC Δ23–Δ25, Δ27 | — | — | pendiente |
| R6 | Horario: filas | MST › `#179 R6: filas del artboard` + Δ4–Δ6; Δ22; CC Δ31, Δ32, Δ34 | — | — | pendiente |
| R7 | Horario: acciones | MST › `#179 R7: acciones del artboard` + Δ7, Δ8; CC Δ27–Δ31, Δ33–Δ35 | — | — | pendiente |
| R8 | Horario: perfil en píldoras | MST › `#179 R8: perfil en píldoras` + Δ9, Δ10; UC Δ17 | — | — | pendiente |
| R9 | Historial: marco y título en contenido | MHT › `#179 R9: marco y título en contenido` + Δ11; LYT Δ16; UC Δ17 | — | — | pendiente |
| R10 | Historial: calendario | MHT › `#179 R10: calendario del artboard` + Δ12; MGT Δ19 y `it` nuevo; DD Δ21; CC Δ24–Δ26 | — | — | pendiente |
| R11 | Historial: celdas | MHT › `#179 R11: celdas del artboard` + Δ13, Δ14; CC Δ31 | — | — | pendiente |
| R12 | Historial: panel del día | MHT › `#179 R12: panel del día`; CC Δ24–Δ26 | — | — | pendiente |
| R13 | Candados de deriva | `src/__tests__/design-drift.test.ts` › `#179 R13: Horario e Historial fieles al canvas` + sondas | n/a (nace verde; sondas) | — | pendiente |
| R14 | Prueba de humo humana (dev build de Android) | §Aprobación de requirements.md | n/a | n/a | pendiente |

## Firmas humanas

| Gate | Dónde | Estado |
|---|---|---|
| Spec aprobada | requirements.md §Aprobación, `- [ ] Aprobado por humano (fecha: ____)` | pendiente |
| Enmienda R2 | `docs/ui-guidelines.md`, al final de `## Enmienda de fidelidad al canvas (2026-10-13)`: `- [ ] Enmienda de fidelidad al canvas aprobada por humano (fecha: ____)`. El test de R2 la acepta vacía o firmada (`[ xX]`). Si otra feature ya la firmó, no se vuelve a firmar | pendiente |
| Humo R14 | requirements.md §Aprobación, `- [ ] Prueba de humo #179 R14 firmada por: ____ — fecha: ____` | pendiente |
