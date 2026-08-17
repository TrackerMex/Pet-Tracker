---
feature: "test-dev-resource-isolation"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[test-dev-resource-isolation]]

| Requisito | Test (archivo::nombre) | Archivo implementado | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | `backend-pet-tracker/src/aws/resource-names.spec.ts::R1: los diez nombres con sufijo test` | `backend-pet-tracker/src/aws/resource-names.ts` | rojo: `0b537dd test(test-dev-resource-isolation): add failing resource name cases (R1)`; verde: `1a1f339 feat(test-dev-resource-isolation): build suffixed resource names (R1)` |
| R2 | `backend-pet-tracker/src/aws/resource-names.spec.ts::R2: el sufijo se deriva de NODE_ENV en modo local` | `backend-pet-tracker/src/aws/resource-names.ts`, `backend-pet-tracker/src/aws/aws-clients.ts` | rojo: `8337672 test(test-dev-resource-isolation): add failing suffix resolution cases (R2)`; verde: `bd6c36c feat(test-dev-resource-isolation): resolve local test suffix (R2)` |
| R3 | pendiente — previsto `backend-pet-tracker/src/aws/resource-names.spec.ts::R3: AWS_MODE=aws fuerza sufijo vacio` | `backend-pet-tracker/src/aws/resource-names.ts` | pendiente |
| R4 | pendiente — previsto `backend-pet-tracker/src/aws/aws.module.spec.ts::R4: el token AWS_RESOURCE_NAMES resuelve nombres sufijados` | `backend-pet-tracker/src/aws/aws.constants.ts`, `backend-pet-tracker/src/aws/aws.module.ts` + los 8 consumidores de [[design]] §Archivos afectados | pendiente |
| R5 | pendiente — previsto `backend-pet-tracker/src/aws/resource-names.spec.ts::R5: constants.ts sigue siendo literales const` | `backend-pet-tracker/src/aws/constants.ts` (**sin cambios** — guarda de regresión) | pendiente |
| R6 | pendiente — previsto `backend-pet-tracker/src/aws/run-provisioning.spec.ts::R6: provisiona los dos juegos` | `backend-pet-tracker/src/aws/run-provisioning.ts`, `backend-pet-tracker/src/aws/provisioning.ts` | pendiente |
| R7 | pendiente — previsto `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts::R7: la doble corrida sigue siendo idempotente` | `backend-pet-tracker/src/aws/provisioning.ts` | pendiente |
| R8 | pendiente — previsto `backend-pet-tracker/src/aws/run-provisioning.spec.ts::R8: AWS_MODE=aws aborta sin crear nada` | `backend-pet-tracker/src/aws/run-provisioning.ts` (**sin cambios** — guarda de regresión) | pendiente |
| R9 | pendiente — previsto `backend-pet-tracker/test/resource-isolation.e2e-spec.ts::R9: las colas de dev y test tienen URLs distintas` | las 7 suites e2e + `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts` + `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts` (L19) | pendiente |
| R10 | pendiente — previsto `backend-pet-tracker/test/resource-isolation.e2e-spec.ts::R10: la ingesta no mueve las colas de desarrollo` | sin código propio (verifica R4+R6+R9) | pendiente |
| R11 | pendiente — previsto `backend-pet-tracker/src/aws/resource-names-guard.spec.ts::R11: nadie importa los diez literales de nombre` | `backend-pet-tracker/src/aws/resource-names-guard.spec.ts` | pendiente |
| R12 | pendiente — previsto `backend-pet-tracker/src/aws/resource-names-guard.spec.ts::R12: el stack CDK no importa la resolucion de sufijo` | `infra/` (**sin cambios** — evidencia: `git diff --name-only`) | pendiente |
| R13 | pendiente — previsto `backend-pet-tracker/src/aws/resource-names-guard.spec.ts::R13: verification.md documenta el recuento manual` | `docs/verification.md` | pendiente |
| R14 | pendiente — sin test; evidencia: `git log --oneline` de `feature/28-test-dev-resource-isolation`, esta tabla completa y `progress/impl_test-dev-resource-isolation.md` con `./init.sh` exit 0 | `progress/impl_test-dev-resource-isolation.md` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(test-dev-resource-isolation): <desc> (R1,R2)`, con el
commit del test en rojo (`test(test-dev-resource-isolation): …`) **antes** que el
de la implementación — C4 exige historial rojo→verde por R-id.

**Excepción declarada:** R5, R8 y R12 son guardas de regresión y **nacen
verdes** (no hay rojo posible: afirman que algo que hoy funciona sigue
funcionando). Su commit de test debe decirlo explícitamente en el mensaje. Las
otras once filas exigen rojo→verde.

El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
