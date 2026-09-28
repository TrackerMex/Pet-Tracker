# Handoff a Codex CLI — #132 mobile-weekly-chart-root-accessible-lock

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 4126e990 de esta branch, aprobacion via Notion el 2026-09-28). Una sola
> casilla: no hay gate de TalkBack.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-weekly-chart-root-accessible-lock.md.
Para si la branch no es feature/132-mobile-weekly-chart-root-accessible-lock.
No toques /home/claude/sites/Pet-Tracker-wt-backend, Pet-Tracker-wt-ui,
pet-tracker-43 ni pt-skills (son otros worktrees con otras sesiones) ni cambies
de branch en ningun worktree.

Feature: mobile-weekly-chart-root-accessible-lock (#132), branch: feature/132-mobile-weekly-chart-root-accessible-lock
Spec aprobada: specs/mobile-weekly-chart-root-accessible-lock/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-weekly-chart-root-accessible-lock/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene el
describe literal, la mutacion versionada con su blob, la tabla «Exigido» de
las 11 sondas, los greps de candado, los blobs finales y los comandos.

== QUE HACES ==

SOLO TESTS. El diff acumulado de produccion es VACIO. Dos ficheros, los dos
bajo mobile-pet-tracker/src/screens/home/:
weekly-activity-chart.test.tsx (el test) y weekly-activity-chart.tsx (la
grafica, que SOLO se toca en el commit rojo y se revierte en el verde
siguiente).
  R1  la tarjeta es la raiz host de lo que pinta la grafica: el it monta la
      grafica dentro de un <View testID="chart-parent"> del propio test y
      asevera, con toBe, que
      getByTestId('weekly-activity-card').parent?.props.testID es
      'chart-parent'. Rojo con la mutacion P1red versionada (un
      <View accessible> alrededor de la tarjeta); verde revirtiendola
  R2  cierre: sondas, greps de candado, tsc, eslint, blobs finales, reporte y
      traceability.md
No uses numeros de linea: localiza todo con los grep de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama; casilla de §Aprobacion marcada; router.d.ts; los dos blobs de
          base (grafica c258abed, test 24a5c572); las tres medidas. Si un blob
          no coincide, PARA
  R1 (1)  commit ROJO: test (blob 326aa482) + P1red en la grafica (cec8a26e).
          Este rojo NO es unico, y asi debe ser: la suite da EXACTAMENTE 5
          rojos en 2 suites.
            - en el test, `#132 R1: la tarjeta es la raíz host de lo que pinta
              la gráfica › entre el nodo que monta la gráfica y la tarjeta no
              hay ningún otro`, por expect(received).toBe, Expected
              "chart-parent", Received undefined
            - en src/screens/home/index.test.tsx, los 4 it de orden que
              nombra tasks.md §R1 paso 4, todos por expect(received).toEqual.
              Ya son rojos hoy con esta misma mutacion. NO los toques
          Si falla cualquier otro it, o uno de estos por otro matcher, PARA
  R1 (2)  commit VERDE: `git checkout HEAD~1 --
          mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
          (desde la raiz). Grafica vuelve a c258abed; 44/44
  Sondas  las 11 de tasks.md §Sondas, UNA cada vez: aplicar, comprobar el blob
          de la tabla con git hash-object, medir la grafica Y la Home juntas
          (Test Suites: 2), apuntar exit, cuentas, cada it rojo y la PRIMERA
          LINEA de su error (expect(received).<matcher> es rojo por asercion;
          `Unable to find an element with testID: ...` es rojo por consulta).
          Restaura con `git checkout HEAD --` de los dos ficheros (con HEAD,
          no `git checkout --` a secas) y comprueba que
          `git diff --exit-code -- mobile-pet-tracker/src` y
          `git diff --cached --exit-code -- mobile-pet-tracker/src` dan 0 los
          dos antes de la siguiente. `hexbare` muta el TEST, no la grafica, y
          se mide con design-drift.test.ts. `hidewrap` DEBE dar R1 rojo por
          CONSULTA, no por asercion. `fragment`, `sibling` y `wrapmetric`
          DEBEN dar verde: `sibling` y `wrapmetric` son huecos declarados
          (D) y (F), no un fallo tuyo. No se commitean
  R2      comprobaciones de cierre; reporte y traceability.md en el ultimo commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expose a wrapper around the weekly activity card with a versioned mutation (R1)
  test(mobile): lock the weekly activity card as the chart's host root (R1)
  docs(mobile): record the weekly chart root lock evidence (R2)

Ficheros que cambian en el diff acumulado contra origin/main:
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
  specs/mobile-weekly-chart-root-accessible-lock/traceability.md
  progress/impl_mobile-weekly-chart-root-accessible-lock.md
Nada mas. La grafica aparece en la historia (dos commits) pero NO en el diff
acumulado: acaba en su blob de base c258abed.

== CIFRAS DE SUITE ==

origin/main no se ha movido desde la base de la spec (035be7fe) y nada ha
cambiado bajo mobile-pet-tracker/, asi que las cifras de tasks.md valen tal
cual:
  base    83 suites / 1552 passed / 1 snapshot, exit=0
          grafica 43/43; grafica + Home 202/202
  R1 rojo exit=1: 5 failed + 1548 passed de 1553; 2 failed + 81 passed de 83 suites
  cierre  83 suites / 1553 passed / 1 snapshot, exit=0
          grafica 44/44; Home 159/159
Si tu base no es 1552 (por ejemplo, porque la sesion Backend mergeo #100
antes), anota la tuya y aplica el mismo delta (+0 suites, +1 test). Si la
grafica o la Home dan otra cifra de base, PARA. Los rojos siguen siendo SOLO
los 5 it nombrados arriba; si falla cualquier otro, PARA.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer).
- Skills: carga `building-native-ui` de tu plugin expo (es el nombre de TU
  catalogo v1.0.2; no busques expo-overview ni expo-native-ui, no existen en
  el tuyo). appllama-app-design-skill de .agents/skills/ NO aplica: no se
  disena ni se cambia una pantalla ni un flujo, solo se anade un test. Di en
  el reporte que skills cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via b: la base ya cumple, asi que el
  rojo versiona SU mutacion de produccion (P1red) en el mismo commit que el
  test, y el verde la revierte con `git checkout HEAD~1 --`. Mutar un doble
  de test no vale. El rojo de R1 falla por toBe, nunca por otra asercion, un
  ReferenceError o un TypeError. Dos commits de codigo y uno de docs, no uno:
  test + mutacion + docs en un solo commit incumple C4.
- Los esperados son LITERALES del test: 'chart-parent' y
  'weekly-activity-card'. Nada importado de la grafica, y NINGUN import nuevo
  en el test: View sale del jest.requireActual del propio it, y render,
  ChartWrapper, WeeklyActivityChart, makeWeek y NO_COMPARISON ya estan. No uses
  renderChart en este it: no deja meter el centinela.
- Los literales de tasks.md van TAL CUAL: describe, it, comentario del test y
  las lineas de la mutacion. Los blobs de control lo comprueban: si no
  coinciden, compara con el literal (sangria incluida, y el fichero acaba en
  `});` y un salto de linea) antes de seguir.
- Reglas de literales de tasks.md §Antes punto 7 (#68 R18): un `#` solo va
  seguido de dos o tres digitos, un espacio y R<n> (`#132 R1`). NUNCA un
  `#132` suelto, tampoco en comentarios: rompe #68 R18 (es la sonda hexbare).
  Ni StyleSheet ni text-[10px]; ni use-api ni useApi en el bloque nuevo.
- NO toques: la grafica fuera del commit rojo; los describe de #68, #74 y
  #130 del test y sus helpers y mocks (renderChart, ChartWrapper, makeWeek,
  makeDay, NO_COMPARISON, mockTheme y el resto), ni la cabecera de imports;
  src/components/card.tsx; src/screens/home/index.tsx e index.test.tsx (sus
  4 it de orden se ponen rojos en el commit rojo, y asi debe ser);
  src/i18n/catalog.ts; src/providers/__tests__/language-provider.test.tsx;
  src/__tests__/ui-copy-table.ts; src/__tests__/design-drift.test.ts (la
  sesion Backend lo toca en #100); src/__tests__/consistency-classnames.test.ts;
  package.json; bun.lock; ficheros nativos ni configuracion de la app. Cero
  dependencias nuevas.
- Si una sonda no da el veredicto «Exigido» de tasks.md §Sondas, PARA y
  reportalo con el log. No ajustes la asercion para que cuadre.
- Rellena specs/mobile-weekly-chart-root-accessible-lock/traceability.md con
  los hashes, sin ninguna fila «pendiente». La fila de R2 cita el hash del
  VERDE de R1 (el ultimo commit de codigo). No rebasees despues de escribir
  hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que tengas
  que contar va en progress/impl_mobile-weekly-chart-root-accessible-lock.md.
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
- Jest siempre con --runTestsByPath y las rutas de tasks.md (no tienen
  parentesis). Comprueba que imprime `Test Suites: 1` para la grafica sola y
  `Test Suites: 2` para la corrida de sondas.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de resumen
  al reporte.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees. Se mide con bunx jest, bunx tsc --noEmit y
  bunx eslint.

Criterios de aceptacion: R1-R2 de requirements.md.

Al terminar, escribe progress/impl_mobile-weekly-chart-root-accessible-lock.md
con: pwd y branch; skills cargadas; la base medida y sus blobs; los commits por
R-id con hashes; el rojo con sus 5 it, cada uno con su matcher, `Expected` y
`Received`, y el verde con sus cuentas y exit; la tabla de las 11 sondas con
blob, exit, cuentas, cada it rojo, su matcher y si es rojo por asercion o por
consulta, en la columna «medido»; los greps de R2.4 y R2.5 con su salida;
comandos y salidas exactas del cierre de R2; los blobs finales; el delta sobre
tu base; y cualquier decision que la spec no cerrara literalmente.
```
