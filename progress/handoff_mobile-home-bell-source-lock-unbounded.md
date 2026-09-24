# Handoff a Codex CLI — #121 mobile-home-bell-source-lock-unbounded

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit
> `6df6581f`, aprobacion via Notion).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-home-bell-source-lock-unbounded.md.
Para si la branch no es feature/121-mobile-home-bell-source-lock-unbounded.
No toques /home/claude/sites/Pet-Tracker-wt-backend (otra sesion trabaja alli en
#84) ni cambies de branch en ningun worktree.

Feature: mobile-home-bell-source-lock-unbounded (#121), branch: feature/121-mobile-home-bell-source-lock-unbounded
Spec aprobada: specs/mobile-home-bell-source-lock-unbounded/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-home-bell-source-lock-unbounded/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene el it literal,
las mutaciones, el texto literal de R4 y los comandos. El molde es #112
(specs/mobile-reminders-see-all-source-lock-nesting/), ya mergeada y aprobada por el reviewer.

== QUE HACES ==

Un cambio SOLO de test. El candado de la receta de pulsado de la campana
(home-alerts-bell) en mobile-pet-tracker/src/screens/home/index.test.tsx asevera hoy
la regex contra TODO src/screens/home/index.tsx; pasa a aseverarla contra el tag de
apertura propio de la campana, recortado de `<` a `<`, el patron ya fijado en
docs/conventions.md §Recortes del tag de apertura en candados de fuente.
Localiza el it con `grep -n "usa la ruta real sin cast Href"` (una coincidencia) y la
campana con `grep -n 'testID="home-alerts-bell"' src/screens/home/index.tsx`.
No uses numeros de linea: #84 va a mergear encima y los movera.

Orden EXACTO de tasks.md:
  (0)   N1 en src/screens/home/index.tsx (la linea de estilo de la campana pasa a
        `style={{ opacity: 1 }}`) con el test sin tocar -> VERDE 140/140. Guarda el
        log y el `git hash-object` del fichero: es la prueba de que el agujero existe
  R1+R2 commit ROJO: el it queda EXACTAMENTE como en tasks.md (titulo `#121 R1: ...`,
        anchor + block, expect(block).toMatch), con N1 aun puesta. Falla SOLO el
        `#121 R1` y SOLO por toMatch. Commit con index.tsx mutado + index.test.tsx
        commit VERDE: `git checkout HEAD~1 -- src/screens/home/index.tsx` (revierte N1)
  R2    las otras seis sondas (S1p, V7, N1n, W1, S2, S3) sobre el arbol verde:
        medir, apuntar, revertir cada una antes de la siguiente. No se commitean
  R3    las diez sondas de la tabla: medir, apuntar, revertir. No se commitean
  R4    comentario literal encima del `const block` + bloque literal en
        docs/conventions.md. Un commit de docs
  R5    cierre: diff acumulado de src/screens/home/index.tsx vacio; reporte y
        traceability.md en el ultimo commit

Ficheros que cambian en el diff acumulado: mobile-pet-tracker/src/screens/home/index.test.tsx,
docs/conventions.md, specs/mobile-home-bell-source-lock-unbounded/traceability.md y
progress/impl_mobile-home-bell-source-lock-unbounded.md. Nada mas.
src/screens/home/index.tsx solo se toca en el commit rojo y se revierte en el verde.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md. UI movil:
  docs/ui-guidelines.md (gate C8 del reviewer), aunque aqui no hay UI.
- Skills: NO cargues ninguna. Ni las del plugin expo (en tu catalogo v1.0.2 ninguna
  de las 13 aplica a un recorte de strings en un test de jest) ni las de
  .agents/skills/ (appllama-app-design-skill es obligatoria solo al disenar o cambiar
  una pantalla o un flujo, y aqui no se toca ninguna). La guia esta entera en
  tasks.md. Di en el reporte que no cargaste ninguna.
- TEST PRIMERO (C4 de CHECKPOINTS.md, via b): el rojo versiona la mutacion N1 de
  produccion y el verde la revierte, como en #109 y #112. Mutar un doble no vale. El
  rojo falla por su asercion (toMatch), nunca por otra asercion del it, un
  ReferenceError u otro test. Si falla por otra cosa, para.
- Mensajes de commit: los de tasks.md, literales.
- En src/screens/home/index.test.tsx NO escribas `#` + numero salvo en la forma
  `#121 R1`: una cita suelta (`#121`, `(#121)`, `#112/#121`) pone rojos cinco guards de
  src/__tests__/design-drift.test.ts. La palabra `StyleSheet` tampoco puede aparecer.
  El titulo y el comentario de R4 que da tasks.md ya pasan las regex del guard:
  copialos tal cual.
- NO toques: la regex de la receta, las otras tres aserciones del it (ruta /alerts,
  cast Href, icono <Bell ...>) ni su orden, la copia de la receta de reminders-see-all
  en index.tsx, el it `#112 R1` de reminders-see-all, elementWithTestId
  (consistency-classnames / legibility-classnames), src/i18n/catalog.ts,
  src/providers/__tests__/language-provider.test.tsx, las specs de #78, #112 y #114,
  package.json, bun.lock. Cero dependencias nuevas. Sin refactor ni helper compartido.
- Si una sonda no da el veredicto «Exigido», PARA y reportalo. No ajustes el recorte
  ni la regex para que cuadre. En particular, P1, P2 y P4 DEBEN quedar en verde: son
  puntos ciegos conocidos de #122; no intentes cerrarlos.
- Actualiza specs/mobile-home-bell-source-lock-unbounded/traceability.md con los
  hashes rojo -> verde y el de R4. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md, STATUS.md
  y el campo `status` de feature_list.json. Son artefactos de cierre del leader.
  Todo lo que tengas que contar va en progress/impl_mobile-home-bell-source-lock-unbounded.md.
- Si el sandbox te deniega un comando (por ejemplo `rm -f .expo/types/router.d.ts`),
  PARA y reportalo. No lo sustituyas por otro que haga lo mismo con otra herramienta
  (#112, Obs. 4).
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Todo desde mobile-pet-tracker/ (el candado abre join(process.cwd(), 'src/screens/home/index.tsx')).
  Los git y grep con rutas mobile-pet-tracker/... desde la raiz del repo, como indica tasks.md.
  bun / bunx. Nunca npx, nunca npm i -g.
- `rm -f .expo/types/router.d.ts` antes de tocar nada y antes de cada `bunx tsc --noEmit`.
- Jest siempre con --runTestsByPath. Tras cada corrida de un fichero, comprueba que
  jest imprime `Test Suites: 1`.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el codigo de tail.
- NO lances ./init.sh ni toques Postgres o LocalStack: son compartidos con el worktree
  de Backend. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint.

== BASE Y CIERRE ==

Base en f44cf3d5 (vuelve a medirla al empezar sobre el HEAD de la branch, 6df6581f o
posterior; encima solo hay commits de spec y progress):
  src/screens/home/index.test.tsx -> 140 tests, exit=0
  src/__tests__/design-drift.test.ts -> 55 tests, exit=0
  bunx jest -> 82 suites, 1452 tests, exit=0
  bunx tsc --noEmit y bunx expo lint -> exit=0
Si tu base difiere porque otra feature mergeo, vale TU base: el gate es el delta.
Cierre esperado: +0 suites y +0 tests; tsc y lint con exit=0; los greps de tasks.md
R4 (3) con el resultado indicado; R5 con git diff --exit-code en 0, el blob de
index.tsx en HEAD = dbb5b0346895cfc26705bee2257d1f8a8815df6c y en el commit rojo =
675ae7a1c18b400c234a9dbef2950c1175aaf026 si la base sigue en f44cf3d5.

Criterios de aceptacion: R1-R5 de requirements.md.

Al terminar, escribe progress/impl_mobile-home-bell-source-lock-unbounded.md con:
pwd y branch; skills cargadas (ninguna); la base medida; el log de (0) y el blob de N1;
los commits por R-id con hashes; el rojo de (1) con su linea de fallo y su
`Received string`; la tabla de las seis sondas de R2 y las diez de R3 con veredicto,
matcher y «otros»; comandos y salidas exactas del cierre; el delta; y cualquier
decision que la spec no cerrara literalmente.
```
