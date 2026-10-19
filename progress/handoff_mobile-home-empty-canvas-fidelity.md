Worktree: /home/claude/sites/Pet-Tracker-wt-176

# Handoff a Codex CLI — feature #176 mobile-home-empty-canvas-fidelity

Antes de tocar nada, confirma en el reporte `pwd` y `git branch --show-current`
(debe ser `feature/176-mobile-home-empty-canvas-fidelity`). Trabaja SOLO en ese
worktree: no uses `/home/claude/sites/Pet-Tracker` (otra sesión) ni `main`.

Feature: mobile-home-empty-canvas-fidelity (#176), branch `feature/176-mobile-home-empty-canvas-fidelity`
Spec aprobada: `specs/mobile-home-empty-canvas-fidelity/requirements.md` (status: approved,
firmada en el commit `docs(spec): #176 firma de aprobación vía Notion`). Enmienda #176 de
`docs/ui-guidelines.md` aprobada por el humano (casilla marcada): R6 y R7 están desbloqueadas.
Decisiones del humano por defecto, sin cambios: Q1 = variante `hero` solo en Inicio; Q4 = entrada en
cuatro bloques (R13), icono `Plus` de `reicon-react-native` y mascota `pingo-talk.webp`.
Lee también: `specs/mobile-home-empty-canvas-fidelity/design.md` (D1 a D9 y §Contraste con la copia
del artboard: geometría de las tres huellas en D3), `tasks.md` (candados enmendados, 3 pasos por
requisito, comando grep-clean de R11) y `traceability.md`. La copia legible del artboard está en
`specs/mobile-empty-states-pingo/design-src/inicio-vacio.dc.html`.

## Arranque

1. `H0=$(git rev-parse HEAD)` (es el commit de este handoff). Anótalo en el reporte.
2. Corre las anclas siguientes (desde la raíz de la worktree) y compáralas con su valor. Si una no da
   su valor, **PARA y avisa**.
   - `grep -c '^status: approved' specs/mobile-home-empty-canvas-fidelity/requirements.md` → `1`
   - `grep -cF -- '- [X] Enmienda #176 aprobada por humano' docs/ui-guidelines.md` → `1`
   - `grep -cF 'variant' mobile-pet-tracker/src/components/empty-state.tsx` → `0`
   - `grep -cF 'entering=' mobile-pet-tracker/src/components/empty-state.tsx` → `0`
   - `grep -cF 'MOTION_FLOAT' mobile-pet-tracker/src/components/empty-state.tsx` → `2`
   - `grep -cF 'flex-1 items-center justify-center p-6 bg-background' mobile-pet-tracker/src/screens/home/index.tsx` → `1`
   - `grep -cF 'export function PingoFloat' mobile-pet-tracker/src/components/pingo-float.tsx` → `1`
   - `grep -cF 'export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;' mobile-pet-tracker/src/theme/motion.ts` → `1`
   - `ls mobile-pet-tracker/src/theme/pingo-stage.ts mobile-pet-tracker/src/components/__tests__/empty-state-hero.test.tsx` → ambos «No such file»
3. Mide T0 (total de `it` de toda la suite móvil en H0), una sola vez y sin pipe:
   `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" && bun run test > <log> 2>&1; grep -E '^Tests:' <log>`
   con `<log>` en un fichero temporal fuera del árbol. El aviso final `A worker process has failed to
   exit gracefully` es preexistente: no se para por él.
4. Mide el `Tests:` de cada fichero que se toca (cada uno solo, `bunx jest <ruta>`) antes del primer commit.

## Alcance (lista cerrada)

Todo bajo `mobile-pet-tracker/` salvo donde se indica:

- Producción, exactamente estos 3 ficheros: `src/components/empty-state.tsx`, `src/screens/home/index.tsx`,
  `src/theme/pingo-stage.ts` (nuevo: `PINGO_STAGE_SHADOW_COLOR` y `PINGO_STAGE_PAW_OPACITY`).
- Tests nuevos: `src/components/__tests__/empty-state-hero.test.tsx`.
- Tests enmendados (solo lo que lista `tasks.md` §Tests enmendados, con el comentario
  `(enmendado por #176 R<n>)`): `src/components/__tests__/empty-state.test.tsx`,
  `src/screens/home/index.test.tsx`, `src/__tests__/profile-canvas-fidelity.test.ts`,
  `src/__tests__/alerts-canvas-fidelity.test.ts`. Si otro candado de inventario se pone rojo, lo
  registras en el reporte y lo enmiendas con el mismo criterio. **No relajes** los de
  `chunky-cta-canvas-fidelity.test.ts` ni `motion.test.ts`.
- Raíz del repo: `specs/mobile-home-empty-canvas-fidelity/traceability.md` y
  `progress/impl_mobile-home-empty-canvas-fidelity.md`.

Prohibido: dependencias nuevas (`react-native-svg` y `reicon-react-native` ya están), `package.json`,
`bun.lock`, `src/i18n` (ninguna clave `t('…')` nueva: el copy no cambia, R10), `src/theme/motion.ts`
(`motion.test.ts` lo candada: no se añade ningún export), `src/components/pingo-float.tsx`, el `Button`
de `empty-state.tsx` (R12), `docs/ui-guidelines.md` y `backend-pet-tracker/`.

## Cadena de commits (test primero, sin excepción)

Un par por requisito: commit de **test** (rojo) y después commit de **implementación** (verde). Un test
y su implementación NUNCA van en el mismo commit (en #19 se mezcló y se incumplió C4 de
`CHECKPOINTS.md`). Orden fijo, porque cada requisito apoya el siguiente:

1. R1 caracterización. Test: el `it` que renderiza sin `variant` y con `variant="default"` y comprueba
   que no existen `*-stage`, `*-action-wrap` ni `*-action-icon`. **Nace verde** (NV, declarado). Impl:
   prop `variant?: 'default' | 'hero'`, sin cambiar el render de `default`.
2. R4 pose de 190. 3. R5 escenario (crea `src/theme/pingo-stage.ts`). 4. R6 `PingoFloat`.
5. R8 título. 6. R9 cuerpo. 7. R12 envoltorio y icono. 8. R13 entrada. 9. R7 reduce motion.
10. R14 raíz y gap. 11. R2 Inicio usa `hero`. 12. R3 padding.
13. R10 (caracterización, **nace verde**, sin implementación) y R11 (sonda del grep-clean, sin commit de
    producción propio).
14. Commit final de arnés: `traceability.md` con los hashes reales y `progress/impl_…md`.

Reglas de la cadena:

- Los rojos aceptables son **fallos de aserción de los `it` nuevos o enmendados** (`Expected … Received …`,
  nodo `home-empty-*` ausente por `queryByTestId` → `null`). Un rojo de otra clase (`Unable to find`
  por un fallo de render, `Found multiple elements`, `Test suite failed to run`, un `it` no previsto,
  una excepción en el render) = **PARA y avisa**; no ajustes la aserción para esquivarlo. Registra el
  rojo de cada commit de test (el `Tests:` del fichero) en el reporte.
- Las enmiendas de candados de otras features van en el commit de **test** del requisito que las
  provoca, no en la implementación: lista de imports de `empty-state.test.tsx` (se amplía por pasos,
  una línea nueva por requisito que añade un import: `react-native-svg` y `../theme/pingo-stage` en R5,
  `./pingo-float` en R6, `reicon-react-native` y `../theme/chunky-lip` en R12, las constantes
  `MOTION_*` y `withDelay`/`withSpring` en R13; el orden relativo es el de la lista final de
  `tasks.md`), inventarios `text-26` y `tracking-title` en R8, `text-15` en R9, y la clase exacta de
  «#181 R3.2» en R3. Cada uno nace rojo y la implementación lo pone en verde.
- Los valores esperados de los tests van como **literales** copiados de la spec o de origin/main. No los
  importes de `src/theme/`: un candado que compara con el símbolo que usa el código es tautológico.
- Las tres huellas de R5 se dibujan con `react-native-svg` (`Svg`, `Circle`, `Ellipse`, `G`) según la
  geometría de design.md D3, no con el glifo `Paw`. Si el doble de `react-native-svg` de jest no
  propaga `testID` o `style` del `Svg`, regístralo y envuelve el `Svg` en un `View` con ese `testID`
  y esa opacidad (plan B de `tasks.md` R5).
- La variante `hero` debe apagar el bucle `MOTION_FLOAT_*` propio de `EmptyState` (si no, la pose
  subiría 4 + 10 px): el efecto de flotación de `default` se condiciona a `variant === 'default'` (R6).
- R13 no usa `entering=`/`exiting=` (candado de #155 R11, ancla `entering=` = 0 en `empty-state.tsx`):
  valores compartidos con `withDelay(índice × MOTION_STAGGER_MS, …)`.
- Prueba de la sonda de R11: planta `shadowColor: '#0D1117'` en el objeto `style` de
  `src/components/empty-state.tsx` y comprueba que el comando de `tasks.md` §R11 devuelve la línea
  plantada; revierte con `git checkout HEAD -- mobile-pet-tracker/src/components/empty-state.tsx` y
  comprueba `git diff --quiet -- mobile-pet-tracker/src/components/empty-state.tsx` y
  `git diff --cached --quiet -- mobile-pet-tracker/src/components/empty-state.tsx`. Después el comando
  debe dar salida vacía. Una sonda que no da rojo BLOQUEA: avisa.

## Reglas críticas

- Sigue `docs/architecture.md` y `docs/conventions.md`; en móvil, `docs/ui-guidelines.md`.
- **Skills (nombres del catálogo de Codex, no los nuestros)**: carga `building-native-ui` y
  `expo-tailwind-setup` (uniwind/Tailwind). No existe en el plugin de Codex ninguna skill de animación
  ni `expo-overview`: no busques sustitutas; las decisiones de movimiento (resorte frente a timing,
  duraciones, curvas, reduce motion) están escritas en la spec (R6, R7, R13). Del repo (`.agents/skills/`)
  carga además `animate-expo` y `appllama-app-design-skill` (la carta §Skills la hace obligatoria al
  cambiar una pantalla); esta última sin usar el MCP de Appllama: la fuente visual es el artboard del
  spec, no se investiga ni se rediseña. Di en el reporte cuáles cargaste.
- Cada comando de móvil empieza por `cd "$(git rev-parse --show-toplevel)/mobile-pet-tracker" &&` en la
  misma cadena. Un error de invocación (ENOENT del fichero que ibas a crear) no es un rojo: PARA y avisa.
  Móvil es `bun` (`bunx jest <ruta>`, `bun run typecheck`); nunca `npx` ni `npm i -g`. La worktree ya
  tiene `node_modules`; si faltara: `bun install --frozen-lockfile`.
- **Un fichero de jest a la vez**, `bunx jest <ruta>`; nunca dos jest a la vez. Si un `it` agota el
  tiempo con la máquina cargada, repite el fichero solo sin flags antes de juzgarlo.
- **Esperas** (`docs/conventions.md` §«Esperas sobre el árbol renderizado»): con fake timers,
  `await act(async () => { jest.advanceTimersByTime(ms); })` y se muestrea; no se espera a contadores de
  mock. `render`, `fireEvent` y `act` de RNTL 14 son asíncronos: siempre con `await`, o el `it` siguiente
  hereda un `setState` pendiente. Mockea `useReducedMotion` como en `pingo-float.test.tsx`, sin mockear
  `withRepeat`.
- **NO lances `./init.sh`** (lo corre el leader; comparte Postgres y LocalStack).
- Antes de cada commit de código: `test ! -e .expo/types/router.d.ts` (si existe, PARA; nunca `rm -f`,
  tu sandbox lo deniega) y `bun run typecheck` con salida 0, sin pipe. Lint:
  `bunx expo lint --no-cache > <log> 2>&1 && test ! -s <log>` con `<log>` fuera del árbol (el CLI traga
  un SIGKILL y sale 0; si el log contiene `Failed to run`, repite). No hay prettier en móvil.
- Un fichero nuevo se añade con `git add <ruta>` ANTES de correr las anclas (`git grep` no lo ve).
- Comentarios de código: solo `#176 R<n>` (`// #176 R5`); nunca `#176` a secas ni una nota copiada de la
  spec (el guard de hex de `design-drift` los lee como color y R11 lo prohíbe).
- Cadenas de comandos: escribe cada cabecera como comentario `# --`, nunca como línea ejecutable, y
  encadena el registro del rojo con el `git commit` por `&&`. Acota `git status`/`git diff` a las rutas
  esperadas (`git status --short` tras `git add` sale vacío y falla).
- Traceability: rellena las 14 filas de `traceability.md` con los hashes reales en UN commit final
  `docs(#176): trazabilidad y reporte de implementación (R1-R14)` junto con
  `progress/impl_mobile-home-empty-canvas-fidelity.md`. Verifica cada hash con `git cat-file -e`. No
  mezcles ficheros de arnés en los commits TDD. **No rebasar.**
- NO son tuyos: `progress/history.md`, `progress/current.md`, `STATUS.md`, el campo `status` de
  `feature_list.json` ni la casilla del smoke del humano.
- Si el sandbox te deniega un comando, PARA y repórtalo; no lo sustituyas por otro.
- No crear recursos AWS ni `cdk deploy`. NO abras ni edites la PR.

## Criterios de aceptación

R1 a R14 de `requirements.md`. R1, R10 y la sonda de R11 nacen en verde por diseño y se declaran; el
resto nace rojo. R14 es la composición de la raíz, no el smoke: el smoke en dev build Android lo corre
el humano.

## Al terminar

Escribe el resultado en `progress/impl_mobile-home-empty-canvas-fidelity.md`: H0, T0, el `Tests:` de cada
fichero antes y después de cada commit, los hashes de la cadena, las skills cargadas, el resultado de la
sonda de R11, los NV declarados, cada candado enmendado o inesperado, cada parada o desviación y si
hizo falta el plan B de `react-native-svg`.
Última acción: crear `progress/impl_mobile-home-empty-canvas-fidelity.done` con una sola línea: la ruta de
`progress/impl_mobile-home-empty-canvas-fidelity.md`. Es el marcador que vigila
`scripts/harness/watch-impl.sh`; no lo commitees (está en `.gitignore`).
