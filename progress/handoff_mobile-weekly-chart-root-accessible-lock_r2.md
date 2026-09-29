# Handoff a Codex CLI — #132 ronda 2 (Enmienda 1)

> Pegar el bloque de abajo en Codex CLI. La Enmienda 1 esta firmada (commit de
> firma 27724fb3 de esta branch, aprobacion via Notion el 2026-09-29). La firma
> original (4126e990) sigue en pie. Sin gate de TalkBack.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de la seccion `## Enmienda 1` que vas a anadir AL FINAL de
progress/impl_mobile-weekly-chart-root-accessible-lock.md.
Para si la branch no es feature/132-mobile-weekly-chart-root-accessible-lock.
No toques /home/claude/sites/Pet-Tracker-wt-backend, Pet-Tracker-wt-ui,
pet-tracker-43 ni pt-skills (son otros worktrees con otras sesiones) ni cambies
de branch en ningun worktree.

Feature: mobile-weekly-chart-root-accessible-lock (#132), RONDA 2
Branch: feature/132-mobile-weekly-chart-root-accessible-lock
Spec aprobada: specs/mobile-weekly-chart-root-accessible-lock/requirements.md
(status: approved; §Enmienda 1 con su casilla «Firma de la Enmienda 1» marcada)
Lee enteros requirements.md, design.md, tasks.md y traceability.md. Tu guion es
tasks.md §«Enmienda 1 — R1 en cuatro estados», de principio a fin: tiene los
bloques literales, las mutaciones versionadas con sus blobs, la tabla «Exigido»
de las 30 sondas de §E1 — Sondas, los greps de candado, los blobs finales y los
comandos. La ronda 1 (4fb4481c, 99629c30, 40e40dfe) YA ESTA HECHA y se queda.

== QUE HACES ==

SOLO TESTS. El diff acumulado de produccion sigue VACIO. Dos ficheros, los dos
en mobile-pet-tracker/src/screens/home/: weekly-activity-chart.test.tsx (el
test) y weekly-activity-chart.tsx (la grafica, que SOLO se toca en los tres
commits rojos y se revierte en el verde siguiente).
Anades tres `it` al describe de #132 R1, DETRAS de R1·1 (que no se toca):
  R1·2  tras medir el grafico (layout a 295)
  R1·3  con un dia seleccionado
  R1·4  con otra metrica seleccionada
Cada uno asevera, con toBe y literales, que el padre host de
weekly-activity-card es 'chart-parent', despues de probar que llego a su estado.

Orden EXACTO de tasks.md §Enmienda 1:
  Antes   §E1 — Antes de tocar nada, pasos 1-8: branch, casilla de la
          Enmienda 1 marcada, router.d.ts, la historia de la ronda 1 en HEAD
          (merge-base --is-ancestor de 4fb4481c 99629c30 40e40dfe 02128a12),
          blobs de base (grafica c258abed, test 326aa482) y las tres medidas.
          Si algo no coincide, PARA
  E1.1 (1) ROJO: test 6be9934b + layoutwrap en la grafica (bbf810f6).
           UNICO rojo: R1·2 «tras medir el gráfico, …», por toBe,
           Expected "chart-parent", Received undefined. La Home, verde
  E1.1 (2) VERDE: `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
           desde la raiz. Grafica en c258abed; 45/45
  E1.2 (1) ROJO: test 6689cc26 + selwrap (c81f498f). UNICO rojo: R1·3
           «con un día seleccionado, …», por toBe. La Home, verde
  E1.2 (2) VERDE: igual que E1.1 (2). 46/46
  E1.3 (1) ROJO: test d7f938da + metricwrap (35fe2999). EXACTAMENTE 2 rojos, en
           1 suite: R1·4 «con otra métrica seleccionada, …», por toBe, y
           `R6: el selector cambia de métrica sin volver a pedir nada › desliza
           una única píldora entre las medidas reales de las pestañas`, por
           toHaveBeenNthCalledWith (n: 1, Number of calls: 0). Ese segundo
           rojo es un rebote DECLARADO por la spec. NO toques R6
  E1.3 (2) VERDE: igual. 47/47
  Sondas  las 30 de tasks.md §E1 — Sondas, UNA cada vez: aplicar la mutacion,
          comprobar el blob con git hash-object, medir la grafica Y la Home
          juntas (Test Suites: 2; hexbare, con su comando de fila), apuntar
          exit, cuentas, cada it rojo y la PRIMERA LINEA de su error
          (expect(received).<matcher> es rojo por asercion; `Unable to find an
          element with testID: ...` es rojo por consulta). Restaura con
          `git checkout HEAD --` de los dos ficheros (con HEAD, no
          `git checkout --` a secas) y comprueba que
          `git diff --exit-code -- mobile-pet-tracker/src` y
          `git diff --cached --exit-code -- mobile-pet-tracker/src` dan 0 los
          dos antes de la siguiente. `hidewrap` debe dar los cuatro de R1 rojos
          por CONSULTA. Las filas «verde» (fragment, sibling, wrapmetric,
          widewrap, selidxwrap, metricidxwrap, zerowrap, missingwrap,
          selmissingwrap, emptywrap, localewrap, themewrap, oswrap) DEBEN dar
          verde: son huecos declarados, no un fallo tuyo. No se commitean
  Cierre  §E1 — Cierre (R2 enmendado), pasos 1-6

Mensajes de commit, LITERALES y en este orden (seis de codigo y uno de docs):
  test(mobile): expose a wrapper that appears after the weekly chart's layout with a versioned mutation (R1)
  test(mobile): lock the weekly activity card as the chart's host root after layout (R1)
  test(mobile): expose a wrapper that appears with a selected day with a versioned mutation (R1)
  test(mobile): lock the weekly activity card as the chart's host root with a selected day (R1)
  test(mobile): expose a wrapper that appears with another metric selected with a versioned mutation (R1)
  test(mobile): lock the weekly activity card as the chart's host root with another metric selected (R1)
  docs(mobile): record the weekly chart root lock evidence after amendment 1 (R2)

Ficheros en el diff acumulado contra origin/main (sin cambios frente a la ronda 1):
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
  specs/mobile-weekly-chart-root-accessible-lock/traceability.md
  progress/impl_mobile-weekly-chart-root-accessible-lock.md
Mas los ficheros del leader (specs/, progress/, feature_list.json), que no son
tuyos. La grafica acaba en su blob de base c258abed.

== CIFRAS DE SUITE ==

Base = HEAD de la branch, que desde 02128a12 solo cambia docs. origin/main
sigue en 4efb6c81, el mismo que midio la spec:
  base    86 suites / 1598 passed / 1 snapshot, exit=0
          grafica 44/44; grafica + Home 203/203
  E1.1 rojo exit=1: 1 failed + 1598 passed de 1599; 1 failed + 85 passed de 86 suites
  E1.2 rojo exit=1: 1 failed + 1599 passed de 1600; 1 failed + 85 passed de 86 suites
  E1.3 rojo exit=1: 2 failed + 1599 passed de 1601; 1 failed + 85 passed de 86 suites
  cierre  86 suites / 1601 passed / 1 snapshot, exit=0
          grafica 47/47; grafica + Home 206/206; Home 159/159
Si tu base de suite no es 1598 con exit=0, anotala y aplica el mismo delta
(+0 suites, +3 tests). Si la grafica o la Home dan otra cifra de base, PARA.
Los rojos son SOLO los it nombrados arriba; si falla cualquier otro, PARA.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer).
- Skills: carga `building-native-ui` de tu plugin expo (es el nombre de TU
  catalogo; no busques expo-overview ni expo-native-ui, no existen en el tuyo).
  appllama-app-design-skill de .agents/skills/ NO aplica: no se disena nada, solo
  se anaden tests. En el reporte, di que skills cargaste y con que version.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via b: cada rojo versiona SU mutacion de
  produccion en el mismo commit que su test, y el verde siguiente la revierte
  con `git checkout HEAD~1 --`. Mutar un doble de test no vale. Seis commits de
  codigo y uno de docs, no menos: juntar un test, su mutacion y los docs en un
  solo commit incumple C4.
- NADA de rebase, amend, reset, cherry-pick ni merge de origin/main: la ronda 1
  ya tiene hashes en traceability.md.
- Los literales de tasks.md van TAL CUAL: bloques de los it, comentarios y las
  lineas de cada mutacion. Los blobs de control lo comprueban: si no coinciden,
  compara con el literal (sangria incluida, y el fichero acaba en `});` y un
  salto de linea) antes de seguir. NO anadas ningun import.
- Esperados LITERALES del test ('chart-parent', 'weekly-activity-card'), nada
  importado de la grafica. No uses renderChart en estos it: no deja meter el
  centinela.
- Regla #68 R18: un `#` solo va seguido de dos o tres digitos, un espacio y
  R<n> (`#132 R1`). NUNCA un `#132` suelto, tampoco en comentarios (es la sonda
  hexbare). Ni StyleSheet ni text-[10px]; ni use-api ni useApi en los bloques
  nuevos.
- Timers y eventos: usa EXACTAMENTE la sincronizacion de los bloques literales
  (`await fireEvent`, el layout a 295, la pulsacion del dia y de la metrica).
  No anadas waitFor, act ni advanceTimersByTime por tu cuenta.
- NO toques: R1·1 (titulo, cuerpo y comentario); la grafica fuera de los tres
  commits rojos; los describe de #68, #74 y #130 del test, incluido R6, ni sus
  helpers y mocks (renderChart, ChartWrapper, makeWeek, makeDay, NO_COMPARISON,
  mockTheme y el resto), ni la cabecera de imports; src/components/card.tsx;
  src/screens/home/index.tsx e index.test.tsx; src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx;
  src/__tests__/ui-copy-table.ts; src/__tests__/design-drift.test.ts;
  src/__tests__/consistency-classnames.test.ts; package.json; bun.lock;
  ficheros nativos ni configuracion de la app. Cero dependencias nuevas.
- Si una sonda no da su veredicto «Exigido», PARA y reportalo con el log. No
  ajustes la asercion para que cuadre.
- traceability.md: rellena las cuatro filas «(Enmienda 1)» con hashes, sin
  ninguna «pendiente», y SIN tocar las filas de la ronda 1. La fila de R2
  (Enmienda 1) cita el hash del VERDE de E1.3.
- El reporte: seccion `## Enmienda 1` AL FINAL de
  progress/impl_mobile-weekly-chart-root-accessible-lock.md. No toques ni una
  linea de lo de la ronda 1.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y eslint desde mobile-pet-tracker/. Los git add, git checkout y
  git diff desde la raiz del repo, con rutas mobile-pet-tracker/..., como
  indica tasks.md. bun y bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo.
- Jest siempre con --runTestsByPath y las rutas de tasks.md (no tienen
  parentesis). Comprueba que imprime `Test Suites: 1` para la grafica sola y
  `Test Suites: 2` para la corrida de sondas.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de resumen
  al reporte.
- Si una repeticion de jest da un rojo que no esperas, borra la perf-cache de
  jest y repite una vez antes de parar: el sequencer corre primero el fichero
  que fallo la ultima vez.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees.

Criterios de aceptacion: R1 y R2 de requirements.md con §Enmienda 1.

Al terminar, en la seccion `## Enmienda 1` del reporte:
- pwd y branch; skills cargadas;
- la base medida, sus blobs y los pasos 5 y 6 de §E1 — Antes;
- los seis commits de codigo con sus hashes;
- cada rojo con sus it, su matcher, `Expected` y `Received`, y cada verde con
  sus cuentas y exit;
- la tabla de las 30 sondas, con una columna «medido»: blob, exit, cuentas,
  cada it rojo, su matcher, y si es por asercion o por consulta;
- los greps y diffs de §E1 — Cierre con su salida, los blobs finales y el delta
  sobre tu base;
- cualquier decision que la spec no cerrara literalmente.
```
