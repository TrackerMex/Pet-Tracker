---
feature: "infra-prod-region-stack"
status: draft        # draft | approved
tags: [harness, spec, infra, produccion]
---

# Requisitos — [[infra-prod-region-stack]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Las decisiones están en [[design]]; el orden y los comandos, en [[tasks]].
> Contrato de la imagen: `specs/backend-container-image/design.md` §Contrato con
> #246, leído en `2650406e` (branch `feature/245-backend-container-image`; las
> enmiendas posteriores hasta `b35e8ad8` no tocan ese apartado ni el código de
> producción). IAM del borrado de cuenta:
> `specs/users-account-deletion-api/design.md` §IAM para #246, leído en
> `bf45e5fc` (sin cambios en su design ni en sus requisitos hasta `58cc9623`).

## Términos

- **Contexto prod**: las seis claves de contexto de CDK de
  `PROD_CONTEXT_KEYS`, en este orden: `apiDomain`, `hostedZoneId`,
  `hostedZoneName`, `alarmEmail`, `resendFrom`, `resetLinkHost`. Llegan con
  `cdk synth|deploy -c clave=valor`.
- **Presente**: el valor de la clave es un `string` y su `trim()` no es vacío.
  Un número, un booleano, `''` o `'   '` cuentan como ausentes.
- **Stack prod**: una instancia de `PetTrackerProdStack`
  (`infra/lib/pet-tracker-prod-stack.ts`).
- **Plantilla de r**: el template sintetizado de un stack prod construido con
  las props de prueba de [[design]] §Props de prueba y `env: { region: r }`.
  Si un requisito no nombra región, r = `mx-central-1`.
- **Subredes públicas / aisladas**: las `AWS::EC2::Subnet` con la etiqueta
  `aws-cdk:subnet-type` = `Public` / `Isolated`.
- **Servicio API / servicio workers**: el `AWS::ECS::Service` con
  `LoadBalancers` / sin `LoadBalancers`.
- **TD API / TD workers / TD ops**: la `AWS::ECS::TaskDefinition` cuyo único
  contenedor se llama `api` / `workers` / cuya `Family` es `pet-tracker-ops`.
- **Secretos leídos por un execution role**: los `Resource` de las sentencias
  con `secretsmanager:GetSecretValue` en las `AWS::IAM::Policy` adjuntas a ese
  rol, etiquetados `db` si son `{ Ref: <la única SecretTargetAttachment> }` y
  `<nombre>` si su serialización contiene `:secret:pet-tracker/prod/<nombre>-??????`.
- **Sentencias de un task role**: las sentencias de las `AWS::IAM::Policy`
  adjuntas a ese rol, normalizadas: `Action` como array ordenado y `Resource`
  array ordenado por su JSON cuando es array.

## Requisitos funcionales

### Composición de la app

- **R1**: WHEN `buildApp(app)` corre sin ninguna clave del contexto prod
  presente THE SYSTEM SHALL añadir a `app` solo el stack `PetTrackerDev`
  (instancia de `PetTrackerDevStack`, región `us-east-1`) y devolver la misma
  instancia de `app`; `BACKEND_IMAGE_DIRECTORY` SHALL ser la ruta absoluta de
  `backend-pet-tracker/` del repo; y `infra/bin/app.ts` SHALL contener
  `buildApp(new App())` y no contener `new PetTrackerDevStack`.
- **R2**: IF el contexto prod tiene al menos una clave presente y al menos
  una ausente THEN `buildApp` SHALL lanzar un `Error` cuyo mensaje es
  exactamente `Missing prod context keys: <ausentes>`, con las ausentes en el
  orden de `PROD_CONTEXT_KEYS` y unidas por `, `. Casos fijados:
  - solo `apiDomain` → `hostedZoneId, hostedZoneName, alarmEmail, resendFrom, resetLinkHost`;
  - todas salvo `alarmEmail` y `resetLinkHost` → `alarmEmail, resetLinkHost`;
  - todas, con `resendFrom` = `'   '` → `resendFrom`;
  - todas, con `hostedZoneId` = `12345` (número) → `hostedZoneId`.
- **R3**: IF `apiDomain` no es igual a `hostedZoneName` ni termina en
  `.` + `hostedZoneName` THEN el constructor de `PetTrackerProdStack` SHALL
  lanzar un `Error` con mensaje exacto
  `apiDomain "<apiDomain>" is not inside hosted zone "<hostedZoneName>"`.
  Con zona `example.com`: lanza para `api.other.com` y `apiexample.com`; no
  lanza para `example.com` ni `api.example.com`.

### Red

- **R4**: WHERE la región es `mx-central-1` o `us-east-2` THE SYSTEM SHALL
  sintetizar en su plantilla:
  - exactamente 1 `AWS::EC2::VPC`, 1 `AWS::EC2::InternetGateway`,
    0 `AWS::EC2::NatGateway` y 0 `AWS::EC2::EIP`;
  - exactamente 6 subredes: 3 públicas y 3 aisladas, cada trío en las AZ
    `<r>a`, `<r>b`, `<r>c`;
  - exactamente 2 `AWS::EC2::VPCEndpoint`, ambos `VpcEndpointType`
    `Gateway` con 6 `RouteTableIds`; la serialización de `ServiceName` de uno
    contiene `.s3"` y la del otro `.dynamodb"`;
  - exactamente 3 `AWS::EC2::Route`, todas con `DestinationCidrBlock`
    `0.0.0.0/0` y `GatewayId` `{ Ref: <InternetGateway> }`, y cuyos
    `RouteTableId` son exactamente las tablas asociadas a las 3 subredes
    públicas.

### Datos y mensajería

- **R5**: THE SYSTEM SHALL sintetizar:
  - exactamente 6 `AWS::SQS::Queue` con `QueueName` `positions-raw`,
    `positions-raw-dlq`, `notifications`, `notifications-dlq`,
    `geofence-events`, `geofence-events-dlq`;
  - en cada cola principal, `RedrivePolicy` =
    `{ deadLetterTargetArn: { 'Fn::GetAtt': [<su -dlq>, 'Arn'] }, maxReceiveCount: 3 }`;
  - en cada DLQ, `MessageRetentionPeriod` = `1209600`;
  - exactamente 1 `AWS::Events::EventBus` con `Name` `pet-tracker`;
  - exactamente 1 `AWS::Events::Rule` con `Name` `geofence-events`,
    `EventBusName` `{ Ref: <bus> }`, `EventPattern` =
    `{ source: ['pet-tracker'], 'detail-type': ['position.updated', 'battery.low'] }`,
    `State` `ENABLED` y un único target con `Arn` =
    `{ 'Fn::GetAtt': [<geofence-events>, 'Arn'] }`;
  - una `AWS::SQS::QueuePolicy` sobre `geofence-events` cuya sentencia da
    `sqs:SendMessage` al servicio `events.amazonaws.com`.
- **R6**: THE SYSTEM SHALL sintetizar exactamente 1
  `AWS::DynamoDB::GlobalTable` con:
  - `TableName` `positions`, `BillingMode` `PAY_PER_REQUEST`;
  - `KeySchema` `pk` HASH / `sk` RANGE y `AttributeDefinitions` `pk` S /
    `sk` N;
  - `TimeToLiveSpecification` `{ AttributeName: 'expires_at', Enabled: true }`;
  - `Replicas` exactamente
    `[{ Region: '<r>', PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true }, DeletionProtectionEnabled: true }]`;
  - `DeletionPolicy` y `UpdateReplacePolicy` = `Retain`;
  - sin `SSESpecification` (clave propiedad de AWS, decisión DT8);

  y la plantilla SHALL tener 0 `AWS::KMS::Key`.
- **R7**: WHERE la región es `mx-central-1` o `us-east-2` THE SYSTEM SHALL
  sintetizar exactamente 1 `AWS::S3::Bucket` con:
  - `BucketName` =
    `{ 'Fn::Join': ['', ['pet-tracker-media-prod-<r>-', { Ref: 'AWS::AccountId' }]] }`;
  - `VersioningConfiguration` `{ Status: 'Enabled' }`;
  - `BucketEncryption` exactamente
    `{ ServerSideEncryptionConfiguration: [{ ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } }] }`;
  - los cuatro flags de `PublicAccessBlockConfiguration` en `true`;
  - sin `CorsConfiguration`;
  - `LifecycleConfiguration` exactamente
    `{ Rules: [{ ExpiredObjectDeleteMarker: true, NoncurrentVersionExpiration: { NoncurrentDays: 30 }, Status: 'Enabled' }] }`;
  - `DeletionPolicy` y `UpdateReplacePolicy` = `Retain`;

  y una `AWS::S3::BucketPolicy` sobre ese bucket con una sentencia `Deny` de
  `s3:*` para `{ AWS: '*' }` con condición
  `{ Bool: { 'aws:SecureTransport': 'false' } }`.
- **R8**: WHERE la región es `mx-central-1` o `us-east-2` THE SYSTEM SHALL
  sintetizar:
  - exactamente 1 `AWS::RDS::DBSubnetGroup` cuyos `SubnetIds` son las 3
    subredes aisladas;
  - exactamente 1 `AWS::RDS::DBCluster` con `Engine` `aurora-postgresql`,
    `EngineVersion` `17.4`, `ServerlessV2ScalingConfiguration`
    `{ MinCapacity: 0.5, MaxCapacity: 4 }`, `StorageEncrypted` `true`, sin
    `KmsKeyId`, `DeletionProtection` `true`, `BackupRetentionPeriod` `7`,
    `DatabaseName` `pet_tracker`, `DBSubnetGroupName` `{ Ref: <subnet group> }`,
    `MasterUserPassword` resuelto desde el secreto de la base (su JSON contiene
    `{"Ref":"<secreto>"}` y `:SecretString:password::}}`), y `DeletionPolicy` y
    `UpdateReplacePolicy` = `Snapshot`;
  - exactamente 2 `AWS::RDS::DBInstance`, ambas `DBInstanceClass`
    `db.serverless`, `Engine` `aurora-postgresql`, `PubliclyAccessible`
    `false` y `DBClusterIdentifier` `{ Ref: <cluster> }`: el escritor con
    `PromotionTier` `0` en `<r>a` y el lector con `PromotionTier` `1` en `<r>b`;
  - exactamente 1 `AWS::SecretsManager::Secret`, generado
    (`GenerateSecretString.SecretStringTemplate` `{"username":"pet_tracker"}`,
    `GenerateStringKey` `password`), sin `SecretString`, con `DeletionPolicy` y
    `UpdateReplacePolicy` = `Retain`.

### Cómputo

- **R9**: THE SYSTEM SHALL sintetizar:
  - exactamente 1 `AWS::ECS::Cluster`;
  - exactamente 1 `AWS::ElasticLoadBalancingV2::LoadBalancer` `Scheme`
    `internet-facing`, `Type` `application`, en las 3 subredes públicas, con
    el atributo `idle_timeout.timeout_seconds` = `60` (decisión DT11);
  - exactamente 1 `AWS::CertificateManager::Certificate` para `apiDomain`,
    `ValidationMethod` `DNS`, `DomainValidationOptions`
    `[{ DomainName: <apiDomain>, HostedZoneId: <hostedZoneId> }]`;
  - exactamente 1 `AWS::Route53::RecordSet` `A` con `Name` `<apiDomain>.`,
    `HostedZoneId` `<hostedZoneId>` y alias al DNS del balanceador;
  - exactamente 2 listeners: `443` `HTTPS` con `SslPolicy`
    `ELBSecurityPolicy-TLS13-1-2-2021-06`, el certificado y `forward` al
    target group; `80` `HTTP` con `redirect` a `443` `HTTPS` `HTTP_301`;
  - exactamente 1 target group `TargetType` `ip`, `Protocol` `HTTP`,
    `HealthCheckPath` `/v1/health/live`, `Matcher` `{ HttpCode: '200' }` y
    atributo `deregistration_delay.timeout_seconds` = `30`;
  - el servicio API: `LaunchType` `FARGATE`, `DesiredCount` `2`,
    `DeploymentConfiguration` con `DeploymentCircuitBreaker`
    `{ Enable: true, Rollback: true }`, `MaximumPercent` `200` y
    `MinimumHealthyPercent` `100`,
    `AssignPublicIp` `ENABLED`, las 3 subredes públicas y `LoadBalancers`
    `[{ ContainerName: 'api', ContainerPort: 3000, TargetGroupArn: { Ref: <target group> } }]`;
  - la TD API: `Cpu` `512`, `Memory` `1024`, `RuntimePlatform`
    `{ CpuArchitecture: 'X86_64', OperatingSystemFamily: 'LINUX' }`,
    `RequiresCompatibilities` `['FARGATE']`, `NetworkMode` `awsvpc`, un solo
    contenedor `api` con `PortMappings` `[{ ContainerPort: 3000, Protocol: 'tcp' }]`
    y log `awslogs` a un `AWS::Logs::LogGroup` con `RetentionInDays` `30`;
  - el grupo de seguridad del servicio API sin entrada en línea y con
    exactamente 1 `AWS::EC2::SecurityGroupIngress` hacia él: desde el grupo
    del balanceador, `tcp`, `3000`-`3000`; el grupo del balanceador con
    exactamente dos entradas en línea, `tcp` `443` y `80` desde `0.0.0.0/0`;
  - exactamente 1 imagen Docker en los manifiestos de assets del ensamblado,
    con `platform` `linux/amd64`.
- **R10**: THE SYSTEM SHALL dar al contenedor `api`:
  - `Environment`, como mapa, exactamente: `PORT` `3000`; `PGHOST`
    `{ 'Fn::GetAtt': [<cluster>, 'Endpoint.Address'] }`; `PGPORT`
    `{ 'Fn::GetAtt': [<cluster>, 'Endpoint.Port'] }`; `PGDATABASE` y `PGUSER`
    `pet_tracker`; `DB_POOL_MAX` `10`; `AWS_MODE` `aws`; `MEDIA_BUCKET_NAME`
    `{ Ref: <bucket> }`; `SIM_MODE` `false`; `EMAIL_ENABLED` `true`;
    `RESEND_FROM` = prop `resendFrom`; `RESET_LINK_HOST` = prop
    `resetLinkHost`; `ANTHROPIC_ENABLED` `true`; `ANTHROPIC_MODEL`
    `claude-haiku-5-5`;
  - `Secrets` con nombres exactamente `ANTHROPIC_API_KEY`, `JWT_SECRET`,
    `PGPASSWORD`, `RESEND_API_KEY`, `WIALON_TOKEN`; `PGPASSWORD` con
    `ValueFrom`
    `{ 'Fn::Join': ['', [{ Ref: <SecretTargetAttachment> }, ':password::']] }`
    y cada otro con `ValueFrom` cuya serialización contiene
    `:secret:pet-tracker/prod/<anthropic-api-key|jwt|resend-api-key|wialon-token>"`;

  y su execution role SHALL leer exactamente los secretos
  `anthropic-api-key`, `db`, `jwt`, `resend-api-key`, `wialon-token`.
- **R11**: THE SYSTEM SHALL dar al task role de la TD API exactamente estas
  sentencias `Allow`, sin `ManagedPolicyArns`:
  - `s3:GetObject`, `s3:PutObject` sobre
    `{ 'Fn::Join': ['', [{ 'Fn::GetAtt': [<bucket>, 'Arn'] }, '/*']] }`;
  - `s3:DeleteObject` sobre
    `{ 'Fn::Join': ['', [{ 'Fn::GetAtt': [<bucket>, 'Arn'] }, '/pets/*']] }`;
  - `s3:ListBucket` sobre `{ 'Fn::GetAtt': [<bucket>, 'Arn'] }` con
    `Condition` `{ StringLike: { 's3:prefix': 'pets/*' } }`;
  - `dynamodb:BatchWriteItem`, `dynamodb:Query` sobre
    `{ 'Fn::GetAtt': [<tabla>, 'Arn'] }`.
- **R12**: THE SYSTEM SHALL sintetizar exactamente 1
  `AWS::ApplicationAutoScaling::ScalableTarget` (`MinCapacity` `2`,
  `MaxCapacity` `4`, `ScalableDimension` `ecs:service:DesiredCount`,
  `ServiceNamespace` `ecs`, `ResourceId`
  `{ 'Fn::Join': ['', ['service/', { Ref: <cluster> }, '/', { 'Fn::GetAtt': [<servicio API>, 'Name'] }]] }`)
  y exactamente 1 `AWS::ApplicationAutoScaling::ScalingPolicy`
  `TargetTrackingScaling` sobre ese target con
  `PredefinedMetricType` `ECSServiceAverageCPUUtilization` y `TargetValue`
  `60`.
- **R13**: THE SYSTEM SHALL sintetizar exactamente 2 `AWS::ECS::Service`, y
  el servicio workers con:
  - `LaunchType` `FARGATE`, `DesiredCount` `1`, `DeploymentConfiguration`
    con `DeploymentCircuitBreaker` `{ Enable: true, Rollback: true }`,
    `MaximumPercent` `100` y `MinimumHealthyPercent` `0`;
  - `AssignPublicIp` `ENABLED`, las 3 subredes públicas y un único grupo de
    seguridad sin entrada en línea, con 0 `AWS::EC2::SecurityGroupIngress`
    hacia él, y salida (comparada sin `Description`)
    `[{ CidrIp: '0.0.0.0/0', IpProtocol: '-1' }]`;
  - la TD workers: `Cpu` `512`, `Memory` `1024`, el mismo `RuntimePlatform`
    que R9, un solo contenedor `workers` sin `PortMappings`, con `Image`
    igual a la del contenedor `api` y log `awslogs` a un grupo con
    `RetentionInDays` `30`;

  y la imagen Docker de los manifiestos SHALL seguir siendo exactamente 1.
- **R14**: THE SYSTEM SHALL dar al contenedor `workers`:
  - `Environment` exactamente: `PORT` `3000`; `PGHOST`, `PGPORT`,
    `PGDATABASE`, `PGUSER` como en R10; `DB_POOL_MAX` `5`; `AWS_MODE` `aws`;
    `MEDIA_BUCKET_NAME` `{ Ref: <bucket> }`; `SIM_MODE` `false`;
    `PUSH_ENABLED` `true`; `POLLER_ENABLED`, `ACTIVITY_AGGREGATOR_ENABLED`,
    `ALERTS_ENGINE_ENABLED`, `NOTIFIER_ENABLED`, `REMINDERS_ENABLED` `true`;
  - `Secrets` con nombres exactamente `JWT_SECRET`, `PGPASSWORD`,
    `WIALON_TOKEN`, con los `ValueFrom` de R10;

  y su execution role SHALL leer exactamente `db`, `jwt`, `wialon-token`.
- **R15**: THE SYSTEM SHALL dar al task role de la TD workers exactamente
  estas sentencias `Allow`, sin `ManagedPolicyArns`:
  - `sqs:DeleteMessage`, `sqs:GetQueueUrl`, `sqs:ReceiveMessage` sobre los
    `Arn` de `positions-raw`, `geofence-events` y `notifications`;
  - `sqs:SendMessage` sobre los `Arn` de `positions-raw` y `notifications`;
  - `dynamodb:BatchWriteItem`, `dynamodb:Query` sobre el `Arn` de la tabla;
  - `events:PutEvents` sobre el `Arn` del bus.
- **R16**: THE SYSTEM SHALL sintetizar la TD ops con:
  - `Family` `pet-tracker-ops`, `Cpu` `256`, `Memory` `512`, el
    `RuntimePlatform` de R9, `RequiresCompatibilities` `['FARGATE']`,
    `NetworkMode` `awsvpc`;
  - sin `TaskRoleArn` y con `ExecutionRoleArn`;
  - un solo contenedor `ops` con `Command`
    `['node', 'dist/src/db/migrate.js']`, `Image` igual a la del contenedor
    `api`, sin `PortMappings`, `Environment` exactamente `PGHOST`, `PGPORT`,
    `PGDATABASE`, `PGUSER` como en R10, `DB_POOL_MAX` `1` y `SIM_MODE`
    `false`, y `Secrets` exactamente `PGPASSWORD` y `WIALON_TOKEN`;
  - log `awslogs` a un grupo con `RetentionInDays` `30` (decisión DT7);

  su execution role SHALL leer exactamente `db` y `wialon-token`; la
  plantilla SHALL tener exactamente 5 `AWS::IAM::Role` asumibles por
  `ecs-tasks.amazonaws.com`, que son exactamente los referenciados por los
  `TaskRoleArn` y `ExecutionRoleArn` de las tres TD; y seguir con
  exactamente 2 `AWS::ECS::Service`.
- **R17**: THE SYSTEM SHALL dejar el grupo de seguridad del clúster Aurora
  (su `VpcSecurityGroupIds`) sin entrada en línea y con exactamente 2
  `AWS::EC2::SecurityGroupIngress` hacia él, ninguna con `CidrIp`: una desde
  el grupo del servicio API y otra desde el grupo del servicio workers, ambas
  `tcp` con `FromPort` y `ToPort` `{ 'Fn::GetAtt': [<cluster>, 'Endpoint.Port'] }`.

### Operación

- **R18**: THE SYSTEM SHALL sintetizar exactamente 1 `AWS::SNS::Topic`,
  exactamente 1 `AWS::SNS::Subscription` `email` a `alarmEmail` sobre ese
  topic, y exactamente 8 `AWS::CloudWatch::Alarm`, todas con
  `ComparisonOperator` `GreaterThanOrEqualToThreshold`, `TreatMissingData`
  `notBreaching`, `AlarmActions` `[{ Ref: <topic> }]`, `Period` `300` y
  `EvaluationPeriods` `1`, que son exactamente:
  - `AWS/ApplicationELB` `HTTPCode_ELB_5XX_Count`, `Sum`, umbral `5`,
    dimensión `LoadBalancer`;
  - `AWS/ApplicationELB` `HTTPCode_Target_5XX_Count`, `Sum`, umbral `5`,
    dimensiones `LoadBalancer` y `TargetGroup`;
  - `AWS/ApplicationELB` `UnHealthyHostCount`, `Maximum`, umbral `1`,
    dimensiones `LoadBalancer` y `TargetGroup`;
  - `AWS/SQS` `ApproximateNumberOfMessagesVisible`, `Maximum`, umbral `1`,
    una por DLQ, dimensión `QueueName` de esa DLQ;
  - `AWS/RDS` `CPUUtilization` y `ACUUtilization`, `Average`, umbral `80`,
    dimensión `DBInstanceIdentifier` = `{ Ref: <instancia escritora> }`.
- **R19**: THE SYSTEM SHALL emitir los outputs `AlbDnsName`
  (`{ 'Fn::GetAtt': [<balanceador>, 'DNSName'] }`), `ClusterName`
  (`{ Ref: <cluster> }`), `OpsTaskDefinitionArn` (`{ Ref: <TD ops> }`),
  `PublicSubnetIds`
  (`{ 'Fn::Join': [',', [<Ref subred pública a>, <b>, <c>]] }`),
  `OneOffSecurityGroupId` (`{ 'Fn::GetAtt': [<grupo del servicio workers>, 'GroupId'] }`)
  y `MediaBucketName` (`{ Ref: <bucket> }`).
- **R20**: WHEN `buildApp(app, <dir de la imagen>)` corre con las seis claves
  del contexto prod presentes THE SYSTEM SHALL añadir exactamente los stacks
  `PetTrackerDev` y `PetTrackerProd-mx-central-1`, este último instancia de
  `PetTrackerProdStack` con `region` `mx-central-1`, y su plantilla SHALL
  llevar los valores del contexto: `DomainName` del certificado = `apiDomain`;
  `Name` del record = `<apiDomain>.` y `HostedZoneId` = `hostedZoneId`;
  `Endpoint` de la suscripción = `alarmEmail`; `RESEND_FROM` y
  `RESET_LINK_HOST` del contenedor `api` = `resendFrom` y `resetLinkHost`.

## Fuera de alcance

- El rol `standby`, la región us-east-2 desplegada, Aurora Global Database,
  réplicas de DynamoDB, replicación de S3 y health check de Route 53: #249.
  El stack queda parametrizado por región; el parámetro de rol lo añade #249.
- Ejecutar `cdk deploy`, `cdk bootstrap` o `cdk diff` contra una cuenta, y la
  prueba de humo: GA3 y GA5, del humano.
- Crear los secretos y sus valores (GA2), el dominio y la verificación del
  dominio en Resend (GA1), las migraciones y seeds (GA4), y la alarma de
  presupuesto (GA6).
- Claves KMS administradas por el cliente, NAT, endpoints de interfaz, WAF,
  Container Insights y health check de contenedor en la TD.
- Subir el idle timeout del ALB o volver asíncrono el purgado de #247 (DT11).
- `WIALON_BASE_URL` y las variables `SIM_*` (no se definen; valen los
  defaults de la app).
- Correr la suite de `infra/` en `init.sh` o en CI.
- Cambiar `infra/lib/pet-tracker-dev-stack.ts` y sus tests.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
