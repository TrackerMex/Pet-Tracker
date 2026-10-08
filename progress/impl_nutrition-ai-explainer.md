Worktree: /home/claude/sites/Pet-Tracker-wt-18

# Implementación nutrition-ai-explainer (#18)

## Base

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-18
$ git branch --show-current
feature/18-nutrition-ai-explainer-claude
$ git rev-parse HEAD
704af9e591be5f1c0332ae29a8447ebf823f7b52
$ git status --short
(salida vacía)
```

H0 = `704af9e591be5f1c0332ae29a8447ebf823f7b52` (handoff). Skills cargadas: ninguna; trabajo exclusivamente backend. `./init.sh` y `pnpm test:e2e` entero: **delegado al leader**. No push ni PR. R19 reservado al humano.

pgrep inicial y anterior a e2e: `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`: salida vacía (exit 1, ningún proceso).

`git merge-base --is-ancestor fca7c399 HEAD; echo "exit=$?"` → `exit=0`.

### Las 15 anclas del handoff

```text
$ grep -cF 'assert.equal(keys.length, 24);' env-drift.test.mjs
1
```

```text
$ grep -cE '^[A-Z_]+=' .env.example
24
```

```text
$ grep -cE '^ANTHROPIC_' .env.example
0
```

```text
$ grep -c '^. `PUSH_ENABLED` ' docs/conventions.md
1
```

```text
$ grep -c '^### Feature ' docs/verification.md
18
```

```text
$ grep -cF '"@anthropic-ai/sdk"' backend-pet-tracker/package.json
0
```

```text
$ grep -cE '^  [a-zA-Z]+\(' backend-pet-tracker/src/modules/nutrition/domain/repositories/nutrition.repository.ts
5
```

```text
$ grep -cF 'aiExplanation: null,' backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts
1
```

```text
$ grep -cF 'imports: [PetsModule],' backend-pet-tracker/src/modules/nutrition/nutrition.module.ts
1
```

```text
$ grep -cF "describe('R26 (nutrition-profile-engine #17): sin dependencia openai ni env OPENAI_'" backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts
1
```

```text
$ grep -cF "describe('R26 (nutrition-profile-engine #17): aiExplanation es null'" backend-pet-tracker/test/nutrition.e2e-spec.ts
1
```

```text
$ grep -rlF 'must not leak while feature 17 is active' backend-pet-tracker/test/
backend-pet-tracker/test/nutrition.e2e-spec.ts
```

```text
$ grep -cF "toHaveProperty('aiExplanation', null)" backend-pet-tracker/test/meal-times.e2e-spec.ts
1
```

```text
$ grep -rF 'claude-' backend-pet-tracker/src/ | wc -l
0
```

```text
$ test -e backend-pet-tracker/src/modules/nutrition/infrastructure/ai; echo "exit=$?"
exit=1
```

### A1–A53 en H0

| Ancla | Comando | base declarada | H0 medido | exit |
|---|---|---|---|---|
| A1 | grep -cF 'assert.equal(keys.length, 24);' env-drift.test.mjs | 1 | 1 | 0 |
| A2 | grep -cF 'assert.equal(keys.length, 27);' env-drift.test.mjs | 0 | 0 | 1 |
| A3 | grep -cE '^[A-Z_]+=' .env.example | 24 | 24 | 0 |
| A4 | grep -cE '^ANTHROPIC_' .env.example | 0 | 0 | 1 |
| A5 | grep -cE '^OPENAI_' .env.example | 0 | 0 | 1 |
| A6 | grep -c '^. `ANTHROPIC_[A-Z_]*` ' docs/conventions.md | 0 | 0 | 1 |
| A7 | grep -c '^. `PUSH_ENABLED` ' docs/conventions.md | 1 | 1 | 0 |
| A8 | grep -cx '.env' .gitignore | 1 | 1 | 0 |
| A9 | grep -c '^### Feature ' docs/verification.md | 18 | 18 | 0 |
| A10 | grep -cF '### Feature 18 — nutrition-ai-explainer' docs/verification.md | 0 | 0 | 1 |
| A11 | grep -cF 'GPT-5 mini' plans/presupuesto-produccion.md | 2 | 2 | 0 |
| A12 | grep -rF 'claude-' $BE/src/ \| wc -l | 0 | 0 | 0 |
| A13 | grep -rlF 'gpt-' $BE/src/ | `nutrition-scope.spec.ts` | backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts | 0 |
| A14 | grep -rlF 'ANTHROPIC_' $BE/src/ --include=*.ts \| grep -v '\.spec\.ts$' | (vacío) | (vacío) | 1 |
| A15 | grep -cF '"@anthropic-ai/sdk": "0.128.0"' $BE/package.json | 0 | 0 | 1 |
| A16 | grep -cE '^  [a-zA-Z]+\(' $NUT/domain/repositories/nutrition.repository.ts | 5 | 5 | 0 |
| A17 | grep -rlF 'as unknown as NutritionRepository' $BE/src/ | 3 specs de use-case (`add-meal-time`, `serve-meal`, `move-meal-time`) | backend-pet-tracker/src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts<br>backend-pet-tracker/src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts<br>backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts | 0 |
| A18 | grep -rlF 'MockOf' $NUT/ | (vacío) | (vacío) | 1 |
| A19 | grep -cF 'aiExplanation: null,' $NUT/infrastructure/mappers/nutrition.mapper.ts | 1 | 1 | 0 |
| A20 | grep -cF 'aiExplanation: plan.aiExplanation,' $NUT/infrastructure/mappers/nutrition.mapper.ts | 0 | 0 | 1 |
| A21 | grep -cF 'aiExplanation: row.aiExplanation ?? null' $NUT/infrastructure/repositories/nutrition.drizzle.repository.ts | 1 | 1 | 0 |
| A22 | grep -cF 'imports: [PetsModule],' $NUT/nutrition.module.ts | 1 | 1 | 0 |
| A23 | grep -cF 'imports: [PetsModule, SubscriptionsModule, ConfigModule],' $NUT/nutrition.module.ts | 0 | 0 | 1 |
| A24 | grep -cF 'latestPlan?.inputsHash === inputsHash' $NUT/application/use-cases/generate-nutrition-plan.use-case.ts | 1 | 1 | 0 |
| A25 | grep -cF '...carriedSchedule(latestPlan, result),' $NUT/application/use-cases/generate-nutrition-plan.use-case.ts | 1 | 1 | 0 |
| A26 | grep -cF 'aiExplanation: plan.aiExplanation' $NUT/domain/entities/nutrition-plan.entity.ts | 1 | 1 | 0 |
| A27 | grep -cF 'export function toPlanResult(' $NUT/domain/entities/nutrition-plan.entity.ts | 0 | 0 | 1 |
| A28 | grep -cF 'z.array(z.string())' $NUT/application/dto/nutrition-profile.dto.ts | 2 | 2 | 0 |
| A29 | grep -c 'ai_explanation' $BE/src/db/migrations/0013_wet_may_parker.sql | 1 | 1 | 0 |
| A30 | grep -cF '@Inject(SUBSCRIPTION_REPOSITORY)' $BE/src/modules/devices/application/use-cases/claim-device.use-case.ts | 1 | 1 | 0 |
| A31 | grep -cF 'exports: [SUBSCRIPTION_REPOSITORY, PetTrackingGuard]' $BE/src/modules/subscriptions/subscriptions.module.ts | 1 | 1 | 0 |
| A32 | grep -rlF "this.config.get<string>('NODE_ENV') !== 'test'" $BE/src/ \| wc -l | 5 | 5 | 0 |
| A33 | grep -cF 'export function redactToken' $BE/src/workers/notifier/notifier.constants.ts | 1 | 1 | 0 |
| A34 | grep -cF "await import('expo-server-sdk')" $BE/src/workers/notifier/expo-push-sender.ts | 1 | 1 | 0 |
| A35 | grep -cF "const WIALON_TOKEN_PENDING = 'PENDING';" $BE/src/integrations/wialon/wialon.factory.ts | 1 | 1 | 0 |
| A36 | grep -cF 'toMatchObject({ petId: PET_B })' $BE/src/modules/activity/application/use-cases/aggregate-daily-activity.use-case.spec.ts | 1 | 1 | 0 |
| A37 | grep -cF 'spyOn(Logger.prototype' $BE/src/modules/activity/application/use-cases/aggregate-daily-activity.use-case.spec.ts | 2 | 2 | 0 |
| A38 | grep -cF "describe('R26 (nutrition-profile-engine #17): sin dependencia openai ni env OPENAI_'" $NUT/nutrition-scope.spec.ts | 1 | 1 | 0 |
| A39 | grep -cF "describe('R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo'" $NUT/nutrition-scope.spec.ts | 0 | 0 | 1 |
| A40 | grep -cF "describe('R26 (nutrition-profile-engine #17): aiExplanation es null'" $BE/test/nutrition.e2e-spec.ts | 1 | 1 | 0 |
| A41 | grep -rlF 'must not leak while feature 17 is active' $BE/test/ | `nutrition.e2e-spec.ts` | backend-pet-tracker/test/nutrition.e2e-spec.ts | 0 |
| A42 | grep -cF "not.toContain('DEVICE_SUBSCRIPTION_REQUIRED')" $BE/test/nutrition.e2e-spec.ts | 1 | 1 | 0 |
| A43 | grep -cF "toHaveProperty('aiExplanation', null)" $BE/test/meal-times.e2e-spec.ts | 1 | 1 | 0 |
| A44 | grep -cF "toHaveProperty('aiExplanation', 'explicacion previa')" $BE/test/meal-times.e2e-spec.ts | 0 | 0 | 1 |
| A45 | grep -cF 'imports: [AppModule],' $BE/test/nutrition.e2e-spec.ts | 1 | 1 | 0 |
| A46 | grep -cF '"@aws-sdk/client-' $BE/package.json | 4 | 4 | 0 |
| A47 | grep -rlE "from '@anthropic-ai/sdk'\|import\('@anthropic-ai/sdk'\)" $BE/src $BE/test --include=*spec.ts | (vacío) | (vacío) | 1 |
| A48 | grep -cF "await import('@anthropic-ai/sdk')" $NUT/infrastructure/ai/anthropic-nutrition-explainer.ts | (no existe) | grep: backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts: No such file or directory | 2 |
| A49 | grep -cF "from '@anthropic-ai/sdk'" $NUT/infrastructure/ai/anthropic-nutrition-explainer.ts | (no existe) | grep: backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts: No such file or directory | 2 |
| A50 | grep -cF 'maxRetries: 0' $NUT/infrastructure/ai/anthropic-nutrition-explainer.ts | (no existe) | grep: backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts: No such file or directory | 2 |
| A51 | grep -cF "'PENDING'" $NUT/infrastructure/ai/nutrition-explainer.factory.ts | (no existe) | grep: backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts: No such file or directory | 2 |
| A52 | grep -cF '.explain(' $NUT/infrastructure/ai/nutrition-explainer.factory.spec.ts | (no existe) | grep: backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts: No such file or directory | 2 |
| A53 | grep -c 'process.env' $NUT/infrastructure/ai/*.ts $NUT/domain/ports/nutrition-explainer.ts \| grep -v ':0$' | (no existen) | grep: backend-pet-tracker/src/modules/nutrition/infrastructure/ai/*.ts: No such file or directory<br>grep: backend-pet-tracker/src/modules/nutrition/domain/ports/nutrition-explainer.ts: No such file or directory | 1 |

### Línea base

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test`: exit=0.

```text
Test Suites: 176 passed, 176 total
Tests:       1348 passed, 1348 total
```

`<e2e-nut>`: exit=0.

```text
Test Suites: 3 passed, 3 total
Tests:       69 passed, 69 total
```

`node --test env-drift.test.mjs`: exit=0.

```text
# tests 28
# pass 28
# fail 0
```

## Commits y verificaciones

Las cuentas son evidencia, no criterio de aceptación; los candados se verifican por R-id. Cada paso ejecuta lint con --fix y tsc antes del commit. Logs completos en /tmp, resúmenes y fallos pertinentes transcritos aquí.

### Commit 1 — `2047dfc47d19dd04714d30b3f4323daf9de75135`

`test(nutrition-ai-explainer): derogate R26 of #17 (R1)`

Rojos heredados de R1 restantes: 6, 7, 9, 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-1-unit.json`: exit=1.

```text
Test Suites: 1 failed, 175 passed, 176 total
Tests:       4 failed, 1352 passed, 1356 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toContain(expected) // indexOf

Expected substring: "\"@anthropic-ai/sdk\": \"0.128.0\""
Received string:    "{
  \"name\": \"backend-pet-tracker\",
  \"version\": \"0.0.1\",
  \"description\": \"\",
  \"author\": \"\",
  \"private\": true,
  \"license\": \"UNLICENSED\",
  \"scripts\": {
    \"build\": \"nest build && tsc-alias -p tsconfig.build.json\",
    \"format\": \"prettier --write \\\"src/**/*.ts\\\" \\\"test/**/*.ts\\\"\",
    \"start\": \"nest start\",
    \"start:dev\": \"nest start --watch\",
    \"start:debug\": \"nest start --debug --watch\",
    \"start:prod\": \"node dist/main\",
    \"lint\": \"eslint \\\"{src,apps,libs,test}/**/*.ts\\\" --fix\",
    \"test\": \"jest\",
    \"test:watch\": \"jest --watch\",
    \"test:cov\": \"jest --coverage\",
    \"test:debug\": \"node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand\",
    \"test:e2e\": \"jest --config ./test/jest-e2e.json\",
    \"db:generate\": \"drizzle-kit generate\",
    \"db:migrate\": \"drizzle-kit migrate\",
    \"provision:local\": \"ts-node -r tsconfig-paths/register scripts/provision-local.ts\",
    \"provision:device\": \"ts-node -r tsconfig-paths/register scripts/provision-device.ts\",
    \"seed:devices\": \"ts-node -r tsconfig-paths/register scripts/seed-devices.ts\",
    \"subscription:set\": \"ts-node -r tsconfig-paths/register scripts/set-device-subscription.ts\",
    \"seed:vaccines\": \"ts-node -r tsconfig-paths/register scripts/seed-vaccines.ts\",
    \"backfill:weights\": \"ts-node -r tsconfig-paths/register scripts/backfill-weights.ts\"
  },
  \"dependencies\": {
    \"@aws-sdk/client-dynamodb\": \"^3.1098.0\",
    \"@aws-sdk/client-eventbridge\": \"^3.1098.0\",
    \"@aws-sdk/client-s3\": \"^3.1098.0\",
    \"@aws-sdk/client-sqs\": \"^3.1098.0\",
    \"@aws-sdk/lib-dynamodb\": \"^3.1101.0\",
    \"@aws-sdk/s3-request-presigner\": \"^3.1103.0\",
    \"@nestjs/common\": \"^11.0.1\",
    \"@nestjs/config\": \"^4.0.4\",
    \"@nestjs/core\": \"^11.0.1\",
    \"@nestjs/platform-express\": \"^11.0.1\",
    \"@nestjs/schedule\": \"^6.1.3\",
    \"argon2\": \"^0.45.1\",
    \"dotenv\": \"^17.4.2\",
    \"drizzle-orm\": \"^0.45.2\",
    \"expo-server-sdk\": \"^7.0.0\",
    \"jsonwebtoken\": \"^9.0.3\",
    \"pg\": \"^8.22.0\",
    \"reflect-metadata\": \"^0.2.2\",
    \"rxjs\": \"^7.8.1\",
    \"uuidv7\": \"^1.2.1\",
    \"zod\": \"^4.4.3\"
  },
  \"devDependencies\": {
    \"@eslint/eslintrc\": \"^3.2.0\",
    \"@eslint/js\": \"^9.18.0\",
    \"@nestjs/cli\": \"^11.0.0\",
    \"@nestjs/schematics\": \"^11.0.0\",
    \"@nestjs/testing\": \"^11.0.1\",
    \"@types/express\": \"^5.0.0\",
    \"@types/jest\": \"^30.0.0\",
    \"@types/jsonwebtoken\": \"^9.0.10\",
    \"@types/node\": \"^24.0.0\",
    \"@types/pg\": \"^8.20.0\",
    \"@types/supertest\": \"^7.0.0\",
    \"drizzle-kit\": \"^0.31.10\",
    \"eslint\": \"^9.18.0\",
    \"eslint-config-prettier\": \"^10.0.1\",
    \"eslint-plugin-prettier\": \"^5.2.2\",
    \"globals\": \"^17.0.0\",
    \"jest\": \"^30.0.0\",
    \"prettier\": \"^3.4.2\",
    \"source-map-support\": \"^0.5.21\",
    \"supertest\": \"^7.0.0\",
    \"ts-jest\": \"^29.2.5\",
    \"ts-loader\": \"^9.5.2\",
    \"ts-node\": \"^10.9.2\",
    \"tsc-alias\": \"^1.9.1\",
    \"tsconfig-paths\": \"^4.2.0\",
    \"typescript\": \"^5.7.3\",
    \"typescript-eslint\": \"^8.20.0\"
  },
  \"jest\": {
    \"moduleFileExtensions\": [
      \"js\",
      \"json\",
      \"ts
[Received largo recortado; log completo temporal en /tmp/nut18-1-unit.log]
```

```text
Error: expect(received).toMatch(expected)

Expected pattern: /^ANTHROPIC_ENABLED=false$/m
Received string:  "# Copia este archivo a .env (init.sh lo hace solo si falta).
# Valores de desarrollo local — nunca pongas credenciales reales aquí.·
# Postgres (docker-compose.yml)
DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker·
# Backend HTTP
PORT=3000·
# Entrega de emails de auth. Solo el literal true activa Resend; cualquier otro
# valor usa los adaptadores de consola en desarrollo local.
EMAIL_ENABLED=false
# Credenciales de Resend: solo nombres vacíos en este ejemplo. Los valores
# reales viven únicamente en el .env gitignoreado de cada entorno.
RESEND_API_KEY=
RESEND_FROM=·
# Host pelado que sirve el App Link de reset, sin esquema ni path. El dominio
# real se configura solo en los .env ignorados de backend y movil.
RESET_LINK_HOST=·
# Secreto para firmar los JWT del login propio (HS256). Valor fijo de
# desarrollo, no es un secreto real; en un deploy AWS pasaría a leerse de
# Secrets Manager sin tocar modules/auth (specs/auth-login-me/design.md).
JWT_SECRET=dev-only-jwt-secret-change-me·
# LocalStack (AWS local) — LocalStack acepta credenciales dummy
# Modo de los clientes AWS SDK v3 (#19). local (default, y cualquier valor que
# no sea exactamente \"aws\"): endpoint explicito + par estatico de credenciales
# + forcePathStyle en S3, todo contra LocalStack. aws: los clientes se
# construyen sin endpoint y sin credentials, el SDK resuelve por su cadena por
# defecto (sesion de `aws login`, que rota). En modo aws hay que comentar
# AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY de este archivo: la cadena mira las
# variables de entorno antes que la sesion (docs/verification.md, feature 19).
AWS_MODE=local
AWS_ENDPOINT_URL=http://localhost:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test·
# Bucket S3 real de media para AWS_MODE=aws (#51). Debe usar el nombre del
# stack PetTrackerDev: pet-tracker-media-dev-<accountId>. Obtenlo con
# `aws s3 ls | grep pet-tracker-media`; ver docs/verification.md, feature 51.
# La linea queda comentada para no introducir deriva en el entorno local.
# MEDIA_BUCKET_NAME=pet-tracker-media-dev-<accountId>·
# Host con el que se FIRMAN las URLs prefirmadas de S3 en modo local (#57).
# Sin ella se firma con AWS_ENDPOINT_URL (localhost) y un telefono fisico no
# las resuelve: localhost es el propio telefono (ConnectException en logcat).
# La firma SigV4 cubre el header Host, asi que hay que firmar YA con un host
# que el cliente de la URL resuelva: la IP LAN de esta maquina (la misma que
# EXPO_PUBLIC_API_URL en mobile-pet-tracker/.env) o 10.0.2.2 para el emulador
# Android. Solo modo local; en AWS_MODE=aws se ignora. Comentada por defecto:
# el valor depende de cada maquina/red (docs/verification.md, feature 57).
# AWS_PRESIGN_ENDPOINT_URL=http://192.168.x.x:4566·
# Ingesta Wialon (#8). SIM_MODE distinto de \"false\" (o token ausente/vacio/
# PENDING) => simulador FakeWialonClient; la API real solo con SIM_MODE=false
# y un WIALON_TOKEN real (specs/wialon-ingestion-pipeline R1).
SIM_MODE=true
SIM_SEED=1
SIM_HOME_LAT=19.4326
SIM_HOME_LNG=-99.1332
WIALON_TOKEN=PENDING
WIALON_BASE_URL=https://hst-api.wialon.com/wialon/ajax.html·
# Arranque de los workers de ingesta (poller cada 1 min + consumidor SQS).
# Default en codigo: false; aqui true para que la cadena local funcione
# out-of-the-box (D11). Con NODE_ENV=test jamas se agendan (R8).
POLLER_ENABLED=true·
# Arranque del
[Received largo recortado; log completo temporal en /tmp/nut18-1-unit.log]
```

```text
Error: expect(received).toContain(expected) // indexOf

Expected substring: "`ANTHROPIC_ENABLED`"
Received string:    "# Conventions — pet-tracker·
> Reglas de estilo, nombres y patrones que todo el código de este proyecto
> debe seguir. Cuando tengas duda sobre cómo hacer algo, busca aquí primero.
>
> Stack: NestJS + TypeScript + pnpm | PostgreSQL + Drizzle | Jest.
> Estructura de carpetas por capa: `docs/architecture.md`.·
---·
## Nombres de archivos·
Todo en kebab-case. Sufijo indica el rol del archivo.·
En la base de datos: tablas y columnas en `snake_case`, tablas en plural
(`pets`, `weight_entries`). El schema Drizzle mapea explícitamente
(`ownerId: uuid('owner_id')`).·
---·
## Imports / alias de rutas·
- `tsconfig.json` define `@/* -> src/*`. **Usar el alias `@/...` para
  cualquier import que cruce de módulo/feature o de capa dentro del mismo
  módulo** (ej. `@/db/drizzle.constants`,
  `@/modules/auth/domain/ports/password-hasher` desde `application/`) —
  evita cadenas `../../` frágiles al mover archivos. Import relativo (`./`,
  `../`) solo dentro de la misma capa (ej. `use-case` importando un helper
  hermano en `application/`).
- El alias está resuelto en las 3 rutas de ejecución del proyecto — no
  requiere configuración adicional por feature:
  - **Build** (`pnpm run build`): `nest build && tsc-alias -p
    tsconfig.build.json` — `tsc-alias` reescribe `@/...` a rutas relativas
    en el JS compilado (`tsc` no lo hace solo).
  - **Tests** (`pnpm test` / `pnpm run test:e2e`): `moduleNameMapper` en el
    bloque `jest` de `package.json` y en `test/jest-e2e.json`
    (`\"^@/(.*)$\": \"<rootDir>/$1\"`, ajustado al `rootDir` de cada config).
  - **Scripts standalone fuera de Nest** (ej. `drizzle.config.ts`, futuros
    scripts en `scripts/`): si el script importa algo de `src/` via `@/`,
    ejecutarlo con `ts-node -r tsconfig-paths/register <script>` (paquete
    `tsconfig-paths` ya está en `devDependencies`).
- La feature `db-setup-drizzle` (#1) se implementó **antes** de que esta
  convención quedara documentada y usa imports relativos en todo `src/`
  (incluye una cadena `../../../../db/drizzle.constants`); no se corrigió
  retroactivamente. Todo código nuevo debe seguir la regla del alias de
  aquí en adelante.
- Historial de la regla: hasta 2026-08-01 el salto de capa dentro del mismo
  módulo permitía import relativo (`../../domain/...`); se endureció a alias
  por decisión humana y `src/modules/auth/` se refactorizó para cumplirla.·
---·
## Tokens de inyección / resolución de dependencias·
Los casos de uso dependen de interfaces, no de implementaciones. NestJS borra
las interfaces en runtime, así que cada interface de repositorio exporta su
token junto a ella:·
```typescript
// domain/repositories/pet.repository.ts
export const PET_REPOSITORY = Symbol('PetRepository');·
export interface PetRepository {
  findByOwner(ownerId: string): Promise<Pet[]>;
}
```·
**Regla**: el token se define UNA vez (junto a la interface) y se importa en
el `@Inject(...)` y en el `provide:` del module. Nunca strings literales
re-tecleados — un typo compila y explota en runtime.·
```typescript
// application/use-cases/register-pet.use-case.ts
constructor(@Inject(PET_REPOSITORY) private readonly pets: PetRepository) {}·
// pets.module.ts
{ provide: PET_REPOSITORY, useClass: PetDrizzleRepository }
```·
La conexión Drizzle se inyecta con el token `DRIZZLE` exportado por
`src/db/drizzle.module.ts`.·
---·
## DTOs / validación de entrada·
- Librería:
[Received largo recortado; log completo temporal en /tmp/nut18-1-unit.log]
```

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-1-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 2 — `6e1e5847b107702336122936d51885f61932ea60`

`feat(nutrition-ai-explainer): add Anthropic env vars (R4)`

Rojos heredados de R1 restantes: 6, 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-2-unit.json`: exit=1.

```text
Test Suites: 1 failed, 175 passed, 176 total
Tests:       2 failed, 1354 passed, 1356 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toContain(expected) // indexOf

Expected substring: "\"@anthropic-ai/sdk\": \"0.128.0\""
Received string:    "{
  \"name\": \"backend-pet-tracker\",
  \"version\": \"0.0.1\",
  \"description\": \"\",
  \"author\": \"\",
  \"private\": true,
  \"license\": \"UNLICENSED\",
  \"scripts\": {
    \"build\": \"nest build && tsc-alias -p tsconfig.build.json\",
    \"format\": \"prettier --write \\\"src/**/*.ts\\\" \\\"test/**/*.ts\\\"\",
    \"start\": \"nest start\",
    \"start:dev\": \"nest start --watch\",
    \"start:debug\": \"nest start --debug --watch\",
    \"start:prod\": \"node dist/main\",
    \"lint\": \"eslint \\\"{src,apps,libs,test}/**/*.ts\\\" --fix\",
    \"test\": \"jest\",
    \"test:watch\": \"jest --watch\",
    \"test:cov\": \"jest --coverage\",
    \"test:debug\": \"node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand\",
    \"test:e2e\": \"jest --config ./test/jest-e2e.json\",
    \"db:generate\": \"drizzle-kit generate\",
    \"db:migrate\": \"drizzle-kit migrate\",
    \"provision:local\": \"ts-node -r tsconfig-paths/register scripts/provision-local.ts\",
    \"provision:device\": \"ts-node -r tsconfig-paths/register scripts/provision-device.ts\",
    \"seed:devices\": \"ts-node -r tsconfig-paths/register scripts/seed-devices.ts\",
    \"subscription:set\": \"ts-node -r tsconfig-paths/register scripts/set-device-subscription.ts\",
    \"seed:vaccines\": \"ts-node -r tsconfig-paths/register scripts/seed-vaccines.ts\",
    \"backfill:weights\": \"ts-node -r tsconfig-paths/register scripts/backfill-weights.ts\"
  },
  \"dependencies\": {
    \"@aws-sdk/client-dynamodb\": \"^3.1098.0\",
    \"@aws-sdk/client-eventbridge\": \"^3.1098.0\",
    \"@aws-sdk/client-s3\": \"^3.1098.0\",
    \"@aws-sdk/client-sqs\": \"^3.1098.0\",
    \"@aws-sdk/lib-dynamodb\": \"^3.1101.0\",
    \"@aws-sdk/s3-request-presigner\": \"^3.1103.0\",
    \"@nestjs/common\": \"^11.0.1\",
    \"@nestjs/config\": \"^4.0.4\",
    \"@nestjs/core\": \"^11.0.1\",
    \"@nestjs/platform-express\": \"^11.0.1\",
    \"@nestjs/schedule\": \"^6.1.3\",
    \"argon2\": \"^0.45.1\",
    \"dotenv\": \"^17.4.2\",
    \"drizzle-orm\": \"^0.45.2\",
    \"expo-server-sdk\": \"^7.0.0\",
    \"jsonwebtoken\": \"^9.0.3\",
    \"pg\": \"^8.22.0\",
    \"reflect-metadata\": \"^0.2.2\",
    \"rxjs\": \"^7.8.1\",
    \"uuidv7\": \"^1.2.1\",
    \"zod\": \"^4.4.3\"
  },
  \"devDependencies\": {
    \"@eslint/eslintrc\": \"^3.2.0\",
    \"@eslint/js\": \"^9.18.0\",
    \"@nestjs/cli\": \"^11.0.0\",
    \"@nestjs/schematics\": \"^11.0.0\",
    \"@nestjs/testing\": \"^11.0.1\",
    \"@types/express\": \"^5.0.0\",
    \"@types/jest\": \"^30.0.0\",
    \"@types/jsonwebtoken\": \"^9.0.10\",
    \"@types/node\": \"^24.0.0\",
    \"@types/pg\": \"^8.20.0\",
    \"@types/supertest\": \"^7.0.0\",
    \"drizzle-kit\": \"^0.31.10\",
    \"eslint\": \"^9.18.0\",
    \"eslint-config-prettier\": \"^10.0.1\",
    \"eslint-plugin-prettier\": \"^5.2.2\",
    \"globals\": \"^17.0.0\",
    \"jest\": \"^30.0.0\",
    \"prettier\": \"^3.4.2\",
    \"source-map-support\": \"^0.5.21\",
    \"supertest\": \"^7.0.0\",
    \"ts-jest\": \"^29.2.5\",
    \"ts-loader\": \"^9.5.2\",
    \"ts-node\": \"^10.9.2\",
    \"tsc-alias\": \"^1.9.1\",
    \"tsconfig-paths\": \"^4.2.0\",
    \"typescript\": \"^5.7.3\",
    \"typescript-eslint\": \"^8.20.0\"
  },
  \"jest\": {
    \"moduleFileExtensions\": [
      \"js\",
      \"json\",
      \"ts
[Received largo recortado; log completo temporal en /tmp/nut18-2-unit.log]
```

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-2-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 3 — `d6a3b00293f69aaf55967edb0738a877b44c38ae`

`build(nutrition-ai-explainer): add @anthropic-ai/sdk 0.128.0 (R1)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-3-unit.json`: exit=1.

```text
Test Suites: 1 failed, 175 passed, 176 total
Tests:       1 failed, 1355 passed, 1356 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-3-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 4 — `666aa6bf77ce22e2c3ca1b14169fa9777b7826f4`

`test(nutrition-ai-explainer): lock versioned system prompt (R6)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-4-unit.json`: exit=1.

```text
Test Suites: 2 failed, 175 passed, 177 total
Tests:       3 failed, 1355 passed, 1358 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- failed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- failed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Eres el asistente de nutrición de Pet Tracker. Explica planes de alimentación de mascotas en español sencillo y cálido. Nunca des diagnósticos, nunca contradigas al veterinario, incluye siempre que es orientativo. Máximo 180 palabras."
Received: ""
```

```text
Error: expect(received).toContain(expected) // indexOf

Expected substring: "2026-08-18"
Received string:    "export const NUTRITION_AI_SYSTEM_PROMPT = '';
"
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-4-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 5 — `f22076bb2e2ab66a5f6fc65fc2206f1fa671a2c7`

`feat(nutrition-ai-explainer): add versioned nutrition system prompt (R6)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-5-unit.json`: exit=1.

```text
Test Suites: 1 failed, 176 passed, 177 total
Tests:       1 failed, 1357 passed, 1358 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-5-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 6 — `cd27a788b43400187d184cdbe8a4e1d0ec01d081`

`test(nutrition-ai-explainer): lock user prompt to input and result (R7)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-6-unit.json`: exit=1.

```text
Test Suites: 2 failed, 175 passed, 177 total
Tests:       2 failed, 1359 passed, 1361 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- failed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 4
+ Received  + 1

- Array [
-   "input",
-   "result",
- ]
+ Array []
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-6-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 7 — `263413fde44e0948659a5165dd575d5eaaf291fb`

`feat(nutrition-ai-explainer): build user prompt from input and result only (R7)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-7-unit.json`: exit=1.

```text
Test Suites: 1 failed, 176 passed, 177 total
Tests:       1 failed, 1360 passed, 1361 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-7-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 8 — `92c00cffa219be26f1e42422b35d056a5e84f0a8`

`test(nutrition-ai-explainer): lock caps on allergies and diseases (R8)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-8-unit.json`: exit=1.

```text
Test Suites: 2 failed, 175 passed, 177 total
Tests:       6 failed, 1364 passed, 1370 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- failed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- failed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- failed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- failed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- failed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

```text
Error: expect(received).toHaveLength(expected)

Expected length: 20
Received length: 25
Received array:  ["item-0", "item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7", "item-8", "item-9", …]
```

```text
Error: expect(received).toHaveLength(expected)

Expected length: 20
Received length: 25
Received array:  ["item-0", "item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7", "item-8", "item-9", …]
```

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
Received: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
Received: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```text
Error: expect(received).toBeLessThan(expected)

Expected: < 8000
Received:   25480
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-8-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 9 — `b31a53a210a2f08a393cf4dcfb87cc6342981415`

`feat(nutrition-ai-explainer): cap allergies and diseases in the user prompt (R8)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-9-unit.json`: exit=1.

```text
Test Suites: 1 failed, 176 passed, 177 total
Tests:       1 failed, 1369 passed, 1370 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-9-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 10 — `20b3ce7b1ce8a497acdb40285bb81f152564041e`

`test(nutrition-ai-explainer): lock Anthropic call parameters (R9)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-10-unit.json`: exit=1.

```text
Test Suites: 2 failed, 176 passed, 178 total
Tests:       3 failed, 1370 passed, 1373 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- failed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- failed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes

```text
Error: not implemented (R9)
```

```text
Error: expect(received).toContain(expected) // indexOf

Expected substring: "apiKey: this.apiKey"
Received string:    "import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';
import type {
  NutritionExplainer,
  NutritionExplainerContext,
} from '@/modules/nutrition/domain/ports/nutrition-explainer';·
export const NUTRITION_AI_TIMEOUT_MS = 15_000;
export const NUTRITION_AI_MAX_RETRIES = 0;
export const NUTRITION_AI_MAX_OUTPUT_TOKENS = 1_200;
export interface AnthropicMessageParams {
  model: string;
  max_tokens: number;
  system: string;
  messages: { role: 'user'; content: string }[];
}
export interface AnthropicMessageResponse {
  content: unknown;
  stop_reason?: string | null;
  usage?: { input_tokens: number; output_tokens: number };
}
export interface AnthropicMessagesClient {
  create(params: AnthropicMessageParams): Promise<AnthropicMessageResponse>;
}
export class AnthropicNutritionExplainer implements NutritionExplainer {
  constructor(
    private readonly model: string,
    private readonly apiKey: string,
    private client: AnthropicMessagesClient | null,
  ) {}
  explain(
    input: NutritionEngineInput,
    result: NutritionPlanResult,
    ctx: NutritionExplainerContext,
  ): Promise<string | null> {
    void input;
    void result;
    void ctx;
    return Promise.reject(new Error('not implemented (R9)'));
  }
}
"
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-10-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 11 — `3a966e2e39a37964022bd80b98f769f8e7c00160`

`feat(nutrition-ai-explainer): add Anthropic nutrition explainer (R9)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-11-unit.json`: exit=1.

```text
Test Suites: 1 failed, 177 passed, 178 total
Tests:       1 failed, 1372 passed, 1373 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-11-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 12 — `12047becdfc4c33b0188bb9a127c29dd00309d34`

`test(nutrition-ai-explainer): lock response normalization (R10)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-12-unit.json`: exit=1.

```text
Test Suites: 2 failed, 176 passed, 178 total
Tests:       15 failed, 1373 passed, 1388 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- failed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn

```text
Error: expect(received).resolves.toBeNull()

Received: "Tu perro necesita..."
```

```text
Error: expect(received).resolves.toBeNull()

Received: "Tu perro necesita..."
```

```text
Error: expect(received).resolves.toBeNull()

Received: "Tu perro necesita..."
```

```text
Error: expect(received).resolves.toBeNull()

Received: "Tu perro necesita..."
```

```text
Error: expect(received).resolves.toBeNull()

Received: "Tu perro necesita..."
```

```text
Error: expect(received).resolves.toBeNull()

Received: "Tu perro necesita..."
```

```text
Error: expect(received).resolves.toBeNull()

Received: "Tu perro necesita..."
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(received).resolves.toBeNull()

Received: ""
```

```text
Error: expect(received).resolves.toBeNull()

Received: "   "
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(received).resolves.toBe(expected) // Object.is equality

Expected: "Tu perro necesita..."
Received: "Tu perro "
```

```text
Error: expect(received).resolves.toBe(expected) // Object.is equality

Expected: "Tu perro necesita..."
Received: "  Tu perro necesita...  "
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-12-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 13 — `d2de8b209d0967208278da625d4e89bc90f9ae95`

`feat(nutrition-ai-explainer): normalize Anthropic response to text or null (R10)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-13-unit.json`: exit=1.

```text
Test Suites: 1 failed, 177 passed, 178 total
Tests:       1 failed, 1387 passed, 1388 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-13-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 14 — `6411c9815cd1ed3579d957473889bc2a6b480a34`

`test(nutrition-ai-explainer): lock degradation to null on any failure (R11)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-14-unit.json`: exit=1.

```text
Test Suites: 2 failed, 176 passed, 178 total
Tests:       8 failed, 1387 passed, 1395 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- failed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- failed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- failed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- failed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- failed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- failed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- failed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

```text
Error: expect(received).resolves.toBeNull()

Received promise rejected instead of resolved
Rejected to value: [Error: invalid x-api-key]
```

```text
Error: expect(received).resolves.toBeNull()

Received promise rejected instead of resolved
Rejected to value: [Error: rate_limit_error]
```

```text
Error: expect(received).resolves.toBeNull()

Received promise rejected instead of resolved
Rejected to value: [Error: overloaded_error]
```

```text
Error: expect(received).resolves.toBeNull()

Received promise rejected instead of resolved
Rejected to value: [Error: api_error]
```

```text
Error: expect(received).resolves.toBeNull()

Received promise rejected instead of resolved
Rejected to value: [Error: Connection error.]
```

```text
Error: expect(received).resolves.toBeNull()

Received promise rejected instead of resolved
Rejected to value: [Error: Request timed out.]
```

```text
Error: expect(received).resolves.toBeNull()

Received promise rejected instead of resolved
Rejected to value: "boom"
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-14-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 15 — `56aebc09a012ddda37cfbfa043ea56482caad21e`

`feat(nutrition-ai-explainer): degrade to null with one warn on any failure (R11)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-15-unit.json`: exit=1.

```text
Test Suites: 1 failed, 177 passed, 178 total
Tests:       1 failed, 1394 passed, 1395 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-15-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 16 — `a589818c69ce81461e9c27da53343528480bcfef`

`test(nutrition-ai-explainer): lock NODE_ENV test guard in explainer factory (R3)`

Rojos heredados de R1 restantes: 10; R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-16-unit.json`: exit=1.

```text
Test Suites: 2 failed, 177 passed, 179 total
Tests:       3 failed, 1394 passed, 1397 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- failed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 1

- Array [
-   "modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts",
- ]
+ Array []
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- failed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- failed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "node-env-test"
Received: "not-enabled"
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: AnthropicNutritionExplainer
Received constructor: NullNutritionExplainer
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-16-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 17 — `e41e0fec1bf518221a73bbe669a47aa01b2cac34`

`feat(nutrition-ai-explainer): guard NODE_ENV test first and pin AI off in e2e (R3)`

Rojos heredados de R1 restantes: R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-17-unit.json`: exit=0.

```text
Test Suites: 179 passed, 179 total
Tests:       1397 passed, 1397 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-17-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 18 — `f1bc9aaf4b965f8899af7295469fb5be0eb52bd5`

`test(nutrition-ai-explainer): lock explainer selection and null adapter (R5)`

Rojos heredados de R1 restantes: R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-18-unit.json`: exit=1.

```text
Test Suites: 2 failed, 178 passed, 180 total
Tests:       17 failed, 1400 passed, 1417 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- failed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- failed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- failed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- failed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- failed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-18-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 19 — `802fda34a7daf121016a4d8f13af12e3ee72f8e8`

`feat(nutrition-ai-explainer): select explainer in one factory and wire NUTRITION_EXPLAINER (R5)`

Rojos heredados de R1 restantes: R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-19-unit.json`: exit=0.

```text
Test Suites: 180 passed, 180 total
Tests:       1417 passed, 1417 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-19-e2e-nut.json`: exit=1.

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 68 passed, 69 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada

### Commit 20 — `7cfd618a6541ea848f0a0c476773aea056432144`

`test(nutrition-ai-explainer): lock mapper returning persisted explanation (R17)`

Rojos heredados de R1 restantes: R1(c), PATCH de #103. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-20-unit.json`: exit=1.

```text
Test Suites: 1 failed, 180 passed, 181 total
Tests:       2 failed, 1418 passed, 1420 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- failed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- failed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "texto"
Received: null
```

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "texto"
Received: null
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-20-e2e-nut.json`: exit=1.

```text
Test Suites: 2 failed, 1 passed, 3 total
Tests:       3 failed, 69 passed, 72 total
```

`backend-pet-tracker/test/meal-times.e2e-spec.ts`:

- failed: Meal schedule editing (e2e) R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve hereda la explicacion y el hash y generate devuelve la misma copia

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "explicacion previa"
Received value: null
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada
- failed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve texto sembrado y trece claves aunque no haya collar
- failed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides POST meal-times hereda y devuelve texto sembrado
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve null cuando la fila tiene NULL

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "texto sembrado"
Received value: null
```

```text
Error: expect(received).toHaveProperty(path, value)

Expected path: "aiExplanation"

Expected value: "texto sembrado"
Received value: null
```

### Commit 21 — `d5c6d16c7b5ff6a95f7998bc65143fe498b011b6`

`feat(nutrition-ai-explainer): return persisted aiExplanation from mapper (R17)`

Rojos heredados de R1 restantes: ninguno. Ningún otro rojo salvo los propios del requisito en este paso, enumerados abajo.

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-21-unit.json`: exit=0.

```text
Test Suites: 181 passed, 181 total
Tests:       1420 passed, 1420 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-21-e2e-nut.json`: exit=0.

```text
Test Suites: 3 passed, 3 total
Tests:       72 passed, 72 total
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve texto sembrado y trece claves aunque no haya collar
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides POST meal-times hereda y devuelve texto sembrado
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve null cuando la fila tiene NULL

### Commit 22 — `8a32bbbaedc300126b3162adf4b6045f52662b49`

`test(nutrition-ai-explainer): lock setAiExplanation on repository (R13)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-22-unit.json`: exit=1.

```text
Test Suites: 1 failed, 181 passed, 182 total
Tests:       1 failed, 1420 passed, 1421 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- failed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

```text
Error: not implemented (R13)
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

### Commit 23 — `d7112b2c1ea8d386c2cf3404c98725cd7ef76d88`

`feat(nutrition-ai-explainer): add setAiExplanation to nutrition repository (R13)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-23-unit.json`: exit=0.

```text
Test Suites: 182 passed, 182 total
Tests:       1421 passed, 1421 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

### Commit 24 — `c58292d644b630c9d950a10a5f1e418fcac23a3f`

`test(nutrition-ai-explainer): lock insert-then-explain flow (R12)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-24-unit.json`: exit=1.

```text
Test Suites: 1 failed, 182 passed, 183 total
Tests:       4 failed, 1421 passed, 1425 total
```

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- failed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- failed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- failed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- failed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: not implemented (R12)
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

### Commit 25 — `f9e48a45187879597d9977f1b5e7f6d18f7e168b`

`feat(nutrition-ai-explainer): explain persisted plan after insert (R12)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-25-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1425 passed, 1425 total
```

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-25-e2e-nut.json`: exit=0.

```text
Test Suites: 3 passed, 3 total
Tests:       72 passed, 72 total
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve texto sembrado y trece claves aunque no haya collar
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides POST meal-times hereda y devuelve texto sembrado
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve null cuando la fila tiene NULL

### Commit 26 — `66b5fc261a0b22825e45b6474e41a80fe1ca8095`

`test(nutrition-ai-explainer): lock entitlement gate before explain (R14)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-26-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1427 passed, 1427 total
```

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log anti-vacio: con entitlement llama una vez y devuelve texto

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

### Commit 27 omitido

Guarda nacida verde; no se crea un feat vacío. El rojo se acredita con la sonda §Sondas R14.

### Commit 28 — `ca3108e9f1ba30e38fa7f00abb33ce49e503cf66`

`test(nutrition-ai-explainer): lock retry on hash hit without explanation (R15)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-28-unit.json`: exit=1.

```text
Test Suites: 1 failed, 182 passed, 183 total
Tests:       2 failed, 1428 passed, 1430 total
```

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log anti-vacio: con entitlement llama una vez y devuelve texto
- failed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y texto actualiza la misma fila usando su horario editado
- failed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y null devuelve latest sin insertar ni actualizar
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement false no explica, actualiza ni inserta

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

```text
Error: expect(jest.fn()).toHaveBeenCalledTimes(expected)

Expected number of calls: 1
Received number of calls: 0
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

### Commit 29 — `c2e6a7d1435d2f64e7c7a5d1282a5ab1298c9403`

`feat(nutrition-ai-explainer): retry explanation on same row when null (R15)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-29-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1430 passed, 1430 total
```

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log anti-vacio: con entitlement llama una vez y devuelve texto
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y texto actualiza la misma fila usando su horario editado
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y null devuelve latest sin insertar ni actualizar
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement false no explica, actualiza ni inserta

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-29-e2e-nut.json`: exit=0.

```text
Test Suites: 3 passed, 3 total
Tests:       72 passed, 72 total
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve texto sembrado y trece claves aunque no haya collar
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides POST meal-times hereda y devuelve texto sembrado
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve null cuando la fila tiene NULL

### Commit 30 — `c74d52d81dff25d5f1a5742a7922eabf596cc3cb`

`test(nutrition-ai-explainer): lock no re-call on hash hit with explanation (R16)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-30-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1431 passed, 1431 total
```

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log anti-vacio: con entitlement llama una vez y devuelve texto
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y texto actualiza la misma fila usando su horario editado
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y null devuelve latest sin insertar ni actualizar
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement false no explica, actualiza ni inserta
- passed: R16 (nutrition-ai-explainer #18): hash hit con texto no vuelve a pagar devuelve latest sin IA, entitlement, UPDATE ni INSERT

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

### Commit 31 omitido

Guarda nacida verde; no se crea un feat vacío. El rojo se acredita con la sonda §Sondas R16-unit.

### Commit 32 — `37431787c3ad0e3f2d675f4da147d9504ac96b5b`

`test(nutrition-ai-explainer): lock explanation end to end over HTTP and Postgres (R18)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-32-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1431 passed, 1431 total
```

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log anti-vacio: con entitlement llama una vez y devuelve texto
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y texto actualiza la misma fila usando su horario editado
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y null devuelve latest sin insertar ni actualizar
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement false no explica, actualiza ni inserta
- passed: R16 (nutrition-ai-explainer #18): hash hit con texto no vuelve a pagar devuelve latest sin IA, entitlement, UPDATE ni INSERT

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition-ai-explainer.e2e-spec.ts --json --outputFile=/tmp/nut18-32-e2e-ai.json`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

`backend-pet-tracker/test/nutrition-ai-explainer.e2e-spec.ts`:

- passed: Nutrition AI explainer (e2e HTTP y Postgres) R18 (nutrition-ai-explainer #18): explicacion de punta a punta generate, Postgres y GET devuelven el texto y ctx contiene el id persistido

### Commit 33 — `903548c36cfd22c9863e94f93e3186dee7cd3578`

`test(nutrition-ai-explainer): lock setAiExplanation row targeting over HTTP (R13)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-33-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1431 passed, 1431 total
```

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log anti-vacio: con entitlement llama una vez y devuelve texto
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y texto actualiza la misma fila usando su horario editado
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y null devuelve latest sin insertar ni actualizar
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement false no explica, actualiza ni inserta
- passed: R16 (nutrition-ai-explainer #18): hash hit con texto no vuelve a pagar devuelve latest sin IA, entitlement, UPDATE ni INSERT

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition-ai-explainer.e2e-spec.ts --json --outputFile=/tmp/nut18-33-e2e-ai.json`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

`backend-pet-tracker/test/nutrition-ai-explainer.e2e-spec.ts`:

- passed: Nutrition AI explainer (e2e HTTP y Postgres) R18 (nutrition-ai-explainer #18): explicacion de punta a punta generate, Postgres y GET devuelven el texto y ctx contiene el id persistido
- passed: Nutrition AI explainer (e2e HTTP y Postgres) R13 (nutrition-ai-explainer #18): UPDATE solo de la segunda fila por id conserva P1 null y todos los campos insertados de P2 excepto la explicacion

### Coordinación previa al commit 34

El primer intento de verificación se detuvo antes de e2e (lint, tsc y unitarios ya verdes) porque pgrep mostró:

```text
804362 /bin/bash -lc FORCE_COLOR=0 pnpm run test:e2e -- media-docs > /tmp/157-base-e2e.txt 2>&1; echo "exit=$?"
804367 node /home/claude/.npm-global/bin/pnpm run test:e2e -- media-docs
```

No se lanzó ningún e2e propio en ese intento. Tras esperar, se repitió el pgrep: salida vacía, exit=1. Se reinició la verificación del mismo test, sin reescribirlo ni tocar el otro worktree.

### Commit 34 — `7f3ad8ba19ebfe05c608a0902cd3b3ca21429bc4`

`test(nutrition-ai-explainer): lock hash hit not paying twice over HTTP (R16)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-34-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1431 passed, 1431 total
```

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log anti-vacio: con entitlement llama una vez y devuelve texto
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y texto actualiza la misma fila usando su horario editado
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y null devuelve latest sin insertar ni actualizar
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement false no explica, actualiza ni inserta
- passed: R16 (nutrition-ai-explainer #18): hash hit con texto no vuelve a pagar devuelve latest sin IA, entitlement, UPDATE ni INSERT

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-34-e2e-nut.json`: exit=0.

```text
Test Suites: 3 passed, 3 total
Tests:       72 passed, 72 total
```

`backend-pet-tracker/test/nutrition.e2e-spec.ts`:

- passed: Nutrition profile and plans (e2e) R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null persiste null y responde 200 con la IA apagada
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve texto sembrado y trece claves aunque no haya collar
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides POST meal-times hereda y devuelve texto sembrado
- passed: Nutrition profile and plans (e2e) R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides GET devuelve null cuando la fila tiene NULL

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition-ai-explainer.e2e-spec.ts --json --outputFile=/tmp/nut18-34-e2e-ai.json`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

`backend-pet-tracker/test/nutrition-ai-explainer.e2e-spec.ts`:

- passed: Nutrition AI explainer (e2e HTTP y Postgres) R18 (nutrition-ai-explainer #18): explicacion de punta a punta generate, Postgres y GET devuelven el texto y ctx contiene el id persistido
- passed: Nutrition AI explainer (e2e HTTP y Postgres) R13 (nutrition-ai-explainer #18): UPDATE solo de la segunda fila por id conserva P1 null y todos los campos insertados de P2 excepto la explicacion
- passed: Nutrition AI explainer (e2e HTTP y Postgres) R16 (nutrition-ai-explainer #18): hash hit no vuelve a pagar por HTTP dos generate devuelven mismo id y texto con una fila y una llamada

### Commit 35 — `dbedf414d4111d775a076090e7a5c79838644764`

`docs(nutrition-ai-explainer): add feature 18 smoke test procedure (R19)`

`pnpm lint`: exit=0.

```text
Sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-35-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1431 passed, 1431 total
```

`backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts`:

- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: asercion 6 dependencia exacta
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 7 variables y centinela
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 9 documenta las tres variables
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R5: asercion 10 solo el factory lee la configuracion
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK
- passed: R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real

`backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts`:

- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE INSERT < entitlement < IA < UPDATE con aiExplanation inicial null
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE IA null devuelve el plan insertado sin UPDATE
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE explica las siete claves del plan persistido con horario distinto del motor y ctx de trazas
- passed: R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE toPlanResult proyecta exactamente las siete claves sin identificadores
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error
- passed: R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log anti-vacio: con entitlement llama una vez y devuelve texto
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y texto actualiza la misma fila usando su horario editado
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement true y null devuelve latest sin insertar ni actualizar
- passed: R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila entitlement false no explica, actualiza ni inserta
- passed: R16 (nutrition-ai-explainer #18): hash hit con texto no vuelve a pagar devuelve latest sin IA, entitlement, UPDATE ni INSERT

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:

- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada
- passed: R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada anti-vacio: development selecciona Anthropic sin invocarlo
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto NODE_ENV=test devuelve nulo por node-env-test
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=undefined devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=false devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=TRUE devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED=1 devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_ENABLED= true devuelve nulo por not-enabled
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=undefined devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=    devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY=PENDING devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_API_KEY= PENDING  devuelve nulo por key-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=undefined devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL= devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto ANTHROPIC_MODEL=    devuelve nulo por model-missing
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto evalua NODE_ENV antes que la clave PENDING
- passed: R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

`backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts`:

- passed: R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado actualiza una sola columna en el plan indicado sin insertar ni releer

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts`:

- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado node-env-test resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado not-enabled resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado key-missing resuelve null con un warn completo
- passed: R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado model-missing resuelve null con un warn completo

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:

- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada fija timeout, reintentos y tope de tokens
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada llama una vez con exactamente model, max_tokens, system y messages
- passed: R9 (nutrition-ai-explainer #18): parametros exactos de la llamada construye el cliente perezoso con clave explicita y constantes
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada max_tokens con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada refusal con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada stop_sequence con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada tool_use con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada pause_turn con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada null con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada valor_futuro con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada thinking con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada texto vacio con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada espacios con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn degrada content null sin usage con exactamente un warn completo
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: thinking y texto devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: dos bloques devuelve texto sin warn
- passed: R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn anti-vacio: trim devuelve texto sin warn
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 401: invalid x-api-key
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 429: rate_limit_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 529: overloaded_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada 500: api_error
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Connection error.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada undefined: Request timed out.
- passed: R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn degrada string: boom

`backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`:

- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado envia el texto de producto sin cambios
- passed: R6 (nutrition-ai-explainer #18): system prompt literal y versionado versiona la fecha en la fuente
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores serializa exactamente dos objetos con diez y siete claves
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores no filtra foodType, nombre, email ni UUID del perfil o plan
- passed: R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores tiene dos parametros y no recibe ctx
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON fija veinte elementos y cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de allergies en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON conserva los primeros veinte de diseases en orden
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de allergies a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON recorta cada elemento de diseases a cien caracteres
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON acota la longitud de ambos arrays al maximo
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON mantiene la inyeccion como valor JSON sin instrucciones concatenadas
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: allergies dentro de cota pasa integro
- passed: R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON anti-vacio: diseases dentro de cota pasa integro

`backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`:

- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida devuelve texto y exactamente once claves sin inputsHash
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida conserva null
- passed: R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida today devuelve texto y exactamente trece claves

## P5

Verificado por lectura del código instalado de `@anthropic-ai/sdk` **0.128.0**, sin importar ni construir un cliente. En `backend-pet-tracker/node_modules/@anthropic-ai/sdk/src/client.ts`, el constructor de `BaseAnthropic` tiene `baseURL = readEnv('ANTHROPIC_BASE_URL')`; resuelve por separado `apiKey` y `authToken`. Si `authToken === undefined` y no se pasa `profile`, ejecuta `readEnv('ANTHROPIC_AUTH_TOKEN') ?? null`, aunque `apiKey` ya sea explícita. Por tanto **apiKey explícita no impide ninguna de esas dos lecturas**. `BaseAnthropic.authHeaders()` combina `apiKeyAuth()` y `bearerAuth()`: ambas cabeceras pueden coexistir. Se conserva exactamente el constructor pedido; no se añade `authToken` ni `baseURL`. El pre-vuelo de R19 queda a cargo del humano.

## Export por defecto (R9)

Con `module: nodenext`, `moduleResolution: nodenext` y `esModuleInterop: true` del backend, se usa `const { default: Anthropic } = await import('@anthropic-ai/sdk')`. El mapa `exports` del SDK para import dinámico selecciona `index.d.mts` / `index.mjs`; `index.d.mts` declara `export { Anthropic as default } from "./client.mjs"`. `pnpm exec tsc --noEmit` del commit 11: salida vacía, **exit=0**, sin cast del constructor ni supresión de diagnósticos. El cliente `.messages` encaja estructuralmente en la interfaz local.

## Decisiones y límites

- Ninguna skill cargada; ninguna llamada real a Anthropic. Prueba de humo R19 no ejecutada. `.env` no se modifica. `./init.sh` y `pnpm test:e2e` entero: **delegado al leader**.
- P4 aplicada: params contiene exactamente `max_tokens`, `messages`, `model`, `system`; no se envía configuración de razonamiento.
- Se proyectan explícitamente las claves de input y result, incluso si objetos enriquecidos llegan a `buildUserPrompt`, para impedir fugas por spread. El helper `explainPlan` comparte entitlement → IA → UPDATE entre el INSERT y el reintento, conservando el orden de R12.
- R14 y R16 unitario nacen verdes por los verdes anteriores; commits 27 y 31 omitidos y acreditados con sondas. R18 y los e2e de R13/R16 también nacen verdes y tienen sondas propias.
- Lint divide la aserción de R1(c) al sustituir null por el texto. En el verde 21 de R17 se añadió únicamente `prettier-ignore` para mantener el literal grepeable de A44; misma aserción, sin cambio de comportamiento.
- Los dobles tienen tipos locales para sus argumentos; un precheck de lint previo al commit 10 detectó acceso inseguro a mock.calls, corregido antes de medir el rojo y commitear. Un precheck de tsc previo al commit 12 detectó un import de tipos duplicado, eliminado antes de medir el rojo. No se versionó ningún commit con lint o tsc fallando.
- Riesgo N2 conservado: el log usa error.message; si una futura versión del SDK incluyera contenido de la petición en ese mensaje, podría aparecer en el log. El doble verifica que clave y alergia no se filtran en las siete clases de fallo.
- El informe se mantuvo en el worktree durante la implementación. Para acreditar limpieza total en las sondas, se movió temporalmente el informe aún no versionado a /tmp; las mutaciones de archivos versionados se restauraron siempre con `git checkout HEAD -- <ruta>`. Después se devolvió el informe para el commit 36.

## Sondas

### Sondas R1-8

Sustituir el centinela de .env.example por sk-x; no es una clave real.

Archivo: `.env.example`.

`pnpm exec jest nutrition-scope.spec.ts -t 'asercion 8' --json --outputFile=/tmp/nut18-probe-R1-8.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

`R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R4: asercion 8 nunca publica una clave real`

```text
Error: expect(received).not.toMatch(expected)

Expected pattern: not /^ANTHROPIC_API_KEY=sk-/m
Received string:      "# Copia este archivo a .env (init.sh lo hace solo si falta).
# Valores de desarrollo local — nunca pongas credenciales reales aquí.

# Postgres (docker-compose.yml)
DATABASE_URL=postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker

# Backend HTTP
PORT=3000

# Entrega de emails de auth. Solo el literal true activa Resend; cualquier otro
# valor usa los adaptadores de consola en desarrollo local.
EMAIL_ENABLED=false
# Credenciales de Resend: solo nombres vacíos en este ejemplo. Los valores
# reales viven únicamente en el .env gitignoreado de cada entorno.
RESEND_API_KEY=
RESEND_FROM=

# Host pelado que sirve el App Link de reset, sin esquema ni path. El dominio
# real se configura solo en los .env ignorados de backend y movil.
RESET_LINK_HOST=

# Secreto para firmar los JWT del login propio (HS256). Valor fijo de
# desarrollo, no es un secreto real; en un deploy AWS pasaría a leerse de
# Secrets Manager sin tocar modules/auth (specs/auth-login-me/design.md).
JWT_SECRET=dev-only-jwt-secret-change-me

# LocalStack (AWS local) — LocalStack acepta credenciales dummy
# Modo de los clientes AWS SDK v3 (#19). local (default, y cualquier valor que
# no sea exactamente \"aws\"): endpoint explicito + par estatico de credenciales
# + forcePathStyle en S3, todo contra LocalStack. aws: los clientes se
# construyen sin endpoint y sin credentials, el SDK resuelve por su cadena por
# defecto (sesion de `aws login`, que rota). En modo aws hay que comentar
# AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY de este archivo: la cadena mira las
# variables de entorno antes que la sesion (docs/verification.md, feature 19).
AWS_MODE=local
AWS_ENDPOINT_URL=http://localhost:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# Bucket S3 real de media para AWS_MODE=aws (#51). Debe usar el nombre del
# stack PetTrackerDev: pet-tracker-media-dev-<accountId>. Obtenlo con
# `aws s3 ls | grep pet-tracker-media`; ver docs/verification.md, feature 51.
# La linea queda comentada para no introducir deriva en el entorno local.
# MEDIA_BUCKET_NAME=pet-tracker-media-dev-<accountId>

# Host con el que se FIRMAN las URLs prefirmadas de S3 en modo local (#57).
# Sin ella se firma con AWS_ENDPOINT_URL (localhost) y un telefono fisico no
# las resuelve: localhost es el propio telefono (ConnectException en logcat).
# La firma SigV4 cubre el header Host, asi que hay que firmar YA con un host
# que el cliente de la URL resuelva: la IP LAN de esta maquina (la misma que
# EXPO_PUBLIC_API_URL en mobile-pet-tracker/.env) o 10.0.2.2 para el emulador
# Android. Solo modo local; en AWS_MODE=aws se ignora. Comentada por defecto:
# el valor depende de cada maquina/red (docs/verification.md, feature 57).
# AWS_PRESIGN_ENDPOINT_URL=http://192.168.x.x:4566

# Ingesta Wialon (#8). SIM_MODE distinto de \"false\" (o token ausente/vacio/
# PENDING) => simulador FakeWialonClient; la API real solo con SIM_MODE=false
# y un WIALON_TOKEN real (specs/wialon-ingestion-pipeline R1).
SIM_MODE=true
SIM_SEED=1
SIM_HOME_LAT=19.4326
SIM_HOME_LNG=-99.1332
WIALON_TOKEN=PENDING
WIALON_BASE_URL=https://hst-api.wialon.com/wialon/ajax.html

# Arranque de los workers de ingesta (poller cada 1 min + consumidor SQS).
# Default en codigo: false; aqui true para que la cadena local funcione
# out-of-the-box (D11). Con NODE_ENV=test jamas se agendan (R8).
POLLER_ENABLED=true

# Arr
[Received largo recortado; log completo temporal: /tmp/nut18-probe-R1-8.log]
```

Restauración: `git checkout HEAD -- .env.example`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R1-11

Plantar la aguja prohibida en comentario de un spec.

Archivo: `backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`.

`pnpm exec jest nutrition-scope.spec.ts -t 'asercion 11' --json --outputFile=/tmp/nut18-probe-R1-11.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

`R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo`

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "/home/claude/sites/Pet-Tracker-wt-18/backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts",
+ ]
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R1-12

Plantar el import prohibido como comentario; no se importa el SDK.

Archivo: `backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`.

`pnpm exec jest nutrition-scope.spec.ts -t 'asercion 12' --json --outputFile=/tmp/nut18-probe-R1-12.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

`R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 12 ningun test importa el SDK`

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "/home/claude/sites/Pet-Tracker-wt-18/backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts",
+ ]
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R1-13

Sonda estructural de R1 y R3; comentario, sin construir un cliente.

Archivo: `backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`.

`pnpm exec jest nutrition-scope.spec.ts -t 'asercion 13' --json --outputFile=/tmp/nut18-probe-R1-13.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

`R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R3: asercion 13 ningun test construye un cliente real`

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "/home/claude/sites/Pet-Tracker-wt-18/backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts",
+ ]
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R2-modelos

Plantar gpt- en comentario de producción (aserción 5).

Archivo: `backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts`.

`pnpm exec jest nutrition-scope.spec.ts -t 'conserva aserciones 1-5' --json --outputFile=/tmp/nut18-probe-R2-modelos.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

`R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R1: conserva aserciones 1-5 contra el proveedor descartado y modelos`

```text
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "gpt-"
Received string:        "import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { AwsModule } from './aws/aws.module';
import { AppConfigModule } from './config/config.module';
import { DrizzleModule } from './db/drizzle.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { AuthModule } from './modules/auth/auth.module';
import { DevicesModule } from './modules/devices/devices.module';
import { GeofencesModule } from './modules/geofences/geofences.module';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { PetsModule } from './modules/pets/pets.module';
import { PositionsModule } from './modules/positions/positions.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { UsersModule } from './modules/users/users.module';
import { AlertsEngineModule } from './workers/alerts-engine/alerts-engine.module';
import { IngestionModule } from './workers/ingestion.module';
import { NotifierModule } from './workers/notifier/notifier.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    // Primer cron del repo (#8); #10/#16 heredan este forRoot (design.md).
    ScheduleModule.forRoot(),
    DrizzleModule,
    AwsModule,
    AuditModule,
    HealthModule,
    AuthModule,
    UsersModule,
    PetsModule,
    NutritionModule,
    MediaModule,
    DevicesModule,
    GeofencesModule,
    PositionsModule,
    RemindersModule,
    ActivityModule,
    AlertsModule,
    IngestionModule,
    AlertsEngineModule,
    NotifierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Pet Tracker!';
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { auditLog } from '@/db/schema/audit-log.schema';
import { AuditLogEntry, AuditLogger } from './audit-log.repository';

@Injectable()
export class AuditLogDrizzleRepository implements AuditLogger {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async record(entry: AuditLogEntry): Promise<void> {
    await this.db.insert(auditLog).values({
      userId: entry.userId,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      meta: entry.meta ?? null,
    });
  }
}

export const AUDIT_LOGGER = Symbol('AuditLogger');

export interface AuditLogEntry {
  /** Actor de la accion; null para acciones de sistema sin usuario. */
  userId: string | null;
  /** Accion en formato `<entidad>.<verbo>`, ej. `user.register`. */
  action: string;

[Received largo recortado; log completo temporal: /tmp/nut18-probe-R2-modelos.log]
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R2-spec

Plantar la aguja en un spec de src (aserción 11).

Archivo: `backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`.

`pnpm exec jest nutrition-scope.spec.ts -t 'asercion 11' --json --outputFile=/tmp/nut18-probe-R2-spec.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 9 total
```

`R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo R2: asercion 11 ningun fichero contiene un literal del modelo`

```text
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "/home/claude/sites/Pet-Tracker-wt-18/backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts",
+ ]
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R3-factory

Retirar la guarda primera de NODE_ENV; se comprueba por tipo sin invocar el adaptador.

Archivo: `backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

`pnpm exec jest nutrition-explainer.factory.spec.ts -t 'R3 \(nutrition-ai-explainer #18\)' --json --outputFile=/tmp/nut18-probe-R3-factory.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 16 skipped, 1 passed, 18 total
```

`R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada devuelve el nulo con reason node-env-test aunque la IA este habilitada`

```text
Error: expect(received).toBeInstanceOf(expected)

Expected constructor: NullNutritionExplainer
Received constructor: AnthropicNutritionExplainer

```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R14

Retirar el retorno sin entitlement, conservando la consulta. Rojo de la guarda nacida verde, commit 27 omitido.

Archivo: `backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

`pnpm exec jest generate-nutrition-plan.use-case.spec.ts -t 'R14 \(nutrition-ai-explainer #18\)' --json --outputFile=/tmp/nut18-probe-R14.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 skipped, 1 passed, 10 total
```

`R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log sin entitlement devuelve el plan completo sin IA, UPDATE, warn ni error`

```text
Error: expect(jest.fn()).not.toHaveBeenCalled()

Expected number of calls: 0
Received number of calls: 1

1: {"activityLevel": "medium", "ageMonths": 36, "allergies": [], "bodyCondition": null, "diseases": [], "kcalPer100g": 350, "species": "dog", "sterilized": true, "targetWeightKg": null, "weightKg": 20}, {"dailyGrams": 305, "mealTimes": ["08:00", "14:00", "22:00"], "mealsPerDay": 3, "merKcal": 1059, "objective": "maintenance", "rerKcal": 662, "warnings": []}, {"petId": "pet-prueba", "planId": "plan-insertado"}
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R16-unit

Retirar el retorno para hash hit con texto. Rojo de la guarda nacida verde, commit 31 omitido.

Archivo: `backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

`pnpm exec jest generate-nutrition-plan.use-case.spec.ts -t 'R16 \(nutrition-ai-explainer #18\)' --json --outputFile=/tmp/nut18-probe-R16-unit.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 skipped, 10 total
```

`R16 (nutrition-ai-explainer #18): hash hit con texto no vuelve a pagar devuelve latest sin IA, entitlement, UPDATE ni INSERT`

```text
Error: expect(received).toBe(expected) // Object.is equality

- Expected  - 2
+ Received  + 2

@@ -1,10 +1,10 @@
  NutritionPlan {
-   "aiExplanation": "texto",
+   "aiExplanation": "otro texto",
    "dailyGrams": 305,
    "engineMealsPerDay": 2,
-   "generatedAt": 2026-10-08T19:04:11.040Z,
+   "generatedAt": 2026-10-08T19:04:11.041Z,
    "id": "plan-insertado",
    "inputsHash": "ff67e3ae8ceeeef59faa50b0348a8328e22c21cf60831636236ef0982af33807",
    "mealTimes": Array [
      "08:00",
      "14:00",
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R18-e2e

Devolver el plan insertado en lugar de la fila actualizada, después de persistir el texto.

Archivo: `backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

pgrep previo: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition-ai-explainer.e2e-spec.ts -t 'R18 \(nutrition-ai-explainer #18\)' --json --outputFile=/tmp/nut18-probe-R18-e2e.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 skipped, 3 total
```

`Nutrition AI explainer (e2e HTTP y Postgres) R18 (nutrition-ai-explainer #18): explicacion de punta a punta generate, Postgres y GET devuelven el texto y ctx contiene el id persistido`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Tu perro de 20 kg necesita unas 1059 kcal al día..."
Received: null
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R13-e2e

UPDATE por petId: resolver la mascota del planId y actualizar todas sus filas. Consulta válida; P1 también recibe texto B.

Archivo: `backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts`.

pgrep previo: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition-ai-explainer.e2e-spec.ts -t 'R13 \(nutrition-ai-explainer #18\)' --json --outputFile=/tmp/nut18-probe-R13-e2e.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 skipped, 3 total
```

`Nutrition AI explainer (e2e HTTP y Postgres) R13 (nutrition-ai-explainer #18): UPDATE solo de la segunda fila por id conserva P1 null y todos los campos insertados de P2 excepto la explicacion`

```text
Error: expect(received).toBeNull()

Received: "texto B"
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```

### Sondas R16-e2e

Retirar la rama completa de hash hit; dos generate insertan dos filas y pagan dos veces.

Archivo: `backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

pgrep previo: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition-ai-explainer.e2e-spec.ts -t 'R16 \(nutrition-ai-explainer #18\)' --json --outputFile=/tmp/nut18-probe-R16-e2e.json`: exit=1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 skipped, 3 total
```

`Nutrition AI explainer (e2e HTTP y Postgres) R16 (nutrition-ai-explainer #18): hash hit no vuelve a pagar por HTTP dos generate devuelven mismo id y texto con una fila y una llamada`

```text
Error: expect(received).toBe(expected) // Object.is equality

Expected: "01a11ce6-f55b-7471-bd77-e3701e3e1fb5"
Received: "01a11ce6-f56e-7a47-9471-23c5e0b5c3ce"
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`.

```text
$ git diff --exit-code; echo "exit=$?"
exit=0
```

```text
$ git diff --cached --exit-code; echo "exit=$?"
exit=0
```

```text
$ git status --short
(salida vacía; exit=0)
```


## A1–A53 finales

| Ancla | tras #18 declarado | Medido | exit |
|---|---|---|---|
| A1 | 0 | 0 | 1 |
| A2 | 1 | 1 | 0 |
| A3 | 27 | 27 | 0 |
| A4 | 3 | 3 | 0 |
| A5 | 0 | 0 | 1 |
| A6 | 3 | 3 | 0 |
| A7 | 1 | 1 | 0 |
| A8 | 1 | 1 | 0 |
| A9 | 19 | 19 | 0 |
| A10 | 1 | 1 | 0 |
| A11 | 2 (no se edita, P7) | 2 | 0 |
| A12 | 0 | 0 | 0 |
| A13 | `nutrition-scope.spec.ts` | backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts | 0 |
| A14 | `$NUT/infrastructure/ai/nutrition-explainer.factory.ts` | backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts | 0 |
| A15 | 1 | 1 | 0 |
| A16 | 6 | 6 | 0 |
| A17 | libre (el cast no rompe al añadir un método) | backend-pet-tracker/src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts<br>backend-pet-tracker/src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts<br>backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts<br>backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts | 0 |
| A18 | (vacío) | (vacío) | 1 |
| A19 | 0 | 0 | 1 |
| A20 | 1 | 1 | 0 |
| A21 | ≥ 1 | 1 | 0 |
| A22 | 0 | 0 | 1 |
| A23 | 1 | 1 | 0 |
| A24 | libre | 1 | 0 |
| A25 | 1 | 1 | 0 |
| A26 | ≥ 1 (`copyWithMealTimes` intacto) | 1 | 0 |
| A27 | 1 | 1 | 0 |
| A28 | 2 (DTO intacto) | 2 | 0 |
| A29 | 1 (sin migración nueva) | 1 | 0 |
| A30 | 1 (patrón a copiar) | 1 | 0 |
| A31 | 1 | 1 | 0 |
| A32 | libre (precedente de la guarda) | 5 | 0 |
| A33 | 1 (precedente de redacción) | 1 | 0 |
| A34 | 1 (precedente de import perezoso) | 1 | 0 |
| A35 | 1 (precedente del centinela) | 1 | 0 |
| A36 | 1 (precedente de `petId` en log) | 1 | 0 |
| A37 | 2 (patrón del espía de `warn`) | 2 | 0 |
| A38 | 0 | 0 | 1 |
| A39 | 1 | 1 | 0 |
| A40 | 0 | 0 | 1 |
| A41 | (vacío) | (vacío) | 1 |
| A42 | 1 | 1 | 0 |
| A43 | 0 | 0 | 1 |
| A44 | 1 | 1 | 0 |
| A45 | 1 | 1 | 0 |
| A46 | 4 (no hay cliente SSM) | 4 | 0 |
| A47 | (vacío) | (vacío) | 1 |
| A48 | 1 | 1 | 0 |
| A49 | 0 | 0 | 1 |
| A50 | 0 | 0 | 1 |
| A51 | 1 | 1 | 0 |
| A52 | 0 | 0 | 1 |
| A53 | (vacío) | (vacío) | 1 |

## Verificación final

`pnpm lint`: exit=0.

```text
Salida vacía; sin errores.
```

`pnpm exec tsc --noEmit`: exit=0.

```text
Salida vacía; sin errores.
```

`pnpm test --json --outputFile=/tmp/nut18-36-unit.json`: exit=0.

```text
Test Suites: 183 passed, 183 total
Tests:       1431 passed, 1431 total
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts --json --outputFile=/tmp/nut18-36-e2e-nut.json`: exit=0.

```text
Test Suites: 3 passed, 3 total
Tests:       72 passed, 72 total
```

pgrep previo a e2e: salida vacía, exit=1.

`pnpm exec jest --config ./test/jest-e2e.json test/nutrition-ai-explainer.e2e-spec.ts --json --outputFile=/tmp/nut18-36-e2e-ai.json`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

`node --test env-drift.test.mjs` (raíz): exit=0.

```text
# tests 28
# pass 28
# fail 0
```

Env-drift en el commit 2: exit=0 (27 claves). Instalación exacta del SDK: exit=0. El diff de env-drift.test.mjs conserva una sola línea cambiada; env-drift.mjs y los demás intocables permanecen intactos.

### Commit 36

`HEAD` — `docs(nutrition-ai-explainer): fill #18 traceability`. Solo traceability e informe. El hash propio no puede incluirse en el contenido que determina ese hash; se obtiene con `git rev-parse HEAD` y se comunica al entregar. No se rebasea ni se hace amend tras escribir la trazabilidad.

### Alcance y estado del árbol

`git status --short` posterior al commit 36: salida vacía, exit=0 (verificado tras crear el commit).

`git diff --name-only H0 HEAD` contra la lista cerrada: todos los archivos pertenecen a ella; no falta ninguno.

```text
.env.example
backend-pet-tracker/package.json
backend-pet-tracker/pnpm-lock.yaml
backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts
backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts
backend-pet-tracker/src/modules/nutrition/domain/ports/nutrition-explainer.ts
backend-pet-tracker/src/modules/nutrition/domain/repositories/nutrition.repository.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts
backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts
backend-pet-tracker/src/modules/nutrition/nutrition.module.ts
backend-pet-tracker/test/meal-times.e2e-spec.ts
backend-pet-tracker/test/nutrition-ai-explainer.e2e-spec.ts
backend-pet-tracker/test/nutrition.e2e-spec.ts
docs/conventions.md
docs/verification.md
env-drift.test.mjs
progress/impl_nutrition-ai-explainer.md
specs/nutrition-ai-explainer/traceability.md
```

`git diff --stat H0..HEAD`:

```text
 .env.example                                       |   10 +
 backend-pet-tracker/package.json                   |    1 +
 backend-pet-tracker/pnpm-lock.yaml                 |   57 +
 .../generate-nutrition-plan.use-case.spec.ts       |  246 +
 .../use-cases/generate-nutrition-plan.use-case.ts  |   34 +-
 .../domain/entities/nutrition-plan.entity.ts       |   13 +
 .../nutrition/domain/ports/nutrition-explainer.ts  |   17 +
 .../domain/repositories/nutrition.repository.ts    |    1 +
 .../ai/anthropic-nutrition-explainer.spec.ts       |  255 +
 .../ai/anthropic-nutrition-explainer.ts            |   88 +
 .../ai/null-nutrition-explainer.spec.ts            |   54 +
 .../infrastructure/ai/null-nutrition-explainer.ts  |   32 +
 .../ai/nutrition-explainer.factory.spec.ts         |   73 +
 .../ai/nutrition-explainer.factory.ts              |   24 +
 .../infrastructure/ai/nutrition-prompt.spec.ts     |  159 +
 .../infrastructure/ai/nutrition-prompt.ts          |   46 +
 .../mappers/nutrition.mapper.spec.ts               |   72 +
 .../infrastructure/mappers/nutrition.mapper.ts     |    2 +-
 .../nutrition.drizzle.repository.spec.ts           |   51 +
 .../repositories/nutrition.drizzle.repository.ts   |   12 +
 .../src/modules/nutrition/nutrition-scope.spec.ts  |   94 +-
 .../src/modules/nutrition/nutrition.module.ts      |   11 +-
 backend-pet-tracker/test/meal-times.e2e-spec.ts    |    3 +-
 .../test/nutrition-ai-explainer.e2e-spec.ts        |  191 +
 backend-pet-tracker/test/nutrition.e2e-spec.ts     |   71 +-
 docs/conventions.md                                |    3 +
 docs/verification.md                               |   57 +
 env-drift.test.mjs                                 |    2 +-
 progress/impl_nutrition-ai-explainer.md            | 5704 ++++++++++++++++++++
 specs/nutrition-ai-explainer/traceability.md       |   44 +-
 30 files changed, 7386 insertions(+), 41 deletions(-)
```


# Ronda 2 — Enmienda E1

## Base E1

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-18
$ git branch --show-current
feature/18-nutrition-ai-explainer-claude
$ git rev-parse HEAD
5b069b93a76a8cf2e8aef39fe42c82148915c24e
$ git status --short
(salida vacía)
```

H0E1 = `5b069b93a76a8cf2e8aef39fe42c82148915c24e` (commit que añade el handoff E1). Ronda 1 intacta byte a byte. Skills cargadas: ninguna. `init.sh`, `pnpm test:e2e` y todos los e2e: **delegado al leader**. R19: gate humano, sin ejecutar.

Leídos enteros: requirements §Enmienda E1 (E1.0–E1.8 y Cifras y alcance), tasks §Enmienda E1 hasta el final, traceability y review de ronda 1 (F1–F5).

`git merge-base --is-ancestor c4b86430 HEAD`: exit=0.

`git merge-base --is-ancestor c09ee51c HEAD`: exit=0.

`git diff --quiet c09ee51c HEAD -- backend-pet-tracker`: exit=0.

`/tmp/e1-check.js` creado con el contenido literal del handoff:

```javascript
const r = require(process.argv[2]);
const failed = r.testResults
  .flatMap((t) => t.assertionResults)
  .filter((a) => a.status === 'failed')
  .map((a) => a.title)
  .sort();
console.log(JSON.stringify({ total: r.numTotalTests, passed: r.numPassedTests, failed: r.numFailedTests, suiteErrors: r.numRuntimeErrorTestSuites, failedTitles: failed }));
```

### Anclas en H0E1

| Ancla | Declarado base | Medido | Exit |
|---|---|---|---|
| E1-A1 | 1 | 1 | 0 |
| E1-A2 | 0 | 0 | 1 |
| E1-A3 | 0 | 0 | 1 |
| E1-A4 | 0 | 0 | 1 |
| E1-A5 | 0 | 0 | 1 |
| E1-A6 | 1 | 1 | 0 |
| E1-A7 | 1 | 1 | 0 |
| E1-A8 | 1 | 1 | 0 |
| E1-A9 | 1 | 1 | 0 |
| E1-A10 | 0 | 0 | 1 |
| E1-A11 | 0 | 0 | 1 |
| E1-A12 | 0 | 0 | 1 |
| E1-A13 | 0 | 0 | 1 |
| E1-A14 | 0 | 0 | 1 |
| E1-A15 | 0 | 0 | 1 |
| E1-A16 | 0 | 0 | 1 |
| E1-A17 | 0 | 0 | 1 |
| E1-A18 | 0 | 0 | 1 |
| E1-A19 | 0 | 0 | 1 |
| E1-A20 | 0 | 0 | 1 |
| E1-A21 | 0 | 0 | 1 |
| E1-A22 | 0 | 0 | 1 |
| E1-A23 | 0 | 0 | 1 |
| E1-A24 | 4 | 4 | 0 |
| E1-A25 | 0 | 0 | 1 |
| E1-A26 | 0 | 0 | 0 |
| E1-A27 | 0 | 0 | 0 |
| E1-A28 | 0 | 0 | 0 |
| E1-A29 | 0 | 0 | 1 |
| E1-A30 | 0 | 0 | 1 |
| E1-A31 | 0 | 0 | 1 |
| E1-A32 | 0 | 0 | 1 |
| E1-A33 | 0 | 0 | 1 |
| E1-A34 | 0 | 0 | 1 |
| E1-A35 | 0 | 0 | 0 |
| E1-A36 | 0 | 0 | 0 |
| E1-A37 | 1 | 1 | 0 |
| E1-A38 | 4 | 4 | 0 |

Comandos de las 38 anclas, copiados del handoff con `AI` definido en la misma línea en cada ejecución:

```bash
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "await import('@anthropic-ai/sdk')" $AI/anthropic-nutrition-explainer.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "from '@anthropic-ai/sdk'" $AI/anthropic-nutrition-explainer.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'export type AnthropicSdkLoader' $AI/anthropic-nutrition-explainer.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'export interface AnthropicClientOptions' $AI/anthropic-nutrition-explainer.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'await this.loadSdk()' $AI/anthropic-nutrition-explainer.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'if (this.client === null)' $AI/anthropic-nutrition-explainer.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'Array.isArray(response.content)' $AI/anthropic-nutrition-explainer.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "block.type === 'text'" $AI/anthropic-nutrition-explainer.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'return new AnthropicNutritionExplainer(model, key, null);' $AI/nutrition-explainer.factory.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'constructorArgs(' $AI/nutrition-explainer.factory.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'%s y %s fallan: gana %s'" $AI/nutrition-explainer.factory.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'pasa clave y modelo recortados (E1.1)' $AI/nutrition-explainer.factory.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF '.explain(' $AI/nutrition-explainer.factory.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'content string'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'content objeto'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'content numero'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'content undefined'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'bloque no-text con text'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'solo bloque no-text con text'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'texto-futuro'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'R11 (nutrition-ai-explainer #18) E1.3:' $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'sdk ausente'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'opciones invalidas'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'new AnthropicNutritionExplainer(' $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; git diff -U0 c09ee51c -- $AI/nutrition-explainer.factory.ts | grep -cvE '^(diff |index |--- |\+\+\+ |@@ )'
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; git diff c09ee51c -- backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts | wc -l
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -rlF "jest.mock('@anthropic-ai/sdk'" backend-pet-tracker/src backend-pet-tracker/test | wc -l
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -rlE "from '@anthropic-ai/sdk'|import\('@anthropic-ai/sdk'\)" backend-pet-tracker/src backend-pet-tracker/test --include=*spec.ts | wc -l
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'return new AnthropicNutritionExplainer(model.trim(), key.trim(), null);' $AI/nutrition-explainer.factory.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'content array-like'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'sin stop_reason'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'no soy Error'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF "'[object Object]'" $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -cF 'const loadSdk: AnthropicSdkLoader' $AI/anthropic-nutrition-explainer.spec.ts
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; tr -d ' \n' < $AI/anthropic-nutrition-explainer.spec.ts | grep -oF "'clave-de-prueba',null" | wc -l
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; tr -d ' \n' < $AI/anthropic-nutrition-explainer.spec.ts | grep -oF "'clave-de-prueba',null,loadSdk" | wc -l
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; grep -rlF 'new AnthropicNutritionExplainer(' backend-pet-tracker/src backend-pet-tracker/test --include=*spec.ts | wc -l
AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai; tr -d ' \n' < $AI/anthropic-nutrition-explainer.spec.ts | grep -oF "'clave-de-prueba',{" | wc -l
```

### Línea base E1

`FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts --json --outputFile=/tmp/e1-base-fs.json`: exit=0.

```json
{"total":18,"passed":18,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

`FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts --json --outputFile=/tmp/e1-base-as.json`: exit=0.

```json
{"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

`FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest src/modules/nutrition/nutrition-scope.spec.ts --json --outputFile=/tmp/e1-base-ss.json`: exit=0.

```json
{"total":9,"passed":9,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

`FORCE_COLOR=0 pnpm -C backend-pet-tracker exec jest  --json --outputFile=/tmp/e1-base-unit.json`: exit=0.

```json
{"total":1431,"passed":1431,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

`pnpm -C backend-pet-tracker exec tsc --noEmit -p tsconfig.json`: exit=0. `grep -c 'error TS' /tmp/e1-base.tsc`: 0.

pgrep antes de la suite completa (`pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`): salida vacía, exit=1.

Decisión de alcance: el cierre del handoff dice «17» sondas pero sus listas nombran 18 (8 del factory + 10 del adaptador). Se ejecutan **todas las 18 enumeradas**, con los gates literales, sin omitir ninguna.

## Commits E1

### E1-c1 — `807b56626521f8dcf948a1572fccf51f0eebefb7`

`test(nutrition-ai-explainer): lock factory constructor arguments (R5, E1.1)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":18,"passed":16,"failed":2,"suiteErrors":0,"failedTitles":["anti-vacio: development selecciona Anthropic sin invocarlo","anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo"]}
```

```text
  ● R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada › anti-vacio: development selecciona Anthropic sin invocarlo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Object {
    -   "apiKey": "clave-de-prueba",
    +   "apiKey": "modelo-de-prueba",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "clave-de-prueba",
      }

      32 |     const adapter = createNutritionExplainer(config(valid));
      33 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 34 |     expect(constructorArgs(adapter)).toEqual({
         |                                      ^
      35 |       model: 'modelo-de-prueba',
      36 |       apiKey: 'clave-de-prueba',
      37 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:34:38)
```

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Object {
    -   "apiKey": "clave-de-prueba",
    +   "apiKey": "modelo-de-prueba",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "clave-de-prueba",
      }

      81 |     const adapter = createNutritionExplainer(config(valid));
      82 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 83 |     expect(constructorArgs(adapter)).toEqual({
         |                                      ^
      84 |       model: 'modelo-de-prueba',
      85 |       apiKey: 'clave-de-prueba',
      86 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:83:38)
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c1.json)" = '{"total":18,"passed":16,"failed":2,"suiteErrors":0,"failedTitles":["anti-vacio: development selecciona Anthropic sin invocarlo","anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo"]}' ] && git commit -m 'test(nutrition-ai-explainer): lock factory constructor arguments (R5, E1.1)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git diff --cached --quiet`: exit=0.

### E1-c2 — `8273dce8da541f5e9a0593cd5482a9dad1c91797`

`fix(nutrition-ai-explainer): restore factory constructor argument order (R5, E1.1)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=0.

```json
{"total":18,"passed":18,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c2.json)" = '{"total":18,"passed":18,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts && git commit -m 'fix(nutrition-ai-explainer): restore factory constructor argument order (R5, E1.1)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git diff --cached --quiet`: exit=0.

Restauración: `git checkout c09ee51c -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`; `git diff c09ee51c HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts | wc -l`: 0.

E1-A25 después de E1-c2: 0 (declarado 0).

### E1-c3 — `dca3aecd2c3dfe3ac49b324875ca9acd34e4240e`

`test(nutrition-ai-explainer): expect trimmed key and model from factory (R5, E1.1, D-E1-a)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":19,"passed":18,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}
```

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › pasa clave y modelo recortados (E1.1)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 4

      Object {
    -   "apiKey": "clave-de-prueba",
    +   "apiKey": "	 clave-de-prueba
    + ",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "	 modelo-de-prueba
    + ",
      }

       96 |     );
       97 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    >  98 |     expect(constructorArgs(adapter)).toEqual({
          |                                      ^
       99 |       model: 'modelo-de-prueba',
      100 |       apiKey: 'clave-de-prueba',
      101 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:98:38)
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c3.json)" = '{"total":19,"passed":18,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}' ] && git commit -m 'test(nutrition-ai-explainer): expect trimmed key and model from factory (R5, E1.1, D-E1-a)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts
```

`git diff --cached --quiet`: exit=0.

### E1-c4 — `f7dc3072461ad29187a1c79e25a65c97cf98fc09`

`feat(nutrition-ai-explainer): pass trimmed key and model to Anthropic explainer (R5, E1.1, D-E1-a)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=0.

```json
{"total":19,"passed":19,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c4.json)" = '{"total":19,"passed":19,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts && git commit -m 'feat(nutrition-ai-explainer): pass trimmed key and model to Anthropic explainer (R5, E1.1, D-E1-a)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git diff --cached --quiet`: exit=0.

HASH_C4 = `f7dc3072461ad29187a1c79e25a65c97cf98fc09`.

E1-A9 después de E1-c4: 0 (declarado 0).

E1-A25 después de E1-c4: 2 (declarado 2).

E1-A29 después de E1-c4: 1 (declarado 1).

### E1-c5 — `34ee1311cd61773297cec077031551d1115a8f53`

`test(nutrition-ai-explainer): lock pairwise order of explainer guards (R3, R5, E1.2)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":23,"failed":2,"suiteErrors":0,"failedTitles":["ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled","ANTHROPIC_ENABLED y ANTHROPIC_MODEL fallan: gana not-enabled"]}
```

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled

    expect(received).toBe(expected) // Object.is equality

    Expected: "not-enabled"
    Received: "key-missing"

      105 |     );
      106 |     expect(adapter).toBeInstanceOf(NullNutritionExplainer);
    > 107 |     expect((adapter as NullNutritionExplainer).reason).toBe(reason);
          |                                                        ^
      108 |   });
      109 |   it('pasa clave y modelo recortados (E1.1)', () => {
      110 |     const adapter = createNutritionExplainer(

      at modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:107:56
```

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › ANTHROPIC_ENABLED y ANTHROPIC_MODEL fallan: gana not-enabled

    expect(received).toBe(expected) // Object.is equality

    Expected: "not-enabled"
    Received: "model-missing"

      105 |     );
      106 |     expect(adapter).toBeInstanceOf(NullNutritionExplainer);
    > 107 |     expect((adapter as NullNutritionExplainer).reason).toBe(reason);
          |                                                        ^
      108 |   });
      109 |   it('pasa clave y modelo recortados (E1.1)', () => {
      110 |     const adapter = createNutritionExplainer(

      at modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:107:56
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c5.json)" = '{"total":25,"passed":23,"failed":2,"suiteErrors":0,"failedTitles":["ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled","ANTHROPIC_ENABLED y ANTHROPIC_MODEL fallan: gana not-enabled"]}' ] && git commit -m 'test(nutrition-ai-explainer): lock pairwise order of explainer guards (R3, R5, E1.2)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git diff --cached --quiet`: exit=0.

### E1-c6 — `fa5df45b6a1505b61ab1f042d8d45c0f8fdf1acb`

`fix(nutrition-ai-explainer): restore explainer guard order (R3, R5, E1.2)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=0.

```json
{"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c6.json)" = '{"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts && git commit -m 'fix(nutrition-ai-explainer): restore explainer guard order (R3, R5, E1.2)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts
```

`git diff --cached --quiet`: exit=0.

Restauración: `git checkout f7dc3072461ad29187a1c79e25a65c97cf98fc09 -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`; `git diff f7dc3072461ad29187a1c79e25a65c97cf98fc09 HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts | wc -l`: 0.

E1-A25 después de E1-c6: 2 (declarado 2).

E1-A29 después de E1-c6: 1 (declarado 1).

### E1-c7 — `7ef04fc7bd685edf15f3d6e34ebf69b8ab977136`

`refactor(nutrition-ai-explainer): inject SDK loader into Anthropic explainer (R11, E1.3)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=0.

```json
{"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=0.

```json
{"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

`jest src/modules/nutrition/nutrition-scope.spec.ts`: exit=0.

```json
{"total":9,"passed":9,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c7as.json)" = '{"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && [ "$(node /tmp/e1-check.js /tmp/e1-c7fs.json)" = '{"total":25,"passed":25,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && [ "$(node /tmp/e1-check.js /tmp/e1-c7ss.json)" = '{"total":9,"passed":9,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts && git commit -m 'refactor(nutrition-ai-explainer): inject SDK loader into Anthropic explainer (R11, E1.3)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

HASH_C7 = `7ef04fc7bd685edf15f3d6e34ebf69b8ab977136`.

E1-A1 después de E1-c7: 1 (declarado 1).

E1-A2 después de E1-c7: 0 (declarado 0).

E1-A3 después de E1-c7: 1 (declarado 1).

E1-A4 después de E1-c7: 1 (declarado 1).

E1-A5 después de E1-c7: 1 (declarado 1).

E1-A6 después de E1-c7: 1 (declarado 1).

### E1-c8 — `9d99df4c311374b66cbf516bfbf7bfabc80b9ab1`

`test(nutrition-ai-explainer): lock lazy SDK load inside degradation (R11, E1.3)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":28,"passed":26,"failed":2,"suiteErrors":0,"failedTitles":["el constructor del SDK lanza: null y un warn sin relanzar","fallo del import del SDK: null y un warn sin relanzar"]}
```

```text
  ● R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null › fallo del import del SDK: null y un warn sin relanzar

    expect(received).resolves.toBeNull()

    Received promise rejected instead of resolved
    Rejected to value: [Error: sdk ausente]

      278 |       loadSdk,
      279 |     );
    > 280 |     await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
          |           ^
      281 |     expect(warn).toHaveBeenCalledTimes(1);
      282 |     expect(warn.mock.calls[0][0]).toEqual({
      283 |       scope: 'nutrition-ai',

      at expect (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2116:15)
      at Object.<anonymous> (modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:280:11)
```

```text
  ● R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null › el constructor del SDK lanza: null y un warn sin relanzar

    expect(received).resolves.toBeNull()

    Received promise rejected instead of resolved
    Rejected to value: [Error: opciones invalidas]

      310 |       loadSdk,
      311 |     );
    > 312 |     await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
          |           ^
      313 |     expect(options).toHaveLength(1);
      314 |     expect(warn).toHaveBeenCalledTimes(1);
      315 |     expect(warn.mock.calls[0][0]).toEqual({

      at expect (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2116:15)
      at Object.<anonymous> (modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:312:11)
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c8.json)" = '{"total":28,"passed":26,"failed":2,"suiteErrors":0,"failedTitles":["el constructor del SDK lanza: null y un warn sin relanzar","fallo del import del SDK: null y un warn sin relanzar"]}' ] && git commit -m 'test(nutrition-ai-explainer): lock lazy SDK load inside degradation (R11, E1.3)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

### E1-c9 — `c4276761262c2710b385dd02729bc38d8f2a6dd7`

`fix(nutrition-ai-explainer): load SDK inside the degradation try (R11, E1.3)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=0.

```json
{"total":28,"passed":28,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c9.json)" = '{"total":28,"passed":28,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts && git commit -m 'fix(nutrition-ai-explainer): load SDK inside the degradation try (R11, E1.3)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

Restauración: `git checkout 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`; `git diff 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts | wc -l`: 0.

E1-A34 después de E1-c9: 3 (declarado 3).

E1-A35 después de E1-c9: 3 (declarado 3).

E1-A36 después de E1-c9: 3 (declarado 3).

### E1-c10 — `bdb097b9802cd3438e715c719d89b7435d33b26b`

`test(nutrition-ai-explainer): lock non-array content as unusable (R10, E1.4)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":33,"passed":29,"failed":4,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content numero con exactamente un warn completo","degrada content objeto con exactamente un warn completo","degrada content string con exactamente un warn completo"]}
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content string con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      196 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      197 |       expect(warn).toHaveBeenCalledTimes(1);
    > 198 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      199 |         scope: 'nutrition-ai',
      200 |         petId: ctx.petId,
      201 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:198:37
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content objeto con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      196 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      197 |       expect(warn).toHaveBeenCalledTimes(1);
    > 198 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      199 |         scope: 'nutrition-ai',
      200 |         petId: ctx.petId,
      201 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:198:37
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content numero con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      196 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      197 |       expect(warn).toHaveBeenCalledTimes(1);
    > 198 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      199 |         scope: 'nutrition-ai',
      200 |         petId: ctx.petId,
      201 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:198:37
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content array-like con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      196 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      197 |       expect(warn).toHaveBeenCalledTimes(1);
    > 198 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      199 |         scope: 'nutrition-ai',
      200 |         petId: ctx.petId,
      201 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:198:37
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c10.json)" = '{"total":33,"passed":29,"failed":4,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content numero con exactamente un warn completo","degrada content objeto con exactamente un warn completo","degrada content string con exactamente un warn completo"]}' ] && git commit -m 'test(nutrition-ai-explainer): lock non-array content as unusable (R10, E1.4)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

### E1-c11 — `9e2ef4ef0e5402d050bc96c0057003a4b29f7a80`

`fix(nutrition-ai-explainer): restore array check on response content (R10, E1.4)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=0.

```json
{"total":33,"passed":33,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c11.json)" = '{"total":33,"passed":33,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts && git commit -m 'fix(nutrition-ai-explainer): restore array check on response content (R10, E1.4)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

Restauración: `git checkout 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`; `git diff 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts | wc -l`: 0.

### E1-c12 — `76de3247cb68d79e3171744c076139a7f5c4fd36`

`test(nutrition-ai-explainer): lock text-only block filter (R10, E1.5)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":35,"passed":33,"failed":2,"suiteErrors":0,"failedTitles":["anti-vacio: bloque no-text con text devuelve texto sin warn","degrada solo bloque no-text con text con exactamente un warn completo"]}
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada solo bloque no-text con text con exactamente un warn completo

    expect(received).resolves.toBeNull()

    Received: "no es explicacion"

      202 |         { create },
      203 |       );
    > 204 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
          |                                                                  ^
      205 |       expect(warn).toHaveBeenCalledTimes(1);
      206 |       expect(warn.mock.calls[0][0]).toEqual({
      207 |         scope: 'nutrition-ai',

      at Object.toBeNull (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2140:20)
      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:204:66
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › anti-vacio: bloque no-text con text devuelve texto sin warn

    expect(received).resolves.toBe(expected) // Object.is equality

    Expected: "Tu perro necesita..."
    Received: "texto oculto Tu perro necesita..."

      247 |       },
      248 |     );
    > 249 |     await expect(adapter.explain(input, result, ctx)).resolves.toBe(
          |                                                                ^
      250 |       'Tu perro necesita...',
      251 |     );
      252 |     expect(warn).not.toHaveBeenCalled();

      at Object.toBe (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2140:20)
      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:249:64
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c12.json)" = '{"total":35,"passed":33,"failed":2,"suiteErrors":0,"failedTitles":["anti-vacio: bloque no-text con text devuelve texto sin warn","degrada solo bloque no-text con text con exactamente un warn completo"]}' ] && git commit -m 'test(nutrition-ai-explainer): lock text-only block filter (R10, E1.5)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

### E1-c13 — `ea01b8ac8a81da68b13dc074ccbe4828eddd9f96`

`fix(nutrition-ai-explainer): restore text block filter (R10, E1.5)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=0.

```json
{"total":35,"passed":35,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c13.json)" = '{"total":35,"passed":35,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts && git commit -m 'fix(nutrition-ai-explainer): restore text block filter (R10, E1.5)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

Restauración: `git checkout 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`; `git diff 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts | wc -l`: 0.

### E1-c14 — `1344163b8442bcb30ecdc91012f7a99b6d236b09`

`test(nutrition-ai-explainer): lock null stopReason when stop_reason is missing (R10, E1.7)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":36,"passed":35,"failed":1,"suiteErrors":0,"failedTitles":["degrada sin stop_reason con exactamente un warn completo"]}
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada sin stop_reason con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "message": "ai explanation unusable",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": null,
    +   "stopReason": undefined,
        "usage": Object {
          "input_tokens": 10,
          "output_tokens": 20,
        },
      }

      208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      209 |       expect(warn).toHaveBeenCalledTimes(1);
    > 210 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      211 |         scope: 'nutrition-ai',
      212 |         petId: ctx.petId,
      213 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:210:37
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c14.json)" = '{"total":36,"passed":35,"failed":1,"suiteErrors":0,"failedTitles":["degrada sin stop_reason con exactamente un warn completo"]}' ] && git commit -m 'test(nutrition-ai-explainer): lock null stopReason when stop_reason is missing (R10, E1.7)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

### E1-c15 — `834619e43b79ef179b09f48d0e4215c6690e0123`

`fix(nutrition-ai-explainer): restore null default for stopReason (R10, E1.7)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=0.

```json
{"total":36,"passed":36,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c15.json)" = '{"total":36,"passed":36,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts && git commit -m 'fix(nutrition-ai-explainer): restore null default for stopReason (R10, E1.7)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

Restauración: `git checkout 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`; `git diff 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts | wc -l`: 0.

### E1-c16 — `54c74b78d1fd507f73a0e875188117666b4b79ad`

`test(nutrition-ai-explainer): lock String() message for non-Error rejections (R11, E1.8)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada objeto: [object Object]"]}
```

```text
  ● R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn › degrada objeto: [object Object]

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "message": "[object Object]",
    +   "message": "no soy Error",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
      }

      296 |     expect(create).toHaveBeenCalledTimes(1);
      297 |     expect(warn).toHaveBeenCalledTimes(1);
    > 298 |     expect(warn.mock.calls[0][0]).toEqual({
          |                                   ^
      299 |       scope: 'nutrition-ai',
      300 |       petId: ctx.petId,
      301 |       planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:298:35
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c16.json)" = '{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada objeto: [object Object]"]}' ] && git commit -m 'test(nutrition-ai-explainer): lock String() message for non-Error rejections (R11, E1.8)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

### E1-c17 — `aba336beab9131e16ed03b2e25fbabea51375a2a`

`fix(nutrition-ai-explainer): restore instanceof Error check in failure warn (R11, E1.8)`

`eslint --fix`: exit=0. `tsc --noEmit -p tsconfig.json`: exit=0; 0 errores TS.

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=0.

```json
{"total":37,"passed":37,"failed":0,"suiteErrors":0,"failedTitles":[]}
```

Commit encadenado al gate literal:

```bash
[ "$(node /tmp/e1-check.js /tmp/e1-c17.json)" = '{"total":37,"passed":37,"failed":0,"suiteErrors":0,"failedTitles":[]}' ] && pnpm -C backend-pet-tracker exec eslint src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts && git commit -m 'fix(nutrition-ai-explainer): restore instanceof Error check in failure warn (R11, E1.8)' -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git show --name-only --format= HEAD`:

```text
backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts
```

`git diff --cached --quiet`: exit=0.

Restauración: `git checkout 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`; `git diff 7ef04fc7bd685edf15f3d6e34ebf69b8ab977136 HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts | wc -l`: 0.

## Sondas E1

Se ejecutan las 18 sondas enumeradas, una por vez, sobre E1-c17. Cada restauración usa `git checkout HEAD -- <ruta>`. No se versiona ninguna mutación de sonda.

### S-E1.1a

Mutación:

```text
return new AnthropicNutritionExplainer(model.trim() + 'x', key.trim(), null);
```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":22,"failed":3,"suiteErrors":0,"failedTitles":["anti-vacio: development selecciona Anthropic sin invocarlo","anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo","pasa clave y modelo recortados (E1.1)"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.1a.json)" = '{"total":25,"passed":22,"failed":3,"suiteErrors":0,"failedTitles":["anti-vacio: development selecciona Anthropic sin invocarlo","anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo","pasa clave y modelo recortados (E1.1)"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada › anti-vacio: development selecciona Anthropic sin invocarlo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "apiKey": "clave-de-prueba",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "modelo-de-pruebax",
      }

      32 |     const adapter = createNutritionExplainer(config(valid));
      33 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 34 |     expect(constructorArgs(adapter)).toEqual({
         |                                      ^
      35 |       model: 'modelo-de-prueba',
      36 |       apiKey: 'clave-de-prueba',
      37 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:34:38)
```

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "apiKey": "clave-de-prueba",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "modelo-de-pruebax",
      }

      81 |     const adapter = createNutritionExplainer(config(valid));
      82 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 83 |     expect(constructorArgs(adapter)).toEqual({
         |                                      ^
      84 |       model: 'modelo-de-prueba',
      85 |       apiKey: 'clave-de-prueba',
      86 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:83:38)
```

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › pasa clave y modelo recortados (E1.1)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "apiKey": "clave-de-prueba",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "modelo-de-pruebax",
      }

      116 |     );
      117 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 118 |     expect(constructorArgs(adapter)).toEqual({
          |                                      ^
      119 |       model: 'modelo-de-prueba',
      120 |       apiKey: 'clave-de-prueba',
      121 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:118:38)
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.1b

Mutación:

```text
return new AnthropicNutritionExplainer(model.trim(), key, null);
```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.1b.json)" = '{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › pasa clave y modelo recortados (E1.1)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 2

      Object {
    -   "apiKey": "clave-de-prueba",
    +   "apiKey": "	 clave-de-prueba
    + ",
        "client": null,
        "model": "modelo-de-prueba",
      }

      116 |     );
      117 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 118 |     expect(constructorArgs(adapter)).toEqual({
          |                                      ^
      119 |       model: 'modelo-de-prueba',
      120 |       apiKey: 'clave-de-prueba',
      121 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:118:38)
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.1c

Mutación:

```text
return new AnthropicNutritionExplainer(model, key.trim(), null);
```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.1c.json)" = '{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › pasa clave y modelo recortados (E1.1)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 2

      Object {
        "apiKey": "clave-de-prueba",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "	 modelo-de-prueba
    + ",
      }

      116 |     );
      117 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 118 |     expect(constructorArgs(adapter)).toEqual({
          |                                      ^
      119 |       model: 'modelo-de-prueba',
      120 |       apiKey: 'clave-de-prueba',
      121 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:118:38)
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.1d

Mutación:

```text
return new AnthropicNutritionExplainer(model.replace(/^ +/, '').replace(/ +$/, ''), key.replace(/^ +/, '').replace(/ +$/, ''), null);
```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.1d.json)" = '{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › pasa clave y modelo recortados (E1.1)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 4

      Object {
    -   "apiKey": "clave-de-prueba",
    +   "apiKey": "	 clave-de-prueba
    + ",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "	 modelo-de-prueba
    + ",
      }

      116 |     );
      117 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 118 |     expect(constructorArgs(adapter)).toEqual({
          |                                      ^
      119 |       model: 'modelo-de-prueba',
      120 |       apiKey: 'clave-de-prueba',
      121 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:118:38)
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.1e

Mutación:

```text
return new AnthropicNutritionExplainer(model.replace(/\n+$/, ''), key.replace(/\n+$/, ''), null);
```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.1e.json)" = '{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["pasa clave y modelo recortados (E1.1)"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › pasa clave y modelo recortados (E1.1)

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Object {
    -   "apiKey": "clave-de-prueba",
    +   "apiKey": "	 clave-de-prueba ",
        "client": null,
    -   "model": "modelo-de-prueba",
    +   "model": "	 modelo-de-prueba ",
      }

      116 |     );
      117 |     expect(adapter).toBeInstanceOf(AnthropicNutritionExplainer);
    > 118 |     expect(constructorArgs(adapter)).toEqual({
          |                                      ^
      119 |       model: 'modelo-de-prueba',
      120 |       apiKey: 'clave-de-prueba',
      121 |       client: null,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:118:38)
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.2a

Mutación:

```text
Reordenar los dos bloques completos:
  if (config.get<string>('NODE_ENV') === 'test')
    return new NullNutritionExplainer('node-env-test');

  if (config.get<string>('ANTHROPIC_ENABLED') !== 'true')
    return new NullNutritionExplainer('not-enabled');

```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["NODE_ENV y ANTHROPIC_ENABLED fallan: gana node-env-test"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.2a.json)" = '{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["NODE_ENV y ANTHROPIC_ENABLED fallan: gana node-env-test"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › NODE_ENV y ANTHROPIC_ENABLED fallan: gana node-env-test

    expect(received).toBe(expected) // Object.is equality

    Expected: "node-env-test"
    Received: "not-enabled"

      105 |     );
      106 |     expect(adapter).toBeInstanceOf(NullNutritionExplainer);
    > 107 |     expect((adapter as NullNutritionExplainer).reason).toBe(reason);
          |                                                        ^
      108 |   });
      109 |   it('pasa clave y modelo recortados (E1.1)', () => {
      110 |     const adapter = createNutritionExplainer(

      at modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:107:56
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.2b

Mutación:

```text
Reordenar los dos bloques completos:
  if (config.get<string>('ANTHROPIC_ENABLED') !== 'true')
    return new NullNutritionExplainer('not-enabled');

  const key = config.get<string>('ANTHROPIC_API_KEY');
  if (
    typeof key !== 'string' ||
    key.trim() === '' ||
    key.trim() === ANTHROPIC_API_KEY_PENDING
  )
    return new NullNutritionExplainer('key-missing');

```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.2b.json)" = '{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled

    expect(received).toBe(expected) // Object.is equality

    Expected: "not-enabled"
    Received: "key-missing"

      105 |     );
      106 |     expect(adapter).toBeInstanceOf(NullNutritionExplainer);
    > 107 |     expect((adapter as NullNutritionExplainer).reason).toBe(reason);
          |                                                        ^
      108 |   });
      109 |   it('pasa clave y modelo recortados (E1.1)', () => {
      110 |     const adapter = createNutritionExplainer(

      at modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:107:56
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.2c

Mutación:

```text
Reordenar los dos bloques completos:
  const key = config.get<string>('ANTHROPIC_API_KEY');
  if (
    typeof key !== 'string' ||
    key.trim() === '' ||
    key.trim() === ANTHROPIC_API_KEY_PENDING
  )
    return new NullNutritionExplainer('key-missing');

  const model = config.get<string>('ANTHROPIC_MODEL');
  if (typeof model !== 'string' || model.trim() === '')
    return new NullNutritionExplainer('model-missing');

```

`jest src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`: exit=1.

```json
{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["ANTHROPIC_API_KEY y ANTHROPIC_MODEL fallan: gana key-missing"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.2c.json)" = '{"total":25,"passed":24,"failed":1,"suiteErrors":0,"failedTitles":["ANTHROPIC_API_KEY y ANTHROPIC_MODEL fallan: gana key-missing"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto › ANTHROPIC_API_KEY y ANTHROPIC_MODEL fallan: gana key-missing

    expect(received).toBe(expected) // Object.is equality

    Expected: "key-missing"
    Received: "model-missing"

      105 |     );
      106 |     expect(adapter).toBeInstanceOf(NullNutritionExplainer);
    > 107 |     expect((adapter as NullNutritionExplainer).reason).toBe(reason);
          |                                                        ^
      108 |   });
      109 |   it('pasa clave y modelo recortados (E1.1)', () => {
      110 |     const adapter = createNutritionExplainer(

      at modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts:107:56
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.3a

Mutación:

```text
Capturar el rechazo de this.loadSdk() en el sitio y devolver null sin warn.
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["fallo del import del SDK: null y un warn sin relanzar"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.3a.json)" = '{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["fallo del import del SDK: null y un warn sin relanzar"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null › fallo del import del SDK: null y un warn sin relanzar

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

      329 |     );
      330 |     await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
    > 331 |     expect(warn).toHaveBeenCalledTimes(1);
          |                  ^
      332 |     expect(warn.mock.calls[0][0]).toEqual({
      333 |       scope: 'nutrition-ai',
      334 |       petId: ctx.petId,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:331:18)
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.3b

Mutación:

```text
Envolver new Anthropic(...) en su propio try que devuelve null sin warn.
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["el constructor del SDK lanza: null y un warn sin relanzar"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.3b.json)" = '{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["el constructor del SDK lanza: null y un warn sin relanzar"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null › el constructor del SDK lanza: null y un warn sin relanzar

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

      362 |     await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      363 |     expect(options).toHaveLength(1);
    > 364 |     expect(warn).toHaveBeenCalledTimes(1);
          |                  ^
      365 |     expect(warn.mock.calls[0][0]).toEqual({
      366 |       scope: 'nutrition-ai',
      367 |       petId: ctx.petId,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:364:18)
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.3c

Mutación:

```text
En explain(): await this.loadSdk() -> await import('@anthropic-ai/sdk'); default intacto. ANTHROPIC_BASE_URL=http://127.0.0.1:9.
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":33,"failed":4,"suiteErrors":0,"failedTitles":["anti-vacio: el SDK cargado construye el cliente con clave y constantes","construye el cliente perezoso con clave explicita y constantes","el constructor del SDK lanza: null y un warn sin relanzar","fallo del import del SDK: null y un warn sin relanzar"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.3c.json)" = '{"total":37,"passed":33,"failed":4,"suiteErrors":0,"failedTitles":["anti-vacio: el SDK cargado construye el cliente con clave y constantes","construye el cliente perezoso con clave explicita y constantes","el constructor del SDK lanza: null y un warn sin relanzar","fallo del import del SDK: null y un warn sin relanzar"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R9 (nutrition-ai-explainer #18): parametros exactos de la llamada › construye el cliente perezoso con clave explicita y constantes

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 3
    Received array:  ["import { Logger } from '@nestjs/common';
    import {
      NUTRITION_AI_SCOPE,
      buildUserPrompt,
      NUTRITION_AI_SYSTEM_PROMPT,
    } from './nutrition-prompt';
    import type {
      NutritionEngineInput,
      NutritionPlanResult,
    } from '@/modules/nutrition/domain/nutrition-engine';
    import type {
      NutritionExplainer,
      NutritionExplainerContext,
    } from '@/modules/nutrition/domain/ports/nutrition-explainer';·
    export const NUTRITION_AI_TIMEOUT_MS = 15_000;
    export const NUTRITION_AI_MAX_RETRIES = 0;
    export const NUTRITION_AI_MAX_OUTPUT_TOKENS = 1_200;
    export interface AnthropicMessageParams {
      model: string;
      max_tokens: number;
      system: string;
      messages: { role: 'user'; content: string }[];
    }
    export interface AnthropicMessageResponse {
      content: unknown;
      stop_reason?: string | null;
      usage?: { input_tokens: number; output_tokens: number };
    }
    export interface AnthropicMessagesClient {
      create(params: AnthropicMessageParams): Promise<AnthropicMessageResponse>;
    }
    export interface AnthropicClientOptions {
      apiKey: string;
      timeout: number;
      maxRetries: number;
    }
    export type AnthropicSdkLoader = () => Promise<{
      default: new (options: AnthropicClientOptions) => {
        messages: AnthropicMessagesClient;
      };
    }>;
    export class AnthropicNutritionExplainer implements NutritionExplainer {
      private readonly logger = new Logger(AnthropicNutritionExplainer.name);
      constructor(
        private readonly model: string,
        private readonly apiKey: string,
        private client: AnthropicMessagesClient | null,
        private readonly loadSdk: AnthropicSdkLoader = async () =>
          ", ",
      ) {}
      async explain(
        input: NutritionEngineInput,
        result: NutritionPlanResult,
        ctx: NutritionExplainerContext,
      ): Promise<string | null> {
        try {
          if (this.client === null) {
            const { default: Anthropic } = ", ";
            this.client = new Anthropic({
              apiKey: this.apiKey,
              timeout: NUTRITION_AI_TIMEOUT_MS,
              maxRetries: NUTRITION_AI_MAX_RETRIES,
            }).messages;
          }
          const response = await this.client.create({
            model: this.model,
            max_tokens: NUTRITION_AI_MAX_OUTPUT_TOKENS,
            system: NUTRITION_AI_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: buildUserPrompt(input, result) }],
          });
          const blocks = Array.isArray(response.content)
            ? (response.content as { type: string; text?: string }[])
            : [];
          const text = blocks
            .filter((block) => block.type === 'text')
            .map((block) => block.text ?? '')
            .join('')
            .trim();
          if (response.stop_reason === 'end_turn' && text.length > 0) return text;
          this.logger.warn({
            scope: NUTRITION_AI_SCOPE,
            petId: ctx.petId,
            planId: ctx.planId,
            message: 'ai explanation unusable',
            stopReason: response.stop_reason ?? null,
            usage: response.usage ?? null,
          });
          return null;
        } catch (error) {
          this.logger.warn({
            scope: NUTRITION_AI_SCOPE,
            petId: ctx.petId,
            planId: ctx.planId,
            message: error instanceof Error ? error.message : String(error),
          });
          return null;
        }
      }
    }
    "]

       96 |     expect(source).toContain('maxRetries: NUTRITION_AI_MAX_RETRIES');
       97 |     expect(source).not.toContain('maxRetries: 0');
    >  98 |     expect(source.split("await import('@anthropic-ai/" + "sdk')")).toHaveLength(
          |                                                                    ^
       99 |       2,
      100 |     );
      101 |     expect(source).not.toContain("from '@anthropic-ai/" + "sdk'");

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:98:68)
```

```text
  ● R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null › fallo del import del SDK: null y un warn sin relanzar

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
    -   "message": "sdk ausente",
    +   "message": "TypeError [ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG]: A dynamic import callback was invoked without --experimental-vm-modules",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
      }

      330 |     await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      331 |     expect(warn).toHaveBeenCalledTimes(1);
    > 332 |     expect(warn.mock.calls[0][0]).toEqual({
          |                                   ^
      333 |       scope: 'nutrition-ai',
      334 |       petId: ctx.petId,
      335 |       planId: ctx.planId,

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:332:35)
```

```text
  ● R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null › el constructor del SDK lanza: null y un warn sin relanzar

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      361 |     );
      362 |     await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
    > 363 |     expect(options).toHaveLength(1);
          |                     ^
      364 |     expect(warn).toHaveBeenCalledTimes(1);
      365 |     expect(warn.mock.calls[0][0]).toEqual({
      366 |       scope: 'nutrition-ai',

      at Object.<anonymous> (modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:363:21)
```

```text
  ● R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null › anti-vacio: el SDK cargado construye el cliente con clave y constantes

    expect(received).resolves.toBe(expected) // Object.is equality

    Expected: "Tu perro necesita..."
    Received: null

      394 |       loadSdk,
      395 |     );
    > 396 |     await expect(adapter.explain(input, result, ctx)).resolves.toBe(
          |                                                                ^
      397 |       'Tu perro necesita...',
      398 |     );
      399 |     expect(options).toEqual([

      at Object.toBe (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2140:20)
      at Object.<anonymous> (modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:396:64)
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.4a

Mutación:

```text
Array.isArray(response.content) -> response.content !== null
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":32,"failed":5,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content numero con exactamente un warn completo","degrada content objeto con exactamente un warn completo","degrada content string con exactamente un warn completo","degrada content undefined con exactamente un warn completo"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.4a.json)" = '{"total":37,"passed":32,"failed":5,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content numero con exactamente un warn completo","degrada content objeto con exactamente un warn completo","degrada content string con exactamente un warn completo","degrada content undefined con exactamente un warn completo"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content string con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      209 |       expect(warn).toHaveBeenCalledTimes(1);
    > 210 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      211 |         scope: 'nutrition-ai',
      212 |         petId: ctx.petId,
      213 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:210:37
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content objeto con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      209 |       expect(warn).toHaveBeenCalledTimes(1);
    > 210 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      211 |         scope: 'nutrition-ai',
      212 |         petId: ctx.petId,
      213 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:210:37
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content numero con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      209 |       expect(warn).toHaveBeenCalledTimes(1);
    > 210 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      211 |         scope: 'nutrition-ai',
      212 |         petId: ctx.petId,
      213 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:210:37
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content undefined con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "Cannot read properties of undefined (reading 'filter')",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      209 |       expect(warn).toHaveBeenCalledTimes(1);
    > 210 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      211 |         scope: 'nutrition-ai',
      212 |         petId: ctx.petId,
      213 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:210:37
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content array-like con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      209 |       expect(warn).toHaveBeenCalledTimes(1);
    > 210 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      211 |         scope: 'nutrition-ai',
      212 |         petId: ctx.petId,
      213 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:210:37
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.4b

Mutación:

```text
Array.isArray(response.content) -> typeof response.content === 'object' && response.content !== null
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":35,"failed":2,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content objeto con exactamente un warn completo"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.4b.json)" = '{"total":37,"passed":35,"failed":2,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo","degrada content objeto con exactamente un warn completo"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content objeto con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      209 |       expect(warn).toHaveBeenCalledTimes(1);
    > 210 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      211 |         scope: 'nutrition-ai',
      212 |         petId: ctx.petId,
      213 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:210:37
```

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content array-like con exactamente un warn completo

    expect(received).toEqual(expected) // deep equality

    - Expected  - 6
    + Received  + 1

      Object {
    -   "message": "ai explanation unusable",
    +   "message": "blocks.filter is not a function",
        "petId": "11111111-1111-1111-1111-111111111111",
        "planId": "22222222-2222-2222-2222-222222222222",
        "scope": "nutrition-ai",
    -   "stopReason": "end_turn",
    -   "usage": Object {
    -     "input_tokens": 10,
    -     "output_tokens": 20,
    -   },
      }

      208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
      209 |       expect(warn).toHaveBeenCalledTimes(1);
    > 210 |       expect(warn.mock.calls[0][0]).toEqual({
          |                                     ^
      211 |         scope: 'nutrition-ai',
      212 |         petId: ctx.petId,
      213 |         planId: ctx.planId,

      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:210:37
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.4c

Mutación:

```text
Toda la expresión de blocks -> Array.from((response.content ?? []) as ArrayLike<{ type: string; text?: string }>)
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.4c.json)" = '{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content array-like con exactamente un warn completo

    expect(received).resolves.toBeNull()

    Received: "Tu perro necesita..."

      206 |         { create },
      207 |       );
    > 208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
          |                                                                  ^
      209 |       expect(warn).toHaveBeenCalledTimes(1);
      210 |       expect(warn.mock.calls[0][0]).toEqual({
      211 |         scope: 'nutrition-ai',

      at Object.toBeNull (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2140:20)
      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:208:66
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.4d

Mutación:

```text
Toda la expresión de blocks -> Object.values((response.content ?? {}) as Record<string, { type: string; text?: string }>)
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.4d.json)" = '{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada content array-like con exactamente un warn completo"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada content array-like con exactamente un warn completo

    expect(received).resolves.toBeNull()

    Received: "Tu perro necesita..."

      206 |         { create },
      207 |       );
    > 208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
          |                                                                  ^
      209 |       expect(warn).toHaveBeenCalledTimes(1);
      210 |       expect(warn.mock.calls[0][0]).toEqual({
      211 |         scope: 'nutrition-ai',

      at Object.toBeNull (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2140:20)
      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:208:66
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.5a

Mutación:

```text
Filtro -> block.type !== 'thinking'
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada solo bloque no-text con text con exactamente un warn completo"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.5a.json)" = '{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada solo bloque no-text con text con exactamente un warn completo"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada solo bloque no-text con text con exactamente un warn completo

    expect(received).resolves.toBeNull()

    Received: "no es explicacion"

      206 |         { create },
      207 |       );
    > 208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
          |                                                                  ^
      209 |       expect(warn).toHaveBeenCalledTimes(1);
      210 |       expect(warn.mock.calls[0][0]).toEqual({
      211 |         scope: 'nutrition-ai',

      at Object.toBeNull (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2140:20)
      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:208:66
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.5b

Mutación:

```text
Filtro -> block.type.startsWith('text')
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada solo bloque no-text con text con exactamente un warn completo"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.5b.json)" = '{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada solo bloque no-text con text con exactamente un warn completo"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada solo bloque no-text con text con exactamente un warn completo

    expect(received).resolves.toBeNull()

    Received: "no es explicacion"

      206 |         { create },
      207 |       );
    > 208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
          |                                                                  ^
      209 |       expect(warn).toHaveBeenCalledTimes(1);
      210 |       expect(warn.mock.calls[0][0]).toEqual({
      211 |         scope: 'nutrition-ai',

      at Object.toBeNull (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2140:20)
      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:208:66
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

### S-E1.5c

Mutación:

```text
Filtro -> block.type.includes('text')
```

`jest src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`: exit=1.

```json
{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada solo bloque no-text con text con exactamente un warn completo"]}
```

`[ "$(node /tmp/e1-check.js /tmp/e1-S-E1.5c.json)" = '{"total":37,"passed":36,"failed":1,"suiteErrors":0,"failedTitles":["degrada solo bloque no-text con text con exactamente un warn completo"]}' ] && echo SONDA-OK || echo SONDA-DISTINTA`: **SONDA-OK**.

```text
  ● R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn › degrada solo bloque no-text con text con exactamente un warn completo

    expect(received).resolves.toBeNull()

    Received: "no es explicacion"

      206 |         { create },
      207 |       );
    > 208 |       await expect(adapter.explain(input, result, ctx)).resolves.toBeNull();
          |                                                                  ^
      209 |       expect(warn).toHaveBeenCalledTimes(1);
      210 |       expect(warn.mock.calls[0][0]).toEqual({
      211 |         scope: 'nutrition-ai',

      at Object.toBeNull (../node_modules/.pnpm/expect@30.4.1/node_modules/expect/build/index.js:2140:20)
      at modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts:208:66
```

Restauración: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`.

```text
$ git diff --quiet -- backend-pet-tracker; echo "exit=$?"
exit=0
$ git diff --cached --quiet; echo "exit=$?"
exit=0
$ git ls-files --others --exclude-standard -- backend-pet-tracker | wc -l
0
```

## Anclas E1 antes de E1-c18

| Ancla | Declarado tras E1 | Medido | Exit |
|---|---|---|---|
| E1-A1 | 1 | 1 | 0 |
| E1-A2 | 0 | 0 | 1 |
| E1-A3 | 1 | 1 | 0 |
| E1-A4 | 1 | 1 | 0 |
| E1-A5 | 1 | 1 | 0 |
| E1-A6 | 1 | 1 | 0 |
| E1-A7 | 1 | 1 | 0 |
| E1-A8 | 1 | 1 | 0 |
| E1-A9 | 0 | 0 | 1 |
| E1-A10 | 4 | 4 | 0 |
| E1-A11 | 1 | 1 | 0 |
| E1-A12 | 1 | 1 | 0 |
| E1-A13 | 0 | 0 | 1 |
| E1-A14 | 1 | 1 | 0 |
| E1-A15 | 1 | 1 | 0 |
| E1-A16 | 1 | 1 | 0 |
| E1-A17 | 1 | 1 | 0 |
| E1-A18 | 1 | 1 | 0 |
| E1-A19 | 1 | 1 | 0 |
| E1-A20 | 1 | 1 | 0 |
| E1-A21 | 1 | 1 | 0 |
| E1-A22 | 2 | 2 | 0 |
| E1-A23 | 2 | 2 | 0 |
| E1-A24 | 7 | 7 | 0 |
| E1-A25 | 2 | 2 | 0 |
| E1-A26 | 0 | 0 | 0 |
| E1-A27 | 0 | 0 | 0 |
| E1-A28 | 0 | 0 | 0 |
| E1-A29 | 1 | 1 | 0 |
| E1-A30 | 1 | 1 | 0 |
| E1-A31 | 1 | 1 | 0 |
| E1-A32 | 1 | 1 | 0 |
| E1-A33 | 1 | 1 | 0 |
| E1-A34 | 3 | 3 | 0 |
| E1-A35 | 3 | 3 | 0 |
| E1-A36 | 3 | 3 | 0 |
| E1-A37 | 1 | 1 | 0 |
| E1-A38 | 4 | 4 | 0 |

## Bloqueos

## Decisiones E1

- Se ejecutan las 18 sondas enumeradas aunque el párrafo de cierre dice «17». No se cambian sus gates.
- Los dobles de E1.3 se escribieron desde su intención: un cargador que rechaza, una clase que registra opciones y lanza, y una clase que registra opciones y expone `messages.create`. Ninguno importa el SDK.
- El refactor E1-c7 precede a su test por la excepción explícita de E1.3 para mantener tsc verde.
- E1-c18 sólo lleva este informe y las siete filas E1 de traceability. Su hash propio y los comandos posteriores quedan en §Final E1 sin commitear, para que los versione el leader.

## Commit de cierre E1-c18

`docs(nutrition-ai-explainer): #18 traceability and probes for amendment E1`. El hash y la salida del paso 6 se añaden después del commit en §Final E1.
