---
feature: "mobile-home-dashboard"
status: draft     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-home-dashboard]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/api/__tests__/pets.test.ts::R1: listPets mapea la respuesta por kind` | pendiente |
| R2 | `mobile-pet-tracker/src/api/__tests__/pets.test.ts::R2: getPet mapea la respuesta por kind` | pendiente |
| R3 | `mobile-pet-tracker/src/api/__tests__/activity.test.ts::R3: getDailyActivity mapea la respuesta por kind` | pendiente |
| R4 | `mobile-pet-tracker/src/hooks/__tests__/use-api.test.tsx::R4: useApi ejecuta, refetch y expulsa 401` | pendiente |
| R5 | `mobile-pet-tracker/src/providers/__tests__/selected-pet-provider.test.tsx::R5: SelectedPetProvider expone la selección` + caso de montaje en `(tabs)/__tests__/layout.test.tsx` | pendiente |
| R6 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R6: home carga pets y selecciona` | pendiente |
| R7 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R7: pet card muestra el perfil` | pendiente |
| R8 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R8: collar card refleja el device` | pendiente |
| R9 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R9: summary degrada con gracia` | pendiente |
| R10 | `mobile-pet-tracker/src/app/(tabs)/__tests__/home.test.tsx::R10: last position enlaza al mapa` | pendiente |
| R11 | `bun run typecheck` + `bun run lint` (exit 0) | pendiente |
| R12 | `./init.sh` (exit 0), `bun run test` completo y diff de contención vacío + grep storage/React en `src/api/` | pendiente |
| R13 | gate humano — smoke en **Expo Go** sobre Android físico (checkbox en requirements §R13; sin builds) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-home): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
