---
feature: "aws-cdk-dev-stack"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[aws-cdk-dev-stack]]

> Columna "Test previsto" la fija esta spec; el implementer sustituye
> "pendiente" por el nombre real del test y el hash del commit.
>
> Rutas relativas a la raíz del repo. Los tests de `infra/test/` corren con
> `pnpm -C infra test`; los de `backend-pet-tracker/src/**` con
> `pnpm -C backend-pet-tracker test`; los de `backend-pet-tracker/test/**` con
> `pnpm -C backend-pet-tracker run test:e2e`.

| Requisito | Cierra | Test previsto (archivo::describe) | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|---|---|
| R1 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R1: el stack sintetiza sin credenciales AWS` (+ `init.sh`/CI en verde con `BUILD_CMD`) | pendiente | pendiente |
| R2 | implementer | `backend-pet-tracker/src/aws/constants.spec.ts::R2: base y helper de composicion de nombres de recurso` | pendiente | pendiente |
| R3 | implementer | `backend-pet-tracker/test/media.e2e-spec.ts` (suite existente, línea 185 editada; requiere LocalStack arriba) | pendiente | pendiente |
| R4 | implementer | `infra/test/no-duplicated-literals.test.ts::R4: el stack no duplica literales de constants.ts` | pendiente | pendiente |
| R5 | implementer | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R5: .gitignore ignora cdk.out` | pendiente | pendiente |
| R6 | implementer | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R6: init.config.sh ejecuta el paquete infra` | pendiente | pendiente |
| R7 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R7: seis colas SQS con RedrivePolicy hacia su DLQ` | pendiente | pendiente |
| R8 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R8: tabla positions PROVISIONED 25/25 STANDARD con TTL` | pendiente | pendiente |
| R9 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R9: bucket de media con nombre por account-id y PublicAccessBlock` | pendiente | pendiente |
| R10 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R10: bus pet-tracker y regla geofence-events con su target` | pendiente | pendiente |
| R11 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R11: resource-policy de SQS para el target de EventBridge` | pendiente | pendiente |
| R12 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R12: removalPolicy Retain en la tabla y Delete en el bucket` | pendiente | pendiente |
| R13 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R13: el template declara exactamente 11 recursos de 6 tipos` | pendiente | pendiente |
| R14 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R14: el stack se despliega en us-east-1 sin fijar la cuenta` | pendiente | pendiente |
| R15 | implementer | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R15: architecture.md documenta el bucket dev y una cuenta por entorno` | pendiente | pendiente |
| R16 | implementer | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R16: verification.md documenta el procedimiento manual de #20` | pendiente | pendiente |
| **R17** | **humano** | Verificación en la consola de AWS Billing + registro en `progress/impl_aws-cdk-dev-stack.md` (§Free tier) — no automatizable | pendiente | pendiente |
| **R18** | **humano** | `cdk bootstrap … --termination-protection` + registro en `progress/impl_aws-cdk-dev-stack.md` (§Bootstrap) — no automatizable, requiere `iam:*` | pendiente | pendiente |
| **R19** | **humano** | `pnpm -C infra exec cdk deploy PetTrackerDev` → `CREATE_COMPLETE` + registro en `progress/impl_aws-cdk-dev-stack.md` (§Deploy) — crea recursos reales | pendiente | pendiente |
| **R20** | **humano** | Segundo `cdk deploy` sin cambios → no-op + registro en `progress/impl_aws-cdk-dev-stack.md` (§Deploy idempotente) | pendiente | pendiente |
| **R21** | mitad A: implementer / **mitad B: humano** | A: `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts::R21: ingest contra AWS real` existe y sale `skipped` sin `AWS_MODE=aws`. B: la misma suite en verde **sin `skipped`** con los recursos de R19 desplegados + output redactado en `progress/impl_aws-cdk-dev-stack.md` | pendiente | pendiente |

## Nota para el reviewer

**Las cinco filas en negrita (R17-R21) no las cierra ningún agente.** Mismo
patrón que #19 R11/R12: `cdk bootstrap` necesita `iam:*` (que PowerUserAccess
no incluye), `cdk deploy` crea recursos reales y cuesta dinero, y R21 exige los
recursos ya desplegados. El implementer deja escrita la mitad A de R21 (la
suite auto-saltada por `AWS_MODE`, con `assertNoStaticAccessKey`) y el
procedimiento documentado por R16, y **para ahí**.

Para R17-R20 y la mitad B de R21, la evidencia de cierre es el registro fechado
en `progress/impl_aws-cdk-dev-stack.md`, con el output redactado (sin ARNs de
cuenta ni credenciales). El reviewer valida R1-R16 y la mitad A de R21
ejecutando `./init.sh` él mismo; para el resto valida que el registro existe y
es coherente, no que él pueda reproducirlo.

Verificación adicional que el reviewer debe hacer para R1 (no tiene test
propio): `git diff --name-only main...HEAD` **no** debe listar `init.sh`,
`.github/workflows/ci.yml`, `backend-pet-tracker/tsconfig.json`,
`backend-pet-tracker/package.json`, `backend-pet-tracker/pnpm-lock.yaml`,
`backend-pet-tracker/src/aws/provisioning.ts` ni
`backend-pet-tracker/src/aws/run-provisioning.ts`.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
