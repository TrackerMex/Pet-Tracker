---
feature: "drop-devices-connectivity-column"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[drop-devices-connectivity-column]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Citas `ruta:línea` del commit base `d8e8a49c`; rutas relativas a
> `backend-pet-tracker/`.

## Decisiones técnicas

- **D1 — Una migración, una sentencia, nombre descriptivo** — sirve a R1.
  Borrar `devices.schema.ts:39` y correr `pnpm db:generate` produce
  `0016_<palabras-aleatorias>.sql` + `meta/0016_snapshot.json` + entrada
  `idx: 16` en `meta/_journal.json`. Con drizzle-kit `0.31.10` el `.sql` es
  exactamente `ALTER TABLE "devices" DROP COLUMN "connectivity";` (sin
  `IF EXISTS`: el generador no lo emite y no se edita a mano — el fichero
  generado es el candado de que el schema y el snapshot 0015 solo difieren en
  esa columna). El `.sql` se renombra a `0016_drop_devices_connectivity.sql`
  y el `tag` de la entrada `idx: 16` a `0016_drop_devices_connectivity`
  (precedente `specs/auth-forgot-password/design.md:146-154`: 0001, 0003,
  0004, 0005 y 0015 están renombradas así; el snapshot conserva su nombre
  porque va por índice). **Si el `.sql` trae otra cosa** (drift acumulado del
  schema respecto al snapshot 0015), la feature para: no es suya.

- **D2 — Inventario (a)/(b) cerrado por la pregunta "¿espeja la columna o la
  clave HTTP?"** — sirve a R1, R2. La columna y la clave comparten nombre
  pero son cosas distintas desde #73: la clave se calcula en
  `device-status.mapper.ts:32` a partir de `lastMessageAt`. Todo lo que
  **construye o lee** `Device`, `ActivePetDeviceStatus`, `DeviceRow` o la fila
  de Postgres con `connectivity` es (a) y se borra; todo lo que **asevera el
  body HTTP** es (b) y no se toca. La tabla completa está en [[requirements]]
  §Inventario; el grep de cierre (R2) está acotado a las rutas de (a) para
  que (b) pueda seguir conteniendo la palabra.

- **D3 — Codex migra la base propia del worktree, sin gate** — sirve a R3.
  Desde 2026-09-14 este worktree tiene su base `pet_tracker_wt` en el mismo
  contenedor `pet-tracker-postgres` (creada con `docker exec … psql -U
  pet_tracker -d postgres -c 'CREATE DATABASE pet_tracker_wt OWNER
  pet_tracker;'` y migrada con `pnpm db:migrate`; `DATABASE_URL` del `.env`
  gitignorado del worktree → `localhost:5433/pet_tracker_wt`, puerto
  remapeado por un `docker-compose.override.yml` gitignorado del VPS;
  `drizzle.config.ts:17` carga `../.env` solo). Su journal está al día (16
  filas, última `1787957375434`), así que `pnpm db:migrate` aplica
  exactamente 0016. Drizzle pide columnas por nombre, así que el árbol de
  #93 funciona con la columna presente (R2 se cierra **sin** aplicar) y
  también sin ella (R3, después de aplicar). Nadie más usa `pet_tracker_wt`:
  no hay autorización ni aviso que esperar. Verificación por
  `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "…"`
  — **no** `docker compose exec` (desde el worktree el proyecto compose se
  llama distinto y no encuentra el contenedor). Credenciales dummy de
  `docker-compose.yml:9-11`, nada de `.env`.

- **D4 — La base compartida `pet_tracker` queda fuera de Codex** — corrige
  C2 de [[requirements]] sin bloquear a nadie. En `pet_tracker` (tree
  principal, sesión #63) el journal de drizzle va por 0013 porque 0014 y
  0015 se aplicaron con psql crudo, y el `DROP COLUMN` rompe a cualquier
  árbol que aún declare la columna. Las dos cosas se resuelven en una
  operación única, **después** de que #63 esté mergeada a `main` (regla
  "Migraciones destructivas" de `docs/conventions.md`, sesión Frontend:
  entre el veredicto y el merge todavía quedan corridas de `init.sh`), por
  el leader o el humano, con el procedimiento de §Aplicación en el Postgres
  compartido. No se versiona nada.

- **D5 — Sin test permanente contra la base para la ausencia de la columna**
  — sirve a R3. Un e2e `select … from information_schema.columns` sería rojo
  en toda máquina sin migrar y en `pet_tracker` hasta que se migre tras el
  merge de #63; y el harness ya tiene el principio de que los repositorios
  Drizzle se cubren en e2e **de comportamiento**, no de DDL. Los candados
  permanentes de R1 son `getTableConfig(devices)` (14 columnas) y el
  contenido literal del `.sql`; la base se verifica una vez con psql
  (evidencia en el impl).

- **D6 — Los tipos pierden la propiedad; nada se hace opcional ni se
  unifica** — sirve a R1. `DeviceProps`/`Device` (`device.entity.ts`),
  `ActivePetDeviceStatus` (`pet-device-reader.ts`) y los dos mapeos de fila
  (`pet-device.drizzle.reader.ts:37`, `device.drizzle.repository.ts:139`)
  quitan la línea. `DeviceRow = typeof devices.$inferSelect` (`:21`) se
  ajusta solo. El puerto de pets queda estructuralmente idéntico a
  `DeviceStatusSource` del mapper; no se sustituye uno por otro porque pets
  no debe importar de `modules/devices/infrastructure`
  (`pet-device-reader.ts:3-6`, regla de dependencia). `tsc` es quien
  enumera el resto de sitios (fixtures): P5 de [[requirements]].

- **D7 — Comentarios: borrar, no reescribir** — sirve a R1.
  `ingestion-store.ts:47-48` explicaba que el store ya no escribe la
  columna; sin columna, la frase no tiene sujeto. La derivación sigue
  documentada en `device-status.mapper.ts:6-7`. En `devices.schema.ts:23` se
  quita solo la cláusula final. `init.sh` no cambia (C1 de [[requirements]]).

## Estructura de capas

```
backend-pet-tracker/src/db/schema/devices.schema.ts            [editado: −:39, comentario :23]          infrastructure (schema compartido)
backend-pet-tracker/src/db/schema/devices.schema.spec.ts       [editado: −:43, −:86, +describe '#93 R1'] test
backend-pet-tracker/src/db/migrations/0016_drop_devices_connectivity.sql   [nuevo, generado y renombrado]
backend-pet-tracker/src/db/migrations/meta/0016_snapshot.json  [nuevo, generado]
backend-pet-tracker/src/db/migrations/meta/_journal.json       [editado: entrada idx 16, tag renombrado]
backend-pet-tracker/src/modules/devices/domain/entities/device.entity.ts   [editado: −:19-20, −:41, −:58]  domain
backend-pet-tracker/src/modules/pets/domain/ports/pet-device-reader.ts     [editado: −:10]                domain
backend-pet-tracker/src/modules/devices/infrastructure/repositories/pet-device.drizzle.reader.ts [editado: −:37]  infrastructure
backend-pet-tracker/src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts [editado: −:139] infrastructure
backend-pet-tracker/src/workers/ingestion-store.ts             [editado: −:47-48 (comentario)]         application (puerto)
```

Capas: el domain solo pierde una propiedad (sin imports nuevos); application
no cambia de contrato salvo el tipo del puerto de pets; infrastructure deja
de mapear una columna. Sin módulos, providers ni tokens nuevos.

## Archivos afectados

Código (R1, todo en el commit verde salvo el spec del schema, que va en el rojo):

- `backend-pet-tracker/src/db/schema/devices.schema.ts` — infrastructure; `:39` fuera, `:23` sin "; `connectivity` queda NULL".
- `backend-pet-tracker/src/db/schema/devices.schema.spec.ts` — test; `:43` y `:86` fuera; `describe('#93 R1: …')` al final (**commit rojo**).
- `backend-pet-tracker/src/db/migrations/0016_drop_devices_connectivity.sql` — nuevo (D1).
- `backend-pet-tracker/src/db/migrations/meta/0016_snapshot.json` — nuevo, generado.
- `backend-pet-tracker/src/db/migrations/meta/_journal.json` — entrada `idx: 16`, `tag` renombrado.
- `backend-pet-tracker/src/modules/devices/domain/entities/device.entity.ts` — domain; `:19-20`, `:41`, `:58` fuera.
- `backend-pet-tracker/src/modules/pets/domain/ports/pet-device-reader.ts` — domain; `:10` fuera.
- `backend-pet-tracker/src/modules/devices/infrastructure/repositories/pet-device.drizzle.reader.ts` — infrastructure; `:37` fuera.
- `backend-pet-tracker/src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts` — infrastructure; `:139` fuera.
- `backend-pet-tracker/src/workers/ingestion-store.ts` — comentario `:47-48` fuera (D7).
- `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.spec.ts:37`, `get-pet-device.use-case.spec.ts:19`, `release-device.use-case.spec.ts:23` — fixtures `buildDevice` (forzado por `tsc`).
- `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.spec.ts:104,121` — mock del puerto y `toEqual`.
- `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.spec.ts:219,243,261` — input del mock (aserciones intactas).
- `backend-pet-tracker/test/provision-device.e2e-spec.ts:144`, `test/resource-isolation.e2e-spec.ts:131`, `test/alerts-engine.e2e-spec.ts:136`, `test/ingestion.e2e-spec.ts:89,218` — una línea cada uno.

Docs y harness:

- `docs/data-model.md:53` — fila `devices` (texto exacto en [[requirements]] R1) — commit docs de R1.
- `progress/impl_drop-devices-connectivity-column.md` — evidencias de R1 (salida de `db:generate`), R2 (suites, greps, `diff --stat`) y R3 (`db:migrate` ×2 contra `pet_tracker_wt`, psql, `db:generate` no-op, e2e antes/después, `init.sh`).
- `specs/drop-devices-connectivity-column/traceability.md` — tras cada commit.

**No se tocan**: `src/modules/devices/domain/connectivity.ts` y su spec,
`device-status.mapper.ts` y su spec, `pets.controller.ts`,
`devices.controller.ts`, `claim-device.use-case.ts`, `release-device.use-case.ts`,
`get-pet.use-case.ts`, `ingestion.drizzle.store.ts`, `positions-consumer.service.ts`,
`scripts/*`, `src/db/schema/index.ts`, `drizzle.config.ts`, migraciones y
snapshots `0000`…`0015`, `test/devices.e2e-spec.ts`,
`test/device-subscriptions.e2e-spec.ts`, `test/device-connectivity.e2e-spec.ts`,
`init.sh`, `init.config.sh`, `.github/workflows/ci.yml`, `docs/conventions.md`,
`docs/ui-guidelines.md`, `plans/`, nada de `mobile-pet-tracker/`. Sin
dependencias ni env nuevas.

## Alternativas descartadas

- **Aplicar 0016 con psql crudo (`psql < 0016.sql`), como se hizo con 0014 y
  0015**: descartado — en `pet_tracker_wt` el journal está al día y
  `pnpm db:migrate` es el camino de `docs/conventions.md:216`; en
  `pet_tracker` perpetuaría el journal roto (C2) e impediría verificar la
  idempotencia. La reparación de §Aplicación en el Postgres compartido
  cuesta dos filas.
- **Marcar 0014/0015 como aplicadas editando `meta/_journal.json`** o
  regenerando snapshots: descartado — el journal del repo es correcto; lo
  desincronizado es la **tabla** del Postgres local. Nada de versionar
  parches por un entorno.
- **Escribir el `.sql` a mano con `DROP COLUMN IF EXISTS`**: descartado — el
  fichero generado es la prueba de que el schema TypeScript y el snapshot
  solo difieren en esa columna; a mano se pierde esa garantía y el snapshot
  no se generaría igual.
- **Añadir `pnpm db:migrate` a `init.sh`** (para cumplir el criterio 1
  literal): descartado — harness y CI (sin Postgres) fuera de alcance de una
  P3 de deuda; C1 lo corrige por escrito.
- **E2e permanente que consulte `information_schema.columns`**: descartado
  (D5).
- **`it` unitario `expect(new Device(...)).not.toHaveProperty('connectivity')`**
  como rojo propio de la entidad: descartado — el candado del schema (R1) ya
  impide que vuelva la columna, y sin columna nadie puede alimentar la
  propiedad; sería un test de la forma de un fixture.
- **Requisito propio para cada capa (schema / entidad / puerto / reader)**:
  descartado — con la columna fuera del schema, `tsc` (P5) obliga a tocar el
  resto en el mismo commit; partirlo en varios `feat` dejaría commits
  intermedios con el typecheck rojo, que `init.sh` no acepta.
- **Reescribir el comentario de `ingestion-store.ts:47-48`** apuntando a la
  derivación: descartado (D7) — ya lo hace el mapper, y la regla del repo es
  borrar lo huérfano (C7).
- **Renombrar `ActivePetDeviceStatus` → reutilizar `DeviceStatusSource`**:
  descartado (D6, regla de dependencia entre módulos).

## Aplicación en el Postgres compartido (tree principal) — operativa, fuera del alcance de Codex

Quién: el leader o el humano. Cuándo: **solo después** de que la branch de
#63 esté mergeada a `main` (regla "Migraciones destructivas" de
`docs/conventions.md`, sesión Frontend). Dónde: desde
`/home/claude/sites/Pet-Tracker/backend-pet-tracker/`, cuyo `.env` apunta a
`pet_tracker`. Nada de esto se versiona ni entra en la trazabilidad de #93.

1. Estado previo (esperado `14|1787066723656`, C2):
   `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"`
2. Reparar el journal — `hash` = sha256 del `.sql` (así lo calcula drizzle;
   recomputar con `sha256sum src/db/migrations/0014_late_lord_tyger.sql src/db/migrations/0015_auth_password_reset_tokens.sql`
   y usar lo que salga si difiere: drizzle no compara el hash, solo el
   `created_at`), `created_at` = `when` de cada entrada de `meta/_journal.json`:

   ```sql
   INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES
     ('01507aa79dcece651ffbf3534dbfb2955c24aa7017fbf68ae0535442795105aa', 1787685275503),
     ('216a6a34700b211e6d219ae37d37566872abd418b6cad65f1c05f62f54a93b51', 1787957375434);
   ```

   Comprobar `16|1787957375434`.
3. `pnpm db:migrate` (aplica solo 0016; el migrator de drizzle-orm,
   `node_modules/drizzle-orm/pg-core/dialect.js:57-67`, aplica en una
   transacción todo `when > max(created_at)`).
4. Comprobar `17` filas y `0` en
   `select count(*) from information_schema.columns where table_schema='public' and table_name='devices' and column_name='connectivity'`.
5. Segundo `pnpm db:migrate`: exit 0, sigue en 17.

Cualquier otra máquina con 0014/0015 aplicadas a mano (Windows del humano)
necesita el paso 2 antes de su primer `pnpm db:migrate`; una base creada
desde cero con `pnpm db:migrate` no lo necesita.
