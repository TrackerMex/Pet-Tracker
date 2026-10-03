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

La primera redacción (`c1876aae`) dejó tres decisiones abiertas. El humano las
contestó el 2026-09-29, en la sesión del `leader`, y esta segunda redacción las
incorpora:

- **La métrica**: «4.º it». R1 cubre también el cambio de métrica, el tercer
  estado propio de la gráfica (`selectedMetricIndex`, junto a `chartWidth` y
  `selection`).
- **Un candado sobre el texto del componente**: «No». Se acepta el punto 2
  reescrito con sus huecos (D).
- **Los recuentos de la ronda 1**: «Aceptar».

La firma de la casilla de la enmienda va aparte, por Notion.

## Dónde y cómo se midió

Todo se midió dos veces, una por redacción, con el mismo método. Las cifras de
este fichero son las de la segunda.

- **Base**: `02128a12`, el merge de `origin/main` `4efb6c81` (#100) en la
  branch. En `mobile-pet-tracker/`, `git diff --stat 4efb6c81 02128a12` lista
  solo el test (+24, el `it` de la ronda 1). Los commits que siguen
  (`6faa86c1`, `c1876aae` y `87bebb89`) solo tocan `progress/` y `specs/`:
  `git diff --stat 02128a12 87bebb89 -- mobile-pet-tracker backend-pet-tracker infra`
  sale vacío.
- **Worktree temporal**: en la primera redacción,
  `git worktree add --detach <scratchpad>/wt132e1 02128a12`; en la segunda,
  `git worktree add --detach <scratchpad>/wt132e1b 87bebb89`. En los dos,
  `node_modules` enlazado al del worktree principal y copias de
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
| la gráfica | rojo de E1.1 (`layoutwrap`) | `bbf810f65e80843f005e7dc134bf094596bd5ae3` |
| la gráfica | rojo de E1.2 (`selwrap`) | `c81f498f06157e866bda07a60956a79c83464e9a` |
| la gráfica | rojo de E1.3 (`metricwrap`) | `35fe29993602bec41ec826d1ec3e074f2b346e29` |
| el test | `origin/main` (`4efb6c81`) | `24a5c572d5f7f10f1a65dfd7ffd04a181bc47140` |
| el test | ronda 1, en `40e40dfe` y en `02128a12` | `326aa48242b28195849d4e9fe8179004162623d2` |
| el test | con R1·2 (tras E1.1) | `6be9934b5f9636095050e2bb94a6e1f00b5835ed` |
| el test | con R1·2 y R1·3 (tras E1.2) | `6689cc26014993cf3de73245e0158b44215a3106` |
| el test | final, con R1·2, R1·3 y R1·4 (tras E1.3) | `d7f938da18fc038d309d75505e3582dd4ae4b0be` |
| el test | final con `hexbare` | `4fb93a347143d82443e18b7515ede7bef3135ce1` |

Los tres bloques literales de `tasks.md` (§E1.1, §E1.2 y §E1.3) se extrajeron
del propio `tasks.md` ya escrito, se les quitó la sangría de tres espacios y se
aplicaron en cadena sobre `326aa482`: reproducen `6be9934b`, `6689cc26` y
`d7f938da`. Las líneas de retorno de la tabla de §E1 — Sondas, aplicadas con
el patrón «condicionar la raíz» sobre `c258abed`, reproducen los blobs de la
tabla, y las 10 sondas de la ronda 1 reproducen los blobs de la ronda 1.

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
| verde E1.2, la gráfica | `6689cc26` | 1 passed | 46 passed de 46 | 0 |
| rojo E1.3, la gráfica | `d7f938da` + `metricwrap` | 1 failed | 2 failed, 45 passed de 47 | 1 |
| rojo E1.3, sondas | ídem | 1 failed, 1 passed | 2 failed, 204 passed de 206 | 1 |
| rojo E1.3, suite | ídem | 1 failed, 85 passed | 2 failed, 1599 passed de 1601, 1 snapshot | 1 |
| final (verde E1.3), la gráfica | `d7f938da` | 1 passed | 47 passed de 47 | 0 |
| final, sondas | `d7f938da` | 2 passed | 206 passed de 206 | 0 |
| final, suite | `d7f938da` | 86 passed | 1601 passed de 1601, 1 snapshot, 33 `● Console` | 0 |

- El único rojo de E1.1 es
  `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › tras medir el gráfico, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`,
  por `expect(received).toBe(expected) // Object.is equality`, con
  `Expected: "chart-parent"` y `Received: undefined`.
- El único rojo de E1.2 es
  `… › con un día seleccionado, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`,
  por `toBe`, con los mismos `Expected` y `Received`.
- Los dos rojos de E1.3 son
  `… › con otra métrica seleccionada, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`,
  por `toBe`, con los mismos `Expected` y `Received`, y
  `R6: el selector cambia de métrica sin volver a pedir nada › desliza una única píldora entre las medidas reales de las pestañas`,
  por `expect(jest.fn()).toHaveBeenNthCalledWith(n, ...expected)`, con `n: 1`
  y `Number of calls: 0`.
- `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros, en la base y en el
  árbol final: `exit=0`, con el log vacío.
- `git diff --no-index --numstat` del test: `121 0` de `24a5c572` a `d7f938da`
  y `97 0` de `326aa482` a `d7f938da`, un hunk en cada caso. La gráfica mutada,
  `2 1` con `layoutwrap`, con `selwrap` y con `metricwrap`.
- Cifras de candado en el test, `24a5c572` → `326aa482` → `d7f938da`:
  `#132` 0 → 2 → 5; `#132 R1:` 0 → 2 → 5; `^describe('#132 R` 0 → 1 → 1;
  `chart-parent` 0 → 2 → 8; `requireActual` 8 → 9 → 12;
  `weekly-activity-card` 3 → 4 → 7; `width: 295` 2 → 2 → 5;
  `await fireEvent` 12 → 12 → 17; `// #132 R1: the test mounts` 0 → 1 → 1;
  `weekly-activity-metric-walkCount` 0 en los tres; `#130` 4, `#74` 5,
  `use-api` 1 y `useApi` 0 en los tres; `stylesheet|text-[10px]` 0. En la
  gráfica, sin cambio: `style={CONTINUOUS_CORNER}` 1, `style={TABULAR_NUMS}` 4,
  `accessibilityRole="radiogroup"` 1, `Platform` 0 y `useState` 5.
- La historia de la ronda 1 y la primera redacción están en `HEAD`:
  `git merge-base --is-ancestor` de `4fb4481c`, `99629c30`, `40e40dfe`,
  `02128a12` y `c1876aae` da 0 en los cinco.

## Sondas sobre el árbol final (206 tests)

| Sonda | `Tests` | Rojos |
|---|---|---|
| `wrapcard`, `presscard`, `wrapplain` | 8 failed de 206, 2 suites failed | R1·1, R1·2, R1·3 y R1·4 por `toBe`, y los 4 de orden por `toEqual` |
| `hidewrap` | 50 failed de 206, 2 suites failed | 41 de la gráfica (33 por consulta y 8 por aserción) y 9 de la Home (6 por consulta y 3 por aserción). R1·2, R1·3 y R1·4 caen por consulta en `weekly-activity-chart-layout`; R1·1, en `weekly-activity-card` |
| `fragment`, `sibling`, `wrapmetric` | 206 passed | ninguno |
| `cardacc`, `cardpress` | 1 failed | `#74 R2: el grupo del selector no colapsa sus tres opciones › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`, por `toEqual` |
| `wrapinner` | 1 failed | `#130 R2: entre la tarjeta y cada columna no hay otro nodo › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`, por `toBe` |
| `hexbare` (design-drift) | 1 failed, 54 passed de 55 | `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources`, por `toEqual` |
| `layoutwrap` | 3 failed; suites 1 failed, 1 passed | R1·2, R1·3 y R1·4, por `toBe` |
| `layoutwrapctl` | 5 failed; 2 suites failed | R1·1 por `toBe`, y los 4 de orden |
| `selwrap` | 1 failed; suites 1 failed, 1 passed | R1·3, por `toBe` |
| `selwrapctl` | 7 failed; 2 suites failed | R1·1, R1·2 y R1·4 por `toBe`, y los 4 de orden |
| `metricwrap` | 2 failed; suites 1 failed, 1 passed | R1·4 por `toBe`, y `R6 › desliza una única píldora…` por `toHaveBeenNthCalledWith` («Number of calls: 0») |
| `metricwrapctl` (blob `7c076e39bbd1780ba4cfac959c67f25ea00a9a77`) | 8 failed; 2 suites failed | R1·1, R1·2 y R1·3 por `toBe`, los 4 de orden por `toEqual` y `R6 › desliza una única píldora…` por `toHaveBeenNthCalledWith`: al pulsar `distanceM` el envoltorio desaparece y el selector también se remonta |
| `widewrap`, `selidxwrap`, `zerowrap`, `missingwrap`, `selmissingwrap`, `emptywrap`, `localewrap`, `oswrap` | 206 passed | ninguno |
| `metricidxwrap` (blob `fd20e1e557e4a03f546d961ecd003ecd28d81914`) | 206 passed | ninguno |
| `themewrap` (blob `b8df65f8fbf2cbc9f98abf6248e3ae2099e74269`) | 206 passed | ninguno. `R9: el selector sigue el tema de la app` monta el tema oscuro, pero el envoltorio existe desde el primer render y R9 no mira la raíz |
| `trendwrap`, `callbackwrap`, `motionwrap` | 4 failed; suites 1 failed, 1 passed | los 4 de orden, por `toEqual`. La gráfica, verde. La Home pasa `weekComparison`, `onSelectDay` y `mockUseReducedMotion` a `false` |

Ninguna sonda de la ronda 1 cambia de veredicto. Cambian los recuentos de
`wrapcard`, `presscard` y `wrapplain` (5 → 8) y de `hidewrap` (47 → 50), y el
blob del test de `hexbare` (`378edd75` → `4fb93a34`). Sobre la primera
redacción (205 tests), suben un paso: 7 → 8 y 49 → 50.

## Inventario de ramas

48 ramas en la gráfica, localizadas con `grep -cF` (todas dan 1, salvo tres
que dan 2 y están anotadas). El detalle está en `requirements.md` §Enmienda 1 ›
Zona ciega. Ninguna decide hoy qué devuelve la raíz: `WeeklyActivityChart`
tiene un solo `return (` y el único `return;` del componente está en el handler
`selectDay`.

## Decisiones del humano (2026-09-29)

1. **La métrica**: «4.º it». Hecho: R1·4 y el par rojo y verde de §E1.3.
2. **Candado de texto**: «No». Queda como (D) en requirements §Fuera de alcance
   de la Enmienda 1.
3. **Recuentos de la ronda 1**: «Aceptar». Con el cuarto `it` suben un paso
   más (tabla de arriba).

## Qué cambia respecto a lo que el humano vio

- **Una fila (D) nueva en §Zona ciega, el tema** (`themewrap`, verde). La
  primera redacción no la inventariaba. Entra en las 12 filas (D) que firma el
  punto 2.
- **`metricwrapctl` tumba también `R6 › desliza…`** (rojo 8 y no 7), por el
  mismo rebote que `metricwrap`.
