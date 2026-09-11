---
feature: "dto-dates-owner-timezone"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Diseño — [[dto-dates-owner-timezone]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
> Rutas relativas a `backend-pet-tracker/`; líneas del commit base
> `381d1e36`. D1-D7 y D13 cierran por escrito las decisiones que el leader
> y la sesión Frontend dejaron abiertas al abrir #89 (2026-09-11); D8-D12
> las tomó el spec_author. El humano las ratifica o cambia en el gate.
> Patrón de referencia: `specs/vaccine-applied-at-owner-timezone/design.md`
> (#88), cuyo reviewer aprobó sin observaciones.

## Capas tocadas

| Capa | Archivo | Qué cambia |
|---|---|---|
| domain (health) | `src/modules/health/domain/errors/weight.errors.ts` | **nuevo**: `WeightMeasuredInFutureError` (D10) |
| domain (pets) | `src/modules/pets/domain/errors/pet.errors.ts` | clase nueva `PetBirthDateInFutureError` (D10) |
| application (pets) | `src/modules/pets/application/owner-local-day.ts` | extrae y exporta `localDayInZone(raw, now, context)`; `ownerLocalDay` delega (D4) |
| application (pets) | `src/modules/pets/application/requester-local-day.ts` | **nuevo**: `requesterLocalDay(users, userId, now)` (D4) |
| application (health) | `src/modules/health/application/use-cases/create-weight.use-case.ts` | inyecta `PET_REPOSITORY` (segundo parámetro); `execute(petId, dto, userId, now)`; regla `measuredAt > ownerLocalDay` → error, primera operación (D1, D2, D6) |
| application (pets) | `src/modules/pets/application/use-cases/create-pet.use-case.ts` | inyecta `USER_REPOSITORY` (segundo parámetro); `execute(dto, userId, now)`; regla `birthDate > requesterLocalDay` solo si `birthDate` viene (D3, D6) |
| application (pets) | `src/modules/pets/application/use-cases/update-pet.use-case.ts` | `execute(petId, userId, dto, now)`; regla `birthDate > ownerLocalDay` solo si `birthDate` viene (D3, D6, D7) |
| application (health) | `src/modules/health/application/dto/weight.dto.ts` | `measuredAt: IsoDateSchema`; fuera `MEASURED_AT_MAX_FUTURE_DAYS`, `maxMeasuredAtIsoDate` y el import de `todayIsoDateUtc` (D1, D2) |
| application (health) | `src/modules/health/application/dto/iso-date.ts` | fuera `todayIsoDateUtc` (sin consumidores; C7) |
| application (pets) | `src/modules/pets/application/dto/create-pet.dto.ts` | fuera el tercer `refine` de `BirthDateSchema` y la copia local de `todayIsoDateUtc`; doc-comment `:5` (D1) |
| infrastructure (health) | `src/modules/health/infrastructure/weights.controller.ts` | `create` iza `const now = new Date()`, lo pasa, y mapea `WeightMeasuredInFutureError` con `validationError()` (D1, D5) |
| infrastructure (pets) | `src/modules/pets/infrastructure/pets.controller.ts` | `create` y `update` izan `now`; `create` gana `try/catch → mapPetError`; `mapPetError` gana la rama de `PetBirthDateInFutureError` (D1, D5) |
| module (pets) | `src/modules/pets/pets.module.ts` | `imports` gana `AuthModule` (D8) |
| tests | `create-weight.use-case.spec.ts`, `create-pet.use-case.spec.ts`, `requester-local-day.spec.ts` (nuevo), `update-pet.use-case.spec.ts`, `pets.controller.spec.ts`, `create-pet.dto.spec.ts`, `update-pet.dto.spec.ts`, `test/health-weights.e2e-spec.ts`, `test/pets.e2e-spec.ts` | R1, R2, R3, R4, heredados, R5, R6 |

Sin migración, sin dependencia nueva, sin módulo Nest nuevo, sin cambio en
`health.module.ts` (ya importa `PetsModule`, `:25`, que exporta
`PET_REPOSITORY`) ni en `auth.module.ts` (ya exporta `USER_REPOSITORY`,
`:104`), sin método nuevo en ningún puerto (por eso ningún doble
`MockOf<...>` cambia: D11).

## Decisiones técnicas

### D1 — La comparación sale de los dos DTOs y vive en los tres use cases, con `now` del controller (R1, R2, R4, R5, R6)

Criterio 3 del enunciado. Misma justificación que #88 D1, que el humano ya
ratificó: el schema de zod es una constante de módulo sin acceso a
repositorios ni al request; «hoy» depende de una zona que solo se conoce
con `petId` (`findOwnerTimezone`) o con `userId` (`findById`). El use
case ya es la capa que decide el día en el repo y ya lanza errores de
dominio que el borde HTTP mapea a 400 (`docs/conventions.md` §Manejo de
errores). `IsoDateSchema` y el par patrón + `isRealCalendarDate` de
`BirthDateSchema` siguen validando **formato**: los DTOs dejan de comparar
fechas y nada más. Reloj inyectado (#82 D9, #88 D1): cada `execute` recibe
`now: Date` como último parámetro y el controller crea **un solo** `new
Date()` por request; sin `Date.now()` dentro del use case; sin `now`
opcional con default.

### D2 — Sin margen: `<= día civil del owner` acepta, `>` lanza; `MEASURED_AT_MAX_FUTURE_DAYS` desaparece (R1, R5)

- El `+1` de `specs/health-weights/` (D5 de esa spec) fue una decisión
  para tapar el síntoma cuando el servidor solo conocía el día UTC. Con la
  zona del owner resuelta, el caso «dispositivo por delante del servidor»
  (Kiritimati a las 10:00) es exactamente hoy local, y el margen solo
  sirve para aceptar mañana local (y pasado mañana) en cualquier zona.
- **Coherencia con #88**: `specs/vaccine-applied-at-owner-timezone/requirements.md`
  §Fuera de alcance («Margen de un día para dispositivos adelantados: no»)
  y `design.md` D2. #89 replica esa decisión para no tener dos reglas de
  «futuro» en el mismo módulo `health`.
- **Caso «dispositivo en una zona por delante de la del owner»** (usuario
  viajando; mascota compartida cuyo requester no es el primer owner
  activo): con la decisión por defecto recibe `400` al guardar «hoy» desde
  su punto de vista; el móvil ya lo muestra como error de campo. Queda en
  [[requirements]] §Fuera de alcance con las dos alternativas de la sesión
  Frontend (hoy ± 1 explícito en la zona del owner; o mensaje que nombre la
  zona) para que el humano lo cambie en el gate. Si adopta el margen, R1(2)
  y R5 cambian de sentido y debe quedar escrito que es un margen **nuevo y
  explícito en la zona del owner**, no el `+1` UTC viejo.
- Comparación de cadenas `YYYY-MM-DD` (orden lexicográfico = cronológico;
  es lo que hacían los dos `refine`).
- `MEASURED_AT_MAX_FUTURE_DAYS` y `maxMeasuredAtIsoDate` se borran de
  `weight.dto.ts` (C7): su único consumidor fuera del DTO era el import del
  e2e (`health-weights.e2e-spec.ts:15`), que R5 retira; el móvil no lo usa
  (grep vacío).

### D3 — Zona de quién: owner de la mascota en pesos y en PATCH de mascota; requester en POST de mascota (R1, R2, R4)

| Endpoint | La mascota existe | Zona | Helper | Inyección nueva |
|---|---|---|---|---|
| `POST /v1/pets/:petId/weights` | sí | primer owner activo (`users.timezone` vía `findOwnerTimezone`) | `ownerLocalDay(this.pets, petId, now)` | `PET_REPOSITORY` en `CreateWeightUseCase` |
| `POST /v1/pets` | **no** (`createWithOwner` la crea con el requester como owner) | requester (`User.timezone` vía `USER_REPOSITORY.findById(userId)`) | `requesterLocalDay(this.users, userId, now)` | `USER_REPOSITORY` en `CreatePetUseCase` + `AuthModule` en `PetsModule` |
| `PATCH /v1/pets/:petId` | sí | primer owner activo | `ownerLocalDay(this.pets, petId, now)` | ninguna (ya inyecta `PET_REPOSITORY`) |

Las tres filas son la **misma regla**: la fecha de una mascota se juzga en
la zona de su owner. En el POST el owner todavía no está en `pet_users`,
así que se lee de `users` con el id del requester, que es quien va a ser
owner al terminar `createWithOwner`. En el PATCH la mascota existe y el
guard exige rol owner (`pets.controller.ts:112`): en mascotas de un solo
owner coincide con el requester; con varios owners manda el primero activo
por `created_at`, igual que #82 (`nextVaccine`) y #88 (`appliedAt`).
Descartado usar el requester en PATCH: obligaría a inyectar
`USER_REPOSITORY` en `UpdatePetUseCase`, cambiaría siete construcciones de
su spec y crearía una segunda «zona de la mascota» distinta de la de
vacunas.

### D4 — `localDayInZone` compartida + dos wrappers; sin duplicar IANA + warn (R2, R3)

`ownerLocalDay` (`owner-local-day.ts:7-25`) hoy contiene dos cosas:
obtener la zona cruda (`findOwnerTimezone`) y resolverla (`isSupportedTimeZone`
→ `'UTC'` + `warn` → `localDayOf`). Con un requester hace falta la segunda
mitad con otra fuente. Se separa:

```
// src/modules/pets/application/owner-local-day.ts
export function localDayInZone(
  raw: string | null, now: Date, context: Record<string, unknown>,
): string
// -> timezone = raw !== null && isSupportedTimeZone(raw) ? raw : 'UTC';
//    si timezone !== raw: logger.warn({ ...context, timezone: raw, message });
//    return localDayOf(now.getTime(), timezone);

export async function ownerLocalDay(pets, petId, now): Promise<string>
// -> localDayInZone(await pets.findOwnerTimezone(petId), now,
//                   { scope: 'owner-local-day', petId })

// src/modules/pets/application/requester-local-day.ts (nuevo)
export async function requesterLocalDay(
  users: UserRepository, userId: string, now: Date,
): Promise<string>
// -> const user = await users.findById(userId);
//    return localDayInZone(user?.timezone ?? null, now,
//                          { scope: 'requester-local-day', userId });
```

- El objeto del `warn` de `ownerLocalDay` conserva `scope`, `petId`,
  `timezone` y `message` (#88 R3 y #82 R2 aseveran `objectContaining({
  petId, timezone })`): el candado sigue verde sin editarse. El `Logger`
  de módulo (`new Logger('ownerLocalDay')`, `:5`) no cambia de nombre: el
  `scope` del objeto identifica al llamador y renombrarlo sería diff sin
  valor.
- **Dos archivos, no uno**: `requesterLocalDay` en un hermano de ocho
  líneas (mismo directorio, misma capa; import relativo `./owner-local-day`
  permitido por `docs/conventions.md` §Imports) en vez de exportarlo desde
  un archivo llamado `owner-local-day.ts`. Descartado renombrar el archivo
  a algo neutro: tocaría cuatro importadores (#82/#88) sin cambiar
  comportamiento.
- **Por qué en `pets/application/`**: su único consumidor es
  `CreatePetUseCase` (misma capa, mismo módulo); el tipo `UserRepository`
  llega de `@/modules/auth/domain/repositories/user.repository`, y
  `application` de un módulo importando `domain` de otro ya tiene
  precedente (`create-vaccine.use-case.ts:15-16` importa el puerto de
  `pets`). Descartado `src/pipeline/`: depende de `Logger` de Nest y de un
  puerto, y `local-day.ts` es «cero imports» por diseño (#10 D3).
- **Orden de aparición** (mismo que #88 D4): `requesterLocalDay` nace
  mínimo en el verde de R2 (`localDayOf(now.getTime(), user?.timezone ??
  'UTC')`, sin IANA ni `warn`) para que el rojo de R3 sea real; la
  extracción de `localDayInZone` es el verde de R3, con los tres specs de
  #82/#88 como candado.
- Descartado un `localDayFor(fetchZone: () => Promise<string | null>, …)`
  de orden superior: los dos wrappers de tres líneas se leen solos y se
  testean sin closures.

### D5 — Forma del 400: byte a byte la de zod, con el helper que cada controller ya tiene (R5, R6)

- **Pesos**: `WeightsController.create` envuelve la llamada en `try/catch`
  y en el `catch` hace `if (error instanceof WeightMeasuredInFutureError)
  throw validationError([{ path: ['measuredAt'], message: error.message
  }]); throw error;`. `validationError` (`weights.controller.ts:74-85`) es
  **la misma función** que produce el 400 de zod: la igualdad byte a byte
  sale por construcción (`path.join('.')` de `['measuredAt']` =
  `'measuredAt'`). Descartado un `weight-error.mapper.ts` nuevo: un solo
  error, y el precedente inline ya existe en `mapPetError`.
- **Mascotas**: `mapPetError` (`pets.controller.ts:171-173`) gana la rama
  `if (error instanceof PetBirthDateInFutureError) return new
  BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message:
  'Validation failed', errors: [{ path: 'birthDate', message: error.message
  }] });` (misma forma que `parseBody`, `:184-191`; `HttpStatus` y
  `BadRequestException` ya importados, `:2,8`). `create` gana el
  `try/catch → mapPetError` que `update` ya tiene (`:122-129`).
- Textos: `'measuredAt is too far in the future'` (`weight.dto.ts:12`) y
  `'birthDate cannot be in the future'` (`create-pet.dto.ts:11`), sin
  cambiar una letra (criterios 1 y 2 hablan de status; el contrato hacia
  el móvil es la forma `errors[{ path, message }]`, `health-records.ts:132-140`).
  El texto de pesos queda registrado como decisión de copy abierta en
  [[requirements]] §Fuera de alcance.

### D6 — Precedencia: primera operación del `execute`, guardada por presencia del campo (R1, R2, R4)

Igual que #88 D2: la comprobación va antes de cualquier lookup o escritura
(en pesos, antes de `weights.create`; en mascotas, antes de `createWithOwner`
/ del no-op de body vacío / de `pets.update`), porque hoy zod corre antes
que todo. En mascotas se guarda con `dto.birthDate !== undefined`: un alta
por `approxAgeMonths` o un PATCH de `name` no debe depender de `users`. En
pesos `measuredAt` es obligatorio: sin guarda. Coste: una consulta de zona
por request con fecha; despreciable.

### D7 — `PATCH /v1/pets/:petId` entra en alcance (R4, R6) — premisa corregida

El enunciado de #89 solo nombra `create-pet.dto.ts:10-12`, pero
`BirthDateSchema` se comparte con `UpdatePetSchema` vía
`PetFieldsSchema.partial()` (`update-pet.dto.ts:10`). Quitar el `refine`
(criterio 3) sin mover la regla al `UpdatePetUseCase` dejaría el PATCH sin
validación de futuro: `update-pet.dto.spec.ts:16` lo asevera hoy y se
retira en R6 porque la regla cambia de capa, no porque desaparezca. El
leader corrige `files_affected` de #89 al cerrar (faltan `update-pet.use-case.ts`,
`pets.controller.ts`, `pets.module.ts`, los helpers, los errores y los
specs; §Archivos afectados es la lista cerrada).

### D8 — `PetsModule` importa `AuthModule` para `USER_REPOSITORY` (R2)

`AuthModule` exporta `USER_REPOSITORY` (`auth.module.ts:104`) y solo
importa `ConfigModule` (`:37`); ningún archivo de `src/modules/auth/`
importa de `modules/pets` (grep vacío en `381d1e36`): el grafo sigue
acíclico. Precedente exacto: `UsersModule` (`users.module.ts:24`) lo
importa por la misma razón. `APP_GUARD` de `AuthModule` se registra una
sola vez aunque el módulo se importe desde dos sitios (Nest instancia cada
módulo una vez; `UsersModule` + `AppModule` ya lo demuestran). Ningún spec
compila `PetsModule` ni `HealthModule` con `Test.createTestingModule`
(grep vacío): solo los e2e, que usan `AppModule`. Descartado un
`UserTimezoneReadModule` al estilo `PetVaccineReadModule`: existe para
romper ciclos, y aquí no hay ciclo.

### D9 — Determinismo del e2e y por qué el par de zonas delata a cualquier hora (R5, R6, R8)

Mismo argumento que #82 D10 / #88 D8: `localDayOf` se evalúa en el test y
en el servidor en el mismo proceso sobre la misma zona; `today` se calcula
una vez antes de las peticiones. Con `D` = día UTC y `h` = hora UTC
(Node v20.20.2 del VPS, 2026-09-11; las dos zonas sin horario de verano):

| `h` | día en Kiritimati (UTC+14) | día en Pago_Pago (UTC-11) |
|---|---|---|
| 00-09 | `D` | `D-1` |
| 10 | `D+1` | `D-1` |
| 11-23 | `D+1` | `D` |

**Mascotas (R6, zod UTC sin margen; y M2/M3)**: «hoy» de Kiritimati es
`D+1 > D` → `400` para `h >= 10`; «mañana» de Pago_Pago es `D <= D` →
pasa para `h < 11`. Cada franja tiene al menos una celda que delata. Una
sola zona dejaría horas ciegas (Kiritimati 00-09; Pago_Pago 11-23).

**Pesos (R5, zod UTC con `+1`)**: bajo el árbol previo al verde de R5,
«mañana» de Pago_Pago (`D` o `D+1`) siempre pasa el `<= D+1` de zod y llega
al use case, que lanza y nadie mapea → `500` ≠ `400` a **cualquier hora**;
«mañana» de Kiritimati delata para `h < 10` (`D+1` → `500`) y para `h >=
10` zod responde el `400` correcto. El heredado de #15 R7 adaptado (owner
UTC, `isoDateOffset(1)` = `D+1`) también es rojo a cualquier hora. Bajo
**M1** (margen en el use case, mapper presente): Pago_Pago «mañana» →
`201` a cualquier hora; Kiritimati «mañana» → `201` solo para `h < 10`.
Bajo **M3** (zona ignorada, sin margen): tabla de mascotas. El par cubre
todos los casos.

No se usan fake timers en el servidor ni `TZ` en el runner.

### D10 — Errores de dominio sin argumentos, mensaje único (R1, R2, R4, R5, R6)

```
// src/modules/health/domain/errors/weight.errors.ts (nuevo)
export class WeightMeasuredInFutureError extends Error {
  constructor() {
    super('measuredAt is too far in the future');
    this.name = 'WeightMeasuredInFutureError';
  }
}
// src/modules/pets/domain/errors/pet.errors.ts (añadir)
export class PetBirthDateInFutureError extends Error {
  constructor() {
    super('birthDate cannot be in the future');
    this.name = 'PetBirthDateInFutureError';
  }
}
```

Mismo patrón que `VaccineAppliedInFutureError` (#88 D9); sin imports de
`@nestjs/common`; el mapper usa `error.message`, así que cada texto vive en
un solo sitio. Archivo nuevo para pesos porque `health/domain/errors/` solo
tiene `vaccine.errors.ts` y un error de peso ahí sería un nombre mentiroso.

### D11 — Inventario completo y dobles que cambian de firma (R7)

Grep en `381d1e36`:

- `grep -rn "MockOf<" src test`: `MockOf<PetRepository>` solo en
  `alerts-engine-consumer.service.spec.ts` (ya con `findOwnerTimezone`);
  no hay `MockOf<UserRepository>` ni `MockOf<WeightRepository>`. Ningún
  puerto gana métodos: **ningún doble exhaustivo cambia**. El helper
  `repository(overrides)` de `create-weight.use-case.spec.ts:19-26`
  construye un `WeightRepository` completo; tampoco cambia.
- `CreateWeightUseCase`: `health.module.ts` (registro, no cambia),
  `create-weight.use-case.spec.ts:31,51` (construcción posicional → R1),
  `weights.controller.ts:42-46` (llamada → R1).
- `CreatePetUseCase`: `pets.module.ts` (registro, no cambia),
  `create-pet.use-case.spec.ts:63,82,100` (construcción → R2),
  `pets.controller.ts:63` (llamada → R2), `pets.controller.spec.ts:43,89-92`
  (mock de `execute`; la aserción `toHaveBeenCalledWith(dto, USER.id)` gana
  `expect.any(Date)` → R2).
- `UpdatePetUseCase.execute`: `update-pet.use-case.spec.ts` (siete
  llamadas → R4), `pets.controller.ts:124` (→ R4),
  `pets.controller.spec.ts:291-293` (`toHaveBeenCalledWith(PET_ID, USER.id,
  { name: 'Firu' })` gana `expect.any(Date)` → R4).
- Specs que aseveran el `refine` UTC: `create-pet.dto.spec.ts:56` y
  `update-pet.dto.spec.ts:16` (una fila cada uno → se retiran en R6).
- Tests de #14/#82/#88 que no se tocan: `vaccine-mutations.use-cases.spec.ts`,
  `owner-local-day.spec.ts`, `get-pet.use-case.spec.ts`,
  `test/health-vaccines.e2e-spec.ts`.

### D12 — Plan de commits (CHECKPOINTS C4)

Trece commits en `feature/89-dto-dates-owner-timezone`, rojo → verde por
bloque, con el R-id en el mensaje (`docs/conventions.md` §Commits):

1. `test(dto-dates-owner-timezone): create weight compares measuredAt with the owner local day without margin (R1)` — rojo por aserción (describe R1 + los dos `it` de #15 R10 adaptados).
2. `feat(dto-dates-owner-timezone): validate measuredAt against the owner local day on create (R1)` — verde: `WeightMeasuredInFutureError`, `PET_REPOSITORY` en `CreateWeightUseCase`, `execute(..., now)`, `now` en `WeightsController.create` (**sin** `try/catch` todavía). DTO intacto.
3. `test(dto-dates-owner-timezone): create pet compares birthDate with the requester local day (R2)` — rojo (describe R2 + los tres `it` de #5 adaptados + `pets.controller.spec.ts` R2 con `expect.any(Date)`).
4. `feat(dto-dates-owner-timezone): validate birthDate against the requester local day on create (R2)` — verde: `PetBirthDateInFutureError`, `requesterLocalDay` **mínimo**, `USER_REPOSITORY` en `CreatePetUseCase`, `AuthModule` en `PetsModule`, `execute(..., now)`, `now` en `PetsController.create` (**sin** `try/catch` ni rama del mapper todavía). DTO intacto.
5. `test(dto-dates-owner-timezone): requesterLocalDay falls back to UTC with a warn on missing user or non-IANA zone (R3)` — rojo (spec nuevo).
6. `feat(dto-dates-owner-timezone): share the IANA fallback between ownerLocalDay and requesterLocalDay via localDayInZone (R3)` — verde: extracción en `owner-local-day.ts`, `requester-local-day.ts` delega; specs de #82/#88 verdes sin diff.
7. `test(dto-dates-owner-timezone): update pet compares birthDate with the owner local day only when present (R4)` — rojo (describe R4 + siete `execute` heredados + `pets.controller.spec.ts` R13 con `expect.any(Date)`).
8. `feat(dto-dates-owner-timezone): validate birthDate against the owner local day on update (R4)` — verde: `execute(..., now)` en `UpdatePetUseCase`, `now` en `PetsController.update`.
9. `test(dto-dates-owner-timezone): e2e measuredAt today and tomorrow in the owner zone without margin (R5)` — rojo por status (D9); heredado de #15 R7 adaptado; import de la constante fuera.
10. `feat(dto-dates-owner-timezone): drop the UTC+1 refine from the weight DTO and map WeightMeasuredInFutureError to the validation 400 (R5)` — verde: `weight.dto.ts`, `iso-date.ts` (fuera `todayIsoDateUtc`), `try/catch` en `WeightsController.create`.
11. `test(dto-dates-owner-timezone): e2e birthDate today and tomorrow in the requester zone on POST and the owner zone on PATCH (R6)` — rojo por status (D9); filas de los dos DTO specs retiradas; `seedUser(label, timezone)`.
12. `feat(dto-dates-owner-timezone): drop the UTC refine from the pet DTO and map PetBirthDateInFutureError to the validation 400 (R6)` — verde: `create-pet.dto.ts`, `mapPetError`, `try/catch` en `PetsController.create`.
13. `docs(dto-dates-owner-timezone): mutation evidence, regression sweep and traceability (R7,R8)` — reporte y trazabilidad; las mutaciones de R8 **no** se versionan.

Entre el commit 2 y el 10 (pesos) y entre el 4 y el 12 (mascotas) el árbol
es coherente: zod sigue rechazando el futuro UTC antes de que el use case
vea el body, y los owners de todos los e2e existentes están en `'UTC'` o
mandan fechas pasadas fijas, así que ningún e2e heredado alcanza el error
de dominio sin mapear. `iso-date.ts` pierde `todayIsoDateUtc` en el
commit 10 (su último consumidor, `weight.dto.ts`, deja de importarlo en ese
mismo commit); la copia local de `create-pet.dto.ts` cae en el 12.

### D13 — Premisa móvil y deuda declarada (R7-a)

Verificado en el árbol (rutas y líneas en [[requirements]] §Contexto): el
móvil manda fecha civil del dispositivo (`localTodayIso`, `dateToIso`),
ningún test ni pantalla depende del margen `+1`, y el 400 se consume por
la forma `errors[]`, no por el texto. Diff cero bajo `mobile-pet-tracker/`
(R7-a). La deuda móvil que abre D2 («dispositivo por delante del owner»)
queda escrita en [[requirements]] §Fuera de alcance con los dos archivos;
el id lo abre la sesión Frontend solo si el gate firma la decisión por
defecto.

## Archivos afectados

Exactamente estos bajo `backend-pet-tracker/` (R7-a los verifica con `git
diff --name-only 381d1e36...HEAD -- backend-pet-tracker/`):

1. `src/modules/health/domain/errors/weight.errors.ts` — domain, nuevo: `WeightMeasuredInFutureError` (D10). Commit 2.
2. `src/modules/health/application/use-cases/create-weight.use-case.ts` — application: `@Inject(PET_REPOSITORY) private readonly pets: PetRepository` entre `weights` y `audit`; `execute(petId: string, dto: CreateWeightDto, userId: string, now: Date)`; primera línea del cuerpo: `if (dto.measuredAt > (await ownerLocalDay(this.pets, petId, now))) throw new WeightMeasuredInFutureError();`; imports de `PET_REPOSITORY`, `PetRepository`, `ownerLocalDay` (`@/modules/pets/application/owner-local-day`) y del error; doc-comment de una línea (D1, D2, D6). Commit 2.
3. `src/modules/health/application/use-cases/create-weight.use-case.spec.ts` — test: constantes `NOW_CDMX_EVENING`/`NOW_KIRITIMATI_MORNING`; describe R1; los dos `it` de #15 R10 adaptados. Commit 1.
4. `src/modules/health/infrastructure/weights.controller.ts` — infrastructure: `create` iza `const now = new Date()` y lo pasa como cuarto argumento (commit 2); `try/catch` con `validationError([{ path: ['measuredAt'], message: error.message }])` para `WeightMeasuredInFutureError` (commit 10). Import del error (D5).
5. `src/modules/pets/domain/errors/pet.errors.ts` — domain: clase `PetBirthDateInFutureError` (D10). Commit 4.
6. `src/modules/pets/application/requester-local-day.ts` — application, nuevo: `requesterLocalDay(users, userId, now)`; mínimo en el commit 4, delega en `localDayInZone` en el 6 (D4).
7. `src/modules/pets/application/use-cases/create-pet.use-case.ts` — application: `@Inject(USER_REPOSITORY) private readonly users: UserRepository` entre `pets` y `auditLogger`; `execute(dto: CreatePetDto, userId: string, now: Date)`; primera línea: `if (dto.birthDate !== undefined && dto.birthDate > (await requesterLocalDay(this.users, userId, now))) throw new PetBirthDateInFutureError();`; imports; una línea en el doc-comment (`:9-14`) (D3, D6). Commit 4.
8. `src/modules/pets/application/use-cases/create-pet.use-case.spec.ts` — test: describe R2; `buildDeps` con `users`; tres `it` de #5 adaptados. Commit 3.
9. `src/modules/pets/infrastructure/pets.controller.ts` — infrastructure: `create` iza `now` y lo pasa como tercer argumento (commit 4); `update` iza `now` dentro del `try` y lo pasa como cuarto (commit 8); `create` gana `try/catch → mapPetError` y `mapPetError` la rama de D5 (commit 12). Import del error.
10. `src/modules/pets/infrastructure/pets.controller.spec.ts` — test: `expect.any(Date)` en las aserciones de R2 (`:89-92`, commit 3) y R13 (`:291-293`, commit 7). Nombres intactos.
11. `src/modules/pets/pets.module.ts` — module: `imports: [AuthModule, PetDeviceReadModule, PetPhotoReadModule, PetVaccineReadModule]`; import de `@/modules/auth/auth.module`; una línea en el doc-comment (D8). Commit 4.
12. `src/modules/pets/application/requester-local-day.spec.ts` — test, nuevo: describe R3. Commit 5.
13. `src/modules/pets/application/owner-local-day.ts` — application: `localDayInZone` exportada; `ownerLocalDay` delega (D4). Commit 6.
14. `src/modules/pets/application/use-cases/update-pet.use-case.ts` — application: `execute(petId: string, userId: string, dto: UpdatePetDto, now: Date)`; primera línea: `if (dto.birthDate !== undefined && dto.birthDate > (await ownerLocalDay(this.pets, petId, now))) throw new PetBirthDateInFutureError();`; imports; una línea en el doc-comment (`:13-17`) (D3, D6, D7). Commit 8.
15. `src/modules/pets/application/use-cases/update-pet.use-case.spec.ts` — test: `findOwnerTimezone` en `buildDeps`; describe R4; siete `execute` heredados con `now`. Commit 7.
16. `test/health-weights.e2e-spec.ts` — test: `seedUser(label, timezone = 'UTC')`; imports `localDayOf`/`shiftDay`; fuera el import de la constante; describe R5; heredado de #15 R7 adaptado (D9). Commit 9.
17. `src/modules/health/application/dto/weight.dto.ts` — application: `measuredAt: IsoDateSchema,`; fuera `MEASURED_AT_MAX_FUTURE_DAYS`, `maxMeasuredAtIsoDate` y `todayIsoDateUtc` del import (D1, D2). Commit 10.
18. `src/modules/health/application/dto/iso-date.ts` — application: fuera `todayIsoDateUtc` (`:5-7`); `IsoDateSchema` e `isIsoDate` intactos (C7). Commit 10.
19. `test/pets.e2e-spec.ts` — test: `seedUser(label, timezone = 'UTC')`; imports; describe R6 (D9). Commit 11.
20. `src/modules/pets/application/dto/create-pet.dto.spec.ts` — test: fuera la fila `:56`. Commit 11.
21. `src/modules/pets/application/dto/update-pet.dto.spec.ts` — test: fuera la fila `:16`. Commit 11.
22. `src/modules/pets/application/dto/create-pet.dto.ts` — application: `BirthDateSchema` sin el tercer `refine` (`:10-12`); fuera `todayIsoDateUtc` (`:64-66`); doc-comment `:5` → «`YYYY-MM-DD` real del calendario — R4; desde #89 el «no posterior a hoy» vive en los use cases» (D1). Commit 12.

Fuera de `backend-pet-tracker/`:
`../specs/dto-dates-owner-timezone/traceability.md` (Codex rellena),
`../progress/impl_dto-dates-owner-timezone.md` (reporte con secciones `##
T0`, `## Rojo/verde por commit`, `## Regresión (R7)`, `## Mutación (R8)`),
`../feature_list.json` (solo `status` de #89; lo mueve el leader).

## Alternativas descartadas

- **Schema de zod construido por request con la zona resuelta**: mueve
  consultas de repositorio al controller. D1 (= #88).
- **Zona en el body o cabecera `x-timezone`**: confiar en el cliente. D1.
- **Conservar `+1` como margen «en la zona del owner»**: admite mañana
  local; es el defecto (a). D2. Queda como alternativa para el gate.
- **Margen `-1`/`+1` sobre UTC**: #88 D2.
- **Zona del requester en PATCH**: D3.
- **Duplicar IANA + warn en `requester-local-day.ts`**: dos copias, dos
  `warn`; el candado de #82/#88 no vigilaría la nueva. D4. R7-c lo prohíbe
  por grep.
- **Un solo archivo con tres exports bajo el nombre `owner-local-day`** o
  **renombrar el archivo**: D4.
- **`localDayInZone` en `src/pipeline/local-day.ts`**: `Logger` de Nest en
  el núcleo «cero imports». D4.
- **Provider Nest para el helper**: función pura, se testea sin DI. D4.
- **`weight-error.mapper.ts`**: D5.
- **Cambiar los textos de los 400** (p. ej. `'measuredAt cannot be in the
  future'`): D5; decisión de copy para el gate.
- **Dejar el PATCH sin validación de futuro** (quitar el `refine` y no
  tocar `UpdatePetUseCase`): regresión silenciosa. D7.
- **`UserTimezoneReadModule`**: no hay ciclo que romper. D8.
- **Una sola zona en el e2e** o **fake timers**: D9.
- **Commit rojo por mutación versionada** para R8: hay rojos reales
  (commits 1, 3, 5, 7, 9, 11); R8 es un candado adicional y va sin
  versionar (C4 vía (b)).

## Verificación

- **Nunca `./init.sh` a pelo**: `env -u FORCE_COLOR bash ./init.sh` desde
  la raíz del worktree (bug #75: `FORCE_COLOR` rompe `init.sh`).
- **Antes de cualquier e2e o `init.sh`**: `pgrep -af 'init\.sh'` y `pgrep
  -af 'test:e2e'` deben salir **vacíos** — el Postgres de docker es
  compartido con el otro worktree (sesión Frontend, #78); dos suites a la
  vez dan rojos falsos (2026-09-06). Si hay algo corriendo, espera; no lo
  mates.
- Unitario puntual: `pnpm -C backend-pet-tracker test -- <patrón>`;
  typecheck: `pnpm -C backend-pet-tracker exec tsc --noEmit`; e2e de la
  feature: `pnpm -C backend-pet-tracker run test:e2e -- health-weights
  pets`; suite e2e completa: `pnpm -C backend-pet-tracker run test:e2e`
  (Docker arriba en `5432` y `4566`).
- Runtime: con el Node que usa `init.sh`, `Intl.supportedValuesOf('timeZone')`
  contiene `Pacific/Kiritimati`, `Pacific/Pago_Pago` y `America/Mexico_City`,
  y los dos instantes de R1 formatean `2026-08-10` (CDMX) y `2026-08-11`
  (Kiritimati) — comando exacto en [[tasks]] T0.
