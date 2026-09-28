# Handoff a Codex CLI — #74 mobile-metric-selector-a11y

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 8f7aca56 de esta branch, aprobacion via Notion el 2026-09-28, **opcion de R3: A**).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-metric-selector-a11y.md.
Para si la branch no es feature/74-mobile-metric-selector-a11y.
No toques /home/claude/sites/Pet-Tracker-wt-backend, Pet-Tracker-wt-ui,
pet-tracker-43 ni pt-skills (son otros worktrees con otras sesiones) ni cambies
de branch en ningun worktree.

Feature: mobile-metric-selector-a11y (#74), branch: feature/74-mobile-metric-selector-a11y
Spec aprobada: specs/mobile-metric-selector-a11y/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-metric-selector-a11y/design.md, tasks.md y
traceability.md. tasks.md es tu guion paso a paso: tiene los tres describe
literales, las dos mutaciones versionadas con sus blobs, el comentario literal
de R3, la tabla «Exigido» de las sondas, los blobs finales y los comandos.

== OPCION FIRMADA: A ==

La casilla de requirements.md §Aprobacion dice «opcion de R3: A». Aplica SOLO
lo marcado «con A» en tasks.md. Todo lo marcado «con B» NO se hace: ni import
de Platform en la grafica, ni rama adjustsFontSizeToFit={Platform.OS !== 'android'},
ni las sondas nobranch e inverted. La unica sonda de rama es `branch` (solo A).

== QUE HACES ==

Dos ficheros, los dos bajo mobile-pet-tracker/src/screens/home/:
weekly-activity-chart.tsx (produccion) y weekly-activity-chart.test.tsx.
  R1  accessibilityRole="radiogroup" en el View testID="weekly-activity-metric".
      Rojo natural (toBe)
  R2  dos listas cerradas de props del host (contenedor y tarjeta). Rojo con la
      mutacion P2red versionada, verde revirtiendola
  R3  it.each android/ios sobre [adjustsFontSizeToFit, minimumFontScale,
      maxFontSizeMultiplier] de las tres etiquetas, con la fila
      ['android', true]. Rojo con la mutacion P3redA versionada (borrar la
      linea `              minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}`);
      verde revirtiendola y anadiendo el comentario ingles de dos lineas de
      tasks.md §R3 (2) «Con A» justo encima de
      `const METRIC_LABEL_MIN_FONT_SCALE = 0.85;`
  R4  borrar el jest.mock('uniwind') muerto (4 lineas + la linea en blanco)
  R5  cierre: sondas, greps de candado, tsc, eslint, blobs finales, reporte y
      traceability.md
No uses numeros de linea: localiza todo con los grep de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama; casilla de §Aprobacion = A; router.d.ts; los tres blobs de base
          (grafica 128c09bd, test bc8e8fd9, card.tsx ca32acde); las dos medidas.
          Si un blob no coincide, PARA
  R1 (1)  commit ROJO, solo el test (blob 567bc373). UNICO rojo de la suite:
          `#74 R1: el contenedor del selector se anuncia como grupo de
          opciones › declara el rol radiogroup en el contenedor de las tres
          opciones`, por expect(received).toBe
  R1 (2)  commit VERDE: la linea accessibilityRole="radiogroup" (grafica
          e8e6633b). Grafica 37/37
  R2 (1)  commit ROJO: test (c0ec0cb8) + P2red en la grafica (e82cb355).
          UNICOS rojos: los dos it de `#74 R2: el grupo del selector no
          colapsa sus tres opciones`, por expect(received).toEqual
  R2 (2)  commit VERDE: `git checkout HEAD~1 --
          mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
          (desde la raiz). Grafica vuelve a e8e6633b; 39/39
  R3 (1)  commit ROJO: test con la fila ['android', true] (ce1685a5) + P3redA
          en la grafica (32de7886). UNICOS rojos: las dos filas android e ios
          del it.each de `#74 R3`, por expect(received).toEqual
  R3 (2)  commit VERDE: `git checkout HEAD~1 --
          mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` y el
          comentario de A (grafica c258abed). 41/41
  R4      commit: borrar el mock (test d9687b16). greps de tasks.md §R4. 41/41
  Sondas  las 12 de A (collapse, accessible, arialabel, rolealias, hide,
          noRole, cardacc, cardpress, nomfs, mfs05, nomaxm, branch), UNA cada
          vez: aplicar, comprobar el «Blob con A» de la tabla, medir la
          grafica, apuntar exit, cuentas, cada it rojo y su matcher,
          `git checkout -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
          y `git diff --exit-code -- mobile-pet-tracker/src` en 0 antes de la
          siguiente. No se commitean
  R5      comprobaciones de cierre; reporte y traceability.md en el ultimo commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expect the metric selector to be a radiogroup (R1)
  fix(mobile): announce the metric selector as a radiogroup (R1)
  test(mobile): expose the metric selector collapse with a versioned mutation (R2)
  test(mobile): lock the metric selector group against collapsing (R2)
  test(mobile): lock the metric label fit and floor per platform (R3)
  fix(mobile): document the Android shrink floor of the metric labels (R3)
  test(mobile): drop the dead uniwind mock (R4)
  docs(mobile): record the metric selector a11y evidence (R5)

Ficheros que cambian en el diff acumulado:
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
  specs/mobile-metric-selector-a11y/traceability.md
  progress/impl_mobile-metric-selector-a11y.md
Nada mas.

== LA BASE SE MOVIO: CIFRAS DE SUITE ==

tasks.md y requirements.md escriben la suite sobre la base 912d11dc
(83 / 1532 / 1). Despues mergeo #77 (PR #169), que anadio 13 tests en
src/screens/home/index.test.tsx, y el leader la mergeo en esta branch
(25441c4b, sin conflictos). Los ficheros de la grafica y card.tsx NO
cambiaron: sus blobs, sus cuentas (36 hoy) y las sondas siguen valiendo tal
cual. Solo cambia la suite completa. El leader la midio sin pipe sobre
8f7aca56, el 2026-09-28: 83 suites, 1545 tests, 1 snapshot, exit=0, 30
bloques «● Console». tasks.md §Antes de tocar nada punto 6 ya dice que manda
TU medida y que el gate es el delta (+0 suites, +5 tests). Con esta base:
  base    83 suites / 1545 passed / 1 snapshot, exit=0
  R1 rojo exit=1: 1 failed + 1545 passed de 1546; 1 failed + 82 passed de 83 suites
  R2 rojo exit=1: 2 failed + 1546 passed de 1548
  R3 rojo exit=1: 2 failed + 1548 passed de 1550
  cierre  83 suites / 1550 passed / 1 snapshot, exit=0
Si tu base no es 1545, anota la tuya y aplica el mismo delta. Los rojos
siguen siendo SOLO los it nombrados arriba; si falla cualquier otro, PARA.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer).
- Skills: carga `building-native-ui` de tu plugin expo (es el nombre de TU
  catalogo v1.0.2; no busques expo-overview ni expo-native-ui, no existen en
  el tuyo). appllama-app-design-skill de .agents/skills/ NO aplica: no se
  disena ni se cambia una pantalla ni un flujo, solo props de accesibilidad y
  un comentario. Di en el reporte que skills cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md): R1 es rojo natural. R2 y R3 van por la
  via b: cada rojo versiona SU mutacion de produccion (P2red, P3redA) y su
  verde la revierte con `git checkout HEAD~1 --`. Mutar un doble no vale. Cada
  rojo falla por SU matcher (toBe en R1, toEqual en R2 y R3) en los it
  nombrados, nunca por otra asercion, otro test, un ReferenceError o un
  TypeError. Siete commits de codigo, no uno: tests + implementacion + docs en
  un solo commit incumple C4.
- Los esperados son LITERALES del test ('radiogroup', las dos listas de
  claves, 0.85, 1.2, true). Nada importado de produccion salvo WEEKLY_METRICS,
  que ya se importa y ya esta bajo su propio candado.
- Los literales de tasks.md van TAL CUAL: describe, it, comentarios del test y
  el comentario ingles de la grafica. Los blobs de control lo comprueban: si
  no coinciden, compara con el literal antes de seguir.
- Reglas de literales de tasks.md §Antes punto 7 (#68 R18): un `#` solo va
  seguido de dos o tres digitos, un espacio y R<n> (`#74 R3`); ni StyleSheet
  ni text-[10px]; ni use-api ni useApi en los bloques nuevos.
- NO toques: src/screens/home/index.tsx e index.test.tsx;
  src/components/card.tsx; los describe de #68 del test (incluidos los dos que
  se titulan «R9») y los mocks que no son el de uniwind (mockTheme, el de
  ../../theme/use-theme-colors y el resto); src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx;
  src/__tests__/ui-copy-table.ts; src/__tests__/design-drift.test.ts;
  src/__tests__/consistency-classnames.test.ts; package.json; bun.lock;
  ficheros nativos ni configuracion de la app. Cero dependencias nuevas.
- Si una sonda no da el veredicto «Exigido» de tasks.md §Sondas, PARA y
  reportalo con el log. No ajustes la asercion para que cuadre.
- Rellena specs/mobile-metric-selector-a11y/traceability.md con los hashes, sin
  ninguna fila «pendiente» salvo R6, que es del humano. No rebasees despues de
  escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que tengas
  que contar va en progress/impl_mobile-metric-selector-a11y.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.
- R6 (TalkBack) no es tuyo: es el gate del humano tras el reviewer.

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

Criterios de aceptacion: R1-R5 de requirements.md (R6 es del humano).

Al terminar, escribe progress/impl_mobile-metric-selector-a11y.md con: pwd y
branch; skills cargadas; la opcion de R3 aplicada (A); la base medida y sus
blobs; los commits por R-id con hashes; cada rojo con su it, `Expected` y
`Received`, y cada verde con sus cuentas y exit; la tabla de las 12 sondas de A
con blob, exit, cuentas, cada it rojo y su matcher en la columna «medido»; los
greps de R4 y de R5.4 con su salida; comandos y salidas exactas del cierre de
R5; los blobs finales; el delta sobre tu base; y cualquier decision que la spec
no cerrara literalmente.
```
