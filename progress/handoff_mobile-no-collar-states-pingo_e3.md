# Handoff a Codex CLI — #159 mobile-no-collar-states-pingo, ronda 4 (enmienda E3)

> Pega el bloque de abajo en Codex CLI. La enmienda E3 está firmada vía
> Notion; el commit de firma es `9e475054` de esta branch. Las rondas 1, 2 y 3
> (`progress/handoff_mobile-no-collar-states-pingo.md`, `..._e1.md` y
> `..._e2.md`) ya se cumplieron y no se rehacen. La ronda 3 se rechazó por B3
> (`progress/review_mobile-no-collar-states-pingo.md` §Ronda 3): la inversa de
> R4 contra el listado solo vigilaba listados `owner` sin collar y del mismo
> rol, y las mutaciones M7, M8 y M9, que leen el listado, quedaban verdes
> (119/119). E3 solo añade tests: la tabla de verdad entera del lado R4 contra
> el listado, con 18 detalles × 8 listados más 8 filas de detalle pendiente,
> es decir 152 `it` nuevos (119 → 271). La producción es correcta y acaba
> idéntica a `664b95a7`. El rojo sale de una mutación de producción que se
> versiona en el commit rojo y se revierte en el verde (C4, quinto punto). Son
> tres commits: rojo, verde y trazabilidad. Las sondas E3a-E3f se plantan, se
> miden y se revierten sin commit. La prueba de humo de R10, en un dev build de
> Android, sigue siendo del humano.
>
> Antes de escribir este fichero, el leader midió en `9e475054` la base del
> test del Mapa (exit=0, 119 passed, ningún `●`) y confirmó que `router.d.ts`
> no existe. Después, en una copia del árbol fuera del worktree (con el
> `node_modules` del worktree enlazado), plantó el bloque de tasks.md (1) y la
> mutación del rojo y midió: `57 failed, 214 passed, 271 total`, 57
> `toBeNull` y ningún rojo por consulta; typecheck y lint con exit 0. El verde
> dio 271 passed. Las sondas dieron E3a 12, E3b 18, E3c 12, E3d 16, E3e 16 y
> E3f 8. Las anclas A1-A15, las cadenas e3-1 y e3-2, las comprobaciones de
> cada sonda y la de traceability se corrieron con GNU grep contra esas
> salidas y contra los ficheros plantados, y todas dan el valor que pone
> abajo. `mobile-pet-tracker/` en `9e475054` es idéntico al de `a8681b51`, la
> punta de la ronda 3. `node_modules` ya está instalado.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-159   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas en una seccion NUEVA al FINAL de
progress/impl_mobile-no-collar-states-pingo.md:
`# Ronda 4 — Enmienda E3` > `## Base E3`. No edites nada de las rondas 1,
2 y 3 de ese fichero: solo anades al final. El hash es H0E3: el commit que
anade este fichero (progress/handoff_mobile-no-collar-states-pingo_e3.md).
En todos los comandos de abajo, sustituye `<H0E3>` por ese hash literal.
PARA si la branch no es feature/159-mobile-no-collar-states-pingo o si
`git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-134, Pet-Tracker-wt-155, Pet-Tracker-wt-158,
Pet-Tracker-wt-backend ni ningun otro worktree, ni cambies de branch en
ninguno.

Feature: mobile-no-collar-states-pingo (#159), RONDA 4
Branch: feature/159-mobile-no-collar-states-pingo
Spec: specs/mobile-no-collar-states-pingo/requirements.md §Enmienda E3,
firmada en 9e475054. Tu guion LITERAL es
specs/mobile-no-collar-states-pingo/tasks.md §Enmienda E3 — ronda 4
(desde «## Enmienda E3» hasta el final del fichero).
Lee enteros antes de empezar:
  - requirements.md §Enmienda E3
  - tasks.md §Enmienda E3 — ronda 4
  - specs/mobile-no-collar-states-pingo/traceability.md
  - progress/review_mobile-no-collar-states-pingo.md §Ronda 3 (B3, M7, M8
    y M9) y §Barrido de la Enmienda E3 (G1 y G2)
El bloque tsx de tasks.md (1) es LITERAL: copialo tal cual, con sus
tildes, sus `$detalle`, `$listRole` y `$listCollar`. En tasks.md esta
dentro de una lista markdown con 4 columnas de sangria de mas: quitale
SOLO esas 4 columnas. En el fichero de test, su primera linea
(`  const LIST_STATES = ...`) queda con 2 espacios de sangria, como los
`it` del describe. Son 50 lineas.

== QUE HACES ==

Tres commits, en este orden:
  e3-1  rojo: el bloque en src/screens/map/index.test.tsx y la mutacion
        versionada en src/screens/map/index.tsx.
  e3-2  verde: revierte la mutacion. src/screens/map/index.tsx vuelve a
        ser identico a 664b95a7.
  (sondas E3a-E3f sobre el verde, sin commit)
  e3-3  trazabilidad: traceability.md y el impl, con la lista cerrada.

El rojo SIEMPRE sale de la mutacion de produccion de tasks.md (1). Nunca
toques un doble de test (mockListPets, mockGetPet, makePet, makeDevice,
noTrackingAfterDetail...) para fabricar un rojo.

Esto manda sobre tasks.md:
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y con la salida a un
  fichero, como en las cadenas de abajo.
- Si la base del test del Mapa no da 119, NO recalcules las cuentas
  (tasks.md dice «base + 152»; aqui no): PARA y anota la medida. El
  leader reescribe las cadenas.
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
  Hoy da 1: main ya trae #134 y #161, que esta branch no tiene. NO
  pares: trabajas sobre H0E3 igual y el merge de main lo hace el leader
  al cerrar. Nunca rebasees ni mergees.
- `git merge-base --is-ancestor a8681b51 HEAD; echo "exit=$?"`  -> exit=0
- `git diff --quiet a8681b51 HEAD -- .; echo "exit=$?"`         -> exit=0
- `git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"` -> exit=0
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"`           -> exit=0.
  Va en cada cadena de commit. Si un dia da 1, PARA y pide al humano que
  lo borre. Nunca `rm -f` (tu sandbox lo deniega).
- `test -d node_modules && echo presente`                       -> presente
- Base del test del Mapa (con `uptime` antes):
    FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e3-base.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       119 passed, 119 total` (el leader midio lo
       mismo en 9e475054). Si no, aplica == FLAKE == y, si sigue sin
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

Desde mobile-pet-tracker/. Corre las 15 en H0E3 (antes de tocar nada) y
otra vez en el Cierre. Pega en el impl cada salida junto a su valor
esperado. Formato: `comando` -> H0E3 / cierre.
A1  grep -cF "('no pinta el botón a %s aunque el listado diga owner'" src/screens/map/index.test.tsx   -> 1 / 1
A2  grep -cF 'const LIST_STATES = (' src/screens/map/index.test.tsx   -> 0 / 1
A3  grep -cF 'const DETAIL_STATES: { detalle: string; state: PetState }[] = [' src/screens/map/index.test.tsx   -> 0 / 1
A4  grep -cE "^    \{ detalle: '[^']+', state: \{ kind: " src/screens/map/index.test.tsx   -> 0 / 18
A5  grep -cF 'no pinta el botón con el detalle $detalle aunque el listado diga $listRole $listCollar' src/screens/map/index.test.tsx   -> 0 / 1
A6  grep -cF 'no pinta el botón mientras el detalle carga aunque el listado diga $listRole $listCollar' src/screens/map/index.test.tsx   -> 0 / 1
A7  grep -cF 'aunque el listado' src/screens/map/index.test.tsx   -> 3 / 5
A8  grep -cF "expect(screen.queryByTestId('map-no-tracking-action')).toBeNull();" src/screens/map/index.test.tsx   -> 5 / 7
A9  grep -cF 'mockGetPet.mockReturnValue(pending<PetState>());' src/screens/map/index.test.tsx   -> 4 / 5
A10 grep -cF 'function noTrackingAfterDetail(detailState: PetState) {' src/screens/map/index.test.tsx   -> 1 / 1
A11 grep -cF '#159' src/screens/map/index.test.tsx   -> 3 / 3
A12 grep -cF "detail.data.pet.myRole === 'owner' &&" src/screens/map/index.tsx   -> 1 / 1
A13 grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx   -> 1 / 1
A14 grep -cF 'selectedPet?.' src/screens/map/index.tsx   -> 2 / 2
A15 git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"   -> exit=0 / exit=0
Si alguna no da su valor de H0E3, PARA antes de tocar nada.

== COMO SE HACE CADA COMMIT ==

Todo desde mobile-pet-tracker/ (el `cd` literal de BASE). Cada commit va
ENCADENADO con && a su verificacion: si cualquier eslabon falla, el
commit no se hace. Nunca commitees fuera de estas cadenas. Si una cadena
no llega al commit, ejecuta cada eslabon por separado con su
`echo "exit=$?"` hasta dar con el que falla, anota en el impl ese eslabon
y su salida, y PARA (ver == PARADA ==). No cambies ningun eslabon.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). Cada medida lleva
su `echo "exit=$?"`. Anota el exit en el impl.

Rojos: todos caen por ASERCION (`expect(received).toBeNull()`): el boton
se pinta cuando no debe. Ninguno cae por consulta (`Unable to find an
element`), ni por TypeError, ReferenceError, SyntaxError,
`Test suite failed to run` o `Cannot find module`. No copies al impl el
bloque de cada rojo (cada uno vuelca el arbol del boton, decenas de
lineas): copia la linea `Tests:` y la lista de sus `●` con
  grep -E '^  ● .+ › ' <fichero>
y nada mas.

Typecheck y lint van en TODAS las cadenas, la roja incluida, y dan exit 0.

`<LIMPIO>`, tras el `git add`, comprueba que no queda nada sin stagear en
mobile-pet-tracker/, docs/ ni specs/:
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
NUNCA `git status --short` tras un `git add`: falla siempre (lo stageado
sale). El impl vive en progress/ y no se stagea hasta e3-3.

== COMMITS ==

e3-1, rojo (tasks.md (1)). En src/screens/map/index.test.tsx, dentro de
`describe('#159 R4: nadie más ve el botón de emparejar'`, busca el
it.each que empieza por
  it.each(['family', 'walker', 'vet'] as const)('no pinta el botón a %s aunque el listado diga owner', async (role) => {
Termina en su `  });` (8 lineas en total), y la linea siguiente es el
`});` que cierra el describe. Entre ese `  });` y ese `});` anade UNA
linea en blanco y despues el bloque tsx de tasks.md (1) (50 lineas, sin
las 4 columnas de sangria de la lista). El `});` del describe queda justo
debajo de la ultima linea del bloque (`  );`). Ningun it existente
cambia.
Despues planta la mutacion de tasks.md en `const canPairCollar =` de
src/screens/map/index.tsx. La linea `    detail.data?.kind === 'ok' &&`
se queda igual. Las dos siguientes,
    detail.data.pet.myRole === 'owner' &&
    detail.data.pet.device === null;
pasan a ser estas dos, con la misma sangria de cuatro espacios:
    (detail.data.pet.myRole === 'owner' || Boolean(selectedPet?.device)) &&
    (detail.data.pet.device === null || selectedPet?.myRole !== 'owner');
Ninguna otra linea del fichero cambia.
  uptime; FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e3-r.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       57 failed, 214 passed, 271 total`
  grep -qE '^Tests: +57 failed, 214 passed, 271 total$' /tmp/159-e3-r.txt \
    && test "$(grep -cE '^  ● .+ › ' /tmp/159-e3-r.txt)" = 57 \
    && test "$(grep -cF '  ● #159 R4: nadie más ve el botón de emparejar › no pinta el botón con el detalle ' /tmp/159-e3-r.txt)" = 57 \
    && test "$(grep -E '^  ● .+ › ' /tmp/159-e3-r.txt | grep -cE 'con el detalle owner con collar( offline| sin conectividad)? aunque el listado diga (family|walker|vet) (sin|con) collar$')" = 18 \
    && test "$(grep -E '^  ● .+ › ' /tmp/159-e3-r.txt | grep -cE 'con el detalle (family|walker|vet) sin collar aunque el listado diga (owner|family|walker|vet) con collar$')" = 12 \
    && test "$(grep -E '^  ● .+ › ' /tmp/159-e3-r.txt | grep -cE 'con el detalle (family|walker|vet) con collar( offline| sin conectividad)? aunque el listado diga (family|walker|vet) con collar$')" = 27 \
    && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e3-r.txt)" = 57 \
    && ! grep -qF 'Unable to find an element' /tmp/159-e3-r.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-e3-r.txt \
    && test "$(grep -cF "(detail.data.pet.myRole === 'owner' || Boolean(selectedPet?.device)) &&" src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF "(detail.data.pet.device === null || selectedPet?.myRole !== 'owner');" src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF "detail.data?.kind === 'ok' &&" src/screens/map/index.tsx)" = 1 \
    && test "$(git diff --numstat 664b95a7 -- src/screens/map/index.tsx | cut -f1,2 | tr '\t' ' ')" = '2 2' \
    && test "$(git diff --numstat HEAD -- src/screens/map/index.test.tsx | cut -f1,2 | tr '\t' ' ')" = '51 0' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/map/index.test.tsx mobile-pet-tracker/src/screens/map/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 E3 red pair action follows list role and collar'
  Los 57 rojos son todos del primer it.each (`no pinta el botón con el
  detalle ...`): 18 + 12 + 27. Las 8 filas de `mientras el detalle carga`
  y todos los it anteriores quedan verdes.
  (`51 0` = la linea en blanco mas las 50 del bloque, sin borrar nada.
  `2 2` = las dos lineas del predicado cambiadas.)

e3-2, verde (tasks.md (2)):
  git checkout 664b95a7 -- src/screens/map/index.tsx && git diff --quiet 664b95a7 -- src/screens/map/index.tsx; echo "exit=$?"
    -> exit=0
  uptime; FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e3-g.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       271 passed, 271 total`
  uptime; <GUARDAS> > /tmp/159-e3-g-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       174 passed, 174 total`
  grep -qE '^Tests: +271 passed, 271 total$' /tmp/159-e3-g.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-e3-g-guardas.txt \
    && git diff --quiet 664b95a7 -- src/screens/map/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'fix(mobile-no-collar-states): #159 E3 revert list probe, no pair action whatever the list says' \
    && git diff --quiet 664b95a7 HEAD -- src/screens/map/index.tsx; echo "exit=$?"
    -> exit=0
  (`git checkout <commit> -- <fichero>` deja el fichero en el indice; aqui
  no importa porque la cadena lo stagea igual.)

== SONDAS ==

Sobre el HEAD de e3-2, UNA A UNA, en `const canPairCollar =` de
src/screens/map/index.tsx. Hoy ese predicado son estas tres lineas:
    detail.data?.kind === 'ok' &&
    detail.data.pet.myRole === 'owner' &&
    detail.data.pet.device === null;
Cada sonda SUSTITUYE la linea que dice, con la misma sangria de cuatro
espacios, y nada mas. Para cada sonda (X = a, b, c, d, e, f):
  1. planta la mutacion y corre sus greps -> lo que dice cada uno
  2. uptime; FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-e3X.txt 2>&1; echo "exit=$?"
     -> exit=1
  3. corre su comprobacion -> sonda=0. Copia al impl la linea `Tests:` y
     la salida de `grep -E '^  ● .+ › ' /tmp/159-e3X.txt`.
  4. git checkout HEAD -- src/screens/map/index.tsx && git diff --quiet HEAD -- . ../docs ../specs; echo "limpio=$?"
     -> limpio=0
Si una sonda no da sonda=0 (tras == FLAKE == si aplica), restaura (paso
4) y PARA. Ninguna sonda se commitea.

Las comprobaciones de las seis sondas empiezan igual. <COMUN N M X> es,
con N rojos, M verdes y el fichero /tmp/159-e3X.txt:
  grep -qE '^Tests: +N failed, M passed, 271 total$' /tmp/159-e3X.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e3X.txt)" = N && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e3X.txt)" = N && ! grep -qF 'Unable to find an element' /tmp/159-e3X.txt
Escribelo con N, M y X ya sustituidos; abajo va cada comprobacion entera.

E3a  (M7) la linea `    detail.data.pet.myRole === 'owner' &&` pasa a
     `    (detail.data.pet.myRole === 'owner' || Boolean(selectedPet?.device)) &&`
     grep: grep -cF "(detail.data.pet.myRole === 'owner' || Boolean(selectedPet?.device)) &&" src/screens/map/index.tsx   -> 1
     -> `Tests:       12 failed, 259 passed, 271 total`; ● detalle {family, walker, vet} sin collar × listado {owner, family, walker, vet} con collar
     comprobacion:
     grep -qE '^Tests: +12 failed, 259 passed, 271 total$' /tmp/159-e3a.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e3a.txt)" = 12 && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e3a.txt)" = 12 && ! grep -qF 'Unable to find an element' /tmp/159-e3a.txt && test "$(grep -E '^  ● .+ › ' /tmp/159-e3a.txt | grep -cE 'con el detalle (family|walker|vet) sin collar aunque el listado diga (owner|family|walker|vet) con collar$')" = 12; echo "sonda=$?"
E3b  (M8) la linea `    detail.data.pet.device === null;` pasa a
     `    (detail.data.pet.device === null || selectedPet?.myRole !== 'owner');`
     grep: grep -cF "(detail.data.pet.device === null || selectedPet?.myRole !== 'owner');" src/screens/map/index.tsx   -> 1
     -> `Tests:       18 failed, 253 passed, 271 total`; ● detalle owner con collar (online, offline y sin conectividad) × listado {family, walker, vet} × {sin, con collar}
     comprobacion:
     grep -qE '^Tests: +18 failed, 253 passed, 271 total$' /tmp/159-e3b.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e3b.txt)" = 18 && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e3b.txt)" = 18 && ! grep -qF 'Unable to find an element' /tmp/159-e3b.txt && test "$(grep -E '^  ● .+ › ' /tmp/159-e3b.txt | grep -cE 'con el detalle owner con collar( offline| sin conectividad)? aunque el listado diga (family|walker|vet) (sin|con) collar$')" = 18; echo "sonda=$?"
E3c  (M9) la linea `    detail.data.pet.myRole === 'owner' &&` pasa a
     `    (detail.data.pet.myRole === 'owner' || (selectedPet?.myRole !== 'owner' && selectedPet?.myRole !== detail.data.pet.myRole)) &&`
     grep: grep -cF "(selectedPet?.myRole !== 'owner' && selectedPet?.myRole !== detail.data.pet.myRole)) &&" src/screens/map/index.tsx   -> 1
     -> `Tests:       12 failed, 259 passed, 271 total`; ● detalle R sin collar (R = family, walker o vet) × listado con uno de los otros dos roles no-owner × {sin, con collar}
     comprobacion:
     grep -qE '^Tests: +12 failed, 259 passed, 271 total$' /tmp/159-e3c.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e3c.txt)" = 12 && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e3c.txt)" = 12 && ! grep -qF 'Unable to find an element' /tmp/159-e3c.txt && test "$(grep -E '^  ● .+ › ' /tmp/159-e3c.txt | grep -cE 'con el detalle (family|walker|vet) sin collar aunque el listado diga (family|walker|vet) (sin|con) collar$')" = 12 && test "$(grep -E '^  ● .+ › ' /tmp/159-e3c.txt | grep -cE 'con el detalle (family sin collar aunque el listado diga family|walker sin collar aunque el listado diga walker|vet sin collar aunque el listado diga vet) ')" = 0; echo "sonda=$?"
E3d  (M12) las TRES lineas del predicado pasan a UNA sola:
     `    detail.data?.kind === 'ok' ? detail.data.pet.myRole === 'owner' && detail.data.pet.device === null : Boolean(selectedPet?.device);`
     greps: grep -cF ": Boolean(selectedPet?.device);" src/screens/map/index.tsx   -> 1
            grep -cF "detail.data?.kind === 'ok' &&" src/screens/map/index.tsx   -> 0
     -> `Tests:       16 failed, 255 passed, 271 total`; ● detalle {error, unreachable, missing-config} × listado {owner, family, walker, vet} con collar (12) y `mientras el detalle carga` × listado con collar (4)
     comprobacion:
     grep -qE '^Tests: +16 failed, 255 passed, 271 total$' /tmp/159-e3d.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e3d.txt)" = 16 && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e3d.txt)" = 16 && ! grep -qF 'Unable to find an element' /tmp/159-e3d.txt && test "$(grep -E '^  ● .+ › ' /tmp/159-e3d.txt | grep -cE 'con el detalle (error|unreachable|missing-config) aunque el listado diga (owner|family|walker|vet) con collar$')" = 12 && test "$(grep -E '^  ● .+ › ' /tmp/159-e3d.txt | grep -cE 'mientras el detalle carga aunque el listado diga (owner|family|walker|vet) con collar$')" = 4; echo "sonda=$?"
E3e  (N3) la linea `    detail.data.pet.device === null;` pasa a
     `    deviceConnectionState(detail.data.pet.device) !== 'online';`
     (deviceConnectionState ya esta importado: no anadas import)
     grep: grep -cF "deviceConnectionState(detail.data.pet.device) !== 'online';" src/screens/map/index.tsx   -> 1
     -> `Tests:       16 failed, 255 passed, 271 total`; ● detalle owner con collar offline y owner con collar sin conectividad × los 8 listados
     comprobacion:
     grep -qE '^Tests: +16 failed, 255 passed, 271 total$' /tmp/159-e3e.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e3e.txt)" = 16 && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e3e.txt)" = 16 && ! grep -qF 'Unable to find an element' /tmp/159-e3e.txt && test "$(grep -E '^  ● .+ › ' /tmp/159-e3e.txt | grep -cE 'con el detalle owner con collar (offline|sin conectividad) aunque el listado diga (owner|family|walker|vet) (sin|con) collar$')" = 16; echo "sonda=$?"
E3f  (N1) la linea `    detail.data.pet.device === null;` pasa a
     `    (detail.data.pet.device === null || (detail.data.pet.device.connectivity !== 'online' && selectedPet?.device === null));`
     grep: grep -cF "detail.data.pet.device.connectivity !== 'online' && selectedPet?.device === null));" src/screens/map/index.tsx   -> 1
     -> `Tests:       8 failed, 263 passed, 271 total`; ● detalle owner con collar offline y owner con collar sin conectividad × listado {owner, family, walker, vet} sin collar
     comprobacion:
     grep -qE '^Tests: +8 failed, 263 passed, 271 total$' /tmp/159-e3f.txt && test "$(grep -cE '^  ● .+ › ' /tmp/159-e3f.txt)" = 8 && test "$(grep -cF 'expect(received).toBeNull()' /tmp/159-e3f.txt)" = 8 && ! grep -qF 'Unable to find an element' /tmp/159-e3f.txt && test "$(grep -E '^  ● .+ › ' /tmp/159-e3f.txt | grep -cE 'con el detalle owner con collar (offline|sin conectividad) aunque el listado diga (owner|family|walker|vet) sin collar$')" = 8; echo "sonda=$?"

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe,
con la salida al impl:
- `pgrep -af '[i]nit\.sh'` vacio. Despues `uptime` y el comando BASE
  `> /tmp/159-e3-final.txt 2>&1; echo "exit=$?"`
  -> exit=0, `Test Suites: 10 passed, 10 total` y
     `Tests:       911 passed, 911 total` (759 de la ronda 3 + 152; map 271)
- `pgrep -af '[i]nit\.sh'` vacio otra vez. Despues `uptime` y el comando
  ALL `> /tmp/159-e3-all.txt 2>&1; echo "exit=$?"`
  -> exit=0, `Test Suites: 97 passed, 97 total` y
     `Tests:       2577 passed, 2577 total` (2425 de la ronda 3 + 152).
     Copia las dos lineas.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y
  `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0
- Las anclas A1-A15 con sus valores de cierre.
- `git diff --stat <H0E3> HEAD -- package.json bun.lock app.json src/theme` -> vacio
Desde la raiz (`cd /home/claude/sites/Pet-Tracker-wt-159 && pwd`):
- `git log --oneline <H0E3>..HEAD` -> exactamente e3-1 y e3-2
- `git diff --numstat <H0E3> HEAD -- mobile-pet-tracker/`
  -> exactamente una linea: `51	0	mobile-pet-tracker/src/screens/map/index.test.tsx`
- `git diff --quiet 664b95a7 HEAD -- mobile-pet-tracker/src/screens/map/index.tsx; echo "exit=$?"` -> exit=0
- `git diff --stat <H0E3> HEAD -- backend-pet-tracker/ infra-pet-tracker/ docs/` -> vacio

Despues edita specs/mobile-no-collar-states-pingo/traceability.md: solo
la fila R4, y nada mas del fichero. Sustituye <ROJO> y <VERDE> por los
hashes cortos de e3-1 y e3-2. La fila queda asi, en una sola linea:
| R4 | `src/screens/map/index.test.tsx::#159 R4: nadie más ve el botón de emparejar` (sondas S4a-S4c; E1: `no pinta el botón a %s aunque el listado diga owner`, sondas E1a-E1e; E3: `no pinta el botón con el detalle $detalle aunque el listado diga $listRole $listCollar` (18 detalles × 8 listados), `no pinta el botón mientras el detalle carga aunque el listado diga $listRole $listCollar` (8 listados), sondas E3a-E3f) | 9506bd88 test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar → f4f48736 feat(mobile-no-collar-states): #159 R4 gate pair action on detail; E1: 3224d502 test(mobile-no-collar-states): #159 E1 red pair action reads role and collar from list → 203ea96e fix(mobile-no-collar-states): #159 E1 revert list probe, pair action locked to detail; E3: <ROJO> test(mobile-no-collar-states): #159 E3 red pair action follows list role and collar → <VERDE> fix(mobile-no-collar-states): #159 E3 revert list probe, no pair action whatever the list says |
Comprueba, desde la raiz:
  git diff -U0 -- specs/mobile-no-collar-states-pingo/traceability.md | grep -E '^[-+]\|' | cut -c1-8
    -> exactamente dos lineas: `-| R4 | ` y `+| R4 | `
  grep -cF 'sondas E1a-E1e; E3: ' specs/mobile-no-collar-states-pingo/traceability.md   -> 1
  grep -oF '; E3: ' specs/mobile-no-collar-states-pingo/traceability.md | wc -l   -> 2
  grep -cF '<ROJO>' specs/mobile-no-collar-states-pingo/traceability.md   -> 0
  grep -cF '<VERDE>' specs/mobile-no-collar-states-pingo/traceability.md   -> 0

Lista cerrada, desde la raiz, con traceability.md y el impl ya editados y
sin commitear (sin HEAD: compara el arbol con H0E3):
  git diff --name-only <H0E3> -- . ':!feature_list.json' ':!progress/current.md' ':!progress/review_mobile-no-collar-states-pingo.md' ':!specs/mobile-no-collar-states-pingo/requirements.md' ':!specs/mobile-no-collar-states-pingo/design.md' ':!specs/mobile-no-collar-states-pingo/tasks.md' | LC_ALL=C sort
    -> exactamente estos 3:
       mobile-pet-tracker/src/screens/map/index.test.tsx
       progress/impl_mobile-no-collar-states-pingo.md
       specs/mobile-no-collar-states-pingo/traceability.md
  test -z "$(git ls-files --others --exclude-standard)"; echo "exit=$?"   -> exit=0
Pega las dos salidas en el impl y termina tu seccion con la linea
`R10: pendiente del smoke humano`. Despues e3-3, desde la raiz:
  git add specs/mobile-no-collar-states-pingo/traceability.md progress/impl_mobile-no-collar-states-pingo.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-no-collar-states-pingo.md specs/mobile-no-collar-states-pingo/traceability.md ' \
    && git diff --quiet && test -z "$(git ls-files --others --exclude-standard)" \
    && git commit -m 'docs(mobile-no-collar-states-pingo): #159 E3 traceability'
Tras e3-3 no escribas nada mas en ningun fichero. Ensena en la terminal
`git log --oneline <H0E3>..HEAD` (3 commits) y `git status --short`
(vacio). El hash de e3-3 lo anota el leader. No rebasees.

== REGLAS CRITICAS ==

- Solo tests. src/screens/map/index.tsx solo cambia en el commit rojo (la
  mutacion de tasks.md) y vuelve a 664b95a7 en el verde. No toques ningun
  otro fichero de produccion, ni siquiera en las sondas.
- Skills: NO cargues ninguna skill de expo ni de .agents/skills/. No hay
  ninguna para esto: son dos it.each de jest sobre una pantalla que no
  cambia. La guia que necesitas esta aqui y en docs/conventions.md.
- Convenciones: docs/conventions.md §Tests y §Esperas. Se espera a un nodo
  del arbol (`findByTestId`), NUNCA al contador de un mock. El bloque de
  tasks.md ya lo cumple: copialo tal cual.
- Reutiliza lo que ya hay en el fichero: `renderMap`, `makePet`,
  `makeDevice`, `pending`, `PetState`, `noTrackingAfterDetail`, `screen`,
  `mockListPets`, `mockGetPet`, `mockGetLastPosition`. No dupliques
  helpers ni imports. No anadas imports: el bloque no los necesita.
- Valores esperados LITERALES (el texto del cuerpo en espanol), nunca un
  simbolo importado de produccion.
- design-drift recorre este test: no escribas `#159` en ninguna cadena ni
  comentario nuevo (el guard de hex lo caza; A11 lo vigila). El bloque no
  lleva comentarios.
- Ni `bun add` ni cambios en package.json, bun.lock ni app.json. Todo con
  bun/bunx, nunca npm/npx. Nada de prettier (mobile no lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, progress/review_mobile-no-collar-states-pingo.md,
  requirements.md, design.md y tasks.md de la spec (frontmatter y
  casillas de §Aprobacion y de tasks.md incluidas, tambien la de R10), y
  las secciones de las rondas 1, 2 y 3 del impl. Lo que tengas que contar
  va en tu seccion `# Ronda 4 — Enmienda E3` del impl.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push, ni rebase, ni merge, ni abras la PR: lo hace el leader.

Ficheros que TU cambias en la ronda 4 (3, ni uno mas; medido desde H0E3):
  mobile-pet-tracker/src/screens/map/index.test.tsx
  progress/impl_mobile-no-collar-states-pingo.md
  specs/mobile-no-collar-states-pingo/traceability.md
src/screens/map/index.tsx cambia en e3-1 y vuelve en e3-2: su diff neto
contra H0E3 es cero y por eso no sale en la lista. Si el leader commitea
en mitad, solo tocara ficheros excluidos por los pathspecs de la lista
cerrada. Cualquier otro fichero ajeno es motivo de parada.

== ENTORNO ==

Otras sesiones en la maquina (4 CPU): Backend (#158, Pet-Tracker-wt-158)
y, a ratos, Frontend. Corren jest y a veces init.sh. El jest de un solo
fichero no espera a nadie. El BASE y el ALL del Cierre esperan a
`pgrep -af '[i]nit\.sh'` vacio. La carga alta es la que despierta el
flake de == FLAKE ==: por eso el `uptime` antes de cada jest. El test
del Mapa tarda ahora unos 20 s (antes 16 s).

Al terminar, tu seccion `# Ronda 4 — Enmienda E3` del impl debe tener:
pwd, branch, H0E3 y status; los exits de BASE (fetch e is-ancestor,
a8681b51, 664b95a7, router.d.ts y node_modules); las anclas A1-A15 en
H0E3 y en el cierre; la base del Mapa con su uptime y su exit; e3-1 con
su comando, su linea `Tests:`, su exit y la lista de sus `●`, mas
typecheck y lint; e3-2 con sus lineas `Tests:` (Mapa y GUARDAS),
typecheck, lint y el exit del diff contra 664b95a7; las sondas E3a-E3f
con sus greps, su linea `Tests:`, sus `●`, su sonda=0 y su limpio=0; el
cierre (BASE con 911, ALL con exit y totales, typecheck, lint, diffs y
log); la comprobacion de traceability; la lista cerrada; cada repeticion
de == FLAKE == si la hubo; la linea `R10: pendiente del smoke humano`; y
cualquier decision que la spec no cerrara literalmente.
```
