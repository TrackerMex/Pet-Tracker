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

## Imports / alias de rutas

- `tsconfig.json` define `@/* -> src/*`. **Usar el alias `@/...` para
  cualquier import que cruce de módulo/feature o de capa dentro del mismo
  módulo** (ej. `@/db/drizzle.constants`,
  `@/modules/auth/domain/ports/password-hasher` desde `application/`) —
  evita cadenas `../../` frágiles al mover archivos. Import relativo (`./`,
  `../`) solo dentro de la misma capa (ej. `use-case` importando un helper
  hermano en `application/`).
- El alias está resuelto en las 3 rutas de ejecución del proyecto — no
  requiere configuración adicional por feature:
  - **Build** (`pnpm run build`): `nest build && tsc-alias -p
    tsconfig.build.json` — `tsc-alias` reescribe `@/...` a rutas relativas
    en el JS compilado (`tsc` no lo hace solo).
  - **Tests** (`pnpm test` / `pnpm run test:e2e`): `moduleNameMapper` en el
    bloque `jest` de `package.json` y en `test/jest-e2e.json`
    (`"^@/(.*)$": "<rootDir>/$1"`, ajustado al `rootDir` de cada config).
  - **Scripts standalone fuera de Nest** (ej. `drizzle.config.ts`, futuros
    scripts en `scripts/`): si el script importa algo de `src/` via `@/`,
    ejecutarlo con `ts-node -r tsconfig-paths/register <script>` (paquete
    `tsconfig-paths` ya está en `devDependencies`).
- La feature `db-setup-drizzle` (#1) se implementó **antes** de que esta
  convención quedara documentada y usa imports relativos en todo `src/`
  (incluye una cadena `../../../../db/drizzle.constants`); no se corrigió
  retroactivamente. Todo código nuevo debe seguir la regla del alias de
  aquí en adelante.
- Historial de la regla: hasta 2026-08-01 el salto de capa dentro del mismo
  módulo permitía import relativo (`../../domain/...`); se endureció a alias
  por decisión humana y `src/modules/auth/` se refactorizó para cumplirla.

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

- Librería: **zod** (`class-validator`/`class-transformer` no se instalaron —
  decisión 2026-07-30: `zod` en su lugar). Cada DTO se define como un
  `z.object({...})` + `type XDto = z.infer<typeof XSchema>`; la validación
  corre explícita en el controller (`schema.parse(body)`, que lanza
  `ZodError` en input inválido) o vía un `ZodValidationPipe` propio del
  proyecto (a introducir cuando la primera feature con DTOs lo necesite) —
  NestJS no trae soporte nativo de Zod como sí lo tiene con `ValidationPipe`
  + class-validator, así que el pipe/mapeo de errores es responsabilidad de
  este proyecto.
- DTO de creación: schema con campos requeridos (`z.string()`, `z.number()`,
  etc., sin `.optional()`).
- DTO de actualización: `CreateXSchema.partial()` (PATCH semántico — todos
  los campos opcionales), en vez de `PartialType` de `@nestjs/mapped-types`.
- Los DTOs (schemas + tipos inferidos) viven en `application/dto/` y no
  salen de la capa application: el controller los recibe, el use case los
  consume, el domain nunca los ve.
- Un `ZodError` capturado en el borde HTTP se mapea a `BadRequestException`
  (400) — mismo contrato que la fila "Datos inválidos" de la tabla de
  errores más abajo, solo cambia quién lo produce.

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
| Datos inválidos | — (lo produce el parseo del schema `zod`) | `BadRequestException` | 400 |

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

## Branches y Pull Requests

El código de features **nunca** va directo a `main` — siempre por PR, que un
humano revisa y mergea. CI (`.github/workflows/ci.yml`) ejecuta `init.sh` en
cada PR y debe estar verde antes del merge.

Flujo por feature (arranca tras el gate humano de la spec, ver `AGENTS.md` §3):

1. Desde `main` actualizado (`git checkout main && git pull`), crear branch
   `feature/<id>-<nombre>` (ej: `feature/1-db-setup-drizzle`).
2. Todo el trabajo de la feature se commitea en esa branch: código, tests,
   specs, `feature_list.json` → `done`, `STATUS.md`, `progress/`.
3. Con el reviewer aprobado e `init.sh` verde: push y
   `gh pr create --title "feat(<feature>): <resumen>" --body "..."`.
   El body enlaza `specs/<feature>/` y lista los R-ids cubiertos.
4. **PARA.** El humano revisa y mergea el PR en GitHub. Ningún agente mergea.
5. Tras el merge: `git checkout main && git pull` antes de la siguiente feature.

**Excepción**: cambios que no tocan código de la app (harness, `docs/`,
`specs/`, `progress/`, `feature_list.json` en fase de spec) pueden ir directo
a `main`.

---

## Variables de entorno

Toda variable nueva se añade a esta tabla y a `.env.example` en el mismo
commit que la introduce (regla dura de `AGENTS.md` §4). Acceso vía
`@nestjs/config` (`ConfigService`), nunca `process.env` directo fuera de la
configuración.

El `.env` vive en la **raíz del repo** (docker-compose e `init.sh` lo leen
desde ahí). Como la app corre en `backend-pet-tracker/`, el `ConfigModule`
debe cargarlo con `envFilePath: ['../.env']`.

| Variable | Para qué | Estado |
|---|---|---|
| `DATABASE_URL` | Connection string de Postgres (Docker local) | en `.env.example` — la app la consume desde la primera feature con persistencia |
| `PORT` | Puerto HTTP del backend (default 3000) | en `.env.example` |
| `AWS_ENDPOINT_URL` | Endpoint de LocalStack (`http://localhost:4566`) | en `.env.example` — consumida desde `localstack-provisioning` (#2): `src/aws/` vía `ConfigService`, `scripts/provision-local.ts` vía `process.env` (excepción documentada, ver `specs/localstack-provisioning/design.md`) |
| `AWS_REGION` | Región AWS para SDK contra LocalStack | en `.env.example` — consumida desde `localstack-provisioning` (#2), misma vía que `AWS_ENDPOINT_URL` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Credenciales dummy para LocalStack (valor `test`) | en `.env.example` — consumidas desde `localstack-provisioning` (#2), misma vía que `AWS_ENDPOINT_URL` |
| `EMAIL_ENABLED` | Envío real de email de verificación. `false` (default local, sin SES): `ConsoleEmailVerificationSender` escribe el token en un log estructurado en vez de enviarlo | en `.env.example` — consumida desde `auth-registration` (#3): `src/modules/auth/infrastructure/email/` vía `ConfigService` |
| `JWT_SECRET` | Clave HS256 para firmar/verificar los `access_token` del login propio | en `.env.example` — consumida desde `auth-login-me` (#4): `src/modules/auth/infrastructure/security/jwt-token-service.ts` vía `ConfigService` |
