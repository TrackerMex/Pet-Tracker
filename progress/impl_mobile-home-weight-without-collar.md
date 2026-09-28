/home/claude/sites/Pet-Tracker-wt-backend
feature/77-mobile-home-weight-without-collar

# Implementación #77 — detenida en la base

- Skills cargadas: `expo:building-native-ui` (paquete Expo v1.0.2), `appllama-app-design-skill` y `ponytail` (modo full). La spec aprobada fija la UI.
- Precondiciones: `git merge-base --is-ancestor a8d5cb70 HEAD; echo "exit=$?"` → `exit=0`; ancla R10 → `1`; guard de citas del test → `1`; `.expo/types/router.d.ts` ausente → `exit=0`.
- Blobs de base: `index.tsx` `dbb5b0346895cfc26705bee2257d1f8a8815df6c`; `index.test.tsx` `22adaad0efee536b46c058a9646df7705c830b2a`.
- `bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/pt77-base-home.log 2>&1; echo "exit=$?"` → `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 146 passed, 146 total`.
- `bun run --cwd mobile-pet-tracker test > /tmp/pt77-base-suite.log 2>&1; echo "exit=$?"` → `exit=1`; `Test Suites: 1 failed, 82 passed, 83 total`; `Tests: 1 failed, 1531 passed, 1532 total`.

El único rojo de la suite base, antes de cualquier cambio de #77, fue `src/app/(tabs)/__tests__/food.test.tsx` → `R4: food resuelve la mascota seleccionada › keeps API order and selects the first pet by default`. Aserción: `expect(mockGetNutritionPlan).toHaveBeenCalledWith(apiUrl, 'jwt-token', 'pet-1')`; Jest imprimió `Expected: "http://example.test/v1", "jwt-token", "pet-1"` y `Number of calls: 0`. El log está en `/tmp/pt77-base-suite.log`. En esa primera sesión no hubo commits TDD, mutaciones ni sondas: se paró ante un rojo ajeno. R4 Android sigue pendiente del humano.

## Reanudación 1

`pwd` → `/home/claude/sites/Pet-Tracker-wt-backend`

`git branch --show-current` → `feature/77-mobile-home-weight-without-collar`

El leader validó la base en `progress/handoff_mobile-home-weight-without-collar.md` §«Reanudacion 1»: `food.test.tsx` solo pasó 10/10 veces (56/56) y la suite completa pasó 3/3 veces (83 suites, 1532 tests). El rojo de mi primera medición se conserva arriba. Se reanuda directamente en R1.

## Commits TDD y rojos

| R-id | Rojo | Verde | Medición del rojo | Medición del verde |
|---|---|---|---|---|
| R1 | `a1ad6fc648b7ec151bfac669a481a926df738a58` | `f3a17f447da175c6c0ba122dc5ac2355a0a1bfdb` | Home: 7 failed, 146 passed, 153 total; `tsc` exit 0 | Home: 153 passed, 153 total |
| R2 | `f489b4706db0c4413ab4736cbc43d0d27e8dbc55` | `8974590cf8da924a69f8dff72980f8c05df468a2` | Home: 4 failed, 153 passed, 157 total; `tsc` exit 0 | Home: 157 passed, 157 total |
| R3 | `4a9ab9cfb2e7a6a1c971932ea2d0d0a7bb784932` | `62a92ffd5c58dd30fa353f1bbfebf738f90e2e80` | Home: 2 failed, 157 passed, 159 total; `tsc` exit 0 | Home: 159 passed, 159 total |

En los tres rojos Jest imprimió `Test Suites: 1 failed, 1 total`; en los tres verdes, `Test Suites: 1 passed, 1 total`. Antes de cada `bunx tsc --noEmit`, `test ! -e .expo/types/router.d.ts; echo "exit=$?"` dio `exit=0`.

- R1 (`/tmp/pt77-r1-red.log`): fallaron las cuatro filas `sin collar`, `con la actividad en error`, `sin conexión`, `sin configuración`, además de `pinta un guion sin peso registrado`, `pinta un guion y la nota cuando el perfil tampoco resuelve` y `no añade ninguna llamada a la API`. En los siete casos: `Unable to find an element with testID: summary-weight` (Expected: encontrar `summary-weight`; Received: elemento ausente).
- R2 (`/tmp/pt77-r2-red.log`): fallaron las cuatro filas de `compone la celda y la nota en una sola fila`. Aserción `expect(rowChildren).toHaveLength(2)`; Jest: `Expected length: 2`, `Received length: 1`.
- R3 (`/tmp/pt77-r3-red.log`): fallaron solo `no pinta la fila con la sesión caducada` y `no pinta la fila mientras la actividad carga`. Aserción `toBeNull()` (Expected: `null`); Received: `<Text ... testID="summary-weight">12.4 kg</Text>` en los dos casos. El rojo versionó solo la mutación V3 de producción junto al test, con el cuerpo de commit literal de `tasks.md`; el verde la revirtió exactamente. `git diff --exit-code 8974590c HEAD -- mobile-pet-tracker/src/screens/home/index.tsx; echo "exit=$?"` → `exit=0`.

## Sondas sobre el verde de R3

Clave de nombres: `R1-4` = las cuatro filas `pinta el peso registrado` (sin collar, error, sin conexión, sin configuración); `R2-4` = las cuatro filas `compone la celda y la nota en una sola fila` en esos estados. `R1-error-3` y `R2-error-3` son sus filas de error, sin conexión y sin configuración. Los demás se citan por título. Cada sonda corrió `bunx jest --runTestsByPath src/screens/home/index.test.tsx` desde `mobile-pet-tracker/`, con `Test Suites: 1 failed, 1 total`, `159 total` y exit 1. Tras cada una se restauró `index.tsx` y `git diff --exit-code -- mobile-pet-tracker/src/screens/home/index.tsx; echo "exit=$?"` dio `exit=0` antes de la siguiente. Logs individuales: `/tmp/pt77-probe-<ID>.log`.

| Sonda | Rojos esperados | Rojos medidos | Cuáles |
|---|---:|---:|---|
| M1 | 9 | 9 | R1-4, R1 `no añade ninguna llamada a la API`, R2-4 |
| M2 | 1 | 1 | R1 `pinta un guion sin peso registrado` |
| M3 | 2 | 2 | R1 `pinta un guion y la nota cuando el perfil tampoco resuelve`; `#69 R7: degrada el peso a un guion cuando el perfil no resuelve` |
| M4 | 8 | 8 | R1-error-3, R2-error-3; R9 `degrades an activity error without breaking the dashboard`; R14 `carga con skeleton y se calla cuando la actividad falla` |
| M5 | 7 | 7 | R1 `no añade ninguna llamada a la API`; R7 `shows an error and retries pet detail`; R10 `refetches the pet list and active pet when Home recovers focus`; `#69 R8`, `#71 R1`, `#70 R15` `no añade ninguna llamada a la API`; `#98 R8` `no importa el cliente de nutrición ni añade llamadas` |
| N1 | 4 | 4 | R2-4 |
| N2 | 4 | 4 | R2-4 |
| N3 | 5 | 5 | R2-4; `#69 R1` `renders the four value testIDs in tree order` |
| N4 | 4 | 4 | R2-4 |
| N5 | 4 | 4 | R2-4 |
| N6 | 4 | 4 | R2-4 |
| N7 | 4 | 4 | R2-4 |
| N8 | 4 | 4 | R2-4 |
| N9 | 5 | 5 | R2-4; `#69 R9: usa iconos de reicon y ningún emoji` |
| N10 | 5 | 5 | R2-4; `#69 R9: usa iconos de reicon y ningún emoji` |
| N11 | 4 | 4 | R2-4 |
| N12 | 4 | 4 | R2-4 |
| N13 | 4 | 4 | R2-4 |
| N14 | 4 | 4 | R2-4 |
| N15 | 4 | 4 | R2-4 |
| N16 | 4 | 4 | R2-4 |
| N17 | 4 | 4 | R2-4 |
| N18 | 8 | 8 | R2-4; R1 `pinta un guion y la nota cuando el perfil tampoco resuelve`; R9 `explains that activity tracking requires a collar` y `degrades an activity error without breaking the dashboard`; R14 `carga con skeleton y se calla cuando la actividad falla` |
| N19 | 1 | 1 | Solo `#69 R9: usa iconos de reicon y ningún emoji` |
| V3a | 1 | 1 | R3 `no pinta la fila con la sesión caducada` |
| V3b | 1 | 1 | R3 `no pinta la fila mientras la actividad carga` |

V3 se midió en el commit rojo de R3: 2 rojos, los dos `it` de R3. Ninguna sonda añadió rojos de `#126 R1`.

## Cierre

Comandos sin pipe; Jest y scripts móviles desde `mobile-pet-tracker/` salvo la suite completa y los comandos de git/grep, corridos desde la raíz.

| Comando | Salida |
|---|---|
| `bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/pt77-close-home.log 2>&1; echo "exit=$?"` | `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 159 passed, 159 total` |
| `bun run --cwd mobile-pet-tracker test > /tmp/pt77-close-suite-1.log 2>&1; echo "exit=$?"` | `exit=0`; `Test Suites: 83 passed, 83 total`; `Tests: 1545 passed, 1545 total` |
| `test ! -e .expo/types/router.d.ts; echo "exit=$?"` | `exit=0` |
| `bun run typecheck > /tmp/pt77-close-typecheck.log 2>&1; echo "exit=$?"` | `exit=0`; `$ tsc --noEmit` |
| `bun run lint > /tmp/pt77-close-lint.log 2>&1; echo "exit=$?"` | `exit=0`; `$ expo lint` |

La suite completa pasó en su primera corrida de cierre; la repetición permitida solo para el flake de `food.test.tsx` no fue necesaria. Delta contra la base medida: Home 146 → 159 (+13); suite 83/1532 → 83/1545 (+0 suites, +13 tests).

Greps de cierre desde la raíz:

| Patrón/comando de `tasks.md` | Salida |
|---|---|
| `grep -c 'testID="summary-note"' mobile-pet-tracker/src/screens/home/index.tsx` | `1`, exit 0 |
| `grep -c '<Weight size={20} color={muted} />' mobile-pet-tracker/src/screens/home/index.tsx` | `1`, exit 0 |
| `grep -c 'style={TABULAR_NUMS}' mobile-pet-tracker/src/screens/home/index.tsx` | `8`, exit 0 |
| `grep -c "activity.data.kind !== 'unauthorized'" mobile-pet-tracker/src/screens/home/index.tsx` | `1`, exit 0 |
| `grep -c "{activity.data?.kind === 'ok' ? (" mobile-pet-tracker/src/screens/home/index.tsx` | `1`, exit 0; es la rama de `WeeklyActivityChart` |
| `grep -c "{activity.data?.kind === 'no-tracking'" mobile-pet-tracker/src/screens/home/index.tsx` | `0`, exit 1 |
| `grep -n 'health-records' mobile-pet-tracker/src/screens/home/index.tsx` | salida vacía, exit 1 |
| `grep -c StyleSheet mobile-pet-tracker/src/screens/home/index.test.tsx` | `0`, exit 1 |
| `grep -c -- '-\[' mobile-pet-tracker/src/screens/home/index.test.tsx` | `0`, exit 1 |
| `grep -cP '#[0-9]++(?! R[0-9])' mobile-pet-tracker/src/screens/home/index.test.tsx` | `1`, exit 0 |
| `grep -c "^describe('#77 R" mobile-pet-tracker/src/screens/home/index.test.tsx` | `3`, exit 0 |

`git diff --stat origin/main...HEAD -- mobile-pet-tracker` →

```text
 mobile-pet-tracker/src/screens/home/index.test.tsx | 220 +++++++++++++++++++++
 mobile-pet-tracker/src/screens/home/index.tsx      | 102 +++++-----
 2 files changed, 271 insertions(+), 51 deletions(-)
```

`git diff --numstat origin/main...HEAD --` esos dos ficheros → test `220 0`, producción `51 51`. `git diff --check` → exit 0. La implementación sigue el Contrato aprobado; no hizo falta tomar decisiones de diseño fuera de la spec. R4 sigue reservado al humo humano en Android.

## R5 (Enmienda 1)

`pwd` → `/home/claude/sites/Pet-Tracker-wt-backend`; `git branch --show-current` → `feature/77-mobile-home-weight-without-collar`. Árbol limpio al reanudar. Skills cargadas en la sesión de #77: `expo:building-native-ui` (plugin Expo v1.0.2), `appllama-app-design-skill` para el cambio anterior de la Home y `ponytail` (full). R5 solo cambia un test al final; no añade diseño de pantalla.

### Base de food y commits

Desde `mobile-pet-tracker/`:

| Precheck | Salida |
|---|---|
| `git rev-parse 'HEAD:mobile-pet-tracker/src/app/(tabs)/food.tsx'` | `e310ff45ac9a6abc5475e983a2c03e1d7b5f909b` |
| `git rev-parse 'HEAD:mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'` | `abc6ad1579dfcadb3c9d309d41caecdba62ccb2d` |
| `grep -c "queryFn: () => getNutritionPlan(baseUrl, token ?? '', selectedPetId!)," 'src/app/(tabs)/food.tsx'` | `1` |
| `grep -c "it('keeps API order and selects the first pet by default'" 'src/app/(tabs)/__tests__/food.test.tsx'` | `1` |
| `grep -cP '#[0-9]++(?! R[0-9])' 'src/app/(tabs)/__tests__/food.test.tsx'` | `9` |
| `grep -c '#77 R5' 'src/app/(tabs)/__tests__/food.test.tsx'` | `0`, grep exit 1 |
| `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/pt77-r5-base-food.log 2>&1; echo "exit=$?"` | `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 56 passed, 56 total` |

| Paso | Commit | Evidencia |
|---|---|---|
| Rojo Q1 | `3b0fcb6409dd9fb2ec2eeb9ff1c53ef8fa809b0c` — `test(mobile): expose the food nutrition plan race (R5)` | Solo `food.tsx`, 8 inserciones y 1 borrado |
| Verde con Q1 aún puesta | `d3cf35b54712bfbbb3853d50c8ed4cd13ff49626` — `test(mobile): wait for the nutrition plan call with the pet chips (R5)` | Solo `food.test.tsx`, 6 inserciones y 5 borrados |
| Revert de Q1 | `55533b96ea145da60b5bf1a5e99c24b75ee5438a` — `fix(mobile): drop the nutrition plan delay (R5)` | Solo `food.tsx`, 1 inserción y 8 borrados |
| Traza | `docs(mobile): trace #77 R5` (este mismo commit final; su hash se obtiene con `git rev-parse HEAD` tras commitear) | Solo esta sección y la fila R5 de `traceability.md` |

El rojo Q1 (`/tmp/pt77-r5-red-food.log`) dio `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 55 passed, 56 total`; exit 1. Solo falló `R4: food resuelve la mascota seleccionada › keeps API order and selects the first pet by default` en `expect(mockGetNutritionPlan).toHaveBeenCalledWith(...)`: `Expected: "http://example.test/v1", "jwt-token", "pet-1"`; `Number of calls: 0`. Con Q1, `test ! -e .expo/types/router.d.ts` y `bunx tsc --noEmit` dieron exit 0. Las cinco suites `consistency-classnames`, `legibility-classnames`, `design-drift`, `ui-language` y `detail-stack` dieron `Test Suites: 5 passed, 5 total`; `Tests: 173 passed, 173 total`; exit 0 (`/tmp/pt77-r5-red-guards.log`).

Con Q1 todavía puesta, el verde (`/tmp/pt77-r5-green-q1-food.log`) dio `Test Suites: 1 passed, 1 total`; `Tests: 56 passed, 56 total`; exit 0. El precheck de tipos, `bunx tsc --noEmit` y `bunx expo lint` dieron exit 0. Greps de `food.test.tsx`: `#77 R5` → `1`; guard de citas → `9`; `StyleSheet` → `0` (exit 1); clase arbitraria → `0` (exit 1). No se renombró el `it` ni se cambió otra aserción.

Tras el revert, `/tmp/pt77-r5-revert-food.log` dio `Test Suites: 1 passed, 1 total`; `Tests: 56 passed, 56 total`; exit 0. Sus tres comprobaciones desde `mobile-pet-tracker/`:

| Comando | Salida |
|---|---|
| `git diff --exit-code 3b0fcb64~1 HEAD -- ':/mobile-pet-tracker/src/app/(tabs)/food.tsx'; echo "exit=$?"` | `exit=0`, diff vacío |
| `git diff --stat 3b0fcb64~1 3b0fcb64 -- ':/mobile-pet-tracker/src/app/(tabs)/food.tsx'` | `mobile-pet-tracker/src/app/(tabs)/food.tsx \| 9 ++++++++-`; `1 file changed, 8 insertions(+), 1 deletion(-)` |
| `git rev-parse 'HEAD:mobile-pet-tracker/src/app/(tabs)/food.tsx'` | `e310ff45ac9a6abc5475e983a2c03e1d7b5f909b` |

### Sondas Q2–Q4

Todas corrieron `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' -t 'keeps API order and selects the first pet by default'` y dieron `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 55 skipped, 56 total`; exit 1. El único rojo fue ese `it`. Tras cada sonda, `git diff --exit-code -- 'src/app/(tabs)/food.tsx'; echo "exit=$?"` dio `exit=0` antes de la siguiente.

| Sonda | Esperado | Medido | Firma (`Expected` / `Received`) |
|---|---:|---:|---|
| Q2 (`enabled: false`) | 1 | 1 | `Expected: "http://example.test/v1", "jwt-token", "pet-1"`; `Number of calls: 0` |
| Q3 (argumento `pet-2`) | 1 | 1 | `Expected: "http://example.test/v1", "jwt-token", "pet-1"`; `Received: "http://example.test/v1", "jwt-token", "pet-2"`; `Number of calls: 1` |
| Q4 (Q1 con `pet-2`) | 1 | 1 | Misma firma de Q3; `Number of calls: 1` |

Logs: `/tmp/pt77-r5-probe-Q2.log`, `/tmp/pt77-r5-probe-Q3.log`, `/tmp/pt77-r5-probe-Q4.log`.

### Cierre de la Enmienda 1

| Comando | Salida exacta de resumen |
|---|---|
| `bunx jest --runTestsByPath src/screens/home/index.test.tsx > /tmp/pt77-r5-close-home.log 2>&1; echo "exit=$?"` | `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 159 passed, 159 total` |
| `bun run --cwd mobile-pet-tracker test > /tmp/pt77-r5-close-suite.log 2>&1; echo "exit=$?"` | `exit=0`; `Test Suites: 83 passed, 83 total`; `Tests: 1545 passed, 1545 total` |
| `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/pt77-r5-close-food.log 2>&1; echo "exit=$?"` | `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 56 passed, 56 total` |
| `test ! -e .expo/types/router.d.ts; echo "exit=$?"` | `exit=0` |
| `bun run typecheck > /tmp/pt77-r5-close-typecheck.log 2>&1; echo "exit=$?"` | `exit=0` |
| `bun run lint > /tmp/pt77-r5-close-lint.log 2>&1; echo "exit=$?"` | `exit=0` |

Greps desde `mobile-pet-tracker/`:

| Ruta | Comando/patrón | Salida |
|---|---|---|
| `src/screens/home/index.tsx` | `grep -c 'testID="summary-note"'`; `grep -c '<Weight size={20} color={muted} />'`; `grep -c 'style={TABULAR_NUMS}'`; `grep -c "activity.data.kind !== 'unauthorized'"`; `grep -c "{activity.data?.kind === 'ok' ? ("` | `1`, `1`, `8`, `1`, `1` (todos exit 0) |
| `src/screens/home/index.tsx` | `grep -c "{activity.data?.kind === 'no-tracking'"`; `grep -n 'health-records'` | `0`, salida vacía (ambos exit 1) |
| `src/screens/home/index.test.tsx` | `grep -c StyleSheet`; `grep -c -- '-\['`; `grep -cP '#[0-9]++(?! R[0-9])'`; `grep -c "^describe('#77 R"` | `0` exit 1; `0` exit 1; `1` exit 0; `3` exit 0 |
| `src/app/(tabs)/__tests__/food.test.tsx` | `grep -c '#77 R5'`; `grep -cP '#[0-9]++(?! R[0-9])'`; `grep -c StyleSheet`; `grep -c -- '-\['` | `1` exit 0; `9` exit 0; `0` exit 1; `0` exit 1 |

`git diff --exit-code origin/main...HEAD -- ':/mobile-pet-tracker/src/app/(tabs)/food.tsx'; echo "exit=$?"` → `exit=0` (diff vacío). `git log --oneline origin/main..HEAD -- ':/mobile-pet-tracker/src/app/(tabs)/food.tsx'` → exactamente `55533b96 fix(mobile): drop the nutrition plan delay (R5)` y `3b0fcb64 test(mobile): expose the food nutrition plan race (R5)`.

`git diff --stat origin/main...HEAD -- ':/mobile-pet-tracker'` →

```text
 .../src/app/(tabs)/__tests__/food.test.tsx         |  11 +-
 mobile-pet-tracker/src/screens/home/index.test.tsx | 220 +++++++++++++++++++++
 mobile-pet-tracker/src/screens/home/index.tsx      | 102 +++++-----
 3 files changed, 277 insertions(+), 56 deletions(-)
```

La producción de food termina sin diff; la decisión de diseño de R5 ya estaba cerrada por D9. R4 sigue reservado al humo humano en Android.
