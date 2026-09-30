# review: mobile-weekly-day-row-layout-lock (#131 + #135)
Fecha: 2026-09-30T03:36:00Z
Veredicto: APROBADO

- Revisado: `feature/131-mobile-weekly-day-row-layout-lock` en el worktree
  `/home/claude/sites/Pet-Tracker-wt-backend`, HEAD
  `2e1dcb2fd38de1117847b09db3353bc40f368218`. HEAD era el mismo al empezar y
  al acabar la revisión, y `git status --short` salía vacío antes de escribir
  este fichero.
- Base: `3820b89a`, que es a la vez `origin/main` y el merge-base.
- Handoff H: `51a13bf6`. Firma de la spec: `d3992c47` (vía Notion).
- Esta revisión cubre dos entradas y un solo veredicto. #131 son R1 a R3 y
  #135 es R4; R5 es el cierre medido. La spec puntero de #135
  (`specs/mobile-weekly-chart-metric-selector-parent-lock/requirements.md`)
  está approved y no cambia desde `d3992c47`.
- `init.sh` lo corrió el leader y aquí se lee su log. El reviewer no lo
  relanzó, por instrucción expresa: el clasificador se lo deniega al
  subagente, y el worktree comparte Postgres y LocalStack con otra sesión.
- Skills del reviewer: `expo:expo-overview`. C8 se evalúa contra
  `docs/ui-guidelines.md`.
- Todo lo que fue ejecución se hizo en un worktree detached de scratch:
  los 8 commits de C4 y las 18 sondas (12 de la spec y 6 propias). Ese
  worktree ya está eliminado; la branch no se tocó.

## Bloqueantes

Ninguno.

## Checklist C1 — Arnés
- [x] N/A. No es la primera feature del proyecto.

## Checklist C2 — Estado coherente
- [x] Solo una feature in_progress: #131. #135 sigue en `spec_ready`, como
      pide §Qué firma el humano punto 1, porque `init.sh` aborta con dos
      features in_progress.
- [x] `progress/current.md` describe la sesión: #131 + #135, la branch, H y
      el handoff a Codex.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure. N/A: el diff contra
      `origin/main` es solo de test, y el código de producción queda idéntico.
- [x] Contratos de domain como interfaces puras. N/A, por lo mismo.
- [x] application depende de interfaces. N/A, por lo mismo.
- [x] infrastructure sin lógica de negocio. N/A, por lo mismo.

## Checklist C4 — TDD (vía b: mutación de producción versionada)
- [x] Cada R-id con test lo nombra en su `describe`:
  - `#131 R1: la fila de las siete columnas es una fila`
  - `#131 R2: la fila deja a cada lado el mismo hueco que el gráfico`
  - `#131 R3: cada columna reparte la fila a partes iguales`
  - `#135 R4: entre la tarjeta y cada uno de sus hijos no hay otro nodo`,
    con sus tres `it`

  R5 no tiene test, por diseño: es el cierre medido.
- [x] El historial es test primero, con cuatro pares rojo/verde:
  - Cada rojo lleva el bloque nuevo más exactamente la mutación D6.
  - Cada verde revierte solo la gráfica, al blob de base `c258abed`.

  El reviewer midió los 8 commits en un worktree aparte (Evidencia §2).
- [x] Ningún rojo cae por `ReferenceError` ni por un doble mutado. R1 cae por
      `toBe` y R2 a R4 por `toEqual`, siempre en el bloque nuevo.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas «pendiente» en R1 a R5. La única
      aparición de la palabra está en la frase de la regla.
- [x] Los mensajes de commit son literalmente los de tasks.md: 8 en
      `test(mobile): … (R<n>)` y el de docs en
      `docs(mobile): … (R1,R2,R3,R4,R5)`. No hay commit `feat` porque la
      feature no cambia producción.
- [x] Los 8 hashes citados existen y todos son ancestros de HEAD
      (`is-ancestor=0`). R5 cita el verde final `3a85668f`.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla
      `[x] Aprobado por humano (fecha: 2026-09-29)`. La firma es `d3992c47`.
- [x] `git diff d3992c47 HEAD -- specs/mobile-weekly-day-row-layout-lock/`
      solo toca `traceability.md`: 5 filas pasan de «pendiente» a hashes. La
      spec puntero de #135 no cambia.

## Checklist C7 — Sin código huérfano
- [x] N/A. Esta feature no reemplaza nada: añade candados a código ya
      existente.

## Checklist C8 — UI móvil (docs/ui-guidelines.md)
- [x] No hay cambio de producción. `weekly-activity-chart.tsx` termina con el
      blob `c258abed`, el mismo que en `origin/main` y en H. El diff de
      producción que exige tasks.md §R5 punto 5 da exit 0.
- [x] Greps limpios en la gráfica: 0 hex, 0 `StyleSheet`, 0 clases
      arbitrarias `-[…]`, 0 `shadow`, 0 `text-[10px]` y 0 `Platform`.
- [x] Dimensiones, Skeleton, feedback de pulsación, área táctil y
      animaciones: N/A, porque no se tocan. Lo que la feature hace es
      *candar* la geometría que ya pedía la carta: la fila `flex-row`, el
      padding alineado al gráfico, `flex-1` por columna y `min-h-11`, que
      ahora es parte de la clase exacta en R3.

## Observaciones (no bloqueantes)

1. **Dos combinaciones de estado que ningún candado ve y que la tabla de
   zona ciega no declara.** Lo miden dos sondas propias del reviewer
   (Evidencia §4), las dos verdes con 53/53:
   - `z_selnoflexfirst`: la columna seleccionada pierde `flex-1`, pero solo
     con la primera métrica. R3 selecciona el día después de cambiar a
     `distanceM`, así que la rama seleccionada solo se asevera con la
     segunda métrica. R1 y R2 siguen la misma secuencia.
   - `z_detailwraptrend`: el detalle va envuelto en un `<View>`, pero solo
     con comparación. R4 `it` 2 renderiza con comparación y sin día
     seleccionado.

   La tabla §Zona ciega de `requirements.md` es por entrada suelta, no por
   combinación, así que ninguna de las dos casillas existe para marcarla. Los
   tests coinciden byte a byte con los bloques aprobados en tasks.md: no es un
   defecto de la implementación. Queda para que el leader decida si lo
   registra como (F) o lo da por delimitado (D).
2. **`z_padtrend` sale verde, y coincide con lo declarado.** El padding de la
   fila depende de `trend`, y la tabla lo declara: R2 con comparación, «no,
   (D)».
3. **Cosmético: líneas vacías en el reporte.** El reporte de Codex tiene
   unas 47 líneas vacías entre «R4: green» y
   `## Commits y blobs de control`.
4. **El reporte no cita el hash de su propio commit.** El noveno commit
   (`2e1dcb2f`, docs) no puede incluirse a sí mismo. El reporte lo explica, y
   ninguna fila de traceability lo necesita.
5. **Aviso de worker en el log de `init.sh`.** El aviso «A worker process has
   failed to exit gracefully» está en la línea 20495. Es ruido preexistente,
   ya visto en la revisión de #138, y no deja ningún `FAIL`.
6. **Las fechas de la firma son coherentes.** La casilla dice 2026-09-29 y
   la página de Notion se editó por última vez el 2026-09-30T02:49:44Z. Es
   la misma noche en hora local, y el commit de firma es de las 02:51:52Z.
7. **Autoría de los commits.** Los commits de Codex y los del leader
   comparten autor git: `Claude <claude@srv1178023.hstgr.cloud>`, la
   configuración de la máquina. La autoría no distingue al implementador; lo
   distinguen el handoff y el reporte.

## Evidencia

### 1. Diff acotado

- `git diff --name-only 51a13bf6..HEAD` da exactamente la lista cerrada de H:

  ```
  mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
  progress/impl_mobile-weekly-day-row-layout-lock.md
  specs/mobile-weekly-day-row-layout-lock/traceability.md
  ```
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista solo el
  test, con +252 y −0.
- `git diff --exit-code origin/main...HEAD -- …weekly-activity-chart.tsx
  …package.json …bun.lock …catalog.ts …card.tsx` da exit 0.
- Blobs finales:

  | Ruta | Blob |
  |---|---|
  | chart | `c258abedde92d2be981be8507d3d898f13c612cb`, igual en HEAD, `origin/main` y H |
  | test | `416bf8b296b34d795a11d5d9f4d901a8b1a40fcb`, igual que en tasks.md |

Commits de Codex, con los blobs del chart y del test:

| Commit | Papel | chart | test | Cambio |
|---|---|---|---|---|
| 81251dfc | R1 rojo | 99ec492b | 3cc1c7d8 | test +45; chart `flex-row` pasa a `flex-col` |
| 1dfe1d22 | R1 verde | c258abed | 3cc1c7d8 | solo chart |
| 6ccce2e7 | R2 rojo | 9cb81179 | 38e49d89 | test +40; `paddingLeft: 0` |
| c16ef7c3 | R2 verde | c258abed | 38e49d89 | solo chart |
| 950b28a5 | R3 rojo | 9668ac80 | 6cf0706d | test +69; la rama de reposo sin `flex-1` |
| 5c22414f | R3 verde | c258abed | 6cf0706d | solo chart |
| a6f4d676 | R4 rojo | d053148a | 416bf8b2 | test +98; chart +2 (`<View accessible>` y `</View>` alrededor del selector) |
| 3a85668f | R4 verde | c258abed | 416bf8b2 | chart −2 |
| 2e1dcb2f | docs | — | — | reporte +559 y traceability 5/5 |

En cada par, el chart del verde es igual al del commit anterior al rojo: es
el revert exacto.

### 2. C4: rojos y verdes medidos por el reviewer

Worktree detached en el scratchpad, con `node_modules` enlazado desde la
branch. En cada commit se corrió:

```
bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > log 2>&1; echo exit=$?
```

| Commit | exit | Medido | Esperado (handoff) | `it` rojo y matcher |
|---|---|---|---|---|
| 81251dfc | 1 | 1 failed, 47 passed, 48 | 1 de 48 | `#131 R1 › la fila solo lleva flex-row…`, `toBe` en `expect(rowClassName()).toBe('flex-row')` |
| 1dfe1d22 | 0 | 48/48 | 48/48 | — |
| 6ccce2e7 | 1 | 1 failed, 48 passed, 49 | 1 de 49 | `#131 R2 › el padding de la fila son los dos huecos…`, `toEqual` |
| c16ef7c3 | 0 | 49/49 | 49/49 | — |
| 950b28a5 | 1 | 1 failed, 49 passed, 50 | 1 de 50 | `#131 R3 › las siete columnas llevan flex-1…`, `toEqual` en la primera aserción (`allResting`) |
| 5c22414f | 0 | 50/50 | 50/50 | — |
| a6f4d676 | 1 | 2 failed, 51 passed, 53 | 2 de 53 | `#135 R4 › sin comparación…` y `#135 R4 › con comparación…`, `toEqual`. El diff es `"weekly-activity-metric"` frente a `undefined`: el envoltorio no tiene testID. |
| 3a85668f | 0 | 53/53 | 53/53 | — |

Las cuentas de la suite entera (1614, 1615, 1616, 1619) no se re-midieron,
por instrucción del leader. El final, 86/1619, lo confirma el log de
`init.sh`.

### 3. Literales

- Se reconstruyó el fichero de test a partir de los bloques literales de
  tasks.md. El resultado es byte a byte igual a HEAD.
- Los blobs intermedios se reproducen: `3cc1c7d8`, `38e49d89`, `6cf0706d` y
  `416bf8b2`.
- El prefijo de base es idéntico al de H. Por tanto, los `describe` previos
  (#130 R2, #132 R1, #68 y el resto) no cambian, y ninguna aserción se
  debilitó.

### 4. Sondas re-medidas por el reviewer (sobre 2e1dcb2f, en scratch)

Procedimiento en cada sonda:
1. Aplicar la mutación, anclada por contenido.
2. Comprobar el blob con `git hash-object`.
3. Correr el test de la gráfica sin pipe.
4. Restaurar con `git checkout HEAD -- chart test`.
5. Comprobar que `git diff` y `git diff --cached` sobre
   `mobile-pet-tracker/src` quedan vacíos. Así fue en las 18.

Sondas de la spec (tasks.md §Sondas):

| Sonda | Blob medido = esperado | Medido | Esperado | `it` rojo |
|---|---|---|---|---|
| flexrev | 9543c7f4 sí | rojo 1 de 53 | rojo 1, R1, `toBe` | R1, `toBe('flex-row')` |
| avgx1 | f6e0e449 sí | rojo 1 | rojo 1, R2, `toEqual` | R2, `toEqual` |
| padconst | bef286f8 sí | **verde** 53/53 | verde (F) | — |
| wrapheader | a5dabc39 sí | rojo 3 | rojo 3, R4 1, 2 y 3 | R4 `it` 1 (primera aserción), 2 y 3 |
| wraptrend | 36e03dc6 sí | rojo 1 | rojo 1, R4 2 | R4 `it` 2 |
| wraplayout | e80e814f sí | rojo 2 | rojo 2, R4 1 y 2 | R4 `it` 1 (primera) y 2 |
| wrapdetail | 2d7cd52b sí | rojo 1 | rojo 1, R4 1, solo la última aserción | R4 `it` 1, en la última aserción (`[...withoutTrend, 'weekly-activity-detail']`) |
| wrapempty | 5d294a3d sí | rojo 1 | rojo 1, R4 3 | R4 `it` 3 |
| siblingcard | 3eb06d52 sí | rojo 3 | rojo 3, R4 1, 2 y 3 | R4 `it` 1, 2 y 3 |
| swaporder | 3d759564 sí | rojo 1 | rojo 1, R4 2 | R4 `it` 2 |
| selnoflex | e132960d sí | rojo 1 | rojo 1, R3, última aserción | R3, en la última aserción |

Todos los rojos son **por aserción** (`toBe` o `toEqual`), y ninguno por
consulta. Las sondas `flexcol`, `nopad`, `colnoflex` y `wrapmetric` son las
mutaciones D6, y ya quedaron medidas como rojos de C4 en §2.

Sondas propias del reviewer, en la zona ciega:

| Sonda | Mutación | Blob | Medido | Lectura |
|---|---|---|---|---|
| z_avgx2 | `x2={chartWidth - CHART_PAD_RIGHT}` pasa a `x2={chartWidth}` | afcdf888 | rojo 1: R2, `toEqual` | R2 mira las dos puntas de la línea, no solo `x1`. |
| z_rowwrapsel | la fila envuelta en `<View>` solo si `selection !== null` (si no, en un fragmento) | 7b7ab592 | rojo 1: R4 `it` 1, última aserción | El estado «día seleccionado» cuenta para R4. |
| z_stylearray | `style={{paddingLeft, paddingRight}}` pasa a `style={[{ paddingLeft: … }, { paddingRight: … }]}` | 75fe5ed0 | verde 53/53 | (N): la refactorización equivalente no rompe R2, que fusiona el estilo. |
| z_padtrend | `paddingLeft: trend !== null ? 0 : CHART_PAD_LEFT` | beea5d0c | verde 53/53 | (D) declarado: R2 con comparación, «no, (D)». |
| z_selnoflexfirst | la rama seleccionada sin `flex-1` solo si `selectedMetricIndex === 0` | d8536b77 | **verde** 53/53 | Hueco no declarado (Observación 1). |
| z_detailwraptrend | el detalle envuelto en `<View>` solo si `trend !== null` | e902b522 | **verde** 53/53 | Hueco no declarado (Observación 1). |

### 5. Greps de cierre (tasks.md §R5 punto 4, árbol final)

| Fichero | Grep | Resultado |
|---|---|---|
| Gráfica | `style={CONTINUOUS_CORNER}` | 1 |
| Gráfica | `style={TABULAR_NUMS}` | 4 |
| Gráfica | `accessibilityRole="radiogroup"` | 1 |
| Gráfica | `Platform` | 0 |
| Gráfica | hex | 0 |
| Gráfica | `shadow` | 0 |
| Gráfica | clases arbitrarias | 0 |
| Los dos | `stylesheet\|text-\[10px\]` | 0 y 0 |
| Test | `use-api` | 1 |
| Test | `useApi` | 0 |
| Test | `CHART_PAD` | 10 |
| Test | `40.4` | 0 |
| Test | `weekly-activity-day-row` | 8 |
| Test | `weekly-activity-card` | 10 |
| Test | `^describe(` | 23 |
| Test | `^describe('#131 R` | 3 |
| Test | `^describe('#135 R` | 1 |
| Test | `#131` | 6 |
| Test | `#131 R[123]:` | 6 |
| Test | `#135` | 4 |
| Test | `#135 R4:` | 4 |

No queda ningún `#131` ni `#135` suelto.

### 6. tsc y eslint

- Desde `mobile-pet-tracker/` en la branch, con HEAD 2e1dcb2f, se corrió
  `bunx eslint` sobre la gráfica y su test: `exit=0` y salida vacía.
- `test ! -e .expo/types/router.d.ts` da 0: el fichero no existe.
- `tsc --noEmit` no se relanzó, porque el typecheck de `init.sh` lo cubre:
  «✅ Typecheck sin errores», línea 20816 del log.

### 7. Trazabilidad

| R | Test | Rojo | Verde |
|---|---|---|---|
| R1 | `#131 R1 › …` | 81251dfc | 1dfe1d22 |
| R2 | `#131 R2 › …` | 6ccce2e7 | c16ef7c3 |
| R3 | `#131 R3 › …` | 950b28a5 | 5c22414f |
| R4 | `#135 R4`, sus tres `it` | a6f4d676 | 3a85668f |
| R5 | sin test, cierre medido | no aplica | 3a85668f |

Los 8 hashes distintos dan `git merge-base --is-ancestor <h> HEAD`, exit 0.

### 8. Skills de Codex

- El handoff (H §Skills) ordena no cargar ninguna skill de expo, porque la
  feature no toca UI. El reporte declara «Skills cargadas: ninguna».
- Es coherente: no hubo cambio de producción en `mobile-pet-tracker/`.

## Output de ./init.sh

Lo corrió el leader, no el reviewer. Datos del run, según el leader:
- HEAD `2e1dcb2fd38de1117847b09db3353bc40f368218` al empezar y al acabar.
- Working tree limpio.
- `test ! -e .expo/types/router.d.ts` dio exit 0.
- `init_exit=0`, medido sin pipe.

Log:
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/init_131_review.log`,
de 20825 líneas. Estas son las que cuentan:

```
218:   Test Suites: 171 passed, 171 total          (backend)
219:   Tests:       1307 passed, 1307 total
231:   Test Suites: 2 passed, 2 total              (infra)
232:   Tests:       14 passed, 14 total
13108: PASS src/screens/home/weekly-activity-chart.test.tsx
20495: A worker process has failed to exit gracefully and has been force exited. ...   (preexistente, Observación 5)
20497: Test Suites: 86 passed, 86 total            (mobile: base 86/1613 + 6 tests)
20498: Tests:       1619 passed, 1619 total
20499: Snapshots:   1 passed, 1 total
20795: Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
20796: Tests:       8 skipped, 389 passed, 397 total
20812: ✅ Lint sin errores
20816: ✅ Typecheck sin errores
20819: ✅ Todo verde. Listo para trabajar.
```

`grep -c "^FAIL"` sobre el log da 0.
