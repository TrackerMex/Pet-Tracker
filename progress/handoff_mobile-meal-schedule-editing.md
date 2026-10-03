# Handoff a Codex CLI — #147 mobile-meal-schedule-editing

> Pega el bloque de abajo en Codex CLI. La spec está firmada: commit de firma
> 86771e3e, aprobada vía Notion el 2026-10-02.
> Es una feature móvil. La prueba de humo en dev build de Android le toca al
> humano.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta estos cuatro comandos y pega sus salidas al
principio de progress/impl_mobile-meal-schedule-editing.md:
  pwd
  git branch --show-current
  git rev-parse --short HEAD
  git rev-parse --short HEAD~1
El hash de HEAD es H0. Es el commit que anade este handoff y es el «hash del
handoff» de tasks.md: todos los `git diff <hash-del-handoff>` de §Cierre se
miden contra el.
PARA si la branch no es feature/147-mobile-meal-schedule-editing o si
HEAD~1 no es 86771e3e.
No toques Pet-Tracker-wt-146 (es #146, en curso), Pet-Tracker-wt-backend,
Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills. No cambies de branch en
ningun worktree.

Feature: mobile-meal-schedule-editing (#147). Es la mitad movil de #103.
Branch: feature/147-mobile-meal-schedule-editing
Spec aprobada: specs/mobile-meal-schedule-editing/requirements.md
(status: approved).
Lee tambien, enteros: specs/mobile-meal-schedule-editing/design.md,
tasks.md y traceability.md. tasks.md es tu guion y lleva:
- §Arranque;
- §Esperas;
- §Mocks;
- §Tecnica TZ;
- §Cifras;
- los mensajes de commit literales;
- el rojo esperado de cada commit de test;
- las tablas de sondas;
- §Cierre.
En design.md, D1-D10 cierran las decisiones; §Estado y handler y las dos
§Anatomia fijan el arbol; §Archivos afectados es la lista cerrada.

== QUE HACES ==

El horario de comidas (src/screens/meal-schedule/index.tsx) deja de ser de
solo lectura para el owner:
- cada fila lleva un boton «Editar» que abre el selector nativo de hora
  (ExpoDateTimePicker de @expo/ui) y publica
  PATCH /pets/:petId/meal-times/:from;
- bajo la lista va «Añadir comida», que abre el selector a las 12:00 y
  publica POST /pets/:petId/meal-times.
Despues de un exito se refetchean el plan y la mascota, sin estado
optimista. Mientras dura, los controles quedan deshabilitados. Cada error
del contrato tiene su mensaje en linea. Quien no es owner no ve los
controles.

  R1  nueve claves mealSchedule.* en es/en y §2.16 en la spec de idioma
  R2  addMealTime (POST, 201 ok)
  R3  moveMealTime (PATCH, 200 ok, comparte el mapeo de R2)
  R4  controles solo para el owner
  R5  Editar abre el selector y publica el PATCH
  R6  Añadir comida abre el selector a las 12:00 y publica el POST
  R7  refetch tras exito, sin optimista, controles bloqueados
  R8  mensajes de error en linea
  R9  registro de la copy nueva en R6_FOOD

== BASE ==

HEAD contiene origin/main (cb14497c, merge de #103). El leader verifico,
el 2026-10-02 sobre 86771e3e, las cuatro medidas de tasks.md §Arranque
paso 3:
- la suma `260 + … + 11,` de language-provider.test.tsx esta en la linea 56;
- `toHaveLength(35 + 3 + 1 - 2 + 1)` de ui-language.test.ts esta en la
  linea 142;
- los dos literales `es` de common.* estan en catalog.ts;
- los recuentos de ui-copy-table.ts dan 4 y 1.
`.expo/types/router.d.ts` no existe. Repite las medidas igual. Si una no
da su valor, PARA y avisa. No re-anclas tu.

Base de referencia (la del init.sh del leader sobre cb14497c, exit 0):
movil 88 suites / 1710 tests. Cierre esperado: 88 / 1759, y no se anade
ninguna suite. El reparto por requisito esta en tasks.md §Cifras.

Choque previsto con #146 (wt-146, aun sin mergear): tocais los mismos
candados de catalogo. Si al arrancar la suma de la linea 56 ya no esta,
#146 mergeo antes. En ese caso aplica design.md §Conflicto previsto con
#146: anade SOLO `+ 9` a la suma que encuentres, toma el §2.N libre
siguiente y vuelve a medir la base. Si el choque aparece a mitad de
camino, PARA y avisa. No rebasees por tu cuenta.

== COMMITS ==

Mensajes LITERALES de tasks.md, en este orden (19 commits):
  test(mobile-meal-schedule-editing): lock nine meal schedule editing catalog keys (R1)
  feat(mobile-meal-schedule-editing): add meal schedule editing copy in es and en (R1)
  test(mobile-meal-schedule-editing): lock addMealTime request and state mapping (R2)
  feat(mobile-meal-schedule-editing): add addMealTime api client (R2)
  test(mobile-meal-schedule-editing): lock moveMealTime request and state mapping (R3)
  feat(mobile-meal-schedule-editing): add moveMealTime api client (R3)
  test(mobile-meal-schedule-editing): lock owner-only meal time controls (R4)
  feat(mobile-meal-schedule-editing): show edit and add meal controls to owners (R4)
  test(mobile-meal-schedule-editing): lock edit time picker and PATCH call (R5)
  feat(mobile-meal-schedule-editing): edit a meal time with the native time picker (R5)
  test(mobile-meal-schedule-editing): lock add meal picker and POST call (R6)
  feat(mobile-meal-schedule-editing): add a meal time with the native time picker (R6)
  test(mobile-meal-schedule-editing): lock refetch after success without optimistic state (R7)
  feat(mobile-meal-schedule-editing): refetch plan and pet after a meal time edit (R7)
  test(mobile-meal-schedule-editing): lock meal time edit error messages (R8)
  feat(mobile-meal-schedule-editing): show inline errors for meal time edits (R8)
  test(mobile-meal-schedule-editing): lock meal schedule editing copy registration (R9)
  feat(mobile-meal-schedule-editing): register meal schedule editing copy uses (R9)
  docs(mobile-meal-schedule-editing): fill #147 traceability
El ultimo lleva SOLO specs/mobile-meal-schedule-editing/traceability.md y
progress/impl_mobile-meal-schedule-editing.md. tasks.md no preve ningun
refactor. Si uno resulta imprescindible, va en su propio commit
`refactor(mobile-meal-schedule-editing): <que> (Rn)` despues de su verde y
lo explicas en el informe. En R8 esta PROHIBIDO extraer un mapa
clave->literal: rompe los candados de conteo.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md.
  El prefijo de describe es `#147 R<n>:` y nunca `#147` suelto.
- UI movil: rige docs/ui-guidelines.md (gate C8). Las skills que cargas de
  tu catalogo son `building-native-ui`, `native-data-fetching` y
  `expo-ui-jetpack-compose`, mas `appllama-app-design-skill` de
  .agents/skills/. No tienes skill de router ni de animacion: lo necesario
  esta en design.md. No pidas skills por otros nombres. Di en el informe
  cuales cargaste DE VERDAD. Si una skill choca con la carta, gana la
  carta. La regla de appllama «Optimistic by default» NO aplica (D6 y R7:
  sin estado optimista).
- TEST PRIMERO (C4 de CHECKPOINTS.md): por requisito, un commit ROJO
  (solo test, y los mocks de §Mocks que ese R anade) y un commit VERDE
  (produccion). Un commit con todo incumple C4; paso en #19. Cada rojo
  falla EXACTAMENTE los `it` que tasks.md declara para ese R, y por el
  motivo que declara:
  - por matcher, salvo donde diga otra cosa;
  - R2 y R3 por ausencia del export;
  - R8 por consulta en las 10 filas y en el ultimo `it`.
  R7 it 4 pasa en el rojo por construccion (via b). Lo sostiene la sonda
  «refetch en `finally`», y su resultado va al informe. Si falla otro
  `it`, PARA y reportalo. No ajustes ninguna asercion para que cuadre.
- §Esperas de tasks.md es OBLIGATORIA, igual que docs/conventions.md
  §Esperas sobre el arbol renderizado:
  - si un test asevera el arbol, se espera sobre el arbol;
  - cuando se mezclan mock y arbol, se usa UN solo `waitFor` conjunto;
  - NUNCA esperes a un contador de mock o a la cache de Query para
    consultar el arbol despues (eso paro #146 en R7);
  - toda ausencia se ancla en un nodo positivo del mismo estado;
  - todo `it` que dispara R5 o R6 acaba con la espera de cierre
    (meal-time-edit-0 sin `disabled: true`);
  - las ausencias de R4 se anclan con getQueryData sobre la clave LITERAL
    ['pets', 'detail', 'pet-1'].
  Antes de inventar un ancla, comprueba que puede cumplirse con la
  produccion correcta. Mira el nodo en el arbol de host, no en el JSX.
- Literales de copy: todo literal que asevere un test, en espanol o en
  ingles, se copia de requirements.md §Copy nueva. NUNCA lo traduzcas tu
  desde el otro idioma, porque el orden de palabras cambia (paso en #146
  R9). Antes de commitear cada rojo, comprueba con grep que sus literales
  nuevos de copy estan tal cual en esa tabla, y pega la comprobacion en el
  informe.
- Dobles: se escriben por la intencion de tasks.md §Mocks y se comprueban
  contra los ficheros que importa la pantalla. Solo los mocks de @expo/ui
  se calcan de src/screens/add-reminder/index.test.tsx, y petState y
  childTestIds de src/screens/geofences/index.test.tsx. Esta prescrito;
  verificalo igualmente contra el destino. El valor por defecto de
  getPet es petState('family'), para que las suites existentes no vean
  controles.
- TZ: sigue tasks.md §Tecnica TZ al pie de la letra. En el `finally`,
  `delete process.env.TZ` si el valor previo era undefined; nunca asignes
  undefined.
- Jest: siempre con bunx, nunca npx. Los filtros de tasks.md no llevan
  parentesis. Si filtras algo de src/app/(tabs)/, escapa los parentesis:
  `'src/app/\(tabs\)/…'`. Sin escapar, jest salta el fichero con exit 0.
  Tras cada comando, el numero de suites que imprime jest debe coincidir
  con el de ficheros pedidos.
- Typecheck: ejecuta `test ! -e .expo/types/router.d.ts` antes de CADA
  typecheck. Si el fichero existe, PARA y pide al humano que lo borre.
  Nunca `rm -f`, que tu sandbox deniega (#121).
- Sin dependencias nuevas: ni `bun add`, ni cambios en package.json,
  bun.lock o app.json. Todo con bun/bunx.
- NO lances ./init.sh ni los e2e del backend, y no toques Postgres ni
  LocalStack: los comparte otra sesion. ./init.sh lo corre el leader antes
  del reviewer.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Antes de la suite entera,
  `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` debe salir
  vacio. Si no lo esta, espera: con carga salen rojos falsos (#133).
- Para restaurar un fichero tras una sonda, usa
  `git checkout HEAD -- <ruta>`. Despues `git diff --cached --stat` debe
  salir vacio. Nunca uses `git checkout <commit> -- <ruta>` (deja el
  cambio en el indice), ni git stash, ni rm -f.
- Rellena traceability.md con los hashes solo en el ultimo commit. No
  rebasees despues de escribir hashes.
- No crees recursos AWS ni corras cdk. No toques backend-pet-tracker/.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Los escribe el leader tras el veredicto
  del reviewer. Todo lo que tengas que contar va en
  progress/impl_mobile-meal-schedule-editing.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
exactamente los 11 de design.md §Archivos afectados. Nada mas.

Criterios de aceptacion: R1-R9 de requirements.md, mas los criterios no
funcionales de esa misma spec. La prueba de humo es del humano: no la
marques.

Al terminar, escribe progress/impl_mobile-meal-schedule-editing.md con:
- pwd, branch, H0 y HEAD~1;
- las skills cargadas;
- las medidas de §Arranque;
- los commits, con hash y R-id;
- por cada rojo: el comando, las cuentas, el exit y cada `it` rojo con su
  matcher, Expected y Received (o la consulta que falla);
- la comprobacion de literales contra §Copy nueva;
- por cada verde: sus cuentas y su exit;
- cada sonda de las tablas de tasks.md con el `it` que cae, o cuales no
  corriste y por que, incluida la via (b) de R7;
- el cierre (bun run test, bun run lint, typecheck), cada uno con su exit
  y sus cifras;
- los tres grep-clean de §Cierre paso 2, con su salida vacia;
- el `git diff --name-only H0..HEAD`;
- cualquier decision que la spec no cerrara literalmente.
De jest copia solo las lineas de resumen y los bloques `●` de cada `it`
rojo. NO pegues los console.info de HeroUI ni los console.warn de Uniwind.
```

---

## Reanudación 1: parada en §Cierre (2026-10-02)

> Codex paró en §Cierre con HEAD `b5d46054`. La parada fue correcta, porque
> el handoff exige «si falla otro `it`, PARA». `bun run test` dio 88/1759,
> exit 1, con tres rojos en candados globales que la spec no movía:
>
> - `#87 R19`: el inventario de `signOut(` de meal-schedule pasa de 1 a 2;
> - `#98 R10` y `#64 R9`: los usos de `bg-accent-soft` pasan de 16 a 18.
>
> El leader los reproduce: 3 rojos de 108 en los dos ficheros. La
> producción cumple la spec; el hueco estaba en ella. El humano aprueba la
> **Enmienda E1** en el chat. La firma es el commit que añade esta
> reanudación. E1 añade dos commits de test, uno por fichero, y la lista
> cerrada pasa a 13 ficheros. También deja por escrito la técnica TZ de
> `2c873c47`, que el humano confirma haber autorizado. Los dos refactors
> (`2c873c47` y `b5d46054`) se quedan; los juzga el reviewer.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 1 de #147 tras tu parada en §Cierre. Ejecuta y pega en el
informe:
  pwd
  git branch --show-current
  git rev-parse --short HEAD
  git rev-parse --short HEAD~1
  git rev-parse --short HEAD~2
  git status --short
PARA si:
- la branch no es feature/147-mobile-meal-schedule-editing;
- HEAD~1 no es 98cc1154 (la enmienda);
- HEAD~2 no es b5d46054 (tu ultimo commit);
- `git status --short` muestra algo distinto de
  `?? progress/impl_mobile-meal-schedule-editing.md`.
HEAD es el commit del leader que firma E1 y anade esta reanudacion. Lee:
- requirements.md §Enmienda E1;
- tasks.md §Enmienda E1 y la nota E1.2 de §Tecnica TZ;
- la seccion «Reanudacion 1» de progress/handoff_mobile-meal-schedule-editing.md.
Siguen en vigor todas las reglas del handoff original. H0 sigue siendo
b367ed44.

La produccion es correcta: NO la cambies.

1. Desde mobile-pet-tracker/, sin pipe, mide el rojo de partida:
     bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/147-e1-base.txt 2>&1; echo "exit=$?"
   Esperado: 2 suites, 3 fallan de 108, exit=1. Son los tres `it` de
   requirements.md §Enmienda E1. Si sale otra cosa, PARA.

2. E1-a. Haz las ediciones literales de tasks.md §Enmienda E1-a en
   src/__tests__/consistency-classnames.test.ts. Localizalas por contenido,
   no por numero de linea. Repite el comando del paso 1: esperado 1 falla
   (el de #87 R19) y exit=1. Commit SOLO con ese fichero y este mensaje
   literal:
     test(mobile-meal-schedule-editing): count the meal time controls among accent-soft uses (R4)

3. E1-b. Haz la edicion literal de tasks.md §Enmienda E1-b en
   src/__tests__/design-drift.test.ts. Repite el comando: esperado 0
   fallan de 108 y exit=0. Commit SOLO con ese fichero y este mensaje
   literal:
     test(mobile-meal-schedule-editing): count the meal schedule 401 sign-out (R8)
   Despues de cada commit, comprueba con `git show --stat HEAD` que lleva
   un solo fichero.

4. Corre las sondas de las dos tablas de tasks.md §Enmienda E1 sobre el
   verde. Despues de cada una, restaura con `git checkout HEAD -- <ruta>`
   y comprueba que `git diff --cached --stat` sale vacio.

5. §Cierre de tasks.md, entero y en orden:
   - el pgrep vacio;
   - `bun run test`: 88 suites / 1759 tests y exit 0;
   - `bun run lint`: exit 0;
   - `test ! -e .expo/types/router.d.ts && bun run typecheck`: exit 0;
   - los tres grep-clean, vacios.
   Cada comando a fichero, sin pipe, con su exit. Si algo falla, PARA y
   reporta: no ajustes ninguna asercion.

6. Rellena specs/mobile-meal-schedule-editing/traceability.md. En la fila
   de R4 cita tambien el commit de E1-a, y en la de R8 el de E1-b. Despues,
   un solo commit con SOLO traceability.md y
   progress/impl_mobile-meal-schedule-editing.md, con el mensaje literal de
   tasks.md:
     docs(mobile-meal-schedule-editing): fill #147 traceability
   No rebasees despues.

Listas del cierre:
- Commits tuyos: los 20 que ya tienes (los 18 C4, 2c873c47 y b5d46054),
  mas E1-a, E1-b y el de trazabilidad. Son 23.
- Ficheros que cambian TUS commits: los 13 de design.md §Archivos
  afectados.
- El `git diff --name-only H0..HEAD` incluye ademas cinco ficheros que
  cambian los commits del leader (98cc1154 y el de esta reanudacion), y no
  cuentan como tuyos:
  - specs/mobile-meal-schedule-editing/requirements.md
  - specs/mobile-meal-schedule-editing/design.md
  - specs/mobile-meal-schedule-editing/tasks.md
  - progress/current.md
  - progress/handoff_mobile-meal-schedule-editing.md
  Pega ese diff completo y senala esos cinco.

No lances ./init.sh. No hagas push. No abras la PR.

Informe: en progress/impl_mobile-meal-schedule-editing.md, una seccion
«Reanudacion 1» con:
- las salidas del paso 0;
- las cuentas y el exit de los pasos 1, 2 y 3;
- el `git show --stat` de cada commit;
- cada sonda con su diff y el `it` que cae;
- el cierre completo, con exit y cifras.
De jest copia solo las lineas de resumen y los bloques `●` de cada `it`
rojo.
```

## Reanudación 2: rechazo del reviewer en R7 (2026-10-02)

> El reviewer rechaza en `d05d8725` (`progress/review_mobile-meal-schedule-editing.md`).
> El motivo único es que R7 tiene dos cláusulas sin candado: el flujo Añadir
> no tiene test de R7, y «ningún refetch si no es ok» solo está candado para
> `MEAL_TIME_DUPLICATE`. Hay 13 mutaciones de producción que pasan en verde.
> La producción cumple. El hueco viene de tasks.md §R7, que solo prescribió el
> flujo Editar; Codex hizo lo prescrito. El humano aprueba la **Enmienda E2**
> en el chat, y la firma es el commit que añade esta reanudación. E2 añade dos
> commits de test, los dos solo sobre `index.test.tsx`. Las cifras pasan a
> 88/1762 y la lista cerrada sigue en 13 ficheros.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 2 de #147 tras el rechazo del reviewer. Ejecuta y pega en el
informe:
  pwd
  git branch --show-current
  git rev-parse --short HEAD
  git rev-parse --short HEAD~1
  git status --short
PARA si:
- la branch no es feature/147-mobile-meal-schedule-editing;
- HEAD~1 no es d05d8725 (tu commit de trazabilidad);
- `git status --short` no sale vacio.
HEAD es el commit del leader que firma E2 y anade esta reanudacion. Lee:
- requirements.md §Enmienda E2;
- tasks.md §Enmienda E2 (y §Esperas, que sigue obligatoria);
- progress/review_mobile-meal-schedule-editing.md §Observaciones 1;
- la seccion «Reanudacion 2» de progress/handoff_mobile-meal-schedule-editing.md.
Siguen en vigor todas las reglas del handoff original. H0 sigue siendo
b367ed44. No rebasees ni enmiendes ningun commit anterior.

La produccion es correcta: NO la cambies. Solo tocas
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx, y despues
traceability.md y tu informe.

1. Desde mobile-pet-tracker/, sin pipe:
     bunx jest src/screens/meal-schedule > /tmp/147-e2-base.txt 2>&1; echo "exit=$?"
   Esperado: 1 suite, 51/51, exit=0. Si sale otra cosa, PARA.

2. E2-a. Anade las dos lineas literales de tasks.md §Enmienda E2-a en sus
   dos sitios, localizandolos por contenido. Repite el comando: esperado
   51/51 y exit=0. Si algun `it` sale rojo, PARA: la premisa es falsa y lo
   decide el leader. Commit SOLO con ese fichero y este mensaje literal:
     test(mobile-meal-schedule-editing): lock no refetch on every failed meal time edit (R7)

3. E2-b. Anade los tres `it` literales de tasks.md §Enmienda E2-b donde
   indica. Repite el comando: esperado 54/54 y exit=0. Si sale rojo, PARA.
   Commit SOLO con ese fichero y este mensaje literal:
     test(mobile-meal-schedule-editing): lock refetch and disabled controls for added meal times (R7)
   Despues de cada commit, comprueba con `git show --stat HEAD` que lleva
   un solo fichero.

4. Corre las 13 sondas y el control de la tabla de tasks.md §Enmienda E2,
   cada una por separado sobre el verde, con el comando del paso 1. Cada
   sonda debe caer en el `it` y del modo (matcher o consulta) que dice la
   tabla. Despues de cada una restaura con
     git checkout HEAD -- src/screens/meal-schedule/index.tsx
   y comprueba que `git diff --cached --stat` y `git status --short` salen
   vacios. Si alguna sonda sale verde o cae distinto, PARA y reporta.

5. §Cierre de tasks.md, entero y en orden:
   - el pgrep vacio;
   - `bun run test`: 88 suites / 1762 tests y exit 0;
   - `bun run lint`: exit 0;
   - `test ! -e .expo/types/router.d.ts && bun run typecheck`: exit 0;
   - los tres grep-clean, vacios.
   Cada comando a fichero, sin pipe, con su exit. Si algo falla, PARA y
   reporta: no ajustes ninguna asercion.

6. En specs/mobile-meal-schedule-editing/traceability.md, la fila R7 cita
   tambien los dos commits de E2 y sus tests: las filas del it.each de R8 y
   el 401 (E2-a), y los tres `it` nuevos de R7 (E2-b). Despues, un solo
   commit con SOLO traceability.md y
   progress/impl_mobile-meal-schedule-editing.md, con este mensaje literal:
     docs(mobile-meal-schedule-editing): cite amendment E2 in #147 traceability
   No rebasees despues.

Listas del cierre:
- Commits tuyos: los 23 que ya tienes, mas E2-a, E2-b y el de trazabilidad.
  Son 26.
- Ficheros que cambian TUS commits: los mismos 13 de design.md §Archivos
  afectados.
- El `git diff --name-only H0..HEAD` incluye ademas seis ficheros que
  cambian los commits del leader (98cc1154, d8edb20e y el de esta
  reanudacion), y no cuentan como tuyos:
  - specs/mobile-meal-schedule-editing/requirements.md
  - specs/mobile-meal-schedule-editing/design.md
  - specs/mobile-meal-schedule-editing/tasks.md
  - progress/current.md
  - progress/handoff_mobile-meal-schedule-editing.md
  - progress/review_mobile-meal-schedule-editing.md
  Pega ese diff completo y senala esos seis.

No lances ./init.sh. No hagas push. No abras la PR.

Informe: en progress/impl_mobile-meal-schedule-editing.md, una seccion
«Reanudacion 2» al final con:
- las salidas del paso 0;
- las cuentas y el exit de los pasos 1, 2 y 3;
- el `git show --stat` de cada commit;
- cada sonda con su diff y el `it` que cae, y el modo (matcher/consulta);
- el cierre completo, con exit y cifras.
De jest copia solo las lineas de resumen y la primera linea del bloque `●`
de cada `it` rojo.
```

## Reanudación 3: segundo rechazo del reviewer en R7 (2026-10-03)

> El reviewer rechaza la ronda 2 en `c918e756` (`progress/review_mobile-meal-schedule-editing.md`
> §Ronda 2). E2 cierra sus 13 sondas sin regresiones, pero queda otra cláusula
> de R7 sin candado: «rehabilitar solo cuando hayan terminado los dos». Ningún
> test retiene la segunda llamada a `getPet`, y dos mutaciones de la rama `ok`
> pasan en verde. La producción cumple; el hueco vuelve a ser de la spec. El
> borrador de E3 (`65b7434b`) lo pre-verificó el reviewer: 56/56 en tres
> corridas, y las dos sondas rojas por matcher. El humano aprueba la **Enmienda
> E3** en el chat, y la firma es el commit que añade esta reanudación. E3 es
> un commit de test, solo sobre `index.test.tsx`. Las cifras pasan a 88/1764 y
> la lista cerrada sigue en 13 ficheros.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 3 de #147 tras el segundo rechazo del reviewer. Ejecuta y pega
en el informe:
  pwd
  git branch --show-current
  git log --oneline -3
  git status --short
PARA si:
- la branch no es feature/147-mobile-meal-schedule-editing;
- el tercer commit de `git log --oneline -3` no es c918e756 (tu trazabilidad
  de E2);
- `git status --short` no sale vacio.
Los dos commits de encima son del leader: el borrador de E3 (65b7434b) y la
firma de E3, que anade esta reanudacion. Lee:
- requirements.md §Enmienda E3;
- tasks.md §Enmienda E3 (y §Esperas, que sigue obligatoria);
- progress/review_mobile-meal-schedule-editing.md §Ronda 2;
- la seccion «Reanudacion 3» de progress/handoff_mobile-meal-schedule-editing.md.
Siguen en vigor todas las reglas del handoff original. H0 sigue siendo
b367ed44. No rebasees ni enmiendes ningun commit anterior.

La produccion es correcta: NO la cambies. Solo tocas
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx, y despues
traceability.md y tu informe.

1. Desde mobile-pet-tracker/, sin pipe:
     bunx jest src/screens/meal-schedule > /tmp/147-e3-base.txt 2>&1; echo "exit=$?"
   Esperado: 1 suite, 54/54, exit=0. Si sale otra cosa, PARA.

2. E3-a. Anade los dos `it` literales de tasks.md §Enmienda E3-a donde
   indica, localizando el sitio por contenido. Repite el comando: esperado
   56/56 y exit=0. Si algun `it` sale rojo, PARA: la premisa es falsa y lo
   decide el leader. Commit SOLO con ese fichero y este mensaje literal:
     test(mobile-meal-schedule-editing): lock disabled controls until the pet detail refetch ends (R7)
   Comprueba con `git show --stat HEAD` que lleva un solo fichero.

3. Corre las 2 sondas de la tabla de tasks.md §Enmienda E3, cada una por
   separado sobre el verde, con el comando del paso 1. Las dos deben caer en
   los dos `it` de E3-a, por matcher en `disabled: true`. Despues de cada
   una restaura con
     git checkout HEAD -- src/screens/meal-schedule/index.tsx
   y comprueba que `git diff --cached --stat` y `git status --short` salen
   vacios. Si alguna sonda sale verde o cae distinto, PARA y reporta.

4. §Cierre de tasks.md, entero y en orden:
   - el pgrep vacio;
   - `bun run test`: 88 suites / 1764 tests y exit 0;
   - `bun run lint`: exit 0;
   - `test ! -e .expo/types/router.d.ts && bun run typecheck`: exit 0;
   - los tres grep-clean, vacios.
   Cada comando a fichero, sin pipe, con su exit. Si algo falla, PARA y
   reporta: no ajustes ninguna asercion.

5. En specs/mobile-meal-schedule-editing/traceability.md, la fila R7 cita
   tambien el commit de E3-a y sus dos `it`. Despues, un solo commit con
   SOLO traceability.md y progress/impl_mobile-meal-schedule-editing.md, con
   este mensaje literal:
     docs(mobile-meal-schedule-editing): cite amendment E3 in #147 traceability
   No rebasees despues.

Listas del cierre:
- Commits tuyos: los 26 que ya tienes, mas E3-a y el de trazabilidad.
  Son 28.
- Ficheros que cambian TUS commits: los mismos 13 de design.md §Archivos
  afectados.
- El `git diff --name-only H0..HEAD` incluye ademas seis ficheros que
  cambian los commits del leader (98cc1154, d8edb20e, f26f85fd, 65b7434b y
  el de esta reanudacion), y no cuentan como tuyos:
  - specs/mobile-meal-schedule-editing/requirements.md
  - specs/mobile-meal-schedule-editing/design.md
  - specs/mobile-meal-schedule-editing/tasks.md
  - progress/current.md
  - progress/handoff_mobile-meal-schedule-editing.md
  - progress/review_mobile-meal-schedule-editing.md
  Pega ese diff completo y senala esos seis.

No lances ./init.sh. No hagas push. No abras la PR.

Informe: en progress/impl_mobile-meal-schedule-editing.md, una seccion
«Reanudacion 3» al final con:
- las salidas del paso 0;
- las cuentas y el exit de los pasos 1 y 2;
- el `git show --stat` del commit;
- cada sonda con su diff, los `it` que caen y el modo (matcher/consulta);
- el cierre completo, con exit y cifras.
De jest copia solo las lineas de resumen y la primera linea del bloque `●`
de cada `it` rojo.
```
