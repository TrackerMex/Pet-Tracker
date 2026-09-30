# Handoff a Codex CLI — #141 + #142 + #143 mobile-weekly-day-column-value-cross-lock

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> c164d592 de esta branch, aprobacion via Notion el 2026-09-30). Tiene una
> sola casilla, la de §Aprobacion, ya marcada, que firma las tres entradas.
> No hay gate de dispositivo.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-weekly-day-column-value-cross-lock.md.
Para si la branch no es feature/141-mobile-weekly-day-column-value-cross-lock.
No toques /home/claude/sites/Pet-Tracker (es de otra sesion, con #60),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en
ningun worktree.

Feature: mobile-weekly-day-column-value-cross-lock (#141, con #142 y #143 en el mismo ciclo)
Branch: feature/141-mobile-weekly-day-column-value-cross-lock
Spec aprobada: specs/mobile-weekly-day-column-value-cross-lock/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-weekly-day-column-value-cross-lock/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los tres
bloques de test literales, las tres mutaciones con su linea exacta, los blobs
de control de cada paso, la tabla de §Sondas con su «Exigido», los greps de
R4 y los comandos. Los punteros de #142 y #143
(specs/mobile-weekly-card-children-strict-lock/ y
specs/mobile-weekly-day-selected-first-metric-lock/) solo remiten a esta spec:
no tienen nada que implementar.

== QUE HACES ==

Solo test. Un fichero de codigo cambia en el diff acumulado:
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
La grafica (src/screens/home/weekly-activity-chart.tsx) entra en los tres
commits ROJOS con una mutacion y sale en el VERDE siguiente con
`git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
Su diff acumulado contra origin/main es VACIO.

  R1 (#141)  describe `#141 R1: ...`, un it: el texto de los dos hijos de
             cada una de las siete columnas, por posicion, en diez estados,
             con toStrictEqual contra tres listas literales (minutes,
             kilometres, walks). Mutacion P1red: la sonda valuecross (la
             septima columna con el valor de la primera, blob 9f3c5bfd)
  R2 (#142)  describe `#142 R2: ...`, TRES it (sin comparacion, con
             comparacion, sin ningun dia medido): la lista cerrada de hijos
             de la tarjeta con toStrictEqual. Mutacion P2red: la sonda
             cardtail (un <View /> encima de </Card>, blob 0ac97f35). Su
             rojo son los TRES it a la vez, a proposito
  R3 (#143)  describe `#143 R3: ...`, un it: con la primera metrica y un dia
             seleccionado, la clase de cada columna y [testID, clase] de sus
             dos hijos, en dos estados, con toStrictEqual. Mutacion P3red:
             la sonda z_labelselfirstmetric (blob 6eda3dd1)
  R4         cierre: suite, tsc, eslint, greps de candado, diff, prefijo,
             blobs finales, sondas, reporte y traceability.md
No uses numeros de linea: localiza todo con los grep y las lineas literales
de tasks.md.

Orden EXACTO de tasks.md:
  Antes       rama; casilla de §Aprobacion marcada; router.d.ts; los dos
              blobs de base (grafica c258abed, test 2f3828f4); las dos
              medidas. Si un blob no coincide, PARA
  R1, R2, R3  por requisito, DOS commits: el ROJO (el bloque de test + la
              mutacion de la grafica, los dos ficheros) y el VERDE (solo la
              grafica, revertida con git checkout HEAD~1 --). Cada paso con
              su blob de control y su rojo medido en la grafica Y en la suite
  Sondas      todas las de tasks.md §Sondas, UNA cada vez, sobre el arbol
              final, con el procedimiento de §Sondas (aplicar, git
              hash-object, medir con el comando de su columna «Comando»,
              anotar la PRIMERA LINEA de cada error, restaurar con el
              `git checkout HEAD -- <las tres rutas>` del paso 5, y los dos
              git diff --exit-code en 0). No se commitean
  R4          comprobaciones de cierre; reporte y traceability.md en el
              ultimo commit

Mensajes de commit, LITERALES y en este orden (siete commits):
  test(mobile): expose the weekly day value cross with a versioned mutation (R1)
  test(mobile): lock each weekly day column to its own value in every metric (R1)
  test(mobile): expose a trailing card child with a versioned mutation (R2)
  test(mobile): lock the weekly card children with toStrictEqual (R2)
  test(mobile): expose the first-metric selected label colour with a versioned mutation (R3)
  test(mobile): lock the weekly columns with a day selected on the first metric (R3)
  docs(mobile): record the weekly value cross, card and first-metric evidence (R1,R2,R3,R4)

Ficheros que TU cambias, medidos desde el commit que anade este handoff
(`H=$(git log -1 --format=%H -- progress/handoff_mobile-weekly-day-column-value-cross-lock.md)`,
luego `git diff --name-only $H..HEAD`):
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
  specs/mobile-weekly-day-column-value-cross-lock/traceability.md
  progress/impl_mobile-weekly-day-column-value-cross-lock.md
Nada mas. La grafica aparece en tus commits pero no en ese diff (acaba en su
blob de base). src/screens/home/index.tsx solo se muta en las dos sondas h_*
y nunca se commitea. Lo demas que sale en el diff de la branch contra
origin/main son commits del leader, anteriores a ti.

== CIFRAS ==

La base de la branch es origin/main 4d536a43 y el arbol de
mobile-pet-tracker/ es identico al suyo (el leader midio
`git diff --quiet origin/main HEAD -- mobile-pet-tracker` con exit=0 y los
blobs de base el 2026-09-30: grafica c258abed, test 2f3828f4, index.tsx
0d439ebc). La suite de 86 / 1621 la midio el leader con ./init.sh sobre
95a46292 (exit 0); el spec_author no la midio. Cuentas esperadas:
  base    grafica 55/55; suite 86 suites / 1621 tests, exit=0
  rojo R1 grafica 1 failed de 56; suite 1 failed de 1622
  verde   grafica 56/56
  rojo R2 grafica 3 failed de 59; suite 3 failed de 1625
  verde   grafica 59/59
  rojo R3 grafica 1 failed de 60; suite 1 failed de 1626
  verde   grafica 60/60
  final   suite 86 suites / 1626 tests, exit=0 (delta +0 suites, +5 tests)
Tu medida manda: si la base no es 1621 con exit=0, anota la tuya y aplica
el mismo delta. Los rojos son SOLO los it que nombra tasks.md, por
toStrictEqual y POR ASERCION (`expect(received).toStrictEqual(expected)`),
cada uno en su aserción a1, nunca por consulta, ReferenceError ni
TypeError; si falla cualquier otro test de la suite, PARA.

Sondas: si alguna no da exactamente su «Exigido», PARA y reportalo con el
log. No ajustes la asercion para que cuadre. Dan verde A PROPOSITO, y no son
fallos tuyos: valuecrosstrend, valuecrossnomissing, cardtailen,
z_labelselwalks (las cuatro (D)), loose y loose + cardtail. labelcross y
dashtext dan tambien el rojo de un describe previo (#68 R3 por toEqual, R5
por toHaveTextContent), a proposito. rowtail da rojo 4 (#140 R1, #140 R2, R1
y R3). h_tilerowtail y h_reminderstail mutan src/screens/home/index.tsx y
dan el rojo de index.test.tsx que dice la tabla (N). z_labelnested se corre
SOLO con `-t "#14[13] R"`: sin -t, la grafica agota el heap de jest en
#68 R3 (esperado, fuera de alcance). hexbare y loose mutan el TEST, no la
grafica.

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
  VERDE que solo revierte la grafica. Siete commits, no uno: tests +
  implementacion + docs en un solo commit incumple C4 (paso en #19).
- Los bloques de tasks.md van TAL CUAL, sin prettier: titulos, comentarios,
  sangria y literales. En tasks.md llevan 3 espacios de sangria por estar
  dentro de una lista; en el test, `describe(` va en la columna 0 y las
  lineas en blanco van vacias. Los blobs de control lo comprueban (test
  b4474f36 tras R1, 5e4c6905 tras R2, 3e0ff4a3 tras R3): si no coinciden,
  compara con el literal antes de seguir. Ningun import nuevo.
- Reglas de literales de tasks.md §Antes punto 7 (design-drift escanea el
  test): la cita va siempre como `#141 R1`, `#142 R2` o `#143 R3`, NUNCA
  `#141`, `#142` ni `#143` sueltos, tampoco en comentarios, porque #68 R18
  lo lee como un color hexadecimal. Ni StyleSheet, ni text-[10px], ni
  use-api/useApi. Los textos, testID y clases esperados son literales del
  test: no importes formatMetricValue, metricValue, weekdayLabel ni nada de
  la grafica, ni leas su fuente.
- Candados con toStrictEqual, guardas con toEqual({ selected: true }), tal
  como estan en los bloques. No cambies una guarda a toStrictEqual: el
  accessibilityState lleva claves a undefined y falla en la base.
- Refactor: ninguno. No extraigas helpers ni listas compartidas entre los
  bloques nuevos.
- NO toques: los describe de #68, #74, #130, #131, #132, #135 y #140 del
  test, sus helpers, mocks e imports. En particular, NO cambies toEqual por
  toStrictEqual en #135 R4 ni anadas estados a #140 R1 o #140 R2: R2 y R3
  son describe hermanos a proposito. Tampoco: la grafica fuera de los tres
  rojos; src/screens/home/index.tsx fuera de las dos sondas h_*; su test y
  src/__tests__/ (entero); src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx; package.json;
  bun.lock; docs/; los dos punteros de specs/. Cero dependencias nuevas y
  cero copy nueva.
- Rellena specs/mobile-weekly-day-column-value-cross-lock/traceability.md
  con los hashes, sin ninguna fila «pendiente». Cada R cita su rojo y su
  verde; la fila de R4 cita el hash del VERDE de R3 (el ultimo commit de
  codigo), no el de docs. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que
  tengas que contar va en progress/impl_mobile-weekly-day-column-value-cross-lock.md.
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
  feature lleva parentesis). Comprueba que imprime 1 suite (6 en las sondas
  de «6 suites»).
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve
  el codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte. Los bloques `● Console` del log de la suite son ruido.
- En las SONDAS restaura SIEMPRE con `git checkout HEAD -- <ruta>` (las tres
  rutas de tasks.md §Sondas paso 5: la grafica, el test e index.tsx), nunca
  con `git checkout <commit> -- <ruta>` seguido de otro checkout: deja la
  mutacion en el indice. Ni git stash ni rm -f. Tras cada sonda,
  `git diff --exit-code -- mobile-pet-tracker/src` y
  `git diff --cached --exit-code -- mobile-pet-tracker/src` en 0. (El
  `git checkout HEAD~1 --` de cada VERDE es otra cosa: ahi SI quieres la
  grafica de base en el indice para commitearla.)
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son
  compartidos con la sesion de #60. Se mide con bunx jest, bunx tsc --noEmit
  y bunx eslint.

Criterios de aceptacion: R1-R4 de requirements.md.

Al terminar, escribe progress/impl_mobile-weekly-day-column-value-cross-lock.md
con: pwd y branch; skills cargadas (ninguna); la base medida y sus blobs; los
siete commits con hash y R-id; cada rojo con sus cuentas en la grafica y en
la suite, exit, sus it, su matcher, `Expected` y `Received`, y cada verde con
sus cuentas y exit; la tabla de todas las sondas con blob, comando, exit,
cuentas, cada it rojo, su matcher y si es rojo por asercion o por consulta,
en la columna «medido»; los greps de R4.4 y R4.5 con su salida; tsc y
eslint con su exit; los blobs finales; el delta sobre tu base; y cualquier
decision que la spec no cerrara literalmente.
```
