---
feature: "health-weights"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[health-weights]]

> Rutas relativas a `backend-pet-tracker/`. Los tests nombran su requisito como
> `R<n> (health-weights #15): ...` — el módulo `health` ya tiene R1..R13 de #14.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/weights.schema.spec.ts::R1 (health-weights #15): tabla weights y migracion 0010 nueva` | rojo: `281663d test(health-weights): require weights schema and migration (R1)`; verde: `0e1dae1 feat(health-weights): add weights table migration (R1)` |
| R2 | pendiente — previsto `test/health-weights.e2e-spec.ts` | pendiente |
| R3 | pendiente — previsto `test/health-weights.e2e-spec.ts` | pendiente |
| R4 | pendiente — previsto `src/modules/health/infrastructure/repositories/weight.drizzle.repository.spec.ts` | pendiente |
| R5 | pendiente — previsto `src/modules/health/application/weight-variation.spec.ts` + `test/health-weights.e2e-spec.ts` | pendiente |
| R6 | pendiente — previsto `test/health-weights.e2e-spec.ts` | pendiente |
| R7 | pendiente — previsto `test/health-weights.e2e-spec.ts` (incluye los bordes `hoy` / `hoy+1` → 201 y `hoy+2` → 400 de `MEASURED_AT_MAX_FUTURE_DAYS`) | pendiente |
| R8 | pendiente — previsto `test/health-weights.e2e-spec.ts` | pendiente |
| R9 | pendiente — previsto `test/health-weights.e2e-spec.ts` | pendiente |
| R10 | pendiente — previsto `src/modules/health/application/use-cases/create-weight.use-case.spec.ts` + `test/health-weights.e2e-spec.ts` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(health-weights): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
