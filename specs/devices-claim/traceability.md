---
feature: "devices-claim"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[devices-claim]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/devices.schema.spec.ts::R1: la migracion crea devices/pet_devices conforme a docs/data-model.md + el SQL no toca ninguna otra tabla` | `318f75f` feat(devices-claim): devices and pet_devices schema with partial unique indexes (R1) |
| R2 | `test/devices.e2e-spec.ts::R2: seed:devices siembra SIM-001..003 y es idempotente` | `172786a` feat(devices-claim): idempotent seed:devices script for SIM-001..003 (R2) |
| R3 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R3: claim feliz ejecuta la transaccion con watermark now-10min` + `test/devices.e2e-spec.ts::R3` | `b03e8fb` use case, `34a6b6e` endpoint + e2e |
| R4 | `src/modules/devices/application/dto/claim-device.dto.spec.ts::R4: ClaimDeviceSchema exige petId UUID y exactamente un identificador` + `test/devices.e2e-spec.ts::R4` | `992f670` DTO, `34a6b6e` endpoint + e2e |
| R5 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R5: sin membresia activa el claim es 404 generico antes de tocar devices` + `test/devices.e2e-spec.ts::R5` (IDOR obligatorio) | `b03e8fb` use case, `34a6b6e` endpoint + e2e |
| R6 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R6: miembro activo con rol distinto de owner recibe 403` + `test/devices.e2e-spec.ts::R6` | `b03e8fb` use case, `34a6b6e` endpoint + e2e |
| R7 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R7: identificador sin device es DEVICE_NOT_FOUND` + `test/devices.e2e-spec.ts::R7` | `b03e8fb` use case, `34a6b6e` endpoint + e2e |
| R8 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R8: device con fila activa o inactive es DEVICE_ALREADY_ASSIGNED` + `test/devices.e2e-spec.ts::R8` (incl. carrera concurrente) | `b03e8fb` use case, `34a6b6e` endpoint + e2e |
| R9 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R9: mascota con collar activo es PET_ALREADY_HAS_DEVICE` + `test/devices.e2e-spec.ts::R9` | `b03e8fb` use case, `34a6b6e` endpoint + e2e |
| R10 | `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts::R10: la auditoria device.claim corre tras el commit con meta {petId}` + `test/devices.e2e-spec.ts::R10` | `b03e8fb` use case, `34a6b6e` endpoint + e2e |
| R11 | `src/modules/devices/application/use-cases/get-pet-device.use-case.spec.ts::R11` + `src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts::R11` + `test/devices.e2e-spec.ts::R11` | `6ac052b` feat(devices-claim): pet device status endpoint with guard reuse (R11) |
| R12 | `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts::R12 (devices-claim)` + `src/modules/pets/infrastructure/pets.controller.spec.ts::R12 (devices-claim)` + `test/devices.e2e-spec.ts::R12` | `609b5f1` feat(devices-claim): device key in pet profile via PetDeviceReader port (R12) |
| R13 | `src/modules/devices/application/use-cases/release-device.use-case.spec.ts::R13: el release cierra la fila activa y audita device.release` + `test/devices.e2e-spec.ts::R13` (ciclo claim→release→claim) | `1c16986` feat(devices-claim): release endpoint with audit and reclaim cycle (R13,R14) |
| R14 | `src/modules/devices/application/use-cases/release-device.use-case.spec.ts::R14: release sin collar activo es DEVICE_NOT_ASSIGNED` + `test/devices.e2e-spec.ts::R14` (403 rol, 404 guard) | `1c16986` feat(devices-claim): release endpoint with audit and reclaim cycle (R13,R14) |
| R15 | `test/devices.e2e-spec.ts::R15: borrar una mascota con collar deja el device reclamable (D3)` | `0bbad33` test(devices-claim): self-healing claim after pet deletion cascade (R15) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
