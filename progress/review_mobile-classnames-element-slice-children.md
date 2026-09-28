# review: mobile-classnames-element-slice-children (#120)
Fecha: 2026-09-28
Veredicto: APROBADO

Revisado sobre `feature/120-mobile-classnames-element-slice-children`, HEAD
`52d920a8cef2ea4abf92c24291fa92826c0ef593`, con el árbol limpio.
`git merge-base origin/main HEAD` da `e9413a6e`, que es `origin/main`, así que
no hubo rebase ni merge.

El reviewer no ejecutó `./init.sh`, porque el clasificador se lo deniega y los
servicios son compartidos. Se usa el log que lanzó el leader con permiso del
humano (`/tmp/120_init/`), y se comprueba que corresponde a HEAD (ver el final
de este informe).

El árbol principal quedó en solo lectura mientras corría init.sh. Los dos rojos,
los dos verdes y las sondas se midieron en un worktree temporal del scratchpad
(`git worktree add --detach <scratchpad>/wt120`), con `node_modules` enlazado al
del árbol principal. Ese worktree se quitó al acabar con `git worktree remove`.
Todo se midió sin pipe (`cmd > log 2>&1; echo "exit=$?"`), con
`bunx jest --runTestsByPath` para los candados.

## Checklist C2 — Estado coherente
- [x] Hay como mucho 1 feature in_progress. Hoy son 0: #120 está en `spec_ready`, igual que el precedente de #124 y #126, y lo declara `progress/current.md`. init.sh pasó su control.
- [x] `progress/current.md` está actualizado. Describe la sesión de #120: la base `e9413a6e`, los blobs, el espejo en Notion, la firma y el handoff.
- [x] Codex no tocó `progress/current.md`, `progress/history.md`, `STATUS.md` ni `feature_list.json`. Sus seis commits solo tocan los dos tests, `index.tsx` (en los rojos y los verdes), `docs/conventions.md`, `traceability.md` y el reporte.

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure. N/A: no se toca código de capas.
- [x] Los contratos de domain son interfaces puras. N/A.
- [x] application depende de interfaces. N/A.
- [x] infrastructure sin lógica de negocio. N/A.
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista solo `consistency-classnames.test.ts` (51 líneas) y `legibility-classnames.test.ts` (33 líneas), con 53 inserciones y 31 borrados. No hay imports nuevos: los dos ficheros siguen con solo `require('fs')` y `require('path')`.

## Checklist C4 — TDD (vía b: mutación de producción versionada)
- [x] Cada R<n> tiene un test que lo nombra, o su ausencia está declarada.
  - R1: los cuatro `it`/`it.each` de `consistency` acaban en `en su tag de apertura (#120 R1)`. En ejecución son 7 tests.
  - R2: el `it` `conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`.
  - R3, R4 y R5 no tienen test propio. Lo declararon antes del handoff el punto 12 de §Qué firma el humano y `traceability.md` §Requisitos sin test propio.
- [x] El historial muestra test primero, en dos pares rojo→verde. Cada verde solo revierte `src/screens/reminders/index.tsx`:
  - R1: el rojo `1ba18224` trae el test (blob `07cc45b4`) y `P-active-h` (blob `2b43ab8f`). El verde `68076779` devuelve `index.tsx` a `8fbcd07c`.
  - R2: el rojo `b53b8778` trae el test (blob `8c42a105`) y `D-v` (blob `f136e971`). El verde `ad361a5d` devuelve `index.tsx` a `8fbcd07c`.
- [x] El reviewer rehízo cada rojo en su commit, en el worktree temporal:
  - `1ba18224`: los candados dan `exit=1`, con 1 failed y 78 passed de 79. La suite completa da `exit=1`, con 1 failed y 82 passed de 83 suites, 1 failed y 1531 passed de 1532 tests, y 1 snapshot. El único rojo es `#62 R4 … › lleva las tres píldoras de resumen de reminders a rounded-xl en su tag de apertura (#120 R1)`, por `expect(received).toContain(expected)` en la línea 158 (`Expected substring: "rounded-xl"`).
  - `b53b8778`: los candados dan `exit=1`, con 1 failed de 79. La suite completa da `exit=1`, con 1 failed de 83 suites y 1531 passed de 1532 tests. El único rojo es `#61 R1 … › conserva variant, testID y texto del botón, con variant y bg-danger en su tag de apertura (#120 R2)`, por `expect(received).toContain(expected)` en la línea 110 (`Expected substring: "variant=\"danger\""`).
  - En los dos rojos no hay ReferenceError ni TypeError, y no se mutó ningún doble.
- [x] Los dos verdes, `68076779` y `ad361a5d`, dan 79 de 79 en los candados, `exit=0`.
- [x] Ningún esperado viene de producción. Todos son literales del test: `'rounded-xl'`, `'rounded-xl bg-accent'`, `` `className="${classes}"` `` de la tabla del test, `'variant="danger"'`, `'bg-danger'` y `"t('reminders.delete')"`.
- [x] Las aserciones de CS1 a CS4 quedan idénticas byte a byte. El diff de `1ba18224` solo cambia los títulos y las llamadas, y quita la línea `'/>',` de CS3, como pide `tasks.md`. En `legibility`, los otros dos `it` de `#61 R1` y los `describe` `#61 R3`, `#61 R4` y `#61 R5` no aparecen en el diff.

## Checklist C5 — Trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente».
- [x] Ningún hash se perdió en un rebase. `git merge-base --is-ancestor <h> HEAD` da 0 para `1ba18224`, `68076779`, `b53b8778`, `ad361a5d` y `87f2e901`, las cinco con el hash completo.
- [x] Los commits siguen la convención de la propia spec: `test(mobile): … (R1)` y `(R2)`, `docs(mobile): … (R4)` y `docs(mobile): … (R3,R5)`. Los seis mensajes coinciden literalmente con el handoff. Ver la observación 1 sobre la columna de R3 y R5.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` tiene `status: approved` y la casilla marcada con fecha 2026-09-27. La firma es `d413d168`, vía Notion.
- [x] Nada se modificó tras la aprobación. `git diff d413d168 HEAD -- specs/` solo toca `traceability.md`, para rellenar los hashes. La firma, frente a `1b673736`, solo cambia el frontmatter de los cuatro ficheros y la casilla.

## Checklist C7 — Sin código huérfano
- [x] Se eliminó lo reemplazado. `elementWithTestId` desaparece de `consistency-classnames.test.ts`: `grep -c` da 0, y `openingTagWithTestId` da 5.
- [x] En `legibility` se queda a propósito (R2.2). Tiene su comentario `#120 R2` encima de `const deleteConfirm = elementWithTestId(` y su motivo en `docs/conventions.md`.
- [x] No se eliminó ningún test ni fichero.

## Checklist C8 — UI móvil
- [x] N/A: no se tocó UI. `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx` da 0, y `git diff origin/main HEAD` sobre el mismo fichero también. El diff de `mobile-pet-tracker/` son solo los dos tests. Los literales nuevos no traen hex, clases arbitrarias `[...]` ni `use-api`, y `design-drift.test.ts` pasa en la suite de init.sh.

## Verificación de R3: sondas re-medidas por el reviewer
Todas se midieron sobre HEAD (`52d920a8`) en el worktree temporal, una cada vez. Para cada sonda, el reviewer:

1. aplicó la mutación;
2. comprobó el blob con `git hash-object`: los 12 coinciden con la tabla de `tasks.md`;
3. corrió los dos candados con `--runTestsByPath`;
4. revirtió con `git checkout -- <ruta>`, y `git diff --exit-code -- mobile-pet-tracker/src` dio 0 después de cada una.

La base sin mutar dio 79 de 79, `exit=0`.

| Sonda | Blob | Medido por el reviewer | Exigido |
|---|---|---|---|
| `P-week-j` | `efa2646a` | `exit=0`, 79 passed | verde (límite 2) ✔ |
| `P-week-f` | `214a8eb9` | `exit=0`, 79 passed | verde (límite 2) ✔ |
| `P-week-l3` | `baa5baba` | `exit=0`, 79 passed | verde (límite 3) ✔ |
| `D-d` | `50cc3d89` | `exit=0`, 79 passed | verde (residuo del bloque) ✔ |
| `B-login-n` | `51e6326d` | `exit=1`, 2 failed y 77 passed: `#62 R4 … › no deja la clase fuera de escala rounded-2xl en producción` y `#98 R10 … › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban`, los dos por `toEqual` | 2 rojos por `toEqual` (cambio declarado) ✔ |
| `B-login-h` | `10ab4fdd` | `exit=1`, 1 failed: `#62 R1 … › app/(auth)/login.tsx aplica rounded-xl a login-submit en su tag de apertura (#120 R1)`, por `toContain` | ✔ |
| `P-week-d` | `c841bfde` | `exit=1`, 1 failed: CS4, por `toBe` | unicidad ✔ |
| `P-week-a` | `0b3b6f86` | `exit=1`, 1 failed: CS4, por `toBe` | falla hacia rojo ✔ |
| `D-h` | `00ea6738` | `exit=1`, 1 failed: el `it` `(#120 R2)`, por `toContain` | ✔ |
| `V-f` | `7abf0dcf` | `exit=1`, 1 failed: `#62 R2 … › screens/health/index.tsx conserva dimensión y usa el radio de Card en su tag de apertura (#120 R1)`, por `toContain` | ✔ |
| `S-j` | `821d649e` | `exit=1`, 1 failed: `#62 R2 … › el skeleton del hero reserva el alto de la foto y no lleva radio en su tag de apertura (#120 R1)`, por `toContain` | ✔ |
| `S-n` | `6a798a78` | `exit=0`, 79 passed | verde (cambio declarado) ✔ |

El reviewer contrastó además el punto 2 de la firma, el corte en `/>`. Quitó `.split('/>')[0]` del helper de `consistency`, solo en el worktree temporal, y plantó `S-j`. Dio `exit=0` con 53 de 53: el verde falso que describe `design.md`. Con el corte, la misma sonda da rojo.

El reporte de Codex trae las 26 filas medidas, y las 26 coinciden con «Exigido». Las 12 que re-midió el reviewer dan lo mismo que el reporte.

## Verificación de R4 y R5
- R4: `docs/conventions.md` tiene el blob `e1f8a5ab`, el de `tasks.md` §R4. Los greps dan lo esperado:
  - `grep -c "function openingTagWithTestId"` da 1;
  - `grep -c "Los tres que recortan alrededor de"` da 0;
  - `grep -c "el recorte acaba en su"` da 1;
  - `grep -rn "lastIndexOf('<[A-Z]" mobile-pet-tracker/src` no devuelve nada.

  Los tres cambios van anclados por contenido, sin números de línea.
- R5.1: el diff de producción es vacío (ver C8), y el stat de `mobile-pet-tracker/` lista solo los dos tests.
- R5.2: la suite móvil del log de init.sh da 83 de 83 suites, 1532 de 1532 tests y 1 snapshot. Es +0 suites y +0 tests sobre la base, 83 / 1532 / 1.
- R5.3: `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` da 0.
- R5.4: tsc y eslint dan `exit=0`.
  - `test ! -e .expo/types/router.d.ts` da `exit=0` en el árbol principal.
  - `tsc --noEmit` pasa en init.sh sobre HEAD: «Typecheck sin errores».
  - `bunx eslint` de los dos ficheros, corrido por el reviewer sobre HEAD, da `exit=0` sin salida.
- R5.5: los blobs finales coinciden con `tasks.md`: `07cc45b4`, `8c42a105`, `8fbcd07c` y `e1f8a5ab`, tanto con `git hash-object` como con `git rev-parse HEAD:<ruta>`.

## Observaciones
Ninguna bloquea.

1. **`traceability.md`, filas R3 y R5, columna «Commit verde».** Dice `` `HEAD` (este commit del reporte; ver `git rev-parse HEAD`) `` en lugar de un hash. Es un ancla que se desplaza: con el commit de esta review, `HEAD` ya no es `52d920a8`, y tras el merge tampoco lo será.
   - El origen está en la plantilla de la spec, que pedía «commit del reporte», y un fichero no puede citar el hash de su propio commit. Codex lo declaró en su reporte.
   - #124 y #126 citaban el hash del verde tras el que se midieron las sondas.
   - Al cerrar, el leader puede sustituir `HEAD` por `52d920a8cef2ea4abf92c24291fa92826c0ef593` en las dos filas. Es un cambio de `specs/`, que no toca código.
2. **El log de init.sh trae dos avisos que no vienen de esta feature.** A `.env` le faltan `RESEND_API_KEY`, `RESEND_FROM` y `RESET_LINK_HOST`, y el e2e da «3 skipped, 27 passed», con 8 tests skipped. #120 no toca backend ni `.env`, así que no afectan al veredicto.
3. **Los residuos quedan en verde, como firmó el humano en el punto 6.** Son `P-week-j`, `P-week-f` y `P-week-l3` (límites 2 y 3) y el señuelo `D-d` sobre el bloque de subárbol. Los dos hallazgos **(F)** de §Fuera de alcance siguen sin id, y los asigna el leader contra `origin/main`.
4. **Para el gate de done (memoria «verificar drift de código»).** Este veredicto vale para el árbol de `52d920a8`. El commit de esta review solo añade este fichero. Antes de marcar done, el leader debe comprobar que el diff entre ese commit y lo que se mergee no toca código.

## Output de ./init.sh
Corrido por el leader con permiso del humano. `/tmp/120_init/head` da
`52d920a8cef2ea4abf92c24291fa92826c0ef593`, igual que `git rev-parse HEAD`.
`/tmp/120_init/exit` da `EXIT=0`. Líneas que deciden, de `/tmp/120_init/log`:

```
[0;32m✅ Build exitoso[0m
# backend (jest)
Test Suites: 171 passed, 171 total
Tests:       1307 passed, 1307 total
Snapshots:   0 total
# infra (jest)
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
# harness (node:test)
# tests 28 / # pass 28 / # fail 0
# tests 5 / # pass 5 / # fail 0
# tests 15 / # pass 15 / # fail 0
# mobile (jest)
Test Suites: 83 passed, 83 total
Tests:       1532 passed, 1532 total
Snapshots:   1 passed, 1 total
Time:        92.863 s
Ran all test suites.
[0;32m✅ Tests pasados[0m
→ Tests e2e...
[✓] migrations applied successfully!
[0;32m✅ Esquema y recursos e2e listos[0m
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 389 passed, 397 total
[0;32m✅ Tests e2e pasados[0m
$ expo lint
[0;32m✅ Lint sin errores[0m
$ tsc --noEmit
[0;32m✅ Typecheck sin errores[0m
[0;32m✅ Todo verde. Listo para trabajar.[0m
EXIT=0
```

Tras init.sh, `git status --short` del árbol principal salió vacío: el
`eslint --fix` del backend no dejó cambios.
