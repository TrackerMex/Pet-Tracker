# Implementación #123 — mobile-date-picker-utc-day-shift

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-backend`
- `git branch --show-current`: `feature/123-mobile-date-picker-utc-day-shift`
- `git merge-base --is-ancestor 70f841f3 HEAD`: `exit=0`
- `.expo/types/router.d.ts`: ausente al arrancar.
- Skills cargadas: `ponytail` (full), `expo-ui-jetpack-compose`. La skill de Compose describe SDK 55; la spec aprobada y el `@expo/ui` instalado 57.0.11 fijan aquí el contrato.
- Base móvil medida en este worktree: add-reminder 1 suite / 21 tests (`exit=0`); add-pet 1 suite / 20 tests (`exit=0`); suite móvil 82 suites / 1471 tests (`exit=0`).
- Base del leader en `70f841f3`, `./init.sh exit=0`: móvil 82 suites / 1471 tests; backend unit 170 suites / 1298 tests; infra 2 suites / 14 tests; e2e 27 suites passed + 3 skipped (30), 389 tests passed + 8 skipped. No se ejecuta `./init.sh` en esta implementación.

## TDD R1-R7

- R1 rojo `4e63ef3d`: `bunx jest --runTestsByPath src/utils/date-picker-value.test.ts`, 1 suite, 4 fallos de aserción (CDMX septiembre, cruce de mes, cruce de año, Honolulu), Kiritimati verde, `exit=1`. Sin error de módulo ni `ReferenceError`.
- R1 verde `e87c4e4f`: mismo comando, 1 suite / 5 tests, `exit=0`.
- R2 rojo `fbb3afdc`: helper, 1 suite, 4 fallos de aserción (CDMX 24/9, cruce de mes, cruce de año, Madrid), 6 tests verdes (R1 y R2 fila 4), `exit=1`.
- R2 verde `e0f9e411`: helper, 1 suite / 10 tests, `exit=0`.
- R3 rojo `06892186`: helper, 2 fallos `toBe` en iOS; R1-R2 verdes, `exit=1`.
- R3 verde `08b68ba4`: helper, 1 suite / 12 tests, `exit=0`.
- R4 rojo `928de550`: add-reminder, 1 suite, 3 fallos en etiqueta del día anterior (`23/9/2026`, `30/9/2026`, `31/12/2026` frente a los días elegidos); 21 tests previos verdes, `exit=1`.
- R4 verde `3a5c20b2`: add-reminder, 1 suite / 24 tests, `exit=0`.
- R5 rojo `4d02bb34`: add-reminder, 1 fallo en `value` crudo (`2026-09-24T20:00:00.000Z` frente a medianoche UTC), 24 verdes, `exit=1`.
- R5 verde `86204625`: add-reminder, 1 suite / 25 tests, `exit=0`.
- R6 rojo `b4bf8d41`: add-pet, 1 suite, 3 fallos en etiqueta del día anterior (`23/9/2026`, `30/9/2025`, `31/12/2025` frente a los días elegidos); 20 tests previos verdes, incluido `#90 R6`, `exit=1`.
- R6 verde `752528ba`: add-pet, 1 suite / 23 tests, `exit=0`; `#90 R6` sigue verde.
- R7 rojo `25c0175f`: add-pet, 1 fallo en `value` crudo (`2026-09-24T20:00:00.000Z`), 23 verdes, `exit=1`.
- R7 verde `6d5769d7`: add-pet, 1 suite / 24 tests, `exit=0`; `#90 R6` sigue verde.

## Sondas

Todas fueron mutaciones **sin commit**, ejecutadas con Jest `--runTestsByPath`; cada una dio `exit=1` y se restauró con `git diff --exit-code -- <archivo>` vacío.

| Archivo | Sonda | Tests rojos |
|---|---|---:|
| helper | F0b copia del instante | 4 |
| helper | F1 día local | 4 |
| helper | F2 mes local | 2 |
| helper | F3 año local | 1 |
| helper | F5 día constante 1 | 3 |
| helper | F6 mes constante 8 | 2 |
| helper | F7 año constante 2026 | 1 |
| helper | F8 offset fijo +6 h | 1 |
| helper | F9 offset fijo +12 h | 1 |
| helper | T1 día UTC | 4 |
| helper | T2 mes UTC | 2 |
| helper | T3 año UTC | 1 |
| helper | T6 mes constante 8 | 2 |
| helper | T7 año constante 2026 | 1 |
| helper | T9 restar 6 h y leer día UTC | 2 |
| helper | R3 sin puerta en `fromPickerValue` | 1 |
| helper | R3 sin puerta en `toPickerValue` | 1 |
| add-reminder | `toPickerValue` en `onValueChange` | 3 |
| add-reminder | `fromPickerValue` en `setTime` | 3 |
| add-reminder | `toPickerValue` en `minimumDate` | 1 |
| add-reminder | `toPickerValue` en `value` de hora | 1 |
| add-pet | `toPickerValue` en `onValueChange` | 3 |
| add-pet | `toPickerValue` en `maximumDate` | 1 |
| add-pet + helper | quitar puerta de `fromPickerValue`: falla `#90 R6` | 1 |

## Cierre

- `bunx jest --runTestsByPath src/utils/date-picker-value.test.ts src/screens/add-reminder/index.test.tsx src/screens/add-pet/index.test.tsx`: **3 suites / 61 tests**, `exit=0` (12 + 25 + 24).
- `bun run test`: **83 suites / 1491 tests**, `exit=0` (+1 suite / +20 tests sobre la base).
- `bunx tsc --noEmit`: `exit=0`; `bun run lint`: `exit=0`.
- Greps del helper: `Date.UTC(` = 1; getters = `getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()` una vez cada uno; `Platform.OS !== 'android'` = 2; `getTime|getTimezoneOffset|toISOString|getHours` = 0 (grep devuelve `exit=1` al no haber coincidencias).
- Greps de pantallas: `PickerValue(` = 2 en cada una; `minimumDate={new Date()}` = 1; `maximumDate={new Date()}` = 1; `getUTC` = 0 en ambas (grep devuelve `exit=1` al no haber coincidencias).
- `git diff --stat origin/main...HEAD -- mobile-pet-tracker`: exactamente los seis archivos móviles de design.md, 224 inserciones / 4 borrados; sin dependencias, parches ni cambios nativos. `git diff --check` = limpio.
- `.expo/types/router.d.ts` sigue ausente (`test ! -e`: `exit=0`).
- R8: pendiente de smoke y firma del humano; su casilla no se tocó.

## Commits TDD (orden de ejecución)

| R | Rojo | Verde |
|---|---|---|
| R1 | `4e63ef3d` | `e87c4e4f` |
| R2 | `fbb3afdc` | `e0f9e411` |
| R3 | `06892186` | `08b68ba4` |
| R4 | `928de550` | `3a5c20b2` |
| R5 | `4d02bb34` | `86204625` |
| R6 | `b4bf8d41` | `752528ba` |
| R7 | `25c0175f` | `6d5769d7` |
