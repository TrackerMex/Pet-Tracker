---
feature: "health-vaccines"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[health-vaccines]]

> Ver [[requirements]] y [[../../docs/architecture|architecture]].

## Decisiones técnicas

- `health.schema.ts` contiene ambas tablas y sus índices; UUIDv7 se genera en
  aplicación y la migración se genera con Drizzle (R1).
- `seed-vaccines.ts` hace upsert por `(species,name)` para que repetir el seed
  sea idempotente y mantenga los esquemas declarados (R2).
- `HealthModule` sigue domain/application/infrastructure, usa DTOs zod y un
  repositorio por interfaz/token; no añade dependencias (R3-R12).
- El controller de vacunas reutiliza `PetAccessGuard`; `@RequirePetRole('owner')`
  protege mutaciones y las lecturas quedan disponibles a miembros activos,
  siguiendo el precedente del CRUD de geocercas (R4-R5).
- El cálculo de meses es una función pura con fechas `YYYY-MM-DD`, meses de
  calendario y clamp al último día del mes; el override manual tiene prioridad
  (R6-R8).
- Toda búsqueda de una vacuna usa `(vaccineId,petId)` para impedir cruces entre
  mascotas incluso cuando el actor pertenece a ambas (R10-R11).
- El perfil consume un puerto `PetVaccineReader` declarado por `pets` e
  implementado por un submódulo de lectura que solo depende de Drizzle; así
  `HealthModule -> PetsModule -> PetVaccineReadModule` no crea ciclos. El mapper
  existente solo ensancha `nextVaccine: null` a objeto o null (R13).

## Archivos afectados

- `backend-pet-tracker/src/db/schema/health.schema.ts`, `index.ts` y
  `src/db/migrations/` — infraestructura de persistencia (R1).
- `backend-pet-tracker/scripts/seed-vaccines.ts` y `package.json` — seed (R2).
- `backend-pet-tracker/src/modules/health/**` — capas domain, application e
  infrastructure del catálogo y vacunas (R3-R12).
- `backend-pet-tracker/src/modules/pets/domain/ports/pet-vaccine-reader.ts`,
  `get-pet.use-case.ts`, `pet-profile-response.mapper.ts` y `pets.module.ts` —
  integración mínima del perfil (R13).
- `backend-pet-tracker/src/app.module.ts` y tests unitarios/e2e correspondientes.

Sin variables de entorno ni dependencias nuevas.

## Alternativas descartadas

- Guard o repositorio de mascotas duplicado: se reutiliza lo ya aprobado en #5.
- Importar `HealthModule` desde `PetsModule`: produciría un ciclo de módulos.
- Job para recalcular dosis: el cálculo ocurre al crear; no hay trabajo periódico.
- FK obligatoria al catálogo: se conserva `name` libre para registros manuales y
  lectura IA post-MVP.
