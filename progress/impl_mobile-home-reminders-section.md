# Implementación — mobile-home-reminders-section (#70)

## Alcance

- Branch: `feature/70-mobile-home-reminders-section`.
- Base de deltas: `b0ec5a8`.
- D1-D3 aprobadas por humano en `requirements.md` e incorporadas en `40413db`;
  D4-D6 ratificadas en `d5b0a43` y firmadas por el humano en `6eae6ed`.
- Cero llamadas nuevas, cero backend, cero infra y cero dependencias.

## Baseline

- `env -u FORCE_COLOR ./init.sh`: exit 0 antes de escribir código.
- Móvil: 68 suites, 1054 tests, 1 snapshot, todo verde.
- Backend: 163 suites, 1243 tests; infra: 2 suites, 14 tests; e2e: 25 suites y 354 tests pasados, 3 suites/8 tests omitidos.

## Implementación por R-id

Se completa durante la secuencia TDD; los hashes definitivos también quedan en
`specs/mobile-home-reminders-section/traceability.md`.

- **R2**: rojo `345558a` (candado del contrato); verde `df759b8` (interfaz
  exacta y `nextReminder`/`activitySummary` intactos). Test dirigido y
  `bun run typecheck`, verdes tras la implementación.
- **R4**: rojo `aa7f9aa` (casos futuro/mañana/hoy/pasado); verde `3badfec`
  (componentes de calendario, medianoches UTC y cero normalizado).
- **R5**: la implementación original quedó verde en `a6b82bf` y `af8ae4e`.
  D5 sustituyó el andamiaje inerte de `process.env.TZ` por espías estructurales
  en `5385ed8` y `238e414`: `Date.UTC` recibe componentes, `Date.parse` no se
  usa y el constructor `Date` nunca recibe la cadena cruda.
- **R1**: rojo `16c6b22` (estructura, rótulo y enlace); verde `f498f1e`
  (cabecera y cuerpo vacío conforme a D1, más las siete claves necesarias).
  La auditoría endureció clase/orden con el rojo conjunto `6247c3f` y el verde
  `0e00251`, ambos nombrando R1.
- **R6**: rojo `6247c3f` (fixture distinta en lista y detalle, enlace exacto de
  nombre/fecha/contador e inercia); verde `0e00251` (fila `Card` desde el
  detalle, sin renderizar el id ni añadir navegación). D6 añadió en `5385ed8`
  los candados de pertenencia/tinta del icono y recetas de nombre/fecha.
- **R7**: rojo `bbb54e4` (`0 d` contradice `Hoy`); verde `675390c` (helper de
  módulo con ramas futura, hoy y vencida, y texto/nombre accesible unidos).
- **R8**: rojo `e0c15c7` (estado vacío ausente); verde `0752baf` (`Card`
  neutral con la misma anatomía de fila y sin datos ficticios). D6 añadió en
  `5385ed8` los candados de pertenencia/tinta y receta del texto vacío.
- **R9**: rojo `1f2ed2b` (esqueleto ausente y cardinalidad pendiente 0 en vez
  de 1); verde `36012d4` (un esqueleto y silencio en todos los errores). La
  cardinalidad trasladada por D1 cuenta `children`, no `testID`.
- **R10**: rojo `6087349` (cero navegación y cero apariciones de la ruta);
  verde `0844b75` (un único `router.push('/reminders')`, fuera de
  `QUICK_ACTIONS`, sin cast ni ruta nueva). Tras la autorización humana sobre
  C8, rojo `9f36621` y verde `ed457ba` fijaron feedback `pressed` sin crear otro
  camino.
- **R11**: rojo `c4c0b45` (mutación de producción que quitó el nombre accesible
  y murió con `undefined`); verde `e34b07e` (restauración del label expandido,
  con un solo botón accesible en la sección).
- **R12**: rojo `8f694bb` (M8 de producción quitó `TABULAR_NUMS` y recibió
  `undefined`); verde `677ab51` (contador tabular; nombre, fecha y vacío sin
  cifras tabulares; `Card` y huecos de categoría verificados).
- **R13**: rojo `edef02e` (mutación de producción `Syringe` → `CalendarPlus`);
  verde `285efa7` (dos usos reales de `Syringe`, tamaño 20, sin emoji, y doble
  nominal añadido solo como preparación).
- **R14**: rojo `c1be954` (orden observado con la sección antes de accesos);
  verde `2666977` (sección entre actividad semanal y última posición, sin
  alterar los tres candados de orden heredados).
- **R15**: rojo `837e838` (mutación de producción elevó `getPet` de 1 a 2);
  verde `1ad0d08` (recuento preservado: lista 1, detalle 1, actividad 1).
- **R3**: rojo `0b30065` (M5 añadió un segundo hijo sin `testID`; murieron R3
  y la cardinalidad de R9); verde `264c490` (barra de comidas ausente, sin
  import de nutrición ni dato inventado).
- **R16**: rojo `bbeb986` (filas/usos registrados, carta aún sin el bloque y
  longitud todavía 281); verde `b5575f9` (288 claves por idioma y bloque nuevo
  de `src/screens/home/index.tsx` en la carta).
- **R17**: rojo `dfdf89a` (hex de producción detectado en `index.tsx`); verde
  `f81668c` (tinta del icono restaurada al token resuelto por tema).
- **R18**: rojo `dfbdb1b` (solo fallaron los deltas declarados de cifras
  tabulares y tinta acento); verde `dcd0faa` (cuatro mandos tabulares y dos de
  legibilidad actualizados como sumas visibles).

## Premisas corregidas contra el árbol

- D1: la cardinalidad 1/1/0 se prueba en R9, cuando ya existen los hijos reales.
- D2: #83 y #84 ya existen; el cálculo fingido de comidas servidas vive en
  `food.tsx:65-67` y el estado por fila en `food.tsx:194`.
- D3: `calendarDaysUntil` normaliza cero para no producir `-0`.
- D5: cambiar `process.env.TZ` dentro de un `it` de Jest no cambia la zona de
  V8; la disciplina de parseo se prueba estructuralmente y muerde en cualquier
  zona del runner.
- R16: `specs/mobile-ui-language/design.md` no contenía el bloque de
  `src/screens/home/index.tsx` que la spec daba por existente; conservaba el
  bloque histórico de `src/app/(tabs)/home.tsx`. Se añadió un bloque nuevo sin
  reescribir el historial.

## Segundo pase

- **Gate previo**: D4-D6 estaban firmadas en `6eae6ed`. El baseline
  `env -u FORCE_COLOR ./init.sh` terminó con exit 0 antes de tocar los
  candados: backend 163 suites/1243 tests, infra 2/14, móvil 68/1078, e2e 25
  suites/354 tests pasados y 3 suites/8 tests omitidos; lint y typecheck verdes.
- **B1 / D5**: `5385ed8` borró los dos `try/finally` sobre `process.env.TZ` y
  añadió los espías de `Date.parse`, `Date.UTC` y constructor `Date`.
  `238e414` cerró además la variante cruda por constructor en
  `calendarDaysUntil`. Una sonda funcional que construía el objetivo con
  `new Date('2026-09-15')` dejó 1 fallo/5 verdes en `format.test.ts`, aunque el
  resultado numérico seguía siendo correcto en UTC: el espía vio dos llamadas
  con la cadena cruda. La producción se restauró antes de continuar.
- **O1 / D6 — tintas**: se cruzaron `vaccineInk` y `muted` en los dos usos de
  `Syringe` de producción. `index.test.tsx` quedó con 2 fallos/84 verdes: la
  fila recibió `--color-muted` donde esperaba `--color-category-blue-strong`,
  y el vacío recibió el valor inverso. Se restauró producción.
- **O1 / D6 — recetas**: tres sondas separadas cambiaron en producción la
  receta del nombre, la fecha y el texto vacío. Cada corrida dirigida quedó
  con 1 fallo/85 verdes en la aserción exacta correspondiente. Tras restaurar
  cada una, las dos suites dirigidas quedaron 92/92 verdes. Los iconos se
  obtienen ahora con `within(row).getByTestId('icon-syringe')`, no solo por
  inventario de fuente.
- **M1 y M2 rehechas**: se ejecutó literalmente `bun run test`, sin exportar
  `TZ` (`TZ=UNSET`), sobre cada commit rojo y cada restauración. Los pares
  finales y su resultado se detallan en §Prueba de mutación R19b.
- **Grafo**: `graphify update .` terminó con exit 0; reextrajo 723 ficheros y
  reconstruyó 11271 nodos, 17276 aristas y 702 comunidades. El aviso conocido
  por `tree_sitter_sql` siguió intacto y no hubo cambios versionados.
- **Gate integral final del segundo pase**: `env -u FORCE_COLOR ./init.sh`
  terminó con exit 0. Build verde; backend 163 suites/1243 tests, infra 2/14,
  móvil 68/1078 con 1 snapshot, e2e 25 suites/354 tests pasados y 3 suites/8
  tests omitidos; lint y typecheck verdes. Los avisos de `.env`, `STATUS.md`,
  Node/AWS y servicios simulados siguieron siendo los conocidos y no
  bloqueantes del harness.

## Tercer pase

- **Gate previo**: D7 quedó firmada por el humano en `4e4efdd`, sobre la
  enmienda `30eda5b`; `a62fe67` aclaró que las sondas transitorias de O5 están
  autorizadas. El baseline `env -u FORCE_COLOR ./init.sh` terminó con exit 0:
  backend 163 suites/1243 tests, infra 2/14, móvil 68/1078, e2e 25 suites/354
  tests pasados y 3 suites/8 tests omitidos; build, lint y typecheck verdes.
- **Candados D7**: `232c38b` añadió en R5 un `now` sintético cuyo día local es
  10 y cuyo día UTC es 11, y extendió las llamadas esperadas a `Date.UTC` con
  sus componentes locales. R8 exige ahora `flex-row items-center gap-3` en el
  estado vacío y R12 fija el segundo hijo de la fila cargada como el
  envoltorio `flex-1`. En producción limpia, las dos suites dirigidas quedaron
  92/92 verdes y `bun run typecheck` terminó verde.
- **Sonda O5-a**: se cambió transitoriamente la fila vacía de
  `flex-row items-center gap-3` a `gap-3`. `index.test.tsx` quedó con 1
  fallo/85 verdes, exactamente en R8: esperaba la receta de fila y recibió la
  `Card` sin `flex-row items-center`. Se restauró y `git diff` quedó vacío.
- **Sonda O5-b**: se cambió transitoriamente el envoltorio de nombre + fecha de
  `flex-1` a `w-24`. `index.test.tsx` quedó con 1 fallo/85 verdes,
  exactamente en R12: esperaba `flex-1` y recibió `w-24`. Se restauró y
  `git diff` quedó vacío; las dos suites dirigidas volvieron a 92/92 verdes.
- **M9**: rojo `9adea68`, sustituyendo los getters locales de `now` por
  `getUTCFullYear`/`getUTCMonth`/`getUTCDate`. El comando literal
  `bun run test`, con `TZ` sin definir, dejó 1 suite/1 test rojo y 67 suites/
  1077 tests verdes: el caso sesgado de R5 esperaba `5` y recibió `4`. Verde
  `4140c2c`: 68/68 suites y 1078/1078 tests. La comprobación
  `git diff --quiet 9adea68^ 4140c2c -- mobile-pet-tracker/src/screens/home/format.ts`
  confirmó que el par restaura producción exactamente; el diff conjunto de
  `format.ts` e `index.tsx` contra `4e4efdd` también quedó vacío.
- **Grafo**: `graphify update .` terminó con exit 0; reextrajo 723 ficheros y
  reconstruyó 11281 nodos, 17285 aristas y 717 comunidades. Conservó el aviso
  conocido de `tree_sitter_sql` y no produjo cambios versionados.
- **Gate integral final del tercer pase**: `env -u FORCE_COLOR ./init.sh`
  terminó con exit 0. Build verde; backend 163 suites/1243 tests, infra 2/14,
  móvil 68/1078 con 1 snapshot, e2e 25 suites/354 tests pasados y 3 suites/8
  tests omitidos; lint y typecheck verdes. El flaky conocido #76 no apareció;
  los avisos de `.env`, `STATUS.md`, Node/AWS y servicios simulados siguieron
  siendo los no bloqueantes del harness.

## Deltas R18

Medición ejecutada contra `b0ec5a8`, conservando cada base como expresión y no
como una cifra final colapsada:

```sh
git diff --unified=0 b0ec5a8 -- mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/screens/home/index.test.tsx
bun run test -- --runInBand src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts
```

Antes del verde, los candados heredados dejaron solo 3 fallos esperados y 129
tests verdes; el candado explícito de R18 añadió el cuarto rojo esperado. Tras
`dcd0faa`, las 5 suites y sus 133 tests quedaron verdes.

| # | Base `b0ec5a8` → resultado | Delta observado |
|---|---|---|
| 1 | `260 + 16 + 1 + 4` → `260 + 16 + 1 + 4 + 7` | `+7`; igualdad de idiomas y marcadores intacta |
| 2 | `21 + 15 + 1 + 4` → `21 + 15 + 1 + 4 + 7` | `+7` filas de `R3_HOME`; `ALL_USES` conserva su suma derivada, sin constante absoluta |
| 3 | Home: `HOME_TABULAR_AT_9358CC7 + HOME_TABULAR_DELTA_69` → esa misma suma `+ HOME_TABULAR_DELTA_70`; total `14 + 4 + 1` → `14 + 4 + 1 + 1` | `+1` en Home. El grep nominal da 5→6 en Home y 20→21 global; el uso extra global de `PetHero` sigue fuera del inventario cerrado, igual que en la base |
| 4 | Home `1` → `2`; total `.toBe(13)` → `.toBe(13 + 1)` | `+1` por el enlace. El grep global 14→15 conserva el uso de `weekly-activity-chart.tsx` que ya estaba fuera de ese inventario |
| 5 | 9 bloques `describe` nominales → `9 + 1` | `+1`, el bloque propio de R17 |
| 6 | 6 entradas nominales de `reicon` → `6 + 1` | `+1`, solo el doble `Syringe` de test |
| 7 | Home `2` → `2`; total `33 + 1 + 1` → `33 + 1 + 1` | `Δ0`; las dos ramas nuevas heredan `Card` |
| 8 | `['utils/category-palette.ts']` → la misma lista | `Δ0`; ninguna clase categórica se escribió en Home |
| 9 | 16 usos de `bg-accent-soft` → 16 | `Δ0` |
| 10 | 13 botones sólidos primarios → 13 | `Δ0`; “Ver todos” sigue siendo enlace de texto |
| 11 | listas de radios prohibidos `[]` → `[]` | `Δ0` |
| 12 | `19 + 2` ficheros de pantalla → `19 + 2` | `Δ0`; no se creó pantalla ni módulo de producción |
| 13 | glifos `[]` → `[]`; tres `ChevronRight` de Profile → tres | `Δ0` |
| 14 | inventario de `text-warning-strong` sin recuento → el mismo | `Δ0` |
| 15 | tres bloques heredados de orden → byte idénticos | `Δ0`; no hubo reubicación de sus asserts |
| 16 | comparaciones relativas entre idiomas → las mismas | Cuadran sin constante nueva |
| 17 | `ALL_USES` contra suma de bloques → la misma relación | Cuadra solo con las siete filas nuevas |
| 18 | rutas delgadas `[5, 5, 3, 7]` → `[5, 5, 3, 7]` | `Δ0`; `src/app/(tabs)/home.tsx` intacto |

No se movió ninguna cifra fuera de las filas 1–6 previstas; las filas 7–18
quedaron sin cambio.

## Prueba de mutación R19b

- **M1**: rojo final `544a525`, con `calendarDaysUntil` cambiado a
  `Math.ceil((Date.parse(date) - now.getTime()) / DAY_MS)` y la normalización
  de cero de D3 intacta. `bun run test`, sin `TZ`, dejó 1 fallo/1077 verdes:
  R5 observó dos llamadas de `Date.parse` con `'2026-09-15'`. Verde final
  `a50245e`: 68/68 suites y 1078/1078 tests.
- **M2**: rojo final `75dd5c1`, con `fmtDate` construido desde
  `new Date(date)`. `bun run test`, sin `TZ`, dejó 1 fallo/1077 verdes: el espía
  recibió `[['2026-09-15']]` donde exige `[[2026, 8, 15]]`. Verde final
  `bcde085`: 68/68 suites y 1078/1078 tests.
- **M3**: rojo `58338f3`, cruzando los datos de nombre y fecha. En R6 cayó
  exactamente el candado de enlace de datos —esperaba `Antirrábica` y recibió
  el ISO—, con 1 fallo/1 verde. Verde `1c940e8`.
- **M4**: rojo `6e9206d`, eliminando la rama vencida. El único test de R7 cayó:
  esperaba `Vencida` y recibió `-2 d`. Verde `06cd7cf`.
- **M5**: rojo `1763391`, añadiendo al cuerpo un `View` de producción sin
  `testID`. Cayeron exactamente dos candados: la cardinalidad de R9 trasladada
  por D1 y la exclusión de comidas de R3 (esperaban 1 hijo y recibieron 2).
  Verde `c13b934`.
- **M6**: rojo `ca88209`, cambiando el destino a `/add-reminder`. R10 dejó 2
  fallos/1 verde: destino exacto y unicidad del literal `/reminders`. Verde
  `91d636d`.
- **M7**: rojo `bffaa47`, moviendo la sección delante de `quick-actions`. R14
  dejó 1 fallo/1 verde y mostró el único cambio de orden esperado. Verde
  `a223d4c`.
- **M8**: rojo `efb9bba`, quitando `style={TABULAR_NUMS}`. Cayeron los dos
  tests dirigidos: R12 recibió `undefined` y R18 midió `0` donde exigía el
  delta `+1`. Verde `d22e1c9`.

La comprobación `git diff --quiet <rojo>^ <verde> -- <fichero-producción>` dio
`restored` para los ocho pares, incluidos los pares finales M1/M2: cada verde
revierte exactamente su mutación de producción.

## Decisiones humanas durante la implementación

- Tras detectar que el JSX exacto de R10 omitía el feedback obligatorio de C8,
  el humano autorizó el 2026-09-09 añadir feedback `pressed` y su candado al
  enlace `reminders-see-all`; D4 lo ratificó por escrito y quedó firmado junto
  con D5-D6 en `6eae6ed`.

## Verificación final

- Previa a las mutaciones: `bun run test` — 68 suites, 1077 tests y 1 snapshot
  verdes—; `bun run typecheck`, verde.
- Tras las ocho restauraciones y el candado de feedback autorizado:
  `bun run test` —68 suites, 1078 tests y 1 snapshot verdes— y
  `bun run typecheck`, verde.
- Grep-clean de R19: cero hex fuera de `src/theme/`, cero clases arbitrarias,
  `StyleSheet.create`, sombras/elevation legacy; el inventario de radios contiene
  únicamente `rounded-card`, `rounded-full` y `rounded-xl`.
- Primera entrega — corrida final `env -u FORCE_COLOR ./init.sh`: exit 0. Build verde;
  backend 163 suites/1243 tests, infra 2/14, móvil 68/1078 con 1 snapshot,
  e2e 25 suites/354 tests pasados y 3 suites/8 tests omitidos; lint y typecheck
  verdes. Los avisos de `.env`, `STATUS.md`, Node/AWS y servicios simulados son
  los mismos avisos no bloqueantes del harness; no se modificó ninguno.
- Primera entrega — `graphify update .`: exit 0; reextrajo 726 ficheros y reconstruyó el grafo
  con 11234 nodos, 17241 aristas y 718 comunidades. El aviso por la dependencia
  opcional `tree_sitter_sql` se dejó intacto —esta feature no añade
  dependencias— y el comando no produjo cambios versionados.
