# Handoff a Codex CLI — #130 mobile-weekly-day-row-accessible-lock

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> ceb6a51e de esta branch, aprobacion via Notion el 2026-09-28). Una sola
> casilla: no hay gate de TalkBack.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-weekly-day-row-accessible-lock.md.
Para si la branch no es feature/130-mobile-weekly-day-row-accessible-lock.
No toques /home/claude/sites/Pet-Tracker-wt-backend, Pet-Tracker-wt-ui,
pet-tracker-43 ni pt-skills (son otros worktrees con otras sesiones) ni cambies
de branch en ningun worktree.

Feature: mobile-weekly-day-row-accessible-lock (#130), branch: feature/130-mobile-weekly-day-row-accessible-lock
Spec aprobada: specs/mobile-weekly-day-row-accessible-lock/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-weekly-day-row-accessible-lock/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los dos
describe literales, las dos mutaciones versionadas con sus blobs, la tabla
«Exigido» de las 21 sondas, los greps de candado, los blobs finales y los
comandos.

== QUE HACES ==

SOLO TESTS. El diff acumulado de produccion es VACIO. Dos ficheros, los dos
bajo mobile-pet-tracker/src/screens/home/:
weekly-activity-chart.test.tsx (el test) y weekly-activity-chart.tsx (la
grafica, que SOLO se toca en los dos commits rojos y se revierte en el verde
siguiente).
  R1  lista cerrada de las claves de props del host de la fila
      (testID="weekly-activity-day-row"): exactamente
      ['children', 'className', 'style', 'testID']. Rojo con la mutacion P1red
      versionada (`accessible` en la fila); verde revirtiendola
  R2  la cadena tarjeta -> fila -> siete columnas: los testID de row.children,
      con toEqual, son los siete dias 2026-09-02 ... 2026-09-08 en orden, y
      row.parent?.props.testID es 'weekly-activity-card', con toBe. Rojo con la
      mutacion P2red versionada (un <View accessible> alrededor de las siete
      columnas); verde revirtiendola
  R3  cierre: sondas, greps de candado, tsc, eslint, blobs finales, reporte y
      traceability.md
No uses numeros de linea: localiza todo con los grep de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama; casilla de §Aprobacion marcada; router.d.ts; los dos blobs de
          base (grafica c258abed, test d9687b16); las dos medidas. Si un blob
          no coincide, PARA
  R1 (1)  commit ROJO: test (blob 70312d87) + P1red en la grafica (7e105520).
          UNICO rojo de la suite: `#130 R1: la fila de las siete columnas no se
          vuelve un nodo accesible › la fila solo lleva su testID, su clase, su
          estilo y sus hijos`, por expect(received).toEqual
  R1 (2)  commit VERDE: `git checkout HEAD~1 --
          mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
          (desde la raiz). Grafica vuelve a c258abed; 42/42
  R2 (1)  commit ROJO: test (24a5c572) + P2red en la grafica (b2487b53).
          UNICO rojo: `#130 R2: entre la tarjeta y cada columna no hay otro
          nodo › las siete columnas cuelgan de la fila, y la fila, de la
          tarjeta`, por expect(received).toEqual. R1 sigue verde
  R2 (2)  commit VERDE: `git checkout HEAD~1 --
          mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
          Grafica vuelve a c258abed; 43/43
  Sondas  las 21 de tasks.md §Sondas, UNA cada vez: aplicar, comprobar el blob
          de la tabla con git hash-object, medir, apuntar exit, cuentas, cada it
          rojo y la PRIMERA LINEA de su error (expect(received).<matcher> es
          rojo por asercion; `Unable to find an element with testID: ...` es
          rojo por consulta), `git checkout --` de los dos ficheros y
          `git diff --exit-code -- mobile-pet-tracker/src` en 0 antes de la
          siguiente. `hexbare` muta el TEST, no la grafica, y se mide con
          design-drift.test.ts. `flexcol` y `nopad` DEBEN dar verde: son el
          hueco declarado (F), no un fallo tuyo. No se commitean
  R3      comprobaciones de cierre; reporte y traceability.md en el ultimo commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expose the weekly day row collapse with a versioned mutation (R1)
  test(mobile): lock the weekly day row out of the accessibility tree (R1)
  test(mobile): expose a wrapper around the weekly day columns with a versioned mutation (R2)
  test(mobile): lock the weekly day columns as direct children of the row (R2)
  docs(mobile): record the weekly day row lock evidence (R3)

Ficheros que cambian en el diff acumulado contra origin/main:
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
  specs/mobile-weekly-day-row-accessible-lock/traceability.md
  progress/impl_mobile-weekly-day-row-accessible-lock.md
Nada mas. La grafica aparece en la historia (cuatro commits) pero NO en el
diff acumulado: acaba en su blob de base c258abed.

== CIFRAS DE SUITE ==

origin/main no se ha movido desde la base de la spec (3cf09ca5) y nada ha
cambiado bajo mobile-pet-tracker/, asi que las cifras de tasks.md valen tal
cual:
  base    83 suites / 1550 passed / 1 snapshot, exit=0
  R1 rojo exit=1: 1 failed + 1550 passed de 1551; 1 failed + 82 passed de 83 suites
  R2 rojo exit=1: 1 failed + 1551 passed de 1552; 1 failed + 82 passed de 83 suites
  cierre  83 suites / 1552 passed / 1 snapshot, exit=0
Si tu base no es 1550 (por ejemplo, porque la sesion Backend mergeo #100
antes), anota la tuya y aplica el mismo delta (+0 suites, +2 tests). Los rojos
siguen siendo SOLO los it nombrados arriba; si falla cualquier otro, PARA.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer).
- Skills: carga `building-native-ui` de tu plugin expo (es el nombre de TU
  catalogo v1.0.2; no busques expo-overview ni expo-native-ui, no existen en
  el tuyo). appllama-app-design-skill de .agents/skills/ NO aplica: no se
  disena ni se cambia una pantalla ni un flujo, solo se anaden dos tests. Di
  en el reporte que skills cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via b: la base ya cumple, asi que cada
  rojo versiona SU mutacion de produccion (P1red, P2red) en el mismo commit que
  el test, y su verde la revierte con `git checkout HEAD~1 --`. Mutar un doble
  de test no vale. Cada rojo falla por toEqual en el it nombrado, nunca por
  otra asercion, otro test, un ReferenceError o un TypeError. Cuatro commits
  de codigo y uno de docs, no uno: tests + mutaciones + docs en un solo commit
  incumple C4.
- Los esperados son LITERALES del test: las cuatro claves, los siete testID y
  'weekly-activity-card'. Nada importado de la grafica, y ningun import nuevo
  en el test (children y parent son del TestInstance que ya devuelve
  getByTestId).
- Los literales de tasks.md van TAL CUAL: describe, it, comentarios del test y
  las lineas de las mutaciones. Los blobs de control lo comprueban: si no
  coinciden, compara con el literal (sangria incluida) antes de seguir.
- Reglas de literales de tasks.md §Antes punto 7 (#68 R18): un `#` solo va
  seguido de dos o tres digitos, un espacio y R<n> (`#130 R1`). NUNCA un
  `#130` suelto, tampoco en comentarios: rompe #68 R18 (es la sonda hexbare).
  Ni StyleSheet ni text-[10px]; ni use-api ni useApi en los bloques nuevos.
- NO toques: la grafica fuera de los dos commits rojos;
  los describe de #68 y de #74 del test (incluidos los dos que se titulan
  «R9») y sus helpers y mocks (renderChart, makeWeek, makeDay, mockTheme y el
  resto); src/components/card.tsx; src/screens/home/index.tsx e
  index.test.tsx; src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx;
  src/__tests__/ui-copy-table.ts; src/__tests__/design-drift.test.ts (la
  sesion Backend lo toca en #100); src/__tests__/consistency-classnames.test.ts;
  package.json; bun.lock; ficheros nativos ni configuracion de la app. Cero
  dependencias nuevas.
- Si una sonda no da el veredicto «Exigido» de tasks.md §Sondas, PARA y
  reportalo con el log. No ajustes la asercion para que cuadre.
- Rellena specs/mobile-weekly-day-row-accessible-lock/traceability.md con los
  hashes, sin ninguna fila «pendiente». La fila de R3 cita el hash del VERDE de
  R2 (el ultimo commit de codigo). No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que tengas
  que contar va en progress/impl_mobile-weekly-day-row-accessible-lock.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y eslint desde mobile-pet-tracker/. Los git add, git checkout y
  git diff desde la raiz del repo, con rutas mobile-pet-tracker/..., como
  indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-09-28).
- Jest de la grafica siempre con --runTestsByPath y la ruta de tasks.md (no
  tiene parentesis). Comprueba que imprime `Test Suites: 1`.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de resumen
  al reporte.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees. Se mide con bunx jest, bunx tsc --noEmit y
  bunx eslint.

Criterios de aceptacion: R1-R3 de requirements.md.

Al terminar, escribe progress/impl_mobile-weekly-day-row-accessible-lock.md
con: pwd y branch; skills cargadas; la base medida y sus blobs; los commits por
R-id con hashes; cada rojo con su it, `Expected` y `Received`, y cada verde con
sus cuentas y exit; la tabla de las 21 sondas con blob, exit, cuentas, cada it
rojo, su matcher y si es rojo por asercion o por consulta, en la columna
«medido»; los greps de R3.4 y R3.5 con su salida; comandos y salidas exactas
del cierre de R3; los blobs finales; el delta sobre tu base; y cualquier
decision que la spec no cerrara literalmente.
```
