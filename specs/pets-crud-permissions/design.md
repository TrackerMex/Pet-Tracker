---
feature: "pets-crud-permissions"
status: approved        # draft | approved
tags: [harness, spec]
---

# Diseño — [[pets-crud-permissions]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Decisiones técnicas

- **`pets` y `pet_users` en un solo `src/db/schema/pets.schema.ts`** —
  sirve a R1. Ambas tablas pertenecen al módulo `pets` (convención
  `docs/conventions.md`: un `<module>.schema.ts` por módulo en
  `src/db/schema/`), se re-exportan en el barrel `index.ts` y la migración
  se genera con `drizzle-kit generate`. Mismo estilo que
  `users.schema.ts`: mapeo explícito camelCase → snake_case, `timestamptz`
  con `withTimezone: true`, CHECKs de `species` y `role` como constraints
  del schema. **No se genera ninguna migración para `audit_log`**: la tabla
  y su schema (`audit-log.schema.ts`) ya existen desde `auth-registration`
  (#3) — regla explícita de `feature_list.json` #5.

- **PK compuesta `(pet_id, user_id)` en `pet_users`, sin id propio** —
  sirve a R1. Es la forma natural de una tabla de membresía: garantiza
  unicidad usuario-mascota sin índice extra y `pet_id` como primera columna
  de la PK cubre el lookup del guard (`WHERE pet_id = ? AND user_id = ?`).
  `user_id` lleva índice manual propio para el listado R7 (`WHERE user_id =
  ?`), regla de `docs/data-model.md` (Postgres no indexa FKs).

- **Transacción de creación dentro del repositorio:
  `PetRepository.createWithOwner(data, ownerId)`** — sirve a R2. La
  atomicidad pets + pet_users es un detalle de persistencia, así que vive
  en `PetDrizzleRepository` con `db.transaction(async (tx) => {...})` — el
  use case llama un solo método y no conoce Drizzle. El id UUIDv7 se genera
  en app con el paquete `uuidv7` ya usado por `auth-registration`.

- **Auditoría `pet.create` tras el commit, fuera de la transacción** —
  sirve a R3, con matiz sobre el acceptance criterion 1 ("transacción pets
  + pet_users(owner) + audit"). El puerto `AuditLogger`
  (`src/audit/audit-log.repository.ts`) escribe con su propio handle
  `DRIZZLE` y no acepta un contexto transaccional; meter el insert de
  `audit_log` en la misma transacción exigiría o (a) hacer el puerto
  transaction-aware (filtra un tipo de infraestructura al dominio) o (b)
  insertar en `audit_log` directamente desde `PetDrizzleRepository`
  bypaseando el puerto — y la instrucción de la feature es explícita:
  "reutiliza el puerto AuditLogger". Se sigue el precedente de
  `RegisterUserUseCase` (#3): la pareja íntegramente atómica es pets +
  pet_users; el `record()` de auditoría corre inmediatamente después del
  commit, y si la transacción falla no se audita nada. **Decisión abierta
  marcada para el gate humano** — si el humano exige audit dentro de la
  transacción, la alternativa preferida es (b) documentada como excepción
  puntual.

- **`PetAccessGuard` a nivel de controller (`@UseGuards`), no global** —
  sirve a R9-R12. Solo aplica a rutas con parámetro `:petId`; registrarlo
  como `APP_GUARD` obligaría a excluir todas las rutas sin mascota
  (whitelist inversa frágil). El `AuthGuard` global (`APP_GUARD`, #4) corre
  siempre antes que los guards de controller — orden garantizado por
  NestJS — así que `PetAccessGuard` puede asumir `request.user` poblado
  (`AuthenticatedRequest`). Vive en
  `modules/pets/infrastructure/guards/pet-access.guard.ts` y `PetsModule`
  lo **exporta** junto con `PET_REPOSITORY` para que las features
  posteriores (#6, #7, #9...) lo apliquen a sus controllers importando
  `PetsModule` — mismo principio de reutilización que llevó `AuditLogger` a
  `src/audit/`.

- **Flujo interno del guard** — sirve a R9, R10, R11, R12, en este orden:
  1. Extrae `:petId` de `request.params`; si no es UUID válido
     (regex/`z.string().uuid()`), lanza `NotFoundException` sin tocar la
     base (R10).
  2. `PetRepository.findMembership(petId, userId)` — una sola consulta a
     `pet_users`. Sin fila o `status != 'active'` → `NotFoundException`
     (R9). La consulta es sobre `pet_users`, no sobre `pets`: la FK
     garantiza que si hay membresía la mascota existe, y así "no existe" y
     "no eres miembro" son literalmente la misma consulta vacía — el mismo
     404 sale del mismo camino de código (imposible filtrar existencia).
  3. Lee la metadata de `@RequirePetRole` con `Reflector
     .getAllAndOverride` (mismo patrón que `IS_PUBLIC_KEY` en
     `AuthGuard`). Si hay roles exigidos y el `role` de la membresía no
     está incluido → `ForbiddenException` (R11). Sin decorador, cualquier
     rol activo pasa (R12).
  4. Adjunta `request.petMembership = { petId, role }` para que el handler
     conozca `myRole` sin repetir la consulta.

  El guard es infraestructura y lanza `HttpException` directamente
  (igual que `AuthGuard`) — la regla "nunca `HttpException` fuera de
  infrastructure" de `docs/conventions.md` se respeta.

- **`@RequirePetRole(...roles)` como `SetMetadata`** — sirve a R11. En
  `modules/pets/infrastructure/decorators/require-pet-role.decorator.ts`,
  mismo patrón que `@Public()`. Acepta varargs (`@RequirePetRole('owner')`
  hoy; `@RequirePetRole('owner', 'vet')` posible en features de salud). El
  tipo `PetRole = 'owner' | 'family' | 'walker' | 'vet'` se define en el
  domain (`pet-membership` types) y el decorador lo importa — un typo de
  rol no compila.

- **404 antes que 403, siempre** — sirve a R9 + R11 (criterio 3 del
  feature list). El orden del flujo del guard lo garantiza
  estructuralmente: el chequeo de rol solo se alcanza con membresía activa
  ya confirmada. Un no-miembro sobre `DELETE` (que exige owner) recibe
  `404`, jamás `403` — un `403` le confirmaría que la mascota existe.

- **Edad calculada: función pura en el domain** — sirve a R6.
  `calculateAgeMonths({ birthDate, approxAgeMonths, createdAt }, now)` en
  `modules/pets/domain/entities/pet.entity.ts` (o helper hermano), sin
  I/O ni imports de framework: con `birthDate` devuelve meses completos
  hasta `now`; sin ella, `approxAgeMonths + mesesCompletos(createdAt,
  now)` — la edad aproximada queda "anclada" al momento del alta y avanza
  sola. Testeable al 100% con fechas fijas (incluye bordes: cumplemes
  exacto, fin de mes).

- **DTOs zod con XOR de edad** — sirve a R4, R5, R13, R14.
  `CreatePetSchema` en `application/dto/create-pet.dto.ts` con
  `.superRefine()` que valida "exactamente uno de `birthDate` |
  `approxAgeMonths`"; `UpdatePetSchema = CreatePetSchema.partial()` (PATCH
  semántico, `docs/conventions.md` §DTOs) + su propio refine "no ambos a la
  vez" (en PATCH, cero de los dos es válido — significa "no toco la
  edad"). Validación en el borde HTTP antes de invocar el use case →
  atomicidad de R13 gratis (misma técnica que `PATCH /v1/me` en #4).
  Límites concretos: `name` 1-120, `approxAgeMonths` entero 0-480,
  `weightKg` (0, 999.99] (tope de `numeric(5,2)`), `sex` enum
  `male|female`, `size` enum `small|medium|large`, `microchip` ≤ 32 chars.

- **Al persistir un cambio de edad en PATCH, el campo no enviado se pone
  NULL** — sirve a R14. Sin esta regla una mascota podría quedar con
  `birth_date` y `approx_age_months` simultáneos y R6 tendría dos fuentes
  de verdad. `birth_date` gana precedencia en el cálculo (R6), pero el
  estado con ambos no nulos es simplemente inalcanzable.

- **Contrato de perfil congelado en un mapper único** — sirve a R8 (y
  criterio 5). `infrastructure/mappers/pet-profile-response.mapper.ts`
  lista explícitamente las 24 claves de R8, con `device`, `nextVaccine`,
  `nextReminder`, `activitySummary` y `photoUrl` como `null` literales y
  comentario apuntando a la feature que rellenará cada uno (#7, #14, #16,
  #10, #6). Las features posteriores editan **este mapper** (sustituyen un
  `null` por un valor) sin tocar controller ni use cases — el contrato
  HTTP no cambia de forma. Serialización con lista explícita de campos,
  nunca la entidad completa (mismo principio que #3/#4).

- **`PetRepository`: una interface, seis métodos** — sirve a R2, R7, R8,
  R9, R13, R16. En `domain/repositories/pet.repository.ts` (token
  `PET_REPOSITORY = Symbol(...)`, convención de tokens del proyecto):
  `createWithOwner(data, ownerId)`, `findMembership(petId, userId)`,
  `findAllByMember(userId)` (join pets ⋈ pet_users activo, devuelve pet +
  role), `findById(petId)`, `update(petId, changes)`, `delete(petId)`.
  No se crea un `PetMembershipRepository` separado: la membresía no tiene
  casos de uso propios todavía (gestión de miembros está fuera de
  alcance) y una interface evita el ping-pong de tokens.

- **Errores de dominio** — sirve a R9 (capa use case). `pet.errors.ts`
  define `PetNotFoundError` para el caso borde en que el guard aprobó pero
  la fila desapareció antes del `findById` del handler (delete
  concurrente) — el controller lo mapea a `NotFoundException` con el mismo
  body genérico de R9. Los rechazos del guard no usan errores de dominio
  (el guard es infraestructura pura).

- **Auditoría de update/delete** — sirve a R15, R16. Mismo patrón que
  `user.update` (#4): `meta` con nombres de campos, sin valores;
  `pet.delete` sin `meta` (el `entityId` basta). Body `{}` en PATCH →
  no-op 200 sin auditar, espejo exacto de R13 de `auth-login-me`.

## Estructura de capas

```
backend-pet-tracker/src/
├── db/schema/
│   ├── pets.schema.ts                     [nuevo: tablas pets + pet_users]
│   └── index.ts                           [editado: re-exporta pets.schema]
│
└── modules/pets/                          [módulo nuevo completo]
    ├── domain/
    │   ├── entities/pet.entity.ts         ← Pet + calculateAgeMonths (puro)
    │   ├── entities/pet-membership.ts     ← tipo PetMembership + PetRole
    │   ├── errors/pet.errors.ts           ← PetNotFoundError
    │   └── repositories/pet.repository.ts ← interface + PET_REPOSITORY
    ├── application/
    │   ├── dto/create-pet.dto.ts          ← CreatePetSchema (zod, XOR edad)
    │   ├── dto/update-pet.dto.ts          ← UpdatePetSchema (.partial())
    │   └── use-cases/
    │       ├── create-pet.use-case.ts     ← transacción vía repo + audit
    │       ├── list-pets.use-case.ts
    │       ├── get-pet.use-case.ts
    │       ├── update-pet.use-case.ts     ← diff de campos + audit
    │       └── delete-pet.use-case.ts     ← delete + audit
    ├── infrastructure/
    │   ├── decorators/require-pet-role.decorator.ts
    │   ├── guards/pet-access.guard.ts
    │   ├── mappers/pet-profile-response.mapper.ts
    │   ├── repositories/pet.drizzle.repository.ts
    │   └── pets.controller.ts             ← CRUD /v1/pets
    └── pets.module.ts                     ← providers + exporta guard,
                                              decorador y PET_REPOSITORY
```

## Archivos afectados

- `backend-pet-tracker/src/db/schema/pets.schema.ts` — nuevo,
  infraestructura compartida (tablas `pets` + `pet_users`)
- `backend-pet-tracker/src/db/schema/index.ts` — editado: re-exporta el
  schema nuevo
- `backend-pet-tracker/src/db/migrations/` — migración nueva generada por
  `drizzle-kit generate` (solo `pets` + `pet_users`; **cero** cambios a
  `audit_log`)
- `backend-pet-tracker/src/modules/pets/**` — módulo nuevo completo, las 3
  capas (árbol de arriba)
- `backend-pet-tracker/src/app.module.ts` — editado: importa `PetsModule`
- `backend-pet-tracker/test/pets.e2e-spec.ts` — nuevo: e2e del CRUD, del
  IDOR (R9, obligatorio por acceptance criteria) y del 403 por rol (R11,
  sembrando `pet_users` directo)

Sin variables de entorno nuevas y sin dependencias nuevas (`uuidv7`, `zod`
y `drizzle-orm` ya están en `package.json`).

## Alternativas descartadas

- **Columna `owner_id` en `pets` en vez de tabla `pet_users`**: descartado
  — brief §4 exige permisos por mascota multi-usuario (familiar, paseador,
  veterinario); un owner escalar no modela membresías y habría que migrar
  en #6+. `pet_users` es el mecanismo de autorización de todas las
  features posteriores desde el día uno.
- **`PetAccessGuard` global (`APP_GUARD`)**: descartado — solo tiene
  sentido en rutas con `:petId`; global exigiría mantener una lista de
  exclusión creciente (auth, users, health, alerts...) que invierte la
  carga de la prueba y se olvida fácil.
- **`AuditLogger` transaction-aware (`record(entry, tx?)`)**: descartado —
  el tipo del contexto transaccional (Drizzle `tx`) contaminaría un puerto
  de dominio compartido por todos los módulos; el costo lo pagarían
  features que no lo necesitan. Ver decisión abierta en "Auditoría
  `pet.create` tras el commit".
- **Insertar `audit_log` directo desde `PetDrizzleRepository` dentro de la
  transacción**: descartado como diseño por defecto — bypasea el puerto
  `AuditLogger` que la feature ordena reutilizar; queda como plan B
  explícito si el gate humano exige auditoría intra-transacción.
- **`403` para no-miembros**: descartado — brief §4 lo prohíbe de facto:
  un 403 confirma que el `petId` existe (IDOR de enumeración). 404
  indistinguible es requisito, no estilo.
- **Devolver `404` también para rol insuficiente** (en vez de 403):
  descartado — el criterio 4 de `feature_list.json` pide `403` explícito,
  y un miembro ya conoce la existencia de la mascota (no hay filtración).
- **Persistir `age_months` y recalcular con un cron**: descartado — la
  edad es derivable al vuelo de datos ya presentes (R6); materializarla
  crea drift y un job para un cálculo de microsegundos.
- **Dos endpoints separados para birthDate/approxAgeMonths o permitir
  ambos**: descartado — ambigüedad de fuente de verdad; XOR en el DTO +
  NULL cruzado en PATCH mantiene un solo origen del cálculo de edad.
- **Interceptor NestJS en vez de guard para la membresía**: descartado —
  la autorización debe cortar **antes** de entrar al handler; guards son
  el mecanismo idiomático y ya hay precedente (`AuthGuard`).
- **Módulo `memberships` separado**: descartado por ahora — sin casos de
  uso de gestión de miembros (fuera de alcance) sería una carpeta con una
  tabla; si la feature de invitaciones llega, se extrae entonces.
