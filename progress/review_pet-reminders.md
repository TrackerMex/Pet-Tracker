# review: pet-reminders
Fecha: 2026-08-13
Veredicto: APROBADO

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo #16)
- [x] progress/current.md actualizado (describe la sesión activa de #16)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — `reminder.entity.ts` y
      `reminder.errors.ts` son clases puras sin imports de ORM/HTTP/IO
- [x] repositories/contratos en domain son interfaces puras —
      `domain/repositories/reminder.repository.ts`: token Symbol + interface,
      sin implementación
- [x] application depende de interfaces, no implementaciones —
      `CreateReminderUseCase` y `UpdateReminderUseCase` inyectan
      `REMINDER_REPOSITORY` / `PET_REPOSITORY` por token con tipos interface
- [x] infrastructure sin lógica de negocio — `ReminderDrizzleRepository`
      implementa la interface; controller solo valida/mapea; use cases llevan
      la autorización y transiciones

## Checklist C4 — TDD
- [x] Cada R1..R12 tiene al menos un test que lo nombra. Verificado por grep
      sobre los archivos nuevos + notifier: `describe('R1: ...')` …
      `describe('R12: ...')` presentes; los tests en archivos del notifier usan
      la convención anti-colisión `R6 (pet-reminders #16)` / `R7 (pet-reminders #16)`
- [x] Historial test-primero: 12 tripletas `test(...) → feat(...) → docs(...)`
      en `git log main..HEAD`. Inspeccionados los 12 commits rojos
      (a834a82, 5decc79, ef01906, f899527, 0479f29, a58fbe3, 355d5cc, 1de5b67,
      4179065, 56fdd11, e4fb8e4, ef91e6c): todos tocan exclusivamente archivos
      `*.spec.ts` / `*.e2e-spec.ts`

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" — las 12 filas tienen test + hashes
      rojo/verde; los hashes coinciden 1:1 con `git log main..HEAD`
- [x] Commits siguen `test|feat|docs(pet-reminders): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y casilla humana marcada
      (2026-08-11). El único diff post-main sobre requirements.md es el flip de
      aprobación (commit 22980f4, del leader, previo al primer commit de
      implementación); ningún R-id modificado después

## Checklist C7 — Sin código huérfano
- [ ] Componentes/módulos reemplazados fueron eliminados
- [ ] Sus tests también fueron eliminados
- [x] N/A — esta feature no reemplaza nada existente. La única "sustitución" es
      `notificationMessageSchema`, que pasa de objeto a discriminatedUnion
      manteniendo el mismo nombre exportado; sus dos importadores siguen
      compilando y ningún símbolo quedó sin uso

## Verificación de la spec contra el código real

- **R1**: `0011_fancy_turbo.sql` crea solo la tabla `reminders` con los 4
  CHECKs nombrados, 2 FKs (`ON DELETE CASCADE` en pet_id), 2 índices btree y el
  parcial `WHERE status = 'scheduled'`. Cero `ALTER` de tablas existentes.
  Schema en `reminders.schema.ts`, re-exportado en `schema/index.ts`.
- **R2/R3**: DTO con `strictObject`, enum de 7 tipos, title trim 1..120, ISO
  con offset + refine de futuro, advance int 0..10080; constantes
  `REMINDER_TITLE_MAX_LENGTH` / `REMINDER_MAX_ADVANCE_MINUTES` exportadas desde
  `reminder.dto.ts`. Response shape exacto en `reminder.mapper.ts` (7 claves,
  `dueAt` = `toISOString()`).
- **R4**: `PetRemindersController` con `@UseGuards(PetAccessGuard)` +
  `@RequirePetRole('owner')`; e2e verifica 404 antes de 403 y antes de la
  validación del body.
- **R5/R6**: `RemindersDispatchService.dispatchOnce()` — `findDue` filtra
  `status='scheduled' AND enqueued_at IS NULL AND due_at - advance <= now`,
  orden `due_at ASC`; send-then-mark; fallo por fila se loguea y continúa con
  `enqueued_at` NULL. Mensaje byte a byte igual al contrato de design.md.
- **R6 (schema)**: `notification-message.schema.ts` →
  `z.discriminatedUnion('kind', [alertMessageSchema, reminderMessageSchema])`.
  La rama alert conserva sus claves intactas.
- **R7**: branch reminder en `NotifierConsumerService`: not_found /
  not_scheduled / stale_schedule → log `{scope, messageId, reminderId, skipped}`
  y éxito (mensaje borrado, nunca DLQ); push por el camino existente
  (`findActiveMembersTokens` + `PushSender`, incluido 0 destinatarios);
  `markSent` condicional a `status='scheduled'`. Redelivery → not_scheduled →
  un solo push (e2e lo cubre con doble tick).
- **R8-R11**: `UpdateReminderUseCase` con precedencia 404 (no existe / sin
  membresía, opaco) → 403 (no owner) → 409 (`'Reminder is not editable'`, sin
  mutar) → cancel/reschedule; reschedule regenera `reminder-<uuidv7>` y resetea
  `enqueued_at`; controller corta `:id` no-UUID con 404 antes de tocar la base.
  `UpdateReminderSchema` = unión de cancel exacto | edición con ≥1 campo.
- **R12**: `RemindersSchedulerService.shouldSchedule()` exige
  `REMINDERS_ENABLED === 'true'` y `NODE_ENV !== 'test'` (patrón idéntico a
  `NotifierSchedulerService`). `.env.example` y la tabla de
  `docs/conventions.md` actualizados en el mismo commit verde (6147f96
  verificado: 4 archivos, incluye ambos).

## Rama alert del notifier (#13) — sin cambio de comportamiento

- `git diff main..HEAD --numstat` sobre `notifier-consumer.service.spec.ts`:
  **192 inserciones, 0 borrados** — los tests congelados de #13 no se editaron.
- `alerts-center-notifier.e2e-spec.ts`, `push-sender.ts`,
  `notifier-scheduler.service.ts` y `notifier.constants.ts`: diff vacío.
- El refactor extrae `sendPush()` sin alterar la lógica alert (mismo flujo,
  mismo log de 0 destinatarios); el commit `4f20037` solo relaja el
  constructor (`reminders?`) para que los tests alert congelados de #13, que
  instancian el service con 3 argumentos, sigan typecheckeando — con guard de
  runtime si faltara el repo.

## Acceptance criteria de feature_list.json #16

1. Crear con dueAt futuro → mensaje en `notifications` y `status='sent'` al
   procesarse: cubierto por e2e R7 (cadena real create → dispatchOnce →
   drainOnce contra LocalStack, verificado `sent` en DB). El smoke de reloj
   real "~2 min" queda para el humano tras el merge, como fija design.md
   §Verificación manual.
2. Cancelar → `cancelled` y no se envía: e2e R9, ambos órdenes (antes y
   después del encolado, mensaje en vuelo inocuo).
3. Reprogramar reemplaza sin duplicar envíos: e2e R8 — token nuevo,
   `enqueued_at` reseteado, `sendPush` llamado exactamente 1 vez con dos
   mensajes en cola.
4. PATCH sin membresía → 404: e2e R10 (id inválido, inexistente, no-miembro y
   miembro inactivo comparten 404 opaco; family activo → 403).

## Output de ./init.sh (corrida independiente del reviewer)

Primera corrida (infra Docker levantada hacía 2 min): exit 1 — 107 e2e
fallidos por las DOS fallas de entorno ya documentadas, no por el código:
LocalStack community recién reiniciado pierde recursos (`NoSuchBucket` en
media) y carrera de arranque de Postgres (FK `pet_users_user_id_users_id_fk`).
Se corrió `pnpm run provision:local` (idempotente, solo LocalStack) y se
repitió con infra caliente.

Segunda corrida: **exit 0**. Verificado con `docker port` que Postgres publica
5432 (los e2e corrieron de verdad, no hubo skip silencioso).

```
Test Suites: 2 skipped, 15 passed, 15 of 17 total
Tests:       6 skipped, 238 passed, 244 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
```

Los números coinciden con el reporte de Codex (15 suites / 238 e2e; 2 suites /
6 tests skipped por su gate preexistente). Las 2 suites skipped y los 6 tests
skipped son gates existentes ajenos a esta feature.

## Observaciones

Ninguna bloqueante. Notas menores para el leader:

- El cast `data as { petId: string; alertId: string }` en `sendPush()` está
  comentado en el código: los adaptadores reenvían `data` sin inspeccionarla y
  su tipo conserva `alertId` porque la rama alert está congelada. Si una
  feature futura descongela el contrato de #13, ese cast es el primer sitio a
  limpiar.
- `resolveQueueUrl` es la quinta copia, con nota ponytail heredada de #13 en el
  propio archivo — decisión explícita de design.md D8, no deuda nueva.
- El smoke de reloj real (acceptance criterion #1, "~2 min") es paso humano
  post-merge (design.md §Verificación manual); no bloquea este veredicto pero
  no debe olvidarse al cerrar la feature.
