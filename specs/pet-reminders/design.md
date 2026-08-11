---
feature: "pet-reminders"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[pet-reminders]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Decisiones técnicas

- **D1 — Mecanismo local de programación: cron dispatcher → SQS `notifications`
  (R5)**. EventBridge Scheduler no existe en LocalStack community
  (`docs/architecture.md` §Adaptación local ya registra la deviación y delega
  la decisión a esta spec). Mecanismo elegido: un intervalo de 60 s
  (`@nestjs/schedule` vía `SchedulerRegistry`, patrón idéntico a
  `NotifierSchedulerService` #13) que encola a la cola `notifications` los
  reminders cuyo instante de despacho (`due_at - advance_minutes`) ya llegó.
  El notifier existente (#13) consume el mensaje y hace el push. La condición
  STOP del plan 008 ("cron que escanea la BD contradice la arquitectura")
  aplica al deploy real, no a local: la deviación quedó registrada en
  `docs/architecture.md` el 2026-07-29 precisamente para este caso.

- **D2 — Idempotencia del encolado: columna `enqueued_at` (R1, R5)**. El cron
  corre cada minuto; sin marca, un reminder vencido se encolaría en cada tick.
  `enqueued_at timestamptz NULL` es el candado: el query de despacho filtra
  `enqueued_at IS NULL` y `dispatchOnce()` la marca tras el `SendMessage`.
  Orden **send-then-mark**: un crash entre ambos produce un duplicado en la
  cola (que R7 dedupea), nunca un recordatorio perdido — misma filosofía que
  #13 R14. **Deviación de `docs/data-model.md`** (la fila `reminders` no lista
  esta columna): es aditiva, exclusiva del mecanismo local, y queda sin uso al
  volver a Scheduler (D9). La feature actualiza la fila de `data-model.md` en
  el mismo PR.

- **D3 — Invalidación de programaciones en vuelo: `schedule_name` como token
  vigente (R2, R6, R7, R8)**. Reprogramar debe anular el mensaje que ya esté
  en la cola sin poder borrarlo de SQS. Cada programación (create y cada PATCH
  de edición) genera un token nuevo `reminder-<uuidv7>` en `schedule_name`; el
  mensaje lo lleva como `scheduleName` y el notifier solo envía si coincide
  con el valor actual de la fila. Se reutiliza la columna que `data-model.md`
  ya define para el nombre del schedule de EventBridge — en AWS real el token
  ES el nombre del schedule (formato compatible: `[0-9a-zA-Z\-_.]{1,64}`), así
  que el campo conserva su semántica ("la programación vigente") en ambos
  mundos.

- **D4 — Semántica de `advanceMinutes` (R3, R5)**. Instante objetivo de la
  notificación = `due_at - advance_minutes` minutos. Si ese instante ya pasó
  al crear o reprogramar (ej. `dueAt = now + 3 min` con `advance = 60`), el
  despacho ocurre en el siguiente tick — no es error. Precisión: peor caso
  ~2 min tarde (tick del dispatcher 60 s + tick del notifier 60 s), coherente
  con el acceptance criteria "~2 min después". Rango 0..10080 (0 = notificar
  exactamente en `due_at`; tope 7 días, suficiente para el picker del plan
  008 que ofrece 15 min / 1 h / 1 día).

- **D5 — Extensión del contrato congelado del notifier (R6)**. El schema de
  #13 se parte en `alertMessageSchema` (shape actual, byte a byte, `kind:
  z.enum(['alert','alert_resolved'])` y `alertId`) y `reminderMessageSchema`
  (`kind: z.literal('reminder')`, `reminderId`, `scheduleName`), unidos con
  `z.discriminatedUnion('kind', [...])` (zod v4 admite enum como
  discriminador). Congelado significa no romper a los consumidores existentes:
  añadir una rama nueva para un productor nuevo lo respeta; los tests de #13
  no se editan y deben seguir verdes.

- **D6 — Transición a `sent`: después del push y condicional (R7)**. Orden en
  el branch reminder del consumer: (1) cargar la fila y validar
  `status = 'scheduled'` + `schedule_name` coincidente — si no, skip con log y
  delete del mensaje; (2) push por el camino existente de #13
  (`findActiveMembersTokens` + `PushSender`); (3)
  `markSent(id)` = `UPDATE ... SET status='sent' WHERE id = $1 AND
  status = 'scheduled'`. Push-then-mark: si el push lanza, el mensaje queda
  sin borrar y la redelivery reintenta (at-least-once, #13 R14); la
  condicional del UPDATE y el check del paso (1) garantizan que redeliveries y
  duplicados de D2 no producen segundo push, y que una cancelación ganada en
  la ventana encolado→procesado se respeta (R9).

- **D7 — Autorización del PATCH sin `:petId` en la ruta (R10)**.
  `PetAccessGuard` lee `request.params.petId`; `PATCH /v1/reminders/:id` no lo
  tiene. El `UpdateReminderUseCase` resuelve `pet_id` desde la fila:
  `findById(id)` → si no existe, `ReminderNotFoundError`; después
  `PetRepository.findMembership(reminder.petId, userId)` (el mismo método que
  usa el guard, inyectado con `PET_REPOSITORY` importando `PetsModule`) → sin
  membresía activa, el **mismo** `ReminderNotFoundError` (404 opaco, sin
  filtrar existencia — brief §4); con membresía activa pero rol distinto de
  `owner`, `NotReminderOwnerError` → 403. Un `:id` no-UUID se corta en el
  controller con el mismo 404 (paridad con el guard, que corta `:petId`
  malformado sin tocar la base).

- **D8 — Ubicación del dispatcher: `modules/reminders/infrastructure` (R5)**.
  Precedente: `activity-scheduler.service.ts` vive en
  `modules/activity/infrastructure` (#10), no en `src/workers/` — el cron es
  de la feature, no un consumidor de cola. `RemindersDispatchService` inyecta
  `SQS_CLIENT` (AwsModule `@Global()`) y `REMINDER_REPOSITORY`, y replica el
  `resolveQueueUrl` cacheado de los workers (quinta copia; el ponytail-note de
  #13 pide extraerlo a `src/aws/` solo cuando se toquen los cuatro workers a
  la vez — aquí solo se toca el notifier, así que se copia y se hereda la
  nota).

- **D9 — Deviación del plan 008 y camino de vuelta a EventBridge Scheduler**.
  Local sustituye el paso 3 §Infra del plan por D1. Al desplegar a AWS real:
  (1) crear grupo de Scheduler `pet-tracker-dev`, rol IAM asumible por
  `scheduler.amazonaws.com` con `sqs:SendMessage` a `notifications`, y
  permisos `scheduler:CreateSchedule/DeleteSchedule/GetSchedule` +
  `iam:PassRole` en la Lambda API (plan 008 paso 3, en el stack CDK de #20+);
  (2) `CreateReminderUseCase`/`UpdateReminderUseCase` pasan a llamar
  `CreateSchedule`/`DeleteSchedule` one-shot `at(due_at - advance)` con
  `ActionAfterCompletion: DELETE`, nombre = `schedule_name`, target = la cola
  `notifications` y como input **el mismo JSON de R6** (Scheduler entrega el
  input plano, sin sobre EventBridge — el parse del notifier no cambia);
  (3) `REMINDERS_ENABLED=false` apaga el cron local sin tocar código;
  (4) `enqueued_at` queda sin uso (droppable en una migración futura) y
  `schedule_name` pasa a ser el nombre real del schedule. El branch reminder
  del notifier (R7) queda idéntico en ambos mundos.

- **D10 — Roles: `POST` y `PATCH` solo `owner` (R4, R10)**. Paridad exacta con
  las mutaciones de vacunas (#14) y pesos (#15): `@RequirePetRole('owner')` en
  el POST; chequeo equivalente en el use case del PATCH.

- **D11 — Errores de dominio (R10, R11)**. `reminder.errors.ts`:
  `ReminderNotFoundError` → `NotFoundException` (404),
  `NotReminderOwnerError` → `ForbiddenException` (403),
  `ReminderNotEditableError` → `ConflictException` (409, message
  `'Reminder is not editable'`). Mapeo en
  `infrastructure/mappers/reminder-error.mapper.ts` (`mapReminderError`),
  patrón de `vaccine-error.mapper.ts`. La validación de "dueAt futuro" es del
  DTO (zod `.refine`) → 400, no error de dominio.

## Contrato del mensaje (R6) — referencia exacta

```json
{
  "version": 1,
  "kind": "reminder",
  "reminderId": "<uuid>",
  "petId": "<uuid>",
  "scheduleName": "reminder-<uuidv7>",
  "title": "<reminders.title>",
  "body": "Recordatorio: <reminders.title>",
  "data": { "petId": "<uuid>", "reminderId": "<uuid>" }
}
```

## Archivos afectados

Nuevos (módulo `backend-pet-tracker/src/modules/reminders/`):

- `src/db/schema/reminders.schema.ts` — infraestructura Drizzle compartida:
  tabla `reminders` (R1); re-export en `src/db/schema/index.ts`; migración
  `src/db/migrations/0011_*.sql`.
- `domain/entities/reminder.entity.ts` — clase pura `Reminder`
  (`{id, petId, type, title, dueAt, advanceMinutes, channel, status,
  scheduleName, enqueuedAt, createdBy}`) + `REMINDER_TYPES`, `ReminderType`,
  `ReminderStatus`.
- `domain/errors/reminder.errors.ts` — D11.
- `domain/repositories/reminder.repository.ts` — token `REMINDER_REPOSITORY` +
  interface `ReminderRepository`: `create(data)`, `findById(id)`,
  `reschedule(id, changes, newScheduleName)` (solo `status='scheduled'`,
  resetea `enqueued_at`), `cancel(id)` (solo `status='scheduled'`),
  `findDue(now)`, `markEnqueued(id, at)`, `markSent(id): Promise<boolean>`
  (condicional, R7).
- `application/dto/reminder.dto.ts` — `CreateReminderSchema` (strictObject),
  `UpdateReminderSchema` (unión: cancel exacto | edición con ≥1 campo),
  `REMINDER_MAX_ADVANCE_MINUTES`, `REMINDER_TITLE_MAX_LENGTH` (R3, R11).
- `application/use-cases/create-reminder.use-case.ts` — R2.
- `application/use-cases/update-reminder.use-case.ts` — R8–R11 (autorización
  D7 incluida).
- `infrastructure/repositories/reminder.drizzle.repository.ts` —
  `ReminderDrizzleRepository` (ids con `uuidv7()`, como el resto del repo).
- `infrastructure/reminders.controller.ts` — `PetRemindersController`
  (`@Controller('pets/:petId/reminders')`, `@UseGuards(PetAccessGuard)`,
  `@RequirePetRole('owner')` en el POST) y `RemindersController`
  (`@Controller('reminders')`, PATCH `:id`); mismo helper de validación zod
  que `vaccines.controller.ts`.
- `infrastructure/mappers/reminder.mapper.ts` — `toReminderResponse` /
  `ReminderResponse` (shape de R2).
- `infrastructure/mappers/reminder-error.mapper.ts` — `mapReminderError`.
- `infrastructure/reminders-dispatch.service.ts` —
  `RemindersDispatchService.dispatchOnce()` (R5, R6).
- `infrastructure/reminders-scheduler.service.ts` —
  `RemindersSchedulerService` con `shouldSchedule()` (R12).
- `infrastructure/reminders.constants.ts` — `REMINDERS_INTERVAL_MS = 60000`,
  `REMINDERS_INTERVAL_NAME = 'reminders-dispatch'`,
  `REMINDERS_SCOPE = 'reminders'`.
- `reminders.module.ts` — imports `ConfigModule`, `PetsModule`; provee
  `{provide: REMINDER_REPOSITORY, useClass: ReminderDrizzleRepository}`, use
  cases, dispatcher y scheduler; controllers; **exporta** el provider de
  `REMINDER_REPOSITORY` (lo consume el notifier).
- `test/pet-reminders.e2e-spec.ts` — e2e (invoca `dispatchOnce()` /
  `drainOnce()` directamente, sin esperas de reloj — patrón de #13).

Modificados:

- `src/workers/notifier/notification-message.schema.ts` — D5 (R6).
- `src/workers/notifier/notifier-consumer.service.ts` — branch
  `kind: 'reminder'` (R7); inyecta `REMINDER_REPOSITORY`.
- `src/workers/notifier/notifier.module.ts` — añade `RemindersModule` a
  imports (mismo mecanismo que `UsersModule` para `PUSH_TOKEN_REPOSITORY`).
- `src/app.module.ts` — registra `RemindersModule`.
- `.env.example` y `docs/conventions.md` (tabla de env) — `REMINDERS_ENABLED`
  (R12).
- `docs/data-model.md` — fila `reminders`: añadir `enqueued_at`, anotar el
  doble uso de `schedule_name` y el mecanismo local (D2, D3).

## Alternativas descartadas

- **EventBridge Scheduler en local**: no existe en LocalStack community
  (funcionalidad Pro). Es el plan A del deploy real (D9), no de local.
- **`setTimeout`/schedule en memoria por reminder**: se pierde en cada
  reinicio del proceso; requeriría rehidratación al bootstrap. El cron + BD es
  el estado durable que ya tenemos.
- **Estado `'enqueued'` en el CHECK de `status`**: rompería el enum de
  `data-model.md` y expondría un estado interno del mecanismo local en el
  contrato de la API. `enqueued_at` es aditivo e invisible al cliente.
- **Columna generada `dispatch_at` (`due_at - advance`) con índice parcial**:
  optimización innecesaria a escala local (decenas de filas); el índice
  parcial por `status` de `data-model.md` basta. Revisar si `findDue` duele en
  producción real — donde de todos modos el cron desaparece (D9).
- **Puerto `ReminderScheduler` con dos implementaciones (cron | EventBridge)
  desde ya**: abstracción especulativa; el swap de D9 toca dos use cases y
  borra dos services, no amerita el puerto hoy.
- **`GET /v1/pets/:petId/reminders`**: fuera del alcance de #16 (ver
  [[requirements]] §Fuera de alcance).

## Riesgos sobre contratos existentes

- El contrato del mensaje de `notifications` está **congelado y aseverado**
  por los tests de #13 (`notifier-consumer.service.spec.ts`,
  `test/alerts-center-notifier.e2e-spec.ts`): D5 los deja intactos; si alguno
  requiere edición, la extensión está mal hecha.
- La migración 0011 no debe contener `ALTER TABLE` de tablas existentes (R1).
- Mientras Codex implementa, nadie más toca `backend-pet-tracker/` (un solo
  escritor, `CLAUDE.md`).

## Verificación manual (humano, tras el merge)

Smoke de reloj real del acceptance criteria #1: con `REMINDERS_ENABLED=true` y
`NOTIFIER_ENABLED=true`, crear un reminder con `dueAt = now + 3 min` y
`advanceMinutes = 1` → en ~2 min el log del `ConsolePushSender` muestra el
push y la fila queda `status='sent'`. El e2e automatizado cubre la misma
cadena invocando los ticks directamente.
