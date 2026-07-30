# impl: localstack-provisioning
Fecha: 2026-07-30

## Archivos creados

- `backend-pet-tracker/src/aws/aws-clients.ts` — factories de los 4 clientes AWS SDK v3 (SQS, DynamoDB, S3, EventBridge); `resolveAwsConfigFromConfigService` (app, vía ConfigService) y `resolveAwsConfigFromEnv` (script standalone, vía `process.env`, aborta con `MissingAwsEndpointError` si falta `AWS_ENDPOINT_URL`).
- `backend-pet-tracker/src/aws/aws-clients.spec.ts` — R1: cada cliente resuelve su endpoint al valor de `AWS_ENDPOINT_URL`.
- `backend-pet-tracker/src/aws/aws-env-config.spec.ts` — R2: `resolveAwsConfigFromEnv` lanza si falta/está vacía `AWS_ENDPOINT_URL`.
- `backend-pet-tracker/src/aws/aws.constants.ts` — tokens de inyección `SQS_CLIENT`/`DYNAMODB_CLIENT`/`S3_CLIENT`/`EVENTBRIDGE_CLIENT`.
- `backend-pet-tracker/src/aws/aws.module.ts` — `AwsModule` (Global), expone los 4 clientes bajo esos tokens, mismo patrón que `DrizzleModule`/`DRIZZLE`.
- `backend-pet-tracker/src/aws/aws.module.spec.ts` — R1: los 4 tokens resuelven al tipo de cliente correcto dentro de un `TestingModule`.
- `backend-pet-tracker/test/fixtures/.env.aws-fixture` — fixture propia de `aws.module.spec.ts` (no se tocó el fixture compartido de `config.module.spec.ts`).
- `backend-pet-tracker/src/aws/no-hardcoded-credentials.spec.ts` — R3: guarda estático contra región/access-key-id literal en `src/aws/` y `scripts/`.
- `backend-pet-tracker/src/aws/constants.ts` — nombres de recursos (colas, tabla, bucket, bus) y `SQS_MAX_RECEIVE_COUNT`.
- `backend-pet-tracker/src/aws/provisioning.ts` — lógica idempotente de creación: `provisionQueues` (R6-R9), `provisionPositionsTable` (R10, R11), `provisionMediaBucket` (R12, R13), `provisionEventBus` (R14), `provisionAllResources` (R4), `describeProvisioningError` (R16).
- `backend-pet-tracker/src/aws/provisioning.sqs.spec.ts` — R9: orden DLQ→cola principal, con un `SQSClient` mockeado (corre y pasa de verdad, sin red).
- `backend-pet-tracker/src/aws/provisioning.connection-error.spec.ts` — R16: mensaje de error claro contra un puerto real cerrado (`http://localhost:1`), sin mocks ni LocalStack.
- `backend-pet-tracker/src/aws/run-provisioning.ts` — `runProvisioning(env, logger)`: orquesta config→clientes→provisioning y devuelve un exit code (nunca llama a `process.exit` directamente, para quedar testeable).
- `backend-pet-tracker/src/aws/run-provisioning.spec.ts` — R2 y R16 a nivel de orquestador: exit code 1 si falta el endpoint, exit code 1 + mensaje si LocalStack no responde (puerto cerrado real).
- `backend-pet-tracker/scripts/provision-local.ts` — entrypoint standalone: `dotenv` carga `../.env`, llama `runProvisioning(process.env)` importado vía `@/aws/run-provisioning`.
- `backend-pet-tracker/src/aws/provision-local-script.spec.ts` — R19: `package.json` invoca `ts-node -r tsconfig-paths/register scripts/provision-local.ts`.
- `backend-pet-tracker/src/aws/no-real-aws-endpoint.spec.ts` — R15: guarda estático contra `amazonaws.com` en `src/aws/` y `scripts/provision-local.ts`.
- `backend-pet-tracker/src/aws/relative-import-guard.spec.ts` — R18: guarda estático contra imports `../*aws` fuera de `src/aws/`.
- `backend-pet-tracker/src/aws/status-doc.spec.ts` — R17: `STATUS.md` documenta `docker compose up -d`, `pnpm run provision:local` y el comando `aws sqs list-queues`.
- `backend-pet-tracker/test/localstack-provisioning.e2e-spec.ts` — integración real (R4, R5, R6, R7, R8, R10, R11, R12, R13, R14) contra un LocalStack real vía `runProvisioning` + comandos AWS SDK v3 reales. **No se pudo ejecutar con éxito en este sandbox** (ver más abajo).

## Archivos modificados

- `backend-pet-tracker/package.json` / `pnpm-lock.yaml` — nuevas dependencias `@aws-sdk/client-sqs`, `@aws-sdk/client-dynamodb`, `@aws-sdk/client-s3`, `@aws-sdk/client-eventbridge`, `dotenv` (no estaba resoluble directamente pese a ser dependencia transitiva de `@nestjs/config` — `pnpm`'s strict `node_modules` lo bloqueaba, confirmado con `node -e "require.resolve('dotenv')"` antes de instalar); script `provision:local`.
- `backend-pet-tracker/src/app.module.ts` — importa `AwsModule` (igual que `DrizzleModule`), disponible globalmente para módulos futuros.
- `docs/conventions.md` — la tabla de variables de entorno ya no marca `AWS_ENDPOINT_URL`/`AWS_REGION`/`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` como "sin uso todavía": esta feature es la primera en consumirlas.
- `STATUS.md` — sección "Cómo arrancar" ampliada con el flujo de `provision:local` y la verificación manual (R17); estado actual y "última sesión" actualizados con el resultado honesto de esta feature.
- `specs/localstack-provisioning/traceability.md` — las 19 filas completadas, ninguna en "pendiente".
- `feature_list.json` — id=2 `spec_ready` → `in_progress` (no lo marco `done`: eso lo decide el reviewer tras su verificación, ver `.claude/agents/leader.md`).
- `progress/current.md` — sesión activa documentando el bloqueo de Docker.

## Requisitos cubiertos

**Verificados con tests reales que corren y pasan en este sandbox (9/19):**

- R1: `src/aws/aws-clients.spec.ts::R1`, `src/aws/aws.module.spec.ts::R1`, commit `df0df03`
- R2: `src/aws/aws-env-config.spec.ts::R2`, commit `4d9bf65`
- R3: `src/aws/no-hardcoded-credentials.spec.ts::R3`, commit `7edf495`
- R9: `src/aws/provisioning.sqs.spec.ts::"R9: orden de creación..."`, commit `5226220`
- R15: `src/aws/no-real-aws-endpoint.spec.ts::R15`, commit `abb4225`
- R16: `src/aws/provisioning.connection-error.spec.ts::R16`, `src/aws/run-provisioning.spec.ts::R16`, commits `5226220`, `e97591f`
- R17: `src/aws/status-doc.spec.ts::R17`, commit `d6ca92a`
- R18: `src/aws/relative-import-guard.spec.ts::R18`, commit `f8ca2fb`
- R19: `src/aws/provision-local-script.spec.ts::R19`, commit `024b7ee` — además verificado manualmente corriendo `ts-node -r tsconfig-paths/register scripts/provision-local.ts` y `pnpm run provision:local` de verdad en este sandbox: el alias `@/aws/...` resuelve (sin "Cannot find module"), y falla solo por R16 (LocalStack no levantado), exit code 1.

**Implementados y con test de integración escrito, pero NO ejecutados con éxito contra LocalStack real (10/19)** — ver "Notas para el reviewer":

- R4, R5, R6, R7, R8, R10, R11, R12, R13, R14: código de provisioning en `src/aws/provisioning.ts`, test en `test/localstack-provisioning.e2e-spec.ts` (un `describe` por R-id), commits `5226220` (implementación), `e97591f` (orquestador R4/R5), `303fa22` (test de integración).

## Decisiones de diseño

- **`src/aws/provisioning.ts` y `src/aws/run-provisioning.ts` como archivos adicionales no listados literalmente en `design.md`**: `design.md` lista `aws-clients.ts`, `aws.module.ts`, `constants.ts` y `scripts/provision-local.ts` como archivos afectados, pero no desglosa la lógica de creación de recursos en sí. La separé en su propio archivo (`provisioning.ts`) en vez de meterla directamente en `scripts/provision-local.ts` para que quedara bajo `rootDir: "src"` de la config de Jest de `pnpm test` — así R9 y R16 (los dos requisitos de esta franja que sí son verificables sin LocalStack) tienen un test unitario real que corre con `pnpm test`, no solo con `pnpm run test:e2e`. `run-provisioning.ts` separa la orquestación (config→clientes→provisioning→exit code) de las funciones de creación por recurso, siguiendo el mismo principio. El script standalone (`scripts/provision-local.ts`) queda como un wrapper de ~20 líneas: carga `dotenv` y llama `runProvisioning`, fiel al espíritu de design.md.
- **Estrategia de idempotencia "crear y capturar duplicado"**: implementada tal cual la fija `design.md` — `QueueNameExists` para SQS, `ResourceInUseException` para DynamoDB (+ una `ValidationException` con mensaje `already enabled` para el `UpdateTimeToLive` idempotente, ya que DynamoDB no tiene una excepción tipada dedicada para ese caso), `BucketAlreadyOwnedByYou` para S3, `ResourceAlreadyExistsException` para EventBridge.
- **`describeProvisioningError` también reconoce `AggregateError` como señal de conexión**: al escribir el test real de R16 (puerto cerrado, sin mocks) se descubrió que bajo `ts-jest` el SDK v3 normaliza el `AggregateError` nativo de Node (dual-stack IPv4/IPv6 `ECONNREFUSED`) a un wrapper genérico que pierde `.code`/`.errors` — visto con `node -e` directo (donde sí aparecen) vs. dentro de un test de Jest (donde no). Se agregó `AggregateError` al patrón de detección de errores de conexión para cubrir ese caso real, documentado con un comentario en el código.
- **Fixture propio para `aws.module.spec.ts`** (`test/fixtures/.env.aws-fixture`) en vez de reusar `test/fixtures/.env.fixture`: ese fixture es de `config.module.spec.ts` (R5 de `db-setup-drizzle`) y no tiene variables `AWS_*`; agregarlas ahí habría acoplado dos tests de features distintas.
- **`forcePathStyle: true` en el cliente S3**: LocalStack community no resuelve bien el estilo virtual-hosted (`bucket.localhost`); necesario para que `CreateBucketCommand`/`PutPublicAccessBlockCommand` funcionen contra `http://localhost:4566`.

## Output de build

```
$ pnpm run build
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json

(sin errores, exit code 0)
```

## Output de tests

```
$ pnpm test
Test Suites: 19 passed, 19 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        ~3s
```

```
$ pnpm exec tsc --noEmit
(sin salida — sin errores de tipos)
```

```
$ pnpm run lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix
(sin errores)
```

Adicionalmente, `test/localstack-provisioning.e2e-spec.ts` se corrió con
`pnpm run test:e2e -- test/localstack-provisioning.e2e-spec.ts` en este
sandbox (sin LocalStack disponible) para confirmar que el archivo compila y
falla exactamente por el motivo esperado (conexión rechazada, exit code 1
en `runProvisioning`, R16), no por un error de configuración o de tipos:

```
Test Suites: 1 failed, 1 total
Tests:       9 failed, 9 total
```

Las 9 assertions fallan porque `runProvisioning` en el `beforeAll` devuelve
`1` en vez de `0` (no hay LocalStack escuchando en `:4566`) — el mismo
patrón de fallo que produce `pnpm run provision:local` corrido directamente
en este sandbox (ver el commit `024b7ee`).

## Notas para el reviewer

- **Bloqueo de entorno, igual que se documentó para Postgres en la feature #1**: este sandbox no tiene acceso al socket de Docker (`permission denied`, sin `sudo`, confirmado antes y durante esta sesión). A diferencia de Postgres, que tuvo un Postgres nativo (`initdb`/`pg_ctl`) como alternativa viable, **LocalStack no tiene equivalente nativo**: tanto el CLI `localstack start` como `docker-compose.yml` requieren Docker incluso en community edition.
- **10 requisitos (R4, R5, R6, R7, R8, R10, R11, R12, R13, R14) están implementados y tienen un test de integración real escrito que los nombra por su R-id (`test/localstack-provisioning.e2e-spec.ts`), pero ese test NO se ejecutó con éxito contra un LocalStack real** en esta sesión — no hay infra disponible. Lo que sí se verificó: (a) el archivo compila sin errores de tipos (`tsc --noEmit` limpio), (b) pasa lint, (c) al correrlo de verdad sin LocalStack, falla exactamente en el punto esperado (conexión rechazada en el `beforeAll`, no un error de sintaxis/config), lo cual es evidencia indirecta de que el código y el test están bien formados, aunque no reemplaza la verificación real.
- **Siguiente paso concreto para cerrar la verificación real**: en una máquina/sesión con Docker disponible, correr `docker compose up -d && cd backend-pet-tracker && pnpm run test:e2e -- test/localstack-provisioning.e2e-spec.ts` y confirmar que las 9 assertions (R4-R14, agrupadas) pasan contra LocalStack real. Si algo no pasa ahí, es un bug real en `provisioning.ts` que hay que corregir — el código no se validó end-to-end todavía.
- **R9 y R16 sí corren de verdad** en este sandbox sin necesitar LocalStack: R9 usa un `SQSClient` mockeado para verificar el orden de creación (DLQ antes que cola principal) sin red; R16 usa un puerto real cerrado (`http://localhost:1`), una llamada de red genuina que falla rápido sin necesitar ningún servidor.
- El resto de requisitos "estáticos" (R3, R15, R18) ya estaban satisfechos por construcción en el momento de escribir su test (ningún literal hardcodeado, ningún import relativo cruzado) — mismo patrón que el guard de R6 en `db-setup-drizzle` (#1): el test es la salvaguarda contra una regresión futura, no encontró una violación al escribirse.
- `AwsModule` se importa globalmente en `AppModule` aunque ningún módulo de negocio lo consume todavía (correcto: el consumo real —`media`, `positions`, `workers`— es de features futuras, fuera de alcance aquí). Construir los 4 clientes AWS SDK v3 no hace ninguna llamada de red hasta que se envía un comando, así que esto no afecta a `test/app.e2e-spec.ts` ni a `test/health.e2e-spec.ts`, que siguen en verde.

## Fix post-review (2026-07-30)

El reviewer rechazó la feature por un único defecto: R4 solo se verificaba
dentro del `beforeAll` de `test/localstack-provisioning.e2e-spec.ts`, sin
`describe`/`it` propio (violación de CHECKPOINTS C4). Fix aplicado:
- `beforeAll` ahora solo arma los 4 clientes AWS y corre `runProvisioning`
  una única vez, guardando el resultado en la variable de closure
  `firstRunExitCode` (sin `expect` dentro del hook).
- Nuevo bloque `describe('R4: primera corrida sobre LocalStack crea los 8
  recursos y termina en 0', () => { it('runProvisioning devuelve exit code
  0', () => { expect(firstRunExitCode).toBe(0); }); })`, ubicado antes de
  `describe('R5: ...')`, sin volver a llamar a `runProvisioning` (evita
  duplicar tráfico de red).
- `specs/localstack-provisioning/traceability.md` fila R4 actualizada al
  nuevo nombre de test; la marca ⚠️ de "no ejecutado contra LocalStack real"
  se mantiene, sigue siendo cierta en este sandbox.
- Reverificado: `tsc --noEmit` limpio, `pnpm run lint` limpio, y
  `pnpm run test:e2e -- test/localstack-provisioning.e2e-spec.ts` sigue
  fallando de forma controlada (conexión rechazada a `:4566`, no error de
  compilación), y ahora el nombre `R4: primera corrida sobre LocalStack crea
  los 8 recursos y termina en 0 › runProvisioning devuelve exit code 0`
  aparece explícitamente en el output de Jest.
