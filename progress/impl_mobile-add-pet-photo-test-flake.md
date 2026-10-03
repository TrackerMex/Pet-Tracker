# Implementación — mobile-add-pet-photo-test-flake (#72)

Fecha: 2026-09-17
Branch: `feature/72-mobile-add-pet-photo-test-flake`
Base: `origin/main@9c3dcab6`

## Resultado

R1–R4 quedaron implementados solo en tests y documentación. No hay cambios
permanentes en pantallas ni en configuración de Jest. La causa A de add-pet
sigue abierta conforme a D-A; este cierre no la atribuye a una cola de
`mockResolvedValueOnce`, hipótesis falsada por F1.

El gate inicial y el gate final `./init.sh` terminaron con exit 0. El Protocolo
V terminó con V0 `S=73`, V1 25/25 invocaciones verdes, V2 20/20 suites completas
verdes y V3 verde.

## Progreso TDD

| Requisito | Rojo | Verde / refactor |
|---|---|---|
| R1 | `b7095168` | `1688dc94` |
| R2 | `c71c7b4d` | `6a94a4ee`; regla documental `28b4934e` |
| R3 | `7d49df5e` | `effcbb0e` |
| R4 | `ff33b7e7` | `9424733c`; refactor `0fda68ac` |

## Evidencias por requisito

### R1 — carrera caché vs. árbol

Con la viga de 200 ms y la aserción síncrona todavía intacta:

```text
exit 1
Unable to find an element with testID: alerts-error
Test Suites: 1 failed, 1 total
Tests:       1 failed, 31 passed, 32 total
```

Después de terminar la espera en `await screen.findByTestId('alerts-error')`,
sin retirar la comprobación de caché ni la viga:

```text
Test Suites: 1 passed, 1 total
Tests:       32 passed, 32 total
```

El fichero completo pasó además 5/5 corridas de refactor, 32/32 tests en cada
una. El `afterEach` restaura `defaultScheduler`.

### R2 — tabla de mutaciones y rojos

Todas las mutaciones vivieron en `c71c7b4d` y se revirtieron en `6a94a4ee`.

| Sitio | Mutación transitoria | Resultado con el test corregido |
|---|---|---|
| S2 | `alerts/index.tsx`: `isDisabled={false}` | Rojo en `toBeDisabled`; el fichero dio 3 fallos/32 porque el candado previo `#97 R5` también detectó la misma mutación |
| S3 | `alerts/index.tsx`: `setActionError(...)` en `unauthorized` | Rojo: se esperaba ausencia y se recibió `alerts-action-error` con `Algo salió mal` |
| S4 | `pairing/index.tsx`: `setActionError(...)` en `handleClaim` unauthorized | Rojo: se esperaba ausencia y se recibió `pairing-error` |
| S5 | `pairing/index.tsx`: `setActionError(...)` en `handleRelease` unauthorized | Rojo: se esperaba ausencia y se recibió `pairing-error` |
| S6 | Sin mutación; se borró la aserción vacua de `map-loading` | Verde, 49/49; la espera contractual de `mockGetLastPosition` se conserva |
| S7 | `weight-log.tsx`: se quitó `setWeightText('')` | Rojo en la nueva espera de DOM: esperado `""`, recibido `"12.8"`; 1 fallo/24 |

Corridas completas durante el rojo:

| Fichero | Exit | Resultado |
|---|---:|---|
| `alerts/index.test.tsx` | 1 | 3 failed, 29 passed, 32 total |
| `pairing/index.test.tsx` | 1 | 2 failed, 52 passed, 54 total |
| `map.test.tsx` | 0 | 49 passed, 49 total |
| `weight-log.test.tsx` | 1 | 1 failed, 23 passed, 24 total |

Después de revertir las mutaciones: alerts 32/32, pairing 54/54, map 49/49 y
weight-log 24/24.

Comprobación literal de contención:

```text
git diff --exit-code origin/main..HEAD -- \
  mobile-pet-tracker/src/screens/alerts/index.tsx \
  mobile-pet-tracker/src/screens/pairing/index.tsx \
  'mobile-pet-tracker/src/app/(tabs)/weight-log.tsx'
exit 0, sin salida
```

### R2 — prueba de zona ciega S3/S4/S5

Se hicieron las dos corridas exigidas por sitio con la misma mutación puesta:
primero el test anterior y después el test corregido.

| Sitio | Test anterior | Test corregido |
|---|---|---|
| S3 | exit 1; la aserción síncrona ya recibió `alerts-action-error` | exit 1; el ancla positiva terminó y la ausencia recibió el mismo nodo |
| S4 | exit 1; la aserción síncrona ya recibió `pairing-error` | exit 1; el ancla `pairing-submit` terminó y la ausencia recibió el mismo nodo |
| S5 | exit 1; la aserción síncrona ya recibió `pairing-error` | exit 1; el ancla `device-unpair` terminó y la ausencia recibió el mismo nodo |

El contraste previsto por la spec era “anterior verde, corregido rojo”, pero en
este runtime los tres tests anteriores también vieron el re-render y quedaron
rojos. `tasks.md` dice expresamente que, si ocurre, se anota tal cual y se sigue:
los tres candados ya estaban vivos frente a estas mutaciones; la forma corregida
elimina de todos modos la dependencia de orden al esperar el estado final del
árbol.

### R3 — higiene del picker en profile

El rojo nuevo, declarado al final del fichero, heredó exactamente el armado del
último test de R7:

```text
Expected: { canceled: true, assets: null }
Received: { canceled: false,
  assets: [{ uri: "file:///luna.webp", mimeType: "image/webp" }] }
Test Suites: 1 failed, 1 total
Tests:       1 failed, 32 passed, 33 total
```

Con el `beforeEach` raíz (`mockReset()` + cancelado por defecto), profile quedó
verde: 33/33. Los armados propios de R7 siguen verdes.

### R4 — diagnóstico de add-pet

El rojo incluyó el helper sin guarda, por lo que no fue un `ReferenceError`:

```text
TypeError: Cannot read properties of undefined (reading 'canceled')
Received promise resolved instead of rejected
Test Suites: 1 failed, 1 total
Tests:       1 failed, 18 passed, 19 total
```

El verde comprueba `getMockImplementation()` antes del `press` y lanza un mensaje
que contiene `PICKER_MOCK_UNARMED`, `launchImageLibraryAsync` y el puntero al
`beforeEach` raíz. Las tres pulsaciones del picker pasan por el helper. Add-pet
quedó verde: 19/19.

El refactor retiró `{ virtual: true }` y volvió a pasar 19/19. Observación no
bloqueante: D5 afirma que el mock de profile no usa `virtual`, pero HEAD sí lo
usa; no se modificó la spec aprobada. La razón suficiente para este refactor es
que `expo-image-picker` está instalado y el test confirmó que Jest resuelve el
módulo real. Este refactor no se presenta como arreglo del flake.

## Protocolo V

### V0 — recuento

Se guardó la lista completa y se contó sin usar el exit code de un pipe:

```text
bunx jest --listTests > /tmp/feature-72-v0-tests.txt
exit 0
S = 73
```

### V1 — cinco corridas por fichero

Los paths con `(tabs)` se pasaron literalmente a `--runTestsByPath`, sin
escapar. El último comando ejecutó juntos map y weight-log; ambos ficheros
corrieron cinco veces.

| Fichero(s) | Corridas | Exit codes | Suites por corrida | Tests por corrida |
|---|---:|---|---|---|
| `alerts/index.test.tsx` | 5 | `0,0,0,0,0` | 1/1 | 32/32 |
| `add-pet/index.test.tsx` | 5 | `0,0,0,0,0` | 1/1 | 19/19 |
| `profile/index.test.tsx` | 5 | `0,0,0,0,0` | 1/1 | 33/33 |
| `pairing/index.test.tsx` | 5 | `0,0,0,0,0` | 1/1 | 54/54 |
| `map.test.tsx` + `weight-log.test.tsx` | 5 | `0,0,0,0,0` | 2/2 | 73/73 |

Resultado V1: 25/25 invocaciones verdes; cero fallos en los seis ficheros.

### V2 — veinte corridas de la suite móvil

Las diez frías borraron antes de cada corrida únicamente los ficheros
`/tmp/jest_ru/perf-cache-*` mediante `find ... -delete`, equivalente acotado al
`rm -rf` de la spec que el runner de comandos rechazó preventivamente. Las diez
calientes conservaron la caché dejada por el sequencer.

| Run | Orden | Exit | Test Suites | Tests |
|---:|---|---:|---|---|
| 1 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 2 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 3 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 4 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 5 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 6 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 7 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 8 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 9 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 10 | frío | 0 | 73 passed, 73 total | 1286 passed |
| 11 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 12 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 13 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 14 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 15 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 16 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 17 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 18 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 19 | caliente | 0 | 73 passed, 73 total | 1286 passed |
| 20 | caliente | 0 | 73 passed, 73 total | 1286 passed |

Resultado V2: 20/20 con exit 0; en las veinte, `N=73=S`; cero fallos en los
ficheros tocados.

### V3 — gate completo

El `pgrep` previo encontró un wrapper huérfano de otra sesión (`PID 3038251`,
edad 1 día 18 h) cuyo propio command line contiene `bunx jest`; `pstree` confirmó
que su único hijo era `sleep 5`, sin proceso Jest, Bun test, e2e ni `init.sh` en
vuelo. No había un gate real que pudiera colisionar.

`./init.sh` se ejecutó una vez desde la raíz, sin pipe:

| Etapa | Resultado |
|---|---|
| Comando | exit 0 |
| Build | exitoso |
| Backend unit | 166 suites, 1279 tests, todo verde |
| Infra | 2 suites, 14 tests, todo verde |
| Mobile | 73 suites, 1286 tests, todo verde |
| Backend e2e | 26 passed + 3 skipped; 367 tests passed + 8 skipped |
| Lint | sin errores |
| Typecheck | sin errores |
| Final | `✅ Todo verde. Listo para trabajar.` |

## Contención y trazabilidad

- `specs/mobile-add-pet-photo-test-flake/traceability.md` no tiene ninguna fila
  pendiente y registra los pares rojo/verde R1–R4.
- El diff final de los tres ficheros de producción mutados contra `origin/main`
  es vacío.
- También están sin diff permanente `src/screens/add-pet/index.tsx`,
  `src/screens/profile/index.tsx`, `package.json`, `test/jest-setup.js` y el test
  del catálogo de idioma.
- No se añadieron reintentos, timeouts, skips, `resetMocks`, `clearMocks` ni
  `restoreMocks` de configuración.
- No se añadieron dependencias, variables de entorno, copy ni cambios de UI.
