# Handoff a Codex CLI — #138 mobile-collar-pair-link-pressed-feedback

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> 22b71872 de esta branch, aprobacion via Notion el 2026-09-30). Tiene dos
> casillas: la de §Aprobacion, ya marcada, y la de la prueba de humo de R5,
> que cierra el humano tras el veredicto del reviewer.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-collar-pair-link-pressed-feedback.md.
Para si la branch no es feature/138-mobile-collar-pair-link-pressed-feedback.
No toques /home/claude/sites/Pet-Tracker-wt-backend (es de otra sesion, con
#137 y #139), Pet-Tracker-wt-ui, pet-tracker-43, pt-skills ni ningun worktree
bajo /tmp, ni cambies de branch en ningun worktree.

Feature: mobile-collar-pair-link-pressed-feedback (#138), branch: feature/138-mobile-collar-pair-link-pressed-feedback
Spec aprobada: specs/mobile-collar-pair-link-pressed-feedback/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-collar-pair-link-pressed-feedback/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los dos
it nuevos literales, las tres enmiendas literales, las cuatro lineas de la
Home, los blobs de control de cada paso, la tabla «Spec y exigido» de las
sondas, los greps de candado de R4, los blobs finales y los comandos.

== QUE HACES ==

Tres ficheros de codigo, todos bajo mobile-pet-tracker/src/:
  screens/home/index.test.tsx              (el test)
  __tests__/consistency-classnames.test.ts (el test de consistencia)
  screens/home/index.tsx                   (la Home: UNA linea por cuatro)
  R1  it nuevo `#138 R1: ...` al final del describe del collar
      ('R10 (mobile-device-pairing): la collar card sin collar enlaza a
      /pairing'), con mockGetPet resolviendo makePet({ device: null }):
      collar-pair-link en reposo a opacidad 1, a 0.8 tras responderGrant y
      de vuelta a 1 tras responderTerminate + waitFor. Todo con toEqual
      sobre el style entero
  R2  it nuevo `#138 R2: ...` justo debajo: rounded-xl como unico token de
      radio del className y style toEqual({ borderCurve: 'continuous',
      opacity: 1 })
  R3  test de consistencia: la fila de la Home en #62 R14 (1 -> 0, la fila
      SE QUEDA), la suma de #62 R14 (33 + 1 + 1 - 1 -> 33 + 1 + 1 - 1 - 1) y
      dos cifras de #98 R10 (Home `?? []).toHaveLength(0)`, repo 32 -> 31)
  Verde  en la Home, dentro de {detail.data.pet.device === null ? (, la
      linea `style={CONTINUOUS_CORNER}` de 22 espacios pasa a las cuatro
      lineas de la receta ({ ...CONTINUOUS_CORNER, opacity: pressed ? 0.8 : 1 }).
      Es la misma receta que ya llevan los tiles de accesos rapidos
  R4  cierre: sondas, greps de candado, tsc, eslint, blobs finales, reporte y
      traceability.md
No uses numeros de linea: localiza todo con los grep y las lineas literales
de tasks.md.

Orden EXACTO de tasks.md:
  Antes   rama; casilla de §Aprobacion marcada; router.d.ts; skills; los
          cuatro blobs de base (Home cb61d0c6, test 04135c8e, consistencia
          e62f88ad, native-styles.ts 4e5939f9); las tres medidas. Si un blob
          no coincide, PARA
  R1..R3  un commit ROJO de solo test por requisito, cada uno con su blob de
          control y su rojo medido. Rojo NATURAL (via a): la base no cumple,
          asi que NO hay mutaciones versionadas de la Home. Nunca mezcles
          test e implementacion en el mismo commit
  Verde   UN commit que cambia solo la Home y pone verdes R1, R2 y R3 a la
          vez. No hay verde por requisito: el cambio de la Home solo pondria
          rojos #62 R14 y #98 R10 sin enmendar
  Sondas  las 15 de tasks.md §Sondas, UNA cada vez, con los dos tests juntos
          (222 tests): aplicar, comprobar el blob con git hash-object, medir,
          apuntar exit, cuentas, cada it rojo, la PRIMERA LINEA de su error y
          la linea `>` donde cae, restaurar con
          `git checkout HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`
          (tras `constant`, tambien
          `git checkout HEAD -- mobile-pet-tracker/src/theme/native-styles.ts`)
          y comprobar que `git status --porcelain -- mobile-pet-tracker` y
          `git diff --cached --name-only` salen vacios antes de la siguiente.
          `hidden` da tres rojos POR CONSULTA y uno por asercion, e
          `ios_only` da verde 222 de 222: los dos a proposito, no son fallos
          tuyos. No se commitean
  R4      comprobaciones de cierre; reporte y traceability.md en el ultimo
          commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expect pressed feedback on the collar pair link (R1)
  test(mobile): lock the collar pair link radius and resting style (R2)
  test(mobile): move the collar pair link corner out of the direct corner counts (R3)
  feat(mobile): dim the collar pair link while pressed (R1,R2,R3)
  docs(mobile): record the collar pair link pressed feedback evidence (R4)

Ficheros que TU cambias en el diff acumulado contra origin/main:
  mobile-pet-tracker/src/screens/home/index.tsx        (numstat `4	1`)
  mobile-pet-tracker/src/screens/home/index.test.tsx
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  specs/mobile-collar-pair-link-pressed-feedback/traceability.md
  progress/impl_mobile-collar-pair-link-pressed-feedback.md
Nada mas. Los demas ficheros de specs/, progress/ y feature_list.json que
salen en el diff de la branch son commits del leader, anteriores a ti.

== CIFRAS ==

origin/main no se ha movido desde la base de la spec (76849396) y los tres
blobs de base coinciden (el leader lo comprobo al firmar), asi que las
cifras de tasks.md valen tal cual:
  base    suite 86 suites / 1610 passed / 1 snapshot, exit=0; el test 167;
          el de consistencia 53
  rojo R1 el test: 1 failed, 167 passed, 168 total, exit=1 (#138 R1 por
          toEqual, en la primera asercion, la del reposo)
  rojo R2 el test: 2 failed, 167 passed, 169 total, exit=1 (#138 R1 y
          #138 R2, los dos por toEqual; en #138 R2 cae en la asercion del
          style, la del radio ya es verde)
  rojo R3 el de consistencia: 2 failed, 51 passed, 53 total, exit=1 (#62 R14
          › ...sus 0 esquinas y #98 R10, los dos por toHaveLength). «fusiona
          la esquina una vez...» queda VERDE: es lo esperado
  verde   el test 169/169, el de consistencia 53/53, la suite 86 suites /
          1612 passed / 1 snapshot, exit=0 en los tres
Si tu base no es 1610 (porque otra feature mergeo antes sin tocar estos tres
ficheros), anota la tuya y aplica el mismo delta (+0 suites, +2 tests). Los
rojos son SOLO los it nombrados, por el matcher nombrado y POR ASERCION,
nunca por consulta, ReferenceError ni TypeError; si falla cualquier otro,
PARA.

Sondas: si alguna no da exactamente su «Spec y exigido», PARA y reportalo
con el log. No ajustes la asercion para que cuadre. Para `pressed07`,
`pressnocorner` y `sticky`, anota la asercion donde falla (pulsado, pulsado
y waitFor): la tabla la exige.

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
  descartada desde #136 y la firmo el humano. El cambio es de opacidad,
  INSTANTANEO: sin Reanimated, sin transicion, sin escala, sin haptica, sin
  useState. Di en el reporte que skills cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md), via a: tres commits rojos de solo
  tests (R1, R2, R3), luego UN verde de solo la Home, luego el de docs. Cinco
  commits, no uno: tests + implementacion + docs en un solo commit incumple
  C4 (paso en #19).
- Los esperados son LITERALES del test: testID y objetos de style, escritos a
  mano. Ningun import nuevo en el test ni en la Home, y nada leido de la Home
  ni de src/theme/native-styles.ts. En la Home, CONTINUOUS_CORNER y
  Pressable ya estan importados; en el test, renderHome, screen, fireEvent,
  waitFor, mockGetPet y makePet ya existen.
- Los literales de tasks.md van TAL CUAL: los it, los comentarios, las
  enmiendas y las cuatro lineas de la receta, sangria incluida (los bloques
  de tasks.md estan a columna 0 con la sangria del destino). Los blobs de
  control lo comprueban: si no coinciden, compara con el literal antes de
  seguir.
- Reglas de literales de tasks.md §Antes punto 7 (design-drift escanea el
  test): la cita va siempre como `#138 R<n>`, NUNCA un `#138` suelto,
  tampoco en comentarios, porque la guarda lo lee como un color hexadecimal.
  Ni StyleSheet, ni ningun `-[`, ni colores hexadecimales.
- En #98 R10 la Home queda sin coincidencias y `String.match` con /g
  devuelve null: el literal de tasks.md usa `?? []` y asi se queda. Sin el,
  el rojo es un Matcher error, no una asercion.
- Cuidado en las sondas: «la esquina» y «la opacidad» de la receta del
  boton llevan 24 espacios y casan una sola vez solo con `grep -cxF`; sin -x
  casan tambien con las de los tiles (22 espacios). Usa los greps de
  tasks.md §Sondas.
- Refactor: ninguno. No extraigas la receta a una constante ni a un helper
  compartido con los tiles, la campana o «Ver todos». No reformatees el
  bloque del boton: el `<Pressable` y su `>` no estan alineados con sus
  props, y asi se quedan.
- NO toques: la Home fuera de la linea del style de collar-pair-link (su
  className, su onPress, su texto, la condicion device === null, los tiles
  de QUICK_ACTIONS, la campana, «Ver todos», imports); los demas it del
  test, incluidos los dos que ya hay en el describe del collar, y sus
  helpers y mocks (renderHome, makePet, makeDay, los mock* y el beforeEach
  del describe); el test de consistencia fuera de las lineas de los tres
  cambios de R3; src/__tests__/design-drift.test.ts y el resto de
  src/__tests__/; src/theme/native-styles.ts (solo se muta en la sonda
  `constant` y se restaura); src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx;
  src/__tests__/ui-copy-table.ts; src/hooks/use-push-registration.test.tsx
  (lo toca la otra sesion); package.json; bun.lock; docs/ui-guidelines.md;
  ficheros nativos ni configuracion de la app. Cero dependencias nuevas.
- Rellena specs/mobile-collar-pair-link-pressed-feedback/traceability.md con
  los hashes. R1, R2 y R3 citan cada una su rojo y el mismo verde; la de R4
  cita el hash del VERDE (el ultimo commit de codigo), no el de docs. La de
  R5 dice «no aplica» y «pendiente (firma del humano...)» y NO se toca: es
  la unica fila que puede quedar «pendiente». No rebasees despues de
  escribir hashes.
- R5 es la prueba de humo del humano en un dev build de Android. No es tuya:
  no la marques ni la simules.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que
  tengas que contar va en progress/impl_mobile-collar-pair-link-pressed-feedback.md.
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
  feature lleva parentesis). Comprueba que imprime el numero de suites
  esperado.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve
  el codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte. Los bloques `● Console` del log de la suite son ruido.
- Restaura SIEMPRE con `git checkout HEAD -- <ruta>`, nunca con
  `git checkout <commit> -- <ruta>` seguido de otro checkout: deja la
  mutacion en el indice. Ni git stash ni rm -f.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son
  compartidos con la sesion de #137 y #139. Se mide con bunx jest, bunx tsc
  --noEmit y bunx eslint.

Criterios de aceptacion: R1-R4 de requirements.md (R5 es del humano).

Al terminar, escribe progress/impl_mobile-collar-pair-link-pressed-feedback.md
con: pwd y branch; skills cargadas; la base medida y sus blobs; los commits
por R-id con hashes; cada rojo con sus cuentas, exit, su it, su matcher,
`Expected` y `Received`, y el verde con sus cuentas y exit en los tres
comandos; la tabla de las 15 sondas con blob, exit, cuentas, cada it rojo,
su matcher, la asercion donde cae y si es rojo por asercion o por consulta,
en la columna «medido»; los greps de R4 con su salida; tsc y eslint con su
exit; los blobs finales; el delta sobre tu base; y cualquier decision que la
spec no cerrara literalmente.
```
