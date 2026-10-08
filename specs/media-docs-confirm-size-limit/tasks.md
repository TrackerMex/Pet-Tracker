---
feature: "media-docs-confirm-size-limit"
status: draft        # draft | approved
tags: [harness, spec, backend, media]
---

# Tareas — [[media-docs-confirm-size-limit]]

> Disciplina TDD de `CHECKPOINTS.md` C4: por requisito, **un commit rojo
> (solo tests, o tests + mutación de producción cuando C4 lo pide) y luego
> un commit verde (solo producción)**. Nada de implementación y tests en el
> mismo commit (lo incumplió #19). Rutas relativas a `backend-pet-tracker/`
> salvo que se diga otra cosa. Base congelada `58323e49`.

## Reglas para todo el trabajo

- Prefijo `#161 R<n>:` en todo `describe`/`it` nuevo.
- Los tests asertan **literales** (`10485760`, `10485761`, `0`, códigos y
  mensajes de [[requirements]]). Ningún test importa
  `PET_DOCUMENT_MAX_BYTES` (R4 lo comprueba con grep).
- Si un test usa `expect.any(X)` como valor de una propiedad, se escribe
  `expect.any(X) as unknown` (eslint `no-unsafe-assignment`).
- Commits con `git add` de las rutas exactas de la tarea; nunca `git add -A`
  ni `git add .`.
- Unitarios del módulo: `pnpm -C backend-pet-tracker exec jest src/modules/media`.
  e2e de este fichero: `pnpm -C backend-pet-tracker exec jest --config ./test/jest-e2e.json test/media-docs.e2e-spec.ts`.
  Postgres (`pet_tracker`, puerto 5433) y LocalStack (4566) se comparten
  con otros worktrees: antes de lanzar un e2e, confirmar con el leader que
  nadie está corriendo `./init.sh` y que este worktree tiene `.env`
  (memoria `worktree-nuevo-sin-env`).
- Exit codes medidos **sin pipe**.

## T0 — Arranque

- [ ] `git branch --show-current` → `feature/161-media-docs-confirm-size-limit`.
- [ ] Ejecutar las anclas de [[requirements]] §Contexto fijo (tabla, lista
      con pipe e inventario de 7 rutas) y comparar cada salida. Si alguna no
      cuadra, **parar** y avisar al leader.

## R1 — `getObjectSize` sustituye a `objectExists`

- [ ] (1) **Rojo** — commit `test(media): red getObjectSize replaces objectExists (#161 R1)`
      con solo estos cuatro ficheros de test:
  - `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`:
    aplicar E1 tal cual y añadir
    `describe('#161 R1: getObjectSize devuelve ContentLength o falla sin él', ...)`
    con tres its que reutilizan su `buildDeps()`:
    - `#161 R1 (a): resuelve el ContentLength tal cual, sin límite (10485761)`:
      `send.mockResolvedValue({ ContentLength: 10485761 })` → resuelve `10485761`;
    - `#161 R1 (a): resuelve 0 cuando el objeto está vacío`:
      `send.mockResolvedValue({ ContentLength: 0 })` → resuelve `0`;
    - `#161 R1 (b): rechaza si el HEAD responde sin ContentLength`:
      `send.mockResolvedValue({})` → `rejects.toThrow(/^HeadObject response has no ContentLength$/)`
      (regex anclada: `toThrow` con string solo comprueba que contiene).
  - `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts`: E2 tal cual.
  - `src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts`: E3.
  - `src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts`: E4.
  Rojo esperado: ts-jest no compila porque `getObjectSize` no existe en
  `PhotoStorage` ni en `PhotoStorageS3Adapter` (falta un símbolo de
  producción, no un helper de test). Anotar la salida en el impl.
- [ ] (2) **Verde** — commit `feat(media): getObjectSize reads ContentLength from HEAD (#161 R1)`
      con solo producción:
  - `src/modules/media/domain/ports/photo-storage.ts`: la línea del método
    según R1.
  - `src/modules/media/infrastructure/photo-storage.s3.adapter.ts`:
    `objectExists` → `getObjectSize` según R1 (a)–(d), conservando el
    comentario `ponytail:` del 403.
  - `src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts`:
    `objectExists` → `getObjectSize`; `null` lanza
    `PetDocumentNotUploadedError` como hoy. **Todavía sin límite.**
  `pnpm -C backend-pet-tracker exec jest src/modules/media` → exit 0.
- [ ] (3) Refactor con tests verdes (si no hace falta, decirlo en el impl).

## R2 — Límite de 10485760 bytes en el confirm

- [ ] (1) **Rojo** — commit `test(media): red 10485760-byte limit on confirm (#161 R2)`
      con solo estos tres ficheros de test:
  - `confirm-pet-document-upload.use-case.spec.ts`: nuevo
    `describe('#161 R2: ConfirmPetDocumentUploadUseCase aplica el límite de 10485760 bytes', ...)`
    con dos its:
    - `#161 R2 (a): acepta exactamente 10485760 bytes y llama markUploaded(id)`:
      `getObjectSize.mockResolvedValue(10485760)` → resuelve `undefined`,
      `getObjectSize` llamado con `KEY`, `markUploaded` llamado una vez con
      `DOCUMENT_ID`;
    - `#161 R2 (b): rechaza 10485761 bytes con PetDocumentTooLargeError sin markUploaded`:
      `getObjectSize.mockResolvedValue(10485761)`; capturar el rechazo con
      `.catch((error: unknown) => error)` y asertar que es `instanceof Error`
      con `name` `'PetDocumentTooLargeError'` y `message`
      `'Pet document file exceeds the size limit'`; `markUploaded` no
      llamado. **No importar la clase** en este fichero: así el rojo es
      por aserción (hoy la promesa resuelve).
  - `src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts`
    (**nuevo**): `describe('#161 R2: mapPetDocumentError traduce PetDocumentTooLargeError a 409', ...)`
    con un it `#161 R2 (b): devuelve ConflictException 409 con code PET_DOCUMENT_TOO_LARGE`:
    `mapPetDocumentError(new PetDocumentTooLargeError())` es
    `instanceof ConflictException`, `getStatus()` → `409` y
    `getResponse()` `toEqual`
    `{statusCode: 409, code: 'PET_DOCUMENT_TOO_LARGE', message: 'Pet document file exceeds the size limit'}`.
    Este fichero sí importa la clase: su rojo es de compilación por un
    símbolo de producción que aún no existe.
  - `test/media-docs.e2e-spec.ts`: E5 (import) y nuevo
    `describe('#161 R2: confirm contra LocalStack en la frontera de 10485760 bytes', ...)`
    con dos its, cada uno con timeout `30000` como tercer argumento de `it`
    y con su propio `seedUser('161-r2-a-owner')` / `seedUser('161-r2-b-owner')`
    + `seedPet` + `createDocument` (body
    `{type: 'Consulta', name: 'Control', date: '2026-10-08'}`, 201):
    - `#161 R2 (a): un fichero de 10485760 bytes se confirma y aparece en GET`:
      `fetch(uploadUrl, {method: 'PUT', body: Buffer.alloc(10485760, 0x61)})`
      sin `Authorization` → 2xx; `s3.send(new HeadObjectCommand({Bucket: resourceNames.mediaBucket, Key: <document.key>}))`
      → `ContentLength` `10485760`; `confirmDocument` → 204 con cuerpo
      `''`; la fila tiene `uploadedAt` `instanceof Date`; el GET del
      owner lista exactamente `[<document.id>]` por id.
    - `#161 R2 (b): un fichero de 10485761 bytes responde 409 PET_DOCUMENT_TOO_LARGE y no se borra`:
      mismo PUT con `Buffer.alloc(10485761, 0x61)`; HEAD →
      `ContentLength` `10485761`; `confirmDocument` → 409 con cuerpo
      `toEqual`
      `{statusCode: 409, code: 'PET_DOCUMENT_TOO_LARGE', message: 'Pet document file exceeds the size limit'}`;
      el GET del owner → `[]`; la fila tiene `uploadedAt` `null`; un
      segundo HEAD tras el 409 → `ContentLength` `10485761`.
  Rojo esperado: unit (b) por aserción, mapper spec por compilación, e2e
  (b) por aserción (204 en vez de 409). Unit (a) y e2e (a) pasan ya: son
  ramas frontera (ver [[requirements]] §Requisitos de verificación).
- [ ] (2) **Verde** — commit `feat(media): reject documents over 10485760 bytes on confirm (#161 R2)`
      con solo producción:
  - `src/modules/media/domain/errors/pet-document.errors.ts`:
    `PetDocumentTooLargeError` según [[design]] §Archivos afectados.
  - `confirm-pet-document-upload.use-case.ts`: `PET_DOCUMENT_MAX_BYTES` y
    la comprobación `> PET_DOCUMENT_MAX_BYTES` después de la de `null` y
    antes de `markUploaded`.
  - `src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts`:
    rama `PetDocumentTooLargeError` según [[design]].
  Unitarios del módulo → exit 0; e2e del fichero → exit 0 (si el leader
  autoriza el e2e en ese momento; si no, lo cubre el `./init.sh` del gate).
- [ ] (3) Refactor con tests verdes.

## R3 — `ContentLength` ausente falla cerrado (requisito de verificación)

R3 no necesita código nuevo: tras R1 y R2 el use case ya propaga el error
del puerto y el mapper ya devuelve por identidad lo que no conoce. Por eso
su rojo es una **mutación de producción versionada** (C4, quinto punto),
nunca un cambio en un doble.

- [ ] (1) **Rojo** — commit `test(media): red missing ContentLength fails closed (#161 R3)`
      con tests + dos mutaciones de producción:
  - `confirm-pet-document-upload.use-case.spec.ts`: nuevo
    `describe('#161 R3: ContentLength ausente no confirma', ...)` con un it
    `#161 R3: propaga el error de getObjectSize sin markUploaded`:
    `const missing = new Error('HeadObject response has no ContentLength')`;
    `getObjectSize.mockRejectedValue(missing)` → `rejects.toBe(missing)`;
    `markUploaded` no llamado.
  - `pet-document-error.mapper.spec.ts`: nuevo
    `describe('#161 R3: mapPetDocumentError devuelve por identidad un error desconocido', ...)`
    con un it `#161 R3: devuelve el mismo Error sin traducirlo`:
    `mapPetDocumentError(missing)` es `toBe(missing)` (mismo objeto).
  - Mutación M3a en `confirm-pet-document-upload.use-case.ts`: envolver
    la llamada a `getObjectSize` en `try { … } catch { throw new PetDocumentNotUploadedError(); }`.
  - Mutación M3b en `pet-document-error.mapper.ts`: cambiar el
    `return error;` final por `return new NotFoundException();`.
  Rojo esperado, por aserción: los dos its `#161 R3` (y el it existente
  `#157 R6 (g)`, por M3a). Anotar la salida en el impl.
- [ ] (2) **Verde** — commit `feat(media): revert R3 mutations, missing ContentLength fails closed (#161 R3)`
      que solo revierte M3a y M3b (`git diff` del commit verde contra el
      commit anterior al rojo, en esos dos ficheros, vacío). Unitarios del
      módulo → exit 0.
- [ ] (3) Refactor: no aplica.

## R4 — Regresión y contención (requisito de verificación)

- [ ] (1) Ejecutar sin pipe `pnpm -C backend-pet-tracker run lint`,
      `pnpm -C backend-pet-tracker test` y, con permiso del leader,
      `pnpm -C backend-pet-tracker run test:e2e`; anotar exit codes.
      `./init.sh` lo corre el leader en el gate (memoria
      `init-sh-reviewer-denegado`).
- [ ] (2) Ejecutar los ocho greps de R4 y
      `git diff --name-only <hash-handoff>...HEAD -- infra mobile-pet-tracker`
      (vacío); anotar salidas.
- [ ] (3) Rellenar `specs/media-docs-confirm-size-limit/traceability.md`
      con los hashes y escribir `progress/impl_media-docs-confirm-size-limit.md`;
      commit `docs(media-docs-confirm-size-limit): traceability (#161)`.

## Sondas de mutación (para el reviewer)

Cada sonda se aplica sola sobre el HEAD verde, se corre el test indicado y
se revierte. "Muere" = el test indicado sale rojo **por su aserción**.

| Sonda | Mutación | Debe matarla |
|---|---|---|
| S1a | Adapter: `return response.ContentLength ?? 0;` | `#161 R1 (b)` |
| S1b | Adapter: falsy-check (`if (!response.ContentLength) throw …`) | `#161 R1 (a) … 0` |
| S1c | Adapter: devuelve una constante (p. ej. `1`) | `#161 R1 (a) … 10485761` y `#157 R7 … ContentLength` |
| S1d | Adapter: rama 404 devuelve `0` | `#157 R7: resuelve null …` |
| S1e | Adapter: `HeadObjectCommand` sin `Bucket` o con otra `Key` | `#157 R7: resuelve ContentLength …` (aserción del `input`) |
| S2a | Use case: `>=` en vez de `>` | `#161 R2 (a)` unit y e2e |
| S2b | `PET_DOCUMENT_MAX_BYTES = 10 * 1000 * 1000` | `#161 R2 (a)` unit y e2e |
| S2c | `PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024 + 1` | `#161 R2 (b)` unit y e2e |
| S2d | Use case lanza `PetDocumentNotUploadedError` por tamaño | `#161 R2 (b)` unit (`name`/`message`) y e2e (`code`) |
| S2e | Mapper: `code: 'PET_DOCUMENT_NOT_UPLOADED'` en la rama nueva | mapper `#161 R2 (b)` y e2e `#161 R2 (b)` |
| S2f | Use case: `markUploaded` antes de comprobar el tamaño | `#161 R2 (b)` unit (`markUploaded` no llamado) y e2e (`uploadedAt` `null`) |
| S2g | Use case: `getObjectSize` antes del `return` de ya confirmado | `#157 R5: ya confirmado …` (E2) |
| S2h | Adapter o use case borra el objeto (`DeleteObjectCommand`) tras el 409 | e2e `#161 R2 (b)`: rojo **por consulta**, el segundo `s3.send(HeadObjectCommand)` rechaza con 404 antes de su `expect` |
| S3a | = M3a | `#161 R3: propaga …` |
| S3b | = M3b | `#161 R3: devuelve el mismo Error …` |
