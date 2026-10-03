Veredicto: APROBADO (ronda 2)

# review: mobile-weekly-chart-root-accessible-lock (#132), ronda 2 (Enmienda 1)

Fecha: 2026-09-29 20:05 UTC
HEAD revisado: `fb3de49eb9fec8a871643dcd38156fbc676cb76c` (commit de las 19:26 UTC), branch `feature/132-mobile-weekly-chart-root-accessible-lock`.
Ronda 1: rechazada, con el veredicto en `3296180d` (HEAD `40e40dfe`, obs. 1 bloqueante: R1 solo miraba el primer render).
Skills cargadas: `expo:expo-overview`. No hay UI nueva, así que basta para C8.

Dónde medí:
- Todo lo dinámico (rojos, verdes, sondas, jest, tsc y eslint) lo medí en un worktree mío, `…/scratchpad/rv132r2`, creado con `git worktree add --detach` sobre `fb3de49e` y con el `node_modules` enlazado.
- El árbol principal no lo muté. Al terminar, `git status --short` en `/home/claude/sites/Pet-Tracker` solo muestra este reporte.
- Logs en `/tmp/claude-1002/-home-claude-sites-Pet-Tracker-mobile-pet-tracker/c1edfdc1-1af4-41a9-b58e-c094475189fd/scratchpad/rv132r2_logs/`. Scripts: `rv132r2_mut.py`, `rv132r2_run.sh` y `rv132r2_parse.py`.

**Motivo, en una línea.** La obs. 1 de la ronda 1 queda cerrada. `layoutwrap`, `selwrap` y `metricwrap` ya ponen en rojo por aserción el `it` de R1 que monta su estado. Las 30 sondas de §E1 dan exactamente lo exigido, los tres rojos versionados se reproducen con las cuentas firmadas, el diff de producción acumulado es vacío e init.sh sale con `EXIT=0` sobre `fb3de49e`.

## init.sh

Lo corrió el leader en el árbol principal. Yo no lo lancé. Esperé a `exit` sondeando en primer plano.

```
head:                 fb3de49eb9fec8a871643dcd38156fbc676cb76c
git rev-parse HEAD:   fb3de49eb9fec8a871643dcd38156fbc676cb76c   (árbol principal, status vacío)
exit:                 EXIT=0
```

Líneas que deciden, sacadas del log crudo (`…/scratchpad/init132r2/log`, 20826 líneas, sin los códigos ANSI):

```
218:Test Suites: 171 passed, 171 total                 (backend)
219:Tests:       1307 passed, 1307 total
231:Test Suites: 2 passed, 2 total                     (infra)
232:Tests:       14 passed, 14 total
20498:Test Suites: 86 passed, 86 total                 (móvil)
20499:Tests:       1601 passed, 1601 total
20500:Snapshots:   1 passed, 1 total
20503:✅ Tests pasados
20796:Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
20797:Tests:       8 skipped, 389 passed, 397 total
20801:✅ Tests e2e pasados
20813:✅ Lint sin errores
20817:✅ Typecheck sin errores
20820:✅ Todo verde. Listo para trabajar.
```

La línea móvil de init.sh, 86/1601/1, es la misma que medí yo en el worktree.

## Checklist C2: estado coherente
- [x] Solo hay una feature en `in_progress`: `[(132, 'mobile-weekly-chart-root-accessible-lock', 'in_progress')]`, leído con python de `feature_list.json` en HEAD.
- [x] `progress/current.md` (último commit `d264e4c8`, del leader) describe la ronda 2: la decisión del humano, el merge `02128a12`, la Enmienda 1 (`c1876aae` y `552995ee`), el re-espejo en Notion, la firma `27724fb3` y el handoff r2.
- [x] Codex no tocó artefactos del leader. `git diff --name-only d264e4c8 HEAD` da solo tres ficheros:

| Fichero | numstat | Qué cambia |
|---|---|---|
| el test | `97 0` | los tres `it` nuevos |
| `progress/impl_…md` | `158 0` | un solo hunk `@@ -106,0 +107,158 @@`, añadido detrás de la ronda 1 |
| `specs/…/traceability.md` | `4 4` | solo las cuatro filas «(Enmienda 1)» |

## Checklist C3: arquitectura
- [x] Solo se añaden tests en la capa de presentación móvil (`src/screens/home/`). No se tocan dominio, aplicación ni infraestructura.
- [x] No hay imports nuevos. El `View` del centinela sale de un `jest.requireActual` dentro de cada `it`: `requireActual` pasa de 9 a 12.
- [x] No hay contratos ni repositorios implicados.

## Checklist C4: TDD (vía b)
- [x] **Cada R-id con test tiene un test que lo nombra.** Los cuatro `it` cuelgan de `describe('#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica')`. R2 no tiene test y lo cierra la inspección, como está declarado. Los tres `it` nuevos son los de R1·2, R1·3 y R1·4, con los títulos literales de requirements §R1 enmendado:
  - «tras medir el gráfico, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro»;
  - «con un día seleccionado, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro»;
  - «con otra métrica seleccionada, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro».
- [x] **Cada `it` prueba que llegó a su estado antes de aseverar la raíz.** Usa `getByTestId` para el layout (no `queryByTestId` con un `if`), con estas precondiciones:
  - R1·2: `weekly-activity-bar-chart` con `toBeOnTheScreen`;
  - R1·3: `weekly-activity-tooltip` con `toBeOnTheScreen`, tras pulsar `weekly-activity-day-2026-09-02`;
  - R1·4: el `accessibilityState` de `weekly-activity-metric-distanceM` con `toEqual({ selected: true })`.

  Los literales `'chart-parent'` están escritos en el test y no se importan de producción, así que no es un candado tautológico. Los comentarios empiezan por `// #132 R1:`.
- [x] **La historia va test primero, en tres pares rojo y verde.** Los mensajes son literales a tasks.md y no llevan trailers. Blobs leídos con `git rev-parse <c>:<ruta>` y numstat por commit:

| Commit | Tipo | Gráfica | Test | numstat de la gráfica |
|---|---|---|---|---|
| `3a0022f6` | rojo E1.1 | `bbf810f6` (`layoutwrap`) | `6be9934b` (+30) | `2 1` |
| `061ca9ea` | verde E1.1 | `c258abed` | `6be9934b` | `1 2` (revierte) |
| `728ad1c6` | rojo E1.2 | `c81f498f` (`selwrap`) | `6689cc26` (+31) | `2 1` |
| `be6ac464` | verde E1.2 | `c258abed` | `6689cc26` | `1 2` (revierte) |
| `f27dd25d` | rojo E1.3 | `35fe2999` (`metricwrap`) | `d7f938da` (+36) | `2 1` |
| `97f8c18c` | verde E1.3 | `c258abed` | `d7f938da` | `1 2` (revierte) |
| `fb3de49e` | evidencia | `c258abed` | `d7f938da` | ninguno |

- [x] **Reproduje los tres rojos**: `git checkout <rojo> --` de los dos ficheros, con los blobs comprobados por `hash-object`, sin pipe y con `--runTestsByPath`. Restauré cada vez con `git checkout HEAD --`, y `git diff --exit-code` y `git diff --cached --exit-code` dieron 0.

| Rojo | Gráfica sola | Gráfica + Home | Suite completa | `it` rojos y matcher |
|---|---|---|---|---|
| `3a0022f6` | `exit=1`, 1 failed, 44 passed, 45 | `exit=1`, 1 failed, 203 passed, 204 (1 suite failed, 1 passed) | `exit=1`, 1 failed, 1598 passed, 1599; 1 suite failed, 85 passed, 86 | solo R1·2: `expect(received).toBe(expected)`, `Expected: "chart-parent"`, `Received: undefined` |
| `728ad1c6` | `exit=1`, 1 failed, 45 passed, 46 | `exit=1`, 1 failed, 204 passed, 205 | `exit=1`, 1 failed, 1599 passed, 1600; 1 suite failed, 85 passed, 86 | solo R1·3, por `toBe`, con los mismos Expected y Received |
| `f27dd25d` | `exit=1`, 2 failed, 45 passed, 47 | `exit=1`, 2 failed, 204 passed, 206 | `exit=1`, 2 failed, 1599 passed, 1601; 1 suite failed, 85 passed, 86 | R1·4 por `toBe` (Expected `"chart-parent"`, Received `undefined`) y **el rebote declarado de R6**, `R6 › desliza una única píldora entre las medidas reales de las pestañas`, por `expect(jest.fn()).toHaveBeenNthCalledWith(n, ...expected)`, con `n: 1` y `Number of calls: 0` |

  Coincide con requirements §R1 enmendado: 1 rojo en 1 suite en E1.1 y E1.2, y 2 en 1 suite en E1.3.
- [x] **Los verdes, medidos**:
  - `061ca9ea`: la gráfica da `exit=0` con 45/45;
  - `be6ac464`: `exit=0` con 46/46;
  - `97f8c18c`: es el árbol de código de HEAD y da `exit=0` con 47/47.
- [x] Ningún rojo sale de un `ReferenceError` o un `TypeError`, ni de mutar un doble. Las mutaciones son de producción y el verde siguiente las revierte a `c258abed`.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene filas «pendiente». La única aparición de la palabra es la línea de la regla.
- [x] Las cuatro filas «(Enmienda 1)» citan `3a0022f6`/`061ca9ea`, `728ad1c6`/`be6ac464`, `f27dd25d`/`97f8c18c` y, en R2, «no aplica»/`97f8c18c`. R2 cita el verde de E1.3, como pide tasks.md. Las filas de la ronda 1 (`4fb4481c`/`99629c30`) no cambian.
- [x] `git merge-base --is-ancestor <hash> HEAD` da `exit=0` en los diez hashes de la historia: `4fb4481c`, `99629c30`, `40e40dfe`, `02128a12` y los seis de la ronda 2.
- [x] Los tres tests citados existen y nombran su R-id. Salen `✓` en `head_chart.log`.
- [x] Formato de commit: `test(mobile)` o `docs(mobile)`, más `: <desc> (R<n>)`. Es el mismo precedente de #74, #130 y la ronda 1.

## Checklist C6: spec aprobada
- [x] requirements.md tiene `status: approved`. §Aprobación está en `[x]` (2026-09-28) y §Firma de la Enmienda 1, la casilla propia de la enmienda, también (2026-09-29).
- [x] La firma de la enmienda es `27724fb3`. Solo cambia dos líneas de requirements.md: la cabecera «firmada el 2026-09-29 vía Notion» y la casilla. Cita la página https://app.notion.com/p/3e96115a9b2781a9bc0bd92b2ac69e56 con `page_last_edited_at` 2026-09-29T18:41:08.044Z. No cita la cuenta, igual que en `4126e990`, porque la API de Notion no expone quién editó (leader.md §Gate vía Notion).
- [x] **Nada cambia después de la firma.** requirements (`de81c157`), design (`5c3fff21`) y tasks (`49952ff9`) tienen el mismo blob en `27724fb3` y en HEAD. `git diff --stat 552995ee 27724fb3~1 -- specs/` da vacío, así que no hay drift entre la versión espejada y la firmada.

## Checklist C7: sin código huérfano
- [x] N/A: la feature no reemplaza nada. Solo añade `it` a un `describe` existente.

## Checklist C8: UI móvil (docs/ui-guidelines.md)
- [x] **El árbol de producción no cambia.** `git diff --exit-code origin/main...HEAD` sobre la gráfica, `index.tsx`, `index.test.tsx`, `card.tsx`, `catalog.ts`, `package.json` y `bun.lock` da 0. La gráfica acaba en `c258abed`. No hay pantalla, dimensión, Skeleton, componente compartido, touch target ni animación que evaluar.
- [x] **El test está limpio de greps**:
  - `stylesheet|text-[10px]` da 0 en los dos ficheros;
  - los `#NNN` añadidos son todos `#132 R1`;
  - `#68 R18` pasa en HEAD, y `hexbare` demuestra que vigila el test (abajo).

## Evidencia por R-id

### R1 (enmendado): la tarjeta es la raíz host en los cuatro estados. [x] Se cumple
- Los cuatro `it` son los de §R1 enmendado. Cada estado queda a los dos lados de su umbral: `chartWidth`, 0 y 295; `selection`, null y el día 2026-09-02; `selectedMetricIndex`, 0 y 1.
- **Cláusula IF.** `wrapcard`, `presscard` y `wrapplain` tumban los cuatro por `toBe`. `layoutwrap` tumba R1·2, R1·3 y R1·4. `selwrap` tumba R1·3 y `metricwrap` tumba R1·4. Todos caen **por aserción**.
- `hidewrap` tumba los cuatro **por consulta**: R1·1 en `weekly-activity-card`, y R1·2, R1·3 y R1·4 en `weekly-activity-chart-layout`.
- `fragment` deja los cuatro en verde.
- Los controles `layoutwrapctl`, `selwrapctl` y `metricwrapctl` prueban que el candado ve el envoltorio al otro lado de cada umbral.

### R2 (enmendado): cierre por inspección. [x] Se cumple
1. **Delta.** Medido en HEAD, sin pipe:
   - la gráfica da `exit=0`, 47/47, con `Test Suites: 1`;
   - gráfica + Home da `exit=0`, 206/206, con `Test Suites: 2`;
   - la Home da `exit=0`, 159/159;
   - la suite da `exit=0`, `Test Suites: 86 passed, 86 total`, `Tests: 1601 passed, 1601 total` y `Snapshots: 1 passed, 1 total`, con 33 bloques `● Console`, que son ruido.

   Sobre la base 86/1598/1 son +0 suites y +3 tests ✓.
2. **Diff de producción vacío** (arriba, en C8). La gráfica final es `c258abedde92d2be981be8507d3d898f13c612cb` y el test final es `d7f938da18fc038d309d75505e3582dd4ae4b0be` ✓.
3. **Un solo bloque**:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista solo el test;
   - contra `origin/main`, numstat `121 0` y 1 hunk;
   - contra `40e40dfe`, numstat `97 0` y 1 hunk, `@@ -1489,4 +1489,101 @@`, detrás de R1·1 y dentro de su `describe`.

   Además, `git diff 02128a12 HEAD -- mobile-pet-tracker/ ':!<test>'` da 0 ✓.
4. **Cifras de candado**, medidas por mí:

| grep | medido | exigido |
|---|---|---|
| gráfica: `style={CONTINUOUS_CORNER}` / `style={TABULAR_NUMS}` / `accessibilityRole="radiogroup"` / `Platform` | 1 / 4 / 1 / 0 | 1 / 4 / 1 / 0 ✓ |
| `stylesheet\|text-[10px]` (los dos ficheros) | 0 / 0 | 0 / 0 ✓ |
| test: `use-api` / `useApi` | 1 / 0 | 1 / 0 ✓ |
| `#132` / `#132 R1:` | 5 / 5 | 5 / 5 ✓ |
| `^describe('#132 R` | 1 | 1 ✓ |
| `chart-parent` | 8 | 8 ✓ |
| `requireActual` | 12 | 12 ✓ |
| `weekly-activity-card` | 7 | 7 ✓ |
| `width: 295` | 5 | 5 ✓ |
| `await fireEvent` | 17 | 17 ✓ |
| `weekly-activity-metric-walkCount` | 0 | 0 ✓ |
| `// #132 R1: the test mounts` | 1 | 1 ✓ |
| `#130` / `#74` | 4 / 5 | 4 / 5 ✓ |

5. **tsc y eslint.** `test ! -e .expo/types/router.d.ts` da `exit=0` (no lo borré). `bunx tsc --noEmit` da `exit=0` y `bunx eslint` de los dos ficheros da `exit=0`, los dos con el log vacío ✓.
6. **Sin dependencias ni copy nuevas.** Con `git diff --exit-code origin/main...HEAD` dan 0 `package.json`, `bun.lock`, `catalog.ts`, `design-drift.test.ts`, `consistency-classnames.test.ts`, `language-provider.test.tsx` y `ui-copy-table.ts` ✓.
7. **Tabla de sondas.** La sección `## Enmienda 1` del reporte la trae con la columna «medido». La he re-medido entera (abajo) ✓.

## Tabla de sondas de §E1, medida por mí sobre el árbol final

Una sonda cada vez:
1. la mutación, con `rv132r2_mut.py`, literal a §E1 — Sondas y a §Sondas;
2. `git hash-object`, que coincide con el blob de la tabla en las 30;
3. `bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx src/screens/home/index.test.tsx > <log> 2>&1`, sobre 47 + 159 = 206. En `hexbare`, `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`;
4. `git checkout HEAD --` de los dos ficheros.

Después de las 30, `git diff --exit-code` y `git diff --cached --exit-code` de `mobile-pet-tracker/src` dieron 0. No hizo falta repetir ninguna ni borrar la perf-cache.

| Sonda | Blob | exit | Tests (206) | Rojos y primera línea del error | = Exigido |
|---|---|---|---|---|---|
| `wrapcard` | `cec8a26e` | 1 | 8 failed, 198 passed; 2 suites failed | R1·1 a R1·4 por `expect(received).toBe`, y los 4 de orden por `toEqual` | ✓ |
| `presscard` | `330939c5` | 1 | 8 failed, 198 passed; 2 suites | los mismos 8 y los mismos matchers | ✓ |
| `wrapplain` | `06303036` | 1 | 8 failed, 198 passed; 2 suites | los mismos 8 y los mismos matchers | ✓ |
| `hidewrap` | `a1864b0b` | 1 | 50 failed, 156 passed; 2 suites | **41 en la gráfica** (33 por consulta y 8 por aserción) y **9 en la Home** (6 por consulta y 3 por `toEqual`, los 9 nombres de §Sondas). R1·1 cae en `Unable to find an element with testID: weekly-activity-card`, y R1·2, R1·3 y R1·4 en `Unable to find an element with testID: weekly-activity-chart-layout` | ✓ |
| `fragment` | `e3248830` | 0 | 206 passed | verde | ✓ |
| `sibling` | `27969c05` | 0 | 206 passed | verde, (D) | ✓ |
| `cardacc` | `8fc10f1c` | 1 | 1 failed, 205 passed | `#74 R2 › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`, por `toEqual` | ✓ |
| `cardpress` | `2a460368` | 1 | 1 failed, 205 passed | el mismo, por `toEqual` | ✓ |
| `wrapinner` | `e2c6f4e6` | 1 | 1 failed, 205 passed | `#130 R2 › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`, por `toBe` | ✓ |
| `wrapmetric` | `d053148a` | 0 | 206 passed | verde, (F) | ✓ |
| `hexbare` (test) | `4fb93a34` | 1 | `Test Suites: 1 failed, 1 total`; 1 failed, 54 passed, 55 | `#68 R18 › keeps arbitrary text, hex colors, and StyleSheet out of feature sources`, por `toEqual` | ✓ |
| `layoutwrap` | `bbf810f6` | 1 | **3 failed**, 203 passed; 1 suite failed, 1 passed | R1·2, R1·3 y R1·4 por `toBe`; la Home, verde | ✓ |
| `layoutwrapctl` | `ebb66716` | 1 | 5 failed, 201 passed; 2 suites | R1·1 por `toBe` y los 4 de orden por `toEqual` | ✓ |
| `selwrap` | `c81f498f` | 1 | **1 failed**, 205 passed; 1 suite | R1·3 por `toBe`; la Home, verde | ✓ |
| `selwrapctl` | `ed32f2ba` | 1 | 7 failed, 199 passed; 2 suites | R1·1, R1·2 y R1·4 por `toBe`, y los 4 de orden por `toEqual` | ✓ |
| `metricwrap` | `35fe2999` | 1 | **2 failed**, 204 passed; 1 suite | R1·4 por `toBe` y el rebote de R6 por `expect(jest.fn()).toHaveBeenNthCalledWith`; la Home, verde | ✓ |
| `metricwrapctl` | `7c076e39` | 1 | 8 failed, 198 passed; 2 suites | R1·1, R1·2 y R1·3 por `toBe`, el rebote de R6 y los 4 de orden por `toEqual` | ✓ |
| `widewrap` | `e63e077b` | 0 | 206 passed | verde, (D) | ✓ |
| `selidxwrap` | `9e886ebd` | 0 | 206 passed | verde, (D) | ✓ |
| `metricidxwrap` | `fd20e1e5` | 0 | 206 passed | verde, (D) | ✓ |
| `trendwrap` | `18d947ef` | 1 | 4 failed, 202 passed; 1 suite | los 4 de orden por `toEqual`; la gráfica, verde, (D) | ✓ |
| `zerowrap` | `e6e2594f` | 0 | 206 passed | verde, (D) | ✓ |
| `missingwrap` | `a3088d7e` | 0 | 206 passed | verde, (D) | ✓ |
| `selmissingwrap` | `cfb9d548` | 0 | 206 passed | verde, (D) | ✓ |
| `emptywrap` | `69665259` | 0 | 206 passed | verde, fuera del WHILE | ✓ |
| `callbackwrap` | `e41851bb` | 1 | 4 failed, 202 passed; 1 suite | los 4 de orden por `toEqual`; la gráfica, verde, (D) | ✓ |
| `localewrap` | `ccec4f33` | 0 | 206 passed | verde, (D) | ✓ |
| `themewrap` | `b8df65f8` | 0 | 206 passed | verde, (D) | ✓ |
| `motionwrap` | `eb91d529` | 1 | 4 failed, 202 passed; 1 suite | los 4 de orden por `toEqual`; la gráfica, verde, (D) | ✓ |
| `oswrap` | `4cd9051b` | 0 | 206 passed | verde, (D) | ✓ |

Las 17 filas de `wrapcard` a `metricwrapctl` dan el veredicto, las cuentas y los matchers de «Exigido». Las 13 filas de `widewrap` a `oswrap` (12 marcadas (D) y `emptywrap`, fuera del WHILE) dan lo que la spec documenta: **no aparece ningún rojo nuevo** que reportar. Las tres que la Home ve de rebote, `trendwrap`, `callbackwrap` y `motionwrap`, son las que declara §Qué firma, punto 2.

## Cierre de la obs. 1 de la ronda 1

En la ronda 1 (`3296180d`), `layoutwrap` y `selwrap` dejaban la suite en `1553 passed, 1553 total`. Ahora cada una pone en rojo, por `expect(received).toBe(expected)`, los `it` de R1 que montan su estado:
- `layoutwrap` tumba R1·2, R1·3 y R1·4;
- `selwrap` tumba R1·3;
- `metricwrap`, la tercera del mismo tipo que pidió el humano con el «4.º it», tumba R1·4.

Las sondas de la ronda 1 conservan su veredicto, con los recuentos que firma §Qué firma el humano con esta enmienda, punto 4: 8, 8, 8, 50 y el blob nuevo de `hexbare`. **Cerrada.**

## Drift contra origin/main
- `git fetch origin main` deja `origin/main` en `4efb6c81` (el merge de #100), que es el mismo de la obs. 3 de la ronda 1. No se ha movido desde entonces.
- `git merge-base HEAD origin/main` da `4efb6c81`, porque el leader lo mergeó en `02128a12` antes de la enmienda, sin rebase. Los diffs de tres puntos de R2 van contra esa base.
- No hay commits nuevos en `origin/main` que no estén en la branch.

## Estado del árbol al terminar
- Árbol principal: HEAD en `fb3de49e` y `git status --short` con solo ` M progress/review_mobile-weekly-chart-root-accessible-lock.md` (este fichero, sin commitear).
- Blobs finales: la gráfica en `c258abed` y el test en `d7f938da`.
- Mi worktree `rv132r2` quedó retirado con `git worktree remove --force` (`exit=0`).
- No he hecho commits, push ni PR, ni he tocado `feature_list.json`, `progress/current.md`, `STATUS.md` ni `history.md`.

## Observaciones

1. **No bloqueante. La (F) `wrapmetric` sigue abierta, como se firmó.** Medida: 206/206 en verde. Falta registrarla con un id asignado contra `origin/main`. Viene de la obs. 2 de la ronda 1, y `progress/current.md` ya la tiene prevista como #135 en el cierre.
2. **No bloqueante. Catálogo de Codex (deuda B5), igual que la obs. 4 de la ronda 1.** El reporte vuelve a decir `expo/building-native-ui` **v1.0.1**, pero CLAUDE.md sigue hablando de la **v1.0.2** de `expo@openai-curated`. Aquí no importa, porque no hay UI, pero leader.md §Catálogo real de skills de Codex sigue sin cuadrar con lo que Codex tiene instalado.
3. **No bloqueante. El reporte de Codex sigue sin título**, igual que la obs. 5 de la ronda 1. `progress/impl_mobile-weekly-chart-root-accessible-lock.md` empieza con la salida de `pwd` y no con un `# impl: …`. Es cosmético: la sección `## Enmienda 1` coincide con lo que he medido.
4. **No bloqueante. La autoría git no distingue al implementador**, igual que la obs. 6 de la ronda 1. Los siete commits de Codex llevan `Claude <claude@srv1178023.hstgr.cloud>`, como los del leader. Es informativo.
5. **No bloqueante. Las 12 filas (D) siguen siendo huecos reales**, firmados a sabiendas (§Punto 2 reescrito y §Fuera de alcance de la Enmienda 1). Nueve quedan verdes en la corrida de sondas. `trendwrap`, `callbackwrap` y `motionwrap` solo los ve la Home, y no el candado de la gráfica. No pido nada: lo dejo constar para que el cierre no los describa como cubiertos.

Cerradas de la ronda 1:
- la obs. 1 (bloqueante), arriba;
- la obs. 3 (drift), porque la base se integró en `02128a12`;
- la obs. 7 (el stat incluye ficheros del leader), que sigue siendo así y no afecta a C2;
- la obs. 8 (init.sh pendiente), porque `EXIT=0` sobre `fb3de49e`.
