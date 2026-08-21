---
feature: "mobile-home-dashboard"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-home-dashboard]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/api/__tests__/pets.test.ts::R1: listPets mapea la respuesta por kind` | `baf5f64 feat(mobile-home): load pets with authenticated client (R1)` |
| R2 | `mobile-pet-tracker/src/api/__tests__/pets.test.ts::R2: getPet mapea la respuesta por kind` | `6983a75 feat(mobile-home): load selected pet detail (R2)` |
| R3 | `mobile-pet-tracker/src/api/__tests__/activity.test.ts::R3: getDailyActivity mapea la respuesta por kind` | `f9ba3cc feat(mobile-home): load daily activity states (R3)` |
| R4 | `mobile-pet-tracker/src/hooks/__tests__/use-api.test.tsx::R4: useApi ejecuta, refetch y expulsa 401` | `66a8057 feat(mobile-home): add race-safe authenticated API hook (R4)`; lint-safe refactor `f57323a` |
| R5 | `mobile-pet-tracker/src/providers/__tests__/selected-pet-provider.test.tsx::R5: SelectedPetProvider expone la selección` + caso de montaje en `(tabs)/__tests__/layout.test.tsx` | `cb91276 feat(mobile-home): share selected pet across tabs (R5)` |
| R6 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R6: home carga pets y selecciona` | `bfeb8a7 feat(mobile-home): load and select pets on home (R6)` |
| R7 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R7: pet card muestra el perfil` | `97c9167 feat(mobile-home): render selected pet profile card (R7)` |
| R8 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R8: collar card refleja el device` | `8375941 feat(mobile-home): render collar health states (R8)` |
| R9 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R9: summary degrada con gracia` | `747938e feat(mobile-home): render graceful daily summary (R9)` |
| R10 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R10: last position enlaza al mapa` | `19f48d3 feat(mobile-home): link last position to map (R10)` |
| R11 | `bun run typecheck` + `bun run lint` (exit 0) | `f57323a fix(mobile-home): keep hook loading state lint-safe (R4,R11)`; ambos comandos exit 0 |
| R12 | `./init.sh` (exit 0), `bun run test` completo y diff de contención vacío + grep storage/React en `src/api/` | `97d67c6 test(mobile-home): verify full dashboard integration (R12)` |
| R13 | gate humano — smoke en **Expo Go** sobre Android físico (checkbox en requirements §R13; sin builds) | pendiente |
| R6 (fix post-R13) | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R6 … pads the content below the status bar with the top safe-area inset` | rojo `84a7762`; verde `4e93518 fix(mobile-home): respetar safe area superior en home (R6)` |
| R4,R9 (fix post-R13) | `mobile-pet-tracker/src/hooks/__tests__/use-api.test.tsx::R4 … keeps the previous data and flags refreshing during refetch` + `… keeps the previous data while a new fn identity is loading` + `home.test.tsx::R9 … keeps the previous cards mounted while a newly selected pet loads` | rojo `f896be3`; verde `028ba86 fix(mobile-home): stale-while-revalidate en useApi, sin flash al cambiar mascota (R4,R9)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-home): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
