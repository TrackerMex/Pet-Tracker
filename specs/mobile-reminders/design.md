---
feature: "mobile-reminders"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-reminders]]

> Ver [[requirements]] (R1–R13). R1 sigue las capas de
> `docs/architecture.md`; el resto es móvil bajo
> `docs/conventions.md` §Convenciones de la app móvil, incluidas la
> Estructura Expo oficial y las Dimensiones de pantalla uniformes (esta es
> la primera feature con `src/screens/`).

## Decisiones técnicas

- **D1 — Fuente del diseño**: `specs/mobile-figma-polish/design-src/App.tsx`,
  `RemindersScreen` l.905–971 (hero, pills resumen l.931–942, filas con
  badge `¡Próximo!` cuando `daysLeft <= 10` l.954, inactivos a opacidad 0.5
  l.947) y `AddReminderScreen` l.976–1107 (chips de categoría l.1022–1036,
  campos l.1047–1059, chips de alerta l.1074–1088, guardar l.1099–1105).
  No hace falta el MCP de Figma. Sirve a R6–R10.

- **D2 — GET de listado en backend (R1)**: el módulo reminders no tiene
  endpoint de lectura; sin él, el criterio "listado contra el backend" es
  incumplible. Adición mínima por capas:
  - domain: `listByPet(petId: string): Promise<Reminder[]>` en
    `ReminderRepository`
    (`src/modules/reminders/domain/repositories/reminder.repository.ts`).
  - infrastructure: implementación en `ReminderDrizzleRepository` con
    `where(eq(reminders.petId, petId))` + `orderBy(asc(reminders.dueAt))`
    (mismo estilo que `findDue`).
  - application: `ListRemindersUseCase`
    (`src/modules/reminders/application/use-cases/list-reminders.use-case.ts`)
    con `execute(petId: string): Promise<Reminder[]>` — inyecta
    `REMINDER_REPOSITORY`, registrarlo en `reminders.module.ts` providers.
  - infrastructure: en `PetRemindersController` (ya bajo `PetAccessGuard`):
    ```ts
    @Get()
    async list(@Req() request: PetAccessRequest): Promise<ReminderResponse[]>
    ```
    sin `@RequirePetRole` (los GET no exigen rol, como nutrition; el guard
    da 404 a no-miembros). Mapea con `toReminderResponse` existente.
  Devuelve todos los status: la UI necesita los inactivos para las pills y
  la lista del diseño. Sin paginación (volumen por mascota es pequeño;
  YAGNI).

- **D3 — "Borrado" = cancelación**: el backend no tiene DELETE y su dominio
  trata los reminders como agendables (`scheduleName`, dispatch): cancelar
  es la operación soportada (`PATCH /reminders/:id` con
  `{status:'cancelled'}`, solo owner, solo desde `scheduled`, 409 si ya no
  es editable). La UI degrada el toggle del diseño a una cancelación
  unidireccional con confirmación; no hay reactivación. Sirve a R4/R8.

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
  export type CancelReminderState =
    | { kind: 'ok'; reminder: Reminder } | { kind: 'not-found' }
    | { kind: 'forbidden' } | { kind: 'conflict' }
    | { kind: 'unauthorized' } | { kind: 'error' }
    | { kind: 'unreachable'; message: string } | { kind: 'missing-config' };

  export async function listReminders(baseUrl: string | undefined, token: string, petId: string, fetchFn?: typeof fetch): Promise<RemindersState>;
  export async function createReminder(baseUrl: string | undefined, token: string, petId: string, input: CreateReminderInput, fetchFn?: typeof fetch): Promise<CreateReminderState>;
  export async function cancelReminder(baseUrl: string | undefined, token: string, reminderId: string, fetchFn?: typeof fetch): Promise<CancelReminderState>;
  ```
  `patchJson` en `http.ts`: copia de `postJson` con `method: 'PATCH'`.
  El POST devuelve **201** (Nest default) — no comparar contra 200.
  `dueAt` se envía como `new Date(...).toISOString()` (UTC `Z`, aceptado
  por `z.iso.datetime({ offset: true })`).

- **D5 — Metadatos de tipo** (`src/utils/reminder-meta.ts`, nuevo, solo
  datos — sin test propio, cubierto por R7/R9):
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
  Se exponen los 7 tipos del backend tal cual; las 5 categorías del diseño
  (incl. "Baño") no casan 1:1 con el enum y no se inventan tipos nuevos.
  Colores por token de tema, no los hex del diseño.

- **D6 — Fecha/hora por TextInput**: no hay picker instalado
  (`@react-native-community/datetimepicker` no está en package.json) y la
  regla es cero deps nuevas + Expo Go. El propio diseño usa un input de
  texto con placeholder `DD / MM / AAAA` (l.1059). `parseDueAt` +
  validación local en R10 cubren el formato; el 400 del backend queda como
  red de seguridad. Sirve a R5/R9/R10.

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
  selector de mascota = `PetSwitcher` compartido. Sirve a R6/R9.

- **D9 — Refresco al volver de AddReminder**: `useFocusEffect` de
  expo-router en RemindersScreen dispara `refetch()` al recuperar foco.
  Evita pasar callbacks entre rutas o estado global nuevo. Sirve a R7/R10.

- **D10 — Confirmación de cancelación**: `Alert.alert` de react-native
  (nativo, cero deps, testeable con spy). La cancelación es irreversible
  (D3), merece confirmación. Sirve a R8.

- **D11 — Sin react-query**: el umbral de #36 no se cruza — dos pantallas,
  invalidación por `refetch()` + foco. `useApi` existente basta.

## Archivos afectados

Backend (todo dentro de `backend-pet-tracker/`, capas indicadas):

- `src/modules/reminders/domain/repositories/reminder.repository.ts` —
  añade `listByPet` (domain).
- `src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts`
  — implementa `listByPet` (infrastructure).
- `src/modules/reminders/application/use-cases/list-reminders.use-case.ts`
  — nuevo (application) + su `.spec.ts`.
- `src/modules/reminders/infrastructure/reminders.controller.ts` — `@Get()`
  en `PetRemindersController` (infrastructure).
- `src/modules/reminders/reminders.module.ts` — registra el use case.
- `test/pet-reminders.e2e-spec.ts` — casos R1.

Móvil (todo dentro de `mobile-pet-tracker/`):

- `src/api/http.ts` — añade `patchJson` (R4).
- `src/api/types.ts` — añade `Reminder`, `ReminderType`, `ReminderStatus`.
- `src/api/reminders.ts` — nuevo cliente (R2–R4).
- `src/api/__tests__/reminders.test.ts` — nuevo (patrón de suites api).
- `src/utils/reminder-dates.ts` + `src/utils/reminder-dates.test.ts` —
  nuevos (R5).
- `src/utils/reminder-meta.ts` — nuevo (D5).
- `src/screens/reminders/index.tsx` + `index.test.tsx` — nuevos (R6–R8).
- `src/screens/add-reminder/index.tsx` + `index.test.tsx` — nuevos (R9–R10).
- `src/app/(tabs)/reminders.tsx`, `src/app/(tabs)/add-reminder.tsx` —
  route files delgados nuevos (R11).
- `src/app/(tabs)/health.tsx` — añade `reminders-link` (R11).
- `src/app/(tabs)/__tests__/health.test.tsx` — extiende con R11.

## Alternativas descartadas

- **expo-notifications / notificaciones locales**: fuera por decisión del
  humano en `feature_list.json` #39 (requeriría dev build, rompe la regla
  de Expo Go). Backlog.
- **DELETE real en backend**: el dominio agenda/despacha; borrar filas
  rompería la trazabilidad de `sent` y duplicaría lo que `cancel` ya hace.
- **@react-native-community/datetimepicker o @expo/ui DateTimePicker para
  la fecha**: dependencia/complejidad nueva para un campo que el diseño ya
  muestra como texto; v1 con TextInput validado.
- **Toggle bidireccional como el diseño**: reactivar exigiría un endpoint
  nuevo y re-agendado en EventBridge; cancelación unidireccional (D3).
- **react-query**: umbral de #36 no cruzado (D11).
- **Vet/clínica/teléfono/notas/repetición**: el `strictObject` del backend
  los rechaza; añadirlos sería feature de backend, no de esta spec.
