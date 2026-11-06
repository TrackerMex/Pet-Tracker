---
feature: "backend-container-image"
status: draft        # draft | approved
tags: [harness, spec, backend, infra, produccion]
---

# Tareas — [[backend-container-image]]

> Disciplina TDD de `CHECKPOINTS.md` C4. Cada requisito de [[requirements]]
> tiene un commit rojo (`test(...)`) seguido de un commit verde (`feat(...)`),
> salvo R15 y R23, que son requisitos de verificación (vía (b): un solo
> commit de test más evidencia de mutación). Las decisiones están en [[design]]; aquí
> solo va el **qué** y el **orden**.

## Reglas de la cadena

### Dónde y con qué

- **Worktree**: `/home/claude/sites/Pet-Tracker-wt-245`, branch
  `feature/245-backend-container-image`. Todo comando empieza con un `cd`
  literal:
  ```
  cd /home/claude/sites/Pet-Tracker-wt-245/backend-pet-tracker
  ```
- **Precondiciones, que prepara el leader antes del handoff**:
  - `node_modules` instalado con `pnpm install --frozen-lockfile`;
  - `.env` del worktree copiado;
  - base de e2e migrada.

  Codex no migra ni instala.
- **Prohibido**:
  - `./init.sh`;
  - `pnpm db:migrate` y `psql` crudo;
  - `git rebase` y `git commit --amend` sobre commits ya hechos;
  - cualquier comando contra AWS, `cdk`, `docker push` y `docker build`;
  - cualquier acceso a la red, salvo **una** excepción: el `curl` que descarga
    el PEM público de RDS en el verde de R17;
  - `pnpm run <script> -- <args>` (el `--` llega a jest; usar `pnpm exec`);
  - tocar ficheros fuera de la lista de [[design]] §Archivos afectados.
- **Sin dependencias nuevas.** Todo lo necesario ya está en `package.json`:
  `@nestjs/common` 11 (`ConsoleLogger` con `json`), `pg`, `drizzle-orm`,
  `dotenv` y `supertest`.

### Comandos

- **Test unitario de un fichero** (la ruta posicional es una regex; ninguna
  de esta feature lleva paréntesis):
  ```
  FORCE_COLOR=0 pnpm exec jest --config package.json <ruta-del-spec> > /tmp/impl-245-<R>-<red|green>.log 2>&1; echo "exit=$?"
  ```
- **e2e**: necesita la base del worktree.
  ```
  FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json <ruta-del-e2e> > /tmp/impl-245-<R>-e2e.log 2>&1; echo "exit=$?"
  ```
- **Tipos**: `pnpm exec tsc --noEmit -p tsconfig.json`. Debe salir 0 en
  **todos** los commits, rojos incluidos.
- **Lint**: `pnpm exec eslint <ficheros .ts tocados>`. Debe salir 0 en todos
  los commits.
- **Formato**: antes de cada `git add`, `pnpm exec prettier --write <ficheros .ts tocados>`.

### Rojo por aserción, nunca por ausencia

Un commit rojo falla **solo** por aserciones de jest.

- `grep -cE "ReferenceError|Cannot find module|error TS|TypeError" /tmp/impl-245-<R>-red.log`
  debe dar `0`.
- Si el test importa un símbolo de producción que todavía no existe, el
  commit rojo trae un **stub de producción** con la firma final y un
  comportamiento incorrecto. Cada bloque dice cuál.
- **Stubs que satisfacen a eslint**:
  - un parámetro sin usar se consume con `void <param>;`;
  - una función que devuelve promesa se escribe sin `async` y con
    `return Promise.resolve(...)`, por la regla `require-await`.

### Mensajes de commit

- Rojo: `test(backend-container-image): <qué fija> (R<n>)`.
- Verde: `feat(backend-container-image): <qué hace> (R<n>)`.
- Cierre: `docs(backend-container-image): fill traceability`.

### Prefijo de R-ids

En los ficheros que ya nombran R-ids de otras features, los `describe` e
`it` nuevos empiezan por `#245 R<n>:`. Son estos:

- `src/db/drizzle.module.spec.ts`
- `src/config/config.module.spec.ts`
- `src/modules/health/infrastructure/health.controller.spec.ts`
- `test/health.e2e-spec.ts`
- las cinco `*-scheduler.service.spec.ts`

En los ficheros nuevos basta `R<n>:`.

### Tras cada commit

- `git status --short -- backend-pet-tracker docs .env.example` no lista
  ningún fichero de esta feature.
- Cada commit verde deja en verde, además de su spec, los specs de los
  requisitos anteriores que comparten fichero.

## R1 — `isProduction` es la única señal de producción

- [ ] (1) **Rojo**.
  - **Stub**: `src/config/environment.ts` exporta
    `isProduction(nodeEnv: string | undefined): boolean`, que devuelve
    siempre `false` y no contiene el literal `production`.
  - **Test**: `src/config/environment.spec.ts`, `describe('R1: isProduction es la única señal de producción')`.
    - `it('R1: devuelve true solo para "production" exacto')`: `true` para
      `'production'`; `false` para `'Production'`, `'prod'`, `' production'`,
      `'test'`, `'development'`, `''` y `undefined`.
    - `it('R1: el literal production entre comillas solo aparece en config/environment.ts')`:
      - recorre los `.ts` no-spec de `src/` con el mismo patrón de
        `src/db/database-url-source.spec.ts`;
      - filtra por la regex `` /['"`]production['"`]/ ``;
      - pasa las rutas a relativas a `src/` con `/`;
      - espera `toEqual(['config/environment.ts'])`.
  - **Commit**: `test(backend-container-image): pin isProduction as the only production signal (R1)`.
- [ ] (2) **Verde**.
  - **Código**: implementar `isProduction` como `nodeEnv === 'production'`.
  - **Docs**: en `docs/conventions.md`, añadir a la tabla de variables de
    entorno una fila `NODE_ENV`, junto a `PORT`.
    - **Para qué**: solo el literal `production` activa el modo producción
      (#245): `PG*` con TLS, logs JSON y validación de arranque. jest lo fija a
      `test`.
    - **Estado**: la imagen lo fija (`ENV NODE_ENV=production`); no va en
      `.env.example`.
  - **Commit**: `feat(backend-container-image): single production signal (R1)`.
- [ ] (3) Refactor: no previsto.

## R2 — `buildPoolConfig` fuera de producción

- [ ] (1) **Rojo**.
  - **Stub**: `src/db/pool-config.ts` exporta:
    - `DEFAULT_DB_POOL_MAX = 10`, con su valor final;
    - `class DatabaseConfigError extends Error`, final, con
      `this.name = 'DatabaseConfigError'`;
    - `buildPoolConfig(config: ConfigService): PoolConfig`, que devuelve solo
      `{ connectionString: config.get<string>('DATABASE_URL') }`. `PoolConfig`
      se importa como tipo desde `pg`.
  - **Test**: `src/db/pool-config.spec.ts`, `describe('R2: buildPoolConfig fuera de producción usa DATABASE_URL y DB_POOL_MAX')`.
    - **Doble**: `{ get: (key: string) => values[key] } as unknown as ConfigService`.
    - **Igualdad**: con `toStrictEqual`, para que una clave `ssl: undefined`
      también falle.
    - **its**:
      - `it('R2: sin DB_POOL_MAX devuelve { connectionString, max: 10 } sin ssl')`:
        también comprueba que `DEFAULT_DB_POOL_MAX` es `10`.
      - `it('R2: DB_POOL_MAX con espacios se recorta')`: `'  7 '` da `max: 7`.
      - `it('R2: DB_POOL_MAX en blanco usa el default')`: `'   '` da `max: 10`.
      - `it.each(['0', '-3', '2.5', 'diez', '07'])('R2: DB_POOL_MAX %p lanza DatabaseConfigError que nombra DB_POOL_MAX')`:
        el error es instancia de `DatabaseConfigError`, su `name` es
        `'DatabaseConfigError'` y su mensaje contiene `DB_POOL_MAX`.
      - `it.each(['test', 'development', undefined])('R2: NODE_ENV %p no activa producción aunque haya PG*')`:
        con `PGHOST` y compañía definidas, el resultado sigue siendo
        `{ connectionString, max: 10 }`.
  - **Commit**: `test(backend-container-image): pin pool config outside production (R2)`.
- [ ] (2) **Verde**.
  - **Código**: la rama de no-producción de `buildPoolConfig`, que lee
    **solo** con `config.get<string>(...)`.
  - **Docs**:
    - en `docs/conventions.md`, una fila `DB_POOL_MAX`: tamaño máximo del pool
      de `pg`; default 10 fuera de producción y obligatoria en producción;
    - en `.env.example` (raíz), bajo `DATABASE_URL`, una línea comentada
      `# DB_POOL_MAX=10` con un comentario de una línea.
  - **Commit**: `feat(backend-container-image): pool config from DATABASE_URL and DB_POOL_MAX (R2)`.
- [ ] (3) Refactor: no previsto.

## R3 — `buildPoolConfig` en producción, con `PG*` y TLS verificado

- [ ] (1) **Rojo**. Sin stub: la rama de producción no existe todavía.
  - **Test**: `src/db/pool-config.spec.ts`, `describe('R3: buildPoolConfig en producción usa PG* con TLS verificado')`.
    - **Config base**: `NODE_ENV: 'production'`, `DATABASE_URL: 'postgresql://ignorada@localhost/x'`,
      `PGHOST: 'db.internal.example'`, `PGPORT: '5432'`, `PGDATABASE: 'pet_tracker'`,
      `PGUSER: 'pet_tracker_app'`, `PGPASSWORD: 'pass-sentinel-245'` y `DB_POOL_MAX: '5'`.
    - **its**:
      - `it('R3: con PG* válidas devuelve la config por campos con ssl verificado e ignora DATABASE_URL')`:
        `toStrictEqual({ host: 'db.internal.example', port: 5432, database: 'pet_tracker', user: 'pet_tracker_app', password: 'pass-sentinel-245', ssl: { rejectUnauthorized: true }, max: 5 })`.
      - `it('R3: sin PG* ni DB_POOL_MAX lanza un único DatabaseConfigError que nombra las seis')`:
        solo `NODE_ENV` y `DATABASE_URL`. El mensaje contiene `PGHOST`,
        `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` y `DB_POOL_MAX`.
      - `it.each(['0', '65536', 'abc', '54.3'])('R3: PGPORT %p se rechaza nombrando PGPORT')`.
      - `it('R3: un PGUSER en blanco cuenta como ausente')`: `'   '`.
      - `it('R3: el mensaje no reproduce ningún valor')`:
        - **Valores**: `PGHOST: 'host-sentinel-245'`, `PGPORT: '99999'`,
          `DB_POOL_MAX: 'max-sentinel-245'` y `PGPASSWORD: 'pass-sentinel-245'`.
        - **Captura**: con `try/catch` en una variable. Primero
          `toBeInstanceOf(DatabaseConfigError)`; luego, que el mensaje no
          contiene ninguno de los cuatro centinelas.
  - **Commit**: `test(backend-container-image): pin production pool config with PG* and TLS (R3)`.
- [ ] (2) **Verde**.
  - **Código**: la rama `isProduction(config.get<string>('NODE_ENV'))`.
    Acumula todos los problemas y lanza una vez.
  - **Docs**:
    - en `docs/conventions.md`, filas `PGHOST`, `PGPORT`, `PGDATABASE`,
      `PGUSER` y `PGPASSWORD`. Solo producción; `PGPASSWORD` llega desde
      Secrets Manager y nunca se commitea;
    - en `.env.example`, las cinco como líneas comentadas vacías
      (`# PGHOST=`) bajo un comentario «solo producción (#245)».
  - **Commit**: `feat(backend-container-image): production pool config from PG* with verified TLS (R3)`.
- [ ] (3) Refactor: no previsto.

## R4 — `PG_POOL` usa `buildPoolConfig`

- [ ] (1) **Rojo**. Sin stub.
  - **Test**: `src/db/drizzle.module.spec.ts`, `describe('#245 R4: PG_POOL se construye con buildPoolConfig')`.
    - **Doble de `ConfigService`**: devuelve `DATABASE_URL` (la misma URL
      de los describes existentes) y `DB_POOL_MAX: '7'`; el resto, `undefined`.
    - `it('#245 R4: con DB_POOL_MAX=7 el pool tiene options.max 7')`:
      `moduleRef.get<Pool>(PG_POOL, { strict: false }).options.max` es `7`.
  - **Commit**: `test(backend-container-image): pin PG_POOL built from buildPoolConfig (R4)`.
- [ ] (2) **Verde**: la factory de `PG_POOL` hace `new Pool(buildPoolConfig(config))`.
  El listener de `error` (#238) no cambia.
  - **Commit**: `feat(backend-container-image): build PG_POOL from buildPoolConfig (R4)`.
- [ ] (3) Refactor: no previsto.

## R5 — el pool se cierra en `onApplicationShutdown`

- [ ] (1) **Rojo**. Sin stub.
  - **Test**: `src/db/drizzle.module.spec.ts`, `describe('#245 R5: PG_POOL se cierra después de beforeApplicationShutdown')`.
    - **Módulo de test**:
      - importa `DrizzleModule`, con el mismo doble de `ConfigService`;
      - provee una clase sonda del propio spec cuyo `beforeApplicationShutdown()`
        guarda en una variable del fichero cuántas veces se había llamado ya a
        `end`.
    - **Espía**: tras `compile()`, se espía `end` del pool obtenido con
      `get(PG_POOL, { strict: false })`, resolviendo sin cerrar nada.
    - `it('#245 R5: end no se ha llamado en beforeApplicationShutdown y se llama una vez al cerrar')`:
      tras `await moduleRef.close()`, la variable vale `0` y el espía tiene 1
      llamada.
  - **Commit**: `test(backend-container-image): pin pool close after beforeApplicationShutdown (R5)`.
- [ ] (2) **Verde**: `DrizzlePoolLifecycle` implementa `OnApplicationShutdown`
  y llama a `pool.end()` en `onApplicationShutdown()`. Se quita `OnModuleDestroy`.
  - **Commit**: `feat(backend-container-image): close pg pool on application shutdown (R5)`.
- [ ] (3) Refactor: no previsto.

## R6 — `InFlightTicks` y `LifecycleModule`

- [ ] (1) **Rojo**.
  - **Stubs**:
    - `src/lifecycle/in-flight-ticks.ts` exporta:
      - `SHUTDOWN_DRAIN_TIMEOUT_MS = 20_000`, con su valor final;
      - `@Injectable() class InFlightTicks implements BeforeApplicationShutdown`,
        donde `run(task: () => unknown): void` no invoca la tarea,
        `drain(timeoutMs: number): Promise<'drained' | 'timeout'>` devuelve
        `Promise.resolve('timeout')` y `beforeApplicationShutdown()` devuelve
        `Promise.resolve()`.
    - `src/lifecycle/lifecycle.module.ts` exporta `@Module({}) class LifecycleModule`,
      sin `@Global` ni providers.
  - **Test 1**: `src/lifecycle/in-flight-ticks.spec.ts`, `describe('R6: InFlightTicks sigue los ticks y los drena al apagar')`.
    - **Preparación**:
      - timers falsos de jest;
      - un helper `deferred()` del propio spec;
      - espías `jest.spyOn(Logger.prototype, 'error' | 'warn')` silenciados.
    - **Avance del reloj**: con `await jest.advanceTimersByTimeAsync(ms)`,
      que también vacía las microtareas.
    - **its**:
      - `it('R6: run invoca la tarea antes de retornar')`.
      - `it('R6: drain sin tareas resuelve drained y no deja timers')`:
        `jest.getTimerCount()` es `0`.
      - `it('R6: drain espera a la tarea pendiente y resuelve drained al terminar')`:
        - con `drain(1_000)`, a los 999 ms sigue sin resolverse;
        - tras resolver la tarea, resuelve `'drained'`;
        - `jest.getTimerCount()` es `0`.
      - `it('R6: drain resuelve timeout al cumplirse el plazo con una tarea pendiente')`:
        sin resolver a los 999 ms y `'timeout'` a los 1_000 ms.
      - `it('R6: un rechazo de la tarea se registra con Logger.error y no se propaga')`:
        - la tarea rechaza con `new Error('tick-boom-245')`;
        - `drain(1_000)` resuelve, no rechaza, `'drained'`;
        - el espía de `error` recibió un primer argumento que contiene
          `tick-boom-245`.
      - `it('R6: tras beforeApplicationShutdown, run no invoca la tarea')`:
        - una tarea antes del apagado **sí** se invoca (1 llamada);
        - `void ticks.beforeApplicationShutdown()`, sin `await`;
        - una segunda tarea no se invoca.
      - `it('R6: beforeApplicationShutdown espera SHUTDOWN_DRAIN_TIMEOUT_MS y avisa de las pendientes')`:
        - `SHUTDOWN_DRAIN_TIMEOUT_MS` es `20_000`;
        - con dos tareas que nunca resuelven, la promesa sigue pendiente a
          los 19_999 ms y resuelve a los 20_000;
        - `Logger.warn` recibió un mensaje que casa con `/\b2\b/`.
  - **Test 2**: `src/lifecycle/lifecycle.module.spec.ts`, `describe('R6: LifecycleModule es global y AppModule lo importa')`.
    - `it('R6: LifecycleModule es @Global y provee y exporta InFlightTicks')`:
      metadatos `GLOBAL_MODULE_METADATA` (de `@nestjs/common/constants`),
      `'providers'` y `'exports'`.
    - `it('R6: AppModule importa LifecycleModule')`:
      `Reflect.getMetadata('imports', AppModule)` contiene `LifecycleModule`.
  - **Commit**: `test(backend-container-image): pin in-flight tick draining on shutdown (R6)`.
- [ ] (2) **Verde**.
  - **`InFlightTicks`**:
    - `run` envuelve la tarea en una promesa seguida en un `Set`; el rechazo
      se captura con `Logger.error` (logger `new Logger(InFlightTicks.name)`),
      y la promesa se borra del `Set` al asentarse;
    - `drain` combina `Promise.allSettled` con un `setTimeout` que se limpia
      siempre;
    - `beforeApplicationShutdown` pone la bandera de cierre **de forma
      síncrona** antes del primer `await`.
  - **`LifecycleModule`**: `@Global() @Module({ providers: [InFlightTicks], exports: [InFlightTicks] })`.
  - **`src/app.module.ts`**: importa `LifecycleModule`.
  - **Commit**: `feat(backend-container-image): drain in-flight worker ticks on shutdown (R6)`.
- [ ] (3) Refactor: no previsto.

## R7 — los seis intervalos corren vía `InFlightTicks.run`

- [ ] (1) **Rojo**.
  - **Stubs**: los cinco schedulers reciben `private readonly ticks: InFlightTicks`
    como **último** parámetro del constructor, todavía sin usar. La única
    construcción existente de cada spec (la factory `service(...)` o su
    equivalente) pasa `new InFlightTicks()`. Hay exactamente una por spec:
    ```
    grep -rn "new [A-Za-z]*SchedulerService(" src test | wc -l
    ```
    da `5` antes del rojo; los describes nuevos de R7 añaden las suyas.
  - **Tests**: en cada spec, un `describe('#245 R7: <intervalo> corre su tick vía InFlightTicks')`.
    - **Preparación**:
      - config con su flag a `'true'` y `NODE_ENV: 'development'`;
      - timers falsos;
      - una instancia `ticks = new InFlightTicks()` propia del describe;
      - el mock de la dependencia devuelve la promesa de un `deferred()`.
    - **Dos its por intervalo**:
      - `it('#245 R7: <intervalo>: drain no se resuelve mientras el tick está pendiente')`:
        - `onApplicationBootstrap()`, luego `advanceTimersByTime(<INTERVAL_MS>)`;
        - la dependencia tiene 1 llamada;
        - `ticks.drain(1_000)` sigue pendiente tras vaciar microtareas;
        - tras resolver el `deferred`, se resuelve.
      - `it('#245 R7: <intervalo>: tras beforeApplicationShutdown el intervalo no invoca <dependencia>')`:
        `onApplicationBootstrap()`, luego `void ticks.beforeApplicationShutdown()`,
        luego `advanceTimersByTime(<INTERVAL_MS>)`; la dependencia tiene 0
        llamadas.

    **Intervalos y dependencias**:

    | Spec | Intervalo | Constante | Dependencia |
    |---|---|---|---|
    | `src/workers/ingestion-scheduler.service.spec.ts` | `ingestion-poller` | `POLLER_INTERVAL_MS` | `poller.runOnce` |
    | ídem | `ingestion-consumer` | `CONSUMER_INTERVAL_MS` | `consumer.drainOnce` |
    | `src/workers/alerts-engine/alerts-engine-scheduler.service.spec.ts` | `alerts-engine-consumer` | `ALERTS_ENGINE_INTERVAL_MS` | `consumer.drainOnce` |
    | `src/workers/notifier/notifier-scheduler.service.spec.ts` | `notifier-consumer` | `NOTIFIER_INTERVAL_MS` | `consumer.drainOnce` |
    | `src/modules/reminders/infrastructure/reminders-scheduler.service.spec.ts` | `reminders-dispatch` | `REMINDERS_INTERVAL_MS` | `dispatcher.dispatchOnce` |
    | `src/modules/activity/infrastructure/activity-scheduler.service.spec.ts` | `ACTIVITY_TICK_NAME` | `ACTIVITY_TICK_INTERVAL_MS` | `aggregator.runOnce` |

    En ingesta, al avanzar `POLLER_INTERVAL_MS` el consumer dispara 4 veces.
    Su mock devuelve una promesa ya resuelta en los its del poller, y
    viceversa.
  - **Commit**: `test(backend-container-image): pin scheduler ticks through InFlightTicks (R7)`.
- [ ] (2) **Verde**: cada callback de `setInterval` pasa de
  `() => void this.x.y()` a `() => this.ticks.run(() => this.x.y())`,
  conservando los argumentos (`runOnce(new Date())` en actividad).
  - **Commit**: `feat(backend-container-image): run scheduler ticks through InFlightTicks (R7)`.
- [ ] (3) Refactor: no previsto.

## R8 — `GET /v1/health/live`

- [ ] (1) **Rojo**.
  - **Stub**: `HealthController.live()` sin decoradores, que devuelve
    `{ status: '' }`.
  - **Test unitario**: `src/modules/health/infrastructure/health.controller.spec.ts`,
    `describe('#245 R8: GET /v1/health/live es público y no consulta Postgres')`.
    - `it('#245 R8: live trae @Public() y la ruta live')`: `IS_PUBLIC_KEY` es
      `true` y `PATH_METADATA` (de `@nestjs/common/constants`) es `'live'`,
      leídos con el patrón `Object.getOwnPropertyDescriptor` del `it`
      existente.
    - `it('#245 R8: live devuelve { status: "ok" } sin llamar al use case')`:
      el doble de `CheckHealthUseCase` con `execute: jest.fn()` tiene 0
      llamadas.
  - **Test e2e**: `test/health.e2e-spec.ts`, dentro de
    `describe('R8: GET /v1/health responde 503 con Postgres caído')`.
    - `it('#245 R8: GET /v1/health/live responde 200 { status: "ok" } y /v1/health 503')`.
  - **Commit**: `test(backend-container-image): pin liveness endpoint without DB (R8)`.
- [ ] (2) **Verde**: `@Public() @Get('live') live() { return { status: 'ok' }; }`.
  - **Commit**: `feat(backend-container-image): add GET /v1/health/live (R8)`.
- [ ] (3) Refactor: no previsto.

## R9 — `configureApp`

- [ ] (1) **Rojo**.
  - **Stub**: `src/app-setup.ts` exporta
    `configureApp(app: NestExpressApplication): void` vacío (`void app;`).
  - **Test**: `src/app-setup.spec.ts`, `describe('R9: configureApp fija prefijo v1, trust proxy de un salto y shutdown hooks')`.
    - **Controlador sonda** del spec: `@Controller('probe')`, con un `@Get()`
      que devuelve `{ ip: req.ip }` (`@Req()`).
    - **App**: `moduleRef.createNestApplication<NestExpressApplication>()`;
      `configureApp(app)` antes de `app.init()`, y `app.close()` en cada `it`
      o `afterEach`.
    - **its**:
      - `it('R9: responde en /v1/probe y da 404 en /probe')`.
      - `it('R9: con X-Forwarded-For de una entrada, req.ip es esa entrada')`:
        `203.0.113.7`.
      - `it('R9: con dos entradas, req.ip es la de la derecha')`:
        `198.51.100.1, 203.0.113.7` da `203.0.113.7`.
      - `it('R9: añade un listener de SIGTERM y app.close lo quita')`:
        - se mide `process.listenerCount('SIGTERM')` antes de `configureApp`;
        - después vale `+1`;
        - tras `app.close()` vuelve a la medida inicial.
  - **Commit**: `test(backend-container-image): pin app setup prefix, trust proxy and shutdown hooks (R9)`.
- [ ] (2) **Verde**: `configureApp` llama a `app.setGlobalPrefix('v1')`,
  `app.enableShutdownHooks()` y `app.set('trust proxy', 1)`.
  - **Commit**: `feat(backend-container-image): configureApp with v1 prefix, trust proxy and shutdown hooks (R9)`.
- [ ] (3) Refactor: no previsto.

## R10 — `createAppLogger`

- [ ] (1) **Rojo**.
  - **Stub**: `src/app-setup.ts` exporta además
    `createAppLogger(nodeEnv: string | undefined): ConsoleLogger`, que
    devuelve `new ConsoleLogger()` (`void nodeEnv;`).
  - **Test**: `src/app-setup.spec.ts`, `describe('R10: createAppLogger escribe JSON de una línea en producción')`.
    `jest.spyOn(process.stdout, 'write')` con implementación silenciosa.
    - `it('R10: en producción log escribe exactamente una línea JSON con level, message y context, sin ANSI')`:
      - `createAppLogger('production').log('hola-245', 'Ctx245')`;
      - 1 llamada a `write`, terminada en `\n`, sin `\u001b[`;
      - `expect(() => JSON.parse(line)).not.toThrow()` antes de parsear, para
        que el rojo sea por aserción y no por un `SyntaxError` suelto;
      - `JSON.parse` de la línea `toMatchObject({ level: 'log', message: 'hola-245', context: 'Ctx245' })`.
    - `it.each(['test', undefined])('R10: con NODE_ENV %p la salida no es JSON')`:
      `JSON.parse` del texto escrito lanza. Es un **ancla negativa**: nace
      verde y se prueba por mutación (§Cierre).
  - **Commit**: `test(backend-container-image): pin JSON logger in production (R10)`.
- [ ] (2) **Verde**: `return new ConsoleLogger({ json: isProduction(nodeEnv) });`.
  - **Commit**: `feat(backend-container-image): JSON logs in production (R10)`.
- [ ] (3) Refactor: no previsto.

## R11 — `main.ts` usa `createAppLogger` y `configureApp`

- [ ] (1) **Rojo**. Sin stub.
  - **Test**: `src/main.spec.ts`, `describe('R11: main.ts arranca con createAppLogger y configureApp')`.
    Lee `join(__dirname, 'main.ts')` como texto.
    - `it('R11: crea la app con logger createAppLogger(process.env.NODE_ENV)')`:
      contiene `logger: createAppLogger(process.env.NODE_ENV)`.
    - `it('R11: llama a configureApp(app) antes de app.listen y no llama a setGlobalPrefix')`.
  - **Commit**: `test(backend-container-image): pin main bootstrap wiring (R11)`.
- [ ] (2) **Verde**: `main.ts` crea la app con
  `NestFactory.create<NestExpressApplication>(AppModule, { logger: createAppLogger(process.env.NODE_ENV) })`,
  llama a `configureApp(app)` y luego a `app.listen(process.env.PORT ?? 3000)`.
  Leer `process.env.NODE_ENV` en `main.ts` es la misma excepción documentada
  que `PORT`.
  - **Commit**: `feat(backend-container-image): wire logger and app setup in main (R11)`.
- [ ] (3) Refactor: no previsto.

## R12 — `validateEnv`

- [ ] (1) **Rojo**.
  - **Stub**: `src/config/env.validation.ts` exporta:
    - `class EnvValidationError extends Error`, final, con
      `name = 'EnvValidationError'`;
    - `validateEnv(config: Record<string, unknown>): Record<string, unknown>`,
      que devuelve `config` sin validar.
  - **Test**: `src/config/env.validation.spec.ts`, `describe('R12: validateEnv aborta en producción ante configuración incompleta')`.
    - **Config base válida**: `{ NODE_ENV: 'production', SIM_MODE: 'true', JWT_SECRET: 'jwt-sentinel-245' }`.
    - **its**:
      - `it.each(['test', 'development', undefined])('R12: con NODE_ENV %p devuelve el mismo objeto sin validar')`:
        objeto sin `SIM_MODE` ni `JWT_SECRET`, comprobado con `toBe`. Es un
        **ancla negativa** (§Cierre).
      - `it('R12: en producción con configuración válida devuelve el mismo objeto')`:
        con `toBe`, sobre cuatro variantes de la base:
        - `SIM_MODE: 'false'` con `WIALON_TOKEN: 'wialon-tok'`;
        - `EMAIL_ENABLED: 'true'` con las tres variables de Resend;
        - `ANTHROPIC_ENABLED: 'true'` con clave y modelo;
        - `PUSH_ENABLED` y `POLLER_ENABLED` a `'true'`, sin claves.

        También es un **ancla negativa** (§Cierre).
      - `it.each` de casos que lanzan `EnvValidationError` (con su `name`) y
        cuyo mensaje contiene cada variable esperada:

        | Caso | Cambio sobre la base | Variables en el mensaje |
        |---|---|---|
        | `SIM_MODE` ausente | se borra | `SIM_MODE` |
        | `SIM_MODE` ambiguo | `'yes'` | `SIM_MODE` |
        | Wialon sin token | `SIM_MODE: 'false'` | `WIALON_TOKEN` |
        | Wialon `PENDING` | `SIM_MODE: 'false'`, `WIALON_TOKEN: 'PENDING'` | `WIALON_TOKEN` |
        | Email sin claves | `EMAIL_ENABLED: 'true'` | `RESEND_API_KEY`, `RESEND_FROM`, `RESET_LINK_HOST` |
        | IA incompleta | `ANTHROPIC_ENABLED: 'true'`, `ANTHROPIC_API_KEY: 'PENDING'`, `ANTHROPIC_MODEL: '  '` | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` |
        | JWT en blanco | `JWT_SECRET: '   '` | `JWT_SECRET` |

      - `it('R12: varias violaciones salen en un único error que las nombra todas y no reproduce valores')`:
        - **Valores**:
          - `SIM_MODE: 'sim-sentinel-245'`;
          - `EMAIL_ENABLED: 'true'`, `RESEND_API_KEY: 'resend-sentinel-245'`
            y `RESEND_FROM: ''`, sin `RESET_LINK_HOST`;
          - `ANTHROPIC_ENABLED: 'true'`, `ANTHROPIC_API_KEY: 'anthropic-sentinel-245'`
            y `ANTHROPIC_MODEL: ''`;
          - `JWT_SECRET: ''`.
        - **Captura**: con `try/catch`, como en R3; primero
          `toBeInstanceOf(EnvValidationError)`.
        - **Espera**: el mensaje nombra `SIM_MODE`, `RESEND_FROM`,
          `RESET_LINK_HOST`, `ANTHROPIC_MODEL` y `JWT_SECRET`, y no contiene
          ningún `*-sentinel-245`.
  - **Commit**: `test(backend-container-image): pin production env validation (R12)`.
- [ ] (2) **Verde**: implementar las reglas de [[requirements]] R12 con
  `isProduction(config.NODE_ENV as string | undefined)`. «En blanco» es
  ausente o con `trim()` vacío.
  - **Commit**: `feat(backend-container-image): validate env at startup in production (R12)`.
- [ ] (3) Refactor: no previsto.

## R13 — `AppConfigModule` enchufa `validateEnv`

- [ ] (1) **Rojo**. Sin stub.
  - **Test**: `src/config/config.module.spec.ts`, `describe('#245 R13: AppConfigModule valida el entorno con validateEnv')`.
    - **Entorno**:
      - `beforeEach` guarda `NODE_ENV` y `SIM_MODE` de `process.env`;
      - `afterEach` las restaura, o las borra si no existían.
    - `it('#245 R13: con NODE_ENV=production y sin SIM_MODE la compilación se rechaza nombrando SIM_MODE')`:
      - `process.env.NODE_ENV = 'production'` y `delete process.env.SIM_MODE`;
      - `await expect(Test.createTestingModule({ imports: [AppConfigModule.forRoot([])] }).compile()).rejects.toThrow(/SIM_MODE/)`;
      - y la misma promesa `rejects.toBeInstanceOf(EnvValidationError)`.
  - **Commit**: `test(backend-container-image): pin env validation wired into AppConfigModule (R13)`.
- [ ] (2) **Verde**: `ConfigModule.forRoot({ isGlobal: true, envFilePath, validate: validateEnv })`.
  - **Commit**: `feat(backend-container-image): wire validateEnv into AppConfigModule (R13)`.
- [ ] (3) Refactor: no previsto.

## R14 — `src/db/migrate.ts`

- [ ] (1) **Rojo**.
  - **Stub**: `src/db/migrate.ts` exporta:
    - `MIGRATIONS_FOLDER = ''`;
    - `runMigrations(config: ConfigService): Promise<void>` y
      `runMigrationsCli(config: ConfigService): Promise<void>`, que no hacen
      nada (`return Promise.resolve();`).

    Sin bloque `require.main`.
  - **Test**: `src/db/migrate.spec.ts`, `describe('R14: migrate.ts aplica las migraciones con el migrator de runtime')`.
    - **Dobles** (no hay conexión real):
      - `Pool` de `pg`, con `end` espía;
      - `drizzle` de `drizzle-orm/node-postgres`, que devuelve un objeto
        centinela;
      - `migrate` de `drizzle-orm/node-postgres/migrator`.
    - **Config de producción**: el doble de `ConfigService` usa la config base
      de R3 (`PGPASSWORD: 'pass-sentinel-245'`).
    - **Espías** silenciosos en `process.stdout.write` y `process.stderr.write`.
    - **Helper `jsonLines(spy)`** del propio spec: parte cada escritura por
      `\n` y devuelve solo las líneas que `JSON.parse` acepta (con
      `try/catch`, descartando el resto). Así «alguna línea parsea a JSON» es
      una aserción sobre la longitud y nunca un `SyntaxError`.
    - **`afterEach`** restaura `process.exitCode` al valor previo. **Si no, jest
      sale con 1.**
    - **its**:
      - `it('R14: MIGRATIONS_FOLDER es <dir>/migrations y contiene meta/_journal.json')`:
        `toBe(join(__dirname, 'migrations'))` y `existsSync(join(MIGRATIONS_FOLDER, 'meta', '_journal.json'))`.
      - `it('R14: runMigrations construye el Pool con buildPoolConfig, migra una vez y cierra el pool')`:
        - `Pool` se construye una vez, con el objeto de R3
          (`toStrictEqual`);
        - `drizzle` recibe esa instancia;
        - `migrate` se llama una vez con `(centinela, { migrationsFolder: MIGRATIONS_FOLDER })`;
        - `end` se llama 1 vez.
      - `it('R14: si migrate rechaza, runMigrations rechaza con el mismo error y cierra el pool')`:
        `rejects.toBe(error)` y `end` con 1 llamada.
      - `it('R14: runMigrationsCli en éxito registra en JSON y no toca exitCode')`:
        - alguna línea de stdout parsea a JSON con `level: 'log'`;
        - `process.exitCode` no cambia;
        - ninguna escritura contiene `pass-sentinel-245`.
      - `it('R14: runMigrationsCli en fallo deja exitCode 1, registra el error y no filtra PGPASSWORD')`:
        - `migrate` rechaza con `new Error('boom-245')`;
        - `process.exitCode` es `1`;
        - alguna línea de stderr parsea a JSON con `level: 'error'` y contiene
          `boom-245`;
        - `end` tiene 1 llamada;
        - ninguna escritura en stdout ni stderr contiene `pass-sentinel-245`.
      - `it('R14: solo corre como CLI bajo require.main === module y no carga dotenv')`:
        - el texto de `join(__dirname, 'migrate.ts')` contiene
          `if (require.main === module)` y `runMigrationsCli(new ConfigService())`;
        - no contiene `dotenv` ni `envFilePath`.
  - **Commit**: `test(backend-container-image): pin runtime migration script (R14)`.
- [ ] (2) **Verde**.
  - **`runMigrations`**: `new Pool(buildPoolConfig(config))`, luego
    `migrate(drizzle(pool), { migrationsFolder: MIGRATIONS_FOLDER })` y
    `pool.end()` en un `finally`.
  - **`runMigrationsCli`**:
    - logger `createAppLogger(config.get<string>('NODE_ENV'))` con contexto
      `'Migrate'`;
    - `log` de éxito;
    - en `catch`, `error(<mensaje del error>)` y `process.exitCode = 1`;
    - nunca loguea la config.
  - **Bloque final**: `if (require.main === module) { void runMigrationsCli(new ConfigService()); }`.
  - **Commit**: `feat(backend-container-image): runtime migration script with drizzle migrator (R14)`.
- [ ] (3) Refactor: no previsto.

## R15 — verificación del migrator contra la base de e2e (vía (b))

- [ ] (1) **Test**, un solo commit tras el verde de R14.
  - **Fichero**: `test/migrate.e2e-spec.ts`, con `loadDotenv({ path: '../.env' })`
    al inicio, igual que los demás e2e que usan `dotenv`.
  - `describe('R15: el migrator de runtime reconoce la base migrada por drizzle-kit')`.
  - `it('R15: runMigrations sobre la base ya migrada resuelve y no añade filas a drizzle.__drizzle_migrations')`:
    - un `Pool` propio del test, con `connectionString: process.env.DATABASE_URL`,
      cuenta `SELECT count(*)::int AS n FROM drizzle.__drizzle_migrations`;
    - `n > 0` antes;
    - `await runMigrations(new ConfigService())`;
    - después, el mismo `n`;
    - el pool del test se cierra en `afterAll`.
  - **Comando**: `FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/migrate.e2e-spec.ts`
    da `exit=0`.
  - **Commit**: `test(backend-container-image): verify runtime migrator against migrated DB (R15)`.
- [ ] (2) **Mutación**, sin commit:
  - cambiar `MIGRATIONS_FOLDER` a `join(__dirname, 'migrations-inexistente')`;
  - correr el e2e: debe salir en rojo;
  - `git checkout HEAD -- src/db/migrate.ts`;
  - correr otra vez: verde.

  La evidencia va en el informe (§Cierre).
- [ ] (3) Refactor: no aplica.

## R16 — `Dockerfile` multi-etapa

- [ ] (1) **Rojo**. Sin stub: el lector devuelve `''` si el fichero no existe.
  - **Test**: `src/container-image.spec.ts`.
  - **Helpers del propio spec**:
    - `readOrEmpty(path)`;
    - `parseDockerfile(raw)`, que:
      - guarda la primera línea cruda;
      - une las continuaciones `\` + salto con un espacio;
      - descarta las líneas cuyo `trim()` empieza por `#` y las vacías;
      - colapsa los espacios repetidos;
      - parte en etapas por las líneas que empiezan por `FROM `.
    - `stage(name)`: las líneas de la etapa `AS <name>`, o `[]` si no existe.
      **Nunca** lanza.
  - **Rutas**: `join(__dirname, '..', 'Dockerfile')`,
    `join(__dirname, '..', '.dockerignore')` y `join(__dirname, '..', 'package.json')`.
  - **Comparación**: exacta, por línea lógica.
  - **Regla anti-vacío**: cada `it` que afirma algo universal («ninguna»,
    «cada») afirma primero algo positivo de la misma etapa o del total de
    etapas, para no nacer verde con el fichero ausente.
  - `describe('R16: Dockerfile multi-etapa sin herramientas de build ni root')`:
    - `it('R16: la primera línea es # syntax=docker/dockerfile:1')`.
    - `it('R16: tres etapas deps, build y runtime sobre node:24-bookworm-slim, sin --platform')`:
      las líneas `FROM` son exactamente, en orden,
      `FROM node:24-bookworm-slim AS deps`, `FROM node:24-bookworm-slim AS build`
      y `FROM node:24-bookworm-slim AS runtime`.
    - `it('R16: cada etapa fija WORKDIR /app antes de su primer COPY')`:
      primero, que hay 3 etapas.
    - `it('R16: deps instala solo dependencias de producción con el lockfile congelado')`,
      en este orden:
      1. `RUN npm install -g pnpm@10`
      2. `COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./`
      3. `RUN pnpm install --prod --frozen-lockfile`
    - `it('R16: build instala todo, copia el contexto y compila')`, en este
      orden:
      1. `RUN npm install -g pnpm@10`
      2. `COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./`
      3. `RUN pnpm install --frozen-lockfile`
      4. `COPY . .`
      5. `RUN pnpm build`
    - `it('R16: runtime no tiene RUN y solo copia desde otras etapas')`:
      - contiene `COPY --from=deps /app/node_modules ./node_modules` y
        `COPY --from=build /app/dist ./dist`;
      - ninguna línea empieza por `RUN `;
      - toda línea `COPY ` empieza por `COPY --from=`;
      - toda línea `COPY` que nombra `node_modules` es la de `deps`.
    - `it('R16: runtime fija NODE_ENV, expone 3000, corre como node y arranca dist/src/main.js')`:
      - `ENV NODE_ENV=production` y `EXPOSE 3000`;
      - las líneas `USER` de `runtime` son exactamente `['USER node']`;
      - su índice es mayor que el del último `COPY`/`ADD`;
      - la última línea es `CMD ["node", "dist/src/main.js"]`.
    - `it('R16: hay tres etapas y ninguna línea es ENTRYPOINT')`.
  - **Commit**: `test(backend-container-image): pin multi-stage Dockerfile (R16)`.
- [ ] (2) **Verde**: crear `Dockerfile` con **solo** las líneas de R16 (ver
  [[design]] DT9). Ni el PEM (R17) ni la copia de migraciones (R18): si
  entran ahora, R17 y R18 nacen verdes.
  - **Commit**: `feat(backend-container-image): multi-stage Dockerfile on node 24 slim (R16)`.
- [ ] (3) Refactor: no previsto.

## R17 — CA de RDS en la imagen

- [ ] (1) **Rojo**: en `src/container-image.spec.ts`,
  `describe('R17: la etapa runtime trae el bundle de CA de RDS versionado')`.
  Sin stub: `readOrEmpty` devuelve `''` si el PEM todavía no existe.
  - **Ruta del PEM**: `join(__dirname, '..', 'certs', 'rds-global-bundle.pem')`.
  - **Helper del propio spec** `pemBlocks(raw)`:
    `raw.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g) ?? []`.
  - `it('R17: certs/rds-global-bundle.pem es un bundle X.509 que cubre us-east-2 y mx-central-1')`:
    - `pemBlocks(raw).length` es mayor que `0`;
    - para cada bloque, `expect(() => new X509Certificate(block)).not.toThrow()`,
      con `X509Certificate` de `node:crypto`;
    - de los `subject` de esos certificados, alguno contiene `us-east-2` y
      alguno contiene `mx-central-1`.
  - `it('R17: runtime copia el PEM con 0444 y NODE_EXTRA_CA_CERTS apunta a su destino, ambos antes de USER')`:
    - `runtime` contiene exactamente estas dos líneas:
      - `COPY --from=build --chmod=0444 /app/certs/rds-global-bundle.pem /etc/ssl/certs/rds-global-bundle.pem`
      - `ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/rds-global-bundle.pem`
    - las dos tienen índice menor que `USER node`;
    - calculado sobre las líneas encontradas, no sobre los literales: el valor
      tras `NODE_EXTRA_CA_CERTS=` es igual al último token de la línea `COPY`
      que nombra `rds-global-bundle.pem`.
  - `it('R17: ninguna instrucción ADD descarga de una URL')`:
    - primero, `runtime` contiene la línea `COPY --from=build --chmod=0444 …`
      de arriba (anti-vacío);
    - después, ninguna línea lógica de ninguna etapa casa con
      `/^ADD\s.*https?:\/\//`. Es un **ancla negativa** (§Cierre).
  - **Commit**: `test(backend-container-image): pin versioned RDS CA bundle in runtime image (R17)`.
- [ ] (2) **Verde**:
  1. Descargar el bundle **una vez** desde la URL oficial que da la guía de
     AWS (<https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/UsingWithRDS.SSL.html>):
     ```
     cd /home/claude/sites/Pet-Tracker-wt-245/backend-pet-tracker
     mkdir -p certs && curl -fsSL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -o certs/rds-global-bundle.pem; echo "curl exit=$?"
     ```
     - Es la única descarga permitida en toda la cadena.
     - Si `curl` falla (por ejemplo, el sandbox no tiene red), **para** y
       anótalo en el informe. El leader descarga el fichero con el mismo
       comando y Codex sigue desde aquí.
     - No lo sustituyas por otro fichero ni lo escribas a mano.
  2. Añadir las dos líneas a `runtime`, antes de `USER node`.
  3. Correr el spec. Si el `it` del bundle queda en rojo porque falta
     `us-east-2` o `mx-central-1`, **para** y anótalo en el informe, con la
     lista de `subject` que contienen `Amazon RDS`. No cambies el test ni el
     fichero: sin esa CA, TLS contra Aurora falla en producción.
  4. `git add certs/rds-global-bundle.pem Dockerfile`.
  - **Commit**: `feat(backend-container-image): trust versioned RDS CA bundle in runtime image (R17)`.
- [ ] (3) Refactor: no previsto.

## R18 — migraciones en la imagen

- [ ] (1) **Rojo**: `describe('R18: las migraciones viajan junto a migrate.js')`.
  - `it('R18: runtime copia src/db/migrations a dist/src/db/migrations, que es MIGRATIONS_FOLDER compilado')`:
    - `runtime` contiene `COPY --from=build /app/src/db/migrations ./dist/src/db/migrations`;
    - en el mismo `it`, `relative(__dirname, MIGRATIONS_FOLDER)` es
      `join('db', 'migrations')`. `MIGRATIONS_FOLDER` se importa de
      `./db/migrate`; el bloque `require.main` no corre.
  - **Commit**: `test(backend-container-image): pin migrations shipped next to migrate.js (R18)`.
- [ ] (2) **Verde**: añadir la línea `COPY` a `runtime`, antes de `USER node`.
  - **Commit**: `feat(backend-container-image): ship SQL migrations in runtime image (R18)`.
- [ ] (3) Refactor: no previsto.

## R19 — sin `.env` en la imagen

- [ ] (1) **Rojo**: `describe('R19: ningún .env entra en la imagen')`.
  - `it('R19: .dockerignore excluye .env, node_modules, dist y coverage, y el Dockerfile no nombra .env')`:
    - las líneas no comentadas de `.dockerignore` contienen `**/.env`,
      `**/.env.*`, `node_modules`, `dist` y `coverage`;
    - ninguna línea lógica del `Dockerfile` contiene `.env`. Es un **ancla
      negativa** (§Cierre).
  - `it('R19: .dockerignore no excluye el PEM de R17')`:
    - primero, las líneas no comentadas de `.dockerignore` contienen `**/.env`
      (anti-vacío);
    - después, ninguna línea no comentada contiene `certs` ni `pem`. Es un
      **ancla negativa** (§Cierre).
  - **Commit**: `test(backend-container-image): pin no .env in image context (R19)`.
- [ ] (2) **Verde**: crear `.dockerignore` con esas cinco líneas y, además,
  `.git` y `*.log`. Nada más.
  - **Commit**: `feat(backend-container-image): dockerignore keeps env files out (R19)`.
- [ ] (3) Refactor: no previsto.

## R20 — `start:prod`

- [ ] (1) **Rojo**: `describe('R20: start:prod arranca el main compilado')`.
  - `it('R20: scripts.start:prod es node dist/src/main.js')`: lee `package.json`
    con `JSON.parse(readFileSync(...))`.
  - **Commit**: `test(backend-container-image): pin start:prod path (R20)`.
- [ ] (2) **Verde**: cambiar el script en `package.json`.
  - **Commit**: `feat(backend-container-image): fix start:prod entry path (R20)`.
- [ ] (3) Refactor: no previsto.

## R21 — los scripts de operación no cargan `.env` desde código

- [ ] (1) **Rojo**: en `src/container-image.spec.ts`,
  `describe('R21: provision-device y set-device-subscription sin dotenv en código')`.
  Sin stub.
  - **Rutas**: `join(__dirname, '..', 'scripts', 'provision-device.ts')` y
    `join(__dirname, '..', 'scripts', 'set-device-subscription.ts')`.
  - `it('R21: ninguno de los dos scripts contiene dotenv')`: para cada uno,
    primero contiene `parseArgs` (anti-vacío) y después no contiene `dotenv`.
  - `it('R21: provision:device y subscription:set cargan ../.env con --env-file-if-exists')`:
    `scripts['provision:device']` y `scripts['subscription:set']` de
    `package.json` son exactamente los literales de [[requirements]] R21.
  - **Commit**: `test(backend-container-image): pin one-off scripts free of dotenv (R21)`.
- [ ] (2) **Verde**:
  - en los dos scripts, quitar `import { config as loadDotenv } from 'dotenv';`
    y la llamada `loadDotenv({ path: '../.env' });` de `main()`. Nada más;
  - cambiar esos dos scripts de `package.json` a los literales de R21;
  - comprobar que el e2e que ya lanza `provision-device.ts` sigue en verde
    (sus dos `spawnSync` fallan antes de conectar y no necesitan `.env`):
    ```
    FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/provision-device.e2e-spec.ts > /tmp/impl-245-R21-e2e.log 2>&1; echo "exit=$?"
    ```
  - **Commit**: `feat(backend-container-image): load .env for one-off scripts via node flag (R21)`.
- [ ] (3) Refactor: no previsto.

## R22 — los scripts de operación conectan con `buildPoolConfig`

- [ ] (1) **Rojo**: fichero nuevo `test/one-off-scripts.e2e-spec.ts`. Sin stub:
  hoy los scripts conectan con `DATABASE_URL` y mueren con `ECONNREFUSED`,
  así que el test falla por aserción.
  - **Helper del propio spec** `runScript(file: string, args: string[])`:
    ```
    spawnSync(process.execPath, ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register', file, ...args], { cwd: process.cwd(), encoding: 'utf8', env, timeout: 50_000 })
    ```
    `env` es una copia de `process.env` con `delete` de `PGHOST`, `PGPORT`,
    `PGDATABASE`, `PGUSER` y `DB_POOL_MAX`, y además:
    - `NODE_ENV: 'production'`;
    - `DATABASE_URL: 'postgresql://pet:pet@127.0.0.1:1/none-245'`;
    - `PGPASSWORD: 'pass-sentinel-245'`;
    - `SIM_MODE: 'false'` y `WIALON_TOKEN: 'wialon-sentinel-245'`: así
      `provision-device` pasa el guard de cliente simulado y llega al `Pool`;
    - `WIALON_BASE_URL: 'http://127.0.0.1:1/wialon-245'`: ninguna llamada sale
      de la máquina aunque un script llegara a Wialon.
  - `describe('R22: los scripts de operación conectan con buildPoolConfig')`,
    con un `it` por script, cada uno con timeout `60_000` (tercer argumento de
    `it`):
    - `it('R22: provision-device en producción sin PGHOST falla con DatabaseConfigError antes de conectar')`:
      `runScript('scripts/provision-device.ts', ['--unit-id', 'unit-245'])`;
    - `it('R22: set-device-subscription en producción sin PGHOST falla con DatabaseConfigError antes de conectar')`:
      `runScript('scripts/set-device-subscription.ts', ['--unit-id', 'unit-245'])`.
  - **Aserciones de cada `it`**, en este orden:
    1. `result.error` es `undefined` (no hubo timeout);
    2. `result.status` no es `0`;
    3. `result.stderr` contiene `DatabaseConfigError` y contiene `PGHOST`;
    4. `result.stderr` no contiene `ECONNREFUSED`;
    5. `result.stdout + result.stderr` no contiene `pass-sentinel-245` ni
       `wialon-sentinel-245`.
  - **Commit**: `test(backend-container-image): pin one-off scripts on buildPoolConfig (R22)`.
- [ ] (2) **Verde**: en `main()` de cada script, sustituir
  `new Pool({ connectionString: process.env.DATABASE_URL })` por
  `new Pool(buildPoolConfig(config))`.
  - `config` es un `new ConfigService()`. En `provision-device.ts` puede ser
    el mismo que ya recibe `createWialonClient`.
  - Importar `buildPoolConfig` de `@/db/pool-config` y, donde falte,
    `ConfigService` de `@nestjs/config`.
  - El resto de `main()` no cambia: el error sale por el `catch` que ya
    existe, con `console.error(...)` y `process.exitCode = 1`.
  - El e2e de R21 (`test/provision-device.e2e-spec.ts`) sigue en verde.
  - **Commit**: `feat(backend-container-image): one-off scripts connect through buildPoolConfig (R22)`.
- [ ] (3) Refactor: no previsto.

## R23 — `scripts/` se compila a `dist/scripts` (vía (b))

- [ ] (1) **Test**, un solo commit tras el verde de R22, en
  `src/container-image.spec.ts`:
  - `describe('R23: pnpm build compila scripts/ a dist/scripts')`.
  - `it('R23: tsconfig y tsconfig.build no acotan include ni files, y el exclude de build no nombra scripts')`:
    - lee `join(__dirname, '..', 'tsconfig.json')` y
      `join(__dirname, '..', 'tsconfig.build.json')` con
      `JSON.parse(readFileSync(...))`, igual que R20 con `package.json`;
    - primero, el `exclude` de `tsconfig.build.json` es un array que contiene
      `'test'` (anti-vacío);
    - ninguno de los dos objetos tiene la propiedad `include` ni `files`;
    - ninguna entrada del `exclude` contiene `scripts`.
  - Nace verde. El comando del test unitario de `src/container-image.spec.ts`
    da `exit=0`.
  - **Commit**: `test(backend-container-image): pin scripts compiled into dist (R23)`.
- [ ] (2) **Mutación**, sin commit:
  - añadir `"scripts"` al `exclude` de `tsconfig.build.json`;
  - correr el spec: el `it` de R23 sale en rojo;
  - `git checkout HEAD -- tsconfig.build.json`;
  - correr otra vez: verde.

  La evidencia va en el informe (§Cierre).
- [ ] (3) Refactor: no aplica.

## Cierre

1. **Suite unitaria completa**:
   ```
   FORCE_COLOR=0 pnpm exec jest --config package.json > /tmp/impl-245-unit-all.log 2>&1; echo "exit=$?"
   ```
   Debe dar `exit=0`.
2. **e2e de la feature**:
   ```
   FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/health.e2e-spec.ts test/migrate.e2e-spec.ts test/one-off-scripts.e2e-spec.ts test/provision-device.e2e-spec.ts > /tmp/impl-245-e2e.log 2>&1; echo "exit=$?"
   ```
   Debe dar `exit=0`. La suite e2e completa la corre el leader con `init.sh`.
3. **Mutaciones**: plantar cada una de [[design]] §Mutaciones, correr el
   spec, anotar el `it` en rojo y su línea decisiva, y revertir con
   `git checkout HEAD -- <fichero>`.
   - R10: `json: true` siempre.
   - R12 (a): sin la guarda `isProduction`.
   - R12 (b): lanzar siempre en producción.
   - R15: carpeta inexistente.
   - R17: `ADD https://…/global-bundle.pem /tmp/rds.pem` en `runtime`, antes de `USER node`.
   - R19 (a): `COPY --from=build /app/.env ./.env` en `runtime`.
   - R19 (b): línea `*.pem` en `.dockerignore`.
   - R23: `"scripts"` en el `exclude` de `tsconfig.build.json`.

   Al terminar, `git status --short` está limpio.
4. **Trazabilidad**: rellenar [[traceability]] (test `archivo::nombre del it`
   y `hash + mensaje` de cada commit verde, o del de test en R15 y R23).
   - **Commit**: `docs(backend-container-image): fill traceability`.
5. **Informe**: escribir `progress/impl_backend-container-image.md` con:
   - la lista de commits;
   - los `exit=` de los pasos 1 y 2;
   - la evidencia de las ocho mutaciones;
   - el `curl exit=` de R17, o la nota de que lo descargó el leader;
   - cualquier desviación de esta spec, con su motivo.

## Gate del leader: `docker build` en el VPS (sin R-id)

No forma parte de la cadena de Codex. Lo corre el **leader** en el VPS
(Docker 29.2.1 con buildx) cuando Codex termina y **antes** de lanzar al
`reviewer`. No toca AWS: solo descarga la imagen base y paquetes de npm. El
log va a `progress/docker-gate_backend-container-image.txt`; la extensión es
`.txt` porque `.gitignore` ignora `*.log`. El leader lo commitea en la branch.

**Comandos**, en este orden y sin pipes que oculten el código de salida:

```
cd /home/claude/sites/Pet-Tracker-wt-245/backend-pet-tracker
docker build --platform linux/amd64 -t pet-tracker-backend:245-local . > ../progress/docker-gate_backend-container-image.txt 2>&1; echo "build exit=$?" | tee -a ../progress/docker-gate_backend-container-image.txt
docker run --rm --platform linux/amd64 pet-tracker-backend:245-local sh -c 'id -u; stat -c %A /etc/ssl/certs/rds-global-bundle.pem; grep -q "BEGIN CERTIFICATE" "$NODE_EXTRA_CA_CERTS" && echo ca-ok; test ! -e /app/.env && echo no-env; test ! -e node_modules/drizzle-kit && test ! -e node_modules/@nestjs/cli && echo no-dev; node -e "require(\"argon2\"); console.log(\"argon2-ok\")"; test -f dist/src/db/migrations/meta/_journal.json && echo migrations-ok; test -f dist/scripts/provision-device.js && test -f dist/scripts/set-device-subscription.js && echo scripts-ok' >> ../progress/docker-gate_backend-container-image.txt 2>&1; echo "inspect exit=$?" | tee -a ../progress/docker-gate_backend-container-image.txt
timeout 60 docker run --rm --platform linux/amd64 pet-tracker-backend:245-local >> ../progress/docker-gate_backend-container-image.txt 2>&1; echo "default exit=$?" | tee -a ../progress/docker-gate_backend-container-image.txt
docker run --rm --platform linux/amd64 pet-tracker-backend:245-local node dist/scripts/provision-device.js >> ../progress/docker-gate_backend-container-image.txt 2>&1; echo "provision exit=$?" | tee -a ../progress/docker-gate_backend-container-image.txt
docker run --rm --platform linux/amd64 pet-tracker-backend:245-local node dist/scripts/set-device-subscription.js --unit-id gate-245 >> ../progress/docker-gate_backend-container-image.txt 2>&1; echo "subscription exit=$?" | tee -a ../progress/docker-gate_backend-container-image.txt
docker run --rm --platform linux/amd64 pet-tracker-backend:245-local node dist/src/db/migrate.js >> ../progress/docker-gate_backend-container-image.txt 2>&1; echo "migrate exit=$?" | tee -a ../progress/docker-gate_backend-container-image.txt
```

**Esperado**:

1. `build exit=0`.
2. `inspect exit=0`, y en el log, en este orden: `1000`, `-r--r--r--`,
   `ca-ok`, `no-env`, `no-dev`, `argon2-ok`, `migrations-ok` y `scripts-ok`.
3. `default exit=` distinto de `0` y de `124`, con un error que nombra
   `SIM_MODE` y `JWT_SECRET` (R12 y R13 de punta a punta: el contenedor
   arranca sin entorno). `124` es el `timeout`: la app no abortó, y eso es un
   fallo.
4. `provision exit=` distinto de `0`, con `falta --unit-id`. Prueba que el
   `.js` compilado carga sus imports `@/` reescritos por `tsc-alias`.
5. `subscription exit=` distinto de `0`, con `DatabaseConfigError` y `PGHOST`
   (R22 en la imagen).
6. `migrate exit=1`, con una línea JSON que nombra `PGHOST` (R14 en la
   imagen).

Si algo no cuadra, el leader no lanza al `reviewer`: devuelve el fallo a
Codex con la línea decisiva del log. Al terminar,
`docker image rm pet-tracker-backend:245-local`.
