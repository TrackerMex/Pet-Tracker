# explore: meals-history (#105)
Fecha: 2026-10-03
Base congelada: origin/main d29d49d5 (branch feature/105-meals-history, worktree principal)

Caso de uso cerrado por el humano (no reabrir): calendario navegable mes a mes
de comidas servidas, marcador por día, detalle al tocar un día. Subpantalla del
stack entrada desde la pestaña de comidas. No es tab nuevo.

Todas las rutas son relativas a la raíz del repo. Se cita por símbolo o por
contenido grepeable; los números de línea no son ancla.

## Contexto encontrado

### Backend: puerto MealServingRepository y sus implementaciones/dobles

- Puerto: `backend-pet-tracker/src/modules/nutrition/domain/repositories/meal-serving.repository.ts`
  exporta `MEAL_SERVING_REPOSITORY`, `NewMealServing { petId, servedOn, mealTime, createdBy }`
  e interfaz `MealServingRepository` con exactamente tres métodos:
  `create(data)`, `deleteOne(petId, servedOn, mealTime)`,
  `listTimesServedOn(petId, servedOn): Promise<string[]>`.
- **Una sola implementación** en `src/`: `infrastructure/repositories/meal-serving.drizzle.repository.ts`
  (`MealServingDrizzleRepository implements MealServingRepository`). No hay
  in-memory ni fake en `test/`. La premisa "dos implementaciones" del encargo
  es falsa en el árbol: la "segunda" que existe es otro puerto distinto
  (`PetMealsReader`, ver sección lector pet-meals), no una segunda impl del
  mismo puerto. `listTimesServedOn` hace
  `select({ mealTime }).from(mealServings).where(and(eq(petId), eq(servedOn)))`
  sin `orderBy` — el orden lo da el índice/heap, no está garantizado.
- Ficheros que nombran el símbolo `MealServingRepository` / `MEAL_SERVING_REPOSITORY`
  (grep en `src` y `test`, 8 ficheros):
  `nutrition.module.ts` (provider `useClass: MealServingDrizzleRepository`),
  el puerto, la impl drizzle, `serve-meal.use-case.ts`, `unserve-meal.use-case.ts`,
  `get-nutrition-plan.use-case.ts`, `serve-meal.use-case.spec.ts`,
  `unserve-meal.use-case.spec.ts`.
- **Cómo se dobla el puerto en nutrition:** fake parcial con cast:
  `const meals = { create } as unknown as MealServingRepository;` (serve-meal spec)
  y `const meals = { deleteOne } as unknown as MealServingRepository;` (unserve spec).
  Añadir un método al puerto **no rompe el typecheck** de estos specs.
- `MockOf<T> = { [K in keyof T]: jest.Mock }` (exhaustivo, rompe al añadir
  método) existe solo en `src/workers/*.spec.ts`, `users/.../push-token.use-cases.spec.ts`
  y `alerts/.../{ack,list}-alert.use-case.spec.ts`. Ninguno dobla `MealServingRepository`.
- **No existe `get-nutrition-plan.use-case.spec.ts`** (los specs de use-case en
  nutrition son: add-meal-time, move-meal-time, serve-meal, unserve-meal). El
  único consumidor de `listTimesServedOn` es `GetNutritionPlanUseCase.execute`.
- Entidad: `domain/entities/meal-serving.entity.ts` exporta `MealServing`
  (campos `id, petId, servedOn, mealTime, servedAt, createdBy`) y las funciones
  puras `servedInPlan(plan.mealTimes, served)` y `kcalConsumed(merKcal, mealsPerDay, n)`.

### Backend: schema drizzle y migración de meal_servings

- Schema: `backend-pet-tracker/src/db/schema/nutrition.schema.ts`, tabla
  `mealServings = pgTable('meal_servings', ...)` con
  `servedOn: date('served_on').notNull()` (drizzle `date` en modo por defecto
  `string` → el repo recibe/devuelve `'YYYY-MM-DD'` como string, sin Date),
  `mealTime: varchar('meal_time', { length: 5 })`,
  `servedAt: timestamp('served_at', { withTimezone: true })` default now.
- Migración: `src/db/migrations/0017_meal_servings.sql`:
  `"served_on" date NOT NULL`, FK `pet_id → pets(id) ON DELETE cascade`,
  FK `created_by → users(id)`.
- Índices existentes sobre `meal_servings`:
  - `meal_servings_pet_id_served_on_meal_time_idx` UNIQUE btree `(pet_id, served_on, meal_time)`
  - `meal_servings_created_by_idx` btree `(created_by)`
  Una consulta `pet_id = ? AND served_on BETWEEN ? AND ?` usa el índice único
  como índice de rango por prefijo; **no hace falta migración ni índice nuevo**.
- `nutritionPlans.mealTimes: jsonb('meal_times').$type<string[]>()` — el
  schedule vive como array en la fila del plan vigente; no hay tabla de
  histórico de mealTimes.

### Backend: controller, DTOs, scope, mapper de errores

- `src/modules/nutrition/infrastructure/meals.controller.ts`:
  `@Controller('pets/:petId/meals')` + `@UseGuards(PetAccessGuard)`. Solo tiene
  `@Post()` (`serve`) y `@Delete(':mealTime')` (`unserve`, 204). **No hay ningún
  GET en este controller.** Usa `request.petMembership.petId`, `new Date()` como
  `now` en el controller, `try { ... } catch (error) { throw mapNutritionError(error) }`,
  y helpers locales `parseBody<T>(schema, body)` / `validationError(issues)`
  que producen `400 { statusCode, message: 'Validation failed', errors: [{ path, message }] }`.
- El GET de nutrición vive en `nutrition.controller.ts` (`@Controller('pets/:petId')`):
  `@Get('nutrition-plan')` → `latestPlan` llama `getPlan.execute(petId, new Date())`
  y responde `NutritionPlanTodayResponse` (plan + `servedToday: string[]` +
  `kcalConsumedToday`). Ese es el GET existente que devuelve lista de horas
  servidas (solo de hoy). Patrón de lista con `@Query`: `health/infrastructure/weights.controller.ts`
  `@Get() list(@Req() request, @Query() query: unknown)` con
  `parseQuery<ListWeightsQueryDto>(ListWeightsQuerySchema, query)`.
- DTOs: `application/dto/meal.dto.ts` — `ServeMealSchema = z.strictObject({ mealTime: regex MEAL_TIME_PATTERN })`,
  `EditMealTimeSchema` con `STRICT_MEAL_TIME_PATTERN`. Todo zod v4 `z.strictObject`
  (clave desconocida = 400).
- Mapper de respuesta: `infrastructure/mappers/nutrition.mapper.ts` —
  `MealServingResponse { id, petId, servedOn, mealTime, servedAt, createdBy }`
  y `toMealServingResponse(serving)`. `NutritionPlanTodayResponse` ahí mismo.
- Mapper de errores: `infrastructure/mappers/nutrition-error.mapper.ts`
  `mapNutritionError(error)`: cadena `instanceof` → `{ statusCode, code, message }`.
  Códigos existentes: `NUTRITION_PLAN_REQUIRED`, `MEAL_TIME_NOT_IN_PLAN` (422),
  `MEAL_ALREADY_SERVED` (409), `MEAL_SERVING_NOT_FOUND`, `NUTRITION_PLAN_NOT_FOUND`,
  `NUTRITION_PROFILE_NOT_FOUND` (404), `NUTRITION_PROFILE_REQUIRED`,
  `PET_WEIGHT_REQUIRED`, `MEAL_TIME_DUPLICATE`, `MEAL_TIMES_LIMIT_REACHED` (422).
  No hay ningún código de rango/fecha en nutrition.
- **Scope petId→usuario:** lo hace `PetAccessGuard`
  (`src/modules/pets/infrastructure/guards/pet-access.guard.ts`, `canActivate`:
  `pets.findMembership(petId, request.user.id)` → `NotFoundException` si no hay
  membresía, `ForbiddenException` según rol; deja `request.petMembership = { petId, role }`).
  Su spec: `pet-access.guard.spec.ts` en el mismo directorio.
  **Premisa falsa del encargo:** `src/modules/nutrition/nutrition-scope.spec.ts`
  NO prueba scope de petId; es el candado R26 de #17 ("sin dependencia openai
  ni env OPENAI_"). No hay nada que ampliar ahí.

### Backend: lector pet-meals (findMealsToday)

- Puerto: `src/modules/pets/domain/ports/pet-meals-reader.ts`
  `PetMealsReader.findMealsToday(petId, day): Promise<PetMealsToday | null>`
  (`{ served, total }`). Impl: `src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts`
  (`PetMealsDrizzleReader`), exportada por `src/modules/nutrition/pet-meals-read.module.ts`.
- Único consumidor: `src/modules/pets/application/use-cases/get-pet.use-case.ts`
  (`mealsToday: await this.mealsReader.findMealsToday(petId, today)`), para
  el resumen de la ficha de mascota.
- **Su doble es exhaustivo y tipado:** `get-pet.use-case.spec.ts` hace
  `const mealsReader: PetMealsReader = { findMealsToday };` — añadir un método
  a `PetMealsReader` rompe el typecheck de ese spec.
- Recomendación clara: el rango **no** va en `PetMealsReader` (es un puerto de
  lectura cruzada pets→nutrition para la ficha). Va en `MealServingRepository`
  del módulo nutrition, que es donde vive la consulta y cuyos dobles son
  parciales.

### Backend: endpoints de rango existentes en otros módulos

- **Análogo más cercano (copiar este patrón):** `GET /v1/pets/:petId/activity/daily?from&to`
  - Controller: `src/modules/activity/infrastructure/activity.controller.ts`
    `@Get('daily')`, `parseDailyQuery(request.query)` exportada (zod strict →
    400 genérico `Validation failed`), `mapActivityError`.
  - DTO: `application/dto/get-daily-activity.dto.ts`
    `GetDailyActivityQuerySchema = z.strictObject({ from: z.string().optional(), to: z.string().optional() })`.
    El formato **no** se valida en zod a propósito: lo valida el dominio para
    poder responder con `code`.
  - Use case `get-daily-activity.use-case.ts` `execute(input, now)`:
    `assertCalendarDate(from)`, `assertCalendarDate(to)`, `assertRange(from, to)`
    antes de cualquier I/O; `timeZone = store.findOwnerTimezone(petId)`;
    `today = localDayOf(now, timeZone)`; `toDay = to ?? today`;
    `fromDay = from ?? shiftDay(toDay, -(ACTIVITY_DEFAULT_RANGE_DAYS - 1))`;
    `listDays(fromDay, toDay)` rellena huecos (día sin fila → entrada `missing`).
  - Constantes: `src/modules/activity/activity.constants.ts`
    `ACTIVITY_MAX_RANGE_DAYS = 31`, `ACTIVITY_DEFAULT_RANGE_DAYS = 7`.
  - Errores de dominio: `domain/errors/activity.errors.ts` `InvalidDateError`,
    `InvalidRangeError`, `RangeTooLargeError`; mapper
    `infrastructure/mappers/activity-error.mapper.ts` → 400 con `code`
    `INVALID_DATE` ('Dates must be calendar days YYYY-MM-DD'), `INVALID_RANGE`
    ('from must not be after to'), `RANGE_TOO_LARGE`.
  - Ese controller lleva además `PetTrackingGuard` (no aplica a meals).
- Trips: `application/dto/list-trips.dto.ts` `ListTripsQuerySchema = z.strictObject({ date: z.string().optional() })`
  — un solo día civil `YYYY-MM-DD`, `INVALID_DATE` desde el dominio.
- Positions: `positions/application/dto/list-positions.dto.ts`
  `from/to: z.iso.datetime({ offset: true }).optional()` — instantes ISO, no
  días; no es el patrón para un calendario.
- Weights: `health/application/dto/weight.dto.ts` `ListWeightsQuerySchema { limit: coerce.number().int().min(1).max(WEIGHTS_MAX_LIMIT=100).default(50) }` — paginado por límite, sin rango.
- No existe en todo el backend ningún query param `month`. Las dos
  convenciones vivas son `from`/`to` (días civiles) y `date` (un día).
- Helpers reutilizables en `src/pipeline/local-day.ts`: `localDayOf(tsMs, tz)`,
  `localDayRange(day, tz)`, `isCalendarDate(value)` (rechaza `2026-02-30`),
  `shiftDay(day, n)`, `listDays(fromDay, toDay)` (ambos incluidos, sin huecos).

### Backend: zona horaria de servedOn

- `servedOn` **lo decide el servidor, no el cliente**: `ServeMealUseCase.execute`
  hace `const servedOn = await ownerLocalDay(this.pets, petId, now)`; el body
  de `POST /meals` es solo `{ mealTime }` y una clave extra `servedOn` es 400
  (candado R6 de `test/meals.e2e-spec.ts`).
- `ownerLocalDay` (`src/modules/pets/application/owner-local-day.ts`) →
  `pets.findOwnerTimezone(petId)` (campo `users.timezone` del owner, default
  `'UTC'`) y `localDayInZone(raw, now, ctx)`: si la zona no es IANA soportada,
  cae a `'UTC'` con `logger.warn`. `GetNutritionPlanUseCase` usa el mismo
  `ownerLocalDay` para `servedToday`.
- Precedentes citables: `specs/meals-served-tracking/requirements.md` R2
  ("POST inserta con el dia civil del owner", casos `Pacific/Kiritimati` UTC+14
  y `Pacific/Pago_Pago` UTC-11), `specs/vaccine-applied-at-owner-timezone` y
  `specs/vaccine-due-today-inclusive` (ambas corrigen el "día civil UTC del
  reloj del servidor" al día civil del owner).
- Consecuencia para el calendario: el backend grabó `servedOn` en el día civil
  del **owner**, no del dispositivo que servía (un miembro en otra zona
  horaria sirve y queda apuntado en el día del owner). El móvil debe pintar
  cada fila en la celda del `servedOn` literal (string `YYYY-MM-DD`), **sin
  pasarlo por `new Date(servedOn)`** (eso lo interpretaría como UTC medianoche
  y en zonas negativas lo movería al día anterior). Y "hoy" para marcar el
  límite superior del calendario: el móvil solo conoce el reloj del
  dispositivo; si el owner está en otra zona o el usuario es un miembro,
  puede diferir del "hoy" del backend (ver riesgos).

### Backend: tests e2e de nutrición

- Ficheros: `backend-pet-tracker/test/meals.e2e-spec.ts` ('Meals served tracking (e2e)',
  R-ids de `meals-served-tracking #83` y de `nutrition-kcal-consumed`),
  `test/meal-times.e2e-spec.ts`, `test/nutrition.e2e-spec.ts`. No hay `test/fixtures/` con contenido.
- Autenticación: no hay login; `seedUser(label, timezone = 'UTC')` inserta en
  `users` vía drizzle (`passwordHash: 'not-used'`, `timezone`) y firma el JWT
  con `TOKEN_SERVICE` (`tokens.sign({ sub: id, email })`); header
  `Authorization: Bearer <token>`. `seedPet(owner)` hace `POST /v1/pets`;
  `grantMembership` inserta en `petUsers`.
- Plan: `seedPlan(owner, petId, timezone)` = `postWeight` (`PUT`/`POST` weight con
  `measuredAt: localDayOf(Date.now(), timezone)`) + perfil + `POST nutrition-plan/generate`.
- Siembra de servings pasados: inserción directa
  `db.insert(mealServings).values({ ..., servedOn: shiftDay(localDayOf(Date.now(), 'UTC'), -1), ... })`
  (tres sitios en el fichero). Ese es el patrón para sembrar un mes de
  historial: insertar filas con `servedOn` arbitrario sin pasar por el POST.
- Limpieza en `afterAll` por `inArray(users.id, userIds)` (cascade a pets → meal_servings).

### Móvil: route delgado, stack y candados de detail-stack

Rutas relativas a `mobile-pet-tracker/`.

- **Entrada actual a meal-schedule:** `src/app/(tabs)/food.tsx` (pantalla
  completa en el route, anterior a #39, **no** delgada) navega con
  `onPress={() => router.push('/meal-schedule' as Href)}` sobre un
  `Card testID="meal-schedule-link"` con subtítulo `food.mealScheduleLinkSubtitle`.
  Candado: `src/app/(tabs)/__tests__/food.test.tsx`
  `fireEvent.press(getByTestId('meal-schedule-link'))` +
  `expect(mockRouter.push).toHaveBeenCalledWith('/meal-schedule')`.
- **Route delgado modelo:** `src/app/meal-schedule.tsx` es exactamente
  `import { MealScheduleScreen } from '../screens/meal-schedule'; export default function MealScheduleRoute() { return <MealScheduleScreen />; }`.
- **Pantalla modelo:** `src/screens/meal-schedule/index.tsx`
  `export function MealScheduleScreen()` → `const { selectedPetId } = useSelectedPet()`;
  `if (selectedPetId === null) return <Redirect href="/food" />;` y delega en
  `MealScheduleContent({ petId })`. Raíz `ScrollView testID="screen-meal-schedule"`
  con `contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}`
  (enmienda A11 de `docs/conventions.md` §Móvil). Skeletons
  `meal-schedule-summary-skeleton` / `meal-schedule-meals-skeleton` /
  `meal-schedule-action-skeleton`; error inline `Text testID="meal-schedule-error"`
  + `Button testID="meal-schedule-retry"`. Queries: `nutritionKeys.plan(petId)`,
  `nutritionKeys.profile(petId)`, `petKeys.detail(petId)`.
  Su test `src/screens/meal-schedule/index.test.tsx` mockea `../../api/nutrition`,
  `../../api/pets`, `expo-router`, `@expo/ui`, `react-native-safe-area-context`,
  `reicon-react-native`; describes `R7`, `R8`, `#62 R5`, `#87 R11`,
  `#95 R5` ("la pantalla no dibuja cabecera propia"), `#147 R4`–`R8`.
- **Stack raíz** `src/app/_layout.tsx`: `<Stack screenOptions={{ headerShown: false }}>`
  con `index`, `(tabs)`, `(auth)`, `reset-password` abiertas y luego
  `<Stack.Protected guard>` en este orden: `add-reminder`, `pets/add`,
  `pets/[petId]/docs`, `weight-log`, `meal-schedule`
  (`options={{ ...headerOptions, title: t('mealSchedule.mealSchedule') }}`),
  `pairing`, `reminders`, `alerts` (`dangerouslySingular`), `alerts/[alertId]`,
  `pets/[petId]/geofences`, `pets/[petId]/geofence-editor`.
  Rutas planas kebab-case sin carpeta (`weight-log`, `meal-schedule`); las
  anidadas existentes son solo `pets/[petId]/*` y `alerts/[alertId]`.
- **Candados del stack raíz que una ruta nueva toca** (todos en `src/app/__tests__/`):
  - `layout.test.tsx` `it('declara cuatro rutas abiertas y las seis de detalle bajo una guarda')`:
    `expect(children).toHaveLength(5)` y
    `Children.toArray(protectedGroup.props.children).slice(0, 6)` igual a la
    lista de tuplas `[Stack.Screen, 'add-reminder'] … [Stack.Screen, 'pairing']`
    (comentario `#114 R1: reminders y alerts van detrás`). Insertar la ruta
    nueva **entre** `meal-schedule` y `pairing` rompe el candado; detrás de
    `pairing` el `slice(0, 6)` no la ve. Mismo fichero:
    `it.each([... ['weight-log', 't:weightLog.weightLog'], ['meal-schedule', 't:mealSchedule.mealSchedule'], ['pairing', ''] ])('%s usa exactamente las opciones de cabecera acordadas')`
    (describe `#95 R4`) y `it('declara ocho rutas protegidas y alerts singular')`
    — spec_author debe grep ese `it` y ver qué cuenta antes de fijar la posición.
  - `detail-stack.test.tsx`: `#95 R2` `it.each` de seis `[route, oldRoute, modulePath]`
    con `toContain(\`from '${modulePath}'\`)`; `#114 R1` fija el directorio
    `(tabs)` **exactamente** a `['__tests__','_layout.tsx','food.tsx','health.tsx','home.tsx','map.tsx','profile.tsx']`
    (la ruta nueva no puede vivir en `(tabs)`); describes por ruta `#100 R2`,
    `#41 R4`, `#146 R5` son el precedente para un `describe('#105 R<n> …')` propio.
  - `detail-stack.navigation.test.tsx` `#95 R2`: bucle
    `for (const [href, name] of [['/add-reminder','add-reminder'], … ['/meal-schedule','meal-schedule'], ['/pairing','pairing']])`
    con `rootStack(app)` toEqual — lista cerrada de seis (usa `renderRouter`).
  - `detail-stack.guard.test.tsx` `#95 R3`: lista `'/add-reminder' … '/meal-schedule', '/pairing'`
    de rutas que redirigen sin sesión.
  - `renderRouter` solo se usa en `src/app/__tests__/*.navigation.test.tsx` y
    `*.guard.test.tsx` y `*.notification.test.tsx`; los tests de pantalla
    (`src/screens/*/index.test.tsx`) mockean `expo-router`.

### Móvil: api/nutrition.ts, http.ts, query-keys.ts y sus tests

- `src/api/http.ts` exporta `apiUrl`, `getJson(baseUrl, path, token, fetchFn)`,
  `postJson`, `patchJson`, `deleteJson`, `readJson`, tipo `GetResult`.
- `src/api/nutrition.ts` patrón a clonar:
  `getNutritionPlan(baseUrl: string | undefined, token, petId, fetchFn = fetch): Promise<NutritionPlanState>`
  con `getJson(baseUrl, \`/pets/${petId}/nutrition-plan\`, token, fetchFn)`,
  union discriminada `kind: 'ok' | 'not-found' | 'unauthorized' | 'error' | 'unreachable' | 'missing-config'`,
  guardas `isObjectBody` / `readJson`. Test `src/api/__tests__/nutrition.test.ts`
  (describes `R1`–`R3`, `#98 R2`, `#147 R2/R3`) con `fetchFn` inyectado.
- **Query string, precedentes vivos:** `src/api/health-records.ts`
  `const query = limit === undefined ? '' : \`?limit=${limit}\`;` y
  `src/api/alerts.ts` `const params = new URLSearchParams();`.
  `src/api/activity.ts` llama a `getJson` **sin** `from/to` (consume el rango
  por defecto del backend): no hay cliente móvil de rango de días todavía.
- Tipos en `src/api/types.ts`: `NutritionPlan { id, petId, rerKcal, merKcal, dailyGrams, mealsPerDay, mealTimes: string[], objective, warnings, aiExplanation, generatedAt, servedToday: string[], kcalConsumedToday }`.
  `generatedAt` es el único ancla temporal del plan que el móvil ya conoce.
- `src/api/query-keys.ts`: `nutritionKeys = { plan: (petId) => ['nutrition','plan',petId], profile: … }`;
  precedente de clave con parámetros `healthKeys.weights(petId, limit)` que
  incluye `{ limit }` en la tupla; `activityKeys.daily(petId)`. Test
  `src/api/__tests__/query-keys.test.ts`: `#87 R7` ("includes limit when
  identifying weight lists", estabilidad del prefijo) y `#41 R2` (una clave
  por dominio). Una clave `nutritionKeys.mealsHistory(petId, { from, to })`
  sigue el patrón de `weights` y necesita su `it` en ese test.
- Versiones: `@tanstack/react-query 5.102.8`, `@testing-library/react-native ^14.0.1`
  (sin `UNSAFE_*`), `jest-expo ^57.0.4`, `jest ~29.7.0`, preset `jest-expo`
  en `package.json` (no hay `jest.config.*`).

### Móvil: i18n

- `src/i18n/catalog.ts`: `export const en = { … } as const`,
  `export type TranslationKey = keyof typeof en`,
  `export const es: Record<TranslationKey, string>`, `LOCALES = { es: 'es-MX', en: 'en-US' }`,
  `DEFAULT_LANGUAGE = 'es'`. Catálogo plano con prefijos por pantalla
  (`food.*` 17 claves, `mealSchedule.*` 21 claves, `common.cannotReachServer`,
  `common.somethingWentWrong`, `common.retry`, `common.noPetsYet`). No hay
  librería i18n ni plurales: el copy con número se hace con plantilla
  (`food.mealsServedOfTotal`, `food.kcalConsumedOfTarget`).
- **Candado de longitud** (`src/providers/__tests__/language-provider.test.tsx`
  `#65 R12`): `expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9)`
  (suma 343), `spanishKeys` toEqual `englishKeys`, nombres de marcador iguales.
  Cada feature añade **su sumando** con comentario; mi recuento por grep de
  claves da 171/172 (entradas multilínea lo rompen) — **no** usar mi número,
  la cifra autoritativa es la fórmula del test. Describes por feature
  (`#98 R3`, `#41 R1`, `#146 R1`, `#100 R1`, `#147 R1`) comprueban que las
  claves nuevas están "en los dos idiomas y en la tabla de la spec de idioma".
- Tabla de la spec de idioma: `specs/mobile-ui-language/design.md` §2 con
  filas `| <n> | \`food.mealsToday\` | \`Meals today\` | \`Comidas hoy\` |` y tabla de
  uso `| src/app/(tabs)/food.tsx | 174 | título … | food-meals-title | food.test.tsx:521 |`;
  `src/__tests__/ui-copy-table.ts` tiene arrays `UseRow = { file, key }` por
  bloque (`R1_AUTH`, …) que se cruzan con la tabla. Toda clave nueva: catálogo
  (en + es), fila en §2, fila de uso, entrada en `ui-copy-table.ts`.
- Nombres de mes/día de semana **no** están en el catálogo: se obtienen con
  `toLocaleDateString(locale, …)` usando `LOCALES[language]` (ver fechas).

### Móvil: inventarios globales y componentes compartidos

- `src/__tests__/design-drift.test.ts`: arrays `featureFiles` por feature;
  `it('keeps the four Expo Router entrypoints thin')` con lista cerrada
  `['app/(tabs)/home.tsx','app/(tabs)/profile.tsx','app/pets/add.tsx','app/pets/[petId]/docs.tsx']`
  (no incluye `meal-schedule.tsx`; la delgadez de los routes nuevos la cierran
  `detail-stack.test.tsx` por ruta); `'meal-schedule'` aparece en otra lista
  de rutas (grep `'meal-schedule'` en el fichero) y un mapa de recuentos con
  `'screens/meal-schedule/index.tsx': 2, // #147 R8` — spec_author debe grep
  qué cuenta ese mapa y decidir si la pantalla nueva entra.
- `src/__tests__/consistency-classnames.test.ts`: `#62 R2` skeleton con forma
  del contenido; `#62 R4` radios solo de la escala (`rounded-card`/`rounded-xl`/`rounded-full`);
  `#62 R14` `const directUses = [ … [join('screens','meal-schedule','index.tsx'), 1], [join('screens','weight-log','index.tsx'), 1], … ]`
  y total `directUses.reduce(...) + 2` — toda pantalla que use
  `CONTINUOUS_CORNER` entra en la lista; `#62 R15` `const counters = [ … [join('screens','weight-log','index.tsx'), 2] … ]`
  con suma cerrada — todo número visible (día del mes, contador de servidas)
  con `TABULAR_NUMS` entra ahí; `#98 R10` `expect(count(/bg-accent-soft/g)).toBe(16 + 2)`
  (inventario global de ese token); `#64 R9` color categórico solo en
  `src/utils/category-palette.ts` (rose para `food`).
- Componentes compartidos en `src/components/`: `card.tsx`, `floating-tab-bar.tsx`,
  `pet-avatar.tsx`, `pet-hero-header.tsx`, `pet-map.tsx`, `pet-switcher.tsx`,
  `weight-chart.tsx`. **No hay** EmptyState/ErrorState compartidos (cada
  pantalla pinta `Text testID="<x>-error" className="text-danger"` +
  `Button testID="<x>-retry"`), **no hay calendario ni grid mensual**, y
  `@expo/ui/community/datetime-picker` es un picker, no una rejilla.

### Móvil: utilidades de fecha y dependencias

- `src/utils/civil-today-iso.ts` `civilTodayIso(timeZone: string | undefined, now = new Date())`
  via `Intl.DateTimeFormat('en-US', { timeZone, … }).formatToParts` — "hoy" en
  la zona que se le pasa; usado por `src/screens/weight-log/index.tsx` con
  `me.data?.kind === 'ok' ? me.data.me.timezone : undefined` (de
  `getMe` / `userKeys.me()`, `src/api/users.ts` campo `timezone: string`).
- `src/screens/home/format.ts`: `localDayOf(instant)`, `calendarDaysUntil(date, now)`,
  `fmtDate(date, locale)`. `src/screens/home/weekly-activity-chart.tsx`
  `weekdayLabel(date, locale, style)` = `new Date(year, month - 1, day).toLocaleDateString(locale, { weekday })`
  (construye la fecha local por componentes, nunca `new Date('YYYY-MM-DD')`).
  `src/screens/health/index.tsx` monta hoy con `getMonth() + 1` / `getFullYear()`.
  `src/utils/reminder-dates.ts` `daysUntil`; `src/utils/date-picker-value.ts`.
- Dependencias (`package.json`): `@expo/ui`, `@gorhom/bottom-sheet`,
  `@tanstack/react-query`, `heroui-native`, `react-native-chart-kit`,
  `react-native-svg`, `reicon-react-native`, `uniwind`, `expo-router`,
  `react-native-reanimated`. **Ninguna de calendario.** Una rejilla de mes
  son ~20 líneas con `Date.UTC(y, m-1, 1)` + `getUTCDay()` + `new Date(Date.UTC(y, m, 0)).getUTCDate()`
  y claves `YYYY-MM-DD` por string — cero deps nuevas (criterio de aceptación).
- Memoria relevante: `expo-router-types-obsoletos` (borrar `.expo/types/router.d.ts`
  antes de typecheck; en handoff `test ! -e`), `jest-paths-con-parentesis`,
  `bun-para-todo-en-movil`.

### Móvil: zona horaria del cliente al servir

- El móvil **no manda** `servedOn`: `POST /pets/:petId/meals { mealTime }`
  (ver backend). El día civil lo fija el servidor con la zona del **owner**.
- El móvil tiene dos "hoy" posibles: reloj del dispositivo (`new Date()`) o
  `civilTodayIso(me.timezone)` con la zona del usuario autenticado
  (`getMe`). Si el usuario es el owner coinciden salvo que viaje; si es
  miembro en otra zona, ninguno de los dos es la zona del owner (el móvil no
  conoce `owner.timezone`: `getPet` no la expone — grep `timezone` en
  `src/api/types.ts` da solo `me.timezone` y perfil). Consecuencia: el
  límite "no navegar al futuro" y el marcador de "hoy" pueden ir un día
  desfasados respecto a lo que grabó el backend. Es cosmético, no de datos.

### Convenciones de test a citar en la spec

- `docs/conventions.md` §Tests: prefijo R-id en el título del `it`/`describe`
  (`#105 R<n>`); `design-drift` ignora solo `#NNN R<d>`; escapar `(tabs)` en
  rutas de jest (`src/app/\\(tabs\\)`); recorte de source-locks; §Esperas:
  `waitFor` sobre el árbol, nunca sobre contador de mock (memoria
  `handoff-codex-citar-esperas`); inventario de dobles HeroUI/Reanimated.
- `docs/ui-guidelines.md`: tokens y grep-clean, Skeleton no Spinner, route
  delgado, `useThemeColors`, cabecera la pone el stack (`#95 R5` la pantalla
  no dibuja cabecera), enmienda #70 (elemento repetido: enumerar decisiones
  por celda y contar por `children.length`, no por `testID` — memoria
  `decisiones-por-elemento-repetido`), tabular-nums en números, objetivos
  táctiles 44pt, paleta categórica.
- Memorias que muerden aquí: `tablas-de-fechas-cruzan-mes-y-ano` (filas de
  prueba deben cruzar mes y año; un calendario mensual es el caso canónico),
  `jest-process-env-tz-ciego` (jest copia `process.env`; `TZ` no cambia
  `Date`: fijar fechas por componentes o inyectar `now`), `candado-catalogo-omitido-en-specs`,
  `literales-copy-desde-r1`, `rojo-por-consulta-en-sondas`, `sujeto-ausente-en-tasks`,
  `renderrouter-fake-timers-setstate-async`, `ventana-de-timer-en-specs-de-spring`.
- Backend: specs de use-case con dobles parciales `as unknown as MealServingRepository`;
  e2e sembrando filas con `db.insert(mealServings).values({ servedOn })`;
  R-ids en títulos; `test/meals.e2e-spec.ts` como fichero destino natural
  (o uno nuevo `test/meals-history.e2e-spec.ts` si se quiere aislar el seed
  de un mes).

## Riesgos / ambigüedades

1. **El schedule no tiene historial.** `nutritionPlans.mealTimes` es el array
   vigente; un día pasado solo tiene filas de `meal_servings` (lo servido).
   "Marcador por día" puede ser (a) hubo ≥1 servida, o (b) servidas vs
   total — pero el total de ese día es desconocido; usar `mealsPerDay`
   actual etiqueta mal los días anteriores a un cambio de plan. Decisión de
   producto, no técnica.
2. **Premisas falsas del encargo** (ya documentadas arriba): hay **una**
   implementación del puerto, no dos; `nutrition-scope.spec.ts` no es scope de
   petId; no existe `get-nutrition-plan.use-case.spec.ts`. La spec no debe
   heredarlas (memoria `premisas-de-explore-sin-verificar`).
3. **`listTimesServedOn` sin `orderBy`**: el método de rango debe ordenar
   explícitamente (`servedOn, mealTime`) o el móvil ordena; fijarlo en la spec
   para que la aserción del e2e no dependa del heap.
4. **"Hoy" del cliente vs del owner** (sección zona horaria): el límite
   superior del calendario puede desfasarse un día. Opciones: reloj del
   dispositivo (simple), `civilTodayIso(me.timezone)` (ya existe), o que el
   endpoint devuelva `today` del owner en la respuesta (una línea más en el
   backend, cero ambigüedad en el móvil).
5. **Inventarios que una pantalla nueva debe pisar**: `layout.test.tsx`
   (posición en el `Stack.Protected`, cabecera `#95 R4`, "ocho rutas
   protegidas"), `detail-stack.test.tsx`, `detail-stack.navigation.test.tsx`,
   `detail-stack.guard.test.tsx`, `language-provider.test.tsx` (sumando),
   `ui-copy-table.ts` + `design.md` §2, `design-drift.test.ts` (`featureFiles`
   y mapa de recuentos), `consistency-classnames.test.ts` (`directUses`,
   `counters`, `bg-accent-soft`), `query-keys.test.ts`, `nutrition.test.ts`,
   `food.test.tsx` o `meal-schedule/index.test.tsx` según la entrada. Olvidar
   uno es rechazo del reviewer (memoria `candado-catalogo-omitido-en-specs`).
6. **`PetMealsReader` tiene doble exhaustivo** (`get-pet.use-case.spec.ts`):
   si alguien mete el rango ahí, rompe typecheck. Mantenerlo intocado.
7. **Rejilla mensual a mano**: `Date` local con `TZ` del runner (memoria
   `jest-process-env-tz-ciego`). Construir celdas con `Date.UTC`/strings y
   fijar en la spec un mes de prueba que cruce año (dic→ene) y un febrero
   bisiesto.
8. **Tamaño de respuesta**: 31 días × hasta `MEAL_TIMES_LIMIT` servidas es
   pequeño; sin paginación. Pero si el span máximo se deja "arbitrario" sin
   tope, el e2e no puede candar `RANGE_TOO_LARGE` — el activity ya fijó 31.

## Decisiones abiertas para spec_author

| # | Decisión | Opciones | Coste / nota |
|---|----------|----------|--------------|
| D1 | Forma del query | (a) `from`/`to` días civiles como activity; (b) `month=YYYY-MM` | (a) reutiliza `assertCalendarDate`/`assertRange`/códigos ya conocidos y sirve para "últimos 7 días" después; (b) no tiene precedente en el backend y el móvil igual pide 6 semanas para rellenar la rejilla. |
| D2 | Span máximo | 31 (igual que `ACTIVITY_MAX_RANGE_DAYS`); 42 (rejilla de 6 semanas en una sola petición); sin tope | 31 obliga al móvil a pedir mes natural y pintar vacías las celdas de relleno; 42 permite pedir la rejilla completa; sin tope deja `RANGE_TOO_LARGE` sin candado. Constante propia en nutrition, no importar la de activity. |
| D3 | Forma de la respuesta | (a) `{ from, to, days: [{ date, mealTimes: string[] }] }` solo días con filas; (b) misma forma rellenando huecos con `listDays` (como activity); (c) lista plana `MealServingResponse[]` | (b) es lo que el móvil necesita para pintar sin agrupar y copia activity; (c) es cero mapper nuevo pero mueve la agrupación al cliente. Incluir `today` del owner resuelve el riesgo 4 por una línea. |
| D4 | Qué enseña el detalle de un día | solo horas servidas; horas servidas + `mealsPerDay` actual como total; también `servedAt`/`createdBy` | Riesgo 1: el total pasado es desconocido. Lo mínimo honesto es la lista de horas servidas y el recuento. |
| D5 | Marcador por día | punto si ≥1 servida; punto con color por "todas/algunas"; número | "todas" requiere el total (D4). Enmienda #70: enumerar decisiones por celda y contar por `children.length`. |
| D6 | Límites de navegación | sin futuro (mes actual como tope); hacia atrás: sin tope / hasta `plan.generatedAt` / hasta `pet.createdAt` | `generatedAt` ya está en `NutritionPlan` del móvil; `createdAt` de la mascota habría que confirmar en `src/api/types.ts`. Sin tope atrás es lo más barato y el mes vacío ya tiene estado. |
| D7 | Estados | loading (Skeleton con la forma de la rejilla, `#62 R2`), error + retry, vacío (mes sin servidas), sin plan (¿se puede abrir el historial sin plan? hay filas aunque el plan se borre), sin mascota (`Redirect href="/food"` como meal-schedule) | Cuatro estados obligatorios según skill `expo-data-fetching`; refetch al cambiar de mes conserva el mes anterior en caché (`placeholderData`/`keepPreviousData` de TanStack v5) o muestra skeleton: decidir. |
| D8 | Literales de copy | título de cabecera, mes/año (viene de `toLocaleDateString`, no del catálogo), vacío, error, detalle ("Servidas", "Sin comidas servidas"), cierre del detalle | Todas en `en` y `es`, con fila en `design.md` §2 y `ui-copy-table.ts`; literal desde R1 (memoria `literales-copy-desde-r1`). |
| D9 | Entrada | tarjeta nueva en `food.tsx` junto a `meal-schedule-link`; botón/fila dentro de `meal-schedule`; botón en la cabecera de meal-schedule (`headerRight`) | El humano dijo "desde la pestaña de comidas"; `food.tsx` ya tiene el patrón `Card + router.push`. Un `headerRight` no tiene precedente en `headerOptions`. |
| D10 | Detalle al tocar | panel inline bajo la rejilla (estado local, sin ruta); `@gorhom/bottom-sheet` (ya instalado, ¿se usa en alguna pantalla? grep antes); ruta anidada `meals-history/[date]` | Inline es lo más barato y evita tocar el stack dos veces; la hoja requiere su doble en tests (ver inventario de dobles en conventions §Tests). |
| D11 | Candados a extender vs crear | extender listas cerradas (`layout.test` tuplas, navigation, guard) o añadir `describe('#105 R<n>')` propio en cada fichero | Extender listas ajenas cambia títulos de `it` de otras features ("las seis de detalle"); añadir describes propios es el precedente de #100/#146/#147. |
| D12 | Nombre de ruta | `meals-history` (plano, como `meal-schedule`); `meal-history`; `meals/history` | El feature se llama `meals-history`; plano evita carpeta nueva en `src/app/`. |

## Recomendación

Enfoque mínimo que cierra los cuatro criterios de aceptación sin deps nuevas
ni migración; cada punto es una opción, no una decisión.

- **Puerto:** añadir a `MealServingRepository` un cuarto método
  `listServedBetween(petId, fromDay, toDay): Promise<Array<{ servedOn: string; mealTime: string }>>`
  ordenado por `servedOn, mealTime` en la impl drizzle (`and(eq(petId), gte(servedOn, from), lte(servedOn, to))` + `orderBy`).
  Los dobles parciales existentes no se rompen. Test unitario del use case con
  `{ listServedBetween } as unknown as MealServingRepository`.
- **Use case nuevo** `GetMealsHistoryUseCase.execute({ petId, from, to }, now)` en
  `application/use-cases/`, copiando el orden de `get-daily-activity.use-case.ts`:
  validar formato y rango con `isCalendarDate`/`shiftDay`/`listDays` de
  `src/pipeline/local-day.ts` antes de I/O, errores de dominio propios en
  nutrition (`INVALID_DATE`, `INVALID_RANGE`, `RANGE_TOO_LARGE`) añadidos a
  `mapNutritionError`, constante `MEALS_HISTORY_MAX_RANGE_DAYS` en nutrition.
  `today = await ownerLocalDay(pets, petId, now)` para el default de `to` y
  para devolverlo en la respuesta.
- **Endpoint:** `@Get()` en `MealsController` (`GET /v1/pets/:petId/meals?from&to`),
  DTO `ListMealsQuerySchema = z.strictObject({ from: z.string().optional(), to: z.string().optional() })`
  en `meal.dto.ts`, respuesta `{ from, to, today, days: [{ date, mealTimes }] }`
  con huecos rellenos. e2e en `test/meals.e2e-spec.ts` sembrando filas con
  `db.insert(mealServings)` en dos meses distintos y una zona no-UTC.
- **Móvil:** `getMealsHistory(baseUrl, token, petId, { from, to }, fetchFn)` en
  `src/api/nutrition.ts` con la misma unión de `kind`; `nutritionKeys.mealsHistory(petId, { from, to })`;
  route delgado `src/app/meals-history.tsx` + `src/screens/meals-history/index.tsx`
  (`MealsHistoryScreen` con `useSelectedPet` + `Redirect href="/food"`),
  registrado en `_layout.tsx` con `{ ...headerOptions, title: t('mealsHistory.mealsHistory') }`
  **detrás de `pairing`** para no mover el `slice(0, 6)` (y comprobar "ocho
  rutas protegidas"); rejilla de mes a mano (7 columnas, `Date.UTC`, claves
  string), detalle inline del día tocado, entrada como `Card` nueva en
  `food.tsx` con `router.push('/meals-history')`.
- **Lo que no tocar:** `PetMealsReader`/`pet-meals.drizzle-reader.ts`,
  `GetNutritionPlanUseCase`, schema y migraciones, `(tabs)`.
