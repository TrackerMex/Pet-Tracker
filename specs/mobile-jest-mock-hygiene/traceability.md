---
feature: "mobile-jest-mock-hygiene"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-jest-mock-hygiene]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |

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
