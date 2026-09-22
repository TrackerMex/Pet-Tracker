# Implementación #111 — `mobile-flaky-waits`

Fecha: 2026-09-22
Branch: `feature/111-mobile-flaky-waits`
Base de la rama: `73f14d5e`
Handoff: `5251e10c`

## Commits por requisito

| Requisito | Commit |
|---|---|
| R1 rojo | `60cf0534 test(mobile-flaky-waits): expose delayed weight race (R1)` |
| R1 verde | `a054f085 test(mobile-flaky-waits): wait for resolved weight (R1)` |
| R2 · S2 | `bcd8ba8a test(mobile-flaky-waits): align health query waits (R2)` |
| R2 · S3..S7 | `9051eb77 test(mobile-flaky-waits): align map waits with assertions (R2)` |
| R3..R6 | Sin cambio de código; evidencia debajo |

## Protocolo M

Todas las corridas usaron `bunx jest --runTestsByPath '<ruta>'`, sin pipe. Las
vigas de R2 se retiraron antes de `9051eb77`; la única viga permanente es la de
R1 en health.

### R1 — weight actual

Con la viga permanente de 200 ms y la espera vieja (`60cf0534`):

```text
R1-red exit=1
Unable to find an element with testID: weight-current
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
```

Con la espera terminando en el texto de `weight-current` (`a054f085`):

```text
R1-green exit=0
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
```

### S2 — llamadas de vacunas y peso

La viga prescrita no produjo el rojo esperado. Con 200 ms, el test viejo pasó;
se amplió a 800 ms conforme a la spec y el fichero completo también pasó:

```text
S2-old exit=0
Test Suites: 1 passed, 1 total
Tests:       27 skipped, 1 passed, 28 total

S2-old-800 exit=0
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
```

La causa es observable en Jest: la llamada se registra al invocar el mock, antes
de que resuelva la promesa que devuelve. Retrasar la resolución no puede convertir
`toHaveBeenCalledWith` en `Number of calls: 0`. La corrección firmada se aplicó sin
cambiar aserciones y pasó con 800 ms y sin viga:

```text
S2-new-800 exit=0
Tests:       27 skipped, 1 passed, 28 total
S2-final exit=0
Tests:       28 passed, 28 total
```

Esto es una desviación de `tasks.md` R2(1): el par viejo-falla/nuevo-pasa no se
pudo obtener con la mutación prescrita, ni ampliando su ventana.

### S3 — polylines de dos viajes

Viga de 200 ms en `mockGetDayRoute`, test viejo:

```text
S3-old exit=1
Expected: [trip-0, trip-1]
Received: Array []
Test Suites: 1 failed, 1 total
Tests:       1 failed, 57 skipped, 58 total
```

Con la aserción de `polylines` dentro del `waitFor`, misma viga:

```text
S3-new exit=0
Test Suites: 1 passed, 1 total
Tests:       57 skipped, 1 passed, 58 total
```

### S4 — array vacío y prueba de zona ciega

Viga de 200 ms y payload mutado a `trips: [makeTrip()]`; test viejo:

```text
S4-blind-old exit=0
Test Suites: 1 passed, 1 total
Tests:       57 skipped, 1 passed, 58 total
```

El mismo payload con la espera corregida ve la ruta no vacía y falla:

```text
S4-blind-new exit=1
Expected instance to have text content:
  0.0 km
Received:
  0.8 km
Test Suites: 1 failed, 1 total
Tests:       1 failed, 57 skipped, 58 total
```

Restaurados `trips: []` y sin viga:

```text
S4-final exit=0
Tests:       57 skipped, 1 passed, 58 total
```

### S5 — tiles de fuentes independientes

Viga de 200 ms en `mockGetDayRoute`, test viejo:

```text
S5-old exit=1
Expected instance to have text content:
  2.0 km
Received:
  —
Test Suites: 1 failed, 1 total
```

Con las tres aserciones dentro del `waitFor`, misma viga:

```text
S5-new exit=0
Test Suites: 1 passed, 1 total
Tests:       57 skipped, 1 passed, 58 total
```

### S6 — tiles con posición antigua

Viga de 200 ms en `mockGetDayRoute`, test viejo:

```text
S6-old exit=1
Expected instance to have text content:
  0.0 km
Received:
  —
Test Suites: 1 failed, 1 total
```

Con las tres aserciones dentro del `waitFor`, misma viga:

```text
S6-new exit=0
Test Suites: 1 passed, 1 total
Tests:       57 skipped, 1 passed, 58 total
```

Prueba adicional de zona ciega de `stat-speed`: se retrasó 200 ms
`mockListPositions` con un payload no vacío (`12.34 km/h`). El viejo pasó por el
valor pendiente `'—'`, pero el corregido también pasó:

```text
S6-blind-old exit=0
Tests:       57 skipped, 1 passed, 58 total
S6-blind-new exit=0
Tests:       57 skipped, 1 passed, 58 total
```

No es posible obtener el `corregido falla` exigido por el handoff sin cambiar el
valor esperado o añadir un ancla distinta, ambos prohibidos. La propia spec lo
anticipa en requirements §Fuera de alcance: mover `stat-speed = '—'` no la
fortalece porque coincide con el valor pendiente. Esta es la segunda desviación
de `tasks.md` R2(1).

### S7 — disabled en vuelo

Antes y después de cambiar la condición de parada del contador al árbol:

```text
S7-before exit=0
Tests:       57 skipped, 1 passed, 58 total
S7-after exit=0
Tests:       57 skipped, 1 passed, 58 total
```

El contador `mockSetLostMode(..., true)` se conserva detrás de la espera.

### Vigas finales

```text
git diff origin/main..HEAD -- 'mobile-pet-tracker/src/screens/map/index.test.tsx' | grep -c setTimeout
0
```

## R3 — test de #72 sin editar

El diff de map tiene 121 líneas y no contiene el título ni ninguna línea del test
`selects the first pet and loads its first position (#72 R2)`; el bloque permanece
byte a byte como en la base. Se conserva porque no tiene aserciones posteriores y
ningún nodo del árbol distingue el estado final con `getLastPosition` pendiente,
decisión ya firmada en #72 S6.

```text
R3-map-diff-lines=121
R3 protected test absent from diff
R3-byte-compare exit=0
```

## R4 — configuración de Jest sin editar

El plazo activo era el `asyncUtilTimeout` de RNTL (1000 ms), no el `testTimeout`
de Jest (5000 ms); subirlo habría sido inerte para una espera ya satisfecha.

```text
R4-package-lines=0
```

## R5 — cero producción

```text
git diff --name-only origin/main..HEAD -- mobile-pet-tracker/ ':!*.test.tsx'
R5-production-lines=0
```

## Protocolo V (R6)

### Base, antes de editar

```text
V0 exit=0
77
V1 exit=0
Test Suites: 2 passed, 2 total
Tests:       86 passed, 86 total
health exit=0 — 28 passed, 28 total
map exit=0 — 58 passed, 58 total
```

### Después

```text
V0-after exit=0
77
V0-list-delta exit=0
R2-V1 exit=0
Test Suites: 2 passed, 2 total
Tests:       86 passed, 86 total
```

Cinco corridas completas consecutivas, borrando `perf-cache-*` antes de cada una
y redirigiendo cada salida a su propio fichero:

```text
run 1 exit=0 — Test Suites: 77 passed, 77 total — Tests: 1396 passed, 1396 total
run 2 exit=0 — Test Suites: 77 passed, 77 total — Tests: 1396 passed, 1396 total
run 3 exit=0 — Test Suites: 77 passed, 77 total — Tests: 1396 passed, 1396 total
run 4 exit=0 — Test Suites: 77 passed, 77 total — Tests: 1396 passed, 1396 total
run 5 exit=0 — Test Suites: 77 passed, 77 total — Tests: 1396 passed, 1396 total
```

En las cinco, `N = 77 = S`. El recuento absoluto y el de los dos ficheros no se
mueven. Como declara la spec, esto controla regresiones introducidas por #111; no
demuestra ausencia del flake histórico.

## Desviaciones y estado

No se ejecutó `./init.sh`, por mandato de requirements §Fuera de alcance y
design §Protocolo V. No hubo cambios de producción, dependencias, configuración ni
número de tests.

Quedan dos resultados distintos de los exigidos por C4: S2 no da rojo con la viga
prescrita y la prueba de zona ciega de `stat-speed` en S6 no hace fallar el test
corregido. Ambos límites derivan de qué observa cada aserción, no de falta de
ventana. La implementación funcional y todos los gates de regresión están verdes,
pero el estado de la feature debe permanecer `in_progress` hasta que un humano
acepte esta evidencia o enmiende el Protocolo M.
