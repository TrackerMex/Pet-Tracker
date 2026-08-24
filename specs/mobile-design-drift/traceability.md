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
| R3 | `src/__tests__/design-drift.test.ts::R3: adopción de Card compartida`; suites RTL de `home`, `food`, `meal-schedule`, `health`, `weight-log`, `profile` y `map` | `0b442ef` home; `84331de` food; `7e490a0` meals; `9b8ae47` health; `4da49ca` weights; `cf8ae44` profile; `12870d3` map |
| R4 | `src/__tests__/design-drift.test.ts::R4: token text-2xs elimina tamaño arbitrario` | `a3899b2 refactor(mobile-design-drift): replace arbitrary caption size (R4)` |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
