Worktree: /home/claude/sites/Pet-Tracker-wt-240
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).

# Handoff #240 mobile-reminder-date-year

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-240 && pwd && git branch --show-current && git log --oneline -6`.
Confirma en el reporte la ruta y la branch `feature/240-mobile-reminder-date-year`.
Commits de arriba abajo: el de este handoff (`docs(progress): #240 codex handoff`), `d64a2b02`
(merge de `origin/dev` con #239 ya dentro, H0), `3e5585d5` (PR #307 de #239), `b4814711`, …, y
en la rama `dc626852` (firma) y `d26b6a70` (spec).

## Base

- Feature: mobile-reminder-date-year (#240). Integra en `dev`, no en `main`.
- H0 (base del diff final de producción): `d64a2b02`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene `.env`
  y `mobile-pet-tracker/node_modules`: el paso T0 (1) de `tasks.md` ya está hecho, sáltalo.
- #239 ya está en la rama (merge `d64a2b02`). Tocó el mismo `renderRow` (base opaca de la fila
  pasada) y añadió al final de `screens/reminders/index.test.tsx` el `describe` `Base opaca de la
  fila pasada (#239 R1 a R5)`. El leader re-midió tras ese merge: todas las cuentas de
  requirements §Evidencia (columna «Cuenta») y los localizadores de la Tabla de enmiendas dan la
  misma cifra que en la spec. No hay que reabrir nada.

## Spec

- Aprobada con firma delegada (`dc626852`) para R1 a R5. La casilla G2 (smoke) es del humano: no
  la tocas. La sección `## Enmienda #240 — Año en la fecha de Recordatorios` de
  `specs/mobile-routine-canvas-fidelity/requirements.md` ya existe y su casilla ya está marcada:
  no edites esa spec.
- Lee enteros `specs/mobile-reminder-date-year/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`. Las decisiones están cerradas (requirements §Decisiones y design
  §Alternativas). Si encuentras una contradicción, PARA y anótala; no adaptes la spec.
- Cambio de producción: solo `src/screens/reminders/index.tsx`, y en él solo la línea
  `const date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' });` de
  `renderRow`, que pasa a la ternaria literal de design §Decisiones técnicas (tres líneas). Ni
  imports, ni copy, ni la línea `const time = …`, ni el «hasta», ni el JSX, ni la base de #239.
  Sin comentario.
- Literales: los de las tablas de requirements, copiados tal cual (espacios U+0020, sin punto tras
  el mes, sin «de»). No los recalcules.

## Orden y commits

Test primero (C4 de CHECKPOINTS.md), los commits de `tasks.md` con sus mensajes literales en
inglés, y después uno de trazabilidad. Las cifras son relativas a la línea base que midas en T0
con `bun run jest src/screens/reminders` desde `mobile-pet-tracker/` (llámala `P` pasados,
0 fallidos):

1. T0: anclas de requirements §Evidencia (columna «Cuenta») y localizadores de la Tabla de
   enmiendas (`grep -cF` → 1), y la corrida T0 de `tasks.md`. Sin commit.
2. `test(mobile): pin the clock of the es-MX date formatter lock (R5)` (tasks §T2). Verde: `P`
   pasados, 0 fallidos (solo cambian el reloj y el título).
3. `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`.
   Rojo esperado: `9 failed`, exactamente los nueve de tasks §«R1, R2, R3 y R5» (1); `P + 5`
   pasados (7 de los 14 `it` nuevos nacen verdes y los 2 `it` enmendados de `#178 R6` pasan a
   rojo).
4. `test(mobile): series until text keeps its year rule with a January clock (R4)`. Siguen
   `9 failed`, los mismos; `P + 10` pasados.
5. `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)`.
   Verde: `P + 19` pasados, 0 fallidos. Antes de commitear, también
   `bun run jest src/__tests__ > ../progress/static_mobile-reminder-date-year.log 2>&1` en verde
   (ningún guard estático lee esa línea, según la spec; si alguno sale rojo, PARA y reporta su
   ruta y título, no lo enmiendes). Después, sondas S1 a S8 sin commit.
6. `docs(spec): #240 traceability`: `traceability.md` con test y hash por fila. No rebasees
   después.

Antes de cada rojo comprueba que los `it` fallan **por la aserción** (no por «Cannot find module»,
un import roto o un `getByTestId` que no encuentra la sección). Si una cifra difiere, anota la
diferencia y el motivo; si no sabes el motivo, PARA.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/screens/reminders/index.tsx` (solo el commit 5);
- `mobile-pet-tracker/src/screens/reminders/index.test.tsx`;
- `specs/mobile-reminder-date-year/traceability.md`;
- `progress/impl_mobile-reminder-date-year.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `docs/`, `src/__tests__/`,
`src/theme/`, `src/i18n/`, `src/utils/`, `package.json`, `bun.lock`, `app.json`, `init.sh`,
`feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md`,
`progress/handoff_*.md` ni otros `specs/`. Los logs `progress/*.log` están en `.gitignore`: no
los commitees.

Sondas (tasks §Sondas): se plantan solas en `mobile-pet-tracker/src/screens/reminders/index.tsx`,
con la mutación literal de su fila, se corre `bun run jest src/screens/reminders` y se anota qué
`it` sale rojo. Se revierten con
`git checkout HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx` y se comprueba
`git diff --quiet HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx && git diff --cached --quiet`.
Ninguna se commitea. Todas van con el commit 5 ya hecho. Si una no da sus rojos mínimos, PARA.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga, con los nombres del catálogo de Codex,
  `building-native-ui`. No hay más skill aplicable en tu catálogo: la guía está en la spec. Lista
  en el reporte cuáles cargaste.
- **Esperas.** `docs/conventions.md` §Esperas: espera al nodo positivo que aserta el test
  (`findByTestId('reminder-row-r')`, `findByTestId('reminders-past-toggle')` + `expandPast()`),
  nunca a un contador de mock.
- **Zona y reloj** (requirements §Convenciones): zona con `hostProcess.env.TZ`, nunca
  `process.env.TZ` (jest lo ignora); reloj por caso con `jest.useFakeTimers({ now: new Date(<ISO>) })`
  antes del render; `afterEach` con `jest.clearAllTimers(); jest.useRealTimers();` y la zona
  restaurada desde `originalTimezone`.
- **Literales a mano.** Los `testID` y textos de los tests se escriben a mano, nunca valores
  importados de producción. Aserciones con `toBeOnTheScreen()`, nunca `toBeVisible()` (la fila
  de Pasados va al 50 %). Entre nodos, nunca `toBe(nodo)` ni `toEqual(nodo)`.
- **No cambies imports, `jest.mock` ni helpers** de `screens/reminders/index.test.tsx`
  (`RemindersWrapper`, `makeReminder`, `makePet`, `expandPast`, `hostProcess`,
  `originalTimezone`, `renderWithProviders` ya están; `LanguageProvider`,
  `HeroUINativeProvider` y `SelectedPetProvider` ya se importan). `EnglishWrapper` y
  `renderCase` son funciones locales del `describe` nuevo, que va **al final del fichero**, después
  del de #239.
- **RNTL 14.** `await` en `render`, `fireEvent` y `act`. `within(x)` no mira `x`.
- **`#240`.** En producción, ninguno. En tests, los títulos literales de la spec
  (`'#240: año en la fecha de la fila'`, `'#240 R<n>: %s'`, los sufijos `(enmendado por #240 R<n>)`);
  ningún otro `#240` suelto. Sin `StyleSheet` ni hex en tests ni fuente; sin copy ni dependencias.
- **Jest.** Rutas por prefijo sin paréntesis. Si el log dice «failed to run» o hay un SIGKILL,
  repite (no cuenta como 0 tests). Timeout bajo carga: repite sola. Flakes conocidos (Salud
  `#168 R2`, Inicio `#152 R8`, Nutrición `#200 R9`/`R10`): repite una vez y anota.
- **Tipos y lint**, al final, desde `mobile-pet-tracker/`:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-240.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > /tmp/lint-240.log 2>&1 && test ! -s /tmp/lint-240.log && echo LINT_OK`.
- **Anclas finales**: la columna «Tras el cambio» de requirements §Evidencia con
  `grep -oF -- "<literal>" src/screens/reminders/index.tsx | wc -l`, y en
  `src/screens/reminders/index.test.tsx` `grep -cF -- "(enmendado por #240 R1)"` → `2` y
  `grep -cF -- "(enmendado por #240 R5)"` → `1`.
- **Diff acotado, medido desde el commit de este handoff** (H0 es anterior y el propio handoff
  aparecería en el diff):
  `B=$(git log -1 --format=%h -- progress/handoff_mobile-reminder-date-year.md) && git diff --name-only $B..HEAD`
  solo lista la lista cerrada. Y en producción:
  `git diff $B..HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx | grep -c '^-[^-]'`
  imprime `1` (la línea `const date = …`) y `… | grep -c '^+[^+]'` imprime `3`.
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-reminder-date-year.md`: salida del primer comando y de T0 (con `P`); cada
commit con su hash, la cifra medida y la causa del rojo; la corrida de `src/__tests__`; las sondas
S1 a S8 con su lista de rojos; anclas; cifras de jest, tsc y lint; skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-reminder-date-year.done` con una sola línea: la ruta
del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
