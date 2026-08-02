# review: devices-claim
Fecha: 2026-08-01
Veredicto: APROBADO

Branch revisado: `feature/7-devices-claim` (13 commits sobre `main`, base
`7d65583`). `main` local == `origin/main` == merge-base: main no fue tocado.
Verificación independiente: el reviewer ejecutó `./init.sh` y
`pnpm run test:e2e` él mismo (outputs abajo) — no se aceptó el reporte del
implementer como evidencia.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (id 7, línea única con ese status; 5 `done`)
- [x] `progress/current.md` describe la sesión activa (edición sin commitear del leader: spec_author/implementer terminados, reviewer en curso — coherente con el flujo)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — `modules/devices/domain/` (entity, errors, repository) no importa nada externo; `device.errors.ts` sin `@nestjs/common`
- [x] repositories/contratos en domain son interfaces puras — `DeviceRepository` (5 métodos) y el puerto `PetDeviceReader` de pets solo definen tipos/contratos
- [x] application depende de interfaces, no implementaciones — `ClaimDeviceUseCase`/`ReleaseDeviceUseCase`/`GetPetDeviceUseCase` inyectan por tokens `DEVICE_REPOSITORY`, `PET_REPOSITORY`, `AUDIT_LOGGER`, `PET_DEVICE_READER`
- [x] infrastructure sin lógica de negocio — `DeviceDrizzleRepository` solo persiste (transacciones claim/release) y traduce 23505 por nombre de índice a errores de dominio; controllers delegan en use cases
- Grafo de módulos acíclico verificado: `DevicesModule → PetsModule → PetDeviceReadModule` (el sub-módulo solo depende de DRIZZLE @Global). Import de tipo cross-módulo en `pet-profile-response.mapper.ts` es infra→infra (misma capa) con alias `@/` — conforme a `docs/conventions.md`.

## Checklist C4 — TDD
- [x] Cada R1-R15 tiene al menos un test que lo nombra — verificado en los archivos reales:
  - Unit: `devices.schema.spec.ts` (3 describes `R1:`, 14 tests), `claim-device.dto.spec.ts` (`R4:`), `claim-device.use-case.spec.ts` (`R3/R5/R6/R7/R8/R9/R10:` con asserts de orden — R5/R6 verifican `findByIdentifier` NO llamado; R10 verifica no-audit en fallo y meta exacta `{petId}`), `get-pet-device.use-case.spec.ts` (`R11:`), `release-device.use-case.spec.ts` (`R13:/R14:`), `device-status.mapper.spec.ts` (`R11:`), y en pets: `get-pet.use-case.spec.ts::R12 (devices-claim)` + `pets.controller.spec.ts::R12 (devices-claim)`
  - E2E (`test/devices.e2e-spec.ts`, 21 tests): describes `R2:` a `R15:` completos
- [x] Historial test-primero, no todo junto — 13 commits granulares por requisito (schema+spec → seed → DTO+spec → use case+spec → endpoint+e2e → R11 → R12 → R13/R14 → R15); verificado con `git show --stat` que cada commit feat lleva su spec junto a la implementación
- Desviación documentada y aceptable: R15 no tuvo fase roja (la conducta emerge de D3 ya implementada en R8); el e2e queda como pin de regresión — declarado en `progress/impl_devices-claim.md` §Desviaciones.

## Checklist C5 — Trazabilidad
- [x] `specs/devices-claim/traceability.md` — 15/15 filas completas, cero "pendiente"
- [x] Tests citados existen (verificados por nombre en los archivos) y los 13 commits citados existen en el branch (`git log`)
- [x] Commits en formato `feat(devices-claim): <desc> (R-ids)`; los auxiliares usan `chore/test/docs/style` con el mismo scope

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` en frontmatter — igual en los 4 archivos de la spec (requirements, design, tasks, traceability)
- [x] Casilla "Aprobado por humano" marcada con fecha 2026-08-01 y nota "D1-D4 aceptadas como propone la spec"
- [x] Sin modificaciones a requisitos post-aprobación (la spec entra completa en el commit `9133343`, primer commit del branch, y no vuelve a tocarse salvo `traceability.md` en `c5d69c1`, que es la tabla que el implementer debe rellenar)

## Checklist C7 — Sin código huérfano
- [x] El placeholder `device: null` del contrato de perfil (#5) fue sustituido en el mismo sitio (`pet-profile-response.mapper.ts` ensancha el tipo a `DeviceStatusResponse | null`; `pets.controller.ts` pasa el device real) — sin duplicados ni restos
- [x] No quedan tests del placeholder: `pets.controller.spec.ts` y `get-pet.use-case.spec.ts` se actualizaron en el mismo commit (`609b5f1`); e2e R12 congela las mismas 24 claves del contrato de #5
- No hay módulos reemplazados/deprecados más allá del placeholder — resto N/A

## Decisiones D1-D4 (verificadas contra el código)
- **D1** ✓ — `POST /v1/devices/claim` sin guard (`devices.controller.ts`); la membresía corre en `ClaimDeviceUseCase` vía `PET_REPOSITORY.findMembership()` con orden estricto 404 (sin membresía/inactiva) → 403 (rol ≠ owner) → recién entonces se consulta `devices`. E2E R5 compara el body contra el baseline 404 del guard real (indistinguible) y verifica que no se escribió nada. `pet-access.guard.ts` sin diff contra main (aprobado de #5 intacto).
- **D2** ✓ — Migración `0004`: `CREATE UNIQUE INDEX pet_devices_active_pet_id_idx ON pet_devices (pet_id) WHERE released_at is null`; repo traduce 23505 de ese índice a `PetAlreadyHasDeviceError` → 409 `PET_ALREADY_HAS_DEVICE` (e2e R9). También el índice gemelo sobre `device_id` para R8, con e2e de carrera real (`Promise.all` → [201, 409], una sola fila activa).
- **D3** ✓ — Disponibilidad = fila activa en `pet_devices` (`hasActiveAssignment`), `status='inactive'` veta el claim por sí mismo (unit + e2e R8); e2e R15 self-healing completo: claim → `DELETE /v1/pets/:petId` (CASCADE borra la fila, status queda huérfano en 'assigned') → re-claim con otra mascota responde 201.
- **D4** ✓ — Migración `0004`: constraints UNIQUE en `esn`, `imei`, `serial_number`, `activation_code`, `wialon_unit_id` (los 5). `findByIdentifier` busca por columna UNIQUE — sin ambigüedad.

## Otras verificaciones del encargo
- **`docs/data-model.md`** actualizado en el branch (`c5d69c1`): filas `devices` (5 UNIQUEs, D4, status como caché D3) y `pet_devices` (ambos índices parciales, D2, FK sin cascade en device_id) — redacción fiel al código.
- **Migración 0004 no toca otras tablas** — verificado leyendo el SQL (solo `devices`/`pet_devices`) y con el test dedicado `R1: el SQL de la migración nueva no toca ninguna otra tabla`.
- **Auditoría vía puerto** — `device.claim` y `device.release` usan `AUDIT_LOGGER` de `src/audit/` (@Global, de #3), cero infraestructura nueva de audit; e2e R10/R13 verifican las filas reales en `audit_log` (meta `{petId}`, nunca el identificador enviado) y la no-auditoría en fallo.
- **Variables de entorno**: ninguna nueva. `scripts/seed-devices.ts` lee `DATABASE_URL` con dotenv — misma excepción documentada de `provision-local.ts` (docs/conventions.md). `package.json` solo añade el script `seed:devices` (R2).
- **Convenciones de imports**: alias `@/` en todo cruce de módulo/capa; relativos solo intra-capa (`../dto/`, `./mappers/`) — conforme.
- **Sin regresiones**: suite unit completa 62/62 suites (incluye auth #3/#4 y pets #5) y e2e 5/5 suites (auth, users, pets, devices) — corridas por el reviewer.

## Observaciones
Bloqueantes: ninguno.

No bloqueantes:
- NB1: el output e2e imprime un dump de error pg 23503 (`pet_users_user_id_users_id_fk`) — proviene de un test intencional preexistente de #5 (`pets.e2e-spec.ts:207`), no de esta feature. Ruido cosmético en consola; los 55 tests pasan.
- NB2: `traceability.md` cita el test de R1 como un solo nombre (`R1: la migracion crea devices/pet_devices...`) pero en el archivo son 3 describes `R1:` separados — cosmético, la trazabilidad por R-id se cumple.
- NB3: `drizzle-kit migrate` sigue siendo paso manual (sin script `db:migrate`) — ya rastreado en `progress/history.md` por sesiones previas, no es de esta feature.
- NB4: pendientes del leader tras este review: PR con `gh pr create`, marcar `done` tras merge humano, cerrar `progress/current.md` → `history.md`.

## Output de ./init.sh (corrida propia del reviewer, exit 0)
```
✅ node / pnpm disponibles; .env con DATABASE_URL; dependencias al día
⚠️  Feature en progreso: devices-claim (esperado)
✅ STATUS.md sincronizado con feature_list.json
✅ Build exitoso (nest build && tsc-alias)
Test Suites: 62 passed, 62 total
Tests:       319 passed, 319 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

## Output de pnpm run test:e2e (corrida propia, Postgres 17 + LocalStack en Docker, exit 0)
```
Test Suites: 5 passed, 5 total
Tests:       55 passed, 55 total
Time:        11.02 s
(devices.e2e-spec.ts: 21/21 — incluye IDOR R5, carrera concurrente R8,
 auditoría R10/R13 contra audit_log real y self-healing R15)
```
