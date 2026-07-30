---
feature: "db-setup-drizzle"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[db-setup-drizzle]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del
> proyecto. Esta feature es mayormente infraestructura compartida
> (`src/db/`) más un módulo de negocio mínimo (`health`) que sí sigue
> Clean Architecture para quedar testeable sin Postgres real.

## Decisiones técnicas

- **`src/db/` como infraestructura compartida, no un módulo de feature**:
  `drizzle-kit` necesita un único punto de entrada de schema. Vive fuera de
  `src/modules/` porque no pertenece a ningún dominio concreto — es el punto
  de conexión que todos los módulos futuros comparten (sirve R2, R3, R4).

- **`DrizzleModule` global con token `DRIZZLE`**: un solo `pg.Pool` para todo
  el proceso, expuesto como provider bajo el token `DRIZZLE` (ya mencionado
  en `docs/conventions.md`). Los repositorios Drizzle de features futuras lo
  inyectan con `@Inject(DRIZZLE)`. Sirve a R4, R6.

- **`ConfigModule` global leyendo `../.env`**: el backend corre en
  `backend-pet-tracker/` pero el `.env` vive en la raíz del repo (mismo que
  lee `docker-compose.yml` e `init.sh`, ver `docs/conventions.md` §Variables
  de entorno). `isGlobal: true` evita reimportar `ConfigModule` en cada
  módulo de feature. Sirve a R5, R6.

- **`DATABASE_URL` solo vía `ConfigService`**: el `pg.Pool` de
  `DrizzleModule` se construye con un factory provider que inyecta
  `ConfigService` (`useFactory: (config: ConfigService) => new Pool({
  connectionString: config.get('DATABASE_URL') })`). Ningún otro archivo
  debe volver a leer `process.env.DATABASE_URL`. Sirve a R6.

- **`health` como módulo de negocio mínimo con las 3 capas**: aunque
  "verificar la conexión a Postgres" parece puramente técnico, se modela
  igual que cualquier otro módulo para (a) poder testear el caso de uso con
  un mock de la interfaz sin levantar Postgres, y (b) dejar un patrón
  reutilizable si en el futuro `/v1/health` también verifica Dynamo/SQS.
  - `domain/repositories/database-health-checker.repository.ts`: interface
    `DatabaseHealthChecker { ping(): Promise<boolean> }` + token
    `DATABASE_HEALTH_CHECKER`.
  - `application/use-cases/check-health.use-case.ts`: orquesta la llamada a
    `ping()` y devuelve un resultado de dominio (`ok` | `error`), sin saber
    de HTTP ni de Drizzle.
  - `infrastructure/repositories/database-health.drizzle.repository.ts`:
    implementa `DatabaseHealthChecker` con `DRIZZLE`/`pg.Pool` (`SELECT 1`).
  - `infrastructure/health.controller.ts`: `GET /v1/health`, llama al caso de
    uso, mapea `ok`→200 y `error`→503 (`ServiceUnavailableException`).
  Sirve a R7, R8, R9.

- **Prefijo global `/v1` en `main.ts`**: `app.setGlobalPrefix('v1')` antes de
  `listen()`, para que `/v1/health` (y todos los endpoints futuros) queden
  bajo el mismo namespace de versión sin repetirlo en cada controller. Sirve
  a R9.

- **`/v1/health` público "por ausencia de guard"**: esta feature no crea
  `@Public()` ni `AuthGuard` (eso es de `auth-login-me`, id 4). El endpoint
  es público simplemente porque hoy no hay ningún guard global registrado.
  El controller no necesita ningún decorador especial todavía.

## Archivos afectados

- `backend-pet-tracker/package.json` — infrastructure/build: agrega
  `drizzle-orm`, `pg` (deps) y `drizzle-kit`, `@types/pg` (devDeps).
- `backend-pet-tracker/drizzle.config.ts` — infrastructure: config de
  `drizzle-kit` (schema, out, dialect, credentials vía `DATABASE_URL`).
- `backend-pet-tracker/src/db/schema/index.ts` — infrastructure: barrel de
  schema (vacío/mínimo, punto de entrada para `drizzle-kit` y para futuros
  `<module>.schema.ts`).
- `backend-pet-tracker/src/db/drizzle.module.ts` — infrastructure: módulo
  global NestJS, factory provider del token `DRIZZLE` sobre `pg.Pool` +
  `drizzle-orm/node-postgres`.
- `backend-pet-tracker/src/db/migrations/` — output generado por
  `drizzle-kit generate` (versionado en git, no editado a mano).
- `backend-pet-tracker/src/config/config.module.ts` (o config inline en
  `app.module.ts`) — infrastructure/bootstrap: `ConfigModule.forRoot({
  isGlobal: true, envFilePath: ['../.env'] })`.
- `backend-pet-tracker/src/modules/health/domain/repositories/database-health-checker.repository.ts`
  — domain: interface + token `DATABASE_HEALTH_CHECKER`.
- `backend-pet-tracker/src/modules/health/application/use-cases/check-health.use-case.ts`
  — application: caso de uso, depende solo de la interface de domain.
- `backend-pet-tracker/src/modules/health/infrastructure/repositories/database-health.drizzle.repository.ts`
  — infrastructure: implementación con Drizzle/pg (`SELECT 1`).
- `backend-pet-tracker/src/modules/health/infrastructure/health.controller.ts`
  — infrastructure: `GET /v1/health`, mapea resultado del caso de uso a HTTP.
- `backend-pet-tracker/src/modules/health/health.module.ts` — wiring de
  providers/tokens del módulo.
- `backend-pet-tracker/src/app.module.ts` — importa `ConfigModule`,
  `DrizzleModule`, `HealthModule`.
- `backend-pet-tracker/src/main.ts` — agrega `app.setGlobalPrefix('v1')`.
- `.env.example` (raíz) — ya contiene `DATABASE_URL`; no cambia en esta
  feature (confirmar que sigue alineado con `docker-compose.yml`).

## Alternativas descartadas

- **Health check directo en el controller sin caso de uso ni interface**:
  más rápido de escribir, pero rompe la regla de capas de
  `docs/architecture.md` (el controller pasaría a conocer Drizzle
  directamente) y hace imposible testear la rama de error sin una Postgres
  real caída a propósito. Descartada.
- **`pg-promise` u otro cliente en vez de `pg` + `drizzle-orm/node-postgres`**:
  `docs/architecture.md` y `docs/data-model.md` ya fijan Drizzle + Postgres
  como la decisión de persistencia del proyecto; introducir otro cliente
  sería divergir sin necesidad. Descartada.
- **Ejecutar `drizzle-kit migrate` automáticamente en el arranque de la
  app**: simplifica el flujo local, pero acopla el boot de la app a la
  disponibilidad de migraciones y complica CI/tests que no necesitan
  schema real. Se documenta como fuera de alcance; una feature posterior (o
  `init.sh`) decide cuándo correr `migrate`.
- **Leer `DATABASE_URL` con `process.env` directo dentro de
  `drizzle.config.ts`**: `drizzle-kit` corre fuera del contexto de Nest/
  `ConfigService`, así que ahí es inevitable usar `process.env` (o `dotenv`
  manual apuntando a `../.env`) — se documenta como la única excepción
  aceptada a R6, ya que `drizzle.config.ts` no es código de aplicación en
  runtime sino tooling de build/CLI.
