---
feature: "vaccine-applied-at-owner-timezone"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[vaccine-applied-at-owner-timezone]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `f3e3280`.
> D1-D6 cierran por escrito las decisiones que el leader dejó abiertas al
> abrir #88 (2026-09-10); D7-D10 las tomó el spec_author. El humano las
> ratifica o cambia en el gate.

## Capas tocadas

| Capa | Archivo | Qué cambia |
|---|---|---|
| domain (health) | `src/modules/health/domain/errors/vaccine.errors.ts` | clase nueva `VaccineAppliedInFutureError` (D9) |
| application (pets) | `src/modules/pets/application/owner-local-day.ts` | **nuevo**: `ownerLocalDay(pets, petId, now)` — zona del owner → IANA → fallback UTC + warn → `localDayOf` (D4) |
| application (pets) | `src/modules/pets/application/use-cases/get-pet.use-case.ts` | sustituye su resolución inline (`:70-84`, `:92`) por `ownerLocalDay` (D4) |
| application (health) | `src/modules/health/application/use-cases/create-vaccine.use-case.ts` | `execute(petId, dto, userId, now)`; regla `appliedAt > ownerLocalDay` → error, primera operación (D1, D2) |
| application (health) | `src/modules/health/application/use-cases/update-vaccine.use-case.ts` | inyecta `PET_REPOSITORY` (segundo parámetro); `execute(petId, id, dto, userId, now)`; regla solo si `dto.appliedAt !== undefined` (D3) |
| application (health) | `src/modules/health/application/dto/vaccine.dto.ts` | fuera los dos `refine` con `todayIsoDateUtc`; `appliedAt: IsoDateSchema` / `.optional()`; fuera el import (D1) |
| infrastructure (health) | `src/modules/health/infrastructure/mappers/vaccine-error.mapper.ts` | rama `VaccineAppliedInFutureError` → 400 con la forma de zod (D5) |
| infrastructure (health) | `src/modules/health/infrastructure/vaccines.controller.ts` | `create` y `update` construyen un `now` y lo pasan a `execute` (D1) |
| tests | `owner-local-day.spec.ts` (nuevo), `vaccine-mutations.use-cases.spec.ts`, `test/health-vaccines.e2e-spec.ts` | R3, R1/R2, R4 |

Sin migración, sin dependencia nueva, sin módulo Nest nuevo, sin cambio en
`health.module.ts` (ya importa `PetsModule`, `:25`, que exporta
`PET_REPOSITORY`, `pets.module.ts:39`), sin método nuevo en ningún puerto
(por eso ningún doble `MockOf<...>` cambia: ver D6).

## Decisiones técnicas

### D1 — La comparación sale del DTO y vive en los dos use cases, con `now` del controller (R1, R2, R4)

Criterio 4 del enunciado: «la validación sale del DTO puro solo si la spec
lo justifica por escrito; si se queda en el use case, el DTO deja de
comparar fechas». Justificación:

- El schema de zod es una constante de módulo sin acceso a repositorios ni
  al request (`vaccine.dto.ts:8`, `:26`); «hoy» depende del owner de la
  mascota, que solo se conoce con `petId` y `PetRepository.findOwnerTimezone`.
  Para que zod comparase habría que (a) construir el schema por request con
  la zona ya resuelta —el controller pasaría a consultar repositorios, que
  es lógica de aplicación en infraestructura (`docs/architecture.md`
  «application no sabe que existe un framework HTTP»; su inverso también)—
  o (b) pasar la zona en el body, que es confiar en el cliente.
- El use case ya es la capa que decide el día en el repo
  (`get-pet.use-case.ts:70-93`, `list-trips.use-case.ts`), ya inyecta
  `PET_REPOSITORY` en create (`create-vaccine.use-case.ts:20`) y ya lanza
  errores de dominio que el mapper convierte en 400
  (`VaccineSpeciesMismatchError`, `vaccine-error.mapper.ts:20-26`). La
  regla «`appliedAt` no es futura» es una regla de negocio, no de formato:
  encaja en `docs/conventions.md` §Manejo de errores (dominio lanza, el
  borde HTTP mapea).
- `IsoDateSchema` sigue validando **formato** (`'Invalid ISO date'`,
  `iso-date.ts:3,9-15`): el DTO deja de comparar fechas y nada más.
- **Reloj inyectado** (convención de #82 D9 y `geofence-eval.ts:98`): cada
  `execute` recibe `now: Date` como último parámetro y el controller crea
  **un solo** `new Date()` por request (`create`, `vaccines.controller.ts:64`;
  `update`, `:92`, dentro del `try`), sin `Date.now()` dentro del use case.
  Descartado `now` opcional con default (deja el reloj oculto que la
  convención prohíbe).

`todayIsoDateUtc` **no se borra** de `iso-date.ts`: `weight.dto.ts:2,30` lo
usa (fuera de alcance, [[requirements]] §Fuera de alcance).

### D2 — Regla exacta: `appliedAt <= ownerLocalDay(now)` acepta, `>` lanza; sin margen; primera operación (R1, R2)

- Comparación de cadenas `YYYY-MM-DD` (orden lexicográfico = orden
  cronológico; es lo que ya hacía el `refine`).
- **Sin margen de un día** para dispositivos adelantados (pregunta abierta
  del enunciado): el criterio 2 exige `400` para «mañana en la zona del
  owner»; el caso «dispositivo por delante del servidor» es exactamente el
  que resuelve la zona del owner (Kiritimati a las 10:00 ya es «hoy»
  local); un margen volvería a registrar vacunas del futuro, que es el
  defecto (2) que se corrige. Pesos tiene `+1` (`MEASURED_AT_MAX_FUTURE_DAYS`)
  como decisión propia de `specs/health-weights/` (D5 de esa spec) y no se
  importa aquí.
- **Precedencia**: la comprobación es la **primera** operación de `execute`
  en los dos use cases (en update, guardada por `dto.appliedAt !==
  undefined`), antes de catálogo/`findById`/UUID/`findByIdAndPet`. Es la
  misma precedencia que hoy: zod corre antes que cualquier lookup, así que
  «future + catálogo inexistente» sigue siendo `400` y no `404`. Coste: una
  consulta `findOwnerTimezone` en un `PATCH` con `appliedAt` sobre un id
  inexistente; despreciable frente a cambiar el orden de los errores.

### D3 — Update valida solo si el body trae `appliedAt`; gana `PET_REPOSITORY` (R2)

`UpdateVaccineUseCase` hoy **no** inyecta `PET_REPOSITORY`
(`update-vaccine.use-case.ts:14-17`; la premisa del leader lo daba por
hecho). Se añade `@Inject(PET_REPOSITORY) private readonly pets:
PetRepository` como **segundo** parámetro para que el orden `(vaccines,
pets, audit)` sea el mismo que en create (`create-vaccine.use-case.ts:18-22`)
y el único spec que construye posicionalmente
(`vaccine-mutations.use-cases.spec.ts:50-56`) cambie de forma obvia. Sin
`appliedAt` en el body (`{}` incluido, `:29-30`) no se consulta la zona:
un `PATCH` de `notes` no debe depender de `users`.

### D4 — Helper `ownerLocalDay` en `pets/application/`, reutilizado por `GetPetUseCase` (R1, R2, R3)

Con create y update, la resolución «`findOwnerTimezone` →
`isSupportedTimeZone` → `'UTC'` + `warn` → `localDayOf`» tendría **tres**
copias. Se extrae a una función pura:

```
// src/modules/pets/application/owner-local-day.ts
export async function ownerLocalDay(
  pets: PetRepository, petId: string, now: Date,
): Promise<string>
```

- **Firma**: tres parámetros. El leader propuso un cuarto `logger: Logger`;
  se descarta porque `Logger` de Nest no expone su contexto y el `scope`
  del objeto del `warn` tendría que pasarse aparte. El helper crea su
  propio `const logger = new Logger('ownerLocalDay')` a nivel de módulo y
  avisa con `{ scope: 'owner-local-day', petId, timezone, message: 'falling
  back to UTC: owner timezone missing or not a IANA zone' }`. El `scope`
  pasa de `'get-pet'` a `'owner-local-day'` para el perfil; #82 R2 asevera
  `expect.objectContaining({ petId, timezone })` (`get-pet.use-case.spec.ts:232-234`,
  `:251-253`), no el `scope`, así que sigue verde sin editarse. `jest.spyOn(Logger.prototype,
  'warn')` sigue capturando la llamada porque la instancia no sobreescribe
  `warn`.
- **Ubicación**: `pets/application/` porque depende del puerto
  `PetRepository` (dominio de `pets`) y de `@/pipeline/local-day`; la
  capa `application` ya usa `Logger` (`get-pet.use-case.ts:1,43`) y ya
  importa `local-day` (`:18`). Precedente de helper + spec directamente
  bajo `application/`: `health/application/vaccine-date.ts` y
  `weight-variation.ts`. `health` ya importa de `pets` en dominio e
  infraestructura (`create-vaccine.use-case.ts:13-14`,
  `vaccines.controller.ts:29-31`); importar `@/modules/pets/application/owner-local-day`
  desde `health/application` mantiene la dirección de dependencia
  (application → application de otro módulo, sin tocar infraestructura) y
  `HealthModule` ya importa `PetsModule`. No se crea un provider Nest: una
  función con el repositorio como argumento se testea sin DI (R3).
- **Refactor de `GetPetUseCase`**: `:70-84` y `:92` pasan a `const today =
  await ownerLocalDay(this.pets, petId, now)` y `findNextVaccine(petId,
  today)`; se retiran `Logger` (`:1`, `:43`) e `isSupportedTimeZone`/`localDayOf`
  (`:18`) si quedan sin uso. Los tests R1/R2 de #82 (`get-pet.use-case.spec.ts:179-270`)
  **no se editan** y son el candado del refactor (R3); M1 de R6 lo prueba
  además por mutación.
- **Orden de aparición**: el helper nace mínimo en el verde de R1
  (`localDayOf(now.getTime(), zona ?? 'UTC')`, sin IANA ni `warn`) para que
  el rojo de R3 sea real; el refactor de `GetPetUseCase` espera al verde de
  R3 (antes, #82 R2 se pondría rojo).

### D5 — Forma del 400: byte a byte la de zod (R4)

`mapVaccineError` gana la rama:

```
if (error instanceof VaccineAppliedInFutureError) {
  return new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Validation failed',
    errors: [{ path: 'appliedAt', message: error.message }],
  });
}
```

Es el mismo objeto que hoy produce `validationError`
(`vaccines.controller.ts:131-142`) para ese `refine`: el contrato hacia
cualquier cliente **no cambia ni en forma ni en mensaje** (criterio 2). El
móvil no crea vacunas hoy, pero su parser de 400 lee `errors[]`
(`health-records.ts:131-138`) y un formulario futuro heredaría la misma
forma. Descartada la forma de dominio `{ statusCode, code:
'VACCINE_APPLIED_IN_FUTURE', message }`: cambia el body (pierde `errors`,
gana `code`) para ahorrar tres líneas, y el `it` de #14 R8 no distingue
(solo asevera status), así que nada obliga. Se elige la opción que deja el
contrato idéntico.

### D6 — Inventario completo y dobles que cambian de firma (R5)

Grep en `f3e3280`:

- `grep -rn "MockOf<PetRepository>\|MockOf<VaccineRepository>" src test` →
  solo `alerts-engine-consumer.service.spec.ts:109,208,215`
  (`MockOf<PetRepository>`), que **ya** incluye `findOwnerTimezone` (`:113`).
  No hay `MockOf<VaccineRepository>`. Esta feature no añade métodos a
  `PetRepository` ni a `VaccineRepository`: **ningún doble exhaustivo
  cambia**.
- `grep -rn "CreateVaccineUseCase\|UpdateVaccineUseCase" src test` →
  `health.module.ts` (registro), `vaccine-mutations.use-cases.spec.ts:31,50`
  (construcción posicional: cambia en R1/R2) y `vaccines.controller.ts:51,53,66,94`
  (llamadas: cambian en R1/R2). `test/` no los referencia; ni
  `pets.controller.spec.ts` ni ningún otro spec asevera la aridad de
  `execute` de estos use cases (no existe `vaccines.controller.spec.ts`).
- Correcciones a `files_affected` de #88: `iso-date.ts` no cambia;
  `get-pet.use-case.ts`, el helper, los errores de dominio, el mapper, el
  controller y los dos specs unitarios faltaban. Lista cerrada en
  §Archivos afectados.

### D7 — Los DTOs hermanos quedan fuera (decisión del leader)

`weight.dto.ts:10-13,29-33` y `create-pet.dto.ts:10-12,64-66` comparten el
patrón `<= hoy UTC`. Se listan en [[requirements]] §Fuera de alcance con
ruta:línea y el leader abre id al cerrar. Motivo escrito por el leader:
#88 es la deuda registrada de vacunas y `ownerLocalDay` deja el camino
hecho; meter tres módulos en una feature test-primero triplica los rojos.
Pista para el id de pesos: la mascota existe → `ownerLocalDay` tal cual.
Pista para `birthDate`: en `POST /v1/pets` la mascota no existe; el owner
es el requester (`USER_REPOSITORY.findById(request.user.id).timezone`).

### D8 — Determinismo del e2e y por qué el par de zonas lo hace rojo a cualquier hora (R4, R6)

Mismo argumento que #82 D10, aplicado a la escritura. `localDayOf` se
evalúa en el test y en el servidor **en el mismo proceso** sobre la misma
zona, con milisegundos de diferencia: `today` calculado una vez antes de
las peticiones coincide con el `hoy` del servidor salvo que la medianoche
de esa zona caiga entre ambos. Con `D` = día UTC y `h` = hora UTC
(verificado con `Intl` en el Node del VPS el 2026-09-10; las dos zonas sin
horario de verano):

| `h` | día en Kiritimati (UTC+14) | día en Pago_Pago (UTC-11) | «hoy» de Kiritimati bajo UTC | «mañana» de Pago_Pago bajo UTC |
|---|---|---|---|---|
| 00-09 | `D` | `D-1` | `D <= D` → 201 (no delata) | `D <= D` → **201, esperado 400** |
| 10 | `D+1` | `D-1` | `D+1 > D` → **400, esperado 201** | `D <= D` → **201, esperado 400** |
| 11-23 | `D+1` | `D` | `D+1 > D` → **400, esperado 201** | `D+1 > D` → 400 (no delata) |

Una implementación en UTC (la de `f3e3280`, o la mutación M1) falla en al
menos una celda en cada franja: el `it` es rojo a cualquier hora. Una sola
zona coincidiría con UTC parte del día (Kiritimati de 00 a 09; Pago_Pago
de 11 a 23) y dejaría horas ciegas. No se usan fake timers en el servidor
ni `TZ` en el runner (`package.json` y `test/jest-e2e.json` no lo fijan; no
se añade).

### D9 — Error de dominio sin argumentos y mensaje único (R1, R2, R4)

```
export class VaccineAppliedInFutureError extends Error {
  constructor() {
    super('Applied date cannot be in the future');
    this.name = 'VaccineAppliedInFutureError';
  }
}
```

Mismo patrón que `VaccineSpeciesMismatchError` (`vaccine.errors.ts:8-13`);
el mapper usa `error.message`, así que el texto vive en un solo sitio. Sin
`appliedAt`/`today` en el mensaje: el contrato exige el texto exacto y el
detalle no llega al cliente.

### D10 — Plan de commits (CHECKPOINTS C4)

Diez commits en `feature/88-vaccine-applied-at-owner-timezone`, rojo →
verde por bloque, con el R-id en el mensaje (`docs/conventions.md:159-172`):

1. `test(vaccine-applied-at-owner-timezone): create compares appliedAt with the owner local day (R1)` — rojo por aserción (describe R1 + `it` de R12 create adaptado).
2. `feat(vaccine-applied-at-owner-timezone): validate appliedAt against the owner local day on create (R1)` — verde: `VaccineAppliedInFutureError`, helper **mínimo** (`zona ?? 'UTC'`, sin IANA ni `warn`), `execute(..., now)` en create, `now` en `VaccinesController.create`. El DTO y el mapper **no** se tocan aún.
3. `test(vaccine-applied-at-owner-timezone): update compares appliedAt with the owner local day only when present (R2)` — rojo (describe R2 + `it` de R12 update adaptado).
4. `feat(vaccine-applied-at-owner-timezone): validate appliedAt against the owner local day on update (R2)` — verde: `PET_REPOSITORY` en update, `execute(..., now)`, `now` en `VaccinesController.update`.
5. `test(vaccine-applied-at-owner-timezone): ownerLocalDay falls back to UTC with a warn on null or non-IANA zone (R3)` — rojo (spec nuevo del helper).
6. `feat(vaccine-applied-at-owner-timezone): ownerLocalDay falls back to UTC with a warn (R3)` — verde: `isSupportedTimeZone` + `Logger.warn` en el helper.
7. `refactor(vaccine-applied-at-owner-timezone): GetPetUseCase delegates the owner day to ownerLocalDay (R3)` — `get-pet.use-case.ts` usa el helper; `get-pet.use-case.spec.ts` verde sin diff.
8. `test(vaccine-applied-at-owner-timezone): e2e appliedAt today and tomorrow in the owner zone for POST and PATCH (R4)` — rojo por status (tabla D8).
9. `feat(vaccine-applied-at-owner-timezone): drop the UTC refine from the vaccine DTO and map VaccineAppliedInFutureError to the validation 400 (R4)` — verde: `vaccine.dto.ts` + `vaccine-error.mapper.ts`.
10. `docs(vaccine-applied-at-owner-timezone): mutation evidence, regression sweep and traceability (R5,R6)` — reporte y trazabilidad; las mutaciones de R6 **no** se versionan.

Entre el commit 2 y el 9 el árbol es coherente: zod sigue rechazando el
futuro UTC antes de que el use case vea el body, y los owners de todos los
e2e existentes están en `'UTC'` (`seedUser` por defecto) o mandan fechas
pasadas fijas, así que ningún e2e heredado alcanza el error de dominio sin
mapear.

## Archivos afectados

Exactamente estos once bajo `backend-pet-tracker/` (R5-a los verifica con
`git diff --name-only f3e3280...HEAD -- backend-pet-tracker/`):

1. `src/modules/health/domain/errors/vaccine.errors.ts` — domain: clase
   `VaccineAppliedInFutureError` (D9). Commit 2.
2. `src/modules/pets/application/owner-local-day.ts` — application, nuevo:
   `ownerLocalDay(pets, petId, now)` con `Logger` propio (D4). Mínimo en el
   commit 2; fallback + `warn` en el 6.
3. `src/modules/health/application/use-cases/create-vaccine.use-case.ts` —
   application: `execute(petId, dto, userId, now)`; primera línea del
   cuerpo: `if (dto.appliedAt > (await ownerLocalDay(this.pets, petId,
   now))) throw new VaccineAppliedInFutureError();` (D1, D2). Import del
   helper y del error. Commit 2.
4. `src/modules/health/infrastructure/vaccines.controller.ts` —
   infrastructure: `create` (`:64-71`) y `update` (`:92-100`) izan `const
   now = new Date()` al inicio del `try` y lo pasan como último argumento
   de `execute` (D1). Commits 2 y 4.
5. `src/modules/health/application/use-cases/vaccine-mutations.use-cases.spec.ts`
   — test: constantes `NOW_CDMX_EVENING`/`NOW_KIRITIMATI_MORNING`; describes
   R1 y R2; los dos `it` de #14 R12 adaptados (D3, D6). Commits 1 y 3.
6. `src/modules/health/application/use-cases/update-vaccine.use-case.ts` —
   application: `@Inject(PET_REPOSITORY) private readonly pets:
   PetRepository` como segundo parámetro; `execute(petId, id, dto, userId,
   now)`; `if (dto.appliedAt !== undefined && dto.appliedAt > (await
   ownerLocalDay(this.pets, petId, now))) throw new
   VaccineAppliedInFutureError();` como primera línea (D2, D3). Commit 4.
7. `src/modules/pets/application/owner-local-day.spec.ts` — test, nuevo:
   describe R3. Commit 5.
8. `src/modules/pets/application/use-cases/get-pet.use-case.ts` —
   application: `:70-84` y `:92` → `ownerLocalDay`; imports sobrantes
   fuera; una línea en el doc-comment (`:32-40`) sobre #88 (D4). Commit 7.
9. `test/health-vaccines.e2e-spec.ts` — test: describe R4 con dos `it`
   (D8). Commit 8.
10. `src/modules/health/application/dto/vaccine.dto.ts` — application:
    `appliedAt: IsoDateSchema` (`:12-15`) y `IsoDateSchema.optional()`
    (`:29-32`); import `:2` sin `todayIsoDateUtc` (D1). Commit 9.
11. `src/modules/health/infrastructure/mappers/vaccine-error.mapper.ts` —
    infrastructure: rama de D5 e import del error. Commit 9.

Fuera de `backend-pet-tracker/`:
`../specs/vaccine-applied-at-owner-timezone/traceability.md` (Codex
rellena), `../progress/impl_vaccine-applied-at-owner-timezone.md` (reporte
con secciones `## T0`, `## Rojo/verde por commit`, `## Regresión (R5)`, `##
Mutación (R6)`), `../feature_list.json` (solo `status` de #88; lo mueve el
leader).

## Alternativas descartadas

- **Schema de zod construido por request con la zona resuelta** (el
  controller consulta `findOwnerTimezone` y pasa `today` al schema): mueve
  una consulta de repositorio al controller y obliga a que
  `VaccinesController` inyecte `PET_REPOSITORY`. D1.
- **Zona en el body o cabecera `x-timezone`**: confiar en el cliente; sin
  mitad móvil degenera en UTC. D1.
- **Comparar contra el día UTC con margen `-1`/`+1`**: el margen negativo
  rompe el criterio 1 en zonas positivas por la tarde; el positivo rompe el
  criterio 2 (mañana local aceptado). D2.
- **Validar después del lookup de catálogo / de `findByIdAndPet`**: cambia
  la precedencia 400/404 que hoy fija zod. D2.
- **Inyectar `PET_REPOSITORY` en update como tercer parámetro** (al final):
  el único spec posicional se rompería igual y el orden divergiría de
  create. D3.
- **Pasar `logger` al helper** o **un provider Nest `OwnerLocalDayService`**:
  más superficie para seis líneas; la función pura se testea sin DI. D4.
- **Dejar la resolución inline en los tres use cases**: tres copias de la
  misma lógica con tres `warn` distintos; el candado de #82 no vigilaría las
  dos nuevas. D4.
- **Helper en `src/pipeline/`**: depende de `PetRepository` (puerto de
  `pets`), no es núcleo puro. D4.
- **Forma de dominio `{ code: 'VACCINE_APPLIED_IN_FUTURE' }`**: cambia el
  body del 400 sin ganancia. D5.
- **Spec unitario del mapper o del controller**: no existen hoy; el `toEqual`
  del e2e fija el body completo. D5.
- **Una sola zona en el e2e** o **fake timers en el servidor**: D8.
- **Commit rojo por mutación versionada** para R6: hay rojos reales
  (commits 1, 3, 5, 8); R6 es un candado adicional sobre la zona ciega y va
  sin versionar (C4 vía (b)).
