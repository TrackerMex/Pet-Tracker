---
feature: "meals-history"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[meals-history]]

> Notación EARS. Cada requisito es observable con un test que nombra su R-id
> (`#105 R<n>`). Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las capas.
>
> Base congelada: `origin/main d29d49d5` (2026-10-03). Toda ruta y símbolo de
> esta spec se verificó contra ese árbol. Las anclas son por contenido
> grepeable (ruta + símbolo o literal), nunca por número de línea.

## Contexto

Caso de uso cerrado por el humano (2026-10-03, no reabrir): el usuario quiere
ver **qué días se sirvieron comidas** a la mascota seleccionada, mes a mes,
en un calendario navegable con un punto por día servido y un detalle inline
(horas servidas + recuento) al tocar un día. Entra desde la pestaña Food como
pantalla de pila (stack), no como pestaña nueva.

Hoy el backend solo expone lo servido **hoy** (`servedToday` en
`GET /v1/pets/:petId/nutrition-plan`, vía `PetMealsReader`). El puerto
`MealServingRepository` (`backend-pet-tracker/src/modules/nutrition/domain/repositories/meal-serving.repository.ts`)
tiene `create`, `deleteOne` y `listTimesServedOn(petId, servedOn)`; no hay
consulta por rango. La tabla `meal_servings` ya existe (columnas `pet_id`,
`served_on`, `meal_time`, `created_by`) y **no se migra**.

Precedente a copiar en backend: el módulo `activity`
(`src/modules/activity/application/use-cases/get-daily-activity.use-case.ts`,
`activity.errors.ts`, `activity-error.mapper.ts`, `activity.controller.ts`):
mismo contrato de rango por días civiles `YYYY-MM-DD`, mismos códigos de error
y misma estrategia de relleno de huecos con `listDays`.

Precedente a copiar en móvil: `meal-schedule` (`mobile-pet-tracker/src/app/meal-schedule.tsx`
+ `src/screens/meal-schedule/index.tsx`): route delgado, `Redirect` sin
mascota, `Skeleton`/error+retry, `signOut()` en `unauthorized`, dimensiones
A11 de la carta de UI.

---

## Requisitos funcionales — backend

Rutas relativas a `backend-pet-tracker/`.

### R1 — El puerto lista servicios por rango, ordenados

WHEN se invoca `MealServingRepository.listServedBetween(petId, fromDay, toDay)`
THEN THE SYSTEM SHALL devolver las filas de `meal_servings` de esa mascota con
`served_on` en `[fromDay, toDay]` (ambos inclusive) como
`Array<{ servedOn: string; mealTime: string }>`, ordenadas por `servedOn`
ascendente y, dentro del día, `mealTime` ascendente; filas de otras mascotas
o fuera del rango no aparecen.

- Firma en el puerto: `listServedBetween(petId: string, fromDay: string, toDay: string): Promise<Array<{ servedOn: string; mealTime: string }>>`.
- Implementación única: `MealServingDrizzleRepository`
  (`src/modules/nutrition/infrastructure/repositories/meal-serving.drizzle.repository.ts`)
  con `and(eq(petId), gte(servedOn), lte(servedOn))` + `orderBy(asc(servedOn), asc(mealTime))`.
- Los dobles existentes (`serve-meal.use-case.spec.ts`,
  `unserve-meal.use-case.spec.ts`) son parciales (`{ … } as unknown as MealServingRepository`)
  y no se tocan.
- **Test:** `test/meals-history.e2e-spec.ts`, `describe('#105 R1 …')` —
  caso "incluye ambos extremos, excluye lo de fuera y lo de otra mascota" y
  caso "devuelve las horas del día ascendentes aunque se insertaran al revés".

### R2 — Constante de ventana y errores de dominio de rango

THE SYSTEM SHALL exportar `MEALS_HISTORY_MAX_RANGE_DAYS = 31` desde
`src/modules/nutrition/domain/nutrition.constants.ts` (junto a
`MAX_MEALS_PER_DAY`), y SHALL declarar en
`src/modules/nutrition/domain/errors/nutrition.errors.ts` las clases
`InvalidDateError(value: string)`, `InvalidRangeError()` y
`RangeTooLargeError()` con los mismos `message`/`name` que sus homónimas de
`src/modules/activity/domain/errors/activity.errors.ts`.

IF `mapNutritionError` (`src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts`)
recibe una de esas tres clases THEN THE SYSTEM SHALL devolver
`BadRequestException` con cuerpo `{ statusCode: 400, code, message }` donde
`code`/`message` son exactamente los de `activity-error.mapper.ts`:
`INVALID_DATE` / `Dates must be calendar days YYYY-MM-DD`,
`INVALID_RANGE` / `from must not be after to`,
`RANGE_TOO_LARGE` / `Requested range exceeds the maximum window`.

- **Test:** nuevo `src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.spec.ts`,
  `describe('#105 R2: …')`: para cada clase, `mapNutritionError(new X())` es
  `BadRequestException` y `getResponse()` es exactamente
  `{ statusCode: 400, code, message }` con los literales de arriba; además
  `MEALS_HISTORY_MAX_RANGE_DAYS` `toBe(31)`. Modo de fallo en rojo:
  `Cannot find module` / export inexistente; luego `mapNutritionError` devuelve
  el error sin mapear (`not.toBeInstanceOf(BadRequestException)`). Los códigos
  HTTP se vuelven a observar en `test/meals-history.e2e-spec.ts`
  `describe('#105 R2 …')`.

### R3 — El caso de uso valida, resuelve "hoy" del dueño y rellena huecos

THE SYSTEM SHALL exponer
`GetMealsHistoryUseCase.execute(input: { petId: string; from?: string; to?: string }, now: Date): Promise<MealsHistoryResult>`
en `src/modules/nutrition/application/use-cases/get-meals-history.use-case.ts`
(constructor: `@Inject(MEAL_SERVING_REPOSITORY) meals`,
`@Inject(PET_REPOSITORY) pets`), con este orden exacto:

1. IF `from` o `to` está definido y no cumple `isCalendarDate` THEN SHALL
   lanzar `InvalidDateError` **antes de cualquier I/O**.
2. IF ambos están definidos THEN SHALL aplicar `assertRange` (R3.a) antes de
   cualquier I/O.
3. SHALL resolver `today = await ownerLocalDay(this.pets, petId, now)`
   (`@/modules/pets/application/owner-local-day`), día civil del dueño.
4. `toDay = to ?? today`; `fromDay = from ?? shiftDay(toDay, -(MEALS_HISTORY_MAX_RANGE_DAYS - 1))`.
5. SHALL aplicar `assertRange(fromDay, toDay)`.
6. SHALL llamar `meals.listServedBetween(petId, fromDay, toDay)` una sola vez.
7. SHALL devolver `{ from: fromDay, to: toDay, today, days }` donde `days` tiene
   **una entrada por cada día de `listDays(fromDay, toDay)`**, en ese orden,
   `{ date, mealTimes: string[] }`, `mealTimes` ascendente (`[...].sort()`;
   `HH:mm` con cero a la izquierda ordena lexicográficamente) y `[]` en los
   días sin filas (incluidos los días futuros a `today`).

R3.a `assertRange(fromDay, toDay)`: IF `fromDay > toDay` THEN `InvalidRangeError`;
IF `listDays(fromDay, toDay).length > MEALS_HISTORY_MAX_RANGE_DAYS` THEN
`RangeTooLargeError`. (Copia literal de `get-daily-activity.use-case.ts`,
cambiando la constante.)

El backend **no rechaza** `to` futuro: el móvil pide el mes natural y el mes
en curso siempre incluye días futuros, que vuelven con `mealTimes: []`.

- **Test:** `src/modules/nutrition/application/use-cases/get-meals-history.use-case.spec.ts`,
  `describe('#105 R3: …')`, dobles parciales como en `serve-meal.use-case.spec.ts`
  (`{ listServedBetween: jest.fn() } as unknown as MealServingRepository`,
  `{ findOwnerTimezone: jest.fn() } as unknown as PetRepository`). Casos
  mínimos, cada uno un `it`:
  - defaults: tz `UTC`, `now = new Date('2026-03-15T12:00:00Z')`, sin
    `from`/`to` → `from === '2026-02-13'`, `to === '2026-03-15'`,
    `today === '2026-03-15'`, `days` length 31, `days[0].date === '2026-02-13'`,
    `days[30].date === '2026-03-15'` (cruza mes).
  - "hoy" del dueño cruza año: tz `America/Mexico_City`,
    `now = new Date('2026-01-01T03:00:00Z')` → `today === '2025-12-31'` y
    `to === '2025-12-31'`.
  - relleno y orden: `from '2025-12-29'`, `to '2026-01-03'`, el doble devuelve
    `[{ servedOn: '2025-12-30', mealTime: '12:00' }, { servedOn: '2025-12-30', mealTime: '08:00' }, { servedOn: '2026-01-02', mealTime: '07:30' }]`
    → `days` length 6, `days[1]` = `{ date: '2025-12-30', mealTimes: ['08:00', '12:00'] }`,
    `days[4].mealTimes` = `['07:30']`, los otros cuatro `[]` (cruza mes y año).
  - 32 días rechaza, 31 acepta: `'2025-12-01'..'2026-01-01'` →
    `rejects.toBeInstanceOf(RangeTooLargeError)`; `'2025-12-02'..'2026-01-01'`
    → resuelve con `days` length 31.
  - `from > to` → `InvalidRangeError`; `from: 'ayer'` → `InvalidDateError`;
    `to: '2026-02-30'` → `InvalidDateError`.
  - validación antes de I/O: en los tres rechazos anteriores
    `findOwnerTimezone` y `listServedBetween` tienen `toHaveBeenCalledTimes(0)`.
  - `to` futuro: tz `UTC`, `now = '2026-03-15T12:00:00Z'`, `from '2026-03-14'`,
    `to '2026-03-17'` → resuelve, `days` length 4, los dos últimos `mealTimes: []`.
  - Modo de fallo esperado en rojo: el fichero no compila (`Cannot find module
    './get-meals-history.use-case'`); tras crear la clase vacía, fallan por
    valor (`undefined` vs esperado) y por `rejects` no cumplido.

### R4 — Endpoint `GET /v1/pets/:petId/meals` con query estricta

WHEN un miembro de la mascota hace `GET /v1/pets/:petId/meals` con query
opcional `from`/`to` THEN THE SYSTEM SHALL responder `200` con
`{ from, to, today, days: [{ date, mealTimes }] }` tal como lo devuelve R3.

- Controlador: `MealsController` (`src/modules/nutrition/infrastructure/meals.controller.ts`,
  ya anotado `@Controller('pets/:petId/meals') @UseGuards(PetAccessGuard)`)
  gana `@Get()` que valida `request.query` con `ListMealsQuerySchema`, llama
  `GetMealsHistoryUseCase.execute({ petId: request.petMembership.petId, ...query }, new Date())`
  y envuelve en `catch (error) { throw mapNutritionError(error); }` como el
  `@Post()` existente.
- DTO en `src/modules/nutrition/application/dto/meal.dto.ts`:
  `export const ListMealsQuerySchema = z.strictObject({ from: z.string().optional(), to: z.string().optional() });`
  `export type ListMealsQueryDto = z.infer<typeof ListMealsQuerySchema>;`
- IF la query trae una clave desconocida THEN SHALL responder `400` con
  `message: 'Validation failed'` y `errors: [{ path, message }]` (misma forma
  que `parseDailyQuery` en `activity.controller.ts`; el helper local se llama
  `parseQuery` y vive junto a `parseBody` en `meals.controller.ts`).
- Tipo de respuesta `MealsHistoryResponse` exportado desde
  `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` (alias
  del resultado de R3; sin transformación).
- `GetMealsHistoryUseCase` se registra en `providers` de
  `src/modules/nutrition/nutrition.module.ts`.
- IF el usuario no es miembro, o `:petId` no es UUID THEN SHALL responder
  `404` (lo hace ya `PetAccessGuard`; se verifica, no se cambia).
- **Test:** `test/meals-history.e2e-spec.ts`, `describe('Meals history (e2e)')`
  con helpers copiados de `test/meals.e2e-spec.ts` (`seedUser`, `seedPet`,
  `addMember`, `auth`; filas pasadas con
  `db.insert(mealServings).values({ id: uuidv7(), petId, servedOn, mealTime, createdBy })`).
  `describe('#105 R4 …')` con un `it` por caso:
  - sin query (dueño `UTC`) → 200, `to === localDayOf(Date.now(), 'UTC')`,
    `from === shiftDay(to, -30)`, `today === to`, `days` length 31.
  - `from=2025-12-29&to=2026-01-03` con filas sembradas `2025-12-30 12:00`,
    `2025-12-30 08:00` (en ese orden de inserción), `2026-01-02 07:30` y una
    fila `2025-12-28 09:00` fuera de rango, más una fila `2025-12-30 10:00` de
    **otra mascota de otro dueño** → 200, `days` length 6,
    `days[1].mealTimes` `['08:00', '12:00']`, `days[4].mealTimes` `['07:30']`,
    resto `[]` (cubre R1).
  - solo `to=2026-01-31` → `from === '2026-01-01'`, 31 días.
  - `from` posterior a `to` → 400 `code: 'INVALID_RANGE'`.
  - `from=shiftDay(today,-31)&to=today` → 400 `code: 'RANGE_TOO_LARGE'`;
    `from=shiftDay(today,-30)&to=today` → 200 con 31 días.
  - `from` ∈ `{'2026-13-01', '2026-02-30', 'ayer'}` → 400 `code: 'INVALID_DATE'`
    (tres `it`, o `it.each`).
  - `?month=2026-01` (clave desconocida) → 400 `message: 'Validation failed'`.
  - `to = shiftDay(today, 2)`, `from = shiftDay(today, -2)` → 200, 5 días, los
    dos últimos `[]`.
  - usuario ajeno → 404; `petId = 'not-a-uuid'` → 404.
  - Modo de fallo esperado en rojo: `404` del router de Nest en todos (no hay
    `@Get()`), hasta que el controlador exista; después, fallos por valor.

---

## Requisitos funcionales — móvil

Rutas relativas a `mobile-pet-tracker/`. Todo lo visual se rige por
`docs/ui-guidelines.md` (C8) y las dimensiones A11 de pantalla de pila.

### R5 — Copy en/es desde el primer commit

THE SYSTEM SHALL añadir a `src/i18n/catalog.ts` (en `en` y en `es`,
mismas claves, mismo orden relativo) exactamente estas nueve claves:

| Clave | `en` | `es` |
|---|---|---|
| `food.mealsHistory` | `Meals history` | `Historial de comidas` |
| `food.mealsHistoryLinkSubtitle` | `See which days meals were served` | `Ver qué días se sirvieron comidas` |
| `mealsHistory.mealsHistory` | `Meals history` | `Historial de comidas` |
| `mealsHistory.previousMonth` | `Previous month` | `Mes anterior` |
| `mealsHistory.nextMonth` | `Next month` | `Mes siguiente` |
| `mealsHistory.emptyMonth` | `No meals were served this month` | `Este mes no se sirvió ninguna comida` |
| `mealsHistory.noMealsOnDay` | `No meals were served this day` | `Ese día no se sirvió ninguna comida` |
| `mealsHistory.servedOne` | `1 meal served` | `1 comida servida` |
| `mealsHistory.servedMany` | `{{count}} meals served` | `{{count}} comidas servidas` |

El error y el reintento reutilizan `common.somethingWentWrong` y
`common.retry` (ya existen; cero claves nuevas para eso).

- SHALL añadir la sección `### §2.18 — Añadidos por #105 — Historial de comidas`
  a `specs/mobile-ui-language/design.md` con una fila por clave en el formato
  de §2.17 (`| — | \`clave\` | \`en\` | \`es\` | ← añadida por #105 (R5) |`).
- SHALL subir el candado de longitud de
  `src/providers/__tests__/language-provider.test.tsx` (`#65 R12`,
  `expect(englishKeys).toHaveLength(260 + 16 + … + 9)`) en `+ 9 // #105 R5`.
- SHALL añadir a `R6_FOOD` en `src/__tests__/ui-copy-table.ts` **una fila por
  llamada `t('…')` nueva**: 2 de `src/app/(tabs)/food.tsx`
  (`food.mealsHistory`, `food.mealsHistoryLinkSubtitle`) y 8 de
  `src/screens/meals-history/index.tsx` (`mealsHistory.previousMonth`,
  `mealsHistory.nextMonth`, `mealsHistory.emptyMonth`,
  `mealsHistory.noMealsOnDay`, `mealsHistory.servedOne`,
  `mealsHistory.servedMany`, `common.somethingWentWrong`, `common.retry`);
  total `+ 10` en `src/__tests__/ui-language.test.ts` (`#65 R6`,
  `expect(R6_FOOD).toHaveLength(35 + 3 + … + 10)`). La tabla no registra
  `src/app/_layout.tsx` (`grep -c "_layout" src/__tests__/ui-copy-table.ts` = 0),
  así que `mealsHistory.mealsHistory` no lleva fila.
- **Test:** `src/providers/__tests__/language-provider.test.tsx`,
  `describe('#105 R5: …')` copiando el patrón de `#147 R1`: para cada clave
  `english[key]` y `spanish[key]` iguales a los literales de la tabla, y
  `languageDesign` hace `toMatch(new RegExp('\\| — \\| \`' + key + '\`[^\\n]*← añadida por #105 \\(R5\\)'))`.
  Modo de fallo en rojo: `undefined` vs literal.

### R6 — Cliente de API y tipos

THE SYSTEM SHALL exportar desde `src/api/nutrition.ts`
`getMealsHistory(baseUrl: string | undefined, token: string, petId: string, from: string, to: string, fetchFn: typeof fetch = fetch): Promise<MealsHistoryState>`
con `MealsHistoryState =
{ kind: 'ok'; history: MealsHistory } | { kind: 'not-found' } | { kind: 'unauthorized' } | { kind: 'error' } | { kind: 'unreachable'; message: string } | { kind: 'missing-config' }`,
replicando `getNutritionPlan`: `missing-config` si `!baseUrl`; `getJson(baseUrl, \`/pets/${petId}/meals?from=${from}&to=${to}\`, token, fetchFn)`;
`unreachable` pasa tal cual; 404 → `not-found`; 401 → `unauthorized`; otro
`!== 200` → `error`; 200 con JSON objeto → `ok`.

Tipos en `src/api/types.ts`:
`export interface MealsHistoryDay { date: string; mealTimes: string[] }` y
`export interface MealsHistory { from: string; to: string; today: string; days: MealsHistoryDay[] }`.

- **Test:** `src/api/__tests__/nutrition.test.ts`, `describe('#105 R6: …')`
  con los helpers `response(status, body)` / `invalidJsonResponse(status)` del
  fichero: URL exacta pedida (`fetchFn` llamado con
  `'http://example.test/v1/pets/p1/meals?from=2026-01-01&to=2026-01-31'` y
  cabecera `Authorization: Bearer <token>`), 200 → `ok` con el cuerpo, 401 →
  `unauthorized`, 404 → `not-found`, 400 → `error`, `baseUrl` undefined →
  `missing-config` sin llamar `fetchFn`. Modo de fallo en rojo: `getMealsHistory
  is not a function`.

### R7 — Clave de query

THE SYSTEM SHALL exportar
`nutritionKeys.mealsHistory: (petId: string, from: string, to: string) => ['nutrition', 'meals-history', petId, { from, to }] as const`
en `src/api/query-keys.ts`.

- **Test:** `src/api/__tests__/query-keys.test.ts`, `describe('#105 R7: …')`:
  `toEqual(['nutrition', 'meals-history', 'p1', { from: '2026-01-01', to: '2026-01-31' }])`
  y dos meses distintos producen claves distintas (`not.toEqual`). Modo de
  fallo en rojo: `nutritionKeys.mealsHistory is not a function`.

### R8 — Route delgado, registro en la pila y guarda

THE SYSTEM SHALL crear `src/app/meals-history.tsx` con exactamente el patrón
de `src/app/meal-schedule.tsx`:
`import { MealsHistoryScreen } from '../screens/meals-history'; export default function MealsHistoryRoute() { return <MealsHistoryScreen />; }`.

THE SYSTEM SHALL registrar
`<Stack.Screen name="meals-history" options={{ ...headerOptions, title: t('mealsHistory.mealsHistory') }} />`
como **último hijo** de `<Stack.Protected>` en `src/app/_layout.tsx`
(después de `pets/[petId]/geofence-editor`). No se registra detrás de
`pairing` (la recomendación de `progress/explore_meals-history.md` es falsa:
movería las tuplas indexadas `slice(6, 8)` y los "noveno/décimo/undécimo
hijo" de `layout.test.tsx`).

WHEN el usuario autenticado hace `router.push('/meals-history')` THEN la pila
raíz SHALL quedar `['(tabs)', 'meals-history']`; IF no está autenticado THEN
SHALL redirigir a `/login`.

- Candados a subir en `src/app/__tests__/layout.test.tsx`, cada uno con
  `+ 1 // #105 R8` al final de la suma: `#114 R1` 'declara ocho rutas
  protegidas y alerts singular' (`toHaveLength(8 + 1 + 1 + 1 + 1)`); `#100 R2`
  'declara alerts/[alertId] como noveno hijo y singular' (`9 + 1 + 1 + 1`);
  `#41 R4` 'décimo hijo' (`10 + 1 + 1`); `#146 R5` 'undécimo hijo' (`11 + 1`).
  No se renombra ningún `it` ajeno.
- **Tests nuevos:** `src/app/__tests__/layout.test.tsx` `describe('#105 R8: …')`
  — 'declara meals-history como duodécimo hijo con cabecera nativa':
  `children[11]` es `[Stack.Screen, 'meals-history']`, `options.headerShown === true`
  y `options.title === 't:mealsHistory.mealsHistory'`.
  `src/app/__tests__/detail-stack.test.tsx` `describe('#105 R8: …')` — 'es un
  route delgado que importa la pantalla de src/screens/meals-history'
  (`toContain("from '../screens/meals-history'")`, patrón de `#146 R5`).
  `src/app/__tests__/detail-stack.navigation.test.tsx` `describe('#105 R8: …')`
  — push `/meals-history` → `rootStack(app)` `toEqual(['(tabs)', 'meals-history'])`,
  `router.back()` vuelve a `['(tabs)']`.
  `src/app/__tests__/detail-stack.guard.test.tsx` `describe('#105 R8: …')` —
  push `/meals-history` sin sesión → pathname `/login` (misma secuencia de
  `jest.runOnlyPendingTimers()` que el fichero).
  Modo de fallo en rojo: `children[11]` undefined; `toContain` falla por fichero
  inexistente (`ENOENT`); navegación cae en `+not-found`.

### R9 — Cuatro estados de pantalla y datos previos al cambiar de mes

`MealsHistoryScreen` (`src/screens/meals-history/index.tsx`) SHALL cumplir
("Every Screen Has Four States", skill `expo-data-fetching`):

- IF `useSelectedPet().selectedPetId === null` THEN SHALL devolver
  `<Redirect href="/food" />` antes de cualquier query.
- Raíz `<ScrollView testID="screen-meals-history" className="flex-1 bg-background" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 24 }}>`
  (A11).
- Query: `useQuery({ queryKey: nutritionKeys.mealsHistory(petId, from, to), queryFn: () => getMealsHistory(baseUrl, token ?? '', petId, from, to), placeholderData: keepPreviousData })`
  con `baseUrl = process.env.EXPO_PUBLIC_API_URL` y `{ from, to } = monthRange(visibleMonth)` (R10).
- WHILE `data === undefined` (primera carga) THEN SHALL mostrar un único
  `<Skeleton testID="meals-history-skeleton" className="h-80 w-full rounded-card" />`
  y nada más; `rounded-card` porque la rejilla va dentro de un `Card`.
- IF `data.kind === 'unauthorized'` THEN SHALL llamar `signOut()` exactamente
  una vez (misma estructura que `case 'unauthorized': await signOut();` en
  `meal-schedule`).
- IF `data.kind` ∈ `{ 'error', 'unreachable', 'not-found', 'missing-config' }`
  THEN SHALL mostrar `<Text testID="meals-history-error" className="text-danger">{t('common.somethingWentWrong')}</Text>`
  y `<Button testID="meals-history-retry" onPress={() => refetch()}>{t('common.retry')}</Button>`,
  sin rejilla.
- IF `data.kind === 'ok'` THEN SHALL mostrar la rejilla (R11) y, debajo: el
  detalle (R13) si hay día seleccionado; si no y **todos** los
  `days[].mealTimes` están vacíos, `<Text testID="meals-history-empty" className="text-sm text-muted">{t('mealsHistory.emptyMonth')}</Text>`;
  si no, nada. La rejilla nunca se oculta en el estado vacío: es la única
  forma de volver a un mes con datos.
- WHEN cambia `visibleMonth` y la nueva query aún no resolvió THEN SHALL
  seguir mostrando la rejilla del nuevo mes (título y celdas salen del mes,
  no de `data`) **sin** `meals-history-skeleton`; los puntos de `data`
  anterior no coinciden con las fechas del mes nuevo, así que no se pintan.
- **Test:** `src/screens/meals-history/index.test.tsx`, `describe('#105 R9: …')`,
  harness copiado de `src/screens/meal-schedule/index.test.tsx` (mocks de
  `../../api/nutrition`, `../../api/pets`, `../../providers/auth-provider`,
  `expo-router`, `react-native-safe-area-context`, `reicon-react-native`,
  `heroui-native`, `../../theme/use-theme-colors`; `QueryClientProvider` con
  `retry: false`, `LanguageProvider initial="es"`, `SelectedPetProvider`).
  Reloj fijo `jest.useFakeTimers({ now: Date.UTC(2026, 0, 15, 12) })` (mediodía
  UTC: enero de 2026 en cualquier zona; `process.env.TZ` es ciego en jest,
  nunca se usa). Fixture `ok`:
  `{ from: '2026-01-01', to: '2026-01-31', today: '2026-01-15', days }` con
  `mealTimes` `['08:00', '18:30']` en `2026-01-05`, `['12:00']` en
  `2026-01-14` y `[]` en el resto (31 entradas). Casos:
  - sin mascota → `Redirect` con `href: '/food'` (el mock de `expo-router`
    expone `Redirect` como en meal-schedule) y `getMealsHistory` no llamado.
  - promesa pendiente → `getByTestId('meals-history-skeleton')` y
    `queryByTestId('meals-history-grid')` null.
  - `{ kind: 'error' }` → `meals-history-error` + pulsar `meals-history-retry`
    llama `getMealsHistory` una segunda vez (esperar con `waitFor` sobre el
    árbol, §Esperas de `docs/conventions.md`).
  - `{ kind: 'unauthorized' }` → `signOut` `toHaveBeenCalledTimes(1)`.
  - mes vacío (31 × `[]`) → `meals-history-empty` visible, `meals-history-grid`
    presente, `queryAllByTestId('meals-history-dot')` length 0.
  - `ok` → `queryByTestId('meals-history-empty')` null, `meals-history-grid`
    presente.
  - el caso "datos previos al cambiar de mes" se escribe en R12: su sujeto
    (`meals-history-prev`) nace en R11.
  Modo de fallo en rojo: `Unable to find an element with testID` en cada caso;
  `signOut` 0 llamadas.

### R10 — Rejilla mensual pura, sin reloj ni zona horaria

THE SYSTEM SHALL exportar desde `src/utils/month-grid.ts` funciones puras que
trabajan con cadenas `YYYY-MM` / `YYYY-MM-DD` y `Date.UTC` (nunca `new Date()`
local ni `getDay()` sin UTC):

- `monthOf(day: string): string` → `'2026-01-15'` ⇒ `'2026-01'`.
- `shiftMonth(month: string, delta: number): string` → `('2026-01', -1)` ⇒
  `'2025-12'`; `('2025-12', 1)` ⇒ `'2026-01'`; `('2026-01', -13)` ⇒ `'2024-12'`.
- `monthRange(month: string): { from: string; to: string }` → `'2026-02'` ⇒
  `{ from: '2026-02-01', to: '2026-02-28' }`; `'2028-02'` ⇒ `to: '2028-02-29'`;
  `'2025-12'` ⇒ `to: '2025-12-31'`.
- `monthGrid(month: string): Array<string | null>` — celdas lunes-primero,
  `null` = relleno, longitud múltiplo de 7 (35 o 42):
  - `'2025-12'` ⇒ 35 celdas, 0 rellenos iniciales (1-dic-2025 es lunes),
    `[30] === '2025-12-31'`, 4 rellenos finales.
  - `'2026-01'` ⇒ 35 celdas, 3 rellenos iniciales (1-ene-2026 es jueves),
    `[3] === '2026-01-01'`, `[33] === '2026-01-31'`, 1 relleno final.
  - `'2026-02'` ⇒ 35 celdas, 6 rellenos iniciales (domingo), 28 días, 1 final.
  - `'2028-02'` ⇒ 35 celdas, 1 relleno inicial (martes), 29 días (bisiesto),
    `[29] === '2028-02-29'`, 5 finales.
  - `'2026-08'` ⇒ 42 celdas, 5 rellenos iniciales (sábado), 31 días, 6 finales.
- `weekdayHeaders(locale: string): string[]` — 7 etiquetas lunes-primero,
  `new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' })`
  (1-ene-2024 es lunes).
- `monthTitle(month: string, locale: string): string` —
  `new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })`
  → `('2025-12', 'es-MX')` ⇒ `'diciembre de 2025'`; `('2026-01', 'en-US')` ⇒
  `'January 2026'`.
- `longDayLabel(day: string, locale: string): string` —
  `{ weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }` →
  `('2026-01-05', 'es-MX')` ⇒ `'lunes, 5 de enero'`.
- **Test:** `src/utils/__tests__/month-grid.test.ts`, `describe('#105 R10: …')`,
  un `it` por viñeta con los literales de arriba (sin importar nada más que el
  módulo bajo prueba). Modo de fallo en rojo: `Cannot find module`.

### R11 — Celdas: seis decisiones por celda, contadas por hijos

WHEN `data.kind === 'ok'` THEN THE SYSTEM SHALL renderizar dentro de un `Card`:

1. Cabecera de mes: `<Pressable testID="meals-history-prev" accessibilityLabel={t('mealsHistory.previousMonth')} className="h-11 w-11 items-center justify-center rounded-full">` con `ChevronLeft`,
   `<Text testID="meals-history-title" className="text-base font-bold text-foreground">{monthTitle(visibleMonth, locale)}</Text>`,
   `<Pressable testID="meals-history-next" …nextMonth…>` con `ChevronRight`
   (iconos de `reicon-react-native`; `useThemeColors(['foreground', 'muted'])`).
2. `<View testID="meals-history-weekdays" className="flex-row">` con
   exactamente 7 hijos `<Text className="flex-1 text-center text-xs font-normal text-muted">`
   de `weekdayHeaders(locale)`.
3. `<View testID="meals-history-grid" className="gap-1">` cuyos hijos son
   **filas**: una `<View className="flex-row">` por cada 7 celdas de
   `monthGrid(visibleMonth)` en orden (5 o 6 filas); cada celda es `flex-1`.
   Sin `w-[14.28%]` (clase arbitraria, prohibida por C8) ni `StyleSheet`.
4. Relleno (`null`): `<View testID="meals-history-filler" className="h-11 flex-1" />`,
   sin hijos.
5. Día: `<Pressable testID={\`meals-history-day-${date}\`} className="h-11 flex-1 items-center justify-center rounded-full" …>`
   con estas **seis decisiones**, todas evaluadas en cada celda:
   - a. número: `<Text style={TABULAR_NUMS} className=…>{Number(date.slice(8))}</Text>`
     (`TABULAR_NUMS` de `../../theme/native-styles`).
   - b. punto: IF `mealTimes.length >= 1` THEN segundo hijo
     `<View testID="meals-history-dot" className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent" />`;
     si no, la celda tiene **un solo hijo**.
   - c. futuro: IF `date > today` (cadena, `today` del backend) THEN
     `disabled`, `accessibilityState={{ disabled: true, selected }}` y el
     número con `text-muted`; si no, `text-foreground`.
   - d. seleccionado: IF `date === selectedDay` THEN la celda añade
     `bg-accent-soft` (única ocurrencia literal del fichero) y
     `accessibilityState.selected === true`.
   - e. hoy: IF `date === today` THEN el número lleva
     `testID="meals-history-today"` y clase `font-bold text-accent` en vez de
     `font-semibold text-foreground`.
   - f. accesibilidad: `accessibilityRole="button"`,
     `accessibilityLabel={longDayLabel(date, locale)}`.
   Clase del número: `text-sm font-semibold text-foreground` (base),
   `text-sm font-semibold text-muted` (futuro), `text-sm font-bold text-accent` (hoy).
- Candados de inventario que esto mueve (todos en `design.md` § Candados):
  `#62 R15 counters` (+1 fila `[join('screens', 'meals-history', 'index.tsx'), 2]`:
  R11.a y los horarios de R13; total `+ 2 // #105 R11`); `#98 R10`
  `count(/bg-accent-soft/g)` y `#64 R9 accentSoftCount` (`+ 1 // #105 R11`
  cada uno); `#62 R14 directUses` y `count(/style=\{CONTINUOUS_CORNER\}/g)`
  **no** se mueven: la celda y el punto son cápsulas (`rounded-full`), sin
  esquinas dibujadas. `rounded-xl bg-accent` no aparece (el punto es
  `rounded-full bg-accent`).
- **Test:** `src/screens/meals-history/index.test.tsx`,
  `describe('#105 R11: …')` con el fixture de R9 (enero 2026, `today`
  `2026-01-15`), esperando con `waitFor` a `meals-history-grid`:
  - `getByTestId('meals-history-weekdays').children` length 7 y el primero
    con texto igual a `new Date(Date.UTC(2024, 0, 1)).toLocaleDateString('es-MX', { weekday: 'short', timeZone: 'UTC' })`.
  - `getByTestId('meals-history-grid').children` length 5; cada fila
    `children` length 7; suma de celdas 35; `getAllByTestId('meals-history-filler')`
    length 4 y las tres primeras celdas de la fila 0 son rellenos
    (`children[0].children[i].props.testID === 'meals-history-filler'`).
  - celda `meals-history-day-2026-01-05`: `children` length 2 y
    `within(celda).getByTestId('meals-history-dot')`; celda `…-2026-01-06`:
    `children` length 1 y `queryByTestId('meals-history-dot')` null;
    `getAllByTestId('meals-history-dot')` length 2.
  - celda `…-2026-01-16` `toBeDisabled()` y `…-2026-01-15` `not.toBeDisabled()`;
    `getAllByTestId(/^meals-history-day-/).filter(c => c.props.accessibilityState?.disabled)`
    length 16.
  - `within(getByTestId('meals-history-day-2026-01-15')).getByTestId('meals-history-today')`
    y `queryAllByTestId('meals-history-today')` length 1.
  - celda `…-2026-01-05`: `props.accessibilityLabel === 'lunes, 5 de enero'`
    y `props.accessibilityRole === 'button'`.
  - candado de clases por grep de fuente (patrón `openingTagWithTestId` de
    `src/__tests__/consistency-classnames.test.ts`): la etiqueta con
    `testID="meals-history-today"` contiene `text-sm font-bold text-accent`; la
    etiqueta con `testID="meals-history-dot"` contiene
    `h-1.5 w-1.5 rounded-full bg-accent`; el fuente contiene exactamente una
    ocurrencia de `bg-accent-soft` y dos de `style={TABULAR_NUMS}`.
  Modo de fallo en rojo: `Unable to find an element with testID` en la
  rejilla; conteos `0` vs esperado; `toBeDisabled` falla por falta de prop.

### R12 — Navegación de meses con tope en el mes de "hoy"

- Estado inicial: `visibleMonth = monthOf(deviceToday)` con
  `deviceToday` = día civil del dispositivo (`new Date()` → `getFullYear()/getMonth()+1`,
  helper local `currentMonth(now: Date)` en el mismo `month-grid.ts`, con test
  `currentMonth(new Date(2026, 0, 15, 12))` ⇒ `'2026-01'`).
- WHEN se pulsa `meals-history-prev` THEN `visibleMonth = shiftMonth(visibleMonth, -1)`
  y `selectedDay = null`. Sin límite inferior.
- `capMonth = data?.kind === 'ok' ? monthOf(data.history.today) : monthOf(deviceToday)`.
  IF `visibleMonth >= capMonth` (comparación de cadenas `YYYY-MM`) THEN
  `meals-history-next` SHALL estar `disabled` con
  `accessibilityState={{ disabled: true }}` y el icono con color `muted`; si no,
  WHEN se pulsa THEN `visibleMonth = shiftMonth(visibleMonth, 1)` y
  `selectedDay = null`.
- Cada cambio de mes cambia `queryKey` (R7) y por tanto pide
  `monthRange(visibleMonth)` al backend (R6).
- **Test:** `describe('#105 R12: …')` en `src/screens/meals-history/index.test.tsx`
  (reloj fijo de R9, `getMealsHistory` resuelve `ok` para cualquier rango
  devolviendo el `from`/`to` pedidos y `today: '2026-01-15'`):
  - al montar, `meals-history-next` `toBeDisabled()`, `meals-history-prev`
    `not.toBeDisabled()`, título `'enero de 2026'`, primera llamada con
    `from '2026-01-01'`, `to '2026-01-31'`.
  - pulsar prev → título `'diciembre de 2025'`, segunda llamada con
    `('2025-12-01', '2025-12-31')`, `meals-history-next` `not.toBeDisabled()`,
    rejilla con 0 rellenos iniciales (`children[0].children[0].props.testID`
    empieza por `meals-history-day-`).
  - datos previos: con la segunda llamada **pendiente** (promesa sin
    resolver), tras pulsar prev el título ya es `'diciembre de 2025'`,
    `meals-history-grid` sigue presente y `queryByTestId('meals-history-skeleton')`
    es null (R9, `keepPreviousData`).
  - prev dos veces más → `'octubre de 2025'`; next → `'noviembre de 2025'`
    (cuarta y quinta llamada con sus rangos).
  - en diciembre 2025 ningún `meals-history-day-*` está disabled (todos
    pasados respecto a `today`).
  Modo de fallo en rojo: `getMealsHistory` `toHaveBeenCalledTimes` 1 vs 2;
  título no cambia.

### R13 — Detalle inline del día tocado

WHEN se pulsa una celda no futura THEN THE SYSTEM SHALL fijar
`selectedDay = date` (estado local `useState<string | null>(null)`) y
renderizar bajo la rejilla, dentro del mismo `Card`, un
`<View testID="meals-history-detail" className="gap-2">` con:

- `<Text testID="meals-history-detail-title" className="text-base font-bold text-foreground">{longDayLabel(selectedDay, locale)}</Text>`.
- IF `mealTimes.length === 0` THEN
  `<Text testID="meals-history-detail-empty" className="text-sm text-muted">{t('mealsHistory.noMealsOnDay')}</Text>`.
- ELSE una fila `<Text testID="meals-history-detail-time" style={TABULAR_NUMS} className="text-sm font-semibold text-foreground">` por hora, en el
  orden de `mealTimes`, seguida de
  `<Text testID="meals-history-detail-count" className="text-xs font-normal text-muted">`
  con `t('mealsHistory.servedOne')` si la longitud es 1 o
  `t('mealsHistory.servedMany', { count: mealTimes.length })` si es mayor.
- WHEN se pulsa la celda ya seleccionada THEN `selectedDay = null` (toggle) y
  el detalle desaparece.
- Pulsar relleno o celda futura no cambia `selectedDay` (relleno no es
  pulsable; futuro está `disabled`).
- No se compara con `mealsPerDay` ni con el horario (ver Fuera de alcance).
- **Test:** `describe('#105 R13: …')` (fixture de R9):
  - sin pulsar nada, `queryByTestId('meals-history-detail')` null.
  - pulsar `meals-history-day-2026-01-05` → `meals-history-detail-title`
    con texto `'lunes, 5 de enero'`, `getAllByTestId('meals-history-detail-time')`
    con textos `['08:00', '18:30']` en ese orden, `meals-history-detail-count`
    con texto `'2 comidas servidas'`, celda `toBeSelected()`
    (`accessibilityState.selected`).
  - pulsar `…-2026-01-14` → `['12:00']` y `'1 comida servida'`; la celda del
    día 5 ya no está `selected`.
  - pulsar `…-2026-01-06` → `meals-history-detail-empty` con texto
    `'Ese día no se sirvió ninguna comida'` y 0 `meals-history-detail-time`.
  - pulsar `…-2026-01-06` otra vez → `queryByTestId('meals-history-detail')` null.
  - pulsar `…-2026-01-20` (futuro, disabled) → sigue sin detalle.
  - con el día 5 seleccionado, pulsar `meals-history-prev` →
    `queryByTestId('meals-history-detail')` null (R12 resetea `selectedDay`).
  Modo de fallo en rojo: `Unable to find an element with testID
  meals-history-detail`; texto vacío vs literal.

### R14 — Entrada desde la pestaña Food

THE SYSTEM SHALL añadir en `src/app/(tabs)/food.tsx`, **inmediatamente después**
del `Card testID="meal-schedule-link"`, un `Card` idéntico en estructura:
`testID="meals-history-link"`, `onPress={() => router.push('/meals-history' as Href)}`,
`<Text testID="meals-history-link-title" className="text-base font-bold text-foreground">{t('food.mealsHistory')}</Text>`,
subtítulo `text-xs font-normal text-muted` con `t('food.mealsHistoryLinkSubtitle')`
y `<ChevronRight size={20} color={foreground} />` (import ya presente).

- **Test:** `src/app/(tabs)/__tests__/food.test.tsx`, `describe('#105 R14: …')`
  con el mock `router: { push: jest.fn(), back: jest.fn() }` ya declarado en el
  fichero: `meals-history-link-title` con texto `'Historial de comidas'`;
  `fireEvent.press(getByTestId('meals-history-link'))` → `router.push`
  `toHaveBeenCalledWith('/meals-history')`; el hermano anterior del card es
  `meal-schedule-link` (índice en `parent.children`). Comando con la ruta
  escapada: `bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx'`.
  Modo de fallo en rojo: `Unable to find an element with testID meals-history-link`.

---

## Requisitos de proceso

### R15 — Grep-clean, inventarios, dependencias y commits

- THE SYSTEM SHALL mantener los tres ficheros nuevos de móvil
  (`src/app/meals-history.tsx`, `src/screens/meals-history/index.tsx`,
  `src/utils/month-grid.ts`) libres de hex fuera del tema, clases arbitrarias
  `[...]`, `StyleSheet.create` y sombras legacy (C8): nuevo
  `describe('#105 R15: …')` en `src/__tests__/design-drift.test.ts` con el
  patrón `featureFiles` + `MEALS_BAR_STYLE_ESCAPES` de `#98 R10`.
- THE SYSTEM SHALL añadir la fila
  `'screens/meals-history/index.tsx': 1` a `screenSignOutCalls` (`#87 R19`,
  mismo fichero), con lo que la pantalla entra en 'keeps literal query keys
  out of every migrated screen' (prohíbe `queryKey: [` literal: la clave sale
  de `nutritionKeys`) y en 'preserves every mutation sign-out with zero delta'.
- THE SYSTEM SHALL añadir `'meals-history'` a la lista `it.each` de
  `R3` '%s importa el Card compartido' en `design-drift.test.ts` (la pantalla
  importa `Card` de `../../components/card`).
- `package.json`, `bun.lock` (móvil) y `pnpm-lock.yaml` (backend) SHALL quedar
  sin diff: cero dependencias nuevas (`git diff --stat origin/main -- '*package.json' '*bun.lock' '*pnpm-lock.yaml'` vacío).
- Cada R-id SHALL cerrarse con **dos commits como mínimo**: primero el test
  rojo (`test(<scope>): … (#105 R<n>)`), luego la implementación mínima
  (`feat(<scope>): … (#105 R<n>)`); refactor aparte si lo hay. Es C4 de
  `CHECKPOINTS.md`: historial rojo→verde, no un commit único.
- `bun run typecheck`, `bun run lint`, `bunx jest` (móvil) y `pnpm test`,
  `pnpm test:e2e` (backend) SHALL quedar verdes al cierre; `.expo/types/router.d.ts`
  se comprueba ausente con `test ! -e .expo/types/router.d.ts` antes del
  typecheck (nunca `rm -f`).
- `bunx jest` SHALL no usar `UNSAFE_*` de RNTL ni `process.env.TZ`.
- **Verificación:** el `reviewer` comprueba el log (`git log --oneline` con
  pares test/feat por R-id), el diff de lockfiles y los comandos anteriores.

---

## Entorno de la prueba de humo

> Gate humano separado de la aprobación de la spec. El humano lo cierra con su
> casilla propia (abajo); los tests no lo ven.

- **Dispositivo:** dev build de Android (no Expo Go), instalada desde la
  última build de desarrollo; `adb -s <ip:puerto>` si el teléfono sale dos
  veces por Wi-Fi.
- **Backend:** local (`./init.sh` o `pnpm start:dev` con la base migrada),
  LocalStack con credenciales `test`/`test`; `EXPO_PUBLIC_API_URL` apuntando a
  la IP LAN del VPS/PC que corre el backend, no a `localhost`.
- **Datos:** una mascota seleccionada con plan generado y filas de
  `meal_servings` en **dos meses distintos** (al menos una en el mes anterior
  y una hoy). Para las pasadas, servir desde la app no vale (siempre es hoy):
  insertar con el helper de e2e o con `drizzle-kit studio`, nunca `psql` crudo
  (lección del journal desincronizado).
- **Recorrido:** Food → card "Historial de comidas" → la pantalla abre con el
  mes actual, punto en hoy, flecha derecha deshabilitada; flecha izquierda →
  mes anterior con su punto; tocar el día → horas + recuento; tocar otra vez →
  se oculta; cambiar idioma en Perfil → títulos y copy en inglés
  ("Meals history", "January 2026"); modo oscuro → fondo y punto con tokens
  del tema.
- **Casos límite:** sin red (modo avión) → "Algo salió mal" + "Reintentar";
  mascota sin servicios → "Este mes no se sirvió ninguna comida" con la rejilla
  visible.

- [ ] **H1 — Prueba de humo en dev build Android superada** (humano, fecha: ____)

---

## Fuera de alcance

Clasificado viñeta a viñeta; cada una con su razón.

- **Comparar lo servido con `mealsPerDay` o con el horario del plan.** El
  horario no tiene historial: `nutrition_plans.mealTimes` es el valor actual,
  editable (#147), y aplicarlo a días pasados mentiría. El detalle muestra
  horas servidas y recuento, nada más. Si algún día se versiona el horario,
  será otra feature.
- **Pestaña nueva.** El caso de uso fija entrada desde Food como pantalla de
  pila; `detail-stack.test.tsx` `#114 R1` conserva "solo las cinco pestañas".
- **Paginación o rangos > 31 días.** El móvil pide el mes natural (≤ 31);
  `MEALS_HISTORY_MAX_RANGE_DAYS` lo acota en backend. Un rango de 42 celdas
  (mes + relleno) no se pide: los rellenos están vacíos y deshabilitados.
- **Detalle como ruta propia o bottom-sheet.** D10: panel inline con estado
  local. Sin `@expo/ui` BottomSheet ni `presentation: 'formSheet'`.
- **Cambios en `PetMealsReader` / `pet-meals.drizzle-reader.ts` ni en
  `GetNutritionPlanUseCase`.** `servedToday` sigue saliendo de ahí; el rango
  entra por el puerto `MealServingRepository`.
- **Migraciones y cambios de esquema.** `meal_servings` ya tiene índice por
  `(pet_id, served_on, meal_time)`; la consulta por rango lo usa.
- **iOS.** Decisión del humano relatada en memoria (2026-09-14): sin iOS.
- **Rechazar `to` futuro en backend.** El mes en curso incluye días futuros
  por construcción; se devuelven vacíos.
- **Dependencias nuevas.** Cero (`bun.lock`/`pnpm-lock.yaml` sin diff).
- **Semana que empieza en domingo según locale.** Lunes-primero fijo para
  `es` y `en` (convención es-MX; evita dos rejillas distintas por idioma).

---

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

Decisiones que esta spec cerró por su cuenta y el humano puede objetar aquí:
(1) rejilla lunes-primero para ambos idiomas; (2) `today` del backend manda
sobre el reloj del dispositivo para el tope y los días futuros; (3) la celda
es cápsula (`rounded-full`) para no mover los candados de `CONTINUOUS_CORNER`.
No hay "DECISIÓN ABIERTA PARA EL HUMANO": D1–D12 del leader se verificaron
viables en el árbol; la única enmienda es que la ruta se registra **al final**
de `Stack.Protected`, no tras `pairing`.
