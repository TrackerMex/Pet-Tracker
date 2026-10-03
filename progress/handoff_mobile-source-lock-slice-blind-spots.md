# Handoff a Codex CLI — #122 mobile-source-lock-slice-blind-spots

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit
> `c1db4481`, aprobacion via Notion).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-source-lock-slice-blind-spots.md.
Para si la branch no es feature/122-mobile-source-lock-slice-blind-spots.
No toques /home/claude/sites/Pet-Tracker-wt-backend (otra sesion trabaja alli en
#123 y #125) ni cambies de branch en ningun worktree.

Feature: mobile-source-lock-slice-blind-spots (#122), branch: feature/122-mobile-source-lock-slice-blind-spots
Spec aprobada: specs/mobile-source-lock-slice-blind-spots/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-source-lock-slice-blind-spots/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene los it
literales, las mutaciones, los comentarios y el bloque literal de R4, los blobs
esperados y los comandos. Los moldes son #112 y #121
(specs/mobile-reminders-see-all-source-lock-nesting/ y
specs/mobile-home-bell-source-lock-unbounded/), ya mergeadas.

== QUE HACES ==

Un cambio SOLO de test y docs, en tres candados de fuente que recortan el tag
de apertura de `<` a `<` (localizalos con
`grep -rn "lastIndexOf('<', anchor)" mobile-pet-tracker/src`, que da 3):
meal-toggle en src/app/(tabs)/__tests__/food.test.tsx, y home-alerts-bell y
reminders-see-all en src/screens/home/index.test.tsx. Dos defensas:
  R1  una linea de unicidad del ancla en cada uno de los tres it,
      `expect(source.lastIndexOf('<ancla>')).toBe(anchor);`, justo antes de su
      `expect(block).toMatch(`, y el sufijo `, con ancla única (#122 R1)` en
      los tres titulos
  R2  tres it nuevos que pulsan el elemento con
      `fireEvent(el, 'responderGrant', { nativeEvent: {}, persist: () => undefined })`
      y asevera `toHaveStyle({ opacity: 0.8 })`
No uses numeros de linea: localiza todo con los grep de tasks.md.

Orden EXACTO de tasks.md:
  R1 (0)  P4 en los tres elementos (dos ficheros de produccion:
          src/screens/home/index.tsx y src/app/(tabs)/food.tsx) con los tests sin
          tocar -> VERDE. Guarda el log y los blobs: es la prueba del agujero
  R1 (1)  commit ROJO: la linea de unicidad + los tres renombres, con P4 puesta.
          Fallan SOLO los tres it renombrados y SOLO por `toBe` en la linea de
          unicidad. Commit con los dos ficheros de produccion mutados + los dos tests
  R1 (2)  commit VERDE: `git checkout HEAD~1 -- src/screens/home/index.tsx 'src/app/(tabs)/food.tsx'`
  R2 (0)  P1 en los tres elementos, sobre el verde de R1 -> VERDE. Log y blobs
  R2 (1)  commit ROJO: los tres it `#122 R2`, con P1 puesta. Fallan SOLO esos
          tres y SOLO por `toHaveStyle` (opacity 0.8 esperada, 1 recibida)
  R2 (2)  commit VERDE: revierte P1 igual que en R1 (2)
  R3      las sondas de tasks.md §R3 sobre el verde de R2: medir, apuntar,
          revertir cada una antes de la siguiente. No se commitean
  R4      comentarios literales en los dos ficheros de test + el bloque literal
          de docs/conventions.md. Un commit de docs
  R5      cierre: diff acumulado de produccion vacio; reporte y traceability.md
          en el ultimo commit
El par de R1 va ANTES que el de R2: con R2 puesta, P4 da 6 rojos y el rojo de R1
deja de ser solo suyo.

Ficheros que cambian en el diff acumulado:
  mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
  mobile-pet-tracker/src/screens/home/index.test.tsx
  docs/conventions.md
  specs/mobile-source-lock-slice-blind-spots/traceability.md
  progress/impl_mobile-source-lock-slice-blind-spots.md
Nada mas. Los dos ficheros de produccion solo se tocan en los dos commits rojos
y se revierten en sus verdes.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI movil:
  docs/ui-guidelines.md (gate C8 del reviewer), aunque aqui no hay UI.
- Skills: NO cargues ninguna. Ni las del plugin expo (en tu catalogo v1.0.2
  ninguna de las 13 aplica a candados de jest sobre texto y un fireEvent) ni las
  de .agents/skills/ (appllama-app-design-skill es obligatoria solo al disenar o
  cambiar una pantalla o un flujo, y aqui no se toca ninguna). La guia esta
  entera en tasks.md. Di en el reporte que no cargaste ninguna.
- TEST PRIMERO (C4 de CHECKPOINTS.md, via b): cada rojo versiona su mutacion de
  produccion (P4 en R1, P1 en R2) y su verde la revierte, como en #109, #112 y
  #121. Mutar un doble no vale. El rojo falla por SU asercion (`toBe` en R1,
  `toHaveStyle` en R2), nunca por otra asercion, otro test o un ReferenceError.
  Si falla por otra cosa, para.
- Mensajes de commit: los de tasks.md, literales.
- En src/screens/home/index.test.tsx NO escribas `#` + numero salvo en la forma
  `#122 R1` / `#122 R2`: una cita suelta (`#122`, `(#122)`, `#121/#122`) pone
  rojos cinco guards de src/__tests__/design-drift.test.ts. La palabra
  `StyleSheet` tampoco puede aparecer. Los literales de tasks.md ya pasan el
  guard: copialos tal cual.
- R2: usa `responderGrant`. NO uses `fireEvent(..., 'pressIn')` (no llega a
  nadie: la opacidad se queda en 1) ni `userEvent.press` (suelta antes de que
  puedas leer). No vuelvas a consultar el elemento tras el evento. No anadas
  imports: los dos ficheros ya importan `fireEvent` y `screen`.
- NO toques: los recortes, las regex, las demas aserciones de los tres it (pata
  de reposo de reminders-see-all, ruta /alerts, cast Href, icono <Bell ...>) ni
  su orden; elementWithTestId (consistency-classnames / legibility-classnames);
  la implementacion de referencia de consistency-classnames.test.ts;
  src/i18n/catalog.ts; src/providers/__tests__/language-provider.test.tsx; las
  specs de #109, #112 y #121; package.json; bun.lock. Cero dependencias nuevas.
  Sin helper compartido ni refactor.
- En docs/conventions.md sustituye SOLO el bloque que tasks.md §R4 (3) delimita.
  Los parrafos de debajo («No queda ningun recorte...» y «Tampoco vale
  aseverar...») no se tocan.
- Si una sonda de R3 no da el veredicto «Exigido», PARA y reportalo. No ajustes
  el test para que cuadre. O2c DEBE quedar en verde: es el limite documentado.
- Actualiza specs/mobile-source-lock-slice-blind-spots/traceability.md con los
  hashes rojo -> verde de R1 y R2 y el de R4. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Son artefactos de cierre
  del leader. Todo lo que tengas que contar va en
  progress/impl_mobile-source-lock-slice-blind-spots.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta (#112, Obs. 4).
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y lint desde mobile-pet-tracker/ (los candados abren rutas relativas
  a process.cwd()). Los git y grep con rutas mobile-pet-tracker/... desde la raiz
  del repo, como indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-09-24).
- Jest siempre con --runTestsByPath. La ruta `src/app/(tabs)/...` va entre
  comillas simples. Comprueba que jest imprime `Test Suites: 1` (o `2` con los
  dos ficheros).
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de resumen
  al reporte.
- NO lances ./init.sh ni toques Postgres o LocalStack: son compartidos con el
  worktree de Backend. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint.

== BASE Y CIERRE ==

Base en f72c1fc0 (vuelve a medirla al empezar sobre el HEAD de la branch,
c1db4481 o posterior; encima solo hay commits de spec y progress):
  src/app/(tabs)/__tests__/food.test.tsx -> 55 tests, exit=0
  src/screens/home/index.test.tsx -> 140 tests, exit=0
  src/__tests__/design-drift.test.ts -> 55 tests, exit=0
  bunx jest -> 82 suites, 1471 tests, exit=0
  bunx tsc --noEmit y bunx expo lint -> exit=0
Si tu base difiere porque otra feature mergeo, vale TU base: el gate es el delta.
Cierre esperado: +0 suites y +3 tests; tsc y lint con exit=0; las
comprobaciones de tasks.md R4 (4) con el resultado indicado; R5 con
git diff --exit-code en 0 y los blobs de produccion en HEAD y en los dos rojos
que da tasks.md §R5 si la base sigue en f72c1fc0.

Criterios de aceptacion: R1-R5 de requirements.md.

Al terminar, escribe progress/impl_mobile-source-lock-slice-blind-spots.md con:
pwd y branch; skills cargadas (ninguna); la base medida; los logs de los dos (0)
y sus blobs; los commits por R-id con hashes; los dos rojos con su linea de
fallo, `Expected` y `Received`; la tabla de todas las sondas de R3 con
veredicto, matcher y «otros»; las comprobaciones de R4 con su salida; comandos y
salidas exactas del cierre; el delta; y cualquier decision que la spec no
cerrara literalmente.
```
