---
feature: "media-docs-download-test-locks"
status: draft        # draft | approved
tags: [harness, spec, backend, media, tests]
---

# Tareas — [[media-docs-download-test-locks]]

> Disciplina TDD de `CHECKPOINTS.md` C4 para candados sobre código ya
> correcto: por requisito, **un commit rojo (tests + mutación de producción
> versionada) y luego un commit verde (solo revierte la mutación)**. Nada de
> tests nuevos en el commit verde. Rutas relativas a `backend-pet-tracker/`
> salvo que se diga otra cosa. Base congelada `51ffebd0`.

## Reglas para todo el trabajo

- Prefijo `#162 R<n>:` en todo `describe`/`it` nuevo; los títulos son los
  de [[requirements]], literales.
- Los tests asertan **literales** (`3600`, `` `signed:${a.key}` ``,
  `2026-10-01T10:00:00.000Z`). Ninguno importa
  `DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS` (R4 lo comprueba con grep).
- Si un test usa `expect.any(X)` como valor de una propiedad, se escribe
  `expect.any(X) as unknown` (eslint `no-unsafe-assignment`). Esta spec no
  lo necesita.
- **Ningún test existente cambia** salvo E1 de [[requirements]] (una línea
  de import nueva). Los `describe` nuevos van al final de cada fichero
  (en el e2e, dentro del `describe('Pet documents API (e2e)', ...)` raíz,
  después del último `describe` hijo).
- En cada commit, antes de `git add`: `pnpm exec prettier --write <ficheros del commit>`
  y `pnpm exec eslint <ficheros del commit>` → exit 0 (memoria
  `prettier-en-cadenas-de-handoff`). Commits con `git add` de las rutas
  exactas de la tarea; nunca `git add -A` ni `git add .`.
- Comandos, siempre desde `backend-pet-tracker/` y **sin pipe** (redirigir
  a fichero, `echo "exit=$?"` y luego `grep` del fichero):
  - unit del módulo: `FORCE_COLOR=0 pnpm exec jest src/modules/media`;
  - e2e de este fichero: `FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/media-docs.e2e-spec.ts`
    (entero) o con `-t '#162 R3'` (filtrado). **Nunca**
    `pnpm run test:e2e -- …`: el `--` llega a jest y corre las 33 suites
    (memoria `pnpm-doble-guion-jest-patrones`).
- Postgres y LocalStack se comparten con otros worktrees. Antes de **cada**
  e2e: permiso del leader, `.env` presente en el worktree (memoria
  `worktree-nuevo-sin-env`) y, en una llamada propia,
  `test -z "$(pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep)" && echo libre`
  → `libre`.
- «Rojo por aserción» = la salida no contiene `Test suite failed to run`,
  `TypeError` ni `ReferenceError`, y cada it rojo falla en su `expect`.

## T0 — Arranque

- [ ] `git branch --show-current` → `feature/162-media-docs-download-test-locks`.
- [ ] Ejecutar las anclas de [[requirements]] §Contexto fijo (tabla y
      lista con pipe) y comparar cada salida. Si alguna no cuadra,
      **parar** y avisar al leader.
- [ ] Unit del módulo → exit 0, `Tests: 46 passed, 46 total`. Anotarlo en
      el impl como base.

## Cuentas encadenadas

Total del rojo = total de su verde; cierre = base + its nuevos (2 + 1 en
unit, 1 en e2e). «e2e» = `test/media-docs.e2e-spec.ts` entero.

| Commit | Suite | Total anterior | its añadidos | Total | failed | passed |
|---|---|---|---|---|---|---|
| base `51ffebd0` | unit media | — | — | 46 | 0 | 46 |
| base `51ffebd0` | e2e | — | — | 32 | 0 | 32 |
| c1 rojo R1 | unit media | 46 | +2 | 48 | 2 | 46 |
| c2 verde R1 | unit media | 48 | 0 | 48 | 0 | 48 |
| c3 rojo R2 | unit media | 48 | +1 | 49 | 1 | 48 |
| c4 verde R2 | unit media | 49 | 0 | 49 | 0 | 49 |
| c5 rojo R3 | unit media | 49 | 0 | 49 | 0 | 49 |
| c5 rojo R3 | e2e | 32 | +1 | 33 | 1 | 32 |
| c6 verde R3 | unit media | 49 | 0 | 49 | 0 | 49 |
| c6 verde R3 | e2e | 33 | 0 | 33 | 0 | 33 |
| cierre | unit backend (`pnpm -C backend-pet-tracker test`) | 1471 | +3 | 1474 | 0 | 1474 |

El e2e filtrado con `-t '#162 R3'` da `Tests: 1 failed, 32 skipped, 33 total`
en c5 y `Tests: 1 passed, 32 skipped, 33 total` en c6. La base de 1471 es
la del veredicto de #161 (`backend-pet-tracker/` idéntico entre `2e8319df`
y `51ffebd0`).

## R1 — El adapter decide el 404 por status, no por `name`

- [ ] (1) **Rojo** — commit `test(media): red getObjectSize decides 404 by status (#162 R1)`:
  - `src/modules/media/infrastructure/photo-storage.object-exists.spec.ts`:
    al final, `describe('#162 R1: getObjectSize decide el 404 por httpStatusCode, no por name', ...)`
    con dos its que usan `buildDeps()` y la key `'pets/p/docs/d'`:
    - `#162 R1 (a): resuelve null con un 404 sin name NotFound`:
      `send.mockRejectedValue(Object.assign(new Error('Not Found'), { $metadata: { httpStatusCode: 404 } }))`
      (sin propiedad `name`) → `resolves.toBeNull()`.
    - `#162 R1 (b): relanza un error con name NotFound y httpStatusCode 403`:
      `const notFoundByName = Object.assign(new Error('NotFound'), { name: 'NotFound', $metadata: { httpStatusCode: 403 } });`
      `send.mockRejectedValue(notFoundByName)` → `rejects.toBe(notFoundByName)`.
  - **Mutación M1** (= P10) en `src/modules/media/infrastructure/photo-storage.s3.adapter.ts`:
    en el `catch` de `getObjectSize`, la condición del `if`
    `(error as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode === 404`
    pasa a `(error as { name?: string })?.name === 'NotFound'`. El
    comentario `ponytail:` y el resto del método no cambian. Tras
    prettier: `grep -cF "?.httpStatusCode === 404" src/modules/media/infrastructure/photo-storage.s3.adapter.ts`
    → `0` y `grep -cF "(error as { name?: string })?.name === 'NotFound'" src/modules/media/infrastructure/photo-storage.s3.adapter.ts`
    → `1`.
  - Rojo esperado: unit del módulo → exit 1,
    `Tests: 2 failed, 46 passed, 48 total`. Los dos rojos son exactamente
    `#162 R1 (a)` (`Received promise rejected instead of resolved`) y
    `#162 R1 (b)` (`Received promise resolved instead of rejected`), por
    aserción. Los seis its de `#157 R7` y `#161 R1` siguen verdes.
- [ ] (2) **Verde** — commit `feat(media): revert M1, 404 stays decided by status (#162 R1)`
      que solo revierte M1:
      `git diff <commit anterior a c1> HEAD -- src/modules/media/infrastructure/photo-storage.s3.adapter.ts`
      vacío. Unit del módulo → exit 0, `Tests: 48 passed, 48 total`.
- [ ] (3) Refactor: no aplica.

## R2 — La lista conserva el orden del repositorio

- [ ] (1) **Rojo** — commit `test(media): red list keeps repository order on out-of-order URLs (#162 R2)`:
  - `src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts`:
    al final, `describe('#162 R2: ListPetDocumentsUseCase conserva el orden del repositorio aunque las URLs resuelvan al revés', ...)`
    con `it('#162 R2: la URL del segundo documento resuelve antes que la del primero y la lista sigue a, b', ...)`.
    Sincronización **exacta**, en este orden (DA4, [[design]] D3):
    1. `a = document('0198b2c3-4d5e-7a01-b234-56789abcde02', '2026-08-25')`,
       `b = document('0198b2c3-4d5e-7a01-b234-56789abcde01', '2026-08-24')`
       (los mismos de `#157 R4`),
       `listUploadedByPet = jest.fn().mockResolvedValue([a, b])` y
       `const documents = { listUploadedByPet } as unknown as PetDocumentRepository;`.
    2. `let releaseA: (url: string) => void = () => undefined;` e ídem
       `releaseB` (patrón `releaseGetMessages` de `poller.service.spec.ts`).
    3. `createDownloadUrl = jest.fn<Promise<string>, [string, number]>()`
       con `mockImplementation((key) => new Promise<string>((resolve) => { … }))`
       que guarda `resolve` en `releaseA` si `key === a.key` y en
       `releaseB` en otro caso. El doble **no** resuelve nada por sí solo.
       Luego `const storage = { createDownloadUrl } as unknown as PhotoStorage;`
       (los dos `as unknown as`, como en `#157 R4`; sin imports nuevos).
    4. `const drain = () => new Promise((resolve) => setImmediate(resolve));`
    5. `const pending = new ListPetDocumentsUseCase(documents, storage).execute(PET_ID);`
       **sin** `await`.
    6. `await drain();` y
       `expect(createDownloadUrl.mock.calls).toEqual([[a.key, 3600], [b.key, 3600]]);`
       (las dos llamadas ya ocurrieron; si no, rojo por esta aserción).
    7. `` releaseB(`signed:${b.key}`); `` y `await drain();` (la
       continuación de `b` corre entera antes de liberar `a`).
    8. `` releaseA(`signed:${a.key}`); ``
    9. `` await expect(pending).resolves.toEqual([{ document: a, downloadUrl: `signed:${a.key}` }, { document: b, downloadUrl: `signed:${b.key}` }]); ``
    Sin `jest.useFakeTimers` ni `setTimeout`.
  - **Mutación M2** (= P4) en `src/modules/media/application/use-cases/list-pet-documents.use-case.ts`:
    tras `const documents = await this.documents.listUploadedByPet(petId);`,
    el `return Promise.all(…)` pasa a: `const items: PetDocumentListItem[] = [];`,
    `await Promise.all(documents.map(async (document) => { const downloadUrl = await this.storage.createDownloadUrl(document.key, DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS); items.push({ document, downloadUrl }); }));`
    y `return items;`. Tras prettier:
    `grep -cF "return Promise.all(" src/modules/media/application/use-cases/list-pet-documents.use-case.ts`
    → `0` y `grep -cF "items.push({ document, downloadUrl });" src/modules/media/application/use-cases/list-pet-documents.use-case.ts`
    → `1`.
  - Rojo esperado: unit del módulo → exit 1,
    `Tests: 1 failed, 48 passed, 49 total`. El rojo es exactamente
    `#162 R2`, en el `toEqual` del paso 9 (Received con `b` primero), por
    aserción. `#157 R3` y `#157 R4` siguen verdes.
- [ ] (2) **Verde** — commit `feat(media): revert M2, list keeps index order (#162 R2)`
      que solo revierte M2 (`git diff <commit anterior a c3> HEAD -- src/modules/media/application/use-cases/list-pet-documents.use-case.ts`
      vacío). Unit del módulo → exit 0, `Tests: 49 passed, 49 total`.
- [ ] (3) Refactor: no aplica.

## R3 — `markUploaded` no pisa un documento ya confirmado (defecto de DA2)

Si el humano descarta el hueco 4 en Q1, esta sección, E1 y las filas c5/c6
de §Cuentas encadenadas se borran en una enmienda antes del handoff.

- [ ] (1) **Rojo** — commit `test(media): red markUploaded keeps confirmed uploaded_at (#162 R3)`:
  - `test/media-docs.e2e-spec.ts`: el import de E1 y, al final del
    `describe` raíz, `describe('#162 R3: markUploaded no pisa uploaded_at de un documento ya confirmado', ...)`
    con `it('#162 R3: con uploaded_at 2026-10-01T10:00:00.000Z, markUploaded deja la fila igual', ...)`:
    1. `const owner = await seedUser('162-r3-owner');` y
       `const pet = await seedPet(owner);`
    2. `const document = await seedDocument(pet.id, owner.id, { date: '2026-10-01', uploadedAt: new Date('2026-10-01T10:00:00.000Z') });`
    3. `await new PetDocumentDrizzleRepository(db).markUploaded(document.id);`
    4. `const [stored] = await db.select().from(petDocuments).where(eq(petDocuments.id, document.id));`
    5. `expect(stored.uploadedAt).toEqual(new Date('2026-10-01T10:00:00.000Z'));`
  - **Mutación M3** en `src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts`
    (dos cambios, para que lint siga en verde):
    `.where(and(eq(petDocuments.id, id), isNull(petDocuments.uploadedAt)));`
    → `.where(eq(petDocuments.id, id));` y
    `import { and, desc, eq, isNotNull, isNull, sql } from 'drizzle-orm';`
    → `import { and, desc, eq, isNotNull, sql } from 'drizzle-orm';`.
    Tras prettier: `grep -cF "isNull(" src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts`
    → `0`, `grep -cF "and(" src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts` → `2` y
    `grep -cF ".where(eq(petDocuments.id, id));" src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts` → `1`.
    M3 solo escribe la fila cuyo `id` pasa el test.
  - Rojo esperado: unit del módulo → exit 0, `Tests: 49 passed, 49 total`
    (ningún unit usa el repositorio). e2e entero → exit 1,
    `Tests: 1 failed, 32 passed, 33 total`; el rojo es exactamente
    `#162 R3`, en el `toEqual` del paso 5 (Received = la hora de la
    corrida), por aserción.
- [ ] (2) **Verde** — commit `feat(media): revert M3, markUploaded keeps the first confirm (#162 R3)`
      que solo revierte M3 (`git diff <commit anterior a c5> HEAD -- src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts`
      vacío). e2e entero → exit 0, `Tests: 33 passed, 33 total`.
- [ ] (3) Refactor: no aplica.

## R4 — Regresión y contención (requisito de verificación)

- [ ] (1) Ejecutar sin pipe `pnpm -C backend-pet-tracker run lint` y
      `pnpm -C backend-pet-tracker test` (→ `Tests: 1474 passed, 1474 total`);
      el e2e entero de `media-docs` ya corrió en c6. `./init.sh` lo corre el
      leader en el gate (memoria `init-sh-reviewer-denegado`).
- [ ] (2) Ejecutar los greps de R4 y los dos `git diff --name-only` contra
      `<hash-handoff>` (3 rutas exactas; `infra mobile-pet-tracker` vacío);
      anotar salidas.
- [ ] (3) Rellenar `specs/media-docs-download-test-locks/traceability.md`
      con los hashes y escribir `progress/impl_media-docs-download-test-locks.md`;
      commit `docs(media-docs-download-test-locks): traceability (#162)`.

## Sondas de mutación (para el reviewer)

Cada sonda se aplica sola sobre el HEAD verde, se corre el test indicado y
se revierte con `git checkout HEAD -- <ruta>` (luego `git diff --quiet &&
git diff --cached --quiet`). "Muere" = el test indicado sale rojo **por su
aserción**. Las e2e, con `pgrep` → `libre` antes de cada una.

| Sonda | Mutación | Debe matarla | No la mata |
|---|---|---|---|
| S1a | = M1 (P10): decide por `name === 'NotFound'` | `#162 R1 (a)` y `#162 R1 (b)` | — |
| S1b | `name === 'NotFound' \|\| httpStatusCode === 404` | `#162 R1 (b)` | `#162 R1 (a)`, `#157 R7` |
| S1c | `name === 'NotFound' && httpStatusCode === 404` | `#162 R1 (a)` | `#162 R1 (b)`, `#157 R7` |
| S2a | = M2 (P4): `push` al resolver | `#162 R2` | `#157 R4` |
| S2b | M2 con `items.unshift(…)` en vez de `push` | `#157 R4` | `#162 R2` (los dos candados se complementan) |
| S3a | = M3: `WHERE` sin `isNull(uploadedAt)` | e2e `#162 R3` | el resto del e2e |
| P16 (control) | mapper: `return error;` → `return new NotFoundException();` | `#161 R3: devuelve el mismo Error sin traducirlo` | — |

**Prohibida**: quitar `eq(petDocuments.id, id)` de `markUploaded`. Sin ese
filtro el `UPDATE` marca todas las filas pendientes del Postgres
compartido con otros worktrees ([[requirements]] §Fuera de alcance, Q3).
