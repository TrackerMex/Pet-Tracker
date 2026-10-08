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
| R1 | `src/db/schema/media.schema.spec.ts::#157 R1: columna uploaded_at y migración 0019` (3 its) | pendiente |
| R2 | `src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts` (E5, `uploadedAt: null`); `test/media-docs.e2e-spec.ts::#157 R2: POST deja el documento pendiente`; it de #49 R2 retitulado (E2) | pendiente |
| R3 | `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts::#157 R3: ListPetDocumentsUseCase delega en listUploadedByPet`; `test/media-docs.e2e-spec.ts::#157 R3: GET oculta los pendientes a los cuatro roles` (it.each × 4) | pendiente |
| R4 | `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts::#157 R4: ListPetDocumentsUseCase firma una URL de lectura de 3600 s por documento`; `test/media-docs.e2e-spec.ts::#157 R4: cada documento listado trae downloadUrl de 3600 s` (it.each × 4); E3 | pendiente |
| R5 | `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts::#157 R5: ConfirmPetDocumentUploadUseCase marca subido` (2 its); `test/media-docs.e2e-spec.ts::#157 R5: confirmar marca el documento como subido` (2 its); E4 | pendiente |
| R6 | `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts::#157 R6: ConfirmPetDocumentUploadUseCase rechaza sin marcar` ((a), (b)/(c), (d), (g)); `test/media-docs.e2e-spec.ts::#157 R6: confirmar rechaza sin escribir` ((a), (b), (c), (d), it.each (e) × 3, (f)) | pendiente |
| R7 | `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts::#157 R7: objectExists hace HEAD al bucket de media` (3 its) | pendiente |
| R8 | `test/media-docs.e2e-spec.ts::#157 R8: flujo POST → PUT → confirm → GET → descarga contra LocalStack` (it.each × 2) | pendiente |
| R9 | sin test propio — `progress/impl_media-docs-download-api.md::Verificación R9` (lint, test, test:e2e, `./init.sh` sin pipe; 4 greps; allowlist de `git diff --stat`) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
