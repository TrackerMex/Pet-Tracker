Worktree: /home/claude/sites/Pet-Tracker-wt-228

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

# Handoff #228 mobile-reminder-swipe-actions

Implementador: Codex CLI.

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-228 && pwd && git branch --show-current && git log --oneline -5`.
Confirma en el reporte la ruta y la branch `feature/228-mobile-reminder-swipe-actions`. Los
commits de arriba abajo: el de este handoff (`docs(progress): #228 codex handoff`), la firma
`8fdc938d` (H0), el merge de `origin/dev` `573a8e3e`, la spec `a8d58b31` y `426ffd32`.

## Base

- Feature: mobile-reminder-swipe-actions (#228). Integra en `dev`, no en `main`.
- H0 (base del diff final): `8fdc938d`, la firma, que va encima del merge de `origin/dev`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene
  `.env` y `mobile-pet-tracker/node_modules`.
- T0 (1) de tasks.md ya lo hizo el leader: sáltalo. T0 (2) sí: mide las anclas de §Evidencia y
  de la «Tabla de enmiendas» con el método de tasks.md T0 (2) y anota cada cifra. El merge de
  `origin/dev` no tocó `screens/reminders/` ni los cuatro guards de la tabla, así que las cifras
  medidas en `77788959` siguen valiendo. Si una no da la suya, PARA.

## Spec

- Aprobada con firma delegada (`8fdc938d`). Lee enteros
  `specs/mobile-reminder-swipe-actions/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- Sin decisiones abiertas: la sección «Decisiones» de requirements.md las cierra. Si encuentras
  una contradicción, PARA y anótala en el reporte; no adaptes la spec por tu cuenta.
- Criterios de aceptación: R1 a R11 y R13. **R12 no entra**: la casilla G4 de requirements.md
  §Aprobación sigue sin marcar, así que no escribes su test ni tocas `docs/ui-guidelines.md`
  (tasks.md §R12). Su fila de traceability.md queda «pendiente (bloqueado por G4)». Las
  casillas G4 y G2 son del humano y no las tocas.
- Sin copy nuevo: el panel reutiliza `reminders.delete`, `reminders.cancelSeries` y
  `reminders.cancelSeriesA11y` (R1). No inventes ningún literal.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). Sigue el orden de
tasks.md, que no es el de los R-ids. Catorce commits, con los mensajes literales de tasks.md:

1. `test(mobile): swipeable double and hidden-query option for reminders (T0)`: verde, solo
   tests.
2. `test(mobile): copy, canvas fidelity and source inventory of reminder swipe actions (R1, R10, R11)`:
   rojo, con las sondas S1, S2 y S3 anotadas en el reporte.
3. `test(mobile): owner reminder rows sit inside a swipeable (R2)`: rojo.
4. `test(mobile): swipe panel follows the canvas recipe and hides from screen readers (R3)`:
   rojo.
5. `test(mobile): pressing the swipe panel closes it and opens its sheet (R4)`: rojo.
6. `test(mobile): reminder rows expose their action to accessibility (R5)`: rojo.
7. `test(mobile): past reminder rows swipe too (R6)`: rojo.
8. `test(mobile): reminder rows drop the text button (R8)`: rojo.
9. `test(mobile): real swipeable mounts the row and its panel (R9)`: rojo.
10. `feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11)`:
    verde, con producción, candados de `index.test.tsx` y guards; después las sondas S4, S5 y
    S6, sin commit.
11. `test(mobile): non-owner rows have no swipe actions (R7)`: nace verde, con las sondas S7,
    S8 y S9 anotadas.
12. `test(mobile): amended locks name their amendment (R13)`: rojo.
13. `test(mobile): suffix amended locks with #228 R13 (R13)`: verde.
14. `docs(spec): #228 traceability` con `traceability.md` rellena (hashes de 1 a 13; R12
    «pendiente (bloqueado por G4)»). No rebasees después.

Cada rojo lleva solo tests. Antes de cada rojo, comprueba que el `it` nuevo falla **por la
aserción** y por la razón de la tabla de tasks.md (no por un import roto ni «Cannot find
module»), y que el resto del fichero sigue verde. Si un `it` que la spec da por rojo nace
verde, anota «nace verde: <motivo>»; si no sabes por qué, PARA. Los guards van en el commit que
los provoca (el 10), nunca en uno posterior.

**Regla de cierre** (requirements.md §Tabla de enmiendas): un `it` ajeno, dentro de las rutas
de T0 (3), que se pone rojo solo por las causas (a) a (d) se enmienda en el commit del
requisito que lo provoca y se suma a `AMENDED` en R13. Cualquier otro rojo ajeno, PARA.

## Archivos

Lista cerrada, rutas desde `mobile-pet-tracker/src/` salvo las de `specs/` y `progress/`:

- `screens/reminders/index.tsx` y `screens/reminders/index.test.tsx`;
- `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts` (nuevo);
- los guards `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`,
  `__tests__/consistency-classnames.test.ts`, `__tests__/design-drift.test.ts` y
  `__tests__/routine-canvas-fidelity.test.ts`, solo con los deltas de la tabla «Candados de
  guards y de recuento» y de la Regla de cierre;
- `specs/mobile-reminder-swipe-actions/traceability.md`;
- `progress/impl_mobile-reminder-swipe-actions.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `package.json`, `bun.lock`,
`app.json`, `src/app/_layout.tsx`, `i18n/catalog.ts`, `__tests__/ui-copy-table.ts`,
`theme/global.css` (salvo la sonda S3, que se deshace), `init.sh`, `feature_list.json`,
`STATUS.md`, `progress/current.md`, `progress/history.md`, `docs/`, `progress/handoff_*.md`,
`progress/smoke_mejoras-smoke.md`, las seis specs enmendadas ni el resto de `specs/`.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga, con los nombres que tú tienes:
  - `building-native-ui` (plugin expo): `Pressable`, dianas, `accessibilityActions`,
    `accessibilityState`;
  - `appllama-app-design-skill` (`.agents/skills/`), que la carta exige al cambiar una pantalla;
  - `animate-expo` (`.agents/skills/`) para el deslizable de Reanimated y Gesture Handler. Tu
    plugin expo no tiene skill de animación ni de gestos; las decisiones (sin rebote, sin
    háptica, opacidad 0,8 al pulsar) ya están en R2 y R3.

  No hay equivalente tuyo de `expo-design-system`: la regla de tokens (sin hex, sin clases
  `[...]`, solo clases y tokens existentes) está en la spec y en la carta. Lista en el reporte
  cuáles cargaste.
- **Literales a mano.** Los testIDs, textos, clases y nombres de los tests son literales
  escritos a mano; nunca importados de producción (salvo `R8_REMINDERS`, que es la tabla de
  copy).
- **Esperas.** `docs/conventions.md` §Esperas sobre el árbol renderizado: espera siempre al nodo
  que aserta el test, nunca a un contador de mock (`mockSwipeable`, `mockSwipeableClose`,
  `mockDeleteReminder`).
- **RNTL 14.** `await` en `render`, `renderRouter`, `fireEvent` y `act`; sin `await`, un `it`
  contamina al siguiente.
- **Panel oculto.** El panel lleva `accessibilityElementsHidden` e
  `importantForAccessibility="no-hide-descendants"`: toda consulta del panel o de sus hijos va
  con `HIDDEN` (`{ includeHiddenElements: true }`), y `within()` no ve la raíz que recibe.
- **El doble.** Es el de tasks.md T0 (4), literal: `jest.mock` **sin** `{ virtual: true }`,
  factory con `{ __esModule: true, default: … }` y el `requireActual` del componente real
  resuelto al pintar, no al cargar el factory.
- **R9 con el componente real.** El leader lo probó antes de firmar, fuera del árbol: el
  `ReanimatedSwipeable` real se monta en jest, pinta el panel sin deslizar y su `close()`
  funciona (design.md §Riesgos). RNGH escribe en `console.error` «Some of the callbacks in the
  gesture are worklets and some are not»: es ruido esperado, no lo silencies ni pares por él.
  Si R9 no puede montar el real, PARA con el error; no lo sustituyas por el doble.
- **Relojes.** Los `jest.useFakeTimers({ now: … })` y sus `afterEach` son los de la spec,
  literales. No cambies la zona horaria.
- **`#228` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de
  `design-drift`): un `#228` desnudo tumba la guarda. En las regex de R12 y R13 el número va
  como `\x23228`.
- **Producción.** Sin `StyleSheet.create`, sin hex, sin clases `[...]`, sin copy nuevo, sin
  dependencias. El import es
  `import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';`, justo
  después del de `react-native`.
- **Jest.** Siempre desde `mobile-pet-tracker/` y con las rutas sin paréntesis de tasks.md (los
  paths con paréntesis rompen el regex; si los necesitas, `--runTestsByPath`). Si una suite da
  timeout bajo carga, repítela sola antes de concluir. Un rojo conocido de flake (Salud
  `#168 R2`, Inicio `#152 R8`, Nutrición `#200 R9`/`R10`) se repite una vez y se anota.
- **Línea base y final.** Los logs de T0 (3), del commit 10 y de R13 (3), con los `●` contados.
  Si un log sale con SIGKILL («failed to run»), cuenta 0 tests: repítelo.
- **Tipos y lint**, al final, con logs:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_mobile-reminder-swipe-actions.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_mobile-reminder-swipe-actions.log 2>&1 && test ! -s ../progress/lint_mobile-reminder-swipe-actions.log && echo LINT_OK`.
  `expo lint` puede salir 0 tras un SIGKILL: vale el log vacío. Borra esos logs y los de jest
  antes de terminar; no se commitean.
- **Sondas.** S1 a S9 con el protocolo de tasks.md: una a la vez, se corre la orden de su
  tabla, se anota la orden y el rojo, se revierte con `git checkout HEAD -- <fichero>` y se
  comprueba `git diff --quiet -- <fichero>`. Ninguna se commitea.
- **Suite de guardas:** `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__`,
  en verde antes del commit 14.
- **Árbol limpio, acotado:** al terminar,
  `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-reminder-swipe-actions.md`: salida del primer comando y las anclas de
T0 (2); cada commit con su hash y, en los rojos, la causa del rojo; los «nace verde»; las
sondas S1 a S9; cada `it` que la Regla de cierre enmendó; cifras de jest (T0, commit 10 y
final), tsc y lint; las skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-reminder-swipe-actions.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
