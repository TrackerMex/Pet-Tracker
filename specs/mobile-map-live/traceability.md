---
feature: "mobile-map-live"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-map-live]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/positions.test.ts::R1: getLastPosition mapea la respuesta por kind` | `df5050f feat(mobile-map): load last position states (R1)` |
| R2 | `src/api/__tests__/positions.test.ts::R2: listPositions mapea la respuesta por kind` | `251eaa0 feat(mobile-map): load position history states (R2)` |
| R3 | `src/api/__tests__/trips.test.ts::R3: getDayRoute compone lista y detalles por kind` | `43e4c37 feat(mobile-map): compose day route details (R3)` |
| R4 | `src/app/(tabs)/__tests__/map.test.tsx::R4: map resuelve la mascota seleccionada` | `a152202 feat(mobile-map): resolve selected pet states (R4)` |
| R5 | `src/app/(tabs)/__tests__/map.test.tsx::R5: mascota free degrada sin mapa` | `60d8195 feat(mobile-map): degrade free pets without tracking (R5)` |
| R6 | `src/app/(tabs)/__tests__/map.test.tsx::R6: mapa y marker con la última posición` | `63815e3 feat(mobile-map): render map and last position (R6)` |
| R7 | `src/app/(tabs)/__tests__/map.test.tsx::R7: ruta del día como polylines` | `3095eea feat(mobile-map): draw day routes with fallback (R7)` |
| R8 | `src/app/(tabs)/__tests__/map.test.tsx::R8: stats calculadas de positions y trips` | `55ca25c feat(mobile-map): calculate live tracking stats (R8)` |
| R9 | `src/app/(tabs)/__tests__/map.test.tsx::R9: polling con foco` | `9375e10 feat(mobile-map): poll while the tab is focused (R9)` |
| R10 | `src/app/(tabs)/__tests__/map.test.tsx::R10: lost mode es stub deshabilitado` | `cbe518c feat(mobile-map): add disabled lost mode stub (R10)` |
| R11 | `bun run --cwd mobile-pet-tracker typecheck` + `bun run --cwd mobile-pet-tracker lint` (exit 0, sin warnings) | `89ff665 fix(mobile-map): satisfy mobile checks (R3,R9,R11)` |
| R12 | pendiente (verificación contención) | pendiente |
| R13 | pendiente (smoke humano Expo Go) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (R13 la
cierra solo el humano marcando la casilla en [[requirements]]).
Convención de commit: `feat(mobile-map): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
