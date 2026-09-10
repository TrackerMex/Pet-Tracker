---
feature: "vaccine-applied-at-owner-timezone"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[vaccine-applied-at-owner-timezone]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]]
> y conserva los 3 sub-items; donde un sub-item no aplica se dice por qué.
> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `f3e3280`.
>
> **Commits** (CHECKPOINTS C4): diez, en el orden de [[design]] D10, rojo →
> verde por bloque, con el R-id en el mensaje. Cada rojo falla **por
> aserción** sobre comportamiento de producción ausente (nunca por un helper
> de test inexistente; nunca mutando un mock). Las mutaciones de R6 **no se
> versionan**.
>
> **Branch**: `feature/88-vaccine-applied-at-owner-timezone`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Nada va a `main`; cierre con
> push, el PR lo abre el leader tras el veredicto del reviewer
> (`docs/conventions.md` §Branches y Pull Requests). **Cero archivos bajo
> `mobile-pet-tracker/`** (#87 trabaja en otro worktree).
>
> **Sujeto de cada tarea** (quién crea qué, para que nadie asevere sobre
> algo que aún no existe): R1 crea `VaccineAppliedInFutureError`, el helper
> `ownerLocalDay` (mínimo), `CreateVaccineUseCase.execute(..., now)` y el
> `now` de `VaccinesController.create`. R2 crea `PET_REPOSITORY` en
> `UpdateVaccineUseCase`, `execute(..., now)` y el `now` de
> `VaccinesController.update`; asevera sobre el helper de R1. R3 asevera
> sobre el helper de R1 y le añade la validación IANA + `warn`; después
> hace que `GetPetUseCase` lo use. R4 crea el describe e2e, quita el
> `refine` del DTO y añade la rama del mapper; asevera de punta a punta
> sobre R1-R3. R5 y R6 solo aseveran sobre el árbol que R1-R4 dejaron. El
> orden es R1 → R2 → R3 → R4 → R5 → R6 y no se adelanta ninguno.
>
> **Regla dura**: si para poner verde algún test hace falta tocar un archivo
> que no esté en los once de [[design]] §Archivos afectados, o cualquier
> cosa bajo `mobile-pet-tracker/`, **para y repórtalo** en
> `progress/impl_vaccine-applied-at-owner-timezone.md`. Igual si un doble
> `MockOf<...>` o un spec que no está en la lista se pone rojo por
> typecheck: no lo arregles, documéntalo.
>
> **Comandos**:
> - unitario: `pnpm -C backend-pet-tracker test -- vaccine-mutations` /
>   `-- owner-local-day` / `-- get-pet.use-case`
> - typecheck: `pnpm -C backend-pet-tracker exec tsc --noEmit`
> - e2e de la feature: `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`
> - suite e2e completa: `pnpm -C backend-pet-tracker run test:e2e` (Docker
>   arriba en `5432` y `4566`)
> - gate: `env -u FORCE_COLOR bash ./init.sh` desde la raíz del worktree
>   (bug #75: `FORCE_COLOR` rompe `init.sh`). Si cae **solo** por el flake
>   móvil #72 (`add-pet/index.test.tsx`), una segunda corrida limpia vale;
>   anótalo en el reporte.
> - **antes de cualquier e2e o `init.sh`**: `pgrep -af 'init\.sh'` y
>   `pgrep -af 'test:e2e'` deben salir **vacíos** — el Postgres de docker es
>   compartido con el otro worktree (sesión Frontend, #87); dos suites a la
>   vez dan rojos falsos (2026-09-06). Si hay algo corriendo, espera a que
>   termine; no lo mates.

## T0 — Precondiciones (sin commit)

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-backend branch --show-current`
      imprime `feature/88-vaccine-applied-at-owner-timezone`; `git merge-base
      origin/main HEAD` imprime `f3e3280...`.
- [ ] `docker compose ps` muestra Postgres y LocalStack arriba; `pgrep -af
      'init\.sh'` y `pgrep -af 'test:e2e'` vacíos.
- [ ] Con el Node que usa `init.sh` (no necesariamente el del shell):
      `node -e "const s=new Set(Intl.supportedValuesOf('timeZone'));console.log(s.has('Pacific/Kiritimati'),s.has('Pacific/Pago_Pago'),s.has('America/Mexico_City'))"`
      imprime `true true true`, y
      `node -e "const f=(i,z)=>new Intl.DateTimeFormat('en-CA',{timeZone:z,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(i));console.log(f('2026-08-11T02:00:00.000Z','America/Mexico_City'),f('2026-08-10T20:00:00.000Z','Pacific/Kiritimati'))"`
      imprime `2026-08-10 2026-08-11`. Si no, **para**: las constantes de
      R1-R3 y el par de D8 no valen en ese runtime.
- [ ] Corridas de referencia en `f3e3280`: `pnpm -C backend-pet-tracker
      test -- vaccine-mutations get-pet.use-case` y `pnpm -C
      backend-pet-tracker run test:e2e -- health-vaccines` verdes. Anotar
      las líneas `Tests:` en el reporte (sección `## T0`).

## R1 — create compara `appliedAt` con el día civil del owner

Sujeto que crea esta tarea: `VaccineAppliedInFutureError`, `ownerLocalDay`
(mínimo), `CreateVaccineUseCase.execute(petId, dto, userId, now)`, el `now`
de `VaccinesController.create`.

- [ ] (1) Test rojo — `src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts`:
      - Constantes a nivel de módulo `NOW_CDMX_EVENING = new
        Date('2026-08-11T02:00:00.000Z')` y `NOW_KIRITIMATI_MORNING = new
        Date('2026-08-10T20:00:00.000Z')`.
      - Describe y tres `it` **exactos** de [[requirements]] R1, con la
        fixture descrita ahí (`pets` con `findOwnerTimezone` y `findById`,
        `vaccines` con `create`, `audit` con `record`; body `{ name:
        'Manual', appliedAt }`). Sin importar la clase del error: se asevera
        por `toThrow('Applied date cannot be in the future')` y
        `toMatchObject({ name: 'VaccineAppliedInFutureError' })`.
      - `it('create no audita si el INSERT falla')` (`:28-45`): `pets` pasa
        a `{ findOwnerTimezone: jest.fn().mockResolvedValue('UTC') } as
        unknown as PetRepository`; `execute` gana `NOW_CDMX_EVENING`. Nombre
        y aserciones intactos.
      `pnpm -C backend-pet-tracker test -- vaccine-mutations`: rojo **por
      aserción** — (1) y (3) `findOwnerTimezone` con `Number of calls: 0`;
      (2) `Received promise resolved instead of rejected`. El `it` de R12
      sigue verde. Copiar los `Expected/Received` al reporte. **Commit 1**:
      `test(vaccine-applied-at-owner-timezone): create compares appliedAt
      with the owner local day (R1)`.
- [ ] (2) Implementación mínima (archivos 1-4 de [[design]] §Archivos
      afectados):
      - `vaccine.errors.ts`: clase de [[design]] D9.
      - `src/modules/pets/application/owner-local-day.ts` (nuevo):
        `export async function ownerLocalDay(pets: PetRepository, petId:
        string, now: Date): Promise<string>` → `const timezone = await
        pets.findOwnerTimezone(petId); return localDayOf(now.getTime(),
        timezone ?? 'UTC');`. **Sin** `isSupportedTimeZone` ni `warn`
        todavía (eso es R3). Import de `localDayOf` desde
        `@/pipeline/local-day` y del tipo `PetRepository`.
      - `create-vaccine.use-case.ts`: `execute(petId: string, dto:
        CreateVaccineDto, userId: string, now: Date)`; primera línea del
        cuerpo: `if (dto.appliedAt > (await ownerLocalDay(this.pets, petId,
        now))) throw new VaccineAppliedInFutureError();`. Imports del helper
        y del error.
      - `vaccines.controller.ts:64-71`: `const now = new Date();` como
        primera línea del `try` de `create`, pasado como cuarto argumento.
      `pnpm -C backend-pet-tracker test -- vaccine-mutations` verde; `pnpm
      -C backend-pet-tracker exec tsc --noEmit` limpio.
- [ ] (3) Refactor: doc-comment de una línea en el use case («#88: appliedAt
      se compara con el día civil del owner»); lint/format. **Commit 2**:
      `feat(vaccine-applied-at-owner-timezone): validate appliedAt against
      the owner local day on create (R1)`.

## R2 — update compara `appliedAt` con el día civil del owner solo si el body lo trae

Sujeto que crea esta tarea: `PET_REPOSITORY` en `UpdateVaccineUseCase`
(segundo parámetro), `execute(petId, id, dto, userId, now)`, el `now` de
`VaccinesController.update`. Asevera sobre el helper de R1.

- [ ] (1) Test rojo — mismo spec, describe y cuatro `it` **exactos** de
      [[requirements]] R2 con su fixture (`new UpdateVaccineUseCase(vaccines,
      pets, audit)`). `it('update no audita si el UPDATE falla')` (`:47-62`):
      el constructor gana `{} as PetRepository` como segundo argumento y
      `execute` gana `NOW_CDMX_EVENING`; nombre y aserciones intactos.
      `pnpm -C backend-pet-tracker test -- vaccine-mutations`: los cuatro
      `it` nuevos rojos por aserción (`TypeError: this.audit.record is not
      a function` rechazando (1), (3), (4); en (2) `update` llamado y
      mensaje distinto). Si el runner reporta antes un diagnóstico de
      aridad, es sobre la firma de producción que R2 crea; anótalo tal
      cual. Copiar la salida. **Commit 3**:
      `test(vaccine-applied-at-owner-timezone): update compares appliedAt
      with the owner local day only when present (R2)`.
- [ ] (2) Implementación mínima:
      - `update-vaccine.use-case.ts`: `@Inject(PET_REPOSITORY) private
        readonly pets: PetRepository` entre `vaccines` y `audit`; `execute(petId:
        string, id: string, dto: UpdateVaccineDto, userId: string, now:
        Date)`; primera línea del cuerpo: `if (dto.appliedAt !== undefined &&
        dto.appliedAt > (await ownerLocalDay(this.pets, petId, now))) throw
        new VaccineAppliedInFutureError();`. Imports de `PET_REPOSITORY`,
        `PetRepository`, el helper y el error.
      - `vaccines.controller.ts:92-100`: `const now = new Date();` como
        primera línea del `try` de `update`, pasado como quinto argumento.
      Unitario verde (R1 y R12 incluidos); `tsc --noEmit` limpio — si
      algún archivo fuera de la lista se pone rojo por tipos, **para**.
- [ ] (3) Refactor: doc-comment de una línea; lint/format. **Commit 4**:
      `feat(vaccine-applied-at-owner-timezone): validate appliedAt against
      the owner local day on update (R2)`.

## R3 — `ownerLocalDay` degrada a UTC con un warn y `GetPetUseCase` lo reutiliza

Sujeto sobre el que asevera: el helper de R1. Le añade la validación IANA y
el `warn`; después mueve `GetPetUseCase` al helper.

- [ ] (1) Test rojo — `src/modules/pets/application/owner-local-day.spec.ts`
      (nuevo): describe y tres `it` **exactos** de [[requirements]] R3, con
      `warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation()`
      en `beforeEach` y `mockRestore` en `afterEach` (`Logger` de
      `@nestjs/common`), `NOW = new Date('2026-08-11T02:00:00.000Z')`,
      `PET_ID` cualquiera. `pnpm -C backend-pet-tracker test --
      owner-local-day`: (1) verde ya (anotarlo), (2) rojo por conteo del
      `warn` (0 ≠ 1), (3) rojo por `InvalidTimeZoneError: unknown IANA time
      zone: Not/A/Zone`. Copiar la salida. **Commit 5**:
      `test(vaccine-applied-at-owner-timezone): ownerLocalDay falls back to
      UTC with a warn on null or non-IANA zone (R3)`.
- [ ] (2) Implementación mínima en `owner-local-day.ts`: `const logger = new
      Logger('ownerLocalDay')` a nivel de módulo; `const timezone = raw !==
      null && isSupportedTimeZone(raw) ? raw : 'UTC'`; si `timezone !==
      raw`, `logger.warn({ scope: 'owner-local-day', petId, timezone: raw,
      message: 'falling back to UTC: owner timezone missing or not a IANA
      zone' })` una vez; `return localDayOf(now.getTime(), timezone)`. Los
      tres `it` verdes; `vaccine-mutations` sigue verde. **Commit 6**:
      `feat(vaccine-applied-at-owner-timezone): ownerLocalDay falls back to
      UTC with a warn (R3)`.
- [ ] (3) Refactor — `get-pet.use-case.ts`: `:70-84` y `:92` pasan a `const
      today = await ownerLocalDay(this.pets, petId, now)` y
      `findNextVaccine(petId, today)`; retirar `Logger` (`:1`, `:43`) y el
      import de `local-day` (`:18`) si quedan sin uso; una línea en el
      doc-comment (`:32-40`) sobre #88. `pnpm -C backend-pet-tracker test --
      get-pet.use-case` verde con `git diff f3e3280...HEAD --
      backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.spec.ts`
      **vacío**; `tsc --noEmit` y lint limpios. **Commit 7**:
      `refactor(vaccine-applied-at-owner-timezone): GetPetUseCase delegates
      the owner day to ownerLocalDay (R3)`.

## R4 — frontera e2e: hoy y mañana en la zona del owner, POST y PATCH

Sujeto que crea esta tarea: el describe R4 con dos `it`, el DTO sin
`refine` y la rama del mapper. Asevera de punta a punta sobre R1-R3.

- [ ] (1) Test rojo — `test/health-vaccines.e2e-spec.ts`: describe y dos
      `it` **exactos** de [[requirements]] R4. Por zona, `today =
      localDayOf(Date.now(), zona)` se calcula **una vez** antes de las
      peticiones de esa zona; `seedUser(label, zona)` y `seedPet` existentes;
      `shiftDay` ya importado (`:16`). El `toEqual` del 400 compara el body
      **completo** de [[design]] D5. `pgrep` vacíos → `pnpm -C
      backend-pet-tracker run test:e2e -- health-vaccines`: **solo** los dos
      `it` nuevos rojos, por status (`expected 201 "Created", got 400` para
      Kiritimati si `h >= 10`; `expected 400 "Bad Request", got 500` para
      Pago_Pago si `h < 11`; a las 10 UTC, ambos). Si alguno falla por otra
      cosa (timeout, zona desconocida), arregla el test, no producción.
      Copiar los `Expected/Received` con `date -u` al reporte. **Commit 8**:
      `test(vaccine-applied-at-owner-timezone): e2e appliedAt today and
      tomorrow in the owner zone for POST and PATCH (R4)`.
- [ ] (2) Implementación mínima:
      - `vaccine.dto.ts`: `appliedAt: IsoDateSchema,` (`:12-15`) y
        `appliedAt: IsoDateSchema.optional(),` (`:29-32`); import `:2` solo
        `IsoDateSchema`.
      - `vaccine-error.mapper.ts`: rama de [[design]] D5 antes del `return
        error` (`:34`); import de `VaccineAppliedInFutureError`.
      `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines` verde
      completo (describes de #14 y #82 incluidos, sin editarlos; el
      `'2999-01-01'` de R8 sigue `400`).
- [ ] (3) Refactor: ninguno. Lint/format sobre los tres archivos. **Commit
      9**: `feat(vaccine-applied-at-owner-timezone): drop the UTC refine
      from the vaccine DTO and map VaccineAppliedInFutureError to the
      validation 400 (R4)`.

## R5 — regresión: contrato intacto, diff acotado, suite verde

Sujeto sobre el que asevera: el árbol en `HEAD` tras el commit 9.

- [ ] (1) Verificación (sin test nuevo): `git diff --name-only
      f3e3280...HEAD -- backend-pet-tracker/` lista **exactamente** los once
      archivos de [[design]] §Archivos afectados; `git diff --stat
      f3e3280...HEAD -- mobile-pet-tracker/` vacío; `grep -n
      "todayIsoDateUtc" src/modules/health/application/dto/vaccine.dto.ts`
      vacío; `git diff f3e3280...HEAD -- <archivo>` vacío para cada uno de
      los de [[requirements]] R5-(b) y (c); en `health-vaccines.e2e-spec.ts`
      los hunks del diff caen solo en el describe R4 nuevo.
- [ ] (2) `pgrep` vacíos → `pnpm -C backend-pet-tracker run test:e2e --
      health-vaccines` y la suite e2e completa verdes; después `env -u
      FORCE_COLOR bash ./init.sh` desde la raíz, verde y **sin** el aviso
      «se saltan los e2e». Copiar la línea `Tests: N passed, N total` y la
      última línea de `init.sh` a la sección `## Regresión (R5)` del
      reporte (si hubo segunda corrida por el flake #72, las dos).
- [ ] (3) Sin commit todavía (va en el commit 10 con R6).

## R6 — mutaciones no versionadas: zona y operador

Sujeto sobre el que asevera: el árbol verde de R5. Nada de esto se commitea.

- [ ] (1) **M1**: en `owner-local-day.ts` sustituir el `return` por `return
      now.toISOString().slice(0, 10);` (manteniendo la llamada a
      `findOwnerTimezone`). `pnpm -C backend-pet-tracker test --
      vaccine-mutations owner-local-day get-pet.use-case`: rojos por
      aserción R1(2), R1(3), R2(2), R2(3), R3(1) y el R1 de #82 en
      `get-pet.use-case.spec.ts` (`Expected: "2026-08-09"`, `Received:
      "2026-08-10"`). `pgrep` vacíos → e2e del archivo: los dos `it` de R4
      rojos para al menos una zona (tabla D8). Copiar los bloques y `date
      -u` a `## Mutación (R6)` → `### M1`. Revertir con `git checkout --
      backend-pet-tracker/src/modules/pets/application/owner-local-day.ts`;
      `git status --short` limpio.
- [ ] (2) **M2**: en `create-vaccine.use-case.ts` y
      `update-vaccine.use-case.ts` cambiar `>` por `>=` en la comparación.
      Unitario: R1(1), R1(3), R2(1), R2(3) rojos (rechazo inesperado). e2e:
      las aserciones «hoy → 201/200» de R4 rojas en las dos zonas; las de
      «mañana → 400» verdes. Copiar a `### M2`. Revertir con `git checkout
      -- <los dos archivos>`; `git status --short` limpio; unitario y e2e
      del archivo verdes otra vez.
- [ ] (3) Sin commit de código. `git log --oneline f3e3280..HEAD` sigue
      mostrando los nueve commits de código (más los de apertura y spec del
      leader).

## Cierre

- [ ] Rellenar [[traceability]]: filas R1-R6, tabla de criterios, y las
      filas de §Tests de features anteriores actualizados (los dos `it` de
      #14 R12 adaptados).
- [ ] **Commit 10**: `docs(vaccine-applied-at-owner-timezone): mutation
      evidence, regression sweep and traceability (R5,R6)` con
      `progress/impl_vaccine-applied-at-owner-timezone.md` (secciones `##
      T0`, `## Rojo/verde por commit`, `## Regresión (R5)`, `## Mutación
      (R6)`) y `specs/vaccine-applied-at-owner-timezone/traceability.md`.
- [ ] `git log --oneline f3e3280..HEAD` muestra los diez commits de
      [[design]] D10 (más los del leader). `git push -u origin
      feature/88-vaccine-applied-at-owner-timezone`. **PARA**: el PR lo abre
      el leader tras el veredicto del reviewer.
