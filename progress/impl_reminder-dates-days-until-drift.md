# Implementación #84 — reminder-dates-days-until-drift

## Entorno y base

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-backend`
- `git branch --show-current`: `feature/84-reminder-dates-days-until-drift`
- Skills Expo cargadas: ninguna; lógica pura sin UI, navegación ni animación. Ponytail full activo por instrucción de la sesión.
- Spec R1–R4 aprobada por humano el 2026-09-23 (`2665ffd3`); R4 queda para el humano.
- #114: `git merge-base --is-ancestor 993b62fa HEAD` → `exit=0`; `git log --oneline | grep -c "#158"` → `1`.
- Árbol inicial: `git status --short` vacío.
- `.expo/types/router.d.ts`: ausente al comprobar; el entorno rechazó `rm -f` por política, sin fichero que borrar.
- Base propia en esta branch: `reminder-dates.test.ts` 4/4, `reminders/index.test.tsx` 26/26, suite móvil 82 suites y 1452 tests, todo `exit=0`.
- Referencia del leader en `446f5581`, anterior a #114: móvil 80 suites/1443 tests; backend unit 170 suites/1298 tests; infra 2 suites/14 tests; e2e 27 suites passed + 3 skipped (30), 389 tests passed + 8 skipped. No se ejecuta `./init.sh` por instrucción expresa; backend sin cambios.
- Cierre esperado sobre la base propia: `reminder-dates.test.ts` 17 tests, `reminders/index.test.tsx` 28 tests, suite móvil 82 suites/1467 tests.

## TDD y commits

- R1 rojo `72af7d62` (`test(reminder-dates): count local calendar days, not 24 h blocks (R1)`): `bunx jest --runTestsByPath src/utils/reminder-dates.test.ts` → `exit=1`, 8 fallos esperados por aserción (`positive` y filas R1 1, 2, 3, 6, 7, 9, 10); 6 verdes, 14 total. Ningún otro test existente falló.
- R1 verde `fe7fd0de` (`feat(reminder-dates): subtract local civil days in daysUntil (R1)`): comando combinado de §Cierre (util, pantalla y Home) → `exit=0`, 3 suites/53 tests verdes. `reminders/index.test.tsx` intacto.
- R2 rojo `e69c93b6` (`test(reminder-dates): lock local civil day against UTC skew (R2)`): `bunx jest --runTestsByPath src/utils/reminder-dates.test.ts` → `exit=1`, las 3 filas R2 fallaron por aserción (recibidos `1`, `0`, `-1`; esperados `0`, `1`, `0`); R1 y los 4 tests existentes verdes: 3 fallos, 14 verdes, 17 total. Mutación de producción versionada: seis getters locales → UTC.
- R2 verde `5a2a93d6` (`feat(reminder-dates): revert the R2 probe mutation, local getters locked (R2)`): comando combinado de §Cierre → `exit=0`, 3 suites/56 tests verdes. `git diff fe7fd0de -- mobile-pet-tracker/src/utils/reminder-dates.ts; echo "exit=$?"` → diff vacío, `exit=0`.
- R3 rojo `db7e3b0c` (`test(reminders): lock calendar days in week pill, badge and label (R3)`): `bunx jest --runTestsByPath src/screens/reminders/index.test.tsx` → `exit=1`, los 2 `it` R3 fallaron por las etiquetas (`· en 0 días` y `· en -1 días` ausentes); el árbol renderizado también mostró píldora `1`, etiquetas `1/8/11` y badge ausente en `badge-edge`, y para ayer píldora `1`, etiqueta `0` y badge presente. Los 26 tests existentes siguieron verdes: 2 fallos, 26 verdes, 28 total. Mutación de producción versionada: retorno a `Math.ceil` sobre milisegundos.
- R3 verde `720817f8` (`feat(reminder-dates): revert the R3 probe mutation, screen locked (R3)`): comando combinado de §Cierre → `exit=0`, 3 suites/58 tests verdes. `git diff 5a2a93d6 -- mobile-pet-tracker/src/utils/reminder-dates.ts; echo "exit=$?"` → diff vacío, `exit=0`.

## Verificación de cierre

- `bunx jest --runTestsByPath src/utils/reminder-dates.test.ts src/screens/reminders/index.test.tsx src/screens/home/format.test.ts; echo "exit=$?"` → `exit=0`, 3 suites/58 tests. Recuentos por fichero: `reminder-dates.test.ts` 17 (= 4 + 13), `reminders/index.test.tsx` 28 (= 26 + 2); Home 13 sin cambio.
- `bun run test; echo "exit=$?"` → `exit=0`, 82 suites/1467 tests, snapshot 1/1. Delta frente a base propia: +0 suites/+15 tests. El guard C8 de `design-drift.test.ts` pasó dentro de la suite.
- `bunx tsc --noEmit; echo "exit=$?"` → `exit=0`.
- `bun run lint; echo "exit=$?"` → `exit=0`.
- `grep -c "Date.UTC(" src/utils/reminder-dates.ts` → `2`.
- `grep -c "Math.ceil\|getUTC\|getTime" src/utils/reminder-dates.ts` → `0` (grep termina con código 1 al no encontrar coincidencias).
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker` → exactamente `src/utils/reminder-dates.ts`, `src/utils/reminder-dates.test.ts`, `src/screens/reminders/index.test.tsx` (3 ficheros, 107 inserciones y 2 borrados).
- Trazabilidad R1–R3 completa con los seis hashes. R4 continúa pendiente de smoke Android y firma humana; no se marcó su casilla.
- Sin cambios backend, claves de catálogo, dependencias, pantalla de producción ni Home. Sin push ni PR, según el handoff.

## Ronda 2

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-backend`
- `git branch --show-current`: `feature/84-reminder-dates-days-until-drift`
- Enmienda E1 firmada por humano (`7024a55b`); R4 sigue siendo del humano. Ninguna skill Expo cargada: lógica y tests sin UI nueva.
- `git log --oneline -1`: `02c70791 chore(harness): #84 firma de E1 y handoff de la ronda 2`; `5b1cb8e9` y `7024a55b` son ancestros de HEAD (`exit=0` ambos). Árbol inicial limpio.
- Base de ronda 2, medida sin pipe: `reminder-dates.test.ts` 17/17, `reminders/index.test.tsx` 28/28, comando conjunto 2 suites/45 tests, suite móvil 82 suites/1467 tests y snapshot 1/1; todos `exit=0`.

### TDD y sondas

- R5 rojo `45908678` — `test(reminder-dates): lock month and year of the civil day (R5)`: `bunx jest --runTestsByPath src/utils/reminder-dates.test.ts; echo "exit=$?"` → `exit=1`, 3 fallos R5 por aserción (`-29`, `-30`, `-30` frente a `1`), otros 17 verdes. El mismo commit mueve el candado heredado a fechas locales y versiona U8 (`to.getDate() - from.getDate()`).
- R5 verde `c759482b` — `feat(reminder-dates): revert the R5 probe mutation, month and year locked (R5)`: test util → `exit=0`, 20/20. `git diff 720817f8 -- mobile-pet-tracker/src/utils/reminder-dates.ts; echo "exit=$?"` → diff vacío, `exit=0`.
- R6 rojo `32313d9f` — `test(reminders): lock the week pill and badge thresholds (R6)`: test de pantalla → `exit=1`, 1 fallo R6 por aserción (`reminder-upcoming-plus-eleven` presente al esperar `null`); los 28 tests previos verdes. Mutación versionada de los dos umbrales (`<= 8`, `<= 11`).
- R6 verde `3e530242` — `feat(reminders): revert the R6 probe mutation, thresholds locked (R6)`: test de pantalla → `exit=0`, 29/29. `git diff origin/main -- mobile-pet-tracker/src/screens/reminders/index.tsx; echo "exit=$?"` → diff vacío, `exit=0`.
- Sondas R5 sin commit, cada una seguida de `git diff 3e530242 -- mobile-pet-tracker/src/utils/reminder-dates.ts; echo "exit=$?"` → diff vacío, `exit=0`:
  - U9 (`getMonth()` → `0`): `exit=1`, fallan las 3 filas R5; 3 failed/17 passed.
  - U10 (`getFullYear()` → `2026`): `exit=1`, fallan las filas R5 de fin de año y Ciudad de México; 2 failed/18 passed.
  - U11 (solo `getMonth()` → `getUTCMonth()`): `exit=1`, falla la fila R5 de Ciudad de México; 1 failed/19 passed.
  - U12 (solo `getFullYear()` → `getUTCFullYear()`): `exit=1`, falla la fila R5 de Ciudad de México; 1 failed/19 passed.
  - U15 (`getMonth() + 1`): `exit=1`, falla la fila R5 de fin de mes; 1 failed/19 passed.
- Sondas R6 sin commit, cada una seguida de `git diff 3e530242 -- mobile-pet-tracker/src/screens/reminders/index.tsx; echo "exit=$?"` → diff vacío, `exit=0`:
  - S8 (solo píldora `<= 8`): `exit=1`, el `it` de R6 no encuentra `0` en `pill-week`; 1 failed/28 passed.
  - S9 (solo badge `<= 11`): `exit=1`, el `it` de R6 encuentra `reminder-upcoming-plus-eleven` al esperar `null`; 1 failed/28 passed.

### Cierre de ronda 2

- `bunx jest --runTestsByPath src/utils/reminder-dates.test.ts src/screens/reminders/index.test.tsx src/screens/home/format.test.ts; echo "exit=$?"` → `exit=0`, 3 suites/62 tests: 20 util, 29 pantalla, 13 Home.
- `bun run test; echo "exit=$?"` → `exit=0`, 82 suites/1471 tests, snapshot 1/1; +4 tests/+0 suites sobre la base de ronda 2. El guard C8 pasó dentro de la suite.
- `bunx tsc --noEmit; echo "exit=$?"` → `exit=0`; `bun run lint; echo "exit=$?"` → `exit=0`.
- `git diff 5b1cb8e9 HEAD -- mobile-pet-tracker/src/utils/reminder-dates.ts mobile-pet-tracker/src/screens/reminders/index.tsx; echo "exit=$?"` → diff vacío, `exit=0`. La producción queda igual que en la ronda 1.
- `grep -c "Date.UTC(" src/utils/reminder-dates.ts` → `2`; `grep -c "Math.ceil\|getUTC\|getTime" src/utils/reminder-dates.ts` → `0` (grep sale `1` por ausencia de coincidencias).
- Diff móvil de la ronda 2 frente a `5b1cb8e9`: solo `src/utils/reminder-dates.test.ts` y `src/screens/reminders/index.test.tsx`. R1–R3 y el helper de R2 intactos; ningún cambio backend, catálogo, dependencias ni TZ.
- Cuatro commits TDD de la ronda 2, en orden: `45908678` R5 rojo, `c759482b` R5 verde, `32313d9f` R6 rojo, `3e530242` R6 verde. Traceability se actualizó en el árbol inmediatamente después de cada commit; R5, R6 y el candado heredado tienen hash. R4 sigue pendiente de firma humana.
- No se ejecutó `./init.sh`, ni se hizo rebase, merge, push o PR.
