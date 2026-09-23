---
feature: "nutrition-kcal-consumed"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[nutrition-kcal-consumed]] (#104)

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts::R1 (nutrition-kcal-consumed #104): kcalConsumed reparte merKcal a partes iguales y redondea una sola vez el agregado` › `reparte 1059 kcal en 2 franjas redondeando la mitad hacia arriba`; `reparte 1000 kcal en 3 franjas y la suma de incrementos es el total`; `reparte 1001 kcal en 4 franjas` | `1edd6f37` `test(nutrition-kcal-consumed): kcalConsumed reparte a partes iguales (R1)`; `a16dc9e1` `feat(nutrition-kcal-consumed): kcalConsumed en dominio (R1)` |
| R2 | `backend-pet-tracker/test/meals.e2e-spec.ts::R2 (nutrition-kcal-consumed #104): GET nutrition-plan devuelve kcalConsumedToday de las franjas servidas hoy y generate no` › `vale 0 sin servidas, sube al servir, baja al deshacer y no aparece en generate` | `12239597` `test(nutrition-kcal-consumed): GET del plan con kcalConsumedToday (R2)`; `e7ae5971` `feat(nutrition-kcal-consumed): GET del plan devuelve kcalConsumedToday (R2,R3,R4)` |
| R3 | `backend-pet-tracker/test/meals.e2e-spec.ts::R3 (nutrition-kcal-consumed #104): kcalConsumedToday usa el mismo dia civil del owner que servedToday` › `cuenta la franja servida hoy en los dos extremos de zona horaria`; `no cuenta una franja servida ayer` | `109f0060` `test(nutrition-kcal-consumed): kcal del dia civil del owner (R3)`; `e7ae5971` `feat(nutrition-kcal-consumed): GET del plan devuelve kcalConsumedToday (R2,R3,R4)` (verificación vía (a)) |
| R4 | `backend-pet-tracker/test/meals.e2e-spec.ts::R4 (nutrition-kcal-consumed #104): tras cambiar el plan kcalConsumedToday se recalcula con el plan vigente` › `revalua las franjas servidas cuando cambia merKcal con las mismas franjas`; `excluye las franjas fuera del plan vigente y reparte con su mealsPerDay` | `bf6217af` `test(nutrition-kcal-consumed): kcal con el plan vigente tras regenerar (R4)`; `e7ae5971` `feat(nutrition-kcal-consumed): GET del plan devuelve kcalConsumedToday (R2,R3,R4)` (verificación vía (a)) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
