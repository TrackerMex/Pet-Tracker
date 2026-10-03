---
feature: "mobile-jest-mock-hygiene"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-jest-mock-hygiene]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/screens/add-pet/index.test.tsx::R1 (mobile-jest-mock-hygiene): el mock del picker se reinicializa por test` | `79caf8c` `test(mobile-jest-mock-hygiene): red picker mock leaks across tests (R1)` (rojo) → `43183c4` `fix(mobile-jest-mock-hygiene): reset picker mock before each test (R1)` (verde) |
| R2 | sin test propio — `progress/impl_mobile-jest-mock-hygiene.md::§R2`; bucle D6, 10/10, `Tests: 8 passed, 8 total` | `e72612f` `test(mobile-jest-mock-hygiene): record 10 green runs (R2)` |
| R3 | sin test propio — `progress/impl_mobile-jest-mock-hygiene.md::§R3`; `./init.sh` exit 0, 53 suites / 613 tests, `git diff` vacío | `c5a9ee2` `test(mobile-jest-mock-hygiene): record full-suite verification (R2,R3)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Notas para rellenar:

- R1: columna Test =
  `src/screens/add-pet/index.test.tsx::R1 (mobile-jest-mock-hygiene): el mock del picker se reinicializa por test`;
  columna Commit = hash del rojo → hash del verde (dos commits).
- R2 y R3 no tienen test propio (precedente: #52 R5). Columna Test =
  `sin test propio — progress/impl_mobile-jest-mock-hygiene.md::§R2` (o
  `§R3`) con el comando y el resultado ("10/10, `Tests: 8 passed`";
  "`./init.sh` exit 0, 53 suites / 613 tests, `git diff` vacío").
