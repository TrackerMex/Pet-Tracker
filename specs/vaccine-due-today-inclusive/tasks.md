---
feature: "vaccine-due-today-inclusive"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[vaccine-due-today-inclusive]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]]
> y conserva los 3 sub-items; donde un sub-item no aplica se dice por qué.
> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `7f298f2`.
>
> **Commits** (CHECKPOINTS C4): siete, en el orden de [[design]] D11, rojo →
> verde por bloque, con el R-id en el mensaje. Cada rojo falla **por
> aserción** sobre comportamiento de producción ausente (nunca por un helper
> de test inexistente; nunca mutando un mock). Las mutaciones de R7 **no se
> versionan**.
>
> **Branch**: `feature/82-vaccine-due-today-inclusive`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Nada va a `main`; cierre con
> push, el PR lo abre el leader tras el veredicto del reviewer
> (`docs/conventions.md` §Branches y Pull Requests).
>
> **Sujeto de cada tarea** (quién crea qué, para que nadie asevere sobre
> algo que aún no existe): R1 crea `PetRepository.findOwnerTimezone`, su
> implementación Drizzle, `execute(petId, now)`, el `now` único del
> controller y el uso de `localDayOf`. R2 asevera sobre el use case de R1 y
> le añade la validación IANA + `warn`. R3-R5 crean `gte`, el rename `from`
> y el `seedUser` parametrizado, y asevera sobre todo lo anterior de punta a
> punta. R6 y R7 solo aseveran sobre el árbol que R1-R5 dejaron. El orden es
> R1 → R2 → R3/R4/R5 → R6 → R7 y no se adelanta ninguno.
>
> **Regla dura**: si para poner verde algún test hace falta tocar un archivo
> que no esté en los nueve de [[design]] §Archivos afectados, o cualquier
> cosa bajo `mobile-pet-tracker/`, **para y repórtalo** en
> `progress/impl_vaccine-due-today-inclusive.md`. Igual si el rename de D7
> obliga a tocar un tercer archivo: no lo hagas, documéntalo.
>
> **Comandos**:
> - unitario: `pnpm -C backend-pet-tracker test -- get-pet.use-case` /
>   `-- pets.controller`
> - e2e de la feature: `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`
> - suite e2e completa: `pnpm -C backend-pet-tracker run test:e2e` (Docker
>   arriba en `5432` y `4566`)
> - gate: `env -u FORCE_COLOR bash ./init.sh` desde la raíz del worktree
>   (bug #75: `FORCE_COLOR` rompe `init.sh`)
> - **antes de cualquier e2e o `init.sh`**: `pgrep -af 'init\.sh'` y
>   `pgrep -af 'test:e2e'` deben salir **vacíos** — el Postgres de docker es
>   compartido con el otro worktree, donde Codex de #87 corre `init.sh`; dos
>   suites a la vez dan rojos falsos (2026-09-06). Si hay algo corriendo,
>   espera a que termine; no lo mates.

## T0 — Precondiciones (sin commit)

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-backend branch --show-current`
      imprime `feature/82-vaccine-due-today-inclusive`; `git merge-base
      origin/main HEAD` imprime `7f298f2...`.
- [ ] `docker compose ps` muestra Postgres y LocalStack arriba; `pgrep -af
      'init\.sh'` y `pgrep -af 'test:e2e'` vacíos.
- [ ] Con el Node que usa `init.sh` (no necesariamente el del shell):
      `node -e "const s=new Set(Intl.supportedValuesOf('timeZone'));console.log(s.has('Pacific/Kiritimati'),s.has('Pacific/Pago_Pago'))"`
      imprime `true true`. Si no, **para**: el par de zonas de D10 no vale
      en ese runtime.
- [ ] Corrida de referencia: `pnpm -C backend-pet-tracker run test:e2e --
      health-vaccines` verde en `7f298f2`. Anotar la línea `Tests:` en el
      reporte (sección `## T0`).

## R1 — el use case resuelve "hoy" en la zona del owner con el reloj del caller

Sujeto que crea esta tarea: `PetRepository.findOwnerTimezone` (puerto +
Drizzle), `GetPetUseCase.execute(petId, now)` con `localDayOf`, el `now`
único de `PetsController.detail`.

- [ ] (1) Test rojo — `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts`:
      - `buildDeps` (`:34-56`): `const findOwnerTimezone = jest.fn()
        .mockResolvedValue('UTC')`, incluido en el mock `pets = { findById,
        findOwnerTimezone } as unknown as PetRepository` y devuelto.
      - `const NOW = new Date('2026-08-10T03:00:00.000Z')` a nivel de módulo;
        las seis llamadas `useCase.execute(PET_ID)` existentes (R8, R9, R12,
        R6, R7) pasan a `useCase.execute(PET_ID, NOW)`. Nombres y aserciones
        de esos `it` **intactos**.
      - Describe `R13 (health-vaccines #14)` (`:173-199`) **reescrito**
        (no borrado, no duplicado) con el nombre y el `it` exactos de
        [[requirements]] R1: `findOwnerTimezone` → `'America/Mexico_City'`,
        sin `jest.useFakeTimers`, aserciones `findOwnerTimezone` con
        `PET_ID`, `findNextVaccine` con `(PET_ID, '2026-08-09')`,
        `profile.nextVaccine` igual al mock.
      - `src/modules/pets/infrastructure/pets.controller.spec.ts:204` →
        `toHaveBeenCalledWith(PET_ID, expect.any(Date))`.
      `pnpm -C backend-pet-tracker test -- get-pet.use-case` y `--
      pets.controller`: rojo **por aserción** (`findNextVaccine` recibe el
      día UTC real del VPS; `findOwnerTimezone` sin llamadas; `getExecute`
      con un solo argumento). Copiar el `Expected/Received` al reporte.
      **Commit 1**: `test(vaccine-due-today-inclusive): use case resolves
      the owner local day from the caller clock (R1)`.
- [ ] (2) Implementación mínima (los cuatro archivos de producción de
      [[design]] §Archivos afectados 1, 2, 3, 5):
      - `pet.repository.ts`: `findOwnerTimezone(petId: string):
        Promise<string | null>` en la interface.
      - `pet.drizzle.repository.ts`: la consulta de
        `activity.drizzle.store.ts:218-230` (`petUsers` inner join `users`,
        owner activo, `orderBy(asc(petUsers.createdAt))`, `limit(1)`),
        devuelve `rows[0]?.timezone ?? null`. Imports `asc` y `users`.
      - `get-pet.use-case.ts`: `execute(petId: string, now: Date)`;
        `const timezone = await this.pets.findOwnerTimezone(petId)`;
        día = `localDayOf(now.getTime(), <zona>)`; `findNextVaccine(petId,
        día)`. Lo mínimo para el nulo es que compile (p. ej. `?? 'UTC'`);
        **sin** `isSupportedTimeZone` ni `warn` todavía (R2).
      - `pets.controller.ts:87-101`: `const now = new Date()` una vez,
        pasado a `execute(petId, now)` y a `toPetProfileResponse`.
      Unitarios verdes; `pnpm -C backend-pet-tracker exec tsc --noEmit`
      limpio.
- [ ] (3) Refactor: doc-comment de `GetPetUseCase` (`:31-38`) con una línea
      sobre #82; lint/format limpios. **Commit 2**:
      `feat(vaccine-due-today-inclusive): resolve next vaccine from the
      owner local day (R1)`.

## R2 — zona nula o no IANA degrada a UTC con un warn

Sujeto sobre el que asevera: el `execute` de R1. Añade la validación IANA y
el `warn`.

- [ ] (1) Test rojo — mismo spec, describe y tres `it` exactos de
      [[requirements]] R2, con `warnSpy = jest.spyOn(Logger.prototype,
      'warn').mockImplementation()` en `beforeEach` y `mockRestore` en
      `afterEach` (`Logger` de `@nestjs/common`). Rojo esperado: (1) y (2)
      por conteo del `warn` (0 ≠ 1) o por `InvalidTimeZoneError` escapando
      de `execute`; (3) puede ya estar verde (no hay `warn` en R1). Copiar
      la salida. **Commit 3**: `test(vaccine-due-today-inclusive): null or
      non-IANA owner timezone falls back to UTC with warn (R2)`.
- [ ] (2) Implementación mínima en `get-pet.use-case.ts`: `timezone !== null
      && isSupportedTimeZone(timezone)` → esa zona; si no, `'UTC'` y
      `this.logger.warn({ scope: 'get-pet', petId, timezone, message:
      'falling back to UTC: owner timezone missing or not a IANA zone' })`
      una vez (`private readonly logger = new Logger(GetPetUseCase.name)`,
      precedente `get-last-position.use-case.ts:21`). Los tres `it` verdes;
      R1 sigue verde.
- [ ] (3) Refactor: ninguno previsto (si la resolución crece más de ~8
      líneas, método privado `resolveTimeZone(petId, timezone)` en la misma
      clase — nunca un archivo nuevo). **Commit 4**:
      `feat(vaccine-due-today-inclusive): fall back to UTC with warn on
      invalid owner timezone (R2)`.

## R3, R4, R5 — frontera e2e: hoy inclusive en la zona del owner, family, no-IANA

Sujeto que crea esta tarea: `seedUser(label, timezone = 'UTC')`, el describe
nuevo con tres `it`, `gte` en el lector y el rename `after` → `from`.
Asevera de punta a punta sobre R1 y R2.

- [ ] (1) Test rojo — `test/health-vaccines.e2e-spec.ts`:
      - `seedUser` (`:36-52`) gana `timezone = 'UTC'` como segundo parámetro
        y lo persiste en `:47`; llamadores existentes sin cambios.
      - Import `{ localDayOf, shiftDay } from '@/pipeline/local-day'`.
      - Describe `'R3 (vaccine-due-today-inclusive #82): la dosis de hoy en
        la zona del owner es la proxima'` con los tres `it` de
        [[requirements]] R3, R4 y R5, nombrados exactamente así. En R3 y R4
        `today` se calcula **una vez** por owner, antes del `db.insert`, y
        las tres filas se insertan en **una** llamada `values([...])` (como
        `:520-545`) con `appliedAt: '2025-01-01'`. En R4 la membresía
        `family` se inserta como en `:200-205`. En R5 las fechas son
        `dateOffset(-1|0|1)` (`:33-34`).
      `pgrep` vacíos → `pnpm -C backend-pet-tracker run test:e2e --
      health-vaccines`: **solo** los tres `it` nuevos rojos, todos por
      aserción con `name: 'Manana'` (R3 en las dos zonas). Si alguno falla
      por otra cosa (500, timeout, zona desconocida), arregla el test, no
      producción. Copiar los `Expected/Received` al reporte. **Commit 5**:
      `test(vaccine-due-today-inclusive): e2e dose due today in the owner
      zone, family and non-IANA owner (R3,R4,R5)`.
- [ ] (2) Implementación mínima:
      - `pet-vaccine.drizzle-reader.ts`: import `gte` en vez de `gt` (`:2`),
        `gte(petVaccines.nextDoseAt, from)` (`:27`), parámetro `from` (`:17`).
      - `pet-vaccine-reader.ts:10`: `findNextVaccine(petId: string, from:
        string)` con doc «`from` = primer día civil incluido».
      Si el rename exige tocar cualquier otro archivo, **no lo hagas**:
      deja `after` y anótalo en el reporte (D7). `pnpm -C
      backend-pet-tracker run test:e2e -- health-vaccines` verde completo
      (los describes R2-R13 de #14 incluidos, sin editarlos).
- [ ] (3) Refactor: ninguno. Lint/format sobre los tres archivos.
      **Commit 6**: `feat(vaccine-due-today-inclusive): include the dose
      due today and rename the port param to from (R3,R4,R5)`.

## R6 — regresión: contrato intacto, diff acotado, suite verde

Sujeto sobre el que asevera: el árbol en `HEAD` tras el commit 6.

- [ ] (1) Verificación (sin test nuevo): `git diff --name-only
      7f298f2...HEAD -- backend-pet-tracker/` lista **exactamente** los
      nueve archivos de [[design]] §Archivos afectados; `git diff --stat
      7f298f2...HEAD -- mobile-pet-tracker/` vacío; `grep -n
      "PET_VACCINE_READER\|findNextVaccine"
      src/modules/pets/application/use-cases/list-pets.use-case.ts` vacío;
      `test/pets.e2e-spec.ts` y el `it` de #14 R13 (`:510-556`) sin cambios
      (`git diff 7f298f2...HEAD -- test/pets.e2e-spec.ts` vacío y el
      describe R13 fuera del hunk de `health-vaccines`).
- [ ] (2) `pgrep` vacíos → suite e2e completa `pnpm -C backend-pet-tracker
      run test:e2e` verde; después `env -u FORCE_COLOR bash ./init.sh`
      desde la raíz, verde y **sin** el aviso «se saltan los e2e». Copiar
      la línea `Tests: N passed, N total` y la última línea de `init.sh` a
      la sección `## Regresión (R6)` del reporte.
- [ ] (3) Sin commit todavía (va en el commit 7 con R7).

## R7 — mutaciones no versionadas: operador y zona ciega

Sujeto sobre el que asevera: el árbol verde de R6. Nada de esto se commitea.

- [ ] (1) **M1**: en `pet-vaccine.drizzle-reader.ts` cambiar `gte(` por
      `gt(` (y el import). `pgrep` vacíos → `pnpm -C backend-pet-tracker run
      test:e2e -- health-vaccines`: el `it` de R3 rojo **por aserción** con
      `name: 'Manana'` en las dos zonas (R4 y R5 también rojos). Copiar el
      bloque `Expected/Received` a `## Mutación (R7)` → `### M1`. Revertir
      con `git checkout -- src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts`;
      `git status --short` limpio.
- [ ] (2) **M2**: en `pet.drizzle.repository.ts` hacer que
      `findOwnerTimezone` devuelva `null` sin consultar (`return
      Promise.resolve(null)` como primera línea, o equivalente). Primero
      `pnpm -C backend-pet-tracker test`: **verde** (zona ciega: los
      unitarios mockean el repositorio) — copiar la línea `Tests:`. Después
      el e2e: el `it` de R3 rojo por aserción para al menos una zona
      (`'Ayer'` o `'Manana'` según la franja de D10); R5 verde. Copiar el
      bloque a `### M2` junto con la hora UTC de la corrida (`date -u`).
      Revertir con `git checkout -- src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts`;
      `git status --short` limpio; e2e del archivo verde otra vez.
- [ ] (3) Sin commit de código. `git log --oneline 7f298f2..HEAD` sigue
      mostrando seis commits.

## Cierre

- [ ] Rellenar [[traceability]]: filas R1-R7, tabla de criterios, y las
      filas de §Tests de features anteriores actualizados (describe R13 de
      #14 reescrito, las seis llamadas con `NOW`, `pets.controller.spec.ts:204`,
      `seedUser` parametrizado).
- [ ] **Commit 7**: `docs(vaccine-due-today-inclusive): mutation evidence,
      regression sweep and traceability (R6,R7)` con
      `progress/impl_vaccine-due-today-inclusive.md` (secciones `## T0`,
      `## Rojo/verde por commit`, `## Regresión (R6)`, `## Mutación (R7)`) y
      `specs/vaccine-due-today-inclusive/traceability.md`.
- [ ] `git log --oneline 7f298f2..HEAD` muestra los siete commits de
      [[design]] D11 (más el `a7fdaac` de apertura del leader y el de la
      spec). `git push -u origin feature/82-vaccine-due-today-inclusive`.
      **PARA**: el PR lo abre el leader tras el veredicto del reviewer.
