---
feature: "meals-served-tracking"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[meals-served-tracking]]

> Rutas relativas a `backend-pet-tracker/`. Los tests nombran su requisito
> como `R<n> (meals-served-tracking #83): …` — los módulos `nutrition` y
> `pets` ya acumulan R-ids de #17 y #5.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/meal-servings.schema.spec.ts::R1 (meals-served-tracking #83): tabla meal_servings y migracion nueva` | pendiente |
| R2 | `test/meals.e2e-spec.ts::R2 (meals-served-tracking #83): POST inserta con el dia civil del owner y responde el shape congelado` | pendiente |
| R3 | `test/meals.e2e-spec.ts::R3 (meals-served-tracking #83): cualquier miembro activo sirve y deshace; 404 del guard precede` | pendiente |
| R4 | `src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts::R4 (meals-served-tracking #83): sin plan o franja fuera del plan el use case lanza sin escribir ni auditar` + `test/meals.e2e-spec.ts::R4 (meals-served-tracking #83): 422 NUTRITION_PLAN_REQUIRED y 422 MEAL_TIME_NOT_IN_PLAN sin persistir` | pendiente |
| R5 | `test/meals.e2e-spec.ts::R5 (meals-served-tracking #83): la misma franja el mismo dia responde 409; otro dia no` | pendiente |
| R6 | `test/meals.e2e-spec.ts::R6 (meals-served-tracking #83): body invalido responde 400 sin persistir` | pendiente |
| R7 | `src/modules/nutrition/application/use-cases/unserve-meal.use-case.spec.ts::R7 (meals-served-tracking #83): sin fila de hoy el use case lanza MealServingNotFoundError sin auditar` + `test/meals.e2e-spec.ts::R7 (meals-served-tracking #83): DELETE deshace la franja de hoy y responde 404 si no existe` | pendiente |
| R8 | `serve-meal.use-case.spec.ts::R8 (meals-served-tracking #83): meal.serve se audita despues de crear y nunca si create falla` + `unserve-meal.use-case.spec.ts::R8 (meals-served-tracking #83): meal.unserve se audita con el id de la fila borrada` + `test/meals.e2e-spec.ts::R8 (meals-served-tracking #83): POST y DELETE dejan filas meal.serve y meal.unserve en audit_log` | pendiente |
| R9 | `test/meals.e2e-spec.ts::R9 (meals-served-tracking #83): GET nutrition-plan devuelve servedToday en orden del plan y generate no` (+ delta `test/nutrition.e2e-spec.ts:478`) | pendiente |
| R10 | `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R10 (meals-served-tracking #83): el perfil consulta mealsToday con el dia civil del owner` + `pet-profile-response.mapper.spec.ts::R8 › serializa las 25 claves fijadas` + `pets.controller.spec.ts` (lista del listado) + `test/meals.e2e-spec.ts::R10 (meals-served-tracking #83): GET perfil devuelve mealsToday y el listado lo deja en null` + listas de `test/pets`, `devices`, `device-subscriptions`, `pet-lost-mode` e2e | pendiente |
| R11 | `src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts::R11 (meals-served-tracking #83): servedInPlan devuelve solo franjas del plan, en su orden y sin duplicados` | pendiente |
| R12 | requisito de verificación (C4 vía (b)): `pnpm db:migrate` ×2 contra `pet_tracker_wt` + consultas psql vía `docker exec` (tabla presente, journal +1) + `db:generate` no-op + `pnpm test:e2e` (30 suites) + `./init.sh` exit 0 sin pipe, en `progress/impl_meals-served-tracking.md` §R12 | pendiente (evidencia en el impl + commit `docs` de conventions) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test(meals-served-tracking): … (R<n>)` para el rojo,
`feat(meals-served-tracking): … (R<n>)` para el verde,
`docs(meals-served-tracking): … (R<n>)` para R1 y R12.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
