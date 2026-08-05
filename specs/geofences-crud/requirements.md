---
feature: "geofences-crud"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[geofences-crud]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 11 (description + acceptance_criteria),
> `docs/data-model.md` (fila `geofences`: `geometry` jsonb, `geofence_state`
> jsonb), plan 007 pasos 1-2 (referenciado en la description de la feature).
>
> Depende de (todo `done`, se reutiliza tal cual, **no se redefine**):
> - `pets-crud-permissions` (#5): `PetAccessGuard` + `@RequirePetRole()`
>   exportados por `PetsModule` — mismo patrón de reutilización que
>   `pet-device.controller.ts` de #7 (controller con `:petId`, guard a nivel
>   de clase). Esta feature **no** inyecta `PET_REPOSITORY`: el `petId` ya
>   validado llega vía `request.petMembership`, y `geofences.pet_id` es su
>   propia FK — no hace falta consultar `pets` de nuevo.
> - `auth-registration` (#3): el puerto `AuditLogger` / token `AUDIT_LOGGER`
>   (`src/audit/`, módulo `@Global()`) ya existe: cero migraciones nuevas
>   para `audit_log`.
> - `wialon-ingestion-pipeline` (#8) / `trips-activity` (#10): `src/pipeline/`
>   — `haversineMeters` (`geo.ts`), `FLAG_LOW_ACCURACY` (`constants.ts`, cuyo
>   propio encabezado ya declara ser la fuente única de umbrales para "#11
>   geocercas") — se reutilizan, no se reimplementan.
>
> Endpoints cubiertos: `POST /v1/pets/:petId/geofences`,
> `GET /v1/pets/:petId/geofences`, `GET /v1/pets/:petId/geofences/:geofenceId`,
> `PATCH /v1/pets/:petId/geofences/:geofenceId`,
> `DELETE /v1/pets/:petId/geofences/:geofenceId`. Ninguno es `@Public()`.
>
> Qué NO entrega esta feature: ningún caso de uso propio llama a `evaluate()`.
> La integración real (worker que consume `position.updated`, evalúa cada
> geocerca, persiste el resultado en `geofence_state` y abre/cierra
> `alert_events`) es `alerts-engine` (#12, siguiente feature). Aquí se
> entregan el CRUD y las funciones puras `isInside`/`evaluate` con su suite
> de tests — probadas de forma aislada, sin conectar a ningún consumidor.

## Requisitos funcionales

### Persistencia (schema y migración)

- **R1**: WHEN se ejecutan las migraciones Drizzle sobre una base al día, THE
  SYSTEM SHALL crear la tabla `geofences` conforme a `docs/data-model.md`
  (con las clarificaciones de **D5**): `id` uuid PK (UUIDv7 generado en app),
  `pet_id` FK → `pets.id` ON DELETE CASCADE NOT NULL, `name` varchar(120) NOT
  NULL, `type` varchar(20) NOT NULL DEFAULT `'safe_circle'` con CHECK en
  `('safe_circle')` — únicamente el valor que el CRUD de esta feature puede
  producir (**D1**; se amplía con `ALTER TABLE` cuando una feature futura
  implemente más tipos), `geometry` jsonb NOT NULL, `active` boolean NOT NULL
  DEFAULT `true`, `geofence_state` jsonb NOT NULL DEFAULT
  `{"state":"unknown","updatedAt":null}` (**D2**), `created_at` / `updated_at`
  timestamptz NOT NULL DEFAULT `now()`. Índices: btree sobre `pet_id` (regla
  "toda FK lleva índice" de `docs/data-model.md`; sirve además al conteo de
  R6 y al listado de R8) y único sobre `(pet_id, name)` (**D5**, sirve a R7).
  La migración generada SHALL NOT crear ni modificar ninguna otra tabla.
  Verificable inspeccionando el SQL de la migración nueva en
  `src/db/migrations/`.

### Autorización (aplica a las cinco rutas de este módulo)

- **R2**: IF `:petId` no existe, no es un UUID sintácticamente válido, o el
  usuario autenticado no tiene fila en `pet_users` con `status = 'active'`,
  THEN THE SYSTEM SHALL, para cualquiera de las cinco rutas
  (`POST`/`GET /v1/pets/:petId/geofences`,
  `GET`/`PATCH`/`DELETE /v1/pets/:petId/geofences/:geofenceId`), responder
  `404` con el body genérico del `PetAccessGuard` existente (#5), aplicado a
  nivel de controller (**D4**) — sin consultar la tabla `geofences`. Test
  e2e obligatorio: usuario B sobre mascota de A → `404` en las cinco rutas
  (criterio de aceptación literal "mascota ajena → 404").

- **R3**: IF el usuario autenticado tiene membresía activa sobre la mascota
  pero su `role` no es `'owner'`, Y la ruta es `POST`, `PATCH` o `DELETE`,
  THEN THE SYSTEM SHALL responder `403` sin escribir en `geofences` — el
  `404` de R2 precede siempre a este `403` (mismo orden que R5/R6 de
  devices-claim). `GET` (list y detail) SHALL NOT llevar `@RequirePetRole`:
  cualquier rol con membresía activa (`owner`, `family`, `walker`, `vet`)
  lee (**D4**).

### Crear geocerca

- **R4**: WHEN un usuario con `role = 'owner'` envía
  `POST /v1/pets/:petId/geofences` con un body válido (R5) — `name`,
  `type: 'safe_circle'`, `centerLat`, `centerLng`, `radiusM` y opcionalmente
  `active` (default `true`) —, THE SYSTEM SHALL insertar la fila con
  `geofence_state = {state: 'unknown', updatedAt: null}` (**D2**, un único
  INSERT, sin necesidad de transacción multi-tabla), registrar vía
  `AuditLogger` una entrada `action = 'geofence.create'`,
  `entity = 'geofence'`, `entityId` = id de la geocerca, `meta = {petId}`, y
  responder `201` con el objeto completo (shape de R9). IF el INSERT falla
  THEN no se audita nada.

- **R5**: IF el body de `POST /v1/pets/:petId/geofences` no valida contra el
  schema zod — `name` ausente, vacío o > 120 caracteres; `type` distinto de
  `'safe_circle'` (incluye `'safe_polygon'`: **D1** fija que el CRUD MVP
  solo acepta círculo, cualquier otro valor de `type` es un dato inválido
  más, sin código de error dedicado); `centerLat` fuera de `[-90, 90]`;
  `centerLng` fuera de `[-180, 180]`; `radiusM` fuera de `[20, 2000]`; o el
  body incluye una clave desconocida (`z.strictObject`, mismo criterio que
  R17 de trips-activity) — THEN THE SYSTEM SHALL responder `400` con el
  detalle mapeado desde `ZodError` (mismo shape que `pets.controller.ts`),
  sin escribir en `geofences`. Verificable (criterio de aceptación literal):
  `radiusM: 10` → `400`.

- **R6**: IF la mascota ya tiene `GEOFENCE_MAX_PER_PET` (5) filas en
  `geofences` — activas e inactivas por igual (**D5**: `active` no libera
  cupo) — THEN THE SYSTEM SHALL responder `400` con código
  `MAX_GEOFENCES_REACHED`, sin escribir en `geofences` (código literal del
  criterio de aceptación: "sexta geocerca → 400", no `409`, pese a ser
  semánticamente un conflicto con el estado existente). Verificable: crear 5
  geocercas válidas y una sexta → `400`.

- **R7**: IF ya existe una geocerca con el mismo `name` para la misma
  mascota (índice único `(pet_id, name)` de R1) THEN THE SYSTEM SHALL
  responder `409` con código `GEOFENCE_NAME_TAKEN`, sin escribir en
  `geofences` — mismo criterio que `EmailAlreadyRegisteredError`/
  `DeviceAlreadyAssignedError` (conflicto de unicidad es `409`). La
  comparación es sensible a mayúsculas/minúsculas (sin `citext`,
  simplificación aceptada). WHILE dos creaciones con el mismo nombre
  compiten concurrentemente, THE SYSTEM SHALL garantizar que a lo sumo una
  responde `201`: el índice único de R1 rechaza el segundo INSERT (`23505`)
  y esa violación se mapea al mismo `409`.

### Leer geocercas

- **R8**: WHEN un miembro activo envía `GET /v1/pets/:petId/geofences`, THE
  SYSTEM SHALL responder `200` con un array de todas las geocercas de la
  mascota (activas e inactivas), en el shape de R9, ordenadas por
  `created_at` ascendente. IF la mascota no tiene geocercas THEN SHALL
  responder `200` con `[]`, nunca `404` (regla "ausencia de dato es 200"
  heredada de #5/#7/#9/#10).

- **R9**: WHEN un miembro activo envía
  `GET /v1/pets/:petId/geofences/:geofenceId`, THE SYSTEM SHALL responder
  `200` con un objeto de exactamente estas claves: `id`, `petId`, `name`,
  `type`, `centerLat`, `centerLng`, `radiusM`, `active`, `state`
  (`{value, updatedAt}`, reflejo directo de `geofence_state`, **D2**),
  `createdAt`, `updatedAt`. IF `:geofenceId` no existe, no es un UUID
  sintácticamente válido, o existe pero pertenece a una mascota distinta de
  `:petId` (aislamiento entre mascotas del mismo usuario: el owner de las
  mascotas A y B no debe ver una geocerca de B al consultar A) THEN THE
  SYSTEM SHALL responder `404` con código `GEOFENCE_NOT_FOUND`.

### Actualizar geocerca

- **R10**: WHEN un usuario con `role = 'owner'` envía
  `PATCH /v1/pets/:petId/geofences/:geofenceId` con un body válido que
  incluye al menos un campo entre `name`, `centerLat`, `centerLng`,
  `radiusM`, `active` (mismos límites que R5; `type` no es aceptado —
  `z.strictObject` lo rechaza como clave desconocida, ver R11), THE SYSTEM
  SHALL actualizar solo las claves presentes, refrescar `updated_at`,
  registrar `action = 'geofence.update'` con
  `meta = {petId, fields: [...nombres presentes]}` (nunca los valores —
  mismo criterio que `update-pet.use-case.ts`), y responder `200` con el
  objeto completo de R9.

- **R11**: IF el body de PATCH no valida contra el mismo schema de R5 (radio
  fuera de `[20, 2000]`, coordenadas fuera de rango, `name` vacío o > 120,
  clave desconocida incluyendo `type`) THEN THE SYSTEM SHALL responder
  `400`, sin escribir en `geofences`.

- **R12**: IF `:geofenceId` no existe, no es un UUID sintácticamente válido,
  o pertenece a otra mascota THEN THE SYSTEM SHALL responder `404` con
  código `GEOFENCE_NOT_FOUND`, mismo criterio que R9.

- **R13**: IF el body de PATCH no trae ninguna clave reconocida (`{}` u
  objeto sin las cinco claves de R10) THEN THE SYSTEM SHALL tratarlo como
  no-op: SHALL NOT escribir en `geofences` ni auditar, y SHALL responder
  `200` con el objeto sin cambios (mismo patrón que R15 de
  pets-crud-permissions) — IF además la geocerca no existe THEN el `404` de
  R12 precede al no-op.

### Borrar geocerca

- **R14**: WHEN un usuario con `role = 'owner'` envía
  `DELETE /v1/pets/:petId/geofences/:geofenceId` sobre una geocerca
  existente de esa mascota, THE SYSTEM SHALL borrar la fila (hard delete:
  nada referencia todavía a `geofences`, no hay cascada que disparar),
  registrar `action = 'geofence.delete'` con `meta = {petId}`, y responder
  `204` sin body.

- **R15**: IF `:geofenceId` no existe, no es un UUID sintácticamente válido,
  o pertenece a otra mascota THEN THE SYSTEM SHALL responder `404` con
  código `GEOFENCE_NOT_FOUND`, sin auditar.

### Evaluación pura — `isInside` (`src/pipeline/geofence-eval.ts`)

- **R16**: WHEN se invoca `isInside(geometry, point)` con
  `geometry.shape === 'circle'` (`{shape: 'circle', centerLat, centerLng,
  radiusM}`), THE SYSTEM SHALL devolver `true` IF
  `haversineMeters(geometry.centerLat, geometry.centerLng, point.lat,
  point.lng) <= geometry.radiusM`, `false` en caso contrario — reutiliza
  `haversineMeters` de `./geo`, sin reimplementarla. Verificable: punto en
  el centro exacto → `true`; punto a `radiusM + 1` m → `false`; punto a
  exactamente `radiusM` m → `true` (borde inclusive).

- **R17**: WHEN se invoca `isInside(geometry, point)` con
  `geometry.shape === 'polygon'` (`{shape: 'polygon', points:
  {lat, lng}[]}`, ≥ 3 puntos), THE SYSTEM SHALL determinar la pertenencia
  con el algoritmo de ray-casting (crossing number, regla par-impar) sobre
  el polígono definido por `points` en orden. Verificable (criterio de
  aceptación literal "polígono dentro/fuera"): un punto claramente dentro de
  un polígono simple (ej. un cuadrado) → `true`; un punto claramente fuera →
  `false`. Los casos de borde exacto (punto sobre una arista o vértice)
  quedan sin comportamiento garantizado: ningún CRUD produce todavía
  geocercas de polígono (**D1**), así que no hay caso real que los ejercite.

### Evaluación pura — `evaluate` (máquina de estados con histéresis)

- **R18**: WHEN se invoca `evaluate(previous, geometry, position, nowMs)`
  con `previous.state === 'unknown'` y `position.flags` sin
  `FLAG_LOW_ACCURACY`, THE SYSTEM SHALL calcular
  `inside = isInside(geometry, position)` (sin margen de histéresis) y
  devolver `{state: {state: inside ? 'inside' : 'outside', updatedAt: new
  Date(nowMs).toISOString()}, event: null}` — la primera evaluación nunca
  emite `enter`/`exit` (criterio de aceptación literal "unknown inicial
  silencioso"). Verificable: geocerca recién creada (estado `unknown`)
  evaluada con una posición claramente dentro → estado pasa a `inside`,
  `event: null`; con una posición claramente fuera → estado pasa a
  `outside`, `event: null`.

- **R19**: WHEN se invoca `evaluate` con `previous.state === 'inside'`,
  `geometry.shape === 'circle'` y `position.flags` sin `FLAG_LOW_ACCURACY`,
  THE SYSTEM SHALL calcular
  `distanceM = haversineMeters(geometry.centerLat, geometry.centerLng,
  position.lat, position.lng)` y devolver
  `{state: {state: 'outside', updatedAt: ...}, event: 'exit'}` IF
  `distanceM >= geometry.radiusM * GEOFENCE_EXIT_RADIUS_MULTIPLIER` (1.1,
  `pipeline/constants.ts`) AND (`position.accuracyM === undefined` OR
  `position.accuracyM <= GEOFENCE_EXIT_MAX_ACCURACY_M`) (50 m, mismo
  archivo) — criterio de aceptación literal "dentro→fuera emite exit".
  Verificable: geocerca de radio 100 m, posición a 115 m del centro con
  `accuracyM = 10` → `event: 'exit'`, nuevo estado `outside`.

- **R20**: IF, en las mismas condiciones de R19,
  `distanceM < geometry.radiusM * GEOFENCE_EXIT_RADIUS_MULTIPLIER` (ej.
  `distanceM = radiusM * 1.05`) THEN THE SYSTEM SHALL devolver
  `{state: {state: 'inside', updatedAt: ...}, event: null}` — no dispara
  (criterio de aceptación literal "borde radio×1.05 no dispara").
  Verificable: geocerca de radio 100 m, posición a 105 m con
  `accuracyM = 10` → `event: null`, estado sigue `inside`.

- **R21**: IF, en las mismas condiciones de R19,
  `distanceM >= geometry.radiusM * GEOFENCE_EXIT_RADIUS_MULTIPLIER` PERO
  `position.accuracyM` es un número `> GEOFENCE_EXIT_MAX_ACCURACY_M` (50) —
  con o sin el flag `FLAG_LOW_ACCURACY`, que solo se marca sobre 100 m
  (R22) — THEN THE SYSTEM SHALL devolver
  `{state: {state: 'inside', updatedAt: ...}, event: null}`: el `exit`
  exige la accuracy más estricta de R19, no basta con no estar
  `low_accuracy`. Verificable: geocerca de radio 100 m, posición a 115 m con
  `accuracyM = 70` (no flagged `low_accuracy`: por debajo de 100 m) →
  `event: null`, estado sigue `inside`.

- **R22**: IF `position.flags` incluye `FLAG_LOW_ACCURACY` (constante
  existente de `pipeline/constants.ts`, nunca el literal `'low_accuracy'`)
  THEN THE SYSTEM SHALL devolver `{state: previous, event: null}` sin
  evaluar `isInside` ni la distancia — el objeto `state` completo (incluido
  `updatedAt`) sale idéntico al `previous` recibido, para cualquier
  `previous.state` (`unknown`, `inside` u `outside`) y con independencia de
  dónde esté realmente la posición (criterio de aceptación literal
  "low_accuracy ignorado"). Verificable: estado previo `inside`, posición a
  500 m del centro (claramente fuera) pero con `flags: ['low_accuracy']` →
  `state` devuelto es exactamente `previous` (mismo `updatedAt`),
  `event: null`.

- **R23**: WHEN se invoca `evaluate` con `previous.state === 'outside'` y
  `position.flags` sin `FLAG_LOW_ACCURACY`, IF
  `distanceM > geometry.radiusM * GEOFENCE_ENTER_RADIUS_MULTIPLIER` (0.9)
  THEN THE SYSTEM SHALL devolver
  `{state: {state: 'outside', updatedAt: ...}, event: null}` — no reemite
  `exit` ni ningún otro evento mientras la mascota sigue fuera (criterio de
  aceptación literal "fuera→fuera no re-emite"). Verificable: dos llamadas
  consecutivas con `previous.state = 'outside'` y la misma posición lejana
  → ambas devuelven `event: null`.

- **R24**: WHEN se invoca `evaluate` con `previous.state === 'outside'` y
  `position.flags` sin `FLAG_LOW_ACCURACY`, THE SYSTEM SHALL emitir
  `{state: {state: 'inside', updatedAt: ...}, event: 'enter'}` IF
  `distanceM <= geometry.radiusM * GEOFENCE_ENTER_RADIUS_MULTIPLIER` (0.9) —
  sin condición adicional de accuracy (asimetría deliberada con R19,
  **D3**). Verificable: geocerca de radio 100 m, posición a 85 m del centro
  → `event: 'enter'`, nuevo estado `inside`.

### Pureza y determinismo

- **R25**: `src/pipeline/geofence-eval.ts` SHALL NOT importar nada de
  `@nestjs/*`, `@aws-sdk/*`, `drizzle-orm`, `zod` ni `src/modules/**` —
  únicamente `./geo`, `./constants` y opcionalmente `./types` (pureza
  verificable por inspección de imports, misma regla que `trips.ts`/
  `activity.ts`, criterio de aceptación literal "sin I/O"). `evaluate` SHALL
  NOT leer el reloj del sistema (`Date.now()`, `new Date()` sin argumento):
  `nowMs` llega siempre del caller — condición de determinismo, dos
  invocaciones con el mismo input SHALL devolver el mismo output.

### Transversales

- **R26** (no regresión): WHEN se implementa esta feature, THE SYSTEM SHALL
  generar exactamente una migración (R1) y SHALL NOT modificar ningún
  archivo fuera de esta lista: `src/pipeline/geofence-eval.ts` (+
  `.spec.ts`); `src/pipeline/constants.ts` **solo añadiendo**
  `GEOFENCE_EXIT_RADIUS_MULTIPLIER`, `GEOFENCE_ENTER_RADIUS_MULTIPLIER` y
  `GEOFENCE_EXIT_MAX_ACCURACY_M` (los cinco exports existentes conservan
  nombre y valor); `src/modules/geofences/**` (módulo nuevo);
  `src/db/schema/geofences.schema.ts` más **una línea** de re-export en
  `src/db/schema/index.ts`; `src/db/migrations/0006_*` y su `meta/`; **una
  línea** de import en `src/app.module.ts`; `test/geofences.e2e-spec.ts`;
  `docs/data-model.md` (afinar la fila `geofences` con el shape real de
  R1/D1/D2); `docs/wialon-module.md` (añadir los tres umbrales de R19/R24 a
  su tabla de constantes); `specs/geofences-crud/**`; `progress/**`; y
  `feature_list.json` (bookkeeping de estado). THE SYSTEM SHALL NOT tocar
  `src/modules/pets/**`, `src/modules/devices/**`, `src/modules/activity/**`,
  `src/modules/positions/**`, `src/modules/auth/**`, `src/modules/users/**`,
  `src/workers/**` ni `src/integrations/**`, y SHALL NOT añadir ninguna
  dependencia a `package.json` ni ninguna variable de entorno nueva.
  Verificable con `git diff main --name-only` y `./init.sh` verde.

## Decisiones abiertas (requieren input humano en el gate)

- **D1 — Alcance de polígono: CRUD vs. núcleo puro**: la description de la
  feature pide `isInside` con círculo (haversine) **y** polígono
  (ray-casting) de forma explícita y no ambigua, y el criterio de aceptación
  lista "polígono dentro/fuera" como test obligatorio — no es una decisión
  abierta si `isInside` soporta polígono, **sí** lo es cuánto de esa forma
  llega al CRUD y al schema. Opciones:

  | Opción | Coste | Beneficio |
  |---|---|---|
  | **A** — CRUD solo `safe_circle`; `isInside`/tipos de geometría soportan círculo y polígono como unión discriminada; `evaluate` tipado solo para círculo | tipos de geometría "de más" sin CRUD que los produzca todavía | `isInside` queda lista para cuando exista un CRUD de polígono, sin tocar su firma; `evaluate` no promete una histéresis que nadie diseñó |
  | **B** — CRUD y `evaluate` solo círculo; `isInside` con un único branch (círculo) | releer la description dos veces: pide explícitamente ray-casting | contradice el criterio de aceptación "polígono dentro/fuera" |
  | **C** — CRUD acepta también `type: 'safe_polygon'` ya en esta feature | validación de polígono simple (no auto-intersectante, orientación) sin pedirla nadie, editor de vértices que no existe en ningún cliente | ninguno que compense el costo |

  **Propuesta: A.** `isInside(geometry: CircleGeometry | PolygonGeometry, point)`
  soporta ambas formas (R16, R17); el CRUD valida `type: z.literal('safe_circle')`
  (R5) y **cualquier otro valor, incluido `'safe_polygon'`, es `400` de
  validación estándar** — sin código de error dedicado, es un dato inválido
  más. La tabla `geofences.type` lleva CHECK restringido a `('safe_circle')`
  (R1): no se reserva espacio en base para un tipo que la aplicación no
  puede producir. `evaluate` se tipa solo para `CircleGeometry` (**D3**): la
  histéresis de polígono (¿desplazar cada arista una distancia fija?) no
  está definida por esta feature y no hay geocerca de polígono real que la
  ejercite. **Confirmar A, o restringir a B (reabriendo el criterio de
  aceptación) o ampliar a C.**

- **D2 — Shape de `geofence_state`**: docs/data-model.md ya fija
  `geofence_state jsonb` = `{state, updatedAt}` "del motor (plan 007)" y
  vive en la propia fila de `geofences`. Puntos que esta spec cierra:

  - **Estado inicial**: `'unknown'` (no `'inside'`/`'outside'` inferido al
    crear) — coherente con "unknown inicial silencioso" del criterio de
    aceptación: la primera evaluación real, no la creación del registro, es
    la que decide dentro/fuera.
  - **Qué persiste**: exactamente `{state: 'unknown' | 'inside' | 'outside',
    updatedAt: string | null}` (`updatedAt` ISO-8601, `null` hasta la
    primera evaluación).
  - **Dónde vive**: columna `geofence_state` de la propia fila de
    `geofences`, **no** una tabla aparte. Cada geocerca ya pertenece a una
    sola mascota (`pet_id` FK): no existe el producto "mascota × geocerca"
    que justificaría una tabla de estado independiente — a diferencia de
    `pet_devices`, que sí necesita varias filas por par a lo largo del
    tiempo (historial de asignaciones), aquí solo hace falta el **último**
    estado.
  - **Reutilización por #12**: el shape queda congelado desde el primer
    commit de esta feature (la migración de R1 ya lo declara con ese
    default); `alerts-engine` (#12) lee y escribe la misma columna sin
    migración adicional. Esta feature **nunca** escribe un valor de
    `geofence_state` distinto del default — ningún caso de uso propio llama
    a `evaluate()` (ver §Fuera de alcance).

  **Confirmar el shape `{state, updatedAt}` en columna propia, o pedir una
  tabla `geofence_states` separada.**

- **D3 — Firma de `evaluate()` y su relación con `low_accuracy`**:

  ```typescript
  export type GeofenceStateValue = 'unknown' | 'inside' | 'outside';
  export interface GeofenceState { state: GeofenceStateValue; updatedAt: string | null; }
  export type GeofenceEvent = 'enter' | 'exit' | null;
  export interface EvaluateResult { state: GeofenceState; event: GeofenceEvent; }

  export function evaluate(
    previous: GeofenceState,
    geometry: CircleGeometry,               // no la union — ver D1
    position: Pick<ProcessedPosition, 'lat' | 'lng' | 'accuracyM' | 'flags'>,
    nowMs: number,
  ): EvaluateResult
  ```

  Decisiones dentro de la firma:
  - **`position` reutiliza `Pick<ProcessedPosition, ...>`** en vez de un
    tipo propio — el futuro worker de #12 lee `ProcessedPosition` de
    DynamoDB y se lo pasa tal cual; un tipo paralelo obligaría a un mapeo
    sin ninguna ganancia.
  - **Gate de `low_accuracy` reutiliza `FLAG_LOW_ACCURACY`** (ya calculado
    por `validate-positions.ts` con `LOW_ACCURACY_MAX_ACCURACY_M = 100` m /
    `LOW_ACCURACY_MIN_SATS = 4`, #8/#9) — **no** se duplica ese umbral. Si
    el flag está presente, `evaluate` devuelve `previous` sin tocarlo (R22):
    ni el estado ni `updatedAt` cambian.
  - **Accuracy específica de `exit` (R19/R21) es una constante nueva y más
    estricta**: `GEOFENCE_EXIT_MAX_ACCURACY_M = 50` (m). Exigir mejor
    precisión para declarar que la mascota **salió** que para simplemente no
    descartar el punto es una asimetría deliberada: una falsa alarma de
    salida cuesta más (notifica, preocupa) que una entrada tardía (R24 no
    lleva esta condición extra).
  - **`accuracyM === undefined` se trata como accuracy aceptable** (pasa el
    gate de R19/R21) — mismo criterio "fail-open" que `hasLowAccuracy` en
    `validate-positions.ts`: la ausencia de dato no es evidencia de mala
    calidad.
  - **`updatedAt` se refresca en toda evaluación real** (cualquier llamada
    que no sea el corto-circuito de `low_accuracy`), transicione o no el
    estado — permite a un futuro consumidor (#12) distinguir "geocerca sin
    evaluar hace tiempo" de "evaluada, sigue igual". Solo el corto-circuito
    de R22 deja `updatedAt` intacto.
  - **Multiplicadores de histéresis**: `GEOFENCE_EXIT_RADIUS_MULTIPLIER = 1.1`,
    `GEOFENCE_ENTER_RADIUS_MULTIPLIER = 0.9` — valores literales de la
    description de la feature, constantes nombradas en `pipeline/constants.ts`
    (nunca `1.1`/`0.9` sueltos en `geofence-eval.ts`).

  **Confirmar la firma, los tres nombres de constante y el criterio
  fail-open de accuracy indefinida, o corregir puntos sueltos.**

- **D4 — Autorización del CRUD**: mismo patrón que devices (#7). Guard a
  nivel de **controller** (`@Controller('pets/:petId/geofences')` +
  `@UseGuards(PetAccessGuard)` de clase — las cinco rutas llevan `:petId`,
  a diferencia de `pets.controller.ts` donde create/list no lo llevan).
  `@RequirePetRole('owner')` en `POST`, `PATCH`, `DELETE` — crear/editar/
  borrar geocercas es una decisión de configuración de seguridad de la
  mascota, mismo criterio que `device.claim`/`device.release` (R6/R14 de
  devices-claim: solo el owner). `GET` (list y detail) sin decorador:
  cualquier rol activo (`family`, `walker`, `vet`) necesita ver dónde están
  las zonas seguras para hacer su trabajo (pasear, cuidar), aunque no pueda
  redefinirlas. **Confirmar owner-only para mutaciones, o abrir creación/
  edición a `family` también.**

- **D5 — Migración: nombre, columnas, índices**: tabla `geofences` (nombre
  ya fijado por `docs/data-model.md`). Puntos que esta spec decide más allá
  de la transcripción literal del doc:
  - **`type` CHECK restringido a `('safe_circle')`** (no la lista completa
    `safe_circle/safe_polygon/restricted/home/park/vet/daycare` de
    `docs/data-model.md`) — ver **D1**: se amplía con `ALTER TABLE` cuando
    una feature futura implemente el tipo correspondiente, mismo criterio
    que "no reservar espacio para lo que la app no produce".
  - **Único `(pet_id, name)`**: no está en `docs/data-model.md`, se añade
    aquí (mismo criterio que D4 de devices-claim: UNIQUE que el doc no lista
    pero que un caso de uso real necesita) — evita que un family vea dos
    geocercas "Casa" sin poder distinguirlas (R7).
  - **Índice btree manual sobre `pet_id`**: regla dura de
    `docs/data-model.md` ("toda FK lleva índice"); sirve también al `COUNT`
    de R6 y al `SELECT` ordenado de R8 — un solo índice, tres usos.
  - **Máximo de 5 (R6) verificado en el use case (`COUNT` antes de
    `INSERT`), no en un trigger de base** — Postgres no expone un CHECK que
    cuente filas hermanas sin trigger, y el proyecto no tiene precedente de
    triggers. Carrera aceptada y documentada:
    `ponytail: COUNT + INSERT sin transacción serializable — dos creaciones
    concurrentes podrían dejar 6 filas si compiten en el mismo instante;
    upgrade path: trigger de base o advisory lock por pet_id si la creación
    concurrente deja de ser un escenario improbable.` El nombre duplicado
    (R7) sí tiene candado real: el índice único de este mismo R5.
  - **Sin cascada saliente de `geofences`**: nada referencia todavía esta
    tabla (`alert_events` de #12 sí lo hará, pero es su migración, no la de
    esta feature).

  **Confirmar los cinco puntos, o corregir alguno suelto.**

## Fuera de alcance

- **Creación de geocercas `safe_polygon` (o cualquier otro `type`)**: el
  CRUD de esta feature solo produce `safe_circle` (**D1**); `isInside` ya
  soporta polígono a nivel de función pura, pero no hay forma de persistir
  uno todavía.
- **Tipos `restricted`, `home`, `park`, `vet`, `daycare`**: listados en
  `docs/data-model.md` como taxonomía futura; el CHECK de `type` de esta
  migración solo acepta `'safe_circle'` (**D1**, **D5**).
- **Consumo real de `isInside`/`evaluate`**: ningún worker de esta feature
  los invoca. La integración con `position.updated`, la persistencia del
  resultado en `geofence_state` y la apertura/cierre de `alert_events` es
  `alerts-engine` (#12).
- **`alert_events` y notificaciones**: tabla, worker y endpoints son #12 y
  `alerts-center-notifier` (#13).
- **`time_away_minutes` de `activity_daily`**: sigue `NULL` (documentado
  desde `trips-activity` #10); esta feature no la toca.
- **`activitySummary` del perfil de mascota**: sin relación con esta
  feature, sigue `null`.
- **Historial de transiciones de estado**: `geofence_state` solo guarda el
  **último** valor; un audit trail de "cuándo entró/salió cada vez" no está
  pedido (lo más cercano sería `alert_events` de #12, que registra eventos,
  no un log de estado).
- **Filtrado del listado** (`?active=`, `?type=`): `GET` siempre devuelve
  todas las geocercas de la mascota; nadie lo pidió.
- **Edición de `type` vía `PATCH`**: no aceptado (`UpdateGeofenceSchema` no
  incluye `type`); cambiar la forma de una geocerca es borrar y recrear.
- **Actualización retroactiva de `docs/data-model.md` más allá de la fila
  `geofences`**: ninguna otra tabla cambia.
- **Variables de entorno nuevas**: ninguna.
- **Pantallas móviles** (mapa, editor de geocercas): fuera del backend,
  mismo recorte que #6/#8/#9/#10.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-08-05, D1-D5 aceptadas como propone la spec) ← gate obligatorio antes de implementar

Al aprobar, confirma también **D1-D5** (íntegras o con las correcciones que
indiques). Si alguna decisión cambia un requisito, este documento vuelve a
`spec_ready` antes de implementar.
