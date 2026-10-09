# Handoff a Codex CLI — #161 media-docs-confirm-size-limit

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (aprobación vía
> Notion el 2026-10-08, página `3f36115a-9b27-8129-816d-ee3dd122683e`;
> commit de firma `c2676ab6`). Feature 100 % backend: `getObjectSize`
> sustituye a `objectExists` en el puerto de storage, el confirm rechaza
> objetos de más de 10485760 bytes con 409 `PET_DOCUMENT_TOO_LARGE`, y un
> HEAD sin `ContentLength` falla cerrado. Son 7 commits: tres pares
> rojo/verde (R1, R2, R3) y uno final de trazabilidad.
>
> **Corrección del leader sobre tasks.md** (sin enmienda de spec: no cambia
> ningún fichero, it ni aserción). tasks.md R1 (1) y R2 (1) dicen que el
> rojo es de compilación de ts-jest. No lo es: `backend-pet-tracker/tsconfig.json`
> fija `"isolatedModules": true`, y con eso ts-jest 29.4 solo transpila, sin
> comprobar tipos (precedentes: handoffs de #103 y #145). El símbolo de
> producción que falta cae en jest como `TypeError` en tiempo de ejecución,
> y los errores de tipos los ve `tsc`. La causa es la que declara tasks.md
> (un símbolo de producción que aún no existe, no un helper de test). Por
> eso, en los dos rojos (c1 y c3), las cadenas comprueban qué ficheros dan
> error en `tsc` en lugar de exigir exit 0.
>
> **Enmienda L1 (2026-10-09), tras la parada de Codex en c1.** La cadena de
> c1 falló en eslint por tres errores `prettier/prettier` en
> `confirm-pet-document-upload.use-case.spec.ts`. El renombrado E2 alarga
> tres desestructuraciones de `buildDeps()` por encima del ancho de línea.
> Un cuarto error, en `photo-storage.object-exists.spec.ts` (E1 alarga
> `.resolves.toBe(10485761)`), quedaba oculto por el `--ignore-pattern` y
> habría parado c2. Arreglo: `prettier --write` sobre los ficheros de cada
> commit antes de medir, y `prettier --check` como eslabón de cada cadena.
> Ninguna aserción, título ni cuenta cambia. Prompt de reanudación: §RETOMAR
> al final del bloque.
>
> **Enmienda L2 (2026-10-09), tras la parada de Codex en c3.** Error de
> cuenta del leader: c2 deja 41 tests y c3 añade 3 (2 del confirm y 1 del
> mapper), así que el rojo de c3 es `2 failed, 42 passed, 44 total` y no
> `41 passed, 43 total`. Las cuentas de c4 (44), c5 (46), c6 (46) y del
> cierre (+8) ya estaban bien. El leader repitió sobre los logs de Codex
> todos los eslabones de c3 anteriores al `git add`, ya con 44: pasan.
>
> **Comparte Postgres (`pet_tracker`, 5433) y LocalStack con Backend (#155,
> wt-155) e IA PET (#18, wt-18).** Por eso hay un `pgrep` antes de cada e2e
> y de la suite unit entera. `node_modules` y `.env` ya están en el
> worktree.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-161   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_media-docs-confirm-size-limit.md.
El hash es H0 (el commit que anade este handoff), y es tambien el
«hash-handoff» de requirements.md R4 y tasks.md R4 (2). En todos los
comandos de abajo, sustituye `<H0>` por ese hash literal. PARA si la
branch no es feature/161-media-docs-confirm-size-limit o si
`git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-18, Pet-Tracker-wt-155, Pet-Tracker-wt-backend,
Pet-Tracker-wt-ui ni ningun otro worktree, ni cambies de branch en ninguno.

Feature: media-docs-confirm-size-limit (#161)
Branch: feature/161-media-docs-confirm-size-limit
Spec aprobada: specs/media-docs-confirm-size-limit/requirements.md
(status: approved, firma c2676ab6). Q1-Q3 y DA1-DA6 estan cerradas con su
valor por defecto (limite 10485760 bytes, el objeto se queda en el bucket,
409 PET_DOCUMENT_TOO_LARGE, ContentLength ausente falla cerrado): no
reabras ninguna.
Lee tambien, enteros: specs/media-docs-confirm-size-limit/design.md (sus
nombres de simbolo y sus mensajes son EXACTOS), tasks.md y traceability.md.
tasks.md es tu guion. Los titulos de describe e it son LITERALES de
tasks.md: copialos tal cual, con sus tildes y simbolos (`…`, `(a)`).
Los cambios a tests existentes son SOLO los de requirements.md §Tests
existentes que cambian (E1-E5), y cada uno solo como alli se describe.

== QUE HACES ==

Los 7 commits, en este orden exacto:
c1 rojo R1, c2 verde R1, c3 rojo R2, c4 verde R2, c5 rojo R3,
c6 verde R3, y c7 de trazabilidad. Rojo SIEMPRE antes de su verde, en
commits separados (C4 de CHECKPOINTS.md; en #19 se metio todo en un solo
commit y no vale). Los mensajes de commit son los de tasks.md (ya en
ingles) y van literales en las cadenas de abajo.

Esto manda sobre tasks.md:
- REDS SIN COMPILAR (correccion del leader). tasks.md R1 (1) y R2 (1)
  dicen «ts-jest no compila». Es falso: tsconfig.json tiene
  `"isolatedModules": true` (ancla H11) y ts-jest solo transpila, sin
  comprobar tipos. Lo que veras de verdad:
    c1: los 6 its de photo-storage.object-exists.spec.ts fallan con
        `TypeError: storage.getObjectSize is not a function`, y 3 its del
        confirm (`#157 R5: pendiente …`, `#157 R6 (d)` y `#157 R6 (g)`)
        fallan porque el use case aun llama a
        `this.storage.objectExists`, que el doble de E2 ya no tiene.
        create-pet-document y request-photo-upload-url pasan en jest
        (su doble no se llama), pero dan error en tsc (TS2353).
    c3: el it del mapper falla con
        `TypeError: …PetDocumentTooLargeError is not a constructor`; el
        confirm `#161 R2 (b)` y el e2e `#161 R2 (b)` fallan por asercion.
  Es la causa que declara tasks.md (falta un simbolo de PRODUCCION, no un
  helper de test). Ningun fichero, it ni asercion cambia por esto. En c1 y
  c3, tsc y eslint NO salen con exit 0. La cadena comprueba que los errores
  de tsc estan exactamente en los ficheros esperados y pasa eslint al resto
  con exit 0. En c2, c4, c5 y c6, tsc y eslint salen con exit 0.
- `new PetDocumentTooLargeError()` del spec del mapper va DENTRO del it,
  nunca a nivel de modulo ni en un describe. Si va fuera, la suite entera
  revienta («Test suite failed to run») y las cuentas no cuadran.
- Sin commits `refactor(...)`: tasks.md (3) de cada R se cumple diciendo
  en el impl que no hizo falta. Un commit de mas cambia las cuentas.
- Trazabilidad: traceability.md se rellena entera UNA vez, en c7. Ningun
  commit de c1-c6 la toca.
- Lint: en las cadenas va `pnpm exec eslint` SIN `--fix`. `pnpm run lint`
  lleva `--fix` y reescribe ficheros: se corre UNA vez, en el cierre.
- FORMATO (enmienda L1 del leader, 2026-10-09). En cada commit c1-c6,
  ANTES de sus medidas, ejecuta
  `pnpm exec prettier --write <los ficheros de su git add>` (exactamente
  esos, nunca un glob). Cada cadena lleva el eslabon
  `pnpm exec prettier --check <mismos ficheros>` delante del `git add`.
  Prettier solo parte lineas largas (el renombrado de E1/E2 alarga
  `.resolves.toBe(10485761)` y las desestructuraciones de `buildDeps()`):
  no cambia ningun literal, titulo ni asercion, y no se considera
  desviacion de E1-E5. Copia al impl la salida de cada `--write`.
- R4: tu corres lint, la suite unit entera y los e2e FILTRADOS de abajo.
  `pnpm run test:e2e` completo y `./init.sh` los corre el leader, porque
  comparten Postgres y LocalStack con otras sesiones.
- Comandos: los de abajo, desde backend-pet-tracker/, con `FORCE_COLOR=0`
  y salida a fichero (no el `pnpm -C` de tasks.md §Reglas).

== BASE ==

origin/main = 58323e49 al escribir este handoff y la branch sale de ahi:
lo esperado es exit=0. Al arrancar: `git fetch origin` y
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main lo hace el leader. Nunca
rebasees ni mergees.

Desde backend-pet-tracker/:
- `test -d node_modules && echo presente` -> presente. Si no sale,
  `pnpm install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test -f ../.env && echo presente` -> presente. Los e2e leen ese .env
  (Postgres en 5433, base pet_tracker). NUNCA exportes DATABASE_URL ni
  uses psql.

Chequeo PGREP (Postgres y LocalStack los comparten otras dos sesiones):
  test -z "$(pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep)" && echo libre
Va delante de CADA e2e y de la suite unit entera (la del arranque y la
del cierre). Si no sale `libre`, otra sesion esta usando la base: espera
60 s y repitelo; nunca lances sin `libre`. Abajo aparece como <PGREP>.

Comandos (desde backend-pet-tracker/):
  UNIT:   FORCE_COLOR=0 pnpm exec jest src/modules/media
  ALL:    FORCE_COLOR=0 pnpm test
  E2E:    FORCE_COLOR=0 pnpm run test:e2e -- media-docs
  E2E-M:  FORCE_COLOR=0 pnpm run test:e2e -- 'test/media\.e2e'
  ESLINT: pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
  TSC:    pnpm exec tsc --noEmit -p tsconfig.json --pretty false
(`media-docs` solo casa test/media-docs.e2e-spec.ts; `test/media\.e2e`
solo casa test/media.e2e-spec.ts.)

Base medida por el leader el 2026-10-08 en este worktree (backend
identico a H0), con FORCE_COLOR=0 y sin pipe, todos exit=0:
  UNIT    Test Suites: 11 passed, 11 total
          Tests:       38 passed, 38 total
          (object-exists 3, confirm 6, create 2, request-photo-upload-url 2,
           list 2, create-pet-document.dto 8, request-photo-upload-url.dto 8,
           s3.adapter 2, presign-host 2, photo-key 2, document-key 1)
  ESLINT exit=0 (unos 40 s)   TSC exit=0
  E2E 30 passed y E2E-M 12 passed: medidos en el cierre de #157 (c11);
  el backend no ha cambiado desde entonces.
Tu medida manda: con <PGREP> libre, repite UNIT, E2E, E2E-M, ESLINT, TSC
y ALL, y anota las lineas `Test Suites:` y `Tests:` de ALL como
BASE_SUITES y BASE_TESTS en el impl: el cierre las usa. Si algo nace
rojo, PARA.

== ANCLAS ==

Ejecutalas TODAS desde la RAIZ del worktree antes de tocar nada y copia
la salida al impl. Son las de requirements.md §Contexto fijo (A),
design.md (D) y las del handoff (H). Solo estos comandos son anclas; los
numeros de linea no lo son. Si alguna no da EXACTAMENTE lo esperado, PARA
y avisa (ante una diferencia manda el fichero, no el handoff). Cuando
`grep -c` cuenta 0 sale con codigo 1: lo que vale es la cifra impresa.
El leader las ha ejecutado todas en H0 sacandolas de este mismo fichero.

A1. grep -cF "objectExists(key: string): Promise<boolean>;" backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts   -> 1
A2. grep -cF "if (!(await this.storage.objectExists(document.key))) {" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts   -> 1
A3. grep -cF "if (document.uploadedAt !== null) return;" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts   -> 1
A4. grep -cF "code: 'PET_DOCUMENT_NOT_UPLOADED'," backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts   -> 1
A5. grep -cF "import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';" backend-pet-tracker/test/media-docs.e2e-spec.ts   -> 1
A6. ls backend-pet-tracker/src/modules/media/infrastructure/mappers/ | wc -l   -> 2
A7. grep -rlF "ContentLength" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 0
A8. grep -rlF "DeleteObjectCommand" backend-pet-tracker/src | wc -l   -> 0
A9. grep -cE "grant|Role|PolicyStatement" infra/lib/pet-tracker-dev-stack.ts   -> 0
A10. grep -rlF "getObjectSize" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 0
A11. grep -rlF "PET_DOCUMENT_MAX_BYTES" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 0
A12. grep -rlF "PET_DOCUMENT_TOO_LARGE" backend-pet-tracker mobile-pet-tracker/src --include=*.ts | wc -l   -> 0
A13. grep -rlF "objectExists" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 7
A14. grep -cF "objectExists" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts   -> 4
A15. grep -cF "objectExists" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts   -> 19
A16. grep -cF "objectExists: jest.fn()," backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts   -> 1
A17. grep -cF "objectExists: jest.fn()," backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts   -> 1
D1. grep -cF "throw mapPetDocumentError(error);" backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts   -> 1
D2. grep -cF "export const DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS = 600;" backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.ts   -> 1
H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-08)' specs/media-docs-confirm-size-limit/requirements.md   -> 1
H2. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H3. grep -cF "// ponytail: sin s3:ListBucket" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts   -> 1
H4. test ! -e backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts && echo ok   -> ok
H5. grep -cF "export class Pet" backend-pet-tracker/src/modules/media/domain/errors/pet-document.errors.ts   -> 2
H6. grep -cF "return error;" backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts   -> 1
H7. grep -cF "  NotFoundException," backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts   -> 1
H8. grep -cF "throw new PetDocumentNotUploadedError();" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts   -> 1
H9. grep -cF "const send = jest.fn<Promise<unknown>, [HeadObjectCommand]>();" backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts   -> 1
H10. grep -cF "const objectExists = jest.fn().mockResolvedValue(true);" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts   -> 1
H11. grep -cF '"isolatedModules": true,' backend-pet-tracker/tsconfig.json   -> 1
H12. grep -cF "testTimeout" backend-pet-tracker/test/jest-e2e.json   -> 0

Valores al cerrar (copialos al impl): A1 -> 0; A2 -> 0; A3 y A4 sin
cambios; A5 -> 0 (E5 cambia ese import); A6 -> 3; A7 -> 4 o 5 (adapter, su
spec, el spec del confirm y el e2e; y el spec del mapper si su `missing`
lleva el mensaje de R1 (b): anota la lista de `grep -rlF`); A8 y A9 sin cambios; A10 -> 7; A11 -> 1; A12 -> 3;
A13-A17 -> 0; D1 y D2 sin cambios; H1 y H2 sin cambios; H3 sin cambios;
H4: el fichero existe (`test -e … && echo ok` -> ok); H5 -> 3; H6, H7 y H8
sin cambios (M3a y M3b se revierten en c6); H9 sin cambios; H10 -> 0;
H11 y H12 sin cambios. Y los ocho greps de requirements.md R4, desde la
raiz:
  R4a. grep -rlF "objectExists" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 0
  R4b. grep -rlF "getObjectSize" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 7
  R4c. grep -cF "getObjectSize(key: string): Promise<number | null>;" backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts   -> 1
  R4d. grep -cF "export const PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;" backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts   -> 1
  R4e. grep -rlF "PET_DOCUMENT_MAX_BYTES" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 1
  R4f. grep -rlF "PET_DOCUMENT_TOO_LARGE" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 3
  R4g. grep -rlF "HeadObjectCommand" backend-pet-tracker/src backend-pet-tracker/test | wc -l   -> 3
  R4h. grep -rlF "DeleteObjectCommand" backend-pet-tracker/src | wc -l   -> 0

== COMMITS ==

Todo desde backend-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la
cadena (en #115 se commiteo un verde con el registrador en exit=1). Si
una cadena no llega al commit, PARA y reporta en el impl el eslabon que
fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Cada medida lleva su
`echo "exit=$?"`; anota el exit en el impl. Tras CADA medida abre el log
y copia al impl cada it rojo con su matcher y su Expected/Received (o el
TypeError, en c1 y c3).

TSFILES es este extractor (da la lista ordenada de ficheros con error de
tsc, separados por espacio y con espacio final):
  grep -oE '^[^(]+\([0-9]+,[0-9]+\): error TS' <log> | sed -E 's/\(.*//' | LC_ALL=C sort -u | tr '\n' ' '

-- c1/c2 R1: getObjectSize sustituye a objectExists --

c1 rojo (tasks.md R1 (1): E1 + describe `#161 R1` con 3 its en
object-exists.spec.ts reutilizando su buildDeps(), E2, E3 y E4. Solo esos
cuatro ficheros de test; nada de produccion):
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/161-r1.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 2 failed, 9 passed, 11 total` y
       `Tests:       9 failed, 32 passed, 41 total`
       (6 de object-exists por TypeError + 3 del confirm, ver arriba)
  pnpm exec tsc --noEmit -p tsconfig.json --pretty false > /tmp/161-r1-tsc.txt 2>&1; echo "exit=$?"
    -> exit=2
  grep -qE '^Tests: +9 failed, 32 passed, 41 total$' /tmp/161-r1.txt \
    && grep -qE '^Test Suites: +2 failed, 9 passed, 11 total$' /tmp/161-r1.txt \
    && grep -qF 'storage.getObjectSize is not a function' /tmp/161-r1.txt \
    && grep -qF 'this.storage.objectExists is not a function' /tmp/161-r1.txt \
    && ! grep -qE 'Test suite failed to run|ReferenceError|SyntaxError|Cannot find module' /tmp/161-r1.txt \
    && test "$(grep -oE '^[^(]+\([0-9]+,[0-9]+\): error TS' /tmp/161-r1-tsc.txt | sed -E 's/\(.*//' | LC_ALL=C sort -u | tr '\n' ' ')" = 'src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts src/modules/media/infrastructure/photo-storage.object-exists.spec.ts ' \
    && test "$(grep -rlF 'objectExists' src test | wc -l)" = 3 \
    && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" --ignore-pattern 'src/modules/media/infrastructure/photo-storage.object-exists.spec.ts' \
    && pnpm exec prettier --check src/modules/media/infrastructure/photo-storage.object-exists.spec.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts \
    && git add src/modules/media/infrastructure/photo-storage.object-exists.spec.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts ' \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'test(media): red getObjectSize replaces objectExists (#161 R1)'
  (`grep -rlF objectExists src test` -> 3: quedan el puerto, el adapter y
  el use case, que cambian en c2. `git diff --quiet -- .` y
  `git ls-files --others` tras el add: nada sin stagear ni sin trackear en
  backend-pet-tracker/.)

c2 verde (tasks.md R1 (2): puerto, adapter segun R1 (a)-(d) y design.md
§D1-D2, conservando el comentario `// ponytail:` del 403, y use case con
`getObjectSize` donde `null` lanza PetDocumentNotUploadedError como hoy.
TODAVIA SIN LIMITE. La comprobacion de D2 es
`typeof ContentLength !== 'number'`, nunca un falsy-check):
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/161-g1.txt 2>&1; echo "exit=$?"
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/161-g1-e2e.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +41 passed, 41 total$' /tmp/161-g1.txt \
    && grep -qE '^Tests: +30 passed, 30 total$' /tmp/161-g1-e2e.txt \
    && test "$(grep -rlF 'objectExists' src test | wc -l)" = 0 \
    && test "$(grep -cF 'getObjectSize(key: string): Promise<number | null>;' src/modules/media/domain/ports/photo-storage.ts)" = 1 \
    && test "$(grep -cF '// ponytail: sin s3:ListBucket' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 1 \
    && test "$(grep -cF 'new HeadObjectCommand(' src/modules/media/infrastructure/photo-storage.s3.adapter.ts)" = 1 \
    && test "$(grep -rlF 'PET_DOCUMENT_MAX_BYTES' src test | wc -l)" = 0 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/domain/ports/photo-storage.ts src/modules/media/infrastructure/photo-storage.s3.adapter.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts \
    && git add src/modules/media/domain/ports/photo-storage.ts src/modules/media/infrastructure/photo-storage.s3.adapter.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts ' \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'feat(media): getObjectSize reads ContentLength from HEAD (#161 R1)'
  (El e2e de c2 comprueba los 30 tests de #157 con el HEAD real contra
  LocalStack: el confirm ya pasa por getObjectSize.)

-- c3/c4 R2: limite de 10485760 bytes en el confirm --

c3 rojo (tasks.md R2 (1) entero: describe `#161 R2` del confirm con 2
its; el spec NUEVO del mapper con 1 it; E5 y describe e2e `#161 R2` con
2 its, cada uno con `30000` como tercer argumento de `it`. Solo esos tres
ficheros de test; nada de produccion):
  Reglas de escritura (obligatorias):
  - Confirm `#161 R2 (b)`: NO importes PetDocumentTooLargeError en ese
    spec. Captura con `.catch((error: unknown) => error)` y aserta
    `toBeInstanceOf(Error)`, `name` y `message` literales.
  - Mapper: importa `mapPetDocumentError` y `PetDocumentTooLargeError`; el
    `new PetDocumentTooLargeError()` va DENTRO del it.
  - e2e: el patron es el de los its `#157 R5` y `#157 R6 (d)` del mismo
    fichero: `createDocument(...).expect(201)` con
    `created.body as { document: DocumentResponse; uploadUrl: string }`,
    `fetch(body.uploadUrl, { method: 'PUT', body: Buffer.alloc(<literal>, 0x61) })`
    sin Authorization, `confirmDocument(...).expect(204)` /
    `.expect(409)` y la fila con
    `db.select().from(petDocuments).where(eq(petDocuments.id, ...))`.
    El GET se compara por ids:
    `(listed.body as DocumentResponse[]).map((d) => d.id)`. El HEAD es
    `s3.send(new HeadObjectCommand({ Bucket: resourceNames.mediaBucket, Key: body.document.key }))`.
    Nada de `.algo` sobre un `any` (eslint `no-unsafe-*` es ERROR).
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/161-r2.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 2 failed, 10 passed, 12 total` y
       `Tests:       2 failed, 42 passed, 44 total`
       (confirm `#161 R2 (b)` por asercion y mapper `#161 R2 (b)` por
       TypeError «is not a constructor»; `#161 R2 (a)` pasa ya, es rama
       frontera declarada en requirements.md)
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/161-r2-e2e.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 31 passed, 32 total`
       (`#161 R2 (b)`: `expected 409 "Conflict", got 204 "No Content"`)
  pnpm exec tsc --noEmit -p tsconfig.json --pretty false > /tmp/161-r2-tsc.txt 2>&1; echo "exit=$?"
    -> exit=2
  grep -qE '^Tests: +2 failed, 42 passed, 44 total$' /tmp/161-r2.txt \
    && grep -qE '^Test Suites: +2 failed, 10 passed, 12 total$' /tmp/161-r2.txt \
    && grep -qE '^Tests: +1 failed, 31 passed, 32 total$' /tmp/161-r2-e2e.txt \
    && grep -qF 'is not a constructor' /tmp/161-r2.txt \
    && grep -qF 'expected 409 "Conflict", got 204 "No Content"' /tmp/161-r2-e2e.txt \
    && ! grep -qE 'Test suite failed to run|ReferenceError|SyntaxError|Cannot find module' /tmp/161-r2.txt /tmp/161-r2-e2e.txt \
    && ! grep -qF 'TypeError' /tmp/161-r2-e2e.txt \
    && test "$(grep -oE '^[^(]+\([0-9]+,[0-9]+\): error TS' /tmp/161-r2-tsc.txt | sed -E 's/\(.*//' | LC_ALL=C sort -u | tr '\n' ' ')" = 'src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts ' \
    && test "$(grep -rlF 'PET_DOCUMENT_TOO_LARGE' src test | wc -l)" = 2 \
    && test "$(grep -rlF 'PET_DOCUMENT_MAX_BYTES' src test | wc -l)" = 0 \
    && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" --ignore-pattern 'src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts' \
    && pnpm exec prettier --check src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts test/media-docs.e2e-spec.ts \
    && git add src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts test/media-docs.e2e-spec.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts backend-pet-tracker/test/media-docs.e2e-spec.ts ' \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'test(media): red 10485760-byte limit on confirm (#161 R2)'
  (Si el e2e falla por conexion, ECONNREFUSED o timeout de 30000 en el
  PUT, PARA y reportalo: no subas el timeout.)

c4 verde (tasks.md R2 (2): PetDocumentTooLargeError en
pet-document.errors.ts con el mismo patron que las dos clases que ya hay;
`export const PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;` y la
comprobacion `> PET_DOCUMENT_MAX_BYTES` en el use case, despues de la de
`null` y antes de markUploaded; rama nueva del mapper antes del
`return error;` final, segun design.md §Archivos afectados):
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/161-g2.txt 2>&1; echo "exit=$?"
  <PGREP>; FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/161-g2-e2e.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +44 passed, 44 total$' /tmp/161-g2.txt \
    && grep -qE '^Test Suites: +12 passed, 12 total$' /tmp/161-g2.txt \
    && grep -qE '^Tests: +32 passed, 32 total$' /tmp/161-g2-e2e.txt \
    && test "$(grep -cF 'export const PET_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;' src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts)" = 1 \
    && test "$(grep -rlF 'PET_DOCUMENT_MAX_BYTES' src test | wc -l)" = 1 \
    && test "$(grep -rlF 'PET_DOCUMENT_TOO_LARGE' src test | wc -l)" = 3 \
    && test "$(grep -cF 'export class Pet' src/modules/media/domain/errors/pet-document.errors.ts)" = 3 \
    && test "$(grep -cF 'return error;' src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/domain/errors/pet-document.errors.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts \
    && git add src/modules/media/domain/errors/pet-document.errors.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts backend-pet-tracker/src/modules/media/domain/errors/pet-document.errors.ts backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts ' \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'feat(media): reject documents over 10485760 bytes on confirm (#161 R2)'

-- c5/c6 R3: ContentLength ausente falla cerrado (requisito de verificacion) --

c5 rojo (tasks.md R3 (1): describe `#161 R3` del confirm con 1 it,
describe `#161 R3` del mapper con 1 it, y las dos mutaciones de
PRODUCCION versionadas: M3a envuelve la llamada a getObjectSize del use
case en `try { … } catch { throw new PetDocumentNotUploadedError(); }`;
M3b cambia el `return error;` final del mapper por
`return new NotFoundException();`. Nunca toques un doble para el rojo):
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/161-r3.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 2 failed, 10 passed, 12 total` y
       `Tests:       3 failed, 43 passed, 46 total`
       (confirm `#161 R3`, confirm `#157 R6 (g)` por M3a, y mapper
       `#161 R3` por M3b; los tres por asercion `toBe`)
  grep -qE '^Tests: +3 failed, 43 passed, 46 total$' /tmp/161-r3.txt \
    && grep -qE '^Test Suites: +2 failed, 10 passed, 12 total$' /tmp/161-r3.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/161-r3.txt \
    && test "$(grep -cF 'return new NotFoundException();' src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts)" = 1 \
    && test "$(grep -cF 'return error;' src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts)" = 0 \
    && test "$(grep -cF 'throw new PetDocumentNotUploadedError();' src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts)" = 2 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts \
    && git add src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts ' \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'test(media): red missing ContentLength fails closed (#161 R3)'

c6 verde (tasks.md R3 (2): SOLO revierte M3a y M3b. Devuelve los dos
ficheros a c4 con `git show HEAD~1:<ruta desde la raiz> > <ruta>`; NUNCA
`git checkout <hash> -- <ruta>`, que deja el indice sucio):
  git show HEAD~1:backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts > src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts
  git show HEAD~1:backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts > src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts
  FORCE_COLOR=0 pnpm exec jest src/modules/media > /tmp/161-g3.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +46 passed, 46 total$' /tmp/161-g3.txt \
    && grep -qE '^Test Suites: +12 passed, 12 total$' /tmp/161-g3.txt \
    && test "$(grep -cF 'return error;' src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts)" = 1 \
    && test "$(grep -cF 'throw new PetDocumentNotUploadedError();' src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts)" = 1 \
    && pnpm exec tsc --noEmit -p tsconfig.json --pretty false && pnpm exec eslint "{src,apps,libs,test}/**/*.ts" \
    && pnpm exec prettier --check src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts \
    && git add src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts ' \
    && git diff --cached --quiet HEAD~1 -- src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts \
    && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)" \
    && git commit -m 'feat(media): revert R3 mutations, missing ContentLength fails closed (#161 R3)'
  (`git diff --cached --quiet HEAD~1 -- <dos ficheros>`: el indice de esos
  dos ficheros es identico a c4, que es lo que pide tasks.md R3 (2).)

== CIERRE ==

Desde backend-pet-tracker/, sin pipe, con salida al impl:
- <PGREP> libre; despues
  `FORCE_COLOR=0 pnpm test > /tmp/161-all.txt 2>&1; echo "exit=$?"`
    -> exit=0, Test Suites = BASE_SUITES + 1 (el spec del mapper) y
       Tests = BASE_TESTS + 8 (3 de R1, 2 + 1 del confirm, 1 + 1 del
       mapper), todo passed. Mientras corre, no lances otra cosa.
- <PGREP> libre; E2E -> exit=0 y `Tests:       32 passed, 32 total`.
- <PGREP> libre; E2E-M -> exit=0 y `Tests:       12 passed, 12 total`.
- TSC -> exit=0.
- `pnpm run lint > /tmp/161-lint.txt 2>&1; echo "exit=$?"` -> exit=0 (este
  SI lleva --fix) y despues `git status --short -- .` -> vacio (solo
  backend-pet-tracker/; el impl sigue sin trackear hasta c7). Si --fix
  reescribio algo, PARA y reporta que fichero y que cambio: no lo
  commitees sin decirlo.
Desde la raiz del repo:
- Las anclas A, D y H con sus valores de cierre, y R4a-R4h.
- `git diff --name-only <H0>...HEAD -- infra mobile-pet-tracker`   -> vacio
- `git diff --stat <H0> -- backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml backend-pet-tracker/src/modules/media/infrastructure/pet-media.controller.ts backend-pet-tracker/src/modules/media/media.module.ts backend-pet-tracker/src/db backend-pet-tracker/test/media.e2e-spec.ts backend-pet-tracker/test/aws-real-media.e2e-spec.ts`   -> vacio

Despues rellena specs/media-docs-confirm-size-limit/traceability.md: en
cada fila, cambia el «pendiente — » del principio de la columna Test por
nada (deja el nombre del test) y la columna Commit por hash corto +
mensaje, `rojo → verde`: R1 c1 → c2; R2 c3 → c4; R3 c5 → c6; R4
`sin commit propio: impl §Verificación R4 (test:e2e completo e ./init.sh
los corre el leader)`. No toques su frontmatter. El impl lleva una
seccion `## Verificación R4` con lint y unit entera (comando, exit,
lineas de resumen), E2E y E2E-M, los ocho greps R4a-R4h, el diff de
infra y mobile-pet-tracker, y la linea
`test:e2e completo y ./init.sh: pendientes del leader`.
Commit final, desde la raiz:
  git add specs/media-docs-confirm-size-limit/traceability.md progress/impl_media-docs-confirm-size-limit.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_media-docs-confirm-size-limit.md specs/media-docs-confirm-size-limit/traceability.md ' \
    && git commit -m 'docs(media-docs-confirm-size-limit): traceability (#161)'
Y la lista cerrada, con salida al impl (y despues un commit
`--only progress/impl_media-docs-confirm-size-limit.md` con mensaje
'docs(media-docs-confirm-size-limit): closed file list (#161)' solo si
la anotas tras c7; si la anotas antes de c7, no hace falta):
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_media-docs-confirm-size-limit.md' ':!specs/media-docs-confirm-size-limit/requirements.md' ':!specs/media-docs-confirm-size-limit/design.md' ':!specs/media-docs-confirm-size-limit/tasks.md' ':!progress/review_media-docs-confirm-size-limit.md'
    -> exactamente los 13 ficheros de abajo
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md (capas domain / application /
  infrastructure) y docs/conventions.md (§Tests, §Commits, §Manejo de
  errores). El error de dominio sigue el patron de las dos clases de
  pet-document.errors.ts (ancla H5); la rama del mapper, el de
  PET_DOCUMENT_NOT_UPLOADED (ancla A4).
- Prefijo `#161 R<n>:` en todo describe/it nuevo. Los its de #157 que
  cambian (E1, E2) solo cambian como dice requirements.md §Tests
  existentes que cambian.
- Valores esperados LITERALES en los tests (`10485760`, `10485761`, `0`,
  `18` y `1024` de E1-E2, los cuerpos y mensajes de error). Ningun test importa
  PET_DOCUMENT_MAX_BYTES (R4e lo comprueba). Si usas `expect.any(X)` como
  valor de una propiedad, escribe `expect.any(X) as unknown` (eslint
  no-unsafe-assignment).
- El objeto que excede NO se borra: ni `deleteObject` en el puerto ni
  `DeleteObjectCommand` en el adapter (design.md §D3, R4h).
- NO lances ./init.sh, ni `pnpm run test:e2e` sin filtro, ni
  `docker compose` ni `provision:local`: Postgres y LocalStack los
  comparten otras sesiones y el gate lo corre el leader. Si un e2e falla
  por conexion (ECONNREFUSED, 5433 o 4566), PARA y reportalo.
- Ni recursos AWS reales ni cdk: nada de esta feature corre contra AWS.
- Ni `pnpm add`, ni cambios en package.json ni pnpm-lock.yaml:
  `HeadObjectCommand` ya esta en @aws-sdk/client-s3.
- No toques ningun fichero fuera de la lista de abajo. En particular, NO
  pet-media.controller.ts, media.module.ts, src/db, test/media.e2e-spec.ts
  ni test/aws-real-media.e2e-spec.ts.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter y las casillas de
  §Aprobacion de requirements.md, design.md y tasks.md. Los escribe el
  leader o el humano. Todo lo que tengas que contar va en
  progress/impl_media-docs-confirm-size-limit.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (13, ni uno mas):
  backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts
  backend-pet-tracker/src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.ts
  backend-pet-tracker/src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts
  backend-pet-tracker/src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts
  backend-pet-tracker/src/modules/media/domain/errors/pet-document.errors.ts
  backend-pet-tracker/src/modules/media/domain/ports/photo-storage.ts
  backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.spec.ts
  backend-pet-tracker/src/modules/media/infrastructure/mappers/pet-document-error.mapper.ts
  backend-pet-tracker/src/modules/media/infrastructure/photo-storage.object-exists.spec.ts
  backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts
  backend-pet-tracker/test/media-docs.e2e-spec.ts
  progress/impl_media-docs-confirm-size-limit.md
  specs/media-docs-confirm-size-limit/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R3 de requirements.md, y R4 en lo que te
toca (lint, unit entera, E2E y E2E-M filtrados, greps, diffs, lista
cerrada). test:e2e completo e ./init.sh son del leader.

Al terminar, progress/impl_media-docs-confirm-size-limit.md debe tener:
pwd, branch, H0 y status; el exit de is-ancestor; node_modules y .env
(presentes); la salida de las anclas (A1-A17, D1-D2, H1-H12) en H0 y la
de cierre, mas R4a-R4h; la base con su exit (UNIT, E2E, E2E-M, ESLINT,
TSC, ALL con BASE_SUITES y BASE_TESTS); los 7 commits con hash y R-id;
por cada rojo, el comando, las lineas `Test Suites:` y `Tests:`, el
exit, cada it rojo con su matcher y Expected/Received (o su TypeError) y,
en c1 y c3, la salida de TSFILES; cada verde con sus lineas de resumen,
TSC y ESLINT; cada <PGREP> que no salio `libre` y cuanto esperaste; el
cierre (ALL, E2E, E2E-M, TSC, lint con --fix y status vacio, diffs
vacios, lista cerrada); la seccion `## Verificación R4`; y cualquier
decision que la spec no cerrara literalmente.

== RETOMAR TRAS LA PARADA EN C1 (enmienda L1) ==

Si ya paraste en c1 (impl con «## Parada obligatoria — cadena c1»), NO
repitas la base ni deshagas nada: los cuatro ficheros de test de c1 se
quedan como estan. Desde backend-pet-tracker/:
1. `git rev-parse --short HEAD` -> el commit de la enmienda L1 (anotalo
   en el impl como H0-L1); `git log --oneline <H0>..HEAD` -> solo ese
   commit, que toca solo este handoff. H0 sigue siendo el de arriba para
   las anclas, la lista cerrada y los diffs del cierre.
2. `pnpm exec prettier --write src/modules/media/infrastructure/photo-storage.object-exists.spec.ts src/modules/media/application/use-cases/confirm-pet-document-upload.use-case.spec.ts src/modules/media/application/use-cases/create-pet-document.use-case.spec.ts src/modules/media/application/use-cases/request-photo-upload-url.use-case.spec.ts`
   -> reescribe confirm (3 lineas) y object-exists (1 linea).
3. Repite las dos medidas de c1 (jest a /tmp/161-r1.txt y tsc a
   /tmp/161-r1-tsc.txt): las cuentas y TSFILES no cambian; los numeros
   de linea de tsc si.
4. Lanza la cadena c1 tal como esta ahora (con el eslabon prettier) y
   sigue con c2-c7 aplicando FORMATO.
Anade al impl una seccion `## Reanudacion tras L1` con estos cuatro
pasos y sus salidas, debajo de la parada (no borres la parada).

== RETOMAR TRAS LA PARADA EN C3 (enmienda L2) ==

Si ya paraste en c3 (impl con «## Parada obligatoria — cadena c3»), NO
repitas nada de c1-c2 ni de la base, y no toques los tres ficheros de
test de c3. Desde backend-pet-tracker/:
1. `git log --oneline -1` -> el commit de la enmienda L2 (anotalo como
   H0-L2); `git log --oneline <H0>..HEAD` -> L1, c1, c2 y L2, nada mas.
2. Repite las tres medidas de c3 (UNIT a /tmp/161-r2.txt, <PGREP> y E2E
   a /tmp/161-r2-e2e.txt, TSC a /tmp/161-r2-tsc.txt): UNIT debe dar
   `Tests:       2 failed, 42 passed, 44 total`.
3. Lanza la cadena c3 tal como esta ahora y sigue con c4-c7.
<PGREP> y su medida van en llamadas SEPARADAS: lee la salida del pgrep y
lanza el e2e solo si dice `libre`. En c2 un e2e salio con el pgrep ocupado
(el init.sh de wt-18); no puede repetirse.
Anade al impl `## Reanudacion tras L2` con estos pasos y sus salidas,
debajo de la parada de c3 (no la borres).
```
