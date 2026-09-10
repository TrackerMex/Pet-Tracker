---
feature: "vaccine-due-today-inclusive"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[vaccine-due-today-inclusive]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #82 (`description` + los 3 `acceptance_criteria`)
> y `progress/explore_vaccine-due-today-inclusive.md` (2026-09-10). Todas las
> rutas de esta spec son relativas a `backend-pet-tracker/` salvo que se
> indique lo contrario. Las líneas citadas son las del commit base `7f298f2`
> (`origin/main` tras #118, 2026-09-10; `merge-base` de la branch
> `feature/82-vaccine-due-today-inclusive`); si el archivo se movió, manda
> el símbolo, no el número. Cada hecho de §Contexto se verificó contra ese
> árbol, no contra la exploración.

## Contexto — el defecto exacto

`GET /v1/pets/:petId` rellena `nextVaccine` así:

- `src/modules/pets/application/use-cases/get-pet.use-case.ts:71-74`:
  `this.vaccineReader.findNextVaccine(petId, new Date().toISOString().slice(0, 10))`
  — el "hoy" es el **día civil UTC del reloj del servidor**, creado dentro
  del use case (`execute(petId)`, línea 52, no recibe `now`).
- `src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts:27`:
  `gt(petVaccines.nextDoseAt, after)` — **estrictamente posterior**; el
  parámetro se llama `after` (`:17`; puerto en
  `src/modules/pets/domain/ports/pet-vaccine-reader.ts:10`).
- `next_dose_at` es `date` de Postgres (`src/db/schema/health.schema.ts:49`):
  un día civil `YYYY-MM-DD`, sin hora ni zona. La única pregunta es "qué día
  es hoy", no "qué día es la dosis".

La pestaña Salud del móvil decide la próxima vacuna en cliente con
`nextDoseAt >= today` y `today` local del dispositivo
(`mobile-pet-tracker/src/app/(tabs)/health.tsx:69-79`, `localTodayIso`
`:28-33`). La Home toma `pet.nextVaccine` del perfil
(`mobile-pet-tracker/src/screens/home/index.tsx:194-198`). Resultado: el día
de la dosis, Salud la enseña y la Home no; y en zonas de offset negativo la
Home la pierde varias horas antes de que acabe el día local.

Ya existe en el backend el patrón "hoy en la zona del owner" (#10):
`users.timezone` (`src/db/schema/users.schema.ts:21`, `varchar(64) NOT NULL
DEFAULT 'UTC'`), `localDayOf(tsMs, timeZone)` e `isSupportedTimeZone(tz)`
(`src/pipeline/local-day.ts:58-62` y `:53-55`), y la resolución
owner-con-fallback-a-UTC de
`src/modules/activity/infrastructure/repositories/activity.drizzle.store.ts:217-254`
(`findOwnerTimezone` + `resolveTimeZone`, `logger.warn` si la zona es nula o
no IANA). El registro **no** valida la zona contra IANA
(`src/modules/auth/application/dto/register-user.dto.ts:24`); el PATCH de
perfil sí (`src/modules/users/application/dto/update-profile.dto.ts:8-11`).

Contrato del perfil: la forma de `nextVaccine` es `{id, name, nextDoseAt}`
(#14 R13, `specs/health-vaccines/requirements.md:93-97`; e2e
`test/health-vaccines.e2e-spec.ts:549-553`) y la lista de claves del perfil
la cierra `PROFILE_KEYS` en `test/pets.e2e-spec.ts:63-88`. **Nada de eso
cambia de forma** en esta feature.

## Requisitos funcionales

### Bloque A — el caso de uso resuelve "hoy" en la zona del owner (unitario)

- **R1**: WHEN `GetPetUseCase.execute(petId, now)` corre para una mascota
  cuyo owner activo tiene `users.timezone` dentro del catálogo IANA, THE
  SYSTEM SHALL (a) obtener esa zona con `PetRepository.findOwnerTimezone(petId)`
  (método nuevo del puerto `src/modules/pets/domain/repositories/pet.repository.ts`,
  firma `findOwnerTimezone(petId: string): Promise<string | null>`: la
  columna cruda del **primer** miembro `owner` con `status = 'active'` por
  `created_at asc`, o `null` si no lo hay), (b) calcular el día civil con
  `localDayOf(now.getTime(), zona)` de `src/pipeline/local-day.ts:58`, y (c)
  pasar ese día como segundo argumento a `PetVaccineReader.findNextVaccine`.
  `now` SHALL llegar del caller: `execute(petId: string, now: Date)`; el
  controller `detail` (`src/modules/pets/infrastructure/pets.controller.ts:82-105`)
  SHALL construir **un solo** `new Date()` y usarlo tanto para `execute` como
  para `toPetProfileResponse` (hoy hay dos relojes: `get-pet.use-case.ts:73`
  y `pets.controller.ts:97`). Ver [[design]] D8 y D9.

  - Test: `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts`,
    **reescritura** (no borrado) del describe `R13 (health-vaccines #14): el
    perfil consulta la proxima vacuna futura` (líneas 173-199 en `7f298f2`)
    como `describe('R1 (vaccine-due-today-inclusive #82, sustituye a R13 de
    #14): el perfil consulta la proxima vacuna desde el dia civil del owner')`
    con `it('pasa a findNextVaccine el dia local del owner calculado desde
    now, no el dia UTC')`: `findOwnerTimezone` resuelve
    `'America/Mexico_City'`, `now = new Date('2026-08-10T03:00:00.000Z')`
    (= 2026-08-09 21:00 en esa zona, UTC-6 sin horario de verano desde 2022;
    verificado con `Intl` en el Node del VPS) → `findOwnerTimezone` llamado
    con `PET_ID`, `findNextVaccine` llamado con `(PET_ID, '2026-08-09')` (no
    `'2026-08-10'`), y `profile.nextVaccine` igual al objeto que devuelve el
    mock. Sin `jest.useFakeTimers` (el reloj ya es un argumento). Rojo
    esperado antes de implementar: **por aserción** — el `execute` viejo
    ignora `now` y llama a `findNextVaccine` con el día UTC real del VPS, y
    nunca llama a `findOwnerTimezone`. `tsconfig.json:7` tiene
    `isolatedModules: true`, así que ts-jest no convierte la aridad nueva en
    error de compilación; si aun así el runner reportara un diagnóstico de
    tipos antes de la aserción, es un rojo sobre la **firma de producción
    que R1 crea**, no sobre un helper de test (CHECKPOINTS C4 cuarto punto),
    y Codex lo anota tal cual en el reporte.
  - Test: `src/modules/pets/infrastructure/pets.controller.spec.ts:204`
    (#5 R8) pasa de `toHaveBeenCalledWith(PET_ID)` a
    `toHaveBeenCalledWith(PET_ID, expect.any(Date))` — se edita en el mismo
    commit rojo de R1 y queda rojo hasta que el controller pase `now`.

### Bloque B — zona ausente o inválida degrada a UTC (unitario)

- **R2**: IF `findOwnerTimezone(petId)` devuelve `null` (sin owner activo) o
  una cadena que `isSupportedTimeZone` (`src/pipeline/local-day.ts:53`)
  rechaza, THEN THE SYSTEM SHALL usar `'UTC'` como zona, emitir **una** vez
  `Logger.warn` con un objeto que incluya `petId` y `timezone` (mismo patrón
  que `activity.drizzle.store.ts:246-251`), y terminar `execute` con
  normalidad (nunca `InvalidTimeZoneError`, nunca 5xx). WHILE la zona es
  válida, THE SYSTEM SHALL NOT emitir ese `warn`.

  - Test: mismo archivo, `describe('R2 (vaccine-due-today-inclusive #82): zona
    del owner nula o fuera del catalogo IANA degrada a UTC con warn')`, tres
    `it` con el mismo `now = new Date('2026-08-10T03:00:00.000Z')` (día UTC
    `2026-08-10`, distinto del día CDMX de R1 para que el fallback no se
    confunda con la zona válida) y `warnSpy = jest.spyOn(Logger.prototype,
    'warn').mockImplementation()` (precedente
    `src/workers/poller.service.spec.ts:481`), restaurado en `afterEach`:
    (1) `'sin owner activo (null) usa el dia UTC de now y avisa una vez'` →
    `findNextVaccine` con `(PET_ID, '2026-08-10')`, `warnSpy` llamado 1 vez,
    el `warn` recibe un objeto con `petId: PET_ID` y `timezone: null`;
    (2) `"con 'Not/A/Zone' usa el dia UTC de now y avisa una vez"` → idem con
    `timezone: 'Not/A/Zone'`;
    (3) `'con zona valida no avisa'` → `'America/Mexico_City'`, `warnSpy` no
    llamado. Rojo esperado antes de implementar (tras el verde de R1): (1) y
    (2) rojos por el conteo del `warn` o por `InvalidTimeZoneError` escapando
    de `execute` (`local-day.ts:184-188`), según lo mínimo que R1 haya dejado
    para el nulo; los dos son rojos legítimos de comportamiento ausente, no
    `ReferenceError` de helper.

### Bloque C — frontera e2e: hoy, ayer, mañana en la zona del owner

- **R3**: WHEN un owner activo cuyo `users.timezone` es una zona IANA pide
  `GET /v1/pets/:petId` y la mascota tiene tres dosis con `next_dose_at` =
  ayer, hoy y mañana **del día civil de esa zona**, THE SYSTEM SHALL responder
  `200` con `nextVaccine` igual a la dosis de **hoy** (`{id, name,
  nextDoseAt}` exactos: la menor `next_dose_at >= hoy_owner`), es decir, la
  de ayer queda excluida y la de mañana no se antepone. Esto exige que el
  lector filtre con `gte` (`pet-vaccine.drizzle-reader.ts:27`, import `:2`)
  y que el parámetro del puerto se llame `from` (inclusivo) en
  `pet-vaccine-reader.ts:10` y `pet-vaccine.drizzle-reader.ts:17` — [[design]]
  D1 y D7.

  - Test: `test/health-vaccines.e2e-spec.ts`, describe nuevo
    `'R3 (vaccine-due-today-inclusive #82): la dosis de hoy en la zona del
    owner es la proxima'`, `it('devuelve la dosis de hoy para owners en
    Pacific/Kiritimati y Pacific/Pago_Pago (R3)')`. Por cada zona del par
    `['Pacific/Kiritimati', 'Pacific/Pago_Pago']`: `owner = seedUser(label,
    zona)` (el helper `seedUser` de `:36-52` gana un segundo parámetro
    `timezone = 'UTC'`, precedente `test/activity.e2e-spec.ts:114-132`; los
    llamadores existentes no cambian), `pet = seedPet(owner)`, `today =
    localDayOf(Date.now(), zona)` calculado **una sola vez antes de sembrar**
    (`localDayOf` y `shiftDay` importados de `'@/pipeline/local-day'`;
    `test/jest-e2e.json` ya mapea `@/`), tres filas en `petVaccines` vía
    `db.insert` (como `:520-545`; `appliedAt: '2025-01-01'` fijo) con
    `nextDoseAt` = `shiftDay(today, -1)` `'Ayer'`, `today` `'Hoy'` (id
    guardado) y `shiftDay(today, 1)` `'Manana'`; `GET` con el token del
    owner → `expect(body.nextVaccine).toEqual({ id: hoyId, name: 'Hoy',
    nextDoseAt: today })`. Rojo esperado antes de implementar: por aserción,
    `Received` con `name: 'Manana'` en las dos zonas (el `gt` excluye hoy a
    cualquier hora). Determinismo respecto a la hora del VPS: [[design]] D10
    — el test y el servidor corren en el **mismo proceso** Node
    (`Test.createTestingModule`, `:82-92`) y calculan `localDayOf` sobre la
    misma zona; la única ventana de fallo es que la medianoche de esa zona
    caiga entre el cálculo de `today` y el `new Date()` del controller
    (milisegundos; el mismo riesgo que ya acepta #14 R13 con `dateOffset`).
    El **par** de zonas hace además que el `it` sea rojo a cualquier hora si
    la implementación usara el día UTC (tabla en D10): se usa por eso y no
    por elegancia.

- **R4**: WHEN un miembro `family` activo cuyo `users.timezone` difiere de la
  del owner pide `GET /v1/pets/:petId`, THE SYSTEM SHALL calcular "hoy" con
  la zona del **owner**, devolviendo el mismo `nextVaccine` que ve el owner.
  Es estructural: `execute(petId, now)` no recibe al requester
  ([[design]] D2), y este test lo fija.

  - Test: mismo describe, `it('un family en otra zona ve el nextVaccine del
    dia del owner (R4)')`: owner A en `'Pacific/Kiritimati'`, usuario B en
    `'Pacific/Pago_Pago'` insertado en `petUsers` con `role: 'family',
    status: 'active'` (como `:200-205`), tres dosis de A sembradas como en
    R3 con `todayA = localDayOf(Date.now(), 'Pacific/Kiritimati')`; `GET`
    con el token de **B** → `nextVaccine.nextDoseAt === todayA` y `name ===
    'Hoy'`. Las dos zonas distan 25 h, así que nunca comparten día civil:
    una implementación por requester sería roja a cualquier hora (D10).
    Rojo esperado antes de implementar: por aserción (`'Manana'`, por el
    `gt`).

- **R5**: WHEN el owner activo tiene un `users.timezone` fuera del catálogo
  IANA (el registro no lo valida, `register-user.dto.ts:24`), THE SYSTEM
  SHALL responder `200` y calcular "hoy" en UTC (R2 aplicado de punta a
  punta), sin 5xx.

  - Test: mismo describe, `it('owner con timezone fuera del catalogo IANA
    responde 200 con el hoy UTC (R5)')`: `seedUser('r5-tz', 'Not/A/Zone')`
    (el `db.insert` salta el DTO; `varchar(64)` lo admite), tres dosis con
    `dateOffset(-1)`, `dateOffset(0)`, `dateOffset(1)` (helper existente
    `:33-34`, día UTC) → `200` y `nextVaccine.nextDoseAt === dateOffset(0)`.
    Determinista a cualquier hora del VPS (misma ventana de medianoche UTC
    que #14 R13). Rojo esperado antes de implementar: por aserción
    (`'Manana'`).

### Bloque D — regresión: el contrato no cambia de forma (verificación)

- **R6**: Requisito **de verificación** (CHECKPOINTS C4, vía (b) — solo
  asevera sobre lo que R1-R5 dejan). WHILE la feature está implementada, THE
  SYSTEM SHALL conservar: (a) la forma de `nextVaccine` — exactamente las
  claves `id`, `name`, `nextDoseAt` (lo asevera el `toEqual` de R3 y el
  `it` de #14 R13 en `test/health-vaccines.e2e-spec.ts:510-556`, que **no se
  edita** y sigue verde porque siembra `dateOffset(-1|1|2)`, sin día 0); (b)
  la lista de claves del perfil — `test/pets.e2e-spec.ts` **no se edita**;
  (c) `ListPetsUseCase` intacto — el candado de fuente
  `src/modules/pets/application/use-cases/list-pets.use-case.spec.ts:200`
  sigue verde sin tocarlo; (d) `git diff --name-only 7f298f2...HEAD --
  backend-pet-tracker/` SHALL listar **exactamente** los nueve archivos de
  [[design]] §Archivos afectados (delta contra el commit base, no recuento
  absoluto); (e) `pnpm -C backend-pet-tracker run test:e2e -- health-vaccines`
  y la suite e2e completa verdes, y `env -u FORCE_COLOR bash ./init.sh`
  verde sin el aviso «se saltan los e2e».

  - Test: sin test nuevo — los comandos de (d) y (e), la línea `Tests: N
    passed, N total` de la suite completa y la última línea de `init.sh`, en
    `progress/impl_vaccine-due-today-inclusive.md` (sección `## Regresión
    (R6)`) y reproducidos por el reviewer en
    `progress/review_vaccine-due-today-inclusive.md`.

### Bloque E — candado por mutación en la zona ciega (verificación)

- **R7**: Requisito **de verificación** (C4 vía (b), declarado aquí antes del
  handoff; complementa los commits rojos reales de R1-R5, no los sustituye).
  Dos mutaciones **no versionadas**, aplicadas una a la vez sobre el árbol
  verde de R6, ejecutadas, capturadas y revertidas con `git checkout --
  <archivo>`:
  - **M1 (operador)**: en `pet-vaccine.drizzle-reader.ts` sustituir `gte(`
    por `gt(` (ajustando el import). IF se ejecuta `pnpm -C
    backend-pet-tracker run test:e2e -- health-vaccines` THEN el `it` de R3
    SHALL fallar **por su aserción** `toEqual` con `Received` `name:
    'Manana'` en las dos zonas (y R4, R5 también rojos).
  - **M2 (zona, donde el unitario no mira)**: en
    `src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts`
    hacer que `findOwnerTimezone` devuelva `null` sin consultar (la app
    degrada a UTC con warn y sigue respondiendo 200: ningún unitario lo ve
    porque todos mockean el repositorio, y `pnpm -C backend-pet-tracker test`
    SHALL seguir verde). IF se ejecuta el e2e THEN el `it` de R3 SHALL fallar
    por aserción para **al menos una** de las dos zonas a cualquier hora del
    VPS (tabla de [[design]] D10: `Received` `'Ayer'` para la zona que va
    por delante de UTC o `'Manana'` para la que va por detrás), mientras R5
    permanece verde (es el comportamiento esperado del fallback).

  - Test: los dos bloques `Expected/Received` de jest (M1 y M2) más la línea
    `Tests:` del unitario bajo M2, en la sección `## Mutación (R7)` del
    reporte de implementación; el reviewer los reproduce y deja los suyos en
    `progress/review_vaccine-due-today-inclusive.md`. Tras cada reversión,
    `git status --short` limpio y el archivo verde otra vez.

## Fuera de alcance

- **`appliedAt <= hoy UTC`** en `src/modules/health/application/dto/vaccine.dto.ts:12-15`
  y `:29-32` (`todayIsoDateUtc`, `src/modules/health/application/dto/iso-date.ts:5-7`):
  es el mismo sesgo UTC en el mismo módulo — una vacuna aplicada "hoy" a las
  20:00 en UTC-6 ya es "mañana" en UTC y responde 400 «Applied date cannot be
  in the future». **Queda como deuda registrada aquí** (D5); no se abre id
  desde la spec, lo decide el leader al cerrar. Los e2e de esta feature
  siembran `petVaccines` por `db.insert` con `appliedAt` fijo, así que no lo
  pisan.
- **Cualquier archivo bajo `mobile-pet-tracker/`** (D3): #87 está
  reescribiendo Home y Salud en otro worktree. La Home ya pinta "hoy" y
  "vencida" (`src/screens/home/index.tsx:110-122`); ver [[design]] D6.
- **`?today=` / cabecera con el día del dispositivo** (opción b de la
  exploración): exige mitad móvil y confiar en el reloj del cliente. D3.
- **Margen `hoy UTC - 1`** (opción d): rompe AC1 en zonas positivas. D3.
- **UTC a secas con `gte`** (opción a): no cumple AC2. D3.
- **`ListPetsUseCase` / `GET /v1/pets`**: sigue devolviendo `nextVaccine:
  null` (#66; candado `list-pets.use-case.spec.ts:200`).
- **Refactorizar `activity.drizzle.store.ts:217-254`** para compartir
  `findOwnerTimezone`/`resolveTimeZone`: tocaría el store de #10 y sus tests
  sin cambiar comportamiento; la pieza compartible de verdad
  (`isSupportedTimeZone`, `localDayOf`) ya vive en `src/pipeline/local-day.ts`
  y se reutiliza. [[design]] D8.
- **Validar IANA en el registro** (`register-user.dto.ts:24`): R2/R5 lo
  absorben con el fallback; feature aparte si se quiere cerrar.
- **`nextReminder`** del perfil (sigue `null` literal) y **#84**
  (`reminder-dates.ts`).
- **Seeds de LocalStack**: `scripts/seed-vaccines.ts` solo siembra el
  catálogo; nada cambia de resultado.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] Requisitos de verificación R6 y R7 (evidencia por mutación **no
      versionada**, además de los commits rojos reales de R1-R5) aceptados
      por humano con esta misma firma
- [ ] Decisiones D1-D9 de [[design]] ratificadas (o enmendadas por escrito
      antes de implementar)
