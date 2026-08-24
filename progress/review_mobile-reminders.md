# review: mobile-reminders (#39)
Fecha: 2026-08-24
Branch: `feature/39-mobile-reminders`, delta `eddc1ea..4bb47ed` (implementado por Codex)
Veredicto: APROBADO (R1–R11; R12 smoke humano en Expo Go queda pendiente como gate propio — fuera del alcance de esta revisión)

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (`#39` en `feature_list.json`)
- [x] progress/current.md actualizado (sesión #39, siguiente paso reviewer → smoke R12)

## Checklist C3 — Arquitectura
- [x] `src/api/reminders.ts` sin imports de React ni `expo-secure-store` (grep vacío; contrato `fetchFn`/`kind` de #33 respetado)
- [x] `deleteJson` nuevo en `src/api/http.ts` con la misma firma y manejo que `getJson` (method DELETE, sin body)
- [x] Screens consumen la API vía `useApi`/providers; cero `StyleSheet.create` y cero hex en los screens de la feature (grep vacío; offsets numéricos solo en `contentContainerStyle` inline, lección #34)
- [x] Estructura Expo oficial (primera feature bajo la convención nueva): route files delgados de 5 líneas en `src/app/(tabs)/reminders.tsx` y `add-reminder.tsx` que solo renderizan el screen importado; cuerpos en `src/screens/reminders/index.tsx` y `src/screens/add-reminder/index.tsx`; tests colocados junto a cada body (`index.test.tsx`); `reminder-dates.test.ts` colocado junto a su util

## Checklist C4 — TDD
- [x] Cada R1–R10 tiene describe que lo nombra (11 describes verificados por grep en los 5 archivos de test)
- [x] Historial test-primero real: 3 ciclos muestreados con checkout del commit rojo —
  - R1 `377cdef`: suite falla (módulo `reminders.ts` inexistente) → verde en `8e6ae26`
  - R7 `70c645a`: 8 tests fallan → verde en `c343cb8` (18/18 verificado con checkout)
  - R9 `7ff5114`: 10 tests fallan → verde en `7eaed26`
  - Patrón test→feat→docs consistente en los 34 commits del delta

## Checklist C5 — Trazabilidad
- [x] R1–R11 trazados con test + par de commits rojo/verde; única fila "pendiente" es R12 (smoke humano, gate posterior por diseño de la spec — mismo patrón que features móviles previas)
- [x] Commits siguen `tipo(mobile-reminders): <desc> (R<n>)`

## Checklist C6 — Spec aprobada
- [x] `specs/mobile-reminders/requirements.md` con `status: approved` y casilla humana marcada (2026-08-24), commit humano `1d9420f` (AlexisSM377)

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada existente (Profile conserva su placeholder; #40 lo reescribirá)

## Verificaciones específicas de la spec
- [x] **Dimensiones uniformes** (R5/R8): ambos ScrollView con `paddingTop: insets.top + 12`, `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom + 96` — idénticas a `home.tsx` l.94–97 y asseradas en `src/screens/reminders/index.test.tsx` l.149–153
- [x] **Skeleton dimensionado**: 3 filas `h-20 w-full rounded-2xl` (mismo alto `min-h-20` que las filas reales), nunca Spinner
- [x] **PetSwitcher compartido** (`src/components/pet-switcher.tsx`) con la selección por defecto de Home
- [x] **Única dep nueva**: diff de `package.json` = solo `@react-native-community/datetimepicker: 9.1.0`; `bun.lock` +3 líneas (solo su entrada); `app.json` añade su plugin (efecto de `bunx expo install`, esperado); `expo-notifications` ausente en código y package.json (grep vacío)
- [x] **Contención**: `git diff eddc1ea..4bb47ed -- backend-pet-tracker infra _layout.tsx floating-tab-bar.tsx` vacío; `profile.tsx` solo añade el `Pressable` `reminders-link` (+ helper de import diferido de expo-router, justificado para el smoke Jest de rutas) — health check, theme toggle y sign out intactos, `profile.test.tsx` solo extendido (+33 líneas, sin borrados)
- [x] Kinds, testIDs, literales en inglés, umbral `Upcoming!` 0–10, pills, opacidad 0.5 en sent/cancelled, `Alert.alert` de confirmación, validación local de R9 y body strict de 4 claves: todo conforme a R1–R10

## Observaciones
- Ninguna bloqueante. La fila R12 "pendiente" es el gate humano explícito de la spec (checklist en requirements.md); la feature NO debe pasar a `done` hasta que el humano ejecute el smoke en Expo Go y marque la casilla.
- Warnings preexistentes no bloqueantes: aviso AWS SDK sobre Node >=22 y avisos de tokens de tema en las suites móviles (no cambian exit codes).

## Verificación independiente (ejecutada por el reviewer, HEAD `4bb47ed`)
- `mobile-pet-tracker`: `bun run typecheck` exit 0; `bun run lint` exit 0; `bun run test -- --runInBand` → 36/36 suites, 423/423 tests

## Output de ./init.sh (exit 0)
```
✅ Build exitoso
Backend:  Test Suites: 145 passed, 145 total | Tests: 1114 passed, 1114 total
Infra:    Test Suites: 2 passed, 2 total     | Tests: 14 passed, 14 total
Móvil:    Test Suites: 36 passed, 36 total   | Tests: 423 passed, 423 total
E2E:      Test Suites: 2 skipped, 20 passed  | Tests: 6 skipped, 327 passed, 333 total
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
