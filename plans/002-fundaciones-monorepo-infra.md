# Plan 002: Fundaciones — monorepo, CDK e infraestructura dev desplegada

> **Instrucciones para el ejecutor**: sigue este plan paso a paso. Ejecuta cada verificación antes del siguiente paso. Ante una condición de STOP, detente y reporta. Al terminar, actualiza `plans/README.md` y `STATUS.md`.
>
> **Chequeo de deriva (ejecutar primero)**: `git log --oneline -5` debe mostrar solo los commits del plan 001 (init + design package) y debe existir `docs/architecture.md`. Si hay código de aplicación ya creado, STOP.
>
> **Precondición dura**: el usuario aprobó el paquete de diseño del plan 001 (consta en `STATUS.md` o en el mensaje que te invocó). Sin aprobación explícita, STOP — este plan crea recursos AWS reales.

## Estado

- **Prioridad**: P1 · **Esfuerzo**: L · **Riesgo**: MED (despliega infraestructura; coste si se configura mal)
- **Depende de**: `plans/001-paquete-diseno-aprobacion.md` aprobado
- **Categoría**: dx
- **Planeado en**: sin repo al planificar (2026-07-28); tras 001 existe `main` con `docs/`

## Por qué importa

Todo plan posterior asume: monorepo con workspaces, stack CDK desplegable con un comando, una Lambda NestJS respondiendo `/v1/health` detrás de API Gateway, app Expo que arranca, y comandos de verificación (`npm run verify`) idénticos en todos los planes. Este plan establece ese contrato una vez; los planes 003–010 solo añaden módulos.

## Estado actual

- Repo con `plans/` y `docs/` (del plan 001). Sin código.
- Diseño aprobado: servicios y diagrama en `docs/architecture.md`; modelo en `docs/data-model.md`.
- Máquina Windows 11, shell PowerShell. Node 20+ requerido (`node --version` para confirmar; si falta, STOP).

## Comandos que este plan establece (y que usarán todos los planes futuros)

| Propósito | Comando (desde la raíz) | Esperado |
|---|---|---|
| Instalar | `npm install` | exit 0 |
| Lint+typecheck+tests de todo | `npm run verify` | exit 0 |
| Test de un workspace | `npm -w apps/api test` | exit 0 |
| Sintetizar infra | `npm -w infra run synth` | exit 0, template en `infra/cdk.out` |
| Desplegar dev | `npm -w infra run deploy:dev` | exit 0, imprime `ApiUrl` |
| App móvil | `npm -w apps/mobile run start` | Expo dev server arriba |
| Postgres local | `docker compose up -d` | contenedor `pet-tracker-db` healthy |
| Migraciones (local) | `npm -w apps/api run db:migrate` | exit 0 |

## Alcance

**Dentro**: `package.json` raíz (workspaces), `tsconfig.base.json`, `.editorconfig`, `docker-compose.yml`, `apps/api/**`, `apps/mobile/**`, `packages/shared/**`, `infra/**`, `.env.example`, `STATUS.md`, `plans/README.md` (fila), `README.md` raíz (cómo levantar todo).

**Fuera**: cualquier endpoint de negocio (solo `/v1/health`), pantallas reales de la app (solo esqueleto de navegación y tema), lógica de Wialon, seeds. No crear entorno `prod`. No configurar dominios ni SES.

## Flujo git

`main`, sin remoto. Commits sugeridos: `chore: scaffold monorepo workspaces`, `feat(infra): cdk stack with auth, data, messaging and api`, `feat(api): nestjs skeleton on lambda with health endpoint`, `feat(mobile): expo skeleton with theme and navigation`, `docs: root readme and status`.

## Pasos

### Paso 1: Monorepo

Raíz: `package.json` con `"private": true`, `"workspaces": ["apps/*", "packages/*", "infra"]` y scripts: `"verify": "npm run lint --workspaces --if-present && npm run typecheck --workspaces --if-present && npm run test --workspaces --if-present"`. `tsconfig.base.json`: `strict: true`, `target: ES2022`, `module: NodeNext`. Workspaces: `apps/api`, `apps/mobile`, `packages/shared`, `infra`. `packages/shared`: paquete TS puro `@pet-tracker/shared` para tipos compartidos (DTOs de posiciones, enums de especies/roles — copiar los enums desde `docs/data-model.md`).

**Verificar**: `npm install` exit 0; `npm ls --workspaces` lista los 4 workspaces.

### Paso 2: Infra CDK (definir, no desplegar aún)

`infra/`: CDK v2 TypeScript (`aws-cdk-lib` ^2, `constructs`, dev-dep `aws-cdk`). `bin/pet-tracker.ts` instancia `PetTrackerStack` con `stage` desde contexto (`-c stage=dev`, default `dev`), stack name `PetTracker-dev`, región `us-east-1`. Scripts del workspace: `synth` = `cdk synth -c stage=dev`, `deploy:dev` = `cdk deploy PetTracker-dev -c stage=dev --require-approval never --outputs-file cdk-outputs.json`. Un solo stack con constructos separados por archivo (`lib/auth.ts`, `lib/data.ts`, `lib/messaging.ts`, `lib/api.ts`):

- **Auth** (`lib/auth.ts`): Cognito User Pool `pet-tracker-dev`: sign-in por email, autoverificación por código de email, atributos estándar `given_name`, `family_name`, `phone_number`, `zoneinfo` + custom `country`; política de contraseña por defecto; App Client sin secret con flujos `ALLOW_USER_SRP_AUTH` y `ALLOW_USER_PASSWORD_AUTH` (el segundo lo usan los scripts de prueba). `removalPolicy: DESTROY` en dev.
- **Data** (`lib/data.ts`):
  - Aurora Serverless v2: `rds.DatabaseCluster` engine `AURORA_POSTGRESQL` (PG 16), `serverlessV2MinCapacity: 0`, `serverlessV2MaxCapacity: 2`, `enableDataApi: true`, credenciales generadas en Secrets Manager por RDS (única excepción a SSM: lo crea RDS solo), base `pettracker`. VPC nueva mínima (2 AZ, sin NAT — `natGateways: 0`; la Data API es HTTPS, las Lambdas NO van en VPC). `removalPolicy: DESTROY`.
  - DynamoDB `positions`: `partitionKey pk (STRING)`, `sortKey sk (NUMBER)`, `BillingMode.PAY_PER_REQUEST`, `timeToLiveAttribute: 'expires_at'`, `removalPolicy: DESTROY`.
  - S3 `pet-tracker-media-dev-<account>`: bloqueo público total, CORS para PUT/GET desde `*` (dev), `removalPolicy: DESTROY` + `autoDeleteObjects: true`.
- **Messaging** (`lib/messaging.ts`): bus EventBridge `pet-tracker-dev`; colas SQS `positions-raw` (visibility 120 s) y `notifications` (visibility 60 s), cada una con DLQ (`maxReceiveCount: 3`).
- **Api** (`lib/api.ts`): `NodejsFunction` `api-handler` apuntando a `apps/api/src/lambda.ts` (bundling esbuild automático), memoria 512 MB, timeout 15 s, env: `DB_CLUSTER_ARN`, `DB_SECRET_ARN`, `DB_NAME`, `POSITIONS_TABLE`, `MEDIA_BUCKET`, `EVENT_BUS`, `STAGE=dev`, `DB_DRIVER=data-api`. Permisos: `grantDataApiAccess`, lectura del secret de RDS, RW en DynamoDB/S3, `putEvents` al bus, lectura de SSM `/pet-tracker/dev/*`. HTTP API (`aws-apigatewayv2` + integración Lambda proxy): ruta `GET /v1/health` **sin** authorizer; `ANY /v1/{proxy+}` con `HttpJwtAuthorizer` (issuer = User Pool, audience = App Client). CfnOutputs: `ApiUrl`, `UserPoolId`, `UserPoolClientId`, `MediaBucket`, `PositionsTable`, `EventBusName`, `DbClusterArn`, `DbSecretArn`.
- **Presupuesto**: `aws-budgets` CfnBudget 10 USD/mes con notificación al 80 % al email del propietario de la cuenta (usar `alexfdgf32@gmail.com`).

**Verificar**: `npm -w infra run synth` exit 0 (requiere que exista `apps/api/src/lambda.ts` del paso 3 — puedes crear los archivos del paso 3 antes de sintetizar).

### Paso 3: API NestJS sobre Lambda

`apps/api`: NestJS 10 estándar (sin CLI monorepo). Dependencias: `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `@codegenie/serverless-express`, `drizzle-orm`, `@aws-sdk/client-rds-data`, `pg` (driver local), dev: `drizzle-kit`, `jest`, `ts-jest`, `eslint`, `typescript`.

- `src/main.ts` — bootstrap local clásico (puerto 3000).
- `src/lambda.ts` — handler: cachear la app Nest entre invocaciones y delegar en `serverlessExpress({ app: expressApp })`. Patrón estándar del paquete `@codegenie/serverless-express` (init perezoso en frío, reuso en caliente).
- `src/app.module.ts` — importa `HealthModule` y `DbModule`.
- `src/modules/health/health.controller.ts` — `GET /v1/health` → `{status:'ok', stage, ts}` (prefijo global `v1` vía `app.setGlobalPrefix('v1')`).
- `src/db/` — esquema Drizzle: **transcribir el DDL de `docs/data-model.md`** a `schema.ts` (las 16 tablas), `drizzle.config.ts` con dialecto postgresql y driver conmutables por `DB_DRIVER` (`aws-data-api` con `DB_CLUSTER_ARN/DB_SECRET_ARN/DB_NAME` | `pg` con `DATABASE_URL` local), carpeta `drizzle/` para migraciones generadas. Scripts: `db:generate` (drizzle-kit generate), `db:migrate` (drizzle-kit migrate).
- Convenciones a fijar (las heredan todos los planes): DTOs con `class-validator`/`class-transformer` y `ValidationPipe` global (`whitelist: true`); filtro global de excepciones → `{statusCode, code, message}`; módulo por dominio en `src/modules/<x>/` con `controller/service/dto/`; BD snake_case ↔ TS camelCase (Drizzle mapea con nombres explícitos).
- `docker-compose.yml` raíz: Postgres 16 (`pet-tracker-db`, puerto 5433, healthcheck) para desarrollo local; `.env.example` con `DATABASE_URL=postgres://postgres:postgres@localhost:5433/pettracker`, `DB_DRIVER=pg`.

**Verificar**: `docker compose up -d` → healthy; `npm -w apps/api run db:migrate` exit 0 (contra el Postgres local); `npm -w apps/api run start:dev` y `curl http://localhost:3000/v1/health` → `{"status":"ok"...}`; test jest del health controller pasa.

### Paso 4: Bootstrap y despliegue dev

`aws sts get-caller-identity` para confirmar credenciales (si falla → STOP, pedir al usuario `aws configure`). `npx cdk bootstrap aws://<account>/us-east-1` (una vez). `npm -w infra run deploy:dev`. Luego crear los parámetros SSM placeholder (valor `PENDING` hasta tener claves reales):

```
aws ssm put-parameter --name /pet-tracker/dev/wialon-token --type SecureString --value PENDING
aws ssm put-parameter --name /pet-tracker/dev/openai-api-key --type SecureString --value PENDING
aws ssm put-parameter --name /pet-tracker/dev/google-maps-key --type SecureString --value PENDING
```

Ejecutar las migraciones contra Aurora: `DB_DRIVER=data-api` + ARNs desde `infra/cdk-outputs.json` → `npm -w apps/api run db:migrate` (primera llamada puede tardar ~15 s: Aurora reanuda desde 0 ACU; reintentar una vez si da timeout).

**Verificar**: `curl <ApiUrl>/v1/health` → 200 `{"status":"ok"}`; `curl <ApiUrl>/v1/pets` → 401 (authorizer activo); migraciones aplicadas (`db:migrate` idempotente, exit 0).

### Paso 5: App Expo esqueleto

`apps/mobile`: `npx create-expo-app@latest` (SDK estable actual, TypeScript, `expo-router`). Añadir: `aws-amplify` v6 (solo categoría Auth, configurada a mano con `UserPoolId`/`ClientId` desde un `src/config.ts` que lee `app.config.ts` extra → variables `EXPO_PUBLIC_*` en `.env`), `react-native-maps`. Estructura: `app/(auth)/` (placeholder login), `app/(tabs)/` (Inicio, Mapa, Salud, Alimentación, Perfil — pantallas placeholder), `src/theme/tokens.ts` con la paleta pastel del brief §2 (definir tokens: `primary #A8D8EA`, `secondary #FFB6B9`, `accent #FAE3D9`, `success #BBDED6`, texto `#4A4A4A`, fondos claros; tipografía por defecto del sistema) y componentes base `Screen`, `Card`, `PrimaryButton` usándolos. Textos de UI en español.

**Verificar**: `npm -w apps/mobile run typecheck` exit 0; `npm -w apps/mobile run start` arranca sin errores (probar en Expo Go si hay dispositivo; si no hay dispositivo/emulador, basta el arranque limpio del bundler — anotarlo en el reporte).

### Paso 6: README raíz, STATUS y cierre

`README.md` raíz: prerequisitos (Node 20, Docker, AWS CLI con credenciales), tabla de comandos del apartado "Comandos", estructura de carpetas, enlace a `docs/architecture.md` y `plans/README.md`. Crear/actualizar `STATUS.md` (fase: fundaciones desplegadas; ApiUrl del output). Fila 002 → DONE. Commits según flujo git.

**Verificar**: `npm run verify` exit 0 en la raíz; `git status` limpio.

## Plan de pruebas

- `apps/api`: test unitario del health controller (patrón de referencia para todos los tests futuros: `*.spec.ts` junto al archivo, jest + ts-jest).
- Infra: `synth` como gate (no se testean constructos en MVP).
- Smoke manual documentado en README: curl health 200, curl ruta protegida 401.

## Criterios de done

- [ ] `npm run verify` exit 0.
- [ ] `curl <ApiUrl>/v1/health` → 200 con `{"status":"ok"}` (URL real en `STATUS.md`).
- [ ] `curl <ApiUrl>/v1/pets` → 401.
- [ ] 16 tablas migradas en Aurora (y en Postgres local).
- [ ] 3 parámetros SSM creados (valor PENDING permitido).
- [ ] Presupuesto de 10 USD visible en AWS Budgets.
- [ ] Expo arranca; tema pastel y tabs presentes.
- [ ] `STATUS.md` + fila en `plans/README.md` actualizados; commits conventional.

## Condiciones de STOP

- No hay aprobación del plan 001 registrada → STOP (gate del brief §22).
- `aws sts get-caller-identity` falla o la cuenta no puede crear recursos (SCP/permisos) → STOP y reporta el error exacto.
- `cdk bootstrap` o `deploy` fallan dos veces tras un intento razonable de arreglo → STOP con el error de CloudFormation.
- Aurora Serverless v2 no permite `serverlessV2MinCapacity: 0` en la versión de `aws-cdk-lib` instalada → NO improvises otra base de datos: STOP y propone (a) actualizar aws-cdk-lib o (b) min 0.5 ACU con su coste estimado (~44 USD/mes), que decida el usuario.
- El bundling de `NodejsFunction` falla en Windows por esbuild → añadir `esbuild` como devDependency raíz y reintentar; si persiste, STOP.

## Notas de mantenimiento

- Este plan fija los contratos que el resto consume: nombres de outputs CDK, variables de entorno de la Lambda, scripts npm, convenciones NestJS. Cambiarlos después obliga a revisar los planes 003–010.
- `removalPolicy: DESTROY` y `autoDeleteObjects` son deliberados en dev; el stage prod (futuro) debe revisarlos.
- Revisor: comprobar que ninguna Lambda quedó dentro de la VPC (rompería el acceso a SSM/DynamoDB sin NAT) y que el App Client no tiene secret (la app móvil no puede guardarlo).
