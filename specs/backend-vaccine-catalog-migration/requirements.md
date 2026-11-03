---
feature: "backend-vaccine-catalog-migration"
status: approved     # draft | approved
tags: [harness, spec, backend, health, migration]
---

# Requisitos — [[backend-vaccine-catalog-migration]]

> Feature #226. Notación EARS. Cada requisito tiene un id único R<n>, que no
> cambia una vez aprobado. Las decisiones técnicas están en [[design]], los
> pasos TDD en [[tasks]] y la evidencia en [[traceability]]. Las reglas de capas
> están en [[../../docs/architecture|architecture]].
>
> - Base medida: `origin/dev` en `f05016d3`.
> - Branch: `feature/226-backend-vaccine-catalog-migration`. La PR va contra `dev`.
> - Capa: solo backend (`backend-pet-tracker/`), en concreto una migración de
>   datos y un e2e nuevo. **`mobile-pet-tracker/` no se toca** (R5).
> - Las rutas son relativas a la raíz del repo, salvo que se diga otra cosa.

## Hallazgo del smoke (texto literal del humano)

Mensaje del humano del 2026-11-03, registrado en
`progress/plan_mejoras-smoke-2026-11-03.md` §1:

> «En agregar vacuna no aparecen las opciones de vacunas solo aparece el boton "Otra vacuna"»

## Causa verificada contra el árbol

La premisa del plan (§2, #226) se comprobó contra el árbol en `f05016d3`:

1. **La app pinta solo «Otra vacuna» cuando la lista llega vacía.**
   - `mobile-pet-tracker/src/screens/vaccine-create/index.tsx` calcula
     `const entries = catalog.data?.kind === 'ok' ? catalog.data.entries : [];`
     y añade «Otra vacuna» detrás.
   - La especie no es la causa: la app manda `cat` o `dog`, y el repositorio solo
     filtra `species = $1` y ordena con `.orderBy(asc(vaccineCatalog.name))`.
2. **Ninguna migración inserta filas en el catálogo.**
   - `0009_shallow_dust.sql` crea `vaccine_catalog` y el índice único
     `vaccine_catalog_species_name_idx` sobre `("species","name")`, pero no tiene
     ningún `INSERT`.
   - Solo lo llena `pnpm run seed:vaccines`, que corre `seedVaccineCatalog` desde
     `backend-pet-tracker/scripts/seed-vaccines.ts`.
3. **Por qué los e2e no lo vieron.** El seed se corre en dos sitios:
   - en `init.config.sh` (`E2E_SETUP_CMD`, #208 R22);
   - en el `beforeAll` de `backend-pet-tracker/test/health-vaccines.e2e-spec.ts`.

   El PC del humano no lo corrió nunca.
4. **El endpoint responde 200 con `[]`, no da error.**
   - El smoke de #208 (`progress/smoke_mejoras-producto.md`, 2026-10-30) pasó
     el alta y la lista de vacunas en Salud, así que la 0009 está aplicada en esa
     base.
   - Un error del endpoint también daría el mismo síntoma en pantalla. Esa
     variante es otra cosa y queda en §Fuera de alcance.

## Anclas en el árbol (medidas en `f05016d3`)

Rutas de `backend-pet-tracker/` relativas a esa carpeta. Se corren desde ella.

```sh
grep -cF 'CREATE UNIQUE INDEX "vaccine_catalog_species_name_idx" ON "vaccine_catalog" USING btree ("species","name");' src/db/migrations/0009_shallow_dust.sql   # 1
grep -lF 'CREATE TABLE "vaccine_catalog"' src/db/migrations/*.sql        # src/db/migrations/0009_shallow_dust.sql (una sola línea)
grep -rlF 'INSERT INTO "vaccine_catalog"' src/db/migrations | wc -l       # 0  (ancla negativa: tras R1, 1)
git show origin/dev:backend-pet-tracker/src/db/migrations/meta/_journal.json | grep -cF '"tag"'   # 23  (tras R1, 24)
grep -cF "name: 'Polivalente (DHPPi)'," src/db/seed/vaccine-catalog.ts   # 1
grep -cF '"seed:vaccines": "ts-node -r tsconfig-paths/register scripts/seed-vaccines.ts"' package.json   # 1
grep -cF '.orderBy(asc(vaccineCatalog.name));' src/modules/health/infrastructure/repositories/vaccine.drizzle.repository.ts   # 1
grep -cF 'catalogId: z.uuid().optional(),' src/modules/health/application/dto/vaccine.dto.ts   # 1
```

La de móvil se corre desde la raíz del repo:

```sh
grep -cF "const entries = catalog.data?.kind === 'ok' ? catalog.data.entries : [];" mobile-pet-tracker/src/screens/vaccine-create/index.tsx   # 1
```

**Ancla negativa del test de #14.**
- `readHealthMigrationSql()` de `src/db/schema/health.schema.spec.ts` busca la
  migración de #14 por el texto `CREATE TABLE "vaccine_catalog"`.
- La migración nueva **no** puede contener ese texto, ni ningún `CREATE`, `ALTER`
  o `DROP`.
- Tras el cambio, el `grep -lF` de arriba sigue dando una sola línea, la 0009.
  Se verifica en [[tasks]] §R1.

## Catálogo canónico (literal)

Son las mismas 7 entradas que `VACCINE_CATALOG_SEED` en
`backend-pet-tracker/src/db/seed/vaccine-catalog.ts`, y las fija #14 R2. Esta
tabla es la fuente de los literales de la migración y de los tests. Los tests
escriben estos valores **a mano** y no los importan del seed ni de producción.

| species | name | scheme (JSON exacto) |
|---|---|---|
| dog | Rabia | `{"firstDoseMonths":3,"boosterMonths":12}` |
| dog | Polivalente (DHPPi) | `{"firstDoseMonths":2,"series":[2,3,4],"boosterMonths":12}` |
| dog | Leptospirosis | `{"firstDoseMonths":3,"boosterMonths":12}` |
| dog | Tos de las perreras | `{"firstDoseMonths":3,"boosterMonths":12}` |
| cat | Triple felina (FVRCP) | `{"firstDoseMonths":2,"series":[2,3],"boosterMonths":12}` |
| cat | Leucemia felina (FeLV) | `{"firstDoseMonths":2,"boosterMonths":12}` |
| cat | Rabia | `{"firstDoseMonths":3,"boosterMonths":12}` |

Ordenadas por `name` (como las devuelve el endpoint):
- **dog, N = 4:** Leptospirosis, Polivalente (DHPPi), Rabia, Tos de las perreras.
- **cat, N = 3:** Leucemia felina (FeLV), Rabia, Triple felina (FVRCP).

Todos los nombres son ASCII y empiezan por letras distintas dentro de cada
especie, así que el orden es el mismo con cualquier collation.

## Decisiones cerradas por el `spec_author`

Ninguna queda abierta. Su porqué está en [[design]] §Decisiones técnicas.

- **D1. Migración de datos «custom» de drizzle-kit.**
  - Se genera con `pnpm exec drizzle-kit generate --custom --name vaccine_catalog_data`.
  - El nombre del fichero lo pone drizzle-kit: hoy sale `0023_vaccine_catalog_data.sql`. La spec cita la migración **por nombre** (`_vaccine_catalog_data`), no por número.
  - Lleva un único `INSERT … ON CONFLICT ("species", "name") DO NOTHING;` con las 7 filas.
  - Los ids salen de `gen_random_uuid()`.
  - No cambia el esquema.
- **D2. El seed se conserva**, sin cambios. Motivo:
  - Su trabajo es distinto: canonicaliza (borra filas que no son canónicas y restaura los esquemas). La migración solo inserta lo que falta.
  - Retirarlo obligaría a enmendar #14 R2 y #208 R22 y sus tests, sin ninguna ganancia que vea el usuario.
  - Tras la migración es inocuo, como prueba R3.
- **D3. Ninguna otra spec se enmienda.**
  - `specs/health-vaccines/requirements.md` R2 (#14) sigue vigente: el seed deja exactamente las 7 entradas.
  - `specs/mobile-vaccine-create/requirements.md` R22 (#208) sigue vigente: `E2E_SETUP_CMD` sigue sembrando entre migrar y aprovisionar.
  - No hay casilla de enmienda en ninguna spec ajena.
- **D4. Sin dependencias nuevas ni costo.**
  - `drizzle-orm/node-postgres/migrator`, `pg` y `dotenv` ya están instalados.
  - No hace falta dev build nuevo: la app no cambia.
  - Nada toca AWS real.

## Requisitos funcionales

Todos los tests viven en un fichero nuevo,
`backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts`. El e2e crea dos
bases de datos desechables y las borra al terminar (ver [[design]] §El e2e). Su
resultado no depende del estado de la base compartida.

### R1 — La migración llena un catálogo vacío (el caso del humano)

- **R1.** WHEN `pnpm db:migrate` aplica la migración `_vaccine_catalog_data` sobre
  una base que tiene aplicadas todas las migraciones anteriores y `vaccine_catalog` vacía
  THE SYSTEM SHALL dejar en `vaccine_catalog` exactamente las 7 entradas de
  §Catálogo canónico.
  - `GET /v1/vaccine-catalog?species=dog` SHALL devolver 4 entradas.
  - `GET /v1/vaccine-catalog?species=cat` SHALL devolver 3 entradas.
  - Las dos respuestas van ordenadas por `name`, con `species`, `name` y `scheme`
    idénticos a la tabla.
  - Registrar una vacuna con el `catalogId` de una de ellas SHALL responder 201.

  Lo cubren cinco its:

  - `#226 R1: el journal registra una sola migracion _vaccine_catalog_data, posterior a la anterior`.
    - En `meta/_journal.json` hay exactamente 1 entrada cuyo `tag` acaba en `_vaccine_catalog_data`.
    - Su `when` es estrictamente mayor que el de la entrada con `idx` inmediatamente anterior.
  - `#226 R1: sin la migracion el catalogo queda vacio, como en la base del humano`.
    - En la base A, migrada solo hasta la entrada anterior a la nuestra, `vaccine_catalog` tiene 0 filas.
    - Es el fallo original, a nivel de datos.
  - `#226 R1: GET dog devuelve las 4 vacunas con su esquema, por nombre`.
    - Tras migrar la base A con la carpeta real, la respuesta es 200 y tiene longitud 4.
    - Proyectada a `{ species, name, scheme }`, es igual al literal de 4 elementos en el orden de §Catálogo canónico.
  - `#226 R1: GET cat devuelve las 3 vacunas con su esquema, por nombre`. Igual que el anterior, con longitud 3.
  - `#226 R1: una vacuna del catalogo migrado se registra con 201`.
    - Se toma el `id` de `Rabia` en la respuesta dog y se registra `{ catalogId, appliedAt: '2024-02-29' }`.
    - `POST /v1/pets/:petId/vaccines` responde 201 con `name: 'Rabia'` y `nextDoseAt: '2025-02-28'`.
    - Prueba que los ids de `gen_random_uuid()` pasan `z.uuid()` y que el esquema migrado calcula la próxima dosis.

### R2 — Idempotente sobre una base ya sembrada (el caso del VPS y de CI)

- **R2.** WHEN `pnpm db:migrate` aplica la migración `_vaccine_catalog_data` sobre
  una base donde ya se corrió `seed:vaccines`
  THE SYSTEM SHALL terminar sin error y SHALL dejar `vaccine_catalog` exactamente
  igual que antes de migrar:
  - las mismas 7 filas;
  - los mismos `id`;
  - los mismos `scheme`, incluido un `scheme` editado después del seed.

  Lo cubre un it:

  - `#226 R2: migrar sobre una base sembrada no falla ni cambia ninguna fila`.
    1. En la base B, migrada hasta la entrada anterior a la nuestra, se corre `seedVaccineCatalog`.
    2. Se edita el `scheme` de `dog`/`Rabia` a `{"firstDoseMonths":3,"boosterMonths":36}`.
    3. Se toma una foto de `(id, species, name, scheme)` ordenada por `species, name`.
    4. La migración con la carpeta real resuelve sin lanzar.
    5. La foto posterior es igual a la anterior: tiene longitud 7 y el `scheme` de `dog`/`Rabia` sigue con `boosterMonths: 36`.

  El `scheme` editado distingue `DO NOTHING` de `DO UPDATE`.

### R3 — El seed sigue siendo compatible después de la migración (orden de `init.sh`)

- **R3.** WHEN `seed:vaccines` corre sobre una base donde la migración
  `_vaccine_catalog_data` ya insertó el catálogo
  THE SYSTEM SHALL dejar las mismas 7 filas, con los mismos `id` que puso la
  migración.

  Es el orden de `E2E_SETUP_CMD`: `db:migrate` y luego `seed:vaccines`. Lo cubre
  un it:

  - `#226 R3: seed:vaccines sobre el catalogo migrado conserva las 7 filas y sus ids`.
    - Sobre la base A de R1, la foto de `(id, species, name, scheme)` antes del seed tiene longitud 7.
    - Tras `seedVaccineCatalog`, la foto es igual.
    - El it se declara después de los de R1, porque es el único que escribe en el catálogo de A.

### R4 — Paso de smoke que reproduce el fallo (gate humano G2, no delegado)

- **R4.** El cambio SHALL añadir a `progress/smoke_mejoras-smoke.md` la sección
  y la casilla literales de [[design]] §Paso de smoke.
  - El paso **reproduce el fallo original** antes de actualizar: Agregar vacuna con
    solo «Otra vacuna», en la base del PC del humano sin seed.
  - Después comprueba el arreglo tras `pnpm -C backend-pet-tracker run db:migrate`.
  - La casilla la marca solo el humano. La firma delegada no la cubre.
  - Verificación: el `grep -cF` de la casilla en [[tasks]] §R4 da 1.

### R5 — Alcance: ni móvil, ni seed, ni dependencias

- **R5.** El cambio SHALL dejar sin diff frente a `origin/dev`:
  - `mobile-pet-tracker/`;
  - `backend-pet-tracker/src/db/seed/`, `backend-pet-tracker/scripts/seed-vaccines.ts`;
  - `init.config.sh`, `init-e2e-gate.test.mjs`;
  - `backend-pet-tracker/package.json`, `backend-pet-tracker/pnpm-lock.yaml`;
  - `backend-pet-tracker/src/db/schema/`.

  Además, `pnpm exec drizzle-kit generate` posterior SHALL informar que no hay
  cambios de esquema.

  - Se verifica con los comandos de [[tasks]] §R5, con salida esperada `0` y
    `No schema changes`.
  - Los tests de #14 R2 (`src/db/seed/vaccine-catalog.spec.ts`,
    `test/health-vaccines.e2e-spec.ts::R2: seed idempotente`) y de #208 R22
    (`init-e2e-gate.test.mjs`) siguen verdes sin tocarlos.

## Fuera de alcance

- **Degradación silenciosa del selector en móvil.** Si `getVaccineCatalog` devuelve
  `error`, `unauthorized` o `unreachable`, la pantalla también muestra solo «Otra
  vacuna», sin mensaje.
  - La premisa está verificada (ancla de móvil de §Anclas).
  - No es la causa de este hallazgo (§Causa, punto 4).
  - Queda como **observación para el leader**: decide si la registra como feature
    móvil, que necesitaría copy y G1. Esta spec no la registra.
- **Retirar o cambiar el seed** (D2), e **incluir el catálogo en el esquema de drizzle**.
- **Cambiar el contenido del catálogo** (añadir, quitar o renombrar vacunas). Techo
  conocido: un cambio futuro exige **a la vez** una migración nueva y la edición de
  `VACCINE_CATALOG_SEED`. Si solo hay migración, el seed borraría la fila nueva, o
  fallaría por la FK de `pet_vaccines` si ya tiene vacunas registradas
  ([[design]] §Techo conocido).
- **`docs/demo-runbook.md`.** Su paso «Si la base está vacía»
  (`pnpm -C backend-pet-tracker run seed:vaccines`) sigue siendo válido e
  inocuo (R3). No se edita.
- **Producción y AWS.** Ninguna IA aplica la migración fuera de las bases locales.
  En una base ya sembrada es un no-op (R2).
- **Ids deterministas.** Los ids varían entre entornos ya sembrados de todos modos (R2).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-11-03) ← gate obligatorio antes de implementar

La casilla del paso de smoke de R4 es un gate aparte (G2 del plan
`progress/plan_mejoras-smoke-2026-11-03.md` §5). La firma delegada del leader no
la cubre.
