# Handoff a Codex CLI — #126 mobile-home-cell-icons-source-lock-unbounded

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit de firma
> de esta branch, aprobacion via Notion el 2026-09-27).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-home-cell-icons-source-lock-unbounded.md.
Para si la branch no es feature/126-mobile-home-cell-icons-source-lock-unbounded.
No toques /home/claude/sites/Pet-Tracker-wt-backend, Pet-Tracker-wt-ui,
pet-tracker-43 ni pt-skills (son otros worktrees con otras sesiones) ni
cambies de branch en ningun worktree.

Feature: mobile-home-cell-icons-source-lock-unbounded (#126), branch: feature/126-mobile-home-cell-icons-source-lock-unbounded
Spec aprobada: specs/mobile-home-cell-icons-source-lock-unbounded/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-home-cell-icons-source-lock-unbounded/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene el describe
literal de R1, la mutacion W2, las 19 clases y 3 sondas sueltas de R2 (79 en
total) con su tabla «Exigido», el comentario y el parrafo literales de R3, los
blobs esperados y los comandos. El molde es #124
(specs/mobile-home-bell-icon-source-lock-unbounded/), ya mergeada.

== QUE HACES ==

Un cambio SOLO de test y docs. En src/screens/home/index.test.tsx, el it
`#69 R9: usa iconos de reicon y ningun emoji` cuenta
/<(?:Weight|Walk|Moon|Map) size=\{20\} color=\{muted\} \/>/g sobre TODO
index.tsx con toHaveLength(4): una copia senuelo de un icono le da el verde
(sonda W2, 144/144 hoy). La defensa:
  R1  un describe anidado nuevo,
      '#126 R1: cada celda de la tira pinta su propio icono en muted', dentro de
      `#69 R1`, justo despues del it `#69 R9` y justo antes de
      `it('#69 R12: deja que cada celda se anuncie por separado'`.
      Espia `Uniwind.getCSSVariable` en su beforeEach (devuelve su argumento),
      `jest.restoreAllMocks()` en su afterEach, y dos it ('con las métricas de
      hoy' y 'sin métricas ni peso') que, para cada celda, filtran los hijos
      no-cadena del parent del Text del valor y aseveran `toHaveLength(3)` y
      `expect(children[0].props).toEqual({ testID, size: 20, color: '--color-muted' })`.
      El literal de tasks.md §R1 (1), tal cual
  R2  las 79 sondas de tasks.md §R2 sobre el verde de R1. No se commitean
  R3  un comentario literal de 4 lineas debajo de
      `expect(reiconImport).toMatch(/\bWeight\b/);` y encima de la cuenta (que
      NO cambia), y un parrafo literal en docs/conventions.md
  R4  cierre: diff acumulado de produccion vacio; reporte y traceability.md en
      el ultimo commit
No uses numeros de linea: localiza todo con los grep de tasks.md.

Orden EXACTO de tasks.md:
  R1 (0)  W2 en src/screens/home/index.tsx con los tests sin tocar -> VERDE,
          144/144. Guarda el log y el blob: es la prueba del agujero
  R1 (1)  commit ROJO: el describe de R1, con W2 puesta. Fallan SOLO los dos it
          nuevos (2 failed de 146) y SOLO por `toEqual` en la celda de peso
          (`- "color": "--color-muted"`, `+ "color": "--color-accent-strong"`;
          el `+ "children": undefined` del diff no es la causa). Ningun
          toHaveLength cae. El it `#69 R9` PASA. Commit con index.tsx mutado +
          index.test.tsx
  R1 (2)  commit VERDE: `git checkout HEAD~1 -- src/screens/home/index.tsx`
          (desde mobile-pet-tracker/). 146/146
  R2      las 79 sondas: aplicar, medir, apuntar pasan/fallan y matcher,
          REVERTIR antes de la siguiente
  R3      comentario + parrafo. Un commit de docs con esos dos ficheros
  R4      comprobaciones de cierre; reporte y traceability.md en el ultimo commit

Mensajes de commit, LITERALES y en este orden:
  test(mobile): expose the whole-file stats strip icon lock (R1)
  test(mobile): lock each stats strip icon in its cell in the tree (R1)
  docs(mobile): explain why the strip icons are locked in the tree (R3)
  docs(mobile): record the strip icon lock evidence (R2,R4)

Ficheros que cambian en el diff acumulado:
  mobile-pet-tracker/src/screens/home/index.test.tsx
  docs/conventions.md
  specs/mobile-home-cell-icons-source-lock-unbounded/traceability.md
  progress/impl_mobile-home-cell-icons-source-lock-unbounded.md
Nada mas. src/screens/home/index.tsx solo se toca en el commit rojo de R1 y se
revierte en su verde.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI movil:
  docs/ui-guidelines.md (gate C8 del reviewer), aunque aqui no hay UI.
- Skills: NO cargues ninguna. Ni las del plugin expo (en tu catalogo v1.0.2
  ninguna de las 13 aplica a un candado de jest sobre el arbol renderizado) ni
  las de .agents/skills/ (appllama-app-design-skill es obligatoria solo al
  disenar o cambiar una pantalla o un flujo, y aqui no se toca ninguna). La guia
  esta entera en tasks.md. Di en el reporte que no cargaste ninguna.
- TEST PRIMERO (C4 de CHECKPOINTS.md, via b): el rojo de R1 versiona la mutacion
  de produccion W2 y su verde la revierte, como en #121, #122 y #124. Mutar un
  doble no vale. El rojo falla por SU asercion (`toEqual` en los dos it nuevos),
  nunca por otra asercion, otro test, un ReferenceError o un TypeError. Si falla
  por otra cosa, para.
- Los valores esperados son LITERALES: '--color-muted', los testID y el 20. No
  los calcules con useThemeColors ni con nada importado de produccion (seria
  tautologico).
- El matcher es `toEqual`, NO `toStrictEqual`: el nodo del doble lleva
  `children: undefined` y toStrictEqual daria rojo en el arbol sano.
- No anadas imports: Uniwind, screen, waitFor, renderHome, makePet, makeDay,
  mockListPets, mockGetPet y mockGetDailyActivity ya existen en el fichero.
  `icon-weight`, `icon-walk`, `icon-moon` e `icon-map` son los testID del mock
  de reicon (`grep -n "mockIcon('icon-"`). Sin helper ni refactor.
- En src/screens/home/index.test.tsx NO escribas `#` + numero salvo en la forma
  `#126 R1`: una cita suelta (`#126`, `(#126)`, `#69/#126`) pone rojos cinco
  guards de src/__tests__/design-drift.test.ts. La palabra `StyleSheet` tampoco
  puede aparecer. Los literales de tasks.md ya pasan el guard: copialos tal cual.
- NO toques: en el it `#69 R9`, el titulo, el readFileSync, el recorte del
  import de reicon y sus tres aserciones (solo gana el comentario de R3);
  `asigna cada valor, icono y etiqueta a su celda y a ninguna otra`; el it
  `#69 R12` y los demas it de `#69 R1`; el beforeEach de `#69 R1` y el de nivel
  superior; el mock de reicon-react-native (los nombres icon-* se quedan); el
  describe `#124 R1` y todo lo de la campana; src/__tests__/design-drift.test.ts;
  src/i18n/catalog.ts; src/providers/__tests__/language-provider.test.tsx;
  package.json; bun.lock. Cero dependencias nuevas.
- En docs/conventions.md inserta SOLO el parrafo de tasks.md §R3 (2), entre la
  linea del grep de la campana (`grep -n "se pinta con la tinta muted"
  docs/conventions.md` da una) mas su linea en blanco y
  `### Esperas sobre el árbol renderizado`. Nada mas de la seccion cambia.
- Si una sonda de R2 no da el veredicto «Exigido», PARA y reportalo con el log.
  No ajustes el test para que cuadre. W5d, A5d, S5d, D5d, W6d, A6d, S6d y D6d
  DEBEN quedar en verde (146/0): son el limite documentado.
- Rellena specs/mobile-home-cell-icons-source-lock-unbounded/traceability.md: las
  cuatro filas, sin ninguna «pendiente» (R1 rojo -> verde; R2 y R4 con los
  commits que las sostienen; R3 con su commit de docs; lo que ya dice N/A se
  queda). No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son artefactos del leader. Todo lo que tengas
  que contar va en progress/impl_mobile-home-cell-icons-source-lock-unbounded.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y lint desde mobile-pet-tracker/ (los candados abren rutas relativas
  a process.cwd()). Los git y grep con rutas mobile-pet-tracker/... o docs/...
  desde la raiz del repo, como indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-09-27).
- Jest siempre con --runTestsByPath, salvo la suite completa. Comprueba que jest
  imprime `Test Suites: 1`.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de resumen
  al reporte.
- NO lances ./init.sh ni e2e, ni toques Postgres o LocalStack: son compartidos
  con los otros worktrees. Se mide con bunx jest, bunx tsc --noEmit y
  bunx expo lint.

== BASE Y CIERRE ==

Base en d7cb0d60 (vuelve a medirla al empezar sobre el HEAD de la branch; encima
solo hay commits de spec, progress y feature_list). Blobs de partida medidos por
el leader el 2026-09-27: index.tsx dbb5b034, index.test.tsx abbdb5b8,
docs/conventions.md cb3c5253.
  src/screens/home/index.test.tsx -> 144 tests, exit=0
  src/__tests__/design-drift.test.ts -> 55 tests, exit=0
  bunx jest -> 83 suites, 1510 tests, 1 snapshot, exit=0
  bunx tsc --noEmit y bunx expo lint -> exit=0
Si tu base difiere porque otra feature mergeo, vale TU base: el gate es el delta.
Cierre esperado: +0 suites y +2 tests; tsc y lint con exit=0; las
comprobaciones de tasks.md §R3 (3) con el resultado indicado; R4 con
git diff --exit-code en 0 y los blobs de produccion en HEAD y en el rojo que da
tasks.md §R4 si la base sigue en d7cb0d60.

Criterios de aceptacion: R1-R4 de requirements.md.

Al terminar, escribe progress/impl_mobile-home-cell-icons-source-lock-unbounded.md
con: pwd y branch; skills cargadas (ninguna); la base medida; el log de R1 (0) y
su blob; los commits por R-id con hashes; el rojo con sus dos fallos,
`Expected` y `Received`; la tabla de las 79 sondas de R2 con pasan/fallan,
matcher y «otros»; las comprobaciones de R3 (3) con su salida; comandos y
salidas exactas del cierre; el delta; y cualquier decision que la spec no
cerrara literalmente.
```
