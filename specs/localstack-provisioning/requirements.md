---
feature: "localstack-provisioning"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[localstack-provisioning]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Contexto: `docs/architecture.md` establece que en local **ningún código
> apunta a AWS real** — todo cliente AWS SDK se construye con
> `AWS_ENDPOINT_URL` del env. `docker-compose.yml` levanta LocalStack con la
> imagen `localstack/localstack:latest` (community, sin `SERVICES`
> restringido — sqs, dynamodb, s3 y events están disponibles por defecto).
> `docs/data-model.md` ya fija el modelo de la tabla `positions` (pk
> `PET#<petId>`, sk epoch ms, TTL sobre `expires_at`). Las variables
> `AWS_ENDPOINT_URL`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`,
> `AWS_SECRET_ACCESS_KEY` ya existen en `.env.example` (creadas antes de esta
> feature, marcadas "sin uso todavía" en `docs/conventions.md`) — esta
> feature es la primera en consumirlas.

## Requisitos funcionales

### Cliente AWS SDK v3 / configuración

- **R1**: WHEN se instancia cualquier cliente AWS SDK v3 (SQS, DynamoDB,
  S3, EventBridge) dentro de la app NestJS (`backend-pet-tracker/src/aws/`,
  consumido por módulos futuros) THE SYSTEM SHALL construirlo con
  `endpoint` igual al valor de `AWS_ENDPOINT_URL` leído vía `ConfigService`
  (nunca `process.env` directo fuera de la configuración, según
  `docs/conventions.md`). El script standalone de provisioning
  (`scripts/provision-local.ts`) corre fuera del bootstrap de Nest —igual
  que `drizzle.config.ts`— y lee `AWS_ENDPOINT_URL` de `process.env` tras
  cargar el `.env` raíz explícitamente (dotenv o equivalente); esta
  excepción se documenta en `design.md`.
- **R2**: IF la variable de entorno `AWS_ENDPOINT_URL` no está definida (o
  está vacía) al arrancar el script de provisioning THEN THE SYSTEM SHALL
  abortar con un error explícito antes de crear ningún recurso, sin
  intentar un endpoint por defecto de AWS real.
- **R3**: WHEN se construyen los clientes AWS SDK v3 (dentro de la app vía
  `ConfigService`, o en el script standalone vía `process.env` cargado
  desde el `.env` raíz) THE SYSTEM SHALL usar credenciales leídas de
  `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (valores dummy tipo `test`
  en LocalStack) y la región de `AWS_REGION` — verificable inspeccionando
  el código: cero literales de endpoint `amazonaws.com` o de región
  hardcodeada en `backend-pet-tracker/src/aws/` y en el script de
  provisioning.

### Idempotencia del script

- **R4**: WHEN se ejecuta `pnpm run provision:local` sobre un LocalStack
  limpio (sin los recursos de esta feature) THE SYSTEM SHALL crear las 4
  colas SQS, la tabla DynamoDB `positions`, el bucket S3 de media y el bus
  EventBridge `pet-tracker`, y terminar con código de salida 0.
- **R5**: WHEN se ejecuta `pnpm run provision:local` una segunda vez
  inmediatamente después de una corrida exitosa (mismos recursos ya
  existentes) THE SYSTEM SHALL detectar que cada recurso ya existe (ej.
  capturando `QueueAlreadyExists` / `ResourceInUseException` /
  `BucketAlreadyOwnedByYou` o verificando existencia antes de crear) y
  terminar con código de salida 0, sin duplicar recursos ni lanzar una
  excepción no controlada.

### Colas SQS

- **R6**: WHEN el script de provisioning corre exitosamente THE SYSTEM
  SHALL haber creado exactamente 4 colas SQS: `positions-raw`,
  `positions-raw-dlq`, `notifications`, `notifications-dlq` — verificable
  con `aws --endpoint-url=$AWS_ENDPOINT_URL sqs list-queues` mostrando las 4
  URLs.
- **R7**: WHEN se crea la cola `positions-raw` THE SYSTEM SHALL
  configurarle una `RedrivePolicy` que apunte al ARN de
  `positions-raw-dlq` con `maxReceiveCount` definido (valor concreto fijado
  en `design.md`) — verificable con `aws sqs get-queue-attributes
  --attribute-names RedrivePolicy` sobre `positions-raw`.
- **R8**: WHEN se crea la cola `notifications` THE SYSTEM SHALL
  configurarle una `RedrivePolicy` que apunte al ARN de
  `notifications-dlq` con `maxReceiveCount` definido — verificable con `aws
  sqs get-queue-attributes --attribute-names RedrivePolicy` sobre
  `notifications`.
- **R9**: IF una cola DLQ (`positions-raw-dlq` o `notifications-dlq`) no
  existe todavía al momento de configurar la `RedrivePolicy` de su cola
  principal THEN THE SYSTEM SHALL crear primero la DLQ correspondiente
  (orden de creación: DLQ antes que la cola principal que la referencia).

### Tabla DynamoDB `positions`

- **R10**: WHEN el script de provisioning corre exitosamente THE SYSTEM
  SHALL haber creado la tabla DynamoDB `positions` con clave de partición
  `pk` (String) y clave de ordenación `sk` (Number), fiel al modelo de
  `docs/data-model.md` — verificable con `aws dynamodb describe-table
  --table-name positions` mostrando `KeySchema` con `pk` (HASH) y `sk`
  (RANGE).
- **R11**: WHEN el script de provisioning corre exitosamente THE SYSTEM
  SHALL haber habilitado TTL en la tabla `positions` sobre el atributo
  `expires_at` — verificable con `aws dynamodb describe-time-to-live
  --table-name positions` mostrando `AttributeName: expires_at` y
  `TimeToLiveStatus: ENABLED`.

### Bucket S3 de media

- **R12**: WHEN el script de provisioning corre exitosamente THE SYSTEM
  SHALL haber creado un bucket S3 para media de mascotas (nombre fijado en
  `design.md`) — verificable con `aws --endpoint-url=$AWS_ENDPOINT_URL s3api
  list-buckets` mostrando el bucket.
- **R13**: WHEN se crea el bucket S3 de media THE SYSTEM SHALL dejarlo sin
  política de acceso público (los objetos se sirven después vía URLs
  prefirmadas, feature #6 `pet-photos-s3`, fuera de alcance aquí) —
  verificable con `aws s3api get-public-access-block` mostrando los 4 flags
  de bloqueo en `true`, o ausencia de cualquier bucket-policy que otorgue
  acceso público.

### Bus EventBridge

- **R14**: WHEN el script de provisioning corre exitosamente THE SYSTEM
  SHALL haber creado un bus de eventos EventBridge llamado `pet-tracker` —
  verificable con `aws --endpoint-url=$AWS_ENDPOINT_URL events list-event-buses`
  mostrando un bus con `Name: pet-tracker`.

### Aislamiento de AWS real

- **R15**: WHEN se audita el código de `backend-pet-tracker/scripts/provision-local.ts`
  y `backend-pet-tracker/src/aws/` THE SYSTEM SHALL no contener ningún
  literal de endpoint de AWS real (`amazonaws.com`) ni credenciales que no
  provengan de variables de entorno — verificable con `grep -rn
  "amazonaws.com" backend-pet-tracker/scripts/provision-local.ts
  backend-pet-tracker/src/aws/` devolviendo cero resultados.
- **R16**: IF el script de provisioning se invoca sin que LocalStack esté
  levantado (endpoint inalcanzable) THEN THE SYSTEM SHALL fallar con un
  mensaje de error claro que identifique el problema de conexión (no un
  stack trace crudo sin contexto) y código de salida distinto de 0.

### Documentación

- **R17**: WHEN se completa esta feature THE SYSTEM SHALL documentar en
  `STATUS.md` los pasos para arrancar LocalStack y correr el provisioning
  (`docker compose up -d` + `pnpm run provision:local`) y el comando de
  verificación manual (`aws --endpoint-url=http://localhost:4566 sqs
  list-queues`) — verificable leyendo `STATUS.md` y confirmando que ambos
  comandos aparecen documentados.

### Convención de imports

- **R18**: WHEN cualquier archivo fuera de `src/aws/` importa algo de
  `src/aws/` (ej. un módulo futuro inyectando los tokens de clientes AWS, o
  `scripts/provision-local.ts` importando las factories/constantes) THE
  SYSTEM SHALL usar el alias `@/aws/...` (`docs/conventions.md`
  §Imports), nunca una ruta relativa con `../`. Dentro de `src/aws/`
  (archivos hermanos en el mismo directorio) se usa import relativo.
  Verificable con `grep -rn "from '\.\./.*aws" backend-pet-tracker/src
  backend-pet-tracker/scripts` devolviendo cero resultados fuera de
  `src/aws/` mismo.
- **R19**: WHEN se ejecuta `pnpm run provision:local` THE SYSTEM SHALL
  invocar el script con `ts-node -r tsconfig-paths/register` (no `ts-node`
  a secas) para que los imports `@/aws/...` del script standalone resuelvan
  en runtime — verificable corriendo `pnpm run provision:local` contra
  LocalStack levantado y confirmando que no falla con `Cannot find module
  '@/aws/...'`.

## Fuera de alcance

- El pipeline de ingestión Wialon (poller, consumidor SQS, escritura en
  DynamoDB, emisión de eventos a EventBridge) — eso es la feature #8
  `wialon-ingestion-pipeline`. Esta feature solo aprovisiona los recursos
  vacíos, no los usa.
- Las URLs prefirmadas de S3 y el endpoint de subida de fotos — feature #6
  `pet-photos-s3`.
- El consumo real de las colas `notifications` y `positions-raw` (workers,
  notifier) — features #12 `alerts-engine` y #13 `alerts-center-notifier`.
- Políticas IAM / permisos granulares por recurso: LocalStack community no
  las aplica de forma realista: se usan las credenciales dummy globales.
- Borrado/destrucción de recursos (`provision:local:destroy` o similar) —
  no pedido por `acceptance_criteria`; puede añadirse en una feature futura
  si se necesita.
- Cifrado en reposo, versionado de bucket S3, replicación o cualquier
  configuración de producción — irrelevante en LocalStack local.
- Cualquier despliegue contra AWS real (Terraform/CDK) — esta feature es
  100% local; el camino a AWS real queda documentado como nota, no
  implementado.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
