# Handoff a Codex CLI — #146 mobile-geofence-editor

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> 00961ee6, aprobación vía Notion el 2026-10-02, casillas de A19 y de la spec).
> Feature móvil. La prueba de humo en dev build de Android es del humano.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-146   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse --short HEAD` y pega las tres salidas al principio de
progress/impl_mobile-geofence-editor.md. El hash es H0 (el commit que anade
este handoff) y es el «HEAD del handoff» de tasks.md: todos los `git diff`
de §Cierre y de requirements.md §Verificacion se miden contra el. Para si la
branch no es feature/146-mobile-geofence-editor.
No toques /home/claude/sites/Pet-Tracker (sesion de #103),
Pet-Tracker-wt-backend, Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni
cambies de branch en ningun worktree.

Feature: mobile-geofence-editor (#146)
Branch: feature/146-mobile-geofence-editor
Spec aprobada: specs/mobile-geofence-editor/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-geofence-editor/design.md, tasks.md y
traceability.md. tasks.md es tu guion: §Precondiciones, §Conjuntos comunes,
el ORDEN de las secciones (no es el numerico), los mensajes de commit
literales, los rojos esperados por paso y §Cierre. design.md D5 es el plan
de dobles; §Mutaciones, las M1-M27; §Anclas, lo que verificas al arrancar;
D8, el inventario de aserciones heredadas que cambian; §Delta de tests, el
reparto por fichero.

== QUE HACES ==

El editor de zonas seguras circulares en la ruta delgada
pets/[petId]/geofence-editor del Stack.Protected raiz: toque en el mapa
fija el centro, Slider de heroui-native (20-2000 m, paso 10) fija el radio,
Guardar crea (POST) o edita (PATCH). Entrada desde la lista de #41.
Ademas: circulos de las zonas activas en la pestana Mapa, limite de 5 en el
cliente, interruptor y Eliminar en el editor, centro validado en
isGeofence, solo lectura para quien no es dueno, DEFAULT_CENTER en un solo
sitio y el editor en los contadores de TABULAR_NUMS.

  A19  enmienda de docs, ANTES del primer rojo
  R1   catorce claves geofenceEditor.* + §2.16 en la spec de idioma
  R2   zoomForRadius
  R3   PetMap: circles, zoom, onPress (todo dentro de mapViewProps)
  R17  DEFAULT_CENTER exportado desde pet-map.tsx
  R4   createGeofence / updateGeofence / GeofenceSaveState
  R15  isGeofence valida centerLat / centerLng
  R5   route delgado + undecimo Stack.Screen (stub de la pantalla)
  R6   editor: carga, estados y formulario
  R7   borrador: toques, slider, TalkBack, nombre
  R8   Guardar
  R9   lista: columna-boton al editor y Anadir zona
  R12  lista: limite de 5 con aviso
  R13  editor: interruptor (extrae `run`)
  R14  editor: Eliminar
  R16  editor: solo lectura para quien no es dueno
  R11  pestana Mapa: circulos de las zonas activas
  R10  tabla R15_GEOFENCE_EDITOR (rojo por mutacion M13 versionada, via b)
  R18  fila del editor en #62 R15 (rojo por mutacion M24 versionada, via b)

== BASE ==

HEAD de la branch contiene origin/main (d637757e, sin cambios en
mobile-pet-tracker/ desde 95b2aaa4). La precondicion de tasks.md es
`git merge-base --is-ancestor 95b2aaa4 HEAD; echo "exit=$?"` -> exit=0.

El leader verifico en este arbol, el 2026-10-02 sobre 00961ee6, las 46
anclas de design.md §Anclas (todas dan su recuento) y el fragmento viejo de
A19 (1 en docs/conventions.md y 1 en docs/ui-guidelines.md). A19 sigue
libre en todas las branches remotas. Repitelas igual: si una no da su
numero, PARA y avisa; no re-anclas tu.

Base de referencia medida por el leader (`bunx jest --maxWorkers=2` en
mobile-pet-tracker/ sobre 00961ee6, exit=0): 88 suites / 1710 tests /
0 skipped / 1 snapshot. Es la misma cifra con la que cerro #41
(progress/history.md). La nota de requirements.md §Contexto que dice
"1716 tests / 1 skipped" esta mal copiada (el 1 era el snapshot): no la
uses. Tu medida manda. Delta de cierre: +2 suites, +142 tests, 0 skipped,
1 snapshot (esperado: 90 / 1852), con el reparto por fichero de design.md
§Delta de tests.

Enmienda A19: `<fecha>` = 2026-10-02 (fecha del commit 00961ee6, que firma
la casilla; `git log -1 --format=%cs 00961ee6`).

== COMMITS ==

Mensajes LITERALES de tasks.md, en este orden (38 commits):
  docs(specs): apply amendment A19 of #146
  test(geofences): add geofence editor catalog keys test (R1)
  feat(geofences): add geofence editor catalog keys (R1)
  test(geofences): add zoomForRadius test (R2)
  feat(geofences): frame a circle by its radius (R2)
  test(geofences): add PetMap circles, zoom and press test (R3)
  feat(geofences): let PetMap draw circles and report taps (R3)
  test(geofences): lock the default map center in one place (R17)
  refactor(map): export DEFAULT_CENTER from PetMap (R17)
  test(geofences): add geofence create and update API test (R4)
  feat(geofences): create and update geofences with save states (R4)
  test(geofences): reject geofences without a numeric center (R15)
  feat(geofences): validate the geofence center from the list (R15)
  test(geofences): add geofence editor route test (R5)
  feat(geofences): add the geofence editor route (R5)
  test(geofences): add geofence editor loading and states test (R6)
  feat(geofences): load the geofence editor and its states (R6)
  test(geofences): add geofence editor draft test (R7)
  feat(geofences): move the draft with taps and the slider (R7)
  test(geofences): add geofence editor save test (R8)
  feat(geofences): save the geofence and return to the list (R8)
  test(geofences): add geofence list editor entry test (R9)
  feat(geofences): open the editor from the geofence list (R9)
  test(geofences): lock the client-side geofence limit (R12)
  feat(geofences): disable add zone at the geofence limit (R12)
  test(geofences): add geofence editor active switch test (R13)
  feat(geofences): toggle the zone from the editor (R13)
  test(geofences): add geofence editor delete test (R14)
  feat(geofences): delete the zone from the editor (R14)
  test(geofences): add geofence editor read-only test (R16)
  feat(geofences): show the zone read-only to non-owners (R16)
  test(geofences): add map tab geofence circles test (R11)
  feat(geofences): draw active geofences on the map tab (R11)
  test(geofences): add geofence editor copy-by-key test (R10)
  feat(geofences): resolve geofence editor copy by key (R10)
  test(geofences): count the editor among tabular counters (R18)
  feat(geofences): use tabular digits in the editor radius (R18)
  docs(geofences): fill #146 traceability
El ultimo lleva SOLO specs/mobile-geofence-editor/traceability.md y
progress/impl_mobile-geofence-editor.md. Si un requisito necesita
refactor, va en su propio commit `refactor(geofences): <que> (Rn)` tras su
verde (tasks.md §Conjuntos comunes) y lo cuentas en el reporte.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md
  (prefijo de feature en describe: `#146 R<n>:`, nunca `#146` suelto).
- UI movil: docs/ui-guidelines.md rige (gate C8). Skills de Codex a cargar:
  `building-native-ui` y `native-data-fetching`. NO hay skill de router ni
  de mapas en tu catalogo: lo de expo-router esta en design.md D1 y lo de
  expo-maps en D2 y D3. No pidas skills por otros nombres. Di en el
  reporte cuales cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md): por requisito, un commit ROJO
  (test + cambios de su fila D8 + esqueletos de tipos si tasks.md lo dice)
  y un commit VERDE (produccion). Un commit con todo incumple C4 (paso en
  #19). Cada rojo falla EXACTAMENTE los `it` que requirements.md declara
  para ese requisito (incluidos los heredados), por ASERCION o por la
  CONSULTA que diga su recuento; nunca por SyntaxError, ReferenceError,
  TypeError o import roto. Los `it` marcados Declarado pasan en el rojo y
  los sostiene su mutacion. Si falla otro `it`, PARA y reportalo. No
  ajustes ninguna asercion para que cuadre.
- R10 y R18 van por la via (b) de C4: el commit rojo PLANTA la mutacion
  (M13 y M24) y el verde la revierte A MANO. El resto de mutaciones se
  plantan sobre el verde, se anota que `it` cae y se revierten con
  `git checkout HEAD -- <ruta>`; `git diff --cached --stat` vacio despues.
- Los dobles se escriben por la intencion de design.md D5 y se comprueban
  contra los ficheros que importa la pantalla. No los calques de otra
  suite. El doble de ../../api/geofences de la lista CONSERVA la constante
  real GEOFENCE_MAX_PER_PET con jest.requireActual (R12): si la omite, el
  aviso no sale nunca y el test pasa en silencio.
- Jest: siempre `--runTestsByPath` y cada ruta ENTRE COMILLAS SIMPLES (los
  corchetes de [petId] son regex sin escapar: jest salta el fichero con
  exit 0). Tras cada comando, el numero de suites que imprime jest debe ser
  el de ficheros pedidos.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bunx tsc --noEmit`. Si existe, PARA y pide al humano que lo borre. Nunca
  `rm -f` (tu sandbox lo deniega).
- Sin dependencias nuevas: ni `bun add`, ni cambios en package.json,
  bun.lock ni app.json. Todo con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten otras
  sesiones. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint,
  desde mobile-pet-tracker/.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Copia las lineas de resumen al reporte.
- Si restauras un fichero, usa `git checkout HEAD -- <ruta>`, nunca
  `git checkout <commit> -- <ruta>` (deja el cambio en el indice), ni
  git stash ni rm -f.
- Rellena specs/mobile-geofence-editor/traceability.md con los hashes solo
  en el ultimo commit. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk. No toques backend-pet-tracker/ (R12
  solo copia el valor de su constante).
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Los escribe el leader tras el veredicto
  del reviewer. Todo lo que tengas que contar va en
  progress/impl_mobile-geofence-editor.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
los de design.md §Archivos afectados (produccion, tests, docs y
specs/mobile-ui-language/design.md), mas
specs/mobile-geofence-editor/traceability.md y
progress/impl_mobile-geofence-editor.md. Nada mas.

Criterios de aceptacion: R1-R18 de requirements.md y la enmienda A19.
La prueba de humo es del humano: no la marques.

Al terminar, escribe progress/impl_mobile-geofence-editor.md con: pwd,
branch y H0; skills cargadas; la salida de las 46 anclas y del fragmento
de A19; la base medida (jest, tsc, lint) con exit y bytes; los commits con
hash y R-id; por cada rojo, el comando, las cuentas, el exit y cada `it`
rojo con su matcher, Expected y Received (o la consulta que falla); por
cada verde, sus cuentas y exit; cada mutacion M1-M27 con el `it` que cae
(M13 y M24: el git diff del verde contra su rojo); el cierre (suite
completa, tsc, lint) con exit y bytes; las comprobaciones de
requirements.md §Verificacion (C8, los tres git grep vacios, el git diff
de ficheros intocables) con su salida; el `git diff --name-only H0 HEAD`;
el delta final sobre tu base, por fichero segun design.md §Delta de tests;
y cualquier decision que la spec no cerrara literalmente.
```

---

## Reanudación 1 — parada en el verde de R7 (2026-10-02)

> Codex paró en el verde de R7 con HEAD `77857cec` (rojo de R7) y la
> producción de R7 sin stage en `src/screens/geofence-editor/index.tsx`.
> Paró bien: lo exigía la regla de «si falla otro `it`, PARA».
>
> Diagnóstico del leader: el `it` rojo es
> `#146 R6 › deja el 401 de la lista al manejador global y no pinta estado`
> y es intermitente, no una regresión de R7. Con el mismo árbol, el conjunto
> de cinco ficheros del verde de R7 dio 2 rojos y 1 verde en tres corridas
> (`--maxWorkers=2`), siempre ese `it`. Aislado con `-t` dio 6/6 verdes.
> El test espera al contador de `onUnauthorized` y consulta el árbol justo
> después. El `QueryCache` global llama al manejador antes de que el
> observador repinte, así que a veces el Skeleton de carga sigue montado.
> Eso incumple `docs/conventions.md` §Esperas sobre el árbol renderizado.
> El hermano de #41 (`src/screens/geofences/index.test.tsx`, mismo título)
> ya espera además a que desaparezca `geofences-loading`. El diff de R7
> solo toca `GeofenceEditorForm`, que no se monta en la rama `unauthorized`.
>
> El arreglo es un commit de test extra, fuera de la lista literal de
> tasks.md, autorizado por el leader. No cambia ninguna expectativa: solo
> la espera. Total de commits: 39. El delta de tests no cambia.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-146   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion de #146 tras tu parada en el verde de R7. Ejecuta `pwd`,
`git branch --show-current`, `git rev-parse --short HEAD` y
`git status --short`. Para si la branch no es
feature/146-mobile-geofence-editor, o si `git status --short` muestra
algo distinto de ` M mobile-pet-tracker/src/screens/geofence-editor/index.tsx`
y `?? progress/impl_mobile-geofence-editor.md`. HEAD sera el commit del
leader que anade esta reanudacion a progress/handoff_mobile-geofence-editor.md
(su padre es 77857cec). Lee la seccion «Reanudacion 1» de ese fichero:
lleva el diagnostico. Las reglas del handoff original siguen todas en vigor.
H0 sigue siendo 9dee0e62.

1. Arregla la espera del `it` de R6
   'deja el 401 de la lista al manejador global y no pinta estado', en
   mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx. Localizalo
   por ese titulo, no por numero de linea. Sustituye SOLO la linea
   `expect(screen.queryByTestId('geofence-editor-loading')).toBeNull();`
   que sigue al `waitFor` de `onUnauthorized` por
   `await waitFor(() => expect(screen.queryByTestId('geofence-editor-loading')).toBeNull());`
   Es el patron del hermano de #41 en src/screens/geofences/index.test.tsx.
   No toques ninguna otra linea ni ninguna expectativa. Tampoco toques la
   produccion de R7, que sigue sin stage.
2. Commit con SOLO ese fichero (`git add` de esa ruta y nada mas). Mensaje
   literal:
     test(geofences): wait for the tree in the 401 case (R6)
   Comprueba despues con `git show --stat HEAD` que el commit lleva un solo
   fichero y que index.tsx sigue con ` M` en `git status --short`.
3. Con la produccion de R7 en el arbol, corre CINCO veces seguidas el
   conjunto de cinco ficheros de tu intento de verde de R7, con
   `--maxWorkers=2` y sin pipe. Las cinco deben dar 190/190 verdes y exit=0.
   Si alguna da rojo, PARA y reporta. No vuelvas a tocar el test.
4. Si las cinco son verdes, sigue el guion: verde de R7 con su mensaje
   literal de tasks.md
     feat(geofences): move the draft with taps and the slider (R7)
   y despues R8, R9, R12, R13, R14, R16, R11, R10 y R18, las mutaciones,
   el cierre y la trazabilidad, todo como dice el handoff original.

Regla nueva para el resto de la feature: aplica docs/conventions.md
§Esperas sobre el arbol renderizado. Si un test asevera el arbol, la
espera es sobre el arbol. Nunca esperes a un contador de mock o a la cache
de Query y consultes el arbol despues. Una aserción de ausencia se ancla
antes a la aparicion o al estado final de un nodo del mismo escenario.

Listas del cierre:
- Ficheros que TU cambias desde H0: los del handoff original. El commit
  del leader con esta reanudacion toca solo
  progress/handoff_mobile-geofence-editor.md y no cuenta como tuyo.
- Commits: los 38 literales mas el del paso 2, que va entre el rojo y el
  verde de R7. En total, 39 tuyos.

Informe: sigue en progress/impl_mobile-geofence-editor.md, con una seccion
«Reanudacion 1» que lleve las salidas del paso 0, el `git show --stat` del
paso 2 y las cuentas y el exit de las cinco corridas del paso 3. De aqui
en adelante copia de jest solo las lineas de resumen y los bloques `●` de
cada `it` rojo (matcher, Expected, Received). NO pegues los console.info
de HeroUI ni los console.warn de Uniwind: el informe ya pesa 483 KB.
```
