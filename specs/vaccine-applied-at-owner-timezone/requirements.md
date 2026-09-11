---
feature: "vaccine-applied-at-owner-timezone"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[vaccine-applied-at-owner-timezone]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #88 (`description` corregida por el leader el
> 2026-09-10 + los 4 `acceptance_criteria`), la deuda D5 de
> `specs/vaccine-due-today-inclusive/` (#82) y
> `progress/explore_vaccine-due-today-inclusive.md` §1.7-1.8. Todas las
> rutas son relativas a `backend-pet-tracker/` salvo que se indique lo
> contrario. Las líneas citadas son las del commit base `f3e3280`
> (`origin/main` tras #119/#82, `merge-base` de la branch
> `feature/88-vaccine-applied-at-owner-timezone`); si el archivo se movió,
> manda el símbolo, no el número. Cada hecho de §Contexto se verificó contra
> ese árbol, no contra el enunciado ni contra la exploración de #82.

## Contexto — el defecto exacto

`POST /v1/pets/:petId/vaccines` y `PATCH /v1/pets/:petId/vaccines/:vaccineId`
validan `appliedAt` contra el **día civil UTC del reloj del servidor**:

- `src/modules/health/application/dto/vaccine.dto.ts:12-15` (`CreateVaccineSchema`)
  y `:29-32` (`UpdateVaccineSchema`):
  `IsoDateSchema.refine((date) => date <= todayIsoDateUtc(), 'Applied date
  cannot be in the future')`; `todayIsoDateUtc` en
  `src/modules/health/application/dto/iso-date.ts:5-7` es
  `new Date().toISOString().slice(0, 10)`.
- Dirección real del sesgo (verificada con `Intl` en el Node v20.20.2 del
  VPS, 2026-09-10; el enunciado original de #88 la tenía invertida):
  - Owner en `Pacific/Kiritimati` (UTC+14) a las 10:00 locales del
    2026-08-11 = `2026-08-10T20:00Z`: `appliedAt = '2026-08-11'` (hoy local)
    `>` hoy UTC `'2026-08-10'` → **400 indebido** por una vacuna puesta esa
    misma mañana.
  - Owner en `America/Mexico_City` (UTC-6, sin horario de verano desde 2022)
    a las 20:00 locales del 2026-08-10 = `2026-08-11T02:00Z`:
    `appliedAt = '2026-08-11'` (mañana local) `<=` hoy UTC `'2026-08-11'` →
    **se acepta una vacuna del futuro**.
- Dónde corre zod y cómo sale el 400: `parseBody` en
  `src/modules/health/infrastructure/vaccines.controller.ts:63` (create) y
  `:91` (update) → `validationError` (`:131-142`) construye
  `BadRequestException({ statusCode: 400, message: 'Validation failed',
  errors: [{ path: 'appliedAt', message: 'Applied date cannot be in the
  future' }] })`. Los errores de dominio salen por `mapVaccineError`
  (`src/modules/health/infrastructure/mappers/vaccine-error.mapper.ts:12-35`)
  con la forma `{ statusCode, code, message }` (p. ej. `:20-26`,
  `VACCINE_SPECIES_MISMATCH`); lo que no reconoce lo devuelve crudo (`:34`),
  y Nest lo convierte en 500.
- Casos de uso: `CreateVaccineUseCase` (`src/modules/health/application/use-cases/create-vaccine.use-case.ts:17-22`)
  inyecta `VACCINE_REPOSITORY`, `PET_REPOSITORY` y `AUDIT_LOGGER`;
  `execute(petId, dto, userId)` (`:24-28`) no recibe reloj.
  `UpdateVaccineUseCase` (`update-vaccine.use-case.ts:14-17`) inyecta **solo**
  `VACCINE_REPOSITORY` y `AUDIT_LOGGER` — **corrección a la premisa del
  leader** («ya inyectan `PET_REPOSITORY`»: solo create lo hace);
  `execute(petId, id, dto, userId)` (`:19-24`). `HealthModule` ya importa
  `PetsModule` (`src/modules/health/health.module.ts:25`), que exporta
  `PET_REPOSITORY` (`src/modules/pets/pets.module.ts:39`): inyectarlo en
  update **no** exige tocar ningún módulo.
- Lo que #82 dejó hecho: `PetRepository.findOwnerTimezone(petId):
  Promise<string | null>` (`src/modules/pets/domain/repositories/pet.repository.ts:47-48`,
  implementación Drizzle en `pet.drizzle.repository.ts:114-128`), y la
  resolución «zona → `isSupportedTimeZone` → fallback `'UTC'` +
  `Logger.warn({ scope, petId, timezone, message })` → `localDayOf(now.getTime(),
  zona)`» **inline** en `src/modules/pets/application/use-cases/get-pet.use-case.ts:70-84`
  y `:90-93`. Con create y update serían tres copias: [[design]] D4 la
  extrae. `isSupportedTimeZone`, `localDayOf`, `shiftDay` e
  `InvalidTimeZoneError` viven en `src/pipeline/local-day.ts:53-55`, `:58-62`,
  `:99` y `:19-24`.
- Único unitario de los casos de uso:
  `src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts`
  (#14 R12, `:27-80`), que construye `new CreateVaccineUseCase(vaccines,
  pets, audit)` **posicionalmente** con `{} as PetRepository` (`:31-35`) y
  `new UpdateVaccineUseCase(vaccines, audit)` (`:50-56`). **No existen**
  `vaccines.controller.spec.ts` ni `vaccine-error.mapper.spec.ts`
  (`ls src/modules/health/infrastructure/`, `.../mappers/`).
- Dobles y llamadores (grep en `f3e3280`): `MockOf<PetRepository>` solo en
  `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts:109-118`,
  que **ya** tiene `findOwnerTimezone` (`:113`, A1 de #82); no hay
  `MockOf<VaccineRepository>` en `src` ni `test`. Esta feature **no añade
  métodos a ningún puerto**, así que ningún doble cambia. Llamadores de
  `CreateVaccineUseCase`/`UpdateVaccineUseCase`: `health.module.ts:7,11,35,37`
  (registro, no cambia), `vaccine-mutations.use-cases.spec.ts:4,6,31,50` y
  `vaccines.controller.ts:24,28,51,53`. `pets.controller.spec.ts` no los
  toca.
- Móvil (solo lectura): `mobile-pet-tracker/src/api/health-records.ts:45`
  solo hace `GET` de vacunas; el único `postJson` es el de pesos
  (`:121-126`); su parser de 400 lee `body.errors[]` como `FieldError[]`
  (`:131-138`). `grep -rn "Applied date cannot be in the future"
  mobile-pet-tracker/src` está vacío: ningún cliente depende hoy del
  mensaje, pero sí de la **forma** `errors[]` para los 400 de validación.
  [[design]] D5 conserva esa forma byte a byte.
- e2e: `test/health-vaccines.e2e-spec.ts` ya importa `localDayOf` y
  `shiftDay` (`:16`) y tiene `seedUser(label, timezone = 'UTC')` (`:37-56`),
  `seedPet` (`:58-67`) y `postVaccine` (`:79-84`). El `it` de #14 R8 manda
  `appliedAt: '2999-01-01'` (`:313`) y solo asevera `.expect(400)` (`:317`),
  sin forma de body. Los `appliedAt` fijos de #14 (`'2026-01-01'`,
  `'2024-02-29'`, `'2025-01-01'`) son todos pasados en cualquier zona.

## Requisitos funcionales

### Bloque A — create compara `appliedAt` con el día civil del owner (unitario)

- **R1**: WHEN `CreateVaccineUseCase.execute(petId, dto, userId, now)` corre,
  THE SYSTEM SHALL calcular `today = await ownerLocalDay(this.pets, petId,
  now)` (helper de [[design]] D4) como **primera** operación de `execute`
  (antes de la consulta de catálogo, de `findById`, del `create` y del
  audit — misma precedencia que hoy tiene el `refine` de zod), y IF
  `dto.appliedAt > today` (comparación de cadenas `YYYY-MM-DD`) THEN THE
  SYSTEM SHALL lanzar `VaccineAppliedInFutureError`
  (`src/modules/health/domain/errors/vaccine.errors.ts`, mensaje exacto
  `'Applied date cannot be in the future'`) sin llamar a `vaccines.create`
  ni a `audit.record`; WHILE `dto.appliedAt <= today` THE SYSTEM SHALL
  continuar exactamente como en `f3e3280`. `now` SHALL llegar del caller:
  `execute(petId: string, dto: CreateVaccineDto, userId: string, now: Date)`;
  `VaccinesController.create` (`vaccines.controller.ts:59-75`) SHALL
  construir **un solo** `new Date()` por request y pasarlo como cuarto
  argumento ([[design]] D1).

  - Test: `src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts`,
    describe nuevo `'R1 (vaccine-applied-at-owner-timezone #88): create
    compara appliedAt con el dia civil del owner, no con el dia UTC'`.
    Fixture: `pets = { findOwnerTimezone: jest.fn().mockResolvedValue(zona),
    findById: jest.fn() } as unknown as PetRepository`, `vaccines = { create:
    jest.fn().mockResolvedValue(vaccine()) } as unknown as
    VaccineRepository`, `audit = { record: jest.fn() }`; body sin catálogo
    (`name: 'Manual'`, así `findById` no entra). Constantes a nivel de
    módulo: `NOW_CDMX_EVENING = new Date('2026-08-11T02:00:00.000Z')`
    (día UTC `2026-08-11`; `America/Mexico_City` = 2026-08-10 20:00) y
    `NOW_KIRITIMATI_MORNING = new Date('2026-08-10T20:00:00.000Z')` (día UTC
    `2026-08-10`; `Pacific/Kiritimati` = 2026-08-11 10:00). Tres `it`:
    (1) `'acepta hoy local aunque UTC ya sea manana (America/Mexico_City,
    20:00)'`: zona `'America/Mexico_City'`, `now = NOW_CDMX_EVENING`,
    `appliedAt: '2026-08-10'` → resuelve con el `vaccine()` del mock,
    `findOwnerTimezone` llamado con `PET_ID`, `create` llamado con
    `expect.objectContaining({ appliedAt: '2026-08-10' })`;
    (2) `'rechaza manana local aunque UTC ya sea ese dia
    (America/Mexico_City, 20:00)'`: misma zona y `now`, `appliedAt:
    '2026-08-11'` → `rejects.toThrow('Applied date cannot be in the
    future')` y `rejects.toMatchObject({ name: 'VaccineAppliedInFutureError'
    })` sobre la misma promesa; `create` y `record` **no** llamados. Hoy el
    DTO acepta este valor: este `it` es el que demuestra el cambio de lado.
    (3) `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati,
    10:00)'`: zona `'Pacific/Kiritimati'`, `now = NOW_KIRITIMATI_MORNING`,
    `appliedAt: '2026-08-11'` → resuelve, `findOwnerTimezone` llamado con
    `PET_ID`, `create` llamado con `objectContaining({ appliedAt:
    '2026-08-11' })`. Hoy el DTO lo rechaza; el use case viejo lo acepta sin
    mirar la zona.
    No se importa la clase del error en el test (se asevera por `message` y
    `name`), para que el rojo sea **por aserción** y no por un export
    inexistente. Rojo esperado antes de implementar: (1) y (3) por
    `findOwnerTimezone` con 0 llamadas; (2) por promesa resuelta en vez de
    rechazada. `tsconfig.json:7` tiene `isolatedModules: true` y en #82
    ts-jest no convirtió la aridad nueva en diagnóstico (reds por aserción
    en `progress/impl_vaccine-due-today-inclusive.md:18-19`); si aun así
    apareciera un diagnóstico de tipos, es sobre la **firma de producción
    que R1 crea** (CHECKPOINTS C4, cuarto punto), y se anota tal cual.
  - Test heredado que cambia en el mismo commit rojo: `it('create no audita
    si el INSERT falla')` (#14 R12, `:28-45`): el mock `pets` pasa de `{}
    as PetRepository` a `{ findOwnerTimezone: jest.fn().mockResolvedValue('UTC')
    } as unknown as PetRepository` y `execute` gana `NOW_CDMX_EVENING` como
    cuarto argumento (`appliedAt: '2025-01-01'` sigue siendo pasado en
    cualquier zona). Nombre y aserciones intactos. Sin este cambio, tras el
    verde de R1 ese `it` rechazaría por `TypeError` (`findOwnerTimezone is
    not a function`) antes de llegar al `create`.

### Bloque B — update compara `appliedAt` con el día civil del owner solo si el body lo trae (unitario)

- **R2**: WHEN `UpdateVaccineUseCase.execute(petId, id, dto, userId, now)`
  corre y `dto.appliedAt !== undefined`, THE SYSTEM SHALL aplicar la misma
  regla que R1 (`ownerLocalDay` → `dto.appliedAt > today` lanza
  `VaccineAppliedInFutureError`; `<=` continúa) como **primera** operación
  de `execute`, antes del test de UUID y de `findByIdAndPet` (`:25-27`) —
  misma precedencia que hoy: el 400 de zod sale antes que el 404. WHILE
  `dto.appliedAt === undefined` (incluido el body vacío), THE SYSTEM SHALL
  NOT llamar a `findOwnerTimezone` y SHALL comportarse exactamente como en
  `f3e3280`. Para ello `UpdateVaccineUseCase` SHALL inyectar
  `@Inject(PET_REPOSITORY) private readonly pets: PetRepository` como
  **segundo** parámetro del constructor (mismo orden que create:
  `(vaccines, pets, audit)`), y `VaccinesController.update`
  (`vaccines.controller.ts:86-104`) SHALL construir **un solo** `new Date()`
  y pasarlo como quinto argumento ([[design]] D3).

  - Test: mismo spec, describe nuevo `'R2 (vaccine-applied-at-owner-timezone
    #88): update compara appliedAt con el dia civil del owner solo cuando el
    body lo trae'`. Fixture: `vaccines = { findByIdAndPet:
    jest.fn().mockResolvedValue(vaccine()), update:
    jest.fn().mockResolvedValue(vaccine()) } as unknown as
    VaccineRepository`, `pets = { findOwnerTimezone:
    jest.fn().mockResolvedValue(zona) } as unknown as PetRepository`, `audit
    = { record: jest.fn() }`; `new UpdateVaccineUseCase(vaccines, pets,
    audit)`. Cuatro `it`:
    (1) `'acepta hoy local aunque UTC ya sea manana (America/Mexico_City,
    20:00)'`: `execute(PET_ID, VACCINE_ID, { appliedAt: '2026-08-10' },
    USER_ID, NOW_CDMX_EVENING)` → resuelve; `update` llamado con
    `(VACCINE_ID, { appliedAt: '2026-08-10' })`; `findOwnerTimezone` con
    `PET_ID`;
    (2) `'rechaza manana local aunque UTC ya sea ese dia
    (America/Mexico_City, 20:00)'`: `{ appliedAt: '2026-08-11' }` →
    `rejects.toThrow('Applied date cannot be in the future')` +
    `rejects.toMatchObject({ name: 'VaccineAppliedInFutureError' })`;
    `update` y `record` **no** llamados;
    (3) `'acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati,
    10:00)'`: zona `'Pacific/Kiritimati'`, `NOW_KIRITIMATI_MORNING`, `{
    appliedAt: '2026-08-11' }` → resuelve, `update` llamado con ese body;
    (4) `'sin appliedAt en el body no consulta la zona del owner'`: `{ name:
    'Nueva' }` → resuelve, `findOwnerTimezone` **no** llamado, `update`
    llamado con `(VACCINE_ID, { name: 'Nueva' })`.
    Rojo esperado antes de implementar: el constructor viejo tiene dos
    parámetros, así que `audit` recibe el mock de `pets`; en (1), (3) y (4)
    `update` corre y después `this.audit.record` no es función →
    `TypeError` → promesa rechazada; en (2) `update` corre (aserción «no
    llamado» roja) y el rechazo es un `TypeError`, no el mensaje esperado.
    Cuatro rojos por aserción sobre comportamiento de producción ausente.
  - Test heredado que cambia en el mismo commit rojo: `it('update no audita
    si el UPDATE falla')` (#14 R12, `:47-62`): el constructor gana `{} as
    PetRepository` como segundo argumento y `execute` gana
    `NOW_CDMX_EVENING` (body `{ name: 'Nueva' }`, sin `appliedAt`: la zona no
    se consulta, así que `{}` basta). Nombre y aserciones intactos.

### Bloque C — el helper `ownerLocalDay` degrada a UTC con un warn y `GetPetUseCase` lo reutiliza (unitario)

- **R3**: `ownerLocalDay(pets: PetRepository, petId: string, now: Date):
  Promise<string>` (archivo nuevo
  `src/modules/pets/application/owner-local-day.ts`, [[design]] D4) SHALL
  llamar a `pets.findOwnerTimezone(petId)` y, WHEN la zona devuelta está en
  el catálogo de `isSupportedTimeZone` (`local-day.ts:53`), SHALL devolver
  `localDayOf(now.getTime(), zona)` sin emitir ningún `warn`. IF
  `findOwnerTimezone` devuelve `null` o una cadena que `isSupportedTimeZone`
  rechaza, THEN THE SYSTEM SHALL devolver `localDayOf(now.getTime(), 'UTC')`
  y emitir **una** vez `Logger.warn` con un objeto que incluya `petId` y
  `timezone` (el valor crudo: `null` o la cadena), y nunca dejar escapar
  `InvalidTimeZoneError` — semántica idéntica a #82 R2. Además,
  `GetPetUseCase.execute` (`get-pet.use-case.ts:70-84`, `:90-93`) SHALL
  obtener su día con este helper, de modo que
  `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts` (R1 y R2
  de #82, `:179-270`, más R8/R9/R12/R6/R7) siga verde **sin editarse**: es
  el candado de regresión del refactor.

  - Test: `src/modules/pets/application/owner-local-day.spec.ts` (nuevo;
    precedente de helper + spec directamente bajo `application/`:
    `src/modules/health/application/vaccine-date.ts` y su `.spec.ts`).
    Describe `'R3 (vaccine-applied-at-owner-timezone #88): ownerLocalDay
    resuelve el dia civil del owner y degrada a UTC con un warn'`, `warnSpy
    = jest.spyOn(Logger.prototype, 'warn').mockImplementation()` en
    `beforeEach` y `mockRestore` en `afterEach` (precedente
    `get-pet.use-case.spec.ts:208-216`), `NOW = new
    Date('2026-08-11T02:00:00.000Z')`, `pets = { findOwnerTimezone:
    jest.fn().mockResolvedValue(valor) } as unknown as PetRepository`. Tres
    `it`:
    (1) `'con zona IANA valida devuelve el dia local de now sin avisar'`:
    `'America/Mexico_City'` → `'2026-08-10'`, `findOwnerTimezone` llamado
    con `PET_ID`, `warnSpy` no llamado;
    (2) `'sin owner activo (null) devuelve el dia UTC de now y avisa una
    vez'`: `null` → `'2026-08-11'`, `warnSpy` 1 vez con
    `expect.objectContaining({ petId: PET_ID, timezone: null })`;
    (3) `"con 'Not/A/Zone' devuelve el dia UTC de now y avisa una vez"`:
    `'Not/A/Zone'` → `'2026-08-11'`, `warnSpy` 1 vez con
    `objectContaining({ petId: PET_ID, timezone: 'Not/A/Zone' })`.
    Rojo esperado antes de implementar (tras los verdes de R1 y R2, cuyo
    helper mínimo hace `localDayOf(now.getTime(), zona ?? 'UTC')` sin
    validar IANA ni avisar): (1) ya verde (se anota, no es un rojo); (2)
    rojo por conteo del `warn` (0 ≠ 1); (3) rojo por `InvalidTimeZoneError`
    escapando de `localDayOf`. Los dos son rojos legítimos de
    comportamiento ausente.
  - Test de regresión del refactor (sin editar): `pnpm -C
    backend-pet-tracker test -- get-pet.use-case` verde tras el commit de
    refactor de [[design]] D10 (n.º 7), con `git diff f3e3280...HEAD --
    backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.spec.ts`
    vacío.

### Bloque D — frontera e2e: hoy y mañana en la zona del owner, POST y PATCH

- **R4**: WHEN un owner activo cuyo `users.timezone` es una zona IANA hace
  `POST /v1/pets/:petId/vaccines` con `appliedAt` igual al día civil de
  **esa zona** en el instante de la petición, THE SYSTEM SHALL responder
  `201` a cualquier hora del día (incluidas las horas en que UTC todavía es
  ayer o ya es mañana), con `body.appliedAt` igual al valor enviado. WHEN
  `appliedAt` es el día siguiente en esa zona, THE SYSTEM SHALL responder
  `400` con body **exactamente** `{ statusCode: 400, message: 'Validation
  failed', errors: [{ path: 'appliedAt', message: 'Applied date cannot be in
  the future' }] }` — la misma forma que hoy produce zod ([[design]] D5).
  WHEN la misma pareja de valores llega por `PATCH
  /v1/pets/:petId/vaccines/:vaccineId` sobre una vacuna existente, THE SYSTEM
  SHALL responder `200` (hoy) y `400` con el mismo body (mañana). Esto
  exige quitar el `refine` de `vaccine.dto.ts:12-15` y `:29-32`
  (`appliedAt: IsoDateSchema` / `IsoDateSchema.optional()`, criterio 4) y
  mapear `VaccineAppliedInFutureError` en `mapVaccineError`.

  - Test: `test/health-vaccines.e2e-spec.ts`, describe nuevo `'R4
    (vaccine-applied-at-owner-timezone #88): appliedAt se compara con el dia
    civil del owner en POST y PATCH'`, dos `it`, cada uno iterando el par
    `['Pacific/Kiritimati', 'Pacific/Pago_Pago']` (índice en el `label`):
    (1) `'POST acepta hoy y rechaza manana en la zona del owner para
    Pacific/Kiritimati y Pacific/Pago_Pago (R4)'`: `owner = await
    seedUser(\`r4-post-${index}\`, zona)`, `pet = await seedPet(owner)`,
    `today = localDayOf(Date.now(), zona)` calculado **una sola vez** antes
    de las dos peticiones; `postVaccine(owner, pet.id, { name: 'Hoy',
    appliedAt: today }).expect(201)` y `expect(body.appliedAt).toBe(today)`;
    `postVaccine(owner, pet.id, { name: 'Manana', appliedAt: shiftDay(today,
    1) }).expect(400)` y `expect(body).toEqual({ statusCode: 400, message:
    'Validation failed', errors: [{ path: 'appliedAt', message: 'Applied
    date cannot be in the future' }] })`.
    (2) `'PATCH acepta hoy y rechaza manana en la zona del owner para
    Pacific/Kiritimati y Pacific/Pago_Pago (R4)'`: por zona, `owner`,
    `pet`, `created = postVaccine(owner, pet.id, { name: 'Inicial',
    appliedAt: '2025-01-01' }).expect(201)`, `today` una vez; `PATCH
    /v1/pets/${pet.id}/vaccines/${id}` con `{ appliedAt: today }` → `200` y
    `body.appliedAt === today`; con `{ appliedAt: shiftDay(today, 1) }` →
    `400` y el mismo `toEqual`.
    Rojo esperado antes de implementar (árbol tras los verdes de R1-R3: zod
    aún compara en UTC y el mapper no conoce el error): con `D` = día UTC y
    `h` = hora UTC de la corrida, Kiritimati vive en `D+1` para `h >= 10` y
    Pago_Pago en `D-1` para `h < 11` ([[design]] D8). Para `h >= 10`, «hoy»
    de Kiritimati es `D+1 > D` y zod responde `400` ≠ `201`; para `h < 11`,
    «mañana» de Pago_Pago es `D <= D`, pasa zod, el use case lanza
    `VaccineAppliedInFutureError`, `mapVaccineError` lo devuelve crudo y
    Nest responde `500` ≠ `400`. Las dos franjas cubren las 24 h, así que
    los dos `it` son rojos **por aserción de status** a cualquier hora.
    Determinismo: mismo argumento que #82 D10 — test y servidor corren en
    el mismo proceso Node (`Test.createTestingModule`, `:86-96`) y calculan
    `localDayOf` sobre la misma zona; la única ventana de fallo es que la
    medianoche de esa zona caiga entre el cálculo de `today` y el `new
    Date()` del controller (milisegundos). Por qué el **par** y no una
    zona: bajo una implementación en UTC (la de hoy, o la mutación M1 de
    R6), «hoy» de Kiritimati falla solo para `h >= 10` y «mañana» de
    Pago_Pago solo para `h < 11`; juntas fallan a cualquier hora, una sola
    zona no.

### Bloque E — regresión: contrato intacto, diff acotado, suite verde (verificación)

- **R5**: Requisito **de verificación** (CHECKPOINTS C4, vía (b) — solo
  asevera sobre lo que R1-R4 dejan). WHILE la feature está implementada,
  THE SYSTEM SHALL conservar: (a) `git diff --name-only f3e3280...HEAD --
  backend-pet-tracker/` lista **exactamente** los once archivos de
  [[design]] §Archivos afectados (delta contra el commit base, no recuento
  absoluto) y `git diff --stat f3e3280...HEAD -- mobile-pet-tracker/` está
  vacío; (b) sin cambios ni fallos en `get-pet.use-case.spec.ts`,
  `pets.controller.spec.ts`, `alerts-engine-consumer.service.spec.ts`,
  `src/pipeline/local-day.spec.ts`, `test/pets.e2e-spec.ts`,
  `test/health-weights.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts`
  (hace `GET` de vacunas en `:245`); (c) sin cambios en `iso-date.ts`
  (`todayIsoDateUtc` sigue exportado para `weight.dto.ts:2,30`),
  `weight.dto.ts`, `create-pet.dto.ts`, `health.module.ts`,
  `pet.repository.ts`, `pets.controller.ts`; (d) `grep -n "todayIsoDateUtc"
  src/modules/health/application/dto/vaccine.dto.ts` vacío (criterio 4: el
  DTO deja de comparar fechas; `IsoDateSchema` sigue validando formato);
  (e) en `test/health-vaccines.e2e-spec.ts` los describes de #14 (R2-R13) y
  de #82 (R3-R5) quedan fuera de los hunks del diff y siguen verdes: los
  `appliedAt` fijos `'2026-01-01'`, `'2024-02-29'` y `'2025-01-01'` se
  aceptan, y `'2999-01-01'` (`:313`) sigue respondiendo `400`, ahora por
  use case + mapper en vez de por zod; (f) `pnpm -C backend-pet-tracker run
  test:e2e -- health-vaccines`, la suite e2e completa y `env -u
  FORCE_COLOR bash ./init.sh` verdes, sin el aviso «se saltan los e2e».

  - Test: sin test nuevo — los comandos de (a)-(f), la línea `Tests: N
    passed, N total` de la suite completa y la última línea de `init.sh`,
    en `progress/impl_vaccine-applied-at-owner-timezone.md` (sección `##
    Regresión (R5)`) y reproducidos por el reviewer en
    `progress/review_vaccine-applied-at-owner-timezone.md`. Si `init.sh`
    cae solo por el flake móvil #72 (`add-pet/index.test.tsx`), una segunda
    corrida limpia vale y se anota.

### Bloque F — candado por mutación en la zona ciega (verificación)

- **R6**: Requisito **de verificación** (C4 vía (b), declarado aquí antes
  del handoff; complementa los commits rojos reales de R1-R4, no los
  sustituye). Dos mutaciones **no versionadas**, aplicadas una a la vez
  sobre el árbol verde de R5, ejecutadas, capturadas y revertidas con `git
  checkout -- <archivo>`:
  - **M1 (zona, en el helper)**: en `owner-local-day.ts` devolver
    `now.toISOString().slice(0, 10)` (día UTC) ignorando la zona, manteniendo
    la llamada a `findOwnerTimezone`. IF se ejecuta `pnpm -C
    backend-pet-tracker test -- vaccine-mutations owner-local-day
    get-pet.use-case` THEN SHALL fallar por aserción: R1(2) y R2(2)
    (resuelven: `'2026-08-11' <= '2026-08-11'`), R1(3) y R2(3) (rechazan:
    `'2026-08-11' > '2026-08-10'`), R3(1) (`'2026-08-11'` ≠ `'2026-08-10'`)
    y el R1 de #82 en `get-pet.use-case.spec.ts` (espera `'2026-08-09'`,
    recibe `'2026-08-10'`) — este último demuestra que el refactor de R3
    conservó el candado de #82. IF se ejecuta `pnpm -C backend-pet-tracker
    run test:e2e -- health-vaccines` THEN los dos `it` de R4 SHALL fallar
    por aserción para **al menos una** zona a cualquier hora (tabla de
    [[design]] D8: «hoy» de Kiritimati → `400` para `h >= 10`; «mañana» de
    Pago_Pago → `201`/`200` para `h < 11`).
  - **M2 (operador, en los dos use cases)**: cambiar la comparación `>` por
    `>=` (hoy pasa a rechazarse) en `create-vaccine.use-case.ts` y
    `update-vaccine.use-case.ts`. IF se ejecuta el unitario THEN R1(1),
    R1(3), R2(1) y R2(3) SHALL fallar por rechazo inesperado; IF se ejecuta
    el e2e THEN las aserciones «hoy → 201/200» de R4 SHALL fallar en las
    **dos** zonas a cualquier hora, mientras las de «mañana → 400» siguen
    verdes.

  - Test: los bloques `Expected/Received` de jest de M1 y M2 (unitario y
    e2e) en la sección `## Mutación (R6)` del reporte de implementación,
    con la hora UTC de cada corrida (`date -u`); el reviewer los reproduce
    y deja los suyos en `progress/review_vaccine-applied-at-owner-timezone.md`.
    Tras cada reversión, `git status --short` limpio y los archivos verdes
    otra vez.

## Fuera de alcance

- **`measuredAt <= hoy UTC + 1`** en `src/modules/health/application/dto/weight.dto.ts:10-13`
  y `:29-33` (`maxMeasuredAtIsoDate`, `MEASURED_AT_MAX_FUTURE_DAYS = 1`,
  `:6`): mismo sesgo, otro recurso y con su propio margen ya decidido.
  **Decisión del leader** (2026-09-10): queda fuera; se abre como id nuevo
  al cerrar. `ownerLocalDay` (R3) deja el camino hecho — la mascota existe,
  así que la zona del owner se resuelve igual.
- **`birthDate <= hoy UTC`** en `src/modules/pets/application/dto/create-pet.dto.ts:10-12`
  con su copia local de `todayIsoDateUtc` (`:64-66`): misma decisión del
  leader. Nota para ese id: en `POST /v1/pets` la mascota aún no existe, así
  que el «owner» es el **requester** (`USER_REPOSITORY.findById`, zona en
  `User.timezone`), no `findOwnerTimezone(petId)`; `ownerLocalDay` no
  aplica tal cual.
- **`iso-date.ts`**: `feature_list.json` #88 lo lista en `files_affected`,
  pero **no cambia** — `todayIsoDateUtc` sigue en uso en `weight.dto.ts:2,30`.
  El leader corrige la entrada al cerrar.
- **Margen de un día para dispositivos adelantados** (pregunta abierta del
  enunciado): no. Criterio 2 exige `400` para mañana local; el caso
  «dispositivo por delante del servidor» es exactamente el que resuelve la
  zona del owner, y un margen volvería a admitir vacunas del futuro.
  [[design]] D2.
- **Cualquier archivo bajo `mobile-pet-tracker/`**: la app no crea ni edita
  vacunas (`health-records.ts:45,121-126`); #87 trabaja en otro worktree.
- **`?today=` / cabecera con el día del dispositivo**: exige mitad móvil y
  confiar en el reloj del cliente (descartado ya en #82 D3).
- **Validar IANA en el registro** (`register-user.dto.ts:24`): R3 lo
  absorbe con el fallback.
- **Refactorizar `activity.drizzle.store.ts:217-254`** para que use
  `ownerLocalDay`: tocaría el store de #10 y sus tests sin cambiar
  comportamiento (#82 D8, opción Z). Si se quiere, id aparte.
- **`vaccines.controller.spec.ts` / `vaccine-error.mapper.spec.ts`**: no
  existen y no se crean; la forma del 400 la fija el e2e de R4 con
  `toEqual` sobre el body completo.
- **Validar `nextDoseAt`** contra ningún día: hoy no se valida y no se
  añade.
- **Cambiar la forma de los 400 de dominio** (`code: ...`) para
  `appliedAt`: [[design]] D5 conserva la forma de zod byte a byte.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-10) ← gate obligatorio antes de implementar
- [X] Requisitos de verificación R5 y R6 (evidencia por mutación **no
      versionada**, además de los commits rojos reales de R1-R4) aceptados
      por humano con esta misma firma
- [X] Decisiones D1-D9 de [[design]] ratificadas (o enmendadas por escrito
      antes de implementar)
