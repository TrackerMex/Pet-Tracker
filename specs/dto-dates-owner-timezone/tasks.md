---
feature: "dto-dates-owner-timezone"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Tareas — [[dto-dates-owner-timezone]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]]
> y conserva los 3 sub-items; donde un sub-item no aplica se dice por qué.
> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `381d1e36`.
>
> **Commits** (CHECKPOINTS C4): trece, en el orden de [[design]] D12, rojo →
> verde por bloque, con el R-id en el mensaje. Cada rojo falla **por
> aserción** sobre comportamiento de producción ausente (nunca por un helper
> de test inexistente; nunca mutando un mock). Las mutaciones de R8 **no se
> versionan**.
>
> **Branch**: `feature/89-dto-dates-owner-timezone`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Nada va a `main`; cierre con
> push, el PR lo abre el leader tras el veredicto del reviewer
> (`docs/conventions.md` §Branches y Pull Requests). **Cero archivos bajo
> `mobile-pet-tracker/`** (#78 trabaja en el otro worktree).
>
> **Sujeto de cada tarea** (quién crea qué, para que nadie asevere sobre
> algo que aún no existe): R1 crea `WeightMeasuredInFutureError`,
> `PET_REPOSITORY` en `CreateWeightUseCase`, `execute(..., now)` y el `now`
> de `WeightsController.create`; asevera sobre `ownerLocalDay`, que ya
> existe (#88). R2 crea `PetBirthDateInFutureError`, `requesterLocalDay`
> (mínimo), `USER_REPOSITORY` en `CreatePetUseCase`, `AuthModule` en
> `PetsModule`, `execute(..., now)` y el `now` de `PetsController.create`.
> R3 asevera sobre el helper de R2, le añade IANA + `warn` extrayendo
> `localDayInZone`, y hace que `ownerLocalDay` delegue. R4 crea
> `UpdatePetUseCase.execute(..., now)` y el `now` de `PetsController.update`;
> asevera sobre `ownerLocalDay` y sobre el error de R2. R5 crea el describe
> e2e de pesos, quita el `refine` + constante del DTO de pesos, borra
> `todayIsoDateUtc` de `iso-date.ts` y añade el `catch` del controller;
> asevera de punta a punta sobre R1. R6 crea el describe e2e de mascotas,
> quita el `refine` + copia local del DTO de mascotas, añade la rama de
> `mapPetError` y el `try/catch` de `create`; asevera sobre R2-R4. R7 y R8
> solo aseveran sobre el árbol que R1-R6 dejaron. El orden es R1 → R2 → R3
> → R4 → R5 → R6 → R7 → R8 y no se adelanta ninguno.
>
> **Regla dura**: si para poner verde algún test hace falta tocar un archivo
> que no esté en los veintidós de [[design]] §Archivos afectados, o
> cualquier cosa bajo `mobile-pet-tracker/`, **para y repórtalo** en
> `progress/impl_dto-dates-owner-timezone.md`. Igual si un doble
> `MockOf<...>` o un spec que no está en la lista se pone rojo por
> typecheck: no lo arregles, documéntalo.
>
> **Comandos**:
> - unitario: `pnpm -C backend-pet-tracker test -- create-weight` /
>   `-- create-pet` / `-- requester-local-day` / `-- update-pet` /
>   `-- owner-local-day get-pet.use-case vaccine-mutations` (candado) /
>   `-- pets.controller`
> - typecheck: `pnpm -C backend-pet-tracker exec tsc --noEmit`
> - e2e de la feature: `pnpm -C backend-pet-tracker run test:e2e -- health-weights pets`
> - suite e2e completa: `pnpm -C backend-pet-tracker run test:e2e` (Docker
>   arriba en `5432` y `4566`)
> - gate: `env -u FORCE_COLOR bash ./init.sh` desde la raíz del worktree
>   (bug #75). Si cae **solo** por el flake móvil #72
>   (`add-pet/index.test.tsx`), una segunda corrida limpia vale; anótalo.
> - **antes de cualquier e2e o `init.sh`**: `pgrep -af 'init\.sh'` y
>   `pgrep -af 'test:e2e'` deben salir **vacíos** — Postgres compartido
>   con el otro worktree (sesión Frontend, #78). Si hay algo corriendo,
>   espera; no lo mates.

## T0 — Precondiciones (sin commit)

- [ ] `git -C /home/claude/sites/Pet-Tracker-wt-backend branch --show-current`
      imprime `feature/89-dto-dates-owner-timezone`; `git merge-base
      origin/main HEAD` imprime `381d1e36...`.
- [ ] `docker compose ps` muestra Postgres y LocalStack arriba; `pgrep -af
      'init\.sh'` y `pgrep -af 'test:e2e'` vacíos.
- [ ] Con el Node que usa `init.sh`:
      `node -e "const s=new Set(Intl.supportedValuesOf('timeZone'));console.log(s.has('Pacific/Kiritimati'),s.has('Pacific/Pago_Pago'),s.has('America/Mexico_City'))"`
      imprime `true true true`, y
      `node -e "const f=(i,z)=>new Intl.DateTimeFormat('en-CA',{timeZone:z,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(i));console.log(f('2026-08-11T02:00:00.000Z','America/Mexico_City'),f('2026-08-10T20:00:00.000Z','Pacific/Kiritimati'))"`
      imprime `2026-08-10 2026-08-11`. Si no, **para**: las constantes de
      R1-R4 y el par de D9 no valen en ese runtime.
- [ ] Corridas de referencia en `381d1e36`: `pnpm -C backend-pet-tracker
      test -- create-weight create-pet update-pet owner-local-day
      get-pet.use-case vaccine-mutations pets.controller` y `pnpm -C
      backend-pet-tracker run test:e2e -- health-weights pets` verdes.
      Anotar las líneas `Tests:` en el reporte (sección `## T0`).

## R1 — pesos: `measuredAt` se compara con el día civil del owner, sin margen

Sujeto que crea esta tarea: `WeightMeasuredInFutureError`, `PET_REPOSITORY`
en `CreateWeightUseCase`, `execute(petId, dto, userId, now)`, el `now` de
`WeightsController.create`. Asevera sobre `ownerLocalDay` (existe).

- [ ] (1) Test rojo — `src/modules/health/application/use-cases/create-weight.use-case.spec.ts`:
      - Constantes a nivel de módulo `NOW_CDMX_EVENING = new
        Date('2026-08-11T02:00:00.000Z')` y `NOW_KIRITIMATI_MORNING = new
        Date('2026-08-10T20:00:00.000Z')`; import del tipo `PetRepository`.
      - Describe y tres `it` **exactos** de [[requirements]] R1 con su
        fixture (`weights = repository({ create: … })`, `pets` con
        `findOwnerTimezone`, `audit` con `record`; `new
        CreateWeightUseCase(weights, pets, audit)`). Sin importar la clase
        del error: `toThrow('measuredAt is too far in the future')` +
        `toMatchObject({ name: 'WeightMeasuredInFutureError' })`.
      - Los dos `it` de #15 R10 (`:29-46`, `:48-72`): constructor con `{
        findOwnerTimezone: jest.fn().mockResolvedValue('UTC') } as unknown
        as PetRepository` como segundo argumento; `execute` con
        `NOW_CDMX_EVENING` como cuarto. Nombres y aserciones intactos.
      `pnpm -C backend-pet-tracker test -- create-weight`: rojos **por
      aserción** — R1(1) y R1(3) `Received promise rejected instead of
      resolved` (`this.audit.record is not a function`); R1(2) `create`
      llamado y mensaje distinto; el heredado `'audita el id creado…'`
      rojo por la misma aridad; `'no audita cuando la escritura falla'`
      verde. Copiar los `Expected/Received` al reporte. **Commit 1**:
      `test(dto-dates-owner-timezone): create weight compares measuredAt
      with the owner local day without margin (R1)`.
- [ ] (2) Implementación mínima (archivos 1, 2 y 4 de [[design]]
      §Archivos afectados):
      - `src/modules/health/domain/errors/weight.errors.ts` (nuevo): clase
        de [[design]] D10.
      - `create-weight.use-case.ts`: `@Inject(PET_REPOSITORY) private
        readonly pets: PetRepository` entre `weights` y `audit`;
        `execute(petId: string, dto: CreateWeightDto, userId: string, now:
        Date)`; primera línea del cuerpo: `if (dto.measuredAt > (await
        ownerLocalDay(this.pets, petId, now))) throw new
        WeightMeasuredInFutureError();`. Imports de `PET_REPOSITORY`,
        `PetRepository`, `ownerLocalDay` y el error.
      - `weights.controller.ts:40-47`: `const now = new Date();` justo
        después del `parseBody`, pasado como cuarto argumento. **Sin**
        `try/catch` todavía (eso es R5).
      `pnpm -C backend-pet-tracker test -- create-weight` verde (R1 y los
      dos de R10); `pnpm -C backend-pet-tracker exec tsc --noEmit` limpio.
- [ ] (3) Refactor: doc-comment de una línea en el use case («#89:
      measuredAt se compara con el día civil del owner, sin margen»);
      lint/format. **Commit 2**: `feat(dto-dates-owner-timezone): validate
      measuredAt against the owner local day on create (R1)`.

## R2 — alta de mascota: `birthDate` se compara con el día civil del requester

Sujeto que crea esta tarea: `PetBirthDateInFutureError`, `requesterLocalDay`
(mínimo), `USER_REPOSITORY` en `CreatePetUseCase`, `AuthModule` en
`PetsModule`, `execute(dto, userId, now)`, el `now` de `PetsController.create`.

- [ ] (1) Test rojo — `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts`:
      - Constantes `NOW_CDMX_EVENING` / `NOW_KIRITIMATI_MORNING`; imports de
        `User` (`@/modules/auth/domain/entities/user.entity`) y
        `UserRepository` (`@/modules/auth/domain/repositories/user.repository`).
      - Describe y cuatro `it` **exactos** de [[requirements]] R2 con su
        fixture; `new CreatePetUseCase(pets, users, auditLogger)`. Sin
        importar la clase del error.
      - `buildDeps` (`:41-58`) gana `users = { findById:
        jest.fn().mockResolvedValue({ timezone: 'UTC' } as User) } as
        unknown as UserRepository` y lo devuelve; los tres `it` de #5
        (`:61-76`, `:80-93`, `:95-106`) construyen `(pets, users,
        auditLogger)` y pasan `NOW_CDMX_EVENING` a `execute`. Nombres y
        aserciones intactos.
      - `src/modules/pets/infrastructure/pets.controller.spec.ts:89-92`:
        `toHaveBeenCalledWith({ … }, USER.id, expect.any(Date))`. Nombre
        intacto.
      `pnpm -C backend-pet-tracker test -- create-pet pets.controller`:
      rojos por aserción — R2(1), (3), (4) rechazan con `this.auditLogger.record
      is not a function`; R2(2) `createWithOwner` llamado y mensaje
      distinto; heredados `'delega en createWithOwner…'` y `'registra la
      entrada…'` rojos por la misma aridad; `'no audita nada si la
      transaccion falla'` verde; `pets.controller.spec.ts` R2 rojo
      (`expect.any(Date)` ausente). Copiar la salida. **Commit 3**:
      `test(dto-dates-owner-timezone): create pet compares birthDate with
      the requester local day (R2)`.
- [ ] (2) Implementación mínima (archivos 5, 6, 7, 9 y 11):
      - `pet.errors.ts`: clase `PetBirthDateInFutureError` de [[design]] D10.
      - `src/modules/pets/application/requester-local-day.ts` (nuevo):
        `export async function requesterLocalDay(users: UserRepository,
        userId: string, now: Date): Promise<string>` → `const user = await
        users.findById(userId); return localDayOf(now.getTime(),
        user?.timezone ?? 'UTC');`. **Sin** `isSupportedTimeZone` ni `warn`
        todavía (eso es R3). Import de `localDayOf` desde
        `@/pipeline/local-day` y del tipo `UserRepository`.
      - `create-pet.use-case.ts`: `@Inject(USER_REPOSITORY) private
        readonly users: UserRepository` entre `pets` y `auditLogger`;
        `execute(dto: CreatePetDto, userId: string, now: Date)`; primera
        línea: `if (dto.birthDate !== undefined && dto.birthDate > (await
        requesterLocalDay(this.users, userId, now))) throw new
        PetBirthDateInFutureError();`. Imports de `USER_REPOSITORY`,
        `UserRepository`, `requesterLocalDay` (alias
        `@/modules/pets/application/requester-local-day`, mismo estilo que
        `get-pet.use-case.ts:2`) y el error.
      - `pets.module.ts`: `AuthModule` primero en `imports`; import de
        `@/modules/auth/auth.module`; una línea en el doc-comment
        (`:16-22`).
      - `pets.controller.ts:62-63`: `const now = new Date();` tras el
        `parseBody`; `this.createPet.execute(dto, user.id, now)`. **Sin**
        `try/catch` ni rama del mapper todavía (eso es R6).
      Unitario verde (R2 + heredados + `pets.controller`); `tsc --noEmit`
      limpio — si algún archivo fuera de la lista se pone rojo por tipos,
      **para**.
- [ ] (3) Refactor: una línea en el doc-comment del use case (`:9-14`);
      lint/format. **Commit 4**: `feat(dto-dates-owner-timezone): validate
      birthDate against the requester local day on create (R2)`.

## R3 — `requesterLocalDay` degrada a UTC con un warn y comparte la lógica IANA con `ownerLocalDay`

Sujeto sobre el que asevera: el helper de R2. Le añade la validación IANA y
el `warn` extrayendo `localDayInZone`; `ownerLocalDay` pasa a delegar.

- [ ] (1) Test rojo — `src/modules/pets/application/requester-local-day.spec.ts`
      (nuevo): describe y tres `it` **exactos** de [[requirements]] R3, con
      `warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation()`
      en `beforeEach` y `mockRestore` en `afterEach` (`Logger` de
      `@nestjs/common`), `NOW = new Date('2026-08-11T02:00:00.000Z')`,
      `USER_ID` cualquiera, `users = { findById:
      jest.fn().mockResolvedValue(valor) } as unknown as UserRepository`.
      `pnpm -C backend-pet-tracker test -- requester-local-day`: (1) verde
      ya (anotarlo), (2) rojo por conteo del `warn` (0 ≠ 1), (3) rojo por
      `InvalidTimeZoneError: unknown IANA time zone: Not/A/Zone`. Copiar
      la salida. **Commit 5**: `test(dto-dates-owner-timezone):
      requesterLocalDay falls back to UTC with a warn on missing user or
      non-IANA zone (R3)`.
- [ ] (2) Implementación mínima (archivos 6 y 13) — la mínima que no
      duplica: en `owner-local-day.ts` extraer `export function
      localDayInZone(raw: string | null, now: Date, context: Record<string,
      unknown>): string` con el cuerpo actual de `:13-24` (`timezone`,
      `if (timezone !== raw) logger.warn({ ...context, timezone: raw,
      message: 'falling back to UTC: timezone missing or not a IANA zone'
      })`, `return localDayOf(...)`; el `message` pierde la palabra
      `owner`, ningún test lo asevera); `ownerLocalDay` queda en `return
      localDayInZone(await pets.findOwnerTimezone(petId), now, { scope:
      'owner-local-day', petId });`. En `requester-local-day.ts`: `return
      localDayInZone(user?.timezone ?? null, now, { scope:
      'requester-local-day', userId });` importando `localDayInZone` de
      `./owner-local-day`; fuera el import de `localDayOf`.
      `pnpm -C backend-pet-tracker test -- requester-local-day
      owner-local-day get-pet.use-case vaccine-mutations create-pet
      create-weight` verde con `git diff 381d1e36...HEAD --
      backend-pet-tracker/src/modules/pets/application/owner-local-day.spec.ts
      backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.spec.ts
      backend-pet-tracker/src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts`
      **vacío**; `grep -ln "isSupportedTimeZone"
      src/modules/pets/application/*.ts` → solo `owner-local-day.ts`;
      `grep -c "isSupportedTimeZone\|Logger"
      src/modules/pets/application/requester-local-day.ts` → `0`; `tsc
      --noEmit` limpio. **Commit 6**: `feat(dto-dates-owner-timezone):
      share the IANA fallback between ownerLocalDay and requesterLocalDay
      via localDayInZone (R3)`.
- [ ] (3) Refactor: ninguno más — la extracción **es** el verde y ya está
      cubierta por los candados de #82/#88. Lint/format sobre los dos
      archivos (entra en el commit 6).

## R4 — edición de mascota: `birthDate` se compara con el día civil del owner solo si el body lo trae

Sujeto que crea esta tarea: `UpdatePetUseCase.execute(petId, userId, dto,
now)`, el `now` de `PetsController.update`. Asevera sobre `ownerLocalDay`
(#88) y sobre `PetBirthDateInFutureError` (R2).

- [ ] (1) Test rojo — `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts`:
      constantes `NOW_CDMX_EVENING` / `NOW_KIRITIMATI_MORNING`; `buildDeps`
      (`:37-45`) gana `findOwnerTimezone = jest.fn().mockResolvedValue('UTC')`
      dentro de `pets` y lo devuelve; describe y cuatro `it` **exactos** de
      [[requirements]] R4; los siete `execute` heredados
      (`:52,72,84,98,115,128,140`) ganan `NOW_CDMX_EVENING`. En
      `pets.controller.spec.ts:291-293`: `toHaveBeenCalledWith(PET_ID,
      USER.id, { name: 'Firu' }, expect.any(Date))`.
      `pnpm -C backend-pet-tracker test -- update-pet pets.controller`:
      R4(1) y R4(3) `findOwnerTimezone` con `Number of calls: 0`; R4(2)
      `Received promise resolved instead of rejected`; R4(4) verde ya
      (anotarlo); heredados verdes; `pets.controller.spec.ts` R13 rojo.
      Copiar la salida. **Commit 7**: `test(dto-dates-owner-timezone):
      update pet compares birthDate with the owner local day only when
      present (R4)`.
- [ ] (2) Implementación mínima (archivos 14 y 9):
      - `update-pet.use-case.ts`: `execute(petId: string, userId: string,
        dto: UpdatePetDto, now: Date)`; primera línea del cuerpo: `if
        (dto.birthDate !== undefined && dto.birthDate > (await
        ownerLocalDay(this.pets, petId, now))) throw new
        PetBirthDateInFutureError();`. Imports de `ownerLocalDay`
        (`@/modules/pets/application/owner-local-day`) y del error.
      - `pets.controller.ts:122-126`: `const now = new Date();` como
        primera línea del `try`; `this.updatePet.execute(petId,
        request.user.id, dto, now)`.
      Unitario verde; `tsc --noEmit` limpio.
- [ ] (3) Refactor: una línea en el doc-comment (`:13-17`: la validación
      de `birthDate` vs. hoy ya no corre en el borde HTTP); lint/format.
      **Commit 8**: `feat(dto-dates-owner-timezone): validate birthDate
      against the owner local day on update (R4)`.

## R5 — frontera e2e de pesos: hoy y mañana en la zona del owner

Sujeto que crea esta tarea: el describe R5, el DTO de pesos sin `refine` ni
constante, `iso-date.ts` sin `todayIsoDateUtc`, el `catch` de
`WeightsController.create`. Asevera de punta a punta sobre R1.

- [ ] (1) Test rojo — `test/health-weights.e2e-spec.ts`: `seedUser(label:
      string, timezone = 'UTC')` (`:40-56`, `timezone` en el `insert`);
      imports `localDayOf` y `shiftDay` de `@/pipeline/local-day`; fuera
      el import `:15`; describe y `it` **exactos** de [[requirements]] R5;
      heredado de #15 R7 (`:380-401`) adaptado como dice R5 (`isoDateOffset(1)`
      → `400`, `toHaveLength(1)`, `currentWeight === 20`). `pgrep` vacíos →
      `pnpm -C backend-pet-tracker run test:e2e -- health-weights`:
      **solo** el `it` de R5 y el heredado adaptado rojos, por status
      (`expected 400 "Bad Request", got 500 "Internal Server Error"` en
      Pago_Pago a cualquier hora y en Kiritimati si `h < 10`; el heredado
      `got 500` a cualquier hora). Si alguno falla por otra cosa (timeout,
      zona desconocida), arregla el test, no producción. Copiar los
      `Expected/Received` con `date -u`. **Commit 9**:
      `test(dto-dates-owner-timezone): e2e measuredAt today and tomorrow in
      the owner zone without margin (R5)`.
- [ ] (2) Implementación mínima (archivos 17, 18 y 4):
      - `weight.dto.ts`: `measuredAt: IsoDateSchema,` (`:10-13`); fuera
        `MEASURED_AT_MAX_FUTURE_DAYS` (`:6`), `maxMeasuredAtIsoDate`
        (`:29-33`) y `todayIsoDateUtc` del import (`:2`).
      - `iso-date.ts`: fuera `todayIsoDateUtc` (`:5-7`).
      - `weights.controller.ts`: `create` envuelve la llamada en `try {
        … } catch (error) { if (error instanceof
        WeightMeasuredInFutureError) throw validationError([{ path:
        ['measuredAt'], message: error.message }]); throw error; }`; import
        del error.
      `pnpm -C backend-pet-tracker run test:e2e -- health-weights` verde
      completo (describes de #15 incluidos); `grep -rn
      "todayIsoDateUtc\|MEASURED_AT_MAX_FUTURE_DAYS\|maxMeasuredAtIsoDate"
      src test` → solo `create-pet.dto.ts` (cae en R6); `tsc --noEmit`
      limpio.
- [ ] (3) Refactor: ninguno. Lint/format. **Commit 10**:
      `feat(dto-dates-owner-timezone): drop the UTC+1 refine from the
      weight DTO and map WeightMeasuredInFutureError to the validation 400
      (R5)`.

## R6 — frontera e2e de mascotas: hoy y mañana en la zona del requester (POST) y del owner (PATCH)

Sujeto que crea esta tarea: el describe R6, el DTO de mascotas sin el
`refine` UTC ni la copia local de `todayIsoDateUtc`, la rama de
`mapPetError` y el `try/catch` de `create`. Asevera sobre R2-R4.

- [ ] (1) Test rojo — `test/pets.e2e-spec.ts`: `seedUser(label: string,
      timezone = 'UTC')` (`:103-121`); imports `localDayOf`/`shiftDay`;
      describe y dos `it` **exactos** de [[requirements]] R6 (POST vía
      `createPetViaApi(requester, { birthDate: today })` para el `201` y
      `request(...).post('/v1/pets')` directo para el `400`; PATCH sobre
      `createPetViaApi(owner)`). En `create-pet.dto.spec.ts` retirar la
      fila `:56`; en `update-pet.dto.spec.ts` retirar la fila `:16`.
      `pgrep` vacíos → `pnpm -C backend-pet-tracker run test:e2e -- pets`:
      **solo** los dos `it` nuevos rojos, por status (`expected 201/200,
      got 400` para Kiritimati si `h >= 10`; `expected 400, got 500` para
      Pago_Pago si `h < 11`; a las 10 UTC, ambos). `pnpm -C
      backend-pet-tracker test -- create-pet.dto update-pet.dto` verde.
      Copiar la salida con `date -u`. **Commit 11**:
      `test(dto-dates-owner-timezone): e2e birthDate today and tomorrow in
      the requester zone on POST and the owner zone on PATCH (R6)`.
- [ ] (2) Implementación mínima (archivos 22 y 9):
      - `create-pet.dto.ts`: `BirthDateSchema` sin el tercer `refine`
        (`:10-12`); fuera `todayIsoDateUtc` (`:64-66`); doc-comment `:5`
        como en [[design]] §Archivos afectados n.º 22.
      - `pets.controller.ts`: `create` envuelve `execute` + `toPetProfileResponse`
        en `try { … } catch (error) { throw mapPetError(error); }`;
        `mapPetError` gana la rama de [[design]] D5 antes del `return`
        actual; import del error.
      `pnpm -C backend-pet-tracker run test:e2e -- pets` verde completo
      (describes de #5, #66 incluidos); `grep -rn "todayIsoDateUtc" src
      test` vacío; `tsc --noEmit` limpio.
- [ ] (3) Refactor: ninguno. Lint/format. **Commit 12**:
      `feat(dto-dates-owner-timezone): drop the UTC refine from the pet DTO
      and map PetBirthDateInFutureError to the validation 400 (R6)`.

## R7 — regresión: barrido, contrato intacto, diff acotado, suite verde

Sujeto sobre el que asevera: el árbol en `HEAD` tras el commit 12.

- [ ] (1) Verificación (sin test nuevo): los comandos de [[requirements]]
      R7-(a)…(f) uno por uno, con su salida en el reporte: `git diff
      --name-only 381d1e36...HEAD -- backend-pet-tracker/` = los
      veintidós de [[design]]; `git diff --stat 381d1e36...HEAD --
      mobile-pet-tracker/` vacío; los cuatro `grep` del barrido (b) con
      el resultado esperado (el tercero vacío; el cuarto solo
      `local-day.ts`, `iso-date.ts`, `daily-positions.dynamo.reader.ts`);
      los dos `grep` de (c); `git diff 381d1e36...HEAD -- <archivo>` vacío
      para cada uno de (d) y (e); en los dos e2e los hunks caen solo donde
      dice (f).
- [ ] (2) `pgrep` vacíos → `pnpm -C backend-pet-tracker run test:e2e --
      health-weights pets` y la suite e2e completa verdes; después `env -u
      FORCE_COLOR bash ./init.sh` desde la raíz, verde y **sin** el aviso
      «se saltan los e2e». Copiar la línea `Tests: N passed, N total` y la
      última línea de `init.sh` a `## Regresión (R7)` (si hubo segunda
      corrida por el flake #72, las dos).
- [ ] (3) Sin commit todavía (va en el commit 13 con R8).

## R8 — mutaciones no versionadas: margen, UTC en create-pet, zona ignorada

Sujeto sobre el que asevera: el árbol verde de R7. Nada de esto se commitea.

- [ ] (1) **M1**: en `create-weight.use-case.ts` comparar contra
      `shiftDay(today, 1)` (import de `shiftDay` desde
      `@/pipeline/local-day`, `today` como variable local). `pnpm -C
      backend-pet-tracker test -- create-weight`: rojo **solo** R1(2)
      (`Received promise resolved instead of rejected`). `pgrep` vacíos →
      `pnpm -C backend-pet-tracker run test:e2e -- health-weights`: el `it`
      de R5 rojo en Pago_Pago (`expected 400, got 201`) y el heredado de
      #15 R7 rojo (`expected 400, got 201`), a cualquier hora. Copiar los
      bloques y `date -u` a `## Mutación (R8)` → `### M1`. Revertir con
      `git checkout -- backend-pet-tracker/src/modules/health/application/use-cases/create-weight.use-case.ts`;
      `git status --short` limpio.
- [ ] (2) **M2**: en `create-pet.use-case.ts` sustituir `await
      requesterLocalDay(this.users, userId, now)` por
      `now.toISOString().slice(0, 10)`. Unitario `-- create-pet`: R2(1)
      (`findById` 0 llamadas), R2(2) (resuelve), R2(3) (rechaza) rojos.
      e2e `-- pets`: el `it` POST de R6 rojo para al menos una zona (tabla
      de [[design]] D9); el `it` PATCH verde. Copiar a `### M2`. Revertir;
      `git status --short` limpio.
- [ ] (3) **M3**: en `owner-local-day.ts` hacer que `localDayInZone`
      devuelva `now.toISOString().slice(0, 10)` (resto intacto). Unitario
      `-- create-weight update-pet requester-local-day owner-local-day
      get-pet.use-case vaccine-mutations`: rojos R1(2)(3), R4(2)(3), R3(1),
      #88 R3(1), #82 R1 (`Expected: "2026-08-09"`, `Received:
      "2026-08-10"`), #88 R1(2)(3) y R2(2)(3). e2e `-- health-weights pets
      health-vaccines`: R5, los dos `it` de R6 y #88 R4 rojos para al menos
      una zona. Copiar a `### M3`. Revertir; `git status --short` limpio;
      unitario y e2e de la feature verdes otra vez.
- [ ] (4) Sin commit de código. `git log --oneline 381d1e36..HEAD` sigue
      mostrando los doce commits de código (más los de apertura y spec del
      leader).

## Cierre

- [ ] Rellenar [[traceability]]: filas R1-R8, tabla de criterios, y las
      filas de §Tests de features anteriores actualizados (los dos `it` de
      #15 R10, los tres de #5 R2/R3, los siete `execute` de #5
      R13/R14/R15, los dos de `pets.controller.spec.ts`, el `it` de #15
      R7, las dos filas de los DTO specs).
- [ ] **Commit 13**: `docs(dto-dates-owner-timezone): mutation evidence,
      regression sweep and traceability (R7,R8)` con
      `progress/impl_dto-dates-owner-timezone.md` (secciones `## T0`, `##
      Rojo/verde por commit`, `## Regresión (R7)`, `## Mutación (R8)`) y
      `specs/dto-dates-owner-timezone/traceability.md`.
- [ ] `git log --oneline 381d1e36..HEAD` muestra los trece commits de
      [[design]] D12 (más los del leader). `git push -u origin
      feature/89-dto-dates-owner-timezone`. **PARA**: el PR lo abre el
      leader tras el veredicto del reviewer.
