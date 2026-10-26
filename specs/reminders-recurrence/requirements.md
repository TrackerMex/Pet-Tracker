---
feature: "reminders-recurrence"
status: approved     # draft | approved
tags: [backend, reminders, notifier, migration]
---

# Requisitos — [[reminders-recurrence]] (#210)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[tasks]] para el orden de commits.

> **Base congelada**: `origin/main` `1316410f` (idéntico a `dev` al escribir).
> Toda ancla se cita por contenido con `grep -cF '<literal>' <ruta>` desde la
> raíz del repo, con la cifra medida en esa base. Si el árbol cambia antes de
> implementar, se re-mide la cifra; nunca se sustituye por números de línea.

> **Prefijo obligatorio**: todo `describe`/`it` **nuevo** de esta feature
> empieza por `#210 R<n>:` — los ficheros tocados ya tienen R-ids de #12, #16 y
> #47 (`docs/conventions.md` §Prefijo de feature cuando un fichero acumula R-ids
> de dos specs). Los `it` existentes que esta feature enmienda (lista cerrada
> E1–E8 de [[tasks]]) **conservan su nombre**: las trazabilidades de #16 y #47
> los citan.

## Contexto

Hoy un reminder es de un solo disparo: el dispatcher (`setInterval`) lo encola
en SQS (LocalStack) cuando `dueAt − advanceMinutes ≤ now`, el notifier pushea y
marca `sent`. #210 añade repetición — Una vez, cada N horas, Diario, Semanal,
Mensual, Anual — con fin opcional (`recurrenceUntil`), sin AWS real: la serie
avanza en el notifier tras cada push, reprogramando **la misma fila** a la
siguiente ocurrencia.

Glosario:

- **Serie**: reminder con `recurrence !== null`. **One-shot**: `recurrence`
  null (comportamiento #16 intacto).
- **Ancla** (`recurrence_anchor_at`): instante de la ocurrencia 0. La ocurrencia
  k se calcula siempre desde el ancla, nunca desde la anterior (D3).
- **Zona del dueño**: `users.timezone` del owner vía
  `PetRepository.findOwnerTimezone(petId)`; si es `null` o no está en el
  catálogo de `Intl`, `'UTC'` (mismo fallback que `localDayInZone`).
- **Aviso** de una ocurrencia `o`: el instante `o − advanceMinutes · 60 000 ms`
  (cuando el dispatcher la encola).

## Contexto fijo (anclas en la base)

`B` = `backend-pet-tracker`.

| # | Literal (`grep -cF`) | Archivo | Cifra |
|---|---|---|---|
| A1 | `async markEnqueued(id: string, at: Date): Promise<void>` | `B/src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts` | 1 |
| A2 | `markEnqueued(id: string, at: Date): Promise<void>;` | `B/src/modules/reminders/domain/repositories/reminder.repository.ts` | 1 |
| A3 | `export type ReminderChanges` | `B/src/modules/reminders/domain/repositories/reminder.repository.ts` | 1 |
| A4 | `data: { petId: reminder.petId, reminderId: reminder.id },` | `B/src/modules/reminders/infrastructure/reminders-dispatch.service.ts` | 1 |
| A5 | `await this.reminders.markEnqueued(reminder.id, new Date());` | `B/src/modules/reminders/infrastructure/reminders-dispatch.service.ts` | 1 |
| A6 | `await this.reminders.markSent(message.reminderId);` | `B/src/workers/notifier/notifier-consumer.service.ts` | 1 |
| A7 | `reminder.scheduleName !== message.scheduleName` | `B/src/workers/notifier/notifier-consumer.service.ts` | 1 |
| A8 | `data: message.data as { petId: string; alertId: string }` | `B/src/workers/notifier/notifier-consumer.service.ts` | 1 |
| A9 | `Reenviar un push repetido es preferible a perderlo` | `B/src/workers/notifier/notifier-consumer.service.ts` | 1 |
| A10 | `imports: [ConfigModule, UsersModule, RemindersModule]` | `B/src/workers/notifier/notifier.module.ts` | 1 |
| A11 | `export function addCalendarMonths(date: string, months: number): string` | `B/src/modules/health/application/vaccine-date.ts` | 1 |
| A12 | `findOwnerTimezone(petId: string): Promise<string \| null>;` | `B/src/modules/pets/domain/repositories/pet.repository.ts` | 1 |
| A13 | `export function localDayInZone(` | `B/src/modules/pets/application/owner-local-day.ts` | 1 |
| A14 | `function offsetMsAt(tsMs: number, timeZone: string): number` | `B/src/pipeline/local-day.ts` | 1 |
| A15 | `export function shiftDay(day: string, days: number): string` | `B/src/pipeline/local-day.ts` | 1 |
| A16 | `export function isCalendarDate(value: string): boolean` | `B/src/pipeline/local-day.ts` | 1 |
| A17 | `export const CreateReminderSchema` | `B/src/modules/reminders/application/dto/reminder.dto.ts` | 1 |
| A18 | `const EditReminderSchema = z` (hoy sin `export`) | `B/src/modules/reminders/application/dto/reminder.dto.ts` | 1 |
| A19 | `export interface ReminderResponse` | `B/src/modules/reminders/infrastructure/mappers/reminder.mapper.ts` | 1 |
| A20 | `imports: [ConfigModule, PetsModule]` | `B/src/modules/reminders/reminders.module.ts` | 1 |
| A21 | `` scheduleName: `reminder-${uuidv7()}` `` | `B/src/modules/reminders/application/use-cases/create-reminder.use-case.ts` | 1 |
| A22 | `export class ReminderNotEditableError` | `B/src/modules/reminders/domain/errors/reminder.errors.ts` | 1 |
| A23 | `between 0 and 10080` | `B/src/db/schema/reminders.schema.ts` | 1 |
| A24 | `"tag"` | `B/src/db/migrations/meta/_journal.json` | 20 |
| A25 | `0019_pet_documents_uploaded_at` | `B/src/db/migrations/meta/_journal.json` | 1 |
| A26 | `reminders: body as Reminder[]` | `mobile-pet-tracker/src/api/reminders.ts` | 1 |

A12: el `\|` es escape de tabla; el literal lleva `|`.

A26: el móvil castea sin parseo estricto, así que las claves nuevas del GET no
lo rompen (las consumirá #213).

## Requisitos funcionales

### R1 — Columnas, CHECKs y migración aditiva

THE SYSTEM SHALL añadir a `reminders` cuatro columnas nullable —
`recurrence_unit varchar(5)`, `recurrence_every integer`, `recurrence_until date`,
`recurrence_anchor_at timestamptz` — y tres CHECKs con estos nombres y esta
semántica exacta:

| CHECK | Condición |
|---|---|
| `reminders_recurrence_unit_check` | `recurrence_unit in ('hour','day','week','month','year')` (null → pasa) |
| `reminders_recurrence_every_check` | `case recurrence_unit when 'hour' then recurrence_every between 1 and 24 when 'day' then recurrence_every between 1 and 365 when 'week' then recurrence_every between 1 and 52 when 'month' then recurrence_every between 1 and 12 when 'year' then recurrence_every between 1 and 10 else true end` |
| `reminders_recurrence_shape_check` | o las cuatro columnas son null, o `recurrence_unit`, `recurrence_every` y `recurrence_anchor_at` son no-null (`recurrence_until` opcional solo en ese caso) |

WHEN se inserta una fila que viola una sola rama THE SYSTEM SHALL rechazarla
con `cause.code '23514'` y `cause.constraint` = el nombre de esa rama; WHEN la
fila está en el límite aceptado THE SYSTEM SHALL insertarla. Filas exactas
(`it.each`, una fila por rama, cada una viola un único CHECK — Postgres evalúa
los CHECKs por orden alfabético de nombre):

| Fila | unit / every / anchor / until | Esperado |
|---|---|---|
| unidad desconocida | `'minute'` / 1 / now / null | `reminders_recurrence_unit_check` |
| `<u>` bajo mínimo, una fila por unidad | `'<u>'` / 0 / now / null | `reminders_recurrence_every_check` |
| `<u>` sobre máximo, una fila por unidad | `'hour'` 25, `'day'` 366, `'week'` 53, `'month'` 13, `'year'` 11 / now / null | `reminders_recurrence_every_check` |
| `<u>` en mínimo y máximo, dos filas por unidad | `'<u>'` / 1 y 24·365·52·12·10 / now / null | se inserta |
| serie sin ancla | `'day'` / 1 / null / null | `reminders_recurrence_shape_check` |
| until sin serie | null / null / null / `'2027-01-01'` | `reminders_recurrence_shape_check` |
| every sin unidad | null / 3 / now / null | `reminders_recurrence_shape_check` |
| unidad sin every | `'week'` / null / now / null | `reminders_recurrence_shape_check` |
| serie completa con until | `'month'` / 6 / now / `'2027-01-01'` | se inserta |

La migración es un fichero **nuevo** cuyo nombre cumple
`/^\d{4}_reminders_recurrence\.sql$/`, que contiene solo
`ALTER TABLE "reminders" ADD COLUMN` y `ALTER TABLE "reminders" ADD CONSTRAINT`
(ningún `DROP`, ningún `ALTER TABLE` de otra tabla).

Tests: `backend-pet-tracker/src/db/schema/reminders.schema.spec.ts` ::
`#210 R1: declara las cuatro columnas nullable y los tres CHECKs de recurrencia`
(tipo SQL exacto de cada columna con `getSQLType()`: `varchar(5)`, `integer`,
`date`, `timestamp with time zone`; `notNull` false; los tres nombres presentes
y `config.checks` de longitud 7) y
`#210 R1: genera una migracion reminders_recurrence solo aditiva`;
`backend-pet-tracker/test/pet-reminders.e2e-spec.ts` :: `#210 R1: CHECK %s`.
El `it` existente `declara los CHECKs, FKs e indices exactos` usa
`expect.arrayContaining`: no se enmienda. El `it` existente `exporta reminders
con las columnas, tipos y nulabilidad aprobados` compara la lista exacta de
columnas: se enmienda (E8 de [[tasks]]).

### R2 — Validación zod de `recurrence` y `recurrenceUntil`

WHEN `POST /v1/pets/:petId/reminders` o `PATCH /v1/reminders/:id` recibe
`recurrence` THE SYSTEM SHALL aceptarlo solo como `null` o como objeto estricto
`{ unit, every }` con `unit ∈ hour|day|week|month|year` y `every` entero en los
límites de R1 para esa unidad; y `recurrenceUntil` solo como `null` o fecha de
calendario real `YYYY-MM-DD` (`isCalendarDate`). En otro caso, 400
`Validation failed` con el issue en este `path` (zod 4, verificado en la base):

| Body (dentro de un POST válido, o como único campo de un PATCH de edición) | `path` del issue |
|---|---|
| `recurrence: { unit: '<u>', every: 0 }`, una fila por unidad | `recurrence.every` |
| `recurrence: { unit: '<u>', every: <máx+1> }`, una fila por unidad | `recurrence.every` |
| `recurrence: { unit: 'day', every: 1.5 }` | `recurrence.every` |
| `recurrence: { unit: 'minute', every: 1 }` | `recurrence.unit` |
| `recurrence: { unit: 'day' }` | `recurrence.every` |
| `recurrence: { unit: 'day', every: 1, until: '2027-01-01' }` | `recurrence` |
| `recurrence: 'day'` | `recurrence` |
| `recurrenceUntil: '2026-02-30'` | `recurrenceUntil` |
| `recurrenceUntil: '2026-11-01T00:00:00Z'` | `recurrenceUntil` |

WHEN `every` es el mínimo o el máximo de su unidad THE SYSTEM SHALL aceptarlo.
En POST, `recurrence` ausente y `recurrence: null` son equivalentes (one-shot).
En PATCH, `{ recurrence: null }` y `{ recurrenceUntil: null }` satisfacen por sí
solos el «al menos un campo» existente.

Tests: `backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.spec.ts` ::
`#210 R2: POST rechaza %s en %s`, `#210 R2: POST acepta every en el limite %s`,
`#210 R2: POST trata recurrence null como ausente`,
`#210 R2: PATCH de edicion rechaza %s en %s` (sobre `EditReminderSchema`),
`#210 R2: PATCH acepta recurrence y recurrenceUntil null y validos`
(sobre `UpdateReminderSchema`).

### R3 — Reglas cruzadas de la serie

IF el estado resultante (POST: el body; PATCH: la fila fusionada con el body
según R6, evaluado solo cuando el body trae `dueAt`, `recurrence` o
`recurrenceUntil`) tiene `recurrenceUntil !== null` y `recurrence === null`,
o `recurrenceUntil` < `localDayOf(dueAt, zona del dueño)`, THEN THE SYSTEM SHALL
lanzar `InvalidRecurrenceError`, que el controller traduce a 400 con body exacto
`{ statusCode: 400, message: 'Invalid recurrence' }` sin escribir. `recurrenceUntil`
igual al día local de `dueAt` es válido.

Tests: `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts` ::
`#210 R3: assertValidRecurrence %s` con estas filas:

| Fila | dueAt | recurrence | until | zona | Esperado |
|---|---|---|---|---|---|
| until sin recurrence | `2026-11-01T15:00:00.000Z` | null | `'2026-12-01'` | UTC | lanza |
| until el día anterior | `2026-11-01T15:00:00.000Z` | day 1 | `'2026-10-31'` | UTC | lanza |
| until el mismo día local | `2026-11-01T15:00:00.000Z` | day 1 | `'2026-11-01'` | UTC | no lanza |
| zona del dueño decide (MX) | `2026-11-02T03:00:00.000Z` | day 1 | `'2026-11-01'` | America/Mexico_City | no lanza |
| zona del dueño decide (UTC) | `2026-11-02T03:00:00.000Z` | day 1 | `'2026-11-01'` | UTC | lanza |
| serie sin until | `2026-11-01T15:00:00.000Z` | day 1 | null | UTC | no lanza |

y `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` ::
`#210 R3: POST con recurrenceUntil sin recurrence responde 400 sin insertar`,
`#210 R3: PATCH que deja until antes de dueAt responde 400 sin cambiar la fila`.

### R4 — POST persiste la serie con su ancla

WHEN un POST válido trae `recurrence: { unit, every }` THE SYSTEM SHALL insertar
la fila con `recurrence_unit = unit`, `recurrence_every = every`,
`recurrence_until` = el del body o null, `recurrence_anchor_at = dueAt`, `status
'scheduled'`, `schedule_name` `reminder-<uuidv7>` y `enqueued_at null`. WHEN
`recurrence` falta o es null THE SYSTEM SHALL dejar las cuatro columnas null.

Tests: `backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.spec.ts`
(nuevo) :: `#210 R4: crea la serie con anchorAt igual a dueAt`,
`#210 R4: sin recurrence crea recurrence null y no consulta la zona`;
`backend-pet-tracker/test/pet-reminders.e2e-spec.ts` ::
`#210 R4: POST con recurrence guarda las cuatro columnas`.

### R5 — Shape de respuesta

THE SYSTEM SHALL devolver cada reminder (GET lista, POST 201, PATCH 200) con
exactamente las claves `id, petId, type, title, dueAt, advanceMinutes, status,
recurrence, recurrenceUntil`; `recurrence` = `{ unit, every }` (sin más claves)
o `null`; `recurrenceUntil` = `'YYYY-MM-DD'` o `null`. THE SYSTEM SHALL NOT
exponer `anchorAt`. El `dueAt` de una serie es su siguiente ocurrencia pendiente.

Test: `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` ::
`#210 R5: GET POST y PATCH devuelven recurrence y recurrenceUntil sin el ancla`
(`toEqual` exacto sobre una serie y sobre un one-shot).

### R6 — PATCH sobre una serie

WHEN un PATCH de edición válido llega a una fila `scheduled` THE SYSTEM SHALL
producir este estado de las columnas de recurrencia:

| Body (campos de recurrencia) | Estado resultante |
|---|---|
| `recurrence: { unit, every }` | unit/every nuevos; `anchorAt` = `dueAt` resultante (el del body si viene, si no el actual); `until` se conserva salvo que venga `recurrenceUntil` |
| `recurrence: null` | las cuatro columnas null (también `until`) |
| `recurrenceUntil: 'D'` sobre serie | `until = D`; unit/every/anchorAt intactos |
| `recurrenceUntil: null` sobre serie | `until = null`; unit/every/anchorAt intactos |
| `dueAt` sobre serie, sin `recurrence` | `anchorAt` = nuevo `dueAt`; unit/every/until intactos |
| solo `title` y/o `advanceMinutes` sobre serie | `ReminderChanges` sin clave `recurrence`: columnas intactas |
| `recurrenceUntil: 'D'` sobre one-shot sin `recurrence` | 400 `Invalid recurrence` (R3) |
| `recurrence: null` + `recurrenceUntil: 'D'` | 400 `Invalid recurrence` (R3) |

Toda edición sigue generando `scheduleName` nuevo y `enqueuedAt` null (#16).
`{ status: 'cancelled' }` cancela la serie entera (no hay más pushes). Una fila
no `scheduled` sigue respondiendo 409 `Reminder is not editable`.

Tests: `backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts` ::
`#210 R6: PATCH %s` (una fila por línea de la tabla);
`backend-pet-tracker/test/pet-reminders.e2e-spec.ts` ::
`#210 R6: PATCH reancla, conserva y limpia columnas de la serie`.

### R7 — Ocurrencias por unidad

`nextOccurrence` calcula la ocurrencia k (k ≥ 1) desde el ancla `A`, con
`Z` = zona, `dayA = localDayOf(A, Z)` y la hora de pared local de `A`:

| unit | ocurrencia k |
|---|---|
| `hour` | `A + k · every · 3 600 000 ms` (absoluta, sin zona) |
| `day` | día `shiftDay(dayA, k · every)` a la hora de pared de `A` |
| `week` | día `shiftDay(dayA, 7 · k · every)` a la hora de pared de `A` |
| `month` | día `addCalendarMonths(dayA, k · every)` a la hora de pared de `A` |
| `year` | día `addCalendarMonths(dayA, 12 · k · every)` a la hora de pared de `A` |

THE SYSTEM SHALL devolver exactamente estos valores (todas las filas con
`advanceMinutes 60` y `now = dueAt − 60 min`, el instante en que el notifier
procesa un aviso puntual):

| unit/every | Zona | anchorAt | dueAt | Resultado |
|---|---|---|---|---|
| hour 8 | UTC | `2026-12-31T20:00:00.000Z` | = anchorAt | `2027-01-01T04:00:00.000Z` |
| day 1 | UTC | `2026-12-31T09:00:00.000Z` | = anchorAt | `2027-01-01T09:00:00.000Z` |
| day 3 | America/Mexico_City | `2026-01-30T15:00:00.000Z` | = anchorAt | `2026-02-02T15:00:00.000Z` |
| week 2 | UTC | `2026-12-24T15:00:00.000Z` | = anchorAt | `2027-01-07T15:00:00.000Z` |
| month 1 | UTC | `2026-01-31T15:00:00.000Z` | = anchorAt | `2026-02-28T15:00:00.000Z` |
| month 1 | UTC | `2026-01-31T15:00:00.000Z` | `2026-02-28T15:00:00.000Z` | `2026-03-31T15:00:00.000Z` |
| month 1 | UTC | `2026-01-31T15:00:00.000Z` | `2026-03-31T15:00:00.000Z` | `2026-04-30T15:00:00.000Z` |
| month 2 | UTC | `2026-12-31T15:00:00.000Z` | = anchorAt | `2027-02-28T15:00:00.000Z` |
| year 1 | UTC | `2028-02-29T15:00:00.000Z` | = anchorAt | `2029-02-28T15:00:00.000Z` |
| year 1 | UTC | `2028-02-29T15:00:00.000Z` | `2031-02-28T15:00:00.000Z` | `2032-02-29T15:00:00.000Z` |
| year 3 | UTC | `2026-12-31T15:00:00.000Z` | = anchorAt | `2029-12-31T15:00:00.000Z` |

Las filas month «28 feb → 31 mar → 30 abr» y year «2031 → 2032-02-29» fijan el
cálculo desde el ancla (encadenar desde la anterior daría 28 mar y 2032-02-28).

Test: `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts` ::
`#210 R7: %s %s desde %s da %s`.

### R8 — Hora local del dueño y DST

THE SYSTEM SHALL conservar en `day|week|month|year` la hora de pared local del
ancla en la zona del dueño, resolviendo DST como `compatible`: en un hueco (hora
inexistente) se aplica el offset previo a la transición (la hora avanza la
longitud del hueco); en un solape (hora doble) se elige el instante más
temprano. `hour` es absoluta. Mismas condiciones que R7:

| unit/every | Zona | anchorAt | dueAt | Resultado | Motivo |
|---|---|---|---|---|---|
| day 1 | America/New_York | `2026-03-07T15:00:00.000Z` | = anchorAt | `2026-03-08T14:00:00.000Z` | 10:00 EST → 10:00 EDT (+23 h) |
| day 1 | America/New_York | `2026-10-31T14:00:00.000Z` | = anchorAt | `2026-11-01T15:00:00.000Z` | 10:00 EDT → 10:00 EST (+25 h) |
| day 1 | America/Mexico_City | `2026-03-07T16:00:00.000Z` | = anchorAt | `2026-03-08T16:00:00.000Z` | sin DST (+24 h) |
| day 1 | America/New_York | `2026-03-07T07:30:00.000Z` | = anchorAt | `2026-03-08T07:30:00.000Z` | 02:30 no existe el 8 → 03:30 EDT |
| day 1 | America/New_York | `2026-03-07T07:30:00.000Z` | `2026-03-08T07:30:00.000Z` | `2026-03-09T06:30:00.000Z` | el ancla devuelve a 02:30 EDT |
| day 1 | America/New_York | `2026-10-31T05:30:00.000Z` | = anchorAt | `2026-11-01T05:30:00.000Z` | 01:30 doble → la EDT (temprana) |
| hour 1 | America/New_York | `2026-11-01T05:30:00.000Z` | = anchorAt | `2026-11-01T06:30:00.000Z` | absoluta: 01:30 EDT → 01:30 EST |
| hour 24 | America/New_York | `2026-03-07T15:00:00.000Z` | = anchorAt | `2026-03-08T15:00:00.000Z` | absoluta, ≠ day 1 |
| month 1 | America/Mexico_City | `2026-01-31T05:30:00.000Z` | = anchorAt | `2026-03-01T05:30:00.000Z` | 30 ene 23:30 CST → 28 feb 23:30 CST |

Transiciones de 2026 medidas con `Intl` en Node v24: America/New_York pasa de
−5 a −4 en `2026-03-08T07:00:00Z` y de −4 a −5 en `2026-11-01T06:00:00Z`;
America/Mexico_City es −6 todo el año.

Test: `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts` ::
`#210 R8: %s %s en %s desde %s da %s`.

### R9 — Primera ocurrencia futura, sin ráfaga

THE SYSTEM SHALL devolver la ocurrencia `k*` = el menor k ≥ 1 con
`occ(k) > dueAt` **y** `occ(k) − advanceMinutes · 60 000 > now` (estricto). Tras
una caída se saltan las ocurrencias cuyo aviso ya pasó: solo sale el push
tardío de la ocurrencia vencida (comportamiento #16) y ninguno más. Todas en UTC:

| unit/every | advanceMinutes | anchorAt = dueAt | now | Resultado |
|---|---|---|---|---|
| day 1 | 60 | `2026-12-25T09:00:00.000Z` | `2027-01-04T12:00:00.000Z` | `2027-01-05T09:00:00.000Z` |
| hour 1 | 30 | `2026-12-31T22:00:00.000Z` | `2027-01-01T00:40:00.000Z` | `2027-01-01T02:00:00.000Z` |
| hour 1 | 30 | `2026-12-31T22:00:00.000Z` | `2026-12-31T22:30:00.000Z` | `2027-01-01T00:00:00.000Z` |
| day 1 | 10080 | `2026-12-25T09:00:00.000Z` | `2026-12-18T09:00:00.000Z` | `2026-12-26T09:00:00.000Z` |

Fila 2: `01:00` es posterior a `now` pero su aviso (`00:30`) no, así que se
salta. Fila 3: el aviso de `23:00` es igual a `now` y no cuenta. Fila 4: un
`advanceMinutes` mayor que el intervalo no salta ocurrencias (D6).

Test: `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts` ::
`#210 R9: %s`.

### R10 — `recurrenceUntil` inclusivo en el día local del dueño

IF `recurrence.until !== null` y `localDayOf(k*, zona) > until` THEN
`nextOccurrence` SHALL devolver `null` (la serie termina); en otro caso devuelve
`k*`. Todas con day 2, `advanceMinutes 60`, `anchorAt = dueAt =
2026-10-31T03:00:00.000Z`, `now = dueAt − 60 min`:

| Zona | until | Resultado |
|---|---|---|
| America/Mexico_City | `'2026-11-01'` | `2026-11-02T03:00:00.000Z` (día local 1 nov = until: incluido) |
| America/Mexico_City | `'2026-10-31'` | `null` |
| UTC | `'2026-11-01'` | `null` (día local UTC 2 nov) |
| America/Mexico_City | `null` | `2026-11-02T03:00:00.000Z` |

Test: `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts` ::
`#210 R10: until %s en %s da %s`.

### R11 — El notifier avanza la serie tras el push

WHEN el notifier procesa un mensaje `reminder` no saltado (`not_found`,
`not_scheduled`, `stale_schedule` sin cambios) y el push termina sin excepción
THE SYSTEM SHALL escribir según la rama, y borrar el mensaje en las tres:

| Rama | Escribe | No llama |
|---|---|---|
| `reminder.recurrence === null` | `markSent(reminderId)` | `advanceOccurrence` |
| serie y `nextOccurrence(...) !== null` | `advanceOccurrence(reminderId, message.scheduleName, next, 'reminder-<uuidv7>')` | `markSent` |
| serie y `nextOccurrence(...) === null` | `markSent(reminderId)` | `advanceOccurrence` |

`nextOccurrence` recibe `now = new Date()` y la zona del dueño
(`findOwnerTimezone(reminder.petId)`, `'UTC'` si es null o no IANA). IF el push
lanza THEN no se escribe nada y el mensaje no se borra (sin cambios).

Tests: `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts` ::
`#210 R11: serie avanza con advanceOccurrence y no marca sent`,
`#210 R11: serie pasada de until marca sent y no avanza`,
`#210 R11: zona %s da la siguiente ocurrencia %s` — filas, todas con day 1,
`anchorAt = dueAt = 2026-03-07T15:00:00.000Z`, `advanceMinutes 60` y reloj en
`2026-03-07T14:00:00.000Z`: `'America/New_York'` → `2026-03-08T14:00:00.000Z`;
`null` → `2026-03-08T15:00:00.000Z`; `'Mars/Base'` → `2026-03-08T15:00:00.000Z`.
`backend-pet-tracker/test/pet-reminders.e2e-spec.ts` ::
`#210 R11: una serie diaria vuelve a scheduled en la siguiente ocurrencia sin duplicar push`,
`#210 R11: una serie con until en su dia termina en sent`.

### R12 — `data` del push de reminder con `kind`

WHEN el notifier envía el push de un reminder THE SYSTEM SHALL pasar a
`PushSender.send` un `data` igual a `{ petId, reminderId, kind: 'reminder' }`
(sin más claves). El contrato SQS #12 no cambia: el dispatcher sigue publicando
`data: { petId, reminderId }` (A4) y el push de alerta sigue con
`{ petId, alertId }`.

Tests: `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts` ::
`#210 R12: el push de reminder lleva kind en data` (+ enmiendas E1);
`backend-pet-tracker/test/pet-reminders.e2e-spec.ts` (enmienda E5).

### R13 — Escrituras condicionadas a `schedule_name`

THE SYSTEM SHALL:

- `markEnqueued(id, scheduleName, at)`: escribir `enqueued_at` solo
  `WHERE id = $id AND schedule_name IS NOT DISTINCT FROM $scheduleName`; el
  dispatcher pasa el `reminder.scheduleName` que acaba de publicar.
- `advanceOccurrence(id, scheduleName, dueAt, newScheduleName)`: poner
  `due_at = dueAt`, `schedule_name = newScheduleName`, `enqueued_at = null` solo
  `WHERE id = $id AND status = 'scheduled' AND schedule_name = $scheduleName`;
  devolver `true` si y solo si actualizó una fila.
- WHEN `advanceOccurrence` devuelve `false`, registrar
  `skipped: 'stale_schedule'`, borrar el mensaje y no lanzar.

Tests: `backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts`
(enmiendas E2); `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts` ::
`#210 R13: advanceOccurrence false registra stale_schedule y borra el mensaje`;
`backend-pet-tracker/test/pet-reminders.e2e-spec.ts` ::
`#210 R13: markEnqueued con scheduleName viejo no toca enqueued_at`,
`#210 R13: advanceOccurrence solo avanza la fila con su scheduleName y scheduled`.

### R14 — 404 opaco con cuerpos de recurrencia

WHEN un PATCH con `recurrence` o `recurrenceUntil` se dirige a un reminder de una
mascota donde el usuario no es miembro activo THE SYSTEM SHALL responder 404 con
el mismo status y body que un id inexistente, aunque el body viole R3: la regla
cruzada se evalúa **después** de la autorización. La validación zod (R2) no
depende de la existencia del recurso y sigue respondiendo 400 antes de buscar
(sin cambios).

Test: `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` ::
`#210 R14: PATCH con recurrenceUntil invalido sobre reminder ajeno responde el mismo 404`
(compara status y body contra un UUID inexistente con el mismo body).

## Decisiones

- **D1 — Columnas nativas, no jsonb.** Se desvía del plan §2 (`recurrence jsonb`):
  un CHECK sobre jsonb exige `jsonb_typeof`, regex y `CASE` porque Postgres no
  cortocircuita casts; con columnas los CHECKs de R1 son triviales y el error
  nombra la rama. La API sigue exponiendo `{ unit, every }`.
- **D2 — Límites de `every`.** hour 1..24 (medicación; más de 24 h se expresa
  en day, «cada 36 h» fuera de alcance); day 1..365; week 1..52; month 1..12
  (semestral = 6); year 1..10 (vacunas cada 1–3 años; 10 rechaza basura). Las
  unidades de calendario topan en un año salvo `year`. La BD los repite (R1).
- **D3 — Ancla persistida.** `recurrence_anchor_at` = `dueAt` al crear; se
  reancla en PATCH de `dueAt` o `recurrence` (R6); no se expone (R5). Evita la
  deriva de fin de mes (31 → 28 → 31 → 30, R7) y la de huecos DST (R8). Si el
  dueño cambia de zona, las ocurrencias siguientes reinterpretan el mismo
  instante ancla en la zona nueva — aceptado y documentado.
- **D4 — Fórmula por unidad** (R7): reutiliza `shiftDay`, `localDayOf` y
  `addCalendarMonths` (que ya clampa al último día del mes y cubre el 29 feb).
  El resolutor DST `compatible` es una sola función nueva en `local-day.ts` que
  reutiliza `offsetMsAt` (privada, A14).
- **D5 — Primera ocurrencia futura** (R9) por búsqueda lineal desde k = 1.
  Techo: ~3650 iteraciones (serie diaria de 10 años, ~4 llamadas `Intl` cada
  una) u ~8760 por año de caída en `hour` (sin `Intl`). Comentario `ponytail:`
  con el techo y la mejora (saltar k por división en `hour`/`day`).
- **D6 — Sin tope extra de `advanceMinutes` en series.** La condición sobre el
  aviso en R9 deja siempre la siguiente ocurrencia en el futuro: un
  `advanceMinutes` mayor que el intervalo no salta ocurrencias (R9 fila 4) y cada
  push anuncia su propia ocurrencia. El CHECK `0..10080` existente (A23) sigue.
  Qué opciones ofrece la UI lo decide #213.
- **D7 — `until`**: `'YYYY-MM-DD'` inclusivo, comparado con el día local de la
  ocurrencia en la zona del dueño (R10). Validación: `until ≥ localDayOf(dueAt)`
  y `until` exige `recurrence` (R3). Serie pasada de `until` → `sent`.
- **D8 — Dónde se valida.** zod (R2): forma, límites por unidad con
  `discriminatedUnion('unit', …)` e `isCalendarDate`. Use cases (R3): reglas
  cruzadas sobre el estado fusionado con `assertValidRecurrence`, que lanza
  `InvalidRecurrenceError` → 400. La zona solo se consulta cuando el estado
  resultante tiene `recurrence` y `until` no null (única regla que la necesita;
  «until sin recurrence» se rechaza sin leerla, con `'UTC'` como argumento): los stubs de
  PATCH existentes no cambian y un POST sin `until` no toca `pets`.
  `CreateReminderUseCase` pasa a inyectar `PET_REPOSITORY`.
- **D9 — Dónde se reprograma.** En `notifyReminder`, después de `sendPush` (R11).
  La función pura vive en `backend-pet-tracker/src/modules/reminders/application/recurrence.ts`.
  El notifier recibe `PET_REPOSITORY` como 6.º parámetro opcional y
  `NotifierModule` importa `PetsModule`. El fallback de zona se extrae a
  `ownerTimeZone(raw, context)` en `owner-local-day.ts` y `localDayInZone` pasa a
  usarlo (un solo sitio con el warn).
- **D10 — Push duplicado: aceptado (at-least-once).** El único duplicado es un
  crash entre el push y la escritura en BD — igual que hoy y coherente con A9.
  Una reentrega tras avanzar la serie cae en `stale_schedule` (A7): sin segundo
  push.
- **D11 — Carrera de `markEnqueued`: cerrada.** Si el notifier avanzaba la serie
  antes del `markEnqueued` del dispatcher, este marcaba `enqueued_at` sobre la
  ocurrencia nueva y la serie moría en silencio (hoy pasa igual con un PATCH).
  La escritura queda condicionada a `schedule_name` (R13); `IS NOT DISTINCT FROM`
  porque la columna es nullable.
- **D12 — Carrera PATCH/cancel durante el push de una serie: cerrada.**
  `advanceOccurrence` es condicional (R13): un PATCH o cancel concurrente gana y
  el notifier registra `stale_schedule`. No se usa `reschedule` (incondicional
  sobre `schedule_name`, y revienta en `toDomain` si la fila dejó de estar
  `scheduled`). La misma carrera en `markSent` de one-shot (#16) queda fuera.
- **D13 — `kind` en `data`** (R12): se añade al construir el push en el
  notifier; el contrato SQS congelado no cambia y los mensajes en vuelo siguen
  valiendo. #213 enruta el tap con `data.kind` + `data.reminderId`.
- **D14 — Respuestas** (R5): claves nuevas `null` en one-shot. Una serie sigue
  `scheduled` hasta cancelarse o pasar de `until`.
- **D15 — Migración.** `pnpm -C backend-pet-tracker db:generate --name reminders_recurrence`
  (hoy debería dar `0020_reminders_recurrence.sql`: la última es `0019`, A24/A25).
  Los tests la encuentran por sufijo, nunca por número. Si #211 o #212 mergean
  antes en `dev`, se regenera con el procedimiento de [[design]] §Migración.
  **Nunca** se renumera a mano ni se rebasea.
- **D16 — EventBridge Scheduler** (`rate()`/`cron()`) es evolución futura, no se
  implementa ([[design]] §Evolución futura).

## Fuera de alcance

- UI móvil de repetición y enrutado del tap (#213).
- EventBridge Scheduler y cualquier recurso AWS real.
- Fin de serie tras N ocurrencias.
- Días de semana sueltos (lunes/miércoles/viernes), RRULE.
- Editar o saltar una sola ocurrencia; historial por ocurrencia.
- Intervalos de más de 24 h en horas (36 h).
- `kind` en el `data` del push de alerta.
- La carrera de `markSent` en one-shot (#16).
- Reanclar la serie cuando el dueño cambia de zona (D3).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-26) ← gate obligatorio antes de implementar
