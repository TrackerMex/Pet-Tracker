---
feature: "backend-vaccine-catalog-migration"
status: approved     # draft | approved
tags: [harness, spec, backend, health, migration]
---

# Trazabilidad — [[backend-vaccine-catalog-migration]]

Las filas se rellenan en un único commit al cerrar la cadena ([[tasks]] §Cierre).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts::#226 R1: el journal registra una sola migracion _vaccine_catalog_data, posterior a la anterior`, `::#226 R1: sin la migracion el catalogo queda vacio, como en la base del humano`, `::#226 R1: GET dog devuelve las 4 vacunas con su esquema, por nombre`, `::#226 R1: GET cat devuelve las 3 vacunas con su esquema, por nombre`, `::#226 R1: una vacuna del catalogo migrado se registra con 201` | `13901fb7 feat(backend-vaccine-catalog-migration): vaccine catalog data migration (R1)` |
| R2 | `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts::#226 R2: migrar sobre una base sembrada no falla ni cambia ninguna fila` | `0268be24 feat(backend-vaccine-catalog-migration): skip catalog rows that already exist (R2)` |
| R3 | `backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts::#226 R3: seed:vaccines sobre el catalogo migrado conserva las 7 filas y sus ids` | `dff49ed4 test(backend-vaccine-catalog-migration): seed after the migration keeps the catalog ids (R3, nace verde)` |
| R4 | `progress/smoke_mejoras-smoke.md` (casilla «Smoke de #226 pasado», la marca el humano) | `7aa11e25 docs(backend-vaccine-catalog-migration): smoke step that reproduces the empty catalog (R4)` |
| R5 | Comandos de [[tasks]] §R5 (diff vacío fuera de `src/db/migrations/` y `drizzle-kit generate` sin cambios), más `backend-pet-tracker/src/db/seed/vaccine-catalog.spec.ts`, `backend-pet-tracker/test/health-vaccines.e2e-spec.ts::R2: seed idempotente` (describe, con sus dos its) e `init-e2e-gate.test.mjs::#208 R22: E2E_SETUP_CMD siembra el catálogo de vacunas entre migrar y aprovisionar`, sin tocar | sin commit propio; último feat: `0268be24 feat(backend-vaccine-catalog-migration): skip catalog rows that already exist (R2)` |
