# Handoff a Codex CLI — #112 mobile-reminders-see-all-source-lock-nesting

> Pegar el bloque de abajo en Codex CLI. La spec esta firmada (commit
> `f61260b6`, aprobacion via Notion).

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd` y `git branch --show-current` y pega las dos
salidas al principio de progress/impl_mobile-reminders-see-all-source-lock-nesting.md.
Para si la branch no es feature/112-mobile-reminders-see-all-source-lock-nesting.
No toques /home/claude/sites/Pet-Tracker-wt-backend (otra sesion trabaja alli en
#84) ni cambies de branch en ningun worktree.

Feature: mobile-reminders-see-all-source-lock-nesting (#112), branch: feature/112-mobile-reminders-see-all-source-lock-nesting
Spec aprobada: specs/mobile-reminders-see-all-source-lock-nesting/requirements.md (status: approved)
Lee tambien, enteros: specs/mobile-reminders-see-all-source-lock-nesting/design.md,
tasks.md y traceability.md. tasks.md es tu guion paso a paso: tiene las mutaciones,
el texto literal de R4 y los comandos. El molde es #109
(specs/mobile-meal-toggle-source-lock-nesting/), ya mergeada y aprobada por el reviewer.

== QUE HACES ==

Un cambio SOLO de test. El candado de fuente de reminders-see-all en
mobile-pet-tracker/src/screens/home/index.test.tsx recorta hoy de `<Pressable` a
`</Pressable>`; pasa a recortar de `<` a `<` (el tag de apertura propio), el patron
ya fijado en docs/conventions.md §Recortes del tag de apertura en candados de fuente.
Localizalo con `grep -n "lastIndexOf('<Pressable'"` (una coincidencia). Los numeros de
linea que citan feature_list y docs/conventions.md estan caducados: no los uses.

Orden EXACTO de tasks.md:
  (0)   N1 en src/screens/home/index.tsx con el test sin tocar -> VERDE 140/140. Guarda
        el log: es la prueba de que el agujero existe
  R1+R2 commit ROJO: recorte nuevo + renombrado del it, con N1 aun puesta. Falla SOLO el
        `#112 R1` y SOLO por toMatch. Commit con index.tsx mutado + index.test.tsx
        commit VERDE: `git checkout HEAD~1 -- src/screens/home/index.tsx` (revierte N1)
  R2    W1 sobre el arbol verde: medir, apuntar, revertir. No se commitea
  R3    las doce sondas de la tabla: medir, apuntar, revertir cada una antes de la
        siguiente. No se commitean
  R4    comentario literal encima del `const block` + parrafo literal en
        docs/conventions.md. Un commit de docs
  R5    cierre: diff acumulado de src/screens/home/index.tsx vacio

Ficheros que cambian en el diff acumulado: mobile-pet-tracker/src/screens/home/index.test.tsx,
docs/conventions.md, specs/mobile-reminders-see-all-source-lock-nesting/traceability.md y
progress/impl_mobile-reminders-see-all-source-lock-nesting.md. Nada mas.
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
  produccion y el verde la revierte, como en #109. Mutar un doble no vale. El rojo
  falla por su asercion (toMatch), nunca por toBe(1), un ReferenceError u otro test.
  Si falla por otra cosa, para.
- Mensajes de commit: los de tasks.md, literales.
- En src/screens/home/index.test.tsx NO escribas `#` + numero salvo en la forma
  `#112 R1`: una cita suelta (`#112`, `#109/#112`) pone rojos cinco guards de
  src/__tests__/design-drift.test.ts. La palabra `StyleSheet` tampoco puede aparecer.
  El comentario de R4 que da tasks.md ya pasa las tres regex del guard: copialo tal cual.
- NO toques: la regex de la receta, el ancla, opacityOf, la pata de arbol,
  elementWithTestId (consistency-classnames / legibility-classnames), el candado de la
  campana (#78 R10), src/i18n/catalog.ts, src/providers/__tests__/language-provider.test.tsx,
  specs/mobile-home-reminders-section/traceability.md, package.json, bun.lock.
  Cero dependencias nuevas.
- Si una sonda no da el veredicto «Exigido», PARA y reportalo. No ajustes el recorte
  ni la regex para que cuadre.
- Actualiza specs/mobile-reminders-see-all-source-lock-nesting/traceability.md con los
  hashes rojo -> verde y el de R4. No rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md, STATUS.md
  y el campo `status` de feature_list.json. Son artefactos de cierre del leader.
  Todo lo que tengas que contar va en progress/impl_mobile-reminders-see-all-source-lock-nesting.md.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Todo desde mobile-pet-tracker/ (el candado abre join(process.cwd(), 'src/screens/home/index.tsx')).
  bun / bunx. Nunca npx, nunca npm i -g.
- `rm -f .expo/types/router.d.ts` antes de tocar nada y antes de cada `bunx tsc --noEmit`.
- Jest siempre con --runTestsByPath. Tras cada corrida de un fichero, comprueba que
  jest imprime `Test Suites: 1`.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve el codigo de tail.
- NO lances ./init.sh ni toques Postgres o LocalStack: son compartidos con el worktree
  de Backend. Se mide con bunx jest, bunx tsc --noEmit y bunx expo lint.

== BASE Y CIERRE ==

Base en 993b62fa (vuelve a medirla al empezar sobre el HEAD de la branch, f61260b6 o
posterior; encima solo hay commits de spec y progress):
  src/screens/home/index.test.tsx -> 140 tests, exit=0
  bunx jest --silent -> 82 suites, 1452 tests, exit=0
  bunx tsc --noEmit y bunx expo lint -> exit=0 y salida VACIA
Si tu base difiere porque otra feature mergeo, vale TU base: el gate es el delta.
Cierre esperado: +0 suites y +0 tests; tsc y lint con exit=0 y salida vacia; los
greps de tasks.md R4 (3) con exit=1; R5 con git diff --exit-code en 0 y el blob de
index.tsx en dbb5b0346895cfc26705bee2257d1f8a8815df6c si la base sigue en 993b62fa.

Criterios de aceptacion: R1-R5 de requirements.md.

Al terminar, escribe progress/impl_mobile-reminders-see-all-source-lock-nesting.md con:
pwd y branch; skills cargadas (ninguna); la base medida; el log de (0); los commits
por R-id con hashes; el rojo de (1) con su linea de fallo y su `Received string`; la
tabla de W1 y las doce sondas de R3 con veredicto y matcher; comandos y salidas
exactas del cierre; el delta; y cualquier decision que la spec no cerrara literalmente.
```
