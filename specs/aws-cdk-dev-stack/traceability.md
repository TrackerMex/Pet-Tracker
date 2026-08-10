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
| R1 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R1: el stack sintetiza sin credenciales AWS` (+ `init.sh`/CI en verde con `BUILD_CMD`) | `infra/test/pet-tracker-dev-stack.test.ts::R1: el stack sintetiza sin credenciales AWS` | `b2d242b` test rojo; `fae1f27` implementación verde |
| R2 | implementer | `backend-pet-tracker/src/aws/constants.spec.ts::R2: base y helper de composicion de nombres de recurso` | `backend-pet-tracker/src/aws/constants.spec.ts::R2: base y helper de composicion de nombres de recurso` | `f4d6ae0` test rojo; `8c036a9` implementación verde; `3bc682e` refactor verde |
| R3 | implementer | `backend-pet-tracker/test/media.e2e-spec.ts` (suite existente, línea 185 editada; requiere LocalStack arriba) | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R3: media e2e usa BUCKET_MEDIA sin literal local`; `backend-pet-tracker/test/media.e2e-spec.ts::Pet photo upload (e2e)` | `a5e4eec` test rojo; `122fd60` implementación verde; `facb289` refactor verde |
| R4 | implementer | `infra/test/no-duplicated-literals.test.ts::R4: el stack no duplica literales de constants.ts` | `infra/test/no-duplicated-literals.test.ts::R4: el stack no duplica literales de constants.ts` | `941f94f` test rojo; `4c79a60` implementación verde |
| R5 | implementer | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R5: .gitignore ignora cdk.out` | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R5: .gitignore ignora cdk.out` | `e931e26` test rojo; `ebd3f53` implementación verde |
| R6 | implementer | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R6: init.config.sh ejecuta el paquete infra` | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R6: init.config.sh ejecuta el paquete infra` | `1eedbe2` test rojo; `2925ff2` implementación verde |
| R7 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R7: seis colas SQS con RedrivePolicy hacia su DLQ` | `infra/test/pet-tracker-dev-stack.test.ts::R7: seis colas SQS con RedrivePolicy hacia su DLQ` | `929abc9` test rojo; `fdef9c7` implementación verde |
| R8 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R8: tabla positions PROVISIONED 25/25 STANDARD con TTL` | `infra/test/pet-tracker-dev-stack.test.ts::R8: tabla positions PROVISIONED 25/25 STANDARD con TTL` | `8cbf757` test rojo; `2ccd90e` implementación verde |
| R9 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R9: bucket de media con nombre por account-id y PublicAccessBlock` | `infra/test/pet-tracker-dev-stack.test.ts::R9: bucket de media con nombre por account-id y PublicAccessBlock` | `c9f03fd` test rojo; `e49457a` implementación verde |
| R10 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R10: bus pet-tracker y regla geofence-events con su target` | `infra/test/pet-tracker-dev-stack.test.ts::R10: bus pet-tracker y regla geofence-events con su target` | `74bcddb` test rojo; `a1ea71c` implementación verde |
| R11 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R11: resource-policy de SQS para el target de EventBridge` | `infra/test/pet-tracker-dev-stack.test.ts::R11: resource-policy de SQS para el target de EventBridge` | `d669a08` test rojo; `a977dc9` implementación verde |
| R12 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R12: removalPolicy Retain en la tabla y Delete en el bucket` | `infra/test/pet-tracker-dev-stack.test.ts::R12: removalPolicy Retain en la tabla y Delete en el bucket` | `e226639` test rojo; `989f34a` implementación verde |
| R13 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R13: el template declara exactamente 11 recursos de 6 tipos` | `infra/test/pet-tracker-dev-stack.test.ts::R13: el template declara exactamente 11 recursos de 6 tipos` | `8121ad9` test rojo; `07479e3` implementación verde |
| R14 | implementer | `infra/test/pet-tracker-dev-stack.test.ts::R14: el stack se despliega en us-east-1 sin fijar la cuenta` | `infra/test/pet-tracker-dev-stack.test.ts::R14: el stack se despliega en us-east-1 sin fijar la cuenta` | `df37daf` test rojo; `7f482be` implementación verde |
| R15 | implementer | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R15: architecture.md documenta el bucket dev y una cuenta por entorno` | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R15: architecture.md documenta el bucket dev y una cuenta por entorno` | `86298fe` test rojo; `e2506be` implementación verde |
| R16 | implementer | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R16: verification.md documenta el procedimiento manual de #20` | `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts::R16: verification.md documenta el procedimiento manual de #20` | `f06167e` test rojo; `18a99b3` implementación verde |
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
