---
feature: "aws-real-credentials"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[aws-real-credentials]]

> Columna "Test previsto" la fija esta spec; el implementer sustituye
> "pendiente" por el nombre real del test y el hash del commit.

| Requisito | Test previsto (archivo::describe) | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | `src/aws/aws-mode.spec.ts::R1: AWS_MODE resuelve el modo con default local` | `src/aws/aws-mode.spec.ts::R1: AWS_MODE resuelve el modo con default local` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R2 | `src/aws/aws-mode.spec.ts::R2: modo local construye las opciones actuales` | `src/aws/aws-mode.spec.ts::R2: modo local construye las opciones actuales` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R3 | `src/aws/aws-mode.spec.ts::R3: modo aws construye los 4 clientes sin endpoint` | `src/aws/aws-mode.spec.ts::R3: modo aws construye los 4 clientes sin endpoint` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R4 | `src/aws/aws-mode.spec.ts::R4: modo aws no pasa credentials explicitas` | `src/aws/aws-mode.spec.ts::R4: modo aws no pasa credentials explicitas` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R5 | `src/aws/aws-mode.spec.ts::R5: modo aws pasa region solo si tiene valor` | `src/aws/aws-mode.spec.ts::R5: modo aws pasa region solo si tiene valor` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R6 | `src/aws/aws-mode.spec.ts::R6: forcePathStyle solo en modo local` | `src/aws/aws-mode.spec.ts::R6: forcePathStyle solo en modo local` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R7 | `src/aws/aws-mode.spec.ts::R7: MissingAwsEndpointError solo en modo local` | `src/aws/aws-mode.spec.ts::R7: MissingAwsEndpointError solo en modo local` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R8 | `src/aws/run-provisioning.spec.ts::R8: runProvisioning aborta en modo aws` | `src/aws/run-provisioning.spec.ts::R8: runProvisioning aborta en modo aws` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R9 | `src/aws/no-hardcoded-credentials.spec.ts::R3` + `src/aws/no-real-aws-endpoint.spec.ts::R15` (ambos preexistentes, sin editar) | `src/aws/no-hardcoded-credentials.spec.ts::R3` + `src/aws/no-real-aws-endpoint.spec.ts::R15` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R10 | `src/aws/aws-mode-docs.spec.ts::R10: AWS_MODE documentada en .env.example y conventions` | `src/aws/aws-mode-docs.spec.ts::R10: AWS_MODE documentada en .env.example y conventions` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R11 | `test/aws-real-smoke.e2e-spec.ts::R11: llamada de solo lectura con credenciales de sesion` | `test/aws-real-smoke.e2e-spec.ts::R11: llamada de solo lectura con credenciales de sesion` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |
| R12 | `src/aws/aws-mode-docs.spec.ts::R12: verification.md documenta la prueba de humo` + `progress/impl_aws-real-credentials.md` | `src/aws/aws-mode-docs.spec.ts::R12: verification.md documenta la prueba de humo` + `progress/impl_aws-real-credentials.md` | `d884dad feat(aws-real-credentials): use AWS credential chain (R1-R12)` |

Nota sobre R9: los dos guardas ya existen y nombran sus R-ids de la feature #2
(`R3` y `R15` de `localstack-provisioning`). La trazabilidad de R9 se cierra
apuntando a esos tests más el commit que demuestra que siguen verdes sin
haber sido modificados.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
