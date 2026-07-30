---
feature: "db-setup-drizzle"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[db-setup-drizzle]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/src/db/dependencies.spec.ts::R1: build/test toolchain has drizzle-orm and pg available` | `1a3adf3` feat(db-setup-drizzle): add drizzle-orm, pg, drizzle-kit deps (R1) |
| R2 | `backend-pet-tracker/src/db/drizzle-config.spec.ts::R2: drizzle.config.ts points to schema barrel and migrations folder` | `a3ca672` feat(db-setup-drizzle): add drizzle.config.ts for drizzle-kit (R2) |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
