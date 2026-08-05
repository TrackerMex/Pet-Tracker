---
feature: "pet-photos-s3"
status: approved        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[pet-photos-s3]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/media/domain/photo-key.spec.ts::R1: buildPhotoKey genera la clave S3 pets/<petId>/photo-<ts>` + `src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts::R1: RequestPhotoUploadUrlUseCase persiste la clave y emite un PUT prefirmado de 10 min` + `test/media.e2e-spec.ts::R1: owner + contentType valido responde 200 con uploadUrl PUT prefirmado de 10 min` | `801e3cf` feat(pet-photos-s3): pure S3 photo key builder (R1) · use case `d3295cb` feat(pet-photos-s3): photo storage port and upload url use case (R1,R2,R5) · endpoint/200 `919a844` feat(pet-photos-s3): S3 adapter, upload endpoint and module wiring (R1,R3,R4) · e2e `066d67f` test(pet-photos-s3): e2e over postgres and localstack for the upload flow |
| R2 | `src/modules/media/application/dto/request-photo-upload-url.dto.spec.ts::R2: RequestPhotoUploadUrlSchema rechaza contentType ausente o no soportado` + `test/media.e2e-spec.ts::R2: contentType ausente o no soportado responde 400 sin persistir` | `656b4cd` feat(pet-photos-s3): content type validation for upload requests (R1,R2) · e2e `066d67f` |
| R3 | `test/media.e2e-spec.ts::R3: miembro activo con rol distinto de owner responde 403 sin persistir` | `919a844` feat(pet-photos-s3): S3 adapter, upload endpoint and module wiring (R1,R3,R4) (`@RequirePetRole('owner')`) · e2e `066d67f` |
| R4 | `test/media.e2e-spec.ts::R4: mascota ajena, inexistente o malformada responde el 404 generico del guard` | `919a844` feat(pet-photos-s3): S3 adapter, upload endpoint and module wiring (R1,R3,R4) (reutiliza `PetAccessGuard`) · e2e `066d67f` |
| R5 | `src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts::R5: registra pet.photo_update en AuditLogger solo cuando la peticion tiene exito` + `test/media.e2e-spec.ts::R5: el POST exitoso audita pet.photo_update; 400/403/404 no auditan nada` | `d3295cb` feat(pet-photos-s3): photo storage port and upload url use case (R1,R2,R5) · e2e `066d67f` |
| R6 | `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R6 (pet-photos-s3 #6): con photoKey no nulo, photoUrl viene de PET_PHOTO_URL_RESOLVER (1 h)` + `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts::R6 (pet-photos-s3 #6): photoUrl recibido se incluye tal cual` + `src/modules/pets/infrastructure/pets.controller.spec.ts::R6 (pet-photos-s3 #6): el detalle serializa el photoUrl resuelto por el use case` + e2e implicito en `test/media.e2e-spec.ts::R9` (verifica `photoUrl` con parametros SigV4 tras un POST exitoso) | `4aed47a` feat(pet-photos-s3): resolve photoUrl in the pet detail response (R6,R7) · e2e `066d67f` |
| R7 | `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R7 (pet-photos-s3 #6): con photoKey nulo, photoUrl es null sin invocar el resolver` | `4aed47a` feat(pet-photos-s3): resolve photoUrl in the pet detail response (R6,R7) |
| R8 | `test/media.e2e-spec.ts::R8: el bucket nunca es publico — GET directo sin firma responde 403` — **test escrito exactamente segun la spec pero hoy en ROJO en este entorno**: verificado experimentalmente que LocalStack Community 4.14 (`docker-compose.yml`) no aplica el `PutPublicAccessBlock` de #2 ni una bucket policy `Deny` explicita al plano de datos de S3 — un GET anonimo sobre un objeto existente responde `200`, no `403`. Detalle completo en `progress/impl_pet-photos-s3.md` §"Hallazgo R8". No es un defecto del codigo de esta feature (`PHOTO_STORAGE` solo emite URLs firmadas); **Decision humana (2026-08-05): aceptada como limitacion documentada del entorno local** (mismo precedente que `localstack-provisioning` #2 R13) — no bloquea el cierre de la feature; la garantia real de "nunca publico" vive en revision de codigo (`PHOTO_STORAGE` solo emite URLs firmadas) | `066d67f` test(pet-photos-s3): e2e over postgres and localstack for the upload flow |
| R9 | `test/media.e2e-spec.ts::R9: flujo end-to-end — pedir URL, subir con PUT, leer photoUrl descargable` | `066d67f` test(pet-photos-s3): e2e over postgres and localstack for the upload flow |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
