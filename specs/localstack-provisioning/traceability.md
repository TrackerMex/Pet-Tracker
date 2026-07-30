---
feature: "localstack-provisioning"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[localstack-provisioning]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/aws/aws-clients.spec.ts::R1`, `src/aws/aws.module.spec.ts::R1` | `df0df03` feat(localstack-provisioning): add AWS SDK v3 client factories + AwsModule (R1) |
| R2 | `src/aws/aws-env-config.spec.ts::R2` | `4d9bf65` feat(localstack-provisioning): abort with clear error if AWS_ENDPOINT_URL missing (R2) |
| R3 | `src/aws/no-hardcoded-credentials.spec.ts::R3` | `7edf495` test(localstack-provisioning): guard against hardcoded AWS region/credentials in src/aws/ (R3) |
| R4 | `test/localstack-provisioning.e2e-spec.ts::"R4 (beforeAll)"` ⚠️ no ejecutado contra LocalStack real | `303fa22` test(localstack-provisioning): add real-LocalStack integration spec for R4,R5,R6,R7,R8,R10,R11,R12,R13,R14 |
| R5 | `src/aws/run-provisioning.spec.ts::R16` (exit code, sin infra) + `test/localstack-provisioning.e2e-spec.ts::"R5: segunda corrida es idempotente"` ⚠️ e2e no ejecutado contra LocalStack real | `e97591f`, `303fa22` |
| R6 | `test/localstack-provisioning.e2e-spec.ts::"R6: las 4 colas SQS existen con los nombres correctos"` ⚠️ no ejecutado contra LocalStack real | `303fa22` |
| R7 | `test/localstack-provisioning.e2e-spec.ts::"R7: positions-raw tiene RedrivePolicy hacia positions-raw-dlq"` ⚠️ no ejecutado contra LocalStack real | `303fa22` |
| R8 | `test/localstack-provisioning.e2e-spec.ts::"R8: notifications tiene RedrivePolicy hacia notifications-dlq"` ⚠️ no ejecutado contra LocalStack real | `303fa22` |
| R9 | `src/aws/provisioning.sqs.spec.ts::"R9: orden de creación de colas — cada DLQ se crea antes que su cola principal"` (mock, corre y pasa de verdad) | `5226220` feat(localstack-provisioning): implement idempotent resource provisioning — SQS, DynamoDB, S3, EventBridge (R6,R7,R8,R9,R10,R11,R12,R13,R14,R16) |
| R10 | `test/localstack-provisioning.e2e-spec.ts::"R10: tabla DynamoDB positions con pk/sk correctos"` ⚠️ no ejecutado contra LocalStack real | `303fa22` |
| R11 | `test/localstack-provisioning.e2e-spec.ts::"R11: TTL habilitado sobre expires_at"` ⚠️ no ejecutado contra LocalStack real | `303fa22` |
| R12 | `test/localstack-provisioning.e2e-spec.ts::"R12: bucket S3 de media existe"` ⚠️ no ejecutado contra LocalStack real | `303fa22` |
| R13 | `test/localstack-provisioning.e2e-spec.ts::"R13: bucket S3 sin acceso público"` ⚠️ no ejecutado contra LocalStack real | `303fa22` |
| R14 | `test/localstack-provisioning.e2e-spec.ts::"R14: bus EventBridge pet-tracker existe"` ⚠️ no ejecutado contra LocalStack real | `303fa22` |
| R15 | `src/aws/no-real-aws-endpoint.spec.ts::R15` | `abb4225` test(localstack-provisioning): guard against real AWS endpoint literals in src/aws/ and provision-local.ts (R15) |
| R16 | `src/aws/provisioning.connection-error.spec.ts::R16`, `src/aws/run-provisioning.spec.ts::R16` (corren y pasan de verdad, puerto real cerrado, sin LocalStack) | `5226220`, `e97591f` |
| R17 | `src/aws/status-doc.spec.ts::R17` | `d6ca92a` docs(localstack-provisioning): document how to start LocalStack + provision + verify in STATUS.md (R17) |
| R18 | `src/aws/relative-import-guard.spec.ts::R18` | `f8ca2fb` test(localstack-provisioning): guard against relative ../ imports of src/aws/ outside the directory (R18) |
| R19 | `src/aws/provision-local-script.spec.ts::R19` (corre y pasa; además verificado manualmente corriendo `pnpm run provision:local` real — sin Docker falla por R16, no por "Cannot find module") | `024b7ee` feat(localstack-provisioning): add provision-local.ts standalone entrypoint + provision:local script (R19) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
