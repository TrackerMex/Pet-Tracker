---
feature: "media-docs-confirm-size-limit"
status: draft        # draft | approved
tags: [harness, spec, backend, media]
---

# Diseño — [[media-docs-confirm-size-limit]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. Base
> congelada `58323e49`. Rutas relativas a `backend-pet-tracker/` salvo que
> se diga otra cosa.

## Decisiones técnicas

- **D1 — Un solo HEAD da existencia y tamaño (R1, R2)**: `objectExists`
  se **sustituye** por `getObjectSize(key): Promise<number | null>`, con
  `null` = objeto ausente (404). El confirm es el único consumidor de
  `objectExists` (inventario de 7 rutas en [[requirements]] §Contexto
  fijo), así que reemplazar el método cuesta un renombrado en 4 tests y
  2 dobles. Añadir un método aparte dejaría `objectExists` como código
  muerto o haría dos HEAD por confirm. El `HeadObjectCommand`, el bucket,
  la key y la rama 404 → "ausente" de #157 R7 no cambian, y el comentario
  `ponytail:` del adapter (403 sin `s3:ListBucket`, #160) se conserva.
- **D2 — El adapter traduce `ContentLength` (R1 (b))**: el SDK tipa
  `HeadObjectCommandOutput.ContentLength` como `number | undefined`. El
  adapter convierte ese `undefined` en un rechazo con
  `Error('HeadObject response has no ContentLength')`, de modo que el
  puerto solo promete `number | null` y el use case nunca ve `undefined`.
  La comprobación es `typeof ContentLength !== 'number'`, **no** un
  falsy-check: `0` es un tamaño válido (it de R1 (a) con `0`).
- **D3 — El objeto que excede se queda en el bucket (R2 (b); Q2, DA3)**:
  el documento sigue pendiente (`uploaded_at` `NULL`) y fuera del GET, igual
  que cualquier PUT sin confirmar; nadie recibe nunca una URL de lectura
  para él. No se añade `deleteObject` al puerto ni `DeleteObjectCommand`
  al adapter, así que #160 no necesita `s3:DeleteObject` por #161. Borrar
  en el confirm solo afectaría a clientes que llaman al confirm; un
  cliente malicioso no lo llama, así que el borrado no protegería el
  bucket. El freno real está en la subida (Q3). Como el documento sigue
  pendiente, el dueño puede volver a hacer PUT de un fichero válido a la
  misma `uploadUrl` mientras no caduque y confirmar de nuevo.
- **D4 — `ContentLength` ausente falla cerrado (R3; DA4)**: sin tamaño no
  se puede aplicar el límite, así que no se confirma. S3 y LocalStack
  siempre mandan `Content-Length` en un HEAD 200, así que la rama es una
  anomalía de infraestructura (proxy, cambio de SDK): el error llega sin
  tocar al controller, `mapPetDocumentError` lo devuelve por identidad y
  Nest responde 500. No se usa un 409 propio porque el cliente no puede
  hacer nada distinto de reintentar. El dueño puede reintentar el confirm.
- **D5 — 409 con `code` propio (R2 (b); DA5)**: `docs/conventions.md`
  §Manejo de errores reserva 409/`ConflictException` para los conflictos
  con el estado del recurso, y el confirm ya responde 409
  `PET_DOCUMENT_NOT_UPLOADED` cuando el objeto guardado no permite
  confirmar. Un objeto demasiado grande es el mismo tipo de conflicto con
  otra causa: mismo status, otro `code`. El móvil (#158) distingue por
  `code`.
- **D6 — Dónde vive el límite (R2)**: `PET_DOCUMENT_MAX_BYTES` se exporta
  desde `confirm-pet-document-upload.use-case.ts`, como
  `DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS` (create) y
  `DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS` (list). Se escribe
  `10 * 1024 * 1024` para que se lea como 10 MiB; los tests asertan el
  literal `10485760` y nunca importan la constante (memoria
  `candados-tautologicos`). El mensaje del error de dominio no lleva el
  número, porque domain no puede importar de application.
- **D7 — e2e en la frontera contra LocalStack (R2)**: dos PUT reales a la
  `uploadUrl` prefirmada, de `10485760` y `10485761` bytes
  (`Buffer.alloc(<literal>, 0x61)`), con el patrón de PUT sin
  `Authorization` de #157 R5. Antes del confirm, cada it comprueba con el
  cliente `s3` del e2e (`HeadObjectCommand` sobre
  `resourceNames.mediaBucket` y `document.key`) que LocalStack guardó
  **exactamente** ese `ContentLength`; el it (b) repite el HEAD después
  del 409 para probar que el objeto no se borró. Cada it lleva timeout
  explícito `30000` como tercer argumento de `it`, porque
  `test/jest-e2e.json` no fija `testTimeout` (5 s de jest por defecto) y
  sube 10 MiB.

## Archivos afectados

Lista **cerrada** (R4). Rutas relativas a `backend-pet-tracker/`.

Producción:

- `src/modules/media/domain/ports/photo-storage.ts` (domain): la línea
  `objectExists(key: string): Promise<boolean>;` pasa a
  `getObjectSize(key: string): Promise<number | null>;`.
- `src/modules/media/domain/errors/pet-document.errors.ts` (domain): nueva
  clase `PetDocumentTooLargeError extends Error`, mensaje
  `'Pet document file exceeds the size limit'`,
  `this.name = 'PetDocumentTooLargeError'`, mismo patrón que las dos
  existentes.
- `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts`
  (application): `export const PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;`;
  `getObjectSize` sustituye a `objectExists`; `null` lanza
  `PetDocumentNotUploadedError` y un tamaño `> PET_DOCUMENT_MAX_BYTES`
  lanza `PetDocumentTooLargeError`, en ese orden y antes de `markUploaded`.
- `src/modules/media/infrastructure/photo-storage.s3.adapter.ts`
  (infrastructure): `objectExists` pasa a `getObjectSize` según R1 (mismo
  `HeadObjectCommand`, lee `ContentLength` de la respuesta).
- `src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts`
  (infrastructure): rama nueva `PetDocumentTooLargeError` →
  `new ConflictException({statusCode: HttpStatus.CONFLICT, code: 'PET_DOCUMENT_TOO_LARGE', message: 'Pet document file exceeds the size limit'})`;
  el `return error;` final no cambia.

Tests:

- `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`:
  E1 + `describe('#161 R1: …')`.
- `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts`:
  E2 + `describe('#161 R2: …')` + `describe('#161 R3: …')`.
- `src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts`: E3.
- `src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts`: E4.
- `src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts`
  (**nuevo**): `describe('#161 R2: …')` + `describe('#161 R3: …')`.
- `test/media-docs.e2e-spec.ts`: E5 + `describe('#161 R2: …')`.

Harness (fuera de `backend-pet-tracker/`):

- `specs/media-docs-confirm-size-limit/traceability.md` (lo rellena el
  implementer).
- `progress/impl_media-docs-confirm-size-limit.md` (nuevo, el implementer).

**No cambian**: `pet-media.controller.ts` (el `confirm` ya pasa todo error
por `mapPetDocumentError`: `grep -cF "throw mapPetDocumentError(error);" backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts`
→ `1`, el del `confirm`), `media.module.ts`, el esquema y las migraciones,
`infra/` y `mobile-pet-tracker/`.

## Alternativas descartadas

- **Añadir `getObjectSize` y conservar `objectExists`**: dos métodos sobre
  el mismo HEAD; el viejo quedaría sin consumidores (D1).
- **`headObject(key): Promise<{contentLength?: number} | null>`**: deja
  pasar `undefined` al use case y reparte la regla de D2 entre dos capas.
- **Borrar el objeto en el confirm** (Q2): exige `deleteObject` en el
  puerto, `DeleteObjectCommand`, `s3:DeleteObject` en #160 y un caso más
  de fallo (¿qué responde si el borrado falla?), sin frenar al cliente
  malicioso (D3).
- **413 Content Too Large**: RFC 9110 §15.5.14 lo define para el
  *contenido de la petición*, y el confirm no lleva cuerpo; además
  `docs/conventions.md` no lo contempla. **422**: tampoco está en la tabla
  de conventions y el cuerpo del confirm no tiene nada inválido (D5).
- **Tope en la subida** (POST prefirmado con `content-length-range` o PUT
  firmado con `Content-Length`): sí frena a un cliente malicioso, pero
  cambia el contrato del POST de #49/#157 y el flujo de #158 (Q3).
- **Validar el tamaño en `GET /media`** (HEAD por documento listado):
  coste por lectura y latencia en cada GET; el confirm ya es el punto
  único por el que un documento pasa a visible.
- **`ContentLength` ausente → confirmar igualmente** (falla abierto):
  deja pasar sin límite justo cuando la infraestructura se comporta raro
  (D4).
