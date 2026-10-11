# Handoff a Codex CLI — #162 media-docs-download-test-locks

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (aprobación vía
> Notion el 2026-10-09, página `3f46115a-9b27-8139-b35e-ee1d530aef95`;
> commit de firma `b1eea14a`). Q1–Q3 con su recomendación: R3 se queda.
> Feature 100 % backend y **solo de tests**: tres candados sobre código ya
> correcto, cada uno con su rojo en una mutación de producción versionada
> (M1–M3) que el commit verde revierte. El diff neto de producción es cero.
> Son 7 commits: tres pares rojo/verde (R1, R2, R3) y uno final de
> trazabilidad.
>
> A diferencia de #161, ningún rojo es de símbolo ausente: `tsc` y `eslint`
> salen con exit 0 en **todos** los commits, rojos incluidos. Todos los rojos
> son por aserción.
>
> La branch se actualizó con origin/main `65f37841` (merge `6c4f0d69`), que no
> toca `backend-pet-tracker/`, `infra/` ni `init.sh`: el backend es idéntico
> al de la base de la spec, `51ffebd0`. Base unit medida por el leader en este
> worktree: `Test Suites: 12 passed, 12 total`, `Tests: 46 passed, 46 total`,
> exit 0.
>
> **Comparte Postgres (`pet_tracker`, 5433) y LocalStack con Backend (#158,
> wt-158) e IA PET.** El leader autoriza en este handoff los e2e de
> `test/media-docs.e2e-spec.ts` (base, c5 y c6), y solo ese fichero, siempre
> con `<PGREP>` libre en una llamada aparte. `node_modules` y `.env` ya están
> en el worktree.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-162   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_media-docs-download-test-locks.md.
El hash es H0 (el commit que anade este handoff), y es tambien el
«hash-handoff» de requirements.md R4 y tasks.md R4 (2). En todos los
comandos de abajo, sustituye `<H0>` por ese hash literal. PARA si la
branch no es feature/162-media-docs-download-test-locks o si
`git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-158, Pet-Tracker-wt-159, Pet-Tracker-wt-18,
Pet-Tracker-wt-backend,
Pet-Tracker-wt-ui ni ningun otro worktree, ni cambies de branch en ninguno.

Feature: media-docs-download-test-locks (#162)
Branch: feature/162-media-docs-download-test-locks
Spec aprobada: specs/media-docs-download-test-locks/requirements.md
(status: approved, firma b1eea14a). Q1-Q3 y DA1-DA5 estan cerradas con su
valor por defecto (R3 se canda; sin unit para las ramas del mapper; sin
deuda por el eq(id)): no reabras ninguna.
Lee tambien, enteros: specs/media-docs-download-test-locks/design.md,
tasks.md y traceability.md. tasks.md es tu guion: sus pasos de R2 y R3
son EXACTOS (orden de la sincronizacion, literales, nombres de variable).
Los titulos de describe e it son LITERALES de tasks.md: copialos tal
cual, con sus tildes y simbolos (`(a)`, `revés`).
Ningun it, describe, helper ni doble existente cambia. El UNICO cambio a
lineas existentes permitido es E1 de requirements.md §Tests existentes
que cambian (una linea de import NUEVA en el e2e). Los describe nuevos
van al FINAL de cada fichero; en el e2e, dentro del describe raiz
`Pet documents API (e2e)`, despues del ultimo describe hijo (`#161 R2`).

== QUE HACES ==

Los 7 commits, en este orden exacto:
c1 rojo R1, c2 verde R1, c3 rojo R2, c4 verde R2, c5 rojo R3,
c6 verde R3, y c7 de trazabilidad. Rojo SIEMPRE antes de su verde, en
commits separados (C4 de CHECKPOINTS.md; en #19 se metio todo en un solo
commit y no vale). Cada rojo lleva sus tests MAS su mutacion de
produccion (M1, M2, M3 de tasks.md); cada verde SOLO revierte la mutacion
y no anade tests. Los mensajes de commit son los de tasks.md y van
literales en las cadenas de abajo.

Esto manda sobre tasks.md:
- El rojo NUNCA se consigue tocando un doble ni un test existente: solo
  con la mutacion M de produccion que dice tasks.md, exacta.
- Revertir una mutacion es `git show <H0>:<ruta desde la raiz> > <ruta>`.
  NUNCA `git checkout <hash> -- <ruta>` (deja el indice sucio) ni
  reescribir el fichero a mano.
- Sin commits `refactor(...)`: tasks.md (3) de cada R se cumple diciendo
  en el impl que no aplica. Un commit de mas cambia las cuentas.
- Trazabilidad: traceability.md se rellena entera UNA vez, en c7. Ningun
  commit de c1-c6 la toca.
- Lint: en las cadenas va `pnpm exec eslint` SIN `--fix`. `pnpm run lint`
  lleva `--fix` y reescribe ficheros: se corre UNA vez, en el cierre.
- FORMATO. En cada commit c1-c6, ANTES de sus medidas, ejecuta
  `pnpm exec prettier --write <los ficheros de su git add>` (exactamente
  esos, nunca un glob) y copia su salida al impl. Cada cadena lleva
  `pnpm exec prettier --check <mismos ficheros>` delante del `git add`.
  Prettier solo parte lineas; no cambia literales ni titulos.
- E2E: SIEMPRE `pnpm exec jest --config ./test/jest-e2e.json <ruta>`.
  NUNCA `pnpm run test:e2e -- …`: pnpm le pasa el `--` a jest, todo lo
  que va detras se vuelve patron de ruta y corren las 33 suites e2e
  contra la base compartida (paso dos veces en #161).
- R4: tu corres lint, la suite unit entera, el e2e de media-docs y los
  greps. `./init.sh` lo corre el leader.
- Comandos: los de abajo, desde backend-pet-tracker/, con `FORCE_COLOR=0`
  y salida a fichero (no el `pnpm -C` de tasks.md).

== BASE ==

origin/main = 65f37841 al escribir este handoff y la branch ya lo
contiene: lo esperado es exit=0. Al arrancar: `git fetch origin` y
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main lo hace el leader. Nunca
rebasees ni mergees.

Desde backend-pet-tracker/:
- `test -d node_modules && echo presente` -> presente. Si no sale, PARA.
- `test -f ../.env && echo presente` -> presente. Los e2e leen ese .env
  (Postgres en 5433, base pet_tracker). NUNCA leas el .env, ni exportes
  DATABASE_URL, ni uses psql.

Chequeo PGREP (Postgres y LocalStack los comparten otras sesiones):
  test -z "$(pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep)" && echo libre
Va delante de CADA e2e y de la suite unit entera (la de la base y la del
cierre), SIEMPRE en una llamada SEPARADA: lee su salida y lanza la medida
solo si dice `libre`. Si no sale `libre`, espera 60 s y repitelo; nunca
lances sin `libre`. Abajo aparece como <PGREP>.

Comandos (desde backend-pet-tracker/):
  UNIT:   FORCE_COLOR=0 pnpm exec jest src/modules/media
  ALL:    FORCE_COLOR=0 pnpm test
  E2E:    FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/media-docs.e2e-spec.ts
  ESLINT: pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
  TSC:    pnpm exec tsc --noEmit -p tsconfig.json --pretty false
(E2E casa solo test/media-docs.e2e-spec.ts; con un solo fichero jest
imprime todos los titulos, verdes y rojos.)

Base, con FORCE_COLOR=0 y sin pipe, cada una con su `echo "exit=$?"`:
  UNIT   -> exit=0, `Test Suites: 12 passed, 12 total`,
            `Tests:       46 passed, 46 total` (medido por el leader)
  E2E    -> exit=0, `Tests:       32 passed, 32 total` (cierre de #161;
            el backend no ha cambiado desde entonces)
  ESLINT -> exit=0   TSC -> exit=0
  ALL    -> exit=0. Anota sus lineas `Test Suites:` y `Tests:` como
            BASE_SUITES y BASE_TESTS en el impl: el cierre las usa (en el
            veredicto de #161 fueron 1471 tests).
Tu medida manda. Con <PGREP> libre antes de E2E y de ALL, repitelas
todas. Si algo nace rojo o UNIT/E2E no dan esas cuentas, PARA.

== ANCLAS ==

Ejecutalas TODAS desde la RAIZ del worktree antes de tocar nada y copia
la salida al impl. A1-A21 y P1-P8 son las de requirements.md §Contexto
fijo; H1-H14 son del handoff. Solo estos comandos son anclas; los
numeros de linea no lo son. Si alguna no da EXACTAMENTE lo esperado, PARA
y avisa (ante una diferencia manda el fichero, no el handoff). Cuando
`grep -c` cuenta 0 sale con codigo 1: lo que vale es la cifra impresa.
El leader las ha ejecutado todas en H0 sacandolas de este mismo fichero.

A1. grep -cF "?.httpStatusCode === 404" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts   -> 1
A2. grep -cF '(error as { $metadata?: { httpStatusCode?: number } })?.$metadata' backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts   -> 1
A3. grep -cF "'NotFound'" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts   -> 0
A4. grep -cF "name: 'NotFound'," backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts   -> 1
A5. grep -cF "httpStatusCode: 404" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts   -> 1
A6. grep -cF "httpStatusCode: 403" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts   -> 1
A7. grep -cF "return Promise.all(" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts   -> 1
A8. grep -cF "Promise.resolve(" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts   -> 1
A9. grep -cF "setImmediate" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts   -> 0
A10. grep -cF ".where(and(eq(petDocuments.id, id), isNull(petDocuments.uploadedAt)));" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts   -> 1
A11. grep -cF "isNull(" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts   -> 1
A12. grep -cF "import { and, desc, eq, isNotNull, isNull, sql } from 'drizzle-orm';" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts   -> 1
A13. grep -cF "and(" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts   -> 3
A14. grep -cF "if (document.uploadedAt !== null) return;" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts   -> 1
A15. grep -cF "expect(mapPetDocumentError(missing)).toBe(missing);" backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts   -> 1
A16. grep -cF "code: 'PET_DOCUMENT_NOT_FOUND'," backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 3
A17. grep -cF "code: 'PET_DOCUMENT_NOT_UPLOADED'," backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
A18. grep -cF "PetDocumentDrizzleRepository" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 0
A19. grep -cF "import type { TokenService } from '@/modules/auth/domain/ports/token-service';" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
A20. grep -cF "subscriptions = new SubscriptionDrizzleRepository(db);" backend-pet-tracker/test/device-subscriptions.e2e-spec.ts   -> 1
A21. grep -cF "await new Promise((resolve) => setImmediate(resolve));" backend-pet-tracker/src/workers/poller.service.spec.ts   -> 2
P1. grep -rlF "markUploaded" backend-pet-tracker/test | wc -l   -> 0
P2. grep -rlF "markUploaded" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 4
P3. ls backend-pet-tracker/src/modules/media/infrastructure/repositories/ | wc -l   -> 1
P4. grep -rlF "drizzle.repository" backend-pet-tracker/src --include=*.spec.ts | wc -l   -> 5
P5. grep -rlF "drizzle.repository" backend-pet-tracker/test --include=*.e2e-spec.ts | wc -l   -> 1
P6. grep -rlF "DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 1
P7. grep -rlF "getObjectSize: jest.fn()," backend-pet-tracker/src | wc -l   -> 2
P8. grep -rlF "#162" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 0
H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-09)' specs/media-docs-download-test-locks/requirements.md   -> 1
H2. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H3. grep -cF "export interface PetDocumentListItem {" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts   -> 1
H4. grep -cF "constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}" backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts   -> 1
H5. grep -cF "  let db: NodePgDatabase;" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
H6. grep -cF "uploadedAt?: Date | null;" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
H7. grep -cF "describe('#161 R2: confirm contra LocalStack en la frontera de 10485760 bytes', () => {" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
H8. grep -cF "uploadedAt: timestamp('uploaded_at', { withTimezone: true })," backend-pet-tracker/src/db/schema/media.schema.ts   -> 1
H9. grep -cF "function buildDeps() {" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts   -> 1
H10. grep -cF "function document(id: string, date: string): PetDocument {" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts   -> 1
H11. grep -cF "const storage = { createDownloadUrl } as unknown as PhotoStorage;" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts   -> 1
H12. grep -cF '"test:e2e": "jest --config ./test/jest-e2e.json",' backend-pet-tracker/package.json   -> 1
H13. grep -cF "import { PetDocumentDrizzleRepository } from '@/modules/media/infrastructure/repositories/pet-document.drizzle.repository';" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 0
H14. grep -cF "useFakeTimers" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts   -> 0

Valores al cerrar (copialos al impl): A1, A2 y A3 sin cambios (M1 se
revierte en c2); A4 -> 2; A5 -> 2; A6 -> 2; A7 sin cambios; A8 sin
cambios; A9 -> 1; A10-A13 sin cambios (M3 se revierte en c6); A14-A17
sin cambios; A18 -> 2; A19-A21 sin cambios; P1 -> 1; P2 -> 5; P3 y P4
sin cambios; P5 -> 2; P6 y P7 sin cambios; P8 -> 3; H1-H10 sin cambios;
H11 -> 2; H12 sin cambios; H13 -> 1; H14 sin cambios. Y los nueve greps
de requirements.md R4, desde la raiz:
  R4a. grep -rlF "#162 R" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 3
  R4b. grep -cF "#162 R1 (" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts   -> 2
  R4c. grep -cF "name: 'NotFound'," backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts   -> 2
  R4d. grep -cF "#162 R2:" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts   -> 2
  R4e. grep -cF "Promise.resolve(" backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts   -> 1
  R4f. grep -rlF "DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 1
  R4g. grep -cF "#162 R3:" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 2
  R4h. grep -cF "PetDocumentDrizzleRepository" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 2
  R4i. grep -rlF "getObjectSize: jest.fn()," backend-pet-tracker/src | wc -l   -> 2

== COMMITS ==

Todo desde backend-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la
cadena (en #115 se commiteo un verde con el registrador en exit=1). Si
una cadena no llega al commit, PARA y reporta en el impl el eslabon que
fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). Cada medida lleva
su `echo "exit=$?"`; anota el exit en el impl. Tras CADA medida abre el
log y copia al impl cada it rojo con su matcher y su Expected/Received
(o Received promise …).

-- c1/c2 R1: el adapter decide el 404 por status, no por name --

c1 rojo (tasks.md R1 (1): describe `#162 R1` con 2 its al final de
photo-storage.object-exists.spec.ts, con buildDeps() y la key
'pets/p/docs/d'; y M1 en photo-storage.s3.adapter.ts: la condicion
entera del `if` del catch de getObjectSize, que hoy ocupa tres lineas
desde `(error as { $metadata?: …` hasta `?.httpStatusCode === 404`,
pasa a `(error as { name?: string })?.name === 'NotFound'`. El
comentario `// ponytail:`, el `return null;` y el `throw error;` no
cambian):
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/162-r1.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 1 failed, 11 passed, 12 total` y
       `Tests:       2 failed, 46 passed, 48 total`
       (`#162 R1 (a)` con `Received promise rejected instead of resolved`
       y `#162 R1 (b)` con `Received promise resolved instead of
       rejected`; los 6 its de #157 R7 y #161 R1 siguen verdes)
  grep -qE '^Tests: +2 failed, 46 passed, 48 total$' /tmp/162-r1.txt \
    && grep -qE '^Test Suites: +1 failed, 11 passed, 12 total$' /tmp/162-r1.txt \
    && grep -qE '● .*#162 R1 \(a\): resuelve null con un 404 sin name NotFound' /tmp/162-r1.txt \
    && grep -qE '● .*#162 R1 \(b\): relanza un error con name NotFound y httpStatusCode 403' /tmp/162-r1.txt \
    && grep -qF 'Received promise rejected instead of resolved' /tmp/162-r1.txt \
    && grep -qF 'Received promise resolved instead of rejected' /tmp/162-r1.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/162-r1.txt \
    && test "$(grep -cF '#162 R1 (' src/modules/media/infrastructure/photo-storage.object-exists.spec.ts)" = 2 \
    && test "$(grep -cF "name: 'NotFound'," src/modules/media/infrastructure/photo-storage.object-exists.spec.ts)" = 2 \
    && test "$(grep -cF '?.httpStatusCode === 404' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 0 \
    && test "$(grep -cF "(error as { name?: string })?.name === 'NotFound'" src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 1 \
    && test "$(grep -cF '// ponytail: sin s3:ListBucket' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/infrastructure/photo-storage.object-exists.spec.ts src/modules/media/infrastructure/photo-storage.s3.adapter.ts \
    && git add src/modules/media/infrastructure/photo-storage.object-exists.spec.ts src/modules/media/infrastructure/photo-storage.s3.adapter.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts ' \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'test(media): red getObjectSize decides 404 by status (#162 R1)'
  (`git diff --quiet -- .` y `git ls-files --others` tras el add: nada
  sin stagear ni sin trackear en backend-pet-tracker/. El impl vive fuera
  y sigue sin trackear hasta c7.)

c2 verde (tasks.md R1 (2): SOLO revierte M1):
  git show <H0>:backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts > src/modules/media/infrastructure/photo-storage.s3.adapter.ts
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/162-g1.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +48 passed, 48 total$' /tmp/162-g1.txt \
    && grep -qE '^Test Suites: +12 passed, 12 total$' /tmp/162-g1.txt \
    && test "$(grep -cF '?.httpStatusCode === 404' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 1 \
    && test "$(grep -cF "'NotFound'" src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 0 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/infrastructure/photo-storage.s3.adapter.ts \
    && git add src/modules/media/infrastructure/photo-storage.s3.adapter.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts ' \
    && git diff --cached --quiet <H0> -- src/modules/media/infrastructure/photo-storage.s3.adapter.ts \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'feat(media): revert M1, 404 stays decided by status (#162 R1)'
  (`git diff --cached --quiet <H0> -- <adapter>`: el adapter vuelve byte a
  byte a H0, que es lo que pide tasks.md R1 (2).)

-- c3/c4 R2: la lista conserva el orden del repositorio --

c3 rojo (tasks.md R2 (1): describe `#162 R2` con 1 it al final de
list-pet-documents.use-case.spec.ts, con los pasos 1-9 de tasks.md en
ese orden y sin imports nuevos; y M2 en list-pet-documents.use-case.ts
tal cual la escribe tasks.md, usando el tipo PetDocumentListItem que ya
exporta ese fichero (ancla H3). Sin jest.useFakeTimers ni setTimeout):
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/162-r2.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 1 failed, 11 passed, 12 total` y
       `Tests:       1 failed, 48 passed, 49 total`
       (`#162 R2` en el `resolves.toEqual` del paso 9, con `b` primero en
       Received; #157 R3 y #157 R4 siguen verdes)
  grep -qE '^Tests: +1 failed, 48 passed, 49 total$' /tmp/162-r2.txt \
    && grep -qE '^Test Suites: +1 failed, 11 passed, 12 total$' /tmp/162-r2.txt \
    && grep -qE '● .*#162 R2: la URL del segundo documento resuelve antes que la del primero y la lista sigue a, b' /tmp/162-r2.txt \
    && grep -qF 'expect(received).resolves.toEqual(expected)' /tmp/162-r2.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module|Exceeded timeout' /tmp/162-r2.txt \
    && test "$(grep -cF '#162 R2:' src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts)" = 2 \
    && test "$(grep -cF 'Promise.resolve(' src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts)" = 1 \
    && test "$(grep -cF 'setImmediate' src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts)" = 1 \
    && test "$(grep -cF 'useFakeTimers' src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts)" = 0 \
    && test "$(grep -cF 'return Promise.all(' src/modules/media/application/use-cases/list-pet-documents.use-case.ts)" = 0 \
    && test "$(grep -cF 'items.push({ document, downloadUrl });' src/modules/media/application/use-cases/list-pet-documents.use-case.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts src/modules/media/application/use-cases/list-pet-documents.use-case.ts \
    && git add src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts src/modules/media/application/use-cases/list-pet-documents.use-case.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts ' \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'test(media): red list keeps repository order on out-of-order URLs (#162 R2)'
  (`setImmediate` = 1: solo la definicion de `drain`. Si el rojo sale por
  la asercion de `mock.calls` del paso 6 o por timeout, la sincronizacion
  esta mal escrita: PARA y reportalo, no la cambies.)

c4 verde (tasks.md R2 (2): SOLO revierte M2):
  git show <H0>:backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts > src/modules/media/application/use-cases/list-pet-documents.use-case.ts
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/162-g2.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +49 passed, 49 total$' /tmp/162-g2.txt \
    && grep -qE '^Test Suites: +12 passed, 12 total$' /tmp/162-g2.txt \
    && test "$(grep -cF 'return Promise.all(' src/modules/media/application/use-cases/list-pet-documents.use-case.ts)" = 1 \
    && test "$(grep -cF 'items.push(' src/modules/media/application/use-cases/list-pet-documents.use-case.ts)" = 0 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/application/use-cases/list-pet-documents.use-case.ts \
    && git add src/modules/media/application/use-cases/list-pet-documents.use-case.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts ' \
    && git diff --cached --quiet <H0> -- src/modules/media/application/use-cases/list-pet-documents.use-case.ts \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'feat(media): revert M2, list keeps index order (#162 R2)'

-- c5/c6 R3: markUploaded no pisa un documento ya confirmado --

c5 rojo (tasks.md R3 (1): el import de E1 justo despues de la linea de
A19, y el describe `#162 R3` con 1 it al final del describe raiz del
e2e, pasos 1-5 de tasks.md; y M3 en pet-document.drizzle.repository.ts,
los dos cambios de tasks.md: el `.where(...)` de markUploaded y el
import sin `isNull`. M3 NO toca `eq(petDocuments.id, id)`: sin ese
filtro el UPDATE marcaria todas las filas pendientes de la base
compartida):
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/162-r3.txt 2>&1; echo "exit=$?"
    -> exit=0, `Tests:       49 passed, 49 total` (ningun unit usa el
       repositorio)
  <PGREP> (llamada aparte; sigue solo con `libre`)
  FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/media-docs.e2e-spec.ts > /tmp/162-r3-e2e.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 32 passed, 33 total`
       (`#162 R3` en el `toEqual` del paso 5; Received = la hora de la
       corrida)
  grep -qE '^Tests: +49 passed, 49 total$' /tmp/162-r3.txt \
    && grep -qE '^Tests: +1 failed, 32 passed, 33 total$' /tmp/162-r3-e2e.txt \
    && grep -qE '● .*#162 R3: con uploaded_at 2026-10-01T10:00:00.000Z, markUploaded deja la fila igual' /tmp/162-r3-e2e.txt \
    && grep -qF 'expect(received).toEqual(expected)' /tmp/162-r3-e2e.txt \
    && ! grep -qE 'Test suite failed to run|Cannot find module' /tmp/162-r3-e2e.txt \
    && test "$(grep -cF '#162 R3:' test/media-docs.e2e-spec.ts)" = 2 \
    && test "$(grep -cF 'PetDocumentDrizzleRepository' test/media-docs.e2e-spec.ts)" = 2 \
    && test "$(git diff -U0 <H0> -- test/media-docs.e2e-spec.ts | grep -cE '^-([^-]|$)')" = 0 \
    && test "$(grep -cF 'isNull(' src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts)" = 0 \
    && test "$(grep -cF 'and(' src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts)" = 2 \
    && test "$(grep -cF '.where(eq(petDocuments.id, id));' src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts)" = 1 \
    && test "$(grep -cF "import { and, desc, eq, isNotNull, sql } from 'drizzle-orm';" src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check test/media-docs.e2e-spec.ts src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts \
    && git add test/media-docs.e2e-spec.ts src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts backend-pet-tracker/test/media-docs.e2e-spec.ts ' \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'test(media): red markUploaded keeps confirmed uploaded_at (#162 R3)'
  (El eslabon `git diff -U0 <H0> … | grep -cE '^-…'` = 0 comprueba E1:
  en el e2e solo hay lineas anadidas, ninguna borrada ni cambiada. Si el
  e2e falla por conexion (5433 o 4566), PARA y reportalo. La cuenta
  `1 failed, 32 passed` mas la cabecera y el matcher de R3 ya prueban
  que el rojo es por asercion: los logs de Nest del e2e no se grepean.)

c6 verde (tasks.md R3 (2): SOLO revierte M3):
  git show <H0>:backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts > src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/162-g3.txt 2>&1; echo "exit=$?"
  <PGREP> (llamada aparte; sigue solo con `libre`)
  FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/media-docs.e2e-spec.ts > /tmp/162-g3-e2e.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +49 passed, 49 total$' /tmp/162-g3.txt \
    && grep -qE '^Tests: +33 passed, 33 total$' /tmp/162-g3-e2e.txt \
    && test "$(grep -cF '.where(and(eq(petDocuments.id, id), isNull(petDocuments.uploadedAt)));' src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts)" = 1 \
    && test "$(grep -cF "import { and, desc, eq, isNotNull, isNull, sql } from 'drizzle-orm';" src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts \
    && git add src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts ' \
    && git diff --cached --quiet <H0> -- src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'feat(media): revert M3, markUploaded keeps the first confirm (#162 R3)'

== CIERRE ==

Desde backend-pet-tracker/, sin pipe, con salida al impl:
- <PGREP> libre (llamada aparte); despues
  `FORCE_COLOR=0 pnpm test > /tmp/162-all.txt 2>&1; echo "exit=$?"`
    -> exit=0, Test Suites = BASE_SUITES (no hay ficheros de test nuevos)
       y Tests = BASE_TESTS + 3 (2 de R1 y 1 de R2), todo passed.
       Mientras corre, no lances otra cosa.
- El e2e de media-docs ya corrio en c6 (33 passed): no lo repitas.
- TSC -> exit=0.
- `pnpm run lint > /tmp/162-lint.txt 2>&1; echo "exit=$?"` -> exit=0 (este
  SI lleva --fix) y despues `git status --short -- .` -> vacio (solo
  backend-pet-tracker/). Si --fix reescribio algo, PARA y reporta que
  fichero y que cambio: no lo commitees sin decirlo.
Desde la raiz del repo:
- Las anclas A, P y H con sus valores de cierre, y R4a-R4i.
- `git diff --name-only <H0> HEAD -- backend-pet-tracker`   -> exactamente
  estas 3 rutas (el diff neto de produccion es cero):
    backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts
    backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts
    backend-pet-tracker/test/media-docs.e2e-spec.ts
- `git diff --name-only <H0> HEAD -- infra mobile-pet-tracker`   -> vacio

Despues rellena specs/media-docs-download-test-locks/traceability.md: en
cada fila, quita el «pendiente — » del principio de la columna Test
(deja el nombre del test) y pon en la columna Commit hash corto +
mensaje, `rojo → verde`: R1 c1 → c2; R2 c3 → c4; R3 c5 → c6; R4
`sin commit propio: impl §Verificación R4 (./init.sh y las sondas los
corren el leader y el reviewer)`. No toques su frontmatter. El impl
lleva una seccion `## Verificación R4` con lint y unit entera (comando,
exit, lineas de resumen), el e2e de c6, los nueve greps R4a-R4i, los
dos diffs, y la linea `./init.sh: pendiente del leader`.
Commit final, desde la raiz:
  git add specs/media-docs-download-test-locks/traceability.md progress/impl_media-docs-download-test-locks.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_media-docs-download-test-locks.md specs/media-docs-download-test-locks/traceability.md ' \
    && git commit -m 'docs(media-docs-download-test-locks): traceability (#162)'
Despues, la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_media-docs-download-test-locks.md' ':!specs/media-docs-download-test-locks/requirements.md' ':!specs/media-docs-download-test-locks/design.md' ':!specs/media-docs-download-test-locks/tasks.md' ':!progress/review_media-docs-download-test-locks.md'
    -> exactamente los 5 ficheros de abajo
y un ultimo commit, desde la raiz:
  git commit --only progress/impl_media-docs-download-test-locks.md -m 'docs(media-docs-download-test-locks): closed file list (#162)'
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md y docs/conventions.md (§Tests,
  §Commits). Esta feature no cambia ninguna capa.
- Prefijo `#162 R<n>:` en todo describe/it nuevo, con los titulos
  literales de tasks.md.
- Valores esperados LITERALES en los tests (`3600`, `signed:${key}`,
  `2026-10-01T10:00:00.000Z`, `404`, `403`, `'NotFound'`). Ningun test
  importa DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS (R4f lo comprueba).
- Ningun doble tipado PhotoStorage cambia (R4i) y ningun test existente
  cambia (solo E1, una linea anadida).
- NO lances ./init.sh, ni `pnpm run test:e2e` con o sin argumentos, ni
  otro e2e que no sea test/media-docs.e2e-spec.ts, ni `docker compose`
  ni `provision:local`: Postgres y LocalStack los comparten otras
  sesiones y el gate lo corre el leader.
- NO corras las sondas S1a-S3a ni P16 de tasks.md: son del reviewer.
- Ni recursos AWS reales ni cdk: nada de esta feature corre contra AWS.
- Ni `pnpm add`, ni cambios en package.json ni pnpm-lock.yaml.
- No toques ningun fichero fuera de la lista de abajo. Los tres de
  produccion (adapter, use case de list y repositorio) solo cambian en
  su commit rojo y vuelven a H0 en su verde.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter y las casillas de
  §Aprobacion de requirements.md, design.md y tasks.md. Los escribe el
  leader o el humano. Todo lo que tengas que contar va en
  progress/impl_media-docs-download-test-locks.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias:
  en el diff neto (5, ni uno mas):
    backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.spec.ts
    backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts
    backend-pet-tracker/test/media-docs.e2e-spec.ts
    progress/impl_media-docs-download-test-locks.md
    specs/media-docs-download-test-locks/traceability.md
  solo de forma transitoria (rojo -> verde, vuelven a H0):
    backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts (M1)
    backend-pet-tracker/src/modules/media/application/use-cases/list-pet-documents.use-case.ts (M2)
    backend-pet-tracker/src/modules/media/infrastructure/repositories/pet-document.drizzle.repository.ts (M3)
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R3 de requirements.md, y R4 en lo que te
toca (lint, unit entera, e2e de media-docs, greps, diffs, lista
cerrada). ./init.sh es del leader.

Al terminar, progress/impl_media-docs-download-test-locks.md debe tener:
pwd, branch, H0 y status; el exit de is-ancestor; node_modules y .env
(presentes); la salida de las anclas (A1-A21, P1-P8, H1-H14) en H0 y la
de cierre, mas R4a-R4i; la base con su exit (UNIT, E2E, ESLINT, TSC, ALL
con BASE_SUITES y BASE_TESTS); la salida de cada `prettier --write`; los
7 commits con hash y R-id (y el de la lista cerrada); por cada rojo, el
comando, las lineas `Test Suites:` y `Tests:`, el exit y cada it rojo
con su matcher y Expected/Received; cada verde con sus lineas de
resumen, TSC y ESLINT; cada <PGREP> que no salio `libre` y cuanto
esperaste; el cierre (ALL, TSC, lint con --fix y status vacio, diffs,
lista cerrada); la seccion `## Verificación R4`; y cualquier decision
que la spec no cerrara literalmente.
```
