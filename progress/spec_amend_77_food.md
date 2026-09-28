# Enmienda 1 a #77 — R5, la carrera del plan de nutrición en food

> Informe del `spec_author` (2026-09-28). La enmienda vive en
> `specs/mobile-home-weight-without-collar/` (requirements.md §Enmienda 1,
> design.md D9, tasks.md §R5) y **espera la firma del humano** en su casilla
> propia, `requirements.md` › §Enmienda 1 › Firma de la Enmienda 1. El
> frontmatter sigue en `approved`.

## Dónde se escribió

- `pwd` → `/home/claude/sites/Pet-Tracker-wt-77amend`.
- `git branch --show-current` → `spec/77-food-flake-amend`, creada desde
  `c06aa893`, con el árbol limpio al empezar.
- El commit de la enmienda es uno solo y contiene este informe, así que el
  informe no puede citar su propio hash. El hash va en la respuesta al leader.
  Sin push ni PR.
- No se tocaron `Pet-Tracker-wt-backend` (Codex, R1-R3 de #77), `Pet-Tracker`
  (#120) ni ningún otro worktree. Tampoco `traceability.md` de #77,
  `docs/conventions.md`, `feature_list.json`, `progress/current.md` ni
  `progress/history.md`.

## Premisas verificadas contra el árbol

| Premisa | Comando | Resultado |
|---|---|---|
| Blob de `food.tsx` | `git rev-parse 'HEAD:mobile-pet-tracker/src/app/(tabs)/food.tsx'` | `e310ff45ac9a6abc5475e983a2c03e1d7b5f909b` |
| Blob de `food.test.tsx` | `git rev-parse 'HEAD:mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'` | `abc6ad1579dfcadb3c9d309d41caecdba62ccb2d` |
| Base de Codex | `git merge-base --is-ancestor e9413a6e c06aa893` y `git diff --stat e9413a6e c06aa893 -- mobile-pet-tracker` | `exit=0`, stat vacío: la parte móvil de `e9413a6e` (= `origin/main`) y la de `c06aa893` son iguales |
| Fake timers en food | `grep -c useFakeTimers 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'` | `0` |
| Ancla de Q1 | `grep -c "queryFn: () => getNutritionPlan(baseUrl, token ?? '', selectedPetId!),"` sobre `food.tsx` | `1` |
| Guard de drift del test | `grep -cP '#[0-9]++(?! R[0-9])'` sobre `food.test.tsx` | `9` en la base, `9` con el arreglo |

## Cómo se midió

Todo en una copia de `mobile-pet-tracker/` en el scratchpad del spec_author,
con `node_modules` enlazado en solo lectura desde `wt-backend`. Sin
instalar nada, sin `./init.sh`, sin e2e y sin tocar Postgres ni LocalStack.
Jest corrió con `--cacheDirectory` propio del scratchpad, así que no tocó el
`/tmp/jest_ru` compartido. Siempre sin pipe
(`cmd > log 2>&1; echo "exit=$?"`), y con las rutas de `(tabs)` entre
comillas. Tras cada variante, `food.tsx` y `food.test.tsx` se restauraron a
la base.

- Fichero entero:
  `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'`.
- Filtrado: el mismo comando con
  `-t 'keeps API order and selects the first pet by default'`.
- «Arreglado»: el test con el diff de `tasks.md` §R5, paso (2).

## Mecanismo

1. `usePetSelection` selecciona la primera mascota desde un `useEffect`, con
   un `setState` en lane por defecto, no síncrona.
2. El commit de ese render pinta `pet-chip-pet-1` seleccionado. Sus efectos
   pasivos, entre ellos el de `useQuery` (`enabled: selectedPetId !== null`),
   que lanza el `queryFn`, quedan para una tarea aparte del Scheduler. El
   Scheduler cede cada 5 ms con `setImmediate`.
3. El `waitFor` de RNTL comprueba cada 50 ms, con timeout de 1000 ms. Si la
   comprobación cae entre el commit y esa tarea, sale con el chip
   seleccionado, y la aserción de fuera ve `Number of calls: 0`.

**Traza W1** (instrumentación con `console.log` en `useLayoutEffect`,
`queueMicrotask` y el `queryFn`; variante fuera del repo):

- en el commit del chip,
  `layout-pet:pet-1 → micro-pet:pet-1 → queryFn:pet-1`, con una frontera de
  tarea entre el pintado y la llamada; a veces sale
  `layout → queryFn → micro`, cuando el Scheduler no cede, y de ahí la
  intermitencia;
- los datos del plan llegan por `useSyncExternalStore`, que hace commit
  síncrono y vacía los efectos en el mismo paso
  (`layout-kcal → passive-kcal → micro-kcal`). Por eso `#113 R2`, `R4` y
  `R7` son seguros hoy.

**Traza W2** (toggle de comida, `#98 R5` y `R6`):
`queryFn → before-refetchQueries → before-haptics → finally-setPending-null`,
todo en microtareas, antes de cualquier `setTimeout(0)` o `setImmediate`. Por
eso `#98 R5` y `R6` son seguros hoy.

**Corrección de la premisa de #111 E1.** E1 clasificó el gemelo de `health`
como «causalmente implicado» (§F4) y dio por hecho que no había ventana. La
exención de §F4 vale cuando la llamada **causa** el render esperado. Aquí es
al revés: el render causa la llamada, que llega una tarea después. E1 no vio
la ventana porque sus vigas retrasaban la **respuesta** de `mockListPets`, y
esa respuesta llega antes del render esperado. La viga que abre la ventana
retrasa la **llamada** (Q1). El código de `health` ya está bien, porque #111
S2 (`bcd8ba8a`) dejó sus aserciones dentro del `waitFor`. La enmienda no toca
#111; solo deja escrito que la premisa era falsa.

## Mediciones

| Id | `food.tsx` | Test | Corrida | Resultado | Log |
|---|---|---|---|---|---|
| B | base | base | fichero entero ×1 | `Tests: 56 passed, 56 total`, exit 0 | `base-food-1.log` |
| R | Q1 | base | filtrado ×10 | 10/10 exit 1, `Tests: 1 failed, 55 skipped, 56 total`, `Number of calls: 0` | `B2-M1b-orig/` |
| R′ | Q1 | base | fichero entero ×3 | 3/3 exit 1, `Tests: 1 failed, 55 passed, 56 total`, solo `keeps API order…`, `Number of calls: 0` | `D2-M1b-orig-full/` |
| V | Q1 | arreglado | filtrado ×10 | 10/10 exit 0 | `C2-M1b-fixed/` |
| V′ | Q1 | arreglado | fichero entero ×3 | 3/3 exit 0, 56/56 | `F2-M1b-fixed-full/` |
| F | base | arreglado | fichero entero ×3 | 3/3 exit 0, 56/56 | `I-orig-fixed-full/` |
| T1 | Q2 (`enabled: false`) | arreglado | filtrado ×3 | 3/3 exit 1, `Number of calls: 0` | `J-M2-nocall-fixed/` |
| T2 | Q3 (`'pet-2'` en el `queryFn`) | arreglado | filtrado ×3 | 3/3 exit 1, `Received` con `"pet-2"`, `Number of calls: 1` | `J-M3-otherpet-fixed/` |
| T3 | Q4 (Q1 con `'pet-2'`) | arreglado | filtrado ×3 | 3/3 exit 1, `Number of calls: 1` | `J-M4b-delay-otherpet-fixed/` |
| S | Q1 | base / arreglado | `bunx tsc --noEmit` con cada test; `bunx expo lint` | exit 0 las tres veces, salida vacía | `tsc-red-M1b.log`, `tsc-green-M1b.log`, `lint-green-M1b.log` |
| K | Q1 | — | `consistency-classnames`, `legibility-classnames`, `design-drift`, `ui-language`, `detail-stack` | `Test Suites: 5 passed`, `Tests: 173 passed`, exit 0 | `M1b-locks/`, `locks-M1b.log` |
| G | base | arreglado | suite completa ×1; `bunx tsc --noEmit`; `bunx expo lint` | `Test Suites: 83 passed`, `Tests: 1532 passed`, exit 0 (194 s); exit 0; exit 0 | `final-suite/`, `final-static/` |
| Q5 | `await new Promise((resolve) => setTimeout(resolve, 100));` entre `await plan.refetch();` y `await queryClient.refetchQueries({` | base | `-t` de `#98` ×3; fichero entero ×1 | 3 rojos: `#98 R5` `sirve…` y `deshace…`, `#98 R6` `muestra el aviso…` | `K-M5-98/`, `K2-M5-full/` |
| Q6 | efecto de la barra con `setTimeout(…, 200)` y limpieza | base | `-t` de `#113` ×3 | `Tests: 7 failed, 44 skipped, 5 passed`, `Received {"width":"0%"}` | `L-M6-113/` |

Los nombres de los logs conservan los ids de trabajo (M1b = Q1, M2 = Q2, y
así). En la spec se renombraron a Q para no chocar con las sondas M1-M5 de
§R1, y las trazas pasaron a W para no chocar con las decisiones D1-D9.

La primera versión de la mutación no escuchaba el `abort` de TanStack. Su
temporizador sobrevivía al desmontaje y ponía `#98 R6` en rojo de rebote.
Con el fichero entero salía `Tests: 2 failed, 54 passed` (`keeps API order…`
y `muestra el aviso ante un fallo…`; log `D-M1-200-orig-full/`), pero
`#98 R6` solo pasaba (logs `E-M1-200-98R6/` y `G-M1-200-98R6-describe/`). Q1
lo cancela y deja como único rojo el de R5.

## Inventario

La clasificación completa de cada espera seguida de una aserción en
`food.test.tsx` está en `requirements.md` › §Enmienda 1 › Inventario. El único
sitio defectuoso es `keeps API order and selects the first pet by default` →
`mockGetNutritionPlan`. Los sitios «seguros hoy» (`#98 R5`/`R6` y
`#113 R2`/`R4`/`R7`) llevan su límite medido (Q5 y Q6) en §Fuera de alcance, y
no pasan a ser trabajo de #77.

## Decisiones que quedan para la firma del humano

- **R5 dentro de #77.** Entra un segundo fichero de test. El diff final de
  producción de food es vacío y no se debilita ninguna aserción: las mismas
  cuatro, con los mismos argumentos.
- **D9, tres commits en vez de dos.** C4 dice que la mutación «se versiona en
  el commit rojo y se revierte en el verde». Aquí el verde es un cambio de
  test que hay que probar **con Q1 puesta**, así que el revert va en un tercer
  commit, `fix(mobile): drop the nutrition plan delay (R5)`.
- **R-id por comentario.** El `it` no se renombra, porque su título lo citan
  el handoff, el log del leader y la fila de trazabilidad. El R-id va en
  `// #77 R5: …`.
- **Segundo commit de trazabilidad.** `traceability.md` pide uno solo. R5
  añade `docs(mobile): trace #77 R5`, siempre el último, que solo añade la
  fila de R5 (literal en `tasks.md` §R5).
- **[H] sin medir**, fuera de alcance: home `keeps API order…`
  (`mockGetPet`, `mockGetDailyActivity`), reminders
  `uses the metrics under the native header, selects the first pet, and shows row skeletons (#114 R6)`
  (`mockListReminders`) y la premisa de #111 E1.

## Observaciones para el leader

1. **La comprobación del verde de R3 en `tasks.md` es vacía.** Dice
   `git diff --exit-code <hash del verde de R2> HEAD -- mobile-pet-tracker/src/screens/home/index.tsx`,
   y el §Cierre manda correr desde `mobile-pet-tracker/`. Desde ahí, esa ruta
   no casa con nada y git sale con `exit=0` en silencio. Medido en este
   worktree:
   - `git log --oneline -1 -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'`
     no da salida, con `exit=0`;
   - la forma con `:/` da `8dd65ed3`;
   - `git diff --quiet e9413a6e~1 e9413a6e -- mobile-pet-tracker` da
     `exit=0`, mientras que con `':/mobile-pet-tracker'` sale
     `1 file changed`.

   No la edité: está en la parte firmada y Codex la está ejecutando. Se
   arregla con la magia `:/` (`':/mobile-pet-tracker/src/screens/home/index.tsx'`)
   o corriéndola desde la raíz. Conviene avisar a Codex antes de su verde de
   R3.
2. **El `--stat` del §Cierre tenía el mismo defecto**
   (`-- mobile-pet-tracker` desde `mobile-pet-tracker/`). Como la enmienda
   tenía que cambiar esa línea de todos modos, pasó a `':/mobile-pet-tracker'`,
   marcada como **Enmienda 1**. Las comprobaciones nuevas de §R5 usan `:/` y
   llevan un control de que la ruta casa con algo.
3. La enmienda vive en `spec/77-food-flake-amend`. Codex trabaja en
   `feature/77-mobile-home-weight-without-collar` y usa `tasks.md` como guion,
   así que no verá §R5 hasta que la enmienda firmada llegue a su branch. Hasta
   entonces sigue valiendo la «Reanudacion 1» del handoff: puntos 2 y 3.
