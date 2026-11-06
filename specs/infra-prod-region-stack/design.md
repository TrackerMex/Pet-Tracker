---
feature: "infra-prod-region-stack"
status: draft        # draft | approved
tags: [harness, spec, infra, produccion]
---

# Diseño — [[infra-prod-region-stack]]

> Requisitos en [[requirements]]; orden y comandos en [[tasks]]. Las pruebas
> son `aws-cdk-lib/assertions` y `cdk synth`. Ningún paso de esta feature
> toca AWS real: `cdk bootstrap`, `cdk deploy` y `cdk diff` contra la cuenta
> son GA3, del humano.

## Fuentes

| Fuente | Commit leído | Qué aporta |
|---|---|---|
| `specs/backend-container-image/design.md` §Contrato con #246 | `2650406e` (`feature/245-backend-container-image`); las enmiendas hasta `b35e8ad8` no tocan el apartado ni el código de producción | Variables de entorno, IAM mínimo, tarea de migración, comandos únicos, `/v1/health/live`, puerto 3000 |
| `specs/users-account-deletion-api/design.md` §IAM para #246 | `bf45e5fc` (`feature/247-users-account-deletion-api`); su design y sus requisitos sin cambios hasta `58cc9623`, cuyo adaptador (`pet-data-purger.aws.adapter.ts`) usa exactamente `ListObjectsV2`, `DeleteObjects`, `Query` y `BatchWriteItem` | Permisos del purgado de cuenta (S3 y DynamoDB) |
| `progress/plan_produccion-aws-2026-11-06.md` §1, §2 (#246), §5 D1–D4 | `899a894d` | Alcance, D1 zona en Route 53, D2 subredes públicas sin NAT, D4 integraciones reales |
| Decisiones del leader del 2026-11-06 (firma de #245 y de #247) | — | Retención de logs de las tareas únicas, `DB_POOL_MAX`, plataforma, KMS, ciclo de vida del bucket, IAM del purgado, idle timeout |

## Forma del código

### `infra/lib/build-app.ts` (nuevo)

```ts
export const PROD_CONTEXT_KEYS = ['apiDomain', 'hostedZoneId', 'hostedZoneName',
  'alarmEmail', 'resendFrom', 'resetLinkHost'] as const;
export const BACKEND_IMAGE_DIRECTORY: string; // join(__dirname, '..', '..', 'backend-pet-tracker')
export function buildApp(app: App, imageDirectory: string = BACKEND_IMAGE_DIRECTORY): App;
```

`buildApp`:

1. Lee cada clave con `app.node.tryGetContext(key)`. Es presente si
   `typeof value === 'string' && value.trim() !== ''`.
2. Si hay presentes y ausentes a la vez, lanza
   `new Error(`Missing prod context keys: ${missing.join(', ')}`)` antes de
   crear ningún stack (R2).
3. Crea siempre `new PetTrackerDevStack(app, 'PetTrackerDev', { env: { region: DEV_REGION } })`.
4. Si están las seis, crea
   `new PetTrackerProdStack(app, `PetTrackerProd-${PROD_PRIMARY_REGION}`, { env: { region: PROD_PRIMARY_REGION }, ...valores con trim(), imageDirectory })`.
5. Devuelve `app`.

`infra/bin/app.ts` queda en `buildApp(new App());`.

### `infra/lib/pet-tracker-prod-stack.ts` (nuevo)

```ts
export const PROD_PRIMARY_REGION = 'mx-central-1';
export interface PetTrackerProdStackProps extends StackProps {
  readonly env: { readonly region: string; readonly account?: string };
  readonly apiDomain: string;
  readonly hostedZoneId: string;
  readonly hostedZoneName: string;
  readonly alarmEmail: string;
  readonly resendFrom: string;
  readonly resetLinkHost: string;
  readonly imageDirectory: string;
}
export class PetTrackerProdStack extends Stack {
  constructor(scope: Construct, id: string, props: PetTrackerProdStackProps);
}
```

La primera sentencia tras `super` es la validación de R3. Los nombres de
recursos compartidos con la app se importan de `@backend/aws/constants`
(`QUEUE_*`, `SQS_MAX_RECEIVE_COUNT`, `TABLE_POSITIONS*`, `BUCKET_MEDIA_BASE`,
`resourceName`, `EVENT_BUS_NAME`, `EVENT_SOURCE`, `DETAIL_TYPE_*`,
`RULE_GEOFENCE_EVENTS`): `infra/test/no-duplicated-literals.test.ts` recorre
`bin/` y `lib/` y falla con cualquiera de esos valores entre comillas.

### Ids de construct

Se fijan para que los logical ids sean estables entre despliegues. Cambiar
uno reemplaza el recurso; en los que tienen estado, eso es pérdida de datos.

| Id | Construct | Notas |
|---|---|---|
| `Vpc` | `ec2.Vpc` | `availabilityZones` `<r>a/b/c`, `natGateways: 0`, subredes `public` (`PUBLIC`) e `isolated` (`PRIVATE_ISOLATED`), `gatewayEndpoints` `S3` y `DynamoDB` |
| `Cluster` | `ecs.Cluster` | en `Vpc` |
| `HostedZone` | `route53.HostedZone.fromHostedZoneAttributes` | `{ hostedZoneId, zoneName: hostedZoneName }`; sin lookup |
| `PositionsRawDlq`, `PositionsRaw`, `NotificationsDlq`, `Notifications`, `GeofenceEventsDlq`, `GeofenceEvents` | `sqs.Queue` | mismos ids que el stack dev; DLQ con `retentionPeriod: Duration.days(14)` |
| `PositionsTable` | `dynamodb.TableV2` | `Billing.onDemand()`, PITR, `deletionProtection: true`, `RemovalPolicy.RETAIN`, sin `encryption` |
| `MediaBucket` | `s3.Bucket` | ver DT8 y DT9 |
| `EventBus`, `GeofenceEventsRule` | `events.EventBus`, `events.Rule` | target `targets.SqsQueue(geofenceEvents)` |
| `DbSecret` | `rds.DatabaseSecret` | `username: 'pet_tracker'`; `applyRemovalPolicy(RemovalPolicy.RETAIN)` |
| `Db` | `rds.DatabaseCluster` | escritor `Writer`, lector `Reader` |
| `ApiLogs`, `WorkersLogs`, `OpsLogs` | `logs.LogGroup` | `RetentionDays.ONE_MONTH` |
| `Api` | `ecs_patterns.ApplicationLoadBalancedFargateService` | política de escalado `ApiCpuScaling` |
| `WorkersSg` | `ec2.SecurityGroup` | `allowAllOutbound: true` (default) |
| `WorkersTask`, `Workers` | `ecs.FargateTaskDefinition`, `ecs.FargateService` | contenedor `workers` |
| `OpsTask` | `ecs.FargateTaskDefinition` | `family: 'pet-tracker-ops'`, contenedor `ops` |
| `JwtSecret`, `WialonTokenSecret`, `ResendApiKeySecret`, `AnthropicApiKeySecret` | `secretsmanager.Secret.fromSecretNameV2` | ver DT12 |
| `AlarmTopic` | `sns.Topic` | suscripción `subscriptions.EmailSubscription(alarmEmail)` |
| `ApiElb5xxAlarm`, `ApiTarget5xxAlarm`, `ApiUnhealthyHostsAlarm`, `PositionsRawDlqAlarm`, `NotificationsDlqAlarm`, `GeofenceEventsDlqAlarm`, `DbCpuAlarm`, `DbAcuAlarm` | `cloudwatch.Alarm` | acción `cloudwatch_actions.SnsAction(topic)` |
| `AlbDnsName`, `ClusterName`, `OpsTaskDefinitionArn`, `PublicSubnetIds`, `OneOffSecurityGroupId`, `MediaBucketName` | `CfnOutput` | hijos directos del stack |

## Decisiones técnicas

### DT1 — `buildApp` y contexto de despliegue (R1, R2, R20)

- El stack prod solo existe si llegan las seis claves por `-c`. Sin
  contexto, `cdk synth` sigue produciendo solo `PetTrackerDev`: el flujo de
  dev no cambia y nadie necesita valores de producción para trabajar.
- Contexto parcial es un error explícito, no un stack a medias ni un salto
  silencioso. El mensaje lista lo que falta, en orden fijo, para que el
  humano lo corrija en un intento.
- Las seis claves: dominio y zona (D1), correo de alarmas, y `resendFrom` y
  `resetLinkHost`. Estas dos son configuración de producción (#245 R12 las
  exige con `EMAIL_ENABLED=true`, D4) y dependen del dominio, que aún no
  existe. No son secretos.
- `buildApp` recibe `imageDirectory` como parámetro para que R20 pruebe la
  composición completa con la imagen de prueba sin depender del Dockerfile
  real.
- `cdk.json` no cambia (`context` sigue `{}`): ni valores de producción en el
  repo ni feature flags nuevos, que cambiarían el template del stack dev.

### DT2 — Un stack por región, cuenta agnóstica (R4, R20)

- Id `PetTrackerProd-<region>` y `env: { region }`, sin `account`: la cuenta
  la pone el CLI al desplegar. El stack es el mismo para mx-central-1 y
  us-east-2; R4, R7 y R8 lo prueban en las dos.
- **AZ explícitas** `<r>a`, `<r>b`, `<r>c`: con cuenta agnóstica, `maxAzs`
  devuelve 2 AZ ficticias, no 3. Explícitas, CloudFormation Validate emite el
  aviso W3010 («Avoid hardcoding availability zones») en cada recurso con AZ.
  Es un aviso, no un error: `cdk synth` y jest salen 0. Ver incertidumbres.
- El rol `primary | standby` del plan lo añade #249, que es quien lo
  necesita: el standby no es este stack con otro parámetro, sino uno con
  Aurora secundaria de una Global Database, réplicas de DynamoDB y 0 workers.
  Añadir el parámetro ahora sería añadir una rama sin consumidor ni prueba.

### DT3 — Red sin NAT (D2; R4, R9, R13, R17)

- Subredes públicas para las tareas (IP pública, SG sin entrada salvo desde
  el ALB) y aisladas para Aurora. Endpoints gateway de S3 y DynamoDB
  (gratuitos) en todas las tablas de rutas.
- Sin NAT ni endpoints de interfaz: SQS, EventBridge, Secrets Manager, ECR y
  CloudWatch Logs se alcanzan por la IP pública de la tarea.
- La única ruta a internet es la de las 3 tablas públicas; las aisladas no
  tienen ninguna (R4 cuenta exactamente 3 `AWS::EC2::Route`).

### DT4 — Aurora PostgreSQL Serverless v2 (R8, R17)

- Motor `AuroraPostgresEngineVersion.VER_17_4`, `serverlessV2MinCapacity`
  0.5, `serverlessV2MaxCapacity` 4, `storageEncrypted: true` sin
  `storageEncryptionKey` (clave `aws/rds` administrada por AWS, DT8),
  `deletionProtection: true`, `removalPolicy: RemovalPolicy.SNAPSHOT`,
  `backup: { retention: Duration.days(7) }`, `defaultDatabaseName: 'pet_tracker'`,
  `vpcSubnets` aisladas.
- Escritor `ClusterInstance.serverlessV2('Writer', { availabilityZone: <r>a })`
  y lector `ClusterInstance.serverlessV2('Reader', { scaleWithWriter: true, availabilityZone: <r>b })`.
  `scaleWithWriter` pone el lector en tier 1 para que escale con el escritor
  y sea el candidato de failover.
- **Secreto explícito**: `new rds.DatabaseSecret(this, 'DbSecret', { username: 'pet_tracker' })`,
  `dbSecret.applyRemovalPolicy(RemovalPolicy.RETAIN)` y
  `credentials: rds.Credentials.fromSecret(dbSecret)`. Con
  `Credentials.fromGeneratedSecret`, el secreto nace dentro del cluster y
  `db.secret.applyRemovalPolicy` solo alcanza la `SecretTargetAttachment`, no
  el secreto (verificado al sintetizar). Retener el secreto evita que un
  `cdk destroy` deje una snapshot sin su contraseña.
- `PGPASSWORD` sale de `ecs.Secret.fromSecretsManager(db.secret!, 'password')`:
  la referencia apunta a la attachment, que es el secreto ya con host y
  puerto. El execution role recibe el permiso de lectura sin código extra.
- `PGHOST` = `db.clusterEndpoint.hostname` (escritor) y `PGPORT` =
  `Token.asString(db.clusterEndpoint.port)`.
- Entrada a la base: `db.connections.allowDefaultPortFrom(api.service)` y
  `db.connections.allowDefaultPortFrom(workersSg)`. Nada desde CIDR.
- **Conexiones**: API 4 tareas × 10 + workers 1 × 5 + ops 1 × 1 = 46; en un
  despliegue de la API al 200 % del máximo, 86. Holgado frente al
  `max_connections` de Aurora con 4 ACU de máximo (del orden de 800).

### DT5 — API detrás del ALB (D1; R9, R10, R12)

- `ApplicationLoadBalancedFargateService` con:
  - `cluster`, `cpu: 512`, `memoryLimitMiB: 1024`, `desiredCount: 2`;
  - `runtimePlatform: { cpuArchitecture: CpuArchitecture.X86_64, operatingSystemFamily: OperatingSystemFamily.LINUX }`;
  - `domainName: apiDomain`, `domainZone: <HostedZone>`,
    `protocol: ApplicationProtocol.HTTPS`, `sslPolicy: SslPolicy.RECOMMENDED_TLS`,
    `redirectHTTP: true`, `idleTimeout: Duration.seconds(60)` (DT11);
  - `assignPublicIp: true`, `taskSubnets: { subnetType: SubnetType.PUBLIC }`;
  - `circuitBreaker: { rollback: true }`, `minHealthyPercent: 100`,
    `maxHealthyPercent: 200`;
  - `taskImageOptions: { image, containerName: 'api', containerPort: 3000, environment, secrets, logDriver: LogDrivers.awsLogs({ streamPrefix: 'api', logGroup: apiLogs }) }`.
- El patrón crea el certificado ACM con validación DNS en la zona y el
  registro alias `A`. D1: la zona está en Route 53 en la misma cuenta; no hace
  falta ARN de certificado en el contexto.
- Target group: `api.targetGroup.configureHealthCheck({ path: '/v1/health/live', healthyHttpCodes: '200' })`
  y `api.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '30')`.
  `/v1/health/live` no toca la base (contrato #245): un Aurora lento no saca
  tareas sanas del balanceador. 30 s cubren el drenaje de 20 s de #245.
- Escalado: `api.service.autoScaleTaskCount({ minCapacity: 2, maxCapacity: 4 }).scaleOnCpuUtilization('ApiCpuScaling', { targetUtilizationPercent: 60 })`.
  El techo de 4 acota costo y conexiones (DT4).

### DT6 — Workers: una sola tarea (R13, R14, R15)

- `FargateService` `Workers` con `desiredCount: 1`, `minHealthyPercent: 0`,
  `maxHealthyPercent: 100`, `circuitBreaker: { rollback: true }`,
  `assignPublicIp: true`, subredes públicas y `securityGroups: [workersSg]`.
- 0 / 100 significa que ECS para la tarea vieja antes de arrancar la nueva.
  Los pollers y los motores de los workers son singletons: dos tareas a la
  vez duplicarían ingestas y notificaciones. El costo es un hueco de
  procesamiento de un minuto o dos por despliegue; las colas lo absorben.
- TD `WorkersTask`: 512 / 1024, la misma plataforma que la API, contenedor
  `workers` sin puertos (levanta HTTP en 3000 pero nadie entra).

### DT7 — Tarea ops: migraciones y comandos únicos (R16, R19)

- Una TD `OpsTask` (`family: 'pet-tracker-ops'`, 256 / 512, misma plataforma
  e imagen) con `command: ['node', 'dist/src/db/migrate.js']`. Los comandos
  únicos (`provision-device`, `set-device-subscription`) usan la misma TD con
  `containerOverrides`, como fija el contrato #245.
- Entorno: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `DB_POOL_MAX=1`,
  `SIM_MODE=false`; secretos `PGPASSWORD` y `WIALON_TOKEN`.
- **Sin task role**: no llama a AWS. `FargateTaskDefinition` siempre crea
  uno, así que se borra con:
  ```ts
  (opsTask.node.defaultChild as ecs.CfnTaskDefinition).addPropertyDeletionOverride('TaskRoleArn');
  opsTask.node.tryRemoveChild('TaskRole');
  ```
  Sin la segunda línea queda un `AWS::IAM::Role` huérfano (R16 cuenta
  exactamente 5 roles de `ecs-tasks`).
- **Logs 30 días** (decisión del leader en la firma de #245): la salida de
  `provision-device` incluye el `activation_code`, que el humano entrega con
  el collar. 30 días bastan para recuperarlo y no lo guardan indefinidamente.
- **Red de las tareas únicas**: reusan `WorkersSg` (salida libre a internet
  para Wialon, entrada a Aurora por R17) y las subredes públicas con IP
  pública. Los outputs de R19 dan al humano todo lo que pide
  `aws ecs run-task`. Un SG propio solo duplicaría la regla de entrada a la
  base.

### DT8 — Cifrado sin claves del cliente (decisión 1 del leader; R6, R7, R8)

- Ninguna CMK (0 `AWS::KMS::Key`) y ningún `kms:` en los task roles.
- S3: `encryption: BucketEncryption.S3_MANAGED` (SSE-S3, `AES256`), sin
  `bucketKeyEnabled`. R7 compara `BucketEncryption` entero: un
  `KMS_MANAGED` o una clave propia lo ponen rojo.
- DynamoDB: sin `encryption`, la tabla usa la clave propiedad de AWS y el
  template no lleva `SSESpecification`. R6 lo fija.
- Aurora: `storageEncrypted` sin clave propia usa `aws/rds`. R8 fija que no
  hay `KmsKeyId`.
- SQS: sin `encryption`; las colas nuevas usan SSE-SQS por defecto en el
  servicio (ver incertidumbres). No se asierta en el template.

### DT9 — Bucket de media: versionado y ciclo de vida (decisión 2 del leader; R7)

- `versioned: true`, `blockPublicAccess: BlockPublicAccess.BLOCK_ALL`,
  `enforceSSL: true`, `removalPolicy: RemovalPolicy.RETAIN`, sin `cors` y sin
  `autoDeleteObjects`.
- `lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(30), expiredObjectDeleteMarker: true }]`.
  El purgado de #247 hace `DeleteObjects` sin `VersionId`: con versionado, eso
  solo pone un delete marker y las fotos siguen como versiones no actuales.
  La regla las expira a los 30 días (los mismos que la retención de logs) y
  limpia los delete markers que quedan solos. No se encontró razón para otro
  valor.
- **Protección contra borrado**: S3 no tiene flag de deletion protection.
  `RETAIN` (un `cdk destroy` no lo borra) más el versionado (un borrado
  accidental es recuperable 30 días) cumplen ese papel. R7 fija los dos.
- Nombre `resourceName(BUCKET_MEDIA_BASE, `prod-${region}-${Aws.ACCOUNT_ID}`)`
  → `pet-tracker-media-prod-<r>-<cuenta>`: único global por región y cuenta,
  y distinto en us-east-2 para #249.

### DT10 — IAM mínimo (contrato #245, IAM de #247 y decisión 3 del leader; R10, R11, R14, R15, R16)

- Task roles con `PolicyStatement` explícitos vía
  `taskDefinition.taskRole.addToPrincipalPolicy(...)`, no con los `grant*` de
  CDK: los `grant*` añaden acciones de más (`grantReadWrite` de S3 incluye
  `s3:DeleteObject*` sobre todo el bucket; el de la tabla, `DeleteItem`).
- API:
  - `s3:GetObject`, `s3:PutObject` sobre `bucket.arnForObjects('*')` (#245);
  - `s3:DeleteObject` sobre `bucket.arnForObjects('pets/*')` (#247);
  - `s3:ListBucket` sobre `bucket.bucketArn` con
    `conditions: { StringLike: { 's3:prefix': 'pets/*' } }` (#247);
  - `dynamodb:Query` (#245) y `dynamodb:BatchWriteItem` (#247) sobre
    `table.tableArn`.

  Sin `s3:DeleteObjectVersion` ni `dynamodb:DeleteItem`: el purgado no los
  usa (#247 §IAM para #246).
- Workers: exactamente lo del contrato #245 (R15).
- Ops: sin task role (DT7).
- Execution roles: los crea CDK con pull de ECR, `logs:CreateLogStream` /
  `logs:PutLogEvents` y lectura solo de los secretos que su TD referencia. R10,
  R14 y R16 fijan qué secretos lee cada uno.

### DT11 — Idle timeout del ALB en 60 s (decisión 4 del leader; R9)

- `idleTimeout: Duration.seconds(60)`, explícito aunque sea el default de AWS,
  para que la decisión quede en el código y R9 la fije: el template lleva
  `idle_timeout.timeout_seconds` = `60`.
- No se sube: el purgado de #247 es síncrono; si pasa de 60 s el cliente
  recibe un 504, pero el handler sigue y termina. El reintento del cliente
  recibe 401 porque la cuenta ya no existe.

### DT12 — Secretos por nombre (R10, R14, R16)

- Los crea el humano en GA2, en `mx-central-1`, como **texto plano** (no
  JSON). El repo y el handoff solo llevan nombres.
- `secretsmanager.Secret.fromSecretNameV2(this, '<Id>', '<nombre>')` y
  `ecs.Secret.fromSecretsManager(secret)`. Con un nombre parcial, la TD lleva
  el ARN parcial y el execution role recibe permiso sobre
  `…:secret:<nombre>-??????`.

| Nombre | Variable | API | Workers | Ops |
|---|---|---|---|---|
| (generado por Aurora, clave `password`) | `PGPASSWORD` | sí | sí | sí |
| `pet-tracker/prod/jwt` | `JWT_SECRET` | sí | sí | — |
| `pet-tracker/prod/wialon-token` | `WIALON_TOKEN` | sí | sí | sí |
| `pet-tracker/prod/resend-api-key` | `RESEND_API_KEY` | sí | — | — |
| `pet-tracker/prod/anthropic-api-key` | `ANTHROPIC_API_KEY` | sí | — | — |

- **`WIALON_TOKEN` en la API**: el contrato #245 lo marca «—» para la API,
  pero `validateEnv` (#245 R12, implementado en `83428328`) lo exige en todo
  proceso de producción con `SIM_MODE=false`, y la API carga
  `AppConfigModule`. Sin él la API no arranca.
- Ningún nombre termina en guion + 6 caracteres, para que el sufijo
  `-??????` no sea ambiguo.

### DT13 — Variables de entorno (R10, R14, R16)

| Variable | API | Workers | Ops |
|---|---|---|---|
| `PORT` | `3000` | `3000` | — |
| `PGHOST` / `PGPORT` | endpoint escritor / su puerto | ídem | ídem |
| `PGDATABASE` / `PGUSER` | `pet_tracker` | `pet_tracker` | `pet_tracker` |
| `DB_POOL_MAX` | `10` | `5` | `1` |
| `AWS_MODE` | `aws` | `aws` | — |
| `MEDIA_BUCKET_NAME` | `Ref` del bucket | `Ref` del bucket | — |
| `SIM_MODE` | `false` | `false` | `false` |
| `EMAIL_ENABLED` | `true` | — | — |
| `RESEND_FROM`, `RESET_LINK_HOST` | contexto | — | — |
| `ANTHROPIC_ENABLED` | `true` | — | — |
| `ANTHROPIC_MODEL` | `claude-haiku-5-5` | — | — |
| `PUSH_ENABLED` | — | `true` | — |
| `POLLER_ENABLED`, `ACTIVITY_AGGREGATOR_ENABLED`, `ALERTS_ENGINE_ENABLED`, `NOTIFIER_ENABLED`, `REMINDERS_ENABLED` | — | `true` | — |

- Valores de D4: `SIM_MODE=false`, `PUSH_ENABLED=true`, `EMAIL_ENABLED=true`,
  `ANTHROPIC_ENABLED=true`.
- Nunca: `AWS_ENDPOINT_URL`, `AWS_PRESIGN_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY`, `DATABASE_URL`, `NODE_ENV` (viene de la imagen),
  `AWS_REGION` (lo inyecta Fargate). Los mapas exactos de R10, R14 y R16 lo
  fijan.
- `ANTHROPIC_MODEL` es el mismo literal de `.env.example`. La fila de
  `docs/conventions.md` que dice que solo está ahí se actualiza en el cierre.

### DT14 — Imagen única (R9, R13, R16)

- Una sola `ecs.ContainerImage.fromAsset(props.imageDirectory, { platform: Platform.LINUX_AMD64 })`,
  compartida por los tres contenedores: un solo asset Docker, una sola
  construcción en el deploy. `Platform` viene de `aws-cdk-lib/aws-ecr-assets`.
- `fromAsset` exige que exista `<dir>/Dockerfile` al construir el stack. Los
  tests usan `infra/test/fixtures/backend-image/Dockerfile` (una línea:
  `FROM scratch`). El real es `backend-pet-tracker/Dockerfile` de #245: **#245
  tiene que estar mergeada antes de GA3**. Sin contexto prod, `cdk synth` no
  lo necesita.
- La plataforma va en el asset (`linux/amd64`) y en la TD (`X86_64`/`LINUX`):
  una imagen construida en un Mac ARM sin plataforma no arrancaría en Fargate
  x86.

### DT15 — Alarmas y outputs (R18, R19)

- Todas con período 5 min, 1 período de evaluación, `>=` y datos ausentes
  como no incumplidos. Métricas:
  - ELB 5XX: `api.loadBalancer.metrics.httpCodeElb(HttpCodeElb.ELB_5XX_COUNT, { period, statistic: 'Sum' })`, umbral 5;
  - target 5XX: `api.targetGroup.metrics.httpCodeTarget(HttpCodeTarget.TARGET_5XX_COUNT, { period, statistic: 'Sum' })`, umbral 5;
  - targets no sanos: `api.targetGroup.metrics.unhealthyHostCount({ period, statistic: 'Maximum' })`, umbral 1;
  - cada DLQ: `dlq.metricApproximateNumberOfMessagesVisible({ period, statistic: 'Maximum' })`, umbral 1;
  - Aurora: `new cloudwatch.Metric({ namespace: 'AWS/RDS', metricName: 'CPUUtilization' | 'ACUUtilization', dimensionsMap: { DBInstanceIdentifier: db.instanceIdentifiers[0] }, period, statistic: 'Average' })`, umbral 80.
    `instanceIdentifiers[0]` es el escritor (verificado al sintetizar). Las
    métricas de instancia, no de cluster, porque el lector escala con el
    escritor y la alarma que importa es la del escritor.
- La suscripción email queda pendiente de confirmar: AWS manda un correo a
  `alarmEmail` tras GA3 y el humano pulsa el enlace.
- Outputs: lo que GA4 necesita (`ClusterName`, `OpsTaskDefinitionArn`,
  `PublicSubnetIds` con `Fn.join(',', vpc.publicSubnets.map((s) => s.subnetId))`,
  `OneOffSecurityGroupId`), más `AlbDnsName` y `MediaBucketName` para el
  smoke. `Fn.join`, no `Array.prototype.join`: con tokens, el segundo deja un
  `Fn::Join` de otra forma.

## Props de prueba

`infra/test/pet-tracker-prod-stack.test.ts`:

```ts
const FIXTURE_IMAGE_DIRECTORY = join(__dirname, 'fixtures', 'backend-image');
const PROPS = {
  apiDomain: 'api.example.com',
  hostedZoneId: 'Z0EXAMPLE123',
  hostedZoneName: 'example.com',
  alarmEmail: 'alerts@example.com',
  resendFrom: 'no-reply@example.com',
  resetLinkHost: 'app.example.com',
  imageDirectory: FIXTURE_IMAGE_DIRECTORY,
};
```

Contexto de R20 (`infra/test/build-app.test.ts`), distinto a propósito de
`PROPS` para que R20 no pase con valores por defecto:

| Clave | Valor |
|---|---|
| `apiDomain` | `api.pets.example.org` |
| `hostedZoneId` | `Z0R20EXAMPLE` |
| `hostedZoneName` | `pets.example.org` |
| `alarmEmail` | `ops@example.org` |
| `resendFrom` | `hola@pets.example.org` |
| `resetLinkHost` | `reset.pets.example.org` |

## Pasos humanos (no los corre ninguna IA)

- **GA1**: dar `apiDomain`, `hostedZoneId` y `hostedZoneName`; verificar el
  dominio en Resend (SPF y DKIM en la zona); fijar `resendFrom`,
  `resetLinkHost` y `alarmEmail`. Habilitar la región `mx-central-1` en la
  cuenta si no lo está (región de opt-in).
- **GA2**: crear en `mx-central-1` los cuatro secretos de DT12, texto plano.
- **GA3**: con #245 mergeada y Docker disponible, `cdk bootstrap` de
  `mx-central-1` y
  `cdk deploy PetTrackerProd-mx-central-1 -c apiDomain=… -c hostedZoneId=… -c hostedZoneName=… -c alarmEmail=… -c resendFrom=… -c resetLinkHost=…`.
  Confirmar la suscripción de alarmas en el correo.
- **GA4**: migraciones con la TD ops y los outputs del stack:
  ```
  aws ecs run-task --region mx-central-1 --cluster <ClusterName> --launch-type FARGATE \
    --task-definition <OpsTaskDefinitionArn> \
    --network-configuration 'awsvpcConfiguration={subnets=[<PublicSubnetIds>],securityGroups=[<OneOffSecurityGroupId>],assignPublicIp=ENABLED}'
  aws ecs wait tasks-stopped --region mx-central-1 --cluster <ClusterName> --tasks <taskArn>
  aws ecs describe-tasks --region mx-central-1 --cluster <ClusterName> --tasks <taskArn> --query 'tasks[0].containers[0].exitCode'
  ```
  Los comandos únicos añaden
  `--overrides '{"containerOverrides":[{"name":"ops","command":["node","dist/scripts/provision-device.js","--unit-id","<id>"]}]}'`.
  La salida se lee en el grupo de logs `OpsLogs`.

## Archivos afectados

| Archivo | Cambio |
|---|---|
| `infra/lib/build-app.ts` | nuevo (R1, R2, R20) |
| `infra/lib/pet-tracker-prod-stack.ts` | nuevo (R3–R20) |
| `infra/bin/app.ts` | `buildApp(new App())` (R1) |
| `infra/test/build-app.test.ts` | nuevo (R1, R2, R20) |
| `infra/test/pet-tracker-prod-stack.test.ts` | nuevo (R3–R19) |
| `infra/test/fixtures/backend-image/Dockerfile` | nuevo, `FROM scratch` (R3 rojo) |
| `docs/conventions.md` | fila `ANTHROPIC_MODEL` (cierre) |
| `specs/infra-prod-region-stack/traceability.md`, `progress/impl_infra-prod-region-stack.md` | cierre |

No cambian: `infra/lib/pet-tracker-dev-stack.ts`,
`infra/test/pet-tracker-dev-stack.test.ts`,
`infra/test/no-duplicated-literals.test.ts`, `infra/cdk.json`,
`infra/package.json`, `infra/pnpm-lock.yaml` y nada fuera de `infra/` salvo
las filas de arriba. Sin dependencias nuevas: todo está en `aws-cdk-lib`
2.263.

## Alternativas descartadas

- **Un construct compartido entre dev y prod.** El stack dev es LocalStack
  sin VPC ni cómputo; compartir obligaría a tocar su template y sus tests.
- **NAT** (uno o por AZ): D2 eligió subredes públicas.
- **ARN del certificado por contexto** (como decía el plan antes de D1): con
  la zona en Route 53, el stack crea y valida el certificado.
- **`HostedZone.fromLookup`**: exige credenciales en el synth; con
  `fromHostedZoneAttributes` el synth es offline.
- **`maxAzs: 3`**: con cuenta agnóstica da 2 AZ.
- **Comandos únicos sobre la TD de workers**: el contrato #245 los pone sobre
  la de migración.
- **Alarmas de Aurora por cluster** (`DBClusterIdentifier`): la del escritor
  es la que mide la carga real.
- **CMK** (decisión 1), **purgado asíncrono o idle timeout mayor**
  (decisión 4).
- **`grant*` de CDK para los task roles**: añaden acciones fuera del mínimo
  (DT10).

## Incertidumbres

- **Letras de AZ**: se asume que `mx-central-1` y `us-east-2` tienen las AZ
  `a`, `b` y `c`. us-east-2 sí; mx-central-1 se lanzó con 3 AZ, pero las
  letras visibles dependen de la cuenta. Si GA3 falla por AZ, se cambian las
  letras en el código y en R4/R8.
- **W3010**: CloudFormation Validate imprime avisos por las AZ explícitas en
  jest y en `cdk synth`. No cambian el código de salida.
- **mx-central-1 es región de opt-in**: hay que habilitarla en la cuenta
  antes de GA3 (GA1).
- **SSE-SQS por defecto**: según la documentación de SQS, las colas nuevas
  se cifran con SSE-SQS por defecto desde 2022; el template no lo declara y
  no se verificó contra la cuenta.
- **`max_connections` con 4 ACU**: el «del orden de 800» de DT4 es una
  estimación por la memoria de 4 ACU, no un valor verificado.
- **Global Database en #249**: AWS recomienda una capacidad mínima mayor
  (del orden de 8 ACU) en el primario de una Global Database con secundarios
  serverless. Lo decide #249; aquí el mínimo es 0.5.
- **Plataforma de Fargate**: los secretos con clave JSON (`password`)
  necesitan plataforma ≥ 1.4.0; el default `LATEST` la cumple.
- **Suite de `infra/` fuera de `init.sh` y de CI**: hoy ninguna de las dos la
  corre. El cierre de [[tasks]] la corre entera y el reviewer debe correrla
  también.
