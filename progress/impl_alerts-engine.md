# impl: alerts-engine
Fecha: 2026-08-07

Branch: `feature/12-alerts-engine`
Último commit: `df1270f` (`test(alerts-engine): e2e over Postgres/LocalStack and R19 static purity guard (R18,R19)`)

Commits de la feature (orden cronológico):
- `ae21e51` docs(alerts-engine): approve spec, mark feature in_progress
- `b4448ca` feat(alerts-engine): alert_events table with anti-spam unique index (R1,R2)
- `2ba4502` feat(alerts-engine): geofence-events queue, DLQ and EventBridge rule provisioning (R3,R4)
- `193ff9d` feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17)
- `df1270f` test(alerts-engine): e2e over Postgres/LocalStack and R19 static purity guard (R18,R19)

## Archivos creados

- `backend-pet-tracker/src/db/schema/alerts.schema.ts` — tabla `alert_events` (R1), índice único parcial anti-spam (R2).
- `backend-pet-tracker/src/db/schema/alerts.schema.spec.ts` — test unitario del schema/migración (R1, R2).
- `backend-pet-tracker/src/db/migrations/0007_narrow_whirlwind.sql` (+ `meta/0007_snapshot.json`, `meta/_journal.json` actualizado) — migración generada con `drizzle-kit generate`, aplicada localmente con `drizzle-kit migrate`.
- `backend-pet-tracker/src/aws/provisioning.geofence-events.spec.ts` — tests de `provisionGeofenceEventsRoute()` (R3, R4).
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine.constants.ts` — `ALERT_TYPE_GEOFENCE_EXIT`/`ALERT_TYPE_BATTERY_LOW`, parámetros de recepción SQS.
- `backend-pet-tracker/src/workers/alerts-engine/geofence-event-message.schema.ts` — zod: sobre EventBridge genérico + schemas de detail por tipo (R5).
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine-store.ts` — puerto `AlertsEngineStore` + token (D2, mismo criterio D14 de #8: no se extiende `GeofenceRepository`).
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine.drizzle.store.ts` — implementación Drizzle del puerto (sin spec unitario propio, mismo criterio que `IngestionDrizzleStore` — cobertura vía e2e).
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine-consumer.service.ts` — `drainOnce()`/`consumeMessage()`/`handleMessage()`, lógica de R5-R16.
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts` — 29 tests (R5-R16).
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine-scheduler.service.ts` — cascarón de scheduling gateado (R17).
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine-scheduler.service.spec.ts` — 6 tests (R17).
- `backend-pet-tracker/src/workers/alerts-engine/alerts-engine.module.ts` — wiring del worker.
- `backend-pet-tracker/src/pipeline/geofence-eval-untouched.spec.ts` — guarda estática de R19 (hash sha256 de `geofence-eval.ts`/`.spec.ts` + valores exactos de los exports preexistentes de `pipeline/constants.ts`).
- `backend-pet-tracker/test/alerts-engine.e2e-spec.ts` — e2e contra Postgres + LocalStack reales (R2 literal, R14, R18).
- `progress/impl_alerts-engine.md` — este reporte.

## Archivos modificados

- `backend-pet-tracker/src/db/schema/index.ts` — +1 línea de re-export (`export * from './alerts.schema';`).
- `backend-pet-tracker/src/pipeline/constants.ts` — +`BATTERY_RECOVERY_THRESHOLD_PCT = 30` (R11); diff puramente aditivo, verificado con `git diff main -- <archivo>`.
- `backend-pet-tracker/src/aws/constants.ts` — +`QUEUE_GEOFENCE_EVENTS`, `+QUEUE_GEOFENCE_EVENTS_DLQ`, `+RULE_GEOFENCE_EVENTS`; +`EVENT_SOURCE`/`DETAIL_TYPE_POSITION_UPDATED`/`DETAIL_TYPE_BATTERY_LOW` reubicadas desde `workers/ingestion.constants.ts` (D2, mismo valor).
- `backend-pet-tracker/src/aws/provisioning.ts` — +`provisionGeofenceEventsRoute()` (cola+DLQ vía `ensureQueueWithDlq()` reutilizada, `PutRuleCommand`/`PutTargetsCommand`); +1 línea en `provisionAllResources()`. Las 4 funciones existentes quedan con el cuerpo intacto (verificado por diff).
- `backend-pet-tracker/src/workers/ingestion.constants.ts` — se quitan las 3 constantes reubicadas; `POSITIONS_DOC_CLIENT` intacto.
- `backend-pet-tracker/src/workers/positions-consumer.service.ts` — solo el import de esas 3 constantes pasa a `@/aws/constants`; lógica R12-R18 de #8 sin cambios (verificado por diff).
- `backend-pet-tracker/src/app.module.ts` — importa y registra `AlertsEngineModule`.
- `docs/data-model.md` — fila `alert_events` con el shape real de R1/R2; fila `geofences` actualizada notando que `alerts-engine` ya escribe `geofence_state` de verdad.
- `docs/conventions.md` — tabla de variables de entorno: `ALERTS_ENGINE_ENABLED`.
- `.env.example` — `ALERTS_ENGINE_ENABLED=true`.
- `feature_list.json`, `progress/current.md` — carry-forward del estado que dejó el leader/spec_author antes de esta sesión (no los edité de contenido, solo los llevé al primer commit de la branch).

### Desviación deliberada de la lista cerrada de R20 (3 archivos) — leer con atención

R20 enumera una lista cerrada de archivos permitidos. Tres archivos de mi diff no aparecen ahí literalmente; los tres son consecuencias mecánicas, sin lógica de negocio nueva, necesarias para que `init.sh` cierre en verde (la propia cláusula de verificación de R20):

1. **`backend-pet-tracker/src/workers/positions-consumer.service.spec.ts`** — R20 solo menciona `positions-consumer.service.ts` para el cambio de import. Pero el spec de ese archivo importaba las 3 constantes reubicadas desde `./ingestion.constants` (ya no las exporta tras D2); sin corregir el import del spec, el build/tests de esa suite quedan rotos. Cambié únicamente las líneas de import, cero cambios de aserciones o lógica — verificado en el diff (`git diff main HEAD -- <archivo>` solo muestra el bloque de import moviéndose).
2. **`backend-pet-tracker/src/aws/provisioning.geofence-events.spec.ts`** — nuevo, prueba `provisionGeofenceEventsRoute()` (la función que R20 sí permite añadir a `provisioning.ts`). Sigue la disciplina TDD obligatoria del rol implementer y el patrón ya establecido en el mismo directorio (`provisioning.sqs.spec.ts`).
3. **`backend-pet-tracker/src/pipeline/geofence-eval-untouched.spec.ts`** — nuevo, es el test que `tasks.md` pide explícitamente para R19 ("Escribir test que falla para R19"). Vive en `src/pipeline/` porque es lo que verifica, mismo patrón de `docs/conventions.md` (test junto al archivo que cubre).

Ningún otro archivo fuera de la lista de R20 fue tocado. `git diff main HEAD --name-only` (que excluye lo no commiteado) da la lista completa — pegada abajo en "Verificación de R20".

### Fuera de mi commit (no tocado, verificado)

`.gitignore` y `.mcp.json` aparecen modificados en el working tree (no en mis commits) desde antes de que empezara esta sesión. `.mcp.json` contiene un GitHub PAT en texto plano (`github_pat_...`) que **no está en el historial de git** (el `.mcp.json` committeado en `main` solo tiene la URL, sin `headers`/token — confirmado con `git diff` contra el HEAD anterior). No los añadí a ningún commit deliberadamente para no introducir un secreto en el historial; son cambios locales del humano, ajenos a esta feature. **Recomiendo que el leader/humano revise y, si el token es real, lo revoque y limpie ese archivo antes de que alguien lo commitee sin darse cuenta** (no lo toqué ni lo voy a tocar, está fuera de mi rol).

## Requisitos cubiertos

| R-id | Resumen | Test | Commit |
|---|---|---|---|
| R1 | Tabla `alert_events` conforme a data-model | `alerts.schema.spec.ts::R1` | `b4448ca` |
| R2 | Índice único parcial anti-spam (D4 literal) | `alerts.schema.spec.ts::R2` + `alerts-engine.e2e-spec.ts::R2` (INSERT/23505/INSERT real) | `b4448ca`, `df1270f` |
| R3 | Cola `geofence-events` + DLQ idempotente | `provisioning.geofence-events.spec.ts::R3` + verificado a mano contra LocalStack real | `2ba4502` |
| R4 | Regla EventBridge, target único, sin envelope-stripping | `provisioning.geofence-events.spec.ts::R4` + verificado a mano contra LocalStack real | `2ba4502` |
| R5 | Recepción/parseo del sobre, malformado sin delete | `alerts-engine-consumer.service.spec.ts::R5` | `193ff9d` |
| R6 | Despacho por `detail-type`, desconocido → log+delete | `alerts-engine-consumer.service.spec.ts::R6` | `193ff9d` |
| R7 | Guard "ts más reciente que updatedAt" por geocerca | `alerts-engine-consumer.service.spec.ts::R7` | `193ff9d` |
| R8 | `exit`: INSERT → notifica si tomó efecto → persiste estado | `alerts-engine-consumer.service.spec.ts::R8` | `193ff9d` |
| R9 | `enter`: UPDATE condicional → persiste → notifica si afectó | `alerts-engine-consumer.service.spec.ts::R9` | `193ff9d` |
| R10 | `event: null` (unknown inicial, low_accuracy): solo persiste | `alerts-engine-consumer.service.spec.ts::R10` | `193ff9d` |
| R11 | Cierre `battery_low` con batería ≥30 en `position.updated` | `alerts-engine-consumer.service.spec.ts::R11` | `193ff9d` |
| R12 | Apertura `battery_low` desde `battery.low` | `alerts-engine-consumer.service.spec.ts::R12` | `193ff9d` |
| R13 | exit/exit/enter → exactamente 1 open, 1 resolved | `alerts-engine-consumer.service.spec.ts::R13` | `193ff9d` |
| R14 | Idempotencia ante redelivery | `alerts-engine-consumer.service.spec.ts::R14` + `alerts-engine.e2e-spec.ts` (redelivery real vía SQS) | `193ff9d`, `df1270f` |
| R15 | Shape congelado del mensaje `notifications` (D5) | `alerts-engine-consumer.service.spec.ts::R15` | `193ff9d` |
| R16 | Error no controlado: sin delete, no envenena el lote | `alerts-engine-consumer.service.spec.ts::R16` | `193ff9d` |
| R17 | Scheduler gateado por `ALERTS_ENGINE_ENABLED` + `NODE_ENV` | `alerts-engine-scheduler.service.spec.ts::R17` | `193ff9d` |
| R18 | e2e determinista: salida simulada → open+mensaje en ≤2 ciclos | `alerts-engine.e2e-spec.ts::R18` | `df1270f` |
| R19 | Pureza: `geofence-eval.ts` intacto, `pipeline/constants.ts` solo +1 | `geofence-eval-untouched.spec.ts::R19` | `df1270f` |
| R20 | No regresión: lista cerrada de archivos | `git diff main HEAD --name-only` (ver sección abajo) | — |

Ningún requisito quedó parcial o bloqueado.

## Decisiones de implementación no cubiertas explícitamente por la spec

- **Copy de `title`/`body` del mensaje `notifications`** (D5 deja el texto exacto a criterio del implementer): español simple, `title` con el nombre de la mascota y (según el caso) el de la geocerca o el `batteryPct`; `body` una frase corta. Ver `buildCopy()` en `alerts-engine-consumer.service.ts`.
- **"Sin `RawMessageDelivery`" (R4/D2) interpretado como "sin `InputTransformer` en el target de EventBridge"**: `RawMessageDelivery` es en realidad un atributo de suscripción SNS→SQS, no un parámetro de un target de regla EventBridge — no existe un campo con ese nombre en el SDK para `PutTargetsCommand`. La intención de la spec (el mensaje SQS conserva el sobre completo, incluida `detail-type`) se logra por default con un target simple sin `InputTransformer`, que es lo que implementé y verifiqué contra LocalStack real (target `{Id, Arn}` sin transformador).
- **`AlertsEngineStore.openAlert()`/`closeOpenAlert()` como los únicos puntos de I/O de escritura** (D2): mismo patrón que `translateUniqueViolation`/`findPgError` de `device.drizzle.repository.ts`/`geofence.drizzle.repository.ts`, reimplementado localmente (no exportado desde esos módulos) en `alerts-engine.drizzle.store.ts`, tal como indica el propio `design.md`.
- **Escenario de test para R18 — determinista por cálculo directo, no por estadística**: en vez de esperar que el paseo aleatorio del simulador "probablemente" cruce el umbral de la geocerca, calculé las distancias exactas (`slot 1` → 42.7 m, `slot 50` → 200.8 m desde `SIM_DEFAULT_HOME_LAT/LNG`, con `seed=1` default) corriendo `FakeWialonClient` directamente con `ts-node`, y elegí radio 100 m para que ambos números queden con margen amplio (42.7 vs 90 m de umbral de entrada; 200.8 vs 110 m de umbral de salida) contra sus respectivos umbrales de histéresis. El test es 100% determinista (cero probabilidad involucrada) mientras `SIM_SEED`/`SIM_HOME_LAT`/`SIM_HOME_LNG` no se aparten de los defaults documentados en `.env.example`. `DAY_START` es un día UTC arbitrario y fijo (2030-01-01) para no depender de la fecha real de la corrida — el simulador es puro en `(seed, unitId, slot)`.
- **`jest.setTimeout(180_000)`** añadido al describe de `alerts-engine.e2e-spec.ts` (mismo patrón que `activity.e2e-spec.ts`/`positions.e2e-spec.ts`) — el default de 5 s de Jest resultó insuficiente en al menos una corrida para 2 ciclos completos de poller+consumer+alerts-worker contra Postgres/LocalStack reales.
- **`test/alerts-engine.e2e-spec.ts` usa el device simulado `SIM-002`/`ACT-002`** (no `SIM-001`/`ACT-001`) para no chocar con `test/ingestion.e2e-spec.ts`, que ya usa ese collar y lo libera en su propio `afterAll`.

## Verificación de R20 (no regresión)

`git diff main HEAD --name-only` (compara los commits de la branch contra `main`, excluye el working tree sin commitear):

```
.env.example
backend-pet-tracker/src/app.module.ts
backend-pet-tracker/src/aws/constants.ts
backend-pet-tracker/src/aws/provisioning.geofence-events.spec.ts
backend-pet-tracker/src/aws/provisioning.ts
backend-pet-tracker/src/db/migrations/0007_narrow_whirlwind.sql
backend-pet-tracker/src/db/migrations/meta/0007_snapshot.json
backend-pet-tracker/src/db/migrations/meta/_journal.json
backend-pet-tracker/src/db/schema/alerts.schema.spec.ts
backend-pet-tracker/src/db/schema/alerts.schema.ts
backend-pet-tracker/src/db/schema/index.ts
backend-pet-tracker/src/pipeline/constants.ts
backend-pet-tracker/src/pipeline/geofence-eval-untouched.spec.ts
backend-pet-tracker/src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts
backend-pet-tracker/src/workers/alerts-engine/alerts-engine-consumer.service.ts
backend-pet-tracker/src/workers/alerts-engine/alerts-engine-scheduler.service.spec.ts
backend-pet-tracker/src/workers/alerts-engine/alerts-engine-scheduler.service.ts
backend-pet-tracker/src/workers/alerts-engine/alerts-engine-store.ts
backend-pet-tracker/src/workers/alerts-engine/alerts-engine.constants.ts
backend-pet-tracker/src/workers/alerts-engine/alerts-engine.drizzle.store.ts
backend-pet-tracker/src/workers/alerts-engine/alerts-engine.module.ts
backend-pet-tracker/src/workers/alerts-engine/geofence-event-message.schema.ts
backend-pet-tracker/src/workers/ingestion.constants.ts
backend-pet-tracker/src/workers/positions-consumer.service.spec.ts
backend-pet-tracker/src/workers/positions-consumer.service.ts
backend-pet-tracker/test/alerts-engine.e2e-spec.ts
docs/conventions.md
docs/data-model.md
feature_list.json
progress/current.md
progress/spec_alerts-engine.md
specs/alerts-engine/design.md
specs/alerts-engine/requirements.md
specs/alerts-engine/tasks.md
specs/alerts-engine/traceability.md
```

`src/pipeline/geofence-eval.ts` y `src/pipeline/geofence-eval.spec.ts`: **no aparecen** en la lista — no tocados (confirmado también por el hash sha256 congelado en `geofence-eval-untouched.spec.ts`). `src/modules/geofences/**`, `src/modules/pets/**` y el resto de `src/modules/**`: no aparecen — no tocados. Cero dependencias nuevas en `package.json` (no aparece en la lista).

## Estado de `./init.sh`

Corrido por mí desde la raíz del repo, **verde completo**:

```
✅ node/pnpm disponibles
✅ .env encontrado, DATABASE_URL definida
✅ Dependencias instaladas
✅ Archivos del harness presentes
⚠️  Feature en progreso: alerts-engine   (esperado — in_progress hasta que el reviewer cierre)
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso
✅ Tests pasados        — 97 suites / 699 tests
✅ Lint sin errores
✅ Typecheck sin errores
```

## Output de build

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json

(sin errores)
```

## Output de tests

Unitarios (`pnpm test`, vía `init.sh`):
```
Test Suites: 97 passed, 97 total
Tests:       699 passed, 699 total
```

`test/alerts-engine.e2e-spec.ts` (`pnpm run test:e2e -- alerts-engine`, contra Postgres 17 + LocalStack reales vía `docker compose up -d`, con `pnpm run provision:local` y `drizzle-kit migrate` corridos antes) — 3/3 verde, corrido 3 veces seguidas para confirmar estabilidad (sin flakiness):
```
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

Verificación manual de infraestructura contra LocalStack real (SDK, no CLI — `aws` no está instalado en este entorno): las 6 colas SQS existen (`positions-raw(-dlq)`, `notifications(-dlq)`, `geofence-events(-dlq)`), la regla `geofence-events` sobre el bus `pet-tracker` tiene el `EventPattern` exacto de R4 y un único target (la cola, sin `InputTransformer`), y la `RedrivePolicy` de `geofence-events` apunta a su DLQ con `maxReceiveCount: 3`.

Suite e2e completa (`pnpm run test:e2e`, las 11 suites incluyendo la nueva): **10/11 en verde**. El único fallo es `test/media.e2e-spec.ts` (R8, `expect 403 received 200` sobre un GET sin firma al bucket S3) — **preexistente y ajeno a esta feature**: confirmado que falla igual en aislamiento (`pnpm run test:e2e -- media`, sin que mi suite corra en absoluto), `src/modules/media/**` no está en mi lista de archivos tocados, y es exactamente la misma flakiness de ACL S3/LocalStack ya documentada por el implementer de `geofences-crud` en `progress/impl_geofences-crud.md` (sesión anterior, mismo síntoma exacto).

## Notas para el reviewer

- **Los 3 archivos fuera de la lista literal de R20** (`positions-consumer.service.spec.ts`, `provisioning.geofence-events.spec.ts`, `geofence-eval-untouched.spec.ts`) — ver la sección "Desviación deliberada..." arriba. Ninguno tiene lógica de negocio nueva; verifícalos con el `git diff` de cada uno si quieres confirmarlo de primera mano.
- **`.gitignore`/`.mcp.json` con un PAT en texto plano**, no commiteado por mí, ajeno a esta feature — ver la sección correspondiente arriba. Posible acción de seguridad pendiente para el humano.
- **El escenario geográfico de R18 es determinista** (no probabilístico) porque usé el propio `FakeWialonClient` para calcular las distancias exactas antes de fijar radio/slots — no debería dar flakiness, pero si `SIM_SEED`/`SIM_HOME_LAT`/`SIM_HOME_LNG` cambiaran de sus defaults documentados en `.env.example`, los números (`42.7 m`/`200.8 m`) dejarían de ser válidos y el test necesitaría recalcularse con el mismo método (script en la sección de decisiones arriba).
- **R2 se verifica dos veces**: a nivel de schema (`getTableConfig` + inspección del SQL de la migración) y a nivel de comportamiento real contra Postgres (dos `INSERT` seguidos, 23505 en el segundo, éxito en un tercero tras cerrar). El criterio de aceptación literal de R2 pedía exactamente esto.
- **`AlertsEngineDrizzleStore` no tiene spec unitario propio** — mismo criterio que `IngestionDrizzleStore` (#8): su SQL se ejercita indirectamente pero de verdad en `alerts-engine.e2e-spec.ts` (los 3 escenarios ahí pasan por el store real, no un mock). Si el reviewer prefiere un spec unitario dedicado (con una base de datos real o un fake), lo puedo agregar — no lo consideré necesario dado el patrón ya establecido en el repo y la cobertura e2e existente.
- **No mergeé ni abrí PR** — la branch `feature/12-alerts-engine` queda lista, con el último commit en `df1270f`. `feature_list.json` sigue en `"status": "in_progress"` — no lo edité.
- Docker (`docker compose up -d`) y LocalStack quedaron aprovisionados y corriendo al cierre de esta sesión, con las migraciones aplicadas — el reviewer puede correr `pnpm run test:e2e -- alerts-engine` directamente sin repetir el setup, o `pnpm run test:e2e` completo para confirmar el estado descrito arriba.

## Fix CRLF/LF post-CI

Sesión de bugfix puntual sobre #12 ya reabierta (misma branch `feature/12-alerts-engine`), disparada por un fallo real en CI (Linux) no reproducido en local (Windows).

**Bug**: `R19` fallaba en CI con hashes distintos a los hardcodeados en `geofence-eval-untouched.spec.ts`, pese a que `geofence-eval.ts`/`.spec.ts` nunca cambiaron — confirmado con `git diff main -- <ambos archivos>`, vacío.

**Causa raíz**: `sha256Of()` hasheaba `readFileSync(path, 'utf8')` crudo, incluidos los line endings. `GEOFENCE_EVAL_TS_SHA256`/`GEOFENCE_EVAL_SPEC_TS_SHA256` se congelaron en un checkout Windows (`core.autocrlf=true` → CRLF en disco). El runner de CI (Linux) hace checkout del mismo blob de git en LF, así que hashea `\n` donde el constante espera `\r\n` — falla aunque el contenido real es idéntico.

**Fix elegido — (a) normalizar antes de hashear**, no (b) comparar contra `git show HEAD`: `normalizeLineEndings()` (nueva, en el mismo archivo) quita un BOM inicial si existe y colapsa `\r\n` → `\n` antes de `sha256Of()`; recalculé ambas constantes contra el contenido normalizado. Descarté (b) porque compara contra un HEAD que se mueve en cada commit de la feature (no contra el estado congelado de #11 que R19 realmente quiere verificar) y reintroduce en runtime la misma dependencia de `git` en un checkout superficial de CI que el comentario del propio archivo (líneas 6-12) ya documenta como indeseable — ese criterio sigue vigente, (a) no lo contradice.

**Por qué es inmune a CRLF/LF y no "pasa en mi máquina"**: con un script aparte (no versionado) confirmé que (1) el hash crudo, sin normalizar, del contenido CRLF de mi checkout local == el valor `Expected` que reportó CI (la constante vieja) — mi entorno Windows reproduce el escenario exacto que generó el hash original; y (2) el hash de ese mismo contenido normalizado a LF == el valor `Received` que reportó CI — normalizar el CRLF local produce el mismo string, byte a byte, que ya tiene nativamente el checkout LF de Linux. CRLF→LF y el strip de BOM son operaciones idempotentes (LF normalizado no tiene `\r\n` que reemplazar; sin BOM no hay nada que cortar), así que cualquier checkout converge en el mismo string antes de hashear — la única variable que distinguía Windows de Linux queda eliminada del cálculo por construcción, no por casualidad de mi máquina.

**Verificación**: `pnpm test -- geofence-eval-untouched` → 4/4 verde (local, Windows/CRLF). `./init.sh` completo corrido por mí → verde: build, 97 suites/699 tests, lint, typecheck. `git diff`/`git status` confirmaron que el commit toca un único archivo (18 inserciones, 4 eliminaciones).

**Commit**: `c4f09e5` — `fix(alerts-engine): make R19 purity guard immune to CRLF/LF checkout differences`.

**Traceability**: fila R19 de `specs/alerts-engine/traceability.md` actualizada para citar también `c4f09e5` junto al `df1270f` original — el `describe`/test de R19 es el mismo, cambió su implementación interna.

**No tocado**: `geofence-eval.ts`, `geofence-eval.spec.ts`, `feature_list.json`, `STATUS.md`. Los 4 archivos que ya aparecían modificados en el working tree antes de esta sesión (`.gitignore`, `.mcp.json`, `feature_list.json`, `progress/current.md`) siguen sin stagear — no son míos, no los toqué.
