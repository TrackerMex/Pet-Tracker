# Implementacion — dto-dates-owner-timezone (#89)

## T0

- Branch: `feature/89-dto-dates-owner-timezone`.
- Merge base con `origin/main`:
  `381d1e361b78b4c45badfcb5e2e08fa41fbf4810`.
- Arbol backend inicial identico a `381d1e36`; worktree limpio.
- Postgres y LocalStack compartidos: `pet-tracker-postgres` y
  `pet-tracker-localstack`, ambos healthy. Conservan el proyecto Compose
  `pet-tracker` del worktree principal; no se crearon contenedores duplicados.
- `Intl`: `Pacific/Kiritimati`, `Pacific/Pago_Pago` y
  `America/Mexico_City` soportadas (`true true true`). Fechas fijas:
  `2026-08-10 2026-08-11`.
- Inventario previo: el grep de
  `CreateWeightUseCase|CreatePetUseCase|UpdatePetUseCase` coincide con D11.
  Los constructores/llamadores que cambian estan en los veintidos archivos;
  `health.module.ts` solo registra el provider y no cambia.
- Dos shells observadores antiguos (`1042733`, `2493698`) contienen
  `init.sh` en su texto y contaminan el `pgrep`; no ejecutan `init.sh` ni
  `test:e2e` (mismo antecedente documentado por #88). Antes de cada e2e se
  comprobo ademas que no hubiera un proceso real `bash ./init.sh` ni
  `test:e2e`.
- Referencia unitaria: `Test Suites: 11 passed, 11 total`; `Tests: 97
  passed, 97 total`.
- Referencia e2e de pesos y mascotas: `Test Suites: 2 passed, 2 total`;
  `Tests: 53 passed, 53 total`.
- Gate inicial: `env -u FORCE_COLOR bash ./init.sh`, exit 0. Backend:
  `Test Suites: 164 passed, 164 total`; `Tests: 1256 passed, 1256 total`.
  Infra: `2 passed`, `14 passed`. Movil: `70 passed`, `1156 passed`. E2E:
  `25 passed`, `359 passed`. Ultima linea: `Todo verde. Listo para
  trabajar.`

## Rojo/verde por commit

### R1

- Rojo `bd97047c`: `Test Suites: 1 failed, 1 total`; `Tests: 4 failed, 1
  passed, 5 total`. R1(1) y R1(3): `Received promise rejected instead of
  resolved`, con `TypeError: this.audit.record is not a function`. R1(2):
  `Expected substring: "measuredAt is too far in the future"`; `Received
  message: "this.audit.record is not a function"`. El heredado `audita el id
  creado...` fallo por la misma aridad; `no audita cuando la escritura falla`
  quedo verde.
- Verde `cf92bd42`: `Test Suites: 1 passed, 1 total`; `Tests: 5 passed, 5
  total`. `tsc --noEmit`, Prettier y ESLint limpios.

### R2

- Rojo `0889fd79`: `Test Suites: 2 failed, 3 passed, 5 total`; `Tests: 7
  failed, 48 passed, 55 total`. R2(1), R2(3) y R2(4): `Received promise
  rejected instead of resolved`, con `TypeError: this.auditLogger.record is
  not a function`. R2(2): esperaba `birthDate cannot be in the future` y
  recibio ese `TypeError`. Los dos heredados de create/audit fallaron por la
  misma aridad; el caso de transaccion fallida quedo verde. El controller
  mostro `Expected: Any<Date>` ausente, con una llamada recibida.
- Verde `be29c567`: `Test Suites: 5 passed, 5 total`; `Tests: 55 passed, 55
  total`. `tsc --noEmit`, Prettier y ESLint limpios. `requesterLocalDay`
  queda minimo, sin validacion IANA ni `warn`.

### R3

- Rojo `a18c1ccd`: `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 1
  passed, 3 total`. La zona IANA valida ya quedo verde. Para `null`,
  `Expected number of calls: 1`; `Received number of calls: 0`. Para
  `Not/A/Zone`, se recibio `InvalidTimeZoneError: unknown IANA time zone:
  Not/A/Zone` en vez de la resolucion UTC.
- Verde `9e784e04`: `Test Suites: 9 passed, 9 total`; `Tests: 69 passed, 69
  total`. `tsc --noEmit`, Prettier y ESLint limpios. Los specs heredados de
  `ownerLocalDay`, `GetPetUseCase` y vacunas quedaron verdes y sin diff. El
  grep de `isSupportedTimeZone` lista solo `owner-local-day.ts`; el conteo de
  `isSupportedTimeZone|Logger` en `requester-local-day.ts` es `0`.

### R4

- Rojo `049193a1`: `Test Suites: 2 failed, 1 passed, 3 total`; `Tests: 4
  failed, 38 passed, 42 total`. R4(1) y R4(3): esperaba `PET_ID` en
  `findOwnerTimezone`, `Number of calls: 0`. R4(2): `Received promise
  resolved instead of rejected`. R4(4) y los siete `execute` heredados
  quedaron verdes. El controller mostro `Expected: Any<Date>` ausente.
- Verde `82fe3d43`: `Test Suites: 3 passed, 3 total`; `Tests: 42 passed, 42
  total`. `tsc --noEmit`, Prettier y ESLint limpios.

### R5

- Rojo `1a7ec60c`, `2026-09-11T15:34:13+00:00`: `Test Suites: 1 failed,
  1 total`; `Tests: 2 failed, 31 passed, 33 total`. El nuevo R5 y el
  heredado adaptado de #15 fallaron exclusivamente por status:
  `expected 400 "Bad Request", got 500 "Internal Server Error"`.
- Verde `9584867d`: e2e de pesos `Test Suites: 1 passed, 1 total`; `Tests:
  33 passed, 33 total`. Unitario de create-weight `5 passed`; `tsc
  --noEmit`, Prettier y ESLint limpios. El barrido intermedio deja
  `todayIsoDateUtc` solo en `create-pet.dto.ts`, que corresponde a R6.

### R6

- Rojo `b2b9bcd5`, `2026-09-11T15:36:15+00:00`: `Test Suites: 1 failed,
  1 total`; `Tests: 2 failed, 21 passed, 23 total`. Solo fallaron los dos
  `it` nuevos: POST `expected 201 "Created", got 400 "Bad Request"`; PATCH
  `expected 200 "OK", got 400 "Bad Request"`. Los DTO specs adaptados:
  `Test Suites: 2 passed, 2 total`; `Tests: 32 passed, 32 total`.
- Verde `c38755bb`: e2e de mascotas `Test Suites: 1 passed, 1 total`;
  `Tests: 23 passed, 23 total`. Unitarios relacionados: `Test Suites: 7
  passed, 7 total`; `Tests: 78 passed, 78 total`. `tsc --noEmit`, Prettier
  y ESLint limpios; `todayIsoDateUtc` no aparece en `src` ni `test`.

## Regresión (R7)

- Sujeto verificado: árbol verde en `c38755bb`, tras los doce commits de
  código de D12.
- Alcance backend: `git diff --name-only 381d1e36...HEAD --
  backend-pet-tracker/` devolvió exactamente los veintidós archivos de
  diseño:

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

- Alcance móvil: `git diff --stat 381d1e36...HEAD --
  mobile-pet-tracker/` vacío.
- Barrido R7-(b): `todayIsoDateUtc`,
  `MEASURED_AT_MAX_FUTURE_DAYS|maxMeasuredAtIsoDate` y
  `new Date().toISOString().slice(0, 10)` no aparecen en los ámbitos
  exigidos. El grep genérico de `toISOString().slice(0, 10)` devuelve solo
  `local-day.ts:95,128`, `iso-date.ts:9` y
  `daily-positions.dynamo.reader.ts:78`, los usos permitidos por la spec.
- Sin duplicación R7-(c): `localDayInZone` se define solo en
  `owner-local-day.ts`; el conteo de `isSupportedTimeZone|Logger` en
  `requester-local-day.ts` es `0`.
- Contrato intacto R7-(d)/(e): los diffs de los ocho tests candado y de los
  siete archivos de producción enumerados en requirements son vacíos
  (`git diff --exit-code`, exit 0). `git diff --check` también queda limpio.
- Hunk audit R7-(f): en `health-weights.e2e-spec.ts` solo cambian imports,
  la zona opcional de `seedUser`, el `it` heredado de #15 R7 y el nuevo
  describe R5; en `pets.e2e-spec.ts`, solo imports, la zona opcional de
  `seedUser` y el nuevo describe R6.
- E2E dirigido restaurado: `Test Suites: 2 passed, 2 total`; `Tests: 56
  passed, 56 total`. Suite e2e completa: `Test Suites: 3 skipped, 25
  passed, 25 of 28 total`; `Tests: 8 skipped, 362 passed, 370 total`.
- Primera corrida de `env -u FORCE_COLOR bash ./init.sh`: backend e infra
  verdes; cayó únicamente el flake móvil permitido #72,
  `src/screens/add-pet/index.test.tsx::uploads a chosen preview only after
  createPet succeeds` (`TypeError` sobre `picked` y preview ausente; 1
  fallo de 1156). No se modificó móvil.
- Segunda corrida limpia: móvil `Test Suites: 70 passed, 70 total` y
  `Tests: 1156 passed, 1156 total`; e2e `25 passed` / `362 passed`; lint y
  typecheck verdes; exit 0. Última línea: `Todo verde. Listo para
  trabajar.` No apareció el aviso de e2e omitidos.

## Mutación (R8)

Las tres mutaciones se aplicaron por separado sobre `c38755bb`, sin commit,
y se restauraron con el `git checkout -- <archivo>` literal indicado por la
spec. Tras cada restauración, `git status --short` volvió a mostrar solo este
reporte todavía no versionado.

### M1 — vuelve el margen de un día en pesos

- Hora UTC: `2026-09-11T15:45:45+00:00`.
- Mutación: variable local `today`, import de `shiftDay` y comparación
  `dto.measuredAt > shiftDay(today, 1)`.
- Unitario `-- create-weight`: `Test Suites: 1 failed, 1 total`; `Tests: 1
  failed, 4 passed, 5 total`. Falló solo R1(2):

  ```text
  expect(received).rejects.toThrow()
  Received promise resolved instead of rejected
  Resolved to value: { ... "measuredAt": "2026-08-11", ... }
  ```

- E2E `-- health-weights`: `Test Suites: 1 failed, 1 total`; `Tests: 2
  failed, 31 passed, 33 total`. R5 en Pago_Pago y el heredado #15 R7:

  ```text
  expected 400 "Bad Request", got 201 "Created"
  ```

- Reversión: `git checkout --
  backend-pet-tracker/src/modules/health/application/use-cases/create-weight.use-case.ts`.

### M2 — create-pet vuelve a comparar contra UTC

- Hora UTC: `2026-09-11T15:46:15+00:00`.
- Mutación: `requesterLocalDay(...)` sustituido por
  `now.toISOString().slice(0, 10)`.
- Unitario `-- create-pet`: `Test Suites: 1 failed, 3 passed, 4 total`;
  `Tests: 3 failed, 34 passed, 37 total`. Fallaron exactamente R2(1)(2)(3):

  ```text
  Expected: "0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77"
  Number of calls: 0

  Received promise resolved instead of rejected
  Received promise rejected instead of resolved
  Rejected to value: PetBirthDateInFutureError
  ```

- E2E `-- pets`: `Test Suites: 1 failed, 1 total`; `Tests: 1 failed, 22
  passed, 23 total`. Solo el POST R6 cayó (PATCH siguió verde):

  ```text
  expected 201 "Created", got 400 "Bad Request"
  ```

- Reversión: `git checkout --
  backend-pet-tracker/src/modules/pets/application/use-cases/create-pet.use-case.ts`.

### M3 — localDayInZone ignora la zona

- Hora UTC: `2026-09-11T15:46:40+00:00`.
- Mutación: `localDayInZone` devuelve
  `now.toISOString().slice(0, 10)`, con el resto intacto.
- Unitarios pedidos: `Test Suites: 6 failed, 1 passed, 7 total`; `Tests: 11
  failed, 44 passed, 55 total`. Cayeron R1(2)(3), R4(2)(3), R3(1), #88
  R3(1), #82 R1 y #88 R1(2)(3)/R2(2)(3). Bloques representativos:

  ```text
  Received promise resolved instead of rejected
  Received promise rejected instead of resolved

  Expected: "2026-08-10"
  Received: "2026-08-11"

  Expected: PET_ID, "2026-08-09"
  Received: PET_ID, "2026-08-10"
  Number of calls: 1
  ```

- E2E pedidos: `Test Suites: 3 failed, 3 total`; `Tests: 7 failed, 69
  passed, 76 total`. Cayeron R5, ambos `it` R6, #88 R4 POST/PATCH y los dos
  candados #82 R3/R4. Bloques de status representativos:

  ```text
  expected 201 "Created", got 400 "Bad Request"
  expected 200 "OK", got 400 "Bad Request"
  Expected: "2026-09-12"
  Received: "2026-09-11"
  ```

- Reversión: `git checkout --
  backend-pet-tracker/src/modules/pets/application/owner-local-day.ts`.
  Restaurado el árbol, los unitarios pedidos quedaron `7 passed` / `55
  passed` y los e2e de la feature `2 passed` / `56 passed`.
