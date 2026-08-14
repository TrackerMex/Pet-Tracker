---
feature: "pet-reminders"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[pet-reminders]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] y [[../../docs/architecture|architecture]].
>
> Fuente: `feature_list.json` #16, `plans/008-salud-recordatorios.md` paso 3 y
> `docs/data-model.md` (fila `reminders`). **Deviación registrada**: EventBridge
> Scheduler no existe en LocalStack community (`docs/architecture.md` §Adaptación
> local); el mecanismo local es un cron que encola vencidos a la cola SQS
> `notifications` — decidido y cerrado en [[design]] D1–D4, con el camino de
> vuelta a Scheduler en D9.
>
> Depende de `pets-crud-permissions` (#5): `PetAccessGuard`, `@RequirePetRole()`
> y `PetRepository.findMembership()`. Depende de `alerts-center-notifier` (#13):
> el notifier consume la cola `notifications`; esta feature **extiende** su
> contrato de mensaje con `kind: 'reminder'` sin tocar la rama de alertas.
>
> **Colisión de R-ids**: los archivos de `src/workers/notifier/` ya contienen
> R1..R15 de #13. Los tests de esta feature que escriban en archivos del
> notifier nombran su requisito como `R<n> (pet-reminders #16): ...` — mismo
> patrón que #14/#15. Los archivos nuevos del módulo `reminders` usan `R<n>` a
> secas.

## Requisitos funcionales

- **R1**: WHEN se aplican las migraciones Drizzle sobre una base al día, THE
  SYSTEM SHALL crear la tabla `reminders` con: `id` uuid PK (sin default,
  UUIDv7 generado en app), `pet_id` uuid NOT NULL FK a `pets(id)` ON DELETE
  CASCADE, `type` varchar(20) NOT NULL con CHECK `reminders_type_check`
  (`in ('vaccine','deworming','medication','appointment','weight','food','custom')`),
  `title` varchar(120) NOT NULL, `due_at` timestamptz NOT NULL,
  `advance_minutes` integer NOT NULL DEFAULT 60 con CHECK
  `reminders_advance_minutes_check` (`between 0 and 10080`), `channel`
  varchar(10) NOT NULL DEFAULT 'push' con CHECK `reminders_channel_check`
  (`in ('push')`), `status` varchar(10) NOT NULL DEFAULT 'scheduled' con CHECK
  `reminders_status_check` (`in ('scheduled','sent','cancelled')`),
  `schedule_name` varchar(64) NULL, `enqueued_at` timestamptz NULL y
  `created_by` uuid NOT NULL FK a `users(id)`; más los índices
  `reminders_pet_id_idx` sobre `(pet_id)`, `reminders_created_by_idx` sobre
  `(created_by)` y el parcial `reminders_due_at_scheduled_idx` sobre `(due_at)`
  WHERE `status = 'scheduled'`. La migración generada SHALL ser un archivo
  nuevo (`0011_*.sql`) que no altere ninguna tabla existente. El schema vive en
  `backend-pet-tracker/src/db/schema/reminders.schema.ts` (export `reminders`)
  y se re-exporta desde `src/db/schema/index.ts`.

- **R2**: WHEN un owner envía `POST /v1/pets/:petId/reminders` con
  `{type, title, dueAt}` válidos y opcionalmente `advanceMinutes`, THE SYSTEM
  SHALL insertar una fila con `status = 'scheduled'`, `enqueued_at = NULL`,
  `schedule_name` = un token nuevo `reminder-<uuidv7>`, `created_by` = el
  actor y `advance_minutes` = 60 cuando `advanceMinutes` se omite, y responder
  `201` con exactamente las claves
  `{id, petId, type, title, dueAt, advanceMinutes, status}`, donde `dueAt` es
  el instante en ISO 8601 UTC (`Date.prototype.toISOString()`).

- **R3**: IF el body del `POST` incluye un `type` fuera del enum de R1, un
  `title` vacío tras `trim()` o de más de `REMINDER_TITLE_MAX_LENGTH` = 120
  caracteres, un `dueAt` que no sea ISO 8601 con offset o `Z`, un `dueAt` no
  estrictamente posterior al instante de la petición, un `advanceMinutes` no
  entero, `< 0` o `> REMINDER_MAX_ADVANCE_MINUTES` = 10080, o cualquier clave
  desconocida, THEN THE SYSTEM SHALL responder `400` con el cuerpo
  `{statusCode, message: 'Validation failed', errors: [{path, message}]}` sin
  insertar ninguna fila. Ambas constantes SHALL exportarse desde
  `backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.ts`.

- **R4**: IF `:petId` no existe, es sintácticamente inválido o el actor no
  tiene membresía activa, THEN THE SYSTEM SHALL responder `404` genérico en
  `POST /v1/pets/:petId/reminders` mediante el `PetAccessGuard` existente; IF
  el actor es miembro activo con `role != 'owner'` THEN THE SYSTEM SHALL
  responder `403` (`@RequirePetRole('owner')`); el `404` SHALL preceder
  siempre al `403`.

- **R5**: WHILE la app corre con `REMINDERS_ENABLED = 'true'` y
  `NODE_ENV != 'test'`, THE SYSTEM SHALL ejecutar
  `RemindersDispatchService.dispatchOnce()` cada `REMINDERS_INTERVAL_MS` =
  60000 ms; WHEN `dispatchOnce()` encuentra filas con `status = 'scheduled'`,
  `enqueued_at IS NULL` y `due_at - advance_minutes minutos <= now()`, THE
  SYSTEM SHALL, para cada una y en orden `due_at ASC`, publicar el mensaje de
  R6 en la cola SQS `notifications` (`QUEUE_NOTIFICATIONS`) y después marcar
  `enqueued_at = now()`; una fila ya marcada SHALL NOT volver a encolarse en
  ticks posteriores; IF el `SendMessage` de una fila falla THEN THE SYSTEM
  SHALL loguear el error y continuar con las demás, dejando su `enqueued_at`
  en NULL para reintentar en el siguiente tick.

- **R6**: WHEN se encola un recordatorio, THE SYSTEM SHALL enviar exactamente
  el JSON `{version: 1, kind: 'reminder', reminderId, petId, scheduleName,
  title, body, data: {petId, reminderId}}` con `scheduleName` = el
  `schedule_name` vigente de la fila, `title` = `reminders.title` y `body` =
  `` `Recordatorio: ${title}` ``; y el schema
  `notificationMessageSchema` de
  `backend-pet-tracker/src/workers/notifier/notification-message.schema.ts`
  SHALL extenderse a `z.discriminatedUnion('kind', [alertMessageSchema,
  reminderMessageSchema])` aceptando ese mensaje **sin alterar ninguna clave
  de la rama de alertas** (los tests existentes de #13 siguen verdes sin
  editarse).

- **R7**: WHEN el notifier consume un mensaje `kind: 'reminder'` cuyo
  reminder existe con `status = 'scheduled'` y `schedule_name` igual al
  `scheduleName` del mensaje, THE SYSTEM SHALL enviar el push a los tokens de
  los miembros activos de la mascota por el mismo camino que las alertas
  (incluido "0 destinatarios" → log informativo y éxito), después ejecutar
  `UPDATE reminders SET status = 'sent'` condicionado a
  `status = 'scheduled'`, y borrar el mensaje de la cola; IF el reminder no
  existe, su `status != 'scheduled'` o su `schedule_name` difiere del
  mensaje, THEN THE SYSTEM SHALL saltarse el push, loguear
  `{scope, messageId, reminderId, skipped}` con `skipped` ∈
  `'not_found' | 'not_scheduled' | 'stale_schedule'`, y borrar el mensaje
  (éxito, nunca a la DLQ); WHEN el mismo mensaje se entrega dos veces, el
  segundo procesamiento SHALL caer en `'not_scheduled'` — un solo push.

- **R8**: WHEN un owner envía `PATCH /v1/reminders/:id` con al menos una de
  `{dueAt, advanceMinutes, title}` sobre un reminder con
  `status = 'scheduled'`, THE SYSTEM SHALL actualizar esos campos, regenerar
  `schedule_name` con un token `reminder-<uuidv7>` nuevo, resetear
  `enqueued_at = NULL` y responder `200` con el shape de R2; un mensaje ya
  encolado con el `schedule_name` anterior SHALL NOT producir envío (cae en
  `'stale_schedule'` de R7): reprogramar después del encolado produce
  exactamente un envío, el de la programación nueva. El `dueAt` del PATCH
  SHALL cumplir la misma regla de futuro de R3.

- **R9**: WHEN un owner envía `PATCH /v1/reminders/:id` con body exactamente
  `{status: 'cancelled'}` sobre un reminder con `status = 'scheduled'`, THE
  SYSTEM SHALL poner `status = 'cancelled'` y responder `200` con el shape de
  R2; IF el reminder ya estaba encolado y aún no procesado THEN el mensaje en
  vuelo SHALL NOT producir push (cae en `'not_scheduled'` de R7) — un
  recordatorio cancelado no se envía nunca.

- **R10**: IF en `PATCH /v1/reminders/:id` el `:id` no es un UUID
  sintácticamente válido, no existe ningún reminder con ese id, o el actor no
  tiene membresía activa sobre `reminder.pet_id`, THEN THE SYSTEM SHALL
  responder el mismo `404` genérico en los tres casos, resuelto en
  `UpdateReminderUseCase` cargando el reminder y consultando
  `PetRepository.findMembership(reminder.petId, userId)` (la ruta no lleva
  `:petId`, así que `PetAccessGuard` no aplica); IF la membresía es activa
  pero con `role != 'owner'` THEN THE SYSTEM SHALL responder `403`; el `404`
  SHALL preceder siempre al `403`.

- **R11**: IF el `PATCH` llega sobre un reminder con `status` `'sent'` o
  `'cancelled'`, THEN THE SYSTEM SHALL responder `409` con `message`
  `'Reminder is not editable'` sin modificar la fila; IF el body no es ni
  `{status: 'cancelled'}` exacto ni un objeto con al menos una de
  `{dueAt, advanceMinutes, title}` (incluye: body vacío, `status` combinado
  con otros campos, `status` con otro valor, clave desconocida, o valores que
  violen las reglas de R3) THEN THE SYSTEM SHALL responder `400` con el shape
  de R3, sin tocar la base.

- **R12**: WHILE `REMINDERS_ENABLED != 'true'` o `NODE_ENV = 'test'`, THE
  SYSTEM SHALL NOT registrar el intervalo del dispatcher
  (`RemindersSchedulerService.shouldSchedule()` devuelve `false` — mismo
  patrón exacto que `NotifierSchedulerService` de #13). La variable
  `REMINDERS_ENABLED` SHALL añadirse a `.env.example` (con `true`, mismo
  criterio D11 de #8) y a la tabla de `docs/conventions.md` en el mismo
  commit que la introduce.

## Fuera de alcance

- **`GET /v1/pets/:petId/reminders` y `DELETE`.** `feature_list.json` #16 solo
  pide `POST` y `PATCH`; la lista para el hub móvil (plan 008 paso 4) queda
  para la feature de pantallas.
- **EventBridge Scheduler e infra CDK** (grupo `pet-tracker-dev`, rol IAM,
  permisos de la Lambda API — plan 008 paso 3 §Infra): aplica solo al deploy
  real; camino de vuelta documentado en [[design]] D9.
- **Recordatorios recurrentes** (`recurrence`, medicación cada 8 h — plan 008
  §Notas): el shape lo admite después sin romper.
- **Canales distintos de `'push'`**: el CHECK de `channel` queda reducido a lo
  que esta feature produce (mismo criterio que `geofences.type`).
- **Auditoría (`audit_log`)**: el plan 008 la pide para vacunas (paso 2), no
  para reminders (paso 3). Añadirla después es aditivo.
- **`nextReminder` en el perfil de mascota**: `PetProfileResponse` es un
  contrato congelado (ver #15 §Fuera de alcance); ampliarlo es otra feature.
- **Pantallas móviles** (`reminders.tsx`, plan 008 paso 4).
- Push real por Expo: en local `PUSH_ENABLED=false` (log estructurado), como
  en #13.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-11) ← gate obligatorio antes de implementar
