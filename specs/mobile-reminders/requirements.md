---
feature: "mobile-reminders"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-reminders]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D11). Feature 100% móvil: aplican
> `docs/conventions.md` §Convenciones de la app móvil — **incluidas las dos
> nuevas**: Estructura Expo oficial (route file delgado + screen body en
> `src/screens/`) y Dimensiones de pantalla uniformes (métricas de
> `home.tsx`, Skeleton dimensionado, `PetSwitcher` compartido). #39 es la
> PRIMERA feature bajo esa estructura: los paths de esta spec son
> normativos.
> Contratos del backend = los de **#47 (reminders-api)**, verificados
> contra `specs/reminders-api/design.md` §D3 y el código existente del
> módulo (`reminder.dto.ts`, `reminder.mapper.ts`) el 2026-08-24.
> Diseño de referencia: `specs/mobile-figma-polish/design-src/App.tsx` —
> `RemindersScreen` líneas 905–971, `AddReminderScreen` líneas 976–1107.

## Dependencia dura

**#47 (reminders-api) debe estar `done` (aprobada por reviewer y mergeada)
antes del handoff de #39 a Codex.** Esta spec consume sus dos endpoints:
`GET /pets/:petId/reminders` (listado) y
`DELETE /pets/:petId/reminders/:id` (borrado real, 204). El leader no
lanza el handoff hasta verificarlo en `feature_list.json`.

## Contexto fijo (no reabrir — decisiones del gate humano, 2026-08-24)

- **Gate resuelto**: (1) el GET de listado y (2) el DELETE real viven en
  #47, no aquí; (3) la entrada a Reminders es por el tab **Profile**;
  (4) fecha/hora con **picker nativo**, no TextInput; (5) los 7 tipos del
  backend como chips quedan como estaban.
- Base: estado tras #38 — tabs reales; `SelectedPetProvider` en
  `src/app/(tabs)/_layout.tsx`; `useApi` con stale-while-revalidate (401 →
  `signOut()`); clientes `fetchFn`/`kind` en `src/api/` (`http.ts` con
  `getJson`/`postJson`/`readJson`/`apiUrl` — **no existe `deleteJson`, lo
  añade R3**). Rutas ocultas fuera de la tab bar por el array `TABS` de
  `floating-tab-bar.tsx` (mismo mecanismo que `weight-log`/`meal-schedule`)
  — **cero cambios** en `_layout.tsx` y `floating-tab-bar.tsx`.
- Contratos backend (POST existente + #47): `CreateReminderSchema` es
  `strictObject`: solo `type`, `title` (trim, 1–120), `dueAt` (ISO con
  offset, **futuro**), `advanceMinutes` (int 0–10080, opcional). Tipos:
  `vaccine | deworming | medication | appointment | weight | food | custom`;
  status `scheduled | sent | cancelled`. `ReminderResponse` =
  `{ id, petId, type, title, dueAt, advanceMinutes, status }`. POST → 201;
  GET → 200 array orden `dueAt` asc (todos los status); DELETE → 204 sin
  body, solo owner (403 caregiver/viewer, 404 inexistente/no-miembro).
  El PATCH de cancelación NO se usa en esta feature.
- **Única dependencia nueva permitida:
  `@react-native-community/datetimepicker`** — excepción justificada a
  "cero deps" decidida en el gate ([[design]] §D6): está incluida en Expo
  Go (verificado en `expo/bundledNativeModules.json` del proyecto, v9.1.0
  para SDK 57) y se instala con `bunx expo install
  @react-native-community/datetimepicker` desde `mobile-pet-tracker/`.
  Ninguna otra dependencia. **`expo-notifications` NO se instala**:
  notificaciones locales fuera de alcance (backlog).
- Decisión de #33 (vigente): funciones de `src/api/` reciben
  `token`/`fetchFn` por parámetro, nunca importan React ni storage. Tipos
  a mano en `src/api/types.ts`.
- UI en inglés (decisión de #38 vigente); el diseño está en español, los
  literales de esta spec son los normativos.
- Lección de #34 (vigente): offsets numéricos por `style` inline; el resto
  `className` + tokens (cero hex, cero `StyleSheet.create`). Sin imagen
  hero ni gradientes del diseño (misma línea que #38 D9).
- `profile.tsx` es placeholder y **#40 lo reescribe**: el link a Reminders
  se añade de forma mínima (R10) y #40 DEBE conservarlo (testID
  `reminders-link` + `router.push('/reminders')`) — anotado también en
  [[design]] §D10.
- Smoke humano 100% **Expo Go** (`bunx expo start --go`), SDK 57, Android
  físico. Nada nativo nuevo fuera del picker bundled.

## Requisitos funcionales

### Cliente API (`src/api/reminders.ts`, nuevo)

- **R1**: WHEN se llama `listReminders(baseUrl, token, petId, fetchFn)` de
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
  → `describe('R1: listReminders mapea la respuesta por kind', ...)` con
  `fetchFn` stub por caso, asserts de URL exacta y header Bearer. ROJO
  primero.*

- **R2**: WHEN se llama
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
  *Test: mismo archivo → `describe('R2: createReminder publica y mapea por
  kind', ...)` con asserts de method POST, body JSON exacto y status 201.
  ROJO primero.*

- **R3**: WHEN se llama
  `deleteReminder(baseUrl, token, petId, reminderId, fetchFn)` del mismo
  archivo THE SYSTEM SHALL hacer
  `DELETE ${baseUrl}/pets/${petId}/reminders/${reminderId}` vía
  **`deleteJson` nuevo en `src/api/http.ts`** (misma firma y manejo que
  `getJson`, method `DELETE`, sin body) y devolver un
  `DeleteReminderState`:
  - HTTP 204 → `{ kind: 'ok' }` (sin leer body);
  - HTTP 404 → `{ kind: 'not-found' }`;
  - HTTP 403 → `{ kind: 'forbidden' }`;
  - HTTP 401 → `{ kind: 'unauthorized' }`;
  - otro status → `{ kind: 'error' }`;
  - `fetchFn` lanza → `{ kind: 'unreachable', message }`;
  - `baseUrl` undefined → `{ kind: 'missing-config' }`.
  AND ningún archivo bajo `src/api/` SHALL importar React ni
  `expo-secure-store` (regla #33; reviewer grep).
  *Test: mismo archivo → `describe('R3: deleteReminder borra y mapea por
  kind', ...)` con asserts de method DELETE, URL exacta y ausencia de body
  (cubre `deleteJson`; no hay suite propia de http.ts). ROJO primero.*

### Utilidades de fecha (`src/utils/reminder-dates.ts`, nuevo)

- **R4**: WHEN se llama `combineDateAndTime(date, time)` de
  `mobile-pet-tracker/src/utils/reminder-dates.ts` (ambos `Date`, salidos
  de los pickers de R8) THE SYSTEM SHALL devolver un `Date` local con
  año/mes/día de `date` y hora/minuto de `time` (segundos y ms a 0); AND
  WHEN se llama `daysUntil(from, to)` THE SYSTEM SHALL devolver
  `Math.ceil((to.getTime() - from.getTime()) / 86_400_000)` (entero, puede
  ser negativo).
  *Test: `mobile-pet-tracker/src/utils/reminder-dates.test.ts` (colocado
  al lado, convención nueva) → `describe('R4: reminder-dates combina y
  cuenta días', ...)` con fechas fijas: combinación correcta, daysUntil
  0/positivo/negativo. ROJO primero.*

### Pantalla Reminders (`src/screens/reminders/index.tsx`, nueva)

- **R5**: WHEN Reminders monta con sesión activa THE SYSTEM SHALL renderizar
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
  junto al screen body, convención nueva) → `describe('R5: reminders monta
  con métricas y estados', ...)` mockeando `../../api/pets`,
  `../../api/reminders`, `../../providers/auth-provider` y `expo-router`;
  `SelectedPetProvider` real como wrapper (patrón #37/#38); assert del
  `contentContainerStyle` exacto. ROJO primero.*

- **R6**: WHEN `listReminders` resuelve `ok` con elementos THE SYSTEM SHALL
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
  *Test: mismo archivo → `describe('R6: lista con pills, badges y refetch
  on focus', ...)` con `jest.useFakeTimers` + `setSystemTime` y fixtures:
  scheduled próximo (badge), scheduled lejano (sin badge), sent y
  cancelled (opacidad + status). ROJO primero.*

- **R7**: WHILE una fila existe (cualquier status — el DELETE de #47 borra
  cualquier reminder) THE SYSTEM SHALL mostrar su botón de borrado
  (`testID="reminder-delete-<id>"`); WHEN se pulsa THE SYSTEM SHALL pedir
  confirmación con `Alert.alert` de react-native ([[design]] §D10 — el
  borrado es irreversible) y, al confirmar, llamar
  `deleteReminder(baseUrl, token, petId, id)`:
  - `ok` → refetch de la lista (la fila desaparece);
  - `not-found` (otra sesión ya lo borró) → refetch de la lista;
  - `forbidden` → mostrar `Only the owner can delete`
    (`testID="reminders-action-error"`);
  - `error | missing-config` → `Something went wrong` (mismo testID);
  - `unreachable` → `Cannot reach server` (mismo testID);
  - WHILE el DELETE vuela el botón de esa fila SHALL estar deshabilitado.
  *Test: mismo archivo → `describe('R7: borrar recordatorio con
  confirmación', ...)` con spy de `Alert.alert` (invocando el botón
  confirmatorio del spy), `deleteReminder` mockeado por kind y assert de
  nuevo `listReminders` tras `ok` y `not-found`. ROJO primero.*

### Pantalla AddReminder (`src/screens/add-reminder/index.tsx`, nueva)

- **R8**: WHEN AddReminder monta THE SYSTEM SHALL renderizar
  `AddReminderScreen` (export de `src/screens/add-reminder/index.tsx`) con
  `testID="screen-add-reminder"`, las mismas métricas uniformes de R5,
  título `Add reminder`, botón `testID="add-reminder-back"` que llama
  `router.back()`, y el formulario (diseño l.1022–1096, campos no
  persistibles fuera de alcance):
  - chips de tipo: uno por cada uno de los 7 `ReminderType`
    (`testID="type-chip-<type>"`, label y emoji de `REMINDER_TYPE_META`),
    seleccionado con `accessibilityState={{ selected: true }}`, default
    `vaccine`;
  - `TextInput` título (`testID="title-input"`, `maxLength={120}`);
  - campo fecha: `Pressable` `testID="date-field"` que muestra la fecha
    elegida (`toLocaleDateString()`) o `Select a date`, y al pulsarse abre
    un `DateTimePicker` de `@react-native-community/datetimepicker`
    (`testID="date-picker"`, `mode="date"`,
    `minimumDate={new Date()}`) — visible solo mientras se elige; al
    recibir `onChange` con fecha SHALL guardarla y cerrar el picker
    ([[design]] §D6);
  - campo hora: ídem con `testID="time-field"` /
    `testID="time-picker"` (`mode="time"`), valor inicial 09:00;
  - chips de alerta (`testID="advance-chip-<minutes>"`): `Same day` → 0,
    `1 day before` → 1440, `3 days before` → 4320, `7 days before` → 10080;
    default 10080 (diseño l.986);
  - `Button` `Save reminder` (`testID="add-reminder-submit"`).
  IF `selectedPetId === null` THEN SHALL renderizar
  `<Redirect href="/reminders" />` (patrón weight-log #37).
  *Test: `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx` →
  `describe('R8: formulario de alta con chips y pickers', ...)` mockeando
  `../../api/reminders`, `../../providers/auth-provider`, `expo-router` y
  `@react-native-community/datetimepicker` (mock component que expone
  `onChange` — patrón en [[design]] §D6); asserts: picker no visible al
  montar, visible tras pulsar el campo, fecha reflejada tras `onChange`.
  ROJO primero.*

- **R9**: WHEN se pulsa `Save reminder` THE SYSTEM SHALL validar en local:
  IF `title.trim()` vacío THEN `Title is required`; ELSE IF no hay fecha
  elegida THEN `Pick a date`; ELSE IF
  `combineDateAndTime(fecha, hora)` no es futuro THEN
  `Date must be in the future` — todos en `testID="add-reminder-error"`
  sin llamar la API. IF la validación pasa THEN SHALL llamar
  `createReminder` con `{ type, title: title.trim(), dueAt:
  combineDateAndTime(fecha, hora).toISOString(), advanceMinutes }` y,
  según `kind`:
  - `ok` → `router.back()` (Reminders refetchea por foco, R6);
  - `forbidden` → `Only the owner can create reminders`;
  - `invalid` → `Date must be in the future` (única causa realista de 400
    tras validar local: carrera con el reloj);
  - `error | missing-config` → `Something went wrong`;
  - `unreachable` → `Cannot reach server`;
  (todos en `testID="add-reminder-error"`); AND WHILE el POST vuela el
  botón SHALL estar deshabilitado.
  *Test: mismo archivo → `describe('R9: guardar con validación y
  degradación por kind', ...)` con fake timers para el caso futuro/pasado,
  assert del body exacto enviado y de `router.back()` en ok. ROJO
  primero.*

### Navegación y estructura (rutas delgadas, R10)

- **R10**: WHEN el usuario navega THE SYSTEM SHALL exponer las rutas
  ocultas `/reminders` y `/add-reminder` con **route files delgados**
  (convención nueva): `src/app/(tabs)/reminders.tsx` exporta default un
  componente que solo renderiza `<RemindersScreen />` importado de
  `../../screens/reminders`, y `src/app/(tabs)/add-reminder.tsx` ídem con
  `<AddReminderScreen />` de `../../screens/add-reminder` — sin lógica, sin
  estado, sin estilos (reviewer verifica por diff que cada route file queda
  en <10 líneas); ambas quedan fuera de la tab bar sin tocar
  `floating-tab-bar.tsx` ni `_layout.tsx`. AND el tab Profile
  (`src/app/(tabs)/profile.tsx`, hoy placeholder) SHALL mostrar el
  `Pressable` `testID="reminders-link"` (texto `Reminders`, mismo patrón
  visual que `weight-log-link` de health) que llama
  `router.push('/reminders')` — **cambio mínimo sobre el placeholder**:
  se añade el Pressable sin tocar nada más (`screen-profile`, health
  check, theme toggle y sign out intactos, sus tests actuales siguen
  verdes sin modificación). NOTA para #40 (reescritura de Profile): la
  pantalla nueva DEBE conservar `reminders-link` y su navegación; queda
  anotado aquí y en [[design]] §D10 para la spec de #40.
  *Test: `mobile-pet-tracker/src/app/(tabs)/__tests__/profile.test.tsx`
  (extender, test-primero: solo se añade un describe nuevo) →
  `describe('R10: profile enlaza a reminders', ...)` mockeando
  `expo-router` con assert de `router.push('/reminders')`. Los route
  files quedan cubiertos por el smoke R12 y el diff del reviewer. ROJO
  primero.*

### Tipado y contención

- **R11**: WHEN se ejecuta `bun run typecheck` y `bun run lint` en
  `mobile-pet-tracker/` THE SYSTEM SHALL salir con exit 0; AND
  `bun run test` SHALL quedar verde con las suites de #33–#38 y #46
  intactas (único diff sobre tests existentes: la extensión de
  `profile.test.tsx` de R10); AND `./init.sh` SHALL salir con exit 0; AND
  el diff de `mobile-pet-tracker/package.json` SHALL contener
  **exactamente una** dependencia nueva
  (`@react-native-community/datetimepicker`, instalada con `bunx expo
  install`) y ninguna otra; AND `backend-pet-tracker/` SHALL quedar sin
  diff en esta branch (el backend es #47); AND `expo-notifications` NO
  SHALL aparecer ni en `package.json` ni en el código.
  *Verificación: implementer lo anota en
  `progress/impl_mobile-reminders.md`; reviewer re-ejecuta y corre
  `git diff --stat main...HEAD -- backend-pet-tracker/` (vacío),
  `git diff main...HEAD -- mobile-pet-tracker/package.json` (solo la
  línea del picker) y
  `grep -rn "expo-notifications" mobile-pet-tracker/` (vacío, excluyendo
  node_modules).*

### Prueba de humo del humano

- **R12**: WHEN el humano ejecuta la prueba de humo **en Expo Go** THE
  SYSTEM SHALL mostrar el flujo completo contra el backend local con #47
  mergeado (misma WiFi, `.env` con IP LAN, `docker compose up -d` +
  `pnpm -C backend-pet-tracker run start:dev`):
  1. `bunx expo start --go` desde `mobile-pet-tracker/` y escanear el QR.
  2. Login → tab Profile → link `Reminders` → pantalla vacía
     (`No reminders yet`), sin salto de layout (skeleton dimensionado).
  3. `New` → Add reminder: elegir tipo y título; el campo fecha abre el
     picker NATIVO de fecha y el de hora el de hora (Expo Go, sin crash) →
     `Save` → vuelve a la lista y el reminder aparece sin refrescar a mano.
  4. Título vacío o sin fecha → error de formulario sin llamada de red.
  5. Reminder con `dueAt` a pocos días → badge `Upcoming!` y pill
     `This week` coherentes.
  6. Borrar un reminder → confirmación → la fila desaparece y el GET
     posterior ya no lo trae (borrado real).
  7. Con cuenta no-owner: crear y borrar degradan con mensaje, sin crash.
  8. Cambiar de mascota en el `PetSwitcher` → la lista se recarga.
  9. Backend apagado → `Something went wrong` + Retry funcional.
  10. Tab bar flotante no tapa contenido en ambas pantallas.

  - [ ] Smoke ejecutado por el humano (fecha: ____)

## Fuera de alcance

- **Backend**: GET listado y DELETE viven en #47 (`specs/reminders-api/`);
  esta feature no toca `backend-pet-tracker/`.
- **Notificaciones push/locales en el dispositivo** (explícito en
  `feature_list.json` #39): requeriría `expo-notifications` y dev build;
  backlog. El backend ya agenda/despacha por su lado (`channel: 'push'`);
  esta feature no lo toca.
- **Editar/reprogramar** un reminder (el PATCH de edición existe pero la
  UI v1 solo lista/crea/borra). **Cancelar** (PATCH `cancelled`) tampoco:
  el gate eligió borrado real.
- Campos del diseño sin respaldo en backend: veterinario, clínica, teléfono
  de emergencia, notas y repetición (l.1049–1096) — el schema strict los
  rechazaría.
- Resumen `This week` como filtro interactivo (las pills son informativas).
- Imagen hero de la mascota y gradientes del diseño (línea #38 D9).

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-24) ← gate obligatorio antes de implementar
