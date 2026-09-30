/home/claude/sites/Pet-Tracker-wt-backend
feature/137-mobile-push-registration-r15-named-import-lock

# Implementación — mobile-push-registration-r15-named-import-lock

Fecha: 2026-09-29. Entradas #137 y #139, un único ciclo aprobado.

- Worktree y branch verificados antes de tocar archivos; árbol inicial limpio.
- Blobs de HEAD desde la raíz: test `0a6e87fe`, hook `316a36f2`, API `1f9afe40`; los tres coinciden con el handoff.
- Commit del handoff (`H`): `730d2df2`; base para la lista cerrada de archivos.
- No se cargó ninguna skill. No se ejecutaron init.sh, E2E, CDK, push ni creación de PR.
- Lectura completa de requirements.md, design.md, tasks.md y traceability.md; aprobación humana marcada, límite S5 aceptado. Arquitectura, convenciones de tests/commits/app móvil, C4/C5/C8 y grep-clean consultados. También se leyó la referencia [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) que exige mobile-pet-tracker/AGENTS.md.
- HEAD inicial `730d2df230b012491a5e71d7531b38e2cf76e1dd`; origin/main `70e1fdcb`; merge-base `70e1fdcb4bdf06236f1577ee916f52191891ed9c`.
- Guarda inicial de `.expo/types/router.d.ts`: `exit=0` (ausente).
- Base del fichero: `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 52 passed, 52 total`; 52 títulos fullName.
- Logs fuera del repo: `/tmp/impl137-730d2df2`; ejecuciones de Jest medidas sin pipe.
- Suite base: `exit=0`; `Test Suites: 86 passed, 86 total`; `Tests: 1609 passed, 1609 total`.
- Las siete anclas de Antes §7 dan `1`; el último describe inicial es el de `#133 R1`. Localización exclusivamente por contenido, sin números de línea.
- R1 rojo: `814f90ff`; `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 51 passed, 52 total`. Único `●`: `R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`. Primer error: `expect(received).not.toThrow()`; `Error message: "expo-notifications unavailable in Expo Go"`. `#133 R1` sigue verde.
- R1 verde: `e106acee`; S3 revertida a mano, `hook=0` contra `70e1fdcb`; `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 52 passed, 52 total`. Commit solo del hook.
- R2 rojo: `5ed27bee`; `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total`. Único `●`: `#139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`. Primer error: `expect(received).toBe(expected) // Object.is equality`; diff `- "MAX": 7` / `+ "MAX": 5`. R15 y `#133 R1` siguen verdes.
- R2 verde: `942bfc137856b7d316fe423209016980ec362aca`; O1 revertida; `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 53 passed, 53 total`; restauración literal aparece una vez y el último describe es `#139 R2`. Commit solo del test.

## Sondas sobre el verde de R2

Commit medido: `942bfc137856b7d316fe423209016980ec362aca`. Cada sonda se aplicó sola; todas sus anclas dieron `1` con `grep -cF`. Tras cada medición se ejecutó desde la raíz `git checkout HEAD -- mobile-pet-tracker/src/hooks/use-push-registration.ts mobile-pet-tracker/src/hooks/use-push-registration.test.tsx mobile-pet-tracker/src/api/push-tokens.ts`, seguido de `git diff --quiet` y `git diff --cached --quiet`: ambos dieron `0` en las 18 restauraciones. Las sondas no se commitearon.

Cada celda de fallo reproduce el `●` y la primera línea del error. Todos los logs imprimen exactamente una suite.

| Sonda | Esperado | Medido | Cada ● y primera línea de error | Restauración |
|---|---|---|---|---|
| S1 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`<br>`expect(received).not.toThrow()` | `diff=0`, `cached=0` |
| S2 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`<br>`expect(received).not.toThrow()` | `diff=0`, `cached=0` |
| S3 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`<br>`expect(received).not.toThrow()` | `diff=0`, `cached=0` |
| S4 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`<br>`expect(received).not.toThrow()` | `diff=0`, `cached=0` |
| O3 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`<br>`expect(received).not.toThrow()` | `diff=0`, `cached=0` |
| S6 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`<br>`expect(received).not.toThrow()` | `diff=0`, `cached=0` |
| S7 | Verde | `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 53 passed, 53 total` | Sin ● ni errores | `diff=0`, `cached=0` |
| S5 | Verde | `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 53 passed, 53 total` | Sin ● ni errores | `diff=0`, `cached=0` |
| O1 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`<br>`expect(received).toBe(expected) // Object.is equality` | `diff=0`, `cached=0` |
| O4 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`<br>`expect(received).toBe(expected) // Object.is equality` | `diff=0`, `cached=0` |
| O5 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`<br>`expect(received).toBe(expected) // Object.is equality` | `diff=0`, `cached=0` |
| O6 | 1 rojo | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 52 passed, 53 total` | `● #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`<br>`expect(received).toBe(expected) // Object.is equality` | `diff=0`, `cached=0` |
| H1 | 2 rojos | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 51 passed, 53 total` | `● #133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera › llama a cada jest.fn de la cabecera y registra el token`<br>`expo-notifications unavailable in Expo Go`<br>`● #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`<br>`expo-notifications unavailable in Expo Go` | `diff=0`, `cached=0` |
| H2 | 2 rojos | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 51 passed, 53 total` | `● #133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera › llama a cada jest.fn de la cabecera y registra el token`<br>`expect(jest.fn()).toHaveBeenCalledWith(...expected)`<br>`● #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`<br>`expo-notifications unavailable in Expo Go` | `diff=0`, `cached=0` |
| H3 | 2 rojos | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 51 passed, 53 total` | `● #133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera › llama a cada jest.fn de la cabecera y registra el token`<br>`expect(jest.fn()).toHaveBeenCalled()`<br>`● #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`<br>`expect(received).toBe(expected) // Object.is equality` | `diff=0`, `cached=0` |
| H5 | 2 rojos | `exit=1`; `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 51 passed, 53 total` | `● #133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera › llama a cada jest.fn de la cabecera y registra el token`<br>`AggregateError:`<br>`● #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`<br>`expect(received).toBe(expected) // Object.is equality` | `diff=0`, `cached=0` |
| H4+S3 | Verde | `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 53 passed, 53 total` | Sin ● ni errores | `diff=0`, `cached=0` |
| H4+O1 | Verde | `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 53 passed, 53 total` | Sin ● ni errores | `diff=0`, `cached=0` |

Los rojos con `expect` son por aserción. H1 da dos excepciones; H2 combina aserción y excepción; H3 da dos aserciones; H5 combina `AggregateError:` y aserción. S7, S5, H4+S3 y H4+O1 dan verde según lo aprobado: control de tipos, límite S5 aceptado y dependencia conocida del reset.

## Cierre R3

- R3.1: `git diff --name-only 70e1fdcb..HEAD -- mobile-pet-tracker/`, `exit=0`, devuelve solo `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`. Diff explícito del hook y de la API contra la base: `production=0`.
- R3.2: fichero final con JSON, `exit=0`; `Test Suites: 1 passed, 1 total`; `Tests: 53 passed, 53 total`. Títulos: 52 → 53; `diff=1`, exactamente una adición y ninguna eliminación. El diff es:

```text
11a12
> #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera jest.requireMock devuelve el mismo objeto, no una copia
```

- R3.3: `git diff --stat 70e1fdcb..HEAD -- mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`, `exit=0`: `1 file changed, 18 insertions(+), 12 deletions(-)`. Las 12 eliminaciones corresponden únicamente al bloque Proxy de R15; los describe existentes conservan su orden y sus títulos. Inspección del diff y `git diff --check`: `exit=0`.

- R3.4: `bunx jest > "$OUT/final_suite.log" 2>&1; echo "exit=$?"` desde `mobile-pet-tracker/`: `exit=0`; `Test Suites: 86 passed, 86 total`; `Tests: 1610 passed, 1610 total`. Delta: +0 suites, +1 test; fichero 52 → 53 y suite 1609 → 1610.
- R3.5: antes de tsc, `test ! -e .expo/types/router.d.ts; echo "exit=$?"` da `exit=0`; no se borró ni se modificó ese fichero. `bunx tsc --noEmit > "$OUT/tsc.log" 2>&1; echo "exit=$?"` y `bunx eslint src/hooks/use-push-registration.test.tsx > "$OUT/eslint.log" 2>&1; echo "exit=$?"`: ambos `exit=0`. Todas estas herramientas se ejecutaron desde `mobile-pet-tracker/`.
- R3.6: patrón literal de tasks.md aplicado a las líneas añadidas, desde la raíz, sin coincidencias; `exit=1` del último grep (resultado limpio). Se usó el patrón de `design-drift.test.ts`, que permite las referencias `#137 R1` y `#139 R2`. No hay pantalla; las demás reglas visuales de C8 no aplican.
- R3.7: evidencia y trazabilidad completadas. Ninguna fila de R1/R2/R3 queda pendiente. R1 cita rojo y verde; R2 cita rojo y verde; R3 cita el verde de R2. No se hizo rebase.

## Historial test primero

| Fase | Hash | Mensaje literal | Archivos del commit |
|---|---|---|---|
| R1 rojo | `814f90ffc7782cc06557c2aef11b1ec0c3d08c15` | `test(mobile): expose the R15 named import blind spot with a versioned mutation (R1)` | Test y hook con S3 |
| R1 verde | `e106aceee622d91c3b8318dcb1f70d80689c5447` | `test(mobile): lock R15 against a named expo-notifications import (R1)` | Solo hook, revierte S3 |
| R2 rojo | `5ed27bee4f30c5b06979f0dd69578910fde3937d` | `test(mobile): expose the R15 restore identity gap with a versioned mutation (R2)` | Solo test, captura + describe + O1 |
| R2 verde | `942bfc137856b7d316fe423209016980ec362aca` | `test(mobile): lock the R15 restore to the header module identity (R2)` | Solo test, revierte O1 |

El quinto commit lleva únicamente este reporte y traceability.md, con mensaje `docs(mobile): record the R15 named import and restore identity evidence (R1,R2,R3)`.

## Alcance final

Lista cerrada medida contra el handoff `730d2df2`, con el índice preparado para el commit de evidencia (`git diff --name-only 730d2df2`, `exit=0`):

```text
mobile-pet-tracker/src/hooks/use-push-registration.test.tsx
progress/impl_mobile-push-registration-r15-named-import-lock.md
specs/mobile-push-registration-r15-named-import-lock/traceability.md
```

`git diff --cached --name-only` lista únicamente reporte y trazabilidad; `git diff --cached --check` da `exit=0`. Los cuatro hashes de rojo/verde siguen siendo ancestros de HEAD (`git merge-base --is-ancestor`, cuatro `exit=0`). El grep de filas R1/R2/R3 con «pendiente» no imprime nada y da `exit=1`.

Las capturas `headerNotificationsModule` y `headerNotifications` conservan sus dos momentos distintos. El finally de R15 y el hook vuelven exactamente a la base. Cero dependencias nuevas. No se modificaron el test de navegación, las specs de #79/#133, el puntero de #139, las configuraciones ni los artefactos del leader (`progress/current.md`, `progress/history.md`, `STATUS.md`, `feature_list.json`). El cierre de estado, revisión, push y PR corresponden al leader.

Límites aceptados y medidos: S5 permanece verde; H4+S3 y H4+O1 permanecen verdes por la dependencia del reset. No hay prueba en dispositivo; P2 conserva el alcance declarado en la spec, leída y no medida en teléfono.

Logs sin versionar en `/tmp/impl137-730d2df2`: `base_file.log`, `base_suite.log`, `r1_red.log`, `r1_green.log`, `r2_red.log`, `r2_green.log`, los 18 `sonda_<id>.log`, `final_file.log`, `final_suite.log`, `tsc.log` y `eslint.log`; JSON y listas de títulos base/final también fuera del repo.
