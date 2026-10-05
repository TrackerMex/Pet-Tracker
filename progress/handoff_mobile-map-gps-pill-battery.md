# Handoff a Codex CLI — #116 mobile-map-gps-pill-battery

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `1e47c058`, aprobación vía Notion el 2026-10-04; el mismo Aprobado cubre la
> Enmienda #116 a #94). Feature móvil, solo presentación. La prueba de humo en
> el dev build de Android (R12, seis casillas) es del humano y cierra la
> feature, no la spec.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-map-gps-pill-battery.md. El
hash es H0 (el commit que anade este handoff): todos los
`git diff --name-only` se miden contra el. PARA si la branch no es
feature/116-mobile-map-gps-pill-battery o si `git status --short` no sale
vacio. No toques /home/claude/sites/Pet-Tracker-wt-118 (#118),
Pet-Tracker-wt-backend (#117) ni ningun otro worktree, ni cambies de branch
en ninguno. node_modules ya esta instalado.

Feature: mobile-map-gps-pill-battery (#116)
Branch: feature/116-mobile-map-gps-pill-battery
Spec aprobada: specs/mobile-map-gps-pill-battery/requirements.md
(status: approved, firma 1e47c058)
Lee tambien, enteros: specs/mobile-map-gps-pill-battery/design.md, tasks.md
y traceability.md. tasks.md es tu guion (T0-T6 y «Cierre de Codex»; T7 es
del humano). En requirements.md: «Contexto y decisiones cerradas» (todo
esta decidido: no reabras nada), «Medidas en la base», las convenciones
de todos los R (helper elementChild, fixtures, esperas) y R1-R11 con sus
tablas de tests: los titulos de describe e it son LITERALES, copialos. En
design.md: §1.1 datos y simbolos con nombre fijo, §1.2 lista cerrada de
ficheros, §1.3 arbol, §1.4 clases contra guards, §2 mutaciones y sondas.
Solo lectura, ya escrito por el spec_author y firmado: la §Enmienda #116
de specs/mobile-map-staleness-single-source/requirements.md. No la toques
ni marques su casilla.

== QUE HACES ==

En el mapa (src/screens/map/index.tsx), dentro de `map-stats`:
1. Una pildora nueva `map-pet-pill` como hijo 0, encima de la tarjeta de
   stats: PetAvatar de 24 (`map-pet-pill-avatar`), nombre de la lista
   (`map-pet-pill-name`), punto (`map-pet-pill-dot`) y estado de conexion
   (`map-pet-pill-status`) con el tono de STATUS_TONE_CLASSES, importado de
   src/components/pet-hero-header.tsx (alli solo anades `export`).
2. El cuarto tile de la rejilla deja de ser la conexion (`stat-gps`,
   rotulo «Conexion») y pasa a ser la bateria (`stat-battery`, rotulo
   t('pairing.battery'), valor `${n}%` o `—`, tinta por umbral > 60),
   leida SOLO de `detail.data.pet.device.batteryPct`.
3. `map.live` cambia de literal en src/i18n/catalog.ts: 'GPS active' (en)
   y 'GPS activo' (es). Cero claves nuevas.
Simbolos nuevos con nombre fijo (design.md §1.1): MAP_CONNECTION_TONE a
nivel de modulo; locales `connection`, `gps` (se conserva), `gpsTone`,
`batteryPct`, `battery`, `batteryTone`. Sin animacion (R8): el punto es un
View estatico, nada de react-native-reanimated ni del identificador
Animated. Sin hex, sin clases arbitrarias `[...]`, sin StyleSheet.create,
sin text-success, sin CONTINUOUS_CORNER en la pildora.

== BASE ==

origin/main = b2a9c2aa (merge de #148); la branch lo contiene y
mobile-pet-tracker/ no ha cambiado desde la base de la spec (8f22c8d2). Al
arrancar: `git fetch origin` y
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"` -> exit=0.
Si da 1 (origin/main avanzo: #117 o #118 mergeados antes que tu), PARA y
anotalo en el impl. El merge de main en la branch lo hace el leader, no
tu. Nunca rebasees.

`test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0 (medido por
el leader en H0). Repitelo antes de CADA `bun run typecheck`; si da 1,
PARA y pide al humano que lo borre. Nunca `rm -f` (tu sandbox lo deniega).

Base medida por el leader el 2026-10-05 sobre el arbol de H0 (desde
mobile-pet-tracker/, `bunx jest --runTestsByPath --maxWorkers=2` de las 8
suites de tasks.md T0, exit=0): 8 suites / 461 tests / 0 failed.
  src/screens/map/index.test.tsx                      64
  src/components/__tests__/pet-hero-header.test.tsx   37
  src/screens/home/index.test.tsx                    169
  src/__tests__/consistency-classnames.test.ts        55
  src/__tests__/legibility-classnames.test.ts         26
  src/__tests__/ui-language.test.ts                   29
  src/__tests__/design-drift.test.ts                  59
  src/providers/__tests__/language-provider.test.tsx  22
Tu medida manda: mide al arrancar (con typecheck y lint de base) y anota
antes/despues en el impl. Delta esperado al cierre: map/index.test.tsx
+30 (R1 1, R2 3, R3 3, R4 8 = it.each de 6 + 2, R5 2, R6 6 = it.each, R7 6,
R8 1) -> 94; las otras 7 suites 0 (cambian valores y filas, no numero de
it). Total 491. Cero it borrados: los retitulados y migrados conservan su
numero.

== ANCLAS ==

Ejecutalas TODAS desde mobile-pet-tracker/ antes de tocar nada y copia la
salida al impl. Si alguna no da EXACTAMENTE lo esperado, PARA y avisa.
Son los valores de H0 (requirements.md «Medidas en la base»); los numeros
de linea no son anclas.

 0. grep -cF -- '- [x] Spec aprobada por humano (fecha: 2026-10-04)' ../specs/mobile-map-gps-pill-battery/requirements.md   -> 1
 1. grep -cF 'style={CONTINUOUS_CORNER}' src/screens/map/index.tsx   -> 4
 2. grep -cF 'style={TABULAR_NUMS}' src/screens/map/index.tsx        -> 3
 3. grep -cF 'text-accent-strong' src/screens/map/index.tsx          -> 2
 4. grep -cF 'text-warning-strong' src/screens/map/index.tsx         -> 0
 5. grep -cF 'react-native-reanimated' src/screens/map/index.tsx     -> 0
 6. grep -cF 'Animated' src/screens/map/index.tsx                    -> 0
 7. grep -cF 'stat-gps' src/screens/map/index.tsx                    -> 1
 8. grep -cF 'pairing.connection' src/screens/map/index.tsx          -> 1
 9. grep -cF 'pairing.battery' src/screens/map/index.tsx             -> 0
10. grep -cF 'stat-gps' src/screens/map/index.test.tsx               -> 17
11. grep -cF 'En vivo' src/screens/map/index.test.tsx                -> 7
12. grep -cF "toHaveTextContent('En vivo')" src/screens/map/index.test.tsx   -> 6
13. grep -cF 'useIsFocused: () => true' src/screens/map/index.test.tsx      -> 1
14. grep -cF 'function elementChild' src/screens/map/index.test.tsx  -> 0
15. grep -c "muestra Conexión y retira GPS\|muestra En vivo aunque" src/screens/map/index.test.tsx   -> 2
16. grep -cF 'const STATUS_TONE_CLASSES' src/components/pet-hero-header.tsx          -> 1
17. grep -cF 'export const STATUS_TONE_CLASSES' src/components/pet-hero-header.tsx   -> 0
18. grep -cF "'map.live': 'Live'," src/i18n/catalog.ts               -> 1
19. grep -cF "'map.live': 'En vivo'," src/i18n/catalog.ts            -> 1
20. grep -cF '| 198 | `map.live` | `Live` | `En vivo` |' ../specs/mobile-ui-language/design.md   -> 1
21. grep -cF "[join('screens', 'map', 'index.tsx'), 3]," src/__tests__/consistency-classnames.test.ts   -> 1
22. grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2, // #146 R18, #105 R11' src/__tests__/consistency-classnames.test.ts   -> 1
23. grep -cF "{ file: 'src/screens/map/index.tsx', key: 'pairing.connection' }," src/__tests__/ui-copy-table.ts   -> 1
Anclas negativas (R10: NO se mueven; mismo valor en H0 y al cerrar):
24. grep -cF "[join('screens', 'map', 'index.tsx'), 4]," src/__tests__/consistency-classnames.test.ts   -> 1   (#62 R14 directUses)
25. grep -cF '33 + 1 + 1 - 1 - 1 + 1' src/__tests__/consistency-classnames.test.ts                   -> 1
26. grep -cF "[join('screens', 'map', 'index.tsx'), 2]," src/__tests__/legibility-classnames.test.ts  -> 1   (#61 R4 inkSites)
27. grep -cF 'toBe(13 + 1 + 1)' src/__tests__/legibility-classnames.test.ts                          -> 1
28. grep -cF 'expect(R4_MAP).toHaveLength(17)' src/__tests__/ui-language.test.ts                     -> 1

Valores al cerrar (copialos al impl): 1 -> 4, 2 -> 4, 3 -> 2, 4 -> 0,
5 -> 0, 6 -> 0, 7 -> 0, 8 -> 0, 9 -> 1, 10 -> 2, 11 -> 0, 12 -> 0, 13 -> 0,
14 -> 1, 15 -> 0, 16 -> 1, 17 -> 1, 18 -> 0, 19 -> 0, 20 -> 0, 21 -> 0,
22 -> 0, 23 -> 0, 24-28 sin cambios.
Ancla 10 al cierre: la columna «Tras #116» de requirements.md dice 0, pero
el it de R5 `retira stat-gps del mapa` lleva `stat-gps` en su titulo y en
su `queryByTestId('stat-gps')`: quedan 2 lineas y manda R5. Si te sale
otro numero, cuenta en el impl que lineas son; solo puede quedar
`stat-gps` en ese it. Y en positivo:
  grep -cF "[join('screens', 'map', 'index.tsx'), 3 + 1], // #116 R5" src/__tests__/consistency-classnames.test.ts   -> 1
  grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5' src/__tests__/consistency-classnames.test.ts   -> 1
  grep -cF "{ file: 'src/screens/map/index.tsx', key: 'pairing.battery' }, // #116 R5: sustituye a pairing.connection" src/__tests__/ui-copy-table.ts   -> 1
  grep -cF "'map.live': 'GPS active'," src/i18n/catalog.ts   -> 1
  grep -cF "'map.live': 'GPS activo'," src/i18n/catalog.ts   -> 1
Los `+ 1` de R10 son DELTAS sobre la expresion que encuentres; si la
expresion de H0 hubiera cambiado, aplica el delta sobre la nueva y
anotalo (no recalcules absolutos).

== COMMITS ==

Mensajes LITERALES de tasks.md, en este orden. Rojo SIEMPRE antes que su
verde; un commit con todo incumple C4 (paso en #19):
  test(mobile-map): #116 R1 red, GPS activo replaces En vivo
  feat(mobile-map): #116 R1 map.live reads GPS active
      <- incluye ../specs/mobile-ui-language/design.md (fila 198, texto
         exacto de requirements R1)
  test(mobile-map): #116 R2 R3 red, pet pill above stats
  feat(mobile-map): #116 R2 R3 pet pill with avatar and name
  test(mobile-map): #116 R4 red, pill status with tone
  feat(mobile-map): #116 R4 pill dot and connection status
      <- incluye el `export` de pet-hero-header.tsx y nada mas en ese fichero
  test(mobile-map): #116 R5 R6 R7 red, battery tile replaces connection
      <- incluye los deltas de R10 (consistency-classnames.test.ts y
         ui-copy-table.ts): sus rojos (fila del mapa en `counters` y
         checkUses(R4_MAP)) son parte de este rojo; `#69 R10` nace verde
         (ver CORRECCION 1 al final)
  feat(mobile-map): #116 R5 R6 R7 battery tile from device detail
  test(mobile-map): #116 R8 lock map without reanimated
      <- nace verde; la sonda NO se commitea (ver abajo)
  docs(mobile-map-gps-pill-battery): trace #116 R1-R11
El ultimo lleva SOLO specs/mobile-map-gps-pill-battery/traceability.md y
progress/impl_mobile-map-gps-pill-battery.md. Un refactor, si hiciera
falta, va en su propio commit `refactor(mobile-map): #116 R<n> <que>` tras
su verde; tasks.md no preve ninguno.

Rojos: cada uno debe caer EXACTAMENTE como dice tasks.md («por aserción» o
«por consulta», it por it). Nunca por SyntaxError, ReferenceError,
TypeError, import roto o fallo de typecheck en el test. Si cae otro it, o
uno cae por el motivo contrario al declarado, PARA y reportalo: si un it
declarado «por consulta» cae «por aserción», la espera no es la que fija
requirements (corrige la espera, nunca la asercion). Precisiones:
- T2: el it `rotula el nombre de la lista en una línea` NO va en T2; va en
  T3 (espera a map-pet-pill-status, que nace en T3). Los it de R2 solo
  aseveran posicion, className, style y ausencia: nada de hijos.
- T2: `no pinta la píldora mientras la selección no está en la lista` nace
  verde: sonda M25 tras el commit verde de T2.
- T3: el tile stat-gps SIGUE en la rejilla hasta T4.
- T4: `#94 R6` invertido asevera las ausencias ANTES que
  getByText('Batería'), para que su rojo caiga por asercion.

Sondas (dos, obligatorias, NO se commitean): M25 tras el verde de T2 y M13
en T5 (design.md §2 dice que plantar y que it debe caer). Por cada una:
plantar, correr la suite, anotar en el impl el it que cae con su matcher,
Expected y Received (debe ser «por aserción»), y revertir con
  git checkout HEAD -- src/screens/map/index.tsx
y comprobar, con salida al impl:
  git diff --quiet -- src/screens/map/index.tsx; echo "exit=$?"   -> 0
  git diff --cached --quiet; echo "exit=$?"                        -> 0
Nunca `git checkout -- <ruta>` a secas ni desde otro commit: deja el
indice sucio.

== REGLAS CRITICAS ==

- Convenciones: docs/conventions.md. Titulos de describe e it LITERALES de
  requirements.md (en espanol los nuevos; los de #94, #61, #62 y R8 que
  migras conservan su titulo salvo los dos retitulos de R9).
- Esperas: docs/conventions.md §Esperas, sobre el arbol renderizado. Nunca
  esperar al contador de un mock (`toHaveBeenCalledTimes`) para luego
  aseverar: `waitFor`/`findBy*` hasta que el arbol muestre el dato de la
  fila y despues aseverar. Las esperas de cada it estan escritas en las
  tablas de requirements R2-R7; copialas. R7 › poll: mismo mecanismo de
  timers que `#94 R7` › `actualiza el badge con el mismo intervalo de 15
  segundos` (leelo en la suite y reutilizalo; no inventes otro).
- Mocks: el de expo-router cambia SOLO `useIsFocused: () => true` por
  `useIsFocused: () => mockIsFocused`, con `let mockIsFocused = true`
  junto a los demas `let mock*` y `mockIsFocused = true;` en el beforeEach
  global, junto a `initialSelectedPetId = null;`. Ningun otro it cambia de
  conducta. El helper `elementChild` se copia de
  src/components/__tests__/pet-hero-header.test.tsx (funcion local, no lo
  exportes ni lo muevas a otro fichero). No copies otros mocks de otras
  suites sin verificar contra esta.
- UI movil: docs/ui-guidelines.md rige (gate C8). Skills a cargar, y di en
  el impl cuales cargaste: del plugin expo de Codex, `building-native-ui`;
  del repo (.agents/skills/), `appllama-app-design-skill` (solo para
  releer el patron de pildora; la carta y la spec ganan) y `animate-expo`
  (solo su puerta de frecuencia, que aqui decide NO animar). No pidas
  skills por otros nombres (expo-overview, expo-native-ui,
  expo-design-system o expo-animation no existen en tu catalogo: silencio,
  no error). Appllama MCP no hace falta: el diseno esta cerrado en la spec.
- R11: ni `bun add`, ni cambios en package.json, bun.lock ni app.json.
  Todo con bun/bunx, nunca npm/npx. Al cerrar, con salida al impl:
    git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock   (vacio)
    git diff --stat origin/main -- backend-pet-tracker/                                    (vacio)
    git diff origin/main -- mobile-pet-tracker/src/components/pet-hero-header.tsx          (UNA linea: export)
  y 0 hex, 0 `[...]` y 0 StyleSheet.create en src/screens/map/index.tsx.
- Jest: siempre `--runTestsByPath` desde mobile-pet-tracker/. Ninguna ruta
  de esta feature lleva parentesis; si abres alguna que si, entre comillas
  simples. Tras cada comando, el numero de suites que imprime jest debe
  ser el de ficheros pedidos.
- Mide SIN pipe: `cmd > /tmp/j.txt 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Copia las lineas de resumen al impl.
- Cierre (T6): `bun run typecheck`, `bun run lint` y `bunx jest` ENTERO,
  cada uno con exit 0, sin pipe. Mientras corre la suite entera, no lances
  otra.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones. Esta feature no toca backend.
- No toques ningun fichero fuera de design.md §1.2. En particular, NO:
  src/utils/device-connectivity.ts y su test, src/api/types.ts,
  src/screens/home/, ui-language.test.ts, legibility-classnames.test.ts,
  design-drift.test.ts, language-provider.test.tsx, docs/ui-guidelines.md,
  backend-pet-tracker/.
- Rellena specs/mobile-map-gps-pill-battery/traceability.md con los hashes
  solo en el ultimo commit (R12 queda «gate humano»; R9-R11 citan su
  comando de verificacion). No rebasees despues de escribir hashes.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, las casillas de R12 y de §Aprobacion de
  requirements.md, y la casilla de §Enmienda #116 en
  specs/mobile-map-staleness-single-source/requirements.md. Los escribe el
  leader o el humano. Todo lo que tengas que contar va en
  progress/impl_mobile-map-gps-pill-battery.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`
desde la raiz del repo): los 9 de design.md §1.2, ni uno mas:
  mobile-pet-tracker/src/screens/map/index.tsx
  mobile-pet-tracker/src/components/pet-hero-header.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/screens/map/index.test.tsx
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  specs/mobile-ui-language/design.md
  specs/mobile-map-gps-pill-battery/traceability.md
  progress/impl_mobile-map-gps-pill-battery.md

Criterios de aceptacion: R1-R11 de requirements.md. R12 (smoke en el dev
build de Android) es del humano: no lo marques.

Al terminar, progress/impl_mobile-map-gps-pill-battery.md debe tener: pwd,
branch, H0 y status; skills cargadas; la salida de las 29 anclas en H0 y
la de cierre; la base medida por suite con typecheck y lint de base (exit);
los commits con hash y R-id; por cada rojo, el comando, las cuentas, el
exit y cada it rojo con su matcher, Expected y Received (o la consulta que
falla); por cada verde, sus cuentas y exit; las dos sondas (M25, M13) con
el it que cae, su asercion y los dos `git diff --quiet` en 0; el cierre
(typecheck, lint, jest entero) con exit; las tres salidas de R11;
`git diff --name-only H0 HEAD` (9 ficheros); el delta final por suite; y
cualquier decision que la spec no cerrara literalmente.
```

## CORRECCION 1 (leader, 2026-10-05): `#69 R10` nace verde en T4

Codex paró antes de la producción de T2 (impl, sección «PARADA»): tasks.md T4
pedía rojo por aserción en `#69 R10` aplicando a la vez la fila del mapa
`3 + 1` y el `+ 1` de la suma. Tiene razón: ese `it` suma la tabla `counters`
contra una constante, no mide el fuente, y nace verde (26 = 26). El rojo del
delta de R10 lo da la fila del mapa de `counters` (`toHaveLength`, 4 frente
a 3) y `checkUses(R4_MAP)`. requirements.md no cambia: R10 ya decía «verdes
en la corrida de R11». Corregidos tasks.md T4 y la nota de COMMITS de arriba.

El commit de esta corrección (H1) cambia HEAD pero no H0. Al cerrar,
`git diff --name-only H0 HEAD` da 11 ficheros: los 9 de arriba más
`specs/mobile-map-gps-pill-battery/tasks.md` y
`progress/handoff_mobile-map-gps-pill-battery.md`, que son del leader y NO
tocas.

Paste de reanudación para Codex:

```text
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI.
Reanudas #116 donde paraste. Lee progress/handoff_mobile-map-gps-pill-battery.md
entero, incluida la sección final «CORRECCION 1», y tasks.md T4 corregido.

Antes de tocar nada, con salida al impl (sección nueva «Reanudación 1»):
  pwd; git branch --show-current            -> feature/116-mobile-map-gps-pill-battery
  git log --oneline -1                      -> el commit de la corrección del leader (H1)
  git merge-base --is-ancestor cb8b0e79 HEAD; echo "exit=$?"   -> 0
  git status --short                        -> SOLO tus dos ficheros:
       M mobile-pet-tracker/src/screens/map/index.test.tsx
      ?? progress/impl_mobile-map-gps-pill-battery.md
  grep -cF 'nace verde** y no es un rojo de T4' specs/mobile-map-gps-pill-battery/tasks.md   -> 1
PARA si algo no coincide.

Sigue desde T2 con tus tests sin commitear tal como están:
1. Repite la corrida del rojo de T2 (mismo comando, sin pipe) y anota que
   siguen 4 rojos por consulta de map-pet-pill, 66 verdes, 70 total.
2. Commitea el rojo de T2 con su mensaje literal y continúa T2 verde, M25,
   T3, T4, T5 y T6 según tasks.md y el handoff.
3. En T4, `#69 R10` nace verde: NO es motivo de parada. Sí lo sería que no
   cayera la fila del mapa de `counters` o `checkUses(R4_MAP)`.
4. El cierre espera 11 ficheros en `git diff --name-only H0 HEAD` (H0 =
   a89aeaf0): los 9 tuyos más tasks.md y el handoff del leader.

Commits test-primero, rojo antes que verde, igual que antes. Sin push ni PR.
```
