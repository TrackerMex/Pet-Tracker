# Handoff a Codex CLI — #105 meals-history

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> 35b21a0d, aprobación vía Notion el 2026-10-03). Feature backend + móvil.
> La prueba de humo H1 en dev build de Android es del humano.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse --short HEAD` y pega las tres salidas al principio de
progress/impl_meals-history.md. El hash es H0 (el commit que anade este
handoff) y es tu «HEAD del handoff»: todos los `git diff` de cierre se
miden contra el. Para si la branch no es feature/105-meals-history.
No toques Pet-Tracker-wt-icon (sesion de #101), Pet-Tracker-wt-146,
Pet-Tracker-wt-backend, Pet-Tracker-wt-ui, pet-tracker-43 ni pt-skills, ni
cambies de branch en ningun worktree.

Feature: meals-history (#105)
Branch: feature/105-meals-history
Spec aprobada: specs/meals-history/requirements.md (status: approved)
Lee tambien, enteros: specs/meals-history/design.md, tasks.md y
traceability.md. tasks.md es tu guion: §Preparacion, el ORDEN de los
bloques (R2, R1, R3, R4 en backend; R5, R10, R6, R7, R8, R9, R11, R12,
R13, R14, R15 en movil), el comando de cada test y el rojo esperado por
paso. design.md trae las decisiones D1-D17, §Archivos afectados por capa
y la tabla «Candados de inventario que #105 mueve».

== QUE HACES ==

Historial de comidas servidas por mes. Backend: metodo de rango
listServedBetween en el puerto MealServingRepository y su unica
implementacion Drizzle, tres errores de dominio copiados de activity,
caso de uso GetMealsHistoryUseCase (valida, resuelve el dia civil del
dueno con ownerLocalDay, rellena huecos con listDays, ventana maxima 31
dias) y endpoint GET /v1/pets/:petId/meals?from&to con query estricta.
Movil: pantalla de pila meals-history (route delgado + src/screens/)
con calendario lunes-primero, punto por dia servido, tope en el mes de
«hoy», detalle inline al tocar y entrada por un Card nuevo en la pestana
Food. Toda la aritmetica de calendario en src/utils/month-grid.ts sobre
cadenas y Date.UTC.

  R2   constante MEALS_HISTORY_MAX_RANGE_DAYS, tres errores, mapper
  R1   listServedBetween en puerto + Drizzle (rojo por tsc)
  R3   GetMealsHistoryUseCase
  R4   @Get() en MealsController, DTO estricto, modulo, e2e (cubre R1/R2)
  R5   nueve claves en/es + §2.18 + filas de ui-copy-table + candados
  R10  src/utils/month-grid.ts (ocho funciones puras)
  R6   getMealsHistory + MealsHistoryState + tipos
  R7   nutritionKeys.mealsHistory
  R8   route delgado, duodecimo Stack.Screen, navegacion y guarda
  R9   cuatro estados de pantalla
  R11  rejilla y celdas (seis decisiones por celda)
  R12  navegacion de meses con tope
  R13  detalle inline
  R14  Card de entrada en Food
  R15  candados de drift (nace verde si todo esta limpio)

== BASE ==

HEAD de la branch contiene origin/main (d29d49d5). Comprobacion:
`git merge-base --is-ancestor d29d49d5 HEAD; echo "exit=$?"` -> exit=0.

El leader verifico en este arbol el 2026-10-03 todas las anclas de
design.md §Candados y de requirements.md (rutas, simbolos y las
expresiones literales de cada candado). Repitelas con grep al arrancar:
si alguna no da su contenido, PARA y avisa; no re-anclas tu. Ojo con
una: el candado `#65 R12` de language-provider.test.tsx esta partido en
tres lineas y la suma termina en `+ 2 + 9,` en su propia linea; el
`+ 9` de #105 va antes de esa coma y el comentario `// #105 R5` despues.

Base medida por el leader con ./init.sh sobre d29d49d5 (EXIT=0):
  movil   bunx jest: 90 suites / 1913 tests / 1 snapshot
  backend pnpm test: 174 suites / 1335 tests
  backend pnpm test:e2e: 28 suites pasan, 3 skipped (31) / 423 passed,
          8 skipped (431)
Mide tu la base ANTES del primer rojo (jest movil, pnpm test y tsc en
los dos lados, sin pipe) y copia las lineas de resumen al reporte. Si
tu medida difiere de la del leader, manda la tuya y dilo. Delta
esperado al cierre: +2 suites en movil (month-grid.test.ts e
index.test.tsx de la pantalla), +2 en backend unit (mapper spec y use
case spec), +1 en e2e (meals-history.e2e-spec.ts); 0 skipped nuevos.
El numero de tests nuevos lo cuentas tu por fichero y lo pones en el
reporte.

Postgres y LocalStack ya estan levantados por el init.sh del leader y
los comparte otra sesion. Los e2e de R4 (`pnpm test:e2e -- test/meals-history.e2e-spec.ts`)
los corres contra esa base. NO lances ./init.sh ni docker compose.

== COMMITS ==

Dos commits por R-id como minimo, en el orden de arriba: primero
`test(<scope>): <que> (#105 R<n>)` con SOLO los tests (y los candados
de inventario que tasks.md asigna a ese bloque), despues
`feat(<scope>): <que> (#105 R<n>)` con la produccion minima. Scopes:
`nutrition` para backend, `mobile` para movil. Refactor, si lo hay, en
su propio `refactor(<scope>): <que> (#105 R<n>)` tras el verde. El rojo
de R1 es por tsc (`pnpm exec tsc --noEmit`), no por jest: tasks.md lo
explica; su mensaje literal es
  test(nutrition): declara listServedBetween en el puerto (#105 R1)
Si R15 nace verde, su commit se llama
  test(mobile): candados de drift para meals-history (#105 R15)
y el reporte dice que nacio verde y por que (es candado, no conducta).
Ultimo commit: `docs(meals-history): fill #105 traceability` con SOLO
specs/meals-history/traceability.md y progress/impl_meals-history.md.
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md
  (prefijo de feature en describe: `#105 R<n>:`, nunca `#105` suelto;
  §Tests y §«Esperas sobre el arbol renderizado»).
- ESPERAS (docs/conventions.md §Esperas sobre el arbol renderizado): si
  un test asevera el arbol, la espera es `waitFor` sobre el arbol. Nunca
  esperes a un contador de mock ni a la cache de Query y consultes el
  arbol despues. Una asercion de ausencia se ancla antes a la aparicion
  o al estado final de un nodo del mismo escenario (en esta pantalla:
  a `meals-history-grid` o a la desaparicion de `meals-history-skeleton`).
  Sin `UNSAFE_*` de RNTL. Sin `process.env.TZ` (jest lo ignora): el reloj
  es `jest.useFakeTimers({ now: Date.UTC(2026, 0, 15, 12) })` y toda la
  aritmetica va por cadenas y Date.UTC (design.md D14).
- LITERALES DE COPY: todo literal que asevere un test, en espanol o en
  ingles, se copia de la tabla de requirements.md R5. NUNCA lo traduzcas
  tu desde el otro idioma. Antes de commitear cada rojo, grep de los
  literales nuevos contra esa tabla y pega la comprobacion en el reporte.
- UI movil: docs/ui-guidelines.md rige (gate C8). Skills de tu plugin
  expo a cargar: `building-native-ui` y `native-data-fetching`. Skill
  del repo a cargar: .agents/skills/appllama-app-design-skill
  (obligatoria para una pantalla nueva, con los limites que
  docs/ui-guidelines.md le pone). NO hay skill de expo-router en tu
  catalogo: lo de la ruta y la pila esta en requirements.md R8 y
  design.md D12/D13. No pidas skills por otros nombres. Di en el reporte
  cuales cargaste.
- TEST PRIMERO (C4 de CHECKPOINTS.md): cada rojo falla por la razon que
  requirements.md declara para ese R-id («Modo de fallo en rojo»): por
  consulta (`Unable to find an element with testID`), por valor o por
  modulo inexistente cuando la spec lo dice asi; nunca por SyntaxError
  ni TypeError no previstos. Si falla otro `it` ajeno, PARA y reportalo.
  No ajustes ninguna asercion ni ningun candado ajeno para que cuadre:
  los candados de inventario se suben SOLO con el `+ N // #105 R<n>` que
  fija design.md §Candados, en el bloque que tasks.md indica.
- Rojo transitorio aceptado (tasks.md R5): el candado `#65 R6` de
  ui-language.test.ts queda rojo desde R5 hasta que existan las llamadas
  `t('…')` de R9-R14, porque `checkUses` grepea los ficheros destino.
  Anotalo en el reporte en cada corrida intermedia y comprueba que vuelve
  a verde en R14.
- R8 registra la ruta como ULTIMO hijo de Stack.Protected (despues de
  pets/[petId]/geofence-editor), nunca tras `pairing`: lo contrario
  rompe los candados indexados de layout.test.tsx (design.md D13).
- Dobles: por la intencion de la spec y comprobados contra los ficheros
  que importa la pantalla (harness de src/screens/meal-schedule/index.test.tsx
  como base, requirements.md R9). No calques mocks de otra suite sin
  verificar que casan con lo que importa src/screens/meals-history/index.tsx.
- Jest movil: cada ruta ENTRE COMILLAS SIMPLES y con los parentesis
  escapados: `bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx'`
  (sin escapar es regex y jest salta el fichero con exit 0). Tras cada
  comando, el numero de suites que imprime jest debe ser el de ficheros
  pedidos.
- Typecheck movil: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bun run typecheck`. Si existe, PARA y pide al humano que lo borre.
  Nunca `rm -f` (tu sandbox lo deniega).
- Sin dependencias nuevas: ni `bun add` ni `pnpm add`; cero cambios en
  package.json, bun.lock, pnpm-lock.yaml ni app.json. Movil con bun/bunx,
  nunca npm/npx. Backend con pnpm.
- Backend: no se tocan PetMealsReader, pet-meals.drizzle-reader.ts,
  GetNutritionPlanUseCase, src/db/schema/*, drizzle/ (migraciones) ni
  nutrition.controller.ts (design.md §Archivos afectados). Sin migracion.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Copia las lineas de resumen al reporte.
- Si restauras un fichero, usa `git checkout HEAD -- <ruta>`, nunca
  `git checkout <commit> -- <ruta>` (deja el cambio en el indice), ni
  git stash ni rm -f.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Los escribe el leader tras el veredicto
  del reviewer. Todo lo que tengas que contar va en
  progress/impl_meals-history.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo
  sustituyas por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
los de design.md §Archivos afectados (backend y movil, produccion,
tests y specs/mobile-ui-language/design.md), mas
specs/meals-history/traceability.md y progress/impl_meals-history.md.
Nada mas. Si necesitas tocar otro, PARA y pregunta.

Criterios de aceptacion: R1-R15 de requirements.md. La prueba de humo
H1 es del humano: no la marques.

Cierre (requirements.md R15), desde cada paquete, sin pipe, cada uno a
fichero con su exit:
  mobile-pet-tracker/: test ! -e .expo/types/router.d.ts; bun run typecheck;
    bun run lint; bunx jest
  backend-pet-tracker/: pnpm exec tsc --noEmit; pnpm test; pnpm test:e2e
  raiz: git diff --stat origin/main -- '*package.json' '*bun.lock' '*pnpm-lock.yaml'
    (vacio)

Al terminar, escribe progress/impl_meals-history.md con: pwd, branch y
H0; skills cargadas; la salida de las anclas; la base medida (jest
movil, pnpm test, tsc en los dos lados) con exit; los commits con hash y
R-id; por cada rojo, el comando, las cuentas, el exit y cada `it` rojo
con su matcher, Expected y Received (o la consulta que falla), mas el
grep de literales de R5; por cada verde, sus cuentas y exit; el cierre
con exit; el `git diff --name-only H0 HEAD`; el delta final sobre tu
base por fichero; y cualquier decision que la spec no cerrara
literalmente. Copia de jest solo las lineas de resumen y los bloques `●`
de cada `it` rojo; NO pegues console.info de HeroUI ni console.warn de
Uniwind.
```

## Reanudación 1: parada en el ancla R5 (2026-10-04)

> Codex paró en la verificación de anclas con HEAD `52757187`, como exige
> el handoff («si alguna no da su contenido, PARA»): R5 decía que
> `ui-copy-table.ts` no registra `src/app/_layout.tsx` (`grep -c "_layout"`
> = 0) y el grep da 9. La parada fue correcta; la premisa era falsa y el
> leader no la había contrastado. Backend R2, R1 y R3 están en verde y el
> rojo de R4 está commiteado (`430b232a`, 13 de 15 fallan con `404`); no se
> escribió producción de R4 ni nada de móvil.
>
> **Enmienda E1** (commit `e0f133a1`, aprobada por el humano en Notion el
> 2026-10-04, `page_last_edited_at` 2026-10-04T00:24:21.926Z): R5 lleva una
> fila más en `R6_FOOD` (`src/app/_layout.tsx` / `mealsHistory.mealsHistory`),
> el candado `#65 R6` sube `+ 11` en vez de `+ 10`, y el rojo transitorio de
> ese candado va de R5 a R14 porque la llamada de `_layout.tsx` nace en R8.
> Nada más cambia: ni claves, ni literales, ni tests de R5, ni otro
> requisito. La firma de E1 es el commit que añade esta reanudación.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 1 de #105 tras tu parada en el ancla R5. Ejecuta y pega en el
informe, bajo una seccion nueva «## Reanudacion 1»:
  pwd
  git branch --show-current
  git rev-parse --short HEAD
  git rev-parse --short HEAD~1
  git rev-parse --short HEAD~3
  git status --short
PARA si:
- la branch no es feature/105-meals-history;
- HEAD~1 no es 1fe7d4df (bitacora del leader) o HEAD~3 no es 52757187
  (tu ultimo commit, la trazabilidad);
- `git status --short` muestra algo.
HEAD es el commit del leader que firma E1 y anade esta reanudacion.
Siguen en vigor todas las reglas del handoff original. H0 sigue siendo
2edf8c38: los diffs de cierre se miden contra el.

Lee antes de tocar nada: requirements.md §Enmienda E1 (bloque de cabecera
y R5), design.md D8 / §Archivos / §Candados (filas marcadas E1), tasks.md
R5, y esta seccion del handoff.

Anclas: repite SOLO esta, con su cifra:
  grep -c "_layout" mobile-pet-tracker/src/__tests__/ui-copy-table.ts
Esperado 9. Si no da 9, PARA. El resto de anclas ya las verificaste y no
han cambiado (ningun commit desde 52757187 toca codigo).

Lo que cambia respecto al handoff original, y solo esto:
- R5: en R6_FOOD van 11 filas nuevas, no 10. La de _layout.tsx es
    { file: 'src/app/_layout.tsx', key: 'mealsHistory.mealsHistory' }, // #105 R5
  con el formato de la fila `mealSchedule.mealSchedule` que encabeza
  R6_FOOD. Las 11 van juntas, al final de R6_FOOD, con la de _layout.tsx
  la primera de las once. El candado `#65 R6` de ui-language.test.ts sube
  `+ 11 // #105 R5` (no `+ 10`).
- El rojo transitorio de `#65 R6` dura de R5 a R14: la llamada
  `t('mealsHistory.mealsHistory')` de _layout.tsx nace en R8, las de
  food.tsx en R14. Anotalo en cada corrida intermedia y comprueba que
  vuelve a verde en R14 (donde decia «R9-R14», lee «R8-R14»).

Donde retomas: tasks.md R4 paso 2 (produccion minima del endpoint) sobre
el rojo que ya tienes en 430b232a; luego R4 paso 3 y la comprobacion del
bloque backend (pnpm test y pnpm test:e2e verdes, lockfile sin diff).
Despues el bloque movil entero en el orden de tasks.md (R5, R10, R6, R7,
R8, R9, R11, R12, R13, R14, R15) con las cifras de E1. Postgres y
LocalStack estan libres: la sesion de #101 ya cerro.

Commits: igual que antes, test rojo primero y feat minimo despues, un
R-id por par, mensajes `test(<scope>): … (#105 R<n>)` /
`feat(<scope>): … (#105 R<n>)`. No reescribas ni rebasees los commits
existentes.

Informe: continua progress/impl_meals-history.md bajo «## Reanudacion 1»
con lo mismo que pide el handoff original (comandos sin pipe, cuentas,
exit, bloques `●` de cada rojo, grep de literales de R5, cierre, `git
diff --name-only 2edf8c38 HEAD`, delta por fichero). Actualiza
traceability.md. Mantén el `it` extra que anadiste en R3 (orden de
validacion con `to` por defecto): lo juzga el reviewer.
```
