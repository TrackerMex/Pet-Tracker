---
feature: "device-telemetry-reset-on-reassign"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[device-telemetry-reset-on-reassign]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` #92 (`description` + 4 `acceptance_criteria`),
> `progress/explore_pet-online-pill.md` §1 (:22-46), §2 (:47-62) y §9 G8 (:185),
> `specs/pet-online-pill/requirements.md` §Fuera de alcance G8 (:673-677).
> Toda cita se re-verificó contra este árbol (§0); las que no cuadraban se
> corrigen en §0.2 y el implementador construye sobre la versión corregida.
>
> Feature **backend puro** (`backend-pet-tracker/`): suites `pnpm test` (unit)
> y `pnpm test:e2e` (Postgres + LocalStack reales). No toca `mobile-pet-tracker/`
> ni `docs/ui-guidelines.md`. **Cero dependencias nuevas, cero migraciones,
> cero env nuevas, cero cambios de contrato HTTP** (las 5 claves de
> `toDeviceStatusResponse` siguen iguales; solo cambian valores).
>
> Depende de: `devices-claim` (#7, `done`) — repositorio, use cases y e2e que
> esta feature extiende; `wialon-ingestion-pipeline` (#8, `done`) — el WHERE
> de monotonicidad que R2 verifica; `pet-online-pill` (#73, `done`) — la
> derivación en lectura que hace visible el bug. Bloquea a #93
> (`drop-devices-connectivity-column`), que espera esta decisión de columnas.
>
> Rutas relativas al repo (`backend-pet-tracker/…`); dentro de un bloque
> claramente backend se omite el prefijo. Toda cita `ruta:línea` es del commit
> base `66a9d52b` (`origin/main`, branch
> `feature/92-device-telemetry-reset-on-reassign`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`).

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Veredicto | Evidencia leída |
|---|---|---|---|
| P1 | `claim` solo escribe `status` e `ingest_watermark` | **cierta** | `src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts:89-92`: `.set({ status: 'assigned', ingestWatermark, updatedAt: new Date() })` dentro de `db.transaction` (`:82-93`) |
| P2 | `release` solo escribe `released_at` y `status` | **cierta** | mismo fichero `:105-108` (`pet_devices.released_at`) y `:110-113` (`.set({ status: 'available', updatedAt })`) |
| P3 | El WHERE de monotonicidad acepta `last_message_at IS NULL` | **cierta** | `src/workers/ingestion.drizzle.store.ts:100-108`: `or(isNull(devices.lastMessageAt), lt(devices.lastMessageAt, update.lastMessageAt))` — el brazo `isNull` es `:104`. El store **ya no escribe `connectivity`** (`:95-99`, #73 R4) |
| P4 | El consumer solo escribe telemetría si la asignación sigue activa, y el chequeo es por **par** (device, pet) | **cierta** | `src/workers/positions-consumer.service.ts:203-209` (`isAssignmentActive(parsed.deviceId, parsed.petId)` → `return` si `false`) antes de `updateDeviceTelemetry` (`:221-224`); `ingestion.drizzle.store.ts:63-77` filtra `eq(petDevices.deviceId) AND eq(petDevices.petId) AND released_at IS NULL` (`:68-72`). Unit: `src/workers/positions-consumer.service.spec.ts:900-901` (R15 de #8, `isAssignmentActive → false` en `:915`) |
| P5 | El `201` del claim se construye con la entidad leída **antes** de la transacción | **cierta** | `src/modules/devices/application/use-cases/claim-device.use-case.ts:61` (`findByIdentifier`), `:91` (`await this.devices.claim(...)`), `:102` (`return device;` — el snapshot previo); `src/modules/devices/infrastructure/devices.controller.ts:41-44` lo pasa a `toDeviceStatusResponse(…, new Date())`. El puerto `claim` devuelve `Promise<void>` (`src/modules/devices/domain/repositories/device.repository.ts:44`) |
| P6 | Hay un camino de fin de asignación que **no pasa por `release`** | **cierta** | `DELETE /v1/pets/:petId` cascadea `pet_devices` (`src/db/schema/devices.schema.ts:69-71`, `onDelete: 'cascade'`) sin tocar `devices` — es el caso de #7 R15 (`specs/devices-claim/requirements.md:191-200`, e2e `test/devices.e2e-spec.ts` R15) y la razón de la decisión D3 de #7: el claim no confía en la caché de la fila |
| P7 | Ni `seed:devices` ni `provision:device` escriben telemetría | **cierta** | `grep -n "batteryPct\|lastMessageAt\|connectivity" scripts/*.ts` → sin resultados; `scripts/seed-devices.ts:24-37` inserta `status`/`model`/identificadores con `onConflictDoNothing` |
| P8 | Nadie lee la telemetría de un device **sin** asignación activa | **cierta** | Los tres lectores hacen `innerJoin` con la fila activa de `pet_devices`: `device.drizzle.repository.ts:57-63` (`findActiveByPetId`), `pet-device.drizzle.reader.ts:20-26` (perfil), y el 201 del claim es P5. `findByIdentifier` (`:35-43`) solo alimenta al use case (id/status). El poller solo lista asignaciones activas (`ingestion.drizzle.store.ts:26-45`) |
| P9 | Candados de claves que deben seguir verdes | **ciertas, líneas exactas** | `test/devices.e2e-spec.ts:274-280` (`CLAIM_KEYS`), `:313-320` (body literal del 201 de R3 con `batteryPct: null`, `connectivity: null`, `lastMessageAt: null`), `:745-751` (R11), `:844-850` (R12), `:854-905` (R13: ciclo claim → release → claim = 201); `test/device-subscriptions.e2e-spec.ts:354-356` (5 claves de `device` en el perfil) |
| P10 | Dobles de `DeviceRepository`: **no** hay `MockOf<T>`; son parciales con `as unknown as DeviceRepository` | **cierta** | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts:62-93` (`buildDeps`; `const claim = jest.fn().mockResolvedValue(undefined);` en `:64`), `release-device.use-case.spec.ts:40`, `get-pet-device.use-case.spec.ts`. `MockOf<T>` solo existe en `src/workers/*.spec.ts` sobre `IngestionStore`, cuyo contrato **no cambia** aquí |
| P11 | No existe spec unitaria del repositorio Drizzle | **cierta** | `ls src/modules/devices/infrastructure/repositories/` → solo `device.drizzle.repository.ts` y `pet-device.drizzle.reader.ts`. Regla `docs/conventions.md` §Tests: los repositorios Drizzle se cubren en e2e contra Postgres |
| P12 | Helpers e2e para sembrar directo en Postgres | **ciertos** | `test/devices.e2e-spec.ts:92-122` `seedDevice(label, overrides: Partial<typeof devices.$inferInsert>, subscribed = true)` — admite `batteryPct` y `lastMessageAt` como overrides; `claim(user, body)` `:282-287`; `api()` `:124-126`; `afterAll` `:143-164` borra `pet_devices`/`device_subscriptions`/`devices` de `createdDeviceIds`. Precedente de siembra directa de `last_message_at`: `test/device-connectivity.e2e-spec.ts:136-139,150-157` (#73 R3). El store se obtiene con `app.get<IngestionStore>(INGESTION_STORE)` (`test/ingestion.e2e-spec.ts:257`) |
| P13 | El e2e de ingesta ya cubre "primer mensaje con `last_message_at IS NULL`" | **cierta** | `test/ingestion.e2e-spec.ts:68-92` `resetSim001` deja `lastMessageAt: null` (`:90`); R19 (`:165`) hace claim + `runOnce` + `drainOnce` y asevera `deviceRow.lastMessageAt?.getTime() === lastPosition.ts` (`:220`) y `batteryPct` no nulo (`:219`). Es el mismo estado que deja el reset de R1 |

### §0.2 Premisas corregidas

| # | Premisa (origen) | Corrección | Evidencia |
|---|---|---|---|
| C1 | `release` está en `device.drizzle.repository.ts:107-112` (`feature_list.json` #92, explore §1 :44, pet-online-pill :673) | El método es `:102-115`; el UPDATE de `devices` es `:110-113` y el de `pet_devices` `:105-108`. Solo afecta a la cita | `cat -n` del fichero |
| C2 | Explore §1 :24-28: el store escribe `connectivity: 'online'` en `:97` | **Obsoleto desde #73 R4**: `:95-99` escribe solo `batteryPct`, `lastMessageAt`, `updatedAt`. `connectivity` queda NULL siempre y la deriva `deriveConnectivity` en lectura (`src/modules/devices/domain/connectivity.ts:7-18`). Por eso esta feature **no** toca `connectivity` (lo borra #93) | `ingestion.drizzle.store.ts:89-109`; `docs/data-model.md:53` |
| C3 | El enunciado recomienda el reset **en `release`** ("cuando los datos dejan de pertenecer a la mascota") | Se decide **en `claim`** (D1): entre `release` y el siguiente `claim` la fila es inobservable (P8), y el camino de #7 R15 (P6) nunca pasa por `release`. Un reset solo en `release` deja el bug intacto para "borrar mascota con collar → reclamar el collar con otra". Ver [[design]] D1 y §Alternativas | P6, P8 |
| C4 | Criterio 1: "e2e que reclama un collar con telemetría vieja sembrada en Postgres y recibe … null en el 201" | Con el reset en `claim`, el 201 solo puede ser correcto si se construye con la fila **persistida** (P5). D3 lo resuelve con `.returning()` en la transacción; es parte de R1, no una tarea aparte | P5 |

---

## Decisiones cerradas (el humano ratifica o cambia en §Aprobación)

| Id | Decisión | Detalle en |
|---|---|---|
| **D1** | **Momento del reset: `claim`, no `release`.** El claim es el único punto por el que pasa **toda** asignación nueva (release previo, cascade de #7 R15, fila sembrada o provisionada, edición manual). `release` **no cambia**: entre release y el siguiente claim nadie lee la fila (P8) y un segundo reset sería código sin observación posible | [[design]] D1 |
| **D2** | **Columnas: `battery_pct` y `last_message_at` → NULL.** `connectivity` no se toca (NULL siempre desde #73; la borra #93). `ingest_watermark` sigue con la regla de #7 R3 (`now − 10 min`). `pets.last_position` y `pets.last_communication_at` son de la mascota y quedan fuera | [[design]] D2 |
| **D3** | **El 201 del claim se construye con la fila tal como quedó tras la transacción.** `DeviceRepository.claim` pasa a devolver `Promise<Device>` (`.returning()` del UPDATE dentro de la misma transacción, mapeado con `toDomain`); `ClaimDeviceUseCase.execute` devuelve esa entidad en vez del snapshot previo. Firma y doc del puerto cambian; ningún otro método del puerto cambia | [[design]] D3 |
| **D4** | **El WHERE de `updateDeviceTelemetry` no se toca.** `ingestion.drizzle.store.ts:104` ya acepta `last_message_at IS NULL` (P3) y `test/ingestion.e2e-spec.ts:220` ya lo cubre (P13). R2 lo verifica con una aserción propia dentro del e2e de R1 y una sonda de mutación (C4 vía (b)) | [[design]] D4 |
| **D5** | **Mensaje tardío del dueño anterior: sin código.** El guard por par (P4) hace que un mensaje `(device, petA)` encolado antes del release nunca escriba telemetría, ni siquiera después de que `petB` reclame el collar (`isAssignmentActive(device, petA)` es `false` porque la fila activa es de `petB`). Su histórico sí va a `PET#petA` en DynamoDB (R13/R15 de #8, por diseño). No hay hueco que documentar salvo el lookback (§Fuera de alcance) | [[design]] D5 |

---

## Requisitos funcionales

### R1 — el claim arranca con la caché de telemetría limpia y el 201 lo refleja

**WHEN** `POST /v1/devices/claim` confirma la transacción de #7 R3 sobre un
device cuya fila de `devices` conserva `battery_pct` y/o `last_message_at` de
una asignación anterior (o sembrados directamente),
**THE SYSTEM SHALL**, **en la misma transacción** de #7 R3 (INSERT
`pet_devices` + UPDATE `devices`), dejar en `devices` `battery_pct = NULL` y
`last_message_at = NULL` además de `status = 'assigned'` e
`ingest_watermark = now − 10 min`;

**AND** el body del `201` **SHALL** construirse con la fila de `devices` tal
como quedó **persistida** por esa transacción (no con la lectura previa de
`findByIdentifier`), de modo que responda `batteryPct: null`,
`connectivity: null`, `lastMessageAt: null` con las mismas 5 claves y el
mismo `model`/`esn` de siempre;

**AND** `GET /v1/pets/:petId/device` y la clave `device` de
`GET /v1/pets/:petId` **SHALL** responder esos mismos tres `null`
inmediatamente después del claim, hasta que llegue el primer mensaje nuevo;

**AND** `pets.last_position` y `pets.last_communication_at` de **ninguna**
mascota **SHALL NOT** cambiar por efecto del claim ni del release.

IF la transacción falla THEN nada de lo anterior queda persistido (heredado de
#7 R3; el `.returning()` vive dentro del mismo `db.transaction`).

**Test e2e** — `test/devices.e2e-spec.ts`, `describe('#92 R1: el claim deja
battery_pct y last_message_at en NULL y el 201 refleja la fila persistida')`,
dos `it` autocontenidos con los helpers existentes (P12):

- (a) **Fila sembrada con telemetría vieja** (camino de #7 R15 / siembra):
  `seedDevice('R1-92a', { batteryPct: 37, lastMessageAt: <now − 60 s> })`
  (60 s < `DEVICE_ONLINE_THRESHOLD_MS`: sin reset el device se vería
  `'online'` con batería ajena — es el síntoma literal del enunciado). Claim
  por el owner → `201`; `Object.keys(body).sort()` = `CLAIM_KEYS`; `body` =
  `{ model: 'e2e-collar', batteryPct: null, connectivity: null,
  lastMessageAt: null, esn: device.esn }`. Luego la fila en Postgres:
  `batteryPct === null`, `lastMessageAt === null`, `status === 'assigned'`.
  Luego `GET /v1/pets/:petId/device` → mismo objeto. Luego **la cola de R2**
  (ver abajo).
- (b) **Ciclo de reasignación** (el caso que da nombre a la feature):
  `seedDevice('R1-92b')` limpio → claim por `ownerA`/`petA` → simular
  telemetría del dueño A escribiendo **directo en Postgres**
  (`db.update(devices).set({ batteryPct: 63, lastMessageAt: <now − 30 s> })`,
  patrón de `test/device-connectivity.e2e-spec.ts:150-157`) → leer
  `pets.last_position`/`last_communication_at` de `petA` (serán `null`: nadie
  las escribió) → `DELETE /v1/pets/${petA.id}/device` con `ownerA` → `204` →
  claim por `ownerB`/`petB` → `201` con los tres `null` → `GET
  /v1/pets/${petB.id}/device` con `ownerB` → los tres `null` → `GET
  /v1/pets/${petB.id}` → `body.device` con los tres `null` → `pets` de `petA`
  sin cambios respecto a la lectura previa (las dos columnas siguen `null`).
  **No** se asevera el estado de la fila de `devices` entre release y
  re-claim (D1: no es un contrato).

**Test unitario** — `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts`,
`describe('#92 R1: execute devuelve la entidad que claim() persistió, no el
snapshot previo')`, un `it`: `findByIdentifier` resuelve
`buildDevice({ batteryPct: 37, lastMessageAt: new Date('2026-08-01T11:59:00.000Z') })`
(status `'available'`), `claim` resuelve
`buildDevice({ status: 'assigned', ingestWatermark: new Date('2026-08-01T11:50:00.000Z') })`
(telemetría `null` por defecto de `buildDevice`); `await execute(DTO, USER_ID)`
**es** (`toBe`) el valor que resolvió `claim`. Para que compile en rojo, el
`buildDeps` de `:64` pasa a `jest.fn().mockResolvedValue(buildDevice({ status:
'assigned' }))` (delta declarado en §Candados; #7 R3 en `:104-131` solo
asevera `device.id`, `:128`, y sigue verde).

### R2 — el primer mensaje tras el reset entra por el WHERE de monotonicidad (verificación)

**WHILE** un device recién reclamado tiene `last_message_at IS NULL` por
efecto de R1,
**WHEN** el consumer invoca `IngestionStore.updateDeviceTelemetry(deviceId,
{ batteryPct, lastMessageAt })` con el primer mensaje de la nueva asignación,
**THE SYSTEM SHALL** persistir ese `battery_pct` y `last_message_at` (el
brazo `isNull(devices.lastMessageAt)` de `ingestion.drizzle.store.ts:104`
acepta la fila), y `GET /v1/pets/:petId/device` **SHALL** responder ese
`batteryPct`, `connectivity: 'online'` y ese `lastMessageAt` en ISO 8601.

**Requisito de verificación** (C4 de `CHECKPOINTS.md`, tercer punto, vía
**(b)**): el código que verifica ya existe (P3) y ya tiene candado en
`test/ingestion.e2e-spec.ts:219-220` (P13). Aquí se añade una **aserción
nombrada** al final del `it` (a) de R1: obtener el store con
`app.get<IngestionStore>(INGESTION_STORE)` (P12), llamar
`updateDeviceTelemetry(device.id, { batteryPct: 80, lastMessageAt: <Date fija
= now> })`, y aseverar en `GET /v1/pets/:petId/device`: `batteryPct === 80`,
`connectivity === 'online'`, `lastMessageAt === <esa Date>.toISOString()`.
Esa aserción es verde desde el primer verde de R1 (no tiene rojo propio); su
vida se demuestra con la **sonda de mutación** de [[tasks]] §R2 (quitar el
brazo `isNull` de `:104` → el `it` (a) cae **por esta aserción** → revertir),
con la evidencia en `progress/impl_device-telemetry-reset-on-reassign.md`
§R2 y repetida por el `reviewer`. No se versiona la mutación: el candado
existente de #8 (`:220`) ya vigila el mismo brazo, y la aserción nueva solo
lo nombra desde #92.

### R3 — los candados existentes siguen verdes; los deltas están declarados (verificación)

**WHEN** se ejecuta `./init.sh` desde la raíz con R1 implementado,
**THE SYSTEM SHALL** terminar verde con **todos** los tests de la tabla
§Candados "siguen verdes" intactos (sin editar), y con exactamente los
cambios de la tabla "se mueven" — ninguno más — en tests de features
anteriores.

**Requisito de verificación** (C4 vía (b)): sin test nuevo. Cierre = salida
de `./init.sh` (exit 0, medido **sin pipe**) + `git diff --stat origin/main`
restringido a los ficheros de [[design]] §Archivos afectados, ambos en
`progress/impl_device-telemetry-reset-on-reassign.md` §R3. Cifras de candado:
**ninguna** cifra absoluta se mueve (no hay candados de recuento en
`backend-pet-tracker/` afectados por estos ficheros; los de `mobile-pet-tracker/`
no se tocan).

---

## Candados

### Se mueven (delta declarado; el implementador los cambia en el commit rojo de R1)

| Fichero:línea | Antes | Después | Por |
|---|---|---|---|
| `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts:64` | `const claim = jest.fn().mockResolvedValue(undefined);` | `const claim = jest.fn().mockResolvedValue(buildDevice({ status: 'assigned' }));` | R1 (D3: el puerto resuelve la entidad persistida) |

### Siguen verdes sin tocarlos (si alguno se pone rojo, la implementación está mal, no el candado)

| Candado | Qué fija |
|---|---|
| `test/devices.e2e-spec.ts:274-280,299-346` | `CLAIM_KEYS` y el body literal del 201 de #7 R3 (`batteryPct/connectivity/lastMessageAt: null`, `model`, `esn`); `status 'assigned'`; watermark `now − 10 min` |
| `test/devices.e2e-spec.ts:727-752,791-852` | R11 y R12 de #7: 5 claves en `GET …/device` y en `device` del perfil; 24 claves del perfil |
| `test/devices.e2e-spec.ts:854-905` | R13 de #7: `204`, `released_at`, `status 'available'`, auditoría, re-claim `201` |
| `test/devices.e2e-spec.ts` R8 `:572-647` | carrera de claims: `[201, 409]`, una sola fila activa — el `.returning()` no altera la traducción del 23505 |
| `test/device-subscriptions.e2e-spec.ts:354-356` | 5 claves de `device` en el perfil |
| `test/device-connectivity.e2e-spec.ts:134-176` | #73 R3: derivación `null`/`offline`/`online` (siembra directa de `last_message_at` sobre una asignación activa, sin claim) |
| `test/ingestion.e2e-spec.ts:165-253,255-303` | #8 R19 (primer mensaje con `last_message_at IS NULL`) y R14 (guard "solo si más reciente") |
| `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts:104-131,133-340` | #7 R3 (solo asevera `device.id`), R5-R10, #25 R7: `claim` no llamado / rechazado — indiferentes al valor resuelto |
| `src/modules/devices/application/use-cases/release-device.use-case.spec.ts` | #7 R13/R14: `release(assignmentId, deviceId)` — firma intacta |
| `src/modules/devices/application/use-cases/get-pet-device.use-case.spec.ts` | #7 R11 |
| `src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts` | #73 R2: mapper con `now` |
| `src/db/schema/devices.schema.spec.ts` | columnas de `devices` — sin migración, nada cambia |
| `src/workers/positions-consumer.service.spec.ts:900-901` | #8 R15: asignación liberada → sin escritura de caché (D5) |
| `src/workers/poller.service.spec.ts`, `positions-consumer.service.spec.ts` (`MockOf<IngestionStore>`) | `IngestionStore` no cambia de forma |

---

## Fuera de alcance (cada uno con su porqué)

- **Reset también en `release`**: descartado por D1 — redundante una vez que
  el claim resetea, e inobservable mientras el device no tiene asignación
  (P8). Si un lector futuro de devices sin asignar (inventario, scheduler
  `device_offline` de `plans/007`) lo necesita, son 2 líneas en
  `release()` (`:110-113`) con su e2e, feature aparte.
- **`devices.connectivity`**: NULL siempre desde #73; la borra #93 con
  migración. Aquí no se lee ni se escribe.
- **`pets.last_position` / `pets.last_communication_at`**: son de la mascota
  (su último punto conocido sigue siendo verdad aunque cambie de collar).
  R1 solo asevera que **no** cambian.
- **Lookback del watermark (10 min, #7 R3)**: si `petB` reclama un collar
  menos de 10 min después de que `petA` lo liberara, el poller puede traer
  posiciones emitidas durante la asignación de A y el consumer las atribuye
  a B (histórico `PET#petB`, `pets.last_position` de B y la telemetría del
  device). R1 garantiza caché limpia **en el instante del claim**, no que el
  primer mensaje posterior se emitiera tras el claim. Es diseño de #7/#8;
  cambiar el lookback en reclaims es decisión de producto aparte.
- **Histórico en DynamoDB del mensaje tardío del dueño anterior**: se escribe
  bajo `PET#petA` aunque la asignación ya esté liberada (#8 R13/R15, "el dato
  es del periodo de asignación"). No es telemetría del device y no se toca.
- **`mobile-pet-tracker/`**: nada. La Home/Pairing ya pintan "Esperando
  señal" para `connectivity: null` (#73 R6/R7); tras esta feature ese es el
  estado real de un collar recién reclamado.
- **#94** (`mobile-map-staleness-single-source`): independiente.

---

## Aprobación

Firmar sin editar = aceptar D1-D5 tal cual (en particular **D1: reset en
`claim`, `release` intacto**, que corrige la recomendación del enunciado, y
**D3: `DeviceRepository.claim` devuelve `Promise<Device>`**).

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
