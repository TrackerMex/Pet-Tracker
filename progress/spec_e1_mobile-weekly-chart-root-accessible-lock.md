# Enmienda 1 de #132 — medidas del spec_author

> Evidencia de las cifras de `specs/mobile-weekly-chart-root-accessible-lock/`
> §Enmienda 1 (requirements, design, tasks y traceability). Escrito por el
> `spec_author` el 2026-09-29. No es el reporte de implementación: ese es
> `progress/impl_mobile-weekly-chart-root-accessible-lock.md`, y su sección
> `## Enmienda 1` la escribe quien implemente.

## Origen

Veredicto rechazado de la ronda 1,
`progress/review_mobile-weekly-chart-root-accessible-lock.md`, obs. 1. El
humano eligió, el 2026-09-29: «Enmendar R1: R1 pasa a cubrir también el estado
tras el layout y el de un día seleccionado; layoutwrap y selwrap serían rojos
exigidos».

## Dónde y cómo se midió

- **Base**: `02128a12`, el merge de `origin/main` `4efb6c81` (#100) en la
  branch. El `HEAD` al empezar, `6faa86c1`, solo toca `progress/current.md`.
  En `mobile-pet-tracker/`, `git diff --stat 4efb6c81 02128a12` lista solo el
  test (+24, el `it` de la ronda 1).
- **Worktree temporal**: `git worktree add --detach <scratchpad>/wt132e1 02128a12`,
  con `node_modules` enlazado al del worktree principal y copias de
  `expo-env.d.ts` y `src/uniwind-types.d.ts`. El worktree principal no se tocó
  bajo `mobile-pet-tracker/`, `backend-pet-tracker/` ni `infra/`. Al acabar,
  `git worktree remove` y, en el principal, `git diff --exit-code` y
  `git diff --cached --exit-code` de `mobile-pet-tracker/`, los dos en 0.
- **Cada corrida**: `git checkout HEAD --` de la gráfica y el test, copia del
  test de la variante, mutación de la gráfica por script (o del test, en
  `hexbare`), `git hash-object` de los dos, `test ! -e .expo/types/router.d.ts`
  (siempre `exit=0`), y luego una de estas, **sin pipe**, con una caché de jest
  propia del scratchpad (`--cacheDirectory`):
  - la gráfica: `bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx`;
  - sondas: `bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx src/screens/home/index.test.tsx`;
  - la suite: `bunx jest`;
  - `hexbare`: `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`.

  Tras cada una, `git checkout HEAD --` de los dos ficheros, y
  `git diff --exit-code -- src` y `git diff --cached --exit-code -- src` en 0,
  las dos, en todas las corridas.
- **No** se lanzó `./init.sh`, ni e2e, ni Postgres, ni LocalStack.

## Blobs

| Fichero | Versión | Blob |
|---|---|---|
| la gráfica | base, `origin/main` y final | `c258abedde92d2be981be8507d3d898f13c612cb` |
| el test | `origin/main` (`4efb6c81`) | `24a5c572d5f7f10f1a65dfd7ffd04a181bc47140` |
| el test | ronda 1, en `40e40dfe` y en `02128a12` | `326aa48242b28195849d4e9fe8179004162623d2` |
| el test | con R1·2 (tras E1.1) | `6be9934b5f9636095050e2bb94a6e1f00b5835ed` |
| el test | final, con R1·2 y R1·3 | `6689cc26014993cf3de73245e0158b44215a3106` |

Los bloques literales de `tasks.md` §E1.1 y §E1.2 se extrajeron del propio
`tasks.md` ya escrito y se aplicaron sobre `326aa482`: reproducen `6be9934b` y
`6689cc26`. Las 16 líneas de retorno de la tabla de §E1 — Sondas, aplicadas
con el patrón «condicionar la raíz» sobre `c258abed`, reproducen los 16 blobs
de la tabla. Las 10 sondas de la ronda 1 reproducen los blobs de la ronda 1.

## Resultados

| Corrida | Árbol | `Test Suites` | `Tests` | `exit` |
|---|---|---|---|---|
| base, la gráfica | `326aa482` | 1 passed | 44 passed de 44 | 0 |
| base, sondas | `326aa482` | 2 passed | 203 passed de 203 | 0 |
| base, suite | `326aa482` | 86 passed | 1598 passed de 1598, 1 snapshot, 33 `● Console` | 0 |
| rojo E1.1, la gráfica | `6be9934b` + `layoutwrap` | 1 failed | 1 failed, 44 passed de 45 | 1 |
| rojo E1.1, sondas | ídem | 1 failed, 1 passed | 1 failed, 203 passed de 204 | 1 |
| rojo E1.1, suite | ídem | 1 failed, 85 passed | 1 failed, 1598 passed de 1599, 1 snapshot | 1 |
| verde E1.1, la gráfica | `6be9934b` | 1 passed | 45 passed de 45 | 0 |
| rojo E1.2, la gráfica | `6689cc26` + `selwrap` | 1 failed | 1 failed, 45 passed de 46 | 1 |
| rojo E1.2, sondas | ídem | 1 failed, 1 passed | 1 failed, 204 passed de 205 | 1 |
| rojo E1.2, suite | ídem | 1 failed, 85 passed | 1 failed, 1599 passed de 1600, 1 snapshot | 1 |
| final, la gráfica | `6689cc26` | 1 passed | 46 passed de 46 | 0 |
| final, sondas | `6689cc26` | 2 passed | 205 passed de 205 | 0 |
| final, suite | `6689cc26` | 86 passed | 1600 passed de 1600, 1 snapshot, 33 `● Console` | 0 |

- El único rojo de E1.1 es
  `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › tras medir el gráfico, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`,
  por `expect(received).toBe(expected) // Object.is equality`, con
  `Expected: "chart-parent"` y `Received: undefined`.
- El único rojo de E1.2 es
  `… › con un día seleccionado, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`,
  por `toBe`, con los mismos `Expected` y `Received`.
- `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros, en la base y en el
  árbol final: `exit=0`, con el log vacío.
- `git diff --no-index --numstat` del test: `85 0` de `24a5c572` a `6689cc26`
  y `61 0` de `326aa482` a `6689cc26`, un hunk en cada caso. La gráfica mutada,
  `2 1` con `layoutwrap` y con `selwrap`.
- Cifras de candado en el test, `24a5c572` → `326aa482` → `6689cc26`:
  `#132` 0 → 2 → 4; `#132 R1:` 0 → 2 → 4; `^describe('#132 R` 0 → 1 → 1;
  `chart-parent` 0 → 2 → 6; `requireActual` 8 → 9 → 11;
  `weekly-activity-card` 3 → 4 → 6; `width: 295` 2 → 2 → 4;
  `await fireEvent` 12 → 12 → 15; `// #132 R1: the test mounts` 0 → 1 → 1;
  `#130` 4, `#74` 5, `use-api` 1 y `useApi` 0 en los tres;
  `stylesheet|text-[10px]` 0. En la gráfica, sin cambio:
  `style={CONTINUOUS_CORNER}` 1, `style={TABULAR_NUMS}` 4,
  `accessibilityRole="radiogroup"` 1 y `Platform` 0.
- La historia de la ronda 1 está en `HEAD`:
  `git merge-base --is-ancestor` de `4fb4481c`, `99629c30`, `40e40dfe` y
  `02128a12` da 0 en los cuatro.

## Sondas sobre el árbol final (205 tests)

| Sonda | `Tests` | Rojos |
|---|---|---|
| `wrapcard`, `presscard`, `wrapplain` | 7 failed de 205, 2 suites failed | R1·1, R1·2 y R1·3 por `toBe`, y los 4 de orden por `toEqual` |
| `hidewrap` | 49 failed de 205, 2 suites failed | 40 de la gráfica (32 por consulta y 8 por aserción) y 9 de la Home. R1·2 y R1·3 caen por consulta en `weekly-activity-chart-layout`; R1·1, en `weekly-activity-card` |
| `fragment`, `sibling`, `wrapmetric` | 205 passed | ninguno |
| `cardacc`, `cardpress` | 1 failed | `#74 R2: el grupo del selector no colapsa sus tres opciones › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`, por `toEqual` |
| `wrapinner` | 1 failed | `#130 R2: entre la tarjeta y cada columna no hay otro nodo › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`, por `toBe` |
| `hexbare` (design-drift) | 1 failed, 54 passed de 55 | `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources`, por `toEqual` |
| `layoutwrap` | 2 failed; suites 1 failed, 1 passed | R1·2 y R1·3, por `toBe` |
| `layoutwrapctl` | 5 failed; 2 suites failed | R1·1 por `toBe`, y los 4 de orden |
| `selwrap` | 1 failed; suites 1 failed, 1 passed | R1·3, por `toBe` |
| `selwrapctl` | 6 failed; 2 suites failed | R1·1 y R1·2 por `toBe`, y los 4 de orden |
| `widewrap`, `selidxwrap`, `zerowrap`, `missingwrap`, `selmissingwrap`, `emptywrap`, `localewrap`, `oswrap` | 205 passed | ninguno |
| `metricwrap` | 1 failed | `R6: el selector cambia de métrica sin volver a pedir nada › desliza una única píldora entre las medidas reales de las pestañas`, por `toHaveBeenNthCalledWith` («Number of calls: 0»): el envoltorio remonta el selector |
| `trendwrap`, `callbackwrap`, `motionwrap` | 4 failed; suites 1 failed, 1 passed | los 4 de orden, por `toEqual`. La gráfica, verde. La Home pasa `weekComparison`, `onSelectDay` y `mockUseReducedMotion` a `false` |

Ninguna sonda de la ronda 1 cambia de veredicto. Cambian los recuentos de
`wrapcard`, `presscard` y `wrapplain` (5 → 7) y de `hidewrap` (47 → 49), y el
blob del test de `hexbare` (`378edd75` → `f3dcd70b`).

## Inventario de ramas

48 ramas en la gráfica, localizadas con `grep -cF` (todas dan 1, salvo tres
que dan 2 y están anotadas). El detalle está en `requirements.md` §Enmienda 1 ›
Zona ciega. Ninguna decide hoy qué devuelve la raíz: `WeeklyActivityChart`
tiene un solo `return (` y el único `return;` del componente está en el handler
`selectDay`.

## Decisiones abiertas para el humano

1. **La métrica**: cubrirla con un cuarto `it` (dos commits más), o dejarla como
   hueco (D), que hoy solo ve `R6` de rebote (`metricwrap`).
2. **El punto 2 reescrito**: aceptar «cerrado sobre los tres estados que monta
   R1», con los 11 huecos (D) declarados, o pedir además un candado sobre el
   texto del componente (un solo `return`, sin condición), que cerraría la
   clase entera.
3. **Los recuentos de la ronda 1**: aceptar que `wrapcard`, `presscard` y
   `wrapplain` pasan de rojo 5 a rojo 7, `hidewrap` de 47 a 49 y `hexbare`
   cambia de blob, todos con el mismo veredicto.
