---
feature: "mobile-map-live"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-map-live]]

> Ver [[requirements]] para los requisitos. Autosuficiente para Codex CLI:
> rutas, símbolos y contratos exactos. Aplican las convenciones móviles de
> `docs/conventions.md` (`className` + tokens — cero StyleSheet/hex —,
> HeroUI Native, reicon, tests que nombran R-ids, bun) y la lección #34:
> posicionamiento absoluto/offsets por `style` inline.

## Contratos verificados (2026-08-21, contra el código del backend)

Todos con `Authorization: Bearer <token>`; todos detrás de
`PetAccessGuard` (404 genérico si no hay membresía) + `PetTrackingGuard`
(**402** `{ statusCode: 402, code: 'DEVICE_SUBSCRIPTION_REQUIRED', message }`
si la mascota no tiene subscripción activa de collar → estado "free").

- **GET `/v1/pets/:petId/positions/last`**
  (`positions.controller.ts::last`) — 200 → `LastPositionView | null`
  (body JSON `null` literal cuando no hay posición; es estado, no error).
  `LastPositionView` (`cached-position.dto.ts`): exactamente 6 claves —
  `{ lat: number, lng: number, ts: number (epoch ms), accuracy: number|null,
  battery: number|null, staleSeconds: number }`. `staleSeconds` lo calcula
  el servidor (`stale-seconds.ts`: `max(0, floor((now - ts)/1000))`) — el
  cliente NO calcula antigüedad con su propio reloj. Lee solo la cache
  `pets.last_position` ("rápido, sin DynamoDB") → ideal para polling.
- **GET `/v1/pets/:petId/positions`** (`positions.controller.ts::list`) —
  query `from`/`to`/`cursor`/`includeSuspect` opcionales y **estrictos**
  (`z.strictObject`: un param desconocido es 400). Sin params: ventana
  default 60 min terminando en ahora (`DEFAULT_RANGE_MINUTES = 60`), página
  de 1000 (`POSITIONS_PAGE_LIMIT`), orden ascendente por ts
  (`ScanIndexForward: true` en `position-history.dynamo.reader.ts:49`).
  200 → `{ items: StoredPosition[], nextCursor: string|null }`.
  `StoredPosition` (`position-response.mapper.ts`): `{ ts, lat, lng,
  speedKmh, course, altitude, sats, accuracyM, batteryPct, flags }` —
  `ts/lat/lng: number`, resto `number|null`, `flags: string[]`.
- **GET `/v1/pets/:petId/trips`** (`trips.controller.ts::list`) — query
  estricta `{ date?: 'YYYY-MM-DD' }`; sin `date` ⇒ hoy en la timezone del
  **owner** (mismo precedente que activity/daily: cero cálculo de timezone
  en el cliente). 200 → `{ date: string, items: TripSummary[] }`.
  `TripSummary` (`daily-activity.entity.ts`): `{ index, startTs, endTs,
  distanceM, durationMin, pointCount }` — la lista **no** lleva `path`.
- **GET `/v1/pets/:petId/trips/:n`** (`trips.controller.ts::one`) — 200 →
  `{ date: string, trip: TripDetail }`; `TripDetail = TripSummary &
  { path: Array<{ lat, lng, ts }> }`. `:n` = `index` de la lista; 404 con
  `code: 'TRIP_NOT_FOUND'` si el índice ya no existe (se mapea a `error`).
- **Lost Mode — NO existe endpoint** (R10): `lostMode` solo es columna
  `pets.lost_mode` (`pets.schema.ts:42`) + campo de lectura del
  `PetProfileResponse` (`pet-profile-response.mapper.ts:76`); no está en
  `PetFieldsSchema` (create/update-pet.dto), y los únicos writes de
  devices/alerts son `POST /devices/claim` y `POST /alerts/:id/ack`.

## Decisiones técnicas

- **D1 — Mapa: `react-native-maps` 1.27.2 (corre en Expo Go). expo-maps
  descartado.** Restricción dura: smoke solo con Expo Go. Evidencia
  (2026-08-21, docs SDK 57):
  - expo-maps (https://docs.expo.dev/versions/v57.0.0/sdk/maps/): *"not
    available in the Expo Go app – use development builds to try it out"* y
    *"currently in alpha and will frequently experience breaking changes"*
    → incompatible con la restricción, descartado.
  - react-native-maps (https://docs.expo.dev/versions/v57.0.0/sdk/map-view/):
    *"No additional setup is required when testing your project using Expo
    Go"*; los pasos de API key de Google aplican solo *"to deploy the app
    binary on app stores"* (dev/production builds) → en Expo Go Android el
    proveedor es Google Maps con la API key de Expo Go, **sin key propia**.
  - Versión pinneada por SDK 57: `react-native-maps 1.27.2`
    (`node_modules/expo/bundledNativeModules.json`) → instalar con
    `bunx expo install react-native-maps` (respeta el pin).
  - La nota de feature_list ("ambos requieren el dev build de #32") era
    incorrecta para react-native-maps; queda corregida aquí con evidencia.
  - Alternativa WebView (mapa Leaflet embebido): innecesaria — solo se
    consideraría si ninguna opción nativa corriera en Go, y react-native-maps
    corre. Descartada sin implementar.

- **D2 — SIN react-query (reevaluación exigida por #35).** Lo que el mapa
  necesita: (a) polling periódico de 2 GETs con el tab enfocado, (b) no
  parpadear al refetchear, (c) parar al perder foco. `useApi` ya da (b)
  (stale-while-revalidate desde #35) y (a)+(c) son un `setInterval` +
  `refetch()` dentro de `useFocusEffect` — ~8 líneas en la pantalla. Lo que
  react-query aportaría de más (caché compartida entre pantallas,
  mutaciones, invalidación) no se usa: Home no pollea, no hay mutaciones
  (Lost Mode es stub) y cambiar de tab refetchea barato. Una dep nueva +
  provider global + reescritura del patrón de datos de 3 features no se
  justifica. **Umbral de adopción explícito para el futuro**: primera
  feature con mutaciones con invalidación (Lost Mode real #45, edición de
  perfil) o segunda pantalla que necesite la MISMA caché polleada.

- **D3 — Tipos a mano en `src/api/types.ts`** (se amplía; espejo 1:1 de los
  contratos de arriba — D11 de #35 sigue: el backend aún no publica OpenAPI):

  ```ts
  export interface LastPosition {
    lat: number;
    lng: number;
    ts: number;
    accuracy: number | null;
    battery: number | null;
    staleSeconds: number;
  }

  export interface StoredPosition {
    ts: number;
    lat: number;
    lng: number;
    speedKmh: number | null;
    course: number | null;
    altitude: number | null;
    sats: number | null;
    accuracyM: number | null;
    batteryPct: number | null;
    flags: string[];
  }

  export interface TripPoint {
    lat: number;
    lng: number;
    ts: number;
  }

  export interface TripSummary {
    index: number;
    startTs: number;
    endTs: number;
    distanceM: number;
    durationMin: number;
    pointCount: number;
  }

  export interface TripDetail extends TripSummary {
    path: TripPoint[];
  }
  ```

- **D4 — `src/api/positions.ts`** (nuevo). Reutiliza `getJson`/`readJson`
  de `http.ts`. Firmas exactas:

  ```ts
  import type { LastPosition, StoredPosition } from './types';

  export type LastPositionState =
    | { kind: 'ok'; position: LastPosition | null }
    | { kind: 'no-tracking' }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export type PositionsState =
    | { kind: 'ok'; items: StoredPosition[]; nextCursor: string | null }
    | { kind: 'no-tracking' }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export async function getLastPosition(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<LastPositionState>;

  export async function listPositions(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<PositionsState>;
  ```

  Mapeo (mismo esqueleto que `getDailyActivity`): 402 → `no-tracking` (sin
  inspeccionar `code`); 401 → `unauthorized`; 200 → validación mínima
  (`getLastPosition`: body `null` O objeto con `lat`/`lng` numéricos —
  cualquier otra cosa `error`; `listPositions`: `Array.isArray(body.items)`);
  resto → `error`.

- **D5 — `src/api/trips.ts`** (nuevo). Un solo símbolo público — la
  composición lista+detalles vive en el cliente para que la pantalla use un
  único `useApi` (una promesa = un estado, sin orquestar N fetches en React):

  ```ts
  import type { TripDetail } from './types';

  export type DayRouteState =
    | { kind: 'ok'; date: string; trips: TripDetail[] }
    | { kind: 'no-tracking' }
    | { kind: 'unauthorized' }
    | { kind: 'error' }
    | { kind: 'unreachable'; message: string }
    | { kind: 'missing-config' };

  export async function getDayRoute(
    baseUrl: string | undefined,
    token: string,
    petId: string,
    fetchFn: typeof fetch = fetch,
  ): Promise<DayRouteState>;
  ```

  Flujo: `GET /pets/${petId}/trips` → si no es 200/402/401, `error`; si
  `items` vacío, `ok` sin más llamadas; si no,
  `Promise.all(items.map(i => getJson(.../trips/${i.index})))` y se extrae
  `body.trip` de cada una (validación mínima: `Array.isArray(trip.path)`).
  Cualquier sub-respuesta no-200 → `error`; cualquier `unreachable` →
  `unreachable`. N es pequeño (paseos de un día, típicamente 0–5) — el
  N+1 es aceptable y es el único camino al `path` (la lista no lo lleva
  por contrato R18 del backend).

- **D6 — Pantalla Map** (`src/app/(tabs)/map.tsx`, reemplaza el
  placeholder). Constantes locales del archivo: `POLL_MS = 15000`,
  `STALE_SECONDS = 120`, `DEFAULT_REGION = { latitude: 19.4326, longitude:
  -99.1332, latitudeDelta: 0.01, longitudeDelta: 0.01 }` (home del
  simulador, `docs/conventions.md` §SIM_HOME). Estructura:

  ```
  View testID="screen-map" className="flex-1 bg-background"
  ├── [R4] map-loading (Spinner) | map-no-pets | map-error + map-retry
  ├── [R5] map-no-tracking (mascota free; sin MapView ni polling)
  └── (con tracking)
      ├── MapView testID="map-view" key={selectedPetId} style={{ flex: 1 }}
      │     initialRegion = posición ?? DEFAULT_REGION (deltas 0.01)
      │     — se monta SOLO cuando la primera carga de last resolvió, para
      │       que initialRegion ya tenga la posición real; key re-monta y
      │       re-centra al cambiar de mascota
      │   ├── [R6] Marker testID="map-marker" (solo con position)
      │   └── [R7] Polyline testID="map-route-<index>" por trip
      │         coordinates={trip.path.map(p => ({ latitude: p.lat, longitude: p.lng }))}
      ├── [R6] overlay map-empty ('No location data yet', solo position null)
      └── overlay inferior (style inline: position 'absolute', left 16,
          right 16, bottom insets.bottom + 96 — lección #34; insets de
          useSafeAreaInsets)
          ├── [R8] Card con 4 stats: stat-speed | stat-distance |
          │        stat-updated | stat-gps
          └── [R10] Button 'Activate Lost Mode' testID="lost-mode-button"
                   isDisabled + accessibilityState={{ disabled: true }}
                   subtexto 'Coming soon'
  ```

  Helpers locales del archivo (sin carpeta utils):
  - `fmtSpeed(kmh: number | null | undefined)`: nullish → `'—'`; resto →
    `` `${kmh.toFixed(1)} km/h` ``.
  - `fmtKm(m: number | null)`: como Home — `null` → `'—'`; resto →
    `` `${(m / 1000).toFixed(1)} km` ``.
  - `fmtAgo(s: number)`: `< 60` → `'Just now'`; `< 3600` →
    `` `${Math.floor(s / 60)}m ago` ``; resto → `` `${Math.floor(s / 3600)}h ago` ``.
  - Derivaciones R8: `speed` = último item de `positions.items`
    (ascendentes) → `items[items.length - 1]?.speedKmh`; `distance` =
    `trips.reduce((acc, t) => acc + t.distanceM, 0)` solo si la ruta está
    `ok`; `gps` = sin posición → `'No signal'`, `staleSeconds <= 120` →
    `'Live'`, resto → `'Stale'`.

  Wiring de datos (con `token` de `useAuth()`, `baseUrl` de
  `process.env.EXPO_PUBLIC_API_URL`, `selectedPetId` de `useSelectedPet()`):

  ```tsx
  const petsFn = useCallback(() => listPets(baseUrl, token ?? ''), [baseUrl, token]);
  const pets = useApi(petsFn);
  const lastFn = useMemo(
    () => (selectedPetId ? () => getLastPosition(baseUrl, token ?? '', selectedPetId) : null),
    [baseUrl, token, selectedPetId],
  );
  const last = useApi(lastFn);
  const positionsFn = ...   // idem con listPositions
  const positions = useApi(positionsFn);
  const routeFn = ...       // idem con getDayRoute
  const route = useApi(routeFn);
  ```

  Selección por defecto (R4): mismo `useEffect` que Home — si
  `pets.data?.kind === 'ok'`, hay elementos y (`selectedPetId === null` o
  no está en la lista) → `selectPet(pets.data.pets[0].id)`. (Duplica ~5
  líneas de Home a propósito: extraer un hook para dos usos es prematuro;
  si un tercer tab lo repite, se extrae entonces.)

- **D7 — Polling sin dependencia nueva** (R9). En `map.tsx`:

  ```tsx
  useFocusEffect(
    useCallback(() => {
      if (!selectedPetId || last.data?.kind === 'no-tracking') return;
      route.refetch(); // la ruta se refresca al (re)enfocar, no en el intervalo
      const id = setInterval(() => {
        last.refetch();
        positions.refetch();
      }, POLL_MS);
      return () => clearInterval(id);
    }, [selectedPetId, last.data?.kind, last.refetch, positions.refetch, route.refetch]),
  );
  ```

  `useFocusEffect` se importa de `expo-router`. El stale-while-revalidate
  de `useApi` conserva `data` durante cada refetch → el marker no
  desaparece entre ticks. La ruta NO entra al intervalo: un paseo nuevo
  aparece al reenfocar el tab (v1; si molesta, una línea lo mete al
  intervalo). Free (402) → el guard del callback no programa nada.

- **D8 — Lost Mode: stub + feature backend #45** (R10). Botón HeroUI
  `Button` deshabilitado; nada de estado local ni handler. Se añade a
  `feature_list.json` (lo hace spec_author, ya hecho al dejar esta spec):

  ```json
  {
    "id": 45,
    "name": "pet-lost-mode",
    "status": "pending",
    "priority": "P3",
    "description": "Backend: endpoint para activar/desactivar Lost Mode de una mascota (p.ej. POST /v1/pets/:petId/lost-mode) sobre la columna pets.lost_mode ya existente + reglas de producto (quién puede, efectos en alerts/positions). Anotada al backlog por la spec de #36 mobile-map-live (2026-08-21): el botón Activate Lost Mode del tab Map quedó como stub deshabilitado (specs/mobile-map-live R10). Al implementarla, activar el stub móvil."
  }
  ```

- **D9 — Patrón de tests** (jest-expo + RTL, wrapper `HeroUINativeProvider`,
  `describe('R<n>: ...')`):
  - `src/api/__tests__/positions.test.ts` (R1, R2) y `trips.test.ts` (R3):
    sin render; `fetchFn` stub por caso devolviendo
    `{ status, json: async () => body } as unknown as Response`; asserts de
    URL exacta (sin query params) y header `Authorization` en
    `fetchFn.mock.calls`. Para R3, el stub resuelve por URL (lista vs
    `/trips/0`, `/trips/1`).
  - `src/app/(tabs)/__tests__/map.test.tsx` (R4–R10): `jest.mock` de
    `../../../api/pets`, `../../../api/positions`, `../../../api/trips`,
    `../../../providers/auth-provider` (token fijo) y `expo-router`
    (`{ router: { push: jest.fn() }, useFocusEffect: mock }`);
    `SelectedPetProvider` real como wrapper y `useApi` real (misma línea
    que #35 D10). Mock de `react-native-maps`:

    ```tsx
    jest.mock('react-native-maps', () => {
      const React = require('react');
      const { View } = require('react-native');
      const stub = (props: Record<string, unknown>) =>
        React.createElement(View, props, props.children);
      return { __esModule: true, default: stub, Marker: stub, Polyline: stub };
    });
    ```

    (los stubs propagan `testID`/props → los asserts de R6/R7 leen
    `coordinate`/`coordinates` con `getByTestId(...).props`). El
    `transformIgnorePatterns` existente ya cubre `react-native-maps`
    (prefijo `react-native`) — no tocar la config de jest.
  - R9: mock de `useFocusEffect` que ejecuta el callback en un
    `useEffect` y captura el cleanup; `jest.useFakeTimers()` +
    `act(() => jest.advanceTimersByTime(15000))` → asserts de llamadas
    extra a los mocks de `getLastPosition`/`listPositions`; invocar el
    cleanup → avanzar de nuevo → cero llamadas nuevas.
  - `src/app/(tabs)/__tests__/screens.test.tsx`: SOLO se elimina el caso
    `map` del `describe('R5: placeholders de tabs')` (excepción C4,
    reviewer verifica diff limitado).
  - Fixtures locales: `makeLastPosition(overrides)`,
    `makeStoredPosition(overrides)`, `makeTrip(overrides)`.

- **D10 — API key de Google Maps: tarea humana diferida, NO bloqueante.**
  Expo Go usa su propia key (D1). El día que haya dev/production build
  (fuera de este repo-ciclo), el humano crea la key en Google Cloud y la
  pone en `app.json → android.config.googleMaps.apiKey`. Esta feature NO
  toca `app.json`.

## Archivos afectados

Todos en la isla móvil salvo `feature_list.json`:

- `mobile-pet-tracker/package.json` — + `react-native-maps` 1.27.2
  (`bunx expo install react-native-maps`; D1)
- `mobile-pet-tracker/src/api/types.ts` — tipos D3 (se amplía)
- `mobile-pet-tracker/src/api/positions.ts` — nuevo (D4; R1, R2)
- `mobile-pet-tracker/src/api/trips.ts` — nuevo (D5; R3)
- `mobile-pet-tracker/src/api/__tests__/positions.test.ts` — nuevo
- `mobile-pet-tracker/src/api/__tests__/trips.test.ts` — nuevo
- `mobile-pet-tracker/src/app/(tabs)/map.tsx` — reescrito (D6, D7; R4–R10)
- `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` — nuevo
- `mobile-pet-tracker/src/app/(tabs)/__tests__/screens.test.tsx` — quita el
  caso map (excepción C4)
- `feature_list.json` — #36 según flujo + alta de #45 (D8)

Prohibido tocar: `backend-pet-tracker/`, `infra/`, `init.config.sh`,
`.github/workflows/ci.yml` (R12). `app.json` tampoco cambia (D10).

## Alternativas descartadas

- **expo-maps**: no corre en Expo Go y está en alpha (evidencia D1) —
  violaría la restricción dura del smoke.
- **Mapa por WebView (Leaflet/OSM)**: solo tendría sentido si ninguna
  opción nativa corriera en Go; react-native-maps corre. Añadiría un
  runtime JS embebido, bridge de mensajes y otro modelo de testing.
- **react-query**: ver D2 — sin mutaciones ni caché compartida real; el
  umbral de adopción queda escrito para la próxima vez.
- **Polling dentro de `useApi` (param `intervalMs`)**: tocaría un hook
  estable de #35 y su suite para un único consumidor; el intervalo en la
  pantalla con `useFocusEffect` además resuelve gratis el pause-on-blur,
  que dentro del hook exigiría acoplarlo a navegación.
- **Ruta del día con `GET /positions?from=&to=`**: obligaría al cliente a
  calcular "hoy" en la timezone del owner (no la conoce — mismo argumento
  que activity en #35), a paginar (24 h puede ser >1 página) y a filtrar
  puntos de reposo; `/trips` ya devuelve los paseos segmentados y el
  backend resuelve la timezone.
- **`GET /trips/:n` bajo demanda (tap en un paseo)**: la feature pide "ruta
  del día" dibujada, no exploración por paseo; el N+1 con N≤~5 es más
  barato que UI adicional.
- **Cámara siguiendo al marker en cada tick** (`animateToRegion` en cada
  poll): pelea con el paneo del usuario; `key={selectedPetId}` re-centra
  solo al cambiar de mascota, suficiente v1.
- **Umbral `Stale` derivado del intervalo real del collar**: el backend no
  publica la cadencia del device; 120 s es regla de presentación en UN
  sitio (`STALE_SECONDS`) y se ajusta con el collar real en el smoke.
- **`getPet` en Map para leer `lostMode`/device**: el 402 de positions ya
  discrimina free vs tracking y el botón es stub — una llamada menos.
