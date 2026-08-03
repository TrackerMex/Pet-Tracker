# explore: trips-activity
Fecha: 2026-08-02

Feature #10 (`pending`, P2). Branch `feature/10-trips-activity` (sacada de
`update-status-9`, ya contiene #9). Fuentes revisadas: `AGENTS.md`,
`docs/architecture.md`, `docs/conventions.md`, `docs/data-model.md`,
`docs/wialon-module.md`, `feature_list.json` (id 10 y 11-13),
`plans/006-recorridos-actividad.md` (entero), `plans/007` §nota
`time_away_minutes`, `specs/wialon-ingestion-pipeline/`, `specs/positions-api/`,
`specs/pets-crud-permissions/requirements.md`, `progress/impl_positions-api.md`,
`progress/impl_wialon-ingestion-pipeline.md`, y el código de
`src/pipeline/`, `src/modules/positions/`, `src/workers/`, `src/db/schema/`,
`src/modules/pets/infrastructure/guards/`, `package.json`. Orientación previa
con `graphify query` (pipeline puro/umbrales, puertos de positions).

---

## 1. Plan de origen (plans/006-recorridos-actividad.md)

Esta feature cubre los **pasos 1-4** del plan. El paso 5 (pantallas
`history.tsx` / `activity.tsx`) es móvil y no hay app móvil en este repo — fuera
de alcance, igual que ocurrió con #8/#9. El paso 6 es cierre.

Reglas literales que el plan fija (§Paso 2 y §Paso 3):

- `groupTrips(positions: ProcessedPosition[]): Trip[]` — puro. Un punto está
  "en movimiento" si `speed_kmh > 1.8` **o** la distancia al anterior implica
  `> 0.5 m/s`; un paseo abre con **≥ 3 puntos consecutivos** en movimiento;
  cierra tras **≥ 10 min** sin movimiento (**gap de datos > 15 min también
  cierra**); paseos **< 5 min o < 100 m** se descartan como ruido; **excluir
  puntos `suspect_jump` del cálculo de distancia** (usar el resto).
  `Trip = {startTs, endTs, distanceM, durationMin, path: {lat,lng,ts}[]}`.
- `computeDailyActivity(positions, tzUserOffset): DailyActivity` — puro:
  distancia total (sin flags), minutos activos (suma de ventanas en
  movimiento), reposo = ventana observada − activo, paseos de `groupTrips`,
  primera/última hora de paseo.
- Agregador: `cron(15 2 * * ? *)` (02:15 UTC diario) → por cada mascota **con
  collar activo**: Query DynamoDB del día anterior **en la zona horaria del
  owner** (`users.timezone`), computa y **upsert** en `activity_daily`.
- Recálculo bajo demanda: si `GET activity/daily` pide **hoy**, computar al
  vuelo desde DynamoDB (**no persistir**).
- Endpoints: `GET /v1/pets/:petId/trips?date=YYYY-MM-DD` (lista **sin `path`**
  completo) + `GET /v1/pets/:petId/trips/:n?date=` (con el `path` para la
  polyline, `n` = índice del día); `GET /v1/pets/:petId/activity/daily?from&to`
  (**máx 31 días**) = filas de `activity_daily` + hoy al vuelo +
  `weekComparison` (delta % por métrica contra la media de los 7 días previos
  al rango, `null` si no hay historial).
- §Notas de mantenimiento: "Los umbrales de `trips.ts` (1.8 km/h, 10 min,
  100 m…) son constantes nombradas en un solo archivo `pipeline/constants.ts`".
- §Condiciones de STOP: umbrales que den resultados absurdos con el simulador
  ("los umbrales son producto, no los inventes dos veces"); Query de un día
  cerca del límite de 1 MB por página ⇒ **paginar internamente**; cambios al
  modelo más allá de `activity_daily` ⇒ STOP.

**Drift respecto al plan (adaptación local ya establecida por #8/#9):**

| Plan 006 | Este repo |
|---|---|
| `apps/api/src/...` (monorepo) | `backend-pet-tracker/src/...` |
| `apps/api/src/handlers/daily-activity.ts` + regla EventBridge Scheduler | worker en `src/workers/` con `@nestjs/schedule` (`docs/architecture.md` §Adaptación local) |
| `ProcessedPosition` en `packages/shared` | `src/pipeline/types.ts` |
| "Contrato OpenAPI ya especificado (plan 001)" | **no existe ningún archivo OpenAPI en el repo** (`find -iname '*openapi*'` = vacío). El contrato lo fija la spec, como en #9 |
| `npm -w apps/api run db:generate` / `db:migrate` | `pnpm run db:generate`; **no hay script `db:migrate`** — #9 usó `pnpm exec drizzle-kit migrate` |
| Pantallas móviles, `activitySummary` del perfil | sin app móvil; ver decisión (l) sobre `activitySummary` |

---

## 2. Sustrato reutilizable

### 2.1 `src/pipeline/` — funciones puras ya disponibles

Todo el directorio es núcleo puro (cero imports de framework/SDK/ORM), tal
como #10 lo necesita:

- **`geo.ts`** → `haversineMeters(lat1, lng1, lat2, lng2): number`
  (`EARTH_RADIUS_M = 6_371_000`). Su cabecera dice literalmente: *"#10
  (trips-activity) reutiliza esta haversine para distancias de paseo"*.
- **`validate-positions.ts`** → `normalize(raw: RawPosition[]):
  {accepted: ProcessedPosition[], discarded: DiscardedStat[]}`. Ordena
  ascendente por `ts`, descarta `(0,0)`/sin ts/duplicados y **marca sin
  descartar** `low_accuracy` y `suspect_jump`.
- **`types.ts`** → `RawPosition` (`lat, lng, ts` + opcionales `speedKmh,
  course, altitude, sats, accuracyM, batteryPct`) y
  `ProcessedPosition extends RawPosition { flags: string[] }`.
- **`__fixtures__/walk.json`** → **204 puntos** `RawPosition[]` (seed 1, unidad
  900001, slots de 30 s desde `2026-08-01T00:00Z`, con glitch `(0,0)` en el
  índice 10, un salto de ~1000 m y un duplicado exacto). Es un array **crudo**:
  el acceptance "walk.json → ≥1 paseo" implica pasarlo antes por `normalize()`,
  o que `groupTrips` acepte crudo. Ver decisión (e).

**`src/pipeline/constants.ts` — contenido literal completo (5 umbrales):**

```typescript
/** Velocidad implicita (km/h) por encima de la cual se marca suspect_jump. */
export const SUSPECT_JUMP_SPEED_KMH = 60;
/** Precision (m) por encima de la cual se marca low_accuracy. */
export const LOW_ACCURACY_MAX_ACCURACY_M = 100;
/** Satelites por debajo de los cuales se marca low_accuracy. */
export const LOW_ACCURACY_MIN_SATS = 4;
/** Umbral de bateria baja: battery.low dispara al cruzar hacia abajo (R17).
 * Histeresis: #12 cierra la alerta con bateria >= 30 (design.md D8). */
export const BATTERY_LOW_THRESHOLD_PCT = 20;
/** Nombres de flags de calidad (docs/data-model.md §DynamoDB `flags`). */
export const FLAG_SUSPECT_JUMP = 'suspect_jump';
export const FLAG_LOW_ACCURACY = 'low_accuracy';
```

La cabecera del archivo declara: *"fuente unica: #10 (trips), #11 (geocercas)
y #12 (alertas) los importan de aqui"*. Reutilizables tal cual por #10:
`FLAG_SUSPECT_JUMP` (excluir del cálculo de distancia) y `FLAG_LOW_ACCURACY`.

**Umbrales que FALTAN y que #10 debe añadir** (ninguno existe hoy; nombres
propuestos, la spec los fija):

| Umbral del plan 006 | Valor | Constante propuesta |
|---|---|---|
| movimiento por velocidad | `> 1.8 km/h` | `TRIP_MOVING_SPEED_KMH` |
| movimiento por distancia implícita | `> 0.5 m/s` | `TRIP_MOVING_IMPLIED_MPS` |
| puntos consecutivos para abrir paseo | `≥ 3` | `TRIP_MIN_MOVING_POINTS` |
| cierre por inactividad | `≥ 10 min` | `TRIP_IDLE_CLOSE_MINUTES` |
| cierre por gap de datos | `> 15 min` | `TRIP_MAX_GAP_MINUTES` |
| descarte por duración | `< 5 min` | `TRIP_MIN_DURATION_MINUTES` |
| descarte por distancia | `< 100 m` | `TRIP_MIN_DISTANCE_M` |
| ventana máxima de `activity/daily` | `31 días` | `ACTIVITY_MAX_RANGE_DAYS` (ver (j): probablemente NO en `pipeline/`) |
| objetivo diario del anillo de progreso | `60 min` | solo UI móvil — fuera de alcance backend |

⚠️ Colisión de nombres a evitar: `LOW_ACCURACY_MAX_ACCURACY_M = 100` (metros de
precisión GPS) y el descarte de paseo `< 100 m` (distancia recorrida) son el
mismo número con significados distintos. Nombres explícitos, nunca reutilizar
la constante existente.

### 2.2 `src/modules/positions/` — LOS PUERTOS (decisión abierta principal)

Dos puertos, ambos en `domain/repositories/`, con token `Symbol` junto a la
interface:

```typescript
// last-position.reader.ts
export const LAST_POSITION_READER = Symbol('LastPositionReader');
export interface LastPositionReader {
  findLastPosition(petId: string): Promise<unknown>;   // jsonb crudo de pets.last_position
}

// position-history.reader.ts
export const POSITION_HISTORY_READER = Symbol('PositionHistoryReader');
export interface PositionHistoryQuery {
  petId: string; fromMs: number; toMs: number; startAfterSk: number | null;
}
export interface PositionHistoryPage {
  items: StoredPosition[]; lastKey: number | null;
}
export interface PositionHistoryReader {
  queryPage(query: PositionHistoryQuery): Promise<PositionHistoryPage>;
}
```

**`LastPositionReader` no sirve para #10**: devuelve un solo punto de la caché
Postgres, no una serie.

**`PositionHistoryReader` sí es un candidato serio.** Análisis honesto de su
contrato contra lo que el agregador necesita (leer un día local completo):

*Lo que NO estorba:*
- El **límite de 1000 por página** (`POSITIONS_PAGE_LIMIT`) y el `lastKey` son
  exactamente el mecanismo de paginación interna que el plan exige en su
  condición de STOP (2 880 puntos/día a 30 s ⇒ 3 páginas). El consumidor solo
  itera `startAfterSk` hasta `lastKey === null`.
- El **filtro `low_accuracy` NO vive en el reader**: vive en
  `ListPositionsUseCase` (`page.items.filter(...)`). El reader devuelve la
  página completa con flags intactos. Su comentario D1 lo dice explícitamente:
  *"los suspect_jump son movimiento real marcado, y el plan 006 los necesita
  para segmentar recorridos"*.
- El **cursor** tampoco vive en el reader: el reader recibe un `startAfterSk:
  number | null` desnudo. El sobre base64url es del use case.
- `BETWEEN` inclusive en ambos extremos y `ScanIndexForward: true` (ascendente)
  — justo lo que `groupTrips` necesita.

*Lo que sí es fricción real:*
1. **`PositionsModule` no exporta nada** (`positions.module.ts` no tiene
   `exports:`). Reutilizar el puerto obliga a añadir `exports: [
   POSITION_HISTORY_READER, POSITIONS_READ_DOC_CLIENT ]` — es decir, **tocar
   código de una feature `done`** (aunque su R16 solo prohibía tocarlo
   *durante* #9).
2. **`ListPositionsUseCase` NO es reutilizable** aunque el reader sí lo sea:
   `MAX_RANGE_HOURS = 24` lanza `RangeTooLargeError` para un día local de 25 h
   (timezone con DST de otoño), filtra `low_accuracy` por defecto y emite
   cursores atados a un `queryFingerprint`. El agregador debe hablar con el
   **reader**, no con el use case.
3. **Tipo de salida**: el reader devuelve `StoredPosition`
   (`speedKmh: number | null`, contrato público camelCase de #9), mientras el
   plan define `groupTrips(positions: ProcessedPosition[])`
   (`speedKmh?: number`, tipo del pipeline). Son estructuralmente casi iguales
   pero **no intercambiables en TypeScript**. Ver decisión (e).

**Opción A — reutilizar `PositionHistoryReader` tal cual.**
Coste: añadir `exports:` a `positions.module.ts` (2 líneas en una feature
`done`); el agregador/los use cases de #10 inyectan `POSITION_HISTORY_READER` y
escriben un bucle de paginación de ~10 líneas; el `PositionsModule` pasa a ser
dependencia del módulo de #10 (y, si el agregador vive en `src/workers/`, un
worker importaría un módulo HTTP — exactamente lo contrario de lo que D6 de #9
argumentó para no importar `IngestionModule`).
Beneficio: cero duplicación de la Query DynamoDB, del `DocumentClient` y del
mapper `toStoredPosition`; un único punto donde vive "cómo se lee la tabla
`positions`".

**Opción B — puerto nuevo propio de #10** (p. ej. `DailyPositionsReader` con
`readDay(petId, fromMs, toMs): Promise<StoredPosition[]>`, ya paginado por
dentro), con adaptador Dynamo propio.
Coste: un segundo adaptador Dynamo casi idéntico + un tercer
`DynamoDBDocumentClient` en el proceso; duplica (o importa cruzando módulos) el
mapper `position-response.mapper.ts`; si mañana cambia el shape del item hay
dos sitios que tocar.
Beneficio: **precedente literal del repo** — `IngestionStore` de #8 (D14) dice
*"NO se extienden DeviceRepository/PetRepository — sus contratos estan cerrados
por specs aprobadas (#5/#7) y las consultas del worker son de otro
consumidor"*, y `LastPositionReader` de #9 repite el criterio
(*"No se extiende `PetRepository`: su contrato lo cerro la spec aprobada de #5
y el consumidor es otro"*). Además el contrato "un día entero ya paginado" es
más honesto para el agregador que "una página de 1000".

**Opción C — extraer reader + mapper + `DocumentClient` a un módulo compartido**
(`src/positions-read/` o `src/aws/`), consumido por #9 y por #10.
Coste: refactor que mueve archivos de una feature `done` (mayor diff, hay que
re-verificar los e2e de #9); ninguna feature lo pidió.
Beneficio: la única opción sin duplicación **y** sin que un worker dependa de
un módulo HTTP.

**NO elijo.** Es el punto (a) de §5 y necesita decisión del `spec_author`/gate
humano.

### 2.3 Shape del item que #8 escribe en DynamoDB, y su mapeo en #9

Escritor único: `toPositionItem()` en
`src/workers/positions-consumer.service.ts` (líneas finales del archivo).
Atributos exactos, en **snake_case**:

| Atributo | Origen | Nota |
|---|---|---|
| `pk` | `` `PET#${petId}` `` | `TABLE_POSITIONS_PARTITION_KEY = 'pk'` |
| `sk` | `position.ts` | epoch **ms**, `TABLE_POSITIONS_SORT_KEY = 'sk'` |
| `lat`, `lng` | directos | number |
| `speed_kmh`, `course`, `altitude`, `sats`, `accuracy_m`, `battery_pct` | `?? null` | number \| null |
| `device_ts` | `position.ts` | duplica `sk` |
| `received_ts`, `processed_ts` | `now.getTime()` | **internos**, #9 no los expone |
| `flags` | `position.flags` | `string[]`; valores posibles hoy: `'low_accuracy'`, `'suspect_jump'` |
| `expires_at` | `floor(ts/1000) + 90*86400` | TTL en **segundos** |

Flags: los asigna `assignQualityFlags()` en `validate-positions.ts` —
`low_accuracy` si `accuracyM > 100` **o** `sats < 4`; `suspect_jump` si la
velocidad implícita contra el punto anterior `> 60 km/h`. Un punto puede llevar
**ambos**. Idempotencia declarada: `PutItem` sobre el mismo `sk` sobrescribe.

Mapeo de #9 (`infrastructure/mappers/position-response.mapper.ts`,
`toStoredPosition()`): lista **explícita** de campos, sin spread —
`sk → ts`, `speed_kmh → speedKmh`, `accuracy_m → accuracyM`,
`battery_pct → batteryPct`, `flags` filtrado a strings; `received_ts`,
`processed_ts` y `expires_at` **nunca** salen. Resultado tipado como
`StoredPosition` (`domain/entities/position.entity.ts`).

### 2.4 `src/workers/` — patrón del cron de #8, replicable por #10

Montaje actual:

- **`app.module.ts`** ya tiene `ScheduleModule.forRoot()`, con comentario
  literal: *"Primer cron del repo (#8); **#10**/#16 lo heredan (design.md)"*.
  #10 **no** necesita volver a registrarlo.
- **`IngestionSchedulerService`** (`implements OnApplicationBootstrap`) es la
  **cáscara de scheduling**, separada de la lógica: registra intervalos en
  `SchedulerRegistry` **solo si** `shouldSchedule()`:
  ```typescript
  return this.config.get<string>('POLLER_ENABLED') === 'true' &&
         this.config.get<string>('NODE_ENV') !== 'test';
  ```
  Registro **dinámico** (código), no decorador `@Cron` incondicional — la razón
  documentada es que los e2e que instancian `AppModule` completo jamás
  arranquen crons. **Este es el patrón exacto que #10 debe replicar.**
- **Lógica invocable**: `PollerService.runOnce(now = new Date())` y
  `PositionsConsumerService.drainOnce(now = new Date())` — reloj por parámetro,
  sin `Date.now()` incrustado, para que tests y e2e los invoquen sin esperas.
  `runOnce()` además lleva guard de solape en memoria (`this.running`),
  try/catch por elemento (un device que falla no aborta el ciclo) y un solo log
  de error por tick si LocalStack está caído.
- **`IngestionModule`** — qué exporta hoy:
  `exports: [PollerService, PositionsConsumerService]`.
  **NO exporta** `INGESTION_STORE`, ni `POSITIONS_DOC_CLIENT`, ni
  `IngestionSchedulerService`. Es decir: **#10 no puede aprovechar el store ni
  el DocumentClient de los workers sin modificar `IngestionModule`**; lo único
  aprovechable "tal cual" es el **patrón** (cáscara gated + `runOnce()`), no el
  código.
- `IngestionSchedulerService` usa `addInterval` con `setInterval` (cadencias
  fijas `POLLER_INTERVAL_MS = 60_000` / `CONSUMER_INTERVAL_MS = 15_000`).
  El agregador de #10 quiere **`cron(15 2 * * *)`**, que en `@nestjs/schedule`
  es `SchedulerRegistry.addCronJob` + `CronJob`, un mecanismo **no usado
  todavía** en el repo. Ver decisión (g).

Lo que #10 tendría que replicar: su propia cáscara
(`ActivitySchedulerService` o similar) con gating por env + `NODE_ENV !==
'test'`, y el agregador expuesto como `runOnce(date, now)` invocable desde
tests/e2e.

---

## 3. Datos y timezone

### 3.1 Tabla `activity_daily`

- **Ya está en `docs/data-model.md`** (fila del catálogo y en el ERD
  `pets ||--o{ activity_daily : "has"`), textualmente:
  `PK (pet_id, date), distance_m, active_minutes, rest_minutes, walk_count,
  avg_walk_minutes, first_walk_at, last_walk_at, time_away_minutes NULL,
  computed_at` — *"KPIs diarios (plan 006); `time_away_minutes` se llena con
  geocercas (007)"*.
- **NO existe migración ni schema Drizzle.** `src/db/schema/` contiene solo
  `audit-log`, `devices`, `email-verification-tokens`, `pets`, `users`; el
  barrel `index.ts` no re-exporta nada de actividad. Migraciones existentes:
  `0000_windy_pete_wisdom.sql` … `0004_devices_claim_tables.sql`. #10 genera la
  **0005**. Es la **única migración de la feature** (condición de STOP del plan:
  cambios al modelo más allá de `activity_daily` ⇒ STOP).
- Precedentes de schema a seguir (`pets.schema.ts`): `timestamp(..., {
  withTimezone: true })`, `primaryKey({ columns: [...] })` para PK compuesta,
  `check(...)` para constraints, índice manual por cada FK (regla de
  `docs/data-model.md`: *"toda columna FK lleva índice manual"* — con PK
  `(pet_id, date)` el índice de `pet_id` ya queda cubierto como prefijo).
- `date` de calendario ⇒ tipo `date` de Drizzle (`docs/data-model.md`:
  *"`timestamptz` para instantes, `date` para fechas de calendario"*).
  `first_walk_at` / `last_walk_at` son **instantes** ⇒ `timestamptz`
  (el plan no lo dice; ver (i)).

### 3.2 Timezone del owner

- **Columna**: `users.timezone` — `varchar('timezone', { length: 64 })
  .notNull().default('UTC')` (`src/db/schema/users.schema.ts`).
- **Validación existente (de #4)**: `src/modules/users/application/dto/
  update-profile.dto.ts` valida contra el catálogo IANA completo con la API
  nativa, sin dependencia nueva:
  ```typescript
  const IANA_TIMEZONES = new Set(Intl.supportedValuesOf('timeZone'));
  const TimezoneSchema = z.string().refine((value) => IANA_TIMEZONES.has(value), {
    message: 'Invalid IANA timezone',
  });
  ```
  (Nota: el registro de #3, `register-user.dto.ts`, solo valida
  `z.string().trim().min(1).max(64)` — un usuario creado por registro **puede
  tener una timezone que no es IANA válida**; el agregador debe tolerarlo. Ver (h).)
- **Resolver "el owner" de una mascota**: `pet_users` con PK `(pet_id,
  user_id)`, `role CHECK ('owner','family','walker','vet')`, `status DEFAULT
  'active'`. El join es
  `pet_users JOIN users ON users.id = pet_users.user_id WHERE
  pet_users.pet_id = ? AND pet_users.role = 'owner' AND status = 'active'`.
  ⚠️ **No hay ningún método hoy que haga esto.** `PetRepository` expone
  `createWithOwner`, `findAllByMember`, `findMembership(petId, userId)`,
  `findById`, `update`, `delete` — ninguno devuelve el owner ni su timezone.
  `IngestionStore` tampoco (`listActiveAssignments` devuelve `deviceId, petId,
  unitId, ingestWatermark`). ⚠️ Nada en el schema garantiza **exactamente un**
  owner activo por mascota (la PK compuesta permite varias filas con
  `role='owner'`); `createWithOwner` crea uno, pero no hay constraint. Ver (h).

**Herramienta de fechas disponible — verificado, no supuesto:**

- `backend-pet-tracker/package.json`: **no hay ninguna librería de fechas**
  (ni `date-fns`, ni `luxon`, ni `dayjs`, ni `@date-fns/tz`). Deps relevantes:
  `drizzle-orm`, `zod`, `@aws-sdk/*`, `@nestjs/schedule`, `argon2`,
  `jsonwebtoken`, `pg`, `uuidv7`. **No hay `package.json` en la raíz del repo.**
- Node del entorno: **v24.16.0**. `typeof Temporal` → **`undefined`**
  (comprobado ejecutándolo). La spec **no puede apoyarse en `Temporal`**.
- Queda `Intl`, que sí resuelve el criterio de aceptación. Comprobado en este
  Node con el caso literal de la feature:
  ```
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', ... })
    .format(new Date('2026-08-03T05:50:00.000Z'))   → "2026-08-02, 23:50"  ✓
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City',
    timeZoneName: 'longOffset' })                    → "GMT-06:00"
  ```
  Es decir: **instante → día local** es directo con `formatToParts`. La
  dirección inversa (**día local → rango `[startMs, endMs)` en UTC** para el
  `sk BETWEEN` de DynamoDB) requiere resolver el offset del día — con
  `timeZoneName: 'longOffset'` o con el truco de doble `Date.UTC(parts) − date`,
  ambos puros y sin dependencia, pero con esquinas de DST (día de 23 h / 25 h,
  hora local ambigua o inexistente). Ver (c).
- Nota: la firma del plan `computeDailyActivity(positions, tzUserOffset)`
  asume un **offset fijo** — eso es incorrecto para un día con cambio de
  horario. Pasar el **nombre IANA** (o el par `[startMs, endMs)` ya resuelto)
  es más robusto; el plan no es normativo aquí.
- Postgres (`AT TIME ZONE`) no ayuda: las posiciones viven en DynamoDB, así
  que el rango hay que calcularlo en JS de todas formas.

### 3.3 `time_away_minutes` NULL — coherente, confirmado

- `docs/data-model.md`: *"`time_away_minutes` se llena con geocercas (007)"*.
- `plans/006` §Fuera: *"`time_away_minutes` queda NULL y documentado"*;
  §Notas: *"queda NULL hasta el plan 007 (geocerca hogar)"*.
- `plans/007` §72: *"Rellenar `time_away_minutes` en el agregador del plan 006:
  minutos del día con estado 'outside' … calcular desde `alert_events`
  open/closed del día"*.
- `feature_list.json` id **13** (`alerts-center-notifier`) lo declara en su
  description: *"Rellena `time_away_minutes` en el agregador (aproximación
  desde `alert_events` del día)"* — no #11 ni #12.

**Coherente.** La columna se crea `NULL` (nullable, sin default) y #10 nunca la
escribe. Precedente idéntico en el repo: `pets.photo_key` / `photoUrl: null`
esperando a #6, y `activitySummary: null` esperando a #10.

---

## 4. Contratos de API — precedentes que #5, #7 y #9 ya fijaron

Nada de esto es negociable en #10 sin romper coherencia:

**Autorización (#5 R9-R12, reusado literal por #9 R1):**
- `@Controller('pets/:petId/<recurso>')` + `@UseGuards(PetAccessGuard)`,
  **sin** `@RequirePetRole` para rutas de lectura — cualquier rol con membresía
  activa lee (`owner`, `family`, `walker`, `vet`).
- El guard (`pet-access.guard.ts`) valida el `:petId` contra `UUID_PATTERN`
  **antes de tocar la base**, consulta `pet_users` una sola vez y lanza
  `NotFoundException()` genérica tanto si la mascota no existe como si el
  usuario no es miembro activo — *"imposible inferir existencia (brief §4)"*.
  Deja `request.petMembership = { petId, role }`.
- **#9 R2 (regla dura)**: el handler deriva la mascota **exclusivamente** de
  `request.petMembership.petId`, nunca de `@Param` ni del body/query/cursor.
  El controller de #9 lo hace así en las dos rutas.
- Tests e2e obligatorios por precedente de #9: usuario B sobre mascota de A →
  404 en **todas** las rutas nuevas; `:petId = not-a-uuid` → 404.

**Validación de query (#9 R7):**
- **zod con `z.strictObject`** (el `.strict()` de zod v4): un parámetro
  desconocido es **400**, no se ignora. Literal de `list-positions.dto.ts`:
  ```typescript
  export const ListPositionsQuerySchema = z.strictObject({
    from: z.iso.datetime({ offset: true }).optional(),
    to: z.iso.datetime({ offset: true }).optional(),
    cursor: z.string().min(1).optional(),
    includeSuspect: z.enum(['true', 'false']).optional(),
  });
  ```
- Parseo **explícito en el borde HTTP** con `safeParse` + `BadRequestException`
  (`parseQuery()` en `positions.controller.ts`), body de error:
  `{ statusCode: 400, message: 'Validation failed', errors: [{path, message}] }`.
  No hay `ZodValidationPipe` global en el repo.
- ⚠️ **Precedente de formato de fecha a resolver**: #9 usa **instantes ISO-8601
  completos** (`from`/`to`) y rechaza a propósito epoch ms. #10 necesita
  **fechas de calendario** `YYYY-MM-DD` (`?date=`, `?from=&to=`), que es un tipo
  distinto — `z.iso.date()` en zod v4, o un `z.string().regex(...)`. No es un
  conflicto, pero la spec debe declararlo explícitamente para que nadie copie
  `z.iso.datetime()` por inercia.

**Errores de dominio → HTTP (#9, `docs/conventions.md` §Manejo de errores):**
- Errores tipados en `domain/errors/*.errors.ts` **sin imports de
  `@nestjs/common`** (`InvalidRangeError`, `RangeTooLargeError`,
  `InvalidCursorError`).
- Un mapper de infraestructura (`mappers/position-error.mapper.ts`) los traduce
  a `BadRequestException` con **código** en el body:
  ```json
  { "statusCode": 400, "code": "RANGE_TOO_LARGE", "message": "..." }
  ```
  → #10 replicará el patrón para su tope de 31 días (p. ej. `RANGE_TOO_LARGE`
  reusado o `ACTIVITY_RANGE_TOO_LARGE`) y para un `date` inválido.
- El 404 nunca lo produce el handler: sale del guard antes de entrar.

**Forma de la respuesta:**
- #9 R11: objeto de **exactamente** dos claves `{ items, nextCursor }`; cada
  item con lista **explícita** de campos (nunca spread de la entidad).
- #5 R8 + #7 R11 + #9 D2: **"ausencia de dato es 200, no 404"** —
  `GET /v1/pets/:petId/device` devuelve `200 null` sin collar,
  `GET .../positions/last` devuelve **body JSON `null`** con caché vacía
  (usando `@Res()` explícito porque Nest vacía el body si el handler devuelve
  `null`), y `GET .../positions` con rango vacío devuelve
  `{items: [], nextCursor: null}`, **nunca 404**. Motivo declarado en D2 de #9:
  *"el 404 de estas rutas ya está reservado por el guard a 'mascota inexistente
  o ajena'"*.
  ⇒ Precedente directo para #10: día sin paseos ⇒ `200` con lista vacía / ceros;
  `trips/:n` con `n` fuera de rango es el único candidato legítimo a 404 (ver (k)).

**`activitySummary` — el contrato que #10 debe rellenar sin romper #5:**
- `pet-profile-response.mapper.ts` declara el campo tipado como **`null`
  literal**:
  ```typescript
  /** null hasta activity-summary (#10). */
  activitySummary: null;
  ...
  activitySummary: null,
  ```
- `specs/pets-crud-permissions/requirements.md` **R8** congela la lista de 24
  claves de `GET /v1/pets/:petId` y dice: *"donde `device`, `nextVaccine`,
  `nextReminder` y `activitySummary` están presentes con valor `null` (los
  rellenan #7, #14, #16 y **#10** sin añadir ni renombrar claves) … features
  posteriores solo sustituyen `null` por valores"*.
- Tests que lo fijan hoy: `pet-profile-response.mapper.spec.ts` (lista de claves
  + `expect(response.activitySummary).toBeNull()`), `test/pets.e2e-spec.ts:360`
  y `test/devices.e2e-spec.ts:630`.
- Precedente de cómo se rellenó `device` (#7): se **añadió un parámetro
  opcional al mapper** (`device: DeviceStatusResponse | null = null`) y el
  controller lo pasa; ni una clave nueva. Mismo camino para
  `activitySummary`.
- Contenido esperado según plan 006 §Paso 5: *"rellenar `activitySummary` del
  perfil (distancia y minutos de hoy)"* ⇒ algo como
  `{ distanceM, activeMinutes }` de **hoy**. El shape **no está fijado en
  ningún sitio** — decisión (l).

---

## 5. Riesgos y decisiones abiertas para la spec

**(a) Puerto de lectura de posiciones para el agregador — LA decisión.**
Opciones A / B / C detalladas en §2.2, con sus costes. Resumen:
A) reutilizar `PositionHistoryReader` (hay que añadir `exports:` a
`positions.module.ts`, feature `done`; y un worker acabaría dependiendo de un
módulo HTTP, justo lo que D6 de #9 evitó en sentido inverso);
B) puerto propio de #10 (precedente literal `IngestionStore` D14 y
`LastPositionReader` de #9; coste: segundo adaptador Dynamo + tercer
`DocumentClient` + mapper duplicado);
C) extraer reader+mapper+DocumentClient a un módulo compartido (sin
duplicación ni acoplamiento invertido; coste: refactor sobre código `done`).
En **todas** las opciones: `ListPositionsUseCase` **no** se reutiliza
(`MAX_RANGE_HOURS = 24` rompe con un día local de 25 h por DST, filtra
`low_accuracy` por defecto y emite cursores con fingerprint).

**(b) "Hoy al vuelo" vs persistido.**
El plan lo fija (§Paso 3: *"si `GET activity/daily` pide el día de hoy,
computar al vuelo desde DynamoDB (no persistir)"*) y el acceptance lo repite.
Lo que la spec debe resolver:
(i) **qué es "hoy"** — el día local del **owner** de la mascota, no el del
usuario que consulta ni UTC (un `family` en otra timezone vería otro día);
(ii) **hasta dónde llega el día parcial** — ventana `[startOfToday, now]`,
con `rest_minutes` calculado sobre la ventana observada, no sobre 24 h;
(iii) **si "ayer" también se computa al vuelo** cuando el cron aún no corrió
(el cron es 02:15 UTC = 20:15 del día anterior en CDMX ⇒ para un owner en
`America/Mexico_City` el agregador correría **antes** de que su día local
termine). Este desfase es un bug latente del `cron(15 2 * * *)` heredado del
plan: o el cron corre por timezone del owner, o corre a una hora que garantice
que todos los días locales han cerrado, o el endpoint computa al vuelo
cualquier día sin fila. Opciones con coste: cron único a hora fija + fallback
al vuelo (simple, filas tardías); un tick por hora que procese los owners cuyo
día acaba de cerrar (correcto, más código); N crons por timezone (rechazable).
(iv) **fallback general**: ¿un rango que pide un día pasado **sin fila** en
`activity_daily` devuelve ceros, `null`, u omite el día del array?

**(c) Aritmética de timezone sin librería.**
Herramienta disponible: solo `Intl` (`Temporal` es `undefined` en Node
v24.16.0; no hay `date-fns`/`luxon`/`dayjs` — verificado en `package.json`).
Opciones: (1) helper puro propio en `src/pipeline/` (p. ej.
`localDayRange(dateYmd, ianaTz): {startMs, endMs}` +
`localDayOf(tsMs, ianaTz): string`) con `Intl.DateTimeFormat` y
`timeZoneName: 'longOffset'` — sin dependencia nueva, ~30 líneas, testeable con
el caso 23:50 `America/Mexico_City` del acceptance, **pero** hay que decidir el
comportamiento en días DST (23 h / 25 h, hora local inexistente o repetida);
(2) añadir una dependencia (`@date-fns/tz`, `luxon`) — menos esquinas, pero es
una dep nueva que la spec debe justificar y declarar. Coste indirecto de (1):
el plan pasa `tzUserOffset` (offset fijo) a `computeDailyActivity`, firma que
no sobrevive a DST — la spec debería pasar el nombre IANA o el rango ya
resuelto.

**(d) Idempotencia del upsert nocturno.**
PK `(pet_id, date)` ⇒ `INSERT ... ON CONFLICT (pet_id, date) DO UPDATE`
(`onConflictDoUpdate` de Drizzle). Puntos abiertos: (i) ¿el re-run sobrescribe
siempre, o solo si `computed_at` es más viejo? (ii) ¿qué pasa con
`time_away_minutes` cuando #13 ya lo escribió y #10 re-corre el mismo día — el
`DO UPDATE` debe **excluir esa columna del SET** o la borraría; es un
acoplamiento futuro que conviene dejar escrito ya; (iii) solape de ejecuciones
(guard en memoria, precedente `this.running` de `PollerService`); (iv) fallo a
mitad del barrido de mascotas: ¿transacción por mascota (precedente: el poller
hace try/catch por elemento y sigue) o abortar todo?

**(e) Tipo de entrada de `groupTrips` y de dónde salen las posiciones.**
El plan dice `groupTrips(positions: ProcessedPosition[])`, pero el reader de #9
devuelve `StoredPosition` (`speedKmh: number | null` vs `speedKmh?: number`) y
el fixture `walk.json` es `RawPosition[]` crudo (sin `flags`, con el `(0,0)` y
el duplicado sin filtrar). Opciones: (1) `groupTrips` acepta
`ProcessedPosition[]` y el lado infra adapta `null → undefined` (fiel al plan,
un adaptador trivial; el test del fixture pasa por `normalize()` primero —
además así el fixture ejercita el descarte del `(0,0)`); (2) `groupTrips`
acepta `StoredPosition[]` (cero adaptación desde el reader, pero el pipeline
puro pasaría a depender del tipo público de un módulo HTTP — viola la
dirección de dependencias); (3) un tipo mínimo estructural propio de
`trips.ts` (`{lat, lng, ts, speedKmh?, flags}`) que ambos satisfacen (más
desacoplado, un tipo más). Relacionado: decidir si **`low_accuracy` se filtra
antes de segmentar** (el plan solo manda excluir `suspect_jump` **del cálculo
de distancia**; no dice nada de `low_accuracy`, y #9 sí los oculta por defecto
en su endpoint — inconsistencia a resolver explícitamente).

**(f) Mascotas sin device o sin posiciones.**
El plan dice "por cada mascota **con collar activo**". Casos y opciones:
(i) mascota sin `pet_devices` activo ⇒ ¿se salta (no hay fila para ese día) o
se escribe una fila de ceros? Saltar es lo barato, pero deja huecos que el
endpoint de rango tiene que rellenar (ver (b.iv)); (ii) mascota con collar pero
**cero posiciones** ese día (LocalStack apagado, collar sin señal) ⇒ ¿fila de
ceros o sin fila? El acceptance del plan pide "día vacío → ceros" **para la
función pura** `computeDailyActivity`, lo cual no obliga a persistir;
(iii) mascota **sin owner activo** o con `users.timezone` no-IANA ⇒ fallback a
`'UTC'` + log `warn` (precedente: #9 R5 degrada jsonb corrupto a `null` con
log `warn`, no propaga error);
(iv) mascota **borrada** entre el barrido y el upsert ⇒ la FK `pet_id` falla;
try/catch por mascota (precedente del poller).
La consulta "mascotas con collar activo" **no existe hoy**:
`IngestionStore.listActiveAssignments()` la tiene pero devuelve
`(deviceId, petId, unitId, ingestWatermark)` sin owner ni timezone, y
`IngestionModule` **no exporta `INGESTION_STORE`**. Otra vez el dilema de (a):
reutilizar+exportar, o puerto propio.

**(g) Mecanismo del cron nocturno.**
Precedente #8: cáscara `OnApplicationBootstrap` + `SchedulerRegistry
.addInterval(...)` con gating `POLLER_ENABLED === 'true' && NODE_ENV !==
'test'`, y lógica en un `runOnce(now)` invocable. Para una hora fija
(`02:15`) el mecanismo natural es `addCronJob` + `CronJob` de
`@nestjs/schedule`, **no usado aún en el repo**. Abierto: (i) `addCronJob` vs
`addInterval` de 24 h (frágil ante reinicios) vs `@Cron` decorador
(descartado: arrancaría en los e2e — es exactamente lo que #8 evitó);
(ii) **nombre de la env var de gating**: ¿reutilizar `POLLER_ENABLED`
(acopla dos workers distintos) o introducir `ACTIVITY_AGGREGATOR_ENABLED`
(regla dura de `AGENTS.md` §4: toda env nueva va a la tabla de
`docs/conventions.md` **y** a `.env.example` en el mismo commit); (iii) ¿la
hora del cron es constante nombrada o env?

**(h) Resolver el owner y su timezone.**
No hay método. `PetRepository` (contrato cerrado por la spec de #5) no lo
expone; `IngestionStore` tampoco. Además **nada garantiza un único owner
activo** por mascota (la PK `(pet_id, user_id)` admite varias filas con
`role = 'owner'`). Opciones: (1) puerto propio del agregador con un método
`listPetsToAggregate(): {petId, timezone}[]` que ya haga el join
`pet_devices → pets → pet_users(role='owner', status='active') → users`
(precedente `IngestionStore`, y una sola query); (2) extender `PetRepository`
(rompe el criterio "contratos cerrados" que #8 y #9 aplicaron dos veces);
(3) reutilizar `IngestionStore` exportándolo (mezcla el store de ingesta con
el de actividad). Y decidir el desempate si hay 0 o >1 owner (propuesta:
el más antiguo por `created_at`, o `'UTC'` + log `warn`).

**(i) Tipos y unidades de las columnas de `activity_daily`.**
El plan lista nombres pero no tipos completos: `distance_m int` (¿metros
redondeados?), `active_minutes`/`rest_minutes`/`walk_count` int,
`avg_walk_minutes` int (¿o `numeric` — el promedio rara vez es entero?),
`first_walk_at`/`last_walk_at` (¿`timestamptz` o `time`?), `computed_at`
(`timestamptz DEFAULT now()`). También: `date` es `date` de calendario **en la
timezone del owner** — si el owner cambia su timezone, las filas históricas
quedan en la timezone vieja (aceptable, pero conviene declararlo).
Y el FK `pet_id` con `ON DELETE CASCADE` (precedente `pet_users`).

**(j) Dónde vive `groupTrips` — `src/pipeline/` vs dentro del módulo.**
A favor de `src/pipeline/`: lo dice el plan explícitamente
(`apps/api/src/pipeline/trips.ts` y `pipeline/activity.ts`); es el sitio de las
funciones puras portables a Lambda (`docs/architecture.md` §Adaptación local:
*"La lógica vive en funciones puras (`src/pipeline/`) — portarla a Lambdas
después es empaquetado, no reescritura"*); `constants.ts` ya declara ser la
fuente única de umbrales para #10; `geo.ts` dice que #10 reutiliza su
haversine; y el agregador (un worker) y el controller (HTTP) son **dos**
consumidores — dejarlo dentro de un módulo obligaría al worker a importar el
módulo HTTP. A favor del módulo: `docs/architecture.md` describe módulos de 3
capas y `feature_list.json` §files_affected lista **ambos**
(`src/pipeline/` y `src/modules/positions/`).
**Recomendación (no decisión)**: `trips.ts`/`activity.ts` + umbrales en
`src/pipeline/`; el módulo HTTP y el worker los importan. Sub-decisión: el tope
de **31 días** y el objetivo de 60 min **no** son umbrales de pipeline puro
(son política de API/UI) — el precedente de #9 los pondría en un
`<feature>.constants.ts` del módulo, como `MAX_RANGE_HOURS`.

**(k) Contrato de los tres endpoints (detalles no fijados por el plan).**
(i) ¿Módulo nuevo (`src/modules/activity/`) o rutas dentro de
`PositionsModule`? `files_affected` dice `src/modules/positions/`, pero el
`@Controller('pets/:petId/positions')` de #9 tiene prefijo fijo, así que
`trips` y `activity/daily` necesitan **otro** controller de todos modos.
(ii) `trips/:n` — `n` es "índice del día" (0-based o 1-based, sin decidir) y
requiere `?date=`: ¿404 o 400 si `n` está fuera de rango? Es el único 404
legítimo de la feature (el resto los produce el guard).
(iii) ¿`date` ausente en `/trips` ⇒ hoy por defecto (DX, precedente de los
defaults `to = now` de #9) o 400 exigiéndolo?
(iv) `weekComparison`: forma exacta (`{distanceM: {deltaPct: number|null}, …}`
vs plano), qué es "los 7 días previos al rango", y **qué pasa si faltan días**
(¿media de los presentes o `null`? El plan solo dice `null` "si no hay
historial").
(v) `from > to`, rango > 31 días, `date` sin formato ⇒ 400 con `code`
(precedente `INVALID_RANGE` / `RANGE_TOO_LARGE`).
(vi) ¿La lista de `/trips` incluye un `id`/índice estable para que el cliente
pueda pedir `/trips/:n`? (Recalcular al vuelo dos veces debe dar el mismo
índice — es determinista si el input lo es, pero conviene requisito explícito.)

**(l) `activitySummary` del perfil de mascota (#5 R8).**
Rellenarlo obliga a tocar `src/modules/pets/**` (mapper + controller +
`PetsModule`), código de una feature `done`, y a actualizar tres tests que hoy
afirman `toBeNull()`. Opciones: (1) rellenarlo en esta feature (lo pide el plan
006 §Paso 5; coste: diff en #5 + `PetsModule` pasa a depender del cómputo de
actividad, con el riesgo de que `GET /v1/pets/:petId` haga una Query a DynamoDB
en cada carga del perfil); (2) dejarlo `null` y declararlo fuera de alcance
(coherente con que el paso 5 es móvil; el móvil puede llamar a
`/activity/daily?from=hoy&to=hoy`). Shape propuesto por el plan: distancia y
minutos activos **de hoy**. **No decido.**

**(m) Coste del "hoy al vuelo" y de la ventana de 31 días.**
Un día son ~2 880 puntos ⇒ 3 páginas de 1000. Un rango de 31 días con "hoy al
vuelo" son 30 filas de Postgres + 1 día de DynamoDB (3 Queries) — aceptable.
Pero `GET /trips?date=` de un día pasado **siempre** relee DynamoDB (el plan
dice "cachear nada en MVP"). Riesgo declarado como STOP en el plan: acercarse
al límite de 1 MB por página ⇒ paginar internamente (el reader de #9 ya lo
hace vía `lastKey`). La spec debe fijar un tope defensivo de páginas por día
(el consumidor de #8 tiene precedente: `MAX_DRAIN_ITERATIONS = 50`).

**(n) Estrategia de tests.**
Precedente #8/#9: unitarios puros por requisito nombrando el R-id
(`describe('R1: …')`), e2e en `test/<feature>.e2e-spec.ts` contra Postgres +
LocalStack reales, y **workers invocables** (`runOnce()`) para no esperar al
reloj. Los 4 fixtures del plan §Paso 2 (walk.json ≥1 paseo; reposo total → 0;
salto absurdo excluido de la distancia; gap de 20 min parte dos paseos) más el
caso timezone 23:50 `America/Mexico_City` son unitarios puros — el núcleo de la
feature es testeable sin infra. Abierto: si los fixtures sintéticos (reposo,
gap, salto) se versionan como `.json` junto a `walk.json` o se construyen en
el propio `.spec.ts`.

**(o) Documentación de cierre.**
`docs/data-model.md` ya describe `activity_daily` en el catálogo y el ERD, así
que el paso "actualizar data-model" del plan es solo **confirmar/afinar tipos**
(no añadir la fila). Sí faltará: entrada de la env var nueva del cron en
`docs/conventions.md` §Variables de entorno + `.env.example` (regla dura), y
`docs/wialon-module.md` §"Pipeline puro y umbrales" tiene una tabla de
constantes que se quedará incompleta si #10 añade umbrales sin actualizarla.

---

## 6. Convenciones aplicables (docs/conventions.md)

- Kebab-case con sufijo por rol; `*.spec.ts` junto al archivo; e2e en
  `test/<feature>.e2e-spec.ts`; cada `describe` nombra su R-id.
- **Alias `@/...`** obligatorio para cualquier import que cruce de módulo o de
  capa; relativo solo intra-capa (`./constants` dentro de `src/pipeline/` está
  bien — es el patrón de `validate-positions.ts`).
- Tokens de inyección: `Symbol` definido **una vez** junto a la interface, e
  importado en `@Inject(...)` y en el `provide:`.
- Errores de dominio tipados sin `@nestjs/common`; el mapper de infraestructura
  los traduce a HTTP con `code`.
- zod (`z.strictObject`) para toda entrada; `ZodError` → 400.
- Drizzle: `src/db/schema/<module>.schema.ts` + re-export en el barrel
  `index.ts` (drizzle-kit lee `src/db/schema/index.ts`); `pnpm run db:generate`
  y `pnpm exec drizzle-kit migrate` (no hay script `db:migrate`).
- Branch `feature/10-trips-activity` (ya creada); commits conventional en
  inglés con R-ids; PR con `gh pr create`; **el humano mergea**.
- Env nueva ⇒ `docs/conventions.md` + `.env.example` en el **mismo** commit;
  acceso solo vía `ConfigService`.

---

## Recomendación

- **Enfoque sugerido (sin implementarlo)**: funciones puras `trips.ts` y
  `activity.ts` + los 7 umbrales nuevos en `src/pipeline/constants.ts`,
  reutilizando `haversineMeters` y los nombres de flag ya existentes; helper
  puro de timezone con `Intl` (nada de `Temporal`, no existe en este Node;
  nada de dependencia nueva salvo que la spec la justifique); agregador en
  `src/workers/` como servicio con `runOnce(dateOrNow)` invocable + cáscara de
  scheduling gated por env y `NODE_ENV !== 'test'` (calco de
  `IngestionSchedulerService`); controller nuevo con `PetAccessGuard` sin
  `@RequirePetRole`, zod `z.strictObject`, y "ausencia de dato = 200" como en
  #5/#7/#9; migración 0005 con `activity_daily` PK `(pet_id, date)` y
  `time_away_minutes` nullable que #10 nunca escribe.
- **Lo que la spec debe resolver antes de implementar**, por orden de impacto:
  (a) el puerto de lectura de posiciones — condiciona el módulo, el diff sobre
  código `done` y la duplicación; (b) el desfase entre `cron(15 2 * * *)` y el
  día local del owner, junto con la política de "hoy/ayer al vuelo";
  (c) la aritmética de timezone y la firma de `computeDailyActivity`;
  (h) cómo se resuelve el owner y su timezone; (k) los detalles de contrato de
  los tres endpoints; (l) si `activitySummary` entra en esta feature.
- **Riesgo principal**: no es técnico sino de alcance — el plan 006 mezcla
  backend puro (pasos 1-4, esto) con móvil (paso 5). Delimitarlo en la spec
  como se hizo en #8/#9 evita arrastrar `activitySummary` y el anillo de
  progreso a una feature que ya tiene una migración, dos funciones puras, un
  worker nuevo y tres endpoints.
- **Riesgo secundario**: los umbrales son **producto** (condición de STOP del
  plan: *"no los inventes dos veces"*). Si el simulador da 0 paseos con los
  valores del plan, se para y se reporta con números, no se recalibran a ojo.
- **Migración**: una sola (`activity_daily`). Ningún otro cambio de modelo
  (STOP del plan).

**Decisiones abiertas detectadas: 15** — (a) puerto de lectura, (b) hoy al
vuelo vs persistido + desfase del cron, (c) aritmética de timezone,
(d) idempotencia del upsert, (e) tipo de entrada de `groupTrips` y filtrado de
flags, (f) mascotas sin device/sin posiciones/sin owner, (g) mecanismo y
gating del cron, (h) resolución del owner y su timezone, (i) tipos de columna
de `activity_daily`, (j) `src/pipeline/` vs módulo, (k) contrato de los tres
endpoints, (l) `activitySummary` del perfil, (m) coste de lectura y tope de
páginas, (n) estrategia de tests/fixtures, (o) documentación de cierre.
