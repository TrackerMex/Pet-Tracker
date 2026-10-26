---
feature: "reminders-recurrence"
status: draft        # draft | approved
tags: [backend, reminders, notifier, migration]
---

# Tareas — [[reminders-recurrence]] (#210)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Símbolos y rutas exactos
> en [[design]] §Archivos afectados.

## Reglas de la cadena (Codex)

1. **Rojo antes que verde, en commits separados.** Cada R-id abre con un commit
   `test(reminders): #210 R<n> <desc>` que **falla por aserción**, no por
   compilación (ts-jest tiene los diagnósticos activos): por eso varios commits
   rojos llevan *stubs* declarados abajo. Le sigue
   `feat(reminders): #210 R<n> <desc>` en verde. Un `refactor(...)` opcional va
   después, con todo verde. `<desc>` en inglés (`docs/conventions.md` §Commits).
2. **Orden fijo**: la tabla de abajo, de arriba a abajo. No se reordena ni se
   funden commits.
3. **Base medida.** Antes del primer commit, mide la base de la suite unitaria
   (`pnpm -C backend-pet-tracker exec jest`) y regístrala (suites, tests, exit
   code) en `progress/impl_reminders-recurrence.md`. En ese mismo fichero va,
   por commit, el comando corrido, su exit code y el nombre de cada `it` rojo.
4. **Exit codes sin pipe**: nunca `cmd | tail` para leer un exit code; redirige
   a un log y lee `$?`.
5. **Corridas parciales**:
   - unit: `pnpm -C backend-pet-tracker exec jest <ruta> [<ruta>...]`;
   - e2e: `pnpm -C backend-pet-tracker exec jest --config ./test/jest-e2e.json pet-reminders`
     (no `pnpm run test:e2e -- …`: el `--` llega a jest). Requiere Postgres y
     LocalStack arriba con las migraciones aplicadas
     (`pnpm -C backend-pet-tracker db:migrate`). **Codex no corre `./init.sh`**:
     si la infraestructura no está arriba, deja el rojo/verde e2e de ese commit
     como «pendiente de medir» en el reporte y sigue; lo mide el leader.
6. **Formato por commit**: `pnpm -C backend-pet-tracker exec prettier --write <ficheros del commit>`
   y `pnpm -C backend-pet-tracker exec eslint <ficheros del commit>` antes de
   cada `git commit`.
7. **Filas que nacen verdes**: cada una está declarada en su bloque con la
   mutación que la pone roja. Tras el commit verde correspondiente, planta la
   mutación, corre el test, comprueba el rojo, revierte con
   `git checkout HEAD -- <fichero>` y registra las tres cosas en el reporte.
   Ninguna mutación se commitea.
8. **Prefijo**: todo `describe`/`it` nuevo empieza por `#210 R<n>:`; los `it`
   existentes de la lista E1–E8 conservan su nombre.
9. **Migración**: §Migración de abajo (idéntica a [[design]] §Migración).

## Commits

| # | Commit | Rojo esperado (por aserción) | Stubs en el commit rojo |
|---|---|---|---|
| C1 | `test(reminders): #210 R1 recurrence columns and CHECKs` | schema spec: columnas ausentes, migración no encontrada, E8 sin las cuatro columnas; e2e `#210 R1: CHECK %s`: código `42703` en vez de `23514` y filas aceptadas que fallan | — |
| C2 | `feat(reminders): #210 R1 recurrence columns, CHECKs and additive migration` | — | — |
| C3 | `test(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation` | `recurrence.spec.ts`: todas las filas R7–R10 y las filas «lanza» de R3 | tipos de entidad, `InvalidRecurrenceError`, `recurrence.ts` stub |
| C4 | `feat(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation` | — | — |
| C5 | `test(reminders): #210 R2 zod validation of recurrence` | dto spec: rechazos con `path` raíz (`unrecognized_keys`) y aceptaciones fallidas | `export` de `EditReminderSchema` |
| C6 | `feat(reminders): #210 R2 zod validation of recurrence` | — | — |
| C7 | `test(reminders): #210 R4 POST persists the series` | `create-reminder.use-case.spec.ts` fila serie; e2e R4 con columnas null | `ReminderProps.recurrence`, E4, mapeo drizzle, constructor con `pets`, create pasa `recurrence: null` |
| C8 | `feat(reminders): #210 R4 POST persists the series` | — | — |
| C9 | `test(reminders): #210 R5 response shape with recurrence` | e2e R5 y E3: claves ausentes | — |
| C10 | `feat(reminders): #210 R5 response shape with recurrence` | — | — |
| C11 | `test(reminders): #210 R3 R6 cross-field rules and series PATCH` | update spec R6 sin clave `recurrence`; e2e R3 (500 y 200 en vez de 400), e2e R6 | E7 |
| C12 | `feat(reminders): #210 R3 R6 cross-field rules and series PATCH` | — | — |
| C13 | `test(reminders): #210 R13 writes conditioned on schedule_name` | E2 (`null` en vez del `scheduleName`); e2e R13 fila vieja de `markEnqueued` y fila de éxito de `advanceOccurrence` | firmas nuevas del puerto, drizzle sin condición, `advanceOccurrence` devuelve `false`, dispatcher pasa `null` |
| C14 | `feat(reminders): #210 R13 writes conditioned on schedule_name` | — | — |
| C15 | `test(reminders): #210 R12 kind in the reminder push data` | spec R12, E1, E5: `data` sin `kind` | — |
| C16 | `feat(reminders): #210 R12 kind in the reminder push data` | — | — |
| C17 | `test(reminders): #210 R11 notifier advances the series` | spec R11 (serie y zonas), spec `#210 R13` de `stale_schedule`, e2e R11 diaria | E6, 6.º parámetro `pets?`, `PetsModule` en `NotifierModule` |
| C18 | `feat(reminders): #210 R11 notifier advances the series` | — | — |
| C19 | `test(reminders): #210 R14 opaque 404 with recurrence bodies` | nace verde (declarado) | — |
| C20 | `docs(reminders): #210 fill traceability` | — (solo `specs/reminders-recurrence/traceability.md`) | — |

## Enmiendas a tests existentes (lista cerrada E1–E8)

Cifras medidas en la base `1316410f` con `grep -cF '<literal>' <ruta>` desde
`backend-pet-tracker/`. Ninguna otra línea de tests existentes cambia.

| Id | Fichero | Literal base (cifra) | Cambio | Cifra tras el cambio | Commit |
|---|---|---|---|---|---|
| E1 | `src/workers/notifier/notifier-consumer.service.spec.ts` | `data: { petId: PET_ID, reminderId: REMINDER_ID }` (2) | solo la aparición dentro de `expect(sender.send).toHaveBeenCalledWith(` del `it` `envia push, marca sent despues y borra el mensaje` pasa a `data: { petId: PET_ID, reminderId: REMINDER_ID, kind: 'reminder' }`; la del fixture del mensaje SQS **no** cambia (contrato #12) | literal base 1; literal nuevo 1 | C15 |
| E2 | `src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts` | `[first.id, NOW],` (1), `[second.id, NOW],` (1), `toHaveBeenCalledWith(sent.id, NOW)` (1), `not.toHaveBeenCalledWith(failed.id, NOW)` (1), `toEqual([[sent.id, NOW]])` (1) | cada uno inserta el `scheduleName` de su fixture como 2.º argumento: `[first.id, first.scheduleName, NOW],`, `[second.id, second.scheduleName, NOW],`, `toHaveBeenCalledWith(sent.id, sent.scheduleName, NOW)`, `not.toHaveBeenCalledWith(failed.id, failed.scheduleName, NOW)`, `toEqual([[sent.id, sent.scheduleName, NOW]])` | cada literal base 0; cada literal nuevo 1 | C13 |
| E3 | `test/pet-reminders.e2e-spec.ts` | `'advanceMinutes',` (1), en el `it` `persiste defaults, actor y token vigente` | el array de claves esperadas gana `'recurrence',` y `'recurrenceUntil',` | `'recurrenceUntil',` = 1 | C9 |
| E4 | `update-reminder.use-case.spec.ts` (2), `list-reminders.use-case.spec.ts` (1), `reminders-dispatch.service.spec.ts` (5), `notifier-consumer.service.spec.ts` (1) — cifras de `new Reminder({` | cada `new Reminder({` gana `recurrence: null,` | en cada fichero, `recurrence: null,` = su cifra de `new Reminder({` al cerrar C7 | C7 |
| E5 | `test/pet-reminders.e2e-spec.ts` | `data: { petId: pet.id, reminderId },` (1) | pasa a `data: { petId: pet.id, reminderId, kind: 'reminder' },` | literal base 0; literal nuevo 1 | C15 |
| E6 | `src/workers/notifier/notifier-consumer.service.spec.ts` | `return { client, findById, markSent };` (1) | el stub de reminders gana `advanceOccurrence` (`jest.fn().mockResolvedValue(true)`) y lo devuelve; el builder `reminderService(` gana un 5.º parámetro opcional `pets?: PetRepository` que pasa como 6.º argumento del constructor | literal base 0 | C17 |
| E7 | `src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts` | `const pets = { findMembership } as unknown as PetRepository;` (1) | el stub gana `findOwnerTimezone` (`jest.fn().mockResolvedValue('UTC')`) y lo devuelve en el objeto de stubs | literal base 0 | C11 |
| E8 | `src/db/schema/reminders.schema.spec.ts` | `'created_by',` (2): solo la aparición dentro del array de `expect([...columns.keys()].sort()).toEqual(` (1), en el `it` `exporta reminders con las columnas, tipos y nulabilidad aprobados` | el array gana `'recurrence_unit', 'recurrence_every', 'recurrence_until', 'recurrence_anchor_at',` justo después de `'created_by',` | literal base 0 de `'recurrence_unit',` | C1 (rojo por aserción, verde en C2) |

## R1 — Columnas, CHECKs y migración aditiva

- [ ] (1) Escribir test que falla para R1 — C1. En `reminders.schema.spec.ts`,
  `describe('#210 R1: columnas de recurrencia y migracion aditiva')` con los dos
  `it` de [[requirements]] R1; el de migración filtra `readdirSync` por
  `/^\d{4}_reminders_recurrence\.sql$/`, exige longitud 1 (`toHaveLength(1)`,
  aserción, no `throw`), parte el SQL por `--> statement-breakpoint` y exige que
  cada sentencia no vacía empiece por `ALTER TABLE "reminders" ADD COLUMN` o
  `ALTER TABLE "reminders" ADD CONSTRAINT`, y que el fichero no contenga `DROP`,
  y aplica E8. En el e2e, `describe('#210 R1: CHECKs de recurrencia en Postgres')` con un
  owner y una mascota sembrados en `beforeAll` y `it.each` de las filas de la
  tabla R1 (una fila por unidad en las líneas «por unidad»: 1 + 5 + 5 + 10 + 4
  + 1 = 26 filas). Cada fila inserta con `db.execute(sql\`insert into reminders (id, pet_id, type, title, due_at, created_by, recurrence_unit, recurrence_every, recurrence_anchor_at, recurrence_until) values (...)\`)`
  (`now()` para el ancla «now») y asserta
  `rejects.toMatchObject({ cause: { code: '23514', constraint: '<nombre>' } })`
  o `resolves` para las aceptadas.
- [ ] (2) Implementación mínima que lo pasa — C2: columnas y `check(...)` en
  `reminders.schema.ts`, luego `db:generate` (§Migración). Commitea el `.sql`,
  el snapshot y el journal generados sin editarlos. Tras `db:generate`,
  `grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json`
  = A24 + 1 (21 en la base `1316410f`; tras un merge de `origin/dev`, la cuenta
  de `origin/dev` + 1, §Migración paso 7).
- [ ] (3) Refactor con tests verdes.

## R2 — Validación zod

- [ ] (1) Escribir test que falla para R2 — C5. En `reminder.dto.spec.ts`, los
  cinco `it` de [[requirements]] R2: `it.each` de rechazos sobre
  `CreateReminderSchema` (body POST válido + el campo) y sobre
  `EditReminderSchema` (solo el campo), asertando
  `error.issues.map((i) => i.path.join('.'))` `toContain` la ruta de la tabla;
  `it.each` de aceptación de mínimo y máximo por unidad (10 filas); POST con
  `recurrence: null` igual a sin la clave; PATCH `{ recurrence: null }`,
  `{ recurrenceUntil: null }` y una serie válida aceptados por
  `UpdateReminderSchema`. Stub: `export` de `EditReminderSchema` (A18).
- [ ] (2) Implementación mínima que lo pasa — C6: `RecurrenceSchema`,
  `RecurrenceUntilSchema` y los dos campos en Create y Edit.
- [ ] (3) Refactor con tests verdes.

## R3 — Reglas cruzadas

- [ ] (1) Escribir test que falla para R3 — dos partes:
  - C3: `#210 R3: assertValidRecurrence %s` en `recurrence.spec.ts` (6 filas de
    [[requirements]] R3; las que lanzan, con `toThrow(InvalidRecurrenceError)`).
    **Nacen verdes** las tres filas «no lanza» (el stub es un no-op): mutación
    tras C4, cuerpo de `assertValidRecurrence` reemplazado por un `throw`
    incondicional; las tres en rojo.
  - C11: e2e `#210 R3: POST con recurrenceUntil sin recurrence responde 400 sin insertar`
    (body exacto `{ statusCode: 400, message: 'Invalid recurrence' }` y cero
    filas nuevas de la mascota) y `#210 R3: PATCH que deja until antes de dueAt responde 400 sin cambiar la fila`
    (serie sembrada vía POST con `dueAt` = ahora + 3 días; PATCH
    `{ recurrenceUntil: <día UTC de ahora> }`; la fila leída antes y después es
    `toEqual`).
- [ ] (2) Implementación mínima que lo pasa — C4 (`assertValidRecurrence`) y C12
  (mapeo a 400 en `mapReminderError`, `try/catch` en el POST del controller,
  llamada en update).
- [ ] (3) Refactor con tests verdes.

## R4 — POST persiste la serie

- [ ] (1) Escribir test que falla para R4 — C7. `create-reminder.use-case.spec.ts`
  (nuevo) con los dos `it` de [[requirements]] R4: el primero asserta el
  argumento exacto de `reminders.create` (`recurrence: { unit: 'week', every: 2, anchorAt: <dueAt>, until: null }`);
  el segundo `recurrence: null` y `findOwnerTimezone` no llamado. e2e
  `#210 R4: POST con recurrence guarda las cuatro columnas` lee la fila con
  drizzle y asserta las cuatro columnas. Stubs: `ReminderProps.recurrence`,
  enmienda E4, `toDomain`/`create` de drizzle con el mapeo real de columnas,
  constructor de `CreateReminderUseCase` con `pets` sin usar, y el use case
  pasando siempre `recurrence: null`. **Nace verde** el segundo `it`: mutación
  tras C8, llamar a `findOwnerTimezone` siempre; rojo.
- [ ] (2) Implementación mínima que lo pasa — C8. C8 llama a
  `assertValidRecurrence` en el create; el mapeo de `InvalidRecurrenceError`
  a 400 llega en C12. C8 extrae `ownerTimeZone` a `owner-local-day.ts`, de forma
  que `localDayInZone` lo reutilice sin cambiar su comportamiento (los tests
  existentes de `owner-local-day` siguen verdes sin tocarlos).
- [ ] (3) Refactor con tests verdes.

## R5 — Shape de respuesta

- [ ] (1) Escribir test que falla para R5 — C9: e2e
  `#210 R5: GET POST y PATCH devuelven recurrence y recurrenceUntil sin el ancla`
  con `toEqual` exacto (objeto literal completo, `dueAt` como ISO) sobre una
  serie `{ unit: 'month', every: 6 }` con `recurrenceUntil` y sobre un one-shot
  (`recurrence: null, recurrenceUntil: null`), en las tres rutas. Enmienda E3.
- [ ] (2) Implementación mínima que lo pasa — C10: `ReminderResponse` y
  `toReminderResponse`.
- [ ] (3) Refactor con tests verdes.

## R6 — PATCH sobre una serie

- [ ] (1) Escribir test que falla para R6 — C11. `#210 R6: PATCH %s` en
  `update-reminder.use-case.spec.ts`, una fila por línea de la tabla R6 (8
  filas), asertando el 2.º argumento exacto de `reschedule` (o, en las dos
  filas 400, `rejects.toThrow(InvalidRecurrenceError)` y `reschedule` no
  llamado). La fila «solo title» asserta con `not.toHaveProperty('recurrence')`.
  e2e `#210 R6: PATCH reancla, conserva y limpia columnas de la serie` encadena
  sobre una serie: PATCH `dueAt` (ancla = nuevo `dueAt`, until intacto), PATCH
  `recurrenceUntil: null`, PATCH `recurrence: null` (cuatro columnas null),
  leyendo la fila con drizzle tras cada uno. Enmienda E7. **Nace verde** la
  fila «solo title»: mutación tras C12, pasar siempre `recurrence` en
  `changes`; rojo.
- [ ] (2) Implementación mínima que lo pasa — C12.
- [ ] (3) Refactor con tests verdes.

## R7 — Ocurrencias por unidad

- [ ] (1) Escribir test que falla para R7 — C3: `it.each` con las 11 filas de
  [[requirements]] R7, asertando `nextOccurrence(...)?.toISOString()` contra el
  literal. Stubs de C3: `RECURRENCE_UNITS`, `RecurrenceUnit`,
  `ReminderRecurrence` en la entidad (sin tocar `ReminderProps`),
  `InvalidRecurrenceError`, y `recurrence.ts` con `assertValidRecurrence` cuyo
  cuerpo es solo `void <param>;` por cada parámetro, y `nextOccurrence` con
  `void now; void timeZone; return reminder.dueAt;`. Sin los `void`, eslint da
  6 × `no-unused-vars` y la regla 6 bloquea el commit rojo.
- [ ] (2) Implementación mínima que lo pasa — C4, con `sameLocalTimeOn` en
  `local-day.ts`.
- [ ] (3) Refactor con tests verdes.

## R8 — Hora local y DST

- [ ] (1) Escribir test que falla para R8 — C3: `it.each` con las 9 filas de
  [[requirements]] R8.
- [ ] (2) Implementación mínima que lo pasa — C4.
- [ ] (3) Refactor con tests verdes.

## R9 — Primera ocurrencia futura

- [ ] (1) Escribir test que falla para R9 — C3: `it.each` con las 4 filas de
  [[requirements]] R9.
- [ ] (2) Implementación mínima que lo pasa — C4.
- [ ] (3) Refactor con tests verdes.

## R10 — `until` inclusivo

- [ ] (1) Escribir test que falla para R10 — C3: `it.each` con las 4 filas de
  [[requirements]] R10 (`toBeNull()` en las dos `null`).
- [ ] (2) Implementación mínima que lo pasa — C4.
- [ ] (3) Refactor con tests verdes.

## R11 — El notifier avanza la serie

- [ ] (1) Escribir test que falla para R11 — C17. En
  `notifier-consumer.service.spec.ts`, los tres `it` de [[requirements]] R11 con
  `jest.useFakeTimers().setSystemTime(new Date('2026-03-07T14:00:00.000Z'))`,
  asertando `advanceOccurrence` con
  `(REMINDER_ID, <scheduleName del mensaje>, <Date esperada>, expect.stringMatching(/^reminder-[0-9a-f-]{36}$/))`
  y `markSent` no llamado; la fila until (day 1, `until` = `'2026-03-07'`, UTC)
  con `markSent(REMINDER_ID)` y `advanceOccurrence` no llamado. La fila de
  serie se construye dentro del `it`, sin tocar `reminderRow()`, con
  `new Reminder({ ...reminderRow(), dueAt: <dueAt>, recurrence: { unit: 'day', every: 1, anchorAt: <dueAt>, until: <null o '2026-03-07'> } })`
  (`<dueAt>` = `new Date('2026-03-07T15:00:00.000Z')` en las filas de zona).
  `Reminder` no tiene accesor `props`: su constructor hace
  `Object.assign(this, props)` y la clase `implements ReminderProps`, así que el
  spread de la instancia da las props; `anchorAt` y `until` van dentro de
  `recurrence` (`ReminderRecurrence`), no como campos sueltos. Mismo commit:
  `#210 R13: advanceOccurrence false registra stale_schedule y borra el mensaje`
  (`advanceOccurrence` → `false`; `Logger.prototype.log` recibe
  `expect.objectContaining({ skipped: 'stale_schedule' })`; un
  `DeleteMessageCommand`). e2e: `#210 R11: una serie diaria vuelve a scheduled en la siguiente ocurrencia sin duplicar push`
  (token push registrado como en el `it` R7 de #16 con `expoToken` propio;
  POST `{ recurrence: { unit: 'day', every: 1 } }`, `dueAt` = ahora + 2 h,
  `advanceMinutes 180`; `dispatchOnce`, `drainOnce`, `dispatchOnce`,
  `drainOnce`; las llamadas de `sendPush` cuyo `data.reminderId` es el de la
  serie son exactamente 1; la fila queda `scheduled`, `dueAt` = el original +
  86 400 000 ms, `enqueuedAt` null y `scheduleName` distinto) y
  `#210 R11: una serie con until en su dia termina en sent` (`recurrenceUntil` =
  `dueAt.toISOString().slice(0, 10)`, owner en UTC; fila `sent`). Enmienda E6.
  Stubs: 6.º parámetro `pets?` del constructor y `PetsModule` en
  `NotifierModule`. **Nacen verdes** «serie pasada de until marca sent» (unit) y
  «serie con until en su dia termina en sent» (e2e): mutación tras C18, ignorar
  `until` en `nextOccurrence`; ambos en rojo.
- [ ] (2) Implementación mínima que lo pasa — C18.
- [ ] (3) Refactor con tests verdes.

## R12 — `kind` en el `data` del push

- [ ] (1) Escribir test que falla para R12 — C15:
  `#210 R12: el push de reminder lleva kind en data` asserta
  `sender.send.mock.calls[0][0].data` `toEqual({ petId: PET_ID, reminderId: REMINDER_ID, kind: 'reminder' })`
  (igualdad exacta, sin `objectContaining` en `data`). Enmiendas E1 y E5.
- [ ] (2) Implementación mínima que lo pasa — C16.
- [ ] (3) Refactor con tests verdes.

## R13 — Escrituras condicionadas

- [ ] (1) Escribir test que falla para R13 — C13. Enmienda E2. e2e con
  `app.get<ReminderRepository>(REMINDER_REPOSITORY)`:
  `#210 R13: markEnqueued con scheduleName viejo no toca enqueued_at` (fila
  sembrada con `scheduleName` `reminder-<id>`: llamada con `'reminder-old'` deja
  `enqueuedAt` null; llamada con el nombre vigente lo escribe) y
  `#210 R13: advanceOccurrence solo avanza la fila con su scheduleName y scheduled`
  (tres filas: vigente y `scheduled` → `true` y `dueAt`/`scheduleName`/`enqueuedAt`
  nuevos; nombre viejo → `false` y fila `toEqual` a la previa; `cancelled` con el
  nombre vigente → `false` y fila intacta). Stubs: firmas nuevas en el puerto,
  `markEnqueued` de drizzle sin la condición nueva, `advanceOccurrence` de
  drizzle **sin** `async`, con cuerpo
  `void id; void scheduleName; void dueAt; void newScheduleName; return Promise.resolve(false);`
  (la forma `async … { return false; }` da `require-await` + 4 ×
  `no-unused-vars`), dispatcher pasando `null` como
  `scheduleName`. **Nacen verdes**: la fila `not.toHaveBeenCalledWith(failed…)`
  de E2, la llamada con nombre vigente de `markEnqueued` y las dos filas
  `false` de `advanceOccurrence`. Mutaciones tras C14: quitar la condición de
  `schedule_name` en `advanceOccurrence` (rojo la fila de nombre viejo); quitar
  la de `status` (rojo la fila `cancelled`); `where` de `markEnqueued` con
  `schedule_name = 'x'` fijo (rojo la llamada vigente); el dispatcher llama a
  `markEnqueued` también para el reminder cuyo envío falló (la fila
  `not.toHaveBeenCalledWith(failed…)` pasa a rojo).
  El tercer punto de R13 (`stale_schedule` al recibir `false`) se prueba en C17
  (bloque R11).
- [ ] (2) Implementación mínima que lo pasa — C14.
- [ ] (3) Refactor con tests verdes.

## R14 — 404 opaco

- [ ] (1) Escribir test que falla para R14 — C19. e2e
  `#210 R14: PATCH con recurrenceUntil invalido sobre reminder ajeno responde el mismo 404`:
  un one-shot de la mascota de otro owner y un UUID inexistente, ambos con el
  body `{ recurrenceUntil: '2031-01-01' }` (viola R3: until sin recurrence);
  mismos `status` (404) y `body` (`toEqual`). **Nace verde** (C12 ya evalúa R3
  tras la autorización). Mutación: en `update-reminder.use-case.ts`, mover la
  llamada a `assertValidRecurrence` justo después de `findById` (antes de la
  membresía); rojo (400 frente a 404); revertir.
- [ ] (2) Implementación mínima que lo pasa — no aplica (C12).
- [ ] (3) Refactor con tests verdes.

## Migración

```
pnpm -C backend-pet-tracker db:generate --name reminders_recurrence
```

Requiere `.env` en la raíz del repo con `DATABASE_URL`: `drizzle.config.ts`
carga `../.env` y aborta si falta. En la base debería salir
`0020_reminders_recurrence.sql`. **Si #211 o #212 mergean antes en `dev`** con
su propia migración del mismo número, se aplica la receta común de
regeneración (la misma de #211 y #212), literal y en este orden:

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
   (solo existe si hay colisión; queda fuera de la tabla C1–C20).
9. Recrear la base del worktree antes del siguiente `db:migrate`:
   `docker exec pet-tracker-postgres psql -U pet_tracker -d postgres -c 'DROP DATABASE pet_tracker_wt210;'`,
   luego
   `docker exec pet-tracker-postgres psql -U pet_tracker -d postgres -c 'CREATE DATABASE pet_tracker_wt210 OWNER pet_tracker;'`
   y luego `pnpm run db:migrate`. Nunca psql crudo sobre el journal.
10. Volver a correr las suites unitaria y e2e.

**Nunca** se renumera nada a mano.

## Cierre

- [ ] Suite unitaria completa verde y comparada con la base del punto 3.
- [ ] e2e `pet-reminders` verde (medido por quien tenga la infraestructura).
- [ ] [[traceability]] sin filas «pendiente».
- [ ] `progress/impl_reminders-recurrence.md` con base, rojos por commit y las
  nueve mutaciones (R3, R4, R6, R11, R13 ×4, R14) registradas.
