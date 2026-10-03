# review: mobile-weekly-day-column-content-lock (#140)
Fecha: 2026-09-30T16:50Z
Veredicto: APROBADO

Revisado en el worktree `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/140-mobile-weekly-day-column-content-lock`, HEAD `047d319a`. Implementó
Codex CLI; el handoff es `5564b15b`. Al terminar, el árbol queda limpio
(`git diff --exit-code` = 0, `git diff --cached --exit-code` = 0,
`git status --porcelain` vacío).

## Checklist C2 — Estado coherente
- [x] Solo una feature in_progress en `feature_list.json` (#140). #141 y #142 están `pending`.
- [x] `progress/current.md` describe la sesión activa (ver observación 4: la última línea va retrasada).

## Checklist C3 — Arquitectura
- [x] Cero cambio en producción. `git diff origin/main..HEAD -- mobile-pet-tracker/` solo toca `src/screens/home/weekly-activity-chart.test.tsx` (+150/−0). El blob de `weekly-activity-chart.tsx` en HEAD es igual al de `origin/main` (`c258abed`). `package.json`, `bun.lock` y `src/i18n/catalog.ts` no cambian (exit=0).
- [x] domain, application e infrastructure: no aplica, la feature solo añade tests.
- [x] Lista cerrada del handoff respetada. `git diff --name-only 5564b15b..HEAD` da exactamente el test, `progress/impl_mobile-weekly-day-column-content-lock.md` y `specs/mobile-weekly-day-column-content-lock/traceability.md`.

## Checklist C4 — TDD
- [x] R1 y R2 tienen cada uno su `describe` y lo nombran: `#140 R1: …` y `#140 R2: …`. R3 no tiene test propio, y la spec lo declara así (§Cobertura, punto 11). Lo cierro por inspección, abajo.
- [x] C4 vía b, cinco commits con los mensajes literales del handoff:
  - `a760e834` (test de R1 y la mutación `colswap` en la gráfica, blob `6214543c`)
  - `ebbee7b9` (la gráfica vuelve a `c258abed`)
  - `c22fba61` (test de R2 y la mutación `labelcolor`, blob `f58f4903`)
  - `e72f1d1b` (la gráfica vuelve a `c258abed`)
  - `047d319a` (informe y trazabilidad)
- [x] Los dos rojos fallan por aserción. Los reproduje en el sitio con los blobs de cada commit rojo:
  - Rojo de R1: exit=1; 1 fallido y 53 pasados de 54. Solo cae `#140 R1`, con `expect(received).toStrictEqual(expected)` en la línea 1878 (a1).
  - Rojo de R2: exit=1; 1 fallido y 54 pasados de 55. Solo cae `#140 R2`, con el mismo matcher en la línea 1954 (a1).
- [x] Las diez aserciones de contenido usan `toStrictEqual`, contra un esperado literal (`expected`) construido con cadenas del test y no con símbolos importados de producción. Los dos `describe` nuevos son idénticos a los bloques literales de `tasks.md`: el blob del test en HEAD, `2f3828f4`, coincide con el blob final de la spec. No aparece ningún `#140` pelado que `#68 R18` pueda leer como color: la sonda `hexbare` da 1 rojo en `design-drift.test.ts`, en `#68 R18`, línea 243. El fichero base es un prefijo exacto del nuevo, así que los `describe` de #68, #74, #130, #131, #132 y #135 quedan intactos.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene filas pendientes. El único resultado de `grep -ci pendiente` es la línea de la regla, no una fila de la tabla.
- [x] Los cuatro hashes (`a760e834`, `ebbee7b9`, `c22fba61`, `e72f1d1b`) pasan `git merge-base --is-ancestor … HEAD`. La fila de R3 cita el verde de R2 (`e72f1d1b`), como pide la spec.
- [x] Formato de commits: `test(mobile): …` y `docs(mobile): …`, los que prescribe el handoff (ver observación 3).

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla `[x] Aprobado por humano (fecha: 2026-09-30)`. Desde `68995488`, lo único que cambia bajo `specs/` es `traceability.md`.

## Checklist C7 — Sin código huérfano
- [x] N/A. Esta feature no reemplaza nada existente.

## C8 — Carta de UI
- [x] No hay cambio en la UI. El test no usa copy nuevo ni toca el catálogo.

## R3, cerrado por inspección
- R3.1: cero cambio en producción (ver C3).
- R3.2: suite móvil verde medida sin pipe en `init140.log`, 86 suites y 1621 tests contra una base de 1619. El delta es +2 tests y +0 suites, el declarado.
- R3.3: `describe` previos intactos (ver C4).

## Sondas (en el sitio; restauración con `git checkout HEAD --`, y diff y cached en 0 tras cada una)

Los blobs de las mutaciones coinciden con los de la spec: `coltail 2eea7fb9`, `dotsel 5519c456`, `dotselmissing 6440f4ed`, `rowtail 333d4e0c`, `labelcolorsel 33c57671`, `valuecolormetric f3b67039`, `dashcolorsel b9e25bb8`, `loose b62db88a`.

| Sonda | Exigido | Obtenido |
|---|---|---|
| `loose` | verde | verde, 55/55 |
| `loose` + `coltail` | verde | verde, 55/55 |
| `loose` + `dotsel` | rojo en R2 | 1 rojo, `#140 R2`, `toEqual` en 1980 (a4) |
| `coltail` | rojo en R1 y R2 | 2 rojos, líneas 1878 y 1954 |
| `rowtail` | rojo en R1 y R2 | 2 rojos, líneas 1878 y 1954 |
| `dotselmissing` | rojo en R1 y R2 | 2 rojos, líneas 1913 y 1989 (a5) |
| `labelcolorsel` | rojo en R2 | 1 rojo, línea 1980 (a4) |
| `valuecolormetric` | rojo en R2 | 1 rojo, línea 1975 (a3) |
| `dashcolorsel` | rojo en R2 | 1 rojo, línea 1989 (a5) |
| `hexbare` (sobre `design-drift.test.ts`) | rojo en `#68 R18` | 1 rojo de 55, línea 243 |
| propia: `z_labelselfirstmetric` | (zona ciega) | **verde**, 6 suites y 384/384 (observación 1) |
| propia: `z_labelnested` | (zona ciega) | no verde: la suite revienta (observación 2) |

## Observaciones

Ninguna bloquea el veredicto. Son hallazgos para que el `leader` decida qué hacer con ellos.

1. **Zona ciega sin declarar: día seleccionado con la primera métrica.** Mutación propia `z_labelselfirstmetric` (blob `6eda3dd1`): la clase de la etiqueta pasa a
   `{selection !== null && selectedMetricIndex === 0 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}`.
   Da verde en las 6 suites, 384/384. R1 y R2 solo seleccionan un día después de cambiar a `distanceM`, así que la combinación «día seleccionado × métrica por defecto» nunca se ejecuta. La tabla de estados de `requirements.md` marca las dos entradas por separado como «sí», pero la combinación no aparece como hueco (D) ni como (F). La implementación sigue la spec al pie de la letra, así que esto no es un defecto de Codex, sino un límite de la spec. Propuesta: declararlo (D) en §Fuera de alcance, con el mismo argumento que los otros (D) («hacerla es cambiar la gráfica a propósito»), o registrarlo como (F) si se quiere cerrar.
2. **Un nieto dentro de la etiqueta no da un rojo limpio.** Mutación propia `z_labelnested` (blob `93f3e415`): el texto del día pasa a ir dentro de un `<Text className="text-foreground">` anidado en la etiqueta. `#140 R1` y `#140 R2` leen solo los hijos directos de cada columna, así que no lo ven, y es por diseño. Quien lo ve es un test previo, `R3: la letra del eje sale de la fecha` (línea 522, `props.children` con `toEqual`). Pero al formatear el diff de un elemento React, jest agota el heap: con el fichero solo, `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory` (exit 134), y con las 6 suites un worker recibe SIGTERM. No queda verde, pero tampoco es un rojo por aserción. Queda fuera del alcance de #140; es informativo.
3. **C5, prefijo de los commits.** Son `test(mobile)`/`docs(mobile)` en vez de `feat(<scope>)`. Los prescriben la spec y el handoff, y son correctos para una feature sin cambio en producción. No es un incumplimiento.
4. **`progress/current.md` va retrasado.** Su última línea sigue diciendo «Parado esperando a Codex». Es un artefacto del `leader`; conviene actualizarlo en el cierre.
5. **Skills en Codex.** El informe de Codex declara que no cargó ninguna skill (deuda B5). Aquí no afecta, porque no hay cambio en la UI, pero sigue repitiéndose.
6. **Autoría.** Los cinco commits firman como `Claude <claude@srv1178023.hstgr.cloud>`, la identidad git del VPS, aunque los escribió Codex. Es informativo, por si importa para la atribución.

## Output de ./init.sh

El `leader` lo ejecutó (al subagente se le deniega). Lo leí de
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/be83ee02-f6ed-40e5-bcdd-18a6451c2267/scratchpad/init140.log`,
de 20631 líneas. `init140.exit` = `exit=0`, y `head_start` = `head_end` = `047d319aa6deefa72748e81b1022e7932496c829`.

```
227: Test Suites: 171 passed, 171 total            (backend unit)
228: Tests:       1307 passed, 1307 total
240: Test Suites: 2 passed, 2 total                (infra)
241: Tests:       14 passed, 14 total
15552: PASS src/screens/home/weekly-activity-chart.test.tsx
20303: Test Suites: 86 passed, 86 total            (mobile)
20304: Tests:       1621 passed, 1621 total
20305: Snapshots:   1 passed, 1 total
20601: Test Suites: 3 skipped, 27 passed, 27 of 30 total   (e2e)
20602: Tests:       8 skipped, 389 passed, 397 total
20618: ✅ Lint sin errores
20622: ✅ Typecheck sin errores
20625: ✅ Todo verde. Listo para trabajar.
```

La línea 20301 («A worker process has failed to exit gracefully») es ruido de jest y no un fallo. Las líneas `ERROR` de Nest entre la 73 y la 140, y la 20467, son logs esperados de los tests.
