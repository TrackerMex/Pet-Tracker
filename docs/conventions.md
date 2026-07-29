# Conventions — pet-tracker

> Reglas de estilo, nombres y patrones que todo el código de este proyecto
> debe seguir. Cuando tengas duda sobre cómo hacer algo, busca aquí primero.
>
> Stack: NestJS + TypeScript + pnpm | PostgreSQL + Drizzle | Jest.
> Estructura de carpetas por capa: `docs/architecture.md`.

---

## Nombres de archivos

Todo en kebab-case. Sufijo indica el rol del archivo.

| Tipo | Patrón | Ejemplo |
|---|---|---|
| Entidad de dominio | `<nombre>.entity.ts` | `pet.entity.ts` |
| Errores de dominio | `<nombre>.errors.ts` | `pet.errors.ts` |
| Interface de repositorio | `<nombre>.repository.ts` | `pet.repository.ts` |
| Caso de uso | `<accion>-<nombre>.use-case.ts` | `register-pet.use-case.ts` |
| DTO | `<accion>-<nombre>.dto.ts` | `create-pet.dto.ts` |
| Schema Drizzle | `<module>.schema.ts` (en `src/db/schema/`) | `pets.schema.ts` |
| Repositorio Drizzle | `<nombre>.drizzle.repository.ts` | `pet.drizzle.repository.ts` |
| Controller | `<nombre>.controller.ts` | `pet.controller.ts` |
| Mapper (opcional) | `<nombre>.mapper.ts` | `pet.mapper.ts` |
| Module NestJS | `<feature>.module.ts` | `pets.module.ts` |
| Guard | `<nombre>.guard.ts` | `jwt-auth.guard.ts` |
| Test unitario | `<archivo>.spec.ts` (junto al archivo) | `register-pet.use-case.spec.ts` |
| Test e2e | `test/<feature>.e2e-spec.ts` | `test/pets.e2e-spec.ts` |

En la base de datos: tablas y columnas en `snake_case`, tablas en plural
(`pets`, `weight_entries`). El schema Drizzle mapea explícitamente
(`ownerId: uuid('owner_id')`).

---

## Tokens de inyección / resolución de dependencias

Los casos de uso dependen de interfaces, no de implementaciones. NestJS borra
las interfaces en runtime, así que cada interface de repositorio exporta su
token junto a ella:

```typescript
// domain/repositories/pet.repository.ts
export const PET_REPOSITORY = Symbol('PetRepository');

export interface PetRepository {
  findByOwner(ownerId: string): Promise<Pet[]>;
}
```

**Regla**: el token se define UNA vez (junto a la interface) y se importa en
el `@Inject(...)` y en el `provide:` del module. Nunca strings literales
re-tecleados — un typo compila y explota en runtime.

```typescript
// application/use-cases/register-pet.use-case.ts
constructor(@Inject(PET_REPOSITORY) private readonly pets: PetRepository) {}

// pets.module.ts
{ provide: PET_REPOSITORY, useClass: PetDrizzleRepository }
```

La conexión Drizzle se inyecta con el token `DRIZZLE` exportado por
`src/db/drizzle.module.ts`.

---

## DTOs / validación de entrada

- Librería: **class-validator + class-transformer**, con `ValidationPipe`
  global en `main.ts`: `{ whitelist: true, forbidNonWhitelisted: true,
  transform: true }`.
- DTO de creación: campos requeridos con decoradores de validación.
- DTO de actualización: `PartialType(CreateXDto)` de `@nestjs/mapped-types`
  (PATCH semántico — todos los campos opcionales).
- Los DTOs viven en `application/dto/` y no salen de la capa application:
  el controller los recibe, el use case los consume, el domain nunca los ve.

---

## Manejo de errores

El domain y la application lanzan **errores de dominio tipados**
(`domain/errors/`), sin imports de `@nestjs/common`. El controller (o un
exception filter) los mapea a HTTP:

| Situación | Error de dominio (ejemplo) | HTTP en controller | Código |
|---|---|---|---|
| Recurso no encontrado | `PetNotFoundError` | `NotFoundException` | 404 |
| Conflicto (email duplicado) | `EmailAlreadyRegisteredError` | `ConflictException` | 409 |
| Sin autenticación | — (lo produce el guard) | `UnauthorizedException` | 401 |
| Recurso de otro dueño | `NotPetOwnerError` | `ForbiddenException` | 403 |
| Datos inválidos | — (lo produce `ValidationPipe`) | `BadRequestException` | 400 |

**Regla**: nunca lanzar `HttpException` desde domain o application; nunca
dejar que un error de Drizzle/pg llegue crudo al cliente.

---

## Tests

- Framework: **Jest** (unitario) + **supertest** (e2e).
- Unitarios junto al archivo (`*.spec.ts`); e2e en `test/*.e2e-spec.ts`.
- Los use cases se testean con mocks de la interface del repositorio — sin
  base de datos. Los repositorios Drizzle se cubren en e2e contra Postgres.
- Cada test que cubre un requisito de la spec nombra su R-id (disciplina
  completa en `docs/verification.md`):

```
describe('R1: <resumen del requisito>', () => { ... })
```

---

## Commits

Conventional commits, en inglés:

```
feat(<scope>): <descripción> (R1,R2)
fix(<scope>): <descripción> (R3)
refactor(<scope>): <descripción>
```

El `<scope>` es el nombre de la feature o módulo. Los R-ids referencian los
requisitos de `specs/<feature>/requirements.md` que ese commit satisface.

---

## Variables de entorno

Toda variable nueva se añade a esta tabla y a `.env.example` en el mismo
commit que la introduce (regla dura de `AGENTS.md` §4). Acceso vía
`@nestjs/config` (`ConfigService`), nunca `process.env` directo fuera de la
configuración.

| Variable | Para qué | Estado |
|---|---|---|
| `DATABASE_URL` | Connection string de Postgres (Docker local) | planificada — la introduce la primera feature con persistencia |
| `PORT` | Puerto HTTP del backend (default 3000) | planificada |
