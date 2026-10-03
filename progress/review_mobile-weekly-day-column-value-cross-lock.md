# review: mobile-weekly-day-column-value-cross-lock (#141, #142, #143)
Fecha: 2026-09-30T22:40Z
Veredicto: APROBADO

Revisado en el worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/141-mobile-weekly-day-column-value-cross-lock`, HEAD `5a3f13cc`. Implementó
Codex CLI; el handoff es `0883b1fe` y `origin/main` es `4d536a43`. Al terminar, el
árbol queda limpio salvo este informe (`git diff --exit-code` = 0,
`git diff --cached --exit-code` = 0).

## Checklist C2 — Estado coherente
- [x] Solo una feature in_progress en `feature_list.json` (#141). #142 y #143 están `spec_ready`, con specs puntero aprobadas que no cambian desde la firma.
- [x] `progress/current.md` describe la sesión activa (ver observación 4: la última línea va retrasada).

## Checklist C3 — Arquitectura
- [x] Cero cambio en producción. `git diff --numstat origin/main...HEAD -- mobile-pet-tracker/` da solo `350 0` en `src/screens/home/weekly-activity-chart.test.tsx`. El blob de `weekly-activity-chart.tsx` en HEAD es igual al de `origin/main` (`c258abed`). La gráfica, `package.json`, `bun.lock` y `src/i18n/catalog.ts` no cambian (exit=0).
- [x] domain, application e infrastructure: no aplica, la feature solo añade tests.
- [x] Lista cerrada del handoff respetada. `git diff --name-only 0883b1fe..HEAD` da exactamente el test, `progress/impl_mobile-weekly-day-column-value-cross-lock.md` y `specs/mobile-weekly-day-column-value-cross-lock/traceability.md`.

## Checklist C4 — TDD
- [x] R1, R2 y R3 tienen cada uno su `describe` y lo nombran: `#141 R1: …`, `#142 R2: …` (tres `it`: R2.1, R2.2 y R2.3) y `#143 R3: …`. R4 no tiene test propio, y la spec lo declara así. Lo cierro por inspección, abajo.
- [x] C4 vía b, siete commits con los mensajes literales del handoff:
  - `d84b74ab` (test de R1 y la mutación `valuecross` en la gráfica, blob `9f3c5bfd`)
  - `77914294` (la gráfica vuelve a `c258abed`)
  - `a7ec30ac` (test de R2 y la mutación `cardtail`, blob `0ac97f35`)
  - `1e364062` (la gráfica vuelve a `c258abed`)
  - `7e8b406a` (test de R3 y la mutación `z_labelselfirstmetric`, blob `6eda3dd1`)
  - `7d95624f` (la gráfica vuelve a `c258abed`)
  - `5a3f13cc` (informe y trazabilidad)
- [x] Los tres rojos fallan por aserción, cada uno solo en su `describe`. Los reproduje en el sitio con los blobs de cada commit rojo:
  - Rojo de R1 (test `b4474f36`, gráfica `9f3c5bfd`): exit=1; 1 fallido y 55 pasados de 56. Solo cae `#141 R1`, con `expect(received).toStrictEqual(expected)` en la línea 2044 (a1).
  - Rojo de R2 (test `5e4c6905`, gráfica `0ac97f35`): exit=1; 3 fallidos y 56 pasados de 59. Solo caen los tres `it` de `#142 R2`, con el mismo matcher en las líneas 2163, 2236 y 2270 (a1 de cada uno).
  - Rojo de R3 (test `3e0ff4a3`, gráfica `6eda3dd1`): exit=1; 1 fallido y 59 pasados de 60. Solo cae `#143 R3`, en la línea 2314 (a1).
- [x] Las 23 aserciones de candado nuevas usan `toStrictEqual` contra esperados literales del test: 10 en R1 (a1-a10), 10 en R2 (R2.1 a1-a7, R2.2 a1-a2, R2.3 a1) y 2 en R3 (a1-a2), más una mención en el comentario de la línea 2161. Ninguno de los símbolos de producción que el fichero importa (`BAR_MIN_HEIGHT`, `CHART_PAD_*`, `WEEKLY_METRICS`, `weekdayLabel`, `Y_LABEL_CHARS`, `TABULAR_NUMS`…) aparece en las 350 líneas nuevas. Las guardas usan `toEqual({ selected: true })`: 6 en R1, 3 en R2 y 1 en R3.
- [x] El blob del test en HEAD, `3e0ff4a3`, coincide con el blob final de la spec, y el fichero base es un prefijo exacto del nuevo (`cmp -n`, exit=0): los `describe` de #68, #74, #130, #131, #132, #135 y #140 quedan intactos. No aparece ningún `#141`, `#142` ni `#143` pelado: cada uno va seguido de su R-id (`#141 R1` 2, `#142 R2` 4, `#143 R3` 2), y la sonda `hexbare` da 1 rojo en `design-drift.test.ts`, en `#68 R18`, línea 243.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas pendientes. El único resultado de `grep -ci pendiente` es la línea de la regla (25), no una fila de la tabla. Desde el handoff, en ese fichero solo cambian las filas, de pendiente a hash.
- [x] Los seis hashes (`d84b74ab`, `77914294`, `a7ec30ac`, `1e364062`, `7e8b406a`, `7d95624f`) pasan `git merge-base --is-ancestor … HEAD`. La fila de R4 cita el verde de R3 (`7d95624f`), como pide la spec.
- [x] Formato de commits: `test(mobile): …` y `docs(mobile): …`, los que prescribe el handoff (ver observación 3).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla `[x] Aprobado por humano (fecha: 2026-09-30)`, firmada en `c164d592`. Las specs puntero de #142 (`specs/mobile-weekly-card-children-strict-lock/requirements.md`) y #143 (`specs/mobile-weekly-day-selected-first-metric-lock/requirements.md`) tienen `status: approved`. Desde la firma, lo único que cambia bajo `specs/` es `traceability.md`.

## Checklist C7 — Sin código huérfano
- [x] N/A. Esta feature no reemplaza nada existente.

## C8 — Carta de UI
- [x] No hay cambio en la UI. El test no añade copy (las tres apariciones nuevas de «Sin datos de este día» usan el texto que ya existe) y no toca el catálogo. El grep-clean de la carta (`StyleSheet`, `text-[10px]`) da 0 en los dos ficheros.

## R4, cerrado por inspección
- R4.1: suite móvil verde medida sin pipe en `init141.log`, 86 suites y 1626 tests contra una base de 86 / 1621. El delta es +5 tests y +0 suites, el declarado. El test pasa de 55 a 60.
- R4.2: `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` da 0, y la gráfica acaba en su blob de base (`c258abed`).
- R4.3: ningún `describe` previo editado (prefijo exacto, +350/−0; ver C4), y todos verdes.
- R4.4: los recuentos de [[tasks]] §R4 coinciden con la spec. Sin cambio: `use-api` 1, `useApi` 0, `CHART_PAD` 10; en la gráfica, `style={CONTINUOUS_CORNER}` 1, `style={TABULAR_NUMS}` 4, `radiogroup` 1 y `Platform` 0. Los que crecen lo hacen en lo declarado: `^describe(` 25 → 28, `toStrictEqual` 12 → 35, `toEqual({ selected: true })` 9 → 19, `weekly-activity-day-row` 10 → 16, `weekly-activity-card` 10 → 13, `weekly-activity-day-label` 3 → 4, `Sin datos de este día` 4 → 7 y `within(` 12 → 15.
- R4.5: `test ! -e .expo/types/router.d.ts` da exit=0. El typecheck y el lint de `init141.log` están verdes (líneas 20689 y 20685), y `bunx eslint` de la gráfica y su test da exit=0, sin salida.
- R4.6: sin dependencias nuevas (`package.json` y `bun.lock` sin diff) y sin copy nuevo.
- R4.7: el informe de Codex trae la tabla de sondas re-medida sobre el árbol final, con las 34 sondas en su resultado exigido. Las volví a medir yo (abajo).

## Sondas (en el sitio; restauración con `git checkout HEAD --`, y diff y cached en 0 tras cada una)

Todos los blobs de las mutaciones coinciden con los de la spec (columna «Blob»). En la de `h_reminderstail`, un fallo de mi script de sondas dejó `index.tsx` vacío un instante antes de aplicar la mutación. Lo restauré con `git checkout HEAD --` (diff y cached en 0) y repetí la sonda: el resultado de abajo es el de la repetición. «6 suites» son la gráfica, `index.test.tsx`, `design-drift`, `consistency-classnames`, `legibility-classnames` y `ui-language`; sobre HEAD limpio dan 389/389.

| Sonda | Blob | Exigido | Obtenido |
|---|---|---|---|
| `valuecross` (6 suites) | `9f3c5bfd` | rojo 1 de 389, R1 a1 | 1 rojo de 389, `#141 R1`, línea 2044 (a1) |
| `valuecrossmid` | `7741d69f` | R1 a4 | 1 rojo de 60, línea 2075 (a4) |
| `valuecrosssel` | `68fccd05` | R1 a5 | 1 rojo de 60, línea 2080 (a5) |
| `valuecrossdistsel` | `73025937` | R1 a7 | 1 rojo de 60, línea 2099 (a7) |
| `valuecrossfirstsel` | `497fe887` | R1 a8 | 1 rojo de 60, línea 2109 (a8) |
| `valuecrosstrend` (6 suites) | `328d6c59` | verde, (D) | verde, 389/389 |
| `valuecrossnomissing` (6 suites) | `0484f58d` | verde, (D) | verde, 389/389 |
| `valuenested` | `fc8c1142` | R1 a1 | 1 rojo de 60, línea 2044 (a1) |
| `labelcross` | `54f60928` | rojo 2: `#68 R3` y R1 a1 | 2 rojos de 60: `R3: la letra del eje…` (`toEqual`, línea 524) y `#141 R1`, línea 2044 |
| `dashtext` | `2e0bb8f2` | rojo 2: `#68 R5` y R1 a1 | 2 rojos de 60: `R5: un día sin dato…` (`toHaveTextContent`, línea 588) y `#141 R1`, línea 2044 |
| `z_labelnested` (`-t "#14[13] R"`) | `93f3e415` | rojo 1: R1 a1; R3 verde | 1 rojo, `#141 R1`, línea 2044; 1 pasado (R3) y 58 omitidos |
| `rowtail` | `333d4e0c` | rojo 4: `#140 R1`, `#140 R2`, R1 a1, R3 a1 | 4 rojos de 60, líneas 1878, 1954, 2044 y 2314 |
| `cardtail` (6 suites) | `0ac97f35` | rojo 3 de 389: R2.1, R2.2 y R2.3, a1 | 3 rojos de 389, líneas 2163, 2236 y 2270 |
| `cardtailunmeasured` | `f56344a0` | rojo 2: R2.1 a1 y R2.3 a1 | 2 rojos de 60, líneas 2163 y 2270 |
| `cardtaildist` | `a9cb1d46` | R2.1 a3 | 1 rojo de 60, línea 2184 (a3) |
| `cardtailsel` | `0a2ac3ca` | rojo 2: R2.1 a4 y R2.2 a2 | 2 rojos de 60, líneas 2189 y 2247 |
| `cardtailfirstsel` | `eafa0a44` | rojo 2: R2.1 a5 y R2.2 a2 | 2 rojos de 60, líneas 2199 y 2247 |
| `cardtailwalks` | `42546360` | R2.1 a7 | 1 rojo de 60, línea 2218 (a7) |
| `cardtailtrend` | `62e5e054` | R2.2 a1 | 1 rojo de 60, línea 2236 (a1) |
| `cardtailnomissing` | `8eaaa7be` | R2.2 a1 | 1 rojo de 60, línea 2236 (a1) |
| `cardtailempty` | `4ef6f4da` | R2.3 a1 | 1 rojo de 60, línea 2270 (a1) |
| `cardtailen` (6 suites) | `684bc56d` | verde, (D) | verde, 389/389 |
| `z_labelselfirstmetric` (6 suites) | `6eda3dd1` | **rojo** 1 de 389, R3 a1 | **rojo**, 1 de 389, `#143 R3`, línea 2314 (a1). La observación 1 de #140 queda cerrada |
| `z_labelselmissingfirst` | `46c5bd8c` | R3 a2 | 1 rojo de 60, línea 2331 (a2) |
| `z_labelselwalks` (6 suites) | `d3694f11` | verde, (D) | verde, 389/389 |
| `z_valueselfirstmetric` (6 suites) | `d9a8fe6a` | R3 a1 | 1 rojo de 389, línea 2314 |
| `z_dashselfirstmetric` (6 suites) | `e48b0d18` | R3 a1 | 1 rojo de 389, línea 2314 |
| `z_colselfirstmetric` (6 suites) | `ea54258d` | R3 a1 | 1 rojo de 389, línea 2314 |
| `z_childselfirstmetric` (6 suites) | `098f89f4` | rojo 2: R1 a8 y R3 a1 | 2 rojos de 389, líneas 2109 (a8) y 2314 (a1) |
| `loose` (test) | `70a87d0e` | verde | verde, 60/60 |
| `loose` + `cardtail` | `70a87d0e` + `0ac97f35` | verde | verde, 60/60 |
| `hexbare` (sobre `design-drift.test.ts`) | `e80d30ba` | exit=1, 1 rojo de 55, `#68 R18` | exit=1, 1 rojo de 55, `#68 R18`, línea 243 |
| `h_tilerowtail` (`index.test.tsx`) | `e63d7fdf` | rojo 3 de 169 | 3 rojos de 169: `#71 R1` (línea 2398) y dos de `#81 R1-R6` (2877 y 2890) |
| `h_reminderstail` (`index.test.tsx`) | `29ff7910` | rojo 11 de 169 | 11 rojos de 169, en `#85 R5` (3), `#85 R9` (6) y `#70 R9` (2) |
| propia: `own_valuecrosslastsel` (6 suites) | `ee78ddc2` | (zona ciega) | **verde**, 389/389 (observación 1) |
| propia: `own_labelselfirstcol` (6 suites) | `ed5d9494` | (zona ciega) | **verde**, 389/389 (observación 1) |
| propia: `own_cardtailcompmissing` (6 suites) | `799976d7` | (zona ciega) | **verde**, 389/389 (observación 2) |

Todos los rojos lo son por aserción (`toStrictEqual`, salvo los de los `describe` previos, que usan su propio matcher), y ninguno cae fuera de lo exigido.

## Observaciones

Ninguna bloquea el veredicto. Son hallazgos para que el `leader` decida qué hacer con ellos.

1. **Zona ciega sin declarar: qué columna está seleccionada.** R1, R2 y R3 solo seleccionan `2026-09-05` (la cuarta columna) y `2026-09-07` (la sexta, `missing`). La primera y la última no se seleccionan nunca. La tabla §Zona ciega cruza la métrica con el tipo de día (ninguno, medido, `missing`), pero no con la posición del día seleccionado. Dos mutaciones propias lo muestran, y las dos dan verde en las 6 suites (389/389):
   - `own_valuecrosslastsel` (blob `ee78ddc2`): la línea del valor pasa a `metricValue(selection?.dataIndex === 6 && dataIndex === 6 ? days[0] : day, selectedMetric),`. La última columna muestra el valor del miércoles, pero solo mientras ella misma está seleccionada.
   - `own_labelselfirstcol` (blob `ed5d9494`): la clase de la etiqueta pasa a `{selection?.dataIndex === 0 && selectedMetricIndex === 0 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}`.

   La implementación sigue la spec al pie de la letra, así que no es un defecto de Codex, sino un límite de la spec. Las dos mutaciones dependen de la posición a propósito, como `valuecrosstrend`, así que el argumento de los otros (D) («hacerlo es cambiar la gráfica a propósito») les vale. Propuesta: declararlo (D) en §Fuera de alcance, o registrarlo como (F) si se quiere cerrar (bastaría con seleccionar también la primera y la última columna en R1 y R3).
2. **Zona ciega sin declarar en R2: comparación con el día `missing` seleccionado.** Mutación propia `own_cardtailcompmissing` (blob `799976d7`): encima de `</Card>` va `{trend !== null && selectedDay?.source === 'missing' ? <View /> : null}`. Da verde en las 6 suites (389/389). R2.2 usa una semana sin día `missing`, así que la combinación no se alcanza. Las (D) de R2 nombran `distanceM` con el `missing` y `walkCount` sin día o con un día medido, pero no esta. Mismo tratamiento que la observación 1.
3. **C5, prefijo de los commits.** Son `test(mobile)`/`docs(mobile)` en vez de `feat(<scope>)`. Los prescriben la spec y el handoff, y son correctos para una feature sin cambio en producción. No es un incumplimiento.
4. **`progress/current.md` va retrasado.** Su última línea sigue diciendo «Parado esperando a Codex». Es un artefacto del `leader`; conviene actualizarlo en el cierre.
5. **Skills en Codex.** El informe de Codex declara que no cargó ninguna skill (deuda B5; esta vez la propia spec le decía que no las cargara). No afecta, porque no hay cambio en la UI.
6. **Autoría.** Los siete commits firman como `Claude <claude@srv1178023.hstgr.cloud>`, la identidad git del VPS, aunque los escribió Codex. Es informativo, por si importa para la atribución.
7. **Cabecera del informe de Codex.** `progress/impl_mobile-weekly-day-column-value-cross-lock.md` empieza con dos líneas de salida cruda (`pwd` y la branch) antes del título `#`. El propio informe lo explica en su línea 6. Es cosmético.

## Output de ./init.sh

El `leader` lo ejecutó (al subagente se le deniega). Lo leí de
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/init141.log`,
de 20698 líneas. `init141.exit` = `exit=0`, y `head_start` = `head_end` = `5a3f13cca247dc9dd759217824afec2b7014fe6f`.

```
218: Test Suites: 171 passed, 171 total            (backend unit)
219: Tests:       1307 passed, 1307 total
231: Test Suites: 2 passed, 2 total                (infra)
232: Tests:       14 passed, 14 total
13878: PASS src/screens/home/weekly-activity-chart.test.tsx
20370: Test Suites: 86 passed, 86 total            (mobile)
20371: Tests:       1626 passed, 1626 total
20372: Snapshots:   1 passed, 1 total
20668: Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
20669: Tests:       8 skipped, 389 passed, 397 total
20685: ✅ Lint sin errores
20689: ✅ Typecheck sin errores
20692: ✅ Todo verde. Listo para trabajar.
```

La línea 20368 («A worker process has failed to exit gracefully») es ruido de jest y no un fallo.
