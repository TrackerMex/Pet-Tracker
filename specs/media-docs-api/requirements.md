---
feature: "media-docs-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Requisitos — [[media-docs-api]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D7) y `docs/architecture.md` (capas
> domain/application/infrastructure — esta feature es 100% backend).
> Aplican `docs/conventions.md`: kebab-case con sufijos, alias `@/...`,
> DTOs zod, errores de dominio tipados, tests que nombran su R-id.
> Contratos verificados contra el código real el 2026-08-25
> (`mobile-pet-tracker/src/api/media.ts` + `src/api/__tests__/media.test.ts`
> como consumidor; `media.controller.ts`, `request-photo-upload-url.use-case.ts`,
> `photo-storage.s3.adapter.ts`, `pet-photo-read.module.ts` como base a
> extender; `reminders.controller.ts` / specs/reminders-api como patrón).

## Contexto fijo (no reabrir)

- Origen: decisión Q1 del gate humano de #40 (2026-08-24) — el backend de
  documentos va en feature aparte, patrón #47 reminders-api. **El smoke de
  la pantalla Docs de #40 está bloqueado hasta que esta feature esté
  `done`.**
- **El contrato del GET ya está consumido** por la pantalla Docs
  (`listPetDocs` en `mobile-pet-tracker/src/api/media.ts`): URL
  `GET <base>/v1/pets/:petId/media` con `Authorization: Bearer <jwt>`,
  respuesta 200 con **array JSON plano** (no objeto envolvente) donde cada
  elemento cumple `{id: string, type: string, name: string, date: string}`
  (campos extra tolerados; ver [[design]] §D1 campo a campo). El backend
  debe cumplirlo tal cual — el contrato NO se renegocia aquí.
- El módulo `backend-pet-tracker/src/modules/media/` HOY expone solo
  `POST /v1/pets/:petId/photo-upload-url` (owner, 200) y queda **intacto**
  (R4). `PetPhotoReadModule` ya exporta `PHOTO_STORAGE`
  (`PhotoStorageS3Adapter`: `createUploadUrl`/`createDownloadUrl` firmadas
  contra el bucket `pet-tracker-media-local` de LocalStack, provisionado
  en #2). `MediaModule` ya importa `PetsModule` (guard) y
  `PetPhotoReadModule` — no hay imports nuevos de módulo.
- `PetAccessGuard` + `@RequirePetRole` (de pets) dan el 404 genérico de
  no-miembro y el 403 por rol, igual que en photo-upload-url y reminders.
- No existe tabla de documentos: esta feature crea `pet_documents`
  (schema Drizzle + migración, [[design]] §D5). Ningún recurso AWS real:
  todo cliente S3 sale de `S3_CLIENT` (@Global, `AWS_MODE=local` →
  `AWS_ENDPOINT_URL`). Sin variables de entorno nuevas.

## Requisitos funcionales

### Listado

- **R1**: WHEN un usuario con membresía activa sobre la mascota (cualquier
  rol: owner, caregiver o viewer) hace `GET /v1/pets/:petId/media` THE
  SYSTEM SHALL responder 200 con un **array JSON plano** de
  `PetDocumentResponse` (`{id, type, name, date, vet, key}`, [[design]]
  §D1) con TODOS los documentos de la mascota ordenados por `date`
  descendente y desempate por `id` descendente (uuidv7 = orden temporal),
  `[]` si no hay ninguno; IF el solicitante no es miembro activo o el
  `:petId` es inexistente/malformado THEN el `PetAccessGuard` existente
  SHALL responder 404 (el endpoint NO lleva `@RequirePetRole`, como los
  GET de nutrition y el GET de reminders). Capas y firmas exactas en
  [[design]] §D7:
  - db: tabla `pet_documents` en `src/db/schema/media.schema.ts` +
    re-export en `src/db/schema/index.ts` + migración `pnpm run db:generate`;
  - domain: `PetDocument` en `domain/entities/pet-document.entity.ts`;
    `PetDocumentRepository` (token `PET_DOCUMENT_REPOSITORY`) con
    `listByPet(petId: string): Promise<PetDocument[]>` en
    `domain/repositories/pet-document.repository.ts`;
  - infrastructure: `PetDocumentDrizzleRepository` en
    `infrastructure/repositories/pet-document.drizzle.repository.ts`;
  - application: `ListPetDocumentsUseCase.execute(petId):
    Promise<PetDocument[]>` en
    `application/use-cases/list-pet-documents.use-case.ts`;
  - infrastructure: `PetMediaController` (`@Controller('pets/:petId/media')`,
    `@UseGuards(PetAccessGuard)`) con método `@Get()` `list()`, registrado
    en `media.module.ts`; mapper `toPetDocumentResponse` en
    `infrastructure/mappers/pet-document.mapper.ts`.
  *Tests:
  `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts`
  (nuevo) → `describe('R1: ListPetDocumentsUseCase delega en listByPet', ...)`;
  `test/media-docs.e2e-spec.ts` (nuevo) → casos `R1:` — 200 con los campos
  exactos del contrato móvil en orden `date` desc, 200 `[]` sin
  documentos, 200 para caregiver y viewer, 404 no-miembro, 404 `:petId`
  malformado. ROJO primero.*

### Upload

- **R2**: WHEN el owner de la mascota hace `POST /v1/pets/:petId/media`
  con body válido según `CreatePetDocumentSchema`
  (`{type, name, date, vet?}`, [[design]] §D6) THE SYSTEM SHALL generar
  `id = uuidv7()` y `key = buildDocumentKey(petId, id)`
  (`pets/<petId>/docs/<id>`), persistir la fila en `pet_documents`,
  obtener del `PHOTO_STORAGE` existente una URL PUT prefirmada
  (`createUploadUrl(key, 600)`) y responder **201** con
  `{document: PetDocumentResponse, uploadUrl: string, expiresInSeconds: 600}`;
  AND tras el éxito SHALL auditar
  `{action: 'pet.document_add', entity: 'pet', entityId: petId, userId, meta: {key}}`
  vía `AUDIT_LOGGER` (mismo patrón que `pet.photo_update`);
  - IF el body no cumple el schema THEN SHALL responder 400 sin persistir
    ni auditar (ZodError → `BadRequestException`, patrón `parseBody` del
    controller de media);
  - IF el solicitante es caregiver o viewer THEN SHALL responder 403 sin
    persistir (`@RequirePetRole('owner')`, D2 de esta spec = D1 de #6);
  - IF el solicitante no es miembro THEN SHALL responder 404 (guard).
  Capas y firmas exactas en [[design]] §D7 (dto zod, `buildDocumentKey`
  puro en domain, `create(document: PetDocument): Promise<void>` en el
  repositorio, `CreatePetDocumentUseCase`, método `@Post()` en
  `PetMediaController`).
  *Tests:
  `src/modules/media/application/dto/create-pet-document.dto.spec.ts`
  (nuevo) → `describe('R2: CreatePetDocumentSchema valida el body', ...)`;
  `src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts`
  (nuevo) → `describe('R2: CreatePetDocumentUseCase persiste, firma y audita', ...)`;
  `src/modules/media/domain/document-key.spec.ts` (nuevo) →
  `describe('R2: buildDocumentKey', ...)`;
  `test/media-docs.e2e-spec.ts` → casos `R2:` — 201 con document +
  uploadUrl + expiresInSeconds 600 y fila persistida (aparece en GET),
  auditoría escrita, 400 body inválido sin fila nueva ni audit, 403
  caregiver, 404 no-miembro. ROJO primero.*

### Flujo end-to-end

- **R3**: WHEN un cliente completa el flujo documento — `POST
  /v1/pets/:petId/media`, luego `PUT` de los bytes crudos a `uploadUrl`
  **sin** header `Authorization` — THE SYSTEM SHALL aceptar el PUT
  (status 2xx contra LocalStack) AND el documento SHALL aparecer en el
  `GET /v1/pets/:petId/media` posterior con los mismos
  `{id, type, name, date, vet, key}` del 201, AND el objeto subido SHALL
  ser legible bajo esa `key` en el bucket `pet-tracker-media-local`
  (mismo mecanismo de verificación directa contra `AWS_ENDPOINT_URL` que
  el caso R9 de `test/media.e2e-spec.ts`).
  *Test: `test/media-docs.e2e-spec.ts` → `describe('R3: flujo end-to-end
  POST → PUT → GET contra LocalStack', ...)`. ROJO primero. Requiere
  `docker compose up -d` (Postgres + LocalStack), como el resto de e2e.*

### Regresión y contención

- **R4**: WHEN se ejecutan `pnpm -C backend-pet-tracker run lint`, `test` y
  `test:e2e` tras los cambios THE SYSTEM SHALL salir con exit 0, con las
  suites existentes intactas y verdes — en particular TODA la suite
  `test/media.e2e-spec.ts` y los specs existentes del módulo media
  (`request-photo-upload-url.*`, `photo-key.spec.ts`,
  `photo-storage.s3.adapter.spec.ts`): `POST /v1/pets/:petId/photo-upload-url`
  conserva contrato y comportamiento sin ningún cambio; **cero
  modificaciones a tests existentes**, solo archivos nuevos; AND
  `./init.sh` SHALL terminar con exit 0; AND el diff SHALL tocar SOLO
  `backend-pet-tracker/src/modules/media/`,
  `backend-pet-tracker/src/db/schema/media.schema.ts` (nuevo, más su
  `media.schema.spec.ts` si se añade), el re-export de una línea en
  `backend-pet-tracker/src/db/schema/index.ts`, la migración generada en
  `backend-pet-tracker/src/db/migrations/` y
  `backend-pet-tracker/test/media-docs.e2e-spec.ts` (nuevo).
  *Verificación: implementer lo anota en `progress/impl_media-docs-api.md`;
  reviewer re-ejecuta y corre
  `git diff --stat main...HEAD | grep -v "modules/media\|db/schema/media.schema\|db/schema/index\|db/migrations\|media-docs.e2e\|specs/\|progress/\|feature_list"`
  (vacío).*

## Fuera de alcance

- Cambios en `mobile-pet-tracker/` — la pantalla Docs ya existe (#40);
  desbloquear su smoke es cierre de #40, no de esta feature. El upload de
  documentos desde el móvil no tiene pantalla todavía: cuando exista será
  feature móvil propia que consuma el POST de aquí.
- `DELETE`/renombrado de documentos y endpoint de URL de descarga
  prefirmada (YAGNI: ninguna pantalla los consume; `createDownloadUrl` ya
  existe en el port para cuando haga falta).
- Confirmación de subida: la fila existe desde el POST aunque el PUT nunca
  ocurra ([[design]] §D3) — sin verificación de existencia del objeto al
  listar, sin estados `pending/uploaded`.
- Límites de tamaño/escaneo del archivo subido y whitelist de
  content-type ([[design]] §D4): la firma no fija `Content-Type`, igual
  que la foto de perfil (D3 de #6).
- Tocar `MediaController` (photo-upload-url), `PetPhotoReadModule`, el
  resolver de `photoUrl` o el bucket/provisioning.
- Paginación y filtros del listado (YAGNI, mismo criterio que reminders D1).

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
