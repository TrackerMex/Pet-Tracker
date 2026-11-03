Worktree: /home/claude/sites/Pet-Tracker-wt-227

# Handoff #227 mobile-reminders-upcoming-past

Implementador: Codex CLI.

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-227 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/227-mobile-reminders-upcoming-past`. Los
commits de arriba abajo: el de este handoff (`docs(progress): #227 codex handoff`), el merge de
`origin/dev` `70987986` (H0), la firma `dc58b2de` y la spec `2c11e818`.

## Base

- Feature: mobile-reminders-upcoming-past (#227). Integra en `dev`, no en `main`.
- H0 (base del diff final): `70987986`, el merge de `origin/dev` sobre la firma.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene
  `.env` y `mobile-pet-tracker/node_modules`.
- T0 (1) de tasks.md ya lo hizo el leader: sáltalo. T0 (2) sí: mide las anclas de §Evidencia y
  de la «Tabla de enmiendas» con `grep -cF` y anota cada cifra. Si una no da la suya, PARA.

## Spec

- Aprobada con firma delegada (`dc58b2de`). Lee enteros
  `specs/mobile-reminders-upcoming-past/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- Sin decisiones abiertas: la sección «Decisiones» de requirements.md las cierra. Si encuentras
  una contradicción, PARA y anótala en el reporte; no adaptes la spec por tu cuenta.
- Criterios de aceptación: R1 a R13. La casilla G2 (smoke) es del humano y no la tocas.
- Los literales de copy (es y en) son los de R1. No inventes ninguno.

## Orden y commits

Test primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). Sigue el orden de
tasks.md, que no es el de los R-ids. Veinte commits; los mensajes que tasks.md da literales van
literales, y los de R2, R3, R8 (rojo) y R10 (rojo) son los de esta lista:

1. `test(mobile): icon doubles, relative default date and fixed clocks for reminders (T0)`:
   verde, solo tests.
2. `test(mobile): splitReminders splits by civil day and status (R2)`: rojo.
3. `feat(mobile): splitReminders splits by civil day and status (R2)`: verde.
4. `test(mobile): splitReminders orders upcoming ascending and past descending (R3)`: rojo.
5. `feat(mobile): splitReminders orders upcoming ascending and past descending (R3)`: verde.
6. `test(mobile): copy and canvas classes of reminders sections (R1, R11)`: rojo.
7. `test(mobile): upcoming heading and ascending list (R4)`: rojo.
8. `test(mobile): collapsed Past section with count and chevron (R5)`: rojo.
9. `test(mobile): Past header toggles and dims rows newest first (R6)`: rojo.
10. `test(mobile): opacity follows the section, the rest follows status (R7)`: rojo.
11. `test(mobile): row actions stay in their row in both sections (R12)`: rojo.
12. `feat(mobile): reminders split into Upcoming and collapsed Past (R4, R5, R6, R7, R12)`:
    verde.
13. `test(mobile): empty upcoming box above Past (R8)`: rojo.
14. `feat(mobile): empty upcoming box above Past (R8)`: verde.
15. `test(mobile): empty list keeps EmptyState without sections (R9)`: nace verde (D4), con la
    sonda de mutación de tasks.md R9 anotada en el reporte.
16. `test(mobile): past reminders rise with a 30 ms step (R10)`: rojo.
17. `feat(mobile): past reminders rise with a 30 ms step (R10)`: verde.
18. `test(mobile): amended locks name their amendment (R13)`: rojo.
19. `test(mobile): suffix amended locks with #227 R13 (R13)`: verde.
20. `docs(spec): #227 traceability` con `traceability.md` rellena (hashes de 1 a 19). No
    rebasees después.

Cada rojo lleva solo tests. Antes de cada rojo, comprueba que los `it` nuevos fallan **por la
aserción** (no por un import roto ni «Cannot find module»). R1 y R11 pasan a verde por tandas
(tabla de tasks.md §Notas): en los commits 12 y 14 siguen rojos los `it` de esa tabla que aún
no tocan, y ningún otro. Si otro `it` nace verde, anota «nace verde: <motivo>»; si no sabes por
qué, PARA. Los guards van en el commit que los provoca, nunca en uno posterior.

**Regla de cierre** (requirements.md §Tabla de enmiendas): un `it` ajeno que se pone rojo solo
por las causas (a) a (e) se enmienda en el commit del requisito que lo provoca y se suma a
`AMENDED` en R13. Cualquier otro rojo ajeno, PARA.

## Archivos

Lista cerrada, rutas desde `mobile-pet-tracker/src/` salvo las de `specs/` y `progress/`:

- `utils/reminder-dates.ts` y `utils/reminder-dates.test.ts`;
- `theme/motion.ts` y `theme/__tests__/motion.test.ts`;
- `i18n/catalog.ts`;
- `__tests__/ui-copy-table.ts`;
- `screens/reminders/index.tsx` y `screens/reminders/index.test.tsx`;
- `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts` (nuevo);
- los guards `providers/__tests__/language-provider.test.tsx`, `__tests__/ui-language.test.ts`,
  `__tests__/design-drift.test.ts`, `__tests__/consistency-classnames.test.ts` y
  `__tests__/alerts-canvas-fidelity.test.ts`, solo con los deltas de la Tabla de enmiendas y de
  la Regla de cierre;
- `specs/mobile-ui-language/design.md` (§2.40);
- `specs/mobile-reminders-upcoming-past/traceability.md`;
- `progress/impl_mobile-reminders-upcoming-past.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `package.json`, `bun.lock`,
`init.sh`, `feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/history.md`,
`docs/`, `progress/handoff_*.md`, `progress/smoke_mejoras-smoke.md`, `screens/home/format.ts`,
las tres specs enmendadas ni el resto de `specs/`.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga, con los nombres que tú tienes:
  - `building-native-ui` (plugin expo): `Pressable`, dianas, `accessibilityState`;
  - `appllama-app-design-skill` (`.agents/skills/`), que la carta exige al cambiar una pantalla;
  - `animate-expo` (`.agents/skills/`) para `RiseIn` y el escalonado. Tu plugin expo no tiene
    skill de animación; las decisiones de movimiento ya están en R10.

  No hay equivalente tuyo de `expo-design-system`: la regla de tokens (sin hex, sin clases
  `[...]`, solo clases y tokens existentes) está en la spec y en la carta. Lista en el reporte
  cuáles cargaste.
- **Literales a mano.** Los testIDs, textos y nombres de los tests son literales escritos a
  mano; nunca importados de producción (salvo `R8_REMINDERS`, que es la tabla de copy).
- **Esperas.** `docs/conventions.md` §Esperas sobre el árbol renderizado: espera siempre al nodo
  que aserta el test, nunca a un contador de mock.
- **RNTL 14.** `await` en `render`, `renderRouter`, `fireEvent` y `act`; sin `await`, un `it`
  contamina al siguiente.
- **Relojes.** Los `jest.useFakeTimers({ now: … })` y sus `afterEach` son los de tasks.md T0 y
  del `describe('#227: próximos y pasados', …)`, literales. No cambies la zona horaria.
- **Mocks.** Nada de `jest.mock(…, { virtual: true })`. Del doble de `reicon-react-native` solo
  añades las dos líneas de T0.
- **`#227` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de
  `design-drift`): un `#227` desnudo tumba la guarda. En producción solo el comentario de
  `theme/motion.ts` que da tasks.md R10.
- **Producción.** Sin `StyleSheet.create`, sin hex, sin clases `[...]`, sin copy fuera de R1,
  sin dependencias.
- **Jest.** Siempre desde `mobile-pet-tracker/` y con las rutas sin paréntesis de tasks.md (los
  paths con paréntesis rompen el regex; si los necesitas, `--runTestsByPath`). Si una suite da
  timeout bajo carga, repítela sola antes de concluir. Un rojo conocido de flake (Salud
  `#168 R2`, Inicio `#152 R8`, Nutrición `#200 R9`/`R10`) se repite una vez y se anota.
- **Línea base y final.** Los logs de T0 (3) y R13 (3), con los `●` contados. Si un log sale
  con SIGKILL («failed to run»), cuenta 0 tests: repítelo.
- **Tipos y lint**, al final, con logs:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_227.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_227.log 2>&1 && test ! -s ../progress/lint_227.log && echo LINT_OK`.
  `expo lint` puede salir 0 tras un SIGKILL: vale el log vacío. Borra esos logs y los de jest
  antes de terminar; no se commitean.
- **Sonda de R9.** Planta la mutación de tasks.md R9, corre el fichero de test, anota la orden y
  el rojo, revierte con `git checkout HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`
  y comprueba cero diferencias. No se commitea.
- **Suite de guardas:** `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__`,
  en verde antes del commit 20.
- **Árbol limpio, acotado:** al terminar,
  `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-reminders-upcoming-past.md`: salida del primer comando y las anclas de
T0 (2); cada commit con su hash y, en los rojos, la causa del rojo; los «nace verde»; la sonda
de R9; cada `it` que la Regla de cierre enmendó; cifras de jest (T0 y final), tsc y lint; las
skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-reminders-upcoming-past.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
