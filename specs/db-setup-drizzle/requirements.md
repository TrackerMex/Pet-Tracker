---
feature: "db-setup-drizzle"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[db-setup-drizzle]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id=1 (Plan 002, parte datos, local) +
> `docs/architecture.md` + `docs/data-model.md` + `docs/conventions.md`.

## Requisitos funcionales

- **R1**: WHEN se ejecutan `pnpm run build` y `pnpm test` en `backend-pet-tracker/`
  con `drizzle-orm`, `pg` y `drizzle-kit` agregados a `package.json` THE SYSTEM
  SHALL completar ambos comandos con código de salida 0.

- **R2**: WHEN `drizzle-kit` resuelve `backend-pet-tracker/drizzle.config.ts`
  THE SYSTEM SHALL apuntar `schema` al barrel `src/db/schema/index.ts` y `out`
  a `src/db/migrations/`, y `dialect` a `postgresql`.

- **R3**: WHEN se ejecuta `drizzle-kit generate` contra el schema definido en
  `src/db/schema/index.ts` THE SYSTEM SHALL generar al menos un archivo `.sql`
  de migración versionado en `src/db/migrations/`.

- **R4**: WHEN `AppModule` importa `DrizzleModule` (`src/db/drizzle.module.ts`,
  módulo global) THE SYSTEM SHALL exponer un cliente Drizzle (`drizzle-orm/node-postgres`)
  construido sobre un `pg.Pool`, inyectable en cualquier módulo bajo el token
  `DRIZZLE`.

- **R5**: WHEN la aplicación arranca THE SYSTEM SHALL cargar `ConfigModule` de
  `@nestjs/config` como módulo global (`isGlobal: true`) con
  `envFilePath: ['../.env']`, de modo que `ConfigService` quede disponible en
  cualquier módulo sin volver a importar `ConfigModule`.

- **R6**: IF algún archivo de `backend-pet-tracker/src/**` (fuera de la
  configuración interna de `ConfigModule`) lee `process.env.DATABASE_URL`
  directamente THEN THE SYSTEM SHALL considerarse no conforme — la única vía
  permitida para obtener la connection string de Postgres es
  `ConfigService.get('DATABASE_URL')`, incluyendo el `pg.Pool` de
  `DrizzleModule`.

- **R7**: WHEN se hace `GET /v1/health` y la conexión a Postgres responde
  correctamente a una verificación (`SELECT 1` o equivalente) THE SYSTEM SHALL
  responder 200 con un payload que incluya el estado de la conexión a Postgres
  como `ok`.

- **R8**: IF la verificación de conexión a Postgres falla o excede el timeout
  THEN `GET /v1/health` THE SYSTEM SHALL responder 503 con un payload que
  incluya el estado de la conexión a Postgres como `error` (nunca dejar
  escapar la excepción cruda del driver/pg al cliente).

- **R9**: WHEN se hace `GET /v1/health` sin cabecera `Authorization` THE
  SYSTEM SHALL responder sin exigir autenticación (ruta pública, accesible
  bajo el prefijo global `/v1` configurado en `main.ts`), dado que en esta
  feature no existe todavía un guard global de autenticación.

## Fuera de alcance

- Aplicar (`migrate`) las migraciones generadas contra la base de datos real
  — esta feature solo cubre `drizzle-kit generate`; ejecutar/orquestar
  migraciones en arranque o CI es una decisión de una feature posterior.
- Cualquier tabla de dominio (`users`, `pets`, etc.) — el barrel
  `src/db/schema/index.ts` queda como punto de entrada válido para
  `drizzle-kit` pero sin tablas de negocio; cada feature futura agrega su
  propio `<module>.schema.ts` y lo re-exporta desde el barrel.
- El decorador `@Public()` y el `AuthGuard` global — se introducen en la
  feature `auth-login-me` (id 4); aquí `/v1/health` es público simplemente
  porque todavía no existe ningún guard global que lo bloquee.
- Reintentos, backoff o circuit breaker sobre el pool de conexiones —
  se usa el comportamiento por defecto de `pg.Pool`.
- Seeds, datos de prueba o cualquier lógica de negocio de mascotas/usuarios.
- Script `docker compose up` en sí (ya existe en `docker-compose.yml`); esta
  feature asume que Postgres puede levantarse con lo ya provisto.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
