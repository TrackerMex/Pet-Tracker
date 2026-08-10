---
feature: "aws-cdk-dev-stack"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[aws-cdk-dev-stack]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden obligatorio.** R2 y R1 van primero porque el resto no compila sin
> ellos; R6 va inmediatamente después de R1 porque hasta que el gate no
> ejecute `infra/`, ningún test del bloque B se está corriendo de verdad (y un
> `init.sh` en verde sería mentira). Los R-ids del bloque D (R17-R21) los
> cierra el humano: el implementer solo deja escrita la mitad A de R21 y para.
>
> **El nombre del `describe` de cada test empieza por el R-id** (`R7: …`), como
> en el resto del repo. La trazabilidad depende de eso.
>
> Convención de commits: `feat(aws-cdk-dev-stack): <desc> (R1,R2)`.
> Branch: `feature/20-aws-cdk-dev-stack`. No mergear a `main`: abrir PR con
> `env -u GITHUB_TOKEN gh pr create` y parar.

---

## Preparación (sin R-id)

- [ ] Levantar Docker (`docker compose up -d`) — el puerto 5432 estaba caído al
      escribir esta spec y sin él los e2e de LocalStack se saltan, con lo que
      R3 no se verifica de verdad.
- [ ] `./init.sh` en verde **antes** de tocar nada, para tener una línea base.

---

## R2 — `constants.ts`: `BUCKET_MEDIA_BASE` + `resourceName`, `BUCKET_MEDIA` intacto

- [ ] (1) Escribir test que falla para R2: `backend-pet-tracker/src/aws/constants.spec.ts`,
      `describe('R2: base y helper de composicion de nombres de recurso')` —
      afirma `BUCKET_MEDIA_BASE === 'pet-tracker-media'`,
      `resourceName('positions-raw', '') === 'positions-raw'`,
      `resourceName('pet-tracker-media', 'dev-123') === 'pet-tracker-media-dev-123'`
      y `BUCKET_MEDIA === 'pet-tracker-media-local'`.
- [ ] (2) Implementación mínima que lo pasa: las tres líneas de `constants.ts`
      de [[design]] §D3, conservando y reescribiendo el comentario de L34-35.
- [ ] (3) Refactor con tests verdes: `pnpm -C backend-pet-tracker test` completo
      + `pnpm -C backend-pet-tracker run test:e2e` para confirmar que los cuatro
      consumidores de `BUCKET_MEDIA` no se han enterado de nada.

## R1 — Paquete `infra/` que sintetiza sin credenciales

- [ ] (1) Escribir test que falla para R1: `infra/test/pet-tracker-dev-stack.test.ts`,
      `describe('R1: el stack sintetiza sin credenciales AWS')` — construye
      `new PetTrackerDevStack(new App(), 'PetTrackerDev', { env: { region: DEV_REGION } })`
      y `Template.fromStack(stack)` sin lanzar. Falla porque el paquete no existe.
- [ ] (2) Implementación mínima que lo pasa: crear `infra/` con los archivos y
      dependencias de [[design]] §Estructura, el `cdk.json` de §D6, el triple
      cableado del alias de §D5, y un `PetTrackerDevStack` vacío. Verificar a
      mano `pnpm -C infra run synth` con el entorno **sin** credenciales
      (`env -u AWS_ACCESS_KEY_ID -u AWS_SECRET_ACCESS_KEY -u AWS_PROFILE -u AWS_SESSION_TOKEN pnpm -C infra run synth`).
- [ ] (3) Refactor con tests verdes: commitear `infra/pnpm-lock.yaml`; confirmar
      con `git diff --name-only` que `backend-pet-tracker/tsconfig.json`,
      `backend-pet-tracker/package.json`, `backend-pet-tracker/pnpm-lock.yaml`
      y `.github/workflows/ci.yml` no aparecen.

## R5 — `.gitignore` ignora `cdk.out/`

- [ ] (1) Escribir test que falla para R5: `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts`,
      `describe('R5: .gitignore ignora cdk.out')` — lee el `.gitignore` de la
      raíz y afirma que alguna línea es exactamente `cdk.out/`.
- [ ] (2) Implementación mínima que lo pasa: añadir la línea.
- [ ] (3) Refactor con tests verdes: `pnpm -C infra run synth && git status --porcelain`
      debe salir vacío.

## R6 — `init.config.sh` encadena `infra/` (y `cdk synth`) en el gate

- [ ] (1) Escribir test que falla para R6: en el mismo
      `cdk-dev-stack-docs.spec.ts`, `describe('R6: init.config.sh ejecuta el paquete infra')`
      — lee `init.config.sh` y afirma que las cinco líneas `INSTALL_CMD`,
      `BUILD_CMD`, `TEST_CMD`, `LINT_CMD` y `TYPECHECK_CMD` contienen
      `pnpm -C infra`, nombrando en el mensaje de fallo la que falte.
- [ ] (2) Implementación mínima que lo pasa: las cinco líneas exactas de
      [[requirements]] R6. **No tocar `init.sh`.**
- [ ] (3) Refactor con tests verdes: `./init.sh` completo en verde. A partir de
      aquí los tests de `infra/` sí se están ejecutando de verdad.

## R4 — Cero literales de nombres de recurso en `infra/bin` y `infra/lib`

- [ ] (1) Escribir test que falla para R4: `infra/test/no-duplicated-literals.test.ts`,
      `describe('R4: el stack no duplica literales de constants.ts')` — recorre
      recursivamente los `.ts` de `infra/bin` y `infra/lib`, importa las 17
      constantes de `@backend/aws/constants` y, por cada valor `V`, afirma que
      ningún archivo contiene `'V'`, `"V"` ni `` `V` ``. Mismo mecanismo que
      `src/aws/no-hardcoded-credentials.spec.ts`.
- [ ] (2) Implementación mínima que lo pasa: importar las constantes en el stack
      en vez de escribir strings.
- [ ] (3) Refactor con tests verdes: comprobar que el mensaje de fallo nombra el
      archivo y el literal ofensor (metiendo un literal a propósito y quitándolo).

## R7 — Seis colas SQS con nombres exactos y tres `RedrivePolicy`

- [ ] (1) Escribir test que falla para R7 en `infra/test/pet-tracker-dev-stack.test.ts`:
      `describe('R7: seis colas SQS con RedrivePolicy hacia su DLQ')` —
      `template.resourceCountIs('AWS::SQS::Queue', 6)` + un
      `hasResourceProperties` por cola con su `QueueName`, y para las tres
      principales el `RedrivePolicy` con `maxReceiveCount: SQS_MAX_RECEIVE_COUNT`
      y `deadLetterTargetArn` con la forma `{ 'Fn::GetAtt': [<id>, 'Arn'] }`.
- [ ] (2) Implementación mínima que lo pasa: seis `sqs.Queue` con
      `queueName: resourceName(CONSTANTE, ENV_SUFFIX)` y `deadLetterQueue`
      en las tres principales. Sin `encryption`, sin `visibilityTimeout`.
- [ ] (3) Refactor con tests verdes.

## R8 — Tabla DynamoDB `PROVISIONED` 25/25, `STANDARD`, TTL, sin PITR

- [ ] (1) Escribir test que falla para R8:
      `describe('R8: tabla positions PROVISIONED 25/25 STANDARD con TTL')` —
      `resourceCountIs('AWS::DynamoDB::Table', 1)`,
      `resourceCountIs('AWS::DynamoDB::GlobalTable', 0)` y un
      `hasResourceProperties` con `TableName`, `BillingMode`,
      `ProvisionedThroughput`, `TableClass`, `KeySchema`,
      `AttributeDefinitions` y `TimeToLiveSpecification` según [[requirements]] R8;
      más una aserción de que no hay `PointInTimeRecoverySpecification` con
      `PointInTimeRecoveryEnabled: true`.
- [ ] (2) Implementación mínima que lo pasa: `new dynamodb.Table(...)` — **no**
      `TableV2` ([[design]] §D7) — con `billingMode: PROVISIONED`,
      `readCapacity: 25`, `writeCapacity: 25`,
      `tableClass: TableClass.STANDARD`,
      `timeToLiveAttribute: TABLE_POSITIONS_TTL_ATTRIBUTE`,
      `partitionKey` STRING y `sortKey` NUMBER.
- [ ] (3) Refactor con tests verdes.

## R9 — Bucket con nombre compuesto por token y los cuatro flags

- [ ] (1) Escribir test que falla para R9:
      `describe('R9: bucket de media con nombre por account-id y PublicAccessBlock')`
      — `hasResourceProperties('AWS::S3::Bucket', { BucketName: { 'Fn::Join': ['', ['pet-tracker-media-dev-', { Ref: 'AWS::AccountId' }]] }, PublicAccessBlockConfiguration: {…los 4 flags true} })`
      y `resourceCountIs('AWS::S3::BucketPolicy', 0)`.
      Ojo: el `BucketName` **no** es un string en el template ([[design]] §D1).
- [ ] (2) Implementación mínima que lo pasa: `new s3.Bucket(...)` con
      `bucketName: resourceName(BUCKET_MEDIA_BASE, \`${ENV_NAME}-${Aws.ACCOUNT_ID}\`)`
      y `blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL`. Nada de
      `autoDeleteObjects` ni `encryptionKey`.
- [ ] (3) Refactor con tests verdes.

## R10 — Bus, regla y target

- [ ] (1) Escribir test que falla para R10:
      `describe('R10: bus pet-tracker y regla geofence-events con su target')` —
      `resourceCountIs` de `AWS::Events::EventBus` y `AWS::Events::Rule` a 1
      cada uno, `hasResourceProperties` con `Name`, `EventBusName`, `State`,
      el `EventPattern` exacto y `Targets` de longitud 1 apuntando al
      `Fn::GetAtt … Arn` de la cola `geofence-events`; más aserción de que la
      regla no tiene `InputTransformer` ni `RoleArn`.
- [ ] (2) Implementación mínima que lo pasa: `events.EventBus` +
      `events.Rule` con `eventBus`, `ruleName` y `eventPattern`, y
      `rule.addTarget(new targets.SqsQueue(geofenceEventsQueue))`.
- [ ] (3) Refactor con tests verdes.

## R11 — `AWS::SQS::QueuePolicy` para `events.amazonaws.com`

- [ ] (1) Escribir test que falla para R11:
      `describe('R11: resource-policy de SQS para el target de EventBridge')` —
      `resourceCountIs('AWS::SQS::QueuePolicy', 1)` + `hasResourceProperties`
      con `Queues` referenciando la cola `geofence-events` y un statement
      `Allow` / `Principal.Service: 'events.amazonaws.com'` / `Action` que
      incluya `sqs:SendMessage`.
- [ ] (2) Implementación mínima que lo pasa: normalmente ya la genera
      `targets.SqsQueue` del paso anterior. **Si no la genera**, añadir
      `geofenceEventsQueue.addToResourcePolicy(...)` con el statement de
      [[design]] §Comportamientos que LocalStack no reproduce. El requisito es
      el hecho verificado, no el mecanismo.
- [ ] (3) Refactor con tests verdes. Dejar en el test un comentario que explique
      por qué esta aserción existe (bug latente de `provisioning.ts`, entrega
      silenciosamente fallida en AWS real): sin el comentario, alguien la
      borrará por "redundante".

## R12 — `removalPolicy` explícita y constructos prohibidos

- [ ] (1) Escribir test que falla para R12:
      `describe('R12: removalPolicy Retain en la tabla y Delete en el bucket')`
      — `template.hasResource('AWS::DynamoDB::Table', { DeletionPolicy: 'Retain', UpdateReplacePolicy: 'Retain' })`
      y `template.hasResource('AWS::S3::Bucket', { DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' })`.
      Nótese `hasResource`, no `hasResourceProperties`: las policies son
      atributos del recurso, no propiedades.
- [ ] (2) Implementación mínima que lo pasa: `removalPolicy: RemovalPolicy.RETAIN`
      en la tabla (redundante con el default, pero explícito) y
      `removalPolicy: RemovalPolicy.DESTROY` en el bucket, **sin**
      `autoDeleteObjects`.
- [ ] (3) Refactor con tests verdes.

## R13 — Inventario cerrado: 11 recursos, 6 tipos, nada más

- [ ] (1) Escribir test que falla para R13:
      `describe('R13: el template declara exactamente 11 recursos de 6 tipos')`
      — extraer `Object.values(template.toJSON().Resources).map(r => r.Type)`,
      reducirlo a un mapa `{tipo: conteo}` y compararlo con `toEqual` contra el
      mapa exacto de [[requirements]] R13. **Comparación del conjunto completo,
      no aserciones de ausencia una por una**: así cualquier recurso nuevo no
      previsto rompe el test.
- [ ] (2) Implementación mínima que lo pasa: `versionReporting: false` en
      `cdk.json` ([[design]] §D6) para que no aparezca `AWS::CDK::Metadata`.
- [ ] (3) Refactor con tests verdes.

## R14 — Región `us-east-1` fijada, cuenta agnóstica

- [ ] (1) Escribir test que falla para R14:
      `describe('R14: el stack se despliega en us-east-1 sin fijar la cuenta')`
      — `expect(DEV_REGION).toBe('us-east-1')` y
      `expect(Stack.of(stack).region).toBe('us-east-1')`, más
      `expect(Token.isUnresolved(Stack.of(stack).account)).toBe(true)`.
- [ ] (2) Implementación mínima que lo pasa: exportar `DEV_REGION` desde
      `infra/lib/pet-tracker-dev-stack.ts` y pasar `env: { region: DEV_REGION }`
      (sin `account`) en `infra/bin/app.ts`.
- [ ] (3) Refactor con tests verdes.

## R3 — `media.e2e-spec.ts:185` usa `BUCKET_MEDIA`

- [ ] (1) Escribir test que falla para R3: no hace falta test nuevo — el test
      rojo es la propia línea 185 tras sustituir el literal, corriendo contra
      LocalStack con Docker arriba. Si Docker está caído la suite se salta y
      **R3 no queda verificado**: levantarlo antes.
- [ ] (2) Implementación mínima que lo pasa: cambiar
      `expect.stringContaining('pet-tracker-media-local')` por
      `expect.stringContaining(BUCKET_MEDIA)`. Ninguna otra línea.
- [ ] (3) Refactor con tests verdes: `grep -n "pet-tracker-media-local" backend-pet-tracker/test/media.e2e-spec.ts`
      no devuelve nada.

## R15 — `docs/architecture.md`

- [ ] (1) Escribir test que falla para R15: en `cdk-dev-stack-docs.spec.ts`,
      `describe('R15: architecture.md documenta el bucket dev y una cuenta por entorno')`
      — afirma que `docs/architecture.md` contiene `pet-tracker-media-dev-`,
      que ya **no** contiene la cadena "Pendiente de verificar en un despliegue
      AWS real" en la fila de S3, y que contiene la frase que registra "una
      cuenta AWS por entorno".
- [ ] (2) Implementación mínima que lo pasa: editar la fila de la línea 103 y
      añadir la línea nueva bajo la tabla de equivalencias.
- [ ] (3) Refactor con tests verdes.

## R16 — `docs/verification.md`

- [ ] (1) Escribir test que falla para R16: en `cdk-dev-stack-docs.spec.ts`,
      `describe('R16: verification.md documenta el procedimiento manual de #20')`
      — afirma que existe la cabecera `### Feature 20 — aws-cdk-dev-stack` y que
      la sección menciona `cdk bootstrap`, `cdk deploy`, `AWS_MODE=aws` y
      `aws-real-ingest.e2e-spec.ts`.
- [ ] (2) Implementación mínima que lo pasa: escribir la sección con los cinco
      pasos del humano (R17-R21), incluyendo el aviso de comentar
      `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` en el `.env` raíz y las dos
      consecuencias operativas de la `removalPolicy` ([[design]] §D2).
- [ ] (3) Refactor con tests verdes.

## R21 (mitad A) — Suite e2e contra AWS real, auto-saltada

- [ ] (1) Escribir test que falla para R21:
      `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts`,
      `describe('R21: ingest contra AWS real')`, calcado del patrón de
      `test/aws-real-smoke.e2e-spec.ts` (gate `describe.skip` por `AWS_MODE`,
      `assertNoStaticAccessKey`). Con `AWS_MODE` sin poner **debe aparecer como
      `skipped`**, y eso es el estado esperado en el gate.
- [ ] (2) Implementación mínima que lo pasa: los tres tramos de
      [[requirements]] R21 (SQS round-trip, DynamoDB put/query/delete con
      `expires_at` **en el futuro**, PutEvents → `geofence-events`), sin
      Postgres ni `AppModule`, con limpieza en `afterAll`.
- [ ] (3) Refactor con tests verdes: confirmar con `./init.sh` que la suite sale
      `skipped` y no rompe nada. **Parar aquí.** El implementer no ejecuta la
      mitad B.

---

## Tareas del humano (bloque D — el implementer no las ejecuta)

> `cdk bootstrap` y `cdk deploy` **crean recursos reales y cuestan dinero**.
> Ningún agente los ejecuta. El procedimiento exacto queda escrito en
> `docs/verification.md` por R16; los resultados se registran en
> `progress/impl_aws-cdk-dev-stack.md`.

- [ ] **R17** — Antes del primer deploy: verificar en la consola de AWS Billing
      que la cuenta (plan nuevo, creada después del 2025-07-15) sigue cubriendo
      DynamoDB provisionado Standard hasta 25 RCU / 25 WCU / 25 GB, y anotar qué
      ocurre al agotar los créditos o cumplirse la ventana de 6 meses.
- [ ] **R18** — `cdk bootstrap aws://<accountId>/us-east-1 --termination-protection`
      con un principal que tenga `iam:*` (PowerUserAccess no lo incluye).
- [ ] **R19** — `pnpm -C infra exec cdk deploy PetTrackerDev` → `CREATE_COMPLETE`
      con los 11 recursos en `us-east-1`.
- [ ] **R20** — Repetir el mismo `cdk deploy` sin cambios → reporta no-op.
- [ ] **R21 (mitad B)** — Correr la suite de R21 con `AWS_MODE=aws`, las
      credenciales estáticas comentadas en el `.env` raíz y una sesión de
      `aws login`. Debe pasar entera, **sin `skipped`**. Registrar el output
      redactado (sin ARNs de cuenta) en `progress/impl_aws-cdk-dev-stack.md`.

---

## Nit opcional (sin R-id, no bloquea)

- [ ] Corregir los docstrings obsoletos tras #12: `provisioning.ts:325` dice
      "5 colas SQS" (son **6**) y `run-provisioning.ts:23` dice "los 8 recursos"
      (son **10**). Solo si el implementer ya está en esos archivos por otra
      razón — abrirlos únicamente para esto no compensa el riesgo de tocar el
      camino que hoy funciona.
