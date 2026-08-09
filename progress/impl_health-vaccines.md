# impl: health-vaccines
Fecha: 2026-08-09 01:47:28 -06:00

## Archivos creados
- `backend-pet-tracker/src/db/schema/health.schema.ts` — tablas `vaccine_catalog` y `pet_vaccines` con constraints e índices.
- `backend-pet-tracker/src/db/migrations/0009_shallow_dust.sql` y metadata `0009` — migración Drizzle versionada.
- `backend-pet-tracker/src/db/seed/vaccine-catalog.ts` — reconciliación atómica e idempotente al catálogo canónico exacto de 4 vacunas dog y 3 cat.
- `backend-pet-tracker/scripts/seed-vaccines.ts` — entrada standalone de `pnpm run seed:vaccines`.
- `backend-pet-tracker/src/modules/health/application/dto/vaccine.dto.ts` — validación zod estricta de catálogo, POST y PATCH; fechas inválidas nunca lanzan y `documentKey` no es entrada pública.
- `backend-pet-tracker/src/modules/health/application/vaccine-date.ts` — suma pura de meses calendario con clamp de fin de mes.
- `backend-pet-tracker/src/modules/health/application/use-cases/*-vaccine*.ts` — listado de catálogo y CRUD de vacunas.
- `backend-pet-tracker/src/modules/health/domain/entities/vaccine.entity.ts` — tipos y entidad pura de vacuna.
- `backend-pet-tracker/src/modules/health/domain/errors/vaccine.errors.ts` — errores tipados de catálogo, especie y vacuna.
- `backend-pet-tracker/src/modules/health/domain/repositories/vaccine.repository.ts` — puerto de persistencia.
- `backend-pet-tracker/src/modules/health/infrastructure/vaccines.controller.ts` — rutas HTTP protegidas y catálogo autenticado.
- `backend-pet-tracker/src/modules/health/infrastructure/repositories/vaccine.drizzle.repository.ts` — persistencia Drizzle del CRUD.
- `backend-pet-tracker/src/modules/health/infrastructure/repositories/pet-vaccine.drizzle-reader.ts` — lectura mínima de próxima vacuna para perfiles.
- `backend-pet-tracker/src/modules/health/infrastructure/mappers/` — contratos de respuesta y traducción de errores HTTP.
- `backend-pet-tracker/src/modules/health/pet-vaccine-read.module.ts` — submódulo de lectura que evita ciclos NestJS.
- `backend-pet-tracker/src/modules/pets/domain/ports/pet-vaccine-reader.ts` — puerto propiedad de `pets` para `nextVaccine`.
- `backend-pet-tracker/test/health-vaccines.e2e-spec.ts` — 12 escenarios e2e R2-R13 contra Postgres real.
- Tests unitarios de schema, seed, fechas, fallo de escrituras y perfil junto al código correspondiente.

## Archivos modificados
- `backend-pet-tracker/package.json` — script `seed:vaccines` sin dependencias nuevas.
- `backend-pet-tracker/src/db/schema/index.ts` — export del schema de salud.
- `backend-pet-tracker/src/modules/health/health.module.ts` — providers/controllers de vacunas y reutilización de `PetsModule`.
- `backend-pet-tracker/src/modules/pets/application/use-cases/get-pet.use-case.ts` — consulta `nextVaccine` por puerto.
- `backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts` — reemplaza solo el placeholder `nextVaccine`.
- `backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts` — entrega `nextVaccine` al mapper existente.
- `backend-pet-tracker/src/modules/pets/pets.module.ts` — importa el submódulo lector sin crear ciclo.
- `specs/health-vaccines/tasks.md` — ciclos TDD R1-R13 marcados completos.
- `specs/health-vaccines/traceability.md` — tests y hashes reales para R1-R13.

## Requisitos cubiertos
- R1: test `src/db/schema/health.schema.spec.ts::R1: schema y migracion de vacunas`, commit `aa12c8c`.
- R2: tests `src/db/seed/vaccine-catalog.spec.ts::R2: seed idempotente del catalogo de vacunas` y e2e `elimina filas no canonicas...`, commits `aa12c8c`, `5d53ac3` (rojo) y `eb9c67b` (verde).
- R3: test `test/health-vaccines.e2e-spec.ts::R3: GET /v1/vaccine-catalog`, commit `f09c84f`.
- R4: test `test/health-vaccines.e2e-spec.ts::R4: PetAccessGuard bloquea IDOR en las cuatro rutas`, commit `f09c84f`.
- R5: test `test/health-vaccines.e2e-spec.ts::R5: solo owner muta y miembros activos leen`, commit `f09c84f`.
- R6: tests `application/vaccine-date.spec.ts::R6: suma de meses calendario` y e2e `R6: alta desde catalogo`, commit `f09c84f`.
- R7: test e2e `R7: override y vacuna libre`, commit `f09c84f`.
- R8: test e2e `R8: validacion y errores de catalogo`, incluidos `2025-13-01` sin `RangeError` y rechazo de `documentKey`, commits `f09c84f`, `5d53ac3` (rojo) y `eb9c67b` (verde).
- R9: test e2e `R9: historial ordenado`, commit `f09c84f`.
- R10: test e2e `R10: PATCH parcial aislado por mascota`, commit `f09c84f`.
- R11: test e2e `R11: DELETE aislado por mascota`, commit `f09c84f`.
- R12: tests `vaccine-mutations.use-cases.spec.ts::R12: una escritura fallida nunca se audita` y e2e `R12: auditoria de mutaciones`, commit `f09c84f`.
- R13: tests `get-pet.use-case.spec.ts::R13 (health-vaccines #14)` y e2e `R13: nextVaccine en perfil`, commit `f09c84f`.

## Decisiones de diseño
- Reutilización de `PetAccessGuard` y `@RequirePetRole('owner')`: conserva la precedencia 404/403 existente y evita autorización duplicada.
- Puerto `PetVaccineReader` en `pets`: `PetsModule` consume su necesidad mediante un submódulo lector y `HealthModule` puede importar `PetsModule` sin ciclo.
- Un único repositorio de vacunas: cubre catálogo y CRUD sin factories, servicios genéricos ni dependencias nuevas.
- Fechas `YYYY-MM-DD` y aritmética UTC: suma meses de calendario de forma determinista y clampa días inválidos.
- El seed reconcilia delete de filas no canónicas + upsert de las siete canónicas en una sola transacción Drizzle.

## Output de build
```
pnpm -C backend-pet-tracker run build
> nest build && tsc-alias -p tsconfig.build.json
Build exitoso (exit 0)
```

## Output de tests
```
pnpm -C backend-pet-tracker test --passWithNoTests
Test Suites: 117 passed, 117 total
Tests:       843 passed, 843 total

pnpm -C backend-pet-tracker run test:e2e
Test Suites: 13 passed, 13 total
Tests:       181 passed, 181 total

./init.sh
Build exitoso; 117/117 unit suites; 13/13 e2e suites (181 tests);
lint sin errores; typecheck sin errores; Todo verde (exit 0).
```

## Notas para el reviewer
- Verificar especialmente el aislamiento `(vaccineId, petId)`, el XOR `catalogId|name` y el clamp de fin de mes.
- Rechazo del primer review corregido con TDD visible: commit rojo `5d53ac3`, fix `eb9c67b`; los tres casos de regresión quedan verdes.
- La migración `0009` se aplicó a Postgres local para la suite e2e; `seed:vaccines` se ejecutó idempotentemente contra esa base.
- `feature_list.json` permanece `in_progress`; este implementer no marcó `done`, no hizo push/PR y no lanzó reviewer.
