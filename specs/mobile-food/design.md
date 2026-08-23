---
feature: "mobile-food"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-food]]

> Ver [[requirements]] para los requisitos. Autosuficiente para Codex CLI:
> rutas, símbolos y contratos exactos. Aplican las convenciones móviles de
> `docs/conventions.md` (`className` + tokens — cero StyleSheet/hex —,
> HeroUI Native, reicon, tests que nombran R-ids, bun) y la lección #34:
> posicionamiento absoluto/offsets por `style` inline.

## Contratos verificados (2026-08-23, contra el código del backend)

Todos con `Authorization: Bearer <token>` (JwtAuthGuard global) y detrás de
`PetAccessGuard` (404 genérico sin membresía). **NO hay `PetTrackingGuard`**:
nutrición es free-tier — no existe el 402/`no-tracking` de activity/positions.
Controller: `backend-pet-tracker/src/modules/nutrition/infrastructure/nutrition.controller.ts`
(`@Controller('pets/:petId')`, prefijo global `/v1` ya incluido en
`EXPO_PUBLIC_API_URL`, igual que el resto de clientes).

- **GET `/v1/pets/:petId/nutrition-profile`** (`NutritionController::get`,
  sin rol) — 200 → `NutritionProfileResponse`
  (`nutrition.mapper.ts::toNutritionProfileResponse`):
  `{ petId: string, activityLevel: 'low'|'medium'|'high',
  bodyCondition: number|null, targetWeightKg: number|null,
  foodType: 'dry'|'wet'|'mixed'|'homemade', kcalPer100g: number,
  allergies: string[], diseases: string[], updatedAt: string (ISO) }`.
  404 → `{ statusCode, code: 'NUTRITION_PROFILE_NOT_FOUND', message }`
  (`nutrition-error.mapper.ts`).
- **GET `/v1/pets/:petId/nutrition-plan`** (`::latestPlan`, sin rol) —
  200 → `NutritionPlanResponse` (`::toNutritionPlanResponse`):
  `{ id: string, petId: string, rerKcal: number, merKcal: number,
  dailyGrams: number, mealsPerDay: number, mealTimes: string[] ('HH:MM',
  p. ej. ['07:30','19:30'] — constantes `MEAL_TIMES_BY_COUNT` de
  `nutrition.constants.ts`, siempre 2–4 elementos ordenados),
  objective: 'maintenance'|'weight_loss'|'growth',
  warnings: { code, message }[] (`code` ∈ 'weight_loss_plan' |
  'underweight_vet' | 'chronic_disease_vet' | 'check_food_allergens' |
  'too_young_vet'; `message` en ESPAÑOL, persistido —
  `NUTRITION_WARNING_MESSAGES`), aiExplanation: string|null,
  generatedAt: string (ISO) }`.
  **`aiExplanation` llega SIEMPRE `null` hoy**: `toNutritionPlanResponse`
  lo hardcodea (`aiExplanation: null`) hasta #18. El tipo del cliente lo
  modela `string | null` y la UI cubre ambos casos (R6).
  404 → `{ code: 'NUTRITION_PLAN_NOT_FOUND' }`.
- **POST `/v1/pets/:petId/nutrition-plan/generate`** (`::generate`,
  `@RequirePetRole('owner')` → **403** para caregiver/viewer;
  `@HttpCode(200)`) — 200 → `NutritionPlanResponse` recién calculado por
  `computePlan` (`nutrition-engine.ts`) y persistido. 422 →
  `{ code: 'NUTRITION_PROFILE_REQUIRED' }` (sin perfil) o
  `{ code: 'PET_WEIGHT_REQUIRED' }` (mascota sin peso actual). No lee
  body: se envía `{}` para reutilizar `postJson` tal cual.
- **PUT `/v1/pets/:petId/nutrition-profile`** — existe (owner) pero **no
  se consume**: el alta/edición de perfil queda fuera de alcance; el
  smoke R11 lo usa vía curl.

## Decisiones técnicas

- **D1 — Diseño de referencia sin MCP.** El código fuente del Figma Make
  ya está volcado en `specs/mobile-figma-polish/design-src/App.tsx` (#46):
  `FoodScreen` (líneas 586–655) y `MealScheduleScreen` (líneas 1411–1510).
  No hizo falta (ni se intentó) el MCP de Figma en esta spec. El volcado
  es React web + Tailwind: sirve de referencia de layout/jerarquía, NO se
  copia código.

- **D2 — Cero dependencias nuevas.** No hay `expo-linear-gradient` ni se
  añade: la card verde con gradiente del diseño se resuelve con fondo
  sólido `bg-accent` + texto `text-accent-foreground` (tokens). El ring
  SVG de progreso del diseño no se implementa (no hay dato de kcal
  consumidas); el contador `served/mealsPerDay` (R5) lo sustituye.
  Componentes de HeroUI Native ya usados en Health: `Button`, `Card`,
  `Skeleton`, `Spinner`. Iconos de `reicon-react-native` (p. ej.
  `ForkKnife`, `Clock`, `ChevronRight` — los que ya existan en el set;
  si un icono no existe, texto sin icono, no se añade librería).

- **D3 — `aiExplanation` nullable como caso normal.** Render condicional
  estricto: `plan.aiExplanation !== null ? <Card .../> : null`. Nada de
  placeholders "AI coming soon" ni contenedores vacíos. Cuando #18
  encienda la IA, la card aparece sola sin tocar esta pantalla.

- **D4 — Tipos a mano en `src/api/types.ts`** (se amplía; espejo 1:1 de
  los mappers del backend):

  ```ts
  export interface NutritionProfile {
    petId: string;
    activityLevel: string;
    bodyCondition: number | null;
    targetWeightKg: number | null;
    foodType: string;
    kcalPer100g: number;
    allergies: string[];
    diseases: string[];
    updatedAt: string;
  }

  export interface NutritionWarning {
    code: string;
    message: string;
  }

  export interface NutritionPlan {
    id: string;
    petId: string;
    rerKcal: number;
    merKcal: number;
    dailyGrams: number;
    mealsPerDay: number;
    mealTimes: string[];
    objective: string;
    warnings: NutritionWarning[];
    aiExplanation: string | null;
    generatedAt: string;
  }
  ```

  (`activityLevel`/`foodType`/`objective` como `string` ancho: la UI solo
  los muestra, no ramifica por valor — mismo criterio que `Vaccine` en
  #37.)

- **D5 — Firmas de `src/api/nutrition.ts`** (nuevo; patrón exacto de
  `health-records.ts`, usando `getJson`/`postJson`/`readJson` de
  `http.ts`):

  ```ts
  export type NutritionProfileState =
    | { kind: 'ok'; profile: NutritionProfile }
    | { kind: 'not-found' }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export type NutritionPlanState =
    | { kind: 'ok'; plan: NutritionPlan }
    | { kind: 'not-found' }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export type GeneratePlanState =
    | { kind: 'ok'; plan: NutritionPlan }
    | { kind: 'forbidden' }
    | { kind: 'unprocessable'; code: string | null }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export async function getNutritionProfile(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<NutritionProfileState>;

  export async function getNutritionPlan(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<NutritionPlanState>;

  export async function generateNutritionPlan(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<GeneratePlanState>;
  ```

- **D6 — 404 unificado en `not-found`.** El 404 puede venir del recurso
  inexistente (`NUTRITION_*_NOT_FOUND`) o de `PetAccessGuard` (sin
  membresía). El cliente NO distingue por `body.code` en los GET: a un
  no-miembro ni siquiera le aparece la mascota en el selector, así que en
  la práctica `not-found` significa "aún no existe" y la UI lo trata como
  empty state. En el 422 de generate SÍ se lee `body.code` (dos mensajes
  distintos en R8; `readJson` + acceso defensivo, mismo estilo que el
  parsing de `errors` en `createWeight`).

- **D7 — Served/Pending derivado de la hora local.** El backend no
  persiste servings. `const now = new Date();` →
  `const hhmm = String(now.getHours()).padStart(2,'0') + ':' +
  String(now.getMinutes()).padStart(2,'0');` y cada `mealTime <= hhmm`
  (comparación lexicográfica, válida para `HH:MM` zero-padded) cuenta
  como servida. Porción por comida:
  `Math.round(plan.dailyGrams / plan.mealsPerDay)` — informativo, la suma
  puede no cuadrar exacta con `dailyGrams`. Tests con
  `jest.useFakeTimers({ doNotFake: [...] })` +
  `jest.setSystemTime(new Date('2026-08-23T13:00:00'))` (13:00 local:
  con `['07:30','19:30']` → 1/2 servidas) para asserts deterministas.

- **D8 — Idiomas.** Textos de UI en inglés (consistencia con
  Home/Map/Health). Los `warnings[].message` del backend llegan en
  español y se muestran tal cual (mensajes clínicos persistidos; no se
  traducen ni se truncan).

- **D9 — Generate solo en MealSchedule.** Un único punto de mutación
  simplifica estados y tests; el empty de Food dirige al usuario vía el
  link `Meal schedule` (siempre visible con mascota seleccionada). Sin
  react-query: `ok` → `refetch()` del plan de la propia pantalla; Food
  refetchea solo al remontar/cambiar de mascota (mismo comportamiento que
  Health tras crear un peso en WeightLog, aceptado en #37).

- **D10 — Rutas y layout.** `meal-schedule.tsx` vive en
  `src/app/(tabs)/` como ruta oculta (patrón `weight-log.tsx` de #37):
  Expo Router la registra por convención de archivos, `FloatingTabBar`
  la ignora (su array `TABS` filtra por nombre) y **no se toca**
  `_layout.tsx` ni `floating-tab-bar.tsx`. Scroll con
  `paddingBottom: insets.bottom + 96` (patrón Health) para no quedar
  bajo la tab bar.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `mobile-pet-tracker/src/api/types.ts` | ampliar: `NutritionProfile`, `NutritionPlan`, `NutritionWarning` (D4) |
| `mobile-pet-tracker/src/api/nutrition.ts` | NUEVO: clientes R1–R3 (D5) |
| `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts` | NUEVO: suites R1–R3 |
| `mobile-pet-tracker/src/app/(tabs)/food.tsx` | REESCRITO: hub Food R4–R6 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx` | NUEVO: suites R4–R6 |
| `mobile-pet-tracker/src/app/(tabs)/meal-schedule.tsx` | NUEVO: pantalla R7–R8 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/meal-schedule.test.tsx` | NUEVO: suites R7–R8 |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx` | excepción C4: quitar la fila e import de Food |
| `progress/impl_mobile-food.md` | NUEVO: reporte del implementador |

## Alternativas descartadas

- **react-query / SWR**: el umbral de adopción (#36 §D2) no se cruza —
  una sola mutación que invalida su propia pantalla.
- **Duplicar el botón Generate en Food**: dos puntos de mutación y dos
  juegos de estados de error por un solo endpoint; el link a MealSchedule
  cubre el flujo.
- **Distinguir 404 por `body.code` en los GET**: sin uso en la UI (ambos
  casos renderizan igual); se deja documentado en D6 por si una feature
  futura lo necesita.
- **`expo-linear-gradient` para la card del diseño**: dependencia nueva
  por un fondo; tokens sólidos dan el mismo layout.
- **Persistir "servido" localmente (AsyncStorage)**: estado fantasma que
  divergiría del backend real cuando exista tracking; la derivación por
  hora es honesta y sin estado.
