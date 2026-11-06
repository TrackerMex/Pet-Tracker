---
feature: "backend-container-image"
status: approved      # draft | approved
tags: [harness, spec, backend, infra, produccion]
---

# Requisitos — [[backend-container-image]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y el **Contrato con #246**, y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Feature #245 del plan `progress/plan_produccion-aws-2026-11-06.md` (§1 y §2).
> Inventario de partida: `progress/explore_produccion-aws.md`.
>
> Rutas relativas a `backend-pet-tracker/` salvo que se diga otra cosa. En los
> ficheros de test que ya existen y ya nombran R-ids de otras features, los
> `describe`/`it` nuevos llevan el prefijo `#245 R<n>`. En los ficheros nuevos
> basta `R<n>`.

## Términos

- **Producción**: `NODE_ENV === 'production'` exactamente, evaluado solo por
  `isProduction` (R1). Es la **única** señal de producción del backend
  ([[design]] §DT1 explica por qué no es `AWS_MODE`).
- **En blanco**: el valor es `undefined` o su `trim()` es la cadena vacía.
- **Entero positivo**: tras `trim()`, el valor casa con `/^[1-9]\d*$/`.

## Requisitos funcionales

### Señal de producción

- **R1**: THE SYSTEM SHALL exportar `isProduction(nodeEnv: string | undefined): boolean`
  desde `src/config/environment.ts`, que devuelve `true` solo para
  `'production'` exactamente: `false` para `'Production'`, `'prod'`,
  `' production'`, `'test'`, `'development'`, `''` y `undefined`. Además, el
  literal `production` entre comillas (simples, dobles o backtick) aparece
  en **un único** fichero `.ts` no-spec de `src/`, que es `src/config/environment.ts`.

### Conexión a Postgres

- **R2**: WHILE no es producción, WHEN se llama a `buildPoolConfig(config: ConfigService)`
  (exportada desde `src/db/pool-config.ts`) THE SYSTEM SHALL devolver exactamente
  `{ connectionString: <DATABASE_URL tal cual>, max }`, sin clave `ssl`. `max`
  es `DB_POOL_MAX` convertido a número, o `DEFAULT_DB_POOL_MAX` (exportada,
  igual a `10`) si `DB_POOL_MAX` está en blanco. IF `DB_POOL_MAX` no está en
  blanco y no es entero positivo THEN THE SYSTEM SHALL lanzar
  `DatabaseConfigError` (exportada, `name === 'DatabaseConfigError'`) con un
  mensaje que nombra `DB_POOL_MAX`.
- **R3**: WHILE es producción, WHEN se llama a `buildPoolConfig(config)` THE
  SYSTEM SHALL devolver exactamente
  `{ host: PGHOST, port: Number(PGPORT), database: PGDATABASE, user: PGUSER, password: PGPASSWORD, ssl: { rejectUnauthorized: true }, max: Number(DB_POOL_MAX) }`
  e ignorar `DATABASE_URL` aunque tenga valor. IF alguna de `PGHOST`,
  `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` o `DB_POOL_MAX` está en blanco,
  o `PGPORT` no es un entero de 1 a 65535, o `DB_POOL_MAX` no es entero positivo
  THEN THE SYSTEM SHALL lanzar **un único** `DatabaseConfigError` cuyo mensaje
  nombra **todas** las variables con problema y no reproduce el valor de
  ninguna variable (se comprueba con valores centinela únicos).
- **R4**: WHEN `DrizzleModule` construye `PG_POOL` THE SYSTEM SHALL pasar a
  `new Pool(...)` el resultado de `buildPoolConfig(config)`: con
  `DB_POOL_MAX='7'` fuera de producción, `pool.options.max` vale `7`. El
  listener de `error` de #238 no cambia.
- **R5**: WHEN la aplicación se cierra (`app.close()` o señal con shutdown
  hooks) THE SYSTEM SHALL llamar a `end()` de `PG_POOL` exactamente una vez,
  en `onApplicationShutdown` de `DrizzlePoolLifecycle`. Cuando corre cualquier
  hook `beforeApplicationShutdown` de la aplicación, `end()` todavía no se ha
  llamado.

### Apagado ordenado de los workers

- **R6**: THE SYSTEM SHALL proveer `InFlightTicks` (`src/lifecycle/in-flight-ticks.ts`)
  desde un `LifecycleModule` `@Global()` (`src/lifecycle/lifecycle.module.ts`)
  que `AppModule` importa, con este comportamiento:
  - `run(task)` invoca `task` de forma síncrona, antes de retornar, y sigue la
    promesa que devuelve hasta que se resuelve o se rechaza;
  - `drain(timeoutMs)` resuelve `'drained'` cuando no queda ninguna tarea
    seguida (al instante si no hay ninguna) y no deja timers vivos; resuelve
    `'timeout'` al cumplirse `timeoutMs` si alguna sigue pendiente;
  - si la promesa de una tarea se rechaza, el rechazo se registra con
    `Logger.error`, con el mensaje del error, y no se propaga;
  - `beforeApplicationShutdown()` hace que todo `run` posterior **no invoque**
    su tarea, y espera `drain(SHUTDOWN_DRAIN_TIMEOUT_MS)`
    (`SHUTDOWN_DRAIN_TIMEOUT_MS`, exportada, igual a `20_000`). Si el resultado
    es `'timeout'`, lo registra con `Logger.warn`, incluyendo cuántas tareas
    quedaron pendientes.
- **R7**: WHEN dispara cualquiera de los seis intervalos (`ingestion-poller`
  e `ingestion-consumer` de `IngestionSchedulerService`; los de
  `AlertsEngineSchedulerService`, `NotifierSchedulerService`,
  `RemindersSchedulerService` y `ActivitySchedulerService`) THE SYSTEM SHALL
  ejecutar su tick a través de `InFlightTicks.run`. Por eso, para cada intervalo:
  - mientras el tick está pendiente, `drain` no se resuelve;
  - después de `beforeApplicationShutdown()`, un nuevo disparo del intervalo
    no invoca la dependencia del tick.

### Endpoints y arranque HTTP

- **R8**: WHEN llega `GET /v1/health/live` THE SYSTEM SHALL responder `200`
  con el cuerpo `{ "status": "ok" }`, sin token (handler marcado `@Public()`)
  y sin consultar Postgres. Con Postgres inalcanzable, `/v1/health/live`
  responde `200` mientras `/v1/health` responde `503`. `GET /v1/health` no cambia.
- **R9**: THE SYSTEM SHALL exportar `configureApp(app: NestExpressApplication): void`
  desde `src/app-setup.ts`. Sobre una app recién creada, `configureApp` hace
  tres cosas:
  - **Prefijo `v1`**: un controlador en `probe` responde en `/v1/probe` y da
    `404` en `/probe`.
  - **`trust proxy` de un salto**:
    - con `X-Forwarded-For: 203.0.113.7`, `req.ip` vale `203.0.113.7`;
    - con `X-Forwarded-For: 198.51.100.1, 203.0.113.7`, `req.ip` vale `203.0.113.7`.
  - **Shutdown hooks**:
    - `process.listenerCount('SIGTERM')` sube en 1;
    - tras `app.close()`, vuelve al valor de partida.
- **R10**: THE SYSTEM SHALL exportar `createAppLogger(nodeEnv: string | undefined): ConsoleLogger`
  desde `src/app-setup.ts`.
  - **En producción**, cada `log(message, context)` escribe en stdout
    **exactamente una** línea terminada en `\n`. Esa línea es JSON válido con
    `level: 'log'`, `message` y `context`, y no contiene secuencias ANSI
    (`\u001b[`).
  - **Fuera de producción** (`'test'`, `undefined`), la salida no es JSON.
- **R11**: THE SYSTEM SHALL arrancar en `src/main.ts` así:
  - crea la app con `NestFactory.create<NestExpressApplication>(AppModule, { logger: createAppLogger(process.env.NODE_ENV) })`;
  - llama a `configureApp(app)` antes de `app.listen(...)`;
  - no llama a `setGlobalPrefix` directamente.

  `listen` sigue usando `process.env.PORT ?? 3000`.

### Validación de configuración al arrancar

- **R12**: THE SYSTEM SHALL exportar `validateEnv(config: Record<string, unknown>): Record<string, unknown>`
  desde `src/config/env.validation.ts`.
  - **Fuera de producción**, devuelve el mismo objeto (`toBe`) sin validar
    nada, aunque falte `SIM_MODE`.
  - **En producción**, IF se da alguna de estas condiciones THEN lanza **un
    único** `EnvValidationError` (exportada, `name === 'EnvValidationError'`):
    - `SIM_MODE` no es `'true'` ni `'false'` (incluido ausente);
    - `SIM_MODE === 'false'` y `WIALON_TOKEN` está en blanco o es `'PENDING'`;
    - `EMAIL_ENABLED === 'true'` y alguna de `RESEND_API_KEY`, `RESEND_FROM`
      o `RESET_LINK_HOST` está en blanco;
    - `ANTHROPIC_ENABLED === 'true'` y `ANTHROPIC_API_KEY` está en blanco o es
      `'PENDING'`, o `ANTHROPIC_MODEL` está en blanco;
    - `JWT_SECRET` está en blanco.

    El mensaje del error nombra **todas** las variables con problema y no
    reproduce el valor de ninguna variable (se comprueba con valores
    centinela únicos).
  - **En producción y sin ninguna de esas condiciones**, devuelve el mismo
    objeto.
- **R13**: WHEN se compila `AppConfigModule.forRoot([])` con
  `NODE_ENV=production` y sin `SIM_MODE` en `process.env` THE SYSTEM SHALL
  rechazar la compilación con un `EnvValidationError` que nombra `SIM_MODE`.
  Es decir, `validateEnv` está conectada como `validate` del
  `ConfigModule.forRoot` de `AppConfigModule`.

### Migraciones como tarea única

- **R14**: THE SYSTEM SHALL exportar desde `src/db/migrate.ts`, que se compila
  a `dist/src/db/migrate.js`:
  - `MIGRATIONS_FOLDER`, igual a `join(__dirname, 'migrations')`, que contiene
    `meta/_journal.json`.
  - `runMigrations(config: ConfigService): Promise<void>`:
    - construye un `Pool` con `buildPoolConfig(config)`;
    - llama una vez a `migrate(drizzle(pool), { migrationsFolder: MIGRATIONS_FOLDER })`
      de `drizzle-orm/node-postgres/migrator`;
    - llama a `pool.end()` exactamente una vez, tanto si `migrate` resuelve
      como si rechaza. Si rechaza, `runMigrations` rechaza con el mismo error.
  - `runMigrationsCli(config: ConfigService): Promise<void>`:
    - registra el resultado con `createAppLogger(config.get('NODE_ENV'))`;
    - si falla, deja `process.exitCode = 1`;
    - ni en éxito ni en fallo escribe en stdout o stderr el valor de
      `PGPASSWORD`.
  - El fichero se ejecuta como CLI solo con `require.main === module`, que
    llama a `runMigrationsCli(new ConfigService())`. No carga ningún `.env`.
- **R15** *(requisito de verificación, vía (b) de C4)*: WHEN `runMigrations`
  corre contra la base de e2e, ya migrada por `drizzle-kit`, THE SYSTEM SHALL
  resolver sin error y dejar igual el número de filas de
  `drizzle.__drizzle_migrations`. Es decir, el migrator de runtime usa la
  misma tabla y el mismo journal que `drizzle-kit`. Su cierre se prueba por
  mutación ([[design]] §Mutaciones).

### Imagen de contenedor

- **R16**: THE SYSTEM SHALL tener `Dockerfile` (contexto de build:
  `backend-pet-tracker/`) con estas propiedades:
  - **Cabecera**: la primera línea es `# syntax=docker/dockerfile:1`.
  - **Etapas**: exactamente tres `FROM`, en orden `deps`, `build` y `runtime`,
    cada una `FROM node:24-bookworm-slim AS <nombre>`, sin `--platform`. La
    plataforma la fija #246 al construir ([[design]] §Contrato con #246, Imagen).
  - **Directorio de trabajo**: cada etapa tiene `WORKDIR /app` antes de su
    primer `COPY`.
  - **Dependencias**: `deps` instala con `pnpm install --prod --frozen-lockfile`;
    `build` instala con `pnpm install --frozen-lockfile` y compila con `pnpm build`.
  - **Etapa `runtime`**:
    - no tiene ninguna instrucción `RUN`;
    - cada `COPY` lleva `--from=`, y `node_modules` llega solo `--from=deps`;
    - tiene `ENV NODE_ENV=production` y `EXPOSE 3000`;
    - tiene exactamente un `USER`, que es `USER node` y va después de su
      último `COPY`/`ADD`;
    - termina en `CMD ["node", "dist/src/main.js"]`.
  - Ninguna etapa tiene `ENTRYPOINT`.
- **R17**: THE SYSTEM SHALL versionar el bundle global de CA de RDS en
  `certs/rds-global-bundle.pem` y llevarlo a la imagen:
  - **Fichero**: contiene al menos un bloque
    `-----BEGIN CERTIFICATE-----` … `-----END CERTIFICATE-----`; cada bloque se
    parsea sin error con `new X509Certificate(<bloque>)` de `node:crypto`; y
    entre los `subject` de esos certificados hay al menos uno que contiene
    `us-east-2` y al menos uno que contiene `mx-central-1`, las dos regiones
    del plan.
  - **Etapa `runtime` del `Dockerfile`**, las dos líneas antes de `USER node`:
    - `COPY --from=build --chmod=0444 /app/certs/rds-global-bundle.pem /app/rds-global-bundle.pem`;
    - `ENV NODE_EXTRA_CA_CERTS=/app/rds-global-bundle.pem`.
  - El valor de `NODE_EXTRA_CA_CERTS` es igual al destino de ese `COPY`.
  - El destino va directo en `/app`, que ya existe por `WORKDIR /app`
    (enmienda del leader del 2026-11-06, 3). BuildKit aplica el `--chmod` de un
    `COPY` también a los directorios padre que crea. `node:24-bookworm-slim` no
    trae `/etc/ssl`, así que el destino original
    `/etc/ssl/certs/rds-global-bundle.pem` dejaba `/etc/ssl` y
    `/etc/ssl/certs` en `0444`, sin bit de ejecución. Con eso, `node` no
    arrancaba como uid 1000 (`fopen(/etc/ssl/openssl.cnf) Permission denied`,
    exit 13).
  - Ninguna instrucción del `Dockerfile` es `ADD` con una URL (`http://` o
    `https://`).
- **R18**: THE SYSTEM SHALL copiar las migraciones a la imagen con
  `COPY --from=build /app/src/db/migrations ./dist/src/db/migrations` en la
  etapa `runtime`. Ese destino es `MIGRATIONS_FOLDER` (R14) compilado:
  `relative(<src>, MIGRATIONS_FOLDER)` es `db/migrations`.
- **R19**: THE SYSTEM SHALL tener `.dockerignore` con las líneas `**/.env`,
  `**/.env.*`, `node_modules`, `dist` y `coverage`. Ninguna línea no comentada
  del `Dockerfile` contiene `.env`. Ninguna línea no comentada de
  `.dockerignore` contiene `certs` ni `pem`, para que el PEM de R17 llegue a
  la etapa `build`.
- **R20**: THE SYSTEM SHALL tener en `package.json` el script `start:prod` igual
  a `node dist/src/main.js`.

### Comandos únicos de operación

Los dos scripts de esta sección son `scripts/provision-device.ts` y
`scripts/set-device-subscription.ts`.

- **R21**: THE SYSTEM SHALL no cargar ningún `.env` desde el código de los dos
  scripts: ninguno contiene la cadena `dotenv`. Para que el uso local siga
  leyendo `../.env`, `package.json` define exactamente:
  - `"provision:device": "node --env-file-if-exists=../.env -r ts-node/register -r tsconfig-paths/register scripts/provision-device.ts"`;
  - `"subscription:set": "node --env-file-if-exists=../.env -r ts-node/register -r tsconfig-paths/register scripts/set-device-subscription.ts"`.
- **R22**: WHEN se ejecuta cualquiera de los dos scripts THE SYSTEM SHALL
  construir su `Pool` con `new Pool(buildPoolConfig(config))` (R2/R3), donde
  `config` es un `new ConfigService()`, sin leer `DATABASE_URL` directamente.
  Por eso, con `NODE_ENV=production`, sin `PGHOST`, `PGPORT`, `PGDATABASE`,
  `PGUSER` ni `DB_POOL_MAX`, y con `DATABASE_URL` apuntando a un puerto
  cerrado, cada script, lanzado como proceso:
  - sale con código distinto de `0`;
  - escribe en stderr `DatabaseConfigError` y `PGHOST`;
  - no escribe `ECONNREFUSED`, es decir, no intentó conectar con `DATABASE_URL`;
  - no reproduce en stdout ni en stderr el valor de `PGPASSWORD` ni el de
    `WIALON_TOKEN` (valores centinela únicos).
- **R23** *(requisito de verificación, vía (b) de C4)*: THE SYSTEM SHALL
  compilar `scripts/` con `pnpm build`, de modo que la imagen contenga
  `dist/scripts/provision-device.js` y `dist/scripts/set-device-subscription.js`.
  Es decir: ni `tsconfig.json` ni `tsconfig.build.json` tienen `include` ni
  `files`, y ninguna entrada del `exclude` de `tsconfig.build.json` contiene
  `scripts`. Nace verde; su cierre se prueba por mutación ([[design]]
  §Mutaciones).

## Comportamiento que se mantiene (sin R-id; ya tiene candado)

- **Clientes AWS en `AWS_MODE=aws`**: se construyen sin endpoint y sin
  `credentials`, así que el SDK usa la cadena por defecto. En Fargate eso
  significa las credenciales del task role. Lo fija `src/aws/aws-mode.spec.ts`
  (`R4: modo aws no pasa credentials explicitas`). **Consecuencia para #246**:
  la task definition no define `AWS_ACCESS_KEY_ID` ni `AWS_SECRET_ACCESS_KEY`,
  que ganarían al task role en la cadena.
- **`AWS_ENDPOINT_URL` en `AWS_MODE=aws`**: aborta con
  `UnexpectedAwsEndpointError`. Lo fija `src/aws/aws-endpoint-guard.spec.ts`
  (`R1: modo aws con AWS_ENDPOINT_URL definida aborta`).
- **`MEDIA_BUCKET_NAME` en `AWS_MODE=aws`**: es obligatoria. Si falta, se lanza
  `MissingMediaBucketNameError` (`src/aws/resource-names.ts`).
- **`AWS_MODE` ausente en producción**: no hace falta validarlo. Sin
  `AWS_MODE=aws` el modo es `local`, que exige `AWS_ENDPOINT_URL`, y sin ella
  el arranque aborta con `MissingAwsEndpointError`.
- **`GET /v1/health`** (comprueba Postgres; `503` si cae) queda igual. Es la ruta
  del health check de Route 53 en #249.
- **Fuera de producción**:
  - `DATABASE_URL` sigue siendo la conexión, sin TLS;
  - la semántica de `SIM_MODE`, `EMAIL_ENABLED`, `ANTHROPIC_ENABLED` y
    `PUSH_ENABLED` en sus consumidores no cambia (R12 solo añade la validación
    en producción).

## Fuera de alcance

- **Seeds en producción.** El plan §2 y GA4 hablan de «migraciones y seeds».
  Ningún seed hace falta en producción:
  - `seed:vaccines` es redundante, porque la migración `0023_vaccine_catalog_data.sql`
    ya carga el catálogo, con `ON CONFLICT DO NOTHING`;
  - `seed:devices` es solo para desarrollo.
- **Otros scripts de `scripts/`.** Solo `provision-device` y
  `set-device-subscription` son comandos únicos de producción (R21–R23). El
  resto (`seed-*`, `provision-local-device`, `backfill-weights`, …) se compila
  a `dist/scripts/` porque `tsconfig.build.json` no los excluye, pero no se
  adaptan, no entran en el contrato con #246 y no se prueban en la imagen.
- **Rate limit en memoria por tarea.** Se acepta que con N tareas el límite
  sea N veces el nominal (decisión 7 del plan). Queda como deuda.
- **Timeouts del pool**: `connectionTimeoutMillis`, `idleTimeoutMillis` y
  `statement_timeout`.
- **Lecturas contra el endpoint lector de Aurora**: todo va al escritor.
- **Autenticación IAM contra Aurora**: decisión 2 del plan.
- **Imagen para arm64.** La decisión 11 la deja para cuando haya pipeline.
- **CI de la imagen**: ni `docker build` en CI ni push a ECR. `cdk deploy`
  construye la imagen en la máquina del humano (plan §6). Las propiedades del
  `Dockerfile` se verifican con un test estático (R16–R19). Antes del
  `reviewer`, el leader corre `docker build` en el VPS y guarda el log en
  `progress/`. Es un paso del gate, sin R-id, en [[tasks]] §Gate del leader.
- **Drenaje de peticiones HTTP en vuelo.** Lo cubre el
  `deregistration_delay` del target group del ALB, que es de #246. Esta
  feature drena solo los ticks de los workers.
- **Recursos AWS**: la task definition, los roles, los secretos y los recursos
  son de #246; esta feature solo fija el contrato ([[design]] §Contrato con #246).

## Aprobación

- [x] Firmada por el leader con la firma delegada (mandato del humano 2026-10-23,
  ampliado 2026-11-06), tras la checklist de `progress/plan_canvas-parity-2026-10-23.md`
  §4 y los tres puntos de `progress/plan_produccion-aws-2026-11-06.md` §4 (fecha: 2026-11-06)
