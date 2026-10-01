# Handoff a Codex CLI — #127 + #128 mobile-classnames-own-tag-tree-lock

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 40e2c12d de esta branch, aprobacion via Notion el 2026-09-30). Tiene una
> sola casilla, la de §Aprobacion, ya marcada, que firma las dos entradas.
> No hay gate de dispositivo.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse HEAD` y pega las tres salidas al principio de
progress/impl_mobile-classnames-own-tag-tree-lock.md. El hash es H0 (tasks.md
§Antes de tocar nada, paso 1). Para si la branch no es
feature/127-mobile-classnames-own-tag-tree-lock.
No toques /home/claude/sites/Pet-Tracker (es de otra sesion, con #60),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en
ningun worktree.

Feature: mobile-classnames-own-tag-tree-lock (#127, con #128 en el mismo ciclo)
Branch: feature/127-mobile-classnames-own-tag-tree-lock
Spec aprobada: specs/mobile-classnames-own-tag-tree-lock/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-classnames-own-tag-tree-lock/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los ocho
bloques de test literales, las cuatro mutaciones rojas con su texto exacto,
los blobs de control de cada paso, las dos sustituciones de R5, la tabla de
§Sondas con su «Exigido», las cuentas de grep de R6 y los comandos. El
puntero de #128 (specs/mobile-delete-confirm-label-tree-lock/requirements.md)
solo remite a esta spec: no tiene nada que implementar.

== QUE HACES ==

Solo test, mas una seccion de docs/conventions.md. En el diff acumulado
cambian siete tests y la convencion:
  mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx
  mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx
  mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx
  mobile-pet-tracker/src/screens/reset-password/index.test.tsx
  mobile-pet-tracker/src/screens/health/index.test.tsx
  mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx
  mobile-pet-tracker/src/screens/reminders/index.test.tsx   (dos bloques: R3 y R4)
  docs/conventions.md                                        (R5)
Los siete ficheros de produccion de esos tests entran en los commits ROJOS
con una mutacion y salen en el VERDE siguiente con `git checkout HEAD~1 --`.
Su diff acumulado contra origin/main es VACIO.

  R1 (#127)  un describe `#127 R1: ...` al final de cada test de
             autenticacion (login, forgot, register, reset-password): el
             className entero del boton de envio con toBe. Mutacion P1red en
             los cuatro ficheros de produccion: rounded-xl sale del
             className y queda en una linea `// rounded-xl bg-accent` dentro
             del tag. Rojo: los CUATRO it de R1
  R2 (#127)  dos describe `#127 R2: ...` (salud y hero): el className de
             vaccines-skeleton con toBe; el className de pet-hero-skeleton
             con toBe y su style con toStrictEqual({ height: 260 }).
             Mutacion P2red en salud y hero. Rojo: los DOS it de R2
  R3 (#127)  un describe `#127 R3: ...` en recordatorios: { testID,
             className, style } de las tres pildoras con toStrictEqual.
             Mutacion P3red (= sonda P-week-l3, blob baa5baba). Rojo: 1 it
  R4 (#128)  un describe `#128 R4: ...` en recordatorios: el className de
             reminders-delete-confirm y el de su unica etiqueta «Eliminar»
             (within), con toBe. Mutacion P4red (= sonda D-c, blob
             74fe6d45). Rojo: 1 it, en la asercion de la etiqueta. El rojo
             es D-c y NO D-d a proposito: D-d da ademas dos rojos ajenos en
             ui-language.test.ts (requirements.md §Que firma el humano,
             punto 6)
  R5         las dos sustituciones exactas de tasks.md §R5 en
             docs/conventions.md, sin tocar nada mas del fichero
  R6         cierre: suite, tsc, eslint, cuentas de grep, diff, prefijo,
             blobs finales, sondas, reporte y traceability.md
No uses numeros de linea: localiza todo con los grep y las lineas literales
de tasks.md.

Orden EXACTO de tasks.md:
  Antes       rama y H0; casilla de §Aprobacion marcada; router.d.ts; sin
              skills; los 18 blobs de base; las dos medidas (las nueve y la
              suite). Si un blob no coincide, PARA
  R1..R4      por requisito, DOS commits: el ROJO (los bloques de test + la
              mutacion de produccion) y el VERDE (solo produccion, revertida
              con git checkout HEAD~1 --). Cada paso con su blob de control y
              su rojo medido en las nueve Y en la suite
  R5          un commit, solo docs/conventions.md, con su blob c34410e2
  Sondas      todas las de tasks.md §Sondas, UNA cada vez, sobre el arbol
              final, con el procedimiento de §Sondas (aplicar, git
              hash-object, medir con el comando de su columna «Comando»,
              anotar la PRIMERA LINEA de cada error y si es por asercion o
              por consulta, restaurar con el `git checkout HEAD -- <las siete
              rutas>` del paso 5, y los dos git diff --exit-code en 0). No
              se commitean
  R6          comprobaciones de cierre; reporte y traceability.md en el
              ultimo commit

Mensajes de commit, LITERALES y en este orden (diez commits):
  test(mobile): expose the auth submit recipes with a versioned mutation (R1)
  test(mobile): lock the auth submit buttons' className in the tree (R1)
  test(mobile): expose the skeleton recipes with a versioned mutation (R2)
  test(mobile): lock the vaccines and hero skeletons in the tree (R2)
  test(mobile): expose the summary pill recipe with a versioned mutation (R3)
  test(mobile): lock the three summary pills in the tree (R3)
  test(mobile): expose the delete-confirm label decoy with a versioned mutation (R4)
  test(mobile): lock the delete-confirm button and its label in the tree (R4)
  docs: close the opening-tag slice limits with the tree locks (R5)
  docs(mobile): record the own-tag tree lock evidence (R1,R2,R3,R4,R5,R6)

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`,
que coincide con el commit que anade este handoff):
  los siete tests de arriba
  docs/conventions.md
  specs/mobile-classnames-own-tag-tree-lock/traceability.md
  progress/impl_mobile-classnames-own-tag-tree-lock.md
Nada mas (diez ficheros, tasks.md §R6 paso 5). Los siete ficheros de
produccion aparecen en tus commits pero no en ese diff (acaban en su blob de
base). Lo demas que sale en el diff de la branch contra origin/main son
commits del leader, anteriores a ti.

== CIFRAS ==

La base de la branch es origin/main 886558db y el arbol de
mobile-pet-tracker/ es identico al suyo (el leader midio
`git diff --quiet origin/main HEAD -- mobile-pet-tracker` con exit=0 el
2026-10-01). La suite de 86 / 1626 la midio el leader con ./init.sh sobre
09d8047d (exit 0); el spec_author no la midio. Cuentas esperadas:
  base    nueve 212/212; suite 86 suites / 1626 tests, 1 snapshot, exit=0
  rojo R1 nueve 4 failed de 216 (4 suites); suite 4 failed de 1630
  verde   nueve 216/216
  rojo R2 nueve 2 failed de 218 (2 suites); suite 2 failed de 1632
  verde   nueve 218/218
  rojo R3 nueve 1 failed de 219; suite 1 failed de 1633
  verde   nueve 219/219
  rojo R4 nueve 1 failed de 220; suite 1 failed de 1634
  verde   nueve 220/220
  final   suite 86 suites / 1634 tests, exit=0 (delta +0 suites, +8 tests)
Tu medida manda: si la base no es 1626 con exit=0, anota la tuya y aplica
el mismo delta. Los rojos son SOLO los it nuevos que nombra tasks.md, y
todos POR ASERCION (`expect(received).toBe(expected)` o
`expect(received).toStrictEqual(expected)`), nunca por consulta,
ReferenceError ni TypeError. consistency-classnames.test.ts y
legibility-classnames.test.ts siguen en verde en los cuatro rojos. Si falla
cualquier otro test de la suite, PARA.

Sondas: si alguna no da exactamente su «Exigido», PARA y reportalo con el
log. No ajustes la asercion para que cuadre. Dan verde A PROPOSITO, y no son
fallos tuyos: Z-label y Z-child (las dos (F)) y Z-state2 ((D)). Z-state da
rojo 2 en dos describe previos (#62 R4 y #98 R10, por toEqual) y en ninguno
nuevo, a proposito: R1 no ve el estado de envio. B-login-h, V-h, S-h,
P-week-h, D-h, D-v y D-d dan tambien el rojo de describe previos que dice la
tabla, a proposito. Z-d-dup es la UNICA roja por consulta
(`Found multiple elements with text: Eliminar`).

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer).
- Skills: NO cargues ninguna skill de expo, ni del plugin ni de
  .agents/skills/. Ninguna de tu catalogo v1.0.2 aplica: la feature no
  cambia UI, son tests de jest sobre un arbol que ya existe, y todo lo que
  necesitas esta escrito en tasks.md. Di en el reporte que no cargaste
  ninguna.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via b: por requisito, un commit ROJO
  con los bloques de test y la mutacion versionada de produccion, y un
  commit VERDE que solo revierte produccion. Diez commits, no uno: tests +
  implementacion + docs en un solo commit incumple C4 (paso en #19).
- Los bloques de tasks.md van TAL CUAL, sin prettier: titulos, comentarios,
  sangria y literales. `describe(` va en la columna 0 y las lineas en blanco
  van vacias. Los blobs de control de cada paso lo comprueban: si no
  coinciden, compara con el literal antes de seguir. Ningun import nuevo ni
  helper nuevo.
- Reglas de literales de tasks.md §Antes punto 7 (design-drift escanea los
  tests): la cita va siempre como `#127 R1`, `#127 R2`, `#127 R3` o
  `#128 R4`, NUNCA `#127` ni `#128` sueltos, tampoco en comentarios, porque
  #68 R18 lo lee como un color hexadecimal. Ni StyleSheet, ni text-[10px],
  ni use-api/useApi. Las clases, los estilos y el texto esperados son
  literales del test: no importes PET_HERO_MEDIA_HEIGHT, CONTINUOUS_CORNER,
  el catalogo ni nada de produccion, ni leas su fuente para construirlos.
- Refactor: ninguno. No extraigas helpers ni listas compartidas entre los
  bloques nuevos. El beforeEach de R4 repite el de R3 a proposito.
- NO toques: los describe previos de los siete tests, sus helpers, mocks e
  imports (en particular el toContain('bg-danger') de confirmDelete);
  consistency-classnames.test.ts, legibility-classnames.test.ts y
  ui-language.test.ts; src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx;
  src/__tests__/ui-copy-table.ts; package.json; bun.lock; de
  docs/conventions.md, todo lo que no sean las dos sustituciones de R5; el
  puntero de #128; los ficheros de #60 (src/screens/add-pet/*,
  src/screens/profile/*, src/screens/map/*, src/components/pet-map.tsx y su
  test, app.json, app.config.ts, app.config.test.ts y
  src/__tests__/hosting-artifacts.test.ts). Cero dependencias nuevas y cero
  copy nueva.
- Rellena specs/mobile-classnames-own-tag-tree-lock/traceability.md con los
  hashes, sin ninguna fila «pendiente». R1 a R4 citan su rojo y su verde;
  R5 cita su commit en la columna verde; la fila de R6 cita el commit de R5
  (el ultimo con cambios fuera de progress/ y specs/), no el de evidencia.
  No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que
  tengas que contar va en progress/impl_mobile-classnames-own-tag-tree-lock.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y eslint desde mobile-pet-tracker/. Los git add, git checkout y
  git diff desde la raiz del repo, con rutas mobile-pet-tracker/..., como
  indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-10-01).
- Jest SIEMPRE con --runTestsByPath y las rutas con parentesis ENTRE
  COMILLAS, tal como estan en tasks.md: "(auth)" y "(tabs)" sin comillas ni
  --runTestsByPath son una regex y jest salta ficheros en silencio con
  exit=0. Comprueba que las nueve imprimen 9 suites y las 33, 33 suites.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve
  el codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte. Los bloques `● Console` del log son ruido.
- En las SONDAS restaura SIEMPRE con `git checkout HEAD -- <ruta>` (las siete
  rutas de produccion de tasks.md §Sondas paso 5), nunca con
  `git checkout <commit> -- <ruta>` seguido de otro checkout: deja la
  mutacion en el indice. Ni git stash ni rm -f. Tras cada sonda,
  `git diff --exit-code -- mobile-pet-tracker/src` y
  `git diff --cached --exit-code -- mobile-pet-tracker/src` en 0. (El
  `git checkout HEAD~1 --` de cada VERDE es otra cosa: ahi SI quieres el
  fichero de base en el indice para commitearlo.)
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son
  compartidos con la sesion de #60. Se mide con bunx jest, bunx tsc --noEmit
  y bunx eslint.

Criterios de aceptacion: R1-R6 de requirements.md.

Al terminar, escribe progress/impl_mobile-classnames-own-tag-tree-lock.md
con: pwd, branch y H0; skills cargadas (ninguna); la base medida y sus 18
blobs; los diez commits con hash y R-id; cada rojo con sus cuentas en las
nueve y en la suite, exit, sus it, su matcher, `Expected` y `Received`, y
cada verde con sus cuentas y exit; R5 con su blob y sus cuentas de grep; la
tabla de todas las sondas con blob, comando, exit, cuentas, cada it rojo, su
matcher y si es rojo por asercion o por consulta, en la columna «medido»;
las cuentas de grep de R6.4 con su salida; el diff --stat desde H0, el diff
de produccion y los siete cmp de prefijo con su exit; tsc y eslint con su
exit; los blobs finales; el delta sobre tu base; y cualquier decision que la
spec no cerrara literalmente.
```
