# impl: wialon-ingestion-pipeline
Fecha: 2026-08-02

Branch: `feature/8-wialon-ingestion-pipeline`. Spec aprobada por humano
2026-08-02 (`specs/wialon-ingestion-pipeline/requirements.md`, R1-R19,
D1-D14). TDD requisito por requisito; trazabilidad completa en
`specs/wialon-ingestion-pipeline/traceability.md` (sin filas pendientes).

## Archivos creados

- `backend-pet-tracker/src/pipeline/types.ts` — `RawPosition`/`ProcessedPosition`/`DiscardedStat` (núcleo puro)
- `backend-pet-tracker/src/pipeline/constants.ts` — umbrales 60/100/4/20 + nombres de flags (fuente única para #10-#12)
- `backend-pet-tracker/src/pipeline/geo.ts` — `haversineMeters` (lo reutiliza #10)
- `backend-pet-tracker/src/pipeline/validate-positions.ts` — `normalize()` puro: descartes con razón, orden, flags
- `backend-pet-tracker/src/pipeline/validate-positions.spec.ts` — R5/R6/R7
- `backend-pet-tracker/src/pipeline/__fixtures__/walk.json` — 204 puntos del fake (seed 1, unidad 900001, 200 slots desde 2026-08-01T00:00Z) + glitch `(0,0)` en índice 10
- `backend-pet-tracker/src/integrations/wialon/wialon-client.interface.ts` — puerto `WialonClient` + Symbol `WIALON_CLIENT`
- `backend-pet-tracker/src/integrations/wialon/fake-wialon.client.ts` — simulador determinista (mulberry32 + FNV-1a por slot de 30 s)
- `backend-pet-tracker/src/integrations/wialon/fake-wialon.client.spec.ts` — R2/R3
- `backend-pet-tracker/src/integrations/wialon/wialon-http.client.ts` — cliente API real (login por token, flags 65281), fetch inyectable
- `backend-pet-tracker/src/integrations/wialon/wialon-http.client.spec.ts` — R4 (fixture, sin red)
- `backend-pet-tracker/src/integrations/wialon/__fixtures__/wialon-load-interval.json` — respuesta real de `messages/load_interval`
- `backend-pet-tracker/src/integrations/wialon/wialon.errors.ts` — `WialonApiError` / `WialonTransportError` (dominio, sin @nestjs)
- `backend-pet-tracker/src/integrations/wialon/wialon.factory.ts` — selección fake/http vía ConfigService
- `backend-pet-tracker/src/integrations/wialon/wialon.factory.spec.ts` — R1
- `backend-pet-tracker/src/db/seed/simulated-devices.ts` — `SIMULATED_DEVICES` (movida desde `scripts/`, ver Decisiones)
- `backend-pet-tracker/src/workers/ingestion-store.ts` — puerto `IngestionStore` + Symbol (D14)
- `backend-pet-tracker/src/workers/ingestion.drizzle.store.ts` — implementación Drizzle; guard "solo si más reciente" en WHERE
- `backend-pet-tracker/src/workers/poller.service.ts` — `runOnce()` (R9-R11)
- `backend-pet-tracker/src/workers/poller.service.spec.ts` — R9/R10/R11
- `backend-pet-tracker/src/workers/positions-consumer.service.ts` — `drainOnce()` (R12-R18)
- `backend-pet-tracker/src/workers/positions-consumer.service.spec.ts` — R12-R18
- `backend-pet-tracker/src/workers/positions-message.schema.ts` — schema zod del body SQS `{version: 1, ...}`
- `backend-pet-tracker/src/workers/ingestion.constants.ts` — `POSITIONS_DOC_CLIENT` + contrato de eventos (`EVENT_SOURCE`, detail-types)
- `backend-pet-tracker/src/workers/ingestion-scheduler.service.ts` — scheduling dinámico gated (R8)
- `backend-pet-tracker/src/workers/ingestion-scheduler.service.spec.ts` — R8
- `backend-pet-tracker/src/workers/ingestion.module.ts` — `IngestionModule` (providers + exports)
- `backend-pet-tracker/test/ingestion.e2e-spec.ts` — R19 + guard WHERE de R14 contra Postgres real
- `docs/wialon-module.md` — fuente canónica del diseño Wialon (D1)

## Archivos modificados

- `backend-pet-tracker/src/app.module.ts` — `ScheduleModule.forRoot()` + `IngestionModule`
- `backend-pet-tracker/scripts/seed-devices.ts` — importa/re-exporta `SIMULATED_DEVICES` desde `src/db/seed/` (superficie de #7 intacta)
- `backend-pet-tracker/package.json` / `pnpm-lock.yaml` — `@nestjs/schedule`, `@aws-sdk/lib-dynamodb` (D13; ninguna otra dependencia)
- `backend-pet-tracker/test/jest-e2e.json` — `maxWorkers: 1` (ver Decisiones)
- `.env.example` — 7 vars de D11 (`SIM_MODE`, `SIM_SEED`, `SIM_HOME_LAT/LNG`, `WIALON_TOKEN`, `WIALON_BASE_URL`, `POLLER_ENABLED`)
- `docs/conventions.md` — tabla de env vars con las 7 de D11 (mismos commits que las introducen)
- `specs/wialon-ingestion-pipeline/traceability.md` — 19 filas con test + hash

## Requisitos cubiertos

| R | Test | Commit |
|---|---|---|
| R1 | `wialon.factory.spec.ts::R1` | `8284a0f` |
| R2 | `fake-wialon.client.spec.ts::R2` | `0098847` |
| R3 | `fake-wialon.client.spec.ts::R3` | `9be3159` |
| R4 | `wialon-http.client.spec.ts::R4` | `3eaecb5` |
| R5 | `validate-positions.spec.ts::R5` | `59baab3` |
| R6 | `validate-positions.spec.ts::R6` | `36fd6fd` |
| R7 | `validate-positions.spec.ts::R7` | `bc7b5fe` |
| R8 | `ingestion-scheduler.service.spec.ts::R8` | `e178dee` |
| R9 | `poller.service.spec.ts::R9` | `f5c643d` |
| R10 | `poller.service.spec.ts::R10` | `bc3144f` |
| R11 | `poller.service.spec.ts::R11` | `2ce248c` |
| R12 | `positions-consumer.service.spec.ts::R12` | `564ec00` |
| R13 | `positions-consumer.service.spec.ts::R13` | `6f9b884` |
| R14 | `positions-consumer.service.spec.ts::R14` + `test/ingestion.e2e-spec.ts` (WHERE) | `fe531da` |
| R15 | `positions-consumer.service.spec.ts::R15` | `aa54b5a` |
| R16 | `positions-consumer.service.spec.ts::R16` | `08dff63` |
| R17 | `positions-consumer.service.spec.ts::R17` | `fb7bf94` |
| R18 | `positions-consumer.service.spec.ts::R18` + DLQ=0 en e2e | `337aa5b` |
| R19 | `test/ingestion.e2e-spec.ts::R19` | `139fb36` |

## Decisiones de diseño (y desviaciones menores)

- **`SIMULATED_DEVICES` movida a `src/db/seed/simulated-devices.ts`**: R2
  exige importar los `wialonUnitId` del seed sin re-teclearlos, pero `src/`
  no puede importar desde `scripts/` sin romper el layout del build
  (rootDir). `scripts/seed-devices.ts` la re-exporta — el e2e de #7 no se
  tocó y sigue verde.
- **`jest-e2e.json` con `maxWorkers: 1`**: el e2e de ingesta reclama el
  fixture fijo `SIM-001`/`ACT-001` (criterio literal de R19) que
  `devices.e2e-spec.ts` resetea/re-siembra; con workers paralelos por
  archivo habría carrera sobre esas filas. Serializar los e2e elimina el
  riesgo (13 s la suite completa — coste marginal).
- **R15 y R18 quedaron verdes a la llegada del test**: el comportamiento de
  R15 emergió de R13 (escritura incondicional del histórico) + R14 (gate de
  asignación activa), y el de R18 se implementó como parte del paso de parse
  del esqueleto R12. Los tests se escribieron igualmente y fijan el contrato
  (commits `test(...)` en vez de `feat(...)`). El resto de requisitos tuvo
  fase roja verificada.
- **Fixture `walk.json` generado con script one-off** (borrado tras usarlo).
  Reproducible: fake determinista `seed=1`, unidad `900001`, 200 slots desde
  `Date.UTC(2026, 7, 1)`, más `walk[10] = {...walk[10], lat: 0, lng: 0}`
  (el `(0,0)` que R7 exige y el fake no genera).
- **Emisión de eventos en un solo `PutEvents`** con 1-2 entries
  (`position.updated` + `battery.low` si hay flanco) — menos round-trips,
  mismo contrato.
- **`received_ts`/`processed_ts`** se estampan con el reloj del consumidor al
  procesar (el contrato del mensaje SQS no transporta received_ts). En
  redelivery el PutItem por `sk` sobrescribe con el timestamp nuevo — el
  conteo y el resto de atributos no cambian (R13).
- **Consumer sin guard de solape**: el solape de drenados es inofensivo (la
  visibilidad de SQS oculta los mensajes en vuelo y el PutItem es
  idempotente); R11 solo exige el guard en el poller, donde sí evita
  re-publicación.
- Cero migraciones, cero cambios en `src/modules/**` y `src/aws/**` —
  confirmado (`git diff main --stat` no toca esas carpetas).
- **Ajustes post-suite por lint type-aware** (commit final `refactor`):
  `eslint --fix` reformateó los archivos nuevos y quedaron 40 errores de
  reglas con type-info (falsos positivos `unbound-method` sobre mocks
  tipados como métodos de interface, accesos `any` sobre `mock.calls`, y el
  overload de `send()` de lib-dynamodb resolviendo a `any`). Se corrigieron
  tipando los mocks como `MockOf<T> = {[K]: jest.Mock}`, casts puntuales en
  los specs y una única supresión comentada en
  `positions-consumer.service.ts` (asignación del output de BatchWrite,
  anotada con su tipo real). Sin cambios de comportamiento: 397 unit + 58
  e2e verdes tras el ajuste.

## Comandos de verificación

```bash
# infra local
docker compose up -d
cd backend-pet-tracker && pnpm run provision:local && pnpm run seed:devices

# unit + build + lint + typecheck (harness completo)
./init.sh

# e2e completos contra Postgres + LocalStack reales
cd backend-pet-tracker && pnpm run test:e2e
```

## Output de build

```
> nest build && tsc-alias -p tsconfig.build.json
(sin errores; ./init.sh completo termina "Todo verde")
```

## Output de tests

```
Unit (pnpm test):
  Tests: 397 passed, 397 total   (364 previos + 33 nuevos de #8)
e2e (pnpm run test:e2e, contra Docker Postgres 17 + LocalStack):
  Test Suites: 6 passed, 6 total
  Tests:       58 passed, 58 total   (55 previos de #2/#5/#7 + 3 nuevos)
Lint / typecheck: sin errores (via ./init.sh)
```

## Evidencia manual — corrida real con cron (~2 min, criterio literal de R19)

Procedimiento (2026-08-02, todo local contra Docker):

```bash
docker compose up -d && pnpm run provision:local && pnpm run seed:devices
cd backend-pet-tracker
POLLER_ENABLED=true SIM_MODE=true PORT=3000 node dist/src/main.js
# log de arranque:
#   [IngestionSchedulerService] ingestion workers scheduled (poller 60000 ms, consumer 15000 ms)
# via API: register -> login -> POST /v1/pets -> POST /v1/devices/claim
#   {petId, activationCode: "ACT-001"}  => 201  (08:36:07Z)
```

Observado con el cron real corriendo solo (sin invocaciones manuales):

| Momento (UTC) | Observación |
|---|---|
| 08:36:07 | claim `ACT-001` → 201 (`pet 019fc19d-bac4-75a3-b59a-9c89f40743c1`) |
| 08:37:36 (~1.5 min) | DynamoDB Query `pk = PET#<petId>` → **Count: 21** (lookback de 10 min del claim) |
| 08:44:27 (~8 min) | **Count: 35** (crece ~2 items/min — un slot cada 30 s) |
| 08:44:27 | `pets.last_position` = `{ts: 1785660210000 (=08:43:30Z), lat: 19.4362..., lng: -99.1256..., battery: 83, accuracy: 12.6}`; `last_communication_at = 08:43:30Z` |
| 08:44:27 | `devices` SIM-001: `battery_pct=83`, `connectivity='online'`, `last_message_at=08:43:30`, `ingest_watermark=08:43:30` (avanza tick a tick) |
| 08:44:27 | DLQ `positions-raw-dlq`: `ApproximateNumberOfMessages = "0"` |

Cierre del escenario: `DELETE /v1/pets/:petId/device` → 204,
`DELETE /v1/pets/:petId` → 204, proceso detenido. Los items de DynamoDB del
pet de evidencia expiran por TTL (90 días) y no interfieren (pk único).

## Notas para el reviewer

- La fase roja de R15/R18 no fue reproducible sin romper R13/R14/R12 (ver
  Decisiones): los commits correspondientes son `test(...)` y lo declaran.
- `advanceWatermark` no lleva WHERE monotónico: solo lo invoca el poller
  tras publicar, y un claim posterior resetea el watermark a propósito (#7).
  Los updates de caché sí llevan el WHERE (R14, verificado en e2e).
- El gating de R8 está doblemente verificado: unit (SchedulerRegistry mock)
  y de facto — los 55 e2e previos instancian `AppModule` completo con
  `NODE_ENV=test` y siguen verdes sin arrancar workers.
- `WialonHttpClient` queda cableado pero ningún flujo toca la red
  (fetch inyectable, fixtures); el smoke real es trabajo futuro declarado.
- Verificar en el diff que `pipeline/` no importa framework/SDK — hay un
  test que lo hace por inspección de imports (`R5` purity check).
