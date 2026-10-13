# Ronda 3 de Codex CLI — #171 mobile-celebrations-and-living-empty (Enmienda E3 y merge de main)

> Pega el bloque de abajo en una sesión NUEVA de Codex. La ronda 2 quedó
> aprobada (a9b1a1a4). Falta integrar `origin/main` (`788d1f89`), que trae
> #167, #168, #169 y #170. Ese merge choca con #171 en dos sitios, y la
> Enmienda E3 los resuelve. El humano la firmó vía Notion (firma del
> 2026-10-13, commit 34446b87):
>
> - **Muelle propio.** #167 declara su `MOTION_POP_SPRING` (0.6). El de #171
>   (0.5) pasa a llamarse `MOTION_CELEBRATION_SPRING`. Producción no cambia
>   de comportamiento.
> - **Sección de copy.** La siguiente libre en `origin/main` es §2.27
>   (#167 tiene §2.24, #169 §2.25 y #170 §2.26). El copy de #171 pasa de
>   §2.24 a §2.27.
>
> El orden es: primero el renombrado, test-primero (c37–c40); después el
> merge (c41). Así las siete resoluciones del merge son mecánicas, y las
> aplica un script que escribió el leader
> (`progress/merge_ronda3_mobile-celebrations-and-living-empty.py`). Luego
> vienen las sondas, la trazabilidad (c42) y la lista cerrada (c43).
>
> El leader ejecutó la ronda entera en un clon de simulación. Cada «->» de
> abajo es un valor medido allí: hashes de blob y de árbol, recuentos de
> jest, tsc, lint y sondas. El smoke R16 sigue siendo del humano.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-171   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch: feature/171-mobile-celebrations-and-living-empty
NO lances ./init.sh, ni entero ni en parte: lo corre el leader al final
(comparte Postgres y LocalStack con otras sesiones). Tampoco push, PR,
rebase, --amend ni git reset. El UNICO merge permitido es el de c41, y el
UNICO `git merge --abort` es el que c41 prescribe si su resolucion falla.

Ronda 3 de #171. Antes de nada, literal:
  cd /home/claude/sites/Pet-Tracker-wt-171 && pwd
  -> /home/claude/sites/Pet-Tracker-wt-171
  git branch --show-current   -> feature/171-mobile-celebrations-and-living-empty
  git rev-parse HEAD          -> llamalo H1: es el commit de este handoff
  git log --oneline -4        -> H1, 34446b87, e67032e7, 0cb0a506, en ese orden
  git status --short          -> vacio
  git fetch origin && git rev-parse origin/main
    -> 788d1f896d2de11cde7a6ab5e1fbf1bb548b620f. Si sale OTRO hash, PARA:
       la resolucion de c41 esta medida contra ese commit y solo ese.
  git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"   -> exit=1
  git rev-parse HEAD:mobile-pet-tracker HEAD:docs HEAD:specs/mobile-ui-language
    -> 73c090742c6ddb4b2220317cbc8055161edae3c5
       41a2ec8a694b8a02fa0fafd55e334d1402c50ac4
       132eaf52942cb64ddc7bf0194aba3f7263b6f2e2
  git ls-tree HEAD | awk '$4 != "progress"' | git hash-object --stdin
    -> ae107c2bf49a256a81e561aadca242da58ccd51b
Pega las salidas en una seccion nueva, `## Ronda 3`, AL FINAL de
progress/impl_mobile-celebrations-and-living-empty.md (es un fichero
trackeado: no lo stagees hasta c42). Si algo no cuadra, PARA.

Lee primero, enteros:
- specs/mobile-celebrations-and-living-empty/requirements.md,
  §Enmienda E3;
- specs/mobile-celebrations-and-living-empty/tasks.md: las notas
  «(Enmienda E3)» de T4 (la lista de `no exporta nada más`) y la fila
  R12.3;
- progress/merge_ronda3_mobile-celebrations-and-living-empty.py. Lo
  EJECUTAS en c41; no lo edites.
Los `sed` de este handoff son LITERALES: copialos tal cual. Cada uno va
seguido de un hash del fichero resultante. Si el hash no cuadra, no
edites a mano: `git checkout HEAD -- <fichero>` y PARA.

Skills: carga `building-native-ui` y `animate-expo` (los nombres de tu
plugin expo) y di en el impl que las cargaste. La spec manda sobre
cualquier skill.

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

Ficheros que tocas (c37-c40; en los comandos van enteros):
  MT = src/theme/__tests__/motion.test.ts
  MO = src/theme/motion.ts
  CE = src/components/celebration.tsx
  CT = src/components/__tests__/celebration.test.tsx
  UL = ../specs/mobile-ui-language/design.md

Medida base, un solo jest con MT y CT:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/motion.test.ts src/components/__tests__/celebration.test.tsx > /tmp/171-r3-base.txt 2>&1; echo "exit=$?"
  -> exit=0, `Test Suites: 2 passed, 2 total` y
     `Tests:       66 passed, 66 total` (motion 17, celebration 49).
     Si no, PARA.

Comando GUARDAS (candados de carta): 96 `it` hasta c40; 101 tras el
merge (los candados de #167-#170 entran con el):
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/171-cN-guardas.txt 2>&1`.

Espera antes de cada ALL (otros worktrees corren jest e init.sh en la
misma maquina de 4 CPU; esto los espera a todos, hasta 90 minutos). Va
en su PROPIO comando, sin nada mas en la misma linea:
  W=0; while pgrep -f 'node_modules/(\.bin/jest|jest-worker)|[i]nit\.sh' > /dev/null; do W=$((W+1)); test $W -le 90 || break; sleep 60; done; echo "espera=$W"
  -> espera=N con N <= 90. Con espera=91, PARA. No escribas el nombre
     del script de arranque en esa linea: pgrep se encontraria a si mismo.

Comando ALL (justo despues de la espera, y sin lanzar nada mas mientras
corre). Solo en c38 y c41; en los commits rojos no se corre:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-cN-all.txt 2>&1; echo "exit=$?"
  ALL de H1 (cierre de la ronda 2): `Test Suites: 99 passed, 99 total`
  y `Tests:       2861 passed, 2861 total`. No lo repitas en la base.

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
al tercer SIGKILL, PARA. No pases prettier.

== ANCLAS ==

Ejecutalas TODAS antes de tocar nada y copia la salida al impl. A desde
mobile-pet-tracker/, H desde la raiz. Solo estos comandos son anclas;
los numeros de linea no lo son. Si alguna no da EXACTAMENTE lo esperado,
PARA. Cuando `grep -c` cuenta 0 sale con codigo 1: vale la cifra
impresa. El leader las ejecuto todas en H1 sacandolas de este fichero.

A1. grep -cxF "      'MOTION_BLINK_TIMING'," src/theme/__tests__/motion.test.ts   -> 1
A2. grep -cxF "      'MOTION_POP_SPRING'," src/theme/__tests__/motion.test.ts   -> 1
A3. grep -cF "it('declara MOTION_POP_SPRING'" src/theme/__tests__/motion.test.ts   -> 1
A4. grep -cF "require('../motion').MOTION_POP_SPRING)" src/theme/__tests__/motion.test.ts   -> 1
A5. grep -cF 'MOTION_POP_SPRING' src/theme/__tests__/motion.test.ts src/theme/motion.ts src/components/celebration.tsx src/components/__tests__/celebration.test.tsx   -> motion.test.ts :3, motion.ts :1, celebration.tsx :3, celebration.test.tsx :0
A6. grep -cF 'MOTION_CELEBRATION_SPRING' src/theme/__tests__/motion.test.ts src/theme/motion.ts src/components/celebration.tsx src/components/__tests__/celebration.test.tsx   -> las cuatro con :0
A7. grep -cF 'export const MOTION_POP_SPRING = { duration: 400, dampingRatio: 0.5' src/theme/motion.ts   -> 1
A8. grep -cF 'import { MOTION_CONFETTI_FALL_TIMING, ' src/components/celebration.tsx   -> 1
A9. grep -cF ', MOTION_POP_SCALE, MOTION_POP_SPRING, MOTION_SURFACE_MS }' src/components/celebration.tsx   -> 1
A10. grep -cF 'withSpring(1, MOTION_POP_SPRING)' src/components/celebration.tsx   -> 2
A11. grep -cF '§2.2' src/components/__tests__/celebration.test.tsx   -> 3
A12. grep -cF 'en §2.24 de mobile-ui-language' src/components/__tests__/celebration.test.tsx   -> 1
A13. grep -cF '### §2.24 — Añadidos por ' src/components/__tests__/celebration.test.tsx   -> 1
A14. grep -cF 'dampingRatio: 0.' src/theme/motion.ts   -> 1
Desde la raiz:
H1. grep -cxF '### §2.24 — Añadidos por #171 — Celebraciones' specs/mobile-ui-language/design.md   -> 1
H2. grep -cE '^### §2\.2[5-9] ' specs/mobile-ui-language/design.md   -> 0
H3. git show origin/main:specs/mobile-ui-language/design.md | grep -cE '^### §2\.2[4-6] '   -> 3
H4. git show origin/main:specs/mobile-ui-language/design.md | grep -cE '^### §2\.(2[7-9]|[3-9][0-9]) '   -> 0
H5. grep -cF -- '- [x] Enmienda E3 aprobada por humano (fecha: 2026-10-13)' specs/mobile-celebrations-and-living-empty/requirements.md   -> 1
H6. grep -cF -- '- [ ] R16: smoke en dev build de Android completado por humano (fecha: ____)' specs/mobile-celebrations-and-living-empty/requirements.md   -> 1
H7. grep -cF '(E3)' specs/mobile-celebrations-and-living-empty/traceability.md   -> 0
H8. git diff --quiet $(git merge-base HEAD origin/main) origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock; echo "deps=$?"   -> deps=0

Valores al cerrar (tras S5p, sobre el merge; medidos por el leader en la
simulacion): A1 1, A2 1, A3 0, A4 0; A5 motion.test.ts :4, motion.ts :1, celebration.tsx :0, celebration.test.tsx :0 (el MOTION_POP_SPRING que queda es el de #167); A6 motion.test.ts :3, motion.ts :1, celebration.tsx :3, celebration.test.tsx :0; A7 0, A8 0, A9 0, A10 0, A11 3, A12 0, A13 0, A14 2 (0.6 de #167 y 0.5 de #171); M1 1, M2 1, M3 1, M4 3, M5 0; H1 0, H2 3 (§2.25, §2.26 y §2.27), H3 3, H4 0, H5 1, H6 1, H7 0 (la trazabilidad llega en c42), H8 deps=0. Si alguno no cuadra, PARA.

== COMMITS ==

Cada commit va ENCADENADO con && a su verificacion: si un eslabon falla,
el commit no se hace. Si una cadena no llega al commit, PARA y reporta en
el impl el eslabon y su salida. Las lineas `# -- ... --` son cabeceras
(comentarios). Cada cadena empieza en su primera linea de comando y
TERMINA en su linea `git commit -m '...'`, seguida de una linea en
blanco; lo que va despues es prosa para ti y no se ejecuta.

Mide SIN pipe. Cada medida lleva su `echo "exit=$?"`; anota el exit en el
impl. Antes de cada cadena corres, en este orden: (1) la edicion con su
hash, (2) la medida, (3) `<GUARDAS> > /tmp/171-cN-guardas.txt 2>&1; echo "exit=$?"`
y, solo en c38 y c41, (4) la espera y (5) el ALL. La cadena comprueba
las salidas.

Si un rojo esperado sale con otra lista de `●`, o un verde sale rojo,
NO ajustes nada: anota el `●`, su Expected/Received y PARA.

# -- c37 E3 R7: el test pide MOTION_CELEBRATION_SPRING (rojo) --

Edicion de c37 (desde mobile-pet-tracker/):
  sed -i -e "s/^      'MOTION_BLINK_TIMING',\$/&\n      'MOTION_CELEBRATION_SPRING',/" -e "/^      'MOTION_POP_SPRING',\$/d" -e "s/it('declara MOTION_POP_SPRING'/it('declara MOTION_CELEBRATION_SPRING'/" -e "s/require('\.\.\/motion')\.MOTION_POP_SPRING)/require('..\/motion').MOTION_CELEBRATION_SPRING)/" src/theme/__tests__/motion.test.ts
  git hash-object src/theme/__tests__/motion.test.ts   -> 9ea29f15b87d3f896b328d6dc30908db6b6d6e2f
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/motion.test.ts > /tmp/171-c37.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 15 passed, 17 total`
  <GUARDAS> > /tmp/171-c37-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +2 failed, 15 passed, 17 total$' /tmp/171-c37.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c37.txt | grep -vxF '  ● Console' | tr '\n' '|')" = '  ● #152 R1: las duraciones y el preset de movimiento viven en un solo sitio › no exporta nada más|  ● #171 R7: las constantes de pop viven en motion.ts › declara MOTION_CELEBRATION_SPRING|' \
    && ! grep -qE 'Unable to find|TypeError|ReferenceError|Test suite failed to run' /tmp/171-c37.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c37-guardas.txt \
    && test "$(git hash-object src/theme/__tests__/motion.test.ts)" = 9ea29f15b87d3f896b328d6dc30908db6b6d6e2f \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c37-lint.txt 2>&1 && test ! -s /tmp/171-c37-lint.txt \
    && git add src/theme/__tests__/motion.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '3 3' \
    && test "$(git write-tree --prefix=mobile-pet-tracker/)" = 8d60b785d89ade8b74107a1d9873bb2c0fc35b2e \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el muelle de la celebración se llama MOTION_CELEBRATION_SPRING (R7, E3)'

  Los dos `●` son los esperados: `declara MOTION_CELEBRATION_SPRING` lee
  un simbolo que aun no existe, y la lista de `no exporta nada mas` ya no
  coincide con lo que exporta motion.ts.

# -- c38 E3 R7: motion.ts y celebration.tsx usan el nombre nuevo (verde) --

Edicion de c38 (desde mobile-pet-tracker/):
  sed -i 's/^export const MOTION_POP_SPRING = { duration: 400, dampingRatio: 0\.5/export const MOTION_CELEBRATION_SPRING = { duration: 400, dampingRatio: 0.5/' src/theme/motion.ts
  sed -i -e 's/^import { MOTION_CONFETTI_FALL_TIMING, /import { MOTION_CELEBRATION_SPRING, MOTION_CONFETTI_FALL_TIMING, /' -e 's/, MOTION_POP_SCALE, MOTION_POP_SPRING, MOTION_SURFACE_MS }/, MOTION_POP_SCALE, MOTION_SURFACE_MS }/' -e 's/withSpring(1, MOTION_POP_SPRING)/withSpring(1, MOTION_CELEBRATION_SPRING)/' src/components/celebration.tsx
  git hash-object src/theme/motion.ts src/components/celebration.tsx
    -> 120cd75ab9e655d0538f8920d1640582db8c8d08
       5f8271b32ade1e381c79d2f2c7d11254893e7e1b
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/motion.test.ts src/components/__tests__/celebration.test.tsx > /tmp/171-c38.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       66 passed, 66 total`
  <GUARDAS> > /tmp/171-c38-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (espera)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c38-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +66 passed, 66 total$' /tmp/171-c38.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c38-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c38-all.txt \
    && grep -qE '^Tests: +2861 passed, 2861 total$' /tmp/171-c38-all.txt \
    && test "$(git hash-object src/theme/motion.ts)" = 120cd75ab9e655d0538f8920d1640582db8c8d08 \
    && test "$(git hash-object src/components/celebration.tsx)" = 5f8271b32ade1e381c79d2f2c7d11254893e7e1b \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c38-lint.txt 2>&1 && test ! -s /tmp/171-c38-lint.txt \
    && git add src/theme/motion.ts src/components/celebration.tsx \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/motion.ts ' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ' | tr '\n' '|')" = '3 3|1 1|' \
    && test "$(git write-tree --prefix=mobile-pet-tracker/)" = e027ae08a74a0a0e9f6e68d8881b9271343ae18c \
    && <LIMPIO> \
    && git commit -m 'refactor(mobile): la celebración usa su propio muelle (R7, E3)'

# -- c39 E3 R12: el test pide la seccion §2.27 (rojo) --

Edicion de c39 (desde mobile-pet-tracker/):
  sed -i -e 's/en §2\.24 de mobile-ui-language/en §2.27 de mobile-ui-language/' -e 's/### §2\.24 — Añadidos por /### §2.27 — Añadidos por /' src/components/__tests__/celebration.test.tsx
  git hash-object src/components/__tests__/celebration.test.tsx   -> d287e3b383dd8cd81db60590627192dfea74a62c
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c39.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 48 passed, 49 total`
  <GUARDAS> > /tmp/171-c39-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +1 failed, 48 passed, 49 total$' /tmp/171-c39.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c39.txt | grep -vxF '  ● Console' | tr '\n' '|')" = '  ● #171 R12: copy de la variante sin collar › registra las cuatro claves en §2.27 de mobile-ui-language|' \
    && ! grep -qE 'Unable to find|TypeError|ReferenceError|Test suite failed to run' /tmp/171-c39.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c39-guardas.txt \
    && test "$(git hash-object src/components/__tests__/celebration.test.tsx)" = d287e3b383dd8cd81db60590627192dfea74a62c \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c39-lint.txt 2>&1 && test ! -s /tmp/171-c39-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '2 2' \
    && test "$(git write-tree --prefix=mobile-pet-tracker/)" = 9b17319ca682d1feaacc036a340a3aff362d7003 \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el copy de la celebración se registra en §2.27 (R12, E3)'

# -- c40 E3 R12: la seccion pasa a §2.27 en mobile-ui-language (verde) --

Edicion de c40 (desde mobile-pet-tracker/; el fichero vive fuera):
  sed -i 's/^### §2\.24 — Añadidos por #171 — Celebraciones$/### §2.27 — Añadidos por #171 — Celebraciones/' ../specs/mobile-ui-language/design.md
  git hash-object ../specs/mobile-ui-language/design.md   -> b09340652de6ec01e506ca8b74622d6f970df80c
Medida:
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c40.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       49 passed, 49 total`
  <GUARDAS> > /tmp/171-c40-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena:
  grep -qE '^Tests: +49 passed, 49 total$' /tmp/171-c40.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c40-guardas.txt \
    && test "$(git hash-object ../specs/mobile-ui-language/design.md)" = b09340652de6ec01e506ca8b74622d6f970df80c \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c40-lint.txt 2>&1 && test ! -s /tmp/171-c40-lint.txt \
    && git add ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only)" = 'specs/mobile-ui-language/design.md' \
    && test "$(git diff --cached --numstat | cut -f1,2 | tr '\t' ' ')" = '1 1' \
    && test "$(git write-tree --prefix=mobile-pet-tracker/)" = 9b17319ca682d1feaacc036a340a3aff362d7003 \
    && test "$(git write-tree --prefix=specs/mobile-ui-language/)" = 4269e4a856afc6ff8e440b913d66ff54671edd53 \
    && <LIMPIO> \
    && git commit -m 'docs(mobile-ui-language): las claves de la celebración pasan a §2.27 (R12, E3)'

# -- c41 merge de origin/main (788d1f89) --

Primera parte, DESDE LA RAIZ, comando a comando, con cada salida al impl:
  cd /home/claude/sites/Pet-Tracker-wt-171 && pwd
  -> /home/claude/sites/Pet-Tracker-wt-171
  git rev-parse HEAD   -> llamalo C40 (el commit de c40)
  git -c merge.conflictStyle=merge -c rerere.enabled=false merge --no-ff --no-commit origin/main > /tmp/171-c41-merge.txt 2>&1; echo "exit=$?"
    -> exit=1 (los conflictos son esperados)
  test "$(git diff --name-only --diff-filter=U | tr '\n' '|')" = 'docs/ui-guidelines.md|mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts|mobile-pet-tracker/src/__tests__/design-drift.test.ts|mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx|mobile-pet-tracker/src/theme/__tests__/motion.test.ts|mobile-pet-tracker/src/theme/motion.ts|specs/mobile-ui-language/design.md|'; echo "conflictos=$?"
    -> conflictos=0
  python3 -I progress/merge_ronda3_mobile-celebrations-and-living-empty.py . > /tmp/171-c41-resolve.txt 2>&1; echo "exit=$?"
    -> exit=0
  test "$(tr '\n' '|' < /tmp/171-c41-resolve.txt)" = 'docs/ui-guidelines.md hunks 1|mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts hunks 6|mobile-pet-tracker/src/__tests__/design-drift.test.ts hunks 1|mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx hunks 1|mobile-pet-tracker/src/theme/__tests__/motion.test.ts hunks 2|mobile-pet-tracker/src/theme/motion.ts hunks 1|specs/mobile-ui-language/design.md hunks 1|'; echo "resuelto=$?"
    -> resuelto=0
  git add docs/ui-guidelines.md mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/theme/__tests__/motion.test.ts mobile-pet-tracker/src/theme/motion.ts specs/mobile-ui-language/design.md
  test -z "$(git diff --name-only --diff-filter=U)" && test "$(git write-tree --prefix=mobile-pet-tracker/)" = d27a09c60c44bca7ea15a22807d81c243c0dfb51 && test "$(git write-tree --prefix=docs/)" = ae2d6b497ae1b114ac757cba665048aaf26882ed && test "$(git write-tree --prefix=specs/mobile-ui-language/)" = 3075171b76e407ef3c09b82c718b0f27bb7efb2c && test "$(git ls-tree "$(git write-tree)" | awk '$4 != "progress"' | git hash-object --stdin)" = 44d0fbeb9305ba4a6efceccf65b572c0baca9cf6; echo "arbol=$?"
    -> arbol=0

Si el merge NO sale con exit=1, o conflictos, el script, resuelto o arbol no dan 0:
  git merge --abort; echo "exit=$?"   -> exit=0
  test "$(git rev-parse HEAD)" = <C40> && git diff --quiet && git diff --cached --quiet; echo "limpio=$?"   -> limpio=0
y PARA, con /tmp/171-c41-merge.txt y /tmp/171-c41-resolve.txt copiados
enteros al impl. Ninguna otra salida de esta ronda lleva `merge --abort`.

Segunda parte, desde mobile-pet-tracker/ (el merge sigue sin commitear;
todo se mide sobre el arbol resuelto):
  cd /home/claude/sites/Pet-Tracker-wt-171/mobile-pet-tracker && pwd
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/motion.test.ts src/components/__tests__/celebration.test.tsx > /tmp/171-c41.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       70 passed, 70 total` (motion 21, celebration 49)
  <GUARDAS> > /tmp/171-c41-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0
  (espera)
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c41-all.txt 2>&1; echo "exit=$?"
    -> exit=0
Cadena (desde mobile-pet-tracker/):
  grep -qE '^Tests: +70 passed, 70 total$' /tmp/171-c41.txt \
    && grep -qE '^Tests: +101 passed, 101 total$' /tmp/171-c41-guardas.txt \
    && grep -qE '^Test Suites: +104 passed, 104 total$' /tmp/171-c41-all.txt \
    && grep -qE '^Tests: +3187 passed, 3187 total$' /tmp/171-c41-all.txt \
    && test "$(git rev-parse MERGE_HEAD)" = 788d1f896d2de11cde7a6ab5e1fbf1bb548b620f \
    && test -z "$(git diff --name-only --diff-filter=U)" \
    && test "$(git write-tree --prefix=mobile-pet-tracker/)" = d27a09c60c44bca7ea15a22807d81c243c0dfb51 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c41-lint.txt 2>&1 && test ! -s /tmp/171-c41-lint.txt \
    && <LIMPIO> \
    && git commit -m 'Merge origin/main (#167, #168, #169, #170) into feature/171-mobile-celebrations-and-living-empty'

  Si esta cadena no llega al commit, NO abortes el merge: dejalo como
  esta, anota el eslabon y PARA. El arbol ya cuadro con la simulacion, y
  el leader decide.
  Tras el commit:
  git rev-parse HEAD^1 HEAD^2   -> <C40> y 788d1f896d2de11cde7a6ab5e1fbf1bb548b620f
  git rev-parse HEAD:mobile-pet-tracker   -> d27a09c60c44bca7ea15a22807d81c243c0dfb51

== SONDAS ==

Despues de c41, sobre ese HEAD, desde mobile-pet-tracker/. Antes de la
primera, estas anclas (cada cadena debe salir como se indica):
M1. grep -cF 'pingoScale.set(withSpring(1, MOTION_CELEBRATION_SPRING))' src/components/celebration.tsx   -> 1
M2. grep -cF 'badgeScale.set(withDelay(MOTION_SURFACE_MS, withSpring(1, MOTION_CELEBRATION_SPRING)))' src/components/celebration.tsx   -> 1
M3. grep -cF 'dampingRatio: 0.5' src/theme/motion.ts   -> 1
M4. grep -cF 'MOTION_CELEBRATION_SPRING' src/components/celebration.tsx   -> 3
M5. grep -cF 'MOTION_POP_SPRING' src/components/celebration.tsx   -> 0

Las sondas van UNA A UNA y en este orden. Cada sonda: (1) planta la
mutacion con su `sed`, (2) comprueba que muto exactamente lo esperado,
(3) mide el fichero de test ENTERO, (4) verifica, (5) revierte y
comprueba limpio. Copia al impl el `mutada=`, el `exit=`, la linea
`Tests:`, los `●` (los `  ● Console` se copian pero no cuentan) y el
`sonda=` y el `limpio=` de cada una. Si una sonda no da EXACTAMENTE su
`mutada=0`, su `sonda=0` y su `limpio=0`, PARA y no sigas con la
siguiente. Ninguna sonda se commitea.

Reversion comun, tras cada sonda (sustituye <fuente> por su fichero):
  git checkout HEAD -- <fuente>
  git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"   -> limpio=0
Nunca `git checkout <commit> -- <fichero>` (deja el cambio en el
indice). `git diff --quiet` sin ruta saldria 1 por el impl: lleva
siempre `-- . ../docs ../specs`.

S5 (R7.1 muelle de Pingo; fuente src/components/celebration.tsx):
  sed -i 's|pingoScale\.set(withSpring(1, MOTION_CELEBRATION_SPRING))|pingoScale.set(withTiming(1, MOTION_FADE_TIMING))|' src/components/celebration.tsx
  test "$(git diff --numstat -- src/components/celebration.tsx | cut -f1,2 | tr '\t' ' ')" = '1 1'; echo "mutada=$?"   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r3-S5.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 48 passed, 49 total$' /tmp/171-r3-S5.txt && test "$(grep -E '^  ● ' /tmp/171-r3-S5.txt | grep -vxF '  ● Console' | tr '\n' '|')" = '  ● #171 R7: pop › R7.4 Pingo rebota por encima de 1 y se asienta a los 50, 100, 150 y 200 ms|' && ! grep -qE 'Unable to find|TypeError|ReferenceError|Test suite failed to run' /tmp/171-r3-S5.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

S5i (R7.2 muelle de la insignia; fuente src/components/celebration.tsx):
  sed -i 's|badgeScale\.set(withDelay(MOTION_SURFACE_MS, withSpring(1, MOTION_CELEBRATION_SPRING)))|badgeScale.set(withDelay(MOTION_SURFACE_MS, withTiming(1, MOTION_FADE_TIMING)))|' src/components/celebration.tsx
  test "$(git diff --numstat -- src/components/celebration.tsx | cut -f1,2 | tr '\t' ' ')" = '1 1'; echo "mutada=$?"   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r3-S5i.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +1 failed, 48 passed, 49 total$' /tmp/171-r3-S5i.txt && test "$(grep -E '^  ● ' /tmp/171-r3-S5i.txt | grep -vxF '  ● Console' | tr '\n' '|')" = '  ● #171 R7: pop › R7.4 la insignia repite el rebote a los 450, 500, 550 y 600 ms|' && ! grep -qE 'Unable to find|TypeError|ReferenceError|Test suite failed to run' /tmp/171-r3-S5i.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

S5b (E3 §4, R7.1 y R7.2 rebote; fuente src/theme/motion.ts):
  sed -i 's|dampingRatio: 0\.5|dampingRatio: 1|' src/theme/motion.ts
  test "$(git diff --numstat -- src/theme/motion.ts | cut -f1,2 | tr '\t' ' ')" = '1 1'; echo "mutada=$?"   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r3-S5b.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +2 failed, 47 passed, 49 total$' /tmp/171-r3-S5b.txt && test "$(grep -E '^  ● ' /tmp/171-r3-S5b.txt | grep -vxF '  ● Console' | tr '\n' '|')" = '  ● #171 R7: pop › R7.4 Pingo rebota por encima de 1 y se asienta a los 50, 100, 150 y 200 ms|  ● #171 R7: pop › R7.4 la insignia repite el rebote a los 450, 500, 550 y 600 ms|' && ! grep -qE 'Unable to find|TypeError|ReferenceError|Test suite failed to run' /tmp/171-r3-S5b.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/theme/motion.ts)

S5p (E3 §1: la celebracion con el muelle de #167; fuente
src/components/celebration.tsx; tres lineas: el import y los dos usos):
  sed -i 's|MOTION_CELEBRATION_SPRING|MOTION_POP_SPRING|g' src/components/celebration.tsx
  test "$(git diff --numstat -- src/components/celebration.tsx | cut -f1,2 | tr '\t' ' ')" = '3 3'; echo "mutada=$?"   -> mutada=0
  FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-r3-S5p.txt 2>&1; echo "exit=$?"
    -> exit=1
  grep -qE '^Tests: +2 failed, 47 passed, 49 total$' /tmp/171-r3-S5p.txt && test "$(grep -E '^  ● ' /tmp/171-r3-S5p.txt | grep -vxF '  ● Console' | tr '\n' '|')" = '  ● #171 R7: pop › R7.4 Pingo rebota por encima de 1 y se asienta a los 50, 100, 150 y 200 ms|  ● #171 R7: pop › R7.4 la insignia repite el rebote a los 450, 500, 550 y 600 ms|' && ! grep -qE 'Unable to find|TypeError|ReferenceError|Test suite failed to run' /tmp/171-r3-S5p.txt; echo "sonda=$?"   -> sonda=0
  (reversion comun con src/components/celebration.tsx)

Tras S5p: las anclas A, H y M otra vez, con sus valores al cerrar.

== CIERRE ==

Desde la raiz (`cd /home/claude/sites/Pet-Tracker-wt-171 && pwd`):
- Lo que tocaron TUS commits (el merge queda fuera con --no-merges):
  `git log --first-parent --no-merges --format= --name-only <H1>..HEAD -- mobile-pet-tracker/ | sed '/^$/d' | LC_ALL=C sort -u`
  -> exactamente:
     mobile-pet-tracker/src/components/__tests__/celebration.test.tsx
     mobile-pet-tracker/src/components/celebration.tsx
     mobile-pet-tracker/src/theme/__tests__/motion.test.ts
     mobile-pet-tracker/src/theme/motion.ts

Trazabilidad: en
specs/mobile-celebrations-and-living-empty/traceability.md, SOLO la
columna de commits de las filas R7 y R12. Al final de cada celda, antes
del ` |` que la cierra, anade
`; \`<hash corto> <mensaje>\` → \`<hash corto> <mensaje>\` (E3)`:
R7 -> c37 → c38; R12 -> c39 → c40. No toques la columna de tests, el
frontmatter ni el resto del fichero. El merge (c41) no va en la tabla.
  grep -cF '(E3)' specs/mobile-celebrations-and-living-empty/traceability.md   -> 2
Termina la seccion `## Ronda 3` del impl con la linea
`R16: pendiente del smoke humano`. c42, desde la raiz:
  test "$(grep -cF '(E3)' specs/mobile-celebrations-and-living-empty/traceability.md)" = 2 \
    && git add specs/mobile-celebrations-and-living-empty/traceability.md progress/impl_mobile-celebrations-and-living-empty.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-celebrations-and-living-empty.md specs/mobile-celebrations-and-living-empty/traceability.md ' \
    && git commit -m 'docs(mobile-celebrations-and-living-empty): #171 traceability round 3'

Lista cerrada, desde la raiz, medida desde H1 (NO desde H0) y con
--first-parent (sin el, salen los commits de main que trae el merge),
con la salida al impl:
  git log --first-parent --no-merges --format= --name-only <H1>..HEAD | sed '/^$/d' | LC_ALL=C sort -u
    -> exactamente estos siete:
       mobile-pet-tracker/src/components/__tests__/celebration.test.tsx
       mobile-pet-tracker/src/components/celebration.tsx
       mobile-pet-tracker/src/theme/__tests__/motion.test.ts
       mobile-pet-tracker/src/theme/motion.ts
       progress/impl_mobile-celebrations-and-living-empty.md
       specs/mobile-celebrations-and-living-empty/traceability.md
       specs/mobile-ui-language/design.md
y c43, desde la raiz:
  git commit --only progress/impl_mobile-celebrations-and-living-empty.md -m 'docs(mobile-celebrations-and-living-empty): #171 closed file list round 3'

No rebasees ni enmiendes commits de rondas anteriores ni de esta:
invalida los hashes de la trazabilidad.

== REGLAS CRITICAS ==

- `#171` va SIEMPRE seguido de ` R<n>` en tests y codigo: `HEX_LITERAL`
  de design-drift toma `#171` como hex si no. Los `sed` de arriba no
  anaden ningun `#171`.
- Las ediciones son SOLO los `sed` de c37-c40 y el script de c41. Nada a
  mano. Si un hash no cuadra, `git checkout HEAD -- <fichero>` y PARA.
- El script de c41 no se edita. Si aborta, `git merge --abort` y PARA
  (c41 dice como).
- Fuera de los cinco ficheros de c37-c40, la resolucion de c41,
  traceability.md y el impl, no toques nada. Las observaciones del
  review de la ronda 2 no son de esta ronda.
- Sigue sin ser tuyo: el script de arranque del repo, el push, la PR y
  el merge de la PR.
```
