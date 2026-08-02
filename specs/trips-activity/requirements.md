---
feature: "trips-activity"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Requisitos — [[trips-activity]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1-D15, **todas pendientes de
> confirmación humana en el gate**) y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 10 (description + acceptance_criteria),
> `plans/006-recorridos-actividad.md` (pasos 1-4; el paso 5 es móvil y queda
> fuera, ver §Fuera de alcance), `docs/data-model.md` (fila `activity_daily` y
> §DynamoDB tabla `positions`), y el reporte del explorer
> `progress/explore_trips-activity.md` (775 líneas; sus 15 decisiones abiertas
> (a)-(o) están resueltas como propuestas D1-D15 en [[design]]).
>
> Depende de (todo `done`, se reutiliza tal cual, **no se redefine**):
> - `pets-crud-permissions` (#5): `PetAccessGuard` exportado por `PetsModule`;
>   contrato de `GET /v1/pets/:petId` (R8 de #5) congelado — `activitySummary`
>   sigue `null` (ver **D12**).
> - `localstack-provisioning` (#2): `AwsModule` es `@Global()` y exporta
>   `DYNAMODB_CLIENT`; nombres de tabla y claves en `src/aws/constants.ts`.
> - `wialon-ingestion-pipeline` (#8): único escritor de los items de
>   `positions` que esta feature lee; `src/pipeline/` (`haversineMeters`,
>   `normalize`, `ProcessedPosition`, `constants.ts` con `FLAG_SUSPECT_JUMP` /
>   `FLAG_LOW_ACCURACY`) y el patrón de cáscara de scheduling gated
>   (`IngestionSchedulerService`).
> - `positions-api` (#9): precedentes de contrato HTTP (guard sin
>   `@RequirePetRole`, zod `z.strictObject`, errores de dominio → 400 con
>   `code`, "ausencia de dato es 200, no 404"). Su `ListPositionsUseCase`
>   **no** se reutiliza y su módulo **no** se modifica (ver **D1**).
>
> Endpoints cubiertos (los tres de **solo lectura**, ninguno `@Public()`):
> `GET /v1/pets/:petId/trips?date`,
> `GET /v1/pets/:petId/trips/:n?date` y
> `GET /v1/pets/:petId/activity/daily?from&to`.
>
> Esta feature añade: **una** migración (`activity_daily`), **una** variable de
> entorno (`ACTIVITY_AGGREGATOR_ENABLED`) y **cero** dependencias nuevas.

## Requisitos funcionales

### Umbrales y funciones puras — segmentación de paseos (`src/pipeline/trips.ts`)

- **R1**: WHEN se implementa la segmentación de paseos, THE SYSTEM SHALL
  declarar en `src/pipeline/constants.ts` exactamente estas siete constantes
  nuevas, con estos nombres y valores literales del plan 006 §Paso 2:
  `TRIP_MOVING_SPEED_KMH = 1.8`, `TRIP_MOVING_IMPLIED_MPS = 0.5`,
  `TRIP_MIN_MOVING_POINTS = 3`, `TRIP_IDLE_CLOSE_MINUTES = 10`,
  `TRIP_MAX_GAP_MINUTES = 15`, `TRIP_MIN_DURATION_MINUTES = 5`,
  `TRIP_MIN_DISTANCE_M = 100`. THE SYSTEM SHALL importarlas en `trips.ts` y
  `activity.ts` y SHALL NOT escribir ninguno de esos siete valores como
  literal numérico fuera de `constants.ts`. THE SYSTEM SHALL NOT reutilizar la
  constante existente `LOW_ACCURACY_MAX_ACCURACY_M` (= 100, **metros de
  precisión GPS**) como umbral de distancia de paseo (= 100, **metros
  recorridos**) pese a compartir el valor, ni modificar el nombre o el valor de
  las cinco constantes ya existentes en el archivo. Verificable: test que
  importa las siete y afirma sus valores, más inspección del reviewer de que
  `trips.ts`/`activity.ts` no contienen esos literales.

- **R2**: WHEN se invoca `groupTrips(positions: ProcessedPosition[]): Trip[]`
  con una serie ordenada ascendente por `ts`, THE SYSTEM SHALL clasificar el
  punto `p[i]` como **en movimiento** IF `p[i].speedKmh > TRIP_MOVING_SPEED_KMH`
  OR la velocidad implícita
  `haversineMeters(p[i-1], p[i]) / ((p[i].ts − p[i-1].ts) / 1000) >
  TRIP_MOVING_IMPLIED_MPS`; para `p[0]` (sin punto anterior) solo aplica la
  primera rama. IF `p[i]` lleva el flag `suspect_jump` THEN la rama de
  velocidad implícita SHALL NOT evaluarse para ese punto (fue marcado
  precisamente por superar 60 km/h implícitos: usarlo como prueba de movimiento
  sería circular) y solo contará `speedKmh`. THE SYSTEM SHALL abrir un paseo en
  cuanto acumula `TRIP_MIN_MOVING_POINTS` (3) puntos consecutivos en
  movimiento, fijando `startTs` en el `ts` del **primero** de esos tres.
  Verificable: serie sintética de 12 puntos a 30 s y 5 km/h (5,5 min, ~458 m) →
  exactamente 1 paseo con `startTs` = `ts` del primer punto; serie con solo 2
  puntos en movimiento entre reposo → 0 paseos.

- **R3**: WHILE un paseo está abierto, THE SYSTEM SHALL cerrarlo IF se acumulan
  `TRIP_IDLE_CLOSE_MINUTES` (10) minutos o más de puntos consecutivos **no** en
  movimiento — fijando `endTs` en el `ts` del **último punto en movimiento**,
  no en el del punto que dispara el cierre — OR IF el intervalo entre dos
  puntos consecutivos supera `TRIP_MAX_GAP_MINUTES` (15) minutos, en cuyo caso
  `endTs` SHALL ser el `ts` del punto **anterior** al gap. WHEN la serie se
  agota con un paseo abierto, THE SYSTEM SHALL cerrarlo en su último punto en
  movimiento. Verificable (criterio de aceptación literal "gap 20 min parte
  paseos"): serie con dos tramos de movimiento de 6 min separados por 20 min
  sin ningún punto → exactamente 2 paseos, y `trips[0].endTs` = `ts` del último
  punto antes del gap.

- **R4**: WHEN un paseo se cierra, THE SYSTEM SHALL descartarlo IF
  `durationMin < TRIP_MIN_DURATION_MINUTES` (5) OR
  `distanceM < TRIP_MIN_DISTANCE_M` (100), y SHALL devolverlo en caso
  contrario. Verificable con tres casos: (a) fixture "reposo total" (serie de
  2 h con `speedKmh = 0` y desplazamiento < 1 m entre puntos consecutivos) →
  `groupTrips` devuelve `[]` (criterio de aceptación literal "reposo total →
  0"); (b) tramo de 4 min a 6 km/h (~400 m) → descartado por duración;
  (c) tramo de 20 min con 60 m recorridos → descartado por distancia.

- **R5**: WHEN THE SYSTEM acumula la distancia de un paseo, THE SYSTEM SHALL
  sumar `haversineMeters(p[i-1], p[i])` **solo si ninguno de los dos puntos**
  lleva el flag `suspect_jump` (constante `FLAG_SUSPECT_JUMP` importada de
  `src/pipeline/constants.ts`, nunca el literal `'suspect_jump'`), y SHALL
  redondear el total a metros enteros con `Math.round`. Los puntos
  `suspect_jump` SHALL seguir contando para la continuidad temporal del paseo
  (no abren un gap artificial de R3) y SHALL aparecer en `path`. THE SYSTEM
  SHALL NOT excluir de ningún cálculo los puntos marcados `low_accuracy` (ver
  **D5**: el filtro de #9 es política de presentación, no de cómputo).
  Verificable (criterio de aceptación literal "salto absurdo excluido de
  distancia") sobre `src/pipeline/__fixtures__/walk.json` pasado por
  `normalize()`: la `distanceM` que devuelve `groupTrips` es al menos 900 m
  menor que la que resulta de recorrer los mismos puntos sin aplicar la
  exclusión.

- **R6**: WHEN `groupTrips` devuelve resultados, cada `Trip` SHALL tener
  exactamente cinco claves: `startTs` (epoch ms), `endTs` (epoch ms),
  `distanceM` (entero ≥ 0), `durationMin` (`(endTs − startTs) / 60000`
  redondeado a un decimal) y `path` (array de `{lat, lng, ts}` con **todos**
  los puntos del paseo, incluidos los `suspect_jump`, en orden ascendente por
  `ts`). Los paseos SHALL venir ordenados por `startTs` ascendente y SHALL NOT
  solaparse entre sí. `src/pipeline/trips.ts` SHALL NOT importar nada de
  `@nestjs/*`, `@aws-sdk/*`, `drizzle-orm`, `zod` ni `src/modules/**` — pureza
  verificable por inspección de imports, misma regla que `geo.ts` y
  `validate-positions.ts`. WHEN se invoca dos veces con la misma entrada, SHALL
  devolver resultados idénticos (determinismo: es la condición del índice
  estable de R19). Verificable con `walk.json` normalizado → `trips.length >= 1`
  y `trips[0].distanceM > 0` (criterio de aceptación literal "walk.json → ≥1
  paseo").

### Día local del owner (`src/pipeline/local-day.ts`)

- **R7**: WHEN THE SYSTEM traduce entre instantes y días de calendario, THE
  SYSTEM SHALL hacerlo con dos funciones puras de `src/pipeline/local-day.ts`
  construidas **solo con `Intl.DateTimeFormat`** — sin `Temporal` (es
  `undefined` en el Node v24.16.0 del proyecto, comprobado por el explorer) y
  sin ninguna dependencia nueva:
  - `localDayOf(tsMs: number, timeZone: string): string` → `'YYYY-MM-DD'` del
    día local de ese instante en esa zona.
  - `localDayRange(day: string, timeZone: string): {startMs: number, endMs:
    number}` → intervalo **semiabierto** `[startMs, endMs)`, donde `endMs`
    SHALL calcularse como el `startMs` del día siguiente y SHALL NOT calcularse
    como `startMs + 86_400_000` (un día con cambio de horario dura 23 h o 25 h).

  IF `timeZone` no pertenece a `Intl.supportedValuesOf('timeZone')` THEN SHALL
  lanzar `InvalidTimeZoneError`, error tipado declarado en el propio archivo,
  sin imports de `@nestjs/common`. Verificable con tres casos:
  (a) `localDayOf(Date.parse('2026-08-03T05:50:00.000Z'), 'America/Mexico_City')
  === '2026-08-02'` (criterio de aceptación literal "posición 23:50
  America/Mexico_City cae en el día local correcto");
  (b) `localDayRange('2026-03-29', 'Europe/Madrid')` → `endMs − startMs ===
  82_800_000` (día DST de 23 h);
  (c) `localDayRange('2026-10-25', 'Europe/Madrid')` → `90_000_000` (25 h).

### KPIs diarios (`src/pipeline/activity.ts`)

- **R8**: WHEN se invoca
  `computeDailyActivity(positions: ProcessedPosition[], range: {startMs: number,
  endMs: number}): DailyActivity` — firma que **sustituye** el
  `computeDailyActivity(positions, tzUserOffset)` del plan 006 porque un offset
  fijo no sobrevive a un día de DST (ver **D3**) — THE SYSTEM SHALL devolver
  exactamente estas siete claves:
  - `distanceM`: distancia de **toda** la serie del rango (no solo la de los
    paseos) con la misma regla de exclusión de `suspect_jump` de R5, entera.
  - `activeMinutes`: suma de los intervalos `p[i].ts − p[i-1].ts` cuyo punto de
    llegada está en movimiento (R2), en minutos, entera.
  - `restMinutes`: `max(0, round(observedMinutes) − activeMinutes)`, donde
    `observedMinutes = (ts del último punto − ts del primero) / 60000` — la
    **ventana observada**, nunca 1 440 minutos fijos.
  - `walkCount`: `groupTrips(positions).length`.
  - `avgWalkMinutes`: media de `durationMin` de esos paseos con dos decimales;
    `0` si no hay paseos.
  - `firstWalkAt` / `lastWalkAt`: `startTs` del primer paseo y `endTs` del
    último, en epoch ms; `null` si no hay paseos.

  `src/pipeline/activity.ts` SHALL cumplir la misma regla de pureza de R6.
  Verificable: fixture con dos paseos → `walkCount = 2`, `activeMinutes` dentro
  del rango esperado y `restMinutes = observedMinutes − activeMinutes`.

- **R9**: IF `positions` está vacío THEN `computeDailyActivity` SHALL devolver
  `{distanceM: 0, activeMinutes: 0, restMinutes: 0, walkCount: 0,
  avgWalkMinutes: 0, firstWalkAt: null, lastWalkAt: null}` sin lanzar. IF
  `positions` contiene un solo punto THEN `observedMinutes` SHALL ser `0` y
  todas las métricas numéricas SHALL ser `0`. Verificable con dos tests
  directos (criterio del plan 006 §Paso 3: "día vacío → ceros").

### Persistencia (`activity_daily`)

- **R10**: WHEN se implementa la persistencia, THE SYSTEM SHALL generar
  **exactamente una** migración Drizzle nueva (`0005_*.sql`) que crea
  **únicamente** la tabla `activity_daily`, con este DDL efectivo:

  | Columna | Tipo | Nulabilidad |
  |---|---|---|
  | `pet_id` | `uuid` REFERENCES `pets(id)` ON DELETE CASCADE | NOT NULL |
  | `date` | `date` (día de calendario **en la timezone del owner**) | NOT NULL |
  | `distance_m` | `integer` (metros enteros) | NOT NULL |
  | `active_minutes` | `integer` | NOT NULL |
  | `rest_minutes` | `integer` | NOT NULL |
  | `walk_count` | `integer` | NOT NULL |
  | `avg_walk_minutes` | `numeric(6,2)` | NOT NULL |
  | `first_walk_at` | `timestamptz` | NULL |
  | `last_walk_at` | `timestamptz` | NULL |
  | `time_away_minutes` | `integer` | NULL |
  | `computed_at` | `timestamptz` DEFAULT `now()` | NOT NULL |

  con `PRIMARY KEY (pet_id, date)` y `CHECK` de no negatividad sobre
  `distance_m`, `active_minutes`, `rest_minutes` y `walk_count`. No se añade
  índice manual para el FK `pet_id`: la PK compuesta ya lo cubre como prefijo
  (regla "toda FK lleva índice" de `docs/data-model.md`, satisfecha). El schema
  vive en `src/db/schema/activity.schema.ts` y se re-exporta con **una línea**
  en el barrel `src/db/schema/index.ts`. THE SYSTEM SHALL NOT crear, alterar ni
  borrar ninguna otra tabla o columna (condición de STOP del plan 006:
  "cambios al modelo más allá de `activity_daily` ⇒ STOP"). Verificable:
  `pnpm run db:generate` produce un solo archivo nuevo con un único
  `CREATE TABLE`; e2e que inserta y lee una fila.

- **R11**: WHEN el agregador persiste el resultado de un día, THE SYSTEM SHALL
  ejecutar `INSERT ... ON CONFLICT (pet_id, date) DO UPDATE SET` con lista de
  columnas **explícita** que incluye `distance_m`, `active_minutes`,
  `rest_minutes`, `walk_count`, `avg_walk_minutes`, `first_walk_at`,
  `last_walk_at` y `computed_at`, y que **excluye `time_away_minutes`**, cuyo
  valor previo SHALL conservarse intacto. THE SYSTEM SHALL NOT escribir
  `time_away_minutes` en ninguna ruta de código de esta feature: la columna
  nace `NULL` y así se queda hasta que la rellene la feature id 13
  (`alerts-center-notifier`, `plans/007` §72 — "minutos del día con estado
  'outside' desde `alert_events`"). Verificable e2e: correr el agregador dos
  veces sobre el mismo día → una sola fila, `computed_at` actualizado y
  métricas idénticas; escribir `time_away_minutes = 42` a mano y re-correr →
  la columna sigue valiendo 42.

### Agregador nocturno

- **R12**: WHEN el agregador o un endpoint necesitan las posiciones de un día
  local, THE SYSTEM SHALL obtenerlas por el puerto `DailyPositionsReader`
  (`readDay(petId: string, startMs: number, endMs: number):
  Promise<ProcessedPosition[]>`, token `DAILY_POSITIONS_READER`) declarado en
  el dominio del módulo de esta feature, cuyo adaptador DynamoDB SHALL:
  emitir `Query` sobre la tabla `positions` con `pk = PET#<petId>` y
  `sk BETWEEN startMs AND (endMs − 1)` (el rango semiabierto de R7),
  `ScanIndexForward = true` y `Limit = ACTIVITY_PAGE_LIMIT` (1000); **paginar
  internamente** con `ExclusiveStartKey` hasta agotar la serie o alcanzar
  `ACTIVITY_MAX_PAGES_PER_DAY` (10) páginas (condición de STOP del plan 006:
  "el Query de un día completo se acerca al límite de 1 MB por página ⇒ paginar
  internamente"); y devolver los items mapeados al tipo puro
  `ProcessedPosition` (`sk → ts`, `speed_kmh → speedKmh`,
  `accuracy_m → accuracyM`, `battery_pct → batteryPct`, `flags` a `string[]`,
  `null → undefined` en los opcionales). IF se alcanza el tope de páginas THEN
  THE SYSTEM SHALL computar con lo leído y registrar un `warn` con `petId`,
  `date` y `pagesRead`, sin lanzar (precedente `MAX_DRAIN_ITERATIONS = 50` de
  #8). THE SYSTEM SHALL NOT reutilizar `ListPositionsUseCase` de #9 (su
  `MAX_RANGE_HOURS = 24` rechazaría un día local de 25 h, filtra `low_accuracy`
  y emite cursores con huella de consulta). Verificable: test unitario del
  reader con un doble del `DocumentClient` que devuelve 3 páginas → una lista
  concatenada, ascendente y sin duplicados; doble que siempre devuelve
  `LastEvaluatedKey` → exactamente 10 `Query` y un `warn`.

- **R13**: WHEN el agregador arranca un barrido, THE SYSTEM SHALL obtener por
  `ActivityStore.listPetsToAggregate(): Promise<{petId: string, timezone:
  string}[]>` las mascotas con **collar activo** (fila en `pet_devices` con
  `released_at IS NULL`) junto con la timezone de su owner, resuelta con un
  `LEFT JOIN` sobre `pet_users` (`role = 'owner'` AND `status = 'active'`) →
  `users.timezone`, desempatando por `pet_users.created_at` ascendente IF hay
  más de una fila de owner activo (nada en el schema lo impide). IF la mascota
  no tiene owner activo, OR su `users.timezone` no pertenece a
  `Intl.supportedValuesOf('timeZone')` (posible: el registro de #3 solo valida
  longitud, no el catálogo IANA), THEN THE SYSTEM SHALL usar `'UTC'` y
  registrar un `warn` con el `petId` y el valor rechazado, sin abortar el
  barrido (precedente: R5 de #9 degrada un jsonb corrupto a `null` con `warn`).
  THE SYSTEM SHALL NOT extender `PetRepository` (contrato cerrado por la spec
  aprobada de #5) ni importar `IngestionStore` de `src/workers/`. Verificable
  e2e: mascota con collar y owner en `America/Mexico_City` → aparece con esa
  tz; mascota con collar y `timezone = 'Marte/Olympus'` → aparece con `'UTC'` y
  se emite `warn`; mascota **sin** collar activo → no aparece en la lista.

- **R14**: WHEN se invoca `AggregateDailyActivityUseCase.runOnce(now: Date)` —
  método invocable sin esperar al reloj, precedente `PollerService.runOnce()`
  de #8 — THE SYSTEM SHALL, para cada mascota de R13: calcular `targetDay` como
  el **último día local cerrado** del owner (`localDayOf(now, tz)` menos un
  día); **saltarla** IF ya existe fila en `activity_daily` para
  `(petId, targetDay)` con `computed_at` posterior al `endMs` de ese día; y en
  caso contrario leer (R12), computar (R8/R9) y upsertear (R11). IF el
  procesamiento de una mascota lanza (FK rota por borrado concurrente, DynamoDB
  inaccesible, timezone inválida) THEN THE SYSTEM SHALL registrar un `warn` con
  el `petId` y **continuar con las demás** (precedente: try/catch por elemento
  del poller de #8), y SHALL devolver un resumen
  `{processed: number, skipped: number, failed: number}`. WHILE una ejecución
  está en curso, una segunda invocación SHALL retornar de inmediato sin hacer
  trabajo (guard de solape en memoria, precedente `this.running` de
  `PollerService`). Verificable: test unitario con 3 mascotas de las que la 2.ª
  lanza → `{processed: 2, skipped: 0, failed: 1}` y la 3.ª sí se procesó; test
  de re-entrada con la primera llamada aún en vuelo → la segunda no invoca al
  reader. Verificable e2e (criterio de aceptación literal "el agregador
  upsertea filas en `activity_daily`"): sembrar posiciones de ayer en DynamoDB
  + collar activo → `runOnce()` → hay fila con `walk_count >= 1`.

- **R15**: WHEN la aplicación arranca, THE SYSTEM SHALL registrar el tick del
  agregador en `SchedulerRegistry` **solo si**
  `ACTIVITY_AGGREGATOR_ENABLED === 'true'` **y** `NODE_ENV !== 'test'` —
  registro dinámico en código, nunca decorador `@Cron`/`@Interval`
  incondicional, para que los e2e que instancian `AppModule` completo jamás
  arranquen el barrido (calco literal de `IngestionSchedulerService`, R8/D10 de
  #8). La cadencia SHALL ser la constante nombrada
  `ACTIVITY_TICK_INTERVAL_MS = 3_600_000` (1 h), no una variable de entorno, y
  el tick SHALL invocar `runOnce(new Date())`. Un tick horario que procesa "el
  último día local cerrado de cada owner" **sustituye** al `cron(15 2 * * ? *)`
  del plan 006, que corría a las 02:15 UTC = 20:15 del día anterior en
  `America/Mexico_City`, es decir **antes** de que el día local del owner
  cerrara (desviación documentada en **D2**). THE SYSTEM SHALL NOT reutilizar
  `POLLER_ENABLED` ni volver a llamar a `ScheduleModule.forRoot()` (ya está en
  `app.module.ts` desde #8). Verificable: test unitario de `shouldSchedule()`
  con las cuatro combinaciones de las dos variables → solo
  `('true', NODE_ENV distinto de 'test')` devuelve `true`.

### Endpoints HTTP

- **R16**: WHEN llega una petición autenticada a `GET /v1/pets/:petId/trips`,
  `GET /v1/pets/:petId/trips/:n` o `GET /v1/pets/:petId/activity/daily`, THE
  SYSTEM SHALL autorizarla exclusivamente con el `PetAccessGuard` existente
  (#5), declarado con `@UseGuards(PetAccessGuard)` y **sin** `@RequirePetRole`
  — cualquier rol con membresía activa (`owner`, `family`, `walker`, `vet`)
  lee. IF la mascota no existe, el usuario no tiene fila en `pet_users` con
  `status = 'active'`, o `:petId` no es un UUID sintácticamente válido, THEN
  THE SYSTEM SHALL responder `404` con el body genérico del guard **sin
  consultar DynamoDB ni `activity_daily`**. El handler SHALL derivar la mascota
  **únicamente** de `request.petMembership.petId` (regla dura R2 de #9), nunca
  de `@Param`, de la query ni del body. THE SYSTEM SHALL NOT introducir guard,
  decorador ni consulta de membresía propios. Tests e2e obligatorios: usuario B
  sobre mascota de A → `404` en las **tres** rutas; `:petId = not-a-uuid` →
  `404`.

- **R17**: WHEN llega cualquiera de las tres rutas, THE SYSTEM SHALL validar la
  query string con un `z.strictObject` (un parámetro desconocido es `400`, no
  se ignora — precedente R7 de #9), donde `date` (rutas `trips`) y `from`/`to`
  (ruta `activity/daily`) son **fechas de calendario** `YYYY-MM-DD` y **no**
  instantes ISO-8601 con hora como los de #9, y `:n` es un entero ≥ 0.
  IF un valor no cumple el formato `^\d{4}-\d{2}-\d{2}$` o no es una fecha real
  (`2026-02-30`) THEN SHALL responder `400` con `code: 'INVALID_DATE'`.
  IF `from > to` THEN `400` con `code: 'INVALID_RANGE'`.
  IF el rango abarca más de `ACTIVITY_MAX_RANGE_DAYS = 31` días contando ambos
  extremos THEN `400` con `code: 'RANGE_TOO_LARGE'`, **sin consultar Postgres
  ni DynamoDB**.
  IF `:n` no es un entero ≥ 0 THEN `400` con `code: 'INVALID_TRIP_INDEX'`.
  Los errores SHALL nacer como errores de dominio tipados en
  `domain/errors/activity.errors.ts` (sin imports de `@nestjs/common`) y un
  mapper de infraestructura SHALL traducirlos a `BadRequestException` con el
  `code` en el body (precedente `position-error.mapper.ts` de #9). Verificable:
  `date=2026-13-01` → 400 `INVALID_DATE`; rango de 32 días → 400
  `RANGE_TOO_LARGE`; rango de exactamente 31 días → **no** es 400; `foo=bar` →
  400.

- **R18**: WHEN un miembro activo pide
  `GET /v1/pets/:petId/trips?date=YYYY-MM-DD`, THE SYSTEM SHALL resolver el
  rango `[startMs, endMs)` de ese día **en la timezone del owner de la
  mascota** (R13) — no en la del usuario que consulta ni en UTC —, leer las
  posiciones (R12), segmentar con `groupTrips` (R2-R6) y responder `200` con un
  objeto de **exactamente dos claves**: `date` (el `YYYY-MM-DD` efectivo) e
  `items` (array). Cada elemento de `items` SHALL tener exactamente estas seis
  claves: `index` (entero 0-based, posición del paseo dentro del día),
  `startTs` y `endTs` (epoch ms), `distanceM`, `durationMin` y `pointCount`; y
  SHALL NOT incluir `path` (el plan lo reserva a `/trips/:n`). IF `date` está
  ausente THEN SHALL usar el día local de **hoy** del owner (precedente de los
  defaults de #9). IF el día no tiene ningún paseo THEN SHALL responder `200`
  con `items: []`, nunca `404` (regla "ausencia de dato es 200" de #5/#7/#9;
  el `404` de estas rutas está reservado al guard). Verificable e2e: día
  sembrado con el paseo del simulador → `items.length >= 1` y
  `items[0].distanceM > 0`; día sin posiciones → `{date, items: []}`.

- **R19**: WHEN un miembro activo pide
  `GET /v1/pets/:petId/trips/:n?date=YYYY-MM-DD`, THE SYSTEM SHALL recomputar
  la lista de R18 para ese día y responder `200` con el paseo cuyo
  `index === n`, con las mismas seis claves de R18 **más** `path` (array de
  `{lat, lng, ts}` en orden ascendente, R6). El índice SHALL ser estable: dos
  peticiones consecutivas con la misma `date` y sin ingesta nueva SHALL
  devolver el mismo paseo para el mismo `n` (consecuencia del determinismo de
  R6). IF `n` es un entero ≥ 0 pero mayor o igual que el número de paseos del
  día THEN THE SYSTEM SHALL responder `404` con `code: 'TRIP_NOT_FOUND'` — el
  **único** `404` de esta feature que no produce el guard, distinguible del
  suyo porque lleva `code` en el body. Verificable e2e: `/trips/0` de un día
  con ≥ 1 paseo → `200` con `path.length > 1`; `/trips/99` → `404` con
  `TRIP_NOT_FOUND`.

- **R20**: WHEN un miembro activo pide
  `GET /v1/pets/:petId/activity/daily?from=YYYY-MM-DD&to=YYYY-MM-DD`, THE
  SYSTEM SHALL responder `200` con un objeto de **exactamente dos claves** —
  `days` y `weekComparison` — donde `days` es un array con **una entrada por
  cada día del rango**, en orden ascendente y sin huecos, y cada entrada tiene
  exactamente: `date`, `distanceM`, `activeMinutes`, `restMinutes`,
  `walkCount`, `avgWalkMinutes`, `firstWalkAt`, `lastWalkAt`,
  `timeAwayMinutes` y `source`. `source` SHALL valer:
  - `'stored'` — existe fila en `activity_daily`: los valores salen de ella,
    `firstWalkAt`/`lastWalkAt` en **ISO-8601** (vienen de una columna
    `timestamptz`, precedente `lastCommunicationAt`) y `timeAwayMinutes` es el
    valor de la columna (`null` hasta #13).
  - `'computed'` — el día es **hoy** en la timezone del owner: THE SYSTEM SHALL
    computarlo al vuelo desde DynamoDB (R12 + R8) sobre la ventana
    `[startMs, min(now, endMs))` y **SHALL NOT persistirlo** en
    `activity_daily`; `firstWalkAt`/`lastWalkAt` en ISO-8601 derivados de los
    epoch ms de R8; `timeAwayMinutes` SHALL ser `null`.
  - `'missing'` — no hay fila y el día no es hoy: las nueve claves métricas
    SHALL ser `null`, **nunca ceros** (un cero significa "reposo confirmado" y
    mentiría sobre un día que nadie computó).

  IF `from`/`to` están ausentes THEN `to` SHALL ser hoy en la tz del owner y
  `from` SHALL ser `to − 6 días` (ventana de 7 días,
  `ACTIVITY_DEFAULT_RANGE_DAYS`). THE SYSTEM SHALL computar al vuelo **como
  máximo un día por petición** (el de hoy), de modo que el coste en DynamoDB
  esté acotado con independencia del tamaño del rango. Verificable e2e
  (criterio de aceptación literal "hoy se computa al vuelo sin persistir"):
  rango de 3 días con fila solo en el del medio → `source` =
  `missing` / `stored` / `computed`; y `SELECT count(*) FROM activity_daily` no
  cambia tras pedir el rango que incluye hoy.

- **R21**: WHEN THE SYSTEM construye la respuesta de R20, THE SYSTEM SHALL
  incluir `weekComparison` con exactamente tres claves — `distanceM`,
  `activeMinutes` y `walkCount` — cada una con el delta porcentual
  `round(((mediaRango − mediaBase) / mediaBase) * 1000) / 10` (un decimal),
  donde `mediaRango` es la media diaria de esa métrica sobre los días del rango
  con `source !== 'missing'` y `mediaBase` la media sobre los días con fila en
  `activity_daily` de la ventana de **7 días naturales inmediatamente
  anteriores a `from`** (`[from − 7 días, from)`). IF esa ventana no tiene
  ninguna fila, OR `mediaBase` vale `0`, THEN la clave correspondiente SHALL
  ser `null` (el plan dice "null si no hay historial"; la división por cero se
  declara aquí como el mismo caso). El cálculo SHALL vivir en una función pura
  del dominio, sin I/O. Verificable con test unitario: base 1 000 m/día y rango
  1 120 m/día → `distanceM: 12`; base vacía → `null`; base `0` → `null`.

### Transversales

- **R22**: WHEN se introduce `ACTIVITY_AGGREGATOR_ENABLED` — **única** variable
  de entorno nueva de esta feature — THE SYSTEM SHALL añadirla a la tabla
  §Variables de entorno de `docs/conventions.md` **y** a `.env.example` **en el
  mismo commit** que la introduce (regla dura de `AGENTS.md` §4), con valor
  `true` en `.env.example` para que la cadena local funcione out-of-the-box
  (precedente `POLLER_ENABLED`, D11 de #8), y SHALL leerla únicamente vía
  `ConfigService`, nunca `process.env`. En el mismo branch THE SYSTEM SHALL
  actualizar `docs/data-model.md` (afinar la fila `activity_daily` con los
  tipos reales de R10 — la fila y el ERD ya existen, no se añade tabla) y la
  tabla de constantes de `docs/wialon-module.md` §"Pipeline puro y umbrales"
  con los siete umbrales de R1. Verificable: `grep -r
  ACTIVITY_AGGREGATOR_ENABLED` devuelve hits en `.env.example`,
  `docs/conventions.md` y el código; el commit que introduce la lectura
  contiene los tres archivos.

- **R23** (no regresión): WHEN se implementa esta feature, THE SYSTEM SHALL
  generar **exactamente una** migración (la de R10) y SHALL NOT modificar
  ningún archivo fuera de esta lista:
  `src/pipeline/{trips,activity,local-day}.ts` y sus `*.spec.ts`;
  `src/pipeline/constants.ts` **solo añadiendo** las siete constantes de R1
  (los cinco exports existentes conservan nombre y valor);
  `src/modules/activity/**` (módulo nuevo);
  `src/db/schema/activity.schema.ts` más **una línea** de re-export en
  `src/db/schema/index.ts`; `src/db/migrations/0005_*` y su `meta/`;
  **una línea** de import en `src/app.module.ts`;
  `test/activity.e2e-spec.ts`; `.env.example`;
  `docs/{conventions,data-model,wialon-module}.md`;
  `specs/trips-activity/**`; `progress/**`; y `feature_list.json` (bookkeeping
  de estado, sin código de app).
  En particular THE SYSTEM SHALL NOT tocar `src/modules/pets/**`,
  `src/modules/positions/**`, `src/modules/devices/**`, `src/modules/users/**`,
  `src/modules/auth/**`, `src/workers/**`, `src/integrations/**` ni
  `src/aws/**`; SHALL NOT alterar el contrato de `GET /v1/pets/:petId` (las 24
  claves de R8 de #5, con **`activitySummary` siguiendo `null`** — ver **D12**),
  el de `GET /v1/pets/:petId/positions*` (R11 de #9) ni el shape de los items
  que #8 escribe en DynamoDB; y SHALL NOT añadir ninguna dependencia a
  `package.json`. Verificable con `git diff main --name-only` y con `./init.sh`
  verde (suite previa sin regresión, incluidos los tres tests que hoy afirman
  `activitySummary === null`).

## Decisiones abiertas (requieren input humano en el gate)

Las 15 decisiones abiertas (a)-(o) del explorer están convertidas en **D1-D15**
en [[design]] §Decisiones propuestas, cada una con opciones, coste y **una
propuesta explícita del `spec_author`**. Ninguna está confirmada. Las tres de
mayor impacto, por si el gate quiere leer solo esas:

- **D1** — puerto de lectura de posiciones (condiciona módulo, diff sobre
  código `done` y duplicación).
- **D2** — el `cron(15 2 * * ? *)` del plan 006 corre **antes** de que cierre
  el día local de un owner en `America/Mexico_City`: bug latente que esta spec
  resuelve cambiando el mecanismo (R15).
- **D12** — si `activitySummary` del perfil de mascota (#5 R8) entra o no en
  esta feature.

## Fuera de alcance

- **Pantallas móviles** (`plans/006` §Paso 5: `history.tsx`, `activity.tsx`,
  anillo de progreso contra objetivo fijo de 60 min, chips de comparativa): no
  hay app móvil en este repo — mismo recorte que aplicaron #8 y #9. El objetivo
  de 60 min es política de UI y **no** entra en `pipeline/constants.ts`.
- **`activitySummary` del perfil de mascota** (`GET /v1/pets/:petId`): se
  mantiene `null` y R23 lo protege. Ver **D12** — si el gate lo quiere dentro,
  hay que reabrir el alcance antes de implementar.
- **`time_away_minutes`**: la columna se crea (R10) y nace `NULL`; la rellena
  la feature id 13 desde `alert_events` (`plans/007` §72). #10 nunca la escribe
  y su upsert la preserva (R11).
- **Geocercas, alertas y push** (`plans/007`, features #11-#13): esta feature
  no consume ni emite eventos de EventBridge.
- **Recalibrar los umbrales de paseo**: son **producto** (condición de STOP del
  plan 006: "los umbrales son producto, no los inventes dos veces"). IF los
  valores de R1 producen 0 paseos con movimiento evidente del simulador, el
  implementer **para y reporta con los números**, no los ajusta a ojo.
- **Caché de resultados** de `/trips` y del día "hoy": el plan lo excluye
  explícitamente ("cachear nada en MVP").
- **Recálculo retroactivo masivo** (backfill de días anteriores al despliegue
  del agregador) y **recomputar filas cuando el owner cambia de timezone**: las
  filas históricas conservan la timezone con la que se computaron (ver **D9**).
- **Exportación** (CSV/GPX) del recorrido y **rangos > 31 días** en una sola
  llamada: el tope de R17 es un requisito, no una limitación a sortear.
- **Endpoint agregado multi-mascota** y **comparativas entre mascotas**:
  no están en el plan 006.
- **Detección de cambios de rutina** (post-MVP §21): `activity_daily` es su
  semilla, pero el análisis no entra aquí.
- **Modificar el contrato de #8 o #9**: si el cómputo necesitara un atributo
  que el pipeline no escribe, sería un cambio de #8, no de aquí.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-02) ← gate obligatorio antes de implementar
      D1-D15 confirmadas íntegras, tal como las propone [[design]].

Al aprobar, confirma también **D1-D15** de [[design]] §Decisiones propuestas
(íntegras o con las correcciones que indiques). Si alguna decisión cambia un
requisito, este documento vuelve a `spec_ready` antes de implementar.
