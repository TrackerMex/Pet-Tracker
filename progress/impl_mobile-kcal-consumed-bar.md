# Implementación #113 — mobile-kcal-consumed-bar

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-backend`
- `git branch --show-current`: `feature/113-mobile-kcal-consumed-bar`
- `git merge-base --is-ancestor a833f153 HEAD`: `exit=0`; #95 está en la base.
- Skills cargadas: `expo:building-native-ui` y `ponytail:ponytail` (modo full). Ninguna otra skill de Expo.
- Spec aprobada: firma humana de 2026-09-23, commit `e4a4841e`. Leídos completos `requirements.md`, `design.md`, `tasks.md` y `traceability.md`.
- `router.d.ts`: ausente; la herramienta rechazó `rm -f`, se comprobó y eliminó con `Path.unlink(missing_ok=True)`.
- Base medida: `food.test.tsx`: 1 suite, 38 tests verdes, `exit=0`.
- Candados medidos: `englishKeys`: `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 = 303`; `R6_FOOD`: `35 + 3 + 1 - 2 = 37`.
- Base de `./init.sh` medida por el leader en esta rama (`e4a4841e`): móvil 80 suites/1426 tests; backend unit 170/1298; infra 2/14; e2e 27 passed + 3 skipped de 30, 389 passed + 8 skipped; lint y typecheck backend, infra y móvil verdes.

## TDD y commits

- R1 rojo `c752795e`: `food` falló porque recibió `['generatedAt', 'servedToday']` frente a `['servedToday', 'kcalConsumedToday']`; Home falló con longitud 12 frente a 13. `2 failed, 177 passed`, 2 suites, `exit=1`.
- R1 verde `f4b0c388`: Food, Home y Meal Schedule: `3 suites, 201 tests passed, exit=0`; `bunx tsc --noEmit`: `exit=0`.
- R1 sondas: `kcalConsumedToday?: number` y `kcalConsumedToday: number | null` dieron cada una `1 failed, 38 skipped`, `exit=1` en R1. Restauradas; `git diff --exit-code -- src/api/types.ts`: `diff_exit=0`.
- R2 rojo `a408be18`: suite Food completa con doble de Reanimated (`requireActual`, `__esModule`, solo `withTiming`/`withRepeat`/`withSequence`): `8 failed, 40 passed, 48 total`, `exit=1`. La anatomía recibió 1 hijo en vez de 2; los siete casos no encontraron `food-plan-consumed`. Los 38 tests de base y R1 quedaron verdes.
- R2 verde `5523cd29`: Food `1 suite, 48 tests passed, exit=0`; `tsc exit=0`.
- R2 sondas (`-t '#113 R2:'`): intercambiar textos, carril `/20`→`/30`, relleno `bg-accent-foreground`→`bg-accent`, quitar tabulares del porcentaje, guarda `> 0`→`>= 0`, derivar de franjas y quitar tile `ForkKnife`: cada una `1 failed, 8 passed, 39 skipped`, `exit=1`. `Math.round`→`Math.floor`: `2 failed` (1420/890 y 200/33), `7 passed, 39 skipped`, `exit=1`. Todas restauradas; `git diff --exit-code -- food.tsx`: `diff_exit=0`.
- R3 rojo `59220c29`: Food + LanguageProvider + UI language, `3 suites failed`, `5 failed, 80 passed`, `exit=1`. Dos casos recibieron `accessible=undefined`; clave `en` ausente; candados esperaban 304/38 y recibieron 303/37. Deltas escritos: claves `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 = 304`; Food `35 + 3 + 1 - 2 + 1 = 38`, título 38.
- R3 verde `40bfb708`: Food + LanguageProvider + UI language, `3 suites, 85 tests passed, exit=0`; `tsc exit=0`.
- R3 sondas (`-t '#113 R3:'`): rol `progressbar`→`text`, `now`+1, intercambiar `consumed`/`target`, quitar `accessible`: cada una `2 failed, 1 passed, 48 skipped`, `exit=1`. Restauradas; `git diff --exit-code -- food.tsx`: `diff_exit=0`.
- R4 rojo `a91b6af7`: Food completo `1 failed, 51 passed`, `exit=1`; config `withTiming(50)` recibida `undefined` frente a duración 250 y `ReduceMotion.System`. El primer intento dejó una respuesta `mockResolvedValueOnce` en cola al fallar pronto y puso rojo un test previo; se aisló con `afterEach(mockReset)` antes del commit, y el segundo rojo tuvo solo R4 fallando.
- R4 verde `cd2952e8`: Food `1 suite, 52 tests passed, exit=0`; `tsc exit=0`.
- R4 sondas (Food completo): duración 250→300, curva a `Easing.bezier(0.23, 1, 0.32, 1)`, `ReduceMotion.System`→`Never` y volver a `set(kcalPct)`: cada una `1 failed` (solo R4), `51 passed` (R2 incluido), `exit=1`. Restauradas; `git diff --exit-code -- food.tsx`: `diff_exit=0`.
- R5 rojo `a73390f7`: Food `2 failed` (nuevo R5 y candado de carga declarado), `51 passed`, `exit=1`; ambos recibieron `h-32` y esperaban `h-40`. El test literal de R5 incluye el prefijo real `skeleton__root` que HeroUI añade al `className` del host; sin ese prefijo la expectativa exacta de la spec no puede pasar aun con el tamaño correcto.
- R5 verde `82568138`: Food `1 suite, 53 tests passed, exit=0`.
- R5 sonda: `h-40`→`h-44`: Food `2 failed` (R5 y candado de carga), `51 passed`, `exit=1`. Restaurada; `git diff --exit-code -- food.tsx`: `diff_exit=0`.

## Verificación de cierre

Comandos de `design.md` §6 ejecutados desde `mobile-pet-tracker/`, sin pipe para Jest, typecheck ni lint:

| Comando | Salida final |
|---|---|
| `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'` | `Test Suites: 1 passed, 1 total`; `Tests: 53 passed, 53 total`; `exit=0` |
| `bunx jest --runTestsByPath` con los siete ficheros de §6 | `Test Suites: 7 passed, 7 total`; `Tests: 330 passed, 330 total`; `exit=0` |
| `bunx jest` | `Test Suites: 80 passed, 80 total`; `Tests: 1441 passed, 1441 total`; `Snapshots: 1 passed`; `exit=0` |
| `bunx tsc --noEmit` | `exit=0` |
| `bun run lint` | `$ expo lint`; `exit=0` |

Suite móvil: mismas 80 suites y `1426 + 15 = 1441` tests. Los siete ficheros pedidos imprimieron siete suites; Food imprimió una. Los avisos de Uniwind/HeroUI y `act(...)` en Jest no cambiaron el resultado.

Grep-clean de §6: hex, clases arbitrarias, `StyleSheet`/sombras y radios/opacidades vetados dieron salida vacía (`grep exit=1` en cada filtro). `git diff --name-only origin/main -- package.json bun.lock src/theme/` dio salida vacía. `git diff --check` dio salida vacía. Backend sin cambios.

Los diez hashes de R1-R5 de `traceability.md` siguen siendo ancestros de `HEAD` (`hashes_ancestor_exit=0`). Diff de implementación desde `12298582` limitado a los doce ficheros de `design.md` §4. R6 y su casilla siguen pendientes del humano. No se ejecutó `./init.sh`, no se hizo push ni se abrió PR.

Commits TDD (rojo → verde):

| R | Rojo | Verde |
|---|---|---|
| R1 | `c752795e` | `f4b0c388` |
| R2 | `a408be18` | `5523cd29` |
| R3 | `59220c29` | `40bfb708` |
| R4 | `a91b6af7` | `cd2952e8` |
| R5 | `a73390f7` | `82568138` |

## Ronda 2 — Enmienda E1, R7

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-backend`.
- `git branch --show-current`: `feature/113-mobile-kcal-consumed-bar`.
- Skills: `expo:building-native-ui` y `ponytail:ponytail` (modo full), ya cargadas en la ronda 1 y reutilizadas aquí; ninguna otra skill de Expo.
- Leídas completas las secciones §Enmienda E1 de `requirements.md` y `tasks.md`, y H1/§Sondas para la enmienda de H1 del review. Enmienda E1 firmada por humano en `9da4db78`.
- Base medida en esta rama: `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'` → `Test Suites: 1 passed, 1 total`, `Tests: 53 passed, 53 total`, `exit=0`.
- Base de `./init.sh` medida por el reviewer en `15e43269`: móvil 80 suites/1441 tests, `exit=0`; no se repite por infraestructura compartida.
- R7 rojo `2a1d1cff`: `bunx jest --silent --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'` → `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 53 passed, 55 total`; `exit=1`. Las dos filas de R7 fallaron por aserción: `Expected: {"width":"0%"}` / `Received: {"width":"0%","opacity":0.7}` y lo mismo para `63%`; `'opacity' should be undefined, but is 0.7`. El resto de Food permaneció verde.
- R7 verde `8dd65ed3`: Food `Test Suites: 1 passed, 1 total`; `Tests: 55 passed, 55 total`; `exit=0`. `git diff 15e43269 HEAD -- 'mobile-pet-tracker/src/app/(tabs)/food.tsx'` → salida vacía, `exit=0`: producción idéntica a la ronda 1.

### Sondas de R7

Cada sonda temporal corrió Food con `--runTestsByPath` y `-t '#113 R7:'`; se restauró inmediatamente y `git diff --exit-code -- food.tsx` devolvió `diff_exit=0` tras cada una.

| Mutación temporal | Rojo observado |
|---|---|
| M13: `style={{ opacity: 0.5 }}` en `food-plan-track` | `2 failed, 53 skipped`, `exit=1`; falló la aserción de `track.props.style` |
| M14: `backgroundColor: accent` en `kcalBarStyle` | `2 failed, 53 skipped`, `exit=1`; `'backgroundColor' should be undefined, but is "accent-strong"` |
| Relleno `style={[kcalBarStyle, { opacity: 0.7 }]}` | `2 failed, 53 skipped`, `exit=1`; `'opacity' should be undefined, but is 0.7` |
| Relleno `style={[{ opacity: 0.7 }, kcalBarStyle]}` | `2 failed, 53 skipped`, `exit=1`; misma clave extra `opacity` |
| Relleno `style={[kcalBarStyle, [{ opacity: 0.7 }]]}` | `2 failed, 53 skipped`, `exit=1`; misma clave extra `opacity` |
| `style={{ opacity: 0.5 }}` en `food-plan-progress` | `2 failed, 53 skipped`, `exit=1`; falló `progress.props.style` |
| `style={{ opacity: 0.5 }}` en la cabecera del progreso | `2 failed, 53 skipped`, `exit=1`; falló `header.props.style` |

El archivo `.expo/types/router.d.ts` estaba ausente (`router_dts_present=False`).

### Verificación de cierre de ronda 2

| Comando de `design.md` §6 | Salida final |
|---|---|
| `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'` | `Test Suites: 1 passed, 1 total`; `Tests: 55 passed, 55 total`; `exit=0` |
| `bunx jest --runTestsByPath` con los siete ficheros de §6 | `Test Suites: 7 passed, 7 total`; `Tests: 330 passed, 330 total`; `exit=0` |
| `bunx jest` | `Test Suites: 80 passed, 80 total`; `Tests: 1443 passed, 1443 total`; `Snapshots: 1 passed`; `exit=0` |
| `bunx tsc --noEmit` | `exit=0` |
| `bun run lint` | `$ expo lint`; `exit=0` |

Delta frente a la ronda 1: Food `53 + 2 = 55`; móvil `1441 + 2 = 1443`, mismas 80 suites. Grep-clean de §6 (hex, clases arbitrarias, `StyleSheet`/sombras, radios/opacidades vetados): cuatro salidas vacías (`grep exit=1`). `git diff --name-only origin/main -- package.json bun.lock src/theme/` vacío; `git diff --check` vacío. `git diff 15e43269 HEAD -- food.tsx` vacío (`exit=0`). Los diez hashes R1-R5 y los dos de R7 son ancestros de HEAD (`hashes_ancestor_exit=0`). La ronda solo deja diff en `food.test.tsx`, `traceability.md` y este reporte; `food.tsx` vuelve al byte de la ronda 1. R6 sigue pendiente del humano. No se ejecutaron `./init.sh` ni e2e, ni se hizo rebase, merge, push o PR.

Commits TDD de ronda 2: rojo `2a1d1cff` → verde `8dd65ed3`.
