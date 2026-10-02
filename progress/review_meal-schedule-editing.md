# review: meal-schedule-editing (#103, mitad backend)
Fecha: 2026-10-02
Veredicto: RECHAZADO

## HEAD verificado
- Branch: feature/103-meal-schedule-editing
- HEAD: 90017ed43a451665c784ab56100a1e9bca404e42
- `git log 2ae63956..HEAD`: 28 commits (26 de Codex, más E1 d5cdede0 y E2 9c7a358b). Los mensajes coinciden con las líneas 94-119 del handoff.
- El review se escribe contra este HEAD. El veredicto no vale para ningún commit posterior.

## Gate (logs del leader)
Logs en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/3228069c-49ae-4eb3-b328-25ddb806bf99/scratchpad/gate103/`. No repetí `./init.sh` porque el leader lo prohibió: el clasificador lo deniega y LocalStack/Postgres son compartidos.

| Medida | Línea del log | Exigido | OK |
|---|---|---|---|
| `init.head` | `90017ed4…` | HEAD | sí |
| `init.exit` | `exit=0` | 0 | sí |
| Unit backend | init.log:226-227 `Test Suites: 174 passed, 174 total` / `Tests: 1335 passed, 1335 total` | 174 / 1335 | sí |
| Harness | init.log:239-240, 2 suites / 14 tests | sin cambios | sí |
| Mobile | init.log:20685-20686, `86 passed` / `1634 passed` | 86 / 1634 sin cambios | sí |
| Migraciones | init.log:20701 `migrations applied successfully!`; journal con 19 entradas y 19 `.sql` | 19 | sí |
| e2e (init) | init.log:20991-20992, 28 of 31, 429 total | 31 (28 + 3 saltadas) / 429 | sí |
| e2e (log aparte) | e2e.log:276-277 `Test Suites: 3 skipped, 28 passed, 28 of 31 total` / `Tests: 8 skipped, 421 passed, 429 total`; `e2e.exit` `exit=0` | igual | sí |
| Lint / Typecheck | init.log: Lint OK, Typecheck OK, `✅ Todo verde` | verde | sí |

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene exactamente `103 meal-schedule-editing`.
- [x] `progress/current.md` está actualizado hasta E2. Le falta la entrada de cierre (Codex terminó y el gate se corrió), que es tarea del leader (obs. N1).

## Checklist C3 — Arquitectura
- [x] domain no importa de infrastructure. `nutrition-plan.entity.ts` solo importa tipos de `domain/nutrition-engine`. `nutrition.repository.ts` solo importa tipos de `domain/entities/*`.
- [x] El contrato del dominio es una interfaz pura: `export interface MealTimeMove` y el método `insertPlanAndMoveServing` en el puerto `NutritionRepository`.
- [x] application depende de interfaces. Los dos use cases inyectan `NUTRITION_REPOSITORY`, `AUDIT_LOGGER` y `PET_REPOSITORY` (tokens con `import type`). `ownerLocalDay` viene de `pets/application`, el mismo patrón que `serve-meal`, `unserve-meal` y `get-nutrition-plan`.
- [x] infrastructure no tiene lógica de negocio. El repositorio solo persiste dentro de la transacción. El controller hace `parseBody` y `mapNutritionError`.
- [x] `nutrition_plans` es append-only. `grep "update(nutritionPlans|delete(nutritionPlans" src` no devuelve nada.

## Checklist C4 — TDD
- [x] R1-R13 tienen títulos literales que los nombran. Cada `describe`/`it` que exige la spec aparece una sola vez.
- [x] Historial test-primero: hay 12 pares `test(...)`/`feat(...)` (R1-R12) y R13 va por la vía (b). Las mutaciones versionadas de R11 (fd735a33, `pet-meals.drizzle-reader.ts`) y R12 (9545c71c, entity) quedan en net zero. `git diff caa769d2 HEAD -- <entity>` y el reader dan 0 líneas.
- [x] Medí yo los rojos muestreados en un worktree desechable (`/tmp/rev103`, ya borrado). Todos fallan por matcher:

| Rojo | Commit | Resultado | Línea decisiva |
|---|---|---|---|
| R5 unit | 80694b44 | 5 failed (las 5 filas) | `expect(jest.fn()).toHaveBeenCalledWith(...expected)` |
| R5 e2e | 80694b44 | `Tests: 1 failed, 6 passed, 7 total` | `- Expected - 1 / + Received + 1` |
| R8 e2e | 8bf834b0 | `Tests: 3 failed, 12 skipped, 15 total` | `expected 400 "Bad Request", got 201 "Created"` / `got 200 "OK"` / `got 422 "Unprocessable Entity"` (E1) |
| R11 e2e | fd735a33 | `Tests: 5 failed, 16 passed, 21 total` (R5 `it` 1, R6 `it` 1-3, R11) | `Expected path: "mealsToday"` |
| R11 sobre #83 | fd735a33 | `meals.e2e`: `Tests: 1 failed, 21 passed, 22 total` (R10 «excluye las franjas del plan anterior tras regenerar») | arrastre declarado en E2 |
| R12 e2e | 9545c71c | `Tests: 1 failed, 21 passed, 22 total` | `Expected: "explicacion previa"` / `Received: null` |

- [ ] **Los candados de dos cláusulas explícitas no las ven** (obs. B1 y B2). Probarlo no es un ítem de C4, pero C4 existe para que el rojo demuestre la conducta, y con estas mutaciones la suite sigue verde.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única coincidencia es la línea de la regla. R1-R13 llevan hashes completos y todos son ancestros de HEAD. R13 cita la vía (b), con (a) 8-9 delegados al leader y cubiertos por su gate.
- [x] Los commits siguen el formato `test|feat|docs(meal-schedule-editing): <desc> (Rn)`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md:3` `status: approved` y `:1126` `- [x] Aprobado por humano (fecha: 2026-10-02)`. G1-G3 están marcados. La firma está en 2b74cd62 («firma via Notion»). E1 y E2 están aprobadas por el humano en el chat y documentadas en `requirements.md:28` y `:47`.

## Checklist C7 — Sin código huérfano
- [x] No se reemplaza ningún módulo. La D4 de #83 se enmienda solo en docs (`specs/meals-served-tracking/design.md`). `MEAL_TIMES_BY_COUNT` sigue vivo en `nutrition-engine.ts:159`.
- [ ] N/A: la feature no elimina componentes.

## Alcance, dependencias y docs
- La diff `2ae63956..HEAD` toca 33 ficheros. Todos están en la lista cerrada de tasks.md o entre los 5 ficheros del leader (requirements, tasks, `handoff_*_r8`, `handoff_*_r11`, `current.md`). No hay dependencias nuevas en `package.json` ni variables de entorno nuevas.
- 0018 es coherente:
  - el SQL es `ALTER TABLE "nutrition_plans" ADD COLUMN "engine_meals_per_day" integer;`;
  - el `prevId` del snapshot 0018 es el id del 0017;
  - el snapshot es idéntico salvo la columna nueva `{type: integer, notNull: false}`;
  - el journal pasa de 18 a 19 entradas, con idx 18 y tag `0018_nutrition_plans_engine_meals`.
- El texto de §Docs es literal en `docs/conventions.md` («14 de las 31», «Las otras 17»), en `docs/data-model.md` (columna, nota y línea de migraciones) y en `specs/meals-served-tracking/design.md`.
- §Sondas del impl: las filas S1-S20 cumplen el criterio de E2. El «Exigido» es un mínimo, todos los rojos son por matcher y los verdes declarados de S3 y S8 se conservan. «Otros rojos» declara S4, S5 y S7. Repetí S7, S11 y S14 (abajo) y salen idénticas.
- Riesgos de producto (punto 7):
  - [x] La transacción `insertPlanAndMoveServing` hace insert, update con `notExists` y delete en `this.db.transaction`, con `servedOn = ownerLocalDay(...)`.
  - [x] Fusión al chocar: G2 la cubre R6 (S10 y S11).
  - [x] Owner-only en POST y PATCH: R10 `it` 1 hace POST y PATCH con family, walker y vet, y espera 403.
  - [x] Devuelve 422 para duplicado, límite y origen fuera del plan, con el orden de R9.
  - [x] Patrón HH:MM estricto (S14).
  - [x] Append-only.
  - [ ] **El aislamiento por `pet_id` del movimiento de servidas no está fijado** (B2).

## Sondas propias
Las corrí en el tree principal sobre HEAD, una por una y en primer plano. Después de cada una revertí con `git checkout HEAD -- <fichero>` y comprobé que `git status --porcelain` solo mostraba `?? progress/review_meal-schedule-editing.md` y que `git diff --cached` estaba vacío.

| # | Tipo | Mutación | Fichero | Suites corridas | Resultado | Línea decisiva |
|---|---|---|---|---|---|---|
| P1 | spec S11 | `DELETE` antes del `UPDATE` | `infrastructure/repositories/nutrition.drizzle.repository.ts` | meal-times e2e | rojo, `Tests: 1 failed, 21 passed, 22 total` (R5 `it` 1) | `- Expected - 8 / + Received + 0` |
| P2 | spec S7 | `[...plan.mealTimes, input.to]` en vez del `map` | `application/use-cases/move-meal-time.use-case.ts:45` | meal-times e2e + unit move | rojo. e2e `6 failed, 16 passed` (R4, R5, R6 ×2, R11, R12), unit `5 failed, 6 passed` | igual que S7 del impl |
| P3 | spec S14 | `regex(MEAL_TIME_PATTERN, …)` en `EditMealTimeSchema` | `application/dto/meal.dto.ts:15` | meal-times e2e | rojo, `3 failed, 19 passed` (R8 `it` 1-3) | `expected 400 "Bad Request", got 201 "Created"` |
| P4 | **zona ciega** | DELETE sin `eq(mealServings.petId, plan.petId)` | `nutrition.drizzle.repository.ts:128` | meal-times + meals + nutrition e2e | **VERDE**, `Tests: 67 passed, 67 total`, exit=0 | n/a |
| P5 | **zona ciega** | UPDATE sin `eq(mealServings.petId, plan.petId)` | `nutrition.drizzle.repository.ts:107` | meal-times + meals e2e | **VERDE**, `Tests: 44 passed, 44 total`, exit=0 | n/a |
| P6 | **zona ciega** | `NOT EXISTS` sin `eq(mealServings.petId, plan.petId)` | `nutrition.drizzle.repository.ts:116` | meal-times + meals e2e | **VERDE**, `Tests: 44 passed, 44 total`, exit=0 | n/a |
| P7 | **zona ciega** | `warnings: []` en `copyWithMealTimes` | `domain/entities/nutrition-plan.entity.ts:75` | unit entity + meal-times + nutrition e2e | **VERDE**. Unit `10 passed, 10 total`, e2e `45 passed, 45 total` | n/a |
| P8 | **zona ciega** | `objective: 'maintenance'` en `copyWithMealTimes` | `domain/entities/nutrition-plan.entity.ts:74` | unit entity + meal-times + nutrition e2e | **VERDE**. Unit `10 passed, 10 total`, e2e `45 passed, 45 total` | n/a |

Las e2e solo usan Postgres (base `pet_tracker` del `.env`). No exporté `DATABASE_URL`.

## Observaciones

### Bloqueantes

**B1 — R3: `objective` y `warnings` «copiados de `plan`» no están fijados (P7, P8).**
R3 (`requirements.md`, §R3) exige que `copyWithMealTimes` copie de `plan`, entre otros, `objective` y `warnings`. Las mutaciones `warnings: []` y `objective: 'maintenance'` dejan verdes la unit de la entity y las e2e de meal-times y nutrition. La causa es que los valores del fixture coinciden con los de la mutación:
- en `nutrition-plan.entity.spec.ts`, el fixture `plan()` de las líneas 19-20 usa `objective: 'maintenance'` y `warnings: []`, y el objeto esperado del `toStrictEqual` de R3 `it` 1 (líneas 112-113) repite esos mismos literales;
- en `test/meal-times.e2e-spec.ts:159-160`, `insertPlanRow` siembra los mismos valores, y ninguna e2e comprueba `objective` ni `warnings` en la copia.

La spec solo fija `mealsPerDay`, `engineMealsPerDay`, `aiExplanation` e `inputsHash` del origen. «Los demás campos del origen» quedan libres, así que el arreglo cabe en la spec sin enmienda: en R3 `it` 1, poner al origen un `objective` del enum `NutritionObjective` distinto de `'maintenance'` y un `warnings` no vacío y válido, y mantener el `toStrictEqual` contra el objeto escrito a mano. Criterio de cierre: P7 y P8 rojas por matcher en `nutrition-plan.entity.spec.ts`.

**B2 — R5/R6: el filtro `pet_id = :petId` del movimiento de servidas no está fijado (P4, P5, P6).**
R5 enumera como condición literal `pet_id = :petId` de la fila que se mueve. R6 borra la fila del origen de esa misma mascota. Quité el filtro de mascota por separado en cada uno de los tres sitios de `insertPlanAndMoveServing` (UPDATE `:107`, subconsulta NOT EXISTS `:116`, DELETE `:128`), y las suites siguieron verdes (67/67 y 44/44). En producción, cada mutación tendría este efecto:
- P4: un `PATCH` sobre la mascota A **borra** las servidas de hoy, a la hora `from`, de **todas las demás mascotas** de cualquier owner;
- P5: el mismo `PATCH` mueve a `to` las servidas ajenas, o da 500 por la unique `(pet, servedOn, mealTime)`;
- P6: si cualquier otra mascota tiene una servida a la hora `to`, se salta el UPDATE y el DELETE borra la servida propia, así que la marca se pierde.

Es pérdida de datos entre mascotas y owners, y ninguna e2e siembra una segunda mascota con servidas. El código de HEAD es correcto. El hueco está en el diseño de los tests de la spec, que no prescribe ninguna mascota vecina, y no en una desviación de Codex. Por eso el arreglo **necesita una enmienda**, porque los `it` de R5 y R6 están prescritos. Por ejemplo: en R6 `it` 1, o en un `it` nuevo de R5, sembrar una mascota B con servidas de hoy a `from` y a `to`, hacer el `PATCH` sobre A y aseverar que `servingsOf(B)` no cambia. Rojo declarado: P4, P5 y P6, cada una roja por matcher. Si el leader prefiere registrarlo como deuda en vez de enmendar, que sea decisión explícita del humano y no del reviewer.

### No bloqueantes

- **N1.** A `progress/current.md` le falta la entrada de cierre: Codex terminó en 90017ed4 y el leader corrió el gate (exit 0). Es tarea del leader.
- **N2.** En `nutrition.drizzle.repository.ts:101` hay un comentario `// ponytail: concurrent serving at the destination may conflict…`. El techo que nombra es real: si un `serve` concurrente entra en el destino entre el NOT EXISTS y el UPDATE, la unique hace fallar el UPDATE con 500 y la transacción hace rollback, sin perder datos. Es aceptable. Lo cito solo porque el estilo del comentario no es el del repo.
- **N3.** En `nutrition.constants.ts:32-34`, `MAX_MEALS_PER_DAY = 6` quedó entre el JSDoc `/** C-5: comidas diarias por etapa… */` y `MEALS_PUPPY`. El JSDoc ahora documenta la constante equivocada. Es cosmético.
- **N4.** Los imports nuevos de `nutrition.controller.ts` están fuera de orden. Es cosmético y lint pasa.
- **N5.** Las e2e calculan «hoy» con `localDayOf(Date.now(), …)` por separado del `now` de la petición. Muy cerca de la medianoche de la zona pueden flaquear. Es un patrón heredado de #83 y no ha fallado en ninguna corrida.
- **N6.** Los títulos de los `it` e2e de R7 los eligió Codex, porque la spec no los fija. El `describe` nombra R7, así que no afecta a C4.

## Veredicto final
**RECHAZADO** sobre HEAD `90017ed43a451665c784ab56100a1e9bca404e42` (branch `feature/103-meal-schedule-editing`).

El gate está verde y las cifras coinciden (174/1335, 31 e2e/429, 86/1634, 19 migraciones). La historia rojo→verde, la trazabilidad, el alcance, las capas y los docs cumplen. Rechazo por dos cláusulas explícitas de requisitos aprobados que ningún test vigila:
- **B1** (R3, `objective`/`warnings`). Se arregla con un cambio de fixture dentro de la spec.
- **B2** (R5/R6, aislamiento por `pet_id`, con riesgo de borrar servidas de otras mascotas). Necesita una enmienda de la spec o una decisión humana de registrarlo como deuda.
