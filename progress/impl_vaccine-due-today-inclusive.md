# Implementación — vaccine-due-today-inclusive (#82)

## T0

- Branch: `feature/82-vaccine-due-today-inclusive`.
- Merge-base con `origin/main`: `7f298f2b0ce76ede6d94f073373c0d895887fd03`.
- Postgres y LocalStack compartidos disponibles; sin proceso real `bash ./init.sh` ni `test:e2e` durante la corrida.
- Node v20.20.2: `Intl.supportedValuesOf('timeZone')` incluye `Pacific/Kiritimati` y `Pacific/Pago_Pago` (`true true`).
- `localDayOf(Date.parse('2026-08-10T03:00:00.000Z'), 'America/Mexico_City')`: `2026-08-09`.
- Gate inicial: `env -u FORCE_COLOR bash ./init.sh` exit 0, última línea `✅ Todo verde. Listo para trabajar.`, con e2e ejecutados.
- Referencia `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`: `Tests: 15 passed, 15 total`.

## Rojo/verde por commit

### Commit 1 — rojo R1

- Commit: `8a17b2a`.
- `get-pet.use-case.spec.ts`: `Expected: PET_ID`; `Number of calls: 0` para `findOwnerTimezone`; `Tests: 1 failed, 6 passed, 7 total`.
- `pets.controller.spec.ts`: `Expected: PET_ID, Any<Date>` / `Received: PET_ID`; `Tests: 1 failed, 16 passed, 17 total`.

### Enmienda A1

- Los dos unitarios quedaron verdes: `Tests: 24 passed, 24 total`.
- `pnpm -C backend-pet-tracker exec tsc --noEmit` falla porque `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts:110` devuelve un `MockOf<PetRepository>` exhaustivo que no incluye el método nuevo:

```text
error TS2741: Property 'findOwnerTimezone' is missing in type '{ createWithOwner: jest.Mock; findAllByMember: jest.Mock; findMembership: jest.Mock; findById: jest.Mock; update: jest.Mock; delete: jest.Mock; }' but required in type 'MockOf<PetRepository>'.
```

- El leader añadió ese spec como décimo archivo en A1 y el humano ratificó la enmienda. `petsStub` gana únicamente `findOwnerTimezone: jest.fn(),` en el commit 2.

### Commit 2 — verde R1

- Commit: `bb30e6d`.
- Tests acotados de use case, controller y alerts-engine: `Tests: 62 passed, 62 total`.
- `pnpm -C backend-pet-tracker exec tsc --noEmit`: exit 0.
- ESLint/Prettier acotado a los siete archivos de R1/A1: exit 0.

### Commit 3 — rojo R2

- Commit: `71723b3`.
- Owner `null`: `Expected number of calls: 1` / `Received number of calls: 0` para `Logger.warn`.
- Owner `Not/A/Zone`: escapó `InvalidTimeZoneError: unknown IANA time zone: Not/A/Zone`.
- Resultado: `Tests: 2 failed, 8 passed, 10 total`.

### Commit 4 — verde R2

- Commit: `d0a56bf`.
- `get-pet.use-case`: `Tests: 10 passed, 10 total`.
- Typecheck y ESLint acotado: exit 0.

### Commit 5 — rojo R3/R4/R5

- Commit: `bcfe7c3`.
- R3: `Expected { name: "Hoy", nextDoseAt: "2026-09-11" }`; `Received { name: "Manana", nextDoseAt: "2026-09-12" }`.
- R4: `Expected: "2026-09-11"`; `Received: "2026-09-12"`.
- R5: `Expected: "2026-09-10"`; `Received: "2026-09-11"`.
- Resultado: `Tests: 3 failed, 15 passed, 18 total`; únicamente fallaron los tres `it` nuevos.

### Commit 6 — verde R3/R4/R5

- Commit: `7306dff`.
- `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`: `Tests: 18 passed, 18 total`.
- Typecheck, ESLint/Prettier y comprobación del rename limitado a los dos archivos previstos: exit 0.

## Regresión (R6)

- `git diff --name-only 7f298f2...HEAD -- backend-pet-tracker/`: exactamente los diez archivos de `design.md` §Archivos afectados.
- `git diff --stat 7f298f2...HEAD -- mobile-pet-tracker/`: vacío.
- `test/pets.e2e-spec.ts`: diff vacío; `ListPetsUseCase` no contiene `PET_VACCINE_READER` ni `findNextVaccine`; el describe R13 heredado quedó fuera de los hunks modificados.
- E2E específico: `Tests: 18 passed, 18 total`.
- Suite e2e completa: `Test Suites: 3 skipped, 25 passed, 25 of 28 total`; `Tests: 8 skipped, 357 passed, 365 total`.
- `env -u FORCE_COLOR bash ./init.sh`: exit 0, e2e ejecutados con los mismos 357 tests pasados, sin aviso «se saltan los e2e»; última línea `✅ Todo verde. Listo para trabajar.`.

## Mutación (R7)

### M1 — `gte` → `gt`

- Se aplicó solo en `pet-vaccine.drizzle-reader.ts` y no se commiteó.
- `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`: `Tests: 3 failed, 15 passed, 18 total`.
- R3 detectó la mutación en ambas zonas: para `Pacific/Kiritimati`, esperaba `Hoy`/`2026-09-11` y recibió `Manana`/`2026-09-12`; para `Pacific/Pago_Pago`, esperaba `Hoy`/`2026-09-10` y recibió `Manana`/`2026-09-11`.
- R4 esperaba `2026-09-11` y recibió `2026-09-12`; R5 esperaba `2026-09-10` y recibió `2026-09-11`.

### M2 — `findOwnerTimezone()` devuelve siempre `null`

- Se aplicó solo en `pet.drizzle.repository.ts` y no se commiteó.
- Suite unitaria: `Test Suites: 163 passed, 163 total`; `Tests: 1246 passed, 1246 total`, confirmando que la mutación exige cobertura e2e.
- Hora de la prueba: `Thu Sep 10 20:32:44 UTC 2026`.
- E2E específico: `Tests: 2 failed, 16 passed, 18 total`.
- R3, para `Pacific/Kiritimati`, esperaba `Hoy`/`2026-09-11` y recibió `Ayer`/`2026-09-10`; el caso `Pacific/Pago_Pago` siguió verde porque su día local coincidía con UTC en ese instante.
- R4 esperaba `2026-09-11` y recibió `2026-09-10`. R5 siguió verde, demostrando que el fallback UTC para timezone no IANA se conserva.
- Tras revertir M1 y M2, ambos archivos quedaron sin diff y el e2e específico volvió a `Tests: 18 passed, 18 total`.
- Gate final tras las reversiones: `env -u FORCE_COLOR bash ./init.sh` exit 0; backend `1246 passed`, móvil `1111 passed`, e2e `357 passed`/`8 skipped`, lint y typecheck verdes; última línea `✅ Todo verde. Listo para trabajar.`.
