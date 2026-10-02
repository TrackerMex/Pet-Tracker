---
feature: "meal-schedule-editing"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[meal-schedule-editing]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` #103 (`description` + 4 `acceptance_criteria`),
> `progress/explore_meal-schedule-editing.md` (commit `554f3153`), las cuatro
> decisiones que el humano cerró el 2026-10-02 (H1-H4, tabla abajo) y las que
> el leader adoptó del explore (A1-A5). Toda premisa se volvió a verificar
> contra el árbol (§0); las que no cuadraban se corrigen en §0.2.
>
> Feature **solo de backend** (`backend-pet-tracker/`). Suites:
> `pnpm test` (unit), `pnpm exec tsc --noEmit`, `pnpm lint` y
> `pnpm test:e2e` (Postgres). La suite nueva **no toca LocalStack**.
>
> La mitad móvil es **#147** `mobile-meal-schedule-editing`
> (`feature_list.json`), bloqueada por el merge de esta y por la migración
> aplicada. Esta feature añade **una migración** (`0018`, decisión de gate G1),
> cero dependencias nuevas y cero variables de entorno nuevas.
>
> Depende de:
> - `nutrition-profile-engine` (#17, `done`): `nutrition_plans` append-only,
>   `findLatestPlan`, `generate`;
> - `meals-served-tracking` (#83, `done`): `meal_servings`, su D4 y
>   `ownerLocalDay` al servir;
> - #98 (`done`): el móvil ya consume `servedToday`.
>
> **Anclas**: las rutas son relativas a `backend-pet-tracker/` salvo las que
> empiezan por `docs/`, `specs/`, `progress/` o `mobile-pet-tracker/`. Las
> citas van **por contenido grepeable**, no por número de línea: los números
> caducan con cada merge.
>
> Base: `554f3153` (= `origin/main` `4e8d6cc3` + el explore), branch
> `feature/103-meal-schedule-editing`. **La base de Postgres no se fija
> aquí**: Codex la mide del `.env` de la raíz del árbol donde trabaje
> ([[tasks]] §0).

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Evidencia (grep por contenido) |
|---|---|---|
| P1 | El plan es **append-only**: el puerto no tiene `update` | `src/modules/nutrition/domain/repositories/nutrition.repository.ts`: `findProfile`, `upsertProfile`, `findLatestPlan`, `insertPlan` y nada más |
| P2 | El plan vigente es la fila más reciente por `generatedAt` y luego por `id` (UUIDv7) | `nutrition.drizzle.repository.ts` y `pet-meals.drizzle-reader.ts`: `.orderBy(desc(nutritionPlans.generatedAt), desc(nutritionPlans.id))`; `generated_at` lleva `.defaultNow()` en `src/db/schema/nutrition.schema.ts` |
| P3 | Hasta hoy `mealsPerDay === mealTimes.length` y las horas salen de una tabla fija | `nutrition-engine.ts`: `mealTimes: [...MEAL_TIMES_BY_COUNT[mealsPerDay]]`; `nutrition.constants.ts`: `MEAL_TIMES_BY_COUNT` con claves `2`, `3`, `4`; `MEALS_ADULT = 2`, `MEALS_ADULT_CAT_HIGH_ACTIVITY = 3` |
| P4 | `generate` devuelve el último plan si el hash no cambia | `generate-nutrition-plan.use-case.ts`: `if (latestPlan?.inputsHash === inputsHash) return latestPlan;`. La edad entra en el hash (`calculateAgeMonths(pet, new Date())`), así que el hash cambia **también con el paso de los meses**: sin la regla de H1, una edición moriría al mes siguiente |
| P5 | La base ya acota el número de comidas | `nutrition.schema.ts`: `check('nutrition_plans_meals_per_day_check', sql\`${table.mealsPerDay} between 1 and 6\`)` |
| P6 | Todo lector de horarios lee `plan.mealTimes` del plan vigente, nunca `MEAL_TIMES_BY_COUNT` | `serve-meal.use-case.ts`: `plan.mealTimes.includes(dto.mealTime)`; `get-nutrition-plan.use-case.ts`: `servedInPlan(plan.mealTimes, served)` y `kcalConsumed(plan.merKcal, plan.mealsPerDay, …)`; `pet-meals.drizzle-reader.ts`: `servedInPlan(plan.mealTimes, …)` y `total: plan.mealsPerDay`. Tabla completa en §Lectores |
| P7 | Servir guarda el día civil del owner con `ownerLocalDay` | `serve-meal.use-case.ts`: `const servedOn = await ownerLocalDay(this.pets, petId, now);`. El helper está en `src/modules/pets/application/owner-local-day.ts` (`ownerLocalDay(pets: PetRepository, petId, now): Promise<string>`, vía `pets.findOwnerTimezone`) |
| P8 | `meal_servings` tiene UNIQUE `(pet_id, served_on, meal_time)` | `nutrition.schema.ts`: `meal_servings_pet_id_served_on_meal_time_idx`; `docs/data-model.md`, fila `meal_servings` |
| P9 | `PetAccessGuard` responde 404 antes que 403, y `@RequirePetRole('owner')` es el patrón de escritura del módulo | `pet-access.guard.ts`: comentario "404 precede a 403 siempre". En `nutrition.controller.ts`, `@Put('nutrition-profile')` y `@Post('nutrition-plan/generate')` llevan `@RequirePetRole('owner')`. Los roles válidos están en `pets.schema.ts`: `'owner', 'family', 'walker', 'vet'` |
| P10 | Molde de errores de dominio y de mapper | `domain/errors/nutrition.errors.ts` (`constructor(petId…) { super(…); this.name = '…' }`); `infrastructure/mappers/nutrition-error.mapper.ts` (`UnprocessableEntityException({ statusCode, code, message })`) |
| P11 | Molde de auditoría | `src/audit/audit-log.repository.ts` (`AUDIT_LOGGER`, `AuditLogger.record({ userId, action, entity, entityId, meta })`, acción `<entidad>.<verbo>`); `serve-meal.use-case.ts` audita `meal.serve` **después** de `create` |
| P12 | Hay precedente de escritura en transacción con `notExists` | `src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts`: `this.db.transaction(async (tx) => …)` con `notExists(tx.select(…))` |
| P13 | Hay precedente de candado del SQL exacto de una migración | `src/db/schema/devices.schema.spec.ts`: `describe('#93 R1: …')` → `expect(sql.trim()).toBe('ALTER TABLE "devices" DROP COLUMN "connectivity";')` |
| P14 | El journal termina en `0017_meal_servings` (18 entradas) en `origin/main` `4e8d6cc3` | `src/db/migrations/meta/_journal.json`: última entrada `"tag": "0017_meal_servings"` |
| P15 | No hay dobles exhaustivos de `NutritionRepository` | `grep -rn "implements NutritionRepository\|MockOf<NutritionRepository" src test` solo devuelve `NutritionDrizzleRepository`. Los specs de servir y deshacer usan dobles parciales `as unknown as NutritionRepository`. Inventario en §Dobles |
| P16 | Línea base medida en `4e8d6cc3` | Unit: **171 suites / 1307 tests**. E2e: **30 ficheros** (27 corren + 3 `aws-real` skipped) / **407 tests** (399 pasan, 8 skipped). Codex **vuelve a medir** al arrancar ([[tasks]] §0); si no cuadra, manda su medida |

### §0.2 Premisas corregidas (el implementador no construye sobre la versión anterior)

| # | Premisa (origen) | Corrección |
|---|---|---|
| C1 | "el puerto `domain/ports/nutrition.repository.ts`" (explore §2) | Vive en `src/modules/nutrition/domain/repositories/nutrition.repository.ts` |
| C2 | Que `generate` tiene una spec unitaria que ampliar | **No existe** `generate-nutrition-plan.use-case.spec.ts`. La regla de H1 se prueba con funciones puras de la entidad (spec unitaria nueva) y con e2e (R2) |
| C3 | "`src/screens/meal-schedule/index.tsx` (324 líneas)" (`feature_list.json` #103) | Tiene **302** líneas. Es de #147, no de esta spec |
| C4 | Criterio 1: "franja editada **o borrada**" | H3 lo cierra: **no hay borrado**. El criterio pasa a "franja editada" (`feature_list.json` se enmienda en esta spec) |
| C5 | Criterios 3 y 4 (botones en la pantalla y smoke en dispositivo) | Se mueven a **#147**. Esta spec no tiene smoke propio: sus e2e corren contra Postgres real (§Gate humano) |
| C6 | `files_affected` de #103 incluía `mobile-pet-tracker/src/screens/meal-schedule/index.tsx` | Ahora lista solo backend y docs; la pantalla va a #147 |
| C7 | Que `patchJson` ya existe en el móvil | Solo está en la spec de #41 (`specs/mobile-geofences/requirements.md` R3, en la branch `origin/feature/41-mobile-geofences`), no en código. #147 depende de #41 por eso |
| C8 | Que la migración nueva no mueve candados ajenos | **Mueve uno**: el `it('usa la ultima migracion renombrada y no altera otras tablas')` de `src/db/schema/meal-servings.schema.spec.ts` compara el prefijo de `0017` con `journal.entries.at(-1)?.idx`. Con `0018` en el journal se pone rojo. Se reescribe en el commit rojo de R1 para que busque **su** entrada por `tag` (§Candados) |
| C9 | "27 suites e2e" (conversación previa al encargo) | Son **30 ficheros** (`ls test/*.e2e-spec.ts \| wc -l`); con el nuevo, 31. `docs/conventions.md` pasa de "14 de las 30" a "14 de las 31" |

---

## Decisiones cerradas por el humano (2026-10-02; no se reabren)

| Id | Decisión | Dónde se cumple |
|---|---|---|
| **H1** | **El horario editado sobrevive a regenerar mientras el motor no cambie el número de comidas**; si cambia, vuelve a `MEAL_TIMES_BY_COUNT`. Editar es una **copia append-only** del plan vigente con el **mismo `inputsHash`**. La regla vive en `generate` | R2, R3, R4, R12. G1 fija qué número se compara |
| **H2** | **La servida de hoy se mueve con la franja**, en la misma transacción; los días pasados no se tocan | R5, R6. G2 fija qué pasa si choca en el destino. **Enmienda la D4 de #83** (§Enmienda) |
| **H3** | **No hay borrado**: solo mover (editar la hora) y añadir | R3, R4; §Fuera de alcance |
| **H4** | **Solo el owner**: `PetAccessGuard` + `@RequirePetRole('owner')` | R10 |

## Decisiones del leader (adoptadas del explore; firmar = aceptarlas)

| Id | Decisión |
|---|---|
| **A1** | `mealsPerDay = mealTimes.length` en toda copia, entre 1 y 6 (el `check` de P5). Una séptima comida es `422 MEAL_TIMES_LIMIT_REACHED` |
| **A2** | `POST /v1/pets/:petId/meal-times` añade y `PATCH /v1/pets/:petId/meal-times/:mealTime` mueve. El prefijo es `meal-times`, distinto de `meals` (#83). Los códigos nuevos van en `nutrition-error.mapper.ts` |
| **A3** | `HH:MM` **estricto** (`00:00`-`23:59`), solo en el body de los endpoints nuevos; `MEAL_TIME_PATTERN` de `meal.dto.ts` no se toca. Duplicado = `422`. La copia guarda las horas **ordenadas** |
| **A4** | Fuera de alcance: nombres de comida y raciones por comida |
| **A5** | Regla para #18 (IA): la copia **hereda `ai_explanation`** y no dispara IA. La respuesta sigue dando `aiExplanation: null` (mapper de #17 R26) |

## Decisiones de gate (las propone esta spec; el humano las marca al firmar)

| Id | Propuesta | Alternativa que se descarta |
|---|---|---|
| **G1** | **Migración `0018`**: columna nullable `nutrition_plans.engine_meals_per_day integer`, sin default ni backfill, que guarda cuántas comidas calculó el motor. `generate` compara el número del motor del plan vigente con el que acaba de calcular. Ese número es `engine_meals_per_day`, o `meals_per_day` si es `NULL`: un plan anterior a `0018`, donde los dos coinciden por P3 | **C**: comparar el `meals_per_day` guardado, sin migración. Falla en los dos sentidos ([[design]] D1). Un perro con una comida añadida (3 guardadas, motor 2) pierde la edición al cambiar las kcal. Un gato con una comida añadida (3) que pasa a actividad alta (motor 3) **conserva** horas que ya no son del motor |
| **G2** | **Choque en el destino: fusión.** Puede que al mover `from → to` ya exista una servida de hoy en `to`: una huérfana de un plan anterior (D4 de #83). Entonces **gana la del destino** (su `id` y su `created_by`) y la de `from` se borra. Una huérfana en `to`, o en una hora que se añade, **revive** como servida | `409`: obliga al usuario a deshacer algo que no ve. Sobrescribir el destino: pierde quién sirvió |
| **G3** | **Auditoría** después de escribir, nunca si la escritura falla: `meal_time.add` y `meal_time.move`, `entity: 'nutrition_plan'`, `entityId` = id del plan **nuevo** (R7) | Auditar con el id del plan origen; el nuevo es el que existe tras la acción |

Las decisiones de implementación D1-D12 están en [[design]]; firmar sin editar
= aceptarlas.

---

## Contrato HTTP (resumen; el detalle normativo está en cada R)

| Verbo y ruta | Guard | Éxito | Errores propios |
|---|---|---|---|
| `POST /v1/pets/:petId/meal-times`, body `{ mealTime: 'HH:MM' }` | `PetAccessGuard` + `@RequirePetRole('owner')` | `201` con el plan nuevo, en las **11 claves** de `toNutritionPlanResponse` | `400` body; `422 NUTRITION_PLAN_REQUIRED`; `422 MEAL_TIME_DUPLICATE`; `422 MEAL_TIMES_LIMIT_REACHED` |
| `PATCH /v1/pets/:petId/meal-times/:mealTime`, body `{ mealTime: 'HH:MM' }` (el destino) | ídem | `200`, ídem | `400` body; `422 NUTRITION_PLAN_REQUIRED`; `422 MEAL_TIME_NOT_IN_PLAN` (`:mealTime` no está en el plan); `422 MEAL_TIME_DUPLICATE` (el destino ya está en el plan, o es igual al origen) |
| `POST …/nutrition-plan/generate`, `GET …/nutrition-plan`, `POST`/`DELETE …/meals`, `GET /v1/pets/:petId` (existentes) | sin cambios | la forma no cambia; leen el plan editado (R11) | sin cambios |

Orden de evaluación:

1. guard (`404`, luego `403`);
2. body (`400`);
3. el plan existe;
4. (`PATCH`) `:mealTime ∈ plan`;
5. el destino no está repetido;
6. (`POST`) el límite.

El `:mealTime` de la ruta **no** se valida con regex: si no está en el plan es
`MEAL_TIME_NOT_IN_PLAN`, igual que en `DELETE …/meals/:mealTime` de #83.

Cuerpos de error:

| Código | Cuerpo exacto |
|---|---|
| `NUTRITION_PLAN_REQUIRED` | `{ statusCode: 422, code: 'NUTRITION_PLAN_REQUIRED', message: 'Generate a nutrition plan before serving meals' }` (el de #83, sin cambiar: el móvil traduce por `code`) |
| `MEAL_TIME_NOT_IN_PLAN` | `{ statusCode: 422, code: 'MEAL_TIME_NOT_IN_PLAN', message: 'mealTime is not part of the current nutrition plan' }` (el de #83) |
| `MEAL_TIME_DUPLICATE` | `{ statusCode: 422, code: 'MEAL_TIME_DUPLICATE', message: 'mealTime is already part of the current nutrition plan' }` |
| `MEAL_TIMES_LIMIT_REACHED` | `{ statusCode: 422, code: 'MEAL_TIMES_LIMIT_REACHED', message: 'The nutrition plan already has the maximum of 6 meal times' }` |
| `400` | `{ statusCode: 400, message: 'Validation failed', errors: [{ path, message }] }` (`parseBody` del controller) |

---

## Requisitos funcionales

Convenciones de todos los R:

- **Ficheros de test.** El e2e va en `test/meal-times.e2e-spec.ts`
  (**nuevo**; fixtures en [[design]] §E2E). Los unit van en tres ficheros
  **nuevos**:
  - `src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts`;
  - `src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts`;
  - `src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts`.
- Los títulos de `describe` e `it` son **literales** y van sin acentos, como
  los de #83.
- **Tipos de rojo.** «Rojo por matcher»: el test corre hasta un `expect` y
  falla en él. Una ruta que aún no existe responde `404`, y el `.expect(201)`
  de supertest falla por matcher. «Rojo por consulta»: el test lanza **antes**
  de llegar a un `expect`, porque un helper del propio test no encuentra lo
  que busca y lanza un `Error` con mensaje propio.
- **Rojos prohibidos** (C4): ningún rojo puede venir de un `ReferenceError`,
  de importar un símbolo que falta ni de mutar un doble. Por eso los commits
  rojos traen los esqueletos de producción que el test necesita («sujeto
  presente»).
- «Plan P0» es el plan que genera el fixture `seedPlan` del perro de 20 kg:
  `mealTimes ['07:30','19:30']`, `rerKcal 662`, `merKcal 1059`,
  `dailyGrams 305`.
- Cada R cierra con su sonda exigida; la tabla completa está en §Sondas.

### R1 — columna `engine_meals_per_day`, migración `0018` y lectura en la entidad

**WHEN** se ejecuta `pnpm db:generate` con
`engineMealsPerDay: integer('engine_meals_per_day')` añadido a
`nutritionPlans` en `src/db/schema/nutrition.schema.ts` (justo después de
`mealTimes`, sin `.notNull()`, sin `.default()` y sin `check` nuevo),
**THE SYSTEM SHALL** dejar en `src/db/migrations/` exactamente tres cambios
(precedente #93):

- un `.sql` renombrado a `0018_nutrition_plans_engine_meals.sql`;
- su `meta/0018_snapshot.json`, tal como sale;
- una entrada nueva en `meta/_journal.json`, con `idx: 18`,
  `tag: "0018_nutrition_plans_engine_meals"` y el `when` tal como sale.

**AND** ese `.sql`, recortado (`trim()`), **SHALL** ser exactamente
`ALTER TABLE "nutrition_plans" ADD COLUMN "engine_meals_per_day" integer;`;

**AND** la entidad y su lectura **SHALL** cambiar así:

- `NutritionPlanProps` gana `engineMealsPerDay: number | null`, y
  `NutritionPlan` su `readonly`;
- `toPlan` de `nutrition.drizzle.repository.ts` lo lee como
  `row.engineMealsPerDay ?? null`;
- `GenerateNutritionPlanUseCase` guarda en todo plan que inserta
  `engineMealsPerDay` = el `mealsPerDay` que devuelve `computePlan`.

**IF** `pnpm db:generate` emite cualquier otra sentencia, **THEN** el
implementador **SHALL** parar sin commitear, ejecutar
`git checkout HEAD -- src/db/migrations` y reportarlo en
`progress/impl_meal-schedule-editing.md` §R1.

**Test** — en `src/db/schema/nutrition.schema.spec.ts`,
`describe('R1 (meal-schedule-editing #103): columna engine_meals_per_day y migracion 0018')`,
con dos `it`:

1. `'declara engine_meals_per_day integer, nullable y sin default'`:
   `getSQLType()` es `'integer'`, `notNull` es `false` y `hasDefault` es
   `false`.
2. `'0018 renombrada, registrada en el journal y con el ADD COLUMN exacto'`.
   El fichero se localiza **por contenido** con el helper
   `findEngineMealsMigration`, que sigue el molde de `findNutritionMigration`
   del mismo fichero: devuelve el primer `.sql` que contiene
   `ADD COLUMN "engine_meals_per_day"` y, si no hay ninguno, lanza
   `throw new Error('Engine meals migration not found')`. Comprueba que:
   - el nombre casa con `/^\d{4}_nutrition_plans_engine_meals\.sql$/`;
   - el journal (`readFileSync` + `JSON.parse`) tiene **una** entrada cuyo
     `tag` es el nombre sin `.sql`, y su `idx` es el prefijo numérico del
     nombre. **No** se usa `entries.at(-1)`: esa es la forma que se rompe en
     C8;
   - `sql.trim()` es la sentencia literal de arriba.

En el mismo commit rojo se mueven dos candados (§Candados):

- la lista de columnas del `it('declara nutrition_plans con historial, checks, cascade e indice')`
  (R15 de #17) gana `'engine_meals_per_day'`;
- el `it` de C8 se reescribe.

**Rojo**:

- el `it` 1 y la lista de R15 caen **por matcher**, porque la columna no
  existe;
- el `it` 2 cae **por consulta**, porque el helper no encuentra la migración;
- el `it` reescrito de C8 sigue verde, en el rojo y en el verde.

**Forzado por `tsc` en el verde** (no son requisitos aparte):

- `generate` gana `engineMealsPerDay: result.mealsPerDay`;
- el fixture `function plan(mealTimes: string[]): NutritionPlan` de
  `serve-meal.use-case.spec.ts` gana `engineMealsPerDay: null`.

**Sondas exigidas**:

- S1: `.notNull()` en la columna → `it` 1 rojo por matcher.
- S2: `integer` → `bigint` en el `.sql` → `it` 2 rojo por matcher.

### R2 — `generate` conserva el horario editado mientras el motor no cambie el número de comidas (H1, G1)

**WHEN** `generate` calcula un plan nuevo (el hash cambió) y existe un plan
vigente `latest`,
**THE SYSTEM SHALL** insertarlo con el `mealsPerDay` y los `mealTimes` **de
`latest`** si `engineMealCount(latest) === result.mealsPerDay`, y con los del
motor en otro caso;

**AND** el `engineMealsPerDay` del plan nuevo **SHALL** ser siempre
`result.mealsPerDay`, y el resto de campos (`rerKcal`, `merKcal`,
`dailyGrams`, `objective`, `warnings`) **SHALL** salir del motor;

**AND** sin plan vigente **SHALL** usar el horario del motor;

**AND** con el hash sin cambios **SHALL** seguir devolviendo `latest` sin
fila nueva (P4, sin cambios; R12 lo prueba con una copia editada).

Las dos funciones son puras y se exportan de `nutrition-plan.entity.ts`
([[design]] D3):

- `engineMealCount(plan)` = `plan.engineMealsPerDay ?? plan.mealsPerDay`;
- `carriedSchedule(latest, engine)` devuelve `{ mealsPerDay, mealTimes }`.

**Test unit** — en `nutrition-plan.entity.spec.ts`,
`describe('R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo')`,
con dos `it.each` sobre un fixture `plan(overrides)` que construye un
`NutritionPlan` completo. Las dos primeras filas son de `engineMealCount`; las
seis siguientes, de `carriedSchedule`:

| # | Caso | `latest` (`mealsPerDay`, `engineMealsPerDay`, `mealTimes`) | motor (`mealsPerDay`, `mealTimes`) | Esperado |
|---|---|---|---|---|
| 1 | editado | `3`, `2`, `['07:30','12:00','19:30']` | — | `2` |
| 2 | legado | `2`, `null`, `['08:00','20:00']` | — | `2` |
| 3 | sin plan | `null` | `2`, `['07:30','19:30']` | `{ 2, ['07:30','19:30'] }` |
| 4 | añadida, motor igual | `3`, `2`, `['07:30','12:00','19:30']` | `2`, `['07:30','19:30']` | `{ 3, ['07:30','12:00','19:30'] }` |
| 5 | añadida, motor cambia | ídem | `3`, `['07:30','14:00','19:30']` | `{ 3, ['07:30','14:00','19:30'] }` |
| 6 | movida, motor igual | `2`, `2`, `['08:15','19:30']` | `2`, `['07:30','19:30']` | `{ 2, ['08:15','19:30'] }` |
| 7 | legado, motor igual | `2`, `null`, `['08:00','20:00']` | `2`, `['07:30','19:30']` | `{ 2, ['08:00','20:00'] }` |
| 8 | legado, motor cambia | ídem | `4`, `['07:00','11:00','15:00','19:00']` | `{ 4, ['07:00','11:00','15:00','19:00'] }` |

Se compara con `toEqual` sobre el resultado.

**Sujeto presente**: el commit rojo añade a `nutrition-plan.entity.ts` los
dos esqueletos de [[design]] D3. `engineMealCount` devuelve
`plan.mealsPerDay` y `carriedSchedule` devuelve el horario del motor.

**Rojo**: filas 1, 4, 6 y 7 **por matcher**; las demás ya están verdes.

**Test e2e** — en `meal-times.e2e-spec.ts`,
`describe('R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas')`,
con dos `it`. En los dos, la copia editada **E** se inserta directamente con
`db.insert(nutritionPlans)`, porque el POST aún no existe. Lleva los campos de
P0 salvo `id: uuidv7()`, `mealsPerDay: 3`,
`mealTimes: ['07:30','12:00','19:30']`, `engineMealsPerDay: 2` e
`inputsHash` = el de P0 leído de la base.

1. `'perro: cambian las kcal, el motor sigue en 2 y el horario editado se conserva'`.
   Pasos:
   - P0 del perro, luego E, luego `PUT` del perfil con `kcalPer100g: 360`;
   - `generate` responde `200` con un `id` distinto del de P0 y del de E,
     `mealTimes ['07:30','12:00','19:30']`, `mealsPerDay 3` y
     `dailyGrams 295`;
   - la fila tiene `engineMealsPerDay 2`.
2. `'gato: pasa a actividad alta, el motor sube a 3 y vuelve el horario del motor'`.
   Pasos:
   - un gato (`species: 'cat'`, 4 kg, `activityLevel: 'medium'`) y su P0
     (`['07:30','19:30']`);
   - luego E, luego `PUT` del perfil con `activityLevel: 'high'`;
   - `generate` responde `200` con `mealTimes ['07:30','14:00','19:30']` y
     `mealsPerDay 3`;
   - la fila tiene `engineMealsPerDay 3`.

**Rojo**: el `it` 1 cae por matcher, porque `generate` aún no arrastra el
horario y devuelve `['07:30','19:30']`. El `it` 2 está **verde ya en el
rojo**, y es a propósito: es el que rompe la alternativa C (sonda S3).

**Sondas exigidas**:

- S3: `carriedSchedule` compara `latest.mealsPerDay` en vez de
  `engineMealCount(latest)` (alternativa C). Exigido: filas 4 y 5 de la tabla
  unitaria rojas, el resto verdes, y los **dos** `it` e2e rojos; todo por
  matcher.
- S4: `toPlan` devuelve siempre `engineMealsPerDay: null` → e2e `it` 1 rojo
  por matcher.

### R3 — `POST /v1/pets/:petId/meal-times` añade una franja como copia nueva del plan (H1, H3, A1, A3)

**WHEN** el owner envía `POST /v1/pets/:petId/meal-times` con un
`{ mealTime }` válido (R8), y la mascota tiene un plan vigente que no contiene
esa hora y tiene menos de 6 (R9),
**THE SYSTEM SHALL** insertar un plan **nuevo** igual a
`copyWithMealTimes(plan, [...plan.mealTimes, mealTime])`, **sin** modificar
ninguna fila existente de `nutrition_plans`, y responder `201` con las 11
claves de `toNutritionPlanResponse` del plan nuevo.

`copyWithMealTimes(plan, mealTimes)` ([[design]] D3) devuelve un
`NewNutritionPlan` con:

- `mealTimes` = una **copia ordenada** de `mealTimes`, sin mutar la entrada;
- `mealsPerDay` = su longitud;
- `engineMealsPerDay` = `engineMealCount(plan)`;
- `petId`, `rerKcal`, `merKcal`, `dailyGrams`, `objective`, `warnings`,
  `aiExplanation` e `inputsHash` copiados de `plan`.

**Test unit** — en `nutrition-plan.entity.spec.ts`,
`describe('R3 (meal-schedule-editing #103): copyWithMealTimes ordena, recuenta y resuelve el numero del motor')`,
con dos `it`. El origen es un plan con `mealsPerDay 2`,
`engineMealsPerDay null`, `aiExplanation 'texto'` e
`inputsHash 'a'.repeat(64)`, y se llama con `['19:30','07:30','12:00']`.

1. `toStrictEqual` contra el objeto **entero**, escrito a mano: `mealTimes`
   `['07:30','12:00','19:30']`, `mealsPerDay 3`, `engineMealsPerDay 2` y los
   demás campos del origen, sin `id` ni `generatedAt`.
2. El array que se pasó sigue siendo `['19:30','07:30','12:00']`, y el
   `mealTimes` del origen no cambia.

**Sujeto presente**: el commit rojo añade el esqueleto de
`copyWithMealTimes`. Copia los campos y pasa `mealTimes` tal cual: no ordena,
no recuenta y pone `engineMealsPerDay: plan.engineMealsPerDay`. El rojo cae
**por matcher**.

**Test e2e** — en
`describe('R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan')`,
con dos `it`:

1. `'anade 12:00 a P0, ordena y deja P0 intacto'`. `POST {mealTime: '12:00'}`
   responde `201` y:
   - `Object.keys(body).sort()` son las 11 claves y el `id` no es el de P0;
   - `mealTimes ['07:30','12:00','19:30']`, `mealsPerDay 3`, y `rerKcal`,
     `merKcal` y `dailyGrams` iguales a los de P0;
   - en la base, la mascota tiene **2** planes: la fila de P0 conserva
     `['07:30','19:30']` y la nueva tiene `engineMealsPerDay 2`;
   - `GET …/nutrition-plan` devuelve el `id` nuevo.
2. `'un plan anterior a 0018 resuelve el numero del motor con meals_per_day'`.
   Una mascota sin perfil y un plan insertado a mano con `mealsPerDay 2`,
   `engineMealsPerDay null` y `mealTimes ['08:00','20:00']`.
   `POST {mealTime: '13:00'}` responde `201` con
   `mealTimes ['08:00','13:00','20:00']`, y la fila nueva tiene
   `engineMealsPerDay 2`.

**Rojo**: la ruta no existe, responde `404` y el `expect(201)` falla **por
matcher**.

En el verde, `AddMealTimeUseCase` lanza `NutritionPlanRequiredError` si no
hay plan: lo exige el `null` de `findLatestPlan`. El duplicado y el límite son
de R9 y **no** se implementan aquí. `@RequirePetRole` es de R10.

**Sondas exigidas**:

- S5: `copyWithMealTimes` sin ordenar → unit `it` 1 y e2e `it` 1 rojos por
  matcher.
- S6: `copyWithMealTimes` con `engineMealsPerDay: plan.engineMealsPerDay` (sin
  resolver) → unit `it` 1 y e2e `it` 2 rojos por matcher.

### R4 — `PATCH /v1/pets/:petId/meal-times/:mealTime` mueve una franja como copia nueva del plan (H1, H3)

**WHEN** el owner envía `PATCH /v1/pets/:petId/meal-times/:mealTime` con un
body `{ mealTime: <destino> }` válido (R8), `:mealTime` está en el plan
vigente y el destino no está (R9),
**THE SYSTEM SHALL** insertar un plan nuevo igual a
`copyWithMealTimes(plan, plan.mealTimes con :mealTime sustituido por el destino)`,
sin modificar filas existentes de `nutrition_plans`, y responder `200` con
las 11 claves del plan nuevo.

**Test e2e** — en
`describe('R4 (meal-schedule-editing #103): PATCH meal-times mueve una franja como copia nueva del plan')`,
un `it`, `'mueve dos franjas seguidas y reordena'`, sobre P0:

1. `PATCH …/meal-times/07:30 {mealTime: '08:15'}` responde `200` con las 11
   claves, `mealTimes ['08:15','19:30']` y `mealsPerDay 2`.
2. `PATCH …/meal-times/19:30 {mealTime: '06:00'}` responde `200` con
   `mealTimes ['06:00','08:15']`.
3. La mascota tiene **3** planes.

**Rojo**: la ruta no existe, responde `404` y el `expect(200)` falla **por
matcher**.

En el verde, `MoveMealTimeUseCase` usa `insertPlan` (la servida es de R5) y
lanza `NutritionPlanRequiredError` sin plan. **No** comprueba la pertenencia
ni el duplicado (R9).

**Sonda exigida** — S7: el destino se **añade** en vez de sustituir al origen
→ `it` rojo por matcher (`['07:30','08:15','19:30']`).

### R5 — la servida de hoy se mueve con su franja; los días pasados no (H2)

**WHEN** el `PATCH` de R4 mueve `from → to`,
**THE SYSTEM SHALL**, en **una sola transacción** con la inserción del plan
nuevo, cambiar a `to` el `meal_time` de la fila de `meal_servings` que
cumple:

- `pet_id` = `:petId`;
- `meal_time` = `from`;
- `served_on` = **el día civil del owner** en el instante de la petición
  (`ownerLocalDay(pets, petId, now)`, con el `now = new Date()` del handler,
  como al servir en #83).

La fila conserva su `id`, su `served_at` y su `created_by`.

**AND** **SHALL NOT** tocar filas de otros días ni de otras horas;

**AND** si `from` no se sirvió hoy, **SHALL NOT** cambiar ninguna fila de
`meal_servings`.

Puerto nuevo en `nutrition.repository.ts` ([[design]] D5):
`insertPlanAndMoveServing(plan: NewNutritionPlan, move: MealTimeMove): Promise<NutritionPlan>`,
con `export interface MealTimeMove { servedOn: string; from: string; to: string }`.

**Test unit** — en `move-meal-time.use-case.spec.ts`,
`describe('R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner')`,
un `it.each`. Los dobles son parciales:

- `{ findLatestPlan, insertPlan, insertPlanAndMoveServing }` `as unknown as NutritionRepository`;
- `{ findOwnerTimezone }` `as unknown as PetRepository`;
- `{ record }` `as unknown as AuditLogger`.

El plan es `['07:30','19:30']`. Se llama
`execute({ petId, from: '07:30', to: '08:15', userId, now })` y se espera que
`insertPlanAndMoveServing` se llame con
`(expect.objectContaining({ mealTimes: ['08:15','19:30'] }), { servedOn, from: '07:30', to: '08:15' })`.

La forma esperada se escribe **literal**; no se importa `copyWithMealTimes`
para construirla, porque sería un candado tautológico. Todas las filas de la
tabla cruzan mes o año:

| # | `now` (UTC) | Zona del owner | `servedOn` |
|---|---|---|---|
| 1 | `2026-12-31T10:30:00Z` | `Pacific/Kiritimati` | `2027-01-01` |
| 2 | `2026-12-31T10:30:00Z` | `America/Mexico_City` | `2026-12-31` |
| 3 | `2027-01-01T03:00:00Z` | `America/Mexico_City` | `2026-12-31` |
| 4 | `2027-01-01T03:00:00Z` | `UTC` | `2027-01-01` |
| 5 | `2026-11-30T23:30:00Z` | `Asia/Tokyo` | `2026-12-01` |

**Rojo** por matcher: el use case de R4 llama a `insertPlan`, no a
`insertPlanAndMoveServing`.

**Test e2e** — en
`describe('R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no')`,
dos `it`:

1. `'mueve la de hoy en los dos extremos de zona y deja la de ayer'`. Es un
   bucle sobre `['Pacific/Kiritimati', 'Pacific/Pago_Pago']` (molde R2 de
   `test/meals.e2e-spec.ts`). En cada zona:
   - el owner vive en esa zona y la mascota tiene P0;
   - un miembro `family` sirve `'07:30'` por `POST …/meals` (fila Y, con
     `createdBy` = family);
   - se inserta a mano una fila de **ayer** en `'07:30'`, con
     `servedOn: shiftDay(localDayOf(Date.now(), zona), -1)`;
   - el owner hace `PATCH …/meal-times/07:30 {mealTime: '08:15'}`, que
     responde `200`.

   Las filas de `meal_servings` de la mascota, ordenadas por `servedOn`, son
   **exactamente** (`toEqual`) dos: la de ayer en `'07:30'`, y la Y en
   `'08:15'` con su `id`, su `servedAt` y su `createdBy` (el de family).
   Además:
   - `GET …/nutrition-plan` → `servedToday ['08:15']`;
   - `GET /v1/pets/:id` → `mealsToday { served: 1, total: 2 }`.
2. `'sin servida de hoy en el origen no cambia ninguna fila'`. Sobre P0, el
   owner sirve `'07:30'` y hace `PATCH …/meal-times/19:30 {mealTime: '21:00'}`,
   que responde `200`. Las filas antes y después son iguales (`toEqual`).

**Rojo**: el `it` 1 cae por matcher, porque la fila Y sigue en `'07:30'`. El
`it` 2 está verde ya en el rojo (declarado).

La atomicidad la garantiza `this.db.transaction` ([[design]] D5). La revisa
el `reviewer` leyendo el código; no hay test de fallo a mitad de transacción.

**Sondas exigidas**:

- S8: `localDayOf(now.getTime(), 'UTC')` en vez de `ownerLocalDay`. Exigido:
  filas unit 1, 3 y 5 rojas por matcher (la 2 y la 4 coinciden con el día UTC
  y siguen verdes), y el e2e `it` 1 rojo en **al menos una** de las dos zonas,
  a cualquier hora. Antes de las 11:00 UTC, Pago_Pago va un día por detrás de
  UTC; desde las 10:00 UTC, Kiritimati va uno por delante.
- S9: el `UPDATE` sin filtro de `served_on` → e2e `it` 1 rojo por matcher,
  porque la de ayer también pasa a `'08:15'`.

### R6 — si el destino ya tiene servida hoy, gana la del destino (G2)

**IF** al mover `from → to` ya existe una fila de `meal_servings` de hoy (el
mismo día civil de R5) en `to`, **THEN THE SYSTEM SHALL**, en la transacción
de R5:

- conservar esa fila sin cambios;
- **borrar** la de `from` de hoy, si existe;
- responder `200`, no `409` ni `500`.

**AND** una fila de hoy en una hora que vuelve al plan, sea moviendo a ella o
añadiéndola (R3), **SHALL** contar como servida en `servedToday` y en
`mealsToday` (`servedInPlan` de #83, sin cambios).

**Test e2e** — en
`describe('R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino')`,
tres `it`:

1. `'fusiona: queda la fila del destino y se borra la del origen'`:
   - P0 y una fila de hoy insertada a mano en `'08:15'` (huérfana, `id` X);
   - el owner sirve `'07:30'` (fila Y);
   - `PATCH …/meal-times/07:30 {mealTime: '08:15'}` responde `200`.

   Las filas de hoy de la mascota son **exactamente** `[X en '08:15']`, y Y
   ya no existe. `servedToday ['08:15']` y
   `mealsToday { served: 1, total: 2 }`.
2. `'mover a una hora con huerfana la revive'`. Sobre P0, con una huérfana de
   hoy en `'08:15'` y `'07:30'` **sin** servir, `PATCH 07:30 → 08:15`
   responde `200` y da `servedToday ['08:15']`.
3. `'anadir una hora con huerfana la revive'`. Sobre P0, con una huérfana de
   hoy en `'12:00'`, `POST {mealTime: '12:00'}` responde `201` y da
   `servedToday ['12:00']`.

**Rojo**: el `it` 1 cae por matcher, con un `500` porque el `UPDATE` de R5
choca con el UNIQUE de P8. Los `it` 2 y 3 están verdes ya en el rojo: fijan
la consecuencia de G2 (declarado).

**Sondas exigidas**:

- S10: quitar el `notExists` → `it` 1 rojo por matcher (`500`).
- S11: `DELETE` antes del `UPDATE` → R5 e2e `it` 1 rojo por matcher, porque
  la fila Y desaparece.

### R7 — auditoría después de escribir, nunca si falla (G3)

**WHEN** `POST …/meal-times` inserta el plan nuevo,
**THE SYSTEM SHALL** registrar, **después** de `insertPlan`,
`{ userId: <actor>, action: 'meal_time.add', entity: 'nutrition_plan', entityId: <id del plan nuevo>, meta: { petId, mealTime } }`;

**WHEN** `PATCH …/meal-times/:mealTime` inserta el plan nuevo,
**THE SYSTEM SHALL** registrar, **después** de `insertPlanAndMoveServing`,
`{ userId, action: 'meal_time.move', entity: 'nutrition_plan', entityId: <id del plan nuevo>, meta: { petId, from, to, servedOn } }`;

**AND** **IF** la escritura lanza, **THEN SHALL NOT** registrar nada. Tampoco
registra en ningún `400`, `403`, `404` ni `422`.

**Test unit** — dos describes, cada uno con dos `it`:

- en `add-meal-time.use-case.spec.ts` (nuevo),
  `describe('R7 (meal-schedule-editing #103): meal_time.add se audita despues de escribir y nunca si falla')`;
- en `move-meal-time.use-case.spec.ts`,
  `describe('R7 (meal-schedule-editing #103): meal_time.move se audita despues de escribir y nunca si falla')`.

1. `record` se llama una vez con el objeto exacto, y
   `insert….mock.invocationCallOrder[0] < record.mock.invocationCallOrder[0]`.
2. La escritura rechaza con `new Error('db down')`: `execute` rechaza y
   `record` no se llama.

**Test e2e** — en
`describe('R7 (meal-schedule-editing #103): POST y PATCH dejan filas meal_time.add y meal_time.move en audit_log')`,
dos `it`:

1. Tras `POST '12:00'`, la fila de `audit_log` del owner con
   `action 'meal_time.add'` tiene `entity`, `entityId` (= el `id` de la
   respuesta) y `meta` exactos (`toEqual`).
2. Tras servir `'07:30'` y hacer `PATCH 07:30 → 08:15`, lo mismo para
   `meal_time.move`, con
   `meta { petId, from: '07:30', to: '08:15', servedOn: localDayOf(Date.now(), 'UTC') }`.

**Rojo** por matcher: los use cases no llaman a `record`.

**Sondas exigidas**:

- S12: `record` antes de la escritura → unit `it` 1 y 2 rojos por matcher.
- S13: `meta` sin `servedOn` → e2e `it` 2 y unit `it` 1 del move rojos por
  matcher.

### R8 — body inválido responde 400 antes de leer el plan (A3)

**IF** el body de `POST …/meal-times` o de `PATCH …/meal-times/:mealTime` no
es exactamente `{ mealTime }`, con un `mealTime` que casa
`STRICT_MEAL_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/`, **THEN THE SYSTEM
SHALL** responder `400` con
`{ statusCode: 400, message: 'Validation failed', errors }` **antes** de leer
el plan, sin escribir ni auditar;

**AND** `MEAL_TIME_PATTERN` y `ServeMealSchema` **SHALL** quedar como están:
`POST …/meals {mealTime: '99:99'}` sigue respondiendo
`422 MEAL_TIME_NOT_IN_PLAN` (#83).

DTO en `application/dto/meal.dto.ts`:
`EditMealTimeSchema = z.strictObject({ mealTime: z.string().regex(STRICT_MEAL_TIME_PATTERN, 'mealTime must be a valid HH:MM time') })`
y `EditMealTimeDto`. En el verde de R3 el schema es
`z.strictObject({ mealTime: z.string() })`; la regex llega aquí.

**Test e2e** — en
`describe('R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan')`,
tres `it`. La lista de bodies inválidos es:

- `{}`;
- `{mealTime: 730}`;
- `mealTime` = `'7:30'`, `'24:00'`, `'12:60'`, `'99:99'`, `'07:30:00'` y
  `' 07:30'`;
- `{mealTime: '08:00', extra: true}`.

1. `'POST rechaza cada body de la lista'`: cada uno da `400` con
   `toMatchObject({ statusCode: 400, message: 'Validation failed' })`. Al
   final, la mascota tiene 1 plan y 0 filas `meal_time.add`.
2. `'PATCH rechaza cada body de la lista'`: lo mismo contra
   `PATCH …/meal-times/07:30`, y al final la mascota tiene 1 plan.
3. `'sin plan tambien es 400 y meals conserva su patron'`:
   - en una mascota sin plan, `POST {mealTime: '7:30'}` → `400`, no `422`;
   - `PATCH …/meal-times/07:30 {mealTime: '24:00'}` → `400`;
   - en otra mascota con P0, `POST …/meals {mealTime: '99:99'}` → `422` con
     `code 'MEAL_TIME_NOT_IN_PLAN'`.

**Rojo** por matcher: con `z.string()`, `'7:30'` da `201` en el `it` 1 y
`422` en el `it` 3.

**Sonda exigida** — S14: `EditMealTimeSchema` con `MEAL_TIME_PATTERN` → los
tres `it` rojos por matcher, porque `'24:00'` pasa la validación.

### R9 — 422 con código propio, en orden y sin persistir (A1, A2)

**IF** no hay plan vigente, **THEN THE SYSTEM SHALL** responder
`422 NUTRITION_PLAN_REQUIRED`, en `POST` y en `PATCH`;
**IF** (`PATCH`) `:mealTime` no está en `plan.mealTimes`, **THEN**
`422 MEAL_TIME_NOT_IN_PLAN`;
**IF** el `mealTime` del body ya está en `plan.mealTimes` (en `PATCH`,
también cuando es igual a `:mealTime`), **THEN** `422 MEAL_TIME_DUPLICATE`;
**IF** (`POST`) el plan ya tiene `MAX_MEALS_PER_DAY` (= 6) horas, **THEN**
`422 MEAL_TIMES_LIMIT_REACHED`.

En todos los casos, **sin** insertar plan, **sin** tocar `meal_servings` y
**sin** auditar. El orden es el de §Contrato HTTP: sin plan → origen fuera →
duplicado → límite. Los cuerpos exactos están en §Contrato HTTP.

Errores nuevos en `nutrition.errors.ts`, con el molde de P10:
`MealTimeDuplicateError(petId, mealTime)` y
`MealTimesLimitReachedError(petId)`. Se reutilizan
`NutritionPlanRequiredError` y `MealTimeNotInPlanError`. `MAX_MEALS_PER_DAY`
va en `nutrition.constants.ts`.

**Test unit** — todos con `rejects.toMatchObject({ name: '<Clase>' })` (por
nombre, sin importar la clase) y con `insertPlan`,
`insertPlanAndMoveServing` y `record` sin llamar.

En `add-meal-time.use-case.spec.ts`,
`describe('R9 (meal-schedule-editing #103): el POST lanza en orden sin escribir ni auditar')`,
tres `it`:

1. sin plan → `NutritionPlanRequiredError`;
2. un plan de 6 horas y una de ellas en el body → `MealTimeDuplicateError`
   (el duplicado gana al límite);
3. un plan de 6 y una hora nueva → `MealTimesLimitReachedError`.

En `move-meal-time.use-case.spec.ts`,
`describe('R9 (meal-schedule-editing #103): el PATCH lanza en orden sin escribir ni auditar')`,
cuatro `it`:

1. sin plan → `NutritionPlanRequiredError`;
2. origen `'12:00'`, fuera de `['07:30','19:30']`, y destino `'07:30'` →
   `MealTimeNotInPlanError` (el origen gana al duplicado);
3. `'07:30' → '07:30'` → `MealTimeDuplicateError`;
4. `'07:30' → '19:30'` → `MealTimeDuplicateError`.

**Test e2e** — en
`describe('R9 (meal-schedule-editing #103): 422 con code propio y sin persistir')`,
tres `it`, todos con `toEqual` contra el cuerpo exacto:

1. `'sin plan en POST y PATCH'`. En una mascota sin perfil,
   `POST '12:00'` y `PATCH …/meal-times/07:30 {'08:15'}` dan los dos
   `NUTRITION_PLAN_REQUIRED`, y quedan 0 planes.
2. `'PATCH: origen fuera del plan, destino repetido o igual'`, sobre P0:
   - `PATCH …/meal-times/12:00 {'07:30'}` → `MEAL_TIME_NOT_IN_PLAN`;
   - `PATCH …/meal-times/07:30 {'19:30'}` → `MEAL_TIME_DUPLICATE`;
   - `PATCH …/meal-times/07:30 {'07:30'}` → `MEAL_TIME_DUPLICATE`.

   Al final hay 1 plan y 0 filas `meal_time.move`.
3. `'POST: duplicado y limite de seis'`, sobre P0:
   - `POST '07:30'` → `MEAL_TIME_DUPLICATE`;
   - `'09:00'`, `'11:00'`, `'13:00'` y `'15:00'` → `201` cada una (6 horas);
   - `POST '17:00'` → `MEAL_TIMES_LIMIT_REACHED`;
   - `POST '09:00'` → `MEAL_TIME_DUPLICATE`.

   Al final hay 5 planes y 4 filas `meal_time.add`.

**Rojo** por matcher:

- duplicado en `POST`: `201` con `['07:30','07:30','19:30']`;
- límite: `500`, por el `check` de P5;
- origen fuera en `PATCH`: `200`;
- duplicados en `PATCH`: `200`.

Los casos sin plan (unit `it` 1 de los dos ficheros y e2e `it` 1) están
**verdes ya en el rojo**: el `null` lo fuerza `tsc` en R3 y R4, y el mapper ya
existe (declarado).

**Sondas exigidas**:

- S15: el límite antes que el duplicado en el `POST` → unit add `it` 2 y e2e
  `it` 3 rojos por matcher.
- S16: el duplicado antes que el origen fuera en el `PATCH` → unit move `it`
  2 y e2e `it` 2 rojos por matcher.

### R10 — solo el owner edita; el guard responde antes que el body (H4)

**IF** un miembro activo con rol `family`, `walker` o `vet` envía
`POST …/meal-times` o `PATCH …/meal-times/:mealTime`, **THEN THE SYSTEM
SHALL** responder `403` **antes** de validar el body (también con `{}`), sin
escribir ni auditar;

**AND** **IF** `:petId` no existe, no es UUID o el actor no es miembro
activo, **THEN SHALL** responder `404` en las dos rutas, antes del `403` y del
body (P9).

Los dos handlers ganan `@RequirePetRole('owner')`.

**Test e2e** — en
`describe('R10 (meal-schedule-editing #103): solo el owner edita; 404 del guard precede')`,
dos `it`:

1. `'family, walker y vet reciben 403 incluso con body vacio'`. Es un bucle
   por rol, con `addMember` ampliado con `'vet'`. Cada rol recibe `403` en:
   - `POST {mealTime: '12:00'}` y `POST {}`;
   - `PATCH …/meal-times/07:30 {mealTime: '08:15'}` y `PATCH {}`.

   Al final hay 1 plan y 0 filas `meal_time.*`.
2. `'outsider y petId no uuid reciben 404'`: dan `404` el `POST {}` y el
   `PATCH {}` del outsider, y los dos contra `'not-a-uuid'`.

**Rojo** por matcher: sin el decorador, family recibe `201`. El `it` 2 está
verde ya en el rojo, porque el guard va en el controller (declarado).

**Sonda exigida** — S17: quitar `@RequirePetRole('owner')` solo del `PATCH` →
`it` 1 rojo por matcher.

### R11 — servir, deshacer, el GET del plan y el perfil leen el plan editado (verificación)

**WHILE** la mascota tiene un plan editado como plan vigente,
**THE SYSTEM SHALL** cumplir que:

- `POST …/meals` acepta sus horas y rechaza con `MEAL_TIME_NOT_IN_PLAN` una
  hora que se movió fuera;
- `DELETE …/meals/:mealTime` deshace sobre ellas;
- `GET …/nutrition-plan` da `servedToday` y `kcalConsumedToday` sobre los
  `mealTimes` y el `mealsPerDay` del plan editado;
- `GET /v1/pets/:petId` da `mealsToday { served, total }`, con
  `total = mealsPerDay` del plan editado.

**Test e2e** — en
`describe('R11 (meal-schedule-editing #103): servir, deshacer, GET del plan y perfil leen el plan editado')`,
un `it` sobre P0 (`merKcal 1059`):

1. `POST '12:00'` (añade).
2. `POST …/meals '12:00'` → `201`.
3. `GET` del plan → `servedToday ['12:00']`, `mealsPerDay 3` y
   `kcalConsumedToday 353`; el perfil → `mealsToday {1,3}`.
4. `PATCH 07:30 → 08:15`.
5. `POST …/meals '07:30'` → `422 MEAL_TIME_NOT_IN_PLAN`;
   `POST …/meals '08:15'` → `201`.
6. El perfil → `mealsToday {2,3}`; el plan → `kcalConsumedToday 706`.
7. `DELETE …/meals/12:00` → `204`; el perfil → `mealsToday {1,3}`.

**Requisito de verificación** (C4): es un candado sobre código **ya
correcto** (P6). Su rojo legítimo es una **mutación de producción, versionada
en el commit rojo** y revertida en el verde: en `pet-meals.drizzle-reader.ts`,
`desc(…)` → `asc(…)` en los dos términos del `orderBy`. Así el perfil lee P0,
`mealsToday` es `{0,2}` y el test cae por matcher. La mutación puede arrastrar
al rojo algún e2e de #83 que lea el perfil con más de un plan (declarado: el
verde lo devuelve todo).

**Sonda exigida** — S18: `serve-meal.use-case.ts` comprueba contra
`MEAL_TIMES_BY_COUNT[plan.mealsPerDay]` (con el cast que haga falta) en vez
de `plan.mealTimes` → paso 2 rojo por matcher (`422`).

### R12 — la copia conserva `inputsHash` y `aiExplanation`, y `generate` la devuelve (H1, A5)

**WHEN** se edita un plan (R3 o R4),
**THE SYSTEM SHALL** guardar en la copia el `inputsHash` y el
`ai_explanation` del plan origen, sin llamar a ningún servicio de IA, y
responder `aiExplanation: null` (mapper de #17);

**AND** un `generate` posterior con las mismas entradas **SHALL** devolver la
copia (mismo `id`) sin insertar fila (P4).

**Test e2e** — en
`describe('R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve')`,
un `it`:

1. P0, y `db.update(nutritionPlans).set({ aiExplanation: 'explicacion previa' })`
   sobre P0.
2. `PATCH 07:30 → 08:15` → `200` con `aiExplanation: null`.
3. La fila nueva tiene `aiExplanation 'explicacion previa'` y el mismo
   `inputsHash` que P0.
4. `generate` → `200` con el `id` del `PATCH` y
   `mealTimes ['08:15','19:30']`; la mascota sigue con 2 planes.

**Requisito de verificación** (C4): candado sobre código ya correcto, porque
R3 ya copia los dos campos. Su rojo es una mutación de producción, versionada
en el commit rojo y revertida en el verde: en `copyWithMealTimes`,
`inputsHash: '0'.repeat(64)` y `aiExplanation: null`. Cae por matcher, junto
con el unit `it` 1 de R3 (declarado).

**Sondas exigidas**:

- S19: solo `aiExplanation: null` en la copia → paso 3 rojo por matcher.
- S20: solo el hash mutado → paso 3 rojo por matcher. Sin el paso 3 caería el
  4: otro `id` y 3 planes.

### R13 — la migración se aplica, es idempotente, y el árbol queda verde y documentado (verificación)

**WHILE** R1-R12 están commiteados y verdes,
**WHEN** se ejecuta `pnpm db:migrate` desde `backend-pet-tracker/` contra la
base del `.env` del árbol, sin exportar `DATABASE_URL`,
**THE SYSTEM SHALL**:

- terminar con exit 0;
- dejar en `information_schema.columns` la fila
  `engine_meals_per_day|integer|YES` para `nutrition_plans`;
- dejar en `drizzle.__drizzle_migrations` **una fila más** que en §0;

**AND** un segundo `pnpm db:migrate` **SHALL** terminar en exit 0 sin aplicar
nada;

**AND** `pnpm db:generate` **SHALL NOT** crear ficheros
(`git status --porcelain src/db/migrations` vacío);

**AND** el journal **SHALL** tener 19 entradas, frente a las 18 de
`git show origin/main:backend-pet-tracker/src/db/migrations/meta/_journal.json`;

**AND** **SHALL** terminar en verde:

- `pnpm test` (**174** suites);
- `pnpm test:e2e` (**31** ficheros; `meal-times.e2e-spec.ts` corre);
- `./init.sh` desde la raíz, con el exit 0 medido **sin pipe**.

**AND** los tres documentos de [[design]] §Docs **SHALL** llevar su texto
literal:

- `docs/data-model.md`, fila `nutrition_plans` y línea de migraciones;
- `docs/conventions.md`, "14 de las 31" y "Las otras 17";
- la nota de enmienda en `specs/meals-served-tracking/design.md`.

**Requisito de verificación** (C4 vía **(b)**): asevera propiedades del
artefacto de R1 contra la base del árbol. No tiene test versionado, porque un
e2e sobre `information_schema` sería rojo en toda máquina sin migrar. Los
comandos y la evidencia van en [[tasks]] R13 →
`progress/impl_meal-schedule-editing.md` §R13. La **otra** base (la del otro
árbol) no es parte de R13 ([[design]] §Aplicación de la migración en dos
bases).

---

## Enmienda explícita de la D4 de #83 (H2 + G2)

La D4 de `specs/meals-served-tracking/design.md` dice que las servidas de una
franja que sale del plan quedan guardadas y fuera del conteo. Sigue siendo
verdad al **regenerar** y para los **días pasados**. Esta spec añade dos
cosas:

- **Mover** una franja (`PATCH`) arrastra la servida de **hoy** (día civil
  del owner) a la hora nueva, en la misma transacción (R5).
- Si el destino ya tenía una servida de hoy, **gana la del destino** y se
  borra la del origen (R6). Una huérfana cuya hora vuelve al plan, al mover o
  al añadir, cuenta otra vez (R6).

R13 deja la nota literal en el `design.md` de #83 ([[design]] §Docs).

## Lectores de `mealTimes` y `mealsPerDay`

Inventario completo, de `grep -rn "mealTimes\|mealsPerDay" src`:

| Lector | ¿Cambia? | Por qué |
|---|---|---|
| `nutrition-engine.ts` (`computePlan`) | no | sigue dando el horario del motor; `generate` decide si lo usa (R2) |
| `generate-nutrition-plan.use-case.ts` | **sí** (R1, R2) | guarda `engineMealsPerDay` y aplica `carriedSchedule` |
| `nutrition.drizzle.repository.ts` (`toPlan`) | **sí** (R1) | lee la columna nueva |
| `get-nutrition-plan.use-case.ts` | no | `servedInPlan(plan.mealTimes, …)` y `kcalConsumed(…, plan.mealsPerDay, …)` ya leen el plan vigente (R11) |
| `serve-meal.use-case.ts` | no | `plan.mealTimes.includes` (R11) |
| `unserve-meal.use-case.ts` | no | borra por `(petId, servedOn, mealTime)` sin mirar el plan |
| `pet-meals.drizzle-reader.ts` | no (la mutación temporal de R11 queda en cero) | su propia consulta, con el mismo `orderBy` (P2) |
| `meal-serving.entity.ts` (`servedInPlan`, `kcalConsumed`) | no | son puras sobre lo que reciben |
| `nutrition.mapper.ts` (`toNutritionPlanResponse`) | no | 11 claves; **no** expone `engineMealsPerDay` |
| `mobile-pet-tracker/**` | no | es de #147 |

## Dobles e instancias de `NutritionPlan` (inventario)

| Sitio | Qué hace | Efecto |
|---|---|---|
| `NutritionDrizzleRepository` | único `implements NutritionRepository` | gana `insertPlanAndMoveServing` (R5) |
| `serve-meal.use-case.spec.ts` y `unserve-meal.use-case.spec.ts` | dobles parciales `as unknown as NutritionRepository` | el método nuevo no los rompe |
| `serve-meal.use-case.spec.ts`, `function plan(mealTimes: string[]): NutritionPlan` | único `new NutritionPlan(` fuera de producción | gana `engineMealsPerDay: null` (R1, forzado por `tsc`) |
| `test/meals.e2e-spec.ts` y `test/nutrition.e2e-spec.ts`: `db.insert(nutritionPlans)` y `db.update(nutritionPlans)` | inserts y updates directos | no les afecta: la columna es nullable |

## Candados

### Se mueven (delta declarado; ninguno más)

| Candado (ancla por contenido) | Antes | Después | Por | Commit |
|---|---|---|---|---|
| `src/db/schema/nutrition.schema.spec.ts`, `it('declara nutrition_plans con historial, checks, cascade e indice')`, lista de columnas | 12 columnas | + `'engine_meals_per_day'` | R1 | rojo |
| `src/db/schema/meal-servings.schema.spec.ts`, `it('usa la ultima migracion renombrada y no altera otras tablas')` | `expect(Number(migration.file.slice(0, 4))).toBe(journal.entries.at(-1)?.idx)` | título `'usa su migracion renombrada, registrada en el journal, y no altera otras tablas'`; el `idx` de la entrada con `tag === migration.file.replace(/\.sql$/, '')` es el prefijo; el tipo del journal pasa a `{ entries: Array<{ idx: number; tag: string }> }`; los tres `not.toContain` quedan intactos | R1 (C8) | rojo (verde en todo momento) |
| `serve-meal.use-case.spec.ts`, fixture `plan(mealTimes)` | sin `engineMealsPerDay` | `engineMealsPerDay: null` | R1 (`tsc`) | verde |
| `docs/conventions.md`, "**14 de las 30 suites e2e lo tocan**" / "Las otras 16 solo tocan Postgres" | 30 / 16 | 31 / 17 | R13 | docs |
| `docs/data-model.md`, fila `nutrition_plans` y "Las tablas de nutricion se crean en la migracion" | — | la columna + `0018` | R13 | docs |
| `specs/meals-served-tracking/design.md`, tras "Una sola función pura lo decide (D8)." | — | la nota de enmienda de #103 | R13 | docs |

### Siguen verdes sin tocarlos

Si alguno se pone rojo, lo que está mal es la implementación, no el candado.

| Candado | Qué fija |
|---|---|
| `nutrition.schema.spec.ts`, salvo la lista de R15 | `nutrition_profiles`, los checks, la `0013` por contenido |
| `devices.schema.spec.ts` (`#93 R1`) y el resto de `*.schema.spec.ts` | ninguna otra tabla cambia |
| `meal-servings.schema.spec.ts`, salvo el `it` de C8 | `meal_servings` intacta |
| `test/nutrition.e2e-spec.ts` (entero) | R16-R27 de #17: 11 claves de `generate` (R19), hash (R21), `aiExplanation` null (R26) |
| `test/meals.e2e-spec.ts` (entero, salvo el arrastre declarado del commit rojo de R11) | #83: servir, deshacer, 409, D4 al regenerar, `servedToday`, `mealsToday` |
| `serve-meal.use-case.spec.ts` (salvo el fixture), `unserve-meal.use-case.spec.ts` y `meal-serving.entity.spec.ts` | #83 |
| `nutrition-engine.spec.ts` | el motor no cambia |
| `src/modules/nutrition/nutrition-scope.spec.ts` | nada nuevo mete `OPENAI_` ni `gpt-` |
| `mobile-pet-tracker/**` | no se toca |

## Sondas exigidas

Son mutaciones **no commiteadas**. Codex las corre antes de cerrar y las
registra en el impl §Sondas; el `reviewer` repite las que quiera.

Cada sonda se aplica sola sobre el árbol verde final. Se corre el fichero
indicado, se anota el resultado y se revierte con `git checkout HEAD -- <fichero>`
(nunca con `git checkout <commit> --`, que deja el índice sucio).

| Sonda | R | Mutación | Exigido |
|---|---|---|---|
| S1 | R1 | `.notNull()` en `engineMealsPerDay` del schema | `nutrition.schema.spec` R1 `it` 1 rojo por matcher |
| S2 | R1 | `integer` → `bigint` en `0018_nutrition_plans_engine_meals.sql` | R1 `it` 2 rojo por matcher |
| S3 | R2 | `carriedSchedule` compara `latest.mealsPerDay` | unit R2 filas 4 y 5 rojas, el resto verdes; e2e R2 `it` 1 y `it` 2 rojos; todo por matcher |
| S4 | R2 | `toPlan` con `engineMealsPerDay: null` fijo | e2e R2 `it` 1 rojo por matcher |
| S5 | R3 | `copyWithMealTimes` sin ordenar | unit R3 `it` 1 y e2e R3 `it` 1 rojos por matcher |
| S6 | R3 | `copyWithMealTimes` con `engineMealsPerDay: plan.engineMealsPerDay` | unit R3 `it` 1 y e2e R3 `it` 2 rojos por matcher |
| S7 | R4 | el destino se añade en vez de sustituir al origen | e2e R4 rojo por matcher |
| S8 | R5 | `localDayOf(now.getTime(), 'UTC')` en vez de `ownerLocalDay` | unit R5 filas 1, 3 y 5 rojas por matcher (2 y 4 verdes); e2e R5 `it` 1 rojo en al menos una zona |
| S9 | R5 | `UPDATE` sin `eq(mealServings.servedOn, …)` | e2e R5 `it` 1 rojo por matcher |
| S10 | R6 | sin `notExists` | e2e R6 `it` 1 rojo por matcher (`500`) |
| S11 | R6 | `DELETE` antes del `UPDATE` | e2e R5 `it` 1 rojo por matcher |
| S12 | R7 | `record` antes de la escritura (add y move) | unit R7 `it` 1 y 2 rojos por matcher, en los dos ficheros |
| S13 | R7 | `meta` del move sin `servedOn` | unit R7 move `it` 1 y e2e R7 `it` 2 rojos por matcher |
| S14 | R8 | `EditMealTimeSchema` con `MEAL_TIME_PATTERN` | e2e R8 `it` 1, 2 y 3 rojos por matcher |
| S15 | R9 | el límite antes que el duplicado en `AddMealTimeUseCase` | unit R9 add `it` 2 y e2e R9 `it` 3 rojos por matcher |
| S16 | R9 | el duplicado antes que el origen fuera en `MoveMealTimeUseCase` | unit R9 move `it` 2 y e2e R9 `it` 2 rojos por matcher |
| S17 | R10 | sin `@RequirePetRole('owner')` en el `PATCH` | e2e R10 `it` 1 rojo por matcher |
| S18 | R11 | `serve-meal` contra `MEAL_TIMES_BY_COUNT[plan.mealsPerDay]` | e2e R11 rojo por matcher (`422` en el paso 2) |
| S19 | R12 | `aiExplanation: null` en la copia | e2e R12 rojo por matcher (paso 3); unit R3 `it` 1 rojo |
| S20 | R12 | `inputsHash: '0'.repeat(64)` en la copia | e2e R12 rojo por matcher (paso 3); unit R3 `it` 1 rojo |

Si una sonda no da su «Exigido», Codex **para y lo reporta**. No ajusta la
sonda ni el test para que cuadre.

---

## Cobertura de los criterios de aceptación de `feature_list.json` #103

| Criterio (enmendado en esta spec) | Cubierto por | Nota |
|---|---|---|
| 1. La spec cierra qué ocurre con las `meal_servings` de una franja editada, resolviendo la D4 de #83 | H2, G2, R5, R6, §Enmienda | "o borrada" sale del criterio por H3 |
| 2. El backend expone editar y añadir franja con e2e; el plan generado deja de ser la única fuente de `mealTimes` | R3 y R4 (endpoints), R2 (el horario editado sobrevive a `generate`), R11 (los lectores lo usan) | — |
| 3 y 4 (pantalla y smoke en dispositivo) | **#147** | movidos (C5) |

---

## Gate humano

**Un solo gate: la firma de esta spec**, con sus tres casillas de decisión
(§Aprobación).

**Esta feature no tiene smoke propio.** Sus e2e corren contra Postgres real
(R13). El smoke en dispositivo, que mueve una franja ya servida hoy y añade
otra, es el gate de **#147**. Tras el merge, el leader aplica `0018` a la
otra base con `pnpm db:migrate`; es operativa, no gate ([[design]]
§Aplicación de la migración en dos bases).

---

## Fuera de alcance (cada uno con su porqué)

- **Todo lo móvil** (botones, refetch, i18n, candados de catálogo): es
  **#147**.
- **Borrar una franja** (H3): el móvil no lo ofrece y la D4 de #83 ya cubre
  las huérfanas.
- **Nombres de comida y raciones por comida** (A4): `dailyGrams` sigue siendo
  el total diario, y la ración por comida sigue siendo
  `dailyGrams / mealsPerDay` donde el móvil la calcule.
- **Exponer `engineMealsPerDay`** en la respuesta: ningún cliente lo
  necesita, y las 11 claves de #17 R19 no cambian.
- **`servedToday` en las respuestas de `POST` y `PATCH`**: el móvil refresca
  el `GET` del plan, como en #98.
- **Concurrencia entre dos ediciones simultáneas**: gana la última escritura.
  La otra edición queda como plan intermedio, y su servida movida puede
  quedar huérfana. Un `POST …/meals` concurrente al destino, entre el
  `notExists` y el `UPDATE`, da `500` por el UNIQUE. Es un techo documentado
  en [[design]] D5, y se aborda si aparece en uso real.
- **Volver al horario del motor a petición** ("restablecer"): no está en el
  diseño; si hace falta, será una feature con id propio.
- **`NOT NULL` en `engine_meals_per_day`** (backfill de planes antiguos): el
  `??` lo resuelve sin migración de datos.
- **Aplicar `0018` a la base del otro árbol o a otra máquina**: es operativa
  del leader tras el merge.
- **Tocar `MEAL_TIME_PATTERN`** (A3), `init.sh`, CI, `.env.example`,
  `docs/ui-guidelines.md` o migraciones históricas.

---

## Aprobación

Firmar sin editar = aceptar H1-H4 y A1-A5 tal cual, las decisiones D1-D12 de
[[design]] y **las tres decisiones de gate**:

- [ ] **G1** — migración `0018` con `engine_meals_per_day` nullable; `generate` compara el número del motor del plan vigente. Si se rechaza, la spec vuelve al `spec_author`: R1 desaparece y R2/R3 se reescriben con la alternativa C y su fallo documentado (el caso del gato de R2)
- [ ] **G2** — choque en el destino: fusión; gana la fila del destino y las huérfanas reviven
- [ ] **G3** — auditoría `meal_time.add` / `meal_time.move` con el id del plan nuevo, después de escribir
- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
