---
feature: "media-docs-confirm-size-limit"
status: approved     # draft | approved
tags: [harness, spec, backend, media]
---

# Requisitos — [[media-docs-confirm-size-limit]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D7) y `docs/architecture.md` (capas
> domain/application/infrastructure). Feature #161, P3, deuda de #157
> (`media-docs-download-api`). 100% backend (`backend-pet-tracker/`): no se
> toca `mobile-pet-tracker/` ni `infra/`.
>
> **Base congelada y medida una sola vez**: `58323e49` (origin/main, merge
> de #157, PR #200). Toda ancla es un `grep -cF` (o `grep -rlF … | wc -l`)
> ejecutado desde la raíz del repo, con la salida que dio en esa base.
> **Ningún número de línea es ancla.** Si al arrancar una salida no cuadra,
> la base se movió: parar y avisar al leader antes de tocar nada.
>
> **Prefijo obligatorio `#161 R<n>:`** en todo `describe`/`it` nuevo de
> esta spec (`docs/conventions.md` §Prefijo de feature): los ficheros que
> toca ya acumulan R-ids de #49 y #157.

## Contexto fijo (no reabrir)

Medido en `58323e49`:

| Hecho | Ancla | Salida |
|---|---|---|
| El puerto expone `objectExists` (R7 de #157) | `grep -cF "objectExists(key: string): Promise<boolean>;" backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts` | `1` |
| El confirm solo pregunta si el objeto existe | `grep -cF "if (!(await this.storage.objectExists(document.key))) {" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts` | `1` |
| El confirm es idempotente: un documento ya confirmado no hace HEAD | `grep -cF "if (document.uploadedAt !== null) return;" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts` | `1` |
| Patrón de error de dominio de media → 409 con `code` | `grep -cF "code: 'PET_DOCUMENT_NOT_UPLOADED'," backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts` | `1` |
| El e2e ya tiene cliente S3 contra LocalStack | `grep -cF "import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';" backend-pet-tracker/test/media-docs.e2e-spec.ts` | `1` |

Anclas con pipe (fuera de la tabla para copiarlas tal cual):

- El mapper no tiene spec (Obs. 1 del veredicto de #157):
  `ls backend-pet-tracker/src/modules/media/infrastructure/mappers/ | wc -l` → `2`
  (`pet-document-error.mapper.ts` y `pet-document.mapper.ts`).
- Nadie lee `ContentLength` hoy:
  `grep -rlF "ContentLength" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `0`.
- Ningún código de producción borra objetos de S3:
  `grep -rlF "DeleteObjectCommand" backend-pet-tracker/src | wc -l` → `0`
  (en `test/` solo lo usa `aws-real-media.e2e-spec.ts`, que no se toca).
- El stack CDK no concede nada sobre el bucket (#160 sigue `pending`):
  `grep -cE "grant|Role|PolicyStatement" infra/lib/pet-tracker-dev-stack.ts` → `0`.
- Símbolos nuevos aún inexistentes:
  `grep -rlF "getObjectSize" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `0`;
  `grep -rlF "PET_DOCUMENT_MAX_BYTES" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `0`;
  `grep -rlF "PET_DOCUMENT_TOO_LARGE" backend-pet-tracker mobile-pet-tracker/src --include=*.ts | wc -l` → `0`.

Inventario **completo** de `objectExists` en la base (memoria
`dobles-exhaustivos-de-puertos`):
`grep -rlF "objectExists" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `7`.
Rutas relativas a `backend-pet-tracker/`:

1. `src/modules/media/domain/ports/photo-storage.ts` (puerto)
2. `src/modules/media/infrastructure/photo-storage.s3.adapter.ts` (adapter)
3. `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts` (único consumidor)
4. `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts` (tests de #157 R7; `grep -cF "objectExists"` → `4`)
5. `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts` (doble por cast; `grep -cF "objectExists"` → `19`)
6. `src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts` (doble tipado `PhotoStorage`; `grep -cF "objectExists: jest.fn(),"` → `1`)
7. `src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts` (doble tipado `PhotoStorage`; `grep -cF "objectExists: jest.fn(),"` → `1`)

`list-pet-documents.use-case.spec.ts` usa
`{ createDownloadUrl } as unknown as PhotoStorage` (cast, no enumera
métodos) y `test/aws-real-media.e2e-spec.ts` instancia el adapter real sin
llamar a `objectExists`: ninguno de los dos cambia.

## Contrato hacia #158 (`mobile-docs-upload`)

Valores **literales** que la spec de #158 copia tal cual (el cliente no
puede importar código del backend):

| Qué | Valor |
|---|---|
| Tamaño máximo de un documento, en bytes, para **cualquier** tipo de fichero | `10485760` (10 MiB = 10 × 1024 × 1024) |
| Un fichero de exactamente `10485760` bytes | se acepta (204 en el confirm) |
| Un fichero de `10485761` bytes o más | confirm → **409** |
| Cuerpo del 409 por tamaño | `{"statusCode": 409, "code": "PET_DOCUMENT_TOO_LARGE", "message": "Pet document file exceeds the size limit"}` |
| Cuerpo del 409 por fichero ausente (ya existe, #157 R6 (d)) | `{"statusCode": 409, "code": "PET_DOCUMENT_NOT_UPLOADED", "message": "Pet document file not found in storage"}` |
| Qué distingue los dos 409 | la clave `code`; el cliente mapea `code` a copy en/es, nunca `message` |
| HEAD sin `ContentLength` (anomalía de infraestructura, R3) | **500** genérico de Nest; el cliente lo trata como cualquier error de servidor |
| Documento rechazado por tamaño | sigue **pendiente** (fuera del GET); el cliente puede volver a hacer `PUT` de un fichero ≤ límite a la misma `uploadUrl` mientras no caduque (600 s) y confirmar otra vez |

El cliente (#158) comprueba el límite **antes** del PUT; el confirm es la
red de seguridad del servidor, no la primera línea.

## Requisitos funcionales

### Tamaño del objeto en el puerto de storage

- **R1**: THE SYSTEM SHALL sustituir en el puerto `PhotoStorage`
  (`src/modules/media/domain/ports/photo-storage.ts`) el método
  `objectExists(key: string): Promise<boolean>;` por
  `getObjectSize(key: string): Promise<number | null>;`, implementado en
  `PhotoStorageS3Adapter` con el **mismo**
  `HeadObjectCommand({Bucket: this.names.mediaBucket, Key: key})` enviado
  por el `S3_CLIENT` existente, con una rama por caso:
  - (a) WHEN el HEAD responde con `ContentLength` de tipo `number` THE
    SYSTEM SHALL resolver ese número tal cual, **incluido `0`** (el
    adapter no aplica ningún límite);
  - (b) IF el HEAD responde pero `ContentLength` no es de tipo `number`
    THEN THE SYSTEM SHALL rechazar con
    `new Error('HeadObject response has no ContentLength')` (mensaje
    exacto);
  - (c) IF el HEAD falla con `$metadata.httpStatusCode === 404` THEN THE
    SYSTEM SHALL resolver `null`;
  - (d) IF el HEAD falla con cualquier otro error THEN THE SYSTEM SHALL
    relanzarlo tal cual (mismo objeto).
  AND tras el cambio `objectExists` SHALL NOT existir en
  `backend-pet-tracker/` (R4).
  *Tests: `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`
  → los tres its de `#157 R7` adaptados (E1: comando enviado + (a) con
  `18`, (c) y (d)) y
  `describe('#161 R1: getObjectSize devuelve ContentLength o falla sin él', ...)`
  con un it por (a) con `10485761`, (a) con `0` y (b).*

### Límite en el confirm

- **R2**: WHEN el owner hace `POST /v1/pets/:petId/media/:documentId/confirm`
  sobre un documento **pendiente** de esa mascota cuyo objeto existe
  (`getObjectSize(key)` no es `null`) THE SYSTEM SHALL comparar su tamaño
  con el límite de **10485760 bytes** (constante
  `export const PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;` en
  `confirm-pet-document-upload.use-case.ts`), con una rama por caso:
  - (a) WHEN el tamaño es **≤ 10485760** (en particular exactamente
    `10485760`) THE SYSTEM SHALL fijar `uploaded_at = now()` y responder
    **204 sin cuerpo**, y el documento SHALL aparecer en
    `GET /v1/pets/:petId/media` (comportamiento de #157 R5, sin cambios);
  - (b) IF el tamaño es **> 10485760** (en particular `10485761`) THEN THE
    SYSTEM SHALL lanzar el error de dominio `PetDocumentTooLargeError`
    (nuevo en `pet-document.errors.ts`, `name = 'PetDocumentTooLargeError'`,
    mensaje `'Pet document file exceeds the size limit'`), que
    `mapPetDocumentError` traduce a `ConflictException` → **409** con
    cuerpo **exacto**
    `{statusCode: 409, code: 'PET_DOCUMENT_TOO_LARGE', message: 'Pet document file exceeds the size limit'}`;
    AND `markUploaded` SHALL NOT llamarse (`uploaded_at` sigue `NULL`);
    AND el documento SHALL seguir fuera del GET; AND el objeto SHALL
    seguir en el bucket con su tamaño (no se borra, [[design]] §D3);
  - (c) WHEN el documento ya estaba confirmado THE SYSTEM SHALL responder
    204 **sin** llamar a `getObjectSize` (no se re-verifica el tamaño de
    documentos confirmados; idempotencia de #157 R5).
  Orden de comprobaciones del use case: UUID → repositorio → ya
  confirmado → `getObjectSize` → `null` (409 `PET_DOCUMENT_NOT_UPLOADED`,
  #157 R6 (d), sin cambios) → tamaño → `markUploaded`.
  *Tests unitarios: `confirm-pet-document-upload.use-case.spec.ts` →
  `describe('#161 R2: ConfirmPetDocumentUploadUseCase aplica el límite de 10485760 bytes', ...)`
  con un it por (a) y (b); (c) lo sigue cubriendo el it existente
  `#157 R5: ya confirmado: resuelve sin llamar a getObjectSize ni a markUploaded`
  (E2). `src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts`
  (nuevo) →
  `describe('#161 R2: mapPetDocumentError traduce PetDocumentTooLargeError a 409', ...)`.
  e2e: `test/media-docs.e2e-spec.ts` →
  `describe('#161 R2: confirm contra LocalStack en la frontera de 10485760 bytes', ...)`
  con un it por (a) (PUT de `10485760` bytes) y (b) (PUT de `10485761`
  bytes). Los tests asertan **literales** (`10485760`, `10485761`), nunca
  `PET_DOCUMENT_MAX_BYTES`.*

### ContentLength ausente

- **R3**: IF `getObjectSize` rechaza porque el HEAD no trae
  `ContentLength` (R1 (b)) THEN THE SYSTEM SHALL propagar ese **mismo**
  error desde `ConfirmPetDocumentUploadUseCase` sin llamar a
  `markUploaded`; AND `mapPetDocumentError` SHALL devolver ese error **por
  identidad** (ni 404 ni 409), de modo que Nest responda **500**; AND
  `uploaded_at` SHALL seguir `NULL` y nada se borra. Falla cerrado: sin
  tamaño no se confirma ([[design]] §D4).
  *Tests: `confirm-pet-document-upload.use-case.spec.ts` →
  `describe('#161 R3: ContentLength ausente no confirma', ...)`;
  `pet-document-error.mapper.spec.ts` →
  `describe('#161 R3: mapPetDocumentError devuelve por identidad un error desconocido', ...)`.
  **Sin e2e**: LocalStack y S3 siempre devuelven `Content-Length` en un
  HEAD 200, así que la rama no se reproduce contra LocalStack sin sustituir
  el adapter, y eso dejaría de ser un e2e contra LocalStack.*

### Regresión y contención

- **R4**: WHEN se ejecutan, **sin pipe** (memoria `exit-code-tras-pipe`),
  `pnpm -C backend-pet-tracker run lint`, `pnpm -C backend-pet-tracker test`,
  `pnpm -C backend-pet-tracker run test:e2e` y `./init.sh` THE SYSTEM SHALL
  salir con exit 0 en los cuatro; AND los únicos tests existentes
  modificados SHALL ser los de §Tests existentes que cambian (E1–E5), y
  cada uno solo como allí se describe; AND tras el cambio SHALL cumplirse,
  desde la raíz del repo:
  - `grep -rlF "objectExists" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `0`;
  - `grep -rlF "getObjectSize" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `7` (las 7 rutas del inventario de §Contexto fijo);
  - `grep -cF "getObjectSize(key: string): Promise<number | null>;" backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts` → `1`;
  - `grep -cF "export const PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts` → `1`;
  - `grep -rlF "PET_DOCUMENT_MAX_BYTES" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `1` (ningún test importa la constante);
  - `grep -rlF "PET_DOCUMENT_TOO_LARGE" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `3` (mapper, su spec y el e2e);
  - `grep -rlF "HeadObjectCommand" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `3` (adapter, su spec y el e2e);
  - `grep -rlF "DeleteObjectCommand" backend-pet-tracker/src | wc -l` → `0`;
  AND `git diff --name-only <hash-handoff>...HEAD -- infra mobile-pet-tracker`
  SHALL salir vacío; AND el diff contra el commit de handoff SHALL tocar
  solo las rutas de [[design]] §Archivos afectados.
  *Verificación: el implementer anota las cuatro salidas y los ocho greps
  en `progress/impl_media-docs-confirm-size-limit.md`; el reviewer los
  re-ejecuta.*

## Requisitos de verificación (CHECKPOINTS C4)

Declarados antes del handoff, con la vía de C4 que sigue cada uno:

- **R2 (a) y R2 (c)** — ramas frontera. (a) pasa ya antes de la
  implementación, porque sin límite todo se acepta; (c) es el it existente
  de #157 R5 (E2). Vía **(b)**: se cierran por mutación (sondas S2a, S2b y
  S2g de [[tasks]]) con la evidencia en el reporte del `reviewer`. R2 (b)
  sí tiene rojo real por aserción (unit y e2e).
- **R3** entero — candado sobre código que ya será correcto tras R1 y R2.
  Su rojo es una **mutación de producción versionada** en el commit rojo y
  revertida en el verde (M3a y M3b de [[tasks]]), nunca una mutación de un
  doble.
- **R4** — verificación de suites y greps, sin test propio.

## Tests existentes que cambian

Lista **cerrada**: cualquier otra modificación de un test existente es
rechazo. Rutas relativas a `backend-pet-tracker/`.

| # | Fichero | Qué cambia (y nada más) | Por qué |
|---|---|---|---|
| E1 | `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts` (el nombre del fichero **no** cambia: la trazabilidad de #157 R7 apunta a él) | Toda aparición de `objectExists` pasa a `getObjectSize` (`grep -cF "objectExists"` → `4` antes, `0` después; incluye el título del `describe('#157 R7: …')`). En el it `#157 R7: resuelve true cuando el HEAD responde`: título → `#157 R7: resuelve ContentLength cuando el HEAD responde`, `send.mockResolvedValue({});` → `send.mockResolvedValue({ ContentLength: 18 });`, `.resolves.toBe(true)` → `.resolves.toBe(18)`. En el it `#157 R7: resuelve false cuando el HEAD falla con 404`: título → `#157 R7: resuelve null cuando el HEAD falla con 404`, `.resolves.toBe(false)` → `.resolves.toBeNull()`. El tercer it solo cambia por el renombrado | R1 (un HEAD sin `ContentLength` ahora rechaza, R1 (b)) |
| E2 | `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts` | Toda aparición de `objectExists` pasa a `getObjectSize` (`19` → `0`, títulos incluidos); `const objectExists = jest.fn().mockResolvedValue(true);` → `const getObjectSize = jest.fn().mockResolvedValue(1024);`; `objectExists.mockResolvedValue(false);` → `getObjectSize.mockResolvedValue(null);` | R1 |
| E3 | `src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts` | `objectExists: jest.fn(),` → `getObjectSize: jest.fn(),` | R1 (doble tipado `PhotoStorage`: sin esto ts-jest no compila) |
| E4 | `src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts` | `objectExists: jest.fn(),` → `getObjectSize: jest.fn(),` | R1 (ídem) |
| E5 | `test/media-docs.e2e-spec.ts` | Solo la línea de import: `import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';` → `import { GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';`. Ningún it existente cambia: todos suben ficheros de menos de 10485760 bytes | R2 (el e2e comprueba que el objeto rechazado sigue en el bucket) |

## Decisiones abiertas

Cada una ya está aplicada con su opción por defecto. Si el humano la cambia
en el gate, la spec se enmienda antes del handoff.

| # | Decisión | Defecto aplicado | Alternativa principal |
|---|---|---|---|
| DA1 | Límite (Q1) | `10485760` bytes (10 MiB) | `20971520` (20 MiB) |
| DA2 | Tipos MIME a los que aplica | A todos por igual; sin whitelist de tipos | Límites por tipo (PDF vs imagen) |
| DA3 | Objeto que excede (Q2) | Se deja en el bucket; documento pendiente y oculto; sin `s3:DeleteObject` | Borrarlo en el confirm (`DeleteObjectCommand`; exige `s3:DeleteObject` en #160) |
| DA4 | `ContentLength` ausente | Falla cerrado: 500, sin confirmar, sin borrar | Confirmar igualmente (falla abierto) o un 409 propio |
| DA5 | HTTP del rechazo | 409 con `code: 'PET_DOCUMENT_TOO_LARGE'` | 413 o 422 ([[design]] §Alternativas) |
| DA6 | Re-verificar documentos ya confirmados | No (idempotencia de #157 R5) | HEAD en cada confirm |

## Preguntas al humano

- **Q1 — límite (producto)**: ¿10 MiB (`10485760` bytes) para cualquier
  documento? Recomendación: sí. Cubre PDFs médicos escaneados de varias
  páginas y fotos de móvil a la resolución por defecto (12 MP, unos
  3–5 MB). Una foto de 48 MP sin reducir puede pasar de 10 MiB; #158 puede
  recomprimirla en el cliente. Es el número que copiará #158.
- **Q2 — objeto que excede (coste)**: ¿dejarlo en el bucket (pendiente y
  oculto) o borrarlo en el confirm? Recomendación: dejarlo. Borrar en el
  confirm solo limpia a un cliente honesto que se pasó, y #158 ya lo frena
  antes del PUT; quien sube de más a propósito no llama al confirm, así
  que borrar ahí no lo para. Dejarlo evita `s3:DeleteObject` en #160 y un
  método nuevo en el puerto. Coste: el almacenamiento S3 de esos objetos,
  igual que el de cualquier PUT que hoy se queda sin confirmar.
- **Q3 — tope real en la subida (registrar deuda o no)**: lo único que para
  a un cliente malicioso es que S3 rechace la subida (POST prefirmado con
  `content-length-range`, o PUT firmado con `Content-Length`). Cambia el
  contrato de `POST /v1/pets/:petId/media` y el flujo de subida de #158,
  así que no entra aquí. ¿Se registra como feature aparte? Recomendación:
  no por ahora (P3). Si se registra, que vaya antes del código de #158
  para no rehacer la subida móvil.

## Fuera de alcance

Clasificado viñeta a viñeta (memoria `fuera-de-alcance-no-todo-es-feature`):

- *Delimitación*: `mobile-pet-tracker/`. El límite en el cliente, el copy
  en/es de `PET_DOCUMENT_TOO_LARGE` y el reintento son de #158, que copia
  los literales de §Contrato hacia #158.
- *Delimitación*: `infra/`, IAM y CDK. Con DA3 por defecto, #161 **no**
  añade ninguna acción a #160: `s3:GetObject`, `s3:PutObject` y
  `s3:ListBucket` siguen bastando. **Dependencia condicional hacia #160**:
  si el humano elige borrar (Q2), #160 debe conceder también
  `s3:DeleteObject` sobre el bucket de media antes de que #161 corra en
  modo `aws`. Esta spec no edita la entrada de #160.
- *Delimitación*: whitelist de tipos MIME y límites por tipo (DA2). El
  `Content-Type` lo manda el cliente en el PUT sin firmar (#157 DA5).
- *Delimitación*: ficheros de 0 bytes. Están por debajo del límite y se
  aceptan; rechazarlos sería otra regla.
- *Delimitación*: documentos confirmados antes de #161 que superen el
  límite. Siguen confirmados (DA6).
- *Deuda posible, no registrada*: tope en la subida prefirmada (Q3) y
  barrido de documentos pendientes huérfanos (ya listado en #157), que
  también limpiaría los rechazados por tamaño.
- *Deuda heredada, cubierta en parte*: Obs. 1 del veredicto de #157
  (`return error;` del mapper sin candado unitario). R3 la cierra para
  errores desconocidos; las ramas `PET_DOCUMENT_NOT_FOUND` y
  `PET_DOCUMENT_NOT_UPLOADED` del mapper siguen candadas solo por e2e.
- *Delimitación*: cualquier prueba contra AWS real. Todo corre en
  unitarios y contra LocalStack.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-08) ← gate obligatorio antes de implementar
- Respuestas a Q1–Q3 (frase literal del humano, escrita en la página de Notion): «Dejarlas como los recomendaste es buena opción.» Q1: 10485760 bytes; Q2: el objeto se deja en el bucket; Q3: no se registra deuda. DA1–DA6 quedan con su opción por defecto.
