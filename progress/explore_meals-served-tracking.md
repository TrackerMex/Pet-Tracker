# explore: meals-served-tracking (#83)
Fecha: 2026-09-15
Árbol verificado: worktree `/home/claude/sites/Pet-Tracker-wt-backend`, rama `feature/83-meals-served-tracking`, HEAD `1b9efe86` (= `main`). Toda ruta:línea de este informe se leyó contra ese árbol hoy, no contra memoria ni contra `progress/explore_design-gap-vs-make.md`. Rutas relativas a `backend-pet-tracker/` o `mobile-pet-tracker/` según el bloque; las de `specs/`, `docs/` y `progress/` a la raíz del repo.

Feature en `feature_list.json`: id 83, `pending`, P3, `files_affected` = `backend-pet-tracker/src/modules/nutrition/` y `mobile-pet-tracker/src/app/(tabs)/food.tsx`. Criterios: registro persistente de comida servida con endpoint; el total del día llega a donde la Home lo necesita sin pedir el plan aparte; la spec decide si se parte en dos; gate humano con smoke de una mascota con plan.

Contexto de origen: decisión E2 de #70 (`specs/mobile-home-reminders-section/requirements.md:897-903`), R3 de esa misma spec (`:213-247`) y la corrección D2 de su design (`specs/mobile-home-reminders-section/design.md:340-357`). El origen más antiguo es `progress/explore_design-gap-vs-make.md:432` (fila `pet.meals / totalMeals`, "FALTA-BACKEND").

---

## 1. Estado actual de la barra de comidas en Home

**Hoy la Home no dibuja ninguna barra de comidas.** `grep -n meals src/screens/home/index.tsx` no devuelve nada. La barra existe solo en el Make: `specs/mobile-figma-polish/design-src/App.tsx:438-446` pinta una fila con emoji 🍽️, título "Alimentación", contador `{pet.meals}/{pet.totalMeals}` (`:441`) y una barra de ancho `(pet.meals / pet.totalMeals) * 100 %` (`:443`), colocada **después** de la fila de `pet.nextVaccine` (`:432-438`) dentro de la sección "Recordatorios". `pet.meals` y `pet.totalMeals` son campos del mock del Make; **ninguno existe en el cliente**.

Lo que la Home lee hoy (`src/screens/home/index.tsx`):

- `pets = useQuery(petKeys.list())` → `listPets` (`:177-180`); `detail = useQuery(petKeys.detail(selectedPetId))` → `getPet` (`:182-186`); `activity` (`:187-191`); `reminders = listReminders` (`:192-196`); `openAlerts` (`:197-200`). `useFocusEffect` refresca `pets`, `detail` y `openAlerts` (`:243-249`).
- `nextVaccine = detail.data.pet.nextVaccine` (`:213-214`). Es el único dato del perfil que la sección de recordatorios consume.
- Sección: `reminders-section` (`:605`), cabecera con `reminders-section-title` (`:608`) y `reminders-see-all` (`:614`), cuerpo `reminders-section-body` con `className="gap-2"` (`:626`). Hijos del cuerpo, en este orden: `reminders-section-skeleton` mientras `detail.data === undefined` (`:627-632`), `reminders-next-vaccine` (`:635-668`), `reminders-none-upcoming` si no hay vacuna ni recordatorios (`:670-686`), y hasta tres filas `reminders-item-<id>` de `upcoming` (`:687-`). Aquí es donde el Make mete la barra: tras la vacuna.

Tipos del cliente (`src/api/types.ts`):

- `PetProfile` (`:58-84`): sin ningún campo de comidas. `nextReminder: unknown` (`:80`) y `activitySummary: unknown` (`:81`), que el test R2 de #70 obliga a mantener en `unknown` leyendo el fuente (`src/screens/home/index.test.tsx:3209` asserta `'activitySummary: unknown;'` dentro del bloque `PetProfile`).
- `NutritionPlan` (`:184-196`): `mealsPerDay: number` (`:190`), `mealTimes: string[]` (`:191`). Es el único sitio del cliente donde vive el denominador. Cliente: `src/api/nutrition.ts` `getNutritionPlan` → `GET /pets/:petId/nutrition-plan` (`:70-103`), estado `{ kind: 'ok' | 'not-found' | ... }`.
- `getPet` valida solo `id` y `name` (`src/api/pets.ts:44-50` `isPetProfile`), así que un campo nuevo en la respuesta llega sin más; lo que hay que tocar es el tipo.

**Candado que hay que retirar explícitamente**: `#70 R3` en `src/screens/home/index.test.tsx:3459-3474` asserta que `reminders-section-body` tiene **un** hijo con el perfil cargado, que **no hay texto `\d+ / \d+`** en la sección y que `src/screens/home/index.tsx` **no importa `../../api/nutrition`**. Las dos primeras aserciones son exactamente lo que #83 va a violar; la tercera debe conservarse (ver §7c). La spec tiene que decir que sustituye ese test, no dejar que Codex lo "arregle".

## 2. `food.tsx`: cómo se finge hoy la comida servida

Las líneas se movieron desde que #70 citó `:185` (D2 de su design ya lo avisaba). Hoy, en `src/app/(tabs)/food.tsx`:

- `localTimeHhmm()` (`:24-29`) construye `HH:MM` con `new Date().getHours()/getMinutes()` del **reloj del dispositivo**.
- `const hhmm = localTimeHhmm()` (`:52`), calculado en cada render.
- `servedMeals = loadedPlan.mealTimes.filter((mealTime) => mealTime <= hhmm).length` (`:61-64`): comparación de strings.
- Contador `testID="food-meals-progress"` (`:185`) con `{servedMeals}/{loadedPlan.mealsPerDay}` (`:188`).
- Por fila: `const served = mealTime <= hhmm` (`:193`), badge `meal-served-<index>` / `meal-pending-<index>` (`:214-219`), porción `Math.round(dailyGrams / mealsPerDay)` (`:194-196`).
- Estado y hooks: `useQuery(nutritionKeys.plan(petId))` → `getNutritionPlan` (`:47-51`); `pets` (`:42-45`); `usePetSelection` (`:46`); `useSelectedPet` (`:39`). **No hay estado local de servido**: es puro derivado del reloj.

Tests que lo cierran (`src/app/(tabs)/__tests__/food.test.tsx`): `jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] })` + `jest.setSystemTime(new Date('2026-08-23T13:00:00'))` (`:263-264`, hora **local** sin sufijo Z); `makePlan` con `mealsPerDay: 2, mealTimes: ['07:30', '19:30']` (`:111-112`); expectativas `'1/2'` (`:301`), `meal-served-0` = "Servido" (`:310`), `meal-pending-1` = "Pendiente" (`:315`), `'2/3'` con tres horas (`:321-336`). Todo eso cambia si el servido pasa a venir del backend.

Esta conducta **fue aprobada por humano** como decisión D7 de #38 (`specs/mobile-food/requirements.md:325-327`), con R5 (`:155-163`) y "Marcar comida como servida" declarado fuera de alcance (`:306-309`) precisamente porque no había backend. #83 la sustituye; conviene decirlo en la spec para que el reviewer no la lea como regresión de #38.

Patrón de escritura en móvil: **no existe `useMutation` ni `invalidateQueries` en `src/`** (grep vacío). El precedente es `weight-log.tsx`: `createWeight(...)` dentro de un handler con `setSubmitting` (`:89-127`) y `weights.refetch()` al recibir `kind === 'ok'` (`:106`); cliente `src/api/health-records.ts` `CreateWeightState` (`:24`) y `createWeight` (`:103`) sobre `postJson` de `src/api/http.ts`. Un `serveMeal` seguiría ese molde; tras el POST hay que refrescar **dos** queries: `nutritionKeys.plan` no (el plan no cambia) pero sí la que alimente el contador (ver §7c) y `petKeys.detail` si el contador vive en el perfil.

## 3. Backend: dónde vive `meals_per_day` y qué expone el perfil

Tabla `nutrition_plans` (`src/db/schema/nutrition.schema.ts:71-111`): `mealsPerDay: integer('meals_per_day').notNull()` (`:81`), `mealTimes: jsonb('meal_times').$type<string[]>().notNull()` (`:82`), check `nutrition_plans_meals_per_day_check` 1..6 (`:97-100`), índice `(pet_id, generated_at DESC)` (`:105-108`), FK cascade a `pets` (`:75-77`). Documentado en `docs/data-model.md:63`; creada en `0013_wet_may_parker.sql` (`docs/data-model.md:68`). `nutrition_profiles` en `:18-69`. El spec de schema `src/db/schema/nutrition.schema.spec.ts:8-19` localiza la migración **por contenido** (`CREATE TABLE "nutrition_profiles"`), no por número: una migración 0017 no lo rompe.

Capas del módulo (`src/modules/nutrition/`):

- Entidad `domain/entities/nutrition-plan.entity.ts`: `mealsPerDay`, `mealTimes`, `generatedAt: Date`, `inputsHash`.
- Puerto `domain/repositories/nutrition.repository.ts:11-19`: `NUTRITION_REPOSITORY`, `findLatestPlan(petId): Promise<NutritionPlan | null>`, `insertPlan`. Sin `MockOf<NutritionRepository>` en ningún spec (grep vacío): añadir un método no rompe dobles exhaustivos.
- Drizzle `infrastructure/repositories/nutrition.drizzle.repository.ts:71-79`: `findLatestPlan` ordena `desc(generatedAt), desc(id)` y `limit(1)`. Ese es "el plan vigente".
- Use case `application/use-cases/get-nutrition-plan.use-case.ts`: `findLatestPlan` o `NutritionPlanNotFoundError`.
- DTO de respuesta `infrastructure/mappers/nutrition.mapper.ts:20-32` `NutritionPlanResponse` (con `mealsPerDay`, `mealTimes`), `toNutritionPlanResponse` (`:52-66`, fuerza `aiExplanation: null`).
- Controller `infrastructure/nutrition.controller.ts:32-33`: `@Controller('pets/:petId')` + `@UseGuards(PetAccessGuard)`; `GET nutrition-plan` (`:80-91`) para cualquier miembro activo, `POST nutrition-plan/generate` con `@RequirePetRole('owner')` (`:66-78`). Prefijo `v1` global (`src/main.ts:6`). `parseBody`/`validationError` locales (`:94-113`), mismo molde que pesos.
- Errores → HTTP: `nutrition-error.mapper.ts:14-20` `NUTRITION_PLAN_NOT_FOUND` 404; `NUTRITION_PROFILE_REQUIRED` y `PET_WEIGHT_REQUIRED` 422 (`:30-45`). Un `NUTRITION_PLAN_REQUIRED` 422 para "servir sin plan" encaja en esa tabla.
- Módulo `nutrition.module.ts`: importa `PetsModule` (guard + `PET_REPOSITORY`), registra los cuatro use cases y `NUTRITION_REPOSITORY`. No exporta nada.
- E2E `test/nutrition.e2e-spec.ts`: `seedUser` inserta en `users` con `timezone: 'UTC'` (`:35-51`), `seedPet` por `POST /v1/pets` (`:53-67`), `putProfile` (`:69-77`), `postWeight` (`:79-83`), `generatePlan` (`:85-88`). **Para tener un plan en un e2e hacen falta perfil + peso + generate**, en ese orden (R22/R23 lo verifican, `:361-435`). R24 `GET nutrition-plan` (`:437-480`).

Perfil de mascota: **no expone nada de comidas**. `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts:43-47` declara `nextVaccine: NextPetVaccine | null`, `nextReminder: null`, `activitySummary: null`; `toPetProfileResponse(pet, myRole, now, device, photoUrl, nextVaccine)` (`:57-89`) es una lista explícita de campos. `GET /v1/pets` (`pets.controller.ts:78-88`) pasa `null` en `device` y omite `nextVaccine`; `GET /v1/pets/:petId` (`:91-117`) llama a `getPet.execute(petId, now)` y sí lo rellena. El precedente #66 D4 (`specs/pets-list-response-enrichment/design.md:139-158`) dejó escrito por qué el listado no se enriquece (N+1).

Patrón de enriquecimiento del perfil, ya en producción y que #83 puede copiar tal cual:

- Puerto en pets: `src/modules/pets/domain/ports/pet-vaccine-reader.ts:1-12` (`PET_VACCINE_READER`, `findNextVaccine(petId, from)`).
- Adaptador en el módulo dueño de la tabla: `src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts` (Drizzle directo, `select` mínimo).
- Módulo de solo lectura que lo exporta: `src/modules/health/pet-vaccine-read.module.ts` (`providers` + `exports: [PET_VACCINE_READER]`).
- `PetsModule` lo importa (`pets.module.ts:26-31`) y `GetPetUseCase` lo inyecta (`get-pet.use-case.ts:51-52`), calcula `today = await ownerLocalDay(this.pets, petId, now)` (`:69`) y devuelve `nextVaccine: await this.vaccineReader.findNextVaccine(petId, today)` (`:75`). El controller lo pasa al mapper (`pets.controller.ts:105-112`).

## 4. Patrón reutilizable de "registro por día": `health-weights`

Es la plantilla más cercana (tabla por mascota con fecha civil, `created_by`, auditoría, owner-only, e2e). Rutas exactas de cada capa:

| Capa | Ruta | Qué copiar |
|---|---|---|
| Schema | `src/db/schema/health.schema.ts:68-93` (`weights`) | `id uuid PK` sin default (uuidv7 en app), `pet_id` FK cascade, `measured_at date`, `created_by` FK `users`, índice `(pet_id, measured_at DESC)` (`:87-90`) y `created_by` (`:91`) — regla "toda FK lleva índice" de `docs/data-model.md:70-72` |
| Barrel | `src/db/schema/index.ts:10-24` | un `export * from './<x>.schema'` por fichero; `index.spec.ts` solo comprueba tres tablas de auth, no cuenta |
| Entidad | `src/modules/health/domain/entities/weight.entity.ts` | clase con `Object.assign` |
| Puerto | `src/modules/health/domain/repositories/weight.repository.ts` | `WEIGHT_REPOSITORY` Symbol, `NewPetWeight`, `create/listByPet/findPrevious` |
| DTO | `src/modules/health/application/dto/weight.dto.ts` | `z.strictObject`; `IsoDateSchema` en `dto/iso-date.ts` |
| Use case | `src/modules/health/application/use-cases/create-weight.use-case.ts:16-58` | firma `execute(petId, dto, userId, now)`; `ownerLocalDay` (`:30`); `audit.record({ userId, action: 'weight.create', entity: 'weight', entityId, meta: { petId } })` (`:46-52`). Formato de `action` `<entidad>.<verbo>` fijado en `src/audit/audit-log.repository.ts:3-10` |
| Controller | `src/modules/health/infrastructure/weights.controller.ts:27-70` | `@Controller('pets/:petId/weights')`, `@UseGuards(PetAccessGuard)`, `@Post() @RequirePetRole('owner')`, `now = new Date()` en el handler, error de dominio → `validationError` (`:49-55`) |
| Mapper | `src/modules/health/infrastructure/mappers/weight.mapper.ts` | shape congelado explícito |
| Repo Drizzle | `src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts:17-90` | `uuidv7()`, `db.transaction` cuando toca dos tablas |
| Módulo | `src/modules/health/health.module.ts:24-48` | `imports: [PetsModule]`, `{ provide: WEIGHT_REPOSITORY, useClass }` |
| E2E | `test/health-weights.e2e-spec.ts` | setup `:18-113` (`seedUser(label, timezone)`, `seedPet`, `afterAll` borra `auditLog`, `pets`, `users`); `describe` por R-id; auditoría en R10 (`:521-`); guard 404/403 en R8/R9 (`:438-519`); zona del owner en `:403-436` |
| Spec | `specs/health-weights/requirements.md:24-101` (R1-R10) | R1 tabla+migración, R2 shape, R7 400 sin persistir, R8 IDOR, R9 roles, R10 audit |

Alternativa "contador diario" ya existente: `activity_daily` (`src/db/schema/activity.schema.ts:28-60`) con PK compuesta `(pet_id, date)` y `date` = **día civil del owner** al computar (comentario `:15-19`, decisión D9 de #10: no se recomputa si el owner cambia de zona). Es el precedente de "guardar la fecha civil del owner como columna `date`" en vez de resolver el rango cada lectura.

Migración: `src/db/migrations/` va de `0000` a `0016_drop_devices_connectivity.sql`; `meta/_journal.json` tiene 17 entradas, la última `idx: 16`, `tag: 0016_drop_devices_connectivity`. **La siguiente es `0017`.** `pnpm db:generate` = `drizzle-kit generate` (`package.json:21`, sin `--name`), que produce `0017_<palabras-aleatorias>.sql`, `meta/0017_snapshot.json` y la entrada del journal; el precedente #93 renombra el `.sql` y el `tag` del journal a mano dejando el `when` y el snapshot como salieron (`specs/drop-devices-connectivity-column/tasks.md:96-103`, `design.md:18-23`). Se aplica con `pnpm db:migrate` desde `backend-pet-tracker/`; `drizzle.config.ts:17` carga `../.env`; **nunca `psql` crudo** (`docs/conventions.md:316-339`). `init.sh` no corre `db:migrate` (`:324-327`), así que el 0017 hay que aplicarlo a mano en `pet_tracker_wt` (5433, este worktree) y, tras el merge, en `pet_tracker` (la base de la otra sesión). Es aditiva: no aplica el aviso de "migraciones destructivas" (`:341-347`). `src/db/migrations.spec.ts:4-15` solo exige ≥1 `.sql`.

## 5. Zona horaria: el helper que ya existe

"Comidas servidas HOY" depende del día civil, y desde #88/#89 ese día es el del **owner de la mascota**, no el del servidor ni el del cliente.

- Helper: `ownerLocalDay(pets: PetRepository, petId, now): Promise<string>` en `src/modules/pets/application/owner-local-day.ts:7-16`; internamente `localDayInZone(raw, now, context)` (`:18-34`) degrada a `'UTC'` con `Logger.warn` si `users.timezone` no es IANA. Necesita `PetRepository.findOwnerTimezone(petId)` (`src/modules/pets/domain/repositories/pet.repository.ts:47-48`; Drizzle en `pet.drizzle.repository.ts:114-130`, primer owner activo por `created_at`). Spec: `owner-local-day.spec.ts`.
- Consumidores actuales: `create-weight.use-case.ts:30`, `get-pet.use-case.ts:69`, `create-vaccine.use-case.ts:33`, `update-vaccine.use-case.ts:36` (los tres últimos citados en `specs/dto-dates-owner-timezone/requirements.md:91-100`, verificado el de pesos y el de get-pet). Activity usa su propio store: `get-daily-activity.use-case.ts:73-74` (`store.findOwnerTimezone` + `localDayOf`).
- Núcleo puro `src/pipeline/local-day.ts`: `localDayOf(tsMs, tz)` (`:58-62`), `localDayRange(day, tz)` → `[startMs, endMs)` (`:68-81`, para filtrar un `timestamptz` por día civil), `isSupportedTimeZone` (`:53-55`), `isCalendarDate` (`:87-96`), `shiftDay` (`:99-105`). Cero dependencias, solo `Intl`.
- `users.timezone`: `varchar(64) NOT NULL DEFAULT 'UTC'` (`src/db/schema/users.schema.ts:12`). El registro **no** valida IANA (`specs/dto-dates-owner-timezone/requirements.md:104-107`), de ahí el fallback.
- Para el que hace la petición (no el owner) existe `requesterLocalDay` (`src/modules/pets/application/requester-local-day.ts`, #89). Para comidas el día correcto es el del **owner** (es la mascota la que come), igual que pesos y vacunas.
- E2E: `seedUser(label, timezone = 'UTC')` en `test/health-weights.e2e-spec.ts:41-60` acepta la zona; el caso Kiritimati/Pago Pago está en `:403-436`. Copiar ese `describe` para "servida hoy en la zona del owner".
- Móvil: `src/screens/home/format.ts:5-11` (`localDayOf`) y `food.tsx:24-29` usan el reloj del dispositivo. La discrepancia cliente/owner ya tiene id: #90 `mobile-owner-timezone-dates`, `pending` (STATUS.md:7). La spec de #83 **no** debe intentar arreglarla: que el cliente **no envíe fecha** (ver §7e) la esquiva.

Recomendación de diseño derivada: que el use case calcule `servedOn = await ownerLocalDay(pets, petId, now)` y lo **persista como columna `date`** (patrón `activity_daily`), en vez de guardar solo `served_at timestamptz` y resolver `localDayRange` en cada lectura. Así la lectura "hoy" es `WHERE pet_id = $1 AND served_on = $2`, la idempotencia es un UNIQUE de base de datos y no hay que reinterpretar filas históricas si el owner cambia de zona (misma decisión D9 de #10).

## 6. Candados que una spec móvil o de backend suele olvidar

Móvil:

- **Longitud del catálogo i18n**: `src/providers/__tests__/language-provider.test.tsx:52-55` asserta `Object.keys(en)` con longitud `260 + 16 + 1 + 4 + 7 + 14 + 2` (= 304 hoy) y mismas claves en `es`. Cada clave nueva (título de la barra, copy del botón "Marcar servida", accesibilidad del contador) suma un término a esa expresión; la spec tiene que decir cuántas y nombrarlas. La tabla de claves vive en `specs/mobile-ui-language/design.md:291` (fila donde #73 añadió `home.unknown`). Claves ya existentes reutilizables: `food.mealsToday` (`src/i18n/catalog.ts:134` / `:443`), `food.mealSchedule` (`:140` / `:449`).
- **Cardinalidad de `reminders-section-body`** (`src/screens/home/index.test.tsx`): `toHaveLength(childCount)` en `:2365` y `:2400` (escenarios por número de recordatorios), `toHaveLength(4)` en `:2431`, `toHaveLength(1)` en `:2816`, `:2828`, `:2846`, y el R3 de #70 en `:3459-3474`. También el orden `body.children[0] === reminders-next-vaccine` (`:2333-2345`, `:2433`). Si la barra entra como hijo del body (como en el Make), **todos** cambian de número; la spec debe enumerarlos y dar el nuevo recuento por escenario (con plan / sin plan / cargando), no un delta genérico.
- **Estructura de la sección** `section.children` = 2 (`:2979-2984`): no cambia si la barra va dentro del body.
- **Tipo `PetProfile` leído del fuente**: `:3200-3210` asserta `nextReminder: unknown;` y `activitySummary: unknown;` dentro del bloque `PetProfile` de `types.ts`; añadir otro campo no lo rompe mientras esos dos sigan.
- **Fixtures tipadas `PetProfile`**: `makePet(): PetProfile` u objetos tipados en 11 ficheros de test (`src/app/(tabs)/__tests__/food.test.tsx:15`, `health.test.tsx`, `map.test.tsx`, `src/screens/home/index.test.tsx`, `profile/index.test.tsx`, `reminders/index.test.tsx`, `pairing/index.test.tsx`, `docs/index.test.tsx`, `src/hooks/use-pet-selection.test.tsx`, `src/components/__tests__/pet-switcher.test.tsx`, `pet-hero-header.test.tsx`) más producción `src/components/pet-switcher.tsx`, `pet-hero-header.tsx`, `src/screens/profile/index.tsx`. Un campo **obligatorio** nuevo en `PetProfile` rompe el typecheck en los 11; la spec debe inventariarlos o declarar el campo como `X | null` y aun así añadirlo a cada fixture (sigue siendo obligatorio para TS).
- **Enmienda #70 de la carta** (`docs/ui-guidelines.md:308-352`): la barra es un elemento nuevo en una sección de elementos repetidos; hay que candar dato, icono, copy, nombre accesible, fondo, tinta, receta tipográfica de cada texto, condición de render (con/sin plan, cargando), forma del contenedor y orden de hijos, con `children.length` y nunca contando `testID`. Tokens: acento como tinta = `--accent-strong`, como fondo = `--accent` (`:120-133`); radios `rounded-xl`/`rounded-full` (`:134-156`); cero hex y cero clases arbitrarias (`:66-71`). El Make usa `#2AB87C` para la barra (`App.tsx:443`): en el repo es `bg-accent`.
- **Jest y `(tabs)`**: cualquier comando dirigido a `src/app/(tabs)/__tests__/food.test.tsx` va con paréntesis escapados o `--runTestsByPath`; sin escapar salta el fichero en silencio con exit 0 (memoria `jest-paths-con-parentesis`, incidente de #63).
- `src/api/__tests__/query-keys.test.ts` enumera factories en `cases` (`:15-`) pero no comprueba exhaustividad; una `mealKeys` nueva solo necesita un caso si la spec lo pide.

Backend:

- **`MockOf<T>`** (= `{ [K in keyof T]: jest.Mock }`, `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts:40`) existe para `PetRepository` en ese mismo fichero (`:109`, `:208`, `:215`), para `AlertsEngineStore`, `IngestionStore`, `WialonClient`, `PushSender`, `PushTokenRepository`, `AlertRepository`, `AuditLogger`. **No existe** para `NutritionRepository` ni `WeightRepository`. Consecuencia: si la spec añade un método a `PetRepository`, el doble de alerts-engine deja de compilar; si lo añade a `NutritionRepository` o crea un puerto nuevo, no. Recomendación: no tocar `PetRepository`; el conteo del día va en un puerto nuevo o en `NutritionRepository`.
- **Dobles parciales de `GetPetUseCase`**: `get-pet.use-case.spec.ts:38-55` construye `pets`, `deviceReader`, `photoUrlResolver`, `vaccineReader` con `as unknown as`; un cuarto puerto inyectado obliga a añadirlo ahí (fallo en runtime, no en typecheck).
- **Lista exacta de claves del perfil** en cuatro sitios: `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts:40-65`, `test/pets.e2e-spec.ts:64-89` (`PROFILE_KEYS`), `test/devices.e2e-spec.ts:800-820`, `test/device-subscriptions.e2e-spec.ts:335-352`. Un campo nuevo en `PetProfileResponse` cambia los cuatro; la spec debe nombrarlos y dar la lista completa nueva.
- **Migración por número**: nada cuenta migraciones ni tablas en tests. La cifra "20 tablas" de `specs/drop-devices-connectivity-column/requirements.md:65` es prosa de una spec cerrada, y "14 de las 29 suites e2e" en `docs/conventions.md:283-296` también es prosa (habría que actualizarla a 30 si se añade `test/meals.e2e-spec.ts`).
- **Auditoría**: `action` libre (`audit-log.repository.ts:7`), sin enum ni check; convención `<entidad>.<verbo>`.

## 7. Decisiones abiertas para el humano

### (a) Una feature o dos

Opciones: (1) una sola feature #83 con backend + móvil en la misma branch; (2) #83 = backend (tabla, endpoint, hueco en el perfil, e2e) y una feature móvil nueva (id 97, el máximo hoy es 96) bloqueada por la de backend.

Recomendación: **(2)**. Razones verificables: las dos pilas viven en sesiones y worktrees distintos por convención (`CLAUDE.md` §Un solo escritor; precedente #66 "hay que coordinarla con la sesion que lleva backend", `feature_list.json` #66); la parte móvil arrastra por sí sola una docena de candados (§6) y la enmienda #70 de la carta; el gate humano del backend puede ser un `curl` (POST + GET perfil), y el smoke "con una mascota con plan" que pide el criterio 4 solo tiene sentido con la barra pintada, es decir, en la móvil. Coste: dos gates y dos PRs. Lo que #83 dijo al abrirse ("las dos piezas carecen de sentido por separado") se refiere al **modelo** (registro + total), y las dos piezas de modelo quedan juntas en el backend.

### (b) Modelo: tabla de eventos vs contador diario

Opciones: (1) `meal_servings` con `served_at timestamptz` y `source`; (2) contador `(pet_id, day, count)` con upsert; (3) `meal_servings` con `served_on date` (día civil del owner) + `meal_time`.

Recomendación: **(3)**: `meal_servings(id uuid PK, pet_id uuid FK cascade, served_on date NOT NULL, meal_time varchar(5) NOT NULL, served_at timestamptz NOT NULL DEFAULT now(), created_by uuid FK users NOT NULL)`, `UNIQUE (pet_id, served_on, meal_time)`, índice `created_by`. Por qué: `food.tsx` pinta **badge por franja** (`meal-served-<index>`, `:214-219`), así que el registro tiene que saber qué franja se sirvió, y el contador (2) no lo sabe; la unicidad por franja es una restricción de base de datos en vez de lógica de aplicación (ponytail: constraint antes que código); `served_on` calculado con `ownerLocalDay` sigue el precedente `activity_daily` (§5) y hace que "hoy" sea una igualdad; deshacer es `DELETE` por id. `source` se omite: hoy solo hay un escritor (el botón); se añade cuando exista un segundo (recordatorio). Efecto colateral a decidir por escrito: si el plan se regenera con otras `meal_times`, las filas viejas del día quedan fuera del plan; el contador del día debería contar solo `meal_time ∈ plan.mealTimes` vigente (filtro en el lector) para no superar el total.

### (c) De dónde sale `totalMeals` para la Home

Opciones: (1) copiar `meals_per_day` a `pets` (dos escritores, drift); (2) devolver el plan entero dentro de `PetProfileResponse` (pesa, duplica el DTO de nutrición); (3) hueco `mealsToday: { served: number; total: number } | null` en `PetProfileResponse` calculado en `GetPetUseCase` vía un puerto de lectura nuevo `PET_MEALS_READER` (adaptador en `modules/nutrition/`, módulo `PetMealsReadModule`, exactamente como `PET_VACCINE_READER`, §3), `null` si no hay plan; (4) endpoint `GET /v1/pets/:petId/meals/today` y una petición más desde la Home.

Recomendación: **(3)**. Es el patrón vigente (`get-pet.use-case.ts:69-75` ya tiene `today` del owner y un lector por dominio), cumple el criterio 2 literal ("sin que el cliente tenga que pedir el plan aparte") y respeta R15 de #70 (`specs/mobile-home-reminders-section/requirements.md:645`: cero llamadas nuevas desde la Home) y la tercera aserción de su R3 (la Home no importa `api/nutrition`). Solo en el detalle, no en el listado (`pets.controller.ts:78-88`; #66 D4). Coste conocido: cuatro listas de claves (§6) + `PetProfile` en `types.ts` + 11 fixtures. `food.tsx` sigue leyendo el plan (necesita `mealTimes`) y además el estado servido por franja: para eso el `GET /v1/pets/:petId/nutrition-plan` puede devolver `servedToday: string[]` (las `meal_time` servidas hoy) o el cliente puede leer `mealsToday` del perfil; la spec debe elegir una y fijar qué query se refresca tras el POST (`petKeys.detail` y/o `nutritionKeys.plan`).

### (d) Quién registra la comida

Opciones: (1) botón por fila en `food.tsx` (el Make lo tenía, `progress/explore_design-gap-vs-make.md:432` cita `MealScheduleScreen:1489`); (2) recordatorio completado; (3) ambos.

Recomendación: **(1)**. (2) no es posible sin otra feature: `reminders.status` admite solo `scheduled | sent | cancelled` (`src/db/schema/reminders.schema.ts:43-46`) y el PATCH solo acepta `status: 'cancelled'` o cambios de campos (`src/modules/reminders/application/dto/reminder.dto.ts:33-34`, `:47`); en móvil la única acción es cancelar (`src/screens/reminders/index.tsx:388`). Un `type: 'food'` existe (`reminders.schema.ts:36`; `src/utils/reminder-meta.ts:34`) pero no hay "completar". Segunda decisión dentro de esta: **rol**. Todas las escrituras vecinas son `@RequirePetRole('owner')` (`weights.controller.ts:35`, `nutrition.controller.ts:43,67`); servir la comida la hace también `family`/`walker` (`PetRole` en `pet-membership.ts:1`). Opciones: owner-only por coherencia, o cualquier miembro activo (`PetAccessGuard` sin `@RequirePetRole`, `pet-access.guard.ts:57,70`) con `created_by` como rastro. Mi inclinación: cualquier miembro activo, pero rompe el patrón y lo decide el humano.

### (e) Idempotencia y límites

- Doble toque en la misma franja: UNIQUE `(pet_id, served_on, meal_time)`; mapear la violación a `409 MEAL_ALREADY_SERVED` (la Home y `food.tsx` refrescan y quedan bien) o responder `200` con la fila existente. Recomendación: 409 (más fácil de probar en e2e y no esconde un doble envío).
- Más comidas que `meals_per_day`: validar `meal_time ∈ plan.mealTimes` del plan vigente (`422 MEAL_TIME_NOT_IN_PLAN`); sin plan, `422 NUTRITION_PLAN_REQUIRED` (misma tabla de `nutrition-error.mapper.ts`). Con eso el máximo es el propio plan, sin contador.
- Body mínimo: `{ mealTime: 'HH:MM' }` con `z.strictObject` y regex `^\d{2}:\d{2}$`. **El cliente no manda fecha**: el día lo pone el servidor con `ownerLocalDay(now)`. Evita reproducir el problema de #90 (fecha civil del dispositivo) y una validación "hoy/mañana" como la de pesos.
- Deshacer: `DELETE /v1/pets/:petId/meals/:id` (o por `mealTime` del día). Recomendación: incluirlo; es un handler, un método de repo y un `describe` e2e, y sin él un toque equivocado deja el día mal hasta medianoche. Si el humano prefiere aplazarlo, que quede como feature con id.
- Auditoría: `meal.serve` / `meal.unserve` con `meta: { petId, mealTime, servedOn }`, mismo molde que `weight.create` (`create-weight.use-case.ts:46-52`).

## 8. Riesgos

- **Mascotas compartidas**: el día civil es el del **owner** (`findOwnerTimezone` = primer owner activo, `pet.drizzle.repository.ts:114-130`); un `family` en otra zona verá en `food.tsx` badges por reloj de su dispositivo (`:24-29`) y en la Home un contador por día del owner. Es la deuda #90, ya abierta; la spec de #83 la cita y no la resuelve. Si el owner cambia de zona, las filas `served_on` históricas no se recomputan (decisión D9 de #10, `activity.schema.ts:15-19`), aceptable por escrito.
- **Mascota sin plan de nutrición**: `findLatestPlan` devuelve `null` (`nutrition.drizzle.repository.ts:71-79`); el hueco del perfil debe ser `null` y la Home no pinta la barra (misma condición de render que `nextVaccine`); el POST responde 422. El plan requiere perfil + peso (`nutrition.e2e-spec.ts:361-435`): el fixture e2e y el smoke deben crear ambos antes.
- **Plan regenerado a mitad de día**: `generate` inserta fila nueva solo si cambia el hash (`R21`, `nutrition.e2e-spec.ts:330-359`); si cambian `meal_times`, las servidas de la mañana pueden quedar fuera del plan nuevo. Decidir en (b).
- **Cuatro listas de claves del perfil + 11 fixtures móviles** (§6): es el coste real de la opción (c)(3); si se omite alguno, el gate sale rojo y Codex lo "arregla" a su manera.
- **Retirar el candado R3 de #70** (`index.test.tsx:3459-3474`) sin retirar su tercera aserción (no importar `api/nutrition`).
- **Migración 0017 en dos bases**: `pet_tracker_wt` (5433, este worktree) y `pet_tracker` (sesión Frontend) — con `pnpm db:migrate`, nunca `psql` (`docs/conventions.md:316-339`); `init.sh` no la aplica (`:324-327`). Aditiva, no rompe a la otra sesión.
- **E2E solo Postgres**: una suite `meals` no toca LocalStack, así que puede correr en paralelo con la otra sesión sin aviso (`docs/conventions.md:283-296`); comprobar `pgrep -af 'init\.sh|test:e2e|jest-e2e'` antes de un gate (`:298-307`).
- **Flakes conocidos**: #72 `mobile-add-pet-photo-test-flake`, `pending` (`src/screens/add-pet/index.test.tsx`, "uploads a chosen preview…"), tumba corridas completas de `init.sh` sin relación con la feature (`progress/history.md:3314-3326`, `:3768`, `:3856`); reintento dirigido verde y repetición integral es el protocolo que se ha usado (`:3041`). #76 (`health-vaccines.e2e-spec.ts` orden sin `ORDER BY`) está `done`. No encontré en `progress/history.md` un flake registrado de `alerts` (grep `-i flake` no lo lista); si el leader lo conoce, no está escrito.
- **`.expo/types/router.d.ts` gitignorado** rompe el typecheck móvil con rutas fantasma (memoria `expo-router-types-obsoletos`); #83 no añade rutas, pero conviene borrarlo antes del gate.
- **Constantes congeladas**: no copiar `304` claves ni "17 migraciones" en la spec; expresar el candado i18n como `+ N` sobre la expresión de `language-provider.test.tsx:55` y la migración como "la siguiente al journal" con su `tag` renombrado.

## Recomendación

Partir en dos (backend #83, móvil nueva). Backend: tabla `meal_servings` con `served_on` = `ownerLocalDay` y UNIQUE por franja; `POST /v1/pets/:petId/meals { mealTime }` y `DELETE …/:id` en un `MealsController` dentro de `src/modules/nutrition/` (donde `files_affected` ya apunta), errores 422/409 en `nutrition-error.mapper.ts`; hueco `mealsToday: { served, total } | null` en `PetProfileResponse` vía puerto `PET_MEALS_READER` + `PetMealsReadModule`, calcado de `PET_VACCINE_READER`; e2e `test/meals.e2e-spec.ts` calcado de `health-weights.e2e-spec.ts` con el fixture perfil+peso+generate de `nutrition.e2e-spec.ts`. Móvil (después del merge): botón por fila en `food.tsx` que reemplaza `mealTime <= hhmm`, barra en `reminders-section-body` tras `reminders-next-vaccine` con `mealsToday` del perfil, y el inventario completo de candados de §6. Ninguna de las dos toca `PetRepository` ni añade dependencias.

Decisiones que el humano debe cerrar antes de que `spec_author` escriba: (a) partir o no; (d) rol que puede servir; (e) 409 vs idempotente y si entra el DELETE; (b) qué hacer con franjas fuera del plan vigente.
