# review: vaccine-due-today-inclusive (#82)
Fecha: 2026-09-10 21:42 UTC
Veredicto: APROBADO
Hash revisado: `ba2861812d0414ef201a1a2e01dc8dd6b712f9c3` (= `origin/feature/82-vaccine-due-today-inclusive`)
Worktree: `/home/claude/sites/Pet-Tracker-wt-backend`, branch `feature/82-vaccine-due-today-inclusive`, base `7f298f2`

> Toda la evidencia de abajo la produjo el reviewer; no se reutiliza ninguna
> cifra del reporte de Codex. Rutas relativas a `backend-pet-tracker/` salvo
> indicación. Postgres compartido: `pgrep -af 'init\.sh'` y `pgrep -af
> 'test:e2e'` vacíos antes de cada e2e y del gate (21:32, 21:32, 21:33,
> 21:35, 21:36, 21:37, 21:37 UTC).

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` (`feature_list.json`: #82)
- [x] `progress/current.md` describe la sesión activa de #82

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `pet.repository.ts` importa solo `../entities/*`; `pet-vaccine-reader.ts` sin imports
- [x] repositorios/contratos en domain son interfaces puras (`findOwnerTimezone(petId: string): Promise<string | null>` sin implementación)
- [x] application depende de interfaces: `get-pet.use-case.ts` usa `PetRepository`/`PetVaccineReader` por token y `@/pipeline/local-day` (funciones puras; precedente `activity/application/use-cases/list-trips.use-case.ts`)
- [x] infrastructure sin lógica de negocio: `pet.drizzle.repository.ts` devuelve la columna cruda; la resolución IANA + fallback vive en el use case (D8)
- [x] `grep -rn "modules/activity" src/modules/pets src/modules/health` vacío

## Checklist C4 — TDD
- [x] Cada R<n> tiene test que lo nombra: R1, R2 en `get-pet.use-case.spec.ts`; R3, R4, R5 en `test/health-vaccines.e2e-spec.ts`; R6, R7 son de verificación declarados antes del handoff (vía (b), firmados por el humano)
- [x] Historial test-primero: `git log --oneline 7f298f2..HEAD` muestra los siete commits de D11 en orden (8a17b2a → bb30e6d → 71723b3 → d0a56bf → bcfe7c3 → 7306dff → ba28618); los commits de test solo tocan specs, los `feat` solo producción (+ el `petsStub` de A1 en bb30e6d)
- [x] Ningún rojo por `ReferenceError` ni por mutación de doble (reproducidos en worktree desechable, ver §1)

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (`grep -i pendiente` solo devuelve la regla, línea 28)
- [x] R1-R7 con test y commit; commits `test|feat|docs(vaccine-due-today-inclusive): … (R…)`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` `status: approved`, tres casillas marcadas (2026-09-10) y A1 ratificada (2026-09-10, commit humano 063cd50)

## Checklist C7 — Sin código huérfano
- [x] El describe R13 de #14 fue **reescrito** como R1 (no borrado ni duplicado), documentado en traceability
- [x] N/A en lo demás — no se reemplaza ningún módulo

---

## Evidencia por punto

### 1. C4 / historial (worktree desechable en `scratchpad/wt-82-red`, borrado al final)

`git log --oneline 7f298f2..HEAD` (solo Codex): `8a17b2a test R1`, `bb30e6d feat R1`, `71723b3 test R2`, `d0a56bf feat R2`, `bcfe7c3 test R3-R5`, `7306dff feat R3-R5`, `ba28618 docs R6,R7`. Intercalados 137843a (leader, A1) y 063cd50 (humano).

**Rojo R1 @ 8a17b2a** (`pnpm test -- get-pet.use-case pets.controller`), por aserción:
```
● R1 (…) › pasa a findNextVaccine el dia local del owner calculado desde now, no el dia UTC
    Expected: "0198b2c3-4d5e-7a01-b234-56789abcdef0"
    Number of calls: 0
    > 196 |     expect(deps.findOwnerTimezone).toHaveBeenCalledWith(PET_ID);
● R8: GET /v1/pets/:petId … › usa el petId y el rol adjuntados por PetAccessGuard
    Expected: "0198b2c3-…", Any<Date>
    Received: "0198b2c3-…"
Tests:       2 failed, 22 passed, 24 total
```
**Rojo R2 @ 71723b3** (`pnpm test -- get-pet.use-case`), por conteo del warn e `InvalidTimeZoneError` de producción (`local-day.ts:186`):
```
● R2 (…) › sin owner activo (null) usa el dia UTC de now y avisa una vez
    Expected number of calls: 1
    Received number of calls: 0
● R2 (…) › con 'Not/A/Zone' usa el dia UTC de now y avisa una vez
    InvalidTimeZoneError: unknown IANA time zone: Not/A/Zone
Tests:       2 failed, 8 passed, 10 total
```
**Rojo R3-R5 @ bcfe7c3** (`run test:e2e -- health-vaccines`, 21:32 UTC, pgrep vacíos), por aserción, `Manana` en las dos zonas:
```
● R3 … › devuelve la dosis de hoy para owners en Pacific/Kiritimati y Pacific/Pago_Pago (R3)
    -     "name": "Hoy",      "nextDoseAt": "2026-09-11",
    +     "name": "Manana",   "nextDoseAt": "2026-09-12",
    -     "name": "Hoy",      "nextDoseAt": "2026-09-10",
    +     "name": "Manana",   "nextDoseAt": "2026-09-11",
● … › un family en otra zona ve el nextVaccine del dia del owner (R4)
    Expected: "2026-09-11"   Received: "2026-09-12"   (línea 673)
● … › owner con timezone fuera del catalogo IANA responde 200 con el hoy UTC (R5)
    Expected: "2026-09-10"   Received: "2026-09-11"   (línea 717)
Tests:       3 failed, 15 passed, 18 total
```
Sin `ReferenceError`, sin diagnóstico TS. `git worktree remove --force` + `prune` hechos; `git worktree list` ya no lo muestra.

### 2. Alcance

`git diff --name-only 7f298f2...HEAD -- backend-pet-tracker/` = exactamente los diez de design.md §Archivos afectados (A1):
`src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts`, `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts`, `…/get-pet.use-case.ts`, `src/modules/pets/domain/ports/pet-vaccine-reader.ts`, `src/modules/pets/domain/repositories/pet.repository.ts`, `src/modules/pets/infrastructure/pets.controller.spec.ts`, `…/pets.controller.ts`, `…/repositories/pet.drizzle.repository.ts`, `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`, `test/health-vaccines.e2e-spec.ts`.
`git diff --name-only 7f298f2...HEAD -- mobile-pet-tracker/ infra/ backend-pet-tracker/src/modules/activity/` vacío. `git diff 7f298f2...HEAD -- backend-pet-tracker/package.json` vacío.
`alerts-engine-consumer.service.spec.ts`: una sola línea añadida, `+    findOwnerTimezone: jest.fn(),` (línea 114).

### 3. R1/R2 unitarios (HEAD)

`pnpm test -- get-pet.use-case pets.controller` → `Tests: 27 passed, 27 total` (10 + 17).
- Describe R13 de #14 reescrito: el diff muestra `-describe('R13 (health-vaccines #14): …` → `+describe('R1 (vaccine-due-today-inclusive #82, sustituye a R13 de #14): …`; `it('pasa a findNextVaccine el dia local del owner calculado desde now, no el dia UTC')`, `findOwnerTimezone` → `'America/Mexico_City'`, aserción `('2026-08-09')`, sin fake timers.
- `pets.controller.ts:88` `const now = new Date();` única en `detail`; se pasa a `execute(petId, now)` (`:91-94`) y a `toPetProfileResponse(…, now, …)` (`:99`). `get-pet.use-case.ts:56` `execute(petId: string, now: Date)`.
- `pet.repository.ts:47-48`: doc + `findOwnerTimezone(petId: string): Promise<string | null>`. `pet.drizzle.repository.ts:114-130`: `select({ timezone: users.timezone }).from(petUsers).innerJoin(users, …).where(petId, role='owner', status='active').orderBy(asc(petUsers.createdAt)).limit(1)`, `return rows[0]?.timezone ?? null`.
- `get-pet.use-case.ts:70-84`: `timezone = ownerTimezone !== null && isSupportedTimeZone(ownerTimezone) ? ownerTimezone : 'UTC'`; `if (timezone !== ownerTimezone) this.logger.warn({ scope: 'get-pet', petId, timezone: ownerTimezone, message })` — una vez, solo en fallback (zona válida `'UTC'` no avisa). `localDayOf(now.getTime(), timezone)` como 2.º argumento de `findNextVaccine` (`:90-93`).
- R2: tres `it` exactos, `warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation()` en `beforeEach`, `mockRestore` en `afterEach`.

### 4. R3-R5 e2e (HEAD)

`run test:e2e -- health-vaccines` (21:32 UTC) → `Tests: 18 passed, 18 total`.
Describe `'R3 (vaccine-due-today-inclusive #82): la dosis de hoy en la zona del owner es la proxima'` (`test/health-vaccines.e2e-spec.ts:562-719`): R3 itera `['Pacific/Kiritimati', 'Pacific/Pago_Pago']`, `today = localDayOf(Date.now(), timezone)` una vez por owner antes del único `db.insert(petVaccines).values([...])`, `toEqual` sobre `{id: todayId, name: 'Hoy', nextDoseAt: today}` por zona. R4: owner Kiritimati, B en Pago_Pago con `petUsers {role:'family', status:'active'}`, `GET` con `auth(family.token)`, `todayA` de Kiritimati. R5: `seedUser('r5-tz', 'Not/A/Zone')`, `dateOffset(-1|0|1)`, `.expect(200)`, `nextDoseAt === dateOffset(0)`.
`gte` + `from` solo en `pet-vaccine.drizzle-reader.ts` (`:2`, `:17`, `:27`) y `pet-vaccine-reader.ts:10-11` (7306dff toca exactamente esos dos archivos).

### 5. R6 regresión

- `git diff --stat 7f298f2...HEAD -- test/pets.e2e-spec.ts src/modules/pets/application/use-cases/list-pets.use-case.spec.ts` vacío.
- `it` de #14 R13 (`health-vaccines.e2e-spec.ts:513-559` en HEAD) fuera de todo hunk (hunks en 13, 34, 44 y 554+); sigue sembrando `dateOffset(-1|2|1)` y `toEqual({id, name, nextDoseAt})`.
- `seedUser(label, timezone = 'UTC')` (`:37-40`); llamadores de #14 sin cambios.
- `pnpm -C backend-pet-tracker test` → `Test Suites: 163 passed, 163 total` / `Tests: 1246 passed, 1246 total`.
- Suite e2e completa, dos corridas consecutivas (21:33 y 21:35 UTC, pgrep vacíos antes de cada una): `Test Suites: 3 skipped, 25 passed, 25 of 28 total` / `Tests: 8 skipped, 357 passed, 365 total` en ambas (83 s y 82 s).

### 6. R7 mutaciones (reproducidas por el reviewer sobre HEAD, no versionadas)

**M1** — `sed` `gte`→`gt` en `pet-vaccine.drizzle-reader.ts` (import `:2` y `:27`); `git diff --stat`: 1 archivo, 2 líneas. `run test:e2e -- health-vaccines` (21:36 UTC):
```
● R3 … (R3)
    -     "name": "Hoy",      "nextDoseAt": "2026-09-11",
    +     "name": "Manana",   "nextDoseAt": "2026-09-12",
    -     "name": "Hoy",      "nextDoseAt": "2026-09-10",
    +     "name": "Manana",   "nextDoseAt": "2026-09-11",
● … (R4)   Expected: "2026-09-11"   Received: "2026-09-12"
● … (R5)   Expected: "2026-09-10"   Received: "2026-09-11"
Tests:       3 failed, 15 passed, 18 total
```
Revertida con `git checkout -- <archivo>`; `git status --short` limpio.

**M2** — `return null; // M2` como primera línea de `findOwnerTimezone` en `pet.drizzle.repository.ts` (`:115`); `git diff --stat`: 1 archivo, 1 línea.
- `pnpm -C backend-pet-tracker test` bajo M2: `Test Suites: 163 passed, 163 total` / `Tests: 1246 passed, 1246 total` → **verde**, zona ciega confirmada.
- e2e (`Thu Sep 10 21:37:20 UTC 2026`, franja 11-23 de D10: Kiritimati = D+1, Pago_Pago = D):
```
● R3 … (R3)
    -     "name": "Hoy",    "nextDoseAt": "2026-09-11",
    +     "name": "Ayer",   "nextDoseAt": "2026-09-10",
          "name": "Hoy",    "nextDoseAt": "2026-09-10",     (Pago_Pago verde, coincide con UTC)
● … (R4)   Expected: "2026-09-11"   Received: "2026-09-10"
Tests:       2 failed, 16 passed, 18 total
```
R5 verde (los dos fallos son R3 y R4). Revertida; `git status --short` limpio. El árbol limpio volvió a pasar el archivo dentro de `init.sh` (§8).

### 7. Trazabilidad

`specs/vaccine-due-today-inclusive/traceability.md`: filas R1-R7 con test y commit (rojo/verde por hash); tabla de los 3 `acceptance_criteria` cubierta; §Tests de features anteriores lista el describe R13→R1, las seis llamadas `execute(PET_ID, NOW)`, `pets.controller.spec.ts:204` `expect.any(Date)` y `seedUser` parametrizado; §Tests que deben quedar verdes sin editarse coincide con lo verificado en §5.

### 8. Gate

`env -u FORCE_COLOR bash ./init.sh` desde la raíz del worktree, primer plano, 21:37→21:41 UTC, **exit 0**. `grep -i "se saltan"` sobre el log: vacío (e2e ejecutados: `8 skipped, 357 passed, 365 total`; backend unit `1246 passed`; móvil `1111 passed`; 14 tests de infra). Línea 13625 `✅ Tests e2e pasados`, línea 13644 `✅ Todo verde. Listo para trabajar.`; cierre del log:
```
  Features: 69/86 completadas | 16 pendientes
  Próxima feature:
  [#18] nutrition-ai-explainer (P3)
```
Log completo en `scratchpad/init_review_82.log`.

### 9. Drift

`git fetch origin` → `git rev-parse HEAD` = `ba2861812d0414ef201a1a2e01dc8dd6b712f9c3`; `git rev-parse origin/feature/82-vaccine-due-today-inclusive` = `ba2861812d0414ef201a1a2e01dc8dd6b712f9c3`. Iguales. `git status --short` limpio tras el gate.

### 10. Higiene y capas

`pnpm exec tsc --noEmit` exit 0; `pnpm exec eslint <10 archivos>` exit 0; `pnpm exec prettier --check <10 archivos>` «All matched files use Prettier code style!». `grep` de `console.log|TODO|FIXME` sobre las líneas añadidas del diff: vacío. Dependencias: `package.json` sin diff.

## Observaciones

Ninguna bloqueante. Nota documental para el leader (no exige commit de Codex; `specs/` es editable por el leader): la tabla «Tests de features anteriores actualizados» de `traceability.md` no tiene fila para `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts` (`petsStub` + `findOwnerTimezone: jest.fn()`, A1, commit `bb30e6d`). Encaja con el criterio literal de la tabla (ningún `it` cambia nombre, llamada ni comportamiento esperado) y el cambio ya está documentado en `requirements.md` §A1 y `design.md` §Archivos afectados punto 10, pero si el leader quiere la tabla exhaustiva, es una fila.

## Output de ./init.sh
```
init.sh exit=0 (21:41:52Z)
Test Suites: 163 passed, 163 total
Tests:       1246 passed, 1246 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 68 passed, 68 total
Tests:       1111 passed, 1111 total
Test Suites: 3 skipped, 25 passed, 25 of 28 total
Tests:       8 skipped, 357 passed, 365 total

  Features: 69/86 completadas | 16 pendientes

  Próxima feature:
  [#18] nutrition-ai-explainer (P3)
```
