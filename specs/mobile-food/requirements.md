---
feature: "mobile-food"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-food]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D9). Las capas de
> `docs/architecture.md` son de backend y NO aplican a esta app; sí aplican
> kebab-case, tests que nombran su R-id y conventional commits
> (`docs/conventions.md` §Convenciones de la app móvil).
> Contratos del backend verificados contra el código real el 2026-08-23
> (ver [[design]] §Contratos verificados).
> Diseño de referencia: fuente del Figma Make ya volcada en
> `specs/mobile-figma-polish/design-src/App.tsx` (`FoodScreen` líneas
> 586–655, `MealScheduleScreen` líneas 1411–1510) — no hizo falta el MCP
> de Figma ([[design]] §D1).

## Contexto fijo (no reabrir)

- Base: estado tras #37/#46 — Home, Map y Health reales y pulidos;
  `SelectedPetProvider` montado en `src/app/(tabs)/_layout.tsx`; `useApi`
  con stale-while-revalidate e `isRefreshing` (`src/hooks/use-api.ts`, 401
  → `signOut()` automático); clientes `fetchFn`/`kind` en `src/api/`
  (`http.ts` con `getJson`/`postJson`/`readJson`/`apiUrl`).
- `src/app/(tabs)/food.tsx` es hoy el ÚLTIMO placeholder de tabs
  (`testID="screen-food"`, texto `Food`). Esta feature lo reemplaza por la
  pantalla real. El tab ya está registrado en `_layout.tsx` y en
  `FloatingTabBar` (`tab-food`) — **cero cambios** en `_layout.tsx` ni en
  `floating-tab-bar.tsx`: la ruta nueva `meal-schedule` queda fuera de la
  tab bar por el mismo mecanismo que `weight-log` (el `TABS` array del
  componente filtra por nombre).
- **Cero dependencias nuevas** ([[design]] §D2). Sin react-query (el
  umbral de #36 §D2 no se cruza: `generateNutritionPlan` invalida solo la
  carga de su propia pantalla vía `refetch()`).
- Decisión de #33 (vigente): las funciones de `src/api/` reciben
  `token`/`fetchFn` por parámetro y nunca leen storage ni importan React.
  Tipos a mano en `src/api/types.ts` (D11 de #35: no hay OpenAPI).
- Los endpoints de nutrition están detrás de `PetAccessGuard` solamente —
  NO hay `PetTrackingGuard` (free-tier, no existe 402 aquí). Los GET no
  exigen rol; `POST /nutrition-plan/generate` exige rol `owner` (403 para
  caregiver/viewer).
- **`aiExplanation` es `string | null` y HOY siempre llega `null`**: el
  mapper del backend lo hardcodea a `null` hasta que #18 (IA) se
  implemente ([[design]] §D3). La UI debe estar lista para ambos casos.
- Lección de #34 (vigente): posicionamiento absoluto y offsets numéricos
  por `style` inline; el resto con `className` + tokens (cero hex, cero
  `StyleSheet.create`).
- Smoke humano 100% **Expo Go** (`bunx expo start --go`), SDK 57, Android
  físico. Nada nativo nuevo.

## Excepción a C4 (cambios sobre código existente)

- `src/app/(tabs)/__tests__/screens.test.tsx`: la fila
  `{ Screen: FoodScreen, testID: 'screen-food', title: 'Food' }` del
  `it.each` de placeholders **se elimina** (junto con el import de
  `FoodScreen`) — su cobertura queda superada por la suite nueva
  `food.test.tsx` (R4). La fila de Profile y el resto de casos NO se tocan
  y deben seguir verdes. El reviewer lo cubre con `git diff` (solo esa
  fila y el import desaparecen).

Todo lo demás (R1–R8) sigue TDD estricto con test rojo primero.

## Requisitos funcionales

### Cliente API (`src/api/nutrition.ts`, nuevo)

- **R1**: WHEN se llama `getNutritionProfile(baseUrl, token, petId, fetchFn)`
  de `mobile-pet-tracker/src/api/nutrition.ts` (firma exacta en [[design]]
  §D5) THE SYSTEM SHALL hacer
  `GET ${baseUrl}/pets/${petId}/nutrition-profile` (vía `getJson` de
  `http.ts`: mismo saneo de `/` y header `Authorization: Bearer ${token}`)
  y devolver un `NutritionProfileState`:
  - HTTP 200 con body objeto → `{ kind: 'ok', profile }`
    (`NutritionProfile`, §D4);
  - HTTP 404 (perfil inexistente o `PetAccessGuard`, [[design]] §D6) →
    `{ kind: 'not-found' }`;
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no objeto → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }` sin llamar a
    `fetchFn`.
  *Test: `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts` →
  `describe('R1: getNutritionProfile mapea la respuesta por kind', ...)`
  con `fetchFn` stub por caso (mismo patrón que la suite de
  health-records), asserts de URL exacta y header. ROJO primero.*

- **R2**: WHEN se llama `getNutritionPlan(baseUrl, token, petId, fetchFn)`
  del mismo archivo THE SYSTEM SHALL hacer
  `GET ${baseUrl}/pets/${petId}/nutrition-plan` y devolver un
  `NutritionPlanState`:
  - HTTP 200 con body objeto → `{ kind: 'ok', plan }` (`NutritionPlan`,
    §D4 — incluye `aiExplanation: string | null` y `warnings` con los
    mensajes en español persistidos por el backend);
  - HTTP 404 → `{ kind: 'not-found' }` (aún no se generó ningún plan);
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no objeto → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  *Test: mismo archivo → `describe('R2: getNutritionPlan mapea la
  respuesta por kind', ...)` — incluye un caso con `aiExplanation: null` y
  otro con string. ROJO primero.*

- **R3**: WHEN se llama `generateNutritionPlan(baseUrl, token, petId, fetchFn)`
  del mismo archivo THE SYSTEM SHALL hacer
  `POST ${baseUrl}/pets/${petId}/nutrition-plan/generate` con body `{}`
  vía `postJson` de `http.ts` y devolver un `GeneratePlanState`:
  - HTTP 200 con body objeto → `{ kind: 'ok', plan }` (`NutritionPlan`);
  - HTTP 403 (rol no-owner) → `{ kind: 'forbidden' }`;
  - HTTP 422 → `{ kind: 'unprocessable', code }` con `code` =
    `body.code` si es `'NUTRITION_PROFILE_REQUIRED'` o
    `'PET_WEIGHT_REQUIRED'`, si no `null` ([[design]] §D6);
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no objeto → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  AND THE SYSTEM SHALL NOT importar `expo-secure-store` ni React en ningún
  archivo bajo `src/api/` (regla de #33; reviewer grep).
  *Test: mismo archivo → `describe('R3: generateNutritionPlan publica y
  mapea por kind', ...)` con asserts de method POST, headers y los dos
  codes de 422. ROJO primero.*

### Pantalla Food (`src/app/(tabs)/food.tsx`, reescrita)

- **R4**: WHEN Food monta con sesión activa THE SYSTEM SHALL renderizar el
  hub (`testID="screen-food"`, título `Food`) y resolver la mascota:
  carga `listPets` vía `useApi` y aplica la misma selección por defecto
  que Home/Map/Health (IF `selectedPetId` es `null` o no está en la lista
  THEN `selectPet(pets[0].id)`), renderizando el selector de chips
  (`testID="pet-chip-<id>"`, seleccionada con
  `accessibilityState={{ selected: true }}`; mismo patrón que Health R4):
  - WHILE pets vuela SHALL mostrar `testID="food-loading"` (Spinner);
  - IF pets resuelve `ok` con lista vacía THEN SHALL mostrar `No pets yet`
    (`testID="food-empty"`);
  - IF pets resuelve `error | unreachable | missing-config` THEN SHALL
    mostrar `Something went wrong` (`testID="food-error"`) con `Button`
    `Retry` (`testID="food-retry"`) que llama `refetch`.
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx`
  (nuevo) → `describe('R4: food resuelve la mascota seleccionada', ...)`
  mockeando `../../../api/pets`, `../../../api/nutrition` y
  `../../../providers/auth-provider`; `SelectedPetProvider` real como
  wrapper y `useApi` real (misma línea que #37). ROJO primero.*

- **R5**: WHEN `getNutritionPlan` de la mascota seleccionada (vía
  `useApi`) resuelve THE SYSTEM SHALL mostrar el plan del día:
  - WHILE la carga vuela SHALL mostrar `Skeleton`
    (`testID="food-plan-skeleton"`);
  - IF `kind === 'ok'` THEN SHALL mostrar la card resumen
    (`testID="food-plan-card"`) con `testID="food-plan-kcal"` =
    `${merKcal} kcal / day` y `testID="food-plan-grams"` =
    `${dailyGrams} g / day`; AND la sección `Meals today`
    (`testID="food-meals-section"`) con una fila por elemento de
    `mealTimes` en el orden recibido: `testID="meal-row-<index>"`
    (índice 0-based) con la hora (`HH:MM`) y la porción por comida
    `${portionGrams} g` donde
    `portionGrams = Math.round(dailyGrams / mealsPerDay)` ([[design]]
    §D7); IF la hora de la fila es `<=` la hora local actual `HH:MM`
    (comparación de strings, §D7) THEN la fila muestra el badge `Served`
    (`testID="meal-served-<index>"`) ELSE el badge `Pending`
    (`testID="meal-pending-<index>"`); AND el contador
    `testID="food-meals-progress"` = `${served}/${mealsPerDay}`;
  - IF `kind === 'ok'` y `warnings.length > 0` THEN SHALL listar cada
    warning con su `message` tal cual (en español, §D8):
    `testID="plan-warning-<code>"`; IF `warnings` está vacío THEN SHALL
    no renderizar la sección de warnings;
  - IF `kind === 'not-found'` THEN SHALL mostrar `No meal plan yet`
    (`testID="food-plan-empty"`) — estado con gracia, no error;
  - IF `kind === 'error' | 'unreachable'` THEN SHALL mostrar
    `Could not load meal plan` (`testID="food-plan-error"`) con `Retry`
    (`testID="food-plan-retry"`) que llama su `refetch`;
  - en todos los casos con mascota seleccionada SHALL mostrar el
    `Pressable testID="meal-schedule-link"` (texto `Meal schedule`) que
    al pulsarse llama `router.push('/meal-schedule')`.
  *Test: mismo archivo → `describe('R5: plan del día con horarios y
  warnings', ...)` con fecha/hora congelada (`jest.useFakeTimers` +
  `setSystemTime`, §D7) para asserts deterministas de Served/Pending y
  del contador; fixtures: plan de 2 y de 3 comidas, con y sin warnings,
  not-found, error. Mock de `expo-router` (`router.push`). ROJO primero.*

- **R6**: IF el plan cargado tiene `aiExplanation !== null` THEN THE
  SYSTEM SHALL mostrar la card `AI recommendation`
  (`testID="food-ai-card"`) con el texto de `aiExplanation`; IF
  `aiExplanation === null` THEN THE SYSTEM SHALL NOT renderizar
  `food-ai-card` ni ningún contenedor vacío en su lugar (la sección
  simplemente no existe: `queryByTestId('food-ai-card')` es `null`, y el
  resto de la pantalla renderiza completo). La IA (#18) puede estar
  apagada indefinidamente — `null` es el caso normal, no el excepcional.
  *Test: mismo archivo → `describe('R6: aiExplanation nullable con
  gracia', ...)` con los dos fixtures de R2 (null y string). ROJO
  primero.*

### Pantalla MealSchedule (`src/app/(tabs)/meal-schedule.tsx`, nueva ruta oculta)

- **R7**: WHEN MealSchedule monta (`testID="screen-meal-schedule"`,
  título `Meal schedule`, botón `testID="meal-schedule-back"` que llama
  `router.back()`) AND hay `selectedPetId` THE SYSTEM SHALL cargar
  `getNutritionPlan` y `getNutritionProfile` vía `useApi`:
  - IF el plan resuelve `ok` THEN SHALL mostrar el resumen
    (`testID="meal-schedule-summary"` con `${merKcal} kcal`,
    `${mealsPerDay} meals / day` y `${dailyGrams} g / day`) y la lista de
    horarios: fila `testID="meal-time-row-<index>"` por cada `mealTimes`
    en orden, con la hora y `${portionGrams} g` (misma fórmula §D7);
  - IF el plan resuelve `not-found` THEN SHALL mostrar
    `No meal plan yet` (`testID="meal-schedule-empty"`);
  - IF el perfil resuelve `ok` THEN SHALL mostrar la sección
    `Nutrition profile` (`testID="nutrition-profile-section"`) con
    `foodType`, `${kcalPer100g} kcal / 100 g`, `activityLevel`, y — solo
    si no están vacíos — `allergies` y `diseases` unidos por `', '`
    (`testID="profile-allergies"` / `testID="profile-diseases"`);
  - IF el perfil resuelve `not-found` THEN SHALL mostrar
    `No nutrition profile yet` (`testID="nutrition-profile-empty"`);
  - IF plan o perfil resuelven `error | unreachable | missing-config`
    THEN SHALL mostrar `Something went wrong`
    (`testID="meal-schedule-error"`) con `Retry`
    (`testID="meal-schedule-retry"`) que refetchea ambos;
  - WHILE alguna carga vuela SHALL mostrar
    `testID="meal-schedule-loading"`;
  - IF `selectedPetId === null` THEN SHALL renderizar
    `<Redirect href="/food" />` (solo se llega desde Food; el redirect
    cubre el deep-link frío — mismo patrón que weight-log R7 de #37).
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/meal-schedule.test.tsx`
  (nuevo) → `describe('R7: meal schedule muestra horarios y perfil', ...)`
  mockeando `../../../api/nutrition`, `../../../providers/auth-provider`
  y `expo-router`; `SelectedPetProvider` real como wrapper con selección
  inicial (patrón §D10 de #37). ROJO primero.*

- **R8**: WHILE MealSchedule muestra plan o estado vacío THE SYSTEM SHALL
  mostrar el `Button testID="generate-plan-button"` (texto
  `Generate plan`). WHEN se pulsa THE SYSTEM SHALL llamar
  `generateNutritionPlan` y, según el `kind`:
  - `ok` → limpiar cualquier error previo y refetchear el plan (la lista
    de horarios y el resumen se actualizan; Food lo verá fresco al volver
    por su propio fetch);
  - `forbidden` → `Only the owner can generate the plan`
    (`testID="generate-plan-error"`);
  - `unprocessable` con code `NUTRITION_PROFILE_REQUIRED` →
    `Create a nutrition profile first`; con code `PET_WEIGHT_REQUIRED` →
    `Register a weight first`; con code `null` → `Something went wrong`;
  - `error | missing-config` → `Something went wrong`;
  - `unreachable` → `Cannot reach server`;
  - WHILE el POST vuela el botón SHALL estar deshabilitado.
  *Test: mismo archivo `meal-schedule.test.tsx` → `describe('R8: generar
  plan con degradación por kind', ...)` con `generateNutritionPlan`
  mockeado por caso; assert de que `ok` dispara un nuevo
  `getNutritionPlan`. ROJO primero.*

### Tipado y contención

- **R9**: WHEN se ejecuta `bun run typecheck` en `mobile-pet-tracker/`
  tras los cambios THE SYSTEM SHALL salir con exit 0, AND `bun run lint`
  SHALL salir con exit 0.
  *Verificación: implementer ejecuta ambos y lo anota en
  `progress/impl_mobile-food.md`; el reviewer los re-ejecuta.*

- **R10**: WHILE la feature #38 esté en curso THE SYSTEM SHALL NOT
  modificar archivos bajo `backend-pet-tracker/`, `infra/`,
  `init.config.sh` ni `.github/workflows/ci.yml`; WHEN se ejecuta
  `./init.sh` tras los cambios THE SYSTEM SHALL terminar con exit 0; AND
  la suite móvil completa (`bun run test` en `mobile-pet-tracker/`) SHALL
  quedar verde, incluidas las suites de #33–#37 y #46 (único diff
  permitido sobre tests existentes: la excepción C4 de esta spec — la
  fila de Food en `screens.test.tsx`).
  *Verificación: reviewer ejecuta `./init.sh`, `bun run test` y
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  (vacío). Además: `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/`
  sin resultados nuevos.*

### Prueba de humo del humano

- **R11**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL mostrar el tab Food real contra el backend local en
  Android físico. Preparación (misma WiFi, `.env` con IP LAN, backend
  arriba con `docker compose up -d` +
  `pnpm -C backend-pet-tracker run start:dev`):

  0. Datos: la mascota necesita al menos un peso registrado (tab Health →
     Weight log de #37, o curl). Crear el perfil nutricional vía API (no
     hay UI de alta, fuera de alcance):
     `curl -X PUT http://<IP>:3000/v1/pets/<petId>/nutrition-profile -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"activityLevel":"medium","foodType":"dry","kcalPer100g":350,"allergies":[],"diseases":[]}'`
  1. Desde `mobile-pet-tracker/`: `bunx expo start --go` y escanear el QR.
  2. Login → tab Food ANTES de generar plan: `No meal plan yet`
     (`food-plan-empty`), sin crash ni hueco.
  3. `Meal schedule` → perfil nutricional visible; `No meal plan yet`;
     pulsar `Generate plan` → aparecen resumen y horarios.
  4. Volver a Food → card de kcal/gramos, comidas del día con
     Served/Pending coherentes con la hora local y contador X/Y.
  5. Verificar que NO hay card de `AI recommendation` (aiExplanation es
     null hoy) y que el layout no deja hueco donde iría.
  6. Con otra cuenta miembro no-owner (o borrando el perfil) probar la
     degradación del botón Generate (403/422) → mensajes con gracia, sin
     crash.
  7. Cambiar de mascota en el selector → plan/estados se recargan.
  8. Apagar el backend → `Could not load meal plan` + Retry funcional al
     re-levantarlo.
  9. Tab bar flotante visible sin tapar contenido (scroll con padding
     inferior) en Food y MealSchedule.

  - [ ] Smoke ejecutado por el humano (fecha: ____)

## Fuera de alcance

- **Crear/editar el perfil nutricional desde la app** (formulario PUT):
  el smoke lo crea vía curl; feature móvil futura.
- **Marcar comida como servida / tracking de raciones consumidas**: el
  backend no persiste servings — el estado Served/Pending se deriva de la
  hora local (§D7). Los botones `Marcar servido` / `Editar horario` /
  `Añadir comida` del diseño no son implementables sin backend nuevo.
- Selector editable de `Alimento principal` (el perfil solo guarda
  `foodType`/`kcalPer100g`; el catálogo de marcas del diseño no existe).
- Recordatorios/notificaciones de comidas (la card `Recordatorios
  activos` del diseño; los reminders de backend son otra feature).
- `aiExplanation` real (#18): esta feature solo renderiza el campo.
- Progreso de kcal consumidas del diseño (ring SVG / `caloriesConsumed`):
  no hay dato en backend; el contador de comidas servidas lo sustituye.
- Imagen hero de la mascota y gradientes del diseño ([[design]] §D9:
  tokens sólidos, cero dependencias nuevas).
- Regenerar el plan automáticamente al cambiar peso/perfil (el botón
  manual cubre v1).
- Cambios a `backend-pet-tracker/`, `infra/`, `init.config.sh`, CI (R10).

## Decisiones del gate (resueltas por humano, 2026-08-24)

- **D7 — Served/Pending por hora local**: APROBADO tal como está en
  [[design]] §D7 (badge derivado comparando `HH:MM` local). R5 se
  mantiene íntegro.
- **D9 — sin generate en Food**: APROBADO — el botón `Generate plan`
  vive solo en MealSchedule; el empty de Food (`No meal plan yet`)
  dirige ahí vía el link `Meal schedule`.
- Menores (porción `Math.round(dailyGrams / mealsPerDay)` informativa,
  UI en inglés con warnings del backend en español tal cual, perfil
  nutricional en MealSchedule y no en Food): sin objeción, quedan como
  están.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-24) ← gate obligatorio antes de implementar
