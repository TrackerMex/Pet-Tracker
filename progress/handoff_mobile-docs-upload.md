# Handoff a Codex CLI — #158 mobile-docs-upload

> Lo escribe el leader. El humano copia el bloque de abajo, entero, en una
> terminal de Codex CLI abierta en el worktree de #158. `<H0>` es el hash corto
> del commit del leader que registra este fichero: Codex lo mide al arrancar
> (`git rev-parse --short HEAD`) y lo sustituye en todos los comandos. Codex
> no ve la conversacion que origino la spec: todo lo que necesita esta aqui o
> en specs/mobile-docs-upload/. El handoff es por disco: Codex escribe
> progress/impl_mobile-docs-upload.md y el leader lanza al reviewer cuando el
> humano confirma que Codex termino.

```
Worktree: /home/claude/sites/Pet-Tracker-wt-158   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio.
Branch:   feature/158-mobile-docs-upload
Feature:  #158 mobile-docs-upload (subir documentos medicos desde la pantalla Documentos)
Spec:     specs/mobile-docs-upload/requirements.md (APROBADA, firma 81d14978),
          design.md, tasks.md y traceability.md de la misma carpeta.

Al arrancar, desde /home/claude/sites/Pet-Tracker-wt-158, y pega las cuatro
salidas al principio de progress/impl_mobile-docs-upload.md:
  pwd
  git branch --show-current
  git rev-parse --short HEAD
  git status --short
El hash de la tercera linea es H0: sustituye `<H0>` por el en TODOS los
comandos de este handoff. PARA si la branch no es
feature/158-mobile-docs-upload o si `git status --short` no sale vacio.

Worktrees que NO son tuyos (no hagas cd a ellos, no leas de ellos para
decidir, no escribas en ellos):
  /home/claude/sites/Pet-Tracker              (main)
  /home/claude/sites/Pet-Tracker-wt-134       (otra sesion, #134)
  /home/claude/sites/Pet-Tracker-wt-155       (#155, cerrada)
  /home/claude/sites/Pet-Tracker-wt-159       (otra sesion, #159)
  /home/claude/sites/Pet-Tracker-wt-backend   (otra sesion)

Decisiones: TODAS cerradas. requirements.md §Decisiones abiertas (DA1-DA8)
quedan TAL COMO ESTAN ESCRITAS. En particular DA8: `docs.emptyBody` dice
«de tu mascota», SIN `{{petName}}`; la alternativa `docs.emptyBodyNoName`
que se describe alli es la opcion descartada: no la implementes. Si algo no
esta cerrado literalmente en la spec o aqui, PARA y preguntalo en el impl;
no lo decidas tu.

== QUE HACES ==

26 commits, en este orden (27 si R4 necesita verde, ver T4):
  c0 chore (dependencia), T1 R1 rojo y verde, T2 R2 rojo y verde, T3 R3
  rojo y verde, T4 R4 candado (y verde solo si hace falta), T5-T12 R5-R12
  rojo y verde, traceability, lista cerrada.
Rojo y verde SIEMPRE en commits separados (C4 de CHECKPOINTS.md): primero
el commit del test en rojo, despues el de la implementacion. Nunca test e
implementacion en el mismo commit. En #19 se metio todo en un commit y no
hubo historial rojo->verde: no lo repitas.

Esto manda sobre tasks.md cuando no coinciden:
- Cada paso corre el fichero de test ENTERO, no `-t '<patron>'`: la linea
  `Tests:` del fichero entero es la que se comprueba.
- La traceability se rellena UNA vez, al final (no tras cada commit).
- El diff final se mide desde <H0> (no desde 65f37841).
- Sin commits de refactor: los (3) de tasks.md dicen «nada previsto».
- NO corras ./init.sh (ver REGLAS CRITICAS).
- NO uses prettier: mobile-pet-tracker/ no lo tiene (ni dependencia, ni
  configuracion, ni regla de eslint) y `bunx prettier` lo bajaria y
  reformatearia ficheros enteros con otro estilo. Formatea a mano como el
  codigo que rodea al cambio; el lint es el juez.
- Todo con bun/bunx. NUNCA npm ni npx.

== BASE ==

Desde la raiz del worktree:
  git fetch origin
  git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
    -> exit=1 esperado: origin/main (fb1e562d) va por delante de la base de
       la spec (65f37841) solo con ficheros de backend y del harness de #162
       (ancla H2). NO pares, NO rebasees y NO mergees: lo hace el leader al
       cerrar. Si origin/main se mueve mas durante tu trabajo, tampoco.
  git merge-base --is-ancestor 65f37841 HEAD; echo "exit=$?"     -> exit=0 (si no, PARA)
Desde mobile-pet-tracker/:
  test -d node_modules; echo "exit=$?"                          -> exit=0 (si no, PARA)
  test ! -e .expo/types/router.d.ts; echo "exit=$?"             -> exit=0
    Si sale 1, PARA y pide al humano que lo borre. NO lo borres tu (ni
    `rm -f`: tu sandbox lo deniega y es un fichero de tipos de rutas
    obsoletas que rompe el typecheck).
  pgrep -af '[i]nit\.sh'; echo "exit=$?"
    -> exit=1 y sin salida. Si sale algo, otra sesion esta corriendo init.sh
       sobre el Postgres y el LocalStack compartidos: espera a que termine
       antes de medir (la carga da rojos falsos).

<NUEVE> es este texto literal (los 9 ficheros de test que esta feature
toca o que la vigilan); sustituyelo tal cual donde aparezca:
  src/screens/docs/index.test.tsx src/api/__tests__/media.test.ts src/providers/__tests__/language-provider.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts app.config.test.ts

<COMPROBAR> es este texto literal:
  test ! -e .expo/types/router.d.ts && bunx tsc --noEmit && bunx expo lint --no-cache

BASE, desde mobile-pet-tracker/:
  FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-base.txt 2>&1; echo "exit=$?"
    -> exit=0, `Test Suites: 9 passed, 9 total` y `Tests:       314 passed, 314 total`
       Reparto (medido por el leader en 81d14978): docs 16, media 15,
       language-provider 24, empty-state 64, ui-language 30,
       consistency-classnames 55, design-drift 62, legibility-classnames 27,
       app.config 21.
  bunx tsc --noEmit; echo "exit=$?"             -> exit=0
  bunx expo lint --no-cache; echo "exit=$?"     -> exit=0 y sin salida
Si algo no cuadra, PARA y pega la salida en el impl.

== ANCLAS ==

1) design.md §Base medida, B1-B51: vuelve a ejecutarlas TODAS, cada una
desde donde dice (sin marca: desde mobile-pet-tracker/; «(raíz)»: desde la
raiz del worktree), y pega cada salida en el impl. Deben dar exactamente lo
que dice su tabla. El leader las ejecuto en 81d14978 y dieron todas lo
esperado. Si una sola no coincide, PARA y avisa.

2) Anclas propias de este handoff. Desde la raiz del worktree; cada una con
su salida esperada tras `->`. Pega cada salida en el impl. Si una no
coincide, PARA.
  H1  grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-09) ← gate obligatorio antes de implementar' specs/mobile-docs-upload/requirements.md   -> 1
  H2  git diff --name-only 65f37841 fb1e562d -- mobile-pet-tracker specs/mobile-ui-language specs/mobile-docs-upload | grep -c .   -> 0
  H3  grep -cF -- '- [ ] Smoke R13 superado en dev build de Android (fecha: ____)' specs/mobile-docs-upload/requirements.md   -> 1   (es del humano: NO la toques)
  H4  grep -cF '"expo-document-picker": "~57.0.1"' mobile-pet-tracker/node_modules/expo/bundledNativeModules.json   -> 1
  H5  grep -cF '"plugins": [' mobile-pet-tracker/app.json   -> 1
  H6  grep -cF "headers: { 'Content-Type': contentType }," mobile-pet-tracker/src/api/media.ts   -> 1
      (por eso el `it` de `uploadPhotoToUrl` con 'application/pdf' de R2 sale VERDE de entrada en
      tiempo de ejecucion; solo el typecheck lo rechaza hasta el verde de R2. Ver T2.)
  H7  grep -cF "} from '../media';" mobile-pet-tracker/src/api/__tests__/media.test.ts   -> 1
  H8  grep -cF "it('#73 R5:" mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1   (patron del it de R1)
  H9  grep -cF "it('pinta la pose, el título y la frase de Pingo'" mobile-pet-tracker/src/screens/docs/index.test.tsx   -> 1
  H10 grep -cF 'async function renderDocs() {' mobile-pet-tracker/src/screens/docs/index.test.tsx   -> 1
  H11 grep -cF 'expo-document-picker' mobile-pet-tracker/src/screens/docs/index.test.tsx   -> 0
  H12 grep -cF "jest.requireActual('../../api/media')" mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 1   (patron del doble de media)
  H13 grep -cF 'globalThis.fetch' mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 1   (patron del fetch del asset)
  H14 grep -cF "it('preserves every mutation sign-out with zero delta'" mobile-pet-tracker/src/__tests__/design-drift.test.ts   -> 1   (el unico it de design-drift que cae en R9)
  H15 grep -B1 -F 'expect(R7_PROFILE).toHaveLength(35 - 1 + 2 + 1);' mobile-pet-tracker/src/__tests__/ui-language.test.ts | grep -cF "it('resuelve las 36 ocurrencias normativas'"   -> 1
      (OJO: el titulo de ese it dice HOY 36, no 37, y hay OTRO it con el mismo titulo mas arriba
      en el fichero. En T12 cambias SOLO el titulo de la linea inmediatamente anterior a B18.)
  H16 grep -cF "it('resuelve las 36 ocurrencias normativas'" mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 2
  H17 grep -cxF '## 3. La infraestructura' specs/mobile-ui-language/design.md   -> 1   (§2.22 va justo antes)
  H18 grep -cF '### Esperas sobre el árbol renderizado' docs/conventions.md   -> 1
  H19 grep -cF '| R13 | pendiente (smoke humano; sin test automático) |' specs/mobile-docs-upload/traceability.md   -> 1
  H20 grep -c prettier mobile-pet-tracker/package.json mobile-pet-tracker/eslint.config.js   -> `mobile-pet-tracker/package.json:0` y `mobile-pet-tracker/eslint.config.js:0`
  H21 ls -d .agents/skills/appllama-app-design-skill   -> .agents/skills/appllama-app-design-skill
  H22 grep -rlF 'PetDocument' mobile-pet-tracker/src | LC_ALL=C sort   -> exactamente estas dos lineas:
        mobile-pet-tracker/src/api/media.ts
        mobile-pet-tracker/src/screens/docs/index.tsx

Valores al cerrar (en el CIERRE las vuelves a ejecutar). Desde
mobile-pet-tracker/:
  grep -cF '"expo-document-picker": "~57.0.1"' package.json                          -> 1
  grep -cF 'rounded-xl bg-accent' src/screens/docs/index.tsx                         -> 2
  grep -cF 'signOut(' src/screens/docs/index.tsx                                     -> 1
  grep -cF 'bg-accent-soft' src/screens/docs/index.tsx                               -> 0
  grep -cE 'text-accent([^-]|$)' src/screens/docs/index.tsx                          -> 0
  grep -cF 'StyleSheet' src/screens/docs/index.tsx src/screens/docs/index.test.tsx   -> `...index.tsx:0` y `...index.test.tsx:0`
  grep -cF 'refetchInterval' src/screens/docs/index.tsx                              -> 0
  grep -cF 'useFocusEffect' src/screens/docs/index.tsx                               -> 0
  grep -cF '{{petName}}' src/i18n/catalog.ts                                         -> 2
  grep -cF "it('no ofrece acción'" src/screens/docs/index.test.tsx                   -> 0
  grep -cF 'no ofrece acción a quien no es owner (#158 R4)' src/screens/docs/index.test.tsx   -> 1
  grep -cF '+ 12 // #158 R1' src/providers/__tests__/language-provider.test.tsx      -> 1
  grep -cF '13 + 1 + 1 + 1 + 1 + 1 + 1' src/__tests__/consistency-classnames.test.ts -> 2
  grep -cF "'screens/docs/index.tsx': 1, // #158 R9" src/__tests__/design-drift.test.ts -> 1
  grep -cF "{ file: 'src/screens/docs/index.tsx', key:" src/__tests__/ui-copy-table.ts -> 22
  grep -cF '35 - 1 + 2 + 1 + 16' src/__tests__/ui-language.test.ts                  -> 1
  grep -cF "it('resuelve las 53 ocurrencias normativas'" src/__tests__/ui-language.test.ts -> 1
  grep -cF "it('resuelve las 36 ocurrencias normativas'" src/__tests__/ui-language.test.ts -> 1
  grep -cF '### §2.22 — Añadidos por #158 — Subir documentos' ../specs/mobile-ui-language/design.md -> 1
  grep -cF '<HeaderHeightContext.Provider value={91}>' src/screens/docs/index.test.tsx -> 1

== COMMITS ==

Todo desde /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker salvo
donde se diga. Cada cadena EMPIEZA con su `cd` literal: copialo, aunque
creas estar ya ahi. Cada commit va ENCADENADO con && a su verificacion: si
un eslabon falla, el commit no se hace. Nunca commitees fuera de estas
cadenas ni con un exit distinto de 0 en la cadena. Si una cadena no llega
al commit, PARA y reporta en el impl el eslabon que fallo y su salida.

Error de invocacion != rojo. Si un comando falla por como se invoco (cwd
equivocado, `ERR_PNPM_*`, `command not found`, ruta mal escrita, flag
desconocido, `No tests found`), eso NO es el rojo esperado: PARA, corrige
la invocacion SIN commitear nada, apunta en el impl que paso y retoma desde
el mismo paso. Nunca commitees para «salir» de un error de invocacion.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). Siempre
`FORCE_COLOR=0 bunx jest ... > /tmp/158-<paso>.txt 2>&1; echo "exit=$?"`.
Formato de la linea en rojo: `Tests:       3 failed, 64 passed, 67 total`;
en verde: `Tests:       67 passed, 67 total`. Anota cada exit en el impl.

Rojos: cada uno cae como dice la tabla de abajo, por ASERCION
(Expected/Received) o por CONSULTA (`Unable to find an element with
testID: ...`/`with text: ...`). Nunca por TypeError, ReferenceError,
SyntaxError ni `Cannot find module`. La unica excepcion es T2, y su cadena
la acota. La cadena comprueba la cuenta; tu ademas abres el log y copias al
impl cada it rojo con su matcher y su Expected/Received (o su consulta).
Donde la tabla admite dos cuentas («15 o 16»), la fila que puede salir
verde es la que nombra la tabla y ninguna otra: si sale verde otra fila,
PARA. Di en el impl cual de las dos cuentas salio.

Typecheck y lint en los rojos: van normales (<COMPROBAR>, exit 0) salvo en
T2, donde la cadena los acota.

Arbol limpio antes de cada commit: NO uses `git status --short` despues de
`git add` (siempre sale con lo staged y con el impl sin trackear). Las
cadenas usan, desde mobile-pet-tracker/:
  git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)"
(nada sin stagear ni sin trackear dentro de mobile-pet-tracker/) y el
conjunto exacto de lo staged:
  test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = '<lista> '

Recuentos encadenados (total de cada fichero tras el commit; cada total =
el anterior + los it que ese paso anade):
  paso       +it  docs  media  lang-prov  empty-st  <NUEVE> total
  BASE        -    16    15     24         64        314
  c0 chore    0    16    15     24         64        314
  T1 R1       1    16    15     25         64        315   (+1 it en lang-prov; docs y empty-st cambian literales)
  T2 R2      54    16    69     25         64        369
  T3 R3      21    37    69     25         64        390
  T4 R4       6    43    69     25         64        396
  T5 R5      16    59    69     25         64        412
  T6 R6       5    64    69     25         64        417
  T7 R7       3    67    69     25         64        420
  T8 R8       7    74    69     25         64        427
  T9 R9      23    97    69     25         64        450
  T10 R10     9   106    69     25         64        459
  T11 R11     2   108    69     25         64        461
  T12 R12     0   108    69     25         64        461
ui-language 30, consistency 55, design-drift 62, legibility 27 y
app.config 21 no ganan ni pierden it en toda la feature. Total final: 147
it nuevos (1 + 54 + 92), 461 en <NUEVE>.

Rojos esperados (fichero del paso / <NUEVE>; FAIL = suites que salen FAIL):
  T1 R1   lang-prov 2 (el it nuevo y el recuento 383), empty-st 1 (`declara docs.emptyBody en inglés y en español`),
          docs 1 (`pinta la pose, el título y la frase de Pingo`) -> <NUEVE> 4 failed, 311 passed, 315 total
  T2 R2   media 53 (los 54 nuevos menos `uploadPhotoToUrl` con 'application/pdf', verde de entrada: H6)
          -> <NUEVE> 53 failed, 316 passed, 369 total
  T3 R3   docs 4 (con documentos, vacio y las 2 entradas; las 17 SHALL NOT salen verdes), consistency 2 (17 != 18)
          -> <NUEVE> 6 failed, 384 passed, 390 total
  T4 R4   docs 0 (verde de entrada) -> <NUEVE> 396 passed. Si no, ver T4.
  T5 R5   docs 15 o 16 (la fila `canceled` puede salir verde), consistency 2 (18 != 19)
          -> <NUEVE> 17 o 18 failed
  T6 R6   docs 5 -> <NUEVE> 5 failed, 412 passed, 417 total
  T7 R7   docs 3 -> <NUEVE> 3 failed, 417 passed, 420 total
  T8 R8   docs 6 o 7 (`rehabilitar` puede salir verde) -> <NUEVE> 6 o 7 failed
  T9 R9   docs 22 o 23 (la fila «Error de R6» del nuevo intento puede salir verde), design-drift 1 (H14, 0 != 1)
          -> <NUEVE> 23 o 24 failed
  T10 R10 docs 9 -> <NUEVE> 9 failed, 450 passed, 459 total
  T11 R11 docs 2 -> <NUEVE> 2 failed, 459 passed, 461 total
  T12 R12 ui-language 1 (37 != 53) -> <NUEVE> 1 failed, 460 passed, 461 total

-- c0: dependencia --

  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && bunx expo install expo-document-picker; echo "exit=$?"
    -> exit=0. Si el sandbox te deniega la red o la instalacion, PARA y
       reportalo: no lo sustituyas por `bun add`, npm ni npx.
  Que puede cambiar: package.json (`"expo-document-picker": "~57.0.1"`),
  bun.lock y, si `expo install` lo anade el solo, el array `plugins` de
  app.json. No anadas opciones de plugin a mano. Si cambia cualquier otro
  fichero, PARA.
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-c0.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       314 passed, 314 total` (app.config.test.ts vigila los plugins de app.json)
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker \
    && grep -qE '^Tests: +314 passed, 314 total$' /tmp/158-c0.txt \
    && test "$(grep -cF '"expo-document-picker": "~57.0.1"' package.json)" = 1 \
    && <COMPROBAR> \
    && git add package.json bun.lock \
    && { git diff --quiet -- app.json || git add app.json; } \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && S="$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" \
    && { test "$S" = 'mobile-pet-tracker/bun.lock mobile-pet-tracker/package.json ' || test "$S" = 'mobile-pet-tracker/app.json mobile-pet-tracker/bun.lock mobile-pet-tracker/package.json '; } \
    && git commit -m 'chore(mobile-docs-upload): add expo-document-picker'
  Di en el impl si app.json cambio y pega `git show --stat HEAD`.

-- T1 R1: el catalogo --

T1 rojo (tasks.md R1 (1), literal). language-provider: `+ 12 // #158 R1`
despues de `+ 5, // #155 R1` (B20; 371 -> 383) y el
`it('#158 R1: ...')` nuevo con el patron del it de #73 R5 (H8). Los 13
pares en/es son los de requirements.md §Copy nueva, BYTE A BYTE (copialos
de alli, no los reescribas: acentos, comas, «10 MB», sin punto final en
los errores, con punto en docs.emptyBody). Ademas los dos literales viejos
de docs.emptyBody: la fila de `copyRows` de empty-state.test.tsx (B21) y el
it de H9, que pasa a esperar
`Cuando se suba un documento médico de tu mascota, te lo guardo aquí.`
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx src/components/__tests__/empty-state.test.tsx src/screens/docs/index.test.tsx > /tmp/158-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 101 passed, 105 total`
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-r1-todo.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 311 passed, 315 total`
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker \
    && grep -qE '^Tests: +4 failed, 101 passed, 105 total$' /tmp/158-r1.txt \
    && grep -qE '^Tests: +4 failed, 311 passed, 315 total$' /tmp/158-r1-todo.txt \
    && test "$(grep -oE '^FAIL [^ ]+' /tmp/158-r1-todo.txt | LC_ALL=C sort -u | tr '\n' ' ')" = 'FAIL src/components/__tests__/empty-state.test.tsx FAIL src/providers/__tests__/language-provider.test.tsx FAIL src/screens/docs/index.test.tsx ' \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/158-r1.txt /tmp/158-r1-todo.txt \
    && <COMPROBAR> \
    && git add src/providers/__tests__/language-provider.test.tsx src/components/__tests__/empty-state.test.tsx src/screens/docs/index.test.tsx \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/screens/docs/index.test.tsx ' \
    && git commit -m 'test(mobile-docs-upload): red catalog keys and new Pingo line (R1)'

T1 verde (tasks.md R1 (2)). Las 12 claves en `en` y en `es` de
src/i18n/catalog.ts y el valor nuevo de docs.emptyBody en los dos. En
specs/mobile-ui-language/design.md, la seccion
`### §2.22 — Añadidos por #158 — Subir documentos` justo antes de
`## 3. La infraestructura` (H17), con una linea en blanco arriba y otra
abajo, cabecera `| # | Clave | \`en\` | \`es\` | Origen |` y 13 filas en
el orden de §Copy nueva, con el mismo formato de fila que §2.21 (B22): 12
terminan en `← añadida por #158 (R1)` y la de docs.emptyBody en
`← cambiada por #158 (R1)`. La fila de #155 de §2.21 se queda. No toques
nada mas de ese fichero.
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       315 passed, 315 total`
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker \
    && grep -qE '^Tests: +315 passed, 315 total$' /tmp/158-g1.txt \
    && test "$(grep -cF '### §2.22 — Añadidos por #158 — Subir documentos' ../specs/mobile-ui-language/design.md)" = 1 \
    && awk '/^### §2\.22 /{a=NR} /^## 3\. La infraestructura$/{b=NR} END{exit !(a && b && a<b)}' ../specs/mobile-ui-language/design.md \
    && <COMPROBAR> \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && git commit -m 'feat(mobile-docs-upload): catalog keys and new Pingo line (R1)'

-- T2 R2: la API de media --

T2 rojo (tasks.md R2 (1), literal: 54 it en un describe `#158 R2: ...` de
src/api/__tests__/media.test.ts, ampliando el import de H7; las fixtures
de `PetDocument` que ya existen en ese fichero ganan `downloadUrl`).
`DOCUMENT_MAX_BYTES` se compara con el literal `10485760`. Excepcion
acotada de este rojo: las funciones nuevas aun no existen, asi que sus it
caen por `TypeError: ... is not a function` (solo de
resolveDocumentContentType, createPetDocument y confirmPetDocumentUpload),
el typecheck falla SOLO en media.test.ts y el lint, si falla, solo con
`import/named` en ese fichero. El it de `uploadPhotoToUrl` con
'application/pdf' sale VERDE (H6): 53 rojos, no 54.
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest src/api/__tests__/media.test.ts > /tmp/158-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       53 failed, 16 passed, 69 total`
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-r2-todo.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       53 failed, 316 passed, 369 total`
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && bunx tsc --noEmit > /tmp/158-r2-tsc.txt 2>&1; echo "exit=$?"
    -> exit distinto de 0; solo errores `error TS` en src/api/__tests__/media.test.ts
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && bunx expo lint --no-cache > /tmp/158-r2-lint.txt 2>&1; echo "exit=$?"
    -> exit=0, o exit=1 solo con `import/named` en src/api/__tests__/media.test.ts
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker \
    && grep -qE '^Tests: +53 failed, 16 passed, 69 total$' /tmp/158-r2.txt \
    && grep -qE '^Tests: +53 failed, 316 passed, 369 total$' /tmp/158-r2-todo.txt \
    && test "$(grep -oE '^FAIL [^ ]+' /tmp/158-r2-todo.txt | LC_ALL=C sort -u | tr '\n' ' ')" = 'FAIL src/api/__tests__/media.test.ts ' \
    && test -z "$(grep -E 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/158-r2.txt | grep -vE '(resolveDocumentContentType|createPetDocument|confirmPetDocumentUpload)\)? is not a function')" \
    && grep -q 'error TS' /tmp/158-r2-tsc.txt \
    && test -z "$(grep 'error TS' /tmp/158-r2-tsc.txt | grep -v '^src/api/__tests__/media\.test\.ts(')" \
    && test -z "$(grep -E '^ +[0-9]+:[0-9]+ ' /tmp/158-r2-lint.txt | grep -vE 'import/named$')" \
    && test -z "$(grep -E '^/' /tmp/158-r2-lint.txt | grep -vF '/mobile-pet-tracker/src/api/__tests__/media.test.ts')" \
    && test ! -e .expo/types/router.d.ts \
    && git add src/api/__tests__/media.test.ts \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/api/__tests__/media.test.ts ' \
    && git commit -m 'test(mobile-docs-upload): red media API for document upload (R2)'
  Si el it de 'application/pdf' sale rojo, PARA (no ajustes la cuenta).
  Pega en el impl los `error TS` y, si los hubo, los errores de lint.

T2 verde (tasks.md R2 (2) y (3)): R2 en src/api/media.ts. En el mismo
commit, las fixtures de `PetDocument` de src/screens/docs/index.test.tsx
ganan `downloadUrl` (el campo pasa a ser obligatorio; B15: 9 `docs: [`,
las que no son `[]` lo necesitan). NO extraigas un helper comun con
`resolvePhotoContentType` (design.md D2). Comentarios: solo `#158 R2`.
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-g2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       369 passed, 369 total`
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker \
    && grep -qE '^Tests: +369 passed, 369 total$' /tmp/158-g2.txt \
    && <COMPROBAR> \
    && git add src/api/media.ts src/screens/docs/index.test.tsx \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/api/media.ts mobile-pet-tracker/src/screens/docs/index.test.tsx ' \
    && git commit -m 'feat(mobile-docs-upload): media API creates, uploads and confirms documents (R2)'
  Si el typecheck pide `downloadUrl` en algun fichero que no sea media.ts,
  media.test.ts (ya commiteado en el rojo) o docs/index.test.tsx, PARA (H22
  dice donde se usa `PetDocument`).

-- Patron de los pasos de pantalla T3-T11 --

Todos los rojos de T3-T11 viven en src/screens/docs/index.test.tsx y
siguen tasks.md §Reglas comunes de los tests de pantalla, entera (montaje
con `await renderDocs()`, dobles por intencion con `...jest.requireActual`
para `../../api/media`, `expo-document-picker` y `expo-web-browser` como
`jest.fn()`, `globalThis.fetch` restaurado en `afterEach`, `signOut` con
nombre, `pending()` para pendiente, roles con `{ ...makePet(), myRole }`,
clases con `expect.stringContaining`, formulario relleno con Tipo
`Vacunación`, Nombre `Antirrábica`, Fecha `2026-10-01`, Veterinario
`Dra. Pérez`). Todos los verdes viven en src/screens/docs/index.tsx.
Cadena de cada paso <P> con su <N> it en docs, su <D> docs total y su
<T> total de <NUEVE> (valores en cada T):

  rojo:
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest src/screens/docs/index.test.tsx > /tmp/158-<p>.txt 2>&1; echo "exit=$?"
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-<p>-todo.txt 2>&1; echo "exit=$?"
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker \
    && grep -qE '^Tests: +<linea docs>$' /tmp/158-<p>.txt \
    && grep -qE '^Tests: +<linea NUEVE>$' /tmp/158-<p>-todo.txt \
    && test "$(grep -oE '^FAIL [^ ]+' /tmp/158-<p>-todo.txt | LC_ALL=C sort -u | tr '\n' ' ')" = '<FAIL> ' \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/158-<p>.txt /tmp/158-<p>-todo.txt \
    && <COMPROBAR> \
    && git add <ficheros> \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = '<staged> ' \
    && git commit -m '<mensaje rojo>'

  verde:
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-g<n>.txt 2>&1; echo "exit=$?"
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker \
    && grep -qE '^Tests: +<T> passed, <T> total$' /tmp/158-g<n>.txt \
    && <COMPROBAR> \
    && git add src/screens/docs/index.tsx \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/docs/index.tsx ' \
    && git commit -m '<mensaje verde>'

`<FAIL>` con docs solo: `FAIL src/screens/docs/index.test.tsx`. Con
consistency: `FAIL src/__tests__/consistency-classnames.test.ts FAIL src/screens/docs/index.test.tsx`.
Con design-drift: `FAIL src/__tests__/design-drift.test.ts FAIL src/screens/docs/index.test.tsx`.
Las lineas `Tests:` van en la cadena como regex: donde hay dos cuentas
posibles, la alternativa va entre parentesis con `|` (regex extendida de
grep -E, sin barra invertida delante). Escribe cada cadena entera en el impl antes de correrla.

-- T3 R3: el owner ve la accion --

Rojo (tasks.md R3 (1), literal, 21 it, describe `#158 R3: ...`). En el
mismo commit: el it de B14 pasa a `{ ...makePet(), myRole: 'family' }` y
se renombra `no ofrece acción a quien no es owner (#158 R4)`; y en
src/__tests__/consistency-classnames.test.ts los DOS `13 + 1 + 1 + 1 + 1`
(B17) pasan a `13 + 1 + 1 + 1 + 1 + 1` con `// #158 R3: docs-upload`.
En las 10 filas de mascota no ok, cada paso en su propio `await`, en el
orden de tasks.md (findByTestId de la lista, getQueryState en las 8
resueltas, `act` con `setTimeout` 0, ausencias). `act` se anade al import
de `@testing-library/react-native`.
  linea docs:  `4 failed, 33 passed, 37 total`
  linea NUEVE: `6 failed, 384 passed, 390 total`; FAIL: consistency + docs
  git add src/screens/docs/index.test.tsx src/__tests__/consistency-classnames.test.ts
  staged: 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/docs/index.test.tsx'
  mensaje: test(mobile-docs-upload): red owner sees the upload action (R3)
Verde (R3 en la pantalla; `isOwner` con la forma de geofences, B25). T=390.
  mensaje: feat(mobile-docs-upload): owner sees the upload action (R3)

-- T4 R4: family, walker y vet no ven la accion --

Rojo (tasks.md R4 (1), 6 it). Lo previsto es que salga VERDE de entrada.
  Caso A (previsto): linea docs `43 passed, 43 total`, linea NUEVE
  `396 passed, 396 total`, sin FAIL (quita el eslabon de FAIL de la
  cadena y deja exit=0 en los dos jest). Commit del candado:
    git add src/screens/docs/index.test.tsx
    staged: 'mobile-pet-tracker/src/screens/docs/index.test.tsx'
    mensaje: test(mobile-docs-upload): lock non-owners without the upload action (R4)
  y NO hay verde de R4. Dilo en el impl: «R4 verde de entrada desde el
  verde de R3 (<hash>)».
  Caso B: si caen 1-6, por consulta o asercion: linea docs
  `[1-6] failed, [0-9]+ passed, 43 total`, FAIL docs, mensaje del rojo
  `test(mobile-docs-upload): red non-owners without the upload action (R4)`;
  despues el verde ajustando SOLO la condicion de R3 (T=396), mensaje
  `feat(mobile-docs-upload): hide the upload action from non-owners (R4)`.

-- T5 R5: selector y formulario --

Rojo (tasks.md R5 (1), literal, 16 it). El it de props es el UNICO del
fichero con timers falsos (`jest.useFakeTimers()` +
`jest.setSystemTime(new Date('2026-10-09T12:00:00Z'))`, esperado el
literal `'2026-10-09'`, nunca `civilTodayIso` desde el test;
`jest.useRealTimers()` en `afterEach`). Si HeroUI quita alguna clase
prescrita, PARA y avisa. En el mismo commit, los DOS recuentos de
consistency-classnames pasan a `13 + 1 + 1 + 1 + 1 + 1 + 1` con
`// #158 R5: docs-upload-submit`.
  linea docs:  `(15 failed, 44 passed|16 failed, 43 passed), 59 total`   (la que puede salir verde: la fila `canceled`)
  linea NUEVE: `(17 failed, 395 passed|18 failed, 394 passed), 412 total`; FAIL: consistency + docs
  git add src/screens/docs/index.test.tsx src/__tests__/consistency-classnames.test.ts
  staged: 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/docs/index.test.tsx'
  mensaje: test(mobile-docs-upload): red document picker and upload form (R5)
Verde (R5; el error se guarda como tipo y se traduce en un unico punto,
design.md §Ocurrencias). T=412.
  mensaje: feat(mobile-docs-upload): document picker and upload form (R5)

-- T6 R6: validacion --

Rojo (tasks.md R6 (1), 5 it).
  linea docs `5 failed, 59 passed, 64 total`; NUEVE `5 failed, 412 passed, 417 total`; FAIL docs
  git add src/screens/docs/index.test.tsx; staged: 'mobile-pet-tracker/src/screens/docs/index.test.tsx'
  mensaje: test(mobile-docs-upload): red form validation before any call (R6)
Verde. T=417. mensaje: feat(mobile-docs-upload): form validation before any call (R6)

-- T7 R7: subida correcta --

Rojo (tasks.md R7 (1), 3 it; orden con `mock.invocationCallOrder`; la
espera es a que `doc-doc-2` contenga el nombre de la fixture nueva).
  linea docs `3 failed, 64 passed, 67 total`; NUEVE `3 failed, 417 passed, 420 total`; FAIL docs
  git add src/screens/docs/index.test.tsx; staged: 'mobile-pet-tracker/src/screens/docs/index.test.tsx'
  mensaje: test(mobile-docs-upload): red successful upload refreshes the list (R7)
Verde. T=420. mensaje: feat(mobile-docs-upload): successful upload refreshes the list (R7)

-- T8 R8: botones bloqueados --

Rojo (tasks.md R8 (1), 7 it). Las 6 etapas son la UNICA excepcion de
§Esperas de este fichero junto a las filas de mascota no ok de R3: primero
`await waitFor(() => expect(<mock>).toHaveBeenCalledTimes(1))` (2 en la
ultima, sobre listPetDocs) y despues, no antes, las aserciones.
  linea docs `(6 failed, 68 passed|7 failed, 67 passed), 74 total`   (la que puede salir verde: `rehabilitar`)
  NUEVE `(6 failed, 421 passed|7 failed, 420 passed), 427 total`; FAIL docs
  git add src/screens/docs/index.test.tsx; staged: 'mobile-pet-tracker/src/screens/docs/index.test.tsx'
  mensaje: test(mobile-docs-upload): red buttons locked while uploading (R8)
Verde. T=427. mensaje: feat(mobile-docs-upload): buttons locked while uploading (R8)

-- T9 R9: errores --

Rojo (tasks.md R9 (1), literal, 23 it: 19 filas de la tabla de R9, 2 de
`unauthorized`, 2 de nuevo intento). En el mismo commit, design-drift:
`'screens/docs/index.tsx': 0,` (B16) pasa a
`'screens/docs/index.tsx': 1, // #158 R9`.
  linea docs `(22 failed, 75 passed|23 failed, 74 passed), 97 total`   (la que puede salir verde: «Error de R6» del nuevo intento)
  NUEVE `(23 failed, 427 passed|24 failed, 426 passed), 450 total`; FAIL: design-drift + docs
  git add src/screens/docs/index.test.tsx src/__tests__/design-drift.test.ts
  staged: 'mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/screens/docs/index.test.tsx'
  mensaje: test(mobile-docs-upload): red upload errors keep the screen up (R9)
Verde: una sola llamada `signOut(` en el fichero. T=450.
  mensaje: feat(mobile-docs-upload): upload errors keep the screen up (R9)

-- T10 R10: abrir un documento --

Rojo (tasks.md R10 (1), 9 it).
  linea docs `9 failed, 97 passed, 106 total`; NUEVE `9 failed, 450 passed, 459 total`; FAIL docs
  git add src/screens/docs/index.test.tsx; staged: 'mobile-pet-tracker/src/screens/docs/index.test.tsx'
  mensaje: test(mobile-docs-upload): red any member opens a document (R10)
Verde: `onPress` en la `Card` de `DocumentRow`; NO anadas
`style={CONTINUOUS_CORNER}` nuevo. T=459.
  mensaje: feat(mobile-docs-upload): any member opens a document (R10)

-- T11 R11: teclado --

Rojo (tasks.md R11 (1), 2 it). `renderDocs()` envuelve la pantalla en
`<HeaderHeightContext.Provider value={91}>`, con `HeaderHeightContext`
importado de `expo-router/react-navigation` (B34, como `renderWeightLog`).
Copia el procedimiento del it de #148 R7 de
src/screens/weight-log/index.test.tsx (B24): `Platform.OS = 'android'`
DENTRO del it, restaurado en `afterEach`; layout de alto 700,
`keyboardDidShow` con `screenY: 500` y `paddingBottom: 291` esperado con
`waitFor`. Los it de #95 R6 y de #155 R7 no se tocan y siguen verdes.
  linea docs `2 failed, 106 passed, 108 total`; NUEVE `2 failed, 459 passed, 461 total`; FAIL docs
  git add src/screens/docs/index.test.tsx; staged: 'mobile-pet-tracker/src/screens/docs/index.test.tsx'
  mensaje: test(mobile-docs-upload): red form avoids the keyboard on Android (R11)
Verde (KeyboardAvoidingView `docs-keyboard-avoider` segun requirements.md
R11; `keyboardShouldPersistTaps="handled"` en `screen-docs`). T=461.
  mensaje: feat(mobile-docs-upload): form avoids the keyboard on Android (R11)

-- T12 R12: copy registrada --

Rojo (tasks.md R12 (1)): en src/__tests__/ui-language.test.ts, la
longitud de B18 pasa a `35 - 1 + 2 + 1 + 16` con `// #158 R12` al final
del comentario existente, y el titulo de la linea INMEDIATAMENTE ANTERIOR
(H15, hoy `resuelve las 36 ocurrencias normativas`) pasa a
`resuelve las 53 ocurrencias normativas`. El otro it con titulo 36 (H16)
no se toca.
  cd /home/claude/sites/Pet-Tracker-wt-158/mobile-pet-tracker && FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/158-r12.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 29 passed, 30 total`
  NUEVE `1 failed, 460 passed, 461 total`; FAIL: `FAIL src/__tests__/ui-language.test.ts`
  git add src/__tests__/ui-language.test.ts; staged: 'mobile-pet-tracker/src/__tests__/ui-language.test.ts'
  mensaje: test(mobile-docs-upload): red copy registry for the upload screen (R12)
Verde (tasks.md R12 (2)): las 16 filas de design.md §Ocurrencias en
`R7_PROFILE` de src/__tests__/ui-copy-table.ts, junto a las seis de docs
(B19 -> 22). `SCREEN_FILES` sigue en 29. T=461.
  git add src/__tests__/ui-copy-table.ts; staged: 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts'
  mensaje: feat(mobile-docs-upload): copy registry for the upload screen (R12)

R13 es la prueba de humo del humano: no lleva test, no la marques.

== CIERRE ==

Desde mobile-pet-tracker/, sin pipe, con salida al impl:
- `FORCE_COLOR=0 bunx jest <NUEVE> > /tmp/158-final.txt 2>&1; echo "exit=$?"`
    -> exit=0, `Test Suites: 9 passed, 9 total` y `Tests:       461 passed, 461 total`
       (reparto: docs 108, media 69, language-provider 25, empty-state 64,
       ui-language 30, consistency 55, design-drift 62, legibility 27,
       app.config 21)
- `pgrep -af '[i]nit\.sh'` vacio; despues
  `FORCE_COLOR=0 bunx jest > /tmp/158-all.txt 2>&1; echo "exit=$?"` -> exit=0.
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0;
  `bunx tsc --noEmit; echo "exit=$?"` -> exit=0;
  `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0.
- Los «Valores al cerrar» de == ANCLAS ==, con su salida.
Desde la raiz del worktree:
- `git diff --stat <H0> HEAD -- backend-pet-tracker/ infra-pet-tracker/ docs/` -> vacio
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los de mobile-pet-tracker/ de la lista de abajo (14, o
     15 si c0 cambio app.json)

Despues rellena specs/mobile-docs-upload/traceability.md: en cada fila
R1-R12, la columna «Test (archivo::nombre)» pasa de «pendiente — ...» a
`<fichero>::<describe>` (los de la pantalla, `src/screens/docs/index.test.tsx::#158 R<n>: ...`;
R1 cita tambien los literales cambiados de empty-state y docs; R3 el it
redirigido a family; R12 el it de ui-language) y la columna «Commit (hash +
mensaje)» lleva el rojo y el verde (hash corto + mensaje). R4 en el caso A
cita su candado y «verde de entrada desde <hash del verde de R3>». La fila
R13 se queda TAL CUAL (H19). No toques el frontmatter (`status: draft` lo
cambia el leader) ni el resto del fichero. Termina el impl con la linea
`R13: pendiente del smoke humano`. Commit, desde la raiz:
  cd /home/claude/sites/Pet-Tracker-wt-158 \
    && git add specs/mobile-docs-upload/traceability.md progress/impl_mobile-docs-upload.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-docs-upload.md specs/mobile-docs-upload/traceability.md ' \
    && git commit -m 'docs(mobile-docs-upload): traceability (#158)'
Y la lista cerrada: anade al final del impl una seccion `## Lista cerrada`
con la salida de
  cd /home/claude/sites/Pet-Tracker-wt-158 && git diff --name-only <H0> HEAD -- . ':!progress/review_mobile-docs-upload.md' | LC_ALL=C sort
    -> exactamente los 16 ficheros de abajo (17 si c0 cambio app.json)
y commitea:
  cd /home/claude/sites/Pet-Tracker-wt-158 \
    && git add progress/impl_mobile-docs-upload.md \
    && test "$(git diff --cached --name-only | tr '\n' ' ')" = 'progress/impl_mobile-docs-upload.md ' \
    && git commit -m 'docs(mobile-docs-upload): closed file list (#158)'
No rebasees ni enmiendes despues de escribir hashes.

Si el leader commitea en mitad de tu trabajo (una correccion de la spec o
de este handoff), sus ficheros entran en `git diff <H0> HEAD`: anadelos a
la lista cerrada y di en el impl que son del leader, con el hash de su
commit. Cualquier otro fichero ajeno es motivo de parada.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (la carta). Cero hex, cero
  `StyleSheet`, cero clases arbitrarias; clases literales completas, nunca
  compuestas; ni token nuevo, ni Card nueva, ni animacion. Las clases, los
  testIDs y el orden de hijos son los de requirements.md: no los inventes.
- Skills: de tu plugin expo, carga `building-native-ui` y
  `native-data-fetching`; del repo, `.agents/skills/appllama-app-design-skill`
  (la carta la exige en tareas de UI). No hay skill de expo-router ni de
  teclado: la guia de R11 esta escrita en requirements.md R11 y en T11. Las
  decisiones de la spec mandan sobre cualquier skill. Di en el impl cuales
  cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas sobre
  el arbol renderizado (H18). Se espera al texto final ya pintado (el
  literal `es` entero con `findByText`, o un nodo con `findByTestId`/
  `waitFor` sobre `getByTestId`), NUNCA al contador de un mock. Las unicas
  excepciones son las 6 etapas de R8 y las 8 filas de mascota resuelta no
  ok de R3 (getQueryState), escritas en tasks.md. Los mocks se leen DESPUES
  de que el nodo exista, como asercion. Una ausencia se ancla a un nodo
  positivo del mismo render. `toHaveTextContent` compara el texto entero.
- Copy: los literales de requirements.md §Copy nueva se copian BYTE A BYTE
  al catalogo y a los tests (`es` en los tests de pantalla). No traduzcas,
  no cambies puntuacion. Los dos reutilizados son `common.cannotReachServer`
  (`No se pudo conectar con el servidor`) y `common.somethingWentWrong`
  (`Algo salió mal`).
- Valores esperados LITERALES en los tests (copy, clases, rutas,
  `10485760`, `'2026-10-09'`, `291`), nunca el simbolo importado de
  produccion.
- Comentarios: en codigo de produccion (src/api/media.ts,
  src/screens/docs/index.tsx) y en los tests, todo `#158` va seguido de
  ` R<n>`. Un `(#158)` o `#158:` suelto lo caza el guard `HEX_LITERAL` de
  design-drift, que tambien escanea tests.
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error). Reutiliza lo que ya hay en la cabecera del
  test de la pantalla (renderDocs, makePet, pending): no lo dupliques.
- Ruta de jest: ningun fichero de esta feature lleva parentesis en la
  ruta; si alguna vez pasas una ruta con `(tabs)` a jest, escapala.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- NO crees recursos de AWS ni corras nada que cueste dinero.
- NO toques backend-pet-tracker/ ni infra-pet-tracker/.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json (en particular su campo `status`), el
  frontmatter de los ficheros de la spec, requirements.md entero (incluidas
  las casillas de §Aprobacion y la del smoke R13) y este handoff. Todo lo
  que tengas que contar va en progress/impl_mobile-docs-upload.md, que es
  tuyo.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push, NO abras ni edites la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (16, o 17 si c0 cambio app.json; ni uno mas):
  mobile-pet-tracker/app.json   (solo si `bunx expo install` lo cambio)
  mobile-pet-tracker/bun.lock
  mobile-pet-tracker/package.json
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/__tests__/design-drift.test.ts
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/api/__tests__/media.test.ts
  mobile-pet-tracker/src/api/media.ts
  mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/screens/docs/index.test.tsx
  mobile-pet-tracker/src/screens/docs/index.tsx
  progress/impl_mobile-docs-upload.md
  specs/mobile-docs-upload/traceability.md
  specs/mobile-ui-language/design.md
No cambian (design.md §Ficheros afectados): src/app/pets/[petId]/docs.tsx,
src/app/_layout.tsx, src/components/empty-state.tsx,
src/components/card.tsx y todo backend-pet-tracker/.

Criterios de aceptacion: R1-R12 de requirements.md. La prueba de humo R13
(dev build de Android) es del humano: no la marques. Deja en el impl sus
pasos (requirements.md §Prueba de humo), listos para el humano.

Al terminar, progress/impl_mobile-docs-upload.md debe tener: pwd, branch,
H0 y status; los dos exit de is-ancestor; node_modules; skills cargadas;
la salida de B1-B51 y H1-H22 en H0 y los «Valores al cerrar»; la BASE con
su exit y su linea `Tests:`; la salida de `bunx expo install` y si cambio
app.json; los 26 (o 27) commits con hash y R-id; por cada rojo, la cadena
entera, las dos lineas `Tests:`, el exit y cada it rojo con su matcher y
Expected/Received (o la consulta); en T2 los `error TS` y el lint; cual de
las dos cuentas salio en T5, T8 y T9 y que fila salio verde; el caso (A o
B) de T4; cada verde con su linea `Tests:`, typecheck y lint; el cierre
(461 en <NUEVE>, jest entero con exit, typecheck, lint, diffs vacios, lista
cerrada); los pasos del smoke R13; la linea
`R13: pendiente del smoke humano`; y cualquier decision que la spec no
cerrara literalmente.
```
