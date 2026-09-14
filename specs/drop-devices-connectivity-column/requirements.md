---
feature: "drop-devices-connectivity-column"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[drop-devices-connectivity-column]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` #93 (`description` + 4 `acceptance_criteria` +
> `files_affected`), `specs/pet-online-pill/requirements.md` §Fuera de alcance
> (:687-689, "Migración que borre `devices.connectivity`") y
> `specs/device-telemetry-reset-on-reassign/requirements.md` D2 + §0.1 P8/P10
> (mapa de lectores del device). Toda cita se re-verificó contra este árbol
> (§0); las que no cuadraban se corrigen en §0.2 y el implementador construye
> sobre la versión corregida.
>
> Feature **backend puro** (`backend-pet-tracker/`): suites `pnpm test` (unit)
> y `pnpm test:e2e` (Postgres + LocalStack reales). No toca
> `mobile-pet-tracker/` ni `docs/ui-guidelines.md`. **Una migración
> (`0016`), cero dependencias nuevas, cero env nuevas, cero cambios de
> contrato HTTP** (las 5 claves de `toDeviceStatusResponse` siguen iguales y
> `connectivity` sigue derivándose en lectura; solo desaparece la columna).
>
> Depende de: `pet-online-pill` (#73, `done`) — dejó la columna sin escritor
> y la declaró obsoleta; `device-telemetry-reset-on-reassign` (#92, `done`,
> mergeado en `d8e8a49c`) — decidió qué columnas resetea el claim
> (`battery_pct`, `last_message_at`) y **no** tocó `connectivity` para que
> la borre esta feature (su D2).
>
> Rutas relativas al repo (`backend-pet-tracker/…`); dentro de un bloque
> claramente backend se omite el prefijo. Toda cita `ruta:línea` es del commit
> base `d8e8a49c` (`origin/main`, branch
> `feature/93-drop-devices-connectivity-column`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`). **Postgres de este
> worktree = base propia `pet_tracker_wt`** en el contenedor
> `pet-tracker-postgres` (host `localhost:5433`, remapeado por un
> `docker-compose.override.yml` gitignorado del VPS; `DATABASE_URL` en el
> `.env` gitignorado del worktree; `drizzle.config.ts:17` la carga sola).
> La base compartida `pet_tracker` es del tree principal
> (`/home/claude/sites/Pet-Tracker`, sesión #63) y **Codex no la toca**
> ([[design]] §Aplicación en el Postgres compartido). LocalStack (`:4566`)
> sí sigue compartido entre sesiones.

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Veredicto | Evidencia leída |
|---|---|---|---|
| P1 | Nadie escribe `devices.connectivity` | **cierta** | `grep -rn connectivity src/` → 15 ficheros, ninguno con un `.set({ connectivity` ni `insert` con la clave. `src/workers/ingestion.drizzle.store.ts` no la menciona (el write `'online'` lo borró #73 R4); `claim` (`src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts:74-110`) y `release` (`:112-125`) no la tocan; `scripts/*.ts` → 0 menciones (P4) |
| P2 | La columna vive en 5 sitios de producción | **cierta, y hay más lectores** | `src/db/schema/devices.schema.ts:39` (`connectivity: varchar('connectivity', { length: 20 })`) + comentario `:23`; `src/modules/devices/domain/entities/device.entity.ts:19-20,41,58`; `src/modules/pets/domain/ports/pet-device-reader.ts:10`; `src/modules/devices/infrastructure/repositories/pet-device.drizzle.reader.ts:37`; **además** `device.drizzle.repository.ts:139` (`toDomain`, sobre `DeviceRow = typeof devices.$inferSelect`, `:21`) y el comentario del puerto `src/workers/ingestion-store.ts:47-48`. Inventario completo en §Inventario |
| P3 | El contrato HTTP deriva `connectivity` y no depende de la columna | **cierta** | `src/modules/devices/infrastructure/mappers/device-status.mapper.ts:9-14` (`DeviceStatusSource` **sin** `connectivity`), `:32` (`deriveConnectivity(source.lastMessageAt, now)`); `src/modules/devices/domain/connectivity.ts:7-18`; `src/modules/pets/infrastructure/pets.controller.ts:110` pasa el `ActivePetDeviceStatus` al mapper — el paso estructural con una propiedad de más era válido y con una de menos también lo es (el mapper solo lee `model/batteryPct/lastMessageAt/esn`) |
| P4 | Ni seeds ni scripts tocan la columna | **cierta** | `grep -rln connectivity backend-pet-tracker --include='*.ts' --exclude-dir=node_modules --exclude-dir=dist` → nada en `scripts/`; `scripts/seed-devices.ts` inserta identificadores/`status`/`model` (#92 P7) |
| P5 | Quitar la columna rompe el typecheck en todo lo que la construye | **cierta** | `TYPECHECK_CMD="pnpm -C backend-pet-tracker exec tsc --noEmit"` (`init.config.sh:27`) con `tsconfig.json` **sin** `include`/`exclude` ⇒ cubre `src/**/*.spec.ts` y `test/**`. Verificado con `tsc` 5.x: un literal `{ …, connectivity: null, ...overrides }` contra un tipo sin la propiedad da `TS2353` **aunque lleve spread**; lo mismo para `.set({ connectivity: null })` de drizzle. `ts-jest` corre con `isolatedModules: true` (transpile-only) ⇒ `pnpm test` **no** detecta errores de tipo: el gate es `tsc` |
| P6 | Con la columna todavía en Postgres, el código sin la columna funciona | **cierta** | Drizzle solo pide las columnas declaradas en el `pgTable` (`select().from(devices)` y `select({ device: devices })` enumeran columnas, nunca `*`) ⇒ los e2e de #93 son verdes **con o sin** la migración aplicada. Al revés no: tras el `DROP COLUMN`, cualquier árbol que aún declare la columna (origin/main pre-#93, tree principal) falla con `column "connectivity" does not exist` — por eso la base **compartida** `pet_tracker` solo se migra tras el merge de #63 ([[design]] §Aplicación en el Postgres compartido); en `pet_tracker_wt` no hay nadie más |
| P7 | Nombrado de migraciones | **cierta** | `drizzle.config.ts:31-33` (`schema: src/db/schema/index.ts`, `out: src/db/migrations`); 16 `.sql` (`0000`…`0015`) + `meta/0000…0015_snapshot.json` + `meta/_journal.json` (última entrada `idx: 15`, `tag: "0015_auth_password_reset_tokens"`, `when: 1787957375434`). Precedente de renombrado: `specs/auth-forgot-password/design.md:146-154` (el `.sql` generado se renombra y se ajusta el `tag`; el snapshot conserva su nombre por índice). `meta/0015_snapshot.json` `tables['public.devices'].columns` lista `connectivity` `{type: 'varchar(20)', notNull: false}`. drizzle-kit `0.31.10` emite `ALTER TABLE "<t>" DROP COLUMN "<c>";` (sin `IF EXISTS`) |
| P8 | El candado de `devices.schema.spec.ts` no se confunde con la 0016 | **cierta** | `readDevicesMigrationSql()` (`:9-24`) busca el `.sql` que contiene `CREATE TABLE "devices"` (la 0004); la 0016 solo tiene `ALTER TABLE "devices"` ⇒ el `describe` `:180-202` sigue verde sin tocarlo. Patrón para leer un `.sql` por nombre: `src/db/schema/password-reset-tokens.schema.spec.ts:9-19` |
| P9 | Docs que mencionan la columna | **cierta** | `docs/data-model.md:53` es la única línea (fila `devices`: columna en la lista + nota "obsoleta desde #73"); el ERD (`:21-38`) no lista columnas. `docs/ui-guidelines.md:284-285` habla del **campo HTTP** en el móvil (se queda). `plans/001:91` y `plans/005:70` son históricos (no se editan) |
| P10 | Verificación en Postgres sin imprimir credenciales | **cierta, con `docker exec`** | El precedente `progress/impl_auth-forgot-password.md:70-77` usa `docker compose exec -T postgres …`, que **no funciona desde el worktree** (otro nombre de proyecto compose). Forma válida aquí: `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "…"` (usuario dummy de `docker-compose.yml:9-11`, versionado; no se lee `.env`). Estado verificado 2026-09-14 en `pet_tracker_wt`: `drizzle.__drizzle_migrations` 16 filas, `max(created_at)` = `1787957375434` (0015), 20 tablas, columna `connectivity` presente |

### §0.2 Premisas corregidas (el implementador no construye sobre la versión anterior)

| # | Premisa (origen) | Corrección | Evidencia |
|---|---|---|---|
| C1 | Criterio 1: migración "aplicada por `init.sh` sin intervención manual" | **Falsa**: `init.sh` e `init.config.sh` **no corren migraciones** (`grep -n migrate init.sh init.config.sh` → 0; `init.config.sh:24-32` solo build/test/lint/typecheck/e2e). Se aplica a mano con `pnpm db:migrate` desde `backend-pet-tracker/` (`docs/conventions.md:216-220`). **No** se añade paso de migración a `init.sh` (cambio de harness, §Fuera de alcance). El criterio se lee como "generada con `pnpm db:generate` y aplicable con `pnpm db:migrate`" (R1, R3) | `init.config.sh:24-32`; `docs/conventions.md:216` |
| C2 | "Se aplica con `pnpm db:migrate`" presupone un journal de Postgres al día | **Falsa en la base compartida `pet_tracker` (tree principal); cierta en la de Codex**: `drizzle.__drizzle_migrations` tiene **14 filas** (`idx` 1-14) y su última `created_at` es `1787066723656` = `when` de **0013**. 0014 (`when 1787685275503`) y 0015 (`1787957375434`) se aplicaron con psql crudo (`progress/impl_auth-forgot-password.md:70-72`) y no quedaron registradas. El migrator (`node_modules/drizzle-orm/pg-core/dialect.js:57-67`) aplica **en una sola transacción** toda migración con `folderMillis > última created_at` ⇒ intentaría 0014 (`CREATE TABLE "pet_documents"`, que ya existe) → error → rollback: **0016 nunca se aplicaría**. Corrección: Codex trabaja contra `pet_tracker_wt`, cuyo journal está al día (16 filas, P10): ahí `pnpm db:migrate` aplica **solo** 0016. La reparación de `pet_tracker` (dos `INSERT`) es operativa, fuera del alcance de Codex, y vive en [[design]] §Aplicación en el Postgres compartido (D4) | consulta de solo lectura `select id, created_at from drizzle.__drizzle_migrations order by created_at` sobre `pet_tracker` y sobre `pet_tracker_wt` (2026-09-14); `meta/_journal.json` |
| C3 | Lista del leader de candados "siguen verdes sin tocarlos": incluía `test/ingestion.e2e-spec.ts` | **Cambia**: `:89` (`connectivity: null` dentro de `.set()` sobre `devices` → `TS2353`) y `:218` (`expect(deviceRow.connectivity).toBeNull()` → tras el DROP la propiedad es `undefined` y el `toBeNull()` falla en runtime). Los intactos son **tres**: `test/devices.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts`, `test/device-connectivity.e2e-spec.ts` (solo leen bodies HTTP). También cambian `test/provision-device.e2e-spec.ts:144` (`toMatchObject` de la fila con `connectivity: null` → propiedad ausente ≠ `null`), `test/resource-isolation.e2e-spec.ts:131` y `test/alerts-engine.e2e-spec.ts:136` (`.set()`) | `cat -n` de los cuatro ficheros; P5 |
| C4 | `description`: "limpiar los cinco sitios" | Son **más**: 6 de producción (P2 + `toDomain` + comentario de `ingestion-store.ts`), 5 specs unitarias con fixtures, 4 e2e con fixtures/aserciones de fila, 1 doc. Inventario exhaustivo en §Inventario; el candado de cierre es un grep (R2) | §Inventario |

---

## Decisiones cerradas (el humano ratifica o cambia en §Aprobación)

| Id | Decisión | Detalle en |
|---|---|---|
| **D1** | **Una migración, una sentencia.** `pnpm db:generate` sobre el schema sin la columna; el `.sql` se renombra a `0016_drop_devices_connectivity.sql` y el `tag` de `idx: 16` en `meta/_journal.json` pasa a `0016_drop_devices_connectivity` (precedente 0015); `meta/0016_snapshot.json` conserva su nombre. Contenido **exacto** del `.sql`: `ALTER TABLE "devices" DROP COLUMN "connectivity";`. Si `db:generate` emite **cualquier otra sentencia**, el schema tiene drift acumulado ajeno a #93: **parar**, no commitear, reportar en el impl | [[design]] D1 |
| **D2** | **Inventario cerrado (a)/(b).** (a) se borra: todo lo que espeja la **columna** (schema, spec del schema, entidad, puerto, reader, `toDomain`, comentarios, fixtures que construyen esos tipos, aserciones e2e sobre la **fila**). (b) se queda intacto: todo lo que espeja la **clave HTTP** derivada (`deriveConnectivity`, mapper y su spec, aserciones sobre bodies en e2e y controller spec, móvil). Tabla en §Inventario; nada fuera de ella se toca | [[design]] D2 |
| **D3** | **Codex migra su propia base, sin gate.** Genera y commitea la migración, corre `pnpm test:e2e` **sin** aplicarla (verde esperado por P6), la aplica con `pnpm db:migrate` contra `pet_tracker_wt` (la `DATABASE_URL` del `.env` del worktree) y vuelve a correr `pnpm test:e2e` (verde). No necesita autorización ni coordinación: en esa base no hay otra sesión | [[design]] D3 |
| **D4** | **La base compartida `pet_tracker` no la toca Codex.** Su journal va por 0013 (C2): antes de su primer `pnpm db:migrate` hay que insertar a mano las filas de 0014/0015, y el `DROP COLUMN` rompe al tree principal mientras declare la columna. Ambas cosas las hace el leader o el humano **después** de que #63 esté mergeada a `main` (regla "Migraciones destructivas" de `docs/conventions.md` de la sesión Frontend, aún no mergeada en esta branch), con el SQL de [[design]] §Aplicación en el Postgres compartido | [[design]] D4 y §Aplicación en el Postgres compartido |
| **D5** | **Sin e2e permanente que asevere la ausencia de la columna en Postgres.** Acoplaría la suite al estado de la base (rojo en cualquier máquina sin migrar y en `pet_tracker` hasta que se migre tras el merge de #63). Los candados permanentes son el schema Drizzle (`getTableConfig`) y el contenido del `.sql` (R1); la ausencia real se verifica **una vez** con psql y queda en el impl (R3, verificación) | [[design]] D5 |
| **D6** | **`ActivePetDeviceStatus` y `Device` pierden la propiedad; ningún tipo nuevo, ninguna propiedad opcional.** `DeviceStatusSource` (mapper) ya no la tiene; el puerto pasa a ser estructuralmente igual a él salvo por nada — no se unifican (son de módulos distintos, `pet-device-reader.ts:3-6`) | [[design]] D6 |
| **D7** | **El comentario de `ingestion-store.ts:47-48` se borra**, no se reescribe: la derivación ya está documentada en `device-status.mapper.ts:6-7`. `init.sh` no cambia | [[design]] D7 |

---

## Inventario de referencias a `connectivity` (grep del árbol base; cada línea clasificada)

### (a) Se borra — espejo de la columna

| Fichero:línea | Qué hay | Qué queda |
|---|---|---|
| `src/db/schema/devices.schema.ts:39` | `connectivity: varchar('connectivity', { length: 20 }),` | línea eliminada |
| `src/db/schema/devices.schema.ts:23` | `… alimente y vuelven a NULL en cada claim (#92); \`connectivity\` queda NULL.` | `… alimente y vuelven a NULL en cada claim (#92).` |
| `src/db/schema/devices.schema.spec.ts:43` | `'connectivity',` en la lista exacta de columnas | línea eliminada (lista de **14**) |
| `src/db/schema/devices.schema.spec.ts:86` | `expect(columns.get('connectivity')?.notNull).toBe(false);` | línea eliminada |
| `src/modules/devices/domain/entities/device.entity.ts:19-20` | doc + `connectivity: string \| null;` en `DeviceProps` | eliminadas |
| `src/modules/devices/domain/entities/device.entity.ts:41` | `readonly connectivity: string \| null;` | eliminada |
| `src/modules/devices/domain/entities/device.entity.ts:58` | `this.connectivity = props.connectivity;` | eliminada |
| `src/modules/pets/domain/ports/pet-device-reader.ts:10` | `connectivity: string \| null;` en `ActivePetDeviceStatus` | eliminada |
| `src/modules/devices/infrastructure/repositories/pet-device.drizzle.reader.ts:37` | `connectivity: row.device.connectivity ?? null,` | eliminada |
| `src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts:139` | `connectivity: row.connectivity ?? null,` en `toDomain` | eliminada |
| `src/workers/ingestion-store.ts:47-48` | `* connectivity no se escribe desde #73: se deriva en lectura` + `* (modules/devices/domain/connectivity.ts).` | eliminadas (D7) |
| `src/modules/devices/application/use-cases/claim-device.use-case.spec.ts:37` | `connectivity: null,` en `buildDevice` | eliminada (forzada por `tsc`, P5) |
| `src/modules/devices/application/use-cases/get-pet-device.use-case.spec.ts:19` | ídem | eliminada |
| `src/modules/devices/application/use-cases/release-device.use-case.spec.ts:23` | ídem | eliminada |
| `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts:104` | `connectivity: null,` en el valor que resuelve `findActiveDevice` (tipado `PetDeviceReader`, `:44`) | eliminada (forzada por `tsc`) |
| `src/modules/pets/application/use-cases/get-pet.use-case.spec.ts:121` | `connectivity: null,` en el `toEqual` de `profile.device` | eliminada (si queda, el `toEqual` falla: propiedad ausente ≠ `null`) |
| `src/modules/pets/infrastructure/pets.controller.spec.ts:219,243,261` | `connectivity: null,` en el `device` que resuelve `getExecute` (mock **sin tipo**, `:46-49`) | eliminadas (no las fuerza `tsc`; se quitan porque ya no son la forma del puerto). **Las aserciones `:230,251,269` sobre `response.device` NO se tocan** |
| `test/provision-device.e2e-spec.ts:144` | `connectivity: null,` en el `toMatchObject` de la fila de `devices` | eliminada (runtime: propiedad ausente ≠ `null`) |
| `test/resource-isolation.e2e-spec.ts:131` | `connectivity: null,` en `.update(devices).set({…})` | eliminada (`TS2353`) |
| `test/alerts-engine.e2e-spec.ts:136` | ídem | eliminada |
| `test/ingestion.e2e-spec.ts:89` | ídem | eliminada |
| `test/ingestion.e2e-spec.ts:218` | `expect(deviceRow.connectivity).toBeNull(); // #73 R4: nadie escribe la columna` | eliminada (`:219-222` intactas) |
| `docs/data-model.md:53` | `connectivity` en la lista de columnas + frase "`connectivity` está **obsoleta desde #73**: … Su borrado por migración es feature aparte." | ver R1 (texto nuevo) |

### (b) Se queda intacto — espejo de la clave HTTP derivada

| Fichero:línea | Qué fija |
|---|---|
| `src/modules/devices/domain/connectivity.ts` (entero) + `connectivity.spec.ts` | `deriveConnectivity(lastMessageAt, now)` (#73 G1/G2) |
| `src/modules/devices/infrastructure/mappers/device-status.mapper.ts:1,6-7,19,32` | clave `connectivity` derivada en `DeviceStatusResponse` |
| `src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts:4,21,26,43,46,58` | 5 claves y derivación `online/offline/null` |
| `src/modules/pets/infrastructure/pets.controller.spec.ts:211-212,230,251,254,269` | el detalle serializa `connectivity` derivada |
| `test/devices.e2e-spec.ts:279,319,750,849,1038,1078,1123` | `CLAIM_KEYS` y bodies del 201/`GET …/device`/perfil (`connectivity: null` **como valor HTTP**, `'online'` tras el primer mensaje) |
| `test/device-subscriptions.e2e-spec.ts:355` | 5 claves de `device` en el perfil |
| `test/device-connectivity.e2e-spec.ts` (entero) | #73 R3: derivación `null`/`offline`/`online` por siembra de `last_message_at` |
| `src/db/migrations/0004_devices_claim_tables.sql:11` y `meta/0004…0015_snapshot.json` | historia de migraciones: **jamás** se editan |
| `docs/ui-guidelines.md:284-285`, `mobile-pet-tracker/**` | campo HTTP en el móvil |
| `plans/001-paquete-diseno-aprobacion.md:91`, `plans/005-collar-wialon-ingesta.md:55,70` | planes históricos |

**Candado del inventario** (R2): desde `backend-pet-tracker/`,
`grep -rn "connectivity" src/db/schema src/modules/devices/domain/entities src/modules/pets/domain/ports src/modules/devices/infrastructure/repositories src/workers scripts` → **0 líneas**;
`grep -rn "connectivity: null" src` → **0 líneas**;
`grep -rn "deviceRow\.connectivity\|row\.connectivity\|device\.connectivity" src test` → **0 líneas**.
(Los ficheros de (b) siguen conteniendo la palabra; el grep no los cubre a propósito.)

---

## Requisitos funcionales

### R1 — la columna desaparece del schema Drizzle, de la migración 0016 y de los tipos que la espejan

**WHEN** se ejecuta `pnpm db:generate` desde `backend-pet-tracker/` sobre
`src/db/schema/devices.schema.ts` sin la línea `:39`,
**THE SYSTEM SHALL** dejar en `src/db/migrations/` exactamente tres cambios:
`0016_drop_devices_connectivity.sql` (renombrado, D1) cuyo contenido, sin
espacios en blanco de borde, es **exactamente**
`ALTER TABLE "devices" DROP COLUMN "connectivity";`;
`meta/0016_snapshot.json` (generado, con `prevId` = `id` de `0015_snapshot.json`,
`4464bafc-df5e-4d81-ac7b-554ca9fd615f`, y `tables['public.devices'].columns`
**sin** clave `connectivity`); y una entrada nueva en `meta/_journal.json`
con `idx: 16` y `tag: "0016_drop_devices_connectivity"`;

**AND** `getTableConfig(devices).columns` **SHALL** tener exactamente estas
14 columnas: `id, esn, imei, serial_number, activation_code, wialon_unit_id,
model, status, battery_pct, last_message_at, ingest_watermark, is_simulated,
created_at, updated_at`;

**AND** `Device` (`DeviceProps` y la clase), `ActivePetDeviceStatus`,
`PetDeviceDrizzleReader.findActiveDevice` y `toDomain` de
`DeviceDrizzleRepository` **SHALL NOT** declarar ni asignar `connectivity`
(filas (a) de §Inventario), de modo que `pnpm exec tsc --noEmit`, `pnpm lint`,
`pnpm test` y `pnpm test:e2e` terminan verdes **sin haber aplicado la
migración a Postgres** (P6);

**AND** `docs/data-model.md:53` (fila `devices`) **SHALL** quitar
`connectivity` de la lista de columnas y sustituir la frase que empieza en
"`connectivity` está **obsoleta desde #73**" y acaba en "feature aparte." por:
*"El `connectivity` que sirve la API no es columna: se deriva en lectura de
`last_message_at` contra el reloj del servidor con `DEVICE_ONLINE_THRESHOLD_MS`
(`src/pipeline/constants.ts`) desde #73; la columna se borró en #93
(migración `0016`)."*

IF `pnpm db:generate` emite más de una sentencia, o una sentencia distinta,
THEN el implementador **SHALL** parar sin commitear y reportar la salida en
`progress/impl_drop-devices-connectivity-column.md` §R1 (D1: drift ajeno).

**Test (rojo primero)** — `src/db/schema/devices.schema.spec.ts`, tres deltas
en el **mismo commit rojo**:

1. `:30-51` `it('se llama devices y tiene exactamente las columnas de la spec')`:
   quitar `'connectivity',` (`:43`) de la lista. **Rojo legítimo de R1**: el
   `toEqual` recibe 15 claves (con `connectivity`) y espera 14 — cae **por su
   aserción** con el schema del árbol base.
2. `:82-92`: quitar `:86` (`expect(columns.get('connectivity')?.notNull).toBe(false);`).
   No cambia el color del `it`; se quita porque asevera una columna que deja
   de existir.
3. Nuevo, al final del fichero:
   `describe('#93 R1: la migracion 0016 borra devices.connectivity y nada mas')`
   con un `it('0016_drop_devices_connectivity.sql contiene exactamente el DROP COLUMN')`
   que lee `join(MIGRATIONS_DIR, '0016_drop_devices_connectivity.sql')` con
   `readFileSync(…, 'utf8')` (patrón de `password-reset-tokens.schema.spec.ts:9-19`;
   `MIGRATIONS_DIR` ya existe en `:6`) y asevera
   `expect(sql.trim()).toBe('ALTER TABLE "devices" DROP COLUMN "connectivity";')`.
   En el commit rojo cae porque el fichero no existe: es el **artefacto bajo
   prueba**, no un helper (precedente #44 R12, `specs/auth-forgot-password/tasks.md:35-40`);
   el rojo que demuestra el candado es el del punto 1.

Verde: `pnpm test -- devices.schema` tras el commit `feat` de [[tasks]] R1 (2).

### R2 — el contrato HTTP y la derivación no cambian; el inventario está limpio (verificación)

**WHILE** la migración 0016 está commiteada y **no** aplicada a
`pet_tracker_wt`,
**WHEN** se ejecutan `pnpm test` y `pnpm test:e2e` desde `backend-pet-tracker/`,
**THE SYSTEM SHALL** terminar verde con **todos** los ficheros de §Inventario
(b) sin editar (`git diff --stat origin/main -- <fichero>` vacío para cada
uno) — en particular `test/devices.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts`,
`test/device-connectivity.e2e-spec.ts`, `device-status.mapper.spec.ts` y
`connectivity.spec.ts` —, con `GET /v1/pets/:petId/device`, el 201 del claim y
la clave `device` del perfil respondiendo las mismas 5 claves
(`model, batteryPct, connectivity, lastMessageAt, esn`);

**AND** los tres `grep` de "Candado del inventario" (§Inventario) **SHALL**
devolver 0 líneas;

**AND** `git diff --stat origin/main` **SHALL** listar únicamente los ficheros
de [[design]] §Archivos afectados.

**Requisito de verificación** (C4 de `CHECKPOINTS.md`, tercer punto, vía
**(b)**): no hay test nuevo — los candados **son** los tests existentes de
(b), que ya vigilan las 5 claves y la derivación, y esta feature solo debe
dejarlos intactos. Cierre = salida de las dos suites (exit 0, medido **sin
pipe**) + los tres `grep` con `| wc -l` = 0 + el `diff --stat`, todo pegado en
`progress/impl_drop-devices-connectivity-column.md` §R2. No hay cifra de
candado absoluta que se mueva en `backend-pet-tracker/` (la única lista
cerrada, la de columnas de `devices.schema.spec.ts`, la mueve R1 en −1
elemento y queda en 14).

### R3 — la migración se aplica a `pet_tracker_wt` con `pnpm db:migrate`, es idempotente y el árbol sigue verde (verificación)

**WHILE** `pnpm test:e2e` es verde con la migración 0016 commiteada y **sin**
aplicar (R2) y `drizzle.__drizzle_migrations` de `pet_tracker_wt` tiene 16
filas con `max(created_at)` = `1787957375434` (P10),
**WHEN** se ejecuta `pnpm db:migrate` desde `backend-pet-tracker/`,
**THE SYSTEM SHALL** terminar con exit 0 y dejar en `pet_tracker_wt`
`information_schema.columns` **sin** fila `(table_schema='public',
table_name='devices', column_name='connectivity')` y
`drizzle.__drizzle_migrations` con **17** filas (la nueva con
`created_at` = `when` de `idx: 16`);

**AND** un **segundo** `pnpm db:migrate` inmediato **SHALL** terminar con exit
0 **sin** aplicar nada (sigue en 17 filas; la columna sigue ausente);

**AND** `pnpm db:generate` inmediato **SHALL NOT** crear ningún fichero
(`git status --porcelain src/db/migrations` vacío) — el snapshot 0016 y el
schema coinciden;

**AND** `pnpm test:e2e` y `./init.sh` (desde la raíz, exit 0 medido **sin
pipe**) **SHALL** terminar verdes con la columna ya ausente.

**Requisito de verificación** (C4 vía (b)): asevera propiedades del artefacto
que R1 dejó en el árbol, contra la base propia del worktree; no tiene test
versionado (D5). Comandos exactos en [[tasks]] R3 (`docker exec
pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "…"`, sin
credenciales); evidencia (salida de cada uno) en
`progress/impl_drop-devices-connectivity-column.md` §R3. La base compartida
`pet_tracker` **no** forma parte de R3 (D4).

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero:línea | Antes | Después | Por | Commit |
|---|---|---|---|---|
| `src/db/schema/devices.schema.spec.ts:43` | `'connectivity',` | (línea eliminada; lista de 14) | R1 | rojo |
| `src/db/schema/devices.schema.spec.ts:86` | `expect(columns.get('connectivity')?.notNull).toBe(false);` | (eliminada) | R1 | rojo |
| `src/db/schema/devices.schema.spec.ts` (final) | — | `describe('#93 R1: …')` que lee `0016_drop_devices_connectivity.sql` | R1 | rojo |
| `claim-device.use-case.spec.ts:37`, `get-pet-device.use-case.spec.ts:19`, `release-device.use-case.spec.ts:23` | `connectivity: null,` en `buildDevice` | (eliminada) | R1 (forzado por `tsc`) | verde |
| `get-pet.use-case.spec.ts:104,121` | `connectivity: null,` | (eliminadas) | R1 | verde |
| `pets.controller.spec.ts:219,243,261` | `connectivity: null,` (input del mock) | (eliminadas) | R1 | verde |
| `test/provision-device.e2e-spec.ts:144` | `connectivity: null,` | (eliminada) | R1 | verde |
| `test/resource-isolation.e2e-spec.ts:131`, `test/alerts-engine.e2e-spec.ts:136`, `test/ingestion.e2e-spec.ts:89` | `connectivity: null,` en `.set()` | (eliminadas) | R1 | verde |
| `test/ingestion.e2e-spec.ts:218` | `expect(deviceRow.connectivity).toBeNull(); // #73 R4…` | (eliminada) | R1 | verde |

### Siguen verdes sin tocarlos (si alguno se pone rojo, la implementación está mal, no el candado)

| Candado | Qué fija |
|---|---|
| `src/db/schema/devices.schema.spec.ts:53-80,94-104,107-178,180-202` | PK, identificadores UNIQUE, `status` CHECK, `is_simulated`, `pet_devices`, y el SQL de la **0004** (P8) |
| `src/modules/devices/infrastructure/mappers/device-status.mapper.spec.ts` | #73 R2: 5 claves y derivación |
| `src/modules/devices/domain/connectivity.spec.ts` | #73 G2: umbral |
| `src/modules/pets/infrastructure/pets.controller.spec.ts:211-270` (aserciones) | el detalle deriva `connectivity` |
| `src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts` | claves del perfil |
| `test/devices.e2e-spec.ts` (entero) | #7 R3/R11/R12/R13, #92 R1: bodies con `connectivity` derivada |
| `test/device-subscriptions.e2e-spec.ts:354-356` | 5 claves de `device` en el perfil |
| `test/device-connectivity.e2e-spec.ts` (entero) | #73 R3 |
| `test/ingestion.e2e-spec.ts:219-222,255-303` | #8 R19/R14: batería, `lastMessageAt`, watermark, guard |
| `test/pets.e2e-spec.ts` | 24 claves del perfil; `device: null` |
| `src/workers/*.spec.ts` (`MockOf<IngestionStore>`) | `IngestionStore` no cambia de forma (solo se borra un comentario) |
| `src/db/schema/*.schema.spec.ts` de otras tablas | ninguna otra tabla cambia (R1: una sentencia) |

---

## Cobertura de los criterios de aceptación de `feature_list.json`

| Criterio | Cubierto por | Nota |
|---|---|---|
| 1. Migración generada con `pnpm db:generate` que hace `DROP COLUMN connectivity` en `devices`, aplicada por `init.sh` sin intervención manual | R1 (generación, contenido exacto), R3 (aplicación con `pnpm db:migrate`, idempotencia) | **Corregido** (C1): `init.sh` no corre migraciones; se aplica con `pnpm db:migrate` como manda `docs/conventions.md:216`, contra `pet_tracker_wt` (D3); la compartida `pet_tracker` se migra tras el merge de #63 (D4) |
| 2. Ninguna referencia a `connectivity` queda en `src/db/schema`, entidad, puerto, reader ni seeds; `devices.schema.spec.ts` deja de asertar la columna y `docs/data-model.md` quita la nota de obsoleta | R1 (código y doc), R2 (grep de cierre) | Inventario (a) completo, incluye `toDomain` y fixtures que el criterio no nombra |
| 3. `toDeviceStatusResponse` conserva sus 5 claves y los e2e de claim, device y perfil siguen verdes sin tocarlos | R2 | Intactos: `devices`, `device-subscriptions`, `device-connectivity` e2e + mapper spec. `ingestion`/`provision-device`/`resource-isolation`/`alerts-engine` e2e cambian una línea cada uno (C3), declaradas |
| 4. Suite backend y e2e verdes | R2 (sin migración aplicada), R3 (con migración aplicada, `./init.sh`) | — |

---

## Fuera de alcance (cada uno con su porqué)

- **Paso de migración en `init.sh` / `init.config.sh`**: cambio de harness
  que afecta a todas las features y a CI (que no levanta Postgres,
  `.github/workflows/ci.yml:35-38`). Si se quiere, feature de harness aparte.
- **Servicio Postgres/LocalStack en CI**: ídem (`ci.yml:36` ya lo anota).
- **Borrar `deriveConnectivity` o la clave `connectivity` del contrato HTTP**:
  es el estado que sirve la píldora del móvil (#73); esta feature borra la
  columna, no el dato derivado.
- **Aplicar la migración a cualquier base que no sea `pet_tracker_wt`** — la
  compartida `pet_tracker` (leader o humano, tras el merge de #63,
  [[design]] §Aplicación en el Postgres compartido), el stack AWS dev, otra
  máquina —: fuera del alcance de Codex; esta spec solo garantiza que
  `pnpm db:migrate` la aplica limpiamente y una sola vez.
- **Migración "de vuelta" (re-crear la columna)**: no hay `down` en este repo
  (ninguna migración lo tiene); el dato era NULL en todas las filas desde #73.
- **Editar migraciones/snapshots históricos** (`0004_*.sql`, `meta/0004…0015_snapshot.json`):
  jamás; siguen mencionando la columna y así debe ser.
- **`mobile-pet-tracker/`, `docs/ui-guidelines.md:284-285`, `plans/*.md`**:
  hablan del campo HTTP o son históricos.
- **Reparar el journal de `pet_tracker` o de otras máquinas** (Windows del
  humano): [[design]] §Aplicación en el Postgres compartido documenta el
  SQL; quien tenga un Postgres con 0014/0015 aplicadas a mano lo ejecuta
  antes de su primer `pnpm db:migrate`. No es código ni tarea de Codex.
- **Unificar `ActivePetDeviceStatus` con `DeviceStatusSource`** ahora que
  coinciden: son de módulos distintos y el puerto de pets no debe importar
  del mapper de devices (`pet-device-reader.ts:3-6`).
- **#94** (`mobile-map-staleness-single-source`): independiente.

---

## Aprobación

Firmar sin editar = aceptar D1-D7 tal cual (en particular **D3: Codex aplica
0016 a la base propia `pet_tracker_wt` sin gate**, y **D4: la base compartida
`pet_tracker` — journal por reparar y `DROP` destructivo — la migra el leader
o el humano solo tras el merge de #63**, con el SQL de [[design]] §Aplicación
en el Postgres compartido).

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
