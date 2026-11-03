# review: backend-vaccine-catalog-migration
Fecha: 2026-11-03T18:29Z
Veredicto: APROBADO (final, 2026-11-03 tras el `./init.sh` del leader: `init=0` sobre HEAD `3cc0efe0`)

Alcance: worktree `/home/claude/sites/Pet-Tracker-wt-226`, rama `feature/226-backend-vaccine-catalog-migration`,
HEAD `3cc0efe0`, H0 `de9c5373`. Diff `git diff de9c5373 3cc0efe0`: 8 rutas, exactamente la lista cerrada
(7 del informe más `progress/impl_backend-vaccine-catalog-migration.md`). La revisión es estática: este reviewer
no corrió init.sh, jest, migraciones, psql ni installs, porque el leader lo prohibió. No leyó `.env`.

## Checklist C2: estado coherente
- [x] No hay features `in_progress` en `feature_list.json`. #226 está `spec_ready`. El init.sh en curso
      también lo da por bueno: «Sin features en progreso (sesión limpia)», línea 114 del log.
- [x] `progress/current.md` describe la sesión activa (plan de arreglos del smoke del 2026-11-03, #226–#235).
- [x] init.sh del leader en este worktree: `init=0` (última línea del log). Tras la corrida el árbol solo tenía
      `?? progress/review_backend-vaccine-catalog-migration.md`, con HEAD `3cc0efe0`, según el leader.

## Checklist C3: arquitectura
- [x] domain no cambia (cero diff en `src/modules/**`).
- [x] Los repositorios y contratos de domain no cambian.
- [x] application no cambia.
- [x] infrastructure no tiene lógica de negocio. El único cambio de producción es una migración de datos en
      `src/db/migrations/` (sin DDL), más el journal y el snapshot que generó drizzle-kit.
- [x] Lint, typecheck y e2e completo en verde (log: «✅ Lint sin errores» :192714, «✅ Typecheck sin errores»
      :192718, «✅ Tests e2e pasados» :192702). El `lint --fix` no dejó cambios en el árbol.

## Checklist C4: TDD
- [x] Cada R tiene un test que lo nombra:
  - R1: 5 its `#226 R1: …`.
  - R2: 1 it `#226 R2: …`.
  - R3: 1 it `#226 R3: …`.
  - Hay 3 `describe('#226 R<n>: …')`.
  - Los 7 nombres coinciden literalmente con `requirements.md`.
  - R4 y R5 no son de código: la spec los verifica con locks y comandos (`tasks.md` §R4 y §R5). Ver O5.
- [x] El historial es test-primero, comprobado con `git show` y con los tiempos:
  - `953e2921` test R1: solo el e2e. Log rojo a las 17:41:16 y commit a las 17:41:21.
  - `13901fb7` feat R1: solo `.sql`, snapshot y journal. El `when` del journal (`1793727687404`, 17:41:27 UTC)
    es posterior al rojo. El verde se registró a las 17:44:48 y el commit a las 17:44:52.
  - `fc2b6028` test R2: solo el e2e, a las 17:54:48. El verde de R2 corrió después de ese commit, a las 17:55:17.
  - `0268be24` feat R2: solo el `.sql` (+2/−1: el comentario y `ON CONFLICT`).
  - `dff49ed4` test R3: solo el e2e, declarado «nace verde».
- [x] Los rojos fallan por aserción, nunca por `ReferenceError`, `TypeError` ni `beforeAll`:
  - `progress/e226-r1-test.log:16-87`: 4 fallos por `expect`:
    - journal: `Expected length: 1`, `Received length: 0`;
    - dog: `Expected length: 4`, `Received []`;
    - cat: `Expected length: 3`, `Received []`;
    - POST: `toBeDefined`, `Received: undefined`.
    Pasa 1, el ancla anti-vacuidad. Es el rojo que cabe esperar del contenido del test:
    - sin la entrada `_vaccine_catalog_data`, la carpeta previa es el journal completo (`vaccine-catalog-migration.e2e-spec.ts:93-95`);
    - la base A queda migrada hasta 0022 y vacía.
  - `progress/e226-r2-test.log:18-29`: `resolves.toBeUndefined()` con «Received promise rejected». La consulta
    que falla es el `INSERT` sin `ON CONFLICT`, lo que cuadra con el índice único de la 0009.
- [x] R3 es requisito de verificación, declarado por escrito antes del handoff (`tasks.md:119-124`: nace verde,
      vía (b)). Evidencia de mutación S1, de `progress/e226-s1.log:16-22`:
  - es el único rojo, `#226 R3`;
  - el fallo es `expect(seedVaccineCatalog(…)).resolves.toBeUndefined()`, con «Received promise rejected»;
  - el SQL que falla es `do update set "id" = excluded.id, "scheme" = excluded.scheme`, porque la FK de la
    vacuna registrada en R1 impide cambiar ids.

  Este reviewer no pudo repetir la mutación (jest prohibido). La evidencia es el log de Codex, que cuadra con
  el código: sin la FK, `toEqual(before.rows)` también caería, porque los ids cambiarían.
- [x] Ningún rojo muta un doble de test: no hay dobles; el e2e usa la base, el migrador y la API reales.

### Mutaciones M1–M5 y S1 contra el test (coherencia comprobada a mano y con los logs)
| Id | Por qué debe morder (según el código del test) | Log |
|---|---|---|
| M1 | dog `toHaveLength(4)` (`e2e-spec.ts:184`). En R3 la foto previa tiene 6 filas (`:312`) | `e226-m1.log:16-39`: 2 rojos (dog y R3) |
| M2 | cat `toEqual` en `series` (`:214-232`). En R3 el seed restaura el `scheme` y cambia la foto | `e226-m2.log:16-59`: 2 rojos (cat y R3) |
| M3 | Base B sembrada: el `INSERT` choca con el índice único y `resolves` falla (`:292-294`) | `e226-m3.log:16-20`: 1 rojo (R2) |
| M4 | `DO UPDATE` restaura `boosterMonths` 12 sobre el 36 editado (`:299-303`) | `e226-m4.log:16-30`: 1 rojo (R2) |
| M5 | `when=1` no supera el `created_at` de 0022, así que el migrador la salta (`drizzle-orm/pg-core/dialect.js:62`) y el catálogo queda vacío. R2 sigue verde porque la base B ya está sembrada | `e226-m5.log`: 5 rojos y 2 verdes (R1 anti-vacuidad y R2) |
| S1 | El seed reescribe el `id` y la FK de `pet_vaccines` lo impide (`:313`) | `e226-s1.log:16-22`: 1 rojo (R3) |

### No tautológico
- Corre la migración real: `migrate()` sobre `MIGRATIONS = src/db/migrations` (`e2e-spec.ts:57,151,293`).
  No lee el texto del `.sql`.
- Observa a través de la API real (`GET /v1/vaccine-catalog`, `POST /v1/pets/:id/vaccines`).
- Los esperados son literales escritos a mano, como manda la spec (`requirements.md:88-89`). Su anclaje al seed:
  - se comprobaron campo a campo contra `VACCINE_CATALOG_SEED`: 7 filas, `species`, `name` y `scheme` idénticos;
  - R3 ata la migración al seed también por comportamiento: el seed sobre el catálogo migrado debe dejar la foto
    idéntica, y M1 y M2 ponen R3 en rojo.
- `seedVaccineCatalog` se usa solo como acción (`:279,313`).
- Bases desechables: solo crea `pet_tracker_226_a_<runId>` y `pet_tracker_226_b_<runId>` (`:55-56,141,272`).
  - Las borra con `DROP DATABASE IF EXISTS … WITH (FORCE)` protegido por `createdA`/`createdB` (`:109-120`).
  - Restaura `DATABASE_URL` (`:105-108`) y borra la carpeta temporal (`:122-125`).
  - Los fallos de limpieza se acumulan en `AggregateError` y no tapan el error original.

## Checklist C5: trazabilidad
- [x] `traceability.md` no tiene ninguna fila «pendiente» (`grep -ci pendiente` → 0).
  - Los hashes `13901fb7`, `0268be24`, `dff49ed4` y `7aa11e25` son ancestros de HEAD, y cada uno es el commit
    que pide `tasks.md` §Cierre.
  - El commit `856de947` solo cambia la columna Commit.
- [x] Los commits siguen `feat|test|docs(backend-vaccine-catalog-migration): <desc> (R<n>)`, con el mensaje
      literal de `tasks.md`.

## Checklist C6: spec aprobada
- [x] `requirements.md:3` dice `status: approved`, y `:255` tiene la casilla `[x]` con fecha 2026-11-03.
      La firma delegada es `de9c5373`.
- [x] Ningún requisito cambió tras la firma: `git diff de9c5373 3cc0efe0 -- specs/` solo toca `traceability.md`.

## Checklist C7: sin código huérfano
- [x] N/A. La feature no reemplaza nada: el seed se conserva a propósito (D2) y sus tests siguen intactos.

## Verificaciones específicas pedidas por el leader
- **`.sql` idéntico al literal de design.md:**
  - `diff` entre el bloque ```` ```sql ```` de `design.md:85-95` y `0023_vaccine_catalog_data.sql` → sin diferencias (exit 0).
  - 11 líneas, con LF final; 0 `#`; 0 `CREATE|ALTER|DROP`; 0 bytes no ASCII.
- **Idempotencia:** `ON CONFLICT ("species", "name") DO NOTHING` infiere el índice único real
  `vaccine_catalog_species_name_idx ("species","name")` de `0009_shallow_dust.sql:29`.
  - Las columnas `id uuid` (sin default), `species`, `name` y `scheme jsonb` cuadran con `0009_shallow_dust.sql:15-21`.
  - Las especies están dentro del CHECK `in ('dog','cat')`.
- **Datos iguales al seed:** las 7 filas del `.sql` coinciden con `src/db/seed/vaccine-catalog.ts:15-51`, en el
  mismo orden, con la misma especie, nombre y esquema. `scripts/seed-vaccines.ts` solo llama a
  `seedVaccineCatalog`.
- **Journal y snapshot:**
  - el journal solo añade `idx 23`, `0023_vaccine_catalog_data`, `when 1793727687404`;
  - `idx` va de 0 a 23 sin huecos, y `when` es estrictamente creciente (`1793081136834` < `1793727687404`);
  - `0023_snapshot.prevId` = `0022_snapshot.id` (`81d9d217-…`), y el snapshot 0023 es igual al 0022 salvo
    `id` y `prevId`;
  - ningún snapshot previo se tocó (`--name-status`: solo `A 0023_snapshot.json` y `M _journal.json`), y siguen
    los 24 snapshots.
- **Locks R1:** 1, 24, 24, 7, solo 0009 con el `CREATE TABLE`, `INSERT` en 1 fichero.
- **Locks R2:** 11, 1, `DO UPDATE` 0, `#` 0.
- **R4:** el bloque añadido a `progress/smoke_mejoras-smoke.md` es idéntico al de `design.md:268-279` (diff exit 0).
  - Lleva el literal del humano: grep → 1, igual que `plan_mejoras-smoke-2026-11-03.md:31-32` y
    `requirements.md:25`.
  - El paso 1 reproduce el catálogo vacío antes de actualizar.
  - La casilla está sin marcar: `^- \[ \] Smoke de #226 pasado (fecha: ____` → 1.
- **R5:**
  - con `origin/dev...HEAD` literal (merge-base `f05016d3`): móvil, seed, `seed-vaccines.ts`, `init.config.sh`,
    `init-e2e-gate.test.mjs`, `package.json`, lockfile y schema → 0; `src` fuera de migraciones → 0;
  - `drizzle-kit generate` → «No schema changes» (`progress/g226-r5.log`);
  - unitarios 1650 = U0 (`progress/u226-r5.log`).
- **Coordinación de migraciones:** `origin/dev` (`ac727c9b`) no tiene diff de backend frente a H0, sigue con 23
  `.sql` y ninguna rama de #227–#235 añade una 0023 o posterior. No hace falta la receta de renumeración.

## Observaciones (ninguna bloquea; por severidad)
1. **O1 (media, proceso de PR).** La rama choca con `origin/dev` en `progress/smoke_mejoras-smoke.md`.
   - `git merge-tree --write-tree HEAD origin/dev` → `CONFLICT (content)`.
   - Causa: `dev` añadió la sección `## #235 mobile-profile-photo-owner-only` justo después de la línea 9, el
     mismo sitio donde esta rama añade la de #226 (`smoke_mejoras-smoke.md:10-22`).
   - Con la PR en CONFLICTING no corren los checks. Antes de abrirla: `git merge origin/dev` (sin rebase, para
     no invalidar los hashes de `traceability.md`), conservar las dos secciones y volver a correr los dos locks
     de `tasks.md` §R4.
   - `feature_list.json` se fusiona solo. El backend no se ve afectado.
   - Estado al cerrar el veredicto: hay un merge en curso en el worktree (`MERGE_HEAD` = `ac727c9b`, con
     `UU progress/smoke_mejoras-smoke.md` y los ficheros de #235 en stage). Lo empezó alguien que no es este
     reviewer, después del init.sh. El veredicto vale para `3cc0efe0`. Al resolver el merge, comprobar que
     `git diff 3cc0efe0 <merge> -- backend-pet-tracker/` sale vacío y que los dos locks de R4 siguen dando 1 y 1.
2. **O2 (baja, spec).** Las tablas de mutaciones de `design.md:190-197` y `tasks.md:143-150` no coinciden:
   - design incluye `'Rabia'` → `'Rabia canina'` y no tiene S1; tasks tiene S1 y no tiene «Rabia canina».
   - Codex siguió tasks, que es lo que manda el handoff, así que «Rabia canina» no se ejecutó.
   - Por lectura del código, mordería en tres its: R1 dog (`toEqual` de `name`, `e2e-spec.ts:185-208`),
     R1 POST (`rabia` es `undefined`, `:238`) y R3 (el seed borra la fila no canónica y reinserta `Rabia` con
     otro id, `:318`).
3. **O3 (baja, techo conocido).** El migrador salta en silencio una migración cuyo `when` no supere el último
   `created_at` aplicado (`drizzle-orm/pg-core/dialect.js:62`).
   - En el PC del humano solo pasaría si tuviera aplicada una migración de una rama no mergeada generada
     después del 2026-11-03 17:41:27 UTC.
   - Los pasos 2 y 3 del smoke lo detectarían.
4. **O4 (informativa).** Los logs del e2e dicen `injected env (0) from ../.env`: el import de `AppModule`, que
   se hoistea, carga el `.env` antes que `loadDotenv` (`e2e-spec.ts:25`). Es inocuo, porque
   `originalDatabaseUrl` se lee después (`:53`), y es el mismo patrón que `test/resource-isolation.e2e-spec.ts`.
5. **O5 (informativa, C4).** R4 y R5 no tienen un `it` que los nombre: la spec los define como verificación por
   lock y por comando (`tasks.md:160-186`), y los dos se midieron arriba. Se aceptan como en features anteriores.

## Output de ./init.sh
Lo corrió el leader en este worktree, porque el reviewer tenía prohibido correrlo. El reviewer leyó el log
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/init-226.log`
(192 722 líneas) y no ejecutó nada. Extracto:
```
:113    ✅ Archivos del harness presentes
:114    ✅ Sin features en progreso (sesión limpia)
:120    ⚠️  STATUS.md desactualizado (195/223 declarado vs 209/233 real)
:132    ✅ Build exitoso
:293    Test Suites: 198 passed, 198 total          (backend unit)
:294    Tests:       1650 passed, 1650 total
:306    Test Suites: 2 passed, 2 total              (infra)
:307    Tests:       14 passed, 14 total
:589    ok 1 - \#208 R22: E2E_SETUP_CMD siembra el catálogo de vacunas entre migrar y aprovisionar
        (node --test: 28/28, 5/5, 16/16, 0 fail; 0 líneas «not ok» en todo el log)
:192291 Test Suites: 178 passed, 178 total          (móvil)
:192292 Tests:       6540 passed, 6540 total
:192296 ✅ Tests pasados
:192326 ✅ Esquema y recursos e2e listos
:192697 Test Suites: 3 skipped, 33 passed, 33 of 36 total
:192698 Tests:       8 skipped, 599 passed, 607 total
:192702 ✅ Tests e2e pasados
:192714 ✅ Lint sin errores
:192718 ✅ Typecheck sin errores
:192721 ✅ Todo verde. Listo para trabajar.
última  init=0
```
Cómo se comprobaron las condiciones que dejó el veredicto provisional:
- **El e2e nuevo pasó dentro de la suite completa.** El reporter de jest no es verbose y el nombre del fichero
  no sale en el log, así que se probó por cuenta:
  - en HEAD hay 36 `*.e2e-spec.ts`, frente a 35 en H0;
  - los 3 suites saltados son los `aws-real-{ingest,media,smoke}`, con `describe.skip` preexistente;
  - el fichero nuevo no tiene ningún `skip`/`only`.

  Por tanto `vaccine-catalog-migration.e2e-spec.ts` está entre los 33 suites que pasaron, con sus 7 its.
  `health-vaccines.e2e-spec.ts` también.
- **`init-e2e-gate` R22 en verde** (:589).
- **Ningún fallo de test.** Los 54 «●» del log son todos `● Console`.
- **Árbol limpio.** Tras el `lint --fix` solo quedaba el review sin trackear, según el leader. El merge en curso
  que se ve ahora es posterior (ver O1).
- **Sin regresiones.** Backend unit da 1650, igual que U0.
