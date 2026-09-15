---
feature: "meals-served-tracking"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[meals-served-tracking]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
>
> Esta spec está escrita para ser **autosuficiente**: quien implemente (Codex
> CLI) no tiene acceso a la conversación que la originó. Toda ruta, símbolo,
> nombre de tabla, columna, código de error y mensaje que aparece aquí es
> literal. Citas `ruta:línea` del commit base `fba736f9`; rutas relativas a
> `backend-pet-tracker/` salvo `docs/`, `specs/`, `progress/`,
> `mobile-pet-tracker/`.

## Decisiones cerradas por el humano (D1-D4)

- **D1 — Backend aquí, móvil en #98** — sirve al criterio 3. Las dos pilas
  viven en sesiones y worktrees distintos (`CLAUDE.md` §Un solo escritor;
  precedente #66 "coordinarla con la sesión que lleva backend"); la parte
  móvil arrastra por sí sola una docena de candados (explore §6: `#70 R3`,
  cardinalidades de `reminders-section-body`, catálogo i18n, 11 fixtures
  `PetProfile`, enmienda #70 de la carta) y un smoke en dev build de Android.
  El "registro + total" que #83 decía inseparable **es** el modelo, y las dos
  piezas de modelo (tabla + `mealsToday`) quedan juntas aquí. #98
  `mobile-meals-served-ui` está en `feature_list.json` con `pending`,
  bloqueada por el merge de #83 y por la migración aplicada en la base que use
  su sesión.

- **D2 — Cualquier miembro activo sirve y deshace** — sirve a R3.
  `MealsController` lleva `@UseGuards(PetAccessGuard)` en la clase y **ningún**
  `@RequirePetRole`, como `GET nutrition-plan` (`nutrition.controller.ts:86-87`)
  y a diferencia de todas las escrituras vecinas (`weights.controller.ts:35-36`,
  `nutrition.controller.ts:44,73`, `vaccines.controller.ts:112`). Motivo: dar
  de comer a la mascota lo hace quien está con ella (`family`, `walker`);
  `created_by` conserva el rastro y la auditoría (R8) nombra al actor. Es una
  **excepción deliberada** al patrón owner-only y se escribe aquí para que el
  reviewer no la lea como omisión.

- **D3 — Idempotencia por índice único; deshacer por franja de hoy** — sirve a
  R5, R7. `uniqueIndex('meal_servings_pet_id_served_on_meal_time_idx')` sobre
  `(pet_id, served_on, meal_time)` (precedente `geofences.schema.ts:65`). El
  segundo toque es `409 MEAL_ALREADY_SERVED`: más fácil de probar que un 200
  idempotente y no esconde un doble envío. `DELETE /v1/pets/:petId/meals/:mealTime`
  actúa sobre `served_on` = hoy del owner: el móvil deshace el badge que acaba
  de pulsar sin pedir ids (no hay `GET /meals`). `HH:MM` es un segmento de
  ruta válido (`:` está permitido en `pchar`, y `path-to-regexp` casa
  `[^/]+`); supertest lo envía tal cual.

- **D4 — Plan regenerado: cuenta solo lo que está en el plan vigente** —
  sirve a R9, R10, R11. `generate` inserta fila nueva solo si cambia el hash
  (`generate-nutrition-plan.use-case.ts:48-49`), y `mealTimes` solo cambia si
  cambia `mealsPerDay` (P2), pero puede pasar a mitad de día. Las servidas
  "huérfanas" quedan guardadas (auditoría, historial) y fuera del conteo, así
  `served ≤ total` siempre. Una sola función pura lo decide (D8).

## Decisiones de esta spec (D5-D12)

### D5 — La tabla vive en `nutrition.schema.ts`; declaración literal (R1)

`files_affected` de #83 apunta a `src/modules/nutrition/` y el plan es dueño de
las franjas: `mealServings` se añade al final de
`src/db/schema/nutrition.schema.ts` (junto a `nutritionPlans`). El barrel
`src/db/schema/index.ts:18` ya reexporta el fichero: **no se toca**. Imports
nuevos en el fichero: `date` y `uniqueIndex` de `drizzle-orm/pg-core`, y
`users` de `./users.schema`.

```ts
export const mealServings = pgTable(
  'meal_servings',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    servedOn: date('served_on').notNull(),
    mealTime: varchar('meal_time', { length: 5 }).notNull(),
    servedAt: timestamp('served_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    uniqueIndex('meal_servings_pet_id_served_on_meal_time_idx').on(
      table.petId,
      table.servedOn,
      table.mealTime,
    ),
    index('meal_servings_created_by_idx').on(table.createdBy),
  ],
);
```

- `served_on date`: día civil del **owner** persistido (patrón
  `activity_daily.date`, `activity.schema.ts:18-20`, D9 de #10). Hace que
  "hoy" sea una igualdad, que la unicidad sea una restricción de base y que
  no haya que reinterpretar filas históricas si el owner cambia de zona.
- `served_at timestamptz DEFAULT now()`: instante real, informativo (no se
  filtra por él). `id` sin default: `uuidv7()` en el repositorio, como
  `weights` (`weight.drizzle.repository.ts:26`) y `nutrition_plans`
  (`nutrition.drizzle.repository.ts:84`).
- Sin índice `(pet_id, served_on)`: el índice único lo cubre como prefijo
  (C2 de [[requirements]]). Sin `check` sobre `meal_time`: la pertenencia al
  plan (R4) es la validación real.
- Migración: `pnpm db:generate` produce `0017_<palabras>.sql` +
  `meta/0017_snapshot.json` + entrada `idx: 17`; se renombra el `.sql` a
  `0017_meal_servings.sql` y el `tag` a `0017_meal_servings` (precedente #93,
  `specs/drop-devices-connectivity-column/tasks.md:96-103`). Si el `.sql`
  trae algo que no sea `CREATE TABLE "meal_servings"`, sus dos `ALTER TABLE
  "meal_servings" ADD CONSTRAINT … FOREIGN KEY`, `CREATE UNIQUE INDEX` y
  `CREATE INDEX`, hay drift ajeno: parar.

### D6 — El cliente manda solo `mealTime`; la fecha la pone el servidor (R2, R6)

```ts
// src/modules/nutrition/application/dto/meal.dto.ts
export const MEAL_TIME_PATTERN = /^\d{2}:\d{2}$/;
export const ServeMealSchema = z.strictObject({
  mealTime: z.string().regex(MEAL_TIME_PATTERN, 'mealTime must be HH:MM'),
});
export type ServeMealDto = z.infer<typeof ServeMealSchema>;
```

`z.strictObject` rechaza `servedOn` o cualquier clave extra (`400`). No se
acepta fecha del cliente **a propósito**: el móvil construye su día con el
reloj del dispositivo (deuda #90) y una fecha enviada obligaría a la
validación "hoy/mañana" de pesos. `servedOn = await ownerLocalDay(pets,
petId, now)` con `now = new Date()` del handler (molde
`weights.controller.ts:42` → `create-weight.use-case.ts:31`). `ownerLocalDay`
degrada a `'UTC'` con `warn` si `users.timezone` no es IANA
(`owner-local-day.ts:23-31`); no se añade validación nueva.

### D7 — Dos use cases lineales, cuatro errores de dominio, orden fijo (R4, R5, R7, R8)

`src/modules/nutrition/domain/errors/nutrition.errors.ts` gana cuatro clases
con el molde de las existentes (`:1-27`):

| Clase | `name` | HTTP (`nutrition-error.mapper.ts`) | `code` | `message` |
|---|---|---|---|---|
| `NutritionPlanRequiredError(petId)` | `NutritionPlanRequiredError` | `422` `UnprocessableEntityException` | `NUTRITION_PLAN_REQUIRED` | `Generate a nutrition plan before serving meals` |
| `MealTimeNotInPlanError(petId, mealTime)` | `MealTimeNotInPlanError` | `422` | `MEAL_TIME_NOT_IN_PLAN` | `mealTime is not part of the current nutrition plan` |
| `MealAlreadyServedError(petId, servedOn, mealTime)` | `MealAlreadyServedError` | `409` `ConflictException` | `MEAL_ALREADY_SERVED` | `Meal already served today` |
| `MealServingNotFoundError(petId, servedOn, mealTime)` | `MealServingNotFoundError` | `404` `NotFoundException` | `MEAL_SERVING_NOT_FOUND` | `Meal serving not found for today` |

Cuerpo `{ statusCode, code, message }` como los cuatro `if` existentes del
mapper (`:14-44`); se añaden cuatro `if` más antes del `return error`.

```ts
// src/modules/nutrition/application/use-cases/serve-meal.use-case.ts
@Injectable()
export class ServeMealUseCase {
  constructor(
    @Inject(NUTRITION_REPOSITORY) private readonly nutrition: NutritionRepository,
    @Inject(MEAL_SERVING_REPOSITORY) private readonly meals: MealServingRepository,
    @Inject(PET_REPOSITORY) private readonly pets: PetRepository,
    @Inject(AUDIT_LOGGER) private readonly audit: AuditLogger,
  ) {}

  async execute(petId: string, dto: ServeMealDto, userId: string, now: Date): Promise<MealServing> {
    const plan = await this.nutrition.findLatestPlan(petId);
    if (!plan) throw new NutritionPlanRequiredError(petId);
    if (!plan.mealTimes.includes(dto.mealTime)) throw new MealTimeNotInPlanError(petId, dto.mealTime);
    const servedOn = await ownerLocalDay(this.pets, petId, now);
    const serving = await this.meals.create({ petId, servedOn, mealTime: dto.mealTime, createdBy: userId });
    await this.audit.record({
      userId, action: 'meal.serve', entity: 'meal_serving', entityId: serving.id,
      meta: { petId, mealTime: serving.mealTime, servedOn: serving.servedOn },
    });
    return serving;
  }
}
```

```ts
// src/modules/nutrition/application/use-cases/unserve-meal.use-case.ts
async execute(petId: string, mealTime: string, userId: string, now: Date): Promise<void> {
  const servedOn = await ownerLocalDay(this.pets, petId, now);
  const deleted = await this.meals.deleteOne(petId, servedOn, mealTime);
  if (!deleted) throw new MealServingNotFoundError(petId, servedOn, mealTime);
  await this.audit.record({
    userId, action: 'meal.unserve', entity: 'meal_serving', entityId: deleted.id,
    meta: { petId, mealTime, servedOn },
  });
}
```

Orden en `serve`: plan → pertenencia → día → insert (409 dentro del
repositorio, D11) → auditoría. `unserve` **no** consulta el plan (R7).
`MealsController` envuelve ambos en `try/catch` → `throw mapNutritionError(error)`
(molde `nutrition.controller.ts:62-68`). `NUTRITION_REPOSITORY`,
`PET_REPOSITORY` (vía `imports: [PetsModule]`, `nutrition.module.ts`) y
`AUDIT_LOGGER` (`@Global()`) ya se resuelven en `NutritionModule`.

### D8 — `servedToday` y `mealsToday` comparten una función pura; el `GET` del plan usa su propio repositorio (R9, R11; C4/C5)

```ts
// src/modules/nutrition/domain/entities/meal-serving.entity.ts
export interface MealServingProps {
  id: string; petId: string; servedOn: string; mealTime: string; servedAt: Date; createdBy: string;
}
export class MealServing implements MealServingProps { /* Object.assign, como PetWeight */ }

/** D4: franjas del plan vigente que ya se sirvieron, en el orden del plan. */
export function servedInPlan(mealTimes: string[], served: string[]): string[] {
  return mealTimes.filter((mealTime) => served.includes(mealTime));
}
```

`mealTimes.filter(...)` da orden del plan y deduplica gratis (R11).

`GetNutritionPlanUseCase` pasa a `execute(petId: string, now: Date): Promise<NutritionPlanToday>`
con `export interface NutritionPlanToday { plan: NutritionPlan; servedToday: string[] }`
(exportado desde el mismo fichero del use case): `plan = findLatestPlan` (404
igual que hoy) → `day = ownerLocalDay(pets, petId, now)` → `served =
meals.listTimesServedOn(petId, day)` → `servedToday = servedInPlan(plan.mealTimes, served)`.
Inyecta además `MEAL_SERVING_REPOSITORY` y `PET_REPOSITORY`. No tiene spec
unitario hoy y no se le añade: R9 lo cubre e2e y R11 cubre el filtro.

Mapper: `nutrition.mapper.ts` gana
`export interface NutritionPlanTodayResponse extends NutritionPlanResponse { servedToday: string[] }`
y `toNutritionPlanTodayResponse({ plan, servedToday })` =
`{ ...toNutritionPlanResponse(plan), servedToday }`. `generate` sigue con
`toNutritionPlanResponse` (11 claves, R19 de #17 intacto). Y
`export interface MealServingResponse { id; petId; servedOn; mealTime; servedAt: string; createdBy }`
+ `toMealServingResponse(serving)` (`servedAt: serving.servedAt.toISOString()`),
en el mismo fichero (no hace falta un mapper nuevo para seis claves).

### D9 — Puerto `PET_MEALS_READER` en pets, adaptador y módulo de solo lectura en nutrition (R10)

Copia exacta del trío `PET_VACCINE_READER` (P4):

```ts
// src/modules/pets/domain/ports/pet-meals-reader.ts
export const PET_MEALS_READER = Symbol('PetMealsReader');
export interface PetMealsToday { served: number; total: number; }
export interface PetMealsReader {
  /** `day` es el dia civil del owner (YYYY-MM-DD); null si la mascota no tiene plan. */
  findMealsToday(petId: string, day: string): Promise<PetMealsToday | null>;
}
```

`src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts`
(`PetMealsDrizzleReader`, `@Inject(DRIZZLE)`): (1) `select({ mealsPerDay,
mealTimes }).from(nutritionPlans).where(eq(petId)).orderBy(desc(generatedAt),
desc(id)).limit(1)` (misma consulta que `findLatestPlan`, proyectada) → sin
fila ⇒ `null`; (2) `select({ mealTime }).from(mealServings).where(and(eq(petId),
eq(servedOn, day)))` → `served = servedInPlan(plan.mealTimes, rows.map(r => r.mealTime)).length`,
`total = plan.mealsPerDay`. Dos consultas, ninguna transacción (lectura).

`src/modules/nutrition/pet-meals-read.module.ts`: `providers: [{ provide:
PET_MEALS_READER, useClass: PetMealsDrizzleReader }]`, `exports:
[PET_MEALS_READER]`. `PetsModule` lo importa (junto a `PetVaccineReadModule`,
`pets.module.ts:26-31`). No hay ciclo: el módulo nuevo no importa
`PetsModule` ni `NutritionModule`, y sus imports TS (`@/db/schema/nutrition.schema`,
`@/modules/pets/domain/ports/pet-meals-reader`) no vuelven a `pets.module.ts`.

`GetPetUseCase`: quinto parámetro `@Inject(PET_MEALS_READER) private readonly
mealsReader: PetMealsReader`; `PetProfile` gana `mealsToday: PetMealsToday | null`;
`execute` devuelve `mealsToday: await this.mealsReader.findMealsToday(petId, today)`
con el `today` ya calculado en `:69`. `pets.controller.ts:101-113` destructura
`mealsToday` y lo pasa como **séptimo** argumento; `toPetProfileResponse`
gana `mealsToday: PetMealsToday | null = null` como último parámetro y la
clave `mealsToday` en `PetProfileResponse` (tras `nextVaccine`, con el
comentario `/** { served, total } del dia del owner (#83 R10) o null sin plan. */`).
El listado (`:85-87`) no cambia: el default `null` pone la clave.

### D10 — Sin e2e permanente contra `information_schema`; migración en dos bases (R12)

Igual que #93 D5: un test que consulte la base sería rojo en toda máquina sin
migrar y en `pet_tracker` hasta que se migre tras el merge. Los candados
permanentes son `getTableConfig(mealServings)` y el contenido del `.sql`
(R1); la aplicación real se verifica **una vez** con `docker exec … psql` y
queda en el impl (R12). Operativa en §Aplicación de la migración en dos bases.

### D11 — 409 sin parsear errores de pg: `onConflictDoNothing` + `returning` (R5)

```ts
// MealServingDrizzleRepository.create
const [row] = await this.db
  .insert(mealServings)
  .values({ id: uuidv7(), ...data })
  .onConflictDoNothing({ target: [mealServings.petId, mealServings.servedOn, mealServings.mealTime] })
  .returning();
if (!row) throw new MealAlreadyServedError(data.petId, data.servedOn, data.mealTime);
return toDomain(row);
```

Con `ON CONFLICT DO NOTHING`, `RETURNING` devuelve cero filas en el choque:
no hay que desenvolver `cause` ni comparar `constraint` (`geofence.drizzle.repository.ts:174-189`
hace eso porque necesita distinguir **qué** índice chocó; aquí solo hay uno).
El repositorio traduce a error de dominio, como hace geofences
(`geofence.repository.ts:40`). `deleteOne(petId, servedOn, mealTime)`:
`delete(mealServings).where(and(eq, eq, eq)).returning()` → `row ? toDomain(row) : null`.
`listTimesServedOn(petId, servedOn)`: `select({ mealTime }).where(and(eq, eq))`
→ `string[]`.

### D12 — Respuestas: `201` con seis claves, `204` vacío (R2, R7)

`@Post()` sin `@HttpCode` responde `201` (default de Nest para POST, como
`weights.controller.ts:35`). `@Delete(':mealTime') @HttpCode(HttpStatus.NO_CONTENT)`
con `@Param('mealTime') mealTime: string`, molde `vaccines.controller.ts:110-125`.
Sin validación del param: cualquier valor que no coincida con una fila de hoy
es `404` (R7); validarlo sería una segunda regla para el mismo resultado.
`createdBy` va en la respuesta para que D2 sea observable por API (el e2e de
R3 no necesita leer la base).

## Estructura de capas

```
src/db/schema/nutrition.schema.ts                              [editado: + mealServings]           infrastructure (schema compartido)
src/db/schema/meal-servings.schema.spec.ts                     [nuevo]                             test
src/db/migrations/0017_meal_servings.sql + meta/0017_snapshot.json + meta/_journal.json  [generados; .sql y tag renombrados]
src/modules/nutrition/domain/entities/meal-serving.entity.ts   [nuevo: MealServing, servedInPlan]  domain
src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts [nuevo]                          test
src/modules/nutrition/domain/errors/nutrition.errors.ts        [editado: + 4 errores]              domain
src/modules/nutrition/domain/repositories/meal-serving.repository.ts [nuevo: token + interface]    domain
src/modules/nutrition/application/dto/meal.dto.ts              [nuevo]                             application
src/modules/nutrition/application/use-cases/serve-meal.use-case.ts (+ .spec.ts)   [nuevos]         application
src/modules/nutrition/application/use-cases/unserve-meal.use-case.ts (+ .spec.ts) [nuevos]         application
src/modules/nutrition/application/use-cases/get-nutrition-plan.use-case.ts [editado: now, servedToday] application
src/modules/nutrition/infrastructure/repositories/meal-serving.drizzle.repository.ts [nuevo]        infrastructure
src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts        [nuevo]        infrastructure
src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts       [editado: + 2 tipos, 2 fns] infrastructure
src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts [editado: + 4 if]           infrastructure
src/modules/nutrition/infrastructure/meals.controller.ts               [nuevo]                     infrastructure
src/modules/nutrition/infrastructure/nutrition.controller.ts           [editado: latestPlan]       infrastructure
src/modules/nutrition/pet-meals-read.module.ts                         [nuevo]                     módulo
src/modules/nutrition/nutrition.module.ts                              [editado]                   módulo
src/modules/pets/domain/ports/pet-meals-reader.ts                      [nuevo]                     domain
src/modules/pets/application/use-cases/get-pet.use-case.ts (+ .spec.ts) [editados]                 application
src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts (+ .spec.ts) [editados]     infrastructure
src/modules/pets/infrastructure/pets.controller.ts (+ .spec.ts)        [editados]                  infrastructure
src/modules/pets/pets.module.ts                                        [editado: import]           módulo
test/meals.e2e-spec.ts                                                 [nuevo]                     e2e
test/pets.e2e-spec.ts, devices.e2e-spec.ts, device-subscriptions.e2e-spec.ts, pet-lost-mode.e2e-spec.ts [una lista cada uno]
test/nutrition.e2e-spec.ts                                             [una línea: :478]
```

Regla de dependencia: `domain` de nutrition no importa nada de framework;
`application` importa solo puertos (`NUTRITION_REPOSITORY`,
`MEAL_SERVING_REPOSITORY`, `PET_REPOSITORY`, `AUDIT_LOGGER`) y
`ownerLocalDay` (application de pets, ya usado por health); `infrastructure`
implementa `MealServingRepository` y `PetMealsReader`. El puerto de pets no
importa de nutrition (`pets/domain/ports` solo tipos propios).

## Archivos afectados (lista cerrada; nada fuera de ella)

**Nuevos**

- `src/db/schema/meal-servings.schema.spec.ts` — R1.
- `src/db/migrations/0017_meal_servings.sql`, `src/db/migrations/meta/0017_snapshot.json` — generados (R1). El número es el siguiente al journal.
- `src/modules/nutrition/domain/entities/meal-serving.entity.ts` — `MealServingProps`, `MealServing`, `servedInPlan` (D8).
- `src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts` — R11.
- `src/modules/nutrition/domain/repositories/meal-serving.repository.ts` — `MEAL_SERVING_REPOSITORY = Symbol('MealServingRepository')`, `NewMealServing { petId; servedOn; mealTime; createdBy }`, `MealServingRepository { create(data): Promise<MealServing>; deleteOne(petId, servedOn, mealTime): Promise<MealServing | null>; listTimesServedOn(petId, servedOn): Promise<string[]> }`.
- `src/modules/nutrition/application/dto/meal.dto.ts` — D6.
- `src/modules/nutrition/application/use-cases/serve-meal.use-case.ts` (+ `.spec.ts`: R4, R8, y el día del owner de R2) — D7.
- `src/modules/nutrition/application/use-cases/unserve-meal.use-case.ts` (+ `.spec.ts`: R7, R8) — D7.
- `src/modules/nutrition/infrastructure/repositories/meal-serving.drizzle.repository.ts` — `MealServingDrizzleRepository` (D11).
- `src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts` — `PetMealsDrizzleReader` (D9).
- `src/modules/nutrition/infrastructure/meals.controller.ts` — `MealsController` en `@Controller('pets/:petId/meals')`, `@UseGuards(PetAccessGuard)`, `@Post() serve(@Req(), @Body())`, `@Delete(':mealTime') @HttpCode(HttpStatus.NO_CONTENT) unserve(@Req(), @Param('mealTime'))`; `parseBody`/`validationError` copiados de `nutrition.controller.ts:100-117` (el proyecto los repite por controller a propósito).
- `src/modules/nutrition/pet-meals-read.module.ts` — `PetMealsReadModule` (D9).
- `src/modules/pets/domain/ports/pet-meals-reader.ts` — D9.
- `test/meals.e2e-spec.ts` — R2-R10 (§E2E).

**Modificados**

- `src/db/schema/nutrition.schema.ts` — + `mealServings` (D5) e imports `date`, `uniqueIndex`, `users`.
- `src/db/migrations/meta/_journal.json` — entrada `idx: 17`, `tag` renombrado.
- `src/modules/nutrition/domain/errors/nutrition.errors.ts` — + 4 clases (D7).
- `src/modules/nutrition/application/use-cases/get-nutrition-plan.use-case.ts` — `execute(petId, now)`, `NutritionPlanToday`, dos puertos más (D8).
- `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` — + `NutritionPlanTodayResponse`, `toNutritionPlanTodayResponse`, `MealServingResponse`, `toMealServingResponse` (D8).
- `src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts` — + 4 `if` (D7).
- `src/modules/nutrition/infrastructure/nutrition.controller.ts` — `latestPlan`: `toNutritionPlanTodayResponse(await this.getPlan.execute(petId, new Date()))`.
- `src/modules/nutrition/nutrition.module.ts` — `controllers: [NutritionController, MealsController]`; `providers` + `ServeMealUseCase`, `UnserveMealUseCase`, `{ provide: MEAL_SERVING_REPOSITORY, useClass: MealServingDrizzleRepository }`.
- `src/modules/pets/pets.module.ts` — `imports` + `PetMealsReadModule` (`@/modules/nutrition/pet-meals-read.module`).
- `src/modules/pets/application/use-cases/get-pet.use-case.ts` — D9.
- `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts` — R10 (`buildDeps`, diez constructores, describe nuevo).
- `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts` — clave y parámetro `mealsToday` (D9).
- `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts` — R10.
- `src/modules/pets/infrastructure/pets.controller.ts` — `detail` pasa `mealsToday`.
- `src/modules/pets/infrastructure/pets.controller.spec.ts` — R10 (`:164-191`, `:195`).
- `test/pets.e2e-spec.ts:64-89`, `test/devices.e2e-spec.ts:794-820`, `test/device-subscriptions.e2e-spec.ts:328-352`, `test/pet-lost-mode.e2e-spec.ts:29-54` — + `'mealsToday'` (R10).
- `test/nutrition.e2e-spec.ts:478` — R9.
- `docs/data-model.md:37,63,68` — R1 (§Docs).
- `docs/conventions.md:295,303` — R12.
- `specs/meals-served-tracking/traceability.md` — tras cada commit.
- `progress/impl_meals-served-tracking.md` — evidencias R1 (salida de `db:generate`), R12 (salidas a-g, e2e, `init.sh`).

**No se tocan**: `src/db/schema/index.ts`, `src/modules/pets/domain/repositories/pet.repository.ts`, `pet.drizzle.repository.ts`, `generate-nutrition-plan.use-case.ts`, `nutrition.drizzle.repository.ts`, `nutrition.repository.ts`, `app.module.ts`, `init.sh`, `init.config.sh`, `.env.example`, `docs/ui-guidelines.md`, migraciones y snapshots `0000`…`0016`, `src/workers/**`, `mobile-pet-tracker/**`. Sin dependencias ni env nuevas.

## Docs (texto literal, R1)

`docs/data-model.md`, ERD, tras `:37` (`pets ||--o{ nutrition_plans : "has"`):

```
  pets ||--o{ meal_servings : "has"
```

Tabla de Postgres, fila nueva tras `nutrition_plans` (`:63`):

```
| `meal_servings` | `id uuid PK` (UUIDv7 en app), `pet_id uuid FK NOT NULL`, `served_on date NOT NULL` (día civil del **owner**, patrón `activity_daily`), `meal_time varchar(5) NOT NULL`, `served_at timestamptz NOT NULL DEFAULT now()`, `created_by uuid FK users NOT NULL` | `meals-served-tracking` (#83, migración `0017`). Índice único `(pet_id, served_on, meal_time)`: una franja se sirve una vez por día (409) y cubre `pet_id` como prefijo, sin índice manual aparte; `created_by` sí lleva índice. Cualquier miembro activo escribe (D2 de #83); `served_on` no se recomputa si el owner cambia de zona (D9 de #10) |
```

`:68`: `Las tablas de nutricion se crean en la migracion \`0013_wet_may_parker.sql\`.`
→ `Las tablas de nutricion se crean en la migracion \`0013_wet_may_parker.sql\`; \`meal_servings\` en \`0017_meal_servings.sql\` (#83).`

(Si el journal ya no fuera `0016` al implementar, el número real sustituye a
`0017` en las tres líneas; R1 no fija la cifra, fija "la siguiente".)

## E2E: fixtures de `test/meals.e2e-spec.ts` (R2-R10)

Cabecera y ciclo de vida copiados de `test/health-weights.e2e-spec.ts:18-113`:
`runId`, `userIds`, `petIds`, `api()`, `auth()`, `seedUser(label, timezone =
'UTC')` (email `meals-${label}-${runId}@example.com`), `seedPet(owner)` con el
body de `nutrition.e2e-spec.ts:57-62` (`birthDate: '2021-01-15'`,
`sterilized: true` ⇒ adulto ⇒ `mealsPerDay: 2`, `mealTimes: ['07:30','19:30']`,
como R19 de #17), `beforeAll`/`afterAll` idénticos (borrar `auditLog` por
`userIds`, `pets` por `petIds` —cascade a `meal_servings`, `nutrition_*`,
`weights`, `pet_users`—, `users`). Imports: `mealServings`, `nutritionPlans`
de `@/db/schema/nutrition.schema`; `pets`, `petUsers`; `auditLog`; `users`;
`localDayOf`, `shiftDay` de `@/pipeline/local-day`; `uuidv7`.

Helpers propios:

- `putProfile(user, petId)` = `PUT nutrition-profile { activityLevel: 'medium', foodType: 'dry', kcalPer100g: 350 }` (`nutrition.e2e-spec.ts:69-77`).
- `postWeight(user, petId, timezone = 'UTC')` = `POST weights { weightKg: 20, measuredAt: localDayOf(Date.now(), timezone) }` — **día del owner**, no `toISOString().slice(0,10)` como `nutrition.e2e-spec.ts:79-83`: con `Pacific/Pago_Pago` el día UTC puede ser mañana para el owner y #89 responde `400`.
- `generatePlan(user, petId)` = `POST nutrition-plan/generate` (`:85-88`).
- `seedPlan(owner, petId, timezone = 'UTC')` = `putProfile` + `postWeight` + `generatePlan` → body del plan.
- `serveMeal(user, petId, body)` = `POST /v1/pets/${petId}/meals`.
- `unserveMeal(user, petId, mealTime)` = `DELETE /v1/pets/${petId}/meals/${mealTime}`.
- `getPlan(user, petId)`, `getProfile(user, petId)`, `listPets(user)`.
- `addMember(petId, userId, role)` = `db.insert(petUsers).values({ petId, userId, role, status: 'active' })`.
- `servingsOf(petId)` = `db.select().from(mealServings).where(eq(mealServings.petId, petId))`.

Un `describe` por R-id (R2-R10), títulos exactos de [[requirements]]. La
suite solo escribe en Postgres: no necesita aviso a la sesión Frontend por
LocalStack; sí el `pgrep` de cabecera de [[tasks]] antes de `pnpm test:e2e`.

## Alternativas descartadas

- **Contador `(pet_id, day, count)` con upsert**: `food.tsx` pinta badge por
  franja (`meal-served-<index>`); el contador no sabe qué franja se sirvió.
- **Solo `served_at timestamptz` y `localDayRange` en cada lectura**: la
  unicidad por día dejaría de ser una restricción de base y cada lectura
  tendría que reinterpretar la zona del owner (D5).
- **Índice `(pet_id, served_on)` además del único** (encargo): redundante,
  prefijo del índice único (C2).
- **`onConflictDoNothing` → `200` con la fila existente** (idempotente):
  D3 cerró `409`.
- **Traducir `23505` con `findPgError` como geofences**: más código para
  distinguir un único índice; `RETURNING` vacío ya lo dice (D11).
- **`DELETE /meals/:id`**: obliga al móvil a un `GET` previo o a guardar ids
  por franja; `:mealTime` sobre hoy es lo que el botón necesita (D3).
- **Validar `:mealTime` con la regex en el `DELETE`** (400): mismo resultado
  observable que `404` con una regla más (D12).
- **`servedToday` por el puerto `PET_MEALS_READER` en el `GET` del plan**
  (encargo): relee el plan dentro del adaptador; el use case ya lo tiene (C4).
- **`servedToday` también en `generate`** (misma forma en ambos verbos, como
  #15 D3): allí eran dos verbos del **mismo recurso**; aquí `generate` es un
  comando y el `GET` una vista del día. Costaría dos puertos más en
  `GenerateNutritionPlanUseCase`; R19 de #17 queda intacto así (C5).
- **`mealsToday` en el listado `GET /v1/pets`**: N+1 (#66 D4).
- **Añadir `findMealsToday` a `PetRepository` o a `NutritionRepository`**:
  el primero rompe `MockOf<PetRepository>` ×3 (P6); el segundo mezclaría la
  lectura del perfil con el repositorio del plan. El puerto en pets + adaptador
  en nutrition es el patrón vigente (P4).
- **Spec unitario para `GetNutritionPlanUseCase` y para el lector Drizzle**:
  el use case son cuatro líneas cubiertas por R9 e2e; los repositorios Drizzle
  se cubren en e2e por convención (`docs/conventions.md:148-149`).
- **`@RequirePetRole('owner')` en meals**: D2.
- **E2E que consulte `information_schema`**: D10.

## Aplicación de la migración en dos bases — operativa, fuera del alcance de Codex

**Base propia `pet_tracker_wt` (este worktree)**: la aplica Codex en R12 con
`pnpm db:migrate` desde `backend-pet-tracker/` (`.env` del worktree →
`localhost:5433/pet_tracker_wt`). Nadie más la usa: sin aviso ni gate. Nunca
`psql` crudo (`docs/conventions.md:316-339`).

**Base compartida `pet_tracker` (tree principal `/home/claude/sites/Pet-Tracker`,
sesión Frontend)**: la aplica el leader o el humano **después** del merge de
#83 a `main`, desde `/home/claude/sites/Pet-Tracker/backend-pet-tracker/`
(cuyo `.env` apunta a `pet_tracker`):

1. Comprobar el journal: `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"` → el `max` debe ser el `when` de `0016_drop_devices_connectivity` (journal reparado y `0016` aplicada el 2026-09-15, memoria `journal-migraciones-desincronizado-vps`). Si no cuadra, **parar**: reparar antes con el procedimiento de `specs/drop-devices-connectivity-column/design.md` §Aplicación en el Postgres compartido.
2. `pnpm db:migrate` → aplica solo `0017_meal_servings`.
3. Comprobar `count + 1` y `select count(*) from information_schema.tables where table_schema='public' and table_name='meal_servings'` → `1`.
4. Segundo `pnpm db:migrate`: exit 0, mismo recuento.

Es **aditiva**: no rompe al tree principal aunque su código no declare la
tabla (Drizzle pide columnas por nombre), así que no aplica el aviso de
"Migraciones destructivas" (`docs/conventions.md:341-347`); aun así se aplica
tras el merge para no dejar la base compartida por delante de `main`. #98 la
necesita aplicada en la base de su sesión antes de su smoke. Cualquier otra
máquina (Windows del humano) la aplica igual con `pnpm db:migrate`.
