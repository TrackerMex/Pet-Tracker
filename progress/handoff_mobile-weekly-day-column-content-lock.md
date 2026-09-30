# Handoff a Codex CLI — #140 mobile-weekly-day-column-content-lock

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 68995488 de esta branch, aprobacion via Notion el 2026-09-30). Tiene una
> sola casilla, la de §Aprobacion, ya marcada. No hay gate de dispositivo.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-weekly-day-column-content-lock.md.
Para si la branch no es feature/140-mobile-weekly-day-column-content-lock.
No toques /home/claude/sites/Pet-Tracker (es de otra sesion, con #60),
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en
ningun worktree.

Feature: mobile-weekly-day-column-content-lock (#140)
Branch: feature/140-mobile-weekly-day-column-content-lock
Spec aprobada: specs/mobile-weekly-day-column-content-lock/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-weekly-day-column-content-lock/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los dos
bloques de test literales, las dos mutaciones con su linea exacta, los blobs
de control de cada paso, la tabla de §Sondas con su «Exigido», los greps de
R3 y los comandos.

== QUE HACES ==

Solo test. Un fichero de codigo cambia en el diff acumulado:
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
La grafica (src/screens/home/weekly-activity-chart.tsx) entra en los dos
commits ROJOS con una mutacion y sale en el VERDE siguiente con
`git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
Su diff acumulado contra origin/main es VACIO.

  R1  describe `#140 R1: ...`: los testID de los dos hijos host de cada una
      de las siete columnas, en orden (etiqueta, y valor o raya), en cinco
      estados, con toStrictEqual. Mutacion P1red: la sonda colswap (la
      etiqueta debajo del valor, blob 6214543c)
  R2  describe `#140 R2: ...`: el className de los dos hijos de cada
      columna, por posicion, en los mismos cinco estados, con
      toStrictEqual. Mutacion P2red: la sonda labelcolor (la etiqueta en
      text-foreground, blob f58f4903)
  R3  cierre: suite, tsc, eslint, greps de candado, blobs finales, sondas,
      reporte y traceability.md
No uses numeros de linea: localiza todo con los grep y las lineas literales
de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama; casilla de §Aprobacion marcada; router.d.ts; los dos blobs
          de base (grafica c258abed, test 416bf8b2); las dos medidas. Si un
          blob no coincide, PARA
  R1, R2  por requisito, DOS commits: el ROJO (el bloque de test + la
          mutacion de la grafica, los dos ficheros) y el VERDE (solo la
          grafica, revertida con git checkout HEAD~1 --). Cada paso con su
          blob de control y su rojo medido en la grafica Y en la suite
  Sondas  todas las de tasks.md §Sondas, UNA cada vez, sobre el arbol final,
          con el procedimiento de §Sondas (aplicar, git hash-object, medir,
          anotar la PRIMERA LINEA de cada error, restaurar con
          `git checkout HEAD -- <las dos rutas>`, y los dos git diff
          --exit-code en 0). No se commitean
  R3      comprobaciones de cierre; reporte y traceability.md en el ultimo
          commit

Mensajes de commit, LITERALES y en este orden (cinco commits):
  test(mobile): expose the weekly day column content order with a versioned mutation (R1)
  test(mobile): lock each weekly day column to its label and value in order (R1)
  test(mobile): expose the weekly day label colour with a versioned mutation (R2)
  test(mobile): lock the weekly day label, value and dash recipes (R2)
  docs(mobile): record the weekly day column content evidence (R1,R2,R3)

Ficheros que TU cambias, medidos desde el commit que anade este handoff
(`H=$(git log -1 --format=%H -- progress/handoff_mobile-weekly-day-column-content-lock.md)`,
luego `git diff --name-only $H..HEAD`):
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
  specs/mobile-weekly-day-column-content-lock/traceability.md
  progress/impl_mobile-weekly-day-column-content-lock.md
Nada mas. La grafica aparece en tus commits pero no en ese diff (acaba en su
blob de base). Lo demas que sale en el diff de la branch contra origin/main
son commits del leader, anteriores a ti.

== CIFRAS ==

La base de la branch es origin/main 0af5d921 y el arbol de
mobile-pet-tracker/ es identico al suyo (el leader midio
`git diff --quiet origin/main HEAD -- mobile-pet-tracker` con exit=0 y los
dos blobs de base el 2026-09-30). La suite de 86 / 1619 la midio el leader con
./init.sh sobre 0af5d921; el spec_author no la midio. Cuentas esperadas:
  base    grafica 53/53; suite 86 suites / 1619 tests, exit=0
  rojo R1 grafica 1 failed, 53 passed, 54 total; suite 1 failed de 1620
  verde   grafica 54/54
  rojo R2 grafica 1 failed, 54 passed, 55 total; suite 1 failed de 1621
  verde   grafica 55/55
  final   suite 86 suites / 1621 tests, exit=0 (delta +0 suites, +2 tests)
Tu medida manda: si la base no es 1619 con exit=0, anota la tuya y aplica
el mismo delta. Los rojos son SOLO los it que nombra tasks.md, por
toStrictEqual y POR ASERCION (`expect(received).toStrictEqual(expected)`),
nunca por consulta, ReferenceError ni TypeError; si falla cualquier otro
test de la suite, PARA.

Sondas: si alguna no da exactamente su «Exigido», PARA y reportalo con el
log. No ajustes la asercion para que cuadre. `nolabel` tiene un rojo POR
CONSULTA a proposito (#68 R3), `labeltag` rompe con Invariant Violation a
proposito, y las marcadas (D), (F) o (N) dan verde (o el rojo ajeno que
indica la tabla) a proposito: no son fallos tuyos.

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
  VERDE que solo revierte la grafica. Cinco commits, no uno: tests +
  implementacion + docs en un solo commit incumple C4 (paso en #19).
- Los bloques de tasks.md van TAL CUAL, sin prettier: titulos, comentarios,
  sangria y literales. Los blobs de control lo comprueban: si no coinciden,
  compara con el literal antes de seguir. Ningun import nuevo.
- Reglas de literales de tasks.md §Antes punto 7 (design-drift escanea el
  test): la cita va siempre como `#140 R<n>`, NUNCA `#140` suelto, tampoco en
  comentarios, porque la guarda lo lee como un color hexadecimal. Ni
  StyleSheet, ni text-[10px], ni use-api/useApi. Las tres clases esperadas de
  R2 son literales del test: no las importes ni las leas del fuente.
- toStrictEqual en las diez aserciones de R1 y R2, NUNCA toEqual: toEqual
  ignora un ultimo elemento undefined y deja pasar un hijo de mas (sonda
  loose). Y no cambies toEqual por toStrictEqual en #130 R2, #131 R3 ni
  #135 R4: eso es de otra entrada (#142).
- Refactor: ninguno. No extraigas helpers ni listas compartidas entre los
  bloques nuevos.
- NO toques: los describe de #68, #74, #130, #131, #132 y #135 del test, sus
  helpers, mocks e imports; la grafica fuera de los dos rojos;
  src/screens/home/index.tsx, su test y src/__tests__/ (entero);
  src/i18n/catalog.ts; src/providers/__tests__/language-provider.test.tsx;
  package.json; bun.lock; docs/. Cero dependencias nuevas y cero copy nueva.
- Rellena specs/mobile-weekly-day-column-content-lock/traceability.md con los
  hashes, sin ninguna fila «pendiente». Cada R cita su rojo y su verde; la
  fila de R3 cita el hash del VERDE de R2 (el ultimo commit de codigo), no el
  de docs. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que
  tengas que contar va en progress/impl_mobile-weekly-day-column-content-lock.md.
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

Criterios de aceptacion: R1-R3 de requirements.md.

Al terminar, escribe progress/impl_mobile-weekly-day-column-content-lock.md
con: pwd y branch; skills cargadas (ninguna); la base medida y sus blobs; los
cinco commits con hash y R-id; cada rojo con sus cuentas en la grafica y en
la suite, exit, su it, su matcher, `Expected` y `Received`, y cada verde con
sus cuentas y exit; la tabla de todas las sondas con blob, exit, cuentas,
cada it rojo, su matcher y si es rojo por asercion o por consulta, en la
columna «medido»; los greps de R3.4 y R3.5 con su salida; tsc y eslint con
su exit; los blobs finales; el delta sobre tu base; y cualquier decision que
la spec no cerrara literalmente.
```
