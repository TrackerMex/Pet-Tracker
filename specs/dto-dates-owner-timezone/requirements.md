---
feature: "dto-dates-owner-timezone"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Requisitos — [[dto-dates-owner-timezone]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #89 (`description` + los 4
> `acceptance_criteria`), la deuda de
> `specs/vaccine-applied-at-owner-timezone/requirements.md` §Fuera de
> alcance (#88) y los dos mensajes del leader del 2026-09-11 con las
> premisas móviles verificadas por la sesión Frontend. Todas las rutas son
> relativas a `backend-pet-tracker/` salvo que se indique lo contrario. Las
> líneas citadas son las del commit base `381d1e36` (`origin/main` tras
> PR #120/#88, `merge-base` de la branch
> `feature/89-dto-dates-owner-timezone`); si el archivo se movió, manda el
> símbolo, no el número. Cada hecho de §Contexto se verificó contra ese
> árbol, no contra el enunciado ni contra la exploración de #88.

## Contexto — el defecto exacto

Dos DTOs siguen comparando una fecha civil del body con el **día UTC del
reloj del servidor**, el mismo sesgo que #82 (lectura) y #88 (escritura)
corrigieron para las vacunas:

- **Pesos** — `src/modules/health/application/dto/weight.dto.ts:10-13`
  (`CreateWeightSchema.measuredAt`): `IsoDateSchema.refine((date) => date <=
  maxMeasuredAtIsoDate(), 'measuredAt is too far in the future')`;
  `maxMeasuredAtIsoDate` (`:29-33`) suma `MEASURED_AT_MAX_FUTURE_DAYS = 1`
  (`:6`) al `todayIsoDateUtc()` de `src/modules/health/application/dto/iso-date.ts:5-7`
  (`new Date().toISOString().slice(0, 10)`). El margen `+1` tapa el
  síntoma de las zonas positivas (Kiritimati a las 10:00 ya es «mañana
  UTC» y `<= D+1` lo deja pasar) a costa de aceptar una medición de
  **mañana local** en cualquier zona: owner en `America/Mexico_City`
  (UTC-6) a las 20:00 del 2026-08-10 = `2026-08-11T02:00Z`, día UTC
  `2026-08-11`, máximo `2026-08-12`; `measuredAt = '2026-08-11'` (mañana
  local) responde `201`. Y `'2026-08-12'` (pasado mañana local) también.
- **Alta de mascota** — `src/modules/pets/application/dto/create-pet.dto.ts:6-12`
  (`BirthDateSchema`): tercer `refine((value) => value <= todayIsoDateUtc(),
  { message: 'birthDate cannot be in the future' })` con su **copia local**
  de `todayIsoDateUtc` (`:64-66`). Sin margen: requester en
  `Pacific/Kiritimati` (UTC+14) a las 10:00 del 2026-08-11 =
  `2026-08-10T20:00Z`, día UTC `2026-08-10`; `birthDate = '2026-08-11'`
  (hoy local, la mascota nació esta mañana) responde **`400` indebido**.
  Requester en CDMX a las 20:00: `birthDate = '2026-08-11'` (mañana local)
  `<= '2026-08-11'` → se registra un nacimiento del futuro.
- **Premisa corregida (no estaba en el enunciado)**: `BirthDateSchema` no
  es solo del POST. `PetFieldsSchema` (`create-pet.dto.ts:20-31`) lo usa en
  `:24` y `UpdatePetSchema = PetFieldsSchema.partial()`
  (`src/modules/pets/application/dto/update-pet.dto.ts:10`) lo hereda: el
  `refine` UTC también corre hoy en `PATCH /v1/pets/:petId`. Quitar el
  `refine` del DTO sin mover la regla al `UpdatePetUseCase` dejaría el
  PATCH sin ninguna validación de futuro (regresión), así que el PATCH
  entra en alcance ([[design]] D7). `update-pet.dto.spec.ts:16` (`['birthDate
  futura', { birthDate: '2999-01-01' }]` bajo «rechaza … (mismas reglas que
  R4)») y `create-pet.dto.spec.ts:56` (`['birthDate posterior a hoy', {
  birthDate: isoDateDaysFromNow(1) }]`) aseveran hoy ese `refine` y cambian
  en R6.
- Dirección del sesgo verificada con `Intl` en el Node v20.20.2 del VPS
  (2026-09-11): `2026-08-11T02:00Z` → `America/Mexico_City` = `2026-08-10`,
  `Pacific/Pago_Pago` = `2026-08-10`; `2026-08-10T20:00Z` →
  `Pacific/Kiritimati` = `2026-08-11`. `Intl.supportedValuesOf('timeZone')`
  contiene las tres zonas.
- Dónde corre zod y cómo sale el 400 hoy: pesos, `parseBody` en
  `src/modules/health/infrastructure/weights.controller.ts:40` →
  `validationError` (`:74-85`) construye `BadRequestException({ statusCode:
  400, message: 'Validation failed', errors: [{ path, message }] })`;
  `WeightsController.create` (`:34-48`) **no tiene `try/catch`** y no
  existe ningún mapper de errores de pesos (`ls
  src/modules/health/infrastructure/mappers/` → `vaccine-error.mapper.ts`,
  `vaccine.mapper.ts`, `weight.mapper.ts`): un error de dominio lanzado por
  `CreateWeightUseCase` llegaría crudo y Nest respondería `500`. Mascotas,
  `parseBody` en `src/modules/pets/infrastructure/pets.controller.ts:180-195`
  (misma forma); `create` (`:57-67`) tampoco tiene `try/catch`; `update`
  (`:113-130`) sí, vía `mapPetError` (`:171-173`), que solo conoce
  `PetNotFoundError` y devuelve lo demás crudo.
- Casos de uso: `CreateWeightUseCase`
  (`src/modules/health/application/use-cases/create-weight.use-case.ts:13-17`)
  inyecta **solo** `WEIGHT_REPOSITORY` y `AUDIT_LOGGER`; `execute(petId,
  dto, userId)` (`:19-23`) no recibe reloj ni consulta la zona.
  `CreatePetUseCase` (`src/modules/pets/application/use-cases/create-pet.use-case.ts:16-22`)
  inyecta `PET_REPOSITORY` y `AUDIT_LOGGER`; `execute(dto, userId)`
  (`:24`). `UpdatePetUseCase` (`update-pet.use-case.ts:19-25`) inyecta lo
  mismo; `execute(petId, userId, dto)` (`:27-31`).
- Lo que #88 dejó hecho: `ownerLocalDay(pets, petId, now)` en
  `src/modules/pets/application/owner-local-day.ts:7-25` (`findOwnerTimezone`
  → `isSupportedTimeZone` → `'UTC'` + un `Logger.warn({ scope:
  'owner-local-day', petId, timezone: raw, message })` → `localDayOf`), con
  su spec `owner-local-day.spec.ts` (#88 R3) y tres consumidores
  (`get-pet.use-case.ts:69`, `create-vaccine.use-case.ts:33`,
  `update-vaccine.use-case.ts:36`). `PetRepository.findOwnerTimezone`
  (`src/modules/pets/domain/repositories/pet.repository.ts:47-48`) devuelve
  el `users.timezone` del **primer owner activo** por `created_at`
  (`pet.drizzle.repository.ts:114-130`).
- Lo que hace falta para el requester: `USER_REPOSITORY` y `UserRepository`
  viven en `src/modules/auth/domain/repositories/user.repository.ts:3,30-48`;
  `findById(id): Promise<User | null>` (`:43`); `User.timezone: string`
  (`src/modules/auth/domain/entities/user.entity.ts:27`, default
  `DEFAULT_TIMEZONE = 'UTC'`, `:1`). El registro **no** valida IANA
  (`register-user.dto.ts:24`: `z.string().trim().min(1).max(64)`); el
  PATCH de perfil sí (`update-profile.dto.ts:10-11`). `AuthModule` exporta
  `USER_REPOSITORY` (`src/modules/auth/auth.module.ts:104`) y solo importa
  `ConfigModule`; `UsersModule` ya lo importa por eso (`users.module.ts:24`);
  `PetsModule` (`pets.module.ts:24`) **no** lo importa aún y ningún archivo
  de `src/modules/auth/` importa de `modules/pets` (grep vacío): añadirlo no
  crea ciclo.
- Dobles y llamadores (grep en `381d1e36`): `MockOf<PetRepository>` solo en
  `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`, que
  ya tiene `findOwnerTimezone`; **no existe** `MockOf<UserRepository>` ni
  `MockOf<WeightRepository>` en `src` ni `test`. Esta feature **no añade
  métodos a ningún puerto**: ningún doble exhaustivo cambia. Llamadores que
  cambian de firma: `CreateWeightUseCase` → `create-weight.use-case.spec.ts:31,51`
  (construcción posicional `(repository, { record })`) y
  `weights.controller.ts:42-46`; `CreatePetUseCase` →
  `create-pet.use-case.spec.ts:63,82,100` (`new CreatePetUseCase(pets,
  auditLogger)`), `pets.controller.ts:63` y `pets.controller.spec.ts:89-92`
  (`toHaveBeenCalledWith(dto, USER.id)`); `UpdatePetUseCase.execute` →
  `update-pet.use-case.spec.ts:52,72,84,98,115,128,140` y
  `pets.controller.spec.ts:291-293`. `health.module.ts` registra ambos use
  cases de pesos y ya importa `PetsModule` (`:25`): inyectar
  `PET_REPOSITORY` en `CreateWeightUseCase` no toca ningún módulo.
- e2e: `test/health-weights.e2e-spec.ts` siembra owners **siempre** en
  `'UTC'` (`seedUser(label)`, `:40-56`, sin parámetro de zona) y calcula
  `today()`/`isoDateOffset(days)` en UTC (`:33-38`); su `it('acepta hoy y
  hoy mas un dia, pero rechaza hoy mas dos')` (#15 R7, `:380-401`) importa
  `MEASURED_AT_MAX_FUTURE_DAYS` (`:15`) y **depende del margen**: es el
  único test del repo que lo hace. `test/pets.e2e-spec.ts` siembra en
  `'UTC'` (`seedUser(label)`, `:103-121`) y crea mascotas con
  `createPetViaApi(owner, overrides)` (`:123-142`, `birthDate:
  '2024-01-15'`, hace `createdPetIds.push`). `test/nutrition.e2e-spec.ts:83`
  manda `measuredAt` = hoy UTC con owner `'UTC'` (sigue `201` sin margen);
  `test/backfill-weights.e2e-spec.ts:111,137` manda `'2025-03-04'`. Los
  demás e2e mandan `birthDate: '2024-01-15'` o anteriores.
- **Premisa móvil verificada** (solo lectura; sesión Frontend + este
  árbol): el cliente manda **fecha civil `YYYY-MM-DD` del reloj local del
  dispositivo**, nunca un instante UTC ni ISO con hora.
  `mobile-pet-tracker/src/app/(tabs)/weight-log.tsx:39-44` `localTodayIso()`
  (`getFullYear`/`getMonth()+1`/`getDate()` con `padStart`) es el valor por
  defecto del campo (`:62`) y lo que envía `createWeight` (`:84`).
  `mobile-pet-tracker/src/screens/add-pet/index.tsx:34-39` `dateToIso(date)`
  aplica el mismo patrón al `Date` del picker (`:164`). Esa zona es la del
  **dispositivo**, que puede no coincidir con `users.timezone` del owner
  (usuario viajando, mascota compartida); el móvil no lee `users.timezone`.
  **Nadie depende del margen `+1`**: las fixturas de
  `weight-log.test.tsx` son pasadas fijas o `localTodayIso()` (`:370`);
  ninguna manda «mañana». El camino de error ya está cubierto:
  `weight-log.test.tsx:376-382` simula el 400 con `{ path: 'measuredAt',
  message: 'Date is in the future' }` y `health-records.ts:132-140` lo
  mapea a `{ kind: 'validation', errors }` leyendo **solo** `errors[]`.
  Ese texto simulado (`'Date is in the future'`) **no coincide** con el que
  emite el backend (`'measuredAt is too far in the future'`,
  `weight.dto.ts:12`): es una fixtura, no una expectativa sobre el
  backend; ningún archivo de `mobile-pet-tracker/src` contiene ninguno de
  los dos mensajes del backend (grep vacío). El contrato que el móvil sí
  usa es la **forma** `errors[{ path, message }]`; [[design]] D5 la
  conserva byte a byte. `add-pet/index.test.tsx:116-140` manda `birthDate:
  '2024-04-09'` (pasado).

## Requisitos funcionales

### Bloque A — pesos: `measuredAt` se compara con el día civil del owner, sin margen (unitario)

- **R1**: WHEN `CreateWeightUseCase.execute(petId, dto, userId, now)` corre,
  THE SYSTEM SHALL calcular `today = await ownerLocalDay(this.pets, petId,
  now)` (helper existente de #88) como **primera** operación de `execute`
  (antes de `weights.create`, `findPrevious` y `audit.record` — misma
  precedencia que hoy tiene el `refine` de zod), y IF `dto.measuredAt >
  today` (comparación de cadenas `YYYY-MM-DD`, **sin** sumar ningún día)
  THEN THE SYSTEM SHALL lanzar `WeightMeasuredInFutureError`
  (`src/modules/health/domain/errors/weight.errors.ts`, archivo nuevo,
  mensaje exacto `'measuredAt is too far in the future'`) sin llamar a
  `weights.create` ni a `audit.record`; WHILE `dto.measuredAt <= today` THE
  SYSTEM SHALL continuar exactamente como en `381d1e36`. Para ello
  `CreateWeightUseCase` SHALL inyectar `@Inject(PET_REPOSITORY) private
  readonly pets: PetRepository` como **segundo** parámetro del constructor
  (`(weights, pets, audit)`, mismo orden que `CreateVaccineUseCase`), `now`
  SHALL llegar del caller como cuarto argumento, y `WeightsController.create`
  (`weights.controller.ts:34-48`) SHALL construir **un solo** `new Date()`
  por request y pasarlo ([[design]] D1, D2, D3).

  - Test: `src/modules/health/application/use-cases/create-weight.use-case.spec.ts`,
    describe nuevo `'R1 (dto-dates-owner-timezone #89): create compara
    measuredAt con el dia civil del owner, sin margen'`. Constantes a nivel
    de módulo: `NOW_CDMX_EVENING = new Date('2026-08-11T02:00:00.000Z')`
    (día UTC `2026-08-11`; `America/Mexico_City` = 2026-08-10 20:00) y
    `NOW_KIRITIMATI_MORNING = new Date('2026-08-10T20:00:00.000Z')` (día
    UTC `2026-08-10`; `Pacific/Kiritimati` = 2026-08-11 10:00). Fixture:
    `weights = repository({ create: jest.fn().mockResolvedValue(persistedWeight())
    })` (helper existente `:19-26`), `pets = { findOwnerTimezone:
    jest.fn().mockResolvedValue(zona) } as unknown as PetRepository`,
    `audit = { record: jest.fn().mockResolvedValue(undefined) }`; `new
    CreateWeightUseCase(weights, pets, audit)`. Tres `it`:
    (1) `'acepta hoy local aunque UTC ya sea manana (America/Mexico_City,
    20:00)'`: zona `'America/Mexico_City'`, `now = NOW_CDMX_EVENING`, body
    `{ weightKg: 21.35, measuredAt: '2026-08-10' }` → resuelve;
    `findOwnerTimezone` llamado con `PET_ID`; `create` llamado con
    `expect.objectContaining({ measuredAt: '2026-08-10' })`.
    (2) `'rechaza manana local aunque UTC ya sea ese dia
    (America/Mexico_City, 20:00)'`: misma zona y `now`, `measuredAt:
    '2026-08-11'` → `rejects.toThrow('measuredAt is too far in the
    future')` y `rejects.toMatchObject({ name: 'WeightMeasuredInFutureError'
    })` sobre la misma promesa; `create` y `record` **no** llamados. Hoy el
    DTO acepta este valor (y hasta `'2026-08-12'`): este `it` es el que
    demuestra que el margen desapareció.
    (3) `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati,
    10:00)'`: zona `'Pacific/Kiritimati'`, `now = NOW_KIRITIMATI_MORNING`,
    `measuredAt: '2026-08-11'` → resuelve; `findOwnerTimezone` llamado con
    `PET_ID`; `create` con `objectContaining({ measuredAt: '2026-08-11' })`.
    No se importa la clase del error en el test (se asevera por `message` y
    `name`), para que el rojo sea **por aserción** y no por un export
    inexistente.
  - Tests heredados que cambian en el mismo commit rojo: los dos `it` de
    #15 R10 (`:29-46` y `:48-72`): el constructor gana `pets = {
    findOwnerTimezone: jest.fn().mockResolvedValue('UTC') } as unknown as
    PetRepository` como segundo argumento y `execute` gana
    `NOW_CDMX_EVENING` como cuarto (`measuredAt: '2026-08-11'` = día UTC
    de ese instante, así `<= today` con zona `'UTC'`). Nombres y aserciones
    intactos.
  - Rojo esperado antes de implementar: el constructor viejo tiene dos
    parámetros, así que `audit` recibe el mock de `pets`. (1) y (3):
    `create` y `findPrevious` corren y después `this.audit.record is not a
    function` → promesa rechazada (`Received promise rejected instead of
    resolved`); (2): `create` llamado (aserción «no llamado» roja) y el
    rechazo es un `TypeError`, no el mensaje esperado. El heredado `'audita
    el id creado con actor y petId tras resolver la escritura'` también
    queda rojo en el commit 1 por la **misma aridad** (llega a
    `audit.record`) y vuelve verde en el commit 2; `'no audita cuando la
    escritura falla'` sigue verde (rechaza antes). Cuatro rojos por
    aserción sobre la firma de producción que R1 crea (CHECKPOINTS C4,
    cuarto y quinto punto: ni `ReferenceError` de helper ni mutación de
    mock; mismo patrón que #88 R2, aceptado por el reviewer). Si ts-jest
    reportara antes un diagnóstico de tipos por la aridad, es sobre la
    firma de producción que R1 crea y se anota tal cual (en #82/#88 no lo
    hizo).

### Bloque B — alta de mascota: `birthDate` se compara con el día civil del requester (unitario)

- **R2**: WHEN `CreatePetUseCase.execute(dto, userId, now)` corre y
  `dto.birthDate !== undefined`, THE SYSTEM SHALL calcular `today = await
  requesterLocalDay(this.users, userId, now)` ([[design]] D3, D4) como
  **primera** operación de `execute` (antes de `createWithOwner` y del
  audit), y IF `dto.birthDate > today` THEN THE SYSTEM SHALL lanzar
  `PetBirthDateInFutureError` (`src/modules/pets/domain/errors/pet.errors.ts`,
  clase nueva, mensaje exacto `'birthDate cannot be in the future'`) sin
  llamar a `createWithOwner` ni a `record`; WHILE `dto.birthDate <= today`
  THE SYSTEM SHALL continuar exactamente como en `381d1e36`. WHILE
  `dto.birthDate === undefined` (alta por `approxAgeMonths`), THE SYSTEM
  SHALL NOT llamar a `users.findById`. Para ello `CreatePetUseCase` SHALL
  inyectar `@Inject(USER_REPOSITORY) private readonly users: UserRepository`
  como **segundo** parámetro (`(pets, users, auditLogger)`), `PetsModule`
  SHALL importar `AuthModule` ([[design]] D8), y `PetsController.create`
  (`pets.controller.ts:57-67`) SHALL construir **un solo** `new Date()` y
  pasarlo como tercer argumento.

  - Test: `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts`,
    describe nuevo `'R2 (dto-dates-owner-timezone #89): create compara
    birthDate con el dia civil del requester, no con el dia UTC'`.
    Constantes `NOW_CDMX_EVENING` y `NOW_KIRITIMATI_MORNING` (mismos
    valores que R1). Fixture: `pets = { createWithOwner:
    jest.fn().mockResolvedValue(buildPet()) } as unknown as PetRepository`,
    `users = { findById: jest.fn().mockResolvedValue({ timezone: zona } as
    User) } as unknown as UserRepository` (tipo `User` de
    `@/modules/auth/domain/entities/user.entity`, `UserRepository` de
    `@/modules/auth/domain/repositories/user.repository`), `auditLogger = {
    record: jest.fn().mockResolvedValue(undefined) }`; `new
    CreatePetUseCase(pets, users, auditLogger)`. Cuatro `it`:
    (1) `'acepta hoy local aunque UTC ya sea manana (America/Mexico_City,
    20:00)'`: `execute({ name: 'Firulais', species: 'dog', birthDate:
    '2026-08-10' }, OWNER_ID, NOW_CDMX_EVENING)` → resuelve; `findById`
    llamado con `OWNER_ID`; `createWithOwner` llamado con
    `(expect.objectContaining({ birthDate: '2026-08-10' }), OWNER_ID)`.
    (2) `'rechaza manana local aunque UTC ya sea ese dia
    (America/Mexico_City, 20:00)'`: `birthDate: '2026-08-11'` →
    `rejects.toThrow('birthDate cannot be in the future')` +
    `rejects.toMatchObject({ name: 'PetBirthDateInFutureError' })`;
    `createWithOwner` y `record` **no** llamados.
    (3) `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati,
    10:00)'`: zona `'Pacific/Kiritimati'`, `NOW_KIRITIMATI_MORNING`,
    `birthDate: '2026-08-11'` → resuelve; `createWithOwner` con
    `objectContaining({ birthDate: '2026-08-11' })`. Hoy el DTO lo rechaza
    con 400; el use case viejo lo acepta sin mirar la zona.
    (4) `'sin birthDate (approxAgeMonths) no consulta la zona del
    requester'`: `{ name: 'Michi', species: 'cat', approxAgeMonths: 6 }` →
    resuelve; `findById` **no** llamado; `createWithOwner` llamado con ese
    dto y `OWNER_ID`.
  - Tests heredados que cambian en el mismo commit rojo: los tres `it` de
    #5 R2/R3 (`:61-76`, `:80-93`, `:95-106`): `buildDeps` (`:41-58`) gana
    `users = { findById: jest.fn().mockResolvedValue({ timezone: 'UTC' } as
    User) } as unknown as UserRepository` y lo devuelve; las tres
    construcciones pasan a `new CreatePetUseCase(pets, users, auditLogger)`
    y los tres `execute` ganan `NOW_CDMX_EVENING` (`birthDate: '2024-01-15'`
    es pasado en cualquier zona). Nombres y aserciones intactos.
  - Rojo esperado antes de implementar: constructor viejo de dos parámetros
    → `auditLogger` recibe el mock de `users`. (1), (3), (4):
    `createWithOwner` corre y `this.auditLogger.record is not a function`
    → rechazo; (2): `createWithOwner` llamado y mensaje distinto. Los
    heredados `'delega en createWithOwner…'` y `'registra la entrada…'`
    quedan rojos en el commit 3 por la misma aridad y verdes en el 4; `'no
    audita nada si la transaccion falla'` sigue verde. Rojos por aserción
    sobre la firma de producción que R2 crea.

### Bloque C — `requesterLocalDay` degrada a UTC con un warn y comparte la lógica IANA con `ownerLocalDay` (unitario)

- **R3**: `requesterLocalDay(users: UserRepository, userId: string, now:
  Date): Promise<string>` (archivo nuevo
  `src/modules/pets/application/requester-local-day.ts`, [[design]] D4)
  SHALL llamar a `users.findById(userId)` y, WHEN el usuario existe y su
  `timezone` está en el catálogo de `isSupportedTimeZone`
  (`src/pipeline/local-day.ts:53`), SHALL devolver `localDayOf(now.getTime(),
  timezone)` sin emitir ningún `warn`. IF `findById` devuelve `null` o un
  usuario cuyo `timezone` `isSupportedTimeZone` rechaza, THEN THE SYSTEM
  SHALL devolver `localDayOf(now.getTime(), 'UTC')` y emitir **una** vez
  `Logger.warn` con un objeto que incluya `userId` y `timezone` (el valor
  crudo: `null` o la cadena), y nunca dejar escapar `InvalidTimeZoneError`
  — semántica idéntica a #88 R3. Además, la resolución «crudo →
  `isSupportedTimeZone` → `'UTC'` + un `warn` → `localDayOf`» SHALL existir
  **una sola vez** en `src/`: como función exportada `localDayInZone(raw:
  string | null, now: Date, context: Record<string, unknown>): string` en
  `owner-local-day.ts`, a la que delegan `ownerLocalDay` y
  `requesterLocalDay` ([[design]] D4). `src/modules/pets/application/owner-local-day.spec.ts`
  (#88 R3), `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts`
  (#82 R1/R2) y `src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts`
  (#88 R1/R2) SHALL seguir verdes **sin editarse**: son el candado del
  refactor de `ownerLocalDay`.

  - Test: `src/modules/pets/application/requester-local-day.spec.ts`
    (nuevo; precedente `owner-local-day.spec.ts`). Describe `'R3
    (dto-dates-owner-timezone #89): requesterLocalDay resuelve el dia civil
    del requester y degrada a UTC con un warn'`, `warnSpy =
    jest.spyOn(Logger.prototype, 'warn').mockImplementation()` en
    `beforeEach` y `mockRestore` en `afterEach`, `NOW = new
    Date('2026-08-11T02:00:00.000Z')`, `USER_ID` cualquiera, `users = {
    findById: jest.fn().mockResolvedValue(valor) } as unknown as
    UserRepository`. Tres `it`:
    (1) `'con zona IANA valida devuelve el dia local de now sin avisar'`:
    `{ timezone: 'America/Mexico_City' } as User` → `'2026-08-10'`;
    `findById` llamado con `USER_ID`; `warnSpy` no llamado;
    (2) `'sin usuario (null) devuelve el dia UTC de now y avisa una vez'`:
    `null` → `'2026-08-11'`; `warnSpy` 1 vez con `expect.objectContaining({
    userId: USER_ID, timezone: null })`;
    (3) `"con 'Not/A/Zone' devuelve el dia UTC de now y avisa una vez"`:
    `{ timezone: 'Not/A/Zone' } as User` → `'2026-08-11'`; `warnSpy` 1 vez
    con `objectContaining({ userId: USER_ID, timezone: 'Not/A/Zone' })`.
    Rojo esperado antes de implementar (tras el verde de R2, cuyo helper
    mínimo hace `localDayOf(now.getTime(), user?.timezone ?? 'UTC')` sin
    validar IANA ni avisar): (1) ya verde (se anota, no es un rojo); (2)
    rojo por conteo del `warn` (0 ≠ 1); (3) rojo por `InvalidTimeZoneError:
    unknown IANA time zone: Not/A/Zone` escapando de `localDayOf`. Dos
    rojos legítimos de comportamiento ausente (mismo patrón que #88 R3).
  - Verificación de «una sola vez» (parte de R7-c): `grep -ln
    "isSupportedTimeZone" src/modules/pets/application/*.ts` lista **solo**
    `owner-local-day.ts`; `grep -c "isSupportedTimeZone\|Logger"
    src/modules/pets/application/requester-local-day.ts` imprime `0`.
  - Candado del refactor (sin editar): `pnpm -C backend-pet-tracker test
    -- owner-local-day get-pet.use-case vaccine-mutations` verde tras el
    commit 6, con `git diff 381d1e36...HEAD -- <los tres specs>` vacío.

### Bloque D — edición de mascota: `birthDate` se compara con el día civil del owner solo si el body lo trae (unitario)

- **R4**: WHEN `UpdatePetUseCase.execute(petId, userId, dto, now)` corre y
  `dto.birthDate !== undefined`, THE SYSTEM SHALL aplicar la regla de R2
  con `today = await ownerLocalDay(this.pets, petId, now)` ([[design]] D3:
  la mascota existe, su zona es la de su owner, como en #82/#88) como
  **primera** operación de `execute`, antes del no-op de body vacío
  (`update-pet.use-case.ts:34-44`) y de `pets.update`: `dto.birthDate >
  today` lanza `PetBirthDateInFutureError`; `<=` continúa como en
  `381d1e36`. WHILE `dto.birthDate === undefined` (incluido el body vacío)
  THE SYSTEM SHALL NOT llamar a `findOwnerTimezone` y SHALL comportarse
  exactamente como en `381d1e36`. El constructor **no cambia** (ya inyecta
  `PET_REPOSITORY`); `PetsController.update` (`pets.controller.ts:113-130`)
  SHALL construir **un solo** `new Date()` dentro del `try` y pasarlo como
  cuarto argumento.

  - Test: `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts`,
    describe nuevo `'R4 (dto-dates-owner-timezone #89): update compara
    birthDate con el dia civil del owner solo cuando el body lo trae'`.
    `buildDeps` (`:37-45`) gana `findOwnerTimezone =
    jest.fn().mockResolvedValue('UTC')` dentro de `pets` y lo devuelve; los
    `it` de R4 hacen `findOwnerTimezone.mockResolvedValue(zona)`.
    Constantes `NOW_CDMX_EVENING` / `NOW_KIRITIMATI_MORNING`. Cuatro `it`:
    (1) `'acepta hoy local aunque UTC ya sea manana (America/Mexico_City,
    20:00)'`: `execute(PET_ID, USER_ID, { birthDate: '2026-08-10' },
    NOW_CDMX_EVENING)` → resuelve; `findOwnerTimezone` llamado con
    `PET_ID`; `update` llamado con `(PET_ID, { birthDate: '2026-08-10',
    approxAgeMonths: null })` (forma de `toFieldChanges`, `:62-72`);
    (2) `'rechaza manana local aunque UTC ya sea ese dia
    (America/Mexico_City, 20:00)'`: `{ birthDate: '2026-08-11' }` →
    `rejects.toThrow('birthDate cannot be in the future')` +
    `rejects.toMatchObject({ name: 'PetBirthDateInFutureError' })`; `update`
    y `record` **no** llamados;
    (3) `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati,
    10:00)'`: zona `'Pacific/Kiritimati'`, `NOW_KIRITIMATI_MORNING`, `{
    birthDate: '2026-08-11' }` → resuelve; `update` llamado con `(PET_ID, {
    birthDate: '2026-08-11', approxAgeMonths: null })`;
    (4) `'sin birthDate en el body no consulta la zona del owner'`: `{
    name: 'Firu' }` → resuelve; `findOwnerTimezone` **no** llamado; `update`
    llamado con `(PET_ID, { name: 'Firu' })`.
    Rojo esperado antes de implementar (el `execute` viejo ignora `now` y
    la zona): (1) y (3) `findOwnerTimezone` con `Number of calls: 0`; (2)
    `Received promise resolved instead of rejected`; (4) ya verde (se
    anota). Tres rojos por aserción.
  - Tests heredados que cambian en el mismo commit rojo: los siete
    `execute` de #5 R13/R14/R15 (`:52,72,84,98,115,128,140`) ganan
    `NOW_CDMX_EVENING` como cuarto argumento; nombres y aserciones
    intactos (el `execute` viejo ignora el argumento extra: siguen verdes
    en el commit rojo; con `findOwnerTimezone` en `buildDeps`, R14
    `'enviar birthDate pone approxAgeMonths en NULL'` sigue verde tras el
    verde con zona `'UTC'` y `'2024-01-15'`).

### Bloque E — frontera e2e de pesos: hoy y mañana en la zona del owner

- **R5**: WHEN un owner activo cuyo `users.timezone` es una zona IANA hace
  `POST /v1/pets/:petId/weights` con `measuredAt` igual al día civil de
  **esa zona** en el instante de la petición, THE SYSTEM SHALL responder
  `201` a cualquier hora del día (incluidas las horas en que UTC todavía es
  ayer o ya es mañana), con `body.measuredAt` igual al valor enviado. WHEN
  `measuredAt` es el día siguiente en esa zona, THE SYSTEM SHALL responder
  `400` con body **exactamente** `{ statusCode: 400, message: 'Validation
  failed', errors: [{ path: 'measuredAt', message: 'measuredAt is too far in
  the future' }] }` — la misma forma y el mismo texto que hoy produce zod
  ([[design]] D5) — sin persistir la fila ni cambiar `current_weight_kg`.
  Esto exige quitar el `refine` de `weight.dto.ts:10-13` (`measuredAt:
  IsoDateSchema`, criterio 3), borrar `MEASURED_AT_MAX_FUTURE_DAYS` (`:6`)
  y `maxMeasuredAtIsoDate` (`:29-33`) y el import de `todayIsoDateUtc`
  (`:2`), y mapear `WeightMeasuredInFutureError` en `WeightsController.create`
  ([[design]] D5).

  - Test: `test/health-weights.e2e-spec.ts`. `seedUser` (`:40-56`) gana el
    parámetro `timezone = 'UTC'` (misma firma que
    `health-vaccines.e2e-spec.ts:37-40`); se importan `localDayOf` y
    `shiftDay` de `@/pipeline/local-day`; se retira el import de
    `MEASURED_AT_MAX_FUTURE_DAYS` (`:15`). Describe nuevo `'R5
    (dto-dates-owner-timezone #89): measuredAt se compara con el dia civil
    del owner, sin margen'` con un `it`: `'POST acepta hoy y rechaza manana
    en la zona del owner para Pacific/Kiritimati y Pacific/Pago_Pago
    (R5)'`, iterando `['Pacific/Kiritimati', 'Pacific/Pago_Pago'].entries()`
    (índice en el `label`): `owner = await seedUser(\`r5-post-${index}\`,
    zona)`, `pet = await seedPet(owner)`, `today = localDayOf(Date.now(),
    zona)` calculado **una sola vez** antes de las dos peticiones;
    `postWeight(owner, pet.id, { weightKg: 20, measuredAt: today
    }).expect(201)` y `expect(body.measuredAt).toBe(today)`;
    `postWeight(owner, pet.id, { weightKg: 21, measuredAt: shiftDay(today,
    1) }).expect(400)` y `expect(body).toEqual({ statusCode: 400, message:
    'Validation failed', errors: [{ path: 'measuredAt', message:
    'measuredAt is too far in the future' }] })`; después
    `expect(await currentWeight(owner, pet.id)).toBe(20)`.
  - Test heredado que cambia en el mismo commit rojo: `it('acepta hoy y hoy
    mas un dia, pero rechaza hoy mas dos')` (#15 R7, `:380-401`) pasa a
    `it('acepta hoy y rechaza manana (owner en UTC; sin margen desde #89)')`:
    `isoDateOffset(0)` → `201`; `isoDateOffset(1)` → `400`; sin tercera
    petición; `toHaveLength(1)` y `currentWeight === 20`. Es el único test
    del repo que dependía del margen (§Contexto); se adapta, no se borra.
  - Rojo esperado antes de implementar (árbol tras los verdes de R1-R4:
    zod aún acepta `<= D+1` en UTC y el controller no mapea el error). Con
    `D` = día UTC y `h` = hora UTC de la corrida ([[design]] D9, tabla de
    pesos): «mañana» de Pago_Pago (`D` para `h < 11`, `D+1` para `h >= 11`)
    pasa siempre el `<= D+1` de zod, el use case lanza
    `WeightMeasuredInFutureError`, nadie lo mapea y Nest responde `500` ≠
    `400` → **rojo a cualquier hora**; «mañana» de Kiritimati es `D+1`
    para `h < 10` (mismo `500`) y `D+2` para `h >= 10` (zod → `400` con el
    body exacto, no delata). El heredado adaptado también es rojo a
    cualquier hora (`D+1` pasa zod → `500`). Determinismo: mismo argumento
    que #88 D8 — test y servidor corren en el mismo proceso Node y
    calculan `localDayOf` sobre la misma zona; la única ventana de fallo es
    que la medianoche de esa zona caiga entre `today` y el `new Date()` del
    controller. Por qué el **par** aunque una zona baste para este rojo:
    contra la mutación M3 de R8 (zona ignorada, sin margen) «hoy» de
    Kiritimati delata solo para `h >= 10` y «mañana» de Pago_Pago solo para
    `h < 11`; juntas cubren las 24 h.

### Bloque F — frontera e2e de mascotas: hoy y mañana en la zona del requester (POST) y del owner (PATCH)

- **R6**: WHEN un usuario cuyo `users.timezone` es una zona IANA hace `POST
  /v1/pets` con `birthDate` igual al día civil de **esa zona** en el
  instante de la petición, THE SYSTEM SHALL responder `201` a cualquier
  hora, con `body.birthDate` igual al valor enviado. WHEN `birthDate` es el
  día siguiente en esa zona, THE SYSTEM SHALL responder `400` con body
  **exactamente** `{ statusCode: 400, message: 'Validation failed', errors:
  [{ path: 'birthDate', message: 'birthDate cannot be in the future' }] }`
  ([[design]] D5). WHEN la misma pareja de valores llega por `PATCH
  /v1/pets/:petId` del owner sobre una mascota existente, THE SYSTEM SHALL
  responder `200` (hoy) y `400` con el mismo body (mañana). Esto exige
  quitar el tercer `refine` de `BirthDateSchema` (`create-pet.dto.ts:10-12`)
  y su `todayIsoDateUtc` local (`:64-66`) — el DTO conserva el patrón y
  `isRealCalendarDate` (formato) — y añadir a `mapPetError`
  (`pets.controller.ts:171-173`) la rama de `PetBirthDateInFutureError`,
  con `PetsController.create` envuelto en `try/catch → mapPetError` como ya
  lo está `update`.

  - Test: `test/pets.e2e-spec.ts`. `seedUser` (`:103-121`) gana `timezone =
    'UTC'`; se importan `localDayOf` y `shiftDay`. Describe nuevo `'R6
    (dto-dates-owner-timezone #89): birthDate se compara con el dia civil
    del requester en POST y del owner en PATCH'`, dos `it`, cada uno
    iterando el par con índice en el `label`:
    (1) `'POST acepta hoy y rechaza manana en la zona del requester para
    Pacific/Kiritimati y Pacific/Pago_Pago (R6)'`: `requester = await
    seedUser(\`r6-post-${index}\`, zona)`, `today` una vez;
    `createPetViaApi(requester, { birthDate: today })` (ya hace
    `.expect(201)` y `createdPetIds.push`) y
    `expect(body.birthDate).toBe(today)`; `POST /v1/pets` directo con `{
    name: \`Manana-${RUN_ID}\`, species: 'dog', birthDate: shiftDay(today,
    1) }` → `.expect(400)` y `toEqual` del body completo.
    (2) `'PATCH acepta hoy y rechaza manana en la zona del owner para
    Pacific/Kiritimati y Pacific/Pago_Pago (R6)'`: `owner = await
    seedUser(\`r6-patch-${index}\`, zona)`, `pet = await
    createPetViaApi(owner)` (`birthDate: '2024-01-15'`), `today` una vez;
    `PATCH /v1/pets/${pet.id}` con `{ birthDate: today }` → `200` y
    `body.birthDate === today`; con `{ birthDate: shiftDay(today, 1) }` →
    `400` y el mismo `toEqual`.
  - Tests heredados que cambian en el mismo commit rojo: se retira la fila
    `['birthDate posterior a hoy', { birthDate: isoDateDaysFromNow(1) }]`
    de `src/modules/pets/application/dto/create-pet.dto.spec.ts:56` y la
    fila `['birthDate futura', { birthDate: '2999-01-01' }]` de
    `src/modules/pets/application/dto/update-pet.dto.spec.ts:16`: aseveran
    la regla que R2/R4/R6 mueven al use case y quedarían rojas tras el
    verde. `isoDateDaysFromNow` (`create-pet.dto.spec.ts:3-7`) sigue en uso
    por `'acepta birthDate de hoy…'` (`:79-85`), que no cambia. Ninguna
    otra fila de esos `it.each` se toca.
  - Rojo esperado antes de implementar (árbol tras los verdes de R1-R5:
    zod aún compara `birthDate <= D` en UTC y `mapPetError` no conoce el
    error): tabla de #88 D8 — para `h >= 10` «hoy» de Kiritimati es `D+1 >
    D` y zod responde `400` ≠ `201`/`200`; para `h < 11` «mañana» de
    Pago_Pago es `D <= D`, pasa zod, el use case lanza
    `PetBirthDateInFutureError`, `mapPetError` lo devuelve crudo y Nest
    responde `500` ≠ `400`. Las dos franjas cubren las 24 h: los dos `it`
    son rojos **por aserción de status** a cualquier hora.

### Bloque G — regresión: barrido, contrato intacto, diff acotado, suite verde (verificación)

- **R7**: Requisito **de verificación** (CHECKPOINTS C4, vía (b) — solo
  asevera sobre lo que R1-R6 dejan). WHILE la feature está implementada,
  THE SYSTEM SHALL conservar:
  (a) `git diff --name-only 381d1e36...HEAD -- backend-pet-tracker/` lista
  **exactamente** los archivos de [[design]] §Archivos afectados (delta
  contra el commit base, no recuento absoluto) y `git diff --stat
  381d1e36...HEAD -- mobile-pet-tracker/` está vacío;
  (b) **barrido** (criterio 4): `grep -rn "todayIsoDateUtc" src test` vacío
  — `todayIsoDateUtc` se borra de `iso-date.ts:5-7` (sin consumidores tras
  R5; `IsoDateSchema` se queda) y de `create-pet.dto.ts:64-66`; `grep -rn
  "MEASURED_AT_MAX_FUTURE_DAYS\|maxMeasuredAtIsoDate" src test
  ../mobile-pet-tracker/src` vacío; `grep -rn "new
  Date().toISOString().slice(0, 10)" src` vacío (hoy: `iso-date.ts:6` y
  `create-pet.dto.ts:65`); `grep -rn "toISOString().slice(0, 10)" src`
  lista **únicamente** `src/pipeline/local-day.ts` (`isCalendarDate`,
  `startOfLocalDay`: aritmética sobre un día dado), `src/modules/health/application/dto/iso-date.ts`
  (`isIsoDate`: ida y vuelta del valor validado) y
  `src/modules/activity/infrastructure/repositories/daily-positions.dynamo.reader.ts`
  (clave de un `startMs` que llega por argumento) — ninguno aplica
  `new Date()` sin argumento: **no queda ningún comparador contra el hoy
  UTC del servidor**. Bajo `test/`, las apariciones restantes son helpers
  de fixtures para owners sembrados en `'UTC'` (`health-vaccines.e2e-spec.ts`
  `dateOffset`, `health-weights.e2e-spec.ts` `isoDateOffset`,
  `nutrition.e2e-spec.ts:83`, `create-pet.dto.spec.ts` `isoDateDaysFromNow`)
  y se dejan;
  (c) **sin duplicación**: los dos `grep` de R3;
  (d) sin cambios ni fallos en `owner-local-day.spec.ts`,
  `get-pet.use-case.spec.ts`, `vaccine-mutations.use-cases.spec.ts`,
  `alerts-engine-consumer.service.spec.ts`, `src/pipeline/local-day.spec.ts`,
  `test/health-vaccines.e2e-spec.ts`, `test/nutrition.e2e-spec.ts`,
  `test/backfill-weights.e2e-spec.ts`;
  (e) sin cambios en `vaccine.dto.ts`, `update-pet.dto.ts`,
  `health.module.ts`, `auth.module.ts`, `pet.repository.ts`,
  `user.repository.ts`, `vaccine-error.mapper.ts`;
  (f) en `test/health-weights.e2e-spec.ts` y `test/pets.e2e-spec.ts` los
  describes heredados quedan fuera de los hunks del diff salvo la firma de
  `seedUser`, los imports y el `it` de #15 R7 adaptado; los `measuredAt` /
  `birthDate` fijos (`'2026-01-15'`, `'2024-01-15'`, …) y los `today()` con
  owner `'UTC'` siguen `201`; `'2026-02-30'` sigue `400` por formato;
  (g) `pnpm -C backend-pet-tracker run test:e2e -- health-weights pets`, la
  suite e2e completa y `env -u FORCE_COLOR bash ./init.sh` verdes, sin el
  aviso «se saltan los e2e».

  - Test: sin test nuevo — los comandos de (a)-(g), la línea `Tests: N
    passed, N total` de la suite completa y la última línea de `init.sh`,
    en `progress/impl_dto-dates-owner-timezone.md` (sección `## Regresión
    (R7)`) y reproducidos por el reviewer en
    `progress/review_dto-dates-owner-timezone.md`. Si `init.sh` cae solo
    por el flake móvil #72 (`add-pet/index.test.tsx`), una segunda corrida
    limpia vale y se anota.

### Bloque H — candado por mutación en la zona ciega (verificación)

- **R8**: Requisito **de verificación** (C4 vía (b), declarado aquí antes
  del handoff; complementa los commits rojos reales de R1-R6, no los
  sustituye). Tres mutaciones **no versionadas**, aplicadas una a la vez
  sobre el árbol verde de R7, ejecutadas, capturadas y revertidas con `git
  checkout -- <archivo>`:
  - **M1 (el margen vuelve a pesos)**: en `create-weight.use-case.ts`
    comparar `dto.measuredAt > shiftDay(today, 1)` (import de `shiftDay`
    desde `@/pipeline/local-day`). IF se ejecuta `pnpm -C
    backend-pet-tracker test -- create-weight` THEN SHALL fallar por
    aserción **solo** R1(2) (`'2026-08-11' > '2026-08-11'` es falso: resuelve
    en vez de rechazar). IF se ejecuta `pnpm -C backend-pet-tracker run
    test:e2e -- health-weights` THEN el `it` de R5 SHALL fallar en
    Pago_Pago a cualquier hora (`expected 400, got 201`) y el heredado
    adaptado de #15 R7 SHALL fallar a cualquier hora (`isoDateOffset(1)` →
    `201`).
  - **M2 (create-pet vuelve a comparar contra UTC)**: en
    `create-pet.use-case.ts` sustituir `await requesterLocalDay(this.users,
    userId, now)` por `now.toISOString().slice(0, 10)`. Unitario `pnpm -C
    backend-pet-tracker test -- create-pet`: R2(1) rojo por `findById` con
    0 llamadas, R2(2) rojo (resuelve: `'2026-08-11' <= '2026-08-11'`), R2(3)
    rojo (rechaza: `'2026-08-11' > '2026-08-10'`). e2e `-- pets`: el `it`
    POST de R6 rojo para **al menos una** zona a cualquier hora (tabla de
    #88 D8: Kiritimati «hoy» → `400` para `h >= 10`; Pago_Pago «mañana» →
    `201` para `h < 11`); el `it` PATCH sigue verde (no usa el requester).
  - **M3 (la zona se ignora en la función compartida)**: en
    `owner-local-day.ts` hacer que `localDayInZone` devuelva
    `now.toISOString().slice(0, 10)` manteniendo el resto. Unitario `pnpm
    -C backend-pet-tracker test -- create-weight update-pet
    requester-local-day owner-local-day get-pet.use-case
    vaccine-mutations`: rojos por aserción R1(2)(3), R4(2)(3), R3(1)
    (`'2026-08-11'` ≠ `'2026-08-10'`), #88 R3(1) en
    `owner-local-day.spec.ts`, #82 R1 en `get-pet.use-case.spec.ts`
    (`Expected: "2026-08-09"`, `Received: "2026-08-10"`) y #88 R1(2)(3) /
    R2(2)(3) en `vaccine-mutations` — demuestra que la extracción de R3
    conservó los candados de #82 y #88. e2e `-- health-weights pets
    health-vaccines`: R5, los dos `it` de R6 y #88 R4 rojos para al menos
    una zona a cualquier hora.

  - Test: los bloques `Expected/Received` de jest de M1, M2 y M3 (unitario
    y e2e) en la sección `## Mutación (R8)` del reporte de implementación,
    con la hora UTC de cada corrida (`date -u`); el reviewer los reproduce
    y deja los suyos en `progress/review_dto-dates-owner-timezone.md`. Tras
    cada reversión, `git status --short` limpio y los archivos verdes otra
    vez.

## Decisiones cerradas (resumen; detalle en [[design]])

| # | Pregunta abierta del leader | Decisión |
|---|---|---|
| 1 | ¿Helper por requester o generalizar `ownerLocalDay`? | Las dos cosas sin duplicar: `localDayInZone(raw, now, context)` extraída en `owner-local-day.ts` (única copia de IANA + warn); `ownerLocalDay` y el nuevo `requesterLocalDay` (archivo hermano) son wrappers de tres líneas. D4. |
| 2 | ¿`measuredAt` pierde el margen `+1`? | Sí. Hoy en la zona del owner → `2xx` a cualquier hora; mañana → `400`. Coherente con #88 (`specs/vaccine-applied-at-owner-timezone/requirements.md` §Fuera de alcance «Margen de un día para dispositivos adelantados: no» y `design.md` D2). D2. |
| 3 | `birthDate` = hoy en la zona del requester | `201` a cualquier hora; mañana `400`. En PATCH, zona del owner de la mascota. D3, D7. |
| 4 | Barrido de `src` | R7-(b): estos dos eran los últimos; `todayIsoDateUtc` (las dos copias), `MEASURED_AT_MAX_FUTURE_DAYS` y `maxMeasuredAtIsoDate` se borran (C7). |
| 5 | e2e por caso con el par Kiritimati / Pago_Pago | R5 (pesos POST), R6 (mascotas POST y PATCH). D9. |
| 6 | ¿Qué manda el móvil? | Fecha civil del dispositivo (§Contexto, rutas y líneas). Nada depende del margen. D13. |
| 7 | Dispositivo por delante de la zona del owner | Sin margen (default de #88); alternativas registradas en §Fuera de alcance para el gate. D2. |

## Fuera de alcance

- **Margen explícito «hoy ± 1 en la zona del owner»** o **mensaje del 400
  que nombre la zona contra la que se validó** (alternativas propuestas por
  la sesión Frontend para el caso «dispositivo en una zona por delante de
  la del owner»: usuario viajando, mascota compartida). Decisión por
  defecto: **sin margen**, la misma que #88 tomó para `appliedAt`
  (`specs/vaccine-applied-at-owner-timezone/requirements.md` §Fuera de
  alcance y `design.md` D2): un margen volvería a admitir mediciones del
  futuro, que es el defecto que se corrige. Si el humano prefiere una de
  las dos alternativas, lo enmienda en el gate **antes** del handoff: la
  primera cambia R1(2)/R5 (mañana → `201`, pasado mañana → `400`) y debe
  decirse explícitamente para que no parezca el margen viejo colándose de
  vuelta; la segunda cambia el texto del `errors[0].message` en R5 y el
  del `WeightMeasuredInFutureError`, conservando la forma `errors[{ path,
  message }]` que el móvil ya mapea.
- **Deuda móvil declarada (sin id todavía)** que abre la decisión por
  defecto: (1) `mobile-pet-tracker/src/app/(tabs)/weight-log.tsx:39-44`
  (`localTodayIso`) manda la fecha civil del **dispositivo** contra una
  validación que habla de la zona del **owner**; un usuario en una zona
  por delante de la del owner puede recibir `400` al guardar «hoy» desde
  su punto de vista; el `400` ya se pinta como error de campo
  (`health-records.ts:132-140` → `weight-log.tsx` `formError`), pero el
  texto no explica la zona. Regresión funcional silenciosa, no rotura. (2)
  `mobile-pet-tracker/src/screens/add-pet/index.tsx:34-39` (`dateToIso`):
  aquí #89 es **mejora** — hoy a cualquier hora pasa a valer. El id de la
  feature móvil lo abrirá la sesión Frontend **solo si** el humano firma
  el gate de #89 con la decisión por defecto; si en el gate elige «hoy ± 1
  explícito», la deuda desaparece.
- **Texto del mensaje de pesos**: `'measuredAt is too far in the future'`
  se conserva byte a byte aunque sin margen «too far» suene holgado; el
  móvil no lo asevera (§Contexto) y cambiarlo es una decisión de copy que
  no toca este defecto. Si el humano quiere `'measuredAt cannot be in the
  future'` (paralelo a vacunas y mascotas), lo dice en el gate y R1/R5
  cambian el literal.
- **Cualquier archivo bajo `mobile-pet-tracker/`**: #78 trabaja en el otro
  worktree; R7-(a) exige diff vacío.
- **`?today=` / cabecera con el día del dispositivo**: exige mitad móvil y
  confiar en el reloj del cliente (descartado en #82 D3 y #88).
- **Validar IANA en el registro** (`register-user.dto.ts:24`): R3 lo
  absorbe con el fallback, igual que #88 R3.
- **Usar la zona del requester también en PATCH `/v1/pets/:petId`**: la
  mascota existe y su zona es la de su owner, como en #82/#88; el guard
  exige rol owner, así que en mascotas de un solo owner coinciden. D3.
- **`PATCH /v1/pets/:petId/vaccines`, vacunas en general**: cerrado en #88.
- **Un `weight-error.mapper.ts`**: un solo error a mapear; se reutiliza
  `validationError()` del propio `weights.controller.ts` (D5).
- **`weights.controller.spec.ts` / `pets.controller.spec.ts` para la forma
  del 400**: la fija el `toEqual` sobre el body completo en R5/R6.
- **Refactorizar `activity.drizzle.store.ts` para que use
  `localDayInZone`**: #82 D8 opción Z, id aparte si se quiere.
- **`nextDoseAt` / otras fechas**: no se valida hoy contra ningún día y no
  se añade.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-11) ← gate obligatorio antes de implementar
- [X] Requisitos de verificación R7 y R8 (evidencia por mutación **no
      versionada**, además de los commits rojos reales de R1-R6) aceptados
      por humano con esta misma firma
- [X] Decisiones D1-D13 de [[design]] ratificadas (o enmendadas por escrito
      antes de implementar); en particular D2 (sin margen) y D3/D7 (zona
      del requester en POST, del owner en PATCH)
