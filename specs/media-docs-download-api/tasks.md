---
feature: "media-docs-download-api"
status: draft        # draft | approved
tags: [harness, spec, backend, media]
---

# Tareas — [[media-docs-download-api]]

> Disciplina TDD. Cada bloque corresponde a un requisito (o a requisitos que
> comparten commit) de [[requirements]], con los mismos 3 sub-items en este
> orden. Rutas desde la raíz del repo; `B=backend-pet-tracker`.

## Reglas de cabecera (valen para todos los bloques)

1. **Commit rojo antes que verde.** El rojo lleva el test y, si hace falta,
   el **stub** de firma que se indica; el verde, la implementación. Nunca
   implementación + tests en un solo commit (C4; en #19 pasó).
2. **El rojo tiene que ser de aserción.** ts-jest tiene los diagnósticos
   activos: un `TS2307`/`TS2339`/`TS2554`/`TS2353` tumba la suite entera y
   **no vale como rojo**. Por eso los commits rojos de R7, R5/R6 y R4/R8
   llevan el stub descrito, y los acomodos de dobles tipados (E5, E6,
   helper `document()` de E7) van en el commit que cambia el tipo. Tampoco
   vale un `ReferenceError` de un helper de test: todo helper nuevo
   (`confirmDocument`) entra en el mismo commit rojo que lo usa.
3. **Orden fijo y por qué.** El filtro de pendientes (R3) entra **después**
   de la confirmación (R5): con el filtro y sin confirm, el it de #49 R3
   (E4) no tendría forma de volver a ver su documento y quedaría rojo
   varios commits. Por eso las aserciones "no aparece en GET" de R2 y de
   R6 (d) se escriben en el commit rojo de R3, cuyo rojo es justo la
   ausencia del filtro. R8 comparte rojo y verde con R4 porque su último
   paso es la descarga por `downloadUrl`.
4. **Requisitos de verificación (C4)**: R8 va por la vía **(a)** — su test
   se escribe en el commit rojo de R4, antes de que exista `downloadUrl`, y
   su rojo es real. R9 no tiene test propio: se cierra con la salida de
   los comandos (ver su bloque).
5. **Aserciones de GET por id, no por objeto**, en todos los its nuevos que
   lean el listado antes de R4 (`listed.body.map((d) => d.id)`): R4 añade
   `downloadUrl` a cada elemento y un `toEqual` con el objeto de 6 claves
   se rompería en el verde de R4.
6. **Sin pipe** al medir exit codes (memoria `exit-code-tras-pipe`).
   Ejecuciones parciales:
   - unit: `pnpm -C backend-pet-tracker exec jest src/modules/media src/db/schema/media.schema.spec.ts`
   - e2e (requiere `docker compose up -d` y la base migrada):
     `pnpm -C backend-pet-tracker run test:e2e -- media-docs`
7. **Medir la base al arrancar**, antes del primer commit, y anotar las
   salidas en `progress/impl_media-docs-download-api.md`:
   - `ls backend-pet-tracker/src/db/migrations/ | grep -c "^0019_"` → `0`
     (si da `1`, **para**: otra feature tomó el número y el leader reasigna);
   - `grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json` → `19`;
   - `grep -rlF "listByPet" backend-pet-tracker/src/modules/media | wc -l` → `5`;
   - los anclas de [[requirements]] §Contexto fijo, por contenido.
8. Prefijo `#157 R<n>:` en todo `describe`/`it` nuevo
   (`docs/conventions.md` §Prefijo de feature). Los its de #49 modificados
   (E2–E4) **conservan** su describe y su título de #49, salvo el retítulo
   de E2.

## Tabla de commits y rojo esperado

| # | Commit | Rojo esperado (por aserción) |
|---|---|---|
| 1 | `test(media): uploaded_at y migración 0019 (R1)` | `media.schema.spec.ts`: los 3 its |
| 2 | `feat(db): columna pet_documents.uploaded_at, migración 0019 (R1)` | — |
| 3 | `test(media): objectExists hace HEAD (R7)` + stub | `photo-storage.object-exists.spec.ts`: los 3 its |
| 4 | `feat(media): objectExists con HeadObjectCommand (R7)` | — |
| 5 | `test(media): el documento nace pendiente (R2)` | E5 (`uploadedAt: null`) |
| 6 | `test(media): confirmación de subida (R5,R6)` + stub | unit `#157 R5` y `#157 R6` (6 its); e2e `#157 R5`, `#157 R6` (a)–(f), E4 (paso de confirm) |
| 7 | `feat(media): estado de subida y POST …/confirm (R2,R5,R6)` | — (verdes 5 y 6) |
| 8 | `test(media): GET oculta los pendientes (R2,R3)` + renombre | e2e `#157 R3` (it.each), `#157 R2`, E2, R6 (d) con GET. El describe unit `#157 R3` nace **verde** por el renombre, declarado |
| 9 | `feat(media): filtra pendientes del listado (R2,R3)` | — |
| 10 | `test(media): downloadUrl y flujo completo (R4,R8)` + stub | unit `#157 R4`; e2e `#157 R4` (it.each), `#157 R8` (it.each). E3 y la parte R4 de E4 nacen **verdes** con el stub (`''` es un `String`), declarado |
| 11 | `feat(media): firma downloadUrl de 3600 s (R4,R8)` | — |
| 12 | `test(media-docs-download-api): verify regression and containment (R9)` | — (solo `progress/impl_…` y trazabilidad) |

Commits de refactor (`refactor(media): …`) opcionales tras cada verde,
siempre con la suite unit y la e2e de media verdes.

---

## R1 — columna `uploaded_at` y migración 0019

- [ ] (1) Test rojo (commit 1) — crear `B/src/db/schema/media.schema.spec.ts`
      con `describe('#157 R1: columna uploaded_at y migración 0019', ...)`,
      patrón de `alerts.schema.spec.ts` (`getTableConfig` +
      `readdirSync`/`readFileSync` sobre `join(__dirname, '..', 'migrations')`):
      - `it('#157 R1: pet_documents.uploaded_at es timestamptz nullable sin default', ...)`
        → **primero** `expect(columnNames).toContain('uploaded_at')` (rojo
        de aserción, no `TypeError` sobre `undefined`); luego
        `notNull === false`, `hasDefault === false`,
        `getSQLType() === 'timestamp with time zone'`;
      - `it('#157 R1: la migración 0019_pet_documents_uploaded_at.sql es exactamente el ALTER', ...)`
        → **primero** `readdirSync(MIGRATIONS_DIR)` `toContain`
        `'0019_pet_documents_uploaded_at.sql'`; luego su contenido con
        `.trim()` es
        `ALTER TABLE "pet_documents" ADD COLUMN "uploaded_at" timestamp with time zone;`;
      - `it('#157 R1: el journal registra 0019_pet_documents_uploaded_at con idx 19', ...)`
        → en `meta/_journal.json` la entrada con
        `tag === '0019_pet_documents_uploaded_at'` existe y tiene
        `idx === 19`. **No** asertar el total de entradas: caduca con la
        próxima migración de otra feature.
- [ ] (2) Implementación mínima (commit 2) — en `B/src/db/schema/media.schema.ts`,
      `uploadedAt: timestamp('uploaded_at', { withTimezone: true })` en
      `petDocuments` (sin `.notNull()` ni `.defaultNow()`); generar con
      `pnpm -C backend-pet-tracker db:generate --name pet_documents_uploaded_at`.
      **No** editar a mano el SQL ni el snapshot: si drizzle-kit genera algo
      distinto del ALTER exacto, **para** y repórtalo. Aplicar a la base
      local con `pnpm -C backend-pet-tracker db:migrate` (lee el `.env` del
      worktree; no exportes `DATABASE_URL`).
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R7 — `PhotoStorage.objectExists`

- [ ] (1) Test rojo (commit 3) — crear
      `B/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`
      con `describe('#157 R7: objectExists hace HEAD al bucket de media', ...)`.
      Construcción: `const send = jest.fn();`
      `new PhotoStorageS3Adapter({ send } as unknown as S3Client, { mediaBucket: 'bucket-under-test' } as AwsResourceNames)`.
      Un it por rama:
      - `it('#157 R7: resuelve true cuando el HEAD responde', ...)` → `send`
        resuelve `{}`; resultado `true`; `send` llamado una vez con un
        argumento `instanceof HeadObjectCommand` cuyo `input` es
        `{ Bucket: 'bucket-under-test', Key: 'pets/p/docs/d' }` (literales);
      - `it('#157 R7: resuelve false cuando el HEAD falla con 404', ...)` →
        `send` rechaza con
        `Object.assign(new Error('NotFound'), { name: 'NotFound', $metadata: { httpStatusCode: 404 } })`;
        resultado `false`;
      - `it('#157 R7: relanza cualquier otro error, por ejemplo un 403', ...)`
        → `send` rechaza con un error con `$metadata: { httpStatusCode: 403 }`;
        `rejects.toBe(eseMismoError)`.
      **Stub en este commit**: `objectExists(key: string): Promise<boolean>;`
      en el puerto `B/src/modules/media/domain/ports/photo-storage.ts`; en
      `PhotoStorageS3Adapter`, un `objectExists` que devuelve
      `Promise.resolve(true)` **sin** llamar a `send`; y `objectExists: jest.fn(),`
      en los dos dobles tipados — E5 (`create-pet-document.use-case.spec.ts`)
      y E6 (`request-photo-upload-url.use-case.spec.ts`), nada más en E6.
      Rojo: it 1 (no hubo `send`), it 2 (`true` ≠ `false`), it 3 (no rechaza).
- [ ] (2) Implementación mínima (commit 4) — el adapter envía
      `new HeadObjectCommand({ Bucket: this.names.mediaBucket, Key: key })`
      por `this.s3` y devuelve `true`; en el `catch`, `false` si
      `error.$metadata?.httpStatusCode === 404`, si no `throw error`. Con el
      comentario `// ponytail:` de [[design]] §D7 (sin `s3:ListBucket` un
      objeto ausente responde 403 y el confirm daría 500).
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R2 — el documento nace pendiente

- [ ] (1) Test rojo (commit 5) — E5: en `create-pet-document.use-case.spec.ts`
      el `toEqual` del documento gana `uploadedAt: null`. Rojo: el use case
      no fija el campo. La parte "no aparece en GET" de R2 se escribe en el
      commit 8 (bloque R3), porque su rojo es la ausencia del filtro.
- [ ] (2) Implementación mínima (commit 7, compartido con R5/R6):
      - `PetDocument` gana `uploadedAt: Date | null`;
      - `CreatePetDocumentUseCase` construye el documento con `uploadedAt: null`;
      - el repositorio drizzle inserta `uploadedAt` y lo mapea en `toDomain`;
      - E7 (acomodo de tipo): el helper `document()` de
        `list-pet-documents.use-case.spec.ts` gana `uploadedAt` — aquí y no
        antes, porque antes de cambiar la entidad sería un `TS2353`.
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R5 y R6 — confirmación de subida

- [ ] (1) Test rojo (commit 6) — en un solo commit:
      - **stub**: `B/src/modules/media/domain/errors/pet-document.errors.ts`
        con `PetDocumentNotFoundError` y `PetDocumentNotUploadedError`
        (reales); `application/use-cases/confirm-pet-document-upload.use-case.ts`
        con la clase, el constructor de [[design]] §Firmas (tokens
        `PET_DOCUMENT_REPOSITORY` y `PHOTO_STORAGE`) y un `execute` que hace
        `throw new Error('ConfirmPetDocumentUploadUseCase not implemented')`.
        **Sin** ruta en el controller, **sin** provider en el módulo y
        **sin** métodos nuevos en el repositorio (los dobles del unit van
        con cast `as unknown as`);
      - nuevo `application/use-cases/confirm-pet-document-upload.use-case.spec.ts`,
        dobles
        `{ findByIdAndPet: jest.fn(), markUploaded: jest.fn() } as unknown as PetDocumentRepository`
        y `{ objectExists: jest.fn() } as unknown as PhotoStorage`:
        - `describe('#157 R5: ConfirmPetDocumentUploadUseCase marca subido', ...)`
          con `it('#157 R5: pendiente cuyo objeto existe: consulta objectExists(key) y llama markUploaded(id)', ...)`
          y `it('#157 R5: ya confirmado: resuelve sin llamar a objectExists ni a markUploaded', ...)`;
        - `describe('#157 R6: ConfirmPetDocumentUploadUseCase rechaza sin marcar', ...)`
          con `it('#157 R6 (a): documentId malformado: PetDocumentNotFoundError sin consultar el repositorio', ...)`,
          `it('#157 R6 (b)/(c): findByIdAndPet devuelve null: PetDocumentNotFoundError sin consultar el bucket', ...)`
          (aserta la llamada `findByIdAndPet(documentId, petId)`),
          `it('#157 R6 (d): objeto ausente: PetDocumentNotUploadedError sin markUploaded', ...)`
          y `it('#157 R6 (g): objectExists falla: propaga el mismo error sin markUploaded', ...)`
          (`rejects.toBe(boom)`).
        Rojo de los 6: el stub lanza un `Error` genérico (no resuelve, no es
        instancia de los errores de dominio, no es `boom`);
      - helper e2e `confirmDocument(user, petId, documentId)` en
        `B/test/media-docs.e2e-spec.ts`:
        `api().post(\`/v1/pets/${petId}/media/${documentId}/confirm\`).set(auth(user.token))`;
      - E4 (parte R5): en el it de #49 R3, entre el PUT y el GET,
        `await confirmDocument(owner, pet.id, createdBody.document.id).expect(204);`.
        El `toEqual` del GET no cambia todavía;
      - `describe('#157 R5: confirmar marca el documento como subido', ...)`:
        `it('#157 R5: el owner confirma un pendiente subido: 204 sin cuerpo, uploaded_at no nulo y aparece en GET', ...)`
        (POST + PUT + confirm; cuerpo vacío; fila con `uploadedAt`
        instancia de `Date`; GET por ids contiene el documento) y
        `it('#157 R5: un segundo confirm responde 204 y no cambia uploaded_at', ...)`
        (compara `getTime()` de la fila tras cada confirm);
      - `describe('#157 R6: confirmar rechaza sin escribir', ...)`; cada it
        aserta además que la fila sigue con `uploadedAt === null`:
        - `it('#157 R6 (a): documentId malformado responde 404 PET_DOCUMENT_NOT_FOUND', ...)`
          → `toEqual({ statusCode: 404, code: 'PET_DOCUMENT_NOT_FOUND', message: 'Pet document not found' })`
          (la fila comprobada es la de un documento pendiente de la misma
          mascota);
        - `it('#157 R6 (b): documentId inexistente responde el mismo 404', ...)` (`uuidv7()`);
        - `it('#157 R6 (c): documento de otra mascota responde el mismo 404 y no se marca', ...)`
          — dos mascotas del mismo owner; documento creado **y subido**
          (PUT) en la segunda; confirm por la ruta de la primera;
        - `it('#157 R6 (d): objeto ausente responde 409 PET_DOCUMENT_NOT_UPLOADED', ...)`
          → `toEqual({ statusCode: 409, code: 'PET_DOCUMENT_NOT_UPLOADED', message: 'Pet document file not found in storage' })`;
        - `it.each(['family', 'walker', 'vet'] as const)('#157 R6 (e): %s recibe 403 aunque el objeto exista', ...)`
          — documento creado por el owner y subido con PUT antes del confirm;
        - `it('#157 R6 (f): no-miembro, mascota inexistente y :petId malformado reciben el 404 del guard', ...)`
          → las tres respuestas `toEqual({ statusCode: 404, message: 'Not Found' })`
          (cuerpo de `NotFoundException()` del `PetAccessGuard`). El cuerpo
          exacto es lo que hace rojo este it: sin ruta, Nest responde
          `{ message: 'Cannot POST …', error: 'Not Found', statusCode: 404 }`.
      Rojo e2e: sin ruta, 404 de Nest en R5, R6 (a)–(e) y E4; cuerpo
      distinto en R6 (f).
- [ ] (2) Implementación mínima (commit 7, con R2):
      - repositorio: `findByIdAndPet` y `markUploaded` en la interfaz y en
        drizzle (`UPDATE … SET uploaded_at = now() WHERE id = :id AND uploaded_at IS NULL`);
      - `execute` según [[design]] §D4 (regex UUID → `findByIdAndPet` →
        salida temprana si `uploadedAt !== null` → `objectExists` →
        `markUploaded`);
      - `infrastructure/mappers/pet-document-error.mapper.ts` con
        `mapPetDocumentError` ([[design]] §D8);
      - `PetMediaController.confirm()` con `@Post(':documentId/confirm')`,
        `@RequirePetRole('owner')`, `@HttpCode(HttpStatus.NO_CONTENT)`;
      - provider `ConfirmPetDocumentUploadUseCase` en `media.module.ts`.
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R3 — el GET oculta los pendientes a los cuatro roles (y cierra el GET de R2 y R6 (d))

- [ ] (1) Test rojo (commit 8) — en un solo commit:
      - **renombre mecánico** (stub de firma, misma consulta, sin filtro):
        `listByPet` → `listUploadedByPet` en
        `domain/repositories/pet-document.repository.ts`,
        `infrastructure/repositories/pet-document.drizzle.repository.ts` y
        `application/use-cases/list-pet-documents.use-case.ts`; en el doble
        de E5, `listByPet: jest.fn(),` → `listUploadedByPet: jest.fn(),`;
      - E7 (parte R3): en `list-pet-documents.use-case.spec.ts` se **borra**
        `describe('R1: ListPetDocumentsUseCase delega en listByPet', ...)` y
        entra `describe('#157 R3: ListPetDocumentsUseCase delega en listUploadedByPet', ...)`
        con `it('#157 R3: pide al repositorio solo los documentos subidos de la mascota', ...)`
        (`listUploadedByPet` llamado una vez con el `petId`). Nace
        **verde** por el renombre, declarado; el rojo de R3 es el e2e;
      - E1: `seedDocument` gana la opción `uploadedAt?: Date | null` con
        **default `new Date()`**, que pasa al insert; lo que devuelve no
        cambia (6 claves);
      - `describe('#157 R3: GET oculta los pendientes a los cuatro roles', ...)`
        con `it.each(['owner', 'family', 'walker', 'vet'] as const)('#157 R3: %s solo ve los documentos subidos', ...)`:
        seed de uno subido (default) y otro pendiente (`uploadedAt: null`)
        de la misma mascota; membresía del rol; GET por ids `toEqual([subido.id])`.
        Rojo: lista los dos;
      - E2: el it de #49 R2 se retitula
        `responde 201/600s, persiste pendiente antes del PUT, no aparece en GET y audita pet.document_add`;
        `expect(listed.body).toEqual([body.document]);` pasa a
        `expect(listed.body).toEqual([]);`; el `toMatchObject` de la fila
        gana `uploadedAt: null`. Rojo: el GET lista el documento;
      - `describe('#157 R2: POST deja el documento pendiente', ...)` con
        `it('#157 R2: tras el PUT sin confirmar, la fila sigue con uploaded_at NULL y el GET solo lista los subidos', ...)`:
        seed de uno subido; `createDocument` del owner; PUT de bytes a
        `uploadUrl` (como #49 R3); fila del POST con `uploadedAt === null`;
        GET por ids `toEqual([seeded.id])`. Rojo: devuelve dos ids;
      - R6 (d) gana, tras el 409, `expect(listed.body).toEqual([])` sobre el
        GET del owner. Rojo: lo lista.
- [ ] (2) Implementación mínima (commit 9) — `listUploadedByPet` filtra con
      `and(eq(petDocuments.petId, petId), isNotNull(petDocuments.uploadedAt))`,
      conservando el orden de #49.
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R4 y R8 — `downloadUrl` de 3600 s y flujo completo

- [ ] (1) Test rojo (commit 10) — en un solo commit:
      - **stub** en `list-pet-documents.use-case.ts`: exportar
        `DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600` y
        `PetDocumentListItem`; el constructor gana
        `@Inject(PHOTO_STORAGE) private readonly storage: PhotoStorage`;
        `execute` devuelve `documents.map((document) => ({ document, downloadUrl: '' }))`
        **sin** llamar a `storage`. En `pet-document.mapper.ts`,
        `PetDocumentListItemResponse` y `toPetDocumentListItemResponse`
        reales; `PetMediaController.list()` mapea con esta última. El
        describe unit `#157 R3` pasa a construir con el doble de storage
        (`new ListPetDocumentsUseCase(documents, storage)`);
      - E7 (parte R4):
        `describe('#157 R4: ListPetDocumentsUseCase firma una URL de lectura de 3600 s por documento', ...)`
        con `it('#157 R4: firma cada key con createDownloadUrl(key, 3600) y devuelve {document, downloadUrl} en el orden del repositorio', ...)`:
        dos documentos; `createDownloadUrl` con
        `mockImplementation((key) => Promise.resolve(\`signed:${key}\`))`;
        `mock.calls` `toEqual([[keyA, 3600], [keyB, 3600]])` con el
        **literal** `3600`, no el símbolo; resultado
        `toEqual([{ document: a, downloadUrl: \`signed:${keyA}\` }, { document: b, downloadUrl: \`signed:${keyB}\` }])`;
      - E3: el it de #49 R1 de shape gana `downloadUrl: expect.any(String)`
        en cada elemento y `'downloadUrl'` en su lista de claves;
      - E4 (parte R4): el `toEqual([createdBody.document])` pasa a
        `toEqual([{ ...createdBody.document, downloadUrl: expect.any(String) }])`;
      - `describe('#157 R4: cada documento listado trae downloadUrl de 3600 s', ...)`
        con `it.each(['owner', 'family', 'walker', 'vet'] as const)('#157 R4: %s recibe downloadUrl prefirmada sobre la key', ...)`:
        seed de uno subido; el elemento tiene exactamente las 7 claves
        ordenadas; **primero** `expect(item.downloadUrl).toMatch(/^https?:\/\//)`
        (sin esto, con el stub, `new URL('')` lanza `TypeError`); luego
        `url.searchParams.get('X-Amz-Expires') === '3600'`,
        `url.searchParams.has('X-Amz-Signature') === true` y
        `url.pathname.endsWith(\`/${item.key}\`)`;
      - `describe('#157 R8: flujo POST → PUT → confirm → GET → descarga contra LocalStack', ...)`
        con `it.each(['application/pdf', 'image/jpeg'])('#157 R8: %s se sube, se confirma y se descarga con sus bytes y su content-type', ...)`:
        POST del owner; `fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': type }, body: bytes })`
        2xx; GET `toEqual([])`; confirm 204; GET con un elemento;
        **primero** `expect(item.downloadUrl).toMatch(/^https?:\/\//)`;
        luego `fetch(item.downloadUrl)` sin `Authorization` →
        `status === 200`, `Buffer.from(await res.arrayBuffer())` igual a
        `bytes` y `res.headers.get('content-type') === type`.
      Rojo: unit `#157 R4` (sin llamadas, `''`), e2e `#157 R4` y `#157 R8`
      en el `toMatch`. E3 y E4 nacen verdes con el stub, declarado.
- [ ] (2) Implementación mínima (commit 11) — `execute` firma cada
      documento con
      `this.storage.createDownloadUrl(document.key, DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS)`
      (`Promise.all`, conservando el orden).
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R9 — regresión y contención (requisito de verificación, sin test propio)

- [ ] (1) Sin test: los cuatro comandos de R9, **sin pipe**, cada uno con
      su exit code anotado en `progress/impl_media-docs-download-api.md`
      §Verificación R9: `pnpm -C backend-pet-tracker run lint`,
      `pnpm -C backend-pet-tracker test`,
      `pnpm -C backend-pet-tracker run test:e2e`, `./init.sh`.
- [ ] (2) Los cuatro greps de [[requirements]] R9 con su salida literal
      (`0`, `20`, `1`, `2`) y la allowlist del diff contra el hash del
      handoff (vacía). Si `lint --fix` reescribe algún fichero fuera de la
      lista cerrada de [[design]] §Archivos afectados, **revertirlo** y
      anotarlo.
- [ ] (3) Commit 12 con el reporte y la trazabilidad completa.
