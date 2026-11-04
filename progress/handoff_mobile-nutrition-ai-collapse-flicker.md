Worktree: /home/claude/sites/Pet-Tracker-wt-234

# Handoff #234 mobile-nutrition-ai-collapse-flicker

Implementador: Codex CLI.

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-234 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/234-mobile-nutrition-ai-collapse-flicker`.
Commits de arriba abajo: el de este handoff (`docs(progress): #234 codex handoff`), la firma
`e1231ece` (H0) y `26b86621` (`origin/dev`).

## Base

- Feature: mobile-nutrition-ai-collapse-flicker (#234). Integra en `dev`, no en `main`.
- H0 (base del diff final de producción): `e1231ece`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene `.env`
  y `mobile-pet-tracker/node_modules`.

## Spec

- Aprobada con firma delegada (`e1231ece`) para R1 a R7. La casilla de enmienda de #224 R6 en
  `specs/mobile-nutrition-ai-format/requirements.md` y la G2 (smoke) son del humano: no las tocas.
- Lee enteros `specs/mobile-nutrition-ai-collapse-flicker/requirements.md`, `design.md`, `tasks.md`
  y `traceability.md`. Las decisiones D1 a D9 están cerradas. Si encuentras una contradicción,
  PARA y anótala; no adaptes la spec.
- Cambio de producción: solo `src/screens/food/ai-explanation.tsx`. El `onLayout` sale de
  `food-ai-content` y pasa a un nodo nuevo `food-ai-measure` (primer hijo de la raíz `gap-2`,
  oculto, que repite los bloques con `renderBlocks`). Nada de copy, colores ni dependencias.

## Orden y commits

Test primero (C4 de CHECKPOINTS.md), los seis commits de `tasks.md` (dos por par; mensajes en
inglés con `(R<n>)`, tal como están en `tasks.md`), y después uno de trazabilidad:

1. Par 1 test (rojo esperado `32 failed, 7 passed, 39 total`) y feat (verde, 39).
2. Par 2 test (`3 failed, 39 passed, 42 total`) y feat (verde, 42).
3. Par 3 test (`2 failed, 42 passed, 44 total`) y feat (verde, 44).
4. `docs(spec): #234 traceability`: `traceability.md` con hashes. No rebasees después.

Antes de cada rojo comprueba que los `it` fallan **por la aserción** (no por «Cannot find module»
ni un import roto; en el par 1 el rojo de los `it` existentes es «Unable to find an element with
testID: food-ai-measure», y es válido porque es la aserción de existencia del medidor). Si una cifra
difiere, anota la diferencia y el motivo; si no sabes el motivo, PARA.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/screens/food/ai-explanation.tsx` (solo los commits feat);
- `mobile-pet-tracker/src/screens/food/ai-explanation.test.tsx`;
- `specs/mobile-nutrition-ai-collapse-flicker/traceability.md`;
- `progress/impl_mobile-nutrition-ai-collapse-flicker.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `docs/`, `src/theme/`,
`src/i18n/`, `src/__tests__/ui-copy-table.ts`, `package.json`, `bun.lock`, `init.sh`,
`feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md`,
`progress/handoff_*.md`, `src/screens/food/index.tsx` ni otros `specs/`.

Mutaciones: las de R1 a R6 tocan `src/screens/food/ai-explanation.tsx`; R7(b) toca además
`src/__tests__/nutrition-canvas-fidelity.test.ts` solo para correr el guard (la mutación se planta en
el fuente `ai-explanation.tsx`, el guard no se edita). Se revierten con
`git checkout HEAD -- mobile-pet-tracker/src/screens/food/ai-explanation.tsx` (y el test si lo
mutaste) y `git diff --cached --quiet`. Ninguna se commitea. Hazlas con los commits ya hechos.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga con los nombres del catálogo de Codex `building-native-ui`.
  Lista en el reporte cuáles cargaste.
- **Esperas.** `docs/conventions.md` §Esperas: espera al nodo positivo que aserta el test, nunca a
  un contador de mock.
- **Literales a mano.** Los `testID`, clases y textos de los tests se escriben a mano, nunca valores
  importados de producción. Los `queryBy…` de ausencia llevan `{ includeHiddenElements: true }`.
  Entre nodos se comparan `testID`/`className`/`type`/`children`, no `toBe(nodo)`.
- **No cambies imports, `jest.mock` ni helpers** de `ai-explanation.test.tsx` salvo el helper
  `layout` (reapuntado) y el nuevo `clippedLayout`, ambos descritos en la spec. Los `describe` nuevos
  van al final. Del `it.each` de #224 R6 solo cambia el título (sufijo `(enmendado por #234 R4)`).
- **RNTL 14.** `await` en `render`, `rerender`, `fireEvent` y `act`.
- **`#234` en código y tests.** Siempre seguido de ` R<n>`. Sin `StyleSheet` en el test ni en el
  fuente; sin hex, clases `[...]`, copy ni dependencias.
- **T0.** Antes de editar, mide las anclas «Hoy» de la Evidencia con `grep -cF --` y corre en verde
  `cd /home/claude/sites/Pet-Tracker-wt-234/mobile-pet-tracker && bunx jest src/screens/food src/__tests__ > /tmp/t0-234.log 2>&1; echo "exit=$?"`.
  Si el log dice «failed to run» o un SIGKILL, repite (no cuenta como 0 tests).
- **Jest.** Rutas por prefijo sin paréntesis. Timeout bajo carga: repite sola. Flakes conocidos
  (#200 R9/R10 en `food/index.test.tsx`): repite y anota.
- **Tipos y lint**, al final, con logs fuera del repo:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-234.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > /tmp/lint-234.log 2>&1 && test ! -s /tmp/lint-234.log && echo LINT_OK`.
- **Anclas finales** (columna «Tras #234» de la Evidencia) con `grep -cF --`, y
  `grep -cF "(enmendado por #234 R4)" src/screens/food/ai-explanation.test.tsx` imprime `1`.
- **Diff acotado, medido desde el commit de este handoff** (H0 es anterior y el propio handoff
  aparecería en el diff):
  `B=$(git log -1 --format=%h -- progress/handoff_mobile-nutrition-ai-collapse-flicker.md) && git diff --name-only $B..HEAD`
  solo lista la lista cerrada (más el reporte si lo commiteas; no lo hagas). Y la ancla R7:
  `git diff $B..HEAD -- mobile-pet-tracker/src/screens/food/ai-explanation.test.tsx | grep '^-' | grep -v '^---'`
  solo lista líneas del cuerpo/firma del helper `layout` y el título de #224 R6.
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-nutrition-ai-collapse-flicker.md`: salida del primer comando y de T0; cada
commit con su hash, la cifra de rojo medida y su causa; las mutaciones con orden y salida (incluida
la nota de R1(b)); anclas; cifras de jest, tsc y lint; skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-nutrition-ai-collapse-flicker.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
