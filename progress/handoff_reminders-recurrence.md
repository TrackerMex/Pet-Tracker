Worktree: /home/claude/sites/Pet-Tracker-wt-210
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-210 && pwd && git branch --show-current && git rev-parse --short HEAD`. Confirma en el reporte que la salida es esa ruta, la branch `feature/210-reminders-recurrence` y 705f1ea2, o un hijo de 705f1ea2 que solo toque progress/ (`git merge-base --is-ancestor 705f1ea2 HEAD; echo $?` → 0, y `git diff --name-only 705f1ea2 HEAD -- . ':(exclude)progress' | wc -l` → 0).

Feature: reminders-recurrence (#210). Branch: feature/210-reminders-recurrence. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): 705f1ea2, la firma delegada (2026-10-26, mandato del humano). Las erratas de la auditoría de firma están en 3a41b056, anterior a la firma. El código de la app en H0 es el de `origin/main` 1316410f. NO hagas git merge ni git rebase: la receta de regeneración ante colisión con #211/#212 la aplica el leader (design.md §Migración).
Spec aprobada: specs/reminders-recurrence/requirements.md (status: approved). Lee también design.md y tasks.md. tasks.md manda en el orden y en la forma de cada commit; lee sus «Reglas de la cadena» (1 a 9) y la tabla «Enmiendas a tests existentes (lista cerrada E1–E8)» antes de empezar. No hay decisiones abiertas: no hay nada que preguntar.
Orden: los 20 commits de tasks.md § «Commits» (C1 a C20), en ese orden. C20 es el de trazabilidad.
Criterios de aceptación: R1 a R14 de requirements.md.
Entorno: el worktree ya tiene `.env` en la raíz y `backend-pet-tracker/node_modules` instalado. La base del worktree, `pet_tracker_wt210`, tiene 20 migraciones aplicadas (medido por el leader en H0). No regeneres el `.env` ni leas sus secretos. No añadas dependencias: `backend-pet-tracker/package.json` y `backend-pet-tracker/pnpm-lock.yaml` no cambian. Las zonas salen de `Intl` (Node v24); `uuidv7` ya viene de `'uuidv7'` (lo importa create-reminder.use-case.ts).

Archivos (lista cerrada; si necesitas otro, PARA y anótalo en el reporte). Todos bajo backend-pet-tracker/ salvo indicación; `R` = src/modules/reminders:
  - src/db/schema/reminders.schema.ts (R1: las cuatro columnas, `date` en el import de `drizzle-orm/pg-core` y los tres `check(...)` tras `reminders_status_check`)
  - src/db/migrations/0020_reminders_recurrence.sql, src/db/migrations/meta/0020_snapshot.json y src/db/migrations/meta/_journal.json, generados por drizzle-kit y sin editar (C2)
  - R/domain/entities/reminder.entity.ts, R/domain/repositories/reminder.repository.ts y R/domain/errors/reminder.errors.ts
  - R/application/recurrence.ts (nuevo) y R/application/recurrence.spec.ts (nuevo; R3, R7, R8, R9, R10)
  - R/application/dto/reminder.dto.ts y R/application/dto/reminder.dto.spec.ts (R2)
  - R/application/use-cases/create-reminder.use-case.ts y R/application/use-cases/create-reminder.use-case.spec.ts (nuevo; R4)
  - R/application/use-cases/update-reminder.use-case.ts y R/application/use-cases/update-reminder.use-case.spec.ts (R6, E4, E7)
  - R/application/use-cases/list-reminders.use-case.spec.ts (solo E4)
  - src/modules/pets/application/owner-local-day.ts (solo extraer `ownerTimeZone`, C8; `localDayInZone` pasa a usarla)
  - src/pipeline/local-day.ts (solo añadir `sameLocalTimeOn`, C4)
  - R/infrastructure/repositories/reminder.drizzle.repository.ts
  - R/infrastructure/mappers/reminder.mapper.ts y R/infrastructure/mappers/reminder-error.mapper.ts
  - R/infrastructure/reminders.controller.ts (solo el `try/catch` con `mapReminderError` en el POST, C12; sin rutas nuevas)
  - R/infrastructure/reminders-dispatch.service.ts y R/infrastructure/reminders-dispatch.service.spec.ts (R13, E2, E4)
  - src/workers/notifier/notifier-consumer.service.ts y src/workers/notifier/notifier-consumer.service.spec.ts (R11, R12, R13, E1, E4, E6)
  - src/workers/notifier/notifier.module.ts (solo `PetsModule` en `imports`, A10)
  - src/db/schema/reminders.schema.spec.ts (R1, E8)
  - test/pet-reminders.e2e-spec.ts (R1, R3, R4, R5, R6, R11, R13, R14, E3, E5)
  - specs/reminders-recurrence/traceability.md, en la raíz del repo (solo en C20)
  - progress/impl_reminders-recurrence.md, en la raíz del repo (tu reporte). tasks.md dice que C20 lleva solo traceability.md: el reporte no entra en ningún commit, lo commitea el leader.
No tocar: src/modules/pets/** salvo application/owner-local-day.ts (el puerto `PetRepository` de A12, `pets.module.ts` y `owner-local-day.spec.ts` no cambian: sus tests siguen verdes sin tocarlos), src/pipeline/** salvo local-day.ts (local-day.spec.ts tampoco), src/modules/health/** (`addCalendarMonths` solo se importa), src/modules/users/**, src/audit/**, R/reminders.module.ts (A20), R/application/reminder-push-body.ts y su spec, R/application/use-cases/delete-reminder.use-case.ts y su spec, R/application/use-cases/list-reminders.use-case.ts, R/infrastructure/reminders-scheduler.service.ts y su spec, R/infrastructure/reminders.constants.ts, src/workers/notifier/notification-message.schema.ts (contrato SQS #12), src/workers/notifier/push-sender.ts y el resto de src/workers/notifier/, las migraciones 0000 a 0019, el resto de src/db/schema/, src/app.module.ts, src/main.ts, el resto de test/ (también test/alerts-center-notifier.e2e-spec.ts), docs/ entera (esta spec no tiene commit de docs), mobile-pet-tracker/ (A26 solo se lee), feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md.

Comandos. Todos desde backend-pet-tracker/, después de este cd literal:
  cd /home/claude/sites/Pet-Tracker-wt-210/backend-pet-tracker && pwd
  - unitarios de la feature: `pnpm exec jest src/db/schema/reminders.schema.spec.ts src/modules/reminders src/workers/notifier src/modules/pets/application/owner-local-day.spec.ts src/pipeline/local-day.spec.ts`
  - e2e: `pnpm exec jest --config ./test/jest-e2e.json pet-reminders`
  - e2e del notifier de alertas, que no cambia pero comparte el notifier: `pnpm exec jest --config ./test/jest-e2e.json alerts-center-notifier`
  - tipos: `pnpm exec tsc --noEmit -p tsconfig.json`
  - suite unitaria completa: `pnpm exec jest`
  Equivalen a los `pnpm -C backend-pet-tracker exec jest …` de tasks.md regla 5. Nunca `pnpm run test -- …` ni `pnpm run test:e2e -- …`: el `--` llega a jest. Mide los exit codes sin pipe (`cmd > ../progress/<log> 2>&1; echo $?`); los `progress/*.log` los ignora git.
  Antes de cada corrida e2e, `pgrep -f '[i]nit.sh'` tiene que salir vacío: el leader corre init.sh en otros worktrees y LocalStack es compartido. Si no está vacío, espera y vuelve a mirar. Un timeout aislado se repite sin flags antes de tocar nada. Si Postgres o LocalStack no están arriba, deja el rojo o el verde e2e de ese commit como «pendiente de medir» en el reporte y sigue (tasks.md regla 5): lo mide el leader.
  En C2, tras `db:generate` y antes del e2e del verde: `pnpm run db:migrate`, con `test -z "${DATABASE_URL:-}"; echo $?` → 0 antes (un `DATABASE_URL` exportado en la shell pisa al `.env` que carga drizzle.config.ts). Nunca psql crudo. Después, el journal de la base tiene 21 filas: `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt210 -tAc 'select count(*) from drizzle.__drizzle_migrations'` → 21 (era 20 en H0). Es una lectura: si el sandbox te deniega `docker`, anótalo como «pendiente de medir» y sigue.

Por commit, sobre los ficheros de ese commit (rutas relativas a backend-pet-tracker/):
  1. `pnpm exec prettier --write <ficheros .ts del commit>`. Nunca sobre src/db/migrations/**: el `.sql`, el snapshot y el journal se commitean tal como los genera drizzle-kit.
  2. la cadena, sin pipes: `pnpm exec prettier --check <ficheros .ts> && pnpm exec eslint <ficheros .ts> && pnpm exec tsc --noEmit -p tsconfig.json && <unitarios de la feature>`. Después, aparte (para que un rojo unitario no la salte), el e2e con `pgrep -f '[i]nit.sh'` vacío antes. C1 a C19 corren las dos; C20 ninguna.
  3. `git add <rutas explícitas>` y `git commit -m "<mensaje de la lista>"`. Nunca `git add -A` ni `commit -a`.
  4. tras el commit, árbol limpio: `git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. No lo pongas antes del commit: lo stageado sale en `git status`.
  En un commit rojo, el jest del paso (unitario, e2e o los dos, según la columna «Rojo esperado» de tasks.md § «Commits») tiene que fallar **por aserción** en los `it` nuevos o enmendados que esa columna da por rojos y en ningún otro; los que nacen verdes (más abajo) pasan. El resto de la cadena (prettier, eslint y tsc) tiene que pasar igual: por eso existen los stubs. Antes de commitear un rojo, comprueba en la salida de jest que el fallo es un `expect`, no un error de compilación de ts-jest ni una excepción.

Mensajes de commit (literal; tasks.md § «Commits», en inglés según docs/conventions.md):
  C1  test(reminders): #210 R1 recurrence columns and CHECKs
  C2  feat(reminders): #210 R1 recurrence columns, CHECKs and additive migration
  C3  test(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation
  C4  feat(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation
  C5  test(reminders): #210 R2 zod validation of recurrence
  C6  feat(reminders): #210 R2 zod validation of recurrence
  C7  test(reminders): #210 R4 POST persists the series
  C8  feat(reminders): #210 R4 POST persists the series
  C9  test(reminders): #210 R5 response shape with recurrence
  C10 feat(reminders): #210 R5 response shape with recurrence
  C11 test(reminders): #210 R3 R6 cross-field rules and series PATCH
  C12 feat(reminders): #210 R3 R6 cross-field rules and series PATCH
  C13 test(reminders): #210 R13 writes conditioned on schedule_name
  C14 feat(reminders): #210 R13 writes conditioned on schedule_name
  C15 test(reminders): #210 R12 kind in the reminder push data
  C16 feat(reminders): #210 R12 kind in the reminder push data
  C17 test(reminders): #210 R11 notifier advances the series
  C18 feat(reminders): #210 R11 notifier advances the series
  C19 test(reminders): #210 R14 opaque 404 with recurrence bodies
  C20 docs(reminders): #210 fill traceability
  Los `refactor(reminders): …` son opcionales y van justo después del verde de su R, con todo en verde. Si haces alguno, dilo en el reporte.

Cifras `total` esperadas tras cada commit. Cada una es la anterior más las filas nuevas que fija la spec; ningún `it` existente se borra (E1–E8 enmiendan, no quitan). Base de H0: unitarios de la feature 15 suites y 142 tests; e2e pet-reminders 33 tests.
  C1  unit 142 + 2 (R1: los dos `it` del schema) = 144; e2e 33 + 26 (`#210 R1: CHECK %s`) = 59
  C2  unit 144; e2e 59
  C3  unit 144 + 34 (R3 6, R7 11, R8 9, R9 4, R10 4) = 178, suites 15 + 1 = 16; e2e 59
  C4  unit 178; e2e 59
  C5  unit 178 + 46 (R2: rechazos POST 17, rechazos PATCH 17, límites 10, null en POST 1, PATCH aceptados 1) = 224; e2e 59
  C6  unit 224; e2e 59
  C7  unit 224 + 2 (R4) = 226, suites 16 + 1 = 17; e2e 59 + 1 (R4) = 60
  C8  unit 226; e2e 60
  C9  unit 226; e2e 60 + 1 (R5) = 61
  C10 unit 226; e2e 61
  C11 unit 226 + 8 (`#210 R6: PATCH %s`) = 234; e2e 61 + 3 (R3 2, R6 1) = 64
  C12 unit 234; e2e 64
  C13 unit 234; e2e 64 + 2 (R13) = 66
  C14 unit 234; e2e 66
  C15 unit 234 + 1 (R12) = 235; e2e 66
  C16 unit 235; e2e 66
  C17 unit 235 + 6 (R11 2 + zonas 3, R13 stale_schedule 1) = 241; e2e 66 + 2 (R11) = 68
  C18 unit 241; e2e 68
  C19 unit 241; e2e 68 + 1 (R14) = 69
  Las filas de cada `it.each` son las de las tablas de requirements.md (R2: 5 + 5 + 7 filas de rechazo). Si un `total` no cuadra, el desglose por fichero dice si sobra o falta una fila: corrige el test contra la tabla de la spec, nunca la tabla.

Reglas críticas:
  - Seguir docs/architecture.md (capas: domain sin imports de framework) y docs/conventions.md.
  - TDD por requisito, según tasks.md: test rojo que nombra el R-id, después verde, después refactor. Un commit no empieza hasta que el anterior esté en verde. Nunca implementación y test en el mismo commit (C4 de CHECKPOINTS.md).
  - Prefijo `#210 R<n>:` al inicio de cada `describe` e `it` nuevo (tasks.md regla 8). Los `it` existentes de E1–E8 conservan su nombre: las trazabilidades de #16 y #47 los citan.
  - Enmiendas a tests existentes: solo la lista cerrada E1–E8 de tasks.md, cada una en su commit (E8 en C1, E4 en C7, E3 en C9, E7 en C11, E2 en C13, E1 y E5 en C15, E6 en C17). Ninguna otra línea de un test existente cambia.
  - Stubs (tasks.md tabla «Commits», columna «Stubs en el commit rojo»). Aquí los stubs devuelven valores y no hay «Not implemented»:
      C3: `RECURRENCE_UNITS`, `RecurrenceUnit` y `ReminderRecurrence` en la entidad (sin tocar `ReminderProps`), `InvalidRecurrenceError`, y `recurrence.ts` con `assertValidRecurrence` cuyo cuerpo es solo `void <param>;` por cada uno de sus cuatro parámetros, y `nextOccurrence` con `void now; void timeZone; return reminder.dueAt;`. Sin los `void`, eslint da 6 × `no-unused-vars`.
      C5: `export` de `EditReminderSchema` (A18).
      C7: `ReminderProps.recurrence`, la enmienda E4, `toDomain` y `create` de drizzle con el mapeo real de columnas, el constructor de `CreateReminderUseCase` con `pets` sin usar y el use case pasando siempre `recurrence: null`.
      C11: la enmienda E7.
      C13: firmas nuevas en el puerto, `markEnqueued` de drizzle sin la condición nueva, `advanceOccurrence` de drizzle **sin** `async`, con cuerpo `void id; void scheduleName; void dueAt; void newScheduleName; return Promise.resolve(false);` (la forma `async … { return false; }` da `require-await` + 4 × `no-unused-vars`), y el dispatcher pasando `null` como `scheduleName`.
      C17: la enmienda E6, el 6.º parámetro opcional `pets?` del constructor del notifier y `PetsModule` en `NotifierModule`.
    El verde que implementa un stub borra sus `void`.
  - Filas que nacen verdes (tasks.md regla 7), y su mutación:
      C3: las tres filas «no lanza» de `#210 R3: assertValidRecurrence %s` (el stub es un no-op).
      C7: `#210 R4: sin recurrence crea recurrence null y no consulta la zona`.
      C11: la fila «solo title» de `#210 R6: PATCH %s`.
      C13: la fila `not.toHaveBeenCalledWith(failed…)` de E2, la llamada con nombre vigente de `markEnqueued` y las dos filas `false` de `advanceOccurrence`.
      C17: `#210 R11: serie pasada de until marca sent y no avanza` (unit) y `#210 R11: una serie con until en su dia termina en sent` (e2e).
      C19: `#210 R14: PATCH con recurrenceUntil invalido sobre reminder ajeno responde el mismo 404`, entero.
  - Las nueve mutaciones (tasks.md R3, R4, R6, R11, R13 ×4 y R14). Tras el commit verde que se indica, planta la mutación, corre el test, comprueba el rojo, revierte con `git checkout HEAD -- <fichero>` y comprueba `git diff --quiet HEAD -- <fichero>; echo $?` → 0. Registra las tres cosas en el reporte (mutación, comando con su exit code y la línea del `expect` que falló). Ninguna mutación se commitea.
      M1 R3, tras C4, R/application/recurrence.ts: cuerpo de `assertValidRecurrence` reemplazado por un `throw` incondicional → rojas las tres filas «no lanza».
      M2 R4, tras C8, R/application/use-cases/create-reminder.use-case.ts: llamar a `findOwnerTimezone` siempre → rojo `#210 R4: sin recurrence crea recurrence null y no consulta la zona`.
      M3 R6, tras C12, R/application/use-cases/update-reminder.use-case.ts: pasar siempre `recurrence` en `changes` → roja la fila «solo title».
      M4 R11, tras C18, R/application/recurrence.ts: ignorar `until` en `nextOccurrence` → rojos el unit «serie pasada de until marca sent» y el e2e «serie con until en su dia termina en sent».
      M5 R13, tras C14, R/infrastructure/repositories/reminder.drizzle.repository.ts: quitar la condición de `schedule_name` en `advanceOccurrence` → roja la fila de nombre viejo.
      M6 R13, tras C14, mismo fichero: quitar la condición de `status` en `advanceOccurrence` → roja la fila `cancelled`.
      M7 R13, tras C14, mismo fichero: `where` de `markEnqueued` con `schedule_name = 'x'` fijo → roja la llamada con el nombre vigente.
      M8 R13, tras C14, R/infrastructure/reminders-dispatch.service.ts: llamar a `markEnqueued` también para el reminder cuyo envío falló → roja la fila `not.toHaveBeenCalledWith(failed…)` de E2.
      M9 R14, tras C19, R/application/use-cases/update-reminder.use-case.ts: mover la llamada a `assertValidRecurrence` justo después de `findById` (antes de la membresía) → rojo (400 frente a 404).
  - `expect.any(...)` o `expect.anything()` como valor de una propiedad dentro de un objeto literal llevan `as unknown`, porque si no eslint marca `no-unsafe-assignment`. Como argumento directo no hace falta (así van `expect.stringMatching(/^reminder-[0-9a-f-]{36}$/)` y `expect.objectContaining({ skipped: 'stale_schedule' })` de R11 y R13). El cuerpo de supertest se tipa con `response.body as <Tipo>`, como en el resto de test/pet-reminders.e2e-spec.ts.
  - R11 unit: la fila de serie se construye dentro del `it` con `new Reminder({ ...reminderRow(), dueAt: <dueAt>, recurrence: { … } })`, sin tocar `reminderRow()`; `Reminder` no tiene accesor `props` (tasks.md R11).
  - Migración (C2): desde la raíz, `cd /home/claude/sites/Pet-Tracker-wt-210 && pnpm -C backend-pet-tracker db:generate --name reminders_recurrence`, literal de tasks.md § «Migración» (requiere el `.env` de la raíz; `drizzle.config.ts` carga `../.env`). Tiene que generar exactamente `0020_reminders_recurrence.sql`, `meta/0020_snapshot.json` y la entrada nueva de `meta/_journal.json`, sin editarlos. Comprueba que el `.sql` solo trae las sentencias propias, desde backend-pet-tracker/:
      grep -cF 'ALTER TABLE "reminders" ADD COLUMN' src/db/migrations/0020_reminders_recurrence.sql   # -> 4 (recurrence_unit, recurrence_every, recurrence_until, recurrence_anchor_at)
      grep -cF 'ALTER TABLE "reminders" ADD CONSTRAINT' src/db/migrations/0020_reminders_recurrence.sql   # -> 3 (reminders_recurrence_unit_check, reminders_recurrence_every_check, reminders_recurrence_shape_check)
      grep -cF "ALTER TABLE" src/db/migrations/0020_reminders_recurrence.sql   # -> 7
      grep -ciF "drop" src/db/migrations/0020_reminders_recurrence.sql   # -> 0
      grep -ciF "create" src/db/migrations/0020_reminders_recurrence.sql   # -> 0
      grep -cF '"tag"' src/db/migrations/meta/_journal.json   # -> 21 (A24 + 1)
      ls src/db/migrations | grep -c '_reminders_recurrence\.sql$'   # -> 1
    Si toca cualquier otra tabla, PARA: hay drift de esquema en la base y no es tuyo. Si drizzle-kit propone otro número que 0020, PARA: no renumeres nada a mano.
  - C20: traceability.md con el rojo y el verde de cada fila (R14 solo el rojo, nace verde), en un solo commit `docs(reminders): #210 fill traceability` y sin ningún otro fichero. No mezcles ficheros de arnés en los commits TDD. No rebasees tras rellenarlo.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_reminders-recurrence.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo. Las dos excepciones ya dichas: el e2e sin infraestructura y el `docker exec` de lectura, que quedan «pendiente de medir».
  - Un error de invocación (ENOENT sobre una ruta, `ERR_PNPM_RECURSIVE_EXEC_NO_PACKAGE`, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o un ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.

Anclas de la base (requirements.md § «Contexto fijo», A1 a A26, y las cuentas base de tasks.md E1–E8). El leader las midió en H0 y coinciden todas. Córrelas tal cual desde la raíz del worktree (`cd /home/claude/sites/Pet-Tracker-wt-210 && pwd`) antes del primer commit y pega la salida en el reporte. Ante una diferencia, PARA. Un `grep -c` cuenta líneas, no apariciones.
  grep -cF "async markEnqueued(id: string, at: Date): Promise<void>" backend-pet-tracker/src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts   # A1 -> 1
  grep -cF "markEnqueued(id: string, at: Date): Promise<void>;" backend-pet-tracker/src/modules/reminders/domain/repositories/reminder.repository.ts   # A2 -> 1
  grep -cF "export type ReminderChanges" backend-pet-tracker/src/modules/reminders/domain/repositories/reminder.repository.ts   # A3 -> 1
  grep -cF "data: { petId: reminder.petId, reminderId: reminder.id }," backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.ts   # A4 -> 1
  grep -cF "await this.reminders.markEnqueued(reminder.id, new Date());" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.ts   # A5 -> 1
  grep -cF "await this.reminders.markSent(message.reminderId);" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A6 -> 1
  grep -cF "reminder.scheduleName !== message.scheduleName" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A7 -> 1
  grep -cF "data: message.data as { petId: string; alertId: string }" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A8 -> 1
  grep -cF "Reenviar un push repetido es preferible a perderlo" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A9 -> 1
  grep -cF "imports: [ConfigModule, UsersModule, RemindersModule]" backend-pet-tracker/src/workers/notifier/notifier.module.ts   # A10 -> 1
  grep -cF "export function addCalendarMonths(date: string, months: number): string" backend-pet-tracker/src/modules/health/application/vaccine-date.ts   # A11 -> 1
  grep -cF "findOwnerTimezone(petId: string): Promise<string | null>;" backend-pet-tracker/src/modules/pets/domain/repositories/pet.repository.ts   # A12 -> 1
  grep -cF "export function localDayInZone(" backend-pet-tracker/src/modules/pets/application/owner-local-day.ts   # A13 -> 1
  grep -cF "function offsetMsAt(tsMs: number, timeZone: string): number" backend-pet-tracker/src/pipeline/local-day.ts   # A14 -> 1
  grep -cF "export function shiftDay(day: string, days: number): string" backend-pet-tracker/src/pipeline/local-day.ts   # A15 -> 1
  grep -cF "export function isCalendarDate(value: string): boolean" backend-pet-tracker/src/pipeline/local-day.ts   # A16 -> 1
  grep -cF "export const CreateReminderSchema" backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.ts   # A17 -> 1
  grep -cF "const EditReminderSchema = z" backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.ts   # A18 -> 1
  grep -cF "export interface ReminderResponse" backend-pet-tracker/src/modules/reminders/infrastructure/mappers/reminder.mapper.ts   # A19 -> 1
  grep -cF "imports: [ConfigModule, PetsModule]" backend-pet-tracker/src/modules/reminders/reminders.module.ts   # A20 -> 1
  grep -cF 'scheduleName: `reminder-${uuidv7()}`' backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.ts   # A21 -> 1
  grep -cF "export class ReminderNotEditableError" backend-pet-tracker/src/modules/reminders/domain/errors/reminder.errors.ts   # A22 -> 1
  grep -cF "between 0 and 10080" backend-pet-tracker/src/db/schema/reminders.schema.ts   # A23 -> 1
  grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json   # A24 -> 20
  grep -cF "0019_pet_documents_uploaded_at" backend-pet-tracker/src/db/migrations/meta/_journal.json   # A25 -> 1
  grep -cF "reminders: body as Reminder[]" mobile-pet-tracker/src/api/reminders.ts   # A26 -> 1
  grep -cF "data: { petId: PET_ID, reminderId: REMINDER_ID }" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E1 -> 2
  grep -cF "data: { petId: PET_ID, reminderId: REMINDER_ID, kind: 'reminder' }" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E1 literal nuevo -> 0
  grep -cF "[first.id, NOW]," backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
  grep -cF "[second.id, NOW]," backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
  grep -cF "toHaveBeenCalledWith(sent.id, NOW)" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
  grep -cF "not.toHaveBeenCalledWith(failed.id, NOW)" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
  grep -cF "toEqual([[sent.id, NOW]])" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
  grep -cF "'advanceMinutes'," backend-pet-tracker/test/pet-reminders.e2e-spec.ts   # E3 -> 1
  grep -cF "'recurrenceUntil'," backend-pet-tracker/test/pet-reminders.e2e-spec.ts   # E3 literal nuevo -> 0
  grep -cF "new Reminder({" backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts   # E4 -> 2
  grep -cF "new Reminder({" backend-pet-tracker/src/modules/reminders/application/use-cases/list-reminders.use-case.spec.ts   # E4 -> 1
  grep -cF "new Reminder({" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E4 -> 5
  grep -cF "new Reminder({" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E4 -> 1
  grep -cF "data: { petId: pet.id, reminderId }," backend-pet-tracker/test/pet-reminders.e2e-spec.ts   # E5 -> 1
  grep -cF "data: { petId: pet.id, reminderId, kind: 'reminder' }," backend-pet-tracker/test/pet-reminders.e2e-spec.ts   # E5 literal nuevo -> 0
  grep -cF "return { client, findById, markSent };" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E6 -> 1
  grep -cF "advanceOccurrence" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E6 literal nuevo -> 0
  grep -cF "const pets = { findMembership } as unknown as PetRepository;" backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts   # E7 -> 1
  grep -cF "findOwnerTimezone" backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts   # E7 literal nuevo -> 0
  grep -cF "'created_by'," backend-pet-tracker/src/db/schema/reminders.schema.spec.ts   # E8 -> 2
  grep -cF "'recurrence_unit'," backend-pet-tracker/src/db/schema/reminders.schema.spec.ts   # E8 literal nuevo -> 0
  grep -cF "check(" backend-pet-tracker/src/db/schema/reminders.schema.ts   # config.checks -> 4 (R1 lo lleva a 7)
  ls backend-pet-tracker/src/db/migrations | grep -c '_reminders_recurrence\.sql$'   # migración propia -> 0
  ls backend-pet-tracker/src/db/migrations | grep -c '^0020_'   # 0020 libre -> 0
  grep -rlF "recurrence" backend-pet-tracker/src backend-pet-tracker/test | wc -l   # -> 0
  grep -rlF "sameLocalTimeOn" backend-pet-tracker/src | wc -l   # -> 0
  grep -rlF "ownerTimeZone" backend-pet-tracker/src | wc -l   # -> 0
  test -e backend-pet-tracker/src/modules/reminders/application/recurrence.ts; echo $?   # -> 1
  test -e backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.spec.ts; echo $?   # -> 1

Base de tests (T0), medida por el leader en H0 el 2026-10-26, con exit 0 y cero `FAIL`, desde backend-pet-tracker/:
  - `pnpm exec jest` (suite unitaria completa): Test Suites: 187 passed, 187 total; Tests: 1474 passed, 1474 total.
  - unitarios de la feature (el comando de arriba): Test Suites: 15 passed, 15 total; Tests: 142 passed, 142 total.
  - `pnpm exec jest --config ./test/jest-e2e.json pet-reminders`: Test Suites: 1 passed, 1 total; Tests: 33 passed, 33 total, contra pet_tracker_wt210, así que el entorno e2e funciona.
  - `pnpm exec jest --config ./test/jest-e2e.json alerts-center-notifier`: Tests: 20 passed, 20 total.
  Repítelas tú antes del primer commit (tasks.md regla 3) y regístralas. Al cerrar: suite completa 187 + 2 = 189 suites y 1474 + 99 = 1573 tests (los 99 `it` nuevos de la tabla de cifras: 2 + 34 + 46 + 2 + 8 + 1 + 6); pet-reminders 33 + 36 = 69; alerts-center-notifier 20. Ningún `it` se borra: E1–E8 enmiendan ocho `it` existentes sin cambiar la cuenta. Si un `it` que ya existía y no está en E1–E8 se pone rojo, es una regresión: se arregla el código, nunca el `it`.

Guardas que cruzan la cadena:
  - `git diff --name-only 705f1ea2 -- package.json pnpm-lock.yaml src/modules/pets src/pipeline src/modules/health src/modules/users src/audit src/modules/reminders/reminders.module.ts src/workers/notifier/notification-message.schema.ts src/workers/notifier/push-sender.ts src/app.module.ts src/main.ts test/alerts-center-notifier.e2e-spec.ts ../docs ../mobile-pet-tracker`, desde backend-pet-tracker/: vacío hasta C3; desde C4 solo `backend-pet-tracker/src/pipeline/local-day.ts`; desde C8 solo esa y `backend-pet-tracker/src/modules/pets/application/owner-local-day.ts`.
  - El contrato SQS #12 no cambia: A4 sigue en 1 al cerrar. El push de alerta sigue con `{ petId, alertId }`: A8 sigue en 1.
  - Al cerrar, desde la raíz del worktree: A3, A4, A7, A8, A9, A11 a A23, A25 y A26 siguen dando lo mismo (A18 sigue en 1: `export const EditReminderSchema = z` contiene el literal). A1, A2, A5 y A10 pasan a 0 porque cambian su firma o su lista (design § «Archivos afectados»). A24 pasa a 21. A6 no lo fija la spec: anota su cifra.
  - Al cerrar: `grep -cF "imports: [ConfigModule, UsersModule, RemindersModule, PetsModule]" backend-pet-tracker/src/workers/notifier/notifier.module.ts` → 1; `grep -cF "export const EditReminderSchema = z" backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.ts` → 1; `grep -cF "ponytail:" backend-pet-tracker/src/modules/reminders/application/recurrence.ts` → 1 (D5); `grep -rnF "Promise.resolve(false)" backend-pet-tracker/src/modules/reminders | wc -l` → 0; `grep -rnE "^\s+void [a-zA-Z]+;$" backend-pet-tracker/src/modules/reminders backend-pet-tracker/src/workers/notifier | wc -l` → 0 (era 0 en H0).
  - Tras C7, en cada fichero de E4, `grep -cF "recurrence: null,"` = su cifra de `new Reminder({` en ese momento (update 2, list 1, dispatch 5, notifier 1).
  - Tras C9: `grep -cF "'recurrenceUntil'," backend-pet-tracker/test/pet-reminders.e2e-spec.ts` → 1 (E3).
  - Tras C13, en reminders-dispatch.service.spec.ts, cada literal base de E2 → 0 y cada literal nuevo (`[first.id, first.scheduleName, NOW],`, `[second.id, second.scheduleName, NOW],`, `toHaveBeenCalledWith(sent.id, sent.scheduleName, NOW)`, `not.toHaveBeenCalledWith(failed.id, failed.scheduleName, NOW)`, `toEqual([[sent.id, sent.scheduleName, NOW]])`) → 1.
  - Tras C15: E1 literal base → 1 y E1 literal nuevo → 1; E5 literal base → 0 y E5 literal nuevo → 1.

Cierre (lo que el reporte debe traer):
  - Suite unitaria completa en verde (`pnpm exec jest`) con sus líneas `Test Suites:` y `Tests:` (189 y 1573).
  - E2E de la feature en verde (`pnpm exec jest --config ./test/jest-e2e.json pet-reminders`, 69) y `alerts-center-notifier` en verde (20), con `pgrep -f '[i]nit.sh'` vacío antes de cada una. La e2e completa la corre el leader con init.sh.
  - `pnpm exec tsc --noEmit -p tsconfig.json` y `pnpm exec eslint src/db/schema/reminders.schema.ts src/db/schema/reminders.schema.spec.ts src/modules/reminders src/workers/notifier src/modules/pets/application/owner-local-day.ts src/pipeline/local-day.ts test/pet-reminders.e2e-spec.ts`, los dos con exit 0.
  - `graphify update .` en la raíz del worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only 705f1ea2..HEAD -- backend-pet-tracker/ docs/`. Tiene que coincidir con la lista cerrada de arriba: 29 líneas (20 de producción y migración, 9 de tests) y ninguna de docs/; `specs/` y `progress/` no entran.
  - Reporte en progress/impl_reminders-recurrence.md: comprobación del primer comando, salida de las anclas, T0 repetida por ti, commits (hash y mensaje), línea `Tests:` unitaria y e2e tras cada commit, tabla «commit, test, rojo observado» con la línea del `expect` que falló (tasks.md regla 3), `it` y filas que nacieron verdes y por qué, las nueve mutaciones M1 a M9 (mutación, comando, exit code, `expect` rojo, reversión), el `.sql` generado (sus siete sentencias, resumidas), lint y typecheck, desviaciones, lo que quedó «pendiente de medir», y tabla R1-R14 a test a commit.
  - Última acción: crear progress/impl_reminders-recurrence.done con una sola línea, la ruta de progress/impl_reminders-recurrence.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).
