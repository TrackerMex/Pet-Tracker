# Implementación — device-telemetry-reset-on-reassign (#92)

## R1

### Rojo — `4160f514`

- `pnpm test -- claim-device` — exit `1`: el test `#92 R1` recibió el
  snapshot previo (`batteryPct: 37`, `lastMessageAt: 2026-08-01T11:59:00Z`,
  `status: available`) en vez de la entidad resuelta por `claim`; los otros
  24 tests pasaron.
- `pnpm test:e2e -- devices.e2e-spec` — exit `1`: el `it` (a) recibió
  `batteryPct: 37` donde esperaba `null`; el `it` (b) recibió
  `batteryPct: 63` donde esperaba `null`; los otros 27 tests pasaron.

### Verde — `f1f44880`

- `pnpm test` — exit `0`: 166 suites, 1278 tests.
- `pnpm test:e2e -- devices.e2e-spec` — exit `0`: 1 suite, 29 tests.
- `pnpm lint` — exit `0`.
- `pnpm build` — exit `0`.
- Comentarios de R1: `3328c0dc`.

## R2

- Código verificado sin cambios: el brazo
  `isNull(devices.lastMessageAt)` de
  `backend-pet-tracker/src/workers/ingestion.drizzle.store.ts:104` acepta el
  primer mensaje tras el reset. Candado hermano:
  `backend-pet-tracker/test/ingestion.e2e-spec.ts:220` (#8 R19).
- Sonda de mutación no versionada: se sustituyó temporalmente el `or(...)`
  por `lt(devices.lastMessageAt, update.lastMessageAt)` y se ejecutó
  `pnpm test:e2e -- devices.e2e-spec` (exit `1`). Fragmento literal:

  ```text
  Expected: 80
  Received: null
  > expect(afterFirstMessageBody.batteryPct).toBe(80);
  Test Suites: 1 failed, 1 total
  Tests:       1 failed, 28 passed, 29 total
  ```

- Tras restaurar el `or(isNull(...), lt(...))`,
  `git diff --exit-code -- backend-pet-tracker/src/workers/ingestion.drizzle.store.ts`
  terminó en `0` y la repetición de `pnpm test:e2e -- devices.e2e-spec`
  pasó 1 suite / 29 tests.

## R3

- Baseline previo a editar: `./init.sh` terminó en `0`. Dos intentos
  anteriores mostraron flakiness móvil ajeno a #92 (`health.test.tsx` y
  `alerts/index.test.tsx`); ambos casos pasaron aislados y la tercera corrida
  completa quedó verde sin tocar móvil.
- Precondición del cierre:
  `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` sin salida.
- `./init.sh` final ejecutado desde la raíz, sin pipe: exit `0`.

  ```text
  Test Suites: 166 passed, 166 total
  Tests:       1278 passed, 1278 total
  Test Suites: 2 passed, 2 total
  Tests:       14 passed, 14 total
  Test Suites: 73 passed, 73 total
  Tests:       1265 passed, 1265 total
  Test Suites: 3 skipped, 26 passed, 26 of 29 total
  Tests:       8 skipped, 367 passed, 375 total
  ✅ Tests e2e pasados
  ✅ Lint sin errores
  ✅ Typecheck sin errores
  ✅ Todo verde. Listo para trabajar.
  ```

- Alcance de implementación contra el handoff `e753b19d` (capturado tras el
  init final y antes de añadir este bloque):

  ```text
   .../src/db/schema/devices.schema.ts                |   9 +-
   .../use-cases/claim-device.use-case.spec.ts        |  25 +++-
   .../application/use-cases/claim-device.use-case.ts |   8 +-
   .../devices/domain/entities/device.entity.ts       |   4 +-
   .../domain/repositories/device.repository.ts       |  14 ++-
   .../repositories/device.drizzle.repository.ts      |  22 +++-
   backend-pet-tracker/test/devices.e2e-spec.ts       | 132 +++++++++++++++++++++
   docs/data-model.md                                 |   2 +-
   .../impl_device-telemetry-reset-on-reassign.md     |  47 ++++++++
   .../traceability.md                                |   4 +-
   10 files changed, 245 insertions(+), 22 deletions(-)
  ```

  Son exactamente los diez ficheros de `design.md` §Archivos afectados.
  `git diff --exit-code e753b19d --` sobre ingesta, consumer, controllers,
  mapper, reader, las tres suites prohibidas y `mobile-pet-tracker/` terminó
  en `0`; una comparación aislada de `release()` contra `e753b19d` también
  terminó en `0`.

- `git diff --stat origin/main` incluye además los seis ficheros de spec y
  handoff que ya estaban versionados al recibir la implementación
  (`e0cf0bf9..e753b19d`):

  ```text
   .../src/db/schema/devices.schema.ts                |   9 +-
   .../use-cases/claim-device.use-case.spec.ts        |  25 +-
   .../application/use-cases/claim-device.use-case.ts |   8 +-
   .../devices/domain/entities/device.entity.ts       |   4 +-
   .../domain/repositories/device.repository.ts       |  14 +-
   .../repositories/device.drizzle.repository.ts      |  22 +-
   backend-pet-tracker/test/devices.e2e-spec.ts       | 132 +++++++++++
   docs/data-model.md                                 |   2 +-
   feature_list.json                                  |   2 +-
   progress/current.md                                |  28 +++
   .../handoff_device-telemetry-reset-on-reassign.md  |  75 ++++++
   .../impl_device-telemetry-reset-on-reassign.md     |  47 ++++
   specs/device-telemetry-reset-on-reassign/design.md | 177 ++++++++++++++
   .../requirements.md                                | 259 +++++++++++++++++++++
   specs/device-telemetry-reset-on-reassign/tasks.md  | 143 ++++++++++++
   .../traceability.md                                |  20 ++
   16 files changed, 946 insertions(+), 21 deletions(-)
  ```

- Historia R1 confirmada: `4160f514` rojo → `f1f44880` verde → `3328c0dc`
  docs. `feature_list.json` #92 permanece `in_progress` para el reviewer.
