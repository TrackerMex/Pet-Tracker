---
feature: "mobile-reminders"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-reminders]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas (D1–D11). R1 toca backend y SÍ
> respeta las capas de `docs/architecture.md`; el resto es app móvil, donde
> aplican kebab-case, tests que nombran su R-id y las convenciones de
> `docs/conventions.md` §Convenciones de la app móvil — **incluidas las dos
> nuevas**: Estructura Expo oficial (route file delgado + screen body en
> `src/screens/`) y Dimensiones de pantalla uniformes (métricas de `home.tsx`,
> Skeleton dimensionado, `PetSwitcher` compartido). #39 es la PRIMERA feature
> bajo esa estructura: los paths de esta spec son normativos.
> Contratos del backend verificados contra el código real el 2026-08-24
> ([[design]] §D2/§D3, `reminders.controller.ts`, `reminder.dto.ts`,
> `reminder.mapper.ts`).
> Diseño de referencia: `specs/mobile-figma-polish/design-src/App.tsx` —
> `RemindersScreen` líneas 905–971, `AddReminderScreen` líneas 976–1107.

## Contexto fijo (no reabrir)

- Base: estado tras #38 — tabs reales; `SelectedPetProvider` en
  `src/app/(tabs)/_layout.tsx`; `useApi` con stale-while-revalidate (401 →
  `signOut()`); clientes `fetchFn`/`kind` en `src/api/` (`http.ts` con
  `getJson`/`postJson`/`readJson`/`apiUrl` — **no existe `patchJson`, lo
  añade R4**). Rutas ocultas fuera de la tab bar por el array `TABS` de
  `floating-tab-bar.tsx` (mismo mecanismo que `weight-log`/`meal-schedule`)
  — **cero cambios** en `_layout.tsx` y `floating-tab-bar.tsx`.
- El backend de reminders HOY solo expone `POST /pets/:petId/reminders`
  (rol owner, 201) y `PATCH /reminders/:id` (editar/cancelar). **No hay GET
  de listado ni DELETE**: R1 añade el GET mínimo; el "borrado" del criterio
  de aceptación es la cancelación existente ([[design]] §D3). No se añade
  DELETE.
- `CreateReminderSchema` es `strictObject`: solo `type`, `title` (trim,
  1–120), `dueAt` (ISO con offset, **futuro**), `advanceMinutes` (int
  0–10080, opcional, default backend 60). Tipos:
  `vaccine | deworming | medication | appointment | weight | food | custom`;
  status `scheduled | sent | cancelled`. `ReminderResponse` =
  `{ id, petId, type, title, dueAt, advanceMinutes, status }`.
- **Cero dependencias nuevas** en `mobile-pet-tracker/` ([[design]] §D6:
  fecha/hora por `TextInput`, sin datetimepicker; confirmación con
  `Alert.alert` de react-native). **`expo-notifications` NO se instala**:
  notificaciones locales fuera de alcance (backlog).
- Decisión de #33 (vigente): funciones de `src/api/` reciben `token`/`fetchFn`
  por parámetro, nunca importan React ni storage. Tipos a mano en
  `src/api/types.ts`.
- UI en inglés (decisión de #38 vigente); el diseño está en español, los
  literales de esta spec son los normativos.
- Lección de #34 (vigente): offsets numéricos por `style` inline; el resto
  `className` + tokens (cero hex, cero `StyleSheet.create`). Sin imagen hero
  ni gradientes del diseño (misma línea que #38 D9).
- Smoke humano 100% **Expo Go** (`bunx expo start --go`), SDK 57, Android
  físico. Nada nativo nuevo.

## Requisitos funcionales

### Backend — listado de reminders (única adición, R1)

- **R1**: WHEN un usuario con membresía activa sobre la mascota hace
  `GET /v1/pets/:petId/reminders` THE SYSTEM SHALL responder 200 con
  `ReminderResponse[]` (vía `toReminderResponse`) de TODOS los reminders de
  la mascota (todo status), ordenados por `dueAt` ascendente; IF el usuario
  no es miembro activo THEN el `PetAccessGuard` existente responde 404 (sin
  `@RequirePetRole`: cualquier rol lee, como los GET de nutrition). Capas:
  `listByPet(petId)` en `ReminderRepository` (domain) +
  `ReminderDrizzleRepository` (infra, `orderBy(asc(reminders.dueAt))`),
  `ListRemindersUseCase` (application), método `@Get()` en
  `PetRemindersController` (infra). Firmas exactas en [[design]] §D2.
  *Tests: `backend-pet-tracker/src/modules/reminders/application/use-cases/list-reminders.use-case.spec.ts`
  (nuevo) → `describe('R1: ListRemindersUseCase delega en listByPet', ...)`;
  y `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` (extender) →
  casos `R1:` de 200 con orden asc, lista vacía `[]`, y 404 de no-miembro.
  ROJO primero.*

### Cliente API móvil (`src/api/reminders.ts`, nuevo)

- **R2**: WHEN se llama `listReminders(baseUrl, token, petId, fetchFn)` de
  `mobile-pet-tracker/src/api/reminders.ts` THE SYSTEM SHALL hacer
  `GET ${baseUrl}/pets/${petId}/reminders` vía `getJson` de `http.ts` y
  devolver un `RemindersState`:
  - HTTP 200 con body array → `{ kind: 'ok', reminders }` (`Reminder[]`
    de `src/api/types.ts`, [[design]] §D4);
  - HTTP 404 → `{ kind: 'not-found' }`;
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no array → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }` sin llamar `fetchFn`.
  *Test: `mobile-pet-tracker/src/api/__tests__/reminders.test.ts` (nuevo)
  → `describe('R2: listReminders mapea la respuesta por kind', ...)` con
  `fetchFn` stub por caso, asserts de URL exacta y header Bearer. ROJO
  primero.*

- **R3**: WHEN se llama
  `createReminder(baseUrl, token, petId, input, fetchFn)` del mismo archivo
  (`input: CreateReminderInput = { type, title, dueAt, advanceMinutes }`,
  §D4) THE SYSTEM SHALL hacer `POST ${baseUrl}/pets/${petId}/reminders` vía
  `postJson` con exactamente esas cuatro claves como body (el schema es
  strict) y devolver un `CreateReminderState`:
  - HTTP 201 con body objeto → `{ kind: 'ok', reminder }`;
  - HTTP 400 → `{ kind: 'invalid' }` (validación Zod del backend);
  - HTTP 403 (rol no-owner) → `{ kind: 'forbidden' }`;
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no objeto → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  *Test: mismo archivo → `describe('R3: createReminder publica y mapea por
  kind', ...)` con asserts de method POST, body JSON exacto y status 201.
  ROJO primero.*

- **R4**: WHEN se llama `cancelReminder(baseUrl, token, reminderId, fetchFn)`
  del mismo archivo THE SYSTEM SHALL hacer
  `PATCH ${baseUrl}/reminders/${reminderId}` con body
  `{ "status": "cancelled" }` vía **`patchJson` nuevo en `src/api/http.ts`**
  (misma firma y manejo que `postJson`, method `PATCH`) y devolver un
  `CancelReminderState`:
  - HTTP 200 con body objeto → `{ kind: 'ok', reminder }`;
  - HTTP 404 → `{ kind: 'not-found' }`;
  - HTTP 403 → `{ kind: 'forbidden' }`;
  - HTTP 409 (`ReminderNotEditableError`: ya sent/cancelled) →
    `{ kind: 'conflict' }`;
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status / body no objeto → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  AND ningún archivo bajo `src/api/` SHALL importar React ni
  `expo-secure-store` (regla #33; reviewer grep).
  *Test: mismo archivo → `describe('R4: cancelReminder parchea y mapea por
  kind', ...)` con asserts de method PATCH y body exacto (cubre `patchJson`;
  no hay suite propia de http.ts). ROJO primero.*

### Utilidades de fecha (`src/utils/reminder-dates.ts`, nuevo)

- **R5**: WHEN se llama `parseDueAt(dateText, timeText)` de
  `mobile-pet-tracker/src/utils/reminder-dates.ts` THE SYSTEM SHALL parsear
  `dateText` `DD/MM/AAAA` y `timeText` `HH:MM` a un `Date` local y devolver
  `null` si el formato no casa o la fecha no existe (verificación
  round-trip: el `Date` construido debe reproducir día/mes/año/hora/minuto);
  AND WHEN se llama `daysUntil(from, to)` THE SYSTEM SHALL devolver
  `Math.ceil((to - from) / 86_400_000)` (entero, puede ser negativo).
  *Test: `mobile-pet-tracker/src/utils/reminder-dates.test.ts` (colocado al
  lado, convención nueva) → `describe('R5: reminder-dates parsea y cuenta
  días', ...)` con casos: fecha válida, `31/02/2026` → null, formato malo →
  null, daysUntil 0/positivo/negativo con fechas fijas. ROJO primero.*

### Pantalla Reminders (`src/screens/reminders/index.tsx`, nueva)

- **R6**: WHEN Reminders monta con sesión activa THE SYSTEM SHALL renderizar
  `RemindersScreen` (export de `src/screens/reminders/index.tsx`) dentro de
  un `ScrollView` `testID="screen-reminders"` con las métricas uniformes
  (`contentContainerStyle`: `paddingTop: insets.top + 12`, `padding: 24`,
  `gap: 16`, `paddingBottom: insets.bottom + 96` con `useSafeAreaInsets`),
  título `Reminders`, el selector compartido `PetSwitcher`
  (`src/components/pet-switcher.tsx`) con la misma selección por defecto que
  Home (IF `selectedPetId` null o fuera de la lista THEN
  `selectPet(pets[0].id)`), y el botón `New` (`testID="reminders-add-link"`)
  que llama `router.push('/add-reminder')`; AND al resolver
  `listReminders` de la mascota seleccionada vía `useApi`:
  - WHILE la carga vuela SHALL mostrar `testID="reminders-loading"` —
    **Skeleton de heroui-native dimensionado como las filas finales (3
    filas de alto fijo), nunca Spinner** (convención nueva);
  - IF `kind === 'ok'` con lista vacía THEN SHALL mostrar
    `No reminders yet` (`testID="reminders-empty"`);
  - IF `kind === 'error' | 'unreachable' | 'missing-config' | 'not-found'`
    THEN SHALL mostrar `Something went wrong` (`testID="reminders-error"`)
    con `Button` `Retry` (`testID="reminders-retry"`) que llama `refetch`.
  *Test: `mobile-pet-tracker/src/screens/reminders/index.test.tsx` (colocado
  junto al screen body, convención nueva) → `describe('R6: reminders monta
  con métricas y estados', ...)` mockeando `../../api/pets`,
  `../../api/reminders`, `../../providers/auth-provider` y `expo-router`;
  `SelectedPetProvider` real como wrapper (patrón #37/#38); assert del
  `contentContainerStyle` exacto. ROJO primero.*

- **R7**: WHEN `listReminders` resuelve `ok` con elementos THE SYSTEM SHALL
  mostrar (fecha "ahora" = reloj del dispositivo, tests con fake timers):
  - las tres pills resumen (diseño l.931–942): `testID="pill-active"` =
    nº con status `scheduled`, `testID="pill-week"` = nº `scheduled` con
    `0 <= daysUntil(now, dueAt) <= 7` (label `This week`),
    `testID="pill-inactive"` = nº `sent` + `cancelled`;
  - una fila por reminder en el orden recibido (backend ya ordena asc):
    `testID="reminder-row-<id>"` con el emoji y label de su `type` según
    `REMINDER_TYPE_META` de `src/utils/reminder-meta.ts` ([[design]] §D5),
    el `title`, y la fecha `dueAt` formateada `toLocaleDateString()`;
  - IF status `scheduled` THEN la fila añade `· in N days`
    (`N = daysUntil`) y, IF `0 <= N <= 10` (umbral del diseño l.954),
    el badge `Upcoming!` (`testID="reminder-upcoming-<id>"`);
  - IF status `sent` o `cancelled` THEN la fila se renderiza con opacidad
    0.5 (diseño l.947) y muestra el status como texto
    (`testID="reminder-status-<id>"`, `Sent` / `Cancelled`) en vez de
    `in N days`;
  - AND la pantalla SHALL refetchear la lista al recuperar el foco
    (`useFocusEffect` de expo-router, [[design]] §D9) para que el alta de
    AddReminder aparezca al volver.
  *Test: mismo archivo → `describe('R7: lista con pills, badges y refetch
  on focus', ...)` con `jest.useFakeTimers` + `setSystemTime` y fixtures:
  scheduled próximo (badge), scheduled lejano (sin badge), sent y
  cancelled (opacidad + status). ROJO primero.*

- **R8**: WHILE una fila tiene status `scheduled` THE SYSTEM SHALL mostrar
  su botón de cancelación (`testID="reminder-cancel-<id>"`); WHEN se pulsa
  THE SYSTEM SHALL pedir confirmación con `Alert.alert` de react-native
  ([[design]] §D10) y, al confirmar, llamar `cancelReminder`:
  - `ok` o `conflict` (otra sesión ya lo canceló) → refetch de la lista;
  - `forbidden` → mostrar `Only the owner can cancel`
    (`testID="reminders-action-error"`);
  - `not-found | error | missing-config` → `Something went wrong`
    (mismo testID); `unreachable` → `Cannot reach server` (mismo testID);
  - WHILE el PATCH vuela el botón de esa fila SHALL estar deshabilitado.
  Las filas `sent`/`cancelled` NO muestran el botón (no hay reactivación,
  [[design]] §D3).
  *Test: mismo archivo → `describe('R8: cancelar recordatorio con
  confirmación', ...)` con spy de `Alert.alert` (invocando el botón
  confirmatorio del spy), `cancelReminder` mockeado por kind y assert de
  nuevo `listReminders` tras `ok`. ROJO primero.*

### Pantalla AddReminder (`src/screens/add-reminder/index.tsx`, nueva)

- **R9**: WHEN AddReminder monta THE SYSTEM SHALL renderizar
  `AddReminderScreen` (export de `src/screens/add-reminder/index.tsx`) con
  `testID="screen-add-reminder"`, las mismas métricas uniformes de R6,
  título `Add reminder`, botón `testID="add-reminder-back"` que llama
  `router.back()`, y el formulario (diseño l.1022–1096, campos no
  persistibles fuera de alcance):
  - chips de tipo: uno por cada uno de los 7 `ReminderType`
    (`testID="type-chip-<type>"`, label y emoji de `REMINDER_TYPE_META`),
    seleccionado con `accessibilityState={{ selected: true }}`, default
    `vaccine`;
  - `TextInput` título (`testID="title-input"`, `maxLength={120}`);
  - `TextInput` fecha (`testID="date-input"`, placeholder `DD/MM/AAAA`) y
    hora (`testID="time-input"`, placeholder `HH:MM`, valor inicial
    `09:00`) — texto plano, sin picker ([[design]] §D6);
  - chips de alerta (`testID="advance-chip-<minutes>"`): `Same day` → 0,
    `1 day before` → 1440, `3 days before` → 4320, `7 days before` → 10080;
    default 10080 (diseño l.986);
  - `Button` `Save reminder` (`testID="add-reminder-submit"`).
  IF `selectedPetId === null` THEN SHALL renderizar
  `<Redirect href="/reminders" />` (patrón weight-log #37).
  *Test: `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx` →
  `describe('R9: formulario de alta con chips y campos', ...)` mockeando
  `../../api/reminders`, `../../providers/auth-provider` y `expo-router`;
  `SelectedPetProvider` real con selección inicial. ROJO primero.*

- **R10**: WHEN se pulsa `Save reminder` THE SYSTEM SHALL validar en local:
  IF `title.trim()` vacío THEN `Title is required`; ELSE IF
  `parseDueAt(date, time)` es `null` THEN `Enter a valid date (DD/MM/AAAA)`;
  ELSE IF el `Date` no es futuro THEN `Date must be in the future` — todos
  en `testID="add-reminder-error"` sin llamar la API. IF la validación pasa
  THEN SHALL llamar `createReminder` con
  `{ type, title: title.trim(), dueAt: parsed.toISOString(), advanceMinutes }`
  y, según `kind`:
  - `ok` → `router.back()` (Reminders refetchea por foco, R7);
  - `forbidden` → `Only the owner can create reminders`;
  - `invalid` → `Date must be in the future` (única causa realista de 400
    tras validar local: carrera con el reloj);
  - `error | missing-config` → `Something went wrong`;
  - `unreachable` → `Cannot reach server`;
  (todos en `testID="add-reminder-error"`); AND WHILE el POST vuela el
  botón SHALL estar deshabilitado.
  *Test: mismo archivo → `describe('R10: guardar con validación y
  degradación por kind', ...)` con fake timers para el caso futuro/pasado,
  assert del body exacto enviado y de `router.back()` en ok. ROJO
  primero.*

### Navegación y estructura (rutas delgadas, R11)

- **R11**: WHEN el usuario navega THE SYSTEM SHALL exponer las rutas
  ocultas `/reminders` y `/add-reminder` con **route files delgados**
  (convención nueva): `src/app/(tabs)/reminders.tsx` exporta default un
  componente que solo renderiza `<RemindersScreen />` importado de
  `../../screens/reminders`, y `src/app/(tabs)/add-reminder.tsx` ídem con
  `<AddReminderScreen />` de `../../screens/add-reminder` — sin lógica, sin
  estado, sin estilos (reviewer verifica por diff que cada route file queda
  en <10 líneas); ambas quedan fuera de la tab bar sin tocar
  `floating-tab-bar.tsx` ni `_layout.tsx`. AND la pantalla Health
  (`src/app/(tabs)/health.tsx`) SHALL mostrar el `Pressable`
  `testID="reminders-link"` (texto `Reminders`, mismo patrón visual que
  `weight-log-link`) que llama `router.push('/reminders')`.
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/health.test.tsx`
  (extender, test-primero: las suites existentes NO se modifican, solo se
  añade) → `describe('R11: health enlaza a reminders', ...)` con assert de
  `router.push('/reminders')`. Los route files quedan cubiertos por el
  smoke R13 y el diff del reviewer. ROJO primero.*

### Tipado y contención

- **R12**: WHEN se ejecuta `bun run typecheck` y `bun run lint` en
  `mobile-pet-tracker/` THE SYSTEM SHALL salir con exit 0; AND
  `bun run test` SHALL quedar verde con las suites de #33–#38 y #46
  intactas (único diff sobre tests existentes: la extensión de
  `health.test.tsx` de R11); AND `pnpm -C backend-pet-tracker run test`
  y `./init.sh` SHALL salir con exit 0; AND el diff de backend SHALL
  tocar SOLO `backend-pet-tracker/src/modules/reminders/` y
  `backend-pet-tracker/test/pet-reminders.e2e-spec.ts`; AND
  `mobile-pet-tracker/package.json` SHALL quedar sin diff (cero deps
  nuevas; `expo-notifications` no aparece en el código).
  *Verificación: implementer lo anota en
  `progress/impl_mobile-reminders.md`; reviewer re-ejecuta y corre
  `git diff --stat main...HEAD -- backend-pet-tracker/ | grep -v "modules/reminders\|pet-reminders.e2e"`
  (vacío), `git diff main...HEAD -- mobile-pet-tracker/package.json`
  (vacío) y `grep -rn "expo-notifications" mobile-pet-tracker/src/`
  (vacío).*

### Prueba de humo del humano

- **R13**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL mostrar el flujo completo contra el backend local
  (misma WiFi, `.env` con IP LAN, `docker compose up -d` +
  `pnpm -C backend-pet-tracker run start:dev`):
  1. `bunx expo start --go` desde `mobile-pet-tracker/` y escanear el QR.
  2. Login → tab Health → link `Reminders` → pantalla vacía
     (`No reminders yet`), sin salto de layout (skeleton dimensionado).
  3. `New` → Add reminder: elegir tipo, título, fecha futura → `Save` →
     vuelve a la lista y el reminder aparece sin refrescar a mano.
  4. Fecha pasada o título vacío → error de formulario sin llamada de red.
  5. Reminder con `dueAt` a pocos días → badge `Upcoming!` y pill
     `This week` coherentes.
  6. Cancelar un reminder → confirmación → pasa a `Cancelled` con
     opacidad reducida y sin botón de cancelar.
  7. Con cuenta no-owner: crear y cancelar degradan con mensaje, sin crash.
  8. Cambiar de mascota en el `PetSwitcher` → la lista se recarga.
  9. Backend apagado → `Something went wrong` + Retry funcional.
  10. Tab bar flotante no tapa contenido en ambas pantallas.

  - [ ] Smoke ejecutado por el humano (fecha: ____)

## Fuera de alcance

- **Notificaciones push/locales en el dispositivo** (explícito en
  `feature_list.json` #39): requeriría `expo-notifications` y dev build;
  backlog. El backend ya agenda/despacha por su lado (`channel: 'push'`);
  esta feature no lo toca.
- **Editar/reprogramar** un reminder (el PATCH de edición existe pero la UI
  v1 solo cancela). Feature futura si el humano la pide.
- **Reactivar** un reminder cancelado y **hard delete** (no existen en
  backend; el toggle del diseño degrada a cancelación unidireccional §D3).
- Campos del diseño sin respaldo en backend: veterinario, clínica, teléfono
  de emergencia, notas y repetición (l.1049–1096) — el schema strict los
  rechazaría.
- Resumen `Esta semana` como filtro interactivo (las pills son informativas).
- Imagen hero de la mascota y gradientes del diseño (línea #38 D9).
- Cambios en backend fuera del GET de listado de R1 (nada de DELETE, nada
  en scheduler/dispatch).

## Decisiones para el gate humano

1. **Alcance backend en #39**: `feature_list.json` solo listaba archivos
   móviles, pero sin `GET /pets/:petId/reminders` el listado es imposible.
   R1 lo añade mínimo y por capas. ¿OK dentro de esta feature?
2. **Borrado = cancelación**: no hay DELETE en backend; el criterio
   "borrado" se cumple con `PATCH {status:'cancelled'}`, unidireccional y
   con confirmación `Alert.alert`. ¿OK?
3. **Entrada por Health** (`reminders-link`, patrón weight-log). La
   alternativa era Profile. ¿OK?
4. **Fecha/hora por TextInput** (`DD/MM/AAAA` + `HH:MM`): cero deps nuevas
   y compatible Expo Go; sin picker nativo en v1. ¿OK?
5. Los 7 tipos del backend se exponen tal cual como chips (el diseño
   muestra 5 categorías propias que no casan 1:1). ¿OK?

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
