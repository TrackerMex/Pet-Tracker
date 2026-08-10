---
feature: "aws-cdk-dev-stack"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[aws-cdk-dev-stack]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] y [[../../docs/architecture|architecture]].
>
> Fuente: `feature_list.json` #20 (9 criterios de aceptación) +
> `progress/explore_aws-cdk-dev-stack.md` (exploración read-only, 2026-08-10) +
> las cuatro decisiones del humano registradas en `progress/current.md`
> §"Decisiones del humano".
>
> **Esta spec la implementa un agente sin acceso a la conversación que la
> originó.** Todo lo decidible está decidido aquí y en [[design]]: no quedan
> preguntas abiertas. Rutas, nombres de símbolos y valores son literales, no
> ejemplos. Si algo parece ambiguo, la respuesta está en [[design]]; si no está
> ahí, **para y pregunta** en vez de improvisar.

---

## Contexto mínimo (estado actual, verificado 2026-08-10)

**El repo no es un pnpm workspace.** No hay `pnpm-workspace.yaml` ni
`package.json` en la raíz. `backend-pet-tracker/` es el único paquete y su
`pnpm-lock.yaml` vive dentro del paquete.

**`backend-pet-tracker/src/aws/constants.ts` (49 líneas) exporta hoy:**

| Símbolo | Línea | Valor |
|---|---|---|
| `QUEUE_POSITIONS_RAW` | 9 | `'positions-raw'` |
| `QUEUE_POSITIONS_RAW_DLQ` | 10 | `'positions-raw-dlq'` |
| `QUEUE_NOTIFICATIONS` | 11 | `'notifications'` |
| `QUEUE_NOTIFICATIONS_DLQ` | 12 | `'notifications-dlq'` |
| `QUEUE_GEOFENCE_EVENTS` | 16 | `'geofence-events'` |
| `QUEUE_GEOFENCE_EVENTS_DLQ` | 17 | `'geofence-events-dlq'` |
| `RULE_GEOFENCE_EVENTS` | 21 | `'geofence-events'` |
| `SQS_MAX_RECEIVE_COUNT` | 26 | `3` |
| `TABLE_POSITIONS` | 29 | `'positions'` |
| `TABLE_POSITIONS_PARTITION_KEY` | 30 | `'pk'` |
| `TABLE_POSITIONS_SORT_KEY` | 31 | `'sk'` |
| `TABLE_POSITIONS_TTL_ATTRIBUTE` | 32 | `'expires_at'` |
| `BUCKET_MEDIA` | 36 | `'pet-tracker-media-local'` |
| `EVENT_BUS_NAME` | 39 | `'pet-tracker'` |
| `EVENT_SOURCE` | 46 | `'pet-tracker'` |
| `DETAIL_TYPE_POSITION_UPDATED` | 47 | `'position.updated'` |
| `DETAIL_TYPE_BATTERY_LOW` | 48 | `'battery.low'` |

**Consumidores de `BUCKET_MEDIA` que no pueden romperse** (los cuatro importan
la constante, ninguno compone el nombre a mano):
`src/aws/provisioning.ts` (L29, 237, 246),
`src/modules/media/infrastructure/photo-storage.s3.adapter.ts` (L9, 23, 28),
`test/localstack-provisioning.e2e-spec.ts` (L30, 227, 236),
`test/media.e2e-spec.ts` (L15, 330, 345 — y el literal suelto de L185, R3).

**`init.config.sh` (líneas 23-32)** cablea `pnpm -C backend-pet-tracker` en los
seis comandos. `init.sh` los ejecuta con `eval` bajo `set -e` y **no descubre
paquetes**. `.github/workflows/ci.yml:29` corre exactamente `bash ./init.sh`.
Consecuencia verificada: sin R6, nada de `infra/` se ejecuta jamás, ni en local
ni en CI.

**`.gitignore` (28 líneas)** no ignora `cdk.out/`.

**Patrón de suite que solo corre contra AWS real:**
`backend-pet-tracker/test/aws-real-smoke.e2e-spec.ts` (#19 R11) —
`describe.skip` si `AWS_MODE !== 'aws'` y `assertNoStaticAccessKey()` que
lanza si `process.env.AWS_ACCESS_KEY_ID` tiene valor. R21 lo replica.

---

## Requisitos funcionales

### Bloque A — paquete `infra/` y su cableado (los cierra el implementer)

- **R1**: WHEN se ejecuta `pnpm -C infra run synth` desde la raíz del repo
  **sin credenciales AWS de ningún tipo** (sin `aws login`, sin
  `AWS_ACCESS_KEY_ID`, sin `AWS_PROFILE`), THE SYSTEM SHALL sintetizar el stack
  `PetTrackerDev` y salir con código 0, escribiendo
  `infra/cdk.out/PetTrackerDev.template.json`. El paquete `infra/` SHALL existir
  con exactamente estos archivos versionados: `infra/package.json`,
  `infra/pnpm-lock.yaml`, `infra/tsconfig.json`, `infra/cdk.json`,
  `infra/jest.config.js`, `infra/eslint.config.mjs`, `infra/bin/app.ts`,
  `infra/lib/pet-tracker-dev-stack.ts` y los archivos bajo `infra/test/`.
  `infra/tsconfig.json` SHALL declarar `"noEmit": true` y
  `"paths": { "@backend/*": ["../backend-pet-tracker/src/*"] }`.
  **Ningún archivo de `backend-pet-tracker/tsconfig.json`,
  `backend-pet-tracker/package.json`, `backend-pet-tracker/pnpm-lock.yaml` ni
  `.github/workflows/ci.yml` SHALL modificarse** (verificable con
  `git diff --name-only` al cerrar la feature).

- **R2**: WHEN se importa `backend-pet-tracker/src/aws/constants.ts`, THE SYSTEM
  SHALL exportar `BUCKET_MEDIA_BASE === 'pet-tracker-media'` y una función
  `resourceName(base: string, suffix: string): string` que devuelve `base` sin
  modificar IF `suffix === ''`, y `` `${base}-${suffix}` `` en cualquier otro
  caso; y `BUCKET_MEDIA` SHALL seguir valiendo exactamente
  `'pet-tracker-media-local'`, de forma que sus cuatro consumidores actuales y
  todos los e2e de LocalStack sigan verdes sin ninguna modificación en
  `src/aws/provisioning.ts` ni en
  `src/modules/media/infrastructure/photo-storage.s3.adapter.ts`.

- **R3**: WHEN se lee `backend-pet-tracker/test/media.e2e-spec.ts`, THE SYSTEM
  SHALL no contener el literal `'pet-tracker-media-local'`: la aserción de la
  línea 185 SHALL usar la constante `BUCKET_MEDIA`, que ya está importada en la
  línea 15 de ese mismo archivo, quedando
  `expect.stringContaining(BUCKET_MEDIA)`. Ninguna otra línea de ese archivo
  cambia.

- **R4**: WHEN se recorren todos los `.ts` bajo `infra/bin/` y `infra/lib/`,
  THE SYSTEM SHALL no encontrar, en ninguno, un literal entrecomillado
  (`'…'`, `"…"` o `` `…` ``) cuyo contenido sea exactamente igual al valor de
  alguna de estas constantes de `@backend/aws/constants`:
  `QUEUE_POSITIONS_RAW`, `QUEUE_POSITIONS_RAW_DLQ`, `QUEUE_NOTIFICATIONS`,
  `QUEUE_NOTIFICATIONS_DLQ`, `QUEUE_GEOFENCE_EVENTS`,
  `QUEUE_GEOFENCE_EVENTS_DLQ`, `RULE_GEOFENCE_EVENTS`, `TABLE_POSITIONS`,
  `TABLE_POSITIONS_PARTITION_KEY`, `TABLE_POSITIONS_SORT_KEY`,
  `TABLE_POSITIONS_TTL_ATTRIBUTE`, `BUCKET_MEDIA`, `BUCKET_MEDIA_BASE`,
  `EVENT_BUS_NAME`, `EVENT_SOURCE`, `DETAIL_TYPE_POSITION_UPDATED`,
  `DETAIL_TYPE_BATTERY_LOW`. Este es el criterio de aceptación 6 ("grep de
  literales duplicados en el stack da cero") convertido en test ejecutable.

- **R5**: WHEN se lee `.gitignore` de la raíz del repo, THE SYSTEM SHALL
  contener una línea `cdk.out/`, de forma que `git status --porcelain` esté
  vacío después de ejecutar `pnpm -C infra run synth`.

- **R6**: WHEN se lee `init.config.sh`, THE SYSTEM SHALL encadenar el paquete
  `infra` con `&&` en las cinco variables siguientes, y `init.sh` SHALL quedar
  **sin modificar** (usa `eval` bajo `set -e`, así que el `&&` propaga el
  fallo):

  ```bash
  INSTALL_CMD="pnpm -C backend-pet-tracker install && pnpm -C infra install"
  BUILD_CMD="pnpm -C backend-pet-tracker run build && pnpm -C infra run synth"
  TEST_CMD="pnpm -C backend-pet-tracker test --passWithNoTests && pnpm -C infra test --passWithNoTests"
  LINT_CMD="pnpm -C backend-pet-tracker run lint && pnpm -C infra run lint"
  TYPECHECK_CMD="pnpm -C backend-pet-tracker exec tsc --noEmit && pnpm -C infra exec tsc --noEmit"
  ```

  IF alguna de esas cinco líneas no contiene la subcadena `pnpm -C infra`
  THEN el test de R6 SHALL fallar nombrando la variable que falta.

### Bloque B — contenido del template sintetizado (los cierra el implementer)

> Todo el bloque B se verifica con `Template.fromStack()` de
> `aws-cdk-lib/assertions` sobre el stack construido en memoria. No requiere
> credenciales ni red.

- **R7**: WHEN se sintetiza el stack, THE SYSTEM SHALL declarar exactamente
  **seis** recursos `AWS::SQS::Queue` con `QueueName` igual, respectivamente, a
  `QUEUE_POSITIONS_RAW`, `QUEUE_POSITIONS_RAW_DLQ`, `QUEUE_NOTIFICATIONS`,
  `QUEUE_NOTIFICATIONS_DLQ`, `QUEUE_GEOFENCE_EVENTS` y
  `QUEUE_GEOFENCE_EVENTS_DLQ` (nombres desnudos, sin sufijo de entorno); y cada
  una de las tres colas principales SHALL declarar
  `RedrivePolicy.deadLetterTargetArn` apuntando al `Fn::GetAtt … Arn` de **su**
  DLQ y `RedrivePolicy.maxReceiveCount === SQS_MAX_RECEIVE_COUNT` (3). Las tres
  DLQ SHALL no declarar `RedrivePolicy`.

- **R8**: WHEN se sintetiza el stack, THE SYSTEM SHALL declarar exactamente un
  recurso `AWS::DynamoDB::Table` (**no** `AWS::DynamoDB::GlobalTable`) con:
  `TableName === TABLE_POSITIONS`;
  `BillingMode === 'PROVISIONED'`;
  `ProvisionedThroughput === { ReadCapacityUnits: 25, WriteCapacityUnits: 25 }`;
  `TableClass === 'STANDARD'`;
  `KeySchema === [{ AttributeName: TABLE_POSITIONS_PARTITION_KEY, KeyType: 'HASH' }, { AttributeName: TABLE_POSITIONS_SORT_KEY, KeyType: 'RANGE' }]`;
  `AttributeDefinitions === [{ AttributeName: TABLE_POSITIONS_PARTITION_KEY, AttributeType: 'S' }, { AttributeName: TABLE_POSITIONS_SORT_KEY, AttributeType: 'N' }]`;
  `TimeToLiveSpecification === { AttributeName: TABLE_POSITIONS_TTL_ATTRIBUTE, Enabled: true }`.
  AND SHALL **no** declarar `PointInTimeRecoverySpecification` con
  `PointInTimeRecoveryEnabled: true` (los backups no están cubiertos por el free
  tier), ni `SSESpecification` con `KMSMasterKeyId`, ni ningún índice secundario
  (`GlobalSecondaryIndexes`, `LocalSecondaryIndexes`).

- **R9**: WHEN se sintetiza el stack, THE SYSTEM SHALL declarar exactamente un
  recurso `AWS::S3::Bucket` cuyo `BucketName` renderice como
  `{ "Fn::Join": ["", ["pet-tracker-media-dev-", { "Ref": "AWS::AccountId" }]] }`
  — es decir, compuesto con `resourceName(BUCKET_MEDIA_BASE, …)` y el token
  **sin resolver** `Aws.ACCOUNT_ID`, nunca con `Stack.of(this).account` — y con
  `PublicAccessBlockConfiguration === { BlockPublicAcls: true, BlockPublicPolicy: true, IgnorePublicAcls: true, RestrictPublicBuckets: true }`.
  El stack SHALL no declarar ningún `AWS::S3::BucketPolicy`.

- **R10**: WHEN se sintetiza el stack, THE SYSTEM SHALL declarar exactamente un
  `AWS::Events::EventBus` con `Name === EVENT_BUS_NAME`, y exactamente un
  `AWS::Events::Rule` con `Name === RULE_GEOFENCE_EVENTS`, `EventBusName`
  referenciando ese bus, `State === 'ENABLED'`,
  `EventPattern === { source: [EVENT_SOURCE], 'detail-type': [DETAIL_TYPE_POSITION_UPDATED, DETAIL_TYPE_BATTERY_LOW] }`
  y un único `Targets` cuyo `Arn` sea el `Fn::GetAtt … Arn` de la cola
  `QUEUE_GEOFENCE_EVENTS`. La regla SHALL no declarar `InputTransformer`
  (decisión D2 de #12: el worker despacha por `detail-type`) ni `RoleArn`.

- **R11**: WHEN se sintetiza el stack, THE SYSTEM SHALL declarar exactamente un
  recurso `AWS::SQS::QueuePolicy` cuyo `Queues` referencie la cola
  `QUEUE_GEOFENCE_EVENTS` y cuyo `PolicyDocument.Statement` contenga un
  statement con `Effect: 'Allow'`, `Principal: { Service: 'events.amazonaws.com' }`
  y `Action` que incluya `'sqs:SendMessage'`.
  Motivo: `provisioning.ts` nunca crea esta policy; en LocalStack Community no
  se nota porque el enforcement de IAM es funcionalidad Pro, pero en AWS real
  **la regla casa el evento y la entrega falla en silencio**. IF el constructo
  `aws-cdk-lib/aws-events-targets.SqsQueue` no produjese esa policy por sí solo
  THEN el implementer SHALL añadirla explícitamente con
  `queue.addToResourcePolicy(...)`: el requisito es el hecho verificado en el
  template, no una suposición sobre el comportamiento de CDK.

- **R12**: WHEN se sintetiza el stack, el recurso `AWS::DynamoDB::Table` SHALL
  llevar `DeletionPolicy: 'Retain'` y `UpdateReplacePolicy: 'Retain'`
  (`RemovalPolicy.RETAIN`), y el recurso `AWS::S3::Bucket` SHALL llevar
  `DeletionPolicy: 'Delete'` y `UpdateReplacePolicy: 'Delete'`
  (`RemovalPolicy.DESTROY`). THE SYSTEM SHALL **no** pasar
  `autoDeleteObjects: true` a ningún constructo `s3.Bucket`, ni
  `encryptionKey`/`encryptionMasterKey` a ninguno: ambas cosas crean recursos
  extra (Lambda de custom resource + rol + log group; CMK con coste fijo
  ~$1/mes) y violan el criterio de aceptación 7. Consecuencia operativa
  aceptada y documentada en [[design]]: si el bucket tiene objetos,
  `cdk destroy` falla y hay que vaciarlo a mano; y la tabla retenida sigue
  consumiendo el cupo gratis de la cuenta aunque se destruya el stack.

- **R13**: WHEN se sintetiza el stack, el objeto `Resources` del template SHALL
  contener **exactamente 11 recursos** y **exactamente estos seis tipos**, con
  estos conteos y ningún otro:

  | Tipo CloudFormation | Conteo |
  |---|---|
  | `AWS::SQS::Queue` | 6 |
  | `AWS::SQS::QueuePolicy` | 1 |
  | `AWS::DynamoDB::Table` | 1 |
  | `AWS::S3::Bucket` | 1 |
  | `AWS::Events::EventBus` | 1 |
  | `AWS::Events::Rule` | 1 |

  El test SHALL construirse comparando el **conjunto completo** de valores
  `Type` del template contra ese mapa, no con aserciones de ausencia una por
  una, de forma que cualquier recurso nuevo introducido por descuido
  (`AWS::Lambda::Function`, `AWS::IAM::Role`, `AWS::Logs::LogGroup`,
  `AWS::KMS::Key`, `AWS::CDK::Metadata`, `AWS::DynamoDB::GlobalTable`,
  `AWS::RDS::*`, `AWS::ECS::*`, `AWS::EC2::NatGateway`) haga fallar el test sin
  que nadie lo haya previsto. Este es el criterio de aceptación 7 hecho
  ejecutable.

- **R14**: WHEN `infra/bin/app.ts` instancia el stack, THE SYSTEM SHALL fijar
  `env: { region: DEV_REGION }` con `DEV_REGION === 'us-east-1'` exportado
  desde `infra/lib/pet-tracker-dev-stack.ts`, y SHALL **no** fijar
  `env.account`, de forma que `Stack.of(stack).region === 'us-east-1'` y la
  síntesis siga sin necesitar credenciales.

### Bloque C — documentación (la cierra el implementer)

- **R15**: WHEN la feature queda cerrada, THE SYSTEM SHALL actualizar
  `docs/architecture.md` en dos puntos:
  (a) la fila de la tabla de equivalencias local↔AWS que hoy empieza por
  `| S3 \`pet-tracker-media-local\` — bloqueo de acceso público |` (línea 103)
  SHALL nombrar también el bucket de AWS real
  (`pet-tracker-media-dev-<accountId>`) y SHALL sustituir la marca
  **"Pendiente de verificar en un despliegue AWS real"** por una referencia a
  esta feature (#20) y al requisito que lo cierra (R21);
  (b) SHALL añadir una línea nueva registrando que los nombres desnudos de
  SQS/DynamoDB/EventBridge asumen **una cuenta AWS por entorno**, y que un
  segundo entorno en la misma cuenta y región exige activar el sufijo del
  helper `resourceName`.

- **R16**: WHEN la feature queda cerrada, THE SYSTEM SHALL documentar en
  `docs/verification.md`, en una sección `### Feature 20 — aws-cdk-dev-stack`,
  el procedimiento manual completo que ejecuta el humano: la comprobación de
  Billing de R17, el `cdk bootstrap` de R18, el `cdk deploy` de R19, la
  comprobación de no-op de R20 y el comando exacto del e2e de R21 (con la nota
  de que `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` deben estar comentadas en
  el `.env` raíz, igual que en la sección de la Feature 19).

### Bloque D — los cierra el humano, no el implementer

> Mismo patrón que #19 R11/R12. **Ningún agente ejecuta `cdk bootstrap` ni
> `cdk deploy`: crean recursos reales y cuestan dinero.** El implementer deja
> escrito lo que sea código (R21 mitad A) y documentado lo que sea
> procedimiento (R16); el humano ejecuta y registra el resultado en
> `progress/impl_aws-cdk-dev-stack.md`.

- **R17**: WHEN el humano se dispone a ejecutar el primer `cdk deploy`, THE
  SYSTEM SHALL haber verificado antes, en la consola de AWS Billing, que la
  cuenta (creada **después del 2025-07-15**, por tanto en el plan nuevo de Free
  Tier con créditos ~$200 y ventana de 6 meses) sigue cubriendo DynamoDB
  provisionado en clase Standard hasta 25 RCU / 25 WCU / 25 GB, y SHALL dejar
  registrado en `progress/impl_aws-cdk-dev-stack.md` qué ocurre al agotar los
  créditos o al cumplirse la ventana de 6 meses. Riesgo operativo con fecha: la
  cuenta puede cerrarse automáticamente si no se pasa a plan de pago.

- **R18**: WHEN el humano ejecuta `cdk bootstrap aws://<accountId>/us-east-1
  --termination-protection` con un principal que tenga `iam:*` (PowerUserAccess
  **no** lo incluye), THE SYSTEM SHALL crear la stack `CDKToolkit` sin errores.
  Recursos que provisiona y que no pertenecen a `PetTrackerDev`: bucket de
  staging `cdk-hnb659fds-assets-<account>-<region>`, repositorio ECR
  `cdk-hnb659fds-container-assets-…`, cinco roles IAM y un parámetro SSM de
  versión. Ninguno tiene coste fijo por hora y este stack no publica assets.
  El bootstrap actual **no** crea una CMK de KMS por defecto: SHALL no pasarse
  `--bootstrap-customer-key`.

- **R19**: WHEN el humano ejecuta `pnpm -C infra exec cdk deploy PetTrackerDev`
  con una sesión válida de `aws login` y PowerUserAccess, THE SYSTEM SHALL crear
  en `us-east-1` los 11 recursos de R13 y terminar con `CREATE_COMPLETE`.

- **R20**: WHEN el humano ejecuta el mismo `cdk deploy` una segunda vez sin
  ningún cambio en `infra/`, THE SYSTEM SHALL reportar que no hay cambios
  (`PetTrackerDev … no changes` / `(no changes)`) y SHALL no ejecutar ningún
  update de CloudFormation.

- **R21**: **Mitad A (implementer):** THE SYSTEM SHALL incluir
  `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts`, que sigue el patrón de
  `test/aws-real-smoke.e2e-spec.ts`: se salta entera con `describe.skip` WHILE
  `(process.env.AWS_MODE ?? '').trim().toLowerCase() !== 'aws'`, y IF
  `AWS_MODE=aws` AND `process.env.AWS_ACCESS_KEY_ID` tiene valor THEN SHALL
  fallar con un mensaje que nombre `AWS_ACCESS_KEY_ID`
  (`assertNoStaticAccessKey`). La suite SHALL no depender de Postgres ni de
  `AppModule`: usa solo los clientes de `src/aws/aws-clients.ts` y las
  constantes de `src/aws/constants.ts`. La suite SHALL cubrir, y solo, estos
  tres tramos, limpiando lo que escribe:
  1. `GetQueueUrlCommand({ QueueName: QUEUE_POSITIONS_RAW })` resuelve; un
     `SendMessageCommand` con un `runId` único aparece en un
     `ReceiveMessageCommand` (`WaitTimeSeconds: 20`) y se borra con
     `DeleteMessageCommand`.
  2. Un `PutCommand` en `TABLE_POSITIONS` con `pk = \`E2E#${runId}\``,
     `sk = Date.now()` y `expires_at` **en el futuro** es devuelto por un
     `QueryCommand` sobre esa `pk`, y se borra con `DeleteCommand` en el
     `afterAll`.
  3. Un `PutEventsCommand` sobre `EVENT_BUS_NAME` con `Source: EVENT_SOURCE` y
     `DetailType: DETAIL_TYPE_POSITION_UPDATED` llega a la cola
     `QUEUE_GEOFENCE_EVENTS` (polling con `WaitTimeSeconds: 20`, hasta 60 s en
     total) y el mensaje se borra. Este tramo es la verificación **en AWS real**
     de la resource-policy de R11.

  THE SYSTEM SHALL **no** escribir ningún item con `expires_at` en el pasado ni
  afirmar que un item expirado ha desaparecido: en AWS real DynamoDB borra los
  items expirados *"within a few days"*, no al instante como tiende a hacer
  LocalStack, así que un test así pasaría en local y fallaría (o tardaría días)
  contra AWS real. **Mitad B (humano):** WHEN el humano ejecuta esa suite con
  `AWS_MODE=aws` y los recursos de R19 desplegados, THE SYSTEM SHALL pasarla
  entera, **sin `skipped`**, y el humano SHALL registrar la corrida (output
  redactado, sin ARNs de cuenta) en `progress/impl_aws-cdk-dev-stack.md`.

---

## Fuera de alcance

- **El backend con `AWS_MODE=aws` todavía no sabe resolver el bucket real.**
  `BUCKET_MEDIA` sigue valiendo `'pet-tracker-media-local'` y
  `photo-storage.s3.adapter.ts` lo sigue usando tal cual. El bucket que declara
  el stack se llama `pet-tracker-media-dev-<accountId>` y **nadie en el runtime
  lo consume**. Cablear el runtime contra el bucket real es una **feature
  posterior**, no #20 (decisión D1 del humano). Que nadie dé por hecho lo
  contrario al leer el criterio de aceptación 9: R21 no toca S3.
- `backend-pet-tracker/src/aws/provisioning.ts` no se modifica. Ni una línea.
  Sigue sirviendo únicamente a LocalStack, incluida su ausencia de
  resource-policy de SQS (el bug latente de R11 no se arregla ahí porque ahí no
  se manifiesta).
- `backend-pet-tracker/src/aws/run-provisioning.ts` no se modifica, incluido su
  guarda de `AWS_MODE=aws` (#19 R8).
- No se convierte el repo en pnpm workspace, no se añaden project references de
  TypeScript, no se mueven las constantes a un paquete compartido. Razones en
  [[design]] §Alternativas descartadas.
- No se toca `init.sh`, `.github/workflows/ci.yml`,
  `backend-pet-tracker/tsconfig.json`, `backend-pet-tracker/package.json` ni
  `backend-pet-tracker/pnpm-lock.yaml`.
- El stack no declara RDS, Fargate, NAT Gateway, VPC, Lambda, API Gateway,
  CloudWatch Alarms ni Log Groups. Postgres sigue en Docker en esta fase.
- No se añade sufijo `-dev` a las colas, la tabla ni el bus (decisión D3:
  **una cuenta AWS por entorno**). El helper `resourceName` acepta sufijo, pero
  en dev resuelve a cadena vacía para todo lo que no sea el bucket S3, único
  recurso con namespace global.
- No se despliega nada desde un agente. R18-R21 los ejecuta el humano.
- No se cierra el pendiente de comportamiento de `pet-photos-s3` #6 R8 (un
  `GET` sin firmar que responda 403 contra AWS real). R15 solo actualiza la
  documentación del pendiente; verificarlo empíricamente queda para otra
  feature.
- Nit opcional, sin R-id: los docstrings de `provisioning.ts:325` ("5 colas
  SQS") y `run-provisioning.ts:23` ("los 8 recursos") quedaron obsoletos tras
  #12 — son **6 colas y 10 recursos**. Corregirlos es bienvenido si el
  implementer pasa por ahí, pero no bloquea la feature y **no** justifica abrir
  esos archivos si no hay otra razón.

---

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
