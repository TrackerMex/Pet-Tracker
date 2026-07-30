---
feature: "localstack-provisioning"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[localstack-provisioning]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del
> proyecto.

## Decisiones técnicas

- **Ubicación fuera de las 3 capas domain/application/infrastructure**:
  esta feature no modela un concepto de negocio ni un caso de uso — es
  infraestructura de arranque del entorno local, análoga a `src/db/` (schema
  Drizzle compartido) y a los scripts standalone como `scripts/seed-devices.ts`
  (feature #7). `docs/architecture.md` ya reconoce esta categoría: cosas que
  viven fuera del patrón de módulo porque son transversales o se ejecutan
  fuera del ciclo de vida HTTP normal de NestJS. Sirve a: todos los R.

- **`src/aws/` como infraestructura compartida, no un "módulo de feature"**:
  igual que `src/db/drizzle.module.ts` expone el cliente Postgres con el
  token `DRIZZLE` para que cualquier módulo lo inyecte, `src/aws/` expone
  factories/providers para los 4 clientes AWS SDK v3 (SQS, DynamoDB, S3,
  EventBridge) construidos desde `ConfigService`, para que módulos futuros
  (`media`, `positions`, `workers`, `reminders`) los inyecten sin repetir la
  lógica de configuración de endpoint/credenciales. Sirve a: R1, R3, R15.

- **`scripts/provision-local.ts` como script standalone fuera de Nest**: se
  ejecuta con `ts-node`/`tsx` vía `pnpm run provision:local`, sin bootstrapear
  la aplicación NestJS completa (más rápido, sin dependencias de Postgres
  para provisionar AWS). Carga el `.env` raíz con `dotenv` (mismo archivo que
  usa `ConfigModule`, mismo camino relativo `../.env` que ya usa el backend)
  y lee `AWS_ENDPOINT_URL`/`AWS_REGION`/`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`
  de `process.env` — la misma excepción que ya aplica a `drizzle.config.ts`
  (herramienta CLI fuera del runtime de la app). El script puede reutilizar
  las factories de `src/aws/` para no duplicar la construcción de clientes.
  Sirve a: R1, R2, R4, R5, R16.

- **Idempotencia por "crear y capturar el error de duplicado" (no
  "verificar-luego-crear")**: para SQS (`QueueAlreadyExists` en LocalStack
  cuando los atributos coinciden, o reutilizar `getQueueUrl` si ya existe),
  DynamoDB (`ResourceInUseException` al crear tabla existente), S3
  (`BucketAlreadyOwnedByYou`) y EventBridge (`create-event-bus` es
  naturalmente idempotente si el nombre coincide y no cambia de recurso, o
  se ignora `ResourceAlreadyExistsException`). Preferido sobre "listar todo y
  decidir" porque es menos código y dos llamadas de red por recurso en el
  peor caso, contra N llamadas de listado + N de creación. Sirve a: R4, R5.

- **Orden de creación DLQ → cola principal**: `positions-raw-dlq` antes que
  `positions-raw`, `notifications-dlq` antes que `notifications`, porque la
  `RedrivePolicy` de la cola principal necesita el ARN de la DLQ ya
  existente. Sirve a: R7, R8, R9.

- **`maxReceiveCount = 3`** para ambas `RedrivePolicy` (positions-raw y
  notifications): valor conservador razonable para un pipeline en desarrollo
  — suficientes reintentos para transitorios de red/LocalStack sin ocultar
  errores reales de procesamiento por mucho tiempo. No hay requisito de
  negocio que fije un número distinto; queda documentado aquí y es ajustable
  sin migración porque LocalStack se reprovisiona en cada `docker compose
  down -v`. Sirve a: R7, R8.

- **Nombre del bucket S3 de media**: `pet-tracker-media-local` — prefijo del
  proyecto + propósito + sufijo `-local` para dejar explícito que es un
  recurso de desarrollo (nunca se reutiliza el mismo nombre contra un bucket
  de AWS real, que llevaría un sufijo de entorno distinto al desplegar).
  Sirve a: R12, R13.

- **Nombres SQS/DynamoDB/EventBridge sin sufijo de entorno**: `positions-raw`,
  `positions-raw-dlq`, `notifications`, `notifications-dlq`, tabla
  `positions`, bus `pet-tracker` — coinciden exactamente con los nombres
  fijados en `docs/data-model.md` y en el `acceptance_criteria` de
  `feature_list.json` (`aws sqs list-queues` debe mostrar las 4 colas por
  nombre reconocible). No se añade sufijo `-local` a estos porque el
  `acceptance_criteria` de la feature los nombra literalmente y otras specs
  futuras (#8, #9, #12, #13, #16) ya asumen esos nombres exactos al
  consumir los recursos. Sirve a: R6, R10, R14.

- **TTL sobre `expires_at` vía `UpdateTimeToLive` tras `CreateTable`**: la
  API de DynamoDB no permite fijar TTL en la misma llamada de creación;
  el script encadena `CreateTable` (o detecta que ya existe) y luego
  `UpdateTimeToLive` (idempotente: reaplicar la misma configuración no
  falla). Sirve a: R11.

- **Verificación de "nunca AWS real" sin credenciales reales**: no se puede
  probar negativamente "esto nunca llamó a AWS real" con una llamada de red
  (no hay credenciales reales para intentarlo, y no queremos intentarlo).
  La verificación es estática: (a) grep de `amazonaws.com` sobre el código
  de esta feature (R15), y (b) revisión de que el `endpoint` se pasa
  explícitamente a cada cliente SDK v3 en la construcción — el SDK v3 solo
  usa el endpoint público de AWS si `endpoint` queda `undefined`, así que
  R2 (abortar si `AWS_ENDPOINT_URL` falta) es la salvaguarda en runtime que
  complementa la revisión estática. Sirve a: R2, R15.

## Archivos afectados

- `backend-pet-tracker/src/aws/aws-clients.ts` (o `aws.providers.ts`) —
  infraestructura compartida (fuera de un módulo de feature, análoga a
  `src/db/`): factories que construyen `SQSClient`, `DynamoDBClient`,
  `S3Client`, `EventBridgeClient` desde `ConfigService`.
- `backend-pet-tracker/src/aws/aws.module.ts` — módulo NestJS que exporta
  los 4 clientes con tokens de inyección (mismo patrón de tokens que
  `docs/conventions.md` exige para repositorios), para que módulos futuros
  los importen.
- `backend-pet-tracker/src/aws/constants.ts` — nombres de recursos
  (colas, tabla, bucket, bus) como constantes exportadas, no strings
  repetidos entre el script de provisioning y los módulos que los
  consumirán después (evita typos entre "quien crea" y "quien usa").
- `backend-pet-tracker/scripts/provision-local.ts` — script standalone,
  fuera de `src/`: orquesta la creación idempotente de los 4 recursos SQS,
  la tabla DynamoDB + TTL, el bucket S3 y el bus EventBridge, reutilizando
  `src/aws/aws-clients.ts` y `src/aws/constants.ts`.
- `backend-pet-tracker/package.json` — nuevas dependencias
  (`@aws-sdk/client-sqs`, `@aws-sdk/client-dynamodb`,
  `@aws-sdk/client-s3`, `@aws-sdk/client-eventbridge`, `dotenv` si no está
  ya disponible transitivamente) y script `provision:local`.
- `STATUS.md` — sección "Cómo arrancar" ampliada con
  `pnpm run provision:local` y el comando de verificación manual (R17).
- `docs/conventions.md` — actualizar el estado de `AWS_ENDPOINT_URL`,
  `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` de "sin uso
  todavía" a su uso real por esta feature (cambio menor de documentación,
  no de código).

## Imports: alias `@/*`

`docs/conventions.md` §Imports fija `@/* -> src/*` como el alias a usar para
cualquier import que cruce de módulo (ya resuelto en build vía `tsc-alias`,
en Jest vía `moduleNameMapper`, y en scripts standalone vía `ts-node -r
tsconfig-paths/register`, sin trabajo adicional de esta feature). Aplica así:

- Dentro de `src/aws/`: `aws.module.ts` importa `aws-clients.ts` y
  `constants.ts` con import relativo (`./aws-clients`, `./constants`) —
  mismo directorio, no cruza módulo.
- Cualquier módulo futuro que consuma los tokens de `src/aws/` (fuera de
  `src/aws/` mismo) debe importarlos vía `@/aws/aws.module` o
  `@/aws/constants`, nunca con `../../aws/...`.
- `scripts/provision-local.ts` vive fuera de `src/`, así que sus imports a
  `src/aws/aws-clients.ts` y `src/aws/constants.ts` usan el alias
  (`@/aws/aws-clients`, `@/aws/constants`), y el script se invoca como
  `ts-node -r tsconfig-paths/register scripts/provision-local.ts` en el
  `package.json` script `provision:local` (no como `ts-node
  scripts/provision-local.ts` a secas, que no resolvería `@/`).

## Alternativas descartadas

- **Terraform / CDK Local para provisionar LocalStack**: añade una
  herramienta y un lenguaje de configuración adicional (HCL o CDK) para un
  entorno de desarrollo local con 8 recursos. El AWS SDK v3 directo en
  TypeScript mantiene todo en el mismo lenguaje/stack que el resto del
  backend y es más fácil de depurar por el implementer sin herramientas
  nuevas. Se descarta por ahora; puede reconsiderarse si el número de
  recursos crece mucho o si se necesita paridad estricta con un IaC de
  despliegue real.
- **`awslocal` (CLI wrapper de LocalStack) invocado desde un script bash**:
  más simple de escribir a mano, pero no es TypeScript tipado, no comparte
  código con `src/aws/` (que sí necesita clientes SDK v3 para uso en
  runtime de la app), y complica el chequeo de idempotencia con parsing de
  stdout en vez de excepciones tipadas del SDK. Se descarta.
- **Verificar-antes-de-crear con `list-queues`/`describe-table`/etc. previo
  a cada creación**: alternativa válida a "crear y capturar duplicado", más
  explícita pero con más llamadas de red y más código de ramificación por
  recurso. Se descarta a favor de la opción con menos superficie, ver
  decisión de idempotencia arriba.
- **Sufijo de entorno en los nombres de colas/tabla/bus (ej.
  `positions-raw-local`)**: se descarta porque el `acceptance_criteria` de
  la feature y las specs futuras que consumen estos recursos (#8, #9, #12,
  #13, #16) ya fijan los nombres sin sufijo; añadirlo rompería esa
  trazabilidad y no aporta valor en un entorno donde ya "todo es local".
- **Ejecutar el script de provisioning dentro del bootstrap de NestJS
  (`AppModule` + `ConfigService` real)**: se descarta porque forzaría
  levantar Postgres y todo el árbol de módulos de la app solo para crear
  recursos AWS, acoplando dos infraestructuras independientes y haciendo
  el script más lento y más frágil (falla si Postgres no está arriba,
  aunque LocalStack sí lo esté).
