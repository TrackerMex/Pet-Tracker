---
feature: "mobile-health"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-health]]

> Ver [[requirements]] para los requisitos. Autosuficiente para Codex CLI:
> rutas, símbolos y contratos exactos. Aplican las convenciones móviles de
> `docs/conventions.md` (`className` + tokens — cero StyleSheet/hex —,
> HeroUI Native, reicon, tests que nombran R-ids, bun) y la lección #34:
> posicionamiento absoluto/offsets por `style` inline.

## Contratos verificados (2026-08-22, contra el código del backend)

Todos con `Authorization: Bearer <token>` (JwtAuthGuard global) y detrás de
`PetAccessGuard` (404 genérico sin membresía). **NO hay `PetTrackingGuard`**:
salud es free-tier — aquí no existe el 402/`no-tracking` de activity/positions.

- **GET `/v1/pets/:petId/vaccines`** (`vaccines.controller.ts::list`) —
  200 → `VaccineResponse[]` en orden **desc por `appliedAt`, desc por `id`**
  (`vaccine.drizzle.repository.ts:55`). `VaccineResponse`
  (`vaccine.mapper.ts`): `{ id, petId, catalogId: string|null, name: string,
  appliedAt: string ('YYYY-MM-DD'), nextDoseAt: string|null,
  vetName: string|null, clinic: string|null, notes: string|null,
  documentKey: string|null }`.
- **GET `/v1/vaccine-catalog?species=dog|cat`** — existe pero **no se
  consume**: solo sirve para el alta de vacunas, que está fuera de alcance.
- **GET `/v1/pets/:petId/weights?limit=`** (`weights.controller.ts::list`) —
  query estricta `{ limit?: 1..100, default 50 }` (`z.strictObject`: un
  param desconocido es 400). 200 → `WeightResponse[]` en orden **desc por
  `measuredAt`, desc por `id`** (`weight.drizzle.repository.ts:63`).
  `WeightResponse` (`weight.mapper.ts`): `{ id, petId, weightKg: number,
  measuredAt: string ('YYYY-MM-DD'), bodyCondition: number|null,
  variation: number|null }`. `variation` = delta en kg (2 decimales) vs la
  entrada inmediatamente anterior por fecha; `null` en la más antigua
  (`weight-variation.ts`) — el cliente NO recalcula variaciones.
- **POST `/v1/pets/:petId/weights`** (`weights.controller.ts::create`) —
  `@RequirePetRole('owner')` → **403** para caregiver/viewer. Body
  (`weight.dto.ts`, `z.strictObject` — claves extra son 400):
  `{ weightKg: number > 0 y <= 999.99, measuredAt: 'YYYY-MM-DD' <= hoy+1
  (UTC), bodyCondition?: entero 1..9 }`. 201 → `WeightResponse` con
  `variation` ya calculada vs la entrada previa. 400 →
  `{ statusCode, message: 'Validation failed', errors: [{ path, message }] }`
  (mismo shape que auth). Es la **única vía de escritura de peso** (#22
  weight-single-source-of-truth: `pets.currentWeightKg` es derivado, no se
  postea a pets).
- **Seeds**: `pnpm -C backend-pet-tracker run seed:vaccines` siembra SOLO el
  catálogo (`scripts/seed-vaccines.ts`); las vacunas por mascota se crean
  vía `POST /v1/pets/:petId/vaccines` (smoke R13 paso 0).
- **`nextVaccine` del pet detail** (`pet-vaccine-reader.ts`):
  `{ id, name, nextDoseAt }` — NO se usa aquí (§D6: derivación local desde
  la lista, ahorra un fetch).

## Decisiones técnicas

- **D1 — Cero dependencias nuevas; SIN bottom-sheet.**
  `@gorhom/bottom-sheet` ya figura en `package.json` (peer de HeroUI,
  instalado desde el scaffold) pero no se usa: el alta de peso vive inline
  en la pantalla WeightLog dedicada — un sheet no aporta nada sobre una
  pantalla propia y sumaría mocking de gestos/portals a los tests. La
  gráfica usa `react-native-svg 15.15.4` (instalado desde #32, ya cubierto
  por `transformIgnorePatterns`): una `Polyline` de ~30 líneas (§D8), sin
  librería de charts.

- **D2 — Tipos a mano en `src/api/types.ts`** (se amplía; D11 de #35
  sigue — el backend no publica OpenAPI). Espejo 1:1 de los mappers:

  ```ts
  export interface Vaccine {
    id: string;
    petId: string;
    catalogId: string | null;
    name: string;
    appliedAt: string;
    nextDoseAt: string | null;
    vetName: string | null;
    clinic: string | null;
    notes: string | null;
    documentKey: string | null;
  }

  export interface WeightEntry {
    id: string;
    petId: string;
    weightKg: number;
    measuredAt: string;
    bodyCondition: number | null;
    variation: number | null;
  }
  ```

  `FieldError` ya existe en `types.ts` (auth) y se reutiliza para el 400 de
  `createWeight`.

- **D3 — Estados discriminados** (mismo esqueleto que pets/positions):
  sin `no-tracking` (no hay guard de tracking en health) y con dos kinds
  nuevos solo en el POST: `validation` (400, espejo de `login`) y
  `forbidden` (403 de `RequirePetRole('owner')`).

- **D4 — `src/api/health-records.ts`** (nuevo) + `postJson` en `http.ts`.
  `http.ts` gana el gemelo autenticado de `getJson` (el `postJson` privado
  de `auth.ts` no lleva `Authorization` y es privado — no se toca):

  ```ts
  // http.ts (añadir)
  export async function postJson(
    baseUrl: string,
    path: string,
    token: string,
    body: unknown,
    fetchFn: typeof fetch,
  ): Promise<GetResult>;
  // fetchFn(apiUrl(baseUrl, path), { method: 'POST',
  //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify(body) })
  // catch → { kind: 'unreachable', message }
  ```

  ```ts
  // health-records.ts
  import type { FieldError, Vaccine, WeightEntry } from './types';

  export type VaccinesState =
    | { kind: 'ok'; vaccines: Vaccine[] }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export type WeightsState =
    | { kind: 'ok'; weights: WeightEntry[] }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export interface CreateWeightInput {
    weightKg: number;
    measuredAt: string;
    bodyCondition?: number;
  }

  export type CreateWeightState =
    | { kind: 'ok'; weight: WeightEntry }
    | { kind: 'validation'; errors: FieldError[] }
    | { kind: 'forbidden' }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export async function listVaccines(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<VaccinesState>;

  export async function listWeights(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
    limit?: number,
  ): Promise<WeightsState>;

  export async function createWeight(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    input: CreateWeightInput,
    fetchFn: typeof fetch = fetch,
  ): Promise<CreateWeightState>;
  ```

  Mapeo: listas — 200 + `Array.isArray(body)` → `ok` (validación mínima,
  sin chequear cada clave), 401 → `unauthorized`, resto → `error`.
  `listWeights`: path `/pets/${petId}/weights` y `?limit=${limit}` SOLO si
  `limit !== undefined` (query estricta del backend). `createWeight`:
  201 → `ok`; 400 → `validation` con `errors` del body
  (`Array.isArray(body.errors) ? body.errors : []`); 403 → `forbidden`;
  401 → `unauthorized`; resto → `error`. El body del POST omite
  `bodyCondition` cuando es `undefined` (spread condicional — el schema es
  strict pero `JSON.stringify` ya omite undefined; no enviar `null`).

- **D5 — Pantalla Health** (`src/app/(tabs)/health.tsx`, reescrita: de
  health-check del backend a hub de salud — el check se muda a Profile,
  §D9). Estructura (misma disciplina que Home D9 de #35: `className` +
  tokens; hueco de la tab bar como padding inferior inline):

  ```
  ScrollView testID="screen-health"
    className="flex-1 bg-background"
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 96 }}
  ├── Text "Health" className="text-2xl font-semibold text-foreground"
  ├── [R4] estados: health-loading (Spinner) | health-error + health-retry | health-empty
  ├── [R4] selector: ScrollView horizontal con Chip/Pressable por pet
  │        testID="pet-chip-<id>" (mismo patrón que Home R6)
  ├── [R5] sección Vaccines (testID="vaccines-section", título "Vaccines")
  │   ├── next-vaccine-card (Card destacada, label "Next due":
  │   │     name + nextDoseAt; icono HeartPulse de reicon)
  │   ├── vaccine-row-<id> por vacuna (orden recibido):
  │   │     name · appliedAt · nextDoseAt („text-danger" si < hoy)
  │   └── vaccines-empty | vaccines-error + vaccines-retry | vaccines-skeleton
  └── [R6] Card Weight (testID="weight-card", título "Weight")
      ├── weight-current (`${weightKg} kg`) + weight-variation (fmtVariation)
      │   | weight-card-empty | weight-card-error
      └── Pressable testID="weight-log-link" ("Weight log" + ChevronRight)
            onPress: router.push('/weight-log')
  ```

  Wiring (con `token` de `useAuth()`, `baseUrl` de
  `process.env.EXPO_PUBLIC_API_URL`, `selectedPetId` de `useSelectedPet()`):

  ```tsx
  const petsFn = useCallback(() => listPets(baseUrl, token ?? ''), [baseUrl, token]);
  const pets = useApi(petsFn);
  const vaccinesFn = useMemo(
    () => (selectedPetId ? () => listVaccines(baseUrl, token ?? '', selectedPetId) : null),
    [baseUrl, token, selectedPetId],
  );
  const vaccines = useApi(vaccinesFn);
  const weightFn = useMemo(
    () => (selectedPetId ? () => listWeights(baseUrl, token ?? '', selectedPetId, fetch, 1) : null),
    [baseUrl, token, selectedPetId],
  );
  const weight = useApi(weightFn);
  ```

  Selección por defecto (R4): mismo `useEffect` de 5 líneas que Home/Map.
  **3ª duplicación consciente** — #36 D6 fijó "al tercer uso se extrae",
  pero extraer aquí obliga a reabrir `home.tsx`/`map.tsx` estables y sus
  suites dentro de una feature que no va de eso; queda como follow-up
  dedicado (punto del gate). Helpers locales del archivo:
  - `localTodayIso()`: fecha local del dispositivo como `YYYY-MM-DD`
    (`getFullYear/getMonth/getDate` con pad — NO `toISOString`, que es UTC
    y rompe de noche en GMT-6).
  - `fmtVariation(v: number | null)`: `null` → `'—'`; `v > 0` →
    `` `+${v} kg` ``; resto → `` `${v} kg` ``.

- **D6 — "Próxima vacuna" derivada en el cliente** (R5). La lista completa
  ya está cargada; la card destacada es:
  `vaccines.filter(v => v.nextDoseAt !== null && v.nextDoseAt >= localTodayIso())`
  → menor `nextDoseAt` (comparación de strings ISO, `sort()[0]` o reduce).
  Alternativa descartada: leer `pet.nextVaccine` de `getPet` — un fetch
  extra para un dato derivable en 3 líneas de la lista ya pedida. Matiz
  aceptado: el backend calcula "hoy" en su reloj y aquí se usa la fecha
  local del dispositivo — para fechas de vacunas (granularidad de días) la
  discrepancia es irrelevante.

- **D7 — Pantalla WeightLog** (`src/app/(tabs)/weight-log.tsx`, nueva).
  **Ruta oculta dentro de `(tabs)`**: así hereda el guard de sesión y el
  `SelectedPetProvider` del layout. `FloatingTabBar` itera su constante
  `TABS` y hace `state.routes.find(...)` — una ruta extra simplemente no
  pinta botón (verificado en `floating-tab-bar.tsx:51-55`); mientras
  WeightLog está activa ningún tab se marca activo (aceptable). NO se toca
  `src/app/(tabs)/_layout.tsx`: expo-router registra la ruta por archivo.
  Navegación: entra por `router.push('/weight-log')` (R6), sale por
  `router.back()` (botón `weight-log-back`, icono de flecha de reicon).

  ```
  ScrollView testID="screen-weight-log" (mismas convenciones de padding)
  ├── fila: Pressable testID="weight-log-back" (router.back()) + Text "Weight log"
  ├── [R8] WeightChart entries={weights} (solo en ok)
  ├── [R9] form inline (Card):
  │     TextField/Input testID="weight-input"      (keyboardType decimal-pad, placeholder "Weight (kg)")
  │     TextField/Input testID="weight-date-input" (defaultValue localTodayIso())
  │     TextField/Input testID="weight-bc-input"   (keyboardType number-pad, placeholder "Body condition 1-9 (optional)")
  │     Text testID="weight-form-error" (solo con error; text-danger)
  │     Button testID="weight-submit" "Log weight" (disabled mientras vuela)
  └── [R7] lista: weight-row-<id> (orden recibido, desc):
        `${weightKg} kg` · measuredAt · fmtVariation(variation) · `BC ${bodyCondition}/9` si != null
        | weight-log-empty | weight-log-error + weight-log-retry | weight-log-loading
  ```

  Submit (R9, mismo patrón switch-por-kind que `login.tsx`):
  `parseFloat(weightText)` NaN → error local sin llamar; si no,
  `createWeight(baseUrl, token ?? '', selectedPetId, { weightKg, measuredAt,
  ...(bcText.trim() ? { bodyCondition: Number(bcText) } : {}) })`. En `ok`:
  reset de campos (fecha → hoy), `weights.refetch()`. El resto de kinds →
  mensajes de R9. `selectedPetId === null` → `<Redirect href="/health" />`
  (import de expo-router) antes de montar nada.

- **D8 — `src/components/weight-chart.tsx`** (nuevo, ~40 líneas):

  ```tsx
  import Svg, { Polyline } from 'react-native-svg';
  import type { WeightEntry } from '../api/types';

  export function WeightChart({ entries }: { entries: WeightEntry[] });
  ```

  - `entries.length < 2` → `<Text testID="weight-chart-empty">Not enough
    data yet</Text>` (className `text-muted`), sin SVG.
  - Si no: `const asc = [...entries].reverse()` (la API entrega desc);
    `min`/`max` de `weightKg`; `range = max - min`;
    puntos: `x = (i / (asc.length - 1)) * 100`,
    `y = range === 0 ? 20 : 36 - ((w - min) / range) * 32`
    (viewBox `0 0 100 40`, margen vertical 4; pesos iguales → línea
    centrada, sin división por cero).
  - Render: `<Svg testID="weight-chart" viewBox="0 0 100 40"
    preserveAspectRatio="none" style={{ width: '100%', height: 120 }}>`
    con `<Polyline points={points} fill="none" strokeWidth={2}
    stroke={accent} />`; `accent` de `useThemeColor(['accent'])` de
    heroui-native (mismo precedente que `floating-tab-bar.tsx` — los
    colores de props SVG no aceptan className).
  - Sin ejes/labels/puntos: v1 es una sparkline de tendencia.

- **D9 — Reubicación del health-check + theme toggle a Profile** (R10).
  `profile.tsx` (hoy: título + sign-out) gana una sección `App` con el
  contenido actual de `health.tsx`: chip por kind (mismas
  `stateClassNames`), botón de recheck y toggle Uniwind — usando
  `fetchHealth` de `src/api/health.ts` **sin cambios** (sigue sin auth:
  `/health` es público). Razonamiento (punto del gate): eliminarlo
  perdería el único control de tema de la app y una herramienta usada en
  cada smoke; una pantalla settings nueva sería una ruta para dos
  controles. **Rename de testIDs históricos**: `health-state` →
  `backend-health-state`, `health-retry` → `backend-health-retry` — el
  prefijo `health-*` pasa a pertenecer al hub (R4 usa `health-loading`/
  `health-error`/`health-retry` en simetría con `home-*`/`map-*`);
  `theme-toggle` no cambia. `health.test.tsx` se reescribe para el hub;
  sus casos actuales se trasladan a `profile.test.tsx` (excepción C4 de
  [[requirements]]).

- **D10 — Patrón de tests** (jest-expo + RTL, wrapper
  `HeroUINativeProvider`, `describe('R<n>: ...')`):
  - `src/api/__tests__/health-records.test.ts` (R1–R3): sin render;
    `fetchFn` stub por caso devolviendo
    `{ status, json: async () => body } as unknown as Response`; asserts de
    URL (con/sin `?limit=`), method, headers y body en
    `fetchFn.mock.calls`. Fixtures `makeVaccine(overrides)` /
    `makeWeight(overrides)` locales.
  - `src/app/(tabs)/__tests__/health.test.tsx` (R4–R6, reescrito):
    `jest.mock` de `../../../api/pets`, `../../../api/health-records`,
    `../../../providers/auth-provider` (token fijo) y `expo-router`
    (`{ router: { push: jest.fn(), back: jest.fn() } }`);
    `SelectedPetProvider` real como wrapper, `useApi` real.
  - `src/app/(tabs)/__tests__/weight-log.test.tsx` (R7, R9): mismos mocks;
    para tener `selectedPetId` no-null con el provider real, el wrapper
    monta un componente sonda que llama `selectPet('pet-1')` en un
    `useEffect` antes de renderizar la pantalla (o se renderiza Health
    primero — más simple: sonda). El caso `selectedPetId === null` asserta
    el `Redirect` mockeando `expo-router` (`Redirect` stub que registra
    `href`).
  - `src/components/__tests__/weight-chart.test.tsx` (R8): mock de
    `react-native-svg` con stubs que propagan props (mismo patrón que el
    mock de react-native-maps de #36 D9):

    ```tsx
    jest.mock('react-native-svg', () => {
      const React = require('react');
      const { View } = require('react-native');
      const stub = (props: Record<string, unknown>) =>
        React.createElement(View, props, props.children);
      return { __esModule: true, default: stub, Svg: stub, Polyline: stub };
    });
    ```

    Asserts sobre `getByTestId('weight-chart')` y el prop `points` del
    Polyline (vía `UNSAFE_getByProps` o testID propio en el stub): número
    de pares, x creciente, y constante con pesos iguales.
  - `src/app/(tabs)/__tests__/profile.test.tsx` (R10, excepción C4): casos
    trasladados de la suite vieja de health (estados por kind con
    `fetchHealth` mockeado, recheck, toggle con spy de `Uniwind.setTheme`)
    adaptando componente (`ProfileScreen`), mock de auth-provider y los
    testIDs `backend-health-*`; + assert de `profile-sign-out` presente.
  - `screens.test.tsx` NO se toca (Profile conserva título y sign-out).

## Archivos afectados

Todos en la isla móvil salvo `feature_list.json`:

- `mobile-pet-tracker/src/api/types.ts` — + `Vaccine`, `WeightEntry` (D2)
- `mobile-pet-tracker/src/api/http.ts` — + `postJson` (D4; R3)
- `mobile-pet-tracker/src/api/health-records.ts` — nuevo (D4; R1–R3)
- `mobile-pet-tracker/src/api/__tests__/health-records.test.ts` — nuevo
- `mobile-pet-tracker/src/app/(tabs)/health.tsx` — reescrito: hub (D5, D6; R4–R6)
- `mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx` — reescrito (R4–R6)
- `mobile-pet-tracker/src/app/(tabs)/weight-log.tsx` — nuevo (D7; R7, R9)
- `mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx` — nuevo
- `mobile-pet-tracker/src/components/weight-chart.tsx` — nuevo (D8; R8)
- `mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx` — nuevo
- `mobile-pet-tracker/src/app/(tabs)/profile.tsx` — + sección App (D9; R10)
- `mobile-pet-tracker/src/app/(tabs)/__tests__/profile.test.tsx` — nuevo
  (casos trasladados, excepción C4)
- `feature_list.json` — #37 según flujo

NO se tocan: `src/app/(tabs)/_layout.tsx` (la ruta weight-log se registra
por archivo), `src/components/floating-tab-bar.tsx`, `src/api/health.ts`,
`src/hooks/use-api.ts`, `package.json` (cero deps). Prohibido:
`backend-pet-tracker/`, `infra/`, `init.config.sh`,
`.github/workflows/ci.yml` (R12).

## Alternativas descartadas

- **@gorhom/bottom-sheet para el alta de peso**: ya instalado, pero una
  pantalla dedicada da lo mismo con cero mocking de gestos; un sheet solo
  pagaría si el alta se lanzara desde varios sitios sobre el contenido.
- **Eliminar el health-check del backend**: se llevaría por delante el
  único toggle de tema y una herramienta usada en cada smoke; mudarlo a
  Profile cuesta una sección.
- **Pantalla settings nueva para el health-check**: una ruta entera para
  dos controles; Profile ya es el cajón natural de "cuenta y app".
- **Librería de charts (victory-native, react-native-gifted-charts)**: dep
  nueva + peer deps para una sparkline; la polyline de D8 son ~30 líneas.
- **X proporcional a fechas en la gráfica**: con pocos puntos irregulares
  produce huecos gigantes y exige escala temporal; equiespaciado lee mejor
  la tendencia v1 (documentado como simplificación consciente).
- **`getPet` para el `nextVaccine` del backend**: fetch extra por un dato
  derivable en 3 líneas de la lista ya cargada (D6).
- **Cliente del catálogo de vacunas**: solo sirve al alta, que está fuera
  de alcance — se creará con la feature de alta de vacunas.
- **Extraer ya el hook de selección por defecto**: reabriría home/map y
  sus suites dentro de una feature de salud; follow-up dedicado (D5).
- **react-query**: `createWeight` invalida solo la lista de su propia
  pantalla (`refetch()` local) — no cruza el umbral de #36 D2 (mutación con
  invalidación compartida entre pantallas).
- **Date picker nativo**: `@react-native-community/datetimepicker` no está
  instalado; un input `YYYY-MM-DD` con el 400 del backend como red de
  seguridad cubre v1 sin dep nueva.
