# Implementación #210 — reminders-recurrence

**ESTADO FINAL: implementación terminada hasta C20 (`8c7f2f68`), sin bloqueos del implementer.** 189 suites / 1573 tests unitarios; E2E pet-reminders 69 y alerts-center-notifier 20; typecheck y ESLint verdes. Nueve mutaciones medidas en rojo y revertidas. Trazabilidad R1–R14 completa. Las secciones siguientes conservan las paradas y reanudaciones como histórico; este estado final las sustituye. Reporte sin commit para el leader, conforme al handoff.

**Estado actual tras Reanudación 1: STOP por guardas literales E2 incompatibles con Prettier.** C2 desbloqueado por E9; C1–C14 commiteados, C14 verde (234 unitarios, 66 E2E). C15 tiene solo sus tests preparados y medidos en rojo, sin commit. Las secciones anteriores se conservan como histórico de la primera parada. M1, M2, M3, M5, M6, M7 y M8 medidas y revertidas; M4 y M9 quedan para C18/C19. No se crea el marcador .done: Reanudación 1 lo autoriza solo al final de la cadena entera.

**BLOQUEADO EN C2. Implementación incompleta.** Se cumple el STOP del handoff: la spec R1 exige simultáneamente una columna `varchar(5)` y rechazar la unidad `'minute'` (6 caracteres) por CHECK `23514`. PostgreSQL rechaza primero el tamaño con `22001`. No se altera la spec ni el test para ocultarlo. Requiere enmienda del leader/spec_author antes de continuar (por ejemplo, una unidad inválida de hasta cinco caracteres en la tabla aprobada, o un tipo de columna distinto aprobado).

C1 está commiteado (`ea3f36b2`). C2 está preparado, generado y migrado, pero **sin commit** porque el verde E2E no se alcanzó. C3–C20 no empezados. Traceability permanece intacta, conforme a la restricción de editarla solo en C20. No hay push ni PR. El reporte queda sin commit para el leader.

Base: worktree `/home/claude/sites/Pet-Tracker-wt-210`, rama `feature/210-reminders-recurrence`, HEAD inicial `1d89093e`. Ancestro H0 `705f1ea2`: exit 0; diff fuera de progress desde H0: 0 archivos. Árbol inicial limpio.

Desviación de arranque: la lectura del handoff fue el primer comando; el comando literal de identidad se ejecutó inmediatamente después de leerlo. Su salida confirmó la ruta/rama y un hijo de H0 que solo toca progress. No se ejecuta init.sh, no se lee .env, no se hace merge/rebase/push/PR.

## Mediciones

Los logs `progress/210-*.log` están ignorados por Git. Cada comando se ejecuta desde backend-pet-tracker tras el cd y pwd literales del handoff. Exit codes medidos sin pipes.

## Anclas T0 (árbol H0 restaurado temporalmente en los dos tests de C1)

```text
$ grep -cF "async markEnqueued(id: string, at: Date): Promise<void>" backend-pet-tracker/src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts   # A1 -> 1
1
exit 0
$ grep -cF "markEnqueued(id: string, at: Date): Promise<void>;" backend-pet-tracker/src/modules/reminders/domain/repositories/reminder.repository.ts   # A2 -> 1
1
exit 0
$ grep -cF "export type ReminderChanges" backend-pet-tracker/src/modules/reminders/domain/repositories/reminder.repository.ts   # A3 -> 1
1
exit 0
$ grep -cF "data: { petId: reminder.petId, reminderId: reminder.id }," backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.ts   # A4 -> 1
1
exit 0
$ grep -cF "await this.reminders.markEnqueued(reminder.id, new Date());" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.ts   # A5 -> 1
1
exit 0
$ grep -cF "await this.reminders.markSent(message.reminderId);" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A6 -> 1
1
exit 0
$ grep -cF "reminder.scheduleName !== message.scheduleName" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A7 -> 1
1
exit 0
$ grep -cF "data: message.data as { petId: string; alertId: string }" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A8 -> 1
1
exit 0
$ grep -cF "Reenviar un push repetido es preferible a perderlo" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A9 -> 1
1
exit 0
$ grep -cF "imports: [ConfigModule, UsersModule, RemindersModule]" backend-pet-tracker/src/workers/notifier/notifier.module.ts   # A10 -> 1
1
exit 0
$ grep -cF "export function addCalendarMonths(date: string, months: number): string" backend-pet-tracker/src/modules/health/application/vaccine-date.ts   # A11 -> 1
1
exit 0
$ grep -cF "findOwnerTimezone(petId: string): Promise<string | null>;" backend-pet-tracker/src/modules/pets/domain/repositories/pet.repository.ts   # A12 -> 1
1
exit 0
$ grep -cF "export function localDayInZone(" backend-pet-tracker/src/modules/pets/application/owner-local-day.ts   # A13 -> 1
1
exit 0
$ grep -cF "function offsetMsAt(tsMs: number, timeZone: string): number" backend-pet-tracker/src/pipeline/local-day.ts   # A14 -> 1
1
exit 0
$ grep -cF "export function shiftDay(day: string, days: number): string" backend-pet-tracker/src/pipeline/local-day.ts   # A15 -> 1
1
exit 0
$ grep -cF "export function isCalendarDate(value: string): boolean" backend-pet-tracker/src/pipeline/local-day.ts   # A16 -> 1
1
exit 0
$ grep -cF "export const CreateReminderSchema" backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.ts   # A17 -> 1
1
exit 0
$ grep -cF "const EditReminderSchema = z" backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.ts   # A18 -> 1
1
exit 0
$ grep -cF "export interface ReminderResponse" backend-pet-tracker/src/modules/reminders/infrastructure/mappers/reminder.mapper.ts   # A19 -> 1
1
exit 0
$ grep -cF "imports: [ConfigModule, PetsModule]" backend-pet-tracker/src/modules/reminders/reminders.module.ts   # A20 -> 1
1
exit 0
$ grep -cF 'scheduleName: `reminder-${uuidv7()}`' backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.ts   # A21 -> 1
1
exit 0
$ grep -cF "export class ReminderNotEditableError" backend-pet-tracker/src/modules/reminders/domain/errors/reminder.errors.ts   # A22 -> 1
1
exit 0
$ grep -cF "between 0 and 10080" backend-pet-tracker/src/db/schema/reminders.schema.ts   # A23 -> 1
1
exit 0
$ grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json   # A24 -> 20
20
exit 0
$ grep -cF "0019_pet_documents_uploaded_at" backend-pet-tracker/src/db/migrations/meta/_journal.json   # A25 -> 1
1
exit 0
$ grep -cF "reminders: body as Reminder[]" mobile-pet-tracker/src/api/reminders.ts   # A26 -> 1
1
exit 0
$ grep -cF "data: { petId: PET_ID, reminderId: REMINDER_ID }" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E1 -> 2
2
exit 0
$ grep -cF "data: { petId: PET_ID, reminderId: REMINDER_ID, kind: 'reminder' }" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E1 literal nuevo -> 0
0
exit 1
$ grep -cF "[first.id, NOW]," backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
1
exit 0
$ grep -cF "[second.id, NOW]," backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
1
exit 0
$ grep -cF "toHaveBeenCalledWith(sent.id, NOW)" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
1
exit 0
$ grep -cF "not.toHaveBeenCalledWith(failed.id, NOW)" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
1
exit 0
$ grep -cF "toEqual([[sent.id, NOW]])" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E2 -> 1
1
exit 0
$ grep -cF "'advanceMinutes'," backend-pet-tracker/test/pet-reminders.e2e-spec.ts   # E3 -> 1
1
exit 0
$ grep -cF "'recurrenceUntil'," backend-pet-tracker/test/pet-reminders.e2e-spec.ts   # E3 literal nuevo -> 0
0
exit 1
$ grep -cF "new Reminder({" backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts   # E4 -> 2
2
exit 0
$ grep -cF "new Reminder({" backend-pet-tracker/src/modules/reminders/application/use-cases/list-reminders.use-case.spec.ts   # E4 -> 1
1
exit 0
$ grep -cF "new Reminder({" backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts   # E4 -> 5
5
exit 0
$ grep -cF "new Reminder({" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E4 -> 1
1
exit 0
$ grep -cF "data: { petId: pet.id, reminderId }," backend-pet-tracker/test/pet-reminders.e2e-spec.ts   # E5 -> 1
1
exit 0
$ grep -cF "data: { petId: pet.id, reminderId, kind: 'reminder' }," backend-pet-tracker/test/pet-reminders.e2e-spec.ts   # E5 literal nuevo -> 0
0
exit 1
$ grep -cF "return { client, findById, markSent };" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E6 -> 1
1
exit 0
$ grep -cF "advanceOccurrence" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts   # E6 literal nuevo -> 0
0
exit 1
$ grep -cF "const pets = { findMembership } as unknown as PetRepository;" backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts   # E7 -> 1
1
exit 0
$ grep -cF "findOwnerTimezone" backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts   # E7 literal nuevo -> 0
0
exit 1
$ grep -cF "'created_by'," backend-pet-tracker/src/db/schema/reminders.schema.spec.ts   # E8 -> 2
2
exit 0
$ grep -cF "'recurrence_unit'," backend-pet-tracker/src/db/schema/reminders.schema.spec.ts   # E8 literal nuevo -> 0
0
exit 1
$ grep -cF "check(" backend-pet-tracker/src/db/schema/reminders.schema.ts   # config.checks -> 4 (R1 lo lleva a 7)
4
exit 0
$ ls backend-pet-tracker/src/db/migrations | grep -c '_reminders_recurrence\.sql$'   # migración propia -> 0
0
exit 1
$ ls backend-pet-tracker/src/db/migrations | grep -c '^0020_'   # 0020 libre -> 0
0
exit 1
$ grep -rlF "recurrence" backend-pet-tracker/src backend-pet-tracker/test | wc -l   # -> 0
0
exit 0
$ grep -rlF "sameLocalTimeOn" backend-pet-tracker/src | wc -l   # -> 0
0
exit 0
$ grep -rlF "ownerTimeZone" backend-pet-tracker/src | wc -l   # -> 0
0
exit 0
$ test -e backend-pet-tracker/src/modules/reminders/application/recurrence.ts; echo $?   # -> 1
1
exit 0
$ test -e backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.spec.ts; echo $?   # -> 1
1
exit 0
```

### C1 — ea3f36b2 test(reminders): #210 R1 recurrence columns and CHECKs

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 1):
```text
  ● R1: tabla reminders y migracion 0011 aditiva › exporta reminders con las columnas, tipos y nulabilidad aprobados
  ● #210 R1: columnas de recurrencia y migracion aditiva › #210 R1: declara las cuatro columnas nullable y los tres CHECKs de recurrencia
  ● #210 R1: columnas de recurrencia y migracion aditiva › #210 R1: genera una migracion reminders_recurrence solo aditiva
Test Suites: 1 failed, 14 passed, 15 total
Tests:       3 failed, 141 passed, 144 total
    expect(received).toEqual(expected) // deep equality
      30 |     expect(getTableName(schema.reminders)).toBe('reminders');
    > 31 |     expect([...columns.keys()].sort()).toEqual(
    expect(received).toBe(expected) // Object.is equality
    Expected: "varchar(5)"
    Received: undefined
    > 128 |       expect(columns.get(name)?.getSQLType()).toBe(type);
      129 |       expect(columns.get(name)?.notNull).toBe(false);
      131 |     expect(config.checks).toHaveLength(7);
    expect(received).toHaveLength(expected)
    > 145 |     expect(files).toHaveLength(1);
```

e2e (exit 1):
```text
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK unidad desconocida
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK hour bajo minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK day bajo minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK week bajo minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK month bajo minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK year bajo minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK hour sobre maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK day sobre maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK week sobre maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK month sobre maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK year sobre maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK hour minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK hour maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK day minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK day maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK week minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK week maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK month minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK month maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK year minimo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK year maximo
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK serie sin ancla
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK until sin serie
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK every sin unidad
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK unidad sin every
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK serie completa con until
Test Suites: 1 failed, 1 total
Tests:       26 failed, 33 passed, 59 total
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).rejects.toMatchObject(expected)
    > 843 |           await expect(insert).rejects.toMatchObject({
    expect(received).resolves.toBeDefined()
    > 850 |           await expect(insert).resolves.toBeDefined();
```

## Base T0 repetida

`pnpm exec jest`: exit 0; Test Suites: 187 passed, 187 total; Tests:       1474 passed, 1474 total

`pnpm exec jest src/db/schema/reminders.schema.spec.ts src/modules/reminders src/workers/notifier src/modules/pets/application/owner-local-day.spec.ts src/pipeline/local-day.spec.ts`: exit 0; Test Suites: 15 passed, 15 total; Tests:       142 passed, 142 total

`pnpm exec jest --config ./test/jest-e2e.json pet-reminders`: exit 0; Test Suites: 1 passed, 1 total; Tests:       33 passed, 33 total

`pnpm exec jest --config ./test/jest-e2e.json alerts-center-notifier`: exit 0; Test Suites: 1 passed, 1 total; Tests:       20 passed, 20 total

Las dos E2E tuvieron pgrep vacío antes. C2: db:generate exit 0; cuatro ADD COLUMN, tres ADD CONSTRAINT, siete ALTER TABLE sobre reminders; cero DROP/CREATE; un SQL propio; journal 21. DATABASE_URL exportada ausente (test -z exit 0); db:migrate exit 0; lectura docker del journal de pet_tracker_wt210: 21 filas. Artefactos generados intactos.

## C2 — sin commit: fallo de la especificación

Comandos desde `/home/claude/sites/Pet-Tracker-wt-210/backend-pet-tracker` tras cd y pwd:

- `pnpm exec prettier --write src/db/schema/reminders.schema.ts`: exit 0.
- `pnpm exec prettier --check src/db/schema/reminders.schema.ts && pnpm exec eslint src/db/schema/reminders.schema.ts && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec jest src/db/schema/reminders.schema.spec.ts src/modules/reminders src/workers/notifier src/modules/pets/application/owner-local-day.spec.ts src/pipeline/local-day.spec.ts`: exit 0.
- `pgrep -f '[i]nit.sh'`: vacío, exit 1.
- `pnpm exec jest --config ./test/jest-e2e.json pet-reminders`: exit 1.

### unit C2

```text
Test Suites: 15 passed, 15 total
Tests:       144 passed, 144 total
```

### e2e C2

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 58 passed, 59 total
```

```text
  ● Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK unidad desconocida

    expect(received).rejects.toMatchObject(expected)

    - Expected  - 2
    + Received  + 2

      Object {
        "cause": Object {
    -     "code": "23514",
    -     "constraint": "reminders_recurrence_unit_check",
    +     "code": "22001",
    +     "constraint": undefined,
        },
      }

      841 |         values (${uuidv7()}, ${pet.id}, 'custom', 'CHECK recurrence', now(), ${owner.id}, ${unit}, ${every}, ${anchor ? sql`now()` : sql`null`}, ${until})`);
      842 |         if (check) {
    > 843 |           await expect(insert).rejects.toMatchObject({
          |                                        ^
      844 |             cause: {
      845 |               code: '23514',
      846 |               constraint: `reminders_recurrence_${check}_check`,

      at Object.toMatchObject (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2155:20)
      at pet-reminders.e2e-spec.ts:843:40

```

### SQL generado (sin editar)

```sql
ALTER TABLE "reminders" ADD COLUMN "recurrence_unit" varchar(5);--> statement-breakpoint
ALTER TABLE "reminders" ADD COLUMN "recurrence_every" integer;--> statement-breakpoint
ALTER TABLE "reminders" ADD COLUMN "recurrence_until" date;--> statement-breakpoint
ALTER TABLE "reminders" ADD COLUMN "recurrence_anchor_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_recurrence_unit_check" CHECK ("reminders"."recurrence_unit" in ('hour', 'day', 'week', 'month', 'year'));--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_recurrence_every_check" CHECK (case "reminders"."recurrence_unit" when 'hour' then "reminders"."recurrence_every" between 1 and 24 when 'day' then "reminders"."recurrence_every" between 1 and 365 when 'week' then "reminders"."recurrence_every" between 1 and 52 when 'month' then "reminders"."recurrence_every" between 1 and 12 when 'year' then "reminders"."recurrence_every" between 1 and 10 else true end);--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_recurrence_shape_check" CHECK (("reminders"."recurrence_unit" is null and "reminders"."recurrence_every" is null and "reminders"."recurrence_until" is null and "reminders"."recurrence_anchor_at" is null) or ("reminders"."recurrence_unit" is not null and "reminders"."recurrence_every" is not null and "reminders"."recurrence_anchor_at" is not null));
```

### Trabajo pendiente por STOP

- C2: corregir y aprobar la contradicción de R1; volver a medir el verde y commitear.
- C3–C20, las nueve mutaciones M1–M9, cierre de traceability y verificaciones finales no ejecutados.
- No se ejecutó `./init.sh` (lo corre el leader), ni build final ni graphify por la parada obligatoria.
- No hubo denegaciones de sandbox ni falta de infraestructura. Las cuatro mediciones T0 fueron verdes; la infraestructura E2E respondió en C1 y C2.
- Error de invocación corregido: un functions.exec con una plantilla JavaScript mal delimitada produjo SyntaxError antes de ejecutar herramientas o tocar archivos; se corrigió y repitió. No afecta a las mediciones.
- Las anclas T0 se midieron antes de C1 con los dos tests temporalmente restaurados a H0 y luego repuestos; todas coinciden. Los nombres y tests existentes solo cambian por E8 en C1.
- C1: 3 fallos unitarios (E8, columnas ausentes y migración ausente), 26 fallos E2E R1 por aserción (columnas inexistentes, cause.code 42703 / inserciones rechazadas). Ningún fallo de compilación ni test previo ajeno a E8.

## Estado entregado al leader

```
 M backend-pet-tracker/src/db/migrations/meta/_journal.json
 M backend-pet-tracker/src/db/schema/reminders.schema.ts
?? backend-pet-tracker/src/db/migrations/0020_reminders_recurrence.sql
?? backend-pet-tracker/src/db/migrations/meta/0020_snapshot.json
?? progress/impl_reminders-recurrence.md
```

Los cambios sin commit de C2 se preservan para revisión: schema, SQL, snapshot y journal. La BD `pet_tracker_wt210` ya tiene la migración 0020 aplicada (21 filas). No se ejecuta rollback ni se editan artefactos generados. No se cambió feature_list.json, STATUS.md, progress/current.md, history.md ni el handoff.

## Reanudación 1

2026-10-26: leader aprobó E9 en e6754281; se cambia solo minute → min en la fila R1 de C1. C2 conserva los artefactos generados y la migración ya aplicada. Se retoma la cadena completa desde C2. Las secciones anteriores describen la primera parada y se conservan como histórico.

### C2-resume — a21772ae feat(reminders): #210 R1 recurrence columns, CHECKs and additive migration

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 15 passed, 15 total
Tests:       144 passed, 144 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
```

### C3 — 361c280b test(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 1):
```text
  ● #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence until sin recurrence
  ● #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence until el día anterior
  ● #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence zona del dueño decide (UTC)
  ● #210 R7: ocurrencias desde el ancla › #210 R7: hour 8 desde UTC da 2026-12-31T20:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: day 1 desde UTC da 2026-12-31T09:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: day 3 desde America/Mexico_City da 2026-01-30T15:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: week 2 desde UTC da 2026-12-24T15:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: month 1 desde UTC da 2026-01-31T15:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: month 1 desde UTC da 2026-01-31T15:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: month 1 desde UTC da 2026-01-31T15:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: month 2 desde UTC da 2026-12-31T15:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: year 1 desde UTC da 2028-02-29T15:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: year 1 desde UTC da 2028-02-29T15:00:00.000Z
  ● #210 R7: ocurrencias desde el ancla › #210 R7: year 3 desde UTC da 2026-12-31T15:00:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-03-07T15:00:00.000Z da 2026-03-07T15:00:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-10-31T14:00:00.000Z da 2026-10-31T14:00:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/Mexico_City desde 2026-03-07T16:00:00.000Z da 2026-03-07T16:00:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-03-07T07:30:00.000Z da 2026-03-07T07:30:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-03-07T07:30:00.000Z da 2026-03-08T07:30:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-10-31T05:30:00.000Z da 2026-10-31T05:30:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: hour 1 en America/New_York desde 2026-11-01T05:30:00.000Z da 2026-11-01T05:30:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: hour 24 en America/New_York desde 2026-03-07T15:00:00.000Z da 2026-03-07T15:00:00.000Z
  ● #210 R8: ocurrencias desde el ancla › #210 R8: month 1 en America/Mexico_City desde 2026-01-31T05:30:00.000Z da 2026-01-31T05:30:00.000Z
  ● #210 R9: primera ocurrencia con aviso futuro › #210 R9: day 1 aviso 60 now 2027-01-04T12:00:00.000Z
  ● #210 R9: primera ocurrencia con aviso futuro › #210 R9: hour 1 aviso 30 now 2027-01-01T00:40:00.000Z
  ● #210 R9: primera ocurrencia con aviso futuro › #210 R9: hour 1 aviso 30 now 2026-12-31T22:30:00.000Z
  ● #210 R9: primera ocurrencia con aviso futuro › #210 R9: day 1 aviso 10080 now 2026-12-18T09:00:00.000Z
  ● #210 R10: until inclusivo › #210 R10: until 2026-11-01 en America/Mexico_City da 2026-11-02T03:00:00.000Z
  ● #210 R10: until inclusivo › #210 R10: until 2026-10-31 en America/Mexico_City da null
  ● #210 R10: until inclusivo › #210 R10: until 2026-11-01 en UTC da null
  ● #210 R10: until inclusivo › #210 R10: until null en America/Mexico_City da 2026-11-02T03:00:00.000Z
Test Suites: 1 failed, 15 passed, 16 total
Tests:       31 failed, 147 passed, 178 total
    expect(received).toThrow(expected)
    > 59 |       if (throws) expect(validate).toThrow(InvalidRecurrenceError);
      60 |       else expect(validate).not.toThrow();
    expect(received).toThrow(expected)
    > 59 |       if (throws) expect(validate).toThrow(InvalidRecurrenceError);
      60 |       else expect(validate).not.toThrow();
    expect(received).toThrow(expected)
    > 59 |       if (throws) expect(validate).toThrow(InvalidRecurrenceError);
      60 |       else expect(validate).not.toThrow();
    expect(received).toBe(expected) // Object.is equality
    Expected: "2027-01-01T04:00:00.000Z"
    Received: "2026-12-31T20:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2027-01-01T09:00:00.000Z"
    Received: "2026-12-31T09:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-02-02T15:00:00.000Z"
    Received: "2026-01-30T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2027-01-07T15:00:00.000Z"
    Received: "2026-12-24T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-02-28T15:00:00.000Z"
    Received: "2026-01-31T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-03-31T15:00:00.000Z"
    Received: "2026-02-28T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-04-30T15:00:00.000Z"
    Received: "2026-03-31T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2027-02-28T15:00:00.000Z"
    Received: "2026-12-31T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2029-02-28T15:00:00.000Z"
    Received: "2028-02-29T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2032-02-29T15:00:00.000Z"
    Received: "2031-02-28T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2029-12-31T15:00:00.000Z"
    Received: "2026-12-31T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-03-08T14:00:00.000Z"
    Received: "2026-03-07T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-11-01T15:00:00.000Z"
    Received: "2026-10-31T14:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-03-08T16:00:00.000Z"
    Received: "2026-03-07T16:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-03-08T07:30:00.000Z"
    Received: "2026-03-07T07:30:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-03-09T06:30:00.000Z"
    Received: "2026-03-08T07:30:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-11-01T05:30:00.000Z"
    Received: "2026-10-31T05:30:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-11-01T06:30:00.000Z"
    Received: "2026-11-01T05:30:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-03-08T15:00:00.000Z"
    Received: "2026-03-07T15:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-03-01T05:30:00.000Z"
    Received: "2026-01-31T05:30:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2027-01-05T09:00:00.000Z"
    Received: "2026-12-25T09:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2027-01-01T02:00:00.000Z"
    Received: "2026-12-31T22:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2027-01-01T00:00:00.000Z"
    Received: "2026-12-31T22:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-12-26T09:00:00.000Z"
    Received: "2026-12-25T09:00:00.000Z"
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-11-02T03:00:00.000Z"
    Received: "2026-10-31T03:00:00.000Z"
      360 |     if (expected === null) expect(result).toBeNull();
    > 361 |     else expect(result?.toISOString()).toBe(expected);
    expect(received).toBeNull()
    Received: 2026-10-31T03:00:00.000Z
    > 360 |     if (expected === null) expect(result).toBeNull();
      361 |     else expect(result?.toISOString()).toBe(expected);
    expect(received).toBeNull()
    Received: 2026-10-31T03:00:00.000Z
    > 360 |     if (expected === null) expect(result).toBeNull();
      361 |     else expect(result?.toISOString()).toBe(expected);
    expect(received).toBe(expected) // Object.is equality
    Expected: "2026-11-02T03:00:00.000Z"
    Received: "2026-10-31T03:00:00.000Z"
      360 |     if (expected === null) expect(result).toBeNull();
    > 361 |     else expect(result?.toISOString()).toBe(expected);
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
```

### C4 — 16229e29 feat(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 16 passed, 16 total
Tests:       178 passed, 178 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
```

### M1 — assertValidRecurrence lanza siempre; las tres filas no-lanza nacidas verdes fallan

Comando: pnpm exec jest src/modules/reminders/application/recurrence.spec.ts -t "#210 R3:". Exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/application/recurrence.ts y git diff --quiet HEAD -- src/modules/reminders/application/recurrence.ts: exit 0.

```text
  ● #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence until el mismo día local
    expect(received).not.toThrow()
  ● #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence zona del dueño decide (MX)
    expect(received).not.toThrow()
  ● #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence serie sin until
    expect(received).not.toThrow()
Test Suites: 1 failed, 1 total
Tests:       3 failed, 28 skipped, 3 passed, 34 total
```

Nota C3: la primera pasada de ESLint rechazó un cast redundante en el test nuevo; eliminado antes de repetir la cadena y commitear. C4 conserva los milisegundos por separado porque offsetMsAt trabaja a resolución de segundos. No cambia código existente del helper.

### C5 — 74d31b82 test(reminders): #210 R2 zod validation of recurrence

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 1):
```text
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza hour bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza day bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza week bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza month bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza year bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza hour sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza day sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza week sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza month sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza year sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza every decimal en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza unit desconocida en recurrence.unit
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza every ausente en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza clave extra en recurrence
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza recurrence string en recurrence
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza dia inexistente en recurrenceUntil
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza fecha con hora en recurrenceUntil
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite hour
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite hour
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite day
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite day
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite week
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite week
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite month
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite month
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite year
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite year
  ● #210 R2: validacion zod de recurrencia › #210 R2: POST trata recurrence null como ausente
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza hour bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza day bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza week bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza month bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza year bajo minimo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza hour sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza day sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza week sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza month sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza year sobre maximo en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza every decimal en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza unit desconocida en recurrence.unit
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza every ausente en recurrence.every
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza clave extra en recurrence
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza recurrence string en recurrence
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza dia inexistente en recurrenceUntil
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza fecha con hora en recurrenceUntil
  ● #210 R2: validacion zod de recurrencia › #210 R2: PATCH acepta recurrence y recurrenceUntil null y validos
Test Suites: 1 failed, 15 passed, 16 total
Tests:       46 failed, 178 passed, 224 total
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toContain(expected) // indexOf
      135 |     expect(parsed.success).toBe(false);
    > 136 |     expect(parsed.error?.issues.map((issue) => issue.path.join('.'))).toContain(
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
      165 |     expect(absent.success).toBe(true);
    > 166 |     expect(withNull.success).toBe(true);
      168 |       expect(withNull.data).toEqual({ ...absent.data, recurrence: null });
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toContain(expected) // indexOf
      176 |       expect(
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    > 188 |       expect(UpdateReminderSchema.safeParse(body).success).toBe(true);
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
```

### C6 — 74a0222c feat(reminders): #210 R2 zod validation of recurrence

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 16 passed, 16 total
Tests:       224 passed, 224 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
```

Filas nacidas verdes: C3 R3 no-lanza (mismo día local, MX y serie sin until) por stub no-op; M1 demostró sus tres rojos. C7 R4 sin recurrence usa null sin leer pets; se verificará con M2 tras C8. E4 medida tras C7: update 2/2, list 1/1, dispatch 5/5, notifier 1/1 (constructores/recurrence null).

### C7 — 1484fec6 test(reminders): #210 R4 POST persists the series

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 1):
```text
  ● #210 R4: POST persiste la serie › #210 R4: crea la serie con anchorAt igual a dueAt
Test Suites: 1 failed, 16 passed, 17 total
Tests:       1 failed, 225 passed, 226 total
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    > 44 |     expect(create).toHaveBeenCalledWith({
```

e2e (exit 1):
```text
  ● Pet reminders (e2e) › #210 R4: persistencia de recurrencia › #210 R4: POST con recurrence guarda las cuatro columnas
Test Suites: 1 failed, 1 total
Tests:       1 failed, 59 passed, 60 total
    expect(received).toMatchObject(expected)
    > 877 |       expect(row).toMatchObject({
```

Nota C7: la primera corrida de tsc detectó TS2783 en los cinco constructores E4 con spread. Se movió la nueva propiedad recurrence tras el spread (sin otra enmienda) y se repitió la cadena; los rojos finales son solo aserciones R4.

### C8 — a56a501e feat(reminders): #210 R4 POST persists the series

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 17 passed, 17 total
Tests:       226 passed, 226 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       60 passed, 60 total
```

### M2 — create consulta findOwnerTimezone incondicionalmente

Comando: pnpm exec jest src/modules/reminders/application/use-cases/create-reminder.use-case.spec.ts. Exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/application/use-cases/create-reminder.use-case.ts y git diff --quiet HEAD -- src/modules/reminders/application/use-cases/create-reminder.use-case.ts: exit 0.

```text
  ● #210 R4: POST persiste la serie › #210 R4: sin recurrence crea recurrence null y no consulta la zona
    expect(jest.fn()).not.toHaveBeenCalled()
      56 |     expect(create).toHaveBeenCalledWith({ ...expected, recurrence: null });
    > 57 |     expect(findOwnerTimezone).not.toHaveBeenCalled();
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

### C9 — df6f04d2 test(reminders): #210 R5 response shape with recurrence

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 17 passed, 17 total
Tests:       226 passed, 226 total
```

e2e (exit 1):
```text
  ● Pet reminders (e2e) › R2: POST crea reminder programado con shape exacto › persiste defaults, actor y token vigente
  ● Pet reminders (e2e) › #210 R5: respuesta publica de las series › #210 R5: GET POST y PATCH devuelven recurrence y recurrenceUntil sin el ancla
Test Suites: 1 failed, 1 total
Tests:       2 failed, 59 passed, 61 total
    expect(received).toEqual(expected) // deep equality
      328 |         .expect(201);
    > 330 |       expect(Object.keys(response.body as object).sort()).toEqual(
    expect(received).toEqual(expected) // deep equality
    > 926 |         expect(created.body).toEqual(expected);
```

### C10 — aa81fd6a feat(reminders): #210 R5 response shape with recurrence

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 17 passed, 17 total
Tests:       226 passed, 226 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       61 passed, 61 total
```

### C11 — c14caa03 test(reminders): #210 R3 R6 cross-field rules and series PATCH

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 1):
```text
  ● #210 R6: edicion de la serie › #210 R6: PATCH recurrence nueva
  ● #210 R6: edicion de la serie › #210 R6: PATCH recurrence null
  ● #210 R6: edicion de la serie › #210 R6: PATCH recurrenceUntil fecha
  ● #210 R6: edicion de la serie › #210 R6: PATCH recurrenceUntil null
  ● #210 R6: edicion de la serie › #210 R6: PATCH dueAt reancla
  ● #210 R6: edicion de la serie › #210 R6: PATCH until sobre one-shot
  ● #210 R6: edicion de la serie › #210 R6: PATCH recurrence null con until
Test Suites: 1 failed, 16 passed, 17 total
Tests:       7 failed, 227 passed, 234 total
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    > 215 |       expect(stubs.reschedule).toHaveBeenCalledWith(
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    > 215 |       expect(stubs.reschedule).toHaveBeenCalledWith(
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    > 215 |       expect(stubs.reschedule).toHaveBeenCalledWith(
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    > 215 |       expect(stubs.reschedule).toHaveBeenCalledWith(
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    > 215 |       expect(stubs.reschedule).toHaveBeenCalledWith(
    expect(received).rejects.toThrow()
    > 207 |       await expect(result).rejects.toThrow(InvalidRecurrenceError);
      208 |       expect(stubs.reschedule).not.toHaveBeenCalled();
    expect(received).rejects.toThrow()
    > 207 |       await expect(result).rejects.toThrow(InvalidRecurrenceError);
      208 |       expect(stubs.reschedule).not.toHaveBeenCalled();
```

e2e (exit 1):
```text
  ● Pet reminders (e2e) › #210 R3: reglas cruzadas en HTTP › #210 R3: POST con recurrenceUntil sin recurrence responde 400 sin insertar
  ● Pet reminders (e2e) › #210 R3: reglas cruzadas en HTTP › #210 R3: PATCH que deja until antes de dueAt responde 400 sin cambiar la fila
  ● Pet reminders (e2e) › #210 R6: PATCH de las columnas de recurrencia › #210 R6: PATCH reancla, conserva y limpia columnas de la serie
Test Suites: 1 failed, 1 total
Tests:       3 failed, 61 passed, 64 total
    > 957 |         .expect(400);
      958 |       expect(response.body).toEqual({
    > 988 |         .expect(400);
      989 |       expect(response.body).toEqual({
    expect(received).toMatchObject(expected)
      1024 |         .expect(200);
    > 1026 |       expect(row).toMatchObject({
```

C11: nace verde solo title de R6 (changes sin recurrence); M3 tras C12. La primera pasada lint señaló acceso any al segundo argumento del mock; se tipó la llamada como unknown[] antes de medir el rojo.

### C12 — dabe90a9 feat(reminders): #210 R3 R6 cross-field rules and series PATCH

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 17 passed, 17 total
Tests:       234 passed, 234 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       64 passed, 64 total
```

### M3 — update pasa siempre recurrence en changes

Comando: pnpm exec jest src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts -t "solo title". Exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/application/use-cases/update-reminder.use-case.ts y git diff --quiet HEAD -- src/modules/reminders/application/use-cases/update-reminder.use-case.ts: exit 0.

```text
  ● #210 R6: edicion de la serie › #210 R6: PATCH solo title
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    > 215 |       expect(stubs.reschedule).toHaveBeenCalledWith(
Test Suites: 1 failed, 1 total
Tests:       1 failed, 13 skipped, 14 total
```

### C13 — 5cc759e5 test(reminders): #210 R13 writes conditioned on schedule_name

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 1):
```text
  ● R5: dispatcher encola vencidos una sola vez › publica en orden dueAt y marca enqueuedAt solo despues de cada send
  ● R5: dispatcher encola vencidos una sola vez › un send fallido queda sin marcar y no frena las filas siguientes
  ● #125 R2: el dispatcher escribe en el cuerpo cuándo vence, en la zona del owner de cada mascota › si la zona del owner no se puede leer, esa fila no se encola y las siguientes sí
Test Suites: 1 failed, 16 passed, 17 total
Tests:       3 failed, 231 passed, 234 total
    expect(received).toEqual(expected) // deep equality
    > 108 |     expect(repository.markEnqueued.mock.calls).toEqual([
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
      151 |     expect(repository.markEnqueued).toHaveBeenCalledTimes(1);
    > 152 |     expect(repository.markEnqueued).toHaveBeenCalledWith(
    expect(received).toEqual(expected) // deep equality
    > 292 |     expect(repository.markEnqueued.mock.calls).toEqual([
      295 |     expect(logError).toHaveBeenCalled();
```

e2e (exit 1):
```text
  ● Pet reminders (e2e) › #210 R13: escrituras condicionadas al schedule › #210 R13: markEnqueued con scheduleName viejo no toca enqueued_at
  ● Pet reminders (e2e) › #210 R13: escrituras condicionadas al schedule › #210 R13: advanceOccurrence solo avanza la fila con su scheduleName y scheduled
Test Suites: 1 failed, 1 total
Tests:       2 failed, 64 passed, 66 total
    expect(received).toBeNull()
    Received: 2026-10-26T19:15:47.427Z
      1083 |       expect(afterCurrent.enqueuedAt).toEqual(at);
    > 1084 |       expect(afterOld.enqueuedAt).toBeNull();
    expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    > 1115 |         expect(advanced).toBe(mode === 'current');
      1116 |         expect(after).toEqual(
```

C13 nacen verdes: markEnqueued con el nombre vigente, advanceOccurrence false para nombre viejo y cancelled; se ejecutan antes de las aserciones rojas en ambos E2E. La expectativa negativa E2 de envío fallido conserva su comportamiento; M8 tras C14 la tensiona. El parámetro scheduleName del stub de markEnqueued usa void para lint hasta C14.

### C14 — 19edcd1f feat(reminders): #210 R13 writes conditioned on schedule_name

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 17 passed, 17 total
Tests:       234 passed, 234 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       66 passed, 66 total
```

### M5 — advanceOccurrence sin condicion schedule_name; nombre viejo avanza indebidamente

Comando: pnpm exec jest --config ./test/jest-e2e.json pet-reminders -t "#210 R13: advanceOccurrence". Exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts y git diff --quiet HEAD -- src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts: exit 0.

```text
  ● Pet reminders (e2e) › #210 R13: escrituras condicionadas al schedule › #210 R13: advanceOccurrence solo avanza la fila con su scheduleName y scheduled
    expect(received).toBe(expected) // Object.is equality
    Expected: false
    Received: true
    > 1115 |         expect(advanced).toBe(mode === 'current');
      1116 |         expect(after).toEqual(
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 skipped, 66 total
```

### M6 — advanceOccurrence sin condicion status; cancelled avanza indebidamente

Comando: pnpm exec jest --config ./test/jest-e2e.json pet-reminders -t "#210 R13: advanceOccurrence". Exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts y git diff --quiet HEAD -- src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts: exit 0.

```text
  ● Pet reminders (e2e) › #210 R13: escrituras condicionadas al schedule › #210 R13: advanceOccurrence solo avanza la fila con su scheduleName y scheduled
    expect(received).toBe(expected) // Object.is equality
    Expected: false
    Received: true
    > 1115 |         expect(advanced).toBe(mode === 'current');
      1116 |         expect(after).toEqual(
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 skipped, 66 total
```

### M7 — markEnqueued usa schedule_name fijo x; no escribe con el vigente

Comando: pnpm exec jest --config ./test/jest-e2e.json pet-reminders -t "#210 R13: markEnqueued". Exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts y git diff --quiet HEAD -- src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts: exit 0.

```text
  ● Pet reminders (e2e) › #210 R13: escrituras condicionadas al schedule › #210 R13: markEnqueued con scheduleName viejo no toca enqueued_at
    expect(received).toEqual(expected) // deep equality
    Expected: 2026-10-26T19:17:39.885Z
    Received: null
    > 1083 |       expect(afterCurrent.enqueuedAt).toEqual(at);
      1084 |       expect(afterOld.enqueuedAt).toBeNull();
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 skipped, 66 total
```

### M8 — dispatcher llama markEnqueued tambien para el envio fallido; E2 detecta dos llamadas

Comando: pnpm exec jest src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts -t "un send fallido". Exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/infrastructure/reminders-dispatch.service.ts y git diff --quiet HEAD -- src/modules/reminders/infrastructure/reminders-dispatch.service.ts: exit 0.

```text
  ● R5: dispatcher encola vencidos una sola vez › un send fallido queda sin marcar y no frena las filas siguientes
    expect(jest.fn()).toHaveBeenCalledTimes(expected)
    > 151 |     expect(repository.markEnqueued).toHaveBeenCalledTimes(1);
      152 |     expect(repository.markEnqueued).toHaveBeenCalledWith(
Test Suites: 1 failed, 1 total
Tests:       1 failed, 5 skipped, 6 total
```

## Reanudación 1 — segunda parada: literal de E2 frente a Prettier

Tras C14 se midieron las cinco guardas E2 del handoff. Se esperaba una línea de cada literal nuevo. Resultado:

```text
$ grep -cF '[first.id, first.scheduleName, NOW],' src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts
1
exit 0
$ grep -cF '[second.id, second.scheduleName, NOW],' src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts
1
exit 0
$ grep -cF 'toHaveBeenCalledWith(sent.id, sent.scheduleName, NOW)' src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts
0
exit 1
$ grep -cF 'not.toHaveBeenCalledWith(failed.id, failed.scheduleName, NOW)' src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts
0
exit 1
$ grep -cF 'toEqual([[sent.id, sent.scheduleName, NOW]])' src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts
0
exit 1
```

Prettier divide los argumentos de las tres llamadas largas (toHaveBeenCalledWith para sent y failed, y toEqual de la última prueba). Los argumentos esperados están presentes y son correctos: C14 pasó los 234 unitarios y 66 E2E. La configuración de formato y el grep de una sola línea son incompatibles en estas tres llamadas. No se añade prettier-ignore, no se cambia configuración, no se reescribe la spec ni se modifica un test fuera de su enmienda para forzar la cifra.

La orden aplicable es: «Si una cifra o un ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta». Las guardas se detectaron después de C14 y M5–M8; debieron medirse inmediatamente después de C13. Se deja constancia de esa medición tardía. Se necesita enmendar la guarda para tolerar el formato de Prettier, o aprobar explícitamente otro formato para esas líneas, antes de continuar.

### C15 — preparado sin commit al detectar la guarda

Cambios: test R12 nuevo; E1 cambia solo data esperado del push; E5 cambia solo data esperado del push E2E. Contrato SQS intacto. Prettier write/check, ESLint y tsc: exit 0. Cadena unitaria exit 1 y E2E exit 1 (pgrep vacío antes), por las aserciones previstas. No hay cambios de producción de C15/C16.

```text
unit
  ● R7 (pet-reminders #16): notifier procesa reminder idempotentemente › envia push, marca sent despues y borra el mensaje
  ● #210 R12: data del push de reminder › #210 R12: el push de reminder lleva kind en data
Test Suites: 1 failed, 16 passed, 17 total
Tests:       2 failed, 233 passed, 235 total
```

```text
R7 (pet-reminders #16): notifier procesa reminder idempotentemente › envia push, marca sent despues y borra el mensaje

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"data": {"kind": "reminder", "petId": "01924a3f-0000-7000-8000-0000000000aa", "reminderId": "01924a3f-0000-7000-8000-0000000000cc"}, "tokens": ["ExponentPushToken[aaaaaaaaaaaaaaaaaaaaAA]"]}
    Received: {"body": "Recordatorio: Desparasitación", "data": {"petId": "01924a3f-0000-7000-8000-0000000000aa", "reminderId": "01924a3f-0000-7000-8000-0000000000cc"}, "messageId": "msg-receipt-1", "title": "Desparasitación", "tokens": ["ExponentPushToken[aaaaaaaaaaaaaaaaaaaaAA]"]}

    Number of calls: 1

      415 |     await reminderService(sqs, tokens, sender, reminders.client).drainOnce();
      416 |
    > 417 |     expect(sender.send).toHaveBeenCalledWith(
          |                         ^
      418 |       expect.objectContaining({
      419 |         tokens: [TOKEN_A],
      420 |         data: { petId: PET_ID, reminderId: REMINDER_ID, kind: 'reminder' },
```

```text
#210 R12: data del push de reminder › #210 R12: el push de reminder lleva kind en data

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
    -   "kind": "reminder",
        "petId": "01924a3f-0000-7000-8000-0000000000aa",
        "reminderId": "01924a3f-0000-7000-8000-0000000000cc",
      }

      528 |     expect(sender.send).toHaveBeenCalledTimes(1);
      529 |     const push = (sender.send.mock.calls[0] as [{ data: unknown }])[0];
    > 530 |     expect(push.data).toEqual({
          |                       ^
      531 |       petId: PET_ID,
      532 |       reminderId: REMINDER_ID,
      533 |       kind: 'reminder',
```

```text
e2e
  ● Pet reminders (e2e) › R7: create, dispatch y notifier dejan sent sin duplicar push › procesa la cadena real y un segundo tick no vuelve a enviar
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
```

```text
Pet reminders (e2e) › R7: create, dispatch y notifier dejan sent sin duplicar push › procesa la cadena real y un segundo tick no vuelve a enviar

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"data": {"kind": "reminder", "petId": "01a179a6-7619-7510-894c-6d0b7c3ef804", "reminderId": "01a179a6-7639-7f94-8703-79d9d61e8e82"}}
    Received: {"body": "Recordatorio: Desparasitación · 26 de octubre a las 19:19", "data": {"petId": "01a179a6-7619-7510-894c-6d0b7c3ef804", "reminderId": "01a179a6-7639-7f94-8703-79d9d61e8e82"}, "messageId": "e880a341-2eab-41a3-97d3-050aa879ec66", "title": "Desparasitación", "tokens": ["ExponentPushToken[reminders-1793042313415]"]}

    Number of calls: 1

      503 |
      504 |       expect(sendPush).toHaveBeenCalledTimes(1);
    > 505 |       expect(sendPush).toHaveBeenCalledWith(
          |                        ^
      506 |         expect.objectContaining({
      507 |           data: { petId: pet.id, reminderId, kind: 'reminder' },
      508 |         }),
```

### M8: detalle de la aserción que intercepta el fallo

La mutación añade el markEnqueued de la fila cuyo envío falló. El test E2 falla primero en `expect(repository.markEnqueued).toHaveBeenCalledTimes(1)` (recibe 2), antes de llegar a su expectativa negativa `not.toHaveBeenCalledWith(failed...)`. Se preserva el orden del test H0, como exige la lista cerrada de enmiendas. La mutación está revertida con diff exit 0.

### Estado final de esta reanudación

- C2–C14 medidos y commiteados en orden; se conserva C1 y el commit de errata del leader.
- C15 tests sin commit; C16–C20 no empezados. Traceability sin tocar porque solo se autoriza en C20.
- Cierre global (suite completa final, notifier de alertas final, lint final, graphify y tabla final de 29 archivos) no ejecutado por el STOP. T0 completo y de alertas ya estaban medidos en verde antes de C1.
- No se ejecutó init.sh, push, PR, merge ni rebase. No se modificaron dependencias ni los archivos de bookkeeping del leader.
- Los logs AWS SDK avisan que el runtime de pnpm usa Node v20.20.2, aunque el handoff describe v24. Todas las filas de calendario y DST de la selección fueron verdes en C14; no se cambió el runtime.
- Marcador .done ausente según la orden de Reanudación 1.

Últimos commits:

```text
19edcd1f feat(reminders): #210 R13 writes conditioned on schedule_name
5cc759e5 test(reminders): #210 R13 writes conditioned on schedule_name
dabe90a9 feat(reminders): #210 R3 R6 cross-field rules and series PATCH
c14caa03 test(reminders): #210 R3 R6 cross-field rules and series PATCH
aa81fd6a feat(reminders): #210 R5 response shape with recurrence
df6f04d2 test(reminders): #210 R5 response shape with recurrence
a56a501e feat(reminders): #210 R4 POST persists the series
1484fec6 test(reminders): #210 R4 POST persists the series
74a0222c feat(reminders): #210 R2 zod validation of recurrence
74d31b82 test(reminders): #210 R2 zod validation of recurrence
16229e29 feat(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation
361c280b test(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation
a21772ae feat(reminders): #210 R1 recurrence columns, CHECKs and additive migration
e6754281 docs(spec): #210 errata E9 and resume 1 after the C2 stop
ea3f36b2 test(reminders): #210 R1 recurrence columns and CHECKs
```

Árbol entregado:

```text
 M src/workers/notifier/notifier-consumer.service.spec.ts
 M test/pet-reminders.e2e-spec.ts
?? ../progress/impl_reminders-recurrence.md
```

## Reanudación 2

2026-10-26: autorización del leader en 42d5143a. Se preservan los dos tests de C15 y se continúa desde su cadena. Las cinco guardas E2 base normalizadas dan 0 0 0 0 0 y las cinco nuevas 1 1 1 1 1 con la función s del handoff (tr -d espacios/saltos + grep -oF + wc -l). La medición literal anterior se conserva como histórico. No se modifica reminders-dispatch.service.spec.ts. E1 base/nuevo: 1/1; E5 base/nuevo: 0/1.

### C15-resume2 — a5e419c4 test(reminders): #210 R12 kind in the reminder push data

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 1):
```text
  ● R7 (pet-reminders #16): notifier procesa reminder idempotentemente › envia push, marca sent despues y borra el mensaje
  ● #210 R12: data del push de reminder › #210 R12: el push de reminder lleva kind en data
Test Suites: 1 failed, 16 passed, 17 total
Tests:       2 failed, 233 passed, 235 total
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: ObjectContaining {"data": {"kind": "reminder", "petId": "01924a3f-0000-7000-8000-0000000000aa", "reminderId": "01924a3f-0000-7000-8000-0000000000cc"}, "tokens": ["ExponentPushToken[aaaaaaaaaaaaaaaaaaaaAA]"]}
    Received: {"body": "Recordatorio: Desparasitación", "data": {"petId": "01924a3f-0000-7000-8000-0000000000aa", "reminderId": "01924a3f-0000-7000-8000-0000000000cc"}, "messageId": "msg-receipt-1", "title": "Desparasitación", "tokens": ["ExponentPushToken[aaaaaaaaaaaaaaaaaaaaAA]"]}
    > 417 |     expect(sender.send).toHaveBeenCalledWith(
    expect(received).toEqual(expected) // deep equality
      528 |     expect(sender.send).toHaveBeenCalledTimes(1);
    > 530 |     expect(push.data).toEqual({
```

e2e (exit 1):
```text
  ● Pet reminders (e2e) › R7: create, dispatch y notifier dejan sent sin duplicar push › procesa la cadena real y un segundo tick no vuelve a enviar
Test Suites: 1 failed, 1 total
Tests:       1 failed, 65 passed, 66 total
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: ObjectContaining {"data": {"kind": "reminder", "petId": "01a179ab-a337-7efe-8f23-98a9104cdb37", "reminderId": "01a179ab-a355-78ac-b783-ca8359d20df3"}}
    Received: {"body": "Recordatorio: Desparasitación · 26 de octubre a las 19:25", "data": {"petId": "01a179ab-a337-7efe-8f23-98a9104cdb37", "reminderId": "01a179ab-a355-78ac-b783-ca8359d20df3"}, "messageId": "ffebf02c-f232-464f-840a-c8ea94e430a3", "title": "Desparasitación", "tokens": ["ExponentPushToken[reminders-1793042652078]"]}
      504 |       expect(sendPush).toHaveBeenCalledTimes(1);
    > 505 |       expect(sendPush).toHaveBeenCalledWith(
```

### C16 — fa2b0d88 feat(reminders): #210 R12 kind in the reminder push data

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 17 passed, 17 total
Tests:       235 passed, 235 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       66 passed, 66 total
```

### C17 — 7414d330 test(reminders): #210 R11 notifier advances the series

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 1):
```text
  ● #210 R11: el notifier avanza la serie › #210 R11: serie avanza con advanceOccurrence y no marca sent
  ● #210 R11: el notifier avanza la serie › #210 R11: zona America/New_York da la siguiente ocurrencia 2026-03-08T14:00:00.000Z
  ● #210 R11: el notifier avanza la serie › #210 R11: zona null da la siguiente ocurrencia 2026-03-08T15:00:00.000Z
  ● #210 R11: el notifier avanza la serie › #210 R11: zona Mars/Base da la siguiente ocurrencia 2026-03-08T15:00:00.000Z
  ● #210 R11: el notifier avanza la serie › #210 R13: advanceOccurrence false registra stale_schedule y borra el mensaje
Test Suites: 1 failed, 16 passed, 17 total
Tests:       5 failed, 236 passed, 241 total
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: "01924a3f-0000-7000-8000-0000000000cc", "reminder-01924a3f-0000-7000-8000-0000000000cc", 2026-03-08T15:00:00.000Z, StringMatching /^reminder-[0-9a-f-]{36}$/
    > 578 |     expect(reminders.advanceOccurrence).toHaveBeenCalledWith(
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: "01924a3f-0000-7000-8000-0000000000cc", "reminder-01924a3f-0000-7000-8000-0000000000cc", 2026-03-08T14:00:00.000Z, StringMatching /^reminder-[0-9a-f-]{36}$/
    > 646 |     expect(reminders.advanceOccurrence).toHaveBeenCalledWith(
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: "01924a3f-0000-7000-8000-0000000000cc", "reminder-01924a3f-0000-7000-8000-0000000000cc", 2026-03-08T15:00:00.000Z, StringMatching /^reminder-[0-9a-f-]{36}$/
    > 646 |     expect(reminders.advanceOccurrence).toHaveBeenCalledWith(
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: "01924a3f-0000-7000-8000-0000000000cc", "reminder-01924a3f-0000-7000-8000-0000000000cc", 2026-03-08T15:00:00.000Z, StringMatching /^reminder-[0-9a-f-]{36}$/
    > 646 |     expect(reminders.advanceOccurrence).toHaveBeenCalledWith(
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: ObjectContaining {"skipped": "stale_schedule"}
    > 679 |     expect(logInfo).toHaveBeenCalledWith(
      682 |     expect(reminders.markSent).not.toHaveBeenCalled();
```

e2e (exit 1):
```text
  ● Pet reminders (e2e) › #210 R11: avance de series en la cadena real › #210 R11: una serie diaria vuelve a scheduled en la siguiente ocurrencia sin duplicar push
Test Suites: 1 failed, 1 total
Tests:       1 failed, 67 passed, 68 total
    expect(received).toMatchObject(expected)
    > 1179 |       expect(row).toMatchObject({
```

C17: nacen verdes los dos casos de fin por until (unit y E2E) porque el notifier anterior marca sent siempre; M4 tras C18 los pone rojos. Primera pasada lint: se eliminó un non-null assertion redundante en el test nuevo de zona y se usa la spy logInfo para evitar unbound-method. Ambas correcciones previas al commit rojo. Los E2E emiten errores de contrato para las filas R1 sembradas por SQL con schedule_name null: el contrato SQS permanece congelado, y solo falla la aserción diaria prevista; no se alteran esas filas ni tests anteriores.

### C18 — 28c4a459 feat(reminders): #210 R11 notifier advances the series

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 17 passed, 17 total
Tests:       241 passed, 241 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       68 passed, 68 total
```

### M4 — nextOccurrence ignora until; fin de serie unitario y E2E fallan

Comando: pnpm exec jest src/workers/notifier/notifier-consumer.service.spec.ts -t "serie pasada de until"; pnpm exec jest --config ./test/jest-e2e.json pet-reminders -t "una serie con until". Ambos comandos exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/application/recurrence.ts y git diff --quiet HEAD -- src/modules/reminders/application/recurrence.ts: exit 0.

```text
  ● #210 R11: el notifier avanza la serie › #210 R11: serie pasada de until marca sent y no avanza
    expect(jest.fn()).toHaveBeenCalledWith(...expected)
    Expected: "01924a3f-0000-7000-8000-0000000000cc"
    > 617 |     expect(reminders.markSent).toHaveBeenCalledWith(REMINDER_ID);
      618 |     expect(reminders.advanceOccurrence).not.toHaveBeenCalled();
      619 |     expect(sqs.deleted).toEqual(['receipt-1']);
Test Suites: 1 failed, 1 total
Tests:       1 failed, 24 skipped, 25 total
  ● Pet reminders (e2e) › #210 R11: avance de series en la cadena real › #210 R11: una serie con until en su dia termina en sent
    expect(received).toBe(expected) // Object.is equality
    Expected: "sent"
    Received: "scheduled"
    > 1194 |       expect(row.status).toBe('sent');
Test Suites: 1 failed, 1 total
Tests:       1 failed, 68 skipped, 69 total
```

### C19 — 5a8fd10c test(reminders): #210 R14 opaque 404 with recurrence bodies

Formato, prettier --check, eslint y tsc: exit 0. Comandos: prettier --write/check y eslint sobre los .ts de este commit; tsc --noEmit -p tsconfig.json. Unitarios: comando de selección de la feature del handoff. E2E: pnpm exec jest --config ./test/jest-e2e.json pet-reminders, pgrep vacío antes.

unit (exit 0):
```text
Test Suites: 17 passed, 17 total
Tests:       241 passed, 241 total
```

e2e (exit 0):
```text
Test Suites: 1 passed, 1 total
Tests:       69 passed, 69 total
```

### M9 — assertValidRecurrence se adelanta a la membresia; cuerpo ajeno devuelve 400 frente a 404 inexistente

Comando: pnpm exec jest --config ./test/jest-e2e.json pet-reminders -t "#210 R14:". Exit 1 por aserción; reversión con git checkout HEAD -- src/modules/reminders/application/use-cases/update-reminder.use-case.ts y git diff --quiet HEAD -- src/modules/reminders/application/use-cases/update-reminder.use-case.ts: exit 0.

```text
  ● Pet reminders (e2e) › #210 R14: autorizacion opaca de recurrencia › #210 R14: PATCH con recurrenceUntil invalido sobre reminder ajeno responde el mismo 404
    expect(received).toBe(expected) // Object.is equality
    Expected: 404
    Received: 400
      1215 |       expect(missing.status).toBe(404);
    > 1216 |       expect(foreign.status).toBe(missing.status);
      1217 |       expect(foreign.body).toEqual(missing.body);
Test Suites: 1 failed, 1 total
Tests:       1 failed, 68 skipped, 69 total
```

## Guardas finales

```text
A1: 0 (exit 1) esperado 0
A2: 0 (exit 1) esperado 0
A3: 1 (exit 0) esperado 1
A4: 1 (exit 0) esperado 1
A5: 0 (exit 1) esperado 0
A6: 2 (exit 0) — informativo
A7: 1 (exit 0) esperado 1
A8: 1 (exit 0) esperado 1
A9: 1 (exit 0) esperado 1
A10: 0 (exit 1) esperado 0
A11: 1 (exit 0) esperado 1
A12: 1 (exit 0) esperado 1
A13: 1 (exit 0) esperado 1
A14: 1 (exit 0) esperado 1
A15: 1 (exit 0) esperado 1
A16: 1 (exit 0) esperado 1
A17: 1 (exit 0) esperado 1
A18: 1 (exit 0) esperado 1
A19: 1 (exit 0) esperado 1
A20: 1 (exit 0) esperado 1
A21: 1 (exit 0) esperado 1
A22: 1 (exit 0) esperado 1
A23: 1 (exit 0) esperado 1
A24: 21 (exit 0) esperado 21
A25: 1 (exit 0) esperado 1
A26: 1 (exit 0) esperado 1
```

29 archivos: 20 de producción/migración, 9 de tests, ninguno de docs. Lista:

```text
backend-pet-tracker/src/db/migrations/0020_reminders_recurrence.sql
backend-pet-tracker/src/db/migrations/meta/0020_snapshot.json
backend-pet-tracker/src/db/migrations/meta/_journal.json
backend-pet-tracker/src/db/schema/reminders.schema.spec.ts
backend-pet-tracker/src/db/schema/reminders.schema.ts
backend-pet-tracker/src/modules/pets/application/owner-local-day.ts
backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.spec.ts
backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.ts
backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts
backend-pet-tracker/src/modules/reminders/application/recurrence.ts
backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.spec.ts
backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.ts
backend-pet-tracker/src/modules/reminders/application/use-cases/list-reminders.use-case.spec.ts
backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts
backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.ts
backend-pet-tracker/src/modules/reminders/domain/entities/reminder.entity.ts
backend-pet-tracker/src/modules/reminders/domain/errors/reminder.errors.ts
backend-pet-tracker/src/modules/reminders/domain/repositories/reminder.repository.ts
backend-pet-tracker/src/modules/reminders/infrastructure/mappers/reminder-error.mapper.ts
backend-pet-tracker/src/modules/reminders/infrastructure/mappers/reminder.mapper.ts
backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts
backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.ts
backend-pet-tracker/src/modules/reminders/infrastructure/reminders.controller.ts
backend-pet-tracker/src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts
backend-pet-tracker/src/pipeline/local-day.ts
backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts
backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts
backend-pet-tracker/src/workers/notifier/notifier.module.ts
backend-pet-tracker/test/pet-reminders.e2e-spec.ts
```

## Tabla R1–R14 a tests y commits

| Requisito | Test (archivo::nombre) | Commit |
|---|---|---|
| R1 | `backend-pet-tracker/src/db/schema/reminders.schema.spec.ts::#210 R1: declara las cuatro columnas nullable y los tres CHECKs de recurrencia`; `backend-pet-tracker/src/db/schema/reminders.schema.spec.ts::#210 R1: genera una migracion reminders_recurrence solo aditiva`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R1: CHECK %s` | ea3f36b2 (C1), a21772ae (C2) |
| R2 | `backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.spec.ts::#210 R2: POST rechaza %s en %s`; `backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.spec.ts::#210 R2: POST acepta every en el limite %s`; `backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.spec.ts::#210 R2: POST trata recurrence null como ausente`; `backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.spec.ts::#210 R2: PATCH de edicion rechaza %s en %s`; `backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.spec.ts::#210 R2: PATCH acepta recurrence y recurrenceUntil null y validos` | 74d31b82 (C5), 74a0222c (C6) |
| R3 | `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts::#210 R3: assertValidRecurrence %s`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R3: POST con recurrenceUntil sin recurrence responde 400 sin insertar`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R3: PATCH que deja until antes de dueAt responde 400 sin cambiar la fila` | 361c280b (C3), 16229e29 (C4), c14caa03 (C11), dabe90a9 (C12) |
| R4 | `backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.spec.ts::#210 R4: crea la serie con anchorAt igual a dueAt`; `backend-pet-tracker/src/modules/reminders/application/use-cases/create-reminder.use-case.spec.ts::#210 R4: sin recurrence crea recurrence null y no consulta la zona`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R4: POST con recurrence guarda las cuatro columnas` | 1484fec6 (C7), a56a501e (C8) |
| R5 | `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R5: GET POST y PATCH devuelven recurrence y recurrenceUntil sin el ancla` | df6f04d2 (C9), aa81fd6a (C10) |
| R6 | `backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts::#210 R6: PATCH %s`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R6: PATCH reancla, conserva y limpia columnas de la serie` | c14caa03 (C11), dabe90a9 (C12) |
| R7 | `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts::#210 R7: %s %s desde %s da %s` | 361c280b (C3), 16229e29 (C4) |
| R8 | `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts::#210 R8: %s %s en %s desde %s da %s` | 361c280b (C3), 16229e29 (C4) |
| R9 | `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts::#210 R9: %s` | 361c280b (C3), 16229e29 (C4) |
| R10 | `backend-pet-tracker/src/modules/reminders/application/recurrence.spec.ts::#210 R10: until %s en %s da %s` | 361c280b (C3), 16229e29 (C4) |
| R11 | `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts::#210 R11: serie avanza con advanceOccurrence y no marca sent`; `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts::#210 R11: serie pasada de until marca sent y no avanza`; `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts::#210 R11: zona %s da la siguiente ocurrencia %s`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R11: una serie diaria vuelve a scheduled en la siguiente ocurrencia sin duplicar push`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R11: una serie con until en su dia termina en sent` | 7414d330 (C17), 28c4a459 (C18) |
| R12 | `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts::#210 R12: el push de reminder lleva kind en data`; E1 y E5 de tasks.md | a5e419c4 (C15), fa2b0d88 (C16) |
| R13 | E2 en `backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R13: markEnqueued con scheduleName viejo no toca enqueued_at`; `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R13: advanceOccurrence solo avanza la fila con su scheduleName y scheduled`; `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts::#210 R13: advanceOccurrence false registra stale_schedule y borra el mensaje` | 5cc759e5 (C13), 19edcd1f (C14), 7414d330 (C17), 28c4a459 (C18) |
| R14 | `backend-pet-tracker/test/pet-reminders.e2e-spec.ts::#210 R14: PATCH con recurrenceUntil invalido sobre reminder ajeno responde el mismo 404` | 5a8fd10c (C19) |

## Tabla de commits, tests y rojos observados

Los fallos listados fueron aserciones; formato, lint y tsc de la pasada registrada fueron verdes. Las correcciones de preparación (lint/tsc) constan en las secciones históricas. C19 nace verde; M9 muestra su rojo.

| Commit | Test | Rojo observado / aserción |
|---|---|---|
| C1 `ea3f36b2` (unit) | R1: tabla reminders y migracion 0011 aditiva › exporta reminders con las columnas, tipos y nulabilidad aprobados | `expect(received).toEqual(expected) // deep equality ` |
| C1 `ea3f36b2` (unit) | #210 R1: columnas de recurrencia y migracion aditiva › #210 R1: declara las cuatro columnas nullable y los tres CHECKs de recurrencia | `expect(received).toBe(expected) // Object.is equality Expected: "varchar(5)"` |
| C1 `ea3f36b2` (unit) | #210 R1: columnas de recurrencia y migracion aditiva › #210 R1: genera una migracion reminders_recurrence solo aditiva | `expect(received).toHaveLength(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK unidad desconocida | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK hour bajo minimo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK day bajo minimo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK week bajo minimo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK month bajo minimo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK year bajo minimo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK hour sobre maximo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK day sobre maximo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK week sobre maximo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK month sobre maximo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK year sobre maximo | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK hour minimo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK hour maximo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK day minimo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK day maximo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK week minimo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK week maximo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK month minimo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK month maximo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK year minimo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK year maximo | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK serie sin ancla | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK until sin serie | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK every sin unidad | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK unidad sin every | `expect(received).rejects.toMatchObject(expected) ` |
| C1 `ea3f36b2` (e2e) | Pet reminders (e2e) › #210 R1: CHECKs de recurrencia en Postgres › #210 R1: CHECK serie completa con until | `expect(received).resolves.toBeDefined() Received promise rejected instead of resolved` |
| C3 `361c280b` (unit) | #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence until sin recurrence | `expect(received).toThrow(expected) ` |
| C3 `361c280b` (unit) | #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence until el día anterior | `expect(received).toThrow(expected) ` |
| C3 `361c280b` (unit) | #210 R3: reglas cruzadas › #210 R3: assertValidRecurrence zona del dueño decide (UTC) | `expect(received).toThrow(expected) ` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: hour 8 desde UTC da 2026-12-31T20:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2027-01-01T04:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: day 1 desde UTC da 2026-12-31T09:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2027-01-01T09:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: day 3 desde America/Mexico_City da 2026-01-30T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-02-02T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: week 2 desde UTC da 2026-12-24T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2027-01-07T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: month 1 desde UTC da 2026-01-31T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-02-28T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: month 1 desde UTC da 2026-01-31T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-03-31T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: month 1 desde UTC da 2026-01-31T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-04-30T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: month 2 desde UTC da 2026-12-31T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2027-02-28T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: year 1 desde UTC da 2028-02-29T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2029-02-28T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: year 1 desde UTC da 2028-02-29T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2032-02-29T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R7: ocurrencias desde el ancla › #210 R7: year 3 desde UTC da 2026-12-31T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2029-12-31T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-03-07T15:00:00.000Z da 2026-03-07T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-03-08T14:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-10-31T14:00:00.000Z da 2026-10-31T14:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-11-01T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/Mexico_City desde 2026-03-07T16:00:00.000Z da 2026-03-07T16:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-03-08T16:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-03-07T07:30:00.000Z da 2026-03-07T07:30:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-03-08T07:30:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-03-07T07:30:00.000Z da 2026-03-08T07:30:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-03-09T06:30:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: day 1 en America/New_York desde 2026-10-31T05:30:00.000Z da 2026-10-31T05:30:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-11-01T05:30:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: hour 1 en America/New_York desde 2026-11-01T05:30:00.000Z da 2026-11-01T05:30:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-11-01T06:30:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: hour 24 en America/New_York desde 2026-03-07T15:00:00.000Z da 2026-03-07T15:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-03-08T15:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R8: ocurrencias desde el ancla › #210 R8: month 1 en America/Mexico_City desde 2026-01-31T05:30:00.000Z da 2026-01-31T05:30:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-03-01T05:30:00.000Z"` |
| C3 `361c280b` (unit) | #210 R9: primera ocurrencia con aviso futuro › #210 R9: day 1 aviso 60 now 2027-01-04T12:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2027-01-05T09:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R9: primera ocurrencia con aviso futuro › #210 R9: hour 1 aviso 30 now 2027-01-01T00:40:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2027-01-01T02:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R9: primera ocurrencia con aviso futuro › #210 R9: hour 1 aviso 30 now 2026-12-31T22:30:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2027-01-01T00:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R9: primera ocurrencia con aviso futuro › #210 R9: day 1 aviso 10080 now 2026-12-18T09:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-12-26T09:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R10: until inclusivo › #210 R10: until 2026-11-01 en America/Mexico_City da 2026-11-02T03:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-11-02T03:00:00.000Z"` |
| C3 `361c280b` (unit) | #210 R10: until inclusivo › #210 R10: until 2026-10-31 en America/Mexico_City da null | `expect(received).toBeNull() Received: 2026-10-31T03:00:00.000Z` |
| C3 `361c280b` (unit) | #210 R10: until inclusivo › #210 R10: until 2026-11-01 en UTC da null | `expect(received).toBeNull() Received: 2026-10-31T03:00:00.000Z` |
| C3 `361c280b` (unit) | #210 R10: until inclusivo › #210 R10: until null en America/Mexico_City da 2026-11-02T03:00:00.000Z | `expect(received).toBe(expected) // Object.is equality Expected: "2026-11-02T03:00:00.000Z"` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza hour bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza day bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza week bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza month bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza year bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza hour sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza day sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza week sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza month sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza year sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza every decimal en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza unit desconocida en recurrence.unit | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza every ausente en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza clave extra en recurrence | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza recurrence string en recurrence | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza dia inexistente en recurrenceUntil | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST rechaza fecha con hora en recurrenceUntil | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite hour | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite hour | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite day | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite day | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite week | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite week | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite month | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite month | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite year | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST acepta every en el limite year | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: POST trata recurrence null como ausente | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza hour bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza day bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza week bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza month bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza year bajo minimo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza hour sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza day sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza week sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza month sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza year sobre maximo en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza every decimal en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza unit desconocida en recurrence.unit | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza every ausente en recurrence.every | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza clave extra en recurrence | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza recurrence string en recurrence | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza dia inexistente en recurrenceUntil | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH de edicion rechaza fecha con hora en recurrenceUntil | `expect(received).toContain(expected) // indexOf ` |
| C5 `74d31b82` (unit) | #210 R2: validacion zod de recurrencia › #210 R2: PATCH acepta recurrence y recurrenceUntil null y validos | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C7 `1484fec6` (unit) | #210 R4: POST persiste la serie › #210 R4: crea la serie con anchorAt igual a dueAt | `expect(jest.fn()).toHaveBeenCalledWith(...expected) ` |
| C7 `1484fec6` (e2e) | Pet reminders (e2e) › #210 R4: persistencia de recurrencia › #210 R4: POST con recurrence guarda las cuatro columnas | `expect(received).toMatchObject(expected) ` |
| C9 `df6f04d2` (e2e) | Pet reminders (e2e) › R2: POST crea reminder programado con shape exacto › persiste defaults, actor y token vigente | `expect(received).toEqual(expected) // deep equality ` |
| C9 `df6f04d2` (e2e) | Pet reminders (e2e) › #210 R5: respuesta publica de las series › #210 R5: GET POST y PATCH devuelven recurrence y recurrenceUntil sin el ancla | `expect(received).toEqual(expected) // deep equality ` |
| C11 `c14caa03` (unit) | #210 R6: edicion de la serie › #210 R6: PATCH recurrence nueva | `expect(jest.fn()).toHaveBeenCalledWith(...expected) ` |
| C11 `c14caa03` (unit) | #210 R6: edicion de la serie › #210 R6: PATCH recurrence null | `expect(jest.fn()).toHaveBeenCalledWith(...expected) ` |
| C11 `c14caa03` (unit) | #210 R6: edicion de la serie › #210 R6: PATCH recurrenceUntil fecha | `expect(jest.fn()).toHaveBeenCalledWith(...expected) ` |
| C11 `c14caa03` (unit) | #210 R6: edicion de la serie › #210 R6: PATCH recurrenceUntil null | `expect(jest.fn()).toHaveBeenCalledWith(...expected) ` |
| C11 `c14caa03` (unit) | #210 R6: edicion de la serie › #210 R6: PATCH dueAt reancla | `expect(jest.fn()).toHaveBeenCalledWith(...expected) ` |
| C11 `c14caa03` (unit) | #210 R6: edicion de la serie › #210 R6: PATCH until sobre one-shot | `expect(received).rejects.toThrow() Received promise resolved instead of rejected` |
| C11 `c14caa03` (unit) | #210 R6: edicion de la serie › #210 R6: PATCH recurrence null con until | `expect(received).rejects.toThrow() Received promise resolved instead of rejected` |
| C11 `c14caa03` (e2e) | Pet reminders (e2e) › #210 R3: reglas cruzadas en HTTP › #210 R3: POST con recurrenceUntil sin recurrence responde 400 sin insertar | `expected 400 "Bad Request", got 500 "Internal Server Error" ` |
| C11 `c14caa03` (e2e) | Pet reminders (e2e) › #210 R3: reglas cruzadas en HTTP › #210 R3: PATCH que deja until antes de dueAt responde 400 sin cambiar la fila | `expected 400 "Bad Request", got 200 "OK" ` |
| C11 `c14caa03` (e2e) | Pet reminders (e2e) › #210 R6: PATCH de las columnas de recurrencia › #210 R6: PATCH reancla, conserva y limpia columnas de la serie | `expect(received).toMatchObject(expected) ` |
| C13 `5cc759e5` (unit) | R5: dispatcher encola vencidos una sola vez › publica en orden dueAt y marca enqueuedAt solo despues de cada send | `expect(received).toEqual(expected) // deep equality ` |
| C13 `5cc759e5` (unit) | R5: dispatcher encola vencidos una sola vez › un send fallido queda sin marcar y no frena las filas siguientes | `expect(jest.fn()).toHaveBeenCalledWith(...expected) ` |
| C13 `5cc759e5` (unit) | #125 R2: el dispatcher escribe en el cuerpo cuándo vence, en la zona del owner de cada mascota › si la zona del owner no se puede leer, esa fila no se encola y las siguientes sí | `expect(received).toEqual(expected) // deep equality ` |
| C13 `5cc759e5` (e2e) | Pet reminders (e2e) › #210 R13: escrituras condicionadas al schedule › #210 R13: markEnqueued con scheduleName viejo no toca enqueued_at | `expect(received).toBeNull() Received: 2026-10-26T19:15:47.427Z` |
| C13 `5cc759e5` (e2e) | Pet reminders (e2e) › #210 R13: escrituras condicionadas al schedule › #210 R13: advanceOccurrence solo avanza la fila con su scheduleName y scheduled | `expect(received).toBe(expected) // Object.is equality Expected: true` |
| C15 `a5e419c4` (unit) | R7 (pet-reminders #16): notifier procesa reminder idempotentemente › envia push, marca sent despues y borra el mensaje | `expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: ObjectContaining {"data": {"kind": "reminder", "petId": "01924a3f-0000-7000-8000-0000000000aa", "reminderId": "01924a3f-0000-7000-8000-0000000000cc"}, "tokens": ["ExponentPushToken[aaaaaaaaaaaaaaaaaaaaAA]"]}` |
| C15 `a5e419c4` (unit) | #210 R12: data del push de reminder › #210 R12: el push de reminder lleva kind en data | `expect(received).toEqual(expected) // deep equality ` |
| C15 `a5e419c4` (e2e) | Pet reminders (e2e) › R7: create, dispatch y notifier dejan sent sin duplicar push › procesa la cadena real y un segundo tick no vuelve a enviar | `expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: ObjectContaining {"data": {"kind": "reminder", "petId": "01a179ab-a337-7efe-8f23-98a9104cdb37", "reminderId": "01a179ab-a355-78ac-b783-ca8359d20df3"}}` |
| C17 `7414d330` (unit) | #210 R11: el notifier avanza la serie › #210 R11: serie avanza con advanceOccurrence y no marca sent | `expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "01924a3f-0000-7000-8000-0000000000cc", "reminder-01924a3f-0000-7000-8000-0000000000cc", 2026-03-08T15:00:00.000Z, StringMatching /^reminder-[0-9a-f-]{36}$/` |
| C17 `7414d330` (unit) | #210 R11: el notifier avanza la serie › #210 R11: zona America/New_York da la siguiente ocurrencia 2026-03-08T14:00:00.000Z | `expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "01924a3f-0000-7000-8000-0000000000cc", "reminder-01924a3f-0000-7000-8000-0000000000cc", 2026-03-08T14:00:00.000Z, StringMatching /^reminder-[0-9a-f-]{36}$/` |
| C17 `7414d330` (unit) | #210 R11: el notifier avanza la serie › #210 R11: zona null da la siguiente ocurrencia 2026-03-08T15:00:00.000Z | `expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "01924a3f-0000-7000-8000-0000000000cc", "reminder-01924a3f-0000-7000-8000-0000000000cc", 2026-03-08T15:00:00.000Z, StringMatching /^reminder-[0-9a-f-]{36}$/` |
| C17 `7414d330` (unit) | #210 R11: el notifier avanza la serie › #210 R11: zona Mars/Base da la siguiente ocurrencia 2026-03-08T15:00:00.000Z | `expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "01924a3f-0000-7000-8000-0000000000cc", "reminder-01924a3f-0000-7000-8000-0000000000cc", 2026-03-08T15:00:00.000Z, StringMatching /^reminder-[0-9a-f-]{36}$/` |
| C17 `7414d330` (unit) | #210 R11: el notifier avanza la serie › #210 R13: advanceOccurrence false registra stale_schedule y borra el mensaje | `expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: ObjectContaining {"skipped": "stale_schedule"}` |
| C17 `7414d330` (e2e) | Pet reminders (e2e) › #210 R11: avance de series en la cadena real › #210 R11: una serie diaria vuelve a scheduled en la siguiente ocurrencia sin duplicar push | `expect(received).toMatchObject(expected) ` |
| C19 `5a8fd10c` | #210 R14: PATCH con recurrenceUntil invalido sobre reminder ajeno responde el mismo 404 | Nace verde; M9 falla en expect(foreign.status).toBe(missing.status): 400 frente a 404. |

## Filas que nacieron verdes y mutación correspondiente

| Commit | Fila / motivo | Mutación |
|---|---|---|
| C3 | R3 mismo día local, zona MX y sin until: stub no-op | M1: tres rojos |
| C7 | R4 one-shot: recurrence null, sin leer zona | M2: rojo |
| C11 | R6 solo title: changes sin recurrence | M3: rojo |
| C13 | E2 envío fallido no marcado; markEnqueued vigente; advanceOccurrence viejo y cancelled devuelven false | M5–M8: cuatro rojos (M8 interceptado por recuento, detallado arriba) |
| C17 | R11 fin por until unitario y E2E: notifier previo siempre markSent | M4: dos rojos |
| C19 | R14 autorización ya protegía la validación desde C12 | M9: rojo 400/404 |

## Verificación final

`pnpm exec jest`: exit 0.

```text
Test Suites: 189 passed, 189 total
Tests:       1573 passed, 1573 total
```

`pnpm exec jest --config ./test/jest-e2e.json pet-reminders`: exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       69 passed, 69 total
```

`pnpm exec jest --config ./test/jest-e2e.json alerts-center-notifier`: exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

Las dos E2E finales tuvieron pgrep vacío inmediatamente antes. `pnpm exec tsc --noEmit -p tsconfig.json`: exit 0. `pnpm exec eslint src/db/schema/reminders.schema.ts src/db/schema/reminders.schema.spec.ts src/modules/reminders src/workers/notifier src/modules/pets/application/owner-local-day.ts src/pipeline/local-day.ts test/pet-reminders.e2e-spec.ts`: exit 0.

Guardas finales adicionales: imports del notifier 1; export EditReminderSchema 1; comentario ponytail de recurrence 1; stubs Promise.resolve(false) 0; void residuales 0. Migraciones idénticas a C2 (git diff --quiet a21772ae -- src/db/migrations: exit 0). Guarda de rutas protegidas devuelve solo owner-local-day.ts y local-day.ts, las dos excepciones autorizadas. `git diff --check`: exit 0.

Corrección de reporte: un generador inicialmente tomó las filas de cifras del handoff como mensajes de commit, produjo KeyError antes de escribir filas y se corrigió para leer los mensajes únicos de tasks.md. Solo afectó al reporte.

## C20 y cierre completo

`8c7f2f68 docs(reminders): #210 fill traceability`: solo specs/reminders-recurrence/traceability.md, 14 filas completas; ningún test se ejecuta para C20 (regla del handoff). No hubo refactors opcionales ni otros commits de implementación fuera de C1–C20.

`graphify update .`: exit 0, AST sin LLM. Actualizó el grafo ignorado en graphify-out: 29709 nodos, 38052 aristas y 1984 comunidades. Advertencia de herramienta: 21 ficheros SQL no aportaron nodos por faltar tree_sitter_sql; no se instaló ninguna dependencia. El SQL de la migración sí está cubierto por los tests y conserva sus artefactos generados.

La comprobación auxiliar de trazabilidad inicialmente contó también la cabecera «Requisito» al buscar filas que empezaban por R. Se corrigió la comprobación a `^\| R\d+ \|`: 14 filas sin pendiente. El archivo commiteado era correcto y no se cambió después de C20.

### Cadena final

| # | Hash | Mensaje |
|---|---|---|
| C1 | ea3f36b2 | test(reminders): #210 R1 recurrence columns and CHECKs |
| C2 | a21772ae | feat(reminders): #210 R1 recurrence columns, CHECKs and additive migration |
| C3 | 361c280b | test(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation |
| C4 | 16229e29 | feat(reminders): #210 R3 R7 R8 R9 R10 occurrence calculation |
| C5 | 74d31b82 | test(reminders): #210 R2 zod validation of recurrence |
| C6 | 74a0222c | feat(reminders): #210 R2 zod validation of recurrence |
| C7 | 1484fec6 | test(reminders): #210 R4 POST persists the series |
| C8 | a56a501e | feat(reminders): #210 R4 POST persists the series |
| C9 | df6f04d2 | test(reminders): #210 R5 response shape with recurrence |
| C10 | aa81fd6a | feat(reminders): #210 R5 response shape with recurrence |
| C11 | c14caa03 | test(reminders): #210 R3 R6 cross-field rules and series PATCH |
| C12 | dabe90a9 | feat(reminders): #210 R3 R6 cross-field rules and series PATCH |
| C13 | 5cc759e5 | test(reminders): #210 R13 writes conditioned on schedule_name |
| C14 | 19edcd1f | feat(reminders): #210 R13 writes conditioned on schedule_name |
| C15 | a5e419c4 | test(reminders): #210 R12 kind in the reminder push data |
| C16 | fa2b0d88 | feat(reminders): #210 R12 kind in the reminder push data |
| C17 | 7414d330 | test(reminders): #210 R11 notifier advances the series |
| C18 | 28c4a459 | feat(reminders): #210 R11 notifier advances the series |
| C19 | 5a8fd10c | test(reminders): #210 R14 opaque 404 with recurrence bodies |
| C20 | 8c7f2f68 | docs(reminders): #210 fill traceability |

### Medidas y límites del cierre

- Todos los exit codes de las verificaciones finales son 0. Se conservaron los exit codes 1 de los tests rojos y de las nueve mutaciones, con sus aserciones y reversiones en este reporte.
- No quedó ninguna medición del implementer pendiente por falta de infraestructura o permisos. No hubo timeout que exigiera repetición aislada.
- Anclas y guardas finales coinciden. E2 se mide con la regla de Reanudación 2, sin espacios y con las comas que pone Prettier. A6 termina en 2 llamadas markSent (one-shot y fin de serie).
- 29 archivos de backend: 20 de producción/migración y 9 tests; docs sin cambios. Los tres artefactos generados de migración no cambiaron después de C2. No se añadieron dependencias.
- No se ejecutó init.sh, build global ni la suite E2E completa; corresponden al leader. No se hizo merge, rebase, push ni PR. Se mantienen intactos feature_list.json, STATUS.md, progress/current.md e history.md.
- El único archivo sin commit al entregar es este reporte, que commitea el leader. Fuente, tests y traceability quedan commiteados; el marcador .done está ignorado.
- Última acción del implementer: crear progress/impl_reminders-recurrence.done con una sola línea que apunta a este reporte.
