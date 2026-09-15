---
feature: "drop-devices-connectivity-column"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[drop-devices-connectivity-column]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`): el (1) de
> R1 es su propio commit `test(drop-devices-connectivity-column): … (R1)` y
> se empuja en **rojo**; el (2) es el commit `feat(...)` que lo pone verde;
> el (3) es `docs(...)`. Un solo commit con test + implementación + docs
> incumple C4 (pasó en #19). R2 y R3 son requisitos de verificación (C4 vía
> (b)) declarados en [[requirements]]: no tienen commit de test.
>
> **Sujeto presente**: cada test nombra solo helpers, símbolos y rutas que
> existen en el árbol base `d8e8a49c` (`MIGRATIONS_DIR`, `readFileSync`,
> `join`, `getTableConfig`, `devices` — todos ya importados en
> `devices.schema.spec.ts:1-6`) o el artefacto que el propio verde genera
> (`0016_drop_devices_connectivity.sql`, precedente #44 R12).
>
> **Suites**: `pnpm test` (unit), `pnpm exec tsc --noEmit`, `pnpm lint`,
> `pnpm test:e2e` (Postgres + LocalStack) desde `backend-pet-tracker/`; para
> un solo fichero, `pnpm test -- devices.schema` / `pnpm test:e2e -- ingestion.e2e-spec`.
> `./init.sh` desde la raíz corre todo y es el cierre.
>
> **Postgres propio, LocalStack compartido**: este worktree usa su base
> `pet_tracker_wt` (`DATABASE_URL` del `.env` del worktree), así que
> `pnpm db:migrate` y los e2e que solo tocan Postgres no necesitan aviso a
> nadie. LocalStack (`:4566`) **sí** se comparte con la otra sesión y lo
> tocan la mitad de las suites e2e (`ingestion`, `alerts-engine`,
> `resource-isolation`, `device-subscriptions`, `positions`, `media`, …):
> antes de `pnpm test:e2e` o `./init.sh`,
> `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` limpio.
> Consultas a la base: `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "…"`
> (no `docker compose exec`: no funciona desde el worktree).

---

## §0 — Antes de la primera tarea

- [ ] Verificar branch y worktree: `git branch --show-current` =
      `feature/93-drop-devices-connectivity-column` en
      `/home/claude/sites/Pet-Tracker-wt-backend` (HEAD `d8e8a49c` o hijo).
      **No** tocar `/home/claude/sites/Pet-Tracker` (otra sesión).
- [ ] Leer [[requirements]] §0 (C1: `init.sh` no migra; C2: el journal de
      la base **compartida** va por 0013 — no es la de Codex; C3:
      `ingestion.e2e-spec.ts` sí cambia), §Inventario y [[design]] D1-D7.
- [ ] Verificar la base propia: desde `backend-pet-tracker/`,
      `grep -c 'localhost:5433/pet_tracker_wt' ../.env` → `1` (sin imprimir
      la línea), y
      `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"`
      → `16|1787957375434`. Si no cuadra, **parar** y avisar al leader.
- [ ] Crear `progress/impl_drop-devices-connectivity-column.md` con
      secciones R1, R2, R3 vacías.
- [ ] Línea base: `pgrep` de cabecera limpio → `./init.sh` desde la raíz,
      exit code medido **sin pipe** (memoria `exit-code-tras-pipe`). Debe ser
      verde antes de tocar nada.

---

## R1 — la columna desaparece del schema Drizzle, de la migración 0016 y de los tipos que la espejan

- [ ] (1) Escribir test que falla para R1 — un solo commit
      `test(drop-devices-connectivity-column): lock devices schema without connectivity (R1)`,
      solo `backend-pet-tracker/src/db/schema/devices.schema.spec.ts`:
      - `:43` → quitar `'connectivity',` de la lista del `toEqual` (queda una
        lista de 14).
      - `:86` → quitar `expect(columns.get('connectivity')?.notNull).toBe(false);`.
      - Al final del fichero:
        ```ts
        describe('#93 R1: la migracion 0016 borra devices.connectivity y nada mas', () => {
          it('0016_drop_devices_connectivity.sql contiene exactamente el DROP COLUMN', () => {
            const sql = readFileSync(
              join(MIGRATIONS_DIR, '0016_drop_devices_connectivity.sql'),
              'utf8',
            );
            expect(sql.trim()).toBe('ALTER TABLE "devices" DROP COLUMN "connectivity";');
          });
        });
        ```
      Rojo esperado en `pnpm test -- devices.schema`: el `it` de `:30`
      cae **por su aserción** (`toEqual` recibe 15 claves, entre ellas
      `connectivity`); el `it` nuevo cae por `ENOENT` del `.sql` (artefacto
      bajo prueba). Todo lo demás del fichero sigue verde. Pegar el fragmento
      de salida en el impl §R1.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(drop-devices-connectivity-column): drop devices.connectivity column and migration 0016 (R1)`,
      en este orden:
      1. `src/db/schema/devices.schema.ts`: borrar `:39`; en `:23` dejar
         `// alimente y vuelven a NULL en cada claim (#92).`
      2. `pnpm db:generate` desde `backend-pet-tracker/`. Comprobar:
         `ls src/db/migrations/0016_*.sql` → **un** fichero;
         `cat` → **exactamente** `ALTER TABLE "devices" DROP COLUMN "connectivity";`.
         **Si hay cualquier otra sentencia: PARAR**, `git checkout -- src/db/migrations`,
         reportar la salida en el impl §R1 y devolver el turno al leader (D1).
      3. `git mv src/db/migrations/0016_<generado>.sql src/db/migrations/0016_drop_devices_connectivity.sql`;
         en `src/db/migrations/meta/_journal.json`, la entrada `idx: 16`
         pasa a `"tag": "0016_drop_devices_connectivity"` (el `when` se deja
         como salió). `meta/0016_snapshot.json` no se toca; comprobar que
         `tables['public.devices'].columns` no tiene `connectivity` y que
         `prevId` = `4464bafc-df5e-4d81-ac7b-554ca9fd615f`.
      4. `src/modules/devices/domain/entities/device.entity.ts`: borrar
         `:19-20`, `:41`, `:58`.
      5. `src/modules/pets/domain/ports/pet-device-reader.ts`: borrar `:10`.
      6. `src/modules/devices/infrastructure/repositories/pet-device.drizzle.reader.ts`: borrar `:37`.
      7. `src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts`: borrar `:139`.
      8. `src/workers/ingestion-store.ts`: borrar `:47-48` (D7).
      9. `pnpm exec tsc --noEmit` → enumera los fixtures pendientes; borrar la
         línea `connectivity: null,` en:
         `claim-device.use-case.spec.ts:37`, `get-pet-device.use-case.spec.ts:19`,
         `release-device.use-case.spec.ts:23`, `get-pet.use-case.spec.ts:104`
         **y `:121`**, `pets.controller.spec.ts:219,243,261`,
         `test/resource-isolation.e2e-spec.ts:131`, `test/alerts-engine.e2e-spec.ts:136`,
         `test/ingestion.e2e-spec.ts:89`; y las aserciones de fila
         `test/provision-device.e2e-spec.ts:144` y `test/ingestion.e2e-spec.ts:218`
         (una línea cada una; `:219-222` de ingestion quedan). Nada más que lo
         listado en §Inventario (a) de [[requirements]].
      10. Verde: `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm test`
          (incluye `devices.schema`), y con el `pgrep` de cabecera limpio
          `pnpm test:e2e` — **sin aplicar la migración** (P6 de
          [[requirements]]: verde esperado con la columna aún en
          `pet_tracker_wt`).
- [ ] (3) Refactor con tests verdes — commit
      `docs(drop-devices-connectivity-column): drop connectivity from data-model (R1)`:
      `docs/data-model.md:53`, fila `devices`: quitar `connectivity` de la
      lista de columnas y sustituir la frase "`connectivity` está **obsoleta
      desde #73**: … feature aparte." por el texto literal de [[requirements]]
      R1. Fila R1 de [[traceability]] con los tres hashes.

## R2 — el contrato HTTP y la derivación no cambian; el inventario está limpio (verificación, C4 vía (b))

- [ ] (1) Escribir test que falla para R2 — no aplica (verificación). Desde
      `backend-pet-tracker/`, con la migración **sin** aplicar:
      ```sh
      grep -rn "connectivity" src/db/schema src/modules/devices/domain/entities src/modules/pets/domain/ports src/modules/devices/infrastructure/repositories src/workers scripts | wc -l   # 0
      grep -rn "connectivity: null" src | wc -l                                                     # 0
      grep -rn "deviceRow\.connectivity\|row\.connectivity\|device\.connectivity" src test | wc -l  # 0
      git diff --stat origin/main -- test/devices.e2e-spec.ts test/device-subscriptions.e2e-spec.ts test/device-connectivity.e2e-spec.ts src/modules/devices/infrastructure/mappers src/modules/devices/domain/connectivity.ts src/modules/devices/domain/connectivity.spec.ts   # vacío
      git diff --stat origin/main   # solo los ficheros de [[design]] §Archivos afectados
      ```
- [ ] (2) Implementación mínima que lo pasa — ninguna. `pnpm test` y
      `pnpm test:e2e` (con el `pgrep` de cabecera limpio) verdes, exit code
      sin pipe. Pegar las últimas líneas de cada suite, los cuatro `grep`/`diff`
      con su resultado, en el impl §R2.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R2 de [[traceability]]
      apunta a los candados (b) intactos + §R2 del impl.

## R3 — la migración se aplica a `pet_tracker_wt` con `pnpm db:migrate`, es idempotente y el árbol sigue verde (verificación, C4 vía (b))

- [ ] (1) Escribir test que falla para R3 — no aplica (verificación; D5).
      Precondición: R2 cerrado (e2e verde **sin** aplicar la migración).
- [ ] (2) Implementación mínima que lo pasa — desde `backend-pet-tracker/`
      (el `docker exec` vale desde cualquier cwd); pegar **cada salida** en
      el impl §R3:
      ```sh
      # a) estado previo del journal (esperado: 16|1787957375434)
      docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"
      # b) columna presente antes (esperado: 1)
      docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*) from information_schema.columns where table_schema='public' and table_name='devices' and column_name='connectivity'"
      # c) aplicar; exit 0 medido sin pipe
      pnpm db:migrate
      # d) columna ausente (esperado: 0) — repetir (b)
      # e) journal (esperado: 17|<when de idx 16 en meta/_journal.json>) — repetir (a)
      # f) idempotencia: exit 0, y (a) sigue en 17, (b) sigue en 0
      pnpm db:migrate
      # g) snapshot y schema coinciden: sin salida
      pnpm db:generate && git status --porcelain src/db/migrations
      ```
      Luego, con el `pgrep` de cabecera limpio: `pnpm test:e2e` verde y
      `./init.sh` desde la raíz, exit 0 **sin pipe**. Si (g) crea algo,
      borrarlo (`git clean -f src/db/migrations`), reportar y parar.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R3 de [[traceability]]
      apunta a §R3 del impl (salidas a-g + e2e + `init.sh`). La base
      compartida `pet_tracker` **no** se toca (D4).

---

## Cierre

- [ ] [[traceability]] sin filas "pendiente"; `feature_list.json` #93 sigue
      `in_progress` (lo pasa a `done` el leader con el veredicto del reviewer
      **y** R3 cerrado).
- [ ] `progress/impl_drop-devices-connectivity-column.md` completo (R1
      hashes + salida de `db:generate`, R2 suites/greps/diff, R3 salidas a-g
      + e2e + `init.sh`).
- [ ] `git log --oneline origin/main..HEAD` muestra rojo → verde → docs de R1
      (tres commits) y nada más de código.
- [ ] Push de la branch y `gh pr create` hacia `main`; el humano mergea. El
      PR avisa en su body: "la base compartida `pet_tracker` (y cualquier
      Postgres con 0014/0015 aplicadas a mano) se migra **tras el merge de
      #63** con el procedimiento de `specs/drop-devices-connectivity-column/design.md`
      §Aplicación en el Postgres compartido".
