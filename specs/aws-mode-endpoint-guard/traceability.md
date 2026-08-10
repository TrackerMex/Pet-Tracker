---
feature: "aws-mode-endpoint-guard"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[aws-mode-endpoint-guard]]

| Requisito | Test (archivo::nombre) | Archivo implementado | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R1: modo aws con AWS_ENDPOINT_URL definida aborta` | `backend-pet-tracker/src/aws/aws-clients.ts` | rojo: `4d12b0b test(aws-mode-endpoint-guard): cover unexpected endpoint rejection (R1)`; verde: `1b0be58 feat(aws-mode-endpoint-guard): reject unexpected env endpoint (R1)` |
| R2 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R2: el mensaje del error nombra la variable y la acción` | `backend-pet-tracker/src/aws/aws-clients.ts` | rojo: `2db156b test(aws-mode-endpoint-guard): require actionable error message (R2)`; verde: `99de872 feat(aws-mode-endpoint-guard): explain rejected endpoint configuration (R2)` |
| R3 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R3: modo aws sin AWS_ENDPOINT_URL no cambia` | `backend-pet-tracker/src/aws/aws-clients.ts` | rojo: `9d6bd3f test(aws-mode-endpoint-guard): cover absent aws endpoint variants (R3)`; verde: `f19cff6 feat(aws-mode-endpoint-guard): normalize absent aws endpoint (R3)` |
| R4 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R4: modo local intacto` + `backend-pet-tracker/src/aws/aws-mode.spec.ts` (adaptado, [[design]] §D10) | `backend-pet-tracker/src/aws/aws-clients.ts`, `backend-pet-tracker/src/aws/aws-mode.spec.ts` | regresión verde inicial: `c9027d2 test(aws-mode-endpoint-guard): preserve already-green local behavior (R4)`; adaptación: `9fb6a3c test(aws-mode-endpoint-guard): adapt #19 mode fixtures to the endpoint guard (R4)` |
| R5 | `backend-pet-tracker/src/aws/aws-endpoint-guard.spec.ts::R5: la guarda cubre las dos vías de resolución` | `backend-pet-tracker/src/aws/aws-clients.ts` | rojo: `71d52b6 test(aws-mode-endpoint-guard): cover both config resolvers (R5)`; verde: `4eb9dca feat(aws-mode-endpoint-guard): guard ConfigService endpoint resolution (R5)` |
| R6 | `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts::R6: aborta si AWS_ENDPOINT_URL sigue definida` | `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts` | pendiente |
| R7 | `backend-pet-tracker/src/aws/aws-endpoint-guard-docs.spec.ts::R7: verification.md documenta la guarda` | `docs/verification.md` | pendiente |
| R9 | Sin test — evidencia: `git log --oneline` de `feature/21-aws-mode-endpoint-guard`, esta tabla completa y `progress/impl_aws-mode-endpoint-guard.md` con `./init.sh` exit 0 | `progress/impl_aws-mode-endpoint-guard.md` | `8d56770 docs(aws-mode-endpoint-guard): start implementation log (R9)`; evidencia final por completar |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(aws-mode-endpoint-guard): <desc> (R1,R2)`, con el
commit del test en rojo (`test(aws-mode-endpoint-guard): …`) **antes** que el de
la implementación — C4 exige historial rojo→verde por R-id.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
