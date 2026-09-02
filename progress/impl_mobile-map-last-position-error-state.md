# Implementación — mobile-map-last-position-error-state (#56)

## Estado

R1–R5 implementados y verificados. La feature queda lista para el `reviewer`;
permanece `in_progress`, no se ha hecho push y no hay gate de smoke humano.
El bloqueo inicial quedó resuelto por la autorización del leader en `ae13c31`.

## Preparación verificada — 2026-09-02

- Branch activa: `feature/56-mobile-map-last-position-error-state`, al día con
  `origin/feature/56-mobile-map-last-position-error-state`.
- `./init.sh` desde la raíz: exit `0`, `✅ Todo verde. Listo para trabajar.`
- La aprobación humana de `requirements.md` está marcada y #56 es la única
  feature `in_progress`.
- `codex plugin update expo` no está disponible en la CLI instalada
  (`unrecognized subcommand 'update'`). El caché tampoco contiene
  `expo-overview`; se cargó `expo:building-native-ui` v1.0.1 como desviación,
  además de `appllama-app-design-skill`, con `docs/ui-guidelines.md` como
  autoridad de estilos.
- Se leyó la documentación oficial versionada de Expo SDK 57 en
  `https://docs.expo.dev/versions/v57.0.0/`.

## Incidencia resuelta — comando objetivo de Jest

El comando literal exigido por `requirements.md` R5 y `tasks.md` no selecciona
el archivo. Jest interpreta el argumento posicional como una expresión regular,
por lo que `(tabs)` agrupa `tabs` en vez de coincidir con los paréntesis del
nombre real del directorio.

Comando ejecutado desde `mobile-pet-tracker/`:

```text
bun run test -- 'src/app/(tabs)/__tests__/map.test.tsx' --runInBand
```

Salida completa:

```text
$ jest "src/app/(tabs)/__tests__/map.test.tsx" --runInBand
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /home/claude/sites/Pet-Tracker/mobile-pet-tracker
  123 files checked.
  testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 51 matches
  testPathIgnorePatterns: /node_modules/ - 123 matches
  testRegex:  - 0 matches
Pattern: src/app/(tabs)/__tests__/map.test.tsx - 0 matches
error: script "test" exited with code 1
```

Exit code: `1`.

Los reportes anteriores del mismo archivo documentan el comando con los
paréntesis escapados y 32/32 tests verdes, por ejemplo
`progress/review_android-map-never-ready_fix1.md`:

```text
bun run test -- 'src/app/\(tabs\)/__tests__/map.test.tsx' --runInBand
```

Otra forma válida de evitar la interpretación regex habría sido añadir
`--runTestsByPath`. No se eligió una de forma unilateral: el leader autorizó
en `ae13c31` la primera forma, con los paréntesis escapados, para todos los
sitios donde la spec cita el comando. La spec aprobada no se editó.

## Paso 1 — cobertura roja R1–R4

Línea base con el comando corregido: 1 suite, 32/32 tests verdes.

Se añadieron cuatro `describe` con sufijo
`(mobile-map-last-position-error-state)` y siete bloques `it`; el `it.each` de
R3 ejecuta dos estados, por lo que Jest suma ocho casos nuevos. El diff del
archivo de test fue estrictamente aditivo:

```text
152	0	mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx
```

Comando rojo ejecutado desde `mobile-pet-tracker/` antes de escribir
producción:

```text
bun run test -- 'src/app/\(tabs\)/__tests__/map.test.tsx' --runInBand
```

Salida roja:

```text
FAIL src/app/(tabs)/__tests__/map.test.tsx (11.632 s)
  R4: map resuelve la mascota seleccionada
    ✓ shows loading while the pet list is pending
    ✓ R8 (mobile-design-drift): reserva el mapa completo con Skeleton
    ✓ selects the first pet and loads its first position
    ✓ replaces a selection that is absent from the pet list
    ✓ shows the no-pets state without mounting a map
    ✓ shows and retries pet-list state error
    ✓ shows and retries pet-list state unreachable
    ✓ shows and retries pet-list state missing-config
  R5: mascota free degrada sin mapa
    ✓ shows the collar requirement without map, stats, lost mode, or polling
  R6: mapa y marker con la última posición
    ✓ R8 (android-map-never-ready): el contenedor del mapa no declara fondo opaco
    ✓ R3 (android-map-never-ready): centra el mapa y pasa la última posición como marker
    ✓ R3 (android-map-never-ready): usa el centro por defecto y ningún marker sin posición
    ✓ R7 (mobile-design-drift): posiciona el overlay bajo el safe area
  R7 (mobile-figma-polish): mapa adapta su base al tema
    ✓ R4 (android-map-never-ready): pasa LIGHT en tema claro
    ✓ R4 (android-map-never-ready): pasa DARK en tema oscuro
  R7: ruta del día como polylines
    ✓ R3 (android-map-never-ready): pasa una polyline mapeada por cada viaje
    ✓ R3 (android-map-never-ready): pasa un array vacío para un día sin viajes
    ✓ R3 (android-map-never-ready): conserva marker y stats con ruta error
    ✓ R3 (android-map-never-ready): conserva marker y stats con ruta unreachable
  R8: stats calculadas de positions y trips
    ✓ uses the latest speed, trip total, fresh age, and live GPS
    ✓ shows stale GPS, empty metric fallbacks, and zero trip distance
    ✓ uses the last item even when its speed is null
    ✓ formats age 3599 seconds as 59m ago
    ✓ formats age 3600 seconds as 1h ago
    ✓ formats age 7500 seconds as 2h ago
    ✓ shows no signal and no age when the collar has never reported
  R9: polling con foco
    ✓ polls position APIs every 15 seconds, preserves data, and cleans up
  R6: owner toglea lost mode contra el endpoint
    ✓ shows the owner action for lostMode=false
    ✓ shows the owner action for lostMode=true
    ✓ posts the inverse, disables in flight, and refetches the new label
  R7: no-owner deshabilitado y error visible
    ✓ keeps the family action visible and disabled without calling the API
    ✓ shows a failure, re-enables, and clears the error on retry
  R1 (mobile-map-last-position-error-state): rama de error de last
    ✕ muestra mensaje y Retry cuando last devuelve error
      Unable to find an element with testID: map-last-error
    ✕ Retry llama al refetch de last y recupera el mapa
      Unable to find an element with testID: map-last-retry
    ✕ la rama pinta bg-background y screen-map sigue sin fondo
      Unable to find an element with testID: map-last-error-state
  R2 (mobile-map-last-position-error-state): unauthorized de last
    ✕ comparte la rama de error y dispara el signOut de sesión expirada
      Unable to find an element with testID: map-last-error
  R3 (mobile-map-last-position-error-state): cobertura total y exclusión mutua
    ✕ muestra la rama de error y reintenta con unreachable
      Unable to find an element with testID: map-last-retry
    ✕ muestra la rama de error y reintenta con missing-config
      Unable to find an element with testID: map-last-retry
    ✕ solo la rama de error de pets renderiza cuando pets cae con last resuelto
      Expected map-view to be null; received the retained native map view
  R4 (mobile-map-last-position-error-state): unauthorized de pets
    ✕ renderiza la rama de error de pets y dispara signOut
      Unable to find an element with testID: map-error

Test Suites: 1 failed, 1 total
Tests:       8 failed, 32 passed, 40 total
Snapshots:   0 total
Time:        11.819 s
Ran all test suites matching /src\/app\/\(tabs\)\/__tests__\/map.test.tsx/i.
error: script "test" exited with code 1
```

Exit code esperado: `1`. Los 32 tests heredados permanecieron verdes y los
ocho fallos corresponden exclusivamente al contrato nuevo.

Commit de tests rojos:

```text
83a1602 test(map): red coverage for last position error kinds (R1-R4)
```

## Paso 2 — implementación verde R1–R4

Commit de producción:

```text
dbde188 fix(map): render error branch for last position kinds (R1-R4)
```

El único diff de producción está en `src/app/(tabs)/map.tsx` y contiene:

- `isPetsError(state: PetsState): boolean` como switch exhaustivo, sin
  `default`, incluyendo `unauthorized`;
- `isLastError(state: LastPositionState): boolean` como switch exhaustivo,
  sin `default`, repartiendo los seis kinds;
- `petsReady` como gate común de B4, B5 y B6;
- la rama B5 literal de D5, con fondo propio `bg-background`, mensaje
  seleccionable y Retry conectado a `refetchLast`;
- ningún fondo añadido a `screen-map` ni a otro ancestro de `PetMap`.

No hubo refactor posterior: D3–D5 ya producen el cambio mínimo.

## Verificación R5

### Suite dirigida final

Comando desde `mobile-pet-tracker/`:

```text
bun run test -- 'src/app/\(tabs\)/__tests__/map.test.tsx' --runInBand
```

Salida de Jest (se conservan todos los casos y el resumen; los mensajes
informativos repetitivos de HeroUI Native y los avisos `act(...)` ya presentes
en la línea base no afectan el exit code):

```text
PASS src/app/(tabs)/__tests__/map.test.tsx
  R4: map resuelve la mascota seleccionada
    ✓ shows loading while the pet list is pending
    ✓ R8 (mobile-design-drift): reserva el mapa completo con Skeleton
    ✓ selects the first pet and loads its first position
    ✓ replaces a selection that is absent from the pet list
    ✓ shows the no-pets state without mounting a map
    ✓ shows and retries pet-list state error
    ✓ shows and retries pet-list state unreachable
    ✓ shows and retries pet-list state missing-config
  R5: mascota free degrada sin mapa
    ✓ shows the collar requirement without map, stats, lost mode, or polling
  R6: mapa y marker con la última posición
    ✓ R8 (android-map-never-ready): el contenedor del mapa no declara fondo opaco
    ✓ R3 (android-map-never-ready): centra el mapa y pasa la última posición como marker
    ✓ R3 (android-map-never-ready): usa el centro por defecto y ningún marker sin posición
    ✓ R7 (mobile-design-drift): posiciona el overlay bajo el safe area
  R7 (mobile-figma-polish): mapa adapta su base al tema
    ✓ R4 (android-map-never-ready): pasa LIGHT en tema claro
    ✓ R4 (android-map-never-ready): pasa DARK en tema oscuro
  R7: ruta del día como polylines
    ✓ R3 (android-map-never-ready): pasa una polyline mapeada por cada viaje
    ✓ R3 (android-map-never-ready): pasa un array vacío para un día sin viajes
    ✓ R3 (android-map-never-ready): conserva marker y stats con ruta error
    ✓ R3 (android-map-never-ready): conserva marker y stats con ruta unreachable
  R8: stats calculadas de positions y trips
    ✓ uses the latest speed, trip total, fresh age, and live GPS
    ✓ shows stale GPS, empty metric fallbacks, and zero trip distance
    ✓ uses the last item even when its speed is null
    ✓ formats age 3599 seconds as 59m ago
    ✓ formats age 3600 seconds as 1h ago
    ✓ formats age 7500 seconds as 2h ago
    ✓ shows no signal and no age when the collar has never reported
  R9: polling con foco
    ✓ polls position APIs every 15 seconds, preserves data, and cleans up
  R6: owner toglea lost mode contra el endpoint
    ✓ shows the owner action for lostMode=false
    ✓ shows the owner action for lostMode=true
    ✓ posts the inverse, disables in flight, and refetches the new label
  R7: no-owner deshabilitado y error visible
    ✓ keeps the family action visible and disabled without calling the API
    ✓ shows a failure, re-enables, and clears the error on retry
  R1 (mobile-map-last-position-error-state): rama de error de last
    ✓ muestra mensaje y Retry cuando last devuelve error
    ✓ Retry llama al refetch de last y recupera el mapa
    ✓ la rama pinta bg-background y screen-map sigue sin fondo
  R2 (mobile-map-last-position-error-state): unauthorized de last
    ✓ comparte la rama de error y dispara el signOut de sesión expirada
  R3 (mobile-map-last-position-error-state): cobertura total y exclusión mutua
    ✓ muestra la rama de error y reintenta con unreachable
    ✓ muestra la rama de error y reintenta con missing-config
    ✓ solo la rama de error de pets renderiza cuando pets cae con last resuelto
  R4 (mobile-map-last-position-error-state): unauthorized de pets
    ✓ renderiza la rama de error de pets y dispara signOut

Test Suites: 1 passed, 1 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        4.779 s
Ran all test suites matching /src\/app\/\(tabs\)\/__tests__\/map.test.tsx/i.
```

Exit code: `0`.

### Typecheck

Comando desde `mobile-pet-tracker/`:

```text
bun run typecheck
```

Salida completa:

```text
$ tsc --noEmit
```

Exit code: `0`. Este verde valida los dos switches exhaustivos con retorno
anotado `: boolean` y sin `default`.

### Lint

Comando desde `mobile-pet-tracker/`:

```text
bun run lint
```

Salida completa:

```text
$ expo lint
```

Exit code: `0`.

### `./init.sh` desde la raíz

Comando:

```text
./init.sh
```

La primera corrida final terminó con exit `1` únicamente por el flake
preexistente #53 en
`src/screens/add-pet/index.test.tsx::R7: foto opcional tras alta::uploads a
chosen preview only after createPet succeeds`: el mock de ImagePicker devolvió
`undefined`. La suite de Map pasó y el cierre móvil fue:

```text
Test Suites: 1 failed, 50 passed, 51 total
Tests:       1 failed, 577 passed, 578 total
Snapshots:   1 passed, 1 total
```

No se tocó ese archivo, que está fuera de la allowlist. La reproducción
dirigida inmediata quedó verde sin cambios:

```text
$ jest "src/screens/add-pet/index.test.tsx" --runInBand
PASS src/screens/add-pet/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
```

Exit code: `0`.

Se repitió `./init.sh` completo. Los cierres de todas sus fases fueron:

```text
Test Suites: 158 passed, 158 total
Tests:       1210 passed, 1210 total
✅ Tests pasados

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
✅ Tests pasados

TAP version 13
1..28
# tests 28
# pass 28
# fail 0

Test Suites: 51 passed, 51 total
Tests:       578 passed, 578 total
Snapshots:   1 passed, 1 total
✅ Tests pasados

Test Suites: 3 skipped, 23 passed, 23 of 26 total
Tests:       8 skipped, 349 passed, 357 total
Snapshots:   0 total
✅ Tests e2e pasados

✅ Lint sin errores
$ tsc --noEmit
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 52/57 completadas | 4 pendientes

  Próxima feature:
  [#18] nutrition-ai-explainer (P3)
```

Exit code final: `0`. Los avisos repetitivos de soporte futuro de Node 20 en
AWS SDK y el error Drizzle provocado por un caso e2e negativo son salida
esperada de suites verdes; no alteran los resúmenes ni el exit code.

### Contención, §10 y grep-clean

Comprobaciones contra el punto exacto entregado por el leader (`ae13c31`):

| Comando / comprobación | Exit | Resultado |
|---|---:|---|
| `git diff --check ae13c31` | 0 | Sin salida; no hay errores de whitespace. |
| diff de `pet-map.tsx`, `use-api.ts`, `auth-provider.tsx`, `(tabs)/_layout.tsx`, `src/api/`, `package.json`, `bun.lock`, `progress/current.md` y `feature_list.json` | 0 | Sin salida; cero líneas del implementer en todos los archivos prohibidos. |
| `git diff --numstat ae13c31 -- 'mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx'` | 0 | `152  0`; el test compartido contiene solo adiciones. |
| grep sobre líneas añadidas de Map/test para hex, `className` arbitrario `[...]` o `StyleSheet.create` | 1 esperado | Sin salida; grep-clean. |
| inspección de `screen-map` + test R1 | 0 | `screen-map` conserva exactamente `className="flex-1"`; solo B5 pinta su `bg-background`. |
| `bun run typecheck` + lectura de helpers | 0 | `isPetsError` e `isLastError` son switches exhaustivos sin `default`. |

Delta del implementer tras el commit documental (`ae13c31...HEAD`):

```text
 .../src/app/(tabs)/__tests__/map.test.tsx          | 152 +++++++
 mobile-pet-tracker/src/app/(tabs)/map.tsx          |  53 ++-
 .../impl_mobile-map-last-position-error-state.md   | 457 +++++++++++++++++++++
 .../mobile-map-last-position-error-state/tasks.md  |  12 +-
 .../traceability.md                                |  10 +-
 5 files changed, 665 insertions(+), 19 deletions(-)
```

Son los dos archivos de código/test permitidos, `tasks.md`,
`traceability.md` y este reporte; ninguna otra ruta fue modificada por esta
sesión.

### `git diff --stat main...HEAD` y baseline heredado

La salida literal final pedida por R5 es:

```text
 feature_list.json                                  |   2 +-
 .../src/app/(tabs)/__tests__/map.test.tsx          | 152 +++++++
 mobile-pet-tracker/src/app/(tabs)/map.tsx          |  53 ++-
 progress/current.md                                |  39 ++
 ...handoff_mobile-map-last-position-error-state.md |  79 ++++
 .../impl_mobile-map-last-position-error-state.md   | 457 +++++++++++++++++++++
 .../mobile-map-last-position-error-state/design.md | 217 ++++++++++
 .../requirements.md                                | 234 +++++++++++
 .../mobile-map-last-position-error-state/tasks.md  |  88 ++++
 .../traceability.md                                |  31 ++
 10 files changed, 1343 insertions(+), 9 deletions(-)
```

Ese diff completo no puede servir por sí solo para atribuir cambios al
implementer: antes del primer commit TDD, `main...ae13c31` ya contenía siete
rutas aportadas por los commits de spec/aprobación/handoff del leader:

```text
 feature_list.json                                  |   2 +-
 progress/current.md                                |  39 ++++
 ...handoff_mobile-map-last-position-error-state.md |  79 +++++++
 .../mobile-map-last-position-error-state/design.md | 217 +++++++++++++++++++
 .../requirements.md                                | 234 +++++++++++++++++++++
 .../mobile-map-last-position-error-state/tasks.md  |  88 ++++++++
 .../traceability.md                                |  31 +++
 7 files changed, 689 insertions(+), 1 deletion(-)
```

En particular, las 39 líneas de `progress/current.md` que el literal
`main...HEAD` muestra son preexistentes y pertenecen al leader; este handoff
prohibió editarlas y se conservaron byte-idénticas a `ae13c31`. Lo mismo
ocurre con `design.md`, `requirements.md` y el handoff, que necesariamente
existen en la rama para entregar la spec aprobada. Por eso la contención
atribuible se valida contra `ae13c31`, siguiendo el patrón de cierre usado en
#54: ese delta sí cumple la allowlist y prueba cero líneas en todas las rutas
prohibidas. No se reescribió historia ni se alteró la spec para maquillar la
salida completa de la rama.

### Estado de cierre

- R1–R4: verdes en 40/40 casos dirigidos.
- R5: comandos ejecutados, trazabilidad completa y contención del delta del
  implementer verificada.
- Smoke humano: no requerido por la spec aprobada (cambio solo-JS).
- Branch: sin push; queda lista para que el leader lance el `reviewer`.
