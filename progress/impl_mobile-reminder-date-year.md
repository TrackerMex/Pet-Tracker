# Implementación #240 — mobile-reminder-date-year

Fecha: 2026-11-04. Worktree: `/home/claude/sites/Pet-Tracker-wt-240`.
Branch: `feature/240-mobile-reminder-date-year`. H0: `d64a2b02`.
Base del diff acotado (handoff): `3b650137`.

## Identidad y alcance

Salida del comando de identidad prescrito:

```text
/home/claude/sites/Pet-Tracker-wt-240
feature/240-mobile-reminder-date-year
3b650137 docs(progress): #240 codex handoff
d64a2b02 Merge remote-tracking branch 'origin/dev' into feature/240-mobile-reminder-date-year
3e5585d5 Merge pull request #307 from TrackerMex/feature/239-mobile-reminder-swipe-past-row-bleed
b4814711 docs(progress): #239 implementation report, review and smoke steps
c9a60dc6 docs(spec): #239 traceability
aae1b86d test(mobile): suffix amended locks with #239 R7 (R7)
```

Desviación de orden: antes de leer el handoff se ejecutó una inspección de solo
lectura (`pwd && git status --short && git branch --show-current`). El comando
prescrito se ejecutó inmediatamente después de leerlo; el árbol inicial estaba
limpio. Ningún cambio de código precedió a la lectura de la spec.

Skills cargadas:

- `ponytail:ponytail`, por la instrucción global para tareas de código.
- `building-native-ui`, localizada en
  `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.

Leídos el handoff completo, los cuatro documentos de la spec aprobada,
arquitectura, convenciones (incluido §Esperas sobre el árbol renderizado), carta
de UI y disciplina TDD. Se respeta la lista cerrada de archivos. No se ejecuta
`./init.sh`, ni se instala, sincroniza, abre PR o modifica G2; corresponde al leader/humano.

## T0 — Anclas y línea base

T0 (1) omitido como ordena el handoff: entorno y dependencias ya preparados.
Anclas medidas con `grep -oF` (ocurrencias de producción) y `grep -cF`
(tests/localizadores); todas coinciden, sin discrepancias.

| Literal de producción | T0 | Final medido |
|---|---:|---:|
| `const date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' });` | 1 | 0 |
| `const time = due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });` | 1 | 1 |
| `due.getFullYear() === new Date(now).getFullYear()` | 0 | 1 |
| `until.getFullYear() === new Date(now).getFullYear()` | 1 | 1 |
| `toLocaleDateString(` | 2 | 2 |
| `getFullYear()` | 2 | 4 |
| `year: 'numeric'` | 1 | 2 |
| `new Date(now)` | 4 | 5 |
| `getUTCFullYear` | 0 | 0 |
| `#240` | 0 | 0 |

| Literal de test | T0 |
|---|---:|
| `it('formatea la fecha y hora próxima y conserva sus días en text-13'` | 1 |
| `it('formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13)'` | 1 |
| `'2 ene, 09:00'` | 1 |
| `'20 ene, 20:05'` | 1 |
| `'3 dic, 11:30'` | 1 |
| `describe('#65 R15: la fecha del recordatorio se formatea con el locale del idioma'` | 1 |
| `it('passes es-MX explicitly to the date formatter'` | 1 |
| `#240` | 0 |

Los tres localizadores de la Tabla de enmiendas dan 1 cada uno:
`formatea la fecha y hora próxima y conserva sus días en text-13`,
`formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13)`
y `passes es-MX explicitly to the date formatter`.

Línea base:
`bun run jest src/screens/reminders > ../progress/t0_mobile-reminder-date-year.log 2>&1`.
Exit 0, 1 suite, **P = 153 pasados**, 0 fallidos, 153 total; 299.74 s.
Primera corrida sin SIGKILL ni repetición. Número de `●`: 0.

## Commits y TDD

1. `edb52ddd` — `test(mobile): pin the clock of the es-MX date formatter lock (R5)`.
   Solo tests: reloj fijo antes de `makeReminder`, limpieza de timers y sufijo
   de título; aserción intacta. Corrida `t_clock_mobile-reminder-date-year.log`:
   exit 0, 1 suite, 153 pasados, 0 fallidos, 23.506 s. Nace verde, como prescribe T2.

Los casos nuevos se añaden al final, después de #239. `renderCase` fija el reloj
por caso y espera `findByTestId('reminder-row-r')` o
`findByTestId('reminders-past-toggle')` seguido de `expandPast()`. La fila se
consulta dentro de la lista de su sección; las aserciones nuevas usan
`toBeOnTheScreen()`. No hay esperas a contadores de mocks ni identidad de nodos.

2. `9cdadea3` — `test(mobile): reminder row date shows the year outside the current year (R1, R2, R3, R5)`.
   Solo tests. `t1_mobile-reminder-date-year.log`: exit 1, 1 suite, **9 fallidos, 158 pasados (P + 5), 167 total**, 19.147 s, nueve `●`.
   Ocho fallos son `getByText` dentro de filas existentes que todavía no pintan año; el noveno es `toHaveBeenCalledWith` porque falta `year` en las opciones. Sin errores de imports, módulos, secciones o testID. R2 (cuatro casos) y R3 (filas 1, 2 y 4) verdes.

Rojos de T1 (también los únicos rojos después de añadir R4):

- `#178 R6: fila del canvas › formatea la fecha y hora próxima y conserva sus días en text-13 (enmendado por #240 R1)`
- `#178 R6: fila del canvas › formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13) (enmendado por #240 R1)`
- `#240: año en la fecha de la fila › #240 R1: próximo del año que viene (ejemplo del humano)`
- `#240: año en la fecha de la fila › #240 R1: mañana 1 ene visto el 31 dic`
- `#240: año en la fecha de la fila › #240 R1: enviado de diciembre visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R1: inglés, próximo del año que viene`
- `#240: año en la fecha de la fila › #240 R3: 31 dic 18:00 local, ya 2027 en UTC, visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R3: inglés, 31 dic 18:00 local visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R5: pasa es-MX y el año a toLocaleDateString para una fecha de otro año`

3. `c281f522` — `test(mobile): series until text keeps its year rule with a January clock (R4)`.
   Solo tests. `t_r4_mobile-reminder-date-year.log`: exit 1, 1 suite,
   **9 fallidos, 163 pasados (P + 10), 172 total**, 18.146 s, nueve `●`.
   Comparadas las listas completas: son exactamente los mismos nueve rojos de
   T1, por las mismas aserciones. Las cinco filas de R4 nacen verdes.

## Verificación de la implementación antes del commit de producción

- `bun run jest src/screens/reminders > ../progress/t2_mobile-reminder-date-year.log 2>&1`:
  exit 0, 1 suite, **172 pasados (P + 19), 0 fallidos**, 25.542 s.
- `bun run jest src/__tests__ > ../progress/static_mobile-reminder-date-year.log 2>&1`:
  exit 0, **43 suites, 1061 pasados, 0 fallidos**, 18.972 s. Ningún guard
  estático se modificó; sin «failed to run» ni SIGKILL. Un `● Console` es
  salida informativa de HeroUI, no un fallo.
- `.expo/types/router.d.ts` no existe (precondición verificada, sin borrarlo).
  `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-240.log 2>&1; echo $?`:
  imprime **0**, log vacío (0 bytes).
- Medidas de «Tras el cambio», con `grep -oF -- "<literal>" … | wc -l`:
  en el orden de la tabla de producción, **0, 1, 1, 1, 2, 4, 2, 5, 0, 0**.
  Todas coinciden. Sufijos de test con `grep -cF`: `(enmendado por #240 R1)`
  **2**, `(enmendado por #240 R5)` **1**.

- `bunx expo lint --no-cache > /tmp/lint-240.log 2>&1 && test ! -s /tmp/lint-240.log && echo LINT_OK`:
  exit 0, **LINT_OK**, log vacío (0 bytes).

4. `b14c20e7` — `feat(mobile): show the year in reminder row dates outside the current year (R1, R3, R5)`.
   Solo producción: una línea retirada y tres añadidas, exactamente la ternaria
   literal del diseño. La hora, el «hasta», el JSX, imports y la base de #239
   siguen intactos. Las verificaciones anteriores corresponden a este contenido.

## Sondas S1 a S8

Se ejecutan sobre `b14c20e7`, una mutación cada vez, con la suite completa
`bun run jest src/screens/reminders`. Cada sonda se revierte con
`git checkout HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`,
seguido de `git diff --quiet HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx && git diff --cached --quiet`.

### S1

Mutación:

```ts
due.getUTCFullYear() === new Date(now).getUTCFullYear()
```

Log: `s1_mobile-reminder-date-year.log`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 168 passed, 172 total
Time:        16.964 s, estimated 18 s
```

Rojos:

- `#240: año en la fecha de la fila › #240 R3: 31 dic 20:00 local, ya 2027 en UTC, visto el 31 dic`
- `#240: año en la fecha de la fila › #240 R3: 31 dic 18:00 local, ya 2027 en UTC, visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R3: inglés, 31 dic 20:00 local visto el 31 dic`
- `#240: año en la fecha de la fila › #240 R3: inglés, 31 dic 18:00 local visto el 1 ene`

Mínimos requeridos: OK, todos presentes.
Restauración a HEAD y ambas comprobaciones de diff: OK. Sonda sin commit.

### S2

Mutación:

```ts
due.getFullYear() === new Date(now).getUTCFullYear()
```

Log: `s2_mobile-reminder-date-year.log`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 171 passed, 172 total
Time:        17.679 s
```

Rojos:

- `#240: año en la fecha de la fila › #240 R3: 31 dic 22:00 local con reloj y fecha ya en 2027 UTC`

Mínimos requeridos: OK, todos presentes.
Restauración a HEAD y ambas comprobaciones de diff: OK. Sonda sin commit.

### S3

Mutación:

```ts
due.getUTCFullYear() === new Date(now).getFullYear()
```

Log: `s3_mobile-reminder-date-year.log`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       5 failed, 167 passed, 172 total
Time:        17.806 s, estimated 18 s
```

Rojos:

- `#240: año en la fecha de la fila › #240 R3: 31 dic 20:00 local, ya 2027 en UTC, visto el 31 dic`
- `#240: año en la fecha de la fila › #240 R3: 31 dic 22:00 local con reloj y fecha ya en 2027 UTC`
- `#240: año en la fecha de la fila › #240 R3: 31 dic 18:00 local, ya 2027 en UTC, visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R3: inglés, 31 dic 20:00 local visto el 31 dic`
- `#240: año en la fecha de la fila › #240 R3: inglés, 31 dic 18:00 local visto el 1 ene`

Mínimos requeridos: OK, todos presentes.
Restauración a HEAD y ambas comprobaciones de diff: OK. Sonda sin commit.

### S4

Mutación:

```ts
const date = due.toLocaleDateString(locale, due.getFullYear() === new Date(now).getFullYear()
      ? { day: 'numeric', month: 'short', year: 'numeric' }
      : { day: 'numeric', month: 'short', year: 'numeric' });
```

Log: `s4_mobile-reminder-date-year.log`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       10 failed, 162 passed, 172 total
Time:        17.284 s, estimated 18 s
```

Rojos:

- `#178 R6: fila del canvas › formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13) (enmendado por #240 R1)`
- `R6: lista con pills, badges y refetch on focus › renders summaries and reminder rows by section (enmendado por #213 R16) (enmendado por #227 R13)`
- `#65 R15: la fecha del recordatorio se formatea con el locale del idioma › passes es-MX explicitly to the date formatter (enmendado por #240 R5)`
- `#240: año en la fecha de la fila › #240 R2: próximo de este año`
- `#240: año en la fecha de la fila › #240 R2: hoy 1 ene por la noche visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R2: pasado programado de este año`
- `#240: año en la fecha de la fila › #240 R2: inglés, próximo de este año`
- `#240: año en la fecha de la fila › #240 R3: 31 dic 20:00 local, ya 2027 en UTC, visto el 31 dic`
- `#240: año en la fecha de la fila › #240 R3: 31 dic 22:00 local con reloj y fecha ya en 2027 UTC`
- `#240: año en la fecha de la fila › #240 R3: inglés, 31 dic 20:00 local visto el 31 dic`

Mínimos requeridos: OK, todos presentes.
Restauración a HEAD y ambas comprobaciones de diff: OK. Sonda sin commit.

### S5

Mutación:

```ts
const date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
```

Log: `s5_mobile-reminder-date-year.log`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       9 failed, 163 passed, 172 total
Time:        16.408 s, estimated 18 s
```

Rojos:

- `#178 R6: fila del canvas › formatea la fecha y hora próxima y conserva sus días en text-13 (enmendado por #240 R1)`
- `#178 R6: fila del canvas › formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13) (enmendado por #240 R1)`
- `#240: año en la fecha de la fila › #240 R1: próximo del año que viene (ejemplo del humano)`
- `#240: año en la fecha de la fila › #240 R1: mañana 1 ene visto el 31 dic`
- `#240: año en la fecha de la fila › #240 R1: enviado de diciembre visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R1: inglés, próximo del año que viene`
- `#240: año en la fecha de la fila › #240 R3: 31 dic 18:00 local, ya 2027 en UTC, visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R3: inglés, 31 dic 18:00 local visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R5: pasa es-MX y el año a toLocaleDateString para una fecha de otro año`

Mínimos requeridos: OK, todos presentes.
Restauración a HEAD y ambas comprobaciones de diff: OK. Sonda sin commit.

### S6

Mutación:

```ts
due.getFullYear() === 2026
```

Log: `s6_mobile-reminder-date-year.log`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 168 passed, 172 total
Time:        17.57 s
```

Rojos:

- `#240: año en la fecha de la fila › #240 R1: enviado de diciembre visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R2: hoy 1 ene por la noche visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R3: 31 dic 18:00 local, ya 2027 en UTC, visto el 1 ene`
- `#240: año en la fecha de la fila › #240 R3: inglés, 31 dic 18:00 local visto el 1 ene`

Mínimos requeridos: OK, todos presentes.
Restauración a HEAD y ambas comprobaciones de diff: OK. Sonda sin commit.

### S7

Mutación:

```ts
const date = new Intl.DateTimeFormat(locale, due.getFullYear() === new Date(now).getFullYear()
      ? { day: 'numeric', month: 'short' }
      : { day: 'numeric', month: 'short', year: 'numeric' }).format(due);
```

Log: `s7_mobile-reminder-date-year.log`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 170 passed, 172 total
Time:        17.678 s, estimated 18 s
```

Rojos:

- `#65 R15: la fecha del recordatorio se formatea con el locale del idioma › passes es-MX explicitly to the date formatter (enmendado por #240 R5)`
- `#240: año en la fecha de la fila › #240 R5: pasa es-MX y el año a toLocaleDateString para una fecha de otro año`

Mínimos requeridos: OK, todos presentes.
Restauración a HEAD y ambas comprobaciones de diff: OK. Sonda sin commit.

### S8

Mutación:

```ts
until.getFullYear() === new Date(now).getUTCFullYear()
```

Log: `s8_mobile-reminder-date-year.log`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 171 passed, 172 total
Time:        18.452 s
```

Rojos:

- `#240: año en la fecha de la fila › #240 R4: hasta enero visto el 31 dic local con 2027 en UTC`

Mínimos requeridos: OK, todos presentes.
Restauración a HEAD y ambas comprobaciones de diff: OK. Sonda sin commit.

Todas las sondas dieron sus rojos mínimos y solo fallaron por las aserciones de
texto u opciones del formateador. S4 produjo además el rojo de
`R6: lista con pills, badges y refetch on focus › renders summaries and reminder rows by section (enmendado por #213 R16) (enmendado por #227 R13)`:
ese test previo calcula una fecha sin año para agosto de 2026, y la mutación
«año siempre» la cambia. Es un rojo adicional permitido por el mínimo de S4,
con causa conocida. No hubo SIGKILL, «failed to run», timeout ni repetición.

## Trazabilidad y cierre acotado

5. `498037f1` — `docs(spec): #240 traceability`.
   Ocho filas con el test, hash y mensaje literal de cada commit de tests y,
   cuando corresponde, de producción. Cero filas pendientes. Solo documentación;
   conserva el contenido de producción y tests verificado en verde (172/172).
   Sin rebase posterior.

Diff desde el commit del handoff, con
`B=$(git log -1 --format=%h -- progress/handoff_mobile-reminder-date-year.md)`:
`B = 3b650137`.

`git diff --name-only "$B"..HEAD`:

```text
mobile-pet-tracker/src/screens/reminders/index.test.tsx
mobile-pet-tracker/src/screens/reminders/index.tsx
specs/mobile-reminder-date-year/traceability.md
```

Solo archivos de la lista cerrada. El reporte queda como artefacto local de
`progress/` para el leader, igual que en #239.

Producción, `git diff "$B"..HEAD -- mobile-pet-tracker/src/screens/reminders/index.tsx`:
`grep -c '^-[^-]'` = **1**, `grep -c '^+[^+]'` = **3**. Comparación completa
contra B: el fuente final es exactamente el original con la sustitución literal
del diseño. Ninguna sonda queda plantada.

Comparación del test contra B: solo las tres enmiendas prescritas y el
`describe` nuevo al final. Imports, mocks, helpers y el bloque de #239 intactos.
Los literales se copiaron de la spec sin recalcularlos.

Tras S8 se repitieron los checks finales exigidos por el handoff:

- `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/tsc-240.log 2>&1; echo $?`:
  **0**, log vacío; el archivo generado no existe y nunca se borró.
- `bunx expo lint --no-cache > /tmp/lint-240.log 2>&1 && test ! -s /tmp/lint-240.log && echo LINT_OK`:
  exit **0**, **LINT_OK**, log vacío.
- Anclas finales, medidas otra vez con `grep -oF` y `wc -l`: **0, 1, 1, 1,
  2, 4, 2, 5, 0, 0**, en el orden de §Evidencia. Sufijos de tests:
  **2** para R1 y **1** para R5. Todas coinciden.
- `git status --short -- mobile-pet-tracker specs`: vacío.
  `git diff --cached --quiet` y `git diff --check`: exit 0.
  Estado global: solo `?? progress/impl_mobile-reminder-date-year.md` antes
  de crear el marcador ignorado.

No hubo condición PARA ni discrepancias de P, anclas, rojos esperados o mínimos
de las sondas. Dos scripts auxiliares de documentación/comprobación necesitaron
correcciones: una lectura relativa de `progress/` se lanzó desde la carpeta
móvil y se repitió desde la raíz; el selector de filas de trazabilidad también
capturaba la cabecera «Requisito» y se restringió a R1–R5 antes de escribir.
Ninguno alteró código, tests ni cifras de los gates.

No se ejecutó `./init.sh`, ni se instalaron dependencias, sincronizaron ramas,
abrieron o editaron PRs, o modificaron bookkeeping, otras specs o G2. El leader
corre `./init.sh` y abre la PR hacia `dev`. El smoke G2 del humano sigue
pendiente: debe observar los formatos de Hermes en Android y ambos idiomas y
temas. No se ejecutó la suite móvil completa fuera del alcance del handoff.
