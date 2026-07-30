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
| R3 | `backend-pet-tracker/src/db/migrations.spec.ts::R3: drizzle-kit generate produces versioned SQL migrations` | `c853471` feat(db-setup-drizzle): add schema barrel and first generated migration (R3) |
| R4 | `backend-pet-tracker/src/db/drizzle.module.spec.ts::R4: DrizzleModule exposes a Drizzle client under the DRIZZLE token` | `f4553d1` feat(db-setup-drizzle): add global DrizzleModule under DRIZZLE token (R4) |
| R5 | `backend-pet-tracker/src/config/config.module.spec.ts::R5: ConfigModule global lee variables desde ../.env sin reimportarlo` | `b912c47` feat(db-setup-drizzle): add global AppConfigModule reading ../.env (R5) |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
