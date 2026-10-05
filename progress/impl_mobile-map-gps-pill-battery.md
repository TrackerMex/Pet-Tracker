# Implementación — #116 mobile-map-gps-pill-battery

## Arranque (2026-10-05)

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/116-mobile-map-gps-pill-battery
$ git rev-parse --short HEAD
a89aeaf0
$ git status --short
(salida vacía)
```

H0 = `a89aeaf00615a1f40d4dba0bd6520224fb9895f2`. Solo este worktree.
`git fetch origin`: exit 0, salida vacía.
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`: `exit=0`.

## Anclas en H0 (desde mobile-pet-tracker/)

Los `grep -c` con cero coincidencias devuelven exit 1; la salida numérica es la esperada.

| # | Comando literal | Salida | Esperado |
|---|---|---|---|
| 0 | <code>grep -cF -- '- [x] Spec aprobada por humano (fecha: 2026-10-04)' ../specs/mobile-map-gps-pill-battery/requirements.md</code> | 1 | 1 |
| 1 | <code>grep -cF 'style={CONTINUOUS_CORNER}' src/screens/map/index.tsx</code> | 4 | 4 |
| 2 | <code>grep -cF 'style={TABULAR_NUMS}' src/screens/map/index.tsx</code> | 3 | 3 |
| 3 | <code>grep -cF 'text-accent-strong' src/screens/map/index.tsx</code> | 2 | 2 |
| 4 | <code>grep -cF 'text-warning-strong' src/screens/map/index.tsx</code> | 0 | 0 |
| 5 | <code>grep -cF 'react-native-reanimated' src/screens/map/index.tsx</code> | 0 | 0 |
| 6 | <code>grep -cF 'Animated' src/screens/map/index.tsx</code> | 0 | 0 |
| 7 | <code>grep -cF 'stat-gps' src/screens/map/index.tsx</code> | 1 | 1 |
| 8 | <code>grep -cF 'pairing.connection' src/screens/map/index.tsx</code> | 1 | 1 |
| 9 | <code>grep -cF 'pairing.battery' src/screens/map/index.tsx</code> | 0 | 0 |
| 10 | <code>grep -cF 'stat-gps' src/screens/map/index.test.tsx</code> | 17 | 17 |
| 11 | <code>grep -cF 'En vivo' src/screens/map/index.test.tsx</code> | 7 | 7 |
| 12 | <code>grep -cF "toHaveTextContent('En vivo')" src/screens/map/index.test.tsx</code> | 6 | 6 |
| 13 | <code>grep -cF 'useIsFocused: () => true' src/screens/map/index.test.tsx</code> | 1 | 1 |
| 14 | <code>grep -cF 'function elementChild' src/screens/map/index.test.tsx</code> | 0 | 0 |
| 15 | <code>grep -c "muestra Conexión y retira GPS\&#124;muestra En vivo aunque" src/screens/map/index.test.tsx</code> | 2 | 2 |
| 16 | <code>grep -cF 'const STATUS_TONE_CLASSES' src/components/pet-hero-header.tsx</code> | 1 | 1 |
| 17 | <code>grep -cF 'export const STATUS_TONE_CLASSES' src/components/pet-hero-header.tsx</code> | 0 | 0 |
| 18 | <code>grep -cF "'map.live': 'Live'," src/i18n/catalog.ts</code> | 1 | 1 |
| 19 | <code>grep -cF "'map.live': 'En vivo'," src/i18n/catalog.ts</code> | 1 | 1 |
| 20 | <code>grep -cF '&#124; 198 &#124; `map.live` &#124; `Live` &#124; `En vivo` &#124;' ../specs/mobile-ui-language/design.md</code> | 1 | 1 |
| 21 | <code>grep -cF "[join('screens', 'map', 'index.tsx'), 3]," src/__tests__/consistency-classnames.test.ts</code> | 1 | 1 |
| 22 | <code>grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2, // #146 R18, #105 R11' src/__tests__/consistency-classnames.test.ts</code> | 1 | 1 |
| 23 | <code>grep -cF "{ file: 'src/screens/map/index.tsx', key: 'pairing.connection' }," src/__tests__/ui-copy-table.ts</code> | 1 | 1 |
| 24 | <code>grep -cF "[join('screens', 'map', 'index.tsx'), 4]," src/__tests__/consistency-classnames.test.ts</code> | 1 | 1 |
| 25 | <code>grep -cF '33 + 1 + 1 - 1 - 1 + 1' src/__tests__/consistency-classnames.test.ts</code> | 1 | 1 |
| 26 | <code>grep -cF "[join('screens', 'map', 'index.tsx'), 2]," src/__tests__/legibility-classnames.test.ts</code> | 1 | 1 |
| 27 | <code>grep -cF 'toBe(13 + 1 + 1)' src/__tests__/legibility-classnames.test.ts</code> | 1 | 1 |
| 28 | <code>grep -cF 'expect(R4_MAP).toHaveLength(17)' src/__tests__/ui-language.test.ts</code> | 1 | 1 |

## Plan y alcance

T0 → T1 → T2 (sonda M25) → T3 → T4 → T5 (sonda M13) → T6 y cierre documental.
Se respeta el handoff sobre las reglas generales: sin init.sh, infraestructura, push, PR ni bookkeeping del leader. R12 pertenece al humano.


## Skills cargadas

- `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md` (plugin Expo de Codex).
- `.agents/skills/appllama-app-design-skill/SKILL.md`: patrón de cápsula; la carta y la spec prevalecen, sin investigar en MCP ni abrir diseño.
- `.agents/skills/animate-expo/SKILL.md`: puerta de frecuencia (decenas de veces al día), sin animación nueva.
- `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.10.0/skills/ponytail/SKILL.md`: reutilización y diff mínimo dentro del alcance firmado.

Leídos requirements, design, tasks y traceability completos; Enmienda #116 a #94 solo lectura (ya firmada), docs/conventions, carta UI, arquitectura y disciplina de verificación. Feature #116 ya `in_progress` por el leader. No se cambian estados ni casillas.

## T0 — Base

`test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0` inmediatamente antes del typecheck.
`bun run typecheck > /tmp/pt116-base-typecheck.txt 2>&1; echo "exit=$?"` → `exit=0`, salida `$ tsc --noEmit`.
`bun run lint > /tmp/pt116-base-lint.txt 2>&1; echo "exit=$?"` → `exit=0`, salida `$ expo lint`.
Primera corrida de las ocho rutas de T0 con `--runTestsByPath --maxWorkers=2`: exit 0, 8 suites, 461 tests. Se repite la base con JSON para medir el reparto por suite, que el resumen estándar no imprime.

Medición por suite (`--json --outputFile=/tmp/pt116-base.json` agregado al mismo comando):

| Suite | Tests | Estado |
|---|---|---|
| `src/screens/map/index.test.tsx` | 64 | passed |
| `src/components/__tests__/pet-hero-header.test.tsx` | 37 | passed |
| `src/__tests__/ui-language.test.ts` | 29 | passed |
| `src/__tests__/consistency-classnames.test.ts` | 55 | passed |
| `src/__tests__/design-drift.test.ts` | 59 | passed |
| `src/providers/__tests__/language-provider.test.tsx` | 22 | passed |
| `src/__tests__/legibility-classnames.test.ts` | 26 | passed |
| `src/screens/home/index.test.tsx` | 169 | passed |

Resumen: 8 passed / 8 total; 461 passed / 461 total; snapshots 0; exit 0.

## t1-red

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-t1-red.json > /tmp/pt116-t1-red.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 1 failed, 1 total
Tests:       6 failed, 59 passed, 65 total
Snapshots:   0 total
Time:        11.133 s
exit=1
```

Suite `src/screens/map/index.test.tsx`: 65 tests.

- `R8: stats calculadas de positions y trips uses the latest speed, trip total, fresh age, and live GPS`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  GPS activo
Received:
  En vivo
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/screens/map/index.test.tsx:600:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

- `R8: stats calculadas de positions y trips #94 R2: la antigüedad de la posición ya no mueve el tile de conexión`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  GPS activo
Received:
  En vivo
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/screens/map/index.test.tsx:634:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

- `#94 R2: el tile de conexión sigue al collar muestra GPS activo aunque después falte la posición`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  GPS activo
Received:
  En vivo
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/screens/map/index.test.tsx:1340:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

- `#94 R4: la antigüedad y la conexión son datos independientes muestra un collar online junto a una posición de hace dos minutos`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  GPS activo
Received:
  En vivo
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/screens/map/index.test.tsx:1446:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

- `#94 R7: el poll refresca también el detalle actualiza el badge con el mismo intervalo de 15 segundos`

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  GPS activo
Received:
  En vivo
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/screens/map/index.test.tsx:1512:18)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

- `#116 R1: el estado activo usa la palabra del Make resuelve map.live a GPS active y GPS activo y lo registra en la tabla de copy`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "GPS active"
Received: "Live"
    at Object.toBe (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/screens/map/index.test.tsx:1587:28)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at _runTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
```

T1: los rojos son exactamente por aserción. Las 6 aserciones migradas pertenecen a 5 it (el de #94 R2 tiene dos); junto al it nuevo de R1 resultan 6 it rojos. No hay regresiones adicionales.

## t1-green

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-t1-green.json > /tmp/pt116-t1-green.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 1 passed, 1 total
Tests:       65 passed, 65 total
Snapshots:   0 total
Time:        7.387 s, estimated 11 s
exit=0
```

Suite `src/screens/map/index.test.tsx`: 65 tests.

## t2-red

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-t2-red.json > /tmp/pt116-t2-red.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 66 passed, 70 total
Snapshots:   0 total
Time:        11.861 s
exit=1
```

Suite `src/screens/map/index.test.tsx`: 70 tests.

- `#116 R2: la píldora existe encima de la tarjeta de stats pinta la píldora como hijo 0 de map-stats y la tarjeta como hijo 1`

```text
Error: Unable to find an element with testID: map-pet-pill
```

- `#116 R2: la píldora existe encima de la tarjeta de stats compone la cápsula con la receta exacta y sin esquina continua`

```text
Error: Unable to find an element with testID: map-pet-pill
```

- `#116 R3: la píldora muestra avatar y nombre pinta el avatar de 24 sin foto`

```text
Error: Unable to find an element with testID: map-pet-pill
```

- `#116 R3: la píldora muestra avatar y nombre pinta la foto de la lista con su cacheKey`

```text
Error: Unable to find an element with testID: map-pet-pill
```

## PARADA — contradicción literal de T4 / rojo de #69 R10

Detectada al leer el candado existente, antes de implementar producción de T2. El handoff ordena parar si algo no cuadra, por lo que no se siguen T2–T6 ni se improvisa una excepción al rojo.

`tasks.md` T4 exige rojo **por aserción** en `#69 R10: mantiene la base cerrada más los deltas medidos`, y a la vez exige en ese mismo rojo cambiar la fila del mapa en `counters` de `3` a `3 + 1` y sumar `+ 1` a la expectativa. El handoff también dice que los rojos de los deltas de R10 son parte de este rojo.

El test real en H0 y en HEAD es:

```ts
expect(counters.reduce((total, [, count]) => total + count, 0)).toBe(
  14 + 4 + 1 + 1 + 1 + 1 + 1 + 2, // #146 R18, #105 R11
);
```

La base medida pasó este test. `counters` es una tabla de expectativas, no una medición del fuente: su suma vale 25. Al aplicar simultáneamente ambos deltas prescritos, la suma vale 26 y la expectativa también 26; este it nace verde, aunque producción siga teniendo solo tres TABULAR_NUMS. El it independiente de la fila del mapa sí caería por aserción (4 esperados frente a 3 usos), pero eso no hace caer el it de `#69 R10`. No se puede obtener el rojo literal exigido en este último sin incumplir otra instrucción de T4 o alterar su implementación fuera de la receta cerrada.

Requiere corrección por el leader del resultado esperado de `#69 R10` en T4 (verde al actualizar tabla y suma juntas), o un guion rojo/verde distinto expresamente aprobado. Codex no auto-enmienda la spec ni sigue con una interpretación propia.

### Estado que se entrega

- T0 completo: las 29 anclas coinciden, base 8 suites / 461 tests, typecheck y lint exit 0.
- T1 completo en orden rojo/verde:
  - `16b93ef8` — `test(mobile-map): #116 R1 red, GPS activo replaces En vivo` (R1, primer retítulo R9).
  - `cb8b0e79` — `feat(mobile-map): #116 R1 map.live reads GPS active` (R1). Suite del mapa 65/65, exit 0.
- T2: tests escritos y medidos, **sin commit**; 4 rojos por consulta de `map-pet-pill` y 66 verdes, 70 total, exit 1. El it de selección ausente nace verde, como fija T2. No hay producción de T2 ni sonda M25 todavía.
- Se preservan los tests no commiteados para revisión; no se ejecutan más gates ni se cambian más ficheros. El impl queda sin commit conforme a la parada; no se hace el commit documental de cierre porque T6 no se ha alcanzado.
- T3–T6, M25, M13, anclas de cierre, delta final y trazabilidad pendientes. R12 y todas las casillas humanas intactas. Sin push ni PR.

Decisión no cerrada literalmente: ninguna adoptada; se reporta la contradicción y se espera al leader/humano.

## Reanudación 1

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/116-mobile-map-gps-pill-battery
$ git log --oneline -1
e3a47e38 docs(specs): #116 T4, #69 R10 nace verde (corrección tras la parada de Codex)
$ git merge-base --is-ancestor cb8b0e79 HEAD; echo "exit=$?"
exit=0
$ git status --short
 M mobile-pet-tracker/src/screens/map/index.test.tsx
?? progress/impl_mobile-map-gps-pill-battery.md
$ grep -cF 'nace verde** y no es un rojo de T4' specs/mobile-map-gps-pill-battery/tasks.md
1
```

H1 = `e3a47e38`, corrección del leader. H0 sigue siendo `a89aeaf0`.
La corrección resuelve la parada anterior: `#69 R10` nace verde en T4 y no requiere sonda; la fila del mapa de `counters` y `checkUses(R4_MAP)` sí deben caer. No se rehace T0/T1 ni se cambian los tests actuales de T2 antes de repetir su rojo. El alcance de cierre contra H0 son 11 ficheros: los 9 de Codex y tasks.md/handoff del leader.

## t2-red

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-t2-red.json > /tmp/pt116-t2-red.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 66 passed, 70 total
Snapshots:   0 total
Time:        11.478 s, estimated 12 s
exit=1
```

Suite `src/screens/map/index.test.tsx`: 70 tests.

- `#116 R2: la píldora existe encima de la tarjeta de stats pinta la píldora como hijo 0 de map-stats y la tarjeta como hijo 1`

```text
Error: Unable to find an element with testID: map-pet-pill
```

- `#116 R2: la píldora existe encima de la tarjeta de stats compone la cápsula con la receta exacta y sin esquina continua`

```text
Error: Unable to find an element with testID: map-pet-pill
```

- `#116 R3: la píldora muestra avatar y nombre pinta el avatar de 24 sin foto`

```text
Error: Unable to find an element with testID: map-pet-pill
```

- `#116 R3: la píldora muestra avatar y nombre pinta la foto de la lista con su cacheKey`

```text
Error: Unable to find an element with testID: map-pet-pill
```

## PARADA 2 — H1 añade un tercer fichero del leader fuera del cierre de 11

Las seis comprobaciones de «Reanudación 1» coinciden y se repitió T2 sin modificar sus tests: 1 suite, 4 rojos por consulta de `map-pet-pill`, 66 verdes, 70 total, exit 1. No se commitea ni se implementa T2 al detectar esta discrepancia de alcance.

La sección CORRECCION 1 y el mensaje de reanudación exigen exactamente 11 ficheros contra H0: los 9 de Codex más tasks.md y el handoff del leader. Sin embargo H1 `e3a47e38` modifica también `progress/current.md`, reservado al leader y que Codex tiene prohibido tocar. Salida leída:

```text
$ git show --stat --oneline HEAD
e3a47e38 docs(specs): #116 T4, #69 R10 nace verde (corrección tras la parada de Codex)
 progress/current.md                             |  5 +++
 progress/handoff_mobile-map-gps-pill-battery.md | 50 ++++++++++++++++++++++++-
 specs/mobile-map-gps-pill-battery/tasks.md      | 11 +++++-
 3 files changed, 63 insertions(+), 3 deletions(-)

$ git diff --name-only a89aeaf0 HEAD
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/map/index.test.tsx
progress/current.md
progress/handoff_mobile-map-gps-pill-battery.md
specs/mobile-map-gps-pill-battery/tasks.md
specs/mobile-ui-language/design.md
```

`git diff a89aeaf0 HEAD -- progress/current.md` confirma cinco líneas añadidas por H1 sobre la parada anterior y CORRECCION 1. Por tanto los 9 ficheros de implementación más los 3 del leader serían 12; no se puede cumplir la lista literal de 11 sin editar el fichero reservado al leader. No se altera ese fichero ni la historia.

Necesita que el leader restaure `progress/current.md` a H0 o que el humano autorice expresamente el cierre de 12 ficheros incluyendo su cambio. No se adopta esa ampliación por cuenta propia. Estado conservado: T1 completo, T2 tests sin commit y producción intacta; impl sin commit. Sin push ni PR.

## Reanudación 2

```text
$ git log --oneline -1
6ccb9ca9 docs(progress): #116 CORRECCION 2, el cierre son 12 ficheros
$ git merge-base --is-ancestor e3a47e38 HEAD; echo "exit=$?"
exit=0
$ git show --stat --format= HEAD
 progress/current.md                             |  3 ++
 progress/handoff_mobile-map-gps-pill-battery.md | 55 +++++++++++++++++++++++++
 2 files changed, 58 insertions(+)
$ git status --short
 M mobile-pet-tracker/src/screens/map/index.test.tsx
?? progress/impl_mobile-map-gps-pill-battery.md
$ grep -cF 'el cierre son 12 ficheros, no 11' progress/handoff_mobile-map-gps-pill-battery.md
2
```

H2 = `6ccb9ca9`; CORRECCION 2 autoriza exactamente 12 ficheros contra H0, incluyendo los tres del leader (tasks, handoff y current). Resuelta PARADA 2 sin tocar esos ficheros. Se reutiliza el rojo T2 medido en Reanudación 1 (4 por consulta, 66 verdes, 70 total; exit 1); no se repite. Continúan los mismos skills y la receta aprobada. Sin decisiones nuevas.

## t2-green

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-t2-green.json > /tmp/pt116-t2-green.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 1 passed, 1 total
Tests:       70 passed, 70 total
Snapshots:   0 total
Time:        8.616 s, estimated 12 s
exit=0
```

Suite `src/screens/map/index.test.tsx`: 70 tests.

## Sonda M25 — después del verde T2

Mutación temporal: retirada la condición `selectedPet ?`, con nombre/foto opcionales y `cacheKey={selectedPet?.id}` para mantener la sonda sin TypeError. Solo el fuente del mapa; no se commitea.
Comando: `bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-m25.json > /tmp/pt116-m25.txt 2>&1; echo "exit=$?"`.
Resultado: 1 suite; 1 failed, 69 passed, 70 total; exit 1.
It caído: `#116 R2: la píldora existe encima de la tarjeta de stats` › `no pinta la píldora mientras la selección no está en la lista`, **por aserción** `expect(screen.queryByTestId('map-pet-pill')).toBeNull()`; Expected: null; Received: nodo de la píldora no nulo (evidencia literal debajo).

```text
Error: expect(received).toBeNull()

Received: <View className="flex-row items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-2 shadow-sm" testID="map-pet-pill"><RNSVGSvgView align="xMidYMid" bbHeight={24} bbWidth={24} focusable={false} height={24} meetOrSlice={0} minX={0} minY={0} style={[{"backgroundColor": "transparent", "borderWidth": 0}, {"flex": 0, "height": 24, "width": 24}]} testID="map-pet-pill-avatar" vbHeight={100} vbWidth={100} width={24} xml="<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"#e9d0d6\"><path d=\"M75.75 42.91C82.36 68.03 80.24 71.97 56.88 78.12C33.51 84.27 29.73 81.88 23.12 56.76C16.51 31.64 18.62 27.7 41.99 21.55C65.36 15.4 69.14 17.79 75.75 42.91Z\"/></g><g fill=\"#170c0f\"><path d=\"M41.36 45.19C42.62 51.42 42.58 51.6 39.93 52.13C37.28 52.66 37.18 52.51 35.93 46.29C34.67 40.06 34.71 39.88 37.36 39.35C40.01 38.82 40.11 38.96 41.36 45.19Z\"/><path d=\"M59.61 44.26C60.88 50.23 60.84 50.4 58.22 50.96C55.61 51.52 55.51 51.38 54.24 45.41C52.97 39.44 53 39.27 55.62 38.71C58.24 38.15 58.34 38.3 59.61 44.26Z\"/></g></svg>" xmlns="http://www.w3.org/2000/svg"><RNSVGGroup fill={{"payload": 4278190080, "type": 0}}><RNSVGGroup fill={{"payload": 4293513430, "type": 0}} propList={["fill"]}><RNSVGPath d="M75.75 42.91C82.36 68.03 80.24 71.97 56.88 78.12C33.51 84.27 29.73 81.88 23.12 56.76C16.51 31.64 18.62 27.7 41.99 21.55C65.36 15.4 69.14 17.79 75.75 42.91Z" fill={{"payload": 4278190080, "type": 0}} /></RNSVGGroup><RNSVGGroup fill={{"payload": 4279700495, "type": 0}} propList={["fill"]}><RNSVGPath d="M41.36 45.19C42.62 51.42 42.58 51.6 39.93 52.13C37.28 52.66 37.18 52.51 35.93 46.29C34.67 40.06 34.71 39.88 37.36 39.35C40.01 38.82 40.11 38.96 41.36 45.19Z" fill={{"payload": 4278190080, "type": 0}} /><RNSVGPath d="M59.61 44.26C60.88 50.23 60.84 50.4 58.22 50.96C55.61 51.52 55.51 51.38 54.24 45.41C52.97 39.44 53 39.27 55.62 38.71C58.24 38.15 58.34 38.3 59.61 44.26Z" fill={{"payload": 4278190080, "type": 0}} /></RNSVGGroup></RNSVGGroup></RNSVGSvgView><Text className="shrink text-xs font-bold text-foreground" numberOfLines={1} testID="map-pet-pill-name" /></View>
```

Restauración: `git checkout HEAD -- src/screens/map/index.tsx`, exit 0.

```text
$ git diff --quiet -- src/screens/map/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

## t3-red

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-t3-red.json > /tmp/pt116-t3-red.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 1 failed, 1 total
Tests:       20 failed, 59 passed, 79 total
Snapshots:   0 total
Time:        26.534 s
exit=1
```

Suite `src/screens/map/index.test.tsx`: 79 tests.

- `R8: stats calculadas de positions y trips uses the latest speed, trip total, fresh age, and live GPS`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `R8: stats calculadas de positions y trips #94 R2: la antigüedad de la posición ya no mueve el tile de conexión`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `R8: stats calculadas de positions y trips #94 R2: sin collar el tile de conexión dice Sin señal`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#94 R2: el tile de conexión sigue al collar muestra GPS activo aunque después falte la posición`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#94 R2: el tile de conexión sigue al collar muestra Desactualizado para un collar offline`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#94 R2: el tile de conexión sigue al collar muestra Sin señal para una conectividad desconocida`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#94 R2: el tile de conexión sigue al collar muestra Sin señal sin collar aunque haya posición`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#94 R3: sin detalle el tile de conexión cae al guion muestra el guion mientras el detalle está pendiente`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#94 R3: sin detalle el tile de conexión cae al guion muestra el guion cuando el detalle falla`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#94 R4: la antigüedad y la conexión son datos independientes muestra un collar online junto a una posición de hace dos minutos`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#94 R7: el poll refresca también el detalle actualiza el badge con el mismo intervalo de 15 segundos`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R3: la píldora muestra avatar y nombre rotula el nombre de la lista en una línea`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R4: la píldora muestra el estado del GPS online: rotula su estado con su punto y su tinta`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R4: la píldora muestra el estado del GPS offline: rotula su estado con su punto y su tinta`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R4: la píldora muestra el estado del GPS unknown: rotula su estado con su punto y su tinta`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R4: la píldora muestra el estado del GPS sin collar: rotula su estado con su punto y su tinta`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R4: la píldora muestra el estado del GPS detalle pendiente: rotula su estado con su punto y su tinta`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R4: la píldora muestra el estado del GPS detalle con error: rotula su estado con su punto y su tinta`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R4: la píldora muestra el estado del GPS fija cuatro hijos en orden: avatar, nombre, punto, estado`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

- `#116 R4: la píldora muestra el estado del GPS agrupa la píldora para el lector de pantalla y deja el estado en una línea sin cifras tabulares`

```text
Error: Unable to find an element with testID: map-pet-pill-status
```

## t3-green

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-t3-green.json > /tmp/pt116-t3-green.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 1 passed, 1 total
Tests:       79 passed, 79 total
Snapshots:   0 total
Time:        11.361 s, estimated 27 s
exit=0
```

Suite `src/screens/map/index.test.tsx`: 79 tests.

T3: los 20 rojos son todos por consulta de `map-pet-pill-status`: los 9 nuevos (R3 nombre + R4) y los 11 históricos de la lista cerrada. El verde conserva `stat-gps` hasta T4. Solo se exporta STATUS_TONE_CLASSES en pet-hero-header.tsx.

## t4-red

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts --json --outputFile=/tmp/pt116-t4-red.json > /tmp/pt116-t4-red.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 3 failed, 3 total
Tests:       22 failed, 155 passed, 177 total
Snapshots:   0 total
Time:        22.594 s
exit=1
```

Suite `src/__tests__/ui-language.test.ts`: 29 tests.

- `#65 R4: Map resuelve su copy por clave resuelve las 17 ocurrencias normativas`

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/map/index.tsx",
    "key": "pairing.battery",
-   "uses": 1,
+   "uses": 0,
  }
    at toEqual (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/__tests__/ui-language.test.ts:61:47)
    at Object.checkUses (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/__tests__/ui-language.test.ts:130:5)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
    at Object.worker (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/testWorker.js:106:12)
```

- `#65 R18: los sitios resuelven por clave y no queda copy suelta resuelve cada ocurrencia de la tabla contra la clave exacta`

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/map/index.tsx",
    "key": "pairing.battery",
-   "uses": 1,
+   "uses": 0,
  }
    at toEqual (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/__tests__/ui-language.test.ts:61:47)
    at Object.checkUses (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/__tests__/ui-language.test.ts:486:5)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
    at Object.worker (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/testWorker.js:106:12)
```

Suite `src/__tests__/consistency-classnames.test.ts`: 55 tests.

- `#62 R15: todo contador usa cifras tabulares screens/map/index.tsx aplica TABULAR_NUMS a sus 4 valores`

```text
Error: expect(received).toHaveLength(expected)

Expected length: 4
Received length: 3
Received array:  ["style={TABULAR_NUMS}", "style={TABULAR_NUMS}", "style={TABULAR_NUMS}"]
    at toHaveLength (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts:348:53)
    at Object.<anonymous> (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-each/build/bind.js:81:13)
    at Promise.then.completed (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:316:40)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at _runTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:121:9)
    at run (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/runTest.js:444:34)
    at Object.worker (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/jest-runner/build/testWorker.js:106:12)
```

Suite `src/screens/map/index.test.tsx`: 93 tests.

- `#61 R11: el overlay de stats reparte los cuatro tiles en 2x2 sin envolver stat-battery se queda en una sola línea`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#61 R11: el overlay de stats reparte los cuatro tiles en 2x2 sin envolver reparte los tiles en dos filas de dos y no en una fila de cuatro`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#61 R11: el overlay de stats reparte los cuatro tiles en 2x2 sin envolver conserva los cuatro tiles, su orden de lectura y el overlay absoluto`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#62 R15: el overlay del mapa usa cifras tabulares estabiliza los valores numéricos sin tratar GPS como contador`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#94 R6 (enmienda #116): el mapa ya no rotula la conexión retira Conexión y GPS y rotula Batería`

```text
Error: expect(received).toBeNull()

Received: <Text className="mt-1 text-2xs font-normal text-muted">Conexión</Text>
    at Object.toBeNull (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/src/screens/map/index.test.tsx:1476:44)
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
    at _next (/home/claude/sites/Pet-Tracker/mobile-pet-tracker/node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

- `#116 R5: la batería sustituye al tile de conexión monta el tile de batería con valor y rótulo en ese orden`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R5: la batería sustituye al tile de conexión retira stat-gps del mapa`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R6: la batería se lee con formato entero y tinta por umbral 100 se lee 100% con text-base font-black text-accent-strong`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R6: la batería se lee con formato entero y tinta por umbral 82 se lee 82% con text-base font-black text-accent-strong`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R6: la batería se lee con formato entero y tinta por umbral 61 se lee 61% con text-base font-black text-accent-strong`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R6: la batería se lee con formato entero y tinta por umbral 60 se lee 60% con text-base font-black text-warning-strong`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R6: la batería se lee con formato entero y tinta por umbral 15 se lee 15% con text-base font-black text-warning-strong`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R6: la batería se lee con formato entero y tinta por umbral 0 se lee 0% con text-base font-black text-warning-strong`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R7: la batería cae al guion y solo la lee el detalle muestra el guion mientras el detalle está pendiente`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R7: la batería cae al guion y solo la lee el detalle muestra el guion cuando el detalle falla`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R7: la batería cae al guion y solo la lee el detalle muestra el guion sin collar`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R7: la batería cae al guion y solo la lee el detalle ignora la batería de la última posición cuando el collar no la trae`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R7: la batería cae al guion y solo la lee el detalle lee la batería del detalle y no de la lista`

```text
Error: Unable to find an element with testID: stat-battery
```

- `#116 R7: la batería cae al guion y solo la lee el detalle repinta la batería con el poll de 15 segundos`

```text
Error: Unable to find an element with testID: stat-battery
```

## PARADA 3 — T4 tiene otro it rojo: checkUses(ALL_USES) en #65 R18

Se completaron T2 verde y M25 (revertida con ambos diffs en 0), T3 rojo/verde. La corrida T4 mide 3 suites, 22 failed / 155 passed / 177 total, exit 1: mapa 93 tests (19 rojos), consistency 55 (1 rojo), ui-language 29 (2 rojos). `#69 R10: mantiene la base cerrada más los deltas medidos` **passed**, como autoriza CORRECCION 1. La fila del mapa de counters y checkUses(R4_MAP) sí caen por sus aserciones esperadas.

Pero también cae el it no enumerado de `src/__tests__/ui-language.test.ts`:
`#65 R18: los sitios resuelven por clave y no queda copy suelta` › `resuelve cada ocurrencia de la tabla contra la clave exacta`.
Llama a `checkUses(ALL_USES)`, y ALL_USES incluye `...R4_MAP` (ui-copy-table.ts). Por ello cambiar la fila a pairing.battery en el rojo de T4 activa este segundo guard además del de #65 R4. Matcher: `toEqual`; Expected `{ file: 'src/screens/map/index.tsx', key: 'pairing.battery', uses: 1 }`; Received el mismo objeto con `uses: 0`. Evidencia de ambos it en t4-red arriba.

El handoff exige: «Si cae otro it, o uno cae por el motivo contrario al declarado, PARA y reportalo». tasks.md T4 corregido enumera checkUses(R4_MAP), pero no checkUses(ALL_USES); por eso se para aquí sin implementar T4 ni commitear un rojo diferente al literal esperado. No se toca ui-language.test.ts ni se silencia ese guard. La producción mínima de T4 hará verdes ambos guards con la misma llamada t('pairing.battery'); no hay una regresión independiente. Hace falta que el leader/humano autorice este it adicional como rojo esperado en T4.

### Commits nuevos (orden rojo/verde)

- `6fadb48b` — `test(mobile-map): #116 R2 R3 red, pet pill above stats` (R2, R3; rojo reutilizado sin repetirlo).
- `f41e1b05` — `feat(mobile-map): #116 R2 R3 pet pill with avatar and name` (R2, R3), 70/70, exit 0.
- `762c74c8` — `test(mobile-map): #116 R4 red, pill status with tone` (R3 nombre y R4; migraciones R9), 20 rojos por consulta / 59 verdes / 79 total, exit 1.
- `4c10a90a` — `feat(mobile-map): #116 R4 pill dot and connection status` (R4), 79/79, exit 0.

Estado conservado: tests y deltas R10 de T4 sin commit; producción del mapa aún con stat-gps (fin de T3). M25 pasó su sonda y fue revertida; M13, T4 verde, T5, T6 y cierre documental siguen pendientes. Se conserva el alcance de 12 de CORRECCION 2. Sin push, PR ni cambios en los tres ficheros del leader.

## Reanudación 3

```text
$ git log --oneline -1
1bd3159d docs(specs): #116 CORRECCION 3, #65 R18 también cae en el rojo de T4
$ git merge-base --is-ancestor 4c10a90a HEAD; echo "exit=$?"
exit=0
$ git show --stat --format= HEAD
 progress/current.md                             |  4 ++
 progress/handoff_mobile-map-gps-pill-battery.md | 58 +++++++++++++++++++++++++
 specs/mobile-map-gps-pill-battery/tasks.md      | 15 +++++--
 3 files changed, 74 insertions(+), 3 deletions(-)
$ git status --short
 M mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
 M mobile-pet-tracker/src/__tests__/ui-copy-table.ts
 M mobile-pet-tracker/src/screens/map/index.test.tsx
?? progress/impl_mobile-map-gps-pill-battery.md
$ grep -cF 'cae otra vez por la misma causa' specs/mobile-map-gps-pill-battery/tasks.md
1
```

H3 = `1bd3159d`. CORRECCION 3 resuelve PARADA 3: el rojo T4 ya medido coincide con los 22 it esperados y se reutiliza sin repetirlo; `#69 R10` permanece verde. Cierre de 12 ficheros; R11 punto tercero usa las exclusiones de los tres ficheros del leader. Sin decisiones nuevas.

## t4-green

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/ui-language.test.ts --json --outputFile=/tmp/pt116-t4-green.json > /tmp/pt116-t4-green.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 3 passed, 3 total
Tests:       177 passed, 177 total
Snapshots:   0 total
Time:        13.946 s, estimated 22 s
exit=0
```

Suite `src/__tests__/ui-language.test.ts`: 29 tests.

Suite `src/__tests__/consistency-classnames.test.ts`: 55 tests.

Suite `src/screens/map/index.test.tsx`: 93 tests.

## t5-green

`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-t5-green.json > /tmp/pt116-t5-green.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 1 passed, 1 total
Tests:       94 passed, 94 total
Snapshots:   0 total
Time:        9.18 s, estimated 14 s
exit=0
```

Suite `src/screens/map/index.test.tsx`: 94 tests.

## Sonda M13 — T5

Mutación temporal autorizada en tasks T5: añadir únicamente `import Animated from 'react-native-reanimated';` al principio del mapa. Sin commit de producción.
`bunx jest --runTestsByPath --maxWorkers=2 src/screens/map/index.test.tsx --json --outputFile=/tmp/pt116-m13.json > /tmp/pt116-m13.txt 2>&1; echo "exit=$?"`.
Resultado: 1 failed suite / 1 total; 1 failed, 93 passed, 94 total; snapshots 0; exit 1.
Único it caído: `#116 R8: el mapa no estrena animación` › `no importa Reanimated ni anima el punto`, **por aserción**.

```text
Matcher: expect(source).not.toContain('react-native-reanimated')
Expected substring: not "react-native-reanimated"
Received source (primera línea): import Animated from 'react-native-reanimated';
```

Restauración: `git checkout HEAD -- src/screens/map/index.tsx`, exit 0.

```text
$ git diff --quiet -- src/screens/map/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
```

## T6 — verificaciones finales

Las sondas no están en el fuente ni en el índice. El mapa tiene ya los 94 it previstos (+30). No se borró ningún it: los retitulados y migrados conservan su número. Las tres paradas anteriores están resueltas por CORRECCIONES 1–3.

## Anclas de cierre (desde mobile-pet-tracker/)

| # | Comando literal | Salida | Esperado |
|---|---|---|---|
| 0 | <code>grep -cF -- '- [x] Spec aprobada por humano (fecha: 2026-10-04)' ../specs/mobile-map-gps-pill-battery/requirements.md</code> | 1 | 1 |
| 1 | <code>grep -cF 'style={CONTINUOUS_CORNER}' src/screens/map/index.tsx</code> | 4 | 4 |
| 2 | <code>grep -cF 'style={TABULAR_NUMS}' src/screens/map/index.tsx</code> | 4 | 4 |
| 3 | <code>grep -cF 'text-accent-strong' src/screens/map/index.tsx</code> | 2 | 2 |
| 4 | <code>grep -cF 'text-warning-strong' src/screens/map/index.tsx</code> | 0 | 0 |
| 5 | <code>grep -cF 'react-native-reanimated' src/screens/map/index.tsx</code> | 0 | 0 |
| 6 | <code>grep -cF 'Animated' src/screens/map/index.tsx</code> | 0 | 0 |
| 7 | <code>grep -cF 'stat-gps' src/screens/map/index.tsx</code> | 0 | 0 |
| 8 | <code>grep -cF 'pairing.connection' src/screens/map/index.tsx</code> | 0 | 0 |
| 9 | <code>grep -cF 'pairing.battery' src/screens/map/index.tsx</code> | 1 | 1 |
| 10 | <code>grep -cF 'stat-gps' src/screens/map/index.test.tsx</code> | 2 | 2 |
| 11 | <code>grep -cF 'En vivo' src/screens/map/index.test.tsx</code> | 0 | 0 |
| 12 | <code>grep -cF "toHaveTextContent('En vivo')" src/screens/map/index.test.tsx</code> | 0 | 0 |
| 13 | <code>grep -cF 'useIsFocused: () => true' src/screens/map/index.test.tsx</code> | 0 | 0 |
| 14 | <code>grep -cF 'function elementChild' src/screens/map/index.test.tsx</code> | 1 | 1 |
| 15 | <code>grep -c "muestra Conexión y retira GPS\&#124;muestra En vivo aunque" src/screens/map/index.test.tsx</code> | 0 | 0 |
| 16 | <code>grep -cF 'const STATUS_TONE_CLASSES' src/components/pet-hero-header.tsx</code> | 1 | 1 |
| 17 | <code>grep -cF 'export const STATUS_TONE_CLASSES' src/components/pet-hero-header.tsx</code> | 1 | 1 |
| 18 | <code>grep -cF "'map.live': 'Live'," src/i18n/catalog.ts</code> | 0 | 0 |
| 19 | <code>grep -cF "'map.live': 'En vivo'," src/i18n/catalog.ts</code> | 0 | 0 |
| 20 | <code>grep -cF '&#124; 198 &#124; `map.live` &#124; `Live` &#124; `En vivo` &#124;' ../specs/mobile-ui-language/design.md</code> | 0 | 0 |
| 21 | <code>grep -cF "[join('screens', 'map', 'index.tsx'), 3]," src/__tests__/consistency-classnames.test.ts</code> | 0 | 0 |
| 22 | <code>grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2, // #146 R18, #105 R11' src/__tests__/consistency-classnames.test.ts</code> | 0 | 0 |
| 23 | <code>grep -cF "{ file: 'src/screens/map/index.tsx', key: 'pairing.connection' }," src/__tests__/ui-copy-table.ts</code> | 0 | 0 |
| 24 | <code>grep -cF "[join('screens', 'map', 'index.tsx'), 4]," src/__tests__/consistency-classnames.test.ts</code> | 1 | 1 |
| 25 | <code>grep -cF '33 + 1 + 1 - 1 - 1 + 1' src/__tests__/consistency-classnames.test.ts</code> | 1 | 1 |
| 26 | <code>grep -cF "[join('screens', 'map', 'index.tsx'), 2]," src/__tests__/legibility-classnames.test.ts</code> | 1 | 1 |
| 27 | <code>grep -cF 'toBe(13 + 1 + 1)' src/__tests__/legibility-classnames.test.ts</code> | 1 | 1 |
| 28 | <code>grep -cF 'expect(R4_MAP).toHaveLength(17)' src/__tests__/ui-language.test.ts</code> | 1 | 1 |

Anclas positivas:

```text
$ grep -cF "[join('screens', 'map', 'index.tsx'), 3 + 1], // #116 R5" src/__tests__/consistency-classnames.test.ts
1
```

```text
$ grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5' src/__tests__/consistency-classnames.test.ts
1
```

```text
$ grep -cF "{ file: 'src/screens/map/index.tsx', key: 'pairing.battery' }, // #116 R5: sustituye a pairing.connection" src/__tests__/ui-copy-table.ts
1
```

```text
$ grep -cF "'map.live': 'GPS active'," src/i18n/catalog.ts
1
```

```text
$ grep -cF "'map.live': 'GPS activo'," src/i18n/catalog.ts
1
```

Ancla 10: solo quedan las dos líneas del it `retira stat-gps del mapa`: título (línea 1795) y `queryByTestId` (1799), como manda R5. `rg -n 'stat-gps' src/screens/map/index.test.tsx` confirmó exactamente esas dos.

Grep-clean del fuente del mapa: hex 0, clases arbitrarias 0, StyleSheet.create 0 y text-success 0. Comandos usados:

```text
$ grep -cE '#[[:xdigit:]]{3,8}\b' src/screens/map/index.tsx
0
$ grep -cE '[[:alpha:]-]+-\[[^]]+\]' src/screens/map/index.tsx
0
$ grep -cF 'StyleSheet.create' src/screens/map/index.tsx
0
$ grep -cF 'text-success' src/screens/map/index.tsx
0
```

## R11 — salidas de alcance y cierre

`test ! -e .expo/types/router.d.ts; echo "exit=$?"` → `exit=0`, inmediatamente antes del typecheck final.

```text
$ bun run typecheck > /tmp/pt116-final-typecheck.txt 2>&1; echo "exit=$?"
exit=0
Salida: $ tsc --noEmit
$ bun run lint > /tmp/pt116-final-lint.txt 2>&1; echo "exit=$?"
exit=0
Salida: $ expo lint
```

Las tres salidas literales de R11, desde la raíz:

```text
$ git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
(salida vacía)
exit=0
```

```text
$ git diff --stat origin/main -- backend-pet-tracker/
(salida vacía)
exit=0
```

```text
$ git diff origin/main -- mobile-pet-tracker/src/components/pet-hero-header.tsx
diff --git a/mobile-pet-tracker/src/components/pet-hero-header.tsx b/mobile-pet-tracker/src/components/pet-hero-header.tsx
index eb19efe3..a0371338 100644
--- a/mobile-pet-tracker/src/components/pet-hero-header.tsx
+++ b/mobile-pet-tracker/src/components/pet-hero-header.tsx
@@ -54,7 +54,7 @@ export interface PetHeroStatus {
   tone: PetHeroStatusTone;
 }

-const STATUS_TONE_CLASSES: Record<
+export const STATUS_TONE_CLASSES: Record<
   PetHeroStatusTone,
   { surface: string; dot: string; text: string }
 > = {
exit=0
```

`git diff --check` → exit 0, salida vacía. Revisión del diff: dentro de map-stats hay cápsula con avatar/nombre de la lista y cuatro hijos; estado y batería derivan del detalle, sin lectura de batería de posición/lista ni animación. No se han cambiado API, Home, dependencias ni los tres ficheros del leader. Los deltas R10 se aplican sobre las mismas expresiones de H0, sin recalcular absolutos.

## Commits de implementación (hashes estables, R-id)

| Hash | Mensaje literal | R |
|---|---|---|
| 16b93ef8 | test(mobile-map): #116 R1 red, GPS activo replaces En vivo | R1, R9 |
| cb8b0e79 | feat(mobile-map): #116 R1 map.live reads GPS active | R1 |
| 6fadb48b | test(mobile-map): #116 R2 R3 red, pet pill above stats | R2, R3 |
| f41e1b05 | feat(mobile-map): #116 R2 R3 pet pill with avatar and name | R2, R3 |
| 762c74c8 | test(mobile-map): #116 R4 red, pill status with tone | R3 nombre, R4, migraciones R9 |
| 4c10a90a | feat(mobile-map): #116 R4 pill dot and connection status | R4 |
| 2e0987d6 | test(mobile-map): #116 R5 R6 R7 red, battery tile replaces connection | R5, R6, R7, R9, R10 |
| 2129e82a | feat(mobile-map): #116 R5 R6 R7 battery tile from device detail | R5, R6, R7 |
| 08d30121 | test(mobile-map): #116 R8 lock map without reanimated | R8 |

H1 e3a47e38, H2 6ccb9ca9 y H3 1bd3159d son del leader. Ningún refactor adicional, ningún rebase. Último commit documental previsto: `docs(mobile-map-gps-pill-battery): trace #116 R1-R11`, solo traceability e impl; no referencia circular a su propio hash.

### Decisiones y esperas

No se reabrieron decisiones de diseño. Las únicas correcciones son las 1–3 autorizadas por el leader/humano. Para `#61 R11` › `reparte los tiles en dos filas de dos y no en una fila de cuatro` se espera al nodo positivo `stat-battery` antes de comprobar la distribución: así su rojo cae por consulta, como exige T4, y no por aserción sobre el antiguo array. R7 poll reutiliza los fake timers y las cuatro/dos microtareas de #94 R7, con limpieza en finally; ninguna espera nueva usa contadores de mocks. Las tres fixtures conservan sus firmas. El auxiliar elementChild está copiado literalmente y local. En R8 las dos aserciones de fuente son las prescritas; M13 planta la variante de import único autorizada en T5.

### Resumen de sondas

| Sonda | It caído | Resultado | Restauración |
|---|---|---|---|
| M25 | R2 › no pinta la píldora mientras la selección no está en la lista | toBeNull, Received View no nulo; 1 rojo / 69 verdes / 70 total, exit 1 | checkout HEAD; diff fuente 0, índice 0 |
| M13 | R8 › no importa Reanimated ni anima el punto | not.toContain, Received fuente con import Reanimated; 1 rojo / 93 verdes / 94 total, exit 1 | checkout HEAD; diff fuente 0, índice 0 |

## Jest entero — T6

`bunx jest --maxWorkers=2 --json --outputFile=/tmp/pt116-final-jest.json > /tmp/pt116-final-jest.txt 2>&1; echo "exit=$?"`

```text
Test Suites: 93 passed, 93 total
Tests:       2037 passed, 2037 total
Snapshots:   1 passed, 1 total
Time:        106.813 s
exit=0
```

No se lanzó ninguna otra suite mientras corría el Jest entero.

## Delta final por suite (extraído del Jest entero)

| Suite | H0 | Final | Delta |
|---|---|---|---|
| `src/screens/map/index.test.tsx` | 64 | 94 | +30 |
| `src/components/__tests__/pet-hero-header.test.tsx` | 37 | 37 | +0 |
| `src/__tests__/ui-language.test.ts` | 29 | 29 | +0 |
| `src/__tests__/consistency-classnames.test.ts` | 55 | 55 | +0 |
| `src/__tests__/design-drift.test.ts` | 59 | 59 | +0 |
| `src/providers/__tests__/language-provider.test.tsx` | 22 | 22 | +0 |
| `src/__tests__/legibility-classnames.test.ts` | 26 | 26 | +0 |
| `src/screens/home/index.test.tsx` | 169 | 169 | +0 |

Total de las 8 de T0: **461 → 491 (+30)**. Mapa: 64 → 94. Comparación automática de assertionResults: 64 it históricos conservados, normalizando solo los dos retítulos de R9 y el caso stat-battery migrado de #61; 30 it nuevos con prefijo #116. Cero it eliminados.

Aviso literal del Jest entero (exit 0, cero tests fallidos):

```text
A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
```

Se registra como límite de esta verificación: el exit y todas las suites/tests/snapshot son verdes; la corrida completa no identifica qué suite dejó abierto el worker. No se atribuye el aviso a un fichero ni se amplía esta feature a limpieza del harness. La suite focal del mapa en T5 fue 94/94 sin este aviso.

Los R1–R11 quedan implementados y verificados; R12 queda gate humano. No se marcan S1–S6 ni aprobación/enmienda, no se actualizan estados ni secciones reservadas al leader, y no se hace push ni PR.

Contexto del aviso: `progress/review_mobile-alert-detail-screen.md` (observación 4) ya documentaba el mismo aviso como preexistente y no bloqueante, con exit 0. Se mantiene la limitación de no atribuir su origen sin detectOpenHandles; no hay un fallo nuevo demostrado de #116.

## Alcance contra H0 — verificación tras el commit documental

```text
$ git diff --name-only a89aeaf0 HEAD
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/components/pet-hero-header.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
progress/current.md
progress/handoff_mobile-map-gps-pill-battery.md
progress/impl_mobile-map-gps-pill-battery.md
specs/mobile-map-gps-pill-battery/tasks.md
specs/mobile-map-gps-pill-battery/traceability.md
specs/mobile-ui-language/design.md
exit=0
```

```text
$ git diff --name-only a89aeaf0 HEAD -- . ':!specs/mobile-map-gps-pill-battery/tasks.md' ':!progress/handoff_mobile-map-gps-pill-battery.md' ':!progress/current.md'
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/components/pet-hero-header.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/screens/map/index.test.tsx
mobile-pet-tracker/src/screens/map/index.tsx
progress/impl_mobile-map-gps-pill-battery.md
specs/mobile-map-gps-pill-battery/traceability.md
specs/mobile-ui-language/design.md
exit=0
```

```text
$ git status --short
(salida vacía)
exit=0
```

Coincidencia exacta: **12 ficheros**, los 9 de design §1.2 más los 3 del leader. Con las exclusiones de CORRECCION 3 quedan **9**, y ningún otro. Árbol limpio tras el commit documental. Esta evidencia se incorpora al mismo commit; los hashes de todos los commits de implementación permanecen intactos.

El chequeo final del diff detectó un espacio final en una línea vacía de la salida de git diff copiada al informe. Se normalizó ese espacio en el documento; `git diff --check a89aeaf0` devuelve exit 0, sin cambios en fuente ni tests. Se vuelve a comprobar contra HEAD después de incorporar la evidencia.

Cierre de Codex completo (T0–T6): no queda ninguna parada activa. R12 queda para el smoke humano en el dev build de Android. No se ha ejecutado init.sh, tocado infraestructura, hecho push ni abierto PR.
