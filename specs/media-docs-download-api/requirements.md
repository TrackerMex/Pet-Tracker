---
feature: "media-docs-download-api"
status: approved       # draft | approved
tags: [harness, spec, backend]
---

# Requisitos — [[media-docs-download-api]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D9) y `docs/architecture.md` (capas
> domain/application/infrastructure). Esta feature es 100% backend
> (`backend-pet-tracker/`); la mitad móvil es #158 y aquí no se toca
> `mobile-pet-tracker/`.
>
> **Base congelada y medida una sola vez**: origin/main `36c8050d` + commits
> de harness `0ebe7571` y `c4911ab9` (no tocan código). Toda ancla es un
> `grep -cF` (o `grep -rlF … | wc -l`) ejecutado desde la raíz del repo,
> con la salida que dio en esa base. **Ningún número de línea es ancla.**
> Si al arrancar una salida no cuadra, la base se movió: parar y avisar al
> leader antes de tocar nada.
>
> **Prefijo obligatorio `#157 R<n>:`** en todo `describe`/`it` nuevo de esta
> spec (`docs/conventions.md` §Prefijo de feature cuando un fichero acumula
> R-ids de dos specs): `test/media-docs.e2e-spec.ts` y dos specs unitarios
> del módulo ya tienen R1–R4 de #49.

## Contexto fijo (no reabrir)

Medido en la base congelada:

| Hecho | Ancla | Salida |
|---|---|---|
| POST de #49 es solo owner | `grep -cF "@RequirePetRole('owner')" backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts` | `1` |
| La URL PUT dura 600 s | `grep -cF "export const DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS = 600;" backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.ts` | `1` |
| El puerto de storage ya firma GET | `grep -cF "createDownloadUrl(key: string, expiresInSeconds: number): Promise<string>;" backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts` | `1` |
| La firma PUT no fija Content-Type (D3 de #6) | `grep -cF "D3: el PUT no fija ContentType en la" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts` | `1` |
| El móvil ya manda `Content-Type` en un PUT firmado sin él (foto) | `grep -cF "headers: { 'Content-Type': contentType }," mobile-pet-tracker/src/api/media.ts` | `1` |
| El repositorio lista sin filtro de estado | `grep -cF "listByPet(petId: string): Promise<PetDocument[]>;" backend-pet-tracker/src/modules/media/domain/repositories/pet-document.repository.ts` | `1` |
| `pet_documents` no tiene columna de estado | `grep -cF "uploaded_at" backend-pet-tracker/src/db/schema/media.schema.ts` | `0` |
| #49 dejó la confirmación fuera a propósito | `grep -cF "Sin endpoint de confirmación, sin estados, sin verificación de objeto al" specs/media-docs-api/design.md` | `1` |
| Precedente de caducidad de lectura (foto) | `grep -cF "export const PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600;" backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.ts` | `1` |
| Roles reales del backend: `'owner' \| 'family' \| 'walker' \| 'vet'` | `grep -cF "export type PetRole = 'owner'" backend-pet-tracker/src/modules/pets/domain/entities/pet-membership.ts` | `1` |
| El guard del móvil tolera claves extra en GET | `grep -cF "typeof document.date === 'string'" mobile-pet-tracker/src/api/media.ts` | `1` |
| Journal de drizzle: 19 migraciones, última 0018 | `grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json` / `grep -cF '"tag": "0018_nutrition_plans_engine_meals"' backend-pet-tracker/src/db/migrations/meta/_journal.json` | `19` / `1` |

Anclas con pipe (fuera de la tabla para poder copiarlas tal cual):

- Nadie hace HEAD a S3 hoy:
  `grep -rlF "HeadObjectCommand" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `0`.
- Ningún e2e firma URLs con el host LAN de #57:
  `grep -rlF "presign" backend-pet-tracker/test | wc -l` → `0`.

- **Compatibilidad con el cliente móvil desplegado**: `isPetDocument` en
  `mobile-pet-tracker/src/api/media.ts` solo exige `id`, `type`, `name` y
  `date` string, así que añadir `downloadUrl` a cada elemento del GET no lo
  rompe. El GET sigue siendo un **array plano**, y el cuerpo 201 del POST no
  cambia ni en claves ni en valores.
- **Roles**: el acceptance de la feature dice "owner, caregiver o viewer",
  pero el backend tiene **cuatro** roles (`owner`, `family`, `walker`,
  `vet`). Esta spec los nombra por su valor real y cada cláusula sobre
  "cualquier miembro" o "no-owner" lleva un caso por rol (ver §Premisas
  falsas, P2).
- Ningún requisito crea recursos AWS ni toca `infra/`. Los e2e corren
  contra LocalStack (`docker compose up -d`) igual que #49.

## Requisitos funcionales

### Estado de subida

- **R1**: THE SYSTEM SHALL añadir a `pet_documents` la columna
  `uploaded_at timestamp with time zone` **nullable y sin default**
  (Drizzle: `uploadedAt: timestamp('uploaded_at', { withTimezone: true })`
  en `backend-pet-tracker/src/db/schema/media.schema.ts`, mismo patrón que
  `ackedAt` en `alerts.schema.ts`) mediante la migración **`0019`**
  generada con `pnpm -C backend-pet-tracker db:generate --name pet_documents_uploaded_at`,
  cuyo SQL es exactamente
  `ALTER TABLE "pet_documents" ADD COLUMN "uploaded_at" timestamp with time zone;`;
  AND el journal SHALL pasar de 19 a 20 entradas; AND las filas existentes
  SHALL quedar con `uploaded_at = NULL` (pendientes; [[design]] §D9).
  `NULL` significa "pendiente" y un timestamp significa "fichero confirmado
  en el bucket"; no hay otra columna de estado.
  *Test: `backend-pet-tracker/src/db/schema/media.schema.spec.ts` (nuevo) →
  `describe('#157 R1: columna uploaded_at y migración 0019', ...)`.*

- **R2**: WHEN el owner hace `POST /v1/pets/:petId/media` con body válido
  THE SYSTEM SHALL persistir la fila con `uploaded_at = NULL` AND
  responder 201 con el **mismo** cuerpo de #49
  (`{document: {id, type, name, date, vet, key}, uploadUrl, expiresInSeconds: 600}`,
  sin claves nuevas) AND auditar `pet.document_add` como hoy; AND mientras
  no se confirme (R5), ese documento SHALL NOT aparecer en
  `GET /v1/pets/:petId/media`. El body del POST no cambia
  (`CreatePetDocumentSchema` intacto, sin `contentType`; [[design]] §D5).
  *Tests: `create-pet-document.use-case.spec.ts` (el `toEqual` del documento
  gana `uploadedAt: null`); `test/media-docs.e2e-spec.ts` → it existente de
  #49 R2 modificado (ver §Tests existentes que cambian, E2) y
  `describe('#157 R2: POST deja el documento pendiente', ...)`.*

### Lectura

- **R3**: WHEN un miembro de la mascota con **cualquiera** de los roles
  `owner`, `family`, `walker` o `vet` hace `GET /v1/pets/:petId/media`
  THE SYSTEM SHALL devolver solo los documentos con `uploaded_at IS NOT NULL`,
  en el orden de #49 (`date` desc, `id` desc); AND los documentos pendientes
  SHALL NOT aparecer para **ninguno** de los cuatro roles (owner incluido).
  *Tests: `list-pet-documents.use-case.spec.ts` (delegación en
  `listUploadedByPet`); `test/media-docs.e2e-spec.ts` →
  `describe('#157 R3: GET oculta los pendientes a los cuatro roles', ...)`
  con `it.each` sobre `owner`, `family`, `walker`, `vet`.*

- **R4**: WHEN un miembro con **cualquiera** de los roles `owner`, `family`,
  `walker` o `vet` hace `GET /v1/pets/:petId/media` THE SYSTEM SHALL
  incluir en **cada** elemento la clave `downloadUrl` — una URL GET
  prefirmada de S3 sobre la `key` del documento, firmada con
  `PHOTO_STORAGE.createDownloadUrl(key, 3600)` — de modo que cada elemento
  tenga **exactamente** las claves `{id, type, name, date, vet, key, downloadUrl}`;
  AND la URL SHALL ser observable como prefirmada sobre ese objeto: query
  con `X-Amz-Expires=3600` y `X-Amz-Signature=`, y `pathname` que termina
  en `/<key>`;
  AND la caducidad SHALL ser **3600 s** (constante exportada
  `DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600` en
  `list-pet-documents.use-case.ts`; [[design]] §D1, §D2); AND un no-miembro,
  una mascota inexistente o un `:petId` malformado SHALL seguir recibiendo
  404 del `PetAccessGuard` (sin firmar nada).
  *Tests: `list-pet-documents.use-case.spec.ts` →
  `describe('#157 R4: ListPetDocumentsUseCase firma una URL de lectura de 3600 s por documento', ...)`
  (aserta el **literal** `3600`, no el símbolo importado);
  `test/media-docs.e2e-spec.ts` →
  `describe('#157 R4: cada documento listado trae downloadUrl de 3600 s', ...)`
  con `it.each` sobre los cuatro roles; el 404 de no-miembro lo sigue
  cubriendo el it de #49 R1 `responde 404 a no-miembro, mascota inexistente y :petId malformado`, sin cambios.*

### Confirmación de subida

- **R5**: WHEN el owner hace `POST /v1/pets/:petId/media/:documentId/confirm`
  sobre un documento **pendiente** de esa mascota cuyo objeto **existe** en
  el bucket (`PHOTO_STORAGE.objectExists(key)` → `true`, R7) THE SYSTEM
  SHALL fijar `uploaded_at = now()` AND responder **204 sin cuerpo**; AND
  a partir de ahí el documento SHALL aparecer en el GET (R3, R4).
  WHEN el documento ya estaba confirmado THE SYSTEM SHALL responder 204
  **sin** llamar a `objectExists` y **sin** cambiar `uploaded_at`
  (idempotente).
  *Tests: `confirm-pet-document-upload.use-case.spec.ts` (nuevo) →
  `describe('#157 R5: ConfirmPetDocumentUploadUseCase marca subido', ...)`
  con un it por rama (pendiente+existe, ya confirmado);
  `test/media-docs.e2e-spec.ts` →
  `describe('#157 R5: confirmar marca el documento como subido', ...)`
  (204, `uploaded_at` no nulo, aparece en GET; segundo confirm 204 con el
  mismo `uploaded_at`).*

- **R6**: IF la confirmación no procede THEN THE SYSTEM SHALL responder
  sin escribir `uploaded_at`, con un caso por rama:
  - (a) IF `:documentId` no es un UUID THEN 404
    `{statusCode: 404, code: 'PET_DOCUMENT_NOT_FOUND', message: 'Pet document not found'}`
    **sin** consultar el repositorio;
  - (b) IF `:documentId` es un UUID que no existe THEN el mismo 404;
  - (c) IF `:documentId` existe pero pertenece a **otra** mascota THEN el
    mismo 404, y el `uploaded_at` de ese documento sigue `NULL`;
  - (d) IF el objeto **no existe** en el bucket THEN 409
    `{statusCode: 409, code: 'PET_DOCUMENT_NOT_UPLOADED', message: 'Pet document file not found in storage'}`,
    y el documento sigue fuera del GET;
  - (e) IF el solicitante tiene rol `family`, `walker` **o** `vet` THEN 403
    (`@RequirePetRole('owner')`), aunque el objeto exista en el bucket;
  - (f) IF el solicitante no es miembro, la mascota no existe o `:petId`
    está malformado THEN 404 del guard;
  - (g) IF `objectExists` falla con un error distinto de "no existe"
    THEN el error se propaga (500 de Nest) y `uploaded_at` sigue `NULL`.
  *Tests: `confirm-pet-document-upload.use-case.spec.ts` → describe
  `#157 R6: ...` con un it por (a), (b)/(c) (repositorio devuelve `null`),
  (d) y (g); `test/media-docs.e2e-spec.ts` →
  `describe('#157 R6: confirmar rechaza sin escribir', ...)` con un it por
  (a), (b), (c), (d), (f) y un `it.each` sobre `family`, `walker`, `vet`
  para (e). (g) no tiene e2e: LocalStack no ofrece un fallo distinto de
  404 reproducible.*

- **R7**: THE SYSTEM SHALL exponer en el puerto `PhotoStorage` el método
  `objectExists(key: string): Promise<boolean>`, implementado en
  `PhotoStorageS3Adapter` con `HeadObjectCommand({Bucket: names.mediaBucket, Key: key})`
  enviado por el `S3_CLIENT` existente: resuelve `true` si el HEAD
  responde; resuelve `false` IF el error trae
  `$metadata.httpStatusCode === 404`; IF trae cualquier otro error THEN
  lo relanza tal cual.
  *Test: `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`
  (nuevo) → `describe('#157 R7: objectExists hace HEAD al bucket de media', ...)`
  con un it por rama (existe, 404, otro error como 403) y la aserción del
  comando enviado (clase `HeadObjectCommand`, `Bucket`, `Key`).*

### Flujo end-to-end

- **R8**: WHEN un cliente completa el flujo — `POST /v1/pets/:petId/media`;
  `PUT` de los bytes a `uploadUrl` **sin** `Authorization` y **con**
  header `Content-Type`; `POST .../:documentId/confirm`;
  `GET /v1/pets/:petId/media`; `GET` (fetch) a `downloadUrl` **sin**
  `Authorization` — THE SYSTEM SHALL devolver en esa descarga status 200,
  los **mismos bytes** subidos y el header `content-type` **igual** al
  enviado en el PUT, para `application/pdf` **y** para `image/jpeg` (un
  caso por tipo); AND entre el PUT y el confirm el GET SHALL devolver `[]`.
  Esto prueba que el móvil (#158) sube PDF e imágenes con su tipo sin que
  el POST acepte `contentType` ([[design]] §D5).
  *Test: `test/media-docs.e2e-spec.ts` →
  `describe('#157 R8: flujo POST → PUT → confirm → GET → descarga contra LocalStack', ...)`
  con `it.each` sobre `['application/pdf', 'image/jpeg']`. Requiere
  `docker compose up -d`, como el resto de e2e.*

### Regresión y contención

- **R9**: WHEN se ejecutan, **sin pipe** (memoria `exit-code-tras-pipe`),
  `pnpm -C backend-pet-tracker run lint`, `pnpm -C backend-pet-tracker test`,
  `pnpm -C backend-pet-tracker run test:e2e` y `./init.sh` THE SYSTEM SHALL
  salir con exit 0 en los cuatro; AND los únicos tests existentes
  modificados SHALL ser los de §Tests existentes que cambian (E1–E7), y
  cada uno solo como allí se describe; AND `POST /v1/pets/:petId/photo-upload-url`
  y toda la suite `test/media.e2e-spec.ts` SHALL quedar intactos; AND tras
  el cambio SHALL cumplirse:
  - `grep -rlF "listByPet" backend-pet-tracker/src/modules/media | wc -l` → `0`;
  - `grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json` → `20`;
  - `grep -cF '"tag": "0019_pet_documents_uploaded_at"' backend-pet-tracker/src/db/migrations/meta/_journal.json` → `1`;
  - `grep -rlF "HeadObjectCommand" backend-pet-tracker/src | wc -l` → `2`
    (adapter y su spec nuevo);
  AND el diff contra el commit de handoff SHALL tocar solo las rutas de
  [[design]] §Archivos afectados.
  *Verificación: el implementer anota las cuatro salidas en
  `progress/impl_media-docs-download-api.md`; el reviewer re-ejecuta y
  corre `git diff --stat <hash-handoff>...HEAD -- backend-pet-tracker | grep -v "modules/media\|db/schema/media.schema\|db/migrations\|media-docs.e2e"`
  (vacío).*

## Tests existentes que cambian

Lista **cerrada**: cualquier otra modificación de un test existente es
rechazo. Cada una es roja antes de la implementación que la justifica.

| # | Fichero | Qué cambia | Por qué |
|---|---|---|---|
| E1 | `test/media-docs.e2e-spec.ts`, helper `seedDocument` (`grep -cF "async function seedDocument(" …` → `1`) | El insert gana `uploadedAt` con opción `uploadedAt?: Date \| null` y **default `new Date()`**; lo que devuelve sigue siendo el `DocumentResponse` de 6 claves | Sin esto todos los seeds de #49 serían pendientes y desaparecerían del GET (R3) |
| E2 | `test/media-docs.e2e-spec.ts`, it de #49 R2 `responde 201/600s, persiste antes del PUT, aparece en GET y audita pet.document_add` (`grep -cF` del título → `1`) | Título pasa a `responde 201/600s, persiste pendiente antes del PUT, no aparece en GET y audita pet.document_add`; `expect(listed.body).toEqual([body.document]);` (`grep -cF` → `1`) pasa a `expect(listed.body).toEqual([]);`; el `toMatchObject` de la fila gana `uploadedAt: null` | R2: el pendiente ya no se lista |
| E3 | `test/media-docs.e2e-spec.ts`, it de #49 R1 `responde un array plano con shape exacto, solo la mascota solicitada y orden determinista` | Cada elemento esperado gana `downloadUrl: expect.any(String)`; la lista de claves `['id', 'type', 'name', 'date', 'vet', 'key'].sort()` **de ese it** gana `'downloadUrl'` (la del it de R2 se queda en 6: el POST no cambia). Hoy `grep -cF "['id', 'type', 'name', 'date', 'vet', 'key'].sort()"` → `2`; tras el cambio → `1` | R4 |
| E4 | `test/media-docs.e2e-spec.ts`, it de #49 R3 `sube bytes sin Authorization, conserva el documento y permite leer el objeto por key` | Entre el PUT y el GET se añade el confirm (204); `expect(listed.body).toEqual([createdBody.document]);` (`grep -cF` → `1`) pasa a esperar `[{...createdBody.document, downloadUrl: expect.any(String)}]` | R5, R4 |
| E5 | `backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts` | El `toEqual` del documento gana `uploadedAt: null`; el doble `storage: PhotoStorage` gana `objectExists: jest.fn(),`; el doble del repositorio cambia `listByPet: jest.fn(),` (`grep -cF` → `1`) por `listUploadedByPet: jest.fn(),` | R2, R7 (el doble tipado rompe el typecheck de ts-jest sin el método nuevo) |
| E6 | `backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts` | El doble `photoStorage: PhotoStorage` gana `objectExists: jest.fn(),` y nada más | R7 (typecheck) |
| E7 | `backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts` | El `describe('R1: ListPetDocumentsUseCase delega en listByPet', ...)` de #49 se **sustituye** por los describes `#157 R3` y `#157 R4` (el constructor gana `storage` y el retorno cambia de forma); el helper `document()` gana `uploadedAt` | R3, R4. La fila R1 de `specs/media-docs-api/traceability.md` conserva su enlace e2e |

El it de #49 R1 `permite GET a caregiver (family) y viewer (vet)` **no**
cambia: usa `toMatchObject`, que tolera `downloadUrl`, y sus seeds pasan a
subidos por E1.

## Decisiones abiertas

Cada una ya está aplicada en esta spec con su opción por defecto. El
humano puede cambiarla en el gate; si lo hace, la spec se enmienda antes
del handoff.

| # | Decisión | Defecto aplicado | Alternativa principal |
|---|---|---|---|
| DA1 | Forma de la URL de lectura | `downloadUrl` prefirmada en cada elemento del GET (precedente `photoUrl` de pets; firmar es local, sin round-trip a S3) | Endpoint por documento `GET /v1/pets/:petId/media/:documentId/download-url` |
| DA2 | Caducidad de la URL de lectura | 3600 s (= `PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS`) | 600 s, como la de subida |
| DA3 | Mecanismo de confirmación | Columna `uploaded_at` nullable + `POST .../:documentId/confirm` que verifica con `HeadObject` | Confirmar sin HEAD (confiar en el cliente), HEAD en cada GET, o evento S3 → cola (crea recursos AWS: descartado) |
| DA4 | Qué devuelve el GET para los pendientes | Se ocultan a los cuatro roles | Devolverlos con `status: 'pending'` y `downloadUrl: null` |
| DA5 | `contentType` en el POST | No: el cliente manda `Content-Type` en el PUT (no firmado, D3 de #6) y S3 lo sirve en la descarga (R8 lo prueba) | Aceptarlo en el body con whitelist y firmarlo en el PUT |
| DA6 | Respuesta del confirm | 204 sin cuerpo; el móvil revalida el GET | 200 con el elemento listado (con `downloadUrl`) |
| DA7 | Quién confirma | Solo `owner`, igual que el POST | Solo el `createdBy` del documento |
| DA8 | Auditoría del confirm | No se audita; el POST ya audita `pet.document_add` | Nueva acción `pet.document_upload_confirm` |
| DA9 | Filas que ya existen | Quedan pendientes (`NULL`); el owner puede confirmarlas con R5 si su fichero está en el bucket | Backfill a `now()` en la migración (marca "subido" sin verificar nada) |

**Pregunta de coste al humano (Q1, sin respuesta inferida)**: en modo
`aws` (cuenta real), DA3 supone una petición `HeadObject` por confirmación,
y DA1 supone una petición GET + transferencia de salida por cada documento
abierto. Ninguna prueba de esta spec corre contra AWS real y en local
(LocalStack) el coste es cero. ¿Autorizas ese consumo en la cuenta real
cuando el backend corra en modo `aws`? Si la respuesta es no, DA1 y DA3
deben reabrirse. Nota relacionada: el stack CDK no concede permisos IAM
sobre el bucket (`grep -cF "grant" infra/lib/pet-tracker-dev-stack.ts` →
`0`); con credenciales sin `s3:ListBucket`, S3 responde 403 (no 404) a un
HEAD de un objeto inexistente, y R7 lo relanzaría como 500. Extender
`test/aws-real-media.e2e-spec.ts` para cubrirlo cuesta dinero y queda
fuera de alcance salvo que el humano lo pida.

## Premisas falsas

Verificadas contra la base congelada:

- **P1 — "e2e con URLs prefirmadas reales, como #49 y #57"**: #57
  (`localstack-presigned-url-lan-host`) **no tiene e2e**. Sus tests son
  unitarios (`src/aws/presign-endpoint.spec.ts`,
  `src/modules/media/infrastructure/photo-storage.presign-host.spec.ts`), y
  `grep -rlF "presign" backend-pet-tracker/test | wc -l` → `0`. Los
  precedentes reales de e2e con URL prefirmada contra LocalStack son #49
  (`test/media-docs.e2e-spec.ts`, it de R3) y #6 (`test/media.e2e-spec.ts`).
  R8 sigue el patrón de #49.
- **P2 — "owner, caregiver o viewer"**: el backend no tiene roles
  `caregiver` ni `viewer`. `PetRole` es `'owner' | 'family' | 'walker' | 'vet'`,
  y los e2e de #49 solo cubren `family` (como caregiver) y `vet` (como
  viewer): `walker` no tiene caso. Esta spec cubre los cuatro.
- **P3 — journal en `backend-pet-tracker/drizzle/meta/_journal.json`**
  (encargo del leader, que ya decía "o el que exista"): esa ruta no existe.
  El journal está en `backend-pet-tracker/src/db/migrations/meta/_journal.json`.
- **P4 — `files_affected` de #157 en `feature_list.json`** (solo
  `src/modules/media/` y el e2e): está incompleto. También cambian
  `src/db/schema/media.schema.ts`, la migración 0019 con su snapshot y
  journal, y el spec nuevo `src/db/schema/media.schema.spec.ts`. Lista
  completa en [[design]] §Archivos afectados.

## Fuera de alcance

Clasificado viñeta a viñeta (memoria `fuera-de-alcance-no-todo-es-feature`):

- *Delimitación*: `mobile-pet-tracker/` entero. La subida, la apertura y
  el copy son #158.
- *Delimitación*: borrar o renombrar documentos (la descripción de #157
  lo excluye y nada en esta spec lo necesita).
- *Deuda posible, no registrada*: barrido de filas pendientes huérfanas
  (PUT que nunca llegó). Quedan ocultas y no rompen nada; un barrido por
  antigüedad exigiría un worker o cron nuevo. Se registra solo si el
  humano lo pide.
- *Delimitación*: límite de tamaño y whitelist de tipos. Una URL PUT
  prefirmada no puede imponer tamaño; #158 fija el límite en el cliente.
  Si algún día se impone en servidor, el sitio natural es el confirm
  (`ContentLength` del HEAD).
- *Delimitación*: `Content-Disposition` o nombre de fichero en la
  descarga. El móvil abre la URL tal cual.
- *Delimitación*: `infra/`, IAM, CDK y cualquier prueba contra AWS real
  (ver Q1).
- *Delimitación*: `MediaController` (`photo-upload-url`),
  `PetPhotoReadModule`, el resolver de `photoUrl` y el provisioning del
  bucket.
- *Delimitación*: paginación y filtros del listado (mismo criterio que
  #49).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-08) ← gate obligatorio antes de implementar
