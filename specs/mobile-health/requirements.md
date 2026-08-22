---
feature: "mobile-health"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-health]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D10). Las capas de
> `docs/architecture.md` son de backend y NO aplican a esta app; sí aplican
> kebab-case, tests que nombran su R-id y conventional commits
> (`docs/conventions.md` §Convenciones de la app móvil).
> Contratos del backend verificados contra el código real el 2026-08-22
> (ver [[design]] §Contratos verificados).

## Contexto fijo (no reabrir)

- Base: estado tras #36 — Home y Map reales, `SelectedPetProvider` montado en
  `src/app/(tabs)/_layout.tsx`, `useApi` con stale-while-revalidate e
  `isRefreshing` (`src/hooks/use-api.ts`), clientes `fetchFn`/`kind` en
  `src/api/` (`http.ts` con `getJson`/`readJson`/`apiUrl`, `auth.ts`,
  `pets.ts`, `activity.ts`, `positions.ts`, `trips.ts`).
- **Cero dependencias nuevas.** `react-native-svg 15.15.4` (instalado desde
  #32) cubre la gráfica; `@gorhom/bottom-sheet` YA está en `package.json`
  (peer de HeroUI) pero **no se usa** ([[design]] §D1): el alta de peso vive
  inline en la pantalla WeightLog — un bottom sheet no aporta nada sobre una
  pantalla dedicada y añadiría mocking de gestos a los tests.
- La pantalla actual `src/app/(tabs)/health.tsx` es el **health-check del
  backend** (chip `health-state`, botón `health-retry`, toggle
  `theme-toggle` — R4 de #34 la mudó a `(tabs)` conservando URL). Esta
  feature la REEMPLAZA por el hub de salud. El health-check y el toggle de
  tema **se mudan a Profile** — no se eliminan: el toggle es el único
  control de tema de la app y el check es útil en cada smoke
  ([[design]] §D9; decisión razonada en el gate).
- Los endpoints de health (`/vaccines`, `/weights`) están detrás de
  `PetAccessGuard` **solamente** — NO hay `PetTrackingGuard`: la salud es
  free-tier, no existe el estado 402/`no-tracking` aquí (a diferencia de
  activity/positions/trips). `POST /weights` exige además rol `owner`
  (`RequirePetRole('owner')` → 403 para caregiver/viewer).
- 401 → `signOut()` ya lo maneja `useApi` (R4 de #35).
- Decisión de #33 (vigente): las funciones de `src/api/` reciben
  `token`/`fetchFn` por parámetro y nunca leen storage ni importan React.
- Lección de #34 (vigente): todo posicionamiento absoluto y offsets
  numéricos van por `style` inline; el resto con `className` + tokens.
- SIN react-query (umbral de adopción escrito en #36 §D2: primera mutación
  con invalidación compartida entre pantallas — `createWeight` invalida solo
  la lista de SU pantalla vía `refetch()`, no cruza el umbral).
- D11 de #35 sigue vigente: **tipos a mano** (el backend aún no publica
  OpenAPI).
- Smoke humano 100% **Expo Go** (`bunx expo start --go`), SDK 57, Android
  físico. Nada nativo nuevo.

## Excepción a C4 (cambios sobre código existente)

- `src/app/(tabs)/__tests__/health.test.tsx` se REESCRIBE para el hub
  (R4–R6, TDD nuevo). Sus casos actuales (estados del health-check y theme
  toggle, R7/R6 de #34) **se trasladan** a un nuevo
  `src/app/(tabs)/__tests__/profile.test.tsx` adaptando imports y testIDs
  renombrados (R10) — cobertura movida, no TDD nuevo; el reviewer lo cubre
  con `git diff` comparando los casos trasladados contra los originales.
- `src/app/(tabs)/profile.tsx` gana la sección relocated (R10); los casos
  de `screens.test.tsx` sobre Profile (placeholder + sign-out) NO se tocan
  y deben seguir verdes (el título `Profile` y `profile-sign-out` se
  conservan).

Todo lo demás (R1–R9) sigue TDD estricto con test rojo primero.

## Requisitos funcionales

### Cliente API (`src/api/health-records.ts`)

- **R1**: WHEN se llama `listVaccines(baseUrl, token, petId, fetchFn)` de
  `mobile-pet-tracker/src/api/health-records.ts` (nuevo; firma exacta en
  [[design]] §D4) THE SYSTEM SHALL hacer
  `GET ${baseUrl}/pets/${petId}/vaccines` (vía `getJson` de `http.ts`:
  mismo saneo de `/` y header `Authorization: Bearer ${token}`) y devolver
  un `VaccinesState`:
  - HTTP 200 con body array → `{ kind: 'ok', vaccines }` (`Vaccine[]`, §D3;
    el backend las devuelve en orden **descendente por `appliedAt`**);
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status (404 de `PetAccessGuard` incluido) / body no array →
    `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }` sin llamar a `fetchFn`.
  *Test: `mobile-pet-tracker/src/api/__tests__/health-records.test.ts` →
  `describe('R1: listVaccines mapea la respuesta por kind', ...)` con
  `fetchFn` stub por caso (mismo patrón que la suite de pets), asserts de
  URL exacta y header. ROJO primero.*

- **R2**: WHEN se llama `listWeights(baseUrl, token, petId, fetchFn, limit?)`
  del mismo archivo THE SYSTEM SHALL hacer
  `GET ${baseUrl}/pets/${petId}/weights` — con `?limit=${limit}` **solo** si
  `limit` viene definido (sin él, el backend aplica su default de 50; query
  estricta: no enviar params desconocidos) — y devolver un `WeightsState`:
  - HTTP 200 con body array → `{ kind: 'ok', weights }` (`WeightEntry[]`,
    §D3; orden **descendente por `measuredAt`** — la más reciente primero,
    cada entrada con `variation` vs la anterior ya calculada por el backend);
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no array → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  *Test: mismo archivo → `describe('R2: listWeights mapea la respuesta por kind', ...)`
  con asserts de URL sin query por default y con `?limit=1` cuando se pasa.
  ROJO primero.*

- **R3**: WHEN se llama
  `createWeight(baseUrl, token, petId, input, fetchFn)` del mismo archivo
  (input `{ weightKg: number; measuredAt: string; bodyCondition?: number }`)
  THE SYSTEM SHALL hacer `POST ${baseUrl}/pets/${petId}/weights` con body
  JSON del input (omitiendo `bodyCondition` si es undefined — el schema del
  backend es strict) vía el nuevo `postJson` de `http.ts` ([[design]] §D4) y
  devolver un `CreateWeightState`:
  - HTTP 201 con body objeto → `{ kind: 'ok', weight }` (`WeightEntry`, con
    `variation` calculada por el backend);
  - HTTP 400 → `{ kind: 'validation', errors }` (`FieldError[]` del body
    `errors`, mismo shape que ya usa `auth.ts`; body sin `errors` array →
    `[]`);
  - HTTP 403 (rol no-owner) → `{ kind: 'forbidden' }`;
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no parseable → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  AND THE SYSTEM SHALL NOT importar `expo-secure-store` ni React en ningún
  archivo bajo `src/api/` (regla de #33; reviewer grep).
  *Test: mismo archivo → `describe('R3: createWeight publica y mapea por kind', ...)`
  con asserts de method POST, header `Content-Type: application/json`,
  `Authorization` y body serializado (con y sin `bodyCondition`). ROJO
  primero.*

### Pantalla Health (`src/app/(tabs)/health.tsx`, reescrita como hub)

- **R4**: WHEN Health monta con sesión activa THE SYSTEM SHALL renderizar
  el hub (`testID="screen-health"`, título `Health`) y resolver la mascota:
  carga `listPets` vía `useApi` y aplica la misma selección por defecto que
  Home/Map (IF `selectedPetId` es `null` o no está en la lista THEN
  `selectPet(pets[0].id)`), renderizando el selector de chips
  (`testID="pet-chip-<id>"`, seleccionada con
  `accessibilityState={{ selected: true }}`; mismo patrón que Home R6):
  - WHILE pets vuela SHALL mostrar `testID="health-loading"` (Spinner);
  - IF pets resuelve `ok` con lista vacía THEN SHALL mostrar `No pets yet`
    (`testID="health-empty"`);
  - IF pets resuelve `error | unreachable | missing-config` THEN SHALL
    mostrar `Something went wrong` (`testID="health-error"`) con `Button`
    `Retry` (`testID="health-retry"`) que llama `refetch`.
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx`
  (reescrito) → `describe('R4: health resuelve la mascota seleccionada', ...)`
  mockeando `../../../api/pets`, `../../../api/health-records` y
  `../../../providers/auth-provider`; `SelectedPetProvider` real como
  wrapper y `useApi` real (misma línea que #35 D10). ROJO primero.*

- **R5**: WHEN `listVaccines` de la mascota seleccionada (vía `useApi`)
  resuelve THE SYSTEM SHALL mostrar la sección Vaccines
  (`testID="vaccines-section"`, título `Vaccines`):
  - IF `kind === 'ok'` y hay vacunas con `nextDoseAt !== null` y
    `nextDoseAt >= hoy` (fecha local del dispositivo, [[design]] §D6) THEN
    SHALL destacar la de **menor** `nextDoseAt` en una card
    (`testID="next-vaccine-card"`, label `Next due`, con `name` y
    `nextDoseAt`); IF ninguna cumple THEN SHALL no renderizar la card;
  - IF `kind === 'ok'` THEN SHALL listar todas las vacunas en el orden
    recibido (descendente por `appliedAt`): fila
    `testID="vaccine-row-<id>"` con `name`, `appliedAt` y — si existe —
    `nextDoseAt`; IF `nextDoseAt < hoy` THEN esa fecha se pinta con
    `text-danger` (vencida);
  - IF `kind === 'ok'` con lista vacía THEN SHALL mostrar `No vaccines yet`
    (`testID="vaccines-empty"`);
  - IF `kind === 'error' | 'unreachable'` THEN SHALL mostrar
    `Could not load vaccines` (`testID="vaccines-error"`) con `Retry`
    (`testID="vaccines-retry"`) que llama su `refetch`;
  - WHILE la carga vuela SHALL mostrar `Skeleton`
    (`testID="vaccines-skeleton"`).
  *Test: mismo archivo → `describe('R5: vacunas con la próxima destacada', ...)`
  con fixtures: dos futuras (destaca la menor), solo pasadas/null (sin
  card), una vencida (text-danger via props), vacía, error. ROJO primero.*

- **R6**: WHEN `listWeights` (con `limit: 1`) de la mascota seleccionada
  resuelve THE SYSTEM SHALL mostrar la card Weight
  (`testID="weight-card"`, título `Weight`):
  - IF `kind === 'ok'` con al menos una entrada THEN SHALL mostrar
    `testID="weight-current"` = `${weightKg} kg` y
    `testID="weight-variation"` = variación formateada ([[design]] §D5:
    `+0.4 kg` / `-0.2 kg` / `—` si `null`);
  - IF `kind === 'ok'` vacío THEN SHALL mostrar `No weight entries yet`
    (`testID="weight-card-empty"`);
  - IF `kind === 'error' | 'unreachable'` THEN SHALL mostrar
    `Could not load weight` (`testID="weight-card-error"`);
  - en todos los casos con mascota seleccionada SHALL mostrar el
    `Pressable testID="weight-log-link"` (texto `Weight log`) que al
    pulsarse llama `router.push('/weight-log')`.
  *Test: mismo archivo → `describe('R6: weight card enlaza al log', ...)`
  mockeando `expo-router` (`router.push`). ROJO primero.*

### Pantalla WeightLog (`src/app/(tabs)/weight-log.tsx`, nueva ruta oculta)

- **R7**: WHEN WeightLog monta (`testID="screen-weight-log"`, título
  `Weight log`, botón `testID="weight-log-back"` que llama `router.back()`)
  AND hay `selectedPetId` THE SYSTEM SHALL cargar `listWeights` (sin
  `limit`) vía `useApi`:
  - IF `kind === 'ok'` THEN SHALL listar cada entrada en el orden recibido
    (descendente): fila `testID="weight-row-<id>"` con `${weightKg} kg`,
    `measuredAt`, la variación formateada (§D5) y — si existe —
    `BC ${bodyCondition}/9`;
  - IF `kind === 'ok'` vacío THEN SHALL mostrar `No weight entries yet`
    (`testID="weight-log-empty"`);
  - IF `kind === 'error' | 'unreachable' | 'missing-config'` THEN SHALL
    mostrar `Something went wrong` (`testID="weight-log-error"`) con
    `Retry` (`testID="weight-log-retry"`);
  - WHILE la carga vuela SHALL mostrar `testID="weight-log-loading"`;
  - IF `selectedPetId === null` THEN SHALL renderizar `<Redirect
    href="/health" />` (solo se llega aquí desde Health, que garantiza
    selección; el redirect cubre el deep-link frío).
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/weight-log.test.tsx` →
  `describe('R7: weight log lista el historial', ...)` mockeando
  `../../../api/health-records`, `../../../providers/auth-provider` y
  `expo-router`; `SelectedPetProvider` real como wrapper (seleccionando un
  pet en el setup vía un componente sonda o wrapper con selección inicial,
  [[design]] §D10). ROJO primero.*

- **R8**: WHEN el componente `WeightChart` (nuevo,
  `mobile-pet-tracker/src/components/weight-chart.tsx`, contrato en
  [[design]] §D8) recibe `entries` con **2 o más** puntos THE SYSTEM SHALL
  renderizar una `Polyline` de `react-native-svg`
  (`testID="weight-chart"`) con un par de coordenadas por entrada, en orden
  **ascendente** por `measuredAt` (el componente invierte el orden desc
  recibido), x equiespaciado y y normalizado entre el mínimo y el máximo de
  `weightKg` (§D8; todos los pesos iguales → línea horizontal centrada, sin
  división por cero); IF recibe menos de 2 puntos THEN THE SYSTEM SHALL
  renderizar en su lugar el texto `Not enough data yet`
  (`testID="weight-chart-empty"`) sin ningún elemento SVG. AND WeightLog
  SHALL renderizar `WeightChart` con las entradas cargadas cuando la lista
  está en `ok`.
  *Test: `mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx`
  → `describe('R8: la gráfica degrada con <2 puntos', ...)` con mock de
  `react-native-svg` (stubs `View` que propagan props, mismo patrón que el
  mock de react-native-maps en #36) y asserts sobre el prop `points`
  (número de pares, orden ascendente, y=constante con pesos iguales);
  0 y 1 puntos → `weight-chart-empty`. El montaje en WeightLog se asserta
  en `weight-log.test.tsx`. ROJO primero.*

- **R9**: WHILE WeightLog muestra la lista (`ok`, vacía o no) THE SYSTEM
  SHALL mostrar el formulario de alta inline (§D7): `Input`
  `testID="weight-input"` (decimal), `Input` `testID="weight-date-input"`
  (prefilled con la fecha local de hoy `YYYY-MM-DD`, editable como texto) e
  `Input` `testID="weight-bc-input"` (opcional, 1–9). WHEN se pulsa
  `Button testID="weight-submit"`:
  - IF el peso no parsea a número THEN SHALL mostrar `Enter a valid weight`
    (`testID="weight-form-error"`) sin llamar a la API;
  - ELSE SHALL llamar `createWeight` con `{ weightKg, measuredAt,
    bodyCondition }` (`bodyCondition` solo si el campo no está vacío) y,
    según el `kind`:
    - `ok` → limpiar peso y body condition, resetear la fecha a hoy,
      limpiar el error y llamar `refetch()` de la lista (la gráfica y las
      filas se actualizan);
    - `validation` → mostrar los `errors[].message` unidos por salto de
      línea en `weight-form-error` (mismo patrón que login);
    - `forbidden` → `Only the owner can log weights`;
    - `error | missing-config` → `Something went wrong`;
    - `unreachable` → `Cannot reach server`;
  - WHILE el POST vuela el botón SHALL estar deshabilitado.
  *Test: mismo archivo `weight-log.test.tsx` →
  `describe('R9: alta de peso con degradación por kind', ...)` con
  `createWeight` mockeado por caso; assert de que `ok` dispara un nuevo
  `listWeights` y de que el peso inválido no llama a `createWeight`. ROJO
  primero.*

### Reubicación del health-check (Profile)

- **R10**: WHEN Profile monta THE SYSTEM SHALL mostrar — además del título
  y `profile-sign-out` existentes, que no cambian — la sección `App`
  con: el toggle de tema (`testID="theme-toggle"`, mismo comportamiento
  Uniwind que hoy), el chip de salud del backend
  (`testID="backend-health-state"`, mismos estados/clases que el actual
  `health-state`) y su botón de recheck (`testID="backend-health-retry"`),
  usando `fetchHealth` de `src/api/health.ts` sin cambios. AND
  `src/app/(tabs)/health.tsx` SHALL dejar de importar `fetchHealth` y de
  renderizar `health-state`/`health-retry`/`theme-toggle` (el hub R4–R6 los
  reemplaza). Los testIDs históricos `health-state`/`health-retry` se
  renombran con prefijo `backend-` al mudarse (decisión razonada:
  `health-*` pasa a pertenecer al hub; el rename queda documentado aquí y
  en el diff).
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/profile.test.tsx`
  (nuevo) → casos trasladados de `health.test.tsx` (estados por kind,
  recheck, toggle) adaptados a Profile y los nuevos testIDs — excepción C4
  (cobertura movida); más un assert de que `profile-sign-out` sigue
  presente. Los casos de Profile en `screens.test.tsx` quedan intactos y
  verdes.*

### Tipado y contención

- **R11**: WHEN se ejecuta `bun run typecheck` en `mobile-pet-tracker/`
  tras los cambios THE SYSTEM SHALL salir con exit 0, AND `bun run lint`
  SHALL salir con exit 0.
  *Verificación: implementer ejecuta ambos y lo anota en
  `progress/impl_mobile-health.md`; el reviewer los re-ejecuta.*

- **R12**: WHILE la feature #37 esté en curso THE SYSTEM SHALL NOT
  modificar archivos bajo `backend-pet-tracker/`, `infra/`,
  `init.config.sh` ni `.github/workflows/ci.yml`; WHEN se ejecuta
  `./init.sh` tras los cambios THE SYSTEM SHALL terminar con exit 0; AND la
  suite móvil completa (`bun run test` en `mobile-pet-tracker/`) SHALL
  quedar verde, incluidas las suites de #33–#36 (únicos diffs permitidos:
  la excepción C4 de esta spec — reescritura de `health.test.tsx` y el
  traslado a `profile.test.tsx`).
  *Verificación: reviewer ejecuta `./init.sh`, `bun run test` y
  `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/`
  (vacío). Además: `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/`
  sin resultados nuevos.*

### Prueba de humo del humano

- **R13**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL mostrar el hub de salud real contra el backend local en
  Android físico. Preparación (misma WiFi, `.env` con IP LAN, backend
  arriba con `docker compose up -d` +
  `pnpm -C backend-pet-tracker run start:dev`):

  0. Datos: `pnpm -C backend-pet-tracker run seed:vaccines` (siembra el
     catálogo) y crear 2–3 vacunas de una mascota vía API — al menos una
     con `nextDoseAt` futura y una vencida, p. ej.:
     `curl -X POST http://<IP>:3000/v1/pets/<petId>/vaccines -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"name":"Rabies","appliedAt":"2026-08-01","nextDoseAt":"2027-08-01"}'`
  1. Desde `mobile-pet-tracker/`: `bunx expo start --go` y escanear el QR.
  2. Login → tab Health: selector de mascotas, lista de vacunas real con la
     próxima destacada (`Next due`) y la vencida en rojo.
  3. Card Weight → `Weight log`: con 0 pesos, lista vacía y
     `Not enough data yet` en la gráfica.
  4. Registrar un peso (hoy) → aparece en la lista; la gráfica sigue en
     `Not enough data yet` (1 punto).
  5. Registrar un segundo peso con fecha anterior y otro valor → la
     polyline aparece; la variación de la fila más reciente es coherente.
  6. Peso inválido (texto) y fecha futura (+2 días) → errores con gracia,
     sin crash (el segundo viene del 400 del backend).
  7. Volver a Health → la card Weight muestra el último peso y variación.
  8. Cambiar de mascota en el selector → vacunas y peso se recargan.
  9. Profile: chip de backend health + Retry + toggle de tema funcionan
     como antes de la mudanza; apagar el backend y ver el chip degradar.
  10. Tab bar flotante visible sin tapar contenido (scroll con padding
      inferior) en Health y WeightLog.

  - [ ] Smoke ejecutado por el humano (fecha: ____)

## Fuera de alcance

- **Alta/edición/borrado de vacunas desde la app** — feature_list define
  "vacunas (lista, próximas)": solo lectura. Por eso tampoco se crea
  cliente del catálogo (`GET /v1/vaccine-catalog` solo sirve para el alta).
  Feature móvil futura.
- Subir/ver documento de vacuna (`documentKey` se ignora en la UI).
- Editar/borrar pesos (el backend no expone PATCH/DELETE de weights).
- @gorhom/bottom-sheet: instalado como peer pero sin uso en esta feature.
- Ejes, labels, tooltips o librería de charts; x proporcional a fechas
  (v1 equiespacia los puntos, §D8).
- Date picker nativo (`@react-native-community/datetimepicker` no está
  instalado; input de texto `YYYY-MM-DD` con validación del backend).
- Paginación de pesos (>50) o selector de rango de la gráfica.
- Extraer el patrón de selección por defecto (3ª duplicación consciente,
  [[design]] §D5): el refactor de home/map/health a un hook común es un
  follow-up dedicado, no parte de esta feature.
- Pull-to-refresh y polling (Retry manual cubre v1, como Home).
- UI de `nextVaccine` del pet detail en Home (sigue sin pintarse ahí).
- Cambios a `backend-pet-tracker/`, `infra/`, `init.config.sh`, CI (R12).

## Decisiones pendientes de humano (este gate)

- **D9 — destino del health-check del backend**: se muda a Profile (con el
  toggle de tema) renombrando los testIDs a `backend-health-*`.
  Alternativas: eliminarlo (pierde el único control de tema y una
  herramienta de smoke) o una pantalla de settings nueva (una ruta para dos
  controles). Si el humano prefiere otra, se reajusta antes del handoff.
- **D1 — sin bottom-sheet**: alta de peso inline en la pantalla WeightLog
  dedicada; `@gorhom/bottom-sheet` queda instalado pero sin uso.
- **D6 — "próxima vacuna" derivada en el cliente** desde la lista (menor
  `nextDoseAt >= hoy` local), en vez de una llamada extra a `getPet` por el
  `nextVaccine` del backend.
- **D5 — 3ª duplicación** del patrón de selección por defecto (#36 D6
  prometía extraer al tercer uso; se difiere a un follow-up que toque las
  tres tabs juntas para no reabrir home/map estables en esta feature).
- Menores objetables: fecha como input de texto `YYYY-MM-DD` (sin picker),
  `bodyCondition` como input numérico opcional (no chips 1–9), gráfica
  equiespaciada en x, `limit=1` para la card Weight del hub, textos en
  inglés, vencidas en `text-danger` sin badge.

## Aprobación

- [X] Aprobado por humano (fecha: 22-08-22) ← gate obligatorio antes de implementar
