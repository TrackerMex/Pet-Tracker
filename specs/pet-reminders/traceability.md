---
feature: "pet-reminders"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[pet-reminders]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/reminders.schema.spec.ts::R1: tabla reminders y migracion 0011 aditiva` | rojo: `a834a82 test(pet-reminders): require reminders schema and migration (R1)`; verde: `9745aa8 feat(pet-reminders): add reminders table migration (R1)` |
| R2 | `test/pet-reminders.e2e-spec.ts::R2: POST crea reminder programado con shape exacto` | rojo: `5decc79 test(pet-reminders): require reminder creation endpoint (R2)`; verde: `aaf7788 feat(pet-reminders): create scheduled reminders (R2)` |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(pet-reminders): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
Los tests escritos en archivos de `src/workers/notifier/` nombran el requisito
como `R<n> (pet-reminders #16): ...` (colisión de R-ids con #13, ver
[[requirements]]).
