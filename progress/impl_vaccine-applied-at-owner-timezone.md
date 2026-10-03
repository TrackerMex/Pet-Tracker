# Implementacion — vaccine-applied-at-owner-timezone (#88)

## T0

- Branch: `feature/88-vaccine-applied-at-owner-timezone`.
- Merge base con `origin/main`: `f3e32800daf95f170c396d3e27b0c4a6d9d3ea48`.
- Arbol inicial limpio.
- Postgres y LocalStack compartidos: `pet-tracker-postgres` y
  `pet-tracker-localstack`, ambos healthy.
- `Intl`: `Pacific/Kiritimati`, `Pacific/Pago_Pago` y
  `America/Mexico_City` soportadas (`true true true`). Fechas fijas:
  `2026-08-10 2026-08-11`.
- Inventario previo: el grep de `CreateVaccineUseCase|UpdateVaccineUseCase`
  coincide con D6. Solo cambian los constructores posicionales de
  `vaccine-mutations.use-cases.spec.ts` y las llamadas de
  `vaccines.controller.ts`; `health.module.ts` solo registra providers.
- Dos shells observadores antiguos (`1042733`, `2493698`) contienen
  `init.sh` en su texto y contaminan el `pgrep`; ambos estan dormidos, sin
  hijos y no ejecutan tests. Antes de cada e2e se comprobo tambien que no
  hubiera un proceso real `bash ./init.sh` ni `test:e2e`.
- Referencia unitaria: `Test Suites: 2 passed, 2 total`; `Tests: 13 passed,
  13 total`.
- Referencia e2e de vacunas: `Test Suites: 1 passed, 1 total`; `Tests: 18
  passed, 18 total`.
- Gate inicial: `env -u FORCE_COLOR bash ./init.sh`, exit 0; e2e completo
  `Test Suites: 3 skipped, 25 passed, 25 of 28 total`; `Tests: 8 skipped,
  357 passed, 365 total`; ultima linea: `✅ Todo verde. Listo para trabajar.`

## Rojo/verde por commit

### R1

- Rojo `2ed46268`: `Test Suites: 1 failed, 1 total`; `Tests: 3 failed, 3
  passed, 6 total`. R1(1) y R1(3): `Expected: PET_ID`, `Number of calls: 0`
  para `findOwnerTimezone`. R1(2): `Received promise resolved instead of
  rejected`. El describe heredado R12 quedo verde.
- Verde `35b42255`: `Test Suites: 1 passed, 1 total`; `Tests: 6 passed, 6
  total`. `tsc --noEmit`, Prettier y ESLint limpios. El helper queda minimo:
  `timezone ?? 'UTC'`, sin validacion IANA ni `warn`.

### R2

- Rojo `5d75a820`: `Test Suites: 1 failed, 1 total`; `Tests: 4 failed, 6
  passed, 10 total`. R2(1), R2(3) y R2(4): `Received promise rejected
  instead of resolved`, con `TypeError: this.audit.record is not a
  function`. R2(2): esperaba `Applied date cannot be in the future` y
  recibio ese mismo `TypeError`. R1 y R12 quedaron verdes.
- Verde `371f6442`: `Test Suites: 1 passed, 1 total`; `Tests: 10 passed, 10
  total`. `tsc --noEmit`, Prettier y ESLint limpios.

### R3

- Rojo `54ff0c7f`: `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 1
  passed, 3 total`. Zona IANA valida ya verde. Para `null`, `Expected number
  of calls: 1`, `Received number of calls: 0`. Para `Not/A/Zone`, esperaba
  resolucion UTC y recibio `InvalidTimeZoneError: unknown IANA time zone:
  Not/A/Zone`.
- Verde `550b2039`: `Test Suites: 2 passed, 2 total`; `Tests: 13 passed, 13
  total` (`owner-local-day` + `vaccine-mutations`). `tsc --noEmit`, Prettier
  y ESLint limpios.
- Refactor `67f8f0de`: `get-pet.use-case` delega en `ownerLocalDay`.
  `Test Suites: 1 passed, 1 total`; `Tests: 10 passed, 10 total`. Su spec
  heredado queda sin diff; `tsc --noEmit` y ESLint limpios.

### R4

- Rojo `cc6382ac`, `2026-09-11T03:35:08+00:00`: `Test Suites: 1 failed, 1
  total`; `Tests: 2 failed, 18 passed, 20 total`. En Pago_Pago, POST y
  PATCH: `expected 400 "Bad Request", got 500 "Internal Server Error"`.
  Los 18 tests heredados quedaron verdes.
- Verde `f6df8e8e`: e2e de vacunas `Test Suites: 1 passed, 1 total`;
  `Tests: 20 passed, 20 total`. Unitarios relacionados: `Test Suites: 3
  passed, 3 total`; `Tests: 23 passed, 23 total`. `tsc --noEmit`, Prettier
  y ESLint limpios.

## Regresión (R5)

- `git diff --name-only f3e3280...HEAD -- backend-pet-tracker/`: exactamente
  los once archivos de `design.md`:

```text
backend-pet-tracker/src/modules/health/application/dto/vaccine.dto.ts
backend-pet-tracker/src/modules/health/application/use-cases/create-vaccine.use-case.ts
backend-pet-tracker/src/modules/health/application/use-cases/update-vaccine.use-case.ts
backend-pet-tracker/src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts
backend-pet-tracker/src/modules/health/domain/errors/vaccine.errors.ts
backend-pet-tracker/src/modules/health/infrastructure/mappers/vaccine-error.mapper.ts
backend-pet-tracker/src/modules/health/infrastructure/vaccines.controller.ts
backend-pet-tracker/src/modules/pets/application/owner-local-day.spec.ts
backend-pet-tracker/src/modules/pets/application/owner-local-day.ts
backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.ts
backend-pet-tracker/test/health-vaccines.e2e-spec.ts
```

- Diff movil vacio. Diff vacio en todos los candados de R5-(b)/(c).
  `todayIsoDateUtc` no aparece en `vaccine.dto.ts`. El unico hunk de
  `health-vaccines.e2e-spec.ts` añade el describe R4.
- E2E vacunas: `Test Suites: 1 passed, 1 total`; `Tests: 20 passed, 20
  total`.
- E2E completo: `Test Suites: 3 skipped, 25 passed, 25 of 28 total`;
  `Tests: 8 skipped, 359 passed, 367 total`. Los skips son suites AWS
  condicionadas; `init.sh` no emitio el aviso «se saltan los e2e».
- `env -u FORCE_COLOR bash ./init.sh`, primera corrida exit 0. Backend:
  `Test Suites: 164 passed, 164 total`; `Tests: 1256 passed, 1256 total`.
  Infra: `2 passed`, `14 passed`. Movil: `68 passed`, `1111 passed`. E2E:
  `25 passed`, `359 passed`. Ultima linea: `✅ Todo verde. Listo para
  trabajar.` Sin flake #72; no hubo segunda corrida.

## Mutación (R6)

### M1 — helper devuelve dia UTC

- Hora e2e: `2026-09-11T03:42:24+00:00`.
- Unitario: `Test Suites: 3 failed, 3 total`; `Tests: 6 failed, 17 passed,
  23 total`.

```text
R1 create / R2 update, manana CDMX:
Received promise resolved instead of rejected

R1 create / R2 update, hoy Kiritimati:
Received promise rejected instead of resolved
Rejected to value: VaccineAppliedInFutureError: Applied date cannot be in the future

R3 ownerLocalDay, zona valida:
Expected: "2026-08-10"
Received: "2026-08-11"

#82 R1 GetPetUseCase:
Expected: PET_ID, "2026-08-09"
Received: PET_ID, "2026-08-10"
```

- E2E: `Test Suites: 1 failed, 1 total`; `Tests: 3 failed, 17 passed, 20
  total`.

```text
R4 POST Pago_Pago:
expected 400 "Bad Request", got 201 "Created"

R4 PATCH Pago_Pago:
expected 400 "Bad Request", got 200 "OK"

#82 R3 Pago_Pago:
Expected: name "Hoy", nextDoseAt "2026-09-10"
Received: name "Manana", nextDoseAt "2026-09-11"
```

- Reversion: `git checkout --
  backend-pet-tracker/src/modules/pets/application/owner-local-day.ts`;
  despues solo quedo el reporte sin trackear.

### M2 — `>` cambia a `>=`

- Hora e2e: `2026-09-11T03:43:02+00:00`.
- Unitario: `Test Suites: 1 failed, 2 passed, 3 total`; `Tests: 4 failed,
  19 passed, 23 total`. Fallaron solo R1(1), R1(3), R2(1) y R2(3), que
  cubren CDMX y Kiritimati.

```text
R1(1), R1(3), R2(1), R2(3):
Received promise rejected instead of resolved
Rejected to value: VaccineAppliedInFutureError: Applied date cannot be in the future
```

- E2E: `Test Suites: 1 failed, 1 total`; `Tests: 2 failed, 18 passed, 20
  total`.

```text
R4 POST, hoy:
expected 201 "Created", got 400 "Bad Request"

R4 PATCH, hoy:
expected 200 "OK", got 400 "Bad Request"
```

  Cada `it` recorre Kiritimati primero; Jest corta el loop en esa primera
  asercion roja. Los unitarios R1(1)(3)/R2(1)(3) prueban ambos instantes.
- Reversion: `git checkout --` sobre ambos use cases; despues solo quedo el
  reporte sin trackear. Ninguna mutacion fue versionada.
- Arbol restaurado: unitarios `Test Suites: 3 passed, 3 total`; `Tests: 23
  passed, 23 total`. E2E vacunas `Test Suites: 1 passed, 1 total`; `Tests:
  20 passed, 20 total`.
