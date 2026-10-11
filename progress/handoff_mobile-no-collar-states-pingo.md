# Handoff a Codex CLI — #159 mobile-no-collar-states-pingo

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `b304538f`, aprobación vía Notion el 2026-10-09). Es la cuarta feature del
> bloque de deleite visual: Pingo entra en los estados «sin collar» del Mapa y
> de Zonas seguras reutilizando el `EmptyState` de #155 (pose `collar`, ya en
> `assets/images/`), el dueño de una mascota sin collar gana un botón
> `Vincular collar` en el Mapa, y dos textos que se quedan en texto (la guarda
> del editor de zonas y la nota de Inicio) pasan a decir la verdad. Son 18
> commits: R1-R5, R7 y R8 en pares rojo/verde, R6 y R9 nacen verdes (su rojo
> lo demuestran las sondas, que Codex planta, mide y revierte), uno de
> trazabilidad y uno de lista cerrada. La prueba de humo de R10, en un dev
> build de Android, es del humano y cierra la feature.
>
> `node_modules` ya está instalado en `Pet-Tracker-wt-159/mobile-pet-tracker`.
> La branch ya incluye `origin/main` fb1e562d (#162, PR #204): no hace falta
> merge antes de H0. No hay dependencias nuevas, ni assets nuevos, ni cambios
> en `empty-state.tsx`.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-159   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-no-collar-states-pingo.md.
El hash es H0 (el commit que anade este handoff), y es tambien el «HEAD
del handoff» de tasks.md T0 y T9. En todos los comandos de abajo,
sustituye `<H0>` por ese hash literal: todos los `git diff` se miden
contra el. PARA si la branch no es feature/159-mobile-no-collar-states-pingo
o si `git status --short` no sale vacio. No toques
/home/claude/sites/Pet-Tracker, Pet-Tracker-wt-134, Pet-Tracker-wt-155,
Pet-Tracker-wt-158, Pet-Tracker-wt-backend ni ningun otro worktree, ni
cambies de branch en ninguno.

Feature: mobile-no-collar-states-pingo (#159)
Branch: feature/159-mobile-no-collar-states-pingo
Spec aprobada: specs/mobile-no-collar-states-pingo/requirements.md
(firma b304538f).
Las decisiones A1-A5 de requirements.md estan cerradas: no reabras
ninguna (no confundirlas con las anclas A1-A28 de tasks.md T0, que son
comandos). Lee tambien, enteros: specs/mobile-no-collar-states-pingo/design.md,
tasks.md y traceability.md, y requirements.md hasta el final. tasks.md es
tu guion (T0-T10). Los titulos de describe e it y los literales de copy
son LITERALES de tasks.md y de requirements.md §Tabla de literales:
copialos tal cual, con sus tildes y sus simbolos (`%s`, `→`, `—`, `←`).

== QUE HACES ==

Los 18 commits, en este orden exacto (el de tasks.md §Orden):
T1 R1, T2 R2, T3 R3, T4 R4, T5 R5 (rojo y verde cada uno), T6 R6 (un
commit, nace verde), T7 R7, T8 R8 (rojo y verde), T9 R9 (un commit, nace
verde), el commit de trazabilidad y el de lista cerrada. Rojo SIEMPRE
antes de su verde, en commits separados. Si escribes un verde antes que
su rojo, ese requisito nace verde y pierde su historial (C4 de
CHECKPOINTS.md); en #19 se metio todo en un solo commit y no vale. R6 y
R9 no tienen rojo honesto: su rojo lo demuestran las sondas, nunca un
cambio commiteado.

Esto manda sobre tasks.md:
- Trazabilidad: tasks.md dice «tras el commit verde de cada tarea,
  rellena su fila». NO: traceability.md se rellena entera UNA vez, al
  final, en el commit de trazabilidad del Cierre. Ningun commit de T1-T9
  la toca.
- tasks.md T9 (5) pide `./init.sh`: NO lo lances. Lo corre el leader
  (comparte Postgres y LocalStack con otras sesiones). En su lugar va la
  suite entera de jest del Cierre.
- Sondas: primero commiteas el commit que nombra la tarea (su cadena,
  abajo) y DESPUES plantas cada sonda sobre ese HEAD, la mides y la
  reviertes. Asi `limpio=0` es verificable.
- No hay commits `refactor(...)`: tasks.md no preve ninguno.
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y con la salida a un
  fichero, como en las cadenas de abajo, no como el ejemplo de tasks.md.
- Typecheck y lint: `bun run typecheck` (es `tsc --noEmit`) y
  `bunx expo lint --no-cache`. Nunca `bun run lint` (usa la cache de
  eslint y en #155 dio un error obsoleto).

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker && pwd
  -> /home/claude/sites/Pet-Tracker-wt-159/mobile-pet-tracker
Todo lo de esta seccion y de COMMITS va desde ahi. Las ANCLAS y el final
del CIERRE van desde la raiz (`cd /home/claude/sites/Pet-Tracker-wt-159 && pwd`).

Error de invocacion: si un comando falla ANTES de que arranquen jest,
tsc o eslint (`No such file or directory`, `command not found`, un
`ERR_PNPM_*` o un `pwd` que no es el esperado) y no has tocado ningun
fichero, NO es una parada: haz el `cd` literal de arriba, repite el
comando y anotalo en el impl. Cualquier otro fallo si es una parada.

origin/main = fb1e562d al escribir este handoff, y la branch ya lo
incluye: lo esperado es exit=0. Al arrancar:
`git fetch origin` y `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main en la branch lo hace el leader.
Nunca rebasees ni mergees.

- `test -d node_modules && echo presente` -> presente. Si no sale,
  `bun install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0. Va en
  cada cadena de commit; si un dia da 1, PARA y pide al humano que lo
  borre. Nunca `rm -f` (tu sandbox lo deniega).
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina; espera a que salga vacio antes de cualquier jest entero (el
  ALL de la base y el del Cierre).

Base medida por el leader el 2026-10-09 en este worktree con el arbol de
H0, con el comando BASE (un solo jest, FORCE_COLOR=0, sin pipe): exit=0,
`Test Suites: 10 passed, 10 total` y `Tests:       699 passed, 699 total`.
Reparto por fichero:
  src/components/__tests__/empty-state.test.tsx          64
  src/providers/__tests__/language-provider.test.tsx     24
  src/__tests__/ui-language.test.ts                      30
  src/screens/map/index.test.tsx                         97
  src/screens/geofences/index.test.tsx                   51
  src/screens/geofence-editor/index.test.tsx             68
  src/screens/home/index.test.tsx                       221
  src/__tests__/design-drift.test.ts                     62
  src/__tests__/consistency-classnames.test.ts           55
  src/__tests__/legibility-classnames.test.ts            27
Tu medida manda: repite el comando BASE (es el paso 2 de tasks.md T0) y
anota sus dos lineas en el impl. Si el total no es 699 o algo nace rojo,
mide fichero a fichero, anota y PARA.

Comando BASE (ninguna ruta lleva parentesis):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/screens/map/index.test.tsx src/screens/geofences/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/home/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/159-base.txt 2>&1; echo "exit=$?"

Comando ALL (la suite entera; con `pgrep -af '[i]nit\.sh'` vacio antes y
sin lanzar nada mas mientras corre):
  FORCE_COLOR=0 bunx jest > /tmp/159-all-base.txt 2>&1; echo "exit=$?"
  -> exit=0. El leader lo midio en H0: ver la linea «ALL base» de abajo.
     Copia al impl sus lineas `Test Suites:` y `Tests:`. Si exit no es 0,
     anota los `●` y PARA.
  ALL base (leader, H0): exit=0, `Test Suites: 97 passed, 97 total` y
  `Tests:       2365 passed, 2365 total`. Cierre esperado: 97 suites y
  2415 tests (2365 + 50; #159 no crea ficheros de test).

Comando GUARDAS (los candados de copy y de carta; lo corre cada verde y
cada candado; siempre 30 + 62 + 55 + 27 = 174):
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/159-gN-guardas.txt 2>&1`.

== ANCLAS ==

Ejecutalas TODAS desde la RAIZ del worktree antes de tocar nada y copia
la salida al impl. Son las A1-A28 de tasks.md T0 (A27 y A28 son los
bloques de debajo de su tabla: copialos de alli tal cual) y las del
handoff (H1-H26). Solo estos comandos son anclas; los numeros de linea no
lo son. Si alguna no da EXACTAMENTE lo esperado, PARA y avisa (ante una
diferencia manda el fichero, no el handoff). Cuando `grep -c` cuenta 0
sale con codigo 1: lo que vale es la cifra impresa. El leader las ha
ejecutado todas en H0 sacandolas de este mismo fichero.

A1-A28: las de tasks.md T0, con su salida esperada.
H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-09)' specs/mobile-no-collar-states-pingo/requirements.md   -> 1
H2. grep -cF -- '- [ ] Prueba de humo R10 superada en dev build de Android (fecha: ____)' specs/mobile-no-collar-states-pingo/requirements.md   -> 1
H3. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H4. grep -rlF '#159' mobile-pet-tracker/src | wc -l   -> 0
H5. grep -cF "describe('#159" mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx   -> 0
H6. grep -cF 'function makeDevice(connectivity: string | null): DeviceStatus {' mobile-pet-tracker/src/screens/map/index.test.tsx   -> 1
H7. grep -cF 'function pending<T>(): Promise<T> {' mobile-pet-tracker/src/screens/map/index.test.tsx   -> 1
H8. grep -cF "function petState(myRole: PetProfile['myRole'] = 'owner'): PetState {" mobile-pet-tracker/src/screens/geofences/index.test.tsx   -> 1
H9. grep -cF "function mount(language: Language = 'es', onUnauthorized?: () => void, seedRole = false) {" mobile-pet-tracker/src/screens/geofences/index.test.tsx   -> 1
H10. grep -cF "const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';" mobile-pet-tracker/src/screens/geofences/index.tsx   -> 1
H11. grep -cF 'testID="summary-note"' mobile-pet-tracker/src/screens/home/index.tsx   -> 1
H12. grep -cF 'testID={`${testID}-action`}' mobile-pet-tracker/src/components/empty-state.tsx   -> 1
H13. grep -cF "t('home.pairCollar')" mobile-pet-tracker/src/screens/map/index.tsx   -> 0
H14. grep -cF "router.push('/pairing')" mobile-pet-tracker/src/screens/map/index.tsx   -> 0
H15. grep -cF 'function languageDesign(): string {' mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx   -> 1
H16. grep -cF "describe('R5: mascota free degrada sin mapa'" mobile-pet-tracker/src/screens/map/index.test.tsx   -> 1
H17. grep -cF "it('shows the collar requirement without map, stats, lost mode, or polling'" mobile-pet-tracker/src/screens/map/index.test.tsx   -> 1
H18. grep -cF "describe('#41 R5: la pantalla pinta la lista de zonas y sus estados'" mobile-pet-tracker/src/screens/geofences/index.test.tsx   -> 1
H19. grep -cF "describe('#146 R6: el editor pinta el formulario sobre el mapa y sus estados'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx   -> 1
H20. grep -cF "describe('#146 R8: Guardar crea o actualiza la zona y vuelve a la lista'" mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx   -> 1
H21. grep -cF "it('registra las once claves en los dos idiomas y en la tabla de la spec de idioma'" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
H22. grep -cF "it('explains that activity tracking requires a collar'" mobile-pet-tracker/src/screens/home/index.test.tsx   -> 1
H23. grep -cF "it('pinta un guion y la nota cuando el perfil tampoco resuelve'" mobile-pet-tracker/src/screens/home/index.test.tsx   -> 1
H24. grep -cE '<Card\s+testID="geofence-editor-no-tracking"' mobile-pet-tracker/src/screens/geofence-editor/index.tsx   -> 1
H25. grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/map/index.test.tsx   -> 1
H26. grep -cF '(child.props.testID ?? child.type)' mobile-pet-tracker/src/screens/geofences/index.test.tsx   -> 1

Valores al cerrar (copialos al impl): A1-A2 sin cambios; A3-A8 -> 0
(K1, K2, K3, K4, K5 y K6 reescriben esas lineas); A9 -> 1 (la fila del
editor no cambia); A10-A14 -> 0; A15 -> 1; A16-A17 -> 0; A18 -> 1 (el it
del editor conserva su titulo); A19-A20 -> 0; A21-A22 -> 1; A23 -> 1;
A24 -> 1; A25-A26 -> 0; A27 -> 8; A28 -> las dos con :0. H1-H3 sin
cambios; H4 no se fija (anota el valor); H5 -> 5; H6-H12 sin cambios;
H13 -> 1; H14 -> 1; H15-H24 sin cambios; H25 -> 2; H26 -> 2. Y en
positivo al cerrar, desde la raiz:
  P1. grep -cF '<EmptyState' mobile-pet-tracker/src/screens/map/index.tsx   -> 2
  P2. grep -cF '<EmptyState' mobile-pet-tracker/src/screens/geofences/index.tsx   -> 2
  P3. grep -cF 'const canPairCollar =' mobile-pet-tracker/src/screens/map/index.tsx   -> 1
  P4. grep -cF 'detail.data.pet.device === null;' mobile-pet-tracker/src/screens/map/index.tsx   -> 1
  P5. grep -cF "t('home.pairCollar')" mobile-pet-tracker/src/screens/geofences/index.tsx   -> 0
  P6. grep -cF '+ 4 // #159 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
  P7. grep -cF -- '- 1, // #159 R2' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
  P8. grep -cF 'expect(R4_MAP).toHaveLength(17 + 2 + 1 + 1); // +2 #155 R4, +1 #159 R2, +1 #159 R3' mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
  P9. grep -cF 'expect(R14_GEOFENCES).toHaveLength(18 + 1 + 1); // +1 #155 R8, +1 #159 R5' mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
  P10. grep -cF '### §2.23 — Añadidos por #159 — Pingo sin collar' specs/mobile-ui-language/design.md   -> 1
  P11. grep -cF 'el tab Map muestra a Pingo con `No live location`' docs/verification.md   -> 1
  P12. grep -cF "{ file: 'src/screens/map/index.tsx', key: 'home.pairCollar' }, // #159 R3" mobile-pet-tracker/src/__tests__/ui-copy-table.ts   -> 1

== COMMITS ==

Todo desde mobile-pet-tracker/ (el `cd` literal de BASE). Cada commit va
ENCADENADO con && a su verificacion: si cualquier eslabon falla, el
commit no se hace. Nunca commitees fuera de estas cadenas ni con un exit
distinto de 0 en la cadena (en #115 se commiteo un verde con el
registrador en exit=1). Si una cadena no llega al commit, PARA y reporta
en el impl el eslabon que fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato:
`Tests:       3 failed, 96 passed, 99 total` y en verde
`Tests:       99 passed, 99 total`. Cada medida lleva su
`echo "exit=$?"`; anota el exit en el impl.

Rojos: cada uno cae EXACTAMENTE como dice tasks.md: por ASERCION
(Expected/Received) o por CONSULTA (`Unable to find an element with
testID: ...`). Nunca por TypeError, ReferenceError, SyntaxError, `Test
suite failed to run` ni `Cannot find module`. La cadena comprueba la
cuenta y el tipo; tu ademas abres el log y copias al impl cada it rojo
con su matcher y su Expected/Received (o la consulta). Si un Received
ocupa mas de 20 lineas, copia el matcher, el Expected y las 20 primeras
lineas del Received, y nada mas.

Typecheck y lint van en TODAS las cadenas, rojas incluidas, y dan exit 0.

Cada cadena termina igual, tras su `git add`: la lista exacta de lo
stageado y que no quede nada sin stagear en mobile-pet-tracker/, docs/
ni specs/ (el impl vive en progress/ sin trackear hasta el Cierre; no lo
stagees antes):
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
En las cadenas aparece como `<LIMPIO>`. NUNCA `git status --short` tras
un `git add`: falla siempre (lo stageado sale).

Sondas: sobre el HEAD del commit que las nombra, UNA A UNA. Plantas la
mutacion, mides SOLO el fichero de test que dice la sonda (salida a
/tmp/159-sN.txt), copias al impl la linea `Tests:` y los `●`, y reviertes:
  git checkout HEAD -- <fichero de la sonda>
  git diff --cached --quiet && git diff --quiet; echo "limpio=$?"   -> limpio=0
Nunca `git checkout <commit> -- <fichero>` (deja el cambio en el
indice). Si una sonda no da EXACTAMENTE su linea `Tests:` y sus `●`,
PARA. Ninguna sonda se commitea. Todas caen por ASERCION.

Notas de escritura que valen para todo el fichero del componente
(src/components/__tests__/empty-state.test.tsx): ya tiene `enCatalog` y
`esCatalog` (Record<string, string>), `readFileSync`, `join` y
`languageDesign()` (H15). Reutilizalos; no los dupliques. Todo lo nuevo
va AL FINAL del fichero. Los its de sitio de pantalla mapean los hijos
EXACTAMENTE con la expresion de #155, para que H25 y H26 cuadren:
  slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))

-- T1 R1: el copy sin collar --

c1, T1 rojo (tasks.md T1 (1): `noCollarRows`, `section159()` y el
describe `#159 R1: el copy sin collar existe en los dos idiomas`, 13 it):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       13 failed, 64 passed, 77 total`, todos por asercion
  grep -qE '^Tests: +13 failed, 64 passed, 77 total$' /tmp/159-r1.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r1.txt)" = 13 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r1.txt \
    && ! grep -qF 'Unable to find' /tmp/159-r1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R1 red no-collar copy'

c2, T1 verde (tasks.md T1 (2): las cuatro claves en `en` y `es`, el
bloque §2.23 en specs/mobile-ui-language/design.md y K1). El bloque
§2.23, como el de §2.21: encabezado, linea en blanco, cabecera de tabla,
`|---|---|---|---|---|` y las cuatro filas; con una linea en blanco
antes del encabezado y otra antes de `## 3. La infraestructura`. Las
filas son las de requirements.md R1.3 con los literales L1-L4,
byte a byte:
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx > /tmp/159-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       101 passed, 101 total` (77 + 24)
  <GUARDAS> > /tmp/159-g1-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +101 passed, 101 total$' /tmp/159-g1.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g1-guardas.txt \
    && test "$(grep -cE "^\s+'(map\.noTrackingTitle|map\.noTrackingBody|geofences\.noTrackingTitle|geofences\.noTrackingBody)':" src/i18n/catalog.ts)" = 8 \
    && test "$(grep -cF '### §2.23 — Añadidos por #159 — Pingo sin collar' ../specs/mobile-ui-language/design.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx specs/mobile-ui-language/design.md ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-no-collar-states): #159 R1 no-collar copy in catalog and language table'

-- T2 R2: el Mapa sin seguimiento --

c3, T2 rojo (tasks.md T2 (1): la espera del it de H17 pasa a
`map-no-tracking-body` con la frase L2; el describe
`#159 R2: Mapa sin seguimiento presenta a Pingo`, 2 it, al final del test
del Mapa; y el describe `#159 R2: el texto de rastreo en vivo se retira`,
2 it, al final del test del componente):
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r2-map.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 96 passed, 99 total`, los tres por consulta
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r2-es.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 77 passed, 79 total`, los dos por asercion
  grep -qE '^Tests: +3 failed, 96 passed, 99 total$' /tmp/159-r2-map.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r2-map.txt)" = 3 \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-body' /tmp/159-r2-map.txt \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-pose' /tmp/159-r2-map.txt \
    && grep -qE '^Tests: +2 failed, 77 passed, 79 total$' /tmp/159-r2-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r2-es.txt)" = 2 \
    && ! grep -qF 'Unable to find' /tmp/159-r2-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r2-map.txt /tmp/159-r2-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/map/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R2 red map no-tracking empty state'

c4, T2 verde (tasks.md T2 (2): el EmptyState `map-no-tracking` SIN
action; `map.trackingNeedsCollar` fuera de `en` y `es`; la fila de
retirada de R2.4 en §2.23; la frase de R2.5 en docs/verification.md; K1,
K3, K5 y K7). La frase de verification.md se queda en UNA sola linea (el
test la busca entera): la linea
     health only…`; el tab Map muestra `Live tracking requires a collar`.
pasa a
     health only…`; el tab Map muestra a Pingo con `No live location`, sin el botón `Pair a collar` (la mascota ya tiene collar).
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       232 passed, 232 total` (99 + 79 + 24 + 30)
  <GUARDAS> > /tmp/159-g2-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +232 passed, 232 total$' /tmp/159-g2.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g2-guardas.txt \
    && test "$(grep -cF "t('map.trackingNeedsCollar')" src/screens/map/index.tsx)" = 0 \
    && test "$(grep -cF 'map.trackingNeedsCollar' src/i18n/catalog.ts)" = 0 \
    && test "$(grep -cF 'Live tracking requires a collar' ../docs/verification.md)" = 0 \
    && test "$(grep -cF 'el tab Map muestra a Pingo con `No live location`' ../docs/verification.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/components/__tests__/empty-state.test.tsx src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx src/screens/map/index.tsx ../docs/verification.md ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/verification.md mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/map/index.tsx specs/mobile-ui-language/design.md ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-no-collar-states): #159 R2 map no-tracking empty state'

-- T3 R3: el boton de emparejar --

c5, T3 rojo (tasks.md T3 (1): el describe
`#159 R3: el dueño sin collar puede ir a emparejar`, 2 it, al final del
test del Mapa; `mockRouter` ya existe en el fichero, A21):
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 99 passed, 101 total`, los dos por consulta
  grep -qE '^Tests: +2 failed, 99 passed, 101 total$' /tmp/159-r3.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r3.txt)" = 2 \
    && grep -qF 'Unable to find an element with testID: map-no-tracking-action' /tmp/159-r3.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r3.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R3 red pair collar action'

c6, T3 verde (tasks.md T3 (2): la action SIN condicion; K3 y K5.
`router` ya esta importado en src/screens/map/index.tsx):
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g3.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       131 passed, 131 total` (101 + 30)
  <GUARDAS> > /tmp/159-g3-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +131 passed, 131 total$' /tmp/159-g3.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g3-guardas.txt \
    && test "$(grep -cF "router.push('/pairing')" src/screens/map/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/map/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-no-collar-states): #159 R3 pair collar action on map'

-- T4 R4: nadie mas ve el boton --

c7, T4 rojo (tasks.md T4 (1): el describe
`#159 R4: nadie más ve el botón de emparejar` con `noTrackingAfterDetail`,
8 it, al final del test del Mapa. `PetState`, `LastPositionState`,
`pending` y `makeDevice` ya existen en el fichero):
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/159-r4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       8 failed, 101 passed, 109 total`, los ocho por
       asercion (`expect(received).toBeNull()` sobre map-no-tracking-action)
  grep -qE '^Tests: +8 failed, 101 passed, 109 total$' /tmp/159-r4.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r4.txt)" = 8 \
    && ! grep -qF 'Unable to find' /tmp/159-r4.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R4 red pair action only for owner without collar'

c8, T4 verde (tasks.md T4 (2): `canPairCollar` junto a `canSetLostMode`,
con el codigo exacto de design.md D2, y la action condicionada):
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       139 passed, 139 total` (109 + 30)
  <GUARDAS> > /tmp/159-g4-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +139 passed, 139 total$' /tmp/159-g4.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g4-guardas.txt \
    && test "$(grep -cF 'const canPairCollar =' src/screens/map/index.tsx)" = 1 \
    && test "$(grep -cF 'detail.data.pet.device === null;' src/screens/map/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/map/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-no-collar-states): #159 R4 gate pair action on detail'
  Despues, las sondas de tasks.md T4 (3), sobre src/screens/map/index.tsx,
  midiendo solo src/screens/map/index.test.tsx:
    S4a  quita `detail.data.pet.device === null` y su `&&`
         -> `Tests:       1 failed, 108 passed, 109 total`
            (solo `no pinta el botón al dueño de una mascota con collar`)
    S4b  quita `detail.data.pet.myRole === 'owner'` y su `&&`
         -> `Tests:       3 failed, 106 passed, 109 total`
            (solo las 3 filas de `no pinta el botón a %s`)
    S4c  `detail.data?.kind === 'ok' &&` pasa a `detail.data?.kind !== 'ok' ||`
         -> `Tests:       4 failed, 105 passed, 109 total`
            (las 3 filas de `no pinta el botón si el detalle resuelve %s` y
            `no pinta el botón mientras el detalle carga`)

-- T5 R5: Zonas seguras sin seguimiento --

c9, T5 rojo (tasks.md T5 (1): borra el it `pinta el 402 sin Reintentar`
de H18 y anade el describe
`#159 R5: Zonas seguras sin seguimiento presentan a Pingo`, 3 it, al
final del test de Zonas seguras):
  FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 50 passed, 53 total` (51 - 1 + 3):
       `…de Pingo, sin tarjeta` por asercion (la clase de la Card) y los
       otros dos por consulta (`-title` en ingles y `-pose`)
  grep -qE '^Tests: +3 failed, 50 passed, 53 total$' /tmp/159-r5.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r5.txt)" = 3 \
    && grep -qF 'Unable to find an element with testID: geofences-no-tracking-title' /tmp/159-r5.txt \
    && grep -qF 'Unable to find an element with testID: geofences-no-tracking-pose' /tmp/159-r5.txt \
    && grep -qF 'items-center gap-3 py-8' /tmp/159-r5.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r5.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/geofences/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/geofences/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R5 red safe zones no-tracking empty state'

c10, T5 verde (tasks.md T5 (2): el EmptyState de design.md D3 SIN
action, en lugar de la Card `geofences-no-tracking`; `Card` sigue
importada; K4, K6 y K7):
  FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g5.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       162 passed, 162 total` (53 + 79 + 30)
  <GUARDAS> > /tmp/159-g5-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +162 passed, 162 total$' /tmp/159-g5.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g5-guardas.txt \
    && test "$(grep -cF "t('geofences.needsCollar')" src/screens/geofences/index.tsx)" = 0 \
    && test "$(grep -cF "t('geofences.needsCollar')" src/screens/geofence-editor/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/components/__tests__/empty-state.test.tsx src/screens/geofences/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/geofences/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-no-collar-states): #159 R5 safe zones no-tracking empty state'

-- T6 R6: en Zonas seguras nadie ve el boton (nace verde) --

c11, T6 (tasks.md T6 (1): el describe
`#159 R6: en Zonas seguras nadie ve el botón de emparejar`, 5 it, al final
del test de Zonas seguras; `petState` ya existe, H8):
  FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/159-g6.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       58 passed, 58 total`. Si nace rojo, PARA.
  <GUARDAS> > /tmp/159-g6-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +58 passed, 58 total$' /tmp/159-g6.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g6-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/geofences/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/geofences/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R6 lock no pair action in safe zones'
  Despues, las sondas de tasks.md T6 (2), sobre src/screens/geofences/index.tsx
  (en el EmptyState `geofences-no-tracking`), midiendo solo
  src/screens/geofences/index.test.tsx:
    S6a  anade `action={isOwner ? { label: t('home.pairCollar'), onPress: () => router.push('/pairing') } : undefined}`
         -> `Tests:       1 failed, 57 passed, 58 total` (solo `no ofrece acción a owner`)
    S6b  lo mismo con `!isOwner`
         -> `Tests:       4 failed, 54 passed, 58 total` (`… a family`,
            `… a walker`, `… a vet` y `no ofrece acción si el detalle falla`)

-- T7 R7: la guarda del editor --

c12, T7 rojo (tasks.md T7 (1): los dos literales del test del editor; la
tupla K2 de language-provider; el describe
`#159 R7: la guarda del editor sigue en texto y dice la verdad`, 2 it, al
final del test del componente, de los que el de la Card nace verde):
  FORCE_COLOR=0 bunx jest src/screens/geofence-editor/index.test.tsx > /tmp/159-r7-ed.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 66 passed, 68 total`
  FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/159-r7-lp.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 23 passed, 24 total`
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r7-es.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 80 passed, 81 total`
  Los cuatro por asercion.
  grep -qE '^Tests: +2 failed, 66 passed, 68 total$' /tmp/159-r7-ed.txt \
    && grep -qE '^Tests: +1 failed, 23 passed, 24 total$' /tmp/159-r7-lp.txt \
    && grep -qE '^Tests: +1 failed, 80 passed, 81 total$' /tmp/159-r7-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-ed.txt)" = 2 \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-lp.txt)" = 1 \
    && test "$(grep -cE '^  ● ' /tmp/159-r7-es.txt)" = 1 \
    && ! grep -qF 'Unable to find' /tmp/159-r7-ed.txt /tmp/159-r7-lp.txt /tmp/159-r7-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r7-ed.txt /tmp/159-r7-lp.txt /tmp/159-r7-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/geofence-editor/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R7 red truthful editor guard'

c13, T7 verde (tasks.md T7 (2): `geofences.needsCollar` con L6 en `en` y
`es`; la fila de R7.1 en §2.23. La fila de #41 no se toca):
  FORCE_COLOR=0 bunx jest src/screens/geofence-editor/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g7.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       203 passed, 203 total` (68 + 24 + 81 + 30)
  <GUARDAS> > /tmp/159-g7-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +203 passed, 203 total$' /tmp/159-g7.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g7-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-no-collar-states): #159 R7 truthful editor guard copy'
  Despues, la sonda S7 de tasks.md T7 (3): en
  src/screens/geofence-editor/index.tsx, `<Card testID="geofence-editor-no-tracking"`
  pasa a `<View testID="geofence-editor-no-tracking"`. Midiendo solo el
  test del componente:
    -> `Tests:       1 failed, 80 passed, 81 total` (solo
       `el editor abre <Card testID="geofence-editor-no-tracking"> una sola vez y no usa EmptyState`)

-- T8 R8: la nota de Inicio --

c14, T8 rojo (tasks.md T8 (1): los tres literales del test de Inicio; el
describe `#159 R8: la nota de Inicio sigue en texto y dice la verdad`, 4
it, al final del test del componente, de los que el de voz y el de
`summary-note` nacen verdes):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/159-r8-home.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 218 passed, 221 total`
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-r8-es.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 83 passed, 85 total`
  Los cinco por asercion.
  grep -qE '^Tests: +3 failed, 218 passed, 221 total$' /tmp/159-r8-home.txt \
    && grep -qE '^Tests: +2 failed, 83 passed, 85 total$' /tmp/159-r8-es.txt \
    && test "$(grep -cE '^  ● ' /tmp/159-r8-home.txt)" = 3 \
    && test "$(grep -cE '^  ● ' /tmp/159-r8-es.txt)" = 2 \
    && ! grep -qF 'Unable to find' /tmp/159-r8-home.txt /tmp/159-r8-es.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/159-r8-home.txt /tmp/159-r8-es.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx src/screens/home/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/home/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R8 red truthful activity note'

c15, T8 verde (tasks.md T8 (2): `home.activityNeedsCollar` con L7 en
`en` y `es`; la fila de R8.1 en §2.23):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/159-g8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       360 passed, 360 total` (221 + 85 + 24 + 30)
  <GUARDAS> > /tmp/159-g8-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +360 passed, 360 total$' /tmp/159-g8.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g8-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile-no-collar-states): #159 R8 truthful activity note copy'
  Despues, las sondas de tasks.md T8 (3), midiendo solo el test del
  componente:
    S8a  en src/i18n/catalog.ts, anade `.` al final del valor `es` de
         `home.activityNeedsCollar`
         -> `Tests:       2 failed, 83 passed, 85 total` (el it de voz y el
            de declaracion de R8)
    S8b  en src/screens/home/index.tsx, `testID="summary-note"` pasa a
         `testID="summary-note-sonda"`
         -> `Tests:       1 failed, 84 passed, 85 total` (solo
            `Inicio abre <Text testID="summary-note"> una sola vez`)

-- T9 R9: sin movimiento ni dependencias (nace verde) --

c16, T9 (tasks.md T9 (1): el describe
`#159 R9: los estados sin collar no traen movimiento ni dependencias`, un
it.each de 10 filas, al final del test del componente):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/159-g9.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       95 passed, 95 total`. Si nace rojo, PARA.
  <GUARDAS> > /tmp/159-g9-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +95 passed, 95 total$' /tmp/159-g9.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/159-g9-guardas.txt \
    && git diff --quiet <H0> -- package.json bun.lock src/components/empty-state.tsx assets/ \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile-no-collar-states): #159 R9 lock no motion on no-collar screens'
  Despues:
  - tasks.md T9 (3), desde la raiz, con salida al impl:
      git diff --quiet <H0> -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/components/empty-state.tsx mobile-pet-tracker/assets/; echo "sin-diff=$?"   -> sin-diff=0
  - Las sondas de tasks.md T9 (2), midiendo solo el test del componente:
    S9a  anade al final de src/screens/map/index.tsx la linea
         `// react-native-reanimated Animated LayoutAnimation entering= MOTION_`
         -> `Tests:       5 failed, 90 passed, 95 total` (las 5 filas del Mapa)
    S9b  lo mismo en src/screens/geofences/index.tsx
         -> `Tests:       5 failed, 90 passed, 95 total` (las 5 filas de Zonas seguras)

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe,
con salida al impl:
- El comando BASE, con la salida a /tmp/159-final.txt
    -> exit=0, `Test Suites: 10 passed, 10 total` y `Tests:       749 passed, 749 total`
       (reparto: empty-state 95, language-provider 24, ui-language 30,
       map 109, geofences 58, geofence-editor 68, home 221,
       design-drift 62, consistency 55, legibility 27)
- `pgrep -af '[i]nit\.sh'` vacio; despues el comando ALL con la salida a
  /tmp/159-all.txt -> exit=0 y el total de `Tests:` = el de ALL base + 50.
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y
  `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0.
- `git diff --stat <H0> -- package.json bun.lock app.json src/theme`
  -> vacio. Esta spec no anade dependencias ni toca tokens ni motion.ts.
Desde la raiz del repo (`cd /home/claude/sites/Pet-Tracker-wt-159 && pwd`):
- Las anclas A1-A28 y H1-H26 con sus valores de cierre, y P1-P12.
- `git diff --stat <H0> -- backend-pet-tracker/ infra-pet-tracker/`   -> vacio
- `git diff --name-only <H0> HEAD -- docs/`   -> exactamente docs/verification.md
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 11 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-no-collar-states-pingo/traceability.md, solo
la columna «Commit (hash + mensaje)»: hash corto + mensaje del rojo y del
verde, `rojo → verde`. R1-R5, R7 y R8 citan su rojo y su verde. R6 y R9:
`sondas S6a-S6b (impl) → <hash del candado> <mensaje>` y
`sondas S9a-S9b (impl) → <hash del candado> <mensaje>`. La fila R10 se
queda `pendiente`. No toques su frontmatter, ni la columna de tests, ni
el resto del fichero. Termina el impl con la linea
`R10: pendiente del smoke humano`. c17, desde la raiz:
  git add specs/mobile-no-collar-states-pingo/traceability.md progress/impl_mobile-no-collar-states-pingo.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-no-collar-states-pingo.md specs/mobile-no-collar-states-pingo/traceability.md ' \
    && git commit -m 'docs(mobile-no-collar-states-pingo): #159 traceability'
Despues, la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-no-collar-states-pingo.md' ':!specs/mobile-no-collar-states-pingo/requirements.md' ':!specs/mobile-no-collar-states-pingo/design.md' ':!specs/mobile-no-collar-states-pingo/tasks.md' ':!progress/review_mobile-no-collar-states-pingo.md'
    -> exactamente los 15 ficheros de abajo
y c18, desde la raiz:
  git commit --only progress/impl_mobile-no-collar-states-pingo.md -m 'docs(mobile-no-collar-states-pingo): #159 closed file list'
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex, cero
  `StyleSheet.create`, cero clases arbitrarias, cero `style`. Las clases
  son literales completos, nunca compuestas. Ni token nuevo, ni Card
  nueva, ni pose nueva, ni movimiento: se reutiliza el EmptyState de #155
  tal cual (R9). El copy del canvas de referencia NO esta aprobado: el
  unico copy valido es el de requirements.md §Tabla de literales.
- Skills: carga `building-native-ui` (tu plugin expo) y, de .agents/skills/
  del repo, `appllama-app-design-skill` (OBLIGATORIA: cambias dos
  pantallas; ver docs/ui-guidelines.md §Skills y sus tres limites) y
  `emil-design-eng`. Las decisiones de la spec mandan sobre cualquier
  skill. Descartado: animacion de cualquier tipo (Reanimated, `entering`,
  `MOTION_*`, LayoutAnimation, Lottie, Rive), `expo-linear-gradient`,
  `expo-symbols`, hex, `StyleSheet.create` o clases arbitrarias. Di en el
  impl cuales cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas sobre
  el arbol renderizado. Se espera a un texto o nodo visible (`findByTestId`,
  `waitFor` sobre `getByTestId(...)`/`getByText`), NUNCA al contador de un
  mock. Los mocks (`mockRouter.push`...) se leen DESPUES de que el nodo
  exista, como asercion, nunca como espera. Una ausencia se ancla siempre
  a un nodo positivo presente en el mismo render (los it «no pinta el
  botón» / «no ofrece acción» esperan antes a `-title`). En RNTL 14
  `toHaveTextContent` compara el texto entero: literal completo del
  catalogo, sobre `-title` o `-body`, nunca sobre la raiz del EmptyState.
- La pose se asevera como en #155 R4: `props.source` igual a
  `[expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-collar\.webp$/) })]`.
- Valores esperados LITERALES en los tests (el copy, las clases, las
  rutas, los nombres de fichero), nunca el simbolo importado de
  produccion. Las ausencias sobre texto o fuente con
  `expect(x).not.toMatch(re)` o `not.toContain`, nunca
  `expect(re.test(x)).toBe(false)`.
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error y tumbaria la cadena). Reutiliza lo que ya
  hay en la cabecera de cada test (render, providers, mocks, helpers): no
  lo dupliques.
- design-drift recorre tambien los tests co-locados (map, geofences,
  home) y catalog.ts: ninguna cadena nueva lleva un guion pegado a `[` ni
  `StyleSheet`, y todo `#159` va seguido de ` R<n>` (un `#159` suelto lo
  caza el guard de hex). Lo mismo en el codigo de produccion: los
  comentarios citan `#159 R<n>`. Las filas `← añadida por #159 (R1)` solo
  viven en el test del componente (bajo __tests__/) y en la spec de idioma.
- specs/mobile-ui-language/design.md: solo el bloque §2.23 (encabezado y
  filas de R1.3, R2.4, R7.1 y R8.1, byte a byte). No toques nada mas de
  ese fichero; §2.22 esta reservada para #158 y no la creas.
- docs/verification.md: solo la frase de R2.5, en su misma linea.
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx. Nada de prettier (mobile no lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo. En particular, NO:
  src/components/empty-state.tsx, src/screens/geofence-editor/index.tsx
  (solo en la sonda S7, revertida), src/screens/home/index.tsx (solo en
  la sonda S8b, revertida), src/screens/docs/, src/api/, app/,
  src/theme/, assets/, docs/ui-guidelines.md.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter de los ficheros de la
  spec y las casillas de §Aprobacion de requirements.md (incluida la de
  la prueba de humo R10). Los escribe el leader o el humano. Todo lo que
  tengas que contar va en progress/impl_mobile-no-collar-states-pingo.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (15, ni uno mas):
  docs/verification.md
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
  mobile-pet-tracker/src/screens/geofences/index.test.tsx
  mobile-pet-tracker/src/screens/geofences/index.tsx
  mobile-pet-tracker/src/screens/home/index.test.tsx
  mobile-pet-tracker/src/screens/map/index.test.tsx
  mobile-pet-tracker/src/screens/map/index.tsx
  progress/impl_mobile-no-collar-states-pingo.md
  specs/mobile-no-collar-states-pingo/traceability.md
  specs/mobile-ui-language/design.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de la lista cerrada; cualquier otro fichero
ajeno en `git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R9 de requirements.md. La prueba de humo de
R10 (dev build de Android) es del humano: no la marques. Deja en el impl
sus pasos (requirements.md R10.1), listos para el humano (tasks.md T10 (1)).

Al terminar, progress/impl_mobile-no-collar-states-pingo.md debe tener:
pwd, branch, H0 y status; el exit de is-ancestor; node_modules (presente
o instalado); skills cargadas; la salida de las 54 anclas (A1-A28,
H1-H26) en H0 y la de cierre, mas P1-P12; la base con su exit (comando
BASE) y el ALL de la base; los 16 commits de T1-T9 con hash y R-id; por
cada rojo, el comando, la linea `Tests:`, el exit y cada it rojo con su
matcher y Expected/Received o la consulta; cada verde y candado con sus
lineas `Tests:`, GUARDAS, typecheck y lint; las sondas S4a-S4c, S6a-S6b,
S7, S8a-S8b y S9a-S9b con su linea `Tests:` roja, sus `●` y su
`limpio=0`; el sin-diff de T9 (3); el cierre (10 ficheros con 749, ALL
con exit y total, typecheck, lint, diffs vacios, lista cerrada); los
pasos de la prueba de humo R10; la linea `R10: pendiente del smoke
humano`; y cualquier decision que la spec no cerrara literalmente.
```
