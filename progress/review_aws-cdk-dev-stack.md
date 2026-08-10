# review: aws-cdk-dev-stack (#20)

Fecha: 2026-08-10
Branch: `feature/20-aws-cdk-dev-stack` (HEAD `9dfc6aa`)
Implementó: Codex CLI (no un subagente de este repo)

**Veredicto: APROBADO** — para el alcance del implementador (R1-R16 + R21 mitad A).
R17-R20 y R21 mitad B quedan pendientes de cierre humano; no son motivo de rechazo.

---

## Cómo se verificó

No se aceptó el reporte del implementador como evidencia. El reviewer:

- Levantó la infra (`docker compose up -d`) y confirmó que **Postgres 5432 y
  LocalStack 4566 responden** antes de correr el gate, para que los e2e no se
  saltaran. LocalStack ya estaba provisionado (6 colas, tabla `positions`,
  bucket `pet-tracker-media-local`, bus `pet-tracker`) — verificado con
  `aws --endpoint-url=http://localhost:4566`.
- Ejecutó `./init.sh` él mismo (output completo abajo).
- Inspeccionó el **template sintetizado real** (`infra/cdk.out/PetTrackerDev.template.json`),
  no solo las aserciones de los tests.
- Reprodujo dos tests rojos en un **git worktree aislado** sobre sus commits
  originales, para comprobar que el historial test-primero es real.
- Probó la propagación de fallo del gate de R6 con el paquete `infra` real.
- No se ejecutó `cdk bootstrap` ni `cdk deploy`. Solo `cdk synth`.
- No se editó código de aplicación ni de `infra/`. `git status` al terminar solo
  muestra los untracked preexistentes (`.agents/`, `.codex/`, `skills-lock.json`).

---

## Conteos reales de tests (medidos por el reviewer)

| Bloque | Suites | Tests |
|---|---|---|
| Backend unit (`pnpm -C backend-pet-tracker test`) | 121 passed / 121 | 879 passed / 879 |
| Infra (`pnpm -C infra test`) | 2 passed / 2 | 14 passed / 14 |
| E2E (`pnpm -C backend-pet-tracker run test:e2e`) | 13 passed, 2 skipped / 15 | 181 passed, 5 skipped / 186 |

Las 2 suites e2e saltadas son las AWS-only: `aws-real-smoke.e2e-spec.ts` (#19 R11,
2 tests) y `aws-real-ingest.e2e-spec.ts` (#20 R21, 3 tests). Verificado por
separado: la suite de R21 sola da `1 skipped / 3 tests skipped`.

`init.sh` → **exit code 0**.

---

## Detalle por requisito (R1-R16 + R21 mitad A)

### R1 — paquete `infra/` offline, y ningún archivo prohibido tocado ✅

`git diff --name-only main...HEAD` (28 archivos). **Ninguno de los siete
prohibidos aparece**:

| Archivo prohibido | ¿En el diff? |
|---|---|
| `backend-pet-tracker/tsconfig.json` | no |
| `backend-pet-tracker/package.json` | no |
| `backend-pet-tracker/pnpm-lock.yaml` | no |
| `.github/workflows/ci.yml` | no |
| `init.sh` | no |
| `backend-pet-tracker/src/aws/provisioning.ts` | no |
| `backend-pet-tracker/src/aws/run-provisioning.ts` | no |

Existen los nueve archivos versionados que exige R1. `infra/tsconfig.json`
declara `"noEmit": true` y `"paths": { "@backend/*": ["../backend-pet-tracker/src/*"] }`.
El synth corrió dentro de `init.sh` sin credenciales y escribió
`infra/cdk.out/PetTrackerDev.template.json`.

### R2 — runtime local intacto ✅ (verificado por valor efectivo, no por lectura)

Evaluado en runtime importando `@backend/aws/constants` a través del
`tsconfig-paths` de `infra/`:

```
BUCKET_MEDIA           = "pet-tracker-media-local"   ← exacto
BUCKET_MEDIA_BASE      = "pet-tracker-media"
resourceName(base,"")  = "base"      ← devuelve base sin tocar
resourceName(base,"x") = "base-x"
```

`provisioning.ts` y `photo-storage.s3.adapter.ts` no aparecen en el diff.
`test/localstack-provisioning.e2e-spec.ts` **no tiene ni una línea de cambio**.
Los e2e de LocalStack pasan (181 tests) con la infra arriba.

### R3 — literal fuera de `media.e2e-spec.ts` ✅

Diff neto contra `main` en ese archivo: **un solo hunk**, la línea 185.

```diff
-      expect(body.uploadUrl).toEqual(
-        expect.stringContaining('pet-tracker-media-local'),
-      );
+      expect(body.uploadUrl).toEqual(expect.stringContaining(BUCKET_MEDIA));
```

El commit `facc289` (`style:`) reformateó ese mismo hunk; el efecto neto sigue
siendo solo la línea 185. Ninguna otra línea del archivo cambia.

### R4 — cero literales duplicados ✅ (test ejecutable + grep independiente)

`infra/test/no-duplicated-literals.test.ts` recorre recursivamente `infra/bin` e
`infra/lib`, y para cada uno de los 17 valores de constantes busca las tres
formas entrecomilladas (`'…'`, `"…"`, `` `…` ``). Es una guarda ejecutable real,
no una lista de aserciones cosméticas.

Grep independiente del reviewer sobre los mismos directorios: **cero hits**. El
inventario completo de literales que quedan en `infra/bin` + `infra/lib` son IDs
de constructo (`'PositionsRaw'`, `'MediaBucket'`…), rutas de módulo,
`'PROVISIONED'`, `'BillingMode'`, `'dev'` y `'us-east-1'` — ninguno es valor de
`constants.ts`.

### R5 — `cdk.out/` ignorado ✅

`.gitignore:12` contiene `cdk.out/`. Tras el synth de `init.sh`,
`git status --porcelain` no lista nada generado.

### R6 — el gate encadena `infra` y el fallo propaga de verdad ✅

Las cinco variables de `init.config.sh` (líneas 23-27) encadenan `pnpm -C infra`
con `&&`. `init.sh` **no fue modificado** (no está en el diff).

No me quedé en la inspección visual. `init.sh` ejecuta cada comando con
`eval "$CMD"` bajo `set -e` (líneas 4, 80, 184, 195, 219, 229, 239), así que un
fallo en la mitad derecha del `&&` aborta el script. Comprobado
empíricamente y sin tocar ningún archivo, usando el paquete `infra` real:

```bash
bash -c 'set -e; eval "pnpm -C backend-pet-tracker --version && \
  pnpm -C infra exec jest --testPathPatterns nonexistent-suite"; echo REACHED'
# → exit 1, "REACHED" nunca se imprime
```

Un fallo en `infra/` hace fallar `init.sh`. El gate no es decorativo.

### R7 — seis colas con su DLQ ✅ (verificado en el template real)

```
PositionsRawDlq44C4EF98  => positions-raw-dlq    | RedrivePolicy: ninguna
PositionsRawDC2EF18F     => positions-raw        | → PositionsRawDlq, maxReceiveCount 3
NotificationsDlq12302AF4 => notifications-dlq    | RedrivePolicy: ninguna
Notifications87298708    => notifications        | → NotificationsDlq, maxReceiveCount 3
GeofenceEventsDlqAF38CAA6=> geofence-events-dlq  | RedrivePolicy: ninguna
GeofenceEventsBFAECB41   => geofence-events      | → GeofenceEventsDlq, maxReceiveCount 3
```

Nombres desnudos, cada principal apunta a **su** DLQ, las tres DLQ sin redrive.

### R8 — tabla `positions` ✅

Template real: `BillingMode: PROVISIONED`, `ProvisionedThroughput 25/25`,
`TableClass: STANDARD`, `KeySchema pk(HASH)/sk(RANGE)`, `AttributeDefinitions
pk:S / sk:N`, `TimeToLiveSpecification { expires_at, Enabled: true }`. Sin
`PointInTimeRecoverySpecification`, sin `SSESpecification`, sin índices
secundarios, y ningún `AWS::DynamoDB::GlobalTable`.

Nota de implementación correcta: CDK omite `BillingMode` cuando es el default de
CloudFormation, así que el stack lo fuerza con `addPropertyOverride`. El template
lo lleva explícito, que es lo que pide R8.

### R9 — bucket con account-id sin resolver ✅

```json
"BucketName": { "Fn::Join": ["", ["pet-tracker-media-dev-", { "Ref": "AWS::AccountId" }]] }
```

Token `Aws.ACCOUNT_ID` sin resolver (por eso el synth no necesita cuenta).
Los cuatro flags de `PublicAccessBlockConfiguration` en `true`. Cero
`AWS::S3::BucketPolicy`.

### R10 — bus y regla ✅

`AWS::Events::EventBus` `Name: pet-tracker`; `AWS::Events::Rule`
`Name: geofence-events`, `EventBusName: { Ref: EventBus7B8748AA }`,
`State: ENABLED`, `EventPattern { source: [pet-tracker], detail-type:
[position.updated, battery.low] }`, un único `Targets` apuntando al
`Fn::GetAtt` de `GeofenceEventsBFAECB41`. Sin `InputTransformer`, sin `RoleArn`.

### R11 — resource-policy de SQS ✅ **verificado en el template, no solo en el test**

Este era el requisito crítico: el bug latente que solo se manifiesta en AWS real.
Extraído del template sintetizado real:

```json
"GeofenceEventsPolicy235D98F4": {
  "Type": "AWS::SQS::QueuePolicy",
  "Properties": {
    "PolicyDocument": { "Statement": [{
      "Action": ["sqs:SendMessage", "sqs:GetQueueAttributes", "sqs:GetQueueUrl"],
      "Effect": "Allow",
      "Principal": { "Service": "events.amazonaws.com" },
      "Resource": { "Fn::GetAtt": ["GeofenceEventsBFAECB41", "Arn"] },
      "Condition": { "ArnEquals": { "aws:SourceArn":
        { "Fn::GetAtt": ["GeofenceEventsRule8B1B7F53", "Arn"] } } }
    }] },
    "Queues": [{ "Ref": "GeofenceEventsBFAECB41" }]
  }
}
```

`GeofenceEventsBFAECB41` es la cola `geofence-events`. Principal
`events.amazonaws.com`, `sqs:SendMessage` presente, y además acotada por
`ArnEquals` a la regla — más estricta de lo que pedía R11. El bug latente queda
cerrado.

### R12 — políticas de borrado ✅

Template real: tabla con `DeletionPolicy: Retain` / `UpdateReplacePolicy: Retain`;
bucket con `Delete` / `Delete`. Ningún `autoDeleteObjects` ni `encryptionKey` en
el stack (se confirma por R13: no hay Lambda, ni rol, ni log group, ni KMS).

### R13 — inventario cerrado ✅ (las dos mitades)

**El test compara el conjunto completo**, no aserciones de ausencia una por una.
Construye un mapa `Type → count` recorriendo todos los recursos y hace
`expect(counts).toEqual({...})`: cualquier tipo nuevo añade una clave y rompe la
igualdad, aunque nadie lo hubiera previsto. Es exactamente lo que exige la spec.

**El template real tiene esos 11 y ni uno más**, verificado por el reviewer:

```
TOTAL RESOURCES: 11
{ "AWS::SQS::Queue": 6, "AWS::SQS::QueuePolicy": 1, "AWS::DynamoDB::Table": 1,
  "AWS::S3::Bucket": 1, "AWS::Events::EventBus": 1, "AWS::Events::Rule": 1 }
```

Sobre `AWS::CDK::Metadata`: **no aparece**. El `versionReporting: false` de
`infra/cdk.json` hizo su trabajo. Este es el punto fino que el test en memoria
solo no habría cazado — `Template.fromStack()` nunca emite metadata, así que la
aserción del inventario habría pasado igual con el CLI metiendo un recurso 12.
Por eso el segundo test de R13 comprueba `cdk.json`, y por eso lo confirmé
además contra el `cdk.out` real. Las claves `Parameters` y `Rules` del template
(`BootstrapVersion` / `CheckBootstrapVersion`) no son recursos y no cuentan.

### R14 — región fija, cuenta libre ✅

`infra/bin/app.ts` pasa `env: { region: DEV_REGION }` y nada más.
`DEV_REGION = 'us-east-1'` se exporta desde `infra/lib/pet-tracker-dev-stack.ts`.
El test comprueba `Stack.of(stack).region === 'us-east-1'` y
`Token.isUnresolved(Stack.of(stack).account) === true`.

### R15 — `docs/architecture.md` ✅

Línea 103: la fila S3 ahora dice `| S3 \`pet-tracker-media-local\` / AWS real
\`pet-tracker-media-dev-<accountId>\` …` y sustituye "Pendiente de verificar en
un despliegue AWS real" por la referencia a `aws-cdk-dev-stack` #20 R21.
Línea 109: añade la nota de **una cuenta AWS por entorno** y del sufijo de
`resourceName` para un segundo entorno.

### R16 — `docs/verification.md` ✅

Sección `### Feature 20 — aws-cdk-dev-stack` con los cinco pasos numerados
(Billing R17, bootstrap R18 con `--termination-protection` y la nota de no usar
`--bootstrap-customer-key`, deploy R19, no-op R20, comando exacto del e2e R21),
la advertencia de comentar `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` en el
`.env` raíz, y las consecuencias operativas de las políticas de borrado.

### R21 mitad A ✅ (los cinco puntos exigidos)

`backend-pet-tracker/test/aws-real-ingest.e2e-spec.ts`:

1. **Existe** y cubre los tres tramos (SQS send/receive/delete, DynamoDB
   put/query + delete en `afterAll`, EventBridge → `geofence-events`), con
   `WaitTimeSeconds: 20` × 3 intentos = 60 s.
2. **Se auto-salta**: `(runAwsIngest ? describe : describe.skip)` sobre
   `(process.env.AWS_MODE ?? '').trim().toLowerCase() === 'aws'`. Ejecutado por
   el reviewer sin `AWS_MODE`: `1 suite skipped / 3 tests skipped`, cero llamadas
   remotas.
3. **Falla explícito con clave estática**: ejecutado con `AWS_MODE=aws` y el
   `AWS_ACCESS_KEY_ID=test` que hay hoy en `.env`, los 3 tests fallan en
   `beforeAll` con `AWS_ACCESS_KEY_ID debe estar ausente para usar la sesión de
   aws login`, **antes** de construir ningún cliente. Ninguna llamada salió a la red.
4. **No depende de Postgres ni de `AppModule`**: solo importa
   `src/aws/aws-clients` y `src/aws/constants`.
5. **No escribe nada con `expires_at` en el pasado**: el único item usa
   `Math.floor(Date.now() / 1000) + 3600` (una hora en el futuro) y el test
   comprueba que el item **está**, nunca que haya desaparecido. No hay ninguna
   aserción sobre expiración de TTL. Correcto: un test así habría pasado en
   LocalStack y fallado (o tardado días) contra AWS real.

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` (#20 `aws-cdk-dev-stack`)
- [x] `progress/current.md` está en la plantilla vacía (permitido por C2)
- [x] `progress/history.md` tiene la entrada de la sesión, y sus conteos
      coinciden con los que midió el reviewer
- [x] `STATUS.md` sincronizado con `feature_list.json` (verificado por `init.sh`)

## Checklist C3 — Arquitectura

- [x] `domain` sin imports de `infrastructure` — esta feature no toca capas de
      dominio; el único archivo de `src/` modificado es `aws/constants.ts`
- [x] Repositorios/contratos en `domain` intactos
- [x] `application` intacta
- [x] `infrastructure` sin lógica de negocio
- [x] El paquete `infra/` depende de `@backend/aws/constants`, un módulo hoja de
      constantes puras **sin ningún import**: no invierte ninguna dependencia ni
      arrastra runtime del backend hacia el stack

## Checklist C4 — TDD

- [x] Cada R1-R16 y R21 tiene al menos un test que **nombra su R-id** en el
      `describe` (`R1:`, `R7:`, `R11:`…), verificado archivo por archivo
- [x] **Historial test-primero verificado commit a commit**, no asumido. Los 57
      commits van en tríos `test:` (rojo) → `feat:` (verde) → `docs(trace)`.
      Recorrí `git log --oneline main...HEAD` listando los archivos de cada
      commit: **en los 17 tríos el commit `test:` toca solo archivos de test y
      precede al `feat:`, que toca solo implementación**. Ningún R-id se
      implementó sin test rojo previo.

Además reproduje dos rojos en un worktree aislado sobre su commit original:

- **R11** en `d669a08`: falla con
  `Expected 1 resources of type AWS::SQS::QueuePolicy but found 0`.
  Rojo por la razón correcta: en R10 el target era un `bind()` a mano
  (`addTarget({ bind: () => ({ arn: ... }) })`) que **no genera policy**; el
  commit verde `a977dc9` lo cambió a `targets.SqsQueue`, que sí la genera.
- **R13** en `8121ad9`: falla con `Expected: false / Received: undefined` sobre
  `versionReporting`.

Una observación, no un defecto: el commit verde de R11 (`a977dc9`) también tocó
el test, relajando `Action: 'sqs:SendMessage'` (escalar) a
`Match.arrayWith(['sqs:SendMessage'])`. No es debilitar el test por debajo de la
spec — R11 pide literalmente "`Action` **que incluya** `'sqs:SendMessage'`", y
CDK emite un array de tres acciones. La aserción original era incorrecta, no más
estricta. El hecho verificado en el template sigue siendo el que exige la spec.

## Checklist C5 — Trazabilidad

- [x] `specs/aws-cdk-dev-stack/traceability.md` **sin filas "pendiente" en
      R1-R16**; R21 tiene la mitad A cerrada con hashes
- [x] Cada requisito tiene test y commit (hash rojo + hash verde) registrados
- [x] Commits en formato `feat(aws-cdk-dev-stack): <desc> (Rn)`
- [ ] Las cinco filas R17-R21 dicen "pendiente" **por diseño**: las cierra el
      humano. No es motivo de rechazo (mismo patrón que #19 R11/R12).

## Checklist C6 — Spec aprobada

- [x] `specs/aws-cdk-dev-stack/requirements.md` con `status: approved`
- [x] Casilla "Aprobado por humano" marcada con fecha (2026-08-10)
- [x] Los 21 R-ids no se modificaron después de la aprobación (`11f835f`)

## Checklist C7 — Sin código huérfano

- [x] N/A — esta feature **no reemplaza nada existente**. La spec es explícita:
      `provisioning.ts` y `run-provisioning.ts` siguen sirviendo a LocalStack sin
      tocar ni una línea, y el bucket que declara el stack todavía no lo consume
      nadie en el runtime (fuera de alcance, decisión D1). Verificado: ninguno de
      los dos aparece en el diff, y no se eliminó ningún archivo.

---

## Observaciones (ninguna bloquea)

1. **`traceability.md` sigue con `status: draft` en el frontmatter.** La mayoría
   de las features cerradas lo tienen en `approved`. Es coherente mientras #20
   siga `in_progress`, pero conviene voltearlo cuando el humano cierre R17-R21.
2. **El helper `resourceName` está probado pero casi sin usar con sufijo real**:
   en el stack, `ENV_SUFFIX = ''` para todo salvo el bucket. Es exactamente la
   decisión D3 (una cuenta por entorno) y está documentado en `architecture.md`
   por R15. Solo dejo constancia de que el día que haya un segundo entorno en la
   misma cuenta, el cambio está localizado en esa constante.
3. **Aviso cosmético en el output**: `ts-jest` advierte que jest 30.0.0 no está
   testeado con `ts-jest@29.2.5`. No rompe nada (14/14 verdes) y vive solo en
   `infra/`, pero es deuda menor de versiones.

---

## Pendiente de cierre humano — R17 a R21 mitad B

Ningún agente ejecuta estos pasos: crean recursos AWS reales y cuestan dinero.
El reviewer **tampoco** los ejecutó. El procedimiento exacto está en
`docs/verification.md` §"Feature 20 — aws-cdk-dev-stack".

| R | Qué falta | Dónde se registra |
|---|---|---|
| **R17** | Verificar en la consola de AWS Billing que la cuenta cubre DynamoDB Standard provisionado 25 RCU / 25 WCU / 25 GB, y anotar qué pasa al agotar créditos o la ventana de 6 meses | `progress/impl_aws-cdk-dev-stack.md` §Free tier |
| **R18** | `cdk bootstrap aws://<accountId>/us-east-1 --termination-protection` con un principal con `iam:*` (PowerUserAccess **no** lo incluye) | §Bootstrap |
| **R19** | `pnpm -C infra exec cdk deploy PetTrackerDev` → `CREATE_COMPLETE` con los 11 recursos | §Deploy |
| **R20** | Segundo `cdk deploy` sin cambios → `no changes` | §Deploy idempotente |
| **R21 B** | La suite `aws-real-ingest.e2e-spec.ts` en verde **sin `skipped`**, con `AWS_MODE=aws` y las credenciales estáticas comentadas en el `.env` raíz | §E2E AWS real |

Recordatorio operativo: hoy el `.env` raíz tiene `AWS_ACCESS_KEY_ID=test` y
`AWS_SECRET_ACCESS_KEY=test` (líneas 13-14). Hay que comentarlas antes de R18-R21
o la guarda `assertNoStaticAccessKey` aborta la suite — está comprobado que lo
hace. Al terminar, restaurarlas y volver a `AWS_MODE=local`.

Cuando el humano registre las cinco filas, la feature puede pasar a `done` sin
una segunda revisión de código: R1-R16 y R21 mitad A quedan aprobados aquí.

---

## Output de `./init.sh`

```
══════════════════════════════════════════
  INIT — pet-tracker (Harness SDD)
══════════════════════════════════════════

→ Verificando entorno...
✅ node disponible (/c/Program Files/nodejs/node)
✅ pnpm disponible (/c/Users/alex/AppData/Local/pnpm/pnpm)

→ Verificando variables de entorno...
✅ .env encontrado
✅   DATABASE_URL definida

→ Instalando dependencias...
Done in 776ms using pnpm v10.33.4
✅ Dependencias instaladas

→ Verificando coherencia del harness...
✅ Archivos del harness presentes
⚠️  Feature en progreso: aws-cdk-dev-stack
✅ STATUS.md sincronizado con feature_list.json

→ Build...

> backend-pet-tracker@0.0.1 build C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> nest build && tsc-alias -p tsconfig.build.json

> pet-tracker-infra@0.0.1 synth C:\Users\alex\Documents\sites\pet-tracker\infra
> cdk synth --quiet

82 feature flags are not configured. Run 'cdk flags --unstable=flags' to learn more.
✅ Build exitoso

→ Ejecutando tests...

> backend-pet-tracker@0.0.1 test C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> jest "--passWithNoTests"

Test Suites: 121 passed, 121 total
Tests:       879 passed, 879 total
Snapshots:   0 total
Time:        11.65 s
Ran all test suites.

> pet-tracker-infra@0.0.1 test C:\Users\alex\Documents\sites\pet-tracker\infra
> jest "--passWithNoTests"

PASS test/no-duplicated-literals.test.ts (14.01 s)
PASS test/pet-tracker-dev-stack.test.ts (22.329 s)

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        23.145 s
Ran all test suites.
✅ Tests pasados

→ Tests e2e...

Test Suites: 2 skipped, 13 passed, 13 of 15 total
Tests:       5 skipped, 181 passed, 186 total
Snapshots:   0 total
Time:        49.27 s
Ran all test suites.
✅ Tests e2e pasados

→ Lint...

> backend-pet-tracker@0.0.1 lint C:\Users\alex\Documents\sites\pet-tracker\backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix

> pet-tracker-infra@0.0.1 lint C:\Users\alex\Documents\sites\pet-tracker\infra
> eslint "{bin,lib,test}/**/*.ts"

✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 15/20 completadas | 4 pendientes

  Próxima feature:
  [#15] health-weights (P2)

EXIT_CODE=0
```

Nota sobre el output: los tests unitarios y e2e imprimen stack traces de errores
esperados (un `ECONNREFUSED 127.0.0.1:4566` de un test de ciclo del worker y una
violación de FK `23503` de un test negativo de `pets`). Son aserciones de camino
de error, no fallos: los conteos son 879/879 y 181 passed.
