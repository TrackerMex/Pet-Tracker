---
feature: "reminders-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Requisitos — [[reminders-api]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D5) y `docs/architecture.md` (capas
> domain/application/infrastructure — esta feature es 100% backend).
> Aplican `docs/conventions.md`: kebab-case con sufijos, alias `@/...`,
> DTOs zod, errores de dominio tipados + mapper, tests que nombran su R-id.
> Contratos verificados contra el código real el 2026-08-24
> (`reminders.controller.ts`, `reminder.repository.ts`,
> `reminder.drizzle.repository.ts`, `reminders-dispatch.service.ts`,
> `vaccines.controller.ts` como patrón DELETE).

## Contexto fijo (no reabrir)

- Origen: gate humano de #39 (2026-08-24) — el listado y el borrado REAL
  van en feature backend aparte. **#39 (mobile-reminders) tiene dependencia
  dura de esta feature**: su handoff no arranca hasta que #47 esté `done`.
- El módulo `backend-pet-tracker/src/modules/reminders/` HOY expone solo
  `POST /pets/:petId/reminders` (owner, 201) y `PATCH /reminders/:id`
  (editar/cancelar). Ambos quedan **intactos** (R3).
- `PetRemindersController` ya está bajo `@UseGuards(PetAccessGuard)`
  (no-miembro → 404); `@RequirePetRole('owner')` disponible. La constante
  `UUID_PATTERN` ya vive en `reminders.controller.ts`.
- `ReminderRepository` (domain) hoy: `create`, `findById`, `reschedule`,
  `cancel`, `findDue`, `markEnqueued`, `markSent`. El dispatcher es un
  interval in-process (`RemindersSchedulerService` +
  `RemindersDispatchService.dispatchOnce()` → `findDue` → SQS): **no hay
  recurso externo por reminder que limpiar al borrar** ([[design]] §D2).
- `ReminderResponse` y `toReminderResponse` existen en
  `reminder.mapper.ts`; `mapReminderError` mapea `ReminderNotFoundError`
  → 404 y `NotReminderOwnerError` → 403.
- Sin cambios de schema Drizzle ni migraciones: la tabla `reminders` ya
  soporta ambas operaciones.

## Requisitos funcionales

### Listado

- **R1**: WHEN un usuario con membresía activa sobre la mascota (cualquier
  rol: owner, caregiver o viewer) hace `GET /v1/pets/:petId/reminders` THE
  SYSTEM SHALL responder 200 con `ReminderResponse[]` (vía
  `toReminderResponse`) de TODOS los reminders de la mascota — cualquier
  status (`scheduled`, `sent`, `cancelled`) — ordenados por `dueAt`
  ascendente, `[]` si no hay ninguno; IF el solicitante no es miembro
  activo THEN el `PetAccessGuard` existente SHALL responder 404 (el
  endpoint NO lleva `@RequirePetRole`, como los GET de nutrition). Capas y
  firmas exactas en [[design]] §D3:
  - domain: `listByPet(petId: string): Promise<Reminder[]>` en
    `ReminderRepository`;
  - infrastructure: implementación en `ReminderDrizzleRepository`
    (`where(eq(reminders.petId, petId))` +
    `orderBy(asc(reminders.dueAt))`, mismo estilo que `findDue`);
  - application: `ListRemindersUseCase.execute(petId): Promise<Reminder[]>`
    en `list-reminders.use-case.ts`, registrado en `reminders.module.ts`;
  - infrastructure: método `@Get()` `list()` en `PetRemindersController`.
  *Tests:
  `src/modules/reminders/application/use-cases/list-reminders.use-case.spec.ts`
  (nuevo) → `describe('R1: ListRemindersUseCase delega en listByPet', ...)`;
  `test/pet-reminders.e2e-spec.ts` (extender) → casos `R1:` — 200 con
  varios status en orden `dueAt` asc, 200 `[]` sin reminders, 200 para
  caregiver, 404 para no-miembro. ROJO primero.*

### Borrado real

- **R2**: WHEN el owner de la mascota hace
  `DELETE /v1/pets/:petId/reminders/:id` con un `id` UUID de un reminder
  de ESA mascota THE SYSTEM SHALL borrar la fila (cualquier status es
  borrable — borrado real, no cancelación) y responder **204 sin body**;
  - IF `id` no casa `UUID_PATTERN` THEN SHALL responder 404 sin tocar la
    base (mismo pre-check que el PATCH existente);
  - IF el reminder no existe o pertenece a otra mascota THEN SHALL
    responder 404 (`ReminderNotFoundError` → `mapReminderError`);
  - IF el solicitante es caregiver o viewer THEN SHALL responder 403
    (`@RequirePetRole('owner')`);
  - IF el solicitante no es miembro THEN SHALL responder 404 (guard).
  Capas y firmas exactas en [[design]] §D3:
  - domain: `deleteByPetAndId(petId: string, id: string): Promise<boolean>`
    en `ReminderRepository` (true si borró una fila);
  - infrastructure: implementación Drizzle con
    `delete(reminders).where(and(eq(reminders.id, id), eq(reminders.petId, petId)))`
    + `.returning({ id: reminders.id })`;
  - application: `DeleteReminderUseCase.execute(petId, reminderId):
    Promise<void>` en `delete-reminder.use-case.ts` — lanza
    `ReminderNotFoundError` si el repo devuelve false; registrado en
    `reminders.module.ts`;
  - infrastructure: método `@Delete(':id')` +
    `@HttpCode(HttpStatus.NO_CONTENT)` + `@RequirePetRole('owner')` en
    `PetRemindersController` (patrón exacto de
    `vaccines.controller.ts` l.106–122).
  *Tests:
  `src/modules/reminders/application/use-cases/delete-reminder.use-case.spec.ts`
  (nuevo) → `describe('R2: DeleteReminderUseCase borra o lanza
  not-found', ...)`; `test/pet-reminders.e2e-spec.ts` (extender) → casos
  `R2:` — 204 y la fila desaparece (GET posterior sin el id / select
  directo vacío), 204 sobre un reminder `cancelled` (cualquier status),
  404 id no-UUID, 404 reminder de otra mascota, 403 caregiver, 404
  no-miembro. ROJO primero.*

### Regresión y contención

- **R3**: WHEN se ejecutan `pnpm -C backend-pet-tracker run lint`, `test` y
  `test:e2e` tras los cambios THE SYSTEM SHALL salir con exit 0, con las
  suites existentes del módulo (create/update/dispatch/scheduler y los
  casos e2e previos de POST/PATCH) intactas y verdes — **cero
  modificaciones a tests existentes**, solo adiciones; AND `./init.sh`
  SHALL terminar con exit 0; AND el diff SHALL tocar SOLO
  `backend-pet-tracker/src/modules/reminders/` y
  `backend-pet-tracker/test/pet-reminders.e2e-spec.ts`.
  *Verificación: implementer lo anota en
  `progress/impl_reminders-api.md`; reviewer re-ejecuta y corre
  `git diff --stat main...HEAD | grep -v "modules/reminders\|pet-reminders.e2e\|specs/\|progress/\|feature_list"`
  (vacío).*

## Fuera de alcance

- Cambios en la app móvil (los consume #39, spec propia en
  `specs/mobile-reminders/`).
- Tocar `POST`, `PATCH`, dispatcher, scheduler, workers o el schema
  Drizzle.
- Endpoint de reactivación de cancelados, paginación del listado, filtros
  por status (YAGNI; el volumen por mascota es pequeño y la UI filtra en
  cliente).
- Borrado en cascada al borrar mascota (ya existe o es asunto del módulo
  pets, no de esta feature).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-24) ← gate obligatorio antes de implementar
