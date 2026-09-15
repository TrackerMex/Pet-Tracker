# Implementación — drop-devices-connectivity-column (#93)

## R1

### Rojo — `ffaf0669`

- `pnpm test -- devices.schema` — exit `1`: la lista exacta de columnas
  recibió `connectivity` además de las 14 esperadas; el candado de la
  migración falló con `ENOENT` porque `0016_drop_devices_connectivity.sql`
  aún no existía. Los otros 11 tests pasaron.

### Verde — `0a131779`

- `pnpm db:generate` — exit `0`; drizzle-kit detectó 20 tablas,
  `devices 14 columns` y generó únicamente
  `src/db/migrations/0016_lowly_klaw.sql`. Su contenido fue exactamente
  `ALTER TABLE "devices" DROP COLUMN "connectivity";`; se renombró a
  `0016_drop_devices_connectivity.sql` y el journal conserva el `when`
  generado `1789440631931`.
- `meta/0016_snapshot.json`: `prevId`
  `4464bafc-df5e-4d81-ac7b-554ca9fd615f`; la única diferencia de schema
  frente a 0015 es la ausencia de `public.devices.columns.connectivity`
  (además de los IDs de encadenado del snapshot).
- Antes de aplicar 0016, `pet_tracker_wt` devolvió
  `16|1787957375434` para el journal y `1` para la columna.
- Gates sin migrar: `pnpm exec tsc --noEmit`, `pnpm lint` y `pnpm build`
  terminaron con exit `0`; `pnpm test -- devices.schema` pasó 1 suite / 13
  tests; `pnpm test` pasó 166 suites / 1279 tests; `pnpm test:e2e` pasó 26
  de 29 suites / 367 tests (3 suites y 8 tests omitidos).

### Documentación — `f9020c3f`

- `docs/data-model.md` ya lista 14 columnas de `devices` y documenta que el
  `connectivity` HTTP se deriva de `last_message_at`; la columna se eliminó
  en la migración `0016`.

## R2

- Precondición: la migración estaba commiteada en `0a131779` y la consulta
  de `information_schema.columns` todavía devolvía `1`.
- `pnpm test` — exit `0`:

  ```text
  Test Suites: 166 passed, 166 total
  Tests:       1279 passed, 1279 total
  Snapshots:   0 total
  ```

- Precondición LocalStack:
  `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` sin salida.
- `pnpm test:e2e` — exit `0`:

  ```text
  Test Suites: 3 skipped, 26 passed, 26 of 29 total
  Tests:       8 skipped, 367 passed, 375 total
  Snapshots:   0 total
  ```

- Candados del inventario, ejecutados desde `backend-pet-tracker/`:

  ```text
  $ grep -rn "connectivity" src/db/schema src/modules/devices/domain/entities src/modules/pets/domain/ports src/modules/devices/infrastructure/repositories src/workers scripts | wc -l
  4
  $ grep -rn --exclude='*.spec.ts' "connectivity" src/db/schema src/modules/devices/domain/entities src/modules/pets/domain/ports src/modules/devices/infrastructure/repositories src/workers scripts | wc -l
  0
  $ grep -rn "connectivity: null" src | wc -l
  0
  $ grep -rn "deviceRow\.connectivity\|row\.connectivity\|device\.connectivity" src test | wc -l
  0
  ```

  El primer comando literal no puede devolver el `0` escrito en R2: sus
  cuatro coincidencias son las cuatro líneas del candado nuevo obligatorio
  en `src/db/schema/devices.schema.spec.ts` (nombre del `describe`, nombre y
  ruta del SQL, y sentencia esperada). El mismo alcance excluyendo specs da
  `0`; no queda ninguna referencia de producción a la columna.

- Los candados de contrato HTTP/derivación permanecen intactos; el comando
  siguiente terminó en exit `0` y sin salida:

  ```text
  git diff --stat origin/main -- test/devices.e2e-spec.ts test/device-subscriptions.e2e-spec.ts test/device-connectivity.e2e-spec.ts src/modules/devices/infrastructure/mappers src/modules/devices/domain/connectivity.ts src/modules/devices/domain/connectivity.spec.ts
  ```

- Alcance de implementación contra el handoff `d7110e60`:

  ```text
   .../migrations/0016_drop_devices_connectivity.sql  |    1 +
   .../src/db/migrations/meta/0016_snapshot.json      | 2369 ++++++++++++++++++++
   .../src/db/migrations/meta/_journal.json           |    7 +
   .../src/db/schema/devices.schema.spec.ts           |   14 +-
   .../src/db/schema/devices.schema.ts                |    3 +-
   .../use-cases/claim-device.use-case.spec.ts        |    1 -
   .../use-cases/get-pet-device.use-case.spec.ts      |    1 -
   .../use-cases/release-device.use-case.spec.ts      |    1 -
   .../devices/domain/entities/device.entity.ts       |    4 -
   .../repositories/device.drizzle.repository.ts      |    1 -
   .../repositories/pet-device.drizzle.reader.ts      |    1 -
   .../application/use-cases/get-pet.use-case.spec.ts |    2 -
   .../modules/pets/domain/ports/pet-device-reader.ts |    1 -
   .../pets/infrastructure/pets.controller.spec.ts    |    3 -
   backend-pet-tracker/src/workers/ingestion-store.ts |    2 -
   backend-pet-tracker/test/alerts-engine.e2e-spec.ts |    1 -
   backend-pet-tracker/test/ingestion.e2e-spec.ts     |    2 -
   .../test/provision-device.e2e-spec.ts              |    1 -
   .../test/resource-isolation.e2e-spec.ts            |    1 -
   docs/data-model.md                                 |    2 +-
   .../traceability.md                                |    2 +-
   21 files changed, 2392 insertions(+), 28 deletions(-)
  ```

  `git diff --stat origin/main` añadió solo los siete ficheros de preparación
  ya presentes al recibir el handoff (`feature_list.json`,
  `progress/current.md`, el handoff y los cuatro ficheros de spec).

## R3

### Migración de `pet_tracker_wt`

- a) Estado previo del journal — exit `0`:

  ```text
  16|1787957375434
  ```

- b) Columna presente antes — exit `0`:

  ```text
  1
  ```

- c) Primera aplicación, `pnpm db:migrate` — exit `0`:

  ```text
  > drizzle-kit migrate
  Using 'pg' driver for database querying
  [✓] migrations applied successfully!
  ```

- d) Columna ausente después — exit `0`:

  ```text
  0
  ```

- e) Journal después — exit `0`:

  ```text
  17|1789440631931
  ```

- f) Segunda aplicación inmediata, `pnpm db:migrate` — exit `0`:

  ```text
  > drizzle-kit migrate
  Using 'pg' driver for database querying
  [✓] migrations applied successfully!
  17|1789440631931
  0
  ```

- g) `pnpm db:generate && git status --porcelain src/db/migrations` — exit
  `0`; la parte de `git status` no imprimió nada:

  ```text
  devices 14 columns 0 indexes 0 fks
  No schema changes, nothing to migrate 😴
  ```

### Verificación posterior

- Precondición LocalStack:
  `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` sin salida.
- `pnpm test:e2e` con la columna ausente — exit `0`:

  ```text
  Test Suites: 3 skipped, 26 passed, 26 of 29 total
  Tests:       8 skipped, 367 passed, 375 total
  Snapshots:   0 total
  ```

- La base compartida `pet_tracker` no se consultó ni modificó.

- Precondición del cierre:
  `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` sin salida.
- `./init.sh` final desde la raíz, sin pipe — exit `0`:

  ```text
  ✅ Build exitoso
  Test Suites: 166 passed, 166 total
  Tests:       1279 passed, 1279 total
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

### Cierre y alcance

- Estado final de `pet_tracker_wt`: journal `17|1789440631931`; consulta de
  la columna `connectivity`: `0`.
- `git diff --stat origin/main` capturado después del init final y antes de
  añadir este bloque:

  ```text
   .../migrations/0016_drop_devices_connectivity.sql  |    1 +
   .../src/db/migrations/meta/0016_snapshot.json      | 2369 ++++++++++++++++++++
   .../src/db/migrations/meta/_journal.json           |    7 +
   .../src/db/schema/devices.schema.spec.ts           |   14 +-
   .../src/db/schema/devices.schema.ts                |    3 +-
   .../use-cases/claim-device.use-case.spec.ts        |    1 -
   .../use-cases/get-pet-device.use-case.spec.ts      |    1 -
   .../use-cases/release-device.use-case.spec.ts      |    1 -
   .../devices/domain/entities/device.entity.ts       |    4 -
   .../repositories/device.drizzle.repository.ts      |    1 -
   .../repositories/pet-device.drizzle.reader.ts      |    1 -
   .../application/use-cases/get-pet.use-case.spec.ts |    2 -
   .../modules/pets/domain/ports/pet-device-reader.ts |    1 -
   .../pets/infrastructure/pets.controller.spec.ts    |    3 -
   backend-pet-tracker/src/workers/ingestion-store.ts |    2 -
   backend-pet-tracker/test/alerts-engine.e2e-spec.ts |    1 -
   backend-pet-tracker/test/ingestion.e2e-spec.ts     |    2 -
   .../test/provision-device.e2e-spec.ts              |    1 -
   .../test/resource-isolation.e2e-spec.ts            |    1 -
   docs/data-model.md                                 |    2 +-
   feature_list.json                                  |    2 +-
   progress/current.md                                |   33 +
   .../handoff_drop-devices-connectivity-column.md    |   82 +
   progress/impl_drop-devices-connectivity-column.md  |  202 ++
   specs/drop-devices-connectivity-column/design.md   |  216 ++
   .../requirements.md                                |  353 +++
   specs/drop-devices-connectivity-column/tasks.md    |  196 ++
   .../traceability.md                                |   20 +
   28 files changed, 3494 insertions(+), 28 deletions(-)
  ```

  Los 22 ficheros desde el handoff `d7110e60` son exactamente los de
  `design.md` §Archivos afectados. Los otros seis (`feature_list.json`,
  `progress/current.md`, handoff, requirements, design y tasks) ya estaban
  en la branch al recibirla. El diff acotado a los tres e2e protegidos,
  mapper, `connectivity.ts` y sus specs terminó en exit `0` sin salida;
  `mobile-pet-tracker/` tampoco tiene diff.

- Historia de implementación, sin rebase:

  ```text
  ffaf0669 test(drop-devices-connectivity-column): lock devices schema without connectivity (R1)
  0a131779 feat(drop-devices-connectivity-column): drop devices.connectivity column and migration 0016 (R1)
  f9020c3f docs(drop-devices-connectivity-column): drop connectivity from data-model (R1)
  8f16049b docs(drop-devices-connectivity-column): record pre-migration verification (R2)
  edcabc41 docs(drop-devices-connectivity-column): record migration verification (R3)
  9f61e16c docs(drop-devices-connectivity-column): finalize traceability (R1,R2,R3)
  ```
