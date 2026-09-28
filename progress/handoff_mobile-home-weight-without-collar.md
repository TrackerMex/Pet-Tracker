# Handoff a Codex CLI — #77 mobile-home-weight-without-collar

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> `cf89df8e` de esta branch, aprobacion via Notion el 2026-09-27, junto con la
> Enmienda #77 a #69 R7).

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-home-weight-without-collar.md.
Para si la branch no es feature/77-mobile-home-weight-without-collar.
No toques /home/claude/sites/Pet-Tracker, Pet-Tracker-wt-ui, pet-tracker-43 ni
pt-skills (son otros worktrees con otras sesiones; en Pet-Tracker se trabaja
#120 ahora mismo) ni cambies de branch en ningun worktree.

Feature: mobile-home-weight-without-collar (#77), branch: feature/77-mobile-home-weight-without-collar
Spec aprobada: specs/mobile-home-weight-without-collar/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-home-weight-without-collar/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los tres
describe literales, los dos verdes de produccion, la mutacion V3, las sondas y
los comandos de cierre. El Contrato de requirements.md es el estado final
exacto de index.tsx.

== QUE HACES ==

Hoy, en la Home, la tira «Resumen de hoy» solo se pinta con la actividad en
`ok`: sin collar (o con la actividad en error) desaparece tambien la celda de
peso, que no depende de la actividad. #77 pinta la celda de peso en los
estados `no-tracking`, `error`, `unreachable` y `missing-config`, en la misma
fila y seguida de la nota (`summary-note`), que pasa a vivir dentro de la fila.
Cero peticiones nuevas, cero claves de catalogo, cero dependencias.
  R1  el peso se pinta aunque la actividad no este disponible
  R2  sin actividad, la fila es la celda de peso seguida de la nota
  R3  la fila no se pinta sin sesion ni mientras carga la actividad
      (requisito de verificacion: rojo por la mutacion de produccion V3,
      versionada en el rojo y revertida en el verde; CHECKPOINTS C4 via b)
  R4  smoke del humano en dev build de Android. NO es tuyo, no lo marques
No uses numeros de linea: localiza todo con los grep de tasks.md.

Orden EXACTO de tasks.md. Un commit por paso, test primero, NUNCA test e
implementacion en el mismo commit (en #19 Codex metio todo en uno y eso
incumple C4 de CHECKPOINTS.md):
  R1 rojo   solo index.test.tsx: el describe `#77 R1` literal, inmediatamente
            antes de `describe('R10: last position enlaza al mapa', () => {`.
            Fallan 7 (4 filas del it.each + 3 it), TODOS por
            `Unable to find an element with testID: summary-weight`.
            Fichero: 153 (146 + 7), 7 failed
  R1 verde  solo index.tsx: la guarda de la fila (la linea
            `{activity.data?.kind === 'ok' ? (` inmediatamente anterior a
            `<View className="flex-row">`; la otra identica, la de
            `<WeeklyActivityChart`, NO se toca) y las celdas Walk/Moon/Map
            envueltas en `{activity.data.kind === 'ok' ? ( <> ... </> ) : null}`.
            Las dos notas sueltas se quedan en este commit. 153/153
  R2 rojo   solo index.test.tsx: el describe `#77 R2` literal, justo despues
            del de R1. Fallan 4 (las 4 filas), por
            `expect(rowChildren).toHaveLength(2)`, recibido 1. Fichero: 157
  R2 verde  solo index.tsx: borrar los dos bloques de nota sueltos y cambiar el
            `) : null}` del ternario de R1 por la rama de la nota de tasks.md.
            index.tsx queda identico al Contrato. 157/157
  R3 rojo   index.test.tsx (describe `#77 R3` literal, justo despues del de R2)
            + index.tsx con la mutacion V3 (tres sustituciones, tasks.md §R3).
            Fallan SOLO los 2 it de `#77 R3`, por `toBeNull` (recibido
            summary-weight). Fichero: 159, 2 failed. Cuerpo del commit literal
            de tasks.md
  R3 verde  solo index.tsx: revertir V3 exactamente.
            `git diff --exit-code <hash del verde de R2> HEAD -- mobile-pet-tracker/src/screens/home/index.tsx; echo "exit=$?"`
            -> exit=0. 159/159
  Sondas    M1-M5, N1-N19, V3a y V3b (tasks.md §Sondas) sobre el verde de R3.
            No se commitean. Cada una: aplicar, medir, apuntar, REVERTIR, y
            `git diff --exit-code -- src/screens/home/index.tsx; echo "exit=$?"`
            -> exit=0 antes de la siguiente
  Cierre    tasks.md §Cierre; reporte + traceability.md en el ultimo commit

Si un rojo cae por otra causa (otra asercion, otro test, un ReferenceError, un
TypeError, tsc en rojo), PARA y reportalo con el log. No ajustes el test.

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expose the weight cell without activity (R1)
  feat(mobile): paint the weight cell when activity is unavailable (R1)
  test(mobile): compose the weight cell and the activity note in one row (R2)
  feat(mobile): move the activity note into the stats row (R2)
  test(mobile): lock the stats row out of loading and expired sessions (R3)
      (con el cuerpo literal de tasks.md: `Versions the V3 production
      mutation (CHECKPOINTS C4, route b); the next commit reverts it.`)
  fix(mobile): restore the stats row gate (R3)
  docs(mobile): fill #77 traceability

Ficheros que cambian en el diff acumulado:
  mobile-pet-tracker/src/screens/home/index.tsx
  mobile-pet-tracker/src/screens/home/index.test.tsx
  specs/mobile-home-weight-without-collar/traceability.md
  progress/impl_mobile-home-weight-without-collar.md
Nada mas. Los dos ultimos, solo en el commit final `docs(mobile): ...`.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer): className con Uniwind,
  nada de estilos en linea ni StyleSheet, ningun hex ni clase arbitraria.
- Skills: carga `building-native-ui` (plugin expo de tu catalogo, v1.0.2) y
  `appllama-app-design-skill` (de .agents/skills/, obligatoria por la carta al
  cambiar una pantalla). No pidas `expo-overview` ni `expo-native-ui`: no
  existen en tu catalogo. Las decisiones de diseno ya estan cerradas en la
  spec (D1-D8): las skills son contexto, no te autorizan a cambiar clases,
  anatomia ni copy. Di en el reporte cuales cargaste.
- Copia los tres describe LITERALES de tasks.md. Los valores esperados son
  literales ('--color-muted', '12.4 kg', los testID, las clases): no los
  calcules con nada importado de produccion.
- No anadas imports ni jest.mock: todo lo que usan los describe ya esta en el
  fichero. Sin helper ni refactor.
- En index.test.tsx NO escribas `#` + numero salvo como `#77 R<n>`: una cita
  suelta pone rojos los guards de src/__tests__/design-drift.test.ts. Ni
  `StyleSheet` ni nada de la forma `<palabra>-[`. Los literales de tasks.md ya
  pasan esos guards.
- En index.tsx: sin comentarios nuevos. Los `{/* ... */}` del Contrato y de
  tasks.md son abreviaturas de la spec, NO se escriben: ahi va el codigo de
  hoy, sin cambios salvo la sangria.
- NO toques: los siete it de `describe('R9: summary degrada con gracia'`, el
  describe `#69 R1` (incluido `#126 R1` anidado y la cuenta 4 de `#69 R9`), el
  resto de la Home, src/i18n/catalog.ts, src/screens/home/format.ts,
  src/api/activity.ts, docs/conventions.md, docs/ui-guidelines.md,
  global.css, specs/mobile-home-stats-strip/requirements.md (su enmienda ya
  esta firmada), package.json, bun.lock. Cero dependencias nuevas.
- Si una sonda no da los rojos de la tabla de requirements.md, PARA y
  reportalo con el log. Las tablas cuentan sobre 157; con #126 en la base
  (159) una sonda puede sumar algun rojo de `#126 R1`: lo que tiene que
  cuadrar es que esten TODOS los rojos listados. N19 es el control: su unico
  rojo es `#69 R9`.
- Rellena specs/mobile-home-weight-without-collar/traceability.md con los seis
  hashes TDD, sin ninguna «pendiente», en el commit final. No rebasees
  despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader, que los escribe
  despues del veredicto del reviewer. Todo lo que tengas que contar va en
  progress/impl_mobile-home-weight-without-collar.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y lint desde mobile-pet-tracker/ (los candados abren rutas
  relativas a process.cwd()). Los git y grep con rutas mobile-pet-tracker/...
  desde la raiz del repo, como indica tasks.md. bun / bunx. Nunca npx, nunca
  npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-09-28).
- Jest siempre con --runTestsByPath, salvo la suite completa. Comprueba que
  jest imprime `Test Suites: 1`. Sin `--json`: con los `toBe` entre elementos
  del arbol de R2 el reporter revienta al serializar.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees. Se mide con bunx jest, bun run typecheck y
  bun run lint.

== BASE Y CIERRE ==

Base: e9413a6e (origin/main con #126 mergeado; encima solo hay commits de
spec y progress). Medido por el leader el 2026-09-28, sin pipe:
  git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.tsx
    -> dbb5b0346895cfc26705bee2257d1f8a8815df6c (si es otro, PARA)
  git rev-parse HEAD:mobile-pet-tracker/src/screens/home/index.test.tsx
    -> 22adaad0efee536b46c058a9646df7705c830b2a
  src/screens/home/index.test.tsx -> 146 tests, exit=0
  bun run --cwd mobile-pet-tracker test -> 83 suites, 1532 tests, exit=0
Vuelve a medirla al empezar (tasks.md §Antes de empezar). Si difiere porque
otra feature mergeo, vale TU base: el gate es el delta.
Cierre esperado: Home 159 (base + 13); suite 83 / 1545 (+0 suites, +13
tests); typecheck y lint exit=0; los greps de tasks.md §Cierre con el
resultado indicado; `git diff --stat origin/main...HEAD -- mobile-pet-tracker`
con exactamente index.tsx e index.test.tsx.

Criterios de aceptacion: R1-R3 de requirements.md (R4 es del humano).

Al terminar, escribe progress/impl_mobile-home-weight-without-collar.md con:
pwd y branch; skills cargadas; la base medida (blobs y recuentos); los commits
por R-id con hashes; cada rojo con sus fallos, `Expected` y `Received`; la
tabla de sondas M1-M5, N1-N19, V3a y V3b con rojos esperados, rojos medidos y
cuales; los comandos y salidas exactas del cierre; el delta; y cualquier
decision que la spec no cerrara literalmente.
```

---

## Reanudacion 1 (2026-09-28): el rojo de la base es un flake ajeno

Codex paro en la base, antes de cualquier commit, por un rojo en la suite
completa: `src/app/(tabs)/__tests__/food.test.tsx` ›
`R4: food resuelve la mascota seleccionada › keeps API order and selects the first pet by default`,
`expect(mockGetNutritionPlan).toHaveBeenCalledWith(...)`, `Number of calls: 0`
(su reporte, `progress/impl_mobile-home-weight-without-collar.md`). Parar fue
correcto. El leader lo midio a las 02:19-02:22 UTC en este worktree, sin
cambios en el arbol:

- `food.test.tsx` solo, 10 corridas: 10/10 verdes (56/56, exit=0).
- Suite movil completa, 3 corridas borrando `/tmp/jest_ru/perf-cache-*` antes
  de cada una (para que el sequencer no adelante el fichero rojo): 3/3 verdes
  (83 suites, 1532 tests, exit=0).
- Causa probable, de la misma familia que `docs/conventions.md` §Esperas sobre
  el arbol renderizado: el `waitFor` termina con los chips pintados y el chip
  `pet-1` seleccionado, y despues asevera el contador de un mock. La query del
  plan se activa con `enabled: selectedPetId !== null` y TanStack Query la
  lanza de forma asincrona, asi que el chip puede estar seleccionado antes de
  la llamada. Con la maquina cargada (hay otras sesiones corriendo jest) cae.
  No lo toca #77: #77 solo cambia `src/screens/home/`.

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA
Confirma `pwd` y `git branch --show-current` otra vez y anadelo al reporte.

Reanuda #77 segun progress/handoff_mobile-home-weight-without-collar.md
(el bloque original sigue valiendo entero) con estos cambios:

1. La base es valida. El rojo de food.test.tsx es un flake ajeno: el leader
   lo midio en la seccion «Reanudacion 1» de ese fichero (10/10 del fichero
   solo, 3/3 de la suite). Deja tu medicion de base en el reporte tal cual y
   anade una linea que cite esa seccion. No vuelvas a medir la base: empieza
   por el commit rojo de R1.
2. NO toques src/app/(tabs)/__tests__/food.test.tsx ni src/app/(tabs)/food.tsx.
3. En la suite completa del cierre: si el UNICO rojo es exactamente ese test
   (`keeps API order and selects the first pet by default`, con
   `Number of calls: 0`), no pares. Vuelve a correr la suite una vez, sin
   tocar nada, y copia al reporte las lineas de resumen de las dos corridas.
   Si cae cualquier otro test, o ese mismo dos veces seguidas, PARA y
   reportalo con el log.
4. Las corridas de un solo fichero (la Home) no cambian: cualquier rojo que
   no sea el esperado de un commit rojo te para, como antes.
5. Skills: `ponytail` no la pidio el handoff. Si la mantienes, los literales
   de tasks.md y el Contrato de requirements.md mandan: nada de simplificar,
   fundir ni reordenar los describe, los verdes ni la mutacion V3.
```

---

## Reanudacion 2 (2026-09-28): Enmienda 1, R5

R1-R3 estan hechos y el leader los valido (hasta `3e4edd13`, `docs(mobile):
fill #77 traceability`). El humano pidio cerrar el flake de `food.test.tsx`
dentro de #77: es la **Enmienda 1 (R5)** de `requirements.md`, firmada en su
casilla propia (§Enmienda 1 › Firma de la Enmienda 1). Deja sin efecto los
puntos 2 y 3 de la «Reanudacion 1»: ahora `food.test.tsx` y `food.tsx` si se
tocan, y en la suite completa ya **no se tolera ningun rojo**.

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Confirma `pwd` y `git branch --show-current` otra vez y anadelo al reporte.
Para si la branch no es feature/77-mobile-home-weight-without-collar.
No toques /home/claude/sites/Pet-Tracker, Pet-Tracker-wt-ui, Pet-Tracker-wt-77amend,
pet-tracker-43 ni pt-skills, ni cambies de branch en ningun worktree.

Reanuda #77 con la Enmienda 1 (R5). El bloque original y la «Reanudacion 1»
de progress/handoff_mobile-home-weight-without-collar.md siguen valiendo,
SALVO sus puntos 2 y 3, que esta reanudacion sustituye.

Lee enteros, antes de tocar nada:
  specs/mobile-home-weight-without-collar/requirements.md §«Enmienda 1 — R5»
    (mecanismo, EARS de R5, tabla de mediciones, inventario, que firma)
  specs/mobile-home-weight-without-collar/design.md D9
  specs/mobile-home-weight-without-collar/tasks.md §R5 y §Cierre
tasks.md §R5 es tu guion: tiene la mutacion Q1 literal, el diff literal del
test, los tres commits, las sondas Q2-Q4, la fila literal de traceability y
todos los comandos. No uses numeros de linea: localiza con los grep de tasks.

== QUE HACES ==

El test `R4: food resuelve la mascota seleccionada › keeps API order and
selects the first pet by default` (src/app/(tabs)/__tests__/food.test.tsx)
asevera `mockGetNutritionPlan` FUERA de su waitFor, y la llamada llega una
tarea despues del commit que selecciona el chip: flake. R5 mete esa asercion
dentro del waitFor. La produccion (src/app/(tabs)/food.tsx) no cambia: su
diff final contra origin/main es VACIO.

Orden EXACTO, un commit por paso, test primero:
  Antes     tasks.md §R5 «Antes del rojo de R5»: blobs e310ff45... de food.tsx
            y abc6ad15... de food.test.tsx (si alguno difiere, PARA), los
            grep de ancla, guard 9, `#77 R5` 0, y el fichero en 56 passed
  (1) rojo  SOLO food.tsx: la mutacion Q1 literal de tasks.md. Mensaje
            `test(mobile): expose the food nutrition plan race (R5)` con el
            cuerpo literal de tasks.md. Fichero: 1 failed, 55 passed; el
            unico rojo es ese it, `Number of calls: 0`. Si cae otro (sobre
            todo uno de `#98 R6`), PARA. Con Q1: tsc exit 0 y las 5 suites de
            candados de tasks.md, 173 tests, exit 0
  (2) verde SOLO food.test.tsx, CON Q1 TODAVIA PUESTA: el diff literal de
            tasks.md (6 inserciones, 5 borrados). Mensaje
            `test(mobile): wait for the nutrition plan call with the pet chips (R5)`.
            56 passed; tsc y lint exit 0; greps del test de tasks.md
  (3) revert SOLO food.tsx: revertir Q1 EXACTAMENTE. Mensaje
            `fix(mobile): drop the nutrition plan delay (R5)`. Las tres
            comprobaciones de tasks.md (diff vacio, control --stat 8/1, blob
            e310ff45...). 56 passed
  Sondas    Q2, Q3, Q4 sobre el revert. No se commitean. Cada una: aplicar,
            medir con -t, apuntar, REVERTIR, y
            `git diff --exit-code -- 'src/app/(tabs)/food.tsx'; echo "exit=$?"`
            -> exit=0 antes de la siguiente. Las tres: exit=1, 1 failed,
            55 skipped, con la firma de tasks.md
  Cierre    tasks.md §Cierre ENTERO otra vez (Home 159, suite 83 / 1545,
            food 56, typecheck, lint, todos los greps, incluidos los de
            Enmienda 1 y el --stat con ':/mobile-pet-tracker')
  (4) traza `docs(mobile): trace #77 R5`, SIEMPRE el ultimo commit: la fila
            literal de R5 debajo de la de R4 en traceability.md, con los tres
            hashes COMPLETOS (40 caracteres), y una seccion
            `## R5 (Enmienda 1)` al final de
            progress/impl_mobile-home-weight-without-collar.md

Ficheros que cambian en estos cuatro commits, y nada mas:
  mobile-pet-tracker/src/app/(tabs)/food.tsx            (solo en (1) y (3))
  mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx   (solo en (2))
  specs/mobile-home-weight-without-collar/traceability.md     (solo en (4))
  progress/impl_mobile-home-weight-without-collar.md          (solo en (4))

== REGLAS CRITICAS ==

- Suite completa del cierre: con el verde de R5 en la branch NO se tolera
  ningun rojo. Si cae `keeps API order and selects the first pet by default`
  o cualquier otro, PARA, guarda el log ENTERO y reportalo. No repitas la
  corrida para buscar un verde.
- No renombres el it, no anadas helper, no toques el beforeEach de `R4`,
  `asyncUtilTimeout`, `testTimeout` ni ningun otro it de food.test.tsx.
- En food.test.tsx NO escribas `#` + numero salvo como `#77 R5` (el guard
  `grep -cP '#[0-9]++(?! R[0-9])'` debe seguir en 9). Ni `StyleSheet` ni
  `<palabra>-[`.
- No toques index.tsx ni index.test.tsx de la Home, ni las filas R1-R4 de
  traceability.md, ni las secciones existentes del reporte (solo anades la
  de R5). No rebasees, no reescribas commits ya hechos.
- Rutas en git: desde mobile-pet-tracker/, `-- mobile-pet-tracker/...` no
  casa con nada y git sale con exit 0 en silencio. Usa la magia `:/`
  (`':/mobile-pet-tracker/...'`) como indica tasks.md, y cita entre comillas
  toda ruta con `(tabs)`.
- Skills: `building-native-ui` (plugin expo de tu catalogo, v1.0.2). No pidas
  `expo-overview` ni `expo-native-ui`: no existen en tu catalogo. R5 no
  cambia ninguna pantalla, asi que `appllama-app-design-skill` no hace falta.
  Di en el reporte cuales cargaste.
- NO son tuyos: progress/history.md, progress/current.md, STATUS.md,
  feature_list.json, requirements.md, design.md y tasks.md.
- Si el sandbox te deniega un comando, PARA y reportalo.
- NO abras la PR ni hagas push.

== ENTORNO ==

- Jest, tsc y lint desde mobile-pet-tracker/. bun / bunx; nunca npx ni
  npm i -g.
- Antes de cada `bunx tsc --noEmit` o `bun run typecheck`:
  `test ! -e .expo/types/router.d.ts; echo "exit=$?"`. exit=0: sigue.
  exit=1: PARA y reportalo. Nunca `rm -f`.
- Jest con --runTestsByPath y la ruta entre comillas simples:
  `'src/app/(tabs)/__tests__/food.test.tsx'`. Sin comillas, los parentesis
  son regex y jest salta el fichero con exit 0: comprueba que imprime
  `Test Suites: 1` y el recuento 56 escrito.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack.

Al terminar, la seccion `## R5 (Enmienda 1)` del reporte lleva: pwd y
branch; skills cargadas; la base de food (blobs, greps, 56); los cuatro
commits con hash; el rojo con `Expected`/`Received` y `Number of calls`; el
verde; las tres comprobaciones del revert; la tabla de sondas Q2-Q4
(esperado, medido, firma); y las salidas exactas del cierre.
```
