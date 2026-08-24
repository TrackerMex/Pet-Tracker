---
feature: "mobile-reminders"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-reminders]]

> Ver [[requirements]] (R1–R12). Feature 100% móvil bajo
> `docs/conventions.md` §Convenciones de la app móvil, incluidas la
> Estructura Expo oficial y las Dimensiones de pantalla uniformes (esta es
> la primera feature con `src/screens/`). El backend que consume es #47
> (`specs/reminders-api/design.md` §D3) — dependencia dura.

## Decisiones técnicas

- **D1 — Fuente del diseño**: `specs/mobile-figma-polish/design-src/App.tsx`,
  `RemindersScreen` l.905–971 (hero, pills resumen l.931–942, filas con
  badge `¡Próximo!` cuando `daysLeft <= 10` l.954, inactivos a opacidad 0.5
  l.947) y `AddReminderScreen` l.976–1107 (chips de categoría l.1022–1036,
  campos l.1047–1059, chips de alerta l.1074–1088, guardar l.1099–1105).
  No hace falta el MCP de Figma. Sirve a R5–R9.

- **D2 — Endpoints consumidos** (#47 + POST existente):
  `GET /pets/:petId/reminders` → 200 `ReminderResponse[]` orden `dueAt`
  asc, todos los status; `POST /pets/:petId/reminders` → 201 (owner);
  `DELETE /pets/:petId/reminders/:id` → 204 sin body (owner; 403
  caregiver/viewer; 404 inexistente/no-UUID/no-miembro). El toggle del
  diseño degrada a **borrado real con confirmación** (decisión del gate);
  el PATCH de cancelación no se consume. Sirve a R1/R3/R7.

- **D3 — Sin react-query**: el umbral de #36 no se cruza — dos pantallas,
  invalidación por `refetch()` + foco. `useApi` existente basta.

- **D4 — Tipos y firmas del cliente móvil** (`src/api/types.ts` +
  `src/api/reminders.ts`), calcados de `reminder.mapper.ts` y
  `reminder.dto.ts`:
  ```ts
  // types.ts (añadir)
  export type ReminderType =
    | 'vaccine' | 'deworming' | 'medication' | 'appointment'
    | 'weight' | 'food' | 'custom';
  export type ReminderStatus = 'scheduled' | 'sent' | 'cancelled';
  export interface Reminder {
    id: string; petId: string; type: ReminderType; title: string;
    dueAt: string; advanceMinutes: number; status: ReminderStatus;
  }

  // reminders.ts
  export interface CreateReminderInput {
    type: ReminderType; title: string; dueAt: string; advanceMinutes: number;
  }
  export type RemindersState =
    | { kind: 'ok'; reminders: Reminder[] } | { kind: 'not-found' }
    | { kind: 'unauthorized' } | { kind: 'error' }
    | { kind: 'unreachable'; message: string } | { kind: 'missing-config' };
  export type CreateReminderState =
    | { kind: 'ok'; reminder: Reminder } | { kind: 'invalid' }
    | { kind: 'forbidden' } | { kind: 'unauthorized' } | { kind: 'error' }
    | { kind: 'unreachable'; message: string } | { kind: 'missing-config' };
  export type DeleteReminderState =
    | { kind: 'ok' } | { kind: 'not-found' } | { kind: 'forbidden' }
    | { kind: 'unauthorized' } | { kind: 'error' }
    | { kind: 'unreachable'; message: string } | { kind: 'missing-config' };

  export async function listReminders(baseUrl: string | undefined, token: string, petId: string, fetchFn?: typeof fetch): Promise<RemindersState>;
  export async function createReminder(baseUrl: string | undefined, token: string, petId: string, input: CreateReminderInput, fetchFn?: typeof fetch): Promise<CreateReminderState>;
  export async function deleteReminder(baseUrl: string | undefined, token: string, petId: string, reminderId: string, fetchFn?: typeof fetch): Promise<DeleteReminderState>;
  ```
  `deleteJson` en `http.ts`: copia de `getJson` con `method: 'DELETE'`
  (sin body; el 204 no se parsea). El POST devuelve **201** (Nest default)
  — no comparar contra 200. `dueAt` se envía como
  `combineDateAndTime(...).toISOString()` (UTC `Z`, aceptado por
  `z.iso.datetime({ offset: true })`).

- **D5 — Metadatos de tipo** (`src/utils/reminder-meta.ts`, nuevo, solo
  datos — sin test propio, cubierto por R6/R8):
  ```ts
  export const REMINDER_TYPE_META: Record<ReminderType, { label: string; emoji: string }> = {
    vaccine:     { label: 'Vaccine',     emoji: '💉' },
    deworming:   { label: 'Deworming',   emoji: '🪱' },
    medication:  { label: 'Medication',  emoji: '💊' },
    appointment: { label: 'Appointment', emoji: '🩺' },
    weight:      { label: 'Weight',      emoji: '⚖️' },
    food:        { label: 'Food',        emoji: '🍖' },
    custom:      { label: 'Other',       emoji: '📌' },
  };
  ```
  Se exponen los 7 tipos del backend tal cual (confirmado en el gate); las
  5 categorías del diseño (incl. "Baño") no casan 1:1 con el enum y no se
  inventan tipos nuevos. Colores por token de tema, no los hex del diseño.

- **D6 — Picker nativo de fecha/hora (rework decidido por el humano tras el
  review)**: drop-in `@expo/ui/community/datetime-picker` de
  `@expo/ui ~57.0.11`, ya instalado y **incluido en Expo Go SDK 57**. Usa
  SwiftUI en iOS y Jetpack Compose/Material 3 en Android; cada árbol
  condicional queda envuelto en `Host` importado desde la raíz `@expo/ui`.
  El manifest instalado de `@expo/ui@57.0.11` no declara
  `@react-native-community/datetimepicker` como dependencia ni peer, así
  que se eliminan la dependencia directa, su entrada de lock y su config
  plugin. Expo valida la versión existente con
  `bunx expo install '@expo/ui@~57.0.11' --bun`; la CLI no expone un
  subcomando uninstall y Bun retira la dependencia directa. En Android el
  componente se monta condicionalmente con `presentation="dialog"`; dos
  campos `Pressable` (fecha y hora) abren cada picker (`mode="date"` con
  `minimumDate`, `mode="time"`). `onValueChange` guarda el `Date` y
  desmonta el picker; `onDismiss` lo desmonta sin cambiar el valor. Los
  tests mockean `Host` y el drop-in, conservan `date-picker`/`time-picker`
  y disparan ambos callbacks. La validación local de R9 se mantiene:
  `minimumDate` no garantiza hora futura. Sirve a R8/R9.

- **D7 — Estructura Expo oficial (primera feature)**: route files delgados
  `src/app/(tabs)/reminders.tsx` y `src/app/(tabs)/add-reminder.tsx`
  (solo `export default` que renderiza el screen), cuerpos en
  `src/screens/reminders/index.tsx` y `src/screens/add-reminder/index.tsx`
  con sus tests colocados (`index.test.tsx` al lado). Helpers en
  `src/utils/` con test al lado. Van dentro del grupo `(tabs)` para
  conservar la tab bar flotante y quedan ocultas por el array fijo `TABS`
  de `floating-tab-bar.tsx` (mismo mecanismo que `weight-log`). Las
  pantallas viejas NO se migran.

- **D8 — Dimensiones uniformes**: ambas pantallas copian el
  `contentContainerStyle` de `home.tsx` (`paddingTop: insets.top + 12`,
  `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom + 96`); loading
  con `Skeleton` de heroui-native dimensionado como las filas (sin saltos);
  selector de mascota = `PetSwitcher` compartido. Sirve a R5/R8.

- **D9 — Refresco al volver de AddReminder**: `useFocusEffect` de
  expo-router en RemindersScreen dispara `refetch()` al recuperar foco.
  Evita pasar callbacks entre rutas o estado global nuevo. Sirve a R6/R9.

- **D10 — Entrada por Profile, mínima y a prueba de #40**: decisión del
  gate (Profile, no Health). `profile.tsx` es placeholder y #40 lo
  reescribe entero: aquí solo se AÑADE un `Pressable`
  `testID="reminders-link"` (patrón visual de `weight-log-link`) sin tocar
  lo existente, y su test va en un describe nuevo de `profile.test.tsx`
  (los describes actuales R5/R6 de placeholders no se modifican).
  **Contrato para #40**: la pantalla Profile nueva debe conservar
  `reminders-link` → `router.push('/reminders')` y mantener verde el
  describe R10 de esta feature — la spec de #40 debe citarlo. Confirmación
  de borrado con `Alert.alert` de react-native (nativo, cero deps,
  testeable con spy): el DELETE es irreversible. Sirve a R7/R10.

- **D11 — daysUntil/combineDateAndTime en `src/utils/reminder-dates.ts`**:
  lógica de fechas fuera de los componentes para testearla con fechas
  fijas sin montar pantallas. `daysUntil` alimenta pills y badges (R6);
  `combineDateAndTime` une los dos pickers en el `dueAt` (R9).

## Archivos afectados

Todo dentro de `mobile-pet-tracker/` (cero backend — #47 aparte):

- `package.json` / lockfile / `app.json` — retiran la dependencia community
  y su config plugin; `@expo/ui ~57.0.11` ya estaba instalado (D6).
- `src/api/http.ts` — añade `deleteJson` (R3).
- `src/api/types.ts` — añade `Reminder`, `ReminderType`, `ReminderStatus`.
- `src/api/reminders.ts` — nuevo cliente (R1–R3).
- `src/api/__tests__/reminders.test.ts` — nuevo (patrón de suites api).
- `src/utils/reminder-dates.ts` + `src/utils/reminder-dates.test.ts` —
  nuevos (R4).
- `src/utils/reminder-meta.ts` — nuevo (D5).
- `src/screens/reminders/index.tsx` + `index.test.tsx` — nuevos (R5–R7).
- `src/screens/add-reminder/index.tsx` + `index.test.tsx` — nuevos (R8–R9).
- `src/app/(tabs)/reminders.tsx`, `src/app/(tabs)/add-reminder.tsx` —
  route files delgados nuevos (R10).
- `src/app/(tabs)/profile.tsx` — añade `reminders-link` al placeholder
  (R10, cambio mínimo).
- `src/app/(tabs)/__tests__/profile.test.tsx` — extiende con R10.

## Alternativas descartadas

- **GET/DELETE dentro de esta feature**: el gate los movió a #47
  (backend puro, reviewer y PR propios); esta spec solo los consume.
- **Cancelación (PATCH `cancelled`) como "borrado"**: era el default de la
  primera versión de esta spec; el humano pidió borrado real (gate
  2026-08-24).
- **Entrada por Health**: el gate eligió Profile; además #40 reescribirá
  Profile y el contrato del link queda documentado (D10).
- **TextInput `DD/MM/AAAA` para la fecha**: era el default "cero deps"; el
  gate pidió picker nativo.
- **`@react-native-community/datetimepicker` directo**: fue la elección
  inicial del gate y quedó reemplazada tras el review por el drop-in de
  `@expo/ui`, ya disponible en Expo Go y sin peer hacia el paquete community.
  `expo-date-picker` no existe como módulo bundled.
- **expo-notifications / notificaciones locales**: fuera por decisión del
  humano en `feature_list.json` #39 (requeriría dev build). Backlog.
- **react-query**: umbral de #36 no cruzado (D3).
- **Vet/clínica/teléfono/notas/repetición**: el `strictObject` del backend
  los rechaza; añadirlos sería feature de backend, no de esta spec.
