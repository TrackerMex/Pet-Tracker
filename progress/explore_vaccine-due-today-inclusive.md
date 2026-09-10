# explore: vaccine-due-today-inclusive
Fecha: 2026-09-10

Feature #82 (`pending`, P3). Worktree `/home/claude/sites/Pet-Tracker-wt-backend`,
branch `feature/82-vaccine-due-today-inclusive` @ a7fdaac (base `origin/main`
7f298f2). Solo lectura; no se ejecutó `init.sh`, e2e ni nada contra Postgres.
`graphify-out/graph.json` no existe en este worktree (sin grafo; todo por
lectura directa). Toda ruta es relativa a la raíz del repo y **cada hecho
está verificado contra el árbol** en la línea citada.

---

## 1. Hechos: backend

### 1.1 El lector y su "hoy"

- `backend-pet-tracker/src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts:15-33`:
  `findNextVaccine(petId, after: string)` hace
  `select id,name,nextDoseAt from pet_vaccines where pet_id = $petId AND
  next_dose_at > $after order by next_dose_at asc limit 1`. El operador es
  `gt` (`:2` importa `{ and, asc, eq, gt }`; `:27` lo aplica). **El lector no
  calcula "hoy": lo recibe** como string `after`.
- Quien calcula "hoy" es el caso de uso:
  `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.ts:71-74`
  → `this.vaccineReader.findNextVaccine(petId, new Date().toISOString().slice(0, 10))`.
  Es el **día civil UTC del reloj del servidor Node**, no `CURRENT_DATE` ni
  `now()` de SQL. No hay ningún `CURRENT_DATE` en `backend-pet-tracker/src`
  (grep vacío).
- Puerto: `backend-pet-tracker/src/modules/pets/domain/ports/pet-vaccine-reader.ts:9-11`
  `findNextVaccine(petId: string, after: string): Promise<NextPetVaccine | null>`;
  `NextPetVaccine = { id, name, nextDoseAt: string }` (`:3-7`). El nombre del
  parámetro (`after`) codifica la semántica "estrictamente posterior".
- Cableado: `backend-pet-tracker/src/modules/health/pet-vaccine-read.module.ts:5-9`
  provee `PET_VACCINE_READER → PetVaccineDrizzleReader`; `PetsModule` lo
  importa (`backend-pet-tracker/src/modules/pets/pets.module.ts:24`).

### 1.2 Tipo de la columna: día civil, sin hora ni zona

- `backend-pet-tracker/src/db/schema/health.schema.ts:48-49`:
  `appliedAt: date('applied_at').notNull()`, `nextDoseAt: date('next_dose_at')`.
  Es `date` de Postgres (sin hora, sin tz); en Drizzle `date()` sin
  `{ mode: 'date' }` viaja como **string `YYYY-MM-DD`** (lo confirma el e2e,
  que compara `nextDoseAt` contra `dateOffset(1)` string:
  `backend-pet-tracker/test/health-vaccines.e2e-spec.ts:549-553`).
- `docs/data-model.md:59` documenta lo mismo: `next_dose_at date NULL`.
- Conclusión: **`nextDoseAt` es un día civil, no un instante.** La única
  ambigüedad es "en qué zona se decide qué día es hoy", no "qué día es la dosis".

### 1.3 Cómo entra la fecha (POST/PATCH)

- `backend-pet-tracker/src/modules/health/application/dto/vaccine.dto.ts:12-16,29-33`:
  `appliedAt` y `nextDoseAt` pasan por `IsoDateSchema` (`^\d{4}-\d{2}-\d{2}$`,
  `backend-pet-tracker/src/modules/health/application/dto/iso-date.ts:3,9-15`).
  Solo `YYYY-MM-DD`; un ISO con hora es 400.
- `appliedAt` se valida `<= todayIsoDateUtc()` (`vaccine.dto.ts:13,30`;
  `iso-date.ts:5-7` = `new Date().toISOString().slice(0, 10)`). **Segundo
  sitio del mismo módulo que usa el hoy UTC del servidor.** Si #82 mueve el
  "hoy" del lector a otra zona, este `<= hoy UTC` queda inconsistente (una
  vacuna aplicada "hoy" a las 20:00 en UTC-6 ya es "mañana" en UTC → 400
  "Applied date cannot be in the future"). Está fuera del enunciado de #82
  pero es el mismo defecto; la spec debe decir si lo toca o lo deja (D5).
- **La app móvil no crea vacunas.** `mobile-pet-tracker/src/api/health-records.ts`
  solo tiene `GET /pets/:id/vaccines` (`:43-46`); su único `postJson` es
  `/pets/:id/weights` (`:121-124`). No hay pantalla ni función `createVaccine`
  en `mobile-pet-tracker/src` (grep vacío). Hoy las vacunas entran por API
  directa / e2e.

### 1.4 Consumidores de `nextVaccine`

- Solo **GET /v1/pets/:petId** (detalle): `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts:82-101`
  → `GetPetUseCase.execute(petId)` → `toPetProfileResponse(..., nextVaccine)`.
- **GET /v1/pets** (listado, #66) devuelve `nextVaccine: null` siempre:
  `pets.controller.ts:70-79` llama `toPetProfileResponse(pet, role, now, null, photoUrl)`
  (sexto arg omitido → default `null`, `pet-profile-response.mapper.ts:59`).
  Candado: `backend-pet-tracker/src/modules/pets/application/use-cases/list-pets.use-case.spec.ts:200`
  asserta que el fuente de `ListPetsUseCase` **no contiene** `PET_VACCINE_READER`;
  `specs/pets-list-response-enrichment/requirements.md:194,212,296` lo fija por
  escrito ("device y nextVaccine en el listado siguen null").
- `nextReminder` es un `null` literal en el mapper
  (`pet-profile-response.mapper.ts:45,84`); no hay lector de "próximo
  recordatorio" en el perfil. No hay un segundo lector con patrón `gt(hoy)`.
- Reminders sí tienen fecha, pero es otro tipo: `reminders.dueAt` es
  `timestamp with time zone` (`backend-pet-tracker/src/db/schema/reminders.schema.ts:23`),
  o sea un **instante**; `findDue(now)` compara
  `dueAt - advance <= now` (`reminder.drizzle.repository.ts:76-89`). No
  aplica el mismo dilema de día civil.

### 1.5 Contrato del perfil (congelado)

- 24 claves, lista cerrada en `backend-pet-tracker/test/pets.e2e-spec.ts:63-88`
  (`PROFILE_KEYS`), replicada en `test/pet-lost-mode.e2e-spec.ts:49`,
  `test/devices.e2e-spec.ts:813`, `test/device-subscriptions.e2e-spec.ts:347`,
  `pets.controller.spec.ts:184`, `pet-profile-response.mapper.spec.ts:58`.
- La forma de `nextVaccine` (`{id,name,nextDoseAt}`) la fija #14 R13
  (`specs/health-vaccines/requirements.md:93-97`) y el e2e
  `health-vaccines.e2e-spec.ts:549-553`.
- **Cambiar el operador o la zona no toca el contrato de respuesta**: ni
  claves ni forma. Añadir un query param opcional a la request (opción b)
  tampoco cambia la respuesta, pero sí el contrato de entrada.

### 1.6 Tests que cubren el lector hoy

- Unitario: `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.spec.ts:174-197`
  — `jest.useFakeTimers({ now: '2026-08-09T12:00:00.000Z' })` y asserta
  `findNextVaccine` llamado con `(PET_ID, '2026-08-09')`. **Este test fija el
  segundo argumento como día UTC.** Cualquier opción que cambie qué se pasa
  (zona del owner, otro nombre/forma del parámetro) lo pone rojo; la opción
  (a) sola (`gte` en el lector) lo deja verde.
- e2e: `backend-pet-tracker/test/health-vaccines.e2e-spec.ts:510-556` (R13)
  siembra `nextDoseAt` en `dateOffset(-1)`, `dateOffset(1)`, `dateOffset(2)`
  y espera la de `+1`. **No siembra día 0**; con `gte` sigue verde. El resto
  de fixtures de `petVaccines` en ese archivo (`:165-172`, `:207-213`,
  `:364-385`) no llevan `nextDoseAt`. Ningún otro e2e inserta en
  `petVaccines` (grep sobre `backend-pet-tracker/test`).
- `dateOffset` (`health-vaccines.e2e-spec.ts:33-34`) =
  `new Date(Date.now() + days*86_400_000).toISOString().slice(0, 10)`: **día
  UTC**, igual que el servidor. El e2e de frontera de AC3 (hoy/ayer/mañana)
  con `dateOffset(0)` es determinista bajo UTC salvo la ventana de milisegundos
  en que el test cruza la medianoche UTC entre sembrar y pedir.
- `seedUser` de ese e2e persiste `timezone: 'UTC'` (`:47`). Para probar una
  zona distinta hay precedente parametrizado:
  `backend-pet-tracker/test/activity.e2e-spec.ts:114-130` (`seedUser(label, timezone)`).
- No hay test unitario del repositorio Drizzle (convención:
  `docs/conventions.md:148-149`, repos Drizzle se cubren en e2e).
- `pets.e2e-spec.ts:358` espera `nextVaccine: null` en una mascota sin
  vacunas: no le afecta.
- `TZ` no está fijado en ningún runner (`package.json`, `test/jest-e2e.json`;
  grep vacío). `docker-compose.yml:6` (`postgres:17-alpine`) no define `TZ`
  ni `PGTZ`; la zona de sesión de Postgres es la del contenedor (no
  verificado en caliente, y hoy irrelevante porque nada usa `CURRENT_DATE`).

### 1.7 Pista de zona horaria del cliente: existe en `users.timezone`, no en la request

- **Columna**: `backend-pet-tracker/src/db/schema/users.schema.ts:21`
  `timezone: varchar('timezone', { length: 64 }).notNull().default('UTC')`.
- **Se rellena en el registro desde el dispositivo**:
  `mobile-pet-tracker/src/app/(auth)/register.tsx:64-70` toma
  `Intl.DateTimeFormat().resolvedOptions().timeZone` y lo manda en el body
  (`:102`). El DTO **no valida IANA** al registrar
  (`backend-pet-tracker/src/modules/auth/application/dto/register-user.dto.ts:24`:
  `z.string().trim().min(1).max(64).optional()`); `'UTC'` si falta
  (`register-user.use-case.ts:55`).
- **PATCH de perfil sí valida IANA**:
  `backend-pet-tracker/src/modules/users/application/dto/update-profile.dto.ts:8-11,26`
  (`Intl.supportedValuesOf('timeZone')`).
- **Nada llega en cada request**: `mobile-pet-tracker/src/api/http.ts:17,39,64`
  solo manda `Authorization: Bearer`; no hay `x-timezone`, `Accept-Language`,
  `?today=` ni `?tz=` en móvil ni backend (grep vacío en ambos). El JWT/`request.user`
  solo trae `{ id, email }`
  (`backend-pet-tracker/src/modules/auth/infrastructure/decorators/current-user.decorator.ts:4-7`).
  `PetAccessGuard` adjunta `{ petId, role }` (`pet-access.guard.ts:20-23,76`).
- `expo-localization` **no está instalado** (grep vacío en
  `mobile-pet-tracker/package.json` y `src`); el móvil usa `Intl` nativo.

### 1.8 Patrón ya existente para "hoy en la zona del owner" (módulo activity, #10)

- `backend-pet-tracker/src/pipeline/local-day.ts:53-61`: `isSupportedTimeZone(tz)`
  y `localDayOf(tsMs, timeZone): 'YYYY-MM-DD'` (cacheado por `Intl.DateTimeFormat`);
  lanza `InvalidTimeZoneError` si la zona no está en el catálogo (`:184-187`).
  El catálogo añade `'UTC'` a mano porque `Intl.supportedValuesOf` no lo trae
  (`:32-39`). Propiedad verificada por `local-day.spec.ts:88-101` sobre todas
  las zonas.
- Resolución del owner con fallback:
  `backend-pet-tracker/src/modules/activity/infrastructure/repositories/activity.drizzle.store.ts:217-252`
  `findOwnerTimezone(petId)` = join `pet_users` (role owner, status active,
  `created_at asc limit 1`) × `users.timezone`, y `resolveTimeZone` degrada a
  `'UTC'` con `logger.warn` si es nula o no IANA (R13 de #10).
- Uso: `list-trips.use-case.ts:96-99` y `get-daily-activity.use-case.ts:73-74`
  → `localDayOf(now.getTime(), timeZone)`. Justificación escrita de **owner,
  no requester ni UTC**: `list-trips.use-case.ts:39-43` ("si no, un `family`
  en otra zona vería otro día y las filas persistidas dejarían de casar").
  Ojo: ese argumento se apoya en filas **persistidas** por día; aquí no se
  persiste nada, así que la spec debe rejustificarlo (D2).
- Convención de inyectar el reloj desde el caller (testabilidad):
  `backend-pet-tracker/src/pipeline/geofence-eval.ts:98` ("`nowMs` llega
  siempre del caller — nunca Date.now()"); `ListTripsUseCase.tripsOfDay(input, now)`.
  `GetPetUseCase.execute(petId)` **no recibe `now`**: lo crea dentro (`:73`),
  y el unitario lo controla con fake timers.
- **Frontera de módulos**: `ACTIVITY_STORE` vive en `activity/`; `PetsModule`
  no lo importa (`pets.module.ts:24`). El patrón del repo para que `pets`
  lea datos de otro módulo es un puerto en `pets/domain/ports/` implementado
  fuera y expuesto por un `*ReadModule`
  (`pet-device-reader.ts`, `pet-photo-url-resolver.ts`, `pet-vaccine-reader.ts`;
  `health/pet-vaccine-read.module.ts`). `AuthModule` exporta `USER_REPOSITORY`
  (`auth.module.ts:104`) con `findById(id): Promise<User>` y `User.timezone`
  (`user.repository.ts:43`, `user.entity.ts:27`) — sirve para la zona del
  **requester**, no del owner.

---

## 2. Hechos: móvil

### 2.1 Salud (no existe `src/screens/health/`)

- La pestaña Salud sigue siendo un route "gordo" pre-#39:
  `mobile-pet-tracker/src/app/(tabs)/health.tsx` (`src/screens/` tiene
  add-pet, add-reminder, docs, home, pairing, profile, reminders,
  reset-password; no `health`).
- Calcula hoy **en local del dispositivo** con getters locales:
  `health.tsx:28-33` `localTodayIso()` = `getFullYear/getMonth/getDate` del
  `new Date()`. Duplicado byte a byte en `src/app/(tabs)/weight-log.tsx:38`.
  No es una util compartida.
- Decide la "próxima" **en cliente sobre la lista completa**
  (`GET /pets/:id/vaccines`): `health.tsx:69-78` filtra
  `nextDoseAt !== null && nextDoseAt >= today` (**inclusivo**, comparación
  de strings `YYYY-MM-DD`) y ordena por `localeCompare`. Marca en rojo las
  `nextDoseAt < today` (`:198-206`). **No usa `pet.nextVaccine` del perfil.**

### 2.2 Home (#70/#85)

- Toma `nextVaccine` del **perfil**: `mobile-pet-tracker/src/screens/home/index.tsx:194-199`
  `detail.data.pet.nextVaccine` → `calendarDaysUntil(nextVaccine.nextDoseAt, new Date())`.
  `detail` es `GET /pets/:id` (`mobile-pet-tracker/src/api/pets.ts:95`).
- `calendarDaysUntil` (`mobile-pet-tracker/src/screens/home/format.ts:13-20`)
  parte `YYYY-MM-DD` por componentes y compara `Date.UTC(y,m,d)` del objetivo
  contra `Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())`: **día
  civil local del dispositivo**, sin `new Date('YYYY-MM-DD')` (candados de
  #70 R5/D5/D7, `specs/mobile-home-reminders-section/traceability.md:25`).
- La Home **ya sabe pintar "hoy" y "vencida"**: `index.tsx:110-122`
  `dueCountdown` devuelve `home.nextVaccineOverdue` si `days < 0` y
  `home.nextVaccineToday` si `days === 0`. Es decir: si el backend
  devolviera la vacuna de hoy, la Home la mostraría bien sin cambio móvil.
- `fmtDate` (`format.ts:36-44`) también construye por componentes.
- `mobile-pet-tracker/src/utils/reminder-dates.ts:15-17` (`daysUntil` con
  `Math.ceil` sobre ms) es el defecto de **#84**, no de #82; no lo usa la
  vacuna.
- Formato que llega del backend: `YYYY-MM-DD` (§1.2). Tipos móviles:
  `mobile-pet-tracker/src/api/types.ts:55` (`NextPetVaccine.nextDoseAt: string`)
  y `:151` (`Vaccine.nextDoseAt: string | null`).

### 2.3 Resumen de la contradicción (verificada)

| Pantalla | Fuente | Criterio | "hoy" |
|---|---|---|---|
| Salud | lista de vacunas, filtro en cliente (`health.tsx:74`) | `>=` | local del dispositivo |
| Home | `pet.nextVaccine` del perfil (`get-pet.use-case.ts:73` + `reader:27`) | `>` | UTC del servidor |

Dos discrepancias independientes: **operador** (el día de la dosis) y
**zona** (en offset negativo la vacuna sale de la Home a las 18:00-19:00
locales, según horario de verano; en offset positivo entra tarde a la Home
la vacuna de "mañana", que Salud tampoco marca como próxima hasta local).

---

## 3. Qué dicen las specs anteriores (por escrito)

- `specs/health-vaccines/requirements.md:93-97` (#14 R13): "la vacuna con el
  menor `next_dose_at` **posterior** a la fecha actual". "Posterior" =
  estricto; es el requisito que #82 enmienda. No dice zona. `design.md` de
  #14 no fija más (`:30,41` solo hablan de ensanchar `null` a objeto).
- `specs/mobile-home-reminders-section/requirements.md:889-896` (**E1**) y
  `design.md:362-378`: describen exactamente el defecto (gt + UTC), lo
  declaran cambio de backend con id propio y **no lo tocan**; R7 de #70 solo
  evita pintar `-3 d`. `requirements.md:103-109` justifica que la Home no
  reciba vencidas precisamente porque el backend filtra `gt` UTC: si #82 pasa
  a `gte` en zona local, esa premisa de #70 queda obsoleta (D6).
- `specs/mobile-home-reminders-real-data/requirements.md:98-109` (#85 D-I):
  los recordatorios se filtran inclusivo en local del dispositivo; la vacuna
  llega "estrictamente posterior" del backend; alinear #85 al `gt` UTC se
  descartó por escrito "para no propagar el bug a la mitad sana". `:1021-1022`
  lo remite a #82.
- `specs/pets-list-response-enrichment/requirements.md:194,212,296`: el
  listado no lee vacunas (candado de fuente en `list-pets.use-case.spec.ts:200`).
  #82 no debe tocar `ListPetsUseCase`.
- `feature_list.json` #84 (`reminder-dates-days-until-drift`, pending) es el
  hermano móvil (E3 de #70); no se solapa en archivos.

---

## 4. Opciones (coste real en este árbol; sin decidir)

Todas comparten el primer paso: `gt → gte` en `pet-vaccine.drizzle-reader.ts:27`
(+ import `:2`) y renombrar/aclarar `after` en el puerto (`pet-vaccine-reader.ts:10`),
porque con `gte` el nombre miente. Solo (a) se queda ahí.

**(a) `gte` contra el día UTC del servidor (statu quo de zona).**
- Toca: `pet-vaccine.drizzle-reader.ts` (1 línea + import), opcionalmente
  el nombre del parámetro en `pet-vaccine-reader.ts` y `get-pet.use-case.ts`.
- Tests: `get-pet.use-case.spec.ts:174-197` verde (sigue pasando el día UTC);
  e2e R13 verde (no siembra día 0). Nuevo e2e AC3 con `dateOffset(0)` es
  determinista bajo UTC.
- Contrato: intacto.
- Cierra AC1 (Salud y Home coinciden *cuando el día local == día UTC*) pero
  **no AC2**: en offset negativo la Home pierde la vacuna de hoy a las
  18:00-19:00 locales; en positivo la muestra desde las 06:00-10:00 del día
  anterior local (como "hoy" no; como "1 d"). La spec tendría que justificar
  por escrito por qué se acepta.
- Nota: usar `CURRENT_DATE` de SQL en vez del string del caller sería el
  mismo resultado en UTC pero rompería la convención de reloj inyectado
  (§1.8) y el unitario con fake timers.

**(b) El cliente manda su día civil (`?today=YYYY-MM-DD` o header), fallback UTC.**
- Toca backend: `pets.controller.ts:82-101` (leer y validar el param con
  `IsoDateSchema` de `iso-date.ts`, rechazar 400 si inválido),
  `get-pet.use-case.ts:52,71-74` (firma `execute(petId, today?)`),
  `get-pet.use-case.spec.ts` (nuevos casos), un e2e nuevo. Contrato de
  **respuesta** intacto; contrato de **request** gana un param opcional.
- Toca móvil (otro worktree, otra feature o esta con dos mitades):
  `mobile-pet-tracker/src/api/pets.ts:95` (`getPet` con `?today=`) y sus
  tests (`src/api/__tests__/pets.test.ts:5` fija la URL exacta
  `.../v1/pets/pet-1`); la Home ya calcula el día local por componentes
  (`format.ts:16`) pero no hay una `localTodayIso` compartida (está duplicada
  en `health.tsx:28` y `weight-log.tsx:38`).
- Ventaja única: Salud y Home usan **el mismo reloj** (el del dispositivo),
  así que coinciden siempre, incluso viajando o con `users.timezone` mal
  registrada. Riesgo: reloj del dispositivo adelantado/atrasado manda; hay
  que decidir si se acota (p.ej. ±1 día del UTC del servidor) o se confía.
- Sin el cambio móvil, el backend queda en (a) por el fallback.

**(c) Zona persistida del owner (`users.timezone`) → `localDayOf(now, tz)`.**
- Toca: nuevo puerto en `pets/domain/ports/` (p.ej. lector de zona del owner)
  + implementación Drizzle (copiar `findOwnerTimezone`/`resolveTimeZone` de
  `activity.drizzle.store.ts:217-252`, o extraer una función compartida en
  `src/pipeline/` o un módulo `users`-read; decisión de capa para la spec),
  + `*ReadModule` importado en `pets.module.ts:24`, + `get-pet.use-case.ts:71-74`
  (`localDayOf(Date.now(), tz)` de `src/pipeline/local-day.ts:58`), +
  `get-pet.use-case.spec.ts:174-197` (cambia el mock/deps y el valor
  esperado del día), + `health-vaccines.e2e-spec.ts` (nuevo `describe` con
  `seedUser` de zona no-UTC; hoy `seedUser` fija `'UTC'` en `:47`).
- Cero cambio móvil; cero cambio de contrato.
- Fallback obligatorio a `'UTC'` con warn cuando `users.timezone` no es IANA
  (el registro no valida, §1.7); reutilizar `isSupportedTimeZone`.
- Requiere decidir **owner vs requester** (D2): el precedente #10 usa owner;
  `family` en otra zona verá el día del owner (coherente con activity), pero
  su pestaña Salud usará su propio dispositivo → pueden discrepar en el
  borde para no-owners. También: una sola query extra por GET de detalle.
- Determinismo del e2e "la zona importa" sin fake timers en el servidor:
  sembrar dos owners en zonas cuya suma de offsets supere 24 h (p.ej.
  `Pacific/Kiritimati` UTC+14 y `Pacific/Pago_Pago` UTC-11): a cualquier
  hora UTC, al menos una de las dos está en un día civil distinto del UTC,
  así que un `it` puede afirmar que **alguna** de las dos difiere. Verificar
  que ambas están en `Intl.supportedValuesOf('timeZone')` del Node del
  `init.sh` (el catálogo se itera en `local-day.spec.ts:88`). Es una idea,
  no un hecho comprobado.

**(d) `gte` con margen: comparar contra (día UTC − 1).**
- Toca: solo `get-pet.use-case.ts:73` (o el lector). Una línea.
- Tests: `get-pet.use-case.spec.ts:186` cambia el string esperado; e2e R13
  **se pone rojo** (siembra `dateOffset(-1)` = "Pasada" y con margen −1 la
  elegiría). Habría que reescribir la fixture.
- Efecto: en offset negativo cubre todo el día local (bien). En offset
  positivo devuelve la vacuna de **ayer local** durante las primeras horas
  del día → la Home pinta "vencida" (`dueCountdown` days<0) mientras Salud
  (`>= hoy local`) no la considera próxima → **contradicción en el otro
  sentido**. No cumple AC1 en zonas positivas ni AC2 en sentido estricto.

Coste relativo verificado (archivos tocados / tests rotos): (a) 1-3 / 0;
(d) 1 / 1 e2e reescrito; (b) 3-4 backend + 2 móvil / 1 unit + 1 test móvil;
(c) 5-6 backend / 1 unit + e2e nuevo.

---

## 5. Riesgos y ambigüedades

1. **`appliedAt <= hoy UTC`** en `vaccine.dto.ts:13,30` es el mismo sesgo en
   el mismo módulo; decidir si #82 lo alinea o lo deja (si lo deja, decirlo).
2. **`get-pet.use-case.spec.ts:186`** fija el día UTC como segundo argumento:
   es el candado que se rompe (a propósito) en (b)/(c)/(d) y el que hay que
   reescribir con el R-id nuevo, no borrar.
3. **E2E R13 existente** (`health-vaccines.e2e-spec.ts:520-543`) sobrevive a
   `gte` porque no siembra día 0; el AC3 pide sembrar hoy/ayer/mañana en el
   mismo `pet`, y con `gte` el esperado es "hoy". Ventana de flakiness: cruzar
   medianoche (UTC o de la zona elegida) entre `dateOffset` y la request —
   mitigable calculando el día una sola vez antes de sembrar, como ya hace
   `nextDate` (`:519`).
4. **`users.timezone` no validada en el registro** (`register-user.dto.ts:24`)
   y el móvil la manda desde `Intl` (`register.tsx:66`): en (c) el fallback a
   UTC es obligatorio, y una zona mal registrada reproduce silenciosamente
   el bug para ese usuario (solo warn en log).
5. **Premisa de #70 que caduca**: `specs/mobile-home-reminders-section/requirements.md:103-109`
   y `design.md:364-367` afirman que "el backend nunca devuelve una vencida"
   gracias al `gt` UTC. Con `gte` en local sigue siendo cierto en el
   instante de la petición; con (d) deja de serlo. La spec de #82 debe
   registrar qué premisa de #70 cambia.
6. **`ListPetsUseCase` no debe tocarse** (candado de fuente
   `list-pets.use-case.spec.ts:200`): la Home de varias mascotas sigue sin
   `nextVaccine` en el listado; no es alcance de #82.
7. **Sin seed de LocalStack para vacunas de mascota**:
   `backend-pet-tracker/scripts/seed-vaccines.ts:11` solo siembra el
   **catálogo** (`seedVaccineCatalog`), no filas de `pet_vaccines`. Ningún
   seed cambia de resultado con `gte`.
8. **Nomenclatura**: el parámetro `after` del puerto y del lector describe
   `gt`; dejarlo con `gte` es una mentira en la firma. Renombrar toca
   puerto, lector, use case y spec unitaria (los cuatro ya están en la lista
   de cualquier opción salvo (a) mínima).
9. **Frontera de módulos** para (c): `PetsModule` no puede importar
   `ACTIVITY_STORE`; hace falta un puerto propio o extraer la resolución de
   zona a `src/pipeline/` / un read-module de `users`. Es decisión de diseño
   de la spec (`docs/architecture.md`: puertos en `domain/ports`, adaptadores
   fuera).
10. **Home y Salud siguen usando fuentes distintas** (lista completa vs
    perfil). #82 solo puede hacer que coincidan si ambas comparten criterio
    y "hoy"; cualquier opción que no sea (b) deja un residuo (viajes,
    `family` en otra zona, reloj del dispositivo). La spec debe nombrar el
    residuo aceptado.

---

## 6. Decisiones abiertas (para el humano / spec_author)

- **D1 — Operador**: `gte` (la vacuna de hoy sigue siendo "próxima", como
  Salud) o alinear Salud a `gt`. Los tres criterios de aceptación y #85 D-I
  empujan a `gte`; sigue siendo decisión escrita.
- **D2 — Zona del "hoy"**: (a) UTC servidor, (b) día civil que manda el
  dispositivo, (c) `users.timezone` del **owner** (precedente #10) o del
  **requester** (`USER_REPOSITORY.findById(request.user.id)`), (d) margen.
  Si (c): owner o requester, y qué pasa con un `family` en otra zona.
- **D3 — Alcance móvil**: ¿#82 incluye la mitad móvil de (b) (`getPet` con
  `?today=`, otro worktree) o es solo backend con fallback? Si solo backend,
  (b) degenera en (a) hasta que exista la feature móvil.
- **D4 — Reloj del cliente en (b)**: ¿se confía en el `today` que manda el
  dispositivo o se acota (p.ej. dentro de ±1 día del UTC del servidor, 400
  fuera)?
- **D5 — `appliedAt <= hoy UTC`** (`vaccine.dto.ts:13,30`): ¿se alinea a la
  misma zona en esta feature o se abre id aparte?
- **D6 — Premisas de #70/#85 que cambian**: registrar en la spec qué frase
  de `mobile-home-reminders-section` (`requirements.md:103-109`) queda
  obsoleta y si la Home necesita algún ajuste (hoy `dueCountdown` ya cubre
  `0` y `<0`; con `gte` en local **no** hace falta cambio móvil).
- **D7 — Firma del puerto**: renombrar `after` (→ `from`/`today`/`notBefore`)
  en `pet-vaccine-reader.ts:10` o dejarlo y documentar.

---

## 7. Recomendación (sin implementar)

- Fijar `gte` (D1) — el criterio de aceptación 1 y #85 D-I ya lo asumen y la
  Home ya renderiza "hoy" (`index.tsx:119-122`).
- Para la zona, las dos opciones que cumplen AC2 sin justificar excepciones
  son (b) y (c). (c) es **solo backend, sin cambio de contrato ni de móvil**,
  reutiliza `localDayOf` + `isSupportedTimeZone` y el patrón owner de #10,
  y su e2e es determinista con la pareja de zonas de §4(c). (b) da
  coincidencia exacta con Salud pero exige la mitad móvil (otro worktree,
  #87 en curso) y una decisión sobre confiar en el reloj del cliente. (d)
  rompe AC1 en zonas positivas: descartar por escrito. (a) solo si el
  humano acepta justificar AC2 en negativo.
- Sea cual sea la zona: reescribir `get-pet.use-case.spec.ts:174-197` con el
  R-id nuevo (no borrarlo), añadir el `describe` de frontera hoy/ayer/mañana
  en `health-vaccines.e2e-spec.ts` calculando el día **una vez** antes de
  sembrar, renombrar `after`, y decidir D5 explícitamente aunque sea "fuera
  de alcance".
