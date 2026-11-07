---
feature: "users-account-deletion-api"
status: approved     # draft | approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[users-account-deletion-api]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/src/db/schema/created-by-set-null.schema.spec.ts::#247 R1: created_by nullable con ON DELETE SET NULL en las 5 tablas`; E1–E3 | `6a900be5 feat(db): created_by ON DELETE SET NULL, migración 0024 (R1)` |
| R2 | `backend-pet-tracker/src/modules/auth/infrastructure/guards/auth.guard.spec.ts::#247 R2: el guard exige que el usuario del token exista`; `backend-pet-tracker/test/users.e2e-spec.ts::#247 R2: GET /v1/me y GET /v1/pets responden 401 si el usuario del token ya no existe` | `e62b7bb9 feat(auth): el guard consulta users por PK (R2)` |
| R3 | `backend-pet-tracker/src/modules/users/infrastructure/users.controller.spec.ts::#247 R3: DELETE /v1/me exige JWT y responde 204`; `backend-pet-tracker/test/users.e2e-spec.ts::#247 R3: con la contraseña correcta responde 204 y borra el usuario y sus push_tokens` | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R4 | `backend-pet-tracker/test/users.e2e-spec.ts::#247 R4: GET /v1/me y GET /v1/pets responden 401 con el token anterior`; `backend-pet-tracker/test/users.e2e-spec.ts::#247 R4: DELETE /v1/me/push-tokens con el token anterior responde 401` | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R5 | `backend-pet-tracker/test/users.e2e-spec.ts::#247 R5: %s responde 400 Validation failed y el usuario sigue` (5 filas) | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R6 | `backend-pet-tracker/src/modules/users/infrastructure/users.controller.spec.ts::#247 R6: responde ForbiddenException con el body exacto`; `backend-pet-tracker/src/modules/users/application/use-cases/delete-account.use-case.spec.ts::#247 R6: no borra ni purga con contraseña incorrecta`; `backend-pet-tracker/test/users.e2e-spec.ts::#247 R6: responde 403 Invalid password y no borra usuario, mascota ni audita` | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R7 | `backend-pet-tracker/src/modules/users/infrastructure/users.controller.spec.ts::#247 R7: responde UnauthorizedException, nunca NotFoundException`; `backend-pet-tracker/src/modules/users/application/use-cases/delete-account.use-case.spec.ts::#247 R7: no verifica, borra ni purga si falta el usuario`; `backend-pet-tracker/src/modules/users/infrastructure/repositories/account-deletion.drizzle.repository.spec.ts::#247 R11: si el usuario no existe rechaza con UserNotFoundError sin escribir` | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R8 | `backend-pet-tracker/test/users.e2e-spec.ts::#247 R8: la mascota de un dueño único deja de existir`; `backend-pet-tracker/test/users.e2e-spec.ts::#247 R8: la mascota compartida desaparece también para el miembro family` | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R9 | `backend-pet-tracker/test/users.e2e-spec.ts::#247 R9: la mascota ajena sobrevive y created_by queda en NULL` | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R10 | `backend-pet-tracker/test/pets.e2e-spec.ts::#247 R10: DELETE /v1/pets/:id deja el collar asignado en available`; `backend-pet-tracker/test/users.e2e-spec.ts::#247 R10: el collar de la mascota borrada con la cuenta queda available` | `5ae914bc feat(pets): deletePetsTx libera collares antes de borrar (R10); 83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R11 | `backend-pet-tracker/src/modules/users/infrastructure/repositories/account-deletion.drizzle.repository.spec.ts::#247 R11: el borrado de cuenta es una sola transacción ordenada` (3 its) | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R12 | `backend-pet-tracker/test/users.e2e-spec.ts::#247 R12: deja una sola fila user.delete con user_id NULL, entity_id y meta.petIds` | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R13 | `backend-pet-tracker/src/modules/pets/application/use-cases/delete-pet.use-case.spec.ts::R16: DeletePetUseCase borra la mascota y audita pet.delete` (E7); `backend-pet-tracker/test/pets.e2e-spec.ts::#247 R13: DELETE /v1/pets/:id borra pets/<petId>/ y PET#<petId> y no toca otra mascota`; `backend-pet-tracker/src/modules/users/application/use-cases/delete-account.use-case.spec.ts::#247 R13: verifica, borra y purga en ese orden`; `backend-pet-tracker/test/users.e2e-spec.ts::#247 R13: borra pets/<petId>/ y PET#<petId> de cada mascota y no toca otra` | `7ab40b41 feat(pets): DeletePetUseCase purga tras borrar (R13); 83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R14 | `backend-pet-tracker/test/users.e2e-spec.ts::#247 R14: S3 caído responde 204, borra en Postgres, purga DynamoDB y registra PET_PURGE_FAILED` | `83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` |
| R15 | `backend-pet-tracker/src/modules/pets/infrastructure/pet-data-purger.aws.adapter.spec.ts::#247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota` (7 its) | `b84011b5 feat(pets): purga S3 y DynamoDB por mascota (R15)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
