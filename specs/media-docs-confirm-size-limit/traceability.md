---
feature: "media-docs-confirm-size-limit"
status: draft        # draft | approved
tags: [harness, spec, backend, media]
---

# Trazabilidad — [[media-docs-confirm-size-limit]]

Rutas relativas a `backend-pet-tracker/`. Los nombres de test son los de
[[tasks]]; los hashes los rellena el implementer tras cada commit (rojo y
verde en la misma celda, `rojo → verde`).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente — `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts::#161 R1: getObjectSize devuelve ContentLength o falla sin él` (3 its) + `#157 R7` adaptado (E1); E2, E3, E4 | pendiente |
| R2 | pendiente — `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts::#161 R2: ConfirmPetDocumentUploadUseCase aplica el límite de 10485760 bytes` (2 its); `src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts::#161 R2: mapPetDocumentError traduce PetDocumentTooLargeError a 409`; `test/media-docs.e2e-spec.ts::#161 R2: confirm contra LocalStack en la frontera de 10485760 bytes` (2 its); (c) por `#157 R5: ya confirmado …` (E2) | pendiente |
| R3 | pendiente — `confirm-pet-document-upload.use-case.spec.ts::#161 R3: ContentLength ausente no confirma`; `pet-document-error.mapper.spec.ts::#161 R3: mapPetDocumentError devuelve por identidad un error desconocido` | pendiente |
| R4 | pendiente — sin test propio: `progress/impl_media-docs-confirm-size-limit.md` (lint, test, test:e2e, `./init.sh` sin pipe; ocho greps; diff de `infra` y `mobile-pet-tracker` vacío) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `test|feat(<scope>): <desc> (#161 R<n>)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
