# impl: pets-crud-permissions

Fecha: 2026-08-01

Feature id 5, branch `feature/5-pets-crud-permissions` (creada desde `main`
en `bd66246`). Spec aprobada por humano (`specs/pets-crud-permissions/
requirements.md`, casilla marcada 2026-08-01) — gate verificado antes de
escribir código. Nota: el frontmatter de los 4 archivos de la spec sigue en
`status: draft` (mismo estado en que quedaron #3 y #4); el gate duro es la
casilla de `requirements.md`, según el precedente documentado en
`progress/impl_auth-login-me.md`.

**Entorno de esta sesión (distinto a #3/#4)**: Windows local con Docker
disponible — Postgres 17 y LocalStack corriendo y healthy, `argon2` carga
sin segfault. Esto permitió lo que #3/#4 no pudieron: **e2e con supertest
contra Postgres real** (19 tests) y la migración aplicada y verificada con
`\d` en la base local.

## Archivos creados

### Schema y migración (infraestructura compartida)
- `backend-pet-tracker/src/db/schema/pets.schema.ts` — tablas `pets` (CHECK
  species) y `pet_users` (PK compuesta `(pet_id, user_id)`, CHECK role,
  índice manual `pet_users_user_id_idx`, FKs CASCADE).
- `backend-pet-tracker/src/db/schema/pets.schema.spec.ts` — R1: columnas,
  PK, FKs, CHECKs, índice; y que el SQL de la migración nueva no menciona
  `audit_log`.
- `backend-pet-tracker/src/db/migrations/0003_pets_crud_tables.sql` (+
  `meta/0003_snapshot.json`, `meta/_journal.json`) — generada con
  `drizzle-kit generate --name pets_crud_tables`. **Solo** crea `pets` y
  `pet_users`; cero menciones a `audit_log` (verificado por test).
  Aplicada a la base local con `drizzle-kit migrate`.

### Módulo `pets` — domain
- `.../modules/pets/domain/entities/pet.entity.ts` — clase `Pet` pura +
  `calculateAgeMonths()` (R6): meses de calendario completos en UTC;
  `birthDate` tiene precedencia; edad aproximada anclada a `created_at`.
- `.../domain/entities/pet-membership.ts` — `PetRole` +
  `PetMembership`.
- `.../domain/errors/pet.errors.ts` — `PetNotFoundError` (caso borde
  delete concurrente, sin imports de @nestjs/common).
- `.../domain/repositories/pet.repository.ts` — `PET_REPOSITORY` +
  interface con los 6 métodos del design (`createWithOwner`,
  `findAllByMember`, `findMembership`, `findById`, `update`, `delete`) +
  tipos `NewPet`, `PetWithRole`, `PetFieldChanges`.

### Módulo `pets` — application
- `.../application/dto/create-pet.dto.ts` — `PetFieldsSchema` (base
  compartida) + `CreatePetSchema` con superRefine XOR birthDate |
  approxAgeMonths (R4, R5). Límites: name 1-120, approxAgeMonths 0-480
  entero, weightKg (0, 999.99], microchip ≤32, enums sex/size/species.
- `.../application/dto/update-pet.dto.ts` — `UpdatePetSchema =
  PetFieldsSchema.partial()` + refine "no ambos a la vez" (R13, R14); en
  PATCH cero campos de edad es válido.
- `.../application/use-cases/create-pet.use-case.ts` — transacción vía
  repo + audit `pet.create` post-commit por el puerto `AuditLogger` (R2, R3).
- `.../application/use-cases/list-pets.use-case.ts` — R7.
- `.../application/use-cases/get-pet.use-case.ts` — R8 + PetNotFoundError.
- `.../application/use-cases/update-pet.use-case.ts` — diff de campos,
  NULL cruzado de edad, audit `pet.update` con `meta.fields` (solo
  nombres), no-op sin auditoría con body vacío (R13, R14, R15).
- `.../application/use-cases/delete-pet.use-case.ts` — delete + audit
  `pet.delete` (R16).
- Specs de los 5 use cases y de los 2 DTOs junto a cada archivo.

### Módulo `pets` — infrastructure
- `.../infrastructure/decorators/require-pet-role.decorator.ts` —
  `@RequirePetRole(...roles)` via SetMetadata, tipado con `PetRole` del
  domain (un typo de rol no compila).
- `.../infrastructure/guards/pet-access.guard.ts` — `PetAccessGuard` +
  `PetAccessRequest`. Flujo: UUID inválido → 404 sin tocar la base (R10);
  una sola consulta a `pet_users`, sin fila o status ≠ active → 404
  genérico indistinguible (R9); metadata de rol → 403 (R11) solo tras
  membresía confirmada (404 precede a 403); sin decorador cualquier rol
  pasa y adjunta `request.petMembership` (R12).
- `.../infrastructure/guards/pet-access.guard.spec.ts` — R9-R12 con
  Reflector real y handlers decorados de verdad.
- `.../infrastructure/mappers/pet-profile-response.mapper.ts` — contrato
  congelado de 24 claves (R8) con placeholders null comentados con la
  feature que los rellenará (#6, #7, #8, #10, #14, #16). Su spec asserta
  las claves exactas.
- `.../infrastructure/repositories/pet.drizzle.repository.ts` —
  `createWithOwner` con `db.transaction` (UUIDv7 en app), join de listado
  filtrado por status active, membership lookup, update parcial con
  `updated_at`, delete. Conversión numeric(5,2) string↔number. Su spec
  cubre la transacción/UUIDv7/rol owner con un doble del cliente.
- `.../infrastructure/pets.controller.ts` — CRUD `/v1/pets`: POST 201,
  GET lista, GET/PATCH/DELETE `:petId` con `@UseGuards(PetAccessGuard)`;
  PATCH y DELETE con `@RequirePetRole('owner')`; DELETE `@HttpCode(204)`;
  validación zod en el borde (`parseBody`, mismo patrón que
  users.controller) y mapeo `PetNotFoundError` → 404 genérico.
- `.../pets.module.ts` — providers + **exporta `PET_REPOSITORY` y
  `PetAccessGuard`** para las features futuras con `:petId`.

### Tests e2e
- `backend-pet-tracker/test/pets.e2e-spec.ts` — 19 tests contra Postgres
  real (R2-R5, R7-R16). Usuarios sembrados directo en `users`, tokens
  firmados con el `TokenService` real de la app, membresías no-owner
  sembradas directo en `pet_users` (gestión de miembros fuera de alcance).
  Cleanup en `afterAll` (audit_log → pets → users). Incluye:
  - **IDOR obligatorio (R9)**: usuario B sobre mascota de A → 404 en GET,
    PATCH y DELETE con body idéntico al de un petId inexistente.
  - **Rollback transaccional (R2)**: token de usuario fantasma → FK
    violation en `pet_users` dentro de la transacción → 500 y `pets`
    queda sin la fila (el stack trace 23503 en el output del e2e es el
    log esperado de este test).

## Archivos modificados
- `backend-pet-tracker/src/db/schema/index.ts` — re-exporta `pets.schema`.
- `backend-pet-tracker/src/app.module.ts` — importa `PetsModule`.
- `specs/pets-crud-permissions/tasks.md` — checkboxes completadas.
- `specs/pets-crud-permissions/traceability.md` — tabla completa R1-R16,
  sin filas "pendiente".
- (La spec entera estaba **untracked** — el spec_author no la commiteó; la
  commiteé en esta branch en `597dfd1` según el flujo de conventions.md.)

Sin dependencias nuevas y sin variables de entorno nuevas.

## Requisitos cubiertos

Mapping completo test↔commit en `specs/pets-crud-permissions/traceability.md`.
Resumen (hashes de esta branch):

- R1: `pets.schema.spec.ts` — `c2d889b`
- R2, R3: `create-pet.use-case.spec.ts`, `pet.drizzle.repository.spec.ts`,
  `pets.controller.spec.ts`, e2e — `feb498b` (+ e2e `12e7946`)
- R4, R5: `create-pet.dto.spec.ts`, `pets.controller.spec.ts`, e2e —
  `ae1c7d4`
- R6: `pet.entity.spec.ts` — `f645591`
- R7: `list-pets.use-case.spec.ts`, `pets.controller.spec.ts`, e2e —
  `36ae852`
- R8-R12: `pet-profile-response.mapper.spec.ts`, `get-pet.use-case.spec.ts`,
  `pet-access.guard.spec.ts`, `pets.controller.spec.ts`, e2e — `411816e`
- R13-R15: `update-pet.dto.spec.ts`, `update-pet.use-case.spec.ts`,
  `pets.controller.spec.ts`, e2e — `4a8cdc0`
- R16: `delete-pet.use-case.spec.ts`, `pets.controller.spec.ts`, e2e —
  `6044e43`
- e2e completo: `12e7946`; spec docs: `597dfd1`; fix de tipos/lint:
  `b626327`

TDD rojo→verde verificado por ejecución en cada ciclo (cada spec corrió en
rojo antes de implementar su vertical).

## Decisiones de diseño

Las decisiones grandes venían resueltas por el humano en la spec/design y
se siguieron sin desviación: audit fuera de la transacción vía puerto
`AuditLogger` (patrón `user.register`), DTO con obligatorios mínimos y XOR
de edad, enums sex/size, PATCH con NULL cruzado, GET detalle para cualquier
rol activo. Decisiones por debajo de ese nivel:

- **`findMembership` devuelve la fila con su `status` y el guard decide**
  (en vez de filtrar `status='active'` en SQL): mismo 404 por el mismo
  camino, y una feature futura de gestión de miembros podrá distinguir
  estados sin tocar el repo.
- **`birthDate` como string `YYYY-MM-DD` en el domain** (columna `date` de
  Drizzle): una fecha de calendario sin tz evita bugs de zona horaria en el
  cálculo de edad; `calculateAgeMonths` compara componentes UTC.
- **`meta.fields` del audit de PATCH = claves del DTO enviado** (ej.
  `weightKg`, no `currentWeightKg`; sin incluir el NULL cruzado implícito):
  espeja "lo que el usuario modificó", mismo criterio que `user.update` #4.
- **Normalización de `request.params.petId`** (`string | string[]` en
  Express 5): un param no-string cae en el mismo 404 que un no-UUID.
  Detectado por `nest build` (ts-jest no lo señala), corregido en `b626327`.
- **El guard va por `@UseGuards` en cada handler `:petId`**, no a nivel de
  clase — POST y GET lista no tienen `:petId` y el guard a nivel controller
  los rompería.
- **e2e con tokens firmados y seed directo en DB** (sin pasar por
  register/login): el AuthGuard no consulta `users` (contrato de #4 R8),
  así el e2e de pets no depende de argon2 ni del flujo de verificación de
  email, y el seed de membresías no-owner es exactamente lo que la spec
  prevé ("helper de test, no vía API").

## Output de build

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json

(exit 0 — sin errores)
```

## Output de tests

Suite unitaria completa (init.sh, `pnpm test`):

```
Test Suites: 56 passed, 56 total
Tests:       275 passed, 275 total
```

Baseline antes de esta feature: 43 suites / 179 tests (los 43 incluyen los
2 archivos de argon2 que en el sandbox de #4 segfaulteaban — aquí corren
bien). Esta feature agrega 13 suites / 96 tests unitarios. Ningún test
existente roto.

e2e (`pnpm run test:e2e -- --testPathPatterns pets`, Postgres real):

```
Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
```

`./init.sh` completo: **verde** (entorno, deps, harness, build, tests,
lint, typecheck). `graphify update .` ejecutado tras el último commit.

## Notas para el reviewer

1. **`status: draft` en el frontmatter de la spec** con la casilla de
   aprobación humana marcada — misma inconsistencia que #3/#4 dejaron; no
   toqué el frontmatter (decisión del leader si normalizarlo).
2. **El e2e requiere Docker arriba** (`docker compose up -d` con Postgres
   healthy y la migración 0003 aplicada). `init.sh` NO corre el e2e (solo
   `pnpm test`); CI tampoco lo corre hoy. Verificado localmente 2 veces
   (19/19). Si el reviewer quiere reproducir: `pnpm -C backend-pet-tracker
   run test:e2e -- --testPathPatterns pets`.
3. **El test de rollback imprime un stack trace de FK 23503** en el output
   del e2e — es el comportamiento bajo prueba (500 + 0 filas persistidas),
   no un fallo.
4. **Dónde mirar seguridad**: `pet-access.guard.ts` — el 404 de "no
   existe" y "no eres miembro" sale de la misma consulta y el mismo throw
   (imposible inferir existencia); el chequeo de rol es inalcanzable sin
   membresía activa (404 precede a 403 estructuralmente); el e2e R9
   compara los bodies byte a byte contra el baseline de un uuid
   inexistente.
5. **Contrato R8**: si una feature futura agrega una clave al perfil,
   romperá `pet-profile-response.mapper.spec.ts` y el e2e R8 (claves
   exactas) — es intencional, el contrato está congelado.
6. **`feature_list.json` y `progress/current.md`** tienen cambios del
   leader en el working tree — no los commiteé (cierre del leader).
7. La migración 0003 quedó **aplicada en la base local** de desarrollo.
