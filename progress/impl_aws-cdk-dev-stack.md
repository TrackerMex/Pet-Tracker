# Implementación — aws-cdk-dev-stack (#20)

## Estado

Implementación del agente terminada el 2026-08-10. R1-R16 están implementados
y R21 mitad A está escrita y auto-saltada. La feature permanece
`in_progress`: R17-R20 y R21 mitad B requieren ejecución humana contra AWS
real.

## Resumen

- Se creó el paquete independiente `infra/` con CDK v2, TypeScript, Jest,
  ESLint, lockfile propio y synth sin cuenta ni credenciales.
- `PetTrackerDev` declara exactamente 11 recursos: 6 colas SQS, 1 tabla
  DynamoDB, 1 bucket S3, 1 bus EventBridge, 1 regla y 1 policy SQS.
- La tabla usa `PROVISIONED` 25/25, clase `STANDARD`, TTL y
  `RemovalPolicy.RETAIN`; el bucket usa el token de cuenta en el nombre,
  bloqueo público completo y `RemovalPolicy.DESTROY` sin auto-delete.
- La regla de EventBridge apunta a `geofence-events` y CDK genera la policy
  que permite `sqs:SendMessage` a `events.amazonaws.com`.
- Los nombres salen de `backend-pet-tracker/src/aws/constants.ts`; una guarda
  impide volver a introducir literales en `infra/bin` o `infra/lib`.
- `init.config.sh` integra install, synth, tests, lint y typecheck de `infra/`
  en el gate existente.
- Se documentaron el naming de AWS y el procedimiento manual completo.
- Se añadió el e2e AWS-only de R21 con SQS, DynamoDB y EventBridge, sin
  `AppModule` ni Postgres y con limpieza de los datos escritos.

## TDD y trazabilidad

Cada R-id del implementer tiene un commit de test rojo anterior al commit
verde. Los hashes y nombres exactos de las pruebas están en
`specs/aws-cdk-dev-stack/traceability.md`.

- R1-R16: cerrados por el implementer.
- R21 mitad A: `ef76602` rojo → `1fe9022` verde/skipped.
- R17-R20 y R21 mitad B: pendientes del humano.

## Verificación ejecutada

- Baseline: `init.sh` verde tras aprovisionar LocalStack localmente; 119
  suites / 869 tests unitarios y 181 e2e ejecutados.
- R21 con `AWS_MODE=local`: 1 suite / 3 tests omitidos; cero llamadas remotas.
- `init.sh` final: exit 0; backend 121 suites / 879 tests, infraestructura
  2 suites / 14 tests, e2e 181 pasados y 5 omitidos, synth, lint y typecheck
  verdes.
- `git diff --name-only main...HEAD`: ninguno de los siete archivos
  prohibidos aparece.

No se ejecutó `cdk bootstrap`, `cdk deploy` ni ningún comando que creara
recursos AWS reales. Solo se ejecutó `cdk synth`.

## Free tier — R17

Pendiente de ejecución y evidencia humana. Antes del primer deploy, verificar
en AWS Billing la cobertura de DynamoDB Standard provisionado 25 RCU / 25 WCU
/ 25 GB y documentar qué ocurre al terminar los créditos o la ventana de seis
meses.

Fecha y resultado: pendiente.

## Bootstrap — R18

Pendiente de ejecución y evidencia humana. Requiere un principal con permisos
`iam:*`; PowerUserAccess no los incluye. Usar el comando exacto documentado en
`docs/verification.md` y registrar aquí el resultado redactado.

Fecha y resultado: pendiente.

## Deploy — R19

Pendiente de ejecución y evidencia humana. Desplegar `PetTrackerDev` en
`us-east-1`, confirmar `CREATE_COMPLETE` y los 11 recursos, sin registrar ARN
ni número de cuenta.

Fecha y resultado: pendiente.

## Deploy idempotente — R20

Pendiente de ejecución y evidencia humana. Repetir el deploy sin cambios y
registrar el no-op de CloudFormation.

Fecha y resultado: pendiente.

## E2E AWS real — R21 mitad B

Pendiente de ejecución y evidencia humana. Con los recursos desplegados, una
sesión de `aws login`, `AWS_MODE=aws` y las credenciales estáticas comentadas
en el `.env` raíz, ejecutar el comando de `docs/verification.md`. Deben pasar
los tres tests sin `skipped`; registrar aquí el output redactado.

Fecha y resultado: pendiente.
