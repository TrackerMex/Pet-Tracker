# review: users-account-deletion-api (#247)
Fecha: 2026-11-06 22:23 UTC
Veredicto: RECHAZADO

Rama `feature/247-users-account-deletion-api`, worktree `Pet-Tracker-wt-247`.
H0 = `0e70fff2`, HEAD = `83cb3102`, `git rev-list --count 0e70fff2..HEAD` = 16.

Bloquea un solo hallazgo, H1: la enmienda del leader a `devices.e2e` R15 quita el único
candado de la regla D3 de `devices-claim`. Todo lo demás pasa: el código, la migración,
la trazabilidad, el historial TDD y las 14 mutaciones de `tasks.md`.

## Checklist C2: estado coherente
- [x] Ninguna feature está `in_progress` en `feature_list.json`: ni en el worktree, ni en
      `origin/main`, ni en `origin/dev`. #247 está `spec_ready`. El init.sh del leader dice
      «Sin features en progreso (sesión limpia)» (línea 42 del log).
- [x] `progress/current.md`: lo escribe el leader al cerrar, y el diff no lo toca (un solo
      escritor). Nota: hoy no menciona el plan `plan_produccion-aws-2026-11-06` ni #247. Lo
      actualiza el leader al cerrar; no bloquea.

## Checklist C3: arquitectura
- [x] `domain` no importa de `infrastructure`. Los puertos nuevos son un `Symbol` más una
      interfaz:
      - `users/domain/repositories/account-deletion.repository.ts`;
      - `pets/domain/ports/pet-data-purger.ts`.
      Las entidades solo cambian `createdBy: string | null`.
- [x] Los contratos en `domain` son interfaces puras.
- [x] `application` depende de puertos y no de implementaciones. `DeleteAccountUseCase`
      inyecta `USER_REPOSITORY`, `PASSWORD_HASHER`, `ACCOUNT_DELETION_REPOSITORY` y
      `PET_DATA_PURGER`. `DeletePetUseCase` inyecta `PET_DATA_PURGER`.
- [x] `infrastructure` no tiene lógica de negocio.
      - El orden transaccional (lock, audit, liberar, borrar) vive en
        `account-deletion.drizzle.repository.ts:17-39`, como fija el design.
      - La importación de `deletePetsTx` y `releaseDeviceTx` entre módulos de
        infraestructura es la que autoriza D4.
      - El mapeo a HTTP vive en `users.controller.ts:62-75`.

## Checklist C4: TDD
- [x] Cada R1–R15 tiene al menos un test que nombra `#247 R<n>:`. Recuento por `grep`:
      R1 5, R2 8, R3 7, R4 3, R5 2, R6 6, R7 4, R8 3, R9 2, R10 4, R11 4, R12 2, R13 7,
      R14 2, R15 8.
- [x] El historial va test primero, en pares rojo→verde: `ffd2645d`→`6a900be5`,
      `527c57f1`→`e62b7bb9`, `d5c3cc9c`→`5ae914bc`, `3f031262`→`b84011b5`,
      `012fdb87`→`7ab40b41` y `75a66352`→`83ecc9e7`. La enmienda es `f33a4e2c`.
      - Los commits rojos llevan solo tests y stubs: firmas y cuerpos `void x; return
        Promise.reject(new Error('Not implemented'))` / `Promise.resolve()`, y en el guard
        un `async` sin cambio de lógica.
      - El impl report da 0 errores de carga, TS o DI en los rojos.
      - Los tests que nacen verdes coinciden con los que declara el plan.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente». Sus hashes (`6a900be5`,
      `e62b7bb9`, `5ae914bc`, `b84011b5`, `7ab40b41`, `83ecc9e7`) son ancestros de HEAD; no
      hubo rebase.
- [x] Los commits siguen el formato `test|feat|docs(<scope>): <desc> (R-ids)`.

## Checklist C6: spec aprobada
- [x] `requirements.md` está en `status: approved` y tiene marcada la casilla de firma
      delegada (mandato 2026-10-23, ampliado el 2026-11-06).

## Checklist C7: sin código huérfano
- [ ] N/A: la feature no reemplaza ningún módulo. `DeviceDrizzleRepository.release` delega
      en `releaseDeviceTx`; no queda ninguna copia.

## Migración 0024
- `0024_created_by_set_null.sql` trae 5 `DROP CONSTRAINT`, 5 `DROP NOT NULL` y 5
  `ADD CONSTRAINT … ON DELETE set null`. No trae ningún DROP ni CREATE TABLE.
- El journal pasa de 24 a 25 entradas: idx 24 = `0024_created_by_set_null`.
- El `prevId` del snapshot 0024 es el id del 0023. Solo cambian las 5 tablas.
- `origin/dev` termina en 0023, así que no hay choque de número.

## Recursos AWS reales
Ninguno. El diff no toca `infra/`, CDK ni `mobile-pet-tracker/` (0 ficheros).
`PetDataPurgerAwsAdapter` usa los clientes `S3_CLIENT`/`DYNAMODB_CLIENT` inyectados por
`AwsModule`, que en e2e apuntan a LocalStack. Los nombres salen de `AWS_RESOURCE_NAMES`.

## Mutaciones (cada una revertida con `git checkout HEAD -- <ruta>`)

Unit con `pnpm exec jest <ruta>`; e2e con `pnpm exec jest --config ./test/jest-e2e.json …`,
sobre `pet_tracker_wt` (5433) y LocalStack. Base verde antes de mutar: unit acotado
486/486 y e2e users+pets+devices+vaccine-catalog-migration 81/81.

| # | Mutación | Resultado | Rojos |
|---|---|---|---|
| 1 | Quitar `if (!user) throw` del guard (`auth.guard.ts:54`) | MATA | guard `#247 R2: responde 401 y no adjunta request.user…`; users e2e `#247 R2` (1) y `#247 R4` (2) |
| 2 | `deleteMe`: `UserNotFoundError` vía `mapProfileError` | MATA | controller `#247 R7: responde UnauthorizedException, nunca NotFoundException` |
| 3a | Quitar `onDelete: 'set null'` en `nutrition.schema.ts` (meal_servings) | MATA | `#247 R1` (los 2 its: columnas y FKs) y `R1 (#83) aplica las FKs…` |
| 3b | Lo mismo en `media.schema.ts` (pet_documents) | MATA | `#247 R1` (los 2 its) |
| 4 | Meter `findById` dentro del `try` de `verify` | MATA | guard `#247 R2: un error de la consulta se propaga y no se convierte en 401` |
| 5 | `InvalidCredentialsError` mapeado a `UnauthorizedException` | MATA | controller `#247 R6`; users e2e `#247 R6` |
| 6 | Quitar `eq(petUsers.role, 'owner')` | MATA (solo e2e) | users e2e `#247 R9: la mascota ajena sobrevive…`. El unit del repo sigue verde (46/46), como prevé la tabla |
| 7 | `deletePetsTx`: borrar `pets` antes de liberar collares | MATA | pets e2e `#247 R10`; users e2e `#247 R10`; devices e2e R15 |
| 8 | Insertar el audit después de `DELETE users` | MATA | repo `#247 R11` (2 its) |
| 9 | Quitar `.for('update')` | MATA | repo `#247 R11` (3 its; aserción `"select:users:for update"`) |
| 10 | `DeletePetUseCase`: purgar antes de `delete` | MATA | E7 `no audita ni purga si el borrado falla` y `borra por id y registra…` |
| 11 | Quitar el `try/catch` por almacén (dos variantes: fundido en uno y sin ninguno) | MATA | `#247 R15` (f), (g) y orden/nunca rechaza; users e2e `#247 R14` |
| 12 | `BATCH_WRITE_MAX_ITEMS = 26` | MATA | `#247 R15 … borra en lotes de 25` |
| 13 | `BATCH_WRITE_ATTEMPTS = 2` | MATA | `#247 R15: reenvía UnprocessedItems hasta 3 intentos por lote` |
| 14 | `Quiet: false` | MATA | `#247 R15: lista pets/<petId>/ y borra la página con DeleteObjects Quiet` |
| X | Extra (enmienda): el claim veta también `device.status === 'assigned'` (`claim-device.use-case.ts:70-72`) | **SOBREVIVE** | Ninguno. Unit devices 40/40; e2e devices+pets+users 72/72; e2e alerts-engine, device-subscriptions, ingestion, provision-device y resource-isolation 50/50 |

Todos los rojos son de aserción: ningún log tiene `error TS` ni «Test suite failed to run».
Al terminar, `git status --short` está vacío y `git diff --cached --quiet` sale 0.

## Observaciones

### H1 (bloqueante): la enmienda de `devices.e2e` R15 deja sin candado la regla D3 de `devices-claim`

- La regla: `specs/devices-claim/requirements.md:191-200` (R15) dice que el claim responde
  `201` «aunque `devices.status` haya quedado en `'assigned'`». La disponibilidad «se deriva
  de la fila activa en `pet_devices`»; `devices.status` es caché (D3).
- Ese caso (caché `'assigned'` sin fila activa) solo lo ejercía
  `backend-pet-tracker/test/devices.e2e-spec.ts`, en
  `describe('R15: borrar una mascota con collar deja el device reclamable (D3)')` (línea 964).
  En H0 el `it` fijaba `expect(orphaned.status).toBe('assigned')` y luego reclamaba con
  `201`.
- Tras #247 R10 y la enmienda (`f33a4e2c`), el DELETE deja el caché en `'available'`
  (línea 988). El reclamo de las líneas 998-1001 ya no distingue un claim que mire la fila activa
  de uno que mire `devices.status`. El comentario de las líneas 996-997 («La disponibilidad
  se deriva de la fila activa, no del cache de status… (D3)») ya no es lo que prueba el `it`.
- Evidencia: la mutación X sobrevive en todos los tests que reclaman collares, y el
  unit `claim-device.use-case.spec.ts` no cubre el caso.
  - Que el claim vete `status === 'assigned'` debería romper D3.
  - En el unit, `buildDevice()` usa `'available'` por defecto, y
    `describe('R8: …')` (línea 190) solo prueba fila activa o `'inactive'`.
- No es un caso teórico. Los collares que quedaron huérfanos en `'assigned'` antes de #247
  (justo el defecto que corrige R10) siguen en las bases existentes. La migración 0024 no los
  repara, y su reclamo depende de esta regla.
- La enmienda de `tasks.md` (§«Enmienda del leader», líneas 482-526) es coherente con R10,
  pero afirma «se actualiza el candado». En realidad cambia lo que el candado mide y no lo
  repone.
- Qué falta: un test que reclame con `201` un device con `devices.status = 'assigned'` sin
  fila activa en `pet_devices`. Puede ser:
  - en `devices.e2e` R15, sembrando ese estado en base tras el DELETE;
  - o en unit, en `claim-device.use-case.spec.ts`, con `findByIdentifier` →
    `buildDevice({ status: 'assigned' })` y `hasActiveAssignment` → `false`.
  En cualquiera de los dos, la mutación X tiene que ponerlo rojo. Como toca los candados de
  la spec, pasa por la enmienda del leader.

### H2 (no bloqueante): la tabla de mutaciones promete un rojo e2e que no puede dar

`tasks.md:536` espera «e2e `#247 R9` si es `meal_servings`» al quitar `onDelete` del
esquema TS. La base e2e sale de las migraciones SQL (init.sh), no de `nutrition.schema.ts`,
así que quitarlo del TS no llega al e2e. El candado real son los dos its de esquema
`#247 R1`, que sí ponen rojo esa mutación (3a). Conviene precisarlo en la tabla.

### H3 (nit, no bloqueante)

`pet-data-purger.aws.adapter.ts:114` escribe a mano el `3` en
`'UnprocessedItems after 3 attempts'`, en vez de usar `BATCH_WRITE_ATTEMPTS`.

## Output de ./init.sh
No lo corrí: el leader lo prohíbe en el encargo porque choca con otros worktrees. Va
el log del leader sobre HEAD `83cb3102`, en
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/514dba8a-c290-4329-b2f8-7d88945d9888/scratchpad/init-247.log`:
```
✅ Sin features en progreso (sesión limpia)                      (línea 42)
Test Suites: 202 passed, 202 total                               (backend unit)
Tests:       1680 passed, 1680 total
Test Suites: 2 passed, 2 total                                   (infra)
Tests:       14 passed, 14 total
Test Suites: 184 passed, 184 total                               (móvil)
Tests:       6827 passed, 6827 total
Test Suites: 3 skipped, 34 passed, 34 of 37 total                (e2e backend)
Tests:       8 skipped, 621 passed, 629 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
Mis corridas acotadas, sin mutación: unit `src/db/schema src/modules/{auth,devices,pets,users}`
486/486; e2e users+pets+devices+vaccine-catalog-migration 81/81.
