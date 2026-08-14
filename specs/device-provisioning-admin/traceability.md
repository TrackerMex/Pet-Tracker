---
feature: "device-provisioning-admin"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[device-provisioning-admin]]

> Rutas relativas a `backend-pet-tracker/`. Los tests nombran su requisito
> como `R<n> (device-provisioning-admin #24): ...` (ver [[tasks]]).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `test/provision-device.e2e-spec.ts::R1 (device-provisioning-admin #24): da de alta el collar real con activation_code generado, is_simulated=false y status available` | pendiente |
| R2 | `test/provision-device.e2e-spec.ts::R2 (device-provisioning-admin #24): unidad inexistente en la cuenta -> WialonUnitNotFoundError y cero filas insertadas` | pendiente |
| R3 | `test/provision-device.e2e-spec.ts::R3 (device-provisioning-admin #24): reprovisionar el mismo wialon_unit_id no duplica ni regenera el codigo` + caso de colisión de IMEI | pendiente |
| R4 | `src/modules/devices/application/activation-code.spec.ts::R4 (device-provisioning-admin #24): codigo aleatorio base32, aridad cero, 1000 sin repetir` | rojo `fd2cc24`, corrección del matcher `00a3640`; verde `776f546` (`feat(device-provisioning-admin): generate secure activation codes (R4)`) |
| R5 | `test/provision-device.e2e-spec.ts::R5 (device-provisioning-admin #24): assertRealWialonClient rechaza el simulador` (+ ausencia de controllers nuevos, verificada por el reviewer en el diff) | rojo `d940644`; verde `665ac47` (`feat(device-provisioning-admin): require real Wialon client (R5)`) |
| R6 | `test/provision-device.e2e-spec.ts::R6 (device-provisioning-admin #24): seed-devices sigue sembrando los simulados sin tocar el collar real` | pendiente |
| R7 | `test/provision-device.e2e-spec.ts::R7 (device-provisioning-admin #24): el collar aprovisionado se reclama con POST /v1/devices/claim` | pendiente |
| R8 | N/A (cambio documental en `docs/data-model.md` y `docs/wialon-module.md`, verificado por revisión manual del reviewer) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" en la columna
Commit — la columna Test puede decir "N/A" solo para R8 (requisito
documental), nunca la columna Commit.
Convención de commit: `feat(device-provisioning-admin): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
