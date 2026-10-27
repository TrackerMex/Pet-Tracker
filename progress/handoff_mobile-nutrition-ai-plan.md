# Handoff #215 mobile-nutrition-ai-plan

Implementer: subagente `implementer` (fallback de CLAUDE.md §Excepciones: a la cuota
semanal de Codex le queda el 3 %, se renueva el 2 de noviembre a las 14:37). Declarado en
`progress/current.md`.

Worktree: /home/claude/sites/Pet-Tracker-wt-215
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y
Postgres con otros worktrees).

Primer comando, antes de nada:
`cd /home/claude/sites/Pet-Tracker-wt-215 && pwd && git branch --show-current && git log --oneline -2`.
Confirma en el reporte la ruta y la branch `feature/215-mobile-nutrition-ai-plan`. Los dos
commits deben ser, de arriba abajo, el de este handoff
(`docs(progress): #215 implementer handoff`) y `c3da2b3f` (H0).

## Base

- Feature: mobile-nutrition-ai-plan (#215). Integra en `dev`, no en `main`.
- H0 (base de la implementación y del diff final): `c3da2b3f`, la fe de erratas E2. Su
  base de código es `20fc6616`, el merge de `origin/dev` con #223 (PR #279) y #224 (PR #280).
  De H0 a `20fc6616` solo cambian `specs/`.
- §Re-verificar al mergear #224 de requirements.md ya la corrió el leader sobre `20fc6616`:
  las 8 órdenes dan la salida esperada, y E2 recoge las dos bases que movió #223. Repítela
  igual como primer paso (tasks.md lo pide); si algo no cuadra, PARA.
- NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install`. El worktree ya tiene
  `.env` y `mobile-pet-tracker/node_modules`.

## Spec

- Aprobada con firma delegada (`7b601547`), más las erratas E1 (`b18d7ec2`) y E2
  (`c3da2b3f`).
- Lee enteros `specs/mobile-nutrition-ai-plan/requirements.md`, `design.md`, `tasks.md` y
  `traceability.md`.
- Las «Decisiones del firmante» D1–D7 de requirements.md están cerradas: no hay nada que
  preguntar. Si encuentras una contradicción, PARA y anótala en el reporte. No adaptes la
  spec por tu cuenta.
- Criterios de aceptación: R1 a R22. La casilla de smoke G4 es del humano y no la tocas.

## Orden y commits

El orden y los grupos los manda tasks.md:

1. R1.
2. R2.
3. R3.
4. R4–R16, con un commit rojo y uno verde.
5. R17.
6. R18.
7. R19 y R20, juntos: R20 no tiene mutación.
8. R21.
9. R22.
10. `traceability.md` y el reporte.

Commits test-primero, con historial rojo y después verde (C4 de CHECKPOINTS.md). En #19
Codex metió todo en un commit, y eso no vale:

- `test(mobile): #215 R<n> rojo` lleva solo tests;
- `feat(mobile): #215 R<n> <qué>` lleva solo producción;
- `refactor(mobile): #215 R<n> <qué>` solo si hace falta;
- último: `docs(mobile): #215 traceability and implementation report`.

Antes de cada commit rojo, comprueba que los `it` nuevos fallan **por la aserción**, no por
un import roto ni por una excepción de producción. Un «Unable to find» de RNTL vale como
rojo. Para R1 y R2 se acepta `… is not a function`. Si un `it` nace verde, anota en el
reporte «nace verde: <motivo>». Si no sabes por qué nace verde, PARA.

R19 y R21 tienen mutación obligatoria (requirements.md). Plántala, mírala en rojo,
reviértela y no la commitees. Anota en el reporte la orden y la salida.

## Archivos

Lista cerrada: design.md §Archivos afectados, más `../specs/mobile-nutrition-ai-plan/traceability.md`
en el commit final y `../progress/impl_mobile-nutrition-ai-plan.md` (tu reporte). Si
necesitas otro fichero, PARA.

No tocar:

- `backend-pet-tracker/`;
- `package.json` y `bun.lock`;
- `src/screens/food/parse-ai-explanation.ts` y `src/screens/food/ai-explanation.tsx` (#224 es
  su dueño; R22);
- `src/components/`, `src/theme/`, `src/hooks/`;
- `init.sh`, `feature_list.json`, `STATUS.md`, `progress/current.md`, `progress/handoff_*.md`;
- `specs/` salvo `traceability.md`, y `docs/`.

## Reglas críticas

- **Carta y skills.** `docs/architecture.md`, `docs/conventions.md` y `docs/ui-guidelines.md`
  mandan sobre cualquier skill. Carga `expo:expo-overview` y, según toque:
  - `expo:expo-router` (ruta delgada, `router.push({ pathname, params })`);
  - `expo:expo-native-ui` (pantalla);
  - `expo:expo-data-fetching` (`useQuery`, `invalidateQueries`);
  - `expo:expo-tailwind-setup` (uniwind).

  En el reporte, lista las que cargaste.
- **Literales a mano.** Los valores de la spec son literales del test escritos a mano, nunca
  importados de producción: el candado sería tautológico. Incluye textos, testIDs, clases,
  gramos y cifras de inventario.
- **Copy.** Todo el copy sale de `src/i18n/catalog.ts` con los literales de R19: 16 claves
  `nutritionPlan.*`, en su orden y detrás de `'mealSchedule.noMealPlanYet'`. Cada uso va como
  `t('clave'` literal; nunca `t(variable)`.
- **Regla mecánica de R20**, para cada `it` viejo que enmiendes:
  - la cifra nueva se escribe como base + delta;
  - `// #215 R<n>` va DELANTE de los comentarios que ya tiene la línea;
  - el sufijo ` (enmendado por #215 R<n>)` va una sola vez, al final del nombre del `it`.

  Las líneas de #215 van **siempre las últimas** de cada suma (E2).
- **Inventarios.** Las guardas de `src/__tests__/` se ponen rojas desde el primer `feat` que
  crea la pantalla (R4–R16), y siguen rojas hasta el commit de R20. Esos rojos son los
  esperados: no adelantes enmiendas.
- **Esperas.** `docs/conventions.md` §Esperas: espera siempre al nodo que aserta el test,
  nunca a un contador de mock.
- **RNTL 14.** `await` en `render`, `renderRouter`, `fireEvent` y `act`; sin `await`, un `it`
  contamina al siguiente. Los nodos decorativos piden `{ includeHiddenElements: true }`.
- **Mocks.** Nada de `jest.mock(…, { virtual: true })`. El doble de Reanimated, si hace
  falta, lleva `__esModule: true`.
- **Prohibido en producción:**
  - `StyleSheet.create` y hex fuera de `src/theme/`;
  - clases `[...]` y `text-accent` desnudo;
  - `Date.now()` o `new Date()` sin argumento en render;
  - emoji y dependencias nuevas;
  - comentarios que citen `#215`. En los tests, solo `#215 R<n>`, nunca `#215` desnudo.
- **Botón violeta.** Receta tonal de R21: `Button variant="tertiary"`, `CATEGORY_SLOTS.violet`
  y `chunkyLip.violet`. Nunca relleno sólido con texto blanco: no pasa AA en oscuro.
- **Jest:**
  - corre desde `mobile-pet-tracker/` con `bunx jest <ruta>`;
  - las rutas son regex: escapa los paréntesis;
  - si una suite da timeout bajo carga, repítela sola antes de concluir.

  Para el chequeo final, corre la suite móvil completa
  (`bunx jest --ci > ../progress/jest_215_final.log 2>&1`), guarda el log y anota las
  cifras. Un rojo conocido de flake (#200 R10 food-links, #168 R2, #152 R8) se repite solo
  y se anota.
- **Lint y tipos**, al final, con logs:
  `bunx tsc --noEmit > ../progress/tsc_215.log 2>&1; echo $?` y
  `bunx expo lint --no-cache > ../progress/lint_215.log 2>&1; echo $?`. `expo lint` puede salir 0
  tras un SIGKILL: comprueba que el log no diga «Killed».
- **Árbol limpio, acotado:**
  `cd /home/claude/sites/Pet-Tracker-wt-215/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`.

## Reporte

`progress/impl_mobile-nutrition-ai-plan.md`:

- la salida del primer comando y de §Re-verificar;
- cada R con su commit rojo, su commit verde y la causa del rojo;
- las mutaciones con su orden y su salida;
- los «nace verde»;
- las cifras de jest, tsc y lint;
- las skills cargadas;
- cualquier PARA.

Al terminar, devuelve solo la ruta del reporte.
