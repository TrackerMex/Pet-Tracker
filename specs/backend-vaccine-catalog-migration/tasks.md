---
feature: "backend-vaccine-catalog-migration"
status: draft     # draft | approved
tags: [harness, spec, backend, health, migration]
---

# Tareas — [[backend-vaccine-catalog-migration]]

> Disciplina TDD (CHECKPOINTS C4). Cada requisito de [[requirements]] tiene sus
> tres pasos: (1) test rojo, (2) implementación mínima y (3) refactor. El
> contenido de la migración, la estructura del e2e y las mutaciones están en
> [[design]]. Las rutas son relativas a `backend-pet-tracker/`, salvo los
> documentos y los comandos marcados «desde la raíz».

## Reglas de la cadena

- **Antes de empezar.** La casilla de aprobación de [[requirements]] tiene que
  estar marcada.
- **Commits test-primero, separados.** Cada commit lleva el mensaje literal de su
  bloque. No se mezclan implementación y tests en un mismo commit.
- **El rojo falla por aserción**, nunca por `ReferenceError`, `TypeError` en un
  `beforeAll`, `Cannot find module` ni un error de tipos.
  - Por eso la carpeta previa usa el journal completo cuando aún no existe la
    entrada `_vaccine_catalog_data` ([[design]] §Preparación).
  - Por eso el it del `POST` comprueba `expect(rabia).toBeDefined()` antes de usarlo.
- **Cada commit compila.** `pnpm exec tsc --noEmit -p tsconfig.json` sale con 0, y
  `pnpm exec eslint test/vaccine-catalog-migration.e2e-spec.ts` también.
- **Formato.** `pnpm exec prettier --write test/vaccine-catalog-migration.e2e-spec.ts`
  antes de cada commit que toque el e2e. Prettier no formatea `.sql` ni `.json` de
  `meta/`, que no se editan a mano salvo el `.sql`.
- **Prohibido:**
  - `./init.sh` (lo corre el leader);
  - `pnpm run db:migrate` contra la base del `.env`;
  - `psql` crudo sobre el journal;
  - rebase;
  - renumerar o editar a mano `meta/_journal.json` o los snapshots;
  - tocar AWS.
- **Trazabilidad.** No se toca [[traceability]] durante la cadena. Al final, un
  único commit rellena todas las filas (§Cierre).
- **Mensajes de commit.** Todos terminan con el trailer de la sesión que commitea.

Comandos de verificación (desde `backend-pet-tracker/`):

```sh
pnpm exec jest --config ./test/jest-e2e.json test/vaccine-catalog-migration.e2e-spec.ts   # e2e puntual
pnpm exec jest --config package.json                                                     # suite unitaria
pnpm exec tsc --noEmit -p tsconfig.json
```

Nunca `pnpm run test:e2e -- …`: el `--` llega a jest (memoria
`pnpm-dobleguion-llega-a-jest`).

## R1 — La migración llena un catálogo vacío

- [ ] (1) Rojo: crear `test/vaccine-catalog-migration.e2e-spec.ts` con:
  - el `describe` externo;
  - el `describe('#226 R1: la migracion llena un catalogo vacio')`, con su `beforeAll` de la base A;
  - los cinco its de R1, con los nombres literales de [[requirements]] R1;
  - el `afterAll` de [[design]] §Preparación, solo para la base A.

  Los esperados son el literal de [[requirements]] §Catálogo canónico, escrito a mano.
  - Fallan por aserción:
    - `el journal registra…` (0 entradas, se esperaba 1);
    - `GET dog…` (`[]`);
    - `GET cat…` (`[]`);
    - `una vacuna del catalogo migrado…` (`rabia` es `undefined`).
  - Nace verde: `sin la migracion el catalogo queda vacio…`. Es el ancla anti-vacuidad, y su mutación es la del `when` de §Mutaciones.
  - Commit: `test(backend-vaccine-catalog-migration): catalog e2e on a database migrated without the seed (R1)`.
- [ ] (2) Verde:
  1. Generar la migración: `pnpm exec drizzle-kit generate --custom --name vaccine_catalog_data`.
  2. Debajo de la línea que escribe drizzle-kit, pegar el `INSERT … VALUES` de
     [[design]] §La migración con sus 7 filas, **sin** la línea de comentario
     `-- Feature 226: …` y **sin** `ON CONFLICT`. La última fila termina en `;`.

  El journal y el snapshot quedan como los deja drizzle-kit.
  - Commit: `feat(backend-vaccine-catalog-migration): vaccine catalog data migration (R1)`.
- [ ] (3) Refactor: ninguno previsto.
- Locks (tras el verde):

  ```sh
  ls src/db/migrations/*_vaccine_catalog_data.sql | wc -l                         # 1
  ls src/db/migrations/meta/*_snapshot.json | wc -l                               # 24 en f05016d3 (base + 1)
  grep -cF '"tag"' src/db/migrations/meta/_journal.json                           # 24 en f05016d3 (base + 1)
  grep -cF -e '-- Custom SQL migration file, put your code below! --' src/db/migrations/*_vaccine_catalog_data.sql   # 1
  grep -cF '(gen_random_uuid(), ' src/db/migrations/*_vaccine_catalog_data.sql    # 7
  grep -cE 'CREATE|ALTER|DROP' src/db/migrations/*_vaccine_catalog_data.sql       # 0
  grep -lF 'CREATE TABLE "vaccine_catalog"' src/db/migrations/*.sql               # solo src/db/migrations/0009_shallow_dust.sql
  grep -rlF 'INSERT INTO "vaccine_catalog"' src/db/migrations | wc -l             # 1
  ```

  Si `origin/dev` ganó migraciones antes de la PR, la cifra 24 pasa a ser la
  cuenta de `origin/dev` más 1 ([[design]] §Migración y coordinación, paso 7).

## R2 — Idempotente sobre una base ya sembrada

- [ ] (1) Rojo: añadir el `describe('#226 R2: la migracion no cambia una base ya sembrada')`
  con su it literal. La base B, su pool y su `DROP` en el `afterAll` van con
  [[design]] §Preparación.
  - Falla por aserción: `expect(migrate(…)).resolves` recibe el rechazo por
    violación de `vaccine_catalog_species_name_idx`.
  - Commit: `test(backend-vaccine-catalog-migration): migrating an already seeded database changes nothing (R2)`.
- [ ] (2) Verde: el `.sql` queda **exactamente** como [[design]] §La migración. Hay
  que añadir la línea de comentario `-- Feature 226: …` como segunda línea y
  cerrar con `ON CONFLICT ("species", "name") DO NOTHING;`.
  - Commit: `feat(backend-vaccine-catalog-migration): skip catalog rows that already exist (R2)`.
- [ ] (3) Refactor: ninguno previsto.
- Locks (tras el verde):

  ```sh
  grep -c '' src/db/migrations/*_vaccine_catalog_data.sql                                    # 11
  grep -cF 'ON CONFLICT ("species", "name") DO NOTHING;' src/db/migrations/*_vaccine_catalog_data.sql   # 1
  grep -cF -e '-- Feature 226: same 7 rows as src/db/seed/vaccine-catalog.ts; DO NOTHING keeps an already seeded database untouched.' src/db/migrations/*_vaccine_catalog_data.sql   # 1
  grep -cF 'DO UPDATE' src/db/migrations/*_vaccine_catalog_data.sql                          # 0
  grep -cF '#' src/db/migrations/*_vaccine_catalog_data.sql                                  # 0
  ```

## R3 — El seed sigue siendo compatible después de la migración

- [ ] (1) Test: añadir el `describe('#226 R3: el seed sigue funcionando despues de la migracion')`
  con su it literal, **después** del de R2. Usa la base A, ya migrada por el
  `beforeAll` de R1.
  - **Nace verde**: es un test de caracterización del seed conservado (D2). Su
    mordida se prueba con la mutación S1 de §Mutaciones.
  - Commit: `test(backend-vaccine-catalog-migration): seed after the migration keeps the catalog ids (R3, nace verde)`.
- [ ] (2) Verde: sin cambio de producción.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF "it('#226 R3: seed:vaccines sobre el catalogo migrado conserva las 7 filas y sus ids'" test/vaccine-catalog-migration.e2e-spec.ts   # 1
  ```

## Mutaciones (tras R3, sobre el estado final; locales, no se commitean)

Se aplica cada mutación sola, se corre el e2e puntual y se anota en
`progress/impl_backend-vaccine-catalog-migration.md`:
- el it que pasa a rojo;
- la línea decisiva del error.

Después se revierte. El e2e crea bases nuevas en cada corrida, así que no hay
estado viejo que absuelva una mutación.

| Id | Fichero | Mutación | Rojo exigido (al menos) |
|---|---|---|---|
| M1 | `.sql` | borrar la fila `'Leptospirosis'` | `#226 R1: GET dog…` |
| M2 | `.sql` | `"series":[2,3]` → `"series":[2,3,4]` en `Triple felina (FVRCP)` | `#226 R1: GET cat…` |
| M3 | `.sql` | quitar la línea `ON CONFLICT …` y cerrar la última fila con `;` | `#226 R2: …` |
| M4 | `.sql` | `DO NOTHING` → `DO UPDATE SET "scheme" = excluded."scheme"` | `#226 R2: …` |
| M5 | `meta/_journal.json` | `when` de nuestra entrada → `1` | `#226 R1: el journal registra…` y `#226 R1: GET dog…` |
| S1 | `src/db/seed/vaccine-catalog.ts` | en el `set` de `onConflictDoUpdate`, añadir la clave `id` con el valor SQL `excluded.id`, con el mismo patrón que `scheme` (el seed reescribe los ids, o lanza por la FK de la vacuna que registró R1) | `#226 R3: …` |

Tras revertir, desde la raíz:

```sh
git checkout HEAD -- backend-pet-tracker/src/db/migrations backend-pet-tracker/src/db/seed
git status --short -- backend-pet-tracker | wc -l      # 0
git diff --cached --name-only | wc -l                  # 0
```

## R4 — Paso de smoke (gate humano)

- [ ] Añadir al final de `progress/smoke_mejoras-smoke.md` el bloque literal de
  [[design]] §Paso de smoke. Va desde la raíz.
  - Commit: `docs(backend-vaccine-catalog-migration): smoke step that reproduces the empty catalog (R4)`.
- Lock (desde la raíz). Es tolerante a la casilla marcada:

  ```sh
  grep -cE '^- \[[ xX]\] Smoke de #226 pasado \(fecha: ' progress/smoke_mejoras-smoke.md   # 1
  grep -cF 'En agregar vacuna no aparecen las opciones de vacunas solo aparece el boton "Otra vacuna"' progress/smoke_mejoras-smoke.md   # 1
  ```

- La casilla **no** la marca ninguna IA.

## R5 — Alcance

Sin commit propio. Se verifica al final de la cadena (desde la raíz, salvo lo indicado):

```sh
git diff --name-only origin/dev...HEAD -- mobile-pet-tracker backend-pet-tracker/src/db/seed backend-pet-tracker/scripts/seed-vaccines.ts init.config.sh init-e2e-gate.test.mjs backend-pet-tracker/package.json backend-pet-tracker/pnpm-lock.yaml backend-pet-tracker/src/db/schema | wc -l   # 0
git diff --name-only origin/dev...HEAD -- backend-pet-tracker/src | grep -vc '^backend-pet-tracker/src/db/migrations/'   # 0
cd backend-pet-tracker && pnpm exec drizzle-kit generate      # imprime «No schema changes, nothing to migrate»
git status --short -- src/db/migrations | wc -l               # 0 (generate no creó nada)
pnpm exec jest --config package.json                          # verde: incluye src/db/seed/vaccine-catalog.spec.ts y src/db/schema/health.schema.spec.ts
```

El e2e completo y `init-e2e-gate.test.mjs` los corre el leader con `./init.sh`.

## Cierre

- [ ] Rellenar todas las filas de [[traceability]] con el test y el hash del commit verde. Para R3, el commit del test; para R4, el commit de docs.
  - Commit: `docs(backend-vaccine-catalog-migration): fill traceability`.
- La cadena no se rebasea después: invalidaría los hashes (memoria `rebase-invalida-hashes-traceability`).
- `progress/impl_backend-vaccine-catalog-migration.md` recoge:
  - la cuenta de tests del e2e puntual;
  - la tabla de §Mutaciones;
  - la salida de los comandos de R5.
