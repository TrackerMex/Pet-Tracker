# Implementación #94 — mobile-map-staleness-single-source

Fecha: 2026-09-21

Estado: implementación y verificación automática terminadas. R8 sigue
pendiente del smoke humano en un dev build de Android; por eso #94 permanece
`in_progress` y no se marca `done`.

## Commits por requisito

| Requisito | Rojo | Verde / cierre |
|---|---|---|
| R1 | `d4f2b77f` — especifica la tabla compartida; 5 fallos por export ausente | `039ed167` — añade `MAP_CONNECTION_LABEL_KEY` con `{ labelKey }` |
| R2 | `2dcebb2a` — especifica el detalle, los cuatro estados y la quinta query canónica | `a83aae5c` — lee `device.connectivity`, elimina el umbral y aplica el primer delta de R9 |
| R3 | `7f4709bc` — versiona las pruebas y la mutación `?` para detalle pendiente/error | `2ea2ff9c` — restaura la caída correcta a `—` |
| R4 | `feeabb27` — muta `stat-updated` para derivarlo del detalle y observa el rojo | `83e6d554` — conserva `fmtAgo(position.staleSeconds, t)` |
| R5 | `cb6084e7` — sonda en `map.tsx`; `d6f28bec` — sonda en `device-connectivity.ts` | `bcdd65fa` — retira ambas mutaciones; el candado queda verde |
| R6 | `8986802d` — espera `Conexión` y ausencia de `GPS` | `8ca103e4` — usa `pairing.connection` y aplica el segundo delta de R9 |
| R7 | `d0ea8cb0` — demuestra que el badge no cambia tras 15 s | `9bc67e53` — suma `refetchDetail()` al intervalo existente |
| R8 | — | Pendiente del humano; no delegable a IA |
| R9 | Rojo real de los tests existentes de #65, sin commit rojo propio | `a83aae5c` + `8ca103e4` |

## Suites medidas sin pipe

- Baseline: 5 suites, 120 tests, exit 0.
- Gate dirigido final:
  `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/map.test.tsx' 'src/utils/device-connectivity.test.ts' 'src/__tests__/design-drift.test.ts' 'src/__tests__/ui-language.test.ts' 'src/__tests__/ui-copy-table.ts' --silent`
  → 5 suites, 136 tests, exit 0.
- Suite móvil completa: `bunx jest --silent`
  → 77 suites, 1366 tests, 1 snapshot, exit 0 (102.509 s).
- Typecheck: `bunx tsc --noEmit` → exit 0, sin salida.
- `./init.sh` no se ejecutó: estaba prohibido en el handoff porque comparte
  LocalStack/Postgres con la sesión #98.

## Evidencia de requisitos de verificación

### R5

1. Con `STALE_SECONDS` y `position.staleSeconds <= STALE_SECONDS` en
   `app/(tabs)/map.tsx`, solo fallaron las dos aserciones `#94 R5`; ambas
   devolvieron `['app/(tabs)/map.tsx']` en vez de `[]`.
2. Tras retirar esa mutación y declarar solo `STALE_SECONDS` en
   `utils/device-connectivity.ts`, solo falló la aserción del identificador y
   devolvió `['utils/device-connectivity.ts']`.
3. Restauradas ambas mutaciones,
   `git diff --exit-code 83e6d554 -- 'mobile-pet-tracker/src/app/(tabs)/map.tsx' mobile-pet-tracker/src/utils/device-connectivity.ts`
   dio salida vacía y exit 0. Las 5 suites quedaron en 134/134 en ese paso.

### R9 / E1

`checkUses()` aborta en la primera fila incorrecta. Para observar los tres
pares de R2 se reordenaron temporalmente las filas afectadas, sin commit, y se
corrieron las 5 suites en cada orden. Los rojos fueron:

- `src/app/(tabs)/map.tsx` + `map.noSignal`: `uses: 0`, esperado 1.
- `src/app/(tabs)/map.tsx` + `map.live`: `uses: 0`, esperado 1.
- `src/app/(tabs)/map.tsx` + `map.stale`: `uses: 0`, esperado 1.
- Tras R6, `src/app/(tabs)/map.tsx` + `map.gps`: `uses: 0`, esperado 1.

El inventario final queda en `R4_MAP = 17`, `R10_PAIRING = 42 + 2 + 1 + 4 =
49`, `SCREEN_FILES = 19 + 2 + 1 = 22` sin editar esa aserción, y el catálogo
i18n no se tocó.

## Supuestos de la spec que resultaron falsos

1. R3 no quedó rojo al añadir sus pruebas: la expresión mínima de R2 ya
   necesitaba una rama para detalle no resuelto y usaba correctamente `—`. Se
   cerró el historial TDD con una mutación de producción versionada (`?`) que
   hizo fallar solo las dos aserciones `#94 R3`, y se restauró en el verde.
2. `sourceFiles()` en `design-drift.test.ts` no excluía los `*.test.*`
   colocados, aunque R5 afirmaba que `filesMatching()` ya miraba solo
   producción. Se añadió el filtro mínimo al helper antes de evaluar el
   umbral.
3. La salida roja de R9 no puede listar los cuatro pares en una sola corrida:
   `checkUses()` es fail-fast. Se obtuvieron las cuatro salidas mediante las
   corridas aisladas descritas arriba.

## Gate humano pendiente (R8)

Falta instalar/abrir esta rama en el dev build de Android, parar el poller de
posiciones y confirmar que Home y Mapa cambian juntos de estado de conexión.
El mismo smoke debe confirmar el caso firmado por D3: collar online con fix
viejo muestra `En vivo` y `hace N min`. No se usó Expo Go ni se firmó R8 desde
esta sesión.
