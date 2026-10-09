# review: media-docs-download-test-locks (#162)
Fecha: 2026-10-09
HEAD revisado: e780925d (branch feature/162-media-docs-download-test-locks, worktree /home/claude/sites/Pet-Tracker-wt-162)
H0 (HEAD del handoff): 29585178
Veredicto: aprobado

## Checklist C2-C7

| Punto | Estado | Evidencia |
|---|---|---|
| C2 Estado coherente | ok | `feature_list.json`: solo #162 `in_progress`; `progress/current.md` describe la sesión activa de #162 |
| C3 Arquitectura | N/A (ok) | Solo se añaden tests; diff neto de producción 0 (`git diff --quiet 29585178 HEAD -- <adapter\|use case\|repo>` da exit=0 en los tres) |
| C4 TDD | ok | 3 parejas rojo→verde (dc4a2dd7→eb222afd, b0af8ba5→b79e78e4, ac79cf93→e9688050). Cada rojo versiona M1/M2/M3 y falla por aserción (§4). Cada verde solo revierte la mutación. R1-R3 los nombran tests `#162 R<n>`. R4 es un requisito de verificación declarado: ver §6 y la sonda P16 |
| C5 Trazabilidad | ok | Ninguna fila «pendiente». Los 6 hashes son ancestros de HEAD y sus mensajes coinciden con tasks.md (`test(media)`/`feat(media)` + `(#162 R<n>)`) |
| C6 Spec aprobada | ok | requirements.md con `status: approved` y casilla humana marcada. La firma b1eea14a es ancestro de HEAD. `git diff --quiet b1eea14a HEAD -- requirements.md design.md tasks.md` da exit=0 |
| C7 Sin código huérfano | N/A | La feature no reemplaza nada |

Bloqueantes: ninguno.

## Arranque
- `pwd` → /home/claude/sites/Pet-Tracker-wt-162
- `git branch --show-current` → feature/162-media-docs-download-test-locks
- `git rev-parse --short HEAD` → e780925d
- `git status --short` → vacío

## 1. C4 — historial rojo→verde, commit a commit

`git log --oneline 29585178..HEAD` (8 commits = 7 del handoff + lista cerrada):

| Commit | Mensaje | Ficheros (`git show --stat`) | Comprobación |
|---|---|---|---|
| dc4a2dd7 | test(media): red getObjectSize decides 404 by status (#162 R1) | object-exists.spec.ts +26; photo-storage.s3.adapter.ts +1 −4 | tests R1 (a)/(b) + M1 exacta: el `if` pasa a `(error as { name?: string })?.name === 'NotFound'`; comentario `ponytail:` intacto |
| eb222afd | feat(media): revert M1, 404 stays decided by status (#162 R1) | solo photo-storage.s3.adapter.ts | `git diff --quiet 29585178 eb222afd -- <adapter>` → exit=0 |
| b0af8ba5 | test(media): red list keeps repository order on out-of-order URLs (#162 R2) | list-pet-documents.use-case.spec.ts +38; list-pet-documents.use-case.ts +8 −6 | test R2 + M2 exacta (`const items: PetDocumentListItem[] = []`, `await Promise.all(... items.push({ document, downloadUrl }) ...)`, `return items;`) |
| b79e78e4 | feat(media): revert M2, list keeps index order (#162 R2) | solo list-pet-documents.use-case.ts | `git diff --quiet 29585178 b79e78e4 -- <use case>` → exit=0 |
| ac79cf93 | test(media): red markUploaded keeps confirmed uploaded_at (#162 R3) | media-docs.e2e-spec.ts +18; pet-document.drizzle.repository.ts +2 −2 | import E1 + describe R3 + M3 exacta (import sin `isNull`, `.where(eq(petDocuments.id, id))`) |
| e9688050 | feat(media): revert M3, markUploaded keeps the first confirm (#162 R3) | solo pet-document.drizzle.repository.ts | `git diff --quiet 29585178 e9688050 -- <repo>` → exit=0 |
| e2cbec46 | docs(media-docs-download-test-locks): traceability (#162) | impl + traceability.md | — |
| e780925d | docs(media-docs-download-test-locks): closed file list (#162) | solo impl | — |

- Los verdes no añaden tests (cada uno toca solo su fichero de producción).
- `git diff --quiet 29585178 HEAD -- <adapter|use case|repo>` → exit=0 los tres.
- `git diff --name-only 29585178 HEAD -- backend-pet-tracker` → exactamente:
  `.../list-pet-documents.use-case.spec.ts`, `.../photo-storage.object-exists.spec.ts`, `test/media-docs.e2e-spec.ts`.
- `git diff --name-only 29585178 HEAD -- infra mobile-pet-tracker` → vacío.
- Base: `git diff --stat 51ffebd0 29585178 -- backend-pet-tracker init.sh` → vacío (el merge de #155 en 6c4f0d69 no mueve la base congelada).

## 2. Solo líneas añadidas en los 3 ficheros de test

| Fichero | `git diff --numstat 29585178 HEAD` | líneas `-` | hunks |
|---|---|---|---|
| list-pet-documents.use-case.spec.ts | 38 / 0 | 0 | `@@ -66,0 +67,38 @@` (tras el describe #157 R4) |
| photo-storage.object-exists.spec.ts | 26 / 0 | 0 | `@@ -76,0 +77,26 @@` (tras el describe #161 R1) |
| test/media-docs.e2e-spec.ts | 18 / 0 | 0 | `@@ -21,0 +22 @@` (import E1 tras `import type { TokenService }`) y `@@ -932,0 +934,17 @@` (describe R3 al final del describe raíz) |

## 3. Títulos y literales

Títulos (`grep -nE "(describe|it)\('#162"`), idénticos a tasks.md:
- object-exists.spec.ts:78 `#162 R1: getObjectSize decide el 404 por httpStatusCode, no por name`; :79 `#162 R1 (a): resuelve null con un 404 sin name NotFound`; :90 `#162 R1 (b): relanza un error con name NotFound y httpStatusCode 403`
- list-pet-documents.use-case.spec.ts:68 `#162 R2: ListPetDocumentsUseCase conserva el orden del repositorio aunque las URLs resuelvan al revés`; :69 `#162 R2: la URL del segundo documento resuelve antes que la del primero y la lista sigue a, b`
- media-docs.e2e-spec.ts:935 `#162 R3: markUploaded no pisa uploaded_at de un documento ya confirmado`; :936 `#162 R3: con uploaded_at 2026-10-01T10:00:00.000Z, markUploaded deja la fila igual`

Literales: R1 aserta `resolves.toBeNull()` / `rejects.toBe(notFoundByName)` con dobles `httpStatusCode: 404` sin `name` y `name: 'NotFound'` + `httpStatusCode: 403`; R2 aserta `[[a.key, 3600], [b.key, 3600]]` y `` `signed:${a.key}` ``/`` `signed:${b.key}` ``; R3 aserta `new Date('2026-10-01T10:00:00.000Z')`. Ningún import nuevo en los unit; el único import nuevo (e2e) es el sujeto `PetDocumentDrizzleRepository`, no un valor esperado.
`grep -rlF "DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS" backend-pet-tracker/src backend-pet-tracker/test` → solo `list-pet-documents.use-case.ts` (producción).

## 4. Rojos del impl

- c1 (impl §c1 — R1 rojo con M1): exit=1, `Tests: 2 failed, 46 passed, 48 total`; R1 (a) `Received promise rejected instead of resolved` (línea 87), R1 (b) `Received promise resolved instead of rejected` (línea 98). Por aserción.
- c3 (impl §c3): exit=1, `Tests: 1 failed, 48 passed, 49 total`; `expect(received).resolves.toEqual(expected)` con Received `b` (…de01) primero (línea 99). Por aserción.
- c5 (impl §c5 — R3 E2E rojo con M3): unit 49/49 exit=0; e2e exit=1, `Tests: 1 failed, 32 passed, 33 total`; `toEqual` Expected `2026-10-01T10:00:00.000Z` Received `2026-10-09T16:23:56.816Z` (línea 948). Por aserción.
- Verdes: c2 48/48, c4 49/49, c6 unit 49/49 + e2e 33/33, exit=0. Cierre unit `Tests: 1474 passed, 1474 total`.

## 5. Trazabilidad y lista cerrada

- Ninguna fila «pendiente» (`grep -nF pendiente traceability.md` → solo la línea 16, la regla en prosa).
- Los 6 hashes: `git cat-file -e <h>^{commit}` + `git merge-base --is-ancestor <h> HEAD` → ok, y su mensaje casa con la tabla.
- Frontmatter: `git diff 29585178 HEAD -- traceability.md` no toca `---`/`feature`/`status`/`tags`.
- Lista cerrada (comando del leader) → 5 rutas: los 3 tests, `progress/impl_media-docs-download-test-locks.md`, `specs/media-docs-download-test-locks/traceability.md`. `git diff --name-only 29585178 HEAD` total = las mismas 5 (requirements/design/tasks sin cambios).

## 6. R4 — greps re-ejecutados desde la raíz

| # | Comando | Esperado | Medido |
|---|---|---|---|
| R4a | `grep -rlF "#162 R" backend-pet-tracker/src backend-pet-tracker/test \| wc -l` | 3 | 3 |
| R4b | `grep -cF "#162 R1 (" …/photo-storage.object-exists.spec.ts` | 2 | 2 |
| R4c | `grep -cF "name: 'NotFound'," …/photo-storage.object-exists.spec.ts` | 2 | 2 |
| R4d | `grep -cF "#162 R2:" …/list-pet-documents.use-case.spec.ts` | 2 | 2 |
| R4e | `grep -cF "Promise.resolve(" …/list-pet-documents.use-case.spec.ts` | 1 | 1 |
| R4f | `grep -rlF "DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS" backend-pet-tracker/src backend-pet-tracker/test \| wc -l` | 1 | 1 |
| R4g | `grep -cF "#162 R3:" backend-pet-tracker/test/media-docs.e2e-spec.ts` | 2 | 2 |
| R4h | `grep -cF "PetDocumentDrizzleRepository" backend-pet-tracker/test/media-docs.e2e-spec.ts` | 2 | 2 |
| R4i | `grep -rlF "getObjectSize: jest.fn()," backend-pet-tracker/src \| wc -l` | 2 | 2 |

## Gate ./init.sh (corrido por el leader, no relanzado)

Log: `scratchpad/162-init.txt`.
- Primera línea `HEAD=e780925d start=2026-10-09T16:37:35Z`; última `exit=0 end=2026-10-09T16:44:37Z`. HEAD revisado = HEAD del gate.
- Backend unit: `Test Suites: 187 passed, 187 total` / `Tests: 1474 passed, 1474 total`. Son 1471 de base + 3 its de R1/R2, como declara el impl.
- Bloque de 2 suites: `Tests: 14 passed, 14 total`.
- Mobile: `Test Suites: 97 passed, 97 total` / `Tests: 2365 passed, 2365 total`.
- E2E: `Test Suites: 3 skipped, 30 passed, 30 of 33 total` / `Tests: 8 skipped, 468 passed, 476 total`. Son +1 respecto a la revisión de #161 (467/475), que es el it de R3.
- Lint y typecheck OK. `✅ Todo verde. Listo para trabajar.`
- 8 líneas `ERROR`: PositionsConsumer (mensaje malformado), AlertsEngineConsumer, Poller ×4 y un DrizzleQueryError FK `pet_users_user_id_users_id_fk` (23503). Todas son logs preexistentes de caminos negativos y ya salían en gates anteriores. Ninguna hace fallar el gate.

## 7. Sondas

Unit: `FORCE_COLOR=0 pnpm exec jest src/modules/media`, con base de 49/49 en HEAD. E2E: `FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/media-docs.e2e-spec.ts`, con base de 33/33. Antes de cada uno de los 4 e2e, `pgrep` respondió `libre`. Cada sonda se revirtió con `git checkout HEAD -- <ruta>` y la comprobación `git diff --quiet && git diff --cached --quiet` respondió `limpio`. Los logs están en `/tmp/162-review-<sonda>.txt`.

| Sonda | Mutación | Resultado | It que mata | Matcher |
|---|---|---|---|---|
| S1a (M1) | adapter: `name === 'NotFound'` | exit=1, 2 failed / 47 passed / 49 | #162 R1 (a) y (b) | `resolves.toBeNull` («rejected instead of resolved») / `rejects.toBe` («resolved instead of rejected») |
| S1b | `name === 'NotFound' \|\| status === 404` | exit=1, 1 failed | #162 R1 (b) | `rejects.toBe` |
| S1c | `name === 'NotFound' && status === 404` | exit=1, 1 failed | #162 R1 (a) | `resolves.toBeNull` |
| X1 | `status === 404 && name !== 'NotFound'` | exit=1, 1 failed | #157 R7: resuelve null cuando el HEAD falla con 404 | `resolves.toBeNull` |
| X2 | `status === 404 \|\| name !== 'NotFound'` | exit=1, 2 failed | #157 R7 (relanza 403) y #161 R1 (b) | `rejects.toBe` / `rejects.toThrow` |
| X3 | `status !== 403` | exit=1, 1 failed | #161 R1 (b) | `rejects.toThrow` |
| X4 | `(status ?? 0) >= 404` | exit=0, 49/49: **sobrevive** | — | — (obs. N1) |
| S2a (M2) | use case: `items.push` en orden de resolución | exit=1, 1 failed | #162 R2 (no #157 R4) | `resolves.toEqual` (línea 99) |
| S2b | `items.unshift` | exit=1, 1 failed | #157 R4 (no #162 R2) | `toEqual` (línea 61) |
| X6 | `for … of` secuencial con `await` | exit=1, 1 failed | #162 R2 | `toEqual` sobre `mock.calls` (línea 92) |
| X7 | push + `items.sort` por fecha desc | unit 49/49 y e2e 33/33: **sobrevive** | — | — (obs. N2) |
| X8 | push + sort por id desc | unit 49/49 y e2e 33/33: **sobrevive** | — | — (obs. N2) |
| X9 | URLs en orden de resolución asignadas por índice | exit=1, 1 failed | #162 R2 | `resolves.toEqual` (línea 99) |
| X10 | orden por índice + sort por fecha desc | unit 49/49: **sobrevive**; equivalente en producción | — | — (obs. N2) |
| S3a (M3) | repo: `.where(eq(petDocuments.id, id))`, import sin `isNull` | e2e exit=1, 1 failed / 32 passed / 33 | #162 R3 | `toEqual`: Expected `2026-10-01T10:00:00.000Z`, Received `2026-10-09T16:51:23.267Z` |
| X13 | `isNotNull` en lugar de `isNull` | e2e exit=1, 7 failed / 26 passed | #162 R3 (Received `16:51:34.777Z`), #157 R5 ×2, #157 R8 ×2, flujo R3, #161 R2 (a) | `toEqual` y los status HTTP de cada flujo |
| P16 (control R4) | mapper: `return error;` → `return new NotFoundException();` | exit=1, 1 failed / 48 passed | `#161 R3: devuelve el mismo Error sin traducirlo` | `toBe` (Object.is, línea 23) |

Sondas no corridas: la prohibida, que quita `eq(petDocuments.id, id)`, y su variante `or(eq(id), isNull)`, por la misma razón (base compartida).

Las tres mutaciones de la spec (M1/M2/M3) y las sondas S1b/S1c/S2b de tasks.md mueren exactamente en el it que prevé tasks.md.

## Observaciones no bloqueantes

- **N1. X4 sobrevive.** El sobreviviente es `(status ?? 0) >= 404`: con él, un 500 o un 503 del HEAD pasaría a `null`, y confirm respondería 409 NOT_UPLOADED en vez de 500. El hueco está en la cláusula universal de #157 R7, «relanza cualquier otro error», que solo tiene candado con un 403. Queda fuera de #162 R1, que trata `name` frente a `status`. Arreglo mínimo, si se quiere en una feature futura: un it con `httpStatusCode: 500` que aserte `rejects.toBe(err)`.
- **N2. X7, X8 y X10 sobreviven.** En el fixture de R2 que prescribe tasks.md («los mismos de #157 R4»), el orden del repositorio coincide con «fecha desc» y con «id desc». Así, reordenar por cualquiera de los dos campos pasa en verde. Las fixtures e2e de #157 R1 (ids …01/02/03 monótonos con la fecha) tampoco distinguen un orden solo por id. X10 es equivalente en producción, porque el repositorio ya ordena por fecha desc e id desc. X7 sí reabriría la fuga de orden de resolución entre documentos con la misma fecha. Arreglo mínimo, que exige enmendar la spec: un fixture cuyo orden de repositorio no salga de ordenar ningún campo desc (por ejemplo, a.date < b.date y a.id < b.id), o un it hermano con dos documentos de la misma fecha. No es un incumplimiento de Codex: el fixture es el que manda la spec, igual que el precedente de la revisión de #157.
- **N3. El impl conserva texto obsoleto de la parada de arranque.** La sección «Estado de R4 al parar» y las líneas 167-175 dicen «pendiente», que era el estado previo a la reanudación autorizada por el humano. El cierre (§Verificación R4, líneas 1039 en adelante) está completo. Es cosmético.
- **N4.** El frontmatter de tasks.md y traceability.md sigue en `status: draft`, sin cambios desde H0 ni desde la firma.
- **N5.** Los commits salen con autor «Claude». Es el mismo patrón que en features anteriores y no afecta a C5.

## Estado final del árbol

- `git rev-parse --short HEAD` → `e780925d`
- `git status --short` → solo `?? progress/review_media-docs-download-test-locks.md` (este fichero)
- Unit en HEAD tras las sondas: 49/49, exit=0
- Sin commits ni push del reviewer
