---
feature: "meals-served-tracking"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[meals-served-tracking]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` #83 (`description` + 4 `acceptance_criteria`),
> `progress/explore_meals-served-tracking.md` (informe del 2026-09-15) y las
> cuatro decisiones que el humano cerró antes de esta spec (D1-D4, tabla
> abajo). Toda cita `ruta:línea` se re-verificó contra este árbol (§0); las
> que no cuadraban con el explore o con el encargo se corrigen en §0.2 y el
> implementador construye sobre la versión corregida.
>
> Feature **backend puro** (`backend-pet-tracker/`): suites `pnpm test`
> (unit), `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test:e2e` (Postgres;
> la suite nueva **no toca LocalStack**). No toca `mobile-pet-tracker/` ni
> `docs/ui-guidelines.md`: la parte móvil es la feature **#98**
> `mobile-meals-served-ui`, bloqueada por esta (D1). **Una migración** (la
> siguiente al journal, `0017` a fecha de hoy), cero dependencias nuevas,
> cero variables de entorno nuevas.
>
> Depende de: `nutrition-profile-engine` (#17, `done`): tabla
> `nutrition_plans`, `findLatestPlan`, `GET /v1/pets/:petId/nutrition-plan`;
> `health-weights` (#15, `done`): plantilla de registro por día con
> `created_by`, auditoría y e2e; `dto-dates-owner-timezone` (#89, `done`):
> `ownerLocalDay`; `pets-list-response-enrichment` (#66, `done`): D4 "el
> listado no se enriquece".
>
> Rutas relativas a `backend-pet-tracker/` salvo que empiecen por `docs/`,
> `specs/`, `progress/` o `mobile-pet-tracker/`; `test/` es
> `backend-pet-tracker/test/`. Toda cita `ruta:línea` es del commit base
> `fba736f9` (= `main` `1b9efe86` + el explore), branch
> `feature/83-meals-served-tracking`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. **Postgres de este worktree =
> base propia `pet_tracker_wt`** (`localhost:5433`, `DATABASE_URL` del `.env`
> gitignorado del worktree; `drizzle.config.ts:17` la carga sola). La base
> compartida `pet_tracker` es del tree principal (sesión Frontend, #97) y
> **Codex no la toca** ([[design]] §Aplicación de la migración en dos bases).

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Veredicto | Evidencia leída |
|---|---|---|---|
| P1 | El plan vigente es `findLatestPlan` y lleva `mealsPerDay` + `mealTimes` | **cierta** | `src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts:71-79` (`orderBy(desc(generatedAt), desc(id)).limit(1)`); entidad `src/modules/nutrition/domain/entities/nutrition-plan.entity.ts:12-13`; columnas `src/db/schema/nutrition.schema.ts:81-82` |
| P2 | `mealTimes.length === mealsPerDay` siempre | **cierta por construcción** | `src/modules/nutrition/domain/nutrition-engine.ts:159` (`mealTimes: [...MEAL_TIMES_BY_COUNT[mealsPerDay]]`) sobre `nutrition.constants.ts:39-45` (2 → 2 horas, 3 → 3, 4 → 4). Por eso `served ≤ total` con `total = mealsPerDay` (R10) |
| P3 | El día civil del owner ya tiene helper y el perfil ya lo calcula | **cierta** | `src/modules/pets/application/owner-local-day.ts:7-16`; `src/modules/pets/application/use-cases/get-pet.use-case.ts:69` (`today = await ownerLocalDay(this.pets, petId, now)`); `src/modules/health/application/use-cases/create-weight.use-case.ts:31` |
| P4 | El patrón lector-de-otro-módulo para el perfil existe y se copia tal cual | **cierta** | puerto `src/modules/pets/domain/ports/pet-vaccine-reader.ts:1-12`; adaptador `src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts:11-34`; módulo `src/modules/health/pet-vaccine-read.module.ts:5-11`; `src/modules/pets/pets.module.ts:26-31` lo importa; `get-pet.use-case.ts:51-52,75` lo inyecta y lo usa |
| P5 | `PetAccessGuard` sin `@RequirePetRole` deja pasar a cualquier miembro activo | **cierta** | `src/modules/pets/infrastructure/guards/pet-access.guard.ts:57,67-76` (R12 de #5); `src/modules/nutrition/infrastructure/nutrition.controller.ts:86-87` (`GET nutrition-plan` ya va así) |
| P6 | No hay `MockOf<NutritionRepository>` ni de `WeightRepository`; sí de `PetRepository` | **cierta** | `grep -rn 'MockOf<' src --include='*.spec.ts'`: `PetRepository` ×3 (`src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts:109,208,215`), ninguno de nutrición. Esta spec **no toca `PetRepository`** |
| P7 | Los dobles de `GetPetUseCase` son parciales y el constructor tiene 4 puertos | **cierta** | `get-pet.use-case.spec.ts:36-60` (`buildDeps`) y **diez** construcciones `new GetPetUseCase(` (`:65,83,107,127,143,163,186,219,238,257`). Un quinto parámetro las rompe en `tsc` |
| P8 | El fixture e2e para tener un plan es perfil + peso + generate | **cierta** | `test/nutrition.e2e-spec.ts:69-88` (`putProfile`, `postWeight`, `generatePlan`); R22/R23 (`:361-435`) prueban que faltando uno no hay plan |
| P9 | `seedUser(label, timezone)` y el caso Kiritimati/Pago_Pago existen | **cierta** | `test/health-weights.e2e-spec.ts:40-59`, `:403-436`; `afterAll` borra `auditLog`, `pets`, `users` (`:102-113`) |
| P10 | Precedente de 204 y de 409 con `code` | **cierta** | `src/modules/health/infrastructure/vaccines.controller.ts:110-111` (`@Delete(':vaccineId') @HttpCode(HttpStatus.NO_CONTENT)`); `src/modules/geofences/infrastructure/mappers/geofence-error.mapper.ts:23-29` (`ConflictException({ statusCode, code, message })`) |
| P11 | Precedente de UNIQUE compuesto en el schema | **cierta** | `src/db/schema/geofences.schema.ts:65` (`uniqueIndex('geofences_pet_id_name_idx').on(table.petId, table.name)`) |
| P12 | Formato de auditoría `<entidad>.<verbo>` y molde | **cierta** | `src/audit/audit-log.repository.ts:3-11`; acciones vigentes (`grep "action: '"`): `weight.create`, `vaccine.delete`, `geofence.create`… → `meal.serve` / `meal.unserve` encajan |
| P13 | Migración: la siguiente al journal es `0017` y se renombra como #93 | **cierta** | `src/db/migrations/` termina en `0016_drop_devices_connectivity.sql`; `meta/_journal.json` última entrada `idx: 16`, `tag: "0016_drop_devices_connectivity"`; precedente `specs/drop-devices-connectivity-column/tasks.md:96-103` |
| P14 | `nutrition.schema.spec.ts` localiza su migración por contenido | **cierta** | `src/db/schema/nutrition.schema.spec.ts:8-19` (`CREATE TABLE "nutrition_profiles"`): una tabla nueva en `nutrition.schema.ts` y una migración `0017` no lo tocan |
| P15 | Hoy hay 29 suites e2e, 14 tocan LocalStack | **cierta** | `ls test/*.e2e-spec.ts \| wc -l` → `29`; `docs/conventions.md:295-303` |
| P16 | Los clientes móviles no validan las claves de forma exhaustiva | **cierta** | `mobile-pet-tracker/src/api/pets.ts:48-55` (`isPetProfile`: solo `id` y `name`); `mobile-pet-tracker/src/api/nutrition.ts:103-106` (`isObjectBody`). Añadir `mealsToday` y `servedToday` en el backend **no rompe** al móvil ya desplegado; #98 tipa y consume |

### §0.2 Premisas corregidas (el implementador no construye sobre la versión anterior)

| # | Premisa (origen) | Corrección | Evidencia |
|---|---|---|---|
| C1 | "Las **cuatro** listas de claves del perfil" (encargo del leader; explore §6) | Son **seis**: `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts:37-64`, `src/modules/pets/infrastructure/pets.controller.spec.ts:164-191`, `test/pets.e2e-spec.ts:64-89`, `test/devices.e2e-spec.ts:795-820`, `test/device-subscriptions.e2e-spec.ts:328-352`, **`test/pet-lost-mode.e2e-spec.ts:29-54`**. Más las aserciones de `null` por defecto en `pet-profile-response.mapper.spec.ts:67-74` y `pets.controller.spec.ts:192-195`. Todas en R10 | `grep -rn "'nextVaccine'" src test` |
| C2 | Índices `(pet_id, served_on)` **y** `created_by` (encargo; explore §7b) | El índice `(pet_id, served_on)` es **redundante**: el UNIQUE `(pet_id, served_on, meal_time)` se materializa como índice único y cubre `pet_id` y `(pet_id, served_on)` como prefijo. Mismo criterio que `activity_daily` ("la PK compuesta ya lo cubre como primera columna", `src/db/schema/activity.schema.ts:27-28`, `docs/data-model.md:66`). Se declara **solo** `created_by` (regla "toda FK lleva índice", `docs/data-model.md:70`) | `activity.schema.ts:27-28` |
| C3 | Ruta `nutrition-error.mapper.ts` "en `src/modules/nutrition/infrastructure/`" (explore §3) | Vive en `src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts` (`:13-47`) | `find src/modules/nutrition -type f` |
| C4 | "`servedToday` del mismo puerto `PET_MEALS_READER`" (encargo) | El `GET nutrition-plan` ya tiene el plan en la mano (`get-nutrition-plan.use-case.ts:15`); pasarlo por el lector de pets obligaría a **releer el plan** dentro del adaptador. `servedToday` sale de `MealServingRepository.listTimesServedOn` (repositorio propio del módulo) filtrado con la **misma función pura** `servedInPlan` que usa el adaptador del perfil (R11). Un solo punto de verdad para D4, una consulta menos | [[design]] D8 |
| C5 | Añadir `servedToday` a `NutritionPlanResponse` (encargo, "el shape de `NutritionPlanResponse` y sus tests") | `test/nutrition.e2e-spec.ts:295-309` (R19 de #17) congela las **11 claves del `generate`** y `:478` (R24) compara `GET` con `generate` por `toEqual`. Se añade la clave **solo al `GET`** vía un tipo derivado `NutritionPlanTodayResponse`; R19 queda intacto y R24 se mueve **una línea** (delta declarado en R9). Meter la clave en `generate` obligaría a inyectar dos puertos más en `GenerateNutritionPlanUseCase` para una respuesta que ningún cliente lee | [[design]] D8 |
| C6 | Explore §7e: "409 o 200 con la fila existente" | Cerrado por el humano: **409** (D3). Y el orden de comprobación importa: el plan se valida **antes** que la unicidad, así que una franja servida hoy que ya **no** está en el plan regenerado responde `422 MEAL_TIME_NOT_IN_PLAN`, no `409` (R4, R5, D4) | — |
| C7 | Explore §3: "`GET /v1/pets/:petId` … `pets.controller.ts:91-117`" | Cierto, y el **listado** (`:78-88`) llama al mismo mapper con `photoUrl` y sin `nextVaccine`: la clave nueva `mealsToday` sale **presente y `null`** en el listado por el default del mapper, igual que `nextVaccine` (#66 D4: sin N+1). R10 lo fija | `src/modules/pets/infrastructure/pets.controller.ts:85-87`, `pet-profile-response.mapper.ts:56-59` |

---

## Decisiones cerradas por el humano (no se reabren; detalle en [[design]])

| Id | Decisión | Detalle en |
|---|---|---|
| **D1** | **#83 = backend.** Botón por franja en `food.tsx` y barra en la Home van en **#98** `mobile-meals-served-ui` (`feature_list.json`), bloqueada por el merge de esta y por la migración aplicada. El criterio 4 de #83 ("smoke con una mascota con plan") se cierra aquí con `curl` (§Gate humano); el smoke con la barra pintada pasa a #98 | [[design]] D1 |
| **D2** | **Cualquier miembro activo sirve y deshace.** `MealsController` va con `@UseGuards(PetAccessGuard)` y **sin** `@RequirePetRole`; `created_by` guarda quién. Es una **excepción explícita** al patrón owner-only de `weights.controller.ts:35-36` y `nutrition.controller.ts:44,73`: dar de comer al perro lo hace quien esté en casa | [[design]] D2 |
| **D3** | **Idempotencia por UNIQUE.** `(pet_id, served_on, meal_time)` único; el segundo toque en la misma franja del mismo día responde `409 MEAL_ALREADY_SERVED`. Entra `DELETE …/meals/:mealTime` para deshacer la franja de **hoy** sin consulta previa de ids | [[design]] D3 |
| **D4** | **Plan regenerado.** `served`/`servedToday` cuentan **solo** las filas cuyo `meal_time` pertenece a `mealTimes` del plan vigente (`findLatestPlan`); las demás quedan guardadas y fuera del conteo; `served` nunca supera `total` (= `mealsPerDay`, P2) | [[design]] D4, R11 |

Decisiones de esta spec (D5-D12) en [[design]]; firmar el gate sin editar = aceptarlas.

---

## Contrato HTTP (resumen; el detalle normativo está en cada R)

| Verbo y ruta | Guard | Éxito | Errores propios |
|---|---|---|---|
| `POST /v1/pets/:petId/meals` body `{ mealTime: 'HH:MM' }` | `PetAccessGuard`, cualquier rol activo | `201` `{ id, petId, servedOn, mealTime, servedAt, createdBy }` | `400` body inválido; `422 NUTRITION_PLAN_REQUIRED`; `422 MEAL_TIME_NOT_IN_PLAN`; `409 MEAL_ALREADY_SERVED` |
| `DELETE /v1/pets/:petId/meals/:mealTime` | ídem | `204` sin body | `404 MEAL_SERVING_NOT_FOUND` |
| `GET /v1/pets/:petId/nutrition-plan` (existente) | ídem | `200` + clave nueva `servedToday: string[]` | sin cambios (`404 NUTRITION_PLAN_NOT_FOUND`) |
| `POST /v1/pets/:petId/nutrition-plan/generate` (existente) | sin cambios | **sin** `servedToday` (R19 de #17 intacto) | sin cambios |
| `GET /v1/pets/:petId` (existente) | ídem | `200` + clave nueva `mealsToday: { served, total } \| null` | sin cambios |
| `GET /v1/pets` (existente) | — | `mealsToday: null` en cada elemento (clave presente) | sin cambios |

Los `404`/`403` del guard preceden a todo lo anterior (R3). Cuerpo de los errores de dominio: `{ statusCode, code, message }` (molde `nutrition-error.mapper.ts:13-47`); cuerpo del `400`: `{ statusCode: 400, message: 'Validation failed', errors: [{ path, message }] }` (`nutrition.controller.ts:106-117`).

---

## Requisitos funcionales

### R1 — tabla `meal_servings`, migración nueva y fila en `docs/data-model.md`

**WHEN** se ejecuta `pnpm db:generate` desde `backend-pet-tracker/` con
`export const mealServings` añadido a `src/db/schema/nutrition.schema.ts`
(declaración literal en [[design]] D5),
**THE SYSTEM SHALL** dejar en `src/db/migrations/` exactamente tres cambios:
un `.sql` nuevo renombrado a `<NNNN>_meal_servings.sql` donde `<NNNN>` es el
índice siguiente al último de `meta/_journal.json` (`0017` con el journal de
`fba736f9`), su `meta/<NNNN>_snapshot.json` generado, y una entrada nueva en
`meta/_journal.json` con `idx: <NNNN>` y `tag: "<NNNN>_meal_servings"`
(precedente #93 D1: se renombra el `.sql` y el `tag`, el `when` y el snapshot
se dejan como salieron);

**AND** ese `.sql` **SHALL** contener `CREATE TABLE "meal_servings"` y
**SHALL NOT** contener `ALTER TABLE "pets"`, `ALTER TABLE "nutrition_plans"`
ni `ALTER TABLE "nutrition_profiles"` (aditiva: solo la tabla nueva, sus dos
FKs, su índice único y su índice de `created_by`);

**AND** `getTableConfig(mealServings)` **SHALL** declarar exactamente las
columnas `id` (`uuid`, PK, sin default: UUIDv7 en la app), `pet_id` (`uuid`
NOT NULL, FK `pets(id)` `ON DELETE CASCADE`), `served_on` (`date` NOT NULL),
`meal_time` (`varchar(5)` NOT NULL), `served_at` (`timestamp with time zone`
NOT NULL, `DEFAULT now()`), `created_by` (`uuid` NOT NULL, FK `users(id)`,
`onDelete: 'no action'`); el índice único
`meal_servings_pet_id_served_on_meal_time_idx` sobre
`(pet_id, served_on, meal_time)` y el índice `meal_servings_created_by_idx`
sobre `(created_by)`; **ningún** índice adicional (C2) y ningún `check`;

**AND** `docs/data-model.md` **SHALL** ganar la línea
`pets ||--o{ meal_servings : "has"` en el ERD (tras `:37`), una fila
`meal_servings` en la tabla de Postgres (tras la fila `nutrition_plans`,
`:63`; texto literal en [[design]] §Docs) y la frase de `:68` ampliada con la
migración de `meal_servings`.

IF `pnpm db:generate` emite cualquier sentencia sobre otra tabla, THEN el
implementador **SHALL** parar sin commitear, `git checkout -- src/db/migrations`,
y reportar la salida en `progress/impl_meals-served-tracking.md` §R1 (drift
ajeno; precedente #93 D1).

**Test (rojo primero)** — `src/db/schema/meal-servings.schema.spec.ts`
(nuevo), calcado de `src/db/schema/weights.schema.spec.ts:1-91`:
`describe('R1 (meals-served-tracking #83): tabla meal_servings y migracion nueva')`
con cuatro `it`: columnas/tipos/nulabilidad (`getSQLType()`: `'uuid'`,
`'date'`, `'varchar(5)'`, `'timestamp with time zone'`), FKs y cascade,
índices exactos (`config.indexes.map((i) => i.config.name)` **igual** a
`['meal_servings_pet_id_served_on_meal_time_idx', 'meal_servings_created_by_idx']`
en cualquier orden, `config.checks` vacío), y migración: la que contiene
`CREATE TABLE "meal_servings"` (localizada por contenido, helper
`findMealServingsMigration` copiado de `weights.schema.spec.ts:8-19`) tiene
nombre `/^\d{4}_meal_servings\.sql$/`, su prefijo numérico coincide con el
`idx` de la **última** entrada de `meta/_journal.json` (leído con
`readFileSync` + `JSON.parse`; sin cifra literal), y no contiene los tres
`ALTER TABLE` prohibidos. En el commit rojo cae porque `mealServings` no se
exporta (`tsc`/import) y no hay migración: es el **artefacto bajo prueba**
(precedente #44 R12, #93 R1).

### R2 — `POST /v1/pets/:petId/meals` inserta con el día civil del owner y responde el shape congelado

**WHEN** un miembro activo envía `POST /v1/pets/:petId/meals` con body
`{ mealTime }` válido (R6) y la mascota tiene plan vigente que contiene
`mealTime` (R4),
**THE SYSTEM SHALL** insertar una fila en `meal_servings` con `pet_id` =
`:petId`, `meal_time` = `mealTime`, `created_by` = el actor, `served_at` =
`now()` de Postgres y `served_on` = **el día civil del owner** en el
instante de la petición (`ownerLocalDay(pets, petId, now)`, mismo helper y
mismo `now = new Date()` del handler que `create-weight.use-case.ts:31` y
`weights.controller.ts:42`), **sin** que el cliente envíe fecha alguna;

**AND SHALL** responder `201` con **exactamente** las claves
`{ id, petId, servedOn, mealTime, servedAt, createdBy }`, donde `id` es el
UUIDv7 generado, `servedOn` es `YYYY-MM-DD`, `servedAt` es ISO-8601 (`new
Date(servedAt).toISOString() === servedAt`) y `createdBy` es el id del actor;

**AND**, con el owner en `Pacific/Kiritimati` (UTC+14) y con el owner en
`Pacific/Pago_Pago` (UTC-11), `servedOn` **SHALL** ser
`localDayOf(Date.now(), <zona>)` de `src/pipeline/local-day.ts:58` en cada
caso: el día del owner, no el del servidor ni el del cliente. Si el owner
cambia de zona más tarde, las filas históricas **no** se recomputan (D9 de
#10, `src/db/schema/activity.schema.ts:18-20`).

**Test (rojo primero)** — `test/meals.e2e-spec.ts` (nuevo, calcado de
`test/health-weights.e2e-spec.ts:18-113`; fixtures en [[design]] §E2E):
`describe('R2 (meals-served-tracking #83): POST inserta con el dia civil del owner y responde el shape congelado')`,
dos `it`: (a) owner `UTC` sirve `'07:30'` → `201`, `Object.keys(body).sort()`
igual a las seis claves, `toMatchObject({ petId, mealTime: '07:30', servedOn:
localDayOf(Date.now(), 'UTC'), createdBy: owner.id })`, `servedAt` ISO, y la
fila leída con `db.select().from(mealServings)` tiene `createdBy = owner.id`;
(b) bucle sobre `['Pacific/Kiritimati', 'Pacific/Pago_Pago']` como
`health-weights.e2e-spec.ts:405-434`: `servedOn === localDayOf(Date.now(), timezone)`.
El `postWeight` del fixture usa como `measuredAt` el día local del owner
(no el UTC): con Pago_Pago el día UTC puede ser **mañana** para el owner y
#89 lo rechaza con `400` ([[design]] §E2E).

### R3 — cualquier miembro activo sirve y deshace; el guard responde 404 antes que nada

**WHEN** un miembro activo con `role` `family` envía el `POST` de R2, **THE
SYSTEM SHALL** responder `201` con `createdBy` = el id del `family`; **WHEN**
un miembro activo con `role` `walker` envía `DELETE /v1/pets/:petId/meals/:mealTime`
sobre esa misma franja (servida por otro), **THE SYSTEM SHALL** responder
`204` y borrar la fila (D2: quien está con la mascota puede corregir a quien
estaba antes);

**AND** IF `:petId` no existe, no es UUID sintáctico, o el actor no tiene
membresía activa, THEN **THE SYSTEM SHALL** responder `404` genérico por
`PetAccessGuard` en `POST` y en `DELETE`, **antes** de validar el body, leer
el plan o tocar `meal_servings` (`pet-access.guard.ts:48-59`); un usuario B
sobre la mascota de A recibe `404` en ambas rutas incluso con body inválido;

**AND** ninguna ruta de esta feature **SHALL** llevar `@RequirePetRole`, de
modo que ningún miembro activo recibe `403` en ellas (a diferencia de
`POST …/weights`, `health-weights.e2e-spec.ts:483-503`).

**Test (rojo primero)** — `test/meals.e2e-spec.ts`,
`describe('R3 (meals-served-tracking #83): cualquier miembro activo sirve y deshace; 404 del guard precede')`:
(a) `family` (`db.insert(petUsers).values({ petId, userId, role: 'family', status: 'active' })`,
patrón `health-weights.e2e-spec.ts:488-493`) → `POST` `201` con `createdBy`
= family; `walker` → `DELETE` `204` y `select` vacío; (b) outsider → `404` en
`POST` (con body **inválido** `{}` para demostrar precedencia) y en `DELETE`;
`:petId` = `'not-a-uuid'` → `404` en ambas.

### R4 — sin plan, o franja fuera del plan vigente: 422 sin persistir ni auditar

IF la mascota no tiene ningún plan (`findLatestPlan` → `null`), THEN **THE
SYSTEM SHALL** responder `422` con
`{ statusCode: 422, code: 'NUTRITION_PLAN_REQUIRED', message: 'Generate a nutrition plan before serving meals' }`;
IF tiene plan vigente pero `mealTime` no está en su `mealTimes`, THEN **THE
SYSTEM SHALL** responder `422` con
`{ statusCode: 422, code: 'MEAL_TIME_NOT_IN_PLAN', message: 'mealTime is not part of the current nutrition plan' }`;
en ambos casos **sin** insertar fila y **sin** registrar auditoría;

**AND** el orden de comprobación **SHALL** ser: body (R6, `400`) → plan
existe → `mealTime ∈ plan.mealTimes` → unicidad (R5, `409`). "Plan vigente"
es el que devuelve `findLatestPlan` (P1): tras regenerar con otras horas, una
franja del plan anterior responde `MEAL_TIME_NOT_IN_PLAN` aunque ya esté
servida hoy (D4, C6).

**Test (rojo primero)** —
`src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts`
(nuevo; dobles parciales de `NutritionRepository`, `MealServingRepository`,
`PetRepository` (`{ findOwnerTimezone }` vía `as unknown as`, patrón
`create-weight.use-case.spec.ts:34-36`) y `AuditLogger` (`{ record }`)):
`describe('R4 (meals-served-tracking #83): sin plan o franja fuera del plan el use case lanza sin escribir ni auditar')`
con `findLatestPlan → null` ⇒ `rejects.toMatchObject({ name: 'NutritionPlanRequiredError' })`,
`create` y `record` sin llamar; y `findLatestPlan → plan(['07:30','19:30'])` +
`mealTime '12:00'` ⇒ `MealTimeNotInPlanError`, ídem. Y en
`test/meals.e2e-spec.ts`,
`describe('R4 (meals-served-tracking #83): 422 NUTRITION_PLAN_REQUIRED y 422 MEAL_TIME_NOT_IN_PLAN sin persistir')`:
mascota sin plan → `422` con el body exacto y `count(meal_servings) = 0`;
mascota con plan → `POST { mealTime: '12:00' }` → `422` exacto, `0` filas,
`0` filas en `audit_log` con `entity = 'meal_serving'` para ese actor.

### R5 — segunda vez en la misma franja del mismo día: 409; otro día sí

**WHEN** ya existe una fila con el mismo `(pet_id, served_on, meal_time)` y
llega un `POST` idéntico el mismo día civil del owner, **THE SYSTEM SHALL**
responder `409` con
`{ statusCode: 409, code: 'MEAL_ALREADY_SERVED', message: 'Meal already served today' }`
y dejar **una** sola fila (la primera, con su `created_by` y `served_at`
originales) y ninguna auditoría nueva; la unicidad la garantiza el índice
único de R1 (D3), no una lectura previa en la aplicación;

**AND WHEN** existe una fila de la misma franja con `served_on` = **ayer**
del owner, **THE SYSTEM SHALL** aceptar el `POST` de hoy con `201` y dejar
dos filas: la unicidad es **por día**.

**Test (rojo primero)** — `test/meals.e2e-spec.ts`,
`describe('R5 (meals-served-tracking #83): la misma franja el mismo dia responde 409; otro dia no')`:
(a) `POST '07:30'` ×2 → `201`, `409` body exacto; `select` → 1 fila con
`createdBy` del primero; `audit_log` `meal.serve` → 1 fila; (b) insertar
directamente `db.insert(mealServings).values({ id: uuidv7(), petId,
servedOn: shiftDay(localDayOf(Date.now(), 'UTC'), -1), mealTime: '07:30',
createdBy: owner.id })` y `POST '07:30'` → `201`; `select` → 2 filas.

### R6 — body inválido: 400 sin persistir ni consultar el plan

IF el body no es exactamente `{ mealTime: string }` con `mealTime` que casa
`^\d{2}:\d{2}$` (`z.strictObject({ mealTime: z.string().regex(MEAL_TIME_PATTERN) })`,
[[design]] D6), THEN **THE SYSTEM SHALL** responder `400` con
`{ statusCode: 400, message: 'Validation failed', errors: [{ path, message }] }`
sin insertar fila y sin leer el plan: en concreto `{}`,
`{ mealTime: '7:30' }`, `{ mealTime: 730 }`, `{ mealTime: '07:30', extra: true }`
y `{ mealTime: '07:30', servedOn: '2026-01-01' }` (el cliente **no** manda
fecha: la pone el servidor, R2 y D6) responden `400`;

**AND** una mascota **sin plan** con body inválido **SHALL** recibir `400`,
no `422`: el `400` precede al `422` (R4).

**Test (rojo primero)** — `test/meals.e2e-spec.ts`,
`describe('R6 (meals-served-tracking #83): body invalido responde 400 sin persistir')`:
los cinco bodies sobre una mascota **sin plan** → `400` con `message:
'Validation failed'` y `errors.length >= 1` (el `path` de una clave
desconocida lo decide zod; no se asevera), y `count(meal_servings) = 0`.

### R7 — `DELETE /v1/pets/:petId/meals/:mealTime` deshace la franja de hoy o responde 404

**WHEN** un miembro activo envía `DELETE /v1/pets/:petId/meals/:mealTime` y
existe una fila con `pet_id = :petId`, `served_on` = el día civil del owner
**ahora** (`ownerLocalDay`, R2) y `meal_time = :mealTime`, **THE SYSTEM
SHALL** borrarla y responder `204` sin body; el `DELETE` **no** consulta el
plan: una franja servida hoy que ya no está en el plan regenerado también se
puede deshacer (D4);

IF no existe tal fila (franja nunca servida hoy, `:mealTime` con formato que
no puede coincidir con ninguna fila, o la fila es de **ayer**), THEN **THE
SYSTEM SHALL** responder `404` con
`{ statusCode: 404, code: 'MEAL_SERVING_NOT_FOUND', message: 'Meal serving not found for today' }`
sin borrar nada (la fila de ayer permanece). No hay `DELETE` por `id` ni por
fecha: el móvil deshace **hoy** sin consulta previa (D3).

**Test (rojo primero)** —
`src/modules/nutrition/application/use-cases/unserve-meal.use-case.spec.ts`
(nuevo): `describe('R7 (meals-served-tracking #83): sin fila de hoy el use case lanza MealServingNotFoundError sin auditar')`
con `deleteOne → null` ⇒ `rejects.toMatchObject({ name: 'MealServingNotFoundError' })`
y `record` sin llamar; `deleteOne` recibe `(petId, <dia del owner>, mealTime)`
con `findOwnerTimezone → 'Pacific/Kiritimati'` y `now` fijo. Y en
`test/meals.e2e-spec.ts`,
`describe('R7 (meals-served-tracking #83): DELETE deshace la franja de hoy y responde 404 si no existe')`:
`POST '07:30'` → `DELETE 07:30` `204` (body vacío) → `select` vacío → `GET
nutrition-plan` `servedToday: []` → segundo `DELETE 07:30` `404` body exacto
→ `DELETE 19:30` `404` → `DELETE 7:30` `404`; fila de ayer insertada directa
→ `DELETE 07:30` `404` y la fila sigue.

### R8 — auditoría `meal.serve` y `meal.unserve` tras escribir

**WHEN** un `POST` de R2 termina con éxito, **THE SYSTEM SHALL** registrar
mediante `AuditLogger` una entrada `{ userId: <actor>, action: 'meal.serve',
entity: 'meal_serving', entityId: <id de la fila>, meta: { petId, mealTime,
servedOn } }`; **WHEN** un `DELETE` de R7 termina con éxito, **SHALL**
registrar `{ userId: <actor>, action: 'meal.unserve', entity: 'meal_serving',
entityId: <id de la fila borrada>, meta: { petId, mealTime, servedOn } }`;
IF la escritura en base falla o lanza (R4, R5, R7 `404`), THEN **THE SYSTEM
SHALL NOT** auditar nada. Molde: `create-weight.use-case.ts:48-54` y
`src/modules/health/application/use-cases/delete-vaccine.use-case.ts:23-29`;
la auditoría va **después** de que la escritura resuelva.

**Test (rojo primero)** — en `serve-meal.use-case.spec.ts`,
`describe('R8 (meals-served-tracking #83): meal.serve se audita despues de crear y nunca si create falla')`
(`create` rechaza ⇒ `record` sin llamar; éxito ⇒ `record` con el objeto exacto
y `invocationCallOrder` posterior al de `create`, patrón
`create-weight.use-case.spec.ts:73-83`); en `unserve-meal.use-case.spec.ts`,
`describe('R8 (meals-served-tracking #83): meal.unserve se audita con el id de la fila borrada')`;
y en `test/meals.e2e-spec.ts`,
`describe('R8 (meals-served-tracking #83): POST y DELETE dejan filas meal.serve y meal.unserve en audit_log')`
con `toMatchObject` sobre `db.select().from(auditLog).where(and(eq(entity,
'meal_serving'), eq(entityId, id)))` → 2 filas (`serve`, `unserve`) con
`meta: { petId, mealTime: '07:30', servedOn }`.

### R9 — `GET /v1/pets/:petId/nutrition-plan` devuelve `servedToday` (solo franjas del plan vigente, en su orden); `generate` no cambia

**WHEN** un miembro activo solicita `GET /v1/pets/:petId/nutrition-plan` y
hay plan, **THE SYSTEM SHALL** responder `200` con **exactamente** las 11
claves de `NutritionPlanResponse` (`nutrition.mapper.ts:20-32`) **más**
`servedToday: string[]`: las `meal_time` de las filas de `meal_servings`
con `served_on` = el día civil del owner **ahora** que pertenecen a
`mealTimes` del plan devuelto, **en el orden de `mealTimes`** (no en el de
inserción), `[]` si no hay ninguna; una franja servida hoy que no está en
el plan devuelto **no** aparece (D4, R11);

**AND** `POST /v1/pets/:petId/nutrition-plan/generate` **SHALL** seguir
respondiendo las 11 claves **sin** `servedToday` (C5: R19 de #17,
`test/nutrition.e2e-spec.ts:295-309`, queda intacto); el `404
NUTRITION_PLAN_NOT_FOUND` del `GET` sin plan **SHALL** seguir igual (R24 de
#17, `:438-451`).

**Delta declarado sobre un candado ajeno**: `test/nutrition.e2e-spec.ts:478`
pasa de `expect(latest.body).toEqual(second.body)` a
`expect(latest.body).toEqual({ ...second.body, servedToday: [] })`. Es la
**única** línea de ese fichero que cambia.

**Test (rojo primero)** — `test/meals.e2e-spec.ts`,
`describe('R9 (meals-served-tracking #83): GET nutrition-plan devuelve servedToday en orden del plan y generate no')`:
(a) con plan `['07:30','19:30']`: `GET` → claves = las 11 + `servedToday`,
`servedToday: []`; `POST '19:30'` y luego `POST '07:30'` → `GET` →
`servedToday: ['07:30', '19:30']` (orden del plan); `generate` →
`not.toHaveProperty('servedToday')`; (b) el caso de plan regenerado de R10
también asevera `servedToday: ['08:00']` (la `'07:30'` servida queda fuera).
El delta de `:478` va en el **mismo commit rojo** (cae hasta que el `GET`
devuelva la clave).

### R10 — `GET /v1/pets/:petId` devuelve `mealsToday: { served, total } | null`; el listado no se enriquece

**WHEN** un miembro activo solicita `GET /v1/pets/:petId`, **THE SYSTEM
SHALL** incluir la clave `mealsToday` en `PetProfileResponse`: `null` si la
mascota no tiene plan; si lo tiene, `{ served, total }` con `total` =
`mealsPerDay` del plan vigente y `served` = número de filas de
`meal_servings` con `served_on` = el día civil del owner (el mismo `today`
que ya calcula `get-pet.use-case.ts:69`) cuyo `meal_time` pertenece a
`mealTimes` del plan vigente (D4, R11); `served ≤ total` siempre (P2);

**AND** la lectura **SHALL** entrar por un puerto nuevo
`PET_MEALS_READER` (`src/modules/pets/domain/ports/pet-meals-reader.ts`,
`findMealsToday(petId, day): Promise<PetMealsToday | null>`) con adaptador
Drizzle en `src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts`
y módulo `PetMealsReadModule` (`src/modules/nutrition/pet-meals-read.module.ts`)
importado por `PetsModule`, calcado de `PET_VACCINE_READER` (P4); `PetRepository`
**no** cambia (P6);

**AND** `GET /v1/pets` **SHALL** devolver `mealsToday: null` en cada elemento
(clave presente; sin consulta por mascota: #66 D4, C7);

**AND** las **seis** listas de claves del perfil (C1) **SHALL** pasar de 24 a
25 claves añadiendo `'mealsToday'`, y las aserciones de `null` por defecto
(`pet-profile-response.mapper.spec.ts:67-74`, `pets.controller.spec.ts:192-195`)
**SHALL** ganar `mealsToday`.

**Test (rojo primero)** — tres sitios en el **mismo commit rojo**:
(1) `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts`:
`:34` título `'serializa las 25 claves fijadas, sin extras ni faltantes'`,
`:37-64` lista + `'mealsToday'`, `:67-74` título + `expect(response.mealsToday).toBeNull()`
— rojo legítimo por la aserción del `toEqual`;
(2) `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts`: en
`buildDeps` (`:36-60`) añadir `const findMealsToday = jest.fn().mockResolvedValue(null); const mealsReader: PetMealsReader = { findMealsToday };`
y devolverlos; pasar `deps.mealsReader` como **quinto** argumento en las diez
construcciones (P7); nuevo
`describe('R10 (meals-served-tracking #83): el perfil consulta mealsToday con el dia civil del owner')`
con `findOwnerTimezone → 'America/Mexico_City'`, `NOW` del fichero
(`2026-08-10T03:00:00.000Z`) ⇒ `findMealsToday` llamado con `(PET_ID, '2026-08-09')`
y `profile.mealsToday` igual al valor resuelto (`{ served: 1, total: 2 }`);
segundo `it`: resuelto `null` ⇒ `profile.mealsToday` `null`;
(3) `src/modules/pets/infrastructure/pets.controller.spec.ts:164-191` lista +
`'mealsToday'` y `:195` + `expect(response[0].mealsToday).toBeNull()`.
Y en `test/meals.e2e-spec.ts`,
`describe('R10 (meals-served-tracking #83): GET perfil devuelve mealsToday y el listado lo deja en null')`:
(a) sin plan → `mealsToday: null`; (b) con plan → `{ served: 0, total: 2 }`;
`POST '07:30'` → `{ served: 1, total: 2 }`; (c) `GET /v1/pets` → todos los
elementos con `mealsToday: null` y la clave presente; (d) **plan
regenerado (D4)**: con `'07:30'` servida, insertar directamente una fila en
`nutrition_plans` (`db.insert(nutritionPlans).values({ id: uuidv7(), petId,
rerKcal: 662, merKcal: 1059, dailyGrams: 305, mealsPerDay: 3, mealTimes:
['08:00', '13:00', '20:00'], objective: 'maintenance', warnings: [],
aiExplanation: null, inputsHash: 'f'.repeat(64) })`; `generated_at`
`DEFAULT now()` la hace vigente) → `POST '08:00'` `201` → `GET perfil` →
`{ served: 1, total: 3 }`; `GET nutrition-plan` → `servedToday: ['08:00']`;
`POST '07:30'` → `422 MEAL_TIME_NOT_IN_PLAN` (no `409`: C6); `select` → 2
filas (la `'07:30'` sigue guardada); `DELETE 07:30` → `204` (R7).
Y las cuatro listas e2e (`test/pets.e2e-spec.ts:64-89`,
`test/devices.e2e-spec.ts:795-820` más su comentario `:794` "24" → "25",
`test/device-subscriptions.e2e-spec.ts:328-352`,
`test/pet-lost-mode.e2e-spec.ts:29-54`) + `'mealsToday'` en el mismo commit
rojo.

### R11 — D4 en una función pura: `servedInPlan(mealTimes, served)`

**WHEN** se invoca `servedInPlan(mealTimes: string[], served: string[]): string[]`
(exportada desde `src/modules/nutrition/domain/entities/meal-serving.entity.ts`,
sin IO ni imports de framework), **THE SYSTEM SHALL** devolver las entradas
de `mealTimes` que aparecen en `served`, **en el orden de `mealTimes`**,
sin duplicados aunque `served` los traiga, y `[]` si no hay intersección o
`mealTimes` está vacío; su longitud nunca supera `mealTimes.length`. Es el
**único** punto donde se decide qué cuenta (D4): lo usan
`PetMealsDrizzleReader` (R10) y `GetNutritionPlanUseCase` (R9).

**Test (rojo primero)** —
`src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts` (nuevo):
`describe('R11 (meals-served-tracking #83): servedInPlan devuelve solo franjas del plan, en su orden y sin duplicados')`
con cuatro `it`: `(['07:30','19:30'], ['19:30','07:30'])` → `['07:30','19:30']`;
`(['08:00','13:00','20:00'], ['07:30','08:00'])` → `['08:00']`;
`(['07:30','19:30'], ['07:30','07:30'])` → `['07:30']`; `([], ['07:30'])` y
`(['07:30'], [])` → `[]`. Cae en rojo porque el módulo no existe (artefacto
bajo prueba; el candado real es la aserción de orden y de exclusión).

### R12 — la migración se aplica a `pet_tracker_wt` con `pnpm db:migrate`, es idempotente, y el árbol queda verde y documentado (verificación)

**WHILE** `pnpm test` y `pnpm exec tsc --noEmit` son verdes con R1-R11
commiteados y la migración **sin** aplicar (los e2e de R2-R10 necesitan la
tabla: se corren **después** de aplicar),
**WHEN** se ejecuta `pnpm db:migrate` desde `backend-pet-tracker/`,
**THE SYSTEM SHALL** terminar con exit 0 y dejar en `pet_tracker_wt`
`information_schema.tables` **con** la fila `(table_schema='public',
table_name='meal_servings')` y `drizzle.__drizzle_migrations` con **una fila
más** que antes (la nueva con `created_at` = `when` de la entrada
`<NNNN>_meal_servings` del journal);

**AND** un **segundo** `pnpm db:migrate` inmediato **SHALL** terminar con exit
0 **sin** aplicar nada (mismo recuento);

**AND** `pnpm db:generate` inmediato **SHALL NOT** crear ningún fichero
(`git status --porcelain src/db/migrations` vacío);

**AND** `pnpm test:e2e` (con el `pgrep` de cabecera de [[tasks]] limpio) y
`./init.sh` desde la raíz (exit 0 medido **sin pipe**) **SHALL** terminar
verdes con la tabla presente; `test/meals.e2e-spec.ts` **SHALL** aparecer en
la salida de jest como suite ejecutada (30 suites e2e, 3 `aws-real` skipped
como en la línea base);

**AND** `docs/conventions.md:295` **SHALL** decir "**14 de las 30 suites e2e
lo tocan**" y `:303` "Las otras 16 solo tocan Postgres" (`meals` no toca
LocalStack: importa `AppModule` como las demás pero solo escribe en
`meal_servings`, `nutrition_*`, `weights`, `pets`, `pet_users`, `users`,
`audit_log`).

**Requisito de verificación** (C4 de `CHECKPOINTS.md`, vía **(b)**): asevera
propiedades del artefacto que R1 dejó en el árbol contra la base propia del
worktree; sin test versionado (D10: un e2e sobre `information_schema` sería
rojo en toda máquina sin migrar). Comandos exactos y evidencia en [[tasks]]
R12 → `progress/impl_meals-served-tracking.md` §R12. La base compartida
`pet_tracker` **no** forma parte de R12 ([[design]] §Aplicación de la
migración en dos bases).

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero:línea | Antes | Después | Por | Commit |
|---|---|---|---|---|
| `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts:34` | `'serializa las 24 claves fijadas, sin extras ni faltantes'` | `'serializa las 25 claves fijadas, sin extras ni faltantes'` | R10 | rojo |
| `pet-profile-response.mapper.spec.ts:37-64` | lista de 24 | + `'mealsToday'` (25) | R10 | rojo |
| `pet-profile-response.mapper.spec.ts:67-74` | 4 `toBeNull()` | + `expect(response.mealsToday).toBeNull()`; título nombra `mealsToday` | R10 | rojo |
| `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts:36-60` | 4 dobles | + `findMealsToday` / `mealsReader` | R10 | rojo |
| `get-pet.use-case.spec.ts:65,83,107,127,143,163,186,219,238,257` | `new GetPetUseCase(pets, deviceReader, photoUrlResolver, vaccineReader)` | + `deps.mealsReader` (quinto) | R10 (forzado por `tsc`) | rojo |
| `src/modules/pets/infrastructure/pets.controller.spec.ts:164-191` | lista de 24 | + `'mealsToday'` | R10 | rojo |
| `pets.controller.spec.ts:195` | 4 `toBeNull()` | + `expect(response[0].mealsToday).toBeNull()` | R10 | rojo |
| `test/pets.e2e-spec.ts:64-89` (`PROFILE_KEYS`) | 24 | + `'mealsToday'` | R10 | rojo |
| `test/devices.e2e-spec.ts:794-820` | comentario "24 claves" + lista | "25 claves" + `'mealsToday'` | R10 | rojo |
| `test/device-subscriptions.e2e-spec.ts:328-352` | 24 | + `'mealsToday'` | R10 | rojo |
| `test/pet-lost-mode.e2e-spec.ts:29-54` (`profileKeys`) | 24 | + `'mealsToday'` | R10 | rojo |
| `test/nutrition.e2e-spec.ts:478` | `expect(latest.body).toEqual(second.body);` | `expect(latest.body).toEqual({ ...second.body, servedToday: [] });` | R9 | rojo |
| `docs/conventions.md:295,303` | "14 de las 29" / "Las otras 15" | "14 de las 30" / "Las otras 16" | R12 | docs |
| `docs/data-model.md:37,63,68` | — | ERD + fila `meal_servings` + migración | R1 | docs |

### Siguen verdes sin tocarlos (si alguno se pone rojo, la implementación está mal, no el candado)

| Candado | Qué fija |
|---|---|
| `src/db/schema/nutrition.schema.spec.ts` (entero) | `nutrition_profiles` / `nutrition_plans` y la migración `0013` localizada por contenido (P14) |
| `src/db/schema/weights.schema.spec.ts`, `health.schema.spec.ts`, `devices.schema.spec.ts`, resto de `*.schema.spec.ts` | ninguna otra tabla cambia (R1: migración aditiva sobre `meal_servings` únicamente) |
| `src/db/schema/index.spec.ts` | el barrel no se toca (`nutrition.schema.ts` ya está reexportado, `index.ts:18`) |
| `test/nutrition.e2e-spec.ts` salvo `:478` | R16-R27 de #17: `generate` con 11 claves (R19 `:295-309`), 422 de perfil/peso, 404 del `GET`, guard, `aiExplanation`, numeric |
| `test/health-weights.e2e-spec.ts` (entero) | #15 / #89: `weights` no cambia; `ownerLocalDay` no cambia |
| `src/modules/pets/application/owner-local-day.spec.ts`, `src/pipeline/local-day.spec.ts` | helpers de día civil, sin cambios |
| `src/modules/pets/infrastructure/pets.controller.spec.ts:199-270` (aserciones) | `detail` con `getExecute` sin `mealsToday` ⇒ el default `null` del mapper cubre la clave |
| `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts` (`MockOf<PetRepository>`) | `PetRepository` no cambia de forma (P6) |
| `src/modules/nutrition/nutrition-scope.spec.ts` | sin `OPENAI_`/`gpt-` en producción (nada nuevo lo introduce) |
| `test/devices.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts`, `test/pet-lost-mode.e2e-spec.ts`, `test/pets.e2e-spec.ts` salvo las listas | el resto de cada suite |
| `mobile-pet-tracker/**` (entero) | no se toca; los clientes toleran claves nuevas (P16). `food.test.tsx` y `index.test.tsx` (`#70 R3`) los mueve #98 |

---

## Cobertura de los criterios de aceptación de `feature_list.json` #83

| Criterio | Cubierto por | Nota |
|---|---|---|
| 1. Registro persistente de comida servida, con su endpoint, y deja de fingirse con el reloj del cliente | R1 (tabla), R2-R8 (POST/DELETE) | "Deja de fingirse" en `mobile-pet-tracker/src/app/(tabs)/food.tsx:24-29,61-64` lo ejecuta **#98** (D1); esta feature deja el dato y los endpoints |
| 2. El total de comidas del día llega a donde la Home lo necesita, sin pedir el plan aparte | R10 (`mealsToday: { served, total }` en `GET /v1/pets/:petId`) | Solo en el detalle (#66 D4); `food.tsx` sigue leyendo el plan y recibe `servedToday` (R9) |
| 3. La spec decide si se parte en dos y lo justifica | D1 (humano) + [[design]] D1 | #98 `mobile-meals-served-ui` creada en `feature_list.json`, bloqueada por #83 mergeada y migración aplicada |
| 4. Gate humano: smoke con una mascota con plan | §Gate humano (curl) | La barra pintada en la Home es el smoke de #98 |

---

## Gate humano (smoke con `curl` contra el backend local del worktree; nada de cuentas ni costo)

Precondición: `pnpm start:dev` desde `backend-pet-tracker/` del worktree
(`.env` → `pet_tracker_wt`, `PORT=3000`), migración aplicada (R12), un
usuario propio ya registrado y verificado (el de `docs/demo-runbook.md`).
Sustituir `<email>`/`<password>`; `<hoy>` es `YYYY-MM-DD` en la zona del
usuario (`users.timezone`).

```sh
API=http://localhost:3000/v1
TOKEN=$(curl -s -X POST $API/auth/login -H 'content-type: application/json' \
  -d '{"email":"<email>","password":"<password>"}' | jq -r .access_token)
H=(-H "authorization: Bearer $TOKEN" -H 'content-type: application/json')
PET=$(curl -s -X POST $API/pets "${H[@]}" \
  -d '{"name":"Smoke83","species":"dog","birthDate":"2021-01-15","sterilized":true}' | jq -r .id)
curl -s $API/pets/$PET "${H[@]}" | jq .mealsToday                       # null (sin plan)
curl -s -X POST $API/pets/$PET/meals "${H[@]}" -d '{"mealTime":"07:30"}' | jq .code   # "NUTRITION_PLAN_REQUIRED"
curl -s -X PUT $API/pets/$PET/nutrition-profile "${H[@]}" \
  -d '{"activityLevel":"medium","foodType":"dry","kcalPer100g":350}' >/dev/null
curl -s -X POST $API/pets/$PET/weights "${H[@]}" -d '{"weightKg":20,"measuredAt":"<hoy>"}' >/dev/null
curl -s -X POST $API/pets/$PET/nutrition-plan/generate "${H[@]}" | jq .mealTimes     # ["07:30","19:30"]
curl -s -X POST $API/pets/$PET/meals "${H[@]}" -d '{"mealTime":"07:30"}' | jq .      # 201: id, petId, servedOn, mealTime, servedAt, createdBy
curl -s -X POST $API/pets/$PET/meals "${H[@]}" -d '{"mealTime":"07:30"}' | jq .code  # "MEAL_ALREADY_SERVED"
curl -s -X POST $API/pets/$PET/meals "${H[@]}" -d '{"mealTime":"12:00"}' | jq .code  # "MEAL_TIME_NOT_IN_PLAN"
curl -s $API/pets/$PET "${H[@]}" | jq .mealsToday                       # {"served":1,"total":2}
curl -s $API/pets/$PET/nutrition-plan "${H[@]}" | jq .servedToday       # ["07:30"]
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE $API/pets/$PET/meals/07:30 "${H[@]}"   # 204
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE $API/pets/$PET/meals/07:30 "${H[@]}"   # 404
curl -s $API/pets/$PET "${H[@]}" | jq .mealsToday                       # {"served":0,"total":2}
curl -s $API/pets "${H[@]}" | jq '.[0].mealsToday'                      # null (listado)
curl -s -o /dev/null -w '%{http_code}\n' -X DELETE $API/pets/$PET "${H[@]}"               # 204 (limpieza)
```

El humano registra el resultado (los valores esperados de cada línea) en
`progress/current.md`; el leader no marca `done` sin ese registro ni sin R12.

---

## Fuera de alcance (cada uno con su porqué)

- **Todo lo móvil** (`food.tsx`, Home, `types.ts`, i18n, fixtures, `#70 R3`,
  enmienda #70 de la carta): **#98** `mobile-meals-served-ui` (D1).
- **Deshacer por `id` o por fecha, `GET /meals` de historial, `PATCH`**: el
  único consumidor (#98) deshace la franja de **hoy**; un historial de
  servidas no tiene pantalla. Si aparece, feature con id.
- **`source` de la servida** (botón vs recordatorio): hoy hay un solo
  escritor; se añade cuando exista el segundo (explore §7b).
- **Completar un recordatorio `type: 'food'` como servida**: `reminders.status`
  no tiene `completed` (`src/db/schema/reminders.schema.ts:43-46`); feature
  aparte.
- **Exponer la zona del owner al móvil / #90**: la fecha la pone el servidor
  (D6), así que #83 no reproduce el problema; la deuda #90 sigue abierta y
  esta spec no la toca.
- **Recontar `served` si el owner cambia de zona**: `served_on` es fecha
  civil persistida, no se recomputa (D9 de #10).
- **Añadir `servedToday` a `generate`** (C5) y **`mealsToday` en el
  listado** (#66 D4).
- **Tocar `PetRepository`** (P6), `PetProfile` móvil, `init.sh`, CI,
  `.env.example`, `docs/ui-guidelines.md`, migraciones históricas
  (`0000`…`0016` y sus snapshots).
- **Aplicar la migración a `pet_tracker` (base compartida) o a otra
  máquina**: operativa del leader/humano tras el merge ([[design]] §Aplicación
  de la migración en dos bases); en esta spec solo se garantiza que
  `pnpm db:migrate` la aplica limpiamente y una sola vez en `pet_tracker_wt`.
- **Validar `HH:MM` como hora real (`23:59` máximo)**: la pertenencia a
  `plan.mealTimes` (R4) ya acota el valor a lo que el engine genera; una
  regex más estricta sería una segunda fuente de verdad.

---

## Aprobación

Firmar sin editar = aceptar D1-D4 (humano) y D5-D12 de [[design]] tal cual,
en particular **D2** (cualquier miembro activo escribe: excepción al patrón
owner-only), **C2** (sin índice `(pet_id, served_on)`: lo cubre el único),
**C4/C5** (`servedToday` solo en el `GET` del plan y por el repositorio
propio; una línea de R24 de #17 se mueve) y **D10** (sin e2e permanente
sobre `information_schema`; la base compartida se migra tras el merge).

- [X] Aprobado por humano (fecha: 2026-09-15) ← gate obligatorio antes de implementar
