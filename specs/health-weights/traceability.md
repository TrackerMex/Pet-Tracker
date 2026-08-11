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
| R2 | `test/health-weights.e2e-spec.ts::R2 (health-weights #15): POST inserta y responde el shape congelado` | rojo: `0abc655 test(health-weights): require weight creation endpoint (R2)`; verde: `8da976c feat(health-weights): create weight records (R2)` |
| R3 | `test/health-weights.e2e-spec.ts::R3 (health-weights #15): current_weight_kg refleja solo la medicion mas reciente` | rojo: `f5a4fea test(health-weights): require latest weight projection (R3)`; verde: `1b2d1f9 feat(health-weights): project latest weight to pet (R3)` |
| R4 | `src/modules/health/infrastructure/repositories/weight.drizzle.repository.spec.ts::R4 (health-weights #15): insert y update comparten una transaccion` | rojo: `5033761 test(health-weights): require atomic weight writes (R4)`; verde: `9b65281 feat(health-weights): make weight writes atomic (R4)` |
| R5 | `src/modules/health/application/weight-variation.spec.ts::R5 (health-weights #15): variation usa el historial total ordenado` + `test/health-weights.e2e-spec.ts::R5 (health-weights #15): historial ordenado con variation` | rojo: `2c27056 test(health-weights): require ordered weight variation (R5)`; verde: `b34a2b0 feat(health-weights): list weight history with variation (R5)` |
| R6 | `test/health-weights.e2e-spec.ts::R6 (health-weights #15): limit usa default 50, maximo 100 y validacion estricta` | rojo: `b7fc54b test(health-weights): require strict history limits (R6)`; verde: `f3b6c80 feat(health-weights): validate history limits (R6)` |
| R7 | pendiente — previsto `test/health-weights.e2e-spec.ts` (incluye los bordes `hoy` / `hoy+1` → 201 y `hoy+2` → 400 de `MEASURED_AT_MAX_FUTURE_DAYS`) | pendiente |
| R8 | pendiente — previsto `test/health-weights.e2e-spec.ts` | pendiente |
| R9 | pendiente — previsto `test/health-weights.e2e-spec.ts` | pendiente |
| R10 | pendiente — previsto `src/modules/health/application/use-cases/create-weight.use-case.spec.ts` + `test/health-weights.e2e-spec.ts` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(health-weights): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
