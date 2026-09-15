# review: drop-devices-connectivity-column (#93)
Fecha: 2026-09-15T03:21Z
Veredicto: APROBADO

Arbol: `/home/claude/sites/Pet-Tracker-wt-backend`, branch
`feature/93-drop-devices-connectivity-column`, HEAD `3e3bdc28` (= origin).
Base: `pet_tracker_wt` (`grep -c 'localhost:5433/pet_tracker_wt' ../.env` = 1).
`pet_tracker` no se consulto ni se toco. Working tree limpio al empezar y al
terminar (`git status --porcelain` vacio tras cada sonda y tras `init.sh`).

Commits validados (`git log --oneline d7110e60..HEAD`):
`ffaf0669` test R1 -> `0a131779` feat R1 -> `f9020c3f` docs R1 -> `8f16049b`
R2 -> `edcabc41` R3 -> `9f61e16c` traceability -> `3e3bdc28` alcance.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress`: #93 (`feature_list.json`, comprobado por script)
- [x] `progress/current.md` describe la sesion activa (#93, worktree, base propia, baseline)
- [x] `progress/history.md` tiene la entrada de #92 (sesion anterior cerrada)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure: `grep` de `infrastructure|drizzle|@nestjs|pg|/db/`
      en `src/modules/devices/domain` y `src/modules/pets/domain` (sin specs) -> 0 lineas.
      `device.entity.ts` no tiene ningun `import`
- [x] `PetDeviceReader` / `ActivePetDeviceStatus` (`pet-device-reader.ts`) siguen siendo
      interfaces puras; solo pierden la propiedad `connectivity`
- [x] application no cambia de dependencias (el verde no toca ningun use case `.ts`)
- [x] infrastructure solo deja de mapear una columna (`toDomain` en
      `device.drizzle.repository.ts`, `findActiveDevice` en `pet-device.drizzle.reader.ts`)

## Checklist C4 — TDD
- [x] R1 nombrado por test: `devices.schema.spec.ts :: R1: la migracion crea devices
      conforme a docs/data-model.md > se llama devices y tiene exactamente las columnas
      de la spec` (lista de 14) y `:: #93 R1: la migracion 0016 borra
      devices.connectivity y nada mas`
- [x] R2 y R3 declarados **por escrito antes del handoff** como requisitos de
      verificacion (C4 via (b)) en `requirements.md` y `tasks.md`; cierre por mutacion
      abajo (§Sondas)
- [x] Historial test-primero: `git diff ffaf0669~1 ffaf0669 --stat` -> **solo**
      `backend-pet-tracker/src/db/schema/devices.schema.spec.ts` (10+/2-): quita
      `'connectivity',` de la lista, quita el `expect(columns.get('connectivity')?.notNull)`,
      anade el `describe('#93 R1: …')` que lee el `.sql`. Sin codigo de produccion, sin
      esqueleto del impl (aparece por primera vez en `8f16049b`)
- [x] Rojo por asercion, no por tipos ni `ReferenceError`: el `toEqual` de 14 recibe 15
      claves con el schema base (reproducido en la sonda 1); el `it` nuevo cae por
      `ENOENT` del artefacto bajo prueba (precedente #44 R12, admitido por la spec)
- [x] `git diff ffaf0669 0a131779 --stat` -> 19 ficheros, todos en `design.md`
      §Archivos afectados: sql 0016, snapshot 0016, `_journal.json`, `devices.schema.ts`,
      `devices.schema.spec.ts` (solo reformato prettier del `expect`, asercion identica),
      `device.entity.ts`, `pet-device-reader.ts`, `pet-device.drizzle.reader.ts`,
      `device.drizzle.repository.ts`, `ingestion-store.ts`, 3 specs de use cases de
      devices, `get-pet.use-case.spec.ts`, `pets.controller.spec.ts`, 4 e2e
      (`alerts-engine`, `ingestion`, `provision-device`, `resource-isolation`). En
      fixtures y e2e las unicas lineas que cambian son `-    connectivity: null,` y
      `-      expect(deviceRow.connectivity).toBeNull(); // #73 R4…` (verificado con
      `git diff … | grep '^[-+][^-+]'`)
- [x] `f9020c3f` toca solo `docs/data-model.md` (2 +-); el texto nuevo de la fila
      `devices` es **literalmente** el de R1

## Checklist C5 — Trazabilidad
- [x] `traceability.md` sin filas "pendiente" (la unica ocurrencia es la regla al pie)
- [x] Hashes `ffaf0669`, `0a131779`, `f9020c3f`, `8f16049b`, `edcabc41`: `git cat-file -t`
      = commit y `git merge-base --is-ancestor <h> HEAD` = si, los cinco
- [x] Los 7 commits siguen `test|feat|docs(drop-devices-connectivity-column): … (R<n>[,R<n>])`
      (regex sobre `git log d7110e60..HEAD`, todos cuadran)

## Checklist C6 — Spec aprobada
- [x] `requirements.md` frontmatter `status: approved`; casilla
      `- [X] Aprobado por humano (fecha: 2026-09-14)`
- [x] Firma humana `0cfeae40` (AlexisSM377, 2026-09-14): 1+/1- en `requirements.md`
      (la casilla). Despues de la firma solo cambio el frontmatter `draft -> approved`
      en `d7110e60` (requirements, design, tasks: 2 +- cada uno) y la tabla de
      `traceability.md` (`8f16049b`, `9f61e16c`). Ningun requisito modificado tras el gate

## Checklist C7 — Sin codigo huerfano
- [x] La columna obsoleta desde #73 y todos sus espejos (tabla (a) de §Inventario:
      schema, entidad, puerto, dos mapeos de fila, comentario de `ingestion-store.ts`,
      fixtures, e2e, docs) fueron eliminados en `0a131779`/`f9020c3f`
- [x] Los tests de la columna tambien: `devices.schema.spec.ts:43,86` y
      `test/ingestion.e2e-spec.ts:218`. No se borro ningun fichero, asi que no queda
      `.spec` huerfano
- [x] Grep de espejos de produccion (sin specs) en las rutas (a) -> 0 (ver §D2)

## D1 — migracion 0016 (verificado sobre el arbol)
- `cat -A src/db/migrations/0016_drop_devices_connectivity.sql` ->
  `ALTER TABLE "devices" DROP COLUMN "connectivity";` y nada mas (sin salto final; el
  test usa `.trim()`). `ls src/db/migrations | grep 0016` -> un solo fichero
- `meta/_journal.json`: 17 entradas, `idx` contiguos 0..16, `when` estrictamente
  creciente; idx 16 = `{ when: 1789440631931, tag: "0016_drop_devices_connectivity" }`
- `meta/0016_snapshot.json`: `prevId` = `4464bafc-df5e-4d81-ac7b-554ca9fd615f` = `id` de
  0015; `public.devices` 14 columnas sin `connectivity`; quitando `id`/`prevId` y la
  columna, 0016 == 0015 (comparacion JSON completa)
- `git diff --stat origin/main -- <0000..0015 .sql y snapshots>` -> vacio

## D2 — inventario (verificado desde `backend-pet-tracker/`)
```text
grep -rn "connectivity" src/db/schema src/modules/devices/domain/entities src/modules/pets/domain/ports src/modules/devices/infrastructure/repositories src/workers scripts | wc -l
4     <- las 4 lineas son el describe '#93 R1' de devices.schema.spec.ts:202,203,205,209 (ver Observaciones)
… mismo grep con --exclude='*.spec.ts' | wc -l
0
grep -rn "connectivity: null" src | wc -l
0
grep -rn "deviceRow\.connectivity\|row\.connectivity\|device\.connectivity" src test | wc -l
0
```
- `git diff --stat origin/main -- connectivity.ts connectivity.spec.ts mappers/
  test/devices.e2e-spec.ts test/device-subscriptions.e2e-spec.ts
  test/device-connectivity.e2e-spec.ts devices.controller.ts pets.controller.ts
  claim-device|release-device|get-pet|get-pet-device .use-case.ts
  ingestion.drizzle.store.ts positions-consumer.service.ts scripts/ mobile-pet-tracker/
  init.sh init.config.sh docs/conventions.md docs/ui-guidelines.md schema/index.ts
  drizzle.config.ts .github/workflows/ci.yml plans/` -> **vacio** (exit 0)
- `git diff --stat origin/main` -> 28 ficheros = los 22 de `design.md` §Archivos afectados
  (19 del verde + `docs/data-model.md` + impl + traceability) + los 6 del handoff
  (`feature_list.json`, `progress/current.md`, handoff, requirements, design, tasks).
  Nada fuera de lista
- Deltas de candado = exactamente los de §Candados "Se mueven": 3 en el rojo
  (`:43`, `:86`, describe nuevo), el resto `connectivity: null,` / `:218` de ingestion en
  el verde; ningun candado de "Siguen verdes" tocado

## R3 — repetido por el reviewer sobre `pet_tracker_wt`
```text
$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"
17|1789440631931                                   <- = when de idx 16
$ … "select count(*) from information_schema.columns where table_schema='public' and table_name='devices' and column_name='connectivity'"
0
$ … "select count(*) from information_schema.columns where table_schema='public' and table_name='devices'"
14
$ … "select id, created_at from drizzle.__drizzle_migrations order by created_at desc limit 3"
17|1789440631931
16|1787957375434
15|1787685275503
$ pnpm db:migrate
[✓] migrations applied successfully!          migrate-exit=0
$ (journal) 17|1789440631931   (columna) 0      <- idempotente, nada aplicado
$ pnpm db:generate
No schema changes, nothing to migrate
$ git status --porcelain src/db/migrations
(vacio; status-lines=0)
```

## Sondas de mutacion (zona ciega; no versionadas; arbol restaurado y `git diff --exit-code` limpio tras cada una)
- **Sonda 1** — reinsertada `connectivity: varchar('connectivity', { length: 20 }),` en
  `devices.schema.ts:39`; `pnpm test -- devices.schema` -> exit 1,
  `1 failed, 12 passed, 13 total`. Cae **por asercion** el candado de 14 columnas:
  `R1: … > se llama devices y tiene exactamente las columnas de la spec`,
  `expect(received).toEqual(expected)`, `- Expected - 0 / + Received + 1`,
  `+   "connectivity",`. Restaurado con `git checkout -- src/db/schema/devices.schema.ts`
- **Sonda 2** — `.sql` de 0016 cambiado a `… DROP COLUMN IF EXISTS "connectivity";`;
  `pnpm test -- devices.schema` -> exit 1, `1 failed, 12 passed, 13 total`. Cae
  `#93 R1: … > 0016_drop_devices_connectivity.sql contiene exactamente el DROP COLUMN`,
  `Expected: "ALTER TABLE \"devices\" DROP COLUMN \"connectivity\";"`,
  `Received: "ALTER TABLE \"devices\" DROP COLUMN IF EXISTS \"connectivity\";"`.
  Restaurado con `git checkout -- src/db/migrations/0016_drop_devices_connectivity.sql`
- **Control** sin mutar: exit 0, `13 passed, 13 total`
- Logs: `<scratchpad>/probe1-93.log`, `probe2-93.log`, `probe0-93.log`

## Output de ./init.sh (raiz del worktree, primer plano, exit sin pipe)
Baseline (cierre de #92): backend 166 / 1278; infra 2 / 14; movil 73 / 1265;
e2e 26 de 29 suites (3 skipped), 367 de 375 tests (8 skipped).

**Corrida 1** (03:13:45Z -> 03:15:15Z): `EXIT=1`. Backend 166/1279, infra 2/14; movil
`1 failed, 72 passed, 73` / `1 failed, 1264 passed, 1265`: `src/screens/add-pet/index.test.tsx`
`R7: foto opcional tras alta > uploads a chosen preview only after createPet succeeds`,
`TypeError: Cannot read properties of undefined (reading 'canceled')` en
`src/screens/add-pet/index.tsx:115`. Es el flake conocido #72; `mobile-pet-tracker/`
sin diff contra `origin/main`. e2e/lint/typecheck no llegaron a correr.
Protocolo: `bun run --cwd mobile-pet-tracker test src/screens/add-pet/index.test.tsx`
x3 -> exit 0, `17 passed, 17 total` las tres veces.

**Corrida 2** (03:16:28Z -> 03:20:08Z), `pgrep -f 'init\.sh|test:e2e|jest-e2e'` sin
corrida ajena viva antes de arrancar:
```text
EXIT=0
✅ Build exitoso
Test Suites: 166 passed, 166 total
Tests:       1279 passed, 1279 total
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Test Suites: 73 passed, 73 total
Tests:       1265 passed, 1265 total
Test Suites: 3 skipped, 26 passed, 26 of 29 total
Tests:       8 skipped, 367 passed, 375 total
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```
**Delta contra baseline**: backend **+1 test** (1278 -> 1279: el `it` del describe
`#93 R1`), 0 suites nuevas; infra, movil y e2e sin cambio de recuento. Sin
regresiones. Logs: `<scratchpad>/init-review-93.log` (corrida 1),
`init-review-93-run2.log` (corrida 2), `addpet-run{1,2,3}-93.log`.

## Observaciones (ninguna bloquea)
1. **Contradiccion interna de la spec, no de la implementacion**: R2 exige que el
   primer grep de "Candado del inventario" devuelva 0 lineas, pero su ruta
   `src/db/schema` cubre `devices.schema.spec.ts`, donde R1 **obliga** a escribir un
   `describe` cuyo nombre, ruta del `.sql` y sentencia esperada contienen la palabra.
   Ambas cosas a la vez son imposibles. Las 4 lineas son exactamente ese candado
   obligatorio; con `--exclude='*.spec.ts'` el grep da 0 y no queda ningun espejo de
   produccion. Codex lo detecto, no toco el test para "cuadrar" el grep y lo documento
   en el impl §R2: decision correcta. Para el leader: corregir el texto del grep en
   `requirements.md` §Inventario / R2 (anadir `--exclude='*.spec.ts'`) es una enmienda
   de spec; decidir si pasa por re-gate. Leccion para `spec_author`: un grep de cierre
   que cubre el fichero del candado que la misma spec manda escribir.
2. El verde `0a131779` reformatea el `expect(sql.trim()).toBe(…)` del rojo a tres
   lineas (prettier, 80 col); la asercion es identica. Implica que el commit rojo era
   ademas rojo de lint; no afecta a C4 (el rojo legitimo es el de asercion).
3. `tasks.md` §0 pedia crear el esqueleto del impl antes de la primera tarea; el
   fichero aparece por primera vez en `8f16049b`. Sin efecto en el resultado.
4. El `.sql` generado no tiene salto de linea final (salida de drizzle-kit, no editada);
   el candado usa `.trim()`, asi que es indiferente.
5. Pendientes fuera de esta feature, ya previstos por la spec (D4): reparar el journal
   de `pet_tracker` (0014/0015) y aplicar 0016 alli **solo tras el merge de #63**, con
   `design.md` §Aplicacion en el Postgres compartido; el body del PR debe avisarlo
   (tasks.md §Cierre).
