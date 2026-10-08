# review: media-docs-download-api (#157)
Fecha: 2026-10-08
Veredicto: APROBADO

Worktree: /home/claude/sites/Pet-Tracker-wt-157 — branch feature/157-media-docs-download-api — HEAD a1e16faa

## Estado de la revisión (para retomar tras compactación)
- [x] 1. Log init.sh verificado (HEAD, exit, recuentos, ERROR de Nest)
- [x] 2. Spec/traceability leídas
- [x] 3. Código por R-id
- [x] 4. Historial C4 (12 commits, rojo antes de verde R1-R8; rojos por aserción según impl)
- [x] 5. Sondas unit
- [x] 6. Sondas e2e
- [x] 7. D7 / migración 0019
- [x] 8. Veredicto

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`feature_list.json`: solo #157 `media-docs-download-api`)
- [x] progress/current.md actualizado (sesión #157, worktree, branch y base `36c8050d`)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure (`grep` de `infrastructure|application|@aws-sdk|drizzle|@nestjs` en `modules/media/domain` da 0)
- [x] repositorios y puertos en domain son interfaces puras (solo exportan el `Symbol` del token): `PetDocumentRepository` (create, listUploadedByPet, findByIdAndPet, markUploaded) y `PhotoStorage.objectExists`
- [x] application depende de interfaces (`import type` y tokens `PHOTO_STORAGE` y `PET_DOCUMENT_REPOSITORY`; 0 imports de infrastructure fuera de specs)
- [x] infrastructure sin lógica de negocio: el adapter traduce 404 a false, el repositorio filtra, el mapper de errores solo mapea y el controller delega. La regla «ya confirmado, no HEAD» vive en el use case

## Checklist C4 — TDD
- [x] Cada R1–R8 tiene tests que lo nombran (`#157 R<n>` en describe o it; detalle en §Revisión por R-id). R9 «sin test propio», como dice la spec
- [x] Historial test-primero: 48ab7c46→4c1d4014 (R1), 0616c45b→8417a680 (R7), beb9fa97 + 469333fa→9c3befeb (R2, R5, R6), 2efd45fe→dd9d9c56 (R2, R3), 4fbcc8d3→faa11b3b (R4, R8), a1e16faa (traceability). Los rojos fallan por aserción (impl, con grep de TypeError y TS = 0). Los tests que nacen verdes (unit #157 R3 en c8, E3 y E4 en c10) están declarados en tasks.md

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente» (R1–R8 con test y commit; R9 «sin test propio» con remisión a impl §Verificación R9)
- [x] Commits con formato `test|feat(<scope>): <desc> (#157 R-ids)`. El 12.º es `docs(media-docs-download-api): traceability (#157)`, como dice el handoff (Obs. 7)

## Checklist C6 — Spec aprobada
- [x] requirements.md `status: approved` (l.3) y `[x] Aprobado por humano (fecha: 2026-10-08)` (l.338)

## Checklist C7 — Sin código huérfano
- [x] `listByPet` del repositorio de documentos se renombró a `listUploadedByPet`. `grep -rlF "listByPet" backend-pet-tracker/src/modules/media | wc -l` da 0. Los 11 ficheros fuera de media son de health y reminders, ajenos
- [x] El describe `R1: ListPetDocumentsUseCase delega en listByPet` de #49 fue sustituido por los de #157 R3 y R4 (E7). No queda test huérfano

## Revisión por R-id
- **R1** (columna y migración 0019): `media.schema.ts` declara `timestamp('uploaded_at', { withTimezone: true })`, nullable y sin default. El SQL 0019 es exactamente `ALTER TABLE "pet_documents" ADD COLUMN "uploaded_at" timestamp with time zone;`, sin backfill, así que las filas legacy quedan NULL. Journal: idx 19, tag `0019_pet_documents_uploaded_at`, 20 tags. Snapshot 0019 = 0018 + columna; `prevId` = id de 0018. `drizzle-kit check` da «Everything's fine» y `drizzle-kit generate` da «No schema changes» (sin ficheros nuevos y árbol limpio). Candados en P12–P14: 7 mutantes, 7 rojos.
- **R2** (el POST crea pendiente): create use case con `uploadedAt: null` (P15 rojo). Los e2e #157 R2 y E2 caen al quitar `isNotNull` (PE1).
- **R3** (el GET oculta pendientes a los 4 roles): `listUploadedByPet` filtra `petId AND uploaded_at IS NOT NULL` con orden date desc, id desc. El e2e es un `it.each` sobre los 4 roles; PE1 tumba los 4.
- **R4** (downloadUrl de 3600 s): `Promise.all` con `createDownloadUrl(key, 3600)` y el unit aserta el literal 3600 (P1, P2a, P2b y P3 rojos). E2e `it.each` sobre 4 roles: exactamente 7 claves, `X-Amz-Expires=3600`, firma y pathname `/key`. PE7 (fugar campos del dominio) tumba los 4 roles más E3 y el R3 de #49.
- **R5** (confirmar e idempotencia): orden UUID, findByIdAndPet, return si ya confirmado, HEAD, markUploaded. P5 y P7 rojos. El e2e comprueba 204, `uploaded_at` no nulo, que aparece en el GET y que un segundo confirm devuelve el mismo `getTime()`.
- **R6** (una rama por caso): (a) P8 unit y PE3b e2e; (b) PE3b; (c) PE2 (sin filtro petId devuelve 204) y PE3b; (d) P5, P6 y PE3; (e) PE4, los 3 roles rojos; (f) e2e del guard con cuerpo exacto `{statusCode:404,message:'Not Found'}`; (g) P5 unit. A nivel HTTP, (g) no tiene candado (Obs. 1).
- **R7** (`objectExists` con HEAD): `HeadObjectCommand({Bucket: mediaBucket, Key})`; 404 por `$metadata.httpStatusCode` devuelve false y todo lo demás se relanza. P9, P11 y P11b rojos; P10 sobrevive (Obs. 3).
- **R8** (flujo real contra LocalStack): `it.each` pdf/jpeg con mismos bytes y content-type, GET `[]` antes del confirm. PE1 tumba las dos filas.
- **R9**: lint, test, test:e2e e init.sh dan exit 0 en el log del leader (l.27108-27118 lint, l.27132 exit=0). Greps re-ejecutados: `listByPet` en media 0, `"tag"` 20, tag 0019 1, `HeadObjectCommand` 2. `test/media.e2e-spec.ts` y `media.controller.ts` sin diff desde 20908b80. La allowlist con `--name-only` sale vacía (Obs. 6).
- **D7**: ver Obs. 2. La implementación cumple R7.

## Sondas de mutación
Runner: scratchpad/probe.sh (muta 1 fichero, corre `FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema` o `pnpm run test:e2e -- media-docs`, restaura con `git checkout HEAD -- <ruta>` e imprime `git diff --cached --name-only` + `git status --short`). Baseline unit: 114/114 exit=0. Tras CADA sonda: cached=[] y status = ` M progress/impl_…` + `?? progress/review_…` (registrado en scratchpad/probes/*.txt y en la salida del runner).

| # | Mutación (fichero) | Esperado | Resultado | Tipo de rojo |
|---|---|---|---|---|
| P1 | expiry 3600→3599 (list use case) | unit #157 R4 | 1 rojo: #157 R4 unit | aserción (mock.calls) |
| P2a | firmar `document.id` en vez de `key` | unit #157 R4 | 1 rojo: #157 R4 unit | aserción |
| P2b | zona ciega: firmar `documents[0].key` para todos | unit #157 R4 (2º doc) | 1 rojo: #157 R4 unit | aserción |
| P3 | romper orden: `[...documents].reverse()` | unit #157 R4 | 1 rojo: #157 R4 unit | aserción |
| P4 | zona ciega: orden de resolución (push al resolver) en vez de índice de Promise.all | — | **sobrevive** unit (114/114) | — (ver Obs. 4) |
| P5 | confirm sin HEAD (quitar el `if (!objectExists)`) | unit R5 + R6(d) | 3 rojos: #157 R5 (pendiente+existe), R6 (d), R6 (g) | aserción |
| P6 | marcar cuando objectExists=false (markUploaded antes del throw) | unit R6(d) | 1 rojo: #157 R6 (d) | aserción (`markUploaded` not called) |
| P7 | quitar el return idempotente | unit R5 (ya confirmado) | 1 rojo: #157 R5 ya confirmado | aserción |
| P8 | quitar el check UUID | unit R6(a) | 1 rojo: #157 R6 (a) | aserción (`findByIdAndPet` not called) |
| P8b | `markUploaded(documentId.toLowerCase())` | — | sobrevive: mutante **equivalente** (uuid de Postgres es case-insensitive; findByIdAndPet ya filtró). No es hallazgo | — |
| P9 | adapter: cualquier error → false | unit R7 (403) | 1 rojo: #157 R7 relanza 403 | aserción (`rejects.toBe`) |
| P10 | zona ciega: 404 por `error.name === 'NotFound'` en vez de `$metadata.httpStatusCode` | — | **sobrevive** unit (114/114) | — (ver Obs. 3) |
| P11 | `GetObjectCommand` en vez de `HeadObjectCommand` | unit R7 (true) | 1 rojo: #157 R7 true | aserción (`toBeInstanceOf`) |
| P11b | `httpStatusCode >= 400` → false | unit R7 (403) | 1 rojo: #157 R7 relanza 403 | aserción |
| P12a | SQL 0019 con `DEFAULT now()` | unit R1 SQL | 1 rojo: #157 R1 SQL exacto | aserción (`toBe`) |
| P12b | SQL 0019 + backfill `UPDATE … SET uploaded_at = now()` (filas legacy dejarían de ser NULL) | unit R1 SQL | 1 rojo: #157 R1 SQL exacto | aserción |
| P13a | journal: tag 0019 cambiado | unit R1 journal | 1 rojo: #157 R1 journal | aserción (`entry?.idx` undefined ≠ 19) |
| P13b | journal: idx 19→20 | unit R1 journal | 1 rojo: #157 R1 journal | aserción |
| P14a/b/c | schema: `.defaultNow()` / `.notNull()` / sin `withTimezone` | unit R1 columna | 1 rojo cada una: #157 R1 columna | aserción |
| P15 | create use case: `uploadedAt: new Date()` | unit E5 | 1 rojo: R2 (#49) CreatePetDocumentUseCase (E5) | aserción (`toEqual`) |
| P16 | zona ciega: mapper convierte cualquier error desconocido en 404 (R6 (g) a nivel HTTP) | — | **sobrevive** unit (114/114); e2e: sobrevive (COMBO) | — (ver Obs. 1) |

Baseline e2e (`pnpm run test:e2e -- media-docs`, pgrep libre): 1 suite, 30/30, exit=0.

### Sondas e2e (`pnpm run test:e2e -- media-docs`, pgrep «libre» antes de cada una)
| # | Mutación (fichero) | Esperado | Resultado | Tipo de rojo |
|---|---|---|---|---|
| PE1 | repositorio: quitar `isNotNull(uploadedAt)` en `listUploadedByPet` | R3 ×4, R2, E2, R6 (d), R8 ×2 | 9 rojos, exactamente esos | aserción (diffs `toEqual` Expected/Received) |
| PE2 | repositorio: `findByIdAndPet` sin `eq(petId)` | R6 (c) | 1 rojo: #157 R6 (c) | aserción de status (`.expect(404)` recibe 204) |
| PE3 | mapper: NotUploaded mapeado a NotFoundException 404 | R6 (d) | 1 rojo: #157 R6 (d) | aserción de status (`.expect(409)`) |
| PE3b | mapper: NotFound mapeado a ConflictException 409 | R6 (a)(b)(c) | 3 rojos, exactamente esos | aserción de status |
| PE4 | controller: quitar `@RequirePetRole('owner')` del confirm | R6 (e) ×3 | 3 rojos: family, walker y vet | aserción de status (403) |
| PE7 | mapper de respuesta: `...item.document` (fuga de `uploadedAt` y otros campos) | R4 ×4 y E3 | 6 rojos: R4 ×4, #49 R1 (E3) y #49 R3 | aserción (claves exactas) |
| COMBO | P4 (orden de resolución) + `markUploaded` sin `isNull(uploadedAt)` + P16 (error desconocido mapeado a 404), los 3 a la vez | todos verdes (supervivientes) | 30/30 exit=0: **sobreviven** | — (Obs. 1, 4, 5) |

Todas con `runtime-or-ts-errors=0`. Tras cada una y tras el COMBO: `cached=[]` y `status=[ M progress/impl_media-docs-download-api.md; ?? progress/review_media-docs-download-api.md]`.

## Observaciones
No hay hallazgos bloqueantes. La implementación cumple R1–R9 tal como están escritos. Los supervivientes son huecos de candado que la propia spec prescribe o deja fuera de su alcance. Ninguno es un incumplimiento de Codex.

Observaciones no bloqueantes (ninguna pide enmienda antes del merge):
1. **R6 (g) sin candado HTTP** (spec). En `pet-document-error.mapper.ts:26`, `return error;` no tiene test. P16 (mapear cualquier error desconocido a 404) sobrevive en unit y en e2e, y rompería «el error se propaga (500 de Nest)» de R6 (g). La spec limita (g) al use case y declara «(g) no tiene e2e» (requirements.md l.172), así que es fiel a la spec. Arreglo mínimo, como deuda: un `pet-document-error.mapper.spec.ts` con un `it` por rama (NotFound, NotUploaded y `new Error()` devuelto por identidad).
2. **El texto de D7 es inexacto** (docs, leader). design.md l.83-85 dice que el HEAD va por `AWS_ENDPOINT_URL` y no por el host de firma LAN de #57. Pero `src/aws/aws-clients.ts:167-168` hace del `presignEndpoint` el `endpoint` del único `S3_CLIENT` en modo local. Con `AWS_PRESIGN_ENDPOINT_URL` definida, el HEAD sale hacia el host LAN. R7 manda «por el `S3_CLIENT` existente» y la implementación cumple, así que no es defecto. Solo afecta a desarrollo local con esa variable (el `.env` del worktree no la define); en modo aws no aplica. Arreglo mínimo: corregir el texto de D7.
3. **R7, 404 por `name`** (spec). P10 (`error.name === 'NotFound'` en lugar de `$metadata.httpStatusCode === 404`) sobrevive porque el doble de 404 que prescribe tasks.md lleva ambos (`photo-storage.object-exists.spec.ts:32`). En la práctica equivale para un HEAD de S3. Arreglo mínimo si se quiere el candado: un `it` con un error de 404 sin `name`.
4. **R4, orden por índice** (spec). P4 (`push` al resolver en lugar del índice de `Promise.all`) sobrevive porque el mock que prescribe tasks.md l.290 (`Promise.resolve`) resuelve en orden de llamada. Arreglo mínimo: un mock que resuelva el primer documento después del segundo.
5. **Carrera de `markUploaded`** (fuera de EARS). El `isNull(uploadedAt)` del `WHERE` (`pet-document.drizzle.repository.ts:44`, design D4) no tiene candado. Sobrevive en el COMBO porque la idempotencia de R5 la cubre el `return` temprano del use case (P7 rojo). Solo cubriría dos confirms concurrentes, y ninguna cláusula EARS lo exige.
6. **Comando de la allowlist de R9** (spec). requirements.md l.223 usa `git diff --stat`, que trunca rutas largas a `.../` y produce falsos positivos en el `grep -v`. Con `--name-only` sale vacío. Para futuras specs: prescribir `--name-only`.
7. **Menores** (leader). El frontmatter de traceability.md sigue en `status: draft`. El nombre del commit 12 sigue el handoff y no tasks.md.

Deudas fuera de alcance, sin efecto en el veredicto: #160 (403 sin `s3:ListBucket`, comentario ponytail en D7) y #161 (límite de tamaño en el confirm).

## Output de ./init.sh (corrido por el leader; verificado por el reviewer)
Log: /tmp/claude-1002/-home-claude-sites-Pet-Tracker/19979ce5-67f9-472d-9497-7f32760b05dd/scratchpad/init-157.log (27132 líneas)
```
l.1      HEAD=a1e16faa start=2026-10-08T20:16:29Z
l.291    Test Suites: 179 passed, 179 total          (backend unit)
l.292    Tests:       1361 passed, 1361 total
l.304    Test Suites: 2 passed, 2 total              (infra)
l.305    Tests:       14 passed, 14 total
l.26787  Test Suites: 96 passed, 96 total            (mobile)
l.26788  Tests:       2275 passed, 2275 total
l.27101  Test Suites: 3 skipped, 29 passed, 29 of 32 total   (e2e)
l.27102  Tests:       8 skipped, 459 passed, 467 total
l.27132  exit=0 end=2026-10-08T20:25:35Z
```
- HEAD del log = HEAD actual (a1e16faa). `git diff --name-only a1e16faa` → solo `progress/impl_media-docs-download-api.md` (esperado).
- 0 líneas `FAIL`. Las 8 líneas `ERROR` son logs de tests verdes:
  l.137/142/171-187 (unit): `AlertsEngineConsumerService` 'malformed message body', `PositionsConsumerService`, `PollerService` 'sqs unavailable' — literales presentes en `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`, `src/workers/positions-consumer.service.spec.ts`, `src/workers/poller.service.spec.ts`; la suite unit cerró 1361/1361.
  l.26871 (e2e): `DrizzleQueryError` FK `pet_users_user_id_users_id_fk` = it `si el insert de pet_users falla, la fila de pets no persiste (rollback)` de `test/pets.e2e-spec.ts` (token de usuario fantasma, espera >=500). e2e sin fallos.
- l.26785 'A worker process has failed to exit gracefully' es de la suite móvil (96/96 verdes), ajeno a #157.
