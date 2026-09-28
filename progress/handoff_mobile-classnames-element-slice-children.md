# Handoff a Codex CLI — #120 mobile-classnames-element-slice-children

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> d413d168 de esta branch, aprobacion via Notion el 2026-09-27).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-classnames-element-slice-children.md.
Para si la branch no es feature/120-mobile-classnames-element-slice-children.
No toques /home/claude/sites/Pet-Tracker-wt-backend, Pet-Tracker-wt-77amend,
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills (son otros worktrees con otras
sesiones) ni cambies de branch en ningun worktree.

Feature: mobile-classnames-element-slice-children (#120), branch: feature/120-mobile-classnames-element-slice-children
Spec aprobada: specs/mobile-classnames-element-slice-children/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-classnames-element-slice-children/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene el helper
literal, los cuatro call-sites de R1, el it literal de R2, las dos mutaciones
versionadas con sus blobs, la tabla «Exigido» de las 26 sondas de R3, los tres
cambios literales de docs/conventions.md de R4, los blobs finales y los
comandos. Los moldes de C4 via b son #124 y #126, ya mergeadas.

== QUE HACES ==

Un cambio SOLO de test y docs. Los dos candados de fuente
src/__tests__/consistency-classnames.test.ts y legibility-classnames.test.ts
recortan con elementWithTestId(source, testId, closingTag), que va del ancla
testID="…" al closingTag y deja los HIJOS dentro: quitar rounded-xl del tag de
pill-active y ponerlo en un hijo <View className="rounded-xl" /> da verde
(sonda P-active-h, 79/79 hoy). La defensa:
  R1  consistency: helper nuevo openingTagWithTestId(source, testId) (literal de
      tasks.md §R1 (1).1: ancla con toBeGreaterThan(-1), unicidad con
      lastIndexOf toBe, recorte de < a < cortado con .split('/>')[0]),
      elementWithTestId desaparece del fichero y los cuatro call-sites CS1-CS4
      lo usan, con titulos que acaban en `en su tag de apertura (#120 R1)`.
      Aserciones byte a byte iguales
  R2  legibility: elementWithTestId SE QUEDA; se anade la copia #120 R2 del
      helper, el comentario #120 R2 encima de `const deleteConfirm =
      elementWithTestId(` y el tercer it del describe #61 R1 se sustituye por el
      literal de tasks.md §R2 (1).3 (variant="danger" y bg-danger en el tag,
      t('reminders.delete') en el bloque)
  R3  las 26 sondas de tasks.md §R3 sobre el verde de R1+R2. No se commitean
  R4  los tres cambios literales de docs/conventions.md (vineta, frase «Los
      tres…», parrafo nuevo)
  R5  cierre: diff de produccion vacio, +0 suites y +0 tests; reporte y
      traceability.md en el ultimo commit
No uses numeros de linea: localiza todo con los grep de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama, router.d.ts, los cuatro blobs de base y las dos medidas
          (candados 79/79; suite 83/1532/1). Si un blob no coincide, PARA
  R1 (0)  P-active-h en src/screens/reminders/index.tsx con los tests sin tocar
          -> blob 2b43ab8f, candados VERDE 79/79. Guarda el log: es la prueba
          del agujero. NO reviertas
  R1 (1)  commit ROJO: consistency con el helper y CS1-CS4 (blob 07cc45b4) +
          P-active-h puesta. Candados 1 failed / 78 passed; suite 1 failed /
          1531 passed. UNICO rojo: `#62 R4: la app solo usa los radios de la
          escala declarada › lleva las tres píldoras de resumen de reminders a
          rounded-xl en su tag de apertura (#120 R1)`, por
          expect(received).toContain
  R1 (2)  commit VERDE: `git checkout HEAD~1 --
          mobile-pet-tracker/src/screens/reminders/index.tsx` (desde la raiz).
          Blob 8fbcd07c; candados 79/79
  R2 (1)  commit ROJO: legibility con la copia del helper, el comentario y el it
          nuevo (blob 8c42a105) + la mutacion D-v (blob f136e971). Candados
          1 failed / 78 passed; suite 1 failed / 1531 passed. UNICO rojo:
          `#61 R1: la etiqueta destructiva usa el token de danger › conserva
          variant, testID y texto del botón, con variant y bg-danger en su tag
          de apertura (#120 R2)`, por expect(received).toContain
  R2 (2)  commit VERDE: `git checkout HEAD~1 --
          mobile-pet-tracker/src/screens/reminders/index.tsx`. Blob 8fbcd07c;
          candados 79/79
  R3      las 26 sondas, UNA cada vez: aplicar, comprobar el blob de la tabla,
          medir los candados, apuntar exit, cuentas, cada it rojo y su matcher,
          `git checkout -- <ruta>`, y `git diff --exit-code --
          mobile-pet-tracker/src` en 0 antes de la siguiente
  R4      los tres cambios de docs/conventions.md (blob e1f8a5ab) y sus greps.
          Un commit de docs con ese fichero
  R5      comprobaciones de cierre; reporte y traceability.md en el ultimo commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expose the child hole of the classnames element slice (R1)
  test(mobile): read own-tag classnames from the opening tag (R1)
  test(mobile): expose the child hole of the delete confirm tag lock (R2)
  test(mobile): read the delete confirm props from its opening tag (R2)
  docs(mobile): document the self-closing cut and the subtree exception (R4)
  docs(mobile): record the classnames slice probe evidence (R3,R5)

Ficheros que cambian en el diff acumulado:
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
  docs/conventions.md
  specs/mobile-classnames-element-slice-children/traceability.md
  progress/impl_mobile-classnames-element-slice-children.md
Nada mas. src/screens/reminders/index.tsx solo se toca en los dos commits rojos
y se revierte en su verde; en el acumulado queda identico a origin/main.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md
  (§Recortes del tag de apertura en candados de fuente es la que tocas). UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer), aunque aqui no hay UI.
- Skills: NO cargues ninguna. Ni las del plugin expo (en tu catalogo v1.0.2
  ninguna de las 13 aplica a un candado de jest que lee fuente) ni las de
  .agents/skills/ (appllama-app-design-skill es obligatoria solo al disenar o
  cambiar una pantalla o un flujo, y aqui no se toca ninguna). La guia esta
  entera en tasks.md. Di en el reporte que no cargaste ninguna.
- TEST PRIMERO (C4 de CHECKPOINTS.md, via b): cada rojo versiona SU mutacion
  de produccion (P-active-h en R1, D-v en R2) y su verde la revierte con
  `git checkout HEAD~1 --`. Mutar un doble no vale. Cada rojo falla por SU
  asercion (toContain en el it nombrado arriba), nunca por otra asercion, otro
  test, un ReferenceError o un TypeError. Si falla por otra cosa, PARA.
  Cuatro commits de test, no uno: tests + implementacion + docs en un solo
  commit incumple C4.
- NO uses D-h como rojo de R2: hoy ya la paran nueve tests de
  src/screens/reminders/index.test.tsx y el rojo fallaria por mas cosas.
- Los esperados son LITERALES del test ('rounded-xl', 'bg-danger',
  'variant="danger"', los testID...). Nada importado de produccion.
- Los literales de tasks.md van TAL CUAL: helper, comentarios, titulos, it de
  R2 y los tres textos de conventions.md. Los blobs de control (07cc45b4,
  8c42a105, e1f8a5ab) lo comprueban: si no coinciden, compara con el literal
  antes de seguir.
- No anadas imports ni helpers aparte de openingTagWithTestId: readFileSync,
  join, expect y readSource ya estan en los dos ficheros. No crees un modulo
  compartido: el helper va duplicado a proposito.
- NO toques: los demas describe de los dos ficheros; sourceFiles, filesMatching
  y readSource; en legibility, los otros dos it del describe #61 R1 y los
  describe #61 R3, #61 R4 y #61 R5; src/screens/home/index.tsx e index.test.tsx
  (la sesion Backend trabaja #77 ahi) ni los candados de fichero entero que los
  leen (#61 R4, #61 R5, #62 R14, #62 R15, #98 R10, #64 R9);
  src/__tests__/design-drift.test.ts; src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx; package.json; bun.lock.
  Cero dependencias nuevas.
- Si una sonda de R3 no da el veredicto «Exigido», PARA y reportalo con el log.
  No ajustes el test para que cuadre. P-week-j, P-week-f, P-week-l3 y D-d
  DEBEN quedar en verde (79/79): son el limite documentado. B-login-n da 2
  rojos (no 3) y S-n da verde: son cambios declarados, no fallos.
- Rellena specs/mobile-classnames-element-slice-children/traceability.md: las
  cinco filas, sin ninguna «pendiente» (R1 y R2 rojo -> verde; R3 y R5 con el
  commit del reporte; R4 con su commit de docs; lo que ya dice N/A se queda).
  No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que tengas
  que contar va en progress/impl_mobile-classnames-element-slice-children.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y eslint desde mobile-pet-tracker/ (los candados abren rutas
  relativas a process.cwd()). Los git add, git checkout, git diff y los grep de
  docs/ desde la raiz del repo, con rutas mobile-pet-tracker/... o docs/...,
  como indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-09-28).
- Jest siempre con --runTestsByPath, salvo la suite completa: `(auth)` sin
  escapar es una regex y el fichero se salta en silencio con exit=0. Comprueba
  que el comando de los candados imprime `Test Suites: 2`.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de resumen
  al reporte.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees. Se mide con bunx jest, bunx tsc --noEmit y
  bunx eslint.

== BASE Y CIERRE ==

Base en 42db1ccf (origin/main e9413a6e + progress). Encima solo hay commits de
spec, progress y la firma. Vuelve a medirla al empezar sobre el HEAD de la
branch. Blobs de partida re-medidos por el leader el 2026-09-28 sobre d413d168:
consistency-classnames.test.ts 5df906f8, legibility-classnames.test.ts
890432e7, src/screens/reminders/index.tsx 8fbcd07c, docs/conventions.md
bb2ca08e.
  los dos candados -> 79 tests (consistency 53, legibility 26), exit=0
  bunx jest -> 83 suites, 1532 tests, 1 snapshot, exit=0
  bunx tsc --noEmit y bunx eslint de los dos ficheros -> exit=0
Si tu suite difiere porque otra feature mergeo, vale TU base: el gate es el
delta. Cierre esperado: +0 suites y +0 tests; tsc y eslint con exit=0; los
greps de tasks.md §R4 con el resultado indicado; los tres git diff de tasks.md
§R5.4 en 0 / solo los dos tests; los blobs finales de tasks.md §R5.5.

Criterios de aceptacion: R1-R5 de requirements.md.

Al terminar, escribe progress/impl_mobile-classnames-element-slice-children.md
con: pwd y branch; skills cargadas (ninguna); la base medida y sus blobs; el log
de R1 (0) y su blob; los commits por R-id con hashes; los dos rojos con su it,
`Expected` y `Received`, y los dos verdes; la tabla de las 26 sondas de R3 con
exit, cuentas, cada it rojo y su matcher en la columna «tras #120»; los greps
de R4 con su salida; comandos y salidas exactas del cierre de R5; los blobs
finales; el delta; y cualquier decision que la spec no cerrara literalmente.
```
