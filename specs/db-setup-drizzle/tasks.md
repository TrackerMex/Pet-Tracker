---
feature: "db-setup-drizzle"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[db-setup-drizzle]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## R1 — Dependencias instaladas, build y tests verdes

- [ ] (1) Escribir test que falla para R1: script/test de CI que corre
      `pnpm run build` y `pnpm test` en `backend-pet-tracker/` antes de tener
      `drizzle-orm`/`pg`/`drizzle-kit` en `package.json` (falla porque el
      código que los importa aún no existe / build roto por imports faltantes).
- [ ] (2) Implementación mínima que lo pasa: agregar `drizzle-orm`, `pg` a
      `dependencies` y `drizzle-kit`, `@types/pg` a `devDependencies`,
      `pnpm install`.
- [ ] (3) Refactor con tests verdes: fijar versiones consistentes con el
      resto del stack (Nest 11, TS 5.7) sin cambiar comportamiento.

## R2 — drizzle.config.ts apunta a barrel y carpeta de migraciones

- [ ] (1) Escribir test que falla para R2: test unitario que importa
      `drizzle.config.ts` (o lo evalúa) y asserta `schema === 'src/db/schema/index.ts'`,
      `out === 'src/db/migrations'`, `dialect === 'postgresql'` — falla porque
      el archivo no existe.
- [ ] (2) Implementación mínima que lo pasa: crear `drizzle.config.ts` con
      `defineConfig` de `drizzle-kit` con esos valores y credentials desde
      `DATABASE_URL` (leído para el CLI, ver design.md "Alternativas
      descartadas").
- [ ] (3) Refactor con tests verdes: extraer la ruta del `.env` raíz a una
      constante compartida si aplica.

## R3 — drizzle-kit generate produce migraciones versionadas

- [ ] (1) Escribir test que falla para R3: test/script de integración que
      corre `pnpm exec drizzle-kit generate` contra un schema mínimo de
      prueba y asserta que aparece al menos un `.sql` en `src/db/migrations/`
      — falla porque `src/db/schema/index.ts` aún no existe.
- [ ] (2) Implementación mínima que lo pasa: crear `src/db/schema/index.ts`
      como barrel (aunque esté vacío o con un placeholder exportable) y
      correr `generate` para confirmar que el comando produce output.
- [ ] (3) Refactor con tests verdes: documentar en `package.json` un script
      `db:generate` que envuelva el comando para no repetir flags.

## R4 — DrizzleModule global expone cliente bajo token DRIZZLE

- [ ] (1) Escribir test que falla para R4: test unitario con
      `Test.createTestingModule` que importa `DrizzleModule` (con
      `ConfigService` mockeado) y resuelve `DRIZZLE` — falla porque el
      módulo/provider no existen.
- [ ] (2) Implementación mínima que lo pasa: crear
      `src/db/drizzle.module.ts` como `@Global()` `@Module` con un factory
      provider `{ provide: DRIZZLE, useFactory: (config: ConfigService) => ...,
      inject: [ConfigService] }` que arma `pg.Pool` + `drizzle(pool)`.
- [ ] (3) Refactor con tests verdes: mover el token `DRIZZLE` a un archivo
      de constantes compartido si se referencia desde varios lugares.

## R5 — ConfigModule global lee ../.env

- [ ] (1) Escribir test que falla para R5: test unitario que instancia
      `AppModule` (o un módulo hoja sin importar `ConfigModule` explícitamente)
      y resuelve `ConfigService` para leer una variable definida solo en un
      `.env` de fixture — falla porque `ConfigModule` no está registrado.
- [ ] (2) Implementación mínima que lo pasa: agregar
      `ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../.env'] })`
      a `AppModule`.
- [ ] (3) Refactor con tests verdes: extraer la config a
      `src/config/config.module.ts` si `app.module.ts` empieza a crecer.

## R6 — DATABASE_URL nunca vía process.env directo (fuera de config)

- [ ] (1) Escribir test que falla para R6: test estático (grep/AST) sobre
      `backend-pet-tracker/src/**/*.ts` que falla si encuentra
      `process.env.DATABASE_URL` fuera de los archivos de bootstrap de
      config — falla si el `pg.Pool` se escribió con `process.env` directo.
- [ ] (2) Implementación mínima que lo pasa: asegurar que `DrizzleModule` (y
      cualquier otro punto) obtienen `DATABASE_URL` únicamente vía
      `ConfigService.get('DATABASE_URL')`.
- [ ] (3) Refactor con tests verdes: dejar el test estático como chequeo
      reusable (config de ESLint `no-restricted-syntax` o test dedicado) para
      que features futuras no lo rompan.

## R7 — GET /v1/health → 200 con Postgres arriba

- [ ] (1) Escribir test que falla para R7: test e2e (`test/health.e2e-spec.ts`)
      que levanta la app con Postgres real (Docker) y espera
      `GET /v1/health` → 200 con `{ postgres: 'ok' }` — falla porque el
      endpoint no existe.
- [ ] (2) Implementación mínima que lo pasa: crear `HealthModule` con las 3
      capas descritas en design.md (`DatabaseHealthChecker`,
      `CheckHealthUseCase`, `DatabaseHealthDrizzleRepository`,
      `HealthController`) y registrarlo en `AppModule`.
- [ ] (3) Refactor con tests verdes: revisar shape de la respuesta (formato
      consistente para features futuras que agreguen más dependencias al
      health check, ej. Dynamo/SQS).

## R8 — GET /v1/health → 503 con Postgres caído

- [ ] (1) Escribir test que falla para R8: test unitario del
      `CheckHealthUseCase` con un mock de `DatabaseHealthChecker` cuyo
      `ping()` rechaza/devuelve `false`, y test e2e/controller que asserta
      503 — falla porque el controller aún no mapea el caso de error.
- [ ] (2) Implementación mínima que lo pasa: el use case devuelve estado
      `error` cuando `ping()` falla; el controller lanza
      `ServiceUnavailableException` sin exponer el error crudo del driver.
- [ ] (3) Refactor con tests verdes: unificar el manejo de errores con la
      tabla de `docs/conventions.md` §Manejo de errores.

## R9 — GET /v1/health público bajo prefijo /v1

- [ ] (1) Escribir test que falla para R9: test e2e que llama
      `GET /v1/health` (sin prefijo `/v1` primero, para confirmar que 404;
      luego con `/v1/health` sin `Authorization`) y espera no-401 — falla
      porque `setGlobalPrefix('v1')` no está configurado.
- [ ] (2) Implementación mínima que lo pasa: agregar
      `app.setGlobalPrefix('v1')` en `main.ts` antes de `listen()`.
- [ ] (3) Refactor con tests verdes: confirmar que `app.controller.ts`
      (endpoint raíz heredado del boilerplate de Nest) no rompe con el nuevo
      prefijo; ajustar o retirar si ya no aplica.
