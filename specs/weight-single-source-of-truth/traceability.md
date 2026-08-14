---
feature: "weight-single-source-of-truth"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[weight-single-source-of-truth]]

> Rutas relativas a `backend-pet-tracker/`. Los tests **nuevos** nombran su
> requisito como `R<n> (weight-single-source-of-truth #22): ...`; los tests
> **editados** que pertenecen a un requisito de `pets-crud-permissions` (#5)
> conservan su `describe` original (ver [[tasks]]).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/pets/application/dto/create-pet.dto.spec.ts` (filas 1-2 de `design.md` D3) + `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts` (filas 5-6) + `src/modules/pets/infrastructure/repositories/pet.drizzle.repository.spec.ts` (filas 9-10) | rojo `0f45ac4` (`test(weight-single-source-of-truth): define POST weight behavior (R1)`); verde pendiente |
| R2 | `src/modules/pets/application/dto/update-pet.dto.spec.ts` (filas 3-4) + `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts` (filas 7-8) + `test/pets.e2e-spec.ts` bloque R13/R13b (filas 11-12) | pendiente |
| R3 | `test/backfill-weights.e2e-spec.ts::R3 (weight-single-source-of-truth #22): ...` | pendiente |
| R4 | `test/backfill-weights.e2e-spec.ts::R4 (weight-single-source-of-truth #22): ...` | pendiente |
| R5 | N/A (cambio documental en `docs/data-model.md`, verificado por revisión manual del reviewer, no por test automatizado) | pendiente |
| R6 | `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts` (sin cambios) + `test/pets.e2e-spec.ts::PROFILE_KEYS` (sin cambios) + `test/devices.e2e-spec.ts::PROFILE_KEYS` (sin cambios) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" en la columna
Commit — la columna Test puede decir "N/A" solo para R5 (requisito
documental), nunca la columna Commit.
Convención de commit: `feat(weight-single-source-of-truth): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
