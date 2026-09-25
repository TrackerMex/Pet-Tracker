# Implementación #125 — reminder-advance-already-past

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-backend`
- `git branch --show-current`: `feature/125-reminder-advance-already-past`
- Base: `git merge-base --is-ancestor 40ec1b46 HEAD` → `exit=0`; `mobile-pet-tracker/.expo/types/router.d.ts` ausente.
- Skills cargadas: `expo:building-native-ui` y `ponytail:ponytail` (full). Para backend, `docs/architecture.md` y `docs/conventions.md`; para móvil, `docs/ui-guidelines.md` y la spec aprobada.
- Baseline del leader en `40ec1b46`, `./init.sh exit=0`: backend unit 170 suites / 1298 tests; infra 2 / 14; móvil 83 / 1491; e2e 27 suites passed + 3 skipped (30), 389 tests passed + 8 skipped.
- Bases medidas aquí, sin pipe: reminders 6 suites / 48 tests (`exit=0`); backend unit 170 / 1298 (`exit=0`); add-reminder 25 (`exit=0`); móvil 83 / 1491 (`exit=0`).

## TDD

R1 rojo: `pnpm -C backend-pet-tracker exec jest src/modules/reminders/application/reminder-push-body.spec.ts; echo "exit=$?"` → `exit=1`, 7/7 filas fallan por aserción (cuerpo recibido `Recordatorio: Vacuna antirrábica`). `pnpm -C backend-pet-tracker run lint` se ejecutó antes del commit: `exit=1` por los dos parámetros intencionadamente sin usar del esqueleto (`dueAt`, `timeZone`); el verde los consume.

R1 verde: mismo Jest → `exit=0`, 1 suite / 7 tests; lint backend → `exit=0`.

R2 rojo: Jest enfocado dispatcher → `exit=1`, 3 fallos por aserción (R6 movido y los dos `it` de #125 R2), 3 tests R5 verdes. Candados movidos en este rojo: literal del cuerpo de R6 y cuarto argumento en sus cuatro instancias. Lint backend: primera pasada señaló dos lecturas sin tipo del JSON en el test; corregidas, segunda pasada `exit=0` antes del commit.

R2 verde: Jest enfocado dispatcher → `exit=0`, 6/6 tests; lint backend → `exit=0`.

R3 rojo: Jest `--runTestsByPath` enfocado → `exit=1`, 11 fallos por aserción y 23 verdes (34 total): 7 filas, los 2 `it` de #125 R3, `renders alert choices…` y fila 1 de `#123 R4`. Candados movidos aquí: dos estados accesibles, los dos literales del día 25→28 solo en `posts the exact…`, y sexta columna `aviso` de #123 R4.

R3 verde: Jest enfocado → `exit=0`, 34/34; typecheck móvil `exit=0`, lint móvil `exit=0`.

R4 rojo: Jest enfocado → `exit=1`, los 3 `it` nuevos fallan por aserción; los 34 anteriores siguen verdes (37 total). La pantalla conserva el reloj del montaje en chips y Guardar.

R4 verde: Jest enfocado → `exit=0`, 37/37; typecheck móvil `exit=0`, lint móvil `exit=0`.

En curso: R1 → R2 → R3 → R4.

## Sondas

Todas las sondas mutaron un solo fichero de producción de forma temporal, ejecutaron el Jest enfocado y restauraron el contenido original; `git diff --exit-code -- <fichero>` dio `0` después de **cada** una. Los rojos observados coinciden con las tablas de `requirements.md`.

| Backend R1 | Rojo observado (filas) | Tabla |
|---|---|---|
| M1, host UTC | 4: 1, 2, 3, 5 | igual |
| M1, host America/Mexico_City | 4: 4, 5, 6, 7 | igual |
| M2 | 5: 2, 3, 5, 6, 7 | igual |
| M3 | 1: 5 | igual |
| M4 | 7: 1–7 | igual |
| M5 | 3: 2, 3, 5 | igual |
| M6 | 2: 6, 7 | igual; `RangeError` |
| M7 | 4: 2, 3, 6, 7 | igual |
| Techo fallback a zona del host, host UTC | 0, verde | igual; se cierra con grep de `'UTC'` |
| Techo fallback a zona del host, host America/Mexico_City | 2: 6, 7 | igual |

| Backend R2 | Rojo observado | Tabla |
|---|---|---|
| D1 | 3: R6, R2 dos zonas, R2 lectura fallida | igual |
| D2 | 2: R2 dos zonas y lectura fallida | igual |
| D3 | 1: R2 lectura fallida | igual |
| D4 | 1: R2 dos zonas | igual |
| D5 | 1: R2 lectura fallida | igual |

| Móvil | Rojo observado | Tabla |
|---|---|---|
| MU1 | 8: R3 F1/F5/F6/F7/P, R4 tres | igual |
| MU2 | 1: R3 P | igual |
| MU3 | 4: R3 P/S, `renders alert…`, `posts the exact…` | igual |
| MU5 | 10: R3 F1/F3–F7/P/S, R4 hora/fecha | igual |
| MU6 | 1: R3 S | igual |
| MU8 | 7: R3 F1/F3–F6, #123 R4 fila 1, R4 Guardar | igual |
| MU9 | 12: R3 F1–F3/F5/S, R4 tres, `renders alert…`, `posts the exact…`, #123 R4 filas 2/3 | igual |
| MU10 | 12: R3 F1–F3/F5/P/S, R4 tres, `posts the exact…`, #123 R4 filas 2/3 | igual |
| MU11 | 1: R3 F7 | igual |
| MU16 | 12: R3 F1–F7/P/S, R4 tres | igual |
| MU12 | 1: R4 hora | igual |
| MU13 | 1: R4 fecha | igual |
| MU14 | 1: R4 Guardar | igual |
| MU15 | 1: R4 Guardar | igual |

## Cierre

- `pnpm -C backend-pet-tracker exec jest src/modules/reminders; echo "exit=$?"` → 7 suites / 57 tests, `exit=0`.
- `pnpm -C backend-pet-tracker test; echo "exit=$?"` → 171 suites / 1307 tests, `exit=0`.
- `pnpm -C backend-pet-tracker exec tsc --noEmit; echo "exit=$?"` → `exit=0`; `pnpm -C backend-pet-tracker run lint; echo "exit=$?"` → `exit=0`, sin diff de lint.
- `bunx jest --runTestsByPath src/screens/add-reminder/index.test.tsx; echo "exit=$?"` → 37 tests, `exit=0`.
- `bun run --cwd mobile-pet-tracker test; echo "exit=$?"` → 83 suites / 1503 tests, `exit=0`. No apareció el fallo conocido aislado de map.
- `test ! -e mobile-pet-tracker/.expo/types/router.d.ts` → `exit=0` antes y después del typecheck; `bun run --cwd mobile-pet-tracker typecheck; echo "exit=$?"` → `exit=0`; `bun run --cwd mobile-pet-tracker lint; echo "exit=$?"` → `exit=0`.
- Greps backend en el orden de `tasks.md` §Cierre: `'UTC'` = 1, `formatToParts` = 1, `\.format(` = 0, `hourCycle: 'h23'` = 1, `isSupportedTimeZone` = 2, `findOwnerTimezone(reminder.petId)` = 1, `reminderPushBody(` = 1, `Recordatorio` en dispatcher = 0. Los dos `grep -c` con 0 devuelven `exit=1` por semántica de grep; el recuento es el esperado.
- Greps móvil en el orden de `tasks.md` §Cierre: `useState(Date.now)` = 1, `setNow(Date.now())` = 2, `Date.now()` = 4, `disabled={disabled}` = 1, `opacity-50` = 1, `60_000` = 1, `accessibilityState={{ selected }}` = 2; todos `exit=0`.
- `git diff --stat origin/main...HEAD -- backend-pet-tracker mobile-pet-tracker` → exactamente seis ficheros de código de `design.md` §Archivos afectados; 380 inserciones, 18 eliminaciones. Sin package/lockfile/catálogo/módulos/puertos/repositorios/migraciones/e2e. Antes del commit final, `git status --short` solo mostraba este reporte nuevo.
- `./init.sh` y e2e no ejecutados aquí por el entorno compartido, conforme al handoff. R5 queda para smoke y firma humana; su casilla sigue vacía. No se hizo push ni se abrió PR.

## Commits TDD (rojo → verde)

| Requisito | Rojo | Verde |
|---|---|---|
| R1 | `459013a8` — `test(reminders): format the push body with the owner-zone due date (R1)` | `2c0bcb42` — `feat(reminders): format the reminder push body in the owner time zone (R1)` |
| R2 | `123b4c4f` — `test(reminders): dispatch the due date in the owner zone (R2)` | `241ecf96` — `feat(reminders): read the owner time zone when dispatching reminders (R2)` |
| R3 | `ab4e9a58` — `test(add-reminder): disable advance chips whose moment already passed (R3)` | `6fedbc87` — `feat(add-reminder): disable past advance chips and fall back to the largest future one (R3)` |
| R4 | `ec96b49b` — `test(add-reminder): re-evaluate chips on date or time change and on save (R4)` | `b10b7f1e` — `feat(add-reminder): refresh the evaluation instant on change and on save (R4)` |

Commit final: `docs(reminders): fill #125 traceability` (es el commit que contiene este reporte; consultar su hash con `git log -1`).
