---
feature: "media-docs-download-test-locks"
status: approved  # draft | approved
tags: [harness, spec, backend, media, tests]
---

# Requisitos — [[media-docs-download-test-locks]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D5) y `docs/architecture.md`. Feature #162,
> P3, deuda de #157 (`media-docs-download-api`): observaciones 1, 3, 4 y 5
> de `progress/review_media-docs-download-api.md`. **Solo añade candados de
> test**: el diff neto en código de producción es cero. 100% backend
> (`backend-pet-tracker/`): no se toca `mobile-pet-tracker/` ni `infra/`.
>
> **Base congelada y medida una sola vez**: `51ffebd0` (origin/main, merge
> de #161, PR #202). La descripción de #162 en `feature_list.json` se midió
> en `45fc4d46`, antes de #161, y caducó en parte (§Estado de los cuatro
> huecos). Toda ancla es un `grep -cF` (o `grep -rlF … | wc -l`) ejecutado
> desde la raíz del repo, con la salida que dio en esa base. **Ningún número
> de línea es ancla.** Si al arrancar una salida no cuadra, la base se
> movió: parar y avisar al leader antes de tocar nada.
>
> **Prefijo obligatorio `#162 R<n>:`** en todo `describe`/`it` nuevo
> (`docs/conventions.md` §Prefijo de feature): los tres ficheros que toca
> ya acumulan R-ids de #49, #157 y #161.

## Contexto fijo (no reabrir)

Medido en `51ffebd0`:

| Hecho | Ancla | Salida |
|---|---|---|
| El adapter decide el 404 por `$metadata.httpStatusCode` | `grep -cF "?.httpStatusCode === 404" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts` | `1` |
| Línea donde se planta M1 (el cast del `catch`) | `grep -cF '(error as { $metadata?: { httpStatusCode?: number } })?.$metadata' backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts` | `1` |
| El adapter no mira `name` | `grep -cF "'NotFound'" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts` | `0` |
| El único doble de 404 trae `name` y status a la vez (Obs. 3) | `grep -cF "name: 'NotFound'," backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts` | `1` |
| … y es el único 404 del fichero | `grep -cF "httpStatusCode: 404" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts` | `1` |
| El único error relanzado es un 403 sin `name: 'NotFound'` | `grep -cF "httpStatusCode: 403" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts` | `1` |
| La lista se arma con `Promise.all` sobre el orden del repositorio | `grep -cF "return Promise.all(" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts` | `1` |
| El doble de `createDownloadUrl` resuelve en orden de llamada (Obs. 4) | `grep -cF "Promise.resolve(" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts` | `1` |
| Su spec no tiene esperas manuales | `grep -cF "setImmediate" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts` | `0` |
| `markUploaded` filtra por `uploaded_at IS NULL` (Obs. 5, D4 de #157) | `grep -cF ".where(and(eq(petDocuments.id, id), isNull(petDocuments.uploadedAt)));" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts` | `1` |
| `isNull(` solo aparece ahí (M3 debe quitar también el import) | `grep -cF "isNull(" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts` | `1` |
| Import del repositorio que toca M3 | `grep -cF "import { and, desc, eq, isNotNull, isNull, sql } from 'drizzle-orm';" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts` | `1` |
| `and(` sigue usado tras M3 (3 → 2) | `grep -cF "and(" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts` | `3` |
| El use case no llama a `markUploaded` sobre un confirmado | `grep -cF "if (document.uploadedAt !== null) return;" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts` | `1` |
| P16 ya está candada por #161 R3 | `grep -cF "expect(mapPetDocumentError(missing)).toBe(missing);" backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts` | `1` |
| El e2e aserta el cuerpo exacto de `PET_DOCUMENT_NOT_FOUND` (R6 (a), (b), (c) de #157) | `grep -cF "code: 'PET_DOCUMENT_NOT_FOUND'," backend-pet-tracker/test/media-docs.e2e-spec.ts` | `3` |
| … y el de `PET_DOCUMENT_NOT_UPLOADED` (R6 (d) de #157) | `grep -cF "code: 'PET_DOCUMENT_NOT_UPLOADED'," backend-pet-tracker/test/media-docs.e2e-spec.ts` | `1` |
| El e2e de media no usa el repositorio directamente | `grep -cF "PetDocumentDrizzleRepository" backend-pet-tracker/test/media-docs.e2e-spec.ts` | `0` |
| Import tras el que va el nuevo de R3 | `grep -cF "import type { TokenService } from '@/modules/auth/domain/ports/token-service';" backend-pet-tracker/test/media-docs.e2e-spec.ts` | `1` |
| Precedente de repositorio contra Postgres en e2e | `grep -cF "subscriptions = new SubscriptionDrizzleRepository(db);" backend-pet-tracker/test/device-subscriptions.e2e-spec.ts` | `1` |
| Precedente de espera con `setImmediate` y liberación manual | `grep -cF "await new Promise((resolve) => setImmediate(resolve));" backend-pet-tracker/src/workers/poller.service.spec.ts` | `2` |

Anclas con pipe (fuera de la tabla para copiarlas tal cual):

- Nadie en `test/` llama a `markUploaded`:
  `grep -rlF "markUploaded" backend-pet-tracker/test | wc -l` → `0`
  (en `src/`: `grep -rlF "markUploaded" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `4`: puerto, adapter Drizzle, use case y su spec con doble).
- El repositorio de documentos no tiene spec:
  `ls backend-pet-tracker/src/modules/media/infrastructure/repositories/ | wc -l` → `1`.
- Patrones de test de repositorio en el repo:
  `grep -rlF "drizzle.repository" backend-pet-tracker/src --include=*.spec.ts | wc -l` → `5`
  (cuatro unitarios con un doble de `NodePgDatabase` —pets, weight,
  nutrition, user; el de nutrition aserta la cadena
  `update`/`set`/`where` con `jest.fn()`— y `notifier-env.spec.ts`, que
  solo cita la ruta);
  `grep -rlF "drizzle.repository" backend-pet-tracker/test --include=*.e2e-spec.ts | wc -l` → `1`
  (`device-subscriptions.e2e-spec.ts`, que instancia el repositorio contra
  el Postgres del e2e).
- Ningún test importa la constante de expiración:
  `grep -rlF "DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `1`.
- Dobles tipados `PhotoStorage` (memoria `dobles-exhaustivos-de-puertos`;
  esta spec **no** los toca):
  `grep -rlF "getObjectSize: jest.fn()," backend-pet-tracker/src | wc -l` → `2`.
- Ningún test lleva aún el prefijo:
  `grep -rlF "#162" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `0`.

Cuentas base (medidas por el spec_author en `51ffebd0`, sin pipe):

- `FORCE_COLOR=0 pnpm exec jest src/modules/media` (desde
  `backend-pet-tracker/`) → exit 0, `Test Suites: 12 passed, 12 total`,
  `Tests: 46 passed, 46 total`.
- `photo-storage.object-exists.spec.ts` + `list-pet-documents.use-case.spec.ts`
  → `Tests: 8 passed, 8 total` (6 + 2).
- e2e `test/media-docs.e2e-spec.ts` entero → `Tests: 32 passed, 32 total`
  (no re-medido: lo prohíbe el entorno compartido; tomado de
  `progress/impl_media-docs-confirm-size-limit.md` §c4 y de
  `progress/review_media-docs-confirm-size-limit.md`, y verificado que el
  fichero no cambió: `git diff --quiet 2e8319df 51ffebd0 -- backend-pet-tracker/test/media-docs.e2e-spec.ts backend-pet-tracker/src/modules/media` → exit 0).

## Estado de los cuatro huecos en la base

| Hueco (Obs. de #157) | Sonda de #157 | Estado en `51ffebd0` | Requisito |
|---|---|---|---|
| (1) Mapper sin spec, Obs. 1 | P16: el mapper convierte un error desconocido en 404 | **Cerrado por #161 R3**: `pet-document-error.mapper.spec.ts` existe y su it `#161 R3: devuelve el mismo Error sin traducirlo` mató la sonda S3b = P16 en el veredicto de #161. Las ramas `PET_DOCUMENT_NOT_FOUND` y `PET_DOCUMENT_NOT_UPLOADED` no tienen unit, pero el e2e aserta status y cuerpo exacto con `toEqual` (PE3 y PE3b de #157, rojas) y CI corre el e2e (`init.sh`) | Ninguno nuevo; R4 re-planta P16 como control (DA1, Q2) |
| (2) 404 por `name`, Obs. 3 | P10 | Abierto | R1 |
| (3) Orden por índice, Obs. 4 | P4 | Abierto | R2 |
| (4) Carrera de `markUploaded`, Obs. 5 | `WHERE` sin `isNull(uploadedAt)` | Abierto; ninguna cláusula EARS de #157 lo exige | R3 (defecto de DA2; Q1) |

## Requisitos funcionales

### El adapter decide el 404 por status, no por `name` (hueco 2)

- **R1**: WHEN `PhotoStorageS3Adapter.getObjectSize(key)` recibe un fallo
  del `HeadObjectCommand` THE SYSTEM SHALL decidir la rama solo por
  `$metadata.httpStatusCode`, en las dos direcciones:
  - (a) IF el error trae `$metadata: { httpStatusCode: 404 }` y **no**
    trae `name: 'NotFound'` (su `name` es el `'Error'` heredado) THEN THE
    SYSTEM SHALL resolver `null`;
  - (b) IF el error trae `name: 'NotFound'` y
    `$metadata: { httpStatusCode: 403 }` THEN THE SYSTEM SHALL rechazar con
    ese mismo objeto (`rejects.toBe`).
  *Tests: `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`
  → `describe('#162 R1: getObjectSize decide el 404 por httpStatusCode, no por name', ...)`
  con `it('#162 R1 (a): resuelve null con un 404 sin name NotFound', ...)` e
  `it('#162 R1 (b): relanza un error con name NotFound y httpStatusCode 403', ...)`.*

### La lista conserva el orden del repositorio (hueco 3)

- **R2**: WHILE la URL de lectura del segundo documento que devuelve
  `listUploadedByPet` resuelve **antes** que la del primero, WHEN
  `ListPetDocumentsUseCase.execute(petId)` termina THE SYSTEM SHALL
  devolver `[{ document: a, downloadUrl: 'signed:' + a.key }, { document: b, downloadUrl: 'signed:' + b.key }]`
  en el orden del repositorio (`a`, `b`), cada documento con su propia URL.
  La sincronización del test es la de [[tasks]] §R2 (liberación manual de
  cada promesa + `setImmediate`), sin timers falsos.
  *Test: `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts`
  → `describe('#162 R2: ListPetDocumentsUseCase conserva el orden del repositorio aunque las URLs resuelvan al revés', ...)`
  con `it('#162 R2: la URL del segundo documento resuelve antes que la del primero y la lista sigue a, b', ...)`.*

### `markUploaded` no pisa un documento ya confirmado (hueco 4)

- **R3**: IF `PetDocumentDrizzleRepository.markUploaded(id)` se ejecuta
  contra Postgres sobre una fila de `pet_documents` cuyo `uploaded_at` es
  `2026-10-01T10:00:00.000Z` THEN THE SYSTEM SHALL dejar `uploaded_at` en
  exactamente `2026-10-01T10:00:00.000Z` (el primer confirm gana; D4 de
  #157). El test llama al repositorio directamente, no por HTTP: por HTTP
  el `return` temprano del use case nunca llega a `markUploaded`.
  *Test: `test/media-docs.e2e-spec.ts`
  → `describe('#162 R3: markUploaded no pisa uploaded_at de un documento ya confirmado', ...)`
  con `it('#162 R3: con uploaded_at 2026-10-01T10:00:00.000Z, markUploaded deja la fila igual', ...)`.*

### Regresión y contención

- **R4**: WHEN se ejecutan, **sin pipe** (memoria `exit-code-tras-pipe`),
  `pnpm -C backend-pet-tracker run lint`, `pnpm -C backend-pet-tracker test`,
  el e2e `test/media-docs.e2e-spec.ts` entero y `./init.sh` THE SYSTEM
  SHALL salir con exit 0 en los cuatro (`./init.sh` lo corre el leader);
  AND §Tests existentes que cambian SHALL cumplirse tal cual; AND, contra el
  commit de handoff (`<hash-handoff>`):
  - `git diff --name-only <hash-handoff> HEAD -- backend-pet-tracker` SHALL
    listar **exactamente** estas 3 rutas (el diff neto de producción es
    cero: cada mutación M1–M3 se revierte en su commit verde):
    `backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts`,
    `backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`,
    `backend-pet-tracker/test/media-docs.e2e-spec.ts`;
  - `git diff --name-only <hash-handoff> HEAD -- infra mobile-pet-tracker`
    SHALL salir vacío;
  AND tras el cambio SHALL cumplirse, desde la raíz del repo:
  - `grep -rlF "#162 R" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `3`;
  - `grep -cF "#162 R1 (" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts` → `2`;
  - `grep -cF "name: 'NotFound'," backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts` → `2`;
  - `grep -cF "#162 R2:" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts` → `2`;
  - `grep -cF "Promise.resolve(" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts` → `1` (el doble de #157 R4 no cambia);
  - `grep -rlF "DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS" backend-pet-tracker/src backend-pet-tracker/test | wc -l` → `1` (los tests nuevos asertan `3600`, no la constante);
  - `grep -cF "#162 R3:" backend-pet-tracker/test/media-docs.e2e-spec.ts` → `2`;
  - `grep -cF "PetDocumentDrizzleRepository" backend-pet-tracker/test/media-docs.e2e-spec.ts` → `2` (import + instancia);
  - `grep -rlF "getObjectSize: jest.fn()," backend-pet-tracker/src | wc -l` → `2` (ningún doble tipado cambia).
  *Verificación: el implementer anota salidas y exit codes en
  `progress/impl_media-docs-download-test-locks.md`; el reviewer los
  re-ejecuta y re-planta P16 (sonda de control de [[tasks]]).*

## Requisitos de verificación (CHECKPOINTS C4)

Los tres requisitos funcionales son **candados sobre código ya correcto**:
sus tests pasan en verde nada más escribirse. Por eso cada uno tiene su
rojo en una **mutación de producción versionada** en el commit rojo y
revertida en el commit verde (M1, M2 y M3 de [[tasks]]), nunca en una
mutación de un doble. Cada mutación es la sonda superviviente de #157,
plantada en su zona ciega. Rojo esperado, siempre **por aserción**:

- **R1** — vía M1 (= P10: decidir por `name === 'NotFound'`). Rojos:
  `#162 R1 (a)` con `Received promise rejected instead of resolved` y
  `#162 R1 (b)` con `Received promise resolved instead of rejected`. Los
  seis its existentes del fichero siguen verdes con M1 (el 404 existente
  trae `name: 'NotFound'`; el 403 y el `ContentLength` ausente traen
  `name` `'Error'`). Vía (b) adicional del reviewer: S1b y S1c.
- **R2** — vía M2 (= P4: `push` al resolver). Rojo: `#162 R2` con el diff
  de `toEqual` (Expected `a, b`, Received `b, a`). `#157 R3` y `#157 R4`
  siguen verdes con M2 (su doble resuelve en orden de llamada: es la zona
  ciega). Vía (b) adicional: S2b, que mata `#157 R4` y no `#162 R2`
  (los dos candados se complementan).
- **R3** — vía M3 (= el `WHERE` sin `isNull(uploadedAt)`). Rojo: e2e
  `#162 R3` con el diff de `toEqual` de la fecha (Received = la hora de la
  corrida). Ningún otro e2e del fichero cambia con M3. M3 solo escribe la
  fila del propio test (`WHERE id = $1`), así que es segura sobre el
  Postgres compartido.
- **R4** — verificación de suites y greps, sin test propio. Incluye el
  control de P16 (vía (b), sin test nuevo): el reviewer planta
  `return error;` → `return new NotFoundException();` en
  `pet-document-error.mapper.ts` y `#161 R3: devuelve el mismo Error sin traducirlo`
  sale rojo por aserción.

## Tests existentes que cambian

Lista **cerrada**: cualquier otra modificación de un test existente es
rechazo. Ningún `it`, `describe`, helper ni doble existente cambia (DA3):
los candados se **añaden** al final de cada fichero. Rutas relativas a
`backend-pet-tracker/`.

| # | Fichero | Qué cambia (y nada más) | Por qué |
|---|---|---|---|
| E1 | `test/media-docs.e2e-spec.ts` | Una línea de import **nueva**, inmediatamente después de `import type { TokenService } from '@/modules/auth/domain/ports/token-service';`: `import { PetDocumentDrizzleRepository } from '@/modules/media/infrastructure/repositories/pet-document.drizzle.repository';`. Ninguna línea existente cambia (`git diff` de las líneas previas al `describe` nuevo: solo esa adición) | R3 |

`photo-storage.object-exists.spec.ts` y `list-pet-documents.use-case.spec.ts`
no necesitan imports nuevos: R1 usa `buildDeps()` y R2 usa `document()`,
`PET_ID` y los tipos ya importados.

## Decisiones abiertas

Cada una ya está aplicada con su opción por defecto. Si el humano la cambia
en el gate, la spec se enmienda antes del handoff.

| # | Decisión | Defecto aplicado | Alternativa principal |
|---|---|---|---|
| DA1 | Ramas `PET_DOCUMENT_NOT_FOUND` y `PET_DOCUMENT_NOT_UPLOADED` del mapper (resto del hueco 1) (Q2) | Sin unit nuevo: duplicaría el e2e, que ya aserta status y cuerpo exacto y mató PE3/PE3b | Un it por rama en `pet-document-error.mapper.spec.ts` |
| DA2 | Hueco 4: candar o descartar (Q1) | Candar con un e2e contra Postgres (R3), llamando al repositorio como hace `device-subscriptions.e2e-spec.ts` | Descartarlo por escrito (borrar R3, M3 y E1); o un unit con cadena de `jest.fn()` (descartado en [[design]] §Alternativas) |
| DA3 | Dobles existentes (la descripción permitía cambiar el 404 de object-exists y el de list) | No se tocan: los its nuevos se añaden y los de #157 quedan como están | Quitar `name` del 404 existente y cambiar el `Promise.resolve` de #157 R4 |
| DA4 | Sincronización de R2 | Liberación manual de cada promesa + `await new Promise((resolve) => setImmediate(resolve))` (precedente `poller.service.spec.ts`) | Timers falsos con `setTimeout` en el doble |
| DA5 | Dirección contraria del hueco 2 (`name: 'NotFound'` con 403) | Incluida, R1 (b) (memoria `clausulas-universales-candadas-en-un-caso`) | Solo R1 (a), como pedía la Obs. 3 |

## Preguntas al humano

- **Q1 — hueco 4: ¿candar `markUploaded` o descartarlo?** Recomendación:
  candarlo (defecto). Cuesta un e2e de un it en un fichero que CI ya corre
  dentro de `init.sh`, la mutación roja solo toca la fila del propio test y
  protege D4 de #157 (el primer confirm gana) frente a un refactor del
  `WHERE`. Solo importa con dos confirms concurrentes del mismo documento:
  si se descarta, el efecto de perderlo es que `uploaded_at` se mueve unos
  milisegundos, sin pérdida de datos.
- **Q2 — ¿unit para las ramas NOT_FOUND y NOT_UPLOADED del mapper?**
  Recomendación: no (defecto). El e2e ya aserta el cuerpo entero con
  `toEqual` y CI lo corre; un unit solo duplicaría el candado.
- **Q3 — ¿registrar como deuda el `eq(petDocuments.id, id)` de
  `markUploaded`?** (ver §Fuera de alcance). Recomendación: no. Ningún test
  lo mira, pero quitarlo es un error grosero que rompería la app en el
  primer uso real, y su sonda escribe en todas las filas pendientes del
  Postgres compartido.

## Fuera de alcance

Clasificado viñeta a viñeta (memoria `fuera-de-alcance-no-todo-es-feature`):

- *Delimitación*: cualquier cambio de comportamiento en producción. El
  diff neto en `backend-pet-tracker/src` fuera de los dos `*.spec.ts` es
  cero (R4).
- *Deuda heredada, ya cerrada*: P16 (Obs. 1 de #157). Premisa verificada:
  el it de #161 R3 existe (ancla de §Contexto fijo) y mató S3b = P16 en
  `progress/review_media-docs-confirm-size-limit.md`. #162 no añade test;
  R4 la re-planta como control.
- *Delimitación*: unit de las ramas NOT_FOUND y NOT_UPLOADED del mapper
  (DA1, Q2). Premisa verificada: el e2e aserta `code` y cuerpo exacto
  (anclas `3` y `1` de §Contexto fijo).
- *Deuda posible, no registrada*: el `eq(petDocuments.id, id)` de
  `markUploaded` no tiene candado (los e2e de confirm siembran un solo
  documento por mascota). No se planta como sonda: sin ese filtro el
  `UPDATE` marca todas las filas pendientes del Postgres compartido con
  otros worktrees (Q3).
- *Delimitación*: concurrencia real de dos confirms (dos peticiones HTTP
  simultáneas). R3 prueba el contrato del repositorio, que es lo que la
  hace segura; una prueba de carrera por HTTP no sería determinista.
- *Delimitación*: el 403 por objeto ausente en modo `aws` sin
  `s3:ListBucket` (comentario `ponytail:` del adapter, #160 `pending`).
  R1 (b) y el it `#157 R7: relanza … 403` candan el comportamiento actual
  (un 403 se relanza). Si #160 decide tratar ese 403 como ausente, debe
  enmendar los dos.
- *Delimitación*: Obs. 2, 6 y 7 del veredicto de #157 (texto de D7,
  `git diff --stat` en allowlists y frontmatter de trazabilidad). Son de
  documentación o proceso; la descripción de #162 solo trae 1, 3, 4 y 5.
- *Delimitación*: `mobile-pet-tracker/`, `infra/` y cualquier prueba
  contra AWS real. Todo corre en unitarios y contra LocalStack/Postgres.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-09) ← gate obligatorio antes de implementar
- Respuestas a Q1–Q3 (frase literal del humano, escrita en la página de Notion): «Vamos a seguir la recomendaciones». Q1: se canda `markUploaded` (R3 se queda); Q2: sin unit para las ramas NOT_FOUND y NOT_UPLOADED del mapper; Q3: no se registra deuda por el `eq(petDocuments.id, id)`. DA1–DA5 quedan con su opción por defecto.
