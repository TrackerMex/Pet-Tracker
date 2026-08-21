---
feature: "mobile-home-dashboard"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-home-dashboard]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D11). Las capas de
> `docs/architecture.md` son de backend y NO aplican a esta app; sí aplican
> kebab-case, tests que nombran su R-id y conventional commits
> (`docs/conventions.md` §Convenciones de la app móvil).
> Contratos del backend verificados contra el código real el 2026-08-21
> (ver [[design]] §Contratos verificados).

## Contexto fijo (no reabrir)

- Base: estado tras #34 — grupos `(auth)`/`(tabs)` con guards de sesión,
  tab bar flotante custom, `useAuth()` → `{ status, token, signIn, signOut }`,
  placeholder Home en `mobile-pet-tracker/src/app/(tabs)/home.tsx`
  (`testID="screen-home"`).
- **Cero dependencias nuevas.** Todo lo necesario ya está instalado:
  `expo-image` (foto de mascota), HeroUI Native 1.0.8 (exporta `Card`,
  `Avatar`, `Chip`, `Skeleton`, `Spinner`, `Button`, `Surface` — verificado
  en `node_modules/heroui-native/lib/typescript/src/components/` el
  2026-08-21), `reicon-react-native` (iconos `Battery`, `Wifi`, `WifiOff`,
  `Moon`, `Walk`, `Map`, `ChevronRight` verificados en
  `node_modules/reicon-react-native/icons/`).
- **Hallazgo clave del backend** (determina el diseño): `GET /v1/pets`
  (lista) devuelve `device`, `photoUrl` y `nextVaccine` siempre `null` — el
  mapper solo los rellena en `GET /v1/pets/:petId` (detail). Por eso el
  Home hace lista (selector) + detail (card/collar) y **no existe
  `src/api/devices.ts`**: el estado del collar viene embebido en el detail
  con el mismo shape que `GET /v1/pets/:petId/device`.
- `GET /v1/pets/:petId/activity/daily` está detrás de `PetTrackingGuard`:
  mascota sin subscripción de collar → **402** con
  `code: DEVICE_SUBSCRIPTION_REQUIRED`. Ese 402 es el estado "free" del
  summary, no un error.
- Todos los endpoints consumidos exigen `Authorization: Bearer <token>`
  (JwtAuthGuard global); un token inválido/expirado responde 401. Esta
  feature cierra la deuda "manejo global de 401 → signOut" anotada en las
  specs de #33/#34 (R4).
- Decisión de #33 (sigue vigente): las funciones de `src/api/` reciben
  `token`/`fetchFn` por parámetro y **nunca leen storage** ni importan React.
- SIN react-query: su reevaluación es scope de #36, no de aquí. El
  boilerplate de fetch en pantalla se resuelve con `useApi` (≤30 líneas de
  lógica, [[design]] §D7).
- SIN mini-mapa en v1: card de última posición que enlaza al tab Map (R10);
  el mini-mapa es follow-up tras #36.
- Smoke humano 100% **Expo Go** (`bunx expo start --go`), SDK 57, nada
  nativo nuevo.
- Lección de #34 (fix post-R11): las utilidades de posicionamiento de
  uniwind (`left-*`/`right-*`/`bottom-*`) fallaron en runtime Android — todo
  posicionamiento absoluto y offsets numéricos van por `style` inline
  (`specs/mobile-tabs-shell/traceability.md`, fila "R8 fix post-R11").

## Excepción a C4 (cambios sobre código de #34)

Dos retoques sobre archivos existentes no nacen por TDD nuevo, los cubren
las suites existentes actualizadas y el reviewer con `git diff`:

- `src/app/(tabs)/__tests__/screens.test.tsx`: el caso `home` sale del
  `describe('R5: placeholders de tabs')` (Home deja de ser placeholder);
  los casos map/food/profile y el `describe('R6: ...')` quedan intactos.
- `src/app/(tabs)/_layout.tsx`: se envuelve `<Tabs>` con
  `SelectedPetProvider` (R5); su suite `layout.test.tsx` gana un assert de
  montaje pero no cambia los asserts de R1 de #34.

Todo código nuevo (R1–R10) sigue TDD estricto con test rojo primero.

## Requisitos funcionales

### Clientes API (`src/api/pets.ts`, `src/api/activity.ts`)

- **R1**: WHEN se llama `listPets(baseUrl, token, fetchFn)` de
  `mobile-pet-tracker/src/api/pets.ts` (firma exacta en [[design]] §D5)
  THE SYSTEM SHALL hacer `GET ${baseUrl}/pets` (mismo saneo de `/` final
  que `auth.ts`) con header `Authorization: Bearer ${token}` y devolver un
  `PetsState` discriminado por `kind`:
  - HTTP 200 con array → `{ kind: 'ok', pets }` (`PetProfile[]`, tipos §D3);
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - cualquier otro status o body no parseable → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }` sin llamar a `fetchFn`.
  *Test: `mobile-pet-tracker/src/api/__tests__/pets.test.ts` →
  `describe('R1: listPets mapea la respuesta por kind', ...)` con `fetchFn`
  stub por caso (mismo patrón que la suite de auth). ROJO primero.*

- **R2**: WHEN se llama `getPet(baseUrl, token, petId, fetchFn)` del mismo
  archivo THE SYSTEM SHALL hacer `GET ${baseUrl}/pets/${petId}` con el
  mismo header y devolver un `PetState`:
  - HTTP 200 → `{ kind: 'ok', pet }` (`PetProfile` con `device`,
    `photoUrl`, `nextVaccine` y `lastCommunicationAt` ya embebidos);
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status (incluido 404) / body no parseable → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  *Test: mismo archivo → `describe('R2: getPet mapea la respuesta por kind', ...)`.
  ROJO primero.*

- **R3**: WHEN se llama `getDailyActivity(baseUrl, token, petId, fetchFn)`
  de `mobile-pet-tracker/src/api/activity.ts` THE SYSTEM SHALL hacer
  `GET ${baseUrl}/pets/${petId}/activity/daily` **sin query params** (el
  backend responde los 7 días que acaban hoy en la timezone del owner) y
  devolver un `DailyActivityState`:
  - HTTP 200 → `{ kind: 'ok', days, weekComparison }` (shapes §D3);
  - HTTP 402 → `{ kind: 'no-tracking' }` (mascota sin subscripción de
    collar — estado esperado, no error);
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no parseable → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  AND THE SYSTEM SHALL NOT importar `expo-secure-store` ni React en ningún
  archivo bajo `src/api/` (regla de #33; reviewer grep).
  *Test: `mobile-pet-tracker/src/api/__tests__/activity.test.ts` →
  `describe('R3: getDailyActivity mapea la respuesta por kind', ...)`.
  ROJO primero.*

### Hook de fetch (`src/hooks/use-api.ts`)

- **R4**: WHEN un componente monta `useApi(fn)` (nuevo,
  `mobile-pet-tracker/src/hooks/use-api.ts`, contrato exacto en [[design]]
  §D7, ≤30 líneas de lógica) THE SYSTEM SHALL ejecutar `fn()` y exponer
  `{ data: undefined }` mientras la promesa vuela y `{ data: result }` al
  resolver; WHEN `fn` cambia de identidad SHALL re-ejecutar descartando
  respuestas de ejecuciones anteriores (guard de carrera); WHEN se llama
  `refetch()` SHALL volver a `data: undefined` y re-ejecutar. IF el
  resultado tiene `kind === 'unauthorized'` THEN THE SYSTEM SHALL llamar
  `signOut()` de `useAuth()` (cierra la deuda 401 global de #33/#34; el
  guard de `(tabs)` redirige solo a `/login`).
  *Test: `mobile-pet-tracker/src/hooks/__tests__/use-api.test.tsx` →
  `describe('R4: useApi ejecuta, refetch y expulsa 401', ...)` con `fn`
  stub y mock de `../../providers/auth-provider`. ROJO primero.*

### Selección de mascota (`src/providers/selected-pet-provider.tsx`)

- **R5**: WHEN `SelectedPetProvider` (nuevo,
  `mobile-pet-tracker/src/providers/selected-pet-provider.tsx`, contrato en
  [[design]] §D8) monta THE SYSTEM SHALL exponer vía `useSelectedPet()`
  `{ selectedPetId: null, selectPet }` y, tras `selectPet(id)`, `selectedPetId === id`;
  IF `useSelectedPet()` se usa sin provider THEN SHALL lanzar `Error`
  (mismo patrón que `useAuth`). AND el provider SHALL quedar montado en
  `mobile-pet-tracker/src/app/(tabs)/_layout.tsx` envolviendo `<Tabs>`
  (para que #36 Map consuma la misma selección).
  *Test: `mobile-pet-tracker/src/providers/__tests__/selected-pet-provider.test.tsx`
  → `describe('R5: SelectedPetProvider expone la selección', ...)`; el
  montaje lo cubre un assert nuevo en
  `src/app/(tabs)/__tests__/layout.test.tsx` (mock del provider que
  registra su render). ROJO primero.*

### Pantalla Home (`src/app/(tabs)/home.tsx`)

- **R6**: WHEN Home monta con sesión activa THE SYSTEM SHALL cargar
  `listPets` vía `useApi` y:
  - WHILE la carga vuela SHALL mostrar `testID="home-loading"` (Spinner);
  - IF `kind === 'error' | 'unreachable' | 'missing-config'` THEN SHALL
    mostrar `Something went wrong` (`testID="home-error"`) y un `Button`
    `Retry` (`testID="home-retry"`) que llama `refetch`;
  - IF `kind === 'ok'` y `pets.length === 0` THEN SHALL mostrar
    `No pets yet` (`testID="home-empty"`);
  - IF `kind === 'ok'` y hay mascotas THEN SHALL renderizar el selector:
    un `Pressable`/`Chip` por mascota en el orden recibido
    (`testID="pet-chip-<id>"`, label = nombre), el chip de la seleccionada
    con `accessibilityState={{ selected: true }}`. WHEN `selectedPetId` es
    `null` o no está en la lista SHALL llamar `selectPet(pets[0].id)`
    (selección por defecto). WHEN se pulsa un chip SHALL llamar
    `selectPet(id)` y las cards (R7–R10) SHALL recargarse para esa mascota.
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx` →
  `describe('R6: home carga pets y selecciona', ...)` mockeando
  `../../../api/pets`, `../../../api/activity` y
  `../../../providers/auth-provider`; `SelectedPetProvider` real como
  wrapper ([[design]] §D10). ROJO primero.*

- **R7**: WHEN el detail de la mascota seleccionada (`getPet` vía `useApi`)
  resuelve `ok` THE SYSTEM SHALL mostrar la pet card
  (`testID="pet-card"`): foto con `expo-image`
  (`testID="pet-card-photo"`, `source={pet.photoUrl}`; IF `photoUrl` es
  `null` THEN un fallback con la inicial del nombre — sin red), nombre
  (`testID="pet-card-name"`) y raza (`testID="pet-card-breed"`, `—` si
  `breed` es `null`). WHILE el detail vuela SHALL mostrar `Skeleton`
  (`testID="pet-card-skeleton"`); IF el detail falla (`error` /
  `unreachable`) THEN SHALL mostrar `Something went wrong` con `Retry`
  dentro de la card (`testID="pet-card-error"`).
  *Test: mismo archivo → `describe('R7: pet card muestra el perfil', ...)`.
  ROJO primero.*

- **R8**: WHEN el detail resuelve `ok` THE SYSTEM SHALL mostrar la card de
  collar (`testID="collar-card"`):
  - IF `pet.device === null` THEN SHALL mostrar `Free`
    (`testID="collar-status"`) y el subtexto `No collar — health only`
    (mascota sin collar es un estado válido de app de salud), sin fila de
    batería;
  - IF `pet.device !== null` THEN SHALL mostrar `Online` si
    `device.connectivity === 'online'` y `Offline` en cualquier otro caso
    (el pipeline solo escribe `'online'`; `null` = nunca conectado), y la
    batería `${device.batteryPct}%` o `—` si es `null`
    (`testID="collar-battery"`).
  *Test: mismo archivo → `describe('R8: collar card refleja el device', ...)`
  con fixtures device null / online con batería / connectivity null. ROJO
  primero.*

- **R9**: WHEN la actividad de la mascota seleccionada (`getDailyActivity`
  vía `useApi`) resuelve THE SYSTEM SHALL mostrar Today's Summary
  (`testID="summary-card"`, título `Today's Summary`) tomando **la última
  entrada de `days`** (el día en curso en la timezone del owner):
  - IF `kind === 'ok'` THEN SHALL mostrar Activity
    (`testID="summary-activity"`, `activeMinutes` formateado §D9), Sleep
    (`testID="summary-sleep"`, `restMinutes` formateado) y Distance
    (`testID="summary-distance"`, `distanceM` en km con 1 decimal); IF una
    métrica es `null` (día `missing`) THEN SHALL mostrar `—` en su lugar
    (nunca `0`: cero significa reposo confirmado, null significa sin datos);
  - IF `kind === 'no-tracking'` THEN SHALL mostrar
    `Activity tracking requires a collar` (`testID="summary-note"`) en vez
    de las métricas — degradación esperada para mascota free, sin error;
  - IF `kind === 'error' | 'unreachable'` THEN SHALL mostrar
    `Could not load activity` (`testID="summary-note"`);
  - WHILE la carga vuela SHALL mostrar `Skeleton`
    (`testID="summary-skeleton"`).
  *Test: mismo archivo → `describe('R9: summary degrada con gracia', ...)`
  con fixtures ok completo / métricas null / 402 / error. ROJO primero.*

- **R10**: WHEN el detail resuelve `ok` AND `pet.device !== null` THE
  SYSTEM SHALL mostrar una card de última posición
  (`Pressable testID="last-position-card"`, texto `View on map`) que al
  pulsarse llama `router.push('/map')`; la card SHALL mostrar
  `testID="last-position-time"` con `Last seen ` + fecha local de
  `pet.lastCommunicationAt`, o `No location data yet` si es `null`. WHEN
  `pet.device === null` THE SYSTEM SHALL NOT renderizar esta card. (SIN
  mini-mapa: v1 enlaza al tab Map; mini-mapa es follow-up tras #36.)
  *Test: mismo archivo → `describe('R10: last position enlaza al mapa', ...)`
  mockeando `expo-router` (`router.push`). ROJO primero.*

### Tipado y contención

- **R11**: WHEN se ejecuta `bun run typecheck` en `mobile-pet-tracker/`
  tras los cambios THE SYSTEM SHALL salir con exit 0, AND `bun run lint`
  SHALL salir con exit 0.
  *Verificación: implementer ejecuta ambos y lo anota en
  `progress/impl_mobile-home-dashboard.md`; el reviewer los re-ejecuta.*

- **R12**: WHILE la feature #35 esté en curso THE SYSTEM SHALL NOT
  modificar archivos bajo `backend-pet-tracker/`, `infra/`,
  `init.config.sh` ni `.github/workflows/ci.yml`; WHEN se ejecuta
  `./init.sh` tras los cambios THE SYSTEM SHALL terminar con exit 0; AND la
  suite móvil completa (`bun run test` en `mobile-pet-tracker/`) SHALL
  quedar verde, incluidas las suites de #33/#34 (con el único diff
  permitido de la excepción C4).
  *Verificación: reviewer ejecuta `./init.sh`, `bun run test` y
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  (vacío). Además: `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/`
  sin resultados nuevos.*

### Prueba de humo del humano

- **R13**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL mostrar el Home real contra el backend local en Android
  físico. Pasos (misma WiFi, `.env` con IP LAN, backend arriba con
  `docker compose up -d` + `pnpm -C backend-pet-tracker run start:dev`;
  datos: al menos 2 mascotas — una con collar claimeado y una sin —
  creadas vía API o seeds existentes):

  1. Desde `mobile-pet-tracker/`: `bunx expo start --go` y escanear el QR.
  2. Login → Home muestra el selector con las mascotas reales y la primera
     seleccionada; foto (o fallback), nombre y raza correctos.
  3. Cambiar de mascota en el selector → card, collar y summary se
     recargan para la nueva.
  4. Mascota con collar: estado Online/Offline y batería coherentes con la
     DB; card `View on map` navega al tab Map.
  5. Mascota sin collar: estado `Free`, sin batería, sin card de posición,
     summary con la nota de collar (402).
  6. Sin datos de actividad del día: métricas en `—`, sin crash.
  7. Apagar el backend y pulsar Retry → error con gracia; reencender →
     Retry recupera.
  8. Verificar que el conjunto respeta el diseño minimalista (tokens de
     #32, tab bar flotante visible sin tapar contenido — scroll con
     padding inferior).

  - [X] Smoke ejecutado por el humano (fecha: 2026-08-21)

## Fuera de alcance

- Mini-mapa en el Home (v1 = card que enlaza al tab Map; follow-up tras #36).
- react-query / TanStack Query — reevaluación explícita en la spec de #36.
- Crear/editar/borrar mascotas desde la app (Home asume mascotas creadas
  vía API; UI de alta llegará con una feature propia).
- UI de `nextVaccine` / `nextReminder` / `weekComparison` (tendencias) —
  tab Health (#37) y pulido posterior; el Home v1 solo usa el día en curso.
- Persistir la mascota seleccionada entre sesiones (context en memoria; si
  molesta en el uso real, follow-up de una línea con storage).
- Pull-to-refresh y polling/live updates (Retry manual cubre v1).
- Refresh de token / re-login silencioso (401 → signOut es el contrato).
- Parsear `pet.lastPosition` (shape `unknown` del contrato; el tab Map #36
  consumirá positions con su propio contrato).
- Cambios a `backend-pet-tracker/`, `infra/`, `init.config.sh`, CI (R12).

## Decisiones pendientes de humano

- **D11 (codegen OpenAPI — reevaluación obligatoria de D10 de #33)**: el
  umbral "3+ dominios" se cruza aquí (health, auth, pets, activity).
  Default de esta spec: **tipos a mano una vez más** — el backend sigue sin
  publicar un documento OpenAPI (contratos en DTOs zod + mappers), así que
  el codegen exige primero una feature backend de generación/versionado del
  spec. Si el humano ratifica, se anota la feature backend de OpenAPI en el
  backlog y la próxima spec móvil que sume un dominio (previsiblemente #36)
  la consume; si la revierte, esta spec se reajusta antes del handoff.
- Decisiones menores objetables en este gate: selector como chips
  horizontales (no dropdown `Select`), summary con 3 métricas
  (activity/sleep/distance) tomadas del día en curso, textos en inglés
  (`Free`, `No pets yet`, etc.), card de posición oculta para mascota sin
  collar, y la regla `connectivity === 'online' ? Online : Offline` sin
  umbral de staleness (el pipeline no escribe `offline` hoy).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-21) ← gate obligatorio antes de implementar
