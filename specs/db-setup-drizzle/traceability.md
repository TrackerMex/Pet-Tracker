---
feature: "db-setup-drizzle"
status: approved     # draft | approved
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
| R6 | `backend-pet-tracker/src/db/database-url-source.spec.ts::R6: DATABASE_URL nunca via process.env directo dentro de src/**` | `57556ae` feat(db-setup-drizzle): add static guard against process.env.DATABASE_URL in src/** (R6) |
| R7 | `backend-pet-tracker/src/modules/health/application/use-cases/check-health.use-case.spec.ts::R7: CheckHealthUseCase devuelve postgres ok cuando ping() resuelve true` + `backend-pet-tracker/test/health.e2e-spec.ts::R7: GET /v1/health responde 200 con Postgres arriba` | `e8fb5b1` feat(db-setup-drizzle): add GET /v1/health module and global /v1 prefix (R7,R8,R9) |
| R8 | `backend-pet-tracker/src/modules/health/application/use-cases/check-health.use-case.spec.ts::R8: CheckHealthUseCase devuelve postgres error cuando la verificación falla` + `backend-pet-tracker/test/health.e2e-spec.ts::R8: GET /v1/health responde 503 con Postgres caído` | `e8fb5b1` feat(db-setup-drizzle): add GET /v1/health module and global /v1 prefix (R7,R8,R9) |
| R9 | `backend-pet-tracker/test/health.e2e-spec.ts::R9: GET /v1/health es público y vive bajo el prefijo /v1` | `e8fb5b1` feat(db-setup-drizzle): add GET /v1/health module and global /v1 prefix (R7,R8,R9) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
