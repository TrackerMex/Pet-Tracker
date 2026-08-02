# impl: devices-claim
Fecha: 2026-08-01 (sesión implementer, branch `feature/7-devices-claim`)

## Archivos creados

- `backend-pet-tracker/src/db/schema/devices.schema.ts` — tablas `devices` + `pet_devices` (R1): 5 identificadores UNIQUE (D4), CHECK de status, índices únicos parciales sobre `device_id` y `pet_id` activos (D2) + btree normales en las FKs.
- `backend-pet-tracker/src/db/schema/devices.schema.spec.ts` — test R1 vía `getTableConfig` + inspección del SQL de la migración (no toca otras tablas).
- `backend-pet-tracker/src/db/migrations/0004_devices_claim_tables.sql` (+ meta) — generada con `drizzle-kit generate --name devices_claim_tables`; solo `devices`/`pet_devices`.
- `backend-pet-tracker/scripts/seed-devices.ts` — seed idempotente SIM-001..003 / ACT-001..003 / wialon 900001..3 (R2). `ON CONFLICT (esn) DO NOTHING` — no es upsert a propósito. Exporta `seedSimulatedDevices(db)` (el e2e la reutiliza); patrón dotenv+Pool de `provision-local.ts`.
- `backend-pet-tracker/src/modules/devices/domain/entities/device.entity.ts` — clase pura `Device`.
- `backend-pet-tracker/src/modules/devices/domain/errors/device.errors.ts` — los 6 errores de la tabla del design (sin `@nestjs/common`).
- `backend-pet-tracker/src/modules/devices/domain/repositories/device.repository.ts` — `DEVICE_REPOSITORY` + interface (`findByIdentifier`, `hasActiveAssignment`, `findActiveByPetId`, `claim`, `release`) + tipos de identificador.
- `backend-pet-tracker/src/modules/devices/application/dto/claim-device.dto.ts` (+`.spec`) — `ClaimDeviceSchema` zod: `petId` `z.uuid()` + XOR de exactamente un identificador ≤64 chars (R4); `toDeviceIdentifier()`.
- `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.ts` (+`.spec`) — R3, R5-R10. Orden estricto: membresía (404) → rol (403) → device 404 → device 409 → pet 409 → transacción → audit. `CLAIM_WATERMARK_LOOKBACK_MINUTES = 10`.
- `backend-pet-tracker/src/modules/devices/application/use-cases/get-pet-device.use-case.ts` (+`.spec`) — R11, `Device | null`.
- `backend-pet-tracker/src/modules/devices/application/use-cases/release-device.use-case.ts` (+`.spec`) — R13/R14.
- `backend-pet-tracker/src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts` — transacciones claim/release; traduce 23505 por nombre de índice a `DeviceAlreadyAssignedError` / `PetAlreadyHasDeviceError` desenrollando `error.cause` (drizzle anida el error de pg).
- `backend-pet-tracker/src/modules/devices/infrastructure/repositories/pet-device.drizzle.reader.ts` — implementación del puerto `PET_DEVICE_READER` de pets (R12).
- `backend-pet-tracker/src/modules/devices/infrastructure/mappers/device-status.mapper.ts` (+`.spec`) — el único mapper de las 5 claves `{model, batteryPct, connectivity, lastMessageAt, esn}` (R3/R11/R12).
- `backend-pet-tracker/src/modules/devices/infrastructure/mappers/device-error.mapper.ts` — tabla error de dominio → HTTP compartida por los dos controllers (archivo extra respecto al design; evita duplicar el mapeo).
- `backend-pet-tracker/src/modules/devices/infrastructure/devices.controller.ts` — `POST /v1/devices/claim` (sin guard, D1).
- `backend-pet-tracker/src/modules/devices/infrastructure/pet-device.controller.ts` — `GET`/`DELETE /v1/pets/:petId/device` con `PetAccessGuard` reutilizado; `DELETE` con `@RequirePetRole('owner')`.
- `backend-pet-tracker/src/modules/devices/pet-device-read.module.ts` — sub-módulo solo-DRIZZLE que rompe el ciclo (grafo: `DevicesModule → PetsModule → PetDeviceReadModule`).
- `backend-pet-tracker/src/modules/devices/devices.module.ts` — importa `PetsModule`; providers + 2 controllers.
- `backend-pet-tracker/src/modules/pets/domain/ports/pet-device-reader.ts` — puerto + token `PET_DEVICE_READER` + tipo `ActivePetDeviceStatus` (pets es dueño de su necesidad).
- `backend-pet-tracker/test/devices.e2e-spec.ts` — 21 tests e2e contra Postgres real (R2-R15), incluye IDOR (R5), carrera concurrente (R8) y self-healing (R15).

## Archivos modificados

- `backend-pet-tracker/src/db/schema/index.ts` — re-export de `devices.schema` (R1).
- `backend-pet-tracker/package.json` — script `seed:devices` (R2).
- `backend-pet-tracker/src/app.module.ts` — importa `DevicesModule`.
- `backend-pet-tracker/src/modules/pets/pets.module.ts` — importa `PetDeviceReadModule` (R12).
- `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.ts` (+`.spec`) — inyecta el puerto; devuelve `{ pet, device }` (edición sancionada por el design de #5/#7).
- `backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts` — `device: DeviceStatusResponse | null` (forma del contrato intacta, solo se ensancha el tipo del placeholder).
- `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts` (+`.spec`) — `detail` pasa el device serializado con el mismo mapper.
- `docs/data-model.md` — filas `devices`/`pet_devices` actualizadas con D2 (índice parcial pet_id) y D4 (UNIQUEs en serial_number/activation_code) — punto 6 del encargo.
- `specs/devices-claim/traceability.md` — 15/15 filas completas, cero "pendiente".

## Requisitos cubiertos

| R | Test | Commit |
|---|---|---|
| R1 | `devices.schema.spec.ts` (12 tests) | `318f75f` |
| R2 | `devices.e2e-spec.ts::R2` + `pnpm run seed:devices` exit 0 x2 manual | `172786a` |
| R3 | `claim-device.use-case.spec.ts::R3` + e2e R3 (watermark verificado en DB) | `b03e8fb`, `34a6b6e` |
| R4 | `claim-device.dto.spec.ts` (10 tests) + e2e R4 | `992f670`, `34a6b6e` |
| R5 | use-case spec R5 (orden: sin tocar devices) + e2e IDOR body-igual-al-guard | `b03e8fb`, `34a6b6e` |
| R6 | use-case spec R6 + e2e R6 | `b03e8fb`, `34a6b6e` |
| R7 | use-case spec R7 + e2e R7 (`DEVICE_NOT_FOUND`) | `b03e8fb`, `34a6b6e` |
| R8 | use-case spec R8 (3 tests) + e2e R8 (re-claim, inactive, carrera `Promise.all` → [201,409]) | `b03e8fb`, `34a6b6e` |
| R9 | use-case spec R9 + e2e R9 (`PET_ALREADY_HAS_DEVICE`) | `b03e8fb`, `34a6b6e` |
| R10 | use-case spec R10 (meta exacta, no-audit en fallo) + e2e R10 | `b03e8fb`, `34a6b6e` |
| R11 | `get-pet-device.use-case.spec.ts` + `device-status.mapper.spec.ts` + e2e R11 (null literal, guard) | `6ac052b` |
| R12 | `get-pet.use-case.spec.ts::R12` + `pets.controller.spec.ts::R12` + e2e R12 (24 claves intactas) | `609b5f1` |
| R13 | `release-device.use-case.spec.ts::R13` + e2e R13 (ciclo claim→release→claim con otro owner) | `1c16986` |
| R14 | `release-device.use-case.spec.ts::R14` + e2e R14 (404 código, 403 rol, 404 guard precede) | `1c16986` |
| R15 | e2e R15 (claim → DELETE pet → re-claim 201 con status huérfano 'assigned') | `0bbad33` |

Commits adicionales: `9133343` (spec aprobada + arranque), `c5d69c1` (docs data-model D2/D4 + traceability), `ce37370` (style: prettier autofix del lint).

## Decisiones de diseño

- **D1-D4 tal como la spec** (aceptadas por el humano): membresía del claim en el use case vía `PET_REPOSITORY.findMembership`; índice parcial sobre `pet_id` + `PET_ALREADY_HAS_DEVICE`; disponibilidad derivada de la fila activa (status = caché); UNIQUE en los 5 identificadores.
- **Mapeo 23505 por nombre de índice**: `findPgError()` desenrolla la cadena `error.cause` (drizzle-orm 0.45 envuelve el error de pg) y discrimina `pet_devices_active_device_id_idx` vs `pet_devices_active_pet_id_idx` → dos errores de dominio distintos. Verificado e2e con claims concurrentes reales.
- **`device-error.mapper.ts` (archivo no listado en el design)**: los dos controllers comparten la tabla error→HTTP; un helper único evita duplicarla. Mismo espíritu que el mapper de status único.
- **`@Res()` en `GET .../device`**: Nest deja el body vacío cuando el handler devuelve `null`; el contrato de R11 exige body JSON `null` literal, así que se responde con `response.json(...)` explícito.
- **Seed testeable**: `seedSimulatedDevices(db)` exportada del script (patrón `provision-local.ts` → `runProvisioning`); el e2e la ejecuta dos veces con un claim de por medio y además se corrió el script real 2 veces (exit 0 ambas).
- **FK `device_id` sin CASCADE reporta `'no action'`**: drizzle normaliza la ausencia de acción a `'no action'` — el test de R1 se ajustó a esa semántica (equivalente a "sin CASCADE").

## Desviaciones

- **R15 no tuvo fase roja**: la conducta emerge del diseño D3 ya implementado en R8 (disponibilidad derivada, nunca `status` literal como candado) — no había forma de verlo rojo sin des-implementar D3. El e2e queda como pin de regresión.
- **El e2e de R2 hace el "claim de por medio" directo en base** (INSERT en `pet_devices` + UPDATE status) porque en el orden TDD de `tasks.md` el endpoint de claim aún no existía al cerrar R2. R13/R15 cubren el mismo flujo vía API real.
- El e2e de R2 resetea las filas SIM-001..003 en su `beforeAll` (ESNs fijos por spec) para que la suite sea re-ejecutable contra la misma base.

## Output de build

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json
(sin errores)
```

## Output de tests

```
init.sh (completo): ✅ Todo verde — build, tests, lint, typecheck
Unit  (pnpm test):              Test Suites: 62 passed | Tests: 319 passed
E2E   (pnpm run test:e2e):      Test Suites: 5 passed  | Tests: 55 passed
  (contra Postgres 17 + LocalStack reales en Docker; migraciones 0000-0004
   aplicadas con drizzle-kit migrate; incluye devices.e2e-spec.ts 21/21)
Seed manual: pnpm run seed:devices → exit 0 (dos corridas consecutivas)
```

## Notas para el reviewer

- **Carrera de claims (R8)**: el e2e `R8: dos claims concurrentes` es real (`Promise.all` contra Postgres); si quieres forzar el camino 23505 puro, comenta el pre-check `hasActiveAssignment` y verás que el índice sigue produciendo el mismo 409.
- **Verifica el orden 404→403→404→409 del claim** en `claim-device.use-case.ts` — es el corazón de R5 (no filtrar existencia del device a no-miembros).
- `pet-profile-response.mapper.ts` importa el **tipo** `DeviceStatusResponse` desde devices/infrastructure (misma capa, cross-módulo con alias `@/`); el grafo de módulos Nest queda acíclico (`DevicesModule → PetsModule → PetDeviceReadModule`).
- `docs/data-model.md` actualizado por D2/D4 en `c5d69c1` — revisar redacción.
- La migración 0004 se aplicó a la base local; `drizzle-kit migrate` sigue siendo manual (no hay script `db:migrate`, seguimiento ya anotado en `progress/history.md` por sesiones previas).
- No se abrió PR ni se tocó `feature_list.json` → `done` (queda para el leader tras el review).
