Worktree: /home/claude/sites/Pet-Tracker-wt-239
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).

# Handoff #239 mobile-reminder-swipe-past-row-bleed

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-239 && pwd && git branch --show-current && git log --oneline -5`.
Confirma en el reporte la ruta y la branch `feature/239-mobile-reminder-swipe-past-row-bleed`.
Commits de arriba abajo: el de este handoff (`docs(progress): #239 codex handoff`), `7655c8a3`
(cierre de la firma, H0), `e4e1cb15` (firma), `f9176007` (spec) y `0f1ab26f` (`origin/dev`).

## Base

- Feature: mobile-reminder-swipe-past-row-bleed (#239). Integra en `dev`, no en `main`.
- H0 (base del diff final de producción): `7655c8a3`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene `.env`
  y `mobile-pet-tracker/node_modules`: el paso T0 (1) de `tasks.md` ya está hecho, sáltalo.

## Spec

- Aprobada con firma delegada (`e4e1cb15` + `7655c8a3`) para R1 a R7. La casilla G2 (smoke) es
  del humano: no la tocas. La casilla de la Enmienda #239 en
  `specs/mobile-reminders-upcoming-past/requirements.md` ya está marcada: no edites esa spec.
- Lee enteros `specs/mobile-reminder-swipe-past-row-bleed/requirements.md`, `design.md`,
  `tasks.md` y `traceability.md`. Las decisiones están cerradas (requirements §Decisiones y
  design §Alternativas). Si encuentras una contradicción, PARA y anótala; no adaptes la spec.
- Cambio de producción: solo `src/screens/reminders/index.tsx`, y en él solo el hijo del
  `ReanimatedSwipeable` de la rama del dueño en `renderRow` (design §Código objetivo, literal):
  el `{row}` pasa a `{past ? (` + base `<View className="rounded-22 bg-background" style={CONTINUOUS_CORNER}>`
  con `{row}` dentro + `</View>` + `) : row}`. Ni imports, ni copy, ni colores, ni dependencias.
  El formato de fecha y `untilDay` son de #240: no se tocan.

## Orden y commits

Test primero (C4 de CHECKPOINTS.md), los commits de `tasks.md` con sus mensajes literales en
inglés, y después uno de trazabilidad. Las cifras son relativas a la línea base que midas en T0
con `bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`
(llámala `P` pasados, 0 fallidos):

1. T0: anclas «Hoy» de requirements §Evidencia y localizadores de la Tabla de enmiendas
   (`grep -cF` → 1 salvo `+ 1 // #228 R2` en `consistency-classnames.test.ts`, que da 2), y la
   corrida T0 completa de `tasks.md`. Sin commit.
2. Sondas S1 y S2 con los tests nuevos escritos y sin commitear (protocolo abajo).
3. `test(mobile): opaque base under past reminder rows (R1, R2, R3, R4, R5, R6)`. Rojo esperado,
   en la corrida de arriba: `4 failed`, exactamente `#239 R1`, `#239 R2`, `#239 R5` y `#239 R6`;
   `P + 2` pasados (`#239 R3` y `#239 R4` nacen verdes).
4. `feat(mobile): give past reminder rows an opaque base inside the swipeable (R1, R2, R5, R6)`,
   con los tres guards de la Tabla de enmiendas en el mismo commit (sin sufijo todavía). Verde:
   `P + 6` pasados, 0 fallidos; y la corrida T2 completa de `tasks.md` en verde. Después, sondas
   S3, S4 y S5 sin commit.
5. `test(mobile): amended locks name the past-row base amendment (R7)`. Rojo: `1 failed`
   (`#239 R7`), `P + 6` pasados.
6. `test(mobile): suffix amended locks with #239 R7 (R7)`. Verde: `P + 7` pasados, 0 fallidos.
7. `docs(spec): #239 traceability`: `traceability.md` con hashes. No rebasees después.

Antes de cada rojo comprueba que los `it` fallan **por la aserción** (no por «Cannot find module»
ni un import roto). Si una cifra difiere, anota la diferencia y el motivo; si no sabes el motivo,
PARA. Si R5 no puede montar el `ReanimatedSwipeable` real en jest, PARA con el error; no lo
sustituyas por el doble ni borres el `it`.

Regla de cierre (requirements §Tabla de enmiendas): un `it` ajeno que en el commit 4 falle **solo**
por un delta de esta spec se enmienda en ese commit, se suma a `AMENDED_PAST_ROW_BASE` en el
commit 5 y se anota con ruta y título en el reporte. Cualquier otro rojo se reporta y no se toca.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/screens/reminders/index.tsx` (solo el commit 4);
- `mobile-pet-tracker/src/screens/reminders/index.test.tsx`;
- `mobile-pet-tracker/src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`;
- `mobile-pet-tracker/src/__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`;
- `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`;
- `mobile-pet-tracker/src/__tests__/design-drift.test.ts`;
- otro test de `mobile-pet-tracker/src/` solo si cae bajo la Regla de cierre, anotado;
- `specs/mobile-reminder-swipe-past-row-bleed/traceability.md`;
- `progress/impl_mobile-reminder-swipe-past-row-bleed.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `docs/`, `src/theme/`,
`src/i18n/`, `src/__tests__/ui-copy-table.ts`, `package.json`, `bun.lock`, `app.json`, `init.sh`,
`feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md`,
`progress/handoff_*.md` ni otros `specs/`.

Sondas: se plantan solas en `mobile-pet-tracker/src/screens/reminders/index.tsx`, con la mutación
literal de `tasks.md`, se corre `bun run jest src/screens/reminders` (S1, S2) o
`bun run jest src/screens/reminders src/__tests__/reminder-swipe-actions-canvas-fidelity.test.ts`
(S3 a S5) y se anota qué `it` sale rojo. Se revierten con
`git checkout HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx` y se comprueba
`git diff --quiet HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx && git diff --cached --quiet`.
Ninguna se commitea. S1 y S2 van antes del commit 3; S3 a S5, con el commit 4 ya hecho.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga, con los nombres del catálogo de Codex,
  `building-native-ui`. No hay skill de animación ni de design system en tu catálogo: la guía
  está en la spec. Lista en el reporte cuáles cargaste.
- **Esperas.** `docs/conventions.md` §Esperas: espera al nodo positivo que aserta el test
  (`findByTestId('reminders-past-toggle')`, `expandPast()`, `findByTestId('reminder-row-pastonce')`),
  nunca a un contador de mock.
- **Literales a mano.** Los `testID`, clases y textos de los tests se escriben a mano, nunca
  valores importados de producción. Las consultas del panel llevan `HIDDEN` y se asertan con
  `toBeOnTheScreen()`, nunca `toBeVisible()`. Entre nodos se comparan `testID`/`className`/
  longitudes, nunca `toBe(nodo)` ni `toEqual(nodo)`.
- **No cambies imports, `jest.mock` ni helpers** de `screens/reminders/index.test.tsx`: el doble
  de `ReanimatedSwipeable`, `mockRealSwipeable`, `HIDDEN`, `flat`, `expandPast` y `makePet` ya
  están. El `describe` nuevo va al final del fichero; los `it` de R6 y R7, al final del suyo.
- **RNTL 14.** `await` en `render`, `fireEvent` y `act`. `within(x)` no mira `x`.
- **`#239` en código y tests.** Siempre seguido de ` R<n>`; donde un literal de test lo necesite
  solo, `\x23239`. Sin `StyleSheet` ni hex en tests ni fuente; sin clases `[...]`, copy ni
  dependencias.
- **Jest.** Rutas por prefijo sin paréntesis. Si el log dice «failed to run» o hay un SIGKILL,
  repite (no cuenta como 0 tests). Timeout bajo carga: repite sola. Flakes conocidos (Salud
  `#168 R2`, Inicio `#152 R8`, Nutrición `#200 R9`/`R10`): repite una vez y anota.
- **Tipos y lint**, al final, desde `mobile-pet-tracker/`:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-239.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > /tmp/lint-239.log 2>&1 && test ! -s /tmp/lint-239.log && echo LINT_OK`.
- **Anclas finales**: la tabla de R6 con `grep -oF -- "<literal>" src/screens/reminders/index.tsx | wc -l`,
  más `grep -oE '\brounded-22\b' src/screens/reminders/index.tsx | wc -l` → 4 y
  `grep -oF 'style={CONTINUOUS_CORNER}' src/screens/reminders/index.tsx | wc -l` → 8. Y
  `grep -cF "(enmendado por #239 R7)"` imprime `1` en
  `src/__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`, `3` en
  `src/__tests__/consistency-classnames.test.ts` y `1` en `src/__tests__/design-drift.test.ts`
  (más uno por cada `it` de la Regla de cierre, anotado).
- **Diff acotado, medido desde el commit de este handoff** (H0 es anterior y el propio handoff
  aparecería en el diff):
  `B=$(git log -1 --format=%h -- progress/handoff_mobile-reminder-swipe-past-row-bleed.md) && git diff --name-only $B..HEAD`
  solo lista la lista cerrada. Y en producción:
  `git diff $B..HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx | grep -c '^-[^-]'`
  imprime `1` (la línea `{row}`) y `… | grep -c '^+[^+]'` imprime `5`.
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-reminder-swipe-past-row-bleed.md`: salida del primer comando y de T0 (con
`P`); cada commit con su hash, la cifra medida y la causa del rojo; las sondas S1 a S5 con su
salida; los `it` de la Regla de cierre, si los hubo; anclas; cifras de jest, tsc y lint; skills
cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-reminder-swipe-past-row-bleed.done` con una sola línea:
la ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
