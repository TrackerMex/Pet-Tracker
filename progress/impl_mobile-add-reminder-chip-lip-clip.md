# Implementación mobile-add-reminder-chip-lip-clip (#232)

Fecha: 2026-11-03. Implementador: Codex. **Implementación R1–R4 completada y verificada**; smoke G2 reservado al humano.

## Base y alcance

Worktree confirmado: `/home/claude/sites/Pet-Tracker-wt-232`.
Branch: `feature/232-mobile-add-reminder-chip-lip-clip`; destino de integración: `dev`.
Base de firma aprobada: `7bd8ba6cc7d90177783866050711ace5aa917766`.
Base corregida del diff final: **`67bb626cfba3213c6f67b529deddd018e2f43055`**, por instrucción explícita posterior del leader/humano en el chat.
HEAD de entrada: `67bb626cfba3213c6f67b529deddd018e2f43055`.
R1–R4 y enmienda #213 R5 aprobados en la spec. G2 sigue siendo del humano.

Orden de comprobación pedido por el handoff:

```sh
cd /home/claude/sites/Pet-Tracker-wt-232 && pwd && git branch --show-current && git log --oneline -4
```

```text
/home/claude/sites/Pet-Tracker-wt-232
feature/232-mobile-add-reminder-chip-lip-clip
67bb626c docs(progress): #232 codex handoff
7bd8ba6c chore(spec): firma delegada #232 (mandato del humano 2026-10-23, ampliado 2026-11-03)
d033ab94 docs(spec): #232 mobile-add-reminder-chip-lip-clip
bfc65ca6 Merge pull request #291 from TrackerMex/feature/222-r12-charter-n1
```

Desviación de orden: antes de leer el handoff, el primer comando fue `pwd; git status --short --branch` (solo lectura, árbol limpio). La orden literal del handoff se ejecutó después de leerlo; su salida está arriba. No se editó nada antes de T0.

## Documentos y skills cargadas

Leídos handoff completo, los cuatro ficheros de la spec, AGENTS raíz y móvil, progress/current.md, entrada #232 de feature_list.json, docs/architecture.md, docs/conventions.md, docs/ui-guidelines.md, docs/verification.md (verificación base y disciplina TDD), CHECKPOINTS.md y catálogo real de Codex en .claude/agents/leader.md.

Skills cargadas:

- `building-native-ui`: `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md` (nombre real del catálogo Codex, encontrado en la caché instalada).
- `ponytail`: `/home/claude/.codex/plugins/cache/ponytail/ponytail/5.3.3/skills/ponytail/SKILL.md`.
- `appllama-app-design-skill`: `.agents/skills/appllama-app-design-skill/SKILL.md`, exigida por la carta. Se aplican sus límites de docs/ui-guidelines.md: reglas locales primero; investigación de Appllama corresponde al leader y smoke Android al humano.

Consultada [documentación versionada de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) antes de escribir código, como pide mobile-pet-tracker/AGENTS.md.

**docs/conventions.md §Esperas sobre el árbol renderizado (líneas 331–337):** «La condición que termina una espera debe ser la misma observación que hacen las aserciones posteriores». En cada test nuevo: `await renderAddReminder(); await screen.findByTestId('title-input');`. No se espera a contadores de mocks; RNTL 14 con await.

## T0 — antes de editar

Todas las cuentas de «Hoy» coinciden. Cada cuenta se obtuvo ejecutando `grep -cF` desde mobile-pet-tracker/ (exit 1 para una cuenta 0 es el resultado normal de grep).

| Literal en src/screens/add-reminder/index.tsx | Hoy observado |
|---|---:|
| `contentContainerStyle={{ gap: 8, paddingRight: 20 }}` | 2 |
| `className="-mr-5"` | 2 |
| `style={selected ? chunkyLip.primaryCompact : undefined}` | 3 |
| `flex-row flex-wrap gap-2` | 1 |
| `testID="type-chips-row"` | 1 |
| `testID="advance-chips-row"` | 1 |
| `paddingBottom: 3` | 0 |
| `marginBottom: -3` | 0 |
| `CHIP_ROW_CONTENT` | 0 |
| `CHIP_ROW_STYLE` | 0 |

`grep -cF "primaryCompact: lipStyle({ offsetY: 3, color: lip })" src/theme/chunky-lip.ts` → `1`.

```sh
cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder src/__tests__ > /tmp/t0-232.log 2>&1; echo "exit=$?"
```

```text
exit=0
Test Suites: 43 passed, 43 total
Tests:       1156 passed, 1156 total
Snapshots:   0 total
Time:        102.049 s
```

Sin «failed to run», sin flakes ni reintentos. Log íntegro conservado en `/tmp/t0-232.log` y en el anexo T0 de este reporte.

## Cadena TDD

1. `9b546b65da6e2da9bef1f00056bc4dea942c88ca` — `test(mobile): #232 reserve chip lip room in type and advance rows (R1)`.
   Comando: `cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder -t '#232 R|#213 R5' > /tmp/red-r1-232.log 2>&1; echo "exit=$?"`.
   Resultado: exit=1; 1 suite roja; 3 tests rojos, 1 verde, 119 omitidos por filtro, 123 total (6.334 s).
   Rojo legítimo: ambos `#232 R1` y el `#213 R5` enmendado fallan en `toEqual` porque falta `paddingBottom: 3`; ningún import roto ni «Cannot find module».
   **nace verde: #232 R4** fija la receta que ya tenía Repetición y que R1/R2 no deben modificar; su mutación R4 (a) se verificó por separado y quedó revertida.

2. `f3998897de10f1c26030b76b33479a6c07b6348b` — `feat(mobile): #232 pad chip rows so the selected lip is not clipped (R1)`.
   Solo producción: constante `CHIP_ROW_CONTENT` y dos usos. Comando: `cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder src/__tests__ > /tmp/green-r1-232.log 2>&1; echo "exit=$?"`.
   Exit=0; verde completo, incluido R3 sin tocar sus tests. Sin flakes ni reintentos.

```text
Test Suites: 43 passed, 43 total
Tests:       1159 passed, 1159 total
Snapshots:   0 total
Time:        19.73 s, estimated 29 s
```

3. `1b0c417414a656e6ec42d51707f53b679e454cbe` — `test(mobile): #232 chip rows must not shift the form (R2)`.
   Comando: `cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder -t '#232 R2:' > /tmp/red-r2-232.log 2>&1; echo "exit=$?"`.
   Resultado: exit=1; 1 suite roja; 2 tests rojos, 123 omitidos por filtro, 125 total (6.44 s).
   Rojo legítimo: ambos `#232 R2` fallan en `toHaveStyle({ marginBottom: -3 })`, porque aún no existe el margen. Ningún import roto ni «Cannot find module». Ningún test de R2 nace verde.

4. `bfbb84ceb6ead05d356fbf991516e6e0fc69201b` — `feat(mobile): #232 offset chip row padding with a negative margin (R2)`.
   Constante `CHIP_ROW_STYLE` y sus dos usos; comentario de una línea sobre el offset y la compensación. Verde completo, incluido R3 sin cambios en sus tests. Sin flakes ni reintentos. Comando: `cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder src/__tests__ > /tmp/t1-232.log 2>&1; echo "exit=$?"`.

```text
Test Suites: 43 passed, 43 total
Tests:       1161 passed, 1161 total
Snapshots:   0 total
Time:        21.792 s
exit=0
```


5. `66faad268bd9392147157d054d76654139bcfea7` — `docs(spec): #232 traceability`. R1–R4 enlazados a tests y hashes; ninguna fila sin completar. Sin rebase posterior.

R3: **nacen y siguen verdes** los tests existentes porque la implementación solo cambia los contenedores de las filas, sin modificar chips ni su selección. Sus aserciones no se tocaron; las dos mutaciones R3 demuestran sus candados.

R4: el único test nuevo que nace verde es el de Repetición; la mutación R4 (a) lo pone rojo por su aserción. El #213 R5 enmendado fue rojo en el primer commit y conserva todas sus demás aserciones.

## PARA resuelto por el humano — base del diff corregida

El handoff fija `H0 = 7bd8ba6c` como base del diff final y exige que `git diff --name-only 7bd8ba6c..HEAD` solo liste los dos ficheros de add-reminder y traceability.md (el reporte no se commitea). Sin embargo el propio handoff fue añadido por `67bb626c`, posterior a H0. La orden exigida ya produce:

```text
mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
mobile-pet-tracker/src/screens/add-reminder/index.tsx
progress/handoff_mobile-add-reminder-chip-lip-clip.md
```

`git diff --numstat 7bd8ba6c..67bb626c` confirma que el tercer fichero es preexistente al trabajo de Codex: `118 0 progress/handoff_mobile-add-reminder-chip-lip-clip.md`.

Se detiene el trabajo según «Si encuentras una contradicción, PARA y anótala; no adaptes la spec». No se cambia H0, la lista cerrada ni el handoff. Se pidió aclaración al humano para exceptuar únicamente ese fichero preexistente. Durante la espera de la respuesta no se creó el commit verde R2, no se plantaron R2/R3/R4 ni se ejecutó tsc/lint ni se creó el commit de trazabilidad.

Respuesta explícita del humano recibida el 2026-11-03: **«Exceptuar únicamente el handoff preexistente y continuar»**. Se reanudó con la excepción del handoff preexistente y se creó el commit verde R2 anterior. Posteriormente llegó la corrección explícita del leader/humano: **«la base correcta es 67bb626c (el commit del handoff), no 7bd8ba6c ... Mide git diff --name-only 67bb626c..HEAD. No pares por eso; sigue»**. Esta corrección rige el chequeo final: no hace falta exceptuar ficheros contra la base corregida. Se conserva aquí el incidente y su resolución para auditoría; no se edita el handoff ni requirements.md/design.md/tasks.md; solo se completa la trazabilidad autorizada.

## Mutaciones plantadas

Completadas en orden R1 (a)–(d), R2 (a)–(d), R3 (Tipo y Aviso por separado), R4 (a)–(b). Se ejecutaron de una en una, cada una sobre HEAD verde, sin cambiar mocks. Logs íntegros en /tmp; las salidas de aserción se registran debajo. Cada restauración usa ruta explícita y comprueba `git diff --cached --quiet`.


### R1 (a) quitar paddingBottom

Cambio: `const CHIP_ROW_CONTENT = { gap: 8, paddingRight: 20, paddingBottom: 3 };` → `const CHIP_ROW_CONTENT = { gap: 8, paddingRight: 20 };`.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R1: .*reserva 3 px bajo los chips' > /tmp/mut-r1a-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R1: type-chips-row reserva 3 px bajo los chips

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "gap": 8,
    -   "paddingBottom": 3,
        "paddingRight": 20,
      }

      1646 |     await screen.findByTestId('title-input');
      1647 |     const content = screen.getByTestId(row).props.contentContainerStyle;
    > 1648 |     expect(content).toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 });
           |                     ^
      1649 |
      1650 |     const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
      1651 |     const { join } = jest.requireActual<typeof import('path')>('path');

      at toEqual (src/screens/add-reminder/index.test.tsx:1648:21)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #232 R1: las filas de chips reservan el labio › #232 R1: advance-chips-row reserva 3 px bajo los chips

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "gap": 8,
    -   "paddingBottom": 3,
        "paddingRight": 20,
      }

      1646 |     await screen.findByTestId('title-input');
      1647 |     const content = screen.getByTestId(row).props.contentContainerStyle;
    > 1648 |     expect(content).toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 });
           |                     ^
      1649 |
      1650 |     const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
      1651 |     const { join } = jest.requireActual<typeof import('path')>('path');

      at toEqual (src/screens/add-reminder/index.test.tsx:1648:21)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 121 skipped, 123 total
Snapshots:   0 total
Time:        6.241 s, estimated 19 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R1: .*reserva 3 px bajo los chips".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R1 (b) paddingBottom: 2

Cambio: `paddingBottom: 3` → `paddingBottom: 2`.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R1: .*reserva 3 px bajo los chips' > /tmp/mut-r1b-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R1: type-chips-row reserva 3 px bajo los chips

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "gap": 8,
    -   "paddingBottom": 3,
    +   "paddingBottom": 2,
        "paddingRight": 20,
      }

      1646 |     await screen.findByTestId('title-input');
      1647 |     const content = screen.getByTestId(row).props.contentContainerStyle;
    > 1648 |     expect(content).toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 });
           |                     ^
      1649 |
      1650 |     const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
      1651 |     const { join } = jest.requireActual<typeof import('path')>('path');

      at toEqual (src/screens/add-reminder/index.test.tsx:1648:21)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #232 R1: las filas de chips reservan el labio › #232 R1: advance-chips-row reserva 3 px bajo los chips

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "gap": 8,
    -   "paddingBottom": 3,
    +   "paddingBottom": 2,
        "paddingRight": 20,
      }

      1646 |     await screen.findByTestId('title-input');
      1647 |     const content = screen.getByTestId(row).props.contentContainerStyle;
    > 1648 |     expect(content).toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 });
           |                     ^
      1649 |
      1650 |     const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
      1651 |     const { join } = jest.requireActual<typeof import('path')>('path');

      at toEqual (src/screens/add-reminder/index.test.tsx:1648:21)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 121 skipped, 123 total
Snapshots:   0 total
Time:        6.193 s, estimated 7 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R1: .*reserva 3 px bajo los chips".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R1 (c) Aviso conserva el objeto viejo

Cambio: `contentContainerStyle={CHIP_ROW_CONTENT}` → `contentContainerStyle={{ gap: 8, paddingRight: 20 }}` solo en Aviso.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R1: .*reserva 3 px bajo los chips' > /tmp/mut-r1c-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R1: advance-chips-row reserva 3 px bajo los chips

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Object {
        "gap": 8,
    -   "paddingBottom": 3,
        "paddingRight": 20,
      }

      1646 |     await screen.findByTestId('title-input');
      1647 |     const content = screen.getByTestId(row).props.contentContainerStyle;
    > 1648 |     expect(content).toEqual({ gap: 8, paddingRight: 20, paddingBottom: 3 });
           |                     ^
      1649 |
      1650 |     const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
      1651 |     const { join } = jest.requireActual<typeof import('path')>('path');

      at toEqual (src/screens/add-reminder/index.test.tsx:1648:21)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 121 skipped, 1 passed, 123 total
Snapshots:   0 total
Time:        7.477 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R1: .*reserva 3 px bajo los chips".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R1 (d) labio real offsetY: 4

Cambio: `primaryCompact: lipStyle({ offsetY: 3, color: lip })` → `primaryCompact: lipStyle({ offsetY: 4, color: lip })`.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R1: .*reserva 3 px bajo los chips' > /tmp/mut-r1d-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R1: type-chips-row reserva 3 px bajo los chips

    expect(received).toBe(expected) // Object.is equality

    Expected: 4
    Received: 3

      1653 |     const match = source.match(/primaryCompact: lipStyle\(\{ offsetY: (\d+),/);
      1654 |     expect(match).not.toBeNull();
    > 1655 |     expect(content.paddingBottom).toBe(Number(match![1]));
           |                                   ^
      1656 |   });
      1657 |
      1658 |   it('#232 R4: la fila de Repetición no cambia', async () => {

      at toBe (src/screens/add-reminder/index.test.tsx:1655:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #232 R1: las filas de chips reservan el labio › #232 R1: advance-chips-row reserva 3 px bajo los chips

    expect(received).toBe(expected) // Object.is equality

    Expected: 4
    Received: 3

      1653 |     const match = source.match(/primaryCompact: lipStyle\(\{ offsetY: (\d+),/);
      1654 |     expect(match).not.toBeNull();
    > 1655 |     expect(content.paddingBottom).toBe(Number(match![1]));
           |                                   ^
      1656 |   });
      1657 |
      1658 |   it('#232 R4: la fila de Repetición no cambia', async () => {

      at toBe (src/screens/add-reminder/index.test.tsx:1655:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 121 skipped, 123 total
Snapshots:   0 total
Time:        5.56 s, estimated 8 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R1: .*reserva 3 px bajo los chips".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/theme/chunky-lip.ts`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R2 (a) quitar style de Tipo

Retirar `style={CHIP_ROW_STYLE}` solo de `type-chips-row`.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R2:' > /tmp/mut-r2a-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R2: type-chips-row no desplaza el resto del formulario

    expect(instance).toHaveStyle()

    - Expected
    + Received

    - marginBottom: -3;

      1660 |     await screen.findByTestId('title-input');
      1661 |     const row = screen.getByTestId(id);
    > 1662 |     expect(row).toHaveStyle({ marginBottom: -3 });
           |                 ^
      1663 |     expect(row.props.className).toBe('-mr-5');
      1664 |     expect(-(row.props.contentContainerStyle as { paddingBottom: number }).paddingBottom).toBe(-3);
      1665 |   });

      at toHaveStyle (src/screens/add-reminder/index.test.tsx:1662:17)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 123 skipped, 1 passed, 125 total
Snapshots:   0 total
Time:        6.718 s, estimated 21 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R2:".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R2 (b) marginBottom: -2

`marginBottom: -3` → `marginBottom: -2`.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R2:' > /tmp/mut-r2b-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R2: type-chips-row no desplaza el resto del formulario

    expect(instance).toHaveStyle()

    - Expected
    + Received

    - marginBottom: -3;
    + marginBottom: -2;

      1660 |     await screen.findByTestId('title-input');
      1661 |     const row = screen.getByTestId(id);
    > 1662 |     expect(row).toHaveStyle({ marginBottom: -3 });
           |                 ^
      1663 |     expect(row.props.className).toBe('-mr-5');
      1664 |     expect(-(row.props.contentContainerStyle as { paddingBottom: number }).paddingBottom).toBe(-3);
      1665 |   });

      at toHaveStyle (src/screens/add-reminder/index.test.tsx:1662:17)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #232 R1: las filas de chips reservan el labio › #232 R2: advance-chips-row no desplaza el resto del formulario

    expect(instance).toHaveStyle()

    - Expected
    + Received

    - marginBottom: -3;
    + marginBottom: -2;

      1660 |     await screen.findByTestId('title-input');
      1661 |     const row = screen.getByTestId(id);
    > 1662 |     expect(row).toHaveStyle({ marginBottom: -3 });
           |                 ^
      1663 |     expect(row.props.className).toBe('-mr-5');
      1664 |     expect(-(row.props.contentContainerStyle as { paddingBottom: number }).paddingBottom).toBe(-3);
      1665 |   });

      at toHaveStyle (src/screens/add-reminder/index.test.tsx:1662:17)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 123 skipped, 125 total
Snapshots:   0 total
Time:        6.746 s, estimated 7 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R2:".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R2 (c) marginBottom: 3

`marginBottom: -3` → `marginBottom: 3`.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R2:' > /tmp/mut-r2c-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R2: type-chips-row no desplaza el resto del formulario

    expect(instance).toHaveStyle()

    - Expected
    + Received

    - marginBottom: -3;
    + marginBottom: 3;

      1660 |     await screen.findByTestId('title-input');
      1661 |     const row = screen.getByTestId(id);
    > 1662 |     expect(row).toHaveStyle({ marginBottom: -3 });
           |                 ^
      1663 |     expect(row.props.className).toBe('-mr-5');
      1664 |     expect(-(row.props.contentContainerStyle as { paddingBottom: number }).paddingBottom).toBe(-3);
      1665 |   });

      at toHaveStyle (src/screens/add-reminder/index.test.tsx:1662:17)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #232 R1: las filas de chips reservan el labio › #232 R2: advance-chips-row no desplaza el resto del formulario

    expect(instance).toHaveStyle()

    - Expected
    + Received

    - marginBottom: -3;
    + marginBottom: 3;

      1660 |     await screen.findByTestId('title-input');
      1661 |     const row = screen.getByTestId(id);
    > 1662 |     expect(row).toHaveStyle({ marginBottom: -3 });
           |                 ^
      1663 |     expect(row.props.className).toBe('-mr-5');
      1664 |     expect(-(row.props.contentContainerStyle as { paddingBottom: number }).paddingBottom).toBe(-3);
      1665 |   });

      at toHaveStyle (src/screens/add-reminder/index.test.tsx:1662:17)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 123 skipped, 125 total
Snapshots:   0 total
Time:        6.25 s, estimated 7 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R2:".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R2 (d) quitar style de Aviso

Retirar `style={CHIP_ROW_STYLE}` solo de `advance-chips-row`.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R2:' > /tmp/mut-r2d-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R2: advance-chips-row no desplaza el resto del formulario

    expect(instance).toHaveStyle()

    - Expected
    + Received

    - marginBottom: -3;

      1660 |     await screen.findByTestId('title-input');
      1661 |     const row = screen.getByTestId(id);
    > 1662 |     expect(row).toHaveStyle({ marginBottom: -3 });
           |                 ^
      1663 |     expect(row.props.className).toBe('-mr-5');
      1664 |     expect(-(row.props.contentContainerStyle as { paddingBottom: number }).paddingBottom).toBe(-3);
      1665 |   });

      at toHaveStyle (src/screens/add-reminder/index.test.tsx:1662:17)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 123 skipped, 1 passed, 125 total
Snapshots:   0 total
Time:        6.304 s, estimated 7 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R2:".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R3 — labio fijo en type-chips-row

`style={selected ? chunkyLip.primaryCompact : undefined}` → `style={chunkyLip.primaryCompact}` solo en los chips de esa fila. Prueba adicional: se planta por separado en Tipo y Aviso para demostrar ambas ramas con los tests existentes intactos.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t 'pinta Vacuna seleccionada|invierte las recetas|abre en el 24, con el mínimo' > /tmp/mut-r3-type-232.log 2>&1`.

```text
  ● #178 R10: marco, título y chips de tipo del canvas › pinta Vacuna seleccionada con cápsula, labio y texto sin emoji (enmendado por #197 R7)

    expect(received).toBeUndefined()

    Received: {"boxShadow": [{"color": "mock-lip", "offsetX": 0, "offsetY": 3}]}

      651 |     expect(chip.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent');
      652 |     expect(chip.props.style).toEqual(mockChunkyLip.primaryCompact);
    > 653 |     expect(screen.getByTestId('type-chip-custom').props.style).toBeUndefined();
          |                                                                ^
      654 |     expect(chip.props.hitSlop).toEqual(TOUCH_SLOP);
      655 |     expect(chip.props.accessibilityState).toEqual({ selected: true });
      656 |     expect(within(chip).getByText('Vacuna').props.className).toBe('text-sm font-extrabold text-accent-foreground');

      at Object.toBeUndefined (src/screens/add-reminder/index.test.tsx:653:64)

  ● #178 R10: marco, título y chips de tipo del canvas › invierte las recetas al seleccionar Otro (enmendado por #197 R7)

    expect(received).toBeUndefined()

    Received: {"boxShadow": [{"color": "mock-lip", "offsetX": 0, "offsetY": 3}]}

      676 |     expect(selected.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent');
      677 |     expect(selected.props.style).toEqual(mockChunkyLip.primaryCompact);
    > 678 |     expect(idle.props.style).toBeUndefined();
          |                              ^
      679 |     expect(selected.props.accessibilityState).toEqual({ selected: true });
      680 |     expect(within(selected).getByText('Otro').props.className).toBe('text-sm font-extrabold text-accent-foreground');
      681 |     expect(idle.props.className).toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-category-blue');

      at Object.toBeUndefined (src/screens/add-reminder/index.test.tsx:678:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 122 skipped, 1 passed, 125 total
Snapshots:   0 total
Time:        6.551 s, estimated 7 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "pinta Vacuna seleccionada|invierte las recetas|abre en el 24, con el mínimo".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R3 — labio fijo en advance-chips-row

`style={selected ? chunkyLip.primaryCompact : undefined}` → `style={chunkyLip.primaryCompact}` solo en los chips de esa fila. Prueba adicional: se planta por separado en Tipo y Aviso para demostrar ambas ramas con los tests existentes intactos.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t 'pinta Vacuna seleccionada|invierte las recetas|abre en el 24, con el mínimo' > /tmp/mut-r3-advance-232.log 2>&1`.

```text
  ● #123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre › #123 R5: el calendario de Nuevo recordatorio abre en el día local; el mínimo y la hora no se convierten › abre en el 24, con el mínimo en el instante actual y la hora a las 09:00 (enmendado por #197 R7) (enmendado por #220 R15)

    expect(received).toEqual(expected) // deep equality

    Expected: undefined
    Received: {"boxShadow": [{"color": "mock-lip", "offsetX": 0, "offsetY": 3}]}

      768 |       for (const minutes of [0, 1440, 4320, 10080]) {
      769 |         const chip = screen.getByTestId(`advance-chip-${minutes}`);
    > 770 |         expect(chip.props.style).toEqual(minutes === 10080 ? mockChunkyLip.primaryCompact : undefined);
          |                                  ^
      771 |         expect(chip.props.className).not.toMatch(/border-b-3|border-black\/25/);
      772 |       }
      773 |     });

      at Object.toEqual (src/screens/add-reminder/index.test.tsx:770:34)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 122 skipped, 2 passed, 125 total
Snapshots:   0 total
Time:        6.375 s, estimated 7 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "pinta Vacuna seleccionada|invierte las recetas|abre en el 24, con el mínimo".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R4 (a) relleno en Repetición

`<View className="flex-row flex-wrap gap-2">` → `<View className="flex-row flex-wrap gap-2" style={{ paddingBottom: 3 }}>`. El test que nace verde detecta el relleno indebido.

Comando desde mobile-pet-tracker/: `bunx jest src/screens/add-reminder -t '#232 R4:' > /tmp/mut-r4a-232.log 2>&1`.

```text
  ● #232 R1: las filas de chips reservan el labio › #232 R4: la fila de Repetición no cambia

    expect(received).toBeUndefined()

    Received: 3

      1670 |     const row = screen.getByTestId('repeat-chip-once').parent!;
      1671 |     expect(row.props.className).toBe('flex-row flex-wrap gap-2');
    > 1672 |     expect(row.props.style?.paddingBottom).toBeUndefined();
           |                                            ^
      1673 |     expect(row.props.style?.marginBottom).toBeUndefined();
      1674 |     expect(row).not.toHaveStyle({ marginBottom: -3 });
      1675 |   });

      at Object.toBeUndefined (src/screens/add-reminder/index.test.tsx:1672:44)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 124 skipped, 125 total
Snapshots:   0 total
Time:        6.351 s, estimated 7 s
Ran all test suites matching /src\/screens\/add-reminder/i with tests matching "#232 R4:".
exit=1
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0.


### R4 (b) ancla de la enmienda (shell, no un it)

Se quitó temporalmente el sufijo ` (enmendado por #232 R1)` del título de #213 R5, sin cambiar ninguna aserción ni mock.

Comando desde mobile-pet-tracker/: `grep -cF "(enmendado por #232 R1)" src/screens/add-reminder/index.test.tsx`.

```text
Mutación: stdout=0; exit=1 (incumple la cuenta exigida 1).
Restaurado: stdout=1; exit=0.
```

Revertida: `git checkout HEAD -- mobile-pet-tracker/src/screens/add-reminder/index.test.tsx`; `git diff --cached --quiet` → 0; diff del fichero → 0. Es el candado de grep prescrito por R4 (b), no una corrida de jest.


## Anclas finales — columna «Tras #232»

Todas coinciden, obtenidas con `grep -cF` desde mobile-pet-tracker/:

```text
grep -cF 'contentContainerStyle={{ gap: 8, paddingRight: 20 }}' src/screens/add-reminder/index.tsx -> 0 (exit 1)
grep -cF 'className="-mr-5"' src/screens/add-reminder/index.tsx -> 2 (exit 0)
grep -cF 'style={selected ? chunkyLip.primaryCompact : undefined}' src/screens/add-reminder/index.tsx -> 3 (exit 0)
grep -cF 'flex-row flex-wrap gap-2' src/screens/add-reminder/index.tsx -> 1 (exit 0)
grep -cF 'testID="type-chips-row"' src/screens/add-reminder/index.tsx -> 1 (exit 0)
grep -cF 'testID="advance-chips-row"' src/screens/add-reminder/index.tsx -> 1 (exit 0)
grep -cF 'paddingBottom: 3' src/screens/add-reminder/index.tsx -> 1 (exit 0)
grep -cF 'marginBottom: -3' src/screens/add-reminder/index.tsx -> 1 (exit 0)
grep -cF 'CHIP_ROW_CONTENT' src/screens/add-reminder/index.tsx -> 3 (exit 0)
grep -cF 'CHIP_ROW_STYLE' src/screens/add-reminder/index.tsx -> 3 (exit 0)
grep -cF 'primaryCompact: lipStyle({ offsetY: 3, color: lip })' src/theme/chunky-lip.ts -> 1 (exit 0)
grep -cF '(enmendado por #232 R1)' src/screens/add-reminder/index.test.tsx -> 1 (exit 0)
```

## Verificación final

Verificación final después de restaurar todas las mutaciones, sobre el código de `bfbb84ce` (el commit posterior solo documenta trazabilidad):

```sh
cd /home/claude/sites/Pet-Tracker-wt-232/mobile-pet-tracker && bunx jest src/screens/add-reminder src/__tests__ > /tmp/final-232.log 2>&1; echo "exit=$?"
```

```text
Test Suites: 43 passed, 43 total
Tests:       1161 passed, 1161 total
Snapshots:   0 total
Time:        33.809 s
exit=0
```

Mismas 43 suites que T0; 1.156 → 1.161 tests (+5: R1 dos, R2 dos, R4 uno). Add-reminder pasa de 120 a 125 tests. Ninguna suite «failed to run», ningún flake, timeout, SIGKILL ni reintento. Los guards de src/__tests__ y los tests existentes de R3 siguen verdes.

TypeScript (desde mobile-pet-tracker/):

```sh
test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > ../progress/tsc_232.log 2>&1; echo $?
```

```text
router_guard_exit=0
0
progress/tsc_232.log: 0 bytes
```

Lint (desde mobile-pet-tracker/):

```sh
bunx expo lint --no-cache > ../progress/lint_232.log 2>&1 && test ! -s ../progress/lint_232.log && echo LINT_OK
```

```text
LINT_OK
exit=0
progress/lint_232.log: 0 bytes
```

Ambos logs temporales de progress/ se borraron después de registrar su salida y tamaño (solo esos dos ficheros). No se borró ni generó router.d.ts.

No se ejecutó ./init.sh, ni git fetch/merge/rebase, ni bun install. No se abrió ni editó PR. No se cambiaron estados de feature, STATUS.md, progress/current.md ni progress/history.md. No se alteró ningún doble de módulo, copy, clase, chip, dependencia ni tema; chunky-lip.ts quedó idéntico a HEAD tras su mutación.

Limitación pendiente del humano: G2 en dev build Android claro/oscuro (el recorte y la posición visual se comprueban en dispositivo). init.sh y la revisión/PR corresponden al leader. No hay PARA sin resolver.

Chequeo final de alcance y limpieza (base corregida por instrucción del leader/humano):

```sh
git diff --name-only 67bb626c..HEAD
```

```text
mobile-pet-tracker/src/screens/add-reminder/index.test.tsx
mobile-pet-tracker/src/screens/add-reminder/index.tsx
specs/mobile-add-reminder-chip-lip-clip/traceability.md
```

```text
git status --short -- mobile-pet-tracker specs -> salida vacía (exit=0)
git diff --cached --quiet -> exit=0
git diff --check 67bb626c..HEAD -> salida vacía (exit=0)
traceability.md -> ninguna fila pendiente
progress/tsc_232.log y progress/lint_232.log -> no existen
.expo/types/router.d.ts -> no existe
```

Cadena completa, sin rebase:

```text
9b546b65 test(mobile): #232 reserve chip lip room in type and advance rows (R1)
f3998897 feat(mobile): #232 pad chip rows so the selected lip is not clipped (R1)
1b0c4174 test(mobile): #232 chip rows must not shift the form (R2)
bfbb84ce feat(mobile): #232 offset chip row padding with a negative margin (R2)
66faad26 docs(spec): #232 traceability

```

`git status --short` antes del marcador solo muestra el reporte sin commitear, según el handoff:

```text
?? progress/impl_mobile-add-reminder-chip-lip-clip.md

```

Única acción restante: crear `progress/impl_mobile-add-reminder-chip-lip-clip.done` con la ruta absoluta de este reporte en una sola línea. El marcador está ignorado y no se commitea.



<details>
<summary>Anexo T0: salida íntegra antes de editar</summary>

```text
PASS src/__tests__/ui-copy-table.ts (22.866 s)
PASS src/__tests__/design-drift.test.ts (23.48 s)
PASS src/__tests__/chunky-cta-canvas-fidelity.test.ts
PASS src/__tests__/consistency-classnames.test.ts
PASS src/__tests__/map-canvas-fidelity.test.ts
PASS src/__tests__/account-flow-canvas-fidelity.test.ts
PASS src/__tests__/canvas-foundations.test.ts
PASS src/__tests__/ui-language.test.ts
PASS src/__tests__/alerts-canvas-fidelity.test.ts
PASS src/__tests__/hero-header-amendments.test.ts
PASS src/__tests__/profile-canvas-fidelity.test.ts
PASS src/__tests__/alerts-attended-canvas-fidelity.test.ts
PASS src/__tests__/orbit-rename.test.ts
PASS src/__tests__/heroui-text-size-merge.test.ts
PASS src/__tests__/home-photo-hero-canvas.test.ts
PASS src/__tests__/zones-canvas-fidelity.test.ts
PASS src/__tests__/reminders-upcoming-past-canvas-fidelity.test.ts
PASS src/__tests__/geofences-canvas-fidelity.test.ts
PASS src/__tests__/home-canvas-fidelity.test.ts
PASS src/__tests__/legibility-classnames.test.ts
PASS src/__tests__/health-weight-canvas-fidelity.test.ts (5.657 s)
PASS src/__tests__/alert-detail-canvas-fidelity.test.ts
PASS src/__tests__/tab-bar-canvas-fidelity.test.ts
PASS src/__tests__/tab-headers-canvas.test.ts
PASS src/__tests__/routine-canvas-fidelity.test.ts
PASS src/__tests__/profile-photo-hero-canvas.test.ts
PASS src/__tests__/account-screens-polish.test.ts
PASS src/__tests__/collar-alerts-canvas-fidelity.test.ts
PASS src/__tests__/nutrition-canvas-fidelity.test.ts
PASS src/__tests__/forms-validation-global.test.ts
PASS src/__tests__/hosting-artifacts.test.ts
PASS src/__tests__/pairing-canvas-fidelity.test.ts
PASS src/__tests__/orbit-activity-pose.test.ts
PASS src/__tests__/home-pingo-phrase.test.ts
PASS src/__tests__/jest-virtual-mock-lock.test.ts
PASS src/__tests__/orbit-rename-copy.test.ts
PASS src/__tests__/orbit-charter-voice.test.ts
PASS src/__tests__/no-pets-states.test.ts
PASS src/__tests__/edit-profile.test.ts
PASS src/__tests__/sheet-surface-background.test.ts
PASS src/__tests__/add-pet-two-steps.test.ts
PASS src/__tests__/heroui-smoke.test.tsx (7.122 s)
  ● Console

    console.warn
      Uniwind - We couldn't find your variable --theme. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:33:17)
          at Array.forEach (<anonymous>)
      at forEach (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:31:15)
      at getCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:46)
      at mountStateImpl (node_modules/react-reconciler/cjs/react-reconciler.development.js:5941:24)
      at mountState (node_modules/react-reconciler/cjs/react-reconciler.development.js:5962:22)
      at Object.useState (node_modules/react-reconciler/cjs/react-reconciler.development.js:17940:18)
      at Object.<anonymous>.process.env.NODE_ENV.exports.useState (node_modules/react/cjs/react.development.js:1263:34)
      at useCSSVariable (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:62:39)
      at useLibraryTheme (node_modules/heroui-native/src/helpers/internal/hooks/use-library-theme.ts:22:33)
      at useHasDefaultThemeBackground (node_modules/heroui-native/src/components/theme-background/theme-background.tsx:33:32)
      at HeroUINative.Button.Root (node_modules/heroui-native/src/components/button/button.tsx:84:65)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateForwardRef (node_modules/react-reconciler/cjs/react-reconciler.development.js:7278:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9602:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

PASS src/screens/add-reminder/index.test.tsx (100.601 s)
  ● Console

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      Uniwind - We couldn't find your variable --color-foreground. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      16 |   const { theme } = useUniwind();
      17 |   const foreground =
    > 18 |     asColor(Uniwind.getCSSVariable('--color-foreground')) ??
         |                     ^
      19 |     (theme === 'dark' ? '#F7F8FA' : '#0D1117');
      20 |
      21 |   return tokens.map(

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:39:9)
      at UniwindConfigBuilder.getCSSVariable (node_modules/uniwind/src/core/config/config.common.ts:122:30)
      at getCSSVariable (src/theme/use-theme-colors.ts:18:21)
      at AddReminderContent (src/screens/add-reminder/index.tsx:136:59)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateFunctionComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:7720:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9277:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.warn
      "color:muted" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractFill (node_modules/react-native-svg/src/lib/extract/extractFill.ts:22:69)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:86:14)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.warn
      "color:foreground" is not a valid color or brush

      at warn (node_modules/react-native-svg/src/lib/extract/extractBrush.ts:47:11)
      at extractStroke (node_modules/react-native-svg/src/lib/extract/extractStroke.ts:46:28)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:87:16)
      at extractProps (node_modules/react-native-svg/src/lib/extract/extractProps.ts:191:10)
      at Path.render (node_modules/react-native-svg/src/elements/Path.tsx:19:35)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17609:29)
      at updateClassComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:8273:25)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9291:13)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at node_modules/react/cjs/react.development.js:847:21

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)

    console.info
      [34mHeroUI Native Styling Principles[0m
      • className: this is your go-to styling solution. Use Tailwind CSS classes via className prop on all components.
      • StyleSheet precedence: The style prop (StyleSheet API) has precedence over className when both are provided. This allows you to override Tailwind classes when needed.
      • Animated styles: Some style properties are animated using react-native-reanimated and have precedence over className. To identify which styles are animated:
        - Hover over className in your IDE - TypeScript definitions show which properties are occupied by animated styles
        - Check component documentation - Each component page includes a link to the component's style source
      • If styles are occupied by animation, modify them via the animation prop on components that support it.
      • To deactivate animated style completely and apply your own styles, use isAnimatedStyleActive prop.
      [33m💡 To disable this message, set config.devInfo.stylingPrinciples to false[0m

      at info (node_modules/heroui-native/src/helpers/internal/hooks/use-dev-info.ts:25:15)


Test Suites: 43 passed, 43 total
Tests:       1156 passed, 1156 total
Snapshots:   0 total
Time:        102.049 s
Ran all test suites matching /src\/screens\/add-reminder|src\/__tests__/i.

exit=0
```

</details>
