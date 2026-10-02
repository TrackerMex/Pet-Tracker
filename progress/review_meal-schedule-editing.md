# review: meal-schedule-editing (#103, mitad backend)
Fecha: 2026-10-02
Veredicto: APROBADO (ronda 3 sobre 0e6c0167; ronda 2 RECHAZADO sobre 42d161cc; ronda 1 RECHAZADO sobre 90017ed4)

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

# Ronda 2

## HEAD verificado
- Branch: `feature/103-meal-schedule-editing`. HEAD: `42d161ccccb2de02d87ab6fe203297ca1a8337e8`. El árbol estaba limpio al empezar.
- `git log 90017ed4..HEAD` (primer padre) da 49ffac05 (merge de #41), 4dd7e29f (E3, H1) y los 5 commits de Codex. Sus padres van en cadena lineal desde H1.
- `git diff 90017ed4 49ffac05 --stat -- backend-pet-tracker/` sale vacío: el merge no toca el backend.
- El review vale solo para este HEAD.

## Gate (logs del leader)
Leído de `gate103/r2-*`. No ejecuté `./init.sh` ni `pnpm test:e2e` entero.

| Medida | Línea del log | Exigido | OK |
|---|---|---|---|
| `r2.head` | `42d161cc…` | HEAD | sí |
| `r2-e2e.exit` / `r2-init.exit` | `0` / `0` | 0 | sí |
| Arranque | e2e a las 18:26:48Z y su exit a las 18:28. init a las 18:28:18Z. Corrieron uno tras otro, no a la vez | — | sí |
| e2e (log aparte) | r2-e2e.log:276-277 `3 skipped, 28 passed, 28 of 31 total` / `8 skipped, 422 passed, 430 total` | 31 / 430 (422 + 8) | sí |
| e2e (init) | r2-init.log:21281-21282, las mismas cifras | igual | sí |
| Unit backend | r2-init.log:218-219 `174 passed` / `1335 passed` | 174 / 1335 | sí |
| Harness | r2-init.log:231-232, 2 / 14 | 2 / 14 | sí |
| Mobile | r2-init.log:20975-20976, `88 passed` / `1710 passed` | 88 / 1710 | sí (abajo) |
| Migraciones | r2-init.log:20991 `migrations applied successfully!` | — | sí |
| Lint / Typecheck | r2-init.log:21298, 21302 y 21305 `✅ Todo verde` | verde | sí |
| Ruido `ERROR` | 8 en `r2-init.log` y 8 en `init.log` (ronda 1). 2 en `r2-e2e.log` y 2 en `e2e.log`. Son PollerService, PositionsConsumer, AlertsEngineConsumer y el ExceptionsHandler de `pet_users` | igual que en la ronda 1 | sí |

Mobile pasa de 86/1634 a 88/1710 y no es regresión. `git diff 90017ed4 49ffac05 --name-status --diff-filter=A -- mobile-pet-tracker/` añade exactamente 2 ficheros de test: `src/api/__tests__/geofences.test.ts` y `src/screens/geofences/index.test.tsx`. El mismo merge modifica otros 9 ficheros de test. Todo viene de #41.

e2e pasa de 429 a 430 tests y 422 pasan: es el `it` 3 nuevo de R5. Los 8 saltados y los 3 ficheros saltados no cambian.

## C2-C7 sobre el delta H1..HEAD

### Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene únicamente `103 meal-schedule-editing`.
- [x] `progress/current.md` llega hasta la aprobación de E3 («Apruebo E3»). Le falta la entrada de cierre de la ronda 2: Codex terminó en 42d161cc y el leader corrió el gate. Es tarea del leader (obs. R2-N1).

### Checklist C3 — Arquitectura
- [x] La producción tiene diff neto cero en H1..HEAD. `git diff 4dd7e29f HEAD -- nutrition-plan.entity.ts nutrition.drizzle.repository.ts` sale vacío. Las capas son las que aprobó la ronda 1 y no cambian.

### Checklist C4 — TDD
- [x] Los tests nuevos nombran su R-id. R3 `it` 1 sigue en `describe('R3 (meal-schedule-editing #103): copyWithMealTimes …')`. El `it` 3 `'no toca las servidas de otra mascota'` está en `describe('R5 (meal-schedule-editing #103): la servida de hoy se mueve …')`.
- [x] Los dos `it` siguen la spec al pie de la letra. R3 `it` 1 pasa `objective: 'weight_loss'` y `warnings: [{ code: 'weight_loss_plan', message: 'aviso' }]` como overrides de `plan()`, con el fixture compartido intacto y el esperado escrito a mano. R5 `it` 3 usa:
  - un owner A en `UTC` (es el valor por defecto de `seedUser`) con P0;
  - un owner B distinto, sin plan;
  - dos `insertServing` de B en `today`, a `'07:30'` y a `'08:15'`;
  - `neighborBefore`, el `POST` con `201` y `[served]`, y el `PATCH` con `200`;
  - los dos `toEqual` en el orden A, B.
- [x] Historial rojo→verde, con un par por candado:
  - ea73bb6d (rojo B1) toca el test y `copyWithMealTimes` (`objective: 'maintenance'`, `warnings: []`). 45e744ce (verde) solo toca `nutrition-plan.entity.ts`. `git diff 4dd7e29f 45e744ce -- nutrition-plan.entity.ts` sale vacío.
  - ae11f28e (rojo B2) toca el e2e y quita `eq(mealServings.petId, plan.petId)` del `DELETE`. 888e07a6 (verde) solo toca el repositorio. `git diff 45e744ce 888e07a6 -- nutrition.drizzle.repository.ts` sale vacío.
- [x] Medí los dos rojos y los dos son por matcher. Los tests de HEAD son los de cada rojo: `git diff ea73bb6d HEAD -- nutrition-plan.entity.spec.ts` y `git diff ae11f28e HEAD -- test/meal-times.e2e-spec.ts` salen vacíos. Por eso planté la mutación exacta de cada rojo sobre HEAD (U0 y Q1, abajo):
  - U0 da `1 failed, 9 passed, 10 total`, R3 `it` 1, `toStrictEqual`, `- Expected - 7 / + Received + 2`;
  - Q1 da `1 failed, 22 passed, 23 total`, R5 `it` 3, `meal-times.e2e-spec.ts:439` `toEqual(neighborBefore)`.

### Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única coincidencia es la línea 38, la de la regla.
- [x] Las filas R3 y R5 conservan los hashes de la ronda 1 y añaden «ronda 2 (E3): rojo … verde …» con hashes completos. Los 29 hashes completos del fichero son ancestros de HEAD (`git merge-base --is-ancestor`, 29 de 29).
- [x] Los 5 mensajes coinciden literalmente con `handoff_meal-schedule-editing_ronda2.md:31-35` y con tasks.md §Ronda 2 (1)-(4) y (7).
- [x] La lista cerrada se cumple. `git diff --name-only 4dd7e29f HEAD` devuelve 4 ficheros, todos entre los 6 permitidos: `nutrition-plan.entity.spec.ts`, `test/meal-times.e2e-spec.ts`, `progress/impl_meal-schedule-editing.md` y `specs/meal-schedule-editing/traceability.md`. Los otros dos permitidos, entity y repositorio, quedan en diff neto cero.

### Checklist C6 — Spec aprobada
- [x] `requirements.md:3` `status: approved` y `:1212` `- [x] Aprobado por humano (fecha: 2026-10-02)`. E3 está en la cabecera, en §R3, §R5 y §Sondas (S21-S24), y en tasks.md §Ronda 2. Su aprobación humana en el chat consta en `current.md` y en el mensaje de 4dd7e29f.

### Checklist C7 — Sin código huérfano
- [x] N/A: la ronda 2 no reemplaza ni elimina nada.

### Sondas S21-S24 del informe (criterio E2)
| Sonda | Exigido (spec) | Informe | Repetida por mí | Conforme |
|---|---|---|---|---|
| S21 | R5 `it` 3 rojo (`500` en el `PATCH`) | R5 `it` 3 `expected 200 OK, got 500`. Otros rojos: R7 `it` 2, R11 `it` 1 y R12 `it` 1, todos `.expect(200)` con 500 | Q2: idéntico, `4 failed, 19 passed, 23 total` | sí. Los otros rojos son por matcher HTTP. Vienen de las filas de B (07:30 y 08:15 de hoy) que deja el `it` 3 en la base: sin filtro de mascota, cualquier `PATCH 07:30→08:15` posterior intenta mover la 07:30 de B y choca con la unique |
| S22 | R5 `it` 3 rojo en `servingsOf(A)` | rojo, `received []` | Q3: idéntico, `:436`, `1 failed` | sí |
| S23 | unit R3 `it` 1 rojo | rojo, `1 failed / 10` | idéntico, `- Expected - 6 / + Received + 1` | sí |
| S24 | unit R3 `it` 1 rojo | rojo, `1 failed / 10` | idéntico, `- Expected - 1 / + Received + 1` | sí |

Ninguna sonda da un rojo por consulta ni hace caer un verde declarado. La restauración tras cada sonda está documentada en `impl:3187-3237`.

## Sondas propias
Corrí todo en el tree principal sobre HEAD, una sonda tras otra y en primer plano, con un script del scratchpad (`probe103.sh`). Cada sonda:
1. aplica una sola mutación con `sed`;
2. corre una suite;
3. restaura con `git checkout HEAD -- <fichero>`;
4. imprime `git status --porcelain` y `git diff --cached --name-only`.

Tras cada sonda, el status solo mostró ` M progress/review_meal-schedule-editing.md` y el índice salió vacío. La base es `pet_tracker` en :5433, tomada del `.env` de la raíz. No exporté `DATABASE_URL` y no había ningún `init.sh` ni jest en vuelo (`pgrep`). Los logs están en `scratchpad/probes103/`.

Antes de mutar nada, el control sobre HEAD dio verde: meal-times e2e `23 passed, 23 total` y unit entity `10 passed, 10 total`.

### R5: cada condición de `insertPlanAndMoveServing`
Suite: `pnpm exec jest --config ./test/jest-e2e.json test/meal-times.e2e-spec.ts`. Las líneas son las de HEAD en `nutrition.drizzle.repository.ts`.

| # | Mutación (se quita la línea) | Resultado | Primer rojo y línea decisiva |
|---|---|---|---|
| Q1 | `DELETE` sin `petId` (`:128`; es el rojo B2 y la P4 de la ronda 1) | rojo, `1 failed, 22 passed` | R5 `it` 3, `:439` `toEqual(neighborBefore)`, `- Expected - 8 / + Received + 0` |
| Q2 | `UPDATE` sin `petId` (`:107`; S21 y P5) | rojo, `4 failed, 19 passed` | R5 `it` 3 `expected 200 "OK", got 500`, más R7, R11 y R12 (500) |
| Q3 | `NOT EXISTS` sin `petId` (`:116`; S22 y P6) | rojo, `1 failed, 22 passed` | R5 `it` 3, `:436` `servingsOf(A)`, `- Expected - 10 / + Received + 1` |
| Q4 | `UPDATE` sin `servedOn` (`:108`; S9) | rojo, `1 failed, 22 passed` | R5 `it` 1, `:391`, la de ayer también se mueve |
| Q5 | `UPDATE` sin `mealTime = from` (`:109`) | rojo, `2 failed, 21 passed` | R5 `it` 2, `:418` `toEqual(before)`; R11 `it` 1 `expected 201, got 409` |
| **Q6** | **`NOT EXISTS` sin `servedOn` (`:117`)** | **VERDE**, `23 passed, 23 total`, exit=0. Con meals + nutrition, `68 passed, 68 total`, exit=0 | n/a |
| Q7 | `NOT EXISTS` sin `mealTime = to` (`:118`) | rojo, `2 failed, 21 passed` | R5 `it` 1 `:391` y R5 `it` 3 `:436` |
| Q8 | `DELETE` sin `servedOn` (`:129`) | rojo, `1 failed, 22 passed` | R5 `it` 1, `:391`, la de ayer desaparece |
| Q9 | `DELETE` sin `mealTime = from` (`:130`) | rojo, `6 failed, 17 passed` | R5 `it` 1-3, R6 `it` 1-2 y R11 `it` 1, por matcher |

De las 9 condiciones literales, ocho están vigiladas y una sigue ciega: Q6.

### R3: cada campo que copia `copyWithMealTimes`
Suite: `pnpm test -- nutrition-plan.entity`. `mealsPerDay`, `mealTimes` y `engineMealsPerDay` ya los cubren S5, S6 y P2 de la ronda 1.

| # | Mutación | Resultado | Línea decisiva |
|---|---|---|---|
| U0 | `objective: 'maintenance'` y `warnings: []` (es el rojo B1) | rojo, `1 failed, 9 passed` | R3 `it` 1 `toStrictEqual`, `- 7 / + 2` |
| S23 | solo `warnings: []` | rojo, `1 failed` | `- 6 / + 1` |
| S24 | solo `objective: 'maintenance'` | rojo, `1 failed` | `- 1 / + 1` |
| U1 | `petId: ''` | rojo, `1 failed` | `- 1 / + 1` |
| U2 | `rerKcal: 0` | rojo, `1 failed` | `- 1 / + 1` |
| U3 | `merKcal: plan.rerKcal` (campo vecino) | rojo, `1 failed` | `- 1 / + 1` |
| U4 | `dailyGrams: 0` | rojo, `1 failed` | `- 1 / + 1` |
| U5 | `aiExplanation: null` | rojo, `1 failed` | `- 1 / + 1` |
| U6 | `inputsHash: ''` | rojo, `1 failed` | `- 1 / + 1` |
| U7 | `warnings: plan.warnings.slice(1)` | rojo, `1 failed` | `- 6 / + 1` |
| U8 | `objective: 'weight_loss'` (la constante del fixture nuevo) | verde, `10 passed` | n/a |

Los 8 campos copiados quedan vigilados frente a cualquier reinicio plausible. U8 sigue verde, pero eso no es un hueco del candado: solo pasa porque la mutación escribe a mano el mismo valor de la única muestra del fixture, y ningún código real reinicia a `'weight_loss'`. No bloquea.

### Sonda de candado para Q6 (temporal, sin versionar)
Para comprobar que el arreglo cabe en un `it` ya prescrito, edité solo en el árbol de trabajo el R5 e2e `it` 1, en `test/meal-times.e2e-spec.ts`. Después de la fila de ayer en `'07:30'` añadí una segunda fila de **ayer** en `'08:15'` (`yesterdayAtTo`, mismo `insertServing` y mismo `shiftDay(…, -1)`). El esperado pasó a `[yesterday, yesterdayAtTo, { ...today, mealTime: '08:15' }]`. Restauré el fichero con `git checkout HEAD --`, y el status y el índice quedaron como antes.

| # | Árbol | Resultado |
|---|---|---|
| T1 | ese test sobre la producción de HEAD | verde, `23 passed, 23 total` |
| T2 | ese test más la mutación Q6 | rojo, `1 failed, 22 passed`, R5 `it` 1, `:397` `toEqual`, `- Expected - 8 / + Received + 0`. Falta la fila de hoy (Kiritimati, `servedOn 2026-10-03`, `08:15`): se borró en lugar de moverse |

Con el mismo test temporal medí dos sondas vecinas, para saber qué forma tendrían sus rojos tras el arreglo:

| # | Árbol | Resultado |
|---|---|---|
| T3 | ese test más S9 (`UPDATE` sin `servedOn`) | rojo, `1 failed, 22 passed`, R5 `it` 1. Pero ahora es `:396` `expected 200 "OK", got 500`: la de ayer en `'07:30'` choca con `yesterdayAtTo` en la unique. Ya no es el «por matcher» de las filas que declara S9 |
| T4 | ese test más Q8 (`DELETE` sin `servedOn`) | rojo, `1 failed, 22 passed`, R5 `it` 1, `:397` `toEqual`, `- 8` |

## Observaciones
### Bloqueantes

**B3 — R5/R6: el `served_on` del `NOT EXISTS` de `insertPlanAndMoveServing` no está fijado (Q6).**

Qué piden los requisitos:
- R5 exige mover a `to` la fila con `pet_id = :petId`, `meal_time = from` y `served_on = hoy`.
- La única excepción es R6, que se activa solo «**IF** … ya existe una fila de `meal_servings` **de hoy** (el mismo día civil de R5) en `to`». «De hoy» es una condición literal del requisito aprobado.
- En el código, esa condición es `eq(mealServings.servedOn, move.servedOn)` dentro del `notExists(…)`. Hoy es la línea 117 de `nutrition.drizzle.repository.ts`; se encuentra buscando el `servedOn` que va dentro de `notExists(`.

Qué pasa sin ella:
- Si se quita, las tres suites siguen verdes: meal-times `23/23`, y con meals + nutrition `68/68`.
- En producción, basta con que la mascota tenga una servida en `to` en **cualquier día pasado**. El `UPDATE` se salta, el `DELETE` borra la servida de hoy en `from` y el `PATCH` responde `200`. La marca «servida» de hoy se pierde sin aviso. T2 lo reproduce: desaparece la fila de hoy de Kiritimati.
- El caso es de uso normal, sin concurrencia. Basta con mover una franja a una hora que ya se sirvió antes, por ejemplo deshacer al día siguiente un movimiento `07:30→08:15` cuando hay servidas antiguas a las `07:30`.

Por qué bloquea:
- Es la misma clase de defecto que B2: una condición literal de un requisito aprobado, sin ningún test que la vigile, que acaba en pérdida de datos. Por coherencia con la ronda 1, bloquea.
- No es culpa de Codex ni de E3. Codex cumplió E3 al pie de la letra. La condición ya estaba sin vigilar en 90017ed4: mi tabla de la ronda 1 solo probó el `pet_id` de las tres cláusulas (P4-P6), y fue una omisión de la ronda 1.

Arreglo propuesto:
- Necesita una enmienda (E4), porque el R5 e2e `it` 1 está prescrito. La receta está comprobada (T1 y T2):
  - en el R5 e2e `it` 1, en cada zona, después de la fila de ayer en `'07:30'`, insertar una fila de **ayer** en `'08:15'` (`yesterdayAtTo`);
  - el esperado pasa a `[yesterday, yesterdayAtTo, { ...today, mealTime: '08:15' }]`.
- La mutación versionada es quitar `eq(mealServings.servedOn, move.servedOn)` del `NOT EXISTS`. El rojo esperado es el R5 `it` 1 por matcher, en el `toEqual` de `servingsOf(pet.id)`.
- La enmienda también tiene que **re-declarar S9**. Con la fila nueva, S9 sigue roja, pero cae en `.expect(200)` con `500` por la unique (T3), no por matcher en las filas.
- Q8, S11 y Q7 siguen rojas por matcher. Para S8 lo deduje sin medirlo: la fila nueva cambia por qué camino cae la zona adelantada, pero «rojo en al menos una zona» se mantiene. Que la enmienda pida volver a medirla.
- Si el leader prefiere registrarlo como deuda en vez de enmendar, que lo decida el humano de forma explícita, no el reviewer.

### No bloqueantes
- **R2-N1.** A `progress/current.md` le falta la entrada de cierre de la ronda 2: Codex terminó en 42d161cc y el leader corrió el gate en `gate103/r2-*`. Es tarea del leader. La N1 de la ronda 1 está **resuelta**: la entrada «Codex termina la ronda 1 en 90017ed4…» ya existe.
- **R2-N2.** Codex lanzó `./init.sh` al arrancar, aunque el handoff lo prohíbe (`handoff_*_ronda2.md:68`). Lo cortó con SIGTERM durante el build del backend, antes de unit, infra y e2e (`impl:2956-2959`). No dejó rastro: el árbol está limpio y el gate posterior salió verde. Pero con LocalStack y Postgres compartidos, el leader debería confirmar que `wt-backend` no tenía nada en vuelo a esa hora, y repetir en el próximo handoff que no se lanza.
- **R2-N3.** Los «otros rojos» de S21 (R7, R11 y R12) dependen de las filas que el `it` 3 deja en la base compartida. Con otro orden de ejecución podrían desaparecer, pero el rojo exigido, el `it` 3, no depende del orden. E2 los acepta como rojos por matcher. Es solo informativo.
- N2-N6 de la ronda 1 no cambian, porque la producción tiene diff neto cero en H1..HEAD.

## Veredicto ronda 2
**RECHAZADO** sobre HEAD `42d161ccccb2de02d87ab6fe203297ca1a8337e8` (branch `feature/103-meal-schedule-editing`).

B1 y B2 están cerrados de verdad:
- **B1:** los 8 campos que copia `copyWithMealTimes` caen rojos por matcher con cualquier reinicio plausible (U0-U7, S23 y S24).
- **B2:** quitar el `pet_id` de cualquiera de las tres cláusulas da rojo (Q1, Q2 y Q3).
- Los rojos son por matcher, cada verde revierte exactamente su mutación y la producción queda en diff neto cero. La lista cerrada, los mensajes y la trazabilidad cumplen, y el gate del leader está verde con las cifras exigidas (unit 174/1335, harness 2/14, mobile 88/1710 por #41, e2e 31/430).

Rechazo por **B3**. Al aplicar la mutación en zona ciega a cada condición literal de R5/R6, la `served_on` del `NOT EXISTS` sigue sin vigilar (Q6, verde en 68/68). Esa mutación borra en silencio la servida de hoy de la propia mascota. Necesita la enmienda E4 descrita arriba, con S9 re-declarada, o una decisión humana explícita de registrarlo como deuda.

### Medición de la receta E4 (antes de la firma)
Medido sobre HEAD `42d161cc` el 2026-10-02, antes de que el humano firme E4. La receta añade un `it` 4 nuevo al describe R5 e2e de `test/meal-times.e2e-spec.ts`, justo después del `it` 3 «no toca las servidas de otra mascota»: «una servida de otro dia en el destino no bloquea el movimiento». Siembra una fila de ayer en `'08:15'`, sirve hoy `'07:30'` y mueve `07:30→08:15`. El esperado es `[yesterday, { ...served, mealTime: '08:15' }]`. El `it` 1 prescrito no se toca y S9 no se re-declara.

Procedimiento:
- Script: `scratchpad/probeE4.sh`; logs en `scratchpad/probesE4/`.
- Antes de cada corrida, `pgrep` comprobó que no había ningún `init.sh` ni `jest` en vuelo.
- Cada sonda insertó el `it` 4 solo en el working tree y aplicó una mutación de producción. Después corrió `<e2e-mt>` en primer plano (y `<e2e-nut>` en T6) y restauró con `git checkout HEAD -- <repo> <spec>`.
- Tras cada sonda, `git status --porcelain` mostró solo este review y `git diff --cached` salió vacío.
- Con el `it` 4 insertado, la suite tiene 24 tests. El PATCH del `it` 4 queda en :454 y su `toEqual` final en :457. Las líneas posteriores se desplazan +21: R6 `it` 1 en :478, R7 en :588, R11 en :878/:885 y R12 en :921.
- La columna «Base» es la misma mutación sin el `it` 4, de mi tabla Q de la ronda 2. La base de S11 sin el `it` 4 la medí aparte: 2 failed / 21 passed, con el R5 `it` 1 :391 y el `it` 3 :436, ambos por matcher.

| Sonda | Mutación | Base sin it 4 | Con it 4 | `it` 4 | Rojo exigido por la spec | Rojos nuevos |
|---|---|---|---|---|---|---|
| T5 | ninguna | 23/23 verde | 24/24 verde, exit 0 | verde | n/a | ninguno |
| T6 | Q6: quitar `servedOn` del `NOT EXISTS` (`117d`) | 23/23 verde | 1 failed / 23 passed; `<e2e-nut>` exit 0, 45/45 verde | **rojo por matcher**, :457 `toEqual`, `- Expected - 8 / + Received + 0`: falta la fila de hoy y queda la de ayer en `08:15` | es el rojo que E4 debe exigir | solo el `it` 4 |
| T7 | Q1: quitar `petId` del DELETE (`128d`) | 1 failed | 1 failed / 23 passed | verde | R5 `it` 3 :439 por matcher, se mantiene | ninguno |
| T8 | Q2/S21: quitar `petId` del UPDATE (`107d`) | 4 failed | 5 failed / 19 passed | rojo, :454 `expected 200 "OK", got 500` (aserción HTTP, no matcher) | R5 `it` 3 :433 `got 500`, se mantiene igual | el `it` 4, por las filas de B que deja el `it` 3 (dependiente del orden, como R7/R11/R12 en R2-N3). R7 :588, R11 :878 y R12 :921 siguen como antes |
| T9 | Q3/S22: quitar `petId` del `NOT EXISTS` (`116d`) | 1 failed | 2 failed / 22 passed | rojo por matcher, :457: la fila de B a las `08:15` de hoy bloquea el UPDATE | R5 `it` 3 :436 por matcher, se mantiene | el `it` 4, por matcher |
| T10 | Q4/S9: quitar `servedOn` del UPDATE (`108d`) | 1 failed | 1 failed / 23 passed | verde | R5 `it` 1 :391 por matcher (`- 1 / + 1`), **S9 conserva su forma** | ninguno |
| T11 | Q5: quitar `mealTime from` del UPDATE (`109d`) | 2 failed | 2 failed / 22 passed | verde | R5 `it` 2 :418 por matcher, se mantiene; R11 :885 `expected 201, got 409` como antes | ninguno |
| T12 | Q7: quitar `mealTime to` del `NOT EXISTS` (`118d`) | 2 failed | 3 failed / 21 passed | rojo por matcher, :457 | R5 `it` 1 :391 e `it` 3 :436, ambos por matcher, se mantienen | el `it` 4, por matcher |
| T13 | Q8: quitar `servedOn` del DELETE (`129d`) | 1 failed | 1 failed / 23 passed | verde | R5 `it` 1 :391 por matcher, se mantiene | ninguno |
| T14 | S11: DELETE antes del UPDATE | 2 failed | 3 failed / 21 passed | rojo por matcher, :457 | R5 `it` 1 :391 por matcher, se mantiene | el `it` 4, por matcher (el `it` 3 :436 ya caía en la base) |
| T15 | S10: quitar el `notExists` entero (`110,121d`) | 1 failed | 1 failed / 23 passed | verde | R6 `it` 1 «fusiona…» :478 `expected 200 "OK", got 500`, se mantiene | ninguno |

Conclusión: **la receta E4 sirve**.
- T5 está verde (24/24).
- T6 cae roja exactamente en el `toEqual` final del `it` 4, por matcher, y sin otros rojos. `<e2e-nut>` no se ve afectada. El `it` 4 cierra B3.
- Ningún rojo declarado cambia de forma:
  - S9 sigue roja por matcher en el `it` 1, así que no hace falta re-declararla (a diferencia de mi receta sobre el `it` 1, T3);
  - S21 sigue cayendo con `500` en el `it` 3;
  - S22, S11 y Q7 siguen rojas por matcher;
  - S10 sigue cayendo con `500` en el R6 `it` 1.
- Ningún verde declarado cae, y no aparece ningún rojo por consulta.
- Lo único que se añade son rojos del propio `it` 4 bajo Q3, Q7 y S11 (por matcher) y bajo S21 (`500` en la aserción HTTP, por las filas que deja el `it` 3). E2 los admite. Si la enmienda enumera los «otros rojos» de S21, conviene que nombre también el `it` 4, como dependiente del orden.
- Esta medición no cambia el veredicto de la ronda 2: sigue RECHAZADO por B3 hasta que E4 esté firmada e implementada.

# Ronda 3

## HEAD verificado
- Branch: `feature/103-meal-schedule-editing`. HEAD: `0e6c016724e7d9c7196213b2b41d5b74e95cbdc5`. El árbol estaba limpio al empezar (`git status --porcelain` y `git diff --cached` vacíos).
- `git log 3465f9df^..HEAD`: 3465f9df (E4, H2), eff86580 (rojo B3), f3254d70 (verde B3) y 0e6c0167 (docs). Cadena lineal: cada padre es el commit anterior. No hay rebase: 42d161cc es el padre de H2.
- El script de sondas aborta si HEAD deja de ser 0e6c0167. No se movió en toda la revisión.
- El review vale solo para este HEAD.

## Gate (logs del leader)
Leído de `gate103/r3-*`. No ejecuté `./init.sh` ni `pnpm test:e2e` entero.

| Medida | Línea del log | Exigido | OK |
|---|---|---|---|
| `r3.head` | `0e6c016724e7…` | HEAD | sí |
| `r3-e2e.exit` / `r3-init.exit` | `0` / `0` | 0 | sí |
| Arranque | e2e a las 18:59:02Z, su exit a las 19:00:36Z; init a las 19:00:36Z, exit a las 19:05:20Z. Uno tras otro, no a la vez, y después del último commit de Codex (18:57:42Z) | — | sí |
| e2e (log aparte) | r3-e2e.log:276-277 `3 skipped, 28 passed, 28 of 31 total` / `8 skipped, 423 passed, 431 total` | 31 / 431 (28 + 3; 423 + 8) | sí |
| e2e (init) | r3-init.log:21552-21553, las mismas cifras | igual | sí |
| Unit backend | r3-init.log:218-219 `174 passed` / `1335 passed` | 174 / 1335 | sí |
| Harness | r3-init.log:231-232, 2 / 14 | 2 / 14 | sí |
| Mobile | r3-init.log:21246-21247, `88 passed` / `1710 passed` | 88 / 1710 | sí |
| Migraciones | r3-init.log:21262 `migrations applied successfully!` | — | sí |
| Lint / Typecheck | r3-init.log:21576 `✅ Todo verde` | verde | sí |
| Ruido `ERROR` | 8 en `r3-init.log` (PollerService 4, PositionsConsumer 1, AlertsEngineConsumer 1, ExceptionsHandler de `pet_users` 1 más su `severity: 'ERROR'`) y 2 en `r3-e2e.log` | igual que en la ronda 2 (8 / 2) | sí |

e2e pasa de 430 a 431 tests y de 422 a 423 que pasan: es el `it` 4 de R5. Los 8 saltados y los 3 ficheros saltados no cambian. Unit, harness y mobile, igual que en la ronda 2.

## C2-C7 sobre el delta H2..HEAD

### Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress: `feature_list.json` tiene únicamente `103 meal-schedule-editing`.
- [x] `progress/current.md` llega hasta la aprobación de E4 (`:42`, «Apruebo E4»). La entrada de cierre de la ronda 2 (R2-N1) ya está (`:40`). Falta la de la ronda 3: Codex terminó en 0e6c0167 y el leader corrió el gate `r3-*`. Es tarea del leader (obs. R3-N1).

### Checklist C3 — Arquitectura
- [x] Producción con diff neto cero en H2..HEAD: `git diff 3465f9df HEAD -- nutrition.drizzle.repository.ts` y `git diff 42d161cc HEAD -- …` salen vacíos, y `git diff 3465f9df HEAD --stat -- backend-pet-tracker/src` no lista nada. Las capas son las que aprobó la ronda 1.
- [x] Atomicidad: el `UPDATE … NOT EXISTS` y el `DELETE` siguen dentro de `this.db.transaction` (`:102-132`), sin cambios.

### Checklist C4 — TDD
- [x] El test nuevo nombra su R-id: el `it` 4 `'una servida de otro dia en el destino no bloquea el movimiento'` (`:442`) está en `describe('R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no')`, justo después del `it` 3.
- [x] **El `it` 4 es byte a byte el que medí en T5-T15.** Reconstruí el fichero aplicando el bloque de inserción de `scratchpad/probeE4.sh` a `git show 42d161cc:backend-pet-tracker/test/meal-times.e2e-spec.ts`. El resultado es idéntico a `git show HEAD:…` (`cmp` sin salida; sha256 `7471b708…bca0d` en los dos). También coincide con el código de referencia de la spec (§R5, E4). `git diff 42d161cc HEAD -- test/meal-times.e2e-spec.ts` es solo ese bloque de +21 líneas.
- [x] Historial rojo→verde con un par:
  - eff86580 (rojo) toca dos ficheros: el e2e (+21) y el repositorio (-1). La línea que quita es exactamente `eq(mealServings.servedOn, move.servedOn),` dentro del `notExists(` (antes `:117`). El `servedOn` del `UPDATE` (`:108`) y el del `DELETE` (`:129`) no se tocan.
  - f3254d70 (verde) solo toca el repositorio (+1) y devuelve el blob a `4cdc10f2`. `git diff eff86580^ f3254d70 -- nutrition.drizzle.repository.ts` sale vacío (0 bytes).
  - `git diff eff86580 HEAD -- backend-pet-tracker/test` sale vacío, así que el test del rojo es el de HEAD. Por eso Q6 sobre HEAD reproduce el árbol backend del rojo.
- [x] El rojo es por matcher. El log de Codex (`/tmp/pt103-r3-red-mt.log`) da `1 failed, 23 passed, 24 total`, y `<e2e-nut>` (`red-nut.log`) 45/45. Mi V1 lo repite igual: `:457` `toEqual`, `- Expected - 8 / + Received + 0`. Falta la fila de hoy (`servedOn` de hoy, `08:15`) y queda la de ayer en `08:15`.

### Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única coincidencia es la línea 38, la de la regla.
- [x] El diff de `traceability.md` en H2..HEAD es de 1 línea (+1/-1): solo la fila R5. Conserva los 4 hashes de las rondas 1 y 2 y añade «ronda 3 (E4): rojo `eff86580e75b…` … verde `f3254d701ac8…` …» con hashes completos y mensajes literales.
- [x] Los 31 hashes completos del fichero son ancestros de HEAD (`git merge-base --is-ancestor`, 31 de 31).
- [x] Los 3 mensajes coinciden literalmente con tasks.md §Ronda 3 (1), (2) y (4).
- [x] Lista cerrada: `git diff --name-only 3465f9df HEAD` da 3 ficheros, `test/meal-times.e2e-spec.ts`, `progress/impl_meal-schedule-editing.md` y `specs/meal-schedule-editing/traceability.md`. El cuarto permitido, el repositorio, queda en diff neto cero. El impl solo añade (+210/-0): las rondas 1 y 2 del informe no se tocan.

### Checklist C6 — Spec aprobada
- [x] `requirements.md:3` `status: approved` y `:1296` `- [x] Aprobado por humano (fecha: 2026-10-02)`. E4 está en la cabecera (`:109-130`), en §R5 (`it` 4, código de referencia, candado de ronda 3 y rojos añadidos) y en tasks.md §Ronda 3. Su aprobación humana consta en `current.md:42` y en el mensaje de 3465f9df.

### Checklist C7 — Sin código huérfano
- [x] N/A: la ronda 3 no reemplaza ni elimina nada.

## Sondas propias
Las corrí en el tree principal sobre HEAD, una tras otra y en primer plano, con `scratchpad/r3probe.sh`. Logs en `scratchpad/r3/`. Cada sonda:
1. comprueba que HEAD es 0e6c0167 y que `pgrep -af 'init\.sh|jest'` sale vacío;
2. comprueba que la línea a quitar tiene el texto esperado y la borra con `sed`;
3. corre `<e2e-mt>` (y `<e2e-nut>` en V1);
4. restaura con `git checkout HEAD -- nutrition.drizzle.repository.ts` e imprime `git status --porcelain`, `git diff --cached --name-only` y el diff de producción.

Tras cada sonda, el status solo mostró ` M progress/review_meal-schedule-editing.md`, el índice salió vacío y el diff de producción tenía 0 bytes. La base es `pet_tracker` en :5433, tomada del `.env` de la raíz. `DATABASE_URL` no estaba exportada.

Como el `it` 4 y la producción de HEAD son byte a byte los que medí en T5-T15, basta con repetir Q6 y una muestra de dos. Elegí Q4 (S9), porque E4 se apoya en que S9 conserva su forma y no la re-declara, y Q7, la otra condición del mismo `NOT EXISTS`, donde el `it` 4 añade un rojo.

| # | Mutación (se quita la línea) | Resultado | Rojos y línea decisiva | Igual que |
|---|---|---|---|---|
| V0 | ninguna (control) | verde, `24 passed, 24 total`, exit 0 | n/a | T5 |
| **V1** | **Q6: `NOT EXISTS` sin `servedOn` (`:117`)** | rojo, `1 failed, 23 passed, 24 total`. `<e2e-nut>` verde, `45 passed, 45 total`, exit 0 | **solo** R5 `it` 4, `:457` `toEqual`, `- Expected - 8 / + Received + 0`, por matcher | T6 y el rojo de Codex |
| V2 | Q4/S9: `UPDATE` sin `servedOn` (`:108`) | rojo, `1 failed, 23 passed` | R5 `it` 1, `:391` `toEqual`, `- 1 / + 1`, por matcher; el `it` 4 sigue verde | T10. S9 conserva su forma |
| V3 | Q7: `NOT EXISTS` sin `mealTime = to` (`:118`) | rojo, `3 failed, 21 passed` | R5 `it` 1 `:391` (`- 8`), `it` 3 `:436` (`- 10 / + 1`) e `it` 4 `:457` (`- 8`), los tres por matcher | T12 |

Con las mediciones T6-T13 de la ronda 2, que valen para este árbol porque el test y la producción son idénticos, las 9 condiciones de `insertPlanAndMoveServing` dan rojo. Las 3 cláusulas (UPDATE, NOT EXISTS y DELETE) tienen 3 condiciones cada una: `petId`, `servedOn` y `mealTime`.

| Cláusula | `petId` | `servedOn` | `mealTime` |
|---|---|---|---|
| UPDATE | Q2/T8 (`500` en el `it` 3) | Q4/T10, **V2** | Q5/T11 |
| NOT EXISTS | Q3/T9 | **Q6/T6, V1** (antes ciega) | Q7/T12, **V3** |
| DELETE | Q1/T7 | Q8/T13 | Q9 (ronda 2, sin el `it` 4; sus rojos R5 `it` 1-3 van antes del `it` 4 y no dependen de él) |

No queda ninguna condición literal de R5/R6 en zona ciega.

## Observaciones
### Bloqueantes
Ninguna. **B3 está cerrado**: la mutación Q6 da rojo solo en el `it` 4 y por matcher en su `toEqual` final, `<e2e-nut>` sigue verde, y el `it` 4 coincide con el código de referencia de la spec.

### No bloqueantes
- **R3-N1.** A `progress/current.md` le falta la entrada de cierre de la ronda 3: Codex terminó en 0e6c0167 (18:57:42Z) y el leader corrió el gate en `gate103/r3-*` (18:59-19:05Z). Es tarea del leader.
- **R2-N2: resuelta.** Esta vez Codex no lanzó `./init.sh`. Su informe lo dice («no `./init.sh`, E2E completo…» en el plan y «siguen delegados al leader» al cierre), y su `pgrep` previo sale vacío. Sus logs en `/tmp/pt103-r3-*` son solo lint, `tsc`, `<e2e-mt>`, `<e2e-nut>` y `pnpm test`, entre las 18:53 y las 18:57Z. No hay ningún log de `init` en `/tmp` en esa ventana, y el gate del leader arrancó después de su último commit.
- **R2-N3.** Sigue siendo informativa. E4 ya declara en §R5 que con S21 el `it` 4 también cae con `500` y depende del orden. No lo repetí porque el `it` 4 es idéntico al de T8.
- R2-N1 está hecha (`current.md:40`). N1-N6 de la ronda 1 no cambian, porque la producción tiene diff neto cero en H2..HEAD.

## Veredicto ronda 3
**APROBADO** sobre HEAD `0e6c016724e7d9c7196213b2b41d5b74e95cbdc5` (branch `feature/103-meal-schedule-editing`).

- **B3 cerrado:** el `it` 4 es byte a byte la receta medida y el código de referencia de E4. Q6 sobre HEAD da rojo solo en él, por matcher en `:457`. Las 9 condiciones de `insertPlanAndMoveServing` quedan vigiladas.
- **C4:** el rojo es por matcher, el verde revierte exactamente (`git diff eff86580^ f3254d70` vacío) y la producción tiene diff neto cero en H2..HEAD.
- **C5:** la lista cerrada, los mensajes literales y la fila R5 «ronda 3 (E4)» cumplen. Hay 31 de 31 hashes ancestros y ninguna fila pendiente.
- **Gate del leader verde:** e2e 31/431 (423 + 8), init exit 0, unit 174/1335, harness 2/14 y mobile 88/1710.
- B1 y B2 siguen cerrados (ronda 2) y la producción no cambió desde entonces.
- Queda la R3-N1 (entrada de cierre en `current.md`), que es del leader y no bloquea.
