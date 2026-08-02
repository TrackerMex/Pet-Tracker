# impl: positions-api
Fecha: 2026-08-02

Branch: `feature/9-positions-api`. Spec aprobada por humano 2026-08-02
(`specs/positions-api/requirements.md`, R1-R16, D1-D6 aprobadas íntegras).
TDD requisito por requisito; trazabilidad completa en
`specs/positions-api/traceability.md` (16/16 filas, ninguna "pendiente").
Feature de **solo lectura**: cero migraciones, cero variables de entorno
nuevas, cero dependencias nuevas.

## Archivos creados

Módulo nuevo `backend-pet-tracker/src/modules/positions/`, 3 capas:

- `domain/entities/position.entity.ts` — `CachedPosition` / `StoredPosition` (tipos puros)
- `domain/errors/position.errors.ts` — `InvalidRangeError` / `RangeTooLargeError` / `InvalidCursorError`, sin imports de framework
- `domain/cursor.ts` — `encodeCursor` / `decodeCursor` puros, sobre base64url `{v,p,q,k}` (R13/R14)
- `domain/cursor.spec.ts` — R13 (round-trip) y R14 (basura, versión, campos incompletos)
- `domain/stale-seconds.ts` — `staleSeconds(ts, now)` = `max(0, floor((now−ts)/1000))` (R4)
- `domain/stale-seconds.spec.ts` — R4 con reloj fijo
- `domain/repositories/last-position.reader.ts` — puerto + token `LAST_POSITION_READER`
- `domain/repositories/position-history.reader.ts` — puerto + token `POSITION_HISTORY_READER`
- `application/dto/cached-position.dto.ts` — zod del jsonb `pets.last_position` (R3/R5)
- `application/dto/list-positions.dto.ts` — `ListPositionsQuerySchema` zod `.strict()` (R7)
- `application/dto/list-positions.dto.spec.ts` — R7
- `application/use-cases/get-last-position.use-case.ts` — R3/R4/R5 (no recibe cliente DynamoDB alguno)
- `application/use-cases/get-last-position.use-case.spec.ts` — R3, R5
- `application/use-cases/list-positions.use-case.ts` — R8-R15
- `application/use-cases/list-positions.use-case.spec.ts` — R8, R9, R11, R12, R13, R14, R15
- `infrastructure/positions.controller.ts` — dos rutas bajo `@Controller('pets/:petId/positions')` + `@UseGuards(PetAccessGuard)` sin `@RequirePetRole` (R1/R2)
- `infrastructure/positions.controller.spec.ts` — R1, R2, R5, R7
- `infrastructure/mappers/position-response.mapper.ts` — item DynamoDB → camelCase, lista explícita de campos (R11)
- `infrastructure/mappers/position-response.mapper.spec.ts` — R11
- `infrastructure/mappers/position-error.mapper.ts` — error de dominio → `BadRequestException` con código (`INVALID_RANGE` / `RANGE_TOO_LARGE` / `INVALID_CURSOR`)
- `infrastructure/repositories/last-position.drizzle.reader.ts` — `SELECT last_position FROM pets WHERE id = $1`
- `infrastructure/repositories/position-history.dynamo.reader.ts` — una `Query` por página (R10)
- `infrastructure/repositories/position-history.dynamo.reader.spec.ts` — R10
- `positions.constants.ts` — `DEFAULT_RANGE_MINUTES=60`, `MAX_RANGE_HOURS=24`, `POSITIONS_PAGE_LIMIT=1000`, `CURSOR_VERSION=1`, `POSITIONS_READ_DOC_CLIENT`
- `positions.module.ts` — importa `PetsModule`; `DocumentClient` propio desde `DYNAMODB_CLIENT` (D6)
- `backend-pet-tracker/test/positions.e2e-spec.ts` — 619 líneas contra Postgres + LocalStack reales: R1, R3, R5, R7, R9, R10, R11, R12, R13, R14, R15

## Archivos modificados

- `backend-pet-tracker/src/app.module.ts` — +2 líneas: import y registro de `PositionsModule` (único cambio fuera del módulo nuevo)
- `specs/positions-api/traceability.md` — 16 filas completadas (test + commit)
- `specs/positions-api/tasks.md` — checkboxes marcados + nota de cierre en R6 y R16
- `feature_list.json` — `pending` → `in_progress` (bookkeeping del leader, no lo tocó el implementer; ver hallazgo en §R16)
- `progress/current.md` — sesión activa (lo mantiene el leader)

## Requisitos cubiertos

| R | Test | Commit |
|---|---|---|
| R1 | `positions.controller.spec.ts::R1` + `test/positions.e2e-spec.ts::R1` | `24db036` (e2e `d862b62`) |
| R2 | `positions.controller.spec.ts::R2` | `24db036` |
| R3 | `get-last-position.use-case.spec.ts::R3` + `e2e::R3` | `b1cc940` (e2e `d862b62`) |
| R4 | `stale-seconds.spec.ts::R4` | `4d0d5bf` |
| R5 | `get-last-position.use-case.spec.ts::R5` + `positions.controller.spec.ts::R5` + `e2e::R5` | `b1cc940`, `24db036` (e2e `d862b62`) |
| R6 | evidencia manual (abajo) | verificado sobre `d862b62`; registrado en el commit de cierre |
| R7 | `list-positions.dto.spec.ts::R7` + `positions.controller.spec.ts::R7` + `e2e::R7` | `01c6de6`, `24db036` (e2e `d862b62`) |
| R8 | `list-positions.use-case.spec.ts::R8` | `c922e85` |
| R9 | `list-positions.use-case.spec.ts::R9` + `e2e::R9` | `c922e85` (e2e `d862b62`) |
| R10 | `position-history.dynamo.reader.spec.ts::R10` + `e2e::R10` | `4a68b23` (e2e `d862b62`) |
| R11 | `position-response.mapper.spec.ts::R11` + `list-positions.use-case.spec.ts::R11` + `e2e::R11` | `4a68b23`, `ae7e0ef` (e2e `d862b62`) |
| R12 | `list-positions.use-case.spec.ts::R12` + `e2e::R12` | `ae7e0ef` (e2e `d862b62`) |
| R13 | `cursor.spec.ts::R13` + `list-positions.use-case.spec.ts::R13` + `e2e::R13` | `db61572`, `c3cc018` (e2e `d862b62`) |
| R14 | `cursor.spec.ts::R14` + `list-positions.use-case.spec.ts::R14` + `e2e::R14` | `db61572`, `c3cc018` (e2e `d862b62`) |
| R15 | `list-positions.use-case.spec.ts::R15` + `e2e::R15` | `ae7e0ef` (e2e `d862b62`) |
| R16 | verificación de diff + suites (abajo) | verificado sobre `d862b62`; registrado en el commit de cierre |

Nombres completos de cada `describe` en `specs/positions-api/traceability.md`.

## Evidencia manual — R6

Criterio: `GET /v1/pets/:petId/positions/last` → `200`, `lat`/`lng` no nulos y
`staleSeconds < 120` con la cadena real simulador → poller → SQS → consumidor
→ Postgres (ningún dato sembrado a mano).

Procedimiento (2026-08-02, todo local contra Docker; guion temporal
`backend-pet-tracker/scripts/r6-evidence.tmp.ts`, borrado tras la corrida):

```bash
docker compose up -d                                  # Postgres 17 + LocalStack
cd backend-pet-tracker
pnpm exec drizzle-kit migrate                          # migraciones al día
pnpm run provision:local                               # tabla positions + colas SQS
# guion: POLLER_ENABLED=true SIM_MODE=true, arranca AppModule en :3199, siembra
# devices simulados, crea user + pet, POST /v1/devices/claim {ACT-002},
# espera 150 s de ciclos reales del cron y consulta la ruta.
pnpm exec ts-node -r tsconfig-paths/register scripts/r6-evidence.tmp.ts
```

Log de arranque relevante:

```
[RouterExplorer] Mapped {/v1/pets/:petId/positions/last, GET} route
[RouterExplorer] Mapped {/v1/pets/:petId/positions, GET} route
[IngestionSchedulerService] ingestion workers scheduled (poller 60000 ms, consumer 15000 ms)
[r6] pet created: 019fc42e-5117-78c8-addb-ee68d7586e62 status 201
[r6] claim status: 201 at 2026-08-02T20:33:17.687Z
[r6] waiting 150s for real poller/consumer cron cycles...
```

Salida literal del bloque de evidencia:

```
=== R6 EVIDENCE ===
requested_at: 2026-08-02T20:35:47.689Z
http_status: 200
body: {"lat":19.426436441538392,"lng":-99.11776646817343,"ts":1785702900000,"accuracy":5.054748742841184,"battery":59,"staleSeconds":47}
device_ts_iso: 2026-08-02T20:35:00.000Z
staleSeconds: 47
===================
history_status: 200 items: 24
```

| Momento (UTC) | Observación |
|---|---|
| 20:33:17.687 | claim `ACT-002` → 201 (pet `019fc42e-5117-78c8-addb-ee68d7586e62`) |
| 20:35:00.000 | `device_ts` de la última posición ingerida por la cadena real |
| 20:35:47.689 | `GET /v1/pets/:petId/positions/last` → **200**, `staleSeconds: 47` |
| 20:35:47 | `GET /v1/pets/:petId/positions` (sin query) → **200**, 24 items en la ventana por defecto de 60 min |

**Veredicto R6: OK.** `http_status = 200`, `staleSeconds = 47 < 120`,
`lat = 19.4264…` / `lng = −99.1178…` reales (zona `SIM_HOME_*` del simulador),
`battery = 59`, `accuracy = 5.05`. Las 6 claves de R3 y ninguna más. El guion
limpia tras de sí (borra pet, user, audit_log y devuelve el device SIM-002 a
`available`); los items de DynamoDB del pet de evidencia expiran por TTL y no
interfieren (pk única).

## Verificación de no regresión — R16

`git diff main --name-only` = 33 archivos. Ámbito real:

- `backend-pet-tracker/src/modules/positions/**` — 26 archivos (módulo nuevo)
- `backend-pet-tracker/src/app.module.ts` — +2 líneas (import + registro)
- `backend-pet-tracker/test/positions.e2e-spec.ts` — 1 archivo nuevo
- `specs/positions-api/**` — 4 archivos
- `progress/current.md` — 1 archivo
- `feature_list.json` — **hallazgo, ver abajo**

Cero cambios en: `src/db/**` (⇒ **cero migraciones Drizzle**), `src/workers/**`,
`src/pipeline/**`, `src/modules/pets/**`, `src/modules/devices/**`,
`src/aws/**`, `package.json`, `pnpm-lock.yaml`, `.env.example` y
`docs/conventions.md` (ninguna variable de entorno nueva). Verificado con:

```
git diff main --name-only -- 'backend-pet-tracker/drizzle*' 'backend-pet-tracker/src/db/**' \
  'backend-pet-tracker/src/workers/**' 'backend-pet-tracker/src/pipeline/**' \
  'backend-pet-tracker/src/modules/pets/**' 'backend-pet-tracker/src/modules/devices/**' \
  'backend-pet-tracker/package.json' 'backend-pet-tracker/pnpm-lock.yaml' '.env.example'
→ (vacío)
```

El contrato de `GET /v1/pets` y `GET /v1/pets/:petId` (R8 de #5) está intacto
por construcción: `src/modules/pets/**` no se tocó y sus e2e siguen verdes.

### Hallazgo (fuera de la lista permitida)

- `feature_list.json` (1 línea): `"status": "pending"` → `"in_progress"` para
  la feature #9. Es bookkeeping del ciclo SDD que hace el leader tras el gate
  humano (`AGENTS.md` §6), no código de aplicación ni cambio de contrato. Se
  reporta porque cae fuera de la lista literal de R16; no se revierte porque
  revertirlo dejaría el estado del harness incoherente con la sesión en curso.
- `progress/current.md` también está en el diff y sí está dentro de lo
  permitido (`progress/**`); lo mantiene el leader, el implementer no lo tocó.

### `git diff main --stat`

```
 backend-pet-tracker/src/app.module.ts              |   2 +
 .../application/dto/cached-position.dto.ts         |  20 +
 .../application/dto/list-positions.dto.spec.ts     |  67 +++
 .../application/dto/list-positions.dto.ts          |  19 +
 .../use-cases/get-last-position.use-case.spec.ts   | 136 +++++
 .../use-cases/get-last-position.use-case.ts        |  65 +++
 .../use-cases/list-positions.use-case.spec.ts      | 486 ++++++++++++++++
 .../use-cases/list-positions.use-case.ts           | 121 ++++
 .../src/modules/positions/domain/cursor.spec.ts    | 136 +++++
 .../src/modules/positions/domain/cursor.ts         |  80 +++
 .../positions/domain/entities/position.entity.ts   |  33 ++
 .../positions/domain/errors/position.errors.ts     |  29 +
 .../domain/repositories/last-position.reader.ts    |  15 +
 .../domain/repositories/position-history.reader.ts |  30 +
 .../modules/positions/domain/stale-seconds.spec.ts |  23 +
 .../src/modules/positions/domain/stale-seconds.ts  |  11 +
 .../mappers/position-error.mapper.ts               |  39 ++
 .../mappers/position-response.mapper.spec.ts       |  94 ++++
 .../mappers/position-response.mapper.ts            |  35 ++
 .../infrastructure/positions.controller.spec.ts    | 190 +++++++
 .../infrastructure/positions.controller.ts         |  91 +++
 .../repositories/last-position.drizzle.reader.ts   |  27 +
 .../position-history.dynamo.reader.spec.ts         | 211 +++++++
 .../repositories/position-history.dynamo.reader.ts |  70 +++
 .../src/modules/positions/positions.constants.ts   |  24 +
 .../src/modules/positions/positions.module.ts      |  44 ++
 backend-pet-tracker/test/positions.e2e-spec.ts     | 619 +++++++++++++++++++++
 feature_list.json                                  |   2 +-
 progress/current.md                                |   9 +-
 specs/positions-api/design.md                      | 224 ++++++++
 specs/positions-api/requirements.md                | 310 +++++++++++
 specs/positions-api/tasks.md                       | 120 ++++
 specs/positions-api/traceability.md                |  31 ++
 33 files changed, 3408 insertions(+), 5 deletions(-)
```

(Capturado antes del commit de cierre, que añade `progress/impl_positions-api.md`
y actualiza `specs/positions-api/traceability.md` y `tasks.md` — todo dentro
del ámbito permitido.)

**Veredicto R16: OK**, con el hallazgo de `feature_list.json` declarado arriba.

## Comandos de verificación

```bash
docker compose up -d
cd backend-pet-tracker && pnpm exec drizzle-kit migrate && pnpm run provision:local
./init.sh                                   # build + unit + lint + typecheck
cd backend-pet-tracker && pnpm run test:e2e # contra Postgres + LocalStack reales
```

## Output de build

```
→ Build...

> backend-pet-tracker@0.0.1 build C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> nest build && tsc-alias -p tsconfig.build.json

✅ Build exitoso
```

## Output de tests

```
./init.sh (unit + lint + typecheck):
  Test Suites: 77 passed, 77 total
  Tests:       482 passed, 482 total
  Time:        12.654 s
  ✅ Tests pasados / ✅ Lint sin errores / ✅ Typecheck sin errores
  ✅ Todo verde. Listo para trabajar.

pnpm run test:e2e (Docker Postgres 17 + LocalStack):
  Test Suites: 7 passed, 7 total
  Tests:       84 passed, 84 total
  Time:        40.27 s
```

Delta respecto a #8: 482 unit (eran 397) y 84 e2e (eran 58). Ninguna suite
previa se modificó ni se rompió.

## Decisiones de diseño (y desviaciones respecto al design.md)

- **`positions.constants.ts` en la raíz del módulo, no en `infrastructure/`**
  (el `design.md` lo situaba en `infrastructure/positions.constants.ts`). Se
  movió porque `domain/cursor.ts` consume `CURSOR_VERSION` y
  `application/use-cases/list-positions.use-case.ts` consume
  `DEFAULT_RANGE_MINUTES` / `MAX_RANGE_HOURS`: dejarlo en `infrastructure`
  habría hecho que domain y application importen hacia afuera, violando la
  regla de dependencia de `docs/architecture.md`. El archivo es núcleo puro
  salvo el `Symbol` de inyección. Razón documentada en su cabecera.
- **`infrastructure/mappers/position-error.mapper.ts`** no aparece en el árbol
  del `design.md`: es la traducción error de dominio → HTTP que el design sí
  especifica en prosa (tabla `InvalidRangeError`/`RangeTooLargeError`/
  `InvalidCursorError` → 400 + código). Se extrajo a su propio archivo en vez
  de inlinear el `try/catch` en el controller.
- **D1-D6 implementadas tal como se aprobaron**: por defecto se ocultan solo
  los `low_accuracy` (los `suspect_jump` se devuelven); `200` con body `null`
  cuando no hay caché; cursor base64url sin firma; `to = now`,
  `from = to − 60 min`, `Limit = 1000` fijo; orden ascendente y `staleSeconds`
  contra el reloj del servidor; `DocumentClient` propio del módulo.
- **Los e2e llegaron en un commit `test(...)` posterior** (`d862b62`) al
  código que cubren, igual que en #8: la fase roja se hizo con los tests
  unitarios de cada requisito (que sí preceden o acompañan a su
  implementación) y el e2e fija el contrato de extremo a extremo sobre
  Postgres + LocalStack reales. Los R-ids del mensaje del commit lo declaran.
- **Guion de evidencia de R6 no versionado**: `scripts/r6-evidence.tmp.ts` era
  temporal (`.tmp.ts`), se borró tras capturar la evidencia. El procedimiento
  queda reproducible en §"Evidencia manual — R6"; si el reviewer prefiere
  conservarlo como script permanente (`scripts/r6-evidence.ts` + entrada en
  `package.json`), es una decisión suya: implicaría tocar `package.json`, que
  R16 no cubre y hoy está intacto.

## Notas para el reviewer

- **R6 depende de crons reales**: la corrida usa `ACT-002` / `SIM-002` para no
  chocar con `ACT-001` / `SIM-001`, que reclama el e2e de #8. Si se repite la
  corrida, hay que tener LocalStack levantado y provisionado: sin él, el
  poller loguea `cannot resolve queue url` y `staleSeconds` no baja de 120.
- **Pureza de capas**: `application/` no importa `@aws-sdk/*` ni
  `drizzle-orm`; `domain/` no importa `@nestjs/*`. Verificable por inspección
  de imports en los 8 archivos de `domain/` y 5 de `application/`.
- **R2 no tiene e2e propio**: se verifica por inspección del controller (lee
  `request.petMembership.petId`, nunca `@Param`) y de rebote por el e2e de R14
  (cursor de la mascota A reenviado en la ruta de la mascota B con un usuario
  miembro de ambas → 400 y cero items de A).
- **Ruido en el log de e2e**: la suite imprime un error de FK
  `pet_users_user_id_users_id_fk` con stack de `PetsController.create`. Es el
  test **preexistente** `test/pets.e2e-spec.ts:221`, que provoca el fallo a
  propósito (`expect(response.status).toBeGreaterThanOrEqual(500)`); no es una
  regresión de esta feature y la suite queda en verde.
- **Cursor sin firma (D3)**: aprobado en el gate. La defensa es que la `pk`
  siempre se reconstruye desde `request.petMembership.petId`; conviene que el
  reviewer confirme esa línea en `list-positions.use-case.ts` y en
  `position-history.dynamo.reader.ts`.
- `feature_list.json` sigue en `in_progress`: el implementer no marca `done`
  (regla dura de `CLAUDE.md`); lo hace el humano tras el review.
