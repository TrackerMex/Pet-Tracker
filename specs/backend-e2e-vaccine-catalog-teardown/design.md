---
feature: "backend-e2e-vaccine-catalog-teardown"
status: draft        # draft | approved
tags: [harness, spec, backend, e2e, flake]
---

# Diseño — [[backend-e2e-vaccine-catalog-teardown]]

> Ver [[requirements]] para los requisitos y la causa verificada, y
> [[../../docs/architecture|architecture]] para las capas. Esta feature no toca
> ninguna capa: solo cambia un fichero de test. Las rutas son relativas a
> `backend-pet-tracker/`.

## Decisiones técnicas

### `dropDatabase` sin `FORCE` (R1, R2, R3)

- **Qué.** Una función nueva dentro del `describe` externo de
  `test/vaccine-catalog-migration.e2e-spec.ts`, junto a `getCatalog`:
  - firma: `async function dropDatabase(name: string): Promise<void>`;
  - cuerpo: un solo `await admin.query(...)` con
    `DROP DATABASE IF EXISTS "<name>"`, sin `WITH (FORCE)`;
  - usa el `admin` del cierre, como `getCatalog` usa `app`.
- **Por qué arregla el flake.** Sin `FORCE`, Postgres 17 no manda SIGTERM. Antes
  de borrar, `CountOtherDBBackends` espera hasta 5 s (50 vueltas de 100 ms) a
  que salgan los backends de la base.
  - El backend que ya recibió la `'X'` de `pool.end()` sale en milisegundos.
  - El `DROP` sigue sin que nadie reciba un ErrorResponse.
  - Así desaparece la carrera de [[requirements]] §Causa 3–4, y vale igual para
    C1, C2 y C3.
- **Qué pasa con una fuga real.** Si una sesión sigue viva, el `DROP` falla con
  `55006`. El bucle del `afterAll` ya recoge el error en el `AggregateError`
  `'Migration e2e cleanup'`. Ese fallo es explícito y determinista.
  - Techo conocido: en ese caso la base `pet_tracker_226_*` se queda en el
    Postgres compartido hasta que alguien la borre.
  - Se acepta porque solo pasa si hay una fuga, que es justo lo que hay que ver.
    Con `FORCE` la fuga se borraba en silencio o tumbaba la suite con
    «Unhandled error».

### El `afterAll` (R3)

- Solo cambian las dos funciones del `DROP` del array `cleanup`. Cada una queda así:
  - `async () => {`
  - `if (createdA) await dropDatabase(databaseA);` (o `B`)
  - `},`
- El resto del array no se mueve: orden, `app?.close()`, `poolA?.end()`,
  `poolB?.end()`, restaurar `DATABASE_URL`, `admin?.end()`, `rmSync` y el
  `AggregateError`.

### Los its nuevos (R1, R2)

Van en `describe('#237: dropDatabase no termina sesiones ajenas', ...)`, detrás
del `describe` de `#226 R3`. Cada it crea su propia base desechable y la borra en
un `finally`, para que un rojo no deje bases huérfanas.

- **Nombres de base.** Mismo patrón que A y B:
  - R1: `pet_tracker_237_live_${runId}`;
  - R2: `pet_tracker_237_ended_${runId}`.
  - Son 35 caracteres como mucho, por debajo del límite de 63.
- **URL.** Igual que A y B: `new URL(originalDatabaseUrl!)` y cambiar solo
  `pathname`.
- **Sonda.** Justo después de crear el `Pool` del it:
  - se declara `const errors: unknown[] = []`;
  - se engancha `pool.on('error', (error) => { errors.push(error); })`.

  La sonda va **antes** del primer `query`. Es del test, no del arreglo (D2): sin
  ella, el rojo de R1 tumbaría la suite con el mismo «Unhandled error» en vez de
  fallar por aserción.
- **Cuenta en `pg_database`.** `admin.query<{ count: number }>('select count(*)::int as count from pg_database where datname = $1', [name])`.
  Con `::int`, `pg` devuelve un `number`.
- **R1, sesión viva.**
  1. `CREATE DATABASE` de la base del it.
  2. `new Pool({ connectionString, idleTimeoutMillis: 0 })` y la sonda.
     `idleTimeoutMillis: 0` apaga el cierre por inactividad, que por defecto es
     de 10 s. Así la sesión no se cierra sola durante los 5 s de espera del `DROP`.
  3. `await pool.query('select 1')`. Deja una sesión ociosa en el pool.
  4. `await expect(dropDatabase(name)).rejects.toMatchObject({ code: '55006' })`.
  5. La cuenta es `1`.
  6. `expect(errors).toEqual([])`.
  7. `finally`: `if (!pool.ending) await pool.end();` y después
     `await dropDatabase(name)`. Ese `DROP` es el caso de R2 y no espera más de lo
     que tarda en salir el backend.

  `ending` es público y `readonly` en `@types/pg`.
- **R2, sesión recién cerrada.**
  1. `CREATE DATABASE`.
  2. `new Pool({ connectionString })` y la sonda.
  3. `await pool.query('select 1')`.
  4. `await pool.end()`.
  5. **Inmediatamente**, sin nada en medio,
     `await expect(dropDatabase(name)).resolves.toBeUndefined()`.
  6. La cuenta es `0`.
  7. `expect(errors).toEqual([])`.
  8. `finally`: `if (!pool.ending) await pool.end();` y
     `await dropDatabase(name)`. Es un no-op gracias a `IF EXISTS`.
- **Rojo de R1 con `FORCE`.** La sesión está viva y no hay carrera.
  - El `DROP` con `FORCE` la termina y resuelve.
  - El paso 4 falla con «Received promise resolved instead of rejected».
  - El `57P01` llega a la sonda, no al proceso.
  - En el `finally`, `pool.end()` resuelve, tanto si `idleListener` ya sacó al
    cliente como si lo saca ese mismo `end()`. `dropDatabase` es un no-op
    porque la base ya no existe.
  - No queda nada huérfano.

### Por qué no es tautológico

- Los valores esperados son literales escritos a mano: `'55006'`, `1`, `0` y `[]`.
- Ninguno sale de un símbolo de producción ni de la propia función.
- R1 mira a la vez el efecto sobre el servidor (la base sigue ahí) y sobre el
  cliente (la sonda vacía). Si alguien cambiara `FORCE` por otra forma de matar
  sesiones, por ejemplo `pg_terminate_backend` antes del `DROP`, R1 seguiría
  en rojo.

### Mutaciones

- **M1 (R1 y la ancla negativa de R3).**
  - Plantar: añadir ` WITH (FORCE)` al SQL de `dropDatabase`.
  - Esperado:
    - `pnpm exec jest --config ./test/jest-e2e.json test/vaccine-catalog-migration.e2e-spec.ts`
      sale con código distinto de 0;
    - el it `#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01`
      falla con `Received promise resolved instead of rejected`;
    - `grep -cF 'WITH (FORCE)' test/vaccine-catalog-migration.e2e-spec.ts`
      devuelve `1`.
  - Restaurar: `git checkout HEAD -- test/vaccine-catalog-migration.e2e-spec.ts`.
    Luego `git diff --quiet HEAD -- test/vaccine-catalog-migration.e2e-spec.ts`
    tiene que salir con 0.
  - El R2 de esa corrida puede salir verde o rojo, porque es la carrera. No se
    exige nada de él.

No hay más mutaciones.

- Las anclas positivas de R3 (cuenta 1) fallan solas si falta el literal.
- Una mutación que quite `poolA?.end()` dejaría la base A huérfana en el Postgres
  compartido. Se descarta: el comportamiento ante una sesión viva ya lo cubre R1
  sobre una base propia.

## Archivos afectados

- `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts`. Test e2e,
  fuera de las capas. Lleva `dropDatabase`, las dos funciones del `DROP` del
  `cleanup` y el `describe` de `#237` con dos its.
- `progress/impl_backend-e2e-vaccine-catalog-teardown.md`. El reporte del
  implementador, con la evidencia de M1 y las cuentas de R3.
- `specs/backend-e2e-vaccine-catalog-teardown/traceability.md`. Se rellena al
  cerrar la cadena.

No cambian `src/`, las migraciones, `package.json` ni `pnpm-lock.yaml` (R4).

## Alternativas descartadas

- **Escuchar `'error'` en los tres pools.** Es la alternativa del plan.
  - Tapa el síntoma, y también una fuga real: el `FORCE` mataría la sesión
    filtrada y el listener se tragaría el `57P01`.
  - Para C1 haría falta `app.get(PG_POOL)` (`src/db/drizzle.constants.ts`) solo
    para enganchar el listener.
- **Esperar a que los sockets cierren antes del `DROP`.** Es la otra alternativa
  del plan: contar `pool.totalCount` y esperar otros tantos `'remove'`.
  - Es más código y necesita `PG_POOL` para C1.
  - No ve clientes que el cierre por inactividad sacó de `_clients` justo antes.
  - Con `FORCE`, una fuga real seguiría tumbando la suite.
  - Sin `FORCE`, Postgres ya hace esa espera.
- **Arreglarlo en producción**, por ejemplo con un `end()` que espere a los
  sockets o un listener en `DrizzleModule`. `DrizzlePoolLifecycle` no tiene
  ningún bug: el cierre temprano es de `pg-pool` (D3). Además, la feature es
  solo de test.
- **Helper en `backend-pet-tracker/test/`.** Solo hay un fichero usuario (D4).
  Ningún otro e2e hace `DROP DATABASE`.
- **Demostrar el rojo repitiendo la corrida.** Es una carrera sin control: no
  prueba nada. R1 la sustituye por una sesión viva de verdad, y ese rojo es
  determinista.
