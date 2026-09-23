---
feature: "nutrition-kcal-consumed"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[nutrition-kcal-consumed]] (#104)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts::R1 (nutrition-kcal-consumed #104): kcalConsumed reparte merKcal a partes iguales y redondea una sola vez el agregado` | `1edd6f37` `test(nutrition-kcal-consumed): kcalConsumed reparte a partes iguales (R1)`; `a16dc9e1` `feat(nutrition-kcal-consumed): kcalConsumed en dominio (R1)` |
| R2 | `backend-pet-tracker/test/meals.e2e-spec.ts::R2 (nutrition-kcal-consumed #104): GET nutrition-plan devuelve kcalConsumedToday de las franjas servidas hoy y generate no` | `12239597` `test(nutrition-kcal-consumed): GET del plan con kcalConsumedToday (R2)`; feat pendiente |
| R3 | `backend-pet-tracker/test/meals.e2e-spec.ts::R3 (nutrition-kcal-consumed #104): kcalConsumedToday usa el mismo dia civil del owner que servedToday` | `109f0060` `test(nutrition-kcal-consumed): kcal del dia civil del owner (R3)`; feat pendiente (verificación vía (a)) |
| R4 | pendiente — `backend-pet-tracker/test/meals.e2e-spec.ts::R4 (nutrition-kcal-consumed #104): tras cambiar el plan kcalConsumedToday se recalcula con el plan vigente` | pendiente (`test` rojo + `feat (R2,R3,R4)` verde; verificación vía (a)) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
