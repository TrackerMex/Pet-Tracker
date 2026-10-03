Veredicto: APROBADO
Hash del veredicto: 198d67b182247529c94024845bc69b8d394be093

# review: dto-dates-owner-timezone (#89)

Fecha: 2026-09-11 16:15 UTC
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/89-dto-dates-owner-timezone`. Base `origin/main` @ 381d1e36
(merge-base verificado). Código de Codex: trece commits bd97047c..198d67b1.
HEAD = `origin/feature/89-dto-dates-owner-timezone` = 198d67b1 al empezar y
al terminar (`git fetch` a las 16:14 UTC); `git status --short` vacío al
cerrar (salvo este reporte).

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#89)
- [x] `progress/current.md` describe la sesión activa de #89 (branch,
      worktree, handoff a Codex, coordinación con #78)

## Checklist C3 — Arquitectura

- [x] domain sin imports de infrastructure: `weight.errors.ts` (nuevo) y
      `pet.errors.ts` solo extienden `Error`, sin `@nestjs/common`
- [x] repositories/contratos en domain son interfaces puras:
      `pet.repository.ts` y `user.repository.ts` sin diff (ningún puerto
      gana métodos, D11)
- [x] application depende de interfaces: `CreateWeightUseCase` inyecta
      `PET_REPOSITORY`/`PetRepository`, `CreatePetUseCase` inyecta
      `USER_REPOSITORY`/`UserRepository`; `requester-local-day.ts` importa
      solo el tipo del puerto y `localDayInZone`
- [x] infrastructure sin lógica de negocio: los controllers izan un solo
      `new Date()` por request y mapean el error de dominio al 400 con el
      helper que ya tenían (`validationError` / `mapPetError`)

## Checklist C4 — TDD

- [x] Cada R<n> tiene al menos un test que lo nombra: describes
      `R1 (dto-dates-owner-timezone #89)…` en `create-weight.use-case.spec.ts:87`,
      `R2 …` en `create-pet.use-case.spec.ts:120`, `R3 …` en
      `requester-local-day.spec.ts:13`, `R4 …` en `update-pet.use-case.spec.ts:170`,
      `R5 …` en `test/health-weights.e2e-spec.ts:403`, `R6 …` en
      `test/pets.e2e-spec.ts:304`
- [x] Historial test-primero: seis pares `test(...)` → `feat(...)` en el
      orden de D12; cada rojo reproducido por mí con checkout del commit
      (tabla abajo) y cada verde con el `feat` siguiente
- [x] R7 y R8 declarados requisitos de verificación por escrito antes del
      handoff (vía (b), mutación no versionada), firmados por el humano
- [x] Ningún rojo por `ReferenceError` (0 apariciones en los cuatro logs
      unitarios rojos)
- [x] Ningún rojo por mutación de un doble: R1/R2 caen por la aridad del
      constructor que el propio requisito crea (`this.audit.record is not a
      function` / `this.auditLogger.record is not a function`), R3 por
      conteo de `warn` e `InvalidTimeZoneError` escapando, R4 por
      `findOwnerTimezone` a 0 llamadas y promesa resuelta, R5/R6 por status

Rojo/verde reproducido (checkout en este worktree, vuelta a 198d67b1
después; hora UTC 16:00-16:02, franja `h` 11-23 de D9):

| Par | Rojo (hash, comando, resultado, causa) | Verde (hash, resultado) |
|---|---|---|
| R1 | `bd97047c` `pnpm test -- create-weight`: `Tests: 4 failed, 1 passed, 5 total`. R1(1)(3): `Received promise rejected instead of resolved` / `Rejected to value: [TypeError: this.audit.record is not a function]`; R1(2): `Expected substring: "measuredAt is too far in the future"` / `Received message: "this.audit.record is not a function"`; heredado `audita el id creado…` rojo por la misma aridad; `no audita cuando la escritura falla` verde | `cf92bd42`: `Tests: 5 passed, 5 total` |
| R2 | `0889fd79` `pnpm test -- create-pet pets.controller`: `Tests: 7 failed, 48 passed, 55 total`. R2(1)(3)(4): `Rejected to value: [TypeError: this.auditLogger.record is not a function]`; R2(2): `Expected substring: "birthDate cannot be in the future"`; heredados `delega en createWithOwner…` y `registra la entrada…` rojos por aridad; `pets.controller.spec` R2 rojo (`expect.any(Date)` ausente, `Number of calls: 1`) | `be29c567`: `Tests: 55 passed, 55 total` |
| R3 | `a18c1ccd` `pnpm test -- requester-local-day`: `Tests: 2 failed, 1 passed, 3 total`. (2): `Expected number of calls: 1` / `Received number of calls: 0`; (3): `Rejected to value: [InvalidTimeZoneError: unknown IANA time zone: Not/A/Zone]`; (1) ya verde | `9e784e04` `-- requester-local-day owner-local-day get-pet.use-case vaccine-mutations`: `Tests: 26 passed, 26 total` |
| R4 | `049193a1` `pnpm test -- update-pet pets.controller`: `Tests: 4 failed, 38 passed, 42 total`. R4(1)(3): `Expected: "0198b2c3-…"` / `Number of calls: 0`; R4(2): `Received promise resolved instead of rejected`; `pets.controller.spec` R13 rojo; R4(4) y los siete heredados verdes | `82fe3d43`: `Tests: 42 passed, 42 total` |
| R5 | `1a7ec60c` `test:e2e -- health-weights` (16:01:11Z): `Tests: 2 failed, 31 passed, 33 total`; el `it` de R5 y el heredado #15 R7 adaptado, ambos `expected 400 "Bad Request", got 500 "Internal Server Error"` | `9584867d`: `Tests: 33 passed, 33 total` |
| R6 | `b2b9bcd5` `test:e2e -- pets` (16:01:39Z): `Tests: 2 failed, 21 passed, 23 total`; solo los dos `it` nuevos: POST `expected 201 "Created", got 400 "Bad Request"`, PATCH `expected 200 "OK", got 400 "Bad Request"` (Kiritimati «hoy» = D+1 con `h >= 10`). DTO specs en ese commit: `Tests: 32 passed, 32 total` | `c38755bb`: `Tests: 23 passed, 23 total` |

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin filas "pendiente" (grep: solo la frase de la
      regla)
- [x] Los trece hashes de la tabla son ancestros de HEAD (`git merge-base
      --is-ancestor`, 13/13 OK) y cada commit toca solo los archivos de su
      bloque de D12
- [x] Commits con el formato `test|feat|docs(dto-dates-owner-timezone):
      <desc> (R<n>)`
- [x] Tests heredados reescritos, no borrados: los dos `it` de #15 R10
      (`create-weight.use-case.spec.ts:32,56`), los tres de #5 R2/R3
      (`create-pet.use-case.spec.ts:72,91,106`), los siete `execute` de #5
      R13-R15 (11 llamadas a `execute(` en `update-pet.use-case.spec.ts`
      = 7 heredadas + 4 de R4), las dos aserciones de
      `pets.controller.spec.ts:80,285` con `expect.any(Date)`, el `it` de
      #15 R7 renombrado (`health-weights.e2e-spec.ts:383`), las dos filas
      de los DTO specs retiradas con `isoDateDaysFromNow` aún en uso
      (`create-pet.dto.spec.ts:80`)

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y las tres casillas
      marcadas (fecha 2026-09-11)
- [x] Firma humana en 62992e82 (AlexisSM377, 3 líneas cambiadas = las
      tres casillas); el único commit posterior sobre `requirements.md`
      (06e3e653) cambia solo el frontmatter `spec_ready → approved`. Ningún
      requisito modificado tras el gate

## Checklist C7 — Sin código huérfano

- [x] Componentes reemplazados eliminados: `todayIsoDateUtc` (las dos
      copias: `iso-date.ts` y `create-pet.dto.ts`),
      `MEASURED_AT_MAX_FUTURE_DAYS` y `maxMeasuredAtIsoDate`
      (`weight.dto.ts`), los dos `refine` de fecha contra hoy UTC
- [x] Sus tests también: filas `create-pet.dto.spec.ts:56` y
      `update-pet.dto.spec.ts:16` retiradas; el e2e de #15 R7 que
      importaba la constante adaptado
- [x] grep de importadores vacío (barrido R7-(b), abajo)

## Checklist C8 — UI móvil

- [x] N/A — `git diff --stat 381d1e36...HEAD -- mobile-pet-tracker/` vacío

## R7 — regresión (reproducido)

(a) `git diff --name-only 381d1e36...HEAD -- backend-pet-tracker/` = 22
archivos, exactamente los de design.md §Archivos afectados:

```text
src/modules/health/application/dto/iso-date.ts
src/modules/health/application/dto/weight.dto.ts
src/modules/health/application/use-cases/create-weight.use-case.spec.ts
src/modules/health/application/use-cases/create-weight.use-case.ts
src/modules/health/domain/errors/weight.errors.ts
src/modules/health/infrastructure/weights.controller.ts
src/modules/pets/application/dto/create-pet.dto.spec.ts
src/modules/pets/application/dto/create-pet.dto.ts
src/modules/pets/application/dto/update-pet.dto.spec.ts
src/modules/pets/application/owner-local-day.ts
src/modules/pets/application/requester-local-day.spec.ts
src/modules/pets/application/requester-local-day.ts
src/modules/pets/application/use-cases/create-pet.use-case.spec.ts
src/modules/pets/application/use-cases/create-pet.use-case.ts
src/modules/pets/application/use-cases/update-pet.use-case.spec.ts
src/modules/pets/application/use-cases/update-pet.use-case.ts
src/modules/pets/domain/errors/pet.errors.ts
src/modules/pets/infrastructure/pets.controller.spec.ts
src/modules/pets/infrastructure/pets.controller.ts
src/modules/pets/pets.module.ts
test/health-weights.e2e-spec.ts
test/pets.e2e-spec.ts
```

Fuera de `backend-pet-tracker/` solo `feature_list.json`, `progress/*` y
`specs/dto-dates-owner-timezone/*`. Diff vacío en `mobile-pet-tracker/`,
`infra/`, `src/pipeline/`, `src/modules/auth/`, `src/modules/activity/`,
`package.json` y lockfiles (cero dependencias nuevas).

(b) Barrido:

```text
$ grep -rn "todayIsoDateUtc" src test                                   → vacío (exit 1)
$ grep -rn "MEASURED_AT_MAX_FUTURE_DAYS\|maxMeasuredAtIsoDate" src test ../mobile-pet-tracker/src → vacío (exit 1)
$ grep -rn "new Date().toISOString().slice(0, 10)" src                  → vacío (exit 1)
$ grep -rn "toISOString().slice(0, 10)" src
src/pipeline/local-day.ts:95:  return normalized.toISOString().slice(0, 10) === value;
src/pipeline/local-day.ts:128:  const day = new Date(utcMidnight).toISOString().slice(0, 10);
src/modules/health/application/dto/iso-date.ts:9:    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
src/modules/activity/infrastructure/repositories/daily-positions.dynamo.reader.ts:78:        date: new Date(startMs).toISOString().slice(0, 10),
```

(c) `grep -ln "isSupportedTimeZone" src/modules/pets/application/*.ts` →
solo `owner-local-day.ts`; `grep -c "isSupportedTimeZone\|Logger"
src/modules/pets/application/requester-local-day.ts` → `0`.

(d)/(e) `git diff --quiet 381d1e36...HEAD -- <archivo>` sin diff en los
quince: `owner-local-day.spec.ts`, `get-pet.use-case.spec.ts`,
`vaccine-mutations.use-cases.spec.ts`, `alerts-engine-consumer.service.spec.ts`,
`src/pipeline/local-day.spec.ts`, `test/health-vaccines.e2e-spec.ts`,
`test/nutrition.e2e-spec.ts`, `test/backfill-weights.e2e-spec.ts`,
`vaccine.dto.ts`, `update-pet.dto.ts`, `health.module.ts`, `auth.module.ts`,
`pet.repository.ts`, `user.repository.ts`, `vaccine-error.mapper.ts`.
`git diff --check` limpio.

(f) Hunks de los dos e2e leídos: `health-weights.e2e-spec.ts` solo
imports, firma y `insert` de `seedUser`, el `it` de #15 R7 y el describe
R5; `pets.e2e-spec.ts` solo import, `seedUser` y el describe R6.

D5 (forma del 400 byte a byte): `validationError` en
`weights.controller.ts:86-97` y `parseBody` en `pets.controller.ts:197-212`
construyen `{ statusCode: 400, message: 'Validation failed', errors:
[{ path: issue.path.join('.'), message }] }`; el `catch` de pesos pasa
`path: ['measuredAt']` y `mapPetError` `path: 'birthDate'`; literales
`'measuredAt is too far in the future'` (conservado según §Fuera de
alcance) y `'birthDate cannot be in the future'` viven una sola vez en
cada clase de error. Los `toEqual` de R5/R6 sobre el body completo pasan.

## R8 — mutaciones reproducidas (no versionadas, sobre 198d67b1)

Hora UTC 16:03-16:08 (franja `h` 11-23, misma que la corrida de Codex a
las 15:45). Tras cada una `git checkout -- <archivo>` y `git status
--short` vacío.

### M1 — margen `shiftDay(today, 1)` en `create-weight.use-case.ts` (16:03:06Z)

`pnpm test -- create-weight`: `Tests: 1 failed, 4 passed, 5 total`, solo
R1(2):

```text
Received promise resolved instead of rejected
Resolved to value: {"bodyCondition": null, "id": "0198dead-…", "measuredAt": "2026-08-11", …, "weightKg": 21.35}
```

`test:e2e -- health-weights`: `Tests: 2 failed, 31 passed, 33 total`, el
`it` de R5 y el heredado #15 R7:

```text
expected 400 "Bad Request", got 201 "Created"   (x2)
```

### M2 — `now.toISOString().slice(0, 10)` en `create-pet.use-case.ts` (16:03:13Z)

`pnpm test -- create-pet`: `Tests: 3 failed, 34 passed, 37 total`,
exactamente R2(1)(2)(3):

```text
Expected: "0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77"
Number of calls: 0
Received promise resolved instead of rejected
Received promise rejected instead of resolved
Rejected to value: [PetBirthDateInFutureError: birthDate cannot be in the future]
```

`test:e2e -- pets`: `Tests: 1 failed, 22 passed, 23 total`, solo el POST
de R6 (PATCH verde):

```text
expected 201 "Created", got 400 "Bad Request"
```

### M3 — `localDayInZone` devuelve el día UTC en `owner-local-day.ts`

Variante exacta de la spec (solo el `return` final, resto intacto,
16:08:28Z), `pnpm test -- create-weight update-pet requester-local-day
owner-local-day get-pet.use-case vaccine-mutations`: `Test Suites: 6
failed, 1 passed, 7 total`; `Tests: 11 failed, 44 passed, 55 total` —
R1(2)(3), R4(2)(3), R3(1), #88 R3(1), #82 R1, #88 R1(2)(3) y R2(2)(3),
la lista de Codex al pie de la letra:

```text
Expected: "2026-08-10"   Received: "2026-08-11"     (R3(1), #88 R3(1))
Received promise resolved instead of rejected      (x4)
Received promise rejected instead of resolved      (x4)
Number of calls: 1                                 (#82 R1: findNextVaccine con el día UTC)
```

`test:e2e -- health-weights pets health-vaccines` (16:03:24Z, con una
primera variante de M3 que hacía el `return` antes del `warn`; el camino
e2e no toca el `warn`): `Test Suites: 3 failed, 3 total`; `Tests: 7
failed, 69 passed, 76 total` — R5, los dos `it` de R6, #88 R4 POST y
PATCH, #82 R3 y R4:

```text
expected 201 "Created", got 400 "Bad Request"   (x3)
expected 200 "OK", got 400 "Bad Request"        (x2)
Expected: "2026-09-12"   Received: "2026-09-11"  (#82 R3/R4, nextVaccine)
```

Nota: esa primera variante de M3 (early `return` que también saltaba el
`warn`) dio en unitario `17 failed, 38 passed` = los 11 de Codex + seis
fallos por conteo de `warn` (R3(2)(3), #82 R2(1)(2), #88 R3(2)(3)); es un
superconjunto coherente, no una discrepancia con el reporte.

Post-reversión: unitario `-- create-weight create-pet update-pet
requester-local-day owner-local-day get-pet.use-case vaccine-mutations
pets.controller` `Tests: 109 passed, 109 total`; e2e `-- health-weights
pets` `Tests: 56 passed, 56 total`.

## Contención con el worktree de #78

`pgrep -af 'init\.sh'` / `pgrep -af 'test:e2e'` vacíos antes de cada e2e
y del `init.sh`. Dos veces apareció el `init.sh` ajeno y el bucle esperó
sin lanzar nada: pid 3446824 (16:03:36-16:07:36, antes del e2e
post-reversión, que salió 56/56) y pid 3451829 (16:08:49-16:09:50, antes
de `init.sh`). Ninguna corrida descartada; ningún rojo con filas
inexistentes ni conteos a cero.

## Output de ./init.sh

`env -u FORCE_COLOR bash ./init.sh` en primer plano, 16:09:50Z →
16:13:45Z, exit 0, una sola corrida (el flake #72 no apareció). Sin el
aviso de e2e omitidos.

```text
Backend:  Test Suites: 165 passed, 165 total
          Tests:       1268 passed, 1268 total
Infra:    Test Suites: 2 passed, 2 total
          Tests:       14 passed, 14 total
Móvil:    Test Suites: 70 passed, 70 total
          Tests:       1156 passed, 1156 total
E2E:      Test Suites: 3 skipped, 25 passed, 25 of 28 total
          Tests:       8 skipped, 362 passed, 370 total
✅ Build exitoso
✅ Tests pasados
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Backend 165/1268 = base 164/1256 (T0 de Codex) + `requester-local-day.spec.ts`
+ 14 `it` nuevos − 2 filas de DTO retiradas. `git status --short` vacío
tras `init.sh` (el `eslint --fix` de lint no tocó nada).

## Observaciones

Ninguna bloqueante. Para el cierre del leader (D7): corregir
`files_affected` de #89 en `feature_list.json` con la lista de veintidós
de design.md.
