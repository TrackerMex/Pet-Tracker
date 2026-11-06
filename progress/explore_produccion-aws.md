# explore: produccion-aws
Fecha: 2026-11-06

Árbol leído: `/home/claude/sites/Pet-Tracker-wt-prod`, rama `docs/plan-produccion-aws`,
HEAD `aacfab9a` (= `origin/dev`). Solo lectura: no se corrió `init.sh`, ni tests,
ni se tocó AWS. Rutas relativas a la raíz del repo salvo que se indique.
`graphify-out/graph.json` no existe en este worktree; todo sale de lectura directa.

Decisiones ya tomadas (no se reabren aquí): ECS Fargate, una imagen y dos
servicios (API + workers), mx-central-1 primaria con us-east-2 en pilot light,
Aurora PostgreSQL Serverless v2 >= 16.4, CDK v2 en `infra/`.

---

## 1. Configuración

### Cómo se carga
- `ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../.env'] })` en
  `backend-pet-tracker/src/config/config.module.ts:4,12-15`. **No hay
  `validate` ni `validationSchema`**: Nest no valida nada al arrancar. Si
  `../.env` no existe (caso de un contenedor), `@nestjs/config` lo ignora y usa
  `process.env`; las variables de la task definition llegan igual.
- `main.ts` lee `PORT` con `process.env` directo (`src/main.ts:7`); el resto pasa
  por `ConfigService`.

### Inventario (runtime Nest)

| Variable | Dónde | Obligatoria | Default en código | Secreto | Nota |
|---|---|---|---|---|---|
| `PORT` | `src/main.ts:7` | no | `3000` | no | |
| `NODE_ENV` | 5 schedulers (`*-scheduler.service.ts`), `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts:9`, `src/aws/resource-names.ts:127,134` | no | ninguno | no | Solo importa el literal `test`: apaga workers e IA y añade sufijo `-test` a recursos en modo local |
| `DATABASE_URL` | `src/db/drizzle.module.ts:33` | **sí, de facto** | ninguno (`pg` cae a `PG*`/localhost) | **sí** (lleva password) | Sin validación: arranca y falla en la primera query |
| `JWT_SECRET` | `src/modules/auth/infrastructure/security/jwt-token-service.ts:26` | **sí** (`getOrThrow`) | — | **sí** | Única variable que tumba el arranque si falta |
| `AWS_MODE` | `src/aws/aws-clients.ts:109`, `src/aws/resource-names.ts:118` | no | `local` (todo lo que no sea `aws`) | no | Ver §2 |
| `AWS_ENDPOINT_URL` | `src/aws/aws-clients.ts:110` | solo local | `''` | no | En `aws` debe **no** existir (lanza) |
| `AWS_PRESIGN_ENDPOINT_URL` | `src/aws/aws-clients.ts:111-113` | no | `''` | no | Solo modo local |
| `AWS_REGION` | `src/aws/aws-clients.ts:119` | no en `aws` | `''` → en `aws` se omite y el SDK resuelve | no | Fargate inyecta `AWS_REGION` y `AWS_DEFAULT_REGION` solo |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | `src/aws/aws-clients.ts:120-121` | solo local | `''` | sí (en local son `test`) | En `aws` se ignoran en código, pero el SDK los leería de `process.env` si existieran |
| `MEDIA_BUCKET_NAME` | `src/aws/resource-names.ts:121-123` | **sí con `AWS_MODE=aws`** | — | no | Lanza `MissingMediaBucketNameError` / `LocalMediaBucketNameError` (`:36-73`) al construir el provider, o sea al arrancar |
| `POLLER_ENABLED` | `src/workers/ingestion-scheduler.service.ts:55` | no | apagado (solo `'true'` enciende) | no | |
| `ACTIVITY_AGGREGATOR_ENABLED` | `src/modules/activity/infrastructure/activity-scheduler.service.ts:57` | no | apagado | no | |
| `ALERTS_ENGINE_ENABLED` | `src/workers/alerts-engine/alerts-engine-scheduler.service.ts:49` | no | apagado | no | |
| `NOTIFIER_ENABLED` | `src/workers/notifier/notifier-scheduler.service.ts:49` | no | apagado | no | |
| `REMINDERS_ENABLED` | `src/modules/reminders/infrastructure/reminders-scheduler.service.ts:37` | no | apagado | no | |
| `PUSH_ENABLED` | `src/workers/notifier/notifier.module.ts:31` | no | apagado → `ConsolePushSender` | no | |
| `SIM_MODE` | `src/integrations/wialon/wialon.factory.ts:22` | no | fake salvo literal `'false'` | no | |
| `WIALON_TOKEN` | `src/integrations/wialon/wialon.factory.ts:23` | no | `PENDING`/vacío → fake | **sí** | |
| `WIALON_BASE_URL` | `src/integrations/wialon/wialon.factory.ts:31` | no | `https://hst-api.wialon.com/wialon/ajax.html` (`:7-8`) | no | |
| `SIM_SEED`, `SIM_HOME_LAT`, `SIM_HOME_LNG` | `src/integrations/wialon/wialon.factory.ts:36-38,47` | no | `1`, `19.4326`, `-99.1332` (`:9-11`) | no | Solo simulador |
| `EMAIL_ENABLED` | `src/modules/auth/auth.module.ts:66,79` | no | apagado → adaptadores de consola | no | |
| `RESEND_API_KEY` | `src/modules/auth/auth.module.ts:69,82` | sí si `EMAIL_ENABLED=true` | `''` (no valida) | **sí** | |
| `RESEND_FROM` | `src/modules/auth/auth.module.ts:70,83` | sí si `EMAIL_ENABLED=true` | `''` (no valida) | no | |
| `RESET_LINK_HOST` | `src/modules/auth/auth.module.ts:85,88` | sí si email real | `''` / `null` | no | |
| `ANTHROPIC_ENABLED` | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts:11` | no | apagado → `NullNutritionExplainer` | no | |
| `ANTHROPIC_API_KEY` | `.../nutrition-explainer.factory.ts:13` | sí si IA encendida | `PENDING` → null | **sí** | Degrada a null, no falla |
| `ANTHROPIC_MODEL` | `.../nutrition-explainer.factory.ts:20` | sí si IA encendida | vacío → null | no | `.env.example:108` = `claude-haiku-5-5` |

Fuera del runtime Nest (scripts/CLI): `DATABASE_URL` en `drizzle.config.ts:17-28`
(carga `../.env` con dotenv y **lanza** si falta), y `process.env.DATABASE_URL` en
`scripts/seed-vaccines.ts:8`, `scripts/seed-devices.ts:71`,
`scripts/provision-device.ts:123`, `scripts/set-device-subscription.ts:145`,
`scripts/backfill-weights.ts:52`; `AWS_*` en `scripts/provision-local.ts:12`
vía `resolveAwsConfigFromEnv` (`src/aws/aws-clients.ts:82-97`).

Plantilla de referencia: `.env.example` (raíz, 108 líneas). Lo que **no** está
ahí y el backend lee: `NODE_ENV`, `MEDIA_BUCKET_NAME` (comentada, `:45`),
`AWS_PRESIGN_ENDPOINT_URL` (comentada, `:55`).

### Qué valida al arrancar y qué no
- Lanza al construir providers (antes de `listen`): `JWT_SECRET` ausente;
  `AWS_MODE=aws` con `AWS_ENDPOINT_URL` no vacío
  (`UnexpectedAwsEndpointError`, `src/aws/aws-clients.ts:41-53,62-67,117`);
  `AWS_MODE=aws` sin `MEDIA_BUCKET_NAME` o con nombre `-local`
  (`src/aws/resource-names.ts:63-73`).
- No valida: `DATABASE_URL` (ni formato ni conectividad; el pool es perezoso),
  credenciales de Resend/Anthropic/Wialon (degradan a fake/consola/null en
  silencio salvo un warning), existencia de colas/tabla/bus (se descubren en la
  primera llamada).
- No hay `NODE_ENV=production` con efecto: ningún código lo distingue.

---

## 2. Acoplamiento a LocalStack / AWS real

### `AWS_MODE` y la guarda de endpoint
- `resolveAwsMode` (`src/aws/aws-clients.ts:69-71`): solo el literal `aws`
  (case-insensitive, con trim) activa el modo real; todo lo demás es `local`.
- Runtime Nest: `resolveAwsConfigFromConfigService` (`src/aws/aws-clients.ts:106-123`).
  En `aws` llama a `assertNoEndpoint` (`:62-67`): si `AWS_ENDPOINT_URL` tiene
  valor lanza `UnexpectedAwsEndpointError` (`:41-53`). El motivo está en el
  propio mensaje: el SDK v3 lee `AWS_ENDPOINT_URL` de `process.env` por su
  cuenta, así que basta con que exista para desviar el tráfico.
- `resolveAwsClientOptions` (`src/aws/aws-clients.ts:134-149`): en `aws` devuelve
  `{}` o `{ region }` — **sin `endpoint` ni `credentials`**, así que el SDK usa su
  cadena por defecto. En Fargate esa cadena encuentra el task role por
  `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI`, que ECS inyecta solo.
  S3 en `aws` no fuerza path-style (`:159-173`).
- Los 4 clientes (SQS, DynamoDB, S3, EventBridge) se construyen una vez en
  `src/aws/aws.module.ts:30-61` (`@Global`).

**Para Fargate basta, a nivel de código, con:** `AWS_MODE=aws`,
`MEDIA_BUCKET_NAME=<bucket real>`, y **no** definir `AWS_ENDPOINT_URL`,
`AWS_ACCESS_KEY_ID` ni `AWS_SECRET_ACCESS_KEY` en la task definition (las
credenciales estáticas ganarían al task role en la cadena del SDK, ver
`.env.example:30-34`). `AWS_REGION` lo inyecta Fargate. Riesgo: la imagen no
debe llevar un `.env` copiado; `ConfigModule` lo cargaría desde `../.env`
(`src/config/config.module.ts:4`) si existiera junto al `dist/`.

### Nombres de recursos
Todos fijos en `backend-pet-tracker/src/aws/constants.ts`, salvo el bucket:

| Recurso | Constante | Valor | ¿De env? |
|---|---|---|---|
| Cola posiciones | `QUEUE_POSITIONS_RAW` (`:9`) | `positions-raw` | no |
| DLQ | `QUEUE_POSITIONS_RAW_DLQ` (`:10`) | `positions-raw-dlq` | no |
| Cola notificaciones | `QUEUE_NOTIFICATIONS` (`:11`) | `notifications` | no |
| DLQ | `QUEUE_NOTIFICATIONS_DLQ` (`:12`) | `notifications-dlq` | no |
| Cola geocercas | `QUEUE_GEOFENCE_EVENTS` (`:16`) | `geofence-events` | no |
| DLQ | `QUEUE_GEOFENCE_EVENTS_DLQ` (`:17`) | `geofence-events-dlq` | no |
| Regla EventBridge | `RULE_GEOFENCE_EVENTS` (`:21`) | `geofence-events` | no |
| Tabla DynamoDB | `TABLE_POSITIONS` (`:29`), pk/sk/ttl (`:30-32`) | `positions` (`pk` S, `sk` N, `expires_at`) | no |
| Bus | `EVENT_BUS_NAME` (`:45`) | `pet-tracker` | no |
| Bucket | `BUCKET_MEDIA_BASE` (`:36`) | local: `pet-tracker-media-local` (`:42`); aws: **`MEDIA_BUCKET_NAME`** | **sí** (`src/aws/resource-names.ts:120-130`) |

- En modo `aws` el sufijo es siempre `''` (`src/aws/resource-names.ts:90-96`):
  no hay forma de prefijar por entorno (`prod-`, `dev-`) sin tocar código. Si
  dev y prod comparten cuenta y región, **chocarían** colas, tabla y bus. Con
  regiones distintas (dev en us-east-1, prod en mx-central-1) no chocan, porque
  SQS/DynamoDB/EventBridge tienen nombres por región; el bucket sí es global y
  por eso ya viene de env.
- Las URLs de cola no se configuran: cada consumidor hace `GetQueueUrl` por
  nombre y la cachea en memoria (`src/workers/poller.service.ts:152-166`,
  `src/workers/positions-consumer.service.ts:359`,
  `src/workers/notifier/notifier-consumer.service.ts:292`,
  `src/workers/alerts-engine/alerts-engine-consumer.service.ts:437`,
  `src/modules/reminders/infrastructure/reminders-dispatch.service.ts:76-87`).
  El task role necesita `sqs:GetQueueUrl` además de send/receive/delete.
- El script `scripts/provision-local.ts` (`resolveAwsConfigFromEnv`,
  `src/aws/aws-clients.ts:82-97`) **exige** endpoint en local y lo prohíbe en
  `aws`: no sirve para crear recursos en producción (eso es CDK).

## 3. Base de datos

### Pool y TLS
- `new Pool({ connectionString: config.get('DATABASE_URL') })` sin más opciones
  (`src/db/drizzle.module.ts:32-34`): ni `ssl`, ni `max`, ni timeouts. Defaults de
  `pg@8.22.0` (lockfile `backend-pet-tracker/pnpm-lock.yaml:3422`): `max: 10`,
  `idleTimeoutMillis: 30000` (`pg/lib/defaults.js:42,46`, leído en la instalación
  de `/home/claude/sites/Pet-Tracker`, misma versión). Con N tareas de API + 1 de
  workers son `10·(N+1)` conexiones contra el `max_connections` que dé el mínimo
  de ACU de Aurora.
- Errores del cliente ocioso se loguean (`src/db/drizzle.module.ts:35-37`); el
  pool se cierra en `onModuleDestroy` (`:17-22`), que **solo corre si hay
  shutdown hooks** (ver §5).
- **TLS sin tocar código: sí, por la connection string.** `pg-connection-string@2.14.0`
  (`pnpm-lock.yaml:3403`; leído en `.../pg-connection-string/index.js:77-149,219-227`):
  - `sslrootcert=<ruta>` lee el fichero y lo pone en `ssl.ca` (`:98-99`).
  - `sslmode=require|prefer|verify-ca` se tratan como **`verify-full`** con un
    warning de deprecación (`:139-149,222`), salvo `uselibpqcompat=true`.
  - Consecuencia: `?sslmode=verify-full&sslrootcert=/ruta/global-bundle.pem`
    funciona si la imagen lleva el bundle de CA de RDS. Con `sslmode=require` a
    secas, Node valida contra su almacén por defecto, que (hasta donde sé, no
    verificado aquí) **no** incluye la CA de RDS → fallo de handshake.
    Alternativa: `NODE_EXTRA_CA_CERTS=/ruta/global-bundle.pem`.
- `pg` también acepta `PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT/PGSSLMODE` si
  `connectionString` es `undefined` (`pg/lib/connection-parameters.js:25-34,85`).
  Útil porque el secreto gestionado de RDS es un JSON con campos sueltos, no una
  URL; pero `drizzle.config.ts:21-28` y los scripts exigen `DATABASE_URL`.

### Migraciones hoy
- `pnpm db:migrate` = `drizzle-kit migrate` (`backend-pet-tracker/package.json:22`),
  con `drizzle.config.ts` (carga `../.env`, lanza sin `DATABASE_URL`,
  `out: 'src/db/migrations'`, `:17-36`). 24 migraciones `0000`–`0023` en
  `src/db/migrations/` con `meta/_journal.json`.
- Se invoca en el harness: `init.config.sh:36`
  (`db:migrate && seed:vaccines && provision:local`).
- `drizzle-kit` es **devDependency** (`package.json:66`) y los `.sql` **no se
  copian a `dist/`** (no hay `assets` en `nest-cli.json`; verificado en el `dist/`
  de `/home/claude/sites/Pet-Tracker/backend-pet-tracker/dist/src/db/`, sin
  `migrations/`, con configuración de build idéntica a este HEAD:
  `git diff main HEAD -- tsconfig*.json nest-cli.json package.json` vacío).
- Ninguna migración necesita extensiones (`CREATE EXTENSION` = 0); solo usa
  `gen_random_uuid()` (`0023_vaccine_catalog_data.sql`), nativo desde PG13.
- Local corre **Postgres 17** (`docker-compose.yml:6`); prod sería Aurora 16.x.
  No encontré SQL exclusivo de 17 (`JSON_TABLE`, `MERGE`) en migraciones ni en
  `src/`.

### Qué haría falta para una tarea única de ECS
Opciones (no decido):
1. Meter `drizzle-kit` + `drizzle.config.ts` + `src/db/migrations/` en la imagen
   y usar como comando `drizzle-kit migrate`. Arrastra una devDependency.
2. Un script runtime con `migrate()` de `drizzle-orm/node-postgres/migrator`
   (`drizzle-orm` ya es dependencia de producción, `package.json:45`) apuntando a
   la carpeta de migraciones copiada a la imagen. Usa la misma tabla de journal
   que `drizzle-kit migrate`; habría que confirmarlo contra la base de dev antes
   (ver memoria del leader sobre journal desincronizado).
En ambos casos la imagen debe incluir `src/db/migrations/**` (SQL + `meta/`).

### Seeds y scripts
| Script | Invocación | Qué hace | ¿Hace falta en prod? |
|---|---|---|---|
| `scripts/seed-vaccines.ts` | `pnpm seed:vaccines` (`package.json:27`), ts-node | Inserta catálogo de vacunas | **Redundante**: desde #226 lo hace la migración `0023_vaccine_catalog_data.sql:2` con `DO NOTHING` |
| `scripts/seed-devices.ts` | `pnpm seed:devices` (`:25`) | Devices **simulados** + suscripción activa | No (solo dev/sim) |
| `scripts/provision-device.ts` | `pnpm provision:device -- --unit-id …` (`:24`; args `:102-117`) | Alta de un collar real; exige cliente Wialon real (`:120-121`) | Sí, operación manual por collar |
| `scripts/set-device-subscription.ts` | `pnpm subscription:set` (`:26`) | Cambia suscripción de un device | Operación manual |
| `scripts/backfill-weights.ts` | `pnpm backfill:weights` (`:28`) | Backfill puntual | Según estado de datos |
| `scripts/provision-local.ts` | `pnpm provision:local` (`:23`) | Crea colas/tabla/bus/bucket en LocalStack; prohíbe modo `aws` | No (CDK) |

Todos cargan `../.env` con dotenv y leen `process.env.DATABASE_URL`. Se compilan a
`dist/scripts/*.js` (el build no excluye `scripts/`, `tsconfig.build.json:3`), así
que se podrían correr con `node dist/scripts/<x>.js` sin ts-node, pero no está
probado.

## 4. Workers

Todo se registra en `onApplicationBootstrap` con
`SchedulerRegistry.addInterval` + `setInterval`, nunca con `@Cron`/`@Interval`
(`grep` de `@Cron|@Interval|@Timeout|addCronJob` en `src/` = 0 fuera de tests).
`ScheduleModule.forRoot()` en `src/app.module.ts:30`. Cada uno exige su flag
`=== 'true'` **y** `NODE_ENV !== 'test'`.

| Worker | Qué hace | Cadencia | Flag | Evidencia |
|---|---|---|---|---|
| Poller Wialon | Lee posiciones de Wialon (o del simulador) por dispositivo asignado y publica en `positions-raw`; avanza watermark en Postgres | 60 s | `POLLER_ENABLED` | `src/workers/ingestion-scheduler.service.ts:9,38-41,53-57`; watermark `src/workers/poller.service.ts:140-148` |
| Consumidor `positions-raw` | BatchWrite en DynamoDB `positions`, actualiza cache en `devices`/`pets`, publica `position.updated`/`battery.low` al bus | 15 s | `POLLER_ENABLED` (el mismo) | `src/workers/ingestion-scheduler.service.ts:10,42-45`; `src/workers/positions-consumer.service.ts:254,277,293-346` |
| Alerts-engine | Drena `geofence-events`, evalúa geocercas y batería | 60 s | `ALERTS_ENGINE_ENABLED` | `src/workers/alerts-engine/alerts-engine-scheduler.service.ts:9,33-37,49` |
| Notifier | Drena `notifications` y manda push (Expo o consola) | 60 s | `NOTIFIER_ENABLED` (+ `PUSH_ENABLED` elige sender) | `src/workers/notifier/notifier-scheduler.service.ts:36-38,49`; `src/workers/notifier/notifier.constants.ts:3`; `src/workers/notifier/notifier.module.ts:28-32` |
| Dispatcher de reminders | Busca recordatorios vencidos en Postgres y los encola en `notifications` | 60 s | `REMINDERS_ENABLED` | `src/modules/reminders/infrastructure/reminders-scheduler.service.ts:23-29,35-39`; `.../reminders.constants.ts:1` |
| Agregador de actividad | Cada hora computa el último día local cerrado por mascota y hace upsert en `activity_daily` | 1 h | `ACTIVITY_AGGREGATOR_ENABLED` | `src/modules/activity/infrastructure/activity-scheduler.service.ts:38-44,55-60`; `src/modules/activity/activity.constants.ts:26` |

**Para el servicio de workers** hacen falta los **cinco** flags, no dos:
`POLLER_ENABLED`, `ALERTS_ENGINE_ENABLED`, `NOTIFIER_ENABLED`,
`REMINDERS_ENABLED`, `ACTIVITY_AGGREGATOR_ENABLED` (el "flag propio del scheduler
de actividad" es este último). Más `PUSH_ENABLED=true` para push real y
`SIM_MODE=false` + `WIALON_TOKEN` para Wialon real.

**Dos réplicas de la API con los flags apagados:** no corre ningún worker. No
hay nada que se registre siempre. Lo que sí se duplica por réplica es estado
en memoria que no es un worker (ver §5, rate limit de email).

**Si dos tareas de workers coinciden** (p. ej. durante un despliegue rolling de
ECS con `minimumHealthyPercent=100`, el default):
- Poller: publica dos veces el mismo tramo; el consumidor es idempotente por
  `sk` en DynamoDB (`src/workers/positions-consumer.service.ts:293-346`) y los
  updates de cache solo avanzan si el ts es más reciente
  (`src/workers/ingestion.drizzle.store.ts:97-105`). Pero publica eventos
  duplicados al bus.
- Consumidores SQS (posiciones, alerts-engine, notifier): seguros entre sí por
  la visibilidad de SQS; alerts-engine tiene índice único anti-spam
  (`src/db/schema/alerts.schema.ts:58`).
- **Reminders: no es seguro.** `findDue` lee filas `enqueued_at IS NULL`, envía
  a SQS y luego hace `markEnqueued`, sin `FOR UPDATE SKIP LOCKED` ni update
  condicional (`src/modules/reminders/infrastructure/repositories/reminder.drizzle.repository.ts:97-126`,
  `src/modules/reminders/infrastructure/reminders-dispatch.service.ts:41-64`).
  Dos tareas en el mismo minuto mandan el push dos veces.
- Agregador de actividad: upsert (`onConflictDoUpdate`,
  `src/modules/activity/infrastructure/repositories/activity.drizzle.store.ts:126`),
  idempotente.
- Notifier: no deduplica; depende de que SQS entregue cada mensaje a un solo
  consumidor (at-least-once).

El comentario de `.env.example:91` llama al de reminders "dispatcher **local**":
sugiere que en AWS se pensó otro mecanismo (EventBridge Scheduler). No hay
código para eso; ver Decisiones abiertas.

## 5. Salud y ciclo de vida

- **Health: `GET /v1/health`**, `@Public()` (sin JWT)
  (`src/modules/health/infrastructure/health.controller.ts:5,9-19`). Ejecuta
  `SELECT 1` contra Postgres
  (`src/modules/health/infrastructure/repositories/database-health.drizzle.repository.ts:11-13`)
  y responde `200 {"postgres":"ok"}` o `503 {"postgres":"error"}`. No comprueba
  SQS, DynamoDB, S3 ni EventBridge. Sin timeout propio: con `pg`
  `connectionTimeoutMillis` por defecto (0) un `SELECT 1` contra una base
  inalcanzable puede colgar hasta el timeout TCP; el timeout del health check
  del ALB lo corta antes.
  Ojo: el módulo `HealthModule` (`src/app.module.ts:14,34`) es el de **salud de
  mascotas** (vacunas, pesos) que además expone este endpoint; el path
  `/v1/health` y `/v1/pets/:id/...` conviven.
- `GET /v1` (`src/app.controller.ts:8-11`) devuelve "Hello Pet Tracker!" pero no
  es `@Public()`, así que el `AuthGuard` global (`src/modules/auth/auth.module.ts:95-98`,
  `APP_GUARD`) lo protege; no sirve como health check.
- **Prefijo y puerto:** `app.setGlobalPrefix('v1')` y
  `listen(process.env.PORT ?? 3000)` (`src/main.ts:6-7`). Escucha en todas las
  interfaces (default de Express).
- **Shutdown: no hay `enableShutdownHooks()`** ni manejador de `SIGTERM`
  (`src/main.ts:4-9`; `grep enableShutdownHooks|SIGTERM` en `src/` = 0). Con
  ECS: al llegar SIGTERM, Node muere sin cerrar el pool
  (`DrizzlePoolLifecycle.onModuleDestroy` no corre) ni esperar al
  `setInterval` en curso. En la API, el draining del ALB amortigua las
  peticiones en vuelo; en workers, un lote a medio drenar vuelve por la
  visibilidad de SQS (at-least-once), y el dispatcher de reminders puede dejar
  un mensaje enviado sin `markEnqueued` → push duplicado al siguiente minuto.
- **CORS:** no se llama a `enableCors` (0 coincidencias). La app es nativa
  (Expo), así que no aplica salvo que aparezca un cliente web.
- **`trust proxy`:** no está configurado. Impacto real: `EmailRateLimitGuard`
  usa `request.ip` como clave de registro
  (`src/modules/auth/infrastructure/guards/email-rate-limit.guard.ts:50-52`).
  Detrás de un ALB, `request.ip` es la IP del nodo del ALB, así que **todos los
  registros comparten el cupo de `REGISTER_MAX_PER_IP = 10`/hora** (`:10-12`).
  Además el contador vive en un `Map` en memoria (`:29`): con N tareas el cupo
  efectivo es N veces el nominal y se pierde en cada despliegue.
- **Límite de body:** no se configura; Nest 11.1.28 con Express 5.2.1 /
  body-parser 2.3.0 (`backend-pet-tracker/pnpm-lock.yaml:1333,2556,1977`) aplica el default de
  body-parser (100 kB para JSON). Las fotos y documentos suben directo a S3 por
  URL prefirmada (`src/modules/media/infrastructure/photo-storage.s3.adapter.ts:26-39`),
  no por el backend.
- Sin `helmet`, sin `ValidationPipe` global (la validación es con zod por DTO).

## 6. Build

- Scripts (`backend-pet-tracker/package.json:9,14`): `build` =
  `nest build && tsc-alias -p tsconfig.build.json` (tsc-alias reescribe los
  imports `@/*`, `tsconfig.json:24-26`); `start:prod` = `node dist/main`.
- **`start:prod` apunta a una ruta que no existe.** `tsconfig.json` no tiene
  `include`/`rootDir` y `tsconfig.build.json:3` solo excluye `test`, `dist` y
  specs, así que `scripts/` y `drizzle.config.ts` entran en la compilación y el
  `rootDir` pasa a ser `backend-pet-tracker/`. Resultado: `dist/src/main.js`,
  `dist/scripts/*.js`, `dist/drizzle.config.js` (verificado en
  `/home/claude/sites/Pet-Tracker/backend-pet-tracker/dist/`, config de build
  idéntica a este HEAD). El entrypoint real del contenedor sería
  `node dist/src/main.js`. Nadie lo ha notado porque init.sh solo compila
  (`init.config.sh:24`) y en local se usa `nest start`.
- **No es un workspace pnpm de varios paquetes.** `backend-pet-tracker/pnpm-workspace.yaml`
  solo tiene `allowBuilds` (`argon2`, `esbuild`, `unrs-resolver`). `infra/` tiene
  su propio `package.json` y lockfile, e importa constantes del backend por path
  alias (`infra/tsconfig.json`, `"@backend/*": ["../backend-pet-tracker/src/*"]`).
- **Node:** no hay `.nvmrc`, `.node-version` ni `engines` en ningún
  `package.json`. CI usa **Node 24** (`.github/workflows/ci.yml:30`) y **pnpm 10**
  (`:26`); `@types/node` `^24` (`package.json:63`). No hay `packageManager`.
- **Dockerfile: no hay ninguno** en el repo (`find -name 'Dockerfile*'` = 0). Solo
  `docker-compose.yml` para Postgres 17 + LocalStack 4.14 (`:6,25`). Tampoco
  `.dockerignore`.
- **Dependencias nativas:** solo **`argon2@0.45.1`** (`package.json:43`,
  `pnpm-lock.yaml:1907`), con build script permitido en
  `pnpm-workspace.yaml`. No hay `bcrypt` ni `sharp`. Hay que compilar o bajar el
  prebuild para la misma arquitectura y libc de la imagen final (x86_64 vs
  arm64/Graviton; glibc vs musl si se usa alpine). No verifiqué qué prebuilds
  publica argon2 0.45.1.
- `ts-node`, `drizzle-kit`, `@nestjs/cli` son devDependencies: una imagen con
  `pnpm install --prod` no puede correr `pnpm db:migrate` ni los scripts vía
  `ts-node` (ver §3).

## 7. Terceros que salen a internet

| Destino | Dónde | Cuándo | Servicio |
|---|---|---|---|
| Wialon `https://hst-api.wialon.com/wialon/ajax.html` (o `WIALON_BASE_URL`) | `src/integrations/wialon/wialon.factory.ts:7-8,29-32` | Solo con `SIM_MODE=false` y token real | workers (poller) y script `provision-device` |
| Anthropic API (SDK `@anthropic-ai/sdk@0.128.0`, sin `baseURL` custom) | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts:83-85` | Con `ANTHROPIC_ENABLED=true` + clave + modelo | **API** (petición de plan de alimentación) |
| Expo Push (`expo-server-sdk`, `new Expo()` sin `accessToken`) | `src/workers/notifier/expo-push-sender.ts:88` | Con `PUSH_ENABLED=true` | workers (notifier) |
| Resend `https://api.resend.com/emails` | `src/modules/auth/infrastructure/email/resend-client.ts:3,74` | Con `EMAIL_ENABLED=true` | **API** (registro, reset) |
| AWS: SQS, DynamoDB, S3, EventBridge | `src/aws/aws.module.ts` | Siempre | ambos |
| Implícitos: ECR (pull), CloudWatch Logs, Secrets Manager/SSM (si se inyectan secretos) | — | Arranque de tarea | ambos |

Conclusión factual: **ambos servicios necesitan salida a internet** (API por
Anthropic y Resend; workers por Wialon y Expo). Los servicios AWS se pueden
cubrir con VPC endpoints (gateway gratis para S3 y DynamoDB; interface con costo
por hora para SQS, EventBridge, ECR, Logs, Secrets Manager), pero los terceros
no: NAT gateway o IP pública en la tarea.

Permisos IAM mínimos que pide el código (comandos SDK fuera de
`src/aws/provisioning.ts`): `sqs:GetQueueUrl`, `sqs:SendMessage`,
`sqs:ReceiveMessage`, `sqs:DeleteMessage`; `dynamodb:BatchWriteItem`,
`dynamodb:Query`; `events:PutEvents`; `s3:PutObject`, `s3:GetObject` (firma de
URLs) y `s3:HeadObject` (= `s3:GetObject` en IAM). Repartidos por servicio:
la API usa S3 + DynamoDB Query; los workers SQS + DynamoDB BatchWrite +
EventBridge. Reminders (worker) hace `SendMessage` a `notifications`.

## 8. Logs

- `Logger` de Nest por defecto: `NestFactory.create(AppModule)` sin opción
  `logger` (`src/main.ts:5`). Sin pino ni winston. `console.*` en `src/` = 0.
- 50 llamadas `logger.log/warn/error`, 40 de ellas con **objeto** como mensaje
  (`{ scope, message, ... }`, p. ej.
  `src/modules/reminders/infrastructure/reminders-dispatch.service.ts:34-37`).
- El `ConsoleLogger` de Nest 11.1.28 imprime texto con colores ANSI (salvo
  `NO_COLOR`) y los objetos como JSON **multilínea**
  (`@nestjs/common/services/console-logger.service.js:41,226-236,269-285`: objetos por `util.inspect` con `compact: false`). En
  CloudWatch cada línea sería un evento suelto. La misma clase acepta
  `json: true` (`:140`), que emite una línea JSON por log sin colores: cambio de
  una línea en `main.ts`, no de dependencias.

## 9. Infra existente

- `infra/lib/pet-tracker-dev-stack.ts` declara 11 recursos de 6 tipos: 6 colas
  SQS con redrive (`:37-68`), tabla `positions` **PROVISIONED 25/25** con TTL y
  `RETAIN` (`:70-90`), bucket `pet-tracker-media-dev-<accountId>` con
  `BLOCK_ALL` y `DESTROY` (`:92-97`), bus `pet-tracker` y regla
  `geofence-events` → cola (`:99-113`). **No hay** VPC, ECS, ALB, RDS/Aurora,
  ECR, Secrets, IAM roles de tarea, alarmas ni Route 53.
- Región fija: `DEV_REGION = 'us-east-1'` (`:29`), usada en
  `infra/bin/app.ts:10-12`; sin cuenta fija (token).
- Todos los nombres vienen de `@backend/aws/constants` (`:8-27`), así que el
  stack de prod puede reusarlos tal cual. `ENV_SUFFIX = ''` (`:31`).
- Reutilizable/parametrizable: la definición de colas+DLQ, tabla, bus y regla se
  puede extraer a un construct que reciba región y sufijo. Pero:
  - Los tests de `infra/test/pet-tracker-dev-stack.test.ts` congelan el stack
    dev (R13 "exactamente 11 recursos de 6 tipos", `:280-301`; R14 región
    `us-east-1`, `:312-316`). Parametrizar el stack dev los toca; un stack nuevo
    no.
  - `infra/test/no-duplicated-literals.test.ts` (`:23-26`) prohíbe literales de
    nombres de recursos en `infra/bin` y `infra/lib`: aplica también al stack de
    prod.
  - Tabla PROVISIONED: para DynamoDB global table con capacidad provisionada AWS
    exige autoescalado de escritura (a verificar contra la doc); en CDK la
    global table se modela con `TableV2` + `replicas`, no con `Table`.
  - Bucket `DESTROY` no vale para prod; CRR exige versionado en origen y destino.
- Testing: jest + `aws-cdk-lib/assertions` (`infra/package.json:7`,
  `infra/jest.config.js`); `pnpm -C infra run synth` en el BUILD_CMD de init.sh
  (`init.config.sh:24`). Versiones: **`aws-cdk-lib` 2.263.0**, CLI **`aws-cdk`
  2.1135.1**, `constructs` 10.8.1 (`infra/pnpm-lock.yaml:773,792`). `cdk.json`
  corre `npx ts-node` (`infra/cdk.json:2`).

## 10. Estado multi-región

- **Región en el código: ninguna.** `grep us-east|mx-central|amazonaws.com` en
  `src/` y `scripts/` = 0. La región viene de `AWS_REGION` o de la cadena del SDK.
- **Nombres fijos por región**: colas, tabla, bus y regla son iguales en ambas
  regiones (constants.ts); el bucket es global y viene de `MEDIA_BUCKET_NAME`.
  Con CRR el bucket réplica tendrá **otro nombre**: al conmutar hay que cambiar
  `MEDIA_BUCKET_NAME` en la task definition de us-east-2.
- **Media**: la base guarda la **clave**, no la URL (`pets.photo_key`,
  `src/db/schema/pets.schema.ts:41`; `media.key`, `src/db/schema/media.schema.ts:24`).
  Las URLs prefirmadas se generan por petición con el cliente de la región y
  caducan; no quedan atadas a región en datos. Objetos subidos y aún no
  replicados por CRR no estarán en la réplica.
- **SQS y EventBridge son regionales**: mensajes en vuelo en mx-central-1 se
  pierden en un failover. La regla `geofence-events` y su cola tienen que existir
  también en us-east-2 (stack replicado), aunque estén ociosas.
- **DynamoDB `positions`**: escriben solo los workers (BatchWrite idempotente por
  `sk`). Con workers a 0 en us-east-2 hay un solo escritor; la global table no
  tiene conflictos last-writer-wins en operación normal.
- **Aurora Global**: la secundaria es solo lectura hasta failover/switchover;
  con la API a 0 allí no hay problema. `DATABASE_URL` lleva un host fijo: tras
  conmutar, el host del writer cambia salvo que se use un endpoint que siga al
  writer (Aurora ofrece un "global writer endpoint"; no verificado para
  mx-central-1).
- **Estado que asume un solo escritor/proceso**:
  - Watermark del poller en Postgres (`src/workers/poller.service.ts:140-148`),
    replicado con Aurora: correcto tras failover.
  - Dispatcher de reminders sin lock (§4): asume **una sola tarea** de workers
    en todo el sistema. Si alguna vez corren workers en dos regiones a la vez,
    duplica pushes.
  - Agregador de actividad: upsert, seguro.
  - Límite diario de IA: `consumeAiGeneration` en Postgres
    (`src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts:119-127`),
    no en memoria: seguro con N réplicas.
  - Rate limit de email en memoria por proceso (§5): no compartido entre tareas
    ni regiones.
  - Caché de `QueueUrl` en memoria por proceso: correcto por región.
- **`JWT_SECRET`** firma HS256 con un secreto compartido
  (`src/modules/auth/infrastructure/security/jwt-token-service.ts:26`): tiene que
  ser **el mismo** en ambas regiones o los tokens emitidos en mx-central-1 dejan
  de valer tras el failover.
- Disponibilidad de servicios en **mx-central-1** (Aurora Serverless v2, Aurora
  Global Database, DynamoDB global tables, EventBridge, Fargate, ACM): no
  verificable sin acceso a AWS ni red desde aquí; queda como comprobación previa
  a la spec.

---

## Riesgos

1. **Entrypoint roto**: `start:prod` (`node dist/main`) no existe tras el build;
   es `dist/src/main.js` (§6). Un Dockerfile que copie el script tal cual falla
   al arrancar.
2. **Migraciones no empaquetadas**: los `.sql` no van a `dist/` y `drizzle-kit`
   es devDependency (§3). La tarea de migración necesita una decisión de
   empaquetado.
3. **TLS a Aurora**: sin CA de RDS en la imagen, `sslmode=require` falla
   (pg lo trata como `verify-full`); sin `sslmode`, conecta en claro si el
   clúster lo permite (§3).
4. **Credenciales estáticas o endpoint en el entorno** desvían o rompen el modo
   `aws`: `AWS_ENDPOINT_URL` aborta el arranque, `AWS_ACCESS_KEY_ID` gana al task
   role. Un `.env` copiado a la imagen haría lo mismo (§2).
5. **Reminders duplicados** con dos tareas de workers simultáneas (rolling
   deploy por defecto de ECS, o dos regiones activas) (§4, §10).
6. **Rate limit de registro** colapsado en la IP del ALB sin `trust proxy`, y
   multiplicado por N tareas (§5). En producción bloquearía registros legítimos
   tras 10 por hora por nodo del ALB.
7. **Sin graceful shutdown**: el pool no se cierra y los workers mueren a mitad
   de lote en cada despliegue o escalado (§5).
8. **Logs multilínea con ANSI** en CloudWatch: difíciles de consultar con Logs
   Insights (§8).
9. **Validación de config inexistente**: `DATABASE_URL` ausente o mal formada no
   falla al arrancar; el health check lo detecta (503), pero las claves de
   terceros mal puestas degradan en silencio a fake/consola/null (§1). En
   particular `SIM_MODE` distinto de `false` en prod = **datos simulados** en
   producción sin error.
10. **Health check acoplado a la base**: si Aurora tarda en un failover, todas
    las tareas de la API dan 503 a la vez y ECS podría reciclarlas (§5).
11. **Pool sin `max` explícito**: `10·(N+1)` conexiones vs `max_connections` de
    Aurora Serverless v2 al mínimo de ACU (§3).
12. **Dev y prod en la misma cuenta y región** chocarían en nombres (sufijo
    siempre `''` en modo `aws`). Con regiones distintas no (§2).
13. Local en Postgres 17 y prod en Aurora 16.x: hoy sin SQL exclusivo de 17,
    pero nada lo impide a futuro (§3).

## Decisiones abiertas

Para el humano o la spec, sin decidir aquí:

1. **Migraciones**: ¿`drizzle-kit migrate` dentro de la imagen, o un script
   runtime con el migrator de `drizzle-orm`? ¿Tarea ECS one-off lanzada por
   quién (pipeline, humano, custom resource de CDK)?
2. **Secreto de base**: ¿`DATABASE_URL` completa en un secreto propio, o cambiar
   el código para leer `PG*`/campos del secreto gestionado de RDS (y permitir
   rotación)? ¿IAM auth de RDS?
3. **TLS**: ¿bundle de CA de RDS en la imagen con `sslrootcert`, o
   `NODE_EXTRA_CA_CERTS`?
4. **Reminders en prod**: ¿se mantiene el dispatcher en proceso (con
   `minimumHealthyPercent=0`/`maximumPercent=100` en el servicio de workers, o un
   lock en la query) o se retoma EventBridge Scheduler del plan 008
   (`plans/008-salud-recordatorios.md:15,55-64`, `docs/architecture.md:105`)?
5. **Despliegue del servicio de workers**: estrategia que garantice como mucho
   una tarea viva (afecta a reminders y a eventos duplicados del poller).
6. **Salida a internet**: NAT gateway (costo fijo por hora y por GB) vs subred
   pública con IP pública en la tarea; qué VPC endpoints se pagan. Es decisión
   de costo.
7. **`trust proxy` y rate limit**: ¿se corrige el `EmailRateLimitGuard` (trust
   proxy + almacén compartido) antes de producción, o se acepta?
8. **Graceful shutdown y logs JSON**: ¿entran en la feature de imagen (#245) o
   van aparte?
9. **Health check**: ¿el del ALB usa `/v1/health` tal cual (acoplado a
   Postgres) o un liveness que no dependa de la base?
10. **Aurora 16.x vs local 17**: ¿alinear local a 16 o subir Aurora a 17?
11. **Arquitectura de la imagen**: x86_64 o arm64 (Graviton) — condiciona el
    build de `argon2`.
12. **Versión de Node fijada**: hoy solo la fija CI (24). ¿`.nvmrc`/`engines`
    o solo la imagen base?
13. **`DATABASE_URL` tras failover**: endpoint global de escritura de Aurora vs
    cambio de host en la task definition de us-east-2.
14. **`MEDIA_BUCKET_NAME` en us-east-2**: nombre del bucket réplica y cómo se
    conmuta.
15. **`JWT_SECRET` compartido entre regiones**: secreto replicado (Secrets
    Manager replica) o equivalente.
16. **Disponibilidad en mx-central-1** de Aurora Global Database, Serverless v2
    16.4+, DynamoDB global tables y EventBridge: verificar antes de firmar la
    spec de #246.
17. **Flags en prod**: valores de `SIM_MODE`, `PUSH_ENABLED`, `EMAIL_ENABLED`,
    `ANTHROPIC_ENABLED` y si un valor "fake" en prod debe abortar el arranque.
