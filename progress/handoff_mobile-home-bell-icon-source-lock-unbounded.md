# Handoff a Codex CLI — #124 mobile-home-bell-icon-source-lock-unbounded

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit
> `d79017a2`, aprobacion via Notion).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-home-bell-icon-source-lock-unbounded.md.
Para si la branch no es feature/124-mobile-home-bell-icon-source-lock-unbounded.
No toques /home/claude/sites/Pet-Tracker-wt-backend (otra sesion trabaja alli en
#125) ni cambies de branch en ningun worktree.

Feature: mobile-home-bell-icon-source-lock-unbounded (#124), branch: feature/124-mobile-home-bell-icon-source-lock-unbounded
Spec aprobada: specs/mobile-home-bell-icon-source-lock-unbounded/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-home-bell-icon-source-lock-unbounded/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene el describe
literal de R1, la mutacion B2, la tabla de sondas de R2, el comentario y el
parrafo literales de R3, los blobs esperados y los comandos. Los moldes son #121
y #122 (specs/mobile-home-bell-source-lock-unbounded/ y
specs/mobile-source-lock-slice-blind-spots/), ya mergeadas.

== QUE HACES ==

Un cambio SOLO de test y docs. En src/screens/home/index.test.tsx, el it del
candado de la campana (`grep -n "usa la ruta real sin cast Href"`) termina con
`expect(source).toContain('<Bell size={24} color={muted} />');`, que mira TODO
index.tsx: una copia senuelo del icono le da el verde (sonda B2, 142/142 hoy).
La defensa:
  R1  un describe anidado nuevo,
      '#124 R1: el icono de la campana se pinta con la tinta muted', dentro de
      `#78 R10`, justo antes de `it('no pinta campana cuando no hay mascotas'`.
      Espia `Uniwind.getCSSVariable` en su beforeEach (devuelve su argumento),
      `jest.restoreAllMocks()` en su afterEach, y dos it ('sin alertas abiertas'
      y 'con alertas abiertas') que aseveran
      `expect(within(bell).getByTestId('icon-bell').props.color).toBe('--color-muted')`.
      El literal de tasks.md §R1 (1), tal cual
  R2  las sondas de tasks.md §R2 sobre el verde de R1. No se commitean
  R3  un comentario literal de 4 lineas encima de la linea `toContain` del icono
      (que NO cambia) y un parrafo literal en docs/conventions.md
  R4  cierre: diff acumulado de produccion vacio; reporte y traceability.md en
      el ultimo commit
No uses numeros de linea: localiza todo con los grep de tasks.md.

Orden EXACTO de tasks.md:
  R1 (0)  B2 en src/screens/home/index.tsx con los tests sin tocar -> VERDE,
          142/142. Guarda el log y el blob: es la prueba del agujero
  R1 (1)  commit ROJO: el describe de R1, con B2 puesta. Fallan SOLO los dos it
          nuevos y SOLO por `toBe` (Expected "--color-muted", Received
          "--color-accent-strong"). El it `#121 R1` PASA. Commit con index.tsx
          mutado + index.test.tsx
  R1 (2)  commit VERDE: `git checkout HEAD~1 -- src/screens/home/index.tsx`
          (desde mobile-pet-tracker/). 144/144
  R2      las 21 sondas: aplicar, medir, apuntar pasan/fallan y matcher,
          REVERTIR antes de la siguiente
  R3      comentario + parrafo. Un commit de docs con esos dos ficheros
  R4      comprobaciones de cierre; reporte y traceability.md en el ultimo commit

Ficheros que cambian en el diff acumulado:
  mobile-pet-tracker/src/screens/home/index.test.tsx
  docs/conventions.md
  specs/mobile-home-bell-icon-source-lock-unbounded/traceability.md
  progress/impl_mobile-home-bell-icon-source-lock-unbounded.md
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
  de produccion B2 y su verde la revierte, como en #112, #121 y #122. Mutar un
  doble no vale. El rojo falla por SU asercion (`toBe` en los dos it nuevos),
  nunca por otra asercion, otro test o un ReferenceError. Si falla por otra
  cosa, para.
- Mensajes de commit: los de tasks.md, literales.
- El valor esperado es el LITERAL '--color-muted'. No lo calcules con
  useThemeColors ni con nada importado de produccion (seria tautologico).
- No anadas imports: Uniwind, screen, within, renderHome, mockListAlerts y
  makeAlert ya existen en el fichero. `icon-bell` es el testID del mock de reicon.
- En src/screens/home/index.test.tsx NO escribas `#` + numero salvo en la forma
  `#124 R1`: una cita suelta (`#124`, `(#124)`, `#121/#124`) pone rojos cinco
  guards de src/__tests__/design-drift.test.ts. La palabra `StyleSheet` tampoco
  puede aparecer. Los literales de tasks.md ya pasan el guard: copialos tal cual.
- NO toques: en el it `#121 R1`, el titulo, el ancla, el recorte, sus comentarios
  y sus cinco aserciones (solo gana el comentario de R3); `compone el selector y
  la campana como dos hijos en ese orden`; el it `#122 R2`; `no pinta campana
  cuando no hay mascotas`; los beforeEach de `#78 R10` y de nivel superior;
  `#69 R9: usa iconos de reicon y ningun emoji` y su recuento (es la (F) de la
  spec); src/__tests__/design-drift.test.ts; src/i18n/catalog.ts;
  src/providers/__tests__/language-provider.test.tsx; las specs de #121 y #122;
  package.json; bun.lock. Cero dependencias nuevas. Sin helper ni refactor.
- En docs/conventions.md inserta SOLO el parrafo de tasks.md §R3 (2), entre la
  linea `como arriba.` (mas su linea en blanco) y
  `### Esperas sobre el arbol renderizado`. Nada mas de la seccion cambia.
- Si una sonda de R2 no da el veredicto «Exigido», PARA y reportalo con el log.
  No ajustes el test para que cuadre. B5d, B6d, F2 y W2 DEBEN quedar en verde.
- Rellena specs/mobile-home-bell-icon-source-lock-unbounded/traceability.md: las
  cuatro filas, sin ninguna «pendiente» (R1 rojo -> verde; R2 y R4 con los
  commits que las sostienen; R3 con su commit de docs; lo que ya dice N/A se
  queda). No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y el campo `status` de feature_list.json. Son artefactos de cierre
  del leader. Todo lo que tengas que contar va en
  progress/impl_mobile-home-bell-icon-source-lock-unbounded.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta (#112, Obs. 4).
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Jest, tsc y lint desde mobile-pet-tracker/ (los candados abren rutas relativas
  a process.cwd()). Los git y grep con rutas mobile-pet-tracker/... o docs/...
  desde la raiz del repo, como indica tasks.md. bun / bunx. Nunca npx, nunca npm i -g.
- Antes de cada `bunx tsc --noEmit`: `test ! -e .expo/types/router.d.ts; echo "exit=$?"`.
  exit=0: sigue. exit=1: PARA y reportalo. Nunca `rm -f` ni otra forma de
  borrarlo (el leader midio exit=0 en este worktree el 2026-09-25).
- Jest siempre con --runTestsByPath, salvo la suite completa. Comprueba que jest
  imprime `Test Suites: 1`.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el
  codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de resumen
  al reporte.
- NO lances ./init.sh ni toques Postgres o LocalStack: son compartidos con el
  worktree de Backend. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint.

== BASE Y CIERRE ==

Base en b1469b84 (vuelve a medirla al empezar sobre el HEAD de la branch,
d79017a2 o posterior; encima solo hay commits de spec y progress):
  src/screens/home/index.test.tsx -> 142 tests, exit=0
  src/__tests__/design-drift.test.ts -> 55 tests, exit=0
  bunx jest -> 83 suites, 1494 tests, 1 snapshot, exit=0
  bunx tsc --noEmit y bunx expo lint -> exit=0
Si tu base difiere porque otra feature mergeo, vale TU base: el gate es el delta.
Cierre esperado: +0 suites y +2 tests; tsc y lint con exit=0; las
comprobaciones de tasks.md §R3 (3) con el resultado indicado; R4 con
git diff --exit-code en 0 y los blobs de produccion en HEAD y en el rojo que da
tasks.md §R4 si la base sigue en 2da66b86.

Criterios de aceptacion: R1-R4 de requirements.md.

Al terminar, escribe progress/impl_mobile-home-bell-icon-source-lock-unbounded.md
con: pwd y branch; skills cargadas (ninguna); la base medida; el log de R1 (0) y
su blob; los commits por R-id con hashes; el rojo con sus dos lineas de fallo,
`Expected` y `Received`; la tabla de las 21 sondas de R2 con pasan/fallan,
matcher y «otros»; las comprobaciones de R3 (3) con su salida; comandos y
salidas exactas del cierre; el delta; y cualquier decision que la spec no
cerrara literalmente.
```
