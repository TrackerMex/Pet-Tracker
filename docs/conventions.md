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

**Un solo escritor sobre el working tree.** La branch la crea el `leader` en el
paso 1; a partir de ahí, mientras Codex implementa, nadie más commitea ni hace
`checkout` en otra terminal. El tree es uno solo y ya costó un rescate: un
`checkout main` simultáneo dejó el commit de una spec en `main`. Si hace falta
solapar, `git worktree`.

**No hay excepción por tipo de cambio**: `main` está protegida y rechaza el
push directo. Lo que no toca código de la app (harness, `docs/`, `specs/`,
`progress/`, `feature_list.json` en fase de spec) va igualmente por branch —
`docs/<tema>` o `update-status-<id>` — y PR, solo que sin esperar al reviewer.

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
| `SIM_MODE` | Selección del cliente Wialon: cualquier valor distinto de `false` ⇒ simulador `FakeWialonClient` (default dev: fake) | en `.env.example` — consumida desde `wialon-ingestion-pipeline` (#8): `src/integrations/wialon/wialon.factory.ts` vía `ConfigService` |
| `SIM_SEED` | Semilla entera del simulador determinista (default 1) — misma semilla + intervalo ⇒ mismas posiciones | en `.env.example` — consumida desde #8, misma vía que `SIM_MODE` |
| `SIM_HOME_LAT` / `SIM_HOME_LNG` | Punto de arranque del paseo simulado (default CDMX 19.4326 / -99.1332) | en `.env.example` — consumidas desde #8, misma vía que `SIM_MODE` |
| `WIALON_TOKEN` | Token de la API real de Wialon. Ausente, vacío o `PENDING` ⇒ fake aunque `SIM_MODE=false` | en `.env.example` — consumida desde #8, misma vía que `SIM_MODE`. Sustituye al SSM del plan 005 en local |
| `WIALON_BASE_URL` | Endpoint de la API Wialon (default `https://hst-api.wialon.com/wialon/ajax.html`) | en `.env.example` — consumida desde #8, misma vía que `SIM_MODE` |
| `POLLER_ENABLED` | Arranque de los workers de ingesta (`true` agenda cron 1 min + consumidor; default `false`; con `NODE_ENV=test` nunca se agendan) | en `.env.example` (con `true` para que la cadena local funcione out-of-the-box, D11) — consumida desde #8: `src/workers/ingestion-scheduler.service.ts` vía `ConfigService` |
| `ACTIVITY_AGGREGATOR_ENABLED` | Arranque del agregador de actividad (`true` agenda un tick de 1 h que computa el último día local cerrado de cada owner y lo upsertea en `activity_daily`; default `false`; con `NODE_ENV=test` nunca se agenda). No reutiliza `POLLER_ENABLED`: son dos workers con ciclos de vida distintos (D7) | en `.env.example` (con `true`, mismo criterio que `POLLER_ENABLED`) — consumida desde `trips-activity` (#10): `src/modules/activity/infrastructure/activity-scheduler.service.ts` vía `ConfigService` |
| `ALERTS_ENGINE_ENABLED` | Arranque del worker de alerts-engine (`true` agenda cron de 1 min que drena `geofence-events`, evalúa geocercas y cierra `battery_low`; default `false`; con `NODE_ENV=test` nunca se agenda, R17). Variable propia, mismo patrón que `POLLER_ENABLED`/`ACTIVITY_AGGREGATOR_ENABLED` | en `.env.example` (con `true`, mismo criterio) — consumida desde `alerts-engine` (#12): `src/workers/alerts-engine/alerts-engine-scheduler.service.ts` vía `ConfigService` |
| `NOTIFIER_ENABLED` | Arranque del worker notifier (`true` agenda cron de 1 min que drena la cola `notifications` y notifica a los miembros activos de la mascota; default `false`; con `NODE_ENV=test` nunca se agenda, R15). Cuarta variable de gate y no `ALERTS_ENGINE_ENABLED` (D6): el notifier se puede querer apagado con el motor encendido, y al revés | en `.env.example` (con `true`, mismo criterio) — consumida desde `alerts-center-notifier` (#13): `src/workers/notifier/notifier-scheduler.service.ts` vía `ConfigService` |
| `REMINDERS_ENABLED` | Arranque del dispatcher local de recordatorios (`true` agenda un tick de 1 min que encola reminders vencidos en `notifications`; default `false`; con `NODE_ENV=test` nunca se agenda, R12) | en `.env.example` (con `true`, mismo criterio) — consumida desde `pet-reminders` (#16): `src/modules/reminders/infrastructure/reminders-scheduler.service.ts` vía `ConfigService` |
| `PUSH_ENABLED` | Envío push real por Expo. Cualquier valor distinto de `'true'` (default local, sin development build de EAS): `ConsolePushSender` escribe en un log estructurado el payload que se habría enviado, con el token **redactado** (R9/R13), y no se instancia `expo-server-sdk`. Con `'true'`: `ExpoPushSender` (R11/R12). Mismo patrón que `EMAIL_ENABLED` de #3 — la rama vive solo en el `useFactory` de `NotifierModule` | en `.env.example` (con `false`) — consumida desde `alerts-center-notifier` (#13): `src/workers/notifier/notifier.module.ts` vía `ConfigService` |
| `AWS_MODE` | Modo de construcción de los 4 clientes AWS SDK v3. Cualquier valor distinto de `aws` (incluida su ausencia) ⇒ `local`: endpoint `AWS_ENDPOINT_URL`, par estático `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`, `forcePathStyle` en S3 y `MissingAwsEndpointError` como red de seguridad. Con `aws`: sin endpoint y sin credentials explícitas, resuelve el SDK por su cadena por defecto (`~/.aws/`, `AWS_PROFILE`, sesión de `aws login` — variables que la app nunca lee); `AWS_REGION` se pasa solo si tiene valor. `runProvisioning` aborta con exit 1 en modo `aws` | en `.env.example` (con `local`) — consumida desde `aws-real-credentials` (#19): `src/aws/aws-clients.ts` vía `ConfigService` y vía `process.env` en el script standalone (misma excepción documentada que `AWS_ENDPOINT_URL`) |
| `AWS_PRESIGN_ENDPOINT_URL` | Endpoint con el que se **firman** las URLs prefirmadas de S3 en modo local (`http://<IP LAN>:4566`; `http://10.0.2.2:4566` para el emulador Android). Solo la lee `resolveAwsConfigFromConfigService` y solo aplica al `S3Client` — el único que firma URLs para terceros; ausente o vacía ⇒ se firma con `AWS_ENDPOINT_URL` (comportamiento previo); con `AWS_MODE=aws` se ignora. El valor depende de la IP LAN de cada máquina, igual que `EXPO_PUBLIC_API_URL` | comentada en `.env.example` — consumida desde `localstack-presigned-url-lan-host` (#57): `src/aws/aws-clients.ts` vía `ConfigService` |
| `GOOGLE_MAPS_API_KEY_ANDROID` | Clave de Maps SDK for Android inyectada por la config dinámica de Expo. No lleva prefijo `EXPO_PUBLIC_`, para que Expo no la inlinee en el bundle JS; ausente o vacía solo avisa y omite el plugin | en `mobile-pet-tracker/.env.example` (sin valor) — consumida en build time por `mobile-pet-tracker/app.config.ts`; la clave real vive únicamente en el `.env` móvil ignorado por git |

---

## Convenciones de la app móvil

La app Expo vive en `mobile-pet-tracker/` como una isla gestionada con **bun**;
sus dependencias, scripts y lockfile se administran desde esa carpeta, sin
mezclarlos con el workspace pnpm de backend e infraestructura.

> **Carta de UI**: las decisiones de diseño visual, tokens, componentes
> compartidos, `@expo/ui` y animación viven en `docs/ui-guidelines.md`
> (desde PR #73; gate C8 de `CHECKPOINTS.md`). Esta sección fija estructura
> y proceso; ante solape, cada regla vive en un solo sitio: layout y
> estructura aquí, visual y motion en la carta.

- Los componentes nuevos se estilizan solo con `className` y los tokens de
  `src/theme/global.css`. Quedan prohibidos `StyleSheet.create` y los colores
  hexadecimales dentro de componentes nuevos.
- **HeroUI Native** es la base de componentes de interfaz. Los iconos salen de
  `reicon-react-native`.
- Las animaciones se implementan con **Reanimated 4**. Motion/motion.dev no se
  usa porque no soporta React Native.
- Los tests usan **jest-expo** y cada test que cubre una spec nombra su R-id,
  igual que las suites del backend.
- **Estructura Expo oficial** (pedido del humano, 2026-08-25; skill
  `expo:expo-project-structure`): desde la feature #39 toda pantalla nueva
  sigue el patrón *route file delgado + screen body*:
  - `src/app/…/<ruta>.tsx` contiene SOLO la ruta: lee params y renderiza
    `<X />` desde `src/screens/<nombre>/index.tsx`.
  - El cuerpo vive en `src/screens/<nombre>/` (kebab-case); sus
    sub-componentes privados se colocan en esa misma carpeta, NO en
    `src/components/` (ahí solo lo reutilizado entre pantallas).
  - Helpers sueltos nuevos van en `src/utils/` con su test colocado al
    lado (`format-date.ts` + `format-date.test.ts`); los tests de screens
    nuevas se colocan junto al screen body.
  - Las pantallas anteriores a #39 NO se migran en frío: se mueven a este
    patrón solo cuando una feature las toque de fondo.
- **Dimensiones de pantalla uniformes** (pedido del humano en el smoke de
  #38, 2026-08-25): toda pantalla nueva usa las mismas métricas de layout
  que `home.tsx` — `contentContainerStyle` con `paddingTop: insets.top + 12`,
  `padding: 24`, `gap: 16` y `paddingBottom: insets.bottom + 96`
  (`useSafeAreaInsets`). Los estados de carga usan `Skeleton` dimensionados
  como el contenido final, nunca un spinner suelto que haga saltar el
  layout. El selector de mascota es siempre el componente compartido
  `src/components/pet-switcher.tsx`.
