---
feature: "backend-e2e-vaccine-catalog-teardown"
status: draft        # draft | approved
tags: [harness, spec, backend, e2e, flake]
---

# Requisitos — [[backend-e2e-vaccine-catalog-teardown]]

> Feature #237. Notación EARS. Cada requisito tiene un id único R<n>, que no
> cambia una vez aprobado. Las decisiones técnicas están en [[design]], los
> pasos TDD en [[tasks]] y la evidencia en [[traceability]]. Las reglas de capas
> están en [[../../docs/architecture|architecture]]. Esta feature no toca
> ninguna capa: solo cambia un fichero de test.
>
> - Base medida: `origin/dev` en `5c7c9547`.
> - Branch: `feature/237-backend-e2e-vaccine-catalog-teardown`. La PR va contra `dev`.
> - Alcance: solo `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts`
>   (el e2e de #226). **No se tocan `src/`, las migraciones ni las dependencias** (R4).
> - Las rutas son relativas a la raíz del repo, salvo que se diga otra cosa.

## Origen

No es un hallazgo del smoke en dispositivo. Es un flake del gate `./init.sh`.

- **Cuándo.** En el `./init.sh` de @Frontend del 2026-11-03 (wt-233), según
  `progress/plan_mejoras-smoke-2026-11-03.md` §2 «237».
- **Qué salió, dos veces.** «Test suite failed to run: Unhandled error», con
  código `57P01` («terminating connection due to administrator command»).
- **Reintento.** Salió verde.
- **Petición del humano** (2026-11-03), texto literal: «registralo como feature».

Por eso no hay paso de smoke, ni G1, ni G2: no hay copy ni pantalla. El fallo
original se reproduce de forma determinista con el test de R1. El punto «paso de
smoke que reproduce el fallo» de la checklist de firma no aplica.

## Causa verificada contra el árbol

La premisa del plan dice: «probablemente el pool de la app Nest, que lee
`DATABASE_URL`». Se comprobó contra el árbol en `5c7c9547` y contra
`pg-pool@3.14.0` y `pg@8.22.0`, las versiones de `backend-pet-tracker/pnpm-lock.yaml`.

**El pool de la app sí es uno de los candidatos, pero ningún pool queda sin
cerrar.** Los tres pools que tocan A o B se cierran antes del `DROP`. La causa
real son dos cosas juntas:

- `Pool.end()` resuelve antes de que sus conexiones se cierren de verdad.
- `WITH (FORCE)` mata los backends que todavía no han salido.

### 1. Inventario de clientes que pueden estar conectados a A o a B al hacer el `DROP`

| # | Cliente | Dónde nace | Base | Quién lo cierra en el `afterAll` | Listener `'error'` |
|---|---|---|---|---|---|
| C1 | Pool de la app, provider `PG_POOL` | `backend-pet-tracker/src/db/drizzle.module.ts`, `useFactory` del provider `PG_POOL`: `new Pool({ connectionString: config.get<string>('DATABASE_URL') })`. El token vive en `src/db/drizzle.constants.ts` | A | Paso 1 `() => app?.close()`. Llama a `DrizzlePoolLifecycle.onModuleDestroy`, que hace `await this.pool.end();` | ninguno |
| C2 | `poolA` | e2e, `beforeAll` de `describe('#226 R1: la migracion llena un catalogo vacio')` | A | Paso 2 `() => poolA?.end()` | ninguno |
| C3 | `poolB` | e2e, it `#226 R2: migrar sobre una base sembrada no falla ni cambia ninguna fila` | B | Paso 3 `() => poolB?.end()` | ninguno |
| — | `admin` | e2e, `beforeAll` externo | la base original del `.env` | Paso 7 `() => admin?.end()` | ninguno; no le afecta, porque su base no se borra |

**C1 apunta a A.**

- El e2e asigna `process.env.DATABASE_URL = urlA.toString();` antes de `compile()`.
- `AppConfigModule.forRoot` (`src/config/config.module.ts`) no usa `validate`
  ni `load`. Por eso `ConfigService.get` (`@nestjs/config` 4.0.4) cae en
  `process.env` en el momento en que se invoca la factory.
- Prueba de comportamiento: el it `#226 R1: una vacuna del catalogo migrado se
  registra con 201` inserta el usuario solo en A, con `drizzle(poolA)`, y la app
  le crea una mascota con 201.

**No hay más clientes.**

- En `src/` (sin `.spec.ts`), `new Pool(` y `from 'pg'` solo aparecen en
  `src/db/drizzle.module.ts`.
- No hay `new Client(`, `.connect()` ni `LISTEN` en `src/` ni en `test/`.
- `PG_POOL` no se usa fuera del módulo de drizzle.

### 2. Los tres se cierran antes del `DROP`

El array `cleanup` del `afterAll` va en este orden:

1. `app.close()`
2. `poolA.end()`
3. `poolB.end()`
4. restaurar `DATABASE_URL`
5. `DROP` de A
6. `DROP` de B
7. `admin.end()`
8. `rmSync`

En una corrida verde no queda ningún pool sin cerrar. Eso descarta la hipótesis
de un pool olvidado.

### 3. `Pool.end()` no espera al socket

En `pg-pool@3.14.0` (`index.js`):

- `_pulseQueue`, en la rama `if (this.ending)`, llama a
  `this._remove(item.client)` por cada cliente ocioso.
- `_remove` saca el cliente de `_clients` de forma síncrona:
  `this._clients = this._clients.filter((c) => c !== client)`.
- Con `_clients` ya vacío, `_pulseQueue` llama a `this._endCallback()` en el
  mismo tick.
- El `client.end(...)` de `_remove`, cuyo callback emite `context.emit('remove', client)`,
  termina más tarde: cuando llega el `'end'` del socket
  (`this.connection.once('end', cb)` en `pg@8.22.0` `lib/client.js`).

Así, `await pool.end()` resuelve con el Terminate (`'X'`) enviado pero con el
backend quizá aún vivo. Lo mismo vale para `await app.close()`, que hace ese
`end()` dentro.

### 4. `WITH (FORCE)` mata ese backend

El `DROP DATABASE IF EXISTS ... WITH (FORCE)` del paso siguiente manda SIGTERM a
cada backend que siga conectado a la base. Si la señal llega antes de que el
backend lea la `'X'`, el backend responde con un ErrorResponse `57P01`, que es el
`FATAL` del log de Postgres, y sale.

### 5. Nadie escucha el error

- El cliente está medio cerrado, pero sigue leyendo del socket.
- En `lib/client.js`, `_handleErrorMessage`, sin query activa, llama a
  `this._handleErrorEvent(msg)`, que emite `'error'` en el cliente.
- El `idleListener` del pool sigue enganchado: lo pone
  `client.on('error', idleListener)` al liberar el cliente, y `_remove` no lo quita.
  Ese listener lo reemite como `pool.emit('error', err, client)`.
- Ninguno de los tres pools tiene listener de `'error'`: `on('error'` sale 0
  veces en el e2e y en `src/`. Por eso el `EventEmitter` lanza fuera de cualquier
  test, y Jest lo reporta como «Test suite failed to run».
- El texto «Unhandled error» es `ERR_UNHANDLED_ERROR` de Node. Bajo Jest, el
  `DatabaseError` nace en el realm del test y no pasa el `instanceof Error` del
  módulo `events`. Esto explica el texto; no cambia el arreglo.

### 6. Qué cliente fue

Según el plan, el log tiene el `FATAL` **antes** de los dos
`checkpoint starting: immediate force wait`. Cada `DROP` acaba con su
checkpoint, así que la sesión que murió era de A: C1 o C2.

Esto es una inferencia del orden que cita el plan. **No se volvió a verificar
contra el log**: esta spec no leyó nada de Postgres. El arreglo no depende de
cuál de los dos fue.

### 7. Por qué es intermitente

Es una carrera entre la llegada de la `'X'` y la del SIGTERM, en dos sockets
distintos y separados por microsegundos. Repetir la corrida no prueba nada. El
rojo determinista es el de R1: una sesión viva de verdad.

## Anclas en el árbol (medidas en `5c7c9547`)

Todas con `grep -cF`. Las del e2e y `src/` se miden desde `backend-pet-tracker/`.
Las de `node_modules` se miden después de `pnpm install --frozen-lockfile`,
desde `backend-pet-tracker/node_modules/.pnpm/`.

| Fichero | Literal | Cuenta |
|---|---|---|
| `test/vaccine-catalog-migration.e2e-spec.ts` | `WITH (FORCE)` | 2 |
| ídem | `DROP DATABASE IF EXISTS` | 2 |
| ídem | `() => app?.close(),` | 1 |
| ídem | `() => poolA?.end(),` | 1 |
| ídem | `() => poolB?.end(),` | 1 |
| ídem | `() => admin?.end(),` | 1 |
| ídem | `new Pool(` | 3 |
| ídem | `on('error'` | 0 |
| ídem | `dropDatabase` | 0 |
| ídem | `it('#226` | 7 |
| ídem | `describe('#226` | 4 |
| ídem | `jest.setTimeout(180_000);` | 1 |
| ídem | `throw new AggregateError(errors, 'Migration e2e cleanup');` | 1 |
| ídem | `process.env.DATABASE_URL = urlA.toString();` | 1 |
| ídem | `pet_tracker_237` | 0 |
| `src/db/drizzle.module.ts` | `await this.pool.end();` | 1 |
| ídem | `connectionString: config.get<string>('DATABASE_URL'),` | 1 |
| `pg-pool@3.14.0_pg@8.22.0/node_modules/pg-pool/index.js` | `this._remove(item.client)` | 1 |
| ídem | `this._endCallback()` | 1 |
| ídem | `context.emit('remove', client)` | 1 |
| ídem | `pool.emit('error', err, client)` | 1 |
| `pg@8.22.0/node_modules/pg/lib/client.js` | `this._handleErrorEvent(msg)` | 1 |
| ídem | `this.connection.once('end', cb)` | 1 |
| `../docker-compose.yml` | `image: postgres:17-alpine` | 1 |

## Decisiones cerradas por el `spec_author`

Detalle y alternativas en [[design]].

- **D1. Borrar sin `FORCE`.**
  - Las dos bases se borran con `DROP DATABASE IF EXISTS "<nombre>"`, sin
    `WITH (FORCE)`, desde una función nueva del e2e:
    `async function dropDatabase(name: string): Promise<void>`.
  - Sin `FORCE`, Postgres no manda ninguna señal. Espera hasta 5 s a que salgan
    los backends que ya se están yendo (`CountOtherDBBackends`), que es justo
    el caso de §Causa 3.
  - Si de verdad queda una sesión viva, el `DROP` falla con `55006` («database …
    is being accessed by other users»). Ese error entra en el `AggregateError`
    del `afterAll`, con nombre, en vez de tumbar la suite como error no manejado.
- **D2. Sin listener de `'error'` en C1–C3.** Escuchar ahí taparía también una
  fuga real. Además, para C1 haría falta sacar `PG_POOL` de la app. El listener
  de los its nuevos es una sonda del test, no el arreglo.
- **D3. Producción no se toca.** `DrizzlePoolLifecycle` cierra bien su pool. Que
  `end()` resuelva antes de tiempo es comportamiento de `pg-pool`, no del
  código del repo. No queda ninguna decisión abierta sobre producción.
- **D4. `dropDatabase` vive en el propio e2e.** Tiene un solo fichero usuario,
  así que no se crea un helper en `test/`.
- **D5. Cuesta 5 s más.** El it de R1 espera los 5 s del `DROP` sin `FORCE`
  antes del `55006`. Se acepta: el `jest.setTimeout(180_000)` del fichero lo cubre.

## Requisitos funcionales

Todos los its nuevos van en `test/vaccine-catalog-migration.e2e-spec.ts`, dentro
del `describe` externo, en un `describe` nuevo con este nombre literal:
`describe('#237: dropDatabase no termina sesiones ajenas', ...)`. Así comparten
`admin`, `runId` y `originalDatabaseUrl`.

### R1 — Con una sesión viva, el borrado falla con nombre y no mata a nadie

- **R1**: IF `dropDatabase(name)` runs while a session opened by the test is still
  connected to `name` THEN THE SYSTEM SHALL:
  - reject with an error whose `code` is `'55006'`;
  - leave `name` in `pg_database`: `select count(*)::int as count from pg_database where datname = $1` returns `1`;
  - deliver no error to that session's pool: the array filled by its
    `pool.on('error', …)` equals `[]`.
- Test: `#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01`.
- **Rojo determinista.** Con el SQL de hoy (`WITH (FORCE)`), la sesión está viva
  de verdad: no hay carrera.
  - El `DROP` mata la sesión y resuelve.
  - La aserción `rejects` falla con «Received promise resolved instead of rejected».
  - El pool recibe el `57P01`. La sonda lo registra, así que no tumba la suite.

### R2 — Justo después de `pool.end()`, el borrado funciona y nadie recibe error

- **R2**: WHEN `dropDatabase(name)` runs right after `await pool.end()` resolves
  on a pool that had one idle session in `name` (the flake's sequence) THE SYSTEM
  SHALL:
  - resolve;
  - remove `name` from `pg_database`: the same count returns `0`;
  - deliver no error to the pool: its `pool.on('error', …)` array equals `[]`.
- Test: `#237 R2: justo despues de pool.end(), dropDatabase borra la base y el pool no recibe ningun error`.
- **Nace verde tras R1, con justificación.**
  - Con `FORCE`, este it solo falla por carrera, así que su rojo no es exigible.
  - Su papel es probar que el arreglo no convierte el cierre normal en un `55006`:
    el `DROP` sin `FORCE` espera a que el backend que ya recibió la `'X'` salga.

### R3 — El `afterAll` borra A y B solo con `dropDatabase` y sin `FORCE`

- **R3**: THE SYSTEM's `afterAll` SHALL:
  - drop A and B only through `dropDatabase`;
  - do it after `app.close()`, `poolA.end()` and `poolB.end()`, in the same
    order as today;
  - and the file SHALL contain no `WITH (FORCE)`.
- Verificación sin test nuevo, desde `backend-pet-tracker/`. Cuentas esperadas
  al final de la cadena:

  | Literal (`grep -cF` sobre `test/vaccine-catalog-migration.e2e-spec.ts`) | Cuenta |
  |---|---|
  | `WITH (FORCE)` | 0 |
  | `DROP DATABASE IF EXISTS` | 1 |
  | `async function dropDatabase(name: string): Promise<void>` | 1 |
  | `if (createdA) await dropDatabase(databaseA);` | 1 |
  | `if (createdB) await dropDatabase(databaseB);` | 1 |
  | `() => app?.close(),` | 1 |
  | `() => poolA?.end(),` | 1 |
  | `() => poolB?.end(),` | 1 |
  | `it('#226` | 7 |
  | `it('#237` | 2 |
  | `describe('#237: dropDatabase no termina sesiones ajenas'` | 1 |

  Además, el fichero completo sale verde con `Tests: 9 passed, 9 total`: los
  7 its de #226, sin cambios, más los 2 de #237.
- La ancla negativa (`WITH (FORCE)` = 0) se prueba contra la mutación M1 de
  [[design]]. Con M1 plantada, la cuenta sube a 1.
- **Orden de los pasos.** Los pasos 1 a 3 del `cleanup` de §Causa 2 siguen
  delante de los dos `dropDatabase`. El reviewer lo comprueba leyendo el diff
  del array `cleanup`: solo cambian las dos funciones del `DROP`.

### R4 — Alcance: solo el e2e

- **R4**: THE SYSTEM SHALL change no file under `backend-pet-tracker/` other than
  `test/vaccine-catalog-migration.e2e-spec.ts`.
- Verificación:
  - `git diff --name-only 5c7c9547...HEAD -- backend-pet-tracker/` lista
    exactamente `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts`;
  - `git diff --quiet 5c7c9547...HEAD -- backend-pet-tracker/src backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml` sale con 0;
  - la suite unitaria, `tsc --noEmit` y `eslint` del fichero salen con 0
    ([[tasks]] §Comandos).

## Fuera de alcance

- **Producción** (`src/db/drizzle.module.ts` y `DrizzlePoolLifecycle`). Cierra
  bien su pool. El cierre temprano es de `pg-pool` (D3).
- **Listener de `'error'` en el pool de la app.** En producción, un `57P01` sobre
  un cliente ocioso, por ejemplo por un reinicio de Postgres, tumbaría el
  proceso igual que aquí.
  - La premisa está verificada: `on('error'` sale 0 veces en `src/`.
  - No es la causa del flake, que nace del `FORCE` del test.
  - Queda como **observación para el leader**: decide si la registra como
    feature. Esta spec no la registra.
- **Otros e2e.** Ningún otro fichero de `test/` hace `DROP DATABASE`, así que no
  hay otro sitio que barrer.
- **Bases huérfanas de corridas anteriores.** Si alguna vez quedó una
  `pet_tracker_226_*` en el Postgres compartido, se limpia a mano. Esta feature
  no la busca ni la borra.
- **`docs/` y `progress/`**, salvo el reporte `progress/impl_backend-e2e-vaccine-catalog-teardown.md`
  y esta spec.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

No hay gates humanos aparte: ni G1 (copy y artboards) ni G2 (smoke). La firma
delegada del leader cubre esta casilla según el mandato del 2026-10-23,
ampliado el 2026-11-03.
