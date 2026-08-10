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

Verificado por humano el 2026-08-10 en la consola de AWS Billing and Cost
Management. La cuenta cubre DynamoDB Standard provisionado 25 RCU / 25 WCU /
25 GB mediante créditos, con ventana de seis meses (plan nuevo, no Always Free
clásico).

Consecuencia al agotar los créditos o cumplirse la ventana: pendiente de
anotar el detalle exacto que muestra la consola.

Fecha y resultado: 2026-08-10, cobertura confirmada. Gate de costo abierto.

## Bootstrap — R18

Ejecutado por humano el 2026-08-10 con
`cdk bootstrap aws://<accountId>/us-east-1 --termination-protection`.

Confirmado antes de correrlo que PowerUserAccess **no** basta: una simulación
con `aws iam simulate-principal-policy` sobre el usuario de desarrollo devolvió
`implicitDeny` en `iam:CreateRole`, `iam:AttachRolePolicy` y `iam:PutRolePolicy`.
El humano adjuntó `AdministratorAccess` temporalmente para el bootstrap.

Resultado del comando: `Environment bootstrapped (no changes)` — el entorno ya
estaba bootstrapeado de antes, así que no se creó nada nuevo. No se aceptó ese
mensaje como evidencia; se verificó el stack real:

```
CDKToolkit  status=CREATE_COMPLETE  EnableTerminationProtection=true
FileAssetsBucketKmsKeyId=AWS_MANAGED_KEY   (sin --bootstrap-customer-key)
Qualifier=hnb659fds   BootstrapVariant="AWS CDK: Default Resources"
```

Fecha y resultado: 2026-08-10, bootstrap presente y con termination protection
activa. R18 cerrado.

## Deploy — R19

Ejecutado por humano el 2026-08-10 con
`pnpm -C infra exec cdk deploy PetTrackerDev --require-approval never`.

Nota operativa: el `cdk deploy` interactivo se queda bloqueado bajo el harness
de Claude Code porque no hay TTY para confirmar los cambios IAM
(`Stack includes security-sensitive updates, but terminal (TTY) is not
attached`). El cambio que pedía aprobar es exactamente el de R11 — la
`AWS::SQS::QueuePolicy` para `events.amazonaws.com` acotada por `ArnEquals` a
la regla — ya verificado por el reviewer en el template sintetizado, así que se
relanzó con `--require-approval never`.

Resultado: `CREATE_COMPLETE` en 91 s. **Se desplegó con PowerUserAccess, sin
`AdministratorAccess`**, lo que confirma la afirmación de la descripción de la
feature: el admin solo hace falta para el bootstrap.

El contador de CDK muestra `12/12` porque incluye el propio
`AWS::CloudFormation::Stack`. No se aceptó ese número: se listaron los recursos
reales de la stack, que son **11** y coinciden exactamente con el inventario
cerrado de R13:

```
AWS::SQS::Queue        6
AWS::SQS::QueuePolicy  1
AWS::DynamoDB::Table   1
AWS::S3::Bucket        1
AWS::Events::EventBus  1
AWS::Events::Rule      1
TOTAL                 11
```

Ningún tipo fuera del inventario. ARN de la stack y account-id no se registran
aquí por política.

Fecha y resultado: 2026-08-10, `CREATE_COMPLETE` con 11 recursos. R19 cerrado.

## Deploy idempotente — R20

Ejecutado por humano el 2026-08-10, mismo comando que R19 y sin tocar `infra/`
entre ambas corridas.

```
✅  PetTrackerDev (no changes)
✨  Deployment time: 0s
```

CloudFormation no actualizó la stack: el synth produjo un template idéntico al
desplegado. El stack ARN es el mismo que en R19, así que no hubo reemplazo.

Fecha y resultado: 2026-08-10, no-op confirmado. R20 cerrado.

## E2E AWS real — R21 mitad B

Ejecutado por humano el 2026-08-10. **Cerrado en verde, pero solo al tercer
intento — los dos primeros fueron falsos resultados y el segundo destapó un
defecto real.** Los tres intentos quedan registrados porque la diferencia entre
ellos es justo lo que R21 pretendía probar.

### Intento 1 — falso negativo (suite saltada)

```
$env:AWS_MODE='aws'; pnpm -C backend-pet-tracker run test:e2e -- ...
→ /usr/bin/bash: line 4: :AWS_MODE=aws: command not found
→ Test Suites: 1 skipped | Tests: 3 skipped
```

`docs/verification.md` daba la sintaxis de PowerShell, pero el comando corrió
bajo Bash, así que `AWS_MODE` nunca llegó al proceso y la suite se auto-saltó.
La guarda de R21 mitad A funcionó exactamente como debía.

### Intento 2 — falso positivo: verde contra LocalStack

Con la sintaxis correcta de Bash (`AWS_MODE=aws pnpm ...`) la suite dio
**3 passed**, pero el output delataba el destino real:

```
QueueUrl=http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/positions-raw
SQSClient resolved endpoint=http://localhost:4566/
```

Account `000000000000` es LocalStack. Los tres tests pasaron sin tocar AWS.

**Causa raíz (defecto de la feature #19, no de esta):**
`resolveAwsClientOptions` en `src/aws/aws-clients.ts` devuelve `{ region }` en
modo `aws` — no pasa `endpoint`, que es lo que pedía la spec de #19. Pero el
AWS SDK v3 lee `AWS_ENDPOINT_URL` de `process.env` por su cuenta, como
configuración global del SDK. Omitir el parámetro **no aísla** del endpoint
local: mientras esa variable esté en el `.env` raíz, `AWS_MODE=aws` sigue
hablando con LocalStack.

La asimetría es clara: el test aborta si detecta `AWS_ACCESS_KEY_ID`
(`assertNoStaticAccessKey`), pero no comprueba `AWS_ENDPOINT_URL`.

### Intento 3 — verde contra AWS real, verificado

Se comentó `AWS_ENDPOINT_URL` en el `.env` raíz. La suite pasó y los warnings
de endpoint desaparecieron — pero eso solo prueba que no hay discrepancia, no
el destino. Para no aceptar un segundo falso positivo se **apagó LocalStack**
(`docker compose stop localstack`, solo `postgres` en pie) y se repitió:

```
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Time:        2.372 s
```

Verde con LocalStack caído: los tres tramos (SQS send/receive/delete, DynamoDB
put/query/delete, EventBridge → cola `geofence-events`) fueron contra AWS real.
Cero `skipped`.

Entorno restaurado después: `AWS_ENDPOINT_URL` y las dos credenciales dummy
descomentadas, LocalStack levantado de nuevo.

Fecha y resultado: 2026-08-10, 3 tests en verde contra AWS real. R21 cerrado,
**con la condición de que `AWS_ENDPOINT_URL` esté ausente del entorno**.

## Defecto abierto — la guarda de endpoint que falta

No bloquea el cierre de #20: los 21 requisitos de esta spec se cumplen. Pero
queda un agujero de verificación en el código de la feature #19 que conviene
cerrar antes de confiar en cualquier prueba futura contra AWS real.

Hoy, en `AWS_MODE=aws` con el `.env` local sin tocar, **cualquier suite o
proceso habla con LocalStack creyendo que habla con AWS**, y pasa en verde. Es
el mismo tipo de bug latente que R11 (la resource-policy de SQS): invisible en
local, y aquí encima disfrazado de test aprobado.

Arreglo propuesto, simétrico al que ya existe para las credenciales: en modo
`aws`, abortar si `AWS_ENDPOINT_URL` está definida y no vacía. Toca
`src/aws/aws-clients.ts` y su spec — es código de aplicación, así que va por el
flujo normal (spec + Codex + reviewer), no como parche aquí.

Mitigación inmediata ya aplicada: `docs/verification.md` ahora exige comentar
`AWS_ENDPOINT_URL`, no solo las credenciales.
