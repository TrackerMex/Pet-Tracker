# Handoff a Codex CLI — #136 mobile-quick-actions-pressed-feedback

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 3bddbf79 de esta branch, aprobacion via Notion el 2026-09-29). Tiene dos
> casillas: la de §Aprobacion, ya marcada, y la de la prueba de humo de R5,
> que cierra el humano tras el veredicto del reviewer.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-quick-actions-pressed-feedback.md.
Para si la branch no es feature/136-mobile-quick-actions-pressed-feedback.
No toques /home/claude/sites/Pet-Tracker-wt-backend (es de otra sesion, con
#133), Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni cambies de branch en
ningun worktree.

Feature: mobile-quick-actions-pressed-feedback (#136), branch: feature/136-mobile-quick-actions-pressed-feedback
Spec aprobada: specs/mobile-quick-actions-pressed-feedback/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-quick-actions-pressed-feedback/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene el it
nuevo literal, las cinco enmiendas literales, las cuatro lineas de la Home,
los blobs de control de cada paso, la tabla «Exigido» de las sondas, los
greps de candado de R4, los blobs finales y los comandos.

== QUE HACES ==

Tres ficheros de codigo, todos bajo mobile-pet-tracker/src/:
  screens/home/index.test.tsx              (el test)
  __tests__/consistency-classnames.test.ts (el test de consistencia)
  screens/home/index.tsx                   (la Home: UNA linea por cuatro)
  R1  it nuevo `#136 R1: ...` dentro del describe de #81, justo despues de
      #81 R3: cada tile a opacidad 0.8 mientras se pulsa (responderGrant),
      los otros dos en 1, y de vuelta a 1 tras responderTerminate + waitFor.
      Todo con toEqual sobre el style entero
  R2  #81 R3 enmendado: toEqual({ borderCurve: 'continuous', opacity: 1 })
  R3  test de consistencia: la fila de la Home en #62 R14 (2 -> 1), la suma
      de #62 R14 (33 + 1 + 1 -> 33 + 1 + 1 - 1) y dos cifras de #98 R10
      (Home 2 -> 1, repo 33 -> 32)
  Verde  en la Home, dentro de {QUICK_ACTIONS.map(, la linea
      `style={CONTINUOUS_CORNER}` de 20 espacios pasa a las cuatro lineas de
      la receta ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.8 : 1 }).
      El style de collar-pair-link (22 espacios) NO se toca
  R4  cierre: sondas, greps de candado, tsc, eslint, blobs finales, reporte y
      traceability.md
No uses numeros de linea: localiza todo con los grep y las lineas literales
de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama; casilla de §Aprobacion marcada; router.d.ts; skills; los tres
          blobs de base (Home ff591a1f, test f91c8971, consistencia
          07cc45b4); las tres medidas. Si un blob no coincide, PARA
  R1..R3  un commit ROJO de solo test por requisito, cada uno con su blob de
          control y su rojo medido. Rojo NATURAL (via a): la base no cumple,
          asi que NO hay mutaciones versionadas de la Home. Nunca mezcles
          test e implementacion en el mismo commit
  Verde   UN commit que cambia solo la Home y pone verdes R1, R2 y R3 a la
          vez. No hay verde por requisito: el cambio de la Home solo pondria
          rojos #81 R3, #62 R14 y #98 R10 sin enmendar
  Sondas  todas las de tasks.md §Sondas, UNA cada vez, con los dos tests
          juntos (220 tests): aplicar, comprobar el blob con git hash-object,
          medir, apuntar exit, cuentas, cada it rojo y la PRIMERA LINEA de su
          error, restaurar con
          `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
          y comprobar que `git status --porcelain -- mobile-pet-tracker` y
          `git diff --cached --name-only` salen vacios antes de la siguiente.
          `collar` da verde en el test y rojo en el de consistencia, y
          `android_only` da verde 220 de 220: los dos a proposito, no son
          fallos tuyos. No se commitean
  R4      comprobaciones de cierre; reporte y traceability.md en el ultimo
          commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expect pressed feedback on each quick action tile (R1)
  test(mobile): expect the resting opacity in the quick action corner lock (R2)
  test(mobile): move the quick action corner out of the direct corner counts (R3)
  feat(mobile): dim each quick action tile while pressed (R1,R2,R3)
  docs(mobile): record the quick action pressed feedback evidence (R4)

Ficheros que TU cambias en el diff acumulado contra origin/main:
  mobile-pet-tracker/src/screens/home/index.tsx        (numstat `4	1`)
  mobile-pet-tracker/src/screens/home/index.test.tsx
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  specs/mobile-quick-actions-pressed-feedback/traceability.md
  progress/impl_mobile-quick-actions-pressed-feedback.md
Nada mas. Los demas ficheros de specs/, progress/ y feature_list.json que
salen en el diff de la branch son commits del leader, anteriores a ti.

== CIFRAS ==

origin/main no se ha movido desde la base de la spec (073fa6cb) y los tres
blobs de base coinciden (el leader lo comprobo al firmar), asi que las
cifras de tasks.md valen tal cual:
  base    suite 86 suites / 1608 passed / 1 snapshot, exit=0; el test 166;
          el de consistencia 53
  rojo R1 el test: 1 failed, 166 passed, 167 total, exit=1 (#136 R1 por
          toEqual, en el reposo de quick-action-weight)
  rojo R2 el test: 2 failed, 165 passed, 167 total, exit=1 (#81 R3 y
          #136 R1, los dos por toEqual)
  rojo R3 el de consistencia: 2 failed, 51 passed, 53 total, exit=1 (#62 R14
          › ...sus 1 esquinas y #98 R10, los dos por toHaveLength). «fusiona
          la esquina una vez...» queda VERDE: es lo esperado
  verde   el test 167/167, el de consistencia 53/53, la suite 86 suites /
          1609 passed / 1 snapshot, exit=0 en los tres
Si tu base no es 1608 (porque otra feature mergeo antes sin tocar estos tres
ficheros), anota la tuya y aplica el mismo delta (+0 suites, +1 test). Los
rojos son SOLO los it nombrados, por el matcher nombrado y POR ASERCION,
nunca por consulta, ReferenceError ni TypeError; si falla cualquier otro,
PARA.

Sondas: si alguna no da exactamente su «Exigido», PARA y reportalo con el
log. No ajustes la asercion para que cuadre. Para `shared` y `sticky`, anota
tambien la asercion donde falla (el marco `>` del log).

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI
  movil: docs/ui-guidelines.md (gate C8 del reviewer).
- Skills: carga `building-native-ui` de tu plugin expo (es el nombre de TU
  catalogo v1.0.2; no busques expo-overview, expo-native-ui ni
  expo-animation, no existen en el tuyo). Carga tambien
  `appllama-app-design-skill` de .agents/skills/, que la carta hace
  obligatoria en UI movil; toma de ella solo el patron, la carta gana y su
  simulator loop no aplica. NO cargues `animate-expo` de .agents/skills/: su
  receta de pulsado (escala 0.97 con transicion de Reanimated) esta
  descartada en design.md §Alternativas y la firmo el humano. El cambio es
  de opacidad, INSTANTANEO: sin Reanimated, sin transicion, sin escala, sin
  haptica, sin useState. Di en el reporte que skills cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via a: tres commits rojos de solo
  tests (R1, R2, R3), luego UN verde de solo la Home, luego el de docs. Cinco
  commits, no uno: tests + implementacion + docs en un solo commit incumple
  C4 (paso en #19).
- Los esperados son LITERALES del test: testID y objetos de style, escritos a
  mano. Ningun import nuevo en el test ni en la Home, y nada leido de la Home
  ni de src/theme/native-styles.ts. En la Home, CONTINUOUS_CORNER y
  Pressable ya estan importados.
- Los literales de tasks.md van TAL CUAL: el it, los comentarios, las
  enmiendas y las cuatro lineas de la receta, sangria incluida. Los blobs de
  control lo comprueban: si no coinciden, compara con el literal antes de
  seguir.
- Reglas de literales de tasks.md §Antes punto 7 (design-drift escanea el
  test): la cita va siempre como `#136 R<n>`, NUNCA un `#136` suelto, tampoco
  en comentarios, porque la guarda lo lee como un color hexadecimal. Ni
  StyleSheet, ni ningun `-[`, ni colores hexadecimales.
- Cuidado en el verde: `grep -cF 'style={CONTINUOUS_CORNER}'` sin -x da 2
  porque casa tambien con collar-pair-link. Usa el `grep -cxF` de 20
  espacios de tasks.md, que da 1.
- Refactor: ninguno. No extraigas la receta a una constante ni a un helper
  compartido con la campana o «Ver todos», ni la tabla de testID del it.
- NO toques: la Home fuera de la linea del style del tile (collar-pair-link,
  campana, «Ver todos», imports, QUICK_ACTIONS); los demas it del test,
  incluidos los de #71 R1 y los de #81 salvo la linea de #81 R3, y sus
  helpers y mocks (renderHome, makePet, makeDay, los mock* y el mock de
  reicon-react-native); el test de consistencia fuera de las cuatro lineas
  de R3; src/__tests__/design-drift.test.ts y el resto de src/__tests__/;
  src/screens/home/weekly-activity-chart.tsx y su test; src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx;
  src/__tests__/ui-copy-table.ts; package.json; bun.lock;
  docs/ui-guidelines.md; ficheros nativos ni configuracion de la app. Cero
  dependencias nuevas.
- Rellena specs/mobile-quick-actions-pressed-feedback/traceability.md con
  los hashes, sin ninguna fila «pendiente». R1, R2 y R3 citan cada una su
  rojo y el mismo verde; la de R4 cita el hash del VERDE (el ultimo commit de
  codigo), no el de docs; la de R5 ya dice «no aplica» y no se toca. No
  rebasees despues de escribir hashes.
- R5 es la prueba de humo del humano en un dev build de Android. No es tuya:
  no la marques ni la simules.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que
  tengas que contar va en progress/impl_mobile-quick-actions-pressed-feedback.md.
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
- Jest de un fichero siempre con --runTestsByPath (ninguna ruta de esta
  feature lleva parentesis). Comprueba que imprime el numero de suites
  esperado.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve
  el codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte. Los bloques `● Console` del log de la suite son ruido.
- Restaura SIEMPRE con `git checkout HEAD -- <ruta>`, nunca con
  `git checkout <commit> -- <ruta>` seguido de otro checkout: deja la
  mutacion en el indice. Ni git stash ni rm -f.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son
  compartidos con la sesion de #133. Se mide con bunx jest, bunx tsc
  --noEmit y bunx eslint.

Criterios de aceptacion: R1-R4 de requirements.md (R5 es del humano).

Al terminar, escribe progress/impl_mobile-quick-actions-pressed-feedback.md
con: pwd y branch; skills cargadas; la base medida y sus blobs; los commits
por R-id con hashes; cada rojo con sus cuentas, exit, su it, su matcher,
`Expected` y `Received`, y el verde con sus cuentas y exit en los tres
comandos; la tabla de todas las sondas con blob, exit, cuentas, cada it
rojo, su matcher y si es rojo por asercion o por consulta, en la columna
«medido»; los greps de R4.4 y R4.5 con su salida; tsc y eslint con su exit;
los blobs finales; el delta sobre tu base; y cualquier decision que la spec
no cerrara literalmente.
```
