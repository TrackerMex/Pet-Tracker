# Handoff a Codex CLI — #157 media-docs-download-api

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (aprobación vía
> Notion el 2026-10-08, página `3f36115a-9b27-81d6-b555-d8ae33ffc2d5`;
> commits de firma `ef0b256d` + `dd16ee7c`). Feature 100 % backend: columna
> `pet_documents.uploaded_at` (migración 0019), `POST …/media/:documentId/confirm`
> verificado con `HeadObject`, el GET oculta los pendientes y firma un
> `downloadUrl` de 3600 s por documento. Son 12 commits: 11 de TDD (cinco
> pares rojo/verde más el rojo de R2, que comparte verde con R5/R6) y uno
> final de trazabilidad.
>
> La spec la escribió Backend; el liderazgo pasó a Frontend por decisión del
> humano. La branch ya incluye `origin/main` fca7c399 (#153, PR #199),
> mergeado en 23f69803 antes de H0. `node_modules` ya está instalado en
> `Pet-Tracker-wt-157/backend-pet-tracker`.
>
> **Comparte Postgres (`pet_tracker`, 5433) y LocalStack con IA PET (#18,
> wt-18)**, que corre sus e2e de nutrition a la vez. De ahí el `pgrep` antes
> de cada e2e y del `db:migrate`. Q1 (coste en modo `aws`) sigue abierta con
> el humano: no bloquea la implementación, solo el merge.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-157   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_media-docs-download-api.md.
El hash es H0 (el commit que anade este handoff), y es tambien el
«commit de handoff» de requirements.md R9. En todos los comandos de
abajo, sustituye `<H0>` por ese hash literal. PARA si la branch no es
feature/157-media-docs-download-api o si `git status --short` no sale
vacio. No toques /home/claude/sites/Pet-Tracker, Pet-Tracker-wt-18,
Pet-Tracker-wt-155, Pet-Tracker-wt-backend, Pet-Tracker-wt-ui ni ningun
otro worktree, ni cambies de branch en ninguno.

Feature: media-docs-download-api (#157)
Branch: feature/157-media-docs-download-api
Spec aprobada: specs/media-docs-download-api/requirements.md
(status: approved, firma ef0b256d + dd16ee7c). DA1-DA9 estan cerradas
con sus valores por defecto: no reabras ninguna. Q1 es una pregunta de
coste al humano y NO cambia nada de lo que implementas.
Lee tambien, enteros: specs/media-docs-download-api/design.md (sus
nombres de simbolo son EXACTOS), tasks.md y traceability.md.
tasks.md es tu guion. Los titulos de describe e it son LITERALES de
tasks.md: copialos tal cual, con sus tildes y simbolos (`→`, `%s`, `(a)`).

== QUE HACES ==

Los 12 commits, en este orden exacto (el de tasks.md §Tabla de commits):
c1 rojo R1, c2 verde R1, c3 rojo R7, c4 verde R7, c5 rojo R2,
c6 rojo R5+R6, c7 verde R2+R5+R6, c8 rojo R2+R3, c9 verde R3,
c10 rojo R4+R8, c11 verde R4+R8, y c12 de trazabilidad. Rojo SIEMPRE
antes de su verde, en commits separados (C4 de CHECKPOINTS.md; en #19 se
metio todo en un solo commit y no vale).

Esto manda sobre tasks.md:
- Mensajes de commit EN INGLES (docs/conventions.md §Commits): usa los
  de las cadenas de abajo, no los de la tabla de tasks.md.
- Sin commits `refactor(...)`: tasks.md no prevé ninguno y cambiarian
  las cuentas.
- Trazabilidad: traceability.md se rellena entera UNA vez, en c12.
  Ningun commit de c1-c11 la toca.
- Lint: en las cadenas va `pnpm exec eslint` SIN `--fix`
  (`pnpm run lint` lleva `--fix` y reescribe ficheros). `pnpm run lint`
  se corre UNA vez, en el cierre.
- R9: tu corres lint y la suite unit entera. `test:e2e` completo y
  `./init.sh` los corre el leader (comparten Postgres y LocalStack con
  otra sesion): tu solo corres e2e FILTRADOS, como en las cadenas.
- Mide con `FORCE_COLOR=0` delante de jest y con la salida a un fichero,
  como en las cadenas, no como el ejemplo de tasks.md §6.

== BASE ==

origin/main = fca7c399 al escribir este handoff, y la branch ya lo
incluye (merge 23f69803, antes de H0): lo esperado es exit=0. Al
arrancar: `git fetch origin` y
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main lo hace el leader. Nunca
rebasees ni mergees.

Desde backend-pet-tracker/:
- `test -d node_modules && echo presente` -> presente. Si no sale,
  `pnpm install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test -f ../.env && echo presente` -> presente. drizzle.config.ts y los
  e2e leen ese .env (Postgres en 5433, base pet_tracker). NUNCA exportes
  DATABASE_URL ni uses psql.

Chequeo PGREP (lo pidio IA PET, la sesion de #18, que comparte la base):
  test -z "$(pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep)" && echo libre
Va delante de CADA e2e y del `db:migrate`, y antes de la suite unit
entera del cierre. Si no sale `libre`, otra sesion esta usando la base:
espera 60 s y repitelo; nunca lances el e2e sin `libre`.

Comandos (desde backend-pet-tracker/):
  UNIT:   FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema
  E2E:    FORCE_COLOR=0 pnpm run test:e2e -- media-docs
  E2E-M:  FORCE_COLOR=0 pnpm run test:e2e -- 'test/media\.e2e'
  ESLINT: pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
  TSC:    pnpm exec tsc --noEmit -p tsconfig.json
(`media-docs` solo casa test/media-docs.e2e-spec.ts; `test/media\.e2e`
solo casa test/media.e2e-spec.ts.)

Base medida por el leader el 2026-10-08 en este worktree con el arbol de
H0, con FORCE_COLOR=0 y sin pipe, todos exit=0:
  UNIT    Tests:       101 passed, 101 total   (media 28 + schema 73)
  E2E     Tests:       9 passed, 9 total
  E2E-M   Tests:       12 passed, 12 total
  `pnpm test` (unit entera)  Test Suites: 176 passed, 176 total
                             Tests:       1348 passed, 1348 total
  ESLINT exit=0 (unos 40 s)   TSC exit=0 (unos 10 s)
Tu medida manda: repite UNIT, E2E, E2E-M, ESLINT y TSC y anotalos en el
impl. Si algo nace rojo, PARA.

== ANCLAS ==

Ejecutalas TODAS desde la RAIZ del worktree antes de tocar nada y copia
la salida al impl. Son las de requirements.md §Contexto fijo (A),
design.md §Inventario (D), requirements.md §Tests existentes que cambian
(E) y las del handoff (H). Solo estos comandos son anclas; los numeros
de linea no lo son. Si alguna no da EXACTAMENTE lo esperado, PARA y
avisa (ante una diferencia manda el fichero, no el handoff). Cuando
`grep -c` cuenta 0 sale con codigo 1: lo que vale es la cifra impresa.
El leader las ha ejecutado todas en H0 sacandolas de este mismo fichero.

A1. grep -cF "@RequirePetRole('owner')" backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts   -> 1
A2. grep -cF "export const DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS = 600;" backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.ts   -> 1
A3. grep -cF "createDownloadUrl(key: string, expiresInSeconds: number): Promise<string>;" backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts   -> 1
A4. grep -cF "D3: el PUT no fija ContentType en la" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts   -> 1
A5. grep -cF "headers: { 'Content-Type': contentType }," mobile-pet-tracker/src/api/media.ts   -> 1
A6. grep -cF "listByPet(petId: string): Promise<PetDocument[]>;" backend-pet-tracker/src/modules/media/domain/repositories/pet-document.repository.ts   -> 1
A7. grep -cF "uploaded_at" backend-pet-tracker/src/db/schema/media.schema.ts   -> 0
A8. grep -cF "Sin endpoint de confirmación, sin estados, sin verificación de objeto al" specs/media-docs-api/design.md   -> 1
A9. grep -cF "export const PHOTO_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600;" backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.ts   -> 1
A10. grep -cF "export type PetRole = 'owner'" backend-pet-tracker/src/modules/pets/domain/entities/pet-membership.ts   -> 1
A11. grep -cF "typeof document.date === 'string'" mobile-pet-tracker/src/api/media.ts   -> 1
A12. grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json   -> 19
A13. grep -cF '"tag": "0018_nutrition_plans_engine_meals"' backend-pet-tracker/src/db/migrations/meta/_journal.json   -> 1
A14. grep -rlF "HeadObjectCommand" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 0
A15. grep -rlF "presign" backend-pet-tracker/test | wc -l   -> 0
A16. ls backend-pet-tracker/src/db/migrations/ | grep -c "^0019_"   -> 0
A17. grep -rlF "listByPet" backend-pet-tracker/src/modules/media | wc -l   -> 5
D1. grep -cF "ackedAt: timestamp('acked_at', { withTimezone: true })," backend-pet-tracker/src/db/schema/alerts.schema.ts   -> 1
D2. grep -cF "/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\$/i;" backend-pet-tracker/src/modules/geofences/application/use-cases/get-geofence.use-case.ts   -> 1
D3. grep -cF "export function mapGeofenceError(error: unknown): unknown {" backend-pet-tracker/src/modules/geofences/infrastructure/mappers/geofence-error.mapper.ts   -> 1
D4. grep -rlF ': PhotoStorage = {' backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 2
D5. grep -rlF 'implements PhotoStorage' backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 1
D6. grep -rlF 'as unknown as PetDocumentRepository' backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 2
D7. grep -rlF "MockOf<" backend-pet-tracker/src/modules/media | wc -l   -> 0
D8. grep -rlF ': PetDocument = {' backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 1
D9. grep -rlF '): PetDocument {' backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 2
D10. grep -rlF "new ListPetDocumentsUseCase(documents)" backend-pet-tracker/src | wc -l   -> 1
E1. grep -cF "async function seedDocument(" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
E2a. grep -cF "responde 201/600s, persiste antes del PUT, aparece en GET y audita pet.document_add" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
E2b. grep -cF "expect(listed.body).toEqual([body.document]);" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
E3a. grep -cF "responde un array plano con shape exacto, solo la mascota solicitada y orden determinista" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
E3b. grep -cF "['id', 'type', 'name', 'date', 'vet', 'key'].sort()" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 2
E4a. grep -cF "sube bytes sin Authorization, conserva el documento y permite leer el objeto por key" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
E4b. grep -cF "expect(listed.body).toEqual([createdBody.document]);" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
E5. grep -cF "listByPet: jest.fn()," backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts   -> 1
E6. grep -cF "createDownloadUrl: jest.fn()," backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts   -> 1
E7. grep -cF "describe('R1: ListPetDocumentsUseCase delega en listByPet'" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts   -> 1
E8. grep -cF "permite GET a caregiver (family) y viewer (vet)" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
E9. grep -cF "responde 404 a no-miembro, mascota inexistente y :petId malformado" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-08)' specs/media-docs-download-api/requirements.md   -> 1
H2. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H3. grep -cF "import { date, index, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';" backend-pet-tracker/src/db/schema/media.schema.ts   -> 1
H4. test ! -e backend-pet-tracker/src/db/schema/media.schema.spec.ts && echo ok   -> ok
H5. test ! -e backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts && echo ok   -> ok
H6. test ! -e backend-pet-tracker/src/modules/media/domain/errors/pet-document.errors.ts && echo ok   -> ok
H7. test ! -e backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts && echo ok   -> ok
H8. test ! -e backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts && echo ok   -> ok
H9. grep -rlF 'stub rojo de #157' backend-pet-tracker/src | wc -l   -> 0
H10. grep -cF "return this.documents.listByPet(petId);" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts   -> 1
H11. grep -cF "async list(@Req() request: PetAccessRequest): Promise<PetDocumentResponse[]> {" backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts   -> 1

Valores al cerrar (copialos al impl): A1 -> 2 (el confirm es solo
owner); A2-A5 sin cambios; A6 -> 0; A7 -> 1; A8-A11 sin cambios;
A12 -> 20; A13 sin cambios; A14 -> 2; A15 no se fija (anota el valor);
A16 -> 1; A17 -> 0; D1-D5 sin cambios; D6 -> 3 (entra el doble del
confirm); D7-D9 sin cambios; D10 -> 0; E1 sin cambios; E2a -> 0;
E2b -> 0; E3a sin cambios; E3b -> 1; E4a sin cambios; E4b -> 0; E5 -> 0;
E6 sin cambios; E7 -> 0; E8-E9 sin cambios; H1-H2 sin cambios; H3 -> 0;
H4-H8: los cinco ficheros existen (`test -e`); H9 sin cambios (0: los
stubs se van en su verde); H10 -> 0; H11 -> 0. Y los cuatro greps de
requirements.md R9, desde la raiz:
  R9a. grep -rlF "listByPet" backend-pet-tracker/src/modules/media | wc -l   -> 0
  R9b. grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json   -> 20
  R9c. grep -cF '"tag": "0019_pet_documents_uploaded_at"' backend-pet-tracker/src/db/migrations/meta/_journal.json   -> 1
  R9d. grep -rlF "HeadObjectCommand" backend-pet-tracker/src | wc -l   -> 2

== COMMITS ==

Todo desde backend-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la
cadena (en #115 se commiteo un verde con el registrador en exit=1). Si
una cadena no llega al commit, PARA y reporta en el impl el eslabon que
fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato:
`Tests:       3 failed, 101 passed, 104 total` y en verde
`Tests:       104 passed, 104 total`. Cada medida lleva su
`echo "exit=$?"`; anota el exit en el impl.

Rojos: cada uno cae EXACTAMENTE como dice tasks.md, por ASERCION
(Expected/Received, o «Received promise resolved/rejected instead of…»).
Nunca por TypeError, ReferenceError, SyntaxError, `Cannot find module`
ni por un error de TypeScript (ts-jest tiene los diagnosticos activos:
un TS2307/TS2339/TS2353/TS2554 tumba la suite entera y NO vale como
rojo; ver tasks.md §Reglas de cabecera 2). La cadena comprueba la cuenta;
tu ademas abres el log y copias al impl cada it rojo con su matcher y
su Expected/Received. TSC va con exit 0 en TODOS los commits, rojos
incluidos: si un rojo no compila, el rojo esta mal escrito.

Como escribir los rojos para que caigan por asercion (todo esto es
obligatorio; lo midio el leader en H0):
- STUBS Y LINT. eslint marca `@typescript-eslint/no-unused-vars` como
  ERROR en un parametro de metodo sin usar. Los dos stubs con
  parametros sin usar (c3 `objectExists(key)` del adapter y c6
  `execute(petId, documentId)` del confirm) llevan, en la linea
  inmediatamente encima de la firma del metodo, exactamente:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub rojo de #157 R7, lo retira el verde
  (en c6: `-- stub rojo de #157 R5, lo retira el verde`). El verde
  borra esa linea y la cadena lo comprueba. Las propiedades de
  parametro del constructor (`private readonly storage`) no las marca.
- REGLAS no-unsafe. La config es `recommendedTypeChecked`:
  `no-unsafe-member-access`, `no-unsafe-assignment`, `no-unsafe-call` y
  `no-unsafe-return` son ERROR (solo `no-unsafe-argument` es aviso).
  Nada de `.algo` sobre un `any`: en e2e, castea `response.body` como ya
  hace el fichero (`response.body as DocumentResponse[]`); en R7, tipa
  el doble: `const send = jest.fn<Promise<unknown>, [HeadObjectCommand]>();`
  (patron de request-password-reset.use-case.spec.ts), y lee
  `send.mock.calls[0][0]` SOLO despues de
  `expect(send).toHaveBeenCalledTimes(1)` (con el stub, `send` no se
  llama y el rojo cae ahi, no en un TypeError).
- c1, journal: `JSON.parse(...)` casteado a
  `{ entries: { idx: number; tag: string }[] }` y
  `expect(entry?.idx).toBe(19)` (nunca `entry.idx`: con la entrada
  ausente seria TypeError).
- c6, stub del confirm: `execute` devuelve
  `Promise.reject(new Error('ConfirmPetDocumentUploadUseCase not implemented'))`
  (NO un `throw` sincrono: con throw, `useCase.execute(...)` revienta
  antes de llegar al `expect` y el rojo no es de asercion). Los its R5
  se escriben `await expect(useCase.execute(...)).resolves.toBeUndefined()`
  y los R6 `await expect(...).rejects.toBeInstanceOf(...)` /
  `.rejects.toBe(boom)`.
- c6, dobles del confirm: cada `jest.fn()` en su propia const
  (`const findByIdAndPet = jest.fn(); const markUploaded = jest.fn();
  const objectExists = jest.fn();`) y el objeto casteado
  `{ findByIdAndPet, markUploaded } as unknown as PetDocumentRepository`;
  las aserciones van sobre las consts, nunca sobre
  `documents.findByIdAndPet` (no existe en la interfaz hasta c7: TS2339).
  Los fixtures de documento del confirm NO llevan anotacion `: PetDocument`
  (uploadedAt no entra en la entidad hasta c7: TS2353).
- GET por ids, no por objeto, en todo it nuevo anterior a c10 (tasks.md
  §Reglas 5).

-- c1/c2 R1: columna uploaded_at y migracion 0019 --

c1 rojo (crea src/db/schema/media.schema.spec.ts, 3 its, tasks.md R1 (1)):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 101 passed, 104 total`
  grep -qE '^Tests: +3 failed, 101 passed, 104 total$' /tmp/157-r1.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|error TS' /tmp/157-r1.txt \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/db/schema/media.schema.spec.ts \
    && test "$(git diff --cached --name-only)" = 'backend-pet-tracker/src/db/schema/media.schema.spec.ts' \
    && git commit -m 'test(media): red uploaded_at column and migration 0019 (#157 R1)'

c2 verde (tasks.md R1 (2): `timestamp` al import de media.schema.ts y
`uploadedAt` en petDocuments; luego genera. NO edites a mano ni el SQL
ni el snapshot ni el journal):
  pnpm db:generate --name pet_documents_uploaded_at; echo "exit=$?"
  test "$(cat src/db/migrations/0019_pet_documents_uploaded_at.sql)" = 'ALTER TABLE "pet_documents" ADD COLUMN "uploaded_at" timestamp with time zone;' && echo sql-exacto
    -> si no sale `sql-exacto`, PARA y pega el SQL generado en el impl
  test -z "$(pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep)" && echo libre
  pnpm db:migrate; echo "exit=$?"
    -> exit=0. Aplica 0019 a pet_tracker (5433), base compartida con IA
       PET: el leader ya le aviso. Si falla, PARA; nunca psql.
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-g1.txt 2>&1; echo "exit=$?"
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/157-g1-e2e.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +104 passed, 104 total$' /tmp/157-g1.txt \
    && grep -qE '^Tests: +9 passed, 9 total$' /tmp/157-g1-e2e.txt \
    && test "$(grep -cF '"tag"' src/db/migrations/meta/_journal.json)" = 20 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/db/schema/media.schema.ts src/db/migrations/0019_pet_documents_uploaded_at.sql src/db/migrations/meta/0019_snapshot.json src/db/migrations/meta/_journal.json \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/db/migrations/0019_pet_documents_uploaded_at.sql backend-pet-tracker/src/db/migrations/meta/0019_snapshot.json backend-pet-tracker/src/db/migrations/meta/_journal.json backend-pet-tracker/src/db/schema/media.schema.ts ' \
    && test -z "$(git status --short)" \
    && git commit -m 'feat(db): add pet_documents.uploaded_at, migration 0019 (#157 R1)'
  (`test -z "$(git status --short)"` tras el add: drizzle-kit no puede
  haber dejado ningun otro fichero. Si lo dejo, PARA.)
  (<PGREP> es el chequeo de arriba; si no da `libre`, no lances el e2e.)

-- c3/c4 R7: objectExists --

c3 rojo (crea src/modules/media/infrastructure/photo-storage.object-exists.spec.ts,
3 its, y el stub de tasks.md R7 (1): puerto, adapter con
`Promise.resolve(true)` sin `send` y con el eslint-disable de arriba, y
`objectExists: jest.fn(),` en los dobles de E5 y E6, nada mas en E6):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 104 passed, 107 total`
  grep -qE '^Tests: +3 failed, 104 passed, 107 total$' /tmp/157-r3.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|error TS' /tmp/157-r3.txt \
    && test "$(grep -cF 'stub rojo de #157 R7' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/infrastructure/photo-storage.object-exists.spec.ts src/modules/media/infrastructure/photo-storage.s3.adapter.ts src/modules/media/domain/ports/photo-storage.ts src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts ' \
    && git commit -m 'test(media): red objectExists sends HEAD (#157 R7)'

c4 verde (tasks.md R7 (2), con el comentario `// ponytail:` de design.md
§D7; borra la linea del eslint-disable):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-g3.txt 2>&1; echo "exit=$?"
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- 'test/media\.e2e' > /tmp/157-g3-e2em.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +107 passed, 107 total$' /tmp/157-g3.txt \
    && grep -qE '^Tests: +12 passed, 12 total$' /tmp/157-g3-e2em.txt \
    && test "$(grep -cF 'stub rojo de #157' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 0 \
    && test "$(grep -cF 'new HeadObjectCommand(' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 1 \
    && test "$(grep -cF '// ponytail:' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/infrastructure/photo-storage.s3.adapter.ts \
    && test "$(git diff --cached --name-only)" = 'backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts' \
    && git commit -m 'feat(media): objectExists with HeadObjectCommand (#157 R7)'

-- c5 R2: el documento nace pendiente (rojo; su verde es c7) --

c5 rojo (E5: `uploadedAt: null` en el toEqual del documento, nada mas):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 106 passed, 107 total`
  grep -qE '^Tests: +1 failed, 106 passed, 107 total$' /tmp/157-r5.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|error TS' /tmp/157-r5.txt \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts \
    && test "$(git diff --cached --name-only)" = 'backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts' \
    && git commit -m 'test(media): red document is created pending (#157 R2)'

-- c6/c7 R5 y R6: confirmacion de subida (c7 cierra tambien R2) --

c6 rojo (tasks.md R5 y R6 (1) entero: errores reales, stub del use case
SIN ruta, SIN provider y SIN metodos nuevos en el repositorio; spec unit
de 6 its; helper `confirmDocument`; E4 parte R5; describes e2e `#157 R5`
(2 its) y `#157 R6` (a, b, c, d, it.each e x3, f = 8 tests)):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-r6.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       7 failed, 106 passed, 113 total`
       (los 6 del confirm + E5, que sigue rojo hasta c7)
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/157-r6-e2e.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       11 failed, 8 passed, 19 total`
       (R5 x2, R6 (a)-(d) x4, (e) x3 y (f) x1 nuevos, mas E4)
  grep -qE '^Tests: +7 failed, 106 passed, 113 total$' /tmp/157-r6.txt \
    && grep -qE '^Tests: +11 failed, 8 passed, 19 total$' /tmp/157-r6-e2e.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|error TS' /tmp/157-r6.txt /tmp/157-r6-e2e.txt \
    && test "$(grep -cF 'stub rojo de #157 R5' src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/domain/errors/pet-document.errors.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts test/media-docs.e2e-spec.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts backend-pet-tracker/src/modules/media/domain/errors/pet-document.errors.ts backend-pet-tracker/test/media-docs.e2e-spec.ts ' \
    && git commit -m 'test(media): red upload confirmation (#157 R5,R6)'

c7 verde (tasks.md R2 (2) y R5/R6 (2): entidad, create use case,
repositorio (interfaz + drizzle + toDomain), execute segun design.md
§D4, mapper de errores, `confirm()` en el controller, provider en el
modulo, y E7 parte de tipo: el helper `document()` del spec de listado
gana `uploadedAt`. Borra la linea del eslint-disable):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-g6.txt 2>&1; echo "exit=$?"
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/157-g6-e2e.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +113 passed, 113 total$' /tmp/157-g6.txt \
    && grep -qE '^Tests: +19 passed, 19 total$' /tmp/157-g6-e2e.txt \
    && test "$(grep -rlF 'stub rojo de #157' src | wc -l)" = 0 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/domain/entities/pet-document.entity.ts src/modules/media/domain/repositories/pet-document.repository.ts src/modules/media/application/use-cases/create-pet-document.use-case.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts src/modules/media/infrastructure/pet-media.controller.ts src/modules/media/media.module.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.ts backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts backend-pet-tracker/src/modules/media/domain/entities/pet-document.entity.ts backend-pet-tracker/src/modules/media/domain/repositories/pet-document.repository.ts backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts backend-pet-tracker/src/modules/media/media.module.ts ' \
    && git commit -m 'feat(media): upload state and POST confirm (#157 R2,R5,R6)'
  (En c7 el GET todavia lista los pendientes: E2 sigue verde con su
  `toEqual([body.document])` de #49. Lo cambia c8.)

-- c8/c9 R3: el GET oculta los pendientes (y el GET de R2 y R6 (d)) --

c8 rojo (tasks.md R3 (1) entero: renombre mecanico listByPet ->
listUploadedByPet SIN filtro, E5 parte doble, E7 parte R3 (se borra el
describe `R1: ...listByPet` y entra `#157 R3` con 1 it: el total unit no
cambia y nace verde, declarado), E1, describe e2e `#157 R3` (it.each
x4), E2 y describe `#157 R2` (1 it), y la linea de GET tras el 409 en
R6 (d)):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-r8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       113 passed, 113 total` (el rojo de R3 es e2e)
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/157-r8-e2e.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       7 failed, 17 passed, 24 total`
       (R3 x4, R2, E2 y R6 (d))
  grep -qE '^Tests: +113 passed, 113 total$' /tmp/157-r8.txt \
    && grep -qE '^Tests: +7 failed, 17 passed, 24 total$' /tmp/157-r8-e2e.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|error TS' /tmp/157-r8-e2e.txt \
    && test "$(grep -rlF 'listByPet' src/modules/media | wc -l)" = 0 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/domain/repositories/pet-document.repository.ts src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts src/modules/media/application/use-cases/list-pet-documents.use-case.ts src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts test/media-docs.e2e-spec.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts backend-pet-tracker/src/modules/media/domain/repositories/pet-document.repository.ts backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts backend-pet-tracker/test/media-docs.e2e-spec.ts ' \
    && git commit -m 'test(media): red GET hides pending documents (#157 R2,R3)'

c9 verde (tasks.md R3 (2): el filtro `isNotNull` en listUploadedByPet,
mismo orden de #49):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-g8.txt 2>&1; echo "exit=$?"
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/157-g8-e2e.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +113 passed, 113 total$' /tmp/157-g8.txt \
    && grep -qE '^Tests: +24 passed, 24 total$' /tmp/157-g8-e2e.txt \
    && test "$(grep -cF 'isNotNull(petDocuments.uploadedAt)' src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts \
    && test "$(git diff --cached --name-only)" = 'backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts' \
    && git commit -m 'feat(media): filter pending documents out of the list (#157 R2,R3)'

-- c10/c11 R4 y R8: downloadUrl de 3600 s y flujo completo --

c10 rojo (tasks.md R4 y R8 (1) entero: stub en el use case de listado
con `downloadUrl: ''` SIN llamar a storage, mapper y `list()` reales, el
describe unit `#157 R3` construye con el doble de storage, describe unit
`#157 R4` (1 it), E3, E4 parte R4, describes e2e `#157 R4` (it.each x4) y
`#157 R8` (it.each x2). E3 y E4 nacen verdes con el stub, declarado):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-r10.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 113 passed, 114 total`
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/157-r10-e2e.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 24 passed, 30 total`, los 6 en el
       `toMatch(/^https?:\/\//)` (con `''`, `new URL('')` daria TypeError:
       por eso el toMatch va PRIMERO)
  grep -qE '^Tests: +1 failed, 113 passed, 114 total$' /tmp/157-r10.txt \
    && grep -qE '^Tests: +6 failed, 24 passed, 30 total$' /tmp/157-r10-e2e.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|error TS' /tmp/157-r10.txt /tmp/157-r10-e2e.txt \
    && test "$(grep -rlF 'new ListPetDocumentsUseCase(documents)' src | wc -l)" = 0 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/application/use-cases/list-pet-documents.use-case.ts src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts src/modules/media/infrastructure/mappers/pet-document.mapper.ts src/modules/media/infrastructure/pet-media.controller.ts test/media-docs.e2e-spec.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document.mapper.ts backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts backend-pet-tracker/test/media-docs.e2e-spec.ts ' \
    && git commit -m 'test(media): red downloadUrl and full download flow (#157 R4,R8)'

c11 verde (tasks.md R4 (2): `Promise.all` con
`createDownloadUrl(document.key, DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS)`,
conservando el orden):
  FORCE_COLOR=0 pnpm exec jest src/modules/media src/db/schema > /tmp/157-g10.txt 2>&1; echo "exit=$?"
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/157-g10-e2e.txt 2>&1; echo "exit=$?"
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- 'test/media\.e2e' > /tmp/157-g10-e2em.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +114 passed, 114 total$' /tmp/157-g10.txt \
    && grep -qE '^Tests: +30 passed, 30 total$' /tmp/157-g10-e2e.txt \
    && grep -qE '^Tests: +12 passed, 12 total$' /tmp/157-g10-e2em.txt \
    && test "$(grep -cF 'export const DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600;' src/modules/media/application/use-cases/list-pet-documents.use-case.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && git add src/modules/media/application/use-cases/list-pet-documents.use-case.ts \
    && test "$(git diff --cached --name-only)" = 'backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts' \
    && git commit -m 'feat(media): sign a 3600 s downloadUrl per document (#157 R4,R8)'

== CIERRE ==

Desde backend-pet-tracker/, sin pipe, con salida al impl:
- <PGREP> libre; despues
  `FORCE_COLOR=0 pnpm test > /tmp/157-all.txt 2>&1; echo "exit=$?"`
    -> exit=0, `Test Suites: 179 passed, 179 total` y
       `Tests:       1361 passed, 1361 total`
       (176 + 3 suites nuevas; 1348 + 3 de R1 + 3 de R7 + 6 del confirm
       + 1 de R4). Mientras corre, no lances otra cosa.
- TSC -> exit=0.
- `pnpm run lint > /tmp/157-lint.txt 2>&1; echo "exit=$?"` -> exit=0 (este
  SI lleva --fix) y despues `git status --short` -> vacio. Si --fix
  reescribio algo, PARA y reporta que fichero y que cambio: no lo
  commitees sin decirlo.
Desde la raiz del repo:
- Las anclas A, D, E y H con sus valores de cierre, y R9a-R9d.
- `git diff --stat <H0> -- mobile-pet-tracker/ infra/ docs/`   -> vacio
- `git diff --stat <H0> -- backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml backend-pet-tracker/test/media.e2e-spec.ts`   -> vacio

Despues rellena specs/media-docs-download-api/traceability.md, solo la
columna de commits (hash corto + mensaje, `rojo → verde`): R1 c1 → c2;
R2 c5 → c7 y c8 → c9; R3 c8 → c9; R4 c10 → c11; R5 c6 → c7; R6 c6 → c7;
R7 c3 → c4; R8 c10 → c11; R9 `sin commit propio: impl §Verificación R9
(test:e2e completo e ./init.sh los corre el leader)`. No toques su
frontmatter. El impl lleva una seccion `## Verificación R9` con lint y
unit entera (comando, exit, lineas de resumen), los cuatro greps R9a-R9d
y la linea `test:e2e completo y ./init.sh: pendientes del leader`.
Commit final, desde la raiz:
  git add specs/media-docs-download-api/traceability.md progress/impl_media-docs-download-api.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_media-docs-download-api.md specs/media-docs-download-api/traceability.md ' \
    && git commit -m 'docs(media-docs-download-api): traceability (#157)'
Y la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_media-docs-download-api.md' ':!specs/media-docs-download-api/requirements.md' ':!specs/media-docs-download-api/design.md' ':!specs/media-docs-download-api/tasks.md' ':!progress/review_media-docs-download-api.md'
    -> exactamente los 26 ficheros de abajo
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md (capas domain / application /
  infrastructure) y docs/conventions.md (§Tests, §Commits, §Nunca apliques
  una migración con `psql` crudo). Patrones a copiar, ya medidos en las
  anclas: errores de geofence.errors.ts, mapper de
  geofence-error.mapper.ts, regex UUID de get-geofence.use-case.ts, test
  de schema de alerts.schema.spec.ts.
- Prefijo `#157 R<n>:` en todo describe/it nuevo. Los its de #49 que
  cambian (E2-E4) conservan su describe y su titulo, salvo el retitulo
  literal de E2.
- Valores esperados LITERALES en los tests (`3600`, `600`, los cuerpos
  de error, las claves), nunca el simbolo importado de produccion
  (tasks.md R4: `[[keyA, 3600], [keyB, 3600]]` con el literal).
- El POST de #49 no cambia de respuesta: `PetDocumentResponse` y
  `toPetDocumentResponse` se quedan como estan (design.md §Firmas), y por
  eso `uploadedAt` nunca sale en una respuesta.
- Migracion: solo `pnpm db:generate --name pet_documents_uploaded_at` y
  `pnpm db:migrate` en c2. Nunca psql, nunca exportar DATABASE_URL, nunca
  editar a mano el SQL, el snapshot ni el journal.
- NO lances ./init.sh, ni `pnpm run test:e2e` sin filtro, ni
  `docker compose` ni `provision:local`: Postgres y LocalStack los
  comparten otras sesiones y el gate lo corre el leader. Si un e2e falla
  por conexion (ECONNREFUSED, 5433 o 4566), PARA y reportalo.
- Ni recursos AWS reales ni cdk: nada de esta feature corre contra AWS.
- Ni `pnpm add`, ni cambios en package.json ni pnpm-lock.yaml:
  `HeadObjectCommand` ya esta en @aws-sdk/client-s3.
- No toques ningun fichero fuera de la lista de abajo. En particular, NO
  test/media.e2e-spec.ts ni el endpoint de foto (R9).
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter y las casillas de
  §Aprobacion de requirements.md. Los escribe el leader o el humano.
  Todo lo que tengas que contar va en progress/impl_media-docs-download-api.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (26, ni uno mas):
  backend-pet-tracker/src/db/migrations/0019_pet_documents_uploaded_at.sql
  backend-pet-tracker/src/db/migrations/meta/0019_snapshot.json
  backend-pet-tracker/src/db/migrations/meta/_journal.json
  backend-pet-tracker/src/db/schema/media.schema.spec.ts
  backend-pet-tracker/src/db/schema/media.schema.ts
  backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts
  backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts
  backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts
  backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.ts
  backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts
  backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts
  backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts
  backend-pet-tracker/src/modules/media/domain/entities/pet-document.entity.ts
  backend-pet-tracker/src/modules/media/domain/errors/pet-document.errors.ts
  backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts
  backend-pet-tracker/src/modules/media/domain/repositories/pet-document.repository.ts
  backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts
  backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document.mapper.ts
  backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts
  backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts
  backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts
  backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts
  backend-pet-tracker/src/modules/media/media.module.ts
  backend-pet-tracker/test/media-docs.e2e-spec.ts
  progress/impl_media-docs-download-api.md
  specs/media-docs-download-api/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R8 de requirements.md, y R9 en lo que te
toca (lint, unit entera, greps, lista cerrada). test:e2e completo e
./init.sh son del leader.

Al terminar, progress/impl_media-docs-download-api.md debe tener: pwd,
branch, H0 y status; el exit de is-ancestor; node_modules y .env
(presentes); la salida de las anclas (A1-A17, D1-D10, E1-E9, H1-H11) en
H0 y la de cierre, mas R9a-R9d; la base con su exit (UNIT, E2E, E2E-M,
ESLINT, TSC); el SQL generado de 0019 y el exit de db:migrate; los 12
commits con hash y R-id; por cada rojo, el comando, las lineas `Tests:`,
el exit y cada it rojo con su matcher y Expected/Received; cada verde
con sus lineas `Tests:`, TSC y ESLINT; cada <PGREP> que no salio `libre`
y cuanto esperaste; el cierre (unit entera con 1361, TSC, lint con
--fix y status vacio, diffs vacios, lista cerrada); la seccion
`## Verificación R9`; y cualquier decision que la spec no cerrara
literalmente.
```
