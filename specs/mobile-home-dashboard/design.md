---
feature: "mobile-home-dashboard"
status: draft     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-home-dashboard]]

> Ver [[requirements]] para los requisitos. Autosuficiente para Codex CLI:
> rutas, símbolos y contratos exactos. Aplican las convenciones móviles de
> `docs/conventions.md` (solo `className`/tokens — cero StyleSheet/hex —,
> HeroUI Native, reicon, tests que nombran R-ids, bun).

## Contratos verificados (2026-08-21, contra el código del backend)

Todos con `Authorization: Bearer <token>` (JwtAuthGuard global registrado
en `auth.module.ts` vía APP_GUARD; 401 con token ausente/inválido).

- **GET `/v1/pets`** (`pets.controller.ts::list`) — 200 →
  `PetProfileResponse[]`. OJO: el mapper
  (`pet-profile-response.mapper.ts::toPetProfileResponse`) se invoca en la
  lista SOLO con `(pet, role, now)`, así que `device`, `photoUrl` y
  `nextVaccine` son **siempre `null` en la lista**. La lista sirve para el
  selector (id, name, myRole); los datos ricos salen del detail.
- **GET `/v1/pets/:petId`** (`pets.controller.ts::detail`) — 200 →
  `PetProfileResponse` con `device` (shape `DeviceStatusResponse`),
  `photoUrl` (URL prefirmada S3 o null) y `nextVaccine` rellenos. 404
  genérico del `PetAccessGuard` si no hay membresía. Contrato congelado
  (comentario R8 del mapper): exactamente estas claves —
  `id, name, species, breed, sex, birthDate, approxAgeMonths, ageMonths,
  currentWeightKg, size, color, sterilized, microchip, photoUrl, lostMode,
  lastPosition, lastCommunicationAt, myRole, device, nextVaccine,
  nextReminder, activitySummary, createdAt, updatedAt`.
- **`DeviceStatusResponse`** (`device-status.mapper.ts`):
  `{ model, batteryPct, connectivity, lastMessageAt, esn }` — todos
  nullable; `lastMessageAt` ISO string. El pipeline de ingesta solo escribe
  `connectivity: 'online'` (`workers/ingestion.drizzle.store.ts:97`); no
  existe valor `'offline'` hoy → derivación `=== 'online'`.
- **GET `/v1/pets/:petId/device`** existe pero NO se usa: devolvería el
  mismo `DeviceStatusResponse` que ya viene embebido en el detail
  (`pet-device.controller.ts` usa el mismo mapper). Un endpoint menos.
- **GET `/v1/pets/:petId/activity/daily`** (`activity.controller.ts`) —
  guards `PetAccessGuard` + `PetTrackingGuard`:
  - **402** `{ statusCode: 402, code: 'DEVICE_SUBSCRIPTION_REQUIRED',
    message }` si la mascota no tiene subscripción activa de collar → es el
    estado "free", no un error.
  - 200 → `{ days: DayEntry[], weekComparison }`. Sin query params: `to` =
    hoy en la timezone del owner, `from` = 6 días antes (7 entradas, sin
    huecos). `DayEntry` (`daily-activity.entity.ts`): `{ date, distanceM,
    activeMinutes, restMinutes, walkCount, avgWalkMinutes, firstWalkAt,
    lastWalkAt, timeAwayMinutes, source }` — métricas `number | null`
    (`null` = día `missing`, sin datos; `0` = reposo confirmado — NUNCA
    pintar null como 0), `source: 'stored' | 'computed' | 'missing'`.
    `weekComparison`: `{ distanceM, activeMinutes, walkCount }` en % o
    null — **no se pinta en v1** (fuera de alcance).
  - La última entrada de `days` es siempre el día en curso (`computed` al
    vuelo por el backend) → "Today" = `days[days.length - 1]`, sin cálculo
    de fechas ni timezone en el cliente.

## Decisiones técnicas

- **D1 — Cero dependencias nuevas.** `expo-image`, HeroUI Native 1.0.8,
  reicon-react-native, expo-router y jest-expo/RTL ya cubren todo.

- **D2 — Dos niveles de fetch, sin `src/api/devices.ts`.**
  `files_affected` de feature_list sugería `devices.ts`, pero el detail ya
  embebe el device con el shape canónico (§Contratos): crear un cliente
  para `GET .../device` sería una llamada de red y un archivo redundantes.
  Home = `listPets` (selector) + `getPet(selectedPetId)` (card + collar +
  posición) + `getDailyActivity(selectedPetId)` (summary).

- **D3 — Tipos a mano en `src/api/types.ts`** (se amplía el existente;
  decisión D11 de [[requirements]] a ratificar):

  ```ts
  export interface DeviceStatus {
    model: string | null;
    batteryPct: number | null;
    connectivity: string | null;
    lastMessageAt: string | null;
    esn: string | null;
  }

  export interface PetProfile {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    sex: string | null;
    birthDate: string | null;
    approxAgeMonths: number | null;
    ageMonths: number;
    currentWeightKg: number | null;
    size: string | null;
    color: string | null;
    sterilized: boolean | null;
    microchip: string | null;
    photoUrl: string | null;
    lostMode: boolean;
    lastPosition: unknown;
    lastCommunicationAt: string | null;
    myRole: 'owner' | 'caregiver' | 'viewer';
    device: DeviceStatus | null;
    nextVaccine: unknown;
    nextReminder: unknown;
    activitySummary: unknown;
    createdAt: string;
    updatedAt: string;
  }

  export interface DayEntry {
    date: string;
    distanceM: number | null;
    activeMinutes: number | null;
    restMinutes: number | null;
    walkCount: number | null;
    avgWalkMinutes: number | null;
    firstWalkAt: string | null;
    lastWalkAt: string | null;
    timeAwayMinutes: number | null;
    source: 'stored' | 'computed' | 'missing';
  }

  export interface WeekComparison {
    distanceM: number | null;
    activeMinutes: number | null;
    walkCount: number | null;
  }
  ```

  Espejo 1:1 de los mappers del backend. Los campos que el Home no lee
  (`nextVaccine`, `nextReminder`, `activitySummary`, `lastPosition`) van
  como `unknown` — presentes para no romper el espejo, sin inventar shapes
  que #37 definirá. Enums de species/sex/size como `string`: el Home solo
  los muestra, no los discrimina.

- **D4 — Helper compartido `src/api/http.ts`** (nuevo): el `try/catch` +
  `Authorization` se repetiría en 3 funciones GET — se extrae una vez
  (mismo rol que `postJson` privado de auth.ts):

  ```ts
  export type GetResult =
    | { kind: 'response'; response: Response }
    | { kind: 'unreachable'; message: string };

  export function apiUrl(baseUrl: string, path: string): string; // saneo de '/' final, igual que auth.ts

  export async function getJson(
    baseUrl: string,
    path: string,
    token: string,
    fetchFn: typeof fetch,
  ): Promise<GetResult>;
  // fetchFn(apiUrl(baseUrl, path), { headers: { Authorization: `Bearer ${token}` } })
  // catch → { kind: 'unreachable', message }
  ```

  Cero imports de storage/React (regla de #33, la verifica el reviewer con
  grep). Opcional en el refactor: auth.ts reutiliza este `apiUrl` — sin
  tocar sus asserts.

- **D5 — `src/api/pets.ts`** (nuevo). Firmas exactas:

  ```ts
  import type { PetProfile } from './types';

  export type PetsState =
    | { kind: 'ok'; pets: PetProfile[] }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export type PetState =
    | { kind: 'ok'; pet: PetProfile }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export async function listPets(
    baseUrl: string | undefined,
    token: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<PetsState>;

  export async function getPet(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<PetState>;
  ```

  Mapeo: 200 + array/objeto válido → `ok`; 401 → `unauthorized`; resto
  (404 incluido — mascota borrada entre lista y detail es rarísimo y el
  error genérico con Retry basta) → `error`. Validación de shape mínima
  (como `isUserResponse` de auth.ts): `Array.isArray` para la lista,
  `id`/`name` strings para el detail — no validar las 24 claves.

- **D6 — `src/api/activity.ts`** (nuevo):

  ```ts
  import type { DayEntry, WeekComparison } from './types';

  export type DailyActivityState =
    | { kind: 'ok'; days: DayEntry[]; weekComparison: WeekComparison }
    | { kind: 'no-tracking' }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export async function getDailyActivity(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<DailyActivityState>;
  ```

  402 → `no-tracking` (sin inspeccionar `code`: el guard es la única
  fuente de 402 en esa ruta). 200 con `days` no-array → `error`.

- **D7 — `src/hooks/use-api.ts`** (nuevo; nace la carpeta `src/hooks/`).
  Contrato:

  ```ts
  export interface ApiResult<T> {
    data: T | undefined; // undefined = cargando
    refetch: () => void;
  }

  export function useApi<T extends { kind: string }>(
    fn: (() => Promise<T>) | null,
  ): ApiResult<T>;
  ```

  Comportamiento: `useEffect` sobre `[fn, tick]` — ejecuta `fn()`, guarda
  el resultado si la ejecución sigue vigente (flag de cleanup, mismo patrón
  anti-carrera que `AuthProvider`); `refetch` incrementa un contador
  `tick` con `useState` y resetea `data` a `undefined`. `fn === null` →
  no ejecuta y `data` queda `undefined` (permite "aún no hay pet
  seleccionado"). Si `result.kind === 'unauthorized'` → `void signOut()`
  de `useAuth()` (único acoplamiento; es exactamente la deuda 401 global).
  **≤30 líneas de lógica** — si crece, está mal. El caller memoiza `fn`
  con `useCallback([...deps])`. SIN react-query (reevaluación en #36) y
  SIN cache: cambiar de mascota refetchea — correcto para v1.

- **D8 — `src/providers/selected-pet-provider.tsx`** (nuevo). Context
  mínimo, espejo estructural de `auth-provider.tsx`:

  ```tsx
  export interface SelectedPetContextValue {
    selectedPetId: string | null;
    selectPet: (id: string) => void;
  }

  export function SelectedPetProvider({ children }: { children: ReactNode });
  export function useSelectedPet(): SelectedPetContextValue; // lanza sin provider
  ```

  Estado: un `useState<string | null>(null)` — nada más (sin storage, sin
  lista de pets en el context: la lista vive en el estado del Home). Se
  monta en `src/app/(tabs)/_layout.tsx`:
  `<SelectedPetProvider><Tabs ...>...</Tabs></SelectedPetProvider>` (los
  guards R1/R2 de #34 quedan idénticos, solo se envuelve el return
  autenticado).

- **D9 — Pantalla Home** (`src/app/(tabs)/home.tsx`, reemplaza el
  placeholder). Estructura (todo con `className` + tokens; posicionamiento
  absoluto NO se usa — lección uniwind de #34; el hueco para la tab bar
  flotante va como padding inferior inline):

  ```
  ScrollView testID="screen-home"
    className="flex-1 bg-background"
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: insets.bottom + 96 }}
    (insets de useSafeAreaInsets; 96 ≈ alto de la FloatingTabBar + margen)
  ├── Text "Home" className="text-2xl font-semibold text-foreground"
  ├── [R6] estados: home-loading (Spinner) | home-error + home-retry (Button) | home-empty
  ├── [R6] selector: ScrollView horizontal con Chip/Pressable por pet
  │        testID="pet-chip-<id>"; seleccionada: bg-accent + accessibilityState
  ├── [R7] Card testID="pet-card"
  │        Image (expo-image) testID="pet-card-photo" 72x72 rounded-full
  │          (photoUrl null → View con inicial del nombre, bg-surface)
  │        Text testID="pet-card-name" | Text testID="pet-card-breed" (breed ?? '—')
  ├── [R8] Card testID="collar-card"
  │        icono Wifi/WifiOff (online/offline) o Moon (Free)
  │        Text testID="collar-status" ('Online' | 'Offline' | 'Free')
  │        device: fila Battery + Text testID="collar-battery" (`${pct}%` | '—')
  │        sin device: Text 'No collar — health only' className="text-muted"
  ├── [R9] Card testID="summary-card" — título "Today's Summary"
  │        3 métricas en fila (iconos Walk / Moon / Map):
  │          summary-activity  = fmtMinutes(activeMinutes)
  │          summary-sleep     = fmtMinutes(restMinutes)
  │          summary-distance  = fmtKm(distanceM)
  │        o summary-note (402/error) o summary-skeleton (cargando)
  └── [R10] Pressable testID="last-position-card" (solo con device)
           Text 'View on map' + icono ChevronRight
           Text testID="last-position-time"
           onPress: router.push('/map')
  ```

  Helpers locales del archivo (no hay carpeta utils — no la crees):
  - `fmtMinutes(m: number | null)`: `null` → `'—'`; `< 60` → `` `${m}m` ``;
    resto → `` `${Math.floor(m / 60)}h ${m % 60}m` ``.
  - `fmtKm(m: number | null)`: `null` → `'—'`; resto →
    `` `${(m / 1000).toFixed(1)} km` ``.
  - `fmtLastSeen(iso: string | null)`: `null` → `'No location data yet'`;
    resto → `` `Last seen ${new Date(iso).toLocaleString()}` ``.

  Wiring de datos (con `token` de `useAuth()` y
  `process.env.EXPO_PUBLIC_API_URL`):

  ```tsx
  const petsFn = useCallback(() => listPets(baseUrl, token ?? ''), [baseUrl, token]);
  const pets = useApi(petsFn);
  const detailFn = useMemo(
    () => (selectedPetId ? () => getPet(baseUrl, token ?? '', selectedPetId) : null),
    [baseUrl, token, selectedPetId],
  );
  const detail = useApi(detailFn);
  const activityFn = ... // idem con getDailyActivity
  const activity = useApi(activityFn);
  ```

  Selección por defecto (R6): `useEffect` — si `pets.data?.kind === 'ok'`,
  hay elementos y (`selectedPetId === null` o no está en la lista) →
  `selectPet(pets.data.pets[0].id)`.

  "Today" = `days[days.length - 1]` (garantizado por el backend, §Contratos).

- **D10 — Patrón de tests** (jest-expo + RTL, convenciones existentes,
  wrapper `HeroUINativeProvider`, `describe('R<n>: ...')`):
  - `src/api/__tests__/pets.test.ts` (R1, R2) y `activity.test.ts` (R3):
    sin render; `fetchFn` stub por caso devolviendo
    `{ status, json: async () => body }` as unknown as Response; asserts
    también de URL y header `Authorization: Bearer <token>` en
    `fetchFn.mock.calls`.
  - `src/hooks/__tests__/use-api.test.tsx` (R4): `renderHook`/componente
    sonda; `fn` stub con promesas controladas (resolver fuera de orden
    para el guard de carrera); mock de `../../providers/auth-provider`
    con `signOut: jest.fn()`.
  - `src/providers/__tests__/selected-pet-provider.test.tsx` (R5):
    componente sonda que pinta `selectedPetId` y botón que llama
    `selectPet`; assert de throw sin provider
    (`expect(() => render(...)).toThrow()`).
  - `src/app/(tabs)/__tests__/home.test.tsx` (R6–R10): `jest.mock` de
    `../../../api/pets`, `../../../api/activity`,
    `../../../providers/auth-provider` (token fijo) y `expo-router`
    (`{ router: { push: jest.fn() } }`); `SelectedPetProvider` **real**
    como wrapper (es la integración que importa). `useApi` real (es puro
    React). Fixtures: `makePet(overrides)` local con las 24 claves.
  - `src/app/(tabs)/__tests__/layout.test.tsx` (R5, montaje): se añade un
    caso — mock de `../../../providers/selected-pet-provider` cuyo
    `SelectedPetProvider` registra el render y pinta children; assert de
    que con sesión autenticada el provider envuelve el árbol. Los asserts
    de R1 de #34 no se tocan.
  - `src/app/(tabs)/__tests__/screens.test.tsx`: SOLO se elimina el caso
    `home` de `describe('R5: placeholders de tabs')` (excepción C4,
    reviewer verifica diff limitado).

- **D11 — Codegen OpenAPI**: ver [[requirements]] §Decisiones pendientes.
  Default implementado por esta spec: tipos a mano (§D3).

## Archivos afectados

Todos en la isla móvil salvo `feature_list.json`:

- `mobile-pet-tracker/src/api/types.ts` — tipos D3 (se amplía)
- `mobile-pet-tracker/src/api/http.ts` — nuevo (D4)
- `mobile-pet-tracker/src/api/pets.ts` — nuevo (D5; R1, R2)
- `mobile-pet-tracker/src/api/activity.ts` — nuevo (D6; R3)
- `mobile-pet-tracker/src/api/__tests__/pets.test.ts` — nuevo
- `mobile-pet-tracker/src/api/__tests__/activity.test.ts` — nuevo
- `mobile-pet-tracker/src/hooks/use-api.ts` — nuevo (D7; R4)
- `mobile-pet-tracker/src/hooks/__tests__/use-api.test.tsx` — nuevo
- `mobile-pet-tracker/src/providers/selected-pet-provider.tsx` — nuevo (D8; R5)
- `mobile-pet-tracker/src/providers/__tests__/selected-pet-provider.test.tsx` — nuevo
- `mobile-pet-tracker/src/app/(tabs)/_layout.tsx` — envuelve Tabs con el provider (R5)
- `mobile-pet-tracker/src/app/(tabs)/home.tsx` — reescrito (D9; R6–R10)
- `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx` — nuevo
- `mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx` — +1 caso (R5)
- `mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx` — quita el caso home (excepción C4)
- `feature_list.json` — #35 según flujo

Prohibido tocar: `backend-pet-tracker/`, `infra/`, `init.config.sh`,
`.github/workflows/ci.yml` (R12).

## Alternativas descartadas

- **`src/api/devices.ts` + GET `/pets/:petId/device`**: redundante — el
  detail del pet embebe el mismo `DeviceStatusResponse` (mismo mapper del
  backend). Una llamada y un archivo menos.
- **react-query**: 3 GETs sin mutaciones ni cache compartida no lo
  justifican; `useApi` de ≤30 líneas cubre v1. Reevaluación explícita en
  #36 (mapa con polling de posiciones, donde cache/refetch sí pesan).
- **Pets en el `SelectedPetProvider`** (context con lista + fetch): el
  único consumidor de la lista hoy es el Home; el context guarda solo el
  id (lo que #36 necesita para el mapa). Si un segundo tab necesita la
  lista, se sube entonces.
- **`Select` de HeroUI como selector**: un dropdown esconde las mascotas
  tras un tap; chips horizontales muestran todas y son triviales de testear
  por testID. El diseño Figma-style de dashboard usa avatares/chips en fila.
- **Query `?from=<hoy>&to=<hoy>` en activity**: obligaría al cliente a
  calcular "hoy" en la timezone del owner (que no conoce). Sin params, el
  backend resuelve la timezone y la última entrada de `days` es hoy.
- **Umbral de staleness para Online/Offline** (p.ej. `lastMessageAt` > 10
  min → Offline): inventa una regla de producto que el backend no define;
  cuando el pipeline escriba estados reales de conectividad, la derivación
  cambia en un solo sitio (R8).
- **Validar el shape completo de `PetProfile` en runtime** (24 claves):
  guard mínimo (`id`/`name`) basta — el contrato está congelado por R8 de
  pets-crud y el resto de claves las cubre el tipo.
