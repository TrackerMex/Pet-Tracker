---
feature: "backend-pg-pool-error-listener"
status: draft        # draft | approved
tags: [harness, spec, backend, db, resiliencia]
---

# Diseño — [[backend-pg-pool-error-listener]]

> Ver [[requirements]] para los requisitos y la causa verificada, y
> [[../../docs/architecture|architecture]] para las capas. Las rutas son
> relativas a `backend-pet-tracker/`.

## Decisiones técnicas

### El listener en el factory de `PG_POOL` (R1; D1, D2, D3)

Capa: infraestructura compartida (`src/db/`). Solo cambia
`src/db/drizzle.module.ts`:

- **Import.** Se añade `Logger` a la lista de `@nestjs/common`, en orden
  alfabético: `Global, Inject, Injectable, Logger, Module, OnModuleDestroy`.
- **Logger de módulo.** Una línea nueva entre los imports y
  `@Injectable() class DrizzlePoolLifecycle`:
  `const poolLogger = new Logger('PgPool');`
- **Factory.** El cuerpo de `useFactory: (config: ConfigService) => { ... }`
  del provider `PG_POOL` pasa a tres sentencias, en este orden:
  1. `const pool = new Pool({` con la misma línea de hoy,
     `connectionString: config.get<string>('DATABASE_URL'),`, y `});`;
  2. `pool.on('error', (error) => {`, con una sola sentencia dentro,
     ``poolLogger.error(`Idle client error: ${error.message}`, error.stack);``,
     y `});`;
  3. `return pool;`.
- `error` queda tipado como `Error` por la sobrecarga
  `on<K extends "error" | ...>` de `@types/pg@8.20.0`; no hace falta anotarlo.
- El listener no lanza, no reintenta y no toca el pool: `pg-pool` ya sacó al
  cliente de `_clients` antes de emitir ([[requirements]] §Causa 4).
- No cambian `DrizzlePoolLifecycle`, el provider `DRIZZLE` ni
  `exports: [DRIZZLE],`.

Esta forma ya se pasó por `prettier` (config `.prettierrc` del backend) y por
`eslint --stdin` sin cambios ni avisos: la línea de `poolLogger.error` mide 79
columnas con su sangría y cabe en una sola línea.

### El test (R1; D4)

En `src/db/drizzle.module.spec.ts`, **detrás** del `describe('R4: …')`
existente, que no se toca:

- **Imports nuevos o ampliados:**
  - `import { Logger } from '@nestjs/common';`
  - `import type { Pool } from 'pg';`
  - la línea `import { DRIZZLE } from './drizzle.constants';` pasa a
    `import { DRIZZLE, PG_POOL } from './drizzle.constants';`.
- **`describe('#238: PG_POOL logs idle client errors instead of crashing', ...)`**
  con su propio `let moduleRef: TestingModule;`, y un `beforeAll` y un
  `afterAll` copiados del `describe('R4: …')`: el mismo
  `Test.createTestingModule({ imports: [DrizzleModule] })`, el mismo
  `.overrideProvider(ConfigService).useValue({ get: ... })` con la URL
  `'postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker'`, y
  `await moduleRef.close();`. El `Pool` no conecta hasta la primera consulta y
  el test no consulta: no hace falta Postgres. `close()` llama a
  `pool.end()`, que con cero clientes resuelve en el acto.
- **El it** `#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw`,
  síncrono, en este orden:
  1. `const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();`
     (una línea, como la deja prettier). Es el patrón de
     `src/workers/notifier/expo-push-sender.spec.ts`.
  2. `const pool = moduleRef.get<Pool>(PG_POOL);`
  3. `const error = new Error('terminating connection due to administrator command');`
     (prettier la parte en tres líneas; el literal no cambia).
  4. `try {`
     - `expect(() => pool.emit('error', error)).not.toThrow();`
     - `expect(errorSpy).toHaveBeenCalledTimes(1);`
     - `expect(errorSpy).toHaveBeenCalledWith('Idle client error: terminating connection due to administrator command', error.stack);`
  5. `} finally { errorSpy.mockRestore(); }`

  El `finally` deja `Logger.prototype.error` intacto aunque el it falle. La
  config de jest del `package.json` no tiene `restoreMocks`.

### Por qué no es tautológico

- El mensaje esperado es un literal escrito a mano, no se importa ni se
  construye con el prefijo de producción.
- El `stack` esperado sale del `Error` que crea el propio test, no de
  producción.
- El it ejerce el mismo evento que emite `pg-pool` (`pool.emit('error', err, client)`
  en `makeIdleListener`). El segundo argumento, `client`, no se pasa: el
  listener no lo usa y `toHaveBeenCalledWith` exige que el log no dependa de él.

### Rojo de R1

Con el código de hoy no hay listener. `emit` lanza: bajo Jest el `Error` nace
en el realm del test, así que Node lanza `ERR_UNHANDLED_ERROR` («Unhandled
error.») en vez del propio error; en ambos casos lanza. La primera aserción
falla. Con jest 30 el log muestra `expect(received).not.toThrow()` y
`Error message: "Unhandled error.` (enmienda E1 de [[requirements]]). Es un
rojo por aserción, no por excepción fuera del `expect`.

### Mutaciones

Sobre el HEAD del verde de R1. Cada una se planta, se corre el fichero, se
anota y se restaura con
`git checkout HEAD -- src/db/drizzle.module.ts`, comprobando después
`git diff --quiet HEAD -- src/db/drizzle.module.ts; echo "exit=$?"` → `exit=0`.

- **M1 — sin listener.** Borrar las tres líneas de
  `pool.on('error', (error) => { ... });`.
  - Esperado: `exit` distinto de 0; `Tests: 1 failed, 1 passed, 2 total`; el it
    de R1 falla y el log muestra `expect(received).not.toThrow()` y
    `Error message: "Unhandled error.` (`grep -cF` = `1` cada uno);
    `grep -cF "on('error'" src/db/drizzle.module.ts` da `0`.
- **M2 — listener sin log.** Borrar solo la línea
  ``poolLogger.error(`Idle client error: ${error.message}`, error.stack);``,
  dejando el listener vacío.
  - Esperado: `exit` distinto de 0; `Tests: 1 failed, 1 passed, 2 total`; el it
    de R1 falla en `toHaveBeenCalledTimes(1)` con `Received number of calls: 0`.
  - Es la mutación en la zona que la primera aserción no mira: con un listener
    vacío ya no lanza.

No hay más mutaciones. Cambiar `error` por `warn` o el texto del mensaje cae
en M2 o en `toHaveBeenCalledWith`, con el mismo it.

## Archivos afectados

- `backend-pet-tracker/src/db/drizzle.module.ts` — infraestructura: `Logger`,
  `poolLogger` y el listener en el factory de `PG_POOL`.
- `backend-pet-tracker/src/db/drizzle.module.spec.ts` — test unitario: el
  `describe` de `#238` con un it.
- `progress/impl_backend-pg-pool-error-listener.md` — reporte del
  implementador, con la evidencia de M1 y M2 y las cuentas de R1.
- `specs/backend-pg-pool-error-listener/traceability.md` — se rellena al
  cerrar la cadena.

No cambian `scripts/`, `test/`, las migraciones, `package.json` ni
`pnpm-lock.yaml` (R2).

## Alternativas descartadas

- **E2e con `pg_terminate_backend` contra Postgres real.** Probaría `pg` y
  `pg-pool`, no el código del repo, y necesita el Postgres compartido entre
  worktrees, con la misma clase de carrera que #237. El emit a mano es el
  mismo evento (D4).
- **Clase `PgPoolErrorListener` o provider aparte.** Una clase con un método
  para tres líneas. El factory ya es el único punto donde nace el pool.
- **`console.error`.** El backend usa `Logger` de Nest en todos sus
  servicios; `console` no lleva contexto ni pasa por el logger de la app.
- **`logger.warn`.** Un cliente muerto es un error de infraestructura que hay
  que ver en los logs; `warn` lo mezcla con avisos de negocio.
- **Reintentar o recrear el pool en el listener.** `pg-pool` ya descarta el
  cliente y abre otro en la siguiente consulta (D3).
- **Exportar `PG_POOL` para testear desde fuera.** `moduleRef.get` ya lo
  resuelve sin exportarlo (D5).
