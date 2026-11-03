Worktree: /home/claude/sites/Pet-Tracker-wt-231

# Handoff #231 mobile-welcome-secondary-pressed

Implementador: Codex CLI.

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-231 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/231-mobile-welcome-secondary-pressed`.
Commits de arriba abajo: el de este handoff (`docs(progress): #231 codex handoff`), la firma
`71a0e0f9` (H0) y `def9dce1` (la spec).

## Base

- Feature: mobile-welcome-secondary-pressed (#231). Integra en `dev`, no en `main`.
- H0 (base del diff final): `71a0e0f9`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene `.env`
  y `mobile-pet-tracker/node_modules`.

## Spec

- Aprobada con firma delegada (`71a0e0f9`) para R1 a R6. **R7 NO está firmada** (G4 es del humano):
  no la implementes, ni su test, ni la sección de `docs/ui-guidelines.md`. Déjala `pendiente` en
  `traceability.md` ("pendiente (espera gate G4)") y dilo en el reporte.
- Lee enteros `specs/mobile-welcome-secondary-pressed/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`. Las decisiones D1–D4 están cerradas. Si encuentras una contradicción, PARA y
  anótala; no adaptes la spec.
- Criterios de aceptación: R1 a R6. Las casillas G2 y G4 son del humano y no las tocas.

## Orden y commits

Test primero (C4 de CHECKPOINTS.md), mensajes en inglés con `(R<n>)`:

1. `test(mobile): #231 welcome secondary variant, dark border and amended pins (R1, R3, R4, R6)`:
   rojo. Los `it` nuevos de R1, R3 (A y B), R4, R6 y las filas/aserciones enmendadas de R6 (los
   tres pins con `NEW_CLASSES` y `'outline'`) contra el tag viejo.
2. `test(mobile): #231 heroui outline highlight contract (R2)`: nace verde; su mutación plantada
   demuestra que puede fallar (anota orden y salida).
3. `feat(mobile): #231 welcome secondary uses outline and a dark border (R1, R3)`: verde.
   Cambia solo el tag de `welcome-have-account` en `src/screens/welcome/index.tsx`.
4. `docs(spec): #231 traceability`: `traceability.md` con hashes (R7 queda pendiente). No rebasees
   después.

Antes de cada rojo, comprueba que los `it` fallan **por la aserción**, no por un import roto ni
«Cannot find module». Si otro `it` nace verde, anota «nace verde: <motivo>»; si no sabes por qué,
PARA.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/screens/welcome/index.tsx` (solo el commit 3);
- `mobile-pet-tracker/src/screens/welcome/index.test.tsx`;
- `mobile-pet-tracker/src/__tests__/chunky-cta-canvas-fidelity.test.ts`;
- `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`;
- `mobile-pet-tracker/src/theme/__tests__/global-css.test.ts`;
- `specs/mobile-welcome-secondary-pressed/traceability.md`;
- `progress/impl_mobile-welcome-secondary-pressed.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `docs/`, `global.css`,
`chunky-lip.ts`, `package.json`, `bun.lock`, `init.sh`, `feature_list.json`, `STATUS.md`,
`progress/current.md`, `progress/history.md`, `progress/handoff_*.md` ni otros `specs/`. Durante
las mutaciones puedes tocar `screens/home/index.tsx`, `global.css` y la copia de
`node_modules/.../button.tsx` que pide la spec, y los reviertes (`git checkout HEAD -- <ruta>` y
`cp` de la copia de seguridad); ninguna se commitea.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga con los nombres del catálogo de Codex `building-native-ui`.
  Lista en el reporte cuáles cargaste.
- **Literales a mano.** `NEW_CLASSES` y las cadenas de los tests se escriben a mano, nunca
  importadas de producción. El token de R4 sale del código de producción, no se escribe `'muted'`
  en el test.
- **No cambies el mock de `heroui-native`** del test de Bienvenida.
- **Esperas.** `docs/conventions.md` §Esperas: espera siempre al nodo que aserta el test, nunca a
  un contador de mock.
- **RNTL 14.** `await` en `render`, `renderRouter`, `fireEvent` y `act`.
- **Mocks.** Nada de `jest.mock(…, { virtual: true })`.
- **`#231` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de `design-drift`);
  en producción no cites `#231`.
- **Producción.** Sin `StyleSheet.create`, sin hex, sin clases `[...]`, sin copy ni dependencias.
- **T0.** Antes de editar, mide las cuentas de «Evidencia» (`grep -cF`) y corre en verde la suite de
  Bienvenida y los dos guards; guarda las salidas en el reporte. Si el log dice «failed to run»,
  repite (no cuenta como 0 tests).
- **Jest.** Desde `mobile-pet-tracker/` con rutas por prefijo sin paréntesis
  (`bunx jest src/screens/welcome src/__tests__ src/theme`). Timeout bajo carga: repite sola.
  Flakes conocidos (#200 R10, #168 R2, #152 R8): repite y anota.
- **Tipos y lint**, al final, con logs:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_231.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_231.log 2>&1 && test ! -s ../progress/lint_231.log && echo LINT_OK`.
  Borra esos logs antes de terminar.
- **Suite completa móvil** (R6): `bunx jest --ci > ../progress/jest_231_final.log 2>&1`; anota
  cifras y borra el log.
- **Diff acotado:** desde la raíz, `git diff --name-only 71a0e0f9..HEAD` solo lista ficheros de la
  lista cerrada (más el reporte si lo commiteas; no lo hagas).
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-welcome-secondary-pressed.md`: salida del primer comando y de T0; cada commit
con su hash y, en los rojos, la causa del rojo; los «nace verde»; las mutaciones de R1 a R4 y R6 con
orden y salida; cifras de jest, tsc y lint; skills cargadas; R7 pendiente; cualquier PARA.

Última acción: crear `progress/impl_mobile-welcome-secondary-pressed.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
