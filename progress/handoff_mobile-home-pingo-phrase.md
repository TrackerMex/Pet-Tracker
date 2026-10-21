Worktree: /home/claude/sites/Pet-Tracker-wt-190   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio

# Handoff a Codex CLI — feature #190 mobile-home-pingo-phrase

> Pegar el bloque de abajo (desde la linea `Worktree:` hasta el final) en Codex CLI.
> Spec firmada en `81a964bc` (aprobacion via Notion, 2026-10-19T22:07:58Z). Las decisiones
> H1, H2 y H3 estan confirmadas por defecto y la Enmienda #190 esta aprobada: **R5 y R14 estan
> desbloqueadas**. R15 (smoke Android) es del humano y cierra la feature.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-190   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro salidas
al principio de progress/impl_mobile-home-pingo-phrase.md. El hash es H0 (el
commit que anade este handoff). PARA si la branch no es
feature/190-mobile-home-pingo-phrase o si `git status --short` no sale vacio.
No toques /home/claude/sites/Pet-Tracker ni ningun otro worktree
(Pet-Tracker-wt-188, -189, -191, -192, -193, -194 ...), ni cambies de branch en
ninguno.

Feature: mobile-home-pingo-phrase (#190)
Branch: feature/190-mobile-home-pingo-phrase
Spec aprobada: specs/mobile-home-pingo-phrase/requirements.md (status: approved,
firma 81a964bc). H1, H2, H3 y la Enmienda #190 estan firmadas: no reabras
ninguna decision. Lee tambien, enteros: specs/mobile-home-pingo-phrase/design.md
(incluye el texto literal de la Enmienda #190), tasks.md y traceability.md.
tasks.md es tu guion; los literales de copy de R9 estan en requirements.md R9 y
los copias tal cual (tildes, `{{...}}` y punto final).

== QUE HACES ==

Commits test-primero, UNO ROJO Y SU VERDE POR REQUISITO, en commits separados,
en este orden (el de tasks.md): R9, R8, R11, R1, R2, R3, R4, R6, R10, R7, R13,
R12, R5, R14. Mensajes: `test(home): ... (R<n>)` el rojo y `feat(home): ...
(R<n>)` el verde. Si escribes un verde antes que su rojo, ese requisito nace
verde y pierde su historial (C4 de CHECKPOINTS.md; en #19 se metio todo en un
solo commit y no vale). R7 y R12 pueden nacer verdes si la implementacion
previa ya los cubre: en ese caso un solo commit `test(home): ... (R<n>)` y lo
dices en el impl, sin inventar un rojo. Cada commit verde deja la suite entera
de los ficheros tocados en verde.

Esto manda sobre tasks.md:
- Trazabilidad: traceability.md se rellena entera UNA vez, en un commit final
  `docs(home): trazabilidad de #190`, tras el ultimo verde. Ningun commit de R1-R14 la toca.
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y la salida a un fichero fuera del arbol.
- R15 no tiene commit: deja en el impl las instrucciones del smoke (dev build
  Android, modo claro, modo oscuro, reduce motion activado).

== BASE ==

origin/main = 14ec7307 y la branch parte de el. Desde mobile-pet-tracker/:
- `bun install --frozen-lockfile` primero, sin condicionar (el worktree es nuevo); `test -d node_modules && echo presente`.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0 en cada cadena de commit. Si da 1, PARA y pide al humano que lo borre. Nunca `rm -f`.
- `.env` ya esta copiado en la raiz del worktree. No lances init.sh: lo corre el leader.
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la maquina; espera antes de correr la suite entera.

Base medida por el leader el 2026-10-19 en este worktree, cada fichero por separado, FORCE_COLOR=0, sin pipe, todos exit=0:
  src/screens/home/index.test.tsx                        230 passed
  src/screens/home/home-entrance.test.tsx                  7 passed
  src/theme/__tests__/motion.test.ts                      25 passed
  src/providers/__tests__/language-provider.test.tsx      47 passed
  src/__tests__/ui-language.test.ts                       30 passed
  src/__tests__/alerts-canvas-fidelity.test.ts            27 passed
  src/components/__tests__/pingo-float.test.tsx            5 passed
Tu medida manda: repitela antes del primer commit y anotala en el impl (junto
con el `Tests:` de la suite entera, `bun run test` una sola vez, sin pipe; el aviso final
`A worker process has failed to exit gracefully` es preexistente: no pares por el).

== ANCLAS ==

Ejecutalas desde la RAIZ del worktree antes de tocar nada y copia la salida al
impl. Solo estos comandos son anclas; los numeros de linea no lo son. Si una no
da EXACTAMENTE su valor, PARA y avisa (ante una diferencia manda el fichero).

A1. grep -c '^status: approved' specs/mobile-home-pingo-phrase/requirements.md   -> 1
A2. grep -cF -- '- [x] Enmienda #190 de' specs/mobile-home-pingo-phrase/requirements.md   -> 1
A3. grep -cF -- '- [ ] Smoke de R15' specs/mobile-home-pingo-phrase/requirements.md   -> 1
A4. grep -cF 'testID="home-entrance-summary"' mobile-pet-tracker/src/screens/home/index.tsx   -> 1
A5. grep -cF 'index={' mobile-pet-tracker/src/screens/home/index.tsx   -> 6
A6. grep -cF 'pingo' mobile-pet-tracker/src/screens/home/index.tsx   -> 0
A7. grep -cF -- '--radius-4' mobile-pet-tracker/src/theme/global.css   -> 0
A8. grep -cF -- '--radius-tile: 18px' mobile-pet-tracker/src/theme/global.css   -> 1
A9. grep -cF 'home.pingoPhrase' mobile-pet-tracker/src/i18n/catalog.ts   -> 0
A10. grep -cF '+ 4, // #186 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
A11. grep -cF 'expect(R3_HOME).toHaveLength(21 + 15 + 1 + 4 + 7 + 2 + 1 + 2 + 2); // +2 #155 R4' mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
A12. grep -cF '+ 1 // #186 R2: utils/form-rules.ts' mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
A13. grep -cF "'screens/forgot/index.tsx'," mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts   -> 1
A14. grep -cF "'screens/login/index.tsx'," mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts   -> 1
A15. grep -cF "it('pinta los seis envoltorios como hijos directos y en orden'" mobile-pet-tracker/src/screens/home/index.test.tsx   -> 1
A16. grep -cF "it('escalona las entradas cada 60 ms en el orden de los bloques'" mobile-pet-tracker/src/screens/home/index.test.tsx   -> 1
A17. grep -cF 'export function PingoFloat' mobile-pet-tracker/src/components/pingo-float.tsx   -> 1
A18. grep -cF 'export const MOTION_PINGO_FLOAT_OFFSET_Y = 10;' mobile-pet-tracker/src/theme/motion.ts   -> 1
A19. grep -cF 'export function fmtKm' mobile-pet-tracker/src/screens/home/format.ts   -> 1
A20. grep -cF '## Enmienda #190' docs/ui-guidelines.md   -> 0
A21. grep -cF '## Enmienda #186' docs/ui-guidelines.md   -> 1
A22. test -f mobile-pet-tracker/assets/images/pingo-talk.webp && echo ok   -> ok
A23. test ! -e mobile-pet-tracker/src/screens/home/pingo-phrase.ts && test ! -e mobile-pet-tracker/src/__tests__/home-pingo-phrase.test.ts && echo ok   -> ok

== ALCANCE (lista cerrada) ==

Todo bajo mobile-pet-tracker/ salvo donde se indica:
- Produccion: src/screens/home/index.tsx, src/screens/home/pingo-phrase.ts (nuevo),
  src/i18n/catalog.ts, src/theme/global.css.
- Tests nuevos: src/screens/home/pingo-phrase.test.ts, src/__tests__/home-pingo-phrase.test.ts.
- Tests enmendados (solo lo de tasks.md §Tests enmendados, con el comentario
  `(enmendado por #190 R<n>)`): src/screens/home/index.test.tsx,
  src/__tests__/alerts-canvas-fidelity.test.ts, src/__tests__/ui-copy-table.ts,
  src/__tests__/ui-language.test.ts, src/providers/__tests__/language-provider.test.tsx.
  Si otro candado de inventario se pone rojo por la burbuja, lo enmiendas con el
  mismo criterio y lo anotas en el impl; no relajes ningun otro.
- Raiz del repo: docs/ui-guidelines.md (SOLO la seccion `## Enmienda #190`, R14, tras la Enmienda #186,
  con el texto literal de design.md §Texto de la Enmienda #190; la casilla
  `- [ ] Enmienda #190 aprobada por humano` la dejas SIN marcar: es del humano),
  specs/mobile-home-pingo-phrase/traceability.md y progress/impl_mobile-home-pingo-phrase.md.
- El diff de produccion contra origin/main (mobile-pet-tracker/ y backend-pet-tracker/)
  son exactamente los ficheros de las dos primeras viñetas; la lista completa de
  ficheros se mide con `git diff --name-only <H0>..HEAD`.

Prohibido: dependencias nuevas (package.json, bun.lock), src/screens/home/home-entrance.tsx,
src/components/pingo-float.tsx, src/theme/motion.ts (motion.test.ts lo candada: sin exports
nuevos), expo-linear-gradient, backend-pet-tracker/, y cualquier clase arbitraria `[...]`,
`StyleSheet.create`, hex, sombra legacy o emoji en los ficheros de src/screens/home/.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md; convenciones: docs/conventions.md (la app movil es capa de presentacion).
- UI movil: docs/ui-guidelines.md rige. Carga la skill `building-native-ui` del plugin expo de Codex
  (Codex NO tiene `expo-overview` ni `expo-animation`; no los busques) y **di en el reporte cuales
  cargaste**. `bun` para todo (bunx, bun add), nunca npx ni npm i -g.
- Esperas (docs/conventions.md §Esperas sobre el arbol renderizado): en los tests que dependan de
  datos asincronos (detalle y actividad de Inicio), espera al nodo positivo final
  (`await waitFor(() => expect(getByTestId('home-pingo-text')).toBeTruthy())` o el equivalente del
  fichero), nunca a un contador de mock ni a la desaparicion de un skeleton que no existe en esa rama.
  `fireEvent` y `act` de RNTL 14 son asincronos: `await` en ambos, o contaminan el `it` siguiente.
  `renderRouter` sin `await app;` filtra entre `it`.
- `toHaveAnimatedStyle` solo comprueba las claves que le das: para R5 usa `shouldMatchAllProps` o
  una clave opacidad colada pasa en verde. `withRepeat` esta mockeado en el fichero como
  `jest.fn((animation) => animation)`: reutiliza el enfoque de `pingo-float.test.tsx` para distinguir
  la llamada `(-10, -1, true)` del pulso del punto de estado (`-1, false`).
- Los literales esperados de los tests se escriben a mano, nunca importados de src/theme/ ni de
  src/i18n/catalog.ts.
- Supuestos de design.md §Supuestos no verificados (uniwind con `rounded-br-4` y `leading-5.25`, y
  forma de `source` en el mock de expo-image): confirmalos ANTES del rojo que los usa. Si uniwind
  no los resolviera, PARA y reporta; no sustituyas por clases arbitrarias.
- Candados agregados: una fila nueva en ui-copy-table.ts mueve R3_HOME, ALL_USES (se recalcula
  por bloques) y SCREEN_FILES. Mide la cifra base en el arbol antes de sumar (A11, A12); no copies
  numeros de la spec.
- Jest con rutas con parentesis: usa `'src/app/\(tabs\)/...'` con los parentesis escapados, o salta el fichero con exit 0.
- Planta a mano una violacion (p. ej. `bg-[#fff]`) para ver fallar el test de R12 antes de retirarla.
- Tests por `-t`/aislados no absuelven: ante un rojo ajeno, corre el conjunto varias veces antes de llamarlo regresion.
- Si el sandbox te deniega un comando, PARA y repórtalo; no lo sustituyas por otro que haga lo mismo.
- NO son tuyos, no los toques: progress/history.md, progress/current.md, STATUS.md y el campo
  `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-home-pingo-phrase.md.
- No crear recursos AWS reales ni cdk deploy. NO abras la PR ni la edites: la abre el leader al cerrar.

Cada commit va encadenado con `&&` a su verificacion (jest del fichero tocado en el rojo esperado o
verde, `bunx tsc --noEmit` con `test ! -e .expo/types/router.d.ts` antes, y `git commit` al final).
Nunca commitees con un exit distinto del esperado. Antes de cada commit de codigo, prettier no existe
en movil: respeta el estilo del fichero.

Criterios de aceptacion: R1-R14 de specs/mobile-home-pingo-phrase/requirements.md (R15 es del humano).
Al terminar: escribir resultado en progress/impl_mobile-home-pingo-phrase.md (con: salida de pwd/branch/H0,
medidas de base, anclas, skills cargadas, hashes por requisito, tests enmendados, instrucciones del smoke R15).
Ultima accion: crear progress/impl_mobile-home-pingo-phrase.done con una sola linea: la ruta de
progress/impl_mobile-home-pingo-phrase.md. Es el marcador que vigila scripts/harness/watch-impl.sh y avisa
al leader; no lo commitees (esta en .gitignore).
```
