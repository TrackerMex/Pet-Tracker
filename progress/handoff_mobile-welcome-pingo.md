# Handoff a Codex CLI — #153 mobile-welcome-pingo

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `10f7e808`, aprobación vía Notion el 2026-10-07) y su Enmienda E1 también
> (`291049ae`, 2026-10-08). Es la segunda feature del bloque de deleite visual:
> Pingo sustituye al logo de la bienvenida, con su saludo en los dos idiomas,
> la voz B escrita en la carta, dos poses en WebP, el labio del CTA primario,
> la entrada con las constantes de `motion.ts` y los bucles de flotación y
> parpadeo. Son 27 commits: T1-T11 en pares rojo/verde, E1 en par, T12 y T13
> nacen verdes, y uno final de trazabilidad. La prueba de humo de R14, en un
> dev build de Android, es del humano y cierra la feature. Las sondas del
> reviewer (S1-S3 de E1, T12 y T13) las planta el reviewer, no Codex.
>
> `node_modules` ya está instalado en `Pet-Tracker-wt-153/mobile-pet-tracker`.
> La branch ya incluye `origin/main` 36c8050d (#152, PR #198), mergeado en
> 61c03a8a antes de la firma de E1.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-153   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-welcome-pingo.md.
El hash es H0 (el commit que anade este handoff), y es tambien el «HEAD
del handoff» de tasks.md T0 y R13. En todos los comandos de abajo,
sustituye `<H0>` por ese hash literal: todos los `git diff` se miden
contra el. PARA si la branch no es feature/153-mobile-welcome-pingo o si
`git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-118, Pet-Tracker-wt-146, Pet-Tracker-wt-148,
Pet-Tracker-wt-152, Pet-Tracker-wt-backend, Pet-Tracker-wt-ui,
pet-tracker-43, pt-skills, ningun Pet-Tracker-wt-154 o wt-155 ni ningun
otro worktree, ni cambies de branch en ninguno.

Feature: mobile-welcome-pingo (#153)
Branch: feature/153-mobile-welcome-pingo
Spec aprobada: specs/mobile-welcome-pingo/requirements.md
(status: approved, firma 10f7e808; Enmienda E1 firmada en 291049ae).
Todas las decisiones estan cerradas (D1-D4 y G1-G11): no reabras ninguna.
Lee tambien, enteros: specs/mobile-welcome-pingo/design.md, tasks.md y
traceability.md, y requirements.md hasta el final (la §Enmienda E1 esta
al final del fichero). tasks.md es tu guion (T0-T14). Los titulos de
describe e it son LITERALES de requirements.md: copialos tal cual, con
sus tildes y sus simbolos (`×`, `%s`, `100 000`).

== QUE HACES ==

Los 27 commits, en este orden exacto (el de tasks.md §Orden):
T1 R2, T2 R4, T3 R3, T4 R1, T5 R5, T6 R6, T7 R7, T8 R8, T8b E1, T9 R9,
T10 R10, T11 R11 (rojo y verde cada uno), T12 R12 y T13 R13 (nacen verdes,
un commit cada uno) y el commit final de trazabilidad. Rojo SIEMPRE antes
de su verde, en commits separados. Si escribes un verde antes que su
rojo, ese requisito nace verde y pierde su historial (C4 de
CHECKPOINTS.md); en #19 se metio todo en un solo commit y no vale.
T12 y T13 son candados sin rojo honesto: NO metas una limpieza ni una
dependencia para provocarlo (las sondas son del reviewer).

Esto manda sobre tasks.md:
- Trazabilidad: tasks.md dice «tras el commit verde de cada tarea,
  rellena su fila». NO: traceability.md se rellena entera UNA vez, al
  final, en el commit de trazabilidad del Cierre. Ningun commit de T1-T13
  la toca.
- tasks.md T8 (3) pide un refactor de `Easing`: hazlo dentro del verde de
  T8 (la cadena lo comprueba). No hay commits `refactor(...)`.
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y con la salida a un
  fichero, como en las cadenas de abajo, no como el ejemplo de tasks.md.

== BASE ==

origin/main = 36c8050d al escribir este handoff, y la branch ya lo
incluye (merge 61c03a8a, antes de H0): lo esperado es exit=0. Al arrancar:
`git fetch origin` y `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main en la branch lo hace el leader.
Nunca rebasees ni mergees.

Desde mobile-pet-tracker/:
- `test -d node_modules && echo presente` -> presente. Si no sale,
  `bun install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0. Va en
  cada cadena de commit; si un dia da 1, PARA y pide al humano que lo
  borre. Nunca `rm -f` (tu sandbox lo deniega).
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina; espera a que salga vacio antes de la suite entera del Cierre.

Base medida por el leader el 2026-10-08 en este worktree con el arbol de
H0, cada fichero por separado, con FORCE_COLOR=0 y sin pipe, todos exit=0:
  src/screens/welcome/index.test.tsx                     28 passed
  src/theme/__tests__/motion.test.ts                      9 passed
  src/providers/__tests__/language-provider.test.tsx     24 passed
  src/__tests__/ui-language.test.ts                      30 passed
  src/__tests__/design-drift.test.ts                     62 passed
  src/__tests__/consistency-classnames.test.ts           55 passed
  src/__tests__/legibility-classnames.test.ts            27 passed
Y las seis suites que leen la carta (comando CARTA, abajo):
  Test Suites: 6 passed, 6 total
  Tests:       216 passed, 216 total
Tu medida manda: repitela (tasks.md T0 paso 2 y el comando CARTA) y
anotala en el impl. Si algo nace rojo, PARA.

Comando CARTA (lo usan T1 y T8b; la ruta de food lleva los parentesis
ESCAPADOS: sin escapar, jest los toma por regex y salta el fichero en
silencio con exit 0):
  FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts 'src/app/\(tabs\)/__tests__/food.test.tsx' src/__tests__/hero-header-amendments.test.ts

== ANCLAS ==

Ejecutalas TODAS desde la RAIZ del worktree antes de tocar nada y copia
la salida al impl. Son las A1-A23 de tasks.md T0, los bloques de
design.md §Guards (G1-G11) y las del handoff (H1-H24). Solo estos
comandos son anclas; los numeros de linea no lo son. Si alguna no da
EXACTAMENTE lo esperado, PARA y avisa (ante una diferencia manda el
fichero, no el handoff). Cuando `grep -c` cuenta 0 sale con codigo 1: lo
que vale es la cifra impresa. El leader las ha ejecutado todas en H0
sacandolas de este mismo fichero.

A1. test -f mobile-pet-tracker/src/theme/motion.ts && echo ok   -> ok
A2. grep -cE '^export const MOTION_(FEEDBACK_MS|TRANSITION_MS|SURFACE_MS|STAGGER_MS|ENTRANCE_OFFSET_Y|SETTLE_SPRING|FADE_TIMING|FILL_TIMING)\b' mobile-pet-tracker/src/theme/motion.ts   -> 8
A3. grep -cF "it('no exporta nada más'" mobile-pet-tracker/src/theme/__tests__/motion.test.ts   -> 1
A4. test ! -e mobile-pet-tracker/.expo/types/router.d.ts && echo ok   -> ok
A5. grep -cF "+ 8, // #118 R1" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
A6. grep -cF "{ file: 'src/screens/welcome/index.tsx', key: 'welcome.legalNotice' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts   -> 1
A7. grep -cF "it('resuelve las 8 ocurrencias de welcome'" mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
A8. grep -cF "'welcome.legalNotice':" mobile-pet-tracker/src/i18n/catalog.ts   -> 2
A9. grep -cF "**6. Idioma:" docs/ui-guidelines.md   -> 1
A10. grep -cF "## Checklist de autocrítica (cierra toda pantalla nueva o modificada)" docs/ui-guidelines.md   -> 1
A11. grep -cF "**7. " docs/ui-guidelines.md   -> 0
A12. grep -cF "### §2.19" specs/mobile-ui-language/design.md   -> 1
A13. grep -cF "## 3. La infraestructura" specs/mobile-ui-language/design.md   -> 1
A14. grep -cF "describe('R10', () => {" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
A15. grep -cF "it('apila los siete bloques en orden'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
A16. grep -cF "it('pinta hero, marca, tagline y legal con sus clases'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
A17. grep -cF "'w-full rounded-xl bg-accent'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
A18. ls /home/claude/pet-tracker-mascot/webp/ | tr '\n' ' '   -> pingo-wave-blink.webp pingo-wave.webp 
A19. ls mobile-pet-tracker/assets/images | grep -cE '^(pingo|mascot)-'   -> 0
A20. grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/theme/motion.ts   -> 0
A21. grep -cF 'Las constantes anteriores a #152 (' docs/ui-guidelines.md   -> 1
A22. grep -cF '`WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y' docs/ui-guidelines.md   -> 1
A23. grep -cF '## Enmienda #152 — el movimiento vive en src/theme/motion.ts' docs/ui-guidelines.md   -> 1
G1. grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
G2. grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
G3. grep -ciP 'StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
G4. grep -cP '\brounded-(?:2xl|lg|md|sm)\b|text-accent(?![-\w])' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
G5. grep -cP 'expo-linear-gradient|expo-symbols|\buseThemeColor\b' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
G6. grep -oP 'text-accent-strong\b' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l   -> 2
G7. grep -oP '[\x27"`]/(?:\(auth\)/)?login\b' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l   -> 1
G8. grep -oP 'rounded-xl bg-accent(?=[\s\x27"`])' mobile-pet-tracker/src/screens/welcome/index.tsx | wc -l   -> 1
G9. grep -cP '[A-Za-z0-9_-]+-\[[^\]]+\]' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 0
G10. grep -cP 'use-api|useApi' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 0
G11. grep -ciP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:' mobile-pet-tracker/src/theme/motion.ts   -> 0
H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-07)' specs/mobile-welcome-pingo/requirements.md   -> 1
H2. grep -cF -- '- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-08)' specs/mobile-welcome-pingo/requirements.md   -> 1
H3. grep -cF -- '- [ ] Smoke R14 superado' specs/mobile-welcome-pingo/requirements.md   -> 1
H4. grep -cF "describe('#153" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 0
H5. grep -cF "describe('#153" mobile-pet-tracker/src/theme/__tests__/motion.test.ts   -> 0
H6. grep -cF 'WELCOME_ENTRANCE_' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 6
H7. grep -cF 'WELCOME_ENTRANCE_' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 6
H8. grep -cF 'splash-icon' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 1
H9. grep -cF 'testID="welcome-hero"' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 1
H10. grep -cw Easing mobile-pet-tracker/src/screens/welcome/index.tsx   -> 2
H11. grep -cF "from '../../theme/motion'" mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
H12. grep -cF '<Card' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
H13. grep -cF 'border-b-4' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
H14. grep -cF 'cancelAnimation' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
H15. grep -cF 'return () =>' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 0
H16. grep -cF 'withRepeat' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 0
H17. grep -cF 'readdirSync' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 0
H18. grep -cF 'declare function require' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 0
H19. grep -cF 'StyleSheet.flatten' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
H20. grep -cF "'welcome.pingoGreeting'" mobile-pet-tracker/src/i18n/catalog.ts   -> 0
H21. grep -cF 'welcome.pingoGreeting' mobile-pet-tracker/src/__tests__/ui-copy-table.ts   -> 0
H22. grep -cF '### §2.20' specs/mobile-ui-language/design.md   -> 0
H23. grep -cF 'export const MOTION_' mobile-pet-tracker/src/theme/motion.ts   -> 8
H24. grep -cE 'testID="welcome-(brand|chips)"' mobile-pet-tracker/src/screens/welcome/index.tsx   -> 2

Valores al cerrar (copialos al impl): A1-A10 sin cambios; A11 -> 1;
A12-A13 sin cambios; A14 -> 0; A15 sin cambios (el it conserva su titulo,
C5 solo cambia su lista); A16 -> 0 (C6 lo renombra); A17 -> 0 (C7);
A18 sin cambios; A19 -> 2; A20 sin cambios; A21 sin cambios; A22 -> 0;
A23 sin cambios; G1-G11 sin cambios (design.md: valen antes y despues);
H1-H3 sin cambios; H4 -> 13; H5 -> 1; H6 -> 0; H7 no se fija (E1 y R8
citan el nombre; anota el valor); H8 -> 0; H9 -> 0; H10 -> 0; H11 -> 1;
H12 -> 2; H13 -> 1; H14-H15 sin cambios; H16 no menos de 2; H17 no menos
de 1; H18 -> 1; H19 sin cambios; H20 -> 2; H21 -> 1; H22 -> 1; H23 -> 13;
H24 sin cambios. Y en positivo al cerrar, desde la raiz:
  P1. grep -cF "it('pinta marca, tagline y legal con sus clases'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
  P2. grep -cF "'w-full rounded-xl bg-accent border-b-4 border-black/25'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 2
  P3. grep -cF "t('welcome.pingoGreeting')" mobile-pet-tracker/src/screens/welcome/index.tsx   -> 1
  P4. grep -cF '**7. Voz de Pingo: guardián sereno.**' docs/ui-guidelines.md   -> 1
  P5. grep -cF '`WELCOME_ENTRANCE_MS` no está en la lista: la retiró #153, cuya bienvenida' docs/ui-guidelines.md   -> 1
  P6. grep -cF "it('resuelve las 9 ocurrencias de welcome (#153 R1)'" mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
  P7. grep -cF '+ 1, // #153 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
  P8. grep -cF "describe('R10', () => {" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 0

== COMMITS ==

Todo desde mobile-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la
cadena (en #115 se commiteo un verde con el registrador en exit=1). Si
una cadena no llega al commit, PARA y reporta en el impl el eslabon que
fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato:
`Tests:       3 failed, 28 passed, 31 total` y en verde
`Tests:       31 passed, 31 total`. Cada medida de abajo lleva su
`echo "exit=$?"`; anota el exit en el impl.

Rojos: cada uno cae EXACTAMENTE como dice tasks.md: por ASERCION
(Expected/Received) o por CONSULTA (`Unable to find an element with
testID: ...` / `with text: ...`) donde tasks.md lo dice. Nunca por
TypeError, ReferenceError, SyntaxError ni `Cannot find module`. La unica
excepcion es T3: los dos casos del it.each caen por
`ENOENT: no such file or directory` (el fichero no existe), y la cadena
lo acota. La cadena comprueba la cuenta; tu ademas abres el log y copias
al impl cada it rojo con su matcher y su Expected/Received (o la consulta
o el ENOENT que fallo).

Typecheck en los rojos: va normal (exit 0) salvo en T2 y T4, donde la
cadena lo acota:
- T2: motion.test.ts importa por nombre las constantes nuevas, que aun no
  existen: el log tiene exactamente 5 `error TS`, todos de
  src/theme/__tests__/motion.test.ts y todos TS2305 o TS2724. TypeScript
  6.0.3 da TS2724 («Did you mean...») cuando el nombre se parece a otro
  export (MOTION_FLOAT_TIMING y MOTION_BLINK_TIMING). Lo midio Codex en la
  primera pasada y el leader corrigio la cadena el 2026-10-08.
- T4: el test de la bienvenida lee `en['welcome.pingoGreeting']` y
  `es['welcome.pingoGreeting']`, una clave que aun no existe: todo
  `error TS` del log tiene que ser un TS7053 de
  src/screens/welcome/index.test.tsx.

Lint: `bun run lint` sale con exit 0 tambien con avisos (warnings). En
T8 y T9, `mockWithRepeat` existe sin usarse hasta T10: es un aviso de
`no-unused-vars` y es correcto. Cualquier error de lint para la cadena.

-- T1 R2: la voz de Pingo en la carta --

T1 rojo (describe `#153 R2: la carta escribe la voz de Pingo`, 3 it, en el test de la bienvenida):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 28 passed, 31 total`, los tres por asercion
  grep -qE '^Tests: +3 failed, 28 passed, 31 total$' /tmp/153-r1.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R2 red pingo voice in the charter'

T1 verde (bloque literal de R2 en docs/ui-guidelines.md, justo antes de la linea de A10, con una linea en blanco arriba y otra abajo):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g1.txt 2>&1; echo "exit=$?"
  <comando CARTA> > /tmp/153-g1-carta.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +31 passed, 31 total$' /tmp/153-g1.txt \
    && grep -qE '^Tests: +216 passed, 216 total$' /tmp/153-g1-carta.txt \
    && test "$(grep -cF '**7. Voz de Pingo: guardián sereno.**' ../docs/ui-guidelines.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add ../docs/ui-guidelines.md \
    && test "$(git diff --cached --name-only)" = 'docs/ui-guidelines.md' \
    && git commit -m 'feat(mobile-welcome): #153 R2 pingo voice in the charter'

-- T2 R4: las constantes de Pingo en motion.ts --

T2 rojo (describe `#153 R4: las constantes de Pingo viven en motion.ts`, 3 it, + C4: la lista de `no exporta nada más` pasa a los 13 nombres ordenados):
  Las constantes nuevas se importan por NOMBRE en la cabecera del fichero,
  junto a las 8 de #152 que ya importa. El `Easing` doblado del fichero
  devuelve `{ bezier: [...] }`: el it de la flotacion compara con
  `{ duration: 1200, easing: { bezier: [0.37, 0, 0.63, 1] }, reduceMotion: ReduceMotion.System }`.
  FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/153-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 8 passed, 12 total` (3 nuevos con
       `undefined` y `no exporta nada más`, 8 frente a 13)
  grep -qE '^Tests: +4 failed, 8 passed, 12 total$' /tmp/153-r2.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r2.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/153-r2-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/153-r2-tsc.txt)" = 5 \
    && test "$(grep -cE '^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS(2305|2724):' /tmp/153-r2-tsc.txt)" = 5 \
    && bun run lint \
    && git add src/theme/__tests__/motion.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts' \
    && git commit -m 'test(mobile-welcome): #153 R4 red pingo motion constants'

T2 verde (las 5 constantes de la tabla de R4, tras las de #152, cada una con `// #153 R4`):
  FORCE_COLOR=0 bunx jest src/theme/__tests__/motion.test.ts > /tmp/153-g2.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +12 passed, 12 total$' /tmp/153-g2.txt \
    && test "$(grep -cF 'export const MOTION_' src/theme/motion.ts)" = 13 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/theme/motion.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/motion.ts' \
    && git commit -m 'feat(mobile-welcome): #153 R4 pingo motion constants'

-- T3 R3: las dos poses en WebP --

T3 rojo (describe `#153 R3: las poses entran como WebP`: it.each de 2 filas + `no mete otras poses de Pingo`):
  `readdirSync` se anade a la destructuracion que ya existe en la cabecera:
  `const { readFileSync, readdirSync } = jest.requireActual<typeof import('fs')>('fs');`.
  `join` ya existe en la cabecera: reutilizalo.
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 31 passed, 34 total` (2 por ENOENT,
       1 por asercion: `[]` frente a la lista de dos)
  grep -qE '^Tests: +3 failed, 31 passed, 34 total$' /tmp/153-r3.txt \
    && test "$(grep -cE 'ENOENT: no such file or directory.*pingo-wave(-blink)?\.webp' /tmp/153-r3.txt)" -ge 2 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r3.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R3 red pingo webp poses'

T3 verde (copia los dos ficheros SIN reconvertirlos; si el sandbox te
deniega leer /home/claude/pet-tracker-mascot/, PARA y pidele la copia al
humano, no la sustituyas por otra herramienta):
  cp /home/claude/pet-tracker-mascot/webp/pingo-wave.webp /home/claude/pet-tracker-mascot/webp/pingo-wave-blink.webp assets/images/; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g3.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +34 passed, 34 total$' /tmp/153-g3.txt \
    && cmp -s assets/images/pingo-wave.webp /home/claude/pet-tracker-mascot/webp/pingo-wave.webp \
    && cmp -s assets/images/pingo-wave-blink.webp /home/claude/pet-tracker-mascot/webp/pingo-wave-blink.webp \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add assets/images/pingo-wave.webp assets/images/pingo-wave-blink.webp \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/assets/images/pingo-wave-blink.webp mobile-pet-tracker/assets/images/pingo-wave.webp ' \
    && git commit -m 'feat(mobile-welcome): #153 R3 pingo webp poses'

-- T4 R1: el saludo en el catalogo y en la tabla de idioma --

T4 rojo (describe `#153 R1: el saludo de Pingo existe en los dos idiomas`
con SOLO 3 it: `declara el saludo en inglés y en español`,
`no exclama ni lleva emoji en ningún idioma` y
`registra la clave en la tabla de mobile-ui-language`; los dos del
bocadillo van en T5. Importa `en` y `es` por nombre de
'../../i18n/catalog'. + C1 en language-provider.test.tsx):
  `no exclama ni lleva emoji` se escribe con el matcher de jest, por cada
  valor: `expect(value).not.toMatch(/[!¡]/)` y
  `expect(value).not.toMatch(/\p{Extended_Pictographic}/u)`. NO con
  `expect(/re/.test(value)).toBe(false)`: con `value` undefined,
  `.test(undefined)` da false y el it naceria verde; `not.toMatch` cae por
  asercion («received value must be a string»).
  C1: `+ 8, // #118 R1` pasa a `+ 8 // #118 R1` y debajo entra
  `+ 1, // #153 R1` con la misma sangria.
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 34 passed, 37 total`
  FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/153-r4-lp.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 23 passed, 24 total` (el recuento pide una clave mas)
  grep -qE '^Tests: +3 failed, 34 passed, 37 total$' /tmp/153-r4.txt \
    && grep -qE '^Tests: +1 failed, 23 passed, 24 total$' /tmp/153-r4-lp.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r4.txt /tmp/153-r4-lp.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/153-r4-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/153-r4-tsc.txt)" = "$(grep -cE '^src/screens/welcome/index\.test\.tsx\([0-9]+,[0-9]+\): error TS7053:' /tmp/153-r4-tsc.txt)" \
    && bun run lint \
    && git add src/screens/welcome/index.test.tsx src/providers/__tests__/language-provider.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/welcome/index.test.tsx ' \
    && git commit -m 'test(mobile-welcome): #153 R1 red pingo greeting copy'

T4 verde (`'welcome.pingoGreeting'` en `en` y en `es` de catalog.ts, justo
tras `'welcome.legalNotice'` en cada idioma, con los literales de
requirements.md §Copy final; y la seccion §2.20 de R1 en
specs/mobile-ui-language/design.md, entre la tabla de §2.19 y
`## 3. La infraestructura`):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g4.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/153-g4-lp.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/153-g4-ul.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +37 passed, 37 total$' /tmp/153-g4.txt \
    && grep -qE '^Tests: +24 passed, 24 total$' /tmp/153-g4-lp.txt \
    && grep -qE '^Tests: +30 passed, 30 total$' /tmp/153-g4-ul.txt \
    && test "$(grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts)" = 2 \
    && test "$(grep -cF '### §2.20' ../specs/mobile-ui-language/design.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && git commit -m 'feat(mobile-welcome): #153 R1 pingo greeting copy'

-- T5 R5: la escena sustituye al logo --

T5 rojo (describe `#153 R5: la escena de Pingo sustituye al logo`, 4 it;
los dos it del bocadillo en el describe `#153 R1`; C5, C6 en el test de
la bienvenida; C2 en ui-copy-table.ts y C3 en ui-language.test.ts):
  C5: el it `apila los siete bloques en orden` conserva su titulo y su
  lista pasa a la de R5. C6: el it `pinta hero, marca, tagline y legal
  con sus clases` pierde las aserciones de `welcome-hero` y se renombra
  `pinta marca, tagline y legal con sus clases`; su `StyleSheet.flatten`
  sobre `welcome-content` se queda como esta. C6 nace verde.
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       7 failed, 36 passed, 43 total`:
       por consulta, `pinta la escena como card...`, `pinta el bocadillo
       como card...` y los 2 del bocadillo de R1; por asercion,
       `apila la escena y los seis bloques...`, `ya no pinta el logo` y C5.
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/153-r5-ul.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 28 passed, 30 total` (C3 y
       `resuelve cada ocurrencia de la tabla contra la clave exacta`)
  grep -qE '^Tests: +7 failed, 36 passed, 43 total$' /tmp/153-r5.txt \
    && test "$(grep -cE 'Unable to find an element with (testID: welcome-(scene|bubble)|text: (Hola|Hi), )' /tmp/153-r5.txt)" -ge 4 \
    && grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/153-r5-ul.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r5.txt /tmp/153-r5-ul.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/welcome/index.test.tsx ' \
    && git commit -m 'test(mobile-welcome): #153 R5 red pingo scene replaces the logo'

T5 verde (index.tsx: borra `welcome-hero` y su require de splash-icon.png;
pinta la escena con la tabla de nodos de R5, `Card` importado de
'../../components/card'; `welcome-pingo` como `Animated.View` con
`style={{ width: 200, height: 200 }}` y sin hijos).
  OJO, ORDEN: hoy `welcome-brand` va ANTES que `welcome-chips` (H24). R5
  pide escena, CHIPS, MARCA, tagline...: mueve el bloque de chips encima
  de la marca, sin cambiar ni sus props ni sus hijos. tasks.md no lo dice
  y el it de orden lo exige.
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g5.txt 2>&1; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/153-g5-ul.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +43 passed, 43 total$' /tmp/153-g5.txt \
    && grep -qE '^Tests: +30 passed, 30 total$' /tmp/153-g5-ul.txt \
    && test "$(grep -cF 'splash-icon' src/screens/welcome/index.tsx)" = 0 \
    && test "$(grep -cF "t('welcome.pingoGreeting')" src/screens/welcome/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
    && git commit -m 'feat(mobile-welcome): #153 R5 pingo scene replaces the logo'

-- T6 R6: la pose y la capa de parpadeo --

T6 rojo (describe `#153 R6: Pingo se pinta con su pose y su capa de parpadeo`: 2 it + it.each de 2 filas = 4 tests):
  `getAnimatedStyle` se importa por nombre de 'react-native-reanimated'.
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r6.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 43 passed, 47 total`. Tres caen por
       consulta (`welcome-pingo-wave`, `welcome-pingo-blink-image`,
       `welcome-pingo-blink`). El primero, `deja en Pingo la pose...`,
       puede caer por asercion (`[]` frente a la lista, porque
       `welcome-pingo` ya existe desde T5 sin hijos): tasks.md dice
       «todos por consulta» y aqui se acepta cualquiera de las dos.
  grep -qE '^Tests: +4 failed, 43 passed, 47 total$' /tmp/153-r6.txt \
    && test "$(grep -cF 'Unable to find an element with testID: welcome-pingo-' /tmp/153-r6.txt)" -ge 3 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r6.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R6 red pingo pose and blink layer'

T6 verde (dentro de `welcome-pingo`: `welcome-pingo-wave` y `welcome-pingo-blink` con su hijo; `pingoBlink = useSharedValue(0)` y `blinkStyle` como dice R11, sin animarlo):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g6.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +47 passed, 47 total$' /tmp/153-g6.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
    && git commit -m 'feat(mobile-welcome): #153 R6 pingo pose and blink layer'

-- T7 R7: el labio del CTA primario --

T7 rojo (C7 + describe `#153 R7: el CTA primario tiene cuerpo`, 2 it; `deja el CTA secundario sin labio` nace verde):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r7.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 47 passed, 49 total`, los dos por asercion
  grep -qE '^Tests: +2 failed, 47 passed, 49 total$' /tmp/153-r7.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r7.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R7 red primary cta lip'

T7 verde (className exacta de R7 en `welcome-get-started`):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g7.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +49 passed, 49 total$' /tmp/153-g7.txt \
    && test "$(grep -cF 'border-b-4' src/screens/welcome/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
    && git commit -m 'feat(mobile-welcome): #153 R7 primary cta lip'

-- T8 R8: la entrada con las constantes de motion.ts --

T8 rojo (C8: borra el describe `R10` de #118 entero (4 it) y quita
`WELCOME_ENTRANCE_MS` y `WELCOME_ENTRANCE_EASING` del import de './index';
anade el describe `#153 R8: el contenido entra con las constantes de motion.ts`, 5 it;
y el doble de withRepeat):
  Doble: en el factory de jest.mock('react-native-reanimated', ...) que ya
  existe, anade `withRepeat: jest.fn((animation: unknown) => animation),`
  y ningun otro doble. Despues de los imports, a nivel de fichero:
  `const mockWithRepeat = jest.mocked(withRepeat);`, con `withRepeat`
  importado por nombre de 'react-native-reanimated'.
  `exporta solo la pantalla` usa `require('./index')`: declara la firma
  como hace src/theme/__tests__/motion.test.ts:
  `declare function require(moduleName: './index'): Record<string, unknown>;`
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r8.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 47 passed, 50 total`, por asercion:
       `exporta solo la pantalla`, `usa el fundido y el muelle de
       motion.ts` y `arranca invisible y desplazado 12 puntos sin reduce
       motion` (hoy son 16)
  grep -qE '^Tests: +3 failed, 47 passed, 50 total$' /tmp/153-r8.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r8.txt \
    && test "$(grep -cF "describe('R10', () => {" src/screens/welcome/index.test.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R8 red entrance from motion.ts'

T8 verde (sigue R8; borra WELCOME_ENTRANCE_MS y WELCOME_ENTRANCE_EASING y el import de `Easing`, que ya no se usa):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g8.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +50 passed, 50 total$' /tmp/153-g8.txt \
    && test "$(grep -cF 'WELCOME_ENTRANCE_' src/screens/welcome/index.tsx)" = 0 \
    && test "$(grep -cw Easing src/screens/welcome/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
    && git commit -m 'feat(mobile-welcome): #153 R8 entrance from motion.ts'

-- T8b E1: la carta retira WELCOME_ENTRANCE_MS --

T8b rojo (describe `#153 E1: la carta retira WELCOME_ENTRANCE_MS de la migración pendiente`,
it `deja en la lista solo las cinco constantes pendientes`, con el recorte
literal de requirements.md §Enmienda E1 y el bloque como array de cinco
literales con comillas simples unido con `.join('\n')`):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-re1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 50 passed, 51 total`, por el toContain
  grep -qE '^Tests: +1 failed, 50 passed, 51 total$' /tmp/153-re1.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-re1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 E1 red charter retires WELCOME_ENTRANCE_MS'

T8b verde (en docs/ui-guidelines.md, sustituye el parrafo de A21 (cuatro
lineas, de `Las constantes anteriores a #152 (` a `fuera del alcance de
esta.`) por el bloque literal de E1. Nada mas de `## Enmienda #152`):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-ge1.txt 2>&1; echo "exit=$?"
  <comando CARTA> > /tmp/153-ge1-carta.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +51 passed, 51 total$' /tmp/153-ge1.txt \
    && grep -qE '^Tests: +219 passed, 219 total$' /tmp/153-ge1-carta.txt \
    && test "$(grep -cF 'Las constantes anteriores a #152 (' ../docs/ui-guidelines.md)" = 1 \
    && test "$(grep -cF '`WELCOME_ENTRANCE_MS`, `BAR_ENTRY_*`, `METRIC_TAB_SPRING` y' ../docs/ui-guidelines.md)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add ../docs/ui-guidelines.md \
    && test "$(git diff --cached --name-only)" = 'docs/ui-guidelines.md' \
    && git commit -m 'feat(mobile-welcome): #153 E1 charter retires WELCOME_ENTRANCE_MS'
  (219 = 216 de la base + 3 de #153 R4 en motion.test.ts. Los it de
  `#152 R2` de motion.test.ts leen esa seccion y siguen verdes.)

-- T9 R9: el muelle de escala --

T9 rojo (describe `#153 R9: Pingo entra con un muelle de escala`, 4 it):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r9.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 51 passed, 55 total`, los cuatro
       por asercion (`welcome-pingo` aun no tiene transform y la fuente no
       tiene `pingoScale`)
  grep -qE '^Tests: +4 failed, 51 passed, 55 total$' /tmp/153-r9.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r9.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R9 red pingo entrance scale'

T9 verde (`pingoScale`, `pingoStyle` y `pingoFloatY = useSharedValue(0)` sin animar; estilo de `welcome-pingo` a `[pingoStyle, { width: 200, height: 200 }]`):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g9.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +55 passed, 55 total$' /tmp/153-g9.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
    && git commit -m 'feat(mobile-welcome): #153 R9 pingo entrance scale'

-- T10 R10: la flotacion --

T10 rojo (describe `#153 R10: Pingo flota en bucle`, 4 it; `con reduce motion no flota` nace verde):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r10.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 56 passed, 59 total`, por asercion
  grep -qE '^Tests: +3 failed, 56 passed, 59 total$' /tmp/153-r10.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r10.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R10 red pingo idle float'

T10 verde (la flotacion de R10 en el efecto de montaje, solo sin reduce motion):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g10.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +59 passed, 59 total$' /tmp/153-g10.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
    && git commit -m 'feat(mobile-welcome): #153 R10 pingo idle float'

-- T11 R11: el parpadeo --

T11 rojo (describe `#153 R11: Pingo parpadea cada cuatro segundos`, 4 it; `con reduce motion no parpadea` nace verde):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-r11.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 60 passed, 63 total`, por asercion
       (el primero, en el control de 4100 ms)
  grep -qE '^Tests: +3 failed, 60 passed, 63 total$' /tmp/153-r11.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/153-r11.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R11 red pingo blink'

T11 verde (el parpadeo de R11 en el mismo efecto que la flotacion, solo sin reduce motion):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g11.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +63 passed, 63 total$' /tmp/153-g11.txt \
    && test "$(grep -cF 'cancelAnimation' src/screens/welcome/index.tsx)" = 0 \
    && test "$(grep -cF 'return () =>' src/screens/welcome/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' \
    && git commit -m 'feat(mobile-welcome): #153 R11 pingo blink'

-- T12 R12 y T13 R13: candados que nacen verdes --

T12 (describe `#153 R12: la parada de los bucles la hace Reanimated`, it `no cancela a mano ni devuelve limpieza`):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g12.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       64 passed, 64 total`. Si nace rojo, una
       tarea anterior metio `cancelAnimation` o un `return () =>`: PARA.
  grep -qE '^Tests: +64 passed, 64 total$' /tmp/153-g12.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R12 lock no manual loop cleanup'

T13 (describe `#153 R13: Pingo no trae dependencias nuevas`, it `no declara Lottie, Rive ni expo-linear-gradient`):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/153-g13.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       65 passed, 65 total`
  grep -qE '^Tests: +65 passed, 65 total$' /tmp/153-g13.txt \
    && test -z "$(git diff --stat <H0> -- package.json bun.lock)" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' \
    && git commit -m 'test(mobile-welcome): #153 R13 lock no new animation deps'

== CIERRE ==

Desde mobile-pet-tracker/, sin pipe, con salida al impl:
- Los siete ficheros de tasks.md T13 (3):
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx src/theme/__tests__/motion.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/153-seven.txt 2>&1; echo "exit=$?"
    -> exit=0, `Test Suites: 7 passed, 7 total` y `Tests:       275 passed, 275 total`
       (reparto: welcome 65, motion 12, language-provider 24,
       ui-language 30, design-drift 62, consistency 55, legibility 27)
- El comando CARTA otra vez -> exit=0 y `Tests:       219 passed, 219 total`.
- `pgrep -af '[i]nit\.sh'` vacio; despues
  `FORCE_COLOR=0 bunx jest > /tmp/153-all.txt 2>&1; echo "exit=$?"` -> exit=0.
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y `bun run lint; echo "exit=$?"` -> exit=0.
- `git diff --stat <H0> -- package.json bun.lock app.json src/components src/theme/global.css`
  -> vacio. Esta spec no anade dependencias ni toca Card ni tokens.
Desde la raiz del repo:
- Las anclas A1-A23, G1-G11 y H1-H24 con sus valores de cierre, y P1-P8.
- `git diff --stat <H0> -- backend-pet-tracker/ infra-pet-tracker/`   -> vacio
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 10 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-welcome-pingo/traceability.md, solo la
columna de commits (hash + mensaje de rojo y verde por fila; R1 cita el
rojo y el verde de T4 y el rojo y el verde de T5; R5 los de T5; E1 los de
T8b; R12 y R13 su unico commit; la fila R14 se queda
`pendiente (lo firma el humano)`). No toques su frontmatter. Termina el
impl con la linea `R14: pendiente del smoke humano`. Commit final, desde
la raiz:
  git add specs/mobile-welcome-pingo/traceability.md progress/impl_mobile-welcome-pingo.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-welcome-pingo.md specs/mobile-welcome-pingo/traceability.md ' \
    && git commit -m 'docs(mobile-welcome-pingo): #153 traceability'
Y la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-welcome-pingo.md' ':!specs/mobile-welcome-pingo/requirements.md' ':!specs/mobile-welcome-pingo/design.md' ':!specs/mobile-welcome-pingo/tasks.md' ':!progress/review_mobile-welcome-pingo.md'
    -> exactamente los 14 ficheros de abajo
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex, cero
  `StyleSheet.create`, cero clases arbitrarias (`border-black/25` no
  lleva corchetes y es valida), cero `style` salvo los numericos de R5,
  R6 y R9 y los animados. Las clases son literales completos, nunca
  compuestas. Ni token nuevo, ni `View` extra, ni `CONTINUOUS_CORNER` en
  la pantalla: la escena y el bocadillo son el `Card` compartido.
- Skills: carga `building-native-ui` (tu plugin expo) y, de .agents/skills/
  del repo, `appllama-app-design-skill` (OBLIGATORIA: cambias una
  pantalla; ver docs/ui-guidelines.md §Skills y sus tres limites),
  `animate-expo`, `animation-vocabulary`, `review-animations` y
  `emil-design-eng`. Tu plugin expo no trae ninguna de animacion: las
  decisiones de movimiento ya estan cerradas en la spec y mandan sobre
  cualquier skill. Descartado: Lottie, Rive, `expo-linear-gradient`, los
  presets de Reanimated (`FadeIn`, `ZoomIn`...), `cancelAnimation` o una
  limpieza a mano (R12), y hex, `StyleSheet.create` o clases arbitrarias.
  Di en el impl cuales cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas sobre
  el arbol renderizado. Se espera a un texto o nodo visible (`findByTestId`,
  `waitFor` sobre `getByTestId(...)`/`getByText`), NUNCA al contador de un
  mock. `mockWithRepeat.mock.calls` se lee DESPUES de renderizar y de
  que el nodo exista, como asercion, nunca como espera. Una ausencia se
  ancla siempre a un nodo positivo presente en el mismo render. En RNTL 14
  `toHaveTextContent` compara el texto entero: literal completo del
  catalogo, nunca un fragmento.
- Movimiento (requirements.md §Como se prueba el movimiento): timers
  falsos en `beforeEach`/`afterEach` y `await act(async () => {
  jest.advanceTimersByTime(ms); })`; las ventanas son las de la spec (1000,
  2000, 3900/4100/4300, 5000). Si un test necesita mas margen, se amplia
  la ventana y NUNCA la asercion. `toHaveAnimatedStyle` SIEMPRE con
  `{ shouldMatchAllProps: true }`. Todo test que ponga
  `mockUseReducedMotion` a `true` lo deja a `false` al terminar (el
  `beforeEach` global ya lo resetea; no lo quites).
- Valores esperados LITERALES en los tests (`0.9`, `1200`, `[-1, true]`,
  las clases, el copy), nunca el simbolo importado de produccion. Las
  expresiones sobre la fuente se escriben tal cual las da requirements.md
  y se cuentan con `(source.match(re) ?? []).length`.
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error y tumbaria la cadena). Reutiliza lo que ya
  hay en la cabecera del test de la bienvenida (`readFileSync`, `join`,
  `sourceRoot`, `readSource`, `renderWelcome`, `mockUseReducedMotion`, el
  mock de reanimated con `__esModule: true`): no lo dupliques. Ningun
  test nuevo usa `StyleSheet.flatten`; el que ya existe (C6) se queda.
- design-drift recorre tambien el test de la bienvenida (G9, G10):
  ninguna cadena nueva lleva un guion pegado a `[`. Si hiciera falta una
  clase de caracteres tras un guion, escribela con `\-` o reordenala.
- docs/ui-guidelines.md: el bloque del punto 7 (T1) y el de E1 (T8b) se
  copian de requirements.md byte a byte, con sus saltos de linea. No
  toques §Animacion ni nada mas de `## Enmienda #152`.
- Comentarios: toda cita a la feature en index.tsx y motion.ts se escribe
  `#153 R<n>` (un `#153` suelto lo caza el guard de hex).
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo. En particular, NO:
  src/components/ (card.tsx incluido), src/theme/global.css,
  assets/images/splash-icon.png (lo siguen usando src/app/index.tsx y el
  splash), src/app/welcome.tsx, ni ninguna otra pose de
  /home/claude/pet-tracker-mascot/.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter y las casillas de
  §Aprobacion de requirements.md (incluida la del smoke R14) y la casilla
  de la Enmienda E1. Los escribe el leader o el humano. Todo lo que
  tengas que contar va en progress/impl_mobile-welcome-pingo.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (14, ni uno mas):
  docs/ui-guidelines.md
  mobile-pet-tracker/assets/images/pingo-wave-blink.webp
  mobile-pet-tracker/assets/images/pingo-wave.webp
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/screens/welcome/index.test.tsx
  mobile-pet-tracker/src/screens/welcome/index.tsx
  mobile-pet-tracker/src/theme/__tests__/motion.test.ts
  mobile-pet-tracker/src/theme/motion.ts
  progress/impl_mobile-welcome-pingo.md
  specs/mobile-ui-language/design.md
  specs/mobile-welcome-pingo/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R13 y E1 de requirements.md. La prueba de
humo de R14 (dev build de Android) es del humano: no la marques.

Al terminar, progress/impl_mobile-welcome-pingo.md debe tener: pwd,
branch, H0 y status; el exit de is-ancestor; node_modules (presente o
instalado); skills cargadas; la salida de las 58 anclas (A1-A23, G1-G11,
H1-H24) en H0 y la de cierre, mas P1-P8; la base con su exit (los siete
ficheros y el comando CARTA); los 27 commits con hash y R-id; por cada
rojo, el comando, la linea `Tests:`, el exit y cada it rojo con su
matcher y Expected/Received, la consulta o el ENOENT que fallo; en T2 y
T4, los `error TS` del log; cada verde con sus lineas `Tests:`,
typecheck y lint; el cierre (los siete ficheros con 275, CARTA con 219,
jest entero con exit, typecheck, lint, diffs vacios, lista cerrada); la
linea `R14: pendiente del smoke humano`; y cualquier decision que la
spec no cerrara literalmente.
```
