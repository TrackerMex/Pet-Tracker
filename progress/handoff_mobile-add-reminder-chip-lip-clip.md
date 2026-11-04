Worktree: /home/claude/sites/Pet-Tracker-wt-232

# Handoff #232 mobile-add-reminder-chip-lip-clip

Implementador: Codex CLI.

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-232 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/232-mobile-add-reminder-chip-lip-clip`.
Commits de arriba abajo: el de este handoff (`docs(progress): #232 codex handoff`), la firma
`7bd8ba6c` (H0) y `d033ab94` (la spec).

## Base

- Feature: mobile-add-reminder-chip-lip-clip (#232). Integra en `dev`, no en `main`.
- H0 (base del diff final): `7bd8ba6c`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene `.env`
  y `mobile-pet-tracker/node_modules`.

## Spec

- Aprobada con firma delegada (`7bd8ba6c`) para R1 a R4, con la enmienda de #213 R5. La casilla
  G2 (smoke) es del humano y no la tocas.
- Lee enteros `specs/mobile-add-reminder-chip-lip-clip/requirements.md`, `design.md`, `tasks.md`
  y `traceability.md`. Las decisiones D1–D5 están cerradas. Si encuentras una contradicción, PARA
  y anótala; no adaptes la spec.
- Criterios de aceptación: R1 a R4.
- Cambio de producción mínimo: dos constantes de módulo (`CHIP_ROW_CONTENT`, `CHIP_ROW_STYLE`) en
  `src/screens/add-reminder/index.tsx`, usadas en las dos filas `type-chips-row` y
  `advance-chips-row`. Nada de copy, clases ni dependencias.

## Orden y commits

Test primero (C4 de CHECKPOINTS.md), mensajes en inglés con `(R<n>)`:

1. `test(mobile): #232 reserve chip lip room in type and advance rows (R1)`: rojo. El
   `describe('#232 R1: las filas de chips reservan el labio')` con el `it.each` de R1, **más** en
   este mismo commit la enmienda del `it` `#213 R5: Tipo y Aviso son filas horizontales sin salto
   de línea` (título con ` (enmendado por #232 R1)` y `paddingBottom: 3` en el `toEqual`) y el
   `it('#232 R4: la fila de Repetición no cambia')` (nace verde; anótalo). Los `it` de R1 y el
   `#213 R5` enmendado fallan por la aserción (`paddingBottom` ausente).
2. `feat(mobile): #232 pad chip rows so the selected lip is not clipped (R1)`: verde.
   `CHIP_ROW_CONTENT` y `contentContainerStyle={CHIP_ROW_CONTENT}` en las dos filas.
3. `test(mobile): #232 chip rows must not shift the form (R2)`: rojo, el `it.each` de R2.
4. `feat(mobile): #232 offset chip row padding with a negative margin (R2)`: verde.
   `CHIP_ROW_STYLE` y `style={CHIP_ROW_STYLE}` en las dos filas.
5. `docs(spec): #232 traceability`: `traceability.md` con hashes. No rebasees después.

Antes de cada rojo, comprueba que los `it` fallan **por la aserción**, no por un import roto ni
«Cannot find module». Si otro `it` nace verde, anota «nace verde: <motivo>»; si no sabes por qué,
PARA.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/screens/add-reminder/index.tsx` (solo los commits 2 y 4);
- `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx`;
- `specs/mobile-add-reminder-chip-lip-clip/traceability.md`;
- `progress/impl_mobile-add-reminder-chip-lip-clip.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `docs/`, `src/theme/`,
`src/i18n/`, `src/__tests__/`, `package.json`, `bun.lock`, `init.sh`, `feature_list.json`,
`STATUS.md`, `progress/current.md`, `progress/history.md`, `progress/handoff_*.md` ni otros
`specs/`. Durante las mutaciones plantadas puedes tocar `src/theme/chunky-lip.ts` (R1 d) y los dos
ficheros de la lista; los reviertes con `git checkout HEAD -- <ruta>` (cada ruta explícita) y
compruebas `git diff --cached --quiet`; ninguna mutación se commitea.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga con los nombres del catálogo de Codex `building-native-ui`.
  Lista en el reporte cuáles cargaste.
- **Literales a mano.** El `3` y el `{ gap: 8, paddingRight: 20, paddingBottom: 3 }` de los tests
  se escriben a mano, nunca importados de producción. El `3` del labio se lee del texto de
  `src/theme/chunky-lip.ts` con la regex de R1 (con `expect(match).not.toBeNull()` antes).
- **No cambies ningún doble de módulo** del test de add-reminder (el `jest.mock` de
  `../../theme/chunky-lip` ya devuelve `offsetY: 3`).
- **Esperas.** `docs/conventions.md` §Esperas: espera siempre al nodo que aserta el test
  (`await renderAddReminder(); await screen.findByTestId('title-input');`), nunca a un contador de
  mock.
- **RNTL 14.** `await` en `render`, `fireEvent` y `act`.
- **`#232` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de `design-drift`);
  en producción no cites `#232`.
- **Producción.** Sin `StyleSheet.create` (ni en el test), sin hex, sin clases `[...]`, sin
  `Platform.OS`, sin copy ni dependencias.
- **T0.** Antes de editar, mide las cuentas «Hoy» de la tabla de Evidencia (`grep -cF`) y corre en
  verde `cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder src/__tests__ > /tmp/t0-232.log 2>&1; echo "exit=$?"`;
  guarda las salidas en el reporte. Si el log dice «failed to run», repite (no cuenta como 0
  tests).
- **Jest.** Desde `mobile-pet-tracker/` con rutas por prefijo sin paréntesis. Timeout bajo carga:
  repite sola. Flakes conocidos (#200 R10, #168 R2, #152 R8): repite y anota.
- **Mutaciones plantadas** de R1 (a)-(d), R2 (a)-(d), R3 y R4 (a)-(b) según `requirements.md`:
  anota para cada una orden y salida (qué `it` quedó rojo) y que quedó revertida.
- **Tipos y lint**, al final, con logs:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_232.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_232.log 2>&1 && test ! -s ../progress/lint_232.log && echo LINT_OK`.
  Borra esos logs antes de terminar.
- **Anclas finales** (columna «Tras #232» de la Evidencia) con `grep -cF`, y
  `grep -cF "(enmendado por #232 R1)" src/screens/add-reminder/index.test.tsx` debe dar `1`.
- **Diff acotado:** desde la raíz, `git diff --name-only 7bd8ba6c..HEAD` solo lista ficheros de la
  lista cerrada (más el reporte si lo commiteas; no lo hagas).
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-add-reminder-chip-lip-clip.md`: salida del primer comando y de T0; cada
commit con su hash y, en los rojos, la causa del rojo; los «nace verde»; las mutaciones con orden
y salida; anclas; cifras de jest, tsc y lint; skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-add-reminder-chip-lip-clip.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
