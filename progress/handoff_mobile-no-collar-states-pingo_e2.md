# Handoff a Codex CLI — #159 mobile-no-collar-states-pingo, ronda 3 (enmienda E2)

> Pega el bloque de abajo en Codex CLI. La enmienda E2 está firmada vía
> Notion; el commit de firma es `4146ac24` de esta branch. Las rondas 1 y 2
> (`progress/handoff_mobile-no-collar-states-pingo.md` y `..._e1.md`) ya se
> cumplieron y no se rehacen. La ronda 2 se rechazó por B2
> (`progress/review_mobile-no-collar-states-pingo.md` §Ronda 2): el candado de
> R3 contra el listado solo probaba `family` sin collar, y las sondas P6
> (`walker`), P6b (`vet`) y X1 (collar del listado) salieron verdes
> (114/114). E2 solo cambia tests: un `it` de R3 pasa a `it.each` de seis
> filas. La producción es correcta y acaba idéntica a `664b95a7`. El rojo sale
> de una mutación de producción que se versiona en el commit rojo y se revierte
> en el verde (C4, quinto punto). Son tres commits: rojo, verde y trazabilidad.
> Las sondas E2a-E2d se plantan, se miden y se revierten sin commit. La prueba
> de humo de R10, en un dev build de Android, sigue siendo del humano.
>
> El leader midió en `4146ac24`, antes de escribir este fichero, la base del
> test del Mapa (exit=0, 114 passed, ningún `●`) y `router.d.ts` ausente.
> También corrió las anclas A1-A13 de == ANCLAS == contra una copia del
> árbol de H0E2 y contra otra con el `it.each` y la mutación del rojo ya
> plantados, y los greps de las cadenas e2-1 y de las sondas contra su
> mutación. Todas dan el valor que pone abajo. `mobile-pet-tracker/` en
> `4146ac24` es idéntico al de `340967ba`, la punta de la ronda 2.
> `node_modules` ya está instalado.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-159   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas en una seccion NUEVA al FINAL de
progress/impl_mobile-no-collar-states-pingo.md:
`# Ronda 3 — Enmienda E2` > `## Base E2`. No edites nada de las rondas 1
y 2 de ese fichero: solo anades al final. El hash es H0E2: el commit que
anade este fichero (progress/handoff_mobile-no-collar-states-pingo_e2.md).
En todos los comandos de abajo, sustituye `<H0E2>` por ese hash literal.
PARA si la branch no es feature/159-mobile-no-collar-states-pingo o si
`git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-134, Pet-Tracker-wt-155, Pet-Tracker-wt-158,
Pet-Tracker-wt-backend ni ningun otro worktree, ni cambies de branch en
ninguno.

Feature: mobile-no-collar-states-pingo (#159), RONDA 3
Branch: feature/159-mobile-no-collar-states-pingo
Spec: specs/mobile-no-collar-states-pingo/requirements.md §Enmienda E2,
firmada en 4146ac24. Tu guion LITERAL es
specs/mobile-no-collar-states-pingo/tasks.md §Enmienda E2 — ronda 3
(desde «## Enmienda E2» hasta el final del fichero).
Lee enteros antes de empezar:
  - requirements.md §Enmienda E2
  - tasks.md §Enmienda E2 — ronda 3
  - specs/mobile-no-collar-states-pingo/traceability.md
  - progress/review_mobile-no-collar-states-pingo.md §Ronda 2 (B2, las
    sondas P6 y P6b) y §Barrido de la Enmienda E2 (X1)
El bloque `it.each` de tasks.md (1) es LITERAL: copialo tal cual, con sus
tildes, sus dos puntos, su `$role $collar` y su sangria de dos espacios.

== QUE HACES ==

Tres commits, en este orden:
  e2-1  rojo: el it.each en src/screens/map/index.test.tsx y la mutacion
        versionada en src/screens/map/index.tsx.
  e2-2  verde: revierte la mutacion. src/screens/map/index.tsx vuelve a
        ser identico a 664b95a7.
  (sondas E2a-E2d sobre el verde, sin commit)
  e2-3  trazabilidad: traceability.md y el impl, con la lista cerrada.

El rojo SIEMPRE sale de la mutacion de produccion de tasks.md (1). Nunca
toques un doble de test (mockListPets, mockGetPet, makePet...) para
fabricar un rojo.

Esto manda sobre tasks.md:
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y con la salida a un
  fichero, como en las cadenas de abajo.
- Si la base del test del Mapa no da 114, NO recalcules las cuentas
  (tasks.md dice «base + 5»; aqui no): PARA y anota la medida. El leader
  reescribe las cadenas.
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

== FLAKE CONOCIDO: UNA SOLA REPETICION ==

En el mismo fichero del Mapa vive un test previo con un `waitFor` sobre
el contador de un mock (deuda de #72, fuera de alcance; NO lo toques):
  R4: map resuelve la mascota seleccionada › selects the first pet and loads its first position (#72 R2)
Con la maquina cargada a veces falla con `Number of calls: 0`. Antes de
CADA jest ejecuta `uptime` y anota su salida en el impl. Si una medida
difiere de lo esperado UNICAMENTE en ese it, y su fallo dice
`Number of calls: 0`, copia al impl su `●` y la linea `Tests:` del
intento 1 y repite UNA vez el mismo comando, sobrescribiendo el mismo
fichero de /tmp. Si el intento 2 da lo esperado, sigue con la cadena tal
cual. Cualquier otra desviacion, en el intento 1 o en el 2, es PARADA.
Esa repeticion vale para cualquier medida de esta ronda (base, rojo,
verde, sondas, BASE y ALL), una vez por medida.

== PARADA ==

Una PARADA escrita es FINAL. En cuanto escribas `PARADA` en el impl, no
ejecutes nada mas: ni para corregirla, ni para seguir. Si crees que es
un falso positivo, dilo en esa misma seccion y para igual: decide el
leader. El criterio de una medida es SOLO su `exit=` y sus lineas
`Test Suites:` y `Tests:`, mas los greps que ponen las cadenas de abajo.
No escribas comprobadores propios (scripts en /tmp que parseen la salida
de jest): en la ronda 2 uno de ellos tomo los bloques `● Console` por
tests rojos y escribio una PARADA falsa. Los bloques `● Console` son
salida de consola, no tests: por eso las cadenas cuentan `^  ● .+ › `
(un test rojo lleva ` › ` entre su describe y su titulo).

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
  Hoy da 0. Si da 1 (algo mergeo en main despues), NO pares: trabajas
  sobre H0E2 igual y el merge de main lo hace el leader al cerrar.
  Nunca rebasees ni mergees.
- `git merge-base --is-ancestor 340967ba HEAD; echo "exit=$?"`  -> exit=0
- `git diff --quiet 340967ba HEAD -- .; echo "exit=$?"`         -> exit=0
- `git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"` -> exit=0
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"`           -> exit=0.
  Va en cada cadena de commit. Si un dia da 1, PARA y pide al humano que
  lo borre. Nunca `rm -f` (tu sandbox lo deniega).
- `test -d node_modules && echo presente`                       -> presente
- Base del test del Mapa (con `uptime` antes):
    FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2-base.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       114 passed, 114 total` (el leader midio lo
       mismo en 4146ac24). Si no, aplica == FLAKE == y, si sigue sin
       dar, PARA.
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina. Espera a que salga vacio antes del BASE y del ALL del Cierre.
  El jest de un solo fichero (base, rojo, verde, sondas) no espera.

Comando GUARDAS (candados de copy y de carta; siempre 30 + 62 + 55 + 27 = 174):
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
Comando BASE (los 10 ficheros de la ronda 1; ninguna ruta lleva parentesis):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
Comando ALL (la suite entera; `pgrep` vacio antes y nada mas en marcha
mientras corre):
  FORCE_COLOR=0 bunx jest

== ANCLAS ==

Desde mobile-pet-tracker/. Corre las 13 en H0E2 (antes de tocar nada) y
otra vez en el Cierre. Pega en el impl cada salida junto a su valor
esperado. Formato: `comando` -> H0E2 / cierre.
A1  grep -cF "it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle'" src/screens/map/index.test.tsx   -> 1 / 0
A2  grep -cF 'aunque el listado diga $role $collar: manda el rol y el collar del detalle' src/screens/map/index.test.tsx   -> 0 / 1
A3  grep -cE "^    \{ role: '(family|walker|vet)', collar: '(sin|con) collar', device: (null|makeDevice\('online'\)) \},$" src/screens/map/index.test.tsx   -> 0 / 6
A4  grep -cF "mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet({ myRole: role, device })] });" src/screens/map/index.test.tsx   -> 0 / 1
A5  grep -cF 'aunque el listado' src/screens/map/index.test.tsx   -> 3 / 3
A6  grep -cF "within(action).getByText('Vincular collar')" src/screens/map/index.test.tsx   -> 3 / 3
A7  grep -cF "it('pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle'" src/screens/map/index.test.tsx   -> 1 / 1
A8  grep -cF "('no pinta el botón a %s aunque el listado diga owner'" src/screens/map/index.test.tsx   -> 1 / 1
A9  grep -cF "it('lleva a emparejar una sola vez'" src/screens/map/index.test.tsx   -> 1 / 1
A10 grep -cF 'selectedPet?.myRole !==' src/screens/map/index.tsx   -> 0 / 0
A11 grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx   -> 1 / 1
A12 grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx   -> 1 / 1
A13 git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"   -> exit=0 / exit=0
Si alguna no da su valor de H0E2, PARA antes de tocar nada.

== COMO SE HACE CADA COMMIT ==

Todo desde mobile-pet-tracker/ (el `cd` literal de BASE). Cada commit va
ENCADENADO con && a su verificacion: si cualquier eslabon falla, el
commit no se hace. Nunca commitees fuera de estas cadenas. Si una cadena
no llega al commit, ejecuta cada eslabon por separado con su
`echo "exit=$?"` hasta dar con el que falla, anota en el impl ese eslabon
y su salida, y PARA (ver == PARADA ==). No cambies ningun eslabon.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). Cada medida lleva
su `echo "exit=$?"`. Anota el exit en el impl.

Rojos: los cuatro caen por CONSULTA (`Unable to find an element with
testID: map-no-tracking-action`). Nunca por TypeError, ReferenceError,
SyntaxError, `Test suite failed to run` ni `Cannot find module`. Copia al
impl cada it rojo con su consulta. Si un bloque de error ocupa mas de 20
lineas, copia su cabecera `●`, la linea de la consulta y nada mas.

Typecheck y lint van en TODAS las cadenas, la roja incluida, y dan exit 0.

`<LIMPIO>`, tras el `git add`, comprueba que no queda nada sin stagear en
mobile-pet-tracker/, docs/ ni specs/:
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
NUNCA `git status --short` tras un `git add`: falla siempre (lo stageado
sale). El impl vive en progress/ y no se stagea hasta e2-3.

== COMMITS ==

e2-1, rojo (tasks.md (1)). En src/screens/map/index.test.tsx, dentro de
`describe('#159 R3: el dueño sin collar puede ir a emparejar'`, borra el
it entero que empieza por
  it('pinta Vincular collar aunque el listado diga otro rol: manda el rol del detalle', async () => {
(8 lineas, hasta su `  });` inclusive) y pon en su lugar el bloque
`it.each` de tasks.md (1). El it siguiente,
`it('pinta Vincular collar aunque el listado traiga collar: ...`, queda
justo debajo y no cambia. Ningun otro it cambia.
Despues planta la mutacion de tasks.md en `const canPairCollar =` de
src/screens/map/index.tsx: JUSTO ENCIMA de la linea
`    detail.data.pet.myRole === 'owner' &&` (que se queda igual) anades
estas dos, con la misma sangria de cuatro espacios:
    selectedPet?.myRole !== 'walker' &&
    selectedPet?.myRole !== 'vet' &&
Ninguna otra linea del fichero cambia.
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2-r.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 115 passed, 119 total`
  grep -qE '^Tests: +4 failed, 115 passed, 119 total$' /tmp/159-e2-r.txt \
    && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2-r.txt)" = 4 \
    && test "$(grep -E '^  ● .+ › ' /tmp/159-e2-r.txt | grep -cE 'aunque el listado diga (walker|vet) (sin|con) collar: manda el rol y el collar del detalle')" = 4 \
    && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2-r.txt)" = 4 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-e2-r.txt \
    && test "$(grep -cF "selectedPet?.myRole !== 'walker' &&" src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF "selectedPet?.myRole !== 'vet' &&" src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx)" = 1 \
    && test "$(git diff --numstat 664b95a7 -- src/screens/map/index.tsx | cut -f1,2 | tr '\t' ' ')" = '2 0' \
    && test "$(git diff --numstat HEAD -- src/screens/map/index.test.tsx | cut -f1,2 | tr '\t' ' ')" = '9 2' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/map/index.test.tsx mobile-pet-tracker/src/screens/map/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 E2 red pair action obeys list role except family'
  Los 4 rojos son las filas walker y vet, con y sin collar, todas por
  consulta. Las dos filas family quedan verdes.
  (`9 2` = 9 lineas anadidas y 2 borradas en el test: el bloque nuevo
  frente al it viejo. `2 0` = las dos lineas de la mutacion.)

e2-2, verde (tasks.md (2)):
  git checkout 664b95a7 -- src/screens/map/index.tsx && git diff --quiet 664b95a7 -- src/screens/map/index.tsx; echo "exit=$?"
    -> exit=0
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2-g.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       119 passed, 119 total`
  <GUARDAS> > /tmp/159-e2-g-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       174 passed, 174 total`
  grep -qE '^Tests: +119 passed, 119 total$' /tmp/159-e2-g.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-e2-g-guardas.txt \
    && git diff --quiet 664b95a7 -- src/screens/map/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'fix(mobile-no-collar-states): #159 E2 revert list role probe, pair action locked to detail role' \
    && git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
    -> exit=0
  (`git checkout <commit> -- <fichero>` deja el fichero en el indice; aqui
  no importa porque la cadena lo stagea igual.)

== SONDAS ==

Sobre el HEAD de e2-2, UNA A UNA, en `const canPairCollar =` de
src/screens/map/index.tsx. Cada sonda SUSTITUYE la linea
`    detail.data.pet.myRole === 'owner' &&` por la suya, con la misma
sangria de cuatro espacios. Para cada sonda (X = a, b, c, d):
  1. planta la mutacion y corre su grep -> 1
  2. uptime; FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e2X.txt 2>&1; echo "exit=$?"
     -> exit=1
  3. corre su comprobacion -> sonda=0. Copia al impl la linea `Tests:` y
     los `●`.
  4. git checkout HEAD -- src/screens/map/index.tsx && git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
     -> limpio=0
Si una sonda no da sonda=0 (tras == FLAKE == si aplica), restaura (paso
4) y PARA. Ninguna sonda se commitea.

E2a  la linea pasa a `    selectedPet?.myRole !== 'walker' && detail.data.pet.myRole === 'owner' &&`
     grep: grep -cF "selectedPet?.myRole !== 'walker' && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx   -> 1
     -> `Tests:       2 failed, 117 passed, 119 total`; ● las filas walker sin collar y walker con collar
     comprobacion:
     grep -qE '^Tests: +2 failed, 117 passed, 119 total$' /tmp/159-e2a.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2a.txt)" = 2 && test "$(grep -E '^  ● .+ › ' /tmp/159-e2a.txt | grep -cE 'aunque el listado diga walker (sin|con) collar: ')" = 2 && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2a.txt)" = 2; echo "sonda=$?"
E2b  la linea pasa a `    selectedPet?.myRole !== 'vet' && detail.data.pet.myRole === 'owner' &&`
     grep: grep -cF "selectedPet?.myRole !== 'vet' && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx   -> 1
     -> `Tests:       2 failed, 117 passed, 119 total`; ● las filas vet sin collar y vet con collar
     comprobacion:
     grep -qE '^Tests: +2 failed, 117 passed, 119 total$' /tmp/159-e2b.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2b.txt)" = 2 && test "$(grep -E '^  ● .+ › ' /tmp/159-e2b.txt | grep -cE 'aunque el listado diga vet (sin|con) collar: ')" = 2 && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2b.txt)" = 2; echo "sonda=$?"
E2c  la linea pasa a `    selectedPet?.myRole !== 'family' && detail.data.pet.myRole === 'owner' &&`
     grep: grep -cF "selectedPet?.myRole !== 'family' && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx   -> 1
     -> `Tests:       2 failed, 117 passed, 119 total`; ● las filas family sin collar y family con collar
     comprobacion:
     grep -qE '^Tests: +2 failed, 117 passed, 119 total$' /tmp/159-e2c.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2c.txt)" = 2 && test "$(grep -E '^  ● .+ › ' /tmp/159-e2c.txt | grep -cE 'aunque el listado diga family (sin|con) collar: ')" = 2 && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2c.txt)" = 2; echo "sonda=$?"
E2d  la linea pasa a `    (selectedPet?.myRole === 'owner' || selectedPet?.device === null) && detail.data.pet.myRole === 'owner' &&`
     grep: grep -cF "(selectedPet?.myRole === 'owner' || selectedPet?.device === null) && detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx   -> 1
     -> `Tests:       3 failed, 116 passed, 119 total`; ● las filas family con collar, walker con collar y vet con collar
     comprobacion:
     grep -qE '^Tests: +3 failed, 116 passed, 119 total$' /tmp/159-e2d.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e2d.txt)" = 3 && test "$(grep -E '^  ● .+ › ' /tmp/159-e2d.txt | grep -cE 'aunque el listado diga (family|walker|vet) con collar: ')" = 3 && test "$(grep -cF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-e2d.txt)" = 3; echo "sonda=$?"

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe,
con la salida al impl:
- `pgrep -af '[i]nit\.sh'` vacio. Despues `uptime` y el comando BASE
  `> /tmp/159-e2-final.txt 2>&1; echo "exit=$?"`
  -> exit=0, `Test Suites: 10 passed, 10 total` y
     `Tests:       759 passed, 759 total` (754 de la ronda 2 + 5; map 119)
- `pgrep -af '[i]nit\.sh'` vacio otra vez. Despues `uptime` y el comando
  ALL `> /tmp/159-e2-all.txt 2>&1; echo "exit=$?"`
  -> exit=0, `Test Suites: 97 passed, 97 total` y
     `Tests:       2425 passed, 2425 total` (2420 de la ronda 2 + 5).
     Copia las dos lineas.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y
  `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0
- Las anclas A1-A13 con sus valores de cierre.
- `git diff --stat <H0E2> HEAD -- package.json bun.lock app.json src/theme` -> vacio
Desde la raiz (`cd /home/claude/sites/Pet-Tracker-wt-159 && pwd`):
- `git log --oneline <H0E2>..HEAD` -> exactamente e2-1 y e2-2
- `git diff --numstat <H0E2> HEAD -- mobile-pet-tracker/`
  -> exactamente una linea: `9	2	mobile-pet-tracker/src/screens/map/index.test.tsx`
- `git diff --quiet 664b95a7 HEAD -- mobile-pet-tracker/src/screens/map/index.tsx; echo "exit=$?"` -> exit=0
- `git diff --stat <H0E2> HEAD -- backend-pet-tracker/ infra-pet-tracker/ docs/` -> vacio

Despues edita specs/mobile-no-collar-states-pingo/traceability.md: solo
la fila R3, y nada mas del fichero. Sustituye <ROJO> y <VERDE> por los
hashes cortos de e2-1 y e2-2. La fila queda asi, en una sola linea:
| R3 | `src/screens/map/index.test.tsx::#159 R3: el dueño sin collar puede ir a emparejar` (E1: `pinta Vincular collar aunque el listado diga $role $collar: manda el rol y el collar del detalle` (family, walker y vet, con y sin collar; sondas E2a-E2d), `pinta Vincular collar aunque el listado traiga collar: manda el collar del detalle`) | f346baf3 test(mobile-no-collar-states): #159 R3 red pair collar action → 9b89f6c8 feat(mobile-no-collar-states): #159 R3 pair collar action on map; E1: 3224d502 test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list → 203ea96e fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail; E2: <ROJO> test(mobile-no-collar-states): #159 E2 red pair action obeys list role except family → <VERDE> fix(mobile-no-collar-states): #159 E2 revert list role probe, pair action locked to detail role |
Comprueba, desde la raiz:
  git diff -U0 -- specs/mobile-no-collar-states-pingo/traceability.md | grep -E '^[-+]\|' | cut -c1-8
    -> exactamente dos lineas: `-| R3 | ` y `+| R3 | `
  grep -cF '; E2: ' specs/mobile-no-collar-states-pingo/traceability.md   -> 1

Lista cerrada, desde la raiz, con traceability.md y el impl ya editados y
sin commitear (sin HEAD: compara el arbol con H0E2):
  git diff --name-only <H0E2> -- . ':!feature_list.json' ':!progress/current.md' ':!progress/review_mobile-no-collar-states-pingo.md' ':!specs/mobile-no-collar-states-pingo/requirements.md' ':!specs/mobile-no-collar-states-pingo/design.md' ':!specs/mobile-no-collar-states-pingo/tasks.md' | LC_ALL=C sort
    -> exactamente estos 3:
       mobile-pet-tracker/src/screens/map/index.test.tsx
       progress/impl_mobile-no-collar-states-pingo.md
       specs/mobile-no-collar-states-pingo/traceability.md
  test -z "$(git ls-files --others --exclude-standard)"; echo "exit=$?"   -> exit=0
Pega las dos salidas en el impl y termina tu seccion con la linea
`R10: pendiente del smoke humano`. Despues e2-3, desde la raiz:
  git add specs/mobile-no-collar-states-pingo/traceability.md progress/impl_mobile-no-collar-states-pingo.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-no-collar-states-pingo.md specs/mobile-no-collar-states-pingo/traceability.md ' \
    && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" \
    && git commit -m 'docs(mobile-no-collar-states-pingo): #159 E2 traceability'
Tras e2-3 no escribas nada mas en ningun fichero. Ensena en la terminal
`git log --oneline <H0E2>..HEAD` (3 commits) y `git status --short`
(vacio). El hash de e2-3 lo anota el leader. No rebasees.

== REGLAS CRITICAS ==

- Solo tests. src/screens/map/index.tsx solo cambia en el commit rojo (la
  mutacion de tasks.md) y vuelve a 664b95a7 en el verde. No toques ningun
  otro fichero de produccion, ni siquiera en las sondas.
- Skills: NO cargues ninguna skill de expo ni de .agents/skills/. No hay
  ninguna para esto: es un it.each de jest sobre una pantalla que no
  cambia. La guia que necesitas esta aqui y en docs/conventions.md.
- Convenciones: docs/conventions.md §Tests y §Esperas. Se espera a un nodo
  del arbol (`findByTestId`), NUNCA al contador de un mock. El bloque de
  tasks.md ya lo cumple: copialo tal cual.
- Reutiliza lo que ya hay en el fichero: `renderMap`, `makePet`,
  `makeDevice`, `within`, `screen`, `mockListPets`, `mockGetPet`,
  `mockGetLastPosition`. No dupliques helpers ni imports. No anadas
  imports: el bloque no los necesita.
- Valores esperados LITERALES ('Vincular collar'), nunca un simbolo
  importado de produccion.
- design-drift recorre este test: no escribas `#159` en ninguna cadena ni
  comentario nuevo (el guard de hex lo caza). El it.each no lleva
  comentarios.
- Ni `bun add` ni cambios en package.json, bun.lock ni app.json. Todo con
  bun/bunx, nunca npm/npx. Nada de prettier (mobile no lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, progress/review_mobile-no-collar-states-pingo.md,
  requirements.md, design.md y tasks.md de la spec (frontmatter y
  casillas de §Aprobacion y de tasks.md incluidas, tambien la de R10), y
  las secciones de las rondas 1 y 2 del impl. Lo que tengas que contar va
  en tu seccion `# Ronda 3 — Enmienda E2` del impl.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push, ni rebase, ni merge, ni abras la PR: lo hace el leader.

Ficheros que TU cambias en la ronda 3 (3, ni uno mas; medido desde H0E2):
  mobile-pet-tracker/src/screens/map/index.test.tsx
  progress/impl_mobile-no-collar-states-pingo.md
  specs/mobile-no-collar-states-pingo/traceability.md
src/screens/map/index.tsx cambia en e2-1 y vuelve en e2-2: su diff neto
contra H0E2 es cero y por eso no sale en la lista. Si el leader commitea
en mitad, solo tocara ficheros excluidos por los pathspecs de la lista
cerrada. Cualquier otro fichero ajeno es motivo de parada.

== ENTORNO ==

Otras sesiones en la maquina (4 CPU): Frontend (#134, Pet-Tracker-wt-134)
y Backend (#158, Pet-Tracker-wt-158). Las dos corren jest y a veces
init.sh. El jest de un solo fichero no espera a nadie. El BASE y el ALL
del Cierre esperan a `pgrep -af '[i]nit\.sh'` vacio. La carga alta es la
que despierta el flake de == FLAKE ==: por eso el `uptime` antes de cada
jest.

Al terminar, tu seccion `# Ronda 3 — Enmienda E2` del impl debe tener:
pwd, branch, H0E2 y status; los exits de BASE (fetch e is-ancestor,
340967ba, 664b95a7, router.d.ts y node_modules); las anclas A1-A13 en
H0E2 y en el cierre; la base del Mapa con su uptime y su exit; e2-1 con
su comando, su linea `Tests:`, su exit y cada it rojo con su consulta,
mas typecheck y lint; e2-2 con sus lineas `Tests:` (Mapa y GUARDAS),
typecheck, lint y el exit del diff contra 664b95a7; las sondas E2a-E2d
con su grep, su linea `Tests:`, sus `●`, su sonda=0 y su limpio=0; el
cierre (BASE con 759, ALL con exit y totales, typecheck, lint, diffs y
log); la comprobacion de traceability; la lista cerrada; cada repeticion
de == FLAKE == si la hubo; la linea `R10: pendiente del smoke humano`; y
cualquier decision que la spec no cerrara literalmente.
```
