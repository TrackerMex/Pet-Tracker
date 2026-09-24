---
feature: "reminder-advance-already-past"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, backend, mobile]
---

# Tareas — [[reminder-advance-already-past]] (#125)

> Disciplina TDD: por requisito, **(1) commit rojo → (2) commit verde →
> (3) refactor**, un commit por paso, **nunca implementación y test juntos**
> (los esqueletos de los rojos están nombrados abajo y son la única
> producción que viaja en un rojo). Anclas por contenido (`grep -n`), nunca
> por número de línea. Todo `describe` nuevo lleva el prefijo `#125 R<n>:` (o
> `#125:` el padre). Mensajes en inglés: `test(<scope>): <desc> (Rn)` el
> rojo, `feat(<scope>): <desc> (Rn)` el verde, `refactor(<scope>): …` si lo
> hay; `<scope>` = `reminders` (R1, R2) o `add-reminder` (R3, R4). La
> trazabilidad se rellena **una sola vez**, en el commit final
> `docs(reminders): …` tras el último verde ([[traceability]]).

## Antes de empezar

- [ ] Worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
      `feature/125-reminder-advance-already-past`, y
      `git merge-base --is-ancestor 40ec1b46 HEAD; echo "exit=$?"` → `exit=0`.
- [ ] `test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"` →
      `exit=0`. Si da `1`, **parar y pedir al humano** que lo borre
      (gitignorado, rompe `tsc`; el sandbox de Codex deniega `rm -f`, #121).
- [ ] **No lanzar `./init.sh` ni el e2e** (Postgres y LocalStack compartidos
      entre worktrees; lo corre el leader). Esta feature se verifica con jest,
      tsc y lint (§Cierre).
- [ ] Medir y **anotar en el reporte** las bases, sin pipe:
      `pnpm -C backend-pet-tracker exec jest src/modules/reminders; echo "exit=$?"`
      (6 suites / 48 en `40ec1b46`),
      `pnpm -C backend-pet-tracker test; echo "exit=$?"` (170 / 1298),
      `cd mobile-pet-tracker && bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx; echo "exit=$?"`
      (25) y `bun run --cwd mobile-pet-tracker test; echo "exit=$?"`
      (83 / 1491). Los deltas de esta spec van **sobre esa base**.
- [ ] Código de test nuevo: nada de la forma `<palabra>-[` (guard
      `describe('C8: la UI no usa clases arbitrarias'`).
- [ ] Sin comentarios nuevos en producción. Sin dependencias nuevas. Sin tocar
      `reminders.module.ts`, puertos, repositorios, migraciones, `test/`
      (e2e) ni `src/i18n/catalog.ts`.
- [ ] `pnpm -C backend-pet-tracker run lint` lleva `--fix`: reescribe formato.
      Correrlo **antes** de cada commit de backend y commitear el formato con
      su paso, para que no aparezca un diff suelto al final.
- [ ] Skills (nombres de Claude; el leader da los de Codex en el handoff):
      `expo-overview` → `expo-native-ui`, `expo-design-system`.

## Orden y por qué (candado del sujeto ausente)

`R1 → R2 → R3 → R4`, y R5 (humano) al final.

- R1 **crea** `reminder-push-body.ts` con el esqueleto; R2 lo importa en su
  verde. El rojo de R2 trae el parámetro de constructor que sus tests pasan,
  así que ningún rojo falla por `Cannot find module` ni por `ReferenceError`.
- R3 asevera nodos que ya existen en `40ec1b46` (`advance-chip-*`,
  `date-field`, `date-picker`, `time-field`, `time-picker`,
  `add-reminder-submit`, `add-reminder-error`, `title-input`) con helpers que
  entran en su propio rojo (`ADVANCES`, `CHIP_SELECTED`, `CHIP_IDLE`,
  `expectAdvanceChips`, `pickTime`).
- R4 usa esos helpers y su propio `openAt`, local a su `describe`.
- Los candados movidos entran en el rojo del requisito cuyo verde los rompería
  (R2 y R3), para que el verde los deje verdes en el mismo paso.

---

## R1 — El cuerpo del push dice cuándo vence

- [ ] **(1) Commit rojo** `test(reminders): format the push body with the owner-zone due date (R1)`.
  - `backend-pet-tracker/src/modules/reminders/application/reminder-push-body.ts`
    (nuevo), **esqueleto** con la firma normativa
    `export function reminderPushBody(title: string, dueAt: Date, timeZone: string | null): string`
    que devuelve `` `Recordatorio: ${title}` `` (el cuerpo de hoy). El lint de
    parámetros sin usar se exige en §Cierre, no en este rojo.
  - `reminder-push-body.spec.ts` (nuevo):
    `describe('#125 R1: el cuerpo del push dice cuándo vence, en la zona del owner'`
    con **un** `it.each` de 7 filas `[título, dueAt, timeZone, esperado]`,
    título `'%s'`, cuerpo
    `expect(reminderPushBody('Vacuna antirrábica', new Date(dueAt), timeZone)).toBe(esperado);`.
    Tabla de [[requirements]] R1, literal.
  Rojo esperado: las 7 filas, por aserción.
- [ ] **(2) Commit verde** `feat(reminders): format the reminder push body in the owner time zone (R1)`.
  Solo `reminder-push-body.ts`, según [[design]] D4: zona efectiva con
  `isSupportedTimeZone` (import de `@/pipeline/local-day`) o `'UTC'`,
  `Intl.DateTimeFormat('es-MX', { timeZone, day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(dueAt)`
  y el texto compuesto con literales propios.
- [ ] **(3) Refactor**: ninguno previsto.

## R2 — El dispatcher usa la zona del owner de cada mascota

- [ ] **(1) Commit rojo** `test(reminders): dispatch the due date in the owner zone (R2)`.
  - `reminders-dispatch.service.ts`, **esqueleto**: imports de `PET_REPOSITORY`
    y `type PetRepository` desde
    `@/modules/pets/domain/repositories/pet.repository` y el cuarto parámetro
    `@Inject(PET_REPOSITORY) private readonly pets: PetRepository,` **sin
    usarlo**. Nada más.
  - `reminders-dispatch.service.spec.ts`:
    - `import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';`
      y el helper `petsStub(zones)` de [[requirements]] R2, junto a
      `repositoryStub`;
    - las **cuatro** llamadas `new RemindersDispatchService(` de R5 y R6 con
      cuarto argumento `petsStub().client`;
    - en `describe('R6: dispatcher publica el mensaje reminder exacto'`,
      `` body: `Recordatorio: ${due.title}`, `` →
      `` body: `Recordatorio: ${due.title} · 13 de agosto a las 11:00`, ``;
    - al final,
      `describe('#125 R2: el dispatcher escribe en el cuerpo cuándo vence, en la zona del owner de cada mascota'`
      con el arnés y los **dos** `it` literales de [[requirements]] R2.
  Rojo esperado: el `it` de R6 y los dos de #125 R2, por aserción; los tres de
  R5 verdes (6 tests en el fichero).
- [ ] **(2) Commit verde** `feat(reminders): read the owner time zone when dispatching reminders (R2)`.
  Solo `reminders-dispatch.service.ts`: `import { reminderPushBody } from '@/modules/reminders/application/reminder-push-body';`,
  y **como primera línea del `try`** de cada recordatorio
  `const timeZone = await this.pets.findOwnerTimezone(reminder.petId);`;
  `` body: `Recordatorio: ${reminder.title}`, `` →
  `body: reminderPushBody(reminder.title, reminder.dueAt, timeZone),`.
- [ ] **(3) Refactor**: ninguno previsto.

## R3 — Chips de aviso desactivados y selección derivada

- [ ] **(1) Commit rojo** `test(add-reminder): disable advance chips whose moment already passed (R3)`.
  Solo `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx`:
  - los **tres candados movidos** de [[requirements]] §Candados, literales
    (`renders alert choices…`, `posts the exact…` y la columna `aviso` de
    `#123 R4`);
  - **al final del fichero** (después de
    `describe('#123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre'`):
    los helpers de módulo `ADVANCES`, `CHIP_SELECTED`, `CHIP_IDLE`,
    `expectAdvanceChips`, `pickTime`; el `describe` padre
    `describe('#125: avisos que ya pasaron en Nuevo recordatorio'` con el
    arnés de [[design]] D9; y dentro el hijo
    `describe('#125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro'`
    con el `it.each` de 7 filas y los dos `it` de [[requirements]] R3,
    literales.
  Sin cambios de producción. Rojo esperado: **11** (las 7 filas, los dos `it`,
  `renders alert choices…` y la fila 1 de `#123 R4`), por aserción; 23 verdes
  (34 en el fichero).
- [ ] **(2) Commit verde** `feat(add-reminder): disable past advance chips and fall back to the largest future one (R3)`.
  Solo `src/screens/add-reminder/index.tsx`:
  - antes de `function initialTime(): Date {`, dos funciones de módulo con la
    semántica del Contrato: `isAdvancePast(dueAt: Date | null, minutes: number, now: number): boolean`
    y `effectiveAdvance(dueAt: Date | null, preferred: number, now: number): number`
    (sobre `ADVANCE_OPTIONS`, ascendente; p. ej. `filter(…).pop()?.minutes ?? preferred`);
  - `const [now] = useState(Date.now);` junto a los demás `useState`;
  - antes de `return (`,
    `const pickedDueAt = date ? combineDateAndTime(date, time) : null;` y
    `const selectedAdvance = effectiveAdvance(pickedDueAt, advanceMinutes, now);`;
  - en el `map` de `ADVANCE_OPTIONS`:
    `const selected = selectedAdvance === option.minutes;`,
    `const disabled = isAdvancePast(pickedDueAt, option.minutes, now);`,
    `disabled={disabled}` en el `Pressable` (el `accessibilityState={{ selected }}`
    no cambia) y la clase de [[design]] D8;
  - en `handleSubmit`, `advanceMinutes,` →
    `advanceMinutes: effectiveAdvance(dueAt, advanceMinutes, now),` (con el
    `now` del estado: ver [[design]] D10 por qué no `selectedAdvance`).
  Verde: el fichero entero (34).
- [ ] **(3) Refactor**: ninguno previsto.

## R4 — Instante del cambio y del envío

- [ ] **(1) Commit rojo** `test(add-reminder): re-evaluate chips on date or time change and on save (R4)`.
  Dentro del `describe` padre `#125:`, el hijo
  `describe('#125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío'`
  con `openAt` y los tres `it` de [[requirements]] R4, literales. Sin cambios
  de producción. Rojo esperado: los 3, por aserción; 34 verdes.
- [ ] **(2) Commit verde** `feat(add-reminder): refresh the evaluation instant on change and on save (R4)`.
  - `const [now] = useState(Date.now);` → `const [now, setNow] = useState(Date.now);`;
  - `setNow(Date.now());` en el `onValueChange` del `ExpoDateTimePicker` de
    `testID="date-picker"` (después de `setDate(fromPickerValue(selectedDate));`)
    y en el de `testID="time-picker"` (después de `setTime(selectedTime);`);
  - en `handleSubmit`,
    `advanceMinutes: effectiveAdvance(dueAt, advanceMinutes, now),` →
    `advanceMinutes: effectiveAdvance(dueAt, advanceMinutes, Date.now()),`.
  Verde: el fichero entero (37).
- [ ] **(3) Refactor**: ninguno previsto.

## R5 — Smoke en dev build de Android (humano)

- [ ] Lo corre el humano tras el veredicto del `reviewer`, con los pasos de
      [[requirements]] §Prueba de humo, y firma su casilla allí. Codex no lo
      marca.

---

## Sondas (no se commitean; cada una roja y restaurada con `git diff` vacío)

Las corre Codex antes del cierre y las repite el `reviewer`. Anotar en el
reporte cuántos tests se ponen rojos con cada una y compararlo con las tablas.

- **Backend, `reminder-push-body.ts`**: M1-M7 de [[requirements]] R1, y la
  del techo (caer a la zona del host en vez de `'UTC'`: verde en el VPS, se
  espera verde).
- **Backend, dispatcher**: D1-D5 de [[requirements]] R2.
- **Móvil, pantalla**: MU1, MU2, MU3, MU5, MU6, MU8, MU9, MU10, MU11 y MU16 de
  R3; MU12-MU15 de R4.

---

## Cierre (Codex, antes de escribir `progress/impl_reminder-advance-already-past.md`)

Todo **sin pipe** (el código de salida de un pipe es el del último comando):

- [ ] `pnpm -C backend-pet-tracker exec jest src/modules/reminders; echo "exit=$?"`
      → `exit=0`, **7 suites / 57 tests** (base + 1 / + 9).
- [ ] `pnpm -C backend-pet-tracker test; echo "exit=$?"` → `exit=0`,
      **+1 suite y +9 tests** sobre la base (con `40ec1b46`: 171 / 1307).
- [ ] `pnpm -C backend-pet-tracker exec tsc --noEmit; echo "exit=$?"` y
      `pnpm -C backend-pet-tracker run lint; echo "exit=$?"` → `exit=0`, y
      `git status --short` vacío después (el `--fix` no deja nada suelto).
- [ ] `cd mobile-pet-tracker && bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx; echo "exit=$?"`
      → `exit=0`, **37**.
- [ ] `bun run --cwd mobile-pet-tracker test; echo "exit=$?"` → `exit=0`,
      **+0 suites y +12 tests** (con `40ec1b46`: 83 / 1503).
- [ ] `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` y después
      `bun run --cwd mobile-pet-tracker typecheck; echo "exit=$?"` y
      `bun run --cwd mobile-pet-tracker lint; echo "exit=$?"` → `exit=0`.
- [ ] Greps de backend (desde `backend-pet-tracker/`):
      `grep -c "'UTC'" src/modules/reminders/application/reminder-push-body.ts` → `1`;
      `grep -c "formatToParts" src/modules/reminders/application/reminder-push-body.ts` → `1`;
      `grep -c "\.format(" src/modules/reminders/application/reminder-push-body.ts` → `0`;
      `grep -c "hourCycle: 'h23'" src/modules/reminders/application/reminder-push-body.ts` → `1`;
      `grep -c "isSupportedTimeZone" src/modules/reminders/application/reminder-push-body.ts` → `2`;
      `grep -c "findOwnerTimezone(reminder.petId)" src/modules/reminders/infrastructure/reminders-dispatch.service.ts` → `1`;
      `grep -c "reminderPushBody(" src/modules/reminders/infrastructure/reminders-dispatch.service.ts` → `1`;
      `grep -c "Recordatorio" src/modules/reminders/infrastructure/reminders-dispatch.service.ts` → `0`.
- [ ] Greps de móvil (desde `mobile-pet-tracker/`, sobre
      `src/screens/add-reminder/index.tsx`): `useState(Date.now)` → `1`;
      `setNow(Date.now())` → `2`; `Date.now()` → `4` (los dos `setNow`, la
      validación de siempre y el `advanceMinutes` de Guardar);
      `disabled={disabled}` → `1`; `opacity-50` → `1`; `60_000` → `1`;
      `accessibilityState={{ selected }}` → `2` (chips de tipo y de aviso).
- [ ] `git diff --stat origin/main...HEAD -- backend-pet-tracker mobile-pet-tracker`
      → exactamente los seis ficheros de [[design]] §Archivos afectados (ni
      `package.json`, ni `pnpm-lock.yaml`, ni `bun.lock`, ni `catalog.ts`).
- [ ] Commit final `docs(reminders): fill #125 traceability` con los ocho
      hashes en [[traceability]], y el reporte con las bases, las sondas y los
      recuentos.
