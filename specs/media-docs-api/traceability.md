---
feature: "media-docs-api"
status: approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[media-docs-api]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts::R1: ListPetDocumentsUseCase delega en listByPet`; `test/media-docs.e2e-spec.ts::R1: GET lista documentos con el contrato móvil y orden date/id descendente` | `033286a test(media-docs-api): define document listing in red (R1)` → `0c9c06a feat(media-docs-api): list pet documents (R1)` |
| R2 | `src/modules/media/application/dto/create-pet-document.dto.spec.ts::R2: CreatePetDocumentSchema valida el body`; `src/modules/media/domain/document-key.spec.ts::R2: buildDocumentKey`; `src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts::R2: CreatePetDocumentUseCase persiste, firma y audita`; `test/media-docs.e2e-spec.ts::R2: POST owner emite URL, persiste y audita; rechazos no escriben` | `5380036 test(media-docs-api): define document upload in red (R2)` → `efa0864 feat(media-docs-api): create pet document uploads (R2)` |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(media-docs-api): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
