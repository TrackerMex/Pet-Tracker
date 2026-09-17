# explore: mobile-owner-timezone-dates (#90)
Fecha: 2026-09-17
Árbol: worktree `Pet-Tracker-wt-backend`, branch `feature/90-mobile-owner-timezone-dates`, HEAD = base `origin/main` `29689598` (= merge de PR #139, #72). Todas las rutas son relativas a `mobile-pet-tracker/` salvo que se diga `backend-pet-tracker/`. Toda línea citada se verificó contra este árbol, no contra `feature_list.json`.

> **Hallazgo que cambia el problema (§3):** `POST /v1/pets/:petId/weights` lleva `@RequirePetRole('owner')` (`backend-pet-tracker/src/modules/health/infrastructure/weights.controller.ts:36`; e2e `test/health-weights.e2e-spec.ts:484-498`, `family` → 403). El único usuario que puede obtener un 201 en pesos **es el owner**, así que «zona del owner» y «zona del perfil del usuario logueado» coinciden en toda petición que pueda tener éxito. Y en el alta de mascota el backend valida `birthDate` contra la zona del **requester** (`create-pet.use-case.ts:34` → `requesterLocalDay`), que también es el perfil propio. La ambigüedad «mascota compartida» del enunciado no existe para ninguna de las dos pantallas; la opción (b) no hace falta.

---

## 1. Código actual

### 1.1 `weight-log.tsx` — `localTodayIso` y `measuredAt`

- `src/app/(tabs)/weight-log.tsx:39-44` — `localTodayIso()`: `new Date()` + `getFullYear/getMonth/getDate` del **dispositivo**, `YYYY-MM-DD`.
- Consumidores (los tres dentro de `WeightLogContent`):
  - `:62` `useState(localTodayIso)` — valor inicial del campo.
  - `:66-76` `useFocusEffect` cleanup (#63 R3) → `:70` `setMeasuredAt(localTodayIso())` al perder foco.
  - `:104` tras `case 'ok'` → `setMeasuredAt(localTodayIso())`.
- El mismo estado alimenta **la pantalla y el payload**: `:188` `value={measuredAt}` del `Input` `testID="weight-date-input"` (`:184-190`, `placeholder={t('weightLog.yyyyMmDd')}`, `onChangeText={setMeasuredAt}`, sin `keyboardType`, sin validación local: cualquier cadena se envía) y `:93-99` `createWeight(baseUrl, token, petId, { weightKg, measuredAt, bodyCondition? })`. No hay un «valor mostrado» distinto del «valor enviado»: cambiar el cálculo cambia los dos.
- Cliente HTTP: `src/api/health-records.ts:103-161` `createWeight` → `:114-120` body `{ weightKg, measuredAt, bodyCondition? }` → `:121-127` `postJson(baseUrl, '/pets/${petId}/weights')`.
- **Mapeo del 400**: `health-records.ts:132-141` → `{ kind: 'validation', errors: FieldError[] }` (lista vacía si el body no trae `errors[]`). `FieldError = { path: string; message: string }` (`src/api/types.ts:5-8`).
- **Qué ve el usuario**: `weight-log.tsx:108-110` `case 'validation': setFormError(result.errors.map(({ message }) => message).join('\n'))` → `:206-210` `<Text testID="weight-form-error" className="text-danger">`. El texto es el **mensaje crudo del backend, sin `t()`**. El backend produce `'measuredAt is too far in the future'` (`backend-pet-tracker/src/modules/health/domain/errors/weight.errors.ts:3`), mapeado a `validationError([{ path: ['measuredAt'], message }])` en `weights.controller.ts:53-56`. Es decir, hoy el usuario lee literalmente `measuredAt is too far in the future`, en inglés en los dos idiomas (comportamiento documentado en `docs/ui-guidelines.md` §Dirección de arte 6, corolario 2: «El backend sigue devolviendo validaciones en inglés»). Las únicas claves `t()` del alta son `weightLog.enterValidWeight` (`:85`), `weightLog.errorForbidden` (`:112`), `common.cannotReachServer` (`:115`), `common.somethingWentWrong` (`:122,125`).

### 1.2 `add-pet/index.tsx` — `dateToIso` y `birthDate`

- `src/screens/add-pet/index.tsx:34-39` — `dateToIso(date: Date)`: componentes locales del `Date` recibido.
- Estado `:98` `birthDate: Date | null`; blur reset `:120` → `null` (#63 R2).
- Único consumidor: `:186` `ageInput = { birthDate: dateToIso(birthDate) }` cuando `ageMode === 'birthDate'` (`:181`) y hay fecha; sin fecha → `:183` `t('addPet.chooseBirthDate')`.
- Selector: `:432-447` `<Host><ExpoDateTimePicker testID="birth-date-picker" mode="date" maximumDate={new Date()} presentation="dialog" value={birthDate ?? new Date()} onValueChange={(_e, d) => setBirthDate(d)} />`. `maximumDate` es el **ahora del dispositivo** (`:437`). El `Date` que devuelve el picker se lee por componentes locales del dispositivo.
- Pantalla: `:411-415` `birthDate.toLocaleDateString(locale)` (locale del idioma elegido, `useLocale`).
- **Mapeo del 400 en alta**: `src/api/pets.ts:127-128` `status === 400` → `{ kind: 'invalid' }` (el body se descarta) → `index.tsx:225-226` `t('addPet.checkPetDetails')`. El texto `'birthDate cannot be in the future'` (`backend-pet-tracker/src/modules/pets/domain/errors/pet.errors.ts:16`) **nunca llega a pantalla**.

---

## 2. Cómo llega la `timezone` del usuario a las pantallas

- Tipos: `src/api/users.ts:3-13` `ProfileResponse.timezone: string` (guard `isProfileResponse` `:22-39` exige `timezone` string); `src/api/types.ts:29` `RegisterRequest.timezone?`; `:40` `UserResponse.timezone` (respuesta de **registro**, no de login).
- Fetch: `users.ts:41-64` `getMe(baseUrl, token)` → `getJson(baseUrl, '/me')`. Ruta real del backend: `@Controller('me')` + `setGlobalPrefix('v1')` (`backend-pet-tracker/src/modules/users/infrastructure/users.controller.ts:40,49`; `src/main.ts:6`) ⇒ **`GET /v1/me`**, no `/v1/users/me` como dice el enunciado de #90 (corregir en la spec).
- Clave de caché: `src/api/query-keys.ts:43-45` `userKeys.me() = ['users','me']`.
- **Único consumidor hoy**: `src/screens/profile/index.tsx:102-105` `useQuery({ queryKey: userKeys.me(), queryFn: () => getMe(baseUrl, token ?? '') })`. Profile no pinta `timezone` (grep `timezone` en `profile/index.tsx`: 0 resultados) y el móvil no tiene ningún PATCH (grep `patchJson|method: 'PATCH'|updateProfile|updatePet` en `src/`: 0). La zona es **write-once en el registro**.
- **No hay zona en memoria sin red**: `src/providers/auth-provider.tsx:16-21` el contexto es `{ status, token, signIn, signOut }`; `src/api/auth.ts:9-15` `LoginState` `'ok'` trae solo `accessToken`. Ni `weight-log` ni `add-pet` tienen hoy acceso a la zona: `weight-log.tsx` importa `useAuth`, `useSelectedPet`, `useTranslate` (`:24-26`); `add-pet` idem (`:19-24`). `useSelectedPet` expone solo `selectedPetId` (`src/providers/selected-pet-provider.tsx:10-11`).
- **Coste de red si se añade `useQuery(userKeys.me())`**: `src/providers/query-provider.tsx:28-35` `staleTime: 0, gcTime: 5 min, retry: false`. Con `staleTime: 0` cada montaje de `weight-log` dispara `GET /v1/me` (datos cacheados se muestran al instante si Profile se visitó en los últimos 5 min, pero la petición sale igual). «Sin red nueva» exige una decisión de spec (p. ej. `staleTime` por observador en esa query — TanStack v5 lo permite por `useQuery` — o aceptar la petición). `add-pet` usa `render` a secas en su test (`index.test.tsx:72-80`), sin `QueryClientProvider`: ver §5.
- **Si el perfil no cargó / falló** (`data === undefined`, o `kind` ∈ `unauthorized|error|unreachable|missing-config`): hoy no existe rama alguna. Valor por defecto razonable = zona del dispositivo, que es exactamente lo que `register.tsx` ya usa: `src/app/(auth)/register.tsx:64-70` `deviceTimezone()` = `Intl.DateTimeFormat().resolvedOptions().timeZone || undefined` con `try/catch`; `:102` lo manda como `timezone`. Test con esa API mockeada: `src/app/(auth)/__tests__/register.test.tsx:97-99` (`jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')`).
- **La zona del perfil puede no ser IANA** y el backend lo tolera: `register-user.dto.ts:24` `z.string().trim().min(1).max(64).optional()` (sin validar IANA); default `'UTC'` (`register-user.use-case.ts:55` `dto.timezone ?? DEFAULT_TIMEZONE`, `user.entity.ts:1`; columna `users.schema.ts:21` `.default('UTC')`). En uso, `owner-local-day.ts:23` `isSupportedTimeZone(raw) ? raw : 'UTC'` + `logger.warn`. Consecuencia para el móvil: `new Intl.DateTimeFormat(undefined, { timeZone: 'basura' })` lanza `RangeError`; si el helper hace fallback a **dispositivo** y el backend a **UTC**, en ese rincón siguen sin coincidir (ver §8).

---

## 3. Mascota compartida: qué devuelve el backend y contra qué valida

### 3.1 Respuesta de mascotas
- `GET /v1/pets` y `GET /v1/pets/:petId` devuelven `PetProfileResponse` (`backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts:78-93`), mapper `pets/infrastructure/mappers/pet-profile-response.mapper.ts:19-53`: **25 claves**, con `myRole: PetRole` (`:40`) y **sin `ownerId`, sin `members`, sin zona alguna**. El contrato está declarado **congelado** (`:13-18`: «exactamente estas claves … nunca agregan ni renombran claves»).
- Móvil: `src/api/types.ts:58-83` `PetProfile` (espejo; `myRole: 'owner'|'family'|'walker'|'vet'` `:76`); guard `src/api/pets.ts:48-56` solo comprueba `id` y `name`. `myRole` ya se consume en `src/app/(tabs)/map.tsx:116,119` (`canSetLostMode`). La lista de mascotas está en caché en todas las tabs (`petKeys.list()` en `health.tsx:48`, `food.tsx:43`, `map.tsx:87`, `home/index.tsx:178`, `profile/index.tsx:107`, `reminders/index.tsx:51`, `pairing/index.tsx:74`).

### 3.2 Validación en backend (quién llama a qué)
- `ownerLocalDay(pets, petId, now)` — `pets/application/owner-local-day.ts:7-16` → `pets.findOwnerTimezone(petId)` (`pet.drizzle.repository.ts:114-130`: `pet_users ⋈ users` con `role='owner'`, `status='active'`, primero por `createdAt`) → `localDayInZone` (`:18-34`: IANA o `'UTC'` + warn; `localDayOf(now, tz)` de `@/pipeline/local-day`).
- Llamadores de `ownerLocalDay` (grep en `src`, sin specs): `health/.../create-weight.use-case.ts:31` (**pesos**), `create-vaccine.use-case.ts:33`, `update-vaccine.use-case.ts:36`, `pets/.../update-pet.use-case.ts:40` (PATCH `birthDate`), `get-pet.use-case.ts:77`, `nutrition/.../serve-meal.use-case.ts:41`, `unserve-meal.use-case.ts:26`, `get-nutrition-plan.use-case.ts:31`.
- `requesterLocalDay(users, userId, now)` — `pets/application/requester-local-day.ts:4-14` → `users.findById(userId).timezone` → mismo `localDayInZone`. Único llamador: `create-pet.use-case.ts:34` (**POST birthDate**).
- Pesos: `create-weight.use-case.ts:24-33` `if (dto.measuredAt > await ownerLocalDay(...)) throw new WeightMeasuredInFutureError()` (comparación de cadenas `YYYY-MM-DD`, sin margen desde #89).
- **Rol exigido**: `weights.controller.ts:35-36` `@Post() @RequirePetRole('owner')` (decorador `pets/infrastructure/decorators/require-pet-role.decorator.ts:13-14`). e2e `test/health-weights.e2e-spec.ts:484-498` «family recibe 403 en POST y 200 en GET». El móvil ya mapea ese 403 a `weightLog.errorForbidden` = «Solo el dueño puede registrar pesos» (`health-records.ts:143-145`, `catalog.ts:117/426`).

### 3.3 Qué exige cada opción (datos, no decisión)
| Opción | Qué exige | Cobertura del caso real |
|---|---|---|
| **(a)** zona del perfil propio (`GET /v1/me`) | Una `useQuery(userKeys.me())` en `weight-log` (y en `add-pet` si se cubre `birthDate`), helper de fecha civil con zona explícita, fallback si no hay perfil, mocks/seed en los dos tests (§5). Cero backend. | **Exacta** para pesos (solo el owner puede POSTear, §3.2) y para `birthDate` en POST (valida contra requester). El único caso que no cubre es el que el backend ya rechaza con 403 antes de mirar la fecha. |
| **(b)** backend expone zona del owner en mascotas | Romper el contrato congelado del mapper (`pet-profile-response.mapper.ts:13-18`) y mover **7 candados de claves**: `test/pets.e2e-spec.ts:64-88` (asserts `:425`, `:740-741`), `test/devices.e2e-spec.ts:795-846`, `test/pet-lost-mode.e2e-spec.ts:40-55`, `test/device-subscriptions.e2e-spec.ts:326-365` (2 asserts), `pet-profile-response.mapper.spec.ts:37-64`, `pets.controller.spec.ts:~188`; más `types.ts:58-83` y las fixtures móviles de `PetProfile`. Feature de backend aparte con id propio. | Añadiría información que **ningún flujo móvil necesita**: el móvil no hace PATCH de mascota (§2) y los pesos son owner-only. |
| **(c)** no calcular nada; que el 400 explique la zona | El texto de `WeightMeasuredInFutureError` se conserva byte a byte por decisión de #89 (`specs/dto-dates-owner-timezone/requirements.md:674-679`, `:647-660`); cambiarlo es feature de backend (mueve `test/health-weights.e2e-spec.ts:429` y `create-weight.use-case.spec.ts:129`). Variante **(c′)** solo móvil: detectar `path === 'measuredAt'` en `result.errors` y sustituir por una clave `t()`; mueve `weight-log.test.tsx:433-452` (hoy asevera el join crudo). | No evita el 400; solo lo explica. Deja la fecha por defecto en la zona del dispositivo (criterio 1 pide justificarlo por escrito). |

---

## 4. Helper de fecha civil: qué existe y en qué runtime corre

### 4.1 Nada reutilizable con zona explícita
- `src/utils/`: `category-palette.ts`, `device-connectivity.ts`, `language-preference.ts`, `reminder-dates.ts`, `reminder-meta.ts`, `theme-preference.ts` (+ tests). `reminder-dates.ts:3-17` `combineDateAndTime` / `daysUntil` — componentes **locales del dispositivo**.
- `src/screens/home/format.ts:5-11` `localDayOf(instant)` (dispositivo), `:13-20` `calendarDaysUntil(date, now)` (#70, componentes locales + `Date.UTC`), `:36-44` `fmtDate` (`new Date(y, m-1, d).toLocaleDateString(locale, …)`).
- `Intl` en `src/` (sin tests): solo `register.tsx:66` (`resolvedOptions().timeZone`), `home/weekly-activity-chart.tsx:220` (`NumberFormat`) y `toLocaleDateString/toLocaleString(locale)` en `add-pet:413`, `home/index.tsx:132`, `pairing:451`, `profile:286`, `add-reminder:219`, `reminders:313`, `home/format.ts:39`, `weekly-activity-chart.tsx:391`. **Ninguna llamada usa la opción `timeZone`.** No hay `expo-localization` (`package.json`: no instalado; la carta lo prohíbe).
- `weight-log.test.tsx:84-89` **duplica `localTodayIso` línea a línea** para compararse con producción.

### 4.2 Runtime
- `package.json`: `expo ~57.0.14`, `react-native 0.86.2`, `jest-expo ^57.0.4`, `jest ~29.7.0`, `@tanstack/react-query 5.102.8`, `react 19.2.3`. Proyecto **managed** (no hay `android/` ni `ios/`); `app.json` no declara `jsEngine` ⇒ Hermes por defecto del SDK (**NO verificado** más allá de la ausencia de override).
- Hermes con Intl: `node_modules/react-native/ReactAndroid/hermes-engine/build.gradle.kts:358` `-DHERMES_ENABLE_INTL=True`; iOS `node_modules/react-native/sdks/hermes-engine/utils/build-apple-framework.sh:103` `-DHERMES_ENABLE_INTL:BOOLEAN=true`. Que `Intl.DateTimeFormat(…, { timeZone })` devuelva el día correcto **en un dispositivo Android** es lo que **NO he podido verificar** (no hay dispositivo aquí); producción ya depende de `Intl.DateTimeFormat().resolvedOptions()` y de `toLocaleDateString`, así que el objeto existe. Nota de riesgo: la implementación Android de Hermes delega en ICU/`java.text` y el formato exacto de un locale (p. ej. `en-CA` → `YYYY-MM-DD`) no está garantizado; `formatToParts` o partes numéricas reensambladas evitan depender del patrón. Verificación real: smoke en **dev build de Android** con la zona del dispositivo distinta a la del perfil (memoria: todo smoke móvil en dev build Android).
- Jest corre en Node (`jest-expo`), no en Hermes: `node -v` = `v20.20.2`, ICU completo `78.2`. Verificado en este host: `Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Kiritimati', … }).format(new Date('2026-09-17T23:30:00Z'))` → `2026-09-18`; `Pacific/Pago_Pago` → `2026-09-17`. Un test verde en jest **no** prueba Hermes.

### 4.3 Patrón de tests con fechas y `TZ`
- **Nadie fija `TZ`**: grep `TZ` en `package.json` (scripts: `test: jest`, `typecheck: tsc --noEmit`), `jest` inline de `package.json` (`preset: jest-expo`, `setupFilesAfterEnv: test/jest-setup.js`), `test/jest-setup.js` (solo mocks de worklets/reanimated), `init.config.sh`, `init.sh`, `.github/workflows/ci.yml` → 0 resultados. Host del VPS: `Etc/UTC`. CI: `runs-on: ubuntu-latest` (`ci.yml:11`); que los runners de GitHub corran en UTC es conocimiento general, **NO verificado en el árbol**.
- Patrón dominante: `jest.useFakeTimers()` + `jest.setSystemTime(...)` (`food.test.tsx:263-264`, `reminders/index.test.tsx:302-303`, `home/index.test.tsx:2277-2278` y 8 más, `add-reminder/index.test.tsx:405-406`, `map.test.tsx:684`), o pasar `now` explícito (`home/format.test.ts:46`). Utils nuevos → `src/utils/<nombre>.ts` + `<nombre>.test.ts` al lado (`docs/conventions.md` §Convenciones de la app móvil).
- Patrón anti-desplazamiento de #70: `home/format.test.ts:54-97` (`#70 R5`) espía `Date`, `Date.parse` y `Date.UTC` para demostrar que no se parsea la cadena cruda, con un `Date` «sesgado» (`getDate() = 10` pero `getUTCDate() = 11`, `:58-65`) — la fixture «dispositivo en zona distinta» ya tiene precedente en el repo.
- `localTodayIso` hoy: sin test propio; lo cubren indirectamente 4 aserciones de `weight-log.test.tsx` (`:158-160`, `:355-357`, `:406-408`, `:428`) comparando contra la copia del test, **sin fake timers** (ya son teóricamente inestables a medianoche). `dateToIso`: sin test propio; `add-pet/index.test.tsx:243-250` fija `new Date(2024, 3, 9, 12)` (mediodía, sin frontera) → `'2024-04-09'`.

---

## 5. Candados que se mueven o pueden moverse

| # | Candado | Fichero:línea | Cifra hoy | Comando de verificación | Se mueve si… |
|---|---|---|---|---|---|
| L1 | Longitud del catálogo | `src/providers/__tests__/language-provider.test.tsx:55` `toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2)` | **304** | `grep -c "^  '" src/i18n/catalog.ts` por bloque: `en` (`catalog.ts:1-307`) = **304**, `es` (`:310-615`) = **304** | Cualquier clave nueva: sumar el delta al literal (comentario `:50` lleva la historia por feature). Es el candado que dos specs olvidaron (memoria). |
| L2 | Paridad en/es y marcadores | `language-provider.test.tsx:56-61`; `src/__tests__/ui-language.test.ts:429-430` | — | `bun run test -- src/__tests__/ui-language` | Solo si una clave falta en un idioma o cambia `{{param}}`. |
| L3 | Tabla de usos R5 Health | `ui-language.test.ts:133` `expect(R5_HEALTH).toHaveLength(32)`; filas en `src/__tests__/ui-copy-table.ts` (18 filas de `weight-log.tsx`, p. ej. `:145-146`) | **32** | `grep -c "app/(tabs)/weight-log.tsx" src/__tests__/ui-copy-table.ts` → 18 | `checkUses` (`:38-64`) exige el **número exacto** de `t('clave')` por `(fichero, clave)`. Una clave nueva no rompe por sí sola, pero `specs/mobile-ui-language/design.md` §2 (`:115+`) exige registrarla en la tabla ⇒ +N filas ⇒ `32 + N`. Quitar/duplicar un `t()` existente (p. ej. `weightLog.yyyyMmDd`) rompe. |
| L4 | Tabla de usos R9 Alta de mascota | `ui-language.test.ts:161` `toHaveLength(42)`; 42 filas de `screens/add-pet/index.tsx` en `ui-copy-table.ts` | **42** | `grep -c "screens/add-pet/index.tsx" src/__tests__/ui-copy-table.ts` → 42 | Igual que L3 si `add-pet` gana copy. |
| L5 | Literal entero del catálogo en pantallas | `ui-language.test.ts:437-448` (22 `SCREEN_FILES`) | 22 ficheros | — | El valor `en`/`es` de una clave nueva no puede aparecer como literal completo en ninguna pantalla. |
| L6 | Recuento de `signOut` por pantalla | `src/__tests__/design-drift.test.ts:391` `'app/(tabs)/weight-log.tsx': 1` | 1 | — | Solo si cambian las llamadas a `signOut` (`weight-log.tsx:118`). |
| L7 | Fecha por defecto = dispositivo | `weight-log.test.tsx:84-89` (copia de `localTodayIso`), aserciones `:158-160` (#63 R3), `:355-357` (R9), `:406-408` (R9), `:428` (R9) | 4 aserciones | `bun run test -- 'src/app/\(tabs\)/__tests__/weight-log'` | Si la fecha se calcula en la zona del perfil y el test seeda un perfil con zona ≠ host (UTC), las 4 comparan contra el día del host y fallan (o pasan por casualidad según la hora). Hay que reescribir la copia del helper o fijar `setSystemTime` + zona. |
| L8 | `weight-log.test.tsx` no mockea `api/users` | `:30-59` mockea `health-records`, `auth-provider`, `expo-router` (`useFocusEffect: jest.fn()` `:47`), safe-area | — | — | Con `useQuery(getMe)` real: `fetch` → `getJson` catch → `unreachable` (`src/api/http.ts:21-24`) → fallback silencioso a dispositivo y los tests **pasan sin probar nada**. La spec debe mockear `../../../api/users` o seedear `queryClient.setQueryData(userKeys.me(), …)`: `renderWithProviders` ya devuelve `queryClient` (`test/render-with-providers.tsx:22-40`, `gcTime 0`). |
| L9 | Join crudo de mensajes del backend | `weight-log.test.tsx:433-452` `'Weight is too high\nDate is in the future'` | 1 test | — | Si se elige (c′) (sustituir el mensaje de `measuredAt` por `t()`), cambia. |
| L10 | `add-pet` renderiza **sin** `QueryClientProvider` | `add-pet/index.test.tsx:72-80` `render(...)` a secas; 15 tests | 15 | `bun run test -- src/screens/add-pet` | Cualquier `useQuery` en `AddPetScreen` lanza «No QueryClient set» en los 15 hasta migrar `renderAddPet` a `renderWithProviders`. |
| L11 | `birthDate` enviado | `add-pet/index.test.tsx:243-250` (`new Date(2024, 3, 9, 12)` → `'2024-04-09'`), `:143-149` y `:188-191` (blur) | 3 sitios | — | Solo si el helper deja de leer componentes locales del `Date` del picker. |
| L12 | Mock del picker de fecha | `add-pet/index.test.tsx:38-52` (`@expo/ui` Host → `View testID="expo-ui-picker-host"`; `community/datetime-picker` → `View` con props) | — | — | `maximumDate`/`value` son observables como props del `View`; cambiar `maximumDate` a otra cosa que `new Date()` es asertable. |
| L13 | `PICKER_MOCK_UNARMED` (#72 R4) | `add-pet/index.test.tsx:82-89` `pressPickPhoto`, `:101-104` `beforeEach` raíz, `:402-419` test | — | — | No se toca; toda prueba nueva que pulse `add-pet-photo` pasa por `pressPickPhoto()`. |
| L14 | Snapshots | `src/components/__tests__/__snapshots__/pet-avatar.test.tsx.snap` (único) | 1 | `find src -name '*.snap'` | No afecta. |
| L15 | Health tab | `src/app/(tabs)/__tests__/health.test.tsx:469-610` solo `weight-log-link` | — | — | No asevera fechas. |
| L16 | Backend (solo si (b) o (c)) | ver §3.3: 7 candados de claves de `PetProfileResponse`; texto del 400 en `test/health-weights.e2e-spec.ts:429`, `create-weight.use-case.spec.ts:129` | — | — | Fuera de esta feature salvo decisión explícita. |

Regla de #65/#78 para claves nuevas: bloque `describe('#<id> R<n>: el catálogo trae …')` que lista `[clave, en, es]` (`language-provider.test.tsx:122-140`), además del delta en L1.

---

## 6. Cambios recientes en los cuatro ficheros (verificado con git)

`git log origin/main --since=2026-09-10 --format='%h %ad %s' --date=short -- <fichero>`:

| Fichero | Commits desde 2026-09-10 | Último |
|---|---|---|
| `src/app/(tabs)/weight-log.tsx` | `5343f374` 2026-09-14 `feat(detail-state-reset): reset weight form state on blur (R3)`; `0d64e42b` 2026-09-10 `refactor(mobile-tanstack-query): migrate weight log query (R10)` | **`5343f374` (#63)** |
| `src/app/(tabs)/__tests__/weight-log.test.tsx` | `c71c7b4d` 2026-09-17 `test(add-pet-photo-test-flake): mutate production to prove the six waits are alive (R2)` (+5/−3: renombra el `it` a `(#72 R2)` y cambia la espera de `mockListWeights` 2 llamadas → `weight-input.props.value === ''`, `:401-404`); `d922f8ba` 09-14 (#63 R3); `0d64e42b`, `9645cbcf` 09-10 (#87 R10) | `c71c7b4d` (#72) |
| `src/screens/add-pet/index.tsx` | `86b01d75` 2026-09-14 `feat(detail-state-reset): reset pet form state on blur (R2)` | **`86b01d75` (#63)** |
| `src/screens/add-pet/index.test.tsx` | `0fda68ac` 09-17 drop `virtual` flag (1 línea); `9424733c` 09-17 assert picker armed (R4, 11 líneas); `ff33b7e7` 09-17 R4 test (23 líneas); `eb931f7e` 09-14 (#63 R2) | `0fda68ac` (#72) |

- **PR #139 (#72) ya está mergeado**: `gh pr view 139` → `state: MERGED`, `mergedAt: 2026-09-17T17:23:41Z`, `mergeCommit: 29689598` = base de esta branch. `origin/feature/72-mobile-add-pet-photo-test-flake` (`67597153`) es ancestro de HEAD. **No hay solape de merge posible**: lo que #72 cambió ya está en el árbol de #90.
- Confirmado lo que dijo Frontend: #72 **no tocó** `weight-log.tsx` ni `add-pet/index.tsx` (los tres últimos commits de ambos en `origin/main` son de #63 y #87).

---

## 7. Reglas que la spec debe respetar textualmente

- **Esperas sobre el árbol** — `docs/conventions.md:198-206` (§Tests, subsección «Esperas sobre el árbol renderizado», añadida por #72): «La condición que termina una espera debe ser la misma observación que hacen las aserciones posteriores. Si el test asevera el árbol, espera al árbol: esperar a la caché de Query o al contador de un mock y consultar el DOM después introduce una carrera. Una aserción de ausencia se ancla primero a la aparición o al estado final de un nodo positivo del mismo escenario.» Aplicación directa: un test que espere a que `userKeys.me()` esté en caché y luego lea `weight-date-input.props.value` viola la regla; debe esperar al valor del input.
- **`PICKER_MOCK_UNARMED`** — `add-pet/index.test.tsx:82-89`: `pressPickPhoto()` lanza `'PICKER_MOCK_UNARMED: launchImageLibraryAsync must be rearmed by the root beforeEach in add-pet/index.test.tsx'` si `mockLaunchImageLibrary.getMockImplementation() === undefined`; el `beforeEach` raíz `:101-104` hace `mockReset()` + `mockResolvedValue({ canceled: true, assets: null })`; el mock de `expo-image-picker` va **sin** `{ virtual: true }` (`:20-22`). Cualquier test nuevo en ese fichero hereda el `beforeEach` raíz y no debe pulsar `add-pet-photo` fuera de `pressPickPhoto()`.
- **Prefijo de feature en R-ids** — `docs/conventions.md:157-178`: los dos ficheros de test ya acumulan R-ids de #63, #65, #61, #62, #72, #87 ⇒ los títulos nuevos van como `describe('#90 R<n>: …')`.
- **Paréntesis en filtros de jest** — `docs/conventions.md:180-196`: el comando de verificación de la spec debe escapar `\(tabs\)` o usar `--runTestsByPath`, y comprobar el número de suites impreso.
- **Copy nueva** — `docs/ui-guidelines.md` §Dirección de arte 6: toda cadena nueva vía `t()`, en los dos idiomas, registrada en `specs/mobile-ui-language/design.md` §2 (tabla §2.5 para `weight-log`, `:369+`; §2.9 para `add-pet`, `:583+`); claves en inglés camelCase con ámbito `weightLog.` / `addPet.`.
- **Grep-clean C8** — `CHECKPOINTS.md` C8: cero hex/clases arbitrarias/`StyleSheet.create` en cualquier fichero que se toque.
- **Sesiones en paralelo** — `docs/conventions.md:254-322`: esta branch vive en `Pet-Tracker-wt-backend` (Postgres `pet_tracker_wt`); la suite móvil no toca Postgres ni LocalStack, se puede correr sin aviso; `init.sh` completo sí exige `pgrep -af 'init\.sh|test:e2e|jest-e2e'` antes.

---

## 8. Riesgos y decisiones abiertas (con evidencia)

1. **La ambigüedad «compartida» no existe en los flujos que el móvil ejecuta** (§3.2). Riesgo inverso: que la spec siga tratándola como abierta y arrastre la opción (b). Evidencia: `weights.controller.ts:36` + e2e `:484-498`; `create-pet.use-case.ts:34`; ausencia de PATCH en `src/api/pets.ts`.
2. **¿Fecha mostrada = fecha enviada?** Sí por construcción (`weight-log.tsx:62,188,95`): no hay dos valores. Lo que sí hay que decidir es **cuándo se recalcula** si el perfil llega después del primer render (`useState(localTodayIso)` se evalúa una vez `:62`; los reseteos `:70,:104` se evalúan en su momento). Opciones: (i) derivar el default con `useEffect`/`useMemo` sobre `me.data`, (ii) no renderizar el formulario hasta tener zona (Skeleton, C8 §7), (iii) default de dispositivo y recalcular al llegar el perfil solo si el usuario no ha editado el campo.
3. **Selector manual de fecha en `weight-log`**: es un `Input` de texto libre (`:184-190`), sin `keyboardType`, sin validación local; el usuario puede escribir cualquier cadena y **cualquier fecha futura**. Opciones: (A) dejarlo (el backend valida; el 400 sigue posible y entonces el criterio 2 exige texto vía `t()`), (B) validación local «no posterior a hoy en la zona del perfil» con clave nueva (mueve L1, L3), (C) sustituir por `community/datetime-picker` con `maximumDate` como en `add-pet` (cambio de UI, C8, mueve L7 y varios tests; fuera del enunciado).
4. **Fallback cuando la zona del perfil no es IANA o no hay perfil** (§2): backend → `'UTC'`; móvil hoy → dispositivo. Opciones: (i) dispositivo (status quo, divergencia solo con perfiles corruptos creados desde otro cliente), (ii) `'UTC'` para imitar al backend, (iii) validar con `try { new Intl.DateTimeFormat(undefined, { timeZone }) }` y elegir (i) o (ii) en el `catch`. La spec debe fijar uno y su test.
5. **Coste de red** (§2): `staleTime: 0` global ⇒ `GET /v1/me` en cada montaje de `weight-log`. Opciones: aceptar; `staleTime` alto solo en esa `useQuery`; o extraer `useMe()` (ladder: inline como `profile/index.tsx:102-105` es lo mínimo; un hook solo si lo consumen ≥2 pantallas, que serían `profile`, `weight-log` y quizá `add-pet`).
6. **`add-pet` y TanStack**: L10 — 15 tests sin `QueryClientProvider`. Si la spec lleva la zona del perfil también al alta (para `maximumDate` y para `dateToIso`), hay que migrar `renderAddPet` a `renderWithProviders` (mismo patrón que `weight-log.test.tsx:101-112`). Si **no** la lleva, `birthDate` queda con `maximumDate={new Date()}` del dispositivo y el caso «dispositivo por delante del perfil» sigue pudiendo devolver 400 (`'birthDate cannot be in the future'`, que el móvil pinta como `addPet.checkPetDetails` sin más detalle, §1.2).
7. **Qué es el «test de regresión de birthDate»** (criterio 3): en el móvil no se puede aseverar «el backend acepta»; eso ya lo cubre `test/pets.e2e-spec.ts` R6 de #89 (`specs/dto-dates-owner-timezone/traceability.md:25`, par Kiritimati/Pago_Pago). Opciones móviles: (i) test unitario de `dateToIso` (hoy sin test; habría que exportarlo o moverlo a `src/utils/`) con fixture a las 23:30 locales demostrando que no se desplaza por UTC (`format.test.ts:54-97` como plantilla); (ii) aserción en `add-pet/index.test.tsx` con `setSystemTime` en frontera y `maximumDate`/payload; (iii) declarar el criterio cubierto por el e2e de #89 y añadir solo (i). Marcar como **requisito de verificación** (C4) si la producción no cambia.
8. **Helper nuevo con zona explícita**: no hay nada que reutilizar (§4.1). Riesgo: que se duplique en dos pantallas (hoy ya hay dos copias device-local: `localTodayIso` y `dateToIso`, más `home/format.ts:5-11`). Sitio canónico según conventions: `src/utils/<nombre>.ts` + test al lado. Decisión de spec: si `dateToIso` (Date → YYYY-MM-DD local) y «hoy en zona Z» son dos funciones o una.
9. **Hermes en dispositivo NO verificado** (§4.2): la única prueba real es el smoke en dev build Android con zona del dispositivo ≠ zona del perfil (p. ej. dispositivo en `Pacific/Kiritimati`, perfil en `America/Mexico_City` a las 20:00 CDMX). Debe constar en la spec como paso humano.
10. **Estabilidad de los tests existentes** (L7): las 4 aserciones comparan contra `new Date()` real; con zona del perfil seedada ≠ UTC del host pueden fallar según la hora en que corra CI. La spec debería fijar `setSystemTime` en un instante que cruce medianoche entre las dos zonas para que el candado sea determinista y falle por la razón correcta.
11. **Ruta del perfil**: el enunciado dice `GET /v1/users/me`; el árbol dice `GET /v1/me` (§2). Corregir en la spec.
12. **Texto del 400 en pesos** (criterio 2): si el 400 sigue siendo posible (opción A del punto 3), hoy el usuario ve `measuredAt is too far in the future` (§1.1). Cualquier texto nuevo pasa por `t()` y mueve L1/L3/L9; cambiar el texto del backend está vetado por #89 salvo decisión humana.

---

## Decisiones abiertas para el humano

| Id | Decisión | Opciones | Evidencia |
|---|---|---|---|
| **D-A** | Fuente de la zona | **(a)** perfil propio vía `GET /v1/me` — cubre el 100 % de los POST que pueden tener éxito · **(b)** zona del owner en la respuesta de mascotas — feature backend aparte, rompe contrato congelado, sin caso de uso móvil · **(c)** no calcular; solo explicar el 400 (backend, vetado por #89) o **(c′)** mapear `path === 'measuredAt'` a `t()` en cliente | §3.2, §3.3 |
| **D-B** | Alcance de pantallas | **B1** solo `weight-log` (+ test de regresión de `birthDate` sin tocar `add-pet`) · **B2** `weight-log` y `add-pet` (`maximumDate` y `dateToIso` en zona del perfil; obliga a `renderWithProviders` en 15 tests, L10) | §1.2, §8.6 |
| **D-C** | Campo de fecha manual en `weight-log` | **C-A** texto libre como hoy + copy `t()` para el 400 · **C-B** validación local «≤ hoy en zona del perfil» con clave nueva · **C-C** `datetime-picker` con `maximumDate` (fuera del enunciado) | §8.3 |
| **D-D** | Fallback sin perfil / zona inválida | **D-i** dispositivo (status quo) · **D-ii** `'UTC'` (imita backend) · **D-iii** validar con `Intl` y aplicar i o ii en el `catch` | §2, §8.4 |
| **D-E** | Coste de red de `me` | **E1** aceptar `GET /v1/me` por montaje · **E2** `staleTime` alto en esa `useQuery` · **E3** hook `useMe()` compartido | §2, §8.5 |
| **D-F** | Forma del test de regresión de `birthDate` | **F1** unitario de `dateToIso` en frontera 23:30 · **F2** aserción en `add-pet/index.test.tsx` con `setSystemTime` · **F3** citar e2e R6 de #89 + F1 | §8.7 |
| **D-G** | Copy nueva | número de claves y delta exacto en `language-provider.test.tsx:55` (304 → 304 + N) y filas en `ui-copy-table.ts` (32 → 32 + N en R5) | L1, L3 |
| **D-H** | Verificación humana | smoke en dev build Android con zona dispositivo ≠ perfil (Hermes `Intl` con `timeZone` no verificable aquí) | §4.2, §8.9 |

Afirmaciones **no verificadas contra el árbol** (marcadas arriba): Hermes como motor por defecto del SDK 57 (solo se verificó la ausencia de `jsEngine`); comportamiento de `Intl.DateTimeFormat` con `timeZone` en Hermes Android; zona UTC de los runners de GitHub Actions.
