---
feature: "media-docs-download-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Diseño — [[media-docs-download-api]]

> Ver [[requirements]] (R1–R9, decisiones abiertas DA1–DA9, Q1) y
> `docs/architecture.md` para las capas. Base congelada: origin/main
> `36c8050d` + `0ebe7571` + `c4911ab9`. Rutas relativas a
> `backend-pet-tracker/` salvo que se diga otra cosa. Todos los nombres de
> símbolo de este documento son **exactos**: el implementer no elige
> nombres.

## Decisiones técnicas

- **D1 — `downloadUrl` en cada elemento del GET** (DA1). El use case de
  listado firma una URL GET por documento con el `createDownloadUrl` que el
  puerto `PhotoStorage` ya tiene, igual que `ListPetsUseCase` firma
  `photoUrl`. Firmar es SigV4 local, sin round-trip a S3, así que N
  documentos son N firmas locales y cero peticiones de red. Mantiene el
  array plano que consume el móvil y le ahorra a #158 una petición por
  documento. Sirve a R4.

- **D2 — Caducidad 3600 s** (DA2). Es la de la foto de perfil. El móvil
  lee el GET con TanStack Query (`useQuery` en
  `mobile-pet-tracker/src/screens/docs/index.tsx`), así que cualquier
  refetch de esa query renueva las URLs. Cuándo refetchea lo decide #158.
  Constante nueva
  `DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600`, exportada desde
  `src/modules/media/application/use-cases/list-pet-documents.use-case.ts`.
  No se importa la de `pets` porque media no depende de pets/application.
  Sirve a R4.

- **D3 — Estado = `uploaded_at` nullable** (DA3). Una sola columna
  `timestamp with time zone` sin default: `NULL` = pendiente, valor =
  confirmado. No hay enum, ni `CHECK`, ni segunda columna, y el timestamp
  sale gratis. Mismo patrón que `ackedAt` en `src/db/schema/alerts.schema.ts`
  (`grep -cF "ackedAt: timestamp('acked_at', { withTimezone: true }),"` → `1`).
  Migración aditiva y no destructiva (`docs/conventions.md` §Migraciones
  destructivas no aplica): número **0019**, tag
  `0019_pet_documents_uploaded_at`, generada con `pnpm db:generate --name pet_documents_uploaded_at`.
  **Nunca** se aplica con `psql` crudo. Sirve a R1, R2, R3, R5.

- **D4 — Confirmación explícita verificada con HEAD** (DA3, DA6, DA7,
  DA8). `POST /v1/pets/:petId/media/:documentId/confirm`, solo `owner`,
  responde 204. El use case:
  1. Si `documentId` no cumple el regex UUID → `PetDocumentNotFoundError`,
     sin tocar el repositorio. Constante local `UUID_PATTERN`, idéntica a
     la de `get-geofence.use-case.ts`
     (`grep -cF "/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\$/i;" src/modules/geofences/application/use-cases/get-geofence.use-case.ts` → `1`).
  2. `findByIdAndPet(documentId, petId)`; si da `null` →
     `PetDocumentNotFoundError`. Un documento de otra mascota también da
     `null`, porque el filtro es por los dos ids.
  3. Si `uploadedAt !== null` → return (idempotente, sin HEAD).
  4. `objectExists(document.key)`; si da `false` → `PetDocumentNotUploadedError`.
     Si lanza, se propaga.
  5. `markUploaded(document.id)` (`UPDATE … SET uploaded_at = now() WHERE id = :id AND uploaded_at IS NULL`).
     El `IS NULL` hace que dos confirmaciones concurrentes conserven la
     primera marca.

  El HEAD es lo que convierte "el cliente dice que subió" en "el objeto
  está en el bucket", que es lo que pide el acceptance. Sin auditoría
  nueva, porque el POST ya audita `pet.document_add`. Sirve a R5, R6.

- **D5 — Sin `contentType` en el POST** (DA5). La firma PUT no fija
  `Content-Type` (D3 de #6), S3 guarda el header del PUT como metadato del
  objeto y lo devuelve al descargar con la URL GET prefirmada. El móvil ya
  hace eso con la foto. R8 lo deja asertado con PDF y JPEG. Zod
  `z.object` descarta claves desconocidas, así que un cliente que mande
  `contentType` igualmente no recibe 400. Sirve a R2, R8.

- **D6 — Pendientes ocultos en el GET** (DA4). El filtro va en SQL
  (`isNotNull(petDocuments.uploadedAt)`) dentro de
  `listUploadedByPet`, con el mismo `orderBy(desc(date), desc(id))` de
  #49. El método se **renombra** desde `listByPet` para que el nombre diga
  el filtro (`listByPet` existe con otra semántica en health y reminders).
  Sirve a R3.

- **D7 — `objectExists` en el puerto existente** (R7). Se añade un método a
  `PhotoStorage` en vez de crear un puerto nuevo: el bucket es el mismo y el
  adapter ya tiene `S3_CLIENT` y `AWS_RESOURCE_NAMES`. El HEAD va por el
  cliente S3 normal (endpoint `AWS_ENDPOINT_URL`), no por el host de
  firma LAN de #57. La regla de "no existe" es solo
  `$metadata?.httpStatusCode === 404`. Cualquier otro error se relanza.
  <!-- ponytail: con credenciales AWS sin s3:ListBucket, S3 responde 403 a
       un HEAD de objeto inexistente y aquí sale 500. Tratar 403 como false
       si el modo aws lo necesita (ver Q1). -->
  Sirve a R7.

- **D8 — Errores de dominio y su mapeo**, patrón
  `src/modules/geofences/infrastructure/mappers/geofence-error.mapper.ts`
  (`grep -cF "export function mapGeofenceError(error: unknown): unknown {"` → `1`):

  | Error de dominio | HTTP | Cuerpo |
  |---|---|---|
  | `PetDocumentNotFoundError` | 404 | `{statusCode: 404, code: 'PET_DOCUMENT_NOT_FOUND', message: 'Pet document not found'}` |
  | `PetDocumentNotUploadedError` | 409 | `{statusCode: 409, code: 'PET_DOCUMENT_NOT_UPLOADED', message: 'Pet document file not found in storage'}` |
  | cualquier otro | se relanza | — |

  Sirve a R6.

- **D9 — Filas existentes quedan pendientes** (DA9). La migración no hace
  backfill: marcar "subido" sin HEAD sería exactamente el bug que esta
  feature cierra. Las filas de los e2e se borran en su `afterAll`, y una
  fila manual con fichero real se recupera con un confirm (R5). Sirve a R1.

## Firmas exactas por capa

- **db** — `src/db/schema/media.schema.ts`: `petDocuments` gana
  `uploadedAt: timestamp('uploaded_at', { withTimezone: true })` (importar
  `timestamp` de `drizzle-orm/pg-core`).
- **domain**
  - `src/modules/media/domain/entities/pet-document.entity.ts`:
    `PetDocument` gana `uploadedAt: Date | null`.
  - `src/modules/media/domain/repositories/pet-document.repository.ts`:
    `PetDocumentRepository` queda con
    `create(document: PetDocument): Promise<void>`,
    `listUploadedByPet(petId: string): Promise<PetDocument[]>`,
    `findByIdAndPet(id: string, petId: string): Promise<PetDocument | null>`,
    `markUploaded(id: string): Promise<void>`.
  - `src/modules/media/domain/ports/photo-storage.ts`: `PhotoStorage` gana
    `objectExists(key: string): Promise<boolean>`.
  - `src/modules/media/domain/errors/pet-document.errors.ts` (nuevo):
    `PetDocumentNotFoundError` y `PetDocumentNotUploadedError`, ambos
    `extends Error` (patrón `geofence.errors.ts`).
- **application**
  - `create-pet-document.use-case.ts`: el literal `document` gana
    `uploadedAt: null`. Nada más cambia: orden create → sign → audit,
    600 s, respuesta.
  - `list-pet-documents.use-case.ts`: exporta
    `DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600` y
    `interface PetDocumentListItem { document: PetDocument; downloadUrl: string }`;
    el constructor queda `(@Inject(PET_DOCUMENT_REPOSITORY) documents, @Inject(PHOTO_STORAGE) storage)`;
    `execute(petId: string): Promise<PetDocumentListItem[]>` llama a
    `listUploadedByPet(petId)` y firma cada `key` con `Promise.all`,
    conservando el orden.
  - `confirm-pet-document-upload.use-case.ts` (nuevo):
    `ConfirmPetDocumentUploadUseCase` con constructor
    `(@Inject(PET_DOCUMENT_REPOSITORY) documents, @Inject(PHOTO_STORAGE) storage)`
    y `execute(petId: string, documentId: string): Promise<void>` (D4).
- **infrastructure**
  - `photo-storage.s3.adapter.ts`: `objectExists(key)` con
    `HeadObjectCommand` (D7).
  - `repositories/pet-document.drizzle.repository.ts`: `listByPet` →
    `listUploadedByPet` (con `isNotNull`), `findByIdAndPet` (`and(eq(id), eq(petId))`,
    `limit(1)`), `markUploaded` (D4.5); `toDomain` mapea `uploadedAt`.
  - `mappers/pet-document.mapper.ts`: añade
    `interface PetDocumentListItemResponse extends PetDocumentResponse { downloadUrl: string }`
    y `toPetDocumentListItemResponse(item: PetDocumentListItem): PetDocumentListItemResponse`.
    `PetDocumentResponse` y `toPetDocumentResponse` **no cambian**: el
    POST los sigue usando, y por eso `uploadedAt` nunca sale en una
    respuesta.
  - `mappers/pet-document-error.mapper.ts` (nuevo):
    `mapPetDocumentError(error: unknown): unknown` (D8).
  - `pet-media.controller.ts`: `list()` devuelve
    `PetDocumentListItemResponse[]` vía `toPetDocumentListItemResponse`.
    Método nuevo `confirm()` con `@Post(':documentId/confirm')`,
    `@RequirePetRole('owner')` y `@HttpCode(HttpStatus.NO_CONTENT)`, que
    recibe `@Param('documentId') documentId: string`, llama al use case con
    `request.petMembership.petId` y hace `throw mapPetDocumentError(error)`
    en el `catch`.
  - `media.module.ts`: registra `ConfirmPetDocumentUploadUseCase` en
    `providers`.

## Archivos afectados

Lista cerrada (R9). Rutas desde la raíz del repo.

| Ruta | Capa | Cambio |
|---|---|---|
| `backend-pet-tracker/src/db/schema/media.schema.ts` | db | columna `uploadedAt` |
| `backend-pet-tracker/src/db/schema/media.schema.spec.ts` | db | **nuevo** (R1) |
| `backend-pet-tracker/src/db/migrations/0019_pet_documents_uploaded_at.sql` | db | **generado** |
| `backend-pet-tracker/src/db/migrations/meta/0019_snapshot.json` | db | **generado** |
| `backend-pet-tracker/src/db/migrations/meta/_journal.json` | db | **generado** (+1 entrada) |
| `backend-pet-tracker/src/modules/media/domain/entities/pet-document.entity.ts` | domain | `uploadedAt` |
| `backend-pet-tracker/src/modules/media/domain/repositories/pet-document.repository.ts` | domain | renombre + 2 métodos |
| `backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts` | domain | `objectExists` |
| `backend-pet-tracker/src/modules/media/domain/errors/pet-document.errors.ts` | domain | **nuevo** |
| `backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.ts` | application | `uploadedAt: null` |
| `backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts` | application | E5 |
| `backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts` | application | storage + items + constante |
| `backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts` | application | E7 |
| `backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts` | application | **nuevo** |
| `backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts` | application | **nuevo** (R5, R6) |
| `backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts` | application | E6 (solo el doble) |
| `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts` | infrastructure | `objectExists` |
| `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts` | infrastructure | **nuevo** (R7) |
| `backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts` | infrastructure | 3 métodos + `toDomain` |
| `backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document.mapper.ts` | infrastructure | respuesta de listado |
| `backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts` | infrastructure | **nuevo** |
| `backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts` | infrastructure | `list()` + `confirm()` |
| `backend-pet-tracker/src/modules/media/media.module.ts` | infrastructure | provider nuevo |
| `backend-pet-tracker/test/media-docs.e2e-spec.ts` | e2e | E1–E4 + describes `#157 R2`–`#157 R8` |
| `specs/media-docs-download-api/*`, `progress/impl_media-docs-download-api.md`, `feature_list.json` | harness | trazabilidad y reporte |

### Inventario de dobles y literales (medido en la base congelada)

- Dobles **tipados** de `PhotoStorage` (rompen el typecheck de ts-jest al
  añadir `objectExists`):
  `grep -rlF ': PhotoStorage = {' backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `2`.
  Son `create-pet-document.use-case.spec.ts` (E5) y
  `request-photo-upload-url.use-case.spec.ts` (E6). Implementaciones:
  `grep -rlF 'implements PhotoStorage' backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `1`
  (el adapter). `PetPhotoUrlResolverImpl` **usa** el puerto pero no lo
  implementa, así que no cambia.
- Dobles de `PetDocumentRepository`: todos usan cast
  (`grep -rlF 'as unknown as PetDocumentRepository' backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `2`),
  así que no rompen el typecheck. Igualmente E5 renombra la propiedad
  para que el grep de R9 dé `0`. Implementaciones: 1 (drizzle).
- `MockOf<` en media: `grep -rlF "MockOf<" backend-pet-tracker/src/modules/media | wc -l` → `0`.
- Literales `PetDocument` que ganan `uploadedAt`:
  `grep -rlF ': PetDocument = {' backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `1`
  (create use case) y
  `grep -rlF '): PetDocument {' backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `2`
  (helper `document()` del spec de listado y `toDomain` del repositorio).
- Quién construye `ListPetDocumentsUseCase` a mano:
  `grep -rlF "new ListPetDocumentsUseCase(documents)" backend-pet-tracker/src | wc -l` → `1`
  (su spec, E7). El resto lo resuelve Nest.

## Alternativas descartadas

- **Endpoint por documento para la URL de lectura** (DA1): una ruta, un
  use case y un 404 más, y una petición extra por cada toque en el móvil,
  para dar una URL que el GET ya puede firmar gratis.
- **Confirmar sin HEAD**: cumple el contrato solo si el cliente no se
  equivoca nunca. Un PUT fallido seguido de un confirm dejaría
  exactamente el documento sin fichero que esta feature elimina.
- **HEAD a cada documento en cada GET** (sin columna ni confirm): N
  peticiones de red a S3 por listado, con su latencia y su coste en modo
  aws (Q1). Los huérfanos se pagan para siempre.
- **Notificación de evento S3 → SQS/Lambda**: crea recursos AWS, cuesta
  dinero y no se delega a una IA. Descartada sin más.
- **Columna `status` con enum `pending`/`uploaded`**: dos valores que un
  timestamp nullable ya expresa, más un `CHECK` o un `pgEnum` y su
  migración. Si algún día hay más estados (escaneo antivirus, rechazado),
  se reabre.
- **Devolver los pendientes con `status`** (DA4): obliga a #158 a pintar
  y gestionar un estado que solo el owner podría resolver, y no hay
  endpoint para reemitir la URL de subida. Ocultarlos es lo mínimo.
- **`contentType` firmado en el PUT** (DA5): S3 ya conserva el header no
  firmado; firmarlo solo añadiría una whitelist arbitraria (ya descartada
  en D4 de #49).
- **Backfill de filas existentes a `now()`** (DA9): marca "subido" sin
  verificar nada.
- **Respuesta 200 con el elemento en el confirm** (DA6): obliga a firmar
  una URL más en el confirm y a fijar un contrato que #158 no necesita,
  porque ya revalida la lista.
