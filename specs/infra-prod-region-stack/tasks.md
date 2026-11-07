---
feature: "infra-prod-region-stack"
status: approved     # draft | approved
tags: [harness, spec, infra, produccion]
---

# Tareas — [[infra-prod-region-stack]]

> Disciplina TDD de `CHECKPOINTS.md` C4: cada requisito de [[requirements]]
> tiene un commit rojo (`test(...)`) seguido de un commit verde (`feat(...)`).
> Las decisiones están en [[design]]; aquí van el **qué** y el **orden**.

## Reglas de la cadena

### Dónde y con qué

- **Worktree**: `/home/claude/sites/Pet-Tracker-wt-246`, branch
  `feature/246-infra-prod-region-stack`. Todo comando empieza con un `cd`
  literal:
  ```
  cd /home/claude/sites/Pet-Tracker-wt-246/infra
  ```
- **Precondición**, que prepara el leader antes del handoff:
  `infra/node_modules` instalado con `pnpm install --frozen-lockfile`. Codex
  no instala.
- **Prohibido**:
  - `./init.sh`;
  - cualquier comando contra AWS: `cdk deploy`, `cdk bootstrap`, `cdk diff`,
    `cdk destroy`, `aws ...`;
  - `docker build`, `docker run` y cualquier acceso a la red;
  - `git rebase` y `git commit --amend` sobre commits ya hechos;
  - `git add -A` y `git add .`: cada commit añade sus ficheros por ruta;
  - `pnpm run <script> -- <args>` (el `--` llega a jest; usar `pnpm exec`);
  - tocar `infra/lib/pet-tracker-dev-stack.ts`,
    `infra/test/pet-tracker-dev-stack.test.ts`,
    `infra/test/no-duplicated-literals.test.ts`, `infra/cdk.json`,
    `infra/package.json`, `infra/pnpm-lock.yaml`, o cualquier fichero fuera de
    [[design]] §Archivos afectados.
- **Sin dependencias nuevas.** Todo está en `aws-cdk-lib` 2.263 y
  `constructs`.
- **Sin secretos.** Los secretos se nombran (`pet-tracker/prod/<nombre>`),
  nunca se escriben valores.
- **Sin prettier**: `infra/` no lo tiene. El estilo lo fija eslint.

### Comandos

- **Suite de infra completa** (la usan los rojos y los verdes):
  ```
  FORCE_COLOR=0 pnpm exec jest > /tmp/impl-246-<R>-<red|green>.log 2>&1; echo "exit=$?"
  ```
  Tarda alrededor de 30 s hoy y más a medida que el stack crece. Los avisos
  `W3010` (AZ fijas) que imprime la validación de CloudFormation son
  esperados ([[design]] §Incertidumbres) y no cambian el código de salida.
  También son esperadas las dos líneas por cada `TableV2` construida:
  - `[WARNING] aws-cdk-lib.aws_dynamodb.TableGrantsProps#encryptedResource is deprecated`;
  - `[WARNING] aws-cdk-lib.aws_dynamodb.TableGrantsProps#policyResource is deprecated`.

  Salen de dentro de `aws-cdk-lib` 2.263.0: un `new TableV2(...)` vacío
  también las imprime. No se «arreglan».
- **Tipos**: `pnpm exec tsc --noEmit -p tsconfig.json`. Debe salir 0 en
  **todos** los commits, rojos incluidos.
- **Lint**: `pnpm exec eslint <ficheros .ts tocados>`. Debe salir 0 en todos
  los commits.

### Rojo por aserción, nunca por ausencia

Un commit rojo falla **solo** por aserciones.

- `grep -cE "ReferenceError|Cannot find module|error TS|TypeError" /tmp/impl-246-<R>-red.log`
  debe dar `0`.
- Fallan solo los `it` del requisito:
  `grep -E "^  ● " /tmp/impl-246-<R>-red.log | grep -v "^  ● Console$" | grep -vc "^  ● #246 <R>:"`
  debe dar `0`, y `grep -cE "^  ● #246 <R>:" /tmp/impl-246-<R>-red.log` debe dar
  el número de `it` nuevos de ese bloque.
- El bloque `  ● Console` no es un test: jest lo imprime para el
  `console.error` de CDK `[Warning] Template validation found issues` con
  `WARNING Resources section must exist and be non-empty (CloudFormation Validate)`
  (F0001), que sale mientras un stack de prod no tiene recursos. Por eso el
  segundo grep lo excluye por línea exacta. Es un aviso esperado, como los
  `W3010`: no se silencia ni se «arregla». (Enmienda del leader 2026-11-06,
  tras el PARA de Codex en el rojo de R4.)
- Un helper de test nunca desreferencia un recurso que falta: devuelve `[]`
  o `undefined`, y el test compara con `toEqual`/`toBe` usando `?.`. Cuando
  hace falta estrechar un tipo para seguir, se lanza
  `new Error('#246 R<n>: <qué falta>')`, nunca se deja caer un `TypeError`.
- Si el test importa un símbolo de producción que todavía no existe, el
  commit rojo trae un **stub** con la firma final y un comportamiento
  incorrecto. Cada bloque dice cuál. Un parámetro sin usar se consume con
  `void <param>;`.

### Reglas de los tests

- **Prefijo `#246 R<n>:`** en cada `describe` y cada `it` nuevo. Los tests
  del stack dev ya usan `R1:`…`R14:`; sin el prefijo, las comprobaciones de
  arriba se confunden.
- **Sin `any`**. `template.toJSON()` se lee con un cast a una interfaz de
  lectura (`{ Resources?: Record<string, SynthesizedResource>; Outputs?: … }`),
  como en `pet-tracker-dev-stack.test.ts`, y las propiedades se estrechan con
  `as` desde `Record<string, unknown>` a interfaces locales.
- **Sin `expect.any`, `expect.arrayContaining` ni `expect.objectContaining`**
  dentro de objetos (rompen `no-unsafe-assignment`). Para coincidencias
  parciales, `Match.*` de `aws-cdk-lib/assertions` dentro de
  `template.hasResourceProperties`, o calcular el valor y usar `toEqual`.
- **Sin `toBe` ni `toBeInstanceOf` entre constructs**: si fallan, jest
  serializa un árbol circular y tumba el worker. Se compara el booleano:
  `expect(returned === app).toBe(true)`,
  `expect(stack instanceof PetTrackerProdStack).toBe(true)`.
- **Timeouts**: el `beforeAll` de nivel superior de
  `pet-tracker-prod-stack.test.ts` (entra en R4) lleva `120_000`; cada `it`
  que construye un stack propio, `60_000`.
- **Literales en los tests**: los tests usan los valores literales de
  [[requirements]] (`'positions-raw'`, `3`, …), no las constantes de
  `@backend/aws/constants`: fijan el valor, no solo el nombre.
- **Literales en `bin/` y `lib/`**: `no-duplicated-literals.test.ts` falla si
  un fichero de `bin/` o `lib/` contiene, entre comillas, alguno de estos
  valores: `positions-raw`, `positions-raw-dlq`, `notifications`,
  `notifications-dlq`, `geofence-events`, `geofence-events-dlq`, `positions`,
  `pk`, `sk`, `expires_at`, `pet-tracker-media`, `pet-tracker-media-local`,
  `pet-tracker`, `position.updated`, `battery.low`. Se importan de
  `@backend/aws/constants`. `'pet-tracker-ops'` y `'pet-tracker/prod/jwt'`
  no chocan (no son el valor exacto entre comillas).

### Mensajes de commit

- Rojo: `test(infra-prod-region-stack): <qué fija> (R<n>)`.
- Verde: `feat(infra-prod-region-stack): <qué hace> (R<n>)`.
- Cierre: los dos `docs(infra-prod-region-stack): …` de §Cierre.

### Tras cada commit

- `git status --short -- infra docs specs progress` no lista nada.
- tsc y eslint salieron 0 antes del commit.
- Cada verde deja la suite entera en verde con el total de la tabla de
  abajo.

### Cuentas de tests

Hoy la suite de infra tiene 2 suites y 14 tests. Cada fila da el total
**después** del verde; el rojo de esa fila tiene el mismo total con los `it`
nuevos fallando.

| R | `it` nuevos | Suites | Total tras el verde |
|---|---|---|---|
| R1 | 3 | 3 | 17 |
| R2 | 4 | 3 | 21 |
| R3 | 1 | 4 | 22 |
| R4 | 2 | 4 | 24 |
| R5 | 1 | 4 | 25 |
| R6 | 1 | 4 | 26 |
| R7 | 2 | 4 | 28 |
| R8 | 2 | 4 | 30 |
| R9 | 4 | 4 | 34 |
| R10 | 2 | 4 | 36 |
| R11 | 1 | 4 | 37 |
| R12 | 1 | 4 | 38 |
| R13 | 2 | 4 | 40 |
| R14 | 2 | 4 | 42 |
| R15 | 1 | 4 | 43 |
| R16 | 2 | 4 | 45 |
| R17 | 1 | 4 | 46 |
| R18 | 2 | 4 | 48 |
| R19 | 1 | 4 | 49 |
| R20 | 1 | 4 | 50 |

La cadena hace 40 commits de requisitos y 2 de cierre: 42 commits sobre el
HEAD del handoff.

## Helpers de los tests

Cada helper entra en el commit rojo del primer requisito que lo usa (eslint
rechaza funciones sin uso). Ninguno lanza ni desreferencia `undefined`.

### `infra/test/build-app.test.ts`

| Helper | Entra en | Qué hace |
|---|---|---|
| `stackIds(app: App): string[]` | R1 | `app.node.children.filter((child) => Stack.isStack(child)).map((child) => child.node.id)`, en orden de creación |
| `PROD_CONTEXT` | R2 | las seis claves con los valores de [[design]] §Props de prueba, tabla de R20 |
| `FIXTURE_IMAGE_DIRECTORY` | R20 | `join(__dirname, 'fixtures', 'backend-image')` |

### `infra/test/pet-tracker-prod-stack.test.ts`

| Helper | Entra en | Qué hace |
|---|---|---|
| `FIXTURE_IMAGE_DIRECTORY`, `PROPS` | R3 | [[design]] §Props de prueba |
| `buildStack(region: string, apiDomain: string = PROPS.apiDomain)` | R3 | `new PetTrackerProdStack(new App(), \`PetTrackerProd-${region}\`, { env: { region }, ...PROPS, apiDomain })` |
| `REGIONS` | R4 | `['mx-central-1', 'us-east-2'] as const` |
| `synthesized(region: string): Synthesized` | R4 | memo por región en un `Map`: crea su `App` y su stack con `PROPS`, y guarda `Template.fromStack(stack)`, sus `Resources` y `Outputs` leídos con cast, y `app.synth()` (el `Stage` cachea el ensamblado: es el mismo que usó `Template.fromStack`) |
| `beforeAll` de nivel superior | R4 | `synthesized` de las dos regiones, timeout `120_000` |
| `ofType(region, type): Array<[string, SynthesizedResource]>` | R4 | recursos de ese tipo con su logical id |
| `subnetIdsByAz(region, kind: 'Public' \| 'Isolated'): string[]` | R4 | logical ids de las subredes con la etiqueta `aws-cdk:subnet-type` = `kind`, ordenados por `AvailabilityZone` |
| `queueId(region, queueName): string \| undefined` | R5 | logical id de la cola con ese `QueueName` |
| `taskDefinition(region, which: 'api' \| 'workers' \| 'ops')` | R9 | `[logicalId, props]` de la TD cuyo único contenedor se llama `api`/`workers`, o cuya `Family` es `pet-tracker-ops`; `undefined` si no está |
| `containerOf(region, which)` | R9 | `ContainerDefinitions[0]` de esa TD, o `undefined` |
| `service(region, which: 'api' \| 'workers')` | R9 | `[logicalId, props]` del `AWS::ECS::Service` con / sin `LoadBalancers` |
| `securityGroupIdOf(value: unknown): string \| undefined` | R9 | el logical id de un `{ 'Fn::GetAtt': [id, 'GroupId'] }` |
| `withoutDescription(entry: Record<string, unknown>)` | R9 | copia sin la clave `Description` |
| `ingressesTo(region, groupId: string)` | R9 | `Properties` sin `Description` de las `AWS::EC2::SecurityGroupIngress` cuyo `GroupId` es `{ 'Fn::GetAtt': [groupId, 'GroupId'] }` |
| `dockerImageSources(region)` | R9 | de `synthesized(region).assembly.artifacts`, los `instanceof cxapi.AssetManifestArtifact` (`import * as cxapi from 'aws-cdk-lib/cx-api'`); concatena los `source` de `Object.values(artifact.contents.dockerImages ?? {})` |
| `envMap(container)` | R10 | `Environment` como `Record<Name, Value>` (`{}` si falta) |
| `roleIdOf(arn: unknown): string \| undefined` | R10 | el logical id de un `{ 'Fn::GetAtt': [id, 'Arn'] }` |
| `secretsReadBy(region, roleId: string \| undefined): string[]` | R10 | etiquetas, sin repetir y ordenadas, de los secretos que lee ese rol según [[requirements]] §Términos. Una `Resource` igual a `{ Ref: <la SecretTargetAttachment> }` es `db`; otra cuya serialización casa con `/:secret:pet-tracker\/prod\/([a-z-]+)-\?{6}/` es el grupo 1; **cualquier otra** `Resource` de una sentencia que incluye `secretsmanager:GetSecretValue` se etiqueta con su `JSON.stringify` y no se descarta, para que un comodín (`'*'`, `…:secret:pet-tracker/prod/*`) haga caer el `toEqual` («exactamente», R10, R14 y R16) |
| `statementsOf(region, roleId: string \| undefined): unknown[]` | R11 | sentencias de las `AWS::IAM::Policy` cuyo `Roles` contiene `{ Ref: roleId }`, normalizadas según [[requirements]] §Términos y ordenadas por su `JSON.stringify` |

## R1 — `buildApp` sin contexto: solo dev

- [ ] (1) **Rojo**.
  - **Stub**: `infra/lib/build-app.ts` exporta:
    - `PROD_CONTEXT_KEYS`, con su valor final de [[design]];
    - `BACKEND_IMAGE_DIRECTORY = ''`;
    - `buildApp(app: App, imageDirectory = BACKEND_IMAGE_DIRECTORY): App`,
      que hace `void app; void imageDirectory;` y devuelve `new App()`.
  - **Test**: `infra/test/build-app.test.ts`,
    `describe('#246 R1: sin contexto prod la app solo tiene PetTrackerDev')`.
    - `it('#246 R1: devuelve la misma app con solo PetTrackerDev en us-east-1')`:
      `const app = new App(); const returned = buildApp(app);` y
      `returned === app` es `true`; `stackIds(app)` es `['PetTrackerDev']`;
      `app.node.tryFindChild('PetTrackerDev')` es instancia de
      `PetTrackerDevStack` con `region` `DEV_REGION` (un solo booleano).
    - `it('#246 R1: BACKEND_IMAGE_DIRECTORY es backend-pet-tracker del repo')`:
      `toBe(join(__dirname, '..', '..', 'backend-pet-tracker'))`.
    - `it('#246 R1: bin/app.ts delega en buildApp')`: el contenido de
      `join(__dirname, '..', 'bin', 'app.ts')` contiene `buildApp(new App())`
      y no contiene `new PetTrackerDevStack`.
  - **Commit**: `test(infra-prod-region-stack): pin buildApp without prod context (R1)`.
- [ ] (2) **Verde**.
  - **Código**:
    - `build-app.ts`: `BACKEND_IMAGE_DIRECTORY = join(__dirname, '..', '..', 'backend-pet-tracker')`;
      `buildApp` crea `new PetTrackerDevStack(app, 'PetTrackerDev', { env: { region: DEV_REGION } })`,
      hace `void imageDirectory;` y devuelve `app`.
    - `bin/app.ts`: queda en el shebang, los imports de `App` y `buildApp`, y
      `buildApp(new App());`.
  - **Commit**: `feat(infra-prod-region-stack): compose the CDK app in buildApp (R1)`.
- [ ] (3) Refactor: no previsto.

## R2 — Contexto parcial lanza

- [ ] (1) **Rojo**.
  - **Stub**: ninguno.
  - **Test**: `build-app.test.ts`,
    `describe('#246 R2: contexto prod parcial lanza con las claves que faltan')`,
    con `it.each` sobre objetos `{ caso, context, missing }` y título
    `'#246 R2: $caso'`. Cada caso hace
    `expect(() => buildApp(new App({ context }))).toThrow(new Error(\`Missing prod context keys: ${missing}\`))`.
    - `solo apiDomain`: `{ apiDomain: PROD_CONTEXT.apiDomain }` →
      `hostedZoneId, hostedZoneName, alarmEmail, resendFrom, resetLinkHost`.
    - `sin alarmEmail ni resetLinkHost`: `PROD_CONTEXT` sin esas dos →
      `alarmEmail, resetLinkHost`.
    - `resendFrom en blanco`: `{ ...PROD_CONTEXT, resendFrom: '   ' }` →
      `resendFrom`.
    - `hostedZoneId numérico`: `{ ...PROD_CONTEXT, hostedZoneId: 12345 }` →
      `hostedZoneId`.
  - **Commit**: `test(infra-prod-region-stack): pin the partial prod context error (R2)`.
- [ ] (2) **Verde**.
  - **Código**: [[design]] DT1 pasos 1 y 2, antes de crear el stack dev.
  - **Commit**: `feat(infra-prod-region-stack): reject partial prod context (R2)`.
- [ ] (3) Refactor: no previsto.

## R3 — `apiDomain` dentro de la zona

- [ ] (1) **Rojo**.
  - **Stub**: `infra/lib/pet-tracker-prod-stack.ts` exporta
    `PetTrackerProdStackProps` con su forma final de [[design]] y
    `PetTrackerProdStack extends Stack`, cuyo constructor solo llama a
    `super(scope, id, props)`.
  - **Fixture**: `infra/test/fixtures/backend-image/Dockerfile`, una línea:
    `FROM scratch`.
  - **Test**: `infra/test/pet-tracker-prod-stack.test.ts`,
    `describe('#246 R3: apiDomain tiene que estar dentro de la zona')`, un
    solo `it('#246 R3: lanza fuera de la zona y no lanza dentro', …, 60_000)`:
    - `buildStack('mx-central-1', 'api.other.com')` lanza
      `new Error('apiDomain "api.other.com" is not inside hosted zone "example.com"')`;
    - ídem con `'apiexample.com'`;
    - `'example.com'` y `'api.example.com'` no lanzan.
  - **Commit**: `test(infra-prod-region-stack): pin the hosted zone check (R3)`.
- [ ] (2) **Verde**.
  - **Código**: primera sentencia tras `super`: si
    `apiDomain !== hostedZoneName && !apiDomain.endsWith(\`.${hostedZoneName}\`)`,
    lanza el error de R3.
  - **Commit**: `feat(infra-prod-region-stack): validate apiDomain against the hosted zone (R3)`.
- [ ] (3) Refactor: no previsto.

## R4 — Red sin NAT, en las dos regiones

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R4: VPC de 3 AZ sin NAT con endpoints gateway')`,
    `it.each(REGIONS)('#246 R4: red de %s', (region) => …)`. Todo lo de R4:
    - conteos con `template.resourceCountIs` (VPC 1, InternetGateway 1,
      NatGateway 0, EIP 0, Subnet 6);
    - AZ de `subnetIdsByAz(region, 'Public')` y `'Isolated'`, cada una
      `[\`${region}a\`, \`${region}b\`, \`${region}c\`]`;
    - los 2 `VPCEndpoint`: `VpcEndpointType` `Gateway`, 6 `RouteTableIds`, y
      la lista ordenada de `'s3'`/`'dynamodb'` según la serialización de
      `ServiceName` contenga `.s3"` o `.dynamodb"` es `['dynamodb', 's3']`;
    - las 3 `Route`: `DestinationCidrBlock` y `GatewayId` de R4, y sus
      `RouteTableId` ordenados iguales a los de las
      `SubnetRouteTableAssociation` de las subredes públicas, ordenados.
  - **Commit**: `test(infra-prod-region-stack): pin the NAT-less network in both regions (R4)`.
- [ ] (2) **Verde**.
  - **Código**: `Vpc` de [[design]] §Ids de construct y DT3.
  - **Commit**: `feat(infra-prod-region-stack): add the NAT-less VPC (R4)`.
- [ ] (3) Refactor: no previsto.

## R5 — Colas, bus y regla

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R5: colas con DLQ, bus y regla de geocercas')`,
    `it('#246 R5: seis colas, redrive, retención de DLQ, bus, regla y política')`
    sobre `mx-central-1`:
    - los `QueueName` ordenados de las 6 colas;
    - para cada par, `RedrivePolicy` exacto con `queueId` de la DLQ;
    - `MessageRetentionPeriod` `1209600` en las 3 DLQ;
    - bus y regla (`hasResourceProperties` con `Name`, `EventBusName`,
      `EventPattern`, `State` y `Targets` `[{ Arn: …, Id: 'Target0' }]`);
    - la `QueuePolicy` con `Queues` `[{ Ref: <geofence-events> }]` y una
      sentencia `Principal` `{ Service: 'events.amazonaws.com' }` cuyo
      `Action` (array) incluye `sqs:SendMessage`.
  - **Commit**: `test(infra-prod-region-stack): pin queues, bus and rule (R5)`.
- [ ] (2) **Verde**.
  - **Código**: las seis colas, el bus y la regla con los ids y constantes del
    stack dev; las tres DLQ con `retentionPeriod: Duration.days(14)`.
  - **Commit**: `feat(infra-prod-region-stack): add queues, event bus and rule (R5)`.
- [ ] (3) Refactor: no previsto.

## R6 — Tabla `positions` (DT8)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R6: tabla positions on-demand con PITR, protección y clave de AWS')`,
    `it('#246 R6: GlobalTable de una réplica, Retain y sin KMS')`:
    - `resourceCountIs('AWS::DynamoDB::GlobalTable', 1)`;
    - propiedades de R6 con `hasResourceProperties`, `Replicas` exacto
      (array literal, no `Match.arrayWith`) y `SSESpecification: Match.absent()`;
    - `DeletionPolicy` y `UpdateReplacePolicy` `Retain` del recurso;
    - `resourceCountIs('AWS::KMS::Key', 0)`.

    Las cuatro cosas van en el mismo `it`: la de KMS sola nacería verde.
  - **Commit**: `test(infra-prod-region-stack): pin the positions table and its AWS owned key (R6)`.
- [ ] (2) **Verde**.
  - **Código**: `PositionsTable` de [[design]] §Ids de construct, con
    `pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true }`
    y sin `encryption`.
  - **Commit**: `feat(infra-prod-region-stack): add the positions table (R6)`.
- [ ] (3) Refactor: no previsto.

## R7 — Bucket de media (DT8, DT9)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R7: bucket de media versionado, SSE-S3 y Retain')`,
    `it.each(REGIONS)('#246 R7: bucket de %s', …)`:
    - `resourceCountIs('AWS::S3::Bucket', 1)`;
    - `BucketName`, `VersioningConfiguration`, `BucketEncryption` exacto,
      `PublicAccessBlockConfiguration`, `CorsConfiguration: Match.absent()` y
      `LifecycleConfiguration` exacto de R7;
    - `DeletionPolicy` y `UpdateReplacePolicy` `Retain`;
    - la `BucketPolicy` con `Bucket` `{ Ref: <bucket> }` y la sentencia
      `Deny` de R7 (`Match.arrayWith([Match.objectLike({ … })])`).
  - **Commit**: `test(infra-prod-region-stack): pin the media bucket lifecycle and encryption (R7)`.
- [ ] (2) **Verde**.
  - **Código**: `MediaBucket` de [[design]] DT9; el sufijo del nombre usa la
    región del stack (`this.region`), no una constante.
  - **Commit**: `feat(infra-prod-region-stack): add the media bucket (R7)`.
- [ ] (3) Refactor: no previsto.

## R8 — Aurora (DT4)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R8: Aurora Serverless v2 en subredes aisladas')`,
    `it.each(REGIONS)('#246 R8: Aurora de %s', …)`, todo lo de R8:
    - `DBSubnetGroup` con `SubnetIds` (ordenados por JSON) iguales a los
      `Ref` de `subnetIdsByAz(region, 'Isolated')` (ordenados por JSON);
    - `DBCluster` con `hasResourceProperties` (incluye `KmsKeyId: Match.absent()`),
      su `MasterUserPassword` comprobado sobre `JSON.stringify` y sus
      políticas `Snapshot`;
    - las 2 `DBInstance`: la de `PromotionTier` `0` en `<r>a` y la de `1` en
      `<r>b`;
    - el único `Secret`, con `GenerateSecretString` de R8,
      `SecretString` ausente y políticas `Retain`.
  - **Commit**: `test(infra-prod-region-stack): pin the Aurora cluster and its retained secret (R8)`.
- [ ] (2) **Verde**.
  - **Código**: `DbSecret` y `Db` de [[design]] DT4.
  - **Commit**: `feat(infra-prod-region-stack): add Aurora Serverless v2 (R8)`.
- [ ] (3) Refactor: no previsto.

## R9 — API detrás del ALB (DT5, DT11, DT14)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R9: API en Fargate detrás de un ALB HTTPS')`,
    cuatro `it`:
    - `it('#246 R9: balanceador, certificado, registro, listeners y target group')`:
      - `ECS::Cluster` 1;
      - `LoadBalancer` 1, con `Scheme`, `Type`, `Subnets` (ordenados por
        JSON) = las públicas, y el atributo `idle_timeout.timeout_seconds`
        buscado por `Key` en `LoadBalancerAttributes`, `Value` `'60'`;
      - certificado y registro de R9 (el registro con `AliasTarget` cuya
        serialización contiene `{"Fn::GetAtt":["<lb>","DNSName"]}`);
      - listeners: 2; el de `443` con `Certificates` `[{ CertificateArn: { Ref: <cert> } }]`,
        `SslPolicy` y `DefaultActions` `[{ Type: 'forward', TargetGroupArn: { Ref: <tg> } }]`;
        el de `80` con `DefaultActions` `[{ Type: 'redirect', RedirectConfig: { Port: '443', Protocol: 'HTTPS', StatusCode: 'HTTP_301' } }]`;
      - target group de R9; `deregistration_delay.timeout_seconds` buscado por
        `Key` en `TargetGroupAttributes`, `Value` `'30'`.
    - `it('#246 R9: servicio API y su task definition')`:
      - `service(region, 'api')`: `LaunchType`, `DesiredCount`,
        `LoadBalancers` exacto, `NetworkConfiguration.AwsvpcConfiguration`
        con `AssignPublicIp` y `Subnets` (públicas, ordenadas por JSON);
      - de `DeploymentConfiguration`, campo por campo:
        `DeploymentCircuitBreaker` `toEqual({ Enable: true, Rollback: true })`,
        `MaximumPercent` `200`, `MinimumHealthyPercent` `100`. No se compara
        el objeto entero: CDK añade una clave `Alarms`;
      - TD API: `Cpu`, `Memory`, `RuntimePlatform`,
        `RequiresCompatibilities`, `NetworkMode`, un solo contenedor `api`,
        `PortMappings`, `LogConfiguration.LogDriver` `awslogs` y el grupo de
        `awslogs-group` con `RetentionInDays` `30`.
    - `it('#246 R9: grupos de seguridad del servicio y del balanceador')`:
      - el grupo del servicio API (`securityGroupIdOf` del primer
        `SecurityGroups` del servicio) sin `SecurityGroupIngress` en línea y
        `ingressesTo` igual a
        `[{ IpProtocol: 'tcp', FromPort: 3000, ToPort: 3000, GroupId: …, SourceSecurityGroupId: { 'Fn::GetAtt': [<sg del balanceador>, 'GroupId'] } }]`;
      - el grupo del balanceador (el de `SecurityGroups` del `LoadBalancer`)
        con `SecurityGroupIngress` sin `Description`, ordenado por
        `FromPort`, igual a las entradas `tcp` `80` y `443` desde `0.0.0.0/0`.
    - `it('#246 R9: una sola imagen Docker linux/amd64')`:
      `dockerImageSources('mx-central-1')` tiene longitud 1 y su `platform`
      es `'linux/amd64'`.
  - **Commit**: `test(infra-prod-region-stack): pin the API service behind the ALB (R9)`.
- [ ] (2) **Verde**.
  - **Código**: `Cluster`, `HostedZone`, la imagen única de DT14, `ApiLogs` y
    `Api` de DT5, con `configureHealthCheck` y `setAttribute`. **Sin
    `environment` ni `secrets`** todavía (son de R10).
  - **Commit**: `feat(infra-prod-region-stack): add the API service behind an HTTPS ALB (R9)`.
- [ ] (3) Refactor: no previsto.

## R10 — Entorno y secretos de la API (DT12, DT13)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R10: entorno y secretos del contenedor api')`:
    - `it('#246 R10: environment exacto')`: `envMap(containerOf(region, 'api'))`
      `toEqual` el mapa de R10, con `RESEND_FROM` = `PROPS.resendFrom` y
      `RESET_LINK_HOST` = `PROPS.resetLinkHost`.
    - `it('#246 R10: secretos y lectura del execution role')`:
      - nombres de `Secrets` ordenados;
      - `ValueFrom` de `PGPASSWORD` exacto, con el id de la única
        `SecretTargetAttachment`;
      - cada otro `ValueFrom` serializado contiene
        `:secret:pet-tracker/prod/<nombre>"`;
      - `secretsReadBy(region, roleIdOf(<ExecutionRoleArn de la TD API>))`
        es `['anthropic-api-key', 'db', 'jwt', 'resend-api-key', 'wialon-token']`.
  - **Commit**: `test(infra-prod-region-stack): pin the api environment and secrets (R10)`.
- [ ] (2) **Verde**.
  - **Código**: `JwtSecret`, `WialonTokenSecret`, `ResendApiKeySecret`,
    `AnthropicApiKeySecret` de DT12, y `environment`/`secrets` del contenedor
    `api` según DT13.
  - **Commit**: `feat(infra-prod-region-stack): wire the api environment and secrets (R10)`.
- [ ] (3) Refactor: no previsto.

## R11 — IAM de la API (DT10, decisión 3)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R11: task role de la API con permisos mínimos')`,
    `it('#246 R11: cuatro sentencias exactas, sin políticas administradas')`:
    `statementsOf(region, roleIdOf(<TaskRoleArn de la TD API>))` `toEqual`
    las cuatro sentencias de R11 normalizadas y ordenadas igual (cada una con
    `Effect: 'Allow'`), y el `AWS::IAM::Role` del task role sin
    `ManagedPolicyArns`.
  - **Commit**: `test(infra-prod-region-stack): pin the api task role statements (R11)`.
- [ ] (2) **Verde**.
  - **Código**: los cuatro `addToPrincipalPolicy` de DT10.
  - **Commit**: `feat(infra-prod-region-stack): grant the api its minimal IAM (R11)`.
- [ ] (3) Refactor: no previsto.

## R12 — Escalado de la API

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R12: la API escala de 2 a 4 tareas por CPU')`,
    `it('#246 R12: scalable target y política target tracking al 60 %')`:
    conteos 1 y 1; `ScalableTarget` de R12 con el `ResourceId` exacto
    (cluster y servicio API por logical id); `ScalingPolicy` con
    `PolicyType` `TargetTrackingScaling`, `ScalingTargetId` `{ Ref: <target> }`
    y `TargetTrackingScalingPolicyConfiguration` con
    `PredefinedMetricSpecification.PredefinedMetricType` y `TargetValue` `60`.
  - **Commit**: `test(infra-prod-region-stack): pin api autoscaling (R12)`.
- [ ] (2) **Verde**.
  - **Código**: `autoScaleTaskCount` y `scaleOnCpuUtilization('ApiCpuScaling', …)` de DT5.
  - **Commit**: `feat(infra-prod-region-stack): autoscale the api on CPU (R12)`.
- [ ] (3) Refactor: no previsto.

## R13 — Servicio workers (DT6)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R13: un único worker sin entrada de red')`:
    - `it('#246 R13: servicio workers, su grupo y la imagen compartida')`:
      `resourceCountIs('AWS::ECS::Service', 2)`; el servicio workers con los
      campos de R13 (`DeploymentConfiguration` campo por campo, como R9); su
      único grupo sin `SecurityGroupIngress` en línea, `ingressesTo` `[]` y
      `SecurityGroupEgress` sin `Description` igual a
      `[{ CidrIp: '0.0.0.0/0', IpProtocol: '-1' }]`; y
      `dockerImageSources` de longitud 1. La imagen única va en este `it`
      porque sola nacería verde.
    - `it('#246 R13: task definition workers')`: `Cpu`, `Memory`,
      `RuntimePlatform`, contenedor `workers` sin `PortMappings`, `Image`
      `toEqual` la del contenedor `api`, log `awslogs` a un grupo con
      `RetentionInDays` `30`.
  - **Commit**: `test(infra-prod-region-stack): pin the singleton workers service (R13)`.
- [ ] (2) **Verde**.
  - **Código**: `WorkersSg`, `WorkersLogs`, `WorkersTask` y `Workers` de DT6,
    con la misma imagen. **Sin `environment` ni `secrets`** (son de R14).
  - **Commit**: `feat(infra-prod-region-stack): add the singleton workers service (R13)`.
- [ ] (3) Refactor: no previsto.

## R14 — Entorno y secretos de workers

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R14: entorno y secretos del contenedor workers')`:
    - `it('#246 R14: environment exacto')`: `envMap` `toEqual` el mapa de R14.
    - `it('#246 R14: secretos y lectura del execution role')`: nombres
      ordenados, `ValueFrom` como en R10, y `secretsReadBy` del execution
      role de la TD workers `['db', 'jwt', 'wialon-token']`.
  - **Commit**: `test(infra-prod-region-stack): pin the workers environment and secrets (R14)`.
- [ ] (2) **Verde**.
  - **Código**: `environment`/`secrets` del contenedor `workers` según DT12 y
    DT13.
  - **Commit**: `feat(infra-prod-region-stack): wire the workers environment and secrets (R14)`.
- [ ] (3) Refactor: no previsto.

## R15 — IAM de workers

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R15: task role de workers con permisos mínimos')`,
    `it('#246 R15: cuatro sentencias exactas, sin políticas administradas')`:
    como R11, con las sentencias de R15. Los `Resource` múltiples son arrays
    de `{ 'Fn::GetAtt': [queueId(...), 'Arn'] }` ordenados por JSON.
  - **Commit**: `test(infra-prod-region-stack): pin the workers task role statements (R15)`.
- [ ] (2) **Verde**.
  - **Código**: los cuatro `addToPrincipalPolicy` del contrato #245
    ([[design]] DT10).
  - **Commit**: `feat(infra-prod-region-stack): grant workers their minimal IAM (R15)`.
- [ ] (3) Refactor: no previsto.

## R16 — Tarea ops (DT7)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R16: task definition ops sin task role')`:
    - `it('#246 R16: TD ops, su contenedor, logs y secretos')`: todo lo de
      R16 sobre `taskDefinition(region, 'ops')`: propiedades de la TD,
      `TaskRoleArn` `undefined`, `ExecutionRoleArn` definido; contenedor
      `ops` con `Command`, `Image` `toEqual` la de `api`, sin
      `PortMappings`, `envMap` exacto, nombres de `Secrets`
      `['PGPASSWORD', 'WIALON_TOKEN']`; grupo de logs con `RetentionInDays`
      `30`; `secretsReadBy` del execution role `['db', 'wialon-token']`.
    - `it('#246 R16: cinco roles de ecs-tasks, todos referenciados, y dos servicios')`:
      los logical ids ordenados de los `AWS::IAM::Role` cuyo
      `AssumeRolePolicyDocument` serializado contiene
      `"ecs-tasks.amazonaws.com"` `toEqual` los ids ordenados y sin repetir
      de `roleIdOf` sobre `TaskRoleArn` y `ExecutionRoleArn` de las tres TD
      (los `undefined` fuera), y ese array tiene longitud 5;
      `resourceCountIs('AWS::ECS::Service', 2)`.
  - **Commit**: `test(infra-prod-region-stack): pin the ops task definition (R16)`.
- [ ] (2) **Verde**.
  - **Código**: `OpsLogs` y `OpsTask` de DT7, con las dos líneas que quitan
    el task role justo después de `addContainer`.
  - **Commit**: `feat(infra-prod-region-stack): add the ops task definition for migrations and one-offs (R16)`.
- [ ] (3) Refactor: no previsto.

## R17 — Entrada a Aurora

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R17: Aurora solo acepta tráfico de la API y de workers')`,
    `it('#246 R17: dos reglas de entrada desde grupos, ninguna desde CIDR')`:
    el grupo de `VpcSecurityGroupIds` del `DBCluster` sin
    `SecurityGroupIngress` en línea; `ingressesTo` ordenado por JSON igual a
    las dos reglas de R17 (`SourceSecurityGroupId` del grupo del servicio API
    y del de workers); ninguna con `CidrIp`.
  - **Commit**: `test(infra-prod-region-stack): pin the Aurora ingress rules (R17)`.
- [ ] (2) **Verde**.
  - **Código**: los dos `allowDefaultPortFrom` de DT4.
  - **Commit**: `feat(infra-prod-region-stack): open Aurora to the api and workers only (R17)`.
- [ ] (3) Refactor: no previsto.

## R18 — Alarmas (DT15)

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R18: alarmas por correo')`:
    - `it('#246 R18: topic y suscripción email')`: `Topic` 1; `Subscription`
      1 con `{ Endpoint: PROPS.alarmEmail, Protocol: 'email', TopicArn: { Ref: <topic> } }`.
    - `it('#246 R18: ocho alarmas exactas')`:
      - `Alarm` 8, todas con los cinco campos comunes de R18;
      - la lista ordenada de
        `` `${Namespace} ${MetricName} ${Statistic} ${Threshold} ${<nombres de Dimensions ordenados>.join('+')}` ``
        `toEqual` las 8 de R18;
      - `Value` de las dimensiones:
        - ELB 5XX: `LoadBalancer` = `{ 'Fn::GetAtt': [<lb>, 'LoadBalancerFullName'] }`;
        - target 5XX y no sanos: `TargetGroup` = `{ 'Fn::GetAtt': [<tg>, 'TargetGroupFullName'] }`,
          y `LoadBalancer` solo presente (su valor lo deriva CDK del listener;
          no se fija);
        - las de SQS: los `QueueName` ordenados por JSON son
          `{ 'Fn::GetAtt': [<dlq>, 'QueueName'] }` de las tres DLQ;
        - las de RDS: `DBInstanceIdentifier` = `{ Ref: <instancia con PromotionTier 0> }`.
  - **Commit**: `test(infra-prod-region-stack): pin the alarm topic and alarms (R18)`.
- [ ] (2) **Verde**.
  - **Código**: `AlarmTopic`, la suscripción y las ocho alarmas de DT15, cada
    una con `treatMissingData: TreatMissingData.NOT_BREACHING`,
    `comparisonOperator: GREATER_THAN_OR_EQUAL_TO_THRESHOLD`,
    `evaluationPeriods: 1` y `addAlarmAction(new SnsAction(topic))`.
  - **Commit**: `feat(infra-prod-region-stack): add alarms to an email topic (R18)`.
- [ ] (3) Refactor: no previsto.

## R19 — Outputs

- [ ] (1) **Rojo**.
  - **Test**: `describe('#246 R19: outputs para la operación')`,
    `it('#246 R19: seis outputs con sus valores')`: `outputs[<id>]?.Value`
    `toEqual` cada valor de R19. `PublicSubnetIds` se espera como
    `{ 'Fn::Join': [',', subnetIdsByAz(region, 'Public').map((id) => ({ Ref: id }))] }`.
    No se fija la lista completa de outputs: el patrón añade los suyos.
  - **Commit**: `test(infra-prod-region-stack): pin the operational outputs (R19)`.
- [ ] (2) **Verde**.
  - **Código**: los seis `CfnOutput` de DT15 (`Fn.join`, no `Array.prototype.join`).
  - **Commit**: `feat(infra-prod-region-stack): export the operational outputs (R19)`.
- [ ] (3) Refactor: no previsto.

## R20 — `buildApp` con contexto completo

- [ ] (1) **Rojo**.
  - **Stub**: ninguno.
  - **Test**: `build-app.test.ts`,
    `describe('#246 R20: con contexto prod completo la app añade el stack de mx-central-1')`,
    `it('#246 R20: añade PetTrackerProd-mx-central-1 con los valores del contexto', …, 60_000)`:
    - `const app = new App({ context: PROD_CONTEXT }); buildApp(app, FIXTURE_IMAGE_DIRECTORY);`
    - `stackIds(app)` es `['PetTrackerDev', 'PetTrackerProd-mx-central-1']`;
    - `const prod = app.node.tryFindChild('PetTrackerProd-mx-central-1')`; si
      no es instancia de `PetTrackerProdStack`, lanza
      `new Error('#246 R20: falta el stack prod')`; si lo es, `prod.region`
      es `'mx-central-1'`;
    - sobre `Template.fromStack(prod)`, con `hasResourceProperties`: los
      valores de R20.
  - **Commit**: `test(infra-prod-region-stack): pin buildApp with full prod context (R20)`.
- [ ] (2) **Verde**.
  - **Código**: `PROD_PRIMARY_REGION` en `pet-tracker-prod-stack.ts`, y
    [[design]] DT1 paso 4 en `buildApp`, con los valores con `trim()` y
    `imageDirectory`.
  - **Commit**: `feat(infra-prod-region-stack): add the primary prod stack from context (R20)`.
- [ ] (3) Refactor: no previsto.

## Cierre

1. **Suite de infra completa**:
   ```
   FORCE_COLOR=0 pnpm exec jest > /tmp/impl-246-all.log 2>&1; echo "exit=$?"
   ```
   `exit=0`, `Test Suites: 4 passed, 4 total`, `Tests: 50 passed, 50 total`.
2. **Tipos y lint de todo `infra/`**:
   `pnpm exec tsc --noEmit -p tsconfig.json; echo "tsc exit=$?"` y
   `pnpm run lint; echo "lint exit=$?"`, los dos `0`.
3. **Synth sin contexto, sin credenciales**:
   ```
   rm -rf cdk.out
   env -u AWS_PROFILE -u AWS_ACCESS_KEY_ID -u AWS_SECRET_ACCESS_KEY -u AWS_SESSION_TOKEN AWS_CONFIG_FILE=/dev/null AWS_SHARED_CREDENTIALS_FILE=/dev/null AWS_EC2_METADATA_DISABLED=true CDK_DISABLE_VERSION_CHECK=1 CDK_DISABLE_CLI_TELEMETRY=true pnpm run synth > /tmp/impl-246-synth.log 2>&1; echo "exit=$?"
   test -f cdk.out/PetTrackerDev.template.json && echo dev-ok
   ls cdk.out | grep -c '^PetTrackerProd'
   ```
   `exit=0`, `dev-ok` y `0`. Sin contexto prod no se construye la imagen.
4. **El stack dev no cambió**:
   `git diff --exit-code <HEAD del handoff> -- lib/pet-tracker-dev-stack.ts test/pet-tracker-dev-stack.test.ts test/no-duplicated-literals.test.ts cdk.json package.json pnpm-lock.yaml; echo "exit=$?"`
   da `exit=0`.
5. **Mutaciones**. Para cada una: editar, correr la suite completa a
   `/tmp/impl-246-mut-<n>.log`, anotar el `exit=` (distinto de `0`) y las
   líneas `● #246 …` que fallan, y revertir con
   `git checkout HEAD -- <fichero>`. Debe fallar al menos un `it` del
   requisito indicado.

   | n | Fichero | Mutación | Debe fallar |
   |---|---|---|---|
   | 1 | `lib/pet-tracker-prod-stack.ts` | `endsWith(hostedZoneName)` sin el punto | R3 |
   | 2 | ídem | quitar el endpoint gateway de DynamoDB | R4 (las dos regiones) |
   | 3 | ídem | `removalPolicy: RemovalPolicy.DESTROY` en la tabla | R6 |
   | 4 | ídem | `encryption: dynamodb.TableEncryptionV2.awsManagedKey()` en la tabla | R6 |
   | 5 | ídem | la región del nombre del bucket cambiada por `PROD_PRIMARY_REGION` | R7 `us-east-2` (y no `mx-central-1`) |
   | 6 | ídem | `BucketEncryption.KMS_MANAGED` | R7 |
   | 7 | ídem | sin `expiredObjectDeleteMarker` | R7 |
   | 8 | ídem | `removalPolicy: RemovalPolicy.DESTROY` en Aurora | R8 |
   | 9 | ídem | `Platform.LINUX_ARM64` en la imagen | R9 |
   | 10 | ídem | `idleTimeout: Duration.seconds(120)` | R9 |
   | 11 | ídem | `AWS_ENDPOINT_URL: 'http://localhost:4566'` en el entorno de `api` | R10 |
   | 12 | ídem | `s3:DeleteObject` sobre `bucket.arnForObjects('*')` | R11 |
   | 13 | ídem | quitar las dos líneas que borran el task role de ops | R16 |
   | 14 | ídem | `RetentionDays.ONE_WEEK` en `OpsLogs` | R16 |
   | 15 | ídem | añadir al execution role de `api` una sentencia `secretsmanager:GetSecretValue` sobre `'*'` | R10 |

   Al terminar, `git diff --exit-code; echo "exit=$?"` y
   `git diff --cached --exit-code; echo "exit=$?"` dan `exit=0` los dos.
6. **`docs/conventions.md`**, fila de `ANTHROPIC_MODEL` (anclar por
   contenido, no por línea):
   - antes: `grep -cF 'Junto con `.env.example` es el único sitio del repo con el literal del modelo' ../docs/conventions.md`
     da `1`;
   - sustituir esa frase por
     `Junto con `.env.example` y `infra/lib/pet-tracker-prod-stack.ts` (entorno del contenedor `api` en producción, #246), más su test `infra/test/pet-tracker-prod-stack.test.ts`, son los únicos sitios del repo con el literal del modelo`,
     sin tocar el resto de la fila;
   - después: el primer `grep` da `0` y
     `grep -cF 'y `infra/lib/pet-tracker-prod-stack.ts` (entorno del contenedor `api` en producción, #246)' ../docs/conventions.md`
     da `1`.
   - **Commit**: `docs(infra-prod-region-stack): note the model literal in the prod stack`.
7. **Trazabilidad e informe**:
   - rellenar [[traceability]]: por fila, `archivo::nombre del it` (todos
     los del requisito) y `hash rojo + hash verde` con el mensaje del verde;
   - escribir `progress/impl_infra-prod-region-stack.md` con la lista de
     commits, los `exit=` de los pasos 1 a 4, la evidencia de las 15
     mutaciones y cualquier desviación de esta spec con su motivo;
   - **Commit**: `docs(infra-prod-region-stack): fill traceability`.

Tras el cierre, `git rev-list --count <HEAD del handoff>..HEAD` da `42`.
