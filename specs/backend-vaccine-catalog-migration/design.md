---
feature: "backend-vaccine-catalog-migration"
status: approved     # draft | approved
tags: [harness, spec, backend, health, migration]
---

# Diseño — [[backend-vaccine-catalog-migration]]

> Decisiones técnicas de alto nivel de [[requirements]]. Las rutas son relativas
> a `backend-pet-tracker/`, salvo los documentos y lo que se diga.

## Decisiones técnicas

### D1. Migración de datos «custom» de drizzle-kit

- **Cómo se genera:**

  ```sh
  cd backend-pet-tracker && pnpm exec drizzle-kit generate --custom --name vaccine_catalog_data
  ```

- **Qué escribe drizzle-kit 0.31.10:**
  - `src/db/migrations/00NN_vaccine_catalog_data.sql`, cuya única línea es
    `-- Custom SQL migration file, put your code below! --`;
  - `meta/00NN_snapshot.json`, con el esquema actual, que no cambia;
  - una entrada en `meta/_journal.json` con `when: Date.now()`.

  En `f05016d3`, `00NN` = `0023` y el journal pasa de 23 a 24 tags.
- **Por qué `--custom` y no un `.sql` a mano:**
  - mantiene la cadena de snapshots;
  - el siguiente `drizzle-kit generate` de otra feature no ve nada pendiente;
  - el journal sale con el formato de siempre.
- **No se renumera ni se edita el journal a mano.**
- **Hash y bases ya migradas.** El migrador guarda el hash del `.sql` al aplicarlo,
  pero no lo vuelve a comparar. Si el `.sql` se edita después de un `db:migrate`
  en una base local, esa base **no** se re-aplica: hay que recrearla
  (§Supuestos de entorno). El e2e no tiene este problema, porque crea bases nuevas
  en cada corrida.

### D2. El seed se conserva

`seedVaccineCatalog` y la migración hacen trabajos distintos:

| | Migración `_vaccine_catalog_data` | `seed:vaccines` |
|---|---|---|
| Inserta las que faltan | sí | sí |
| Restaura `scheme` | no (`DO NOTHING`) | sí (`DO UPDATE SET scheme = excluded.scheme`) |
| Borra filas no canónicas | no | sí |
| Corre en | cada `db:migrate`, una sola vez por base | a mano, `E2E_SETUP_CMD` y el e2e de #14 |

- **Por qué `DO NOTHING` en la migración:**
  - una base sembrada no debe cambiar ni fallar (R2);
  - una migración nunca debe reescribir datos que alguien editó.
- **Por qué no se retira el seed:** retirarlo enmendaría #14 R2 y #208 R22 y sus
  tests (`src/db/seed/vaccine-catalog.spec.ts`, `test/health-vaccines.e2e-spec.ts`,
  `init-e2e-gate.test.mjs`), y el usuario no ganaría nada.
- **Por qué es inocuo tras la migración:** el upsert por `(species, name)` conserva
  los `id` que puso la migración (R3).

### D3. Ids con `gen_random_uuid()`

- La columna `id` no tiene default. Postgres 17 trae `gen_random_uuid()` (UUID v4)
  sin extensiones.
- `vaccine.dto.ts` valida `catalogId` con `z.uuid()`, que acepta v4. R1 lo prueba
  con un `POST` real.
- Una base ya sembrada conserva sus ids v7 (R2). La mezcla de versiones no importa:
  nadie ordena por `id` en el catálogo, solo por `name`.

### D4. Sin dependencias nuevas

El e2e usa:
- `migrate` de `drizzle-orm/node-postgres/migrator` (drizzle-orm 0.45.2 ya
  instalado; el mismo que usa `drizzle-kit migrate`);
- `Pool` de `pg`;
- `config` de `dotenv`;
- `node:fs`, `node:os` y `node:path`.

## La migración (contenido literal)

El `.sql` final es exactamente esto: la línea que escribe drizzle-kit, una línea
de comentario y una sentencia. No lleva `--> statement-breakpoint`, porque es una
sola sentencia.

```sql
-- Custom SQL migration file, put your code below! --
-- Feature 226: same 7 rows as src/db/seed/vaccine-catalog.ts; DO NOTHING keeps an already seeded database untouched.
INSERT INTO "vaccine_catalog" ("id", "species", "name", "scheme") VALUES
  (gen_random_uuid(), 'dog', 'Rabia', '{"firstDoseMonths":3,"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'dog', 'Polivalente (DHPPi)', '{"firstDoseMonths":2,"series":[2,3,4],"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'dog', 'Leptospirosis', '{"firstDoseMonths":3,"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'dog', 'Tos de las perreras', '{"firstDoseMonths":3,"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'cat', 'Triple felina (FVRCP)', '{"firstDoseMonths":2,"series":[2,3],"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'cat', 'Leucemia felina (FeLV)', '{"firstDoseMonths":2,"boosterMonths":12}'::jsonb),
  (gen_random_uuid(), 'cat', 'Rabia', '{"firstDoseMonths":3,"boosterMonths":12}'::jsonb)
ON CONFLICT ("species", "name") DO NOTHING;
```

- **Clave del conflicto.** `("species", "name")` infiere el índice único
  `vaccine_catalog_species_name_idx` de la 0009. Es la misma clave que usa el seed
  (`target: [vaccineCatalog.species, vaccineCatalog.name]`).
- **Sin `#` en el comentario.** El comentario va en ASCII y sin `#`.

## El e2e

Fichero nuevo: `test/vaccine-catalog-migration.e2e-spec.ts`. Lo recoge el
`testRegex` de `test/jest-e2e.json` (`.e2e-spec.ts$`), así que `init.sh` lo corre
con `E2E_CMD`. Solo toca Postgres, no LocalStack.

### Estructura y nombres

Un `describe('#226 vaccine catalog migration (e2e)')` con
`jest.setTimeout(180_000);` (el mismo patrón que `test/positions.e2e-spec.ts`),
y dentro, en este orden:

1. `describe('#226 R1: la migracion llena un catalogo vacio')`, con los cinco its de R1 en el orden de [[requirements]].
2. `describe('#226 R2: la migracion no cambia una base ya sembrada')`, con su it.
3. `describe('#226 R3: el seed sigue funcionando despues de la migracion')`, con su it. Va el último, porque escribe en la base A.

Los nombres de los its son los literales de [[requirements]].

### Preparación (prosa, no código)

- **Entorno.** `loadDotenv({ path: '../.env' })` en la cabecera del fichero, como en
  `test/resource-isolation.e2e-spec.ts`. Se guarda el `process.env.DATABASE_URL`
  original.
- **Bases desechables.**
  - Con `runId = Date.now()` se nombran `pet_tracker_226_a_<runId>` y `pet_tracker_226_b_<runId>`.
  - Sus URLs salen de `new URL(original)` cambiando solo `pathname`.
  - Un `Pool` admin conectado a la URL original las crea con `CREATE DATABASE "<nombre>"`.
- **Carpetas de migraciones.**
  - Carpeta real: `MIGRATIONS = join(__dirname, '..', 'src', 'db', 'migrations')`.
  - Carpeta «previa»:
    - `mkdtempSync(join(tmpdir(), 'pet-tracker-226-'))`;
    - `cpSync(MIGRATIONS, <tmp>, { recursive: true })`;
    - se reescribe `<tmp>/meta/_journal.json` con solo las entradas de `idx` menor que el de la nuestra.
  - La nuestra es la única entrada cuyo `tag` acaba en `_vaccine_catalog_data`.
  - **Si el journal aún no la tiene (commit rojo), la carpeta previa es el journal
    completo.** Así el rojo falla por aserción en los its, no por `TypeError` en el
    `beforeAll`.
- **Base A (R1 y R3)**, en el `beforeAll` del `describe` de R1:
  1. `migrate(drizzle(poolA), { migrationsFolder: <previa> })`.
  2. Se cuentan las filas de `vaccine_catalog` y se guardan para el it «sin la migracion…».
  3. `migrate(drizzle(poolA), { migrationsFolder: MIGRATIONS })`.
  4. `process.env.DATABASE_URL = <url A>`.
  5. Se arranca `AppModule` con `setGlobalPrefix('v1')`, igual que `test/health-vaccines.e2e-spec.ts`.
  6. Se toma `TOKEN_SERVICE`.

  `DATABASE_URL` se pone antes de compilar el módulo: dotenv no pisa una variable
  ya definida, el mismo mecanismo de `test/health.e2e-spec.ts` R8.
- **Usuario y mascota de R1** (solo en el it del `POST`).
  - Se inserta un `users` en A con el mismo patrón que `async function seedUser(`
    de `test/health-vaccines.e2e-spec.ts`, y se firma su token.
  - `POST /v1/pets` con `{ name, species: 'dog', birthDate: '2024-01-15' }`.
- **Base B (R2).** Todo va dentro del it, para que un fallo de la migración (por
  ejemplo, sin `ON CONFLICT`) falle solo ese it:
  1. migrar con la carpeta previa;
  2. `seedVaccineCatalog(drizzle(poolB))`;
  3. `UPDATE` del `scheme` de `dog`/`Rabia`;
  4. foto;
  5. `await expect(migrate(drizzle(poolB), { migrationsFolder: MIGRATIONS })).resolves.toBeUndefined()`;
  6. foto y comparación.
- **Fotos.** Las fotos son `select id, species, name, scheme from vaccine_catalog order by species, name`.
- **Lint.** `response.body` se castea a un tipo explícito, como en el resto de e2e.
  No hay `expect.any(...)` como valor de propiedad.
- **`afterAll`:**
  1. `app.close()`;
  2. `poolA.end()` y `poolB.end()`;
  3. restaurar `process.env.DATABASE_URL`;
  4. `DROP DATABASE IF EXISTS "<nombre>" WITH (FORCE)` para las dos;
  5. `admin.end()`;
  6. `rmSync(<tmp>, { recursive: true, force: true })`.

  Cada paso va protegido si su recurso no llegó a crearse, para que un `beforeAll`
  roto no deje bases huérfanas ni oculte su error con otro.

### Por qué no es tautológico

- Los valores esperados son el literal de [[requirements]] §Catálogo canónico,
  escrito a mano en el test: N = 4 y N = 3 por longitud literal.
- El test no importa `VACCINE_CATALOG_SEED` ni lee el `.sql` para sacar lo esperado.
- Lee el journal solo para preparar la carpeta previa, y para el it estructural
  de R1, que compara con un `1` literal.
- `seedVaccineCatalog` se importa solo como **acción** (R2 y R3), nunca como
  fuente de lo esperado.

### Mutaciones que el e2e debe atrapar

Son locales, no se commitean. Están en [[tasks]] §R1–R3.

| Mutación en el `.sql` o el journal | Rojo esperado |
|---|---|
| Quitar la fila `Leptospirosis` | R1 dog (longitud 3 ≠ 4) |
| `"series":[2,3]` → `[2,3,4]` en `Triple felina (FVRCP)` | R1 cat |
| Quitar `ON CONFLICT ("species", "name") DO NOTHING` | R2 (la migración rechaza por violación de unicidad) |
| `DO NOTHING` → `DO UPDATE SET "scheme" = excluded."scheme"` | R2 (`boosterMonths` 36 → 12) |
| `when` de nuestra entrada del journal → `1` | R1 journal y R1 dog/cat (el migrador la salta: 0 filas) |
| `'Rabia'` de dog → `'Rabia canina'` | R1 dog y R3 (el seed borra la fila migrada y cambia el id) |

## Archivos afectados

| Capa | Archivo | Cambio |
|---|---|---|
| infrastructure (db) | `src/db/migrations/00NN_vaccine_catalog_data.sql` | nuevo (drizzle-kit `--custom` más el `INSERT` literal) |
| infrastructure (db) | `src/db/migrations/meta/00NN_snapshot.json` | nuevo (drizzle-kit, sin editar) |
| infrastructure (db) | `src/db/migrations/meta/_journal.json` | +1 entrada (drizzle-kit, sin editar) |
| test (e2e) | `test/vaccine-catalog-migration.e2e-spec.ts` | nuevo |
| docs | `progress/smoke_mejoras-smoke.md` (raíz del repo) | +1 sección con su casilla (R4) |
| docs | `specs/backend-vaccine-catalog-migration/traceability.md` | filas rellenas al final |

Ni domain ni application cambian. No se toca ningún fichero de `src/` fuera de
`src/db/migrations/`, ni de `mobile-pet-tracker/` (R5).

## Migración y coordinación con otras features

Si antes de la PR `git ls-tree origin/dev backend-pet-tracker/src/db/migrations/`
muestra una `00NN` que esta branch no tiene, se aplica la misma receta que #210,
#211 y #212. Se respetan el orden y los comandos literales. Nunca se rebasea ni se
renumera a mano.

1. `git merge origin/dev`.
2. `git checkout origin/dev -- backend-pet-tracker/src/db/migrations/meta`.
3. `git rm backend-pet-tracker/src/db/migrations/00NN_vaccine_catalog_data.sql`, con el número que tenga en ese momento.
4. `git diff --name-status origin/dev -- backend-pet-tracker/src/db/migrations | wc -l` debe dar `0`.
5. `git commit --no-edit`.
6. `cd backend-pet-tracker && pnpm exec drizzle-kit generate --custom --name vaccine_catalog_data`. Luego se vuelve a pegar el contenido literal de §La migración.
7. `grep -cF '"tag"' src/db/migrations/meta/_journal.json` = la cuenta de `origin/dev` + 1. La cuenta base se mide con `git show origin/dev:backend-pet-tracker/src/db/migrations/meta/_journal.json | grep -cF '"tag"'`.
8. Commit propio: `chore(backend-vaccine-catalog-migration): regenerate migration after merging dev (R1)`.
9. Recrear la base del worktree (§Supuestos de entorno) antes del siguiente `db:migrate`.
10. Volver a correr las suites unitaria y e2e.

## Supuestos de entorno (los prepara el leader, no Codex)

- **Base propia del worktree.** Antes del primer `db:migrate` o `./init.sh` en este
  worktree, su `.env` apunta a una base propia, `pet_tracker_wt226`.
  - Se crea como en `docs/conventions.md` §«Postgres: una base por worktree»:
    `docker exec pet-tracker-postgres psql -U pet_tracker -d postgres -c 'CREATE DATABASE pet_tracker_wt226 OWNER pet_tracker;'`.
  - Motivo: si la migración se aplica a la base compartida `pet_tracker` antes de
    mergear, su `created_at` queda como el último. El migrador saltaría en silencio
    cualquier migración de otra branch generada antes (memoria
    `journal-migraciones-desincronizado-vps`).
- **El e2e no depende de esa base.** Solo usa `DATABASE_URL` para conectarse como
  admin y crear o borrar sus dos bases. El rol `pet_tracker` puede crear bases: es
  el `POSTGRES_USER` de `docker-compose.yml`, superusuario, y en CI pasa lo mismo.
- **Codex no corre `db:migrate` ni `./init.sh`.** Corre `drizzle-kit generate`, que
  no se conecta a la base pero necesita `../.env` con `DATABASE_URL`, y el e2e
  puntual.

## Techo conocido

El catálogo vive en dos sitios: la migración, que es inmutable una vez mergeada, y
`VACCINE_CATALOG_SEED`. Cambiar el contenido exige **las dos cosas**: una
migración nueva y la edición del seed.

- Si solo se añade una migración, `seed:vaccines` borra la fila nueva por no ser
  canónica, o falla por la FK `pet_vaccines.catalog_id` si ya tiene vacunas.
- Si solo se edita el seed, las bases que no corren el seed no ven el cambio.

La mejora, si llega a hacer falta: que el seed lea su lista de una única fuente
compartida con un test que compare ambas. Hoy son 7 filas estables desde #14; no
se hace.

## Paso de smoke (R4, literal)

Se añade al final de `progress/smoke_mejoras-smoke.md`, en el commit de docs de la
cadena. El texto va tal cual:

```markdown
## #226 backend-vaccine-catalog-migration

Hallazgo: «En agregar vacuna no aparecen las opciones de vacunas solo aparece el boton "Otra vacuna"».
Solo cambia el backend: no hace falta dev build nuevo ni reinstalar la app.

1. Antes de actualizar, con el backend de tu PC tal como está, abre un perro y entra en Salud → «Agregar vacuna». Debe salir solo «Otra vacuna»: es el fallo. Si ya corriste el paliativo `seed:vaccines`, en esa base el fallo no se reproduce; anótalo y sigue.
2. Actualiza el repo a `dev`, corre `pnpm -C backend-pet-tracker run db:migrate` (debe terminar sin error) y reinicia el backend.
3. «Agregar vacuna» en el perro: salen Leptospirosis, Polivalente (DHPPi), Rabia y Tos de las perreras, y después «Otra vacuna».
4. «Agregar vacuna» en un gato: salen Leucemia felina (FeLV), Rabia y Triple felina (FVRCP), y después «Otra vacuna».
5. Registra Rabia en el perro: aparece en Salud con su próxima dosis.

- [ ] Smoke de #226 pasado (fecha: ____; paso 1, fallo reproducido: sí / no)
```

## Alternativas descartadas

- **Retirar el seed y dejar solo la migración.** Enmienda dos specs aprobadas y
  pierde la canonicalización (D2).
- **`DO UPDATE` en la migración.** Reescribiría esquemas editados en bases ya
  sembradas. Una migración no debe pisar datos (R2).
- **Llamar a `seed:vaccines` desde `db:migrate` o desde el arranque de Nest.**
  Mezcla migración y seed en un script nuevo, y el arranque escribiría en la base
  en cada boot.
- **Un `.sql` escrito a mano, sin `drizzle-kit generate --custom`.** Rompe la
  cadena de snapshots y el siguiente `generate` de otra feature.
- **Ids literales en la migración.** No aportan nada: las bases ya sembradas
  conservan sus ids v7 (R2).
- **Probar la migración contra la base compartida.** Ya está sembrada por
  `E2E_SETUP_CMD`, así que no reproduciría el caso del humano, y escribir en ella
  rompe el aislamiento entre worktrees. Por eso hay bases desechables.
- **Un test unitario que lea el `.sql` y compare con el seed.** Sería
  tautológico respecto a la migración y no prueba que el migrador la aplique. El
  e2e prueba el efecto.
