# Ronda 4 de Codex CLI — #171 mobile-celebrations-and-living-empty (Enmienda E4: la celebración como el canvas)

> Pega el bloque de abajo en una sesión NUEVA de Codex. La ronda 3 quedó
> aprobada. El humano decidió que el diseño final debe quedar como el
> canvas aprobado, y la Enmienda E4 lo concreta para la celebración. La
> firmó vía Notion el 2026-10-14 (commit 0268e9bd). Trae:
>
> - 36 piezas de confeti en bucle, con su tabla literal y cinco tokens
>   `--color-confetti-*`;
> - la maquetación del artboard, con el check en SVG y `text-15`;
> - el pop por keyframes en lugar del muelle;
> - el anillo de ping, la flotación de Pingo y la entrada escalonada del
>   texto;
> - reduce motion, que apaga todo lo anterior;
> - la cancelación de los 39 bucles al desmontar;
> - el candado de posición de §2.27 y la carta.
>
> **Esta ronda cambia el reparto.** Los tests y la carta llegan como
> parches del leader (`progress/ronda4_mobile-celebrations-and-living-empty/cNN.patch`):
> los aplicas, no los escribes. La producción la escribes TÚ, en los
> commits verdes, a partir de E4.1–E4.11: el handoff fija el alcance de
> cada verde, no el código.
>
> El leader ejecutó la ronda entera en un clon de simulación con su propia
> producción de referencia. Cada «->» de abajo es un valor medido allí:
> recuentos de jest, las listas de `●`, los hashes de los ficheros que
> llegan por parche, tsc, lint y sondas. Los ficheros de producción no
> llevan hash, porque tu código no tiene por qué coincidir con el del
> leader; lo que tiene que coincidir es lo que miden los tests. El smoke
> R16 sigue siendo del humano.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-171   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch: feature/171-mobile-celebrations-and-living-empty
NO lances ./init.sh, ni entero ni en parte: lo corre el leader al final
(comparte Postgres y LocalStack con otras sesiones). Tampoco push, PR,
merge, rebase, --amend ni git reset.

Ronda 4 de #171. Antes de nada, literal:
  cd /home/claude/sites/Pet-Tracker-wt-171 && pwd
  -> /home/claude/sites/Pet-Tracker-wt-171
  git branch --show-current   -> feature/171-mobile-celebrations-and-living-empty
  git rev-parse HEAD          -> llamalo H1: es el commit de este handoff
  git log --oneline -4        -> H1, 0268e9bd, e56e7b4b, 9f2beafb, en ese orden
  git status --short          -> vacio
  git fetch origin && git rev-parse origin/main
    -> 788d1f896d2de11cde7a6ab5e1fbf1bb548b620f. Si sale OTRO hash, PARA:
       main se ha movido y el leader tiene que volver a medir.
  git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"   -> exit=0
  git rev-parse HEAD:mobile-pet-tracker HEAD:docs HEAD:specs/mobile-ui-language
    -> d27a09c60c44bca7ea15a22807d81c243c0dfb51
       ae2d6b497ae1b114ac757cba665048aaf26882ed
       3075171b76e407ef3c09b82c718b0f27bb7efb2c
  git ls-tree HEAD | awk '$4 != "progress"' | git hash-object --stdin
    -> eff43d610babbe75490fad886e2010bf106ac5d0
Pega las salidas en una seccion nueva, `## Ronda 4`, AL FINAL de
progress/impl_mobile-celebrations-and-living-empty.md (es un fichero
trackeado: no lo stagees hasta c64). Si algo no cuadra, PARA.

Lee primero, enteros:
- specs/mobile-celebrations-and-living-empty/requirements.md,
  §Enmienda E4 (E4.1-E4.14). Es lo que implementas;
- specs/mobile-celebrations-and-living-empty/tasks.md, §E4 (E4-A a E4-E);
- los parches de los commits rojos (c45, c47, c49, c51, c53, c55, c57 y
  c59). Son los tests que tu produccion tiene que poner en verde.

Skills: carga `building-native-ui` (de tu plugin expo) y `animate-expo`
(del repo, `.agents/skills/animate-expo/`; tu plugin no trae ninguna de
animacion) y di en el impl que las cargaste. La spec manda sobre
cualquier skill.

Quien escribe que:
- Tests, la carta (docs/ui-guidelines.md) y el commit c44 llegan SOLO por
  parche. Nunca los edites a mano: ni para que un verde pase, ni para
  arreglar un hash.
- La produccion la escribes tu, SOLO en los commits verdes (c46, c48,
  c50, c52, c54, c56, c58 y c60). Son cuatro ficheros:
  src/components/celebration.tsx, src/theme/motion.ts,
  src/theme/global.css y src/utils/category-palette.ts. Cada verde dice
  cuales toca; la cadena exige exactamente esos.
- Alcance MINIMO por verde: lo que su rojo pide y nada de lo que piden los
  rojos siguientes. Si adelantas trabajo, el rojo siguiente nace con menos
  `●` de los esperados y su cadena para. Hay tres trampas conocidas: el
  anillo condicionado a reduce motion antes de c58, los valores iniciales
  de la entrada dependientes de reduce motion antes de c58, y
  `cancelAnimation` antes de c60.
- Puedes iterar tu produccion en un verde hasta que su medida salga como
  dice el handoff. Anota en el impl cuantos intentos te llevo y los `●`
  intermedios. Si no lo consigues sin tocar un test, PARA y reporta el
  `●` con su Expected/Received.

== BASE ==

Todo desde mobile-pet-tracker/, salvo lo que diga «desde la raiz»:
  cd /home/claude/sites/Pet-Tracker-wt-171/mobile-pet-tracker && pwd
  -> /home/claude/sites/Pet-Tracker-wt-171/mobile-pet-tracker

Error de invocacion: si un comando falla ANTES de que arranquen jest,
tsc, eslint, sed, git o python (`No such file or directory`, `command not
found`, un `pwd` distinto del esperado) y no has tocado ningun fichero,
NO es una parada: haz el `cd` literal, repite el comando y anotalo en el
impl. Cualquier otro fallo si es una parada.

- `test -d node_modules && echo presente` -> presente
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0. Va en
  cada cadena. Si un dia da 1, PARA y pide al humano que lo borre. Nunca
  `rm -f` (tu sandbox lo deniega).

Ficheros (en los comandos van enteros):
  Tests y carta, por parche:
    DD = src/__tests__/design-drift.test.ts
    CC = src/__tests__/consistency-classnames.test.ts
    CT = src/components/__tests__/celebration.test.tsx
    GC = src/theme/__tests__/global-css.test.ts
    MT = src/theme/__tests__/motion.test.ts
    THC = src/__tests__/tab-headers-canvas.test.ts
    PA = src/screens/pairing/index.test.tsx
    UG = ../docs/ui-guidelines.md
  Solo se miden: WE = src/screens/welcome/index.test.tsx (lee la carta)
  Produccion, tuya:
    CE = src/components/celebration.tsx
    MO = src/theme/motion.ts
    GL = src/theme/global.css
    CP = src/utils/category-palette.ts

Medida base, un solo jest con los siete ficheros de test:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts src/__tests__/tab-headers-canvas.test.ts src/screens/pairing/index.test.tsx src/screens/welcome/index.test.tsx > /tmp/171-r4-base.txt 2>&1; echo "exit=$?"
  -> exit=0, `Test Suites: 7 passed, 7 total` y
     `Tests:       343 passed, 343 total`. Si no, PARA.

Comando GUARDAS (candados de carta; 101 `it` en TODA la ronda):
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/171-cN-guardas.txt 2>&1`.

Espera antes de cada ALL (otros worktrees corren jest e init.sh en la
misma maquina de 4 CPU; esto los espera a todos, hasta 90 minutos). Va
en su PROPIO comando, sin nada mas en la misma linea:
  W=0; while pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh' > /dev/null; do W=$((W+1)); test $W -le 90 || break; sleep 60; done; echo "espera=$W"
  -> espera=N con N <= 90. Con espera=91, PARA. No escribas el nombre
     del script de arranque en esa linea: pgrep se encontraria a si mismo.

Comando ALL (justo despues de la espera, y sin lanzar nada mas mientras
corre). Solo en los verdes (c46, c48, c50, c52, c54, c56, c58, c60 y
c63); en los rojos y en c44, c61 y c62 no se corre:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-cN-all.txt 2>&1; echo "exit=$?"
  ALL de H1 (cierre de la ronda 3): `Test Suites: 104 passed, 104 total`
  y `Tests:       3187 passed, 3187 total`. No lo repitas en la base.

<LIMPIO> (desde mobile-pet-tracker/; el impl vive en progress/ y queda
fuera a proposito):
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
NUNCA `git status --short` tras un `git add`: lo stageado sale.

Typecheck y lint, en TODAS las cadenas:
  bun run typecheck
  bunx expo lint --no-cache > /tmp/171-cN-lint.txt 2>&1 && test ! -s /tmp/171-cN-lint.txt
Nunca `bun run lint`. Si el log del lint dice `Failed to run "eslint"
due to signal SIGKILL` (falta de memoria por otras sesiones; expo lint
sale con 0 aun asi), no es un rojo del codigo: haz la espera de arriba,
espera 60 s mas y relanza la cadena entera. Como mucho dos reintentos;
al tercer SIGKILL, PARA. No pases prettier (movil no lo usa).

Parches: se aplican desde mobile-pet-tracker/ con `git -C ..` (sus rutas
son relativas a la raiz). Siempre `--check` primero y luego el `apply`,
encadenados. Nunca `--3way`, `--reject`, `patch` ni ediciones a mano. Si
el `--check` falla o el hash del fichero resultante no cuadra,
`git checkout HEAD -- <fichero>` y PARA.

== ANCLAS ==

Ejecutalas TODAS antes de tocar nada y copia la salida al impl. A desde
mobile-pet-tracker/, K desde la raiz. Solo estos comandos son anclas;
los numeros de linea no lo son. Si alguna no da EXACTAMENTE lo esperado,
PARA. Cuando `grep -c` cuenta 0 sale con codigo 1: vale la cifra
impresa. El leader las ejecuto todas en H1 sacandolas de este fichero.

A1. git hash-object src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts src/__tests__/tab-headers-canvas.test.ts src/screens/pairing/index.test.tsx ../docs/ui-guidelines.md
    -> e6c8c06bf7bec18f83c7e06f61ae080a63474e0a
       ef41e8707ffb76b8e78c96a539eee44e214c5c9f
       d287e3b383dd8cd81db60590627192dfea74a62c
       f627fe3ac031a042a7a727237f5f048042a494b0
       e2130ee6bdd3cd304d846d6ff75092a0da343691
       eb6db235a507193dcc28aeec35393152da544362
       156a465a80e747afc0c177ed9c81e0d86c87692d
       e8fa5e5f9a28fac11c4260266dfc56b42ff0c0d6
A2. grep -cF 'CONFETTI_FILLS' src/utils/category-palette.ts src/components/celebration.tsx   -> category-palette.ts :1, celebration.tsx :2
A3. grep -cE 'MOTION_CONFETTI_(MIN|SPREAD)_MS|MOTION_CELEBRATION_SPRING' src/theme/motion.ts src/components/celebration.tsx   -> motion.ts :3, celebration.tsx :5
A4. grep -cF 'MOTION_PINGO_FLOAT_' src/theme/motion.ts   -> 0
A5. grep -cxF '  --text-15: 15px;' src/theme/global.css   -> 0
A6. grep -cF -- '--color-confetti-' src/theme/global.css   -> 0
A7. grep -cE 'withRepeat|withSequence|cancelAnimation' src/components/celebration.tsx   -> 0
A8. grep -cxF 'export const MOTION_PING_FROM = 0.55;' src/theme/motion.ts   -> 1
A9. grep -cxF 'export const MOTION_PING_TO_SCALE = 1.5;' src/theme/motion.ts   -> 1
A10. grep -cF '"react-native-svg": "15.15.4"' package.json   -> 1
A11. grep -cF 'export function useThemeColors' src/theme/use-theme-colors.ts   -> 1
A12. grep -rlF 'rounded-xs' src --include=*.tsx --include=*.ts | LC_ALL=C sort | tr '\n' ' '; echo   -> linea vacia
Desde la raiz:
K1. grep -cF -- '- [x] Enmienda E4 aprobada por humano (fecha: 2026-10-14)' specs/mobile-celebrations-and-living-empty/requirements.md   -> 1
K2. grep -cF -- '- [x] Texto de la carta de E4.13 aprobado por humano (R15) (fecha: 2026-10-14)' specs/mobile-celebrations-and-living-empty/requirements.md   -> 1
K3. grep -cF -- '- [ ] R16: smoke en dev build de Android completado por humano (fecha: ____)' specs/mobile-celebrations-and-living-empty/requirements.md   -> 1
K4. grep -cF '(E4)' specs/mobile-celebrations-and-living-empty/traceability.md   -> 0
K5. grep -cF '| pendiente |' specs/mobile-celebrations-and-living-empty/traceability.md   -> 6
K6. git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"   -> exit=0
K7. grep -cE '^### §2\.2[3-7] ' specs/mobile-ui-language/design.md   -> 5
K8. git hash-object specs/mobile-ui-language/design.md   -> 9a4e61aa084a4066ed148d476d83386f52b0afec
K9. git hash-object progress/ronda4_mobile-celebrations-and-living-empty/c*.patch
    -> ca4ac4eee73b981dfb6b1bd6a89d653f70b848df
       0d302fbc6591a2746f796ef93731b1ccc24674b1
       b520fd2205cba71ac8f9dee2ad3829f5bd23610b
       b773f8be6276de60cae55a5a5ad02f61c4fda38c
       876278ab879a2d8b2285f92b9c6a4aceff1c1665
       a6de4997da51207f14b4f836d5b3e03ddcb85108
       cda6b081de34493d07a2253df4aa704e17b20e42
       b214ab7abe44b2931204405745a1011c8fe1eb74
       522315a7b603c9d5551af2ed8cc5671863acd9f7
       27327d8a4ab18adf2b05a1d73825bd2426ddf8d3
       af4d9fb10c43a7dc24c38a4aceea3520e16206ad
       9b0c027cb6599935a043efe054084effb1e6f68c
K10. git diff --quiet origin/main HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock; echo "deps=$?"   -> deps=0

Valores al cerrar (tras P12; medidos por el leader en la simulacion):
A1 1749cb0ce76d3697898859dc90f1bdf665fc4c13, 2e588c6545625aac41d387f4c05b9868a0f4336c, 787c8b45d3e39c21cd933a8b0ca1b7b00349ace3, 67455d441f3554df003f9e6b3ae0fbe8b01587c8, 7a38a622829773aaa3d24616cf99a4c34b9ef2a2, f96029ffe1f270f431ed6bbe99a8a1196439423a, 10b20fa52880a35fa842740b381afa38171a5a45, aba25a00911cc5708346551662fef2e411beb144 (en ese orden); A2 category-palette.ts :0, celebration.tsx :0; A3 motion.ts :0, celebration.tsx :0; A4 2; A5 1; A6 5; A7 no se compara (depende de tu produccion): copia la cifra; A8 1; A9 1; A10 1; A11 1; A12 `src/__tests__/consistency-classnames.test.ts src/components/__tests__/celebration.test.tsx src/components/celebration.tsx `; K1 1, K2 1, K3 1, K4 0 y K5 6 (la trazabilidad llega en c64), K6 exit=0, K7 5, K8 el mismo hash, K9 los mismos doce, K10 deps=0. Si alguno no cuadra, PARA.

== COMMITS ==

Cada commit va ENCADENADO con && a su verificacion: si un eslabon falla,
el commit no se hace. Si una cadena no llega al commit, PARA y reporta en
el impl el eslabon y su salida. Las lineas `# -- ... --` son cabeceras
(comentarios). Cada cadena empieza en su primera linea de comando y
TERMINA en su linea `git commit -m '...'`, seguida de una linea en
blanco; lo que va despues es prosa para ti y no se ejecuta.

Mide SIN pipe. Cada medida lleva su `echo "exit=$?"`; anota el exit en el
impl. Antes de cada cadena corres, en este orden: (1) la edicion (el
parche con su hash, o tu produccion), (2) la medida, (3)
`<GUARDAS> > /tmp/171-cN-guardas.txt 2>&1; echo "exit=$?"` y, solo en
los verdes, (4) la espera y (5) el ALL. La cadena comprueba las salidas.

En los rojos la cadena compara la lista ENTERA de `●`, ordenada con
`LC_ALL=C sort` (con varios ficheros, jest no fija el orden). Si un rojo
sale con otra lista de `●`, o con otro recuento de `Unable to find`, NO
ajustes nada: anota los `●`, su Expected/Received y PARA. En los verdes,
si la medida sale roja, corrige tu produccion y vuelve a medir (ver
«Quien escribe que»).

# -- c44 E4.10 R13: design-drift deja de prohibir los bucles (nace verde) --

Edicion de c44 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c44.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c44.patch; echo "exit=$?"   -> exit=0
  git hash-object src/__tests__/design-drift.test.ts
    -> 1749cb0ce76d3697898859dc90f1bdf665fc4c13
Medida:
  <GUARDAS> > /tmp/171-c44-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       101 passed, 101 total` (es la medida de c44)
Cadena:
  grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c44-guardas.txt \
    && test "$(git hash-object src/__tests__/design-drift.test.ts | tr '\n' ' ')" = '1749cb0ce76d3697898859dc90f1bdf665fc4c13 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c44-lint.txt 2>&1 && test ! -s /tmp/171-c44-lint.txt \
    && git add src/__tests__/design-drift.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '2 2' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): design-drift deja de prohibir los bucles de la celebración (R13, E4)'

  Nace verde: celebration.tsx todavia no usa `withRepeat` ni
  `withSequence`. Va antes que todo porque, sin el, el confeti de c46
  pondria GUARDAS en rojo.

# -- c45 E4.1 y E4.2 R6: 36 piezas en bucle y sus tokens (rojo) --

Edicion de c45 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c45.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c45.patch; echo "exit=$?"   -> exit=0
  git hash-object src/__tests__/consistency-classnames.test.ts src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts
    -> 2e588c6545625aac41d387f4c05b9868a0f4336c
       39be13facb94453ac52092f80ea59f0e7899b3ac
       e13a55f276195614771fe6d50553758a90ee612c
       36e34e9aa655f30bbecc21fa88b2e2612eca2b3e
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts > /tmp/171-c45.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       11 failed, 180 passed, 191 total`
  <GUARDAS> > /tmp/171-c45-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +11 failed, 180 passed, 191 total$' /tmp/171-c45.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c45.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más|  ● #171 E4: tokens de la celebración › #171 E4: @theme declara los cinco colores del confeti|  ● #171 R6: confeti › R6.1 pinta 36 piezas con la clase de su fila|  ● #171 R6: confeti › R6.2 cada pieza empieza arriba y transparente, en su posición|  ● #171 R6: confeti › R6.3 la pieza 9 sigue arriba y transparente a los 1390 ms|  ● #171 R6: confeti › R6.4 la pieza 21 vuelve a caer desde arriba tras terminar|  ● #171 R6: confeti › R6.5 a los 1500 ms cada pieza sigue su retardo, su duración y su curva|  ● #171 R6: confeti › R6.6 a los 13830 ms las 36 piezas siguen en vuelo|  ● #62 R4: la app solo usa los radios de la escala declarada › reserva rounded-xs al confeti de la celebración|  ● #62 R4: la app solo usa los radios de la escala declarada › solo la celebración nombra los colores del confeti|  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › centraliza las diez clases completas y prohíbe interpolarlas|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c45.txt)" = 1 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c45.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c45-guardas.txt \
    && test "$(git hash-object src/__tests__/consistency-classnames.test.ts src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts | tr '\n' ' ')" = '2e588c6545625aac41d387f4c05b9868a0f4336c 39be13facb94453ac52092f80ea59f0e7899b3ac e13a55f276195614771fe6d50553758a90ee612c 36e34e9aa655f30bbecc21fa88b2e2612eca2b3e ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c45-lint.txt 2>&1 && test ! -s /tmp/171-c45-lint.txt \
    && git add src/__tests__/consistency-classnames.test.ts src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts src/theme/__tests__/motion.test.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/theme/__tests__/global-css.test.ts mobile-pet-tracker/src/theme/__tests__/motion.test.ts ' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ' | tr '\n' '|')" = '9 7|85 66|6 0|0 10|' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): 36 piezas de confeti en bucle con sus tokens (R6, E4)'

# -- c46 E4.1 y E4.2 R6: confeti (verde, produccion tuya) --

Alcance de c46 (E4.1, E4.2 y la parte de E4.11 que toca al confeti):
- celebration.tsx: borra `CONFETTI_COUNT`, `COLORS`, `SHAPES`, sus formulas
  y el import de `CONFETTI_FILLS`. Copia el bloque `const CONFETTI = [ ... ]
  as const;` de E4.1 TAL CUAL, a nivel de modulo, desde la linea
  `const CONFETTI = [` (en la columna 0) hasta `] as const;`. La cadena lo
  compara byte a byte con el de requirements.md, y la sonda P3 lo edita con
  un `sed`. Pinta las 36 piezas como piden R6.1-R6.3: `{id}-confetti-<i>`,
  un unico `View` hijo con la `className` de su fila, el estilo inicial de
  R6.2 y el progreso
  `withDelay(retardo, withRepeat(withTiming(1, { ...MOTION_CONFETTI_FALL_TIMING, duration }), -1, false))`.
  El mapeo de opacidad, `translateY` y `rotate` no cambia (R6.3).
- global.css: los cinco `--color-confetti-*` de E4.2, una linea cada uno,
  dentro del bloque `@theme {` (no en `@theme inline`).
- motion.ts: borra `MOTION_CONFETTI_MIN_MS` y `MOTION_CONFETTI_SPREAD_MS`,
  cada una con su comentario `// #171 R6`. `MOTION_CONFETTI_FALL_TIMING` se
  queda.
- category-palette.ts: borra `CONFETTI_FILLS` y su comentario.
- Todavia NO: la maquetacion (c48), el pop (c50) ni nada de lo que piden
  los rojos siguientes.
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/global-css.test.ts > /tmp/171-c46.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       191 passed, 191 total`
  <GUARDAS> > /tmp/171-c46-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c46-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +191 passed, 191 total$' /tmp/171-c46.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c46-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c46-all.txt \
    && grep -qE '^Tests: +3188 passed, 3188 total$' /tmp/171-c46-all.txt \
    && test "$(sed -n '/^const CONFETTI = \[$/,/^\] as const;$/p' ../specs/mobile-celebrations-and-living-empty/requirements.md)" = "$(sed -n '/^const CONFETTI = \[$/,/^\] as const;$/p' src/components/celebration.tsx)" \
    && test "$(grep -cF -- '--color-confetti-' src/theme/global.css)" = 5 \
    && test "$(grep -cF 'CONFETTI_FILLS' src/utils/category-palette.ts src/components/celebration.tsx | tr '\n' ' ')" = 'src/utils/category-palette.ts:0 src/components/celebration.tsx:0 ' \
    && ! grep -qF 'cancelAnimation' src/components/celebration.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c46-lint.txt 2>&1 && test ! -s /tmp/171-c46-lint.txt \
    && git add src/components/celebration.tsx src/theme/global.css src/theme/motion.ts src/utils/category-palette.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/theme/motion.ts mobile-pet-tracker/src/utils/category-palette.ts ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): 36 piezas de confeti en bucle con sus tokens (R6, E4)'

# -- c47 E4.7 R2.4 y R20: maquetacion, check en SVG y text-15 (rojo) --

Edicion de c47 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c47.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c47.patch; echo "exit=$?"   -> exit=0
  git hash-object src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts
    -> f96029ffe1f270f431ed6bbe99a8a1196439423a
       b481f2c75d98631f88bec6072b108d464dcf96b9
       67455d441f3554df003f9e6b3ae0fbe8b01587c8
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts src/__tests__/tab-headers-canvas.test.ts > /tmp/171-c47.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       16 failed, 99 passed, 115 total`
  <GUARDAS> > /tmp/171-c47-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +16 failed, 99 passed, 115 total$' /tmp/171-c47.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c47.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #168 R1: el título grande vive en las tres pestañas › limita el literal a las tres pestañas y a la celebración|  ● #171 E4: tokens de la celebración › #171 E4: @theme declara text-15 de 15 px|  ● #171 R20: maquetación del artboard › R20.1 el hero mide 220 con margen superior y Pingo 170|  ● #171 R20: maquetación del artboard › R20.4 el título lleva el tracking y el margen del artboard|  ● #171 R20: maquetación del artboard › R20.5 el cuerpo mide 15 px con ancho máximo de 300|  ● #171 R20: maquetación del artboard › R20.6 la raíz separa 14 px y deja 40 abajo|  ● #171 R2: Celebration › R2.4 Pingo usa celebrate y la insignia contiene el check del artboard|  ● #171 R7: pop › R7.1 Pingo empieza transparente y a escala 0.6|  ● #171 R7: pop › R7.2 la insignia empieza transparente y a escala 0.6|  ● #171 R7: pop › R7.3 Pingo llega a opacidad y escala 1 a los 2000 ms|  ● #171 R7: pop › R7.3 la insignia llega a opacidad y escala 1 a los 2400 ms|  ● #171 R7: pop › R7.3 la insignia sigue en reposo a los 300 ms|  ● #171 R8: reduce motion › R8.2 Pingo conserva el fundido a los 2000 ms|  ● #171 R8: reduce motion › R8.2 Pingo empieza transparente a escala 1|  ● #171 R8: reduce motion › R8.3 la insignia conserva el fundido retardado a los 300 y 2400 ms|  ● #171 R8: reduce motion › R8.3 la insignia empieza transparente a escala 1|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c47.txt)" = 1 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c47.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c47-guardas.txt \
    && test "$(git hash-object src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts | tr '\n' ' ')" = 'f96029ffe1f270f431ed6bbe99a8a1196439423a b481f2c75d98631f88bec6072b108d464dcf96b9 67455d441f3554df003f9e6b3ae0fbe8b01587c8 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c47-lint.txt 2>&1 && test ! -s /tmp/171-c47-lint.txt \
    && git add src/__tests__/tab-headers-canvas.test.ts src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/theme/__tests__/global-css.test.ts ' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ' | tr '\n' '|')" = '2 1|54 11|4 0|' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): maquetación del artboard, check en SVG y text-15 (R2, R20, E4)'

# -- c48 E4.7 R2.4 y R20: maquetacion (verde, produccion tuya) --

Alcance de c48 (E4.7; R2.4 pasa a nombrar el check):
- celebration.tsx: R20.1 (hero con `className="mt-10 items-center
  justify-center"` y `style={{ width: 220, height: 220 }}`; `{id}-pingo` y
  `{id}-pose` de 170 x 170), R20.2 (insignia en `right: 18, bottom: 26`),
  R20.3 (el SVG literal de la spec, con
  `const [check] = useThemeColors(['accent-foreground'])` e imports de
  `react-native-svg` y `../theme/use-theme-colors`; el `Text` con el glifo
  sale), R20.4, R20.5 y R20.6 (`className` y `style` exactos).
- global.css: `  --text-15: 15px;` dentro de `@theme {` (#173 no ha
  mergeado: lo declara #171). Es una linea sola; la cadena la busca con
  `grep -cxF`.
- Todavia NO: el pop (sigue el muelle de E3), la entrada ni reduce motion.
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/global-css.test.ts src/__tests__/tab-headers-canvas.test.ts > /tmp/171-c48.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       115 passed, 115 total`
  <GUARDAS> > /tmp/171-c48-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c48-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +115 passed, 115 total$' /tmp/171-c48.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c48-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c48-all.txt \
    && grep -qE '^Tests: +3193 passed, 3193 total$' /tmp/171-c48-all.txt \
    && test "$(grep -cxF '  --text-15: 15px;' src/theme/global.css)" = 1 \
    && ! grep -qF 'cancelAnimation' src/components/celebration.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c48-lint.txt 2>&1 && test ! -s /tmp/171-c48-lint.txt \
    && git add src/components/celebration.tsx src/theme/global.css \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/global.css ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): maquetación del artboard, check en SVG y text-15 (R2, R20, E4)'

# -- c49 E4.3 R7: pop por keyframes (rojo) --

Edicion de c49 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c49.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c49.patch; echo "exit=$?"   -> exit=0
  git hash-object src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts
    -> deaefd6fa5894774dbc2334e41226b8feb334a4f
       a11b1ef2d4f62cd6f0b939f26b63de788f988752
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts > /tmp/171-c49.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       10 failed, 65 passed, 75 total`
  <GUARDAS> > /tmp/171-c49-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +10 failed, 65 passed, 75 total$' /tmp/171-c49.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c49.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más|  ● #171 E4: las constantes de la celebración viven en motion.ts › declara la curva ease-out de CSS|  ● #171 E4: las constantes de la celebración viven en motion.ts › declara los pops de Pingo y de la insignia|  ● #171 R7: pop › R7.1 Pingo empieza transparente y a escala 0.6|  ● #171 R7: pop › R7.4 Pingo baja de 1.08 a 1 entre los 420 y los 540 ms|  ● #171 R7: pop › R7.4 Pingo sigue el primer tramo del pop a los 0, 100, 200 y 300 ms|  ● #171 R7: pop › R7.4 la insignia baja de 1.08 a 1 entre los 800 y los 900 ms|  ● #171 R7: pop › R7.4 la insignia sigue el primer tramo del pop a los 450, 550 y 650 ms|  ● #171 R8: reduce motion › R8.2 Pingo conserva el fundido a los 2000 ms|  ● #171 R8: reduce motion › R8.2 Pingo empieza transparente a escala 1|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c49.txt)" = 0 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c49.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c49-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts | tr '\n' ' ')" = 'deaefd6fa5894774dbc2334e41226b8feb334a4f a11b1ef2d4f62cd6f0b939f26b63de788f988752 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c49-lint.txt 2>&1 && test ! -s /tmp/171-c49-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/theme/__tests__/motion.test.ts ' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ' | tr '\n' '|')" = '42 31|14 3|' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): pop por keyframes de Pingo y la insignia (R7, E4)'

# -- c50 E4.3 R7: pop por keyframes (verde, produccion tuya) --

Alcance de c50 (E4.3 y la parte de E4.11 que toca al pop):
- motion.ts: borra `MOTION_CELEBRATION_SPRING`. Bajo un comentario
  `// #171 R7`, las cinco primeras lineas del bloque de E4.11, literales:
  `MOTION_CELEBRATION_EASE_OUT`, `MOTION_CELEBRATION_POP_MS`,
  `MOTION_CELEBRATION_POP_PEAK`, `MOTION_CELEBRATION_BADGE_POP_MS` y
  `MOTION_CELEBRATION_BADGE_DELAY_MS`. Las demas llegan en su commit: la
  lista de `no exporta nada más` las cuenta. La linea de comentario
  `// Solo si #172 ...` del bloque NO se copia (ver REGLAS CRITICAS).
- celebration.tsx: R7.1 y R7.2 tal cual. El `transform` de Pingo pasa a
  `[{ translateY }, { scale }]`, donde `translateY` es un `useSharedValue(0)`
  que R18 animara en c54. Opacidad con `withTiming` y escala con
  `withSequence`, en los tramos de R7.1; la insignia igual, con
  `MOTION_CELEBRATION_BADGE_POP_MS` y `withDelay(MOTION_CELEBRATION_BADGE_DELAY_MS, ...)`.
  `withSpring` sale. La rama de reduce motion conserva los fundidos de R8.2
  y R8.3, a escala 1.
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts > /tmp/171-c50.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       75 passed, 75 total`
  <GUARDAS> > /tmp/171-c50-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c50-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +75 passed, 75 total$' /tmp/171-c50.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c50-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c50-all.txt \
    && grep -qE '^Tests: +3196 passed, 3196 total$' /tmp/171-c50-all.txt \
    && ! grep -qF 'cancelAnimation' src/components/celebration.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c50-lint.txt 2>&1 && test ! -s /tmp/171-c50-lint.txt \
    && git add src/components/celebration.tsx src/theme/motion.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/motion.ts ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): pop por keyframes de Pingo y la insignia (R7, E4)'

# -- c51 E4.4 R17: anillo de ping (rojo) --

Edicion de c51 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c51.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c51.patch; echo "exit=$?"   -> exit=0
  git hash-object src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts
    -> 3ff2e9983592941f3e6e1847378a2add6a810e7e
       aa2385d0d0953e479a1d48d3767747ac8f22db51
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts > /tmp/171-c51.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 73 passed, 79 total`
  <GUARDAS> > /tmp/171-c51-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +6 failed, 73 passed, 79 total$' /tmp/171-c51.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c51.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más|  ● #171 E4: las constantes de la celebración viven en motion.ts › declara la duración del ping|  ● #171 R13: solo anima transform y opacity › R13.2 conserva las claves de layout y solo anima transform y opacity a los 0 y 1200 ms|  ● #171 R17: anillo de ping › R17.1 el anillo es el primer hijo del hero, de acento y oculto a accesibilidad|  ● #171 R17: anillo de ping › R17.2 el anillo crece y se apaga a los 0, 550, 1100 y 2100 ms|  ● #171 R17: anillo de ping › R17.3 el anillo vuelve a empezar tras 2200 ms|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c51.txt)" = 3 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c51.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c51-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts | tr '\n' ' ')" = '3ff2e9983592941f3e6e1847378a2add6a810e7e aa2385d0d0953e479a1d48d3767747ac8f22db51 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c51-lint.txt 2>&1 && test ! -s /tmp/171-c51-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/theme/__tests__/motion.test.ts ' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ' | tr '\n' '|')" = '43 0|5 0|' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): anillo de ping detrás de Pingo (R17, E4)'

# -- c52 E4.4 R17: anillo de ping (verde, produccion tuya) --

Alcance de c52 (E4.4):
- motion.ts: la linea literal `MOTION_CELEBRATION_PING_MS` de E4.11.
- celebration.tsx: el anillo `{id}-ring` de R17.1, como primer hijo de
  `{id}-hero`, y su animacion de R17.2, arrancada en el mismo efecto que el
  pop, en la rama sin reduce motion.
- En este commit el anillo se monta SIEMPRE, tambien con reduce motion. El
  condicional llega en c58: si lo adelantas, c57 nace con un rojo menos y
  su cadena para.
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts > /tmp/171-c52.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       79 passed, 79 total`
  <GUARDAS> > /tmp/171-c52-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c52-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +79 passed, 79 total$' /tmp/171-c52.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c52-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c52-all.txt \
    && grep -qE '^Tests: +3200 passed, 3200 total$' /tmp/171-c52-all.txt \
    && ! grep -qF 'cancelAnimation' src/components/celebration.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c52-lint.txt 2>&1 && test ! -s /tmp/171-c52-lint.txt \
    && git add src/components/celebration.tsx src/theme/motion.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/motion.ts ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): anillo de ping detrás de Pingo (R17, E4)'

# -- c53 E4.5 R18: Pingo flota (rojo) --

Edicion de c53 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c53.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c53.patch; echo "exit=$?"   -> exit=0
  git hash-object src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts
    -> fdde0c295fa61b57afd5b61d24de81aa8a3296dc
       bb1d56bb373176aabda647581334309036d0d938
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts > /tmp/171-c53.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 78 passed, 82 total`
  <GUARDAS> > /tmp/171-c53-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +4 failed, 78 passed, 82 total$' /tmp/171-c53.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c53.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más|  ● #171 E4: las constantes de la celebración viven en motion.ts › declara la flotación de Pingo|  ● #171 R18: flotación de Pingo › R18.1 Pingo flota desde los 600 ms: 0, -5 y -10 a los 600, 1350 y 2100 ms|  ● #171 R18: flotación de Pingo › R18.2 la flotación sigue en bucle: 0 a los 3600 ms y -10 a los 5100 ms|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c53.txt)" = 0 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c53.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c53-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts | tr '\n' ' ')" = 'fdde0c295fa61b57afd5b61d24de81aa8a3296dc bb1d56bb373176aabda647581334309036d0d938 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c53-lint.txt 2>&1 && test ! -s /tmp/171-c53-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/theme/__tests__/motion.test.ts ' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ' | tr '\n' '|')" = '23 0|8 0|' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): Pingo flota tras el pop (R18, E4)'

# -- c54 E4.5 R18: Pingo flota (verde, produccion tuya) --

Alcance de c54 (E4.5):
- motion.ts: las dos lineas `MOTION_PINGO_FLOAT_*` de E4.11, literales
  (#172 no ha mergeado: las declara #171), sin la linea de comentario
  `// Solo si ...` que las precede en la spec.
- celebration.tsx: el `translateY` de Pingo con la expresion de R18.1, en la
  rama sin reduce motion del mismo efecto que el pop.
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts > /tmp/171-c54.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       82 passed, 82 total`
  <GUARDAS> > /tmp/171-c54-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c54-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +82 passed, 82 total$' /tmp/171-c54.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c54-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c54-all.txt \
    && grep -qE '^Tests: +3203 passed, 3203 total$' /tmp/171-c54-all.txt \
    && test "$(grep -cF 'MOTION_PINGO_FLOAT_' src/theme/motion.ts)" = 2 \
    && ! grep -qF 'cancelAnimation' src/components/celebration.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c54-lint.txt 2>&1 && test ! -s /tmp/171-c54-lint.txt \
    && git add src/components/celebration.tsx src/theme/motion.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/motion.ts ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): Pingo flota tras el pop (R18, E4)'

# -- c55 E4.6 R19: entrada escalonada (rojo) --

Edicion de c55 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c55.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c55.patch; echo "exit=$?"   -> exit=0
  git hash-object src/components/__tests__/celebration.test.tsx src/screens/pairing/index.test.tsx src/theme/__tests__/motion.test.ts
    -> 5360a0b70b45d9c9206272707253feff3f81882d
       10b20fa52880a35fa842740b381afa38171a5a45
       7a38a622829773aaa3d24616cf99a4c34b9ef2a2
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/screens/pairing/index.test.tsx > /tmp/171-c55.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 141 passed, 147 total`
  <GUARDAS> > /tmp/171-c55-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +6 failed, 141 passed, 147 total$' /tmp/171-c55.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c55.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más|  ● #171 E4: las constantes de la celebración viven en motion.ts › declara la entrada escalonada|  ● #171 R13: solo anima transform y opacity › R13.2 conserva las claves de layout y solo anima transform y opacity a los 0 y 1200 ms|  ● #171 R19: entrada escalonada › R19.1 a los 1200 ms el texto y las acciones están en reposo|  ● #171 R19: entrada escalonada › R19.1 título, cuerpo, fichas y acciones suben escalonados a los 700 ms|  ● #171 R19: entrada escalonada › R19.2 sin fichas las acciones conservan su retardo de 740 ms|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c55.txt)" = 0 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c55.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c55-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx src/screens/pairing/index.test.tsx src/theme/__tests__/motion.test.ts | tr '\n' ' ')" = '5360a0b70b45d9c9206272707253feff3f81882d 10b20fa52880a35fa842740b381afa38171a5a45 7a38a622829773aaa3d24616cf99a4c34b9ef2a2 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c55-lint.txt 2>&1 && test ! -s /tmp/171-c55-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/screens/pairing/index.test.tsx src/theme/__tests__/motion.test.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/screens/pairing/index.test.tsx mobile-pet-tracker/src/theme/__tests__/motion.test.ts ' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ' | tr '\n' '|')" = '30 0|2 2|8 0|' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): entrada escalonada del texto y las acciones (R19, E4)'

# -- c56 E4.6 R19: entrada escalonada (verde, produccion tuya) --

Alcance de c56 (E4.6):
- motion.ts: las tres lineas `MOTION_CELEBRATION_RISE_*` de E4.11,
  literales.
- celebration.tsx: `{id}-title` y `{id}-body` pasan a `Animated.Text`, y
  `{id}-details` y `{id}-actions` a `Animated.View`, con su `className` y
  sin envoltorios nuevos (R2.3: mismo orden de hijos directos). Cada uno
  anima opacidad y `translateY` con la expresion de R19.1 y su `k` fijo:
  titulo 0, cuerpo 1, fichas 2 y acciones 3 (sin fichas, las acciones
  siguen en 3: R19.2).
- En este commit los valores iniciales son SIEMPRE opacidad 0 y
  `translateY` 14. Que dependan de reduce motion llega en c58: si lo
  adelantas, c57 nace con un rojo menos y su cadena para.
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/screens/pairing/index.test.tsx > /tmp/171-c56.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       147 passed, 147 total`
  <GUARDAS> > /tmp/171-c56-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c56-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +147 passed, 147 total$' /tmp/171-c56.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c56-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c56-all.txt \
    && grep -qE '^Tests: +3207 passed, 3207 total$' /tmp/171-c56-all.txt \
    && ! grep -qF 'cancelAnimation' src/components/celebration.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c56-lint.txt 2>&1 && test ! -s /tmp/171-c56-lint.txt \
    && git add src/components/celebration.tsx src/theme/motion.ts \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/motion.ts ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): entrada escalonada del texto y las acciones (R19, E4)'

# -- c57 E4.9 R8.4 y R8.5: reduce motion (rojo) --

Edicion de c57 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c57.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c57.patch; echo "exit=$?"   -> exit=0
  git hash-object src/components/__tests__/celebration.test.tsx
    -> a2fe2359756656e605b5aab9d28479d9558c2308
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c57.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 63 passed, 65 total`
  <GUARDAS> > /tmp/171-c57-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +2 failed, 63 passed, 65 total$' /tmp/171-c57.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c57.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R8: reduce motion › R8.4 con reduce motion no monta el anillo y Pingo no flota|  ● #171 R8: reduce motion › R8.5 con reduce motion el texto y las acciones aparecen sin subir|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c57.txt)" = 0 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c57.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c57-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx | tr '\n' ' ')" = 'a2fe2359756656e605b5aab9d28479d9558c2308 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c57-lint.txt 2>&1 && test ! -s /tmp/171-c57-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '12 0' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): reduce motion apaga el anillo, la flotación y la subida (R8, E4)'

# -- c58 E4.9 R8.4 y R8.5: reduce motion (verde, produccion tuya) --

Alcance de c58 (E4.9), solo celebration.tsx:
- R8.4: el anillo solo se monta sin reduce motion, y con reduce motion Pingo
  no flota (ya se cumple si la flotacion vive en la rama sin reduce motion).
- R8.5: el valor inicial de cada `useSharedValue` de la entrada depende de
  `useReducedMotion()` (opacidad 1 y `translateY` 0 con reduce motion), y
  con reduce motion el efecto de la entrada no hace nada: ni anima ni
  fija valores con `.set`. Lo da el valor inicial (la sonda P9 lo mide).
- Todavia NO: `cancelAnimation`.
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/screens/pairing/index.test.tsx > /tmp/171-c58.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       149 passed, 149 total`
  <GUARDAS> > /tmp/171-c58-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c58-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +149 passed, 149 total$' /tmp/171-c58.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c58-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c58-all.txt \
    && grep -qE '^Tests: +3209 passed, 3209 total$' /tmp/171-c58-all.txt \
    && ! grep -qF 'cancelAnimation' src/components/celebration.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c58-lint.txt 2>&1 && test ! -s /tmp/171-c58-lint.txt \
    && git add src/components/celebration.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/celebration.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): reduce motion apaga el anillo, la flotación y la subida (R8, E4)'

# -- c59 E4.8 R21: desmontar cancela los bucles (rojo) --

Edicion de c59 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c59.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c59.patch; echo "exit=$?"   -> exit=0
  git hash-object src/components/__tests__/celebration.test.tsx
    -> 54688dd53c5e2840704c9d16b18b12c49ffdc883
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c59.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 65 passed, 66 total`
  <GUARDAS> > /tmp/171-c59-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +1 failed, 65 passed, 66 total$' /tmp/171-c59.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c59.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R21: desmontar cancela los bucles › R21.1 desmontar cancela los 39 bucles|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c59.txt)" = 0 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c59.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c59-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx | tr '\n' ' ')" = '54688dd53c5e2840704c9d16b18b12c49ffdc883 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c59-lint.txt 2>&1 && test ! -s /tmp/171-c59-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '20 1' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): desmontar cancela los 39 bucles (R21, E4)'

# -- c60 E4.8 R21: desmontar cancela los bucles (verde, produccion tuya) --

Alcance de c60 (E4.8), solo celebration.tsx: al desmontar, `cancelAnimation`
sobre los 36 progresos del confeti, la escala y la opacidad del anillo y el
`translateY` de Pingo. Son 39 llamadas, ni una mas: los pops y la entrada
terminan solos y no se cancelan.
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/screens/pairing/index.test.tsx > /tmp/171-c60.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       150 passed, 150 total`
  <GUARDAS> > /tmp/171-c60-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c60-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +150 passed, 150 total$' /tmp/171-c60.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c60-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c60-all.txt \
    && grep -qE '^Tests: +3210 passed, 3210 total$' /tmp/171-c60-all.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c60-lint.txt 2>&1 && test ! -s /tmp/171-c60-lint.txt \
    && git add src/components/celebration.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/celebration.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): desmontar cancela los 39 bucles (R21, E4)'

# -- c61 E4.12 R12: candado de posicion de §2.27 (nace verde) --

Edicion de c61 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c61.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c61.patch; echo "exit=$?"   -> exit=0
  git hash-object src/components/__tests__/celebration.test.tsx
    -> b73eac6e8f0c05dbd90b897dbc1e2e49b9e8eee0
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c61.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       66 passed, 66 total`
  <GUARDAS> > /tmp/171-c61-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +66 passed, 66 total$' /tmp/171-c61.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c61-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx | tr '\n' ' ')" = 'b73eac6e8f0c05dbd90b897dbc1e2e49b9e8eee0 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c61-lint.txt 2>&1 && test ! -s /tmp/171-c61-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '3 0' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el copy de §2.27 exige sus encabezados vecinos (R12, E4)'

  Nace verde: §2.27 ya va despues de §2.26 y los dos encabezados existen.
  Lo que este `it` caza lo prueban las sondas P10-P12.

# -- c62 E4.13 R15: la carta (rojo) --

Edicion de c62 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c62.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c62.patch; echo "exit=$?"   -> exit=0
  git hash-object src/components/__tests__/celebration.test.tsx
    -> 787c8b45d3e39c21cd933a8b0ca1b7b00349ace3
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/screens/welcome/index.test.tsx > /tmp/171-c62.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 150 passed, 151 total`
  <GUARDAS> > /tmp/171-c62-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +1 failed, 150 passed, 151 total$' /tmp/171-c62.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c62.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R15: docs/ui-guidelines.md declara la enmienda de la celebración|' \
    && test "$(grep -cF 'Unable to find' /tmp/171-c62.txt)" = 0 \
    && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-c62.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c62-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx | tr '\n' ' ')" = '787c8b45d3e39c21cd933a8b0ca1b7b00349ace3 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c62-lint.txt 2>&1 && test ! -s /tmp/171-c62-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '5 2' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): la carta declara la enmienda de la celebración (R15, E4)'

# -- c63 E4.13 R15: la carta (verde, parche del leader) --

Edicion de c63 (desde mobile-pet-tracker/; el parche es del leader):
  git -C .. apply --check progress/ronda4_mobile-celebrations-and-living-empty/c63.patch && git -C .. apply progress/ronda4_mobile-celebrations-and-living-empty/c63.patch; echo "exit=$?"   -> exit=0
  git hash-object ../docs/ui-guidelines.md
    -> aba25a00911cc5708346551662fef2e411beb144
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/screens/welcome/index.test.tsx > /tmp/171-c63.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       151 passed, 151 total`
  <GUARDAS> > /tmp/171-c63-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (la espera, en su propio comando)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c63-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +151 passed, 151 total$' /tmp/171-c63.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c63-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c63-all.txt \
    && grep -qE '^Tests: +3210 passed, 3210 total$' /tmp/171-c63-all.txt \
    && test "$(git hash-object ../docs/ui-guidelines.md | tr '\n' ' ')" = 'aba25a00911cc5708346551662fef2e411beb144 ' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c63-lint.txt 2>&1 && test ! -s /tmp/171-c63-lint.txt \
    && git -C .. add docs/ui-guidelines.md \
    && test "$(git diff --cached --name-only)" = 'docs/ui-guidelines.md' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '33 14' \
    && <LIMPIO> \
    && git commit -m 'docs(mobile): enmienda de la carta, confeti, ping y flotación (R15, E4)'

  La casilla de la seccion de la carta va marcada con la fecha de la firma
  de E4 (2026-10-14), como pide E4.13.

== SONDAS ==

Despues de c63, sobre ese HEAD, desde mobile-pet-tracker/. Las sondas van
UNA A UNA y en este orden. Cada sonda: (1) planta la mutacion, (2)
comprueba que muto solo su fichero, (3) mide, (4) verifica, (5) revierte
y comprueba limpio. Copia al impl el `git diff` de la mutacion, el
`mutada=`, el `exit=`, la linea `Tests:`, los `●` (los `  ● Console` se
copian pero no cuentan) y el `sonda=` y el `limpio=` de cada una. Si una
sonda no da EXACTAMENTE su `mutada=0`, su `sonda=0` y su `limpio=0`, PARA
y no sigas con la siguiente. Ninguna sonda se commitea.

P1, P2 y P4-P9 se plantan A MANO sobre TU celebration.tsx, porque el
codigo es tuyo: haz el cambio MAS PEQUENO que cumpla lo que dice la
sonda, sin tocar nada mas. P3 y P10-P12 son literales: copialas tal cual.

Comprobacion de mutacion de P1-P9 (fuente src/components/celebration.tsx):
  git diff --cached --quiet && test "$(git diff --name-only -- . ../docs ../specs)" = 'mobile-pet-tracker/src/components/celebration.tsx'; echo "mutada=$?"   -> mutada=0

Reversion comun, tras cada sonda (sustituye <fuente> por su fichero):
  git checkout HEAD -- <fuente>
  git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"   -> limpio=0
Nunca `git checkout <commit> -- <fichero>` (deja el cambio en el
indice). `git diff --quiet` sin ruta saldria 1 por el impl: lleva
siempre `-- . ../docs ../specs`.

P1 (R6.4 y R6.6: el confeti se repite; fuente src/components/celebration.tsx):
  Mutacion, a mano: en el `withRepeat` del progreso de las piezas, el numero de repeticiones pasa de `-1` a `1`.
  (comprobacion de mutacion de P1-P9)   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P1.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +2 failed, 64 passed, 66 total$' /tmp/171-r4-P1.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P1.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R6: confeti › R6.4 la pieza 21 vuelve a caer desde arriba tras terminar|  ● #171 R6: confeti › R6.6 a los 13830 ms las 36 piezas siguen en vuelo|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P1.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P1.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P2 (R6.4: el retardo no se repite; fuente src/components/celebration.tsx):
  Mutacion, a mano: el `withDelay` del progreso de las piezas pasa DENTRO del `withRepeat`: `withRepeat(withDelay(<retardo>, withTiming(...)), -1, false)`.
  (comprobacion de mutacion de P1-P9)   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P2.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +2 failed, 64 passed, 66 total$' /tmp/171-r4-P2.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P2.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R6: confeti › R6.4 la pieza 21 vuelve a caer desde arriba tras terminar|  ● #171 R6: confeti › R6.6 a los 13830 ms las 36 piezas siguen en vuelo|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P2.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P2.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P3 (R6.1 y #64 R9: la clase sale de la tabla; fuente src/components/celebration.tsx):
  sed -i "s/\[73, 'h-4\.5 w-2 rounded-xs bg-confetti-blue', 2570, 1396\],/[73, 'h-4.5 w-2 rounded-xs bg-category-blue-strong', 2570, 1396],/" src/components/celebration.tsx
  git diff --cached --quiet && test "$(git diff --name-only -- . ../docs ../specs)" = 'mobile-pet-tracker/src/components/celebration.tsx' && test "$(git diff --numstat -- src/components/celebration.tsx | cut -f1,2 | tr '\t' ' ')" = '1 1'; echo "mutada=$?"   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/171-r4-P3.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +2 failed, 133 passed, 135 total$' /tmp/171-r4-P3.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P3.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R6: confeti › R6.1 pinta 36 piezas con la clase de su fila|  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › centraliza las diez clases completas y prohíbe interpolarlas|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P3.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P3.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P4 (R17: el anillo existe; fuente src/components/celebration.tsx):
  Mutacion, a mano: el anillo `{id}-ring` no se monta nunca (su condicion de montaje pasa a `false`).
  (comprobacion de mutacion de P1-P9)   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P4.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +4 failed, 62 passed, 66 total$' /tmp/171-r4-P4.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P4.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R13: solo anima transform y opacity › R13.2 conserva las claves de layout y solo anima transform y opacity a los 0 y 1200 ms|  ● #171 R17: anillo de ping › R17.1 el anillo es el primer hijo del hero, de acento y oculto a accesibilidad|  ● #171 R17: anillo de ping › R17.2 el anillo crece y se apaga a los 0, 550, 1100 y 2100 ms|  ● #171 R17: anillo de ping › R17.3 el anillo vuelve a empezar tras 2200 ms|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P4.txt)" = 3 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P4.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P5 (R18: la flotacion espera al pop; fuente src/components/celebration.tsx):
  Mutacion, a mano: quita el `withDelay(MOTION_CELEBRATION_POP_MS, ...)` de la flotacion de Pingo y deja solo su `withRepeat(...)`.
  (comprobacion de mutacion de P1-P9)   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P5.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +2 failed, 64 passed, 66 total$' /tmp/171-r4-P5.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P5.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R18: flotación de Pingo › R18.1 Pingo flota desde los 600 ms: 0, -5 y -10 a los 600, 1350 y 2100 ms|  ● #171 R18: flotación de Pingo › R18.2 la flotación sigue en bucle: 0 a los 3600 ms y -10 a los 5100 ms|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P5.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P5.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P6 (R19.2: sin fichas, las acciones siguen en k = 3; fuente src/components/celebration.tsx):
  Mutacion, a mano: el `k` de `{id}-actions` pasa a depender de las fichas: 3 con fichas y 2 sin ellas.
  (comprobacion de mutacion de P1-P9)   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P6.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 65 passed, 66 total$' /tmp/171-r4-P6.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P6.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R19: entrada escalonada › R19.2 sin fichas las acciones conservan su retardo de 740 ms|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P6.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P6.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P7 (R21.1: se cancela el anillo; fuente src/components/celebration.tsx):
  Mutacion, a mano: quita las dos llamadas a `cancelAnimation` del anillo (escala y opacidad); las otras 37 se quedan.
  (comprobacion de mutacion de P1-P9)   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P7.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 65 passed, 66 total$' /tmp/171-r4-P7.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P7.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R21: desmontar cancela los bucles › R21.1 desmontar cancela los 39 bucles|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P7.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P7.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P8 (R8.4: con reduce motion no hay anillo; fuente src/components/celebration.tsx):
  Mutacion, a mano: el anillo se monta siempre, tambien con reduce motion.
  (comprobacion de mutacion de P1-P9)   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P8.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 65 passed, 66 total$' /tmp/171-r4-P8.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P8.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R8: reduce motion › R8.4 con reduce motion no monta el anillo y Pingo no flota|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P8.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P8.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P9 (R8.5: el valor inicial depende de reduce motion; fuente src/components/celebration.tsx):
  Mutacion, a mano: el valor inicial de la entrada deja de depender de reduce motion: siempre el de sin reduce motion (opacidad 0 y `translateY` 14).
  (comprobacion de mutacion de P1-P9)   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P9.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 65 passed, 66 total$' /tmp/171-r4-P9.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P9.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R8: reduce motion › R8.5 con reduce motion el texto y las acciones aparecen sin subir|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P9.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P9.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

P10 (R12: §2.27 va detras de §2.26; fuente ../specs/mobile-ui-language/design.md):
  python3 -I -c 'p="../specs/mobile-ui-language/design.md"; s=open(p,encoding="utf-8").read(); i=s.index("### §2.27 "); j=s.index("\n## 3. La infraestructura", i); b=s[i:j]; s=s[:i]+s[j:]; a=s.index("### §2.26 "); open(p,"w",encoding="utf-8").write(s[:a]+b.rstrip("\n")+"\n\n"+s[a:])'
  git diff --cached --quiet && test "$(git diff --name-only -- . ../docs ../specs)" = 'specs/mobile-ui-language/design.md' && test "$(git hash-object ../specs/mobile-ui-language/design.md)" = 'c58397b81ad12ba9759f2f0d80dbda6e22eb8412' && test "$(git diff --numstat -- ../specs/mobile-ui-language/design.md | cut -f1,2 | tr '\t' ' ')" = '9 8'; echo "mutada=$?"   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P10.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 65 passed, 66 total$' /tmp/171-r4-P10.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P10.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R12: copy de la variante sin collar › registra las cuatro claves en §2.27 de mobile-ui-language|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P10.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P10.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con ../specs/mobile-ui-language/design.md)

P11 (R12: el encabezado de §2.26 existe; fuente ../specs/mobile-ui-language/design.md):
  sed -i 's/^### §2\.26 — Añadidos por #170/### §2.26b — Añadidos por #170/' ../specs/mobile-ui-language/design.md
  git diff --cached --quiet && test "$(git diff --name-only -- . ../docs ../specs)" = 'specs/mobile-ui-language/design.md' && test "$(git hash-object ../specs/mobile-ui-language/design.md)" = 'e89813e8ae6e7ae514b9f5e39cb64734ff7c02bb' && test "$(git diff --numstat -- ../specs/mobile-ui-language/design.md | cut -f1,2 | tr '\t' ' ')" = '1 1'; echo "mutada=$?"   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P11.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 65 passed, 66 total$' /tmp/171-r4-P11.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P11.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R12: copy de la variante sin collar › registra las cuatro claves en §2.27 de mobile-ui-language|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P11.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P11.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con ../specs/mobile-ui-language/design.md)

P12 (R12: el encabezado de §2.23 existe; fuente ../specs/mobile-ui-language/design.md):
  sed -i 's/^### §2\.23 — Añadidos por #159/### §2.23b — Añadidos por #159/' ../specs/mobile-ui-language/design.md
  git diff --cached --quiet && test "$(git diff --name-only -- . ../docs ../specs)" = 'specs/mobile-ui-language/design.md' && test "$(git hash-object ../specs/mobile-ui-language/design.md)" = '053812a6e68874a35ed3c605b163c4a0a0d7e46e' && test "$(git diff --numstat -- ../specs/mobile-ui-language/design.md | cut -f1,2 | tr '\t' ' ')" = '1 1'; echo "mutada=$?"   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r4-P12.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 65 passed, 66 total$' /tmp/171-r4-P12.txt && test "$(grep -E '^  ● ' /tmp/171-r4-P12.txt | grep -vxF '  ● Console' | LC_ALL=C sort | tr '\n' '|')" = '  ● #171 R12: copy de la variante sin collar › registra las cuatro claves en §2.27 de mobile-ui-language|' && test "$(grep -cF 'Unable to find' /tmp/171-r4-P12.txt)" = 0 && ! grep -qE 'TypeError|ReferenceError|Test suite failed to run' /tmp/171-r4-P12.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con ../specs/mobile-ui-language/design.md)

Tras P12: las anclas A y K otra vez, con sus valores al cerrar.

== CIERRE ==

Desde la raiz (`cd /home/claude/sites/Pet-Tracker-wt-171 && pwd`):
- Lo que tocaron TUS commits en movil:
  `git log --no-merges --format= --name-only <H1>..HEAD -- mobile-pet-tracker/ | sed '/^$/d' | LC_ALL=C sort -u`
  -> exactamente:
     mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
     mobile-pet-tracker/src/__tests__/design-drift.test.ts
     mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
     mobile-pet-tracker/src/components/__tests__/celebration.test.tsx
     mobile-pet-tracker/src/components/celebration.tsx
     mobile-pet-tracker/src/screens/pairing/index.test.tsx
     mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
     mobile-pet-tracker/src/theme/__tests__/motion.test.ts
     mobile-pet-tracker/src/theme/global.css
     mobile-pet-tracker/src/theme/motion.ts
     mobile-pet-tracker/src/utils/category-palette.ts

Trazabilidad: en
specs/mobile-celebrations-and-living-empty/traceability.md, SOLO la
ultima columna (commits) de estas filas, con hashes de 8 caracteres
(`git log --format='%h %s' --abbrev=8 <H1>..HEAD`). No toques la columna
de tests (el leader ya la puso al dia en H1), el frontmatter, la fila R16
ni el resto del fichero.
- R2, R6, R7, R8 y R15: al final de la celda, antes del ` |` que la
  cierra, anade `; \`<hash> <mensaje>\` → \`<hash> <mensaje>\` (E4)`.
  R2 -> c47 → c48; R6 -> c45 → c46; R7 -> c49 → c50; R8 -> c57 → c58;
  R15 -> c62 → c63.
- R12 y R13: igual, con `; \`<hash> <mensaje>\` nace verde (E4)`.
  R12 -> c61; R13 -> c44.
- R17 a R21: sustituye el `pendiente` de la ultima celda por
  `\`<hash> <mensaje>\` → \`<hash> <mensaje>\` (E4)`.
  R17 -> c51 → c52; R18 -> c53 → c54; R19 -> c55 → c56; R20 -> c47 → c48;
  R21 -> c59 → c60.
  grep -cF '(E4)' specs/mobile-celebrations-and-living-empty/traceability.md   -> 12
  grep -cF '| pendiente |' specs/mobile-celebrations-and-living-empty/traceability.md   -> 1 (la de R16)
Termina la seccion `## Ronda 4` del impl con la linea
`R16: pendiente del smoke humano`. c64, desde la raiz:
  test "$(grep -cF '(E4)' specs/mobile-celebrations-and-living-empty/traceability.md)" = 12 \
    && test "$(grep -cF '| pendiente |' specs/mobile-celebrations-and-living-empty/traceability.md)" = 1 \
    && git add specs/mobile-celebrations-and-living-empty/traceability.md progress/impl_mobile-celebrations-and-living-empty.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-celebrations-and-living-empty.md specs/mobile-celebrations-and-living-empty/traceability.md ' \
    && git commit -m 'docs(mobile-celebrations-and-living-empty): #171 traceability round 4'

Lista cerrada, desde la raiz, medida desde H1 (NO desde H0), con la
salida al impl:
  git log --no-merges --format= --name-only <H1>..HEAD | sed '/^$/d' | LC_ALL=C sort -u
    -> exactamente estos 14:
       docs/ui-guidelines.md
       mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
       mobile-pet-tracker/src/__tests__/design-drift.test.ts
       mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
       mobile-pet-tracker/src/components/__tests__/celebration.test.tsx
       mobile-pet-tracker/src/components/celebration.tsx
       mobile-pet-tracker/src/screens/pairing/index.test.tsx
       mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
       mobile-pet-tracker/src/theme/__tests__/motion.test.ts
       mobile-pet-tracker/src/theme/global.css
       mobile-pet-tracker/src/theme/motion.ts
       mobile-pet-tracker/src/utils/category-palette.ts
       progress/impl_mobile-celebrations-and-living-empty.md
       specs/mobile-celebrations-and-living-empty/traceability.md
y c65, desde la raiz:
  git commit --only progress/impl_mobile-celebrations-and-living-empty.md -m 'docs(mobile-celebrations-and-living-empty): #171 closed file list round 4'

No rebasees ni enmiendes commits de rondas anteriores ni de esta:
invalida los hashes de la trazabilidad.

== REGLAS CRITICAS ==

- `#171` va SIEMPRE seguido de ` R<n>` en tests, codigo y comentarios:
  `HEX_LITERAL` de design-drift toma `#171` como hex si no (un
  `// #171 E4` lo pone en rojo). Ningun otro `#NNN` en lo que escribas:
  la linea `// Solo si #172 no ha mergeado ...` del bloque de E4.11 es
  una nota de la spec y NO se copia.
- Tests y carta, SOLO por parche. Produccion, SOLO en los verdes y solo
  en los ficheros que su cadena stagea.
- Nada de `cancelAnimation` antes de c60. Ni el anillo ni los valores
  iniciales de la entrada dependen de reduce motion antes de c58.
- Fuera de los once ficheros de movil, la carta, traceability.md y el
  impl, no toques nada. Las observaciones de los reviews anteriores no
  son de esta ronda.
- Sigue sin ser tuyo: el script de arranque del repo, el push, la PR y
  el merge de la PR.
```
