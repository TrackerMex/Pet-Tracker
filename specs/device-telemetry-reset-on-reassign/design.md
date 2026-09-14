---
feature: "device-telemetry-reset-on-reassign"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[device-telemetry-reset-on-reassign]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Citas `ruta:línea` del commit base `66a9d52b`; rutas relativas a
> `backend-pet-tracker/`.

## Decisiones técnicas

- **D1 — El reset vive en `DeviceDrizzleRepository.claim`, no en `release`**
  — sirve a R1. El claim es el único punto por el que pasa toda asignación
  nueva: tras un `release` (`DELETE /v1/pets/:petId/device`), tras el
  `ON DELETE CASCADE` de `pets` que borra `pet_devices` sin tocar `devices`
  (#7 R15, `src/db/schema/devices.schema.ts:69-71`), tras una siembra o
  provisión, o tras una edición manual. Es el mismo principio con el que #7
  D3 resolvió `devices.status`: la fila de `devices` es caché y el claim no
  confía en ella. Un reset solo en `release` deja el bug intacto en el camino
  del cascade, y un reset en ambos sitios duplica un efecto que entre release
  y claim nadie puede observar (`findActiveByPetId` `:57-63` y
  `pet-device.drizzle.reader.ts:20-26` hacen `innerJoin` con la fila activa;
  el poller solo lista asignaciones activas, `ingestion.drizzle.store.ts:26-45`).
  Cambio: `device.drizzle.repository.ts:89-92` pasa de
  `.set({ status: 'assigned', ingestWatermark, updatedAt: new Date() })` a
  `.set({ status: 'assigned', ingestWatermark, batteryPct: null, lastMessageAt: null, updatedAt: new Date() })`.
  Sigue dentro de `db.transaction` (`:82-93`) y dentro del `try` que traduce
  el 23505 (`:94-99`): la carrera de #7 R8 no cambia.

- **D2 — Columnas: `battery_pct` y `last_message_at`; nada más** — sirve a
  R1. `connectivity` es NULL siempre desde #73 R4 (`ingestion.drizzle.store.ts:95-99`
  ya no la escribe; la API la deriva en lectura con `deriveConnectivity`,
  `src/modules/devices/domain/connectivity.ts:7-18`) y #93 la borra: escribir
  `connectivity: null` aquí sería tocar dos veces la misma columna en dos
  features. `ingest_watermark` conserva la regla de #7 R3. `pets.last_position`
  y `pets.last_communication_at` son de la mascota: el claim no toca `pets`.

- **D3 — El 201 se construye con la fila persistida: `claim()` devuelve
  `Promise<Device>` vía `.returning()`** — sirve a R1. Hoy
  `ClaimDeviceUseCase.execute` devuelve el snapshot leído por
  `findByIdentifier` **antes** de la transacción (`claim-device.use-case.ts:61,102`),
  así que con el reset en el claim el 201 mostraría la telemetría vieja y el
  `GET` siguiente `null`: un contrato inconsistente dentro de la misma
  petición. La forma nativa de Drizzle es `.returning()` sobre el UPDATE
  dentro de la misma transacción:
  - `device.repository.ts:44`: `claim(deviceId, petId, ingestWatermark): Promise<Device>`;
    doc `:38-43` añade "devuelve la fila de `devices` tal como quedó tras la
    transacción; `battery_pct` y `last_message_at` quedan NULL (#92 R1)".
  - `device.drizzle.repository.ts:74-100`: la callback de `db.transaction`
    hace `const [row] = await tx.update(devices).set({...}).where(eq(devices.id, deviceId)).returning();`
    y `return toDomain(row);` (`toDomain` ya existe, `:118-136`); el método
    hace `return await this.db.transaction(...)` dentro del `try`. La fila
    existe por construcción (el use case acaba de leerla y los devices no se
    borran en el MVP, #7 D3): sin rama de error nueva.
  - `claim-device.use-case.ts:91,102`: `const claimed = await this.devices.claim(...)`;
    la auditoría (`:94-100`) sigue tras el commit; `return claimed;`.
  - Efecto colateral bueno: la entidad devuelta deja de mentir en `status`
    (`'available'` → `'assigned'`) e `ingestWatermark`; el mapper
    (`device-status.mapper.ts:25-38`) solo lee `model/batteryPct/lastMessageAt/esn`,
    así que el body de #7 R3 (`test/devices.e2e-spec.ts:313-320`) sigue
    idéntico.
  - Dobles: `claim-device.use-case.spec.ts:64` pasa a resolver
    `buildDevice({ status: 'assigned' })` (delta declarado). Los demás
    dobles de `DeviceRepository` (`release-device.use-case.spec.ts:40`,
    `get-pet-device.use-case.spec.ts`) no mockean `claim` y no cambian. No
    hay `MockOf<DeviceRepository>` en el árbol.

- **D4 — El WHERE de monotonicidad no se toca; R2 lo verifica** — sirve a
  R2. `ingestion.drizzle.store.ts:100-108`:
  `or(isNull(devices.lastMessageAt), lt(devices.lastMessageAt, update.lastMessageAt))`.
  El brazo `isNull` (`:104`) es exactamente el estado que deja R1, y
  `test/ingestion.e2e-spec.ts:220` ya lo cubre desde #8 (SIM-001 parte de
  `lastMessageAt: null` por `resetSim001`, `:68-92`). Basta con una aserción
  nombrada en el e2e de R1 (llamando al store real de `INGESTION_STORE`
  contra Postgres, sin LocalStack) y una sonda de mutación; nada de código.

- **D5 — Mensaje tardío del dueño anterior: cubierto por el guard por par**
  — sirve a la pregunta del enunciado, sin requisito. El consumer solo
  escribe caché si `isAssignmentActive(deviceId, petId)` (`positions-consumer.service.ts:203-209`)
  y el store filtra por `device_id AND pet_id AND released_at IS NULL`
  (`ingestion.drizzle.store.ts:68-72`). Un mensaje `(device, petA)` que
  llegue tras el release — incluso después de que `petB` reclame el mismo
  collar — recibe `false` y no toca `devices` ni `pets`; su histórico va a
  `PET#petA` (#8 R13/R15, por diseño). Test existente:
  `positions-consumer.service.spec.ts:900-901`. Único hueco real, el
  lookback de 10 min del watermark, queda en [[requirements]] §Fuera de
  alcance.

- **D6 — Tests: e2e en la suite existente, unit solo en el use case** —
  sirve a R1-R3. `test/devices.e2e-spec.ts` ya tiene `seedDevice` con
  overrides tipados (`Partial<typeof devices.$inferInsert>`, `:92-122`),
  `claim()`, `api()`, `CLAIM_KEYS` y limpieza en `afterAll` (`:143-164`):
  un fichero e2e nuevo duplicaría el arnés. La telemetría "vieja" se siembra
  **directo en Postgres** con drizzle (`db.update(devices).set({...})` /
  override de `seedDevice`), no con un mock: es el patrón de
  `test/device-connectivity.e2e-spec.ts:136-157`. El repositorio Drizzle no
  tiene spec unitaria (`docs/conventions.md` §Tests: se cubre en e2e). El use
  case gana un `it` bajo `describe('#92 R1: …')` porque su contrato de
  retorno cambia y los use cases se testean con dobles.

## Estructura de capas

```
backend-pet-tracker/src/modules/devices/
├── domain/repositories/device.repository.ts        [editado: claim(): Promise<Device> + doc]
├── domain/entities/device.entity.ts                [editado: comentarios :17-22 — "y vuelven a NULL en cada claim (#92)"]
├── application/use-cases/claim-device.use-case.ts  [editado: devuelve lo que claim() persistió]
├── application/use-cases/claim-device.use-case.spec.ts [editado: mock de claim + describe '#92 R1']
└── infrastructure/repositories/device.drizzle.repository.ts [editado: set + .returning() + return toDomain]

backend-pet-tracker/test/devices.e2e-spec.ts        [editado: describe '#92 R1' con 2 it; import INGESTION_STORE]
backend-pet-tracker/src/db/schema/devices.schema.ts [editado: comentario :22-24]
docs/data-model.md:53                               [editado: nota en la fila devices]
```

Capas: el reset es persistencia (infrastructure); el puerto (domain) solo
cambia el tipo de retorno; el use case (application) sigue dependiendo de la
interface. Sin imports nuevos en domain.

## Archivos afectados

- `backend-pet-tracker/src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts` — infrastructure; `claim()` `:74-100`: `batteryPct: null, lastMessageAt: null` en el `set` + `.returning()` + `return toDomain(row)` (R1). `release()` **no cambia**.
- `backend-pet-tracker/src/modules/devices/domain/repositories/device.repository.ts` — domain; firma `:44` y doc `:38-43` (R1).
- `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.ts` — application; `:91,102` (R1).
- `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.spec.ts` — `:64` mock + `describe('#92 R1')` nuevo (R1).
- `backend-pet-tracker/test/devices.e2e-spec.ts` — `describe('#92 R1')` con `it` (a) y (b); la cola de (a) es la aserción de R2; import de `INGESTION_STORE`/`IngestionStore` desde `@/workers/ingestion-store` (R1, R2).
- `backend-pet-tracker/src/modules/devices/domain/entities/device.entity.ts` — comentarios `:17-22` (docs, R1).
- `backend-pet-tracker/src/db/schema/devices.schema.ts` — comentario `:22-24` (docs, R1).
- `docs/data-model.md` — fila `devices` (`:53`): "`battery_pct` y `last_message_at` vuelven a NULL en cada claim (#92)" (docs, R1).
- `progress/impl_device-telemetry-reset-on-reassign.md` — evidencias de R2 (sonda) y R3 (`init.sh`, `diff --stat`).
- `specs/device-telemetry-reset-on-reassign/traceability.md` — tras cada commit.

**No se tocan**: `release()`, `ingestion.drizzle.store.ts`, `ingestion-store.ts`,
`positions-consumer.service.ts`, mappers, controllers, `pet-device.drizzle.reader.ts`,
schema (sin migración), `test/device-subscriptions.e2e-spec.ts`,
`test/device-connectivity.e2e-spec.ts`, `test/ingestion.e2e-spec.ts`, nada de
`mobile-pet-tracker/`. Sin dependencias, env ni migraciones nuevas.

## Alternativas descartadas

- **Reset en `release` (recomendación del enunciado)**: descartado como
  único punto — no cubre el cascade de #7 R15 ni filas con telemetría que
  nunca pasaron por release; y el e2e del criterio 1 ("collar con telemetría
  vieja sembrada → claim → null") no se puede escribir así. Como punto
  **adicional** al claim: descartado por YAGNI, nadie lee la fila sin
  asignación activa (P8).
- **Reset en `claim` sin tocar el retorno del puerto, construyendo el 201 en
  el use case con `new Device({ ...device, batteryPct: null, lastMessageAt: null })`**:
  descartado — la lista de columnas reseteadas viviría en dos capas y se
  desincronizaría en el primer cambio.
- **Reset en `claim` y re-lectura con `findActiveByPetId(petId)` en el use
  case para el 201**: descartado — segunda consulta y un `?? device` de
  respaldo para un caso imposible, cuando `.returning()` lo da en la misma
  transacción sin coste.
- **Método nuevo `resetTelemetry(deviceId)` en `DeviceRepository`**:
  descartado — segunda escritura fuera de la transacción del claim (o dentro,
  con un método más que mantener); dos líneas en el `set` existente hacen lo
  mismo atómicamente.
- **Escribir también `connectivity: null`**: descartado — ya es NULL siempre
  (#73 R4) y #93 borra la columna; tocarla aquí obliga a #93 a editar este
  mismo `set`.
- **Spec unitaria nueva del repositorio Drizzle**: descartado —
  `docs/conventions.md` §Tests cubre los repositorios en e2e; el e2e de R1
  ya prueba el reset contra Postgres real.
- **Fichero e2e nuevo `test/device-telemetry-reset.e2e-spec.ts`**:
  descartado — duplicaría `seedUser`/`createPetViaApi`/`seedDevice`/`claim`
  y la limpieza; `files_affected` de #92 ya apunta a `test/devices.e2e-spec.ts`.
- **Test propio (rojo real) para el WHERE de R2 versionando una mutación de
  `ingestion.drizzle.store.ts:104`**: descartado — el brazo ya tiene candado
  vivo en `test/ingestion.e2e-spec.ts:220` (#8 R19); basta la aserción
  nombrada en el e2e de R1 más la sonda no versionada (precedente #73 R10).
- **Cambiar el lookback del watermark en reclaims rápidos**: fuera de
  alcance (decisión de producto sobre #7 R3/#8).
