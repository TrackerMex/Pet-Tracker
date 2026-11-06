---
feature: "backend-container-image"
status: approved      # draft | approved
tags: [harness, spec, backend, infra, produccion]
---

# Diseño — [[backend-container-image]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Las decisiones del plan `progress/plan_produccion-aws-2026-11-06.md` §1
> (Fargate, Aurora Serverless v2 con contraseña en Secrets Manager, x86_64,
> misma imagen para API y workers, sin CI de imagen) están cerradas y aquí
> solo se aplican.

## Decisiones técnicas

### DT1 — Una sola señal de producción: `NODE_ENV === 'production'` (R1)

Elegimos `NODE_ENV` y no `AWS_MODE`. Tres razones, todas sacadas del código:

- **`AWS_MODE=aws` no significa producción.** Las pruebas reales contra la
  cuenta de desarrollo (`test/aws-real-smoke.e2e-spec.ts`,
  `test/aws-real-media.e2e-spec.ts`, `test/aws-real-ingest.e2e-spec.ts`) corren
  con `AWS_MODE=aws` desde la máquina del humano, con `DATABASE_URL` local y
  sin TLS. Si `AWS_MODE` fuese la señal, esas pruebas exigirían `PG*` y
  JSON en los logs.
- **`NODE_ENV` ya es la variable de entorno del backend.** Los cinco
  schedulers y `nutrition-explainer.factory.ts` la leen. Además, jest la fija
  a `test` sin que nadie lo pida, así que ningún test cae en la rama de
  producción por accidente.
- **La imagen la fija.** `ENV NODE_ENV=production` va en la etapa `runtime`
  (R16), así que la señal no depende de que #246 la ponga en la task
  definition.

El literal `'production'` vive solo en `src/config/environment.ts`, y R1 lo
fija. El resto del código pregunta `isProduction(config.get('NODE_ENV'))`.
`resolveResourceSuffix` no cambia: ya devuelve `''` en modo `aws`.

### DT2 — Conexión: `PG*` en producción y `DATABASE_URL` fuera (R2–R4)

**En producción**, `buildPoolConfig` arma la config de `pg` por campos:

- `PGHOST`, `PGPORT`, `PGDATABASE` y `PGUSER` son valores planos de la task
  definition;
- `PGPASSWORD` es el secreto de Aurora, inyectado por ECS desde la clave
  `password` del secreto. No hace falta montar una URL ni escapar caracteres
  de la contraseña.

**TLS**: `ssl: { rejectUnauthorized: true }` verifica el certificado del
servidor contra los CA de Node más los de `NODE_EXTRA_CA_CERTS`, que apunta
al bundle global de RDS que trae la imagen (R17). Node lee
`NODE_EXTRA_CA_CERTS` solo al arrancar el proceso, así que va como `ENV` de
la imagen y no se toca en runtime.

**Pool**: `max` sale siempre de `DB_POOL_MAX`.

- **En producción es obligatoria**: el número de tareas por servicio
  multiplica las conexiones contra el límite de Aurora, y ese número tiene
  que decidirlo #246 de forma explícita.
- **Fuera de producción** tiene default 10, el mismo de `pg`, así que en
  local nada cambia.

**Errores**: `DatabaseConfigError` junta todos los problemas en un solo
mensaje. Así el humano no despliega N veces para descubrir N variables mal
puestas. El mensaje nombra variables, nunca valores, porque se loguea y va a
CloudWatch.

**Por qué en `src/db/`**: `pool-config.ts` vive junto a `drizzle.module.ts`.
Es infraestructura transversal, igual que `src/aws/`.

### DT3 — Cierre del pool en `onApplicationShutdown` (R5)

Nest cierra en este orden:

1. `onModuleDestroy`;
2. `beforeApplicationShutdown`;
3. `dispose` (cierra el servidor HTTP);
4. `onApplicationShutdown`.

Hoy el pool se cierra en el paso 1, así que un tick de worker que siga
corriendo durante el drenaje (paso 2, DT4) encontraría el pool cerrado. Al
mover `pool.end()` al paso 4, el pool vive mientras se drenan los ticks y
mientras el servidor HTTP termina sus peticiones. `pool.end()` espera además
a los clientes prestados.

### DT4 — Drenaje de ticks con un único `InFlightTicks` global (R6, R7)

Los seis intervalos lanzan su tick con `void promesa` y nadie la sigue, así
que al llegar `SIGTERM` el proceso podía morir a mitad de un lote.

`InFlightTicks` es un único servicio `@Global()` que:

- registra cada promesa de tick;
- con `beforeApplicationShutdown` deja de aceptar ticks nuevos y espera a los
  vivos durante 20 s como máximo.

`ScheduleModule` ya borra los intervalos en su `onApplicationShutdown`, pero
eso llega tarde (paso 4). Por eso el corte de ticks nuevos lo hace la bandera
de `InFlightTicks` y no el registro.

**Presupuesto de tiempo**:

| Tramo | Tiempo |
|---|---|
| Drenaje de ticks | 20 s |
| Cierre HTTP y pool | resto, hasta el `stopTimeout` de ECS |
| `stopTimeout` de ECS (default) | 30 s |

**Consecuencias si se agota el drenaje** (aceptadas):

- **Lote de SQS a medias**: no se borró de la cola, así que se reentrega tras
  el visibility timeout. Ya es el comportamiento ante cualquier caída.
- **Recordatorio**: el dispatcher puede haber encolado el push sin marcarlo
  enviado, así que puede salir duplicado.

**Deuda conocida: tick abandonado al agotar el drenaje.** Si a los 20 s queda
un tick pendiente, `InFlightTicks` registra el `Logger.warn` (R6) y deja que
el cierre siga: no cancela el tick ni lo espera más. Las dos consecuencias de
arriba quedan aceptadas y fuera de alcance (decisión del leader en la
revisión de la spec). Se ataca si los logs de producción muestran ese
`warn`.

### DT5 — `GET /v1/health/live` para el ALB, sin Postgres (R8)

- **`/v1/health/live`** es el health check del ALB y del contenedor. Si el
  ALB usase `/v1/health`, una caída de Aurora marcaría todas las tareas como
  enfermas y ECS las reciclaría en bucle sin arreglar nada. `live()` no tiene
  dependencias ni toca el use case.
- **`/v1/health`** queda para Route 53 (#249), donde sí interesa saber si la
  región sirve datos.

### DT6 — `configureApp` y `createAppLogger` en `src/app-setup.ts` (R9–R11)

`main.ts` no se puede probar sin levantar el proceso, así que lo que importa
del arranque sale a dos funciones puras y probables. `main.ts` queda en dos
líneas que R11 fija con un test estático.

- **`trust proxy` = 1**: hay exactamente un salto (el ALB). Con un salto,
  `req.ip` es la entrada más a la derecha de `X-Forwarded-For`, que es la que
  añade el ALB. Un cliente puede falsear las entradas de la izquierda, pero
  no esa. El rate limit usa `req.ip`.
- **`enableShutdownHooks()`**: sin él, `SIGTERM` mata el proceso sin pasar por
  DT3 y DT4.
- **Logs JSON**: con `ConsoleLogger({ json: true })` de `@nestjs/common` 11
  (ya instalado), cada línea es un objeto JSON sin colores, que CloudWatch
  Logs Insights parsea solo. No hace falta ninguna dependencia nueva.

### DT7 — Validación de entorno solo en producción (R12, R13)

`validateEnv` va enchufada al `validate` de `ConfigModule.forRoot`, que recibe
el `.env` mezclado con `process.env` y aborta el arranque si lanza. Valida
solo en producción, para no romper el desarrollo local ni los tests.

**Qué valida**:

- **`SIM_MODE` explícito**: hoy cualquier valor distinto de `false`, incluida
  la ausencia, activa el simulador. En producción eso escondería un olvido.
- **Flag encendido sin su clave**: los consumidores hoy se apagan en
  silencio (`PENDING`, vacío). En producción lo correcto es abortar.
- **`JWT_SECRET`**: no blanco en producción en **todo** proceso que carga
  `AppConfigModule`, es decir, la API y los workers, aunque los workers no
  firmen tokens. Confirmado por el leader en la revisión de la spec. Sin él
  no hay login. `migrate.js` y los comandos únicos no cargan
  `AppConfigModule`, así que R12 no les aplica.

**Qué no valida**:

- `PUSH_ENABLED` y los flags de workers, porque no llevan clave;
- `AWS_MODE` ni `AWS_ENDPOINT_URL`, porque ya abortan por su cuenta
  (requirements §Comportamiento que se mantiene).

### DT8 — Migraciones con el migrator de runtime de drizzle (R14, R15)

`drizzle-kit` es devDependency y no entra en la imagen. `drizzle-orm` ya
trae `migrate()` para `node-postgres`, que usa la misma tabla
(`drizzle.__drizzle_migrations`) y el mismo journal que `drizzle-kit migrate`.
R15 lo verifica contra la base de e2e.

**El script** `src/db/migrate.ts` se compila con el resto del backend a
`dist/src/db/migrate.js`. Corre como tarea única con la misma imagen, con el
comando sobrescrito (§Contrato).

**Los `.sql`**: `nest build` no los copia, así que la etapa `runtime` los
copia a `dist/src/db/migrations` (R18), que es `MIGRATIONS_FOLDER` relativo
al `.js` compilado.

**Consecuencia en local**: `node dist/src/db/migrate.js` tras `pnpm build`
falla por falta de `.sql`. En local se migra con `pnpm db:migrate`, como
siempre.

### DT9 — Imagen: tres etapas sobre `node:24-bookworm-slim`, x86_64 (R16–R20)

**Etapas**:

- **`deps`**: solo dependencias de producción. `argon2` trae prebuild
  linux-x64 glibc, así que no hacen falta compiladores.
- **`build`**: todas las dependencias, más `nest build` y `tsc-alias`.
- **`runtime`**: sin `RUN`. Copia `node_modules` de producción, `dist` y los
  `.sql`. No entran `drizzle-kit`, `@nestjs/cli`, `ts-node` ni `typescript`.

**Base**: `bookworm-slim` en vez de alpine, porque `argon2` y `pg` se prueban
sobre glibc y la imagen slim no trae compiladores ni `curl`.

**Usuario**: `USER node`, que viene en la imagen base, uid 1000. La app no
escribe en disco.

**`CMD` sin `ENTRYPOINT`**: así el comando de migración se sobrescribe con
`command` en la task definition sin pelearse con un entrypoint.

**PEM de RDS**: se versiona en `certs/rds-global-bundle.pem`. El
implementador lo descarga una vez de la URL oficial de AWS ([[tasks]] §R17)
y lo commitea. Entra en la etapa `build` con el resto del contexto
(`COPY . .`) y la etapa `runtime` lo copia con
`COPY --from=build --chmod=0444 … /etc/ssl/certs/rds-global-bundle.pem`. Así
el build no depende de la red para el PEM y dos builds del mismo commit
llevan el mismo bundle. `--chmod` en `COPY` exige BuildKit, por eso la
primera línea es `# syntax=docker/dockerfile:1`. El test de R17 comprueba que
el fichero es un bundle X.509 válido y que cubre `us-east-2` y
`mx-central-1`, las regiones del plan: sin la CA de la región, TLS contra
Aurora falla con `rejectUnauthorized: true` (R3). Si AWS rota la CA, se
renueva con un commit que reemplaza el fichero.

**Plataforma**: el `Dockerfile` no fija `--platform` en `FROM`. La imagen es
x86_64 porque #246 la construye con `platform: Platform.LINUX_AMD64` y declara
`runtimePlatform` X86_64/LINUX (§Contrato). Así el gate local del leader y un
futuro pipeline arm64 (decisión 11 del plan) no chocan con un `FROM` fijado.

**`.dockerignore`**: excluye `.env*` (secretos), `node_modules` y `dist` (no
deben pisar los de la etapa `build`) y `coverage`. El `.env` real vive en la
raíz del repo, fuera del contexto, pero el ignore cubre cualquier copia que
caiga dentro.

**`start:prod`**: se corrige a `node dist/src/main.js`. Hoy apunta a
`dist/main`, que no existe, porque `tsconfig.build.json` incluye `scripts/` y
`drizzle.config.ts` y por eso el `rootDir` efectivo es el del paquete.

### DT10 — Cómo se verifica la imagen sin `docker build` en CI (R16–R19)

CI no construye imágenes (decisión 10 del plan), así que las propiedades del
`Dockerfile` se fijan con un test estático. `src/container-image.spec.ts`
trae un parser mínimo:

- une las continuaciones `\`;
- descarta comentarios y líneas vacías;
- parte en etapas por `FROM`.

Comprueba línea a línea lo que piden R16–R19. Lo que solo se ve
construyendo (uid real, permisos del PEM, ausencia de devDependencies,
`require('argon2')`, `dist/scripts/*.js`) lo comprueba el leader en el VPS
(Docker 29.2.1 con buildx) antes de lanzar al `reviewer`, con los comandos
exactos de [[tasks]] §Gate del leader. No tiene R-id: es un paso del gate,
no un test del repo.

### DT11 — Comandos únicos de operación con la misma imagen (R21–R23)

`provision-device` y `set-device-subscription` son las dos operaciones
manuales que hacen falta contra producción (dar de alta un collar y fijar su
suscripción). Corren como tarea única con la imagen de la API y el comando
sobrescrito: `node dist/scripts/<x>.js …` (§Contrato).

- **Compilados, no `ts-node`**: `tsconfig.build.json` ya incluye `scripts/`,
  así que `pnpm build` emite `dist/scripts/*.js` y `tsc-alias` reescribe los
  imports `@/`. R23 lo fija.
- **Misma conexión que la app**: cada script hace
  `new Pool(buildPoolConfig(config))` con `config = new ConfigService()`
  (R22). `new ConfigService()` sin
  `forRoot` lee `process.env`, así que en producción usan `PG*` con TLS y
  `DB_POOL_MAX`, y fuera de producción `DATABASE_URL`. No se copia la lógica
  de `buildPoolConfig`.
- **Sin `.env` en código**: se quita `loadDotenv({ path: '../.env' })`. En
  local, los scripts de `package.json` pasan `--env-file-if-exists=../.env` a
  `node` (verificado en v20.20.2, la del VPS; CI y la imagen usan Node 24).
  Si falta el fichero, Node avisa y sigue; una variable ya presente en el entorno gana
  al fichero, igual que con `dotenv`.
- **Wialon**: `provision-device` usa `createWialonClient(new ConfigService())`,
  que en producción necesita `SIM_MODE=false` y `WIALON_TOKEN` real
  (`assertRealWialonClient` aborta con el fake). No cambia.
- **El resto de `scripts/`** se compila igual pero no se adapta ni entra en el
  contrato (requirements §Fuera de alcance).

## Mutaciones (evidencia en `progress/impl_backend-container-image.md`)

| Requisito | Qué se planta | Resultado esperado |
|---|---|---|
| R10, ancla negativa «fuera de producción no es JSON» | `createAppLogger` devuelve `new ConsoleLogger({ json: true })` siempre | el `it` de no-producción en rojo |
| R12, anclas «fuera de producción pasa sin validar» y «producción válida pasa» | (a) quitar la guarda `isProduction`; (b) lanzar siempre en producción | (a) rojo el `it` de no-producción; (b) rojo el `it` de producción válida |
| R15 | `MIGRATIONS_FOLDER = join(__dirname, 'migrations-inexistente')` | `test/migrate.e2e-spec.ts` en rojo |
| R17, ancla «ningún `ADD` con URL» | añadir `ADD https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem /tmp/rds.pem` a la etapa `runtime`, antes de `USER node` | el `it` de R17 «sin ADD con URL» en rojo y el resto de R16–R18 en verde |
| R19, ancla «sin `.env` en el Dockerfile» | añadir `COPY --from=build /app/.env ./.env` a la etapa `runtime` | el `it` de R19 en rojo y los de R16–R18 en verde |
| R19, ancla «el PEM no se ignora» | añadir la línea `*.pem` a `.dockerignore` | el `it` de R19 «no excluye el PEM» en rojo |
| R23 | añadir `"scripts"` al `exclude` de `tsconfig.build.json` | el `it` de R23 en rojo |

Cada mutación se revierte con `git checkout HEAD -- <fichero>`, no con un
commit. La evidencia guarda el nombre del `it` en rojo y la línea decisiva.

## Archivos afectados

Rutas relativas a `backend-pet-tracker/` salvo indicación.

**Infraestructura transversal (nuevos)**:

- `src/config/environment.ts`: `isProduction` (R1).
- `src/config/env.validation.ts`: `validateEnv` y `EnvValidationError` (R12).
- `src/db/pool-config.ts`: `buildPoolConfig`, `DEFAULT_DB_POOL_MAX` y
  `DatabaseConfigError` (R2, R3).
- `src/db/migrate.ts`: `MIGRATIONS_FOLDER`, `runMigrations` y
  `runMigrationsCli` (R14).
- `src/lifecycle/in-flight-ticks.ts`: `InFlightTicks` y
  `SHUTDOWN_DRAIN_TIMEOUT_MS` (R6).
- `src/lifecycle/lifecycle.module.ts`: `LifecycleModule` (R6).
- `src/app-setup.ts`: `configureApp` y `createAppLogger` (R9, R10).

**Infraestructura transversal (cambian)**:

- `src/config/config.module.ts`: `validate: validateEnv` (R13).
- `src/db/drizzle.module.ts`: la factory usa `buildPoolConfig` (R4) y el
  cierre se mueve a `onApplicationShutdown` (R5).
- `src/main.ts`: logger y `configureApp` (R11).
- `src/app.module.ts`: importa `LifecycleModule` (R6).

**Infraestructura de módulos (cambian, R7)**: los cinco schedulers.

- `src/workers/ingestion-scheduler.service.ts`
- `src/workers/alerts-engine/alerts-engine-scheduler.service.ts`
- `src/workers/notifier/notifier-scheduler.service.ts`
- `src/modules/reminders/infrastructure/reminders-scheduler.service.ts`
- `src/modules/activity/infrastructure/activity-scheduler.service.ts`

**Controlador (cambia)**: `src/modules/health/infrastructure/health.controller.ts`,
método `live()` (R8).

**Tests previos que cambian** (enmienda del leader del 2026-11-06, ver tasks.md
§Enmienda del leader: dos candados de inventario previos):

- `src/modules/nutrition/nutrition-scope.spec.ts`
- `src/aws/aws.module.spec.ts`

**Tests nuevos**:

- `src/config/environment.spec.ts`
- `src/config/env.validation.spec.ts`
- `src/db/pool-config.spec.ts`
- `src/db/migrate.spec.ts`
- `src/lifecycle/in-flight-ticks.spec.ts`
- `src/lifecycle/lifecycle.module.spec.ts`
- `src/app-setup.spec.ts`
- `src/main.spec.ts`
- `src/container-image.spec.ts` (R16–R21 y R23)
- `test/migrate.e2e-spec.ts`
- `test/one-off-scripts.e2e-spec.ts` (R22)

**Tests que cambian**:

- `src/db/drizzle.module.spec.ts`
- `src/config/config.module.spec.ts`
- `src/modules/health/infrastructure/health.controller.spec.ts`
- `test/health.e2e-spec.ts`
- las cinco `*-scheduler.service.spec.ts`

**Imagen y paquete**:

- `Dockerfile` (nuevo)
- `.dockerignore` (nuevo)
- `certs/rds-global-bundle.pem` (nuevo, descargado de AWS, R17)
- `package.json` (`start:prod`, `provision:device` y `subscription:set`)

**Comandos únicos (cambian, R21, R22)**:

- `scripts/provision-device.ts`
- `scripts/set-device-subscription.ts`

**Docs**:

- `docs/conventions.md`: filas `NODE_ENV`, `DB_POOL_MAX`, `PGHOST`, `PGPORT`,
  `PGDATABASE`, `PGUSER` y `PGPASSWORD` en la tabla de variables de entorno.
- `.env.example` (raíz del repo): líneas comentadas `# DB_POOL_MAX=10` y
  `# PGHOST=` … `# PGPASSWORD=`, para que `env-drift.mjs` no avise.

Ninguna capa `domain` ni `application` cambia.

## Contrato con #246

Esto es lo que #246 (`infra/`, CDK) consume de esta feature. #246 lo vuelve
a verificar contra el código mergeado antes de escribir la task definition.

### Imagen

- **Construcción**: `ContainerImage.fromAsset('<repo>/backend-pet-tracker', { platform: Platform.LINUX_AMD64 })`.
  El `Dockerfile` está en la raíz del contexto y el build respeta `.dockerignore`.
  El `Dockerfile` **no** fija plataforma en `FROM` (R16): la arquitectura la
  pone esta llamada, así que `platform` es obligatorio aquí.
- **Plataforma de la task definition** (API, workers y tareas únicas):
  `runtimePlatform: { cpuArchitecture: CpuArchitecture.X86_64, operatingSystemFamily: OperatingSystemFamily.LINUX }`.
- **Arranque**: `CMD ["node", "dist/src/main.js"]`, sin `ENTRYPOINT`. El
  usuario es `node`, no root.

### Puertos y health checks

- **Puerto del contenedor**: `3000`. Lo lee `process.env.PORT`, y si falta
  usa 3000.
- **Health check del target group del ALB**: `GET /v1/health/live`, que
  espera `200`.
- **Health check del contenedor** (opcional; la imagen no trae `curl`):
  ```
  node -e "fetch('http://localhost:3000/v1/health/live').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
  ```
- **`GET /v1/health`**: queda reservado para el health check de Route 53 en
  #249. El ALB no lo usa.

### Tarea de migración

- **Cómo se lanza**: es una tarea única (`RunTask`) con la misma task
  definition de la API o una propia con la misma imagen, y `command` =
  `["node", "dist/src/db/migrate.js"]`. La lanza el humano (GA4); ninguna IA.
- **Entorno**: solo `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`,
  `DB_POOL_MAX=1` y el secreto `PGPASSWORD`. `NODE_ENV` viene de la imagen.
  `migrate.js` no carga `AppConfigModule`, así que R12 no le exige
  `SIM_MODE` ni `JWT_SECRET`.
- **Permisos**: no necesita task role. La ejecución de la tarea solo
  necesita leer el secreto.
- **Resultado**: código de salida `0` si aplicó o no había nada que aplicar,
  `1` si falló. El log va en JSON y no incluye la contraseña.
- **Seeds**: ninguno (requirements §Fuera de alcance).

### Comandos únicos de operación

Dos operaciones manuales, cada una como tarea única (`RunTask`) con la misma
imagen y `command` sobrescrito. Las lanza el humano; ninguna IA.

- **Task definition**: la de la tarea de migración, ampliada con `SIM_MODE=false`
  (plano) y el secreto `WIALON_TOKEN`. El execution role de esa tarea
  necesita entonces leer también ese secreto. `DB_POOL_MAX=1`. Sin task role.
- **Alta de un collar** (`provision-device`):
  ```
  ["node", "dist/scripts/provision-device.js", "--unit-id", "<wialon-unit-id>"]
  ```
  Opcionales, cada uno seguido de su valor: `--imei`, `--serial`, `--esn`,
  `--model`. Necesita salida a Wialon. Imprime una línea
  `provision-device: <alta OK|sin cambios>, device <uuid>, activation_code <código>`.
- **Suscripción de un collar** (`set-device-subscription`):
  ```
  ["node", "dist/scripts/set-device-subscription.js", "--unit-id", "<wialon-unit-id>"]
  ```
  o con `"--device-id", "<uuid>"` en lugar de `--unit-id` (uno de los dos,
  no ambos). Opcionales: `--status` (default `active`), `--plan` (default
  `track_monthly`) y `--period-end <ISO-8601>` (default: ahora + 30 días).
  Imprime una línea `subscription:set deviceId=… status=… planCode=… …`.
- **Resultado**: código de salida `0` si terminó, distinto de `0` si falló
  (argumentos, configuración o base). La salida es texto plano, no JSON, y
  va a CloudWatch Logs con el resto de la tarea. No incluye `PGPASSWORD` ni
  `WIALON_TOKEN` (R22).
- **Fuera del contrato**: el resto de `dist/scripts/*.js`.
- **`activation_code` en el log** (decisión del leader en la firma,
  2026-11-06): se acepta. Es el código que el humano entrega con el collar y
  la tarea única no tiene otra salida. Leer CloudWatch Logs exige IAM de la
  cuenta. #246 fija la retención del grupo de logs de las tareas únicas; el
  leader propone 30 días.
- **Por qué la task definition de migración y no la de workers** (decisión
  del leader en la firma): se mantiene la de migración ampliada. #246 ya
  firma contra este contrato y el coste es un secreto más en su execution
  role.

### Apagado

- `stopTimeout` ≥ 30 s (default de ECS). El drenaje de ticks usa como máximo
  20 s, y el resto queda para el cierre HTTP y del pool.
- El `deregistration_delay` del target group es decisión de #246.

### Variables de entorno

Leyenda de «Tipo»: **plano** = valor en la task definition; **secreto** =
referencia de ECS a Secrets Manager (`secrets`), nunca `environment`.

| Variable | API | Workers | Tipo | Nota |
|---|---|---|---|---|
| `NODE_ENV` | — | — | — | Viene de la imagen (`production`). No se define. |
| `PORT` | `3000` | `3000` | plano | Los workers también levantan HTTP (misma imagen). |
| `PGHOST` | sí | sí | plano | Endpoint **escritor** del clúster Aurora. |
| `PGPORT` | `5432` | `5432` | plano | |
| `PGDATABASE` | sí | sí | plano | |
| `PGUSER` | sí | sí | plano | |
| `PGPASSWORD` | sí | sí | **secreto** | Clave `password` del secreto que genera Aurora. |
| `DB_POOL_MAX` | `10` | `5` | plano | Obligatoria en producción (R3). Tarea de migración y comandos únicos: `1`. |
| `JWT_SECRET` | sí | sí | **secreto** | Lo crea el humano (GA2). Los workers no firman tokens, pero R12 lo exige en todo proceso de producción. |
| `AWS_MODE` | `aws` | `aws` | plano | |
| `MEDIA_BUCKET_NAME` | sí | sí | plano | Obligatoria en modo `aws`. |
| `SIM_MODE` | `true`/`false` | `true`/`false` | plano | Obligatoria y explícita en producción (R12). Valor: D4 del plan. |
| `WIALON_TOKEN` | — | si `SIM_MODE=false` | **secreto** | No vacío ni `PENDING`. |
| `WIALON_BASE_URL` | — | opcional | plano | |
| `SIM_SEED`, `SIM_HOME_LAT`, `SIM_HOME_LNG` | — | opcional si `SIM_MODE=true` | plano | |
| `EMAIL_ENABLED` | según D4 | — | plano | |
| `RESEND_API_KEY` | si `EMAIL_ENABLED=true` | — | **secreto** | |
| `RESEND_FROM`, `RESET_LINK_HOST` | si `EMAIL_ENABLED=true` | — | plano | |
| `ANTHROPIC_ENABLED` | según D4 | — | plano | |
| `ANTHROPIC_API_KEY` | si `ANTHROPIC_ENABLED=true` | — | **secreto** | No vacía ni `PENDING`. |
| `ANTHROPIC_MODEL` | si `ANTHROPIC_ENABLED=true` | — | plano | |
| `PUSH_ENABLED` | — | según D4 | plano | |
| `POLLER_ENABLED`, `ACTIVITY_AGGREGATOR_ENABLED`, `ALERTS_ENGINE_ENABLED`, `NOTIFIER_ENABLED`, `REMINDERS_ENABLED` | ausentes o `false` | `true` | plano | La separación API/workers es solo esto. |

**Nunca se definen en la task definition**:

- `AWS_ENDPOINT_URL` (aborta en modo `aws`) y `AWS_PRESIGN_ENDPOINT_URL`;
- `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`, que ganarían al task role;
- `DATABASE_URL`, que se ignora en producción.

**Inyectada por Fargate**: `AWS_REGION`, junto con las credenciales del task
role.

### Recursos AWS que la app espera en modo `aws`

Nombres sin sufijo, por `resolveResourceSuffix` (`src/aws/resource-names.ts`).
#246 replica la forma de `infra/lib/pet-tracker-dev-stack.ts`.

- **Colas SQS**:
  - `positions-raw`, `notifications` y `geofence-events`;
  - cada una con su DLQ `<nombre>-dlq` y `maxReceiveCount` 3.
- **EventBridge**: bus `pet-tracker`, con la regla `geofence-events` hacia la
  cola homónima.
- **DynamoDB**: tabla `positions`, con clave `pk`/`sk` y TTL en `expires_at`.
- **S3**: el bucket de `MEDIA_BUCKET_NAME`.

### IAM mínimo por servicio

**Task role de la API**:

- `s3:PutObject` y `s3:GetObject` sobre `arn:…:<media-bucket>/*`.
  `GetObject` cubre también el `HeadObject` de la verificación de subida.
- `dynamodb:Query` sobre la tabla `positions`, para la lectura de posiciones.

**Task role de los workers**:

- `sqs:GetQueueUrl`, `sqs:ReceiveMessage` y `sqs:DeleteMessage` sobre
  `positions-raw`, `geofence-events` y `notifications`;
- `sqs:SendMessage` sobre `positions-raw` y `notifications`;
- `dynamodb:BatchWriteItem` y `dynamodb:Query` sobre `positions`;
- `events:PutEvents` sobre el bus `pet-tracker`.

**Si #246 cifra colas, tabla o bucket con una CMK**: los roles necesitan las
acciones `kms:` correspondientes (`kms:Decrypt` y `kms:GenerateDataKey`)
sobre esa clave. Con claves administradas por AWS no hace falta.

**Execution role** (los dos servicios y la tarea de migración):

- pull de ECR;
- `logs:CreateLogStream` y `logs:PutLogEvents`;
- `secretsmanager:GetSecretValue` solo sobre los secretos que referencia su
  task definition.

### Salida a internet (para D2 del plan)

| Servicio | Destinos externos |
|---|---|
| API | Resend (si `EMAIL_ENABLED`) y Anthropic (si `ANTHROPIC_ENABLED`) |
| Workers | Wialon (si `SIM_MODE=false`) y Expo Push (si `PUSH_ENABLED`) |
| Los dos | S3, SQS, DynamoDB, EventBridge, Secrets Manager, ECR y CloudWatch Logs, por VPC endpoints o NAT |

## Alternativas descartadas

- **`drizzle-kit migrate` dentro de la imagen.** Obligaría a meter
  devDependencies (`drizzle-kit`, `esbuild`) en la imagen final, y
  `drizzle.config.ts` lee `DATABASE_URL` de `../.env`. El migrator de runtime
  usa la misma tabla y el mismo journal (R15).
- **Migrar al arrancar la API.** Con N tareas arrancando a la vez, N
  migraciones competirían, y un fallo de migración tumbaría el servicio
  entero. La decisión del plan es una tarea única lanzada por el humano.
- **Base alpine (musl).** `argon2` necesitaría su prebuild musl o compilar,
  y `pg` y el resto se prueban en glibc. `bookworm-slim` tampoco trae
  compiladores.
- **`AWS_MODE` como señal de producción.** Ver DT1: las pruebas reales desde
  desarrollo usan `AWS_MODE=aws`.
- **`sslmode`/`sslrootcert` en una connection string.** Exigiría construir
  `DATABASE_URL` con la contraseña dentro (escape de caracteres, y el secreto
  pasando por una variable plana). Además, `pg` interpreta
  `sslmode=require` como `verify-full` según versión, lo que da una semántica
  frágil. Con `ssl.rejectUnauthorized` y `NODE_EXTRA_CA_CERTS`, el
  comportamiento es explícito.
- **`ADD <url>` del PEM de RDS en el build.** Lo mantendría al día, pero el
  build dependería de la red y dos builds del mismo commit podrían dar
  imágenes distintas. Se versiona el fichero y se renueva con un commit.
- **`--platform=linux/amd64` en cada `FROM`.** Fijaría la arquitectura en el
  `Dockerfile`; la decisión es que la fije quien construye (#246), para no
  bloquear un pipeline arm64 futuro.
- **Cargar `dotenv` en los scripts solo fuera de producción.** Dejaría una
  rama de código sin test en el camino de producción. `--env-file-if-exists`
  en `package.json` saca el `.env` del código.
- **Copiar la construcción del pool en cada script.** Dos copias de R3 que
  podrían divergir de la app (TLS, `DB_POOL_MAX`). Se reutiliza
  `buildPoolConfig`.
- **`node -r dotenv/config` en `package.json`.** Necesita
  `dotenv_config_path=../.env` como argumento o variable de entorno: la
  variable no funciona igual en el shell de Windows y el argumento posicional
  lo recibiría `parseArgs`, que lo rechaza.
- **Drenaje por scheduler con `onModuleDestroy` en cada uno.** Repetiría la
  misma lógica cinco veces, y `onModuleDestroy` corre antes que
  `beforeApplicationShutdown` sin orden garantizado entre módulos. Un único
  `InFlightTicks` lo resuelve una vez.
- **Logger de terceros (`pino`, `nestjs-pino`).** Sería una dependencia nueva
  para lo que `ConsoleLogger({ json: true })` ya hace.
- **Validación con `zod` o `joi` del esquema completo de entorno.** Ampliaría
  el alcance a todas las variables y cambiaría la semántica local. Solo hacen
  falta las reglas de producción de R12.
