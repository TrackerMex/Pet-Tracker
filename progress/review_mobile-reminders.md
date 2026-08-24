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

---

# Review delta final: mobile-reminders (4bb47ed..de89f15)
Fecha: 2026-08-24
Veredicto: APROBADO

Alcance: solo el delta posterior al review R1–R11. C8 no aplica (PR #73 abierto, gate pre-C8).

## Verificación independiente (HEAD `de89f15`)
- `./init.sh` exit 0, "Todo verde": backend 1114 tests, infra 14, móvil **38/38 suites y 447/447 tests** (suites de #72 incluidas), e2e 327 pasados / 6 skipped por gate
- `mobile-pet-tracker`: `bun run typecheck` y `bun run lint` exit 0
- `design-drift.test.ts`: 9/9 verde; grep de clases arbitrarias (`text-[..]`, `bg-[#..]`, etc.) en `src/screens/reminders/` y `src/screens/add-reminder/` → cero resultados; Card compartido y `text-2xs` adoptados

## Checklist C4 — TDD rojo→verde (muestreo por checkout, 2 de 4 ciclos)
- [x] R8 picker swap: en `8042a80` la suite exige `@expo/ui` mientras el impl aún importa `DateTimePicker` (rojo estructural verificado; en el árbol actual la suite falla por módulo removido) → en `02f02ae` 17/17 verde (ejecutado)
- [x] R12 community sheet: en `1cfd679` 8 fallos / 11 verdes (ejecutado) → en `a55c544` 19/19 verde (ejecutado)
- [x] Excepción C4 del pet-switch documentada en el cuerpo de `f11a32c`; el fix raíz (`19aa304`) va en el hook compartido `use-api.ts` (`isSameFn` gate), test-primero vía `6a2aa9b`
- [x] Todos los tests del delta nombran R-ids (`R8` en add-reminder, `R5/R6/R7` en reminders, `R9` en home)

## Dependencias
- [x] `@react-native-community/datetimepicker` ausente de package.json
- [x] `@expo/ui@~57.0.11` presente; imports en HEAD usan `@expo/ui/community/bottom-sheet` y `@expo/ui/community/datetime-picker` (no el root que crashea en Expo Go Android)
- [x] `@gorhom/bottom-sheet` se conserva — peer de heroui/@expo/ui community, justificado en impl report; NO es dep muerta

## Checklist C5/C6 — Trazabilidad y gates humanos
- [x] traceability.md: todas las filas trazadas con tests y commits, incluidos los 3 hallazgos smoke de R12 y los reworks R7/R8
- [x] C6 saldado: `21e1119` (humano, AlexisSM377) marca smoke R12 completo con fecha 2026-08-24 en requirements.md; spec `status: approved` con aprobación humana
- [x] Impl report al día: hallazgos smoke, justificación de deps y sección "Adaptación post-#72" incluidas

## Contención
- [x] Delta 4bb47ed..HEAD toca solo `mobile-pet-tracker/`, `specs/`, `progress/`, `STATUS.md`, `feature_list.json`; `backend-pet-tracker/` e `infra/` intactos (lo de #72 llegó vía merge de main)

## Observaciones (no bloqueantes, corrige el leader en docs)
1. La fila R12 de `specs/mobile-reminders/traceability.md` termina con la cláusula "re-smoke humano pendiente", escrita antes de `21e1119` que lo marca completo. Fila plenamente trazada; solo la cláusula narrativa quedó desfasada — actualizarla en el cierre.
2. Misma nota desfasada al final de la sección pre-merge de `progress/current.md` ("R12 sigue pendiente del re-smoke humano").
3. La resolución de imports en `profile.tsx` por el leader consta en el cuerpo del merge commit, pero `current.md` no la etiqueta explícitamente como fallback según CLAUDE.md — añadir una línea.
