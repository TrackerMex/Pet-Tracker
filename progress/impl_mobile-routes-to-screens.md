# Implementación — mobile-routes-to-screens (#102)

## Baseline

- Fecha: 2026-09-22.
- Comando: `cd mobile-pet-tracker && bun run test > /tmp/mobile-routes-base.txt`.
- Exit: `JEST_EXIT=0`.
- Resultado: `Test Suites: 77 passed, 77 total`; `Tests: 1386 passed, 1386 total`.

## Evidencia rojo → verde

### R2 — map

- Commit rojo: `b5562651`.
- Commit verde: `762c6525`.
- Rojo, body: `JEST_EXIT=0`; 1 suite, 58/58 tests.
- Rojo, candados: `JEST_EXIT=1`; 4 suites fallaron y 1 pasó; 10 tests fallaron
  y 141 pasaron. Los fallos nombraron `ENOENT` sobre
  `src/app/(tabs)/map.tsx`, todavía referenciado por los candados.
- Verde: `JEST_EXIT=0`; 6 suites y 209/209 tests (body 58 + candados
  2/25/41/57/26) pasaron.

### R3 — health

- Commit rojo: `95ee54fc`.
- Commit verde: `64168387`.
- Rojo, body: `JEST_EXIT=0`; 1 suite, 28/28 tests.
- Rojo, candados: `JEST_EXIT=1`; 4 suites fallaron y 1 pasó; 11 tests fallaron
  y 140 pasaron. Los fallos nombraron `ENOENT` sobre
  `src/app/(tabs)/health.tsx`.
- Verde: `JEST_EXIT=0`; 6 suites y 179/179 tests (body 28 + candados
  2/25/41/57/26) pasaron.

### R4 — weight-log

- Commit rojo: `d0df4df2`.
- Commit verde: `9f0240af`.
- Rojo, body: `JEST_EXIT=0`; 1 suite, 32/32 tests.
- Rojo, candados: `JEST_EXIT=1`; 3 suites fallaron y 2 pasaron; 9 tests fallaron
  y 142 pasaron. Los fallos nombraron `ENOENT` sobre
  `src/app/(tabs)/weight-log.tsx`.
- Verde: `JEST_EXIT=0`; 6 suites y 183/183 tests (body 32 + candados
  2/25/41/57/26) pasaron.

### R5 — meal-schedule

- Commit rojo: `1d16260d`.
- Commit verde: `e86c6f66`.
- Rojo, body: `JEST_EXIT=0`; 1 suite, 23/23 tests.
- Rojo, candados: `JEST_EXIT=1`; 4 suites fallaron y 1 pasó; 9 tests fallaron
  y 142 pasaron. Los fallos nombraron `ENOENT` sobre
  `src/app/(tabs)/meal-schedule.tsx`.
- Verde: `JEST_EXIT=0`; 6 suites y 174/174 tests (body 23 + candados
  2/25/41/57/26) pasaron.

### R6 — ternario invertido

- Commit: `73bb67df`.
- `JEST_EXIT=0`; design-drift: 1 suite, 41/41 tests.

## R7 — escaneo de tests colocados

- Patrón arbitrario: los cuatro ficheros devolvieron `0`; grep exit 1 por cero
  coincidencias.
- `rounded-[20px]` / `text-[10px]`: ninguna coincidencia; grep exit 1.
- `sourceFiles()` líneas 25–35 comparado con `3a52028b`: `cmp` exit 0, idéntico.
- design-drift: `JEST_EXIT=0`; 1 suite, 41/41 tests.

## R8 — cierre

- Suite completa: `JEST_EXIT=0`; 77/77 suites, 1386/1386 tests y 1/1 snapshot.
- Typecheck: `TSC_EXIT=0`; `/tmp/mobile-routes-tsc.txt` con 0 bytes.
- Suites individuales, todas con 1 suite y exit 0:

  | Suite | Antes | Después |
  |---|---:|---:|
  | map | 58 | 58 |
  | health | 28 | 28 |
  | weight-log | 32 | 32 |
  | meal-schedule | 23 | 23 |
  | screens | 2 | 2 |
  | design-drift | 41 | 41 |
  | consistency-classnames | 57 | 57 |
  | legibility-classnames | 26 | 26 |
  | ui-language | 25 | 25 |
  | ui-copy-table | 2 | 2 |

- `package.json` y `bun.lock`: diff vacío contra `3a52028b` (0 bytes).
- `git log --stat=200 -M 3a52028b..HEAD`: ocho renames visibles, cuatro
  bodies y cuatro tests.
- Numstat de cada body en su commit rojo: `1/1`; el único cambio fue
  `export default function XScreen` → `export function XScreen`.
- Diff de los cuatro tests movidos: cero líneas añadidas o borradas con
  `expect(`, `describe(`, `it(` o `test(`; las aserciones permanecen intactas.

## R9 — deuda nombrada

- Descripción #102: `325` = 0, `388` = 0, `406` = 1, `374` = 1 y
  `DEUDA NOMBRADA` = 1.
- Los cuatro bodies movidos conservan 406, 279, 341 y 324 líneas.
- No se abrió ni se recontó `food.tsx`: el handoff lo prohíbe mientras
  #106/#107 escriben ese fichero. El valor 374 y la deuda proceden del commit
  humano aprobado `7098f985`.

## R-id → commit

- R1: `ca2d6f80` — `docs(conventions): excepcion A10 para migracion en frio (R1)`.
- R2: rojo `b5562651`; verde `762c6525`.
- R3: rojo `95ee54fc`; verde `64168387`.
- R4: rojo `d0df4df2`; verde `9f0240af`.
- R5: rojo `1d16260d`; verde `e86c6f66`.
- R6: `73bb67df`.
- R7: `1d16260d` (último test movido); verificado tras `73bb67df`.
- R8: `73bb67df` (último commit de código); verificación final 77/1386.
- R9: `7098f985`.

## Desviaciones de tasks.md

- tasks.md ordena crear el route delgado en el commit rojo, pero eso contradice
  dos comprobaciones de la misma spec: los candados no pueden fallar por
  `ENOENT` si el path sigue existiendo y `git diff -M` no puede presentar el
  cuerpo como rename si el path origen se recrea en el mismo snapshot. La
  creación de cada route se desplaza al commit verde; no cambia el estado final
  ni el orden rojo → verde y permite cumplir ambos candados observables.
- R9 pide al leader recontar `food.tsx`, pero el handoff prohíbe abrirlo por la
  regla de un solo escritor. Se verificó la entrada aprobada de
  `feature_list.json` sin leer ese fichero.
