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
| R10 | `86594a29` — alias en Mapa, rojo por recuento; `4c6dc3ab` — mudanza al util, rojo por clave inesperada | `d04326b6` — retira las mutaciones y deja el inventario verde |

Corrección del bloqueante H1: `c2b67934` restaura la cobertura del helper
compartido y confina la exclusión de tests colocados a `#94 R5`.

## Suites medidas sin pipe

- Baseline de ronda 1 (`d5212d2a`): `design-drift.test.ts`, 39 tests; gate
  dirigido, 5 suites y 136 tests; ambos exit 0.
- `design-drift.test.ts` final: 1 suite, 40 tests, exit 0.
- Gate dirigido final:
  `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/map.test.tsx' 'src/utils/device-connectivity.test.ts' 'src/__tests__/design-drift.test.ts' 'src/__tests__/ui-language.test.ts' 'src/__tests__/ui-copy-table.ts'`
  → 5 suites, 137 tests, exit 0.
- Suite móvil completa: `bunx jest`
  → 77 suites, 1367 tests, 1 snapshot, exit 0 (101.291 s).
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

### R10 / E2

1. Con el alias literal de H2 junto a `const updated` en `map.tsx`,
   `design-drift.test.ts` terminó con exit 1: `#94 R10` observó
   `'app/(tabs)/map.tsx': 2` frente al 1 declarado. Las dos aserciones de
   `#94 R5` siguieron verdes; balance: 39 pasadas y 1 fallida.
2. Retirado ese alias y mudada la sonda a `utils/device-connectivity.ts` con
   `FRESH_LIMIT`, la misma suite terminó con exit 1 por la clave inesperada
   `'utils/device-connectivity.ts': 2`; R5 siguió verde y el balance volvió a
   ser 39 pasadas y 1 fallida.
3. Retiradas ambas mutaciones,
   `git diff --exit-code d5212d2a -- 'mobile-pet-tracker/src/app/(tabs)/map.tsx' mobile-pet-tracker/src/utils/device-connectivity.ts`
   dio salida vacía y exit 0. El inventario quedó exactamente en
   `{ 'api/types.ts': 1, 'app/(tabs)/map.tsx': 1 }`, con 40/40 en
   `design-drift.test.ts` y 137/137 en las 5 suites.

## Supuestos de la spec que resultaron falsos

1. R3 no quedó rojo al añadir sus pruebas: la expresión mínima de R2 ya
   necesitaba una rama para detalle no resuelto y usaba correctamente `—`. Se
   cerró el historial TDD con una mutación de producción versionada (`?`) que
   hizo fallar solo las dos aserciones `#94 R3`, y se restauró en el verde.
2. Mi supuesto de que R5 exigía cambiar el `sourceFiles()` compartido era
   falso: ese cambio quitaba los `*.test.*` colocados de los 14 `describe`
   preexistentes. H1 restaura el helper y confina esa exclusión a la lista
   local de `#94 R5`.
3. La salida roja de R9 no puede listar los cuatro pares en una sola corrida:
   `checkUses()` es fail-fast. Se obtuvieron las cuatro salidas mediante las
   corridas aisladas descritas arriba.

La ronda 2 no encontró otro supuesto falso en E2: los dos recuentos declarados
y los baselines 40/137 coincidieron con la medición.

## Gate humano pendiente (R8)

Falta instalar/abrir esta rama en el dev build de Android, parar el poller de
posiciones y confirmar que Home y Mapa cambian juntos de estado de conexión.
El mismo smoke debe confirmar el caso firmado por D3: collar online con fix
viejo muestra `En vivo` y `hace N min`. No se usó Expo Go ni se firmó R8 desde
esta sesión.

El gate humano paso el estado de conexión a `En vivo` y `hace N min` correctamente.
Cambie el Poller a false y confirme que el estado de conexión se actualiza correctamente.
La actualización del estado de conexión se debe ver reflejada en Home y Mapa.
