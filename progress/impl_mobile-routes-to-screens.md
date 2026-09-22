# Implementación — mobile-routes-to-screens (#102)

## Baseline

- Fecha: 2026-09-22.
- Comando: `cd mobile-pet-tracker && bun run test > /tmp/mobile-routes-base.txt`.
- Exit: `JEST_EXIT=0`.
- Resultado: `Test Suites: 77 passed, 77 total`; `Tests: 1386 passed, 1386 total`.

## Evidencia rojo → verde

### R2 — map

- Commit rojo: `b5562651`.
- Rojo, body: `JEST_EXIT=0`; 1 suite, 58/58 tests.
- Rojo, candados: `JEST_EXIT=1`; 4 suites fallaron y 1 pasó; 10 tests fallaron
  y 141 pasaron. Los fallos nombraron `ENOENT` sobre
  `src/app/(tabs)/map.tsx`, todavía referenciado por los candados.
- Verde: `JEST_EXIT=0`; 6 suites y 209/209 tests (body 58 + candados
  2/25/41/57/26) pasaron.

## R7 — escaneo de tests colocados

Pendiente.

## R8 — cierre

Pendiente.

## R-id → commit

- R1: `ca2d6f80` — `docs(conventions): excepcion A10 para migracion en frio (R1)`.

## Desviaciones de tasks.md

- tasks.md ordena crear el route delgado en el commit rojo, pero eso contradice
  dos comprobaciones de la misma spec: los candados no pueden fallar por
  `ENOENT` si el path sigue existiendo y `git diff -M` no puede presentar el
  cuerpo como rename si el path origen se recrea en el mismo snapshot. La
  creación de cada route se desplaza al commit verde; no cambia el estado final
  ni el orden rojo → verde y permite cumplir ambos candados observables.
