---
feature: "pet-online-pill"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[pet-online-pill]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/src/modules/devices/domain/connectivity.spec.ts :: #73 R1: deriveConnectivity decide online/offline contra el reloj del servidor con DEVICE_ONLINE_THRESHOLD_MS` | pendiente |
| R2 | `backend-pet-tracker/src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts :: #73 R2 (R11 de devices-claim): el estado de device deriva connectivity de lastMessageAt contra now y conserva las 5 claves` + `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts :: R12 (devices-claim) + #73 R2: el detalle serializa la clave device del use case con connectivity derivada` | pendiente |
| R3 | `backend-pet-tracker/test/device-connectivity.e2e-spec.ts :: #73 R3: GET /v1/pets/:petId y GET /v1/pets/:petId/device derivan connectivity de devices.last_message_at` | pendiente (rojo propio; verde compartido con R2) |
| R4 | `backend-pet-tracker/test/ingestion.e2e-spec.ts :: R19 … recorre la cadena completa y deja el estado esperado` (aserción `:218` → `toBeNull()`) + sonda de mutación en `progress/impl_pet-online-pill.md` §R4 | pendiente |
| R5 | `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx :: #73 R5: el catalogo trae home.unknown y deviceConnectivity.offline en los dos idiomas y registrados en la tabla` | pendiente |
| R6 | `mobile-pet-tracker/src/utils/device-connectivity.test.ts :: #73 R6: el estado de conexion se decide en un solo sitio` + `mobile-pet-tracker/src/screens/pairing/index.test.tsx :: #73 R6: pinta Sin conexion para un collar desconectado` | pendiente |
| R7 | `mobile-pet-tracker/src/screens/home/index.test.tsx :: #73 R7: treats a never-reported collar as unknown (Esperando señal), not offline` + `:: #73 R7: shows an offline collar as Sin conexión with its battery` | pendiente |
| R8 | `mobile-pet-tracker/src/components/__tests__/pet-hero-header.test.tsx :: #73 R8: la pildora de estado vive en la banda inferior, encima del nombre, con todas sus decisiones candadas` | pendiente |
| R9 | `mobile-pet-tracker/src/screens/home/index.test.tsx :: #73 R9: la pildora del hero y collar-status nacen del mismo estado` | pendiente |
| R10 | requisito de verificación (C4 vía (b)): candados existentes de [[requirements]] §Candados + 5 sondas de mutación en `progress/impl_pet-online-pill.md` §R10 | pendiente |
| R11 | gate humano en dev build de Android; guion y resultado en `progress/impl_pet-online-pill.md` §R11 | no aplica a IA — gate humano por ejecutar |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; aquí `test(pet-online-pill): … (Rn)`
para el rojo y `feat|fix(pet-online-pill): … (Rn)` para el verde.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
