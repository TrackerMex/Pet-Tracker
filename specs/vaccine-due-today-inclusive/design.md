---
feature: "vaccine-due-today-inclusive"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[vaccine-due-today-inclusive]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
> Rutas relativas a `backend-pet-tracker/`; líneas del commit base `7f298f2`.
> D1-D7 son las decisiones que el leader cerró el 2026-09-10 sobre las
> abiertas de `progress/explore_vaccine-due-today-inclusive.md` §6 (el
> humano las ratifica o cambia en el gate); D8-D11 las tomó el spec_author.

## Capas tocadas

| Capa | Archivo | Qué cambia |
|---|---|---|
| domain (pets) | `src/modules/pets/domain/repositories/pet.repository.ts` | método nuevo `findOwnerTimezone(petId): Promise<string \| null>` en la interface `PetRepository` (D8) |
| domain (pets) | `src/modules/pets/domain/ports/pet-vaccine-reader.ts` | parámetro `after` → `from` (D7) |
| application (pets) | `src/modules/pets/application/use-cases/get-pet.use-case.ts` | `execute(petId, now)`, zona del owner + `isSupportedTimeZone`/`localDayOf`, fallback UTC con `Logger.warn` (D8, D9) |
| infrastructure (pets) | `src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts` | implementación Drizzle de `findOwnerTimezone` (D8) |
| infrastructure (pets) | `src/modules/pets/infrastructure/pets.controller.ts` | un solo `now` por request, pasado a `execute` (D9) |
| infrastructure (health) | `src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts` | `gt` → `gte`, `after` → `from` (D1, D7) |
| tests | `get-pet.use-case.spec.ts`, `pets.controller.spec.ts`, `test/health-vaccines.e2e-spec.ts` | R1-R5 |

Sin migración, sin dependencia nueva, sin módulo Nest nuevo, sin cambio en
`pets.module.ts` ni en `pet-vaccine-read.module.ts`.

## Decisiones técnicas

### D1 — Operador `gte`: la vacuna del día sigue siendo "próxima" (R3)

La dosis de hoy es la que más importa enseñar y sigue pendiente hasta que
termina el día. Alinea la Home con Salud (`health.tsx:74`, `>= hoy` local) y
con #85 D-I (`specs/mobile-home-reminders-real-data/requirements.md:99-101`:
recordatorios inclusivos `>= 0` días). Enmienda a #14 R13
(`specs/health-vaccines/requirements.md:95`, «posterior a la fecha actual»):
pasa a «no anterior al día civil del owner». Descartado alinear Salud a `gt`:
propagaría el defecto a la mitad sana (argumento ya escrito en #85 D-I).

### D2 — Día civil en la zona del **owner** de la mascota, no del requester ni UTC (R1, R4)

Opción (c) de la exploración. Reutiliza `localDayOf` + `isSupportedTimeZone`
(`src/pipeline/local-day.ts:58`, `:53`) y el patrón de #10
(`activity.drizzle.store.ts:217-254`; uso en `list-trips.use-case.ts:96-98`
y `get-daily-activity.use-case.ts:73-74`).

**Por qué owner y no requester**, sin apoyarse en filas persistidas (el
argumento de `list-trips.use-case.ts:39-43` habla de filas de actividad que
aquí no existen): `nextVaccine` es una propiedad **de la mascota**, no de
quien la mira. Si dependiera del requester, dos miembros de la misma
familia en zonas distintas recibirían dos `nextVaccine` distintos para la
misma mascota en el mismo instante (uno "hoy", otro `null` o "mañana"), y la
misma pantalla en dos teléfonos se contradiría. Con la zona del owner el
perfil es una función de `(petId, now)` únicamente: cacheable, comparable
entre dispositivos y coherente con `GET /trips` y `GET /activity` de la
misma mascota, que ya resuelven el día así. Además el use case no recibe al
requester (`execute(petId, now)`), así que la decisión es estructural, no un
`if`.

**Residuo aceptado** (riesgo 10 de la exploración): un `family` en otra
zona ve en la Home el día del owner y en Salud el de su dispositivo; en el
borde de medianoche de una de las dos zonas pueden discrepar unas horas.
Es el mismo residuo que #10 aceptó para trips/activity y no hay forma de
cerrarlo sin (b), descartada en D3.

**Qué owner**: el primer `pet_users` con `role = 'owner'` y `status =
'active'` por `created_at asc` (`limit 1`), igual que
`activity.drizzle.store.ts:218-230`. Hoy solo hay un owner por mascota
(`createWithOwner`, `pet.repository.ts:32`); el `orderBy` fija el
comportamiento si algún día hay más.

### D3 — Solo backend; (a), (b) y (d) descartadas por escrito (R6)

Cero archivos bajo `mobile-pet-tracker/`: #87 reescribe Home y Salud en
otro worktree (acuerdo con la sesión Frontend, 2026-09-10) y el contrato
del perfil no cambia de forma. Descartes:

- **(a) `gte` contra el día UTC del servidor**: cierra AC1 solo cuando día
  local = día UTC; en offset negativo la Home pierde la vacuna de hoy a las
  18:00-19:00 locales. No cumple AC2.
- **(b) `?today=YYYY-MM-DD` desde el dispositivo**: exigiría la mitad móvil
  (`mobile-pet-tracker/src/api/pets.ts:95` y su test de URL exacta) en el
  worktree de #87, y obliga a confiar en el reloj del cliente (o a acotarlo
  con otra decisión). Sin la mitad móvil degenera en (a).
- **(d) margen `hoy UTC - 1`**: en zonas positivas devuelve la vacuna de
  ayer local durante las primeras horas del día; la Home la pintaría
  "vencida" mientras Salud no la considera próxima: contradicción en el
  sentido opuesto. Rompe AC1.

### D4 — No aplica

No hay reloj de cliente en juego (D3 descartó (b)).

### D5 — `appliedAt <= hoy UTC` queda fuera, como deuda registrada

`vaccine.dto.ts:12-15` y `:29-32` validan `appliedAt` contra
`todayIsoDateUtc()` (`iso-date.ts:5-7`). Es el mismo sesgo, pero es
validación de **entrada** (400) y no de lectura, hoy solo la ejercitan la
API directa y los e2e (la app móvil no crea vacunas:
`mobile-pet-tracker/src/api/health-records.ts` solo hace `GET` de vacunas;
su único `postJson` es el de pesos). Se deja
fuera con su ruta en [[requirements]] §Fuera de alcance; el leader decide al
cerrar si abre id.

### D6 — Premisa de #70 que caduca; la Home no necesita cambio

Queda **obsoleta** la frase de
`specs/mobile-home-reminders-section/requirements.md:107-109`: «El filtro
del backend acota el rango de lo que puede llegar, pero **no** cierra el
caso: `gt(nextDoseAt, hoyUTC)` (`pet-vaccine.drizzle-reader.ts:27`)
garantiza que en el instante de la petición la fecha es futura en UTC», y
con ella `design.md:365-367` de la misma spec («El backend nunca devuelve
una vacuna vencida en el instante de la petición»). Tras #82 el backend
devuelve la dosis **de hoy** (día del owner), y una dosis que el dispositivo
ya considera de ayer (dispositivo por delante de la zona del owner) puede
llegar con contador negativo.

**No hace falta cambio móvil**: `dueCountdown`
(`mobile-pet-tracker/src/screens/home/index.tsx:110-127`) ya devuelve
`home.nextVaccineOverdue` si `days < 0` (`:114-117`) y
`home.nextVaccineToday` si `days === 0` (`:119-122`); el contador lo calcula
`calendarDaysUntil` por componentes de calendario, sin `new Date('YYYY-MM-DD')`
(`src/screens/home/format.ts:13-20`), así que `0` y negativos ya estaban
cubiertos por #70 R5/R7. Esta spec no edita los archivos de #70; el leader
anota la caducidad en `progress/` al cerrar.

### D7 — `after` → `from` en el puerto y su implementación (R3)

Con `gte`, `after` mentiría. Alcance verificado en `7f298f2` con `grep -rn
"findNextVaccine\|PetVaccineReader" src test`: el nombre del parámetro vive
en `pet-vaccine-reader.ts:10` y `pet-vaccine.drizzle-reader.ts:17` (y su uso
en `:27`). `get-pet.use-case.ts:71-74` y `get-pet.use-case.spec.ts:191`
lo usan **posicionalmente**, no por nombre: el rename no los toca. Dos
archivos, dentro del límite que fijó el leader; ningún test propio del
nombre (el lector Drizzle se cubre en e2e, `docs/conventions.md:148-149`).

### D8 — Frontera de módulos: `PetRepository.findOwnerTimezone` cruda + resolución en el use case (R1, R2)

Sin importar `ACTIVITY_STORE` (vive en `activity/`, y `ActivityModule`
importa `PetsModule` — `activity.module.ts:32` — así que el sentido inverso
sería un ciclo). Opciones consideradas:

| Opción | Archivos nuevos | Duplica IANA-con-fallback | Testabilidad del `warn` |
|---|---|---|---|
| **X1 (elegida)**: método `findOwnerTimezone(petId): Promise<string \| null>` en el puerto **existente** `PetRepository` (`pet.repository.ts:26-61`), implementado en `PetDrizzleRepository` (`pet.drizzle.repository.ts`, que ya consulta `pet_users` en `:66-101`), devolviendo la columna cruda; el use case resuelve con `isSupportedTimeZone` y avisa | 0 | no: la lógica IANA es `isSupportedTimeZone` (compartida); el ternario + `warn` son 6 líneas de pegamento | unitaria (spy sobre `Logger.prototype.warn`) |
| X2: puerto nuevo `pets/domain/ports/pet-owner-timezone-reader.ts` + lector Drizzle + provider en `PetsModule` | 2 | igual que X1 | unitaria |
| Y: read-module en `activity/` que exporte `ActivityDrizzleStore` bajo un token nuevo | 1 + interface | no | solo e2e (el `warn` está en el store) |
| Z: extraer `findOwnerTimezone`/`resolveTimeZone` a un sitio compartido y hacer que el store de #10 lo use | 1-2 + tocar el store de #10 y sus 4 specs | no | unitaria |

X1 es lo mínimo: `pet_users` es la tabla del propio módulo `pets`
(`src/db/schema/pets.schema.ts:65-89`) y el repositorio ya maneja
membresías (`createWithOwner`, `findMembership`); no hay implementación en
otro módulo que justifique un `*ReadModule` (ese patrón existe para
`devices`/`media`/`health`, cuyas implementaciones viven fuera de `pets`).
Los diez specs que mockean `PetRepository` lo hacen con `as unknown as
PetRepository` (grep en `7f298f2`), así que añadir un método no rompe
ninguno. `users.timezone` se lee del schema compartido
`src/db/schema/users.schema.ts` (infraestructura, `docs/architecture.md:34-37`),
igual que ya hace el store de #10.

La resolución (zona válida → esa; nula o no IANA → `'UTC'` + un
`Logger.warn({ scope: 'get-pet', petId, timezone, message })`) va en
`GetPetUseCase`: es la capa que decide el día, `Logger` ya se usa en casos
de uso (`get-last-position.use-case.ts:1,21`,
`aggregate-daily-activity.use-case.ts`) y `@/pipeline/local-day` ya se
importa desde application (`list-trips.use-case.ts`). Z (compartir el
pegamento con #10) se descarta: cambia un store ajeno y sus tests para
ahorrar seis líneas.

### D9 — Reloj inyectado: `execute(petId, now)` y un solo `new Date()` por request (R1)

Convención del repo: «`nowMs` llega siempre del caller — nunca `Date.now()`»
(`src/pipeline/geofence-eval.ts:98`), `ListTripsUseCase.tripsOfDay(input,
now)`, `GetDailyActivityUseCase`. El controller ya crea un `new Date()` en
`pets.controller.ts:97` para `toPetProfileResponse`; hoy hay dos relojes por
request (`:97` y `get-pet.use-case.ts:73`). Se iza un `const now = new
Date()` al inicio del `try` de `detail` (`:87`) y se pasa a ambos. Coste:
`pets.controller.spec.ts:204` pasa a `expect.any(Date)` y las seis llamadas
`execute(PET_ID)` de `get-pet.use-case.spec.ts` (R8, R9, R12, R6, R7 de #5,
#6, #7) pasan un `NOW` fijo — nombre y aserciones intactos. Descartado:
`now` opcional con default `new Date()` (deja el reloj oculto que la
convención prohíbe) y seguir con `jest.useFakeTimers` (funciona, pero
mantiene dos relojes por request).

### D10 — Determinismo del e2e sin fake timers en el servidor (R3, R4, R7)

`localDayOf` se evalúa en el test y en el servidor **en el mismo proceso**
(la app se levanta con `Test.createTestingModule`,
`health-vaccines.e2e-spec.ts:82-92`), sobre la misma zona y con
milisegundos de diferencia: `today` calculado una vez antes de sembrar
coincide con el `hoy` del servidor salvo que la medianoche de esa zona
caiga entre ambos (misma ventana que #14 R13 acepta con `dateOffset`).

El **par** `Pacific/Kiritimati` (UTC+14) y `Pacific/Pago_Pago` (UTC-11) —
ambas en `Intl.supportedValuesOf('timeZone')` del Node v20.20.2 del VPS
(verificado 2026-09-10; T0 de [[tasks]] lo repite con el Node de `init.sh`,
`local-day.ts:2-3` cita v24) y ninguna con horario de verano — distan 25 h.
Con `D` = día UTC y `h` = hora UTC:

| `h` | día en Kiritimati | día en Pago_Pago | ¿alguna ≠ `D`? | ¿Kiritimati ≠ Pago_Pago? |
|---|---|---|---|---|
| 00-09 | `D` | `D-1` | sí (Pago_Pago) | sí |
| 10 | `D+1` | `D-1` | sí (ambas) | sí |
| 11-23 | `D+1` | `D` | sí (Kiritimati) | sí |

Consecuencias que el par garantiza **a cualquier hora del VPS**:

- Una implementación con día **UTC** (mutación M2, o un use case que ignore
  la zona) devuelve para la zona que difiere de `D` la dosis `'Ayer'`
  (Kiritimati por delante: sembró `ayer = D`) o `'Manana'` (Pago_Pago por
  detrás: sembró `manana = D`) en vez de `'Hoy'` → R3 rojo.
- Una implementación con la zona del **requester** (R4) devuelve `'Ayer'`
  para el family de Pago_Pago mirando la mascota de Kiritimati, en las tres
  franjas → R4 rojo.
- `gt` (mutación M1) devuelve `'Manana'` en las dos zonas → R3 rojo.

Una sola zona no daría estas garantías (coincidiría con UTC parte del día).
No se usan fake timers en el servidor ni `TZ` en el runner (`package.json`,
`test/jest-e2e.json` no lo fijan; no se añade).

### D11 — Plan de commits (CHECKPOINTS C4)

Siete commits en `feature/82-vaccine-due-today-inclusive`, rojo → verde por
bloque, con el R-id en el mensaje (`docs/conventions.md:159-170`):

1. `test(vaccine-due-today-inclusive): use case resolves the owner local day from the caller clock (R1)` — rojo por aserción (unitario reescrito + `pets.controller.spec.ts:204`).
2. `feat(vaccine-due-today-inclusive): resolve next vaccine from the owner local day (R1)` — verde: puerto, implementación Drizzle, use case, controller. Lo **mínimo** para R1: sin validación IANA ni `warn` (eso es R2); el nulo solo necesita no romper el tipo.
3. `test(vaccine-due-today-inclusive): null or non-IANA owner timezone falls back to UTC with warn (R2)` — rojo.
4. `feat(vaccine-due-today-inclusive): fall back to UTC with warn on invalid owner timezone (R2)` — verde.
5. `test(vaccine-due-today-inclusive): e2e dose due today in the owner zone, family and non-IANA owner (R3,R4,R5)` — rojo por aserción (`'Manana'`) en los tres `it`; `seedUser` gana el parámetro.
6. `feat(vaccine-due-today-inclusive): include the dose due today and rename the port param to from (R3,R4,R5)` — verde: `gte` + `from`.
7. `docs(vaccine-due-today-inclusive): mutation evidence, regression sweep and traceability (R6,R7)` — reporte, trazabilidad; las mutaciones de R7 **no** se versionan.

Entre el commit 2 y el 6 el árbol es coherente (día del owner con `gt`):
#14 R13 sigue verde porque `seedUser` fija `'UTC'` y no siembra día 0.

## Archivos afectados

Exactamente estos nueve bajo `backend-pet-tracker/` (R6-d los verifica con
`git diff --name-only 7f298f2...HEAD -- backend-pet-tracker/`):

1. `src/modules/pets/domain/repositories/pet.repository.ts` — domain: método
   `findOwnerTimezone(petId: string): Promise<string | null>` en la
   interface, con doc de una línea (primer owner activo por `created_at`,
   columna cruda, `null` sin owner).
2. `src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts` —
   infrastructure: implementación con la misma consulta que
   `activity.drizzle.store.ts:218-230` (`petUsers` inner join `users`,
   `role = 'owner'`, `status = 'active'`, `orderBy(asc(petUsers.createdAt))`,
   `limit(1)`); importa `asc` de `drizzle-orm` (`:2`) y `users` de
   `@/db/schema/users.schema`.
3. `src/modules/pets/application/use-cases/get-pet.use-case.ts` — application:
   `execute(petId: string, now: Date)`; `findOwnerTimezone` → resolución
   (`isSupportedTimeZone`, fallback `'UTC'`, `Logger.warn` una vez) →
   `localDayOf(now.getTime(), zona)` → `findNextVaccine(petId, día)`. Imports
   de `@/pipeline/local-day` y `Logger` de `@nestjs/common`. Actualizar el
   doc-comment de la clase (`:31-38`) con una línea sobre #82.
4. `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts` — test:
   `buildDeps` (`:34-56`) añade `findOwnerTimezone` al mock de `pets`; `NOW`
   fijo; describe R13 de #14 (`:173-199`) reescrito como R1; describe R2
   nuevo.
5. `src/modules/pets/infrastructure/pets.controller.ts` — infrastructure:
   `detail` (`:82-105`) iza `const now = new Date()` y lo pasa a
   `this.getPet.execute(petId, now)` y a `toPetProfileResponse(..., now, ...)`.
6. `src/modules/pets/infrastructure/pets.controller.spec.ts` — test: línea
   204, `expect.any(Date)`.
7. `src/modules/pets/domain/ports/pet-vaccine-reader.ts` — domain: `after` →
   `from` (`:10`) con doc «primer día incluido».
8. `src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts` —
   infrastructure: `gt` → `gte` (`:2`, `:27`), `after` → `from` (`:17`).
9. `test/health-vaccines.e2e-spec.ts` — test: `seedUser(label, timezone =
   'UTC')` (`:36-52`), import de `localDayOf`/`shiftDay`, describe R3-R5.

Fuera de `backend-pet-tracker/`: `../specs/vaccine-due-today-inclusive/traceability.md`
(Codex rellena), `../progress/impl_vaccine-due-today-inclusive.md` (reporte
con secciones `## Mutación (R7)` y `## Regresión (R6)`),
`../feature_list.json` (solo `status` de #82; lo mueve el leader).

## Alternativas descartadas

- **`CURRENT_DATE` de SQL** en el lector: mismo día UTC que hoy, rompe la
  convención de reloj inyectado y el unitario. D9.
- **Zona del requester** vía `USER_REPOSITORY.findById(request.user.id)`
  (`auth.module.ts` lo exporta): dos miembros verían dos perfiles distintos
  de la misma mascota. D2.
- **Puerto nuevo + `*ReadModule`** (X2), **read-module sobre
  `ActivityDrizzleStore`** (Y), **extraer a compartido** (Z): D8.
- **Fallback en el repositorio Drizzle** (como #10): deja el `warn` solo
  verificable en e2e; en el use case es un spy. D8.
- **`now` opcional / fake timers**: D9.
- **Una sola zona en el e2e** o **fake timers en el servidor**: D10.
- **Un cuarto `it` "solo ayer → null"**: redundante — con `orderBy asc` y
  `limit 1`, si ayer entrara en el filtro sería la devuelta en R3.
- **Commit rojo por mutación versionada** para R7: hay rojos reales
  (commits 1, 3, 5); R7 es un candado adicional sobre la zona ciega del
  unitario, no un sustituto, y va sin versionar (C4 vía (b)).
