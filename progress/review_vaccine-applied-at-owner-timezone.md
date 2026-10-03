# review: vaccine-applied-at-owner-timezone (#88)
Fecha: 2026-09-11T04:05Z
Veredicto: APROBADO
Hash del veredicto: `dc9ee8dd5ad5c60bba35fcac0345751c5bc837a4` (= `origin/feature/88-vaccine-applied-at-owner-timezone`)
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend`, branch `feature/88-vaccine-applied-at-owner-timezone`, commit base `f3e3280`.

> Toda la evidencia de abajo es propia (reproducida por el reviewer), no
> copiada de `progress/impl_vaccine-applied-at-owner-timezone.md`. Los rojos
> se corrieron en un worktree desechable (`scratchpad/wt-88-red`, borrado con
> `git worktree remove --force` al terminar; `git worktree list` limpio). Ante
> cada e2e e `init.sh`: `pgrep -af 'init\.sh'` y `pgrep -af 'test:e2e'`
> vacíos (hora UTC anotada en cada corrida). Los jest unitarios no tocan
> Postgres.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (#88)
- [x] `progress/current.md` describe la sesión activa de #88 (worktree, branch, estado)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `vaccine.errors.ts` no tiene ningún `import`
- [x] repositorios/contratos en domain son interfaces puras: ningún puerto cambia (`pet.repository.ts` sin diff)
- [x] application depende de interfaces: `owner-local-day.ts` recibe `PetRepository` (tipo del puerto) + `@/pipeline/local-day`; `create/update-vaccine.use-case.ts` importan el helper desde `@/modules/pets/application/` (application → application, D4)
- [x] infrastructure sin lógica de negocio: `vaccines.controller.ts` solo iza `const now = new Date()`; `vaccine-error.mapper.ts` solo mapea `VaccineAppliedInFutureError` → 400
- [x] Sin import de `modules/activity` en los once archivos (`grep` vacío)

## Checklist C4 — TDD
- [x] Cada R<n> tiene al menos un test que lo nombra (R1, R2, R3, R4 en describes; R5/R6 de verificación, reproducidos abajo)
- [x] Historial test-primero: diez commits de Codex en el orden exacto de design.md D10, cada rojo antes de su verde
- [x] Ningún rojo por `ReferenceError` de helper ni por mutación de mock (los cuatro rojos verificados abajo)
- [x] R5/R6 declarados por escrito antes del handoff como verificación vía (b) y aceptados por el humano (tercera casilla de requirements.md)

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (solo aparece la palabra en la regla)
- [x] Commits siguen `test|feat|refactor|docs(vaccine-applied-at-owner-timezone): <desc> (R-ids)`
- [x] Todos los hashes citados en `traceability.md` y en el reporte de Codex son ancestros de `HEAD` (`git merge-base --is-ancestor` exit 0 para 2ed46268, 35b42255, 5d75a820, 371f6442, 54ff0c7f, 550b2039, 67f8f0de, cc6382ac, f6df8e8e, f3e3280). `1042733`/`2493698` en el reporte son PIDs de shells, no hashes.

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` y las tres casillas marcadas (fecha 2026-09-10)
- [x] Firma humana en commit `bf94ec11` (AlexisSM377, «Approve Vaccine Timezone Specification»). Después de esa firma solo cambió el frontmatter `status: draft → approved` en requirements/design/tasks (`59237fa9`, leader); ningún requisito editado tras el gate.

## Checklist C7 — Sin código huérfano
- [x] La resolución inline de `GetPetUseCase` (`findOwnerTimezone` → `isSupportedTimeZone` → warn → `localDayOf`) se eliminó en `67f8f0de` al delegar en `ownerLocalDay`; `Logger` e imports de `local-day` retirados del use case
- [x] Sus tests no cambian (candado): `get-pet.use-case.spec.ts` sin diff y verde
- [x] El `refine` UTC del DTO eliminado en `f6df8e8e`; `grep todayIsoDateUtc vaccine.dto.ts` vacío; `iso-date.ts` sin diff (sigue en uso por `weight.dto.ts`)

## Checklist C8 — UI móvil
- N/A: diff cero bajo `mobile-pet-tracker/`.

---

## Evidencia por punto del encargo

### 1. C4 / historial y rojos reproducidos

`git log --oneline f3e3280..HEAD` (de más antiguo a más nuevo):
```
2ed46268 test(...): create compares appliedAt with the owner local day (R1)
35b42255 feat(...): validate appliedAt against the owner local day on create (R1)
5d75a820 test(...): update compares appliedAt with the owner local day only when present (R2)
371f6442 feat(...): validate appliedAt against the owner local day on update (R2)
54ff0c7f test(...): ownerLocalDay falls back to UTC with a warn on null or non-IANA zone (R3)
550b2039 feat(...): ownerLocalDay falls back to UTC with a warn (R3)
67f8f0de refactor(...): GetPetUseCase delegates the owner day to ownerLocalDay (R3)
cc6382ac test(...): e2e appliedAt today and tomorrow in the owner zone for POST and PATCH (R4)
f6df8e8e feat(...): drop the UTC refine from the vaccine DTO and map VaccineAppliedInFutureError to the validation 400 (R4)
dc9ee8dd docs(...): mutation evidence, regression sweep and traceability (R5,R6)
```
Antes: `587fac58`, `6fd1b016`, `8dc0b26d` (docs leader), `bf94ec11` (humano), `59237fa9` (docs leader). Coincide con D10.

**Rojo R1 @ 2ed46268** (`pnpm test -- vaccine-mutations`): `Tests: 3 failed, 3 passed, 6 total`
```
› acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)
    Expected: "0198b2c3-4d5e-7a01-b234-56789abcdef0"   Number of calls: 0
› rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)
    Received promise resolved instead of rejected
› acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)
    Expected: "0198b2c3-4d5e-7a01-b234-56789abcdef0"   Number of calls: 0
```
Por aserción (`findOwnerTimezone` 0 llamadas; promesa resuelta). R12 heredado verde.

**Verde mínimo @ 35b42255**: `Tests: 6 passed, 6 total`. `owner-local-day.ts` = `localDayOf(now.getTime(), timezone ?? 'UTC')`; `grep isSupportedTimeZone|warn|Logger` vacío; `vaccine.dto.ts` y `vaccine-error.mapper.ts` sin diff respecto a `f3e3280` en ese commit.

**Rojo R2 @ 5d75a820**: `Tests: 4 failed, 6 passed, 10 total`
```
› acepta hoy local (CDMX)          Received promise rejected instead of resolved
                                   Rejected to value: [TypeError: this.audit.record is not a function]
› rechaza manana local (CDMX)      Expected substring: "Applied date cannot be in the future"
                                   Received message:   "this.audit.record is not a function"
› acepta hoy local (Kiritimati)    Received promise rejected instead of resolved  [mismo TypeError]
› sin appliedAt no consulta zona   Received promise rejected instead of resolved  [mismo TypeError]
```
Rojo por la firma de producción que R2 crea (constructor de 2 params: `audit` recibe el mock de `pets`), exactamente como lo predijo la spec. No es `ReferenceError` de helper ni mock mutado.

**Rojo R3 @ 54ff0c7f** (`pnpm test -- owner-local-day`): `Tests: 2 failed, 1 passed, 3 total`
```
› sin owner activo (null) ...      Expected number of calls: 1   Received number of calls: 0
› con 'Not/A/Zone' ...             Received promise rejected instead of resolved
                                   Rejected to value: [InvalidTimeZoneError: unknown IANA time zone: Not/A/Zone]
```
(1) ya verde, como anticipaba la spec.

**Rojo R4 @ cc6382ac** (e2e contra Postgres, pgrep vacío, `2026-09-11T03:58:22Z`, franja `h<10` de D8): `Tests: 2 failed, 18 passed, 20 total`
```
› POST acepta hoy y rechaza manana ... (R4)    expected 400 "Bad Request", got 500 "Internal Server Error"
› PATCH acepta hoy y rechaza manana ... (R4)   expected 400 "Bad Request", got 500 "Internal Server Error"
```
Rojo por status: «mañana» de Pago_Pago pasa el zod UTC, el use case lanza y el mapper aún no mapea → 500. DTO y mapper sin diff en ese commit. Los 18 heredados verdes.

### 2. Alcance
`git diff --name-only f3e3280...HEAD -- backend-pet-tracker/` = exactamente los once de design.md §Archivos afectados (377+/35-). Diff vacío en `mobile-pet-tracker/`, `infra/`, `src/modules/activity/`, `iso-date.ts`, `weight.dto.ts`, `create-pet.dto.ts`, `health.module.ts`, `package.json` (raíz y backend).

### 3. R1/R2 unitarios
`pnpm -C backend-pet-tracker test -- vaccine-mutations owner-local-day get-pet.use-case` → `Test Suites: 3 passed, 3 total; Tests: 23 passed, 23 total`.
- `CreateVaccineUseCase.execute(petId, dto, userId, now)`: la comparación `dto.appliedAt > (await ownerLocalDay(...))` es la primera sentencia del cuerpo (antes de `findCatalogById`).
- `UpdateVaccineUseCase(vaccines, pets, audit)`: `PET_REPOSITORY` como segundo parámetro; guarda `dto.appliedAt !== undefined &&` antes de la comparación y antes del test UUID/`findByIdAndPet`. El `it` R2(4) verde demuestra que sin `appliedAt` no se llama `findOwnerTimezone`.
- Los tres `it` de #14 R12 siguen presentes con nombre intacto (`create/update/delete no audita si ... falla`); los dos primeros adaptados como dice traceability.md.
- `vaccines.controller.ts`: exactamente un `new Date()` en `create` (`:65`) y uno en `update` (`:95`), sin `Date.now()`.

### 4. R3
`src/modules/pets/application/owner-local-day.ts`: `ownerLocalDay(pets, petId, now)`, `raw !== null && isSupportedTimeZone(raw) ? raw : 'UTC'`, un solo `logger.warn({ scope, petId, timezone: raw, message })` dentro de `if (timezone !== raw)`. `GetPetUseCase` delega (`const today = await ownerLocalDay(this.pets, petId, now)`), `Logger` retirado. `git diff --stat f3e3280...HEAD -- .../get-pet.use-case.spec.ts` vacío y verde (10/10 dentro de los 23).

### 5. R4 e2e
`pnpm -C backend-pet-tracker run test:e2e -- health-vaccines` @ HEAD (`03:58:48Z`): `Tests: 20 passed, 20 total`. Describe R4 leído: par `['Pacific/Kiritimati', 'Pacific/Pago_Pago']` con índice en el label, `today = localDayOf(Date.now(), timezone)` una vez por zona antes de las peticiones, POST hoy → 201 + `body.appliedAt === today`, mañana → 400 con `toEqual({ statusCode: 400, message: 'Validation failed', errors: [{ path: 'appliedAt', message: 'Applied date cannot be in the future' }] })`; PATCH sobre vacuna `'2025-01-01'` con hoy → 200 y mañana → 400 mismo body. `vaccine.dto.ts` sin `refine` ni `todayIsoDateUtc`; `vaccine-error.mapper.ts` mapea `VaccineAppliedInFutureError` con esa forma exacta (D5).

### 6. R5 regresión
- Sin diff: `get-pet.use-case.spec.ts`, `pets.controller.spec.ts`, `pets.controller.ts`, `alerts-engine-consumer.service.spec.ts`, `local-day.spec.ts`, `test/pets.e2e-spec.ts`, `test/health-weights.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts`, `iso-date.ts`, `weight.dto.ts`, `create-pet.dto.ts`, `health.module.ts`, `pet.repository.ts`.
- `health-vaccines.e2e-spec.ts`: un solo hunk (`@@` = 1), el describe R4 al final; los `appliedAt` fijos `'2026-01-01'`, `'2024-02-29'`, `'2025-01-01'` siguen en los describes heredados y `'2999-01-01'` (`:313`) sigue → 400; todo verde en los 20/20.
- Unitaria completa (dentro de init.sh): `Test Suites: 164 passed, 164 total; Tests: 1256 passed, 1256 total`.
- E2E completa dos veces consecutivas (pgrep vacío antes de cada una, `04:00:00Z` y `04:01:35Z`): ambas `Test Suites: 3 skipped, 25 passed, 25 of 28 total; Tests: 8 skipped, 359 passed, 367 total`.

### 7. R6 mutaciones (reproducidas por el reviewer, no versionadas)

**M1** — `owner-local-day.ts`: `return localDayOf(now.getTime(), timezone)` → `return now.toISOString().slice(0, 10)` (llamada a `findOwnerTimezone` intacta).
Unitario: `Test Suites: 3 failed, 3 total; Tests: 6 failed, 17 passed, 23 total`
```
#82 R1 GetPetUseCase › pasa a findNextVaccine el dia local del owner ...
    Expected: "0198b2c3-...", "2026-08-09"   Received: "0198b2c3-...", "2026-08-10"
R1 › rechaza manana local (CDMX)          Received promise resolved instead of rejected
R1 › acepta hoy local (Kiritimati)        Received promise rejected instead of resolved
                                          Rejected to value: [VaccineAppliedInFutureError: Applied date cannot be in the future]
R2 › rechaza manana local (CDMX)          Received promise resolved instead of rejected
R2 › acepta hoy local (Kiritimati)        Received promise rejected instead of resolved  [mismo error]
R3 › con zona IANA valida ...             Expected: "2026-08-10"   Received: "2026-08-11"
```
E2E (`03:59:08Z`, pgrep vacío): `Tests: 3 failed, 17 passed, 20 total`
```
R4 › POST ... (R4)     expected 400 "Bad Request", got 201 "Created"
R4 › PATCH ... (R4)    expected 400 "Bad Request", got 200 "OK"
#82 R3 › devuelve la dosis de hoy para owners en Pacific/Kiritimati y Pacific/Pago_Pago (R3)   Expected -3 / Received +3
```
Reversión: `git checkout -- backend-pet-tracker/src/modules/pets/application/owner-local-day.ts`; `git status --short` vacío.

**M2** — `create-vaccine.use-case.ts` y `update-vaccine.use-case.ts`: `dto.appliedAt > (await ownerLocalDay` → `>=` (el código compara con `>`; es la mutación equivalente al «`<=` → `<`» del encargo: hoy pasa a rechazarse).
Unitario: `Test Suites: 1 failed, 2 passed, 3 total; Tests: 4 failed, 19 passed, 23 total` — exactamente R1(1), R1(3), R2(1), R2(3):
```
Received promise rejected instead of resolved
Rejected to value: [VaccineAppliedInFutureError: Applied date cannot be in the future]
```
E2E (`03:59:38Z`, pgrep vacío): `Tests: 2 failed, 18 passed, 20 total`
```
R4 › POST ... (R4)     expected 201 "Created", got 400 "Bad Request"
R4 › PATCH ... (R4)    expected 200 "OK", got 400 "Bad Request"
```
Reversión: `git checkout -- <los dos use cases>`; `git status --short` vacío; unitario de nuevo `23 passed, 23 total`.

### 8. Traceability y hashes
Ver C5. Filas R1-R6 cubiertas con test y commit; tabla de criterios 1-4 cubierta; los dos `it` de #14 R12 adaptados listados en «Tests de features anteriores actualizados».

### 9. Gate
`env -u FORCE_COLOR bash ./init.sh` (primer plano, `04:03:25Z`, pgrep vacío): exit 0, sin el aviso «se saltan los e2e», sin flake #72 (`PASS src/screens/add-pet/index.test.tsx`), una sola corrida. Backend `1256 passed`; infra `14 passed`; móvil `68 suites / 1111 passed`; e2e `25 passed / 359 passed`. Línea de veredicto:
```
✅ Todo verde. Listo para trabajar.
```

### 10. Drift
`git fetch origin` → `HEAD` = `dc9ee8dd5ad5c60bba35fcac0345751c5bc837a4` = `origin/feature/88-vaccine-applied-at-owner-timezone`. `git status --short` vacío.

### 11. CHECKPOINTS C2-C7 y calidad
Capas: helper en `pets/application`, error en `health/domain/errors`, mapper en `health/infrastructure/mappers`; sin import de `activity`. `prettier --check` sobre los once: «All matched files use Prettier code style!»; `eslint` exit 0; `tsc --noEmit` exit 0. `grep console.log|TODO|FIXME` sobre los once vacío.

## Observaciones
Ninguna que bloquee. Nota para el leader al cerrar (ya prevista en la spec §Fuera de alcance): `feature_list.json` #88 lista `iso-date.ts` en `files_affected` y no cambia; la lista real son los once de design.md.

## Output de ./init.sh
```
Test Suites: 164 passed, 164 total
Tests:       1256 passed, 1256 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 68 passed, 68 total
Tests:       1111 passed, 1111 total
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 359 passed, 367 total
✅ Typecheck sin errores
══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.
  Features: 70/87 completadas | 16 pendientes
```
