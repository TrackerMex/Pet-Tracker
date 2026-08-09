---
feature: "health-vaccines"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[health-vaccines]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/health.schema.spec.ts::R1: schema y migracion de vacunas` | `aa12c8c feat(health-vaccines): add schema and catalog seed (R1,R2)` |
| R2 | `src/db/seed/vaccine-catalog.spec.ts::R2: seed idempotente del catalogo de vacunas` | `aa12c8c feat(health-vaccines): add schema and catalog seed (R1,R2)` |
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
| R13 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
