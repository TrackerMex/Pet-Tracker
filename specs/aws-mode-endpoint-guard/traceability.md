---
feature: "aws-mode-endpoint-guard"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[aws-mode-endpoint-guard]]

| Requisito | Test (archivo::nombre) | Archivo implementado | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R1: modo aws con AWS_ENDPOINT_URL definida aborta` | `backend-pet-tracker/src/aws/aws-clients.ts` | pendiente |
| R2 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R2: el mensaje del error nombra la variable y la acción` | `backend-pet-tracker/src/aws/aws-clients.ts` | pendiente |
| R3 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R3: modo aws sin AWS_ENDPOINT_URL no cambia` | `backend-pet-tracker/src/aws/aws-clients.ts` | pendiente |
| R4 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R4: modo local intacto` | `backend-pet-tracker/src/aws/aws-clients.ts` | pendiente |
| R5 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R5: la guarda cubre las dos vías de resolución` | `backend-pet-tracker/src/aws/aws-clients.ts` | pendiente |
| R6 | `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts::R6: aborta si AWS_ENDPOINT_URL sigue definida` | `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts` | pendiente |
| R7 | `backend-pet-tracker/src/aws/aws-endpoint-guard-docs.spec.ts::R7: verification.md documenta la guarda` | `docs/verification.md` | pendiente |
| R9 | Sin test — evidencia: `git log --oneline` de `feature/21-aws-mode-endpoint-guard`, esta tabla completa y `progress/impl_aws-mode-endpoint-guard.md` con `./init.sh` exit 0 | `progress/impl_aws-mode-endpoint-guard.md` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(aws-mode-endpoint-guard): <desc> (R1,R2)`, con el
commit del test en rojo (`test(aws-mode-endpoint-guard): …`) **antes** que el de
la implementación — C4 exige historial rojo→verde por R-id.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
