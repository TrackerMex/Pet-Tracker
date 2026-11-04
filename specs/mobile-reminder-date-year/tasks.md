---
feature: "mobile-reminder-date-year"
status: approved      # draft | approved
tags: [mobile, ui, spec]
---

# Tareas — [[mobile-reminder-date-year]] (#240)

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos tres sub-items, en este orden. Rutas relativas a
> `mobile-pet-tracker/src/`; los comandos se lanzan desde `mobile-pet-tracker/`.
>
> - **Commits test-primero** (C4 de `CHECKPOINTS.md`): los commits de test
>   van antes del commit de producción y solo llevan tests. Mensajes en
>   inglés, literales de este documento. El móvil no tiene `prettier`.
> - **Orden.** Las tareas van en el orden de este documento, que no es el de
>   los R-ids.
> - **`./init.sh` no lo lanza Codex**; lo corre el leader.
> - **Skills.** Antes de T1, carga las de [[design]] §Skills (el leader da los
>   nombres de Codex en el handoff).
> - **Sin dependencias nuevas.** No se toca `package.json`, `bun.lock` ni
>   `app.json`.
> - **Literales.** Se copian de las tablas de [[requirements]]. No se
>   recalculan ni se «arreglan».

## T0 — Línea base

- [ ] (1) En el worktree, `cp` del `.env` y `bun install --frozen-lockfile`
  si faltan `node_modules`. **No** lanzar `./init.sh`.
- [ ] (2) Medir cada ancla de [[requirements]] §Evidencia (columna «Cuenta»)
  y cada localizador de la «Tabla de enmiendas» (`grep -cF` → 1). Anotar en
  `progress/impl_mobile-reminder-date-year.md` cualquier discrepancia
  **antes** de seguir. Si un ancla no da su cifra, se para y se reporta.
- [ ] (3) Correr la línea base:

  ```
  bun run jest src/screens/reminders > ../progress/t0_mobile-reminder-date-year.log 2>&1
  ```

  Si hay un SIGKILL, el fichero cuenta 0 tests: repetir. Anotar el número de
  tests y de `●` del log. Todo verde; si no, se para y se reporta.

## T1 — Receta del `describe('#240: año en la fecha de la fila')`

Va en `screens/reminders/index.test.tsx`, **al final del fichero**, como
`describe` de nivel superior. Es solo test.

- **Relojes.** Cuatro constantes del `describe` con el ISO de
  [[requirements]] §Convenciones: `NOV`, `DIC`, `DIC_NOCHE`, `ENE`.
- **`beforeEach`.** Igual que el de `describe('#213 R14: series en Recordatorios'`
  salvo el reloj y los recordatorios:
  `hostProcess.env.TZ = 'America/Mexico_City';`, `jest.clearAllMocks();`,
  `process.env.EXPO_PUBLIC_API_URL = apiUrl;`, `mockUseAuth` autenticado,
  `mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet()] });`,
  `mockListReminders.mockReset();`. **No** fija reloj ni recordatorios: lo
  hace cada caso.
- **`afterEach`.** `jest.clearAllTimers(); jest.useRealTimers();` y restaurar
  la zona con `originalTimezone` como `#213 R14`.
- **Envoltorio inglés.** Una función del `describe`, `EnglishWrapper`, igual
  a `RemindersWrapper` (`HeroUINativeProvider` → `LanguageProvider` →
  `SelectedPetProvider`) pero con `initial="en"`.
- **Helper del caso.** Una función `async` del `describe`,
  `renderCase(language, clock, section, overrides)`, que en este orden:
  1. `jest.useFakeTimers({ now: new Date(clock) });`
  2. `mockListReminders.mockResolvedValue({ kind: 'ok', reminders: [makeReminder({ id: 'r', recurrence: null, recurrenceUntil: null, ...overrides })] });`
  3. `await renderWithProviders(<RemindersScreen />, { wrapper: language === 'en' ? EnglishWrapper : RemindersWrapper });`
  4. si `section === 'past'`: `await screen.findByTestId('reminders-past-toggle');`
     y `await expandPast();` (la fila de Pasados no existe hasta expandir);
     si no: `await screen.findByTestId('reminder-row-r');`.
  5. devuelve `within(screen.getByTestId(section === 'past' ? 'reminders-past-list' : 'reminders-upcoming-list')).getByTestId('reminder-row-r')`.

  `overrides` lleva `dueAt` y `status` de la fila de tabla y, en R4,
  `recurrence: { unit: 'month', every: 1 }` y su `recurrenceUntil`.
- **Aserción de fila (R1, R2, R3).** Con `const row = await renderCase(…);`:
  `expect(within(row).getByText(dateTime)).toBeOnTheScreen();` y
  `expect(within(row).getByText(suffix)).toBeOnTheScreen();`.
  `toBeOnTheScreen`, no `toBeVisible`: la fila de Pasados va al 50 % de
  opacidad y la aserción es la misma en las dos secciones. `getByText` exige
  el texto exacto del nodo (fecha y sufijo son dos `Text` distintos): un año
  de más o de menos lo tumba.
- **Títulos.** `it.each(<tabla> as const)('#240 R<n>: %s', …)`. La primera
  columna de cada tabla es el «Caso» literal de [[requirements]], para que
  `%s` dé el título exacto.

## T2 — Candado de #65 R15 con reloj fijo (enmienda; nace verde)

- [ ] (1) En `describe('#65 R15: la fecha del recordatorio se formatea con el locale del idioma'`:
  - el `beforeEach` empieza por
    `jest.useFakeTimers({ now: new Date(2026, 7, 24, 9, 0) });`, **antes** de
    `mockListReminders.mockResolvedValue(…makeReminder()…)` (`makeReminder`
    lee `Date.now()`);
  - el `describe` gana
    `afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });`;
  - el título `'passes es-MX explicitly to the date formatter'` pasa a
    `'passes es-MX explicitly to the date formatter (enmendado por #240 R5)'`.
  - La aserción no cambia.
- [ ] (2) `bun run jest src/screens/reminders`: verde. Commit
  `test(mobile): pin the clock of the es-MX date formatter lock (R5)`.
- [ ] (3) Sin refactor.

## R1, R2, R3 y R5 — Fila de fecha con año solo fuera del año en curso

- [ ] (1) Test rojo. En un solo commit, solo tests:
  - el `describe` de T1 con los tres `it.each` de R1, R2 y R3 (tablas
    literales de [[requirements]]);
  - el `it` nuevo
    `'#240 R5: pasa es-MX y el año a toLocaleDateString para una fecha de otro año'`
    dentro del mismo `describe`: reloj `NOV`, `dueAt: '2027-11-04T15:00:00.000Z'`,
    `const formatDate = jest.spyOn(Date.prototype, 'toLocaleDateString');`
    antes del render, `try`/`finally` con `formatDate.mockRestore()`, y
    `expect(formatDate).toHaveBeenCalledWith('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });`
    tras ver la fila;
  - las dos enmiendas de `describe('#178 R6: fila del canvas'` de la «Tabla de
    enmiendas»: `'2 ene, 09:00'` → `'2 ene 2027, 09:00'` y
    `'20 ene, 20:05'` → `'20 ene 2027, 20:05'`, cada `it` con
    ` (enmendado por #240 R1)` al final del título. `'3 dic, 11:30'` no se
    toca.

  `bun run jest src/screens/reminders > ../progress/t1_mobile-reminder-date-year.log 2>&1`.
  Rojo esperado, **exactamente nueve** tests:
  - `#240 R1: %s`, las cuatro filas;
  - `#240 R3: 31 dic 18:00 local, ya 2027 en UTC, visto el 1 ene` y
    `#240 R3: inglés, 31 dic 18:00 local visto el 1 ene`;
  - `#240 R5: pasa es-MX y el año a toLocaleDateString para una fecha de otro año`;
  - los dos `it` enmendados de `#178 R6`.

  Verde esperado en el mismo `describe`: las cuatro filas de `#240 R2` y las
  filas 1, 2 y 4 de `#240 R3` (la base nunca pinta año). Si el rojo no es
  exactamente ese, se para y se reporta: o un literal está mal copiado o la
  receta no aísla la fila.

  Commit `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`.
- [ ] (2) Nada de producción todavía: R4 va antes (sigue abajo).
- [ ] (3) —

## R4 — El «hasta» no cambia (nace verde)

- [ ] (1) En el mismo `describe`, el `it.each` de R4 con su tabla literal. La
  aserción es
  `within(within(row).getByTestId('reminder-repeats-r')).getByText(<línea>)`.
  `bun run jest src/screens/reminders`: las cinco filas de R4 en verde; el rojo
  sigue siendo el de la tarea anterior y nada más. Commit
  `test(mobile): series until text keeps its year rule with a January clock (R4)`.
- [ ] (2) Sin producción: R4 fija el comportamiento de hoy.
- [ ] (3) Sin refactor.

## Implementación (R1, R2, R3, R5)

- [ ] (2) En `screens/reminders/index.tsx`, cambiar **solo** la línea
  `const date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' });`
  por la de [[design]] §Decisiones técnicas. Sin comentario.
  - `bun run jest src/screens/reminders > ../progress/t2_mobile-reminder-date-year.log 2>&1`:
    todo verde, con el número de tests de T0 más los nuevos
    (4 + 4 + 5 + 5 + 1 = 19).
  - `bun run typecheck` verde.
  - `bun run lint > ../progress/lint_mobile-reminder-date-year.log 2>&1 && test ! -s ../progress/lint_mobile-reminder-date-year.log`
    (si `expo lint` muere por SIGKILL sale 0; el `test ! -s` lo destapa: si el
    log no está vacío, se lee y se reporta).
  - Medir otra vez la columna «Tras el cambio» de [[requirements]]
    §Evidencia y anotarla.

  Commit `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)`.
- [ ] (3) Refactor: ninguno previsto. La línea ya es mínima.

## Sondas (después del verde; nunca se commitean)

Cada sonda cambia **una** cosa en `screens/reminders/index.tsx`, corre
`bun run jest src/screens/reminders` y se revierte con
`git checkout HEAD -- src/screens/reminders/index.tsx`. Tras revertir,
`git diff --stat` y `git diff --cached --stat` vacíos. En
`progress/impl_mobile-reminder-date-year.md` se anota, por sonda, la lista de
tests rojos. Cada sonda tiene que dar **al menos** los rojos de su fila.

| Sonda | Mutación | Rojos mínimos |
|---|---|---|
| S1 | los dos años en UTC: `due.getUTCFullYear() === new Date(now).getUTCFullYear()` | `#240 R3` filas 1, 3, 4 y 5 |
| S2 | solo hoy en UTC: `due.getFullYear() === new Date(now).getUTCFullYear()` | `#240 R3` fila 2 |
| S3 | solo `due` en UTC: `due.getUTCFullYear() === new Date(now).getFullYear()` | `#240 R3` filas 1 a 5 |
| S4 | año siempre (las dos ramas con `year: 'numeric'`) | `#240 R2` (cuatro), `#240 R3` filas 1, 2 y 4, `passes es-MX explicitly … (enmendado por #240 R5)`, `formatea la hora lejana … (enmendado por #227 R13) (enmendado por #240 R1)` (por `'3 dic, 11:30'`) |
| S5 | año nunca (la línea de la base) | `#240 R1` (cuatro), `#240 R3` filas 3 y 5, `#240 R5`, los dos `it` enmendados de `#178 R6` |
| S6 | año fijo: `due.getFullYear() === 2026` | `#240 R1` fila 3, `#240 R2` fila 2, `#240 R3` filas 3 y 5 |
| S7 | `new Intl.DateTimeFormat(locale, <mismas opciones>).format(due)` en lugar de `toLocaleDateString` | `#240 R5` y `passes es-MX explicitly … (enmendado por #240 R5)` |
| S8 | el «hasta» con hoy en UTC: `until.getFullYear() === new Date(now).getUTCFullYear()` | `#240 R4` fila 3 |

Si una sonda no da sus rojos mínimos, el candado está ciego: se para y se
reporta antes de abrir la PR.

## Cierre

- [ ] `progress/impl_mobile-reminder-date-year.md` con T0, los rojos de la
  tarea R1–R5, las sondas y los hashes.
- [ ] [[traceability]] con test y commit por fila.
- [ ] La sección `## Enmienda #240 — Año en la fecha de Recordatorios` de
  `specs/mobile-routine-canvas-fidelity/requirements.md` ya existe (la deja
  esta spec); Codex no la toca.
