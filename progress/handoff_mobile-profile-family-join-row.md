Worktree: /home/claude/sites/Pet-Tracker-wt-229

# Handoff #229 mobile-profile-family-join-row

Implementador: Codex CLI.

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-229 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/229-mobile-profile-family-join-row`.
Commits de arriba abajo: el de este handoff (`docs(progress): #229 codex handoff`), la firma
`910983c5` (H0) y `efe0e035` (la spec).

## Base

- Feature: mobile-profile-family-join-row (#229). Integra en `dev`, no en `main`.
- H0 (base del diff final de producción): `910983c5`.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene `.env`
  y `mobile-pet-tracker/node_modules`.

## Spec

- Aprobada con firma delegada (`910983c5`) para R1 a R6, con la enmienda de #214 R4 y R6
  (casilla propia, firmada en la spec). La casilla G2 (smoke) es del humano y no la tocas.
- Lee enteros `specs/mobile-profile-family-join-row/requirements.md`, `design.md`, `tasks.md`
  y `traceability.md`. Las decisiones D1 a D7 están cerradas. Si encuentras una contradicción,
  PARA y anótala; no adaptes la spec.
- Criterios de aceptación: R1 a R6.
- Cambio de producción mínimo en `src/screens/profile/index.tsx`: prefijo `flex-1 ` en la clase
  del `Pressable` de `ProfileWideTile`, y `{joinPetLink}` pasa a ser el segundo hijo de
  `profile-links-row-2` (se borra la fila `profile-links-row-3`). Diff esperado `1<TAB>3`.
  Nada de copy, clases nuevas ni dependencias.

## Orden y commits

Test primero (C4 de CHECKPOINTS.md), exactamente los cuatro de `tasks.md` «Orden de commits»,
mensajes en inglés con `(R<n>)`, y después un quinto de trazabilidad:

1. `test(mobile): #229 pin flex-1 on wide tiles, no-pet row and equal-height recipe (R1, R3, R4, R5)`:
   rojo (R1 2 `it`, R4 1, R5 1 y los dos `it` enmendados solo en la clase). R3 (2 `it`) nace
   verde; anótalo.
2. `feat(mobile): #229 give wide profile tiles flex-1 so they share the row (R1, R4)`: verde.
3. `test(mobile): #229 pair Familia and Unirme con código in one row (R2)`: rojo (R2 y los tres
   `it` enmendados estructuralmente).
4. `feat(mobile): #229 move join-pet-link into the family row and drop row 3 (R2)`: verde.
5. `docs(spec): #229 traceability`: `traceability.md` con hashes. No rebasees después.

Antes de cada rojo, comprueba que los `it` fallan **por la aserción**, no por un import roto ni
«Cannot find module». Si otro `it` nace verde, anota «nace verde: <motivo>»; si no sabes por qué,
PARA.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/screens/profile/index.tsx` (solo los commits 2 y 4);
- `mobile-pet-tracker/src/screens/profile/index.test.tsx`;
- `specs/mobile-profile-family-join-row/traceability.md`;
- `progress/impl_mobile-profile-family-join-row.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `docs/`, `src/theme/`,
`src/i18n/`, `src/__tests__/`, `package.json`, `bun.lock`, `init.sh`, `feature_list.json`,
`STATUS.md`, `progress/current.md`, `progress/history.md`, `progress/handoff_*.md`,
`specs/mobile-pet-members/` ni otros `specs/`. Las mutaciones tocan solo `src/screens/profile/index.tsx`
y se revierten con `git checkout HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx`
(comprueba `git diff --cached --quiet`); ninguna se commitea.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga con los nombres del catálogo de Codex `building-native-ui`.
  Lista en el reporte cuáles cargaste.
- **Esperas.** `docs/conventions.md` §Esperas: espera siempre al nodo positivo que aserta el
  test (`await renderProfile();`, `await screen.findByTestId('profile-links-row-1')`), nunca a
  un contador de mock.
- **Literales a mano.** Los `testID`, clases y textos de los tests se escriben a mano, nunca
  `CATEGORY_SLOTS` ni valores importados de producción. Los `queryBy…` de ausencia llevan
  `{ includeHiddenElements: true }`. Entre nodos se comparan `testID`, no `toBe(nodo)`.
- **No cambies imports, `jest.mock` ni helpers** de `index.test.tsx`. Solo los `describe` nuevos
  al final (tras `#235 R3`) y las enmiendas de los tres `it` de R6 (sufijo
  `(enmendado por #229 R…)`, raíz del título intacta).
- **RNTL 14.** `await` en `render`, `fireEvent` y `act`.
- **`#229` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de `design-drift`);
  en producción no cites `#229`. Sin `StyleSheet` en el test.
- **Producción.** Sin `StyleSheet.create`, hex, clases `[...]`, copy ni dependencias.
- **T0.** Antes de editar, mide las anclas «Hoy» de la tabla de Evidencia con `grep -cF --` y
  corre en verde `cd /home/claude/sites/Pet-Tracker-wt-229/mobile-pet-tracker && bunx jest src/screens/profile src/__tests__ > /tmp/t0-229.log 2>&1; echo "exit=$?"`.
  Si el log dice «failed to run», repite (no cuenta como 0 tests).
- **Jest.** Rutas por prefijo sin paréntesis. Timeout bajo carga: repite sola. Flakes conocidos
  (#200 R9/R10, #168 R2, #152 R8): repite y anota.
- **Mutaciones plantadas** de R1 (a)-(d), R2 (a)-(d), R3 (a)-(d), R4 (a)-(c), R5 (a)-(f) y R6 (a)-(b)
  según `requirements.md`: para cada una, orden, qué `it` quedó rojo y que quedó revertida.
- **Tipos y lint**, al final, con logs:
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_229.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_229.log 2>&1 && test ! -s ../progress/lint_229.log && echo LINT_OK`.
  Borra esos logs antes de terminar.
- **Anclas finales** (columna «Tras #229» de la Evidencia) con `grep -cF --`;
  `grep -cF "(enmendado por #229 R" src/screens/profile/index.test.tsx` imprime `3`.
- **Diff acotado, medido desde el commit de este handoff** (H0 es anterior y el propio handoff
  aparecería en el diff):
  `B=$(git log -1 --format=%h -- progress/handoff_mobile-profile-family-join-row.md) && git diff --name-only $B..HEAD`
  solo lista la lista cerrada (más el reporte si lo commiteas; no lo hagas), y
  `git diff --numstat $B..HEAD -- mobile-pet-tracker/src/screens/profile/index.tsx` imprime `1<TAB>3<TAB>…`.
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-profile-family-join-row.md`: salida del primer comando y de T0; cada
commit con su hash y, en los rojos, la causa del rojo; los «nace verde»; las mutaciones con orden
y salida; anclas; cifras de jest, tsc y lint; skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-profile-family-join-row.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
