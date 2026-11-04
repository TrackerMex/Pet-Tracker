---
feature: "backend-pg-pool-error-listener"
status: approved     # draft | approved
tags: [harness, spec, backend, db, resiliencia]
---

# Requisitos — [[backend-pg-pool-error-listener]]

> Feature #238. Notación EARS. Cada requisito tiene un id único R<n>, que no
> cambia una vez aprobado. Las decisiones técnicas están en [[design]], los
> pasos TDD en [[tasks]] y la evidencia en [[traceability]]. Las reglas de capas
> están en [[../../docs/architecture|architecture]]: `src/db/drizzle.module.ts`
> es infraestructura compartida («provee pg Pool + cliente drizzle»).
>
> - Base medida: `origin/dev` en `6fe140ee`. Al firmar, la branch mergeó
>   `origin/dev` en `fd6244a2` (merge `7e24ba36`); ese merge no toca
>   `backend-pet-tracker/`, así que las anclas siguen valiendo.
> - Worktree: `/home/claude/sites/Pet-Tracker-wt-238`. Branch:
>   `feature/238-backend-pg-pool-error-listener`. La PR va contra `dev`.
> - Alcance: `backend-pet-tracker/src/db/drizzle.module.ts` y su test
>   `backend-pet-tracker/src/db/drizzle.module.spec.ts` (R2). **No se tocan
>   `scripts/`, `test/`, las migraciones ni las dependencias.**
> - Las rutas son relativas a `backend-pet-tracker/`, salvo que se diga otra cosa.

## Origen

No es un hallazgo del smoke en dispositivo. Es una observación de la spec de
#237 (`specs/backend-e2e-vaccine-catalog-teardown/requirements.md` §Fuera de
alcance, «Listener de `'error'` en el pool de la app»), en la rama
`feature/237-backend-e2e-vaccine-catalog-teardown`.

- **Petición del humano** (2026-11-03), texto literal: «si registra como
  feature el pool en postgres».
- Plan: `progress/plan_mejoras-smoke-2026-11-03.md` §2 «238».

No hay copy ni pantalla: no hay G1 ni G2. El punto «paso de smoke que reproduce
el fallo» de la checklist de firma no aplica; el fallo se reproduce de forma
determinista con el test de R1, sin Postgres.

## Causa verificada contra el árbol

Comprobada en `6fe140ee` y contra `pg-pool@3.14.0` y `pg@8.22.0`, las versiones
de `pnpm-lock.yaml` (fuentes leídas en
`/home/claude/sites/Pet-Tracker/backend-pet-tracker/node_modules/.pnpm/`, porque
el worktree aún no tiene `node_modules`).

1. **El pool de la app no escucha `'error'`.** El provider `PG_POOL` de
   `src/db/drizzle.module.ts` devuelve `new Pool({ connectionString: config.get<string>('DATABASE_URL') })`
   tal cual. `on('error'` sale 0 veces en `src/`.
2. **Es el único `Pool` de la app.** En `src/`, `new Pool(` solo aparece en
   `src/db/drizzle.module.ts`. `PG_POOL` solo se usa dentro de ese fichero (y
   del token en `src/db/drizzle.constants.ts`).
3. **Qué pasa cuando Postgres mata un cliente ocioso** (`57P01` por un
   reinicio, un failover o `pg_terminate_backend`):
   - el cliente recibe el ErrorResponse; sin query activa,
     `_handleErrorEvent(err)` de `pg/lib/client.js` hace `this.emit('error', err)`;
   - el cliente ocioso tiene enganchado el `idleListener` del pool
     (`makeIdleListener` en `pg-pool/index.js`), que hace `pool._remove(client)`
     y después `pool.emit('error', err, client)`;
   - `Pool` extiende `EventEmitter`. Sin listener de `'error'`, `emit` lanza y
     el error sale como excepción no capturada: el proceso Nest cae.
4. **Con un listener, el pool se recupera solo.** `idleListener` ya sacó al
   cliente de `_clients` antes de emitir; la siguiente consulta abre otro
   cliente. No hace falta lógica de reintento en el repo.

## Anclas en el árbol (medidas en `6fe140ee`)

Todas con `grep -cF`, desde `backend-pet-tracker/`.

| Fichero | Literal | Cuenta |
|---|---|---|
| `src/db/drizzle.module.ts` | `new Pool(` | 1 |
| ídem | `on('error'` | 0 |
| ídem | `Logger` | 0 |
| ídem | `throw` | 0 |
| ídem | `provide: PG_POOL,` | 1 |
| ídem | `connectionString: config.get<string>('DATABASE_URL'),` | 1 |
| ídem | `await this.pool.end();` | 1 |
| ídem | `exports: [DRIZZLE],` | 1 |
| `src/db/drizzle.module.spec.ts` | `describe('R4: DrizzleModule exposes a Drizzle client under the DRIZZLE token'` | 1 |
| ídem | `it('resolves a drizzle-orm/node-postgres client under DRIZZLE'` | 1 |
| ídem | `#238` | 0 |
| ídem | `PG_POOL` | 0 |
| ídem | `Logger` | 0 |

Fuera de `src/` (para §Fuera de alcance): `new Pool(` aparece en 5 ficheros de
`scripts/` (`backfill-weights.ts`, `provision-device.ts`, `seed-devices.ts`,
`seed-vaccines.ts`, `set-device-subscription.ts`) y en
`test/vaccine-catalog-migration.e2e-spec.ts`. `on('error'` sale 0 veces en
`scripts/` y en `test/`.

## Decisiones cerradas por el `spec_author`

Detalle y alternativas en [[design]].

- **D1. El listener vive en el factory de `PG_POOL`.** Se engancha justo
  después de `new Pool(...)` y antes del `return`, así no existe ningún
  instante con el pool expuesto y sin listener.
- **D2. Loguea con `Logger` de Nest y no lanza.** Un logger de módulo,
  `const poolLogger = new Logger('PgPool');`, y en el listener
  ``poolLogger.error(`Idle client error: ${error.message}`, error.stack);``.
  Es el patrón de logger a nivel de módulo de
  `src/modules/pets/application/owner-local-day.ts` (`new Logger('ownerLocalDay')`).
- **D3. Sin reintentos, sin métricas, sin cambiar la configuración del pool.**
  `pg-pool` ya descarta el cliente y abre otro en la siguiente consulta
  (§Causa 4).
- **D4. Test unitario, sin Postgres.** El test compila `DrizzleModule` igual
  que el `describe('R4: …')` existente (el `Pool` es perezoso: no conecta
  hasta la primera consulta), toma el pool con `moduleRef.get<Pool>(PG_POOL)` y
  emite `'error'` a mano, que es exactamente lo que hace `idleListener`
  (`pool.emit('error', err, client)`). Un e2e con `pg_terminate_backend`
  necesitaría el Postgres compartido entre worktrees y no prueba nada más del
  código del repo: lo que pasa antes del `emit` es de `pg` y `pg-pool`.
- **D5. `PG_POOL` sigue sin exportarse.** `exports: [DRIZZLE],` no cambia.
  `TestingModule.get` resuelve tokens no exportados (`strict: false` por
  defecto en `@nestjs/core` 11).

## Requisitos funcionales

### R1 — Un error del pool se loguea y no tumba el proceso

- **R1**: IF the pool provided under `PG_POOL` emits `'error'` with an `Error`
  (what `pg-pool` does when Postgres terminates an idle client) THEN THE SYSTEM
  SHALL:
  - not throw from `pool.emit('error', error)`;
  - call `Logger.prototype.error` exactly once;
  - with exactly two arguments: the string
    `'Idle client error: terminating connection due to administrator command'`
    (for an error whose `message` is
    `'terminating connection due to administrator command'`) and that error's
    `stack`.
- Test: `src/db/drizzle.module.spec.ts::#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw`,
  dentro de un `describe` nuevo con este nombre literal:
  `describe('#238: PG_POOL logs idle client errors instead of crashing', ...)`.
- **Rojo determinista**, sin Postgres. Con el código de hoy el pool no tiene
  listener:
  - `pool.emit('error', error)` lanza;
  - la primera aserción, `expect(() => pool.emit('error', error)).not.toThrow()`,
    falla, y el log del fichero muestra `expect(received).not.toThrow()` y
    `Error message: "Unhandled error.` (cada uno con `grep -cF` = `1`; enmienda E1);
  - el fichero sale con `Tests: 1 failed, 1 passed, 2 total` (el it de R4 sigue verde).
- **Verificación estática al final de la cadena** (`grep -cF` sobre
  `src/db/drizzle.module.ts`):

  | Literal | Cuenta |
  |---|---|
  | `new Pool(` | 1 |
  | `on('error'` | 1 |
  | `pool.on('error', (error) => {` | 1 |
  | `const poolLogger = new Logger('PgPool');` | 1 |
  | ``poolLogger.error(`Idle client error: ${error.message}`, error.stack);`` | 1 |
  | `return pool;` | 1 |
  | `throw` | 0 |
  | `provide: PG_POOL,` | 1 |
  | `connectionString: config.get<string>('DATABASE_URL'),` | 1 |
  | `await this.pool.end();` | 1 |
  | `exports: [DRIZZLE],` | 1 |

  Y sobre `src/db/drizzle.module.spec.ts`:

  | Literal | Cuenta |
  |---|---|
  | `describe('#238: PG_POOL logs idle client errors instead of crashing'` | 1 |
  | `it('#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw'` | 1 |
  | `#238` | 2 |

  El it se prueba contra dos mutaciones de [[design]] §Mutaciones: M1 (sin
  listener; también mueve la ancla `on('error'` a 0) y M2 (listener sin log).
  No se usa `it(` como ancla: también casa con `emit(`.

### R2 — Alcance: solo el módulo de drizzle y su test

- **R2**: THE SYSTEM SHALL change no file under `backend-pet-tracker/` other
  than `src/db/drizzle.module.ts` and `src/db/drizzle.module.spec.ts`, and the
  existing it `resolves a drizzle-orm/node-postgres client under DRIZZLE`
  SHALL stay unchanged and green.
- Verificación, desde la raíz del repo:
  - `git diff --name-only origin/dev...HEAD -- backend-pet-tracker/` lista
    exactamente `backend-pet-tracker/src/db/drizzle.module.spec.ts` y
    `backend-pet-tracker/src/db/drizzle.module.ts`;
  - `git diff --quiet origin/dev...HEAD -- backend-pet-tracker/scripts backend-pet-tracker/test backend-pet-tracker/src/db/migrations backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml; echo "exit=$?"`
    da `exit=0`;
  - `grep -cF "describe('R4: DrizzleModule exposes a Drizzle client under the DRIZZLE token'" backend-pet-tracker/src/db/drizzle.module.spec.ts`
    da `1` y `grep -cF "it('resolves a drizzle-orm/node-postgres client under DRIZZLE'" backend-pet-tracker/src/db/drizzle.module.spec.ts`
    da `1`;
  - la suite unitaria completa, `tsc --noEmit` y `eslint` de los dos ficheros
    salen con 0 ([[tasks]] §Comandos).

## Fuera de alcance

- **Pools de `scripts/`** (los 5 de §Anclas). Son CLIs de una sola pasada que
  hacen `pool.end()` al terminar; si Postgres los corta, el script falla igual
  con o sin listener.
- **Pools de `test/`** (`vaccine-catalog-migration.e2e-spec.ts`). Son de #237,
  que decidió no escucharlos (su D2). Tras #238 el pool de la app (C1 en la
  tabla de #237) sí tiene listener; no choca con #237, que borra sin `FORCE` y
  por tanto no provoca `57P01` en ese pool. No comparten ficheros.
- **Clientes prestados en transacciones.** Mientras `db.transaction(...)`
  tiene un cliente prestado (drizzle hace `pool.connect()` y `release()`),
  `pg-pool` le quita el `idleListener`. Si Postgres lo mata entre dos
  consultas de la transacción, el `'error'` sale en el cliente, no en el pool.
  `.transaction(` aparece en 6 ficheros de `src/` sin `.spec.ts`. Es una
  ventana mucho más estrecha y otro mecanismo: queda como **observación para
  el leader**; esta spec no la registra.
- **Reintentos, health checks, métricas o alertas** del error, y cambios de
  configuración del pool (`max`, `idleTimeoutMillis`, `keepAlive`) (D3).
- **Exportar `PG_POOL`** (D5).
- **`docs/`**: `docs/architecture.md` sigue describiendo bien el módulo
  («provee pg Pool + cliente drizzle (token DRIZZLE)»). Tampoco `progress/`,
  salvo el reporte `progress/impl_backend-pg-pool-error-listener.md`.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-11-04) ← gate obligatorio antes de implementar

  El humano aprobó la firma de forma explícita el 2026-11-04 a las 00:38 UTC
  («apruebo la firma de 238»). El leader la registra con su commit.

### Enmienda E1 (2026-11-04)

Codex paró en el rojo de R1. El it cayó por aserción, como pide R1, pero el
log no traía `Expected the function not to throw an error.`. Ese es el texto de
jest 29. El backend usa jest 30 (`expect@30.4.1`), que para `.not.toThrow()`
imprime:

```text
expect(received).not.toThrow()

Error name:    "Error"
Error message: "Unhandled error. (Error: terminating connection due to administrator command
```

- **Qué cambia.** El rojo de R1 y la mutación M1 se reconocen por
  `expect(received).not.toThrow()` y `Error message: "Unhandled error.` en el
  log, cada uno con `grep -cF` = `1` (medido en el log del rojo de Codex). El
  segundo literal confirma lo que ya decía design.md: Node lanza
  `ERR_UNHANDLED_ERROR`.
- **Qué no cambia.** El comportamiento de R1, el test, el listener, M2, R2 y el
  resto de cifras.

- [ ] Enmienda E1 aprobada por humano (fecha: ____)

No hay gates humanos aparte: ni G1 (copy y artboards) ni G2 (smoke). El
mandato del 2026-10-23, ampliado el 2026-11-03, cubre #226–#235, no #238: esta
casilla la firma el leader solo cuando el humano apruebe la firma de forma
explícita, como hizo con #236 y #237.
