---
feature: "mobile-map-live"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-map-live]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D10). Las capas de
> `docs/architecture.md` son de backend y NO aplican a esta app; sí aplican
> kebab-case, tests que nombran su R-id y conventional commits
> (`docs/conventions.md` §Convenciones de la app móvil).
> Contratos del backend verificados contra el código real el 2026-08-21
> (ver [[design]] §Contratos verificados).

## Contexto fijo (no reabrir)

- Base: estado tras #35 — Home real con `SelectedPetProvider` montado en
  `src/app/(tabs)/_layout.tsx`, `useApi` con stale-while-revalidate
  (`src/hooks/use-api.ts`), clientes `fetchFn`/`kind` en `src/api/`
  (`http.ts`, `pets.ts`, `activity.ts`), placeholder Map en
  `mobile-pet-tracker/src/app/(tabs)/map.tsx` (`testID="screen-map"`).
- **UNA dependencia nueva: `react-native-maps` 1.27.2** (la versión que
  pinnea `bundledNativeModules.json` de SDK 57). Corre **dentro de Expo Go**
  — verificado contra la doc de SDK 57 el 2026-08-21
  (evidencia en [[design]] §D1): la restricción dura del humano (smoke solo
  con `bunx expo start --go`, sin dev builds ni Android Studio) se cumple.
  En Expo Go Android el proveedor es Google Maps con la API key de Expo Go:
  **no hace falta API key propia para el smoke**. La key propia solo aplica
  a dev/production builds → tarea humana diferida, NO bloqueante ([[design]] §D10).
- `expo-maps` queda descartado: su doc de SDK 57 dice "not available in the
  Expo Go app" y está en alpha ([[design]] §D1).
- **SIN react-query** (decisión reevaluada aquí, como exigía #35): el
  polling del mapa se resuelve con `setInterval` + `refetch()` del `useApi`
  existente dentro de `useFocusEffect` — cero deps nuevas de datos
  ([[design]] §D2). Punto del gate humano.
- **Lost Mode NO tiene endpoint en el backend** (verificado 2026-08-21):
  `lostMode` es una columna de `pets` + campo de solo lectura del
  `PetProfileResponse`; no está en `PetFieldsSchema` (POST/PATCH pets no lo
  aceptan), `devices.controller.ts` solo expone `POST /devices/claim` y
  `alerts.controller.ts` solo `GET /alerts` + `POST /alerts/:id/ack`.
  → Botón **stub deshabilitado** (patrón #33 forgot-password/#44) y feature
  backend nueva al backlog (#45, [[design]] §D8).
- Los tres endpoints consumidos están detrás de `PetAccessGuard` +
  `PetTrackingGuard`: mascota sin subscripción de collar → **402**
  `code: DEVICE_SUBSCRIPTION_REQUIRED` = estado "free", no error.
  401 → `signOut()` ya lo maneja `useApi` (R4 de #35).
- Decisión de #33 (vigente): las funciones de `src/api/` reciben
  `token`/`fetchFn` por parámetro y nunca leen storage ni importan React.
- Lección de #34 (vigente): todo posicionamiento absoluto y offsets
  numéricos van por `style` inline, nunca con `left-*`/`right-*`/`bottom-*`
  de uniwind. El resto se estiliza con `className` + tokens.
- Smoke humano 100% **Expo Go** (`bunx expo start --go`), SDK 57, Android
  físico, con collar real (unidad 401775970) o `SIM_MODE`.

## Excepción a C4 (cambios sobre código existente)

- `src/app/(tabs)/__tests__/screens.test.tsx`: el caso `map` sale del
  `describe('R5: placeholders de tabs')` (Map deja de ser placeholder);
  los casos food/profile y el resto quedan intactos. Lo cubre el reviewer
  con `git diff` (mismo trato que el caso `home` en #35).

Todo código nuevo (R1–R9) sigue TDD estricto con test rojo primero.

## Requisitos funcionales

### Clientes API (`src/api/positions.ts`, `src/api/trips.ts`)

- **R1**: WHEN se llama `getLastPosition(baseUrl, token, petId, fetchFn)` de
  `mobile-pet-tracker/src/api/positions.ts` (nuevo; firma exacta en
  [[design]] §D4) THE SYSTEM SHALL hacer
  `GET ${baseUrl}/pets/${petId}/positions/last` (mismo saneo de `/` y header
  `Authorization: Bearer ${token}` vía `getJson` de `http.ts`) y devolver un
  `LastPositionState`:
  - HTTP 200 con body objeto → `{ kind: 'ok', position }` (`LastPosition`, §D3);
  - HTTP 200 con body `null` (contrato R5 del backend: sin posición es
    estado, no error) → `{ kind: 'ok', position: null }`;
  - HTTP 402 → `{ kind: 'no-tracking' }`;
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no parseable → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }` sin llamar a `fetchFn`.
  *Test: `mobile-pet-tracker/src/api/__tests__/positions.test.ts` →
  `describe('R1: getLastPosition mapea la respuesta por kind', ...)` con
  `fetchFn` stub por caso (mismo patrón que la suite de pets). ROJO primero.*

- **R2**: WHEN se llama `listPositions(baseUrl, token, petId, fetchFn)` del
  mismo archivo THE SYSTEM SHALL hacer
  `GET ${baseUrl}/pets/${petId}/positions` **sin query params** (el backend
  aplica la ventana default de 60 min terminando en ahora; los items vienen
  en orden ascendente por `ts` — `ScanIndexForward: true`) y devolver un
  `PositionsState`:
  - HTTP 200 con `{ items: array }` → `{ kind: 'ok', items, nextCursor }`
    (`StoredPosition[]`, §D3; `nextCursor` se conserva en el tipo pero v1 no
    pagina — la ventana de 60 min cabe en una página de 1000);
  - HTTP 402 → `{ kind: 'no-tracking' }`;
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status (incluido 400) / body sin `items` array → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  *Test: mismo archivo → `describe('R2: listPositions mapea la respuesta por kind', ...)`
  con assert de URL exacta sin query string. ROJO primero.*

- **R3**: WHEN se llama `getDayRoute(baseUrl, token, petId, fetchFn)` de
  `mobile-pet-tracker/src/api/trips.ts` (nuevo; firma en [[design]] §D5)
  THE SYSTEM SHALL hacer `GET ${baseUrl}/pets/${petId}/trips` **sin query
  params** (`date` ausente ⇒ hoy en la timezone del owner) y, si responde
  200 con `{ date, items }`, hacer `GET .../trips/${index}` por cada item
  (en paralelo, `Promise.all`) y devolver un `DayRouteState`:
  - todas 200 → `{ kind: 'ok', date, trips }` (`TripDetail[]` ordenados por
    `index`, cada uno con su `path`);
  - lista 200 con `items` vacío → `{ kind: 'ok', date, trips: [] }` (día sin
    paseos, estado válido) sin llamadas a detalle;
  - HTTP 402 en la lista → `{ kind: 'no-tracking' }`;
  - HTTP 401 en cualquier llamada → `{ kind: 'unauthorized' }`;
  - cualquier otro status o body inválido en cualquier llamada → `{ kind: 'error' }`;
  - `fetchFn` lanza en cualquier llamada → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  AND THE SYSTEM SHALL NOT importar `expo-secure-store` ni React en ningún
  archivo bajo `src/api/` (regla de #33; reviewer grep).
  *Test: `mobile-pet-tracker/src/api/__tests__/trips.test.ts` →
  `describe('R3: getDayRoute compone lista y detalles por kind', ...)` con
  `fetchFn` stub que responde por URL. ROJO primero.*

### Pantalla Map (`src/app/(tabs)/map.tsx`)

- **R4**: WHEN Map monta con sesión activa THE SYSTEM SHALL resolver la
  mascota: carga `listPets` vía `useApi` y, IF `selectedPetId` de
  `useSelectedPet()` es `null` o no está en la lista THEN llama
  `selectPet(pets[0].id)` (mismo patrón de selección por defecto que Home —
  cubre entrar al tab Map sin pasar por Home);
  - WHILE pets o la primera carga de posición vuelan SHALL mostrar
    `testID="map-loading"` (Spinner);
  - IF pets resuelve `ok` con lista vacía THEN SHALL mostrar `No pets yet`
    (`testID="map-no-pets"`) y ningún `MapView`;
  - IF pets resuelve `error | unreachable | missing-config` THEN SHALL
    mostrar `Something went wrong` (`testID="map-error"`) con `Button`
    `Retry` (`testID="map-retry"`) que llama `refetch`.
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` →
  `describe('R4: map resuelve la mascota seleccionada', ...)` mockeando
  `../../../api/pets`, `../../../api/positions`, `../../../api/trips` y
  `../../../providers/auth-provider`; `SelectedPetProvider` real como
  wrapper y `useApi` real ([[design]] §D9). ROJO primero.*

- **R5**: IF `getLastPosition` resuelve `{ kind: 'no-tracking' }` (mascota
  free, 402) THEN THE SYSTEM SHALL mostrar
  `Live tracking requires a collar` (`testID="map-no-tracking"`) en lugar
  del mapa, sin stats ni botón de Lost Mode, y SHALL NOT programar polling.
  *Test: mismo archivo → `describe('R5: mascota free degrada sin mapa', ...)`.
  ROJO primero.*

- **R6**: WHEN `getLastPosition` resuelve `ok` con `position !== null` THE
  SYSTEM SHALL renderizar `MapView` de `react-native-maps` fullscreen
  (`testID="map-view"`, `key={selectedPetId}` para re-centrar al cambiar de
  mascota, `initialRegion` centrada en `position.lat/lng` con deltas 0.01)
  con un `Marker` en la última posición (`testID="map-marker"`,
  `coordinate={{ latitude: position.lat, longitude: position.lng }}`);
  IF `position === null` (collar sin reportar nunca) THEN SHALL renderizar
  el `MapView` centrado en la región default (19.4326, −99.1332 — el home
  del simulador) sin `Marker` y con el overlay `No location data yet`
  (`testID="map-empty"`).
  *Test: mismo archivo → `describe('R6: mapa y marker con la última posición', ...)`
  con mock de `react-native-maps` (§D9: stubs `View` que propagan
  `testID`/props). ROJO primero.*

- **R7**: WHEN `getDayRoute` resuelve `ok` con `trips` no vacío THE SYSTEM
  SHALL renderizar un `Polyline` por trip (`testID="map-route-<index>"`,
  `coordinates` = `path` mapeado a `{ latitude, longitude }`); IF resuelve
  `ok` con `trips` vacío THEN SHALL no renderizar ningún `Polyline` (sin
  error); IF resuelve `error | unreachable` THEN el mapa y las stats de
  posición SHALL seguir visibles (la ruta degrada sola: distancia `—`).
  *Test: mismo archivo → `describe('R7: ruta del día como polylines', ...)`.
  ROJO primero.*

- **R8**: WHILE hay posición (`ok`, con o sin ruta) THE SYSTEM SHALL
  mostrar la barra de stats (overlay inferior, offsets por `style` inline):
  - `testID="stat-speed"` = `speedKmh` del **último item** de
    `listPositions` formateado `<n.n> km/h`; IF la ventana está vacía o el
    valor es `null` THEN `—`;
  - `testID="stat-distance"` = suma de `distanceM` de los trips del día en
    km con 1 decimal (`0.0 km` con cero paseos); IF la ruta no está en `ok`
    THEN `—`;
  - `testID="stat-updated"` = antigüedad de `position.staleSeconds`
    formateada (`Just now` < 60 s; `<n>m ago` < 60 min; `<n>h ago` ≥ 60 min);
  - `testID="stat-gps"` = `Live` si `staleSeconds <= 120`, `Stale` si
    `> 120`, `No signal` si `position === null`.
  *Test: mismo archivo → `describe('R8: stats calculadas de positions y trips', ...)`
  con fixtures fresh / stale / sin posición / sin ruta. ROJO primero.*

- **R9**: WHILE el tab Map está enfocado AND la mascota tiene tracking THE
  SYSTEM SHALL re-ejecutar `getLastPosition` y `listPositions` cada
  `POLL_MS = 15000` ms (vía `refetch()`; el stale-while-revalidate de
  `useApi` conserva el dato anterior — sin parpadeo) AND SHALL re-ejecutar
  `getDayRoute` al (re)enfocar el tab; WHEN el tab pierde el foco o el
  componente desmonta THE SYSTEM SHALL cancelar el intervalo (cleanup de
  `useFocusEffect`).
  *Test: mismo archivo → `describe('R9: polling con foco', ...)` con
  `jest.useFakeTimers()` + `advanceTimersByTime` y mock de `useFocusEffect`
  que expone el cleanup ([[design]] §D9). ROJO primero.*

- **R10**: WHILE hay posición THE SYSTEM SHALL mostrar el botón
  `Activate Lost Mode` (`testID="lost-mode-button"`) **deshabilitado**
  (`isDisabled` + `accessibilityState={{ disabled: true }}`) con el
  subtexto `Coming soon` — el backend no expone endpoint de Lost Mode
  (§Contexto fijo); la feature backend queda anotada como **#45** en
  `feature_list.json` y al implementarla se activa este stub.
  *Test: mismo archivo → `describe('R10: lost mode es stub deshabilitado', ...)`
  con assert de `accessibilityState.disabled`. ROJO primero.*

### Tipado y contención

- **R11**: WHEN se ejecuta `bun run typecheck` en `mobile-pet-tracker/`
  tras los cambios THE SYSTEM SHALL salir con exit 0, AND `bun run lint`
  SHALL salir con exit 0.
  *Verificación: implementer ejecuta ambos y lo anota en
  `progress/impl_mobile-map-live.md`; el reviewer los re-ejecuta.*

- **R12**: WHILE la feature #36 esté en curso THE SYSTEM SHALL NOT
  modificar archivos bajo `backend-pet-tracker/`, `infra/`,
  `init.config.sh` ni `.github/workflows/ci.yml`; WHEN se ejecuta
  `./init.sh` tras los cambios THE SYSTEM SHALL terminar con exit 0; AND la
  suite móvil completa (`bun run test` en `mobile-pet-tracker/`) SHALL
  quedar verde, incluidas las suites de #33/#34/#35 (único diff permitido:
  la excepción C4 de `screens.test.tsx`).
  *Verificación: reviewer ejecuta `./init.sh`, `bun run test` y
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  (vacío). Además: `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/`
  sin resultados nuevos.*

### Prueba de humo del humano

- **R13**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL mostrar el mapa en vivo contra el backend local en Android
  físico, con el collar real (unidad Wialon 401775970, `WIALON_TOKEN` en
  `.env`) **o** `SIM_MODE` (default dev). Pasos (misma WiFi, `.env` con IP
  LAN, backend arriba con `docker compose up -d` +
  `pnpm -C backend-pet-tracker run start:dev`; poller de ingesta corriendo
  para que haya posiciones frescas):

  1. Desde `mobile-pet-tracker/`: `bunx expo start --go` y escanear el QR.
     **Sin API key propia de Google Maps** — Expo Go usa la suya.
  2. Login → tab Map: mapa con el marker en la última posición del collar
     de la mascota seleccionada; con `SIM_MODE`, cerca de CDMX
     (19.4326, −99.1332).
  3. Esperar ≥ 2 ciclos de polling (~30 s) con el simulador/collar
     reportando → el marker y `stat-updated`/`stat-gps` se actualizan solos.
  4. Día con paseos → ruta dibujada; stats de speed/distance coherentes.
  5. Cambiar a una mascota free en Home → volver a Map → nota de collar
     (402), sin mapa, sin crash.
  6. Mascota con collar sin posiciones aún → mapa con `No location data yet`.
  7. Parar el poller unos minutos → `stat-gps` pasa a `Stale`.
  8. Botón `Activate Lost Mode` visible y deshabilitado.
  9. Salir del tab Map y observar la consola/red: el polling se detiene.

  - [ ] Smoke ejecutado por el humano (fecha: ____)

## Fuera de alcance

- API key propia de Google Maps (`android.config.googleMaps.apiKey` en
  `app.json`): solo necesaria para dev/production builds, no para Expo Go.
  Tarea humana diferida a la primera feature que haga build nativo (§D10).
- Endpoint backend de Lost Mode y activación real del botón → feature #45.
- Seguimiento de cámara continuo ("follow mode"), clustering, heatmaps.
- Paginación de `/positions` (`nextCursor`) y query params `from`/`to`/
  `includeSuspect` — la ventana default de 60 min basta para la stat de speed.
- Geofences en el mapa (módulo backend existe; feature móvil propia).
- Mini-mapa del Home (follow-up anotado en #35, sigue pendiente).
- Selector de fecha para rutas históricas (`?date=` queda sin usar en v1).
- Persistir la región/zoom del mapa entre sesiones.
- react-query / TanStack Query (decisión D2: rechazado también aquí).
- Cambios a `backend-pet-tracker/`, `infra/`, `init.config.sh`, CI (R12).

## Decisiones pendientes de humano (este gate)

- **D1 — react-native-maps 1.27.2 en Expo Go** (única dependencia nueva;
  evidencia en [[design]] §D1). Ratificar que se descarta expo-maps (alpha,
  no corre en Go) y que la API key propia queda diferida.
- **D2 — sin react-query**: el polling cabe en `useApi` + `setInterval` en
  `useFocusEffect`; sin mutaciones (Lost Mode es stub) ni caché compartida
  real que lo justifique. Si el humano prefiere adoptarlo ya, la spec se
  reajusta antes del handoff.
- Menores objetables: `POLL_MS = 15000`, umbral `Stale` a 120 s, speed
  desde la ventana de 60 min de `/positions` (vacía ⇒ `—`), región default
  CDMX, textos en inglés, botón Lost Mode con `Coming soon`, y el alta de
  la feature backend #45 en `feature_list.json`.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-21) ← gate obligatorio antes de implementar
