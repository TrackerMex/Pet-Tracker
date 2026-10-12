Worktree: /home/claude/sites/Pet-Tracker-wt-169

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-169
$ git branch --show-current
feature/169-mobile-weight-draw-and-toasts
$ git rev-parse --short HEAD
fc384b44
$ git status --short
```

H0: `fc384b44`. Branch correcta; status vacío. Todo diff de esta sesión se mide contra H0. No se ejecuta init.sh: lo corre el leader según el handoff.

## Preparación

```text
$ cd /home/claude/sites/Pet-Tracker-wt-169/mobile-pet-tracker && pwd
/home/claude/sites/Pet-Tracker-wt-169/mobile-pet-tracker
$ git fetch origin
(sin salida, exit=0)
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=0
$ test -d node_modules && echo presente
presente
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
$ pgrep -af '[i]nit\.sh'
(vacío; pgrep exit=1 indica ausencia)
```

Skills cargadas:

- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md`.
- `animate-expo`: `.agents/skills/animate-expo/SKILL.md`.
- `ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.1.0/skills/ponytail/SKILL.md`.

Leídas las specs completas, architecture, carta de UI, convenciones de tests/esperas, verification y CHECKPOINTS. Consultada la documentación versionada `https://docs.expo.dev/versions/v57.0.0/` según mobile-pet-tracker/AGENTS.md.
La carta y la spec prevalecen sobre las skills: tokens y clases existentes, investigación ya realizada por el leader y smoke Android humano. Propósito: feedback; dibujo de relleno a 250 ms en UI thread, toast ocasional con opacidad (250/150 ms) y háptico en el mismo bloque de éxito. P1-P7 permanecen cerradas.

## Anclas en H0

### A1

```sh
grep -cF '<Polyline' src/components/weight-chart.tsx
```
```text
1
```

### A2

```sh
grep -cF "from 'react-native-reanimated'" src/components/weight-chart.tsx
```
```text
0
```

### A3

```sh
grep -cF 'createAnimatedComponent' src/components/weight-chart.tsx
```
```text
0
```

### A4

```sh
grep -cF 'useReducedMotion' src/components/weight-chart.tsx
```
```text
0
```

### A5

```sh
grep -cF 'export const MOTION_FILL_TIMING' src/theme/motion.ts
```
```text
1
```

### A6

```sh
grep -cF 'withTiming(pct, MOTION_FILL_TIMING)' src/screens/home/collar-battery-bar.tsx
```
```text
1
```

### A7

```sh
grep -cF 'Haptics' src/screens/weight-log/index.tsx
```
```text
0
```

### A8

```sh
grep -cF 'Haptics.notificationAsync(' 'src/app/(tabs)/food.tsx'
```
```text
1
```

### A9

```sh
grep -cF "case 'ok':" src/screens/weight-log/index.tsx
```
```text
1
```

### A10

```sh
grep -cF 'testID="weight-chart-card"' src/screens/weight-log/index.tsx
```
```text
1
```

### A11

```sh
grep -cF 'style={TABULAR_NUMS}' src/screens/weight-log/index.tsx
```
```text
2
```

### A12

```sh
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/weight-log/index.tsx
```
```text
1
```

### A13

```sh
grep -cF 'function fmtVariation' src/screens/weight-log/index.tsx
```
```text
1
```

### A14

```sh
grep -cF 'civilTodayIso(profileTimeZone)' src/screens/weight-log/index.tsx
```
```text
1
```

### A15

```sh
grep -cF 'testID={`weight-row-${entry.id}`}' src/screens/weight-log/index.tsx
```
```text
1
```

### A16

```sh
grep -cF '.orderBy(desc(weights.measuredAt), desc(weights.id))' ../backend-pet-tracker/src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts
```
```text
2
```

### A17

```sh
grep -cF "measuredAt: '2026-08-21'" src/screens/weight-log/index.test.tsx
```
```text
1
```

### A18

```sh
grep -cF 'WeightChart: jest.fn(actual.WeightChart),' src/screens/health/index.test.tsx
```
```text
1
```

### B1

```sh
grep -cF -e '- 1, // #159 R2' src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### B2

```sh
grep -cF "{ file: 'src/screens/weight-log/index.tsx', key:" src/__tests__/ui-copy-table.ts
```
```text
17
```

### B3

```sh
grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2);' src/__tests__/ui-language.test.ts
```
```text
1
```

### B4

```sh
grep -cF "[join('screens', 'weight-log', 'index.tsx'), 2]," src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### B5

```sh
grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### B6

```sh
grep -cF "[join('screens', 'weight-log', 'index.tsx'), 1]," src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### B7

```sh
grep -cF "'MOTION_BLINK_TIMING'," src/theme/__tests__/motion.test.ts
```
```text
1
```

### B8

```sh
grep -cF 'rounded-xl bg-accent' src/screens/weight-log/index.tsx
```
```text
1
```

### B9

```sh
grep -cF '<Button' src/screens/weight-log/index.tsx
```
```text
3
```

### B10

```sh
grep -cF '<Pressable' src/screens/weight-log/index.tsx
```
```text
0
```

### B11

```sh
grep -cF 'border-b-4' src/screens/weight-log/index.tsx
```
```text
1
```

### X1

```sh
grep -c '^### §2\.' ../specs/mobile-ui-language/design.md
```
```text
23
```

### X2

```sh
grep -cF '${tileClassName}' src/screens/weight-log/index.tsx
```
```text
1
```

### X3

```sh
grep -cF 'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}' src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### X4

```sh
grep -cF 'size={15}' src/screens/weight-log/index.tsx
```
```text
3
```

### X5

```sh
grep -cF 'jest.mock(' src/screens/weight-log/index.test.tsx
```
```text
5
```

### X6

```sh
grep -cF "jest.mock('react-native-svg'" src/components/__tests__/weight-chart.test.tsx
```
```text
1
```

### X7

```sh
grep -cF "describe('R8: la gráfica degrada con <2 puntos'" src/components/__tests__/weight-chart.test.tsx
```
```text
1
```

### X8

```sh
grep -cF 'KeyboardAvoidingView' src/screens/weight-log/index.tsx
```
```text
3
```

### X9

```sh
grep -cF "describe('R9: alta de peso con degradación por kind'" src/screens/weight-log/index.test.tsx
```
```text
1
```

### X10

```sh
grep -cF 'weights.refetch();' src/screens/weight-log/index.tsx
```
```text
1
```

### X11

```sh
grep -cF 'function makeProfile(' src/screens/weight-log/index.test.tsx
```
```text
1
```

### X12

```sh
grep -cF 'function makeWeight(' src/screens/weight-log/index.test.tsx src/components/__tests__/weight-chart.test.tsx
```
```text
src/screens/weight-log/index.test.tsx:1
src/components/__tests__/weight-chart.test.tsx:1
```

### X13

```sh
grep -cF -e 'export const MOTION_FILL_TIMING' -e 'export const MOTION_TRANSITION_MS' -e 'export const MOTION_FEEDBACK_MS' src/theme/motion.ts
```
```text
3
```

### X14

```sh
grep -cF 'export function civilTodayIso' src/utils/civil-today-iso.ts
```
```text
1
```

### X15

```sh
test ! -e src/utils/monthly-weight-delta.ts && test ! -e src/utils/monthly-weight-delta.test.ts; echo "exit=$?"
```
```text
exit=0
```

### X16

```sh
grep -cF "describe('#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros'" src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### X17

```sh
grep -cF "it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas'" src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### X18

```sh
grep -cF 'const escapeRegExp = (value: string) =>' src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### X19

```sh
grep -cF "it('resuelve las 32 ocurrencias normativas'" src/__tests__/ui-language.test.ts
```
```text
1
```

### X20

```sh
grep -cF "it('resuelve cada ocurrencia de la tabla contra la clave exacta'" src/__tests__/ui-language.test.ts
```
```text
1
```

### X21

```sh
grep -cF "describe('#62 R15: todo contador usa cifras tabulares'" src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### X22

```sh
grep -cF "it.each(counters)('%s aplica TABULAR_NUMS a sus %i valores'" src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### X23

```sh
grep -cF "from '../../theme/use-theme-colors'" src/screens/weight-log/index.tsx
```
```text
1
```

### H1

```sh
grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-11)' specs/mobile-weight-draw-and-toasts/requirements.md
```
```text
1
```

### H2

```sh
grep -cF -- '- [ ] Smoke de R14 superado por humano (fecha: ____, dispositivo: ____)' specs/mobile-weight-draw-and-toasts/requirements.md
```
```text
1
```

### H3

```sh
grep -cF '"status": "in_progress"' feature_list.json
```
```text
1
```

### H4

```sh
grep -rlF '#169' mobile-pet-tracker/src | wc -l
```
```text
0
```


## BASE

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/ui-language.test.ts src/__tests__/legibility-classnames.test.ts src/components/__tests__/weight-chart.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/motion.test.ts src/screens/health/index.test.tsx src/screens/weight-log/index.test.tsx > /tmp/169-base.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
  ● Console
  ● Console
Test Suites: 9 passed, 9 total
Tests:       326 passed, 326 total
```

Incidencia auxiliar de lectura: el extractor de cadenas encontró la mención final de c8 como si fuera otra cabecera. No ejecutó ninguna cadena ni modificó código. Se acotó a las 25 cabeceras reales y se verificó su cantidad.

## ALL base

```sh
FORCE_COLOR=0 bunx jest > /tmp/169-all-base.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
Test Suites: 98 passed, 98 total
Tests:       2775 passed, 2775 total
```

## c1 — T1 rojo — R1


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-r1.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R1: la línea se dibuja al montarse › dibuja la línea de tres pesos desde la longitud de la polilínea
  ● #169 R1: la línea se dibuja al montarse › empieza oculta en el primer frame
  ● #169 R1: la línea se dibuja al montarse › con dos pesos iguales la longitud es 100
Test Suites: 1 failed, 1 total
Tests:       3 failed, 5 passed, 8 total
```

```text
  ● #169 R1: la línea se dibuja al montarse › dibuja la línea de tres pesos desde la longitud de la polilínea

    expect(received).toEqual(expected) // deep equality

    Expected: [NumberCloseTo 104.9952 (3 digits), NumberCloseTo 104.9952 (3 digits)]
    Received: undefined
```

```text
  ● #169 R1: la línea se dibuja al montarse › empieza oculta en el primer frame

    expect(received).toEqual(expected) // deep equality

    Expected: {"strokeDashoffset": NumberCloseTo 104.9952 (3 digits)}
    Received: undefined
```

```text
  ● #169 R1: la línea se dibuja al montarse › con dos pesos iguales la longitud es 100

    expect(received).toEqual(expected) // deep equality

    Expected: [100, 100]
    Received: undefined
```

Commit c1 R1: `98db0006 test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)`. Cadena c1 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache` exit=0; stage exacto y LIMPIO verificados.

## c2 — T1 verde — R1


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx src/screens/health/index.test.tsx src/screens/weight-log/index.test.tsx > /tmp/169-g1.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
  ● Console
  ● Console
Test Suites: 3 passed, 3 total
Tests:       108 passed, 108 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g1-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Commit c2: `ba30d410 feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)`. Cadena c2 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache` exit=0; stage exacto y LIMPIO verificados.

## S1 — sobre c2 ba30d410


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-s1.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R1: la línea se dibuja al montarse › deja el área quieta
Test Suites: 1 failed, 1 total
Tests:       1 failed, 7 passed, 8 total
```

```text
  ● #169 R1: la línea se dibuja al montarse › deja el área quieta

    expect(received).toBeUndefined()

    Received: {"value": {"strokeDashoffset": 104.9952379872535}}
```

Mutación: Polygon animado con lineProps. Solo falla `deja el área quieta`, por aserción.

S1 revertida con `git checkout HEAD -- src/components/weight-chart.tsx`; `git diff --cached --quiet && git diff --quiet; echo "limpio=$?"` → `limpio=0`.

## c3 — T2 rojo — R2


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-r2.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R2: los puntos aparecen con el mismo progreso › termina con los puntos visibles
  ● #169 R2: los puntos aparecen con el mismo progreso › empieza con los puntos ocultos en el primer frame
  ● #169 R2: los puntos aparecen con el mismo progreso › agrupa un Circle por entrada y ninguno fuera
Test Suites: 1 failed, 1 total
Tests:       3 failed, 8 passed, 11 total
```

```text
  ● #169 R2: los puntos aparecen con el mismo progreso › termina con los puntos visibles

Unable to find an element with testID: weight-chart-points
```

```text
  ● #169 R2: los puntos aparecen con el mismo progreso › empieza con los puntos ocultos en el primer frame

Unable to find an element with testID: weight-chart-points
```

```text
  ● #169 R2: los puntos aparecen con el mismo progreso › agrupa un Circle por entrada y ninguno fuera

Unable to find an element with testID: weight-chart-points
```

Commit c3: `9d4c3b51 test(mobile): los puntos de peso aparecen con el trazo (#169 R2)`. Cadena c3 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache` exit=0; stage exacto y LIMPIO verificados.

## c4 — T2 verde — R2


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx src/screens/health/index.test.tsx src/screens/weight-log/index.test.tsx > /tmp/169-g2.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
  ● Console
  ● Console
Test Suites: 3 passed, 3 total
Tests:       111 passed, 111 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g2-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Commit c4: `af6322d5 feat(mobile): puntos de peso con opacidad animada (#169 R2)`. Cadena c4 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache` exit=0; stage exacto y LIMPIO verificados.

## c5 — T3 rojo — R3


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-r3.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R3: bajo reduce motion la gráfica sale completa › sale completa sin llamar a withTiming
Test Suites: 1 failed, 1 total
Tests:       1 failed, 11 passed, 12 total
```

```text
  ● #169 R3: bajo reduce motion la gráfica sale completa › sale completa sin llamar a withTiming

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: 1, {"duration": 250, "easing": {"factory": [Function reactNativeReanimated_EasingJs15]}, "reduceMotion": "system"}
```

Commit c5: `e68d6579 test(mobile): la gráfica de peso respeta reduce motion (#169 R3)`. Cadena c5 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache` exit=0; stage exacto y LIMPIO verificados.

## c6 — T3 verde — R3


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx src/screens/health/index.test.tsx src/screens/weight-log/index.test.tsx > /tmp/169-g3.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
  ● Console
  ● Console
Test Suites: 3 passed, 3 total
Tests:       112 passed, 112 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g3-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Commit c6: `8aaab5bc feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)`. Cadena c6 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache` exit=0; stage exacto y LIMPIO verificados.

## c7 — T4 tests — R4 nace verde


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-r4.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-r4-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

GUARDAS adicional medido para el registro pedido al cierre; c7 conserva su cadena literal y no hay commit verde de R4.

## PARADA — c7: eslint terminó por SIGKILL

La cadena literal de c7 ejecutó `bun run typecheck` (exit=0) y después `bunx expo lint --no-cache`. Este último imprimió un fallo del proceso eslint, pero el wrapper devolvió 0 y el `&&` permitió el commit. La salida observada fue:

```text
error: Failed to run "eslint" due to signal SIGKILL
[feature/169-mobile-weight-draw-and-toasts 9f78ebbc] test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)
1 file changed, 41 insertions(+)
exit=0
```

Commit c7 R4: `9f78ebbc test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)`. Router ausente, typecheck verde, stage exacto y LIMPIO verificados por la cadena. **Lint NO verificado:** exit del wrapper = 0, proceso eslint = SIGKILL. No se declara c7 válido por lint, ni se repite la cadena, ni se resetea/amenda el commit. Se aplica la parada del handoff ante cualquier fallo no esperado.

No se plantaron S4a ni S4b. Pendientes: S4a, S4b y c8–c27 (T5–T13, trazabilidad y lista cerrada). No se tocaron trazabilidad, status, history/current, feature_list, requirements ni los demás worktrees. No se ejecutó init.sh, no hubo push ni PR.

Comprobación al parar:

```text
$ git status --short
?? progress/impl_mobile-weight-draw-and-toasts.md
$ git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
limpio=0
```

El impl queda sin stagear, como exige el handoff hasta c26. El leader debe resolver el fallo de ejecución de eslint y revisar c7 antes de indicar la continuación. No se atribuye una causa al SIGKILL sin evidencia suficiente.

## Smoke humano R14 — preparado, sin ejecutar

Después de la aprobación del reviewer, en el dev build de Android:

1. En Peso y en Salud, la línea se dibuja de izquierda a derecha al abrir, los puntos aparecen con ella y el área está quieta.
2. Con «Quitar animaciones» activado en Ajustes → Accesibilidad, la gráfica sale completa sin dibujo y el toast aparece sin fundido.
3. Al registrar un peso, el toast aparece arriba, no tapa el formulario ni bloquea toques y se va solo en unos 2,5 s. El teléfono vibra una vez, a la vez que aparece el toast.
4. Un alta con error (por ejemplo, sin red) no vibra ni muestra el toast.
5. El resumen muestra el peso actual grande y el delta del mes con su color.

R14: pendiente del smoke humano

## Reanudacion 1

```text
$ cd /home/claude/sites/Pet-Tracker-wt-169 && pwd
/home/claude/sites/Pet-Tracker-wt-169
$ git branch --show-current
feature/169-mobile-weight-draw-and-toasts
$ git rev-parse --short HEAD
e4903ae1
$ git log --oneline fc384b44..HEAD
e4903ae1 chore(harness): #169 reanudación 1 tras el SIGKILL de eslint en c7
9f78ebbc test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)
8aaab5bc feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)
e68d6579 test(mobile): la gráfica de peso respeta reduce motion (#169 R3)
af6322d5 feat(mobile): puntos de peso con opacidad animada (#169 R2)
9d4c3b51 test(mobile): los puntos de peso aparecen con el trazo (#169 R2)
ba30d410 feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)
98db0006 test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)
$ git status --short
?? progress/impl_mobile-weight-draw-and-toasts.md
```

Arranque conforme; H0 permanece `fc384b44`. Se conserva todo el registro anterior. El leader validó c7 con lint exit=0 y salida vacía y comprobó el lint de c1–c6 en cada commit (evidencia en el handoff de e4903ae1). c7 vale sin reset/amend. No se repiten anclas, BASE ni ALL de la base.

Releído el handoff completo y su Reanudación 1. Continúan las skills ya cargadas y sus límites de la carta/spec. Cadenas c9–c25: lint redirigido a `/tmp/169-lint.txt` y guardado por `test ! -s`; salida no vacía bloquea el commit. SIGKILL permite solo un reintento de la cadena completa, con medidas y tras pgrep vacío. Los demás fallos siguen siendo parada. Se reanuda por S4a/S4b sobre e4903ae1.

## S4a — sobre HEAD e4903ae1 (c7 intacto)


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-s4a.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R4: cuándo se vuelve a dibujar › R4a: con la gráfica montada, otros datos no repiten el dibujo
Test Suites: 1 failed, 1 total
Tests:       1 failed, 14 passed, 15 total
```

```text
  ● #169 R4: cuándo se vuelve a dibujar › R4a: con la gráfica montada, otros datos no repiten el dibujo

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2
```

Mutación: se añade L a las dependencias. El efecto se desplaza tras la declaración de L para evaluar la dependencia ya inicializada; no cambia ninguna otra lógica. Se revierte todo junto.

S4a revertida con `git checkout HEAD -- src/components/weight-chart.tsx`; `git diff --cached --quiet && git diff --quiet; echo "limpio=$?"` → `limpio=0`.

## S4b — sobre HEAD e4903ae1


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-s4b.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R4: cuándo se vuelve a dibujar › R4b: pasar de una entrada a tres dibuja una vez
  ● #169 R4: cuándo se vuelve a dibujar › R4c: volver a menos de dos entradas y otra vez a tres dibuja de nuevo
Test Suites: 1 failed, 1 total
Tests:       2 failed, 13 passed, 15 total
```

```text
  ● #169 R4: cuándo se vuelve a dibujar › R4b: pasar de una entrada a tres dibuja una vez

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0
```

```text
  ● #169 R4: cuándo se vuelve a dibujar › R4c: volver a menos de dos entradas y otra vez a tres dibuja de nuevo

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 2
    Received number of calls: 1
```

Variante guardada: WeightChart monta siempre Plot; useTranslate en Plot; efecto guardado por entries.length >= 2; fallback tras todos los hooks. Solo fallan R4b (1/0) y R4c (2/1), por aserción.

S4b revertida con `git checkout HEAD -- src/components/weight-chart.tsx`; `git diff --cached --quiet && git diff --quiet; echo "limpio=$?"` → `limpio=0`. R4 queda demostrado, sin commit verde.

## c8 — T5 rojo — R5


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/monthly-weight-delta.test.ts > /tmp/169-r5.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● Test suite failed to run
Test Suites: 1 failed, 1 total
Tests:       0 total
```

```text
  ● Test suite failed to run

    Cannot find module './monthly-weight-delta' from 'src/utils/monthly-weight-delta.test.ts'

    However, Jest was able to find:
    	'./monthly-weight-delta.test.ts'

    You might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'].

    See https://jestjs.io/docs/configuration#modulefileextensions-arraystring
```

Rojo de módulo nuevo: Cannot find module './monthly-weight-delta'. Typecheck exit=2 y lint exit=1 son intencionados y medidos aparte, única excepción a las cadenas.

```sh
bun run typecheck > /tmp/169-r5-tsc.txt 2>&1; echo "exit=$?"
```
```text
exit=2
$ tsc --noEmit
src/utils/monthly-weight-delta.test.ts(2,36): error TS2307: Cannot find module './monthly-weight-delta' or its corresponding type declarations.

```

```sh
bunx expo lint --no-cache > /tmp/169-r5-lint.txt 2>&1; echo "exit=$?"
```
```text
exit=1

/home/claude/sites/Pet-Tracker-wt-169/mobile-pet-tracker/src/utils/monthly-weight-delta.test.ts
  2:36  error  Unable to resolve path to module './monthly-weight-delta'  import/no-unresolved

✖ 1 problem (1 error, 0 warnings)

error: "eslint" exited with code 1

```

Commit c8 R5: `5830f1cf test(mobile): delta mensual de peso en cliente (#169 R5)`. Cadena c8 exit=0; comprobados el único TS2307 y el único error import/no-unresolved. Router ausente; stage exacto y LIMPIO verificados. No hay typecheck/lint verdes en c8 por la excepción literal del handoff.

## c9 — T5 verde — R5


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/monthly-weight-delta.test.ts > /tmp/169-g5.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g5-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Commit c9: `f1df1f73 feat(mobile): monthlyWeightDelta (#169 R5)`. Cadena c9 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c10 — T6 rojo — R9


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx > /tmp/169-r9.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
  ● #169 R9: claves de peso nuevas › registra las dos claves en los dos idiomas y en la tabla de la spec de idioma
Test Suites: 1 failed, 1 total
Tests:       2 failed, 24 passed, 26 total
```

```text
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas

    expect(received).toHaveLength(expected)

    Expected length: 388
    Received length: 386
    Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.checkPetDetails", "addPet.chooseBirthDate", …]
```

```text
  ● #169 R9: claves de peso nuevas › registra las dos claves en los dos idiomas y en la tabla de la spec de idioma

    expect(received).toBe(expected) // Object.is equality

    Expected: "Logged. I've added it to the chart."
    Received: undefined
```

Commit c10: `c832b4d8 test(mobile): claves de catálogo del resumen y el toast de peso (#169 R9)`. Cadena c10 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c11 — T6 verde — R9


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/169-g9.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       56 passed, 56 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g9-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Commit c11: `9c9c9382 feat(mobile): claves weightLog.weightLogged y monthDelta (#169 R9)`. Cadena c11 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c12 — T7 rojo — R8


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r8.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R8: chip de delta por entrada › fila w-up con su tono, icono y texto
  ● #169 R8: chip de delta por entrada › fila w-down con su tono, icono y texto
  ● #169 R8: chip de delta por entrada › fila w-flat con su tono, icono y texto
  ● #169 R8: chip de delta por entrada › fila w-none con su tono, icono y texto
Test Suites: 1 failed, 1 total
Tests:       4 failed, 33 passed, 37 total
```

```text
  ● #169 R8: chip de delta por entrada › fila w-up con su tono, icono y texto

Unable to find an element with testID: weight-row-w-up-tone
```

```text
  ● #169 R8: chip de delta por entrada › fila w-down con su tono, icono y texto

Unable to find an element with testID: weight-row-w-down-tone
```

```text
  ● #169 R8: chip de delta por entrada › fila w-flat con su tono, icono y texto

Unable to find an element with testID: weight-row-w-flat-tone
```

```text
  ● #169 R8: chip de delta por entrada › fila w-none con su tono, icono y texto

Unable to find an element with testID: weight-row-w-none-tone
```

Dobles de iconos y tema según la tabla de tasks; tamaño de iconos de filas medido en el fuente = 15. Factory local del doble conserva exactamente testID, size y style.color. Props intermedias para aceptar size en View bajo TypeScript; se repitió el rojo tras ese ajuste de tipado. Helper prepareWeightLogTests reutiliza el contexto de los describes nuevos; no duplica makeWeight/makeProfile/renderWeightLog/pending. Una búsqueda auxiliar del .d.ts del matcher usó una ruta inexistente; no ejecutó ni cortó una cadena de verificación.

## PARADA — Reanudacion 1 — cadena c12 / typecheck


La cadena c12 no llegó al commit: `bun run typecheck` devolvió exit=2, TS2769 en src/screens/weight-log/index.test.tsx:71. El doble de iconos pasa `style: { color }` a un View; TypeScript rechaza ese estilo como ViewStyle. No hay SIGKILL ni Killed y no aplica el reintento. Lint de c12 no ejecutado; stage y commit de c12 no ejecutados. No se modifica el doble después de la parada, no se inventa un workaround y no se toca producción.

Cadena c12 ejecutada (lint con el guard de Reanudacion 1):

```sh
grep -qE '^Tests: +4 failed, 33 passed, 37 total$' /tmp/169-r8.txt \
  && test "$(grep -E '^  ● ' /tmp/169-r8.txt | grep -cvxF '  ● Console')" = 4 \
  && test "$(grep -E '^  ● ' /tmp/169-r8.txt | grep -cF '#169 R8: chip de delta por entrada')" = 4 \
  && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r8.txt \
  && grep -qF 'Unable to find an element with testID: weight-row-w-up-tone' /tmp/169-r8.txt \
  && ! (grep -F 'Unable to find an element with testID:' /tmp/169-r8.txt | grep -vqE 'testID: weight-row-w-(up|down|flat|none)-tone$') \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt \
  && git add src/screens/weight-log/index.test.tsx \
  && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.test.tsx' \
  && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
  && git commit -m 'test(mobile): candado del chip de delta por entrada de peso (#169 R8)'
```

Salida completa del eslabón fallido:

```text
$ tsc --noEmit
src/screens/weight-log/index.test.tsx(71,38): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '{ testID: string; size: number | undefined; style: { color: string | undefined; }; }' is not assignable to parameter of type 'Attributes & ViewProps'.
      Types of property 'style' are incompatible.
        Type '{ color: string | undefined; }' is not assignable to type 'StyleProp<ViewStyle>'.
exit=2
```

Estado al parar:

```text
HEAD: 9c9c9382
 M mobile-pet-tracker/src/screens/weight-log/index.test.tsx
?? progress/impl_mobile-weight-draw-and-toasts.md
indice_limpio=0
```

Terminados en esta reanudación: S4a y S4b (revertidas, limpio=0), c8 5830f1cf (R5 rojo), c9 f1df1f73 (R5 verde), c10 c832b4d8 (R9 rojo), c11 9c9c9382 (R9 verde). Cadenas c9–c11: typecheck=0, lint=0 y log vacío. c12 queda sin commit, con el rojo medido y el error de tipado del doble pendiente de resolver por el leader. Pendientes c12–c27 y cierre. No se repitieron las bases/anclas, no se corrió init.sh y no hubo push ni PR. Se conserva íntegra la primera PARADA.

Incidencia del registrador: la primera composición del script para guardar la parada produjo un SyntaxError antes de escribir. Se corrigió la composición del texto y se guardó esta evidencia, sin repetir ni modificar la cadena c12.

R14: pendiente del smoke humano

## Reanudacion 2

```text
$ cd /home/claude/sites/Pet-Tracker-wt-169 && pwd
/home/claude/sites/Pet-Tracker-wt-169
$ git branch --show-current
feature/169-mobile-weight-draw-and-toasts
$ git rev-parse --short HEAD
19e308f6
$ git log --oneline fc384b44..HEAD
19e308f6 chore(harness): #169 reanudación 2 tras el TS2769 del doble de reicon en c12
9c9c9382 feat(mobile): claves weightLog.weightLogged y monthDelta (#169 R9)
c832b4d8 test(mobile): claves de catálogo del resumen y el toast de peso (#169 R9)
f1df1f73 feat(mobile): monthlyWeightDelta (#169 R5)
5830f1cf test(mobile): delta mensual de peso en cliente (#169 R5)
e4903ae1 chore(harness): #169 reanudación 1 tras el SIGKILL de eslint en c7
9f78ebbc test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)
8aaab5bc feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)
e68d6579 test(mobile): la gráfica de peso respeta reduce motion (#169 R3)
af6322d5 feat(mobile): puntos de peso con opacidad animada (#169 R2)
9d4c3b51 test(mobile): los puntos de peso aparecen con el trazo (#169 R2)
ba30d410 feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)
98db0006 test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)
$ git diff --cached --name-only
(vacío)
$ git status --short
 M mobile-pet-tracker/src/screens/weight-log/index.test.tsx
?? progress/impl_mobile-weight-draw-and-toasts.md
```

Arranque conforme. H0 sigue siendo `fc384b44`. Las dos PARADAS se conservan. Se relee el handoff completo, incluidas Reanudaciones 1/2, y la fila enmendada de reicon en tasks. Skills ya cargadas y límites de la carta/spec siguen vigentes. No se repiten anclas iniciales, BASE/ALL base ni S4a/S4b. Se cambia únicamente el doble reicon no commiteado a Text y function MockIcon, tal como prescribe el leader. Persisten lint con log vacío y el único reintento autorizado por SIGKILL.

### Anclas del doble en Reanudacion 2

```sh
grep -cF "const { Text } = jest.requireActual<typeof import('react-native')>('react-native');" src/screens/weight-log/index.test.tsx
```
```text
1
```

```sh
grep -cF "function MockIcon({ size, color }: { size?: number; color?: string }) {" src/screens/weight-log/index.test.tsx
```
```text
1
```

```sh
grep -cF "return React.createElement(Text, props);" src/screens/weight-log/index.test.tsx
```
```text
1
```

```sh
grep -cF "return React.createElement(View, props);" src/screens/weight-log/index.test.tsx
```
```text
1
```

```sh
grep -cF "({ size, color }: { size?: number; color?: string }) => {" src/screens/weight-log/index.test.tsx
```
```text
0
```


## c12 — T7 rojo — R8 — Reanudacion 2


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r8.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R8: chip de delta por entrada › fila w-up con su tono, icono y texto
  ● #169 R8: chip de delta por entrada › fila w-down con su tono, icono y texto
  ● #169 R8: chip de delta por entrada › fila w-flat con su tono, icono y texto
  ● #169 R8: chip de delta por entrada › fila w-none con su tono, icono y texto
Test Suites: 1 failed, 1 total
Tests:       4 failed, 33 passed, 37 total
```

```text
  ● #169 R8: chip de delta por entrada › fila w-up con su tono, icono y texto

Unable to find an element with testID: weight-row-w-up-tone
```

```text
  ● #169 R8: chip de delta por entrada › fila w-down con su tono, icono y texto

Unable to find an element with testID: weight-row-w-down-tone
```

```text
  ● #169 R8: chip de delta por entrada › fila w-flat con su tono, icono y texto

Unable to find an element with testID: weight-row-w-flat-tone
```

```text
  ● #169 R8: chip de delta por entrada › fila w-none con su tono, icono y texto

Unable to find an element with testID: weight-row-w-none-tone
```

Único cambio desde el test pendiente de Reanudacion 1: doble reicon con Text y function MockIcon. Las cinco anclas nuevas dan 1,1,1,1,0. El describe R8, el mock del tema, prepareWeightLogTests y expo-router permanecen intactos.

Commit c12: `6569bd89 test(mobile): candado del chip de delta por entrada de peso (#169 R8)`. Cadena c12 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## PARADA — Reanudacion 2 — medida PESO de c13


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-g8.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● Console
  ● R7: weight log lista el historial › keeps API order and renders each weight detail
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 129 passed, 130 total
```

```text
  ● R7: weight log lista el historial › keeps API order and renders each weight detail

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 4

      Array [
        "weight-row-weight-1",
    +   "weight-row-weight-1-tone",
    +   "weight-row-weight-1-delta",
        "weight-row-weight-2",
    +   "weight-row-weight-2-tone",
    +   "weight-row-weight-2-delta",
      ]
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g8-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

El único cambio de producción de c13 son los dos testIDs literales prescritos. La medida PESO no cumple el primer guard de su cadena (130 passed). Falla un test preexistente: R7: weight log lista el historial › keeps API order and renders each weight detail. Su getAllByTestId con el prefijo weight-row- incluye ahora los dos nodos nuevos por fila (-tone y -delta). Espera dos IDs de filas y recibe seis IDs. Los cuatro tests de R8 pasan; GUARDAS=92. No hay SIGKILL ni Killed: parada sin reintento. La cadena de commit de c13 no se ejecuta porque su medida inicial salió inesperadamente roja; typecheck y lint de c13 no se ejecutan. Ningún commit verde de c13, ninguna edición del test existente.

Estado al parar en c13:

```text
HEAD: 6569bd89
 M mobile-pet-tracker/src/screens/weight-log/index.tsx
?? progress/impl_mobile-weight-draw-and-toasts.md
indice_limpio=0
```

En esta reanudación se cerró c12 (`6569bd89`, R8 rojo) con typecheck=0, lint=0 y salida vacía. Los dos testIDs de c13 quedan sin stagear. Se conserva el test existente sin cambios; el leader debe revisar el selector que coincide con los nuevos nodos antes de indicar continuación. No se hicieron c13–c27 ni cierre, ni se repitieron las bases/anclas/S4a/S4b. No se ejecutó init.sh y no hubo push ni PR. Todo lo anterior del impl queda intacto, incluidas las dos PARADAS previas.

R14: pendiente del smoke humano

## Reanudacion 3

```text
$ cd /home/claude/sites/Pet-Tracker-wt-169 && pwd
/home/claude/sites/Pet-Tracker-wt-169
$ git branch --show-current
feature/169-mobile-weight-draw-and-toasts
$ git rev-parse --short HEAD
dc62f11a
$ git log --oneline fc384b44..HEAD
dc62f11a chore(harness): #169 reanudación 3 tras el selector de R7 en c13
6569bd89 test(mobile): candado del chip de delta por entrada de peso (#169 R8)
19e308f6 chore(harness): #169 reanudación 2 tras el TS2769 del doble de reicon en c12
9c9c9382 feat(mobile): claves weightLog.weightLogged y monthDelta (#169 R9)
c832b4d8 test(mobile): claves de catálogo del resumen y el toast de peso (#169 R9)
f1df1f73 feat(mobile): monthlyWeightDelta (#169 R5)
5830f1cf test(mobile): delta mensual de peso en cliente (#169 R5)
e4903ae1 chore(harness): #169 reanudación 1 tras el SIGKILL de eslint en c7
9f78ebbc test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)
8aaab5bc feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)
e68d6579 test(mobile): la gráfica de peso respeta reduce motion (#169 R3)
af6322d5 feat(mobile): puntos de peso con opacidad animada (#169 R2)
9d4c3b51 test(mobile): los puntos de peso aparecen con el trazo (#169 R2)
ba30d410 feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)
98db0006 test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)
$ git diff --cached --name-only
(vacío)
$ git status --short
 M mobile-pet-tracker/src/screens/weight-log/index.tsx
?? progress/impl_mobile-weight-draw-and-toasts.md
```

Arranque conforme; H0 sigue siendo `fc384b44`. Se conservan íntegros los registros previos y las tres PARADAS. Releídos el handoff completo y T7 (2) enmendado. Se mantiene el doble Text/MockIcon, lint con log vacío y un solo reintento por SIGKILL. No se repiten las bases, las anclas iniciales ni S4a/S4b. c13 incorpora únicamente los dos testIDs pendientes y el selector exacto autorizado de R7, en dos ficheros.

### Anclas del selector en Reanudacion 3

```sh
grep -cF 'getAllByTestId(/^weight-row-weight-\d+$/)' src/screens/weight-log/index.test.tsx
```
```text
1
```

```sh
grep -cF 'getAllByTestId(/^weight-row-/)' src/screens/weight-log/index.test.tsx
```
```text
0
```


## c13 — T7 verde — R8 — Reanudacion 3


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-g8.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       130 passed, 130 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g8-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Cadena enmendada: stage exacto de index.tsx e index.test.tsx; único cambio de test es el selector anclado a las filas weight-N. Lista esperada y dobles intactos.

Commit c13: `b294c719 feat(mobile): testIDs del chip de delta por entrada (#169 R8)`. Cadena c13 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c14 — T8 rojo — R6


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r6-wl.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R6: resumen del peso en la card de la gráfica › en Pacific/Pago_Pago pinta el peso actual y el delta del día civil
  ● #169 R6: resumen del peso en la card de la gráfica › en Pacific/Kiritimati pinta el peso actual y el delta del día civil
  ● #169 R6: resumen del peso en la card de la gráfica › pinta el resumen dentro de la card y antes de la gráfica
Test Suites: 1 failed, 1 total
Tests:       3 failed, 38 passed, 41 total
```

```text
  ● #169 R6: resumen del peso en la card de la gráfica › en Pacific/Pago_Pago pinta el peso actual y el delta del día civil

Unable to find an element with testID: weight-current
```

```text
  ● #169 R6: resumen del peso en la card de la gráfica › en Pacific/Kiritimati pinta el peso actual y el delta del día civil

Unable to find an element with testID: weight-current
```

```text
  ● #169 R6: resumen del peso en la card de la gráfica › pinta el resumen dentro de la card y antes de la gráfica

Unable to find an element with testID: weight-summary
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/ui-language.test.ts > /tmp/169-r6-ul.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #65 R5: Health resuelve su copy por clave › resuelve las 32 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
```

```text
  ● #65 R5: Health resuelve su copy por clave › resuelve las 32 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/weight-log/index.tsx",
        "key": "weightLog.monthDelta",
    -   "uses": 1,
    +   "uses": 0,
      }
```

```text
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/weight-log/index.tsx",
        "key": "weightLog.monthDelta",
    -   "uses": 1,
    +   "uses": 0,
      }
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/169-r6-cc.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #62 R15: todo contador usa cifras tabulares › screens/weight-log/index.tsx aplica TABULAR_NUMS a sus 4 valores
Test Suites: 1 failed, 1 total
Tests:       1 failed, 62 passed, 63 total
```

```text
  ● #62 R15: todo contador usa cifras tabulares › screens/weight-log/index.tsx aplica TABULAR_NUMS a sus 4 valores

    expect(received).toHaveLength(expected)

    Expected length: 4
    Received length: 2
    Received array:  ["style={TABULAR_NUMS}", "style={TABULAR_NUMS}"]
```

Los candados agregados usan las cuatro líneas exactas del handoff. Espera de las zonas anclada al valor visible de weight-date-input; la ausencia se ancla al fallback visible. Tres rojos por consulta en Peso, dos por aserción en idioma y uno por aserción en TABULAR_NUMS; cero entradas nace verde.

Commit c14: `b10d1dab test(mobile): resumen de peso actual y delta del mes (#169 R6)`. Cadena c14 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c15 — T8 verde — R6


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-g6.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       134 passed, 134 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g6-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Resumen guardado por entries.length > 0, dentro de la card y antes de WeightChart. Dos TABULAR_NUMS nuevos. El delta usa civilTodayIso(profileTimeZone) y aún no tiene clase de tono ni icono, según T8.

Commit c15: `825abbc7 feat(mobile): resumen de peso en la card de la gráfica (#169 R6)`. Cadena c15 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## S6 — sobre c15 825abbc7


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-s6.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R6: resumen del peso en la card de la gráfica › no pinta el resumen sin entradas
Test Suites: 1 failed, 1 total
Tests:       1 failed, 40 passed, 41 total
```

```text
  ● #169 R6: resumen del peso en la card de la gráfica › no pinta el resumen sin entradas

    expect(received).toBeNull()

    Received: <View testID="weight-summary"><Text className="text-3xl font-black text-foreground" style={{"fontVariant": ["tabular-nums"]}} testID="weight-current">0 kg</Text></View>
```

Mutación: resumen siempre presente dentro de la rama ok, con entries[0]?.weightKg ?? 0. Solo falla no pinta el resumen sin entradas, por aserción.

S6 revertida con `git checkout HEAD -- src/screens/weight-log/index.tsx`; `git diff --cached --quiet && git diff --quiet; echo "limpio=$?"` → `limpio=0`.

## c16 — T9 rojo — R7


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r7.txt 2>&1; echo "exit=$?"
```
```text
exit=1
```

## PARADA — Reanudacion 3 — cadena c16 lanzada antes de terminar la medida


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r7.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R7: tono del delta del mes › rama > 0: texto, clase e icono
  ● #169 R7: tono del delta del mes › rama < 0: texto, clase e icono
  ● #169 R7: tono del delta del mes › rama = 0: texto, clase e icono
Test Suites: 1 failed, 1 total
Tests:       3 failed, 41 passed, 44 total
```

```text
  ● #169 R7: tono del delta del mes › rama > 0: texto, clase e icono

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-sm font-semibold text-danger"
    Received: undefined
```

```text
  ● #169 R7: tono del delta del mes › rama < 0: texto, clase e icono

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-sm font-semibold text-success"
    Received: undefined
```

```text
  ● #169 R7: tono del delta del mes › rama = 0: texto, clase e icono

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-sm font-semibold text-muted"
    Received: undefined
```

Error de secuencia del agente: write_stdin devolvió session_id 96472 (Jest seguía corriendo); aun así se leyó el log todavía sin resumen y se lanzó la cadena c16. Se cortó en el primer grep (exit=1; salida vacía de /tmp/169-c16-chain.txt), sin ejecutar typecheck, lint, git add ni commit. Una vez terminado el proceso ya iniciado, el rojo sí es el esperado: tres fallos por aserción de className, 41 passed, 44 total. No aparece SIGKILL ni Killed, así que no se repite la cadena. El bloque c16 anterior se escribió con el log incompleto: este bloque añade la medida terminada sin borrar ni editar el registro previo.

Cadena intentada:

```sh
grep -qE '^Tests: +3 failed, 41 passed, 44 total$' /tmp/169-r7.txt \
  && test "$(grep -E '^  ● ' /tmp/169-r7.txt | grep -cvxF '  ● Console')" = 3 \
  && test "$(grep -E '^  ● ' /tmp/169-r7.txt | grep -cF '#169 R7: tono del delta del mes')" = 3 \
  && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r7.txt \
  && ! grep -qF 'Unable to find' /tmp/169-r7.txt \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt \
  && git add src/screens/weight-log/index.test.tsx \
  && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.test.tsx' \
  && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)" \
  && git commit -m 'test(mobile): tono del delta mensual de peso (#169 R7)'
```

Eslabón fallido: primer grep del resumen de /tmp/169-r7.txt, todavía ausente durante la ejecución de Jest. Cadena exit=1; log de cadena vacío. No hubo reintento.

Estado al parar:

```text
HEAD: 825abbc7
 M mobile-pet-tracker/src/screens/weight-log/index.test.tsx
?? progress/impl_mobile-weight-draw-and-toasts.md
indice_limpio=0
```

Terminados en Reanudacion 3: c13 b294c719 (R8 verde, con selector autorizado), c14 b10d1dab (R6 rojo), c15 825abbc7 (R6 verde), S6 (solo un rojo, revertida, limpio=0). c16 tiene los tres tests de R7 sin stagear y el rojo correcto medido; la cadena falló por la secuencia de ejecución, y queda pendiente de indicación del leader. No se escribió verde de R7, ni refactor, ni toast/háptico. Pendientes c16–c27 y cierre. Se preservan los tres registros de parada previos y todos los hashes. Sin init.sh, push ni PR, sin rebase/reset/amend y sin tocar otros worktrees.

R14: pendiente del smoke humano

## Reanudacion 4

```text
$ cd /home/claude/sites/Pet-Tracker-wt-169 && pwd
/home/claude/sites/Pet-Tracker-wt-169
$ git branch --show-current
feature/169-mobile-weight-draw-and-toasts
$ git rev-parse --short HEAD
b7ca741d
$ git log --oneline fc384b44..HEAD
b7ca741d docs(mobile-weight-draw-and-toasts): #169 Reanudación 4 tras la parada de c16
825abbc7 feat(mobile): resumen de peso en la card de la gráfica (#169 R6)
b10d1dab test(mobile): resumen de peso actual y delta del mes (#169 R6)
b294c719 feat(mobile): testIDs del chip de delta por entrada (#169 R8)
dc62f11a chore(harness): #169 reanudación 3 tras el selector de R7 en c13
6569bd89 test(mobile): candado del chip de delta por entrada de peso (#169 R8)
19e308f6 chore(harness): #169 reanudación 2 tras el TS2769 del doble de reicon en c12
9c9c9382 feat(mobile): claves weightLog.weightLogged y monthDelta (#169 R9)
c832b4d8 test(mobile): claves de catálogo del resumen y el toast de peso (#169 R9)
f1df1f73 feat(mobile): monthlyWeightDelta (#169 R5)
5830f1cf test(mobile): delta mensual de peso en cliente (#169 R5)
e4903ae1 chore(harness): #169 reanudación 1 tras el SIGKILL de eslint en c7
9f78ebbc test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)
8aaab5bc feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)
e68d6579 test(mobile): la gráfica de peso respeta reduce motion (#169 R3)
af6322d5 feat(mobile): puntos de peso con opacidad animada (#169 R2)
9d4c3b51 test(mobile): los puntos de peso aparecen con el trazo (#169 R2)
ba30d410 feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)
98db0006 test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)
$ git diff --cached --name-only
(vacío)
$ git status --short
 M mobile-pet-tracker/src/screens/weight-log/index.test.tsx
?? progress/impl_mobile-weight-draw-and-toasts.md
```

Arranque conforme. H0 sigue siendo `fc384b44`. Releído el handoff completo con Reanudaciones 1–4; se conserva todo lo escrito y las cuatro PARADAS. No se repiten las bases, las anclas iniciales ni las sondas ya medidas. Los tests de R7 pendientes no se editan. Cada medida restante y cada cadena se ejecutan por separado; se espera al `exit=` de su propia sesión antes de leer logs, registrar resultados o iniciar otra medida/cadena. Se mantienen las skills ya cargadas y los límites de la carta/spec, lint con salida vacía y un reintento completo solo por SIGKILL.

## c16 — T9 rojo — R7 — Reanudacion 4


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r7.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R7: tono del delta del mes › rama > 0: texto, clase e icono
  ● #169 R7: tono del delta del mes › rama < 0: texto, clase e icono
  ● #169 R7: tono del delta del mes › rama = 0: texto, clase e icono
Test Suites: 1 failed, 1 total
Tests:       3 failed, 41 passed, 44 total
```

```text
  ● #169 R7: tono del delta del mes › rama > 0: texto, clase e icono

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-sm font-semibold text-danger"
    Received: undefined
```

```text
  ● #169 R7: tono del delta del mes › rama < 0: texto, clase e icono

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-sm font-semibold text-success"
    Received: undefined
```

```text
  ● #169 R7: tono del delta del mes › rama = 0: texto, clase e icono

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-sm font-semibold text-muted"
    Received: undefined
```

La llamada terminó con exit=1 antes de abrir su log. Tests de R7 intactos desde la reanudación; tres fallos por aserción de className, sin consulta ni errores de ejecución.

Commit c16: `d5dc7b21 test(mobile): tono del delta mensual de peso (#169 R7)`. Cadena c16 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c17 — T9 verde — R7


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-g7.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       137 passed, 137 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g7-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Cada medida terminó con su propio exit=0 antes de leer logs. Clase completa e icono/color por rama; aún sin extraer el helper de D7.

Commit c17: `250a45b5 feat(mobile): color e icono del delta mensual (#169 R7)`. Cadena c17 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c18 — T9 refactor — R7


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-f7.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       137 passed, 137 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-f7-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

weightTone local comparte tile, icono, token de color y clases completas de texto entre filas y resumen. Se conservan las clases renderizadas; el literal del tile con ${tileClassName} sigue intacto. Ambas medidas finalizaron antes de leer los logs.

Commit c18: `4c627233 refactor(mobile): tono compartido entre filas y resumen de peso (#169 R7)`. Cadena c18 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c19 — T10 R10 rojo medido tras terminar cada llamada


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r10-wl.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R10: toast y háptico tras un alta correcta › muestra el toast y el háptico solo tras resolver el alta
  ● #169 R10: toast y háptico tras un alta correcta › llama al háptico una sola vez en la rama ok del fuente
Test Suites: 1 failed, 1 total
Tests:       2 failed, 44 passed, 46 total
```

```text
  ● #169 R10: toast y háptico tras un alta correcta › muestra el toast y el háptico solo tras resolver el alta

    expect(received).not.toBeNull()

    Received: null
```

```text
  ● #169 R10: toast y háptico tras un alta correcta › llama al háptico una sola vez en la rama ok del fuente

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/ui-language.test.ts > /tmp/169-r10-ul.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #65 R5: Health resuelve su copy por clave › resuelve las 32 ocurrencias normativas
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
Test Suites: 1 failed, 1 total
Tests:       2 failed, 28 passed, 30 total
```

```text
  ● #65 R5: Health resuelve su copy por clave › resuelve las 32 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/weight-log/index.tsx",
        "key": "weightLog.weightLogged",
    -   "uses": 1,
    +   "uses": 0,
      }
```

```text
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/weight-log/index.tsx",
        "key": "weightLog.weightLogged",
    -   "uses": 1,
    +   "uses": 0,
      }
```

Los cuatro fallos son por aserción. El test diferido espera dos act tras resolveCreate; la primera observación tras resolver es queryByTestId('weight-toast'). No se modifica este test en el verde.

Commit c19: `467b3551 test(mobile): toast y háptico al registrar un peso (#169 R10)`. Cadena c19 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c20 — T10 R10 verde


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-g10.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       139 passed, 139 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g10-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

El verde cambia solo producción. Toast View, último hijo del KeyboardAvoidingView, y una llamada háptica dentro de case 'ok'. Los tests del rojo no se editaron; rama MP4 anulada.

Commit c20: `04a9bbf4 feat(mobile): toast y háptico tras registrar un peso (#169 R10)`. Cadena c20 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c21 — T11 R11 nace verde


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-r11.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       147 passed, 147 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-r11-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Las ocho filas de R11 nacen verdes sin tocar producción. Se espera el mensaje de la rama; unauthorized usa la señal signOut que autoriza la tabla de R11. S11 se plantará después del commit de tests.

### c21: primer intento interrumpido por SIGKILL

La cadena terminó con exit=1 antes de git add y antes del commit. Typecheck terminó en 0; el único fallo fue lint. Se aplica el único reintento autorizado por Reanudacion 1.

```text
/tmp/169-lint.txt:
error: Failed to run "eslint" due to signal SIGKILL
/tmp/169-c21-chain.txt:
$ tsc --noEmit
exit=1
```

## c21 — único reintento completo autorizado


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-r11.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       147 passed, 147 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-r11-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Antes del reintento: pgrep -af '[i]nit\.sh' sin pipe dio salida vacía (exit=1, ninguna coincidencia). Se repiten todas las medidas y toda la cadena; no se cambió código.

Commit c21: `c8c9dfbb test(mobile): sin toast ni háptico en altas fallidas (#169 R11)`. Cadena c21 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

### S11 sobre HEAD c8c9dfbb

Mutación solo en src/screens/weight-log/index.tsx: al inicio de handleSubmit, antes de validar peso, setToastVisible(true) y void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success), conservando ambas líneas originales de case ok.

## S11 — medición de la sonda tras c21


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-s11.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R10: toast y háptico tras un alta correcta › muestra el toast y el háptico solo tras resolver el alta
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama peso no numérico: ni toast ni háptico
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama validation: ni toast ni háptico
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama forbidden: ni toast ni háptico
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama unreachable: ni toast ni háptico
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama unauthorized: ni toast ni háptico
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama error: ni toast ni háptico
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama missing-config: ni toast ni háptico
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama excepción: ni toast ni háptico
Test Suites: 1 failed, 1 total
Tests:       9 failed, 45 passed, 54 total
```

```text
  ● #169 R10: toast y háptico tras un alta correcta › muestra el toast y el háptico solo tras resolver el alta

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama peso no numérico: ni toast ni háptico

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama validation: ni toast ni háptico

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama forbidden: ni toast ni háptico

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama unreachable: ni toast ni háptico

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama unauthorized: ni toast ni háptico

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama error: ni toast ni háptico

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama missing-config: ni toast ni háptico

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R11: ni toast ni háptico fuera de la rama ok › rama excepción: ni toast ni háptico

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

Se comprueban la cuenta exacta y los encabezados antes de revertir; todos los fallos deben ser por aserción.

S11: cuenta y clase exit=0; las ocho filas de R11 y el test diferido de R10 fallan por aserción. El candado de una llamada en la rama ok permanece verde.

```sh
git checkout HEAD -- src/screens/weight-log/index.tsx
git diff --cached --quiet && git diff --quiet; echo "limpio=$?"
```
```text
limpio=0
```

## c22 — T12 R12 rojo


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r12.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R12: el toast se va solo › se ve a los 2400 ms y se va a los 2650 ms
  ● #169 R12: el toast se va solo › otra alta reinicia la cuenta y vibra otra vez
Test Suites: 1 failed, 1 total
Tests:       2 failed, 54 passed, 56 total
```

```text
  ● #169 R12: el toast se va solo › se ve a los 2400 ms y se va a los 2650 ms

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

```text
  ● #169 R12: el toast se va solo › otra alta reinicia la cuenta y vibra otra vez

    expect(received).toBeNull()

    Received: <View accessibilityLiveRegion="polite" className="absolute top-4 flex-row items-center gap-2 self-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm" pointerEvents="none" testID="weight-toast"><Text size={16} style={{"color": "green"}} testID="icon-check" /><Text className="text-sm font-semibold text-foreground">Anotado. Ya lo puse en la gráfica.</Text></View>
```

Desde el rojo, tras cada press de alta correcta hay await act(async () => {}). Las ventanas son literales 2400 y +250; la segunda alta llega a los 2000 y reinicia la observación. No se usa waitFor entre el alta y las ventanas.

Commit c22: `e4f543df test(mobile): el toast de peso se oculta solo (#169 R12)`. Cadena c22 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c23 — T12 R12 verde


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-g12.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       149 passed, 149 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g12-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Constante local WEIGHT_TOAST_MS = 2500; cada alta ok cancela el timer anterior y programa otro. El efecto limpia el timer al desmontar. No se editaron tests ni ventanas.

### c23: primer intento interrumpido por SIGKILL

La cadena terminó con exit=1 antes de git add y del commit. Typecheck terminó en 0; lint fue el único fallo. Se aplica un único reintento completo, conforme a Reanudacion 1.

```text
/tmp/169-lint.txt:
error: Failed to run "eslint" due to signal SIGKILL
/tmp/169-c23-chain.txt:
$ tsc --noEmit
exit=1
```

## c23 — único reintento completo autorizado


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-g12.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       149 passed, 149 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g12-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Antes del reintento: pgrep -af '[i]nit\.sh' sin pipe, salida vacía (exit=1). Se repiten medidas y cadena enteras sin cambios de código.

Commit c23: `926968a3 feat(mobile): auto-ocultado del toast de peso (#169 R12)`. Cadena c23 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c24 — T13 R13 rojo


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r13.txt 2>&1; echo "exit=$?"
```
```text
exit=1
  ● #169 R13: movimiento del toast › el fuente declara el fundido sin ReduceMotion.Never
  ● #169 R13: movimiento del toast › el toast lleva FadeIn y FadeOut
Test Suites: 1 failed, 1 total
Tests:       2 failed, 56 passed, 58 total
```

```text
  ● #169 R13: movimiento del toast › el fuente declara el fundido sin ReduceMotion.Never

    expect(received).toContain(expected) // indexOf

    Expected substring: "entering={FadeIn.duration(MOTION_TRANSITION_MS)}"
    Received string:    "import { HeaderHeightContext } from 'expo-router/react-navigation';
    import { Redirect } from 'expo-router';
    import * as Haptics from 'expo-haptics';
    import {
      Button,
      Card as HeroUICard,
      Input,
      Label,
      Skeleton,
      TextField,
    } from 'heroui-native';
    import { useQuery } from '@tanstack/react-query';
    import { useContext, useEffect, useRef, useState } from 'react';
    import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
    import { useSafeAreaInsets } from 'react-native-safe-area-context';
    import { Check, Minus, TrendDown, TrendUp } from 'reicon-react-native';·
    import {
      createWeight,
      listWeights,
      type WeightsState,
```

```text
  ● #169 R13: movimiento del toast › el toast lleva FadeIn y FadeOut

    expect(received).toBeInstanceOf(expected)

    Expected constructor: FadeIn

    Received value has no prototype
    Received value: undefined
```

Import nombrado de FadeIn/FadeOut. El test de alta lleva await act(async () => {}) justo después del press desde el rojo. Fallos por toContain y toBeInstanceOf, sin consultas fallidas. Para el fuente se limita el Received a sus primeras 20 líneas.

Commit c24: `7edd9fac test(mobile): fundido de entrada y salida del toast de peso (#169 R13)`. Cadena c24 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## c25 — T13 R13 verde


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/169-g13.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
Test Suites: 3 passed, 3 total
Tests:       151 passed, 151 total
```

```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/169-g13-guardas.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 2 passed, 2 total
Tests:       92 passed, 92 total
```

Toast Animated.View con FadeIn.duration(MOTION_TRANSITION_MS) y FadeOut.duration(MOTION_FEEDBACK_MS). R12 sigue verde con sus ventanas 2400/2650 originales; ningún test ni ventana se editó en este verde. Sin ReduceMotion.Never ni tokens nuevos.

Commit c25: `ea4f372d feat(mobile): toast de peso con FadeIn y FadeOut (#169 R13)`. Cadena c25 exit=0; router ausente; `bun run typecheck` exit=0; `bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt` exit=0; log vacío; stage exacto y LIMPIO verificados.

## Cierre — después de c25 ea4f372d

```sh
cd /home/claude/sites/Pet-Tracker-wt-169/mobile-pet-tracker && pwd
```
```text
/home/claude/sites/Pet-Tracker-wt-169/mobile-pet-tracker
```
Todas las medidas siguientes son una llamada cada una; se espera el exit impreso en la misma sesión antes de leer logs o comenzar la siguiente.

## Cierre — BASE final


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/ui-language.test.ts src/__tests__/legibility-classnames.test.ts src/components/__tests__/weight-chart.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/motion.test.ts src/screens/health/index.test.tsx src/screens/weight-log/index.test.tsx > /tmp/169-final.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
  ● Console
  ● Console
Test Suites: 9 passed, 9 total
Tests:       363 passed, 363 total
```

## Cierre — monthlyWeightDelta


```sh
FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/monthly-weight-delta.test.ts > /tmp/169-final-md.txt 2>&1; echo "exit=$?"
```
```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

## Cierre — ALL final


```sh
FORCE_COLOR=0 bunx jest > /tmp/169-all.txt 2>&1; echo "exit=$?"
```
```text
exit=0
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
  ● Console
Test Suites: 99 passed, 99 total
Tests:       2823 passed, 2823 total
```

Justo antes de ALL: pgrep -af '[i]nit\.sh' sin pipe, salida vacía (exit=1, ninguna coincidencia). Mientras ALL corrió solo se esperó su misma sesión y se comunicó el estado; no se lanzó otro comando.

### Typecheck y lint de cierre

```sh
bun run typecheck; echo "exit=$?"
```
```text
$ tsc --noEmit
exit=0
```

```sh
bunx expo lint --no-cache > /tmp/169-lint-final.txt 2>&1; echo "exit=$?"; test ! -s /tmp/169-lint-final.txt; echo "vacio=$?"
```
```text
exit=0
vacio=0
```
/tmp/169-lint-final.txt vacío, sin errores ni warnings.

### Cierre (3): llamada háptica única

```sh
grep -cF 'Haptics.notificationAsync(' src/screens/weight-log/index.tsx
```
```text
1
```

```sh
cd /home/claude/sites/Pet-Tracker-wt-169 && pwd
```
```text
/home/claude/sites/Pet-Tracker-wt-169
```

## Anclas de cierre — A, B, X, H y P

A/B/X se ejecutan desde mobile-pet-tracker/; H/P desde la raíz. Los grep de cuenta cero pueden terminar en 1; se compara la cifra impresa.

### A1 — cierre

```sh
grep -cF '<Polyline' src/components/weight-chart.tsx
```
```text
0
```

### A2 — cierre

```sh
grep -cF "from 'react-native-reanimated'" src/components/weight-chart.tsx
```
```text
1
```

### A3 — cierre

```sh
grep -cF 'createAnimatedComponent' src/components/weight-chart.tsx
```
```text
2
```

### A4 — cierre

```sh
grep -cF 'useReducedMotion' src/components/weight-chart.tsx
```
```text
2
```

### A5 — cierre

```sh
grep -cF 'export const MOTION_FILL_TIMING' src/theme/motion.ts
```
```text
1
```

### A6 — cierre

```sh
grep -cF 'withTiming(pct, MOTION_FILL_TIMING)' src/screens/home/collar-battery-bar.tsx
```
```text
1
```

### A7 — cierre

```sh
grep -cF 'Haptics' src/screens/weight-log/index.tsx
```
```text
2
```

### A8 — cierre

```sh
grep -cF 'Haptics.notificationAsync(' 'src/app/(tabs)/food.tsx'
```
```text
1
```

### A9 — cierre

```sh
grep -cF "case 'ok':" src/screens/weight-log/index.tsx
```
```text
1
```

### A10 — cierre

```sh
grep -cF 'testID="weight-chart-card"' src/screens/weight-log/index.tsx
```
```text
1
```

### A11 — cierre

```sh
grep -cF 'style={TABULAR_NUMS}' src/screens/weight-log/index.tsx
```
```text
4
```

### A12 — cierre

```sh
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/weight-log/index.tsx
```
```text
1
```

### A13 — cierre

```sh
grep -cF 'function fmtVariation' src/screens/weight-log/index.tsx
```
```text
1
```

### A14 — cierre

```sh
grep -cF 'civilTodayIso(profileTimeZone)' src/screens/weight-log/index.tsx
```
```text
2
```

### A15 — cierre

```sh
grep -cF 'testID={`weight-row-${entry.id}`}' src/screens/weight-log/index.tsx
```
```text
1
```

### A16 — cierre

```sh
grep -cF '.orderBy(desc(weights.measuredAt), desc(weights.id))' ../backend-pet-tracker/src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts
```
```text
2
```

### A17 — cierre

```sh
grep -cF "measuredAt: '2026-08-21'" src/screens/weight-log/index.test.tsx
```
```text
1
```

### A18 — cierre

```sh
grep -cF 'WeightChart: jest.fn(actual.WeightChart),' src/screens/health/index.test.tsx
```
```text
1
```

### B1 — cierre

```sh
grep -cF -e '- 1, // #159 R2' src/providers/__tests__/language-provider.test.tsx
```
```text
0
```

### B2 — cierre

```sh
grep -cF "{ file: 'src/screens/weight-log/index.tsx', key:" src/__tests__/ui-copy-table.ts
```
```text
19
```

### B3 — cierre

```sh
grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2);' src/__tests__/ui-language.test.ts
```
```text
0
```

### B4 — cierre

```sh
grep -cF "[join('screens', 'weight-log', 'index.tsx'), 2]," src/__tests__/consistency-classnames.test.ts
```
```text
0
```

### B5 — cierre

```sh
grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts
```
```text
0
```

### B6 — cierre

```sh
grep -cF "[join('screens', 'weight-log', 'index.tsx'), 1]," src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### B7 — cierre

```sh
grep -cF "'MOTION_BLINK_TIMING'," src/theme/__tests__/motion.test.ts
```
```text
1
```

### B8 — cierre

```sh
grep -cF 'rounded-xl bg-accent' src/screens/weight-log/index.tsx
```
```text
1
```

### B9 — cierre

```sh
grep -cF '<Button' src/screens/weight-log/index.tsx
```
```text
3
```

### B10 — cierre

```sh
grep -cF '<Pressable' src/screens/weight-log/index.tsx
```
```text
0
```

### B11 — cierre

```sh
grep -cF 'border-b-4' src/screens/weight-log/index.tsx
```
```text
1
```

### X1 — cierre

```sh
grep -c '^### §2\.' ../specs/mobile-ui-language/design.md
```
```text
24
```

### X2 — cierre

```sh
grep -cF '${tileClassName}' src/screens/weight-log/index.tsx
```
```text
1
```

### X3 — cierre

```sh
grep -cF 'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}' src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### X4 — cierre

```sh
grep -cF 'size={15}' src/screens/weight-log/index.tsx
```
```text
2
```

### X5 — cierre

```sh
grep -cF 'jest.mock(' src/screens/weight-log/index.test.tsx
```
```text
8
```

### X6 — cierre

```sh
grep -cF "jest.mock('react-native-svg'" src/components/__tests__/weight-chart.test.tsx
```
```text
1
```

### X7 — cierre

```sh
grep -cF "describe('R8: la gráfica degrada con <2 puntos'" src/components/__tests__/weight-chart.test.tsx
```
```text
1
```

### X8 — cierre

```sh
grep -cF 'KeyboardAvoidingView' src/screens/weight-log/index.tsx
```
```text
3
```

### X9 — cierre

```sh
grep -cF "describe('R9: alta de peso con degradación por kind'" src/screens/weight-log/index.test.tsx
```
```text
1
```

### X10 — cierre

```sh
grep -cF 'weights.refetch();' src/screens/weight-log/index.tsx
```
```text
1
```

### X11 — cierre

```sh
grep -cF 'function makeProfile(' src/screens/weight-log/index.test.tsx
```
```text
1
```

### X12 — cierre

```sh
grep -cF 'function makeWeight(' src/screens/weight-log/index.test.tsx src/components/__tests__/weight-chart.test.tsx
```
```text
src/screens/weight-log/index.test.tsx:1
src/components/__tests__/weight-chart.test.tsx:1
```

### X13 — cierre

```sh
grep -cF -e 'export const MOTION_FILL_TIMING' -e 'export const MOTION_TRANSITION_MS' -e 'export const MOTION_FEEDBACK_MS' src/theme/motion.ts
```
```text
3
```

### X14 — cierre

```sh
grep -cF 'export function civilTodayIso' src/utils/civil-today-iso.ts
```
```text
1
```

### X15 — cierre

```sh
test ! -e src/utils/monthly-weight-delta.ts && test ! -e src/utils/monthly-weight-delta.test.ts; echo "exit=$?"
```
```text
exit=1
```

### X16 — cierre

```sh
grep -cF "describe('#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros'" src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### X17 — cierre

```sh
grep -cF "it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas'" src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### X18 — cierre

```sh
grep -cF 'const escapeRegExp = (value: string) =>' src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### X19 — cierre

```sh
grep -cF "it('resuelve las 32 ocurrencias normativas'" src/__tests__/ui-language.test.ts
```
```text
1
```

### X20 — cierre

```sh
grep -cF "it('resuelve cada ocurrencia de la tabla contra la clave exacta'" src/__tests__/ui-language.test.ts
```
```text
1
```

### X21 — cierre

```sh
grep -cF "describe('#62 R15: todo contador usa cifras tabulares'" src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### X22 — cierre

```sh
grep -cF "it.each(counters)('%s aplica TABULAR_NUMS a sus %i valores'" src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### X23 — cierre

```sh
grep -cF "from '../../theme/use-theme-colors'" src/screens/weight-log/index.tsx
```
```text
1
```

### H1 — cierre

```sh
grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-11)' specs/mobile-weight-draw-and-toasts/requirements.md
```
```text
1
```

### H2 — cierre

```sh
grep -cF -- '- [ ] Smoke de R14 superado por humano (fecha: ____, dispositivo: ____)' specs/mobile-weight-draw-and-toasts/requirements.md
```
```text
1
```

### H3 — cierre

```sh
grep -cF '"status": "in_progress"' feature_list.json
```
```text
1
```

### H4 — cierre

```sh
grep -rlF '#169' mobile-pet-tracker/src | wc -l
```
```text
6
```

### P1 — cierre

```sh
grep -cF '<AnimatedPolyline' mobile-pet-tracker/src/components/weight-chart.tsx
```
```text
1
```

### P2 — cierre

```sh
grep -cF 'testID="weight-chart-points"' mobile-pet-tracker/src/components/weight-chart.tsx
```
```text
1
```

### P3 — cierre

```sh
grep -cF 'withTiming(1, MOTION_FILL_TIMING)' mobile-pet-tracker/src/components/weight-chart.tsx
```
```text
1
```

### P4 — cierre

```sh
grep -cF 'Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)' mobile-pet-tracker/src/screens/weight-log/index.tsx
```
```text
1
```

### P5 — cierre

```sh
grep -cF 'const WEIGHT_TOAST_MS = 2500;' mobile-pet-tracker/src/screens/weight-log/index.tsx
```
```text
1
```

### P6 — cierre

```sh
grep -cF 'entering={FadeIn.duration(MOTION_TRANSITION_MS)}' mobile-pet-tracker/src/screens/weight-log/index.tsx
```
```text
1
```

### P7 — cierre

```sh
grep -cF 'exiting={FadeOut.duration(MOTION_FEEDBACK_MS)}' mobile-pet-tracker/src/screens/weight-log/index.tsx
```
```text
1
```

### P8 — cierre

```sh
grep -cF 'ReduceMotion.Never' mobile-pet-tracker/src/screens/weight-log/index.tsx mobile-pet-tracker/src/components/weight-chart.tsx
```
```text
mobile-pet-tracker/src/screens/weight-log/index.tsx:0
mobile-pet-tracker/src/components/weight-chart.tsx:0
```

### P9 — cierre

```sh
grep -cF 'testID="weight-toast"' mobile-pet-tracker/src/screens/weight-log/index.tsx
```
```text
1
```

### P10 — cierre

```sh
grep -cF 'export function monthlyWeightDelta' mobile-pet-tracker/src/utils/monthly-weight-delta.ts
```
```text
1
```

### P11 — cierre

```sh
grep -cF 'weight-row-${entry.id}-tone' mobile-pet-tracker/src/screens/weight-log/index.tsx
```
```text
1
```

### P12 — cierre

```sh
grep -cF 'weight-row-${entry.id}-delta' mobile-pet-tracker/src/screens/weight-log/index.tsx
```
```text
1
```

### P13 — cierre

```sh
grep -cF "'weightLog.weightLogged'" mobile-pet-tracker/src/i18n/catalog.ts
```
```text
2
```

### P14 — cierre

```sh
grep -cF "'weightLog.monthDelta'" mobile-pet-tracker/src/i18n/catalog.ts
```
```text
2
```

### P15 — cierre

```sh
grep -cF -e '        - 1 // #159 R2' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### P16 — cierre

```sh
grep -cF -e '        + 2, // #169 R9' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
```
```text
1
```

### P17 — cierre

```sh
grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1, +2 #155 R4, +1 #169 R6, +1 #169 R10' mobile-pet-tracker/src/__tests__/ui-language.test.ts
```
```text
1
```

### P18 — cierre

```sh
grep -cF "[join('screens', 'weight-log', 'index.tsx'), 2 + 2], // #169 R6" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### P19 — cierre

```sh
grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 2, // #146 R18, #105 R11, #116 R5, #115 R6, #169 R6' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
```
```text
1
```

### P20 — cierre

```sh
grep -cF '### §2.24 — Añadidos por #169 — Peso' specs/mobile-ui-language/design.md
```
```text
1
```

### P21 — cierre

```sh
grep -cF "{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.monthDelta' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
1
```

### P22 — cierre

```sh
grep -cF "{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weightLogged' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts
```
```text
1
```

Las 56 anclas A/B/X/H y las 22 P coinciden con los valores de cierre; los valores no fijados quedan anotados.

## Diffs de cierre

```sh
git diff --name-only 89fe2009..HEAD -- mobile-pet-tracker/src/screens/health
```
```text
(vacío)
exit=0
```

```sh
git diff --name-only 89fe2009..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme/motion.ts
```
```text
(vacío)
exit=0
```

```sh
git diff --stat fc384b44 -- mobile-pet-tracker/src/theme/__tests__/motion.test.ts backend-pet-tracker/ infra-pet-tracker/
```
```text
(vacío)
exit=0
```

```sh
git diff --name-only fc384b44 HEAD -- docs/
```
```text
(vacío)
exit=0
```

```sh
git diff --name-only fc384b44 HEAD -- mobile-pet-tracker/ | LC_ALL=C sort
```
```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx
mobile-pet-tracker/src/components/weight-chart.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/weight-log/index.test.tsx
mobile-pet-tracker/src/screens/weight-log/index.tsx
mobile-pet-tracker/src/utils/monthly-weight-delta.test.ts
mobile-pet-tracker/src/utils/monthly-weight-delta.ts
exit=0
```

Diffs vacíos de Health, dependencias/tokens, tests de motion, backend/infra y docs verificados. La lista móvil contiene exactamente los 11 ficheros autorizados.

## Commits T1–T13 — 25, en el orden prescrito

| c | R-id | Hash corto y mensaje |
|---|---|---|
| c1 | R1 | `98db0006 test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)` |
| c2 | R1 | `ba30d410 feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)` |
| c3 | R2 | `9d4c3b51 test(mobile): los puntos de peso aparecen con el trazo (#169 R2)` |
| c4 | R2 | `af6322d5 feat(mobile): puntos de peso con opacidad animada (#169 R2)` |
| c5 | R3 | `e68d6579 test(mobile): la gráfica de peso respeta reduce motion (#169 R3)` |
| c6 | R3 | `8aaab5bc feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)` |
| c7 | R4 | `9f78ebbc test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)` |
| c8 | R5 | `5830f1cf test(mobile): delta mensual de peso en cliente (#169 R5)` |
| c9 | R5 | `f1df1f73 feat(mobile): monthlyWeightDelta (#169 R5)` |
| c10 | R9 | `c832b4d8 test(mobile): claves de catálogo del resumen y el toast de peso (#169 R9)` |
| c11 | R9 | `9c9c9382 feat(mobile): claves weightLog.weightLogged y monthDelta (#169 R9)` |
| c12 | R8 | `6569bd89 test(mobile): candado del chip de delta por entrada de peso (#169 R8)` |
| c13 | R8 | `b294c719 feat(mobile): testIDs del chip de delta por entrada (#169 R8)` |
| c14 | R6 | `b10d1dab test(mobile): resumen de peso actual y delta del mes (#169 R6)` |
| c15 | R6 | `825abbc7 feat(mobile): resumen de peso en la card de la gráfica (#169 R6)` |
| c16 | R7 | `d5dc7b21 test(mobile): tono del delta mensual de peso (#169 R7)` |
| c17 | R7 | `250a45b5 feat(mobile): color e icono del delta mensual (#169 R7)` |
| c18 | R7 | `4c627233 refactor(mobile): tono compartido entre filas y resumen de peso (#169 R7)` |
| c19 | R10 | `467b3551 test(mobile): toast y háptico al registrar un peso (#169 R10)` |
| c20 | R10 | `04a9bbf4 feat(mobile): toast y háptico tras registrar un peso (#169 R10)` |
| c21 | R11 | `c8c9dfbb test(mobile): sin toast ni háptico en altas fallidas (#169 R11)` |
| c22 | R12 | `e4f543df test(mobile): el toast de peso se oculta solo (#169 R12)` |
| c23 | R12 | `926968a3 feat(mobile): auto-ocultado del toast de peso (#169 R12)` |
| c24 | R13 | `7edd9fac test(mobile): fundido de entrada y salida del toast de peso (#169 R13)` |
| c25 | R13 | `ea4f372d feat(mobile): toast de peso con FadeIn y FadeOut (#169 R13)` |

Los commits del leader e4903ae1, 19e308f6, dc62f11a y b7ca741d añaden las reanudaciones y sus enmiendas autorizadas. H0 sigue siendo fc384b44; no se hicieron rebase, merge ni modificaciones de hashes.

Trazabilidad rellenada una sola vez al final, exclusivamente la columna Commit. Frontmatter, columna Test y fila R14 conservados. Las decisiones de clases, copy, timers y movimiento siguen la spec; la extracción local weightTone corresponde a D7/c18. Ninguna decisión de producto adicional.

## Smoke humano R14 — listo para el dev build de Android

Después de la aprobación del reviewer, un humano realiza y firma estos cinco pasos:

1. En Peso y en Salud, la línea se dibuja de izquierda a derecha al abrir, los puntos aparecen con ella y el área está quieta.
2. Con «Quitar animaciones» activado en Ajustes → Accesibilidad, la gráfica sale completa sin dibujo y el toast aparece sin fundido.
3. Al registrar un peso, el toast aparece arriba, no tapa el formulario ni bloquea toques y se va solo en unos 2,5 s. El teléfono vibra una vez, a la vez que aparece el toast.
4. Un alta con error (por ejemplo, sin red) no vibra ni muestra el toast.
5. El resumen muestra el peso actual grande y el delta del mes con su color.

Las cuatro PARADAS y todos los registros anteriores se conservan. No se ejecutó init.sh, ni se tocó infraestructura, ni se hizo push o PR. El leader corre el gate compartido y el humano firma R14.

R14: pendiente del smoke humano
