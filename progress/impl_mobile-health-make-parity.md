```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/115-mobile-health-make-parity
$ git rev-parse --short HEAD
1b87006e
$ git status --short
```

H0 = `1b87006e9d20a0b75f486830808015b1b818491a` (handoff). Status inicial vacío.
Sesión Codex, 2026-10-06 UTC. Solo #115, T0–T6; R9/T7 quedan al humano.
La instrucción específica del handoff sustituye el lifecycle genérico:
sin init.sh, infra, bookkeeping del leader, push, PR, rebase ni otros worktrees.

## T0 — lecturas, skills y guardas

Leídos requirements.md entero (approved, firma 2bfd4477), design.md entero,
tasks.md entero y traceability.md entero; progress/current.md y feature #115
(in_progress); docs/conventions.md (incluidas esperas), architecture.md,
ui-guidelines.md y verification.md (TDD). Lista cerrada: siete ficheros.

Skills cargadas:

- `building-native-ui`: plugin Expo instalado en
  `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`
  (frontmatter de la skill 1.0.1; handoff identifica plugin 1.0.2).
  El catálogo local no contiene expo-native-ui ni expo-design-system.
- `.agents/skills/appllama-app-design-skill/SKILL.md`: solo patrón; carta y
  spec ganan. Investigación del leader ya realizada; sin Appllama MCP.
  Smoke Android R9 reservado al humano.
- `.agents/skills/animate-expo/SKILL.md`: puerta de frecuencia, sin animación
  en esta pestaña ni al cambiar mascota; sin status en el hero.
- `ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.13.0/skills/ponytail/SKILL.md`;
  reusar componentes y helpers existentes, sin dependencias ni abstracciones nuevas.

Leído mobile-pet-tracker/AGENTS.md y su referencia versionada antes de código:
https://docs.expo.dev/versions/v57.0.0/ (consulta web satisfactoria).

```text
$ git fetch origin
(sin salida; exit=0)
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=0
$ git rev-parse --short origin/main
8afae724
```

No se reabren D1–D11 ni P1–P3. No se borra router.d.ts.

## Anclas de H0

Desde mobile-pet-tracker/. El número identifica el comando literal del handoff.

```text
0. $ grep -cF -- '- [x] Spec aprobada por humano (fecha: 2026-10-06' ../specs/mobile-health-make-parity/requirements.md
1 (esperado 1; grep exit=0)
1. $ grep -cF -- 'healthKeys.weights(selectedPetId ?? '"'"''"'"', 1)' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
2. $ grep -cF -- 'healthKeys.weights(selectedPetId ?? '"'"''"'"', undefined)' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
3. $ grep -cF -- 'selectedPetId!, fetch, 1)' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
4. $ grep -cF -- '<WeightChart entries={weight.data.weights} />' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
5. $ grep -cF -- '<PetHeroHeader' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
6. $ grep -cF -- 'variant="bleed"' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
7. $ grep -cF -- 'from '"'"'../home/format'"'"'' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
8. $ grep -cF -- 'calendarDaysUntil(' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
9. $ grep -cF -- 'fmtDate(' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
10. $ grep -cF -- 'useLocale()' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
11. $ grep -cF -- '{nextVaccine.nextDoseAt}' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
12. $ grep -cF -- 'testID="next-vaccine-days"' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
13. $ grep -cF -- 'testID="next-vaccine-date"' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
14. $ grep -cF -- 'testID="health-states"' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
15. $ grep -cF -- 'testID="health-content"' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
16. $ grep -cF -- 'padding: 24' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
17. $ grep -cF -- 'paddingHorizontal: 24' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
18. $ grep -cF -- 'insets.top + 12' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
19. $ grep -cF -- 'insets.bottom + 96' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
20. $ grep -cF -- 'style={TABULAR_NUMS}' src/screens/health/index.tsx
2 (esperado 2; grep exit=0)
21. $ grep -cF -- 'style={CONTINUOUS_CORNER}' src/screens/health/index.tsx
2 (esperado 2; grep exit=0)
22. $ grep -cF -- text-accent-strong src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
23. $ grep -cF -- text-warning-strong src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
24. $ grep -cF -- 't('"'"'health.health'"'"')' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
25. $ grep -cF -- '<PetSwitcher' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
26. $ grep -cF -- home.nextVaccineOverdue src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
27. $ grep -cF -- getPet src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
28. $ grep -cF -- react-native-reanimated src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
29. $ grep -cF -- StyleSheet.create src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
30. $ grep -cE -- '#[0-9A-Fa-f]{3,8}\b' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
31. $ grep -cE -- '\w-\[' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
32. $ grep -cF -- '{ file: '"'"'src/screens/health/index.tsx'"'"', key: '"'"'home.' src/__tests__/ui-copy-table.ts
0 (esperado 0; grep exit=1)
33. $ grep -cF -- 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2); // +1 #90 R5, +1 #95 R4, -2 #95 R5' src/__tests__/ui-language.test.ts
1 (esperado 1; grep exit=0)
34. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 2],' src/__tests__/consistency-classnames.test.ts
2 (esperado 2; grep exit=0)
35. $ grep -cF -- '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5' src/__tests__/consistency-classnames.test.ts
1 (esperado 1; grep exit=0)
36. $ grep -cF -- 'padding: 24, paddingBottom: 120' src/screens/health/index.test.tsx
1 (esperado 1; grep exit=0)
37. $ grep -cF -- 'expect.any(Function)' src/screens/health/index.test.tsx
2 (esperado 2; grep exit=0)
38. $ grep -cF -- 'healthKeys.weights('"'"'pet-1'"'"', undefined)' src/screens/health/index.test.tsx
0 (esperado 0; grep exit=1)
39. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 1],' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
40. $ grep -cF -- '13 + 1 + 1' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
41. $ grep -cF -- '+ 2, // #118 R11' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
42. $ grep -cF -- '+ 8, // #118 R1' src/providers/__tests__/language-provider.test.tsx
1 (esperado 1; grep exit=0)
43. $ grep -cF -- ''"'"'screens/health/index.tsx'"'"': 0,' src/__tests__/design-drift.test.ts
1 (esperado 1; grep exit=0)
44. $ grep -cF -- 'import { Card } from '"'"'../../components/card'"'"';' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
```
Coinciden todas: True.

## T0 — base medida

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx src/components/__tests__/weight-chart.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/providers/__tests__/language-provider.test.tsx --json --outputFile=/tmp/115-base.json > /tmp/115-base-jest.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 8 passed, 8 total
Tests:       264 passed, 264 total
Snapshots:   0 total
Time:        10.138 s, estimated 12 s
exit=0
```

Por suite:

- `src/components/__tests__/pet-hero-header.test.tsx`: 37 tests, 37 passed, 0 failed.
- `src/__tests__/ui-language.test.ts`: 30 tests, 30 passed, 0 failed.
- `src/screens/health/index.test.tsx`: 29 tests, 29 passed, 0 failed.
- `src/providers/__tests__/language-provider.test.tsx`: 22 tests, 22 passed, 0 failed.
- `src/__tests__/design-drift.test.ts`: 60 tests, 60 passed, 0 failed.
- `src/components/__tests__/weight-chart.test.tsx`: 4 tests, 4 passed, 0 failed.
- `src/__tests__/legibility-classnames.test.ts`: 27 tests, 27 passed, 0 failed.
- `src/__tests__/consistency-classnames.test.ts`: 55 tests, 55 passed, 0 failed.

### Typecheck y lint de base

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
$ bun run typecheck > /tmp/115-base-typecheck.txt 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
$ bun run lint > /tmp/115-base-lint.txt 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

Incidencias de lectura: `python` no está instalado; se usa el binario disponible `python3` para registrar evidencia. Dos lecturas de docs con cwd móvil tenían ruta relativa de raíz y se repitieron desde raíz. Ninguna denegación de sandbox.

## T1 — rojo R4 (esperado: 3 por aserción)

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t1-red.json > /tmp/115-t1-red.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 26 passed, 29 total
Snapshots:   0 total
Time:        7.526 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 29 tests, 26 passed, 3 failed.

### R4: health resuelve la mascota seleccionada keeps API order and selects the first pet by default

```text
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://example.test/v1", "jwt-token", "pet-1"
Received: "http://example.test/v1", "jwt-token", "pet-1", [Function fetch], 1

Number of calls: 1
Caída por aserción.
```

### R4: health resuelve la mascota seleccionada selects a pressed pet and reloads its health records

```text
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://example.test/v1", "jwt-token", "pet-2"
Received
       1: "http://example.test/v1", "jwt-token", "pet-1", [Function fetch], 1
       2: "http://example.test/v1", "jwt-token", "pet-2", [Function fetch], 1

Number of calls: 2
Caída por aserción.
```

### #87 R13: HealthScreen lee por TanStack Query deja mascotas, vacunas y el historial de peso en sus claves canónicas

```text
Error: expect(received).toEqual(expected) // deep equality

Expected: {"kind": "ok", "weights": [{"bodyCondition": null, "id": "weight-1", "measuredAt": "2026-08-21", "petId": "pet-1", "variation": 0.4, "weightKg": 12.4}]}
Received: undefined
Caída por aserción.
```

## T1 — rojo final: espera al árbol, luego asevera llamadas

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t1-red-final.json > /tmp/115-t1-red-final.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 26 passed, 29 total
Snapshots:   0 total
Time:        5.409 s, estimated 8 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 29 tests, 26 passed, 3 failed.

### R4: health resuelve la mascota seleccionada keeps API order and selects the first pet by default

```text
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://example.test/v1", "jwt-token", "pet-1"
Received: "http://example.test/v1", "jwt-token", "pet-1", [Function fetch], 1

Number of calls: 1
Caída por aserción.
```

### R4: health resuelve la mascota seleccionada selects a pressed pet and reloads its health records

```text
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://example.test/v1", "jwt-token", "pet-2"
Received
       1: "http://example.test/v1", "jwt-token", "pet-1", [Function fetch], 1
       2: "http://example.test/v1", "jwt-token", "pet-2", [Function fetch], 1

Number of calls: 2
Caída por aserción.
```

### #87 R13: HealthScreen lee por TanStack Query deja mascotas, vacunas y el historial de peso en sus claves canónicas

```text
Error: expect(received).toEqual(expected) // deep equality

Expected: {"kind": "ok", "weights": [{"bodyCondition": null, "id": "weight-1", "measuredAt": "2026-08-21", "petId": "pet-1", "variation": 0.4, "weightKg": 12.4}]}
Received: undefined
Caída por aserción.
```

## T1 — verde R4

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t1-green.json > /tmp/115-t1-green.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        5.496 s, estimated 6 s
exit=0
```

Por suite:

- `src/screens/health/index.test.tsx`: 29 tests, 29 passed, 0 failed.

## T2 — medida parcial de las dos adaptaciones (append inicial falló por ruta duplicada; sin commit)

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t2-red.json > /tmp/115-t2-red.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 27 passed, 29 total
Snapshots:   0 total
Time:        6.447 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 29 tests, 27 passed, 2 failed.

### R4: health resuelve la mascota seleccionada shows the hub and a loading state while pets are pending

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 2

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
+   "paddingTop": 52,
  }
Caída por aserción.
```

### R4: health resuelve la mascota seleccionada R5 (mobile-design-drift): aplica el safe area superior al contenido

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

## T2 — rojo R2/R3 (13 previstos: 12 consultas + 1 aserción)

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t2-red-final.json > /tmp/115-t2-red-final.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       13 failed, 27 passed, 40 total
Snapshots:   0 total
Time:        17.455 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 40 tests, 27 passed, 13 failed.

### R4: health resuelve la mascota seleccionada shows the hub and a loading state while pets are pending

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 2

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
+   "paddingTop": 52,
  }
Caída por aserción.
```

### R4: health resuelve la mascota seleccionada R5 (mobile-design-drift): aplica el safe area superior al contenido

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden

```text
Error: Unable to find an element with testID: pet-hero-name
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) saca el padding horizontal a health-content y deja gap y paddingBottom en el scroll

```text
Error: Unable to find an element with testID: health-content
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) con contenido no pinta el título Salud

```text
Error: Unable to find an element with testID: pet-hero-name
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (pendiente), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (error), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (unreachable), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (missing-config), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (vacía), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R3: el hero muestra la mascota seleccionada de la lista pinta nombre, raza y media de la mascota sin estado ni dato destacado

```text
Error: Unable to find an element with testID: pet-hero-name
Caída por consulta.
```

### #115 R3: el hero muestra la mascota seleccionada de la lista pone el PetSwitcher en el slot del hero

```text
Error: Unable to find an element with testID: pet-hero-slot
Caída por consulta.
```

### #115 R3: el hero muestra la mascota seleccionada de la lista cambia el hero al pulsar otra mascota

```text
Error: Unable to find an element with testID: pet-hero
Caída por consulta.
```

## T2 — rojo definitivo y typecheck de tests válido

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t2-red-checked.json > /tmp/115-t2-red-checked.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       13 failed, 27 passed, 40 total
Snapshots:   0 total
Time:        20.404 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 40 tests, 27 passed, 13 failed.

### R4: health resuelve la mascota seleccionada shows the hub and a loading state while pets are pending

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 2

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
+   "paddingTop": 52,
  }
Caída por aserción.
```

### R4: health resuelve la mascota seleccionada R5 (mobile-design-drift): aplica el safe area superior al contenido

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden

```text
Error: Unable to find an element with testID: pet-hero-name
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) saca el padding horizontal a health-content y deja gap y paddingBottom en el scroll

```text
Error: Unable to find an element with testID: health-content
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) con contenido no pinta el título Salud

```text
Error: Unable to find an element with testID: pet-hero-name
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (pendiente), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (error), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (unreachable), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (missing-config), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (vacía), agrupa título y rama en health-states sin hero

```text
Error: Unable to find an element with testID: health-states
Caída por consulta.
```

### #115 R3: el hero muestra la mascota seleccionada de la lista pinta nombre, raza y media de la mascota sin estado ni dato destacado

```text
Error: Unable to find an element with testID: pet-hero-name
Caída por consulta.
```

### #115 R3: el hero muestra la mascota seleccionada de la lista pone el PetSwitcher en el slot del hero

```text
Error: Unable to find an element with testID: pet-hero-slot
Caída por consulta.
```

### #115 R3: el hero muestra la mascota seleccionada de la lista cambia el hero al pulsar otra mascota

```text
Error: Unable to find an element with testID: pet-hero
Caída por consulta.
```

T2: comprobación adicional de tests TypeScript antes del commit rojo:

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
$ bun run typecheck > /tmp/115-t2-red-typecheck.txt 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
```

La espera del segundo it de R2 termina en vaccines-section y weight-card dentro de health-content, para evitar leer el wrapper antes de la selección. Helper elementChild local, patrón del test del hero.

## T2 — verde R2/R3

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t2-green.json > /tmp/115-t2-green.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        6.324 s, estimated 21 s
exit=0
```

Por suite:

- `src/screens/health/index.test.tsx`: 40 tests, 40 passed, 0 failed.

## T3 — rojo R5 (2 consultas; 4 guardas nacen verdes)

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t3-red.json > /tmp/115-t3-red.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 44 passed, 46 total
Snapshots:   0 total
Time:        8.631 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 46 tests, 44 passed, 2 failed.

### #115 R5: la weight card dibuja la evolución con WeightChart con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace

```text
Error: Unable to find an element with testID: weight-chart
Caída por consulta.
```

### #115 R5: la weight card dibuja la evolución con WeightChart con un registro, muestra el aviso de datos insuficientes de WeightChart

```text
Error: Unable to find an element with testID: weight-chart-empty
Caída por consulta.
```

T3: nacen verdes `sin registros, deja el estado vacío y el enlace sin gráfica`, las dos filas de `con error de peso ($kind), no pinta gráfica` y `mientras el peso carga, no pinta gráfica`. Espía sobre WeightChart real, sin mock de react-native-svg; props leídas tras weight-chart en el árbol. Sin refactor opcional: se conserva la condición explícita para la gráfica.

## T3 — verde R5

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t3-green.json > /tmp/115-t3-green.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 passed, 46 total
Snapshots:   0 total
Time:        6.596 s, estimated 9 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 46 tests, 45 passed, 1 failed.

### #115 R5: la weight card dibuja la evolución con WeightChart con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace

```text
Error: expect(received).not.toBeNull()

Received: null
Caída por aserción.
```

## PARADA en T3 — verde fallido y commit prematuro

**No se completaron T3–T6. R1–R8 no se declaran cumplidos. R9 intacto.**

- T3 rojo observado: 2 fallos por consulta, 44 passed / 46 total, exit=1;
  coincide exactamente con tasks.md.
- T3 intento de verde observado: 1 fallo por aserción, 45 passed / 46 total,
  exit=1. No es verde. La espera `findByTestId('weight-chart')` sí termina.
  El it `con dos o más registros, pasa el historial entero y en orden entre
  la variación y el enlace` cae en
  `expect(within(elementChild(card, 2)).queryByTestId('weight-chart')).not.toBeNull()`;
  matcher `not.toBeNull`, Expected: un nodo, Received: `null`.
- Diagnóstico: el requisito dice `[2] es o contiene weight-chart`. El test
  escrito solo busca descendientes con `within`, que excluye el nodo raíz;
  la salida SVG real ya es el tercer hijo. La presencia en pantalla, la
  cardinalidad de 4 hijos y la fila de variación anterior pasan. La
  comprobación debe cubrir también la identidad del propio hijo, manteniendo
  la espera positiva. No se ha cambiado esa aserción tras esta parada.
- **Error de Codex:** se ejecutó `git commit` después del registrador de
  evidencia, pese a que este devolvió exit=1 y `Cuenta y suites esperadas:
  False`. Por eso `b6c08b2a` lleva el mensaje literal de verde pero sus tests
  no pasan. No debe considerarse un commit verde válido. No se ha reseteado,
  amendado ni rebaseado ningún commit para ocultar o corregir el fallo.
- La ejecución se detiene aquí para comunicar la discrepancia y el commit
  prematuro. No se añaden T4, sondas, hashes a traceability ni cierre ficticio.
  El leader/humano debe decidir cómo recuperar la secuencia rojo/verde antes
  de continuar. Sin push ni PR.

### Commits existentes al parar

```text
4763b520 test(mobile-health): #115 R4 red, weights without limit
4157d681 feat(mobile-health): #115 R4 share the weight-log query
78a2a0cd test(mobile-health): #115 R2 R3 red, bleed hero and A9 wrappers
3cbdc49b feat(mobile-health): #115 R2 R3 bleed pet hero with A9 layout
7e7f4a90 test(mobile-health): #115 R5 red, weight chart in the card
b6c08b2a feat(mobile-health): #115 R5 render WeightChart history
```

Los dos primeros pares son rojo/verde verificados (R4: 29/29; R2/R3: 40/40).
El último commit **no** es verde verificado.

### Árbol y alcance al parar

```text
$ git status --short
?? progress/impl_mobile-health-make-parity.md
$ git diff --name-only 1b87006e HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md'
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
```

El impl permanece sin commit, para no crear el commit final de trazabilidad
antes de completar el trabajo. Ningún fichero ajeno, otro worktree o branch
tocado. Delta parcial de Salud: 29 → 46 (+17); último resultado 45 passed,
1 failed. Las otras siete suites solo están medidas en la base; aún no hay
medición final ni anclas de cierre ni sondas M1–M22.

## Reanudación — CORRECCIÓN 1: parada por avance de origin/main

Leído este impl entero y la CORRECCIÓN 1 del humano antes de cambios. Se
conserva la parada anterior tal cual. No reset, amend ni rebase.

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/115-mobile-health-make-parity
$ git rev-parse --short HEAD
f6531fac
$ git status --short
?? progress/impl_mobile-health-make-parity.md
$ git log -1 --format='%h %s'
f6531fac docs(progress): #115 handoff CORRECCION 1, stop at T3
$ git diff --name-only 1b87006e HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md'
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
$ git fetch origin
(sin salida; exit=0)
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=1
$ git log -1 origin/main --format='%h %s'
e002a4a5 Merge pull request #195 from TrackerMex/feature/117-mobile-forgot-password
$ git rev-parse origin/main
e002a4a5596f235f73ba7876de4ebb1e4cf332ee
```

Anclas de CORRECCIÓN 1 medidas antes de cualquier cambio, desde
mobile-pet-tracker/:

```text
$ grep -cF "expect(within(elementChild(card, 2)).queryByTestId('weight-chart')).not.toBeNull();" src/screens/health/index.test.tsx
1
$ grep -cF "expect(elementChild(card, 2).props.testID).toBe('weight-chart');" src/screens/health/index.test.tsx
0
```

**PARADA:** origin/main avanzó de 8afae724 a e002a4a5 (#117). Se aplica el
candado explícito del handoff: con exit=1 no se implementa y el merge de main
lo hace el leader. No se modificaron tests ni producción, no se corrió Jest
ni typecheck, no se creó ningún commit. El fix de CORRECCIÓN 1 y T4–T6 siguen
pendientes. Solo se añade este registro al impl ya autorizado y sin commit.

## Reanudación tras CORRECCIÓN 2

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/115-mobile-health-make-parity
$ git rev-parse --short HEAD
ca3e3f14
$ git status --short
?? progress/impl_mobile-health-make-parity.md
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=0
$ git diff --name-only origin/main...HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md' ':!.claude/agents/leader.md'
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
specs/mobile-health-make-parity/traceability.md
```

El leader añadió a3548767 (merge de main e002a4a5) y ca3e3f14 (CORRECCIÓN 2), sin cambios ajenos al nuevo pathspec. H0 se conserva como referencia histórica de T0; R8 pasa a medirse con origin/main...HEAD. language-provider: 22 → 24 por #117, fichero no tocado por Codex. Objetivo final: 8 suites / 292 tests, Salud 55. Skills ya cargadas se mantienen, diseño cerrado y sin animación.

### Anclas de CORRECCIÓN 1 antes y después

Desde mobile-pet-tracker/:

```text
$ grep -cF "expect(within(elementChild(card, 2)).queryByTestId('weight-chart')).not.toBeNull();" src/screens/health/index.test.tsx
antes: 1
después: 0
$ grep -cF "expect(elementChild(card, 2).props.testID).toBe('weight-chart');" src/screens/health/index.test.tsx
antes: 0
después: 1
```

Cambio exacto del humano en el it R5. En H solo corregido el sangrado del bloque WeightChart (16/18/16 espacios) y la apertura de weight-card-empty (16), sin otro cambio en H. Se conservan todos los commits anteriores, incluido b6c08b2a como impl no verde.

## T3 — verde tras CORRECCION 1

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-t3-correction1.json > /tmp/115-t3-correction1.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-t3-correction1.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 passed, 1 total
Tests:       46 passed, 46 total
Snapshots:   0 total
Time:        14.231 s
exit=0
```

Por suite:

- `src/screens/health/index.test.tsx`: 46 tests, 46 passed, 0 failed.

Cuenta y suites esperadas: True
Registrador exit=0

T3 fix: `1ae2b78f fix(mobile-health): #115 R5 green, assert the chart slot itself`. El humano confirmó que T4 conserva su commit rojo con Jest exit=1 previsto, sujeto a registrador exit=0 y 13 fallos exactos. Los commits verdes requieren ambos exits en 0. Cada commit se encadena al registrador con `&&`.

### Anclas compartidas tras #117, antes de T4

```text
32. $ grep -cF -- '{ file: '"'"'src/screens/health/index.tsx'"'"', key: '"'"'home.' src/__tests__/ui-copy-table.ts
0 (esperado 0)
33. $ grep -cF -- 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2); // +1 #90 R5, +1 #95 R4, -2 #95 R5' src/__tests__/ui-language.test.ts
1 (esperado 1)
34. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 2],' src/__tests__/consistency-classnames.test.ts
2 (esperado 2)
35. $ grep -cF -- '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5' src/__tests__/consistency-classnames.test.ts
1 (esperado 1)
39. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 1],' src/__tests__/legibility-classnames.test.ts
1 (esperado 1)
40. $ grep -cF -- '13 + 1 + 1' src/__tests__/legibility-classnames.test.ts
1 (esperado 1)
41. $ grep -cF -- '+ 2, // #118 R11' src/__tests__/legibility-classnames.test.ts
1 (esperado 1)
42. $ grep -cF -- '+ 8, // #118 R1' src/providers/__tests__/language-provider.test.tsx
1 (esperado 1)
43. $ grep -cF -- ''"'"'screens/health/index.tsx'"'"': 0,' src/__tests__/design-drift.test.ts
1 (esperado 1)
44. $ grep -cF -- 'import { Card } from '"'"'../../components/card'"'"';' src/screens/health/index.tsx
1 (esperado 1)
```
Coinciden todas: True

## Base tras merge #117 — otras siete suites

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/components/__tests__/weight-chart.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/providers/__tests__/language-provider.test.tsx --json --outputFile=/tmp/115-after117.json > /tmp/115-after117.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-after117.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 7 passed, 7 total
Tests:       237 passed, 237 total
Snapshots:   0 total
Time:        5.359 s
exit=0
```

Por suite:

- `src/providers/__tests__/language-provider.test.tsx`: 24 tests, 24 passed, 0 failed.
- `src/__tests__/ui-language.test.ts`: 30 tests, 30 passed, 0 failed.
- `src/__tests__/legibility-classnames.test.ts`: 27 tests, 27 passed, 0 failed.
- `src/components/__tests__/pet-hero-header.test.tsx`: 37 tests, 37 passed, 0 failed.
- `src/__tests__/consistency-classnames.test.ts`: 55 tests, 55 passed, 0 failed.
- `src/__tests__/design-drift.test.ts`: 60 tests, 60 passed, 0 failed.
- `src/components/__tests__/weight-chart.test.tsx`: 4 tests, 4 passed, 0 failed.

Cuenta y suites esperadas: True
Registrador exit=0

## T4 — rojo R6/R1/R7 (13: 9 consultas + 4 aserciones)

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts --json --outputFile=/tmp/115-t4-red.json > /tmp/115-t4-red.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-t4-red.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 3 failed, 3 total
Tests:       13 failed, 127 passed, 140 total
Snapshots:   0 total
Time:        8.667 s, estimated 14 s
exit=1
```

Por suite:

- `src/__tests__/ui-language.test.ts`: 30 tests, 28 passed, 2 failed.
- `src/__tests__/consistency-classnames.test.ts`: 55 tests, 54 passed, 1 failed.
- `src/screens/health/index.test.tsx`: 55 tests, 45 passed, 10 failed.

### #65 R5: Health resuelve su copy por clave resuelve las 32 ocurrencias normativas

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/health/index.tsx",
    "key": "home.nextVaccineDays",
-   "uses": 1,
+   "uses": 0,
  }
Caída por aserción.
```

### #65 R18: los sitios resuelven por clave y no queda copy suelta resuelve cada ocurrencia de la tabla contra la clave exacta

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/health/index.tsx",
    "key": "home.nextVaccineDays",
-   "uses": 1,
+   "uses": 0,
  }
Caída por aserción.
```

### #62 R15: todo contador usa cifras tabulares screens/health/index.tsx aplica TABULAR_NUMS a sus 3 valores

```text
Error: expect(received).toHaveLength(expected)

Expected length: 3
Received length: 2
Received array:  ["style={TABULAR_NUMS}", "style={TABULAR_NUMS}"]
Caída por aserción.
```

### R5: vacunas con la próxima destacada highlights the nearest future dose and keeps row order

```text
Error: Unable to find an element with text: 1 may 2099
Caída por consulta.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila a: hoy 2026-12-31 12:00, próxima 2026-12-31

```text
Error: Unable to find an element with testID: next-vaccine-days
Caída por consulta.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila b: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: Unable to find an element with testID: next-vaccine-days
Caída por consulta.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila c: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: Unable to find an element with testID: next-vaccine-days
Caída por consulta.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila d: hoy 2027-01-30 12:00, próxima 2027-02-03

```text
Error: Unable to find an element with testID: next-vaccine-days
Caída por consulta.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila e: hoy 2026-12-31 12:00, próxima 2027-12-31

```text
Error: Unable to find an element with testID: next-vaccine-days
Caída por consulta.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila f: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: Unable to find an element with testID: next-vaccine-days
Caída por consulta.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila g: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: Unable to find an element with testID: next-vaccine-days
Caída por consulta.
```

### #115 R6: la próxima vacuna dice fecha y días restantes ordena la card en icono, columna y días, con la fecha en la columna

```text
Error: expect(received).toHaveLength(expected)

Expected length: 3
Received length: 2
Received array:  [<View className="size-11 items-center justify-center rounded-xl bg-warning-soft" style={{"borderCurve": "continuous"}}><View style={{"color": "#F59E0B"}} testID="health-icon-syringe" /></View>, <View className="flex-1 gap-1"><Text className="text-2xs font-semibold text-warning-strong">Próxima dosis</Text><Text className="font-bold text-foreground">Rabies</Text><Text className="font-normal text-muted">2099-05-01</Text></View>]
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes pinta los días con la receta exacta

```text
Error: Unable to find an element with testID: next-vaccine-days
Caída por consulta.
```

Cuenta y suites esperadas: True
Registrador exit=0

T4: los 13 rojos coinciden it por it y en el mecanismo de caída: 9 consultas y 4 aserciones. `checkUses` se detiene en la primera fila nueva (`home.nextVaccineDays`, uses 0 frente a 1); las tres filas nuevas aún no tienen llamadas. `#69 R10` nace verde, como fija tasks.md. Deltas aplicados sobre las expresiones encontradas (+3 copy, +1 counters/suma); no cambió la fila directUses.

```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
$ bun run typecheck > /tmp/115-t4-red-typecheck.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-t4-red-typecheck.exit; echo "exit=$health_check_exit"
$ tsc --noEmit
exit=0
```

## T4 — verde R6/R1/R7 y ocho suites completas del handoff

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx src/components/__tests__/weight-chart.test.tsx src/components/__tests__/pet-hero-header.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/providers/__tests__/language-provider.test.tsx --json --outputFile=/tmp/115-t4-green.json > /tmp/115-t4-green.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-t4-green.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 8 passed, 8 total
Tests:       292 passed, 292 total
Snapshots:   0 total
Time:        9.708 s, estimated 10 s
exit=0
```

Por suite:

- `src/__tests__/ui-language.test.ts`: 30 tests, 30 passed, 0 failed.
- `src/__tests__/consistency-classnames.test.ts`: 55 tests, 55 passed, 0 failed.
- `src/components/__tests__/pet-hero-header.test.tsx`: 37 tests, 37 passed, 0 failed.
- `src/providers/__tests__/language-provider.test.tsx`: 24 tests, 24 passed, 0 failed.
- `src/components/__tests__/weight-chart.test.tsx`: 4 tests, 4 passed, 0 failed.
- `src/__tests__/design-drift.test.ts`: 60 tests, 60 passed, 0 failed.
- `src/__tests__/legibility-classnames.test.ts`: 27 tests, 27 passed, 0 failed.
- `src/screens/health/index.test.tsx`: 55 tests, 55 passed, 0 failed.

Cuenta y suites esperadas: True
Registrador exit=0

## Anclas de cierre (+3 positivas)

Desde mobile-pet-tracker/. El número identifica el comando literal del handoff.

```text
0. $ grep -cF -- '- [x] Spec aprobada por humano (fecha: 2026-10-06' ../specs/mobile-health-make-parity/requirements.md
1 (esperado 1; grep exit=0)
1. $ grep -cF -- 'healthKeys.weights(selectedPetId ?? '"'"''"'"', 1)' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
2. $ grep -cF -- 'healthKeys.weights(selectedPetId ?? '"'"''"'"', undefined)' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
3. $ grep -cF -- 'selectedPetId!, fetch, 1)' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
4. $ grep -cF -- '<WeightChart entries={weight.data.weights} />' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
5. $ grep -cF -- '<PetHeroHeader' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
6. $ grep -cF -- 'variant="bleed"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
7. $ grep -cF -- 'from '"'"'../home/format'"'"'' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
8. $ grep -cF -- 'calendarDaysUntil(' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
9. $ grep -cF -- 'fmtDate(' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
10. $ grep -cF -- 'useLocale()' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
11. $ grep -cF -- '{nextVaccine.nextDoseAt}' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
12. $ grep -cF -- 'testID="next-vaccine-days"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
13. $ grep -cF -- 'testID="next-vaccine-date"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
14. $ grep -cF -- 'testID="health-states"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
15. $ grep -cF -- 'testID="health-content"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
16. $ grep -cF -- 'padding: 24' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
17. $ grep -cF -- 'paddingHorizontal: 24' src/screens/health/index.tsx
2 (esperado 2; grep exit=0)
18. $ grep -cF -- 'insets.top + 12' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
19. $ grep -cF -- 'insets.bottom + 96' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
20. $ grep -cF -- 'style={TABULAR_NUMS}' src/screens/health/index.tsx
3 (esperado 3; grep exit=0)
21. $ grep -cF -- 'style={CONTINUOUS_CORNER}' src/screens/health/index.tsx
2 (esperado 2; grep exit=0)
22. $ grep -cF -- text-accent-strong src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
23. $ grep -cF -- text-warning-strong src/screens/health/index.tsx
2 (esperado 2; grep exit=0)
24. $ grep -cF -- 't('"'"'health.health'"'"')' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
25. $ grep -cF -- '<PetSwitcher' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
26. $ grep -cF -- home.nextVaccineOverdue src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
27. $ grep -cF -- getPet src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
28. $ grep -cF -- react-native-reanimated src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
29. $ grep -cF -- StyleSheet.create src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
30. $ grep -cE -- '#[0-9A-Fa-f]{3,8}\b' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
31. $ grep -cE -- '\w-\[' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
32. $ grep -cF -- '{ file: '"'"'src/screens/health/index.tsx'"'"', key: '"'"'home.' src/__tests__/ui-copy-table.ts
3 (esperado 3; grep exit=0)
33. $ grep -cF -- 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2); // +1 #90 R5, +1 #95 R4, -2 #95 R5' src/__tests__/ui-language.test.ts
0 (esperado 0; grep exit=1)
34. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 2],' src/__tests__/consistency-classnames.test.ts
1 (esperado 1; grep exit=0)
35. $ grep -cF -- '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5' src/__tests__/consistency-classnames.test.ts
0 (esperado 0; grep exit=1)
36. $ grep -cF -- 'padding: 24, paddingBottom: 120' src/screens/health/index.test.tsx
0 (esperado 0; grep exit=1)
37. $ grep -cF -- 'expect.any(Function)' src/screens/health/index.test.tsx
0 (esperado 0; grep exit=1)
38. $ grep -cF -- 'healthKeys.weights('"'"'pet-1'"'"', undefined)' src/screens/health/index.test.tsx
1 (esperado 1; grep exit=0)
39. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 1],' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
40. $ grep -cF -- '13 + 1 + 1' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
41. $ grep -cF -- '+ 2, // #118 R11' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
42. $ grep -cF -- '+ 8, // #118 R1' src/providers/__tests__/language-provider.test.tsx
1 (esperado 1; grep exit=0)
43. $ grep -cF -- ''"'"'screens/health/index.tsx'"'"': 0,' src/__tests__/design-drift.test.ts
1 (esperado 1; grep exit=0)
44. $ grep -cF -- 'import { Card } from '"'"'../../components/card'"'"';' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
45. $ grep -cF -- 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1' src/__tests__/ui-language.test.ts
1 (esperado 1; grep exit=0)
46. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 2 + 1], // #115 R6' src/__tests__/consistency-classnames.test.ts
1 (esperado 1; grep exit=0)
47. $ grep -cF -- '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts
1 (esperado 1; grep exit=0)
```
Coinciden todas: True.

## T5 — M1: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M1/mobile-pet-tracker/src/screens/health/index.tsx
@@ -59,8 +59,8 @@
     enabled: selectedPetId !== null,
   });
   const weight = useQuery({
-    queryKey: healthKeys.weights(selectedPetId ?? '', undefined),
-    queryFn: () => listWeights(baseUrl, token ?? '', selectedPetId!),
+    queryKey: healthKeys.weights(selectedPetId ?? '', 1),
+    queryFn: () => listWeights(baseUrl, token ?? '', selectedPetId!, fetch, 1),
     enabled: selectedPetId !== null,
   });
   const selectedPet =
```

## T5 — M1, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m1.json > /tmp/115-m1.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m1.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 52 passed, 55 total
Snapshots:   0 total
Time:        8.401 s, estimated 9 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 52 passed, 3 failed.

### R4: health resuelve la mascota seleccionada keeps API order and selects the first pet by default

```text
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://example.test/v1", "jwt-token", "pet-1"
Received: "http://example.test/v1", "jwt-token", "pet-1", [Function fetch], 1

Number of calls: 1
Caída por aserción.
```

### R4: health resuelve la mascota seleccionada selects a pressed pet and reloads its health records

```text
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "http://example.test/v1", "jwt-token", "pet-2"
Received
       1: "http://example.test/v1", "jwt-token", "pet-1", [Function fetch], 1
       2: "http://example.test/v1", "jwt-token", "pet-2", [Function fetch], 1

Number of calls: 2
Caída por aserción.
```

### #87 R13: HealthScreen lee por TanStack Query deja mascotas, vacunas y el historial de peso en sus claves canónicas

```text
Error: expect(received).toEqual(expected) // deep equality

Expected: {"kind": "ok", "weights": [{"bodyCondition": null, "id": "weight-1", "measuredAt": "2026-08-21", "petId": "pet-1", "variation": 0.4, "weightKg": 12.4}]}
Received: undefined
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M1: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M1: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M2: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M2/mobile-pet-tracker/src/screens/health/index.tsx
@@ -242,7 +242,7 @@
                 ) : null}
 
                 {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
-                  <WeightChart entries={weight.data.weights} />
+                  <WeightChart entries={weight.data.weights.slice(0, 2)} />
                 ) : null}
 
                 {weight.data?.kind === 'ok' && weight.data.weights.length === 0 ? (
```

## T5 — M2, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m2.json > /tmp/115-m2.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m2.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        7.481 s, estimated 9 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #115 R5: la weight card dibuja la evolución con WeightChart con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

  Array [
    "weight-3",
    "weight-2",
-   "weight-1",
  ]
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M2: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M2: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M3: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M3/mobile-pet-tracker/src/screens/health/index.tsx
@@ -242,7 +242,7 @@
                 ) : null}
 
                 {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
-                  <WeightChart entries={weight.data.weights} />
+                  <WeightChart entries={[...weight.data.weights].reverse()} />
                 ) : null}
 
                 {weight.data?.kind === 'ok' && weight.data.weights.length === 0 ? (
```

## T5 — M3, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m3.json > /tmp/115-m3.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m3.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        8.457 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #115 R5: la weight card dibuja la evolución con WeightChart con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 2
+ Received  + 2

  Array [
-   "weight-3",
-   "weight-2",
    "weight-1",
+   "weight-2",
+   "weight-3",
  ]
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M3: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M3: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M4: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M4/mobile-pet-tracker/src/screens/health/index.tsx
@@ -230,6 +230,10 @@
                 </View>
 
                 {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
+                  <WeightChart entries={weight.data.weights} />
+                ) : null}
+
+                {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
                   <View className="flex-row justify-end">
                     <Text
                       testID="weight-variation"
@@ -241,9 +245,6 @@
                   </View>
                 ) : null}
 
-                {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
-                  <WeightChart entries={weight.data.weights} />
-                ) : null}
 
                 {weight.data?.kind === 'ok' && weight.data.weights.length === 0 ? (
                   <Text testID="weight-card-empty" className="font-normal text-muted">
```

## T5 — M4, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m4.json > /tmp/115-m4.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m4.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 53 passed, 55 total
Snapshots:   0 total
Time:        7.456 s, estimated 9 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 53 passed, 2 failed.

### #115 R5: la weight card dibuja la evolución con WeightChart con dos o más registros, pasa el historial entero y en orden entre la variación y el enlace

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "flex-row justify-end"
Received: undefined
Caída por aserción.
```

### #115 R5: la weight card dibuja la evolución con WeightChart con un registro, muestra el aviso de datos insuficientes de WeightChart

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "weight-chart-empty"
Received: undefined
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M4: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M4: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M5: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M5/mobile-pet-tracker/src/screens/health/index.tsx
@@ -241,7 +241,7 @@
                   </View>
                 ) : null}
 
-                {weight.data?.kind === 'ok' && weight.data.weights.length > 0 ? (
+                {weight.data?.kind === 'ok' ? (
                   <WeightChart entries={weight.data.weights} />
                 ) : null}
 
```

## T5 — M5, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m5.json > /tmp/115-m5.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m5.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        7.266 s, estimated 8 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #115 R5: la weight card dibuja la evolución con WeightChart sin registros, deja el estado vacío y el enlace sin gráfica

```text
Error: expect(received).toBeNull()

Received: <Text className="text-muted" testID="weight-chart-empty">Aún no hay datos suficientes</Text>
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M5: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M5: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M6: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M6/mobile-pet-tracker/src/screens/health/index.tsx
@@ -94,7 +94,7 @@
     >
       {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
         <>
-          <PetHeroHeader pet={selectedPet} variant="bleed">
+          <PetHeroHeader pet={selectedPet} variant="card">
             <PetSwitcher
               pets={pets.data.pets}
               selectedPetId={selectedPetId}
```

## T5 — M6, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m6.json > /tmp/115-m6.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m6.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        7.653 s, estimated 8 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #115 R2: Salud abre con el hero a sangre (A9) con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "overflow-hidden bg-default"
Received: "overflow-hidden rounded-card bg-default"
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M6: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M6: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M7: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M7/mobile-pet-tracker/src/screens/health/index.tsx
@@ -94,6 +94,7 @@
     >
       {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
         <>
+          <View testID="health-content" style={{ paddingHorizontal: 24, gap: 16 }}>
           <PetHeroHeader pet={selectedPet} variant="bleed">
             <PetSwitcher
               pets={pets.data.pets}
@@ -101,7 +102,6 @@
               onSelect={selectPet}
             />
           </PetHeroHeader>
-          <View testID="health-content" style={{ paddingHorizontal: 24, gap: 16 }}>
             {selectedPetId ? (
               <View testID="vaccines-section" className="gap-3">
                 <View className="flex-row items-center gap-2">
```

### M7: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M7: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M7/mobile-pet-tracker/src/screens/health/index.tsx
@@ -94,6 +94,7 @@
     >
       {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
         <>
+          <View testID="health-content" style={{ paddingHorizontal: 24, gap: 16 }}>
           <PetHeroHeader pet={selectedPet} variant="bleed">
             <PetSwitcher
               pets={pets.data.pets}
@@ -101,7 +102,6 @@
               onSelect={selectPet}
             />
           </PetHeroHeader>
-          <View testID="health-content" style={{ paddingHorizontal: 24, gap: 16 }}>
             {selectedPetId ? (
               <View testID="vaccines-section" className="gap-3">
                 <View className="flex-row items-center gap-2">
```

### M7 — incidencia del reporte JSON, después de la aserción prevista

El comando con `--json --outputFile=/tmp/115-m7.json` imprimió 1 suite, 1 failed / 54 passed / 55 total, exit=1. El it de R2 `con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden` cayó por `toBe` en `expect(hero.parent).toBe(content.parent)`, como design §2. Después de ese resultado, el emisor JSON de Jest lanzó `TypeError: Converting circular structure to JSON` (`children[0].parent` cierra el ciclo); no generó el JSON y el registrador JSON dio exit=1. La aserción del test no cayó por TypeError. H e índice ya restaurados en 0. Se repite la misma mutación y suite sin los flags opcionales de JSON, con salida estándar (comando normativo del handoff), para registrar evidencia utilizable. No se modifica el test. Una primera escritura de esta nota usó ruta relativa de raíz desde cwd móvil, falló sin modificar archivos y se repitió con ruta absoluta.

## T5 — M7, evidencia estándar

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx > /tmp/115-m7-plain.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m7-plain.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        7.46 s, estimated 9 s
exit=1
```

```text
● #115 R2: Salud abre con el hero a sangre (A9) › con mascotas, pet-hero y health-content son los únicos hijos del scroll, en ese orden

    expect(received).toBe(expected) // Object.is equality

    - Expected  - 2
    + Received  + 0

    @@ -1,6 +1,5 @@
    - <View>
      <View
        style={
          Object {
            "gap": 16,
            "paddingHorizontal": 24,
    @@ -393,9 +392,8 @@
                  "color": "#6B7280",
                }
              }
              testID="health-icon-chevron-right"
            />
    -       </View>
          </View>
        </View>
      </View>

      754 |     const hero = screen.getByTestId('pet-hero');
      755 |     const content = screen.getByTestId('health-content');
    > 756 |     expect(hero.parent).toBe(content.parent);
          |                         ^
      757 |     expect(hero.parent!.children).toHaveLength(2);
      758 |     expect(elementChild(hero.parent!, 0)).toBe(hero);
      759 |     expect(elementChild(hero.parent!, 1)).toBe(content);

      at Object.toBe (src/screens/health/index.test.tsx:756:25)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```
Expected: parent de health-content (View exterior del scroll). Received: health-content (View interior), que pasa a ser parent del hero. Caída por aserción toBe; coincide con design §2.
Cuenta y suites esperadas: True
Registrador exit=0

### M7: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M8: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M8/mobile-pet-tracker/src/screens/health/index.tsx
@@ -100,6 +100,7 @@
               selectedPetId={selectedPetId}
               onSelect={selectPet}
             />
+            <Text>{t('health.health')}</Text>
           </PetHeroHeader>
           <View testID="health-content" style={{ paddingHorizontal: 24, gap: 16 }}>
             {selectedPetId ? (
```

## T5 — M8, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx src/__tests__/ui-language.test.ts --json --outputFile=/tmp/115-m8.json > /tmp/115-m8.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m8.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 2 failed, 2 total
Tests:       4 failed, 81 passed, 85 total
Snapshots:   0 total
Time:        7.301 s, estimated 8 s
exit=1
```

Por suite:

- `src/__tests__/ui-language.test.ts`: 30 tests, 28 passed, 2 failed.
- `src/screens/health/index.test.tsx`: 55 tests, 53 passed, 2 failed.

### #65 R5: Health resuelve su copy por clave resuelve las 32 ocurrencias normativas

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/health/index.tsx",
    "key": "health.health",
-   "uses": 1,
+   "uses": 2,
  }
Caída por aserción.
```

### #65 R18: los sitios resuelven por clave y no queda copy suelta resuelve cada ocurrencia de la tabla contra la clave exacta

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/health/index.tsx",
    "key": "health.health",
-   "uses": 1,
+   "uses": 2,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) con contenido no pinta el título Salud

```text
Error: expect(received).toBeNull()

Received: <Text>Salud</Text>
Caída por aserción.
```

### #115 R3: el hero muestra la mascota seleccionada de la lista pone el PetSwitcher en el slot del hero

```text
Error: expect(received).toHaveLength(expected)

Expected length: 1
Received length: 2
Received array:  [<RCTScrollView horizontal={true} showsHorizontalScrollIndicator={false}><View><View className="flex-row gap-2"><View accessibilityLabel="Luna" accessibilityRole="button" accessibilityState={{"busy": undefined, "checked": undefined, "disabled": undefined, "expanded": undefined, "selected": true}} accessibilityValue={{"max": undefined, "min": undefined, "now": undefined, "text": undefined}} accessible={true} className="items-center justify-center rounded-full border-2 border-accent bg-accent-soft p-1" collapsable={false} focusable={true} onBlur={[Function onBlur]} onClick={[Function onClick]} onFocus={[Function onFocus]} onResponderGrant={[Function onResponderGrant]} onResponderMove={[Function onResponderMove]} onResponderRelease={[Function onResponderRelease]} onResponderTerminate={[Function onResponderTerminate]} onResponderTerminationRequest={[Function onResponderTerminationRequest]} onStartShouldSetResponder={[Function onStartShouldSetResponder]} testID="pet-chip-pet-1"><View className="avatar__root avatar__root--size-sm avatar__root--variant-soft--color-accent" style={[{"borderCurve": "continuous"}, undefined]}><View aria-label="Avatar" className="avatar__fallback-container" collapsable={false} entering={{"build": [Function anonymous], "delayV": 0, "durationV": 200, "easingV": [Function ease], "randomizeDelay": false, "reduceMotionV": "system"}} jestAnimatedProps={{"value": {}}} jestAnimatedStyle={{"value": {}}} jestInlineStyle={[{"borderCurve": "continuous"}, undefined, undefined]} role="img" style={[{"borderCurve": "continuous"}, undefined, undefined]} testID="pet-avatar-fallback-pet-1"><Text className="font-normal avatar__fallback-text avatar__fallback-text--size-sm avatar__fallback-text--color-accent" maxFontSizeMultiplier={1.4}>L</Text></View></View></View></View></View></RCTScrollView>, <Text>Salud</Text>]
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M8: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M8: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M9: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M9/mobile-pet-tracker/src/screens/health/index.tsx
@@ -88,6 +88,7 @@
       className="flex-1 bg-background"
       contentInsetAdjustmentBehavior="automatic"
       contentContainerStyle={{
+        padding: 24,
         gap: 16,
         paddingBottom: insets.bottom + 96,
       }}
```

## T5 — M9, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m9.json > /tmp/115-m9.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m9.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       7 failed, 48 passed, 55 total
Snapshots:   0 total
Time:        7.176 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 48 passed, 7 failed.

### R4: health resuelve la mascota seleccionada shows the hub and a loading state while pets are pending

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) saca el padding horizontal a health-content y deja gap y paddingBottom en el scroll

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (pendiente), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (error), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (unreachable), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (missing-config), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (vacía), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 0
+ Received  + 1

  Object {
    "gap": 16,
+   "padding": 24,
    "paddingBottom": 120,
  }
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M9: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M9: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M10: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M10/mobile-pet-tracker/src/screens/health/index.tsx
@@ -277,7 +277,7 @@
       ) : (
         <View
           testID="health-states"
-          style={{ paddingHorizontal: 24, paddingTop: insets.top + 12, gap: 16 }}
+          style={{ paddingHorizontal: 24, gap: 16 }}
         >
           <Text className="text-2xl font-black text-foreground">
             {t('health.health')}
```

## T5 — M10, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m10.json > /tmp/115-m10.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m10.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       6 failed, 49 passed, 55 total
Snapshots:   0 total
Time:        7.328 s, estimated 8 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 49 passed, 6 failed.

### R4: health resuelve la mascota seleccionada R5 (mobile-design-drift): aplica el safe area superior al contenido

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

  Object {
    "gap": 16,
    "paddingHorizontal": 24,
-   "paddingTop": 52,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (pendiente), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

  Object {
    "gap": 16,
    "paddingHorizontal": 24,
-   "paddingTop": 52,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (error), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

  Object {
    "gap": 16,
    "paddingHorizontal": 24,
-   "paddingTop": 52,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (unreachable), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

  Object {
    "gap": 16,
    "paddingHorizontal": 24,
-   "paddingTop": 52,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (missing-config), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

  Object {
    "gap": 16,
    "paddingHorizontal": 24,
-   "paddingTop": 52,
  }
Caída por aserción.
```

### #115 R2: Salud abre con el hero a sangre (A9) sin contenido (vacía), agrupa título y rama en health-states sin hero

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 0

  Object {
    "gap": 16,
    "paddingHorizontal": 24,
-   "paddingTop": 52,
  }
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M10: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M10: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M11: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M11/mobile-pet-tracker/src/screens/health/index.tsx
@@ -94,7 +94,7 @@
     >
       {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
         <>
-          <PetHeroHeader pet={selectedPet} variant="bleed">
+          <PetHeroHeader pet={selectedPet} variant="bleed" status={{ label: "Connected", tone: "muted" }}>
             <PetSwitcher
               pets={pets.data.pets}
               selectedPetId={selectedPetId}
```

## T5 — M11, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m11.json > /tmp/115-m11.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m11.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        7.709 s, estimated 8 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #115 R3: el hero muestra la mascota seleccionada de la lista pinta nombre, raza y media de la mascota sin estado ni dato destacado

```text
Error: expect(received).toBeNull()

Received: <View accessibilityLabel="Connected" accessible={true} className="flex-row items-center gap-1 self-start rounded-full px-2.5 py-0.5 bg-default" testID="pet-hero-status"><View className="size-1.5 rounded-full bg-muted" testID="pet-hero-status-dot" /><Text className="text-2xs font-semibold text-muted" testID="pet-hero-status-text">Connected</Text></View>
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M11: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M11: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M12: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M12/mobile-pet-tracker/src/screens/health/index.tsx
@@ -94,7 +94,7 @@
     >
       {pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (
         <>
-          <PetHeroHeader pet={selectedPet} variant="bleed">
+          <PetHeroHeader pet={pets.data.pets[0]} variant="bleed">
             <PetSwitcher
               pets={pets.data.pets}
               selectedPetId={selectedPetId}
```

## T5 — M12, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m12.json > /tmp/115-m12.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m12.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        8.139 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #115 R3: el hero muestra la mascota seleccionada de la lista cambia el hero al pulsar otra mascota

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Max
Received:
  Luna
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M12: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M12: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M13: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M13/mobile-pet-tracker/src/screens/health/index.tsx
@@ -137,7 +137,7 @@
                         {nextVaccine.name}
                       </Text>
                       <Text testID="next-vaccine-date" className="font-normal text-muted">
-                        {fmtDate(nextVaccine.nextDoseAt!, locale)}
+                        {fmtDate(nextVaccine.nextDoseAt!, 'es-MX')}
                       </Text>
                     </View>
                     <Text
```

## T5 — M13, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m13.json > /tmp/115-m13.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m13.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 53 passed, 55 total
Snapshots:   0 total
Time:        7.408 s, estimated 8 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 53 passed, 2 failed.

### #115 R6: la próxima vacuna dice fecha y días restantes fila f: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Jan 2, 2027
Received:
  2 ene 2027
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila g: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  Jan 1, 2027
Received:
  1 ene 2027
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M13: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M13: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M14: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M14/mobile-pet-tracker/src/screens/health/index.tsx
@@ -79,7 +79,7 @@
           )[0]
       : undefined;
   const days = nextVaccine
-    ? calendarDaysUntil(nextVaccine.nextDoseAt!, new Date())
+    ? new Date(nextVaccine.nextDoseAt!).getDate() - new Date().getDate()
     : 0;
 
   return (
```

## T5 — M14, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m14.json > /tmp/115-m14.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m14.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 51 passed, 55 total
Snapshots:   0 total
Time:        6.913 s, estimated 8 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 51 passed, 4 failed.

### #115 R6: la próxima vacuna dice fecha y días restantes fila b: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  2 d
Received:
  -29 d
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila d: hoy 2027-01-30 12:00, próxima 2027-02-03

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  4 d
Received:
  -27 d
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila e: hoy 2026-12-31 12:00, próxima 2027-12-31

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  365 d
Received:
  Hoy
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila f: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  2 d
Received:
  -29 d
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M14: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M14: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M15: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M15/mobile-pet-tracker/src/screens/health/index.tsx
@@ -79,7 +79,7 @@
           )[0]
       : undefined;
   const days = nextVaccine
-    ? calendarDaysUntil(nextVaccine.nextDoseAt!, new Date())
+    ? calendarDaysUntil(`${new Date().getFullYear() + (nextVaccine.nextDoseAt!.slice(5) < localTodayIso().slice(5) ? 1 : 0)}-${nextVaccine.nextDoseAt!.slice(5)}`, new Date())
     : 0;
 
   return (
```

## T5 — M15, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m15.json > /tmp/115-m15.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m15.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        7.15 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #115 R6: la próxima vacuna dice fecha y días restantes fila e: hoy 2026-12-31 12:00, próxima 2027-12-31

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  365 d
Received:
  Hoy
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M15: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M15: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M16: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M16/mobile-pet-tracker/src/screens/health/index.tsx
@@ -145,7 +145,7 @@
                       className="text-lg font-black text-warning-strong"
                       style={TABULAR_NUMS}
                       accessibilityLabel={
-                        days > 0 ? t('home.nextVaccineDaysLeft', { days }) : undefined
+                        t('home.nextVaccineDaysLeft', { days })
                       }
                     >
                       {days === 0
```

## T5 — M16, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m16.json > /tmp/115-m16.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m16.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 52 passed, 55 total
Snapshots:   0 total
Time:        9.65 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 52 passed, 3 failed.

### #115 R6: la próxima vacuna dice fecha y días restantes fila a: hoy 2026-12-31 12:00, próxima 2026-12-31

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: undefined
Received: "Faltan 0 días"
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila c: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: undefined
Received: "Faltan 0 días"
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila g: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: undefined
Received: "In 0 days"
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M16: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M16: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M17: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M17/mobile-pet-tracker/src/screens/health/index.tsx
@@ -145,12 +145,12 @@
                       className="text-lg font-black text-warning-strong"
                       style={TABULAR_NUMS}
                       accessibilityLabel={
-                        days > 0 ? t('home.nextVaccineDaysLeft', { days }) : undefined
+                        days > 0 ? t('home.nextVaccineDays', { days }) : undefined
                       }
                     >
                       {days === 0
                         ? t('home.nextVaccineToday')
-                        : t('home.nextVaccineDays', { days })}
+                        : t('home.nextVaccineDaysLeft', { days })}
                     </Text>
                   </Card>
                 ) : null}
```

## T5 — M17, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m17.json > /tmp/115-m17.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m17.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 51 passed, 55 total
Snapshots:   0 total
Time:        7.073 s, estimated 10 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 51 passed, 4 failed.

### #115 R6: la próxima vacuna dice fecha y días restantes fila b: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  2 d
Received:
  Faltan 2 días
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila d: hoy 2027-01-30 12:00, próxima 2027-02-03

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  4 d
Received:
  Faltan 4 días
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila e: hoy 2026-12-31 12:00, próxima 2027-12-31

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  365 d
Received:
  Faltan 365 días
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila f: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: expect(instance).toHaveTextContent()

Expected instance to have text content:
  2 d
Received:
  In 2 days
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M17: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M17: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M18: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M18/mobile-pet-tracker/src/screens/health/index.tsx
@@ -139,6 +139,7 @@
                       <Text testID="next-vaccine-date" className="font-normal text-muted">
                         {fmtDate(nextVaccine.nextDoseAt!, locale)}
                       </Text>
+                      <Text>{nextVaccine.nextDoseAt}</Text>
                     </View>
                     <Text
                       testID="next-vaccine-days"
```

## T5 — M18, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m18.json > /tmp/115-m18.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m18.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       9 failed, 46 passed, 55 total
Snapshots:   0 total
Time:        7.22 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 46 passed, 9 failed.

### R5: vacunas con la próxima destacada highlights the nearest future dose and keeps row order

```text
Error: expect(received).toBeNull()

Received: <Text>2099-05-01</Text>
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila a: hoy 2026-12-31 12:00, próxima 2026-12-31

```text
Error: expect(received).toBeNull()

Received: <Text>2026-12-31</Text>
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila b: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: expect(received).toBeNull()

Received: <Text>2027-01-02</Text>
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila c: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: expect(received).toBeNull()

Received: <Text>2027-01-01</Text>
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila d: hoy 2027-01-30 12:00, próxima 2027-02-03

```text
Error: expect(received).toBeNull()

Received: <Text>2027-02-03</Text>
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila e: hoy 2026-12-31 12:00, próxima 2027-12-31

```text
Error: expect(received).toBeNull()

Received: <Text>2027-12-31</Text>
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila f: hoy 2026-12-31 12:00, próxima 2027-01-02

```text
Error: expect(received).toBeNull()

Received: <Text>2027-01-02</Text>
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila g: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: expect(received).toBeNull()

Received: <Text>2027-01-01</Text>
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes ordena la card en icono, columna y días, con la fecha en la columna

```text
Error: expect(received).toHaveLength(expected)

Expected length: 3
Received length: 4
Received array:  [<Text className="text-2xs font-semibold text-warning-strong">Próxima dosis</Text>, <Text className="font-bold text-foreground">Rabies</Text>, <Text className="font-normal text-muted" testID="next-vaccine-date">1 may 2099</Text>, <Text>2099-05-01</Text>]
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M18: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M18: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M19: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M19/mobile-pet-tracker/src/screens/health/index.tsx
@@ -142,7 +142,7 @@
                     </View>
                     <Text
                       testID="next-vaccine-days"
-                      className="text-lg font-black text-warning-strong"
+                      className="text-lg font-black text-warning"
                       style={TABULAR_NUMS}
                       accessibilityLabel={
                         days > 0 ? t('home.nextVaccineDaysLeft', { days }) : undefined
```

## T5 — M19, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx src/__tests__/legibility-classnames.test.ts --json --outputFile=/tmp/115-m19.json > /tmp/115-m19.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m19.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 2 failed, 2 total
Tests:       2 failed, 80 passed, 82 total
Snapshots:   0 total
Time:        8.268 s
exit=1
```

Por suite:

- `src/__tests__/legibility-classnames.test.ts`: 27 tests, 26 passed, 1 failed.
- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #61 R5: text-warning deja de usarse como color de texto no deja ningún text-warning suelto en las fuentes

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "screens/health/index.tsx",
+ ]
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes pinta los días con la receta exacta

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "text-lg font-black text-warning-strong"
Received: "text-lg font-black text-warning"
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M19: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M19: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M20: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M20/mobile-pet-tracker/src/screens/health/index.tsx
@@ -143,7 +143,6 @@
                     <Text
                       testID="next-vaccine-days"
                       className="text-lg font-black text-warning-strong"
-                      style={TABULAR_NUMS}
                       accessibilityLabel={
                         days > 0 ? t('home.nextVaccineDaysLeft', { days }) : undefined
                       }
```

## T5 — M20, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx src/__tests__/consistency-classnames.test.ts --json --outputFile=/tmp/115-m20.json > /tmp/115-m20.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m20.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 2 failed, 2 total
Tests:       2 failed, 108 passed, 110 total
Snapshots:   0 total
Time:        7.483 s, estimated 8 s
exit=1
```

Por suite:

- `src/__tests__/consistency-classnames.test.ts`: 55 tests, 54 passed, 1 failed.
- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #62 R15: todo contador usa cifras tabulares screens/health/index.tsx aplica TABULAR_NUMS a sus 3 valores

```text
Error: expect(received).toHaveLength(expected)

Expected length: 3
Received length: 2
Received array:  ["style={TABULAR_NUMS}", "style={TABULAR_NUMS}"]
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes pinta los días con la receta exacta

```text
Error: expect(received).toEqual(expected) // deep equality

Expected: {"fontVariant": ["tabular-nums"]}
Received: undefined
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M20: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M20: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M21: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M21/mobile-pet-tracker/src/screens/health/index.tsx
@@ -139,7 +139,6 @@
                       <Text testID="next-vaccine-date" className="font-normal text-muted">
                         {fmtDate(nextVaccine.nextDoseAt!, locale)}
                       </Text>
-                    </View>
                     <Text
                       testID="next-vaccine-days"
                       className="text-lg font-black text-warning-strong"
@@ -152,6 +151,7 @@
                         ? t('home.nextVaccineToday')
                         : t('home.nextVaccineDays', { days })}
                     </Text>
+                    </View>
                   </Card>
                 ) : null}
 
```

## T5 — M21, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx --json --outputFile=/tmp/115-m21.json > /tmp/115-m21.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m21.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 54 passed, 55 total
Snapshots:   0 total
Time:        7.158 s
exit=1
```

Por suite:

- `src/screens/health/index.test.tsx`: 55 tests, 54 passed, 1 failed.

### #115 R6: la próxima vacuna dice fecha y días restantes ordena la card en icono, columna y días, con la fecha en la columna

```text
Error: expect(received).toHaveLength(expected)

Expected length: 3
Received length: 2
Received array:  [<View className="size-11 items-center justify-center rounded-xl bg-warning-soft" style={{"borderCurve": "continuous"}}><View style={{"color": "#F59E0B"}} testID="health-icon-syringe" /></View>, <View className="flex-1 gap-1"><Text className="text-2xs font-semibold text-warning-strong">Próxima dosis</Text><Text className="font-bold text-foreground">Rabies</Text><Text className="font-normal text-muted" testID="next-vaccine-date">1 may 2099</Text><Text accessibilityLabel="Faltan 26419 días" className="text-lg font-black text-warning-strong" style={{"fontVariant": ["tabular-nums"]}} testID="next-vaccine-days">26419 d</Text></View>]
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M21: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M21: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — M22: mutación temporal (no commit)

```diff
--- HEAD/mobile-pet-tracker/src/screens/health/index.tsx
+++ M22/mobile-pet-tracker/src/screens/health/index.tsx
@@ -145,7 +145,7 @@
                       className="text-lg font-black text-warning-strong"
                       style={TABULAR_NUMS}
                       accessibilityLabel={
-                        days > 0 ? t('home.nextVaccineDaysLeft', { days }) : undefined
+                        days > 0 ? t('home.nextVaccineDaysLeft', { days }) : t('home.nextVaccineToday')
                       }
                     >
                       {days === 0
```

## T5 — M22, evidencia

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/health/index.test.tsx src/__tests__/ui-language.test.ts --json --outputFile=/tmp/115-m22.json > /tmp/115-m22.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-m22.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 2 failed, 2 total
Tests:       5 failed, 80 passed, 85 total
Snapshots:   0 total
Time:        7.834 s
exit=1
```

Por suite:

- `src/__tests__/ui-language.test.ts`: 30 tests, 28 passed, 2 failed.
- `src/screens/health/index.test.tsx`: 55 tests, 52 passed, 3 failed.

### #65 R5: Health resuelve su copy por clave resuelve las 32 ocurrencias normativas

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/health/index.tsx",
    "key": "home.nextVaccineToday",
-   "uses": 1,
+   "uses": 2,
  }
Caída por aserción.
```

### #65 R18: los sitios resuelven por clave y no queda copy suelta resuelve cada ocurrencia de la tabla contra la clave exacta

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "file": "src/screens/health/index.tsx",
    "key": "home.nextVaccineToday",
-   "uses": 1,
+   "uses": 2,
  }
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila a: hoy 2026-12-31 12:00, próxima 2026-12-31

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: undefined
Received: "Hoy"
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila c: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: undefined
Received: "Hoy"
Caída por aserción.
```

### #115 R6: la próxima vacuna dice fecha y días restantes fila g: hoy 2027-01-01 12:00, próxima 2027-01-01

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: undefined
Received: "Today"
Caída por aserción.
```

Cuenta y suites esperadas: True
Registrador exit=0

M22: coincide con design §2 (it requerido + caída por aserción): True. Registrador de sonda exit=0.

### M22: restauración contra HEAD

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/health/index.tsx

$ git diff --quiet -- mobile-pet-tracker/src/screens/health/index.tsx; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git status --short
?? progress/impl_mobile-health-make-parity.md
```
Índice y fichero H restaurados: ambos exits 0. El único archivo sin commit es el impl autorizado.

## T5 — resumen de las 22 sondas

Todas sobre el verde `08d106e2`, sin commits de mutaciones. Diagnósticos, comandos y diffs literales constan arriba.

| Sonda | It(s) que caen | Fallos | Cómo | Restauración H / índice |
|---|---|---:|---|---|
| M1 | R4: las dos llamadas; #87 R13: clave canónica | 3 | aserción, coincide | 0 / 0 |
| M2 | R5: dos o más, ids del historial | 1 | aserción, coincide | 0 / 0 |
| M3 | R5: dos o más, orden de ids | 1 | aserción, coincide | 0 / 0 |
| M4 | R5: dos o más [1]; un registro [2] | 2 | aserción, coincide | 0 / 0 |
| M5 | R5: sin registros, ausencia de gráfica | 1 | aserción, coincide | 0 / 0 |
| M6 | R2: hijos, clase del hero | 1 | aserción, coincide | 0 / 0 |
| M7 | R2: hijos, igualdad de padres | 1 | aserción, coincide | 0 / 0 |
| M8 | R2: sin título; R1 #65 R5/R18; R3 slot | 4 | aserción, coincide | 0 / 0 |
| M9 | R2: estilos de scroll, hub y cinco estados | 7 | aserción, coincide | 0 / 0 |
| M10 | R2: cinco estados y safe area adaptado | 6 | aserción, coincide | 0 / 0 |
| M11 | R3: ausencia de status | 1 | aserción, coincide | 0 / 0 |
| M12 | R3: cambio de mascota | 1 | aserción, coincide | 0 / 0 |
| M13 | R6: filas f/g, locale activo | 2 | aserción, coincide | 0 / 0 |
| M14 | R6: filas b/d/e y f equivalente | 4 | aserción, coincide | 0 / 0 |
| M15 | R6: fila e, año con mismo mes/día | 1 | aserción, coincide | 0 / 0 |
| M16 | R6: filas a/c/g, label con cero | 3 | aserción, coincide | 0 / 0 |
| M17 | R6: filas b/d/e/f, texto vs label | 4 | aserción, coincide | 0 / 0 |
| M18 | R6: a–g y adaptado, ISO conservado; orden de columna | 9 | aserción, coincide | 0 / 0 |
| M19 | R6: receta; #61 R5: warning suelto | 2 | aserción, coincide | 0 / 0 |
| M20 | R6: receta; #62 R15: contador tabular | 2 | aserción, coincide | 0 / 0 |
| M21 | R6: orden y cardinalidad de card | 1 | aserción, coincide | 0 / 0 |
| M22 | R1 #65 R5/R18; R6 a/c/g | 5 | aserción, coincide | 0 / 0 |

Detalles de aplicación que la tabla de sondas no expresa como diff literal:

- M15 ignora el año de la dosis y elige su próxima ocurrencia por mes/día; por eso a–d/f/g siguen bien y e dice Hoy frente a 365 d.
- M18 conserva el Text ISO antiguo además del nuevo next-vaccine-date formateado; las consultas encuentran ambos y la ausencia de ISO falla por aserción, como fija design §2. También se detecta el cuarto hijo de la columna.
- M4 detecta el desplazamiento en [1] con ≥2 registros y en [2] con un registro; el it termina en su primera aserción fallida, sin fallos de consulta.
- Para toBeNull, Expected es null; el diagnóstico de Jest solo imprime Received. Para el resto, Expected/Received o el diff negativo/positivo constan en cada bloque de evidencia.
- M7 se midió de nuevo sin el reporte JSON opcional por el ciclo en los nodos parent. La prueba normativa cae por toBe (padres distintos), no por TypeError. Ambas restauraciones quedaron en 0.

Ninguna sonda dejó cambio en H ni en el índice. No se cambiaron tests durante las sondas.

## T6 — typecheck y lint de cierre

```text
$ git fetch origin
(sin salida; exit=0)
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=0
$ git rev-parse --short origin/main
e002a4a5
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
$ bun run typecheck > /tmp/115-final-typecheck.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-final-typecheck.exit; echo "exit=$health_check_exit"
$ tsc --noEmit
exit=0
$ bun run lint > /tmp/115-final-lint.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-final-lint.exit; echo "exit=$health_check_exit"
$ expo lint
exit=0
```

Jest entero arrancado después de que typecheck y lint terminaran; no se lanza otra suite mientras corre.

## Delta por suite (T0 → verde T4, sin tests borrados)

| Suite | H0/T0 | Base tras #117 | Verde #115 | Delta propio #115 |
|---|---:|---:|---:|---:|
| `src/screens/health/index.test.tsx` | 29 | 29 | 55 | +26 |
| `src/components/__tests__/weight-chart.test.tsx` | 4 | 4 | 4 | +0 |
| `src/components/__tests__/pet-hero-header.test.tsx` | 37 | 37 | 37 | +0 |
| `src/__tests__/consistency-classnames.test.ts` | 55 | 55 | 55 | +0 |
| `src/__tests__/legibility-classnames.test.ts` | 27 | 27 | 27 | +0 |
| `src/__tests__/ui-language.test.ts` | 30 | 30 | 30 | +0 |
| `src/__tests__/design-drift.test.ts` | 60 | 60 | 60 | +0 |
| `src/providers/__tests__/language-provider.test.tsx` | 22 | 24 | 24 | +0 |

Total de bloque: 264 en H0; +2 de #117; +26 propios de #115; cierre 292. Salud: 29 → 55. R2 +8, R3 +3, R5 +6, R6 +9. Los 29 títulos antiguos siguen presentes, salvo el retítulo literal autorizado de #87 R13.

## Commits de implementación, con R-id

| Hash | Mensaje literal | R | Resultado |
|---|---|---|---|
| 4763b520 | test(mobile-health): #115 R4 red, weights without limit | R4 | 3 rojos por aserción |
| 4157d681 | feat(mobile-health): #115 R4 share the weight-log query | R4 | verde 29/29 |
| 78a2a0cd | test(mobile-health): #115 R2 R3 red, bleed hero and A9 wrappers | R2/R3 | 13 rojos, 12 consultas y 1 aserción |
| 3cbdc49b | feat(mobile-health): #115 R2 R3 bleed pet hero with A9 layout | R2/R3 | verde 40/40 |
| 7e7f4a90 | test(mobile-health): #115 R5 red, weight chart in the card | R5 | 2 consultas; 4 guardas nacen verdes |
| b6c08b2a | feat(mobile-health): #115 R5 render WeightChart history | R5 | impl, no verde; aserción de test corregida en 1ae2b78f |
| 1ae2b78f | fix(mobile-health): #115 R5 green, assert the chart slot itself | R5 | verde tras CORRECCIÓN 1, 46/46 |
| a88ce6c8 | test(mobile-health): #115 R6 red, next vaccine date and countdown | R6/R1/R7 | 13 rojos, 9 consultas y 4 aserciones; #69 R10 verde |
| 08d106e2 | feat(mobile-health): #115 R6 show next dose date and days left | R6/R1/R7 | verde 8 suites, 292 tests |

Sin refactor adicional. f6531fac y ca3e3f14 son correcciones documentales del leader; a3548767 es su merge de main (#117). Se conservan en la historia.

## Autorización del cierre documental

El humano autorizó un commit previo solo del impl para que R8 pueda medir los siete ficheros contra HEAD, seguido del commit final literal `docs(mobile-health-make-parity): trace #115 R1-R8` con traceability e impl. Ambos commits se encadenarán al registrador del Jest entero con `&&`, sujeto a typecheck y lint en 0. No push ni PR.

## T6 — Jest entero de cierre

```bash
bunx jest --maxWorkers=2 --json --outputFile=/tmp/115-final-jest.json > /tmp/115-final-jest.txt 2>&1; health_check_exit=$?; echo "$health_check_exit" > /tmp/115-final-jest.exit; echo "exit=$health_check_exit"
```

```text
Test Suites: 94 passed, 94 total
Tests:       2139 passed, 2139 total
Snapshots:   1 passed, 1 total
Time:        71.553 s, estimated 75 s
exit=0
```

Por suite:

- `src/__tests__/ui-language.test.ts`: 30 tests, 30 passed, 0 failed.
- `src/__tests__/legibility-classnames.test.ts`: 27 tests, 27 passed, 0 failed.
- `src/__tests__/consistency-classnames.test.ts`: 55 tests, 55 passed, 0 failed.
- `src/screens/health/index.test.tsx`: 55 tests, 55 passed, 0 failed.
- `src/screens/forgot/index.test.tsx`: 31 tests, 31 passed, 0 failed.
- `src/screens/profile/index.test.tsx`: 39 tests, 39 passed, 0 failed.
- `src/screens/meal-schedule/index.test.tsx`: 59 tests, 59 passed, 0 failed.
- `src/screens/home/index.test.tsx`: 169 tests, 169 passed, 0 failed.
- `src/screens/map/index.test.tsx`: 94 tests, 94 passed, 0 failed.
- `src/screens/geofence-editor/index.test.tsx`: 68 tests, 68 passed, 0 failed.
- `src/screens/pairing/index.test.tsx`: 54 tests, 54 passed, 0 failed.
- `src/app/(tabs)/__tests__/food.test.tsx`: 57 tests, 57 passed, 0 failed.
- `src/screens/alerts/index.test.tsx`: 36 tests, 36 passed, 0 failed.
- `src/screens/geofences/index.test.tsx`: 49 tests, 49 passed, 0 failed.
- `src/app/(tabs)/__tests__/screens.test.tsx`: 2 tests, 2 passed, 0 failed.
- `src/screens/reminders/index.test.tsx`: 31 tests, 31 passed, 0 failed.
- `src/screens/home/weekly-activity-chart.test.tsx`: 60 tests, 60 passed, 0 failed.
- `src/screens/weight-log/index.test.tsx`: 33 tests, 33 passed, 0 failed.
- `src/components/__tests__/pet-hero-header.test.tsx`: 37 tests, 37 passed, 0 failed.
- `src/screens/add-reminder/index.test.tsx`: 41 tests, 41 passed, 0 failed.
- `src/screens/alert-detail/index.test.tsx`: 25 tests, 25 passed, 0 failed.
- `src/app/(auth)/__tests__/register.test.tsx`: 13 tests, 13 passed, 0 failed.
- `src/app/__tests__/alert-detail.notification.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/app/__tests__/reminders-alerts-stack.notification.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/screens/meals-history/index.test.tsx`: 28 tests, 28 passed, 0 failed.
- `src/screens/add-pet/index.test.tsx`: 26 tests, 26 passed, 0 failed.
- `src/app/__tests__/alert-detail.navigation.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/screens/welcome/index.test.tsx`: 28 tests, 28 passed, 0 failed.
- `src/app/(tabs)/__tests__/layout.test.tsx`: 5 tests, 5 passed, 0 failed.
- `src/screens/reset-password/index.test.tsx`: 19 tests, 19 passed, 0 failed.
- `src/screens/docs/index.test.tsx`: 13 tests, 13 passed, 0 failed.
- `src/components/__tests__/floating-tab-bar.test.tsx`: 18 tests, 18 passed, 0 failed.
- `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/app/(auth)/__tests__/login.test.tsx`: 11 tests, 11 passed, 0 failed.
- `src/app/__tests__/detail-stack.navigation.test.tsx`: 2 tests, 2 passed, 0 failed.
- `src/app/__tests__/tabs-layout.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/hooks/use-push-registration.navigation.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/app/__tests__/detail-stack.guard.test.tsx`: 2 tests, 2 passed, 0 failed.
- `src/app/(auth)/__tests__/layout.test.tsx`: 3 tests, 3 passed, 0 failed.
- `src/components/__tests__/weight-chart.test.tsx`: 4 tests, 4 passed, 0 failed.
- `src/providers/__tests__/language-provider.test.tsx`: 24 tests, 24 passed, 0 failed.
- `src/components/__tests__/pet-avatar.test.tsx`: 8 tests, 8 passed, 0 failed.
- `src/api/__tests__/media.test.ts`: 15 tests, 15 passed, 0 failed.
- `src/app/__tests__/layout.test.tsx`: 26 tests, 26 passed, 0 failed.
- `test/__tests__/render-with-providers.test.tsx`: 3 tests, 3 passed, 0 failed.
- `app.config.test.ts`: 21 tests, 21 passed, 0 failed.
- `src/components/__tests__/pet-switcher.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/__tests__/heroui-smoke.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/api/__tests__/health-records.test.ts`: 33 tests, 33 passed, 0 failed.
- `src/providers/__tests__/auth-provider.test.tsx`: 8 tests, 8 passed, 0 failed.
- `src/__tests__/design-drift.test.ts`: 60 tests, 60 passed, 0 failed.
- `src/hooks/use-push-registration.test.tsx`: 53 tests, 53 passed, 0 failed.
- `src/api/__tests__/alerts.test.ts`: 28 tests, 28 passed, 0 failed.
- `src/__tests__/ui-copy-table.ts`: 2 tests, 2 passed, 0 failed.
- `src/app/__tests__/index.test.tsx`: 3 tests, 3 passed, 0 failed.
- `src/app/(tabs)/__tests__/profile.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/providers/__tests__/selected-pet-provider.test.tsx`: 3 tests, 3 passed, 0 failed.
- `src/components/__tests__/pet-map.test.tsx`: 16 tests, 16 passed, 0 failed.
- `src/theme/__tests__/theme-transition.test.tsx`: 6 tests, 6 passed, 0 failed.
- `src/providers/__tests__/query-provider.test.tsx`: 11 tests, 11 passed, 0 failed.
- `src/api/__tests__/nutrition.test.ts`: 71 tests, 71 passed, 0 failed.
- `src/hooks/use-pet-selection.test.tsx`: 7 tests, 7 passed, 0 failed.
- `src/utils/__tests__/month-grid.test.ts`: 12 tests, 12 passed, 0 failed.
- `app.assets.test.ts`: 7 tests, 7 passed, 0 failed.
- `src/api/__tests__/trips.test.ts`: 17 tests, 17 passed, 0 failed.
- `src/utils/language-preference.test.ts`: 8 tests, 8 passed, 0 failed.
- `src/api/__tests__/positions.test.ts`: 22 tests, 22 passed, 0 failed.
- `src/screens/home/format.test.ts`: 13 tests, 13 passed, 0 failed.
- `src/components/__tests__/card.test.tsx`: 7 tests, 7 passed, 0 failed.
- `src/api/__tests__/auth.test.ts`: 44 tests, 44 passed, 0 failed.
- `src/api/__tests__/reminders.test.ts`: 27 tests, 27 passed, 0 failed.
- `src/api/__tests__/geofences.test.ts`: 63 tests, 63 passed, 0 failed.
- `src/theme/__tests__/use-theme-colors.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/api/__tests__/pets.test.ts`: 36 tests, 36 passed, 0 failed.
- `src/theme/__tests__/global-css.test.ts`: 51 tests, 51 passed, 0 failed.
- `src/utils/device-connectivity.test.ts`: 13 tests, 13 passed, 0 failed.
- `src/app/(tabs)/__tests__/alerts.test.tsx`: 3 tests, 3 passed, 0 failed.
- `src/utils/reminder-dates.test.ts`: 20 tests, 20 passed, 0 failed.
- `src/app/__tests__/detail-stack.test.tsx`: 18 tests, 18 passed, 0 failed.
- `src/theme/__tests__/theme-transition.degraded.test.tsx`: 1 tests, 1 passed, 0 failed.
- `src/api/__tests__/devices.test.ts`: 27 tests, 27 passed, 0 failed.
- `src/api/__tests__/subscriptions.test.ts`: 10 tests, 10 passed, 0 failed.
- `src/utils/zoom-for-radius.test.ts`: 8 tests, 8 passed, 0 failed.
- `src/theme/__tests__/font-registration.test.ts`: 3 tests, 3 passed, 0 failed.
- `src/api/__tests__/activity.test.ts`: 9 tests, 9 passed, 0 failed.
- `src/api/__tests__/query-keys.test.ts`: 22 tests, 22 passed, 0 failed.
- `src/utils/civil-today-iso.test.ts`: 6 tests, 6 passed, 0 failed.
- `src/utils/__tests__/category-palette.test.ts`: 12 tests, 12 passed, 0 failed.
- `src/__tests__/hosting-artifacts.test.ts`: 7 tests, 7 passed, 0 failed.
- `src/api/__tests__/users.test.ts`: 8 tests, 8 passed, 0 failed.
- `src/utils/theme-preference.test.ts`: 8 tests, 8 passed, 0 failed.
- `src/api/__tests__/push-tokens.test.ts`: 10 tests, 10 passed, 0 failed.
- `src/__tests__/hero-header-amendments.test.ts`: 3 tests, 3 passed, 0 failed.
- `src/utils/date-picker-value.test.ts`: 12 tests, 12 passed, 0 failed.

Cuenta y suites esperadas: True
Registrador exit=0

## Confirmación final de T6 y del delta

Jest entero confirma las ocho cuentas del cuadro de delta: 292 tests, incluidos 55 de Salud y 24 de language-provider tras #117. No hay tests omitidos ni fallos de ejecución: 94 suites, 2139 tests y 1 snapshot pasan. Typecheck, lint y Jest entero dan exit=0. Las 22 sondas están restauradas; las 48 anclas de cierre se vuelven a medir antes del cierre documental.

Commit documental previo autorizado: `docs(mobile-health-make-parity): record #115 implementation evidence`, solo este impl. Su puerta es el registrador de Jest entero (0 fallos, 94 suites, 2139 tests, exit real 0), encadenado con `&& git commit`. El commit final literal lleva únicamente traceability e impl. R9 sigue como gate humano.

## Anclas de cierre (+3 positivas)

Desde mobile-pet-tracker/. El número identifica el comando literal del handoff.

```text
0. $ grep -cF -- '- [x] Spec aprobada por humano (fecha: 2026-10-06' ../specs/mobile-health-make-parity/requirements.md
1 (esperado 1; grep exit=0)
1. $ grep -cF -- 'healthKeys.weights(selectedPetId ?? '"'"''"'"', 1)' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
2. $ grep -cF -- 'healthKeys.weights(selectedPetId ?? '"'"''"'"', undefined)' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
3. $ grep -cF -- 'selectedPetId!, fetch, 1)' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
4. $ grep -cF -- '<WeightChart entries={weight.data.weights} />' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
5. $ grep -cF -- '<PetHeroHeader' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
6. $ grep -cF -- 'variant="bleed"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
7. $ grep -cF -- 'from '"'"'../home/format'"'"'' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
8. $ grep -cF -- 'calendarDaysUntil(' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
9. $ grep -cF -- 'fmtDate(' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
10. $ grep -cF -- 'useLocale()' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
11. $ grep -cF -- '{nextVaccine.nextDoseAt}' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
12. $ grep -cF -- 'testID="next-vaccine-days"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
13. $ grep -cF -- 'testID="next-vaccine-date"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
14. $ grep -cF -- 'testID="health-states"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
15. $ grep -cF -- 'testID="health-content"' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
16. $ grep -cF -- 'padding: 24' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
17. $ grep -cF -- 'paddingHorizontal: 24' src/screens/health/index.tsx
2 (esperado 2; grep exit=0)
18. $ grep -cF -- 'insets.top + 12' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
19. $ grep -cF -- 'insets.bottom + 96' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
20. $ grep -cF -- 'style={TABULAR_NUMS}' src/screens/health/index.tsx
3 (esperado 3; grep exit=0)
21. $ grep -cF -- 'style={CONTINUOUS_CORNER}' src/screens/health/index.tsx
2 (esperado 2; grep exit=0)
22. $ grep -cF -- text-accent-strong src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
23. $ grep -cF -- text-warning-strong src/screens/health/index.tsx
2 (esperado 2; grep exit=0)
24. $ grep -cF -- 't('"'"'health.health'"'"')' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
25. $ grep -cF -- '<PetSwitcher' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
26. $ grep -cF -- home.nextVaccineOverdue src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
27. $ grep -cF -- getPet src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
28. $ grep -cF -- react-native-reanimated src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
29. $ grep -cF -- StyleSheet.create src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
30. $ grep -cE -- '#[0-9A-Fa-f]{3,8}\b' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
31. $ grep -cE -- '\w-\[' src/screens/health/index.tsx
0 (esperado 0; grep exit=1)
32. $ grep -cF -- '{ file: '"'"'src/screens/health/index.tsx'"'"', key: '"'"'home.' src/__tests__/ui-copy-table.ts
3 (esperado 3; grep exit=0)
33. $ grep -cF -- 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2); // +1 #90 R5, +1 #95 R4, -2 #95 R5' src/__tests__/ui-language.test.ts
0 (esperado 0; grep exit=1)
34. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 2],' src/__tests__/consistency-classnames.test.ts
1 (esperado 1; grep exit=0)
35. $ grep -cF -- '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1, // #146 R18, #105 R11, #116 R5' src/__tests__/consistency-classnames.test.ts
0 (esperado 0; grep exit=1)
36. $ grep -cF -- 'padding: 24, paddingBottom: 120' src/screens/health/index.test.tsx
0 (esperado 0; grep exit=1)
37. $ grep -cF -- 'expect.any(Function)' src/screens/health/index.test.tsx
0 (esperado 0; grep exit=1)
38. $ grep -cF -- 'healthKeys.weights('"'"'pet-1'"'"', undefined)' src/screens/health/index.test.tsx
1 (esperado 1; grep exit=0)
39. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 1],' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
40. $ grep -cF -- '13 + 1 + 1' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
41. $ grep -cF -- '+ 2, // #118 R11' src/__tests__/legibility-classnames.test.ts
1 (esperado 1; grep exit=0)
42. $ grep -cF -- '+ 8, // #118 R1' src/providers/__tests__/language-provider.test.tsx
1 (esperado 1; grep exit=0)
43. $ grep -cF -- ''"'"'screens/health/index.tsx'"'"': 0,' src/__tests__/design-drift.test.ts
1 (esperado 1; grep exit=0)
44. $ grep -cF -- 'import { Card } from '"'"'../../components/card'"'"';' src/screens/health/index.tsx
1 (esperado 1; grep exit=0)
45. $ grep -cF -- 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1' src/__tests__/ui-language.test.ts
1 (esperado 1; grep exit=0)
46. $ grep -cF -- '[join('"'"'screens'"'"', '"'"'health'"'"', '"'"'index.tsx'"'"'), 2 + 1], // #115 R6' src/__tests__/consistency-classnames.test.ts
1 (esperado 1; grep exit=0)
47. $ grep -cF -- '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts
1 (esperado 1; grep exit=0)
```
Coinciden todas: True.

## R8 — salidas reales tras el commit previo autorizado

Commit previo: `bd2f67d9` — `docs(mobile-health-make-parity): record #115 implementation evidence` (solo impl). Registrador: cuenta y suites esperadas True, exit=0; Jest entero exit=0. Árbol limpio tras ese commit.

Desde la raíz del repo. La CORRECCIÓN 2 sustituye H0 por `origin/main...HEAD` y añade la exclusión de `.claude/agents/leader.md`. `origin/main` sigue en `e002a4a5`; `git fetch origin` y la comprobación de ancestro se repitieron antes de medir (exit=0).

```bash
git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
```
```text
(salida vacía)
exit=0
```

```bash
git diff --stat origin/main -- backend-pet-tracker/
```
```text
(salida vacía)
exit=0
```

```bash
git diff --name-only origin/main...HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-health-make-parity.md' ':!specs/mobile-health-make-parity/requirements.md' ':!specs/mobile-health-make-parity/design.md' ':!specs/mobile-health-make-parity/tasks.md' ':!.claude/agents/leader.md'
```
```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/screens/health/index.test.tsx
mobile-pet-tracker/src/screens/health/index.tsx
progress/impl_mobile-health-make-parity.md
specs/mobile-health-make-parity/traceability.md
exit=0
```

Dependencias vacías, backend vacío y lista exacta de siete: True. Registrador R8 exit=0.

Las anclas 28–31 están en 0; las 39–44 conservan su valor de H0. No se tocaron app.json, componentes compartidos, Home/format, catálogos, API ni los tests prohibidos. El delta de language-provider (+2) procede del merge #117 del leader. No se lanzó init.sh ni se tocó infraestructura, otro worktree o branch.

## Cierre de Codex — R1–R8

T0–T6 completos. T7/R9 queda al humano; sus casillas no se marcaron. Traceability cita cada rojo y verde con hash y mensaje literal; R5 cita el fix 1ae2b78f y conserva b6c08b2a como impl no verde. Los hashes y mensajes se contrastaron con git show y se comprobó que todos son ancestros de HEAD.

Comprobaciones previas al último commit, desde la raíz:

```text
$ git branch --show-current
feature/115-mobile-health-make-parity
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=0
$ git diff --check
(salida vacía; exit=0)
$ git diff --quiet 08d106e2 -- mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/screens/health/index.test.tsx mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts; echo "exit=$?"
exit=0
$ git diff --name-only
progress/impl_mobile-health-make-parity.md
specs/mobile-health-make-parity/traceability.md
$ git diff --cached --name-only
(salida vacía)
```

Validación de cierre: True; registrador exit=0. Los cinco ficheros de código/tests siguen idénticos al verde 08d106e2 usado para las sondas y el Jest entero. Solo quedan los dos documentos del cierre literal.

El commit final `docs(mobile-health-make-parity): trace #115 R1-R8` se encadena al registrador del Jest entero con `&& git commit`, después de comprobar que el índice contiene exclusivamente este impl y traceability. Los resultados reales son typecheck 0, lint 0, Jest 0 (94 suites / 2139 tests), las ocho suites 292 (Salud 55), las 48 anclas coincidentes y las 22 sondas detectadas/restauradas. Las salidas R8 de los siete ficheros constan arriba. No hay decisiones de producto adicionales a la spec; solo las correcciones del handoff y la autorización documental quedan anotadas.
