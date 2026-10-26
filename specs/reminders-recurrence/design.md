---
feature: "reminders-recurrence"
status: approved     # draft | approved
tags: [backend, reminders, notifier, migration]
---

# Diseño — [[reminders-recurrence]] (#210)

> Ver [[requirements]] para los requisitos (R1–R14) y las decisiones D1–D16, y
> [[../../docs/architecture|architecture]] para las reglas de capas. Este
> documento fija **dónde** vive cada pieza y **con qué nombre exacto**; no baja a
> código. `B` = `backend-pet-tracker`. Anclas A1–A26 en [[requirements]]
> §Contexto fijo.

## Decisiones técnicas

- **Modelo de datos (R1, D1, D3).** Cuatro columnas nullable en `reminders`;
  la serie entera vive en la fila del reminder, que se reprograma in situ. No hay
  tabla de ocurrencias ni historial (fuera de alcance).
- **Dominio puro (R4–R10).** La entidad gana `recurrence: ReminderRecurrence | null`.
  El cálculo de ocurrencias es una función pura en la capa application del
  módulo reminders (no domain: depende de `@/pipeline/local-day` y de
  `addCalendarMonths` de health, igual que `owner-local-day` cruza módulos en
  application). Sin dependencias nuevas: solo `Intl` de Node v24.
- **DST `compatible` (R8, D4).** Una sola función nueva exportada en
  `B/src/pipeline/local-day.ts`, `sameLocalTimeOn`, que reutiliza `offsetMsAt`
  (privada, A14). Algoritmo: `wall` = medianoche UTC de `day` + hora de pared de
  `anchorMs` en la zona (`(anchorMs + offsetMsAt(anchorMs)) mod 86 400 000`);
  candidatos `wall − offsetMsAt(wall − 86 400 000)` y
  `wall − offsetMsAt(wall + 86 400 000)`; se devuelve el menor candidato `c` que
  cumpla `c + offsetMsAt(c) === wall`; si ninguno cumple (hueco) se devuelve
  `wall − offsetMsAt(wall − 86 400 000)` (offset previo). Verificado contra las
  tablas R7, R8 y R10 con un prototipo de scratch (no versionado).
- **Validación en dos capas (R2, R3, D8).** zod en el DTO para la forma; reglas
  cruzadas en los use cases tras la autorización (R14). La zona del dueño solo
  se lee cuando el estado resultante tiene `recurrence` y `until` no null.
- **Reprogramación en el notifier (R11, D9).** Tras `sendPush`, la rama serie
  llama a `advanceOccurrence` (escritura condicional, R13) en lugar de
  `markSent`. El dispatcher no cambia salvo pasar el `scheduleName` a
  `markEnqueued` (R13, D11). La serie nunca pasa por `reschedule`.
- **`kind` en el push (R12, D13).** El notifier construye el `data` del push de
  reminder como `{ petId, reminderId, kind: 'reminder' }`; el `data` del mensaje
  SQS (contrato #12 congelado) no cambia. `sendPush` gana un 4.º parámetro
  `data` (por defecto `message.data`) para que la rama alerta siga idéntica.
- **Sin AWS real.** Todo corre con el dispatcher `setInterval` y SQS de
  LocalStack ya existentes. Ningún recurso, coste ni dependencia nuevos.

## Archivos afectados

Lista cerrada. Cualquier otro fichero de producción tocado es fuera de spec.

### Infraestructura de datos

- `B/src/db/schema/reminders.schema.ts` — columnas `recurrenceUnit: varchar('recurrence_unit', { length: 5 })`,
  `recurrenceEvery: integer('recurrence_every')`, `recurrenceUntil: date('recurrence_until')`
  (modo string por defecto, como `next_dose_at` en `health.schema.ts`; añadir
  `date` al import de `drizzle-orm/pg-core`), `recurrenceAnchorAt: timestamp('recurrence_anchor_at', { withTimezone: true })`;
  tres `check(...)` con los nombres y condiciones de R1 (orden en el array: tras
  `reminders_status_check`).
- `B/src/db/migrations/<NNNN>_reminders_recurrence.sql` + snapshot
  `meta/<NNNN>_snapshot.json` + entrada en `meta/_journal.json` — generados, nunca
  escritos a mano (§Migración).

### Domain

- `B/src/modules/reminders/domain/entities/reminder.entity.ts` —
  `export const RECURRENCE_UNITS = ['hour', 'day', 'week', 'month', 'year'] as const;`,
  `export type RecurrenceUnit = (typeof RECURRENCE_UNITS)[number];`,
  `export interface ReminderRecurrence { unit: RecurrenceUnit; every: number; anchorAt: Date; until: string | null }`;
  `ReminderProps.recurrence: ReminderRecurrence | null` (requerida) y el
  `readonly recurrence` correspondiente en la clase.
- `B/src/modules/reminders/domain/repositories/reminder.repository.ts` —
  `ReminderChanges` pasa a `Partial<Pick<ReminderProps, 'dueAt' | 'advanceMinutes' | 'title' | 'recurrence'>>`;
  `markEnqueued(id: string, scheduleName: string | null, at: Date): Promise<void>;`;
  nuevo `advanceOccurrence(id: string, scheduleName: string, dueAt: Date, newScheduleName: string): Promise<boolean>;`.
- `B/src/modules/reminders/domain/errors/reminder.errors.ts` —
  `export class InvalidRecurrenceError extends Error` (mismo patrón que
  `ReminderNotEditableError`, A22).

### Application

- `B/src/modules/reminders/application/recurrence.ts` (nuevo) —
  `export function assertValidRecurrence(dueAt: Date, recurrence: Pick<ReminderRecurrence, 'unit' | 'every'> | null, until: string | null, timeZone: string): void`
  (lanza `InvalidRecurrenceError`, R3) y
  `export function nextOccurrence(reminder: { dueAt: Date; advanceMinutes: number; recurrence: ReminderRecurrence }, now: Date, timeZone: string): Date | null`
  (R7–R10). Comentario `ponytail:` sobre la búsqueda lineal (D5). Importa
  `localDayOf`, `shiftDay`, `sameLocalTimeOn` de `@/pipeline/local-day` y
  `addCalendarMonths` de `@/modules/health/application/vaccine-date`.
- `B/src/modules/reminders/application/dto/reminder.dto.ts` —
  `export const RecurrenceSchema` = `z.discriminatedUnion('unit', [...])` de cinco
  `z.strictObject({ unit: z.literal('<u>'), every: z.number().int().min(1).max(<máx>) })`
  (límites R1/D2); `RecurrenceUntilSchema` = `z.string().refine(isCalendarDate)`.
  `CreateReminderSchema` gana `recurrence: RecurrenceSchema.nullable().optional()`
  y `recurrenceUntil: RecurrenceUntilSchema.nullable().optional()`;
  `EditReminderSchema` gana los mismos dos campos, conserva su `.refine` y pasa a
  `export const EditReminderSchema` (A18). `UpdateReminderSchema` no cambia de
  forma. Las rutas de issue de la tabla R2 están verificadas con el zod 4
  instalado.
- `B/src/modules/reminders/application/use-cases/create-reminder.use-case.ts` —
  el constructor gana `@Inject(PET_REPOSITORY) private readonly pets: PetRepository`;
  solo si `dto.recurrence` **y** `dto.recurrenceUntil` son no null lee la zona con
  `ownerTimeZone(await this.pets.findOwnerTimezone(petId), { scope: 'reminders-recurrence', petId })`;
  en cualquier otro caso no toca `pets` y usa `'UTC'` como argumento (la regla
  «until sin recurrence» no depende de la zona). Llama a `assertValidRecurrence`
  y crea con
  `recurrence: dto.recurrence ? { ...dto.recurrence, anchorAt: dueAt, until: dto.recurrenceUntil ?? null } : null`.
- `B/src/modules/reminders/application/use-cases/update-reminder.use-case.ts` —
  tras las comprobaciones actuales (existencia, membresía, owner, `scheduled`)
  y solo en la rama de edición: calcula la `recurrence` resultante con la tabla
  R6, llama a `assertValidRecurrence` si el body trae `dueAt`, `recurrence` o
  `recurrenceUntil`, y pasa `recurrence` en `ReminderChanges` solo en esos
  casos. La zona se lee igual que en create (ya inyecta `PET_REPOSITORY`).
- `B/src/modules/pets/application/owner-local-day.ts` —
  `export function ownerTimeZone(raw: string | null, context: Record<string, unknown>): string`
  extraída de `localDayInZone` (A13), que pasa a llamarla. Mismo warn y mismo
  fallback `'UTC'`.

### Infrastructure

- `B/src/pipeline/local-day.ts` — `export function sameLocalTimeOn(anchorMs: number, day: string, timeZone: string): number`.
- `B/src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts` —
  `toDomain` construye `recurrence` (null si `recurrenceUnit` es null; si no
  `{ unit, every, anchorAt, until }` desde las cuatro columnas); `create` y
  `reschedule` traducen `recurrence` a las cuatro columnas (null → las cuatro a
  null) y no pasan la clave `recurrence` a drizzle; `reschedule` solo toca las
  columnas de recurrencia si la clave `recurrence` está en `changes`.
  `markEnqueued` añade al `where` la condición
  `sql\`${reminders.scheduleName} is not distinct from ${scheduleName}\``
  (drizzle no tiene operador propio para `IS NOT DISTINCT FROM`);
  `advanceOccurrence` actualiza `dueAt`, `scheduleName`, `enqueuedAt: null` con
  `where id, status 'scheduled', scheduleName` y devuelve
  `rows.length === 1` (patrón de `markSent`).
- `B/src/modules/reminders/infrastructure/mappers/reminder.mapper.ts` —
  `ReminderResponse` gana `recurrence: { unit: RecurrenceUnit; every: number } | null`
  y `recurrenceUntil: string | null`; `toReminderResponse` copia solo `unit` y
  `every` (nunca `anchorAt`) y `recurrence?.until ?? null`.
- `B/src/modules/reminders/infrastructure/mappers/reminder-error.mapper.ts` —
  `InvalidRecurrenceError` → `new BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid recurrence' })`.
- `B/src/modules/reminders/infrastructure/reminders.controller.ts` — el POST
  pasa a envolver `create` en el mismo `try/catch` con `mapReminderError` que ya
  usa el PATCH (hoy el POST no lo necesita). Sin rutas nuevas.
- `B/src/modules/reminders/infrastructure/reminders-dispatch.service.ts` —
  `markEnqueued(reminder.id, reminder.scheduleName, new Date())` (A5).
- `B/src/workers/notifier/notifier-consumer.service.ts` — 6.º parámetro del
  constructor `@Inject(PET_REPOSITORY) private readonly pets?: PetRepository`;
  en `notifyReminder`, tras `sendPush(reminder.petId, message, messageId, { petId: message.data.petId, reminderId: message.data.reminderId, kind: 'reminder' })`:
  rama one-shot → `markSent` (A6); rama serie → `if (!this.pets) throw new Error('Pet repository unavailable')`,
  zona con `ownerTimeZone(await this.pets.findOwnerTimezone(reminder.petId), { scope: NOTIFIER_SCOPE, messageId, petId: reminder.petId })`,
  `nextOccurrence(reminder, new Date(), zona)`; `null` → `markSent`; si no →
  `advanceOccurrence(message.reminderId, message.scheduleName, next, \`reminder-${uuidv7()}\`)`
  y, si devuelve `false`, `logReminderSkipped(messageId, message.reminderId, 'stale_schedule')`.
  El tipo del `data` que recibe `PushSender.send` no cambia (A8: cast existente).
- `B/src/workers/notifier/notifier.module.ts` — `imports: [ConfigModule, UsersModule, RemindersModule, PetsModule]` (A10).
  `PetsModule` ya está en el grafo vía `RemindersModule` (A20); importarlo aquí
  solo expone `PET_REPOSITORY` al notifier.

### Tests (rutas exactas; nombres en [[requirements]] y [[tasks]])

- `B/src/db/schema/reminders.schema.spec.ts`
- `B/src/modules/reminders/application/recurrence.spec.ts` (nuevo)
- `B/src/modules/reminders/application/dto/reminder.dto.spec.ts`
- `B/src/modules/reminders/application/use-cases/create-reminder.use-case.spec.ts` (nuevo)
- `B/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts`
- `B/src/modules/reminders/application/use-cases/list-reminders.use-case.spec.ts` (solo fixture E4)
- `B/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts`
- `B/src/workers/notifier/notifier-consumer.service.spec.ts`
- `B/test/pet-reminders.e2e-spec.ts`

## Migración

Comando único, desde la raíz del repo:

```
pnpm -C backend-pet-tracker db:generate --name reminders_recurrence
```

En la base (`1316410f`) la última migración es `0019_pet_documents_uploaded_at`
(A24 = 20 entradas, A25), así que debería salir
`0020_reminders_recurrence.sql`. Los tests la localizan por la regex
`/^\d{4}_reminders_recurrence\.sql$/`, nunca por número. Requiere `.env` en la
raíz del repo con `DATABASE_URL`: `drizzle.config.ts` carga `../.env` y aborta
si falta.

**Si #211 o #212 mergean antes en `dev`** y traen su propia migración con el
mismo número, se aplica la receta común de regeneración (la misma de #211 y
#212), literal y en este orden:

1. `git merge origin/dev`. Nunca rebase: invalida los hashes de [[traceability]].
2. `git checkout origin/dev -- backend-pet-tracker/src/db/migrations/meta`
   (journal y snapshots quedan los de dev).
3. `git rm backend-pet-tracker/src/db/migrations/00NN_reminders_recurrence.sql`
   (00NN = número que tenga en ese momento).
4. `git diff --name-status origin/dev -- backend-pet-tracker/src/db/migrations | wc -l`
   debe dar `0`. Si no, queda un artefacto propio: restaurar con
   `git checkout origin/dev -- <ruta>` o borrarlo si dev no lo tiene.
5. `git commit --no-edit`, que cierra el merge.
6. `cd backend-pet-tracker && pnpm exec drizzle-kit generate --name reminders_recurrence`.
   Requiere `../.env` con `DATABASE_URL`, porque `drizzle.config.ts` lo carga.
   El `.sql` nuevo solo contiene las sentencias propias: cuatro
   `ALTER TABLE "reminders" ADD COLUMN` (`"recurrence_unit"`,
   `"recurrence_every"`, `"recurrence_until"`, `"recurrence_anchor_at"`) y tres
   `ALTER TABLE "reminders" ADD CONSTRAINT` (`"reminders_recurrence_unit_check"`,
   `"reminders_recurrence_every_check"`, `"reminders_recurrence_shape_check"`).
   Si trae cualquier otra tabla, PARAR.
7. `grep -cF '"tag"' src/db/migrations/meta/_journal.json` = cuenta de
   `origin/dev` + 1.
8. Commit propio `chore(reminders): regenerate migration after merging dev`
   (solo existe si hay colisión; queda fuera de la tabla C1–C20 de [[tasks]]).
9. Recrear la base del worktree antes del siguiente `db:migrate`:
   `docker exec pet-tracker-postgres psql -U pet_tracker -d postgres -c 'DROP DATABASE pet_tracker_wt210;'`,
   luego
   `docker exec pet-tracker-postgres psql -U pet_tracker -d postgres -c 'CREATE DATABASE pet_tracker_wt210 OWNER pet_tracker;'`
   y luego `pnpm run db:migrate`. Nunca psql crudo sobre el journal.
10. Volver a correr las suites unitaria y e2e.

**Nunca** se renumera a mano un fichero, un snapshot ni una entrada del journal.

## Evolución futura (no se implementa)

EventBridge Scheduler con `rate(<n> <unidad>)`/`cron(...)` sustituiría al
dispatcher `setInterval`: un schedule recurrente por serie, sin
`ActionAfterCompletion: DELETE`, con `ScheduleExpressionTimezone` = zona del
dueño (DST nativo) y `EndDate` derivado de `recurrenceUntil`. `month`/`year`
con día 29–31 no se expresan en `cron` sin clamp propio, así que el cálculo de
R7 seguiría siendo la fuente de verdad. Fuera de alcance (D16).

## Alternativas descartadas

- **`recurrence jsonb`** (plan §2): CHECKs ilegibles y sin rama nombrada en el
  error (D1).
- **RRULE (RFC 5545) o librería de fechas** (`rrule`, `luxon`, `date-fns-tz`):
  dependencia nueva para cinco unidades fijas; `Intl` cubre la zona.
- **Una fila por ocurrencia**: multiplica filas y obliga a un job que las
  materialice; editar la serie tocaría N filas.
- **Encadenar desde la ocurrencia anterior sin ancla**: deriva en fin de mes
  (31 → 28 → 28) y en huecos DST (R7, R8).
- **Reutilizar `reschedule` en el notifier**: incondicional sobre
  `schedule_name` y lanza en `toDomain` si la fila dejó de estar `scheduled`
  (D12).
- **`kind` en el `data` del productor SQS**: rompe el contrato #12 congelado y
  los mensajes en vuelo (D13).
- **Tope `advanceMinutes < intervalo`**: innecesario con la condición sobre el
  aviso de R9 (D6).
- **Recalcular en el dispatcher al encolar**: el dispatcher no sabe si el push
  salió; avanzar antes de enviar perdería la ocurrencia si el push falla.
