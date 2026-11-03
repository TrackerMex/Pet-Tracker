Worktree: /home/claude/sites/Pet-Tracker-wt-233

# Handoff #233 mobile-food-links-without-profile

Implementador: Codex CLI.

NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-233 && pwd && git branch --show-current && git log --oneline -4`.
Confirma en el reporte la ruta y la branch `feature/233-mobile-food-links-without-profile`.
Commits de arriba abajo: el de este handoff (`docs(progress): #233 codex handoff`), la firma
`5311e66c` (H0) y `57d15b6c` (la spec).

## Base

- Feature: mobile-food-links-without-profile (#233). Integra en `dev`, no en `main`.
- H0 (base del diff final): `5311e66c`. La branch ya contiene `origin/dev` (426ffd32).
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install` (esto sustituye al «Paso 0 —
  base» de `tasks.md`: el leader ya mergeó `dev` y el worktree ya tiene `.env` y
  `mobile-pet-tracker/node_modules`). Del Paso 0 haz solo el re-medido de las anclas de partida.
  Los candados de diff de R6/R7 que usan `git merge-base HEAD origin/dev` los mides con el
  `origin/dev` local tal cual está, sin `fetch`.

## Spec

- Aprobada con firma delegada (`5311e66c`) para R1 a R7. Las casillas «Enmienda #233» (en
  `specs/mobile-canvas-nutrition/requirements.md`), G4 opcional y el smoke son del humano: no las
  tocas ni editas `specs/mobile-canvas-nutrition/` ni `docs/`.
- Lee enteros `specs/mobile-food-links-without-profile/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`. D1 está cerrada. Si encuentras una contradicción, PARA y anótala; no adaptes
  la spec.
- Criterios de aceptación: R1 a R7.

## Orden y commits

Test primero (C4 de CHECKPOINTS.md), mensajes en inglés con `(R<n>)`, exactamente los seis de
`tasks.md` «Orden de commits»:

1. `test(mobile): #233 nutrition links hidden without profile (R1)`: rojo, 4 filas.
2. `test(mobile): #233 nutrition links hidden while the profile is unconfirmed (R2)`: rojo (el
   `it` enmendado y el Test B).
3. `test(mobile): #233 nutrition links hidden on plan or profile errors (R3)`: rojo, 3 filas.
4. `test(mobile): #233 nutrition links stay with a profile (R4, R5)`: nace verde; anótalo.
5. `feat(mobile): #233 nutrition links only with a confirmed profile (R1, R2, R3)`: verde, las dos
   líneas añadidas y una quitada en `src/screens/food/index.tsx`.
6. `docs(spec): #233 traceability`: `traceability.md` con hashes. No rebasees después.

Antes de cada rojo, comprueba que los `it` fallan **por la aserción**, no por un import roto ni
«Cannot find module». Si otro `it` nace verde, anota «nace verde: <motivo>»; si no sabes por qué,
PARA.

## Archivos

Lista cerrada:

- `mobile-pet-tracker/src/screens/food/index.tsx` (solo el commit 5);
- `mobile-pet-tracker/src/screens/food/index.test.tsx`;
- `specs/mobile-food-links-without-profile/traceability.md`;
- `progress/impl_mobile-food-links-without-profile.md`, tu reporte.

Si necesitas otro fichero, PARA. No tocar `backend-pet-tracker/`, `docs/`, `ai-explanation.tsx`,
`src/i18n/`, `src/__tests__/`, `package.json`, `bun.lock`, `init.sh`, `feature_list.json`,
`STATUS.md`, `progress/current.md`, `progress/history.md`, `progress/handoff_*.md` ni otros
`specs/`. Las mutaciones M1–M9 tocan solo `src/screens/food/index.tsx` y se revierten con
`git checkout HEAD -- mobile-pet-tracker/src/screens/food/index.tsx` (comprueba
`git diff --cached --quiet`); ninguna se commitea.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga con los nombres del catálogo de Codex `building-native-ui`.
  Lista en el reporte cuáles cargaste.
- **Esperas.** `docs/conventions.md` §Esperas: espera siempre al nodo positivo que aserta el
  test, nunca a un contador de mock. **Única excepción** de la feature: el
  `waitFor(() => expect(mockGetNutritionProfile).toHaveBeenCalledTimes(1))` del Test B de R2, con
  su comentario de una línea (sin `#233` suelto).
- **Literales a mano.** Los `testID`, textos y números de los tests se escriben a mano. Los
  `queryBy…` de ausencia llevan `{ includeHiddenElements: true }`.
- **No cambies imports, `jest.mock` ni helpers** de `index.test.tsx`. Solo el `describe` nuevo
  entre el de `#200 R10` y el de `#222 R7`, y la enmienda de R2 (única línea ajena editada).
- **RNTL 14.** `await` en `render`, `fireEvent` y `act`.
- **`#233` en código y tests.** Siempre seguido de ` R<n>` (regla `HEX_LITERAL` de `design-drift`);
  en producción no cites `#233`.
- **Producción.** Sin `StyleSheet.create`, hex, clases `[...]`, copy ni dependencias.
- **T0.** Antes de editar, mide las anclas «de partida» de `tasks.md` Paso 0 con `grep -cF` y corre
  en verde `cd /home/claude/sites/Pet-Tracker-wt-233/mobile-pet-tracker && bunx jest --runTestsByPath src/screens/food/index.test.tsx > /tmp/t0-233.log 2>&1; echo "exit=$?"`.
  Si el log dice «failed to run», repite (no cuenta como 0 tests).
- **Jest.** Siempre `--runTestsByPath` para ficheros. Timeout bajo carga: repite sola. Flakes
  conocidos (#200 R9/R10, #168 R2, #152 R8): repite y anota.
- **Mutaciones M1–M9** de `design.md` tras el commit verde, una a una, con orden y salida en el
  reporte.
- **Tipos y lint**, al final, con logs: `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_233.log 2>&1; echo $?`
  (si el `router.d.ts` existe, PARA; nunca `rm -f`) y
  `bunx expo lint --no-cache > ../progress/lint_233.log 2>&1 && test ! -s ../progress/lint_233.log && echo LINT_OK`.
  Borra esos logs antes de terminar. Guardas: `bunx jest src/__tests__ src/app/__tests__ src/components/__tests__`.
- **Anclas finales** de R1–R7 con `grep -cF`; `numstat` de R6 `2<TAB>1` y de R7 `<N><TAB>2`.
- **Diff acotado:** mídelo desde el commit de este handoff, no desde H0 (H0 es anterior y el
  propio handoff aparecería en el diff): `B=$(git log -1 --format=%h -- progress/handoff_mobile-food-links-without-profile.md) && git diff --name-only $B..HEAD`
  solo lista la lista cerrada (más el reporte si lo commiteas; no lo hagas). Enmienda del leader:
  el candado anterior contra `5311e66c` era imposible por construcción.
- **Árbol limpio, acotado:** al terminar, `git status --short -- mobile-pet-tracker specs` vacío.
- **No abras ni edites la PR.** La abre el leader.
- Si el sandbox te deniega un comando, PARA y repórtalo.

## Reporte

`progress/impl_mobile-food-links-without-profile.md`: salida del primer comando y de T0; cada
commit con su hash y, en los rojos, la causa del rojo; los «nace verde»; M1–M9 con orden y salida;
anclas; cifras de jest, tsc y lint; skills cargadas; cualquier PARA.

Última acción: crear `progress/impl_mobile-food-links-without-profile.done` con una sola línea: la
ruta del reporte. Es el marcador que vigila el watcher; no lo commitees. Devuelve solo esa ruta.
