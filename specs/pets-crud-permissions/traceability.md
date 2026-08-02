---
feature: "pets-crud-permissions"
status: approved        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[pets-crud-permissions]]

Rutas relativas a `backend-pet-tracker/`. El nombre del test es el `describe`
que nombra el R-id (varios R-ids tienen cobertura unitaria y e2e).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/pets.schema.spec.ts::R1: la migracion crea pets conforme a docs/data-model.md`, `::R1: la migracion crea pet_users conforme a docs/data-model.md`, `::R1: el SQL de la migracion nueva no toca audit_log` | `c2d889b` feat(pets): add pets and pet_users tables with migration (R1) |
| R2 | `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts::R2`, `src/modules/pets/infrastructure/repositories/pet.drizzle.repository.spec.ts::R2`, `src/modules/pets/infrastructure/pets.controller.spec.ts::R2`, `test/pets.e2e-spec.ts::R2` (incluye rollback por FK) | `feb498b` feat(pets): add POST /v1/pets with owner transaction and audit (R2,R3); e2e `12e7946` |
| R3 | `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts::R3`, `test/pets.e2e-spec.ts::R3` | `feb498b` (R2,R3); e2e `12e7946` |
| R4 | `src/modules/pets/application/dto/create-pet.dto.spec.ts::R4` (x2), `src/modules/pets/infrastructure/pets.controller.spec.ts::R4`, `test/pets.e2e-spec.ts::R4` | `ae1c7d4` feat(pets): add CreatePetSchema with age XOR validation (R4,R5); e2e `12e7946` |
| R5 | `src/modules/pets/application/dto/create-pet.dto.spec.ts::R5`, `test/pets.e2e-spec.ts::R5` | `ae1c7d4` (R4,R5); e2e `12e7946` |
| R6 | `src/modules/pets/domain/entities/pet.entity.spec.ts::R6` (x2: birth_date y approx anclada) | `f645591` feat(pets): add Pet entity and calculateAgeMonths pure function (R6) |
| R7 | `src/modules/pets/application/use-cases/list-pets.use-case.spec.ts::R7`, `src/modules/pets/infrastructure/pets.controller.spec.ts::R7`, `test/pets.e2e-spec.ts::R7` (incluye status revoked) | `36ae852` feat(pets): add GET /v1/pets listing active memberships with myRole (R7); e2e `12e7946` |
| R8 | `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts::R8` (24 claves exactas), `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R8`, `src/modules/pets/infrastructure/pets.controller.spec.ts::R8`, `test/pets.e2e-spec.ts::R8` | `411816e` feat(pets): add GET /v1/pets/:petId behind PetAccessGuard (R8-R12); e2e `12e7946` |
| R9 | `src/modules/pets/infrastructure/guards/pet-access.guard.spec.ts::R9`, `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R9`, `src/modules/pets/infrastructure/pets.controller.spec.ts::R9`, **e2e IDOR obligatorio** `test/pets.e2e-spec.ts::R9: IDOR — usuario B sobre mascota de A recibe 404 indistinguible` (GET/PATCH/DELETE, mismo body que petId inexistente) | `411816e` (R8-R12); e2e `12e7946` |
| R10 | `src/modules/pets/infrastructure/guards/pet-access.guard.spec.ts::R10` (sin tocar la base), `test/pets.e2e-spec.ts::R10` | `411816e` (R8-R12); e2e `12e7946` |
| R11 | `src/modules/pets/infrastructure/guards/pet-access.guard.spec.ts::R11` (family/walker/vet → 403; 404 precede a 403), `test/pets.e2e-spec.ts::R11` | `411816e` (R8-R12); e2e `12e7946` |
| R12 | `src/modules/pets/infrastructure/guards/pet-access.guard.spec.ts::R12` (4 roles), `test/pets.e2e-spec.ts::R12` | `411816e` (R8-R12); e2e `12e7946` |
| R13 | `src/modules/pets/application/dto/update-pet.dto.spec.ts::R13`, `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts::R13`, `src/modules/pets/infrastructure/pets.controller.spec.ts::R13`, `test/pets.e2e-spec.ts::R13` (incluye atomicidad del 400) | `4a8cdc0` feat(pets): add PATCH /v1/pets/:petId for owners (R13,R14,R15); e2e `12e7946` |
| R14 | `src/modules/pets/application/dto/update-pet.dto.spec.ts::R14`, `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts::R14` (NULL cruzado), `src/modules/pets/infrastructure/pets.controller.spec.ts::R14`, `test/pets.e2e-spec.ts::R14` | `4a8cdc0` (R13,R14,R15); e2e `12e7946` |
| R15 | `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts::R15` (x2: meta.fields y no-op sin auditoria), `test/pets.e2e-spec.ts::R15` | `4a8cdc0` (R13,R14,R15); e2e `12e7946` |
| R16 | `src/modules/pets/application/use-cases/delete-pet.use-case.spec.ts::R16`, `src/modules/pets/infrastructure/pets.controller.spec.ts::R16`, `test/pets.e2e-spec.ts::R16` (204, cascade, audit, 404 posterior, fuera del listado) | `6044e43` feat(pets): add DELETE /v1/pets/:petId for owners (R16); e2e `12e7946` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
