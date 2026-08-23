---
feature: "mobile-figma-polish"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-figma-polish]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/global-css.test.ts::R1: global.css define los tokens light exactos del diseño` | rojo `9e27a80`; verde `04aef32 feat(mobile-figma-polish): map light design tokens (R1)` |
| R2 | `src/theme/__tests__/global-css.test.ts::R2: global.css define la paleta dark derivada del diseño` | rojo `bef097f`; verde `80ba96b feat(mobile-figma-polish): derive dark design palette (R2)` |
| R3 | `src/theme/__tests__/font-registration.test.ts::R3: el layout registra los pesos estáticos de Inter sin bloquear` | rojo `bed689e`; verde `e7a8890 feat(mobile-figma-polish): load static Inter fonts (R3)` |
| R4 | pendiente (suite existente de tab bar verde, sin asserts nuevos — [[design]] §6) | pendiente |
| R5 | pendiente (suite existente de weight-chart/weight-log verde) | pendiente |
| R6 | pendiente (suite existente de home verde) | pendiente |
| R7 | pendiente (suite existente de map verde) | pendiente |
| R8 | pendiente (suite existente de health verde) | pendiente |
| R9 | pendiente (suite existente de weight-log verde) | pendiente |
| R10 | pendiente (suite existente de profile verde) | pendiente |
| R11 | pendiente (suite existente de auth verde) | pendiente |
| R12 | pendiente (suite completa + smoke humano en `progress/impl_mobile-figma-polish.md` — solo lo cierra el humano) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Nota de esta feature: para R4–R11 la columna Test se cierra apuntando a la
suite existente que cubre la pantalla (verde, sin diffs en asserts), no a un
test nuevo — decisión registrada en [[design]] §6 y ratificada en el gate.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
