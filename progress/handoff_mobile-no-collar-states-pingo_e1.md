# Handoff a Codex CLI — #159 mobile-no-collar-states-pingo, ronda 2 (enmienda E1)

> Pega el bloque de abajo en Codex CLI. La enmienda E1 está firmada vía
> Notion; el commit de firma es `f3ca7b8e` de esta branch. La ronda 1
> (`progress/handoff_mobile-no-collar-states-pingo.md`) ya se cumplió y no se
> rehace. La ronda 1 se rechazó por B1 (`progress/review_mobile-no-collar-states-pingo.md`):
> los tests de R3/R4 no distinguían si el botón `Vincular collar` lee el rol y
> el collar del detalle o del listado, y la sonda Z1 del reviewer salió verde
> (109/109). E1 solo añade tests. La producción es correcta y acaba idéntica
> a `664b95a7`. El rojo sale de una mutación de producción que se versiona en
> el commit rojo y se revierte en el verde (C4, quinto punto). Son tres
> commits: rojo, verde y trazabilidad. Las sondas E1a-E1e se plantan, se miden
> y se revierten sin commit. La prueba de humo de R10, en un dev build de
> Android, sigue siendo del humano.
>
> El leader midió en `f3ca7b8e`, antes de escribir este fichero, la base del
> test del Mapa (exit=0, 109 passed), `router.d.ts` ausente y las anclas
> A1-A14 de == ANCLAS ==, todas con su valor de H0E1. `mobile-pet-tracker/`
> en `f3ca7b8e` es idéntico al de `664b95a7`. `node_modules` ya está instalado.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-159   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas en una seccion NUEVA al FINAL de
progress/impl_mobile-no-collar-states-pingo.md:
`# Ronda 2 — Enmienda E1` > `## Base E1`. No edites nada de la ronda 1 de
ese fichero: solo anades al final. El hash es H0E1: el commit que anade
este fichero (progress/handoff_mobile-no-collar-states-pingo_e1.md). En
todos los comandos de abajo, sustituye `<H0E1>` por ese hash literal.
PARA si la branch no es feature/159-mobile-no-collar-states-pingo o si
`git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-134, Pet-Tracker-wt-155, Pet-Tracker-wt-158,
Pet-Tracker-wt-backend ni ningun otro worktree, ni cambies de branch en
ninguno.

Feature: mobile-no-collar-states-pingo (#159), RONDA 2
Branch: feature/159-mobile-no-collar-states-pingo
Spec: specs/mobile-no-collar-states-pingo/requirements.md §Enmienda E1,
firmada en f3ca7b8e. Tu guion LITERAL es
specs/mobile-no-collar-states-pingo/tasks.md §Enmienda E1 — ronda 2
(desde «## Enmienda E1» hasta el final del fichero).
Lee enteros antes de empezar:
  - requirements.md §Enmienda E1
  - tasks.md §Enmienda E1 — ronda 2
  - specs/mobile-no-collar-states-pingo/traceability.md
  - progress/review_mobile-no-collar-states-pingo.md (veredicto de la
    ronda 1: B1 y la sonda Z1)
Los titulos de los it nuevos son LITERALES de tasks.md: copialos tal cual,
con sus tildes, sus dos puntos y su `%s`.

== QUE HACES ==

Tres commits, en este orden:
  e1-1  rojo: los its nuevos en src/screens/map/index.test.tsx y la
        mutacion versionada en src/screens/map/index.tsx.
  e1-2  verde: revierte la mutacion. src/screens/map/index.tsx vuelve a
        ser identico a 664b95a7.
  (sondas E1a-E1e sobre el verde, sin commit)
  e1-3  trazabilidad: traceability.md y el impl, con la lista cerrada.

El rojo SIEMPRE sale de la mutacion de produccion de tasks.md (1). Nunca
toques un doble de test (mockListPets, mockGetPet, makePet...) para
fabricar un rojo.

Esto manda sobre tasks.md:
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y con la salida a un
  fichero, como en las cadenas de abajo.
- Si la base del test del Mapa no da 109, NO recalcules las cuentas: PARA
  y anota la medida. El leader reescribe las cadenas.
- Sondas: restaura con `git checkout HEAD --` y comprueba con
  `git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"`. Ese
  diff cubre el fichero de la sonda y ademas el indice. El impl ya esta
  versionado y lo vas modificando, asi que un `git diff --quiet` sin
  rutas daria siempre 1.
- Cierre: el `bun run test` de tasks.md es el comando ALL de abajo, con
  `pgrep` vacio antes.
- La lista cerrada va dentro del commit de trazabilidad: no hay commit
  aparte de lista cerrada.
- Typecheck y lint: `bun run typecheck` y `bunx expo lint --no-cache`.
  Nunca `bun run lint`.

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
  -> /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
Todo lo de BASE, ANCLAS, COMMITS y SONDAS va desde ahi. El final del
CIERRE va desde la raiz (`cd /home/claude/sites/Pet-Tracker-wt-159 && pwd`).

Error de invocacion: si un comando falla ANTES de que arranquen jest,
tsc o eslint (`No such file or directory`, `command not found`, un
`ERR_PNPM_*` o un `pwd` que no es el esperado) y no has tocado ningun
fichero, NO es una parada: haz el `cd` literal de arriba, repite el
comando y anotalo en el impl. Cualquier otro fallo si es una parada.

Al arrancar, con cada exit al impl:
- `git fetch origin` y `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
  Puede dar 1 (#161 mergeo en main despues de la ronda 1): NO pares.
  Trabajas sobre H0E1 igual y el merge de main lo hace el leader al
  cerrar. Nunca rebasees ni mergees.
- `git merge-base --is-ancestor 664b95a7 HEAD; echo "exit=$?"`  -> exit=0
- `git diff --quiet 664b95a7 HEAD -- .; echo "exit=$?"`         -> exit=0
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"`           -> exit=0.
  Va en cada cadena de commit. Si un dia da 1, PARA y pide al humano que
  lo borre. Nunca `rm -f` (tu sandbox lo deniega).
- `test -d node_modules && echo presente`                       -> presente
- Base del test del Mapa:
    FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1-base.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       109 passed, 109 total` (el leader midio lo
       mismo en f3ca7b8e). Si no, PARA.
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina. Espera a que salga vacio antes del BASE y del ALL del Cierre.
  El jest de un solo fichero (rojo, verde, sondas) no espera.

Comando GUARDAS (candados de copy y de carta; siempre 30 + 62 + 55 + 27 = 174):
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
Comando BASE (los 10 ficheros de la ronda 1; ninguna ruta lleva parentesis):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
Comando ALL (la suite entera; `pgrep` vacio antes y nada mas en marcha
mientras corre):
  FORCE_COLOR=0 bunx jest

== ANCLAS ==

Desde mobile-pet-tracker/. Corre las 14 en H0E1 (antes de tocar nada) y
otra vez en el Cierre. Pega en el impl cada salida junto a su valor
esperado. Formato: `comando` -> H0E1 / cierre.
  T = src/screens/map/index.test.tsx    P = src/screens/map/index.tsx
A1  grep -cF "it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle'" src/screens/map/index.test.tsx   -> 0 / 1
A2  grep -cF "it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle'" src/screens/map/index.test.tsx   -> 0 / 1
A3  grep -cF "('no pinta el botón a %s aunque el listado diga owner'" src/screens/map/index.test.tsx   -> 0 / 1
A4  grep -cF 'aunque el listado' src/screens/map/index.test.tsx   -> 0 / 3
A5  grep -cF "within(action).getByText('Vincular collar')" src/screens/map/index.test.tsx   -> 1 / 3
A6  grep -cF "it('lleva a emparejar una sola vez'" src/screens/map/index.test.tsx   -> 1 / 1
A7  grep -cF "it('no pinta el botón mientras el detalle carga'" src/screens/map/index.test.tsx   -> 1 / 1
A8  grep -cF "it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s', async (role)" src/screens/map/index.test.tsx   -> 1 / 1
A9  grep -cF 'function noTrackingAfterDetail(detailState: PetState)' src/screens/map/index.test.tsx   -> 1 / 1
A10 grep -cF "selectedPet?.myRole === 'owner'" src/screens/map/index.tsx   -> 1 / 1
A11 grep -cF 'selectedPet?.device' src/screens/map/index.tsx   -> 0 / 0
A12 grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx   -> 1 / 1
A13 grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx   -> 1 / 1
A14 git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"   -> exit=0 / exit=0
Si alguna no da su valor de H0E1, PARA antes de tocar nada.

== COMO SE HACE CADA COMMIT ==

Todo desde mobile-pet-tracker/ (el `cd` literal de BASE). Cada commit va
ENCADENADO con && a su verificacion: si cualquier eslabon falla, el
commit no se hace. Nunca commitees fuera de estas cadenas. Si una cadena
no llega al commit, PARA y reporta en el impl el eslabon que fallo y su
salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). Cada medida lleva
su `echo "exit=$?"`. Anota el exit en el impl.

Rojos: cada uno cae EXACTAMENTE como dice tasks.md, por ASERCION
(`expect(received).toBeNull()`) o por CONSULTA (`Unable to find an
element with testID: map-no-tracking-action`). Nunca por TypeError,
ReferenceError, SyntaxError, `Test suite failed to run` ni `Cannot find
module`. Copia al impl cada it rojo con su matcher y su Expected/Received
(o la consulta). Si un Received ocupa mas de 20 lineas, copia el matcher,
el Expected y sus 20 primeras lineas, y nada mas.

Typecheck y lint van en TODAS las cadenas, la roja incluida, y dan exit 0.

`<LIMPIO>`, tras el `git add`, comprueba que no queda nada sin stagear en
mobile-pet-tracker/, docs/ ni specs/:
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
NUNCA `git status --short` tras un `git add`: falla siempre (lo stageado
sale). El impl vive en progress/ y no se stagea hasta e1-3.

== COMMITS ==

e1-1, rojo (tasks.md (1)). Escribe los dos it de R3 y el it.each de R4
donde dice tasks.md: el de R3 al final de su describe, tras
`it('lleva a emparejar una sola vez'`; el de R4 al final del suyo, tras
`it('no pinta el botón mientras el detalle carga'`. Ningun it existente
cambia. Despues planta la mutacion de tasks.md en `const canPairCollar =`
de src/screens/map/index.tsx: las dos lineas `detail.data.pet...` pasan a
`selectedPet?.myRole === 'owner' &&` y `selectedPet?.device === null;`, y
la primera linea (`detail.data?.kind === 'ok' &&`) no cambia.
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1-r.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 108 passed, 114 total`
  grep -qE '^Tests: +6 failed, 108 passed, 114 total$' /tmp/159-e1-r.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-e1-r.txt)" = 6 \
    && test "$(grep -E '^  ● ' /tmp/159-e1-r.txt | grep -cF 'aunque el listado')" = 5 \
    && test "$(grep -E '^  ● ' /tmp/159-e1-r.txt | grep -cF 'no pinta el botón al dueño de una mascota con collar')" = 1 \
    && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e1-r.txt)" = 2 \
    && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e1-r.txt)" = 4 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-e1-r.txt \
    && test "$(grep -cF "selectedPet?.myRole === 'owner'" src/screens/map/index.tsx)" = 2 \
    && test "$(grep -cF 'selectedPet?.device === null;' src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF 'detail.data.pet.myRole' src/screens/map/index.tsx)" = 0 \
    && test "$(grep -cF 'detail.data.pet.device' src/screens/map/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/map/index.test.tsx mobile-pet-tracker/src/screens/map/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list'
  Los 6 rojos son los de la tabla de tasks.md (1): 2 de R3 por consulta,
  las 3 filas nuevas de R4 y `no pinta el botón al dueño de una mascota
  con collar` (en cascada) por asercion.

e1-2, verde (tasks.md (2)):
  git checkout 664b95a7 -- src/screens/map/index.tsx && git diff --quiet 664b95a7 -- src/screens/map/index.tsx; echo "exit=$?"
    -> exit=0
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1-g.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       114 passed, 114 total`
  <GUARDAS> > /tmp/159-e1-g-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       174 passed, 174 total`
  grep -qE '^Tests: +114 passed, 114 total$' /tmp/159-e1-g.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-e1-g-guardas.txt \
    && git diff --quiet 664b95a7 -- src/screens/map/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail' \
    && git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
    -> exit=0
  (`git checkout <commit> -- <fichero>` deja el fichero en el indice; aqui
  no importa porque la cadena lo stagea igual.)

== SONDAS ==

Sobre el HEAD de e1-2, UNA A UNA, en `const canPairCollar =` de
src/screens/map/index.tsx. Para cada sonda: plantas la mutacion,
compruebas que la plantaste con su grep, mides SOLO el test del Mapa,
copias al impl la linea `Tests:` y los `●`, y reviertes:
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e1X.txt 2>&1; echo "exit=$?"
  git checkout HEAD -- src/screens/map/index.tsx
  git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"   -> limpio=0
(X = a, b, c, d, e.) Si una sonda no da EXACTAMENTE su linea `Tests:` y
sus `●`, PARA. Ninguna sonda se commitea.

E1a  `detail.data.pet.myRole === 'owner' &&` pasa a `selectedPet?.myRole === 'owner' &&`
     grep: `grep -cF "selectedPet?.myRole === 'owner' &&" src/screens/map/index.tsx` -> 1
     -> `Tests:       4 failed, 110 passed, 114 total`
     ● las 3 filas `no pinta el botón a %s aunque el listado diga owner`
       (asercion) y `pinta Vincular collar aunque el listado diga otro
       rol: manda el rol del detalle` (consulta)
E1b  la misma linea pasa a `(selectedPet?.myRole === 'owner' || detail.data.pet.myRole === 'owner') &&`
     grep: `grep -cF "(selectedPet?.myRole === 'owner' || detail.data.pet.myRole === 'owner') &&" src/screens/map/index.tsx` -> 1
     -> `Tests:       3 failed, 111 passed, 114 total`
     ● las 3 filas `no pinta el botón a %s aunque el listado diga owner` (asercion)
E1c  la misma linea pasa a `selectedPet?.myRole === 'owner' && detail.data.pet.myRole === 'owner' &&`
     grep: `grep -cF "selectedPet?.myRole === 'owner' && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx` -> 1
     -> `Tests:       1 failed, 113 passed, 114 total`
     ● `pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle` (consulta)
E1d  `detail.data.pet.device === null;` pasa a `selectedPet?.device === null;`
     grep: `grep -cF 'selectedPet?.device === null;' src/screens/map/index.tsx` -> 1
     -> `Tests:       2 failed, 112 passed, 114 total`
     ● `no pinta el botón al dueño de una mascota con collar` (asercion) y
       `pinta Vincular collar aunque el listado traiga collar: manda el
       collar del detalle` (consulta)
E1e  la misma linea pasa a `selectedPet?.device === null && detail.data.pet.device === null;`
     grep: `grep -cF 'selectedPet?.device === null && detail.data.pet.device === null;' src/screens/map/index.tsx` -> 1
     -> `Tests:       1 failed, 113 passed, 114 total`
     ● `pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle` (consulta)

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe,
con la salida al impl:
- `pgrep -af '[i]nit\.sh'` vacio. Despues el comando BASE
  `> /tmp/159-e1-final.txt 2>&1; echo "exit=$?"`
  -> exit=0, `Test Suites: 10 passed, 10 total` y
     `Tests:       754 passed, 754 total` (749 de la ronda 1 + 5; map 114)
- `pgrep -af '[i]nit\.sh'` vacio otra vez. Despues el comando ALL
  `> /tmp/159-e1-all.txt 2>&1; echo "exit=$?"`
  -> exit=0, `Test Suites: 97 passed, 97 total` y
     `Tests:       2420 passed, 2420 total` (2415 de la ronda 1 + 5).
     Copia las dos lineas. Si exit no es 0, anota los `●` y PARA.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y
  `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0
- Las anclas A1-A14 con sus valores de cierre.
- `git diff --stat <H0E1> HEAD -- package.json bun.lock app.json src/theme` -> vacio
Desde la raiz (`cd /home/claude/sites/Pet-Tracker-wt-159 && pwd`):
- `git log --oneline <H0E1>..HEAD` -> exactamente e1-1 y e1-2
- `git diff --name-only <H0E1> HEAD -- mobile-pet-tracker/`
  -> exactamente `mobile-pet-tracker/src/screens/map/index.test.tsx`
- `git diff --stat <H0E1> HEAD -- backend-pet-tracker/ infra-pet-tracker/ docs/` -> vacio

Despues edita specs/mobile-no-collar-states-pingo/traceability.md: solo
las filas R3 y R4, y nada mas del fichero. Sustituye <ROJO> y <VERDE> por
los hashes cortos de e1-1 y e1-2. Cada fila queda asi, en una sola linea:
| R3 | `src/screens/map/index.test.tsx::#159 R3: el dueño sin collar puede ir a emparejar` (E1: `pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle`, `pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle`) | f346baf3 test(mobile-no-collar-states): #159 R3 red pair collar action → 9b89f6c8 feat(mobile-no-collar-states): #159 R3 pair collar action on map; E1: <ROJO> test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list → <VERDE> fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail |
| R4 | `src/screens/map/index.test.tsx::#159 R4: nadie más ve el botón de emparejar` (sondas S4a-S4c; E1: `no pinta el botón a %s aunque el listado diga owner`, sondas E1a-E1e) | 9506bd88 test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar → f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail; E1: <ROJO> test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list → <VERDE> fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail |

Lista cerrada, desde la raiz, con traceability.md y el impl ya editados y
sin commitear (sin HEAD: compara el arbol con H0E1):
  git diff --name-only <H0E1> -- . ':!feature_list.json' ':!progress/current.md' ':!progress/review_mobile-no-collar-states-pingo.md' ':!specs/mobile-no-collar-states-pingo/requirements.md' ':!specs/mobile-no-collar-states-pingo/design.md' ':!specs/mobile-no-collar-states-pingo/tasks.md' | LC_ALL=C sort
    -> exactamente estos 3:
       mobile-pet-tracker/src/screens/map/index.test.tsx
       progress/impl_mobile-no-collar-states-pingo.md
       specs/mobile-no-collar-states-pingo/traceability.md
  test -z "$(git ls-files --others --exclude-standard)"; echo "exit=$?"   -> exit=0
Pega las dos salidas en el impl y termina tu seccion con la linea
`R10: pendiente del smoke humano`. Despues e1-3, desde la raiz:
  git add specs/mobile-no-collar-states-pingo/traceability.md progress/impl_mobile-no-collar-states-pingo.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-no-collar-states-pingo.md specs/mobile-no-collar-states-pingo/traceability.md ' \
    && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" \
    && git commit -m 'docs(mobile-no-collar-states-pingo): #159 E1 traceability'
Tras e1-3 no escribas nada mas en ningun fichero. Ensena en la terminal
`git log --oneline <H0E1>..HEAD` (3 commits) y `git status --short`
(vacio). El hash de e1-3 lo anota el leader. No rebasees.

== REGLAS CRITICAS ==

- Solo tests. src/screens/map/index.tsx solo cambia en el commit rojo (la
  mutacion de tasks.md) y vuelve a 664b95a7 en el verde. No toques ningun
  otro fichero de produccion, ni siquiera en las sondas.
- Skills: NO cargues ninguna skill de expo ni de .agents/skills/. No hay
  ninguna para esto: son tres its de jest sobre una pantalla que no
  cambia. La guia que necesitas esta aqui y en docs/conventions.md.
- Convenciones: docs/conventions.md §Tests y §Esperas. Se espera a un nodo
  del arbol (`findByTestId`, `waitFor` sobre `getByTestId(...)`), NUNCA al
  contador de un mock. Una ausencia se ancla a un nodo positivo del mismo
  render: las filas de R4 esperan antes a `map-no-tracking-title` y
  aseveran el cuerpo con el literal entero, como las filas existentes.
  Copia esas tres lineas de `no pinta el botón a %s` tal cual.
- Reutiliza lo que ya hay en el fichero: `renderMap`, `makePet`,
  `makeDevice`, `within`, `noTrackingAfterDetail` (vive dentro del
  describe de R4 y el it.each nuevo va en ese describe). No dupliques
  helpers ni imports. Imports nombrados, nunca `import * as`.
- Valores esperados LITERALES ('Vincular collar', el cuerpo entero), nunca
  un simbolo importado de produccion.
- design-drift recorre este test: no escribas `#159` en ninguna cadena ni
  comentario nuevo (el guard de hex lo caza). Los its nuevos no necesitan
  comentarios.
- Ni `bun add` ni cambios en package.json, bun.lock ni app.json. Todo con
  bun/bunx, nunca npm/npx. Nada de prettier (mobile no lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, progress/review_mobile-no-collar-states-pingo.md,
  requirements.md, design.md y tasks.md de la spec (frontmatter y
  casillas de §Aprobacion incluidas, tambien la de R10), y las secciones
  de la ronda 1 del impl. Lo que tengas que contar va en tu seccion
  `# Ronda 2 — Enmienda E1` del impl.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push, ni rebase, ni merge, ni abras la PR: lo hace el leader.

Ficheros que TU cambias en la ronda 2 (3, ni uno mas; medido desde H0E1):
  mobile-pet-tracker/src/screens/map/index.test.tsx
  progress/impl_mobile-no-collar-states-pingo.md
  specs/mobile-no-collar-states-pingo/traceability.md
src/screens/map/index.tsx cambia en e1-1 y vuelve en e1-2: su diff neto
contra H0E1 es cero y por eso no sale en la lista. Si el leader commitea
en mitad, solo tocara ficheros excluidos por los pathspecs de la lista
cerrada. Cualquier otro fichero ajeno es motivo de parada.

== ENTORNO ==

Otras sesiones en la maquina: Frontend (#134, Pet-Tracker-wt-134) y
Backend (#158, Pet-Tracker-wt-158). Las dos corren jest fichero a
fichero. El jest de un solo fichero no espera a nadie. El BASE y el ALL
del Cierre esperan a `pgrep -af '[i]nit\.sh'` vacio.

Al terminar, tu seccion `# Ronda 2 — Enmienda E1` del impl debe tener:
pwd, branch, H0E1 y status; los exits de BASE (fetch e is-ancestor,
664b95a7, router.d.ts y node_modules); las anclas A1-A14 en H0E1 y en el
cierre; la base del Mapa con su exit; e1-1 con su comando, su linea
`Tests:`, su exit y cada it rojo con su matcher y Expected/Received o la
consulta, mas typecheck y lint; e1-2 con sus lineas `Tests:` (Mapa y
GUARDAS), typecheck, lint y el exit del diff contra 664b95a7; las sondas
E1a-E1e con su grep, su linea `Tests:`, sus `●` y su `limpio=0`; el
cierre (BASE con 754, ALL con exit y totales, typecheck, lint, diffs y
log); la lista cerrada; la linea `R10: pendiente del smoke humano`; y
cualquier decision que la spec no cerrara literalmente.
```
