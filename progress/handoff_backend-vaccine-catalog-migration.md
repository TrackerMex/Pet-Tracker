Worktree: /home/claude/sites/Pet-Tracker-wt-226
NO lances ./init.sh aunque AGENTS.md lo pida. Lo corre el leader, porque comparte LocalStack y Postgres con otros worktrees.
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-226 && pwd && git branch --show-current && git log --oneline -3`. Salida esperada: esa ruta, la branch `feature/226-backend-vaccine-catalog-migration` y tres commits. Arriba está el del leader que trae este handoff, debajo `de9c5373 chore(spec): firma delegada #226 (…)` y debajo `6ad2e3b8 docs(spec): #226 backend-vaccine-catalog-migration`. Después, `git diff --name-only de9c5373 HEAD` → solo `progress/handoff_backend-vaccine-catalog-migration.md`. Si algo no coincide, PARA y escríbelo en el reporte.

Feature: backend-vaccine-catalog-migration (#226, backend). Branch: feature/226-backend-vaccine-catalog-migration. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): `de9c5373`. Encima de H0 solo está el commit del leader con este handoff, y ese commit no cuenta como tuyo en ninguna guarda.
- El backend en H0 es byte a byte el de `origin/dev` (`af50564f`).
- NO hagas `git merge` ni `git rebase`: la receta de design.md §Migración y coordinación la aplica el leader si hace falta.
Spec aprobada: specs/backend-vaccine-catalog-migration/requirements.md (`status: approved`, firma delegada). Lee también design.md y tasks.md antes de empezar.
- tasks.md manda en el orden, en la forma de cada commit, en sus mensajes literales y en sus locks. Lee sus «Reglas de la cadena».
- design.md manda en el contenido literal del `.sql` (§La migración), en la estructura del e2e (§El e2e) y en el bloque de smoke (§Paso de smoke).
- No hay decisiones abiertas: no hay nada que preguntar.
Orden: R1 (test, feat), R2 (test, feat), R3 (test, nace verde), mutaciones locales, R4 (docs), R5 (solo medidas), y por último la trazabilidad. Es el orden de tasks.md.
Criterios de aceptación: R1 a R5 de requirements.md. **La casilla de R4 NO es tuya:** el smoke lo corre solo el humano en su PC. No lo ejecutes, no lo simules y no marques su casilla.

Entorno:
- El worktree ya tiene `.env` en la raíz y `backend-pet-tracker/node_modules` instalado.
- El `.env` apunta a la base propia `pet_tracker_wt226`, en el puerto 5433, recién creada y vacía. No lo abras, no lo leas, no lo regeneres y no lo imprimas: lo cargan `drizzle.config.ts` y el e2e solos.
- No añadas dependencias: `backend-pet-tracker/package.json` y `backend-pet-tracker/pnpm-lock.yaml` no cambian, y no corras `pnpm install`. `drizzle-orm` 0.45.2, `drizzle-kit` 0.31.10, `pg` y `dotenv` ya están.
- Antes de cada `drizzle-kit generate`, `test -z "${DATABASE_URL:-}"; echo $?` → 0. Un `DATABASE_URL` exportado en la shell pisa al `.env`; si sale 1, PARA.
- **Nunca** `pnpm run db:migrate` ni `drizzle-kit migrate` en este worktree: el e2e migra sus propias bases desechables.
Árbol limpio, tras cada commit (desde backend-pet-tracker/): `git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"; echo $?` → 0. No lo pongas antes del commit: lo stageado sale en `git status`.

Archivos (lista cerrada; si necesitas otro, PARA y anótalo en el reporte). Rutas bajo backend-pet-tracker/ salvo indicación.
Producción nueva (la genera drizzle-kit en R1 feat):
  - src/db/migrations/0023_vaccine_catalog_data.sql (drizzle-kit `--custom`, más el `INSERT` literal de design.md; es el único fichero de migraciones que editas a mano)
  - src/db/migrations/meta/0023_snapshot.json (drizzle-kit, sin editar)
Producción modificada:
  - src/db/migrations/meta/_journal.json (lo modifica drizzle-kit, sin editar)
Test nuevo:
  - test/vaccine-catalog-migration.e2e-spec.ts (R1, R2, R3)
Documentos (desde la raíz del repo):
  - progress/smoke_mejoras-smoke.md (solo añadir al final el bloque de design.md §Paso de smoke, en R4)
  - specs/backend-vaccine-catalog-migration/traceability.md (solo en el último commit)
  - progress/impl_backend-vaccine-catalog-migration.md, tu reporte. No entra en ningún commit: lo commitea el leader.
  - progress/*.log, tus logs, que git ignora.
No tocar:
- las migraciones 0000 a 0022 y sus snapshots; src/db/schema/**; src/db/seed/** (salvo la mutación local S1, que se revierte);
- scripts/seed-vaccines.ts, src/modules/**, src/app.module.ts y src/main.ts;
- en test/, el resto (también test/health-vaccines.e2e-spec.ts) y test/jest-e2e.json;
- package.json, pnpm-lock.yaml, drizzle.config.ts y .env;
- desde la raíz: mobile-pet-tracker/, init.sh, init.config.sh, init-e2e-gate.test.mjs, docker-compose*.yml;
- de la spec, specs/backend-vaccine-catalog-migration/requirements.md, design.md y tasks.md;
- de progress/, firma_*, history.md, current.md y handoff_*.md;
- feature_list.json, STATUS.md, AGENTS.md y CLAUDE.md.

Reglas críticas:
  - Prohibido:
    - `./init.sh`;
    - `pnpm run db:migrate`, `drizzle-kit migrate` y psql crudo (sobre el journal o sobre cualquier base);
    - crear recursos AWS, leer `.env` o cualquier clave;
    - `git rebase`, `git merge`, `git push`, `gh pr create` y renumerar o editar a mano `meta/_journal.json` o los snapshots;
    - matar procesos ajenos o bases ajenas. El e2e solo crea y borra `pet_tracker_226_a_<runId>` y `pet_tracker_226_b_<runId>`.
  - Si el sandbox te deniega algo, PARA y anótalo; no lo rodees.
  - Commits test-primero, separados: el rojo solo con el test y el verde con la migración. Mensajes literales de tasks.md. `git add <rutas explícitas>`; nunca `git add -A`, `git add .` ni `commit -a`.
  - Cada cadena de comandos acaba en `git commit -m "…"` o en un comando de medida; las cabeceras de este fichero no son comandos.
  - El rojo falla por aserción (`expect`), nunca por `ReferenceError`, `TypeError` en un `beforeAll`, `Cannot find module`, un error de tipos de ts-jest ni una excepción. Antes de commitear un rojo, mira en el log que el fallo es un `expect` y que solo fallan los its que este handoff da por rojos.
  - Los literales de requirements.md §Catálogo canónico (las 7 filas con su `scheme`), las fechas `2024-02-29`/`2025-02-28` y el `boosterMonths: 36` de R2 se **escriben** a mano en el test. El test no importa `VACCINE_CATALOG_SEED` ni lee el `.sql`. `seedVaccineCatalog` se importa solo como acción (R2 y R3).
  - Lint: `response.body` se castea a un tipo explícito. No uses `expect.any(...)` como valor de propiedad en un objeto literal, porque eslint (`no-unsafe-assignment`) lo tumba: compara literales o extrae el campo y asértalo aparte.
  - El comentario del `.sql` va en ASCII y sin el carácter almohadilla (design.md §La migración).
  - Si una cifra, ancla o salida no coincide con la que da este handoff, PARA y anota la diferencia. No ajustes la cifra.
  - Un `ENOENT` o un `Cannot find module` justo después de crear un fichero suele ser un error de invocación (ruta mal escrita, `cd` que falta): revisa el comando antes de tocar código.
  - Los ficheros «No tocar», las casillas de aprobación y de smoke y el `status` del frontmatter no son tuyos. Tampoco feature_list.json, STATUS.md, progress/history.md y progress/current.md.
  - NO abras la PR ni la edites: la abre el leader al cerrar, con el veredicto en la mano.

Comandos. Todos desde backend-pet-tracker/, después de este cd literal:
  cd /home/claude/sites/Pet-Tracker-wt-226/backend-pet-tracker && pwd
  - e2e nuevo: `pnpm exec jest --config ./test/jest-e2e.json test/vaccine-catalog-migration.e2e-spec.ts > ../progress/e226-<paso>.log 2>&1; echo exit=$?`
  - unitarios: `pnpm exec jest --config package.json > ../progress/u226-<paso>.log 2>&1; echo exit=$?`
  - tipos: `pnpm exec tsc --noEmit -p tsconfig.json; echo exit=$?`
  `<paso>` es el nombre del paso sin espacios (`t0`, `r1-test`, `r1-feat`…). Nunca `pnpm run test -- …` ni `pnpm run test:e2e -- …`, porque el `--` llega a jest. Nunca `pnpm run lint`, porque lleva `--fix` sobre todo el árbol. Mide los exit codes sin pipe. De cada log pega en el reporte el `exit=`, la línea `Test Suites:` y la línea `Tests:`.

§Esperas. Antes de **cada** corrida de jest (unitaria o e2e) y de `drizzle-kit generate`, corre estos dos comandos, cada uno por separado:
  pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)|[j]est/bin/jest.js'
  pgrep -f '[i]nit.sh'
- Los dos tienen que salir vacíos (exit 1). Si alguno muestra procesos, son de otro worktree: espera unos minutos y vuelve a mirar. Ahora mismo la sesión Frontend corre `init.sh` en otros dos worktrees, uno tras otro: es normal que T0 tenga que esperar.
- Nunca esperes a `init.sh` en el mismo comando que lo busca, y nunca mates esos procesos.
- Si llevas más de 30 minutos esperando, anótalo en el reporte y sigue esperando.
- Un timeout aislado se repite tal cual, sin flags y con los dos pgreps vacíos, antes de tocar nada. Si se repite, PARA.
- Si Postgres no está arriba (`ECONNREFUSED`), PARA y anótalo: sin Postgres no hay rojo ni verde que medir.

Por commit, sobre los ficheros de ese commit (rutas relativas a backend-pet-tracker/):
  1. Si el commit toca el e2e: `pnpm exec prettier --write test/vaccine-catalog-migration.e2e-spec.ts`. Nunca prettier sobre src/db/migrations/**.
  2. Si el commit toca el e2e, sin pipes: `pnpm exec prettier --check test/vaccine-catalog-migration.e2e-spec.ts && pnpm exec eslint test/vaccine-catalog-migration.e2e-spec.ts && pnpm exec tsc --noEmit -p tsconfig.json; echo exit=$?` → 0. Si solo toca la migración: `pnpm exec tsc --noEmit -p tsconfig.json; echo exit=$?` → 0.
  3. Tras §Esperas, el e2e nuevo.
  4. `git add <rutas explícitas>` y luego `git commit -m "<mensaje literal de tasks.md>"` con el trailer de tu sesión.
  5. El árbol limpio de arriba → 0.

Anclas (desde la raíz del worktree, antes de T0). Pega cada salida en el reporte; si alguna difiere, PARA:
  cd /home/claude/sites/Pet-Tracker-wt-226 && pwd
  - las anclas de requirements.md §Anclas, copiadas tal cual. Cifras medidas por el leader en H0: el índice único de la 0009 → 1; `CREATE TABLE "vaccine_catalog"` solo en `0009_shallow_dust.sql`; `INSERT INTO "vaccine_catalog"` en migraciones → 0; `"tag"` del journal → 23; `name: 'Polivalente (DHPPi)',` → 1; la línea `seed:vaccines` de package.json → 1; `.orderBy(asc(vaccineCatalog.name));` → 1; `catalogId: z.uuid().optional(),` → 1; la `const entries = …` del móvil → 1.
  - `ls backend-pet-tracker/src/db/migrations/meta/*_snapshot.json | wc -l` → 23 (base) → 24 tras R1 feat
  - `ls backend-pet-tracker/src/db/migrations/*.sql | wc -l` → 23 (base) → 24 tras R1 feat

T0 (tras §Esperas): la suite unitaria `u226-t0`. Anota `U0` de su línea `Tests:`. Esta feature no añade ni cambia unitarios: en el Cierre la cuenta sigue siendo `U0`.

Cuenta encadenada del e2e nuevo (línea `Tests:` de `e226-<paso>.log`):
  - R1 test: 5 tests, 4 failed y 1 passed. Pasa solo `#226 R1: sin la migracion el catalogo queda vacio, como en la base del humano`. Los otros cuatro fallan por aserción: journal (0 entradas, se esperaba 1), GET dog (`[]`), GET cat (`[]`), POST (`rabia` es `undefined` en `expect(rabia).toBeDefined()`).
  - R1 feat: 5 passed. Después, los locks de tasks.md §R1 (con 24 donde dice «24 en f05016d3»).
  - R2 test: 6 tests, 1 failed (el de R2, porque `migrate(…)` rechaza por `vaccine_catalog_species_name_idx`) y 5 passed.
  - R2 feat: 6 passed. Después, los locks de tasks.md §R2 (`grep -c ''` → 11).
  - R3 test: 7 passed (nace verde). Después, su lock.
  - Mutaciones M1–M5 y S1 de tasks.md §Mutaciones, una a una, sobre el estado final; anota en el reporte el it rojo y la línea decisiva. El it `sin la migracion…` no se pone rojo con ninguna: no lo anotes como tal. Revierte con los comandos de tasks.md (`git checkout HEAD -- …`, `git status --short -- backend-pet-tracker | wc -l` → 0, `git diff --cached --name-only | wc -l` → 0). Ninguna mutación se commitea.
  - R4: bloque literal al final de `progress/smoke_mejoras-smoke.md`, sus dos locks → 1 y 1, y su commit.
  - R5: los comandos de tasks.md §R5, con `origin/dev...HEAD` sustituido por `de9c5373...HEAD`. Esperado: 0, 0, «No schema changes, nothing to migrate», 0 y la unitaria `u226-r5` verde con `U0` tests.

Cierre:
  - Último commit, solo specs/backend-vaccine-catalog-migration/traceability.md: rellena la columna «Commit» de R1–R5 con hash corto y mensaje (R1 y R2 el commit feat; R3 el commit de su test; R4 el de docs; R5 «sin commit propio» más el hash del último feat). Mensaje: `docs(backend-vaccine-catalog-migration): fill traceability`.
  - Guardas finales (desde la raíz del repo):
    - `git log --oneline de9c5373..HEAD | wc -l` → 8 (el del leader más tus 7: R1 test, R1 feat, R2 test, R2 feat, R3 test, R4 docs y la trazabilidad).
    - `git diff --name-only de9c5373 HEAD | sort` → exactamente estas 7 rutas: backend-pet-tracker/src/db/migrations/0023_vaccine_catalog_data.sql, backend-pet-tracker/src/db/migrations/meta/0023_snapshot.json, backend-pet-tracker/src/db/migrations/meta/_journal.json, backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts, progress/handoff_backend-vaccine-catalog-migration.md, progress/smoke_mejoras-smoke.md, specs/backend-vaccine-catalog-migration/traceability.md.
    - `git status --short -- backend-pet-tracker specs docs | wc -l` → 0.
  - El e2e completo y `init-e2e-gate.test.mjs` los corre el leader con `./init.sh`. Tú no.

Al terminar: escribe el resultado en progress/impl_backend-vaccine-catalog-migration.md (pwd y branch del primer comando, anclas, U0, cada `exit=`/`Test Suites:`/`Tests:`, los locks, la tabla de mutaciones, la salida de R5, las guardas finales y cualquier PARADA con su motivo).
Última acción: crea `progress/impl_backend-vaccine-catalog-migration.done` con una sola línea, la ruta `progress/impl_backend-vaccine-catalog-migration.md`. Git lo ignora y lo vigila scripts/harness/watch-impl.sh. Créalo también si paraste antes de terminar, con el motivo en el reporte.
