```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-118
$ git branch --show-current
feature/118-mobile-welcome-splash
$ git rev-parse --short HEAD
e02cdf63
```

H0 = `e02cdf63`. Todos los diffs de esta sesión se miden contra H0.

Sesión #118: verificación inicial; T1–T10 conforme a la spec aprobada.
No se ejecuta init.sh, no se toca infraestructura ni otros worktrees.

## Base y anclas

`git fetch origin`: exit=0. `git merge-base --is-ancestor b2a9c2aa HEAD; echo "exit=$?"`: `exit=0`. `git rev-parse --short origin/main`: `b2a9c2aa`.

```text
$ rg -n -F '+ 9, // #105 R5' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
56:      260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9, // #105 R5
$ rg -n -F 'toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1)' mobile-pet-tracker/src/__tests__/ui-language.test.ts
490:    expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10, #146 R10, #105 R5
$ rg -n -F '13 + 1 + 1' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
102:    expect(primaryRadius).toHaveLength(13 + 1 + 1); // #146 R8, #146 R9
399:    expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13 + 1 + 1); // #146 R8, #146 R9
$ rg -n -F 'expect(children).toHaveLength(5)' mobile-pet-tracker/src/app/__tests__/layout.test.tsx
309:    expect(children).toHaveLength(5);
$ rg -n -F 'redirects an unauthenticated session to login' mobile-pet-tracker/src/app/__tests__/index.test.tsx
50:  it('redirects an unauthenticated session to login', async () => {
$ rg -n -A 4 -B 4 'R15_GEOFENCE_EDITOR' mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts-16-  R11_RESET,
mobile-pet-tracker/src/__tests__/ui-language.test.ts-17-  R12_ALERTS,
mobile-pet-tracker/src/__tests__/ui-language.test.ts-18-  R13_ALERT_DETAIL,
mobile-pet-tracker/src/__tests__/ui-language.test.ts-19-  R14_GEOFENCES,
mobile-pet-tracker/src/__tests__/ui-language.test.ts:20:  R15_GEOFENCE_EDITOR,
mobile-pet-tracker/src/__tests__/ui-language.test.ts-21-  type UseRow,
mobile-pet-tracker/src/__tests__/ui-language.test.ts-22-} from './ui-copy-table';
mobile-pet-tracker/src/__tests__/ui-language.test.ts-23-
mobile-pet-tracker/src/__tests__/ui-language.test.ts-24-declare function require(moduleName: 'fs'): {
--
mobile-pet-tracker/src/__tests__/ui-language.test.ts-265-});
mobile-pet-tracker/src/__tests__/ui-language.test.ts-266-
mobile-pet-tracker/src/__tests__/ui-language.test.ts-267-describe('#146 R10: el editor de zonas resuelve su copy por clave', () => {
mobile-pet-tracker/src/__tests__/ui-language.test.ts-268-  it('registra cada ocurrencia del editor y de sus entradas', () => {
mobile-pet-tracker/src/__tests__/ui-language.test.ts:269:    expect(R15_GEOFENCE_EDITOR).toHaveLength(27);
mobile-pet-tracker/src/__tests__/ui-language.test.ts:270:    expect(R15_GEOFENCE_EDITOR.every(({ file }) =>
mobile-pet-tracker/src/__tests__/ui-language.test.ts-271-      file === 'src/app/_layout.tsx' || file === 'src/screens/geofences/index.tsx' || file === 'src/screens/geofence-editor/index.tsx',
mobile-pet-tracker/src/__tests__/ui-language.test.ts-272-    )).toBe(true);
mobile-pet-tracker/src/__tests__/ui-language.test.ts:273:    checkUses(R15_GEOFENCE_EDITOR);
mobile-pet-tracker/src/__tests__/ui-language.test.ts-274-  });
mobile-pet-tracker/src/__tests__/ui-language.test.ts-275-});
mobile-pet-tracker/src/__tests__/ui-language.test.ts-276-
mobile-pet-tracker/src/__tests__/ui-language.test.ts-277-const REPOSITORY_ROOT = join(SOURCE_ROOT, '..');
--
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-478-  { file: 'src/screens/geofences/index.tsx', key: 'common.somethingWentWrong' },
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-479-  { file: 'src/screens/geofences/index.tsx', key: 'common.retry' },
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-480-];
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-481-
mobile-pet-tracker/src/__tests__/ui-copy-table.ts:482:export const R15_GEOFENCE_EDITOR: UseRow[] = [
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-483-  { file: 'src/app/_layout.tsx', key: 'geofenceEditor.title' },
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-484-  { file: 'src/screens/geofences/index.tsx', key: 'geofenceEditor.editLabel' },
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-485-  { file: 'src/screens/geofences/index.tsx', key: 'geofenceEditor.add' },
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-486-  { file: 'src/screens/geofences/index.tsx', key: 'geofenceEditor.limitNotice' },
--
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-523-  ...R11_RESET,
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-524-  ...R12_ALERTS,
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-525-  ...R13_ALERT_DETAIL,
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-526-  ...R14_GEOFENCES,
mobile-pet-tracker/src/__tests__/ui-copy-table.ts:527:  ...R15_GEOFENCE_EDITOR,
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-528-];
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-529-
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-530-describe('#65: la tabla de uso de copy está disponible al runner', () => {
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-531-  it('expone al menos el primer lote normativo', () => {
--
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-537-  it('cuadra ALL_USES con la suma de sus bloques', () => {
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-538-    const blocks = [
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-539-      R1_AUTH, R2_TABS, R3_HOME, R4_MAP, R5_HEALTH, R6_FOOD,
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-540-      R7_PROFILE, R8_REMINDERS, R9_ADD_PET, R10_PAIRING, R11_RESET,
mobile-pet-tracker/src/__tests__/ui-copy-table.ts:541:      R12_ALERTS, R13_ALERT_DETAIL, R14_GEOFENCES, R15_GEOFENCE_EDITOR,
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-542-    ];
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-543-
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-544-    expect(ALL_USES).toHaveLength(
mobile-pet-tracker/src/__tests__/ui-copy-table.ts-545-      blocks.reduce((total, block) => total + block.length, 0),
$ rg -n -A 14 -B 8 "join\('components', 'pet-hero-header.tsx'\), 1" mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
148-    [join('app', '(auth)', 'forgot.tsx'), 1],
149-    [join('screens', 'reset-password', 'index.tsx'), 2],
150-    [join('screens', 'home', 'index.tsx'), 2],
151-    [join('screens', 'health', 'index.tsx'), 1],
152-    [join('app', '(tabs)', 'food.tsx'), 1],
153-    [join('screens', 'map', 'index.tsx'), 2],
154-    [join('screens', 'profile', 'index.tsx'), 1],
155-    [join('screens', 'add-pet', 'index.tsx'), 1],
156:    [join('components', 'pet-hero-header.tsx'), 1],
157-  ];
158-
159-  it.each(inkSites)('%s pinta con text-accent-strong (%i)', (path, sites) => {
160-    expect(readSource(path).match(/text-accent-strong\b/g)).toHaveLength(sites);
161-  });
162-
163-  it('suma las trece ocurrencias que enumera la spec', () => {
164-    expect(
165-      inkSites.reduce((total, [, sites]) => total + sites, 0),
166-    ).toBe(13 + 1 + 1);
167-  });
168-
169-  it('no deja ningún text-accent suelto en las fuentes', () => {
170-    expect(filesMatching(/text-accent(?![-\w])/)).toEqual([]);
$ grep -c 'name="welcome"' mobile-pet-tracker/src/app/_layout.tsx
0
$ rg -n 'Stack.Protected' mobile-pet-tracker/src/app/_layout.tsx
93:      <Stack.Protected guard={status === 'authenticated'}>
106:      </Stack.Protected>
$ test ! -e mobile-pet-tracker/src/screens/welcome && test ! -e mobile-pet-tracker/src/app/welcome.tsx; echo "exit=$?"
exit=0
```

## Skills cargadas

- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md`.
- `animate-expo`: `.agents/skills/animate-expo/SKILL.md`.
- `ponytail` (full): `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.10.0/skills/ponytail/SKILL.md`.

Leídas requirements.md, design.md, tasks.md y traceability.md completos.
Aprobación verificada: status approved; firma referenciada en progress/current.md: 16c8e565.
El contexto de Appllama es de solo lectura; sus propuestas no sustituyen la spec.

## Medida base de Jest (H0)

Desde `mobile-pet-tracker/`, sin pipe:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts --verbose > /tmp/118-baseline-jest.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/design-drift.test.ts (18.115 s)
PASS src/app/__tests__/layout.test.tsx (19.075 s)
PASS src/__tests__/consistency-classnames.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/app/__tests__/index.test.tsx
Test Suites: 7 passed, 7 total
Tests:       219 passed, 219 total
Snapshots:   0 total
Time:        21.883 s
exit=0
```

| Suite | Base (tests) | Después |
| --- | ---: | --- |
| `src/__tests__/design-drift.test.ts` | 59 | No implementado |
| `src/app/__tests__/layout.test.tsx` | 25 | No implementado |
| `src/__tests__/consistency-classnames.test.ts` | 55 | No implementado |
| `src/providers/__tests__/language-provider.test.tsx` | 22 | No implementado |
| `src/__tests__/ui-language.test.ts` | 29 | No implementado |
| `src/__tests__/legibility-classnames.test.ts` | 26 | No implementado |
| `src/app/__tests__/index.test.tsx` | 3 | No implementado |

Typecheck y lint de base: no ejecutados; se activó la parada obligatoria por ancla antes de lanzarlos.

## Parada obligatoria antes de T1

El handoff exige: «si alguna [ancla] no da EXACTAMENTE lo esperado, PARA y avisa».
La ancla indicada para `ui-language.test.ts` no existe: el array `blocks`
está en `ui-copy-table.ts`, no en `ui-language.test.ts`. No se mueve ni se
inventa otro array. Comprobación exacta:

```text
$ rg -n -F 'const blocks' mobile-pet-tracker/src/__tests__/ui-language.test.ts
exit=1
$ rg -n -A 7 -F 'const blocks' mobile-pet-tracker/src/__tests__/ui-copy-table.ts
538:    const blocks = [
539-      R1_AUTH, R2_TABS, R3_HOME, R4_MAP, R5_HEALTH, R6_FOOD,
540-      R7_PROFILE, R8_REMINDERS, R9_ADD_PET, R10_PAIRING, R11_RESET,
541-      R12_ALERTS, R13_ALERT_DETAIL, R14_GEOFENCES, R15_GEOFENCE_EDITOR,
542-    ];
543-
544-    expect(ALL_USES).toHaveLength(
545-      blocks.reduce((total, block) => total + block.length, 0),
exit=0
```

Otra discrepancia de recuento que debe aclararse: `legibility-classnames.test.ts`
ejecuta `it.each(inkSites)`. Añadir la fila prescrita `[join('screens', 'welcome',
'index.tsx'), 2]` crea un it adicional: la base medida es 26 y el cierre
resultaría en 27, delta +1, frente al delta 0 exigido en el handoff.

```text
$ rg -n -A 2 -F 'it.each(inkSites)' mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
159:  it.each(inkSites)('%s pinta con text-accent-strong (%i)', (path, sites) => {
160-    expect(readSource(path).match(/text-accent-strong\b/g)).toHaveLength(sites);
161-  });
exit=0
```

## Estado al detenerse

- T1–T10 no implementados. Ningún commit nuevo; ningún rojo, verde o sonda plantado.
- No se modifica la trazabilidad ni R13, ni las casillas de aprobación.
- Cierre de 8 suites, typecheck, lint, verificación final R12 y delta de 17 ficheros: pendientes por la parada.
- Único archivo creado: este reporte, todavía sin commit. No hay cambios en la app.
- No se ejecuta init.sh, no se toca Postgres/LocalStack, no se cambia de branch,
  no se hace rebase, push ni PR, ni se accede a otros worktrees.
- No se toma ninguna decisión de implementación ajena a la spec.

```text
$ git diff --name-only e02cdf63 HEAD
(salida vacía)
exit=0
$ git diff --name-only e02cdf63
(salida vacía)
exit=0
$ git status --short
?? progress/impl_mobile-welcome-splash.md
exit=0
```

## Reanudacion tras la correccion del handoff

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-118
$ git branch --show-current
feature/118-mobile-welcome-splash
$ git rev-parse --short HEAD
69847c4f
```

Nuevo H0 = `69847c4f`. Desde esta sección todos los diffs se miden contra
este commit. La parada anterior queda conservada como evidencia histórica.
Releído el handoff corregido: blocks vive en ui-copy-table.ts; legibility +1,
design-drift +1. La base Jest anterior (7 suites / 219 / exit=0) sigue vigente.

Anclas corregidas, repetidas:

```text
$ rg -n -A 20 'export const ALL_USES' mobile-pet-tracker/src/__tests__/ui-copy-table.ts
512:export const ALL_USES: UseRow[] = [
513-  ...R1_AUTH,
514-  ...R2_TABS,
515-  ...R3_HOME,
516-  ...R4_MAP,
517-  ...R5_HEALTH,
518-  ...R6_FOOD,
519-  ...R7_PROFILE,
520-  ...R8_REMINDERS,
521-  ...R9_ADD_PET,
522-  ...R10_PAIRING,
523-  ...R11_RESET,
524-  ...R12_ALERTS,
525-  ...R13_ALERT_DETAIL,
526-  ...R14_GEOFENCES,
527-  ...R15_GEOFENCE_EDITOR,
528-];
529-
530-describe('#65: la tabla de uso de copy está disponible al runner', () => {
531-  it('expone al menos el primer lote normativo', () => {
532-    expect(ALL_USES.length).toBeGreaterThan(0);
exit=0
$ rg -n -A 7 -F 'const blocks' mobile-pet-tracker/src/__tests__/ui-copy-table.ts
538:    const blocks = [
539-      R1_AUTH, R2_TABS, R3_HOME, R4_MAP, R5_HEALTH, R6_FOOD,
540-      R7_PROFILE, R8_REMINDERS, R9_ADD_PET, R10_PAIRING, R11_RESET,
541-      R12_ALERTS, R13_ALERT_DETAIL, R14_GEOFENCES, R15_GEOFENCE_EDITOR,
542-    ];
543-
544-    expect(ALL_USES).toHaveLength(
545-      blocks.reduce((total, block) => total + block.length, 0),
exit=0
$ rg -n -F 'const blocks' mobile-pet-tracker/src/__tests__/ui-language.test.ts
exit=1
$ rg -n -A 7 -B 3 'R15_GEOFENCE_EDITOR' mobile-pet-tracker/src/__tests__/ui-language.test.ts
17-  R12_ALERTS,
18-  R13_ALERT_DETAIL,
19-  R14_GEOFENCES,
20:  R15_GEOFENCE_EDITOR,
21-  type UseRow,
22-} from './ui-copy-table';
23-
24-declare function require(moduleName: 'fs'): {
25-  readFileSync: (path: string, encoding: 'utf8') => string;
26-};
27-
--
266-
267-describe('#146 R10: el editor de zonas resuelve su copy por clave', () => {
268-  it('registra cada ocurrencia del editor y de sus entradas', () => {
269:    expect(R15_GEOFENCE_EDITOR).toHaveLength(27);
270:    expect(R15_GEOFENCE_EDITOR.every(({ file }) =>
271-      file === 'src/app/_layout.tsx' || file === 'src/screens/geofences/index.tsx' || file === 'src/screens/geofence-editor/index.tsx',
272-    )).toBe(true);
273:    checkUses(R15_GEOFENCE_EDITOR);
274-  });
275-});
276-
277-const REPOSITORY_ROOT = join(SOURCE_ROOT, '..');
278-
279-const SIGNATURE_LINE = '- [ ] Enmienda aprobada por humano';
280-
exit=0
$ rg -n -A 16 -B 3 "join\('components', 'pet-hero-header.tsx'\), 1" mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
153-    [join('screens', 'map', 'index.tsx'), 2],
154-    [join('screens', 'profile', 'index.tsx'), 1],
155-    [join('screens', 'add-pet', 'index.tsx'), 1],
156:    [join('components', 'pet-hero-header.tsx'), 1],
157-  ];
158-
159-  it.each(inkSites)('%s pinta con text-accent-strong (%i)', (path, sites) => {
160-    expect(readSource(path).match(/text-accent-strong\b/g)).toHaveLength(sites);
161-  });
162-
163-  it('suma las trece ocurrencias que enumera la spec', () => {
164-    expect(
165-      inkSites.reduce((total, [, sites]) => total + sites, 0),
166-    ).toBe(13 + 1 + 1);
167-  });
168-
169-  it('no deja ningún text-accent suelto en las fuentes', () => {
170-    expect(filesMatching(/text-accent(?![-\w])/)).toEqual([]);
171-  });
172-
exit=0
```

Fetch: exit=0. Ancestro b2a9c2aa: exit=0. origin/main: b2a9c2aa. Diff móvil entre H0 anterior y nuevo: vacío.

### Base typecheck y lint

Desde mobile-pet-tracker/, sin pipe:

```text
$ test ! -e .expo/types/router.d.ts
exit=0
$ bun run typecheck > /tmp/118-baseline-typecheck.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
$ bun run lint > /tmp/118-baseline-lint.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

### T1 — R1 rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/providers/__tests__/language-provider.test.tsx --verbose > /tmp/118-t1-red.log 2>&1; echo "exit=$?"
```

```text
FAIL src/providers/__tests__/language-provider.test.tsx
Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
Snapshots:   0 total
Time:        2.342 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/providers/__tests__/language-provider.test.tsx` | 21 | 1 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas

    expect(received).toHaveLength(expected)

    Expected length: 360
    Received length: 352
    Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.checkPetDetails", "addPet.chooseBirthDate", …]

      53 |     const spanishKeys = Object.keys(es).sort();
      54 |
    > 55 |     expect(englishKeys).toHaveLength(
         |                         ^
      56 |       260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 // #105 R5
      57 |         + 8, // #118 R1
      58 |     );

      at Object.toHaveLength (src/providers/__tests__/language-provider.test.tsx:55:25)


```

Commit: `81ac3fb9 test(mobile): lock the catalog length for the welcome keys (#118 R1)`.

### T1 — R1 verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/providers/__tests__/language-provider.test.tsx --verbose > /tmp/118-t1-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/providers/__tests__/language-provider.test.tsx
Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        1.883 s, estimated 3 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/providers/__tests__/language-provider.test.tsx` | 22 | 0 |

Commit: `01b340fd feat(mobile): add the welcome copy in both languages (#118 R1)`.

### T2 — R2 rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx --verbose > /tmp/118-t2-red.log 2>&1; echo "exit=$?"
```

```text
FAIL src/app/__tests__/index.test.tsx
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Snapshots:   0 total
Time:        2.018 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/app/__tests__/index.test.tsx` | 2 | 1 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● R5: splash navega según sesión › #118 R2: redirects an unauthenticated session to welcome

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "href": "/welcome",
    +   "href": "/login",
      }

      53 |     await render(<Index />);
      54 |
    > 55 |     expect(mockRedirect.mock.calls[0]?.[0]).toEqual({ href: '/welcome' });
         |                                             ^
      56 |     expect(screen.queryByTestId('splash-logo')).not.toBeOnTheScreen();
      57 |   });
      58 | });

      at Object.toEqual (src/app/__tests__/index.test.tsx:55:45)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Commit: `c5b6b0be test(mobile): expect the unauthenticated redirect to welcome (#118 R2)`.

### T2 — R2 verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx --verbose > /tmp/118-t2-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/app/__tests__/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.84 s, estimated 2 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/app/__tests__/index.test.tsx` | 3 | 0 |

Commit: `14c389c1 feat(mobile): redirect unauthenticated sessions to welcome (#118 R2)`.

### Decisiones del arnés de T3

El handoff exige rojos de aserción/consulta, sin import roto, aunque T3 de
tasks.md mencione módulo inexistente. Se carga temporalmente la pantalla
solo si existe; si falta, el componente nulo deja fallar las consultas
prescritas. readSource devuelve fuente vacía cuando falta el route, para
fallar toContain en vez de ENOENT. Se quitarán estos fallbacks en un
refactor independiente después del verde.

Verificado Button/Label de heroui-native instalado: añade clases internas
(button__root / pressable-feedback__root), como candó #127 R1 en login.
Las aserciones literales de R5/R7/R8 se refieren a las props declaradas por
la pantalla; un mock parcial de Button/Label las pasa a View/Text, mientras
HeroUINativeProvider y LanguageProvider son reales. Los eventos llaman al
onPress real del screen. No se pretende revalidar el press feedback interno
de HeroUI. Los iconos se mockean solo para Map/Stethoscope/ForkKnife.
El +1 de layout va en el verde de T3, como fija el handoff, sin anticipar
el rojo en cascada sobre el it de #95.

### T3 — R3/R4/R5/R9 rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx src/app/__tests__/layout.test.tsx --verbose > /tmp/118-t3-red.log 2>&1; echo "exit=$?"
```

```text
FAIL src/app/__tests__/layout.test.tsx
FAIL src/screens/welcome/index.test.tsx (17.519 s)
Test Suites: 2 failed, 2 total
Tests:       9 failed, 25 passed, 34 total
Snapshots:   0 total
Time:        17.998 s, estimated 20 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/app/__tests__/layout.test.tsx` | 25 | 1 |
| `src/screens/welcome/index.test.tsx` | 0 | 8 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● #118 R3: RootStack declara welcome bajo su propia guarda › declara welcome como sexto hijo bajo Stack.Protected

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      580 |     const stack = jest.mocked(Stack).mock.calls.at(-1)?.[0];
      581 |     const group = Children.toArray(stack?.children)[5];
    > 582 |     expect(isValidElement<{ guard: boolean; children: ReactNode }>(group)).toBe(true);
          |                                                                            ^
      583 |     if (!isValidElement<{ guard: boolean; children: ReactNode }>(group)) return;
      584 |     expect(group.type).toBe(Stack.Protected);
      585 |     expect(group.props.guard).toBe(false);

      at Object.toBe (src/app/__tests__/layout.test.tsx:582:76)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  console.info
    HeroUI Native Styling Principles
    • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
    • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
    • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
      - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
      - Check component documentation - Each component page includes a link to the component's style source
    • If styles are occupied by animation, modify them via the animation prop on components that support it.
    • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
    💡 To disable this message, set config.devInfo.stylingPrinciples to false

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

  console.info
    HeroUI Native Styling Principles
    • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
    • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
    • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
      - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
      - Check component documentation - Each component page includes a link to the component's style source
    • If styles are occupied by animation, modify them via the animation prop on components that support it.
    • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
    💡 To disable this message, set config.devInfo.stylingPrinciples to false

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

  console.info
    HeroUI Native Styling Principles
    • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
    • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
    • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
      - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
      - Check component documentation - Each component page includes a link to the component's style source
    • If styles are occupied by animation, modify them via the animation prop on components that support it.
    • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
    💡 To disable this message, set config.devInfo.stylingPrinciples to false

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

  console.info
    HeroUI Native Styling Principles
    • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
    • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
    • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
      - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
      - Check component documentation - Each component page includes a link to the component's style source
    • If styles are occupied by animation, modify them via the animation prop on components that support it.
    • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
    💡 To disable this message, set config.devInfo.stylingPrinciples to false

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

  console.info
    HeroUI Native Styling Principles
    • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
    • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
    • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
      - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
      - Check component documentation - Each component page includes a link to the component's style source
    • If styles are occupied by animation, modify them via the animation prop on components that support it.
    • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
    💡 To disable this message, set config.devInfo.stylingPrinciples to false

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

  console.info
    HeroUI Native Styling Principles
    • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
    • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
    • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
      - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
      - Check component documentation - Each component page includes a link to the component's style source
    • If styles are occupied by animation, modify them via the animation prop on components that support it.
    • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
    💡 To disable this message, set config.devInfo.stylingPrinciples to false

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)


  ● R3 › registra welcome bajo su propio guard de no autenticado

    expect(received).toMatch(expected)

    Expected pattern: /<Stack\.Protected guard=\{status !== 'authenticated'\}>\s*<Stack\.Screen name="welcome" \/>\s*<\/Stack\.Protected>/
    Received string:  "import '../theme/global.css';·
    import { useFonts } from 'expo-font';
    import { Stack } from 'expo-router';
    import { HeroUINativeProvider } from 'heroui-native';
    import { useEffect, useState } from 'react';
    import { GestureHandlerRootView } from 'react-native-gesture-handler';
    import { Uniwind } from 'uniwind';·
    import { usePushRegistration } from '../hooks/use-push-registration';
    import { DEFAULT_LANGUAGE, type Language } from '../i18n/catalog';
    import { AuthProvider, useAuth } from '../providers/auth-provider';
    import { LanguageProvider, useTranslate } from '../providers/language-provider';
    import { QueryProvider } from '../providers/query-provider';
    import { SelectedPetProvider } from '../providers/selected-pet-provider';
    import { useThemeColors } from '../theme/use-theme-colors';
    import { getStoredLanguage } from '../utils/language-preference';
    import { getStoredTheme } from '../utils/theme-preference';·
    function PushRegistration() {
      usePushRegistration();
      const empty = null;
      return empty;
    }·
    export default function RootLayout() {
      const [themeReady, setThemeReady] = useState(false);
      const [initialLanguage, setInitialLanguage] =
        useState<Language>(DEFAULT_LANGUAGE);
      useFonts({
        'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
        'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
        'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
        'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
        'Inter-Black': require('../../assets/fonts/Inter-Black.ttf'),
      });·
      useEffect(() => {
        let mounted = true;·
        void Promise.all([getStoredTheme(), getStoredLanguage()]).then(
          ([theme, language]) => {
            if (!mounted) return;
            if (theme) Uniwind.setTheme(theme);
            if (language) setInitialLanguage(language);
            setThemeReady(true);
          },
        );·
        return () => {
          mounted = false;
        };
      }, []);·
      if (!themeReady) return <></>;·
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <HeroUINativeProvider>
            <LanguageProvider initial={initialLanguage}>
              <AuthProvider>
                <QueryProvider>
                  <SelectedPetProvider>
                    <PushRegistration />
                    <RootStack />
                  </SelectedPetProvider>
                </QueryProvider>
              </AuthProvider>
            </LanguageProvider>
          </HeroUINativeProvider>
        </GestureHandlerRootView>
      );
    }·
    function RootStack() {
      const { status } = useAuth();
      const t = useTranslate();
      const [background, foreground] = useThemeColors(['background', 'foreground']);
      const headerOptions = {
        headerShown: true,
        headerStyle: { backgroundColor: background },
        headerTintColor: foreground,
        headerTitleStyle: { fontFamily: 'Inter-Bold' },
        headerShadowVisible: false,
      };·
      return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name=\"index\" />
          <Stack.Screen name=\"(tabs)\" />
          <Stack.Screen name=\"(auth)\" />
          <Stack.Screen name=\"reset-password\" />
          <Stack.Protected guard={status === 'authenticated'}>
            <Stack.Screen name=\"add-reminder\" options={{ ...headerOptions, title: t('addReminder.addReminder') }} />
            <Stack.Screen name=\"pets/add\" options={{ ...headerOptions, title: t('addPet.addPet') }} />
            <Stack.Screen name=\"pets/[petId]/docs\" options={{ ...headerOptions, title: '' }} />
            <Stack.Screen name=\"weight-log\" options={{ ...headerOptions, title: t('weightLog.weightLog') }} />
            <Stack.Screen name=\"meal-schedule\" options={{ ...headerOptions, title: t('mealSchedule.mealSchedule') }} />
            <Stack.Screen name=\"pairing\" options={{ ...headerOptions, title: '' }} />
            <Stack.Screen name=\"reminders\" options={{ ...headerOptions, title: t('reminders.reminders') }} />
            <Stack.Screen name=\"alerts\" dangerouslySingular options={{ ...headerOptions, title: t('alerts.title') }} />
            <Stack.Screen name=\"alerts/[alertId]\" dangerouslySingular options={{ ...headerOptions, title: t('alerts.detailTitle') }} />
            <Stack.Screen name=\"pets/[petId]/geofences\" options={{ ...headerOptions, title: t('geofences.title') }} />
            <Stack.Screen name=\"pets/[petId]/geofence-editor\" options={{ ...headerOptions, title: t('geofenceEditor.title') }} />
            <Stack.Screen name=\"meals-history\" options={{ ...headerOptions, title: t('mealsHistory.mealsHistory') }} />
          </Stack.Protected>
        </Stack>
      );
    }
    "

      89 |   it('registra welcome bajo su propio guard de no autenticado', () => {
      90 |     const source = readSource('app/_layout.tsx');
    > 91 |     expect(source).toMatch(/<Stack\.Protected guard=\{status !== 'authenticated'\}>\s*<Stack\.Screen name="welcome" \/>\s*<\/Stack\.Protected>/);
         |                    ^
      92 |     expect(source.match(/name="welcome"/g)).toHaveLength(1);
      93 |   });
      94 |

      at Object.toMatch (src/screens/welcome/index.test.tsx:91:20)


  ● R3 › deja el route de welcome delgado

    expect(received).toContain(expected) // indexOf

    Expected substring: "from '../screens/welcome'"
    Received string:    ""

       96 |     const source = readSource('app/welcome.tsx');
       97 |     expect(source.split('\n').filter((line) => line.trim()).length).toBeLessThanOrEqual(5);
    >  98 |     expect(source).toContain("from '../screens/welcome'");
          |                    ^
       99 |   });
      100 | });
      101 |

      at Object.toContain (src/screens/welcome/index.test.tsx:98:20)


  ● R4 › con sesión redirige a home y no pinta la pantalla

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

      106 |     } satisfies AuthContextValue);
      107 |     await renderWelcome();
    > 108 |     expect(mockRedirect).toHaveBeenCalledTimes(1);
          |                          ^
      109 |     expect(mockRedirect.mock.calls[0]?.[0]).toEqual({ href: '/home' });
      110 |     expect(screen.queryByTestId('screen-welcome')).toBeNull();
      111 |     expect(screen.queryByTestId('welcome-get-started')).toBeNull();

      at Object.toHaveBeenCalledTimes (src/screens/welcome/index.test.tsx:108:26)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R5 › aplica las dimensiones del grupo sin tab bar

    Unable to find an element with testID: screen-welcome

    <RNCSafeAreaProvider />

      116 |   it('aplica las dimensiones del grupo sin tab bar', async () => {
      117 |     await renderWelcome();
    > 118 |     expect(screen.getByTestId('screen-welcome').props.contentContainerStyle).toEqual({
          |                   ^
      119 |       flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, paddingTop: 52, paddingBottom: 48,
      120 |     });
      121 |     expect(screen.getByTestId('screen-welcome').props.className).toBe('flex-1 bg-background');

      at Object.getByTestId (src/screens/welcome/index.test.tsx:118:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R5 › apila los siete bloques en orden

    Unable to find an element with testID: welcome-content

    <RNCSafeAreaProvider />

      125 |   it('apila los siete bloques en orden', async () => {
      126 |     await renderWelcome();
    > 127 |     const children = screen.getByTestId('welcome-content').children as TestInstance[];
          |                             ^
      128 |     expect(children).toHaveLength(7);
      129 |     expect(children.map((child) => child.props.testID)).toEqual([
      130 |       'welcome-hero', 'welcome-brand', 'welcome-chips', 'welcome-tagline',

      at Object.getByTestId (src/screens/welcome/index.test.tsx:127:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R5 › pinta hero, marca, tagline y legal con sus clases

    Unable to find an element with testID: welcome-brand

    <RNCSafeAreaProvider />

      135 |   it('pinta hero, marca, tagline y legal con sus clases', async () => {
      136 |     await renderWelcome();
    > 137 |     expect(screen.getByTestId('welcome-brand').props.className).toBe('text-3xl font-bold text-foreground');
          |                   ^
      138 |     expect(screen.getByTestId('welcome-tagline').props.className).toBe('text-center text-base text-muted');
      139 |     expect(screen.getByTestId('welcome-legal').props.className).toBe('text-center text-xs text-muted');
      140 |     expect(StyleSheet.flatten(screen.getByTestId('welcome-content').props.style)).toMatchObject({ alignItems: 'center', gap: 16 });

      at Object.getByTestId (src/screens/welcome/index.test.tsx:137:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R9 › muestra el copy en español

    Unable to find an element with text: Pet Tracker

    <RNCSafeAreaProvider />

      147 |   it('muestra el copy en español', async () => {
      148 |     await renderWelcome('es');
    > 149 |     expect(screen.getByText('Pet Tracker')).toBeOnTheScreen();
          |                   ^
      150 |     expect(screen.getByText('GPS')).toBeOnTheScreen();
      151 |     expect(screen.getByText('Salud')).toBeOnTheScreen();
      152 |     expect(screen.getByText('Nutrición')).toBeOnTheScreen();

      at Object.getByText (src/screens/welcome/index.test.tsx:149:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R9 › muestra el copy en inglés

    Unable to find an element with text: Pet Tracker

    <RNCSafeAreaProvider />

      159 |   it('muestra el copy en inglés', async () => {
      160 |     await renderWelcome('en');
    > 161 |     expect(screen.getByText('Pet Tracker')).toBeOnTheScreen();
          |                   ^
      162 |     expect(screen.getByText('GPS')).toBeOnTheScreen();
      163 |     expect(screen.getByText('Health')).toBeOnTheScreen();
      164 |     expect(screen.getByText('Nutrition')).toBeOnTheScreen();

      at Object.getByText (src/screens/welcome/index.test.tsx:161:19)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Commit: `a7c3a656 test(mobile): lock the welcome screen tree and route (#118 R3, R4, R5, R9)`.

### T3 — R3/R4/R5/R9 verde y cascadas ajustadas

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/consistency-classnames.test.ts --verbose > /tmp/118-t3-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/app/__tests__/layout.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/screens/welcome/index.test.tsx (44.614 s)
Test Suites: 3 passed, 3 total
Tests:       89 passed, 89 total
Snapshots:   0 total
Time:        45.128 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/app/__tests__/layout.test.tsx` | 26 | 0 |
| `src/__tests__/consistency-classnames.test.ts` | 55 | 0 |
| `src/screens/welcome/index.test.tsx` | 8 | 0 |

### T3 — typecheck

Desde mobile-pet-tracker/:

```bash
test ! -e .expo/types/router.d.ts && bun run typecheck > /tmp/118-t3-typecheck.log 2>&1; echo "exit=$?"
```

```text

exit=0
```

Commit: `431894bc feat(mobile): add the welcome screen under its own guard (#118 R3, R4, R5, R9)`.

### T3 — refactor sin fallbacks de ausencia

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t3-refactor.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        4.971 s, estimated 45 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 8 | 0 |

Commit: `2f28f62c refactor(mobile): remove the missing-screen test fallback (#118 R3)`.

### T4 — R6 nace verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t4-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.021 s)
Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        5.189 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 20 | 0 |

Commit: `f5ebec6c test(mobile): lock the three welcome chips (#118 R6)`.

### T4 — R6 sonda: iconos 14 → 20 (sin commit)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t4-probe.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.307 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 19 passed, 20 total
Snapshots:   0 total
Time:        5.462 s, estimated 6 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 19 | 1 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● R6 › usa iconos de 14 puntos

    expect(received).toBe(expected) // Object.is equality

    Expected: 14
    Received: 20

      194 |     await renderWelcome();
      195 |     const chips = screen.getByTestId('welcome-chips').children as TestInstance[];
    > 196 |     chips.forEach((chip) => expect((chip.children[0] as TestInstance).props.size).toBe(14));
          |                                                                                   ^
      197 |   });
      198 |
      199 |   it('resuelve la tinta accent-strong de cada icono', async () => {

      at toBe (src/screens/welcome/index.test.tsx:196:83)
          at Array.forEach (<anonymous>)
      at Object.forEach (src/screens/welcome/index.test.tsx:196:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Sonda R6 revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```text
$ git diff -- mobile-pet-tracker/src/screens/welcome/index.tsx
(salida vacía)
exit=0
$ git diff --cached --stat
(salida vacía)
exit=0
```

### T5 — R7 nace verde (R6 restaurado)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t5-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (6.067 s)
Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        6.236 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 22 | 0 |

Commit: `a81147d9 test(mobile): lock the primary welcome CTA (#118 R7)`.

### T5 — R7 sonda: destino register → login (sin commit)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t5-probe.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.108 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
Snapshots:   0 total
Time:        5.274 s, estimated 7 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 21 | 1 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● R7 › empuja a registro sin reemplazar

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "/register"
    Received: "/login"

    Number of calls: 1

      261 |     await fireEvent.press(screen.getByTestId('welcome-get-started'));
      262 |     expect(mockRouter.push).toHaveBeenCalledTimes(1);
    > 263 |     expect(mockRouter.push).toHaveBeenCalledWith('/register');
          |                             ^
      264 |     expect(mockRouter.replace).not.toHaveBeenCalled();
      265 |   });
      266 |

      at Object.toHaveBeenCalledWith (src/screens/welcome/index.test.tsx:263:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Sonda R7 revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```text
$ git diff -- mobile-pet-tracker/src/screens/welcome/index.tsx
(salida vacía)
exit=0
$ git diff --cached --stat
(salida vacía)
exit=0
```

### T6 — R8 nace verde (R7 restaurado)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t6-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        5.052 s, estimated 6 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 24 | 0 |

Commit: `2a4f2376 test(mobile): lock the secondary welcome CTA (#118 R8)`.

### T6 — R8 sonda: destino login → register (sin commit)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t6-probe.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.1 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 23 passed, 24 total
Snapshots:   0 total
Time:        5.247 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 23 | 1 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● R8 › empuja a login sin reemplazar

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "/login"
    Received: "/register"

    Number of calls: 1

      279 |     await fireEvent.press(screen.getByTestId('welcome-have-account'));
      280 |     expect(mockRouter.push).toHaveBeenCalledTimes(1);
    > 281 |     expect(mockRouter.push).toHaveBeenCalledWith('/login');
          |                             ^
      282 |     expect(mockRouter.replace).not.toHaveBeenCalled();
      283 |   });
      284 |

      at Object.toHaveBeenCalledWith (src/screens/welcome/index.test.tsx:281:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Sonda R8 revertida con `git checkout HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx`.

```text
$ git diff -- mobile-pet-tracker/src/screens/welcome/index.tsx
(salida vacía)
exit=0
$ git diff --cached --stat
(salida vacía)
exit=0
```

### T7 — R10 rojo (R8 restaurado)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t7-red.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.26 s)
Test Suites: 1 failed, 1 total
Tests:       24 failed, 4 passed, 28 total
Snapshots:   0 total
Time:        5.411 s, estimated 6 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 4 | 24 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● R5 › aplica las dimensiones del grupo sin tab bar

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R5 › apila los siete bloques en orden

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R5 › pinta hero, marca, tagline y legal con sus clases

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R9 › muestra el copy en español

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R9 › muestra el copy en inglés

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › asigna el testID de cada chip

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › aplica la misma clase a cada chip

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › pinta el icono de cada chip

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › usa iconos de 14 puntos

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › resuelve la tinta accent-strong de cada icono

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › resuelve la etiqueta de cada chip por su clave

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › aplica la clase de tinta a cada etiqueta

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › ordena GPS, Salud y Nutrición

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › deja dos hijos por chip, icono y etiqueta

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › deja cada chip sin pulsación ni rol de botón

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R6 › contiene exactamente tres chips

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R7 › empuja a registro sin reemplazar

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R7 › es el botón primario del repo

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R8 › empuja a login sin reemplazar

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R8 › es un botón hueco con tinta accent-strong

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R10 › fija la duración y la curva

    expect(received).toBe(expected) // Object.is equality

    Expected: 240
    Received: undefined

      302 |
      303 |   it('fija la duración y la curva', () => {
    > 304 |     expect(WELCOME_ENTRANCE_MS).toBe(240);
          |                                 ^
      305 |     expect(WELCOME_ENTRANCE_EASING).toBeDefined();
      306 |   });
      307 |

      at Object.toBe (src/screens/welcome/index.test.tsx:304:33)


  ● R10 › arranca invisible y desplazado sin Reduce Motion

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R10 › termina visible y en su sitio sin Reduce Motion

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


  ● R10 › con Reduce Motion no se desplaza

    Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

    Check the render method of `WelcomeScreen`.

      at createFiberFromTypeAndProps (node_modules/react-reconciler/cjs/react-reconciler.development.js:16706:28)
      at createFiberFromElement (node_modules/react-reconciler/cjs/react-reconciler.development.js:16720:14)
      at reconcileChildFibersImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:4495:31)
      at node_modules/react-reconciler/cjs/react-reconciler.development.js:4673:33
      at reconcileChildren (node_modules/react-reconciler/cjs/react-reconciler.development.js:7255:13)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9542:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14245:35)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21


```

## Parada en T7 por regresión del mock (no es un rojo válido C4)

Se aplica la instrucción del handoff: «Si cae otro it, PARA y reportalo».
El intento de rojo T7 produjo 1 suite / 24 failed / 4 passed / 28 total /
exit=1. Veinte de los tests anteriores a R10 caen por un fallo del arnés,
no por ausencia de la animación. El error común es:

```text
Element type is invalid: expected a string (for built-in components) or a
class/function (for composite components) but got: undefined.
Check the render method of WelcomeScreen.
```

Los cuatro R10 también caen: solo «fija la duración y la curva» falla por
su matcher previsto (`toBe`, Expected 240, Received undefined). Los otros
tres caen al renderizar, antes de poder comprobar el estilo.

Tests anteriores que fallaron inesperadamente:

- `R5 › aplica las dimensiones del grupo sin tab bar`.
- `R5 › apila los siete bloques en orden`.
- `R5 › pinta hero, marca, tagline y legal con sus clases`.
- `R9 › muestra el copy en español`.
- `R9 › muestra el copy en inglés`.
- `R6 › asigna el testID de cada chip`.
- `R6 › aplica la misma clase a cada chip`.
- `R6 › pinta el icono de cada chip`.
- `R6 › usa iconos de 14 puntos`.
- `R6 › resuelve la tinta accent-strong de cada icono`.
- `R6 › resuelve la etiqueta de cada chip por su clave`.
- `R6 › aplica la clase de tinta a cada etiqueta`.
- `R6 › ordena GPS, Salud y Nutrición`.
- `R6 › deja dos hijos por chip, icono y etiqueta`.
- `R6 › deja cada chip sin pulsación ni rol de botón`.
- `R6 › contiene exactamente tres chips`.
- `R7 › empuja a registro sin reemplazar`.
- `R7 › es el botón primario del repo`.
- `R8 › empuja a login sin reemplazar`.
- `R8 › es un botón hueco con tinta accent-strong`.

Diagnóstico de solo lectura: el mock parcial añadido en T7 devuelve
`{ ...actual, useReducedMotion: ... }` sin `__esModule: true`. El
precedente Home conserva ese marcador explícitamente (línea 131).
El import por defecto `Animated` puede recibir el namespace del mock en
vez de su default y por ello Animated.View queda undefined. Es la causa
probable; no se ha modificado el mock ni se ha ejecutado otro test para
validar la corrección, respetando la parada. Se omitió el marcador al
adaptar el mock: error del arnés introducido en esta sesión.

### Estado al detenerse en T7

- T1–T6 implementados y commiteados, con rojos/sondas anotados arriba.
- Último commit: `2a4f2376` (R8). La suite nueva pasó 24/24 antes de T7.
- Base typecheck y lint: ambos exit=0; typecheck tras T3: exit=0.
- R6, R7 y R8: sondas revertidas, diffs de producción e índice vacíos.
- T7 queda sin commit: solo el test tiene cambios pendientes; la pantalla
  de producción aún no lleva la animación.
- T8–T10, R11/sonda, cierre de 8 suites, R12 final y trazabilidad final:
  pendientes. No se rellena traceability.md hasta el último commit.
- R13/S1–S8 y signOut no se modifican. No se hace init.sh, rebase, push ni
  PR, ni se toca infraestructura u otros worktrees.

Estado git al detenerse (nuevo H0 = 69847c4f):

```text
$ git rev-parse --short HEAD
2a4f2376
exit=0
$ git diff --name-only 69847c4f HEAD
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/app/__tests__/index.test.tsx
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/app/index.tsx
mobile-pet-tracker/src/app/welcome.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/welcome/index.test.tsx
mobile-pet-tracker/src/screens/welcome/index.tsx
specs/mobile-ui-language/design.md
exit=0
$ git status --short
 M mobile-pet-tracker/src/screens/welcome/index.test.tsx
?? progress/impl_mobile-welcome-splash.md
exit=0
```

Commits creados desde H0:

```text
81ac3fb9 test(mobile): lock the catalog length for the welcome keys (#118 R1)
01b340fd feat(mobile): add the welcome copy in both languages (#118 R1)
c5b6b0be test(mobile): expect the unauthenticated redirect to welcome (#118 R2)
14c389c1 feat(mobile): redirect unauthenticated sessions to welcome (#118 R2)
a7c3a656 test(mobile): lock the welcome screen tree and route (#118 R3, R4, R5, R9)
431894bc feat(mobile): add the welcome screen under its own guard (#118 R3, R4, R5, R9)
2f28f62c refactor(mobile): remove the missing-screen test fallback (#118 R3)
f5ebec6c test(mobile): lock the three welcome chips (#118 R6)
a81147d9 test(mobile): lock the primary welcome CTA (#118 R7)
2a4f2376 test(mobile): lock the secondary welcome CTA (#118 R8)
```

### T7 — R10 rojo (tras el arreglo del mock)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t7-red-fixed-mock.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.087 s)
Test Suites: 1 failed, 1 total
Tests:       4 failed, 24 passed, 28 total
Snapshots:   0 total
Time:        5.227 s, estimated 6 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 24 | 4 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● R10 › fija la duración y la curva

    expect(received).toBe(expected) // Object.is equality

    Expected: 240
    Received: undefined

      302 |
      303 |   it('fija la duración y la curva', () => {
    > 304 |     expect(WELCOME_ENTRANCE_MS).toBe(240);
          |                                 ^
      305 |     expect(WELCOME_ENTRANCE_EASING).toBeDefined();
      306 |   });
      307 |

      at Object.toBe (src/screens/welcome/index.test.tsx:304:33)


  ● R10 › arranca invisible y desplazado sin Reduce Motion

    Expected: {"opacity":0,"transform":[{"translateY":16}]}
    Received: {"alignItems":"center","gap":16}

    Differences:
    - 'opacity' should be 0, but is undefined
    - 'transform' should be [{"translateY":16}], but is undefined

      308 |   it('arranca invisible y desplazado sin Reduce Motion', async () => {
      309 |     await renderWelcome();
    > 310 |     expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
          |                                                   ^
      311 |       opacity: 0, transform: [{ translateY: 16 }],
      312 |     });
      313 |   });

      at Object.toHaveAnimatedStyle (src/screens/welcome/index.test.tsx:310:51)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R10 › termina visible y en su sitio sin Reduce Motion

    Expected: {"opacity":0,"transform":[{"translateY":16}]}
    Received: {"alignItems":"center","gap":16}

    Differences:
    - 'opacity' should be 0, but is undefined
    - 'transform' should be [{"translateY":16}], but is undefined

      315 |   it('termina visible y en su sitio sin Reduce Motion', async () => {
      316 |     await renderWelcome();
    > 317 |     expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
          |                                                   ^
      318 |       opacity: 0, transform: [{ translateY: 16 }],
      319 |     });
      320 |     await act(async () => {

      at Object.toHaveAnimatedStyle (src/screens/welcome/index.test.tsx:317:51)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R10 › con Reduce Motion no se desplaza

    Expected: {"opacity":0,"transform":[{"translateY":0}]}
    Received: {"alignItems":"center","gap":16}

    Differences:
    - 'opacity' should be 0, but is undefined
    - 'transform' should be [{"translateY":0}], but is undefined

      329 |     mockUseReducedMotion.mockReturnValue(true);
      330 |     await renderWelcome();
    > 331 |     expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
          |                                                   ^
      332 |       opacity: 0, transform: [{ translateY: 0 }],
      333 |     });
      334 |     await act(async () => {

      at Object.toHaveAnimatedStyle (src/screens/welcome/index.test.tsx:331:51)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

### Reanudación de T7 autorizada por el leader

H0 sigue siendo `69847c4f`; HEAD al reanudar: `2a4f2376`.
Se añadió exclusivamente `__esModule: true` al retorno del mock parcial.
No se cambió ninguna aserción ni producción antes de repetir el rojo.
Resultado conforme: 28 total, 24 verdes y cuatro R10 rojos por sus matchers,
sin fallos de render/consulta/import. withTiming sigue real.

Commit: `58961dcf test(mobile): lock the welcome entrance and reduce motion (#118 R10)`.

### T7 — R10 verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/screens/welcome/index.test.tsx --verbose > /tmp/118-t7-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.223 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.373 s, estimated 6 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/screens/welcome/index.test.tsx` | 28 | 0 |

R10: ventana original de 580 ms (`240 * 2 + 100`) suficiente; no se
amplió ni se cambiaron aserciones. useEffect depende de los shared values
estables y del valor de useReducedMotion (fijado al montar), sin estado
React que reinicie la entrada. Una escritura por shared value al montar;
translateY no se escribe si Reduce Motion está activo.

Detalle necesario para el fundido prescrito por R10: withTiming adopta
ReduceMotion.System por defecto (fuente instalada: animation/timing.ts),
y animation/util.ts salta directamente al destino si el sistema lo activa.
Se fija `reduceMotion: ReduceMotion.Never` exclusivamente para la opacidad,
para que el fundido de 240 ms continúe; la traslación respeta el hook y nace
en 0 con Reduce Motion. No se añade nada al mock salvo el marcador autorizado.

Commit: `fecffd30 feat(mobile): animate the welcome entrance once (#118 R10)`.

### T8 — R1 tabla de usos roja por SCREEN_FILES +1

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/ui-language.test.ts --verbose > /tmp/118-t8-red.log 2>&1; echo "exit=$?"
```

```text
FAIL src/__tests__/ui-language.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 29 passed, 30 total
Snapshots:   0 total
Time:        2.264 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/__tests__/ui-language.test.ts` | 29 | 1 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › no deja ningún valor fijo del catálogo como literal entero en las pantallas

    expect(received).toHaveLength(expected)

    Expected length: 28
    Received length: 29
    Received array:  ["src/app/(auth)/login.tsx", "src/app/(auth)/forgot.tsx", "src/app/(auth)/register.tsx", "src/components/floating-tab-bar.tsx", "src/screens/home/index.tsx", "src/screens/home/weekly-activity-chart.tsx", "src/screens/map/index.tsx", "src/app/_layout.tsx", "src/screens/health/index.tsx", "src/screens/weight-log/index.tsx", …]

      493 |
      494 |   it('no deja ningún valor fijo del catálogo como literal entero en las pantallas', () => {
    > 495 |     expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10, #146 R10, #105 R5
          |                          ^
      496 |
      497 |     for (const file of SCREEN_FILES) {
      498 |       const literals = wholeLiterals(readFileSync(join(SOURCE_ROOT, file), 'utf8'));

      at Object.toHaveLength (src/__tests__/ui-language.test.ts:495:26)


```

Commit: `cf9407ad test(mobile): add welcome to the copy usage table and screen list (#118 R1)`.

### T8 — R1 verde: SCREEN_FILES +1

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/ui-language.test.ts --verbose > /tmp/118-t8-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
Test Suites: 1 passed, 1 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        2.28 s, estimated 3 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/__tests__/ui-language.test.ts` | 30 | 0 |

Commit: `fa75f06a test(mobile): count welcome among the scanned screens (#118 R1)`.

### T9 — R11 nace verde; candados globales intactos

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/consistency-classnames.test.ts --verbose > /tmp/118-t9-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/legibility-classnames.test.ts
Test Suites: 3 passed, 3 total
Tests:       142 passed, 142 total
Snapshots:   0 total
Time:        2.388 s, estimated 19 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/__tests__/consistency-classnames.test.ts` | 55 | 0 |
| `src/__tests__/design-drift.test.ts` | 60 | 0 |
| `src/__tests__/legibility-classnames.test.ts` | 27 | 0 |

Commit: `cffe227f test(mobile): guard the welcome files against style drift (#118 R11)`.

### T9 — R11 sonda: import expo-symbols (sin commit)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/__tests__/design-drift.test.ts --verbose > /tmp/118-t9-probe.log 2>&1; echo "exit=$?"
```

```text
FAIL src/__tests__/design-drift.test.ts
Test Suites: 1 failed, 1 total
Tests:       1 failed, 59 passed, 60 total
Snapshots:   0 total
Time:        1.348 s, estimated 2 s
exit=1
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/__tests__/design-drift.test.ts` | 59 | 1 |

Fallos observados (matchers / Expected / Received / consultas):

```text
  ● #118 R11: la bienvenida no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales

    expect(received).not.toMatch(expected)

    Expected pattern: not /expo-linear-gradient|expo-symbols/
    Received string:      "import { SymbolView } from 'expo-symbols';
    import { WelcomeScreen } from '../screens/welcome';

    export default function WelcomeRoute() {
      return <WelcomeScreen />;
    }
    "

      690 |     const violations = featureFiles.flatMap((relativePath) => {
      691 |       const source = readFileSync(join(projectRoot, relativePath), 'utf8');
    > 692 |       expect(source).not.toMatch(/expo-linear-gradient|expo-symbols/);
          |                          ^
      693 |       expect(source).not.toMatch(/\buseThemeColor\b|\p{Extended_Pictographic}/u);
      694 |       return MEALS_BAR_STYLE_ESCAPES.test(source) ||
      695 |         /\brounded-(?:2xl|lg|md|sm)\b|text-accent(?![-\w])/.test(source)

      at toMatch (src/__tests__/design-drift.test.ts:692:26)
          at Array.flatMap (<anonymous>)
      at Object.flatMap (src/__tests__/design-drift.test.ts:690:37)


```

Sonda R11 revertida con `git checkout HEAD -- mobile-pet-tracker/src/app/welcome.tsx`.

```text
$ git diff -- mobile-pet-tracker/src/app/welcome.tsx
(salida vacía)
exit=0
$ git diff --cached --stat
(salida vacía)
exit=0
```

### T10 — cierre de las ocho suites (R11 restaurado)

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/welcome/index.test.tsx --verbose > /tmp/118-final-jest.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/design-drift.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/__tests__/ui-language.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/welcome/index.test.tsx (8.234 s)
Test Suites: 8 passed, 8 total
Tests:       251 passed, 251 total
Snapshots:   0 total
Time:        8.917 s, estimated 9 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/__tests__/design-drift.test.ts` | 60 | 0 |
| `src/app/__tests__/layout.test.tsx` | 26 | 0 |
| `src/__tests__/ui-language.test.ts` | 30 | 0 |
| `src/providers/__tests__/language-provider.test.tsx` | 22 | 0 |
| `src/app/__tests__/index.test.tsx` | 3 | 0 |
| `src/__tests__/consistency-classnames.test.ts` | 55 | 0 |
| `src/__tests__/legibility-classnames.test.ts` | 27 | 0 |
| `src/screens/welcome/index.test.tsx` | 28 | 0 |

### T10 — typecheck final

Desde mobile-pet-tracker/:

```bash
test ! -e .expo/types/router.d.ts && bun run typecheck > /tmp/118-final-typecheck.log 2>&1; echo "exit=$?"
```

```text

exit=0
```

### T10 — lint final

Desde mobile-pet-tracker/:

```bash
bun run lint > /tmp/118-final-lint.log 2>&1; echo "exit=$?"
```

```text

exit=1
```

### T10 — primer lint final: error de inmutabilidad

```text
$ expo lint

/home/claude/sites/Pet-Tracker-wt-118/mobile-pet-tracker/src/screens/welcome/index.tsx
  44:5  error  Error: This value cannot be modified

This modifies a variable that React considers immutable.

/home/claude/sites/Pet-Tracker-wt-118/mobile-pet-tracker/src/screens/welcome/index.tsx:44:5
  42 |
  43 |   useEffect(() => {
> 44 |     opacity.value = withTiming(1, {
     |     ^^^^^^^ `opacity` cannot be modified
  45 |       duration: WELCOME_ENTRANCE_MS,
  46 |       easing: WELCOME_ENTRANCE_EASING,
  47 |       // Reduce Motion keeps this fade while removing the spatial motion below  react-hooks/immutability
  51:7  error  Error: This value cannot be modified

This modifies a variable that React considers immutable.

/home/claude/sites/Pet-Tracker-wt-118/mobile-pet-tracker/src/screens/welcome/index.tsx:51:7
  49 |     });
  50 |     if (!reduceMotion) {
> 51 |       translateY.value = withTiming(0, {
     |       ^^^^^^^^^^ `translateY` cannot be modified
  52 |         duration: WELCOME_ENTRANCE_MS,
  53 |         easing: WELCOME_ENTRANCE_EASING,
  54 |       });                                         react-hooks/immutability

✖ 2 problems (2 errors, 0 warnings)

error: "eslint" exited with code 1
error: script "lint" exited with code 1
exit=1
```

Las ocho suites (251/251) y typecheck dieron exit=0. El lint detectó
dos escrituras .value, no un cambio de candados ni una regresión de tests.
Se usa el patrón .set(withTiming(...)) ya presente en food.tsx y el
.get()/.set() de animate-expo §6, sin desactivar la regla. Llamadores de
WelcomeScreen revisados: welcome.tsx y su suite colocada; no otros flujos.
Este refactor será un commit propio R10 después de repetir los gates.

### T10 — cierre final tras el refactor de shared values

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/welcome/index.test.tsx --verbose > /tmp/118-final-jest-setters.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/welcome/index.test.tsx (8.21 s)
Test Suites: 8 passed, 8 total
Tests:       251 passed, 251 total
Snapshots:   0 total
Time:        8.775 s, estimated 9 s
exit=0
```

| Suite | Verdes | Rojos |
| --- | ---: | ---: |
| `src/__tests__/design-drift.test.ts` | 60 | 0 |
| `src/__tests__/ui-language.test.ts` | 30 | 0 |
| `src/app/__tests__/layout.test.tsx` | 26 | 0 |
| `src/app/__tests__/index.test.tsx` | 3 | 0 |
| `src/__tests__/consistency-classnames.test.ts` | 55 | 0 |
| `src/providers/__tests__/language-provider.test.tsx` | 22 | 0 |
| `src/__tests__/legibility-classnames.test.ts` | 27 | 0 |
| `src/screens/welcome/index.test.tsx` | 28 | 0 |

Commit: `80250ef2 refactor(mobile): use compiler-safe shared values (#118 R10)`.

### T10 — typecheck y lint definitivos tras el refactor

Desde mobile-pet-tracker/, sin pipe:

```bash
test ! -e .expo/types/router.d.ts; echo "guard_exit=$?"
if test ! -e .expo/types/router.d.ts; then
  bun run typecheck > /tmp/118-final-typecheck-setters.log 2>&1; echo "exit=$?"
fi
```

```text
guard_exit=0
$ tsc --noEmit
exit=0
```

```bash
bun run lint > /tmp/118-final-lint-setters.log 2>&1; echo "exit=$?"
```

```text
$ expo lint
exit=0
```

El refactor 80250ef2 usa .get()/.set() para la misma entrada de R10.
No cambia duración, curva, estado inicial, Reduce Motion ni aserciones;
withTiming sigue real en el mock. El primer lint rojo queda resuelto.

### T10 — R12 y configuración

Desde la raíz del worktree, sin pipe:

```bash
git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock > /tmp/118-final-r12.log; echo "exit=$?"
git diff 69847c4f HEAD -- mobile-pet-tracker/app.json > /tmp/118-final-app-json.log; echo "exit=$?"
```

```text
$ git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
(salida vacía)
exit=0
$ git diff 69847c4f HEAD -- mobile-pet-tracker/app.json
(salida vacía)
exit=0
```

No se añadieron dependencias; todos los gates móviles usaron bun/bunx.
No se generó .expo/types/router.d.ts. Las rutas /welcome y /register
pasaron typecheck sin ese fichero.

## Cierre de implementación T1–T10

H0 efectivo: 69847c4f; branch: feature/118-mobile-welcome-splash.
R1–R12 implementados y verificados por los gates descritos. R13/T11 y
S8 (destino de signOut) quedan para el humano; sus casillas no se tocaron.
Las dos paradas históricas se resolvieron con las correcciones autorizadas
del handoff y del mock. No queda un bloqueo de implementación.

### Delta final de tests por fichero

| Fichero desde mobile-pet-tracker/ | Base H0 | Final | Delta |
| --- | ---: | ---: | ---: |
| src/app/__tests__/index.test.tsx | 3 | 3 | 0 |
| src/app/__tests__/layout.test.tsx | 25 | 26 | +1 |
| src/providers/__tests__/language-provider.test.tsx | 22 | 22 | 0 |
| src/__tests__/ui-language.test.ts | 29 | 30 | +1 |
| src/__tests__/consistency-classnames.test.ts | 55 | 55 | 0 |
| src/__tests__/legibility-classnames.test.ts | 26 | 27 | +1 |
| src/__tests__/design-drift.test.ts | 59 | 60 | +1 |
| src/screens/welcome/index.test.tsx | 0 | 28 | +28 |
| Total | 219 | 251 | +32 |

Las siete suites base se convierten en ocho con welcome. ui-copy-table.ts
aporta los mismos dos it al importar el helper desde ui-language.test.ts;
no es una novena suite. Ningún it se borró: el de index se renombró.
En welcome: R3 2, R4 1, R5 3, R6 12, R7 2, R8 2, R9 2, R10 4.

Candados globales conservados: CONTINUOUS_CORNER = 32, bg-accent-soft = 19,
directUses de #62 R14, ausencia de text-accent suelto y #62 R4 it.each(radios).
Solo se aplicaron las sumas prescritas: catálogo +8, SCREEN_FILES +1,
primarios +1 en los dos recuentos, hijos del Stack +1 y tinta welcome +2.

### Tabla R → it → commit

Las flechas indican rojo → verde; los tests que nacen verdes tienen su
sonda fallida y restauración documentadas arriba. Hashes estables, sin rebase.

| Requisito | Test (archivo::nombre) | Commit |
| --- | --- | --- |
| R1 | `src/providers/__tests__/language-provider.test.tsx::mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas` (+8) | `81ac3fb9` → `01b340fd` |
| R1 | `src/__tests__/ui-language.test.ts::#118 R1: welcome resuelve su copy por clave › resuelve las 8 ocurrencias de welcome` | `cf9407ad` → `fa75f06a` |
| R1 | `src/__tests__/ui-language.test.ts::no deja ningún valor fijo del catálogo como literal entero en las pantallas` (`SCREEN_FILES` +1) | `cf9407ad` → `fa75f06a` |
| R1 | `src/__tests__/ui-copy-table.ts::cuadra ALL_USES con la suma de sus bloques` (`R16_WELCOME`) | `cf9407ad` → `fa75f06a` |
| R2 | `src/app/__tests__/index.test.tsx::#118 R2: redirects an unauthenticated session to welcome` | `c5b6b0be` → `14c389c1` |
| R3 | `src/screens/welcome/index.test.tsx::R3 › registra welcome bajo su propio guard de no autenticado` | `a7c3a656` → `431894bc`; refactor `2f28f62c` |
| R3 | `src/screens/welcome/index.test.tsx::R3 › deja el route de welcome delgado` | `a7c3a656` → `431894bc`; refactor `2f28f62c` |
| R3 | `src/app/__tests__/layout.test.tsx::#118 R3: RootStack declara welcome bajo su propia guarda › declara welcome como sexto hijo bajo Stack.Protected` (+ `toHaveLength(5 + 1)` en `#95 R2`) | `a7c3a656` → `431894bc`; refactor `2f28f62c` |
| R4 | `src/screens/welcome/index.test.tsx::R4 › con sesión redirige a home y no pinta la pantalla` | `a7c3a656` → `431894bc` |
| R5 | `src/screens/welcome/index.test.tsx::R5 › aplica las dimensiones del grupo sin tab bar` | `a7c3a656` → `431894bc` |
| R5 | `src/screens/welcome/index.test.tsx::R5 › apila los siete bloques en orden` | `a7c3a656` → `431894bc` |
| R5 | `src/screens/welcome/index.test.tsx::R5 › pinta hero, marca, tagline y legal con sus clases` | `a7c3a656` → `431894bc` |
| R6 | `src/screens/welcome/index.test.tsx::R6 › asigna el testID de cada chip` (fila 1) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › aplica la misma clase a cada chip` (fila 2) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › pinta el icono de cada chip` (fila 3) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › usa iconos de 14 puntos` (fila 4) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › resuelve la tinta accent-strong de cada icono` (fila 5) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › resuelve la etiqueta de cada chip por su clave` (fila 6) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › aplica la clase de tinta a cada etiqueta` (fila 7) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › ordena GPS, Salud y Nutrición` (fila 8) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › deja dos hijos por chip, icono y etiqueta` (fila 9) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › deja cada chip sin pulsación ni rol de botón` (fila 10) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › recorre WELCOME_CHIPS con map y comparte la clase de etiqueta` (fila 11) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R6 | `src/screens/welcome/index.test.tsx::R6 › contiene exactamente tres chips` (fila 12) | `f5ebec6c` (nace verde; sonda R6 documentada) |
| R7 | `src/screens/welcome/index.test.tsx::R7 › empuja a registro sin reemplazar` | `a81147d9` (nace verde; sonda R7 documentada) |
| R7 | `src/screens/welcome/index.test.tsx::R7 › es el botón primario del repo` | `a81147d9` (nace verde; sonda R7 documentada) |
| R7 | `src/__tests__/consistency-classnames.test.ts::#62 R1 › deja todos los botones primarios sólidos en un único radio` (+1) y `#98 R10` (+1) | `431894bc` (cascadas del verde de T3) |
| R8 | `src/screens/welcome/index.test.tsx::R8 › empuja a login sin reemplazar` | `2a4f2376` (nace verde; sonda R8 documentada) |
| R8 | `src/screens/welcome/index.test.tsx::R8 › es un botón hueco con tinta accent-strong` | `2a4f2376` (nace verde; sonda R8 documentada) |
| R9 | `src/screens/welcome/index.test.tsx::R9 › muestra el copy en español` | `a7c3a656` → `431894bc` |
| R9 | `src/screens/welcome/index.test.tsx::R9 › muestra el copy en inglés` | `a7c3a656` → `431894bc` |
| R10 | `src/screens/welcome/index.test.tsx::R10 › fija la duración y la curva` | `58961dcf` → `fecffd30`; refactor `80250ef2` |
| R10 | `src/screens/welcome/index.test.tsx::R10 › arranca invisible y desplazado sin Reduce Motion` | `58961dcf` → `fecffd30`; refactor `80250ef2` |
| R10 | `src/screens/welcome/index.test.tsx::R10 › termina visible y en su sitio sin Reduce Motion` | `58961dcf` → `fecffd30`; refactor `80250ef2` |
| R10 | `src/screens/welcome/index.test.tsx::R10 › con Reduce Motion no se desplaza` | `58961dcf` → `fecffd30`; refactor `80250ef2` |
| R11 | `src/__tests__/design-drift.test.ts::#118 R11: la bienvenida no mete drift de estilo › mantiene sus ficheros sin escapes de estilo literales` | `cffe227f` (nace verde; sonda R11 documentada) |
| R11 | `src/__tests__/legibility-classnames.test.ts::#61 R4 › screens/welcome/index.tsx pinta con text-accent-strong (2)` (+2 en la suma) | `cffe227f` (nace verde; sonda R11 documentada) |
| R12 | reviewer: `git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` vacío | `80250ef2`: diff medido vacío; revisión humana en T11 |
| R13 | humano: S1–S8 en dev build de Android (casillas en `requirements.md`) | pendiente |

### Commits en orden

```text
81ac3fb9 test(mobile): lock the catalog length for the welcome keys (#118 R1)
01b340fd feat(mobile): add the welcome copy in both languages (#118 R1)
c5b6b0be test(mobile): expect the unauthenticated redirect to welcome (#118 R2)
14c389c1 feat(mobile): redirect unauthenticated sessions to welcome (#118 R2)
a7c3a656 test(mobile): lock the welcome screen tree and route (#118 R3, R4, R5, R9)
431894bc feat(mobile): add the welcome screen under its own guard (#118 R3, R4, R5, R9)
2f28f62c refactor(mobile): remove the missing-screen test fallback (#118 R3)
f5ebec6c test(mobile): lock the three welcome chips (#118 R6)
a81147d9 test(mobile): lock the primary welcome CTA (#118 R7)
2a4f2376 test(mobile): lock the secondary welcome CTA (#118 R8)
58961dcf test(mobile): lock the welcome entrance and reduce motion (#118 R10)
fecffd30 feat(mobile): animate the welcome entrance once (#118 R10)
cf9407ad test(mobile): add welcome to the copy usage table and screen list (#118 R1)
fa75f06a test(mobile): count welcome among the scanned screens (#118 R1)
cffe227f test(mobile): guard the welcome files against style drift (#118 R11)
80250ef2 refactor(mobile): use compiler-safe shared values (#118 R10)
docs(mobile): trace #118 R1-R12 to their tests and commits (este commit documental)
```

El commit documental de cierre lleva exclusivamente traceability.md y este
impl. Su hash se obtiene con git log -1; no se referencia a sí mismo aquí.

### Decisiones de implementación no fijadas literalmente

- El arnés conserva HeroUINativeProvider y LanguageProvider reales. El mock
  parcial de Button/Label expone las clases declaradas por la pantalla antes
  de las clases internas de HeroUI; permite fijar las clases exactas R5/R7/R8.
- En el rojo T3, un componente vacío y la lectura de fuente con fallback
  permitieron fallar por consultas/aserciones antes de crear los dos ficheros,
  sin imports rotos. Tras el verde se retiraron en el refactor 2f28f62c.
- Solo la opacidad usa ReduceMotion.Never: el valor System por defecto de
  withTiming salta al destino en dispositivos con Reduce Motion, mientras R10
  exige conservar el fundido. La traslación nace en 0 y no se anima en ese caso.
- La API .get()/.set(), ya usada en el repo y descrita por animate-expo, cumple
  react-hooks/immutability sin desactivar la regla ni alterar el movimiento.
- Los títulos de los doce it R6 nombran las filas de la tabla; las filas sin
  título literal en la spec se expresan con la decisión concreta que verifican.

No se reabrió ninguna decisión de diseño aprobada. No se ejecutó init.sh,
no se tocaron otros worktrees ni infraestructura, y no se hizo push ni PR.

### Ficheros finales contra H0

Comando ejecutado desde /home/claude/sites/Pet-Tracker-wt-118:

```bash
git diff --name-only 69847c4f HEAD > /tmp/118-final-files.log; echo "exit=$?"
```

```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/__tests__/index.test.tsx
mobile-pet-tracker/src/app/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/_layout.tsx
mobile-pet-tracker/src/app/index.tsx
mobile-pet-tracker/src/app/welcome.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/welcome/index.test.tsx
mobile-pet-tracker/src/screens/welcome/index.tsx
progress/impl_mobile-welcome-splash.md
specs/mobile-ui-language/design.md
specs/mobile-welcome-splash/traceability.md
exit=0
```

17 ficheros: exactamente los 16 de design.md §1.2 más traceability.md.

### Delta final por fichero (+ / − líneas respecto de H0)

La tabla incluye estas líneas de cierre en el informe.

| Fichero | Añadidas | Eliminadas |
| --- | ---: | ---: |
| mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts | 2 | 2 |
| mobile-pet-tracker/src/__tests__/design-drift.test.ts | 17 | 0 |
| mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts | 5 | 1 |
| mobile-pet-tracker/src/__tests__/ui-copy-table.ts | 13 | 0 |
| mobile-pet-tracker/src/__tests__/ui-language.test.ts | 9 | 1 |
| mobile-pet-tracker/src/app/__tests__/index.test.tsx | 2 | 2 |
| mobile-pet-tracker/src/app/__tests__/layout.test.tsx | 23 | 1 |
| mobile-pet-tracker/src/app/_layout.tsx | 3 | 0 |
| mobile-pet-tracker/src/app/index.tsx | 1 | 1 |
| mobile-pet-tracker/src/app/welcome.tsx | 5 | 0 |
| mobile-pet-tracker/src/i18n/catalog.ts | 16 | 0 |
| mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx | 2 | 1 |
| mobile-pet-tracker/src/screens/welcome/index.test.tsx | 341 | 0 |
| mobile-pet-tracker/src/screens/welcome/index.tsx | 97 | 0 |
| progress/impl_mobile-welcome-splash.md | 2546 | 0 |
| specs/mobile-ui-language/design.md | 13 | 0 |
| specs/mobile-welcome-splash/traceability.md | 38 | 27 |

```text
$ git status --short
(salida vacía)
$ git branch --show-current
feature/118-mobile-welcome-splash
```

El último commit contiene exclusivamente specs/mobile-welcome-splash/traceability.md
y progress/impl_mobile-welcome-splash.md. Se incorporó a ese mismo commit
la salida de verificación de HEAD; ningún hash de implementación cambió.

## Ronda 2 — Enmienda E1–E5

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-118
$ git branch --show-current
feature/118-mobile-welcome-splash
$ git rev-parse --short HEAD
4ff4c247
$ git status --short
(salida vacía)
$ git log -1 --format=%s
docs(specs): firma de la Enmienda E1-E5 de #118 (gate Notion)
```

H0 de esta ronda = `4ff4c247`, commit de firma de la Enmienda E1–E5.
Branch correcta y árbol inicialmente limpio. Los diffs de alcance de esta
ronda se miden contra este H0. Se conserva íntegra la ronda 1.

### Skills y lecturas de la ronda 2

Skills cargadas:
- building-native-ui: /home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md.
- animate-expo: .agents/skills/animate-expo/SKILL.md.

Leídos requirements.md (incluida Enmienda E1–E5), design.md, tasks.md/T12,
review_mobile-welcome-splash.md (E1–E5), mobile-pet-tracker/AGENTS.md y
el precedente food.test.tsx para jest.requireActual tipado. La enmienda
firmada fija las aserciones; no se reabre el diseño.

### Anclas de entrada (desde mobile-pet-tracker/)

```text
$ grep -cF -- '- [x] Enmienda E1–E5 aprobada por humano' ../specs/mobile-welcome-splash/requirements.md
1
$ grep -cF "expect(WELCOME_ENTRANCE_EASING).toBeDefined();" src/screens/welcome/index.test.tsx
1
$ grep -cF "toHaveAnimatedStyle({" src/screens/welcome/index.test.tsx
5
$ grep -cF "shouldMatchAllProps" src/screens/welcome/index.test.tsx
0
$ grep -cF "testUri" src/screens/welcome/index.test.tsx
0
$ grep -cF "expect(chip.props.onPress).toBeUndefined();" src/screens/welcome/index.test.tsx
1
$ grep -cF "it('pinta hero, marca, tagline y legal con sus clases'" src/screens/welcome/index.test.tsx
1
$ grep -cF "it('deja cada chip sin pulsación ni rol de botón'" src/screens/welcome/index.test.tsx
1
$ grep -cF "it('fija la duración y la curva'" src/screens/welcome/index.test.tsx
1
$ grep -cF "require('../../../assets/images/splash-icon.png')" src/screens/welcome/index.tsx
1
$ grep -cF "duration: WELCOME_ENTRANCE_MS," src/screens/welcome/index.tsx
2
$ grep -cF "easing: WELCOME_ENTRANCE_EASING," src/screens/welcome/index.tsx
2
$ grep -cF "reduceMotion: ReduceMotion.Never" src/screens/welcome/index.tsx
1
$ test -e assets/images/logo-glow.png; echo "exit=$?"
exit=0
```

Las catorce anclas coinciden. La aprobación humana está marcada.

### Base de ronda 2 — ocho suites

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/welcome/index.test.tsx > /tmp/118-r2-base-jest.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/welcome/index.test.tsx (5.114 s)
Test Suites: 8 passed, 8 total
Tests:       251 passed, 251 total
Snapshots:   0 total
Time:        5.622 s
exit=0
```

### Base de ronda 2 — typecheck y lint

Desde mobile-pet-tracker/, sin pipe:

```text
$ test ! -e .expo/types/router.d.ts; echo "guard_exit=$?"
guard_exit=0
$ bun run typecheck > /tmp/118-r2-base-typecheck.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
$ bun run lint > /tmp/118-r2-base-lint.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

También se leyó la [referencia de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
que exige mobile-pet-tracker/AGENTS.md, antes de escribir las aserciones.

### E5 — candado del hero nace verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-e5-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.58 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.762 s, estimated 6 s
exit=0
```

Comprobación del commit (solo su fichero):

```text
$ git diff --cached --name-only
mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

Commit: `3932781d test(mobile): lock the welcome hero source (#118 R5, E5)`.

### Mutación M8 (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..2106ac95 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -70,7 +70,7 @@ export function WelcomeScreen() {
       <Animated.View testID="welcome-content" style={[entranceStyle, { alignItems: 'center', gap: 16 }]}>
         <Image
           testID="welcome-hero"
-          source={require('../../../assets/images/splash-icon.png')}
+          source={require('../../../assets/images/logo-glow.png')}
           style={{ width: 160, height: 160 }}
           contentFit="contain"
         />
```

### Sonda M8 — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m8.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.301 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.445 s, estimated 6 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R5 › pinta hero, marca, tagline y legal con sus clases

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Array [
    -   ObjectContaining {
    -     "testUri": StringMatching /assets\/images\/splash-icon\.png$/,
    +   Object {
    +     "testUri": "../../../assets/images/logo-glow.png",
        },
      ]

      144 |     expect(screen.getByTestId('welcome-hero').props.contentFit).toBe('contain');
      145 |     expect(screen.getByTestId('welcome-hero').props.style).toEqual({ width: 160, height: 160 });
    > 146 |     expect(screen.getByTestId('welcome-hero').props.source).toEqual([expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/splash-icon\.png$/) })]);
          |                                                             ^
      147 |   });
      148 | });
      149 |

      at Object.toEqual (src/screens/welcome/index.test.tsx:146:61)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Solo caen los it declarados, por la causa prevista.

Restauración:

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda M8 — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m8-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.053 s, estimated 6 s
exit=0
```

### E4 — chip no pulsable nace verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-e4-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.283 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.431 s
exit=0
```

Comprobación del commit (solo su fichero):

```text
$ git diff --cached --name-only
mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

Commit: `3eff471b test(mobile): reject a pressable welcome chip (#118 R6, E4)`.

### Mutación S15B (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..dde23224 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -2,7 +2,7 @@ import { Image } from 'expo-image';
 import { Redirect, router } from 'expo-router';
 import { Button } from 'heroui-native';
 import { useEffect } from 'react';
-import { ScrollView, Text, View } from 'react-native';
+import { Pressable, ScrollView, Text, View } from 'react-native';
 import Animated, {
   Easing,
   ReduceMotion,
@@ -77,10 +77,10 @@ export function WelcomeScreen() {
         <Text testID="welcome-brand" className="text-3xl font-bold text-foreground">{t('welcome.brand')}</Text>
         <View testID="welcome-chips" className="flex-row justify-center gap-2">
           {WELCOME_CHIPS.map(({ testID, Icon, labelKey }) => (
-            <View key={testID} testID={testID} className="flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5">
+            <Pressable key={testID} testID={testID} onPress={() => {}} className="flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5">
               <Icon size={14} color={chipInk} />
               <Text className="text-xs font-semibold text-accent-strong">{t(labelKey)}</Text>
-            </View>
+            </Pressable>
           ))}
         </View>
         <Text testID="welcome-tagline" className="text-center text-base text-muted">{t('welcome.tagline')}</Text>
```

### Sonda S15B — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-s15b.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.917 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        6.094 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R6 › deja cada chip sin pulsación ni rol de botón

    expect(received).toBeUndefined()

    Received: [Function onClick]

      245 |     chips.forEach((chip) => {
      246 |       expect(chip.props.onPress).toBeUndefined();
    > 247 |       expect(chip.props.onClick).toBeUndefined();
          |                                  ^
      248 |       expect(chip.props.accessible).toBeUndefined();
      249 |       expect(chip.props.accessibilityRole).not.toBe('button');
      250 |     });

      at toBeUndefined (src/screens/welcome/index.test.tsx:247:34)
          at Array.forEach (<anonymous>)
      at Object.forEach (src/screens/welcome/index.test.tsx:245:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Solo caen los it declarados, por la causa prevista.

Restauración:

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda S15B — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-s15b-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.015 s, estimated 6 s
exit=0
```

S15b: primera aserción que falla = props.onClick toBeUndefined();
Expected = undefined; Received = [Function onClick]. No llega a accessible.

### E1/E2 — detalle de implementación de los recuentos

Se copian literalmente la referencia, los nueve puntos y las tres regex
normativas de R10. Cada source.match usa ?? [] para representar cero
coincidencias con un array vacío: así M1/M3 dan Received length: 0,
como exige la tabla de sondas, en lugar de un error de matcher sobre null.
No cambia ninguna regex, literal de referencia, espera ni mock.

### E1/E2 — curva y cableado nacen verdes

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-e1-e2-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.348 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.488 s
exit=0
```

Comprobación del commit (solo su fichero):

```text
$ git diff --cached --name-only
mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

Commit: `c5bc8da1 test(mobile): bind the welcome entrance timing to its constants (#118 R10, E1, E2)`.

### Mutación M1 (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..b3055550 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -42,14 +42,14 @@ export function WelcomeScreen() {
 
   useEffect(() => {
     opacity.set(withTiming(1, {
-      duration: WELCOME_ENTRANCE_MS,
+      duration: 400,
       easing: WELCOME_ENTRANCE_EASING,
       // Reduce Motion keeps this fade while removing the spatial motion below.
       reduceMotion: ReduceMotion.Never,
     }));
     if (!reduceMotion) {
       translateY.set(withTiming(0, {
-        duration: WELCOME_ENTRANCE_MS,
+        duration: 400,
         easing: WELCOME_ENTRANCE_EASING,
       }));
     }
```

### Sonda M1 — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m1.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.383 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.536 s, estimated 6 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 0
    Received array:  []

      311 |     }
      312 |     const source = readSource('screens/welcome/index.tsx');
    > 313 |     expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);
          |                                                                                                      ^
      314 |     expect(source.match(/\b(duration|easing):/g) ?? []).toHaveLength(4);
      315 |     expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);
      316 |   });

      at Object.toHaveLength (src/screens/welcome/index.test.tsx:313:102)


```

Solo caen los it declarados, por la causa prevista.

Restauración:

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda M1 — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m1-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.101 s, estimated 6 s
exit=0
```

### Mutación M11 (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..89004203 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -43,7 +43,7 @@ export function WelcomeScreen() {
   useEffect(() => {
     opacity.set(withTiming(1, {
       duration: WELCOME_ENTRANCE_MS,
-      easing: WELCOME_ENTRANCE_EASING,
+      easing: Easing.linear,
       // Reduce Motion keeps this fade while removing the spatial motion below.
       reduceMotion: ReduceMotion.Never,
     }));
```

### Sonda M11 — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m11.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.217 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.36 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 1
    Received array:  ["duration: WELCOME_ENTRANCE_MS,
            easing: WELCOME_ENTRANCE_EASING,"]

      311 |     }
      312 |     const source = readSource('screens/welcome/index.tsx');
    > 313 |     expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);
          |                                                                                                      ^
      314 |     expect(source.match(/\b(duration|easing):/g) ?? []).toHaveLength(4);
      315 |     expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);
      316 |   });

      at Object.toHaveLength (src/screens/welcome/index.test.tsx:313:102)


```

Solo caen los it declarados, por la causa prevista.

Restauración:

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda M11 — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m11-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        4.85 s, estimated 6 s
exit=0
```

### Mutación M2 (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..817f25ea 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -19,7 +19,7 @@ import { useTranslate } from '../../providers/language-provider';
 import { useThemeColors } from '../../theme/use-theme-colors';
 
 export const WELCOME_ENTRANCE_MS = 240;
-export const WELCOME_ENTRANCE_EASING = Easing.bezier(0.23, 1, 0.32, 1);
+export const WELCOME_ENTRANCE_EASING = Easing.linear;
 
 const WELCOME_CHIPS = [
   { testID: 'welcome-chip-gps', Icon: Map, labelKey: 'welcome.chipGps' },
```

### Sonda M2 — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m2.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.572 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.74 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    TypeError: _index.WELCOME_ENTRANCE_EASING.factory is not a function

      308 |     const expected = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated').Easing.bezier(0.23, 1, 0.32, 1).factory();
      309 |     for (const point of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
    > 310 |       expect(WELCOME_ENTRANCE_EASING.factory()(point)).toBeCloseTo(expected(point), 6);
          |                                      ^
      311 |     }
      312 |     const source = readSource('screens/welcome/index.tsx');
      313 |     expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);

      at Object.factory (src/screens/welcome/index.test.tsx:310:38)


```

PARADA: it, causa o cuentas fuera de la tabla de sondas.

La marca automática de PARADA anterior era del verificador del registro:
comparaba la cadena TypeError sin el prefijo `_index.` de Babel.
El rojo real M2 coincide con la tabla: únicamente R10 › fija la duración y
la curva, 1 rojo / 27 verdes / 28 total, por
`TypeError: _index.WELCOME_ENTRANCE_EASING.factory is not a function`.
Se admite ese prefijo en el verificador externo; ninguna aserción, mock o
producción permanente cambia. No llegaron a ejecutarse M2b/M3/M4 antes de
esta restauración.

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda M2 — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m2-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.12 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.333 s, estimated 6 s
exit=0
```

### Mutación M2B (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..6511eef2 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -19,7 +19,7 @@ import { useTranslate } from '../../providers/language-provider';
 import { useThemeColors } from '../../theme/use-theme-colors';
 
 export const WELCOME_ENTRANCE_MS = 240;
-export const WELCOME_ENTRANCE_EASING = Easing.bezier(0.23, 1, 0.32, 1);
+export const WELCOME_ENTRANCE_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);
 
 const WELCOME_CHIPS = [
   { testID: 'welcome-chip-gps', Icon: Map, labelKey: 'welcome.chipGps' },
```

### Sonda M2B — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m2b.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.043 s, estimated 6 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    expect(received).toBeCloseTo(expected, precision)

    Expected: 0.39812410465104964
    Received: 0.09479630571604326

    Expected precision:    6
    Expected difference: < 0.0000005
    Received difference:   0.3033277989350064

      308 |     const expected = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated').Easing.bezier(0.23, 1, 0.32, 1).factory();
      309 |     for (const point of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
    > 310 |       expect(WELCOME_ENTRANCE_EASING.factory()(point)).toBeCloseTo(expected(point), 6);
          |                                                        ^
      311 |     }
      312 |     const source = readSource('screens/welcome/index.tsx');
      313 |     expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);

      at Object.toBeCloseTo (src/screens/welcome/index.test.tsx:310:56)


```

Solo caen los it declarados, por la causa prevista.

Restauración:

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda M2B — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m2b-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        4.701 s, estimated 5 s
exit=0
```

### Mutación M3 (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..21b50957 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -45,7 +45,6 @@ export function WelcomeScreen() {
       duration: WELCOME_ENTRANCE_MS,
       easing: WELCOME_ENTRANCE_EASING,
       // Reduce Motion keeps this fade while removing the spatial motion below.
-      reduceMotion: ReduceMotion.Never,
     }));
     if (!reduceMotion) {
       translateY.set(withTiming(0, {
```

### Sonda M3 — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m3.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.155 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.295 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      313 |     expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);
      314 |     expect(source.match(/\b(duration|easing):/g) ?? []).toHaveLength(4);
    > 315 |     expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);
          |                                                                      ^
      316 |   });
      317 |
      318 |   it('arranca invisible y desplazado sin Reduce Motion', async () => {

      at Object.toHaveLength (src/screens/welcome/index.test.tsx:315:70)


```

Solo caen los it declarados, por la causa prevista.

Restauración:

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda M3 — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m3-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        4.722 s, estimated 6 s
exit=0
```

### Mutación M4 (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..9fd9dfd6 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -42,7 +42,7 @@ export function WelcomeScreen() {
 
   useEffect(() => {
     opacity.set(withTiming(1, {
-      duration: WELCOME_ENTRANCE_MS,
+      duration: reduceMotion ? 0 : WELCOME_ENTRANCE_MS,
       easing: WELCOME_ENTRANCE_EASING,
       // Reduce Motion keeps this fade while removing the spatial motion below.
       reduceMotion: ReduceMotion.Never,
```

### Sonda M4 — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m4.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.475 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.635 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 1
    Received array:  ["duration: WELCOME_ENTRANCE_MS,
            easing: WELCOME_ENTRANCE_EASING,"]

      311 |     }
      312 |     const source = readSource('screens/welcome/index.tsx');
    > 313 |     expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);
          |                                                                                                      ^
      314 |     expect(source.match(/\b(duration|easing):/g) ?? []).toHaveLength(4);
      315 |     expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);
      316 |   });

      at Object.toHaveLength (src/screens/welcome/index.test.tsx:313:102)


```

Solo caen los it declarados, por la causa prevista.

Restauración:

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda M4 — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m4-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.056 s, estimated 6 s
exit=0
```

Primera aserción que para cada sonda E1/E2:

| Sonda | Primera aserción / error | Expected | Received |
| --- | --- | --- | --- |
| M1 | regex de cableado, toHaveLength | 2 | 0 |
| M11 | regex de cableado, toHaveLength | 2 | 1 |
| M2 | TypeError en WELCOME_ENTRANCE_EASING.factory() | error declarado | _index.WELCOME_ENTRANCE_EASING.factory is not a function |
| M2b | primer punto (0.1), toBeCloseTo a 6 decimales | 0.39812410465104964 | 0.09479630571604326 |
| M3 | regex ReduceMotion.Never, toHaveLength | 1 | 0 |
| M4 | regex de cableado, toHaveLength | 2 | 1 |

M1/M11/M4 no llegan a las dos regex posteriores. M3 sí supera la regex
de cableado (2) y el total duration/easing (4), y cae en ReduceMotion.Never.

### E3 — comparación completa de estilos nace verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-e3-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.432 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.602 s
exit=0
```

Comprobación del commit (solo su fichero):

```text
$ git diff --cached --name-only
mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

Commit: `7c86fcad test(mobile): match every animated welcome style key (#118 R10, E3)`.

### Mutación M6 (sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..69aff84d 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -37,6 +37,7 @@ export function WelcomeScreen() {
   const translateY = useSharedValue(reduceMotion ? 0 : 16);
   const entranceStyle = useAnimatedStyle(() => ({
     opacity: opacity.get(),
+    marginTop: translateY.get(),
     transform: [{ translateY: translateY.get() }],
   }));
 
```

### Sonda M6 — rojo

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m6.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.257 s)
Test Suites: 1 failed, 1 total
Tests:       3 failed, 25 passed, 28 total
Snapshots:   0 total
Time:        5.418 s, estimated 6 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › arranca invisible y desplazado sin Reduce Motion

    Expected: {"alignItems":"center","gap":16,"opacity":0,"transform":[{"translateY":16}]}
    Received: {"opacity":0,"marginTop":16,"transform":[{"translateY":16}],"alignItems":"center","gap":16}

    Differences:
    - 'marginTop' should be undefined, but is 16

      318 |   it('arranca invisible y desplazado sin Reduce Motion', async () => {
      319 |     await renderWelcome();
    > 320 |     expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
          |                                                   ^
      321 |       alignItems: 'center', gap: 16,
      322 |       opacity: 0, transform: [{ translateY: 16 }],
      323 |     }, { shouldMatchAllProps: true });

      at Object.toHaveAnimatedStyle (src/screens/welcome/index.test.tsx:320:51)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R10 › termina visible y en su sitio sin Reduce Motion

    Expected: {"alignItems":"center","gap":16,"opacity":0,"transform":[{"translateY":16}]}
    Received: {"opacity":0,"marginTop":16,"transform":[{"translateY":16}],"alignItems":"center","gap":16}

    Differences:
    - 'marginTop' should be undefined, but is 16

      326 |   it('termina visible y en su sitio sin Reduce Motion', async () => {
      327 |     await renderWelcome();
    > 328 |     expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
          |                                                   ^
      329 |       alignItems: 'center', gap: 16,
      330 |       opacity: 0, transform: [{ translateY: 16 }],
      331 |     }, { shouldMatchAllProps: true });

      at Object.toHaveAnimatedStyle (src/screens/welcome/index.test.tsx:328:51)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


  ● R10 › con Reduce Motion no se desplaza

    Expected: {"alignItems":"center","gap":16,"opacity":0,"transform":[{"translateY":0}]}
    Received: {"opacity":0,"marginTop":0,"transform":[{"translateY":0}],"alignItems":"center","gap":16}

    Differences:
    - 'marginTop' should be undefined, but is 0

      342 |     mockUseReducedMotion.mockReturnValue(true);
      343 |     await renderWelcome();
    > 344 |     expect(screen.getByTestId('welcome-content')).toHaveAnimatedStyle({
          |                                                   ^
      345 |       alignItems: 'center', gap: 16,
      346 |       opacity: 0, transform: [{ translateY: 0 }],
      347 |     }, { shouldMatchAllProps: true });

      at Object.toHaveAnimatedStyle (src/screens/welcome/index.test.tsx:344:51)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Solo caen los it declarados, por la causa prevista.

Restauración:

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Sonda M6 — verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-m6-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.087 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.266 s, estimated 6 s
exit=0
```

### Anclas de cierre de ronda 2 (desde mobile-pet-tracker/)

```text
$ grep -cF "expect(WELCOME_ENTRANCE_EASING).toBeDefined();" src/screens/welcome/index.test.tsx
0
$ grep -cF "shouldMatchAllProps: true" src/screens/welcome/index.test.tsx
5
$ grep -cF "testUri" src/screens/welcome/index.test.tsx
1
$ grep -cF "chip.props.onClick" src/screens/welcome/index.test.tsx
1
$ grep -cF "chip.props.accessible" src/screens/welcome/index.test.tsx
1
$ grep -cF "reduceMotion: ReduceMotion\.Never" src/screens/welcome/index.test.tsx
1
```

Validado contra H0: imports y mocks idénticos; los 28 títulos de it y
los describes conservados; las dos ventanas WELCOME_ENTRANCE_MS * 2 + 100
intactas. No se añadió ni quitó ningún it ni se movió ningún candado global.

```text
$ git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
(salida vacía)
exit=0
```

```text
$ git diff 4ff4c247 HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx
(salida vacía)
exit=0
```

```text
$ git diff 4ff4c247 -- mobile-pet-tracker/app.json
(salida vacía)
exit=0
```

### Cierre de ronda 2 — ocho suites

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/welcome/index.test.tsx > /tmp/118-r2-final-jest.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/welcome/index.test.tsx (8.584 s)
Test Suites: 8 passed, 8 total
Tests:       251 passed, 251 total
Snapshots:   0 total
Time:        9.502 s
exit=0
```

### Cierre de ronda 2 — typecheck y lint

Desde mobile-pet-tracker/, sin pipe:

```text
$ test ! -e .expo/types/router.d.ts; echo "guard_exit=$?"
guard_exit=0
$ bun run typecheck > /tmp/118-r2-final-typecheck.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
$ bun run lint > /tmp/118-r2-final-lint.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

### Resumen de ronda 2 y commits

| Enmienda | Commit | Sondas |
| --- | --- | --- |
| E5 / R5 | 3932781d | M8 |
| E4 / R6 fila 10 | 3eff471b | S15b |
| E1, E2 / R10 | c5bc8da1 | M1, M11, M2, M2b, M3, M4 |
| E3 / R10 | 7c86fcad | M6 |

```text
3932781d test(mobile): lock the welcome hero source (#118 R5, E5)
3eff471b test(mobile): reject a pressable welcome chip (#118 R6, E4)
c5bc8da1 test(mobile): bind the welcome entrance timing to its constants (#118 R10, E1, E2)
7c86fcad test(mobile): match every animated welcome style key (#118 R10, E3)
docs(mobile): trace the #118 round 2 locks to their commits (este commit documental)
```

Base y cierre: ocho suites / 251 tests / exit=0. Welcome conserva 28 it;
las demás suites conservan sus cuentas: index 3, layout 26,
language-provider 22, ui-language 30, consistency 55, legibility 27,
design-drift 60. Delta de tests de esta ronda: 0 en todos los ficheros.

Nueve sondas sin commit: M8/S15b/M1/M11/M2/M2b/M3/M4 dan 1 rojo,
27 verdes, 28 total, exit=1; M6 da 3 rojos, 25 verdes, 28 total, exit=1.
Cada restauración da worktree_exit=0 e index_exit=0, y la siguiente
medición de welcome da 28/28, exit=0. No hubo otro it rojo ni otra causa.
El TypeError de M2 es el declarado; el incidente del verificador externo
por el prefijo _index. quedó resuelto sin tocar aserciones.

La trazabilidad solo añade la ronda 2 a las seis filas autorizadas: R5
(hero), R6 (fila 10), R10 (duración/curva y los tres it de estilo).
R13 y las casillas humanas siguen intactos. Los cuatro commits test llevan
solo index.test.tsx; el quinto documental lleva traceability.md y este impl,
según la excepción explícita del cierre del handoff de ronda 2.

Decisiones no fijadas literalmente: únicamente ?? [] en los recuentos de
source.match, para los Received 0 prescritos; detalle documentado arriba.
La referencia de curva, sus nueve puntos, regex y aserciones son los de la
Enmienda. No cambian títulos, mocks ni esperas. La producción se restauró
tras todas las sondas; su diff final contra H0 está vacío.

No se ejecutó init.sh ni se tocó infraestructura u otro worktree. Todos los
gates móviles usaron bun/bunx. No se añadieron dependencias ni se hizo push/PR.

Comprobación del commit 5 (solo documentación autorizada):

```text
$ git diff --cached --name-only
progress/impl_mobile-welcome-splash.md
specs/mobile-welcome-splash/traceability.md
```

### Alcance final de ronda 2 contra H0

```bash
git diff --name-only 4ff4c247 HEAD > /tmp/118-r2-final-files.log; echo "exit=$?"
```

```text
mobile-pet-tracker/src/screens/welcome/index.test.tsx
progress/impl_mobile-welcome-splash.md
specs/mobile-welcome-splash/traceability.md
exit=0
```

Dos ficheros de implementación/trazabilidad más este impl: exactamente los
tres autorizados. Se mantienen intactas todas las líneas de la ronda 1.

```text
$ git diff 4ff4c247 HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx
(salida vacía)
exit=0
$ git status --short
(salida vacía)
```

El resultado de HEAD se incorpora al mismo quinto commit documental, sin
cambiar los cuatro hashes de tests de esta ronda ni hacer rebase.

## Ronda 3 — Enmienda E6–E7

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-118
$ git branch --show-current
feature/118-mobile-welcome-splash
$ git rev-parse --short HEAD
595b20b2
$ git status --short
(salida vacía)
$ git log -1 --format=%s
docs(specs): firma de la Enmienda E6-E7 de #118 (gate Notion)
```

H0 de esta ronda = `595b20b2`, firma de la Enmienda E6–E7 y hash esperado
por el leader. Branch correcta y árbol inicialmente limpio. Los diffs de
alcance de esta ronda se miden contra H0. Se preservan las rondas 1 y 2.

### Skills y lecturas de la ronda 3

Se aplican building-native-ui (plugin expo, ya cargada desde
/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md)
y animate-expo (repo, .agents/skills/animate-expo/SKILL.md), cargadas en las
rondas anteriores. Se mantiene la referencia de Expo SDK 57 ya leída.

Leídos el bloque completo de ronda 3 del handoff, requirements.md (R6/R10,
Enmienda E6–E7 y aprobación), design.md (incluidas X1/X2/X7), tasks.md/T13,
y la review de ronda 2 (E6 y obs. 2). Las aserciones están cerradas.

### Anclas de entrada de ronda 3 (desde mobile-pet-tracker/)

```text
$ grep -cF -- '- [x] Enmienda E6–E7 aprobada por humano' ../specs/mobile-welcome-splash/requirements.md
1
$ grep -cF "expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);" src/screens/welcome/index.test.tsx
1
$ grep -cF '\breduceMotion:/g' src/screens/welcome/index.test.tsx
0
$ grep -cF 'opacity\.set\(withTiming' src/screens/welcome/index.test.tsx
0
$ grep -cF "chip.props.role" src/screens/welcome/index.test.tsx
0
$ grep -cF "expect(chip.props.accessibilityRole).not.toBe('button');" src/screens/welcome/index.test.tsx
1
$ grep -cF "it('fija la duración y la curva'" src/screens/welcome/index.test.tsx
1
$ grep -cF "it('deja cada chip sin pulsación ni rol de botón'" src/screens/welcome/index.test.tsx
1
$ grep -cF "reduceMotion: ReduceMotion.Never," src/screens/welcome/index.tsx
1
$ grep -cF "opacity.set(withTiming(1, {" src/screens/welcome/index.tsx
1
$ grep -cF "translateY.set(withTiming(0, {" src/screens/welcome/index.tsx
1
$ grep -cF "reduceMotion:" src/screens/welcome/index.tsx
1
$ grep -cE "^\s*it(\.each\(.*\))?\(" src/screens/welcome/index.test.tsx
28
$ grep -cF "ReduceMotion.Always" src/screens/welcome/index.tsx
0
```

Las catorce anclas coinciden; la Enmienda E6–E7 tiene aprobación humana.

### Base de ronda 3 — ocho suites

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/welcome/index.test.tsx > /tmp/118-r3-base-jest.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/welcome/index.test.tsx (5.096 s)
Test Suites: 8 passed, 8 total
Tests:       251 passed, 251 total
Snapshots:   0 total
Time:        5.566 s, estimated 6 s
exit=0
```

### Base de ronda 3 — typecheck y lint

Desde mobile-pet-tracker/, sin pipe:

```text
$ test ! -e .expo/types/router.d.ts; echo "guard_exit=$?"
guard_exit=0
$ bun run typecheck > /tmp/118-r3-base-typecheck.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
$ bun run lint > /tmp/118-r3-base-lint.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

### E6 — candado del fade nace verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-e6-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.453 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.599 s, estimated 6 s
exit=0
```

Comprobación del commit (solo su fichero):

```text
$ git diff --cached --name-only
mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

Commit: `e8300219 test(mobile): tie reduceMotion to the welcome fade (#118 R10, E6)`.

### Mutación X1 (ronda 3, sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..1bdae5bd 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -45,12 +45,12 @@ export function WelcomeScreen() {
       duration: WELCOME_ENTRANCE_MS,
       easing: WELCOME_ENTRANCE_EASING,
       // Reduce Motion keeps this fade while removing the spatial motion below.
-      reduceMotion: ReduceMotion.Never,
     }));
     if (!reduceMotion) {
       translateY.set(withTiming(0, {
         duration: WELCOME_ENTRANCE_MS,
         easing: WELCOME_ENTRANCE_EASING,
+        reduceMotion: ReduceMotion.Never,
       }));
     }
   }, [opacity, translateY, reduceMotion]);
```

### Ronda 3 — sonda X1 roja

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-x1.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.568 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.714 s, estimated 6 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    expect(received).toMatch(expected)

    Expected pattern: /opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/
    Received string:  "import { Image } from 'expo-image';
    import { Redirect, router } from 'expo-router';
    import { Button } from 'heroui-native';
    import { useEffect } from 'react';
    import { ScrollView, Text, View } from 'react-native';
    import Animated, {
      Easing,
      ReduceMotion,
      useAnimatedStyle,
      useReducedMotion,
      useSharedValue,
      withTiming,
    } from 'react-native-reanimated';
    import { useSafeAreaInsets } from 'react-native-safe-area-context';
    import { ForkKnife, Map, Stethoscope } from 'reicon-react-native';·
    import { useAuth } from '../../providers/auth-provider';
    import { useTranslate } from '../../providers/language-provider';
    import { useThemeColors } from '../../theme/use-theme-colors';·
    export const WELCOME_ENTRANCE_MS = 240;
    export const WELCOME_ENTRANCE_EASING = Easing.bezier(0.23, 1, 0.32, 1);·
    const WELCOME_CHIPS = [
      { testID: 'welcome-chip-gps', Icon: Map, labelKey: 'welcome.chipGps' },
      { testID: 'welcome-chip-health', Icon: Stethoscope, labelKey: 'welcome.chipHealth' },
      { testID: 'welcome-chip-nutrition', Icon: ForkKnife, labelKey: 'welcome.chipNutrition' },
    ] as const;·
    export function WelcomeScreen() {
      const { status } = useAuth();
      const t = useTranslate();
      const insets = useSafeAreaInsets();
      const [chipInk] = useThemeColors(['accent-strong']);
      const reduceMotion = useReducedMotion();
      const opacity = useSharedValue(0);
      const translateY = useSharedValue(reduceMotion ? 0 : 16);
      const entranceStyle = useAnimatedStyle(() => ({
        opacity: opacity.get(),
        transform: [{ translateY: translateY.get() }],
      }));·
      useEffect(() => {
        opacity.set(withTiming(1, {
          duration: WELCOME_ENTRANCE_MS,
          easing: WELCOME_ENTRANCE_EASING,
          // Reduce Motion keeps this fade while removing the spatial motion below.
        }));
        if (!reduceMotion) {
          translateY.set(withTiming(0, {
            duration: WELCOME_ENTRANCE_MS,
            easing: WELCOME_ENTRANCE_EASING,
            reduceMotion: ReduceMotion.Never,
          }));
        }
      }, [opacity, translateY, reduceMotion]);·
      if (status === 'authenticated') return <Redirect href=\"/home\" />;·
      return (
        <ScrollView
          testID=\"screen-welcome\"
          className=\"flex-1 bg-background\"
          contentInsetAdjustmentBehavior=\"automatic\"
          contentContainerStyle={{
            flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16,
            paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24,
          }}
        >
          <Animated.View testID=\"welcome-content\" style={[entranceStyle, { alignItems: 'center', gap: 16 }]}>
            <Image
              testID=\"welcome-hero\"
              source={require('../../../assets/images/splash-icon.png')}
              style={{ width: 160, height: 160 }}
              contentFit=\"contain\"
            />
            <Text testID=\"welcome-brand\" className=\"text-3xl font-bold text-foreground\">{t('welcome.brand')}</Text>
            <View testID=\"welcome-chips\" className=\"flex-row justify-center gap-2\">
              {WELCOME_CHIPS.map(({ testID, Icon, labelKey }) => (
                <View key={testID} testID={testID} className=\"flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5\">
                  <Icon size={14} color={chipInk} />
                  <Text className=\"text-xs font-semibold text-accent-strong\">{t(labelKey)}</Text>
                </View>
              ))}
            </View>
            <Text testID=\"welcome-tagline\" className=\"text-center text-base text-muted\">{t('welcome.tagline')}</Text>
            <Button testID=\"welcome-get-started\" className=\"w-full rounded-xl bg-accent\" onPress={() => router.push('/register')}>
              <Button.Label className=\"font-bold text-accent-foreground\">{t('welcome.getStarted')}</Button.Label>
            </Button>
            <Button testID=\"welcome-have-account\" className=\"w-full rounded-xl border border-accent bg-transparent\" onPress={() => router.push('/login')}>
              <Button.Label className=\"font-semibold text-accent-strong\">{t('welcome.haveAccount')}</Button.Label>
            </Button>
            <Text testID=\"welcome-legal\" className=\"text-center text-xs text-muted\">{t('welcome.legalNotice')}</Text>
          </Animated.View>
        </ScrollView>
      );
    }
    "

      315 |     expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);
      316 |     expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);
    > 317 |     expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);
          |                    ^
      318 |   });
      319 |
      320 |   it('arranca invisible y desplazado sin Reduce Motion', async () => {

      at Object.toMatch (src/screens/welcome/index.test.tsx:317:20)


```

Únicamente cae el it declarado, por la causa prevista.

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Ronda 3 — sonda X1 verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-x1-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        4.957 s, estimated 6 s
exit=0
```

### Mutación X2 (ronda 3, sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..46c498ad 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -51,6 +51,7 @@ export function WelcomeScreen() {
       translateY.set(withTiming(0, {
         duration: WELCOME_ENTRANCE_MS,
         easing: WELCOME_ENTRANCE_EASING,
+        reduceMotion: ReduceMotion.Always,
       }));
     }
   }, [opacity, translateY, reduceMotion]);
```

### Ronda 3 — sonda X2 roja

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-x2.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        4.919 s, estimated 5 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 2
    Received array:  ["reduceMotion:", "reduceMotion:"]

      314 |     expect(source.match(/\b(duration|easing):/g) ?? []).toHaveLength(4);
      315 |     expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);
    > 316 |     expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);
          |                                                    ^
      317 |     expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);
      318 |   });
      319 |

      at Object.toHaveLength (src/screens/welcome/index.test.tsx:316:52)


```

Únicamente cae el it declarado, por la causa prevista.

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Ronda 3 — sonda X2 verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-x2-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        4.871 s, estimated 5 s
exit=0
```

### Mutación M3 (ronda 3, sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..21b50957 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -45,7 +45,6 @@ export function WelcomeScreen() {
       duration: WELCOME_ENTRANCE_MS,
       easing: WELCOME_ENTRANCE_EASING,
       // Reduce Motion keeps this fade while removing the spatial motion below.
-      reduceMotion: ReduceMotion.Never,
     }));
     if (!reduceMotion) {
       translateY.set(withTiming(0, {
```

### Ronda 3 — sonda M3 roja

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-m3.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        4.829 s, estimated 5 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R10 › fija la duración y la curva

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      313 |     expect(source.match(/duration: WELCOME_ENTRANCE_MS,\s*easing: WELCOME_ENTRANCE_EASING,/g) ?? []).toHaveLength(2);
      314 |     expect(source.match(/\b(duration|easing):/g) ?? []).toHaveLength(4);
    > 315 |     expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);
          |                                                                      ^
      316 |     expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);
      317 |     expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);
      318 |   });

      at Object.toHaveLength (src/screens/welcome/index.test.tsx:315:70)


```

Únicamente cae el it declarado, por la causa prevista.

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Ronda 3 — sonda M3 verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-m3-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.095 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.27 s
exit=0
```

### E7 — candado de role del chip nace verde

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-e7-green.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.1 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.246 s, estimated 6 s
exit=0
```

Comprobación del commit (solo su fichero):

```text
$ git diff --cached --name-only
mobile-pet-tracker/src/screens/welcome/index.test.tsx
```

Commit: `5f6ebf76 test(mobile): reject a role=button welcome chip (#118 R6, E7)`.

### Mutación X7 (ronda 3, sin commit)

```diff
diff --git a/mobile-pet-tracker/src/screens/welcome/index.tsx b/mobile-pet-tracker/src/screens/welcome/index.tsx
index 2333efed..1f754e57 100644
--- a/mobile-pet-tracker/src/screens/welcome/index.tsx
+++ b/mobile-pet-tracker/src/screens/welcome/index.tsx
@@ -77,7 +77,7 @@ export function WelcomeScreen() {
         <Text testID="welcome-brand" className="text-3xl font-bold text-foreground">{t('welcome.brand')}</Text>
         <View testID="welcome-chips" className="flex-row justify-center gap-2">
           {WELCOME_CHIPS.map(({ testID, Icon, labelKey }) => (
-            <View key={testID} testID={testID} className="flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5">
+            <View key={testID} testID={testID} role="button" className="flex-row items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5">
               <Icon size={14} color={chipInk} />
               <Text className="text-xs font-semibold text-accent-strong">{t(labelKey)}</Text>
             </View>
```

### Ronda 3 — sonda X7 roja

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-x7.log 2>&1; echo "exit=$?"
```

```text
FAIL src/screens/welcome/index.test.tsx (5.294 s)
Test Suites: 1 failed, 1 total
Tests:       1 failed, 27 passed, 28 total
Snapshots:   0 total
Time:        5.456 s, estimated 6 s
exit=1
```

It rojos, matcher y Expected/Received (o error declarado):

```text
  ● R6 › deja cada chip sin pulsación ni rol de botón

    expect(received).toBeUndefined()

    Received: "button"

      248 |       expect(chip.props.accessible).toBeUndefined();
      249 |       expect(chip.props.accessibilityRole).not.toBe('button');
    > 250 |       expect(chip.props.role).toBeUndefined();
          |                               ^
      251 |     });
      252 |   });
      253 |

      at toBeUndefined (src/screens/welcome/index.test.tsx:250:31)
          at Array.forEach (<anonymous>)
      at Object.forEach (src/screens/welcome/index.test.tsx:245:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)


```

Únicamente cae el it declarado, por la causa prevista.

```text
$ git checkout HEAD -- src/screens/welcome/index.tsx
$ git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"
worktree_exit=0
$ git diff --cached --quiet; echo "index_exit=$?"
index_exit=0
```

### Ronda 3 — sonda X7 verde tras restaurar

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-x7-restored.log 2>&1; echo "exit=$?"
```

```text
PASS src/screens/welcome/index.test.tsx (5.26 s)
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.432 s, estimated 6 s
exit=0
```

### Anclas de cierre de ronda 3 (desde mobile-pet-tracker/)

```text
$ grep -cF "expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);" src/screens/welcome/index.test.tsx
1
$ grep -cF "expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);" src/screens/welcome/index.test.tsx
1
$ grep -cF "expect(chip.props.role).toBeUndefined();" src/screens/welcome/index.test.tsx
1
$ grep -cF "expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);" src/screens/welcome/index.test.tsx
1
$ grep -cE "^\s*it(\.each\(.*\))?\(" src/screens/welcome/index.test.tsx
28
```

```text
$ git diff origin/main -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock
(salida vacía)
exit=0
```

```text
$ git diff 595b20b2 HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx
(salida vacía)
exit=0
```

```text
$ git diff 595b20b2 -- mobile-pet-tracker/app.json
(salida vacía)
exit=0
```

### Cierre de ronda 3 — ocho suites

Desde mobile-pet-tracker/:

```bash
bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/welcome/index.test.tsx > /tmp/118-r3-final-jest.log 2>&1; echo "exit=$?"
```

```text
PASS src/__tests__/ui-language.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/providers/__tests__/language-provider.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/design-drift.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/screens/welcome/index.test.tsx (7.528 s)
Test Suites: 8 passed, 8 total
Tests:       251 passed, 251 total
Snapshots:   0 total
Time:        8.253 s
exit=0
```

### Cierre de ronda 3 — typecheck y lint

Desde mobile-pet-tracker/, sin pipe:

```text
$ test ! -e .expo/types/router.d.ts; echo "guard_exit=$?"
guard_exit=0
$ bun run typecheck > /tmp/118-r3-final-typecheck.log 2>&1; echo "exit=$?"
$ tsc --noEmit
exit=0
$ bun run lint > /tmp/118-r3-final-lint.log 2>&1; echo "exit=$?"
$ expo lint
exit=0
```

### Resumen de sondas y primeras aserciones que fallan

| Sonda | It rojo | Matcher / aserción | Expected | Received |
| --- | --- | --- | --- | --- |
| X1 | R10 › fija la duración y la curva | toMatch del fade | opacity.set(withTiming(1, objeto con ReduceMotion.Never)) | fuente con Never únicamente en translateY; no casa |
| X2 | R10 › fija la duración y la curva | recuento de \breduceMotion:, toHaveLength | 1 | 2 |
| M3 | R10 › fija la duración y la curva | recuento antiguo de ReduceMotion.Never, toHaveLength | 1 | 0 |
| X7 | R6 › deja cada chip sin pulsación ni rol de botón | props.role, toBeUndefined | undefined | "button" |

Los cuatro rojos: una suite / 1 rojo / 27 verdes / 28 total / exit=1.
En X1 pasan las tres regex de cableado y el nuevo recuento antes de caer
en toMatch. En X2 pasa el recuento antiguo de Never y se detiene en el
nuevo recuento, antes del toMatch. En M3 falla el recuento antiguo: no
llega a ninguna de las dos aserciones de E6. X7 cae únicamente en role.
No cayó otro it ni hubo otra causa de fallo.

Después de cada sonda: worktree_exit=0, index_exit=0 y nueva medición
verde de welcome (1 suite / 28 tests / exit=0), documentados arriba.
Ninguna mutación se commiteó.

### Tabla E → R → it → commit

| Enmienda | Requisito / it | Commit | Sondas |
| --- | --- | --- | --- |
| E6 | R10 › fija la duración y la curva | e8300219 | X1, X2, M3 |
| E7 | R6 fila 10 › deja cada chip sin pulsación ni rol de botón | 5f6ebf76 | X7 |

```text
e8300219 test(mobile): tie reduceMotion to the welcome fade (#118 R10, E6)
5f6ebf76 test(mobile): reject a role=button welcome chip (#118 R6, E7)
docs(mobile): trace the #118 round 3 locks to their commits (este commit documental)
```

Base y cierre: 8 suites / 251 tests / exit=0. Welcome conserva 28 it.
Cuentas de las otras siete suites conservadas: index 3, layout 26,
language-provider 22, ui-language 30, consistency 55, legibility 27 y
design-drift 60. Delta de tests: 0 en todos los ficheros.

Se comprobó que, al quitar solo las tres líneas nuevas del test, el fichero
coincide exactamente con H0. Por tanto, imports, mocks, títulos, describes,
esperas, ventanas de timers y aserciones anteriores permanecen intactos.
La producción no tiene diff contra H0; R12 y app.json tienen diff vacío.

Trazabilidad: únicamente las filas R6 (fila 10) y R10 (duración/curva)
reciben el hash de esta ronda. R13 y las casillas humanas siguen intactos.
Los dos commits test llevan solo index.test.tsx; el tercer commit lleva
traceability.md y este impl, como fija el bloque de ronda 3.

Decisiones no fijadas literalmente: ninguna. Se copiaron las tres líneas
normativas en los lugares indicados, sin modificar las que ya existían.
No se ejecutó init.sh ni se tocó infraestructura u otro worktree. Todos los
gates móviles usaron bun/bunx. No se hizo push ni PR.

Comprobación del commit 3 (solo documentación autorizada):

```text
$ git diff --cached --name-only
progress/impl_mobile-welcome-splash.md
specs/mobile-welcome-splash/traceability.md
```

### Alcance final de ronda 3 contra H0

```bash
git diff --name-only 595b20b2 HEAD > /tmp/118-r3-final-files.log; echo "exit=$?"
```

```text
mobile-pet-tracker/src/screens/welcome/index.test.tsx
progress/impl_mobile-welcome-splash.md
specs/mobile-welcome-splash/traceability.md
exit=0
```

Exactamente los tres ficheros autorizados. Se conservan íntegramente las
rondas 1 y 2; únicamente se añade esta sección al impl.

```text
$ git diff 595b20b2 HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx
(salida vacía)
exit=0
$ git status --short
(salida vacía)
```

## Cerrar sesión desde perfil

Al cerrar sesión desde el perfil, el usuario es redirigido a la pantalla de bienvenida (welcome).
La salida medida sobre HEAD se incorpora al mismo tercer commit documental.
No cambian los hashes de E6/E7 ni se hace rebase.
