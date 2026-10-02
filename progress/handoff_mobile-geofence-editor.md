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

---

## Reanudación 2 — parada en el rojo de R9 (2026-10-02)

> Codex paró antes de commitear el rojo de R9, con HEAD `84719d8f` (verde
> de R8). Hubo 11 rojos frente a los 10 que declara tasks.md. Los diez
> esperados estaban; el adicional es el Declarado
> `#146 R9 › no pinta Añadir zona con unauthorized`.
>
> Diagnóstico del leader: el fallo está en el ancla que escribió Codex al
> aplicar la regla de §Esperas de la reanudación 1, y no en la producción.
> La espera
> `waitFor(() => expect(screen.getByTestId('screen-geofences').children).toHaveLength(0))`
> no puede cumplirse nunca. `screen-geofences` es un `ScrollView`, y en el
> árbol de host un `ScrollView` siempre envuelve su contenido en un `View`
> (el del `contentContainerStyle`). Por eso `children` mide 1 aunque la rama
> `unauthorized` pinte `null`. La spec no fija el cuerpo de ese `it`, solo su
> título y que sea Declarado.
>
> El ancla correcta es la del hermano de #41 y la del arreglo de R6: que
> desaparezca `geofences-loading`. En `src/screens/geofences/index.tsx`, el
> Skeleton se pinta mientras `geofences.data` o `pet.data` son `undefined`.
> Que desaparezca equivale a que ya se pintó la rama final, y en
> `unauthorized` no hay ningún nodo positivo al que anclarse. El cambio va
> dentro del rojo de R9, aún sin commit, así que no hay commit extra: siguen
> siendo 39.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-146   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 2 de #146 tras tu parada en el rojo de R9. Ejecuta `pwd`,
`git branch --show-current`, `git rev-parse --short HEAD` y
`git status --short`. Para si la branch no es
feature/146-mobile-geofence-editor, o si `git status --short` muestra
algo distinto de
` M mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts`,
` M mobile-pet-tracker/src/screens/geofences/index.test.tsx` y
`?? progress/impl_mobile-geofence-editor.md`. HEAD sera el commit del
leader que anade esta reanudacion a progress/handoff_mobile-geofence-editor.md
(su padre es 84719d8f). Lee la seccion «Reanudacion 2» de ese fichero:
lleva el diagnostico. Las reglas del handoff original y de la
reanudacion 1 siguen todas en vigor. H0 sigue siendo 9dee0e62.

1. En mobile-pet-tracker/src/screens/geofences/index.test.tsx, dentro del
   it.each 'no pinta Añadir zona con %s' de `#146 R9` (localizalo por el
   titulo, no por numero de linea), sustituye SOLO la rama de
   `unauthorized`:
     else await waitFor(() => expect(screen.getByTestId('screen-geofences').children).toHaveLength(0));
   por:
     else await waitFor(() => expect(screen.queryByTestId('geofences-loading')).toBeNull());
   No toques ninguna otra linea ni ninguna otra expectativa.
   Motivo: un ScrollView siempre tiene un View interno como hijo, asi que
   ese `children` nunca mide 0. La regla de §Esperas sigue en pie: cuando
   la rama final no pinta ningun nodo, el ancla es la desaparicion del
   Skeleton de carga.
2. Repite el rojo de R9 con el mismo comando. Deben salir EXACTAMENTE los
   10 rojos de tasks.md (6 por consulta + 4 heredados por asercion) y los
   6 Declarado en verde. Para comprobar que el Declarado no es
   intermitente, corre el comando tres veces seguidas, sin pipe. Las tres
   deben dar las mismas cuentas. Si no, PARA y reporta.
3. Si cuadra, commitea el rojo de R9 con su mensaje literal de tasks.md
     test(geofences): add geofence list editor entry test (R9)
   y sigue el guion: verde de R9, R12, R13, R14, R16, R11, R10 y R18, las
   mutaciones (M10 y M11 sostienen los Declarado de R9: comprueba que el
   de `unauthorized` cae con su mutacion), el cierre y la trazabilidad,
   todo como dicen el handoff original y la reanudacion 1.

Antes de inventar un ancla de §Esperas, comprueba que puede cumplirse con
la produccion correcta. Mira el nodo en el arbol de host, no en el JSX.

Informe: en progress/impl_mobile-geofence-editor.md, una seccion
«Reanudacion 2» con las salidas del paso 0 y las cuentas y el exit de las
tres corridas del paso 2. Copia de jest solo las lineas de resumen y los
bloques `●` de cada `it` rojo.
```

---

## Reanudación 3 — parada en el verde de R9 (2026-10-02)

> Codex paró en el verde de R9, con HEAD `6be00c8a` (rojo de R9) y la
> producción de R9 sin stage en `src/screens/geofences/index.tsx`. Un `it`
> seguía rojo: `#146 R9 › nombra el botón de editar y Añadir zona en
> inglés`. Esperaba `accessibilityLabel` = `'Edit zone Casa'` y recibió
> `'Edit Casa zone'`. Los otros 221 tests, tsc y lint pasaron.
>
> Diagnóstico del leader: la producción cumple la spec y la expectativa
> no. requirements.md R1 fija `geofenceEditor.editLabel` en inglés como
> `Edit {{name}} zone`, y así está en `catalog.ts` desde el verde de R1 y
> en specs/mobile-ui-language/design.md. La spec solo da el título del
> `it` 12 de R9, no su literal en inglés, y Codex lo tradujo a mano desde
> el español (`Editar zona {{name}}`). En el rojo el `it` caía por
> consulta, así que el literal nunca se llegó a comparar.
>
> Arreglo: un commit de test extra que corrige ese literal para que case
> con R1. La expectativa vuelve a la spec, no a la producción. No se
> reescribe 6be00c8a. Total de commits: 40. El delta de tests no cambia.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-146   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 3 de #146 tras tu parada en el verde de R9. Ejecuta `pwd`,
`git branch --show-current`, `git rev-parse --short HEAD` y
`git status --short`. Para si la branch no es
feature/146-mobile-geofence-editor, o si `git status --short` muestra
algo distinto de ` M mobile-pet-tracker/src/screens/geofences/index.tsx`
y `?? progress/impl_mobile-geofence-editor.md`. HEAD sera el commit del
leader que anade esta reanudacion a progress/handoff_mobile-geofence-editor.md
(su padre es 6be00c8a). Lee la seccion «Reanudacion 3» de ese fichero:
lleva el diagnostico. Siguen en vigor las reglas del handoff original y
de las reanudaciones 1 y 2. H0 sigue siendo 9dee0e62.

1. En mobile-pet-tracker/src/screens/geofences/index.test.tsx, dentro del
   `it` 'nombra el botón de editar y Añadir zona en inglés' de `#146 R9`
   (localizalo por el titulo, no por numero de linea), sustituye SOLO
     expect(column.props.accessibilityLabel).toBe('Edit zone Casa');
   por
     expect(column.props.accessibilityLabel).toBe('Edit Casa zone');
   Es el valor de requirements.md R1 (`Edit {{name}} zone`) con
   name = Casa. No toques ninguna otra linea ni la produccion de R9, que
   sigue sin stage.
2. Commit con SOLO ese fichero (`git add` de esa ruta y nada mas). Mensaje
   literal:
     test(geofences): use the R1 English edit label (R9)
   Comprueba con `git show --stat HEAD` que el commit lleva un solo
   fichero y que index.tsx sigue con ` M`.
3. Repite tu intento de verde de R9 con el mismo comando, sin pipe. Debe
   salir todo verde, con exit=0, y tsc y lint con exit=0. Si falla algo,
   PARA y reporta.
4. Si cuadra, commitea el verde de R9 con su mensaje literal de tasks.md
     feat(geofences): open the editor from the geofence list (R9)
   y sigue el guion: R12, R13, R14, R16, R11, R10 y R18, las mutaciones,
   el cierre y la trazabilidad.

Regla nueva para el resto de la feature: todo literal de copy que
asevere un test (en espanol o en ingles) se copia de la tabla de
requirements.md R1. NUNCA lo traduzcas tu desde el otro idioma: el orden
de palabras cambia. Antes de commitear cada rojo, revisa con grep que los
literales nuevos de copy de ese rojo aparecen tal cual en la tabla de R1,
y pega la comprobacion en el informe.

Listas del cierre: commits, los 38 literales mas los dos extra autorizados
(el de R6 de la reanudacion 1 y el del paso 2), 40 en total. Ficheros: los
del handoff original. Los commits del leader solo tocan
progress/handoff_mobile-geofence-editor.md.

Informe: en progress/impl_mobile-geofence-editor.md, una seccion
«Reanudacion 3» con las salidas del paso 0, el `git show --stat` del
paso 2 y las cuentas y el exit del paso 3. Copia de jest solo las lineas
de resumen y los bloques `●` de cada `it` rojo.
```

## Reanudación 4 — rechazo del reviewer por R7 (2026-10-02)

> Codex cerró la feature en `f6d45af5`. El leader mergeó origin/main
> (`cb14497c`, #103) en `c0940cd0` y corrió `./init.sh` en verde. El
> reviewer rechazó en `826ae816` (`progress/review_mobile-geofence-editor.md`,
> Observación 1): dos cláusulas de R7 no tienen candado. Dos mutaciones
> plantadas en `src/screens/geofence-editor/index.tsx` dejan el fichero del
> editor en 68/68:
>
> - **Z1.** `onChangeEnd` del slider y la acción de TalkBack hacen
>   `setCamera({ center: camera.center, … })` en vez de `{ center, … }`.
>   Los `it` 5 y 6 de R7 nunca mueven el centro antes de soltar, y el centro
>   del borrador coincide con el de la cámara inicial.
> - **Z2.** Al crear, el círculo `'draft'` se pinta con
>   `initialCenter`/`initialRadius` en vez de `center`/`radius`. Los 8 `it`
>   de R7 entran por `edit()`.
>
> Diagnóstico del leader: la producción es correcta y no cambia. Solo se
> refuerzan cuatro `it` existentes de `#146 R7`, sin cambiar sus títulos ni
> el recuento. El delta sigue en +142 / editor 68, y la spec no se enmienda.
> Los `it` 1 y 3 siguen cubriendo el toque en modo editar; el 4, el radio en
> modo editar.
>
> - it 5 y it 6: un toque en el mapa antes de soltar o de TalkBack, y la
>   cámara debe encuadrar el punto tocado. Esto mata Z1 por sus dos vías.
> - it 2 y it 7: pasan a modo crear y aseveran el círculo `'draft'`. El 2
>   cubre el centro y el 7 el radio. Esto mata Z2.
>
> Como el verde ya existe, el rojo se demuestra plantando Z1 y Z2 (vía
> Declarado) y revirtiéndolas. Commits extra: uno de test y uno de
> trazabilidad. Los dos refactors no autorizados (`394efbd6`, `b46b233c`)
> se quedan: el reviewer los juzgó no bloqueantes (Observaciones 2 y 3).

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-146   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 4 de #146 tras el rechazo del reviewer. Ejecuta `pwd`,
`git branch --show-current`, `git rev-parse --short HEAD` y
`git status --short`. Para si la branch no es
feature/146-mobile-geofence-editor o si `git status --short` no sale
vacio. HEAD sera el commit del leader que anade esta reanudacion a
progress/handoff_mobile-geofence-editor.md (su padre es 826ae816). Lee
la seccion «Reanudacion 4» de ese fichero y la Observacion 1 de
progress/review_mobile-geofence-editor.md. Siguen en vigor las reglas del
handoff original y de las reanudaciones 1 a 3. H0 sigue siendo 9dee0e62.
NO rebasees: la branch lleva el merge c0940cd0 de origin/main.

La produccion es correcta: NO la cambies. Solo cambia el fichero
mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx, y dentro
de el solo cuatro `it` del describe
'#146 R7: el toque y el slider mueven el borrador sin perseguir la cámara'.
Localizalos por titulo, no por numero de linea. No cambies ningun titulo
ni anadas o quites `it`. `tap` es la constante del describe
({ latitude: 19.41, longitude: -99.11 }).

1. it 'un toque en un POI mueve el centro del borrador': pasa a modo
   crear. Sustituye `await edit();` por
     await mount(); await screen.findByTestId('geofence-editor-name');
   (lo mismo que hace el it de R6 'al crear dibuja el borrador despues de
   las zonas existentes') y sustituye
     expect(circles()[0].center).toEqual(tap);
   por
     expect(circles()[2]).toEqual({ id: 'draft', center: tap, radius: 150 });
2. it 'al soltar el slider la cámara encuadra el borrador': justo despues
   de `await edit();` anade
     await fireEvent(screen.getByTestId('map-view'), 'mapClick', { coordinates: tap });
   y en la ultima asercion cambia
     { coordinates: { latitude: 19.4, longitude: -99.1 }, zoom: 15 }
   por
     { coordinates: tap, zoom: 15 }
3. it 'TalkBack sube y baja el radio de diez en diez y encuadra': justo
   despues de `await edit();` anade la misma linea `mapClick` del paso 2.
   Despues de la asercion del zoom ~16.907 anade
     expect(screen.getByTestId('map-view').props.cameraPosition.coordinates).toEqual(tap);
   y despues de la asercion del zoom 17 anade esa misma linea otra vez.
   El resto del it no cambia.
4. it 'TalkBack no sale de 20 ni de 2000': pasa a modo crear con la misma
   sustitucion de `await edit();` del paso 1. Despues de
     expect(screen.getByTestId('geofence-editor-radius').props.value).toBe(20);
   anade
     expect(circles()[2]).toEqual({ id: 'draft', center: { latitude: 19.5, longitude: -99.2 }, radius: 20 });
   y despues de la asercion del valor 2000 anade
     expect(circles()[2].radius).toBe(2000);
   ({ latitude: 19.5, longitude: -99.2 } es `lastPosition`, el centro
   inicial al crear, como en el it de R6 citado en el paso 1.)

5. Verde con la produccion actual, desde mobile-pet-tracker/, sin pipe:
     bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' > /tmp/r7-green.txt 2>&1; echo "exit=$?"
   Esperado: 1 suite, 68 passed / 68, exit=0. Si algo falla, PARA y
   reporta: no ajustes la asercion.

6. Rojo de Z1. En mobile-pet-tracker/src/screens/geofence-editor/index.tsx
   cambia, en el `onChangeEnd` del slider y en el manejador de la accion
   de TalkBack, `setCamera({ center, ` por
   `setCamera({ center: camera.center, ` (dos sitios, nada mas). Corre el
   mismo comando del paso 5 hacia /tmp/r7-z1.txt. Esperado: EXACTAMENTE 2
   fallan / 66 pasan, por ASERCION: 'al soltar el slider la cámara
   encuadra el borrador' y 'TalkBack sube y baja el radio de diez en diez
   y encuadra'. Revierte con
     git checkout HEAD -- mobile-pet-tracker/src/screens/geofence-editor/index.tsx
   y comprueba que `git diff --stat -- mobile-pet-tracker/src/screens/geofence-editor/index.tsx`
   y `git diff --cached --stat` salen vacios.

7. Rojo de Z2. En el mismo fichero cambia
     if (!zone) circles.push({ id: 'draft', center, radius });
   por
     if (!zone) circles.push({ id: 'draft', center: initialCenter, radius: initialRadius });
   Corre el comando del paso 5 hacia /tmp/r7-z2.txt. Esperado: EXACTAMENTE
   2 fallan / 66 pasan, por ASERCION: 'un toque en un POI mueve el centro
   del borrador' y 'TalkBack no sale de 20 ni de 2000'. Revierte igual que
   en el paso 6 y comprueba lo mismo.

   Si en el paso 6 o en el 7 falla otro `it`, o menos de los dos
   declarados, PARA y reporta. No toques la asercion para que cuadre.

8. Commit con SOLO el fichero de test (`git add` de esa ruta y nada mas).
   Mensaje literal:
     test(geofences): lock the draft camera and the create draft (R7)
   Comprueba con `git show --stat HEAD` que lleva un solo fichero y que
   `git status --short` queda vacio.

9. Cierre, desde mobile-pet-tracker/, sin pipe:
   `test ! -e .expo/types/router.d.ts` (si existe, PARA y pide al humano
   que lo borre), luego `bunx tsc --noEmit`, `bunx expo lint` y la suite
   entera `bunx jest`, cada uno a fichero con su exit. Esperado: 90 suites
   / 1852 tests / 1 snapshot, y exit=0 en los tres.

10. En specs/mobile-geofence-editor/traceability.md, anade el hash del
    commit del paso 8 a la fila de R7, junto a los que ya cita. No cambies
    otras filas. Commit con SOLO traceability.md y
    progress/impl_mobile-geofence-editor.md. Mensaje literal:
      docs(geofences): cite the R7 lock in #146 traceability

No lances ./init.sh ni toques Postgres ni LocalStack. No hagas push.

Listas del cierre: los 42 commits tuyos de antes mas los dos de esta
reanudacion, 44 en total. Ficheros: los del handoff original. Los commits
del leader tocan solo progress/handoff_mobile-geofence-editor.md y
progress/review_mobile-geofence-editor.md, mas el merge c0940cd0.

Informe: en progress/impl_mobile-geofence-editor.md, una seccion
«Reanudacion 4» con las salidas del paso 0, el diff del paso 8
(`git show HEAD -- <fichero de test>`), las cuentas y el exit de los pasos
5, 6, 7 y 9, el diff de cada mutacion plantada antes de revertirla, y la
comprobacion vacia de cada reversion. Copia de jest solo las lineas de
resumen y los bloques `●` de cada `it` rojo, con su matcher, Expected y
Received.
```

## Reanudación 5 — enmienda E1, teclado sobre el formulario (2026-10-02)

> El reviewer aprobó la ronda 2 (`8944dfe9`). La prueba de humo pasó salvo
> el paso 9: con el teclado abierto, Guardar queda inalcanzable. La causa es
> edge-to-edge (`progress/explore_mobile-geofence-editor-keyboard.md` §1 y
> la sección «Verificación del leader»). El humano aprobó la enmienda E1
> vía Notion, con firma en `bc917ff7`. E1 está en
> `specs/mobile-geofence-editor/requirements.md` §Enmienda E1. R6 §Formulario
> cambia su raíz a `KeyboardAvoidingView`.
>
> Se refuerza R6 it 18 sin `it` nuevos. El recuento sigue en editor 68 y
> total 90 / 1852. `origin/main` no se ha movido desde el merge `c0940cd0`,
> así que no hay merge previo. El leader comprobó contra `node_modules` del
> worktree tres cosas:
>
> - `expo-router/react-navigation` exporta `HeaderHeightContext`.
> - El `KeyboardAvoidingView` de RN 0.86 pasa `className` y `testID` al
>   `View` host, así que las aserciones actuales de it 18 siguen valiendo.
> - uniwind envuelve `KeyboardAvoidingView`, así que `className` se aplica
>   en la app.
>
> Ningún inventario global (`consistency-classnames`, `design-drift`,
> `ui-language`) cuenta algo que este cambio mueva.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-146   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 5 de #146: enmienda E1 (teclado). Ejecuta `pwd`,
`git branch --show-current`, `git rev-parse --short HEAD` y
`git status --short`. Para si la branch no es
feature/146-mobile-geofence-editor o si `git status --short` no sale
vacio. HEAD sera el commit del leader que anade esta reanudacion a
progress/handoff_mobile-geofence-editor.md (su padre es bc917ff7). Lee
la seccion «Reanudacion 5» de ese fichero y, en
specs/mobile-geofence-editor/requirements.md, la seccion
«## Enmienda E1 — el formulario se aparta del teclado (paso 9)» entera
(E1.1 a E1.3). Siguen en vigor las reglas del handoff original y de las
reanudaciones 1 a 4. H0 sigue siendo 9dee0e62. NO rebasees: la branch
lleva merges (c0940cd0, 9dbe3de5). Skill de tu plugin expo para esta
tarea: `building-native-ui`. No pidas otras por nombre.

Esperas: cumple docs/conventions.md §«Esperas sobre el arbol renderizado».
El bloque de E1.2 ya la cumple: copialo literal, sin cambiar la espera
por un contador de mock ni por un timer.

Ficheros que puedes tocar, y ninguno mas:
  mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
  mobile-pet-tracker/src/screens/geofence-editor/index.tsx
  specs/mobile-geofence-editor/traceability.md
  progress/impl_mobile-geofence-editor.md

0. Desde mobile-pet-tracker/: `test ! -e .expo/types/router.d.ts`. Si
   existe, PARA y pide al humano que lo borre (no lo borres tu).

1. ROJO. Solo index.test.tsx:
   a. Imports: anade
        import { HeaderHeightContext } from 'expo-router/react-navigation';
      y cambia `import { Alert } from 'react-native';` por
        import { Alert, DeviceEventEmitter } from 'react-native';
      (`act`, `fireEvent` y `waitFor` ya se importan de
      @testing-library/react-native.)
   b. En la funcion `mount()`, el `Wrapper` devuelve hoy
        <HeroUINativeProvider><LanguageProvider initial={language}>{children}</LanguageProvider></HeroUINativeProvider>
      Cambia `{children}` por
        <HeaderHeightContext.Provider value={91}>{children}</HeaderHeightContext.Provider>
      Nada mas cambia en mount().
   c. Localiza por TITULO, no por linea, el it
      'compone mapa y formulario sin fondo sobre el mapa y con las métricas A11 en el formulario'
      (describe '#146 R6: …'). Al final, tras su ultima asercion actual,
      anade LITERAL el bloque de E1.2 punto 2:
        expect(root).toHaveStyle({ paddingBottom: 0 });
        await fireEvent(root, 'layout', { persist() {}, nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 700 } } });
        await act(async () => {
          DeviceEventEmitter.emit('keyboardWillShow', {
            startCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
            endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
            duration: 0, easing: 'keyboard', isEventFromThisApp: true,
          });
        });
        await waitFor(() => expect(screen.getByTestId('screen-geofence-editor')).toHaveStyle({ paddingBottom: 291 }));
      `root` es la constante que el it ya declara. No cambies el titulo
      ni anadas o quites `it`.
   d. Desde mobile-pet-tracker/, sin pipe:
        bunx jest --runTestsByPath 'src/screens/geofence-editor/index.test.tsx' > /tmp/e1-red.txt 2>&1; echo "exit=$?"
      Esperado: EXACTAMENTE 1 falla / 67 pasan, y es ese it, por
      ASERCION en `toHaveStyle({ paddingBottom: 0 })` (la raiz `View` de
      hoy no tiene paddingBottom). Si falla otro it, o falla por consulta
      o por import, PARA y reporta.
   e. Commit con SOLO index.test.tsx. Mensaje literal:
        test(geofences): lock the keyboard padding of the editor root (R6, E1)

2. VERDE. Solo index.tsx:
   a. `import { useState } from 'react';` pasa a
        import { useContext, useState } from 'react';
      `import { Alert, ScrollView, Text, View } from 'react-native';` pasa a
        import { Alert, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
      y justo despues de `import { router } from 'expo-router';` anade
        import { HeaderHeightContext } from 'expo-router/react-navigation';
   b. En `function GeofenceEditorForm`, justo despues de
      `const insets = useSafeAreaInsets();` anade
        const headerHeight = useContext(HeaderHeightContext);
      Sin `?? 0` y sin useHeaderHeight (lanza fuera de un navegador; E1.1).
   c. Su return abre hoy con
        return <View testID="screen-geofence-editor" className="flex-1">
      Cambialo por
        return <KeyboardAvoidingView testID="screen-geofence-editor" className="flex-1" behavior="padding" keyboardVerticalOffset={headerHeight}>
      y su cierre, la linea `  </View>;` justo antes de la `}` que cierra
      GeofenceEditorForm, por `  </KeyboardAvoidingView>;`. Sin
      Platform.OS. NO toques la otra raiz con el mismo testID (el
      `<ScrollView testID="screen-geofence-editor" …>` de carga y errores).
   d. El comando de 1.d hacia /tmp/e1-green.txt. Esperado: 68 passed / 68,
      exit=0. Si algo falla, PARA y reporta: no ajustes la asercion.
   e. Commit con SOLO index.tsx. Mensaje literal:
        feat(geofences): keep the editor form above the keyboard (R6, E1)

3. MUTACIONES de la tabla de E1.3, una a una sobre index.tsx. Para cada
   una: planta, corre el comando de 1.d hacia /tmp/e1-<id>.txt, y
   revierte con
     git checkout HEAD -- mobile-pet-tracker/src/screens/geofence-editor/index.tsx
   (HEAD, no un hash). Comprueba que
   `git diff --stat -- mobile-pet-tracker/src/screens/geofence-editor/index.tsx`
   y `git diff --cached --stat` salen vacios antes de la siguiente.
     E1-a  quitar `behavior="padding"`
           cae it 18 en toHaveStyle({ paddingBottom: 0 })
     E1-b  `keyboardVerticalOffset={0}`
           cae it 18 en toHaveStyle({ paddingBottom: 291 }), llega 200
     E1-c  quitar el prop `keyboardVerticalOffset={headerHeight}`
           cae it 18 en toHaveStyle({ paddingBottom: 291 }), llega 200
     E1-d  `behavior="height"` en vez de "padding"
           cae it 18 en toHaveStyle({ paddingBottom: 0 })
   Esperado en cada una: EXACTAMENTE 1 falla / 67 pasan, solo it 18, por
   ASERCION en el punto indicado. En E1-c, si tsc o lint protestan por
   `headerHeight` sin usar, da igual: solo corre jest. Si otra cosa falla,
   o falla en otro punto, PARA y reporta. No toques la asercion para que
   cuadre. Las mutaciones nunca se commitean.

4. CIERRE, desde mobile-pet-tracker/, sin pipe, cada uno a fichero con su
   exit: `test ! -e .expo/types/router.d.ts`, `bunx tsc --noEmit`,
   `bunx expo lint` y la suite entera `bunx jest`. Esperado: 90 suites /
   1852 tests / 1 snapshot, y exit=0 en los tres.

5. En specs/mobile-geofence-editor/traceability.md, anade los hashes de los
   commits de 1.e y 2.e a la fila de R6, junto a los que ya cita, con su
   asunto como en las demas entradas. No cambies otras filas. Commit con
   SOLO traceability.md y progress/impl_mobile-geofence-editor.md. Mensaje
   literal:
     docs(geofences): cite the keyboard lock in #146 traceability (R6, E1)

No lances ./init.sh ni toques Postgres ni LocalStack. No hagas push.

Listas del cierre: los 44 commits tuyos de antes mas los tres de esta
reanudacion, 47 en total. Ficheros: los del handoff original. Los commits
del leader y del humano tocan solo progress/ y specs/, mas los merges
c0940cd0 y 9dbe3de5.

Informe: en progress/impl_mobile-geofence-editor.md, una seccion
«Reanudacion 5» con las salidas del paso 0, el diff de cada commit
(`git show <hash> -- <fichero>`), las cuentas y el exit de 1.d, 2.d, cada
mutacion y el paso 4, el diff de cada mutacion plantada antes de
revertirla, y la comprobacion vacia de cada reversion. Copia de jest solo
las lineas de resumen y los bloques `●` de cada it rojo, con su matcher,
Expected y Received.
```
