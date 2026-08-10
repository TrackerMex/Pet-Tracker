---
feature: "aws-cdk-dev-stack"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[aws-cdk-dev-stack]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
>
> **Capa: infrastructure, y fuera del backend.** `infra/` es un paquete
> hermano de `backend-pet-tracker/`: declara infraestructura, no contiene
> lógica de negocio y ninguna capa `domain`/`application` sabe que existe. La
> única dirección de dependencia es `infra/` → `backend-pet-tracker/src/aws/constants.ts`
> (constantes puras, sin imports), nunca al revés.

---

## Decisiones técnicas

### D1 — El account-id va como token sin resolver `Aws.ACCOUNT_ID`

El bucket se compone así, en `infra/lib/pet-tracker-dev-stack.ts`:

```ts
import { Aws } from 'aws-cdk-lib';
import { BUCKET_MEDIA_BASE, resourceName } from '@backend/aws/constants';

// D1 — S3 es el único servicio del alcance con namespace global: el bucket
// sí lleva entorno + account-id. Aws.ACCOUNT_ID es un token que CloudFormation
// sustituye en deploy, así que `cdk synth` no necesita credenciales.
const BUCKET_SUFFIX = `${ENV_NAME}-${Aws.ACCOUNT_ID}`;
const bucketName = resourceName(BUCKET_MEDIA_BASE, BUCKET_SUFFIX);
```

**Por qué el token y no `Stack.of(this).account`:** `Stack.of(this).account`
obliga a que `cdk synth` conozca el account-id (típicamente vía
`CDK_DEFAULT_ACCOUNT`), lo que exigiría credenciales AWS en CI. Con el token
sin resolver, `synth` corre offline y puede entrar en el gate de `init.sh`
(R1, R6). Sirve a R1, R9, R14.

**Consecuencia para el test de R9:** el `BucketName` **no** es una cadena en el
template. Renderiza como:

```json
{ "Fn::Join": ["", ["pet-tracker-media-dev-", { "Ref": "AWS::AccountId" }]] }
```

La aserción tiene que comparar contra esa forma, no contra un string. Es el
error que más tiempo cuesta si se descubre por las malas.

### D2 — `removalPolicy`: tabla `RETAIN`, bucket `DESTROY` sin `autoDeleteObjects`

Decisión del humano, cerrada. Sirve a R12.

- **Tabla `RETAIN`** (que además es el default de `dynamodb.Table`): los datos
  de telemetría sobreviven a un `cdk destroy` accidental.
- **Bucket `DESTROY`**, porque un bucket con nombre fijo que sobrevive al
  destroy deja el nombre tomado y el redeploy falla con `BucketAlreadyExists`.
- **Prohibido `autoDeleteObjects: true`.** Crea una Lambda de custom resource
  + su rol IAM + su log group: tres recursos que violan el criterio de
  aceptación 7 y romperían el inventario cerrado de R13.

Dos consecuencias operativas que van también en `docs/verification.md` (R16),
porque sorprenden si no están escritas:

1. Si el bucket tiene objetos, `cdk destroy` **falla**. Hay que vaciarlo a mano
   (`aws s3 rm s3://<bucket> --recursive`) antes de destruir.
2. La tabla retenida **sigue provisionada a 25/25 y sigue consumiendo el cupo
   gratis de la cuenta** aunque el stack se haya destruido. Limpiarla es un
   paso manual aparte.

### D3 — Nombres desnudos en dev; el helper acepta sufijo pero resuelve a vacío

Decisión del humano, cerrada: **una cuenta AWS por entorno**. Si algún día hay
`prod`, va en otra cuenta, y como los namespaces de SQS/DynamoDB/EventBridge
son por cuenta+región, no hay colisión posible.

En `backend-pet-tracker/src/aws/constants.ts` (R2):

```ts
// Base compartida del nombre del bucket: el runtime local usa el sufijo
// 'local'; el stack CDK de #20 usa 'dev-<accountId>'. Un solo sitio con el
// prefijo, cero literales duplicados.
export const BUCKET_MEDIA_BASE = 'pet-tracker-media';

/** Compone `<base>-<suffix>`; con suffix vacío devuelve `base` sin tocar. */
export const resourceName = (base: string, suffix: string): string =>
  suffix === '' ? base : `${base}-${suffix}`;

export const BUCKET_MEDIA = resourceName(BUCKET_MEDIA_BASE, 'local');
```

`BUCKET_MEDIA` conserva su valor exacto `'pet-tracker-media-local'`, así que
los cuatro consumidores actuales y todos los e2e de LocalStack siguen verdes
sin tocarse. **El comentario de `constants.ts:34-35`** ("sufijo `-local`
explícito: nunca se reutiliza este nombre contra un bucket de AWS real") sigue
siendo verdad y se conserva, reescrito para explicar la nueva base.

En `infra/lib/pet-tracker-dev-stack.ts`, dos constantes de módulo — **no** props
del stack, porque un parámetro con un único call site es la abstracción
especulativa que este repo no quiere:

```ts
export const DEV_REGION = 'us-east-1';        // R14
const ENV_NAME = 'dev';
// D3 — nombres desnudos en dev: una cuenta AWS por entorno. El mecanismo de
// sufijo existe; el día que haya un segundo entorno en la misma cuenta, esto
// pasa a 'dev' y se renombra todo de golpe.
const ENV_SUFFIX = '';
```

y todos los nombres de SQS/DynamoDB/EventBridge se componen con
`resourceName(CONSTANTE, ENV_SUFFIX)`, que en dev devuelve la constante sin
tocar. Sirve a R7, R8, R10.

### D4 — `infra/` como paquete independiente, no-workspace, con `noEmit`

Sirve a R1. Resumen del razonamiento completo de D2 en
`progress/explore_aws-cdk-dev-stack.md`:

- **No project references** (`composite: true`): obligarían a fijar `rootDir`
  explícito en `backend-pet-tracker/tsconfig.json`, que hoy lo infiere. Cambiar
  eso puede alterar la estructura de `dist/` y romper `start:prod`
  (`node dist/main`) y `tsc-alias -p tsconfig.build.json`. Además forzaría
  `tsc --build` en vez de `tsc --noEmit` en `TYPECHECK_CMD`. **Se modificaría
  el paquete que hoy está verde para acomodar uno que aún no existe: mal
  reparto de riesgo.**
- **No pnpm workspace**: movería `pnpm-lock.yaml` a la raíz (regenerándolo
  entero), obligaría a cambiar `cache-dependency-path` en `ci.yml`, exigiría
  que `backend-pet-tracker` declarase `exports`/`main` hacia `dist/`, y crearía
  una dependencia de orden (`infra/` no typechequea hasta que el backend haya
  hecho `build`). Es reestructurar el repo entero para compartir diecisiete
  constantes string.
- **`noEmit: true` disuelve el problema del `rootDir`.** La razón por la que un
  import cruzando el límite del paquete es frágil es que TypeScript tiene que
  decidir dónde escribir el JS. Si no escribe JS, no hay decisión que salga
  mal. Y CDK no necesita JS emitido: `cdk.json` invoca `ts-node`.
- Es **reversible**: migrar de este layout a un workspace es mecánico; al revés
  no.

**Riesgo aceptado, explícito:** `infra/` importa por ruta física relativa, así
que **mover `backend-pet-tracker/` de sitio rompe `infra/`**. El arreglo es una
línea en `infra/tsconfig.json`, pero nada lo detecta salvo el typecheck — que
es exactamente por lo que R6 no es opcional.

### D5 — El alias `@backend/*` se resuelve en tres runners, y hay que cablearlo en los tres

`progress/review_fix-jest-e2e-alias.md` documenta el bug de 2026-08-01: el
alias `@/` estaba resuelto en tres sitios con `rootDir` distintos y uno apuntaba
a un directorio inexistente. El síntoma fue `createNoMappedModuleFoundError`
**en tiempo de test, no en typecheck**. `infra/` añade un cuarto sitio. Los tres
puntos de cableado, que deben escribirse a la vez:

| Runner | Archivo | Cableado |
|---|---|---|
| `tsc --noEmit` (typecheck) | `infra/tsconfig.json` | `"baseUrl": "."`, `"paths": { "@backend/*": ["../backend-pet-tracker/src/*"] }` |
| `cdk synth` (ts-node) | `infra/cdk.json` | `"app": "npx ts-node -r tsconfig-paths/register --prefer-ts-exts bin/app.ts"` |
| `jest` (ts-jest) | `infra/jest.config.js` | `moduleNameMapper: { '^@backend/(.*)$': '<rootDir>/../backend-pet-tracker/src/$1' }` |

El `-r tsconfig-paths/register` no es opcional: es la misma convención que ya
usa el repo para scripts fuera de Nest (`docs/conventions.md` §37-62,
`package.json` scripts `provision:local` / `seed:*`). `tsconfig-paths` va en las
devDependencies de `infra/`.

### D6 — Configuración de `cdk.json` que mantiene el template limpio

```jsonc
{
  "app": "npx ts-node -r tsconfig-paths/register --prefer-ts-exts bin/app.ts",
  "versionReporting": false,
  "pathMetadata": false,
  "notices": false,
  "context": {}
}
```

- **`versionReporting: false` es funcional, no cosmético**: con el default,
  CDK añade al template un recurso `AWS::CDK::Metadata` que rompería el
  inventario cerrado de R13. Desactivarlo lo elimina junto con su condición
  `CDKMetadataAvailable`.
- `pathMetadata: false` quita el `aws:cdk:path` de cada recurso — template más
  legible en las aserciones.
- `notices: false` evita que `cdk synth` intente una llamada de red al endpoint
  de avisos de CDK. En un gate que corre offline eso es ruido o flakiness.

Nota para el implementer: CDK v2 añade siempre un **parámetro**
`BootstrapVersion` (tipo `AWS::SSM::Parameter::Value<String>`) y una **rule**
`CheckBootstrapVersion`. Viven en `Parameters` y `Rules`, **no** en `Resources`,
así que no afectan a R13. No hay que quitarlos.

### D7 — Constructos obligados y prohibidos

| Regla | Motivo | Requisito |
|---|---|---|
| `dynamodb.Table`, **nunca** `dynamodb.TableV2` | `TableV2` emite `AWS::DynamoDB::GlobalTable`, su default de billing es on-demand (fuera del free tier) y en Global Tables los borrados por TTL **sí** consumen capacidad replicada. `Table` sale de fábrica en `PROVISIONED` + `STANDARD` + `RETAIN`, justo lo que se necesita (solo hay que subir 5/5 → 25/25) | R8, R12, R13 |
| No `autoDeleteObjects` | Lambda de custom resource + rol + log group | R12, R13 |
| No `encryptionKey` / `encryptionMasterKey` | Una CMK de KMS cuesta ~$1/mes **por existir**: coste fijo literal | R12, R13 |
| No `pointInTimeRecovery` | Los backups de DynamoDB no están cubiertos por el free tier; activarlo es un one-liner tentador | R8 |
| No pasar `encryption` a las colas | `provisioning.ts` tampoco lo pasa; omitirlo en ambos lados garantiza el mismo comportamiento por defecto de SQS y evita una divergencia de template | R7 |

### D8 — El gate: dónde entra cada comando

`init.sh` usa `eval` bajo `set -e`, así que encadenar con `&&` propaga el fallo
sin tocar el harness (R6). Reparto:

| Variable | Qué añade | Por qué ahí |
|---|---|---|
| `INSTALL_CMD` | `&& pnpm -C infra install` | Sin esto no hay `node_modules` en `infra/` y todo lo demás falla |
| `BUILD_CMD` | `&& pnpm -C infra run synth` | `cdk synth` es el "build" del stack: es lo que demuestra que el TypeScript compila **y** que CloudFormation es válido |
| `TEST_CMD` | `&& pnpm -C infra test --passWithNoTests` | Los tests de synth del bloque B |
| `LINT_CMD` | `&& pnpm -C infra run lint` | — |
| `TYPECHECK_CMD` | `&& pnpm -C infra exec tsc --noEmit` | Es lo único que detecta que `backend-pet-tracker/` se movió (riesgo de D4) |

`E2E_CMD` **no** se toca: `infra/` no tiene e2e, y el e2e de R21 corre por
`AWS_MODE`, no por los puertos de `E2E_REQUIRED_PORTS`.

**`infra/pnpm-lock.yaml` se commitea.** pnpm activa `--frozen-lockfile` por
defecto cuando `CI=true`, así que un lockfile ausente o desincronizado rompe CI.
`.github/workflows/ci.yml` no se toca: su `cache-dependency-path` seguirá
apuntando solo al lockfile del backend, con lo que las dependencias de `infra/`
no se cachean. Es más lento, no es incorrecto.

---

## Mapeo recurso por recurso contra `provisioning.ts`

> Criterio de aceptación 1. Orden y números de línea según
> `backend-pet-tracker/src/aws/provisioning.ts` (384 líneas) y
> `provisionAllResources()` (L331-339).
>
> La columna **Diverge** registra diferencias en la *configuración
> aprovisionada* del recurso. Hay exactamente **una** fila que diverge, y es
> intencional. Las diferencias de template sin efecto observable están listadas
> aparte, más abajo.

| # | Recurso | Tipo CloudFormation | Constructo CDK (id lógico) | Nombre en el stack | Atributos que fija `provisioning.ts` | Diverge |
|---|---|---|---|---|---|---|
| 1 | `positions-raw-dlq` | `AWS::SQS::Queue` | `sqs.Queue` (`PositionsRawDlq`) | `resourceName(QUEUE_POSITIONS_RAW_DLQ, ENV_SUFFIX)` | Ninguno (L109) | No |
| 2 | `positions-raw` | `AWS::SQS::Queue` | `sqs.Queue` (`PositionsRaw`) | `resourceName(QUEUE_POSITIONS_RAW, ENV_SUFFIX)` | `RedrivePolicy → #1`, `maxReceiveCount: 3` (L112-117) | No |
| 3 | `notifications-dlq` | `AWS::SQS::Queue` | `sqs.Queue` (`NotificationsDlq`) | `resourceName(QUEUE_NOTIFICATIONS_DLQ, ENV_SUFFIX)` | Ninguno (L136-140) | No |
| 4 | `notifications` | `AWS::SQS::Queue` | `sqs.Queue` (`Notifications`) | `resourceName(QUEUE_NOTIFICATIONS, ENV_SUFFIX)` | `RedrivePolicy → #3`, `maxReceiveCount: 3` (L136-140) | No |
| 5 | `positions` | `AWS::DynamoDB::Table` | `dynamodb.Table` (`PositionsTable`) | `resourceName(TABLE_POSITIONS, ENV_SUFFIX)` | `BillingMode: 'PAY_PER_REQUEST'`; `pk` S HASH, `sk` N RANGE (L182-195) | **Sí — intencional.** El stack usa `PROVISIONED` 25 RCU / 25 WCU + clase `STANDARD`. Es la única combinación cubierta por el free tier de DynamoDB (on-demand queda fuera). Se acepta throttling si el ingest supera esa capacidad. Los criterios de aceptación 1 y 2 se contradicen literalmente y **esta fila es la resolución**: no es un incumplimiento, es la decisión de costo de la feature |
| 5b | TTL de `positions` | (propiedad de #5) | prop `timeToLiveAttribute` | `TABLE_POSITIONS_TTL_ATTRIBUTE` | `UpdateTimeToLive` en llamada **separada** tras esperar `ACTIVE` (L204-213) | No — mismo resultado; CloudFormation lo declara inline en `TimeToLiveSpecification` en vez de en dos pasos |
| 6 | `pet-tracker-media-local` | `AWS::S3::Bucket` | `s3.Bucket` (`MediaBucket`) | `resourceName(BUCKET_MEDIA_BASE, 'dev-' + Aws.ACCOUNT_ID)` → `pet-tracker-media-dev-<accountId>` | `CreateBucket` sin props (L237) | No — el **nombre** cambia por decisión D1 (S3 tiene namespace global y el sufijo `-local` sería engañoso en AWS real), no la configuración del recurso |
| 6b | PublicAccessBlock | (propiedad de #6) | prop `blockPublicAccess: BLOCK_ALL` | — | los 4 flags `true` en llamada separada (L244-254) | No |
| 7 | `pet-tracker` | `AWS::Events::EventBus` | `events.EventBus` (`EventBus`) | `resourceName(EVENT_BUS_NAME, ENV_SUFFIX)` | `CreateEventBus` solo con `Name` (L265) | No |
| 8 | `geofence-events-dlq` | `AWS::SQS::Queue` | `sqs.Queue` (`GeofenceEventsDlq`) | `resourceName(QUEUE_GEOFENCE_EVENTS_DLQ, ENV_SUFFIX)` | Ninguno (L289-293) | No |
| 9 | `geofence-events` | `AWS::SQS::Queue` | `sqs.Queue` (`GeofenceEvents`) | `resourceName(QUEUE_GEOFENCE_EVENTS, ENV_SUFFIX)` | `RedrivePolicy → #8`, `maxReceiveCount: 3` (L289-293) | No |
| 10 | `geofence-events` (regla) | `AWS::Events::Rule` | `events.Rule` (`GeofenceEventsRule`) | `resourceName(RULE_GEOFENCE_EVENTS, ENV_SUFFIX)` | `EventBusName: 'pet-tracker'`; `EventPattern: {source:['pet-tracker'], detail-type:['position.updated','battery.low']}` (L296-305) | No |
| 10b | Target de la regla | (propiedad de #10) | `targets.SqsQueue(#9)` | — | `Targets: [{Id: 'geofence-events', Arn: <arn #9>}]`, **sin `InputTransformer`** (deliberado, #12 D2) (L307-313) | No — mismo ARN de destino, misma ausencia de `InputTransformer`. Ver nota sobre el `Id` abajo |
| 11 | — | `AWS::SQS::QueuePolicy` | generado por `targets.SqsQueue` sobre #9 | — | **`provisioning.ts` no lo crea** | **Recurso nuevo, no divergencia**: es la corrección de un bug latente. Sin esta policy, en AWS real la regla casa el evento y la entrega falla en silencio (R11). En LocalStack Community no se nota porque el enforcement de IAM es funcionalidad Pro |

**Totales: 11 recursos, 6 tipos** — el inventario cerrado de R13.

### Diferencias de template sin efecto observable

Listadas aquí para que el reviewer no las lea como divergencias no declaradas:

- **`Id` del target de la regla.** `provisioning.ts` usa `Id: 'geofence-events'`;
  CDK genera `Target0`. El `Id` es un identificador interno de la regla, no
  cambia el destino ni la entrega y no es observable por ningún consumidor.
  CDK no expone API pública para fijarlo, y usar el escape hatch `CfnRule`
  perdería la generación automática de la `QueuePolicy` de R11: no compensa.
- **`VisibilityTimeout: 30` renderizado explícitamente** en las seis colas.
  `provisioning.ts` no lo pasa y SQS aplica 30 s por defecto: mismo valor
  efectivo, distinto template.
- **Parámetro `BootstrapVersion` y rule `CheckBootstrapVersion`** que CDK v2
  añade siempre. Viven en `Parameters`/`Rules`, no en `Resources`.

### Comportamientos que LocalStack no reproduce y AWS real sí

- **Resource-policy de SQS (R11).** Ya explicado. El statement que hace falta,
  para referencia si hubiera que escribirlo a mano:
  `Effect: Allow`, `Principal: {Service: events.amazonaws.com}`,
  `Action: sqs:SendMessage`, `Resource: <arn de geofence-events>`,
  `Condition: {ArnEquals: {aws:SourceArn: <arn de la regla>}}`.
- **`PublicAccessBlock` sí se aplica en AWS real.** Además, desde abril de 2023
  AWS aplica `BlockPublicAccess` y `ObjectOwnership: BucketOwnerEnforced` por
  defecto en buckets nuevos, así que el bucket real es aún más restrictivo que
  lo que pide el criterio 4. R15 actualiza la nota de `docs/architecture.md:103`.
- **TTL de DynamoDB: "within a few days", no inmediato.** LocalStack tiende a
  aplicarlo al instante. Cualquier test que escriba un item con `expires_at` en
  el pasado y afirme que desapareció **pasa en local y falla contra AWS real**.
  Hoy no existe ningún test así y R21 prohíbe explícitamente introducirlo.
  Nota positiva: los borrados por TTL no consumen WCU, así que no comen del
  presupuesto de 25.
- **Nombre de bucket globalmente único.** LocalStack no tiene namespace global;
  AWS sí. Con un nombre tomado, `cdk deploy` falla con `BucketAlreadyExists` y
  entra en rollback. El account-id en el sufijo (D1) elimina esa clase de fallo.

---

## Riesgos operativos

- **Free tier con fecha (D4 del humano, R17).** La cuenta se creó después del
  **2025-07-15**, así que está en el plan nuevo: créditos ~$200 y ventana de
  6 meses, no el esquema clásico de "always free" + 12 meses. Las cifras
  **25 RCU / 25 WCU / 25 GB están confirmadas** contra la documentación de
  DynamoDB, con cuatro matices: son **por cuenta pagadora y por región, no por
  tabla**; solo **clase Standard**; solo **capacidad provisionada** (on-demand
  no califica, que es justo por lo que la feature descarta `PAY_PER_REQUEST`);
  y los **backups se pagan aparte** (PITR y backups on-demand no están
  cubiertos). Lo que **no** está confirmado es cómo interactúa todo eso con el
  plan nuevo: por eso R17 es una tarea explícita del humano en la consola de
  Billing **antes** del primer `cdk deploy`, incluyendo qué ocurre al agotar
  créditos o cumplir la ventana (la cuenta puede cerrarse automáticamente si no
  se pasa a plan de pago).
- **La tabla DynamoDB es el único recurso del stack que se cobra por tiempo,
  no por uso.** La capacidad provisionada se factura por hora *provisionada*.
  25+25 es exactamente el cupo gratis: subir a 26 WCU "un momento para probar"
  empieza a costar dinero de inmediato y de forma continua hasta que se baje.
- **EventBridge es la única línea que factura desde el primer evento.** Los
  eventos custom cuestan ~$1.00 por millón de eventos ingeridos y **no tienen
  free tier** (los eventos de servicios AWS sí son gratis; los custom no). La
  entrega a targets en la misma cuenta es gratis. Para un dev con simulador es
  cuestión de céntimos.
- **Consumo de requests SQS con los workers corriendo.** Los consumidores usan
  short polling (`WAIT_TIME_SECONDS = 1`) y `setInterval`: positions cada 15 s,
  alerts-engine cada 60 s, notifier cada 60 s. Con el backend en marcha 24/7 y
  el sistema **en reposo**, el suelo es ≈ 259 000 `ReceiveMessage`/mes, ~26 %
  del millón gratuito. Margen cómodo, pero es una razón para **no dejar el
  backend con `AWS_MODE=aws` corriendo de fondo sin querer**.
- **Ninguno de los otros recursos tiene coste fijo por hora**: colas SQS (solo
  por request), bucket vacío (sin cargo), bus y regla de EventBridge (sin cuota
  fija). No hay VPC en el alcance, así que no puede colarse un NAT Gateway.
- **El `cdk bootstrap` crea recursos aparte del stack** (R18) que aparecerán en
  la consola: bucket de staging, repositorio ECR, cinco roles IAM y un
  parámetro SSM. Ninguno con coste fijo por hora, y este stack no publica
  assets. El bootstrap actual ya **no** crea una CMK de KMS por defecto.

---

## Estructura de `infra/`

```
infra/
├── package.json           # paquete independiente; scripts build/synth/test/lint
├── pnpm-lock.yaml         # se commitea (CI usa --frozen-lockfile)
├── tsconfig.json          # noEmit: true + paths @backend/* → ../backend-pet-tracker/src/*
├── cdk.json               # app por ts-node -r tsconfig-paths/register; versionReporting off
├── jest.config.js         # ts-jest + moduleNameMapper para @backend/*
├── eslint.config.mjs      # flat config propio (el del backend fija tsconfigRootDir al backend)
├── bin/
│   └── app.ts             # new App(); new PetTrackerDevStack(app, 'PetTrackerDev', { env: { region: DEV_REGION } })
├── lib/
│   └── pet-tracker-dev-stack.ts   # export const DEV_REGION; export class PetTrackerDevStack
├── test/
│   ├── pet-tracker-dev-stack.test.ts    # R1, R7-R14 (Template.fromStack)
│   └── no-duplicated-literals.test.ts   # R4
└── cdk.out/               # generado, ignorado por .gitignore (R5)
```

**`infra/package.json` — scripts exactos:**

```json
{
  "scripts": {
    "synth": "cdk synth --quiet",
    "test": "jest",
    "lint": "eslint \"{bin,lib,test}/**/*.ts\""
  }
}
```

`lint` va **sin `--fix`**: el gate no debe mutar archivos.

**Dependencias de `infra/`** (todas `devDependencies`; se instalan con
`pnpm -C infra add -D <paquete>`, que fija la versión resuelta en el lockfile —
esta spec no clava versiones exactas, solo majors):

`aws-cdk-lib` (major **2**), `constructs` (`^10`), `aws-cdk` (CLI, major **2**),
`typescript`, `ts-node`, `tsconfig-paths`, `jest`, `ts-jest`, `@types/jest`,
`@types/node`, `eslint`, `@eslint/js`, `typescript-eslint`, `globals`.

---

## Archivos afectados

**Nuevos** (capa infrastructure, paquete `infra/`):

- `infra/package.json`, `infra/pnpm-lock.yaml`, `infra/tsconfig.json`,
  `infra/cdk.json`, `infra/jest.config.js`, `infra/eslint.config.mjs` — R1, D4-D6.
- `infra/bin/app.ts` — punto de entrada del app CDK. R1, R14.
- `infra/lib/pet-tracker-dev-stack.ts` — la declaración del stack. R7-R14.
- `infra/test/pet-tracker-dev-stack.test.ts` — tests de synth. R1, R7-R14.
- `infra/test/no-duplicated-literals.test.ts` — guarda estática. R4.
- `backend-pet-tracker/src/aws/constants.spec.ts` — unit test del helper. R2.
- `backend-pet-tracker/src/aws/cdk-dev-stack-docs.spec.ts` — guarda estática
  sobre `.gitignore`, `init.config.sh`, `docs/architecture.md` y
  `docs/verification.md`. R5, R6, R15, R16. Mismo patrón que
  `src/aws/aws-mode-docs.spec.ts` (#19 R10/R12).
- `backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts` — e2e contra AWS real,
  auto-saltado. R21.

**Modificados:**

- `backend-pet-tracker/src/aws/constants.ts` — añade `BUCKET_MEDIA_BASE` y
  `resourceName`; `BUCKET_MEDIA` pasa a derivarse sin cambiar de valor. R2.
- `backend-pet-tracker/test/media.e2e-spec.ts` — **solo la línea 185**. R3.
- `.gitignore` — añade `cdk.out/`. R5.
- `init.config.sh` — encadena `infra` en las cinco variables. R6.
- `docs/architecture.md` — fila 103 + línea de una-cuenta-por-entorno. R15.
- `docs/verification.md` — sección `### Feature 20 — aws-cdk-dev-stack`. R16.

**Explícitamente intactos** (verificar con `git diff --name-only` al cerrar):
`init.sh`, `.github/workflows/ci.yml`,
`backend-pet-tracker/tsconfig.json`, `backend-pet-tracker/package.json`,
`backend-pet-tracker/pnpm-lock.yaml`,
`backend-pet-tracker/src/aws/provisioning.ts`,
`backend-pet-tracker/src/aws/run-provisioning.ts`,
`backend-pet-tracker/src/modules/media/infrastructure/photo-storage.s3.adapter.ts`,
`backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts`.

---

## Alternativas descartadas

- **Reusar `BUCKET_MEDIA` tal cual en el stack.** Es el diff más corto y cumple
  el criterio 6 trivialmente, pero rompe la promesa explícita de
  `constants.ts:34-35` y deja un bucket de AWS real llamado `…-local` a
  perpetuidad (S3 no permite renombrar). Descartada por el nombre engañoso.
- **Nombre de bucket autogenerado por CloudFormation + `CfnOutput`.** Es la
  opción "más AWS-correcta" (permite reemplazos sin conflictos de nombre), pero
  el nombre deja de ser conocido en compilación y el backend tendría que
  descubrirlo en runtime (output del stack, SSM parameter o env var manual):
  un mecanismo de configuración entero que hoy no existe. Además el criterio 6
  pide explícitamente que los nombres se importen de `constants.ts`, y un
  nombre autogenerado no puede importarse de ahí.
- **Sufijo por variable de entorno (`ENV_SUFFIX=dev` en `.env`).** Añade una
  variable más y un modo de fallo nuevo (sufijo vacío por descuido → colisión)
  sin comprar nada en una fase donde solo existe `dev`. YAGNI.
- **Sufijo `-dev` en todas las colas, la tabla y el bus desde ya.** Rompe el
  criterio de aceptación 9: el backend encuentra los recursos por el nombre que
  tiene en `constants.ts`, y con sufijo habría que cablear resolución de nombres
  por entorno en el runtime, que es una feature entera fuera del alcance de #20.
  Además desincronizaría cinco specs cerradas (#8, #9, #12, #13, #16) y
  `docs/data-model.md`. Descartada por el humano (D3).
- **`dynamodb.TableV2`.** Ver D7.
- **Project references de TypeScript / pnpm workspace / paquete `shared/`.**
  Ver D4.
- **Import relativo crudo (`../backend-pet-tracker/src/aws/constants`) sin
  alias.** Funcionalmente equivalente a la opción elegida, pero esparce cadenas
  `../../` por los archivos en vez de centralizar la ruta física en un único
  `tsconfig.json`. Con el alias, mover el backend se arregla en una línea.
