---
feature: "aws-real-credentials"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[aws-real-credentials]]

> Columna "Test previsto" la fija esta spec; el implementer sustituye
> "pendiente" por el nombre real del test y el hash del commit.

| Requisito | Test previsto (archivo::describe) | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|---|
| R1 | `src/aws/aws-mode.spec.ts::R1: AWS_MODE resuelve el modo con default local` | pendiente | pendiente |
| R2 | `src/aws/aws-mode.spec.ts::R2: modo local construye las opciones actuales` | pendiente | pendiente |
| R3 | `src/aws/aws-mode.spec.ts::R3: modo aws construye los 4 clientes sin endpoint` | pendiente | pendiente |
| R4 | `src/aws/aws-mode.spec.ts::R4: modo aws no pasa credentials explicitas` | pendiente | pendiente |
| R5 | `src/aws/aws-mode.spec.ts::R5: modo aws pasa region solo si tiene valor` | pendiente | pendiente |
| R6 | `src/aws/aws-mode.spec.ts::R6: forcePathStyle solo en modo local` | pendiente | pendiente |
| R7 | `src/aws/aws-mode.spec.ts::R7: MissingAwsEndpointError solo en modo local` | pendiente | pendiente |
| R8 | `src/aws/run-provisioning.spec.ts::R8: runProvisioning aborta en modo aws` | pendiente | pendiente |
| R9 | `src/aws/no-hardcoded-credentials.spec.ts::R3` + `src/aws/no-real-aws-endpoint.spec.ts::R15` (ambos preexistentes, sin editar) | pendiente | pendiente |
| R10 | `src/aws/aws-mode-docs.spec.ts::R10: AWS_MODE documentada en .env.example y conventions` | pendiente | pendiente |
| R11 | `test/aws-real-smoke.e2e-spec.ts::R11: llamada de solo lectura con credenciales de sesion` | pendiente | pendiente |
| R12 | `src/aws/aws-mode-docs.spec.ts::R12: verification.md documenta la prueba de humo` + `progress/impl_aws-real-credentials.md` | pendiente | pendiente |

Nota sobre R9: los dos guardas ya existen y nombran sus R-ids de la feature #2
(`R3` y `R15` de `localstack-provisioning`). La trazabilidad de R9 se cierra
apuntando a esos tests más el commit que demuestra que siguen verdes sin
haber sido modificados.

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
