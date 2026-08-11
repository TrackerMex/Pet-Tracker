---
feature: "health-weights"
status: approved     # draft | approved
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
| R7 | `test/health-weights.e2e-spec.ts::R7 (health-weights #15): body invalido responde 400 sin persistir` (incluye `hoy` / `hoy+1` → 201 y `hoy+2` → 400) | rojo: `f3c6ec2 test(health-weights): require safe weight validation (R7)`; verde: `2b230aa feat(health-weights): validate weight measurements (R7)` |
| R8 | `test/health-weights.e2e-spec.ts::R8 (health-weights #15): PetAccessGuard responde 404 antes de tocar pesos` | rojo: `5d8bedf test(health-weights): require pet access isolation (R8)`; verde: `28fe600 feat(health-weights): enforce pet access guard (R8)` |
| R9 | `test/health-weights.e2e-spec.ts::R9 (health-weights #15): solo owner crea y cualquier miembro activo lee` | rojo: `e216a1b test(health-weights): require owner-only creation (R9)`; verde: `8271b7a feat(health-weights): restrict creation to owners (R9)` |
| R10 | `src/modules/health/application/use-cases/create-weight.use-case.spec.ts::R10 (health-weights #15): auditoria weight.create ocurre despues de escribir` + `test/health-weights.e2e-spec.ts::R10 (health-weights #15): POST registra auditoria weight.create` | rojo: `97742cd test(health-weights): require creation audit (R10)`; verde: `b324099 feat(health-weights): audit weight creation (R10)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(health-weights): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
