Worktree: /home/claude/sites/Pet-Tracker
/home/claude/sites/Pet-Tracker
feature/74-mobile-metric-selector-a11y

# Implementación #74 — selector de métrica accesible

- Skills cargadas: `expo:building-native-ui` (plugin Expo v1.0.2) y `ponytail:ponytail` (modo full, activo). `appllama-app-design-skill` no aplica: esta feature solo modifica props de accesibilidad, tests y un comentario.
- Opción de R3 firmada y aplicada: **A**.
- Precondición: `test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`.
- Blobs de base (`git hash-object`): gráfica `128c09bd9a6e5aa55bdcbedbd4a67e23f956044b`; test `bc8e8fd93da7f4ec8a70291963ba7dfda97fe164`; `card.tsx` `ca32acdee8123e203405c4bffa78ad35c15be216`.
- Base medida sin pipe: `bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/74_chart.log 2>&1; echo "exit=$?"` → `exit=0`, `Test Suites: 1 passed, 1 total`, `Tests: 36 passed, 36 total`, `Snapshots: 0 total`. `bunx jest > /tmp/74_full.log 2>&1; echo "exit=$?"` → `exit=0`, `Test Suites: 83 passed, 83 total`, `Tests: 1545 passed, 1545 total`, `Snapshots: 1 passed, 1 total`.

## R1

- Rojo `ea01cec7` (`test(mobile): expect the metric selector to be a radiogroup (R1)`), solo el test; blob `567bc3732ce672e10fbd483c46e5659b6e548fcb`. Gráfica: `exit=1`, 1 suite failed, 1 failed + 36 passed / 37 tests. Suite: `exit=1`, 1 failed + 82 passed / 83 suites, 1 failed + 1545 passed / 1546 tests, 1 snapshot passed. Único `it` rojo: `#74 R1: el contenedor del selector se anuncia como grupo de opciones › declara el rol radiogroup en el contenedor de las tres opciones`; `expect(received).toBe(expected)`, `Expected: "radiogroup"`, `Received: undefined`.
- Verde `613a2e23` (`fix(mobile): announce the metric selector as a radiogroup (R1)`); blob gráfica `e8e6633b601a3fd52064593bd37bb61e942d4368`. Gráfica: `exit=0`, 1 suite passed, 37 passed / 37 tests, 0 snapshots.

## R2

- Rojo `5911d142` (`test(mobile): expose the metric selector collapse with a versioned mutation (R2)`), test `c0ec0cb8a0a560962ac1dc7a5fe4120b2488bef2` y P2red en gráfica `e82cb3551816d24990cf24b8965f104df0775e0d`. Gráfica: `exit=1`, 1 suite failed, 2 failed + 37 passed / 39 tests. Suite: `exit=1`, 1 failed + 82 passed / 83 suites, 2 failed + 1546 passed / 1548 tests, 1 snapshot passed. Únicos `it` rojos, ambos `expect(received).toEqual(expected)`: `#74 R2: el grupo del selector no colapsa sus tres opciones › el contenedor solo lleva su rol, su testID, su clase y sus hijos` (`Expected: ['accessibilityRole', 'children', 'className', 'testID']`; `Received: ['accessibilityLabel', 'accessibilityRole', 'accessible', 'children', 'className', 'testID']`) y `› la tarjeta que lo envuelve tampoco se vuelve un nodo accesible` (`Expected: ['children', 'className', 'style', 'testID']`; `Received: ['accessible', 'children', 'className', 'style', 'testID']`).
- Verde `12afe47d` (`test(mobile): lock the metric selector group against collapsing (R2)`): `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` devolvió el blob `e8e6633b601a3fd52064593bd37bb61e942d4368`. Gráfica: `exit=0`, 1 suite passed, 39 passed / 39 tests, 0 snapshots.

## R3 (opción A)

- Rojo `43115c35` (`test(mobile): lock the metric label fit and floor per platform (R3)`), test `ce1685a5c52c88a15e6158774708e8753506f0fa` y P3redA en gráfica `32de788668a0d8e88583550374d605cd3eeb3e5f`. Gráfica: `exit=1`, 1 suite failed, 2 failed + 39 passed / 41 tests. Suite: `exit=1`, 1 failed + 82 passed / 83 suites, 2 failed + 1548 passed / 1550 tests, 1 snapshot passed. Únicos `it` rojos, ambos `expect(received).toEqual(expected)`: `#74 R3: el ajuste y el suelo de las etiquetas del selector, por plataforma › android: ajuste true, escala mínima 0.85 y tope 1.2 en las tres etiquetas` y `› ios: ajuste true, escala mínima 0.85 y tope 1.2 en las tres etiquetas`. En cada fila: `Expected: [[true, 0.85, 1.2], [true, 0.85, 1.2], [true, 0.85, 1.2]]`; `Received: [[true, undefined, 1.2], [true, undefined, 1.2], [true, undefined, 1.2]]`.
- Verde `ed868658` (`fix(mobile): document the Android shrink floor of the metric labels (R3)`): `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` restauró `e8e6633b601a3fd52064593bd37bb61e942d4368`; el comentario literal de A dejó la gráfica en `c258abedde92d2be981be8507d3d898f13c612cb`. Gráfica: `exit=0`, 1 suite passed, 41 passed / 41 tests, 0 snapshots. `grep -n "Android ignores minimumFontScale"` → `59:// Android ignores minimumFontScale: RN 0.86.2 only reads minimumFontSize, which`.

## R4

- `grep -c "jest.mock('uniwind'"` → `0`; `grep -c "useUniwind"` → `0`; `grep -c "mockTheme"` → `5` (todos sobre `src/screens/home/weekly-activity-chart.test.tsx`). Test: blob `d9687b162d20a2905b20f3c06158c619cb440d7a`.
- Gráfica: `exit=0`, 1 suite passed, 41 passed / 41 tests, 0 snapshots. Commit `8ed1b9fc` (`test(mobile): drop the dead uniwind mock (R4)`).

## Sondas sobre el árbol final (opción A)

Cada sonda se aplicó sola al archivo de producción, se comprobó su blob **antes** de medir, se ejecutó `bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/74_probe_<sonda>.log 2>&1`, y se restauró con `git checkout -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`. Tras **cada una**, `git diff --exit-code -- mobile-pet-tracker/src` dio `exit=0`. Todas las corridas imprimieron `Test Suites: 1 failed, 1 total`, `Snapshots: 0 total` y `exit=1`.

Nombres completos de los `it` abreviados en la columna «Medido»:

- **R1** = `#74 R1: el contenedor del selector se anuncia como grupo de opciones › declara el rol radiogroup en el contenedor de las tres opciones`.
- **C** = `#74 R2: el grupo del selector no colapsa sus tres opciones › el contenedor solo lleva su rol, su testID, su clase y sus hijos`.
- **T** = `#74 R2: el grupo del selector no colapsa sus tres opciones › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`.
- **A** = `#74 R3: el ajuste y el suelo de las etiquetas del selector, por plataforma › android: ajuste true, escala mínima 0.85 y tope 1.2 en las tres etiquetas`.
- **I** = `#74 R3: el ajuste y el suelo de las etiquetas del selector, por plataforma › ios: ajuste true, escala mínima 0.85 y tope 1.2 en las tres etiquetas`.
- **6a** = `R6: el selector cambia de métrica sin volver a pedir nada › ofrece tres opciones accesibles y mantiene cada etiqueta en una línea`.
- **6b** = `R6: el selector cambia de métrica sin volver a pedir nada › repinta distancia desde la opción pulsada con los mismos datos`.
- **6c** = `R6: el selector cambia de métrica sin volver a pedir nada › desliza una única píldora entre las medidas reales de las pestañas`.
- **9** = `R9: el selector sigue el tema de la app › adapta píldora, texto e icono con los tokens de tabs en ambos temas`.
- **12** = `R12: la tendencia sigue a la métrica y se calla sin base › cambia la tendencia al delta de la métrica seleccionada`.
- **13** = `R13: la semana entera sin dato se resuelve con un mensaje › mantiene las siete columnas si al menos un día está medido`.

| Sonda | Blob medido | Medido: Tests; cada `it` rojo y matcher | Restauración |
|---|---|---|---|
| `collapse` | `7a89e8e76b2e85589f5a5e8589bed7726b684b79` | 1 failed, 40 passed / 41; C `toEqual` | diff 0 |
| `accessible` | `8ed18a4a3cf3c1af2f76a94d971e4ea99a512347` | 1 failed, 40 passed / 41; C `toEqual` | diff 0 |
| `arialabel` | `43b2d1ac9fc8119513b48b587b77368773242cfc` | 1 failed, 40 passed / 41; C `toEqual` (el diff muestra la clave `aria-label`) | diff 0 |
| `rolealias` | `010f7e7354449a66dd3cb0afb9fbaebfb3b4163f` | 2 failed, 39 passed / 41; R1 `toBe`, C `toEqual` | diff 0 |
| `hide` | `93a8094267e96f34d4f841901fecce53accfbe01` | 10 failed, 31 passed / 41; 6a, 6b, 6c, 9, 12, 13, R1, C, A, I: **sin matcher**, `getByTestId` falla al buscar nodos ocultos | diff 0 |
| `noRole` | `b34cc1cee61487b2468ff75a650e907f822bdf1b` | 2 failed, 39 passed / 41; R1 `toBe`, C `toEqual` | diff 0 |
| `cardacc` | `8fc10f1cec33e74740e1684bdad635a656af95cb` | 1 failed, 40 passed / 41; T `toEqual` | diff 0 |
| `cardpress` | `2a460368e92f97e28c1e7e6dae849b81a157f729` | 1 failed, 40 passed / 41; T `toEqual` | diff 0 |
| `nomfs` | `19a29055871f639fc2e9b6e1d945d3d327ccfb57` | 2 failed, 39 passed / 41; A `toEqual`, I `toEqual` | diff 0 |
| `mfs05` | `808d9db87a585306319782a6c95c5a751acb4b10` | 2 failed, 39 passed / 41; A `toEqual`, I `toEqual` | diff 0 |
| `nomaxm` | `334e570a590ef63a1368ae1b3fd9f7b58758fa46` | 2 failed, 39 passed / 41; A `toEqual`, I `toEqual` | diff 0 |
| `branch` | `8b9d19fac8ec0afaf631bbf161ee1e3e5e685bc0` | 1 failed, 40 passed / 41; A `toEqual` | diff 0 |

`hide` cumple exactamente la columna «Exigido» de `tasks.md` (los diez `it` y las cuentas). Su nota general «Todos los rojos de #74 son por toEqual, salvo R1 ... toBe» no describe esta sonda: `importantForAccessibility="no-hide-descendants"` hace que RNTL no encuentre los nodos y los `it` fallan antes del `expect`. Log íntegro: `/tmp/74_probe_hide.log`. No se alteró ninguna aserción.

## R5 — cierre

Comandos de Jest desde `mobile-pet-tracker/`, **sin pipe**:

```text
bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/74_final_chart.log 2>&1; echo "chart_exit=$?"
chart_exit=0
Test Suites: 1 passed, 1 total
Tests:       41 passed, 41 total
Snapshots:   0 total

bunx jest > /tmp/74_final_full.log 2>&1; echo "full_exit=$?"
full_exit=0
Test Suites: 83 passed, 83 total
Tests:       1550 passed, 1550 total
Snapshots:   1 passed, 1 total
```

Delta sobre la base **83 suites / 1545 tests / 1 snapshot**: **+0 suites, +5 tests, +0 snapshots**. Los bloques `● Console` son 30 tanto en la base como en el cierre.

Precondición y herramientas, también desde `mobile-pet-tracker/`:

```text
test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
bunx tsc --noEmit > /tmp/74_tsc.log 2>&1; echo "exit=$?"
exit=0
cat /tmp/74_tsc.log
(sin salida)
bunx eslint src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx > /tmp/74_lint.log 2>&1; echo "exit=$?"
exit=0
cat /tmp/74_lint.log
(sin salida)
```

Greps de R4, desde `mobile-pet-tracker/`:

```text
grep -c "jest.mock('uniwind'" src/screens/home/weekly-activity-chart.test.tsx
0
grep -c "useUniwind" src/screens/home/weekly-activity-chart.test.tsx
0
grep -c "mockTheme" src/screens/home/weekly-activity-chart.test.tsx
5
```

Greps de R5.4, desde `mobile-pet-tracker/`:

```text
grep -c "style={CONTINUOUS_CORNER}" src/screens/home/weekly-activity-chart.tsx
1
grep -c "style={TABULAR_NUMS}" src/screens/home/weekly-activity-chart.tsx
4
grep -c 'accessibilityRole="radiogroup"' src/screens/home/weekly-activity-chart.tsx
1
grep -c "Platform" src/screens/home/weekly-activity-chart.tsx
0
grep -ciE "stylesheet|text-\[10px\]" src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx
src/screens/home/weekly-activity-chart.tsx:0
src/screens/home/weekly-activity-chart.test.tsx:0
grep -c "use-api" src/screens/home/weekly-activity-chart.test.tsx
1
grep -n "Android ignores minimumFontScale" src/screens/home/weekly-activity-chart.tsx
59:// Android ignores minimumFontScale: RN 0.86.2 only reads minimumFontSize, which
```

Desde la raíz del repo:

```text
git diff --stat origin/main...HEAD -- mobile-pet-tracker/
 .../screens/home/weekly-activity-chart.test.tsx    | 86 ++++++++++++++++++++--
 .../src/screens/home/weekly-activity-chart.tsx     |  3 +
 2 files changed, 84 insertions(+), 5 deletions(-)
git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/components/card.tsx; echo "diff_exit=$?"
diff_exit=0
git hash-object mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
c258abedde92d2be981be8507d3d898f13c612cb
d9687b162d20a2905b20f3c06158c619cb440d7a
```

Los siete commits de código están en orden: R1 `ea01cec7` → `613a2e23`; R2 `5911d142` → `12afe47d`; R3 `43115c35` → `ed868658`; R4 `8ed1b9fc`. R5 se registra en el commit de este reporte. La fila verde de R5 en `traceability.md` usa `8ed1b9fc`, el último commit que fija el árbol de código medido: el hash del commit que contiene la propia tabla no puede escribirse dentro de sí mismo. Esta es la única decisión de trazabilidad que la spec no cerró literalmente. R6 sigue como gate humano; no se marcó `done`.
