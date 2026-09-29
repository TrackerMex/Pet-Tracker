# Handoff a Codex CLI — #81 mobile-quick-actions-typography-lock

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 0894f07a de esta branch, aprobacion via Notion el 2026-09-29). Una sola
> casilla: no hay gate de dispositivo ni de TalkBack.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-quick-actions-typography-lock.md.
Para si la branch no es feature/81-mobile-quick-actions-typography-lock.
No toques /home/claude/sites/Pet-Tracker (es de otra sesion, con #132),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en ningun
worktree.

Feature: mobile-quick-actions-typography-lock (#81), branch: feature/81-mobile-quick-actions-typography-lock
Spec aprobada: specs/mobile-quick-actions-typography-lock/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-quick-actions-typography-lock/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene el
describe y los siete it literales, las seis mutaciones versionadas con sus
blobs, la tabla «Exigido» de las sondas, los greps de candado, los blobs
finales y los comandos.

== QUE HACES ==

SOLO TESTS. El diff acumulado de produccion es VACIO. Dos ficheros, los dos
bajo mobile-pet-tracker/src/screens/home/: index.test.tsx (el test) e
index.tsx (la Home, que SOLO se toca en los seis commits rojos y se revierte
en el verde siguiente).
  R1  la etiqueta de cada tile: className toBe
      'text-2xs font-semibold text-foreground' y style toBeUndefined.
      Mutacion roja: a1
  R2  cada tile con exactamente dos hijos host: icono en children[0], etiqueta
      en children[1], sin flex-row / row-reverse / col-reverse.
      Mutacion roja: b
  R3  cada tile con rounded-xl como unico token de radio y style
      toEqual({ borderCurve: 'continuous' }). Mutacion roja: e6
  R4  la seccion (dos hijos: rotulo y fila, 'gap-3', sin style), el rotulo sin
      style y la fila (los tres tiles como hijos directos, 'flex-row gap-3',
      sin style). Mutacion roja: e4
  R5  toHaveAccessibleName(label) en cada tile. Mutacion roja: e7
  R6  dos it: los tres tiles se pintan con el detalle de la mascota en error
      y con la actividad semanal en error. Mutacion roja: m6_both
  R7  cierre: sondas, greps de candado, tsc, eslint, blobs finales, reporte y
      traceability.md
No uses numeros de linea: localiza todo con los grep y las lineas literales
de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama; casilla de §Aprobacion marcada; router.d.ts; skill; los dos
          blobs de base (Home ff591a1f, test 234bd117); las dos medidas.
          Si un blob no coincide, PARA
  R1..R6  para cada uno, (1) commit ROJO con el test y la mutacion de la Home
          en el mismo commit, comprobando los dos blobs que da tasks.md, y
          (2) commit VERDE con `git checkout HEAD~1 --
          mobile-pet-tracker/src/screens/home/index.tsx` (desde la raiz), que
          devuelve la Home a ff591a1f. Cada rojo de R1 a R5 es el UNICO rojo
          de la suite, en su it de #81, por el matcher que dice tasks.md. El
          rojo de R6 son los DOS it de R6 y solo ellos, los dos POR CONSULTA
          (`Unable to find an element with testID: quick-actions-row`)
  Sondas  todas las de tasks.md §Sondas, UNA cada vez, con la suite completa:
          aplicar, comprobar el blob con git hash-object, medir, apuntar exit,
          cuentas, cada it rojo y la PRIMERA LINEA de su error, restaurar con
          `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
          y comprobar que `git status --porcelain -- mobile-pet-tracker` y
          `git diff --cached --name-only` salen vacios antes de la siguiente.
          `e10` DEBE dar verde: es composicion interior libre a proposito, no
          un fallo tuyo. `d` y `e11` dan rojos fuera de #81 a proposito. No
          se commitean
  R7      comprobaciones de cierre; reporte y traceability.md en el ultimo
          commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expose the quick action label recipe with a versioned mutation (R1)
  test(mobile): lock the quick action label recipe (R1)
  test(mobile): expose the quick action tile anatomy with a versioned mutation (R2)
  test(mobile): lock the quick action tile anatomy (R2)
  test(mobile): expose the quick action tile radius with a versioned mutation (R3)
  test(mobile): lock the quick action tile radius and continuous corner (R3)
  test(mobile): expose the quick actions section and row with a versioned mutation (R4)
  test(mobile): lock the quick actions section and row (R4)
  test(mobile): expose the quick action accessible names with a versioned mutation (R5)
  test(mobile): lock the quick action accessible names (R5)
  test(mobile): expose the quick actions render condition with a versioned mutation (R6)
  test(mobile): lock the quick actions render on detail and activity errors (R6)
  docs(mobile): record the quick actions lock evidence (R7)

Ficheros que cambian en el diff acumulado contra origin/main:
  mobile-pet-tracker/src/screens/home/index.test.tsx
  specs/mobile-quick-actions-typography-lock/traceability.md
  progress/impl_mobile-quick-actions-typography-lock.md
Nada mas. La Home aparece en la historia (doce commits) pero NO en el diff
acumulado: acaba en su blob de base ff591a1f.

== CIFRAS DE SUITE ==

origin/main no se ha movido desde la base de la spec (4efb6c81) y los blobs
de base coinciden (el leader lo comprobo al firmar), asi que las cifras de
tasks.md valen tal cual:
  base    86 suites / 1597 passed / 1 snapshot, exit=0; el test, 159
  rojo k  (k = 1..5) exit=1: 1 failed + (1596 + k) passed de (1597 + k)
  rojo R6 exit=1: 2 failed + 1602 passed de 1604
  cierre  86 suites / 1604 passed / 1 snapshot, exit=0; el test, 166
Si tu base no es 1597 (por ejemplo, porque #132 mergeo antes), anota la tuya y
aplica el mismo delta (+0 suites, +7 tests). Los rojos siguen siendo SOLO los
it nombrados; si falla cualquier otro, PARA.

Sondas «no validada en spec» (m5_one_1, m5_one_2, e8, e8b, m6_tile, m6_tile0,
m6_tile1, m6_tile2): su «Exigido» es un MINIMO. Los it que nombra tienen que
estar entre los rojos; cualquier rojo de mas lo anotas en el reporte sin
parar. Todas las demas sondas: si no dan exactamente su «Exigido», PARA y
reportalo con el log. No ajustes la asercion para que cuadre.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer).
- Skills: carga `building-native-ui` de tu plugin expo (es el nombre de TU
  catalogo v1.0.2; no busques expo-overview ni expo-native-ui, no existen en
  el tuyo). appllama-app-design-skill de .agents/skills/ NO aplica: no se
  disena ni se cambia una pantalla ni un flujo, solo se anaden tests. Di en el
  reporte que skills cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via b: la base ya cumple, asi que cada
  rojo versiona SU mutacion de produccion (a1, b, e6, e4, e7, m6_both) en el
  mismo commit que el test, y su verde la revierte con `git checkout HEAD~1 --`.
  Mutar un doble de test no vale. Cada rojo falla en su it por el matcher que
  dice tasks.md, nunca por otra asercion, otro test, un ReferenceError o un
  TypeError. Doce commits de codigo y uno de docs, no uno: tests + mutaciones
  + docs en un solo commit incumple C4.
- Los esperados son LITERALES del test: clases, testID, etiquetas y el objeto
  de style, escritos a mano. Ningun import nuevo en el test, y nada leido de
  la Home ni de src/theme/native-styles.ts.
- Los literales de tasks.md van TAL CUAL: describe, it, comentarios del test y
  las lineas de las mutaciones. Los blobs de control lo comprueban: si no
  coinciden, compara con el literal (sangria incluida) antes de seguir.
- Reglas de literales de tasks.md §Antes punto 7: la cita va siempre como
  `#81 R<n>`, NUNCA un `#81` suelto, tampoco en comentarios. Ni StyleSheet, ni
  text-[10px], ni ningun `-[`, ni colores hexadecimales.
- NO toques: la Home fuera de los seis commits rojos; los describe existentes
  del test (incluido el de #71 R1) y sus helpers y mocks (renderHome, makePet,
  makeDay, los mock* y el mock de reicon-react-native);
  src/screens/home/weekly-activity-chart.tsx y weekly-activity-chart.test.tsx
  (el segundo es de #132, que corre en paralelo en otro worktree);
  src/__tests__/ entero, incluido design-drift.test.ts; src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx; package.json; bun.lock;
  docs/ui-guidelines.md; ficheros nativos ni configuracion de la app. Cero
  dependencias nuevas.
- Rellena specs/mobile-quick-actions-typography-lock/traceability.md con los
  hashes, sin ninguna fila «pendiente». La fila de R7 cita el hash del VERDE de
  R6 (el ultimo commit de codigo). No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que tengas
  que contar va en progress/impl_mobile-quick-actions-typography-lock.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y eslint desde mobile-pet-tracker/. Los git add, git checkout y
  git diff desde la raiz del repo, con rutas mobile-pet-tracker/..., como
  indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-09-29).
- Jest del test siempre con --runTestsByPath src/screens/home/index.test.tsx
  (la ruta no tiene parentesis). Comprueba que imprime `Test Suites: 1`.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de resumen
  al reporte. Los 33 bloques `● Console` del log de la suite son ruido.
- Restaura SIEMPRE con `git checkout HEAD -- <ruta>`, nunca con
  `git checkout <commit> -- <ruta>` seguido de otro checkout: deja la mutacion
  en el indice. Ni git stash ni rm -f.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees. Se mide con bunx jest, bunx tsc --noEmit y
  bunx eslint.

Criterios de aceptacion: R1-R7 de requirements.md.

Al terminar, escribe progress/impl_mobile-quick-actions-typography-lock.md
con: pwd y branch; skills cargadas; la base medida y sus blobs; los commits
por R-id con hashes; cada rojo con su it, su matcher, `Expected` y `Received`
(o la linea de consulta en R6), y cada verde con sus cuentas y exit; la tabla
de todas las sondas con blob, exit, cuentas, cada it rojo, su matcher y si es
rojo por asercion o por consulta, en la columna «medido», marcando los rojos
de mas en las «no validada en spec»; los greps de R7.4 y R7.5 con su salida;
comandos y salidas exactas del cierre de R7; los blobs finales; el delta sobre
tu base; y cualquier decision que la spec no cerrara literalmente.
```
