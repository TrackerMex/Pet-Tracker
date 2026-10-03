# Handoff a Codex CLI — #131 + #135 mobile-weekly-day-row-layout-lock

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> d3992c47 de esta branch, aprobacion via Notion el 2026-09-29). Tiene una
> sola casilla, la de §Aprobacion, ya marcada, que firma las dos entradas. No
> hay gate de dispositivo.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-weekly-day-row-layout-lock.md.
Para si la branch no es feature/131-mobile-weekly-day-row-layout-lock.
No toques /home/claude/sites/Pet-Tracker (es de otra sesion, con #60),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en
ningun worktree.

Feature: mobile-weekly-day-row-layout-lock (#131), con #135
mobile-weekly-chart-metric-selector-parent-lock en el mismo ciclo.
Branch: feature/131-mobile-weekly-day-row-layout-lock
Spec aprobada: specs/mobile-weekly-day-row-layout-lock/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-weekly-day-row-layout-lock/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los
cuatro bloques de test literales, las cuatro mutaciones con su linea
exacta, los blobs de control de cada paso, la tabla de §Sondas con su
«Exigido», los greps de R5 y los comandos. #135 no tiene branch, reporte ni
trazabilidad propios: su puntero
(specs/mobile-weekly-chart-metric-selector-parent-lock/requirements.md) no
se toca.

== QUE HACES ==

Solo test. Un fichero de codigo cambia en el diff acumulado:
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
La grafica (src/screens/home/weekly-activity-chart.tsx) entra en los cuatro
commits ROJOS con una mutacion y sale en el VERDE siguiente con
`git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
Su diff acumulado contra origin/main es VACIO.

  R1 (#131)  describe `#131 R1: ...`: la clase de la fila es exactamente
             'flex-row' en cuatro estados (sin medir, medida, segunda
             metrica, dia seleccionado). Mutacion: flex-col en la fila
  R2 (#131)  describe `#131 R2: ...`: el style fusionado de la fila es
             { paddingLeft: x1 de la linea de media, paddingRight: width del
             BarChart menos x2 }, leidos del arbol pintado. Mutacion:
             paddingLeft: 0
  R3 (#131)  describe `#131 R3: ...`: las siete clases de las columnas, por
             posicion, en los cuatro estados. Mutacion: la rama de reposo
             sin flex-1
  R4 (#135)  describe `#135 R4: ...` con tres it: la lista cerrada de testID
             de los hijos host de weekly-activity-card. Mutacion: la sonda
             wrapmetric de #132 (un <View accessible> alrededor de
             <MetricSelector, blob d053148a)
  R5         cierre: suite, tsc, eslint, greps de candado, blobs finales,
             sondas, reporte y traceability.md
No uses numeros de linea: localiza todo con los grep y las lineas literales
de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama; casilla de §Aprobacion marcada; router.d.ts; los dos blobs
          de base (grafica c258abed, test d7f938da); las dos medidas. Si un
          blob no coincide, PARA
  R1..R4  por requisito, DOS commits: el ROJO (el bloque de test + la
          mutacion de la grafica, los dos ficheros) y el VERDE (solo la
          grafica, revertida con git checkout HEAD~1 --). Cada paso con su
          blob de control y su rojo medido en la grafica Y en la suite
  Sondas  todas las de tasks.md §Sondas, UNA cada vez, sobre el arbol final,
          con el procedimiento de §Sondas (aplicar, git hash-object, medir,
          anotar la PRIMERA LINEA de cada error, restaurar con
          `git checkout HEAD -- <las dos rutas>`, y los dos git diff
          --exit-code en 0). No se commitean
  R5      comprobaciones de cierre; reporte y traceability.md en el ultimo
          commit

Mensajes de commit, LITERALES y en este orden (nueve commits):
  test(mobile): expose the weekly day row direction with a versioned mutation (R1)
  test(mobile): lock the weekly day row as a single flex-row (R1)
  test(mobile): expose the weekly day row padding with a versioned mutation (R2)
  test(mobile): lock the weekly day row padding to the average line ends (R2)
  test(mobile): expose the weekly day column share with a versioned mutation (R3)
  test(mobile): lock each weekly day column to an equal share of the row (R3)
  test(mobile): expose a wrapper around the metric selector with a versioned mutation (R4)
  test(mobile): lock the weekly card children as a closed list (R4)
  docs(mobile): record the weekly day row layout and card children evidence (R1,R2,R3,R4,R5)

Ficheros que TU cambias, medidos desde el commit que anade este handoff
(`H=$(git log -1 --format=%H -- progress/handoff_mobile-weekly-day-row-layout-lock.md)`,
luego `git diff --name-only $H..HEAD`):
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
  specs/mobile-weekly-day-row-layout-lock/traceability.md
  progress/impl_mobile-weekly-day-row-layout-lock.md
Nada mas. La grafica aparece en tus commits pero no en ese diff (acaba en su
blob de base). Lo demas que sale en el diff de la branch contra origin/main
son commits del leader, anteriores a ti.

== CIFRAS ==

La spec se escribio sobre 343e3fbe con una suite RELATADA de 86 / 1611. Desde
entonces el leader mergeo origin/main 3820b89a (#138, +2 tests) en esta
branch (70f5125e). Los dos blobs de base NO cambiaron y el arbol de
mobile-pet-tracker/ es identico al de origin/main. Sobre ese mismo arbol, la
sesion Frontend midio la suite movil: 86 suites / 1613 tests, exit=0. Asi
que tu base esperada es 1613, no 1611, y las cuentas de la suite de tasks.md
se desplazan +2:
  base    grafica 47/47; suite 86 suites / 1613 tests, exit=0
  rojo R1 grafica 1 failed, 47 passed, 48 total; suite 1 failed de 1614
  verde   grafica 48/48
  rojo R2 grafica 1 failed, 48 passed, 49 total; suite 1 failed de 1615
  verde   grafica 49/49
  rojo R3 grafica 1 failed, 49 passed, 50 total; suite 1 failed de 1616
  verde   grafica 50/50
  rojo R4 grafica 2 failed, 51 passed, 53 total; suite 2 failed de 1619
  verde   grafica 53/53
  final   suite 86 suites / 1619 tests, exit=0 (delta +0 suites, +6 tests)
Tu medida manda: si la base no es 1613 con exit=0, anota la tuya y aplica
el mismo delta. Los rojos son SOLO los it que nombra tasks.md, por el
matcher que nombra y POR ASERCION (`expect(received).<matcher>`), nunca por
consulta, ReferenceError ni TypeError; si falla cualquier otro test de la
suite, PARA.

Sondas: si alguna no da exactamente su «Exigido», PARA y reportalo con el
log. No ajustes la asercion para que cuadre. `wrapmetricid` es roja POR
CONSULTA a proposito, y las marcadas (D), (F) o (N) dan verde a proposito:
no son fallos tuyos.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer).
- Skills: NO cargues ninguna skill de expo, ni del plugin ni de
  .agents/skills/. Ninguna de tu catalogo v1.0.2 aplica: la feature no
  cambia UI, son tests de jest sobre un arbol que ya existe, y todo lo que
  necesitas esta escrito en tasks.md. Di en el reporte que no cargaste
  ninguna.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via b: por requisito, un commit ROJO
  con el bloque de test y la mutacion versionada de la grafica, y un commit
  VERDE que solo revierte la grafica. Nueve commits, no uno: tests +
  implementacion + docs en un solo commit incumple C4 (paso en #19).
- Los bloques de tasks.md van TAL CUAL, sin prettier: titulos, comentarios,
  sangria y literales. Los blobs de control lo comprueban: si no coinciden,
  compara con el literal antes de seguir. Ningun import nuevo.
- Reglas de literales de tasks.md §Antes punto 7 (design-drift escanea el
  test): la cita va siempre como `#131 R<n>` o `#135 R4`, NUNCA `#131` ni
  `#135` sueltos, tampoco en comentarios, porque la guarda lo lee como un
  color hexadecimal. Ni StyleSheet, ni text-[10px], ni use-api/useApi. Y R2
  sin `40.4`, `14`, CHART_PAD_LEFT ni CHART_PAD_RIGHT: el esperado se lee del
  arbol pintado.
- Refactor: ninguno. No extraigas helpers ni listas compartidas entre los
  bloques nuevos.
- NO toques: los describe de #68, #74, #130 y #132 del test, sus helpers,
  mocks e imports; la grafica fuera de los cuatro rojos; src/components/card.tsx;
  src/screens/home/index.tsx, su test y src/__tests__/ (entero);
  src/i18n/catalog.ts; src/providers/__tests__/language-provider.test.tsx;
  package.json; bun.lock; docs/; el puntero de #135. Cero dependencias
  nuevas y cero copy nueva.
- Rellena specs/mobile-weekly-day-row-layout-lock/traceability.md con los
  hashes, sin ninguna fila «pendiente». Cada R cita su rojo y su verde; la
  fila de R5 cita el hash del VERDE de R4 (el ultimo commit de codigo), no el
  de docs. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que
  tengas que contar va en progress/impl_mobile-weekly-day-row-layout-lock.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y eslint desde mobile-pet-tracker/. Los git add, git checkout y
  git diff desde la raiz del repo, con rutas mobile-pet-tracker/..., como
  indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-09-30).
- Jest de un fichero siempre con --runTestsByPath (ninguna ruta de esta
  feature lleva parentesis). Comprueba que imprime 1 suite.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve
  el codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte. Los bloques `● Console` del log de la suite son ruido.
- En las SONDAS restaura SIEMPRE con `git checkout HEAD -- <ruta>`, nunca con
  `git checkout <commit> -- <ruta>` seguido de otro checkout: deja la
  mutacion en el indice. Ni git stash ni rm -f. (El `git checkout HEAD~1 --`
  de cada VERDE es otra cosa: ahi SI quieres la grafica de base en el indice
  para commitearla.)
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son
  compartidos con la sesion de #60. Se mide con bunx jest, bunx tsc --noEmit
  y bunx eslint.

Criterios de aceptacion: R1-R5 de requirements.md (R1-R3 de #131, R4 de
#135, R5 de las dos).

Al terminar, escribe progress/impl_mobile-weekly-day-row-layout-lock.md con:
pwd y branch; skills cargadas (ninguna); la base medida y sus blobs; los
nueve commits con hash y R-id; cada rojo con sus cuentas en la grafica y en
la suite, exit, su it, su matcher, `Expected` y `Received`, y cada verde con
sus cuentas y exit; la tabla de todas las sondas con blob, exit, cuentas,
cada it rojo, su matcher y si es rojo por asercion o por consulta, en la
columna «medido»; los greps de R5.4 y R5.5 con su salida; tsc y eslint con
su exit; los blobs finales; el delta sobre tu base; y cualquier decision que
la spec no cerrara literalmente.
```
