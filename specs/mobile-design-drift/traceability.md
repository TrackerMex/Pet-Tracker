---
feature: "mobile-design-drift"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[mobile-design-drift]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/theme/__tests__/global-css.test.ts::R1: tokens rounded-card y text-2xs` | `3e38258 feat(mobile-design-drift): add shared design tokens (R1)` |
| R2 | `src/components/__tests__/card.test.tsx::R2: Card comparte recetas y comportamiento accesible` | `b64fdf9 feat(mobile-design-drift): add shared card component (R2)` |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
