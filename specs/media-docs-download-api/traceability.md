---
feature: "media-docs-download-api"
status: draft        # draft | approved
tags: [harness, spec, backend, media]
---

# Trazabilidad — [[media-docs-download-api]]

Rutas relativas a `backend-pet-tracker/`. Los nombres de test son los de
[[tasks]]; los hashes los rellena el implementer tras cada commit (rojo y
verde en la misma celda, `rojo → verde`).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/media.schema.spec.ts::#157 R1: columna uploaded_at y migración 0019` (3 its) | `48ab7c46 test(media): red uploaded_at column and migration 0019 (#157 R1)` → `4c1d4014 feat(db): add pet_documents.uploaded_at, migration 0019 (#157 R1)` |
| R2 | `src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts` (E5, `uploadedAt: null`); `test/media-docs.e2e-spec.ts::#157 R2: POST deja el documento pendiente`; it de #49 R2 retitulado (E2) | `beb9fa97 test(media): red document is created pending (#157 R2)` → `9c3befeb feat(media): upload state and POST confirm (#157 R2,R5,R6)`; `2efd45fe test(media): red GET hides pending documents (#157 R2,R3)` → `dd9d9c56 feat(media): filter pending documents out of the list (#157 R2,R3)` |
| R3 | `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts::#157 R3: ListPetDocumentsUseCase delega en listUploadedByPet`; `test/media-docs.e2e-spec.ts::#157 R3: GET oculta los pendientes a los cuatro roles` (it.each × 4) | `2efd45fe test(media): red GET hides pending documents (#157 R2,R3)` → `dd9d9c56 feat(media): filter pending documents out of the list (#157 R2,R3)` |
| R4 | `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts::#157 R4: ListPetDocumentsUseCase firma una URL de lectura de 3600 s por documento`; `test/media-docs.e2e-spec.ts::#157 R4: cada documento listado trae downloadUrl de 3600 s` (it.each × 4); E3 | `4fbcc8d3 test(media): red downloadUrl and full download flow (#157 R4,R8)` → `faa11b3b feat(media): sign a 3600 s downloadUrl per document (#157 R4,R8)` |
| R5 | `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts::#157 R5: ConfirmPetDocumentUploadUseCase marca subido` (2 its); `test/media-docs.e2e-spec.ts::#157 R5: confirmar marca el documento como subido` (2 its); E4 | `469333fa test(media): red upload confirmation (#157 R5,R6)` → `9c3befeb feat(media): upload state and POST confirm (#157 R2,R5,R6)` |
| R6 | `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts::#157 R6: ConfirmPetDocumentUploadUseCase rechaza sin marcar` ((a), (b)/(c), (d), (g)); `test/media-docs.e2e-spec.ts::#157 R6: confirmar rechaza sin escribir` ((a), (b), (c), (d), it.each (e) × 3, (f)) | `469333fa test(media): red upload confirmation (#157 R5,R6)` → `9c3befeb feat(media): upload state and POST confirm (#157 R2,R5,R6)` |
| R7 | `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts::#157 R7: objectExists hace HEAD al bucket de media` (3 its) | `0616c45b test(media): red objectExists sends HEAD (#157 R7)` → `8417a680 feat(media): objectExists with HeadObjectCommand (#157 R7)` |
| R8 | `test/media-docs.e2e-spec.ts::#157 R8: flujo POST → PUT → confirm → GET → descarga contra LocalStack` (it.each × 2) | `4fbcc8d3 test(media): red downloadUrl and full download flow (#157 R4,R8)` → `faa11b3b feat(media): sign a 3600 s downloadUrl per document (#157 R4,R8)` |
| R9 | sin test propio — `progress/impl_media-docs-download-api.md::Verificación R9` (lint, test, test:e2e, `./init.sh` sin pipe; 4 greps; allowlist de `git diff --stat`) | sin commit propio: impl §Verificación R9 (test:e2e completo e ./init.sh los corre el leader) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
