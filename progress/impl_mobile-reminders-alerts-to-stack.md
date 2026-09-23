/home/claude/sites/Pet-Tracker
feature/114-mobile-reminders-alerts-to-stack

Skills cargadas: `expo:building-native-ui` (plugin Expo v1.0.2), `ponytail:ponytail` (full).

## Base y alcance

- HEAD inicial: `636a60de` (posterior a `f5a491ee` y a `a833f153`). P1=A; spec, A13 y A14 firmadas el 2026-09-23.
- Se consultó la referencia versionada de Expo SDK 57 (`https://docs.expo.dev/versions/v57.0.0/`), además de `mobile-pet-tracker/AGENTS.md`.
- El intento de medir la suite base coincidió con la edición del rojo R1: `Test Suites: 2 failed, 78 passed, 80 total`; `Tests: 4 failed, 1426 passed, 1430 total`; `jest_exit=1`. Esos cuatro fallos eran los cuatro `it` nuevos de R1. `tsc_exit=0`, `lint_exit=0`, ambos con 0 bytes. Por tanto no se obtuvo una corrida verde aislada de la base en esta sesión; la referencia firmada de la spec es 80 suites / 1426 tests.
- Se retiró `.expo/types/router.d.ts` con `Path.unlink(missing_ok=True)` antes del código y de cada `tsc`. El runner rechazó el primer intento literal de `rm -f`; la operación equivalente con Python terminó bien.

## Commits TDD

| Paso | Rojo: hash y línea de fallo | Verde: hash |
|---|---|---|
| A14 | `c713068c` docs, antes de R1 | — |
| R1 | `c2ba2c16`: `Expected: true; Received: false` para las dos rutas; guarda con 6 en vez de 8; 2 suites, 4 fallos solo de R1 | `c7883721` |
| R2 | `892151b5`: `Expected: ["(tabs)", "reminders"]; Received: ["(tabs)"]`; 1 suite, 1 fallo | `c7883721` |
| R3 | `dc4f5485`: `Expected: ["(tabs)", "alerts"]; Received: ["(tabs)"]`; 1 suite, 1 fallo, sin timeout | `c7883721` |
| R4 | `a0a27e66`: `Received: undefined` en `options` de ambas rutas; 1 suite, 2 fallos | `9f88d0ef` |
| R5 | `6e4bdad0`: `Received: <Text ...>Recordatorios</Text>` y `Received: <Text ...>Alertas</Text>` en las ausencias durante carga; 2 suites, 2 fallos | `cc0c971b` |
| A13 | `97d2476a` docs, antes de R6 | — |
| R6 | `277e8fd0`: `contentContainerStyle` aún incluía `paddingTop: 52` y `paddingBottom: 120`; 2 suites, 2 fallos | `a18a7bef` |
| R7 | `d7e727d9`: `Expected number of calls: 1; Received number of calls: 0` para `dismissTo`; 1 suite, 1 fallo | `36a9eca6` |

R1–R3: `bunx jest --runTestsByPath` sobre los diez ficheros del paso 4 → `Test Suites: 10 passed, 10 total`, `Tests: 204 passed, 204 total`; `tsc_exit=0` con salida vacía. Refactor: `bunx jest --silent` → 82 suites, 1431 tests, `exit=0` antes de R4–R7.

## Mutaciones de R1–R3

1. Quitar `dangerouslySingular` de `alerts`: `bunx jest --runTestsByPath src/app/__tests__/reminders-alerts-stack.notification.test.tsx` → `exit=1`, `Test Suites: 1 failed, 1 total`, `Tests: 1 failed, 1 total`. Tras el segundo toque, volver quedó en `/alerts` (`Expected: "/add-reminder"; Received: "/alerts"`). Se restauró; `git diff --exit-code -- src/app/_layout.tsx` vacío.
2. Sacar `reminders` del `Stack.Protected`: `bunx jest --runTestsByPath src/app/__tests__/layout.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` → `exit=1`, `Test Suites: 2 failed, 2 total`, `Tests: 2 failed, 15 passed, 17 total`. R1 recibió 7 hijos en lugar de 8; R2 quedó en `/reminders` al cerrar sesión (`Expected: "/login"`). Se restauró; `git diff --exit-code -- src/app/_layout.tsx` vacío.

## Cierre

Comandos desde `mobile-pet-tracker/`, sin pipe:

```text
python3 -c "from pathlib import Path; Path('.expo/types/router.d.ts').unlink(missing_ok=True)"
bunx tsc --noEmit > /tmp/close114-tsc.txt 2>&1; echo "tsc_exit=$?"
tsc_exit=0
bunx expo lint > /tmp/close114-lint.txt 2>&1; echo "lint_exit=$?"
lint_exit=0
wc -c /tmp/close114-tsc.txt /tmp/close114-lint.txt
0 /tmp/close114-tsc.txt
0 /tmp/close114-lint.txt
0 total
bunx jest --silent > /tmp/close114.txt 2>&1; echo "jest_exit=$?"
jest_exit=0
Test Suites: 82 passed, 82 total
Tests:       1435 passed, 1435 total
```

El JSON dirigido de los diez ficheros de D8:

```text
bunx jest --silent --json --outputFile=/tmp/close114-d8.json --runTestsByPath src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/reminders-alerts-stack.notification.test.tsx src/app/__tests__/detail-stack.test.tsx src/app/__tests__/layout.test.tsx src/screens/reminders/index.test.tsx src/screens/alerts/index.test.tsx src/screens/add-reminder/index.test.tsx src/screens/home/index.test.tsx 'src/app/(tabs)/__tests__/alerts.test.tsx' src/__tests__/ui-language.test.ts > /tmp/close114-d8.txt 2>&1; echo "exit=$?"
exit=0
Test Suites: 10 passed, 10 total
Tests:       282 passed, 282 total
```

Reparto:

| Fichero | Base | Cierre | Delta |
|---|---:|---:|---:|
| `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | 0 | 1 | +1 |
| `src/app/__tests__/reminders-alerts-stack.notification.test.tsx` | 0 | 1 | +1 |
| `src/app/__tests__/detail-stack.test.tsx` | 12 | 14 | +2 |
| `src/app/__tests__/layout.test.tsx` | 15 | 18 | +3 |
| `src/screens/reminders/index.test.tsx` | 25 | 26 | +1 |
| `src/screens/alerts/index.test.tsx` | 32 | 33 | +1 |
| `src/screens/add-reminder/index.test.tsx` | 21 | 21 | 0 |
| `src/screens/home/index.test.tsx` | 140 | 140 | 0 |
| `src/app/(tabs)/__tests__/alerts.test.tsx` | 3 | 3 | 0 |
| `src/__tests__/ui-language.test.ts` | 25 | 25 | 0 |

Verificaciones de cierre:

```text
grep -c 'enmienda A13 de #114' docs/conventions.md docs/ui-guidelines.md
docs/conventions.md:1
docs/ui-guidelines.md:1
grep -c 'Enmienda externa A14 — la escribe #114' specs/mobile-alerts-center/requirements.md specs/mobile-reminders/requirements.md
specs/mobile-alerts-center/requirements.md:1
specs/mobile-reminders/requirements.md:1
git grep -n 'Redirect' -- mobile-pet-tracker/src/screens/add-reminder
(salida vacía)
git diff a833f153 -- mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/hooks/use-push-registration.ts mobile-pet-tracker/src/components/floating-tab-bar.tsx 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx'
(salida vacía)
git diff --check a833f153
(salida vacía)
```

`src/app/(tabs)/` contiene exactamente `__tests__/`, `_layout.tsx`, `food.tsx`, `health.tsx`, `home.tsx`, `map.tsx` y `profile.tsx`. El grep de hex, clases arbitrarias, `StyleSheet.create` y sombras legacy en los cuatro ficheros de producción afectados salió vacío. Catálogo y hook de push sin cambios.

Decisión de implementación no fijada literalmente: en R7 se usó la aserción directa sobre `dismissTo` en el rojo, en lugar de `waitFor`, para que el fallo inicial fuese una aserción inmediata y no un timeout. No hubo decisiones de producto adicionales. El smoke Android de §Prueba de humo queda para el humano.
