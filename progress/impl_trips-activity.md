# impl: trips-activity
Fecha: 2026-08-02

Branch: `feature/10-trips-activity`. Spec aprobada por humano 2026-08-02
(`specs/trips-activity/requirements.md`, R1-R23; D1-D15 confirmadas íntegras
tal como las propone `design.md`, commit `7d00fd9`). TDD requisito por
requisito; trazabilidad completa en `specs/trips-activity/traceability.md`
(23/23 filas, **ninguna "pendiente"**).

La feature añade: **una** migración (`0005_activity_daily`), **una** variable
de entorno (`ACTIVITY_AGGREGATOR_ENABLED`), **cero** dependencias nuevas.

## Archivos creados

Núcleo puro `backend-pet-tracker/src/pipeline/` (cero imports de framework):

- `trips.ts` — `groupTrips`, `movementFlags`, `pathDistanceMeters`, `roundTo`, tipos `Trip`/`TripPoint` (R2-R6)
- `trips.spec.ts` — R1, R2, R3, R4, R5, R6 (25 tests, incluye los 4 fixtures del plan)
- `local-day.ts` — `localDayOf`, `localDayRange`, `isSupportedTimeZone`, `isCalendarDate`, `shiftDay`, `listDays`, `InvalidTimeZoneError` (R7)
- `local-day.spec.ts` — R7 (13 tests, incluye barrido de las 418 zonas IANA en 4 días de cambio de horario)
- `activity.ts` — `computeDailyActivity` (R8, R9)
- `activity.spec.ts` — R8, R9

Persistencia:

- `src/db/schema/activity.schema.ts` — tabla `activityDaily` (R10)
- `src/db/migrations/0005_activity_daily.sql` + `meta/0005_snapshot.json` — única migración
- `src/db/schema/index.ts` — **una línea** de re-export

Módulo nuevo `backend-pet-tracker/src/modules/activity/`, tres capas:

- `activity.constants.ts` — política de API/worker (`ACTIVITY_MAX_RANGE_DAYS=31`, `ACTIVITY_DEFAULT_RANGE_DAYS=7`, `ACTIVITY_BASELINE_DAYS=7`, `ACTIVITY_PAGE_LIMIT=1000`, `ACTIVITY_MAX_PAGES_PER_DAY=10`, `ACTIVITY_TICK_INTERVAL_MS=3_600_000`, `ACTIVITY_TICK_NAME`, `ACTIVITY_DAILY_DOC_CLIENT`)
- `domain/entities/daily-activity.entity.ts` — `DailyActivityRow`, `DailyActivityUpsert`, `DayEntry`, `TripSummary`, `TripDetail`
- `domain/errors/activity.errors.ts` — 5 errores tipados, sin `@nestjs/common`
- `domain/repositories/activity-store.ts` — puerto + token `ACTIVITY_STORE`
- `domain/repositories/daily-positions.reader.ts` — puerto + token `DAILY_POSITIONS_READER`
- `domain/week-comparison.ts` (+ `.spec.ts`) — `compareWeek`, función pura sin I/O (R21)
- `application/dto/list-trips.dto.ts`, `application/dto/get-daily-activity.dto.ts` — zod `strictObject` (R17)
- `application/use-cases/aggregate-daily-activity.use-case.ts` (+ `.spec.ts`) — `runOnce(now)` (R14)
- `application/use-cases/list-trips.use-case.ts` (+ `.spec.ts`) — R18, R19, R17
- `application/use-cases/get-daily-activity.use-case.ts` (+ `.spec.ts`) — R20, R21, R17
- `infrastructure/repositories/activity.drizzle.store.ts` — R11, R13, R20
- `infrastructure/repositories/activity.drizzle.store.spec.ts` — R10 (shape de tabla + DDL de la migración)
- `infrastructure/repositories/daily-positions.dynamo.reader.ts` (+ `.spec.ts`) — R12
- `infrastructure/activity-scheduler.service.ts` (+ `.spec.ts`) — cáscara gated (R15) y R22
- `infrastructure/trips.controller.ts` — `pets/:petId/trips` y `/trips/:n` (R16, R18, R19)
- `infrastructure/activity.controller.ts` (+ `activity.controller.spec.ts`) — `pets/:petId/activity/daily` (R16, R20)
- `infrastructure/mappers/activity-error.mapper.ts` — error de dominio → HTTP con `code`
- `activity.module.ts` — importa `PetsModule`; `DocumentClient` propio desde `DYNAMODB_CLIENT`

- `backend-pet-tracker/test/activity.e2e-spec.ts` — 740 líneas contra Postgres + LocalStack: R11, R13, R14, R16, R17, R18, R19, R20, R21

## Archivos modificados

- `backend-pet-tracker/src/pipeline/constants.ts` — **solo se añaden** los siete umbrales de R1; los cinco exports previos conservan nombre y valor
- `backend-pet-tracker/src/app.module.ts` — +2 líneas (import y registro de `ActivityModule`)
- `backend-pet-tracker/src/db/schema/index.ts` — +1 línea
- `.env.example` — `ACTIVITY_AGGREGATOR_ENABLED=true` (+ comentario)
- `docs/conventions.md` — fila de `ACTIVITY_AGGREGATOR_ENABLED` en §Variables de entorno
- `docs/data-model.md` — fila `activity_daily` afinada con los tipos reales de R10
- `docs/wialon-module.md` — los 7 umbrales `TRIP_*` en la tabla de constantes + nota de `local-day.ts`
- `specs/trips-activity/traceability.md` — 23 filas completadas
- `specs/trips-activity/tasks.md` — 69 checkboxes marcados
- `feature_list.json`, `progress/current.md` — bookkeeping del leader; **el implementer no los tocó**

## Requisitos cubiertos

| R | Test | Commit |
|---|---|---|
| R1 | `src/pipeline/trips.spec.ts::R1` | `00d64ab` |
| R2 | `src/pipeline/trips.spec.ts::R2` | `00d64ab` |
| R3 | `src/pipeline/trips.spec.ts::R3` | `00d64ab` |
| R4 | `src/pipeline/trips.spec.ts::R4` | `00d64ab` |
| R5 | `src/pipeline/trips.spec.ts::R5` | `00d64ab` |
| R6 | `src/pipeline/trips.spec.ts::R6` | `00d64ab` |
| R7 | `src/pipeline/local-day.spec.ts::R7` | `00d64ab` |
| R8 | `src/pipeline/activity.spec.ts::R8` | `00d64ab` |
| R9 | `src/pipeline/activity.spec.ts::R9` | `00d64ab` |
| R10 | `activity.drizzle.store.spec.ts::R10` | `850ba74` |
| R11 | `test/activity.e2e-spec.ts::R11` | `1702864` (e2e `2a1ab72`) |
| R12 | `daily-positions.dynamo.reader.spec.ts::R12` | `1702864` |
| R13 | `test/activity.e2e-spec.ts::R13` | `1702864` (e2e `2a1ab72`) |
| R14 | `aggregate-daily-activity.use-case.spec.ts::R14` + `e2e::R14` | `1702864` (e2e `2a1ab72`) |
| R15 | `activity-scheduler.service.spec.ts::R15` | `1702864` |
| R16 | `activity.controller.spec.ts::R16` + `e2e::R16` | `8a2e247` (e2e `2a1ab72`) |
| R17 | `activity.controller.spec.ts::R17` + `list-trips.use-case.spec.ts::R17` + `get-daily-activity.use-case.spec.ts::R17` + `e2e::R17` | `8a2e247` (e2e `2a1ab72`) |
| R18 | `list-trips.use-case.spec.ts::R18` + `e2e::R18` | `8a2e247` (e2e `2a1ab72`) |
| R19 | `list-trips.use-case.spec.ts::R19` + `e2e::R19` | `8a2e247` (e2e `2a1ab72`) |
| R20 | `get-daily-activity.use-case.spec.ts::R20` + `e2e::R20` | `8a2e247` (e2e `2a1ab72`) |
| R21 | `week-comparison.spec.ts::R21` + `get-daily-activity.use-case.spec.ts::R21` + `e2e::R21` | `1702864` + `8a2e247` (e2e `2a1ab72`) |
| R22 | `activity-scheduler.service.spec.ts::R22` | `1702864` (env + `.env.example` + `docs/conventions.md` en el **mismo** commit) + commit de cierre (data-model, wialon-module) |
| R23 | sin test automatizado — verificación de diff y suites (abajo) | verificado sobre `2a1ab72`; registrado en el commit de cierre |

Nombres completos de cada `describe` en `specs/trips-activity/traceability.md`.

## Los 4 fixtures del plan, como tests puros

| Fixture del plan 006 §Paso 2 | Test | Resultado medido |
|---|---|---|
| `walk.json` → ≥ 1 paseo | `trips.spec.ts::R6` "walk.json normalizado da al menos un paseo con distancia positiva" | **1 paseo**, `distanceM = 3 182 m`, `durationMin = 98`, 196 puntos (de 199 aceptados por `normalize()`, 5 descartados del fixture crudo de 204) |
| reposo total → 0 | `trips.spec.ts::R4` "reposo total de 2 h devuelve cero paseos" | 241 puntos a 30 s con `speedKmh = 0` y 0,2 m entre consecutivos → `[]` |
| salto absurdo excluido de la distancia | `trips.spec.ts::R5` "el salto absurdo de walk.json queda fuera de la distancia" | distancia sin exclusión **11 358 m** vs con exclusión **3 182 m** ⇒ diferencia **8 176 m** (el requisito pide ≥ 900) |
| gap de 20 min parte dos paseos | `trips.spec.ts::R3` "un gap de 20 min parte la serie en dos paseos" | 2 paseos; `trips[0].endTs` = `ts` del punto anterior al gap |

**Condición de STOP del plan 006 no disparada**: con los umbrales literales de
R1, `walk.json` da 1 paseo con movimiento evidente. No se recalibró nada.

## Casos DST obligatorios (R7)

| Caso | Esperado | Medido |
|---|---|---|
| `localDayOf('2026-08-03T05:50:00.000Z', 'America/Mexico_City')` | `'2026-08-02'` | ✅ |
| `localDayRange('2026-03-29', 'Europe/Madrid')` | 82 800 000 ms (23 h) | ✅ |
| `localDayRange('2026-10-25', 'Europe/Madrid')` | 90 000 000 ms (25 h) | ✅ |
| Medianoche local inexistente (`America/Santiago` 2026-09-06) | el día arranca en el salto (01:00 local = 04:00 UTC) | ✅ |
| Invariante en las **418** zonas del catálogo × 4 días de cambio | `startMs` pertenece al día, `startMs − 1` no, `endMs` ya no, duración 22-26 h | ✅ (0 infractores) |

`endMs` se calcula **siempre** como el `startMs` del día siguiente; no hay
ningún `+ 86_400_000` en `local-day.ts`.

## Verificación de no regresión — R23

`git diff main --name-only` = 51 archivos, todos dentro de la lista de R23:

- `backend-pet-tracker/src/modules/activity/**` — 26 archivos (módulo nuevo)
- `backend-pet-tracker/src/pipeline/{trips,activity,local-day}.{ts,spec.ts}` + `constants.ts` (solo añadidos)
- `backend-pet-tracker/src/db/{schema/activity.schema.ts, schema/index.ts (+1 línea), migrations/0005_*, migrations/meta/*}`
- `backend-pet-tracker/src/app.module.ts` (+2 líneas), `backend-pet-tracker/test/activity.e2e-spec.ts`
- `.env.example`, `docs/{conventions,data-model,wialon-module}.md`
- `specs/trips-activity/**`, `progress/**`, `feature_list.json`

Cero cambios en los prohibidos. Verificado con:

```
git diff main --name-only -- \
  'backend-pet-tracker/src/modules/pets/**' 'backend-pet-tracker/src/modules/positions/**' \
  'backend-pet-tracker/src/modules/devices/**' 'backend-pet-tracker/src/modules/users/**' \
  'backend-pet-tracker/src/modules/auth/**' 'backend-pet-tracker/src/workers/**' \
  'backend-pet-tracker/src/integrations/**' 'backend-pet-tracker/src/aws/**' \
  'backend-pet-tracker/package.json' 'backend-pet-tracker/pnpm-lock.yaml' \
  'backend-pet-tracker/tsconfig*.json'
→ (vacío)

git diff main --name-only -- 'backend-pet-tracker/src/db/migrations/*.sql'
→ backend-pet-tracker/src/db/migrations/0005_activity_daily.sql   (exactamente una)
```

- **D12 respetada**: `src/modules/pets/**` intacto. `activitySummary` sigue
  `null` y los tres tests que lo afirman (`pet-profile-response.mapper.spec.ts`,
  `test/pets.e2e-spec.ts:360`, `test/devices.e2e-spec.ts:630`) siguen verdes.
- **Contratos de #8 y #9 intactos**: el shape del item de DynamoDB solo se
  **lee**; `PositionsModule` no ganó `exports` ni se modificó.
- **Cero dependencias nuevas**: `package.json` y `pnpm-lock.yaml` sin tocar.

**Veredicto R23: OK.**

### `git diff main --stat` (resumen)

```
 .env.example                                       |   6 +
 backend-pet-tracker/src/app.module.ts              |   2 +
 .../src/db/migrations/0005_activity_daily.sql      |  20 +
 .../src/db/migrations/meta/0005_snapshot.json      | 958 +++++++++++++++++++++
 .../src/db/migrations/meta/_journal.json           |   7 +
 .../src/db/schema/activity.schema.ts               |  60 ++
 backend-pet-tracker/src/db/schema/index.ts         |   1 +
 .../src/modules/activity/activity.constants.ts     |  33 +
 .../src/modules/activity/activity.module.ts        |  49 ++
 .../application/dto/get-daily-activity.dto.ts      |  15 +
 .../activity/application/dto/list-trips.dto.ts     |  17 +
 .../aggregate-daily-activity.use-case.spec.ts      | 241 ++++++
 .../use-cases/aggregate-daily-activity.use-case.ts | 121 +++
 .../use-cases/get-daily-activity.use-case.spec.ts  | 372 ++++++++
 .../use-cases/get-daily-activity.use-case.ts       | 229 +++++
 .../use-cases/list-trips.use-case.spec.ts          | 231 +++++
 .../application/use-cases/list-trips.use-case.ts   | 136 +++
 .../domain/entities/daily-activity.entity.ts       |  67 ++
 .../activity/domain/errors/activity.errors.ts      |  47 +
 .../activity/domain/repositories/activity-store.ts |  43 +
 .../domain/repositories/daily-positions.reader.ts  |  20 +
 .../activity/domain/week-comparison.spec.ts        |  85 ++
 .../src/modules/activity/domain/week-comparison.ts |  55 ++
 .../activity-scheduler.service.spec.ts             | 154 ++++
 .../infrastructure/activity-scheduler.service.ts   |  61 ++
 .../infrastructure/activity.controller.spec.ts     | 229 +++++
 .../activity/infrastructure/activity.controller.ts |  61 ++
 .../mappers/activity-error.mapper.ts               |  60 ++
 .../repositories/activity.drizzle.store.spec.ts    | 160 ++++
 .../repositories/activity.drizzle.store.ts         | 192 +++++
 .../daily-positions.dynamo.reader.spec.ts          | 222 +++++
 .../repositories/daily-positions.dynamo.reader.ts  | 128 +++
 .../activity/infrastructure/trips.controller.ts    |  87 ++
 backend-pet-tracker/src/pipeline/activity.spec.ts  | 223 +++++
 backend-pet-tracker/src/pipeline/activity.ts       |  93 ++
 backend-pet-tracker/src/pipeline/constants.ts      |  29 +
 backend-pet-tracker/src/pipeline/local-day.spec.ts | 146 ++++
 backend-pet-tracker/src/pipeline/local-day.ts      | 227 +++++
 backend-pet-tracker/src/pipeline/trips.spec.ts     | 473 ++++++++++
 backend-pet-tracker/src/pipeline/trips.ts          | 224 +++++
 backend-pet-tracker/test/activity.e2e-spec.ts      | 740 ++++++++++++++++
 docs/conventions.md                                |   1 +
 docs/data-model.md                                 |   2 +-
 docs/wialon-module.md                              |  15 +
 feature_list.json                                  |   2 +-
 progress/current.md                                |  14 +-
 progress/explore_trips-activity.md                 | 775 +++++++++++++++++
 specs/trips-activity/design.md                     | 564 ++++++++++++
 specs/trips-activity/requirements.md               | 525 +++++++++++
 specs/trips-activity/tasks.md                      | 180 ++++
 specs/trips-activity/traceability.md               |  46 +
 51 files changed, 8442 insertions(+), 6 deletions(-)
```

(Capturado antes del commit de cierre, que añade este reporte y actualiza
`traceability.md` / `tasks.md` — todo dentro del ámbito permitido.)

## Comandos de verificación

```bash
docker compose up -d                                   # Postgres 17 + LocalStack
cd backend-pet-tracker
DATABASE_URL=... pnpm exec drizzle-kit migrate          # aplica la 0005
pnpm run provision:local                                # tabla positions + colas
cd .. && ./init.sh                                      # build + unit + lint + typecheck
cd backend-pet-tracker && pnpm run test:e2e             # Postgres + LocalStack reales
```

## Output de `./init.sh`

```
→ Verificando entorno...
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)
→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida
→ Instalando dependencias...
✅ Dependencias instaladas
→ Verificando coherencia del harness...
✅ Archivos del harness presentes
✅ STATUS.md sincronizado con feature_list.json
→ Build...
✅ Build exitoso
→ Ejecutando tests...
Test Suites: 88 passed, 88 total
Tests:       606 passed, 606 total
✅ Tests pasados
→ Lint...
✅ Lint sin errores
→ Typecheck...
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Output de `pnpm run test:e2e`

```
Test Suites: 8 passed, 8 total
Tests:       111 passed, 111 total
Time:        42.608 s
```

Suite nueva `test/activity.e2e-spec.ts`: 27 tests. Delta respecto al cierre de
#9 (`progress/impl_positions-api.md`: 482 unit / 84 e2e): **+124 unit** (los
124 tests nuevos de esta feature) y **+27 e2e**, exactamente los añadidos.
Ninguna suite previa se modificó ni se rompió.

## Decisiones de implementación y desviaciones declaradas

1. **`Intl.supportedValuesOf('timeZone')` NO incluye `'UTC'`** en el Node
   v24.16.0 del proyecto (418 zonas canónicas, comprobado ejecutándolo; tampoco
   `Etc/UTC` ni `Etc/GMT`). R7 manda lanzar `InvalidTimeZoneError` para lo que
   no esté en ese catálogo, y R13 manda degradar a `'UTC'` — leído al pie de la
   letra, el fallback de R13 haría reventar a toda mascota sin owner válido, y
   `users.timezone` tiene **default `'UTC'`** en el schema de #3. Reconciliación
   aplicada, en una línea y documentada en el propio archivo:
   `SUPPORTED_TIME_ZONES = new Set([...Intl.supportedValuesOf('timeZone'), 'UTC'])`.
   `'Marte/Olympus'` sigue rechazado. **Es la desviación más relevante del
   reporte; el reviewer debería confirmarla explícitamente.**
2. **R1 "importar los umbrales en `trips.ts` y `activity.ts`"**: `trips.ts` los
   importa de `./constants`; `activity.ts` los consume **a través de**
   `movementFlags` / `groupTrips` / `pathDistanceMeters` de `./trips` en vez de
   reimportarlos, para no tener dos copias de las reglas de R2 y R5. La
   sustancia de R1 se cumple y está testeada: fuente única en `constants.ts` y
   **cero literales de umbral** en los dos archivos (el test verifica los tres
   valores inequívocos —1.8, 0.5, 100—; los otros cuatro (3, 10, 15, 5) chocan
   con aritmética legítima y quedan a la inspección del reviewer, como la propia
   R1 declara).
3. **R10 se testea desde `src/modules/activity/infrastructure/repositories/activity.drizzle.store.spec.ts`**,
   no desde un `src/db/schema/activity.schema.spec.ts` como pediría la
   convención de "test junto al archivo": R23 no incluye ese segundo archivo en
   su lista y el módulo sí es territorio permitido. El test cubre lo que R10
   exige (shape de tabla, PK compuesta, FK CASCADE, tipos, CHECKs, una sola
   migración con un único `CREATE TABLE`, re-export de una línea).
4. **R11 y R14 se reparten la verificación del upsert**: R14 impone saltar la
   mascota cuya fila ya está fresca, así que un segundo `runOnce()` **salta** en
   vez de reescribir. La idempotencia del `ON CONFLICT` (misma fila,
   `computed_at` actualizado, métricas idénticas, `time_away_minutes = 42`
   preservado) se comprueba llamando dos veces a `store.upsertDailyActivity()`;
   el skip y el "no duplica" se comprueban con dos `runOnce()`. Ambos en el e2e.
5. **`date` del `warn` de R12**: el reader recibe `(petId, startMs, endMs)` y no
   conoce la timezone del owner, así que loguea la fecha UTC de `startMs`.
   Suficiente para localizar el día en un log; la firma es la que fija R12.
6. **Migración renombrada** de `0005_past_dagger.sql` (nombre aleatorio de
   drizzle-kit) a `0005_activity_daily.sql`, con el `tag` de `meta/_journal.json`
   actualizado — mismo criterio que `0003_pets_crud_tables` y
   `0004_devices_claim_tables`.
7. **`app.module.ts` son +2 líneas**, no una: el import y el registro en
   `imports:`. Idéntico a lo que hizo #9 con `PositionsModule`.
8. **R20 dice "las nueve claves métricas"** pero la entrada tiene 10 claves, de
   las que 8 son métricas (`date` y `source` no lo son). Implementadas las 8 a
   `null` en `source: 'missing'`, que es la intención literal ("nunca ceros").
9. **Disciplina TDD**: R1-R17 se hicieron rojo → verde → refactor requisito por
   requisito. En R18-R21 el caso de uso y su `.spec.ts` se escribieron en el
   mismo paso (el spec pasó a la primera), y el contrato de extremo a extremo lo
   fija el e2e posterior — mismo patrón que declaró #9 para sus e2e. Se declara
   aquí en vez de disfrazarlo.

## Notas para el reviewer

- **Confirmar la desviación (1)**: es la única decisión que se aparta de la
  letra de un requisito. Sin ella, `runOnce()` fallaría para toda mascota cuyo
  owner tenga la timezone por defecto del schema.
- **Pureza de capas verificada por test, no solo por inspección**:
  `trips.ts` solo importa `./constants`, `./geo` y `./types`; `activity.ts`
  solo `./trips` y `./types`; `local-day.ts` **no importa nada**;
  `week-comparison.ts` **no importa nada**; `activity.errors.ts` no menciona
  `@nestjs`. Hay un `it(...)` para cada una de esas cinco afirmaciones.
- **El agregador no arranca en los e2e**: `ActivitySchedulerService` solo
  registra el intervalo con `ACTIVITY_AGGREGATOR_ENABLED === 'true'` **y**
  `NODE_ENV !== 'test'`; el e2e invoca `runOnce()` a mano. El log
  `activity aggregator scheduled (tick 3600000 ms)` que aparece en la salida de
  `init.sh` viene del propio test de R15 (config falsa con
  `NODE_ENV=development` y `SchedulerRegistry` doble, con fake timers).
- **`PositionsModule` intacto**: sin `exports` nuevos. `ListPositionsUseCase` no
  se reutiliza en ninguna ruta de código de #10 (D1 opción B).
- **Riesgo abierto — coste de `/trips?date=` de días pasados**: el plan excluye
  cachear en MVP, así que cada petición relee DynamoDB (≤ 10 Query por el tope
  de `ACTIVITY_MAX_PAGES_PER_DAY`). Es lo que fija D13; conviene tenerlo
  presente si el móvil pagina el historial agresivamente.
- **Riesgo abierto — un solo owner activo**: nada en el schema impide varias
  filas `pet_users` con `role='owner'` y `status='active'`. El store desempata
  por `pet_users.created_at` ascendente (R13); no hay constraint que lo
  garantice y ninguna feature la ha pedido.
- **Árbol de trabajo limpio al cerrar**: `git status --porcelain` sale vacío;
  no quedan archivos temporales ni sin versionar. (Al abrir la sesión aparecía
  `backend-pet-tracker/scripts/r6-evidence.tmp.ts`, guion temporal de #9; ya no
  está en el árbol y nunca estuvo versionado.)
- **Bookkeeping**: `feature_list.json` sigue como lo dejó el leader y
  `progress/current.md` tampoco lo tocó el implementer. No se abrió PR ni se
  mergeó nada.
