# review: mobile-home-dashboard (#35)
Fecha: 2026-08-21
Veredicto: APROBADO (R1–R12; R13 queda como gate humano, fuera del alcance de esta revisión)
HEAD revisado: d18d341 en `feature/35-mobile-home-dashboard`

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (#35 mobile-home-dashboard en feature_list.json)
- [x] progress/current.md actualizado (sesión 2026-08-21 (3), handoff y cierre de Codex registrados)

## Checklist C3 — Arquitectura
- [x] N/A capas backend (spec §nota: docs/architecture.md no aplica a la app móvil); sí aplican las convenciones móviles:
- [x] `src/api/` puro: sin imports de React ni `expo-secure-store` (grep limpio); `token`/`fetchFn` por parámetro
- [x] No existe `src/api/devices.ts` (decisión de spec: device embebido en detail)
- [x] Tipos a mano en `src/api/types.ts` (D11 ratificado, sin codegen)
- [x] `SelectedPetProvider` mínimo: solo `selectedPetId`/`selectPet`, sin storage ni fetch; error fuera de provider (patrón useAuth)

## Checklist C4 — TDD
- [x] Cada R1–R10 tiene describe que lo nombra:
  - R1/R2 → `src/api/__tests__/pets.test.ts`
  - R3 → `src/api/__tests__/activity.test.ts`
  - R4 → `src/hooks/__tests__/use-api.test.tsx`
  - R5 → `src/providers/__tests__/selected-pet-provider.test.tsx` + assert de montaje en `(tabs)/__tests__/layout.test.tsx:108`
  - R6–R10 → `src/app/(tabs)/__tests__/home.test.tsx`
- [x] Historial rojo→verde por requisito: `test(...) in red` precede a cada `feat(...)` (9a5d592→baf5f64, 2a09620→6983a75, 43fac2d→f9ba3cc, d054d82→66a8057, 0f909aa→cb91276, 1af4eda→bfeb8a7, d51a437→97c9167, 27da0de→8375941, c374bfa→747938e, 894554b→19f48d3)
- [x] Excepción C4 aprobada respetada: `screens.test.tsx` ya no contiene caso `home` (describes R5/R6 de #34 intactos); `_layout.tsx` solo envuelve `<Tabs>` con `SelectedPetProvider`

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" en R1–R12; la única fila pendiente es R13, el gate humano explícito de la spec
- [x] Commits siguen `feat(mobile-home): <desc> (R-ids)` / `test(...)` / `docs(...)`

## Checklist C6 — Spec aprobada
- [x] requirements.md con `status: approved` y checkbox humano marcado (2026-08-21, commit 06f12df)

## Checklist C7 — Sin código huérfano
- [x] Home placeholder reemplazado in-place en `home.tsx`; su test de placeholder retirado de `screens.test.tsx` (excepción C4 documentada en la spec)
- [x] No quedan restos: sin `src/api/devices.ts`, sin react-query, sin archivos muertos

## Verificación de spec contra código real
- R1/R2 (`src/api/pets.ts`): GET `/pets` y `/pets/:id` vía `getJson` (mismo saneo/bearer que auth), estados `ok|unauthorized|error|unreachable|missing-config`; `missing-config` retorna sin llamar a `fetchFn`; body no-array / no-PetProfile → `error`. Conforme.
- R3 (`src/api/activity.ts`): GET `/pets/:id/activity/daily` sin query params; **402 → `no-tracking`** (no error); resto de kinds conforme.
- R4 (`src/hooks/use-api.ts`): 28 líneas no vacías de lógica (≤30); guard de carrera (`active` + identidad `fn`/`tick`); `refetch` limpia `data`; `kind === 'unauthorized'` → `signOut()` global. Cierra la deuda 401 de #33/#34.
- R5: provider montado en `(tabs)/_layout.tsx` envolviendo `<Tabs>`.
- R6 (`home.tsx`): loading/error+Retry/empty/selector de chips con `accessibilityState.selected`; selección por defecto `pets[0]` cuando `selectedPetId` es null o ya no existe.
- R7: `expo-image` con `photoUrl`, fallback inicial sin red; breed null → `—`; Skeleton y error con Retry en card.
- R8: device null → `Free` + `No collar — health only` sin batería; `connectivity === 'online'` → Online, otro caso → Offline; batería null → `—`.
- R9: usa la **última entrada de `days`**; métricas null → `—` (nunca 0); 402 → nota de collar; error/unreachable → `Could not load activity`; Skeleton en vuelo.
- R10: card solo con device; `router.push('/map')`; `Last seen <fecha local>` o `No location data yet`.
- Lección #34: padding inferior por `style` inline (`paddingBottom: insets.bottom + 96`); grep de `left-|right-|bottom-` en home.tsx limpio.
- Cero dependencias nuevas: `package.json` y `bun.lock` sin diff contra main; sin react-query.

## R12 — Contención
- `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` → **vacío**
- Diff total: 22 archivos, todos bajo `mobile-pet-tracker/`, `specs/`, `progress/`, `feature_list.json`, docs

## Output de ./init.sh (ejecutado por el reviewer, exit 0)
```
Test Suites: 18 passed, 18 total
Tests:       129 passed, 129 total
✅ Tests pasados
→ Tests e2e...
⚠️  Puerto 4566 sin respuesta — se saltan los e2e (levanta la infra con: docker compose up -d)
→ Lint... ✅ Lint sin errores (backend eslint, infra eslint, expo lint)
→ Typecheck... ✅ Typecheck sin errores (tsc --noEmit)
✅ Todo verde. Listo para trabajar.
(backend 143 suites/1111 tests e infra 2/14 verdes en fases previas del mismo run)
```
Nota: e2e omitidos por el propio harness (LocalStack no levantado); igual que en revisiones #33/#34, esta feature no toca recursos AWS.

## Observaciones
- Ninguna bloqueante. Menor (no bloquea): R9 en código también mapea `missing-config` de activity a `Could not load activity`, un caso más de los que la spec enumera — degradación coherente, cubierto por typecheck.
- Recordatorio de cierre: #35 no se marca `done` hasta que el humano ejecute R13 (smoke Expo Go en Android físico, pasos 1–8 de requirements.md) y marque su checkbox.
