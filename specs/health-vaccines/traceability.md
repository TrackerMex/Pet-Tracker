---
feature: "health-vaccines"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[health-vaccines]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/health.schema.spec.ts::R1: schema y migracion de vacunas` | `aa12c8c feat(health-vaccines): add schema and catalog seed (R1,R2)` |
| R2 | `src/db/seed/vaccine-catalog.spec.ts::R2: seed idempotente del catalogo de vacunas`; `test/health-vaccines.e2e-spec.ts::elimina filas no canonicas y termina exactamente en 4 dog y 3 cat` | `aa12c8c feat(health-vaccines): add schema and catalog seed (R1,R2)`; `5d53ac3 test(health-vaccines): expose validation gaps (R2,R8)`; `eb9c67b fix(health-vaccines): close validation gaps (R2,R8)` |
| R3 | `test/health-vaccines.e2e-spec.ts::R3: GET /v1/vaccine-catalog` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R4 | `test/health-vaccines.e2e-spec.ts::R4: PetAccessGuard bloquea IDOR en las cuatro rutas` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R5 | `test/health-vaccines.e2e-spec.ts::R5: solo owner muta y miembros activos leen` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R6 | `src/modules/health/application/vaccine-date.spec.ts::R6: suma de meses calendario`; `test/health-vaccines.e2e-spec.ts::R6: alta desde catalogo` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R7 | `test/health-vaccines.e2e-spec.ts::R7: override y vacuna libre` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R8 | `test/health-vaccines.e2e-spec.ts::R8: validacion y errores de catalogo` (`fecha calendario invalida...`; `documentKey en POST...`) | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)`; `5d53ac3 test(health-vaccines): expose validation gaps (R2,R8)`; `eb9c67b fix(health-vaccines): close validation gaps (R2,R8)` |
| R9 | `test/health-vaccines.e2e-spec.ts::R9: historial ordenado` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R10 | `test/health-vaccines.e2e-spec.ts::R10: PATCH parcial aislado por mascota` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R11 | `test/health-vaccines.e2e-spec.ts::R11: DELETE aislado por mascota` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R12 | `src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts::R12: una escritura fallida nunca se audita`; `test/health-vaccines.e2e-spec.ts::R12: auditoria de mutaciones` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |
| R13 | `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R13 (health-vaccines #14): el perfil consulta la proxima vacuna futura`; `test/health-vaccines.e2e-spec.ts::R13: nextVaccine en perfil` | `f09c84f feat(health-vaccines): add vaccine API and profile (R3-R13)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
