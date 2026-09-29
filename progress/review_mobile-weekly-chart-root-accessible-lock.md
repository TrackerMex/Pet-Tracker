Veredicto: rechazado (provisional: init.sh pendiente del leader)

# review: mobile-weekly-chart-root-accessible-lock (#132)

Fecha: 2026-09-29 16:30 UTC
HEAD revisado: `40e40dfea1de02298c27de9732675fb59797c946` (commit de las 14:24 UTC), branch `feature/132-mobile-weekly-chart-root-accessible-lock`, worktree `/home/claude/sites/Pet-Tracker`.
Skills cargadas: `expo:expo-overview` y `expo:expo-native-ui`, la que indica la carta para UI de pantalla.

Arranque, pegado tal cual:

```
pwd                         /home/claude/sites/Pet-Tracker
git branch --show-current   feature/132-mobile-weekly-chart-root-accessible-lock
git rev-parse HEAD          40e40dfea1de02298c27de9732675fb59797c946
git status --short          (vacío)
```

Los tres coinciden con el encargo, así que seguí. No he tocado otros worktrees ni he cambiado de branch.

**Motivo del rechazo, en una línea.** R1 solo mira el primer render, antes del layout y sin ningún día seleccionado. Si se mete un `<View accessible>` o un `<Pressable>` entre la raíz de la gráfica y la tarjeta que solo aparece después del layout o con un día seleccionado, la suite móvil entera sigue verde: `Tests: 1553 passed, 1553 total`, y también pasan tsc y eslint. Eso contradice la cláusula IF del propio R1 y el punto 2 de §Qué firma. No es culpa de Codex, porque el bloque que escribió es literal al de la spec firmada. Ver la observación 1.

## init.sh

**Pendiente del leader.** Lo corre el leader sobre `40e40dfe`. Yo no he lanzado `./init.sh` ni e2e, y no he tocado Postgres ni LocalStack. Cuando esté el log, hay que comprobar:
- que salga `exit=0` medido sin pipe;
- la línea móvil `Test Suites: 83 passed, 83 total / Tests: 1553 passed, 1553 total / Snapshots: 1 passed, 1 total`, que es la misma que medí yo con `bunx jest` en HEAD;
- 30 bloques `● Console`, la misma cifra que la base.

El veredicto provisional solo puede quedarse en rechazado. Un init.sh verde no cierra la observación 1, y uno rojo añadiría un segundo motivo.

## Checklist C2: estado coherente
- [x] Solo hay una feature en `in_progress`: `[(132, 'mobile-weekly-chart-root-accessible-lock')]`, leído de `feature_list.json` con python. #100 y #131 figuran como `pending` en el árbol de la branch.
- [x] `progress/current.md` describe la sesión activa de #132: arranque, spec, espejo en Notion, gate y handoff.
- [x] Codex no tocó los artefactos del leader. `git diff --name-only d7523f98..HEAD` da solo el test, `progress/impl_mobile-weekly-chart-root-accessible-lock.md` y `specs/…/traceability.md`.

## Checklist C3: arquitectura
- [x] Solo se añade un test en la capa de presentación móvil (`src/screens/home/`). No se tocan dominio, aplicación ni infraestructura.
- [x] No hay imports nuevos. El diff del test es solo aditivo: `numstat` da `24 0` en un único hunk, `@@ -1468,0 +1469,24 @@`. El `View` del centinela sale de un `jest.requireActual` dentro del `it`, igual que en los bloques anteriores (`requireActual` pasa de 8 a 9).
- [x] No aplica a contratos ni repositorios, porque no hay ninguno implicado.

## Checklist C4: TDD (vía b, declarada en la spec antes del handoff)

La vía b está declarada en requirements.md, en R1 y en §Qué firma (puntos 4 y 7), y también en tasks.md. R2 figura como requisito sin test propio que se cierra por inspección.

- [x] El único R-id con test tiene un test que lo nombra: `describe('#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica')` › `it('entre el nodo que monta la gráfica y la tarjeta no hay ningún otro')`. R2 no tiene test, y así está declarado.
- [x] La historia va test primero, en 3 commits y en este orden. Los mensajes son literales al handoff y no llevan trailers:

| Commit | Mensaje | gráfica (`git rev-parse <c>:…chart.tsx`) | test (`…chart.test.tsx`) | Esperado (tasks.md) |
|---|---|---|---|---|
| base: `origin/main` `035be7fe`, `4126e990` y `d7523f98` | (ninguno) | `c258abed…` | `24a5c572…` | base ✓ |
| `4fb4481c` | `test(mobile): expose a wrapper around the weekly activity card with a versioned mutation (R1)` | `cec8a26e…` (P1red = `wrapcard`) | `326aa482…` | ✓ ✓ |
| `99629c30` | `test(mobile): lock the weekly activity card as the chart's host root (R1)` | `c258abed…` | `326aa482…` | ✓ (revierte) |
| `40e40dfe` | `docs(mobile): record the weekly chart root lock evidence (R2)` | `c258abed…` | `326aa482…` | final ✓ |

- `git show 4fb4481c` cambia el test (+24) y la gráfica (+2: `    <View accessible>` encima de la línea de la tarjeta y `    </View>` debajo de su cierre). `99629c30` solo quita esas dos líneas. `40e40dfe` solo toca el reporte (+106) y `traceability.md` (4 líneas).
- [x] **El rojo lo reproduje yo sobre toda la suite móvil.** Primero `git checkout 4fb4481c --` de los dos ficheros, con los blobs comprobados por `hash-object` (`cec8a26e` y `326aa482`). Después `bunx jest > …/rv132/red_full.log 2>&1; echo "exit=$?"`:
  - `exit=1`, `Test Suites: 2 failed, 81 passed, 83 total`, `Tests: 5 failed, 1548 passed, 1553 total`, `Snapshots: 1 passed, 1 total`. **Son exactamente 5 rojos en 2 suites**, como pide R1.
  - `#132 R1 › entre el nodo que monta la gráfica y la tarjeta no hay ningún otro` falla por `expect(received).toBe(expected) // Object.is equality`, con `Expected: "chart-parent"` y `Received: undefined`.
  - Los 4 de orden de la Home fallan por `expect(received).toEqual(expected)`: `R14 › queda entre el resumen y la última posición en el árbol`, `#69 R1 › coloca la tira sobre la tarjeta del collar`, `#71 R1 › coloca la rejilla entre el collar y la actividad semanal` y `#70 R1 › #70 R14 › coloca la sección entre la actividad semanal y la última posición`.
  - Hay 30 bloques `● Console`, los mismos que en HEAD.
  - Restauré con `git checkout HEAD --` de los dos ficheros. Después, `git diff --exit-code` y `git diff --cached --exit-code` dieron 0 (el `git checkout <c> --` deja el cambio en el índice, y por eso usé `HEAD`).
- [x] El rojo no sale de un `ReferenceError` o un `TypeError`, ni de mutar un doble. La mutación es de producción (la gráfica) y el verde la revierte al blob `c258abed`.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única aparición de la palabra está en la línea 17, que es la regla.
- [x] Hashes: R1 es `4fb4481c` (rojo) / `99629c30` (verde). R2 es «no aplica» / `99629c30`, el verde de R1, como pide tasks.md. `git merge-base --is-ancestor <hash> HEAD` da `exit=0` en los dos.
- [x] El test citado existe y nombra su R-id. Sale `✓` en `…/rv132/head_chart.log`: `✓ entre el nodo que monta la gráfica y la tarjeta no hay ningún otro`.
- [x] Formato de commit: `<tipo>(mobile): <desc> (R<n>)`, con `test`/`docs` y no `feat` porque no hay código de feature. Es el mismo precedente de #74 y #130.

## Checklist C6: spec aprobada
- [x] Los cuatro ficheros llevan `status: approved`. La casilla `[x] **Aprobado por humano** (fecha: 2026-09-28)` está en requirements.md §Aprobación, que es la única casilla de la feature.
- [x] La firma es `4126e990`, que solo cambia los cuatro frontmatter y la casilla.
- [x] Nada cambia después de la firma. requirements.md (`bad726d3`), design.md (`b3029e1d`) y tasks.md (`82f6477f`) tienen el mismo blob en `4126e990` y en HEAD. Solo cambia `traceability.md` (`7511cfe6` pasa a `17a7d60c`, los hashes).

## Checklist C7: sin código huérfano
- [x] N/A: esta feature no reemplaza nada existente, solo añade un `describe`.

## Checklist C8: UI móvil (docs/ui-guidelines.md)
- [x] **El árbol de producción no cambia.** `git diff --exit-code origin/main...HEAD` sobre la gráfica da 0, y la gráfica termina en `c258abed`. No hay UI nueva que evaluar: dimensiones, Skeleton, componentes compartidos, touch targets y animaciones quedan como en `origin/main`.
- [x] Lo que sí cambia, el test, está limpio de greps: `stylesheet|text-[10px]` da 0 en los dos ficheros, y no hay ningún `#NNN` sin ` R<n>` detrás. `#68 R18` de `design-drift.test.ts` pasa en HEAD, y la sonda `hexbare` demuestra que lo vigila (abajo).

## Evidencia por R-id

### R1: la tarjeta es la raíz host de lo que pinta la gráfica. [ ] No se cumple entero
- El test está en `weekly-activity-chart.test.tsx::#132 R1: … › entre el nodo que monta la gráfica y la tarjeta no hay ningún otro` y es byte a byte el bloque de tasks.md (blob `326aa482`). Asevera `result.getByTestId('weekly-activity-card').parent?.props.testID` `toBe('chart-parent')`, con los dos literales escritos en el test. No es tautológico: el esperado no se importa de producción.
- Lo que sí cumple:
  - rojo versionado de 5 en 2 suites (arriba);
  - `wrapcard`, `presscard` y `wrapplain` dan rojo por `toBe`;
  - `hidewrap` da rojo por consulta;
  - `fragment` queda verde.
- **Lo que no cumple.** La cláusula «IF se mete un host entre la raíz de la gráfica y la tarjeta, sea un `<View accessible>`, un `<Pressable>` o un `<View>` sin marcar, THEN ese `it` SHALL fallar por aserción» falla en cuanto el host depende del estado que el `it` no ejerce (el layout o la selección). Está medido en §Zona ciega y es la observación 1.

### R2: cierre (por inspección)
1. **Delta.** La gráfica pasa de 43 a 44: en HEAD, `exit=0` y `Tests: 44 passed, 44 total`. La Home da `exit=0` y `Tests: 159 passed, 159 total`. La suite completa, en HEAD, da `exit=0`, `Test Suites: 83 passed, 83 total`, `Tests: 1553 passed, 1553 total` y `Snapshots: 1 passed, 1 total`. Sobre la base declarada de 83/1552/1 son **+0 suites y +1 test** ✓.
2. `git diff --exit-code origin/main...HEAD` da 0 sobre:
   - la gráfica, `src/screens/home/index.tsx` e `index.test.tsx`;
   - `src/components/card.tsx`, `src/i18n/catalog.ts`, `package.json` y `bun.lock`;
   - `src/__tests__/design-drift.test.ts`, `src/__tests__/consistency-classnames.test.ts`, `src/providers/__tests__/language-provider.test.tsx` y `src/__tests__/ui-copy-table.ts`;
   - `STATUS.md` y `progress/history.md`.
   Bajo `mobile-pet-tracker/` solo cambia el test (`numstat` `24 0`).
3. Hay un único hunk, con 0 líneas borradas, y va al final del fichero, que termina en `});\n`. No cambia ningún `describe` de #68, #74 ni #130, ni sus helpers o mocks.
4. Greps de candado, medidos por mí de nuevo:

| grep | resultado |
|---|---|
| `CONTINUOUS_CORNER` / `TABULAR_NUMS` / `radiogroup` / `Platform` (gráfica) | 1 / 4 / 1 / 0 |
| `stylesheet\|text-[10px]` | 0 en los dos |
| `use-api` en el test | 1 (base 1) |
| `useApi` en el test | 0 |
| `#132` / `#132 R1:` | 2 / 2 |
| `^describe('#132 R` | 1 |
| `chart-parent` | 2 en el test, 0 fuera de él |
| `requireActual` | 9 (base 8) |
| `weekly-activity-card` en el test | 4 (base 3) |
| `#130` / `#74` en el test | 4 / 5 (sin cambio) |
| `#NNN` sin ` R<n>` en el bloque nuevo | ninguno |

5. `test ! -e .expo/types/router.d.ts` da `exit=0` antes y después (no lo he borrado). `bunx tsc --noEmit` da `exit=0` con el log vacío. `bunx eslint` de los dos ficheros da `exit=0` con el log vacío.
6. No hay dependencias ni copy nuevas: `package.json`, `bun.lock`, el catálogo y `ui-copy-table.ts` no cambian.
7. La tabla de sondas está en el reporte de Codex y sus filas coinciden con la columna «Exigido» de tasks.md en veredicto y en blob. Las he reproducido todas (abajo).

## Tabla de sondas, medida por mí sobre el árbol final

Una cada vez, con `…/rv132/probe.sh`:
1. la mutación, con `mutate.py`;
2. `git hash-object`;
3. `bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx src/screens/home/index.test.tsx > …/probe_<sonda>.log 2>&1; echo "exit=$?"`, que corre 44 + 159 = 203 tests;
4. `git checkout HEAD --` de los dos ficheros.

Después de cada una, `git diff --exit-code` y `git diff --cached --exit-code` dieron 0, y los blobs volvieron a `c258abed` y `326aa482`.

| Sonda | Blob | exit | Tests | Rojos, con la línea que decide | ¿= Exigido? |
|---|---|---|---|---|---|
| `wrapcard` | `cec8a26e…` | 1 | 5 failed, 198 passed, 203 (2 suites failed) | `#132 R1` por `expect(received).toBe(expected)` y los 4 de orden por `toEqual` | ✓ |
| `presscard` | `330939c5…` | 1 | 5 failed, 198 passed, 203 | los mismos 5 y los mismos matchers | ✓ |
| `wrapplain` | `06303036…` | 1 | 5 failed, 198 passed, 203 | los mismos 5 y los mismos matchers | ✓ |
| `hidewrap` | `a1864b0b…` | 1 | 47 failed, 156 passed, 203 | 38 en la gráfica (30 por consulta y 8 por aserción: 5 `toBeDefined`, 1 `toBeOnTheScreen`, 1 `toEqual` y 1 `toHaveBeenCalledWith`) y 9 en la Home (6 por consulta y 3 por `toEqual`). `#132 R1` falla **por consulta**, con `Unable to find an element with testID: weekly-activity-card` | ✓ |
| `fragment` | `e3248830…` | 0 | 203 passed, 203 | verde, (N) | ✓ |
| `sibling` | `27969c05…` | 0 | 203 passed, 203 | verde, (D) | ✓ |
| `cardacc` | `8fc10f1c…` | 1 | 1 failed, 202 passed, 203 | `#74 R2 › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible` por `toEqual`; R1 y la Home, verdes | ✓ |
| `cardpress` | `2a460368…` | 1 | 1 failed, 202 passed, 203 | el mismo `#74 R2` por `toEqual` | ✓ |
| `wrapinner` | `e2c6f4e6…` | 1 | 1 failed, 202 passed, 203 | `#130 R2 › las siete columnas cuelgan de la fila…` por `toBe` | ✓ |
| `wrapmetric` | `d053148a…` | 0 | 203 passed, 203 | verde: **la (F) declarada, confirmada** | ✓ |
| `hexbare` (test) | `378edd75…` | 1 | 1 failed, 54 passed, 55 (`design-drift.test.ts`) | `#68 R18 › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` por `toEqual` | ✓ |

## Zona ciega buscada: un host entre la raíz y la tarjeta que R1 no ve

Estas mutaciones son mías y están fuera de la tabla de la spec. Todas van en la gráfica y hacen lo mismo:
- `  return (`, justo encima de la línea de la tarjeta, pasa a `  const card = (`;
- detrás del `  );` que cierra la tarjeta se añade un `return` condicionado.

Todas pintan la semana entera medida, así que están dentro del WHILE de R1, y meten un host entre la raíz de la gráfica y la tarjeta, así que están dentro de su IF.

| Sonda | Línea añadida | Blob de la gráfica | 203 (gráfica + Home) | Suite completa, tsc y eslint |
|---|---|---|---|---|
| `layoutwrap` | `  return chartWidth > 0 ? <View accessible>{card}</View> : card;` | `bbf810f65e80843f005e7dc134bf094596bd5ae3` | `exit=0`, `Tests: 203 passed, 203 total` | `bunx jest`: `exit=0`, `Test Suites: 83 passed, 83 total`, `Tests: 1553 passed, 1553 total`, `Snapshots: 1 passed, 1 total`. tsc `exit=0` y eslint `exit=0`, los dos con el log vacío |
| `selwrap` | `  return selection !== null ? <Pressable onPress={() => setSelection(null)}>{card}</Pressable> : card;` | `c81f498f06157e866bda07a60956a79c83464e9a` | `exit=0`, `Tests: 203 passed, 203 total` | `bunx jest`: `exit=0`, `Test Suites: 83 passed, 83 total`, `Tests: 1553 passed, 1553 total`, `Snapshots: 1 passed, 1 total`. tsc `exit=0` y eslint `exit=0`, los dos con el log vacío |
| `layoutwrapctl` (control) | `  return chartWidth === 0 ? <View accessible>{card}</View> : card;` | `ebb667168df1b7985c0d394e896f71a09dc3240c` | `exit=1`, `Tests: 5 failed, 198 passed, 203 total`: `#132 R1` por `toBe` y los 4 de orden por `toEqual`, igual que `wrapcard` | no aplica |

Los controles prueban tres cosas:

- **La mutación está bien formada, y el candado la ve cuando cae en su render.** Con la condición invertida (`layoutwrapctl`), R1 y los 4 de orden se ponen en rojo igual que con `wrapcard`. La Home tampoco ve `layoutwrap`, porque sus tests no disparan el layout de la gráfica.
- **El envoltorio existe después del layout.** Añadí al test, temporalmente, un `describe` de sonda idéntico al de R1 pero que dispara `layout` (295 px) antes de aseverar, con blob del test `ce3ffe7a85a8afbc273a78ace9cc65e6e19f74ad`. Con la gráfica de HEAD da `exit=0`, 45/45. Con `layoutwrap` da `exit=1`, `Tests: 1 failed, 44 passed, 45 total`, y el único rojo es la sonda, por `expect(received).toBe(expected) // Object.is equality` con `Expected: "chart-parent"`. En un dispositivo el layout se dispara siempre, y `renderChart` también lo dispara por defecto.
- **El envoltorio existe con un día seleccionado.** Otra sonda temporal, igual pero que además pulsa `weekly-activity-day-2026-09-02` y comprueba que el tooltip está en pantalla, con blob del test `c9f087859ace1603340632f4e5f7a5b977478d27`. Con HEAD da `exit=0`, 45/45. Con `selwrap` da `exit=1`, `Tests: 1 failed, 44 passed, 45 total`, y el único rojo es la sonda, por `toBe`.

En Android, cualquiera de las dos funde en un solo nodo de TalkBack la tarjeta entera: selector, gráfico, las siete columnas y, con `selwrap`, también el tooltip. Es el mismo daño que `wrapcard`, que es lo que #132 existe para parar. `selwrap` además no es rebuscado: es el patrón de «tocar fuera para cerrar el tooltip».

Los dos `describe` de sonda nunca se commitearon. Se restauraron con `git checkout HEAD --`, y el test volvió a `326aa482` con `diff` y `diff --cached` en 0.

## Drift contra origin/main
- Al empezar, `git fetch -q origin` dejó `origin/main` en `035be7fe`, la base del encargo.
- **Al cerrar la review se había movido**: un segundo `git fetch -q origin` (`exit=0`) da `origin/main` en `4efb6c81`, `Merge pull request #172 from TrackerMex/feature/100-mobile-alert-detail-screen`. Es el merge de #100: 42 commits en `035be7fe..origin/main`.
- Bajo `mobile-pet-tracker/` cambian 20 ficheros, todos en `src/`:
  - `alert-detail` (pantalla, ruta y tests);
  - `alerts`, `use-alerts-list.ts`, `use-push-registration.*`, `_layout.tsx` y `alert-meta.ts`;
  - `catalog.ts`, `language-provider.test.tsx`, `ui-copy-table.ts` y `ui-language.test.ts`.
- **Nada cambia bajo `src/screens/home/`**: `git diff --quiet 035be7fe origin/main -- mobile-pet-tracker/src/screens/home/` da 0, y la gráfica y su test siguen en `c258abed` y `24a5c572` en `origin/main`. Tampoco cambian `package.json` ni `bun.lock`.
- `git merge-base HEAD origin/main` sigue siendo `035be7fe`, así que los diffs de tres puntos de R2.2 siguen dando lo mismo. `git merge-tree --write-tree HEAD origin/main` da `exit=0`, sin conflictos.

## Estado del árbol al terminar
`git status --short` solo muestra este reporte (`?? progress/review_mobile-weekly-chart-root-accessible-lock.md`). `git diff --exit-code` y `git diff --cached --exit-code` dan 0, y los blobs finales son la gráfica `c258abedde92d2be981be8507d3d898f13c612cb` y el test `326aa48242b28195849d4e9fe8179004162623d2`. HEAD sigue en `40e40dfe`. No he hecho commits, push ni PRs.

Los logs, `mutate.py`, `probe.sh` y los dos bloques de sonda están en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/c1edfdc1-1af4-41a9-b58e-c094475189fd/scratchpad/rv132/`, fuera del repo.

## Observaciones

1. **BLOQUEANTE: R1 solo muestrea el primer render, y no cumple su propia cláusula IF.**
   - **Evidencia.** `layoutwrap` y `selwrap` meten un `<View accessible>` y un `<Pressable>` entre la raíz de la gráfica y la tarjeta mientras la gráfica pinta la semana medida. Con cualquiera de las dos, la suite móvil entera da `Tests: 1553 passed, 1553 total` con `exit=0`, y tsc y eslint dan `exit=0`, así que tampoco lo pararía init.sh.
   - **Qué contradice.**
     - La cláusula de R1: «IF se mete un host entre la raíz de la gráfica y la tarjeta, sea un `<View accessible>`, un `<Pressable>` o un `<View>` sin marcar, THEN ese `it` SHALL fallar por aserción».
     - El punto 2 de §Qué firma, que el humano firmó: «**El candado es estructural y cerrado.** Cualquier host nuevo entre la raíz de la gráfica y la tarjeta pone R1 en rojo».
   - **Dónde nace.** En design.md §«El `it` renderiza sin `renderChart`»: «No dispara el `layout`: nada de la raíz depende del ancho medido del gráfico». Eso describe la gráfica de hoy, pero el candado lo toma como permanente, y un candado existe precisamente para cuando la raíz deje de cumplirlo.
   - **Por qué no lo cubre la (D).** La (D) «Un solo escenario, la semana entera medida» delimita datos (la semana medida frente al estado vacío), no el estado de layout ni el de selección. Además se apoya en que «la gráfica tiene un único `return (`», que es justo la premisa que estas mutaciones rompen sin que el candado se entere.
   - **Por qué no es como `wrapcard` en #130.** Aquel hueco quedaba fuera del alcance literal de `#130 R2`, y por eso no bloqueó. Este cae dentro de R1.
   - **Precedentes.** Es la misma clase que «muestrear un continuo» (#106) y que los rechazos en ronda 1 de #84 y #113 por huecos dentro del alcance del propio candado.
   - **No es atribuible a Codex.** Su bloque es el de tasks.md, byte a byte (blob `326aa482`).
   - **Qué hace falta.** Corregirlo exige enmendar la spec y reabrir el gate solo para las enmiendas, y eso lo deciden el leader y el humano. No prescribo la forma. El requisito queda cumplido cuando `layoutwrap` y `selwrap` pongan en rojo un `it` de la gráfica por aserción, con `wrapcard`, `presscard`, `wrapplain`, `hidewrap`, `fragment`, `sibling`, `cardacc`, `cardpress`, `wrapinner`, `wrapmetric` y `hexbare` como están hoy, y con el rojo versionado todavía en exactamente 5 en 2 suites, o con la cifra que la enmienda declare.
2. **No bloqueante. La (F) declarada queda confirmada y sigue abierta, como se firmó**: con `wrapmetric`, 203/203 en verde. Falta registrarla con un id asignado contra `origin/main` (requirements.md §Fuera de alcance).
3. **No bloqueante. `origin/main` se movió durante la review**, de `035be7fe` a `4efb6c81` (merge de #100). No afecta a `src/screens/home/` y el merge es limpio, pero:
   - añade suites y cambia `catalog.ts`, `language-provider.test.tsx` y `ui-copy-table.ts`, así que quien vuelva a medir tras actualizar la branch no debe comparar con 83/1553;
   - si se actualiza, que sea con merge y no con rebase, para no invalidar los hashes de `traceability.md`.
4. **No bloqueante. Catálogo de Codex (deuda B5), igual que en la obs. 3 de #130.** El reporte dice que cargó `building-native-ui` en la **v1.0.1**, pero CLAUDE.md y el handoff hablan de la **v1.0.2** de `expo@openai-curated`. Aquí no importa, porque no hay UI, pero sigue sin cuadrar con `.claude/agents/leader.md` §Catálogo real de skills de Codex.
5. **No bloqueante. El reporte de Codex no tiene título.** `progress/impl_mobile-weekly-chart-root-accessible-lock.md` empieza con la salida de `pwd` y de la branch, sin encabezado `# impl: …`. Es cosmético; sus tablas coinciden con «Exigido».
6. **No bloqueante. La autoría git no distingue al implementador.** Los tres commits de Codex llevan `Claude <claude@srv1178023.hstgr.cloud>`, igual que los del leader. Lo dejo como nota informativa.
7. **No bloqueante. `git diff --stat origin/main...HEAD` incluye ficheros del leader**: `feature_list.json`, `progress/current.md`, el handoff y los cuatro de la spec. Vienen de `1fb41f83`, `4126e990` y `d7523f98`, no de Codex (C2). Bajo `mobile-pet-tracker/` solo aparece el test.
8. **Pendiente. init.sh**, lo corre el leader sobre `40e40dfe`. Ver §init.sh.
