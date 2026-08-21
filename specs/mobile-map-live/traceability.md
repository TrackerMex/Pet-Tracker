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
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente (verificación typecheck/lint) | pendiente |
| R12 | pendiente (verificación contención) | pendiente |
| R13 | pendiente (smoke humano Expo Go) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (R13 la
cierra solo el humano marcando la casilla en [[requirements]]).
Convención de commit: `feat(mobile-map): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
