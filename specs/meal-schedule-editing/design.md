---
feature: "meal-schedule-editing"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[meal-schedule-editing]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del
> proyecto. Las rutas son relativas a `backend-pet-tracker/` salvo las que
> empiezan por `docs/` o `specs/`.
>
> Aquí no hay código de aplicación: hay firmas, nombres de símbolos y el
> orden de las operaciones. Todo nombre de esta página es **normativo**:
> Codex no lo elige, lo copia.

## Decisiones técnicas

### D1 — Qué número compara `generate`: el del motor, guardado en una columna (G1; R1, R2)

H1 dice que el horario editado sobrevive mientras el motor no cambie el
número de comidas. Para saber si «cambia» hay que comparar el número que el
motor calcula ahora con el que calculó **para el plan vigente**. Tras una
edición, ese número ya no se puede leer de `meals_per_day`, porque añadir una
franja lo sube. Por eso se guarda aparte, en
`nutrition_plans.engine_meals_per_day`:

- **Nullable, sin default ni backfill.** Los planes anteriores a `0018` los
  escribió todos el motor, así que en ellos `meals_per_day` es el número del
  motor (P3). `engineMealCount(plan) = plan.engineMealsPerDay ?? plan.mealsPerDay`
  es exacto para ellos sin migrar datos.
- **`generate` siempre la escribe** con `result.mealsPerDay` (R1). Una copia
  editada la escribe con `engineMealCount(origen)` (R3), así que la cadena de
  ediciones no pierde el número del motor.

Las dos alternativas, sobre los casos de R2:

| Caso | A (esta spec): compara `engineMealCount(latest)` | C (descartada): compara `latest.mealsPerDay` |
|---|---|---|
| Perro, 2 + 1 añadida (`meals_per_day 3`, motor 2); cambian las kcal y el motor sigue en 2 | `2 === 2` → conserva la edición ✔ | `3 ≠ 2` → pierde la edición ✘ (viola H1) |
| Gato, 2 + 1 añadida (3, motor 2); pasa a actividad alta y el motor sube a 3 | `2 ≠ 3` → horario del motor ✔ | `3 === 3` → conserva horas que no son del motor ✘ (viola H1) |
| Franja movida (2, motor 2), motor en 2 | conserva ✔ | conserva ✔ |

C solo acierta cuando la edición no cambia el número de franjas. Las sondas
S3 y S4 fijan que A no degenera en C.

### D2 — Editar es insertar una copia; nada se actualiza en `nutrition_plans` (H1; R3, R4, R12)

El plan sigue siendo append-only (P1). Cada `POST` o `PATCH` inserta una fila
nueva, que se vuelve el plan vigente por `generated_at` (`defaultNow()`) y,
si empata, por `id` (UUIDv7 creciente) (P2). La copia lleva el **mismo
`inputs_hash`** que su origen, así que el `generate` siguiente con las mismas
entradas encuentra el hash y devuelve la copia sin insertar (P4, R12). Cuando
las entradas cambian, el hash cambia y D1 decide el horario.

El historial queda completo: cada edición es una fila, igual que cada
regeneración. No hay columna «origen»: la auditoría (D7) dice quién la hizo y
desde qué hora.

### D3 — Tres funciones puras en la entidad, con esqueletos en los commits rojos (R2, R3)

Van en `src/modules/nutrition/domain/entities/nutrition-plan.entity.ts`,
junto a la clase, exportadas:

| Función | Firma | Verde final | Esqueleto del commit rojo |
|---|---|---|---|
| `engineMealCount` | `(plan: NutritionPlan) => number` | `plan.engineMealsPerDay ?? plan.mealsPerDay` | devuelve `plan.mealsPerDay` (R2 rojo) |
| `carriedSchedule` | `(latest: NutritionPlan \| null, engine: { mealsPerDay: number; mealTimes: string[] }) => { mealsPerDay: number; mealTimes: string[] }` | el horario de `latest` si `latest !== null && engineMealCount(latest) === engine.mealsPerDay`; si no, el de `engine`. Devuelve **copias** de los arrays | devuelve `{ mealsPerDay: engine.mealsPerDay, mealTimes: engine.mealTimes }` (R2 rojo) |
| `copyWithMealTimes` | `(plan: NutritionPlan, mealTimes: string[]) => NewNutritionPlan` | `mealTimes: [...mealTimes].sort()`, `mealsPerDay: mealTimes.length`, `engineMealsPerDay: engineMealCount(plan)`, y `petId`, `rerKcal`, `merKcal`, `dailyGrams`, `objective`, `warnings`, `aiExplanation` e `inputsHash` de `plan` | copia los campos, pone `mealTimes` tal cual, `mealsPerDay: plan.mealsPerDay` y `engineMealsPerDay: plan.engineMealsPerDay` (R3 rojo) |

Los esqueletos **usan todos sus parámetros**, así que ni `tsc` ni `lint` se
quejan. Además dan rojo por matcher, nunca por `ReferenceError` (C4).

`sort()` sin comparador es correcto aquí porque `HH:MM` con cero a la
izquierda ordena lexicográficamente igual que en el tiempo (R8 garantiza el
formato en las horas nuevas, y las del motor ya lo cumplen).

### D4 — `generate` compone su insert con `carriedSchedule` (R1, R2)

En `generate-nutrition-plan.use-case.ts` solo cambia el objeto del `insertPlan`
de la rama sin hash coincidente. En el orden final de las claves:

1. `petId`;
2. `...result`;
3. `...carriedSchedule(latestPlan, result)`, que sobrescribe `mealsPerDay` y
   `mealTimes`;
4. `engineMealsPerDay: result.mealsPerDay`;
5. `aiExplanation: null`;
6. `inputsHash`.

El verde de R1 añade solo la clave 4, que la fuerza `tsc`. El verde de R2
añade la 3. El hash, la carga del perfil y del peso, y la rama de hash
coincidente no cambian.

### D5 — Puerto `insertPlanAndMoveServing` y su transacción (H2, G2; R5, R6)

En `domain/repositories/nutrition.repository.ts`:

- `export interface MealTimeMove { servedOn: string; from: string; to: string }`;
- en `NutritionRepository`,
  `insertPlanAndMoveServing(plan: NewNutritionPlan, move: MealTimeMove): Promise<NutritionPlan>`.

Va en el repositorio de nutrición, y no en el de `meal_servings`, porque las
dos escrituras tienen que ser una transacción y el plan es el agregado que
manda. La implementación en `nutrition.drizzle.repository.ts` (molde
`weight.drizzle.repository.ts`, P12) hace, dentro de
`this.db.transaction(async (tx) => …)`:

1. `tx.insert(nutritionPlans).values({ id: uuidv7(), ...plan }).returning()`,
   igual que `insertPlan`.
2. `UPDATE meal_servings SET meal_time = to`, con este `WHERE`:
   - `pet_id = plan.petId`;
   - `served_on = move.servedOn`;
   - `meal_time = move.from`;
   - `AND NOT EXISTS (SELECT 1 FROM meal_servings WHERE pet_id = plan.petId AND served_on = move.servedOn AND meal_time = move.to)`.

   El subselect es **no correlacionado**: sus tres filtros son constantes, así
   que no hace falta alias de tabla. En Drizzle es `notExists(tx.select(…).from(mealServings).where(and(…)))`.
3. `DELETE FROM meal_servings` con `pet_id`, `served_on = move.servedOn` y
   `meal_time = move.from`. Tras el paso 2 solo queda fila en `from` si el
   destino ya tenía una (G2): ese es el borrado de la fusión.
4. Devuelve `toPlan(row)` del paso 1.

**Escalonado TDD**: el verde de R5 hace los pasos 1, 2 sin `notExists`, y 4.
El verde de R6 añade el `notExists` y el paso 3. Las sondas S10 y S11 fijan
los dos.

**Techos conocidos** (§Fuera de alcance de [[requirements]]):

- Dos ediciones simultáneas: gana la última en insertar; la intermedia queda
  en el historial.
- Un `POST …/meals` al destino que entre entre el `NOT EXISTS` y el `UPDATE`
  da `23505` → `500`.

No se añade bloqueo: el móvil edita desde una sola pantalla del owner, y un
reintento lo resuelve.

### D6 — Dos use cases nuevos con entrada por objeto y orden de comprobaciones fijo (R3, R4, R5, R9)

Constructores definitivos desde el primer commit, para no reescribir specs:

| Use case | Fichero | Constructor (tokens de `@Inject`) | `execute` |
|---|---|---|---|
| `AddMealTimeUseCase` | `application/use-cases/add-meal-time.use-case.ts` | `(NUTRITION_REPOSITORY nutrition, AUDIT_LOGGER audit)` | `execute(input: AddMealTimeInput): Promise<NutritionPlan>`, con `AddMealTimeInput { petId: string; mealTime: string; userId: string }` |
| `MoveMealTimeUseCase` | `application/use-cases/move-meal-time.use-case.ts` | `(NUTRITION_REPOSITORY nutrition, PET_REPOSITORY pets, AUDIT_LOGGER audit)` | `execute(input: MoveMealTimeInput): Promise<NutritionPlan>`, con `MoveMealTimeInput { petId: string; from: string; to: string; userId: string; now: Date }` |

Las interfaces de entrada se exportan del mismo fichero del use case. Se lee
`input.x` sin desestructurar en la firma, para que los verdes parciales (que
aún no usan `userId` o `now`) no disparen `no-unused-vars`.

Orden **final** de `AddMealTimeUseCase.execute`:

1. `plan = findLatestPlan(petId)`; si es `null`, lanza `NutritionPlanRequiredError(petId)`.
2. Si `plan.mealTimes.includes(mealTime)`, lanza `MealTimeDuplicateError(petId, mealTime)`.
3. Si `plan.mealTimes.length >= MAX_MEALS_PER_DAY`, lanza `MealTimesLimitReachedError(petId)`.
4. `created = insertPlan(copyWithMealTimes(plan, [...plan.mealTimes, mealTime]))`.
5. `audit.record(...)` (D7) y devuelve `created`.

Orden **final** de `MoveMealTimeUseCase.execute`:

1. Sin plan, lanza `NutritionPlanRequiredError`.
2. Si `!plan.mealTimes.includes(from)`, lanza `MealTimeNotInPlanError(petId, from)`.
3. Si `plan.mealTimes.includes(to)`, lanza `MealTimeDuplicateError(petId, to)`.
   Cubre `to === from`, porque `from` está en el plan tras el paso 2.
4. `servedOn = await ownerLocalDay(this.pets, petId, now)`.
5. `created = insertPlanAndMoveServing(copyWithMealTimes(plan, plan.mealTimes.map((t) => (t === from ? to : t))), { servedOn, from, to })`.
6. `audit.record(...)` y devuelve `created`.

Qué trae cada verde:

| Verde | `AddMealTimeUseCase` | `MoveMealTimeUseCase` |
|---|---|---|
| R3 | pasos 1 y 4, y devuelve `created` | — |
| R4 | — | pasos 1 y 5, con `insertPlan(copy…)` en vez del método nuevo |
| R5 | — | pasos 4 y 5, ya con el método nuevo |
| R7 | paso 5 | paso 6 |
| R9 | pasos 2 y 3 | pasos 2 y 3 |

### D7 — Auditoría (G3; R7)

`AuditLogger.record` se llama **después** de que la escritura resuelve; si la
escritura rechaza, la excepción sale antes y no se audita:

- add: `{ userId: input.userId, action: 'meal_time.add', entity: 'nutrition_plan', entityId: created.id, meta: { petId, mealTime } }`;
- move: `{ userId: input.userId, action: 'meal_time.move', entity: 'nutrition_plan', entityId: created.id, meta: { petId, from, to, servedOn } }`.

`servedOn` va en la `meta` porque es el único dato de la transacción que no
está en ninguna fila nueva: dice qué día se movió la servida.

### D8 — Validación estricta solo en los endpoints nuevos (A3; R8)

En `application/dto/meal.dto.ts`, junto a lo existente y sin tocarlo:

- `export const STRICT_MEAL_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;`
- `export const EditMealTimeSchema = z.strictObject({ mealTime: z.string().regex(STRICT_MEAL_TIME_PATTERN, 'mealTime must be a valid HH:MM time') });`
- `export type EditMealTimeDto = z.infer<typeof EditMealTimeSchema>;`

Lo usan el `POST` (la hora a añadir) y el `PATCH` (el destino). El
`:mealTime` de la ruta del `PATCH` no se valida: o está en el plan o es
`MEAL_TIME_NOT_IN_PLAN`. `MEAL_TIME_PATTERN` y `ServeMealSchema` no cambian,
porque #83 ya devuelve `422` para horas que no están en el plan, y cambiarlo
movería candados de #83 sin beneficio.

### D9 — Errores de dominio y mapper (R9)

En `domain/errors/nutrition.errors.ts`, con el molde de las demás clases:

- `MealTimeDuplicateError(petId: string, mealTime: string)`, mensaje
  `` `Meal time ${mealTime} is already in the current plan for pet ${petId}` ``;
- `MealTimesLimitReachedError(petId: string)`, mensaje
  `` `Nutrition plan for pet ${petId} already has the maximum number of meal times` ``.

En `infrastructure/mappers/nutrition-error.mapper.ts`, dos ramas
`instanceof` nuevas, antes del `return`/`throw` final, que devuelven
`UnprocessableEntityException` con los cuerpos exactos de [[requirements]]
§Contrato HTTP. Los mensajes de dominio no se exponen: el cuerpo HTTP es el de
la tabla.

### D10 — Rutas en `NutritionController` (A2; R3, R4, R8, R10)

Las dos rutas cuelgan del `@Controller('pets/:petId')` + `@UseGuards(PetAccessGuard)`
existente. No hace falta un controller nuevo: el guard y `parseBody` ya
están ahí.

| Handler | Decoradores | Cuerpo |
|---|---|---|
| `addMealTime` | `@Post('meal-times')`, `@RequirePetRole('owner')` (R10) | `const dto = parseBody(EditMealTimeSchema, body)` **antes** del `try`; en el `try`, `toNutritionPlanResponse(await this.addMealTimeUseCase.execute({ petId: request.petMembership.petId, mealTime: dto.mealTime, userId: request.user.id }))`; `catch` → `throw mapNutritionError(error)` |
| `moveMealTime` | `@Patch('meal-times/:mealTime')`, `@RequirePetRole('owner')` (R10) | igual, con `@Param('mealTime') from: string`, `const now = new Date()` y `execute({ petId, from, to: dto.mealTime, userId, now })` |

- Los códigos de estado son los de Nest por defecto: `201` en `POST` y `200`
  en `PATCH`, sin `@HttpCode`.
- La respuesta es `toNutritionPlanResponse`, con 11 claves, sin `servedToday`
  ni `kcalConsumedToday` (§Fuera de alcance).
- `request.user.id` sale del mismo `PetAccessRequest` que usa
  `meals.controller.ts`.
- `nutrition.module.ts` añade `AddMealTimeUseCase` y `MoveMealTimeUseCase` a
  `providers`.

`'07:30'` en un segmento de ruta ya funciona: es el mismo caso que
`DELETE …/meals/:mealTime` de #83 (D2 de #83).

### D11 — `MAX_MEALS_PER_DAY = 6` en `nutrition.constants.ts` (A1; R9)

Va junto a los `MEALS_*`. Es el mismo número que el `check` de la base (P5).
Si algún día cambia, cambian los dos y la sonda S15 lo vigila. La base sigue
siendo la red de seguridad: sin el use case, la séptima da `500` (el rojo de
R9).

### D12 — Migración: generada, renombrada y con su tag a mano (R1, R13)

Es el flujo de #83 y #93:

1. Editar el schema.
2. `pnpm db:generate` desde `backend-pet-tracker/`. Lee el `.env` de la raíz
   vía `drizzle.config.ts`; **sin** `export DATABASE_URL`.
3. `git mv` del `.sql` generado a `0018_nutrition_plans_engine_meals.sql`.
4. En `meta/_journal.json`, cambiar solo el `tag` de la entrada nueva a
   `0018_nutrition_plans_engine_meals`; el `when` y `meta/0018_snapshot.json`
   quedan como salen.
5. Nunca `psql` crudo para aplicar ni para «arreglar» el journal.

## Archivos afectados

Lista **cerrada**: el diff desde el commit del handoff solo puede tocar estos.
Uno fuera de la lista se justifica en el impl o se revierte.

### Base de datos (`src/db/`)

- `schema/nutrition.schema.ts` — `engineMealsPerDay` en `nutritionPlans` (R1).
- `schema/nutrition.schema.spec.ts` — describe R1 y la lista de R15 (R1).
- `schema/meal-servings.schema.spec.ts` — el `it` de C8 (R1).
- `migrations/0018_nutrition_plans_engine_meals.sql`,
  `migrations/meta/0018_snapshot.json` y `migrations/meta/_journal.json` —
  nuevos o con su entrada (R1).

### Domain (`src/modules/nutrition/domain/`)

- `entities/nutrition-plan.entity.ts` — prop `engineMealsPerDay` y las tres
  funciones de D3 (R1, R2, R3).
- `entities/nutrition-plan.entity.spec.ts` — **nuevo** (R2, R3).
- `repositories/nutrition.repository.ts` — `MealTimeMove` e
  `insertPlanAndMoveServing` (R5).
- `errors/nutrition.errors.ts` — dos errores (R9).
- `nutrition.constants.ts` — `MAX_MEALS_PER_DAY` (R9).

### Application (`src/modules/nutrition/application/`)

- `dto/meal.dto.ts` — `EditMealTimeSchema` (R3) y su regex (R8).
- `use-cases/generate-nutrition-plan.use-case.ts` — D4 (R1, R2).
- `use-cases/add-meal-time.use-case.ts` y su `.spec.ts` — **nuevos** (R3,
  R7, R9).
- `use-cases/move-meal-time.use-case.ts` y su `.spec.ts` — **nuevos** (R4,
  R5, R7, R9).
- `use-cases/serve-meal.use-case.spec.ts` — solo el fixture (R1).

### Infrastructure (`src/modules/nutrition/infrastructure/`)

- `nutrition.controller.ts` — dos handlers (R3, R4, R8, R10).
- `mappers/nutrition-error.mapper.ts` — dos códigos (R9).
- `repositories/nutrition.drizzle.repository.ts` — `toPlan` (R1) e
  `insertPlanAndMoveServing` (R5, R6).
- `repositories/pet-meals.drizzle-reader.ts` — solo la mutación temporal del
  rojo de R11; **diff neto cero**.
- `../nutrition.module.ts` — providers (R3, R4).

### Tests e2e

- `test/meal-times.e2e-spec.ts` — **nuevo** (R2-R12).

### Docs y harness (fuera de `backend-pet-tracker/`)

- `docs/data-model.md`, `docs/conventions.md`,
  `specs/meals-served-tracking/design.md` — §Docs (R13).
- `specs/meal-schedule-editing/traceability.md` — filas (C5).
- `progress/impl_meal-schedule-editing.md` — reporte de Codex.

## Docs (texto literal, R13)

**`docs/data-model.md`**, fila `nutrition_plans`. En la columna de campos,
tras `` `meal_times jsonb NOT NULL`, `` se inserta
`` `engine_meals_per_day integer NULL`, ``. En la columna de notas, al final
de `sin UNIQUE por hash`, se añade:

> `; las ediciones de horario (#103) insertan una copia con el mismo
> inputs_hash; engine_meals_per_day guarda las comidas que calculo el motor
> (NULL en planes anteriores a 0018, donde vale meals_per_day)`

En la línea que empieza por `Las tablas de nutricion se crean en la migracion`,
antes del punto final, se añade:

> `; ` `` `engine_meals_per_day` en `0018_nutrition_plans_engine_meals.sql` (#103) ``

**`docs/conventions.md`**, sección «LocalStack sigue compartido»:

- "**14 de las 30 suites e2e lo tocan**" → "**14 de las 31 suites e2e lo
  tocan**";
- "Las otras 16 solo tocan Postgres" → "Las otras 17 solo tocan Postgres".

La lista de las 14 no cambia: `meal-times` solo toca Postgres.

**`specs/meals-served-tracking/design.md`**, justo después de la línea que
termina en "Una sola función pura lo decide (D8).", un párrafo nuevo con la
misma sangría de la viñeta:

> **Enmienda #103 (`meal-schedule-editing`)**: mover una franja con
> `PATCH /v1/pets/:petId/meal-times/:mealTime` arrastra la servida de hoy (día
> civil del owner) a la hora nueva en la misma transacción; si el destino ya
> tenía una servida de hoy, gana la del destino y se borra la del origen. Una
> huérfana cuya hora vuelve al plan cuenta otra vez. Lo dicho arriba sigue
> valiendo al regenerar y para los días pasados.

## E2E (`test/meal-times.e2e-spec.ts`)

Molde: `test/meals.e2e-spec.ts`. Se **copian** sus helpers; no se importan,
porque ningún `*.e2e-spec.ts` del repo importa de otro (`test/fixtures/` está
vacío) y esta feature no abre ese patrón.

- Se copian con su misma forma `beforeAll` / `afterAll` (`AppModule`,
  `setGlobalPrefix('v1')`, `DRIZZLE`, `TOKEN_SERVICE`, y el borrado de
  `auditLog`, `pets` y `users` por ids sembrados) y estos helpers:
  `seedUser(label, timezone = 'UTC')`, `seedPet`, `putProfile`, `postWeight`,
  `generatePlan`, `getPlan`, `seedPlan`, `serveMeal`, `unserveMeal` y
  `addMember`.
- **Ampliaciones**, solo las que piden los R:
  - `seedPet(owner, { species })`, con `'dog'` por defecto (R2 gato);
  - `postWeight(user, petId, timezone, weightKg = 20)` (R2 gato, 4 kg);
  - `putProfile(user, petId, overrides = {})` (R2: `kcalPer100g`,
    `activityLevel`);
  - `addMember(petId, userId, role)`, con `'vet'` en la unión de roles (R10).
- **Helpers nuevos**:
  - `addMealTime(user, petId, body)` → `POST …/meal-times`;
  - `moveMealTime(user, petId, from, body)` → `PATCH …/meal-times/:from`;
  - `plansOf(petId)` → filas de `nutrition_plans` de la mascota, por
    `generatedAt` y `id` ascendentes;
  - `servingsOf(petId)` → filas de `meal_servings` de la mascota, por
    `servedOn` y `mealTime`;
  - `insertPlanRow(petId, overrides)` → `db.insert(nutritionPlans)` con
    `id: uuidv7()` (import `uuidv7` de `'uuidv7'`, como en `meals.e2e-spec.ts`);
  - `insertServing(petId, createdBy, servedOn, mealTime)` →
    `db.insert(mealServings)`.
- Los `describe` de nivel superior siguen el orden R2…R12. Cada `it` siembra
  su propio owner y su propia mascota, y no depende de otro `it`.
- «Hoy» en las aserciones = `localDayOf(Date.now(), <zona del owner>)`, igual
  que en `meals.e2e-spec.ts`.

## Aplicación de la migración en dos bases

En el VPS hay dos bases de Postgres: la del árbol principal y la del
worktree de backend. R13 solo cubre la del árbol donde Codex trabaja (la que
mide del `.env`). Tras el merge, el **leader** corre `pnpm db:migrate` en la
otra, y lo anota en `progress/current.md`. No es gate humano: no crea recursos
ni cuesta dinero. Hasta que se aplique, todo lo que lea `nutrition_plans` en
el otro árbol (con el código ya mergeado) falla por columna inexistente. Por
eso va en el cierre, antes de lanzar otra feature allí.

## Alternativas descartadas

- **C: comparar `meals_per_day` sin migración** — falla en los dos sentidos
  (D1), y la usan los dos `it` de R2 como contraejemplo.
- **Fila sombra con el horario editado** (tabla `meal_schedules` aparte que
  `generate` consulta): es una tabla y un join más para guardar lo que la
  copia append-only ya guarda, y rompe P6, porque los lectores tendrían que
  mirar dos sitios.
- **`UPDATE` del plan vigente en sitio**: rompe el append-only de #17 (P1) y
  el historial.
- **`409` cuando el destino ya tiene servida hoy**: el usuario no ve las
  huérfanas, así que no podría resolverlo (G2).
- **Controller nuevo `MealTimesController`**: duplica guard y `parseBody`
  para dos handlers; `NutritionController` ya es dueño del plan.
- **Alias de tabla en el `NOT EXISTS`**: no hace falta, porque el subselect
  no está correlacionado (D5), y el repo no tiene precedente de `alias()`.
- **Validar `:mealTime` de la ruta con la regex**: daría `400` donde #83 da
  `422` para el mismo parámetro, y no añade nada, porque una hora que no está
  en el plan ya es `MEAL_TIME_NOT_IN_PLAN`.
- **Endurecer `MEAL_TIME_PATTERN`**: movería candados de #83 sin cambiar el
  resultado (D8).
