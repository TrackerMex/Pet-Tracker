---
feature: "pet-lost-mode"
status: approved     # draft | approved
tags: [harness, spec, backend, mobile]
---

# Requisitos — [[pet-lost-mode]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D7) y `docs/architecture.md` (capas
> domain/application/infrastructure del módulo pets + app móvil). Aplican
> `docs/conventions.md` (tests que nombran su R-id, commit
> `feat(<scope>): <desc> (R<n>)`) y `docs/ui-guidelines.md` (C8) para la
> parte móvil. Contratos verificados contra el código real el 2026-08-27:
> `src/db/schema/pets.schema.ts:42` (`lost_mode boolean NOT NULL DEFAULT
> false`), `src/modules/pets/infrastructure/pets.controller.ts`,
> `guards/pet-access.guard.ts`, `mappers/pet-profile-response.mapper.ts`,
> `mobile-pet-tracker/src/app/(tabs)/map.tsx:275-288` (stub R10 de #36).

## Contexto fijo (no reabrir)

- **La columna ya existe**: `pets.lost_mode` (`boolean NOT NULL DEFAULT
  false`, migración 0003) llega hasta `Pet.lostMode` (entity) y
  `PetProfileResponse.lostMode` (mapper) como campo de **solo lectura** —
  hoy ningún endpoint lo escribe: no está en `PetFieldsSchema` ni en
  `PetFieldChanges`, y `UpdatePetSchema` (Zod `z.object` no-strict)
  descarta la clave si llega en un PATCH.
- **El stub móvil**: `specs/mobile-map-live` R10 dejó en
  `src/app/(tabs)/map.tsx` el botón `Activate Lost Mode`
  (`testID="lost-mode-button"`, heroui `Button` variant `danger-soft`)
  **deshabilitado** con subtexto `Coming soon`, y anotó esta feature #45
  para activarlo. El tab Map es fat-route pre-#39 (no hay
  `src/screens/map/`); **no se migra de estructura en esta feature**.
- **Autorización existente**: `PetAccessGuard` +
  `@RequirePetRole('owner')` ya implementan la semántica completa
  (404 para no-miembro/inexistente/`:petId` malformado, 403 para rol
  insuficiente, 404 precede a 403). Esta feature **reutiliza** ese guard,
  no crea autorización nueva.
- **Decisión de producto cerrada** ([[design]] §D1): en esta feature
  `lost_mode` es un **flag expuesto sin efectos automáticos** — no
  dispara alertas, no cambia el polling de posiciones ni la ingesta.
  Ningún doc del repo definía efectos; la opción mínima queda aquí y los
  efectos (p.ej. alerta `pet.lost` en alerts-engine) son feature futura.
- **Contrato congelado**: `PetProfileResponse` no gana ni renombra claves
  (pets-crud-permissions R8); esta feature solo hace escribible el valor
  que el mapper ya emite.
- Roles reales del backend: `'owner' | 'family' | 'walker' | 'vet'`
  (`pet-membership.ts`). El union `myRole` de
  `mobile-pet-tracker/src/api/types.ts:64` está desalineado
  (`'owner' | 'caregiver' | 'viewer'`) y ningún código/test móvil usa los
  valores desalineados — se corrige en R6.

## Requisitos funcionales

### Backend — endpoint de Lost Mode

- **R1**: WHEN un usuario autenticado con membresía activa `role='owner'`
  envía `POST /v1/pets/:petId/lost-mode` con body `{"enabled": <boolean>}`
  THE SYSTEM SHALL persistir `pets.lost_mode = enabled` refrescando
  `updated_at` (vía `PetRepository.update` con `PetFieldChanges` extendido
  con `lostMode?: boolean`), SHALL registrar auditoría
  `{ userId, action: 'pet.lost_mode', entity: 'pet', entityId: petId,
  meta: { enabled } }` AND SHALL responder **200** con el
  `PetProfileResponse` completo (`lostMode` = `enabled`, `myRole` del
  solicitante; `device`/`photoUrl`/`nextVaccine` `null` como en el PATCH
  actual). Repetir el mismo `enabled` es idempotente: persiste, audita y
  responde igual. Nuevo `SetLostModeUseCase` ([[design]] §D4).
  *Tests: `src/modules/pets/application/use-cases/set-lost-mode.use-case.spec.ts`
  (nuevo) → `describe('R1: set lost mode persiste y audita', ...)`;
  `test/pet-lost-mode.e2e-spec.ts` (nuevo) →
  `describe('R1: owner activa y desactiva lost mode', ...)`. ROJO primero.*

- **R2**: IF el solicitante tiene membresía activa con rol `family`,
  `walker` o `vet` THEN THE SYSTEM SHALL responder **403** sin persistir
  ni auditar; IF no es miembro, la mascota no existe o `:petId` no es
  UUID THEN **404**; IF no hay token THEN **401** (AuthGuard global). Todo
  vía `@UseGuards(PetAccessGuard)` + `@RequirePetRole('owner')` — mismo
  camino de código que PATCH/DELETE, sin lógica nueva.
  *Test: `test/pet-lost-mode.e2e-spec.ts` →
  `describe('R2: solo el owner puede togglear lost mode', ...)` (family
  403, walker 403, no-miembro 404, sin token 401; helpers locales
  `seedUser`/`seedMembership` patrón `test/pets.e2e-spec.ts`). ROJO
  primero.*

- **R3**: IF el body no es un objeto con `enabled` booleano (ausente,
  `"true"` string, `null`, número) THEN THE SYSTEM SHALL responder **400**
  con el formato `Validation failed` de `parseBody` sin persistir ni
  auditar; claves extra en el body se descartan (strip por defecto de
  `SetLostModeSchema = z.object({ enabled: z.boolean() })`); AND WHEN un
  owner envía `PATCH /v1/pets/:petId` incluyendo `lostMode` en el body
  THE SYSTEM SHALL seguir ignorando esa clave (UpdatePetSchema la
  descarta) — `lost_mode` solo cambia por el endpoint dedicado.
  *Tests: `src/modules/pets/application/dto/set-lost-mode.dto.spec.ts`
  (nuevo) → `describe('R3: SetLostModeSchema valida enabled', ...)`;
  `test/pet-lost-mode.e2e-spec.ts` →
  `describe('R3: body invalido es 400 y PATCH no toca lostMode', ...)`.
  ROJO primero.*

- **R4**: WHEN tras un toggle se consulta `GET /v1/pets/:petId` o
  `GET /v1/pets` (cualquier rol con membresía activa) THE SYSTEM SHALL
  reflejar el `lostMode` actualizado AND el contrato SHALL conservar
  exactamente las claves actuales de `PetProfileResponse` (mapper
  `toPetProfileResponse` sin claves nuevas ni renombradas).
  *Test: `test/pet-lost-mode.e2e-spec.ts` →
  `describe('R4: el perfil refleja lost mode en detalle y lista', ...)`
  (owner activa → family lo ve `true` en GET detalle y GET lista →
  owner desactiva → vuelve `false`). ROJO primero.*

### Móvil — activación del stub del tab Map

- **R5**: WHEN se invoca `setLostMode(baseUrl, token, petId, enabled,
  fetchFn)` (nueva función de `mobile-pet-tracker/src/api/pets.ts`, misma
  firma-patrón que `createPet`, `POST` a ``/pets/${petId}/lost-mode`` vía
  `postJson`) THE SYSTEM SHALL devolver `SetLostModeState`:
  `{ kind: 'missing-config' }` sin `baseUrl`; `{ kind: 'unreachable',
  message }`; `{ kind: 'unauthorized' }` en 401; `{ kind: 'forbidden' }`
  en 403; `{ kind: 'error' }` en cualquier otro status ≠ 200 o body que no
  pase `isPetProfile`; `{ kind: 'ok', pet }` en 200 con el
  `PetProfileResponse`.
  *Test: `src/api/__tests__/pets.test.ts` → nuevo
  `describe('R5: setLostMode contra el endpoint real', ...)` con `fetch`
  mockeado (patrón de los describes de `createPet`; los tests existentes
  del archivo no se tocan). ROJO primero.*

- **R6**: WHILE el tab Map muestra posición AND la mascota seleccionada
  (entry de `pets.data.pets` con `id === selectedPetId`) tiene
  `myRole === 'owner'` THE SYSTEM SHALL mostrar `lost-mode-button`
  **habilitado** con label `Activate Lost Mode` si `lostMode === false` y
  `Deactivate Lost Mode` si `lostMode === true`, **sin** el subtexto
  `Coming soon` (se elimina); WHEN el owner lo pulsa THE SYSTEM SHALL
  llamar `setLostMode` con la negación del `lostMode` actual, SHALL
  deshabilitar el botón mientras la petición está en vuelo AND, con
  `kind: 'ok'`, SHALL refrescar la lista (`pets.refetch()`) de modo que el
  label refleje el nuevo estado. Incluye corregir el union de `myRole` en
  `src/api/types.ts:64` a `'owner' | 'family' | 'walker' | 'vet'`
  (§Contexto fijo).
  *Test: `src/app/(tabs)/__tests__/map.test.tsx` →
  `describe('R6: owner toglea lost mode contra el endpoint', ...)`
  (label según `lostMode`, press dispara el POST, in-flight disabled,
  refetch actualiza el label). Sustituye al describe
  `'R10: lost mode es stub deshabilitado'` — única modificación permitida
  a tests existentes (R8). ROJO primero.*

- **R7**: WHILE la mascota seleccionada tiene `myRole !== 'owner'` THE
  SYSTEM SHALL mostrar `lost-mode-button` visible y **deshabilitado**
  (`isDisabled` + `accessibilityState={{ disabled: true }}`, sin
  subtexto) y SHALL NOT llamar la API; AND WHEN `setLostMode` devuelve
  `kind !== 'ok'` THE SYSTEM SHALL mostrar `Could not update Lost Mode`
  (`<Text selectable testID="lost-mode-error">`, clase `text-danger`),
  re-habilitar el botón y limpiar el error al siguiente press.
  *Test: mismo archivo → `describe('R7: no-owner deshabilitado y error
  visible', ...)`. ROJO primero.*

### Regresión y contención

- **R8**: WHEN se ejecutan `bun run typecheck`, `bun run lint` y
  `bun run test` en `mobile-pet-tracker/` y `pnpm -C backend-pet-tracker
  run lint`, `test` y `test:e2e` (con `docker compose up -d`) y
  `./init.sh` tras los cambios THE SYSTEM SHALL salir con exit 0 con las
  suites existentes intactas — única modificación permitida a tests
  existentes: el describe `'R10: lost mode es stub deshabilitado'` de
  `map.test.tsx` (R6); AND el diff SHALL tocar SOLO:
  `backend-pet-tracker/src/modules/pets/application/dto/set-lost-mode.dto.ts`
  (+`.spec`),
  `backend-pet-tracker/src/modules/pets/application/use-cases/set-lost-mode.use-case.ts`
  (+`.spec`),
  `backend-pet-tracker/src/modules/pets/domain/repositories/pet.repository.ts`
  (solo `PetFieldChanges`),
  `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts`,
  `backend-pet-tracker/src/modules/pets/pets.module.ts`,
  `backend-pet-tracker/test/pet-lost-mode.e2e-spec.ts` (nuevo),
  `mobile-pet-tracker/src/api/pets.ts`,
  `mobile-pet-tracker/src/api/types.ts` (union `myRole`),
  `mobile-pet-tracker/src/api/__tests__/pets.test.ts`,
  `mobile-pet-tracker/src/app/(tabs)/map.tsx`,
  `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
  más `specs/`, `progress/` y `feature_list.json` (harness); AND el
  grep-clean C8 SHALL seguir limpio (cero hex fuera de `src/theme/`, cero
  clases arbitrarias `[...]`, cero `StyleSheet.create`).
  *Verificación: implementer anota los comandos en
  `progress/impl_pet-lost-mode.md`; reviewer re-ejecuta y corre
  `git diff --stat main...HEAD` contra la allowlist. Sin test propio.*

### Prueba de humo del humano

- **R9**: WHEN el humano ejecuta la prueba de humo **en el dev build de Android** contra
  el backend local (misma WiFi, `.env` con IP LAN, `docker compose up -d`
  + `pnpm -C backend-pet-tracker run start:dev`;
  `bunx expo start --go` desde `mobile-pet-tracker/`):
  1. Login con cuenta owner → tab Map con posición → botón habilitado
     `Activate Lost Mode`.
  2. Pulsar → el label pasa a `Deactivate Lost Mode`;
     `GET /v1/pets/:petId` (curl o tab Profile) muestra `lostMode: true`.
  3. Pulsar de nuevo → vuelve a `Activate Lost Mode` y `lostMode: false`.
  4. Con backend apagado, pulsar → aparece `Could not update Lost Mode`
     y el botón queda usable al reintentar.
  5. (Si hay usuario `family` seedeado) login con él → botón visible y
     deshabilitado.

  **Este requisito SOLO lo cierra el humano.** Registra el resultado en
  `progress/impl_pet-lost-mode.md`.

## Fuera de alcance

- **Efectos automáticos de Lost Mode** ([[design]] §D1): emitir alertas
  (`alerts-engine`/`alerts-center`), cambiar frecuencia de
  polling/ingesta de posiciones, notificaciones push, banner de "perdido"
  en otras pantallas (Home, Profile). Feature futura si se prioriza.
- Migrar el tab Map a `src/screens/map/` (estructura #39): fat-route se
  queda como está; churn sin relación con el toggle.
- Permitir `lostMode` en `PATCH /v1/pets/:petId` o en el alta (POST):
  solo el endpoint dedicado escribe la columna (R3).
- Roles configurables o `permissions` jsonb de `pet_users`: sigue sin
  interpretarse (MVP, pets-crud-permissions).
- Compartir ubicación pública / enlace de mascota perdida.
- react-query / TanStack Query (decisión D2 de #36 sigue: una mutación
  con `useState` no lo justifica).
- Cambios en `infra/`, `init.config.sh`, CI, migraciones de DB (la
  columna ya existe).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-26) ← gate obligatorio antes de implementar
- [ ] R9 smoke en el dev build de Android ejecutado por humano (fecha: ____) ← gate obligatorio antes de `done`
